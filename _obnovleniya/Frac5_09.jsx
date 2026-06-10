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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(17px, 2.5vw, 24px)' }}>
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
                style={{ padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12 }}>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(17px, 2.5vw, 24px)' }}>
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
// --- ПОД УРОК: frac_5_09 — Сложение дробей с равными знаменателями ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-09-v1',
  lessonTitle: { ru: 'Сложение дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni qo'shish" }
};
const TOTAL_SCREENS = 14;

// Обучающий урок: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's4',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's10', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's12', type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Один ученик сложил две дроби так: 3/5 + 1/5 = 4/10.', uz: "Bir o'quvchi ikki kasrni shunday qo'shdi: 3/5 + 1/5 = 4/10." },
    body: { ru: 'Он сложил и числители, и знаменатели. Получилось 4/10 — меньше половины. А две доли пятых уже больше половины. Что-то не так.', uz: "U suratlarni ham, maxrajlarni ham qo'shdi. 4/10 chiqdi — yarimdan kam. Beshdan ikki ulush esa yarimdan ko'p. Bu yerda nimadir noto'g'ri." },
    question: { ru: 'Как думаешь: 3/5 + 1/5 = 4/10 — это правильно?', uz: "Sizningcha: 3/5 + 1/5 = 4/10 — to'g'rimi?" },
    opt0: { ru: 'Нет, тут ошибка', uz: "Yo'q, bu yerda xato" },
    opt1: { ru: 'Да, всё верно', uz: "Ha, hammasi to'g'ri" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Один ученик сложил две дроби так: три пятых плюс одна пятая равно четыре десятых. Он сложил и числители, и знаменатели. Но четыре десятых это меньше половины, а две доли пятых уже больше половины. Как думаешь, это правильно? Выбери ответ.', uz: "Bir o'quvchi ikki kasrni shunday qo'shdi: beshdan uch plyus beshdan bir teng o'ndan to'rt. U suratlarni ham, maxrajlarni ham qo'shdi. Lekin o'ndan to'rt yarimdan kam, beshdan ikki ulush esa yarimdan ko'p. Sizningcha, bu to'g'rimi? Javobni tanlang." }
  },
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Сложим 3/5 и 1/5 на полосе', uz: "3/5 va 1/5 ni chiziqda qo'shamiz" },
    conclusion: { ru: 'Доли одного размера. Сложили их количество: 3 и ещё 1 — это 4 доли. Знаменатель тот же. 3/5 + 1/5 = 4/5.', uz: "Ulushlar bir o'lchamda. Ularning sonini qo'shdik: 3 va yana 1 — bu 4 ulush. Maxraj o'sha. 3/5 + 1/5 = 4/5." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Сложим три пятых и одну пятую на полосе. Нажимай кнопку дальше.',
        'Вот полоса, поделённая на пять равных частей. Закрашены три из них — это три пятых.',
        'Добавляем ещё одну пятую — закрашиваем ещё одну долю. Доли одного размера, поэтому просто считаем, сколько их стало.',
        'Стало четыре закрашенные доли из пяти. Это четыре пятых. Знаменатель остался пять. Значит, три пятых плюс одна пятая равно четыре пятых, а не четыре десятых.'
      ],
      uz: [
        "Beshdan uch va beshdan birni chiziqda qo'shamiz. Davom etish tugmasini bosing.",
        "Mana besh teng bo'lakka bo'lingan chiziq. Uchtasi bo'yalgan — bu beshdan uch.",
        "Yana beshdan birni qo'shamiz — yana bitta ulushni bo'yaymiz. Ulushlar bir o'lchamda, shuning uchun shunchaki nechta bo'lganini sanaymiz.",
        "Beshdan to'rtta ulush bo'yaldi. Bu beshdan to'rt. Maxraj besh bo'lib qoldi. Demak, beshdan uch plyus beshdan bir teng beshdan to'rt, o'ndan to'rt emas."
      ]
    }
  },
  s2: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Сложение при равном знаменателе', uz: "Maxraj teng bo'lganda qo'shish" },
    title: { ru: 'Складываем числители, а знаменатель не меняем.', uz: "Suratlarni qo'shamiz, maxrajni o'zgartirmaymiz." },
    card_top: { ru: 'Числитель — сколько долей всего. Складываем: 3 + 1 = 4.', uz: "Surat — jami nechta ulush. Qo'shamiz: 3 + 1 = 4." },
    card_bottom: { ru: 'Знаменатель — размер доли. Он один и тот же, поэтому не меняется.', uz: "Maxraj — ulush o'lchami. U bir xil, shuning uchun o'zgarmaydi." },
    card_line: { ru: '3/5 + 1/5 = 4/5. Знаменатель остался 5.', uz: "3/5 + 1/5 = 4/5. Maxraj 5 bo'lib qoldi." },
    outro: { ru: 'Складывать знаменатели нельзя — это размер доли, а не количество.', uz: "Maxrajlarni qo'shib bo'lmaydi — bu ulush o'lchami, soni emas." },
    audio: { ru: 'Запомни правило. Когда у дробей одинаковый знаменатель, складываем только числители, а знаменатель оставляем тем же. Числитель показывает, сколько долей всего: три плюс один четыре. Знаменатель это размер доли, он один и тот же, поэтому не меняется. Три пятых плюс одна пятая равно четыре пятых.', uz: "Qoidani eslab qoling. Kasrlarning maxraji bir xil bo'lganda, faqat suratlarni qo'shamiz, maxrajni esa o'sha qoldiramiz. Surat jami nechta ulush ekanini ko'rsatadi: uch plyus bir to'rt. Maxraj ulush o'lchami, u bir xil, shuning uchun o'zgarmaydi. Beshdan uch plyus beshdan bir teng beshdan to'rt." }
  },
  s3: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Сложи: 4/9 + 2/9 = ?/9. Введи числитель.', uz: "Qo'sh: 4/9 + 2/9 = ?/9. Suratni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель остаётся 9. Сложи только числители: 4 + 2.', uz: "Maxraj 9 bo'lib qoladi. Faqat suratlarni qo'shing: 4 + 2." },
    fb_correct: { ru: 'Верно. 4 + 2 = 6, знаменатель 9 не меняется: получается 6/9.', uz: "To'g'ri. 4 + 2 = 6, maxraj 9 o'zgarmaydi: 6/9 chiqadi." },
    audio: {
      intro: { ru: 'Сложи четыре девятых и две девятых. Введи числитель и нажми кнопку проверить.', uz: "To'qqizdan to'rt va to'qqizdan ikkini qo'shing. Suratni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Четыре плюс два шесть, знаменатель девять.', uz: "To'g'ri. To'rt plyus ikki olti, maxraj to'qqiz." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь девять, сложи числители четыре и два.', uz: "Unchalik emas. Maxrajni to'qqiz qoldiring, suratlar to'rt va ikkini qo'shing." }
    }
  },
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сложи дроби', uz: "Kasrlarni qo'shing" },
    question: { ru: '2/7 + 3/7 = ?', uz: "2/7 + 3/7 = ?" },
    correct_text: { ru: 'Правильно. Числители 2 + 3 = 5, знаменатель 7 не меняется: 5/7.', uz: "To'g'ri. Suratlar 2 + 3 = 5, maxraj 7 o'zgarmaydi: 5/7." },
    wrong_0: { ru: 'Складывать знаменатели нельзя. Знаменатель это размер доли, он остаётся 7. Сложи только числители: 2 + 3 = 5.', uz: "Maxrajlarni qo'shib bo'lmaydi. Maxraj ulush o'lchami, u 7 bo'lib qoladi. Faqat suratlarni qo'shing: 2 + 3 = 5." },
    wrong_2: { ru: 'Числитель посчитан неверно. Два плюс три это пять, а не шесть. Выйдет 5/7.', uz: "Surat noto'g'ri sanaldi. Ikki plyus uch bu besh, olti emas. 5/7 chiqadi." },
    wrong_3: { ru: 'Знаменатели не перемножаются при сложении. Знаменатель один и тот же — 7. Числители: 2 + 3 = 5.', uz: "Qo'shganda maxrajlar ko'paytirilmaydi. Maxraj bir xil — 7. Suratlar: 2 + 3 = 5." },
    wrong_default: { ru: 'Знаменатель остаётся 7, складываем числители: 2 + 3 = 5. Получается 5/7.', uz: "Maxraj 7 bo'lib qoladi, suratlarni qo'shamiz: 2 + 3 = 5. 5/7 chiqadi." },
    audio: {
      intro: { ru: 'Сложи две седьмых и три седьмых. Выбери правильный вариант.', uz: "Yettidan ikki va yettidan uchni qo'shing. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Два плюс три пять, знаменатель семь.', uz: "To'g'ri. Ikki plyus uch besh, maxraj yetti." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },
  s5: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'А что, если доли заполнят целое?', uz: "Agar ulushlar butunni to'ldirsa-chi?" },
    conclusion: { ru: '2/4 + 2/4 = 4/4. Четыре четвёртых — это вся полоса, одно целое. Знаменатель не менялся, просто числитель стал равен знаменателю.', uz: "2/4 + 2/4 = 4/4. To'rtdan to'rt — bu butun chiziq, bitta butun. Maxraj o'zgarmadi, faqat surat maxrajga teng bo'ldi." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        'Знаменатель при сложении не меняется. Посмотрим, что будет, если доли заполнят всю полосу. Нажимай дальше.',
        'Полоса поделена на четыре части. Закрашены две — это две четвёртых.',
        'Добавляем ещё две четвёртых. Теперь закрашены все четыре доли.',
        'Стало четыре четвёртых. Это вся полоса, одно целое. Знаменатель не менялся, просто числитель стал равен знаменателю, и дробь стала целым числом один.'
      ],
      uz: [
        "Qo'shganda maxraj o'zgarmaydi. Ulushlar butun chiziqni to'ldirsa nima bo'lishini ko'ramiz. Davom etish tugmasini bosing.",
        "Chiziq to'rt bo'lakka bo'lingan. Ikkitasi bo'yalgan — bu to'rtdan ikki.",
        "Yana to'rtdan ikkini qo'shamiz. Endi to'rttala ulush bo'yalgan.",
        "To'rtdan to'rt bo'ldi. Bu butun chiziq, bitta butun. Maxraj o'zgarmadi, faqat surat maxrajga teng bo'ldi, va kasr butun son birga aylandi."
      ]
    }
  },
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Размер доли и целое', uz: "Ulush o'lchami va butun" },
    title: { ru: 'Знаменатель — размер доли. Если числитель стал равен знаменателю, дробь равна целому.', uz: "Maxraj — ulush o'lchami. Agar surat maxrajga teng bo'lsa, kasr butunga teng." },
    card_top: { ru: 'Знаменатель не меняется при сложении — доли остаются того же размера.', uz: "Qo'shganda maxraj o'zgarmaydi — ulushlar o'sha o'lchamda qoladi." },
    card_bottom: { ru: 'Когда закрашены все доли, числитель равен знаменателю: 4/4 = 1.', uz: "Hamma ulush bo'yalganda, surat maxrajga teng: 4/4 = 1." },
    card_line: { ru: '2/4 + 2/4 = 4/4 = 1 целое.', uz: "2/4 + 2/4 = 4/4 = 1 butun." },
    outro: { ru: 'Так дробь может стать целым числом, но знаменатель при этом не менялся.', uz: "Shunday qilib kasr butun songa aylanishi mumkin, lekin maxraj o'zgarmadi." },
    audio: { ru: 'Запомни. Знаменатель это размер доли, при сложении он не меняется. Доли остаются того же размера. Когда закрашены все доли, числитель становится равен знаменателю, и дробь равна целому. Например, четыре четвёртых это одно целое.', uz: "Eslab qoling. Maxraj ulush o'lchami, qo'shganda u o'zgarmaydi. Ulushlar o'sha o'lchamda qoladi. Hamma ulush bo'yalganda, surat maxrajga teng bo'ladi va kasr butunga teng. Masalan, to'rtdan to'rt bu bitta butun." }
  },
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Сложи: 1/6 + 4/6 = ?/6. Введи числитель.', uz: "Qo'sh: 1/6 + 4/6 = ?/6. Suratni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель остаётся 6. Сложи числители: 1 + 4.', uz: "Maxraj 6 bo'lib qoladi. Suratlarni qo'shing: 1 + 4." },
    fb_correct: { ru: 'Верно. 1 + 4 = 5, знаменатель 6: получается 5/6.', uz: "To'g'ri. 1 + 4 = 5, maxraj 6: 5/6 chiqadi." },
    audio: {
      intro: { ru: 'Сложи одну шестую и четыре шестых. Введи числитель и нажми проверить.', uz: "Oltidan bir va oltidan to'rtni qo'shing. Suratni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Один плюс четыре пять, знаменатель шесть.', uz: "To'g'ri. Bir plyus to'rt besh, maxraj olti." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь шесть, сложи числители один и четыре.', uz: "Unchalik emas. Maxrajni olti qoldiring, suratlar bir va to'rtni qo'shing." }
    }
  },
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сколько получится?', uz: "Qancha chiqadi?" },
    question: { ru: '2/4 + 2/4 = ?', uz: "2/4 + 2/4 = ?" },
    correct_text: { ru: 'Правильно. 2 + 2 = 4, знаменатель 4: это 4/4, а 4/4 — вся полоса, одно целое.', uz: "To'g'ri. 2 + 2 = 4, maxraj 4: bu 4/4, 4/4 esa butun chiziq, bitta butun." },
    wrong_1: { ru: 'Складывать знаменатели нельзя. Знаменатель остаётся 4. Числители 2 + 2 = 4, выйдет 4/4 — это целое.', uz: "Maxrajlarni qo'shib bo'lmaydi. Maxraj 4 bo'lib qoladi. Suratlar 2 + 2 = 4, 4/4 chiqadi — bu butun." },
    wrong_2: { ru: 'Числитель верный — 4, но четыре доли из четырёх заполняют всю полосу, это одно целое.', uz: "Surat to'g'ri — 4, lekin to'rtdan to'rt ulush butun chiziqni to'ldiradi, bu bitta butun." },
    wrong_3: { ru: 'Нужно сложить обе дроби, а не оставить одну. 2/4 + 2/4 = 4/4 = 1.', uz: "Ikkala kasrni qo'shish kerak, bittasini qoldirmaslik. 2/4 + 2/4 = 4/4 = 1." },
    wrong_default: { ru: 'Знаменатель 4 остаётся, числители 2 + 2 = 4. Это 4/4, а 4/4 — целое.', uz: "Maxraj 4 bo'lib qoladi, suratlar 2 + 2 = 4. Bu 4/4, 4/4 esa butun." },
    audio: {
      intro: { ru: 'Сложи две четвёртых и две четвёртых. Сколько получится? Выбери ответ.', uz: "To'rtdan ikki va to'rtdan ikkini qo'shing. Qancha chiqadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Четыре четвёртых это одно целое.', uz: "To'g'ri. To'rtdan to'rt bu bitta butun." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },
  s9: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    title: { ru: 'Достон загружает файл в два захода.', uz: "Doston faylni ikki bosqichda yuklaydi." },
    body_p1: { ru: 'Полоса загрузки поделена на 8 равных частей. Сначала загрузилось 3/8 файла, потом ещё 2/8. Сколько загрузилось всего?', uz: "Yuklash chizig'i 8 ta teng bo'lakka bo'lingan. Avval faylning 3/8 qismi yuklandi, keyin yana 2/8. Jami qancha yuklandi?" },
    card_line_label: { ru: 'Сначала', uz: "Avval" },
    card_line_value: { ru: '3/8 файла', uz: "faylning 3/8 qismi" },
    card_parts_label: { ru: 'Потом', uz: "Keyin" },
    card_parts_value: { ru: 'ещё 2/8', uz: "yana 2/8" },
    outro: { ru: 'Знаменатель у обеих долей один — восьмые. Помоги Достону на следующем шаге.', uz: "Har ikkala ulushning maxraji bir — sakkizdan. Keyingi bosqichda Dostonga yordam bering." },
    btn_help: { ru: 'Помочь Достону', uz: "Dostonga yordam berish" },
    audio: { ru: 'Достон загружает файл в два захода. Полоса загрузки поделена на восемь равных частей. Сначала загрузилось три восьмых файла, потом ещё две восьмых. Сколько загрузилось всего? Знаменатель у обеих долей один, восьмые. Подумай, как сложить.', uz: "Doston faylni ikki bosqichda yuklaydi. Yuklash chizig'i sakkiz teng bo'lakka bo'lingan. Avval faylning sakkizdan uch qismi yuklandi, keyin yana sakkizdan ikki. Jami qancha yuklandi? Har ikkala ulushning maxraji bir, sakkizdan. Qanday qo'shishni o'ylab ko'ring." }
  },
  s10: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    label: { ru: 'Сколько загрузилось?', uz: "Qancha yuklandi?" },
    question: { ru: '3/8 + 2/8 = ?', uz: "3/8 + 2/8 = ?" },
    correct_text: { ru: 'Правильно. Числители 3 + 2 = 5, знаменатель 8: загрузилось 5/8 файла.', uz: "To'g'ri. Suratlar 3 + 2 = 5, maxraj 8: faylning 5/8 qismi yuklandi." },
    wrong_1: { ru: 'Складывать знаменатели нельзя. Это одна полоса на восемь частей, знаменатель остаётся 8. Числители 3 + 2 = 5.', uz: "Maxrajlarni qo'shib bo'lmaydi. Bu sakkiz bo'lakli bitta chiziq, maxraj 8 bo'lib qoladi. Suratlar 3 + 2 = 5." },
    wrong_2: { ru: 'Числитель посчитан неверно. Три плюс два это пять, а не шесть. Выйдет 5/8.', uz: "Surat noto'g'ri sanaldi. Uch plyus ikki bu besh, olti emas. 5/8 chiqadi." },
    wrong_3: { ru: 'Знаменатели не перемножаются. Знаменатель один — 8. Числители 3 + 2 = 5.', uz: "Maxrajlar ko'paytirilmaydi. Maxraj bitta — 8. Suratlar 3 + 2 = 5." },
    wrong_default: { ru: 'Знаменатель 8 остаётся, числители 3 + 2 = 5. Загрузилось 5/8.', uz: "Maxraj 8 bo'lib qoladi, suratlar 3 + 2 = 5. 5/8 yuklandi." },
    audio: {
      intro: { ru: 'Сначала загрузилось три восьмых, потом две восьмых. Сколько всего? Выбери ответ.', uz: "Avval sakkizdan uch, keyin sakkizdan ikki yuklandi. Jami qancha? Javobni tanlang." },
      on_correct: { ru: 'Верно. Три плюс два пять, знаменатель восемь. Пять восьмых.', uz: "To'g'ri. Uch plyus ikki besh, maxraj sakkiz. Sakkizdan besh." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },
  s11: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    label: { ru: 'Сложи дроби', uz: "Kasrlarni qo'shing" },
    question: { ru: '3/7 + 2/7 = ?', uz: "3/7 + 2/7 = ?" },
    correct_text: { ru: 'Правильно. Складываем числители 3 + 2 = 5, знаменатель 7 не меняем: 5/7.', uz: "To'g'ri. Suratlarni qo'shamiz 3 + 2 = 5, maxraj 7 o'zgarmaydi: 5/7." },
    wrong_0: { ru: 'Это главная ловушка: сложил знаменатели. Знаменатель это размер доли, он остаётся 7. Складываем только числители.', uz: "Bu asosiy tuzoq: maxrajlarni qo'shgansiz. Maxraj ulush o'lchami, u 7 bo'lib qoladi. Faqat suratlarni qo'shamiz." },
    wrong_2: { ru: 'Знаменатели не перемножаются при сложении. Знаменатель один — 7. Числители 3 + 2 = 5.', uz: "Qo'shganda maxrajlar ko'paytirilmaydi. Maxraj bitta — 7. Suratlar 3 + 2 = 5." },
    wrong_3: { ru: 'Числитель посчитан неверно. Три плюс два пять, не шесть. Выйдет 5/7.', uz: "Surat noto'g'ri sanaldi. Uch plyus ikki besh, olti emas. 5/7 chiqadi." },
    wrong_default: { ru: 'Знаменатель 7 остаётся, числители 3 + 2 = 5. Получается 5/7.', uz: "Maxraj 7 bo'lib qoladi, suratlar 3 + 2 = 5. 5/7 chiqadi." },
    audio: {
      intro: { ru: 'Сложи три седьмых и две седьмых. Выбери правильный вариант.', uz: "Yettidan uch va yettidan ikkini qo'shing. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Три плюс два пять, знаменатель семь.', uz: "To'g'ri. Uch plyus ikki besh, maxraj yetti." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },
  s12: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    question: { ru: 'Сложи: 3/10 + 4/10 = ?/10. Введи числитель.', uz: "Qo'sh: 3/10 + 4/10 = ?/10. Suratni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель остаётся 10. Сложи числители: 3 + 4.', uz: "Maxraj 10 bo'lib qoladi. Suratlarni qo'shing: 3 + 4." },
    fb_correct: { ru: 'Верно. 3 + 4 = 7, знаменатель 10: получается 7/10.', uz: "To'g'ri. 3 + 4 = 7, maxraj 10: 7/10 chiqadi." },
    audio: {
      intro: { ru: 'Сложи три десятых и четыре десятых. Введи числитель и нажми проверить.', uz: "O'ndan uch va o'ndan to'rtni qo'shing. Suratni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Три плюс четыре семь, знаменатель десять.', uz: "To'g'ri. Uch plyus to'rt yetti, maxraj o'n." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь десять, сложи числители три и четыре.', uz: "Unchalik emas. Maxrajni o'n qoldiring, suratlar uch va to'rtni qo'shing." }
    }
  },
  s13: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты складываешь дроби с равным знаменателем.', uz: "Endi siz teng maxrajli kasrlarni qo'shasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'У дробей с равным знаменателем складываем числители.', uz: "Teng maxrajli kasrlarda suratlarni qo'shamiz." },
    main_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    main_3: { ru: 'Складывать знаменатели нельзя (3/5 + 1/5 это 4/5, а не 4/10).', uz: "Maxrajlarni qo'shib bo'lmaydi (3/5 + 1/5 bu 4/5, 4/10 emas)." },
    main_4: { ru: 'Если числитель стал равен знаменателю, дробь равна целому (4/4 = 1).', uz: "Agar surat maxrajga teng bo'lsa, kasr butunga teng (4/4 = 1)." },
    back_to_hook: { ru: 'Тот ученик сложил и числители, и знаменатели и получил 4/10. Правильно — 4/5: знаменатель остаётся пять.', uz: "O'sha o'quvchi suratlarni ham, maxrajlarni ham qo'shib 4/10 oldi. To'g'risi — 4/5: maxraj besh bo'lib qoladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение и вычитание столбиком» (тот же принцип сложения по разрядам) и «Что такое дробь».', uz: "«Ustun shaklida qo'shish va ayirish» (xonalar bo'yicha qo'shishning o'sha tamoyili) va «Kasr nima»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с равным знаменателем.', uz: "teng maxrajli kasrlarni ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты складываешь дроби с равным знаменателем. Складываем числители, а знаменатель оставляем тем же, это размер доли. Складывать знаменатели нельзя: три пятых плюс одна пятая это четыре пятых, а не четыре десятых. А если числитель стал равен знаменателю, дробь равна целому. Тот ученик в начале ошибся, правильный ответ четыре пятых. Дальше научимся вычитать дроби с равным знаменателем.', uz: "Zo'r. Endi siz teng maxrajli kasrlarni qo'shasiz. Suratlarni qo'shamiz, maxrajni esa o'sha qoldiramiz, bu ulush o'lchami. Maxrajlarni qo'shib bo'lmaydi: beshdan uch plyus beshdan bir bu beshdan to'rt, o'ndan to'rt emas. Agar surat maxrajga teng bo'lsa, kasr butunga teng. Boshidagi o'quvchi xato qildi, to'g'ri javob beshdan to'rt. Keyin teng maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР: SumBar — сложение долей одной величины на одной полосе.
// a долей — accent (первое слагаемое), следующие b — blue (второе). Подписи-дроби — в экранах.
// ============================================================
const SumBar = ({ a, b = 0, den, height = 40, animateIn = true }) => {
  const cells = Array.from({ length: den });
  const pa = (a / den) * 100, pb = (b / den) * 100;
  const ease = 'cubic-bezier(0.34, 1.1, 0.64, 1)';
  return (
    <div className="cp-bar" style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto', height, borderRadius: 9, background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 9, overflow: 'hidden' }}>
        <div className={animateIn ? 'cp-grow' : undefined} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pa}%`, background: T.accent, transition: `width 0.5s ${ease}` }}/>
        <div style={{ position: 'absolute', left: `${pa}%`, top: 0, bottom: 0, width: `${pb}%`, background: T.blue, transition: `left 0.5s ${ease}, width 0.5s ${ease}` }}/>
        {cells.slice(1).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${((i + 1) / den) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg }}/>
        ))}
      </div>
    </div>
  );
};

// Подпись-формула из дробей (визуальная опора): a/den + b/den = (a+b)/den
const SumLabel = ({ a, b, den, showSum = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    <Frac n={String(a)} d={String(den)} size="mid" color={T.accent}/>
    <Op>+</Op>
    <Frac n={String(b)} d={String(den)} size="mid" color={T.blue}/>
    {showSum && <><Op>=</Op>{(a + b) === den ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>1</span> : <Frac n={String(a + b)} d={String(den)} size="mid" color={T.success}/>}</>}
  </div>
);

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

// s0 — HOOK
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 24px)', justifyContent: 'center' }}>
        <h1 className="title h-title fade-up">{t(c.title)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="3" d="5" size="mid"/><Op>+</Op><Frac n="1" d="5" size="mid"/><Op>=</Op><Frac n="4" d="10" size="mid" color={T.accent}/><span className="mop" style={{ color: T.ink3 }}>?</span></div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.body)}</p>
        <h2 className="title h-sub fade-up delay-2">{t(c.question)}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: 3/5 + 1/5 = 4/5
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); setTimeout(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const a = step >= 1 ? 3 : 0; const b = step >= 2 ? 1 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 26px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 120, justifyContent: 'center' }}>
          <SumBar a={a} b={b} den={5}/>
          {step >= 1 && <SumLabel a={3} b={1} den={5} showSum={step >= 3}/>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — RULE
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 26px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.title)}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SumBar a={3} b={1} den={5}/>
          <SumLabel a={3} b={1} den={5}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460, margin: '0 auto' }}>
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

// s3 — TEST input 4/9+2/9 -> 6
const Screen3 = (props) => {
  const c = CONTENT.s3;
  return <NumInputScreen {...props} idx={3} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[3]} screenContent={c} correctValue={6}/>;
};

// s4 — TEST choice 2/7+3/7 -> 5/7
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const base = [<Frac n="5" d="14" size="mid"/>, <Frac n="5" d="7" size="mid"/>, <Frac n="6" d="7" size="mid"/>, <Frac n="5" d="49" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><SumBar a={2} b={3} den={7}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — EXPLORATION step: 2/4 + 2/4 = 4/4 = 1
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s5_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); setTimeout(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const a = step >= 1 ? 2 : 0; const b = step >= 2 ? 2 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 26px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 120, justifyContent: 'center' }}>
          <SumBar a={a} b={b} den={4}/>
          {step >= 1 && <SumLabel a={2} b={2} den={4} showSum={step >= 3}/>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center', color: T.success }}>{t(c.conclusion)}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s6 — RULE
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 26px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.title)}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SumBar a={2} b={2} den={4}/>
          <SumLabel a={2} b={2} den={4}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460, margin: '0 auto' }}>
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

// s7 — TEST input 1/6+4/6 -> 5
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <NumInputScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={5}/>;
};

// s8 — TEST choice 2/4+2/4 -> 1
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [<span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)' }}>1</span>, <Frac n="4" d="8" size="mid"/>, <Frac n="4" d="4" size="mid"/>, <Frac n="2" d="4" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><SumBar a={2} b={2} den={4}/></div></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s9 — CASE setup
const Screen9 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 24px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.body_p1)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SumBar a={3} b={2} den={8}/>
          <SumLabel a={3} b={2} den={8} showSum={false}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s10 — CASE step 3/8+2/8 -> 5/8
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [<Frac n="5" d="8" size="mid"/>, <Frac n="5" d="16" size="mid"/>, <Frac n="6" d="8" size="mid"/>, <Frac n="5" d="64" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><SumBar a={3} b={2} den={8}/></div></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST choice FINAL 3/7+2/7 -> 5/7
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="5" d="14" size="mid"/>, <Frac n="5" d="7" size="mid"/>, <Frac n="5" d="49" size="mid"/>, <Frac n="6" d="7" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [0, 2, 3, 1]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><SumBar a={3} b={2} den={7}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s12 — TEST input FINAL 3/10+4/10 -> 7
const Screen12 = (props) => {
  const c = CONTENT.s12;
  return <NumInputScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={c} correctValue={7}/>;
};

// s13 — SUMMARY + связи
const Screen13 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 24px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.success }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.title)}</h2></div>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{t(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SumLabel a={3} b={1} den={5}/>
          <p className="body" style={{ margin: 0 }}>{t(c.back_to_hook)}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionAddSameDenLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13];
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
.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(17px, 2.5vw, 20px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.5; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(12px, 2vw, 18px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(10px, 1.7vw, 16px);
  padding-bottom: clamp(17px, 3.4vw, 34px);
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
  padding-top: clamp(12px, 2vw, 15px);
  padding-bottom: clamp(12px, 2vw, 15px);
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
  padding: clamp(17px, 3.4vw, 30px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
}
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 20px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 20px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}

/* MATH: анимация появления цифры в квадрате. */
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* MATH: сравнение разных знаменателей — приведение к общим долям (frac_5_07). */
.cp-row { animation: cpRowIn 0.42s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpRowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.cp-grow { animation: cpGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpGrow { from { width: 0; } }
/* линии сетки въезжают слева направо (деление на общие доли) */
.cp-line { animation: cpLineIn 0.32s ease-out backwards; transform-origin: center top; }
@keyframes cpLineIn { from { opacity: 0; transform: scaleY(0.1); } to { opacity: 1; transform: scaleY(1); } }
.cp-marker { animation: cpMarkerIn 0.3s ease-out backwards; }
@keyframes cpMarkerIn { from { opacity: 0; } }
.cp-slide { animation: cpSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpSlide { from { left: 0; } }
.cp-flag { transform-origin: bottom left; animation: cpFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, cpFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cpFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cpFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
/* ориентир 1/2 въезжает к центру; точки-дроби мягко появляются */
.cp-half-in { animation: cpHalfIn 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpHalfIn { from { left: 0; opacity: 0; } }
.cp-dot-wrap { animation: cpDotIn 0.35s ease-out backwards; }
@keyframes cpDotIn { from { opacity: 0; } }
/* MATH: сокращение — слияние долей, счётчик, лесенка деления (frac_5_08). */
.cp-merge { animation: cpMerge 0.5s ease forwards; }
@keyframes cpMerge { from { opacity: 1; } to { opacity: 0; } }
.cp-spin { animation: cpSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes cpSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.cp-ladder-step { animation: cpLadderIn 0.4s ease-out backwards; }
@keyframes cpLadderIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
`;
