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
                <span className="mono small" style={{ minWidth: 20, fontWeight: 700, color: solved && i === correctIdx ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && i === correctIdx ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
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
    const v = parseInt(value, 10); if (isNaN(v)) return;
    const isCorrect = v === correct;
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
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// --- ПОД УРОК: frac_5_10 — Вычитание дробей с равными знаменателями ---
// Визуализатор BackLine: числовая прямая 0..1, маркер прыгает ВЛЕВО (вычитание = шаг назад).
// Анимации: убираемые сегменты гаснут + перечёркиваются, обратный слайд маркера, count-down spin счётчика.
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-10-v2',
  lessonTitle: { ru: 'Вычитание дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni ayirish" }
};
const TOTAL_SCREENS = 13;

// Обучающий урок: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's10', type: 'case',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // s0 — HOOK (konseptual): ayirganda maxraj o'zgaradimi?
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    title: { ru: 'Мохира отмотала сериал назад', uz: "Mohira serialni orqaga qaytardi" },
    lead: { ru: 'Мохира посмотрела 5/6 сериала, но отмотала 2/6 назад, чтобы пересмотреть.', uz: "Mohira serialning 5/6 qismini ko'rgan edi, lekin 2/6 qismini qayta ko'rish uchun orqaga qaytardi." },
    question: { ru: 'Когда вычитаем, нижнее число — знаменатель — изменится?', uz: "Ayirganimizda pastki son — maxraj — o'zgaradimi?" },
    opt0: { ru: 'Нет, знаменатель остаётся', uz: "Yo'q, maxraj o'zgarmaydi" },
    opt1: { ru: 'Да, знаменатель тоже уменьшается', uz: "Ha, maxraj ham kichrayadi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Мохира посмотрела пять шестых сериала, но отмотала две шестых назад, чтобы пересмотреть. Когда мы вычитаем, нижнее число, знаменатель, изменится или останется тем же? Как думаешь? Выбери ответ.', uz: "Mohira serialning oltidan besh qismini ko'rgan edi, lekin oltidan ikki qismini qayta ko'rish uchun orqaga qaytardi. Ayirganimizda pastki son, ya'ni maxraj, o'zgaradimi yoki o'sha bo'lib qoladimi? Sizningcha qanday? Javobni tanlang." }
  },

  // s1 — EXPLORATION (step): son o'qida orqaga qadam, 5/6 − 2/6 = 3/6
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    heading: { ru: 'Шаг назад по числовой прямой', uz: "Son o'qida orqaga qadam" },
    title: { ru: 'Вычесть — значит шагнуть назад по числовой прямой', uz: "Ayirish — son o'qida orqaga qadam tashlash" },
    conclusion: { ru: 'Шагнули назад на 2 шестых. Шаги одного размера — знаменатель остался 6. 5/6 − 2/6 = 3/6.', uz: "Oltidan ikki qadam orqaga tashladik. Qadamlar bir o'lchamda — maxraj 6 bo'lib qoldi. 5/6 − 2/6 = 3/6." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Числовая прямая от нуля до единицы поделена на шесть равных шагов. Нажимай кнопку дальше.',
        'Метка стоит на пяти шестых — это пять шагов от нуля.',
        'Вычесть две шестых — значит шагнуть назад на два шага. Шаги одного размера.',
        'Метка остановилась на трёх шестых. Знаменатель остался шесть, мы только отняли число шагов. Пять шестых минус две шестых равно три шестых.'
      ],
      uz: [
        "Noldan birgacha son o'qi olti teng qadamga bo'lingan. Davom etish tugmasini bosing.",
        "Belgi oltidan beshda turibdi — bu noldan besh qadam.",
        "Oltidan ikkini ayirish — bu ikki qadam orqaga tashlash. Qadamlar bir o'lchamda.",
        "Belgi oltidan uchda to'xtadi. Maxraj olti bo'lib qoldi, biz faqat qadamlar sonini ayirdik. Oltidan besh minus oltidan ikki teng oltidan uch."
      ]
    }
  },

  // s2 — EXPLORATION (jonli): o'quvchi markerni o'zi orqaga suradi (den 8)
  s2: {
    eyebrow: { ru: 'Поиграй', uz: "O'ynab ko'ring" },
    heading: { ru: 'Двигай метку назад сам', uz: "Belgini o'zingiz orqaga suring" },
    title: { ru: 'Двигай назад сам — собери разность.', uz: "O'zingiz orqaga suring — ayirmani toping." },
    label_start: { ru: 'Старт: 7/8', uz: "Boshlanish: 7/8" },
    label_back: { ru: 'Шагов назад', uz: "Orqaga qadam" },
    note: { ru: 'Знаменатель всё время 8 — шаги одного размера. Разность не может стать меньше нуля.', uz: "Maxraj doim 8 — qadamlar bir o'lchamda. Ayirma noldan kichik bo'lolmaydi." },
    btn: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: { ru: 'Подвигай ползунок и сам сделай шаги назад от семи восьмых. Знаменатель всё время восемь, шаги одного размера, поэтому мы просто отнимаем число шагов. Обрати внимание: разность не может стать меньше нуля.', uz: "Slayderni surib, yettidan sakkizdan o'zingiz orqaga qadam tashlang. Maxraj doim sakkiz, qadamlar bir o'lchamda, shuning uchun biz faqat qadamlar sonini ayiramiz. E'tibor bering: ayirma noldan kichik bo'lolmaydi." }
  },

  // s3 — RULE
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Вычитаем числители, знаменатель тот же', uz: "Suratlarni ayiramiz, maxraj o'sha" },
    label: { ru: 'Вычитание при равном знаменателе', uz: "Maxraj teng bo'lganda ayirish" },
    label_back: { ru: 'Вычли', uz: "Ayirildi" },
    title: { ru: 'Вычитаем числители, а знаменатель не меняем.', uz: "Suratlarni ayiramiz, maxrajni o'zgartirmaymiz." },
    card_top: { ru: 'Числитель — сколько долей. Вычитаем: 5 − 2 = 3.', uz: "Surat — nechta ulush. Ayiramiz: 5 − 2 = 3." },
    card_bottom: { ru: 'Знаменатель — размер доли. Он один и тот же, поэтому не меняется.', uz: "Maxraj — ulush o'lchami. U bir xil, shuning uchun o'zgarmaydi." },
    card_line: { ru: '5/6 − 2/6 = 3/6. Знаменатель остался 6, не 0 и не 12.', uz: "5/6 − 2/6 = 3/6. Maxraj 6 bo'lib qoldi, 0 ham, 12 ham emas." },
    audio: { ru: 'Запомни правило. Когда у дробей одинаковый знаменатель, вычитаем только числители, а знаменатель оставляем тем же. Числитель показывает, сколько долей: пять минус два три. Знаменатель это размер доли, он один и тот же, поэтому не меняется. Пять шестых минус две шестых равно три шестых.', uz: "Qoidani eslab qoling. Kasrlarning maxraji bir xil bo'lganda, faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz. Surat nechta ulush ekanini ko'rsatadi: besh minus ikki uch. Maxraj ulush o'lchami, u bir xil, shuning uchun o'zgarmaydi. Oltidan besh minus oltidan ikki teng oltidan uch." }
  },

  // s4 — TEST MC (p1): 4/5 − 1/5 = 3/5  (fakt: yuklanish)
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Вычти дроби с равным знаменателем', uz: "Teng maxrajli kasrlarni ayiring" },
    label: { ru: 'Вычти дроби', uz: "Kasrlarni ayiring" },
    question: { ru: '4/5 − 1/5 = ?', uz: "4/5 − 1/5 = ?" },
    correct_text: { ru: 'Правильно. 4 − 1 = 3, знаменатель 5 не меняется: 3/5.', uz: "To'g'ri. 4 − 1 = 3, maxraj 5 o'zgarmaydi: 3/5." },
    wrong_1: { ru: 'Знаменатели не вычитаются. Знаменатель остаётся 5. Числители: 4 − 1 = 3.', uz: "Maxrajlar ayirilmaydi. Maxraj 5 bo'lib qoladi. Suratlar: 4 − 1 = 3." },
    wrong_2: { ru: 'Это сложение, а не вычитание. 4 + 1 = 5. Нужно отнять: 4 − 1 = 3, выйдет 3/5.', uz: "Bu qo'shish, ayirish emas. 4 + 1 = 5. Ayirish kerak: 4 − 1 = 3, 3/5 chiqadi." },
    wrong_3: { ru: 'Числитель посчитан неверно. 4 − 1 = 3, а не 2. Выйдет 3/5.', uz: "Surat noto'g'ri sanaldi. 4 − 1 = 3, 2 emas. 3/5 chiqadi." },
    wrong_default: { ru: 'Знаменатель 5 остаётся, числители 4 − 1 = 3. Это 3/5.', uz: "Maxraj 5 bo'lib qoladi, suratlar 4 − 1 = 3. Bu 3/5." },
    fact: { ru: 'Процент загрузки на компьютере — это на самом деле доля целого файла, то есть дробь.', uz: "Kompyuterdagi yuklanish foizi — bu aslida butun faylning bir ulushi, ya'ni kasr." },
    audio: {
      intro: { ru: 'Вычти одну пятую из четырёх пятых. Выбери правильный вариант.', uz: "Beshdan to'rtdan beshdan birni ayiring. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Знаменатель пять остаётся. И кстати: процент загрузки файла — это тоже доля целого.', uz: "To'g'ri. Maxraj besh bo'lib qoladi. Aytgancha: fayl yuklanish foizi ham butundan olingan ulush." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s5 — TEST NumInput (p2): 7/9 − 3/9 = ?/9  -> 4
  s5: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найди числитель разности', uz: "Ayirma suratini toping" },
    question: { ru: 'Вычти: 7/9 − 3/9 = ?/9. Введи числитель.', uz: "Ayiring: 7/9 − 3/9 = ?/9. Suratni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель остаётся 9. Вычти только числители: 7 − 3.', uz: "Maxraj 9 bo'lib qoladi. Faqat suratlarni ayiring: 7 − 3." },
    fb_correct: { ru: 'Верно. 7 − 3 = 4, знаменатель 9: получается 4/9.', uz: "To'g'ri. 7 − 3 = 4, maxraj 9: 4/9 chiqadi." },
    audio: {
      intro: { ru: 'Вычти три девятых из семи девятых. Введи числитель и нажми проверить.', uz: "To'qqizdan yettidan to'qqizdan uchni ayiring. Suratni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Семь минус три четыре, знаменатель девять.', uz: "To'g'ri. Yetti minus uch to'rt, maxraj to'qqiz." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь девять, вычти числители семь и три.', uz: "Unchalik emas. Maxrajni to'qqiz qoldiring, suratlar yetti va uchni ayiring." }
    }
  },

  // s6 — RULE: maxsus holat — natija nol
  s6: {
    eyebrow: { ru: 'Особый случай', uz: "Maxsus holat" },
    heading: { ru: 'Когда разность равна нулю', uz: "Ayirma nolga teng bo'lganda" },
    label: { ru: 'Когда долей не осталось', uz: "Ulush qolmaganda" },
    title: { ru: 'Если числители равны — разность равна нулю.', uz: "Suratlar teng bo'lsa — ayirma nolga teng." },
    card_top: { ru: '3/7 − 3/7: отняли все доли. Осталось 0 долей из 7.', uz: "3/7 − 3/7: hamma ulushni ayirdik. 7 dan 0 ulush qoldi." },
    card_line: { ru: '3/7 − 3/7 = 0/7 = 0. Ноль долей — это просто ноль.', uz: "3/7 − 3/7 = 0/7 = 0. Nol ulush — bu shunchaki nol." },
    audio: { ru: 'Бывает, что вычитаем все доли. Три седьмых минус три седьмых: отняли все три доли, осталось ноль долей из семи. Ноль седьмых это просто ноль. Знаменатель при этом всё равно не менялся.', uz: "Ba'zan hamma ulushni ayiramiz. Yettidan uch minus yettidan uch: uchala ulushni ayirdik, yettidan nol ulush qoldi. Yettidan nol bu shunchaki nol. Maxraj baribir o'zgarmadi." }
  },

  // s7 — TEST "noto'g'risini top" (p3)
  s7: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Найди неверное равенство', uz: "Noto'g'ri tenglikni toping" },
    label: { ru: 'Какое равенство НЕВЕРНО?', uz: "Qaysi tenglik NOTO'G'RI?" },
    question: { ru: 'Выбери запись, где допущена ошибка.', uz: "Xato qilingan yozuvni tanlang." },
    correct_text: { ru: 'Верно — ошибка здесь. Знаменатель вычитать нельзя, он остаётся 6: 5/6 − 2/6 = 3/6.', uz: "To'g'ri — xato shu yerda. Maxrajni ayirib bo'lmaydi, u 6 bo'lib qoladi: 5/6 − 2/6 = 3/6." },
    wrong_1: { ru: 'Эта запись верна: 4 − 1 = 3, знаменатель 5 не менялся. Ошибка в другом варианте.', uz: "Bu yozuv to'g'ri: 4 − 1 = 3, maxraj 5 o'zgarmadi. Xato boshqa variantda." },
    wrong_2: { ru: 'Эта запись верна: 7 − 3 = 4, знаменатель 8 не менялся. Ищи, где изменили знаменатель.', uz: "Bu yozuv to'g'ri: 7 − 3 = 4, maxraj 8 o'zgarmadi. Maxraj o'zgartirilgan joyni qidiring." },
    wrong_3: { ru: 'Эта запись верна: 6 − 6 = 0. Ошибка там, где тронули знаменатель.', uz: "Bu yozuv to'g'ri: 6 − 6 = 0. Xato maxrajga tegilgan joyda." },
    wrong_default: { ru: 'Ошибка там, где вычли и знаменатели. Знаменатель всегда остаётся прежним.', uz: "Xato maxrajlar ham ayirilgan joyda. Maxraj doim o'sha bo'lib qoladi." },
    audio: {
      intro: { ru: 'Внимание: найди запись, где допущена ошибка. Не где верно, а где неверно. Выбери ответ.', uz: "Diqqat: xato qilingan yozuvni toping. To'g'risini emas, noto'g'risini. Javobni tanlang." },
      on_correct: { ru: 'Верно. В том варианте вычли и знаменатель — так нельзя.', uz: "To'g'ri. O'sha variantda maxraj ham ayirilgan — bunday bo'lmaydi." },
      on_wrong: { ru: 'Это верная запись. Ищи ту, где изменили знаменатель.', uz: "Bu to'g'ri yozuv. Maxraj o'zgartirilganini qidiring." }
    }
  },

  // s8 — TEST MC (p4, markaziy M1): 5/6 − 2/6 = 3/6  (fakt: batareya)
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Вычти доли, не трогай знаменатель', uz: "Ulushlarni ayiring, maxrajga tegmang" },
    label: { ru: 'Вычти дроби', uz: "Kasrlarni ayiring" },
    question: { ru: '5/6 − 2/6 = ?', uz: "5/6 − 2/6 = ?" },
    correct_text: { ru: 'Правильно. 5 − 2 = 3, знаменатель 6 не меняется: 3/6.', uz: "To'g'ri. 5 − 2 = 3, maxraj 6 o'zgarmaydi: 3/6." },
    wrong_1: { ru: 'Знаменатель не может стать 0. Доли остаются шестыми. Числители: 5 − 2 = 3, выйдет 3/6.', uz: "Maxraj 0 bo'lolmaydi. Ulushlar oltidan bo'lib qoladi. Suratlar: 5 − 2 = 3, 3/6 chiqadi." },
    wrong_2: { ru: 'Знаменатели не вычитаются (6 − 2). Знаменатель остаётся 6. Числители 5 − 2 = 3.', uz: "Maxrajlar ayirilmaydi (6 − 2). Maxraj 6 bo'lib qoladi. Suratlar 5 − 2 = 3." },
    wrong_3: { ru: 'Это вычитание, а не сложение. Нужно 5 − 2 = 3, а не 5 + 2. Выйдет 3/6.', uz: "Bu ayirish, qo'shish emas. 5 − 2 = 3 kerak, 5 + 2 emas. 3/6 chiqadi." },
    wrong_default: { ru: 'Знаменатель 6 остаётся, числители 5 − 2 = 3. Это 3/6.', uz: "Maxraj 6 bo'lib qoladi, suratlar 5 − 2 = 3. Bu 3/6." },
    fact: { ru: 'Значок заряда телефона показывает дробью, сколько отняли от полного заряда.', uz: "Telefon zaryad belgisi to'la zaryaddan qancha ayrilganini kasr bilan ko'rsatadi." },
    audio: {
      intro: { ru: 'Вычти две шестых из пяти шестых. Выбери правильный вариант.', uz: "Oltidan beshdan oltidan ikkini ayiring. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Знаменатель шесть остаётся. Кстати, заряд телефона тоже показывает долю целого.', uz: "To'g'ri. Maxraj olti bo'lib qoladi. Aytgancha, telefon zaryadi ham butundan ulushni ko'rsatadi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s9 — CASE setup: Jahongir, batareya
  s9: {
    eyebrow: { ru: 'Задача · заряд', uz: "Masala · zaryad" },
    heading: { ru: 'Сколько заряда осталось у Жахонгира?', uz: "Jahongirda qancha zaryad qoldi?" },
    title: { ru: 'У Жахонгира телефон заряжен на 8/10.', uz: "Jahongirning telefoni 8/10 ga zaryadlangan." },
    body_p1: { ru: 'Шкала заряда поделена на 10 равных долей. Жахонгир потратил 3/10 заряда. Сколько осталось?', uz: "Zaryad shkalasi 10 ta teng ulushga bo'lingan. Jahongir 3/10 zaryadni sarfladi. Qancha qoldi?" },
    card_line_label: { ru: 'Было', uz: "Bor edi" },
    card_line_value: { ru: '8/10 заряда', uz: "8/10 zaryad" },
    card_parts_label: { ru: 'Потратил', uz: "Sarfladi" },
    card_parts_value: { ru: '3/10', uz: "3/10" },
    outro: { ru: 'Знаменатель у обеих долей один — десятые. Помоги Жахонгиру.', uz: "Har ikkala ulushning maxraji bir — o'ndan. Jahongirga yordam bering." },
    btn_help: { ru: 'Помочь Жахонгиру', uz: "Jahongirga yordam berish" },
    audio: { ru: 'У Жахонгира телефон заряжен на восемь десятых. Шкала поделена на десять равных долей. Он потратил три десятых заряда. Сколько осталось? Знаменатель у обеих долей один, десятые. Помоги на следующем шаге.', uz: "Jahongirning telefoni o'ndan sakkizga zaryadlangan. Shkala o'n teng ulushga bo'lingan. U o'ndan uch zaryadni sarfladi. Qancha qoldi? Har ikkala ulushning maxraji bir, o'ndan. Keyingi bosqichda yordam bering." }
  },

  // s10 — CASE drag (p5): batareyadan 3 katakni olib tashlash -> 5/10
  s10: {
    eyebrow: { ru: 'Задача · 1-й шаг', uz: "Masala · 1-qadam" },
    heading: { ru: 'Убери потраченные доли заряда', uz: "Sarflangan zaryad ulushlarini oling" },
    title: { ru: 'Убери потраченные доли: вытащи 3 десятых из заряда.', uz: "Sarflangan ulushlarni oling: zaryaddan 3 ta o'ndan birni chiqaring." },
    hint: { ru: 'Заряд был 8 долей. Убери ровно 3 доли — потяни их вниз. Знаменатель остаётся 10.', uz: "Zaryad 8 ulush edi. Rosa 3 ulushni oling — pastga torting. Maxraj 10 bo'lib qoladi." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    fb_correct: { ru: 'Верно. Из 8 долей убрали 3, осталось 5. 8/10 − 3/10 = 5/10.', uz: "To'g'ri. 8 ulushdan 3 tasi olindi, 5 tasi qoldi. 8/10 − 3/10 = 5/10." },
    audio: {
      intro: { ru: 'Вытащи три десятых из заряда: потяни три доли вниз. Знаменатель остаётся десять. Потом нажми проверить.', uz: "Zaryaddan o'ndan uchni oling: uchta ulushni pastga torting. Maxraj o'n bo'lib qoladi. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Осталось пять десятых.', uz: "To'g'ri. O'ndan besh qoldi." },
      on_wrong: { ru: 'Пока не то. Убрать нужно ровно три доли из восьми.', uz: "Hozircha emas. Sakkizdan rosa uchta ulushni olish kerak." }
    }
  },

  // s11 — CASE conclusion FINAL: 8/10 − 3/10 = 5/10  (fakt: Misr)
  s11: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    title: { ru: 'Посчитай оставшийся заряд', uz: "Qolgan zaryadni hisoblang" },
    label: { ru: 'Сколько заряда осталось?', uz: "Qancha zaryad qoldi?" },
    question: { ru: '8/10 − 3/10 = ?', uz: "8/10 − 3/10 = ?" },
    correct_text: { ru: 'Правильно. 8 − 3 = 5, знаменатель 10: осталось 5/10 заряда.', uz: "To'g'ri. 8 − 3 = 5, maxraj 10: 5/10 zaryad qoldi." },
    wrong_1: { ru: 'Знаменатель не может стать 0. Доли остаются десятыми. 8 − 3 = 5, выйдет 5/10.', uz: "Maxraj 0 bo'lolmaydi. Ulushlar o'ndan bo'lib qoladi. 8 − 3 = 5, 5/10 chiqadi." },
    wrong_2: { ru: 'Знаменатель не удваивается до 20. Доли остаются десятыми. 8 − 3 = 5, выйдет 5/10.', uz: "Maxraj 20 ga ikkilanmaydi. Ulushlar o'ndan bo'lib qoladi. 8 − 3 = 5, 5/10 chiqadi." },
    wrong_3: { ru: 'Это вычитание: 8 − 3 = 5, а не 8 + 3. Осталось 5/10.', uz: "Bu ayirish: 8 − 3 = 5, 8 + 3 emas. 5/10 qoldi." },
    wrong_default: { ru: 'Знаменатель 10 остаётся, числители 8 − 3 = 5. Это 5/10.', uz: "Maxraj 10 bo'lib qoladi, suratlar 8 − 3 = 5. Bu 5/10." },
    fact: { ru: 'В Древнем Египте дроби записывали только как сумму долей с числителем 1.', uz: "Qadimgi Misrda kasrlar faqat surati bir bo'lgan ulushlar yig'indisi bilan yozilgan." },
    audio: {
      intro: { ru: 'Вычти три десятых из восьми десятых. Сколько заряда осталось? Выбери ответ.', uz: "O'ndan sakkizdan o'ndan uchni ayiring. Qancha zaryad qoldi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Осталось пять десятых. А в Древнем Египте такие дроби писали только через доли с единицей наверху.', uz: "To'g'ri. O'ndan besh qoldi. Qadimgi Misrda esa bunday kasrlar faqat yuqorisida bir turgan ulushlar bilan yozilgan." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s12 — SUMMARY + ConnectionsBlock
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что мы усвоили', uz: "Nimani o'rgandik" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты вычитаешь дроби с равным знаменателем.', uz: "Endi siz teng maxrajli kasrlarni ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'У дробей с равным знаменателем вычитаем числители.', uz: "Teng maxrajli kasrlarda suratlarni ayiramiz." },
    main_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    main_3: { ru: 'Вычитать знаменатели нельзя (5/6 − 2/6 это 3/6, а не 3/0).', uz: "Maxrajlarni ayirib bo'lmaydi (5/6 − 2/6 bu 3/6, 3/0 emas)." },
    main_4: { ru: 'Если числители равны, разность равна нулю (3/7 − 3/7 = 0).', uz: "Suratlar teng bo'lsa, ayirma nolga teng (3/7 − 3/7 = 0)." },
    back_to_hook: { ru: 'Знаменатель при вычитании не меняется — он остаётся тем же. Мохира: 5/6 − 2/6 = 3/6.', uz: "Ayirganda maxraj o'zgarmaydi — u o'sha bo'lib qoladi. Mohira: 5/6 − 2/6 = 3/6." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с равным знаменателем» (тот же принцип: вычитаем числители) и «Что такое дробь».', uz: "«Teng maxrajli kasrlarni qo'shish» (o'sha tamoyil: suratlarni ayiramiz) va «Kasr nima»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты вычитаешь дроби с равным знаменателем. Вычитаем числители, а знаменатель оставляем тем же, это размер доли. Вычитать знаменатели нельзя: пять шестых минус две шестых это три шестых, а не три нолевых. А если числители равны, разность равна нулю. Дальше научимся вычитать дроби с разными знаменателями.', uz: "Zo'r. Endi siz teng maxrajli kasrlarni ayirasiz. Suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz, bu ulush o'lchami. Maxrajlarni ayirib bo'lmaydi: oltidan besh minus oltidan ikki bu oltidan uch. Suratlar teng bo'lsa, ayirma nol bo'ladi. Keyin har xil maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_10: StepLine — числовая прямая 0..1, метка шагает НАЗАД.
// Вычитание = шаг влево; знаменатель (число делений) не меняется.
// ============================================================
const StepLine = ({ den, pos, hi = false, loop = false, stepIn = false, alive = false, h = 80 }) => {
  const pct = (pos / den) * 100;
  const fillCls = `sl-fill${loop ? ' sl-loop-fill' : ''}${stepIn ? ' sl-stepin-fill' : ''}`;
  const markCls = `${hi ? 'sl-marker sl-marker-hi' : 'sl-marker'}${loop ? ' sl-loop' : ''}${stepIn ? ' sl-stepin' : ''}${alive ? ' sl-alive' : ''}`;
  return (
    <div className="sl-wrap" style={{ height: h }}>
      <div className="sl-track"/>
      <div className={fillCls} style={{ width: `${pct}%` }}/>
      {Array.from({ length: den + 1 }).map((_, i) => (
        <div key={i} className="sl-tick" style={{ left: `${(i / den) * 100}%` }}/>
      ))}
      <div className={markCls} style={{ left: `${pct}%` }}>
        {!loop && <span className="sl-flag">{pos}/{den}</span>}
      </div>
      <span className="sl-end sl-end-0">0</span>
      <span className="sl-end sl-end-1">1</span>
    </div>
  );
};

// Подпись-формула вычитания: a/d − b/d (= res/d или 0).
const FracMinus = ({ a, b, d, res, showRes = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    <Frac n={String(a)} d={String(d)} size="mid" color={T.accent}/>
    <Op>−</Op>
    <Frac n={String(b)} d={String(d)} size="mid" color={T.blue}/>
    {showRes && <><Op>=</Op>{res === 0 ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>0</span> : <Frac n={String(res)} d={String(d)} size="mid" color={T.success}/>}</>}
  </div>
);

// Мини-полоса для шапки test-экрана: показывает уменьшаемое (условие), не результат.
const MinuendBar = ({ den, num, color = T.accent }) => (
  <div className="mb-wrap">
    {Array.from({ length: den }).map((_, i) => (
      <div key={i} className="mb-cell" style={{ background: i < num ? color : 'transparent', borderRight: i < den - 1 ? `2px solid ${T.bg}` : 'none' }}/>
    ))}
    <span className="mb-shimmer"/>
  </div>
);

// TvRewind — хук-анимация по сюжету: экран ТВ, внутри полоса просмотра заполняется до 5/6
// и «отматывается» назад к 3/6 (loop) + значок ◄◄. Деления-знаменатель остаются на месте.
const TvRewind = () => (
  <div className="tv">
    <div className="tv-screen">
      {[1, 2, 3, 4, 5].map((i) => (<span key={i} className="tv-tick" style={{ left: `${(i / 6) * 100}%` }}/>))}
      <span className="tv-rew">◄◄</span>
      <div className="tv-seek">
        <div className="tv-seek-fill"/>
        <div className="tv-seek-head"/>
      </div>
    </div>
    <div className="tv-neck"/>
    <div className="tv-base"/>
  </div>
);

// FloatFracs — декоративный дрейф: бледные дроби и «−» медленно покачиваются. Заполняет пустые зоны движением.
const FloatFracs = ({ items }) => (
  <div className="ff-wrap" aria-hidden="true">
    {items.map((it, i) => (
      <span key={i} className={`ff ff-${(i % 4) + 1}`}>
        {it === '-' ? <Op size="sm">−</Op> : <Frac n={it[0]} d={it[1]} size="sm"/>}
      </span>
    ))}
  </div>
);

// ============================================================
// ФАКТ-БЛОК (IT) — пилот: маленькая карта с мини-анимацией, не мешает основному.
// Только визуал (без аудио), чтобы не конкурировать с основным нарративом.
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const FACT_BADGE_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
// Мини-анимации (CSS-only, без set-state-in-effect)
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/><span className="fa-prog-arr">↓</span></div>);
const AnimBattery = () => (<div className="fa-bat"><div className="fa-bat-fill"/><span className="fa-bat-tip"/><span className="fa-bat-bolt">⚡</span></div>);
const AnimEgypt = () => (<div className="fa-pyr"><span className="fa-pyr-sun"/><span className="fa-pyr-tri"/></div>);

const FactCard = ({ text, anim, badge = FACT_BADGE }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge)}</p>
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
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; });
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

// s0 — HOOK (без персонажей): провокация 5/6 − 2/6 = 3/0
// s0 — HOOK (konseptual)
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1 hook-alive" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <TvRewind/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="5" d="6" size="mid" color={T.accent}/><Op>−</Op><Frac n="2" d="6" size="mid" color={T.blue}/><Op>=</Op><span className="mop hk-q" style={{ color: T.accent }}>?</span></div>
        </div>
        <h2 className="title h-sub fade-up delay-2">{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: StepLine 5/6 -> 3/6
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const pos = step >= 3 ? 3 : 5;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          <StepLine den={6} pos={pos} hi={step >= 3} alive/>
          {step >= 1 && <FracMinus a={5} b={2} d={6} res={3} showRes={step >= 3}/>}
          {step >= 3 && <p className="body" style={{ margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: 7/8 - back/8
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 8, start = 7;
  const [back, setBack] = useState(0);
  const pos = start - back;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          <StepLine den={den} pos={pos} alive/>
          <FracMinus a={start} b={back} d={den} res={pos}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.label_back)}: {back}/{den}</p>
          <Slider value={back} min={0} max={start} onChange={setBack}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center' }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s3 — RULE
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 6, start = 5;
  const [back, setBack] = useState(0);
  const pos = start - back;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <StepLine den={den} pos={pos} hi={back > 0} alive/>
          <FracMinus a={start} b={back} d={den} res={pos}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.label_back)}: {back}/{den}</p>
          <Slider value={back} min={0} max={start} onChange={setBack}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center' }}>{mt(t(c.card_bottom))}</p>
      </div>
    </Stage>
  );
};

// s4 — TEST MC p1: 4/5 - 1/5 = 3/5
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const base = [<Frac n="3" d="5" size="mid"/>, <Frac n="3" d="0" size="mid"/>, <Frac n="5" d="5" size="mid"/>, <Frac n="2" d="5" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (
    <>
      <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>
      <h2 className="title h-sub">{mt(t(c.question))}</h2>
      <div className="frame" style={{ marginTop: 12 }}><MinuendBar den={5} num={4}/></div>
    </>
  );
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s5 — TEST NumInput p2: 7/9 - 3/9 -> 4
const Screen5 = (props) => {
  const c = CONTENT.s5;
  return <NumInputScreen {...props} idx={5} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[5]} screenContent={c} correctValue={4}
    renderVisual={({ solved }) => <StepLine den={9} pos={solved ? 4 : 7} hi={solved} alive/>}/>;
};

// s6 — RULE: natija nol
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <StepLine den={7} pos={0} hi alive/>
          <FracMinus a={3} b={3} d={7} res={0}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p>
            <p className="small" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
        <FloatFracs items={[['3', '7'], '-', ['3', '7'], ['0', '7']]}/>
      </div>
    </Stage>
  );
};

// s7 — TEST "noto'g'risini top" p3: qaysi XATO?
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const eq = (a, b, d, r, rd) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Frac n={String(a)} d={String(d)} size="sm"/><Op size="sm">−</Op><Frac n={String(b)} d={String(d)} size="sm"/><Op size="sm">=</Op>{rd === 0 ? <span className="mono" style={{ fontSize: 'clamp(15px, 2.2vw, 18px)', fontWeight: 600 }}>0</span> : <Frac n={String(r)} d={String(rd)} size="sm"/>}
    </span>
  );
  // base[0] — XATO yozuv (to'g'ri javob), qolganlari to'g'ri tengliklar
  const base = [eq(5, 2, 6, 3, 0), eq(4, 1, 5, 3, 5), eq(7, 3, 8, 4, 8), eq(6, 6, 7, 0, 0)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — TEST MC p4 (markaziy): 5/6 - 2/6 = 3/6
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [<Frac n="3" d="6" size="mid"/>, <Frac n="3" d="0" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="7" d="6" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (
    <>
      <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>
      <h2 className="title h-sub">{mt(t(c.question))}</h2>
      <div className="frame" style={{ marginTop: 12 }}><MinuendBar den={6} num={5}/></div>
    </>
  );
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimBattery/>}/>}/>;
};

// s9 — CASE setup: Jahongir batareya
const Screen9 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <MinuendBar den={10} num={8}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.card_line_value))}</p></div>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.card_parts_value))}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{mt(t(c.outro))}</p>
        <FloatFracs items={[['8', '10'], '-', ['3', '10'], ['5', '10']]}/>
      </div>
    </Stage>
  );
};

// s10 — CASE drag/remove p5: batareyadan 3 katak olib tashlash -> 5/10
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const den = 10, startFilled = 8, target = 3;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [removed, setRemoved] = useState(() => wasSolved ? new Set([5, 6, 7]) : new Set());
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const introAdvancedRef = useRef(wasSolved);
  const toggle = (i) => {
    if (solved) return;
    setRemoved(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
    setHintShown(false);
  };
  const check = () => {
    if (solved) return;
    const ok = removed.size === target;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: 'practice', screenIdx: 10, question: c.title[lang], correctAnswer: '5/10', studentAnswer: `${startFilled - removed.size}/10`, correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <div className="bt-wrap">
            {Array.from({ length: den }).map((_, i) => {
              const inFill = i < startFilled;
              const isOut = removed.has(i);
              const filled = inFill && !isOut;
              return (
                <button key={i} className={filled ? 'bt-cell bt-on' : 'bt-cell'} disabled={!inFill || solved} onClick={() => toggle(i)}
                  style={{ borderRight: i < den - 1 ? `2px solid ${T.bg}` : 'none' }}>
                  {isOut && <span className="bt-x">×</span>}
                </button>
              );
            })}
            <span className="bt-tip"/>
          </div>
          <FracMinus a={8} b={removed.size} d={10} res={8 - removed.size} showRes={solved}/>
        </div>
        {!solved && <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s11 — CASE conclusion FINAL: 8/10 - 3/10 = 5/10
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="5" d="10" size="mid"/>, <Frac n="5" d="0" size="mid"/>, <Frac n="5" d="20" size="mid"/>, <Frac n="11" d="10" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (
    <>
      <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>
      <h2 className="title h-sub">{mt(t(c.question))}</h2>
      <div className="frame" style={{ marginTop: 12 }}><MinuendBar den={10} num={8}/></div>
    </>
  );
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FACT_BADGE_HIST} anim={<AnimEgypt/>}/>}/>;
};

// s12 — SUMMARY
const Screen12 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FracMinus a={5} b={2} d={6} res={3}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};


// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionSubtractSameDenLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12];
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

// ============================================================
// CSS-БЛОК (STYLES) — визуальный язык v15 из infrastructure_v1 + BackLine (frac_5_10)
// ============================================================
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
/* HOOK jonli animatsiya (uzluksiz bezakli harakat — Dars01 uslubiga monand) */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }
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
/* MATH frac_5_10: BackLine — health-bar: сплошная заливка плавно убывает (transition width) + маркер едет. */
.bl-bar { position: relative; width: 100%; height: 32px; border-radius: 9px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.6); }
.bl-ghost { position: absolute; top: 0; bottom: 0; left: 0; background: rgba(255, 79, 40, 0.12); border-radius: 9px 0 0 9px; }
.bl-fill { position: absolute; top: 0; bottom: 0; left: 0; background: #FF4F28; border-radius: 9px 0 0 9px; transition: width 0.6s cubic-bezier(0.34, 1.1, 0.64, 1); }
.bl-fill-done { background: #1F7A4D; }
.bl-tick { position: absolute; top: 0; bottom: 0; width: 2px; background: #F6F4EF; transform: translateX(-1px); }
.bl-hit { position: absolute; top: 0; bottom: 0; cursor: pointer; z-index: 3; }
.bl-marker { position: absolute; top: -7px; bottom: -7px; width: 3px; background: #0E0E10; border-radius: 2px; transform: translateX(-1.5px); transition: left 0.6s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 4; }
.bl-dot { position: absolute; top: -7px; left: 50%; width: 13px; height: 13px; border-radius: 50%; background: #0E0E10; transform: translateX(-50%); box-shadow: 0 0 8px rgba(14, 14, 16, 0.4); }
.bl-axis { display: flex; justify-content: space-between; margin-top: 6px; }
.bl-count { display: flex; justify-content: center; margin-top: 8px; animation: blSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes blSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.bl-glow { animation: blGlow 0.7s ease; }
@keyframes blGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }

/* MATH frac_5_10: SubMachine — «машина вычитания»: числитель↓, знаменатель заблокирован. */
.sm-rows { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 420px; }
.sm-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #FFFFFF; border-radius: 10px; padding: 10px 14px; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.16); transition: box-shadow 0.4s ease; }
.sm-tag { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.sm-eq { display: inline-flex; align-items: center; gap: 6px; font-size: clamp(17px, 2.5vw, 22px); font-weight: 600; }
.sm-res { font-family: 'Fraunces', serif; font-weight: 600; color: #1F7A4D; display: inline-block; animation: blSpin 0.45s cubic-bezier(0.34, 1.4, 0.64, 1); }
.sm-lock { font-family: 'Manrope', sans-serif; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #1F7A4D; display: inline-flex; align-items: center; gap: 4px; }
.sm-lock::before { content: '🔒'; font-size: 0.85em; }

/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: 72px; display: flex; align-items: center; justify-content: center; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(13px, 1.6vw, 14px); line-height: 1.45; color: #0E0E10; }
/* progress (загрузка): полоса заполняется + бегущая стрелка вниз */
.fa-prog { position: relative; width: 66px; height: 16px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.2s ease-in-out infinite; }
@keyframes faProg { 0% { width: 6%; } 60% { width: 80%; } 100% { width: 6%; } }
.fa-prog-arr { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: #FFFFFF; animation: faArr 1.1s ease-in-out infinite; }
@keyframes faArr { 0%, 100% { transform: translate(-50%, -75%); opacity: 0.5; } 50% { transform: translate(-50%, -25%); opacity: 1; } }
/* battery (заряд): уровень + пульсирующая молния */
.fa-bat { position: relative; width: 58px; height: 28px; border: 2px solid #019ACB; border-radius: 6px; padding: 2px; }
.fa-bat-tip { position: absolute; right: -6px; top: 8px; width: 4px; height: 10px; background: #019ACB; border-radius: 0 2px 2px 0; }
.fa-bat-fill { height: 100%; border-radius: 3px; animation: faBat 2.8s ease-in-out infinite; }
@keyframes faBat { 0% { width: 90%; background: #1F7A4D; } 50% { width: 26%; background: #FF4F28; } 100% { width: 90%; background: #1F7A4D; } }
.fa-bat-bolt { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; animation: faBolt 1.4s ease-in-out infinite; }
@keyframes faBolt { 0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; } 50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; } }
/* slider (громкость): заполнение + бегущий бегунок */
.fa-sld { position: relative; width: 66px; height: 26px; display: flex; align-items: center; }
.fa-sld-track { position: absolute; left: 0; right: 0; height: 5px; border-radius: 99px; background: rgba(1, 154, 203, 0.22); }
.fa-sld-fill { position: absolute; left: 0; height: 5px; border-radius: 99px; background: #019ACB; animation: faSldFill 2.6s ease-in-out infinite; }
@keyframes faSldFill { 0% { width: 62%; } 50% { width: 8%; } 100% { width: 62%; } }
.fa-sld-knob { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: 50%; background: #019ACB; transform: translate(-50%, -50%); box-shadow: 0 0 0 3px #EAF6FB, 0 0 10px rgba(1, 154, 203, 0.6); animation: faSld 2.6s ease-in-out infinite; }
@keyframes faSld { 0% { left: 62%; } 50% { left: 8%; } 100% { left: 62%; } }
/* egypt (история): пирамида пульсирует + солнце движется */
.fa-pyr { position: relative; width: 60px; height: 34px; display: flex; align-items: flex-end; justify-content: center; }
.fa-pyr-tri { width: 0; height: 0; border-left: 26px solid transparent; border-right: 26px solid transparent; border-bottom: 30px solid #019ACB; animation: faPyr 2.6s ease-in-out infinite; }
@keyframes faPyr { 0%, 100% { filter: drop-shadow(0 0 0 rgba(1, 154, 203, 0)); transform: translateY(0); } 50% { filter: drop-shadow(0 0 9px rgba(1, 154, 203, 0.6)); transform: translateY(-2px); } }
.fa-pyr-sun { position: absolute; top: 0; left: 50%; width: 10px; height: 10px; border-radius: 50%; background: #FF9A3C; box-shadow: 0 0 8px rgba(255, 154, 60, 0.7); animation: faSun 3.2s ease-in-out infinite; }
@keyframes faSun { 0% { transform: translateX(-26px); opacity: 0.4; } 50% { transform: translateX(20px); opacity: 1; } 100% { transform: translateX(-26px); opacity: 0.4; } }

/* MATH frac_5_10: StepLine (son o'qida orqaga qadam) + MinuendBar + batareya (s10 drag/remove). */
.sl-wrap { position: relative; width: 100%; max-width: 440px; margin: 0 auto; }
.sl-track { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; border-radius: 99px; background: rgba(167, 166, 162, 0.30); }
.sl-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; border-radius: 99px; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.45); transition: width 0.5s cubic-bezier(0.34, 1.1, 0.64, 1); }
.sl-tick { position: absolute; top: 50%; width: 2px; height: 10px; transform: translate(-50%, -50%); background: rgba(167, 166, 162, 0.7); border-radius: 2px; }
.sl-marker { position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%; background: #FF4F28; transform: translate(-50%, -50%); box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px rgba(255, 79, 40, 0.55); transition: left 0.5s cubic-bezier(0.34, 1.4, 0.64, 1), background 0.3s; z-index: 2; }
.sl-marker-hi { background: #1F7A4D; box-shadow: 0 0 0 4px #F6F4EF, 0 0 14px rgba(31, 122, 77, 0.6); }
/* MATH frac_5_10: «живой» маркер на примерах — расходящееся кольцо (ripple), цвет нейтральный. */
.sl-alive::after { content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(58, 53, 48, 0.35); transform: translate(-50%, -50%); pointer-events: none; animation: slPing 1.9s ease-out infinite; }
@keyframes slPing { 0% { transform: translate(-50%, -50%) scale(0.55); opacity: 0.85; } 100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; } }
.sl-flag { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 13px); font-weight: 600; color: #0E0E10; white-space: nowrap; background: #FFFFFF; padding: 1px 6px; border-radius: 6px; box-shadow: 0 3px 8px -3px rgba(58, 53, 48, 0.25); }
.sl-end { position: absolute; top: calc(50% + 14px); font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.3vw, 12px); color: #A7A6A2; }
.sl-end-0 { left: 0; transform: translateX(-50%); }
.sl-end-1 { right: 0; transform: translateX(50%); }
.sl-loop { animation: slMarkLoop 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite, slMarkGlow 1.4s ease-in-out infinite !important; }
@keyframes slMarkLoop { 0%, 20% { left: 83.333%; } 50%, 70% { left: 50%; } 100% { left: 83.333%; } }
@keyframes slMarkGlow { 0%, 100% { box-shadow: 0 0 0 4px #F6F4EF, 0 0 8px rgba(255, 79, 40, 0.5); } 50% { box-shadow: 0 0 0 4px #F6F4EF, 0 0 20px rgba(255, 79, 40, 0.9); } }
/* MATH frac_5_10: пульс «?» в хуке. */
.hk-q { display: inline-block; animation: hkQ 1.3s ease-in-out infinite; }
@keyframes hkQ { 0%, 100% { transform: scale(1); opacity: 0.7; text-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { transform: scale(1.25); opacity: 1; text-shadow: 0 0 12px rgba(255, 79, 40, 0.5); } }
.sl-loop-fill { animation: slFillLoop 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite !important; }
@keyframes slFillLoop { 0%, 20% { width: 83.333%; } 50%, 70% { width: 50%; } 100% { width: 83.333%; } }
.sl-stepin { animation: slStepIn 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) backwards; }
@keyframes slStepIn { from { left: 83.333%; } }
.sl-stepin-fill { animation: slStepInFill 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) backwards; }
@keyframes slStepInFill { from { width: 83.333%; } }
.mb-wrap { position: relative; display: flex; width: 100%; max-width: 360px; height: 42px; border-radius: 10px; overflow: hidden; background: #FFFFFF; box-shadow: inset 0 0 0 2px #A7A6A2; }
.mb-cell { flex: 1; }
/* MATH frac_5_10: бегущий блик на примере-полосе (движение без раскрытия ответа). */
.mb-shimmer { position: absolute; top: 0; bottom: 0; width: 38%; left: -38%; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent); animation: mbShine 2.4s ease-in-out infinite; }
@keyframes mbShine { 0% { left: -38%; } 70%, 100% { left: 100%; } }
/* MATH frac_5_10: SubFlyLoop — «улетающие доли» в хуке (вычитание = забираем), CSS-only loop. */
.sf-bar { position: relative; display: flex; width: 100%; max-width: 340px; height: 40px; border-radius: 9px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.6); }
.sf-cell { flex: 1; position: relative; }
.sf-on { background: #FF4F28; }
.sf-on:first-child { border-radius: 9px 0 0 9px; }
.sf-fly { animation: sfFly 2.6s ease-in-out infinite; transform-origin: center bottom; }
@keyframes sfFly { 0%, 26% { transform: translateY(0) scale(1); opacity: 1; } 50% { transform: translateY(-24px) scale(0.78); opacity: 0; } 52%, 74% { transform: translateY(-24px); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
/* MATH frac_5_10: FloatFracs — бледные дрейфующие дроби, заполняют пустые зоны движением (декор). */
.ff-wrap { display: flex; justify-content: center; align-items: center; gap: clamp(18px, 6vw, 44px); opacity: 0.3; pointer-events: none; margin-top: 6px; }
.ff { display: inline-flex; color: #5A5A60; animation: ffBob 3.2s ease-in-out infinite; }
.ff-1 { animation-delay: 0s; } .ff-2 { animation-delay: 0.5s; } .ff-3 { animation-delay: 1s; } .ff-4 { animation-delay: 1.5s; }
@keyframes ffBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
/* MATH frac_5_10: TvRewind — ТВ с отмоткой назад (хук, по сюжету сериала). */
.tv { display: flex; flex-direction: column; align-items: center; }
.tv-screen { position: relative; width: clamp(160px, 42vw, 210px); height: clamp(96px, 25vw, 124px); border-radius: 12px; background: #0E0E10; box-shadow: 0 0 0 4px #FFFFFF, 0 10px 24px -6px rgba(58, 53, 48, 0.4); overflow: hidden; }
.tv-tick { position: absolute; top: 8px; bottom: 24px; width: 2px; background: rgba(255, 255, 255, 0.12); transform: translateX(-1px); }
.tv-rew { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -58%); color: #FF4F28; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 7vw, 38px); letter-spacing: -3px; text-shadow: 0 0 14px rgba(255, 79, 40, 0.55); animation: tvRew 1.1s ease-in-out infinite; }
@keyframes tvRew { 0%, 100% { opacity: 0.45; transform: translate(-50%, -58%) scale(0.9); } 50% { opacity: 1; transform: translate(-50%, -58%) scale(1.12); } }
.tv-seek { position: absolute; left: 12px; right: 12px; bottom: 12px; height: 5px; border-radius: 99px; background: rgba(255, 255, 255, 0.22); }
.tv-seek-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: #FF4F28; animation: tvSeek 3s cubic-bezier(0.4, 0, 0.5, 1) infinite; }
@keyframes tvSeek { 0% { width: 12%; } 40% { width: 83.3%; } 58% { width: 50%; } 82% { width: 50%; } 100% { width: 12%; } }
.tv-seek-head { position: absolute; top: 50%; width: 11px; height: 11px; border-radius: 50%; background: #FFFFFF; transform: translate(-50%, -50%); box-shadow: 0 0 6px rgba(255, 255, 255, 0.7); animation: tvHead 3s cubic-bezier(0.4, 0, 0.5, 1) infinite; }
@keyframes tvHead { 0% { left: 12%; } 40% { left: 83.3%; } 58% { left: 50%; } 82% { left: 50%; } 100% { left: 12%; } }
.tv-neck { width: 10px; height: 9px; background: #A7A6A2; }
.tv-base { width: 60px; height: 7px; background: #A7A6A2; border-radius: 99px; }
.bt-wrap { position: relative; display: flex; width: 100%; max-width: 360px; height: 60px; border: 3px solid #019ACB; border-radius: 8px; padding: 3px; background: #FFFFFF; }
.bt-tip { position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 5px; height: 22px; background: #019ACB; border-radius: 0 3px 3px 0; }
.bt-cell { flex: 1; border: none; background: transparent; cursor: pointer; position: relative; border-radius: 3px; transition: background 0.25s; padding: 0; display: flex; align-items: center; justify-content: center; }
.bt-cell.bt-on { background: #1F7A4D; }
.bt-cell.bt-on:hover:not(:disabled) { background: #FF4F28; }
.bt-cell:disabled { cursor: default; }
.bt-x { color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 18px; }


/* MATH frac_5_10: EatingNon — dumaloq lepyoshka, 2 bo'lak aylanada uchib ketadi (ayirish). */
.non-fly { animation: nonFly 3s ease-in-out infinite; }
@keyframes nonFly { 0%, 14% { opacity: 1; transform: translateY(0) scale(1); } 42%, 60% { opacity: 0; transform: translateY(-14px) scale(0.5); } 86%, 100% { opacity: 1; transform: translateY(0) scale(1); } }


/* MATH frac_5_10: FloatFracs — plavayushchaya stroka drobey (dekorativ, reconstructed). */
.ff-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 2px; flex-wrap: wrap; }
.ff-chip { display: inline-flex; animation: ffFloat 2.6s ease-in-out infinite; }
@keyframes ffFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

/* Accessibility (промпт 2026-06-13): уважать prefers-reduced-motion — гасим декор/loop-анимации. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
