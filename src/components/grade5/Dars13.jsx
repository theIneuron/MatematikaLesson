import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сравнение дробей с одинаковым числителем — frac_5_05
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C (etalon: Dars28). s6 → упорядочивание по возрастанию (tap-in-order, по значению),
// s10 → error-spotting, s_seq → 5 примеров «поставь знак». Top-align, Bridge, shuffleMC. Сохранён flip-card s5.

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
// Tarix (lepyoshkani ulashish): bir xil non ko'proq kishiga bo'linadi — mayda-mayda.
const AnimShare = () => (
  <div className="fa-share" aria-hidden="true">
    <span className="fa-share-d fa-share-1"/>
    <span className="fa-share-d fa-share-2"/>
    <span className="fa-share-d fa-share-3"/>
  </div>
);
// Fan (olmani bo'lish): doira ko'proq bo'lakka maydalanadi.
const AnimApple = () => (
  <div className="fa-apple" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className="fa-apple-s" style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${i * 0.12}s` }}/>
    ))}
  </div>
);
// IT (piksel): bir xil ekran ko'proq pikselga bo'linadi.
const AnimPixel = () => (
  <div className="fa-px" aria-hidden="true">
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} className="fa-px-c" style={{ animationDelay: `${(i % 4 + Math.floor(i / 4)) * 0.12}s` }}/>
    ))}
  </div>
);

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ — FracBar / FractionWall (стена дробей)
// ============================================================
const FracBar = ({ num, den, color = T.accent, height = 34, marker = false, winner = false, animateIn = false }) => {
  const pct = (num / den) * 100;
  const ease = 'cubic-bezier(0.34, 1.1, 0.64, 1)';
  return (
    <div className="fw-bar" style={{ position: 'relative', width: '100%', height, borderRadius: 8, background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
        <div className={`fw-fill${animateIn ? ' fw-grow' : ''}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, transition: `width 0.5s ${ease}` }}/>
        {Array.from({ length: den - 1 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${((i + 1) / den) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg }}/>
        ))}
      </div>
      {marker && num > 0 && (
        <div className={`fw-marker${animateIn ? ' fw-slide' : ''}`} style={{ position: 'absolute', left: `${pct}%`, top: -5, bottom: -5, width: 3, marginLeft: -1.5, background: color, borderRadius: 2, boxShadow: `0 0 7px ${color}`, transition: `left 0.5s ${ease}` }}>
          {winner && (
            <svg className="fw-flag" width="18" height="16" viewBox="0 0 18 16" style={{ position: 'absolute', top: -15, left: 1, overflow: 'visible' }}>
              <path d="M1 1 L14 4 L1 8 Z" fill={color}/>
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

const FractionWall = ({ rows, marker = false, winnerDen = null, animateIn = true, height = 32 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 520, margin: '0 auto' }}>
    {rows.map((r, i) => {
      const isWin = winnerDen === r.den;
      return (
        <div key={r.den} className="fw-row" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)', animationDelay: `${i * 0.09}s` }}>
          <div style={{ width: 'clamp(40px, 9vw, 54px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n={String(r.num)} d={String(r.den)} size="sm"/></div>
          <div style={{ flex: 1 }}><FracBar num={r.num} den={r.den} color={isWin ? T.accent : T.blue} marker={marker} winner={isWin} animateIn={animateIn} height={height}/></div>
        </div>
      );
    })}
  </div>
);

// ============================================================
// --- POD UROK: frac_5_05 — Сравнение дробей с одинаковым числителем ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-05-v1',
  lessonTitle: { ru: 'Сравнение дробей с одинаковым числителем', uz: "Bir xil suratli kasrlarni taqqoslash" }
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
  // ---- s0 HOOK: Эльдор (1/3) и Темур (1/5) делят одинаковый интернет-пакет ----
  s0: {
    eyebrow: { ru: 'Сравнение дробей · вступление', uz: "Kasrlarni taqqoslash · kirish" },
    title: { ru: 'Эльдор и Темур купили одинаковый интернет-пакет и делят его поровну между своими устройствами.', uz: "Eldor va Temur bir xil internet paketini sotib olib, uni qurilmalari o'rtasida teng ulashadi." },
    body: { ru: 'У Эльдора 3 устройства — каждому достаётся 1/3 пакета. У Темура 5 устройств — каждому 1/5. Темур хвастается: «у меня устройств больше, 5 — значит каждому достаётся больше интернета, 1/5 больше 1/3!».', uz: "Eldorda 3 ta qurilma — har biriga paketning 1/3 qismi tegadi. Temurda 5 ta qurilma — har biriga 1/5. Temur maqtanadi: «menda qurilma ko'p, 5 ta — demak har biriga ko'proq internet tegadi, 1/5 katta 1/3 dan!»." },
    question: { ru: 'А ты как думаешь: на одно устройство больше интернета у 1/3 или у 1/5?', uz: "Sizningcha-chi: bitta qurilmaga ko'proq internet 1/3 da-mi yoki 1/5 da-mi?" },
    opt0: { ru: '1/3 больше — у Эльдора устройств меньше, каждому достаётся больше', uz: "1/3 katta — Eldorda qurilma kam, har biriga ko'proq tegadi" },
    opt1: { ru: '1/5 больше — ведь 5 больше 3', uz: "1/5 katta — axir 5 katta 3 dan" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Эльдор и Темур купили одинаковый интернет-пакет и делят его поровну между устройствами. У Эльдора три устройства, каждому достаётся одна третья. У Темура пять устройств, каждому одна пятая. Темур говорит, что у него устройств больше, поэтому каждому достаётся больше. А ты как думаешь — на одно устройство больше интернета у одной третьей или у одной пятой? Выбери ответ.', uz: "Eldor va Temur bir xil internet paketini sotib olib, uni qurilmalari o'rtasida teng ulashadi. Eldorda 3 ta qurilma, har biriga uchdan bir tegadi. Temurda 5 ta qurilma, har biriga beshdan bir. Temur aytadiki, unda qurilma ko'p, shuning uchun har biriga ko'proq tegadi. Sizningcha, bitta qurilmaga ko'proq internet uchdan birda-mi yoki beshdan birda-mi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): стена дробей 1/2, 1/3, 1/4 ----
  s1: {
    eyebrow: { ru: 'Стена дробей', uz: "Kasr devori" },
    title: { ru: 'Соберём «стену дробей» по шагам', uz: "«Kasr devori»ni bosqichma-bosqich yig'amiz" },
    bridge: { ru: 'Темур сказал «больше». Построим стену дробей и посмотрим.', uz: "Temur «ko'p» dedi. Kasr devorini quramiz va ko'ramiz." },
    conclusion: { ru: 'Числитель один и тот же — везде одна доля. Но чем больше знаменатель, тем доля мельче: 1/2 > 1/3 > 1/4.', uz: "Surat bir xil — hamma joyda bitta ulush. Lekin maxraj qancha katta bo'lsa, ulush shuncha mayda: 1/2 > 1/3 > 1/4." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Соберём стену дробей по шагам. Нажимай кнопку Дальше.',
        'Вот целая полоса, поделённая на 2 части. Закрасим одну — это одна вторая, половина.',
        'Ниже такая же полоса, но поделённая на 3 части. Закрасим одну долю — это одна третья. Смотри: доля стала мельче, чем половина.',
        'Ещё ниже — полоса на 4 части, закрашена одна. Это одна четвёртая, и она ещё мельче. Числитель везде один, а доли всё меньше — получается лесенка вниз: одна вторая больше одной третьей, а та больше одной четвёртой.'
      ],
      uz: [
        "Kasr devorini bosqichma-bosqich yig'amiz. Davom etish tugmasini bosing.",
        "Mana butun chiziq, 2 bo'lakka bo'lingan. Bittasini bo'yaymiz — bu ikkidan bir, yarim.",
        "Pastda xuddi shunday chiziq, lekin 3 bo'lakka bo'lingan. Bitta ulushni bo'yaymiz — bu uchdan bir. Qarang: ulush yarimdan mayda bo'ldi.",
        "Yana pastda — 4 bo'lakli chiziq, bittasi bo'yalgan. Bu to'rtdan bir, u yana ham mayda. Surat hamma joyda bitta, ulushlar esa kichrayib boradi — zinapoya pastga tushadi: ikkidan bir katta uchdan birdan, u esa katta to'rtdan birdan."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider, shrinking slice): доля уменьшается с ростом знаменателя ----
  s2: {
    eyebrow: { ru: 'Доля уменьшается', uz: "Ulush kichrayadi" },
    title: { ru: 'Двигай ползунок — смотри, как доля уменьшается', uz: "Slayderni suring — ulush qanday kichrayishini kuzating" },
    intro: { ru: 'Сверху для сравнения — одна третья. Снизу одна доля: двигай ползунок и меняй знаменатель. Закрашенный кусочек будет меняться.', uz: "Yuqorida solishtirish uchun — uchdan bir. Pastda bitta ulush: slayderni surib, maxrajni o'zgartiring. Bo'yalgan bo'lak o'zgarib turadi." },
    target_text: { ru: 'Цель: сделай долю 1/6 и сравни её с 1/3.', uz: "Maqsad: ulushni 1/6 qiling va uni 1/3 bilan solishtiring." },
    eyebrow_slider: { ru: 'Знаменатель:', uz: "Maxraj:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала собери', uz: "Avval yig'ing" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Одна шестая мельче одной третьей: знаменатель больше, шесть против трёх, значит доля меньше. Одна шестая меньше одной третьей.', uz: "Oltidan bir uchdan birdan mayda: maxraj katta, olti uchga qarshi, demak ulush kichik. Oltidan bir uchdan birdan kichik." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Нужна доля одна шестая — поставь знаменатель на шесть.', uz: "Oltidan bir ulush kerak — maxrajni oltiga qo'ying." },
    audio: { ru: 'Двигай ползунок и смотри, как доля уменьшается, когда знаменатель растёт. Сверху для сравнения стоит одна третья. Сделай нижнюю долю одной шестой — поставь знаменатель на шесть. Увидишь: одна шестая мельче одной третьей, ведь знаменатель больше.', uz: "Slayderni surib, maxraj o'sganda ulush qanday kichrayishini kuzating. Yuqorida solishtirish uchun uchdan bir turibdi. Pastki ulushni oltidan bir qiling — maxrajni 6 ga qo'ying. Ko'rasiz: oltidan bir uchdan birdan mayda, chunki maxraj katta." }
  },

  // ---- s3 RULE: одинаковый числитель → больше знаменатель = меньше дробь ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Стена дробей всё показала. Теперь — правило.', uz: "Kasr devori hammasini ko'rsatdi. Endi — qoida." },
    label: { ru: 'Числитель один — смотрим на знаменатель', uz: "Surat bir xil — maxrajga qaraymiz" },
    title: { ru: 'Если числитель одинаковый, больше та дробь, у которой знаменатель меньше.', uz: "Surat bir xil bo'lsa, maxraji kichik bo'lgan kasr katta." },
    card_top: { ru: 'Одинаковый числитель — берём одинаковое число долей.', uz: "Bir xil surat — bir xil sondagi ulush olamiz." },
    card_bottom: { ru: 'Чем больше знаменатель, тем мельче доля — значит дробь меньше.', uz: "Maxraj qancha katta bo'lsa, ulush shuncha mayda — demak kasr kichik." },
    card_line: { ru: 'Больше знаменатель — меньше дробь.', uz: "Maxraj katta — kasr kichik." },
    outro: { ru: 'Стена дробей: 1/2 > 1/3 > 1/4 > 1/5. Числитель один, а доли всё мельче.', uz: "Kasr devori: 1/2 > 1/3 > 1/4 > 1/5. Surat bir xil, ulushlar esa mayda-mayda bo'ladi." },
    audio: { ru: 'Запомни правило. Если у дробей одинаковый числитель, больше та, у которой знаменатель меньше. Числитель один — мы берём одинаковое число долей. А чем больше знаменатель, тем мельче сама доля, поэтому дробь меньше. Смотри на стену дробей: одна вторая больше одной третьей, та больше одной четвёртой, и так далее.', uz: "Qoidani eslab qoling. Agar kasrlarning surati bir xil bo'lsa, maxraji kichik bo'lgani katta. Surat bir xil — biz bir xil sondagi ulush olamiz. Maxraj qancha katta bo'lsa, ulushning o'zi shuncha mayda, shuning uchun kasr kichik. Kasr devoriga qarang: ikkidan bir katta uchdan birdan, u to'rtdan birdan, va hokazo." }
  },

  // ---- s4 TEST (MC, отношение): 1/4 ? 1/7 → 1/4 > 1/7 (correct old idx 0) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сравни доли', uz: "Ulushlarni solishtiring" },
    question: { ru: 'Сравни 1/4 и 1/7. Что верно?', uz: "1/4 va 1/7 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '1/4 > 1/7', uz: "1/4 > 1/7" },
    opt1: { ru: '1/4 < 1/7', uz: "1/4 < 1/7" },
    opt2: { ru: '1/4 = 1/7', uz: "1/4 = 1/7" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: числитель один, знаменатель 4 меньше 7 — значит доля крупнее. 1/4 > 1/7.', uz: "To'g'ri: surat bir xil, maxraj 4 kichik 7 dan — demak ulush yirikroq. 1/4 > 1/7." },
    hint_1: { ru: 'Тут ловушка: 7 больше 4, но доля одна седьмая мельче. Больше та, где знаменатель меньше — одна четвёртая.', uz: "Bu yerda tuzoq: 7 katta 4 dan, lekin yettidan bir ulushi mayda. Maxraji kichik bo'lgani katta — to'rtdan bir." },
    hint_2: { ru: 'Доли разного размера: четвёртая крупнее седьмой. Они не равны.', uz: "Ulushlar har xil o'lchamda: to'rtdan bir yettidan biridan yirik. Ular teng emas." },
    hint_3: { ru: 'Сравнить можно: числитель один, смотрим на знаменатели.', uz: "Solishtirsa bo'ladi: surat bir xil, maxrajlarga qaraymiz." },
    wrong_default: { ru: 'Числитель один, знаменатель меньше у 1/4 — значит 1/4 больше. 1/4 > 1/7.', uz: "Surat bir xil, maxraj 1/4 da kichik — demak 1/4 katta. 1/4 > 1/7." },
    audio: {
      intro: { ru: 'Сравни одну четвёртую и одну седьмую. Выбери, что верно.', uz: "To'rtdan bir va yettidan birni solishtiring. Nima to'g'ri ekanini tanlang." },
      on_correct: { ru: 'Верно. Знаменатель меньше у одной четвёртой — она крупнее.', uz: "To'g'ri. Maxraj to'rtdan birda kichik — u yirikroq." },
      on_wrong: { ru: 'Пока нет. Числитель один, больше та доля, у которой знаменатель меньше.', uz: "Hali emas. Surat bir xil, maxraji kichik bo'lgan ulush katta." }
    }
  },

  // ---- s5 RULE (bias-flip, flip-card): 5 > 3, но 1/5 < 1/3 ----
  s5: {
    eyebrow: { ru: 'Правило · ловушка', uz: "Qoida · tuzoq" },
    label: { ru: 'Осторожно: ловушка', uz: "Ehtiyot bo'ling: tuzoq" },
    trap_title: { ru: '5 больше 3...', uz: "5 katta 3 dan..." },
    trap_text: { ru: 'Кажется, раз 5 больше 3, то и 1/5 должна быть больше 1/3. Это и есть ловушка. Проверим?', uz: "Go'yo 5 katta 3 dan, demak 1/5 ham 1/3 dan katta bo'lishi kerak. Mana shu — tuzoq. Tekshiramizmi?" },
    btn_reveal: { ru: 'Показать правду', uz: "Haqiqatni ko'rsatish" },
    truth_title: { ru: 'На самом деле 1/5 < 1/3', uz: "Aslida 1/5 < 1/3" },
    truth_text: { ru: 'Числитель один и тот же. Большее число снизу делит целое на больше частей — доля мельче. Поэтому 1/5 меньше 1/3.', uz: "Surat bir xil. Pastdagi katta son butunni ko'proq bo'lakka bo'ladi — ulush mayda. Shuning uchun 1/5 kichik 1/3 dan." },
    contrast: { ru: 'В прошлом уроке знаменатель был одинаковый — там больше тот, у кого числитель больше. Здесь наоборот: числитель один, и больше тот, у кого знаменатель меньше.', uz: "O'tgan darsda maxraj bir xil edi — u yerda surati katta bo'lgani katta. Bu yerda aksincha: surat bir xil, va maxraji kichik bo'lgani katta." },
    btn_next: { ru: 'Понял ловушку', uz: "Tuzoqni tushundim" },
    audio: { ru: 'Осторожно, тут ловушка. Кажется, раз пять больше трёх, то одна пятая больше одной третьей. Нажми кнопку и проверь. На самом деле одна пятая меньше одной третьей. Числитель один, а большее число снизу делит целое на больше частей, поэтому доля мельче. В прошлом уроке знаменатель был одинаковый и правило было обратное. Будь внимателен.', uz: "Ehtiyot bo'ling, bu yerda tuzoq bor. Go'yo besh katta uchdan, demak beshdan bir katta uchdan bir. Tugmani bosib tekshiring. Aslida beshdan bir kichik uchdan bir. Surat bir xil, pastdagi katta son butunni ko'proq bo'lakka bo'ladi, shuning uchun ulush mayda. O'tgan darsda maxraj bir xil edi va qoida teskari edi. Diqqatli bo'ling." }
  },

  // ---- s6 TEST (упорядочивание tap, 3 раунда): расставь по возрастанию (одинаковый числитель) ----
  s6: {
    eyebrow: { ru: 'Тренировка · по порядку', uz: "Mashq · tartib bilan" },
    title: { ru: 'Расставь по возрастанию', uz: "O'sish tartibida joylang" },
    lead: { ru: 'Числитель один! Три набора, от простого к сложному. Нажимай от самой маленькой доли к самой большой — помни: больше знаменатель = мельче доля.', uz: "Surat bir xil! Uchta to'plam, osondan qiyinga. Eng kichik ulushdan eng kattasigacha bosing — eslang: maxraj katta = ulush mayda." },
    round_label: { ru: 'Набор', uz: "To'plam" },
    ask: { ru: 'Нажми самую маленькую из оставшихся.', uz: "Qolganlardan eng kichigini bosing." },
    hint_wrong: { ru: 'Это не самая маленькая. Числитель один — самая маленькая та, у которой знаменатель БОЛЬШЕ.', uz: "Bu eng kichigi emas. Surat bir xil — eng kichigi maxraji KATTA bo'lgani." },
    correct_text: { ru: 'Отлично! Числитель один — порядок обратный знаменателям: чем больше знаменатель, тем мельче доля.', uz: "Ajoyib! Surat bir xil — tartib maxrajlarga teskari: maxraj qancha katta bo'lsa, ulush shuncha mayda." },
    audio: {
      intro: { ru: 'Расставь дроби по возрастанию. Будет три набора, от простого к сложному. Числитель один и тот же, поэтому самая маленькая дробь та, у которой знаменатель больше всех. Нажимай от меньшей к большей.', uz: "Kasrlarni o'sish tartibida joylang. Uchta to'plam bo'ladi, osondan qiyinga. Surat bir xil, shuning uchun eng kichik kasr maxraji hammadan katta bo'lgani. Kichigidan kattasigacha bosing." },
      on_correct: { ru: 'Верно. Числитель один — больше знаменатель, мельче доля.', uz: "To'g'ri. Surat bir xil — maxraj katta, ulush mayda." },
      on_wrong: { ru: 'Не самая маленькая. У самой маленькой доли знаменатель больше всех.', uz: "Eng kichigi emas. Eng kichik ulushda maxraj hammadan katta." }
    }
  },

  // ---- s7 TEST (MC, текст): 1/8 > 1/5? Нет (correct old idx 0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Не попадись в ловушку', uz: "Tuzoqqa tushmang" },
    question: { ru: 'Кто-то говорит: «1/8 больше 1/5, ведь 8 больше 5». Это так?', uz: "Kimdir aytadi: «1/8 katta 1/5 dan, axir 8 katta 5 dan». Shundaymi?" },
    opt0: { ru: 'Неверно — 1/8 меньше: знаменатель больше, доля мельче', uz: "Noto'g'ri — 1/8 kichik: maxraj katta, ulush mayda" },
    opt1: { ru: 'Верно — раз 8 больше 5, то 1/8 больше', uz: "To'g'ri — 8 katta 5 dan, demak 1/8 katta" },
    opt2: { ru: 'Они равны — числитель ведь один', uz: "Ular teng — surat-ku bitta" },
    opt3: { ru: 'Такие дроби сравнить нельзя', uz: "Bunday kasrlarni solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: большее число снизу делит целое на больше частей, доля мельче. 1/8 < 1/5.', uz: "To'g'ri: pastdagi katta son butunni ko'proq bo'lakka bo'ladi, ulush mayda. 1/8 < 1/5." },
    hint_1: { ru: 'Это и есть ловушка. 8 больше 5, но доля одна восьмая мельче. Меньше, а не больше.', uz: "Mana shu — tuzoq. 8 katta 5 dan, lekin sakkizdan bir ulushi mayda. Kichik, katta emas." },
    hint_2: { ru: 'Не равны: восьмая доля мельче пятой, ведь целое поделено на больше частей.', uz: "Teng emas: sakkizdan ulush beshdan ulushdan mayda, chunki butun ko'proq bo'lakka bo'lingan." },
    hint_3: { ru: 'Сравнить можно: числитель один, больше та доля, у которой знаменатель меньше.', uz: "Solishtirsa bo'ladi: surat bir xil, maxraji kichik bo'lgan ulush katta." },
    wrong_default: { ru: 'Нет. Знаменатель больше — доля мельче. 1/8 меньше 1/5.', uz: "Yo'q. Maxraj katta — ulush mayda. 1/8 kichik 1/5 dan." },
    audio: {
      intro: { ru: 'Кто-то говорит, что одна восьмая больше одной пятой, ведь восемь больше пяти. Так ли это? Выбери ответ.', uz: "Kimdir aytadi: sakkizdan bir katta beshdan birdan, axir 8 katta 5 dan. Shundaymi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Знаменатель больше — доля мельче, поэтому одна восьмая меньше.', uz: "To'g'ri. Maxraj katta — ulush mayda, shuning uchun sakkizdan bir kichik." },
      on_wrong: { ru: 'Это ловушка: большее число снизу делает долю мельче, а не крупнее.', uz: "Bu tuzoq: pastdagi katta son ulushni mayda qiladi, yirik emas." }
    }
  },

  // ---- s_seq TEST (SeqMC): 5 примеров — поставь знак, одинаковый числитель (bias-trap) ----
  s_seq: {
    eyebrow: { ru: 'Тренировка · поставь знак', uz: "Mashq · belgi qo'ying" },
    title: { ru: 'Поставь знак: больше, меньше или равно', uz: "Belgi qo'ying: katta, kichik yoki teng" },
    lead: { ru: 'Числитель в паре одинаковый. Числа будут расти: одна цифра, две, три, потом четыре. Правило одно: больше знаменатель — меньше дробь.', uz: "Juftda surat bir xil. Sonlar o'sib boradi: bir xonali, ikki, uch, keyin to'rt. Qoida bitta: maxraj katta — kasr kichik." },
    bridge: { ru: 'Ловушку знаем. Теперь — со знаком, и числа будут расти.', uz: "Tuzoqni bilamiz. Endi — belgi bilan, sonlar esa o'sib boradi." },
    questions: [
      {
        q: { ru: '1/4 ? 1/9', uz: '1/4 ? 1/9' },
        say: { ru: 'Одна четвёртая и одна девятая. Какой знак?', uz: "To'rtdan bir va to'qqizdan bir. Qaysi belgi?" },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 0,
        ok: { ru: 'Верно: знаменатель меньше у 1/4, значит она больше.', uz: "To'g'ri: maxraj 1/4 da kichik, demak u katta." },
        no: { ru: 'Числитель один. Меньше знаменатель — крупнее доля.', uz: "Surat bir xil. Maxraj kichik — ulush yirik." }
      },
      {
        q: { ru: '3/8 ? 3/5', uz: '3/8 ? 3/5' },
        say: { ru: 'Три восьмых и три пятых.', uz: "Sakkizdan uch va beshdan uch." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 1,
        ok: { ru: 'Верно: знаменатель больше у 3/8, значит она меньше.', uz: "To'g'ri: maxraj 3/8 da katta, demak u kichik." },
        no: { ru: 'Ловушка: 8 больше 5, но восьмые мельче пятых.', uz: "Tuzoq: 8 katta 5 dan, lekin sakkizdan ulush mayda." }
      },
      {
        q: { ru: '5/12 ? 5/20', uz: '5/12 ? 5/20' },
        say: { ru: 'Двузначные знаменатели. Числитель один. Какой знак?', uz: "Ikki xonali maxrajlar. Surat bir xil. Qaysi belgi?" },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 0,
        ok: { ru: 'Верно: 12 меньше 20, значит доля 5/12 крупнее. 5/12 больше.', uz: "To'g'ri: 12 kichik 20 dan, demak 5/12 ulushi yirik. 5/12 katta." },
        no: { ru: 'Числитель один. Меньше знаменатель (12) — крупнее доля.', uz: "Surat bir xil. Maxraj kichik (12) — ulush yirik." }
      },
      {
        q: { ru: '7/40 ? 7/100', uz: '7/40 ? 7/100' },
        say: { ru: 'Теперь трёхзначный знаменатель. Числитель тот же. Сравни.', uz: "Endi uch xonali maxraj. Surat o'sha. Solishtiring." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 0,
        ok: { ru: 'Верно: 40 меньше 100, значит 7/40 крупнее. Большие числа правило не меняют.', uz: "To'g'ri: 40 kichik 100 dan, demak 7/40 yirik. Katta sonlar qoidani o'zgartirmaydi." },
        no: { ru: 'Не дай большому числу обмануть: меньше знаменатель — больше дробь.', uz: "Katta son aldamasin: maxraj kichik — kasr katta." }
      },
      {
        q: { ru: '4/250 ? 4/250', uz: '4/250 ? 4/250' },
        say: { ru: 'Числа большие, но посмотри внимательно на обе дроби.', uz: "Sonlar katta, lekin ikkala kasrga diqqat bilan qarang." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 2,
        ok: { ru: 'Верно: дроби полностью одинаковые — равны. Размер чисел тут не при чём.', uz: "To'g'ri: kasrlar to'liq bir xil — teng. Sonlar kattaligi bunga aloqasiz." },
        no: { ru: 'Присмотрись: и числитель, и знаменатель совпадают. Значит, равны.', uz: "Diqqat bilan qarang: surat ham, maxraj ham bir xil. Demak, teng." }
      },
      {
        q: { ru: '3/1000 ? 3/750', uz: '3/1000 ? 3/750' },
        say: { ru: 'Последняя — четырёхзначный знаменатель. Не спеши, числитель один.', uz: "Oxirgisi — to'rt xonali maxraj. Shoshmang, surat bir xil." },
        opts: [{ ru: '>', uz: '>' }, { ru: '<', uz: '<' }, { ru: '=', uz: '=' }],
        correct: 1,
        ok: { ru: 'Верно: 1000 больше 750, целое разбито на больше частей — доля мельче. 3/1000 меньше.', uz: "To'g'ri: 1000 katta 750 dan, butun ko'proq bo'lakka bo'lingan — ulush mayda. 3/1000 kichik." },
        no: { ru: 'Тысяча больше, чем семьсот пятьдесят — значит доля три тысячных мельче.', uz: "Ming yetti yuz ellikdan katta — demak mingdan uch ulushi mayda." }
      }
    ],
    audio: {
      intro: { ru: 'Поставь знак между дробями. Числитель в каждой паре одинаковый. Числа будут расти — от одной цифры до четырёх, но правило не меняется: чем больше знаменатель, тем меньше дробь.', uz: "Kasrlar orasiga belgi qo'ying. Har juftda surat bir xil. Sonlar o'sib boradi — bir xonalidan to'rt xonaligacha, lekin qoida o'zgarmaydi: maxraj qancha katta bo'lsa, kasr shuncha kichik." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Не спеши. Больше знаменатель — меньше дробь.', uz: "Shoshmang. Maxraj katta — kasr kichik." },
      on_done: { ru: 'Отлично, ловушка не сработала ни разу!', uz: "Zo'r, tuzoq bir marta ham ishlamadi!" }
    }
  },

  // ---- s8 CASE setup: Диёра, общее облачное хранилище класса ----
  s8: {
    eyebrow: { ru: 'Задача · облако', uz: "Masala · bulut" },
    bridge: { ru: 'То же правило — в жизни. Диёра делит облако класса.', uz: "O'sha qoida — hayotda. Diyora sinf bulutini bo'ladi." },
    title: { ru: 'Диёра делит общее облачное хранилище.', uz: "Diyora umumiy bulutli xotirani bo'ladi." },
    body_p1: { ru: 'Две группы получили одинаковое по объёму облачное хранилище и делят его поровну между учениками. В группе Диёры 4 ученика — каждому достаётся 1/4 хранилища. В другой группе 6 учеников — каждому 1/6. У кого на одного ученика больше места?', uz: "Ikki guruh bir xil hajmdagi bulutli xotira oldi va uni o'quvchilar o'rtasida teng bo'ladi. Diyoraning guruhida 4 o'quvchi — har biriga xotiraning 1/4 qismi tegadi. Boshqa guruhda 6 o'quvchi — har biriga 1/6. Bitta o'quvchiga qaysisida ko'proq joy tegadi?" },
    card_line_label: { ru: 'Группа Диёры', uz: "Diyora guruhi" },
    card_line_value: { ru: '4 ученика · по 1/4', uz: "4 o'quvchi · 1/4 dan" },
    card_parts_label: { ru: 'Другая группа', uz: "Boshqa guruh" },
    card_parts_value: { ru: '6 учеников · по 1/6', uz: "6 o'quvchi · 1/6 dan" },
    outro: { ru: 'Хранилище одинаковое, числитель один (по одной доле на ученика). Помоги сравнить на следующем шаге.', uz: "Xotira bir xil, surat bir xil (har o'quvchiga bitta ulushdan). Keyingi bosqichda solishtirishga yordam bering." },
    btn_help: { ru: 'Помочь сравнить', uz: "Solishtirishga yordam" },
    audio: { ru: 'Две группы получили одинаковое облачное хранилище и делят его поровну между учениками. В группе Диёры четыре ученика, каждому достаётся одна четвёртая. В другой группе шесть учеников, каждому одна шестая. У кого на одного ученика больше места? Хранилище одинаковое, числитель один. Подумай, как сравнить.', uz: "Ikki guruh bir xil bulutli xotira oldi va uni o'quvchilar o'rtasida teng bo'ladi. Diyoraning guruhida to'rtta o'quvchi, har biriga to'rtdan bir tegadi. Boshqa guruhda oltita o'quvchi, har biriga oltidan bir. Bitta o'quvchiga qaysisida ko'proq joy tegadi? Xotira bir xil, surat bir xil. Qanday solishtirishni o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, отношение): 1/4 vs 1/6 → группа Диёры больше (correct old idx 0) ----
  s9: {
    eyebrow: { ru: 'Задача · облако', uz: "Masala · bulut" },
    label: { ru: 'У кого больше места?', uz: "Kimda ko'proq joy?" },
    question: { ru: 'В группе Диёры по 1/4, в другой по 1/6. Что верно?', uz: "Diyora guruhida 1/4 dan, boshqasida 1/6 dan. Nima to'g'ri?" },
    opt0: { ru: 'У группы Диёры больше: 1/4 > 1/6', uz: "Diyora guruhida ko'proq: 1/4 > 1/6" },
    opt1: { ru: 'У другой группы больше: 1/6 > 1/4', uz: "Boshqa guruhda ko'proq: 1/6 > 1/4" },
    opt2: { ru: 'Поровну', uz: "Teng" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: учеников меньше (4 против 6) — на каждого больше места. 1/4 > 1/6.', uz: "To'g'ri: o'quvchi kam (4, 6 ga qarshi) — har biriga ko'proq joy. 1/4 > 1/6." },
    hint_1: { ru: 'Ловушка: 6 больше 4, но больше учеников — меньше каждому. Одна шестая мельче одной четвёртой.', uz: "Tuzoq: 6 katta 4 dan, lekin o'quvchi ko'p — har biriga kam. Oltidan bir to'rtdan birdan mayda." },
    hint_2: { ru: 'Доли разные: одна четвёртая крупнее одной шестой. Не поровну.', uz: "Ulushlar har xil: to'rtdan bir oltidan birdan yirik. Teng emas." },
    hint_3: { ru: 'Хранилище одинаковое, числитель один — сравнить можно по знаменателям.', uz: "Xotira bir xil, surat bir — maxrajlar bo'yicha solishtirsa bo'ladi." },
    wrong_default: { ru: 'Учеников меньше у группы Диёры — каждому больше. 1/4 > 1/6.', uz: "Diyora guruhida o'quvchi kam — har biriga ko'proq. 1/4 > 1/6." },
    fact: { ru: 'Разрежь яблоко на 2 части — получишь крупные половинки. А раздели то же яблоко на 8 — кусочки выйдут совсем маленькими. Яблоко одно, числитель один, а чем больше знаменатель, тем мельче доля.', uz: "Olmani 2 bo'lakka kessa — yirik yarimliklar chiqadi. Xuddi shu olmani 8 ga bo'lsa — bo'laklar juda mayda bo'ladi. Olma bitta, surat bir xil, maxraj qancha katta bo'lsa, ulush shuncha mayda." },
    audio: {
      intro: { ru: 'В группе Диёры каждому достаётся одна четвёртая, в другой группе одна шестая. У кого на ученика больше места? Выбери верное.', uz: "Diyora guruhida har biriga to'rtdan bir, boshqa guruhda oltidan bir tegadi. O'quvchiga qaysisida ko'proq joy? To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Учеников меньше — каждому больше. Одна четвёртая больше одной шестой. Так и с яблоком: разрежешь на два — куски крупные, на восемь — совсем мелкие.', uz: "To'g'ri. O'quvchi kam — har biriga ko'proq. To'rtdan bir katta oltidan birdan. Olma ham shunday: ikkiga kesilsa bo'laklar yirik, sakkizga bo'linsa juda mayda." },
      on_wrong: { ru: 'Пока нет. Числитель один, больше та доля, у которой знаменатель меньше.', uz: "Hali emas. Surat bir xil, maxraji kichik bo'lgan ulush katta." }
    }
  },

  // ---- s10 TEST (error-spotting): какое сравнение НЕВЕРНО (correct old idx 2) ----
  s10: {
    eyebrow: { ru: 'Проверка · найди ошибку', uz: "Tekshiruv · xatoni toping" },
    label: { ru: 'Найди неверное', uz: "Noto'g'risini toping" },
    title: { ru: 'Одно сравнение неверно', uz: "Bitta solishtirish noto'g'ri" },
    question: { ru: 'Три сравнения верны, а одно — нет. Какое НЕВЕРНО?', uz: "Uchta solishtirish to'g'ri, bittasi esa — yo'q. Qaysi biri NOTO'G'RI?" },
    opt0: { ru: '1/3 > 1/5', uz: "1/3 > 1/5" },
    opt1: { ru: '2/7 < 2/4', uz: "2/7 < 2/4" },
    opt2: { ru: '1/8 > 1/6', uz: "1/8 > 1/6" },
    opt3: { ru: '3/10 < 3/4', uz: "3/10 < 3/4" },
    correct_text: { ru: 'Верно, это сравнение неверно: числитель один (1), знаменатель 8 больше 6 — значит 1/8 меньше 1/6, а не больше.', uz: "To'g'ri, bu solishtirish noto'g'ri: surat bir xil (1), maxraj 8 katta 6 dan — demak 1/8 kichik 1/6 dan, katta emas." },
    wrong_0: { ru: 'Это верно: знаменатель меньше у одной третьей, значит она больше. Ищи неверное дальше.', uz: "Bu to'g'ri: maxraj uchdan birda kichik, demak u katta. Noto'g'risini boshqasidan qidiring." },
    wrong_1: { ru: 'Это верно: 7 больше 4, седьмые мельче четвёртых, значит две седьмых меньше. Ищи дальше.', uz: "Bu to'g'ri: 7 katta 4 dan, yettidan ulush mayda, demak yettidan ikki kichik. Boshqasidan qidiring." },
    wrong_3: { ru: 'Это верно: десятые мельче четвёртых, значит три десятых меньше. Ищи дальше.', uz: "Bu to'g'ri: o'ndan ulush maydaroq, demak o'ndan uch kichik. Boshqasidan qidiring." },
    wrong_default: { ru: 'Ищи сравнение, где попались в ловушку: больший знаменатель приняли за большую дробь.', uz: "Tuzoqqa tushgan solishtirishni qidiring: katta maxrajni katta kasr deb o'ylagan." },
    audio: {
      intro: { ru: 'Три сравнения верны, а одно неверно. Найди то, где попались в ловушку большого знаменателя. Числитель в каждой паре одинаковый.', uz: "Uchta solishtirish to'g'ri, bittasi noto'g'ri. Katta maxraj tuzog'iga tushgan birini toping. Har juftda surat bir xil." },
      on_correct: { ru: 'Верно. Восемь больше шести, но одна восьмая меньше одной шестой, а не больше.', uz: "To'g'ri. Sakkiz katta oltidan, lekin sakkizdan bir kichik oltidan bir, katta emas." },
      on_wrong: { ru: 'Это сравнение верное. Ищи, где большой знаменатель приняли за большую дробь.', uz: "Bu solishtirish to'g'ri. Katta maxrajni katta kasr deb o'ylagan birini qidiring." }
    }
  },

  // ---- s11 TEST (MC, отношение): 2/5 ? 2/7 → 2/5 > 2/7 (correct old idx 0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — сравни', uz: "Oxirgisi — solishtiring" },
    question: { ru: 'Сравни 2/5 и 2/7. Что верно?', uz: "2/5 va 2/7 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '2/5 > 2/7', uz: "2/5 > 2/7" },
    opt1: { ru: '2/5 < 2/7', uz: "2/5 < 2/7" },
    opt2: { ru: '2/5 = 2/7', uz: "2/5 = 2/7" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: числитель один (2), знаменатель 5 меньше 7 — пятые доли крупнее седьмых. 2/5 > 2/7.', uz: "To'g'ri: surat bir xil (2), maxraj 5 kichik 7 dan — beshdan ulushlar yettidan ulushlardan yirik. 2/5 > 2/7." },
    hint_1: { ru: 'Ловушка: 7 больше 5, но седьмые мельче пятых. Больше две пятых.', uz: "Tuzoq: 7 katta 5 dan, lekin yettidan ulushlar mayda. Beshdan ikki katta." },
    hint_2: { ru: 'Доли разные: пятые крупнее седьмых. Не равны.', uz: "Ulushlar har xil: beshdan ulushlar yettidan ulushlardan yirik. Teng emas." },
    hint_3: { ru: 'Сравнить можно: числитель один, смотрим на знаменатели.', uz: "Solishtirsa bo'ladi: surat bir xil, maxrajlarga qaraymiz." },
    wrong_default: { ru: 'Числитель один (2), знаменатель меньше у 2/5 — значит 2/5 больше.', uz: "Surat bir xil (2), maxraj 2/5 da kichik — demak 2/5 katta." },
    fact: { ru: 'Картинку на экране делят на пиксели. Чем на больше пикселей разбит один и тот же экран, тем мельче каждый пиксель — и тем чётче картинка. Знаменатель растёт, а доля каждого пикселя падает.', uz: "Ekrandagi rasm piksellarga bo'linadi. Bitta ekran qancha ko'p pikselga bo'linsa, har piksel shuncha mayda — va rasm shuncha aniq. Maxraj o'sadi, har pikselning ulushi esa kichrayadi." },
    audio: {
      intro: { ru: 'Последнее задание. Сравни две пятых и две седьмых. Выбери верное.', uz: "Oxirgi topshiriq. Beshdan ikki va yettidan ikkini solishtiring. To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Знаменатель меньше у двух пятых — они больше. Так и с экраном: чем на больше пикселей он разбит, тем мельче каждый пиксель.', uz: "To'g'ri. Maxraj beshdan ikkida kichik — ular katta. Ekran ham shunday: qancha ko'p pikselga bo'linsa, har piksel shuncha mayda." },
      on_wrong: { ru: 'Пока нет. Числитель один, больше та дробь, у которой знаменатель меньше.', uz: "Hali emas. Surat bir xil, maxraji kichik bo'lgan kasr katta." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    score_caption: { ru: 'вопросов решено верно с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob berdingiz" },
    title: { ru: 'Теперь тебя не обманет большой знаменатель.', uz: "Endi katta maxraj sizni alday olmaydi." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Одинаковый числитель — берём одинаковое число долей.', uz: "Bir xil surat — bir xil sondagi ulush olamiz." },
    main_2: { ru: 'Больше та дробь, у которой знаменатель МЕНЬШЕ: доля крупнее.', uz: "Maxraji KICHIK bo'lgan kasr katta: ulush yirikroq." },
    main_3: { ru: 'Большое число снизу не делает дробь больше — оно делит целое на больше мелких частей.', uz: "Pastdagi katta son kasrni katta qilmaydi — u butunni ko'proq mayda bo'lakka bo'ladi." },
    main_4: { ru: 'Одинаковый числитель — смотрим на знаменатель; одинаковый знаменатель — на числитель.', uz: "Surat bir xil — maxrajga qaraymiz; maxraj bir xil — suratga qaraymiz." },
    back_to_hook: { ru: 'У Эльдора 3 устройства, у Темура 5. Интернет один, но у Темура устройств больше — значит каждому достаётся меньше. 1/3 > 1/5. Темур попал в ловушку.', uz: "Eldorda 3 ta qurilma, Temurda 5 ta. Internet bir xil, lekin Temurda qurilma ko'p — demak har biriga kamroq tegadi. 1/3 > 1/5. Temur tuzoqqa tushgan ekan." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'урок «Сравнение дробей с одинаковым знаменателем».', uz: "«Bir xil maxrajli kasrlarni taqqoslash» darsi." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сравнение дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni taqqoslash." },
    audio: { ru: 'Отлично! Теперь тебя не обманет большой знаменатель. Если у дробей одинаковый числитель, больше та, у которой знаменатель меньше: доля крупнее. Большое число снизу не делает дробь больше — оно лишь делит целое на больше мелких частей. Помни: одинаковый числитель — смотри на знаменатель, одинаковый знаменатель — на числитель. У Эльдора три устройства, у Темура пять. Интернет один, а у Темура устройств больше, значит каждому достаётся меньше. Одна третья больше одной пятой. Темур попал в ловушку.', uz: "Zo'r! Endi katta maxraj sizni alday olmaydi. Agar kasrlarning surati bir xil bo'lsa, maxraji kichik bo'lgani katta: ulush yirikroq. Pastdagi katta son kasrni katta qilmaydi — u faqat butunni ko'proq mayda bo'lakka bo'ladi. Esda tuting: surat bir xil — maxrajga qarang, maxraj bir xil — suratga qarang. Eldorda uchta qurilma, Temurda beshta. Internet bir xil, Temurda esa qurilma ko'p, demak har biriga kamroq tegadi. Uchdan bir katta beshdan birdan. Temur tuzoqqa tushgan ekan." }
  }
};

// ============================================================
// OrderTap (s6) — упорядочивание по возрастанию ЗНАЧЕНИЯ, 3 раунда (одинаковый числитель).
// Веди-до-верного, scored. Сравнение по value = num/den.
// ============================================================
const S6_ROUNDS = [
  [{ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 1, d: 4 }, { n: 1, d: 8 }],
  [{ n: 1, d: 3 }, { n: 1, d: 5 }, { n: 1, d: 6 }, { n: 1, d: 9 }],
  [{ n: 2, d: 3 }, { n: 2, d: 5 }, { n: 2, d: 7 }, { n: 2, d: 9 }]
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
          <FractionWall rows={[{ num: 1, den: 3 }, { num: 1, den: 5 }]} animateIn={true}/>
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

// s1 — EXPLORATION step-by-step: стена дробей растёт построчно. (top-align + Bridge)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const allRows = [{ num: 1, den: 2 }, { num: 1, den: 3 }, { num: 1, den: 4 }];
  const rows = allRows.slice(0, Math.max(0, step));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {rows.length > 0
            ? <FractionWall rows={rows} winnerDen={step >= 3 ? 2 : null} marker={step >= 3} animateIn={true}/>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: доля уменьшается. (top-align)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const ref = 3;
  const [den, setDen] = useState(2);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const onSlider = (v) => { if (solved) return; setChecked(false); setDen(v); };
  const check = () => {
    const ok = den === 6;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)' }}>
            <div style={{ width: 'clamp(40px, 9vw, 54px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="1" d="3" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={1} den={ref} color={T.blue} marker={solved} winner={solved}/></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)' }}>
            <div style={{ width: 'clamp(40px, 9vw, 54px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="1" d={String(den)} size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={1} den={den} color={T.accent} marker={solved}/></div>
          </div>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {den}</p>
            <Slider value={den} min={2} max={8} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE. (top-align + Bridge)
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
          <FractionWall rows={[{ num: 1, den: 2 }, { num: 1, den: 3 }, { num: 1, den: 4 }, { num: 1, den: 5 }]} winnerDen={2} marker={true} animateIn={true}/>
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

// s4 — TEST choice (отношение): 1/4 ? 1/7 → 1/4 > 1/7 (correct old idx 0).
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><FractionWall rows={[{ num: 1, den: 4 }, { num: 1, den: 7 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE bias-flip (flip-card, top-align).
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [flipped, setFlipped] = useState(false);
  const reveal = () => {
    if (flipped) return;
    setFlipped(true);
    if (!audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.truth_text[lang]); }, 250); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={flipped ? onNext : reveal} label={flipped ? t(c.btn_next) : t(c.btn_reveal)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
        </div>
        <div className="flip-card fade-up delay-1" style={{ position: 'relative', height: 'clamp(250px, 50vw, 300px)' }}>
          <div className={`flip-inner${flipped ? ' flipped' : ''}`}>
            <div className="flip-face">
              <div className="frame-tip" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span className="display" style={{ fontSize: 'clamp(34px, 7vw, 56px)' }}>5</span>
                  <span className="mop" style={{ color: '#A07D14', fontSize: 'clamp(22px, 4vw, 32px)' }}>&gt;</span>
                  <span className="display" style={{ fontSize: 'clamp(34px, 7vw, 56px)' }}>3</span>
                </div>
                <h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.trap_title))}</h2>
                <p className="body" style={{ margin: 0, maxWidth: 420 }}>{mt(t(c.trap_text))}</p>
              </div>
            </div>
            <div className="flip-face flip-back">
              <div className="frame-success" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
                <h2 className="title h-sub" style={{ margin: 0, textAlign: 'center', color: T.success }}>{mt(t(c.truth_title))}</h2>
                <FractionWall rows={[{ num: 1, den: 3 }, { num: 1, den: 5 }]} winnerDen={3} marker={true} animateIn={true} height={28}/>
                <p className="body" style={{ margin: 0 }}>{mt(t(c.truth_text))}</p>
              </div>
            </div>
          </div>
        </div>
        {flipped && <p className="body fade-up frame-tip" style={{ position: 'relative', margin: 0 }}>{mt(t(c.contrast))}</p>}
      </div>
    </Stage>
  );
};

// s6 — TEST упорядочивание по возрастанию.
const Screen6 = (props) => <OrderTap {...props}/>;

// s7 — TEST choice (текст): 1/8 > 1/5? Нет (correct old idx 0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [0, 2, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s_seq — TEST: 5 примеров «поставь знак» (tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — CASE setup: Диёра, облако. (top-align + Bridge)
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
          <FractionWall rows={[{ num: 1, den: 4 }, { num: 1, den: 6 }]} animateIn={true}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (отношение): 1/4 vs 1/6 (correct old idx 0).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><FractionWall rows={[{ num: 1, den: 4 }, { num: 1, den: 6 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimApple/>}/>}/>;
};

// s10 — TEST error-spotting: какое сравнение НЕВЕРНО (correct old idx 2).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — TEST choice (отношение): 2/5 ? 2/7 (correct old idx 0).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [3, 1, 2, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><FractionWall rows={[{ num: 2, den: 5 }, { num: 2, den: 7 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimPixel/>}/>}/>;
};

// s12 — SUMMARY: без счёта, закрывает крючок; finishLesson один раз. (top-align)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const scoreTotal = SCREEN_META.filter(s => s.scored).length;
  const scoreCorrect = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
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
          <FractionWall rows={[{ num: 1, den: 3 }, { num: 1, den: 5 }]} winnerDen={3} marker={true} animateIn={true} height={28}/>
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
export default function FractionCompareSameNumLesson({
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

/* === FracBar / FractionWall (стена дробей) === */
.fw-row { animation: fwRowIn 0.42s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes fwRowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.fw-grow { animation: fwGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes fwGrow { from { width: 0; } }
.fw-marker { animation: fwMarkerIn 0.3s ease-out backwards; }
@keyframes fwMarkerIn { from { opacity: 0; } }
.fw-slide { animation: fwSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes fwSlide { from { left: 0; } }
.fw-flag { transform-origin: bottom left; animation: fwFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, fwFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes fwFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes fwFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }

/* === FLIP-CARD (s5 ловушка → правда) === */
.flip-card { width: 100%; perspective: 1300px; }
.flip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
.flip-inner.flipped { transform: rotateY(180deg); }
.flip-face { position: absolute; inset: 0; display: flex; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.flip-back { transform: rotateY(180deg); }

/* === FACT-АНИМАЦИИ (синяя тема) === */
.fa-share { display: flex; flex-direction: column; gap: 6px; width: clamp(84px, 16vw, 112px); }
.fa-share-d { height: 12px; border-radius: 99px; background: #019ACB; opacity: 0.25; animation: faShare 2.6s ease-in-out infinite; }
.fa-share-1 { width: 100%; animation-delay: 0s; }
.fa-share-2 { width: 60%; animation-delay: 0.3s; }
.fa-share-3 { width: 30%; animation-delay: 0.6s; }
@keyframes faShare { 0%, 100% { opacity: 0.2; } 45% { opacity: 0.95; } }
.fa-apple { position: relative; width: clamp(58px, 12vw, 78px); height: clamp(58px, 12vw, 78px); border-radius: 50%; border: 2px solid #019ACB; }
.fa-apple-s { position: absolute; left: 50%; top: 50%; width: 1.5px; height: 50%; margin-left: -0.75px; transform-origin: top center; background: #019ACB; opacity: 0.2; animation: faApple 2.8s ease-in-out infinite; }
@keyframes faApple { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.85; } }
.fa-px { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; width: clamp(58px, 12vw, 78px); }
.fa-px-c { aspect-ratio: 1; background: #019ACB; opacity: 0.18; border-radius: 2px; animation: faPx 2.4s ease-in-out infinite; }
@keyframes faPx { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.9; } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;



