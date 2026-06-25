import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сокращение дробей — frac_5_08
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C. s6 → классификация (= 1/2 или нет), s10 → error-spotting,
// s_seq → 6 примеров «найди числитель» с растущими знаменателями (1→4 знака). Top-align, Bridge, shuffleMC.

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
// КОНФИГ УРОКА (props от LMS)
// ============================================================
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'm' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const END_TAG = '[end]';
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]/g;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык — маркерами внутри text (только смешанные строки языковых курсов); math шлёт без маркеров,
// сервер определяет язык сам (ru=кириллица, uz=латиница). Движок свой тег НЕ добавляет.
function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = 'm'; // v5.5-male: erkak ovoz qattiq qulflangan
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

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
// useIsMobile
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

  setLang(lang) { this.currentLang = lang; }              // только preview Web Speech
  setGender(g) { this.gender = 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
  }

  playSegment(segment) {
    if (!segment) return;
    const base = ttsConfig.ttsApiBase;
    if (!segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
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

    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, gender);
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        this.autoplayBlocked = false;
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: segment.id });
      }).catch(() => {
        this.autoplayBlocked = true;
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      });
    }
  }

  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.handleSegmentEnd(segment), 0); return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
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
    engine.setGender(ttsConfig.voiceGender || 'm');
    engine.onStateChange = (s) => setState(prev => ({ ...prev, ...s }));
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

const FRAC_RE = /(\d+|\?)\/(\d+)/g;
const BOLD_RE = /<b>([\s\S]*?)<\/b>/g;
const mtFrac = (s, kp) => {
  if (s.indexOf('/') === -1) return [s];
  const out = []; let last = 0; let m; let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<Frac key={`${kp}f${key}`} n={m[1]} d={m[2]} size="sm"/>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};
const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (s.indexOf('/') === -1 && s.indexOf('<b>') === -1) return s;
  const out = []; let last = 0; let m; let key = 0;
  BOLD_RE.lastIndex = 0;
  while ((m = BOLD_RE.exec(s)) !== null) {
    if (m.index > last) out.push(...mtFrac(s.slice(last, m.index), `mt${key}o`));
    out.push(<strong key={`mtb${key}`}>{mtFrac(m[1], `mt${key}i`)}</strong>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(...mtFrac(s.slice(last), `mt${key}e`));
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
// QUESTION SCREEN — keep-visible MC (audio: { intro, on_correct, on_wrong })
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, titleNode, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure }) => {
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

  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong]   = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);

  const pick = (i) => {
    if (solved) return;
    if (wrong.has(i)) return;
    const isCorrect = i === correctIdx;

    if (firstTryRef.current === null) {
      firstTryRef.current = isCorrect;
      firstIdxRef.current = i;
    }
    attemptsRef.current += 1;
    setPicked(i);

    if (!introAdvancedRef.current) {
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
        studentAnswerIndex: firstIdxRef.current,
        studentAnswer: typeof options[firstIdxRef.current] === 'string' ? options[firstIdxRef.current] : null,
        correct: firstTryRef.current,
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
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
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
        {titleNode && <Title node={titleNode}/>}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;
            if (solved) {
              if (isCorrect) cls += ' option-correct';
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
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
// ХЕЛПЕРЫ
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

const optEl = (t, node) => <span className="body" style={{ display: 'inline' }}>{mt(t(node))}</span>;
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// FACT-БЛОК + анимации (CSS-only loop, синяя тема)
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука',    uz: "Bilasizmi? · Fan" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };

const FactCard = ({ text, anim, badge }) => {
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
// Tarix (oshpazlar retsepti): 4 ulush 2 tadan guruhlanib 2 ga «qisqaradi» — nisbat soddalashadi.
const AnimRecipe = () => (
  <div className="fa-rec" aria-hidden="true">
    <span className="fa-rec-c fa-rec-1"/>
    <span className="fa-rec-c fa-rec-2"/>
    <span className="fa-rec-c fa-rec-3"/>
    <span className="fa-rec-c fa-rec-4"/>
  </div>
);
// Fan (tishli uzatma): katta g'ildirak sekin, kichigi tez — 2:1 nisbat aylanib turadi.
const AnimGears = () => (
  <div className="fa-gear" aria-hidden="true">
    <span className="fa-gear-big"/>
    <span className="fa-gear-small"/>
  </div>
);
// IT (siqish): keng blok ortiqchasini «siqib» qisqasiga aylanadi — mazmun o'sha.
const AnimCompress = () => (
  <div className="fa-cmp" aria-hidden="true">
    <span className="fa-cmp-bar"/>
    <span className="fa-cmp-arrow fa-cmp-a-l"/>
    <span className="fa-cmp-arrow fa-cmp-a-r"/>
  </div>
);

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ — FracBar (merge) / SpinNum / DivLadder
// ============================================================
// FracBar: полоса, закраска num/den. grid — число делений. mergeTo+merging — при сокращении
// «лишние» линии (не кратные grid/mergeTo) плавно исчезают (cp-merge): доли объединяются.
const FracBar = ({ num, den, grid = null, mergeTo = null, merging = false, color = T.accent, height = 38, marker = false, winner = false, animateIn = false }) => {
  const pct = (num / den) * 100;
  const g = grid || den;
  const keep = (mergeTo && mergeTo > 0) ? g / mergeTo : 1;
  const ease = 'cubic-bezier(0.34, 1.1, 0.64, 1)';
  return (
    <div className="cp-bar" style={{ position: 'relative', width: '100%', height, borderRadius: 8, background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
        <div className={`cp-fill${animateIn ? ' cp-grow' : ''}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, transition: `width 0.5s ${ease}` }}/>
        {Array.from({ length: g - 1 }).map((_, i) => {
          const survive = !merging || !(mergeTo && mergeTo > 0) || ((i + 1) % keep === 0);
          return <div key={`${g}-${merging}-${i}`} className={(merging && !survive) ? 'cp-merge' : undefined} style={{ position: 'absolute', left: `${((i + 1) / g) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg }}/>;
        })}
      </div>
      {marker && num > 0 && (
        <div className={`cp-marker${animateIn ? ' cp-slide' : ''}`} style={{ position: 'absolute', left: `${pct}%`, top: -5, bottom: -5, width: 3, marginLeft: -1.5, background: color, borderRadius: 2, boxShadow: `0 0 7px ${color}`, transition: `left 0.5s ${ease}` }}>
          {winner && (<svg className="cp-flag" width="18" height="16" viewBox="0 0 18 16" style={{ position: 'absolute', top: -15, left: 1, overflow: 'visible' }}><path d="M1 1 L14 4 L1 8 Z" fill={color}/></svg>)}
        </div>
      )}
    </div>
  );
};

// SpinNum: число, которое «впрыгивает» при изменении (key=value → перемонтаж → cp-spin).
const SpinNum = ({ value, color = T.ink, size = 'clamp(22px, 4vw, 32px)' }) => (
  <span key={value} className="cp-spin display" style={{ color, fontSize: size, display: 'inline-block' }}>{value}</span>
);

// DivLadder: «лесенка деления» — строки сокращения с подписью ÷. steps: [{ a, b, by }].
const DivLadder = ({ steps }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
    {steps.map((s, i) => (
      <div key={i} className="cp-ladder-step" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', animationDelay: `${i * 0.18}s` }}>
        <Frac n={String(s.a)} d={String(s.b)} size="mid"/>
        <span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>÷{s.by}</span>
        <Op size="mid">=</Op>
        <Frac n={String(s.a / s.by)} d={String(s.b / s.by)} size="mid" color={T.accent}/>
      </div>
    ))}
  </div>
);

// ============================================================
// --- POD UROK: frac_5_08 — Сокращение дробей ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-08-v1',
  lessonTitle: { ru: 'Сокращение дробей', uz: "Kasrlarni qisqartirish" }
};
const TOTAL_SCREENS = 14;

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's_seq', type: 'test',      template: 'SeqMC',    scored: true,  scope: 'practice' },
  { id: 's8',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'case',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',   scored: false, scope: null },
];

// === CONTENT BELOW ===
const CONTENT = {
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title: { ru: 'Ответ <b>6/8</b> — верный. Но можно ли записать его проще?', uz: "Javob <b>6/8</b> — to'g'ri. Lekin uni soddaroq yozsa bo'ladimi?" },
    opt_a: { ru: 'Это одно и то же число; пишем проще', uz: 'Bu bitta son; soddaroq yozamiz' },
    opt_b: { ru: 'Это разные числа; 3/4 меньше 6/8', uz: "Bu har xil sonlar; 3/4 6/8 dan kichik" },
    opt_c: { ru: 'Пока не уверен(а)', uz: 'Hozircha aniq emas' },
    audio: {
      ru: 'Ответ шесть восьмых верный. Но шесть восьмых и три четвёртых закрашивают одинаковую длину — это одно и то же число. А три четвёртых записать проще: меньше частей, легче читать. Зачем и как сокращать дробь до простого вида? Как думаешь, выбери ответ.',
      uz: "Javob sakkizdan olti to'g'ri. Lekin sakkizdan olti va to'rtdan uch bir xil uzunlikni bo'yaydi — bu bitta son. To'rtdan uch yozish esa soddaroq: bo'laklar kam, o'qish oson. Kasrni sodda holatga qisqartirish nima uchun va qanday kerak? Sizningcha qanday, javobni tanlang."
    }
  },
  s1: {
    eyebrow: { ru: 'Исследование', uz: 'Tadqiqot' },
    bridge: { ru: 'Проверим на полоске: 6/8 и 3/4 — это одна длина?', uz: "Chiziqda tekshiramiz: 6/8 va 3/4 — bir uzunlikmi?" },
    title: { ru: 'Объединим мелкие доли: <b>6/8 → 3/4</b>', uz: "Mayda ulushlarni birlashtiramiz: <b>6/8 → 3/4</b>" },
    step1: { ru: 'Полоса поделена на 8 частей, закрашено 6 — это 6/8.', uz: "Polosa 8 bo'lakka bo'lingan, 6 tasi bo'yalgan — bu 6/8." },
    step2: { ru: 'Группируем доли по 2 — соседние линии исчезают, 8 долей становятся 4.', uz: "Ulushlarni 2 tadan guruhlaymiz — yondosh chiziqlar yo'qoladi, 8 ulush 4 ga aylanadi." },
    step3: { ru: 'Закрашено 3 части из 4 — это 3/4. Разделили верх и низ на 2: <b>6÷2=3, 8÷2=4</b>. Длина та же.', uz: "4 tadan 3 tasi bo'yalgan — bu 3/4. Surat va maxrajni 2 ga bo'ldik: <b>6÷2=3, 8÷2=4</b>. Uzunlik o'sha." },
    audio: {
      ru: [
        'Объединим мелкие доли. Нажимай кнопку дальше.',
        'Вот полоса, поделённая на восемь частей, закрашено шесть — это шесть восьмых. Нажми кнопку дальше.',
        'Сгруппируем доли по две: соседние линии исчезают, и восемь долей превращаются в четыре. Закрашенная длина не меняется. Нажми кнопку дальше.',
        'Теперь закрашено три части из четырёх — это три четвёртых. Мы разделили и верх, и низ на два: шесть на два три, восемь на два четыре. Шесть восьмых равно трём четвёртым, просто записано проще.'
      ],
      uz: [
        "Mayda ulushlarni birlashtiramiz. Davom etish tugmasini bosing.",
        "Mana sakkiz bo'lakka bo'lingan polosa, oltitasi bo'yalgan — bu sakkizdan olti. Davom etish tugmasini bosing.",
        "Ulushlarni ikkitadan guruhlaymiz: yondosh chiziqlar yo'qoladi va sakkizta ulush to'rttaga aylanadi. Bo'yalgan uzunlik o'zgarmaydi. Davom etish tugmasini bosing.",
        "Endi to'rttadan uchtasi bo'yalgan — bu to'rtdan uch. Biz yuqorini ham, pastni ham ikkiga bo'ldik: olti bo'lib ikki uch, sakkiz bo'lib ikki to'rt. Sakkizdan olti to'rtdan uchga teng, faqat soddaroq yozilgan."
      ]
    }
  },
  s2: {
    eyebrow: { ru: 'Исследование', uz: 'Tadqiqot' },
    title: { ru: 'Сократи <b>8/12</b> до конца', uz: "<b>8/12</b> ni oxirigacha qisqartiring" },
    step1: { ru: 'Найдём число, на которое делятся и 8, и 12. Это <b>4</b> — их общий делитель.', uz: "8 ham, 12 ham bo'linadigan sonni topamiz. Bu <b>4</b> — ularning umumiy bo'luvchisi." },
    step2: { ru: 'Делим оба на 4: <b>8÷4=2</b>, <b>12÷4=3</b>.', uz: "Ikkalasini 4 ga bo'lamiz: <b>8÷4=2</b>, <b>12÷4=3</b>." },
    step3: { ru: 'Вышло <b>2/3</b>. Проще уже не сократить — 2 и 3 общего делителя не имеют.', uz: "<b>2/3</b> chiqdi. Bundan sodda qisqarmaydi — 2 va 3 umumiy bo'luvchiga ega emas." },
    audio: {
      ru: [
        'Сократим восемь двенадцатых до конца. Нажми кнопку дальше.',
        'Сначала найдём число, на которое делятся и восемь, и двенадцать. Это четыре — их общий делитель. Нажми кнопку дальше.',
        'Делим оба на четыре: восемь на четыре два, двенадцать на четыре три. Нажми кнопку дальше.',
        'Получилось две третьих. Проще уже не сократить: у двух и трёх нет общего делителя, кроме единицы.'
      ],
      uz: [
        "Sakkizdan o'n ikkidan ni oxirigacha qisqartiramiz. Davom etish tugmasini bosing.",
        "Avval sakkiz ham, o'n ikki ham bo'linadigan sonni topamiz. Bu to'rt — ularning umumiy bo'luvchisi. Davom etish tugmasini bosing.",
        "Ikkalasini to'rtga bo'lamiz: sakkiz bo'lib to'rt ikki, o'n ikki bo'lib to'rt uch. Davom etish tugmasini bosing.",
        "Uchdan ikki chiqdi. Bundan sodda qisqarmaydi: ikki va uchda birdan boshqa umumiy bo'luvchi yo'q."
      ]
    }
  },
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    bridge: { ru: 'Это работает для любой дроби. Вот правило.', uz: "Bu har qanday kasr uchun ishlaydi. Mana qoida." },
    title: { ru: 'Правило сокращения дроби', uz: 'Kasrni qisqartirish qoidasi' },
    rule_main: { ru: 'Найди число, на которое делятся <b>и числитель, и знаменатель</b>, и раздели на него оба.', uz: "<b>Surat ham, maxraj ham</b> bo'linadigan sonni toping va ikkalasini unga bo'ling." },
    rule_div: { ru: 'Длина дроби не меняется — меняется только запись. Это обратное к умножению из прошлого урока.', uz: "Kasr uzunligi o'zgarmaydi — faqat yozuv. Bu o'tgan darsdagi ko'paytirishning teskarisi." },
    outro: { ru: 'Делишь на <b>наибольший общий делитель</b> — дробь сразу самая простая.', uz: "<b>Eng katta umumiy bo'luvchiga</b> bo'lsangiz — kasr darrov eng sodda." },
    audio: {
      ru: 'Запомни правило. Чтобы сократить дробь, найди число, на которое делятся и числитель, и знаменатель, и раздели на него оба. Длина дроби не меняется, меняется только запись. Это обратное действие к умножению из прошлого урока. Если разделить на наибольший общий делитель, дробь сразу станет самой простой.',
      uz: "Qoidani eslab qoling. Kasrni qisqartirish uchun surat ham, maxraj ham bo'linadigan sonni toping va ikkalasini unga bo'ling. Kasr uzunligi o'zgarmaydi, faqat yozuv o'zgaradi. Bu o'tgan darsdagi ko'paytirishning teskarisi. Eng katta umumiy bo'luvchiga bo'linsa, kasr darrov eng sodda bo'ladi."
    }
  },
  s4: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    bridge: { ru: 'Применим правило.', uz: "Qoidani qo'llaymiz." },
    title: { ru: 'Сократи <b>6/9</b> до простого вида', uz: "<b>6/9</b> ni sodda holgacha qisqartiring" },
    question: { ru: 'На какое число делятся и 6, и 9? Раздели оба. Что получится?', uz: "6 ham, 9 ham qaysi songa bo'linadi? Ikkalasini bo'ling. Nima chiqadi?" },
    opt_a: { ru: '2/3', uz: '2/3' },
    opt_b: { ru: '3/4', uz: '3/4' },
    opt_c: { ru: '2/4', uz: '2/4' },
    opt_d: { ru: '6/9', uz: '6/9' },
    correct_text: { ru: 'Верно: 6 и 9 делятся на 3. 6÷3=2, 9÷3=3. Получается 2/3.', uz: "To'g'ri: 6 ham, 9 ham 3 ga bo'linadi. 6÷3=2, 9÷3=3. 2/3 chiqadi." },
    wrong_0: { ru: 'Да: оба делятся на 3. 6÷3=2, 9÷3=3. Значит 6/9 = 2/3.', uz: "Ha: ikkalasi 3 ga bo'linadi. 6÷3=2, 9÷3=3. Demak 6/9 = 2/3." },
    wrong_1: { ru: '3/4 — другая дробь. 6/9 делим на 3, выйдет 2/3.', uz: "3/4 — boshqa kasr. 6/9 ni 3 ga bo'lamiz, 2/3 chiqadi." },
    wrong_2: { ru: '2/4 не равно 6/9. На 3 делятся оба: выйдет 2/3.', uz: "2/4 6/9 ga teng emas. 3 ga ikkalasi bo'linadi: 2/3 chiqadi." },
    wrong_3: { ru: '6/9 — ещё не сокращено. Раздели оба на 3.', uz: "6/9 — hali qisqarmagan. Ikkalasini 3 ga bo'ling." },
    fact: { ru: 'Повара веками уменьшают рецепты: блюдо на 4 человек делают на 2, и все количества делят пополам. Это то же сокращение — соотношение упрощается, а вкус тот же.', uz: "Oshpazlar asrlar davomida retseptni kichraytiradi: 4 kishilik taom 2 kishiga qilinadi, barcha miqdor ikkiga bo'linadi. Bu — o'sha qisqartirish, nisbat soddalashadi, ta'm o'sha." },
    audio: {
      intro: { ru: 'Сократи шесть девятых до простого вида. На какое число делятся оба? Выбери ответ.', uz: "To'qqizdan oltini sodda holgacha qisqartiring. Ikkalasi qaysi songa bo'linadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на три: вышло две третьих.', uz: "To'g'ri. Uchga bo'ldik: uchdan ikki chiqdi." },
      on_wrong: { ru: 'Пока нет. И шесть, и девять делятся на три. Раздели оба.', uz: "Hali emas. Olti ham, to'qqiz ham uchga bo'linadi. Ikkalasini bo'ling." }
    }
  },
  s5: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    title: { ru: 'Частая ошибка: делить <b>только одно</b> число', uz: "Ko'p uchraydigan xato: <b>faqat bitta</b> sonni bo'lish" },
    rule_main: { ru: 'Если у <b>6/8</b> разделить только верх → <b>3/8</b>. Закрашено стало короче — дробь <b>другая, меньше</b>!', uz: "<b>6/8</b> da faqat surat bo'linsa → <b>3/8</b>. Bo'yoq qisqaradi — kasr <b>boshqa, kichik</b>!" },
    rule_div: { ru: 'Правильно — делить <b>и верх, и низ</b> на 2: 6/8 = 3/4. Длина та же, дробь равна.', uz: "To'g'risi — <b>suratni ham, maxrajni ham</b> 2 ga bo'lish: 6/8 = 3/4. Uzunlik o'sha, kasr teng." },
    outro: { ru: 'Сокращение не меняет величину дроби — но только если делить оба числа на одно.', uz: "Qisqartirish kasr qiymatini o'zgartirmaydi — lekin faqat ikkala son bitta songa bo'linsa." },
    audio: {
      ru: 'Внимание, частая ошибка. Сокращать нужно и числитель, и знаменатель. Если у шести восьмых разделить только верх, выйдет три восьмых — закрашено станет короче, дробь стала другой, меньше. Правильно делить и верх, и низ на два, тогда выйдет три четвёртых, длина та же. Сокращение не меняет величину дроби, но только если делить оба числа на одно и то же.',
      uz: "Diqqat, ko'p uchraydigan xato. Qisqartirishda surat ham, maxraj ham bo'linadi. Sakkizdan oltida faqat surat bo'linsa, sakkizdan uch chiqadi — bo'yoq qisqaradi, kasr boshqa, kichik bo'ladi. To'g'risi suratni ham, maxrajni ham ikkiga bo'lish, shunda to'rtdan uch chiqadi, uzunlik o'sha. Qisqartirish kasr qiymatini o'zgartirmaydi, lekin faqat ikkala son bir songa bo'linsa."
    }
  },
  s6: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    title: { ru: 'Разложи дроби: <b>сокращена до конца</b> или ещё нет', uz: "Kasrlarni ajrating: <b>oxirigacha qisqargan</b> yoki yo'q" },
    lead: { ru: 'Нажми на дробь. Можно ли её ещё сократить (у верха и низа есть общий делитель)?', uz: "Kasrni bosing. Uni yana qisqartirsa bo'ladimi (surat va maxrajda umumiy bo'luvchi bormi)?" },
    ask: { ru: 'сокращена до конца?', uz: "oxirigacha qisqarganmi?" },
    bin_eq: { ru: 'до конца', uz: 'oxirigacha' },
    bin_uneq: { ru: 'можно ещё', uz: "yana bo'ladi" },
    hint_wrong: { ru: 'Проверь: есть ли число, на которое делятся и верх, и низ? Если да — можно ещё сократить.', uz: "Tekshiring: surat ham, maxraj ham bo'linadigan son bormi? Bo'lsa — yana qisqartirsa bo'ladi." },
    correct_text: { ru: 'Готово. «До конца» — когда у верха и низа нет общего делителя, кроме 1: 2/3, 3/4, 5/7, 4/9, 7/10.', uz: "Tayyor. «Oxirigacha» — surat va maxrajda 1 dan boshqa umumiy bo'luvchi bo'lmaganda: 2/3, 3/4, 5/7, 4/9, 7/10." },
    audio: {
      intro: { ru: 'Перед тобой дроби. Разложи их по корзинам: сокращена до конца или можно ещё сократить. Нажимай на дробь — она улетит в корзину.', uz: "Oldingizda kasrlar. Ularni savatga ajrating: oxirigacha qisqargan yoki yana qisqartirsa bo'ladi. Kasrni bosing — u savatga uchadi." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Есть ли у верха и низа общий делитель?', uz: "Surat va maxrajda umumiy bo'luvchi bormi?" }
    }
  },
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Оба числа или одно?', uz: 'Ikkala sonmi yoki bitta?' },
    question: { ru: 'Кто-то «сократил» 6/8, разделив только числитель: 6÷2=3, и написал 3/8. Верно?', uz: "Kimdir 6/8 ni faqat suratni bo'lib «qisqartirdi»: 6÷2=3, va 3/8 deb yozdi. To'g'rimi?" },
    opt_a: { ru: 'Неверно — надо разделить и знаменатель: 6/8 = 3/4', uz: "Noto'g'ri — maxrajni ham bo'lish kerak: 6/8 = 3/4" },
    opt_b: { ru: 'Верно — числитель сократили, значит 3/8', uz: "To'g'ri — suratni qisqartirdik, demak 3/8" },
    opt_c: { ru: 'Верно, но только если дробь меньше 1', uz: "To'g'ri, lekin faqat kasr 1 dan kichik bo'lsa" },
    opt_d: { ru: 'Так дробь вообще не сократить', uz: "Bunday kasrni umuman qisqartirib bo'lmaydi" },
    correct_text: { ru: 'Верно: разделили только верх — дробь уменьшилась. Надо делить оба: 6÷2=3, 8÷2=4 → 3/4.', uz: "To'g'ri: faqat suratni bo'ldik — kasr kichraydi. Ikkalasini bo'lish kerak: 6÷2=3, 8÷2=4 → 3/4." },
    wrong_0: { ru: 'Да: 3/8 меньше 6/8. Знаменатель тоже надо разделить на 2 → 3/4.', uz: "Ha: 3/8 6/8 dan kichik. Maxrajni ham 2 ga bo'lish kerak → 3/4." },
    wrong_1: { ru: 'Это ошибка: 3/8 меньше 6/8. Делить надо оба числа.', uz: "Bu xato: 3/8 6/8 dan kichik. Ikkala sonni bo'lish kerak." },
    wrong_2: { ru: 'Нет: делить только верх нельзя ни для какой дроби. Нужно 3/4.', uz: "Yo'q: faqat suratni bo'lish hech qaysi kasr uchun mumkin emas. 3/4 kerak." },
    wrong_3: { ru: 'Сократить можно: раздели оба числа на 2 → 3/4.', uz: "Qisqartirsa bo'ladi: ikkala sonni 2 ga bo'ling → 3/4." },
    audio: {
      intro: { ru: 'Кто-то сократил шесть восьмых, разделив только числитель, и написал три восьмых. Верно ли это? Выбери ответ.', uz: "Kimdir sakkizdan oltini faqat suratni bo'lib qisqartirdi va sakkizdan uch deb yozdi. Bu to'g'rimi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Надо разделить и знаменатель — вышло бы три четвёртых.', uz: "To'g'ri. Maxrajni ham bo'lish kerak — to'rtdan uch chiqardi." },
      on_wrong: { ru: 'Делишь верх — дели и низ на то же число.', uz: "Suratni bo'lsangiz — maxrajni ham shu songa bo'ling." }
    }
  },
  s_seq: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashqlar' },
    title: { ru: 'Сократи до конца: <b>5 примеров подряд</b>', uz: "Oxirigacha qisqartiring: <b>5 ta misol ketma-ket</b>" },
    lead: { ru: 'Числа растут. Дели верх и низ на их наибольший общий делитель.', uz: "Sonlar o'sib boradi. Surat va maxrajni eng katta umumiy bo'luvchiga bo'ling." },
    questions: [
      {
        q: '4/8', opts: ['1/2', '2/4', '1/4'], correct: 0,
        ok: { ru: 'Верно. 4 и 8 делятся на 4: 4/8 = 1/2.', uz: "To'g'ri. 4 va 8 4 ga bo'linadi: 4/8 = 1/2." },
        no: { ru: 'Дели оба на наибольший общий делитель — на 4. Выйдет 1/2.', uz: "Ikkalasini eng katta umumiy bo'luvchiga — 4 ga bo'ling. 1/2 chiqadi." }
      },
      {
        q: '9/12', opts: ['6/8', '3/4', '9/12'], correct: 1,
        ok: { ru: 'Верно. 9 и 12 делятся на 3: 9/12 = 3/4.', uz: "To'g'ri. 9 va 12 3 ga bo'linadi: 9/12 = 3/4." },
        no: { ru: 'Общий делитель 9 и 12 — это 3. Раздели оба на 3.', uz: "9 va 12 ning umumiy bo'luvchisi — 3. Ikkalasini 3 ga bo'ling." }
      },
      {
        q: '15/25', opts: ['5/3', '3/5', '3/4'], correct: 1,
        ok: { ru: 'Верно. 15 и 25 делятся на 5: 15/25 = 3/5.', uz: "To'g'ri. 15 va 25 5 ga bo'linadi: 15/25 = 3/5." },
        no: { ru: 'Оба делятся на 5: 15÷5=3, 25÷5=5. Порядок не меняй: 3/5.', uz: "Ikkalasi 5 ga bo'linadi: 15÷5=3, 25÷5=5. Tartibni o'zgartirmang: 3/5." }
      },
      {
        q: '24/36', opts: ['2/3', '6/9', '12/18'], correct: 0,
        ok: { ru: 'Верно. Наибольший общий делитель 24 и 36 — это 12: 24/36 = 2/3.', uz: "To'g'ri. 24 va 36 ning eng katta umumiy bo'luvchisi — 12: 24/36 = 2/3." },
        no: { ru: 'До конца: дели на наибольший общий делитель — на 12. Выйдет 2/3.', uz: "Oxirigacha: eng katta umumiy bo'luvchiga — 12 ga bo'ling. 2/3 chiqadi." },
        say: { ru: 'Числа больше. Найди самый большой общий делитель и раздели оба на него.', uz: "Sonlar kattaroq. Eng katta umumiy bo'luvchini toping va ikkalasini unga bo'ling." }
      },
      {
        q: '250/1000', opts: ['1/4', '25/100', '5/20'], correct: 0,
        ok: { ru: 'Верно. 250 и 1000 делятся на 250: 250/1000 = 1/4.', uz: "To'g'ri. 250 va 1000 250 ga bo'linadi: 250/1000 = 1/4." },
        no: { ru: 'До конца! 25/100 и 5/20 ещё сокращаются. Раздели до 1/4.', uz: "Oxirigacha! 25/100 va 5/20 hali qisqaradi. 1/4 gacha bo'ling." },
        say: { ru: 'Числа большие, но правило то же: дели на наибольший общий делитель.', uz: "Sonlar katta, lekin qoida o'sha: eng katta umumiy bo'luvchiga bo'ling." }
      }
    ],
    audio: {
      intro: { ru: 'Пять примеров подряд. В каждом сократи дробь до конца. Числа будут расти. Дели верх и низ на их наибольший общий делитель.', uz: "Besh misol ketma-ket. Har birida kasrni oxirigacha qisqartiring. Sonlar o'sib boradi. Surat va maxrajni eng katta umumiy bo'luvchiga bo'ling." },
      on_wrong: { ru: 'Дели оба на наибольший общий делитель.', uz: "Ikkalasini eng katta umumiy bo'luvchiga bo'ling." },
      on_done: { ru: 'Готово. Ты доводил дробь до самого простого вида даже на больших числах.', uz: "Tayyor. Katta sonlarda ham kasrni eng sodda holga keltirdingiz." }
    }
  },
  s8: {
    eyebrow: { ru: 'Случай', uz: 'Vaziyat' },
    bridge: { ru: 'Сокращение нужно не только в тетради. Вот кухня.', uz: "Qisqartirish faqat daftarda emas. Mana oshxona." },
    title: { ru: 'Санжар печёт по рецепту', uz: "Sanjar retsept bo'yicha pishiradi" },
    fact1: { ru: 'В рецепте странно записано: <b>8/12</b> стакана сахара.', uz: "Retseptda g'alati yozilgan: <b>8/12</b> stakan shakar." },
    fact2: { ru: 'Мерный стакан у Санжара делится на <b>трети</b>.', uz: "Sanjarning o'lchov stakani <b>uchdanlarga</b> bo'lingan." },
    fact3: { ru: 'До какой простой дроби (со знаменателем 3) сократить 8/12?', uz: "8/12 ni qaysi sodda kasrgacha (maxraji 3) qisqartirish kerak?" },
    cta: { ru: 'Помочь Санжару', uz: 'Sanjarga yordam berish' },
    audio: {
      ru: 'Санжар печёт по рецепту. Там странно записано: восемь двенадцатых стакана сахара. А мерный стакан делится на трети. До какой простой дроби со знаменателем три сократить восемь двенадцатых? Нажми кнопку помочь Санжару.',
      uz: "Sanjar retsept bo'yicha pishiradi. U yerda g'alati yozilgan: o'n ikkidan sakkiz stakan shakar. O'lchov stakani esa uchdanlarga bo'lingan. O'n ikkidan sakkizni maxraji uch bo'lgan qaysi sodda kasrgacha qisqartirish kerak? Sanjarga yordam berish tugmasini bosing."
    }
  },
  s9: {
    eyebrow: { ru: 'Случай', uz: 'Vaziyat' },
    title: { ru: 'До чего сократить <b>8/12</b>?', uz: "<b>8/12</b> ni nimagacha qisqartiramiz?" },
    question: { ru: 'Сократи 8/12 до знаменателя 3. На что делятся 8 и 12? Что получится?', uz: "8/12 ni maxraji 3 gacha qisqartiring. 8 va 12 qaysi songa bo'linadi? Nima chiqadi?" },
    opt_a: { ru: '2/3', uz: '2/3' },
    opt_b: { ru: '4/6', uz: '4/6' },
    opt_c: { ru: '2/4', uz: '2/4' },
    opt_d: { ru: '8/12', uz: '8/12' },
    correct_text: { ru: 'Верно: 8 и 12 делятся на 4. 8÷4=2, 12÷4=3. Получается 2/3 — Санжар отмерит две трети.', uz: "To'g'ri: 8 va 12 4 ga bo'linadi. 8÷4=2, 12÷4=3. 2/3 chiqadi — Sanjar uchdan ikkini o'lchaydi." },
    wrong_0: { ru: 'Да: оба делятся на 4. 8÷4=2, 12÷4=3 → 2/3.', uz: "Ha: ikkalasi 4 ga bo'linadi. 8÷4=2, 12÷4=3 → 2/3." },
    wrong_1: { ru: '4/6 ещё не до конца: 4 и 6 делятся на 2. Дойди до 2/3.', uz: "4/6 hali oxirigacha emas: 4 va 6 2 ga bo'linadi. 2/3 gacha yetkazing." },
    wrong_2: { ru: '2/4 не равно 8/12. На 4 делятся оба: выйдет 2/3.', uz: "2/4 8/12 ga teng emas. 4 ga ikkalasi bo'linadi: 2/3 chiqadi." },
    wrong_3: { ru: '8/12 — ещё не сокращено. Раздели оба на 4.', uz: "8/12 — hali qisqarmagan. Ikkalasini 4 ga bo'ling." },
    fact: { ru: 'У шестерёнок передаточное число пишут так же: 8 зубьев к 4 записывают как 2 к 1 — то же отношение проще, суть передачи не меняется.', uz: "Tishli g'ildiraklarda uzatma nisbati ham shunday yoziladi: 8 tishdan 4 ga 2 dan 1 deb yoziladi — o'sha nisbat soddaroq, uzatma mohiyati o'zgarmaydi." },
    audio: {
      intro: { ru: 'Сократи восемь двенадцатых до дроби со знаменателем три. На что делятся оба? Выбери ответ.', uz: "O'n ikkidan sakkizni maxraji uch bo'lgan kasrgacha qisqartiring. Ikkalasi qaysi songa bo'linadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на четыре: вышло две третьих.', uz: "To'g'ri. To'rtga bo'ldik: uchdan ikki chiqdi." },
      on_wrong: { ru: 'Пока нет. И восемь, и двенадцать делятся на четыре. Раздели оба.', uz: "Hali emas. Sakkiz ham, o'n ikki ham to'rtga bo'linadi. Ikkalasini bo'ling." }
    }
  },
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    title: { ru: 'Где сокращение <b>неверно</b>?', uz: "Qaysi qisqartirish <b>noto'g'ri</b>?" },
    question: { ru: 'Три сокращения верны, одно — с ошибкой. Найди ошибочное.', uz: "Uchta qisqartirish to'g'ri, bittasi xato. Xatosini toping." },
    opt_a: { ru: '6/8 = 3/8', uz: '6/8 = 3/8' },
    opt_b: { ru: '10/15 = 2/3', uz: '10/15 = 2/3' },
    opt_c: { ru: '6/9 = 2/3', uz: '6/9 = 2/3' },
    opt_d: { ru: '12/16 = 3/4', uz: '12/16 = 3/4' },
    correct_text: { ru: 'Верно. 6/8 = 3/8 — ошибка: разделили только верх. Надо и низ: 6/8 = 3/4.', uz: "To'g'ri. 6/8 = 3/8 — xato: faqat surat bo'lingan. Maxrajni ham: 6/8 = 3/4." },
    wrong_0: { ru: 'Да: тут разделили только числитель. Надо оба → 6/8 = 3/4.', uz: "Ha: bu yerda faqat surat bo'lingan. Ikkalasi kerak → 6/8 = 3/4." },
    wrong_1: { ru: '10/15 = 2/3 верно: оба разделили на 5.', uz: "10/15 = 2/3 to'g'ri: ikkalasi 5 ga bo'lingan." },
    wrong_2: { ru: '6/9 = 2/3 верно: оба разделили на 3.', uz: "6/9 = 2/3 to'g'ri: ikkalasi 3 ga bo'lingan." },
    wrong_3: { ru: '12/16 = 3/4 верно: оба разделили на 4.', uz: "12/16 = 3/4 to'g'ri: ikkalasi 4 ga bo'lingan." },
    audio: {
      intro: { ru: 'Три сокращения сделаны правильно, одно — с ошибкой. Найди то, где сокращение неверно.', uz: "Uchta qisqartirish to'g'ri, bittasi xato. Qisqartirish noto'g'ri bo'lganini toping." },
      on_correct: { ru: 'Верно, тут разделили только числитель.', uz: "To'g'ri, bu yerda faqat suratni bo'lgan." },
      on_wrong: { ru: 'Проверь каждое: оба числа разделили на одно?', uz: "Har birini tekshiring: ikkala son bitta songa bo'linganmi?" }
    }
  },
  s11: {
    eyebrow: { ru: 'Итоговая проверка', uz: 'Yakuniy tekshiruv' },
    title: { ru: 'Сократи <b>12/16</b> до конца', uz: "<b>12/16</b> ni oxirigacha qisqartiring" },
    question: { ru: 'На какой наибольший делитель делятся 12 и 16? Раздели оба. Что получится?', uz: "12 va 16 qaysi eng katta songa bo'linadi? Ikkalasini bo'ling. Nima chiqadi?" },
    opt_a: { ru: '3/4', uz: '3/4' },
    opt_b: { ru: '6/8', uz: '6/8' },
    opt_c: { ru: '4/4', uz: '4/4' },
    opt_d: { ru: '12/16', uz: '12/16' },
    correct_text: { ru: 'Верно: 12 и 16 делятся на 4. 12÷4=3, 16÷4=4. Получается 3/4.', uz: "To'g'ri: 12 va 16 4 ga bo'linadi. 12÷4=3, 16÷4=4. 3/4 chiqadi." },
    wrong_0: { ru: 'Да: наибольший общий делитель 4. 12÷4=3, 16÷4=4 → 3/4.', uz: "Ha: eng katta umumiy bo'luvchi 4. 12÷4=3, 16÷4=4 → 3/4." },
    wrong_1: { ru: '6/8 ещё не до конца: оба делятся на 2. Дойди до 3/4.', uz: "6/8 hali oxirigacha emas: ikkalasi 2 ga bo'linadi. 3/4 gacha yetkazing." },
    wrong_2: { ru: '4/4 — это целое (1), а 12/16 меньше 1. Раздели оба на 4 → 3/4.', uz: "4/4 — bu butun (1), 12/16 esa 1 dan kichik. Ikkalasini 4 ga bo'ling → 3/4." },
    wrong_3: { ru: '12/16 — ещё не сокращено. Раздели оба на 4.', uz: "12/16 — hali qisqarmagan. Ikkalasini 4 ga bo'ling." },
    fact: { ru: 'Сжатие файлов работает по той же идее: программа пишет данные короче, но картинка или текст остаются прежними. Как у дроби: запись короче, значение то же.', uz: "Fayllarni siqish ham shu g'oyada: dastur ma'lumotni qisqaroq yozadi, lekin rasm yoki matn o'sha bo'lib qoladi. Xuddi kasrdek: yozuv qisqaroq, qiymat o'sha." },
    audio: {
      intro: { ru: 'Последнее задание. Сократи двенадцать шестнадцатых до конца. На какой наибольший делитель делятся оба? Выбери ответ.', uz: "Oxirgi topshiriq. O'n oltidan o'n ikkini oxirigacha qisqartiring. Ikkalasi qaysi eng katta songa bo'linadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на четыре: вышло три четвёртых.', uz: "To'g'ri. To'rtga bo'ldik: to'rtdan uch chiqdi." },
      on_wrong: { ru: 'Пока нет. И двенадцать, и шестнадцать делятся на четыре. Раздели оба.', uz: "Hali emas. O'n ikki ham, o'n olti ham to'rtga bo'linadi. Ikkalasini bo'ling." }
    }
  },
  s12: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    title: { ru: 'Что ты теперь умеешь', uz: 'Endi nimani bilasiz' },
    point1: { ru: 'Сократить дробь — записать её <b>проще, не меняя величину</b>.', uz: "Kasrni qisqartirish — <b>qiymatini o'zgartirmasdan soddaroq</b> yozish." },
    point2: { ru: 'Дели <b>числитель и знаменатель на их общий делитель</b> (лучше — на наибольший).', uz: "<b>Surat va maxrajni umumiy bo'luvchiga</b> bo'ling (eng kattasiga — yaxshiroq)." },
    point3: { ru: 'Делить нужно <b>оба числа на одно</b> — иначе дробь изменится.', uz: "<b>Ikkala sonni bitta songa</b> bo'lish kerak — aks holda kasr o'zgaradi." },
    score_caption: { ru: 'Правильных ответов', uz: "To'g'ri javoblar" },
    audio: {
      ru: 'Подведём итог. Сократить дробь значит записать её проще, не меняя величину. Для этого дели числитель и знаменатель на их общий делитель, лучше на наибольший. Делить нужно оба числа на одно, иначе дробь изменится. Дальше начнём складывать дроби. Ты молодец.',
      uz: "Xulosa qilamiz. Kasrni qisqartirish — qiymatini o'zgartirmasdan soddaroq yozish. Buning uchun surat va maxrajni umumiy bo'luvchiga, eng kattasiga bo'ling. Ikkala sonni bitta songa bo'lish kerak, aks holda kasr o'zgaradi. Keyin kasrlarni qo'shishni boshlaymiz. Ofarin."
    }
  }
};

// === SCREENS BELOW ===
// ============================================================
// s6 — TASNIFLASH: «до конца» yoki «можно ещё» (tap-to-bin, Fisher-Yates, веди-до-верного)
// ============================================================
const S6_CARDS = [
  // sodda (aniq)
  { label: '2/3', bin: 'lt' },
  { label: '4/6', bin: 'gt' },
  { label: '3/4', bin: 'lt' },
  { label: '6/8', bin: 'gt' },
  { label: '5/7', bin: 'lt' },
  { label: '10/15', bin: 'gt' },
  // qiyin
  { label: '4/9', bin: 'lt' },
  { label: '6/9', bin: 'gt' },
  { label: '7/10', bin: 'lt' },
  { label: '8/12', bin: 'gt' }
];
const S6_BINS = [{ key: 'lt' }, { key: 'gt' }];

const ClassifyReduce = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const [deck] = useState(() => { const a = S6_CARDS.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; });
  const n = deck.length;
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const allPlaced = () => { const o = {}; deck.forEach((cd, i) => { o[i] = cd.bin; }); return o; };
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? allPlaced() : {}));
  const [done, setDone] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(null);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null); const flashRef = useRef(null);
  const cur = idx < n ? deck[idx] : null;
  const finish = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: deck.map(cd => cd.bin).join(','), studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const tapBin = (bin) => {
    if (done || !cur) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const correct = bin === cur.bin;
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct;
    if (correct) {
      setHint(false); setPlaced(p => ({ ...p, [idx]: bin })); sfx.playCorrect();
      const snap = firstTryRef.current.slice();
      advRef.current = setTimeout(() => { if (idx + 1 < n) setIdx(idx + 1); else { setIdx(n); finish(snap); } }, 480);
    } else {
      sfx.playWrong(); setHint(true);
      setFlash(bin); if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (flashRef.current) clearTimeout(flashRef.current); }, []);
  const inBin = (bin) => deck.map((cd, i) => i).filter(i => placed[i] === bin);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {deck.map((_, i) => <span key={i} className={`seq-dot${(i < idx || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        <div className="sort-tray fade-up delay-1">
          {done
            ? <span className="sort-tray-card" style={{ color: T.success }} aria-hidden="true">✓</span>
            : <><span className="sort-tray-card" key={idx}>{mt(cur.label)}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {S6_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key === 'lt' ? 'sq' : 'cu'}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h">{b.key === 'lt' ? mt(t(c.bin_eq)) : mt(t(c.bin_uneq))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{mt(deck[i].label)}</span>)}
              </span>
            </button>
          ))}
        </div>
        {hint && !done && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMC — ketma-ket tez MC (tap). Веди-до-верного. Опции — дроби (mt).
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const qs = c.questions; const n = qs.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `seq${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const q = qs[idx];
  const solvedItem = picked === q.correct;
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && qs[i].say) e.pushOneOff(qs[i].say[lang]); } };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const pick = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    const isCorrect = i === q.correct;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = isCorrect;
    if (isCorrect) {
      setPicked(i); sfx.playCorrect();
      const cur = firstTryRef.current.slice();
      advanceRef.current = setTimeout(() => {
        if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); sayItem(ni); }
        else finish(cur);
      }, 850);
    } else {
      sfx.playWrong();
      setWrong(prev => { const s = new Set(prev); s.add(i); return s; });
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(q.no ? q.no[lang] : c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{scored ? (lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.') : (lang === 'uz' ? "Mashq tugadi." : 'Разминка пройдена.')}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(10px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? 'qisqartiring:' : 'сократи:'}</span>
              <div className="dm-prob">{mt(tx(q.q))}</div>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(18px, 3.4vw, 24px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    {mt(tx(o))}
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? q.ok : q.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// s0 — HOOK: 6/8 verno, no proshche? (hook центрируется, picked сбрасывается)
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt_a, c.opt_b, c.opt_c];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.title[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
    setTimeout(() => onNext(), 650);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h1 className="title h-title fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h1>
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
            <div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="6" d="8" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={6} den={8} animateIn={true}/></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
            <div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="4" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={3} den={4} color={T.blue} animateIn={true}/></div>
          </div>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step-by-step: объединяем доли 6/8 → 3/4 (FracBar merge). (top-align + Bridge)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step1, c.step2, c.step3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? (lang === 'uz' ? 'Keyingi qadam' : 'Дальше') : <NextLabel/>} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1
            ? <div style={{ width: '100%', maxWidth: 460 }}><FracBar num={6} den={8} grid={8} mergeTo={4} merging={step >= 2} height={44} animateIn={true}/></div>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 1 && <p className="body" style={{ margin: 0, textAlign: 'center', maxWidth: 480 }}>{mt(t(steps[Math.min(step, last) - 1] || c.step1))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION step-by-step: сократи 8/12 до конца (DivLadder reveal). (top-align)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step1, c.step2, c.step3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? (lang === 'uz' ? 'Keyingi qadam' : 'Дальше') : <NextLabel/>} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 2
            ? <DivLadder steps={[{ a: 8, b: 12, by: 4 }]}/>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="8" d="12" size="mid"/>{step >= 1 && <span className="mono small fade-up" style={{ color: T.accent, fontWeight: 700 }}>÷4 ?</span>}</div>}
          {step >= 1 && <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
            {steps.slice(0, step).map((s, i) => <p key={i} className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(s))}</p>)}
          </div>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — RULE: правило сокращения (DivLadder 6/8 ÷2). (top-align + Bridge)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <DivLadder steps={[{ a: 6, b: 8, by: 2 }, { a: 10, b: 15, by: 5 }]}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_main))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_div))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s4 — TEST choice: сократи 6/9 (фигура FracBar). (correct old idx 0)
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [1, 2, 0, 3]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  const figure = () => (<div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="6" d="9" size="sm"/></div><div style={{ flex: 1 }}><FracBar num={6} den={9} grid={9} animateIn={true}/></div></div>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimRecipe/>}/>}/>;
};

// s5 — RULE misconception: делить только одно число (FracBar 3/8 vs 3/4). (top-align)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 'clamp(54px, 12vw, 70px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="8" size="sm" color={T.ink3}/></div>
            <div style={{ flex: 1 }}><FracBar num={3} den={8} grid={8} color={T.ink3} animateIn={true}/></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 'clamp(54px, 12vw, 70px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="4" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={3} den={4} grid={4} animateIn={true}/></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_main))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{mt(t(c.rule_div))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — TEST классификация «до конца / можно ещё».
const Screen6 = (props) => <ClassifyReduce {...props}/>;

// s7 — TEST choice (текст misconception): сократил только числитель? (correct old idx 0)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt_a), optEl(t, c.opt_b), optEl(t, c.opt_c), optEl(t, c.opt_d)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}/>;
};

// s_seq — TEST: 5 примеров «сократи до конца», растущие числа (tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — CASE setup: Санжар, рецепт 8/12. (top-align + Bridge)
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.cta)}/></>);
  const facts = [c.fact1, c.fact2, c.fact3];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {facts.map((f, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(f))}</p></div>))}
        </div>
      </div>
    </Stage>
  );
};

// s9 — CASE step: 8/12 = 2/3 (correct old idx 0). FactCard gears.
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [3, 0, 1, 2]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimGears/>}/>}/>;
};

// s10 — TEST error-spotting: где сокращение неверно (correct old idx 0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt_a), optEl(t, c.opt_b), optEl(t, c.opt_c), optEl(t, c.opt_d)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 1, 0, 3]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — TEST final: сократи 12/16 (correct old idx 0). FactCard compress.
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [1, 3, 0, 2]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimCompress/>}/>}/>;
};

// s12 — SUMMARY: счёт + «Главное»; finishLesson один раз. (top-align)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const mains = [c.point1, c.point2, c.point3];
  const scoreTotal = SCREEN_META.filter(s => s.scored).length;
  const scoreCorrect = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{lang === 'uz' ? 'Boshidan' : 'Заново'}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.success }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{scoreCorrect} / {scoreTotal}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <DivLadder steps={[{ a: 6, b: 8, by: 2 }]}/>
        </div>
      </div>
    </Stage>
  );
};

// === ROOT BELOW ===
// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ (шаблон из infrastructure_v1)
// ============================================================
export default function FractionReduceLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => {
      const next = [...prev];
      next[screenIdx] = data;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setAnswers([]);
    setCurrent(0);
    startTimeRef.current = Date.now();
  }, []);

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
    passed: finalScreens.length > 0
      ? finalCorrect / finalScreens.length >= 0.6
      : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
    firstTryStats: {
      total: checked.length,
      firstTryCorrect: checked.filter(a => a.firstTry === true).length
    },
    answers: answers.filter(Boolean)
  };
  safeOnFinished(payload);
}, [answers, safeOnFinished]);

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenSeq, Screen8, Screen9, Screen10, Screen11, Screen12];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => {
    recordAnswer(current, data);
  }, [current, recordAnswer]);

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
        <CurrentScreen
          screen={current}
          studentName={safeName}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          finishLesson={finishLesson}
        />
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

/* === SLIDER v15 === */
.track-wrap { position: relative; height: 26px; margin: 18px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

/* === INPUT v15 === */
.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

/* === FRAMES v15 === */
.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 17px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }

/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* MATH: сокращение дробей — полоса с merge, прыгающее число, лесенка деления (frac_5_08). */
.cp-grow { animation: cpGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpGrow { from { width: 0; } }
.cp-marker { animation: cpMarkerIn 0.3s ease-out backwards; }
@keyframes cpMarkerIn { from { opacity: 0; } }
.cp-slide { animation: cpSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpSlide { from { left: 0; } }
.cp-flag { transform-origin: bottom left; animation: cpFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, cpFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cpFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cpFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
.cp-merge { animation: cpMerge 0.5s ease forwards; }
@keyframes cpMerge { from { opacity: 1; } to { opacity: 0; } }
.cp-spin { animation: cpSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes cpSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.cp-ladder-step { animation: cpLadderIn 0.4s ease-out backwards; }
@keyframes cpLadderIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }

/* MATH: ketma-ket misol — nuqtali progress + katta masala. */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }

/* MATH: tasniflash (sort) — tray + savatlar. */
.sort-tray { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 16px; padding: clamp(13px, 2.5vw, 18px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); min-height: clamp(84px, 15vw, 100px); }
.sort-tray-card { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #0E0E10; animation: sort-pop 0.4s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes sort-pop { 0% { opacity: 0; transform: translateY(-8px) scale(0.8); } 100% { opacity: 1; transform: none; } }
.sort-tray-ask { font-size: clamp(12px, 1.6vw, 13px); color: #5A5A60; }
.sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2vw, 14px); }
.sort-bin { display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border: none; border-radius: 16px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.16); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease; min-height: clamp(94px, 17vw, 116px); text-align: left; }
.sort-bin:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 28px -6px rgba(58, 53, 48, 0.24); }
.sort-bin:disabled { cursor: default; }
.sort-bin-h { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); padding: 5px 10px; border-radius: 9px; }
.sort-bin-sq .sort-bin-h { color: #1F7A4D; background: #E3F0E8; }
.sort-bin-cu .sort-bin-h { color: #5A5A60; background: #EFEEE9; }
.sort-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sort-chip-in { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.8vw, 14px); color: #1F7A4D; background: #E3F0E8; border-radius: 9px; padding: 5px 9px; animation: sort-pop 0.35s ease both; }
.sort-bin-bad { animation: odShake 0.4s ease; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 22px -6px rgba(255, 79, 40, 0.3); }
@keyframes odShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

/* MATH: FactCard — fakt to'g'ri javobdan keyin (ko'k tema). */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
/* Tarix (oshpazlar retsepti): 4 ustun pulslab «qisqaradi». */
.fa-rec { display: flex; gap: 4px; width: clamp(86px, 17vw, 116px); }
.fa-rec-c { flex: 1; height: clamp(24px, 5vw, 32px); background: #019ACB; opacity: 0.22; border-radius: 4px; animation: faRec 2.8s ease-in-out infinite; }
.fa-rec-1 { animation-delay: 0s; } .fa-rec-2 { animation-delay: 0.7s; }
.fa-rec-3 { animation-delay: 0.35s; } .fa-rec-4 { animation-delay: 1.05s; }
@keyframes faRec { 0%, 100% { opacity: 0.18; transform: scaleX(1); } 50% { opacity: 0.9; transform: scaleX(0.92); } }
/* Fan (tishli uzatma): katta g'ildirak sekin, kichigi tez — 2:1. */
.fa-gear { position: relative; width: clamp(78px, 16vw, 104px); height: clamp(60px, 12vw, 80px); }
.fa-gear-big { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: clamp(40px, 8vw, 54px); height: clamp(40px, 8vw, 54px); border-radius: 50%; border: clamp(7px, 1.6vw, 10px) dashed #019ACB; opacity: 0.55; animation: faGearSpin 5.2s linear infinite; }
.fa-gear-small { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: clamp(22px, 4.5vw, 30px); height: clamp(22px, 4.5vw, 30px); border-radius: 50%; border: clamp(5px, 1.1vw, 7px) dashed #019ACB; opacity: 0.8; animation: faGearSpinR 2.6s linear infinite; }
@keyframes faGearSpin { to { transform: translateY(-50%) rotate(360deg); } }
@keyframes faGearSpinR { to { transform: translateY(-50%) rotate(-360deg); } }
/* IT (siqish): keng blok «siqilib» qisqaradi. */
.fa-cmp { position: relative; width: clamp(86px, 17vw, 116px); height: clamp(26px, 6vw, 34px); }
.fa-cmp-bar { position: absolute; left: 50%; top: 0; bottom: 0; transform: translateX(-50%); background: #019ACB; opacity: 0.8; border-radius: 4px; animation: faCmp 2.6s ease-in-out infinite; }
.fa-cmp-arrow { position: absolute; top: 50%; width: 0; height: 0; border-top: clamp(5px, 1.1vw, 7px) solid transparent; border-bottom: clamp(5px, 1.1vw, 7px) solid transparent; }
.fa-cmp-a-l { left: 0; transform: translateY(-50%); border-left: clamp(7px, 1.6vw, 10px) solid #019ACB; animation: faCmpArrL 2.6s ease-in-out infinite; }
.fa-cmp-a-r { right: 0; transform: translateY(-50%); border-right: clamp(7px, 1.6vw, 10px) solid #019ACB; animation: faCmpArrR 2.6s ease-in-out infinite; }
@keyframes faCmp { 0%, 100% { width: 88%; opacity: 0.55; } 50% { width: 36%; opacity: 0.95; } }
@keyframes faCmpArrL { 0%, 100% { left: 0; opacity: 0.4; } 50% { left: 28%; opacity: 0.95; } }
@keyframes faCmpArrR { 0%, 100% { right: 0; opacity: 0.4; } 50% { right: 28%; opacity: 0.95; } }

/* Ambient floaters. */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Bridge — переход между фазами. */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* Accessibility: prefers-reduced-motion. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
