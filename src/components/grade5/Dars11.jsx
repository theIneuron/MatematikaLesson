import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Дробь как деление — frac_5_03
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C (etalon: Dars28). s6 → классификация (доля меньше/больше целой),
// s10 → error-spotting, s_seq → 5 примеров «запиши деление дробью». Top-align, Bridge, shuffleMC.

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
// Tarix (Misr bo'lish jadvali): teng ulushlar qatorlari navbatma-navbat yonadi.
const AnimEgypt = () => (
  <div className="fd-egy" aria-hidden="true">
    {[3, 4, 5].map((cells, r) => (
      <div key={r} className="fd-egy-row" style={{ animationDelay: `${r * 0.35}s` }}>
        {Array.from({ length: cells }).map((_, k) => (
          <span key={k} className="fd-egy-c" style={{ animationDelay: `${r * 0.35 + k * 0.12}s` }}/>
        ))}
      </div>
    ))}
  </div>
);
// Fan (asalari uyasi): teng oltburchak katakchalar — tabiatdagi teng bo'lish.
const AnimHive = () => (
  <div className="fd-hex" aria-hidden="true">
    {Array.from({ length: 7 }).map((_, i) => (
      <span key={i} className="fd-hex-c" style={{ animationDelay: `${i * 0.22}s` }}/>
    ))}
  </div>
);
// IT (load balancing): oqim 3 ta serverga teng bo'linadi.
const AnimServers = () => (
  <div className="fd-srv" aria-hidden="true">
    <span className="fd-srv-stream"/>
    <div className="fd-srv-rack">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className="fd-srv-node" style={{ animationDelay: `${i * 0.3}s` }}/>
      ))}
    </div>
  </div>
);

// ============================================================
// УРОК-СПЕЦИФИЧНЫЙ ВИЗУАЛИЗАТОР — SharingBoard (A лепёшек на B друзей → A/B)
// ============================================================
const SharingLoaf = ({ size, parts, cut, highlight }) => {
  const cx = size / 2, cy = size / 2, rr = size / 2 - 2;
  const sectorPath = (k) => {
    const a0 = -Math.PI / 2 + (k * 2 * Math.PI) / parts;
    const a1 = -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / parts;
    const x0 = cx + rr * Math.cos(a0), y0 = cy + rr * Math.sin(a0);
    const x1 = cx + rr * Math.cos(a1), y1 = cy + rr * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x0} ${y0} A ${rr} ${rr} 0 ${large} 1 ${x1} ${y1} Z`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="sb-loaf" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={rr} fill="#F2D7A8" stroke="#C68A45" strokeWidth="2" />
      {cut && Array.from({ length: parts }).map((_, k) => (
        <path key={`${parts}-${k}`} d={sectorPath(k)} className="sb-slice"
          fill={T.accent} fillOpacity={k < highlight ? 0.82 : 0}
          stroke="#C68A45" strokeWidth="1.4" style={{ transitionDelay: `${k * 0.04}s` }} />
      ))}
    </svg>
  );
};

const SharingBoard = ({ loaves = 3, people = 4, reveal = 3, showShare = true, size = 60 }) => {
  const shareHi = reveal >= 2 ? 1 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', gap: 'clamp(6px, 1.8vw, 14px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.from({ length: loaves }).map((_, i) => (
          <SharingLoaf key={`${people}-${i}`} size={size} parts={people} cut={reveal >= 1} highlight={shareHi} />
        ))}
      </div>
      {showShare && reveal >= 3 && (
        <div className="sb-plate" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
          <span className="mono small" style={{ color: T.ink3 }}>=</span>
          <SharingLoaf size={size} parts={people} cut={true} highlight={loaves} />
          <span className="mono small" style={{ color: T.ink3 }}>=</span>
          <Frac n={String(loaves)} d={String(people)} size="mid" />
        </div>
      )}
    </div>
  );
};

const DivExpr = ({ a, b, size = 'mid' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
    <span className="display" style={{ fontSize: size === 'display' ? 'clamp(30px, 6vw, 48px)' : 'clamp(22px, 4vw, 32px)' }}>{a}</span>
    <Op size={size === 'display' ? 'big' : 'mid'}>÷</Op>
    <span className="display" style={{ fontSize: size === 'display' ? 'clamp(30px, 6vw, 48px)' : 'clamp(22px, 4vw, 32px)' }}>{b}</span>
    <Op size={size === 'display' ? 'big' : 'mid'}>=</Op>
    <Frac n={String(a)} d={String(b)} size={size === 'display' ? 'display' : 'mid'} />
  </div>
);

// ============================================================
// --- POD UROK: frac_5_03 — Дробь как деление / Kasr — bo'lish natijasi ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-03-v1',
  lessonTitle: { ru: 'Дробь как деление', uz: "Kasr — bo'lish natijasi" }
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
  // ---- s0 HOOK: Севара делит 3 лепёшки на 4 друзей, Улугбек: «3 меньше 4 — не делится» ----
  s0: {
    eyebrow: { ru: 'Дробь как деление · вступление', uz: "Kasr — bo'lish · kirish" },
    title: { ru: 'Севара хочет разделить 3 лепёшки поровну между 4 друзьями.', uz: "Sevara 3 ta nonni 4 ta do'sti o'rtasida teng bo'lmoqchi." },
    body: { ru: 'Улугбек машет рукой: «три на четыре не делится — три меньше четырёх. Кому-то не хватит, поровну не выйдет».', uz: "Ulug'bek qo'l siltaydi: «uchni to'rtga bo'lib bo'lmaydi — uch to'rtdan kichik. Kimgadir yetmaydi, teng chiqmaydi»." },
    question: { ru: 'А ты как думаешь: можно ли разделить 3 лепёшки на 4 друзей поровну?', uz: "Sizningcha-chi: 3 ta nonni 4 ta do'stga teng bo'lib bo'ladimi?" },
    opt0: { ru: 'Да — каждому достанется равная часть', uz: "Ha — har biriga teng ulush tegadi" },
    opt1: { ru: 'Нет — меньшее на большее не делится', uz: "Yo'q — kichikni kattaga bo'lib bo'lmaydi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Севара хочет разделить три лепёшки поровну между четырьмя друзьями. Улугбек говорит, что три на четыре не делится, ведь три меньше четырёх. А ты как думаешь — можно ли разделить три лепёшки на четырёх друзей поровну? Выбери ответ.', uz: "Sevara 3 ta nonni 4 ta do'sti o'rtasida teng bo'lmoqchi. Ulug'bek aytadiki, uchni to'rtga bo'lib bo'lmaydi, chunki uch to'rtdan kichik. Sizningcha, 3 ta nonni 4 ta do'stga teng bo'lib bo'ladimi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): делим 3 лепёшки на 4 ----
  s1: {
    eyebrow: { ru: 'Делим поровну', uz: "Teng bo'lamiz" },
    title: { ru: 'Разделим 3 лепёшки на 4 друзей по шагам', uz: "3 ta nonni 4 do'stga bosqichma-bosqich bo'lamiz" },
    bridge: { ru: 'Улугбек сказал «не делится». Давай попробуем разделить по шагам.', uz: "Ulug'bek «bo'linmaydi» dedi. Keling, bosqichma-bosqich bo'lib ko'ramiz." },
    conclusion: { ru: 'Каждому досталось 3/4 лепёшки. Значит, 3 ÷ 4 = 3/4.', uz: "Har biriga 3/4 non tegdi. Demak, 3 ÷ 4 = 3/4." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Разделим три лепёшки на четыре друга по шагам. Нажимай кнопку Дальше.',
        'Вот три целые лепёшки и четыре друга. Хотим, чтобы каждому досталось поровну.',
        'Друзей четыре — поэтому каждую лепёшку режем на четыре равные части. Каждая часть — это одна четвёртая лепёшки.',
        'Теперь даём каждому по одному кусочку от каждой лепёшки. Три лепёшки — значит три кусочка, это три четвёртых. Видишь: три на четыре всё-таки делится, просто ответ — дробь.'
      ],
      uz: [
        "3 ta nonni 4 do'stga bosqichma-bosqich bo'lamiz. Davom etish tugmasini bosing.",
        "Mana 3 ta butun non va 4 ta do'st. Har biriga teng tegishini xohlaymiz.",
        "Do'stlar to'rtta — shuning uchun har bir nonni 4 ta teng bo'lakka kesamiz. Har bir bo'lak — nonning to'rtdan biri.",
        "Endi har biriga har bir nondan bitta bo'lakdan beramiz. Non uchta — demak uchta bo'lak, bu to'rtdan uch. Ko'rdingizmi: uchni to'rtga bo'lsa ham bo'larkan, faqat javob — kasr."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider + check): подели 2 лепёшки на 3 сам ----
  s2: {
    eyebrow: { ru: 'Подели сам', uz: "O'zingiz bo'ling" },
    title: { ru: 'Подели 2 лепёшки на 3 друзей сам', uz: "2 ta nonni 3 do'stga o'zingiz bo'ling" },
    intro: { ru: 'Двигай ползунок — выбирай, на сколько равных частей резать каждую лепёшку. Подумай, как сделать дольки честными для 3 друзей.', uz: "Slayderni suring — har bir nonni nechta teng bo'lakka kesishni tanlang. 3 do'st uchun ulushlar adolatli bo'lishini o'ylab ko'ring." },
    target_text: { ru: 'Цель: 2 лепёшки на 3 друзей. На сколько частей резать каждую лепёшку?', uz: "Maqsad: 2 ta non 3 do'stga. Har bir nonni nechta bo'lakka kesamiz?" },
    eyebrow_slider: { ru: 'Частей в лепёшке:', uz: "Nondagi bo'laklar:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала подели', uz: "Avval bo'ling" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Друзей 3 — режем каждую лепёшку на 3 части. Каждому по 2 кусочка — это две третьих. Значит, два разделить на три это две третьих.', uz: "Do'stlar 3 ta — har bir nonni 3 bo'lakka kesamiz. Har biriga 2 bo'lakdan — bu uchdan ikki. Demak, ikkini uchga bo'lsak uchdan ikki." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Друзей 3, поэтому каждую лепёшку режем ровно на 3 части. Поставь ползунок на 3.', uz: "Do'stlar 3 ta, shuning uchun har bir nonni aniq 3 bo'lakka kesamiz. Slayderni 3 ga qo'ying." },
    audio: { ru: 'Подели две лепёшки на трёх друзей сам. Двигай ползунок и выбери, на сколько равных частей резать каждую лепёшку. Друзей трое, поэтому каждую лепёшку режем на три части, и каждому достаётся две третьих.', uz: "2 ta nonni 3 do'stga o'zingiz bo'ling. Slayderni surib, har bir nonni nechta teng bo'lakka kesishni tanlang. Do'stlar uchta, shuning uchun har bir nonni 3 bo'lakka kesamiz va har biriga uchdan ikki tegadi." }
  },

  // ---- s3 RULE: a ÷ b = a/b ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Разделили на практике. Теперь запишем это правилом.', uz: "Amalda bo'ldik. Endi buni qoida qilib yozamiz." },
    label: { ru: 'Дробь — это деление', uz: "Kasr — bu bo'lish" },
    title: { ru: 'Запись a/b означает «a разделить на b».', uz: "a/b yozuvi «a ni b ga bo'lish» degani." },
    card_top: { ru: 'Числитель (сверху) — что делим: сколько лепёшек.', uz: "Surat (yuqorida) — nimani bo'lamiz: nechta non." },
    card_bottom: { ru: 'Знаменатель (снизу) — на сколько делим: сколько друзей.', uz: "Maxraj (pastda) — nechtaga bo'lamiz: nechta do'st." },
    card_line: { ru: 'Каждому достаётся ровно a/b.', uz: "Har biriga aniq a/b tegadi." },
    outro: { ru: '3 лепёшки на 4 друзей: 3 ÷ 4 = 3/4. Каждому — три четвёртых лепёшки.', uz: "3 ta non 4 do'stga: 3 ÷ 4 = 3/4. Har biriga — nonning to'rtdan uchi." },
    audio: { ru: 'Запомни главное: дробь — это деление. Запись a дробь b означает a разделить на b. Сверху, в числителе, — что делим, сколько лепёшек. Снизу, в знаменателе, — на сколько делим, сколько друзей. Каждому достаётся ровно a дробь b. Три лепёшки на четыре друга — это три разделить на четыре, то есть три четвёртых.', uz: "Asosiysini eslab qoling: kasr — bu bo'lish. a kasr b yozuvi a ni b ga bo'lish degani. Yuqorida, suratda, — nimani bo'lamiz, nechta non. Pastda, maxrajda, — nechtaga bo'lamiz, nechta do'st. Har biriga aniq a kasr b tegadi. 3 ta non 4 do'stga — bu uchni to'rtga bo'lish, ya'ni to'rtdan uch." }
  },

  // ---- s4 TEST (MC, дроби): 4 лепёшки на 5 → 4/5 (correct old idx 1) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Запиши деление дробью', uz: "Bo'lishni kasr bilan yozing" },
    question: { ru: '4 лепёшки разделили поровну между 5 друзьями. Сколько достанется каждому?', uz: "4 ta non 5 ta do'stga teng bo'lindi. Har biriga qancha tegadi?" },
    correct_text: { ru: 'Верно: делим 4 на 5, значит 4 ÷ 5 = 4/5. Каждому — четыре пятых лепёшки.', uz: "To'g'ri: 4 ni 5 ga bo'lamiz, demak 4 ÷ 5 = 4/5. Har biriga — nonning beshdan to'rti." },
    hint_0: { ru: 'Числитель и знаменатель перепутаны: делим 4 (лепёшки) на 5 (друзей), сверху 4, снизу 5.', uz: "Surat va maxraj almashgan: 4 (non) ni 5 (do'st) ga bo'lamiz, yuqorida 4, pastda 5." },
    hint_2: { ru: 'Это значило бы, что каждому достаётся целая лепёшка. Но лепёшек 4, а друзей 5 — каждому меньше целого.', uz: "Bu har biriga butun non degani bo'lardi. Lekin non 4 ta, do'st 5 ta — har biriga butundan kam." },
    hint_3: { ru: 'Снизу — число друзей. Их 5, а не 4.', uz: "Pastda — do'stlar soni. Ular 5 ta, 4 emas." },
    wrong_default: { ru: 'Числитель — что делим (4 лепёшки), знаменатель — на сколько (5 друзей). Это 4/5.', uz: "Surat — nimani bo'lamiz (4 non), maxraj — nechtaga (5 do'st). Bu 4/5." },
    fact: { ru: 'Пчёлы делят соты на равные шестиугольные ячейки — это деление пространства на равные доли в самой природе.', uz: "Asalarilar uyani teng oltburchak katakchalarga bo'ladi — bu tabiatdagi fazoni teng ulushlarga bo'lishdir." },
    audio: {
      intro: { ru: 'Четыре лепёшки разделили поровну между пятью друзьями. Выбери дробь, которая показывает долю каждого.', uz: "4 ta non 5 ta do'stga teng bo'lindi. Har birining ulushini ko'rsatadigan kasrni tanlang." },
      on_correct: { ru: 'Верно. Четыре на пять — это четыре пятых. Кстати, пчёлы тоже делят соты на равные шестиугольные ячейки — равное деление встречается в самой природе.', uz: "To'g'ri. To'rtni beshga — bu beshdan to'rt. Aytgancha, asalarilar ham uyani teng oltburchak katakchalarga bo'ladi — teng bo'lish tabiatning o'zida uchraydi." },
      on_wrong: { ru: 'Пока нет. Сверху — сколько лепёшек, снизу — сколько друзей.', uz: "Hali emas. Yuqorida — nechta non, pastda — nechta do'st." }
    }
  },

  // ---- s5 RULE: порядок важен, 3/4 ≠ 4/3 ----
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Порядок важен', uz: "Tartib muhim" },
    title: { ru: '3/4 и 4/3 — это разные дроби.', uz: "3/4 va 4/3 — har xil kasrlar." },
    card_ok: { ru: '3/4 — это 3 лепёшки на 4 друзей: каждому меньше целой лепёшки.', uz: "3/4 — bu 3 ta non 4 do'stga: har biriga butun nondan kam." },
    card_bad: { ru: '4/3 — это уже 4 лепёшки на 3 друзей: каждому больше целой. Поменяли местами — получилась другая дробь.', uz: "4/3 — bu endi 4 ta non 3 do'stga: har biriga butundan ko'p. O'rni almashdi — boshqa kasr chiqdi." },
    outro: { ru: 'Сверху — что делим, снизу — на сколько. Эти два числа нельзя менять местами.', uz: "Yuqorida — nimani bo'lamiz, pastda — nechtaga. Bu ikki sonni o'rni bilan almashtirib bo'lmaydi." },
    audio: { ru: 'Порядок в дроби важен. Три четвёртых — это три лепёшки на четыре друга, каждому меньше целой. А четыре третьих — это четыре лепёшки на три друга, каждому больше целой. Сверху всегда то, что делим, а снизу — на сколько делим. Поменяешь их местами — получится совсем другая дробь.', uz: "Kasrdagi tartib muhim. To'rtdan uch — bu 3 ta non 4 do'stga, har biriga butundan kam. Uchdan to'rt esa — bu 4 ta non 3 do'stga, har biriga butundan ko'p. Yuqorida doim nimani bo'lsak o'sha, pastda esa nechtaga bo'lganimiz turadi. Ularning o'rnini almashtirsangiz, butunlay boshqa kasr chiqadi." }
  },

  // ---- s6 TEST (классификация tap): каждому меньше / больше целой лепёшки ----
  s6: {
    eyebrow: { ru: 'Тренировка · сортировка', uz: "Mashq · saralash" },
    title: { ru: 'Меньше или больше целой?', uz: "Butundan kammi yoki ko'pmi?" },
    lead: { ru: 'Каждому достанется меньше целой лепёшки или больше? Отправь в свою корзину. Считать точно не нужно.', uz: "Har biriga butun nondan kam tegadimi yoki ko'p? O'z savatiga joylang. Aniq hisoblash shart emas." },
    bin_eq: { ru: 'Каждому меньше целой', uz: "Har biriga butundan kam" },
    bin_uneq: { ru: 'Каждому больше целой', uz: "Har biriga butundan ko'p" },
    ask: { ru: 'В какую корзину? Тапни.', uz: "Qaysi savatga? Bosing." },
    hint_wrong: { ru: 'Сравни: если лепёшек меньше, чем друзей — каждому меньше целой; если больше — больше целой.', uz: "Solishtiring: non do'stdan kam bo'lsa — har biriga butundan kam; ko'p bo'lsa — butundan ko'p." },
    correct_text: { ru: 'Верно! Лепёшек меньше, чем друзей — каждому меньше целой. Лепёшек больше — каждому больше целой.', uz: "To'g'ri! Non do'stdan kam — har biriga butundan kam. Non ko'p — har biriga butundan ko'p." },
    audio: {
      intro: { ru: 'Распредели по корзинам: где каждому достанется меньше целой лепёшки, а где больше. Считать точно не нужно. Сравни число лепёшек и число друзей.', uz: "Savatlarga ajrating: qayerda har biriga butun nondan kam tegadi, qayerda ko'p. Aniq hisoblash shart emas. Non va do'stlar sonini solishtiring." },
      on_correct: { ru: 'Верно. Если делим меньшее число на большее — каждому меньше целой.', uz: "To'g'ri. Kichik sonni kattaga bo'lsak — har biriga butundan kam." },
      on_wrong: { ru: 'Сравни: лепёшек меньше, чем друзей, или больше?', uz: "Solishtiring: non do'stdan kammi yoki ko'pmi?" }
    }
  },

  // ---- s7 TEST (MC, текст): «3 меньше 4 — не делится»? Нет, можно (correct old idx 0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Делится ли меньшее на большее?', uz: "Kichikni kattaga bo'lsa bo'ladimi?" },
    question: { ru: 'Кто-то говорит: «3 на 4 не делится, ведь 3 меньше 4». Это так?', uz: "Kimdir aytadi: «3 ni 4 ga bo'lib bo'lmaydi, axir 3 kichik 4 dan». Shundaymi?" },
    opt0: { ru: 'Неверно — делится, каждому достаётся 3/4 (меньше целой лепёшки)', uz: "Noto'g'ri — bo'linadi, har biriga 3/4 tegadi (butun nondan kam)" },
    opt1: { ru: 'Верно — меньшее на большее не делится', uz: "To'g'ri — kichikni kattaga bo'lib bo'lmaydi" },
    opt2: { ru: 'Делится, но каждому достаётся целая лепёшка', uz: "Bo'linadi, lekin har biriga butun non tegadi" },
    opt3: { ru: 'Делится только с остатком, дробь тут ни при чём', uz: "Faqat qoldiq bilan bo'linadi, kasrning unga aloqasi yo'q" },
    correct_text: { ru: 'Верно: 3 на 4 делится, просто ответ — дробь. Каждому достаётся 3/4 лепёшки, это меньше целой.', uz: "To'g'ri: 3 ni 4 ga bo'lsa bo'ladi, faqat javob — kasr. Har biriga 3/4 non tegadi, bu butundan kam." },
    hint_1: { ru: 'Лепёшку же можно разрезать. Делим на 4 части — каждому по 3 кусочка, это три четвёртых.', uz: "Nonni kessa bo'ladi-ku. 4 bo'lakka bo'lamiz — har biriga 3 bo'lakdan, bu to'rtdan uch." },
    hint_2: { ru: 'Лепёшек 3, а друзей 4 — целой на каждого не хватит. Каждому три четвёртых, меньше целой.', uz: "Non 3 ta, do'st 4 ta — har biriga butun yetmaydi. Har biriga to'rtdan uch, butundan kam." },
    hint_3: { ru: 'Как раз при том, что нацело не делится, и появляется дробь: три разделить на четыре это три четвёртых.', uz: "Aynan butun bo'linmaganda kasr paydo bo'ladi: uchni to'rtga bo'lsak, to'rtdan uch chiqadi." },
    wrong_default: { ru: '3 на 4 делится, ответ — дробь 3/4. Каждому меньше целой лепёшки.', uz: "3 ni 4 ga bo'lsa bo'ladi, javob — 3/4 kasri. Har biriga butun nondan kam." },
    fact: { ru: 'В Древнем Египте, чтобы поделить хлеб и зерно поровну, пользовались особыми таблицами деления — для писцов деление и было записью дроби.', uz: "Qadimgi Misrda nonni va donni teng bo'lish uchun maxsus bo'lish jadvallaridan foydalanilgan — mirzalar uchun bo'lishning o'zi kasr yozuvi edi." },
    audio: {
      intro: { ru: 'Кто-то говорит, что три на четыре не делится, ведь три меньше четырёх. Так ли это? Выбери ответ.', uz: "Kimdir aytadi: 3 ni 4 ga bo'lib bo'lmaydi, axir 3 kichik. Shundaymi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Делится — каждому достаётся три четвёртых, меньше целой. Кстати, в Древнем Египте хлеб и зерно делили поровну по особым таблицам деления — деление там и было записью дроби.', uz: "To'g'ri. Bo'linadi — har biriga to'rtdan uch tegadi, butundan kam. Aytgancha, qadimgi Misrda non va don maxsus bo'lish jadvallari bo'yicha teng bo'lingan — bo'lishning o'zi kasr yozuvi edi." },
      on_wrong: { ru: 'Посмотри ещё раз: лепёшку можно разрезать, поэтому ответ — дробь.', uz: "Yana qarang: nonni kessa bo'ladi, shuning uchun javob — kasr." }
    }
  },

  // ---- s_seq TEST (SeqMC): 5 примеров — запиши деление дробью (порядок важен; сложнее) ----
  s_seq: {
    eyebrow: { ru: 'Тренировка · запиши дробью', uz: "Mashq · kasr bilan yozing" },
    title: { ru: 'Запиши деление дробью', uz: "Bo'lishni kasr bilan yozing" },
    lead: { ru: 'Пять делений. Сверху — что делим, снизу — на сколько. Порядок важен!', uz: "Beshta bo'lish. Yuqorida — nimani bo'lamiz, pastda — nechtaga. Tartib muhim!" },
    bridge: { ru: 'Правило знаем. Теперь быстро запишем пять делений дробью.', uz: "Qoidani bilamiz. Endi beshta bo'lishni tez kasr bilan yozamiz." },
    questions: [
      {
        q: { ru: '3 ÷ 5', uz: '3 ÷ 5' },
        say: { ru: 'Три разделить на пять. Какая дробь?', uz: "Uchni beshga bo'lish. Qaysi kasr?" },
        opts: [{ ru: '3/5', uz: '3/5' }, { ru: '5/3', uz: '5/3' }, { ru: '8', uz: '8' }],
        correct: 0,
        ok: { ru: 'Верно: 3 ÷ 5 = 3/5.', uz: "To'g'ri: 3 ÷ 5 = 3/5." },
        no: { ru: 'Сверху то, что делим, снизу — на сколько делим.', uz: "Yuqorida nimani bo'lsak o'sha, pastda nechtaga bo'lganimiz." }
      },
      {
        q: { ru: '5 ÷ 6', uz: '5 ÷ 6' },
        say: { ru: 'Пять разделить на шесть.', uz: "Beshni oltiga bo'lish." },
        opts: [{ ru: '6/5', uz: '6/5' }, { ru: '5/6', uz: '5/6' }, { ru: '11', uz: '11' }],
        correct: 1,
        ok: { ru: 'Верно: 5 ÷ 6 = 5/6.', uz: "To'g'ri: 5 ÷ 6 = 5/6." },
        no: { ru: 'Делить — это не складывать. Сверху делимое, снизу делитель.', uz: "Bo'lish — qo'shish emas. Yuqorida bo'linuvchi, pastda bo'luvchi." }
      },
      {
        q: { ru: '4 ÷ 7', uz: '4 ÷ 7' },
        say: { ru: 'Четыре разделить на семь.', uz: "To'rtni yettiga bo'lish." },
        opts: [{ ru: '4/7', uz: '4/7' }, { ru: '7/4', uz: '7/4' }, { ru: '3', uz: '3' }],
        correct: 0,
        ok: { ru: 'Верно: 4 ÷ 7 = 4/7.', uz: "To'g'ri: 4 ÷ 7 = 4/7." },
        no: { ru: 'Сверху делимое четыре, снизу делитель семь.', uz: "Yuqorida bo'linuvchi to'rt, pastda bo'luvchi yetti." }
      },
      {
        q: { ru: '7 ÷ 4', uz: '7 ÷ 4' },
        say: { ru: 'А теперь наоборот: семь разделить на четыре.', uz: "Endi aksincha: yettini to'rtga bo'lish." },
        opts: [{ ru: '4/7', uz: '4/7' }, { ru: '7/4', uz: '7/4' }, { ru: '28', uz: '28' }],
        correct: 1,
        ok: { ru: 'Верно: 7 ÷ 4 = 7/4. Видишь, порядок поменялся — дробь другая.', uz: "To'g'ri: 7 ÷ 4 = 7/4. Ko'rdingizmi, tartib o'zgardi — kasr boshqacha." },
        no: { ru: 'Здесь делим семь на четыре, значит сверху семь.', uz: "Bu yerda yettini to'rtga bo'lamiz, demak yuqorida yetti." }
      },
      {
        q: { ru: '2 ÷ 9', uz: '2 ÷ 9' },
        say: { ru: 'Последнее: два разделить на девять.', uz: "Oxirgisi: ikkini to'qqizga bo'lish." },
        opts: [{ ru: '9/2', uz: '9/2' }, { ru: '2/9', uz: '2/9' }, { ru: '7', uz: '7' }],
        correct: 1,
        ok: { ru: 'Верно: 2 ÷ 9 = 2/9.', uz: "To'g'ri: 2 ÷ 9 = 2/9." },
        no: { ru: 'Сверху делимое два, снизу делитель девять.', uz: "Yuqorida bo'linuvchi ikki, pastda bo'luvchi to'qqiz." }
      }
    ],
    audio: {
      intro: { ru: 'Запиши каждое деление дробью. Сверху то, что делим, снизу — на сколько делим. Порядок важен.', uz: "Har bir bo'lishni kasr bilan yozing. Yuqorida nimani bo'lsak o'sha, pastda nechtaga. Tartib muhim." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Сверху делимое, снизу делитель.', uz: "Deyarli. Yuqorida bo'linuvchi, pastda bo'luvchi." },
      on_done: { ru: 'Отлично, все пять делений записаны верно.', uz: "Zo'r, beshala bo'lish to'g'ri yozildi." }
    }
  },

  // ---- s8 CASE setup: Камола разливает 3 литра сока в 4 стакана ----
  s8: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    bridge: { ru: 'Деление по-настоящему повсюду. Поможем Камоле с соком.', uz: "Bo'lish hayotda hamma joyda. Kamolaga sharbatda yordam beramiz." },
    title: { ru: 'Камола разливает сок по стаканам.', uz: "Kamola sharbatni stakanlarga quyadi." },
    body_p1: { ru: 'У Камолы 3 литра сока. Она хочет разлить его поровну в 4 одинаковых стакана. Сколько сока попадёт в каждый стакан?', uz: "Kamolada 3 litr sharbat bor. U uni 4 ta bir xil stakanga teng quymoqchi. Har bir stakanga qancha sharbat tushadi?" },
    card_line_label: { ru: 'Сока', uz: "Sharbat" },
    card_line_value: { ru: '3 литра', uz: "3 litr" },
    card_parts_label: { ru: 'Стаканов', uz: "Stakanlar" },
    card_parts_value: { ru: '4 одинаковых', uz: "4 ta bir xil" },
    outro: { ru: 'Это деление: 3 литра разделить на 4 стакана. Помоги Камоле на следующем шаге.', uz: "Bu — bo'lish: 3 litrni 4 stakanga bo'lish. Keyingi bosqichda Kamolaga yordam bering." },
    btn_help: { ru: 'Помочь Камоле', uz: "Kamolaga yordam berish" },
    audio: { ru: 'У Камолы три литра сока, и она разливает его поровну в четыре одинаковых стакана. Сколько сока попадёт в каждый стакан? Это деление: три литра разделить на четыре. Подумай, какая получится дробь.', uz: "Kamolada 3 litr sharbat bor va u uni 4 ta bir xil stakanga teng quyadi. Har bir stakanga qancha sharbat tushadi? Bu — bo'lish: 3 litrni 4 ga bo'lish. Qanday kasr chiqishini o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, дроби): 3 литра на 4 стакана → 3/4 (correct old idx 1) ----
  s9: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    label: { ru: 'Сколько в стакане?', uz: "Stakanda qancha?" },
    question: { ru: '3 литра сока разлили поровну в 4 стакана. Сколько литра в каждом стакане?', uz: "3 litr sharbat 4 stakanga teng quyildi. Har bir stakanda necha litr?" },
    correct_text: { ru: 'Верно: 3 литра на 4 стакана — это 3 ÷ 4 = 3/4. В каждом стакане три четвёртых литра.', uz: "To'g'ri: 3 litr 4 stakanga — bu 3 ÷ 4 = 3/4. Har bir stakanda litrning to'rtdan uchi." },
    hint_0: { ru: 'Числа перепутаны: делим 3 (литра) на 4 (стакана), сверху 3, снизу 4.', uz: "Sonlar almashgan: 3 (litr) ni 4 (stakan) ga bo'lamiz, yuqorida 3, pastda 4." },
    hint_2: { ru: 'Это означало бы 3 целых литра в стакане. Но литров всего 3, а стаканов 4.', uz: "Bu stakanda 3 butun litr degani bo'lardi. Lekin litr jami 3 ta, stakan 4 ta." },
    hint_3: { ru: 'Это означало бы 1 литр на 4 стакана. А литров у нас 3.', uz: "Bu 1 litr 4 stakanga degani. Bizda esa litr 3 ta." },
    wrong_default: { ru: 'Числитель — сколько литров (3), знаменатель — сколько стаканов (4). Это 3/4.', uz: "Surat — necha litr (3), maxraj — nechta stakan (4). Bu 3/4." },
    audio: {
      intro: { ru: 'Три литра сока разлили поровну в четыре стакана. Сколько литра в каждом стакане? Выбери дробь.', uz: "3 litr sharbat 4 stakanga teng quyildi. Har bir stakanda necha litr? Kasrni tanlang." },
      on_correct: { ru: 'Верно. Три литра на четыре стакана — три четвёртых литра в каждом.', uz: "To'g'ri. 3 litr 4 stakanga — har birida litrning to'rtdan uchi." },
      on_wrong: { ru: 'Пока нет. Сверху — сколько литров, снизу — сколько стаканов.', uz: "Hali emas. Yuqorida — necha litr, pastda — nechta stakan." }
    }
  },

  // ---- s10 TEST (error-spotting): какое утверждение про 3/4 литра НЕВЕРНО (correct old idx 2) ----
  s10: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    label: { ru: 'Найди неверное', uz: "Noto'g'risini toping" },
    title: { ru: 'Одно утверждение неверно', uz: "Bitta izoh noto'g'ri" },
    question: { ru: 'В каждом стакане 3/4 литра. Три утверждения верны, а одно — нет. Какое НЕВЕРНО?', uz: "Har bir stakanda 3/4 litr. Uchta izoh to'g'ri, bittasi esa — yo'q. Qaysi biri NOTO'G'RI?" },
    opt0: { ru: '3 литра разделили на 4 стакана.', uz: "3 litr 4 stakanga bo'lindi." },
    opt1: { ru: 'В каждом стакане меньше целого литра.', uz: "Har bir stakanda 1 butun litrdan kam." },
    opt2: { ru: 'В каждом стакане ровно 3 литра.', uz: "Har bir stakanda aniq 3 litr bor." },
    opt3: { ru: 'Сверху — литры, снизу — стаканы.', uz: "Yuqorida — litrlar, pastda — stakanlar." },
    correct_text: { ru: 'Верно, это утверждение неверно: всего сока 3 литра на 4 стакана, поэтому в каждом 3/4 литра — меньше целого, а не 3 литра.', uz: "To'g'ri, bu izoh noto'g'ri: sharbat jami 3 litr 4 stakanga, shuning uchun har birida 3/4 litr — butundan kam, 3 litr emas." },
    wrong_0: { ru: 'Это утверждение верно: именно 3 литра делят на 4 стакана. Ищи неверное дальше.', uz: "Bu izoh to'g'ri: aynan 3 litr 4 stakanga bo'linadi. Noto'g'risini boshqasidan qidiring." },
    wrong_1: { ru: 'Это верно: три четвёртых литра меньше целого. Ищи неверное дальше.', uz: "Bu to'g'ri: to'rtdan uch litr butundan kam. Noto'g'risini boshqasidan qidiring." },
    wrong_3: { ru: 'Это верно: сверху литры (3), снизу стаканы (4). Ищи неверное дальше.', uz: "Bu to'g'ri: yuqorida litrlar (3), pastda stakanlar (4). Noto'g'risini boshqasidan qidiring." },
    wrong_default: { ru: 'Всего сока 3 литра, поэтому в стакане не 3 литра, а 3/4. Ищи такое утверждение.', uz: "Sharbat jami 3 litr, shuning uchun stakanda 3 litr emas, 3/4. Shunday izohni qidiring." },
    audio: {
      intro: { ru: 'Три утверждения про три четвёртых литра верны, а одно неверно. Найди то, которое говорит неправду.', uz: "Litrning to'rtdan uchi haqida uchta izoh to'g'ri, bittasi noto'g'ri. Yolg'on aytayotganini toping." },
      on_correct: { ru: 'Верно. Всего три литра на четыре стакана, в каждом меньше целого, а не три литра.', uz: "To'g'ri. Jami uch litr to'rt stakanga, har birida butundan kam, uch litr emas." },
      on_wrong: { ru: 'Это утверждение верно. Ищи то, что говорит про целые литры в стакане.', uz: "Bu izoh to'g'ri. Stakanda butun litrlar haqida gapirayotganini qidiring." }
    }
  },

  // ---- s11 TEST (MC, дроби): 1 лепёшка на 4 → 1/4 (correct old idx 1) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — запиши дробью', uz: "Oxirgisi — kasr bilan yozing" },
    question: { ru: '1 лепёшку разделили поровну на 4 друзей. Сколько достанется каждому?', uz: "1 ta non 4 do'stga teng bo'lindi. Har biriga qancha tegadi?" },
    correct_text: { ru: 'Верно: 1 на 4 — это 1 ÷ 4 = 1/4. Каждому по одной четвёртой лепёшки.', uz: "To'g'ri: 1 ni 4 ga — bu 1 ÷ 4 = 1/4. Har biriga nonning to'rtdan biri." },
    hint_0: { ru: 'Числа перепутаны: делим 1 (лепёшку) на 4 (друзей), сверху 1, снизу 4.', uz: "Sonlar almashgan: 1 (non) ni 4 (do'st) ga bo'lamiz, yuqorida 1, pastda 4." },
    hint_2: { ru: 'Это один на три. А друзей 4.', uz: "Bu 1 ni 3 ga degani. Do'st esa 4 ta." },
    hint_3: { ru: 'Это половина. А делим на 4, значит получается четверть.', uz: "Bu yarim. Biz esa 4 ga bo'lamiz, demak chorak chiqadi." },
    wrong_default: { ru: 'Числитель — что делим (1 лепёшка), знаменатель — на сколько (4 друга). Это 1/4.', uz: "Surat — nimani bo'lamiz (1 non), maxraj — nechtaga (4 do'st). Bu 1/4." },
    fact: { ru: 'Когда файл качают сразу с нескольких серверов, нагрузку делят между ними поровну — это тоже деление, и доля каждого сервера записывается дробью.', uz: "Fayl bir nechta serverdan yuklanganda, yuklama ular o'rtasida teng bo'linadi — bu ham bo'lish, va har bir serverning ulushi kasr bilan yoziladi." },
    audio: {
      intro: { ru: 'Последнее задание. Одну лепёшку разделили поровну на четырёх друзей. Сколько достанется каждому? Выбери дробь.', uz: "Oxirgi topshiriq. 1 ta non 4 do'stga teng bo'lindi. Har biriga qancha tegadi? Kasrni tanlang." },
      on_correct: { ru: 'Верно. Одна лепёшка на четыре — это одна четвёртая. Кстати, когда файл качают сразу с нескольких серверов, нагрузку тоже делят между ними поровну — доля каждого сервера это дробь.', uz: "To'g'ri. 1 ta non 4 ga — bu to'rtdan bir. Aytgancha, fayl bir nechta serverdan yuklanganda, yuklama ham ular o'rtasida teng bo'linadi — har bir serverning ulushi kasr." },
      on_wrong: { ru: 'Пока нет. Сверху — сколько лепёшек, снизу — сколько друзей.', uz: "Hali emas. Yuqorida — nechta non, pastda — nechta do'st." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    score_caption: { ru: 'вопросов решено верно с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob berdingiz" },
    title: { ru: 'Теперь дробь для тебя — это деление.', uz: "Endi kasr siz uchun — bu bo'lish." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Дробь — это деление: a/b означает «a разделить на b».', uz: "Kasr — bu bo'lish: a/b «a ni b ga bo'lish» degani." },
    main_2: { ru: 'Числитель (сверху) — что делим, знаменатель (снизу) — на сколько делим.', uz: "Surat (yuqorida) — nimani bo'lamiz, maxraj (pastda) — nechtaga bo'lamiz." },
    main_3: { ru: 'Меньшее можно делить на большее — получится дробь меньше целого. Каждому достаётся a/b.', uz: "Kichikni kattaga bo'lsa bo'ladi — butundan kichik kasr chiqadi. Har biriga a/b tegadi." },
    main_4: { ru: 'Порядок важен: 3/4 и 4/3 — разные дроби.', uz: "Tartib muhim: 3/4 va 4/3 — har xil kasrlar." },
    back_to_hook: { ru: '3 лепёшки на 4 друзей разделились поровну — каждому по 3/4. Улугбек ошибался: делить можно, ответ просто стал дробью.', uz: "3 ta non 4 do'stga teng bo'lindi — har biriga 3/4 dan. Ulug'bek xato qilgan ekan: bo'lsa bo'larkan, javob shunchaki kasr bo'ldi." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Что такое дробь», «Дробь на прямой», «Деление уголком».', uz: "«Kasr nima», «Kasr sonlar nurida», «Burchak usulida bo'lish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сравнение дробей с одинаковым знаменателем.', uz: "bir xil maxrajli kasrlarni taqqoslash." },
    audio: { ru: 'Отлично! Теперь ты знаешь: дробь — это деление. Запись a дробь b означает a разделить на b. Сверху — что делим, снизу — на сколько. Меньшее можно делить на большее, и тогда получается дробь меньше целого. А порядок важен: три четвёртых и четыре третьих — разные дроби. Три лепёшки на четыре друга разделились поровну, каждому по три четвёртых. Улугбек ошибался: делить можно.', uz: "Zo'r! Endi bilasiz: kasr — bu bo'lish. a kasr b yozuvi a ni b ga bo'lish degani. Yuqorida — nimani bo'lamiz, pastda — nechtaga. Kichikni kattaga bo'lsa bo'ladi va shunda butundan kichik kasr chiqadi. Tartib esa muhim: to'rtdan uch va uchdan to'rt — har xil kasrlar. 3 ta non 4 do'stga teng bo'lindi, har biriga to'rtdan uchdan. Ulug'bek xato qilgan ekan: bo'lsa bo'larkan." }
  }
};

// ============================================================
// ClassifyShare (s6) — ketma-ket tasniflash: bo'lish vaziyati → har biriga butundan kam/ko'p.
// Веди-до-верного, scored. Tartib HAR seansda random (Fisher-Yates, useState init).
// ============================================================
const S6_CARDS = [
  // oson (aniq)
  { label: '3 ÷ 4', bin: 'lt' },
  { label: '5 ÷ 4', bin: 'gt' },
  { label: '2 ÷ 5', bin: 'lt' },
  { label: '7 ÷ 3', bin: 'gt' },
  { label: '1 ÷ 2', bin: 'lt' },
  { label: '9 ÷ 4', bin: 'gt' },
  // qiyin (1 ga yaqin — surat va maxraj bir-biriga yaqin)
  { label: '5 ÷ 6', bin: 'lt' },
  { label: '7 ÷ 6', bin: 'gt' },
  { label: '8 ÷ 9', bin: 'lt' },
  { label: '9 ÷ 8', bin: 'gt' }
];
const S6_BINS = [{ key: 'lt' }, { key: 'gt' }];
const ClassifyShare = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
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
            : <><span className="sort-tray-card" key={idx}>{cur.label}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {S6_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key === 'lt' ? 'sq' : 'cu'}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h">{b.key === 'lt' ? mt(t(c.bin_eq)) : mt(t(c.bin_uneq))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{deck[i].label}</span>)}
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
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
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
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <SharingBoard loaves={3} people={4} reveal={0} showShare={false} size={62}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}>3</span>
            <Op>÷</Op>
            <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}>4</span>
            <span className="mop" style={{ color: T.ink3 }}>= ?</span>
          </div>
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

// s1 — EXPLORATION step-by-step: делим 3 на 4. (top-align + Bridge)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const reveal = step >= 3 ? 3 : step >= 2 ? 1 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', justifyContent: 'center', minHeight: 170 }}>
          <SharingBoard loaves={3} people={4} reveal={reveal} showShare={step >= 3} size={64}/>
          {step >= 3 && (<p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>)}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider + check: подели 2 на 3. (top-align)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [people, setPeople] = useState(2);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const onSlider = (v) => { if (solved) return; setChecked(false); setPeople(v); };
  const check = () => {
    const ok = people === 3;
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
          <SharingBoard loaves={2} people={people} reveal={solved ? 3 : 1} showShare={solved} size={62}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {people}</p>
            <Slider value={people} min={2} max={6} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: a ÷ b = a/b. (top-align + Bridge)
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
          <SharingBoard loaves={3} people={4} reveal={3} size={60}/>
          <div style={{ display: 'flex', justifyContent: 'center' }}><DivExpr a={3} b={4} size="display"/></div>
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

// s4 — TEST choice (дроби): 4 на 5 → 4/5 (correct old idx 1).
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="5" d="4" size="mid"/>, <Frac n="4" d="5" size="mid"/>, <Frac n="4" d="4" size="mid"/>, <Frac n="1" d="5" size="mid"/>], 1, [0, 2, 3, 1]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><SharingBoard loaves={4} people={5} reveal={1} showShare={false} size={54}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimHive/>}/>}/>;
};

// s5 — RULE: порядок важен, 3/4 ≠ 4/3. (top-align)
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(18px, 6vw, 50px)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Frac n="3" d="4" size="display"/>
              <span className="small mono" style={{ color: T.success }}>3 → 4</span>
            </div>
            <span className="mop" style={{ color: T.ink3, fontSize: 'clamp(18px, 3vw, 26px)' }}>≠</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Frac n="4" d="3" size="display"/>
              <span className="small mono" style={{ color: T.ink3 }}>4 → 3</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{mt(t(c.card_ok))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_bad))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — TEST классификация (меньше / больше целой).
const Screen6 = (props) => <ClassifyShare {...props}/>;

// s7 — TEST choice (текст): «меньшее на большее не делится»? Нет, можно (correct old idx 0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimEgypt/>}/>}/>;
};

// s_seq — TEST: 5 примеров «запиши деление дробью» (tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — CASE setup: Камола, сок. (top-align + Bridge)
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <SharingBoard loaves={3} people={4} reveal={0} showShare={false} size={44}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (дроби): 3 литра на 4 стакана → 3/4 (correct old idx 1).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="4" d="3" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="3" d="1" size="mid"/>, <Frac n="1" d="4" size="mid"/>], 1, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><SharingBoard loaves={3} people={4} reveal={3} size={44}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — TEST error-spotting: какое утверждение про 3/4 литра НЕВЕРНО (correct old idx 2).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — TEST choice (дроби): 1 на 4 → 1/4 (correct old idx 1).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="4" d="1" size="mid"/>, <Frac n="1" d="4" size="mid"/>, <Frac n="1" d="3" size="mid"/>, <Frac n="1" d="2" size="mid"/>], 1, [2, 3, 1, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><SharingBoard loaves={1} people={4} reveal={3} size={44}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimServers/>}/>}/>;
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
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}><SharingBoard loaves={3} people={4} reveal={3} size={50}/></div>
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
export default function FractionDivisionLesson({
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

/* === SORT / классификация === */
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

/* === BRIDGE === */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* === SharingBoard (делёж лепёшек) === */
.sb-loaf { animation: sbLoafIn 0.42s cubic-bezier(0.34, 1.2, 0.64, 1) backwards; }
@keyframes sbLoafIn { from { opacity: 0; transform: scale(0.55) rotate(-12deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
.sb-slice { transition: fill-opacity 0.45s ease; }
.sb-plate { animation: sbPlateIn 0.5s ease-out backwards; }
@keyframes sbPlateIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* === FACT-АНИМАЦИИ (синяя тема) === */
.fd-egy { display: flex; flex-direction: column; gap: 5px; width: clamp(84px, 16vw, 110px); }
.fd-egy-row { display: flex; gap: 3px; }
.fd-egy-c { flex: 1; height: clamp(9px, 2vw, 12px); border-radius: 2px; background: #019ACB; opacity: 0.18; animation: fdEgy 2.6s ease-in-out infinite; }
@keyframes fdEgy { 0%, 100% { opacity: 0.15; } 45% { opacity: 0.92; } }
.fd-hex { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: clamp(70px, 14vw, 92px); }
.fd-hex-c { aspect-ratio: 1; background: #019ACB; opacity: 0.2; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); animation: fdHex 2.4s ease-in-out infinite; }
.fd-hex-c:nth-child(2) { transform: translateY(50%); }
.fd-hex-c:nth-child(5) { transform: translateY(50%); }
@keyframes fdHex { 0%, 100% { opacity: 0.16; } 50% { opacity: 0.95; } }
.fd-srv { display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(70px, 14vw, 96px); }
.fd-srv-stream { width: clamp(40px, 9vw, 60px); height: 6px; border-radius: 3px; background: #019ACB; opacity: 0.55; animation: fdStream 1.8s ease-in-out infinite; }
.fd-srv-rack { display: flex; gap: 6px; width: 100%; justify-content: center; }
.fd-srv-node { width: clamp(16px, 4vw, 24px); height: clamp(20px, 5vw, 30px); border-radius: 3px; background: #019ACB; opacity: 0.2; animation: fdNode 2.1s ease-in-out infinite; }
@keyframes fdStream { 0%, 100% { opacity: 0.3; transform: scaleX(0.6); } 50% { opacity: 0.85; transform: scaleX(1); } }
@keyframes fdNode { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.9; } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;



