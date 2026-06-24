import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сравнение дробей с разными знаменателями (интуитивно) — frac_5_11
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C. s6 → упорядочивание по значению (разные знаменатели), s10 → error-spotting,
// s_seq → 6 примеров «поставь знак» с растущими числами (1→4 знака). Top-align, Bridge, shuffleMC.

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
  const g = gender === 'f' ? 'f' : 'm';
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
  setGender(g) { this.gender = g === 'f' ? 'f' : 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет

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
// Tarix (bozor o'lchovlari): har xil kenglikdagi o'lchov bitta umumiy chiziqqa keltiriladi.
const AnimBazaar = () => (
  <div className="fc-bazaar" aria-hidden="true">
    <span className="fc-bz-r fc-bz-1"/>
    <span className="fc-bz-r fc-bz-2"/>
    <span className="fc-bz-base"/>
  </div>
);
// Fan (mo'ljal 1/2): chizg'ich o'rtasida belgi, nuqta yarimning chap/o'ng tomonida tebranadi.
const AnimBench = () => (
  <div className="fc-bench" aria-hidden="true">
    <span className="fc-bn-line"/>
    <span className="fc-bn-half"/>
    <span className="fc-bn-dot"/>
  </div>
);
// IT (responsive): bir xil shkalada uch ekran bir xil ulushgacha to'ladi.
const AnimScreen = () => (
  <div className="fc-screen" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span key={i} className={`fc-sc-box fc-sc-${i + 1}`}>
        <span className="fc-sc-fill" style={{ animationDelay: `${i * 0.25}s` }}/>
      </span>
    ))}
  </div>
);

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ — FracBar / CompareBars / BenchmarkLine
// ============================================================
const FracBar = ({ num, den, grid = null, color = T.accent, height = 34, marker = false, winner = false, animateIn = false, sweep = false }) => {
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

const CompareBars = ({ rows, grid = null, marker = false, winnerIdx = null, animateIn = true, sweep = false, showRegrid = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 520, margin: '0 auto' }}>
    {rows.map((r, i) => {
      const isWin = winnerIdx === i;
      const reNum = grid ? Math.round((r.num / r.den) * grid) : null;
      return (
        <div key={i} className="cp-row" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
          <div style={{ width: 'clamp(54px, 13vw, 78px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            <Frac n={String(r.num)} d={String(r.den)} size="sm"/>
            {showRegrid && grid && reNum != null && <span className="mono small" style={{ color: T.ink3 }}>={reNum}/{grid}</span>}
          </div>
          <div style={{ flex: 1 }}><FracBar num={r.num} den={r.den} grid={grid || r.den} color={isWin ? T.accent : T.blue} marker={marker} winner={isWin} animateIn={animateIn} sweep={sweep}/></div>
        </div>
      );
    })}
  </div>
);

const BenchmarkLine = ({ points, animateIn = true, height = 78 }) => {
  const lineTop = 34;
  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
      <div style={{ position: 'relative', height }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: lineTop, height: 3, background: T.ink2, borderRadius: 2 }}/>
        <span className="mono small" style={{ position: 'absolute', left: 0, top: lineTop + 12, color: T.ink2 }}>0</span>
        <span className="mono small" style={{ position: 'absolute', right: 0, top: lineTop + 12, color: T.ink2 }}>1</span>
        <div className={`cp-half${animateIn ? ' cp-half-in' : ''}`} style={{ position: 'absolute', left: '50%', top: lineTop - 13, height: 26, width: 3, marginLeft: -1.5, background: T.accent, borderRadius: 2 }}/>
        <span className="mono small" style={{ position: 'absolute', left: '50%', top: lineTop - 32, transform: 'translateX(-50%)', color: T.accent, fontWeight: 600 }}>1/2</span>
        {points.map((p, i) => {
          const pct = (p.num / p.den) * 100;
          return (
            <div key={i} className="cp-dot-wrap" style={{ animationDelay: `${0.25 + i * 0.15}s` }}>
              <div style={{ position: 'absolute', left: `${pct}%`, top: lineTop, width: 14, height: 14, marginLeft: -7, marginTop: -7, borderRadius: '50%', background: p.color || T.blue, boxShadow: `0 0 0 4px ${T.paper}, 0 2px 6px rgba(0,0,0,0.22)`, zIndex: 2 }}/>
              <span className="mono small" style={{ position: 'absolute', left: `${pct}%`, top: lineTop + 12, transform: 'translateX(-50%)', color: p.color || T.blue, fontWeight: 600 }}>{p.num}/{p.den}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// --- POD UROK: frac_5_11 — Сравнение дробей с разными знаменателями (интуитивно) ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-11-v1',
  lessonTitle: { ru: 'Сравнение дробей с разными знаменателями (интуитивно)', uz: "Har xil maxrajli kasrlarni taqqoslash (intuitiv)" }
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

const CONTENT = {
  // ---- s0 HOOK: Джавохир (2/3) и Умид (3/4) пробежали часть одной дистанции ----
  s0: {
    eyebrow: { ru: 'Разные знаменатели · вступление', uz: "Har xil maxraj · kirish" },
    title: { ru: 'Джавохир и Умид бегут по одной и той же дистанции.', uz: "Javohir va Umid bir xil masofada yugurishyapti." },
    body: { ru: 'Джавохир пробежал 2/3 дистанции, Умид — 3/4. Джавохир говорит: «у меня доли крупнее — третьи, значит я дальше». А у дробей разные знаменатели, так просто числители не сравнить.', uz: "Javohir masofaning 2/3 qismini, Umid — 3/4 qismini bosib o'tdi. Javohir aytadi: «mening ulushlarim yirik — uchdan, demak men oldindaman». Kasrlarning maxraji esa har xil, suratlarni shunchaki solishtirib bo'lmaydi." },
    question: { ru: 'А ты как думаешь: кто пробежал больше — Джавохир (2/3) или Умид (3/4)?', uz: "Sizningcha-chi: kim ko'proq yugurdi — Javohir (2/3) mi yoki Umid (3/4) mi?" },
    opt0: { ru: 'Умид — 3/4 больше 2/3', uz: "Umid — 3/4 katta 2/3 dan" },
    opt1: { ru: 'Джавохир — 2/3 больше, ведь третьи доли крупнее', uz: "Javohir — 2/3 katta, axir uchdan ulushlar yirik" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Джавохир и Умид бегут по одной и той же дистанции. Джавохир пробежал две третьих, Умид три четвёртых. У дробей разные знаменатели, поэтому просто сравнить числители нельзя. А ты как думаешь — кто пробежал больше, Джавохир с двумя третьими или Умид с тремя четвёртыми? Выбери ответ.', uz: "Javohir va Umid bir xil masofada yugurishyapti. Javohir uchdan ikkini, Umid to'rtdan uchini bosib o'tdi. Kasrlarning maxraji har xil, shuning uchun suratlarni shunchaki solishtirib bo'lmaydi. Sizningcha, kim ko'proq yugurdi — uchdan ikkili Javohirmi yoki to'rtdan uchli Umidmi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): 1/2 и 2/3 → общие доли (шестые) ----
  s1: {
    eyebrow: { ru: 'Общие доли', uz: "Umumiy ulushlar" },
    title: { ru: 'Приведём 1/2 и 2/3 к одинаковым долям', uz: "1/2 va 2/3 ni bir xil ulushga keltiramiz" },
    bridge: { ru: 'Джавохир сравнил числители. Проверим — приведём дроби к одинаковым долям.', uz: "Javohir suratlarni solishtirdi. Tekshiramiz — kasrlarni bir xil ulushga keltiramiz." },
    conclusion: { ru: 'В шестых долях: 1/2 — это 3/6, а 2/3 — это 4/6. Теперь видно: 4/6 больше, значит 2/3 > 1/2.', uz: "Oltidan ulushlarda: 1/2 — bu 3/6, 2/3 — bu 4/6. Endi ko'rinadi: 4/6 katta, demak 2/3 > 1/2." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Приведём одну вторую и две третьих к одинаковым долям. Нажимай кнопку Дальше.',
        'Вот две полосы одинаковой ширины. На верхней закрашена одна вторая, на нижней две третьих. Доли разного размера — половинки и трети, сразу не сравнить.',
        'Разрежем обе полосы на одинаковые мелкие доли — на шестые. Тонкие линии делят каждую полосу на 6 равных частей. Закрашенные куски не изменились по длине, но теперь измеряются в шестых.',
        'Считаем: одна вторая стала тремя шестыми, а две третьих — четырьмя шестыми. Доли теперь одинаковые, и четыре больше трёх. Значит, две третьих больше одной второй.'
      ],
      uz: [
        "Ikkidan bir va uchdan ikkini bir xil ulushga keltiramiz. Davom etish tugmasini bosing.",
        "Mana bir xil kenglikdagi ikki chiziq. Yuqorisida ikkidan bir, pastkisida uchdan ikki bo'yalgan. Ulushlar har xil o'lchamda — yarimlar va uchdanlar, darrov solishtirib bo'lmaydi.",
        "Ikkala chiziqni ham bir xil mayda ulushga — oltidanlarga bo'lamiz. Ingichka chiziqlar har bir polosani 6 ta teng bo'lakka bo'ladi. Bo'yalgan qismlar uzunligi o'zgarmadi, lekin endi oltidanlarda o'lchanadi.",
        "Sanaymiz: ikkidan bir oltidan uchta bo'ldi, uchdan ikki esa oltidan to'rtta. Ulushlar endi bir xil, to'rt esa uchdan katta. Demak, uchdan ikki katta ikkidan birdan."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider, re-grid): найди общие доли для 2/3 и 3/4 ----
  s2: {
    eyebrow: { ru: 'Найди общие доли', uz: "Umumiy ulushni toping" },
    title: { ru: 'Подбери одинаковые доли для 2/3 и 3/4', uz: "2/3 va 3/4 uchun bir xil ulushni tanlang" },
    intro: { ru: 'Двигай ползунок — он режет обе полосы на одно и то же число долей. Найди число, при котором линии совпадут с краем закраски на обеих полосах.', uz: "Slayderni suring — u ikkala polosani ham bir xil sondagi ulushga bo'ladi. Chiziqlar ikkala polosada ham bo'yoq chetiga to'g'ri keladigan sonni toping." },
    target_text: { ru: 'Цель: найди общие доли для 2/3 и 3/4 (подсказка: и 3, и 4 должны укладываться ровно).', uz: "Maqsad: 2/3 va 3/4 uchun umumiy ulushni toping (maslahat: 3 ham, 4 ham aniq joylashishi kerak)." },
    eyebrow_slider: { ru: 'Долей в полосе:', uz: "Polosadagi ulushlar:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала найди', uz: "Avval toping" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Двенадцать долей подходят обеим: две третьих это восемь двенадцатых, а три четвёртых это девять двенадцатых. Девять больше восьми, значит три четвёртых больше двух третьих.', uz: "O'n ikki ulush ikkalasiga ham to'g'ri keladi: uchdan ikki bu o'n ikkidan sakkiz, to'rtdan uch bu o'n ikkidan to'qqiz. To'qqiz katta sakkizdan, demak to'rtdan uch uchdan ikkidan katta." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Нужно число, в которое укладываются и 3, и 4. Самое маленькое такое — 12. Поставь ползунок на 12.', uz: "3 ham, 4 ham joylashadigan son kerak. Eng kichigi — 12. Slayderni 12 ga qo'ying." },
    audio: { ru: 'Подбери одинаковые доли для двух третьих и трёх четвёртых. Двигай ползунок: он режет обе полосы на одно и то же число долей. Найди число, в которое ровно укладываются и 3, и 4. Это двенадцать. Тогда две третьих станут восемью двенадцатыми, а три четвёртых — девятью двенадцатыми.', uz: "Uchdan ikki va to'rtdan uch uchun bir xil ulushni tanlang. Slayderni suring: u ikkala polosani bir xil sondagi ulushga bo'ladi. 3 ham, 4 ham aniq joylashadigan sonni toping. Bu o'n ikki. Shunda uchdan ikki o'n ikkidan sakkizta, to'rtdan uch esa o'n ikkidan to'qqizta bo'ladi." }
  },

  // ---- s3 RULE: привести к общим долям, потом считать ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Общие доли подобрали. Теперь — правило.', uz: "Umumiy ulushni topdik. Endi — qoida." },
    label: { ru: 'Приведи к одинаковым долям', uz: "Bir xil ulushga keltiring" },
    title: { ru: 'Чтобы сравнить дроби с разными знаменателями, приведи обе к одинаковым долям.', uz: "Har xil maxrajli kasrlarni solishtirish uchun ikkalasini bir xil ulushga keltiring." },
    card_top: { ru: 'Разрежь обе полосы на одинаковые мелкие доли (общие).', uz: "Ikkala polosani bir xil mayda ulushga (umumiy) bo'ling." },
    card_bottom: { ru: 'Теперь доли равны — сравнивай, сколько их закрашено.', uz: "Endi ulushlar teng — nechtasi bo'yalganini solishtiring." },
    card_line: { ru: '2/3 = 8/12, 3/4 = 9/12. 9 > 8 — значит 3/4 больше.', uz: "2/3 = 8/12, 3/4 = 9/12. 9 > 8 — demak 3/4 katta." },
    outro: { ru: 'Общие доли — это любое число, в которое укладываются оба знаменателя. Удобнее брать самое маленькое (для 3 и 4 — это 12).', uz: "Umumiy ulush — bu har ikki maxraj joylashadigan istalgan son. Eng kichigini olgan qulay (3 va 4 uchun bu 12)." },
    audio: { ru: 'Запомни правило. Чтобы сравнить дроби с разными знаменателями, приведи обе к одинаковым долям. Разрежь полосы на одинаковые мелкие доли, общие для обоих знаменателей. Тогда доли станут равными, и можно просто сравнить, сколько их закрашено. Две третьих это восемь двенадцатых, три четвёртых это девять двенадцатых, девять больше восьми. Общие доли удобнее брать самые маленькие.', uz: "Qoidani eslab qoling. Har xil maxrajli kasrlarni solishtirish uchun ikkalasini bir xil ulushga keltiring. Polosalarni har ikki maxrajga umumiy bo'lgan bir xil mayda ulushga bo'ling. Shunda ulushlar teng bo'ladi va nechtasi bo'yalganini solishtirsa bo'ladi. Uchdan ikki o'n ikkidan sakkizta, to'rtdan uch o'n ikkidan to'qqizta, to'qqiz katta sakkizdan. Umumiy ulushni eng kichigini olgan qulay." }
  },

  // ---- s4 TEST (MC, отношение): 1/2 ? 3/5 → 1/2 < 3/5 (correct old idx 0) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сравни дроби', uz: "Kasrlarni solishtiring" },
    question: { ru: 'Сравни 1/2 и 3/5. Что верно?', uz: "1/2 va 3/5 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '1/2 < 3/5', uz: "1/2 < 3/5" },
    opt1: { ru: '1/2 > 3/5', uz: "1/2 > 3/5" },
    opt2: { ru: '1/2 = 3/5', uz: "1/2 = 3/5" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: в десятых 1/2 = 5/10, а 3/5 = 6/10. 6 больше 5, значит 3/5 больше. 1/2 < 3/5.', uz: "To'g'ri: o'ndan ulushlarda 1/2 = 5/10, 3/5 = 6/10. 6 katta 5 dan, demak 3/5 katta. 1/2 < 3/5." },
    hint_1: { ru: 'Наоборот: одна вторая это пять десятых, а три пятых это шесть десятых. Шесть больше пяти — больше три пятых.', uz: "Aksincha: ikkidan bir bu o'ndan besh, beshdan uch bu o'ndan olti. Olti katta beshdan — beshdan uch katta." },
    hint_2: { ru: 'Они не равны: пять десятых и шесть десятых — разные. Приведи к десятым и сравни.', uz: "Ular teng emas: o'ndan besh va o'ndan olti — har xil. O'ndanlarga keltirib solishtiring." },
    hint_3: { ru: 'Сравнить можно: приведи обе к десятым долям. Одна вторая это пять десятых, три пятых это шесть десятых.', uz: "Solishtirsa bo'ladi: ikkalasini o'ndan ulushga keltiring. Ikkidan bir bu o'ndan besh, beshdan uch bu o'ndan olti." },
    wrong_default: { ru: 'В десятых: 1/2 = 5/10, 3/5 = 6/10. Значит 3/5 больше, 1/2 < 3/5.', uz: "O'ndanlarda: 1/2 = 5/10, 3/5 = 6/10. Demak 3/5 katta, 1/2 < 3/5." },
    audio: {
      intro: { ru: 'Сравни одну вторую и три пятых. Подсказка: приведи их к десятым долям. Выбери, что верно.', uz: "Ikkidan bir va beshdan uchni solishtiring. Maslahat: o'ndan ulushga keltiring. Nima to'g'ri ekanini tanlang." },
      on_correct: { ru: 'Верно. Пять десятых меньше шести десятых — значит три пятых больше.', uz: "To'g'ri. O'ndan besh o'ndan oltidan kichik — demak beshdan uch katta." },
      on_wrong: { ru: 'Пока нет. Приведи обе к десятым: одна вторая это пять десятых, три пятых это шесть десятых.', uz: "Hali emas. Ikkalasini o'ndanlarga keltiring: ikkidan bir bu o'ndan besh, beshdan uch bu o'ndan olti." }
    }
  },

  // ---- s5 RULE (benchmark 1/2): 3/8 < 1/2 < 4/7 ----
  s5: {
    eyebrow: { ru: 'Правило · ориентир', uz: "Qoida · mo'ljal" },
    label: { ru: 'Быстрый приём: ориентир 1/2', uz: "Tez usul: 1/2 mo'ljal" },
    title: { ru: 'Иногда хватает сравнить каждую дробь с 1/2.', uz: "Ba'zan har bir kasrni 1/2 bilan solishtirish kifoya." },
    card_ok: { ru: '3/8 меньше половины (половина — это 4/8). А 4/7 больше половины (половина — 3,5/7).', uz: "3/8 yarimdan kichik (yarim — bu 4/8). 4/7 esa yarimdan katta (yarim — 3,5/7)." },
    card_bad: { ru: 'Одна дробь меньше 1/2, другая больше 1/2 — значит сразу ясно: 4/7 больше 3/8.', uz: "Bir kasr 1/2 dan kichik, ikkinchisi 1/2 dan katta — demak darrov aniq: 4/7 katta 3/8 dan." },
    outro: { ru: 'Ориентир 1/2 работает, когда одна дробь меньше половины, а другая больше. Если обе по одну сторону — приводи к общим долям.', uz: "1/2 mo'ljal bir kasr yarimdan kichik, ikkinchisi katta bo'lganda ishlaydi. Ikkalasi bir tomonda bo'lsa — umumiy ulushga keltiring." },
    audio: { ru: 'Есть быстрый приём: сравни каждую дробь с одной второй, с половиной. Три восьмых меньше половины, ведь половина это четыре восьмых. А четыре седьмых больше половины. Одна меньше половины, другая больше — значит сразу ясно, что четыре седьмых больше трёх восьмых. Этот приём работает, когда дроби по разные стороны от половины.', uz: "Tez usul bor: har bir kasrni ikkidan bir, ya'ni yarim bilan solishtiring. Sakkizdan uch yarimdan kichik, axir yarim — bu sakkizdan to'rt. Yettidan to'rt esa yarimdan katta. Biri yarimdan kichik, ikkinchisi katta — demak darrov aniq, yettidan to'rt katta sakkizdan uchdan. Bu usul kasrlar yarimning har xil tomonida bo'lganda ishlaydi." }
  },

  // ---- s6 TEST (упорядочивание tap, 3 раунда): расставь по возрастанию (разные знаменатели) ----
  s6: {
    eyebrow: { ru: 'Тренировка · по порядку', uz: "Mashq · tartib bilan" },
    title: { ru: 'Расставь по возрастанию', uz: "O'sish tartibida joylang" },
    lead: { ru: 'Знаменатели РАЗНЫЕ. Прикинь каждую на глаз (или к 1/2) и нажимай от самой маленькой к самой большой. Три набора, от простого к сложному.', uz: "Maxrajlar HAR XIL. Har birini ko'z bilan (yoki 1/2 ga) chamalab, eng kichigidan eng kattasigacha bosing. Uchta to'plam, osondan qiyinga." },
    round_label: { ru: 'Набор', uz: "To'plam" },
    ask: { ru: 'Нажми самую маленькую из оставшихся.', uz: "Qolganlardan eng kichigini bosing." },
    hint_wrong: { ru: 'Это не самая маленькая. Прикинь каждую к половине или приведи к общим долям.', uz: "Bu eng kichigi emas. Har birini yarim bilan chamalang yoki umumiy ulushga keltiring." },
    correct_text: { ru: 'Отлично! Знаменатели разные, но если привести к общим долям (или прикинуть к 1/2), порядок виден.', uz: "Ajoyib! Maxrajlar har xil, lekin umumiy ulushga keltirsangiz (yoki 1/2 ga chamalasangiz), tartib ko'rinadi." },
    audio: {
      intro: { ru: 'Расставь дроби по возрастанию. Знаменатели у них разные, поэтому прикидывай каждую на глаз или сравнивай с половиной. Будет три набора, от простого к сложному. Нажимай от меньшей к большей.', uz: "Kasrlarni o'sish tartibida joylang. Ularning maxraji har xil, shuning uchun har birini ko'z bilan chamalang yoki yarim bilan solishtiring. Uchta to'plam bo'ladi, osondan qiyinga. Kichigidan kattasigacha bosing." },
      on_correct: { ru: 'Верно. Привёл к общим долям — и порядок ясен.', uz: "To'g'ri. Umumiy ulushga keltirdingiz — tartib aniq." },
      on_wrong: { ru: 'Не самая маленькая. Сравни с половиной или приведи к общим долям.', uz: "Eng kichigi emas. Yarim bilan solishtiring yoki umumiy ulushga keltiring." }
    }
  },

  // ---- s7 TEST (MC, текст misconception): 3/5 > 2/3, потому что 3>2? Нет (correct old idx 0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Не сравнивай только числители', uz: "Faqat suratlarni solishtirmang" },
    question: { ru: 'Кто-то говорит: «3/5 больше 2/3, ведь сверху 3 больше 2». Это так?', uz: "Kimdir aytadi: «3/5 katta 2/3 dan, axir yuqorida 3 katta 2 dan». Shundaymi?" },
    opt0: { ru: 'Неверно — в пятнадцатых 3/5 = 9/15, а 2/3 = 10/15, значит 2/3 больше', uz: "Noto'g'ri — o'n beshdan ulushlarda 3/5 = 9/15, 2/3 = 10/15, demak 2/3 katta" },
    opt1: { ru: 'Верно — раз 3 больше 2, то 3/5 больше', uz: "To'g'ri — 3 katta 2 dan, demak 3/5 katta" },
    opt2: { ru: 'Они равны — числители близкие', uz: "Ular teng — suratlar yaqin" },
    opt3: { ru: 'Сравнить нельзя — знаменатели разные', uz: "Solishtirib bo'lmaydi — maxrajlar har xil" },
    correct_text: { ru: 'Верно: при разных знаменателях числители так не сравнить. В пятнадцатых: 3/5 = 9/15, 2/3 = 10/15 — значит 2/3 больше.', uz: "To'g'ri: maxrajlar har xil bo'lganda suratlarni shunday solishtirib bo'lmaydi. O'n beshdan ulushlarda: 3/5 = 9/15, 2/3 = 10/15 — demak 2/3 katta." },
    hint_1: { ru: 'Это ловушка. Знаменатели разные, поэтому одни числители ничего не говорят. Приведи к пятнадцатым.', uz: "Bu tuzoq. Maxrajlar har xil, shuning uchun faqat suratlar hech narsa demaydi. O'n beshdanlarga keltiring." },
    hint_2: { ru: 'Не равны: девять пятнадцатых и десять пятнадцатых — разные. Одна больше.', uz: "Teng emas: o'n beshdan to'qqiz va o'n beshdan o'n — har xil. Biri katta." },
    hint_3: { ru: 'Сравнить можно — нужно привести к общим долям, к пятнадцатым.', uz: "Solishtirsa bo'ladi — umumiy ulushga, o'n beshdanlarga keltirish kerak." },
    wrong_default: { ru: 'Знаменатели разные. В пятнадцатых 3/5 = 9/15, 2/3 = 10/15 — значит 2/3 больше.', uz: "Maxrajlar har xil. O'n beshdanlarda 3/5 = 9/15, 2/3 = 10/15 — demak 2/3 katta." },
    fact: { ru: 'На древних базарах зерно мерили разными мерками — где-то ковшом на 3 пригоршни, где-то на 4. Сравнить «3 ковша» и «4 ковша» напрямую было нельзя: ковши разные. Поэтому купцы сводили всё к одной общей мере — это та же самая идея общих долей.', uz: "Qadimgi bozorlarda donni har xil o'lchov bilan o'lchashgan — qaerdadir 3 hovuchlik idish bilan, qaerdadir 4 hovuchlik bilan. «3 idish» va «4 idish» ni to'g'ridan-to'g'ri solishtirib bo'lmasdi: idishlar har xil. Shuning uchun savdogarlar hammasini bitta umumiy o'lchovga keltirgan — bu umumiy ulush g'oyasining aynan o'zi." },
    audio: {
      intro: { ru: 'Кто-то говорит, что три пятых больше двух третьих, ведь сверху три больше двух. Так ли это? Выбери ответ.', uz: "Kimdir aytadi: beshdan uch katta uchdan ikkidan, axir yuqorida 3 katta 2 dan. Shundaymi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Знаменатели разные, числители так не сравнить. В пятнадцатых две третьих больше. Точно так же поступали древние торговцы: разные меры сводили к одной общей.', uz: "To'g'ri. Maxrajlar har xil, suratlarni shunday solishtirib bo'lmaydi. O'n beshdanlarda uchdan ikki katta. Xuddi shunday qadimgi savdogarlar ham qilgan: har xil o'lchovlarni bitta umumiy o'lchovga keltirgan." },
      on_wrong: { ru: 'Это ловушка: при разных знаменателях нельзя сравнивать одни числители.', uz: "Bu tuzoq: maxrajlar har xil bo'lsa, faqat suratlarni solishtirib bo'lmaydi." }
    }
  },

  // ---- s_seq TEST (SeqMC): 6 примеров «поставь знак», растущие числа (1→4 знака) ----
  s_seq: {
    eyebrow: { ru: 'Тренировка · поставь знак', uz: "Mashq · belgi qo'ying" },
    title: { ru: 'Поставь знак: больше, меньше или равно', uz: "Belgi qo'ying: katta, kichik yoki teng" },
    lead: { ru: 'Знаменатели разные. Числа будут расти: одна цифра, две, три, потом четыре. Приводи к общим долям или прикидывай к 1/2.', uz: "Maxrajlar har xil. Sonlar o'sib boradi: bir xonali, ikki, uch, keyin to'rt. Umumiy ulushga keltiring yoki 1/2 ga chamalang." },
    bridge: { ru: 'Сравнивать умеем. Теперь — со знаком, и числа будут расти.', uz: "Solishtirishni bilamiz. Endi — belgi bilan, sonlar esa o'sib boradi." },
    questions: [
      {
        q: { ru: '1/2 ? 2/4', uz: '1/2 ? 2/4' },
        say: { ru: 'Одна вторая и две четвёртых. Какой знак?', uz: "Ikkidan bir va to'rtdan ikki. Qaysi belgi?" },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 2,
        ok: { ru: 'Верно: 2/4 это та же половина. Они равны.', uz: "To'g'ri: 2/4 bu o'sha yarim. Ular teng." },
        no: { ru: 'Две четвёртых это половина, как и одна вторая. Значит, равны.', uz: "To'rtdan ikki bu yarim, ikkidan bir kabi. Demak, teng." }
      },
      {
        q: { ru: '3/4 ? 5/8', uz: '3/4 ? 5/8' },
        say: { ru: 'Три четвёртых и пять восьмых.', uz: "To'rtdan uch va sakkizdan besh." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 0,
        ok: { ru: 'Верно: в восьмых 3/4 = 6/8, а 5/8 меньше. 3/4 больше.', uz: "To'g'ri: sakkizdanlarda 3/4 = 6/8, 5/8 esa kichik. 3/4 katta." },
        no: { ru: 'Приведи к восьмым: три четвёртых это шесть восьмых, сравни с пятью восьмыми.', uz: "Sakkizdanlarga keltiring: to'rtdan uch bu sakkizdan olti, sakkizdan besh bilan solishtiring." }
      },
      {
        q: { ru: '3/5 ? 7/10', uz: '3/5 ? 7/10' },
        say: { ru: 'Двузначный знаменатель. Три пятых и семь десятых.', uz: "Ikki xonali maxraj. Beshdan uch va o'ndan yetti." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 1,
        ok: { ru: 'Верно: в десятых 3/5 = 6/10, а 7/10 больше. 3/5 меньше.', uz: "To'g'ri: o'ndanlarda 3/5 = 6/10, 7/10 esa katta. 3/5 kichik." },
        no: { ru: 'Приведи к десятым: три пятых это шесть десятых, сравни с семью десятыми.', uz: "O'ndanlarga keltiring: beshdan uch bu o'ndan olti, o'ndan yetti bilan solishtiring." }
      },
      {
        q: { ru: '7/12 ? 1/2', uz: '7/12 ? 1/2' },
        say: { ru: 'Сравни с половиной: семь двенадцатых и одна вторая.', uz: "Yarim bilan solishtiring: o'n ikkidan yetti va ikkidan bir." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 0,
        ok: { ru: 'Верно: половина это 6/12, а 7/12 больше. 7/12 больше 1/2.', uz: "To'g'ri: yarim bu 6/12, 7/12 esa katta. 7/12 katta 1/2 dan." },
        no: { ru: 'Половина это шесть двенадцатых. Семь больше шести.', uz: "Yarim bu o'n ikkidan olti. Yetti katta oltidan." }
      },
      {
        q: { ru: '9/100 ? 1/10', uz: '9/100 ? 1/10' },
        say: { ru: 'Теперь трёхзначный знаменатель. Приводи к сотым.', uz: "Endi uch xonali maxraj. Yuzdanlarga keltiring." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 1,
        ok: { ru: 'Верно: в сотых 1/10 = 10/100, а 9/100 меньше. 9/100 меньше.', uz: "To'g'ri: yuzdanlarda 1/10 = 10/100, 9/100 esa kichik. 9/100 kichik." },
        no: { ru: 'Приведи к сотым: одна десятая это десять сотых, девять меньше десяти.', uz: "Yuzdanlarga keltiring: o'ndan bir bu yuzdan o'n, to'qqiz kichik o'ndan." }
      },
      {
        q: { ru: '13/1000 ? 1/100', uz: '13/1000 ? 1/100' },
        say: { ru: 'Последняя — четырёхзначный знаменатель. Приведи к тысячным.', uz: "Oxirgisi — to'rt xonali maxraj. Mingdanlarga keltiring." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 0,
        ok: { ru: 'Верно: в тысячных 1/100 = 10/1000, а 13/1000 больше. 13/1000 больше.', uz: "To'g'ri: mingdanlarda 1/100 = 10/1000, 13/1000 esa katta. 13/1000 katta." },
        no: { ru: 'Приведи к тысячным: одна сотая это десять тысячных, тринадцать больше десяти.', uz: "Mingdanlarga keltiring: yuzdan bir bu mingdan o'n, o'n uch katta o'ndan." }
      }
    ],
    audio: {
      intro: { ru: 'Поставь знак между дробями. Знаменатели разные, и числа будут расти — от одной цифры до четырёх. Приводи к общим долям или прикидывай к одной второй.', uz: "Kasrlar orasiga belgi qo'ying. Maxrajlar har xil, sonlar o'sib boradi — bir xonalidan to'rt xonaligacha. Umumiy ulushga keltiring yoki ikkidan birga chamalang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не спеши. Приведи к общим долям.', uz: "Shoshmang. Umumiy ulushga keltiring." },
      on_done: { ru: 'Отлично! Даже с большими числами правило то же: общие доли.', uz: "Zo'r! Katta sonlarda ham qoida o'sha: umumiy ulush." }
    }
  },

  // ---- s8 CASE setup: Сабина качает два файла (3/4 и 5/6) ----
  s8: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    bridge: { ru: 'Тот же приём — в жизни. У Сабины качаются два файла.', uz: "O'sha usul — hayotda. Sabinada ikki fayl yuklanyapti." },
    title: { ru: 'Сабина качает два файла одинакового размера.', uz: "Sabina bir xil hajmli ikki faylni yuklayapti." },
    body_p1: { ru: 'Файлы одинаковые. Первый загрузился на 3/4, второй — на 5/6. Какой файл ближе к концу загрузки?', uz: "Fayllar bir xil. Birinchisi 3/4 ga, ikkinchisi — 5/6 ga yuklandi. Qaysi fayl yuklanish oxiriga yaqinroq?" },
    card_line_label: { ru: 'Первый файл', uz: "Birinchi fayl" },
    card_line_value: { ru: 'загружен на 3/4', uz: "3/4 ga yuklandi" },
    card_parts_label: { ru: 'Второй файл', uz: "Ikkinchi fayl" },
    card_parts_value: { ru: 'загружен на 5/6', uz: "5/6 ga yuklandi" },
    outro: { ru: 'Знаменатели разные (4 и 6). Приведи их к общим долям на следующем шаге.', uz: "Maxrajlar har xil (4 va 6). Keyingi bosqichda ularni umumiy ulushga keltiring." },
    btn_help: { ru: 'Помочь Сабине', uz: "Sabinaga yordam berish" },
    audio: { ru: 'Сабина качает два файла одинакового размера. Первый загрузился на три четвёртых, второй на пять шестых. Какой файл ближе к концу загрузки? Знаменатели разные, четыре и шесть. Подумай, к каким общим долям их привести.', uz: "Sabina bir xil hajmli ikki faylni yuklayapti. Birinchisi to'rtdan uchga, ikkinchisi oltidan beshga yuklandi. Qaysi fayl oxiriga yaqinroq? Maxrajlar har xil, to'rt va olti. Qanday umumiy ulushga keltirishni o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, отношение): 3/4 vs 5/6 → второй больше (correct old idx 0) ----
  s9: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    label: { ru: 'Какой ближе к концу?', uz: "Qaysi oxiriga yaqin?" },
    question: { ru: 'Первый файл на 3/4, второй на 5/6. Что верно?', uz: "Birinchi fayl 3/4 da, ikkinchisi 5/6 da. Nima to'g'ri?" },
    opt0: { ru: 'Второй ближе: 5/6 > 3/4', uz: "Ikkinchisi yaqinroq: 5/6 > 3/4" },
    opt1: { ru: 'Первый ближе: 3/4 > 5/6', uz: "Birinchisi yaqinroq: 3/4 > 5/6" },
    opt2: { ru: 'Загружены поровну', uz: "Teng yuklangan" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: в двенадцатых 3/4 = 9/12, 5/6 = 10/12. 10 больше 9 — значит 5/6 больше, второй файл ближе.', uz: "To'g'ri: o'n ikkidan ulushlarda 3/4 = 9/12, 5/6 = 10/12. 10 katta 9 dan — demak 5/6 katta, ikkinchi fayl yaqinroq." },
    hint_1: { ru: 'Наоборот: три четвёртых это девять двенадцатых, пять шестых это десять двенадцатых. Десять больше девяти — больше пять шестых.', uz: "Aksincha: to'rtdan uch bu o'n ikkidan to'qqiz, oltidan besh bu o'n ikkidan o'n. O'n katta to'qqizdan — oltidan besh katta." },
    hint_2: { ru: 'Не поровну: девять двенадцатых и десять двенадцатых разные. Приведи к двенадцатым.', uz: "Teng emas: o'n ikkidan to'qqiz va o'n ikkidan o'n har xil. O'n ikkidanlarga keltiring." },
    hint_3: { ru: 'Сравнить можно: приведи обе к двенадцатым долям.', uz: "Solishtirsa bo'ladi: ikkalasini o'n ikkidan ulushga keltiring." },
    wrong_default: { ru: 'В двенадцатых: 3/4 = 9/12, 5/6 = 10/12. Значит 5/6 больше.', uz: "O'n ikkidanlarda: 3/4 = 9/12, 5/6 = 10/12. Demak 5/6 katta." },
    fact: { ru: 'У телефона, планшета и монитора разное число пикселей — это как разные знаменатели. В адаптивном дизайне размеры задают не в пикселях, а в процентах от ширины экрана: 50% занимают половину и на маленьком, и на большом. Проценты — общая шкала, тот же приём общих долей.', uz: "Telefon, planshet va monitorda piksellar soni har xil — bu har xil maxraj kabi. Moslashuvchan dizaynda o'lchamlar piksellarda emas, ekran kengligining foizida beriladi: 50% kichikda ham, kattada ham yarmini egallaydi. Foiz — umumiy shkala, aynan o'sha umumiy ulush usuli." },
    audio: {
      intro: { ru: 'Первый файл загружен на три четвёртых, второй на пять шестых. Какой ближе к концу? Выбери верное.', uz: "Birinchi fayl to'rtdan uchga, ikkinchisi oltidan beshga yuklandi. Qaysi oxiriga yaqin? To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Девять двенадцатых меньше десяти двенадцатых — пять шестых больше. Так же экраны разных размеров приводят к одной шкале, к процентам, чтобы их сравнить.', uz: "To'g'ri. O'n ikkidan to'qqiz o'n ikkidan o'ndan kichik — oltidan besh katta. Xuddi shunday har xil ekranlar bitta shkalaga, foizlarga keltiriladi, solishtirish uchun." },
      on_wrong: { ru: 'Пока нет. Приведи обе к двенадцатым: три четвёртых это девять двенадцатых, пять шестых это десять двенадцатых.', uz: "Hali emas. Ikkalasini o'n ikkidanlarga keltiring: to'rtdan uch bu o'n ikkidan to'qqiz, oltidan besh bu o'n ikkidan o'n." }
    }
  },

  // ---- s10 TEST (error-spotting): какое сравнение НЕВЕРНО (correct old idx 2) ----
  s10: {
    eyebrow: { ru: 'Проверка · найди ошибку', uz: "Tekshiruv · xatoni toping" },
    label: { ru: 'Найди неверное', uz: "Noto'g'risini toping" },
    title: { ru: 'Одно сравнение неверно', uz: "Bitta solishtirish noto'g'ri" },
    question: { ru: 'Три сравнения верны, а одно — нет. Какое НЕВЕРНО?', uz: "Uchta solishtirish to'g'ri, bittasi esa — yo'q. Qaysi biri NOTO'G'RI?" },
    opt0: { ru: '1/2 < 3/5', uz: "1/2 < 3/5" },
    opt1: { ru: '3/4 > 2/3', uz: "3/4 > 2/3" },
    opt2: { ru: '2/5 > 3/4', uz: "2/5 > 3/4" },
    opt3: { ru: '5/6 > 7/12', uz: "5/6 > 7/12" },
    correct_text: { ru: 'Верно, это неверно: 2/5 меньше половины, а 3/4 больше — значит 2/5 < 3/4, а не больше.', uz: "To'g'ri, bu noto'g'ri: 2/5 yarimdan kichik, 3/4 esa katta — demak 2/5 < 3/4, katta emas." },
    wrong_0: { ru: 'Это верно: одна вторая это пять десятых, три пятых это шесть десятых, значит одна вторая меньше трёх пятых. Ищи неверное дальше.', uz: "Bu to'g'ri: ikkidan bir bu o'ndan besh, beshdan uch bu o'ndan olti, demak ikkidan bir beshdan uchdan kichik. Noto'g'risini boshqasidan qidiring." },
    wrong_1: { ru: 'Это верно: три четвёртых это девять двенадцатых, две третьих это восемь двенадцатых, значит три четвёртых больше двух третьих. Ищи дальше.', uz: "Bu to'g'ri: to'rtdan uch bu o'n ikkidan to'qqiz, uchdan ikki bu o'n ikkidan sakkiz, demak to'rtdan uch uchdan ikkidan katta. Boshqasidan qidiring." },
    wrong_3: { ru: 'Это верно: пять шестых это десять двенадцатых, семь двенадцатых меньше, значит пять шестых больше семи двенадцатых. Ищи дальше.', uz: "Bu to'g'ri: oltidan besh bu o'n ikkidan o'n, o'n ikkidan yetti kichik, demak oltidan besh o'n ikkidan yettidan katta. Boshqasidan qidiring." },
    wrong_default: { ru: 'Ищи сравнение, где знак развернули не туда. Приводи к общим долям или к 1/2.', uz: "Belgisi teskari qo'yilgan solishtirishni qidiring. Umumiy ulushga yoki 1/2 ga keltiring." },
    audio: {
      intro: { ru: 'Три сравнения верны, а одно неверно. Найди то, где знак стоит не в ту сторону. Приводи к общим долям или сравнивай с половиной.', uz: "Uchta solishtirish to'g'ri, bittasi noto'g'ri. Belgisi noto'g'ri tomonga qo'yilganini toping. Umumiy ulushga keltiring yoki yarim bilan solishtiring." },
      on_correct: { ru: 'Верно. Две пятых меньше половины, а три четвёртых больше — значит две пятых меньше, а не больше.', uz: "To'g'ri. Beshdan ikki yarimdan kichik, to'rtdan uch esa katta — demak beshdan ikki kichik, katta emas." },
      on_wrong: { ru: 'Это сравнение верное. Ищи, где знак развернули не туда.', uz: "Bu solishtirish to'g'ri. Belgisi teskari qo'yilganini qidiring." }
    }
  },

  // ---- s11 TEST (MC, отношение): 1/2 ? 5/8 → 1/2 < 5/8 (correct old idx 0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — сравни', uz: "Oxirgisi — solishtiring" },
    question: { ru: 'Сравни 1/2 и 5/8. Что верно?', uz: "1/2 va 5/8 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '1/2 < 5/8', uz: "1/2 < 5/8" },
    opt1: { ru: '1/2 > 5/8', uz: "1/2 > 5/8" },
    opt2: { ru: '1/2 = 5/8', uz: "1/2 = 5/8" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: в восьмых 1/2 = 4/8, а 5/8 уже в восьмых. 5 больше 4 — значит 5/8 больше. 1/2 < 5/8.', uz: "To'g'ri: sakkizdan ulushlarda 1/2 = 4/8, 5/8 esa allaqachon sakkizdan. 5 katta 4 dan — demak 5/8 katta. 1/2 < 5/8." },
    hint_1: { ru: 'Наоборот: одна вторая это четыре восьмых, а пять восьмых больше четырёх восьмых. Больше пять восьмых.', uz: "Aksincha: ikkidan bir bu sakkizdan to'rt, sakkizdan besh esa sakkizdan to'rtdan katta. Sakkizdan besh katta." },
    hint_2: { ru: 'Не равны: четыре восьмых и пять восьмых разные. Приведи одну вторую к восьмым.', uz: "Teng emas: sakkizdan to'rt va sakkizdan besh har xil. Ikkidan birni sakkizdanlarga keltiring." },
    hint_3: { ru: 'Сравнить можно: одна вторая это четыре восьмых, дальше сравни с пятью восьмыми.', uz: "Solishtirsa bo'ladi: ikkidan bir bu sakkizdan to'rt, keyin sakkizdan besh bilan solishtiring." },
    wrong_default: { ru: 'В восьмых 1/2 = 4/8, и 5/8 больше. 1/2 < 5/8.', uz: "Sakkizdanlarda 1/2 = 4/8, 5/8 esa katta. 1/2 < 5/8." },
    fact: { ru: 'Полоса загрузки на экране — та же дробь от целого. Чтобы показывать прогресс одинаково для файлов разного размера, её переводят в проценты — общую шкалу от 0 до 100. Это тот же приём общих долей.', uz: "Ekrandagi yuklash chizig'i — butundan olingan o'sha kasr. Har xil hajmli fayllar uchun progressni bir xil ko'rsatish uchun u foizga — 0 dan 100 gacha umumiy shkalaga aylantiriladi. Bu o'sha umumiy ulush usuli." },
    audio: {
      intro: { ru: 'Последнее задание. Сравни одну вторую и пять восьмых. Подсказка: приведи к восьмым. Выбери верное.', uz: "Oxirgi topshiriq. Ikkidan bir va sakkizdan beshni solishtiring. Maslahat: sakkizdanlarga keltiring. To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Одна вторая это четыре восьмых, пять восьмых больше.', uz: "To'g'ri. Ikkidan bir sakkizdan to'rt, sakkizdan besh katta." },
      on_wrong: { ru: 'Пока нет. Приведи одну вторую к восьмым: получится четыре восьмых, а пять восьмых больше.', uz: "Hali emas. Ikkidan birni sakkizdanlarga keltiring: sakkizdan to'rt chiqadi, sakkizdan besh esa katta." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    score_caption: { ru: 'вопросов решено верно с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob berdingiz" },
    title: { ru: 'Теперь ты сравниваешь дроби с разными знаменателями.', uz: "Endi siz har xil maxrajli kasrlarni solishtirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Разные знаменатели — нельзя сравнивать одни числители.', uz: "Maxraj har xil — faqat suratlarni solishtirib bo'lmaydi." },
    main_2: { ru: 'Приведи обе дроби к одинаковым (общим) долям и сравни, сколько закрашено.', uz: "Ikkala kasrni bir xil (umumiy) ulushga keltiring va nechtasi bo'yalganini solishtiring." },
    main_3: { ru: 'Общие доли бери самые маленькие — это не всегда произведение знаменателей.', uz: "Umumiy ulushni eng kichigini oling — bu har doim maxrajlar ko'paytmasi emas." },
    main_4: { ru: 'Быстрый приём: сравни каждую дробь с 1/2 — если они по разные стороны, ответ сразу ясен.', uz: "Tez usul: har bir kasrni 1/2 bilan solishtiring — agar har xil tomonda bo'lsa, javob darrov aniq." },
    back_to_hook: { ru: 'Джавохир пробежал 2/3, Умид 3/4. В двенадцатых это 8/12 и 9/12 — больше пробежал Умид. Сравнивать одни числители было нельзя.', uz: "Javohir 2/3, Umid 3/4 yugurdi. O'n ikkidanlarda bu 8/12 va 9/12 — ko'proq Umid yugurdi. Faqat suratlarni solishtirib bo'lmasdi." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сравнение с одинаковым знаменателем» и «...с одинаковым числителем».', uz: "«Bir xil maxrajli» va «bir xil suratli» taqqoslash darslari." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'эквивалентные дроби — правило (1/2 = 2/4 = 3/6).', uz: "ekvivalent kasrlar — qoida (1/2 = 2/4 = 3/6)." },
    audio: { ru: 'Отлично! Теперь ты умеешь сравнивать дроби с разными знаменателями. При разных знаменателях нельзя сравнивать одни числители. Приведи обе дроби к одинаковым общим долям и сравни, сколько закрашено. Общие доли бери самые маленькие. А ещё есть быстрый приём: сравни каждую дробь с одной второй. Джавохир пробежал две третьих, Умид три четвёртых. В двенадцатых это восемь и девять двенадцатых, больше пробежал Умид.', uz: "Zo'r! Endi siz har xil maxrajli kasrlarni solishtira olasiz. Maxraj har xil bo'lganda faqat suratlarni solishtirib bo'lmaydi. Ikkala kasrni bir xil umumiy ulushga keltiring va nechtasi bo'yalganini solishtiring. Umumiy ulushni eng kichigini oling. Yana tez usul bor: har bir kasrni ikkidan bir bilan solishtiring. Javohir uchdan ikki, Umid to'rtdan uch yugurdi. O'n ikkidanlarda bu o'n ikkidan sakkiz va to'qqiz, ko'proq Umid yugurdi." }
  }
};

// ============================================================
// OrderTap (s6) — упорядочивание по значению, 3 раунда (РАЗНЫЕ знаменатели). scored.
// ============================================================
const S6_ROUNDS = [
  [{ n: 1, d: 2 }, { n: 2, d: 3 }, { n: 1, d: 4 }, { n: 3, d: 4 }],
  [{ n: 2, d: 5 }, { n: 1, d: 2 }, { n: 3, d: 5 }, { n: 7, d: 10 }],
  [{ n: 7, d: 12 }, { n: 5, d: 8 }, { n: 2, d: 3 }, { n: 3, d: 4 }]
];
const val = (c) => c.n / c.d;
const OrderTap = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const [decks] = useState(() => S6_ROUNDS.map(round => { const a = round.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; }));
  const nRounds = decks.length;
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const ascVal = (deck) => deck.map((_, i) => i).sort((a, b) => val(deck[a]) - val(deck[b]));
  const [roundIdx, setRoundIdx] = useState(wasSolved ? nRounds - 1 : 0);
  const deck = decks[roundIdx]; const n = deck.length;
  const [placed, setPlaced] = useState(() => (wasSolved ? ascVal(decks[nRounds - 1]) : []));
  const [done, setDone] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(null);
  const anyWrongRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const flashRef = useRef(null); const advRef = useRef(null);
  const finishAll = () => {
    setDone(true);
    const ok = !anyWrongRef.current;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: 'asc', studentAnswer: ok ? 'first-try' : 'retried', correct: ok, firstTry: ok, attempts: 1, itemsTotal: nRounds, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const tap = (i) => {
    if (done || placed.includes(i)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const remaining = deck.map((_, k) => k).filter(k => !placed.includes(k));
    const minVal = Math.min(...remaining.map(k => val(deck[k])));
    if (Math.abs(val(deck[i]) - minVal) < 1e-9) {
      setHint(false); sfx.playCorrect();
      const np = [...placed, i]; setPlaced(np);
      if (np.length === n) {
        if (roundIdx < nRounds - 1) { advRef.current = setTimeout(() => { setRoundIdx(roundIdx + 1); setPlaced([]); setHint(false); }, 620); }
        else finishAll();
      }
    } else {
      anyWrongRef.current = true; sfx.playWrong(); setHint(true);
      setFlash(i); if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (flashRef.current) clearTimeout(flashRef.current); if (advRef.current) clearTimeout(advRef.current); }, []);
  const roundComplete = placed.length === n;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.4vw, 17px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {decks.map((_, i) => <span key={i} className={`seq-dot${(i < roundIdx || done) ? ' seq-dot-done' : ''}${(i === roundIdx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {!done && <p className="small mono fade-up" style={{ margin: 0, color: T.accent, textAlign: 'center' }}>{t(c.round_label)} {roundIdx + 1}/{nRounds} · {mt(t(c.ask))} {placed.length > 0 && `(${placed.length}/${n})`}</p>}
        <div className="od-grid fade-up delay-1" key={roundIdx}>
          {deck.map((cd, i) => {
            const order = placed.indexOf(i);
            const isPlaced = order !== -1;
            const roundOk = done || roundComplete;
            let cls = 'od-card';
            if (roundOk && isPlaced) cls += ' od-ok'; else if (isPlaced) cls += ' od-on'; else if (flash === i) cls += ' od-bad';
            return (
              <button key={i} className={cls} disabled={done || isPlaced} onClick={() => tap(i)}>
                {isPlaced && <span className="od-badge">{order + 1}</span>}
                <Frac n={String(cd.n)} d={String(cd.d)} size="mid"/>
              </button>
            );
          })}
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

// s0 — HOOK (hook может центрироваться).
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h1 className="title h-title fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h1>
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} animateIn={true}/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.body))}</p>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
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

// s1 — EXPLORATION step-by-step: 1/2 и 2/3 → общие шестые. (top-align + Bridge)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const grid = step >= 2 ? 6 : null;
  const showWinner = step >= 3 ? 1 : null;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1
            ? <CompareBars rows={[{ num: 1, den: 2 }, { num: 2, den: 3 }]} grid={grid} sweep={step === 2} showRegrid={step >= 2} winnerIdx={showWinner} marker={step >= 3} animateIn={true}/>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: подбери общие доли для 2/3 и 3/4. (top-align)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [grid, setGrid] = useState(5);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const onSlider = (v) => { if (solved) return; setChecked(false); setGrid(v); };
  const check = () => {
    const ok = grid === 12;
    setChecked(true);
    if (ok) setSolved(true);
    if (!audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.fb_success[lang] : c.fb_wrong[lang]); }, 250); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={solved ? <NextLabel/> : t(c.btn_disabled_label)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(15px, 2.4vw, 16px)' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{mt(t(c.intro))}</p>
        <p className="small fade-up delay-1" style={{ color: T.accent, fontWeight: 600 }}>{mt(t(c.target_text))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} grid={grid} sweep={true} showRegrid={solved} winnerIdx={solved ? 1 : null} marker={solved} animateIn={false}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {grid}</p>
            <Slider value={grid} min={2} max={12} step={1} onChange={onSlider} disabled={solved}/>
          </div>
          {!solved && (<div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(11px, 1.8vw, 13px) clamp(20px, 2.6vw, 28px)', fontSize: 'clamp(13px, 1.6vw, 14px)' }}>{t(c.btn_check)}</button></div>)}
        </div>
        <FeedbackBlock show={checked} isCorrect={solved} wrongClass={solved ? undefined : 'frame-tip'}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? t(c.fb_success_title) : t(c.fb_wrong_title)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(solved ? t(c.fb_success) : t(c.fb_wrong))}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s3 — RULE: привести к общим долям. (top-align + Bridge)
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
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} grid={12} showRegrid={true} winnerIdx={1} marker={true} animateIn={true} sweep={true}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_bottom))}</p>
            <p className="small" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s4 — TEST choice (отношение): 1/2 ? 3/5 (correct old idx 0).
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><CompareBars rows={[{ num: 1, den: 2 }, { num: 3, den: 5 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE benchmark 1/2. (top-align)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <BenchmarkLine points={[{ num: 3, den: 8, color: T.blue }, { num: 4, den: 7, color: T.accent }]} animateIn={true}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_ok))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{mt(t(c.card_bad))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — TEST упорядочивание по возрастанию.
const Screen6 = (props) => <OrderTap {...props}/>;

// s7 — TEST choice (текст): 3/5 > 2/3? Нет (correct old idx 0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimBazaar/>}/>}/>;
};

// s_seq — TEST: 6 примеров «поставь знак», растущие числа (tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — CASE setup: Сабина, загрузка файлов. (top-align + Bridge)
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <CompareBars rows={[{ num: 3, den: 4 }, { num: 5, den: 6 }]} animateIn={true}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (отношение): 3/4 vs 5/6 (correct old idx 0).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><CompareBars rows={[{ num: 3, den: 4 }, { num: 5, den: 6 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimScreen/>}/>}/>;
};

// s10 — TEST error-spotting: какое сравнение НЕВЕРНО (correct old idx 2).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — TEST choice (отношение): 1/2 ? 5/8 (correct old idx 0).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [0, 3, 1, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><CompareBars rows={[{ num: 1, den: 2 }, { num: 5, den: 8 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s12 — SUMMARY: без счёта, закрывает крючок; finishLesson один раз. (top-align)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const scoreTotal = SCREEN_META.filter(s => s.scored).length;
  const scoreCorrect = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.success }}>{t(c.label)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{scoreCorrect} / {scoreTotal}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} grid={12} showRegrid={true} winnerIdx={1} marker={true} animateIn={true} height={28}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ (шаблон из infrastructure_v1)
// ============================================================
export default function FractionCompareDiffDenLesson({
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

// ============================================================
// CSS-БЛОК (STYLES) — визуальный язык v15 из infrastructure_v1 / Dars28 + math-дополнения
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

/* === КНОПКИ v15 === */
.btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #0E0E10; color: #F6F4EF; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32); }
.btn:hover:not(:disabled) { background: #FF4F28; box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #FF4F28; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12); }
.btn-white-accent:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55); }
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }

.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #0E0E10; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

/* === ОПЦИИ v15 === */
.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.option:disabled { cursor: default; }
.option-correct { background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

/* === ТИПОГРАФИКА v15 === */
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(17px, 2.5vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* HOOK jonli animatsiya */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(11px, 2vw, 11px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 12px); padding-bottom: clamp(17px, 3.4vw, 20px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(11px, 2vw, 11px); padding-bottom: clamp(11px, 2vw, 11px); display: flex; gap: 12px; }

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

/* === PROGRESS v15 === */
.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

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

/* === FRAMES v15 === */
.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 17px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* === FACT-БЛОК (синяя карта) === */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

/* === AMBIENT (Floaters) === */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* === SeqMC qisqa savol + progress nuqtalari === */
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

/* === BRIDGE === */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* === ORDER (упорядочивание tap-in-order) === */
.od-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); }
.od-card { position: relative; cursor: pointer; border: none; background: #FFFFFF; border-radius: 14px; padding: clamp(14px, 2.6vw, 22px) clamp(6px, 1.4vw, 12px); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.16s; }
.od-card:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.od-card:disabled { cursor: default; }
.od-on { box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 18px -6px rgba(255, 79, 40, 0.28); }
.od-badge { position: absolute; top: -9px; left: -9px; width: 24px; height: 24px; border-radius: 50%; background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(255, 79, 40, 0.5); }
.od-ok { box-shadow: 0 0 0 2px #1F7A4D inset, 0 8px 18px -6px rgba(31, 122, 77, 0.28); }
.od-ok .od-badge { background: #1F7A4D; box-shadow: 0 4px 10px -3px rgba(31, 122, 77, 0.5); }
.od-bad { box-shadow: 0 0 0 2px #FF4F28 inset; animation: odShake 0.4s ease; }
@keyframes odShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

/* === FracBar / CompareBars / BenchmarkLine === */
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
.cp-half-in { animation: cpHalfIn 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpHalfIn { from { left: 0; opacity: 0; } }
.cp-dot-wrap { animation: cpDotIn 0.35s ease-out backwards; }
@keyframes cpDotIn { from { opacity: 0; } }

/* === FACT-АНИМАЦИИ (синяя тема) === */
.fc-bazaar { position: relative; display: flex; flex-direction: column; gap: 7px; width: clamp(84px, 16vw, 112px); }
.fc-bz-r { height: 12px; border-radius: 3px; background: #019ACB; opacity: 0.3; }
.fc-bz-1 { width: 60%; animation: fcBz1 2.8s ease-in-out infinite; }
.fc-bz-2 { width: 80%; animation: fcBz2 2.8s ease-in-out infinite; }
.fc-bz-base { height: 12px; border-radius: 3px; background: #019ACB; opacity: 0.85; animation: fcBzBase 2.8s ease-in-out infinite; }
@keyframes fcBz1 { 0%, 100% { width: 60%; opacity: 0.3; } 45% { width: 100%; opacity: 0.7; } }
@keyframes fcBz2 { 0%, 100% { width: 80%; opacity: 0.3; } 45% { width: 100%; opacity: 0.7; } }
@keyframes fcBzBase { 0%, 100% { opacity: 0.4; } 45% { opacity: 0.95; } }
.fc-bench { position: relative; width: clamp(86px, 17vw, 116px); height: 30px; }
.fc-bn-line { position: absolute; left: 0; right: 0; top: 14px; height: 3px; border-radius: 2px; background: #019ACB; opacity: 0.45; }
.fc-bn-half { position: absolute; left: 50%; top: 5px; width: 3px; height: 20px; margin-left: -1.5px; border-radius: 2px; background: #019ACB; }
.fc-bn-dot { position: absolute; top: 9px; left: 0; width: 11px; height: 11px; margin-left: -5.5px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 7px rgba(1, 154, 203, 0.6); animation: fcBnDot 3s ease-in-out infinite; }
@keyframes fcBnDot { 0%, 100% { left: 26%; } 50% { left: 74%; } }
.fc-screen { display: flex; align-items: flex-end; gap: 6px; width: clamp(86px, 17vw, 116px); }
.fc-sc-box { position: relative; flex-shrink: 0; border: 2px solid #019ACB; border-radius: 4px; overflow: hidden; opacity: 0.85; }
.fc-sc-1 { width: 18px; height: 26px; }
.fc-sc-2 { width: 24px; height: 36px; }
.fc-sc-3 { width: 30px; height: 46px; }
.fc-sc-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: #019ACB; opacity: 0.4; animation: fcScFill 2.6s ease-in-out infinite; }
@keyframes fcScFill { 0%, 100% { height: 0; } 50% { height: 70%; } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;



