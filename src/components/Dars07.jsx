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
// --- ПОД УРОК: frac_5_02 — Дробь на числовой прямой ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-02-v1',
  lessonTitle: { ru: 'Дробь на числовой прямой', uz: "Kasr son o'qida" }
};
const TOTAL_SCREENS = 13;

// Обучающий урок — НЕ оценивается (teaching_methodology §1.4): scored:false везде,
// проверочные — веди-до-верного, recordAnswer пишет firstTry для аналитики.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
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
  // ---- s0 HOOK: Малика хочет отметить 3/4 на линии, Жасур: «это просто кусок, не место» ----
  s0: {
    eyebrow: { ru: 'Дробь на прямой · вступление', uz: "Kasr o'qda · kirish" },
    title: { ru: 'Малика чертит линейку от 0 до 1 и хочет отметить на ней три четвёртых.', uz: "Malika 0 dan 1 gacha chizg'ich chizadi va unda to'rtdan uchni belgilamoqchi." },
    body: { ru: 'Жасур качает головой: «три четвёртых — это же просто кусок, его нельзя поставить точкой на линии. Это не настоящее число с местом».', uz: "Jasur bosh chayqaydi: «to'rtdan uch — bu shunchaki bir bo'lak-ku, uni chiziqqa nuqta qilib qo'yib bo'lmaydi. Bu o'z joyi bor haqiqiy son emas»." },
    question: { ru: 'А ты как думаешь: можно ли поставить три четвёртых одной точкой на линии между 0 и 1?', uz: "Sizningcha-chi: to'rtdan uchni 0 va 1 orasidagi chiziqqa bitta nuqta bilan qo'yish mumkinmi?" },
    opt0: { ru: 'Да — у дроби есть своё место на линии', uz: "Ha — kasrning chiziqda o'z joyi bor" },
    opt1: { ru: 'Нет — дробь это только кусок, а не место', uz: "Yo'q — kasr faqat bo'lak, joy emas" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Малика чертит линейку от нуля до единицы и хочет отметить на ней три четвёртых. Жасур говорит, что три четвёртых это просто кусок, его нельзя поставить точкой. А ты как думаешь — можно ли поставить три четвёртых одной точкой на линии между нулём и единицей? Выбери ответ.', uz: "Malika noldan birgacha chizg'ich chizadi va unda to'rtdan uchni belgilamoqchi. Jasur aytadiki, to'rtdan uch shunchaki bo'lak, uni nuqta qilib qo'yib bo'lmaydi. Sizningcha, to'rtdan uchni nol va bir orasidagi chiziqqa bitta nuqta bilan qo'yish mumkinmi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): ставим 3/4 на отрезок 0..1 ----
  s1: {
    eyebrow: { ru: 'Дробь на прямой', uz: "Kasr o'qda" },
    title: { ru: 'Поставим 3/4 на линию по шагам', uz: "3/4 ni chiziqqa bosqichma-bosqich qo'yamiz" },
    conclusion: { ru: 'Три четвёртых — это точка: 3 шага из 4 от нуля.', uz: "To'rtdan uch — bu nuqta: noldan 4 qadamdan 3 tasi." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Поставим три четвёртых на линию по шагам. Нажимай кнопку Дальше.',
        'Вот отрезок от нуля до единицы. Это наше целое — как и полоса в прошлом уроке, только вытянутая в линию.',
        'Знаменатель четыре. Значит, делим отрезок от нуля до единицы на четыре равные части. Появились метки: одна четвёртая, две четвёртых, три четвёртых.',
        'Числитель три. Отсчитываем три шага от нуля и ставим точку. Эта точка и есть три четвёртых — у дроби нашлось своё место на линии.'
      ],
      uz: [
        "To'rtdan uchni chiziqqa bosqichma-bosqich qo'yamiz. Davom etish tugmasini bosing.",
        "Mana noldan birgacha kesma. Bu — bizning butunimiz, o'tgan darsdagi chiziqdek, faqat uzunasiga cho'zilgan.",
        "Maxraj to'rt. Demak, noldan birgacha kesmani to'rtta teng bo'lakka bo'lamiz. Belgilar paydo bo'ldi: to'rtdan bir, to'rtdan ikki, to'rtdan uch.",
        "Surat uch. Noldan uch qadam sanab, nuqta qo'yamiz. Mana shu nuqta — to'rtdan uch. Kasr chiziqda o'z joyini topdi."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider + tap): поставь 2/5 сам ----
  s2: {
    eyebrow: { ru: 'Поставь сам', uz: "O'zingiz qo'ying" },
    title: { ru: 'Поставь дробь на линию сам', uz: "Kasrni chiziqqa o'zingiz qo'ying" },
    intro: { ru: 'Двигай ползунок — меняй, на сколько равных частей делим отрезок от 0 до 1. Нажми на нужную метку, чтобы поставить точку.', uz: "Slayderni suring — 0 dan 1 gacha kesmani nechta teng bo'lakka bo'lishni o'zgartiring. Nuqta qo'yish uchun kerakli belgini bosing." },
    target_text: { ru: 'Цель: поставь две пятых — раздели на 5 частей и отметь вторую метку от нуля.', uz: "Maqsad: beshdan ikkini qo'ying — 5 ta bo'lakka bo'ling va noldan ikkinchi belgini belgilang." },
    eyebrow_slider: { ru: 'Равных частей:', uz: "Teng bo'laklar:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала поставь', uz: "Avval qo'ying" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Это две пятых: отрезок поделён на 5 равных частей, точка на второй метке от нуля.', uz: "Bu — beshdan ikki: kesma 5 ta teng bo'lakka bo'lingan, nuqta noldan ikkinchi belgida." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Нужно 5 равных частей и точка на второй метке. Поставь ползунок на 5 и нажми вторую метку от нуля.', uz: "5 ta teng bo'lak va ikkinchi belgida nuqta kerak. Slayderni 5 ga qo'ying va noldan ikkinchi belgini bosing." },
    audio: { ru: 'Поставь дробь на линию сам. Двигай ползунок, чтобы выбрать число равных частей, и нажми на метку, чтобы поставить точку. Твоя цель — две пятых: пять равных частей, точка на второй метке от нуля.', uz: "Kasrni chiziqqa o'zingiz qo'ying. Teng bo'laklar sonini tanlash uchun slayderni suring va nuqta qo'yish uchun belgini bosing. Maqsadingiz — beshdan ikki: beshta teng bo'lak, nuqta noldan ikkinchi belgida." }
  },

  // ---- s3 RULE: как поставить дробь на прямую ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Как поставить дробь на прямую', uz: "Kasrni o'qqa qanday qo'yish" },
    title: { ru: 'Дробь — это число, у него есть место на линии.', uz: "Kasr — bu son, uning chiziqda joyi bor." },
    card_bottom: { ru: 'Знаменатель — на сколько равных частей делим отрезок от 0 до 1.', uz: "Maxraj — 0 dan 1 gacha kesmani nechta teng bo'lakka bo'lamiz." },
    card_top: { ru: 'Числитель — сколько шагов отсчитываем от нуля.', uz: "Surat — noldan nechta qadam sanaymiz." },
    card_line: { ru: 'Метка, на которой остановились, — это и есть место дроби.', uz: "To'xtagan belgimiz — kasrning o'sha joyi." },
    outro: { ru: 'Знаменатель 4 делит отрезок на 4 части, числитель 3 отсчитывает 3 шага — и точка три четвёртых готова.', uz: "Maxraj 4 kesmani 4 bo'lakka bo'ladi, surat 3 esa 3 qadam sanaydi — va to'rtdan uch nuqtasi tayyor." },
    audio: { ru: 'Чтобы поставить дробь на прямую, смотри на знаменатель и числитель. Знаменатель показывает, на сколько равных частей разделить отрезок от нуля до единицы. Числитель показывает, сколько шагов отсчитать от нуля. Метка, на которой остановились, и есть место дроби. Для трёх четвёртых делим на четыре части и отсчитываем три шага.', uz: "Kasrni o'qqa qo'yish uchun maxraj va suratga qarang. Maxraj noldan birgacha kesmani nechta teng bo'lakka bo'lishni ko'rsatadi. Surat noldan nechta qadam sanashni ko'rsatadi. To'xtagan belgimiz — kasrning joyi. To'rtdan uch uchun to'rt bo'lakka bo'lib, uch qadam sanaymiz." }
  },

  // ---- s4 TEST (MC, дроби): линия 0..1, 5 частей, точка на 3-й → 3/5 (correct idx 1) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Назови дробь точки', uz: "Nuqtaning kasrini ayting" },
    question: { ru: 'Отрезок от 0 до 1 разделён на 5 равных частей. Точка стоит на третьей метке от нуля. Какая это дробь?', uz: "0 dan 1 gacha kesma 5 ta teng bo'lakka bo'lingan. Nuqta noldan uchinchi belgida turibdi. Bu qaysi kasr?" },
    correct_text: { ru: 'Верно: 5 частей — знаменатель 5, точка на 3-м шаге — числитель 3. Это три пятых.', uz: "To'g'ri: 5 bo'lak — maxraj 5, nuqta 3-qadamda — surat 3. Bu beshdan uch." },
    hint_0: { ru: 'Числитель и знаменатель перепутаны: сверху число шагов (3), снизу число частей (5).', uz: "Surat va maxraj almashgan: yuqorida qadamlar soni (uch), pastda bo'laklar soni (besh)." },
    hint_2: { ru: 'Снизу — на сколько частей разделён отрезок. Их 5, а не 4.', uz: "Pastda — kesma nechta bo'lakka bo'lingani. Ular beshta, to'rt emas." },
    hint_3: { ru: 'Сверху — сколько шагов от нуля до точки. Их 3, а не 2.', uz: "Yuqorida — noldan nuqtagacha nechta qadam. Ular uchta, ikki emas." },
    wrong_default: { ru: 'Знаменатель — число частей (5), числитель — число шагов до точки (3).', uz: "Maxraj — bo'laklar soni (besh), surat — nuqtagacha qadamlar soni (uch)." },
    audio: {
      intro: { ru: 'Отрезок от нуля до единицы разделён на пять равных частей, точка стоит на третьей метке. Выбери дробь, которая показывает её место.', uz: "Noldan birgacha kesma beshta teng bo'lakka bo'lingan, nuqta uchinchi belgida turibdi. Uning joyini ko'rsatadigan kasrni tanlang." },
      on_correct: { ru: 'Верно. Пять частей и три шага — это три пятых.', uz: "To'g'ri. Besh bo'lak va uch qadam — bu beshdan uch." },
      on_wrong: { ru: 'Пока нет. Снизу — на сколько частей разделили, сверху — сколько шагов до точки.', uz: "Hali emas. Pastda — nechta bo'lakka bo'lingani, yuqorida — nuqtagacha nechta qadam." }
    }
  },

  // ---- s5 RULE: линия не кончается на 1 — отрезок 0..2, точка 3/2 ----
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'За единицей', uz: "Birdan keyin" },
    title: { ru: 'Линия не кончается на 1.', uz: "Chiziq 1 da tugamaydi." },
    card_ok: { ru: 'После 1 линия продолжается: те же равные части идут дальше — к 2 и больше.', uz: "1 dan keyin chiziq davom etadi: o'sha teng bo'laklar yana ketadi — 2 ga va undan nariga." },
    card_bad: { ru: 'Три вторых — это три половинки: один целый и ещё половина. Точка стоит за единицей.', uz: "Ikkidan uch — bu uchta yarim: bitta butun va yana yarim. Nuqta birdan keyin turadi." },
    outro: { ru: 'Знаменатель 2 делит каждую единицу пополам. Отсчитываем 3 половинки от нуля — попадаем между 1 и 2.', uz: "Maxraj 2 har bir birlikni teng ikkiga bo'ladi. Noldan 3 ta yarimni sanaymiz — 1 va 2 orasiga tushamiz." },
    audio: { ru: 'Линия не кончается на единице. После единицы те же равные части продолжаются дальше, к двойке. Три вторых — это три половинки: целое и ещё половина. Знаменатель два делит каждую единицу пополам, а числитель три отсчитывает три половинки. Точка три вторых стоит между единицей и двойкой.', uz: "Chiziq birda tugamaydi. Birdan keyin o'sha teng bo'laklar ikki tomon davom etadi. Ikkidan uch — bu uchta yarim: butun va yana yarim. Maxraj ikki har bir birlikni yarimga bo'ladi, surat uch esa uchta yarimni sanaydi. Ikkidan uch nuqtasi bir va ikki orasida turadi." }
  },

  // ---- s6 TEST (MC, дроби): линия 0..2 в половинках, точка на 3/2 (correct idx 0) ----
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Точка за единицей', uz: "Birdan keyingi nuqta" },
    question: { ru: 'Линия от 0 до 2 разделена на половинки. Точка стоит между 1 и 2, на третьей метке от нуля. Какая это дробь?', uz: "0 dan 2 gacha chiziq yarimlarga bo'lingan. Nuqta 1 va 2 orasida, noldan uchinchi belgida turibdi. Bu qaysi kasr?" },
    correct_text: { ru: 'Верно: половинки — знаменатель 2, три шага от нуля — числитель 3. Это три вторых, между 1 и 2.', uz: "To'g'ri: yarimlar — maxraj 2, noldan uch qadam — surat 3. Bu ikkidan uch, 1 va 2 orasida." },
    hint_1: { ru: 'Числитель и знаменатель перепутаны: шагов 3, а делим на 2.', uz: "Surat va maxraj almashgan: qadamlar 3 ta, bo'lamiz esa 2 ga." },
    hint_2: { ru: 'Одна вторая стоит между 0 и 1, а наша точка — за единицей. Шагов больше.', uz: "Ikkidan bir 0 va 1 orasida turadi, bizning nuqta esa birdan keyin. Qadamlar ko'proq." },
    hint_3: { ru: 'Здесь делим на половинки, знаменатель 2, а не 4.', uz: "Bu yerda yarimlarga bo'lamiz, maxraj 2, 4 emas." },
    wrong_default: { ru: 'Половинки — знаменатель 2, три шага от нуля — числитель 3. Это три вторых.', uz: "Yarimlar — maxraj 2, noldan uch qadam — surat 3. Bu ikkidan uch." },
    audio: {
      intro: { ru: 'Линия от нуля до двух разделена на половинки. Точка стоит на третьей метке, между единицей и двойкой. Выбери нужную дробь.', uz: "Noldan ikkigacha chiziq yarimlarga bo'lingan. Nuqta uchinchi belgida, bir va ikki orasida turibdi. Kerakli kasrni tanlang." },
      on_correct: { ru: 'Верно. Три половинки от нуля — это три вторых.', uz: "To'g'ri. Noldan uchta yarim — bu ikkidan uch." },
      on_wrong: { ru: 'Пока нет. Делим на половинки — знаменатель 2, считаем три шага — числитель 3.', uz: "Hali emas. Yarimlarga bo'lamiz — maxraj 2, uch qadam sanaymiz — surat 3." }
    }
  },

  // ---- s7 TEST (MC, текст): 1/2 и 2/4 — одна точка (correct idx 0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Одна точка или разные?', uz: "Bir nuqtami yoki har xilmi?" },
    question: { ru: 'На верхней линии отмечена 1/2, на нижней — 2/4. Что про эти точки верно?', uz: "Yuqori chiziqda 1/2, pastkisida — 2/4 belgilangan. Bu nuqtalar haqida nima to'g'ri?" },
    opt0: { ru: 'Это одна и та же точка — 1/2 и 2/4 стоят на одном месте', uz: "Bu bitta nuqta — 1/2 va 2/4 bir joyda turadi" },
    opt1: { ru: 'Это разные точки — у них разные числа', uz: "Bu har xil nuqta — ularning sonlari har xil" },
    opt2: { ru: '1/2 стоит левее, потому что знаменатель меньше', uz: "1/2 chaproqda, chunki maxraji kichik" },
    opt3: { ru: '2/4 стоит правее, потому что цифры больше', uz: "2/4 o'ngroqda, chunki raqamlari katta" },
    correct_text: { ru: 'Верно: 1/2 и 2/4 — это одно и то же место на линии. Две дроби, а точка одна — они равны.', uz: "To'g'ri: 1/2 va 2/4 — chiziqda bir xil joy. Ikkita kasr, nuqta esa bitta — ular teng." },
    hint_1: { ru: 'Посмотри на линии: обе точки ровно посередине между 0 и 1. Место одно.', uz: "Chiziqlarga qarang: ikkala nuqta ham 0 va 1 ning aniq o'rtasida. Joyi bitta." },
    hint_2: { ru: 'Знаменатель меняет число меток, но место точки то же — ровно посередине.', uz: "Maxraj belgilar sonini o'zgartiradi, lekin nuqtaning joyi o'sha — aniq o'rtada." },
    hint_3: { ru: 'Больше цифр не значит правее. Обе точки в середине отрезка.', uz: "Raqamlar ko'p bo'lsa, o'ngroq degani emas. Ikkala nuqta ham kesmaning o'rtasida." },
    wrong_default: { ru: '1/2 и 2/4 стоят на одном месте — это одна точка, дроби равны.', uz: "1/2 va 2/4 bir joyda turadi — bu bitta nuqta, kasrlar teng." },
    audio: {
      intro: { ru: 'На верхней линии отмечена одна вторая, на нижней — две четвёртых. Посмотри, где стоят точки, и выбери, что про них верно.', uz: "Yuqori chiziqda ikkidan bir, pastkisida — to'rtdan ikki belgilangan. Nuqtalar qayerda turganiga qarang va ular haqida nima to'g'ri ekanini tanlang." },
      on_correct: { ru: 'Верно. Обе точки в одном месте — одна вторая и две четвёртых равны.', uz: "To'g'ri. Ikkala nuqta bir joyda — ikkidan bir va to'rtdan ikki teng." },
      on_wrong: { ru: 'Посмотри ещё раз: обе точки ровно посередине между нулём и единицей. Это одно место.', uz: "Yana qarang: ikkala nuqta ham nol va bir orasining aniq o'rtasida. Bu bitta joy." }
    }
  },

  // ---- s8 CASE setup: Сардор, измерительная линейка (метр), отметка 3/4 м ----
  s8: {
    eyebrow: { ru: 'Задача · линейка', uz: "Masala · chizg'ich" },
    title: { ru: 'Сардор размечает метровую планку.', uz: "Sardor bir metrli reykani belgilaydi." },
    body_p1: { ru: 'Планка длиной 1 метр. Сардор разделил её на 4 равные части и хочет поставить отметку на трёх четвёртых метра.', uz: "Reyka uzunligi 1 metr. Sardor uni 4 ta teng bo'lakka bo'lib, metrning to'rtdan uchiga belgi qo'ymoqchi." },
    card_line_label: { ru: 'Длина планки', uz: "Reyka uzunligi" },
    card_line_value: { ru: 'от 0 до 1 метра', uz: "0 dan 1 metrgacha" },
    card_parts_label: { ru: 'Делений', uz: "Bo'limlar" },
    card_parts_value: { ru: '4 равные части', uz: "4 ta teng bo'lak" },
    outro: { ru: 'Где на планке стоит отметка три четвёртых метра? Помоги Сардору на следующем шаге.', uz: "Metrning to'rtdan uch belgisi reykada qayerda turadi? Keyingi bosqichda Sardorga yordam bering." },
    btn_help: { ru: 'Помочь Сардору', uz: "Sardorga yordam berish" },
    audio: { ru: 'Сардор размечает метровую планку. Её длина один метр, и он разделил планку на четыре равные части. Сардор хочет поставить отметку на трёх четвёртых метра. Подумай, где на планке стоит эта точка.', uz: "Sardor bir metrli reykani belgilaydi. Uning uzunligi bir metr va u reykani to'rtta teng bo'lakka bo'ldi. Sardor metrning to'rtdan uchiga belgi qo'ymoqchi. Bu nuqta reykada qayerda turishini o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, дроби): отметка на 3/4 (correct idx 2) ----
  s9: {
    eyebrow: { ru: 'Задача · линейка', uz: "Masala · chizg'ich" },
    label: { ru: 'Где отметка?', uz: "Belgi qayerda?" },
    question: { ru: 'Планка от 0 до 1 метра разделена на 4 части. Отметка стоит на третьей метке от нуля. Какая это дробь метра?', uz: "0 dan 1 metrgacha reyka 4 bo'lakka bo'lingan. Belgi noldan uchinchi metkada turibdi. Bu metrning qaysi kasri?" },
    correct_text: { ru: 'Верно: 4 части — знаменатель 4, три шага — числитель 3. Отметка на трёх четвёртых метра.', uz: "To'g'ri: 4 bo'lak — maxraj 4, uch qadam — surat 3. Belgi metrning to'rtdan uchida." },
    hint_0: { ru: 'Числитель и знаменатель перепутаны: шагов 3, частей 4.', uz: "Surat va maxraj almashgan: qadamlar 3 ta, bo'laklar 4 ta." },
    hint_1: { ru: 'Снизу — на сколько частей разделили планку. Их 4.', uz: "Pastda — reyka nechta bo'lakka bo'lingani. Ular to'rtta." },
    hint_3: { ru: 'Сверху — сколько шагов от нуля. Их 3, а не 1.', uz: "Yuqorida — noldan nechta qadam. Ular uchta, bir emas." },
    wrong_default: { ru: 'Знаменатель — число частей (4), числитель — число шагов до отметки (3).', uz: "Maxraj — bo'laklar soni (to'rt), surat — belgigacha qadamlar soni (uch)." },
    audio: {
      intro: { ru: 'Планка от нуля до одного метра разделена на четыре части, отметка стоит на третьей метке. Выбери дробь метра, которая показывает её место.', uz: "Noldan bir metrgacha reyka to'rtta bo'lakka bo'lingan, belgi uchinchi metkada turibdi. Uning joyini ko'rsatadigan metr kasrini tanlang." },
      on_correct: { ru: 'Верно. Четыре части и три шага — три четвёртых метра.', uz: "To'g'ri. To'rt bo'lak va uch qadam — metrning to'rtdan uchi." },
      on_wrong: { ru: 'Пока нет. Снизу — число частей, сверху — число шагов от нуля.', uz: "Hali emas. Pastda — bo'laklar soni, yuqorida — noldan qadamlar soni." }
    }
  },

  // ---- s10 CASE conclusion (MC, текст): что значит 3/4 метра на планке (correct idx 0) ----
  s10: {
    eyebrow: { ru: 'Задача · линейка', uz: "Masala · chizg'ich" },
    label: { ru: 'Что это значит', uz: "Bu nimani bildiradi" },
    question: { ru: 'Отметка стоит на трёх четвёртых метра. Что это означает про место на планке?', uz: "Belgi metrning to'rtdan uchida turibdi. Bu reykadagi joy haqida nimani bildiradi?" },
    opt0: { ru: 'Метр разделён на 4 равные части, и точка на конце третьей части от нуля.', uz: "Metr 4 ta teng bo'lakka bo'lingan va nuqta noldan uchinchi bo'lak oxirida." },
    opt1: { ru: 'На планке ровно 3 метра.', uz: "Reykada aniq 3 metr bor." },
    opt2: { ru: 'Метр разделён на 3 части, и отмечены 4.', uz: "Metr 3 bo'lakka bo'lingan va 4 tasi belgilangan." },
    opt3: { ru: 'Точка стоит ровно на середине планки.', uz: "Nuqta reykaning aniq o'rtasida turadi." },
    correct_text: { ru: 'Верно: три четвёртых метра — это место, где пройдены 3 части из 4. Это ближе к 1, чем к 0.', uz: "To'g'ri: metrning to'rtdan uchi — 4 bo'lakdan 3 tasi o'tilgan joy. Bu 0 dan ko'ra 1 ga yaqinroq." },
    hint_1: { ru: 'Дробь не говорит про целые метры. Она показывает место внутри одного метра.', uz: "Kasr butun metrlar haqida gapirmaydi. U bir metr ichidagi joyni ko'rsatadi." },
    hint_2: { ru: 'Знаменатель 4 — число частей, числитель 3 — сколько пройдено. Не наоборот.', uz: "Maxraj to'rt — bo'laklar soni, surat uch — nechtasi o'tilgani. Aksincha emas." },
    hint_3: { ru: 'На середине стояла бы две четвёртых. А три четвёртых — дальше, ближе к 1.', uz: "O'rtada to'rtdan ikki bo'lardi. To'rtdan uch esa naridaroq, 1 ga yaqinroq." },
    wrong_default: { ru: 'Три четвёртых метра — это место, где из 4 равных частей пройдены 3.', uz: "Metrning to'rtdan uchi — 4 teng bo'lakdan 3 tasi o'tilgan joy." },
    audio: {
      intro: { ru: 'Отметка стоит на трёх четвёртых метра. Выбери, что это означает про место на планке.', uz: "Belgi metrning to'rtdan uchida turibdi. Bu reykadagi joy haqida nimani bildirishini tanlang." },
      on_correct: { ru: 'Верно. Метр поделён на четыре части, и точка там, где пройдены три из них.', uz: "To'g'ri. Metr to'rtta bo'lakka bo'lingan va nuqta uchtasi o'tilgan joyda." },
      on_wrong: { ru: 'Пока нет. Дробь показывает место внутри метра, а не число метров.', uz: "Hali emas. Kasr metr ichidagi joyni ko'rsatadi, metrlar sonini emas." }
    }
  },

  // ---- s11 TEST (MC, дроби): линия 0..1, 4 части, точка на 2-й → 2/4 (= 1/2) (correct idx 0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — назови дробь', uz: "Oxirgisi — kasrni ayting" },
    question: { ru: 'Отрезок от 0 до 1 разделён на 4 части. Точка стоит на второй метке от нуля. Какая это дробь?', uz: "0 dan 1 gacha kesma 4 bo'lakka bo'lingan. Nuqta noldan ikkinchi belgida turibdi. Bu qaysi kasr?" },
    correct_text: { ru: 'Верно: 4 части — знаменатель 4, два шага — числитель 2. Это две четвёртых, и это ровно середина — то же место, что и одна вторая.', uz: "To'g'ri: 4 bo'lak — maxraj 4, ikki qadam — surat 2. Bu to'rtdan ikki, va bu aniq o'rta — ikkidan bir bilan bir xil joy." },
    hint_1: { ru: 'Числитель и знаменатель перепутаны: шагов 2, частей 4.', uz: "Surat va maxraj almashgan: qadamlar 2 ta, bo'laklar 4 ta." },
    hint_2: { ru: 'Снизу — на сколько частей разделили отрезок. Их 4.', uz: "Pastda — kesma nechta bo'lakka bo'lingani. Ular to'rtta." },
    hint_3: { ru: 'Сверху — сколько шагов от нуля до точки. Их 2, а не 3.', uz: "Yuqorida — noldan nuqtagacha nechta qadam. Ular ikkita, uch emas." },
    wrong_default: { ru: 'Знаменатель — число частей (4), числитель — число шагов (2). Это две четвёртых.', uz: "Maxraj — bo'laklar soni (to'rt), surat — qadamlar soni (ikki). Bu to'rtdan ikki." },
    audio: {
      intro: { ru: 'Последнее задание. Отрезок от нуля до единицы разделён на четыре части, точка на второй метке. Выбери нужную дробь.', uz: "Oxirgi topshiriq. Noldan birgacha kesma to'rtta bo'lakka bo'lingan, nuqta ikkinchi belgida. Kerakli kasrni tanlang." },
      on_correct: { ru: 'Верно. Две четвёртых — это ровно середина, то же место, что и одна вторая.', uz: "To'g'ri. To'rtdan ikki — aniq o'rta, ikkidan bir bilan bir xil joy." },
      on_wrong: { ru: 'Пока нет. Снизу — число частей, сверху — число шагов до точки.', uz: "Hali emas. Pastda — bo'laklar soni, yuqorida — nuqtagacha qadamlar soni." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь дробь для тебя — число со своим местом на линии.', uz: "Endi kasr siz uchun — chiziqda o'z joyi bor son." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Дробь — это число, и у неё есть точка на числовой прямой.', uz: "Kasr — bu son, va uning son o'qida nuqtasi bor." },
    main_2: { ru: 'Знаменатель — на сколько равных частей делим отрезок 0…1. Числитель — сколько шагов от нуля.', uz: "Maxraj — 0…1 kesmani nechta teng bo'lakka bo'lamiz. Surat — noldan nechta qadam." },
    main_3: { ru: 'Линия не кончается на 1: за единицей те же части идут к 2 и дальше.', uz: "Chiziq 1 da tugamaydi: birdan keyin o'sha bo'laklar 2 ga va nariga ketadi." },
    main_4: { ru: '1/2 и 2/4 — одна и та же точка. Равные дроби стоят на одном месте.', uz: "1/2 va 2/4 — bitta nuqta. Teng kasrlar bir joyda turadi." },
    back_to_hook: { ru: 'Три четвёртых нашлись на линии точкой между 0 и 1. У дроби есть место. Жасур ошибался.', uz: "To'rtdan uch chiziqda 0 va 1 orasidagi nuqta bo'lib topildi. Kasrning joyi bor. Jasur xato qilgan ekan." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'урок «Что такое дробь».', uz: "«Kasr nima» darsi." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'дробь как деление: a/b это a разделить на b.', uz: "kasr — bo'lish natijasi: a/b bu a ni b ga bo'lish." },
    audio: { ru: 'Отлично! Теперь ты знаешь: дробь — это число, и у неё есть своё место на числовой прямой. Знаменатель делит отрезок от нуля до единицы на равные части, а числитель отсчитывает шаги от нуля. Линия не кончается на единице — за ней те же части идут к двойке. А равные дроби, например одна вторая и две четвёртых, стоят на одном месте. Три четвёртых нашли точку между нулём и единицей. Жасур ошибался.', uz: "Zo'r! Endi bilasiz: kasr — bu son, va uning son o'qida o'z joyi bor. Maxraj noldan birgacha kesmani teng bo'laklarga bo'ladi, surat esa noldan qadamlarni sanaydi. Chiziq birda tugamaydi — undan keyin o'sha bo'laklar ikki tomon ketadi. Teng kasrlar esa, masalan ikkidan bir va to'rtdan ikki, bir joyda turadi. To'rtdan uch nol va bir orasidan nuqta topdi. Jasur xato qilgan ekan." }
  }
};

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ (под тему «дробь на числовой прямой»)
// ============================================================
// Числовая прямая: отрезок 0..max единиц, на каждую единицу — den равных долей.
// Всего интервалов = den*max, тиков = den*max+1 (включая 0). Тик i стоит на значении i/den.
// mark — индекс тика с точкой-маркером. fillTo — индекс заливки 0..fillTo (растёт плавно).
// interactive — тики кликабельны (onPick(i)); selected — текущий выбранный тик.
// АНИМАЦИИ: метки появляются с лёгким «раскрытием» при смене den (key=den-i),
// заливка плавно растёт (nl-fill), точка-маркер скользит между метками (nl-marker)
// и «впрыгивает» при первом появлении (nl-marker-pop) — ученик видит отсчёт шагов.
const NumberLine = ({ den = 4, max = 1, mark = null, showMark = true, interactive = false, selected = null, onPick, fillTo = null, height = 76 }) => {
  const total = den * max;
  const ticks = total + 1;
  const pctOf = (i) => total === 0 ? 0 : (i / total) * 100;
  const lineTop = 30; // позиция оси по вертикали (px)
  // Единый источник позиции точки: явный mark (если показываем) либо выбранный тик в интерактиве.
  const markerIdx = (showMark && mark != null) ? mark : (interactive && selected != null ? selected : null);
  return (
    <div style={{ width: '100%', maxWidth: 560, padding: '0 16px', margin: '0 auto' }}>
      <div style={{ position: 'relative', height }}>
        {/* ось */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: lineTop, height: 3, background: T.ink2, borderRadius: 2 }}/>
        {/* заливка 0..fillTo — плавно растёт */}
        {fillTo != null && fillTo > 0 && (
          <div className="nl-fill" style={{ position: 'absolute', left: 0, width: `${pctOf(fillTo)}%`, top: lineTop, height: 3, background: T.accent, borderRadius: 2, boxShadow: '0 0 8px rgba(255, 79, 40, 0.5)' }}/>
        )}
        {/* метки (при смене den перерисовываются с анимацией раскрытия) */}
        {Array.from({ length: ticks }).map((_, i) => {
          const isInt = i % den === 0;
          const showRing = interactive && i >= 1 && i !== markerIdx;
          return (
            <div key={`${den}-${i}`} onClick={interactive ? () => onPick(i) : undefined}
              style={{ position: 'absolute', left: `${pctOf(i)}%`, top: 0, height: '100%', width: interactive ? 34 : 14, marginLeft: interactive ? -17 : -7, cursor: interactive ? 'pointer' : 'default' }}>
              {/* вертикальная метка */}
              <div className="nl-tick" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: lineTop - (isInt ? 11 : 7), width: isInt ? 3 : 2, height: isInt ? 22 : 14, background: isInt ? T.ink : T.ink3, borderRadius: 2, animationDelay: `${i * 0.04}s` }}/>
              {/* подпись целых */}
              {isInt && (<span className="mono small" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: lineTop + 18, color: T.ink2 }}>{i / den}</span>)}
              {/* интерактивная цель (пустой кружок-приглашение нажать) */}
              {showRing && (
                <div className="nl-ring" style={{ position: 'absolute', left: '50%', top: lineTop, transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}`, transition: 'all 0.15s' }}/>
              )}
            </div>
          );
        })}
        {/* точка-маркер: скользит к нужной метке и впрыгивает при появлении */}
        {markerIdx != null && (
          <div className="nl-marker nl-marker-pop" style={{ position: 'absolute', left: `${pctOf(markerIdx)}%`, top: lineTop, width: 20, height: 20, marginLeft: -10, marginTop: -10, borderRadius: '50%', background: T.accent, boxShadow: `0 0 0 5px ${T.accentSoft}, 0 4px 12px -2px rgba(255, 79, 40, 0.5)`, zIndex: 3 }}/>
        )}
      </div>
    </div>
  );
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// Детерминированно переставляет варианты MC, чтобы верный ответ не всегда был «A».
// order — массив старых индексов в новом порядке. Подсказки (hint_i) привязаны к ПОЗИЦИИ,
// поэтому переносим их вместе с вариантами; correctIdx пересчитывается на новую позицию.
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

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
        <div className="frame fade-up delay-1 hook-alive" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <NumberLine den={4} max={1} showMark={false} height={70}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Frac n="3" d="4" size="mid"/>
            <span className="mop" style={{ color: T.ink3 }}>= ?</span>
          </div>
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

// s1 — EXPLORATION step-by-step: ставим 3/4 на отрезок 0..1, голос ведёт.
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
  // Анимация отсчёта: на шаге 3 точка прыгает от 0 к 3/4, метка за меткой — видно «3 шага от нуля».
  // hop остаётся 0 до шага 3, поэтому setState вызываем только из интервала (без синхронного setState в эффекте).
  const [hop, setHop] = useState(0);
  useEffect(() => {
    if (step < 3) return;
    let k = 0;
    const id = setInterval(() => { k += 1; setHop(k); if (k >= 3) clearInterval(id); }, 430);
    return () => clearInterval(id);
  }, [step]);
  const den = step >= 2 ? 4 : 1;
  const mark = step >= 3 ? hop : null;
  const fillTo = step >= 3 ? hop : null;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <NumberLine den={den} max={1} mark={mark} fillTo={fillTo} showMark={step >= 3} height={58}/>
          {step >= 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Frac n="3" d="4" size="mid"/>
              <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>
            </div>
          )}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider + tap: поставь 2/5. Слайдер задаёт число частей, тап — точку.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [den, setDen] = useState(3);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const pickTick = (i) => { if (solved) return; if (i === 0) return; setChecked(false); setSelected(i); };
  const onSlider = (v) => { if (solved) return; setChecked(false); setDen(v); setSelected(null); };
  const check = () => {
    const ok = den === 5 && selected === 2;
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
          <NumberLine den={den} max={1} interactive={!solved} selected={selected} onPick={pickTick} mark={solved ? selected : null} showMark={solved} height={58}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {den}</p>
            <Slider value={den} min={2} max={6} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: знаменатель делит, числитель отсчитывает.
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <NumberLine den={4} max={1} mark={3} fillTo={3} height={58}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 5vw, 36px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Frac n="3" d="4" size="display"/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220, flex: 1 }}>
              <p className="body" style={{ margin: 0 }}>{t(c.card_top)}</p>
              <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
              <p className="body" style={{ margin: 0 }}>{t(c.card_bottom)}</p>
              <p className="small" style={{ margin: 0, color: T.ink3 }}>{t(c.card_line)}</p>
            </div>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s4 — TEST choice (дроби): линия 0..1, 5 частей, точка на 3-й → 3/5 (correct idx 1).
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="5" d="3" size="mid"/>, <Frac n="3" d="5" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="2" d="5" size="mid"/>], 1, [0, 2, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 18 }}><NumberLine den={5} max={1} mark={3} fillTo={3} height={58}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE: линия не кончается на 1, отрезок 0..2, точка 3/2.
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <NumberLine den={2} max={2} mark={3} fillTo={3} height={58}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 5vw, 36px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Frac n="3" d="2" size="display"/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 220, flex: 1 }}>
              <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{t(c.card_ok)}</p>
              <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
              <p className="body" style={{ margin: 0 }}>{t(c.card_bad)}</p>
            </div>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s6 — TEST choice (дроби): линия 0..2 в половинках, точка 3/2 (correct idx 0).
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="3" d="2" size="mid"/>, <Frac n="2" d="3" size="mid"/>, <Frac n="1" d="2" size="mid"/>, <Frac n="3" d="4" size="mid"/>], 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 18 }}><NumberLine den={2} max={2} mark={3} fillTo={3} height={58}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST choice (текст): 1/2 и 2/4 — одна точка (correct idx 0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 0, 3, 1]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>
      <div className="frame" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Frac n="1" d="2" size="sm"/>
          <div style={{ flex: 1 }}><NumberLine den={2} max={1} mark={1} fillTo={1} height={64}/></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Frac n="2" d="4" size="sm"/>
          <div style={{ flex: 1 }}><NumberLine den={4} max={1} mark={2} fillTo={2} height={64}/></div>
        </div>
      </div>
    </>
  );
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — CASE setup: Сардор, метровая планка.
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.body_p1)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <NumberLine den={4} max={1} showMark={false} height={70}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (дроби): отметка на 3/4 (correct idx 2).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="4" d="3" size="mid"/>, <Frac n="3" d="1" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="1" d="4" size="mid"/>], 2, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 18 }}><NumberLine den={4} max={1} mark={3} fillTo={3} height={58}/></div></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE conclusion (текст): что значит 3/4 метра (correct idx 0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST choice (дроби): линия 0..1, 4 части, точка на 2-й → 2/4 (= 1/2) (correct idx 0).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [<Frac n="2" d="4" size="mid"/>, <Frac n="4" d="2" size="mid"/>, <Frac n="1" d="4" size="mid"/>, <Frac n="2" d="3" size="mid"/>], 0, [0, 2, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div style={{ marginTop: 18 }}><NumberLine den={4} max={1} mark={2} fillTo={2} height={58}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
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
          <div style={{ flexShrink: 0, width: 'clamp(150px, 36vw, 220px)' }}><NumberLine den={4} max={1} mark={3} fillTo={3} height={64}/></div>
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
export default function FractionLineLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  // Preview-режим = props от LMS не пришли (запуск в artifacts).
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  // Конфигурируем урок: движок/SFX/AI читают из ttsConfig.
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
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

/* MATH: числовая прямая — интерактивные анимации (frac_5_02). */
.nl-fill { transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1); }
.nl-tick { animation: nlTickIn 0.34s ease-out backwards; transform-origin: center bottom; }
@keyframes nlTickIn { from { opacity: 0; transform: translateX(-50%) scaleY(0.15); } to { opacity: 1; transform: translateX(-50%) scaleY(1); } }
.nl-marker { transition: left 0.4s cubic-bezier(0.34, 1.1, 0.64, 1); }
.nl-marker-pop { animation: nlMarkerPop 0.44s cubic-bezier(0.34, 1.35, 0.64, 1); }
@keyframes nlMarkerPop { 0% { opacity: 0; transform: translateY(-16px) scale(0.3); } 60% { opacity: 1; transform: translateY(0) scale(1.18); } 100% { opacity: 1; transform: scale(1); } }
.nl-ring { animation: nlRingIn 0.3s ease-out backwards; }
@keyframes nlRingIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.4); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
`;
