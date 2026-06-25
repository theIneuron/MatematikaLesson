import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Эквивалентные дроби — правило — frac_5_07
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
// Tarix/Musiqa (cho'zim): yarim nota = ikkita chorak.
const AnimNote = () => (
  <div className="fa-note" aria-hidden="true">
    <span className="fa-note-half"/>
    <div className="fa-note-pair">
      <span className="fa-note-q"/>
      <span className="fa-note-q" style={{ animationDelay: '0.25s' }}/>
    </div>
  </div>
);
// Fan (tishli g'ildiraklar): 2:4 = 1:2 nisbati.
const AnimGears = () => (
  <div className="fa-gears" aria-hidden="true">
    <span className="fa-gear fa-gear-big"/>
    <span className="fa-gear fa-gear-sm"/>
  </div>
);
// IT (ekran nisbati): kichik 16:9 ramka katta 16:9 ichida.
const AnimScreen = () => (
  <div className="fa-scr" aria-hidden="true">
    <span className="fa-scr-out"/>
    <span className="fa-scr-in"/>
  </div>
);

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ — FracBar / EquivStack
// ============================================================
const FracBar = ({ num, den, grid = null, color = T.accent, height = 36, marker = false, winner = false, animateIn = false, sweep = false }) => {
  const pct = (num / den) * 100;
  const g = grid || den;
  const ease = 'cubic-bezier(0.34, 1.1, 0.64, 1)';
  return (
    <div className="cp-bar" style={{ position: 'relative', width: '100%', height, borderRadius: 8, background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
        <div className={`cp-fill${animateIn ? ' cp-grow' : ''}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, transition: `width 0.5s ${ease}` }}/>
        {Array.from({ length: g - 1 }).map((_, i) => (
          <div key={`${g}-${i}`} className={sweep ? 'cp-line' : undefined} style={{ position: 'absolute', left: `${((i + 1) / g) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg, animationDelay: sweep ? `${i * 0.045}s` : undefined }}/>
        ))}
      </div>
      {marker && num > 0 && (
        <div className={`cp-marker${animateIn ? ' cp-slide' : ''}`} style={{ position: 'absolute', left: `${pct}%`, top: -5, bottom: -5, width: 3, marginLeft: -1.5, background: color, borderRadius: 2, boxShadow: `0 0 7px ${color}`, transition: `left 0.5s ${ease}` }}>
          {winner && (
            <svg className="cp-flag" width="18" height="16" viewBox="0 0 18 16" style={{ position: 'absolute', top: -15, left: 1, overflow: 'visible' }}>
              <path d="M1 1 L14 4 L1 8 Z" fill={color}/>
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

const EquivStack = ({ rows, animateIn = true, sweep = false, dimIdx = null }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 520, margin: '0 auto' }}>
    {rows.map((r, i) => (
      <div key={i} className="cp-row" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', opacity: dimIdx === i ? 0.5 : 1 }}>
        <div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n={String(r.num)} d={String(r.den)} size="sm"/></div>
        <div style={{ flex: 1 }}><FracBar num={r.num} den={r.den} color={dimIdx === i ? T.ink3 : T.accent} animateIn={animateIn} sweep={sweep}/></div>
      </div>
    ))}
  </div>
);

// ============================================================
// --- POD UROK: frac_5_07 — Эквивалентные дроби — правило ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-07-v1',
  lessonTitle: { ru: 'Эквивалентные дроби — правило', uz: "Ekvivalent kasrlar — qoida" }
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
    title: {
      ru: 'Камрон накопил <b>1/2</b> цены велосипеда, а Бобур — <b>3/6</b>. Кто ближе к покупке?',
      uz: "Kamron velosiped narxining <b>1/2</b> qismini, Bobur esa <b>3/6</b> qismini yig'di. Kim xaridga yaqinroq?"
    },
    opt_a: { ru: 'Камрон', uz: 'Kamron' },
    opt_b: { ru: 'Бобур', uz: 'Bobur' },
    opt_c: { ru: 'Они накопили поровну', uz: "Ular teng yig'ishgan" },
    audio: {
      ru: 'Камрон накопил одну вторую цены велосипеда. Бобур накопил три шестых. Цифры разные. Как думаешь, кто ближе к покупке? Выбери ответ.',
      uz: "Kamron velosiped narxining bir ikkidan qismini yig'di. Bobur esa uch oltidan qismini yig'di. Raqamlar har xil. Sizningcha kim xaridga yaqinroq? Javobni tanlang."
    }
  },
  s1: {
    eyebrow: { ru: 'Исследование', uz: 'Tadqiqot' },
    bridge: { ru: 'Цифры разные — а накопления одинаковые? Проверим на полосках.', uz: "Raqamlar har xil, lekin jamg'arma bir xilmi? Chiziqlarda tekshiramiz." },
    title: { ru: 'Закрасим <b>1/2</b> и <b>3/6</b> на одинаковых полосках', uz: "Bir xil chiziqlarda <b>1/2</b> va <b>3/6</b> ni bo'yaymiz" },
    step1: { ru: 'Полоску Камрона делим на 2 части и красим одну. Закрашена ровно половина.', uz: "Kamronning chizig'ini 2 ga bo'lib, bittasini bo'yaymiz. Aniq yarmi bo'yaldi." },
    step2: { ru: 'Полоску Бобура делим на 6 частей и красим три. Граница встаёт на то же место.', uz: "Bobur chizig'ini 6 ga bo'lib, uchtasini bo'yaymiz. Chegara aynan o'sha joyga tushadi." },
    step3: { ru: 'Закрашенная длина одинаковая. <b>1/2 = 3/6</b> — это одно и то же количество.', uz: "Bo'yalgan uzunlik bir xil. <b>1/2 = 3/6</b> — bu bir xil miqdor." },
    audio: {
      ru: [
        'Возьмём две одинаковые полоски. На них покажем накопления обоих мальчиков.',
        'Полоску Камрона делим на две части и красим одну. Закрашена ровно половина. Нажми «Дальше».',
        'Полоску Бобура делим на шесть частей и красим три. Смотри, граница встала на то же самое место. Нажми «Дальше».',
        'Закрашенная длина у обоих одинаковая. Значит одна вторая равна трём шестым. Это одно и то же количество, записанное разными цифрами.'
      ],
      uz: [
        "Ikkita bir xil chiziq olamiz. Ularda ikkala bolaning jamg'armasini ko'rsatamiz.",
        "Kamronning chizig'ini ikki qismga bo'lib, bittasini bo'yaymiz. Aniq yarmi bo'yaldi. «Davom etish» ni bosing.",
        "Bobur chizig'ini olti qismga bo'lib, uchtasini bo'yaymiz. Qarang, chegara aynan o'sha joyga tushdi. «Davom etish» ni bosing.",
        "Bo'yalgan uzunlik ikkalasida bir xil. Demak bir ikkidan uch oltidan ga teng. Bu har xil raqamlar bilan yozilgan bir xil miqdor."
      ]
    }
  },
  s2: {
    eyebrow: { ru: 'Исследование', uz: 'Tadqiqot' },
    title: { ru: 'Как из <b>1/2</b> получилось <b>3/6</b>?', uz: "<b>1/2</b> dan <b>3/6</b> qanday hosil bo'ldi?" },
    step1: { ru: 'Числитель умножили на 3: <b>1 · 3 = 3</b>.', uz: "Suratni 3 ga ko'paytirdik: <b>1 · 3 = 3</b>." },
    step2: { ru: 'Знаменатель умножили на то же число 3: <b>2 · 3 = 6</b>.', uz: "Maxrajni ham aynan o'sha 3 ga ko'paytirdik: <b>2 · 3 = 6</b>." },
    step3: { ru: 'Умножили <b>и верх, и низ на одно и то же</b> — дробь не изменилась по величине.', uz: "<b>Surat ham, maxraj ham bitta songa</b> ko'paytirildi — kasrning qiymati o'zgarmadi." },
    audio: {
      ru: [
        'Посмотрим, что мы сделали с цифрами, чтобы из одной второй получить три шестых.',
        'Числитель, то есть верх, умножили на три. Один умножить на три равно три. Нажми «Дальше».',
        'Знаменатель, то есть низ, умножили на то же самое число три. Два умножить на три равно шесть. Нажми «Дальше».',
        'Главное: мы умножили и верх, и низ на одно и то же число. Поэтому величина дроби не изменилась, изменилась только запись.'
      ],
      uz: [
        "Bir ikkidan dan uch oltidan ni olish uchun raqamlar bilan nima qilganimizni ko'ramiz.",
        "Suratni, yaniy yuqorini, uchga ko'paytirdik. Bir karra uch teng uch. «Davom etish» ni bosing.",
        "Maxrajni, yaniy pastni, aynan o'sha uch soniga ko'paytirdik. Ikki karra uch teng olti. «Davom etish» ni bosing.",
        "Eng muhimi: biz surat ham, maxraj ham bitta songa ko'paytirdik. Shuning uchun kasrning qiymati o'zgarmadi, faqat yozuvi o'zgardi."
      ]
    }
  },
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    bridge: { ru: 'Это работает не только для 1/2. Вот общее правило.', uz: "Bu faqat 1/2 uchun emas. Mana umumiy qoida." },
    title: { ru: 'Правило эквивалентных дробей', uz: 'Ekvivalent kasrlar qoidasi' },
    rule_main: { ru: 'Если умножить <b>числитель и знаменатель на одно и то же число</b> (кроме нуля) — получится <b>равная</b> дробь.', uz: "Agar <b>surat va maxrajni bitta songa</b> (noldan tashqari) ko'paytirsak — <b>teng</b> kasr hosil bo'ladi." },
    rule_div: { ru: 'Делить верх и низ на одно и то же число — тоже можно. Дробь останется равной.', uz: "Surat va maxrajni bitta songa bo'lish ham mumkin. Kasr teng qoladi." },
    outro: { ru: 'Такие дроби называют <b>эквивалентными</b> — равными по величине, а само это правило — <b>основное свойство дроби</b>.', uz: "Bunday kasrlar <b>ekvivalent</b> — qiymati teng kasrlar deyiladi, qoidaning o'zi esa — <b>kasrning asosiy xossasi</b>." },
    audio: {
      ru: 'Запомни правило. Если умножить числитель и знаменатель на одно и то же число, кроме нуля, получится равная дробь. Делить верх и низ на одно и то же число тоже можно, дробь останется равной. Такие дроби называют эквивалентными, то есть равными по величине.',
      uz: "Qoidani eslab qoling. Agar surat va maxrajni bitta songa, noldan tashqari, ko'paytirsak, teng kasr hosil bo'ladi. Surat va maxrajni bitta songa bo'lish ham mumkin, kasr teng qoladi. Bunday kasrlar ekvivalent, yaniy qiymati teng kasrlar deyiladi."
    }
  },
  s4: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    bridge: { ru: 'Применим правило.', uz: "Qoidani qo'llaymiz." },
    title: { ru: 'Какая дробь равна <b>1/2</b>?', uz: "Qaysi kasr <b>1/2</b> ga teng?" },
    question: { ru: 'Посмотри на полоски: у какой закрашенная длина совпадает с 1/2?', uz: "Chiziqlarga qarang: qaysisida bo'yalgan uzunlik 1/2 bilan mos keladi?" },
    opt_a: { ru: '2/4', uz: '2/4' },
    opt_b: { ru: '2/3', uz: '2/3' },
    opt_c: { ru: '3/4', uz: '3/4' },
    opt_d: { ru: '1/3', uz: '1/3' },
    correct_text: { ru: 'Верно. 2/4 — это 1·2 / 2·2. Верх и низ умножили на 2, граница на той же половине.', uz: "To'g'ri. 2/4 — bu 1·2 / 2·2. Surat va maxraj 2 ga ko'paytirildi, chegara o'sha yarmida." },
    wrong_0: { ru: 'Две четвёртых — это ровно половина: верх и низ дроби одна вторая умножили на два.', uz: "Ikkidan to'rt — aniq yarmi: ikkidan bir kasrning surat va maxraji ikkiga ko'paytirildi." },
    wrong_1: { ru: 'Две третьих больше половины: закрашено две части из трёх, граница правее середины.', uz: "Uchdan ikki yarmidan katta: uchdan ikki qism bo'yalgan, chegara o'rtadan o'ngda." },
    wrong_2: { ru: 'Три четвёртых — это намного больше половины. Сравни полоски.', uz: "To'rtdan uch — yarmidan ancha katta. Chiziqlarni solishtiring." },
    wrong_3: { ru: 'Одна третья меньше половины: одна часть из трёх, граница левее середины.', uz: "Uchdan bir yarmidan kichik: uchdan bir qism, chegara o'rtadan chapda." },
    audio: {
      intro: { ru: 'Какая из этих дробей равна одной второй? Смотри на закрашенную длину полосок и выбирай.', uz: "Bu kasrlardan qaysi biri bir ikkidan ga teng? Chiziqlarning bo'yalgan uzunligiga qarab tanlang." },
      on_correct: { ru: 'Верно. Две четвёртых — это та же половина.', uz: "To'g'ri. Ikki to'rtdan — o'sha yarmi." },
      on_wrong: { ru: 'Сравни закрашенную длину с половиной полоски.', uz: "Bo'yalgan uzunlikni chiziqning yarmi bilan solishtiring." }
    }
  },
  s5: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    title: { ru: 'Частая ошибка: менять <b>только низ</b>', uz: "Ko'p uchraydigan xato: <b>faqat maxrajni</b> o'zgartirish" },
    rule_main: { ru: 'Кто-то думает: «<b>1/2</b>, увеличу низ → <b>1/6</b>». Но это <b>другая, меньшая</b> дробь!', uz: "Kimdir o'ylaydi: «<b>1/2</b>, maxrajni kattalashtiraman → <b>1/6</b>». Lekin bu <b>boshqa, kichikroq</b> kasr!" },
    rule_div: { ru: 'Смотри: у 1/6 закрашена всего одна часть из шести. Это намного меньше половины.', uz: "Qarang: 1/6 da oltidan atigi bitta qism bo'yalgan. Bu yarmidan ancha kichik." },
    outro: { ru: 'Чтобы дробь осталась равной, меняй <b>и верх, и низ</b> — на одно и то же число.', uz: "Kasr teng qolishi uchun <b>surat ham, maxraj ham</b> bitta songa o'zgartiriladi." },
    audio: {
      ru: 'Будь внимателен к частой ошибке. Кто-то берёт одну вторую и меняет только низ, получая одну шестую. Но смотри: у одной шестой закрашена всего одна часть из шести. Это намного меньше половины. Чтобы дробь осталась равной, нужно менять и верх, и низ на одно и то же число.',
      uz: "Ko'p uchraydigan xatoga e'tibor bering. Kimdir bir ikkidan ni olib, faqat maxrajni o'zgartirib, bir oltidan ni hosil qiladi. Lekin qarang: bir oltidan da oltidan atigi bitta qism bo'yalgan. Bu yarmidan ancha kichik. Kasr teng qolishi uchun surat ham, maxraj ham bitta songa o'zgartirilishi kerak."
    }
  },
  s6: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    title: { ru: 'Разложи дроби: равна <b>1/2</b> или нет', uz: "Kasrlarni ajrating: <b>1/2</b> ga tengmi yoki yo'q" },
    lead: { ru: 'Нажми на дробь — она улетит в нужную корзину. Равна половине или нет?', uz: "Kasrni bosing — u kerakli savatga uchadi. Yarmiga tengmi yoki yo'q?" },
    ask: { ru: 'равна 1/2?', uz: "1/2 ga tengmi?" },
    bin_eq: { ru: 'равна 1/2', uz: "1/2 ga teng" },
    bin_uneq: { ru: 'не равна 1/2', uz: "1/2 ga teng emas" },
    hint_wrong: { ru: 'Проверь: низ ровно вдвое больше верха? Тогда дробь равна половине.', uz: "Tekshiring: maxraji suratdan aniq ikki barobar kattami? Unda kasr yarmiga teng." },
    correct_text: { ru: 'Готово. Равны половине те дроби, где низ ровно вдвое больше верха: 2/4, 3/6, 4/8, 5/10.', uz: "Tayyor. Maxraji suratdan aniq ikki barobar katta kasrlar yarmiga teng: 2/4, 3/6, 4/8, 5/10." },
    audio: {
      intro: { ru: 'Перед тобой дроби. Разложи их по двум корзинам: равна одной второй или нет. Нажимай на дробь — она улетит в корзину.', uz: "Oldingizda kasrlar. Ularni ikki savatga ajrating: bir ikkidan ga tengmi yoki yo'q. Kasrni bosing — u savatga uchadi." },
      on_correct: { ru: 'Верно, в нужную корзину.', uz: "To'g'ri, kerakli savatga." },
      on_wrong: { ru: 'Подумай: низ ровно вдвое больше верха?', uz: "O'ylab ko'ring: maxraji suratdan aniq ikki barobar kattami?" }
    }
  },
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Дополни до равной дроби: <b>2/3 = ?/6</b>', uz: "Teng kasrgacha to'ldiring: <b>2/3 = ?/6</b>" },
    question: { ru: 'Низ умножили на 2 (3·2=6). На что нужно умножить верх?', uz: "Maxraj 2 ga ko'paytirildi (3·2=6). Suratni nechaga ko'paytirish kerak?" },
    opt_a: { ru: '4', uz: '4' },
    opt_b: { ru: '2', uz: '2' },
    opt_c: { ru: '5', uz: '5' },
    opt_d: { ru: '6', uz: '6' },
    correct_text: { ru: 'Верно. 3 умножили на 2, значит и 2 умножаем на 2: получаем 4. 2/3 = 4/6.', uz: "To'g'ri. 3 ni 2 ga ko'paytirdik, demak 2 ni ham 2 ga: 4 chiqadi. 2/3 = 4/6." },
    wrong_0: { ru: 'Да: низ умножили на два, верх тоже на два — это четыре. Две третьих это четыре шестых.', uz: "Ha: maxraj ikkiga ko'paytirildi, surat ham ikkiga — bu to'rt. Uchdan ikki bu oltidan to'rt." },
    wrong_1: { ru: 'Если оставить верх как два, дробь две шестых — она меньше. Верх тоже надо умножить на два.', uz: "Suratni ikki qoldirsak, oltidan ikki kasri kichikroq. Suratni ham ikkiga ko'paytirish kerak." },
    wrong_2: { ru: 'Откуда 5? Множитель один — 2, и для верха, и для низа.', uz: "5 qayerdan? Ko'paytuvchi bitta — 2, surat uchun ham, maxraj uchun ham." },
    wrong_3: { ru: '6 — это новый низ, а не верх. Верх: 2 умножить на 2 равно 4.', uz: "6 — bu yangi maxraj, surat emas. Surat: 2 karra 2 teng 4." },
    fact: { ru: 'В шестерёнках часов одно колесо вдвое больше другого — это та же эквивалентность 1 к 2, что и 3/6 = 1/2.', uz: "Soat tishli g'ildiraklarida bir g'ildirak ikkinchisidan ikki barobar katta — bu xuddi 3/6 = 1/2 dagi 1 ga 2 ekvivalentligi." },
    audio: {
      intro: { ru: 'Дополни дробь так, чтобы две третьих стали равны чему-то шестых. Низ умножили на два. На что умножить верх?', uz: "Kasrni to'ldiring: uch ikkidan nechadir oltidan ga teng bo'lsin. Maxraj ikkiga ko'paytirildi. Suratni nechaga ko'paytiramiz?" },
      on_correct: { ru: 'Верно, четыре.', uz: "To'g'ri, to'rt." },
      on_wrong: { ru: 'Тот же множитель, что и у низа.', uz: "Maxrajdagi bilan bir xil ko'paytuvchi." }
    }
  },
  s_seq: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashqlar' },
    title: { ru: 'Найди числитель: <b>5 примеров подряд</b>', uz: "Suratni toping: <b>5 ta misol ketma-ket</b>" },
    lead: { ru: 'Числа растут. Умножай верх на тот же множитель, что и низ.', uz: "Sonlar o'sib boradi. Suratni maxrajdagi bilan bir xil ko'paytuvchiga ko'paytiring." },
    questions: [
      {
        q: '1/2 = ?/8', opts: ['4', '2', '6'], correct: 0,
        ok: { ru: 'Верно. Низ 2·4=8, значит верх 1·4=4. 1/2 = 4/8.', uz: "To'g'ri. Maxraj 2·4=8, demak surat 1·4=4. 1/2 = 4/8." },
        no: { ru: 'Низ умножили на 4. На столько же умножь верх.', uz: "Maxraj 4 ga ko'paytirildi. Suratni ham shuncha songa ko'paytiring." }
      },
      {
        q: '2/5 = ?/20', opts: ['2', '8', '10'], correct: 1,
        ok: { ru: 'Верно. Низ 5·4=20, значит верх 2·4=8. 2/5 = 8/20.', uz: "To'g'ri. Maxraj 5·4=20, demak surat 2·4=8. 2/5 = 8/20." },
        no: { ru: 'Низ умножили на 4. Верх 2 тоже умножь на 4.', uz: "Maxraj 4 ga ko'paytirildi. Surat 2 ni ham 4 ga ko'paytiring." }
      },
      {
        q: '3/4 = ?/40', opts: ['12', '30', '3'], correct: 1,
        ok: { ru: 'Верно. Низ 4·10=40, значит верх 3·10=30. 3/4 = 30/40.', uz: "To'g'ri. Maxraj 4·10=40, demak surat 3·10=30. 3/4 = 30/40." },
        no: { ru: 'Низ умножили на 10. Верх 3 тоже умножь на 10.', uz: "Maxraj 10 ga ko'paytirildi. Surat 3 ni ham 10 ga ko'paytiring." }
      },
      {
        q: '3/5 = ?/100', opts: ['60', '20', '3'], correct: 0,
        ok: { ru: 'Верно. Низ 5·20=100, значит верх 3·20=60. 3/5 = 60/100.', uz: "To'g'ri. Maxraj 5·20=100, demak surat 3·20=60. 3/5 = 60/100." },
        no: { ru: 'Низ умножили на 20. На столько же умножь верх.', uz: "Maxraj 20 ga ko'paytirildi. Suratni ham shuncha songa ko'paytiring." },
        say: { ru: 'Знаменатель большой. На сколько умножили низ, на столько умножь и верх.', uz: "Maxraj katta. Maxrajni nechaga ko'paytirgan bo'lsangiz, suratni ham shuncha songa ko'paytiring." }
      },
      {
        q: '1/4 = ?/1000', opts: ['100', '25', '250'], correct: 2,
        ok: { ru: 'Верно. Низ 4·250=1000, значит верх 1·250=250. 1/4 = 250/1000.', uz: "To'g'ri. Maxraj 4·250=1000, demak surat 1·250=250. 1/4 = 250/1000." },
        no: { ru: 'Низ умножили на 250. Верх 1 тоже умножь на 250.', uz: "Maxraj 250 ga ko'paytirildi. Surat 1 ni ham 250 ga ko'paytiring." },
        say: { ru: 'Числа большие, но правило то же: один множитель для верха и низа.', uz: "Sonlar katta, lekin qoida o'sha: surat va maxraj uchun bitta ko'paytuvchi." }
      }
    ],
    audio: {
      intro: { ru: 'Пять примеров подряд. В каждом найди числитель равной дроби. Числа будут расти. Множитель для верха всегда такой же, как для низа.', uz: "Besh misol ketma-ket. Har birida teng kasrning suratini toping. Sonlar o'sib boradi. Surat uchun ko'paytuvchi doim maxraj bilan bir xil." },
      on_wrong: { ru: 'На сколько умножили низ, на столько умножь и верх.', uz: "Maxrajni nechaga ko'paytirgan bo'lsangiz, suratni ham shuncha songa ko'paytiring." },
      on_done: { ru: 'Готово. Ты держал один множитель для верха и низа даже на больших числах.', uz: "Tayyor. Katta sonlarda ham surat va maxraj uchun bitta ko'paytuvchini ushlab turdingiz." }
    }
  },
  s8: {
    eyebrow: { ru: 'Случай', uz: 'Vaziyat' },
    bridge: { ru: 'Эквивалентные дроби нужны не только в тетради. Вот кухня.', uz: "Ekvivalent kasrlar faqat daftarda emas. Mana oshxona." },
    title: { ru: 'Лайло готовит по рецепту', uz: "Laylo retsept bo'yicha pishirmoqda" },
    fact1: { ru: 'В рецепте сказано: <b>2/3</b> стакана сахара.', uz: "Retseptda: <b>2/3</b> stakan shakar deyilgan." },
    fact2: { ru: 'У Лайло мерный стакан с делениями на <b>6</b> частей.', uz: "Layloda <b>6</b> ga bo'lingan o'lchov stakani bor." },
    fact3: { ru: 'Сколько шестых ей отмерить, чтобы вышло ровно 2/3?', uz: "Aynan 2/3 chiqishi uchun necha oltidan o'lchashi kerak?" },
    cta: { ru: 'Помочь Лайло', uz: 'Layloga yordam berish' },
    audio: {
      ru: 'Лайло готовит по рецепту. В рецепте сказано: две третьих стакана сахара. Но у Лайло мерный стакан с делениями на шесть частей. Сколько шестых ей отмерить, чтобы получилось ровно две третьих? Нажми «Помочь Лайло».',
      uz: "Laylo retsept bo'yicha pishirmoqda. Retseptda: uch ikkidan stakan shakar deyilgan. Lekin Layloda olti qismga bo'lingan o'lchov stakani bor. Aynan uch ikkidan chiqishi uchun necha oltidan o'lchashi kerak? «Layloga yordam berish» ni bosing."
    }
  },
  s9: {
    eyebrow: { ru: 'Случай', uz: 'Vaziyat' },
    title: { ru: 'Сколько шестых стакана нужно Лайло?', uz: "Layloga necha oltidan stakan kerak?" },
    question: { ru: '2/3 — это сколько шестых? Низ с 3 стал 6 (умножили на 2).', uz: "2/3 — necha oltidan? Maxraj 3 dan 6 bo'ldi (2 ga ko'paytirildi)." },
    opt_a: { ru: '4/6', uz: '4/6' },
    opt_b: { ru: '2/6', uz: '2/6' },
    opt_c: { ru: '3/6', uz: '3/6' },
    opt_d: { ru: '6/6', uz: '6/6' },
    correct_text: { ru: 'Верно. 2·2=4, 3·2=6. Значит 2/3 = 4/6. Лайло отмерит 4 деления.', uz: "To'g'ri. 2·2=4, 3·2=6. Demak 2/3 = 4/6. Laylo 4 bo'limni o'lchaydi." },
    wrong_0: { ru: 'Да, четыре шестых: верх два умножили на два, низ три умножили на два.', uz: "Ha, oltidan to'rt: surat ikkini ikkiga, maxraj uchni ikkiga ko'paytirdik." },
    wrong_1: { ru: 'Две шестых — низ умножили, верх забыли. Это меньше, чем две третьих.', uz: "Oltidan ikki — maxrajni ko'paytirib, suratni unutdik. Bu uchdan ikkidan kichik." },
    wrong_2: { ru: 'Три шестых — это половина, а две третьих больше половины. Не подходит.', uz: "Oltidan uch — bu yarmi, uchdan ikki esa yarmidan katta. To'g'ri kelmaydi." },
    wrong_3: { ru: 'Шесть шестых — это целый стакан. Две третьих меньше целого.', uz: "Oltidan olti — bu butun stakan. Uchdan ikki butundan kichik." },
    fact: { ru: 'В нотах целая нота равна двум половинным, а половинная — двум четвертным. Музыканты считают такими же эквивалентными дробями.', uz: "Notalarda butun nota ikki yarim notaga, yarim nota esa ikki chorak notaga teng. Musiqachilar xuddi shunday ekvivalent kasrlar bilan sanaydi." },
    audio: {
      intro: { ru: 'Помоги Лайло. Две третьих стакана — это сколько шестых? Низ был три, стал шесть. Выбирай.', uz: "Layloga yordam bering. Uch ikkidan stakan — necha oltidan? Maxraj uch edi, olti bo'ldi. Tanlang." },
      on_correct: { ru: 'Верно, четыре шестых.', uz: "To'g'ri, to'rt oltidan." },
      on_wrong: { ru: 'Верх тоже умножь на 2.', uz: "Suratni ham 2 ga ko'paytiring." }
    }
  },
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    title: { ru: 'Где запись <b>неверна</b>?', uz: "Qaysi yozuv <b>noto'g'ri</b>?" },
    question: { ru: 'Три записи равных дробей сделаны верно, одна — с ошибкой. Найди ошибочную.', uz: "Teng kasrlarning uchta yozuvi to'g'ri, bittasi xato. Xatosini toping." },
    opt_a: { ru: '1/2 = 1/6', uz: '1/2 = 1/6' },
    opt_b: { ru: '1/2 = 5/10', uz: '1/2 = 5/10' },
    opt_c: { ru: '3/4 = 6/8', uz: '3/4 = 6/8' },
    opt_d: { ru: '2/5 = 4/10', uz: '2/5 = 4/10' },
    correct_text: { ru: 'Верно. 1/2 = 1/6 — ошибка: низ умножили на 3, а верх оставили. Надо 1/2 = 3/6.', uz: "To'g'ri. 1/2 = 1/6 — xato: maxraj 3 ga ko'paytirilib, surat qoldirilgan. 1/2 = 3/6 bo'lishi kerak." },
    wrong_0: { ru: 'Да: низ умножили на три, а верх нет. Поэтому одна вторая не равна одной шестой.', uz: "Ha: maxraj uchga ko'paytirilib, surat ko'paytirilmagan. Shuning uchun ikkidan bir oltidan birga teng emas." },
    wrong_1: { ru: 'Одна вторая равна пяти десятым — верно: и верх, и низ умножили на пять.', uz: "Ikkidan bir o'ndan beshga teng — to'g'ri: surat ham, maxraj ham beshga ko'paytirilgan." },
    wrong_2: { ru: 'Три четвёртых равны шести восьмым — верно: и верх, и низ умножили на два.', uz: "To'rtdan uch sakkizdan oltiga teng — to'g'ri: surat ham, maxraj ham ikkiga ko'paytirilgan." },
    wrong_3: { ru: 'Две пятых равны четырём десятым — верно: и верх, и низ умножили на два.', uz: "Beshdan ikki o'ndan to'rtga teng — to'g'ri: surat ham, maxraj ham ikkiga ko'paytirilgan." },
    audio: {
      intro: { ru: 'Три записи равных дробей сделаны правильно, одна — с ошибкой. Найди ту, где равенство неверно.', uz: "Teng kasrlarning uchta yozuvi to'g'ri, bittasi xato. Tenglik noto'g'ri bo'lganini toping." },
      on_correct: { ru: 'Верно, тут низ умножили, а верх забыли.', uz: "To'g'ri, bu yerda maxrajni ko'paytirib, suratni unutgan." },
      on_wrong: { ru: 'Проверь каждое: и верх, и низ умножены на одно число?', uz: "Har birini tekshiring: surat ham, maxraj ham bitta songa ko'paytirilganmi?" }
    }
  },
  s11: {
    eyebrow: { ru: 'Итоговая проверка', uz: 'Yakuniy tekshiruv' },
    title: { ru: 'Сократи <b>6/8</b> до меньших чисел', uz: "<b>6/8</b> ni kichikroq sonlarga keltiring" },
    question: { ru: 'Раздели верх и низ на одно и то же число. Какая дробь получится равной?', uz: "Surat va maxrajni bitta songa bo'ling. Qaysi teng kasr hosil bo'ladi?" },
    opt_a: { ru: '3/4', uz: '3/4' },
    opt_b: { ru: '6/8', uz: '6/8' },
    opt_c: { ru: '3/8', uz: '3/8' },
    opt_d: { ru: '2/4', uz: '2/4' },
    correct_text: { ru: 'Верно. 6/8: делим верх и низ на 2 → 3/4. Это та же величина, числа меньше.', uz: "To'g'ri. 6/8: surat va maxrajni 2 ga bo'lamiz → 3/4. Bu o'sha qiymat, sonlar kichikroq." },
    wrong_0: { ru: 'Да: шесть разделить на два равно три, восемь разделить на два равно четыре. Шесть восьмых это три четвёртых.', uz: "Ha: oltini ikkiga bo'lsak uch, sakkizni ikkiga bo'lsak to'rt. Sakkizdan olti bu to'rtdan uch." },
    wrong_1: { ru: 'Шесть восьмых — это исходная дробь, её ещё не сократили.', uz: "Sakkizdan olti — boshlang'ich kasr, hali keltirilmagan." },
    wrong_2: { ru: 'Три восьмых — низ оставили без деления. Делить надо и верх, и низ.', uz: "Sakkizdan uch — maxraj bo'linmay qoldi. Surat ham, maxraj ham bo'linadi." },
    wrong_3: { ru: 'Две четвёртых не равны шести восьмым: тут другое отношение. Раздели шесть восьмых на два.', uz: "To'rtdan ikki sakkizdan oltiga teng emas: bu boshqa nisbat. Sakkizdan oltini ikkiga bo'ling." },
    audio: {
      intro: { ru: 'Итоговое задание. Сократи дробь шесть восьмых — раздели верх и низ на одно и то же число. Какая равная дробь получится?', uz: "Yakuniy topshiriq. Olti sakkizdan kasrini keltiring — surat va maxrajni bitta songa bo'ling. Qaysi teng kasr chiqadi?" },
      on_correct: { ru: 'Верно, три четвёртых.', uz: "To'g'ri, uch to'rtdan." },
      on_wrong: { ru: 'Дели и верх, и низ на одно число.', uz: "Surat va maxrajni bitta songa bo'ling." }
    }
  },
  s12: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    title: { ru: 'Что ты теперь умеешь', uz: 'Endi nimani bilasiz' },
    point1: { ru: 'Эквивалентные дроби — это <b>разные записи одной величины</b> (1/2 = 3/6).', uz: "Ekvivalent kasrlar — <b>bir qiymatning har xil yozuvi</b> (1/2 = 3/6)." },
    point2: { ru: 'Умножай или дели <b>верх и низ на одно и то же число</b> — дробь не меняется.', uz: "<b>Surat va maxrajni bitta songa</b> ko'paytiring yoki bo'ling — kasr o'zgarmaydi." },
    point3: { ru: 'Менять только низ — <b>ошибка</b>: получится другая дробь.', uz: "Faqat maxrajni o'zgartirish — <b>xato</b>: boshqa kasr chiqadi." },
    score_caption: { ru: 'Правильных ответов', uz: "To'g'ri javoblar" },
    audio: {
      ru: 'Подведём итог. Эквивалентные дроби — это разные записи одной и той же величины. Чтобы получить равную дробь, умножай или дели верх и низ на одно и то же число. Менять только низ нельзя — получится другая дробь. Ты молодец.',
      uz: "Xulosa qilamiz. Ekvivalent kasrlar — bir xil qiymatning har xil yozuvi. Teng kasr olish uchun surat va maxrajni bitta songa ko'paytiring yoki bo'ling. Faqat maxrajni o'zgartirib bo'lmaydi — boshqa kasr chiqadi. Ofarin."
    }
  }
};

// === SCREENS BELOW ===
// ============================================================
// s6 — TASNIFLASH: «= 1/2» yoki «teng emas» (tap-to-bin, Fisher-Yates, веди-до-верного)
// ============================================================
const S6_CARDS = [
  // oson (aniq)
  { label: '2/4', bin: 'lt' },
  { label: '1/3', bin: 'gt' },
  { label: '3/6', bin: 'lt' },
  { label: '2/3', bin: 'gt' },
  { label: '4/8', bin: 'lt' },
  { label: '3/4', bin: 'gt' },
  // qiyin (qisqartirish kerak)
  { label: '5/10', bin: 'lt' },
  { label: '2/6', bin: 'gt' },
  { label: '4/6', bin: 'gt' },
  { label: '6/12', bin: 'lt' }
];
const S6_BINS = [{ key: 'lt' }, { key: 'gt' }];

const ClassifyEquiv = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
// SeqMC — ketma-ket tez MC (tap). Веди-до-верного. (Dars28 etaloni)
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
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(18px, 3.4vw, 24px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {tx(o)}
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

// s0 — HOOK: Камрон 1/2 vs Бобур 3/6. (hook центрируется, picked полностью сбрасывается)
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
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 3, den: 6 }]} animateIn={true}/>
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

// s1 — EXPLORATION step-by-step: закрасим 1/2 и 3/6. (top-align + Bridge)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step1, c.step2, c.step3];
  const rows = step >= 2 ? [{ num: 1, den: 2 }, { num: 3, den: 6 }] : [{ num: 1, den: 2 }];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? (lang === 'uz' ? 'Keyingi qadam' : 'Дальше') : <NextLabel/>} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1
            ? <EquivStack rows={rows} animateIn={true} sweep={step >= 2}/>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 1 && <p className="body" style={{ margin: 0, textAlign: 'center', maxWidth: 480 }}>{mt(t(steps[Math.min(step, last) - 1] || c.step1))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION step-by-step: как из 1/2 получилось 3/6 (умножение верха и низа).
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 140, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 4vw, 30px)' }}>
            <Frac n="1" d="2" size="mid"/>
            <span className="mono" style={{ fontSize: 'clamp(20px, 4vw, 28px)', color: T.ink3 }}>→</span>
            <Frac n="3" d="6" size="mid" color={step >= 2 ? T.accent : T.ink3}/>
          </div>
          {step >= 1 && <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460 }}>
            {steps.slice(0, step).map((s, i) => <p key={i} className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(s))}</p>)}
          </div>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — RULE: правило эквивалентных дробей. (top-align + Bridge)
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
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 2, den: 4 }, { num: 3, den: 6 }, { num: 4, den: 8 }]} animateIn={true} sweep={true}/>
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

// s4 — TEST choice: какая дробь равна 1/2 (с фигурой-ориентиром). (correct old idx 0)
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [1, 2, 0, 3]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  const figure = () => (<EquivStack rows={[{ num: 1, den: 2 }, { num: 2, den: 4 }, { num: 2, den: 3 }, { num: 1, den: 3 }]} animateIn={true}/>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s5 — RULE: частая ошибка — менять только низ (1/2 ≠ 1/6, EquivStack dimIdx). (top-align)
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 1, den: 6 }]} animateIn={true} dimIdx={1}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480, margin: '0 auto' }}>
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

// s6 — TEST классификация «= 1/2 или нет».
const Screen6 = (props) => <ClassifyEquiv {...props}/>;

// s7 — TEST choice: дополни 2/3 = ?/6 (correct old idx 0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [2, 0, 3, 1]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimGears/>}/>}/>;
};

// s_seq — TEST: 5 примеров «найди числитель», растущие знаменатели (tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — CASE setup: Лайло готовит по рецепту. (top-align + Bridge)
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

// s9 — CASE step: 2/3 = ? шестых (correct old idx 0).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [3, 0, 1, 2]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimNote/>}/>}/>;
};

// s10 — TEST error-spotting: где запись неверна (correct old idx 0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt_a), optEl(t, c.opt_b), optEl(t, c.opt_c), optEl(t, c.opt_d)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — TEST final: сократи 6/8 (correct old idx 0).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [3, 1, 0, 2]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}/>;
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
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 3, den: 6 }]} animateIn={true}/>
        </div>
      </div>
    </Stage>
  );
};

// === ROOT BELOW ===
// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ (шаблон из infrastructure_v1)
// ============================================================
export default function FractionEquivLesson({
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

/* MATH: эквивалентные дроби — полоски равной длины (frac_5_07). */
.cp-row { animation: cpRowIn 0.42s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpRowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.cp-grow { animation: cpGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpGrow { from { width: 0; } }
.cp-line { animation: cpLineIn 0.32s ease-out backwards; transform-origin: center top; }
@keyframes cpLineIn { from { opacity: 0; transform: scaleY(0.1); } to { opacity: 1; transform: scaleY(1); } }
.cp-marker { animation: cpMarkerIn 0.3s ease-out backwards; }
@keyframes cpMarkerIn { from { opacity: 0; } }
.cp-slide { animation: cpSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpSlide { from { left: 0; } }
.cp-flag { transform-origin: bottom left; animation: cpFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, cpFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cpFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cpFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }

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
/* Tarix/Musiqa (cho'zim): yarim nota = ikkita chorak. */
.fa-note { display: flex; align-items: flex-end; gap: 8px; height: clamp(46px, 9vw, 60px); }
.fa-note-half { width: 16px; height: 100%; background: #019ACB; opacity: 0.85; border-radius: 3px; animation: faNoteHalf 2.4s ease-in-out infinite; }
.fa-note-pair { display: flex; gap: 5px; align-items: flex-end; }
.fa-note-q { width: 11px; height: 100%; background: #019ACB; opacity: 0.4; border-radius: 3px; animation: faNoteQ 2.4s ease-in-out infinite; }
@keyframes faNoteHalf { 0%, 100% { opacity: 0.35; } 25% { opacity: 0.95; } }
@keyframes faNoteQ { 0%, 100% { opacity: 0.3; } 60%, 80% { opacity: 0.92; } }
/* Fan (tishli g'ildiraklar): 2:4 = 1:2 nisbati. */
.fa-gears { position: relative; width: clamp(74px, 15vw, 100px); height: clamp(56px, 11vw, 72px); }
.fa-gear { position: absolute; border-radius: 50%; border: 3px dashed #019ACB; box-sizing: border-box; }
.fa-gear-big { width: clamp(40px, 8vw, 52px); height: clamp(40px, 8vw, 52px); left: 0; top: 50%; transform: translateY(-50%); opacity: 0.85; animation: faGearCW 4.4s linear infinite; }
.fa-gear-sm { width: clamp(24px, 5vw, 32px); height: clamp(24px, 5vw, 32px); right: 2px; top: 50%; transform: translateY(-50%); opacity: 0.55; animation: faGearCCW 2.2s linear infinite; }
@keyframes faGearCW { to { transform: translateY(-50%) rotate(360deg); } }
@keyframes faGearCCW { to { transform: translateY(-50%) rotate(-360deg); } }
/* IT (ekran nisbati): kichik 16:9 ramka katta 16:9 ichida. */
.fa-scr { position: relative; width: clamp(72px, 15vw, 96px); height: clamp(40px, 8vw, 54px); }
.fa-scr-out { position: absolute; inset: 0; border: 2.5px solid #019ACB; border-radius: 4px; opacity: 0.85; }
.fa-scr-in { position: absolute; left: 50%; top: 50%; width: 56.25%; height: 56.25%; transform: translate(-50%, -50%); border: 2px solid #019ACB; border-radius: 3px; opacity: 0.4; animation: faScr 2.6s ease-in-out infinite; }
@keyframes faScr { 0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.9); } 50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); } }

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
