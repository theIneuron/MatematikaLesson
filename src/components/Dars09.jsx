import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Что такое дробь (часть целого) — frac_5_01
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C (etalon: Dars28). s6 → классификация (равные/неравные доли),
// s10 → error-spotting, s4 → DecInputScreen. Top-align, Bridge, shuffleMC, fact_audio.

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
function buildTtsUrl(base, text, lang, gender) {
  const tag = LANG_TAG[lang] || LANG_TAG.ru;
  const raw = String(text);
  const tagged = TAG_RE.test(raw) ? raw : `${tag} ${raw}`;
  const enc = encodeURIComponent(tagged.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

// SFX — короткие звуки верно/неверно, URL из ttsConfig.
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

// Неречевой сигнал (фолбэк SFX в preview).
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

// AI-проверка открытых ответов.
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
// ХЕЛПЕРЫ: shuffleMC, ConnectionsBlock, Title, Bridge, иконки, Floaters
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
// FACT-БЛОК (синяя карта) + анимации (CSS-only loop)
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
// Tarix (Misr kasrlari): birlik ulushlar — kamayuvchi kenglikdagi qatorlar.
const AnimUnit = () => (
  <div className="fa-unit" aria-hidden="true">
    <span className="fa-unit-r fa-unit-1"/>
    <span className="fa-unit-r fa-unit-2"/>
    <span className="fa-unit-r fa-unit-3"/>
  </div>
);
// Fan (o'lchov): idish pastdan ulushma-ulush to'ladi.
const AnimBeaker = () => (
  <div className="fa-bk" aria-hidden="true">
    {Array.from({ length: 4 }).map((_, i) => (
      <span key={i} className="fa-bk-c" style={{ animationDelay: `${i * 0.25}s` }}/>
    ))}
  </div>
);
// IT (yuklash): 5 ulushdan 3 tasi yonadi — s0 ilgagidagi chiziq.
const AnimLoad = () => (
  <div className="fa-load" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`fa-load-c${i < 3 ? ' fa-load-on' : ''}`} style={{ animationDelay: `${i * 0.2}s` }}/>
    ))}
  </div>
);

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ (часть целого)
// ============================================================
const BarModel = ({ parts = 1, shaded = 0, segWidths, shadedSet, interactive = false, onToggle, height = 56 }) => {
  const widths = segWidths || Array.from({ length: parts }, () => 1);
  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: 520, height, borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 16px -6px rgba(58, 53, 48, 0.18)', background: T.paper, border: `2px solid ${T.ink2}` }}>
      {widths.map((w, i) => {
        const isShaded = shadedSet ? shadedSet.has(i) : i < shaded;
        return (
          <div key={i} onClick={interactive ? () => onToggle(i) : undefined}
            style={{ flex: w, height: '100%', background: isShaded ? T.accent : T.paper, borderRight: i < widths.length - 1 ? `1.5px solid ${T.ink3}` : 'none', cursor: interactive ? 'pointer' : 'default', transition: 'background 0.2s' }}/>
        );
      })}
    </div>
  );
};

const GlassModel = ({ parts = 4, filled = 0 }) => (
  <div style={{ display: 'flex', flexDirection: 'column-reverse', width: 'clamp(54px, 14vw, 74px)', height: 'clamp(120px, 28vw, 158px)', borderRadius: '8px 8px 14px 14px', overflow: 'hidden', boxShadow: '0 6px 16px -6px rgba(58, 53, 48, 0.2)', background: T.paper, border: `2px solid ${T.ink2}` }}>
    {Array.from({ length: parts }).map((_, i) => (
      <div key={i} style={{ flex: 1, background: i < filled ? T.blue : T.paper, borderTop: i > 0 ? `1.5px solid ${T.ink3}` : 'none', transition: 'background 0.2s' }}/>
    ))}
  </div>
);

// ============================================================
// --- POD UROK: frac_5_01 — Что такое дробь / Kasr nima ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-01-v1',
  lessonTitle: { ru: 'Что такое дробь (часть целого)', uz: "Kasr nima (butunning qismi)" }
};
const TOTAL_SCREENS = 14;

// Обучающий урок — НЕ оценивается (teaching_methodology §1.4): проверочные веди-до-верного, firstTry в аналитику.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'DecInputScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's_seq', type: 'test',      template: 'SeqMC',          scored: true,  scope: 'practice' },
  { id: 's8',  type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's9',  type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // ---- s0 HOOK: полоса загрузки 3 из 5, провокация Далера «две цифры» ----
  s0: {
    eyebrow: { ru: 'Дробь · вступление', uz: "Kasr · kirish" },
    title: { ru: 'Нодира загружает игру. Заполнено 3 из 5 квадратиков.', uz: "Nodira o'yinni yuklamoqda. Beshdan uch katakcha to'ldi." },
    body: { ru: 'Далер пожимает плечами: «да тут просто две цифры рядом — 3 и 5, при чём тут одно число?»', uz: "Daler yelka qisadi: «bu yerda shunchaki ikkita raqam — 3 va 5, bitta sonning nima aloqasi bor?»" },
    question: { ru: 'А ты как думаешь: 3 из 5 — это одно число или две отдельные цифры?', uz: "Sizningcha-chi: beshdan uch — bu bitta sonmi yoki ikkita alohida raqammi?" },
    opt0: { ru: 'Одно число — это часть всей полосы', uz: "Bitta son — butun chiziqning bir qismi" },
    opt1: { ru: 'Две отдельные цифры, 3 и 5', uz: "Ikkita alohida raqam, 3 va 5" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Нодира загружает игру. Полоса заполнена на три из пяти. Далер говорит, что это просто две цифры. А ты как думаешь — три из пяти это одно число или две отдельные цифры? Выбери ответ.', uz: "Nodira o'yinni yuklamoqda. Chiziq beshdan uchga to'ldi. Daler buni shunchaki ikkita raqam deydi. Sizningcha, beshdan uch — bu bitta sonmi yoki ikkita alohida raqammi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): сборка дроби по шагам ----
  s1: {
    eyebrow: { ru: 'Что такое дробь', uz: "Kasr nima" },
    title: { ru: 'Соберём дробь по шагам', uz: "Kasrni bosqichma-bosqich yig'amiz" },
    bridge: { ru: 'Далер сказал «две цифры». Давай проверим — разберём эту полосу по шагам.', uz: "Daler «ikki raqam» dedi. Keling, tekshiramiz — bu chiziqni bosqichma-bosqich ko'ramiz." },
    conclusion: { ru: 'Три пятых — три доли из пяти.', uz: "Beshdan uch — beshta ulushdan uchtasi." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А как это записать?', uz: "Tushunarli. Buni qanday yozamiz?" },
    audio: {
      ru: [
        'Давай разберём эту полосу по шагам. Нажимай кнопку Дальше.',
        'Сначала у нас одна целая полоса. Это наше целое.',
        'Теперь делим целое на пять равных частей. Каждая такая часть называется доля.',
        'Закрашиваем три доли из пяти. Получается три пятых — три закрашенные доли из пяти равных. Это и есть дробь.'
      ],
      uz: [
        "Keling, bu chiziqni bosqichma-bosqich ko'rib chiqamiz. Davom etish tugmasini bosing.",
        "Avval bizda bitta butun chiziq bor. Bu — bizning butunimiz.",
        "Endi butunni beshta teng bo'lakka bo'lamiz. Har bir bo'lak ulush deyiladi.",
        "Beshta ulushdan uchtasini bo'yaymiz. Beshdan uch hosil bo'ladi — beshta teng ulushdan uchtasi bo'yalgan. Mana shu — kasr."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider + tap): собери 3/4 сам ----
  s2: {
    eyebrow: { ru: 'Собери сам', uz: "O'zingiz yig'ing" },
    title: { ru: 'Собери дробь сам', uz: "Kasrni o'zingiz yig'ing" },
    intro: { ru: 'Двигай ползунок — меняй число равных долей. Нажимай на доли, чтобы их закрасить.', uz: "Slayderni suring — teng ulushlar sonini o'zgartiring. Ulushlarni bo'yash uchun ularni bosing." },
    target_text: { ru: 'Цель: собери три четвёртых — 4 равные доли, 3 закрашены.', uz: "Maqsad: to'rtdan uchni yig'ing — 4 ta teng ulush, 3 tasi bo'yalgan." },
    eyebrow_slider: { ru: 'Равных долей:', uz: "Teng ulushlar:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала собери', uz: "Avval yig'ing" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Это три четвёртых: целое разделили на 4 равные доли и взяли 3.', uz: "Bu — to'rtdan uch: butun to'rtta teng ulushga bo'lindi va uchtasi olindi." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Нужно 4 равные доли и 3 закрашенные. Поставь ползунок на 4 и закрась три доли.', uz: "To'rtta teng ulush va uchta bo'yalgan kerak. Slayderni to'rtga qo'ying va uchta ulushni bo'yang." },
    audio: { ru: 'Собери дробь сам. Двигай ползунок, чтобы выбрать число равных долей, и нажимай на доли, чтобы закрасить. Твоя цель — три четвёртых: четыре равные доли, три закрашены.', uz: "Kasrni o'zingiz yig'ing. Teng ulushlar sonini tanlash uchun slayderni suring va bo'yash uchun ulushlarni bosing. Maqsadingiz — to'rtdan uch: to'rtta teng ulush, uchtasi bo'yalgan." }
  },

  // ---- s3 RULE: числитель / знаменатель, одно число ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Мы собрали дробь. Теперь дадим имя каждой её части.', uz: "Kasrni yig'dik. Endi uning har bir qismiga nom beramiz." },
    label: { ru: 'Как устроена дробь', uz: "Kasr qanday tuzilgan" },
    title: { ru: 'Дробь — это одно число, а не две цифры.', uz: "Kasr — bu bitta son, ikkita raqam emas." },
    card_top: { ru: 'Числитель (сверху) — сколько долей взяли.', uz: "Surat (yuqorida) — nechta ulush olingani." },
    card_bottom: { ru: 'Знаменатель (снизу) — на сколько равных долей разделили целое.', uz: "Maxraj (pastda) — butun nechta teng ulushga bo'lingani." },
    card_line: { ru: 'Чёрточка между ними — это дробная черта.', uz: "Ular orasidagi chiziq — kasr chizig'i." },
    outro: { ru: 'В дроби три пятых: числитель 3, знаменатель 5. Вместе они задают одно число — часть целого.', uz: "Beshdan uch kasrida: surat 3, maxraj 5. Birgalikda ular bitta sonni — butunning qismini bildiradi." },
    audio: { ru: 'Дробь — это одно число, а не две отдельные цифры. Число сверху называется числитель: оно показывает, сколько равных долей мы взяли. Число снизу называется знаменатель: оно показывает, на сколько равных долей разделили целое. В дроби три пятых числитель три, знаменатель пять.', uz: "Kasr — bu bitta son, ikkita alohida raqam emas. Yuqoridagi son surat deyiladi: u nechta teng ulush olganimizni ko'rsatadi. Pastdagi son maxraj deyiladi: u butunni nechta teng ulushga bo'lganimizni ko'rsatadi. Beshdan uch kasrida surat uch, maxraj besh." }
  },

  // ---- s4 TEST (DecInput): запиши числитель (3) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    bridge: { ru: 'Имена знаем — теперь найди числитель сам.', uz: "Nomlarni bilamiz — endi suratni o'zingiz toping." },
    question: { ru: 'Полоса разделена на 5 равных долей, закрашены 3. Запиши числитель этой дроби.', uz: "Chiziq 5 ta teng ulushga bo'lingan, 3 tasi bo'yalgan. Bu kasrning suratini yozing." },
    vis_num: { ru: 'числитель', uz: "surat" },
    vis_den: { ru: 'знаменатель', uz: "maxraj" },
    vis_cap: { ru: 'Сколько долей закрашено?', uz: "Nechta ulush bo'yalgan?" },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Числитель — это сколько долей закрашено. Посчитай закрашенные доли.', uz: "Surat — bu nechta ulush bo'yalgani. Bo'yalgan ulushlarni sanang." },
    fb_correct: { ru: 'Верно: закрашены 3 доли из 5, числитель равен 3. Дробь — три пятых.', uz: "To'g'ri: 5 ulushdan 3 tasi bo'yalgan, surat 3 ga teng. Kasr — beshdan uch." },
    audio: {
      intro: { ru: 'Посмотри на полосу: она разделена на пять равных долей, и три из них закрашены. Запиши числитель этой дроби и нажми кнопку Проверить.', uz: "Chiziqqa qarang: u beshta teng ulushga bo'lingan va uchtasi bo'yalgan. Bu kasrning suratini yozing va Tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Закрашены три доли, значит числитель — три. Дробь читается три пятых.', uz: "To'g'ri. Uchta ulush bo'yalgan, demak surat — uch. Kasr beshdan uch deb o'qiladi." },
      on_wrong: { ru: 'Пока нет. Числитель — это число закрашенных долей. Посчитай их ещё раз.', uz: "Hali emas. Surat — bo'yalgan ulushlar soni. Ularni yana sanang." }
    }
  },

  // ---- s5 RULE: доли должны быть равными ----
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Важно', uz: "Muhim" },
    title: { ru: 'Доли должны быть равными.', uz: "Ulushlar teng bo'lishi kerak." },
    card_ok: { ru: 'Равные доли — это дробь. Целое разделено на одинаковые части.', uz: "Teng ulushlar — bu kasr. Butun bir xil qismlarga bo'lingan." },
    card_bad: { ru: 'Неравные части — это не дробь. Доли разного размера так назвать нельзя.', uz: "Teng bo'lmagan qismlar — kasr emas. Har xil o'lchamdagi qismlarni bunday atab bo'lmaydi." },
    outro: { ru: 'Дробью называем только равные доли целого. Если части разные — это ещё не дробь.', uz: "Kasr deb faqat butunning teng ulushlarini ataymiz. Qismlar har xil bo'lsa — bu hali kasr emas." },
    audio: { ru: 'Запомни важное правило: доли должны быть равными. Если целое разделили на одинаковые части — это дробь. А если части разного размера, дробью это назвать нельзя.', uz: "Muhim qoidani eslab qoling: ulushlar teng bo'lishi kerak. Agar butun bir xil qismlarga bo'lingan bo'lsa — bu kasr. Agar qismlar har xil o'lchamda bo'lsa, buni kasr deb atab bo'lmaydi." }
  },

  // ---- s6 TEST (классификация tap): дробь (равные доли) или нет ----
  s6: {
    eyebrow: { ru: 'Тренировка · сортировка', uz: "Mashq · saralash" },
    title: { ru: 'Дробь или нет?', uz: "Kasrmi yoki yo'qmi?" },
    lead: { ru: 'Дробь — это только равные доли. Отправь каждую полосу в свою корзину.', uz: "Kasr — bu faqat teng ulushlar. Har bir chiziqni o'z savatiga joylang." },
    bin_eq: { ru: 'Дробь — доли равные', uz: "Kasr — ulushlar teng" },
    bin_uneq: { ru: 'Не дробь — доли разные', uz: "Kasr emas — ulushlar har xil" },
    ask: { ru: 'В какую корзину? Тапни.', uz: "Qaysi savatga? Bosing." },
    hint_wrong: { ru: 'Посмотри на доли: они одинакового размера или разного? Равные — это дробь.', uz: "Ulushlarga qarang: bir xil o'lchamdami yoki har xilmi? Teng bo'lsa — kasr." },
    correct_text: { ru: 'Верно! Дробь — это всегда равные доли целого. Части разного размера дробью не назвать.', uz: "To'g'ri! Kasr — bu doim butunning teng ulushlari. Har xil o'lchamdagi qismlarni kasr deb bo'lmaydi." },
    fact: { ru: 'Древние египтяне записывали дроби только как сумму единичных долей — одна третья, одна четвёртая. Например, 3/4 у них = 1/2 + 1/4.', uz: "Qadimgi misrliklar kasrlarni faqat birlik ulushlar — uchdan bir, to'rtdan bir — yig'indisi qilib yozishgan. Masalan, 3/4 ularda = 1/2 + 1/4." },
    fact_audio: { ru: 'Древние египтяне записывали дроби только как сумму единичных долей, например одна вторая плюс одна четвёртая.', uz: "Qadimgi misrliklar kasrlarni faqat birlik ulushlar yig'indisi qilib yozishgan, masalan ikkidan bir qo'shilgan to'rtdan bir." },
    audio: {
      intro: { ru: 'Дробь — это только равные доли целого. Посмотри на каждую полосу: если доли одинаковые — это дробь, если разные — нет. Отправь её в нужную корзину.', uz: "Kasr — bu faqat butunning teng ulushlari. Har bir chiziqqa qarang: ulushlar bir xil bo'lsa — kasr, har xil bo'lsa — yo'q. Uni kerakli savatga joylang." },
      on_correct: { ru: 'Верно. Дробь — это всегда равные доли. Кстати, древние египтяне записывали дроби только как сумму единичных долей.', uz: "To'g'ri. Kasr — bu doim teng ulushlar. Aytgancha, qadimgi misrliklar kasrlarni faqat birlik ulushlar yig'indisi qilib yozishgan." },
      on_wrong: { ru: 'Пока не то. Сравни доли по размеру: одинаковые — это дробь.', uz: "Hali emas. Ulushlarni o'lchami bo'yicha solishtiring: bir xil bo'lsa — kasr." }
    }
  },

  // ---- s7 TEST (choice, frac): назови дробь полосы 3/4 (correct idx 1) ----
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Назови дробь', uz: "Kasrni ayting" },
    question: { ru: 'Полоса разделена на 4 равные доли, закрашены 3. Какая это дробь?', uz: "Chiziq 4 ta teng ulushga bo'lingan, 3 tasi bo'yalgan. Bu qaysi kasr?" },
    correct_text: { ru: 'Верно: 3 закрашенные доли из 4 — это три четвёртых. Сверху 3, снизу 4.', uz: "To'g'ri: 4 ulushdan 3 tasi bo'yalgan — bu to'rtdan uch. Yuqorida 3, pastda 4." },
    hint_0: { ru: 'Сверху число закрашенных долей (3), снизу — общее число долей (4). У тебя они перепутаны.', uz: "Yuqorida bo'yalgan ulushlar soni (uch), pastda umumiy ulushlar soni (to'rt) turishi kerak. Sizda ular almashib qolgan." },
    hint_2: { ru: 'Снизу пишем, на сколько равных долей разделили целое — это 4, а не 1.', uz: "Pastda butun nechta teng ulushga bo'linganini yozamiz — bu to'rt, bir emas." },
    hint_3: { ru: 'Сверху — число закрашенных долей. Их 3, а не 1.', uz: "Yuqorida — bo'yalgan ulushlar soni. Ular uchta, bir emas." },
    wrong_default: { ru: 'Числитель — сколько закрашено (3), знаменатель — на сколько разделили (4).', uz: "Surat — nechta bo'yalgan (uch), maxraj — nechtaga bo'lingan (to'rt)." },
    audio: {
      intro: { ru: 'Полоса разделена на четыре равные доли, и три закрашены. Выбери дробь, которая это описывает.', uz: "Chiziq to'rtta teng ulushga bo'lingan va uchtasi bo'yalgan. Buni ifodalovchi kasrni tanlang." },
      on_correct: { ru: 'Верно. Три закрашенные доли из четырёх — три четвёртых.', uz: "To'g'ri. To'rtta ulushdan uchtasi bo'yalgan — to'rtdan uch." },
      on_wrong: { ru: 'Пока нет. Сверху — число закрашенных долей, снизу — на сколько долей разделили.', uz: "Hali emas. Yuqorida — bo'yalgan ulushlar soni, pastda — nechta ulushga bo'lingani." }
    }
  },

  // ---- s_seq TEST (SeqMC): 5 примеров подряд — чтение дроби «[знаменатель]-ых [числитель]» (UZ: [maxraj]dan [surat]) ----
  // Сложнее: знаменатели 6, 3, 8, 10, 9. Перевёрнутое чтение — ловушка (misconception). Tap, веди-до-верного.
  s_seq: {
    eyebrow: { ru: 'Тренировка · чтение', uz: "Mashq · o'qish" },
    title: { ru: 'Прочитай дробь', uz: "Kasrni o'qing" },
    lead: { ru: 'Пять дробей подряд. Сначала знаменатель, потом числитель. Выбери верное чтение.', uz: "Beshta kasr ketma-ket. Avval maxraj, keyin surat. To'g'ri o'qilishini tanlang." },
    bridge: { ru: 'Имена частей знаем. Теперь быстро прочитаем пять дробей подряд.', uz: "Qism nomlarini bilamiz. Endi beshta kasrni tez o'qib chiqamiz." },
    questions: [
      {
        q: { ru: '5/6', uz: '5/6' },
        say: { ru: 'Как читается эта дробь? Сначала знаменатель.', uz: "Bu kasr qanday o'qiladi? Avval maxraj." },
        opts: [{ ru: 'пять шестых', uz: "oltidan besh" }, { ru: 'шесть пятых', uz: "beshdan olti" }, { ru: 'пять и шесть', uz: "besh-olti" }],
        correct: 0,
        ok: { ru: 'Верно: пять шестых.', uz: "To'g'ri: oltidan besh." },
        no: { ru: 'Сначала читаем знаменатель (нижнее число), потом числитель.', uz: "Avval maxrajni — pastki sonni, keyin suratni o'qiymiz." }
      },
      {
        q: { ru: '2/3', uz: '2/3' },
        say: { ru: 'А эта дробь?', uz: "Bu kasr-chi?" },
        opts: [{ ru: 'три вторых', uz: "ikkidan uch" }, { ru: 'две третьих', uz: "uchdan ikki" }, { ru: 'два и три', uz: "ikki-uch" }],
        correct: 1,
        ok: { ru: 'Верно: две третьих.', uz: "To'g'ri: uchdan ikki." },
        no: { ru: 'Нижнее число читаем первым: на сколько долей разделили.', uz: "Pastki sonni avval o'qiymiz: nechta ulushga bo'lingani." }
      },
      {
        q: { ru: '3/8', uz: '3/8' },
        say: { ru: 'Прочитай дробь с восьмёркой внизу.', uz: "Pastida sakkiz turgan kasrni o'qing." },
        opts: [{ ru: 'восемь третьих', uz: "uchdan sakkiz" }, { ru: 'три и восемь', uz: "uch-sakkiz" }, { ru: 'три восьмых', uz: "sakkizdan uch" }],
        correct: 2,
        ok: { ru: 'Верно: три восьмых.', uz: "To'g'ri: sakkizdan uch." },
        no: { ru: 'Знаменатель восемь — читаем его первым.', uz: "Maxraj sakkiz — uni avval o'qiymiz." }
      },
      {
        q: { ru: '7/10', uz: '7/10' },
        say: { ru: 'Теперь дробь с десятью долями.', uz: "Endi o'nta ulushli kasr." },
        opts: [{ ru: 'семь десятых', uz: "o'ndan yetti" }, { ru: 'десять седьмых', uz: "yettidan o'n" }, { ru: 'семь и десять', uz: "yetti-o'n" }],
        correct: 0,
        ok: { ru: 'Верно: семь десятых.', uz: "To'g'ri: o'ndan yetti." },
        no: { ru: 'Сначала знаменатель десять, потом числитель семь.', uz: "Avval maxraj o'n, keyin surat yetti." }
      },
      {
        q: { ru: '4/9', uz: '4/9' },
        say: { ru: 'Последняя дробь. Прочитай верно.', uz: "Oxirgi kasr. To'g'ri o'qing." },
        opts: [{ ru: 'четыре и девять', uz: "to'rt-to'qqiz" }, { ru: 'четыре девятых', uz: "to'qqizdan to'rt" }, { ru: 'девять четвёртых', uz: "to'rtdan to'qqiz" }],
        correct: 1,
        ok: { ru: 'Верно: четыре девятых.', uz: "To'g'ri: to'qqizdan to'rt." },
        no: { ru: 'Нижнее число девять читаем первым.', uz: "Pastki son to'qqizni avval o'qiymiz." }
      }
    ],
    audio: {
      intro: { ru: 'Прочитаем пять дробей подряд. Правило: сначала знаменатель, нижнее число, потом числитель. Выбери верное чтение.', uz: "Beshta kasrni ketma-ket o'qiymiz. Qoida: avval maxraj — pastki son, keyin surat. To'g'ri o'qilishini tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Сначала читаем нижнее число.', uz: "Deyarli. Avval pastki sonni o'qiymiz." },
      on_done: { ru: 'Отлично, все пять дробей прочитаны верно.', uz: "Zo'r, beshala kasr to'g'ri o'qildi." }
    }
  },

  // ---- s8 CASE setup: Карим наливает сок (стакан 4 части, налито 3) ----
  s8: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    bridge: { ru: 'Дроби живут не только на полосах. Посмотри на стакан Карима.', uz: "Kasrlar faqat chiziqlarda emas. Karimning stakaniga qarang." },
    title: { ru: 'Карим наливает сок.', uz: "Karim sharbat quymoqda." },
    body_p1: { ru: 'Стакан разделён на 4 равные части. Карим налил сок до третьей отметки — заполнены 3 части.', uz: "Stakan 4 ta teng qismga bo'lingan. Karim sharbatni uchinchi belgigacha quydi — 3 qism to'ldi." },
    card_glass_label: { ru: 'Всего частей', uz: "Jami qismlar" },
    card_glass_value: { ru: '4 равные части', uz: "4 ta teng qism" },
    card_filled_label: { ru: 'Заполнено', uz: "To'ldi" },
    card_filled_value: { ru: '3 части', uz: "3 qism" },
    outro: { ru: 'Какой дробью записать, сколько сока в стакане? Помоги Кариму на следующем шаге.', uz: "Stakandagi sharbatni qaysi kasr bilan yozish kerak? Keyingi bosqichda Karimga yordam bering." },
    btn_help: { ru: 'Помочь Кариму', uz: "Karimga yordam berish" },
    audio: { ru: 'Карим наливает сок. Стакан разделён на четыре равные части, и сок налит до третьей — заполнены три части. Подумай, какой дробью записать, сколько сока в стакане.', uz: "Karim sharbat quymoqda. Stakan to'rtta teng qismga bo'lingan va sharbat uchinchisigacha quyilgan — uch qism to'ldi. Stakandagi sharbatni qaysi kasr bilan yozishni o'ylab ko'ring." }
  },

  // ---- s9 CASE step (choice, frac): запиши 3/4 (correct idx 2) ----
  s9: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    label: { ru: 'Запиши дробь', uz: "Kasrni yozing" },
    question: { ru: 'Стакан из 4 равных частей, заполнены 3. Какой дробью записать, сколько налито?', uz: "Stakan 4 ta teng qismdan iborat, 3 tasi to'lgan. Nechta quyilganini qaysi kasr bilan yozamiz?" },
    correct_text: { ru: 'Верно: 3 части из 4 — это три четвёртых. В стакане три четвёртых сока.', uz: "To'g'ri: 4 qismdan 3 tasi — bu to'rtdan uch. Stakanda to'rtdan uch sharbat bor." },
    hint_0: { ru: 'Сверху — сколько заполнено (3), снизу — всего частей (4). Тут они перепутаны.', uz: "Yuqorida — nechta to'lgani (uch), pastda — jami qismlar (to'rt). Bu yerda ular almashgan." },
    hint_1: { ru: 'Снизу должно быть, на сколько равных частей разделён стакан — это 4.', uz: "Pastda stakan nechta teng qismga bo'linganini yozish kerak — bu to'rt." },
    hint_3: { ru: 'Сверху — число заполненных частей. Их 3, а не 1.', uz: "Yuqorida — to'lgan qismlar soni. Ular uchta, bir emas." },
    wrong_default: { ru: 'Числитель — сколько заполнено (3), знаменатель — на сколько частей разделён стакан (4).', uz: "Surat — nechta to'lgani (uch), maxraj — stakan nechta qismga bo'lingani (to'rt)." },
    fact: { ru: 'Мерные стаканы и линейки тоже делят целое на равные доли — поэтому их значения и записывают дробями.', uz: "O'lchov idishlari va lineykalar ham butunni teng ulushlarga bo'ladi — shuning uchun ulardagi qiymatlar kasr bilan yoziladi." },
    fact_audio: { ru: 'Мерные стаканы и линейки тоже делят целое на равные доли, поэтому их значения записывают дробями.', uz: "O'lchov idishlari va lineykalar ham butunni teng ulushlarga bo'ladi, shuning uchun ulardagi qiymatlar kasr bilan yoziladi." },
    audio: {
      intro: { ru: 'Стакан разделён на четыре равные части, заполнены три. Выбери дробь, которая показывает, сколько сока налито.', uz: "Stakan to'rtta teng qismga bo'lingan, uchtasi to'lgan. Qancha sharbat quyilganini ko'rsatadigan kasrni tanlang." },
      on_correct: { ru: 'Верно. Три части из четырёх — три четвёртых стакана. Поэтому мерные стаканы и линейки тоже делят целое на равные доли.', uz: "To'g'ri. To'rttadan uch qism — stakanning to'rtdan uchi. Shuning uchun o'lchov idishlari va lineykalar ham butunni teng ulushlarga bo'ladi." },
      on_wrong: { ru: 'Пока нет. Сверху — сколько частей заполнено, снизу — на сколько частей разделён стакан.', uz: "Hali emas. Yuqorida — nechta qism to'lgani, pastda — stakan nechta qismga bo'lingani." }
    }
  },

  // ---- s10 TEST (error-spotting): какое утверждение про 3/4 НЕВЕРНО (correct idx 2 = ложное) ----
  s10: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    label: { ru: 'Найди неверное', uz: "Noto'g'risini toping" },
    title: { ru: 'Одно утверждение неверно', uz: "Bitta izoh noto'g'ri" },
    question: { ru: 'Мы записали три четвёртых. Три утверждения верны, а одно — нет. Какое НЕВЕРНО?', uz: "Biz to'rtdan uchni yozdik. Uchta izoh to'g'ri, bittasi esa — yo'q. Qaysi biri NOTO'G'RI?" },
    opt0: { ru: 'Целое разделено на 4 равные части.', uz: "Butun 4 ta teng qismga bo'lingan." },
    opt1: { ru: 'Из 4 частей заняты 3.', uz: "4 qismdan 3 tasi band." },
    opt2: { ru: 'В стакане ровно 3 литра сока.', uz: "Stakanda aniq 3 litr sharbat bor." },
    opt3: { ru: 'Пустого места — одна четвёртая.', uz: "Bo'sh joy — to'rtdan bir." },
    correct_text: { ru: 'Верно, это утверждение неверно: дробь показывает части целого, а не литры. Три четвёртых — это 3 части из 4, сколько бы сока ни вмещал стакан.', uz: "To'g'ri, bu izoh noto'g'ri: kasr butunning qismlarini ko'rsatadi, litrlarni emas. To'rtdan uch — bu 4 qismdan 3 tasi, stakan qancha sharbat sig'dirishidan qat'i nazar." },
    wrong_0: { ru: 'Это утверждение верно: целое и правда делят на 4 равные части. Ищи неверное дальше.', uz: "Bu izoh to'g'ri: butun haqiqatan 4 ta teng qismga bo'linadi. Noto'g'risini boshqasidan qidiring." },
    wrong_1: { ru: 'Это верно: заняты 3 части из 4. Ищи неверное дальше.', uz: "Bu to'g'ri: 4 qismdan 3 tasi band. Noto'g'risini boshqasidan qidiring." },
    wrong_3: { ru: 'Это верно: занято 3 из 4, значит свободна одна четвёртая. Ищи неверное дальше.', uz: "Bu to'g'ri: 4 dan 3 tasi band, demak to'rtdan biri bo'sh. Noto'g'risini boshqasidan qidiring." },
    wrong_default: { ru: 'Дробь показывает части целого, а не литры. Ищи именно такое утверждение.', uz: "Kasr butunning qismlarini ko'rsatadi, litrlarni emas. Aynan shunday izohni qidiring." },
    audio: {
      intro: { ru: 'Три утверждения про три четвёртых верны, а одно неверно. Найди то, которое говорит неправду про сок в стакане.', uz: "To'rtdan uch haqida uchta izoh to'g'ri, bittasi noto'g'ri. Stakandagi sharbat haqida yolg'on aytayotganini toping." },
      on_correct: { ru: 'Верно. Дробь показывает части целого, а не литры. Три четвёртых — это три части из четырёх.', uz: "To'g'ri. Kasr butunning qismlarini ko'rsatadi, litrlarni emas. To'rtdan uch — bu to'rttadan uch qism." },
      on_wrong: { ru: 'Это утверждение как раз верно. Ищи то, что говорит про литры вместо частей.', uz: "Bu izoh aynan to'g'ri. Qismlar o'rniga litrlar haqida gapirayotganini qidiring." }
    }
  },

  // ---- s11 TEST (choice, frac): назови дробь полосы 2/5 (correct idx 1) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — назови дробь', uz: "Oxirgisi — kasrni ayting" },
    question: { ru: 'Полоса разделена на 5 равных долей, закрашены 2. Какая это дробь?', uz: "Chiziq 5 ta teng ulushga bo'lingan, 2 tasi bo'yalgan. Bu qaysi kasr?" },
    correct_text: { ru: 'Верно: 2 закрашенные доли из 5 — это две пятых. Сверху 2, снизу 5.', uz: "To'g'ri: 5 ulushdan 2 tasi bo'yalgan — bu beshdan ikki. Yuqorida 2, pastda 5." },
    hint_0: { ru: 'Числитель и знаменатель перепутаны: сверху число закрашенных (2), снизу всех долей (5).', uz: "Surat va maxraj almashgan: yuqorida bo'yalganlar soni (ikki), pastda barcha ulushlar (besh)." },
    hint_2: { ru: 'Снизу — на сколько равных долей разделили целое. Их 5, а не 3.', uz: "Pastda — butun nechta teng ulushga bo'lingani. Ular beshta, uch emas." },
    hint_3: { ru: 'Сверху — число закрашенных долей. Их 2, а не 3.', uz: "Yuqorida — bo'yalgan ulushlar soni. Ular ikkita, uch emas." },
    wrong_default: { ru: 'Две пятых: числитель 2 (закрашено), знаменатель 5 (всего долей).', uz: "Beshdan ikki: surat ikki (bo'yalgan), maxraj besh (jami ulushlar)." },
    fact: { ru: 'Полоса загрузки на экране показывает дробь: какая часть целого уже готова. Полоса Нодиры была заполнена на 3/5.', uz: "Ekrandagi yuklash chizig'i kasrni ko'rsatadi: butunning qancha qismi tayyor bo'lgani. Nodiraning chizig'i aynan 3/5 ga to'lgan edi." },
    fact_audio: { ru: 'Полоса загрузки на экране показывает дробь — какая часть целого уже готова. Полоса Нодиры была заполнена на три пятых.', uz: "Ekrandagi yuklash chizig'i kasrni ko'rsatadi — butunning qancha qismi tayyorligini. Nodiraning chizig'i beshdan uchga to'lgan edi." },
    audio: {
      intro: { ru: 'Последнее задание. Полоса разделена на пять равных долей, закрашены две. Выбери нужную дробь.', uz: "Oxirgi topshiriq. Chiziq beshta teng ulushga bo'lingan, ikkitasi bo'yalgan. Kerakli kasrni tanlang." },
      on_correct: { ru: 'Верно. Две закрашенные доли из пяти — две пятых. Помнишь полосу загрузки Нодиры? Она тоже показывала дробь — какая часть готова.', uz: "To'g'ri. Beshta ulushdan ikkitasi bo'yalgan — beshdan ikki. Nodiraning yuklash chizig'i esingdami? U ham kasrni — qancha qism tayyorligini — ko'rsatgan edi." },
      on_wrong: { ru: 'Пока нет. Сверху — число закрашенных долей, снизу — на сколько долей разделили целое.', uz: "Hali emas. Yuqorida — bo'yalgan ulushlar soni, pastda — butun nechta ulushga bo'lingani." }
    }
  },

  // ---- s12 SUMMARY: без счёта, закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    score_caption: { ru: 'вопросов решено верно с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob berdingiz" },
    title: { ru: 'Теперь дробь для тебя — одно число, а не две цифры.', uz: "Endi kasr siz uchun — bitta son, ikkita raqam emas." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Дробь — это часть целого: целое делят на равные доли и берут несколько.', uz: "Kasr — butunning qismi: butun teng ulushlarga bo'linadi va bir nechtasi olinadi." },
    main_2: { ru: 'Числитель (сверху) — сколько долей взяли. Знаменатель (снизу) — на сколько равных долей разделили.', uz: "Surat (yuqorida) — nechta ulush olingani. Maxraj (pastda) — nechta teng ulushga bo'lingani." },
    main_3: { ru: 'Доли обязательно равные. Неравные части дробью не назвать.', uz: "Ulushlar albatta teng. Teng bo'lmagan qismlarni kasr deb bo'lmaydi." },
    main_4: { ru: 'Три пятых, три четвёртых, две пятых — каждая дробь это одно число, часть целого.', uz: "Beshdan uch, to'rtdan uch, beshdan ikki — har bir kasr bitta son, butunning qismi." },
    back_to_hook: { ru: 'Полоса Нодиры заполнена на три пятых — это и было одно число. Далер ошибался.', uz: "Nodiraning chizig'i beshdan uchga to'lgan — bu bitta son edi. Daler xato qilgan ekan." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'доли из 4 класса (половина, четверть).', uz: "4-sinf ulushlari (yarim, chorak)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'дробь на числовой прямой — у дроби есть своё место.', uz: "kasr son o'qida — kasrning o'z joyi bor." },
    audio: { ru: 'Отлично! Теперь ты знаешь: дробь — это одно число, часть целого. Числитель показывает, сколько равных долей взяли, а знаменатель — на сколько долей разделили целое. И доли всегда равные. Полоса Нодиры была заполнена на три пятых — это одно число, а не две цифры. Далер ошибался.', uz: "Zo'r! Endi bilasiz: kasr — bu bitta son, butunning qismi. Surat nechta teng ulush olinganini, maxraj esa butun nechta ulushga bo'linganini ko'rsatadi. Ulushlar esa doimo teng. Nodiraning chizig'i beshdan uchga to'lgan edi — bu bitta son, ikkita raqam emas. Daler xato qilgan ekan." }
  }
};

// ============================================================
// DecInputScreen — числовой ответ: веди-до-верного + bardoshli tekshiruv (0,8 = 0.8, qiymat bo'yicha).
// ============================================================
const DecInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const correct = Number(correctValue);
  const norm = (s) => parseFloat(String(s).replace(',', '.').replace(/\s/g, ''));
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [value, setValue] = useState(wasSolved ? String(correct).replace('.', ',') : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = norm(value); if (isNaN(v)) return;
    const isCorrect = Math.abs(v - correct) < 1e-6;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(value); }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input type="text" inputMode="decimal" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(110px, 24vw, 150px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: T.ink2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// ClassifyBars (s6) — ketma-ket tasniflash: polosa chiqadi → savatga joylaydi (teng / teng emas).
// Tartib HAR seansda random (Fisher-Yates, useState init — bir seansda deck o'zgarmaydi). Веди-до-верного, scored.
// ============================================================
const S6_CARDS = [
  { parts: 3, shaded: 1, bin: 'eq' },
  { segWidths: [1, 2, 0.7], shaded: 1, bin: 'uneq' },
  { parts: 4, shaded: 2, bin: 'eq' },
  { segWidths: [2, 1, 1, 0.6], shaded: 2, bin: 'uneq' },
  { parts: 5, shaded: 3, bin: 'eq' },
  { parts: 2, shaded: 1, bin: 'eq' },
];
const S6_BINS = [{ key: 'eq', dir: 'down' }, { key: 'uneq', dir: 'up' }];
const ClassifyBars = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  const [factShown, setFactShown] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null); const flashRef = useRef(null); const factRef = useRef(null);
  const cur = idx < n ? deck[idx] : null;
  const finish = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: deck.map(cd => cd.bin).join(','), studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
    factRef.current = setTimeout(() => {
      setFactShown(true);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.fact_audio[lang]); }
    }, 2600);
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
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (flashRef.current) clearTimeout(flashRef.current); if (factRef.current) clearTimeout(factRef.current); }, []);
  const inBin = (bin) => deck.map((cd, i) => i).filter(i => placed[i] === bin);
  const miniBar = (cd) => <span style={{ display: 'inline-block', width: 'clamp(54px, 11vw, 72px)' }}><BarModel parts={cd.parts} shaded={cd.shaded} segWidths={cd.segWidths} height={16}/></span>;
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
            : <span key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}><span style={{ display: 'inline-block', width: 'clamp(160px, 42vw, 280px)' }}><BarModel parts={cur.parts} shaded={cur.shaded} segWidths={cur.segWidths} height={'clamp(34px, 8vw, 46px)'}/></span><span className="sort-tray-ask">{mt(t(c.ask))}</span></span>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {S6_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key === 'eq' ? 'sq' : 'cu'}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h">{b.key === 'eq' ? mt(t(c.bin_eq)) : mt(t(c.bin_uneq))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i}>{miniBar(deck[i])}</span>)}
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
        {factShown && <FactCard text={c.fact} badge={FB_HIST} anim={<AnimUnit/>}/>}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (tap, klaviatura yo'q). Веди-до-верного: noto'g'ri o'chadi,
// to'g'ridan keyin avtomatik keyingisiga. scored bo'lsa oxirida bitta natija. (Dars28 etaloni, baytma-bayt)
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
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(13px, 1.8vw, 16px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 600 }}>
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

// s0 — HOOK: любой выбор продвигает дальше (нет верного); при возврате полный сброс. (hook может центрироваться)
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
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <BarModel parts={5} shaded={3} height={'clamp(48px, 10vw, 60px)'}/>
          <p className="small mono" style={{ color: T.ink3, margin: 0 }}>3 / 5</p>
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

// s1 — EXPLORATION step-by-step: ученик жмёт «Дальше», полоса раскрывается, голос ведёт. (top-align)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const parts = step >= 2 ? 5 : 1;
  const shaded = step >= 3 ? 3 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
          <BarModel parts={parts} shaded={shaded} height={'clamp(52px, 11vw, 64px)'}/>
          {step >= 3 && (<p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>)}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider + tap: собери 3/4. (top-align)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [parts, setParts] = useState(2);
  const [shadedSet, setShadedSet] = useState(() => new Set());
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const toggle = (i) => { if (solved) return; setChecked(false); setShadedSet(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; }); };
  const onSlider = (v) => { if (solved) return; setChecked(false); setParts(v); setShadedSet(new Set()); };
  const shadedCount = [...shadedSet].filter(i => i < parts).length;
  const check = () => {
    const ok = parts === 4 && shadedCount === 3;
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
          <BarModel parts={parts} shadedSet={shadedSet} interactive={!solved} onToggle={toggle} height={'clamp(52px, 11vw, 64px)'}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {parts}</p>
            <Slider value={parts} min={2} max={6} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: числитель / знаменатель. (top-align + Bridge)
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(20px, 6vw, 44px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Frac n="3" d="5" size="display"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220, flex: 1 }}>
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

// s4 — TEST DecInput: числитель (3). renderVisual — полоса 3/5 + поле над «5».
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const numColor = (solved) => solved ? T.success : T.accent;
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={3}
    renderVisual={({ value, solved }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3vw, 22px)', alignItems: 'center', width: '100%', padding: 'clamp(4px, 1.5vw, 10px) 0' }}>
        {/* Чёткая полоса 3/5 — крупная, доли хорошо различимы */}
        <div style={{ width: '100%', maxWidth: 440 }}>
          <BarModel parts={5} shaded={3} height={'clamp(58px, 13vw, 80px)'}/>
          <p className="small" style={{ margin: '8px 0 0', textAlign: 'center', color: T.ink3 }}>{t(c.vis_cap)}</p>
        </div>
        {/* Связь: закрашенная часть → числитель. Знаменатель уже известен (5). */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 18px)' }}>
          <span aria-hidden="true" style={{ fontSize: 'clamp(22px, 5vw, 32px)', color: T.accent, lineHeight: 1 }}>→</span>
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 'clamp(46px, 11vw, 66px)', height: 'clamp(46px, 11vw, 66px)', borderRadius: 12, border: solved ? `2px solid ${T.success}` : `2px dashed ${T.accent}`, fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px, 6.5vw, 46px)', lineHeight: 1, color: numColor(solved), background: solved ? T.successSoft : '#FFFFFF' }}>{solved ? '3' : (value || '?')}</span>
              <span className="small mono" style={{ color: T.ink3 }}>{t(c.vis_num)}</span>
            </span>
            <span style={{ height: 3, background: T.ink, width: 'clamp(60px, 15vw, 92px)', margin: 'clamp(7px, 1.6vw, 10px) 0', borderRadius: 2 }}/>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 'clamp(46px, 11vw, 66px)', height: 'clamp(46px, 11vw, 66px)', fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px, 6.5vw, 46px)', lineHeight: 1, color: T.ink }}>5</span>
              <span className="small mono" style={{ color: T.ink3 }}>{t(c.vis_den)}</span>
            </span>
          </span>
        </div>
      </div>
    )}/>;
};

// s5 — RULE: равные доли. (top-align)
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <BarModel parts={4} shaded={1} height={40}/>
            <p className="small" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{mt(t(c.card_ok))}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <BarModel segWidths={[1, 2, 0.7, 1.3]} shaded={1} height={40}/>
            <p className="small" style={{ margin: 0, color: T.ink3, fontWeight: 600 }}>{mt(t(c.card_bad))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — TEST классификация (равные / неравные доли).
const Screen6 = (props) => <ClassifyBars {...props}/>;

// s7 — TEST choice (дроби): назови дробь полосы 3/4 (correct old idx 1).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [<Frac n="4" d="3" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="3" d="1" size="mid"/>, <Frac n="1" d="4" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [2, 1, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><BarModel parts={4} shaded={3} height={40}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s_seq — TEST: 5 примеров подряд (чтение дроби, tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — CASE setup: Карим, стакан. (top-align + Bridge)
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 48px)', alignItems: 'center', flexWrap: 'wrap' }}>
          <GlassModel parts={4} filled={3}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.card_glass_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_glass_value)}</p></div>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_filled_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_filled_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (дроби): запиши 3/4 (correct old idx 2).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [<Frac n="4" d="3" size="mid"/>, <Frac n="3" d="1" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="1" d="4" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}><GlassModel parts={4} filled={3}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimBeaker/>}/>}/>;
};

// s10 — TEST error-spotting: какое утверждение про 3/4 НЕВЕРНО (correct old idx 2).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — TEST choice (дроби): назови дробь полосы 2/5 (correct old idx 1).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="5" d="2" size="mid"/>, <Frac n="2" d="5" size="mid"/>, <Frac n="2" d="3" size="mid"/>, <Frac n="3" d="5" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [3, 2, 1, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}><BarModel parts={5} shaded={2} height={50}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimLoad/>}/>}/>;
};

// s12 — SUMMARY: без счёта, закрывает крючок; onFinished один раз. (top-align)
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
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0, width: 'clamp(120px, 30vw, 180px)' }}><BarModel parts={5} shaded={3} height={38}/></div>
          <p className="body" style={{ margin: 0, flex: 1, minWidth: 180 }}>{mt(t(c.back_to_hook))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ (шаблон из infrastructure_v1)
// ============================================================
export default function FractionsLesson({
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

/* HOOK jonli animatsiya (uzluksiz bezakli harakat) */
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

/* === INPUT v15 === */
.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

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

/* === SeqMC qisqa savol (kasr/ifoda) === */
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }

/* === SeqMC / classify progress nuqtalari === */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

/* === SORT / классификация (поднос + корзины) === */
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
.sort-bin-bad { animation: odShake 0.4s ease; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 22px -6px rgba(255, 79, 40, 0.3); }
@keyframes odShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

/* === BRIDGE (slaydlararo o'tish) === */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* === FACT-АНИМАЦИИ (синяя тема) === */
.fa-unit { display: flex; flex-direction: column; gap: 6px; width: clamp(84px, 16vw, 112px); }
.fa-unit-r { height: 13px; border-radius: 3px; background: #019ACB; opacity: 0.25; animation: faUnit 2.4s ease-in-out infinite; }
.fa-unit-1 { width: 100%; animation-delay: 0s; }
.fa-unit-2 { width: 50%; animation-delay: 0.3s; }
.fa-unit-3 { width: 25%; animation-delay: 0.6s; }
@keyframes faUnit { 0%, 100% { opacity: 0.2; } 45% { opacity: 0.95; } }
.fa-bk { display: flex; flex-direction: column-reverse; gap: 3px; width: clamp(40px, 8vw, 52px); height: clamp(64px, 13vw, 84px); padding: 4px; border: 2px solid #019ACB; border-radius: 5px 5px 9px 9px; }
.fa-bk-c { flex: 1; background: #019ACB; opacity: 0.2; border-radius: 2px; animation: faBk 2.8s ease-in-out infinite; }
@keyframes faBk { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; } }
.fa-load { display: flex; gap: 4px; width: clamp(86px, 17vw, 116px); }
.fa-load-c { flex: 1; height: clamp(22px, 5vw, 30px); background: #019ACB; opacity: 0.18; border-radius: 4px; }
.fa-load-on { animation: faLoad 2.4s ease-in-out infinite; }
@keyframes faLoad { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.92; } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;



