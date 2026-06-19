import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сложение и вычитание смешанных чисел — frac_5_15 (v2)
// --- ИЗ infrastructure_v1 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen/NumInputScreen) ---

// ============================================================
// ПАЛИТРА
// ============================================================
const T = {
  bg: '#F6F4EF',
  ink: '#0E0E10',
  ink2: '#5A5A60',
  ink3: '#A7A6A2',
  paper: '#FFFFFF',
  accent: '#FF4F28',
  accentSoft: '#FFE8E1',
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  blue: '#019ACB',
  shadowBase: '58, 53, 48'
};

// ============================================================
// КОНФИГ УРОКА (props от LMS) — модульный, ставится корневым компонентом.
// Движок/SFX/AI читают отсюда; экраны не нужно перепровязывать.
// ============================================================
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS: {base}/api/tts?text=<теги+текст, encoded>&g=m|f
// Если в тексте уже есть языковой тег (смешанные языки) — свой не добавляем.
function buildTtsUrl(base, text, lang, gender) {
  const tag = LANG_TAG[lang] || LANG_TAG.ru;
  const raw = String(text);
  const tagged = TAG_RE.test(raw) ? raw : `${tag} ${raw}`;
  const enc = encodeURIComponent(tagged.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

// SFX — короткие звуки верно/неверно, URL из ttsConfig (correctSoundUrl/wrongSoundUrl).
function useSfx() {
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { correctSoundUrl, wrongSoundUrl } = ttsConfig;
    if (correctSoundUrl) { const a = new Audio(correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; correctRef.current = a; }
    if (wrongSoundUrl)   { const a = new Audio(wrongSoundUrl);   a.preload = 'auto'; a.volume = 0.6; wrongRef.current = a; }
    return () => {
      try { correctRef.current && correctRef.current.pause(); } catch (e) {}
      try { wrongRef.current && wrongRef.current.pause(); } catch (e) {}
      correctRef.current = null; wrongRef.current = null;
    };
  }, []);
  const play = useCallback((kind) => {
    const ref = kind === 'correct' ? correctRef : wrongRef;
    const a = ref.current; if (!a) { playChime(kind === 'correct'); return; }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }, []);
  return { playCorrect: () => play('correct'), playWrong: () => play('wrong') };
}

// Неречевой сигнал (фолбэк SFX в preview / игры закрепления).
let _chimeCtx = null;
function playChime(ok) {
  try {
    if (typeof window === 'undefined') return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    _chimeCtx = _chimeCtx || new AC();
    const ctx = _chimeCtx; if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const notes = ok ? [660, 880] : [320, 240];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const t0 = now + i * 0.12;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0 + 0.2);
    });
  } catch (e) { /* no-op */ }
}

// AI-проверка открытых ответов — единственный разрешённый fetch (кроме <audio>.src).
// Возвращает { correct, feedback, transcript? } или бросает.
async function gradeAnswer({ screenIdx, question, rubric, lang, mode, answerText, audioBlob }) {
  const endpoint = ttsConfig.aiGradingEndpoint;
  if (!endpoint) throw new Error('No grading endpoint configured');
  const lessonId = (typeof LESSON_META !== 'undefined' && LESSON_META.lessonId) || '';
  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId); fd.append('screenIdx', String(screenIdx));
    fd.append('question', question || ''); fd.append('rubric', rubric || '');
    fd.append('lang', lang); fd.append('mode', 'voice');
    if (audioBlob) fd.append('audio', audioBlob, 'answer.webm');
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, screenIdx, question: question || '', rubric: rubric || '', lang, mode: 'text', answerText: answerText || '' }),
    });
  }
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') throw new Error('Malformed grading response');
  return data;
}

// ============================================================
// LANGUAGE CONTEXT + useT
// ============================================================
const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string') return stripAudioTags(node);
    if (React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return stripAudioTags(node[lang]);
    return stripAudioTags(node.ru ?? '');
  }, [lang]);
};

// ============================================================
// useIsMobile (design_system 5.0)
// ============================================================
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ============================================================
// AUDIO ENGINE
// ============================================================
class AudioEngine {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.onStateChange = null;
    this.waitingFor = null;
    this.currentLang = 'ru';
    this.gender = 'm';
    this.autoplayBlocked = false;
    this.audioEl = null;
  }

  ensureEl() {
    if (this.audioEl || typeof window === 'undefined') return this.audioEl;
    const el = new Audio();
    el.crossOrigin = 'anonymous';
    el.preload = 'auto';
    this.audioEl = el;
    return el;
  }

  setLang(lang) { this.currentLang = lang; }

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
  }

  playSegment(segment) {
    if (!segment) return;
    const base = ttsConfig.ttsApiBase;
    // Нет текста → пропускаем (логика очереди сохраняется).
    if (!segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
    // База НЕ пришла от LMS → этап разработки (artifacts). Озвучка через браузерный
    // Web Speech (preview-стендин, «корявый» голос). На платформе эта ветка мёртвая:
    // LMS всегда передаёт ttsApiBase, и тогда идёт HTTP-ветка ниже.
    // speechSynthesis запрещён контрактом в БОЕВОЙ ветке (platform_contract §4);
    // здесь он допустим как preview-стендин — согласовано с разработчиком платформы (июнь 2026).
    if (!base) { this.playSegmentPreview(segment); return; }
    const el = this.ensureEl();
    if (!el) { setTimeout(() => this.handleSegmentEnd(segment), 0); return; }

    el.onended = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    el.onerror = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };

    const lang = segment.lang || this.currentLang;
    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, lang, gender);
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        this.autoplayBlocked = false;
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
      }).catch(() => {
        // автоплей заблокирован браузером — ждём первого жеста
        this.autoplayBlocked = true;
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      });
    }
  }

  // PREVIEW-ВЕТКА (только при пустом ttsApiBase, т.е. вне LMS): браузерный Web Speech.
  // НЕ копировать как боевой транспорт — на платформе всегда идёт HTTP-ветка playSegment.
  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.handleSegmentEnd(segment), 0); return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    // тег языка/настроения на экран и в Web Speech не нужен — снимаем
    const clean = stripAudioTags(String(segment.text));
    const u = new SpeechSynthesisUtterance(clean);
    const lang = segment.lang || this.currentLang;
    u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
    u.rate = 0.95; u.pitch = 1.0;
    u.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
    };
    u.onend = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    u.onerror = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      this.handleSegmentEnd(segment);
    };
    this.previewUtterance = u;
    setTimeout(() => { try { synth.speak(u); } catch (e) { this.handleSegmentEnd(segment); } }, 60);
  }

  // Возобновление после блокировки автоплея (по первому жесту).
  resumeIfBlocked() {
    if (!this.autoplayBlocked) return;
    this.autoplayBlocked = false;
    this.playSegment(this.queue[this.currentIdx]);
  }

  handleSegmentEnd(segment) {
    if (segment && segment.waits_for) {
      this.waitingFor = segment.waits_for;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: segment.waits_for });
    } else {
      this.currentIdx++;
      this.playNext();
    }
  }

  playNext() {
    if (this.currentIdx >= this.queue.length) return;
    this.playSegment(this.queue[this.currentIdx]);
  }

  start() {
    this.currentIdx = 0;
    this.waitingFor = null;
    this.playNext();
  }

  triggerEvent(eventType, target) {
    if (!this.waitingFor) return;
    const matches = this.waitingFor.type === eventType &&
                   (this.waitingFor.target === target || !this.waitingFor.target);
    if (matches) {
      this.waitingFor = null;
      this.currentIdx++;
      this.playNext();
    }
  }

  triggerInternalEvent(eventName) {
    const nextIdx = this.queue.findIndex((s, i) => i >= this.currentIdx && s.trigger === `on_event:${eventName}`);
    if (nextIdx !== -1) {
      this.currentIdx = nextIdx;
      this.waitingFor = null;
      this.playNext();
    }
  }

  pushOneOff(text, gender) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: 'manual', waits_for: null, g: gender });
    this.currentIdx = this.queue.length - 1;
    this.playNext();
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }

  stop() {
    if (this.audioEl) {
      try { this.audioEl.pause(); this.audioEl.onended = null; this.audioEl.onerror = null; } catch (e) {}
    }
    // preview-ветка: гасим браузерную озвучку
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);

  // Стабилизация segments по содержимому, не по ссылке (без этого cancel-loop, звук молчит)
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.onStateChange = (s) => setState(prev => ({ ...prev, ...s }));
    // Возобновление по первому жесту, если браузер заблокировал автоплей.
    const resume = () => { if (engineRef.current) engineRef.current.resumeIfBlocked(); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    if (stableSegments && stableSegments.length > 0 && !state.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
        engine.stop();
      };
    }
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      engine.stop();
    };
  // eslint-disable-next-line
  }, [stableSegments, lang]);

  const triggerEvent = useCallback((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const triggerInternal = useCallback((eventName) => {
    if (engineRef.current) engineRef.current.triggerInternalEvent(eventName);
  }, []);
  const replay = useCallback(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.muted;
      if (newMuted && engineRef.current) engineRef.current.stop();
      return { ...prev, muted: newMuted };
    });
  }, []);

  return { ...state, triggerEvent, triggerInternal, replay, toggleMute };
}

// Хелпер: построить audio-segments для экрана из CONTENT
const makeAudioSegments = (screenContent, lang) => {
  if (Array.isArray(screenContent.audio?.[lang])) {
    return screenContent.audio[lang].map((text, i) => ({
      id: `aud_${i}`,
      text,
      trigger: i === 0 ? 'on_mount' : (i === 1 ? 'after_previous' : `on_event:step_${i - 1}`),
      waits_for: i < screenContent.audio[lang].length - 1
        ? { type: 'button_click', target: 'step' }
        : { type: 'button_click', target: 'next' }
    }));
  }
  const text = screenContent.audio?.[lang];
  if (!text) return [];
  return [{ id: 'aud_0', text, trigger: 'on_mount', waits_for: null }];
};

// ============================================================
// БАЗОВЫЕ КОМПОНЕНТЫ
// ============================================================
const Op = React.memo(({ children, size = 'mid' }) => {
  const fontSize = size === 'big' ? 'clamp(25px, 4.7vw, 38px)' :
                   size === 'mid' ? 'clamp(16px, 3vw, 27px)' :
                   'clamp(12px, 2.1vw, 18px)';
  return <span className="mop" style={{ fontSize }}>{children}</span>;
});

const Frac = React.memo(({ n, d, color, size = 'sm' }) => (
  <span className={`frac frac-${size}`} style={{ color }}>
    <span className="n">{n}</span>
    <span className="bar"/>
    <span className="d">{d}</span>
  </span>
));

// mt: рендерит текст, заменяя «a/b» (и «?/b») настоящей дробью Frac — без слэша.
// Если дробей нет, возвращает строку как есть. Применяется во всех видимых текстах.
const FRAC_RE = /(\d+|\?)\/(\d+)/g;
const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (s.indexOf('/') === -1) return s;
  const out = []; let last = 0; let m; let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<Frac key={`mtf${key}`} n={m[1]} d={m[2]} size="sm"/>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};

const AudioIndicator = ({ audioState }) => {
  const { isPlaying, muted, replay, toggleMute } = audioState;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={toggleMute} title={muted ? 'Sound on' : 'Sound off'}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: muted ? T.ink3 : (isPlaying ? T.accent : T.ink2) }}>
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
      {!muted && (
        <button onClick={replay} title="Replay"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: T.ink2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>
      )}
    </div>
  );
};

const FeedbackBlock = ({ show, isCorrect, wrongClass, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (show) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 350);
      }));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(timer);
    }
  }, [show]);
  if (!mounted) return null;
  return (
    <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}>
      <div className={isCorrect ? 'frame-success' : (wrongClass || 'frame-soft')}>{children}</div>
    </div>
  );
};

// Slider — компонент v15 с track-wrap + track-bg + track-fill + glow
const Slider = ({ value, min, max, step = 1, onChange, disabled = false }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="track-wrap">
      <div className="track-bg"/>
      <div className="track-fill" style={{ width: `${pct}%` }}/>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input"
      />
    </div>
  );
};

// Stage — progress + chrome вынесены в отдельный stage-header (sticky, flex-shrink: 0)
const Stage = ({ children, eyebrow, screen, totalScreens, navContent, audioState }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const padH = isMobile ? 12 : 100;
  return (
    <div className="stage">
      <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }}/>
        </div>
        <div className="chrome">
          <div className="chrome-left eyebrow">
            <span className="dot"/>
            <span>{t(eyebrow)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {audioState && <AudioIndicator audioState={audioState}/>}
            <div className="mono small" style={{ color: T.ink, fontWeight: 700, fontSize: 14 }}>
              {String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
      <div className="stage-content" style={{ paddingLeft: padH, paddingRight: padH }}>
        {children}
      </div>
      {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
    </div>
  );
};

const NavBack = ({ onPrev, label = 'Назад' }) => (
  <button className="btn-ghost" onClick={onPrev}
    style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
    {label}
  </button>
);

const NavNext = ({ disabled, label, onClick }) => (
  <button className="btn-white-accent" disabled={disabled} onClick={onClick}
    style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>
    {label}
  </button>
);

const NextLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Davom etish' : 'Дальше';
};

const BackLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Orqaga' : 'Назад';
};

// ============================================================
// QUESTION SCREEN — универсальный MC-компонент под формат audio: { intro, on_correct, on_wrong }
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();

  const audio = useAudio([{
    id: `s${idx}_intro`,
    text: c.audio.intro[lang],
    trigger: 'on_mount',
    waits_for: { type: 'option_picked' }
  }]);

  // Веди-до-верного: экран НЕ блокируется на первом ответе.
  // Неверный гаснет и отключается, остальные активны, «Дальше» — только когда выбран верный.
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);  // текущий показываемый вариант
  const [wrong, setWrong]   = useState(() => new Set());                // погашенные неверные
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);

  const pick = (i) => {
    if (solved) return;        // после верного — заблокировано
    if (wrong.has(i)) return;  // уже погашенный неверный — игнор
    const isCorrect = i === correctIdx;

    if (firstTryRef.current === null) {   // фиксируем первую попытку (аналитика)
      firstTryRef.current = isCorrect;
      firstIdxRef.current = i;
    }
    attemptsRef.current += 1;
    setPicked(i);

    if (!introAdvancedRef.current) {      // продвинуть intro-очередь один раз
      introAdvancedRef.current = true;
      audio.triggerEvent('option_picked');
    }

    if (isCorrect) {
      setSolved(true);
      sfx.playCorrect();
      onAnswer({
        stage: screenMeta?.scope ?? null,
        screenIdx: idx,
        question: typeof question === 'string' ? question : null,
        options: options.map(o => typeof o === 'string' ? o : null),
        correctIndex: correctIdx,
        correctAnswer: typeof options[correctIdx] === 'string' ? options[correctIdx] : null,
        studentAnswerIndex: firstIdxRef.current,                                   // ПЕРВЫЙ выбор
        studentAnswer: typeof options[firstIdxRef.current] === 'string' ? options[firstIdxRef.current] : null,
        correct: firstTryRef.current,                                              // верность ПЕРВОЙ попытки
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true
      });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }

    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || c.audio.on_wrong[lang];
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            if (solved) {
              if (i === correctIdx) cls += ' option-correct';
              else if (isWrongPicked) cls += ' option-picked-wrong';
              else cls += ' option-wrong';
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && i === correctIdx ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {mt(solved ? t(c.correct_text) : t(c[`hint_${picked}`] || c[`wrong_${picked}`] || c.wrong_default))}
          </p>
        </FeedbackBlock>
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// ============================================================
// NUM INPUT SCREEN — числовой ввод: веди-до-верного + наводящая подсказка, счёт первой попытки.
// ============================================================
const NumInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();
  const correct = Number(correctValue);
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [value, setValue] = useState(wasSolved ? String(correct) : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = parseFloat(String(value).trim().replace(',', '.')); if (isNaN(v)) return;
    const isCorrect = Math.abs(v - correct) < 1e-9;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(v); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: String(correct), studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c.audio_hint && c.audio_hint[lang]) || (c.hint && c.hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="fade-up">{c.title && <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>}<h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {c.base && <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 }}>{t(c.base)}</span>}
          {c.base && <span className="mop">≈</span>}
          <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-soft fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// --- ПОД УРОК: frac_5_15 — Сложение и вычитание смешанных чисел (v2, PROMPT 2026-06-13) ---
// Изменения v2: s1 spaced-retrieval warm-up; смысловые linker-связки между экранами (4-A);
// тип-микс тестов (MC / fill-blank / NumInput / drag / find-the-wrong); крупные fact-анимации
// + меньше текста; ambient-движение на пустых экранах; prefers-reduced-motion; ✓/✗ feedback;
// устойчивая проверка ответа по значению. Визуализатор DiskCombine + hook NumberJump.
// ============================================================
const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'frac-5-15-v1',
  lessonTitle: { ru: 'Сложение и вычитание смешанных чисел', uz: "Aralash sonlarni qo'shish va ayirish" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'review',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // fill-blank
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // drag-match
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // find-the-wrong
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // case solve
  { id: 's14', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's15', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // ── s0 HOOK (анимация NumberJump) ────────────────────────────────
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Странный ответ', uz: "G'alati javob" },
    lead: { ru: 'Складываем 1 2/3 и 2 2/3. Целые дают 3, а дробные части 2/3 и 2/3 вместе дают 4/3.', uz: "1 2/3 va 2 2/3 ni qo'shamiz. Butunlar 3 beradi, kasr qismlari 2/3 va 2/3 esa birga 4/3 beradi." },
    objection: { ru: 'Но 4/3 больше одного целого. Значит, ответ 3 4/3 — уже готов?', uz: "Lekin 4/3 bitta butundan katta. Demak, 3 4/3 — tayyor javobmi?" },
    question: { ru: 'Можно так оставить?', uz: "Shu holida qoldirsa bo'ladimi?" },
    opt_yes: { ru: 'Да, 3 4/3 — это ответ', uz: "Ha, 3 4/3 — javob" },
    opt_no: { ru: 'Нет, 4/3 больше одного — нужно перенести в целое', uz: "Yo'q, uchdan to'rt birdan katta — butunga ko'chirish kerak" },
    opt_idk: { ru: 'Не уверен(а)', uz: "Ishonchim komil emas" },
    audio: { ru: 'Складываем один целый две третьих и два целых две третьих. Целые дают три, а дробные части вместе дают четыре третьих. Но это больше одного целого. Можно ли оставить ответ три целых и четыре третьих? Выбери.', uz: "Bir butun uchdan ikki va ikki butun uchdan ikkini qo'shamiz. Butunlar uch beradi, kasr qismlari esa birga uchdan to'rt beradi. Lekin bu bitta butundan katta. Javobni uch butun uchdan to'rt deb qoldirsa bo'ladimi? Tanlang." }
  },

  // ── s1 WARM-UP — spaced retrieval (прошлый урок: смешанное ↔ неправильная) ──
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    title: { ru: 'Снова смешанное число', uz: "Yana aralash son" },
    question: { ru: 'Помнишь прошлый урок? Запиши 5/3 смешанным числом.', uz: "O'tgan dars yodingizdami? 5/3 ni aralash son ko'rinishida yozing." },
    opt0: { ru: '1 2/3', uz: "1 2/3" },
    opt1: { ru: '2 1/3', uz: "2 1/3" },
    opt2: { ru: '1 1/3', uz: "1 1/3" },
    opt3: { ru: '5 1/3', uz: "5 1/3" },
    correct_text: { ru: 'Верно. Пять разделить на три — один целый, остаток два: один целый две третьих.', uz: "To'g'ri. Beshni uchga bo'lsak — bir butun, qoldiq ikki: bir butun uchdan ikki." },
    wrong_1: { ru: 'Целая часть одна, не две: тройка в пятёрке помещается один раз. Один целый две третьих.', uz: "Butun qism bitta, ikki emas: uchlik beshda bir marta joylashadi. Bir butun uchdan ikki." },
    wrong_2: { ru: 'Остаток два, не один: пять минус три это два. Один целый две третьих.', uz: "Qoldiq ikki, bir emas: besh minus uch ikki. Bir butun uchdan ikki." },
    wrong_3: { ru: 'Целая часть не равна пяти. Пять разделить на три даёт целую часть один.', uz: "Butun qism beshga teng emas. Beshni uchga bo'lsak butun bir chiqadi." },
    audio: {
      intro: { ru: 'Вспомни прошлый урок: мы переводили смешанные числа. Запиши пять третьих смешанным числом. Выбери вариант.', uz: "O'tgan darsni eslang: aralash sonlarni o'tkazgandik. Uchdan beshni aralash son qilib yozing. Variantni tanlang." },
      on_correct: { ru: 'Верно, один целый две третьих.', uz: "To'g'ri, bir butun uchdan ikki." },
      on_wrong: { ru: 'Не совсем. Раздели пять на три.', uz: "Unchalik emas. Beshni uchga bo'ling." }
    }
  },

  // ── s2 EXPLORATION: сложение по частям + перенос ──────────────────
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Сложение по частям', uz: "Qismlab qo'shish" },
    lead: { ru: 'Раз дроби помним — вернёмся к загадке. Соберём 1 2/3 и 2 2/3 по частям. Каждый круг — три доли.', uz: "Kasrni eslaganimizdan keyin topishmoqqa qaytamiz. 1 2/3 va 2 2/3 ni qismlab yig'amiz. Har doira — uchta ulush." },
    step_labels: {
      ru: ['Слева 1 2/3, справа 2 2/3.', 'Сначала целые круги: один и два — это три целых.', 'Теперь доли: 2/3 и 2/3 это 4/3. Три доли замыкаются в новый целый, остаётся 1/3. Итого 4 1/3.'],
      uz: ["Chapda 1 2/3, o'ngda 2 2/3.", "Avval butun doiralar: bir va ikki — uch butun.", "Endi ulushlar: 2/3 va 2/3 bu 4/3. Uchta ulush yangi butun bo'lib yopiladi, 1/3 qoladi. Jami 4 1/3."]
    },
    note: { ru: 'Вот он, перенос: доли набрались на целый круг — и этот круг ушёл к целым.', uz: "Mana u, ko'chirish: ulushlar to'liq doiraga yetdi va bu doira butunlarga o'tdi." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Раз дроби мы помним, вернёмся к загадке. Слева один целый две третьих, справа два целых две третьих. Нажми кнопку.',
        'Сначала целые круги. Один и два дают три целых.',
        'Теперь доли. Две третьих и две третьих дают четыре третьих. Три доли замыкаются в новый целый круг, остаётся одна третья. Этот круг переносим к целым. Получается четыре целых одна третья.'
      ],
      uz: [
        "Kasrni eslaganimiz uchun topishmoqqa qaytamiz. Chapda bir butun uchdan ikki, o'ngda ikki butun uchdan ikki. Tugmani bosing.",
        "Avval butun doiralar. Bir va ikki uch butun beradi.",
        "Endi ulushlar. Uchdan ikki va uchdan ikki uchdan to'rt beradi. Uchta ulush yangi butun doira bo'lib yopiladi, uchdan bir qoladi. Bu doirani butunlarga ko'chiramiz. To'rt butun uchdan bir bo'ladi."
      ]
    }
  },

  // ── s3 EXPLORATION: вычитание с займом ────────────────────────────
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Вычитание с займом', uz: "Qarz bilan ayirish" },
    lead: { ru: 'Это было сложение. А теперь вычитание: 3 1/4 минус 1 3/4. Каждый круг — четыре доли.', uz: "Bu qo'shish edi. Endi ayirish: 3 1/4 minus 1 3/4. Har doira — to'rtta ulush." },
    step_labels: {
      ru: ['Сверху 3 1/4, отнимаем 1 3/4.', 'Из 1/4 нельзя забрать 3/4 — доли не хватает.', 'Берём в долг целый круг и колем на доли: 2 целых и 5/4. Теперь 5/4 минус 3/4 это 2/4, и 2 минус 1 это 1. Итого 1 2/4.'],
      uz: ["Yuqorida 3 1/4, undan 1 3/4 ayiramiz.", "1/4 dan 3/4 ni olib bo'lmaydi, ulush yetmaydi.", "Bitta butun doirani qarzga olamiz va ulushga bo'lamiz: 2 butun va 5/4. Endi 5/4 minus 3/4 bu 2/4, va 2 minus 1 bu 1. Jami 1 2/4."]
    },
    note: { ru: 'Вот он, займ: целый круг раскололи на доли, чтобы хватило вычесть.', uz: "Mana u, qarz olish: ayirishga yetishi uchun butun doirani ulushlarga bo'ldik." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Это было сложение. Теперь вычитание. Сверху три целых одна четвёртая, отнимаем один целый три четвёртых.',
        'Дробные части. Из одной четвёртой нельзя забрать три четвёртых, не хватает долей.',
        'Тогда берём в долг один целый круг и колем на четыре доли. Получается два целых и пять четвёртых. Пять четвёртых минус три четвёртых дают две четвёртых. Целые два минус один дают один. Ответ один целый две четвёртых.'
      ],
      uz: [
        "Bu qo'shish edi. Endi ayirish. Yuqorida uch butun to'rtdan bir, undan bir butun to'rtdan uch ayiramiz.",
        "Kasr qismlar. To'rtdan birdan to'rtdan uchni olib bo'lmaydi, ulush yetmaydi.",
        "Unda bitta butun doirani qarzga olamiz va to'rtta ulushga bo'lamiz. Ikki butun va to'rtdan besh bo'ladi. To'rtdan besh minus to'rtdan uch to'rtdan ikki beradi. Butunlar ikki minus bir bir beradi. Javob bir butun to'rtdan ikki."
      ]
    }
  },

  // ── s4 EXPLORATION: разные знаменатели → общий ───────────────────
  s4: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Разные знаменатели', uz: "Har xil maxrajlar" },
    lead: { ru: 'До сих пор знаменатели были одинаковые. А если разные? Сложим 1 1/2 и 1 1/3.', uz: "Hozirgacha maxrajlar bir xil edi. Har xil bo'lsa-chi? 1 1/2 va 1 1/3 ni qo'shamiz." },
    step_labels: {
      ru: ['Доли разные: половинки и трети. Складывать разные доли нельзя.', 'Приведём обе к шестым: 1/2 это 3/6, а 1/3 это 2/6.', 'Теперь доли одинаковые: 3/6 плюс 2/6 это 5/6. Целые 1 и 1 это 2. Итого 2 5/6.'],
      uz: ["Ulushlar har xil: yarimlar va uchdan birlar. Har xil ulushlarni qo'shib bo'lmaydi.", "Ikkalasini oltidan ulushga keltiramiz: ikkidan bir bu oltidan uch, uchdan bir bu oltidan ikki.", "Endi ulushlar bir xil: oltidan uch qo'shuv oltidan ikki oltidan besh. Butunlar 1 va 1 ikki. Jami 2 5/6."]
    },
    note: { ru: 'Значит, разные доли сначала приводят к общему знаменателю, и только потом складывают.', uz: "Demak, har xil ulushlar avval umumiy maxrajga keltiriladi, keyingina qo'shiladi." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'До сих пор знаменатели были одинаковые. А теперь они разные: половинки и трети. Складывать разные доли нельзя.',
        'Приведём обе доли к шестым. Одна вторая это три шестых, одна третья это две шестых.',
        'Теперь доли одинаковые. Три шестых плюс две шестых дают пять шестых. Целые один и один дают два. Получается два целых пять шестых.'
      ],
      uz: [
        "Hozirgacha maxrajlar bir xil edi. Endi esa har xil: yarimlar va uchdan birlar. Har xil ulushlarni qo'shib bo'lmaydi.",
        "Ikkala ulushni ham oltidan ulushga keltiramiz. Ikkidan bir bu oltidan uch, uchdan bir bu oltidan ikki.",
        "Endi ulushlar bir xil. Oltidan uch qo'shuv oltidan ikki oltidan besh beradi. Butunlar bir va bir ikki beradi. Ikki butun oltidan besh bo'ladi."
      ]
    }
  },

  // ── s5 RULE сложение ──────────────────────────────────────────────
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Правило сложения', uz: "Qo'shish qoidasi" },
    rule_main: { ru: 'Соберём увиденное в правило. При сложении целые складывают с целыми, доли с долями. Разные знаменатели сначала приводят к общему.', uz: "Ko'rganlarimizni qoidaga yig'amiz. Qo'shishda butunlar butunlarga, ulushlar ulushlarga qo'shiladi. Har xil maxrajlar avval umumiy maxrajga keltiriladi." },
    rule_note: { ru: 'А если дробная часть набралась на целый или больше — лишний целый переносят к целым.', uz: "Agar kasr qismi butunga yetsa yoki oshsa — ortiqcha butun butunlarga ko'chiriladi." },
    ex_left: { ru: '1 2/3 + 2 2/3', uz: "1 2/3 + 2 2/3" },
    ex_right: { ru: '4 1/3', uz: "4 1/3" },
    audio: { ru: 'Соберём увиденное в правило. При сложении смешанных чисел целые складывают с целыми, а доли с долями. Разные знаменатели сначала приводят к общему. А если дробная часть набралась на целый, лишний целый переносят к целым.', uz: "Ko'rganlarimizni qoidaga yig'amiz. Aralash sonlarni qo'shishda butunlar butunlarga, ulushlar ulushlarga qo'shiladi. Har xil maxrajlar avval umumiy maxrajga keltiriladi. Agar kasr qismi butunga yetsa, ortiqcha butun butunlarga ko'chiriladi." }
  },

  // ── s6 RULE вычитание + предупреждение ────────────────────────────
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Правило вычитания', uz: "Ayirish qoidasi" },
    rule_main: { ru: 'Сложение знаем. А в вычитании есть одна осторожность: если верхней доли не хватает — занимают один целый.', uz: "Qo'shishni bildik. Ayirishda esa bitta ehtiyotkorlik bor: yuqori ulush yetmasa — bitta butun qarzga olinadi." },
    warning_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warning: { ru: 'Если верхняя дробь меньше нижней, нельзя просто переставить их местами. Сначала нужно занять один целый.', uz: "Agar yuqori kasr pastdagidan kichik bo'lsa, ularning o'rnini almashtirib bo'lmaydi. Avval bitta butun qarzga olinadi." },
    audio: { ru: 'Сложение мы знаем. В вычитании из целого вычитают целое, из доли долю, разные знаменатели приводят к общему. Но есть осторожность: если верхней доли не хватает, занимают один целый. Не переставляй дроби местами.', uz: "Qo'shishni bilamiz. Ayirishda butundan butun, ulushdan ulush ayiriladi, har xil maxrajlar umumiy maxrajga keltiriladi. Lekin ehtiyotkorlik bor: yuqori ulush yetmasa, bitta butun qarzga olinadi. Kasrlarning o'rnini almashtirmang." }
  },

  // ── s7 TEST MC: сложение без переноса ─────────────────────────────
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Сложи сам', uz: "O'zingiz qo'shing" },
    question: { ru: 'Теперь сам. Сколько будет 2 1/5 + 1 2/5?', uz: "Endi o'zingiz. 2 1/5 + 1 2/5 nechaga teng?" },
    opt0: { ru: '3 3/5', uz: "3 3/5" },
    opt1: { ru: '3 3/10', uz: "3 3/10" },
    opt2: { ru: '3 1/5', uz: "3 1/5" },
    opt3: { ru: '2 3/5', uz: "2 3/5" },
    correct_text: { ru: 'Верно. Целые 2 и 1 это 3. Доли 1/5 и 2/5 это 3/5. Получается 3 3/5.', uz: "To'g'ri. Butunlar 2 va 1 bu 3. Ulushlar beshdan bir va beshdan ikki beshdan uch. 3 3/5 bo'ladi." },
    wrong_1: { ru: 'Знаменатели не складывают. Доли одинаковые, поэтому складывают только числители: 1/5 плюс 2/5 это 3/5.', uz: "Maxrajlar qo'shilmaydi. Ulushlar bir xil, shuning uchun faqat suratlar qo'shiladi: beshdan bir qo'shuv beshdan ikki beshdan uch." },
    wrong_2: { ru: 'Сложили только одну долю. Складывают обе: 1/5 плюс 2/5 это 3/5.', uz: "Faqat bitta ulush qo'shildi. Ikkalasi qo'shiladi: beshdan bir qo'shuv beshdan ikki beshdan uch." },
    wrong_3: { ru: 'Целые тоже складывают: 2 плюс 1 это 3. Ответ 3 3/5.', uz: "Butunlar ham qo'shiladi: 2 qo'shuv 1 bu 3. Javob 3 3/5." },
    audio: {
      intro: { ru: 'Теперь сам сложи два целых одна пятая и один целый две пятых. Выбери вариант.', uz: "Endi o'zingiz ikki butun beshdan bir va bir butun beshdan ikkini qo'shing. Variantni tanlang." },
      on_correct: { ru: 'Верно. Три целых три пятых.', uz: "To'g'ri. Uch butun beshdan uch." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s8 TEST fill-in-blank: сложение с переносом, разные знаменатели + Факт ──
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Заполни пропуск', uz: "Bo'sh joyni to'ldiring" },
    lead: { ru: 'Продолжаем. На этот раз заполни пустую клетку ответа.', uz: "Davom etamiz. Bu safar javobning bo'sh katagini to'ldiring." },
    question: { ru: '1 1/2 + 2 3/4 = ?', uz: "1 1/2 + 2 3/4 = ?" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Приведи 1/2 к четвёртым: это 2/4. Тогда 2/4 плюс 3/4 это 5/4 — один целый и одна четвёртая. Числитель дробной части равен 1.', uz: "Ikkidan birni to'rtdan ulushga keltiring: bu to'rtdan ikki. Unda to'rtdan ikki qo'shuv to'rtdan uch to'rtdan besh — bir butun va to'rtdan bir. Kasr qismining surati birga teng." },
    fb_correct: { ru: 'Верно. 5/4 это один целый и 1/4, целых стало 4, в дробной части 1.', uz: "To'g'ri. To'rtdan besh bu bir butun va to'rtdan bir, butun 4 bo'ldi, kasr qismida 1." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" },
      text: { ru: 'Горизонтальную черту дроби ввёл в двенадцатом веке математик аль-Хассар.', uz: "Kasrning gorizontal chizig'ini o'n ikkinchi asrda matematik al-Hassar joriy qilgan." }
    },
    audio: {
      intro: { ru: 'Сложи один целый одна вторая и два целых три четвёртых. Знаменатели разные. Введи числитель дробной части ответа и нажми проверить.', uz: "Bir butun ikkidan bir va ikki butun to'rtdan uchni qo'shing. Maxrajlar har xil. Javob kasr qismining suratini kiriting va tekshirishni bosing." },
      on_correct: { ru: 'Верно, четыре целых одна четвёртая. Кстати, черту дроби придумал аль-Хассар.', uz: "To'g'ri, to'rt butun to'rtdan bir. Aytgancha, kasr chizig'ini al-Hassar o'ylab topgan." },
      on_wrong: { ru: 'Пока нет. Сначала приведи половину к четвёртым.', uz: "Hali emas. Avval yarimni to'rtdan ulushga keltiring." }
    }
  },

  // ── s9 TEST NumInput: вычитание разных знаменателей без займа ──────
  s9: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Теперь вычти', uz: "Endi ayiring" },
    question: { ru: 'Хорошо. Теперь вычитание: 3 1/2 минус 1 1/4. Сколько четвёртых долей в дробной части ответа?', uz: "Yaxshi. Endi ayirish: 3 1/2 minus 1 1/4. Javobning kasr qismida nechta to'rtdan ulush bor?" },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Приведи 1/2 к четвёртым: это 2/4. Потом 2/4 минус 1/4.', uz: "Ikkidan birni to'rtdan ulushga keltiring: bu to'rtdan ikki. Keyin to'rtdan ikki minus to'rtdan bir." },
    fb_correct: { ru: 'Верно. 1/2 это 2/4, и 2/4 минус 1/4 это 1/4. Одна четвёртая доля, целая часть 2.', uz: "To'g'ri. Ikkidan bir bu to'rtdan ikki, to'rtdan ikki minus to'rtdan bir to'rtdan bir. Bitta to'rtdan ulush, butun qismi 2." },
    audio: {
      intro: { ru: 'Хорошо, теперь вычитание. Три целых одна вторая минус один целый одна четвёртая. Сколько четвёртых долей останется в дробной части? Введи ответ и нажми проверить.', uz: "Yaxshi, endi ayirish. Uch butun ikkidan bir minus bir butun to'rtdan bir. Kasr qismida nechta to'rtdan ulush qoladi? Javobni kiriting va tekshirishni bosing." },
      on_correct: { ru: 'Верно, одна четвёртая.', uz: "To'g'ri, to'rtdan bir." },
      on_wrong: { ru: 'Пока нет. Сначала приведи половину к четвёртым.', uz: "Hali emas. Avval yarimni to'rtdan ulushga keltiring." }
    }
  },

  // ── s10 TEST drag-and-drop ────────────────────────────────────────
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Соедини пары', uz: "Juftlarni ulang" },
    instruction: { ru: 'Соединим всё вместе: перетащи каждое выражение к его результату, потом нажми проверить.', uz: "Hammasini birlashtiramiz: har ifodani natijasiga torting, keyin tekshirishni bosing." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    ok_text: { ru: 'Всё расставлено. Проверь себя кнопкой.', uz: "Hammasi joylashtirildi. Tugma bilan o'zingizni tekshiring." },
    wrong_text: { ru: 'Что-то не на месте — оно вернулось. Поправь и проверь снова.', uz: "Nimadir joyida emas — u qaytdi. To'g'rilang va qayta tekshiring." },
    done_text: { ru: 'Всё верно. При сложении лишнюю долю переносят, при вычитании занимают целый.', uz: "Hammasi to'g'ri. Qo'shishda ortiqcha ulush ko'chiriladi, ayirishda butun qarzga olinadi." },
    hint: { ru: 'Сначала вычисли каждое выражение, потом тащи к результату.', uz: "Avval har ifodani hisoblang, keyin natijaga torting." },
    audio: {
      intro: { ru: 'Соединим всё вместе. Сопоставь каждое выражение с его результатом. Выражение можно перетащить или нажать, а потом выбрать результат. Когда расставишь все три, нажми проверить.', uz: "Hammasini birlashtiramiz. Har ifodani natijasiga moslang. Ifodani tortish yoki bosib, keyin natijani tanlash mumkin. Uchalasini joylashtirgach, tekshirishni bosing." },
      on_correct: { ru: 'Верно. Все три совпали.', uz: "To'g'ri. Uchalasi mos keldi." },
      on_wrong: { ru: 'Не всё на месте. Посмотри, где перенос, а где займ.', uz: "Hammasi joyida emas. Qayerda ko'chirish, qayerda qarz ekanini ko'ring." }
    }
  },

  // ── s11 TEST find-the-wrong + Факт время ──────────────────────────
  s11: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    question_pre: { ru: 'А теперь наоборот. Какое утверждение про 4 1/3 минус 1 2/3', uz: "Endi teskari. 4 1/3 minus 1 2/3 haqidagi qaysi tasdiq" },
    question_em: { ru: 'неверное', uz: "noto'g'ri" },
    question_post: { ru: '?', uz: "?" },
    opt0: { ru: '4 1/3 минус 1 2/3 равно 2 2/3', uz: "4 1/3 minus 1 2/3 teng 2 2/3" },
    opt1: { ru: 'Нужно занять целый, ведь 1/3 меньше 2/3', uz: "Butun qarzga olish kerak, chunki uchdan bir uchdan ikkidan kichik" },
    opt2: { ru: '4 1/3 минус 1 2/3 равно 3 1/3', uz: "4 1/3 minus 1 2/3 teng 3 1/3" },
    opt3: { ru: 'После займа 1/3 превращается в 4/3', uz: "Qarzdan keyin uchdan bir uchdan to'rtga aylanadi" },
    correct_text: { ru: 'Верно нашёл. Это утверждение ошибочно: тут не заняли целый. Так как 1/3 меньше 2/3, ответ равен 2 2/3, а не 3 1/3.', uz: "To'g'ri topdingiz. Bu tasdiq xato: bunda butun qarzga olinmagan. Uchdan bir uchdan ikkidan kichik bo'lgani uchun javob 3 1/3 emas, 2 2/3 bo'ladi." },
    wrong_0: { ru: 'Это верно: ответ действительно 2 2/3. Ищи неверное.', uz: "Bu to'g'ri: javob haqiqatan 2 2/3. Noto'g'risini qidiring." },
    wrong_1: { ru: 'Это верно: 1/3 меньше 2/3, целый нужно занять. Проверь другое.', uz: "Bu to'g'ri: uchdan bir uchdan ikkidan kichik, butun qarzga olinadi. Boshqasini tekshiring." },
    wrong_3: { ru: 'Это тоже верно: после займа 1/3 становится 4/3. Неверное — другое.', uz: "Bu ham to'g'ri: qarzdan keyin uchdan bir uchdan to'rtga aylanadi. Noto'g'ri tasdiq — boshqasi." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" },
      text: { ru: 'Час делят на шестьдесят минут со времён Вавилона. Поэтому половина часа это тридцать минут.', uz: "Soat oltmish daqiqaga Bobil davridan bo'linadi. Shuning uchun yarim soat o'ttiz daqiqa." }
    },
    audio: {
      intro: { ru: 'А теперь наоборот: найди неверное утверждение. Какое из них ошибочное? Выбери вариант.', uz: "Endi teskari: noto'g'ri tasdiqni toping. Qaysi biri xato? Variantni tanlang." },
      on_correct: { ru: 'Верно. Тут не заняли целый. Кстати, половина часа это тридцать минут.', uz: "To'g'ri. Bunda butun qarzga olinmagan. Aytgancha, yarim soat o'ttiz daqiqa." },
      on_wrong: { ru: 'Это утверждение на самом деле верное. Ищи неверное.', uz: "Bu tasdiq aslida to'g'ri. Noto'g'risini qidiring." }
    }
  },

  // ── s12 CASE setup ────────────────────────────────────────────────
  s12: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Задача про гимнастику', uz: "Gimnastika haqida masala" },
    lead: { ru: 'Всё это нужно в жизни. Шахноза занималась гимнастикой два дня: в первый 1 1/3 часа, во второй 1 1/2 часа.', uz: "Bularning hammasi hayotda kerak. Shahnoza ikki kun gimnastika bilan shug'ullandi: birinchi kuni 1 1/3 soat, ikkinchi kuni 1 1/2 soat." },
    question_setup: { ru: 'Сколько всего времени она занималась?', uz: "Jami qancha vaqt shug'ullandi?" },
    btn_help: { ru: 'Помочь Шахнозе', uz: "Shahnozaga yordam berish" },
    audio: { ru: 'Всё это нужно в жизни. Шахноза занималась гимнастикой два дня. В первый день один целый одна третья часа, во второй один целый одна вторая часа. Знаменатели разные. Посчитаем, сколько всего времени.', uz: "Bularning hammasi hayotda kerak. Shahnoza ikki kun gimnastika bilan shug'ullandi. Birinchi kuni bir butun uchdan bir soat, ikkinchi kuni bir butun ikkidan bir soat. Maxrajlar har xil. Jami qancha vaqt bo'lganini hisoblaymiz." }
  },

  // ── s13 CASE solve (MC) + Факт время-как-смешанное ────────────────
  s13: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Помоги Шахнозе', uz: "Shahnozaga yordam bering" },
    question: { ru: 'Помоги Шахнозе: сколько всего времени она занималась?', uz: "Shahnozaga yordam bering: jami qancha vaqt shug'ullandi?" },
    opt0: { ru: '2 5/6 часа', uz: "2 5/6 soat" },
    opt1: { ru: '2 2/5 часа', uz: "2 2/5 soat" },
    opt2: { ru: '2 2/6 часа', uz: "2 2/6 soat" },
    opt3: { ru: '1 5/6 часа', uz: "1 5/6 soat" },
    correct_text: { ru: 'Верно. 1/3 это 2/6, 1/2 это 3/6. Доли 2/6 плюс 3/6 это 5/6. Целые 1 и 1 это 2. Итого 2 5/6 часа.', uz: "To'g'ri. Uchdan bir bu oltidan ikki, ikkidan bir bu oltidan uch. Ulushlar oltidan ikki qo'shuv oltidan uch oltidan besh. Butunlar 1 va 1 ikki. Jami 2 5/6 soat." },
    wrong_1: { ru: 'Знаменатели не складывают. Приведи к шестым: 1/3 это 2/6, 1/2 это 3/6, вместе 5/6.', uz: "Maxrajlar qo'shilmaydi. Oltidan ulushga keltiring: uchdan bir bu oltidan ikki, ikkidan bir bu oltidan uch, birga oltidan besh." },
    wrong_2: { ru: '1/3 привели к 2/6, но 1/2 тоже надо привести: это 3/6. Тогда 2/6 плюс 3/6 это 5/6.', uz: "Uchdan birni oltidan ikkiga keltirdingiz, lekin ikkidan birni ham keltirish kerak: bu oltidan uch. Unda oltidan ikki qo'shuv oltidan uch oltidan besh." },
    wrong_3: { ru: 'Один целый потеряли. Целых два: 1 плюс 1. Ответ 2 5/6 часа.', uz: "Bitta butun yo'qoldi. Butun ikkita: 1 qo'shuv 1. Javob 2 5/6 soat." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Время — само смешанное число: 2 5/6 часа это 2 часа и 50 минут.', uz: "Vaqtning o'zi aralash son: 2 5/6 soat bu 2 soat va 50 daqiqa." }
    },
    audio: {
      intro: { ru: 'Помоги Шахнозе. Сколько всего времени она занималась? Знаменатели разные. Выбери вариант.', uz: "Shahnozaga yordam bering. Jami qancha vaqt shug'ullandi? Maxrajlar har xil. Variantni tanlang." },
      on_correct: { ru: 'Верно, два целых пять шестых часа. Это два часа и пятьдесят минут.', uz: "To'g'ri, ikki butun oltidan besh soat. Bu ikki soat va ellik daqiqa." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s14 FINAL (MC) + Факт Архимед ─────────────────────────────────
  s14: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    title: { ru: 'Самое сложное', uz: "Eng qiyini" },
    question: { ru: 'И наконец, самое сложное — вычитание с займом: 3 1/4 минус 1 2/3?', uz: "Va nihoyat, eng qiyini — qarz bilan ayirish: 3 1/4 minus 1 2/3?" },
    opt0: { ru: '1 7/12', uz: "1 7/12" },
    opt1: { ru: '2 5/12', uz: "2 5/12" },
    opt2: { ru: '1 5/12', uz: "1 5/12" },
    opt3: { ru: '2 7/12', uz: "2 7/12" },
    correct_text: { ru: 'Верно. К двенадцатым: 1/4 это 3/12, 2/3 это 8/12. 3/12 меньше 8/12 — занимаем целый: 3 3/12 это 2 15/12. Тогда 15/12 минус 8/12 это 7/12, целые 2 минус 1 это 1. Итого 1 7/12.', uz: "To'g'ri. O'n ikkidan ulushga: to'rtdan bir bu o'n ikkidan uch, uchdan ikki bu o'n ikkidan sakkiz. O'n ikkidan uch o'n ikkidan sakkizdan kichik — butun qarzga olamiz: 3 3/12 bu 2 15/12. Unda o'n ikkidan o'n besh minus o'n ikkidan sakkiz o'n ikkidan yetti, butunlar 2 minus 1 bir. Jami 1 7/12." },
    wrong_1: { ru: 'Целый не заняли. 3/12 меньше 8/12, сначала занимают целый. Верный ответ 1 7/12.', uz: "Butun qarzga olinmadi. O'n ikkidan uch o'n ikkidan sakkizdan kichik, avval butun qarzga olinadi. To'g'ri javob 1 7/12." },
    wrong_2: { ru: 'Целая часть верна, а дробь нет. После займа 15/12 минус 8/12 это 7/12.', uz: "Butun qismi to'g'ri, lekin kasr noto'g'ri. Qarzdan keyin o'n ikkidan o'n besh minus o'n ikkidan sakkiz o'n ikkidan yetti." },
    wrong_3: { ru: 'Целые посчитали как 3 минус 1, забыв про займ. После займа целых остаётся 1. Ответ 1 7/12.', uz: "Butunlarni 3 minus 1 deb oldingiz, qarzni unutib. Qarz olingach butun 1 qoladi. Javob 1 7/12." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" },
      text: { ru: 'Архимед почти две тысячи лет назад оценил число пи как 3 1/7 — знаменитое смешанное число.', uz: "Arximed deyarli ikki ming yil oldin pi sonini 3 1/7 deb baholagan — mashhur aralash son." }
    },
    audio: {
      intro: { ru: 'И наконец самое сложное. Три целых одна четвёртая минус один целый две третьих. Знаменатели разные, и доли не хватит. Выбери вариант.', uz: "Va nihoyat eng qiyini. Uch butun to'rtdan bir minus bir butun uchdan ikki. Maxrajlar har xil, ulush ham yetmaydi. Variantni tanlang." },
      on_correct: { ru: 'Верно, один целый семь двенадцатых. Архимед оценил число пи как три целых одна седьмая.', uz: "To'g'ri, bir butun o'n ikkidan yetti. Arximed pi sonini uch butun yettidan bir deb baholagan." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s15 SUMMARY ───────────────────────────────────────────────────
  s15: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что ты теперь умеешь', uz: "Endi siz nimani bilasiz" },
    title: { ru: 'Итак, теперь ты умеешь складывать и вычитать смешанные числа.', uz: "Demak, endi siz aralash sonlarni qo'shish va ayirishni bilasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    points: {
      ru: [
        'Целые с целыми, доли с долями. Разные знаменатели сначала к общему.',
        'Дробь больше целого — лишний целый переносят. Доли не хватает при вычитании — занимают целый.',
        'Можно по частям или через неправильную дробь — ответ одинаковый.'
      ],
      uz: [
        "Butunlar butunlarga, ulushlar ulushlarga. Har xil maxrajlar avval umumiyga.",
        "Kasr butundan oshsa — ortiqcha butun ko'chiriladi. Ayirishda ulush yetmasa — butun qarzga olinadi.",
        "Qismlar bo'yicha yoki noto'g'ri kasr orqali — javob bir xil."
      ]
    },
    hook_close: { ru: 'Помнишь загадку? Оставить 3 4/3 нельзя: 4/3 больше целого, лишний целый переносят — и 1 2/3 плюс 2 2/3 равно 4 1/3.', uz: "Topishmoq yodingizdami? 3 4/3 ni qoldirib bo'lmaydi: uchdan to'rt butundan katta, ortiqcha butun ko'chiriladi — va 1 2/3 qo'shuv 2 2/3 to'rt butun uchdan bir bo'ladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Смешанные числа», «Перевод смешанного числа в неправильную дробь», «Сложение дробей с разными знаменателями».', uz: "«Aralash sonlar», «Aralash sonni noto'g'ri kasrga o'tkazish», «Har xil maxrajli kasrlarni qo'shish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'десятичные дроби — новая форма записи дробей.', uz: "o'nli kasrlar — kasrning yangi yozuv ko'rinishi." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Итак, сегодня мы научились складывать и вычитать смешанные числа. Целые с целыми, доли с долями, разные знаменатели к общему, лишний целый переносим, а если доли не хватает, занимаем целый. Дальше нас ждут десятичные дроби.', uz: "Demak, bugun aralash sonlarni qo'shish va ayirishni o'rgandik. Butunlarni butunlarga, ulushlarni ulushlarga, har xil maxrajlarni umumiyga, ortiqcha butunni ko'chiramiz, ulush yetmasa butun qarzga olamiz. Keyingi darsda o'nli kasrlar bizni kutadi." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_15: DiskCombine — смешанное число дисками-кругами.
// ============================================================
const dcWedge = (cx, cy, r, i, n) => {
  const a0 = -Math.PI / 2 + (2 * Math.PI * i) / n;
  const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / n;
  const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r.toFixed(2)},${r.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
};

const Disk = ({ slices, filled, color = T.accent, sz = 52, anim = false }) => {
  const c = sz / 2;
  const r = sz / 2 - 2.5;
  const full = filled >= slices && slices > 0;
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className={full ? 'dc-disk dc-disk-full' : 'dc-disk'}>
      {Array.from({ length: slices }).map((_, i) => (
        <path key={i} d={dcWedge(c, c, r, i, slices)}
          fill={i < filled ? (full ? T.success : color) : 'rgba(167, 166, 162, 0.16)'}
          stroke="#FFFFFF" strokeWidth="1.4"
          className={i < filled && anim ? 'dc-wedge-on' : undefined}
          style={anim ? { animationDelay: `${i * 0.06}s` } : undefined}/>
      ))}
      <circle cx={c} cy={c} r={r} fill="none" stroke={full ? T.success : 'rgba(167, 166, 162, 0.55)'} strokeWidth={full ? 2.4 : 1.4}/>
    </svg>
  );
};

const DiskCombine = ({ whole = 0, num = 0, den, color = T.accent, sz = 52, anim = false }) => (
  <span className="dc-row">
    {Array.from({ length: whole }).map((_, i) => <Disk key={`w${i}`} slices={den} filled={den} color={color} sz={sz} anim={anim}/>)}
    {num > 0 && <Disk slices={den} filled={Math.min(num, den)} color={color} sz={sz} anim={anim}/>}
  </span>
);

const MixNum = ({ whole, n, d, color }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    {whole > 0 && <span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', color: color || T.ink }}>{whole}</span>}
    {n > 0 && <Frac n={String(n)} d={String(d)} size="mid" color={color || T.ink}/>}
  </span>
);

// HOOK loop-анимация s0 (CSS-only, без state): маркер прыгает с 1 2/3 на +2 2/3, пересекая
// целые отметки 2, 3, 4, и приземляется на 4 1/3. Бесконечный цикл ~7с.
const NumberJump = () => (
  <div className="nj-wrap">
    <div className="nj-track">
      <div className="nj-line"/>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} className="nj-tick" style={{ left: `${(i / 5) * 100}%` }}>
          <span className="nj-tick-num mono small">{i}</span>
        </div>
      ))}
      <div className="nj-start"><MixNum whole={1} n={2} d={3} color={T.ink2}/></div>
      <div className="nj-land"><Op>=</Op><MixNum whole={4} n={1} d={3} color={T.success}/></div>
      <div className="nj-marker"><span className="nj-dot"/></div>
    </div>
    <div className="nj-cap">
      <MixNum whole={1} n={2} d={3} color={T.ink}/>
      <Op>+</Op>
      <MixNum whole={2} n={2} d={3} color={T.ink}/>
    </div>
  </div>
);

// Ambient-движение для разрежённых экранов (правила, summary): мягкие плавающие круги,
// pointer-events:none, низкая прозрачность, медленный loop. Декор, не отвлекает.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста (CSS-only, после верного).
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const AnimFracLine = () => (<div className="fa-fl"><span className="fa-fl-n">3</span><span className="fa-fl-bar"/><span className="fa-fl-n">4</span></div>);
const AnimClock = () => (<div className="fa-clk"><span className="fa-clk-fill"/><span className="fa-clk-h fa-clk-hm"/><span className="fa-clk-h fa-clk-hh"/><span className="fa-clk-c"/></div>);
const AnimPiDisk = () => (<div className="fa-pi"><i/><i/><i/><span className="fa-pi-q"/></div>);

const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge || FACT_BADGE)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

const optEl = (t, node) => <span className="body" style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>{mt(t(node))}</span>;

// Устойчивая проверка ответа ПО ЗНАЧЕНИЮ: целые/десятичные (0,5=0.5) и дроби (4/6=2/3, a*d==c*b).
const parseAnswerValue = (raw) => {
  const s = String(raw).trim().replace(',', '.');
  if (s === '') return null;
  const mf = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (mf) { const d = Number(mf[2]); if (d === 0) return null; return { n: Number(mf[1]), d }; }
  const num = Number(s);
  if (!isNaN(num)) return { n: num, d: 1 };
  return null;
};
const answerEq = (raw, target) => {
  const a = parseAnswerValue(raw); if (!a) return false;
  const t = parseAnswerValue(target); if (!t) return false;
  return a.n * t.d === t.n * a.d;
};

const DRAG_PAIRS = [
  { id: 'a', expr: '1 2/3 + 2 2/3', res: '4 1/3' },
  { id: 'b', expr: '1 1/2 + 1 1/3', res: '2 5/6' },
  { id: 'c', expr: '3 1/4 − 1 3/4', res: '1 2/4' },
];
const DRAG_SLOTS = ['2 5/6', '1 2/4', '4 1/3'];

// Иконки ✓/✗ — feedback не только цветом (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// s0 — HOOK (концептуальный) с анимацией NumberJump
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt_yes, c.opt_no, c.opt_idk];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
    setTimeout(() => onNext(), 650);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px) clamp(10px, 2vw, 16px)' }}>
          <NumberJump/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.objection))}</p>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — WARM-UP (spaced retrieval, не scored) через QuestionScreen
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// Универсальный exploration step-gated с DiskCombine (s2/s3/s4)
const ExplorationStep = ({ screen, onNext, onPrev, cKey, render }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT[cKey];
  const audio = useAudio(makeAudioSegments(c, lang));
  const segs = c.audio[lang] || c.audio.ru;
  const caps = c.step_labels[lang] || c.step_labels.ru;
  const STEPS = segs.length;
  const [step, setStep] = useState(0);
  const stepEndRef = useRef(null);
  const done = step >= STEPS - 1;
  const advance = () => { if (done) return; setStep(s => s + 1); audio.triggerEvent('button_click', 'step'); };
  useEffect(() => { if (stepEndRef.current) stepEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [step]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        {c.title && <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>}
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up dc-glow' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          {render(step, done)}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={advance} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p ref={stepEndRef} className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[step])}</p>
      </div>
    </Stage>
  );
};

const Screen2 = (props) => (
  <ExplorationStep {...props} cKey="s2" render={(step, done) => (<>
    {step < 2
      ? <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}><DiskCombine whole={1} num={2} den={3} sz={48}/><Op>+</Op><DiskCombine whole={2} num={2} den={3} sz={48}/></div>
      : <DiskCombine whole={4} num={1} den={3} sz={48} anim={true}/>}
    {step >= 1 && <MixNum whole={step >= 2 ? 4 : 3} n={step >= 2 ? 1 : 0} d={3} color={done ? T.success : T.ink}/>}
  </>)}/>
);

const Screen3 = (props) => (
  <ExplorationStep {...props} cKey="s3" render={(step, done) => (<>
    {step < 2
      ? <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}><DiskCombine whole={3} num={1} den={4} sz={46} color={step === 1 ? T.accent : T.ink2}/><Op>−</Op><MixNum whole={1} n={3} d={4} color={T.ink}/></div>
      : <DiskCombine whole={1} num={2} den={4} sz={48} anim={true}/>}
    {step >= 2 && <MixNum whole={1} n={2} d={4} color={done ? T.success : T.ink}/>}
  </>)}/>
);

const Screen4 = (props) => (
  <ExplorationStep {...props} cKey="s4" render={(step, done) => {
    const dL = step >= 1 ? 6 : 2, nL = step >= 1 ? 3 : 1;
    const dR = step >= 1 ? 6 : 3, nR = step >= 1 ? 2 : 1;
    return (<>
      {step < 2
        ? <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}><DiskCombine whole={1} num={nL} den={dL} sz={48} color={T.accent}/><Op>+</Op><DiskCombine whole={1} num={nR} den={dR} sz={48} color={T.blue}/></div>
        : <DiskCombine whole={2} num={5} den={6} sz={48} anim={true}/>}
      {step >= 1 && <MixNum whole={step >= 2 ? 2 : 0} n={step >= 2 ? 5 : 0} d={6} color={done ? T.success : T.ink}/>}
    </>);
  }}/>
);

// s5 — RULE 1 (сложение) + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MixNum whole={1} n={2} d={3} color={T.ink}/><Op>+</Op><MixNum whole={2} n={2} d={3} color={T.ink}/><Op>=</Op><MixNum whole={4} n={1} d={3} color={T.success}/>
          </div>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_note))}</p>
      </div>
    </Stage>
  );
};

// s6 — RULE 2 (вычитание + предупреждение) + ambient
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MixNum whole={3} n={1} d={4} color={T.ink}/><Op>=</Op><MixNum whole={2} n={5} d={4} color={T.accent}/>
          </div>
        </div>
        <div className="frame-soft fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.warning_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warning))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST MC: сложение без переноса (correct B)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 1, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — TEST fill-in-blank (scored, веди-до-верного, value-check) + Факт
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [value, setValue] = useState(wasSolved ? '1' : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    if (value.trim() === '') return;
    const isCorrect = answerEq(value, '1');
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = value.trim(); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.question[lang], correctAnswer: '1', studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.6vw, 14px)', flexWrap: 'wrap' }}>
          <MixNum whole={1} n={1} d={2} color={T.accent}/>
          <Op>+</Op>
          <MixNum whole={2} n={3} d={4} color={T.blue}/>
          <Op>=</Op>
          <span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', color: solved ? T.success : T.ink }}>4</span>
          <span className="fb-frac">
            <input type="number" inputMode="numeric" className={`fb-box ${solved ? 'correct' : ''}`} value={value} placeholder="0" disabled={solved}
              onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
              onKeyDown={e => e.key === 'Enter' && submit()}/>
            <span className="fb-bar"/>
            <span className="fb-den">4</span>
          </span>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#A07D14' }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
        {solved && <FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimFracLine/>}/>}
      </div>
    </Stage>
  );
};

// s9 — TEST NumInput: вычитание разных знаменателей без займа → 1
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={1}
    renderVisual={() => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <DiskCombine whole={3} num={1} den={2} sz={44} color={T.accent}/><Op>−</Op><DiskCombine whole={1} num={1} den={4} sz={44} color={T.blue}/>
      </div>
    )}/>;
};

// s10 — TEST drag-and-drop (scored, веди-до-верного)
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const slotExpr = DRAG_SLOTS.map(res => (DRAG_PAIRS.find(p => p.res === res) || {}).id);
  const wasSolved = storedAnswer?.solved === true;
  const [fill, setFill] = useState(() => { if (!wasSolved) return {}; const f = {}; slotExpr.forEach((id, s) => { f[s] = id; }); return f; });
  const [locked, setLocked] = useState(() => wasSolved ? new Set(DRAG_SLOTS.map((_, s) => s)) : new Set());
  const [sel, setSel] = useState(null);
  const [shake, setShake] = useState(false);
  const [drag, setDrag] = useState(null);
  const [feedback, setFeedback] = useState(wasSolved ? 'done' : null);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const slotRefs = useRef({});
  const shakeTimerRef = useRef(null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  useEffect(() => () => { if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current); }, []);
  const usedExprs = new Set(Object.values(fill));
  const pool = DRAG_PAIRS.filter(p => !usedExprs.has(p.id));
  const allPlaced = Object.keys(fill).length === DRAG_SLOTS.length;
  const done = locked.size === DRAG_SLOTS.length;

  const place = (exprId, slot) => {
    if (locked.has(slot)) return;
    setFill(prev => { const next = { ...prev }; Object.keys(next).forEach(s => { if (next[s] === exprId) delete next[s]; }); next[slot] = exprId; return next; });
    setSel(null); setFeedback(null);
  };
  const check = () => {
    if (!allPlaced || done) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    let allOk = true; const nextLocked = new Set(locked); const nextFill = { ...fill };
    DRAG_SLOTS.forEach((res, s) => { if (locked.has(s)) return; if (fill[s] === slotExpr[s]) nextLocked.add(s); else { allOk = false; delete nextFill[s]; } });
    attemptsRef.current += 1;
    if (firstTryRef.current === null) firstTryRef.current = allOk;
    setLocked(nextLocked); setFill(nextFill);
    if (allOk) {
      sfx.playCorrect(); setFeedback('done');
      onAnswer({ stage: SCREEN_META[10].scope, screenIdx: 10, question: c.instruction[lang], correctAnswer: 'match-all', studentAnswer: 'match', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
    } else {
      sfx.playWrong(); setFeedback('wrong'); setShake(true);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShake(false), 600);
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const onDown = (e, exprId) => { if (done) return; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} movedRef.current = false; startRef.current = { x: e.clientX, y: e.clientY }; setDrag({ id: exprId, dx: 0, dy: 0 }); };
  const onMove = (e) => { if (!drag) return; const dx = e.clientX - startRef.current.x, dy = e.clientY - startRef.current.y; if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movedRef.current = true; setDrag(d => d ? { ...d, dx, dy } : d); };
  const onUp = (e, exprId) => {
    if (!drag) return;
    if (!movedRef.current) { setSel(sel === exprId ? null : exprId); }
    else { let hit = null; DRAG_SLOTS.forEach((_, s) => { const el = slotRefs.current[s]; if (!el || locked.has(s)) return; const r = el.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hit = s; }); if (hit !== null) place(exprId, hit); }
    setDrag(null);
  };
  const slotTap = (s) => { if (locked.has(s)) return; if (sel !== null) place(sel, s); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.instruction))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DRAG_SLOTS.map((res, s) => {
            const placedId = fill[s]; const placed = placedId ? DRAG_PAIRS.find(p => p.id === placedId) : null; const isLocked = locked.has(s);
            return (
              <div key={s} ref={el => { slotRefs.current[s] = el; }} onClick={() => slotTap(s)}
                className={shake && placed && !isLocked ? 'dc-shake' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: 'clamp(8px, 1.4vw, 12px) clamp(12px, 2vw, 16px)', minHeight: 56,
                         background: isLocked ? T.successSoft : T.paper, cursor: sel !== null && !isLocked ? 'pointer' : 'default',
                         boxShadow: isLocked ? '0 8px 22px -6px rgba(31, 122, 77, 0.32)' : `0 6px 16px -6px rgba(${T.shadowBase}, 0.14)` }}>
                {isLocked && <span style={{ color: T.success, display: 'flex' }}><IconOk/></span>}
                <span style={{ flex: 1, minWidth: 100, minHeight: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {placed ? <span className="chip" style={{ background: isLocked ? T.success : T.ink, padding: '8px 14px', display: 'inline-flex', alignItems: 'center' }}>{mt(placed.expr)}</span> : <span className="mono small" style={{ color: T.ink3 }}>?</span>}
                </span>
                <Op>=</Op>
                <span style={{ minWidth: 64, display: 'flex', justifyContent: 'center' }}>{mt(res)}</span>
              </div>
            );
          })}
        </div>
        {!done && (
          <div className="fade-up delay-2" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', minHeight: 48 }}>
            {pool.map(p => (
              <button key={p.id} className="chip chip-pop" onPointerDown={(e) => onDown(e, p.id)} onPointerMove={onMove} onPointerUp={(e) => onUp(e, p.id)}
                style={{ padding: '10px 14px', background: T.accent, transform: drag && drag.id === p.id ? `translate(${drag.dx}px, ${drag.dy}px)` : 'none', zIndex: drag && drag.id === p.id ? 20 : 1, position: 'relative', touchAction: 'none', outline: sel === p.id ? `3px solid ${T.ink}` : 'none' }}>
                {mt(p.expr)}
              </button>
            ))}
          </div>
        )}
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: done ? T.success : (feedback === 'wrong' ? T.accent : T.ink2), fontWeight: done || feedback === 'wrong' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {done && <IconOk/>}{mt(t(done ? c.done_text : (feedback === 'wrong' ? c.wrong_text : (allPlaced ? c.ok_text : c.hint))))}
        </p>
        {!done && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — TEST find-the-wrong (correct C) + Факт
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.question_pre)} <span className="italic" style={{ color: T.accent }}>{t(c.question_em)}</span>{t(c.question_post)}</h2></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimClock/>}/>}/>;
};

// s12 — CASE setup
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 18px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <DiskCombine whole={1} num={1} den={3} sz={46} color={T.accent}/><Op>+</Op><DiskCombine whole={1} num={1} den={2} sz={46} color={T.blue}/>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.question_setup))}</h2>
      </div>
    </Stage>
  );
};

// s13 — CASE solve (MC, correct A) + Факт время
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimClock/>}/>}/>;
};

// s14 — FINAL (MC, correct D) + Факт Архимед
const Screen14 = (props) => {
  const t = useT(); const c = CONTENT.s14;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}><MixNum whole={3} n={1} d={4} color={T.accent}/><Op>−</Op><MixNum whole={1} n={2} d={3} color={T.blue}/></div></>);
  return <QuestionScreen {...props} idx={14} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[14]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimPiDisk/>}/>}/>;
};

// s15 — SUMMARY + закрытие hook + связи + ambient
const Screen15 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s15;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = c.points[lang] || c.points.ru;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MixNum whole={1} n={2} d={3} color={T.ink2}/><Op>+</Op><MixNum whole={2} n={2} d={3} color={T.ink2}/><Op>=</Op><MixNum whole={4} n={1} d={3} color={T.success}/>
          </div>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.hook_close))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function MixedOpsLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
  const scored = SCREEN_META.filter(s => s.scored);
  const finalScreens = scored.filter(s => s.scope === 'final');
  const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && a.correct).length;
  const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
  const payload = {
    lessonId: LESSON_META.lessonId,
    lessonTitle: LESSON_META.lessonTitle,
    durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
    totalQuestions: scored.length,
    correctAnswers: correctCount,
    scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
    finalScore: finalCorrect,
    finalTotal: finalScreens.length,
    passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
    firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
    answers: answers.filter(Boolean)
  };
  safeOnFinished(payload);
}, [answers, safeOnFinished]);

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  height: 100dvh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
}

/* Reset margins для типографики внутри урока */
.lesson-root h1,
.lesson-root h2,
.lesson-root h3,
.lesson-root h4,
.lesson-root h5,
.lesson-root h6,
.lesson-root p,
.lesson-root ul,
.lesson-root ol { margin: 0; padding: 0; }

.title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: "opsz" 60; }
.display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: "opsz" 60; }
.italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; font-variation-settings: "opsz" 60; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; font-weight: 400; }
.frac .n, .frac .d { padding: 0 0.12em; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }

@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
.delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }

/* === КНОПКИ v15 (тени вместо рамок) === */
.btn {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #0E0E10;
  color: #F6F4EF;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32);
}
.btn:hover:not(:disabled) {
  background: #FF4F28;
  box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45);
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-white-accent {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #FFFFFF;
  color: #FF4F28;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12);
}
.btn-white-accent:hover:not(:disabled) {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55);
}
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }

.btn-ghost {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #0E0E10;
  letter-spacing: 0.01em;
  border-radius: 12px;
  border: none;
  box-shadow: none;
}
.btn-ghost:hover:not(:disabled) {
  background: #FFFFFF;
  box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18);
}
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

/* === ОПЦИИ v15 (без рамок, на тенях) === */
.option {
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  text-align: left;
  border-radius: 12px;
  width: 100%;
  border: none;
  color: #0E0E10;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.option:hover:not(:disabled) {
  background: #FDFBF7;
  box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22);
}
.option:disabled { cursor: default; }
.option-correct {
  background: #E3F0E8 !important;
  color: #1F7A4D !important;
  box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important;
}
.option-wrong {
  background: #FFFFFF !important;
  color: #A7A6A2 !important;
  opacity: 0.55 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important;
}
.option-picked-wrong {
  background: #FFE8E1 !important;
  color: #FF4F28 !important;
  box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important;
}

/* === ТИПОГРАФИКА v15 (× 0.85 upper bounds) === */
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(17px, 2.5vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(10px, 1.7vw, 12px);
  padding-bottom: clamp(17px, 3.4vw, 20px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.stage-nav {
  flex-shrink: 0;
  background: #F6F4EF;
  border-top: 1px solid rgba(167, 166, 162, 0.25);
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(11px, 2vw, 11px);
  display: flex;
  gap: 12px;
}

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FF4F28;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.55);
}

/* === PROGRESS v15 (с orange glow) === */
.progress-track {
  height: 6px;
  background: rgba(167, 166, 162, 0.25);
  width: 100%;
  margin-bottom: 12px;
  border-radius: 99px;
  overflow: visible;
}
.progress-bar {
  height: 100%;
  background: #FF4F28;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
  box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40);
}

/* === SLIDER v15 (track-wrap + track-bg + track-fill + glow + круговая тень handle) === */
.track-wrap {
  position: relative;
  height: 26px;
  margin: 18px 0;
  display: flex;
  align-items: center;
}
.track-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: rgba(167, 166, 162, 0.30);
  border-radius: 99px;
  pointer-events: none;
}
.track-fill {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #FF4F28;
  border-radius: 99px;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40);
  transition: width 0.15s ease-out;
}
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  width: 100%;
  height: 24px;
  background: transparent;
  outline: none;
  margin: 0;
  cursor: grab;
  z-index: 2;
}
.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.1s;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #FF4F28;
  border-radius: 50%;
  cursor: grab;
  border: none;
  box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55);
}
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

/* === INPUT v15 (без рамок, на тенях) === */
.answer-input {
  font-family: 'Fraunces', serif;
  font-size: clamp(22px, 4vw, 27px);
  font-weight: 400;
  text-align: center;
  border-radius: 12px;
  background: #FFFFFF;
  padding: 8px 12px;
  outline: none;
  border: none;
  color: #0E0E10;
  transition: all 0.2s;
  box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14);
}
.answer-input:focus {
  box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20);
}
.answer-input.correct {
  background: #E3F0E8;
  color: #1F7A4D;
  box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30);
}
.answer-input.wrong {
  background: #FFE8E1;
  color: #FF4F28;
  box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36);
}

/* === FRAMES v15 (без рамок, на тенях; polosa-исключение в soft/success) === */
.frame {
  background: #FFFFFF;
  border-radius: 16px;
  padding: clamp(17px, 3.4vw, 17px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
}
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}

/* MATH: анимация появления цифры в квадрате. */
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }
/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(82px, 17vw, 120px); height: clamp(54px, 12vw, 80px); display: flex; align-items: center; justify-content: center; }
.fact-anim > * { transform: scale(1.55); }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.38; color: #0E0E10; }
/* MATH frac_5_15: drag-чипы (touch + tap). */
.chip {
  font-family: 'JetBrains Mono', monospace; font-weight: 600;
  border: none; border-radius: 10px; cursor: grab; color: #FFFFFF;
  box-shadow: 0 6px 16px -5px rgba(58, 53, 48, 0.42);
  touch-action: none; user-select: none; -webkit-user-select: none;
  transition: box-shadow 0.2s, filter 0.2s;
}
.chip:hover { filter: brightness(1.06); box-shadow: 0 9px 22px -5px rgba(58, 53, 48, 0.5); }
.chip:active { cursor: grabbing; }
.chip-pop { animation: chipPop 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) backwards; }
@keyframes chipPop { from { opacity: 0; transform: scale(0.5); } }
/* MATH frac_5_15: DiskCombine — диски-круги (whole полных + 1 частичный), перенос/займ. */
.dc-row { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 7px); flex-wrap: wrap; justify-content: center; }
.dc-disk { display: block; }
.dc-disk-full { filter: drop-shadow(0 2px 6px rgba(31, 122, 77, 0.28)); }
.dc-wedge-on { animation: dcWedge 0.42s ease backwards; }
@keyframes dcWedge { from { opacity: 0; } to { opacity: 1; } }
.dc-glow { animation: dcGlow 0.7s ease; }
@keyframes dcGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }
.dc-shake { animation: dcShake 0.5s ease; }
@keyframes dcShake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
/* MATH frac_5_15: hook-анимация NumberJump — маркер прыгает 1 2/3 →+2 2/3→ 4 1/3 (CSS loop, no state). */
.nj-wrap { width: 100%; max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(12px, 2.6vw, 18px); align-items: center; padding: 0 clamp(12px, 3vw, 20px); }
.nj-track { position: relative; width: 100%; height: clamp(64px, 13vw, 82px); }
.nj-line { position: absolute; left: 0; right: 0; bottom: 24px; height: 3px; background: rgba(167, 166, 162, 0.5); border-radius: 99px; }
.nj-tick { position: absolute; bottom: 20px; transform: translateX(-50%); width: 2px; height: 12px; background: #0E0E10; border-radius: 2px; }
.nj-tick-num { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); color: #A7A6A2; }
.nj-start, .nj-land { position: absolute; bottom: 46px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
.nj-start { left: 33.33%; }
.nj-land { left: 86.67%; opacity: 0; animation: njLand 7s ease infinite; }
@keyframes njLand { 0%, 58% { opacity: 0; transform: translateX(-50%) translateY(8px); } 66%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(0); } }
.nj-marker { position: absolute; bottom: 18px; left: 33.33%; transform: translateX(-50%); animation: njTravel 7s cubic-bezier(0.34, 1.1, 0.64, 1) infinite; z-index: 3; }
.nj-dot { display: block; width: clamp(15px, 3.2vw, 19px); height: clamp(15px, 3.2vw, 19px); border-radius: 50%; background: #FF4F28; box-shadow: 0 0 0 5px rgba(255, 79, 40, 0.16), 0 0 14px rgba(255, 79, 40, 0.6); }
@keyframes njTravel {
  0% { left: 33.33%; transform: translateX(-50%) translateY(0); opacity: 0; }
  5% { left: 33.33%; transform: translateX(-50%) translateY(0); opacity: 1; }
  12% { left: 33.33%; transform: translateX(-50%) translateY(0); }
  16% { left: 36.6%; transform: translateX(-50%) translateY(-15px); }
  20% { left: 40%; transform: translateX(-50%) translateY(0); }
  28% { left: 50%; transform: translateX(-50%) translateY(-20px); }
  36% { left: 60%; transform: translateX(-50%) translateY(0); }
  44% { left: 70%; transform: translateX(-50%) translateY(-20px); }
  52% { left: 80%; transform: translateX(-50%) translateY(0); }
  58% { left: 83.3%; transform: translateX(-50%) translateY(-12px); }
  64% { left: 86.67%; transform: translateX(-50%) translateY(0); }
  90% { left: 86.67%; transform: translateX(-50%) translateY(0); opacity: 1; }
  100% { left: 86.67%; transform: translateX(-50%) translateY(0); opacity: 0; }
}
.nj-cap { display: inline-flex; align-items: center; gap: 6px; }
/* MATH frac_5_15: fill-in-blank — клетка-числитель в дроби. */
.fb-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; }
.fb-box { width: clamp(46px, 9vw, 60px); font-family: 'Fraunces', serif; font-size: clamp(18px, 3.4vw, 24px); font-weight: 400; text-align: center; border: none; border-radius: 8px; background: #FFFFFF; padding: 4px 6px; outline: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.2s; }
.fb-box:focus { box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.fb-box.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.fb-box::-webkit-outer-spin-button, .fb-box::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.fb-bar { height: 2.5px; width: 100%; background: currentColor; color: #0E0E10; margin: 3px 0; border-radius: 2px; }
.fb-den { font-family: 'Fraunces', serif; font-size: clamp(18px, 3.4vw, 24px); color: #0E0E10; }
/* MATH frac_5_15: ambient — мягкие плавающие круги на разрежённых экранах (декор, pointer-events:none). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }
/* MATH frac_5_15: факт-карта — КРУПНАЯ анимация, меньше текста (PROMPT 2026-06-13). */
.fact-card { gap: clamp(12px, 2.5vw, 18px); }
.fact-anim { width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); }
.fact-text { font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; }
.fa-fl { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #019ACB; }
.fa-fl-n { font-size: clamp(22px, 4.5vw, 30px); line-height: 1; }
.fa-fl-bar { height: 4px; width: clamp(34px, 7vw, 46px); background: #019ACB; border-radius: 3px; transform-origin: left center; animation: faFl 2.6s ease-in-out infinite; }
@keyframes faFl { 0% { transform: scaleX(0); } 35%, 70% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
.fa-clk { position: relative; width: clamp(54px, 11vw, 74px); height: clamp(54px, 11vw, 74px); border-radius: 50%; border: 3px solid #019ACB; overflow: hidden; }
.fa-clk-fill { position: absolute; inset: 0; background: conic-gradient(rgba(1, 154, 203, 0.22) 0deg 180deg, transparent 180deg); }
.fa-clk-h { position: absolute; left: 50%; top: 50%; background: #019ACB; border-radius: 2px; transform-origin: bottom center; }
.fa-clk-hm { width: 3px; height: 30%; animation: faClk 3s linear infinite; }
.fa-clk-hh { width: 3.5px; height: 22%; animation: faClk 9s linear infinite; }
.fa-clk-c { position: absolute; left: 50%; top: 50%; width: 7px; height: 7px; border-radius: 50%; background: #019ACB; transform: translate(-50%, -50%); }
@keyframes faClk { from { transform: translate(-50%, -100%) rotate(0deg); } to { transform: translate(-50%, -100%) rotate(360deg); } }
.fa-pi { display: flex; align-items: center; gap: 4px; }
.fa-pi i { width: clamp(16px, 3.4vw, 22px); height: clamp(16px, 3.4vw, 22px); border-radius: 50%; background: #019ACB; opacity: 0; animation: faPi 3.2s ease-in-out infinite; }
.fa-pi i:nth-child(1) { animation-delay: 0s; }
.fa-pi i:nth-child(2) { animation-delay: 0.3s; }
.fa-pi i:nth-child(3) { animation-delay: 0.6s; }
.fa-pi-q { width: clamp(9px, 2vw, 12px); height: clamp(16px, 3.4vw, 22px); border-radius: 7px 0 0 7px; background: rgba(1, 154, 203, 0.45); opacity: 0; animation: faPi 3.2s ease-in-out infinite; animation-delay: 0.9s; }
@keyframes faPi { 0%, 8% { opacity: 0; transform: scale(0.5); } 25%, 75% { opacity: 1; transform: scale(1); } 92%, 100% { opacity: 0; transform: scale(0.5); } }
/* Accessibility: уважение к prefers-reduced-motion (PROMPT 2026-06-13) — гасим декоративные циклы. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
