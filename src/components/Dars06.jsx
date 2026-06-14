import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Что такое дробь (часть целого) — frac_5_01
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
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'm' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
// v5.2: одноязычная строка идёт БЕЗ тега — сервер определяет язык сам (ru=кириллица, uz=латиница).
// Смешанных (билингвальных) строк в math нет; теги/[end] остаются заботой языковых курсов.

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS (v5.2): {base}/api/tts?text=<текст, encoded>&g=m|f — только text + g.
function buildTtsUrl(base, text, gender) {
  const enc = encodeURIComponent(String(text).slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
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

    const gender = segment.g || ttsConfig.voiceGender || this.gender;
    el.src = buildTtsUrl(base, segment.text, gender);
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
            <div className="mono small" style={{ color: T.ink3 }}>
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev }) => {
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
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : T.ink3 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass={c[`hint_${picked}`] ? 'frame-tip' : undefined}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {solved ? t(c.correct_text) : t(c[`hint_${picked}`] || c[`wrong_${picked}`] || c.wrong_default)}
          </p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// ============================================================
// NUM INPUT SCREEN — числовой ввод: веди-до-верного + наводящая подсказка, счёт первой попытки.
// ============================================================
const NumInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, storedAnswer, onAnswer, onNext, onPrev }) => {
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
        <div className="fade-up"><h2 className="title h-sub">{t(c.question)}</h2></div>
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
            <p className="body" style={{ margin: 0 }}>{t(c.hint)}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// --- ПОД УРОК: frac_5_01 ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-01-v1',
  lessonTitle: { ru: 'Что такое дробь (часть целого)', uz: "Kasr nima (butunning qismi)" }
};
const TOTAL_SCREENS = 13;

// Обучающий урок — НЕ оценивается (teaching_methodology §1.4): scored:false везде,
// проверочные — веди-до-верного, recordAnswer пишет firstTry для аналитики.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's5',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'case',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',   scored: false, scope: null },
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
    label: { ru: 'Как устроена дробь', uz: "Kasr qanday tuzilgan" },
    title: { ru: 'Дробь — это одно число, а не две цифры.', uz: "Kasr — bu bitta son, ikkita raqam emas." },
    card_top: { ru: 'Числитель (сверху) — сколько долей взяли.', uz: "Surat (yuqorida) — nechta ulush olingani." },
    card_bottom: { ru: 'Знаменатель (снизу) — на сколько равных долей разделили целое.', uz: "Maxraj (pastda) — butun nechta teng ulushga bo'lingani." },
    card_line: { ru: 'Чёрточка между ними — это дробная черта.', uz: "Ular orasidagi chiziq — kasr chizig'i." },
    outro: { ru: 'В дроби три пятых: числитель 3, знаменатель 5. Вместе они задают одно число — часть целого.', uz: "Beshdan uch kasrida: surat 3, maxraj 5. Birgalikda ular bitta sonni — butunning qismini bildiradi." },
    audio: { ru: 'Дробь — это одно число, а не две отдельные цифры. Число сверху называется числитель: оно показывает, сколько равных долей мы взяли. Число снизу называется знаменатель: оно показывает, на сколько равных долей разделили целое. В дроби три пятых числитель три, знаменатель пять.', uz: "Kasr — bu bitta son, ikkita alohida raqam emas. Yuqoridagi son surat deyiladi: u nechta teng ulush olganimizni ko'rsatadi. Pastdagi son maxraj deyiladi: u butunni nechta teng ulushga bo'lganimizni ko'rsatadi. Beshdan uch kasrida surat uch, maxraj besh." }
  },

  // ---- s4 TEST (input): запиши числитель (3) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Полоса разделена на 5 равных долей, закрашены 3. Запиши числитель этой дроби.', uz: "Chiziq 5 ta teng ulushga bo'lingan, 3 tasi bo'yalgan. Bu kasrning suratini yozing." },
    placeholder: { ru: '?', uz: "?" },
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

  // ---- s6 TEST (choice, pictures): где 1/3 (correct idx 2) ----
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Где закрашена одна третья?', uz: "Qayerda uchdan bir bo'yalgan?" },
    question: { ru: 'На какой полосе закрашена ровно одна третья?', uz: "Qaysi chiziqda aniq uchdan bir bo'yalgan?" },
    opt0: { ru: 'Доли разного размера', uz: "Qismlar har xil o'lchamda" },
    opt1: { ru: '4 равные доли, 1 закрашена', uz: "4 ta teng ulush, 1 tasi bo'yalgan" },
    opt2: { ru: '3 равные доли, 1 закрашена', uz: "3 ta teng ulush, 1 tasi bo'yalgan" },
    opt3: { ru: '3 равные доли, 2 закрашены', uz: "3 ta teng ulush, 2 tasi bo'yalgan" },
    correct_text: { ru: 'Верно: целое разделено на 3 равные доли, закрашена 1. Это одна третья.', uz: "To'g'ri: butun 3 ta teng ulushga bo'lingan, 1 tasi bo'yalgan. Bu — uchdan bir." },
    hint_0: { ru: 'Здесь доли разного размера — это не дробь. Нужны равные доли.', uz: "Bu yerda qismlar har xil o'lchamda — bu kasr emas. Teng ulushlar kerak." },
    hint_1: { ru: 'Тут целое разделено на 4 доли, а нам нужна одна третья — деление на 3.', uz: "Bu yerda butun to'rt ulushga bo'lingan, bizga esa uchdan bir kerak — uchga bo'lish." },
    hint_3: { ru: 'Здесь закрашены 2 доли из 3 — это две третьих, а не одна.', uz: "Bu yerda uch ulushdan ikkitasi bo'yalgan — bu uchdan ikki, uchdan bir emas." },
    wrong_default: { ru: 'Одна третья — это 3 равные доли, 1 из них закрашена.', uz: "Uchdan bir — bu uchta teng ulush, bittasi bo'yalgan." },
    audio: {
      intro: { ru: 'Найди полосу, где закрашена ровно одна третья. Подумай: сколько должно быть равных долей и сколько закрашено.', uz: "Aniq uchdan bir bo'yalgan chiziqni toping. O'ylab ko'ring: nechta teng ulush bo'lishi va nechtasi bo'yalishi kerak." },
      on_correct: { ru: 'Верно. Три равные доли, одна закрашена — это одна третья.', uz: "To'g'ri. Uchta teng ulush, bittasi bo'yalgan — bu uchdan bir." },
      on_wrong: { ru: 'Пока не то. Одна третья — это деление на три равные доли и одна закрашенная.', uz: "Hali emas. Uchdan bir — uchta teng ulushga bo'lish va bittasi bo'yalgan." }
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

  // ---- s8 CASE setup: Карим наливает сок (стакан 4 части, налито 3) ----
  s8: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
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
    audio: {
      intro: { ru: 'Стакан разделён на четыре равные части, заполнены три. Выбери дробь, которая показывает, сколько сока налито.', uz: "Stakan to'rtta teng qismga bo'lingan, uchtasi to'lgan. Qancha sharbat quyilganini ko'rsatadigan kasrni tanlang." },
      on_correct: { ru: 'Верно. Три части из четырёх — три четвёртых стакана.', uz: "To'g'ri. To'rttadan uch qism — stakanning to'rtdan uchi." },
      on_wrong: { ru: 'Пока нет. Сверху — сколько частей заполнено, снизу — на сколько частей разделён стакан.', uz: "Hali emas. Yuqorida — nechta qism to'lgani, pastda — stakan nechta qismga bo'lingani." }
    }
  },

  // ---- s10 CASE conclusion (choice, text): что значит 3/4 (correct idx 0) ----
  s10: {
    eyebrow: { ru: 'Задача · сок', uz: "Masala · sharbat" },
    label: { ru: 'Что это значит', uz: "Bu nimani bildiradi" },
    question: { ru: 'Мы записали три четвёртых. Что это означает про сок в стакане?', uz: "Biz to'rtdan uchni yozdik. Bu stakandagi sharbat haqida nimani bildiradi?" },
    opt0: { ru: 'Стакан разделён на 4 равные части, и 3 из них с соком.', uz: "Stakan 4 ta teng qismga bo'lingan va 3 tasida sharbat bor." },
    opt1: { ru: 'В стакане ровно 3 литра сока.', uz: "Stakanda aniq 3 litr sharbat bor." },
    opt2: { ru: 'Стакан разделён на 3 части, и 4 заполнены.', uz: "Stakan 3 qismga bo'lingan va 4 tasi to'lgan." },
    opt3: { ru: 'Сока и пустого места поровну.', uz: "Sharbat va bo'sh joy teng." },
    correct_text: { ru: 'Верно: три четвёртых значит, что целое — это 4 равные части, и заняты 3 из них.', uz: "To'g'ri: to'rtdan uch — butun 4 ta teng qism, va ulardan 3 tasi band degani." },
    hint_1: { ru: 'Дробь не говорит про литры. Она показывает, сколько равных частей из целого занято.', uz: "Kasr litrlar haqida gapirmaydi. U butundan nechta teng qism band ekanini ko'rsatadi." },
    hint_2: { ru: 'Знаменатель 4 — это число частей, а числитель 3 — сколько занято. Не наоборот.', uz: "Maxraj to'rt — qismlar soni, surat uch — nechta band ekani. Aksincha emas." },
    hint_3: { ru: 'Поровну было бы две четвёртых. А у нас три из четырёх — больше половины.', uz: "Teng bo'lsa, to'rtdan ikki bo'lardi. Bizda esa to'rttadan uch — yarmidan ko'p." },
    wrong_default: { ru: 'Три четвёртых: целое — 4 равные части, заняты 3 из них.', uz: "To'rtdan uch: butun — to'rtta teng qism, ulardan uchtasi band." },
    audio: {
      intro: { ru: 'Мы записали три четвёртых. Выбери, что это означает про сок в стакане.', uz: "Biz to'rtdan uchni yozdik. Bu stakandagi sharbat haqida nimani bildirishini tanlang." },
      on_correct: { ru: 'Верно. Целое — это четыре равные части, и три из них заняты соком.', uz: "To'g'ri. Butun — to'rtta teng qism, va ulardan uchtasi sharbat bilan band." },
      on_wrong: { ru: 'Пока нет. Дробь показывает части целого, а не литры. Знаменатель — число частей, числитель — сколько занято.', uz: "Hali emas. Kasr butunning qismlarini ko'rsatadi, litrlarni emas. Maxraj — qismlar soni, surat — nechta band ekani." }
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
    audio: {
      intro: { ru: 'Последнее задание. Полоса разделена на пять равных долей, закрашены две. Выбери нужную дробь.', uz: "Oxirgi topshiriq. Chiziq beshta teng ulushga bo'lingan, ikkitasi bo'yalgan. Kerakli kasrni tanlang." },
      on_correct: { ru: 'Верно. Две закрашенные доли из пяти — две пятых.', uz: "To'g'ri. Beshta ulushdan ikkitasi bo'yalgan — beshdan ikki." },
      on_wrong: { ru: 'Пока нет. Сверху — число закрашенных долей, снизу — на сколько долей разделили целое.', uz: "Hali emas. Yuqorida — bo'yalgan ulushlar soni, pastda — butun nechta ulushga bo'lingani." }
    }
  },

  // ---- s12 SUMMARY: без счёта, закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
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
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ (под тему «часть целого»)
// ============================================================
// Полоса-модель: делит целое на равные (parts) или неравные (segWidths) доли,
// закрашивает shaded первых или произвольные (shadedSet). interactive — клик по доле.
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

// Стакан-модель: вертикальный столбик из parts равных частей, заполнен снизу (filled).
const GlassModel = ({ parts = 4, filled = 0 }) => (
  <div style={{ display: 'flex', flexDirection: 'column-reverse', width: 'clamp(54px, 14vw, 74px)', height: 'clamp(120px, 28vw, 158px)', borderRadius: '8px 8px 14px 14px', overflow: 'hidden', boxShadow: '0 6px 16px -6px rgba(58, 53, 48, 0.2)', background: T.paper, border: `2px solid ${T.ink2}` }}>
    {Array.from({ length: parts }).map((_, i) => (
      <div key={i} style={{ flex: 1, background: i < filled ? T.blue : T.paper, borderTop: i > 0 ? `1.5px solid ${T.ink3}` : 'none', transition: 'background 0.2s' }}/>
    ))}
  </div>
);

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// s0 — HOOK: любой выбор продвигает дальше (нет верного); при возврате полный сброс.
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'center' }}>
        <h1 className="title h-title fade-up">{t(c.title)}</h1>
        <div className="frame fade-up delay-1 hook-alive" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <BarModel parts={5} shaded={3} height={'clamp(48px, 10vw, 60px)'}/>
          <p className="small mono" style={{ color: T.ink3, margin: 0 }}>3 / 5</p>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.body)}</p>
        <h2 className="title h-sub fade-up delay-2">{t(c.question)}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step-by-step: ученик жмёт «Дальше», полоса раскрывается, голос ведёт.
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang];
  const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); setTimeout(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const parts = step >= 2 ? 5 : 1;
  const shaded = step >= 3 ? 3 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <BarModel parts={parts} shaded={shaded} height={'clamp(52px, 11vw, 64px)'}/>
          {step >= 3 && (<p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>)}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider + tap: собери 3/4. Слайдер задаёт число долей, тап закрашивает.
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
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <p className="small fade-up delay-1" style={{ color: T.accent, fontWeight: 600 }}>{t(c.target_text)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <BarModel parts={parts} shadedSet={shadedSet} interactive={!solved} onToggle={toggle} height={'clamp(52px, 11vw, 64px)'}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {parts}</p>
            <Slider value={parts} min={2} max={6} step={1} onChange={onSlider} disabled={solved}/>
          </div>
          {!solved && (<div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(11px, 1.8vw, 13px) clamp(20px, 2.6vw, 28px)', fontSize: 'clamp(13px, 1.6vw, 14px)' }}>{t(c.btn_check)}</button></div>)}
        </div>
        <FeedbackBlock show={checked} isCorrect={solved} wrongClass={solved ? undefined : 'frame-tip'}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? t(c.fb_success_title) : t(c.fb_wrong_title)}</p>
          <p className="body" style={{ margin: 0 }}>{solved ? t(c.fb_success) : t(c.fb_wrong)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s3 — RULE: числитель / знаменатель.
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.title)}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 6vw, 44px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Frac n="3" d="5" size="display"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220, flex: 1 }}>
            <p className="body" style={{ margin: 0 }}>{t(c.card_top)}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{t(c.card_bottom)}</p>
            <p className="small" style={{ margin: 0, color: T.ink3 }}>{t(c.card_line)}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s4 — TEST input + полоса: запиши числитель (3). Веди-до-верного + подсказка (логика NumInputScreen).
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4; const sfx = useSfx();
  const correct = 3;
  const audio = useAudio([{ id: 's4_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
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
    const ok = v === correct;
    if (firstTryRef.current === null) { firstTryRef.current = ok; firstAnsRef.current = String(v); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: 'practice', screenIdx: 4, question: c.question[lang], options: null, correctIndex: null, correctAnswer: String(correct), studentAnswerIndex: null, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) { const wv = (c.audio_hint && c.audio_hint[lang]) || (c.hint && c.hint[lang]) || c.audio.on_wrong[lang]; e.pushOneOff(ok ? c.audio.on_correct[lang] : wv); }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="fade-up"><h2 className="title h-sub">{t(c.question)}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <BarModel parts={5} shaded={3} height={'clamp(48px, 10vw, 60px)'}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
                onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
                onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(56px, 13vw, 72px)', fontSize: 'clamp(20px, 4vw, 26px)' }}/>
              <span style={{ height: 2, background: T.ink, width: '100%', minWidth: 44, margin: '5px 0', borderRadius: 1 }}/>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(22px, 4vw, 28px)' }}>5</span>
            </span>
            {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
          </div>
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.hint)}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s5 — RULE: равные доли (полоса равная vs неравная).
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.title)}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <BarModel parts={4} shaded={1} height={40}/>
            <p className="small" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{t(c.card_ok)}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <BarModel segWidths={[1, 2, 0.7, 1.3]} shaded={1} height={40}/>
            <p className="small" style={{ margin: 0, color: T.ink3, fontWeight: 600 }}>{t(c.card_bad)}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s6 — TEST choice (картинки): где 1/3 (correct idx 2).
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const optWrap = (bar, cap) => (<div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>{bar}<span className="small" style={{ color: T.ink2 }}>{cap}</span></div>);
  const options = [
    optWrap(<BarModel segWidths={[1, 2, 0.8]} shaded={1} height={38}/>, t(c.opt0)),
    optWrap(<BarModel parts={4} shaded={1} height={38}/>, t(c.opt1)),
    optWrap(<BarModel parts={3} shaded={1} height={38}/>, t(c.opt2)),
    optWrap(<BarModel parts={3} shaded={2} height={38}/>, t(c.opt3)),
  ];
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={c} question={question} options={options} correctIdx={2}/>;
};

// s7 — TEST choice (дроби): назови дробь полосы 3/4 (correct idx 1).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const options = [<Frac n="4" d="3" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="3" d="1" size="mid"/>, <Frac n="1" d="4" size="mid"/>];
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><BarModel parts={4} shaded={3} height={40}/></div></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} question={question} options={options} correctIdx={1}/>;
};

// s8 — CASE setup: Карим, стакан.
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.body_p1)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 48px)', alignItems: 'center', flexWrap: 'wrap' }}>
          <GlassModel parts={4} filled={3}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.card_glass_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_glass_value)}</p></div>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_filled_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_filled_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (дроби): запиши 3/4 (correct idx 2).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const options = [<Frac n="4" d="3" size="mid"/>, <Frac n="3" d="1" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="1" d="4" size="mid"/>];
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}><GlassModel parts={4} filled={3}/></div></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} question={question} options={options} correctIdx={2}/>;
};

// s10 — CASE conclusion (текст): что значит 3/4 (correct idx 0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const options = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={c} question={question} options={options} correctIdx={0}/>;
};

// s11 — TEST choice (дроби): назови дробь полосы 2/5 (correct idx 1).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const options = [<Frac n="5" d="2" size="mid"/>, <Frac n="2" d="5" size="mid"/>, <Frac n="2" d="3" size="mid"/>, <Frac n="3" d="5" size="mid"/>];
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}><BarModel parts={5} shaded={2} height={50}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={c} question={question} options={options} correctIdx={1}/>;
};

// s12 — SUMMARY: без счёта, закрывает крючок; onFinished один раз.
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};
const Screen12 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'center' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.success }}>{t(c.label)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.title)}</h2>
        </div>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{t(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0, width: 'clamp(120px, 30vw, 180px)' }}><BarModel parts={5} shaded={3} height={38}/></div>
          <p className="body" style={{ margin: 0, flex: 1, minWidth: 180 }}>{t(c.back_to_hook)}</p>
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
  // Preview-режим = props от LMS не пришли (запуск в artifacts).
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  // Конфигурируем урок: движок/SFX/AI читают из ttsConfig.
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
  // Обучающий урок не оценивается (teaching_methodology §1.4): scored:false на всех
  // экранах → score-поля payload = 0/false. Аналитика первой попытки сохраняется (firstTryStats).
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
    // аналитика первой попытки (ученику не показывается)
    firstTryStats: {
      total: checked.length,
      firstTryCorrect: checked.filter(a => a.firstTry === true).length
    },
    answers: answers.filter(Boolean)
  };
  safeOnFinished(payload);
}, [answers, safeOnFinished]);

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12];
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
// CSS-БЛОК (STYLES) — визуальный язык v15 из infrastructure_v1 + math-дополнения
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
  height: 3px;
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
`;

