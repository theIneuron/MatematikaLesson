import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Вычитание дробей с равными знаменателями — frac_5_10
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
// --- ПОД УРОК: frac_5_13 — Правильные, неправильные, смешанные числа ---
// Визуализатор UnitBars: ряд единичных квадратов с заливкой за пределы одного
// целого + синхронная числовая прямая 0..3. Первая 2D-«многоцелая» модель ряда.
// Анимации: ubPop (заливка ячейки), ubGlow (успех), маркер-слайд по прямой.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'frac-5-13-v1',
  lessonTitle: { ru: 'Правильные, неправильные, смешанные числа', uz: "To'g'ri, noto'g'ri va aralash sonlar" }
};

// Обучающий урок: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'test',        template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's12', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Странное число на дисплее', uz: "Displeydagi g'alati son" },
    lead: { ru: 'Капитан Кувват заряжает энергию. Каждое ядро — это три деления. Он зарядил пять делений, и на дисплее загорелось:', uz: "Kapitan Quvvat energiya to'playapti. Har yadro — uchta bo'lim. U besh bo'lim zaryadladi va displeyda yondi:" },
    objection: { ru: 'Юсуф удивился: так не бывает — верх не может быть больше низа. Это ошибка.', uz: "Yusuf hayron bo'ldi: bunday bo'lmaydi — surat maxrajdan katta bo'lolmaydi. Bu xato." },
    question: { ru: 'Юсуф прав?', uz: "Yusuf haqmi?" },
    opt_yes: { ru: 'Да, это ошибка', uz: "Ha, bu xato" },
    opt_no: { ru: 'Нет, так бывает', uz: "Yo'q, bunday bo'ladi" },
    opt_idk: { ru: 'Не уверен(а)', uz: "Ishonchim komil emas" },
    audio: { ru: 'Капитан Кувват заряжает энергию. Каждое ядро — это три деления. Он зарядил пять делений, и на дисплее загорелось пять третьих. Юсуф сказал: так не бывает, верх не может быть больше низа, это ошибка. Как думаешь, Юсуф прав? Выбери ответ.', uz: "Kapitan Quvvat energiya to'playapti. Har yadro — uchta bo'lim. U besh bo'lim zaryadladi va displeyda uchdan besh yondi. Yusuf dedi: bunday bo'lmaydi, surat maxrajdan katta bo'lolmaydi, bu xato. Sizningcha, Yusuf haqmi? Javobni tanlang." }
  },
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslab ko'ramiz" },
    title: { ru: 'Какая дробь больше', uz: "Qaysi kasr katta" },
    question: { ru: 'Прежде чем идти дальше — вспомним: что больше, 2/3 или 1/3?', uz: "Davom etishdan oldin eslaymiz: 2/3 va 1/3 — qaysi biri katta?" },
    opt0: { ru: '2/3', uz: "2/3" },
    opt1: { ru: '1/3', uz: "1/3" },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    opt3: { ru: 'Нельзя сравнить', uz: "Taqqoslab bo'lmaydi" },
    correct_text: { ru: 'Верно. Знаменатель один и тот же, значит больше та дробь, у которой больше верх: 2 больше 1.', uz: "To'g'ri. Maxraj bir xil, demak surati katta kasr katta: ikki birdan katta." },
    wrong_1: { ru: 'Знаменатель у обеих один — третьи. Больше та, у которой больше верх: две третьих больше одной третьей.', uz: "Ikkalasining maxraji bir — uchdan. Surati katta kasr katta: uchdan ikki uchdan birdan katta." },
    wrong_2: { ru: 'Они не равны: в двух третьих две доли, в одной третьей одна доля.', uz: "Ular teng emas: uchdan ikkida ikki ulush, uchdan birda bitta ulush." },
    wrong_3: { ru: 'Сравнить можно: знаменатели одинаковые, поэтому смотрим на верх.', uz: "Taqqoslash mumkin: maxrajlar bir xil, shuning uchun suratga qaraladi." },
    audio: {
      intro: { ru: 'Прежде чем пойти дальше, вспомним прошлый урок. Что больше: две третьих или одна третья? Выбери ответ.', uz: "Davom etishdan oldin o'tgan darsni eslaymiz. Uchdan ikki va uchdan bir — qaysi biri katta? Javobni tanlang." },
      on_correct: { ru: 'Верно. Знаменатель один, значит смотрим на верх. Теперь идём дальше.', uz: "To'g'ri. Maxraj bir xil, demak suratga qaraymiz. Endi davom etamiz." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Когда верх больше низа', uz: "Surat maxrajdan oshganda" },
    lead: { ru: 'Заряжай ядро по одному делению. Нажимай кнопку заряд.', uz: "Yadroni bittadan bo'lim zaryadlang. Zaryad tugmasini bosing." },
    read_charged: { ru: 'Заряжено', uz: "Zaryadlangan" },
    read_percore: { ru: 'В одном ядре', uz: "Bir yadroda" },
    read_unit: { ru: 'делений', uz: "bo'lim" },
    step_labels: {
      ru: ['Ядра пусты. Нажимай кнопку заряд.', 'Первое ядро полно — это одно целое. Но заряд ещё растёт.', 'Заряд пошёл во второе ядро.'],
      uz: ["Yadrolar bo'sh. Zaryad tugmasini bosing.", "Birinchi yadro to'ldi — bu bir butun. Lekin zaryad oshyapti.", "Zaryad ikkinchi yadroga o'tdi."]
    },
    note: { ru: 'Делений оказалось больше, чем в одном ядре. Верх стал больше низа — и это нормально.', uz: "Bo'limlar bitta yadrodagidan ko'p chiqdi. Surat maxrajdan katta bo'ldi — va bu normal." },
    btn_step: { ru: 'Заряд', uz: "Zaryad" },
    audio: {
      ru: [
        'Каждое ядро разделено на три деления. Нажимай кнопку заряд, чтобы заряжать по одному делению.',
        'Первое ядро заполнилось — три деления, это одно целое. Но заряд ещё остался.',
        'Во второе ядро пошли ещё два деления. Всего получилось пять третьих — больше, чем одно ядро. Значит, верх дроби может быть больше низа.'
      ],
      uz: [
        "Har yadro uchta bo'limga bo'lingan. Bittadan bo'lim zaryadlash uchun zaryad tugmasini bosing.",
        "Birinchi yadro to'ldi — uchta bo'lim, bu bir butun. Lekin zaryad qoldi.",
        "Ikkinchi yadroga yana ikkita bo'lim o'tdi. Hammasi bo'lib uchdan besh — bitta yadrodan ko'p. Demak, kasrning surati maxrajidan katta bo'lishi mumkin."
      ]
    }
  },
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Рождение смешанного числа', uz: "Aralash sonning paydo bo'lishi" },
    lead: { ru: 'Прочитаем те же пять третьих по-другому.', uz: "O'sha uchdan beshni boshqacha o'qiymiz." },
    step_labels: {
      ru: ['Вот пять третьих в двух ядрах.', 'Первое ядро — это одно полное целое.', 'Во втором осталось две третьих. Одно целое и две третьих — это смешанное число.'],
      uz: ["Mana ikki yadrodagi uchdan besh.", "Birinchi yadro — bu bitta to'la butun.", "Ikkinchida uchdan ikki qoldi. Bir butun va uchdan ikki — bu aralash son."]
    },
    note: { ru: 'Одно целое и две третьих — на прямой это между 1 и 2.', uz: "Bir butun va uchdan ikki — son o'qida bu bir bilan ikki orasida." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Посмотрим на пять третьих иначе. Вот они в двух ядрах.',
        'Первое ядро было полно — это одно целое.',
        'Во втором ядре осталось две третьих. Значит, одно целое и две третьих. Так записывают смешанное число. На прямой оно стоит между единицей и двойкой.'
      ],
      uz: [
        "Uchdan beshga boshqacha qaraymiz. Mana ular ikki yadroda.",
        "Birinchi yadro to'la edi — bu bir butun.",
        "Ikkinchi yadroda uchdan ikki qoldi. Demak, bir butun va uchdan ikki. Bu aralash son deb yoziladi. Son o'qida u bir bilan ikki orasida turadi."
      ]
    }
  },
  s4: {
    eyebrow: { ru: 'Попробуй сам', uz: "O'zingiz sinab ko'ring" },
    title: { ru: 'Две записи одного числа', uz: "Bir sonning ikki yozuvi" },
    lead: { ru: 'Двигайте ползунок заряда. Знаменатель остаётся четыре.', uz: "Zaryad suriladigan tugmasini suring. Maxraj to'rt bo'lib qoladi." },
    note: { ru: 'Как только верх становится больше низа, дробь становится больше одного — и её можно записать смешанным числом.', uz: "Surat maxrajdan oshishi bilan kasr birdan katta bo'ladi — va uni aralash son bilan yozish mumkin." },
    audio: { ru: 'Подвигайте ползунок заряда. Когда меняется число делений, ячейки заполняются. Обратите внимание: как только верх дроби становится больше низа, число становится больше одного и превращается в смешанное.', uz: "Zaryad suriladigan tugmasini suring. Bo'limlar soni o'zgarganda kataklar to'ladi. E'tibor bering: surat maxrajdan katta bo'lishi bilanoq son birdan oshadi va aralash songa aylanadi." }
  },
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Правильная и неправильная дробь', uz: "To'g'ri va noto'g'ri kasr" },
    rule_main: { ru: 'Если верх меньше низа — дробь правильная, она меньше одного. Если верх больше низа или равен ему — дробь неправильная, она больше одного или равна одному.', uz: "Agar surat maxrajdan kichik bo'lsa — kasr to'g'ri, u birdan kichik. Agar surat maxrajdan katta yoki teng bo'lsa — kasr noto'g'ri, u birdan katta yoki teng." },
    rule_note: { ru: 'Неправильная дробь — не ошибка. Это полноценное число.', uz: "Noto'g'ri kasr — xato emas. Bu to'liq haqiqiy son." },
    ex_good: { ru: 'правильная', uz: "to'g'ri" },
    ex_bad: { ru: 'неправильная', uz: "noto'g'ri" },
    audio: { ru: 'Дробь различают по верху. Если верх меньше низа, это правильная дробь — она меньше одного. Если верх больше низа или равен ему, это неправильная дробь — она больше одного или равна одному. Неправильная дробь не ошибка.', uz: "Kasrni suratiga qarab ajratamiz. Agar surat maxrajdan kichik bo'lsa, bu to'g'ri kasr — u birdan kichik. Agar surat maxrajdan katta yoki teng bo'lsa, bu noto'g'ri kasr — u birdan katta yoki teng. Noto'g'ri kasr xato emas." }
  },
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Что такое смешанное число', uz: "Aralash son nima" },
    rule_main: { ru: 'Смешанное число — это сумма целого и дроби. Один целый две третьих — это один плюс две третьих.', uz: "Aralash son — butun va kasrning yig'indisi. Bir butun uchdan ikki — bu bir qo'shuv uchdan ikki." },
    warning_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warning: { ru: 'Это не умножение. Один целый две третьих — это не один умножить на две третьих.', uz: "Bu ko'paytirish emas. Bir butun uchdan ikki — bu bir ko'paytuv uchdan ikki degani emas." },
    audio: { ru: 'Смешанное число — это сумма целого числа и дроби. Например, один целый две третьих — это один плюс две третьих. Это сложение, а не умножение. Запомните это.', uz: "Aralash son — butun son va kasrning yig'indisi. Masalan, bir butun uchdan ikki — bu bir qo'shuv uchdan ikki. Bu qo'shish, ko'paytirish emas. Buni esda saqlang." }
  },
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найди неправильную дробь', uz: "Noto'g'ri kasrni toping" },
    question: { ru: 'Какая дробь неправильная?', uz: "Qaysi kasr noto'g'ri kasr?" },
    opt0: { ru: '2/3', uz: "2/3" },
    opt1: { ru: '5/3', uz: "5/3" },
    opt2: { ru: '4/5', uz: "4/5" },
    opt3: { ru: 'Такой дроби не бывает', uz: "Bunday kasr yo'q" },
    correct_text: { ru: 'Верно. В пяти третьих верх больше низа — это неправильная дробь, она больше одного.', uz: "To'g'ri. Uchdan beshda surat maxrajdan katta — bu noto'g'ri kasr, u birdan katta." },
    hint_0: { ru: 'В двух третьих верх меньше низа — это правильная дробь, она меньше одного.', uz: "Uchdan ikkida surat maxrajdan kichik — bu to'g'ri kasr, u birdan kichik." },
    hint_2: { ru: 'В четырёх пятых верх тоже меньше низа — это правильная дробь.', uz: "Beshdan to'rtda ham surat maxrajdan kichik — bu to'g'ri kasr." },
    hint_3: { ru: 'Такая дробь бывает. Верх может быть больше низа — например, пять третьих. Неправильная дробь — полноценное число.', uz: "Bunday kasr bor. Surat maxrajdan katta bo'lishi mumkin — masalan, uchdan besh. Noto'g'ri kasr — to'liq haqiqiy son." },
    audio: {
      intro: { ru: 'Найди, какая дробь неправильная. Выбери правильный вариант.', uz: "Qaysi kasr noto'g'ri kasr ekanini toping. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. В пяти третьих верх больше.', uz: "To'g'ri. Uchdan beshda surat kattaroq." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Прочитай рисунок числом', uz: "Rasmni son bilan o'qing" },
    question: { ru: 'Сколько закрашено — каким смешанным числом?', uz: "Bo'yalgan miqdor — qaysi aralash son?" },
    opt0: { ru: '1 2/3', uz: "1 2/3" },
    opt1: { ru: '2/3', uz: "2/3" },
    opt2: { ru: '2 1/3', uz: "2 1/3" },
    opt3: { ru: '1 1/3', uz: "1 1/3" },
    correct_text: { ru: 'Верно. Один полный целый и две третьих — это один целый две третьих.', uz: "To'g'ri. Bitta to'la butun va uchdan ikki — bu bir butun uchdan ikki." },
    hint_1: { ru: 'Первый полный целый не учли. Один целый есть, и сверх него две третьих.', uz: "Birinchi to'la butun hisobga olinmadi. Bir butun bor, undan tashqari uchdan ikki." },
    hint_2: { ru: 'Целое и остаток поменяли местами. Целый один, а остаток — две третьих.', uz: "Butun va qoldiq o'rni almashdi. Butun bitta, qoldiq esa uchdan ikki." },
    hint_3: { ru: 'В остатке две доли, а не одна — две третьих.', uz: "Qoldiqda ikkita ulush bor, bitta emas — uchdan ikki." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Год — это примерно триста шестьдесят пять с четвертью суток, то есть смешанное число. Каждый год четвертушки накапливаются и за четыре года дают один лишний день — поэтому раз в четыре года бывает двадцать девятое февраля, високосный год.', uz: "Bir yil — taxminan uch yuz oltmish besh butun to'rtdan bir kun, ya'ni aralash son. Har yili choraklar yig'ilib, to'rt yilda bir qo'shimcha kun beradi — shuning uchun har to'rt yilda yigirma to'qqizinchi fevral, kabisa yili bo'ladi." }
    },
    audio: {
      intro: { ru: 'Определи, сколько закрашено, в виде смешанного числа. Выбери вариант.', uz: "Bo'yalgan miqdorni aralash son ko'rinishida aniqlang. Variantni tanlang." },
      on_correct: { ru: 'Верно. Один целый и две третьих. Кстати, год — тоже смешанное число, примерно триста шестьдесят пять с четвертью суток.', uz: "To'g'ri. Bir butun va uchdan ikki. Aytgancha, bir yil ham aralash son — taxminan uch yuz oltmish besh butun to'rtdan bir kun." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s9: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Сколько целых спрятано', uz: "Nechta butun yashiringan" },
    question: { ru: 'Сколько полных целых в 11/4? Введи число.', uz: "11/4 da nechta to'liq butun bor? Sonni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Раздели одиннадцать долей на целые по четыре: каждые четыре доли — один целый.', uz: "O'n bir ulushni to'rttadan butunlarga ajrating: har to'rt ulush — bitta butun." },
    fb_correct: { ru: 'Верно. Одиннадцать долей по четыре дают два полных целых, и три доли остаются.', uz: "To'g'ri. O'n bir ulushni to'rttadan ajratsak, ikki to'liq butun chiqadi, uch ulush qoladi." },
    audio: {
      intro: { ru: 'Посчитай, сколько полных целых в одиннадцати четвёртых. Введи ответ и нажми кнопку проверить.', uz: "To'rtdan o'n birda nechta to'liq butun borligini hisoblang. Javobni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно, два целых.', uz: "To'g'ri, ikki butun." },
      on_wrong: { ru: 'Пока нет. Раздели доли на целые по четыре.', uz: "Hali emas. Ulushlarni to'rttadan butunlarga ajrating." }
    }
  },
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Сложение, а не умножение', uz: "Qo'shish, ko'paytirish emas" },
    question_pre: { ru: 'Какое утверждение', uz: "Qaysi tasdiq" },
    question_em: { ru: 'неверное', uz: "noto'g'ri" },
    question_post: { ru: '?', uz: "?" },
    opt0: { ru: '2 1/3 — это два плюс одна третья', uz: "2 1/3 — bu ikki qo'shuv uchdan bir" },
    opt1: { ru: '2 1/3 — это два целых и одна третья', uz: "2 1/3 — ikki butun va uchdan bir" },
    opt2: { ru: '2 1/3 — это два умножить на одну третью', uz: "2 1/3 — bu ikki ko'paytuv uchdan bir" },
    opt3: { ru: '2 1/3 больше одного', uz: "2 1/3 birdan katta" },
    correct_text: { ru: 'Верно нашёл. Смешанное число — это сложение, а не умножение. Поэтому два умножить на одну третью — неверно.', uz: "To'g'ri topdingiz. Aralash son — qo'shish, ko'paytirish emas. Shuning uchun ikki ko'paytuv uchdan bir — noto'g'ri." },
    hint_0: { ru: 'Это утверждение верное: смешанное — сумма целого и дроби. Ищи неверное.', uz: "Bu tasdiq to'g'ri: aralash son — butun va kasrning yig'indisi. Noto'g'risini qidiring." },
    hint_1: { ru: 'Это верное чтение: два целых и одна третья. Проверь другое утверждение.', uz: "Bu to'g'ri o'qilish: ikki butun va uchdan bir. Boshqa tasdiqni tekshiring." },
    hint_3: { ru: 'Это тоже верно: есть два целых, значит число больше одного. Неверное — другое.', uz: "Bu ham to'g'ri: ikki butun bor, demak son birdan katta. Noto'g'ri tasdiq — boshqasi." },
    audio: {
      intro: { ru: 'Внимание: в этот раз найди неверное утверждение. Какое утверждение ошибочное? Выбери вариант.', uz: "Diqqat: bu safar noto'g'ri tasdiqni toping. Qaysi tasdiq xato? Variantni tanlang." },
      on_correct: { ru: 'Верно. Смешанное число — это сложение, а не умножение.', uz: "To'g'ri. Aralash son — qo'shish, ko'paytirish emas." },
      on_wrong: { ru: 'Это утверждение на самом деле верное. Ищи неверное.', uz: "Bu tasdiq aslida to'g'ri. Noto'g'risini qidiring." }
    }
  },
  s11: {
    eyebrow: { ru: 'Миссия', uz: "Missiya" },
    title: { ru: 'Энергия для миссии', uz: "Missiya uchun energiya" },
    lead: { ru: 'Дилноза готовит энергию для миссии. Каждый блок — одна четвёртая ядра. Она зарядила девять блоков.', uz: "Dilnoza missiya uchun energiya tayyorlayapti. Har blok — to'rtdan bir yadro. U to'qqiz blok zaryadladi." },
    question_setup: { ru: 'Сколько всего ядер энергии?', uz: "Jami qancha yadro energiya?" },
    btn_help: { ru: 'Помочь Дилнозе', uz: "Dilnozaga yordam berish" },
    audio: { ru: 'Дилноза готовит энергию для миссии. Каждый блок — это одна четвёртая ядра. Всего девять блоков. Давай посчитаем, сколько ядер получилось.', uz: "Dilnoza missiya uchun energiya tayyorlayapti. Har blok — to'rtdan bir yadro. Hammasi bo'lib to'qqiz blok. Keling, jami qancha yadro bo'lganini hisoblaymiz." }
  },
  s12: {
    eyebrow: { ru: 'Миссия', uz: "Missiya" },
    title: { ru: 'Сколько всего ядер', uz: "Jami qancha yadro" },
    question: { ru: 'Сколько всего ядер зарядила Дилноза?', uz: "Dilnoza jami qancha yadro zaryadladi?" },
    opt0: { ru: '2 1/4 ядра', uz: "2 1/4 yadro" },
    opt1: { ru: '9/4 — это неверная запись', uz: "9/4 — noto'g'ri yozuv" },
    opt2: { ru: '4 1/4 ядра', uz: "4 1/4 yadro" },
    opt3: { ru: '2 3/4 ядра', uz: "2 3/4 yadro" },
    correct_text: { ru: 'Верно. Девять делений по четыре — это два полных ядра и одна четвёртая ядра.', uz: "To'g'ri. To'qqiz bo'limni to'rttadan ajratsak — ikki to'liq yadro va to'rtdan bir yadro." },
    hint_1: { ru: 'Девять четвёртых — полноценный заряд, не ошибка. Он равен двум целым одной четвёртой.', uz: "To'rtdan to'qqiz — to'liq haqiqiy zaryad, xato emas. U ikki butun to'rtdan birga teng." },
    hint_2: { ru: 'Девять делений по четыре дают два целых, а не четыре.', uz: "To'qqiz bo'limni to'rttadan ajratsak ikki butun chiqadi, to'rt emas." },
    hint_3: { ru: 'В остатке одна четвёртая, а не три.', uz: "Qoldiq — to'rtdan bir, uchta emas." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" },
      text: { ru: 'При загрузке файла показатель вроде две с половиной из четырёх гигабайт — это смешанная величина. Компьютер хранит её как дробь, число с плавающей точкой.', uz: "Fayl yuklashda to'rt gigabaytdan ikki yarim gigabayt kabi ko'rsatkich — aralash miqdor. Kompyuter uni kasr, suzuvchi nuqtali son sifatida saqlaydi." }
    },
    audio: {
      intro: { ru: 'Найди, сколько всего ядер зарядила Дилноза. Выбери вариант.', uz: "Dilnoza jami qancha yadro zaryadlaganini toping. Variantni tanlang." },
      on_correct: { ru: 'Верно, две целых одна четвёртая ядра. В компьютере показатель вроде двух с половиной из четырёх гигабайт — тоже смешанная величина.', uz: "To'g'ri, ikki butun to'rtdan bir yadro. Kompyuterda to'rt gigabaytdan ikki yarim gigabayt kabi ko'rsatkich ham aralash miqdor." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s13: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    title: { ru: 'Запиши смешанным числом', uz: "Aralash son bilan yozing" },
    question: { ru: 'Как записать 8/3 смешанным числом?', uz: "8/3 ni aralash son ko'rinishida qanday yozamiz?" },
    opt0: { ru: '2 2/3', uz: "2 2/3" },
    opt1: { ru: '2 умножить на 2/3', uz: "2 ko'paytuv 2/3" },
    opt2: { ru: '8/3 — это неверная запись', uz: "8/3 — noto'g'ri yozuv" },
    opt3: { ru: '3 2/3', uz: "3 2/3" },
    correct_text: { ru: 'Верно. Восемь долей по три — это два полных целых и две третьих.', uz: "To'g'ri. Sakkiz ulushni uchtadan ajratsak — ikki to'liq butun va uchdan ikki." },
    hint_1: { ru: 'Смешанное число читают через сложение, а не умножение: два целых и две третьих.', uz: "Aralash son qo'shish bilan o'qiladi, ko'paytirish bilan emas: ikki butun uchdan ikki." },
    hint_2: { ru: 'Восемь третьих — полноценное число, не ошибка. Оно равно двум целым двум третьим.', uz: "Uchdan sakkiz — to'liq haqiqiy son, xato emas. U ikki butun uchdan ikkiga teng." },
    hint_3: { ru: 'Восемь долей по три дают два целых, а не три.', uz: "Sakkiz ulushni uchtadan ajratsak ikki butun chiqadi, uch emas." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" },
      text: { ru: 'В программировании разбить неправильную дробь на целое и остаток — это целочисленное деление и деление с остатком. Восемь долей по одной третьей: восемь разделить на три — два целых, остаток два.', uz: "Dasturlashda noto'g'ri kasrni butun va qoldiqqa ajratish — bu butun bo'lish va qoldiqli bo'lish amali. Sakkiz ulush, har biri uchdan bir: sakkizni uchga bo'lsak — ikki butun, qoldiq ikki." }
    },
    audio: {
      intro: { ru: 'Найди вариант, который правильно показывает восемь третьих смешанным числом.', uz: "Uchdan sakkizni aralash son ko'rinishida to'g'ri ko'rsatgan variantni toping." },
      on_correct: { ru: 'Верно, две целых две третьих. В программе так же: восемь разделить на три — два целых, остаток два.', uz: "To'g'ri, ikki butun uchdan ikki. Dasturda ham shunday: sakkizni uchga bo'lsak — ikki butun, qoldiq ikki." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s14: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Три вида чисел понятны', uz: "Uch xil son tushunarli" },
    title: { ru: 'Теперь ты различаешь правильные, неправильные и смешанные числа.', uz: "Endi siz to'g'ri, noto'g'ri va aralash sonlarni farqlaysiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    points: {
      ru: [
        'Правильная дробь: верх меньше низа, она меньше одного.',
        'Неправильная дробь: верх больше или равен низу, она больше или равна одному. Это не ошибка.',
        'Смешанное число: сумма целого и дроби, например один целый две третьих.'
      ],
      uz: [
        "To'g'ri kasr: surat maxrajdan kichik, u birdan kichik.",
        "Noto'g'ri kasr: surat maxrajdan katta yoki teng, u birdan katta yoki teng. Bu xato emas.",
        "Aralash son: butun va kasrning yig'indisi, masalan bir butun uchdan ikki."
      ]
    },
    hook_close: { ru: 'Помнишь, Капитан Кувват зарядил пять третьих, а Юсуф назвал это ошибкой? Теперь мы знаем: пять третьих — не ошибка. Это одно целое две третьих.', uz: "Esingizdami, Kapitan Quvvat uchdan besh zaryadladi, Yusuf buni xato dedi? Endi bilamiz: uchdan besh — xato emas. U bir butun uchdan ikkiga teng." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Что такое дробь», «Дробь на числовой прямой», «Сравнение дробей».', uz: "«Kasr nima», «Kasr son o'qida», «Kasrlarni taqqoslash»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'перевод смешанного числа в неправильную дробь и обратно.', uz: "aralash sonni noto'g'ri kasrga aylantirish va aksincha." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Сегодня мы научились различать дроби. Правильная меньше одного, неправильная больше одного или равна ему — и это не ошибка. Смешанное число — это сумма целого и дроби. Пять третьих у Капитана Кувват на самом деле были одно целое две третьих. Дальше научимся переводить смешанное число в неправильную дробь и обратно.', uz: "Bugun kasrlarni ajratishni o'rgandik. To'g'ri kasr birdan kichik, noto'g'ri kasr birdan katta yoki teng — va bu xato emas. Aralash son — butun va kasrning yig'indisi. Kapitan Quvvatning uchdan beshi aslida bir butun uchdan ikki edi. Keyin aralash sonni noto'g'ri kasrga aylantirish va aksincha o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_13: UnitBars — ряд единичных квадратов (заливка за пределы
// одного целого) + синхронная числовая прямая 0..lineMax. splitWholes подсвечивает
// заполненные целые зелёным (для exploration/solved); в тестах — false (не выдаёт ответ).
// ============================================================
const UnitBars = ({ den, filled, units = 2, splitWholes = false, success = false, showLine = false, lineMax = 2, markerValue = null, live = false, alive = false, labels = false, compact = false, maxW = 520 }) => {
  const mv = markerValue === null ? filled : markerValue;
  const uz = useLang() === 'uz';
  const wrapCls = 'ub-wrap' + (live ? ' ub-live' : '') + (alive ? ' ub-alive' : '') + (compact ? ' ub-compact' : '');
  return (
    <div className={wrapCls} style={{ maxWidth: maxW }}>
      <div className="ub-row">
        {Array.from({ length: units }).map((_, u) => {
          const inUnit = Math.max(0, Math.min(den, filled - u * den));
          const whole = splitWholes && inUnit === den;
          return (
            <div key={u} className="ub-unitwrap">
              <div className={whole ? 'ub-core ub-core-whole' : 'ub-core'}>
                {Array.from({ length: den }).map((_, i) => {
                  const on = (u * den + (den - 1 - i)) < filled;
                  const cls = on ? (whole ? 'ub-seg ub-seg-whole' : 'ub-seg ub-seg-on') : 'ub-seg';
                  return <div key={i} className={cls}/>;
                })}
                {whole && <span className="ub-check">✓</span>}
              </div>
              {labels && <span className="ub-label mono small">{uz ? `${u + 1}-yadro` : `ядро ${u + 1}`}</span>}
            </div>
          );
        })}
      </div>
      {showLine && (
        <div className="ub-line">
          <div className="ub-line-track">
            {Array.from({ length: lineMax * den + 1 }).map((_, i) => (
              <div key={i} className={i % den === 0 ? 'ub-tick ub-tick-whole' : 'ub-tick'} style={{ left: `${(i / (lineMax * den)) * 100}%` }}/>
            ))}
            <div className={success ? 'ub-marker ub-marker-done' : 'ub-marker'} style={{ left: `${Math.min(100, (mv / (lineMax * den)) * 100)}%` }}><span className="ub-dot"/></div>
          </div>
          <div className="ub-axis">
            {Array.from({ length: lineMax + 1 }).map((_, i) => <span key={i} className="mono small" style={{ color: T.ink3 }}>{i}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

// Крупная запись смешанного числа: целое + дробь.
const MixedLabel = ({ whole, n, d, color }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    <span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', color: color || T.success }}>{whole}</span>
    <Frac n={String(n)} d={String(d)} size="mid" color={color || T.success}/>
  </span>
);

// Непрерывная петля для hook: супергерой Капитан Кувват заряжает два энергоядра до 5/3
// (полное + 2/3), сбрасывается, повторяется. Чистый CSS-loop (как OrbitDiagram в Dars01).
const HeroCharge = () => (
  <div className="hc-row" aria-hidden="true">
    <div className="hc-hero">
      <span className="hc-aura"/>
      <svg viewBox="0 0 80 92" className="hc-fig">
        <circle cx="40" cy="18" r="11" fill="#019ACB"/>
        <path d="M30 31 L50 31 L55 76 L25 76 Z" fill="#0E0E10"/>
        <path d="M30 31 L16 68 L30 58 Z" fill="#FF4F28"/>
        <path d="M50 31 L64 68 L50 58 Z" fill="#FF4F28"/>
        <path d="M43 39 l-9 17 h6 l-4 14 13 -19 h-6 l5 -12 z" fill="#FFD23F"/>
      </svg>
    </div>
    <div className="hc-cores">
      <div className="hc-core"><span className="hc-tick" style={{ bottom: '33.33%' }}/><span className="hc-tick" style={{ bottom: '66.66%' }}/><div className="hc-fill hc-c1"/></div>
      <div className="hc-core"><span className="hc-tick" style={{ bottom: '33.33%' }}/><span className="hc-tick" style={{ bottom: '66.66%' }}/><div className="hc-fill hc-c2"/></div>
    </div>
  </div>
);

// ============================================================
// ФАКТ-БЛОК — синяя карта с мини-анимацией (CSS-only), показывается ТОЛЬКО после верного.
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const AnimDivMod = () => (<div className="fa-dm"><span className="fa-dm-q">2</span><span className="fa-dm-r">3</span></div>);
const AnimProgressSeg = () => (<div className="fa-seg"><span/><span/><span/><span/><div className="fa-seg-fill"/></div>);
const AnimQuarters = () => (<div className="fa-q"><i/><i/><i/><i/></div>);

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

// s0 — HOOK: провокация 5/3 — ошибка? (ловушка M1)
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 'clamp(14px, 2.4vw, 20px)' }}>
          <HeroCharge/>
          <Frac n="5" d="3" size="mid" color={T.accent}/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.objection))}</p>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION (step-gated): доли за пределы одного целого 5/3
// s1 — WARM-UP (spaced retrieval): recall fraction comparison (NOT scored)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const caps = c.step_labels[lang] || c.step_labels.ru;
  const TARGET = 5;
  const [filled, setFilled] = useState(0);
  const stepEndRef = useRef(null);
  const done = filled >= TARGET;
  const capIdx = filled >= 3 ? 1 : 0;
  const charge = () => {
    if (filled >= TARGET) return;
    const nf = filled + 1;
    setFilled(nf);
    if (nf === 3 || nf === TARGET) audio.triggerEvent('button_click', 'step');
  };
  useEffect(() => { if (stepEndRef.current) stepEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [filled]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up ub-glow' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <UnitBars den={3} filled={filled} units={2} splitWholes={true} alive={true} labels={true} success={done}/>
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: 'clamp(8px, 1.6vw, 12px) clamp(16px, 3vw, 22px)', borderRadius: 12, background: '#FBF8F2', boxShadow: 'inset 0 0 0 1px rgba(167, 166, 162, 0.3)' }}>
            <span className="small" style={{ color: T.ink2 }}>{t(c.read_charged)}: <b className="mono" style={{ color: T.accent }}>{filled}</b> {t(c.read_unit)}</span>
            <span className="small" style={{ color: T.ink2 }}>{t(c.read_percore)}: <b className="mono">3</b> {t(c.read_unit)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}><span className="mono small" style={{ color: T.ink3 }}>=</span><Frac n={String(filled)} d="3" size="mid" color={filled >= 3 ? T.accent : T.ink}/></div>
          </div>
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={charge} style={{ padding: 'clamp(11px, 1.9vw, 13px) clamp(24px, 3vw, 34px)', fontSize: 'clamp(13px, 1.6vw, 15px)' }}>⚡ {t(c.btn_step)} +1</button>
          </div>
        )}
        <p ref={stepEndRef} className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[capIdx])}</p>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION (step-gated): 5/3 = 1 целый + 2/3 = 1 2/3, на прямой
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const segs = c.audio[lang] || c.audio.ru;
  const caps = c.step_labels[lang] || c.step_labels.ru;
  const STEPS = segs.length;
  const [step, setStep] = useState(0);
  const stepEndRef = useRef(null);
  const done = step >= STEPS - 1;
  const advance = () => { if (done) return; setStep(s => s + 1); audio.triggerEvent('button_click', 'step'); };
  useEffect(() => { if (stepEndRef.current) stepEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [step]);
  const splitW = step >= 1;
  const showLine = step >= 1;
  const markerVal = step >= 2 ? 5 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up ub-glow' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <UnitBars den={3} filled={5} units={2} splitWholes={splitW} showLine={showLine} lineMax={2} markerValue={markerVal} alive={true} labels={true} success={done}/>
          {done && <span className="ub-pop-in"><MixedLabel whole={1} n={2} d={3}/></span>}
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

// s3 — EXPLORATION (slider): живая связь неправильная <-> смешанная (den=4)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 4;
  const [num, setNum] = useState(2);
  const whole = Math.floor(num / den);
  const rem = num % den;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <UnitBars den={den} filled={num} units={3} splitWholes={true} showLine={true} lineMax={3} live={true} alive={true} compact={true} success={num % den === 0 && num > 0}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Frac n={String(num)} d={String(den)} size="mid" color={T.accent}/>
            <Op>=</Op>
            {num >= den
              ? <MixedLabel whole={whole} n={rem} d={den} color={T.ink}/>
              : <Frac n={String(num)} d={String(den)} size="mid" color={T.ink}/>}
          </div>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Slider value={num} min={1} max={12} onChange={setNum}/>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE 1: правильная / неправильная (улучш. не ошибка)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(18px, 5vw, 44px)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Frac n="3" d="4" size="mid" color={T.ink}/>
              <UnitBars den={4} filled={3} units={1} splitWholes={false} compact={true} maxW={150}/>
              <p className="small mono" style={{ margin: 0, color: T.ink2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.ex_good)}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Frac n="5" d="3" size="mid" color={T.ink}/>
              <UnitBars den={3} filled={5} units={2} splitWholes={true} compact={true} maxW={230}/>
              <p className="small mono" style={{ margin: 0, color: T.ink2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.ex_bad)}</p>
            </div>
          </div>
        </div>
        <p className="body fade-up delay-1" style={{ color: T.ink2, margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2: смешанное = целое + дробь (ловушка-предупреждение M2)
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MixedLabel whole={1} n={2} d={3} color={T.ink}/>
            <Op>=</Op>
            <span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', color: T.ink }}>1</span>
            <Op>+</Op>
            <Frac n="2" d="3" size="mid" color={T.accent}/>
          </div>
        </div>
        <div className="frame-soft fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.warning_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warning))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST choice: найти неправильную дробь (correct на B, ловушка M1 opt3)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [2, 1, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST choice: прочитать рисунок как смешанное (correct на C) + Факт 365 1/4
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12 }}><UnitBars den={3} filled={5} units={2} splitWholes={false} compact={true}/></div></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimQuarters/>}/>}/>;
};

// s8 — TEST input: сколько целых в 11/4 -> 2
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={2}
    renderVisual={({ solved }) => <UnitBars den={4} filled={11} units={3} splitWholes={solved} compact={true} success={solved}/>}/>;
};

// s9 — TEST find-the-wrong: какое утверждение неверное (correct на D, ловушка M2)
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.question_pre)} <span className="italic" style={{ color: T.accent }}>{t(c.question_em)}</span>{t(c.question_post)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE setup (Нилуфар, сок по четвертям литра 9/4)
const Screen11 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
          <UnitBars den={4} filled={9} units={3} splitWholes={false} labels={true}/>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.question_setup))}</h2>
      </div>
    </Stage>
  );
};

// s11 — CASE step: 9/4 = 2 1/4 (correct на A) + Факт GB
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12 }}><UnitBars den={4} filled={9} units={3} splitWholes={false} compact={true}/></div></>);
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimProgressSeg/>}/>}/>;
};

// s12 — TEST FINAL: 8/3 = 2 2/3 (correct на C, ловушки M1+M2) + Факт modulo
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><Frac n="8" d="3" size="mid" color={T.accent}/><UnitBars den={3} filled={8} units={3} splitWholes={false} compact={true}/></div></>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimDivMod/>}/>}/>;
};

// s13 — SUMMARY + закрытие hook + связи
const Screen14 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = c.points[lang] || c.points.ru;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <Frac n="5" d="3" size="mid" color={T.ink2}/>
            <Op>=</Op>
            <MixedLabel whole={1} n={2} d={3}/>
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
export default function MixedNumbersLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
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
/* MATH frac_5_13: UnitBars — ВЕРТИКАЛЬНЫЕ энергоядра (заряд снизу вверх, перелив в следующее ядро) + числовая прямая. */
.ub-wrap { width: 100%; max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; align-items: center; }
.ub-row { display: flex; gap: clamp(12px, 3.4vw, 24px); justify-content: center; align-items: flex-start; }
.ub-unitwrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ub-core { position: relative; display: flex; flex-direction: column; gap: 3px; width: clamp(40px, 9.5vw, 56px); padding: 4px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.55); transition: box-shadow 0.35s; }
.ub-core-whole { box-shadow: inset 0 0 0 2px rgba(31, 122, 77, 0.7), 0 0 16px -4px rgba(31, 122, 77, 0.5); }
.ub-seg { position: relative; overflow: hidden; height: clamp(15px, 3vw, 20px); border-radius: 4px; background: rgba(167, 166, 162, 0.16); transition: background 0.4s ease; transform-origin: bottom; }
.ub-seg-on { background: #FF4F28; box-shadow: 0 0 10px -2px rgba(255, 79, 40, 0.55); animation: ubPop 0.5s cubic-bezier(0.34, 1.25, 0.5, 1); }
.ub-seg-whole { background: #1F7A4D; box-shadow: 0 0 10px -2px rgba(31, 122, 77, 0.5); animation: ubPop 0.5s cubic-bezier(0.34, 1.25, 0.5, 1); }
@keyframes ubPop { 0% { opacity: 0.25; transform: scaleY(0); } 72% { transform: scaleY(1.1); } 100% { opacity: 1; transform: scaleY(1); } }
.ub-live .ub-seg-on, .ub-live .ub-seg-whole { animation: none; }
/* «Живой» заряд: мягкое непрерывное мерцание на заряженных делениях (exploration) */
.ub-alive .ub-seg-on::after, .ub-alive .ub-seg-whole::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent 60%); animation: ubShine 2.2s ease-in-out infinite; pointer-events: none; }
@keyframes ubShine { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.55; } }
.ub-check { position: absolute; top: -9px; right: -9px; width: 18px; height: 18px; border-radius: 50%; background: #1F7A4D; color: #FFFFFF; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px -1px rgba(31, 122, 77, 0.5); }
.ub-label { color: #5A5A60; letter-spacing: 0.03em; }
.ub-compact .ub-core { width: clamp(28px, 6.5vw, 38px); padding: 3px; gap: 2px; border-radius: 8px; }
.ub-compact .ub-seg { height: clamp(11px, 2.5vw, 15px); }
.ub-pop-in { display: inline-block; animation: ubPopIn 0.5s cubic-bezier(0.34, 1.45, 0.6, 1); }
@keyframes ubPopIn { 0% { opacity: 0; transform: translateY(8px) scale(0.82); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
/* MATH frac_5_13: HeroCharge — супергерой заряжает два энергоядра (непрерывная петля, 5/3). */
.hc-row { position: relative; display: flex; gap: clamp(16px, 5vw, 34px); align-items: center; justify-content: center; height: clamp(86px, 17vw, 118px); }
.hc-hero { position: relative; display: flex; align-items: center; justify-content: center; width: clamp(58px, 14vw, 86px); height: 100%; }
.hc-aura { position: absolute; width: 70%; height: 82%; border-radius: 50%; background: radial-gradient(circle, rgba(1, 154, 203, 0.42), transparent 70%); animation: hcAura 1.8s ease-in-out infinite; }
@keyframes hcAura { 0%, 100% { transform: scale(0.9); opacity: 0.45; } 50% { transform: scale(1.16); opacity: 0.85; } }
.hc-fig { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 0 6px rgba(1, 154, 203, 0.4)); }
.hc-cores { display: flex; gap: clamp(8px, 2.4vw, 14px); height: 80%; }
.hc-core { position: relative; width: clamp(20px, 5vw, 30px); height: 100%; border: 2px solid rgba(58, 53, 48, 0.30); border-radius: 7px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(246, 244, 239, 0.15)); overflow: hidden; box-shadow: 0 0 12px -2px rgba(1, 154, 203, 0.3); }
.hc-tick { position: absolute; left: 0; right: 0; height: 1px; background: rgba(58, 53, 48, 0.16); z-index: 2; }
.hc-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: linear-gradient(180deg, #5FD0F5, #019ACB); box-shadow: inset 0 0 10px rgba(1, 154, 203, 0.5); border-radius: 0 0 5px 5px; }
.hc-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: rgba(255, 255, 255, 0.55); animation: hcShine 1.6s ease-in-out infinite; }
.hc-c1 { animation: hcFill1 5.4s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.hc-c2 { animation: hcFill2 5.4s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
@keyframes hcFill1 { 0% { height: 0; } 24% { height: 100%; } 86% { height: 100%; } 96%, 100% { height: 0; } }
@keyframes hcFill2 { 0%, 26% { height: 0; } 48% { height: 66.6%; } 86% { height: 66.6%; } 96%, 100% { height: 0; } }
@keyframes hcShine { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
.ub-line { width: 100%; }
.ub-line-track { position: relative; height: 10px; margin: 14px 6px 0; background: rgba(167, 166, 162, 0.25); border-radius: 99px; }
.ub-tick { position: absolute; top: -3px; width: 2px; height: 16px; background: rgba(167, 166, 162, 0.7); transform: translateX(-1px); }
.ub-tick-whole { background: #0E0E10; height: 20px; top: -5px; }
.ub-marker { position: absolute; top: -7px; width: 3px; height: 24px; background: #0E0E10; border-radius: 2px; transform: translateX(-1.5px); transition: left 0.5s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 3; }
.ub-marker-done { background: #1F7A4D; }
.ub-dot { position: absolute; top: -6px; left: 50%; width: 12px; height: 12px; border-radius: 50%; background: inherit; transform: translateX(-50%); box-shadow: 0 0 8px rgba(14, 14, 16, 0.35); }
.ub-axis { display: flex; justify-content: space-between; margin: 8px 6px 0; }
.ub-glow { animation: ubGlow 0.7s ease; }
@keyframes ubGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }
/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(82px, 17vw, 120px); height: clamp(54px, 12vw, 80px); display: flex; align-items: center; justify-content: center; }
.fact-anim > * { transform: scale(1.55); }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.38; color: #0E0E10; }
/* MATH frac_5_13: ФАКТ-анимации (CSS-only, loop) — divmod / segmented-progress / quarters. */
.fa-dm { display: flex; gap: 5px; align-items: center; }
.fa-dm span { width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; }
.fa-dm-q { background: #019ACB; color: #FFFFFF; animation: faDmQ 2.6s ease-in-out infinite; }
.fa-dm-r { background: rgba(1, 154, 203, 0.20); color: #019ACB; animation: faDmR 2.6s ease-in-out infinite; }
@keyframes faDmQ { 0%, 40% { transform: scale(1); } 20% { transform: scale(1.18); } 60%, 100% { transform: scale(1); } }
@keyframes faDmR { 0%, 60% { transform: scale(1); } 80% { transform: scale(1.18); } 100% { transform: scale(1); } }
.fa-seg { position: relative; width: 52px; height: 12px; display: flex; gap: 3px; }
.fa-seg span { flex: 1; background: rgba(1, 154, 203, 0.18); border-radius: 3px; }
.fa-seg-fill { position: absolute; left: 0; top: 0; height: 100%; background: #019ACB; border-radius: 3px; box-shadow: 0 0 6px rgba(1, 154, 203, 0.5); animation: faSeg 2.8s ease-in-out infinite; }
@keyframes faSeg { 0% { width: 10%; } 55% { width: 62%; } 100% { width: 10%; } }
.fa-q { position: relative; width: 30px; height: 30px; }
.fa-q i { position: absolute; width: 50%; height: 50%; background: #019ACB; opacity: 0; animation: faQuart 3.2s ease-in-out infinite; }
.fa-q i:nth-child(1) { top: 0; left: 0; border-radius: 100% 0 0 0; animation-delay: 0s; }
.fa-q i:nth-child(2) { top: 0; right: 0; border-radius: 0 100% 0 0; animation-delay: 0.4s; }
.fa-q i:nth-child(3) { bottom: 0; right: 0; border-radius: 0 0 100% 0; animation-delay: 0.8s; }
.fa-q i:nth-child(4) { bottom: 0; left: 0; border-radius: 0 0 0 100%; animation-delay: 1.2s; }
@keyframes faQuart { 0%, 10% { opacity: 0; } 30%, 70% { opacity: 1; } 90%, 100% { opacity: 0; } }
/* MATH frac_5_13: noto'g'ri TANLANGAN variant — yumshoq qizil (barcha darslar bilan bir xil). */
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }
/* Accessibility: harakatni kamaytirish so'rovi — bezak/loop animatsiyalar so'ndiriladi (funksiya buzilmaydi). */
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
`;
