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
// --- ПОД УРОК: frac_5_04 — Сравнение дробей с одинаковым знаменателем ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-04-v1',
  lessonTitle: { ru: 'Сравнение дробей с одинаковым знаменателем', uz: "Bir xil maxrajli kasrlarni taqqoslash" }
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
  // ---- s0 HOOK: Нигора и Дилшод съели от одного торта, Дилшод: «поровну — знаменатель один» ----
  s0: {
    eyebrow: { ru: 'Сравнение дробей · вступление', uz: "Kasrlarni taqqoslash · kirish" },
    title: { ru: 'Нигора и Дилшод съели по куску одного торта, разрезанного на 8 равных частей.', uz: "Nigora va Dilshod 8 ta teng bo'lakka kesilgan bitta tortdan yedi." },
    body: { ru: 'Нигора съела 3/8 торта, Дилшод — 5/8. Дилшод говорит: «мы съели поровну — ведь знаменатель у обоих восемь, дроби одинаковые».', uz: "Nigora tortning 3/8 ini yedi, Dilshod — 5/8 ini. Dilshod aytadi: «biz teng yedik — axir ikkalamizning ham maxrajimiz sakkiz, kasrlar bir xil»." },
    question: { ru: 'А ты как думаешь: 3/8 и 5/8 — это поровну, или кто-то съел больше?', uz: "Sizningcha-chi: 3/8 va 5/8 — bu tengmi, yoki kimdir ko'proq yedimi?" },
    opt0: { ru: 'Дилшод съел больше — дольки равны, а у него их 5', uz: "Dilshod ko'proq yedi — bo'laklar teng, unda 5 ta" },
    opt1: { ru: 'Поровну — знаменатель одинаковый (8)', uz: "Teng — maxraji bir xil (8)" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Нигора и Дилшод съели по куску одного торта, разрезанного на восемь равных частей. Нигора съела три восьмых, Дилшод — пять восьмых. Дилшод говорит, что они съели поровну, ведь знаменатель у обоих восемь. А ты как думаешь — три восьмых и пять восьмых это поровну, или кто-то съел больше? Выбери ответ.', uz: "Nigora va Dilshod 8 ta teng bo'lakka kesilgan bitta tortdan yedi. Nigora tortning uchdan... ya'ni sakkizdan uchini yedi, Dilshod — sakkizdan beshini. Dilshod aytadiki, ular teng yedi, axir maxraji sakkiz. Sizningcha, 3/8 va 5/8 teng-mi yoki kimdir ko'proq yedi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): сравниваем 3/8 и 5/8 на полосах ----
  s1: {
    eyebrow: { ru: 'Сравниваем дольки', uz: "Bo'laklarni solishtiramiz" },
    title: { ru: 'Сравним 3/8 и 5/8 по шагам', uz: "3/8 va 5/8 ni bosqichma-bosqich solishtiramiz" },
    conclusion: { ru: 'Дольки одинаковые, но 5 больше 3. Значит, 5/8 > 3/8.', uz: "Bo'laklar bir xil, lekin 5 katta 3 dan. Demak, 5/8 > 3/8." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Сравним три восьмых и пять восьмых по шагам. Нажимай кнопку Дальше.',
        'Вот две одинаковые полосы — это два одинаковых торта. Каждую делим на восемь равных частей. Дольки получились одинаковой ширины.',
        'На верхней полосе закрасим три дольки — это три восьмых, доля Нигоры. На нижней закрасим пять долек — это пять восьмых, доля Дилшода.',
        'Смотри: дольки одинаковые, но закрашенная полоса у Дилшода длиннее. Пять долек больше трёх. Значит, пять восьмых больше трёх восьмых.'
      ],
      uz: [
        "3/8 va 5/8 ni bosqichma-bosqich solishtiramiz. Davom etish tugmasini bosing.",
        "Mana ikkita bir xil chiziq — bu ikkita bir xil tort. Har birini 8 ta teng bo'lakka bo'lamiz. Bo'laklar bir xil kenglikda chiqdi.",
        "Yuqori chiziqda 3 ta bo'lakni bo'yaymiz — bu 3/8, Nigoraning ulushi. Pastkisida 5 ta bo'lakni bo'yaymiz — bu 5/8, Dilshodning ulushi.",
        "Qarang: bo'laklar bir xil, lekin Dilshodning bo'yalgan chizig'i uzunroq. 5 ta bo'lak 3 tadan ko'p. Demak, 5/8 katta 3/8 dan."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider + check): собери 5/6 и сравни с 2/6 ----
  s2: {
    eyebrow: { ru: 'Сравни сам', uz: "O'zingiz solishtiring" },
    title: { ru: 'Собери дробь и сравни сам', uz: "Kasrni yig'ib, o'zingiz solishtiring" },
    intro: { ru: 'Обе полосы поделены на шесть равных частей. Верхняя показывает две шестых. Двигай ползунок, чтобы закрасить дольки на нижней полосе.', uz: "Ikkala chiziq ham olti teng bo'lakka bo'lingan. Yuqorisi oltidan ikkini ko'rsatadi. Pastki chiziqdagi bo'laklarni bo'yash uchun slayderni suring." },
    target_text: { ru: 'Цель: собери на нижней полосе 5/6 и сравни с 2/6.', uz: "Maqsad: pastki chiziqda 5/6 ni yig'ing va 2/6 bilan solishtiring." },
    eyebrow_slider: { ru: 'Закрашено долек:', uz: "Bo'yalgan bo'laklar:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала собери', uz: "Avval yig'ing" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Пять шестых это пять долек, две шестых это две дольки. Дольки одинаковые, поэтому пять шестых больше двух шестых.', uz: "Oltidan besh bu besh bo'lak, oltidan ikki bu ikki bo'lak. Bo'laklar bir xil, shuning uchun oltidan besh oltidan ikkidan katta." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Нужно пять шестых — закрась ровно пять долек. Поставь ползунок на пять.', uz: "Oltidan besh kerak — aniq besh bo'lakni bo'yang. Slayderni beshga qo'ying." },
    audio: { ru: 'Собери дробь сам и сравни. Обе полосы поделены на шесть равных частей, верхняя показывает две шестых. Двигай ползунок и собери на нижней полосе пять шестых. Дольки одинаковые, поэтому пять шестых больше двух шестых.', uz: "Kasrni o'zingiz yig'ib solishtiring. Ikkala chiziq ham 6 ta teng bo'lakka bo'lingan, yuqorisi 2/6 ni ko'rsatadi. Slayderni surib, pastki chiziqda 5/6 ni yig'ing. Bo'laklar bir xil, shuning uchun 5/6 katta 2/6 dan." }
  },

  // ---- s3 RULE: одинаковый знаменатель → сравниваем числители ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Знаменатель один — смотрим на числитель', uz: "Maxraj bir xil — suratga qaraymiz" },
    title: { ru: 'Если знаменатели одинаковые, больше та дробь, у которой числитель больше.', uz: "Maxrajlar bir xil bo'lsa, surati katta bo'lgan kasr katta." },
    card_top: { ru: 'Одинаковый знаменатель — дольки одного размера.', uz: "Maxraj bir xil — bo'laklar bir o'lchamda." },
    card_bottom: { ru: 'Чем больше числитель, тем больше закрашенных долек — тем больше дробь.', uz: "Surat qancha katta bo'lsa, bo'yalgan bo'laklar shuncha ko'p — kasr shuncha katta." },
    card_line: { ru: 'Смотрим только на числители.', uz: "Faqat suratlarga qaraymiz." },
    outro: { ru: '5/6 и 2/6: знаменатель один, а 5 больше 2 — значит, 5/6 > 2/6.', uz: "5/6 va 2/6: maxraj bir xil, 5 esa 2 dan katta — demak, 5/6 > 2/6." },
    audio: { ru: 'Запомни правило. Если у дробей одинаковый знаменатель, дольки одного размера. Тогда больше та дробь, у которой числитель больше — у неё больше закрашенных долек. Смотрим только на числители. Пять шестых и две шестых: знаменатель один, а пять больше двух, значит пять шестых больше.', uz: "Qoidani eslab qoling. Agar kasrlarning maxraji bir xil bo'lsa, bo'laklar bir o'lchamda. Unda surati katta bo'lgan kasr katta — unda bo'yalgan bo'laklar ko'proq. Faqat suratlarga qaraymiz. 5/6 va 2/6: maxraj bir xil, 5 esa 2 dan katta, demak 5/6 katta." }
  },

  // ---- s4 TEST (MC, текст-отношение): 5/8 ? 2/8 → 5/8 > 2/8 (correct idx 0) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сравни дроби', uz: "Kasrlarni solishtiring" },
    question: { ru: 'Сравни 5/8 и 2/8. Что верно?', uz: "5/8 va 2/8 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '5/8 > 2/8', uz: "5/8 > 2/8" },
    opt1: { ru: '5/8 < 2/8', uz: "5/8 < 2/8" },
    opt2: { ru: '5/8 = 2/8', uz: "5/8 = 2/8" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: знаменатель один (8), а 5 больше 2. Значит, 5/8 > 2/8.', uz: "To'g'ri: maxraj bir xil (8), 5 esa 2 dan katta. Demak, 5/8 > 2/8." },
    hint_1: { ru: 'Наоборот: 5 долек больше 2 долек. Значит, 5/8 больше, а не меньше.', uz: "Aksincha: 5 ta bo'lak 2 ta bo'lakdan ko'p. Demak, 5/8 katta, kichik emas." },
    hint_2: { ru: 'Одинаковый знаменатель не значит «равны». Числители-то разные: 5 и 2.', uz: "Bir xil maxraj «teng» degani emas. Suratlar-ku har xil: 5 va 2." },
    hint_3: { ru: 'Сравнить можно: знаменатель один, просто смотрим на числители.', uz: "Solishtirsa bo'ladi: maxraj bir xil, faqat suratlarga qaraymiz." },
    wrong_default: { ru: 'Знаменатель один, а 5 больше 2. Значит, 5/8 > 2/8.', uz: "Maxraj bir xil, 5 esa 2 dan katta. Demak, 5/8 > 2/8." },
    audio: {
      intro: { ru: 'Сравни пять восьмых и две восьмых. Выбери, что верно.', uz: "Sakkizdan besh va sakkizdan ikkini solishtiring. Nima to'g'ri ekanini tanlang." },
      on_correct: { ru: 'Верно. Знаменатель один, пять больше двух — пять восьмых больше.', uz: "To'g'ri. Maxraj bir xil, besh katta ikkidan, sakkizdan besh katta." },
      on_wrong: { ru: 'Пока нет. Знаменатель одинаковый, сравни числители: 5 и 2.', uz: "Hali emas. Maxraj bir xil, suratlarni solishtiring: 5 va 2." }
    }
  },

  // ---- s5 RULE: одинаковый знаменатель ≠ равные дроби ----
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Один знаменатель — не значит «равны»', uz: "Bir xil maxraj — «teng» degani emas" },
    title: { ru: 'Одинаковый знаменатель — это одинаковые дольки, а не равные дроби.', uz: "Bir xil maxraj — bu bir xil bo'laklar, teng kasrlar emas." },
    card_ok: { ru: 'Дольки одного размера — потому что целое поделили на равные части одинаково.', uz: "Bo'laklar bir o'lchamda — chunki butun bir xil teng bo'laklarga bo'lingan." },
    card_bad: { ru: 'Но закрашенных долек разное число: где их больше, та дробь и больше. Это не «равно»!', uz: "Lekin bo'yalgan bo'laklar soni har xil: qayerda ko'p bo'lsa, o'sha kasr katta. Bu «teng» emas!" },
    outro: { ru: 'Одинаковый знаменатель не делает дроби равными. Всегда сравнивай числители.', uz: "Bir xil maxraj kasrlarni teng qilmaydi. Doim suratlarni solishtiring." },
    audio: { ru: 'Будь внимателен: одинаковый знаменатель — это одинаковые дольки, но не равные дроби. Дольки одного размера, потому что целое поделили одинаково. А вот закрашенных долек может быть разное число. Где их больше — та дробь и больше. Поэтому одинаковый знаменатель не делает дроби равными. Всегда сравнивай числители.', uz: "Ehtiyot bo'ling: bir xil maxraj — bu bir xil bo'laklar, lekin teng kasrlar emas. Bo'laklar bir o'lchamda, chunki butun bir xil bo'lingan. Bo'yalgan bo'laklar soni esa har xil bo'lishi mumkin. Qayerda ko'p bo'lsa — o'sha kasr katta. Shuning uchun bir xil maxraj kasrlarni teng qilmaydi. Doim suratlarni solishtiring." }
  },

  // ---- s6 TEST (MC, текст-отношение): 3/7 ? 6/7 → 3/7 < 6/7 (correct idx 0) ----
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сравни дроби', uz: "Kasrlarni solishtiring" },
    question: { ru: 'Сравни 3/7 и 6/7. Что верно?', uz: "3/7 va 6/7 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '3/7 < 6/7', uz: "3/7 < 6/7" },
    opt1: { ru: '3/7 > 6/7', uz: "3/7 > 6/7" },
    opt2: { ru: '3/7 = 6/7', uz: "3/7 = 6/7" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: знаменатель один (7), а 3 меньше 6. Значит, 3/7 < 6/7.', uz: "To'g'ri: maxraj bir xil (7), 3 esa 6 dan kichik. Demak, 3/7 < 6/7." },
    hint_1: { ru: 'Наоборот: 3 дольки меньше 6 долек. Значит, 3/7 меньше.', uz: "Aksincha: 3 ta bo'lak 6 ta bo'lakdan kam. Demak, 3/7 kichik." },
    hint_2: { ru: 'Числители разные: 3 и 6. Дроби не равны.', uz: "Suratlar har xil: 3 va 6. Kasrlar teng emas." },
    hint_3: { ru: 'Сравнить можно: знаменатель один, смотрим на числители.', uz: "Solishtirsa bo'ladi: maxraj bir xil, suratlarga qaraymiz." },
    wrong_default: { ru: 'Знаменатель один, 3 меньше 6. Значит, 3/7 < 6/7.', uz: "Maxraj bir xil, 3 esa 6 dan kichik. Demak, 3/7 < 6/7." },
    audio: {
      intro: { ru: 'Сравни три седьмых и шесть седьмых. Выбери, что верно.', uz: "Yettidan uch va yettidan oltini solishtiring. Nima to'g'ri ekanini tanlang." },
      on_correct: { ru: 'Верно. Три меньше шести — три седьмых меньше.', uz: "To'g'ri. Uch kichik oltidan, yettidan uch kichik." },
      on_wrong: { ru: 'Пока нет. Знаменатель один, сравни числители: 3 и 6.', uz: "Hali emas. Maxraj bir xil, suratlarni solishtiring: 3 va 6." }
    }
  },

  // ---- s7 TEST (MC, текст): равны ли дроби с одним знаменателем? (correct idx 0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Всегда ли они равны?', uz: "Ular doim tengmi?" },
    question: { ru: 'Дроби с одинаковым знаменателем всегда равны?', uz: "Maxraji bir xil kasrlar doim tengmi?" },
    opt0: { ru: 'Нет — больше та, у которой числитель больше', uz: "Yo'q — surati katta bo'lgani katta" },
    opt1: { ru: 'Да — если знаменатель один, дроби равны', uz: "Ha — maxraj bir xil bo'lsa, kasrlar teng" },
    opt2: { ru: 'Равны, только если и числитель меньше', uz: "Faqat surati ham kichik bo'lsa teng" },
    opt3: { ru: 'Такие дроби сравнить нельзя', uz: "Bunday kasrlarni solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: одинаковый знаменатель не делает дроби равными. Больше та, где числитель больше.', uz: "To'g'ri: bir xil maxraj kasrlarni teng qilmaydi. Surati katta bo'lgani katta." },
    hint_1: { ru: '3/8 и 5/8 — знаменатель один, но не равны: 5/8 больше. Числители-то разные.', uz: "3/8 va 5/8 — maxraj bir xil, lekin teng emas: 5/8 katta. Suratlar-ku har xil." },
    hint_2: { ru: 'Тут дело только в числителях: больше числитель — больше дробь.', uz: "Bu yerda gap faqat suratlarda: surat katta — kasr katta." },
    hint_3: { ru: 'Как раз наоборот: одинаковый знаменатель и помогает сравнить — по числителям.', uz: "Aynan aksincha: bir xil maxraj solishtirishga yordam beradi — suratlar bo'yicha." },
    wrong_default: { ru: 'Нет. Одинаковый знаменатель — дольки равны, но больше та дробь, где числитель больше.', uz: "Yo'q. Bir xil maxraj — bo'laklar teng, lekin surati katta bo'lgan kasr katta." },
    audio: {
      intro: { ru: 'Дроби с одинаковым знаменателем всегда равны? Выбери ответ.', uz: "Maxraji bir xil kasrlar doim tengmi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Не равны — больше та, у которой числитель больше.', uz: "To'g'ri. Teng emas — surati katta bo'lgani katta." },
      on_wrong: { ru: 'Посмотри ещё раз: три восьмых и пять восьмых не равны, хотя знаменатель один.', uz: "Yana qarang: sakkizdan uch va sakkizdan besh teng emas, garchi maxraj bir xil bo'lsa ham." }
    }
  },

  // ---- s8 CASE setup: Гулнора и Азиз, одинаковая плитка шоколада ----
  s8: {
    eyebrow: { ru: 'Задача · шоколад', uz: "Masala · shokolad" },
    title: { ru: 'У Гулноры и Азиза по одинаковой плитке шоколада.', uz: "Gulnora va Azizda bir xil shokolad plitkasidan bor." },
    body_p1: { ru: 'Каждая плитка разделена на 10 равных долек. Гулнора съела 4/10 своей плитки, Азиз — 7/10 своей. Кто съел больше шоколада?', uz: "Har bir plitka 10 ta teng bo'lakka bo'lingan. Gulnora o'z plitkasining 4/10 qismini yedi, Aziz — o'zinikining 7/10 qismini. Kim ko'proq shokolad yedi?" },
    card_line_label: { ru: 'Гулнора', uz: "Gulnora" },
    card_line_value: { ru: '4/10 плитки', uz: "plitkaning 4/10 qismi" },
    card_parts_label: { ru: 'Азиз', uz: "Aziz" },
    card_parts_value: { ru: '7/10 плитки', uz: "plitkaning 7/10 qismi" },
    outro: { ru: 'Плитки одинаковые и поделены на 10 равных долек. Помоги сравнить на следующем шаге.', uz: "Plitkalar bir xil va 10 ta teng bo'lakka bo'lingan. Keyingi bosqichda solishtirishga yordam bering." },
    btn_help: { ru: 'Помочь сравнить', uz: "Solishtirishga yordam" },
    audio: { ru: 'У Гулноры и Азиза по одинаковой плитке шоколада, каждая разделена на десять равных долек. Гулнора съела четыре десятых своей плитки, Азиз — семь десятых. Кто съел больше шоколада? Плитки одинаковые, дольки равны. Подумай, как их сравнить.', uz: "Gulnora va Azizda bir xil shokolad plitkasidan bor, har biri 10 ta teng bo'lakka bo'lingan. Gulnora o'z plitkasining 4/10 qismini, Aziz 7/10 qismini yedi. Kim ko'proq yedi? Plitkalar bir xil, bo'laklar teng. Ularni qanday solishtirishni o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, текст-отношение): 4/10 vs 7/10 → Азиз больше (correct idx 0) ----
  s9: {
    eyebrow: { ru: 'Задача · шоколад', uz: "Masala · shokolad" },
    label: { ru: 'Кто съел больше?', uz: "Kim ko'proq yedi?" },
    question: { ru: 'Гулнора съела 4/10, Азиз — 7/10. Что верно?', uz: "Gulnora 4/10, Aziz — 7/10 yedi. Nima to'g'ri?" },
    opt0: { ru: 'Азиз съел больше: 7/10 > 4/10', uz: "Aziz ko'proq yedi: 7/10 > 4/10" },
    opt1: { ru: 'Гулнора съела больше: 4/10 > 7/10', uz: "Gulnora ko'proq yedi: 4/10 > 7/10" },
    opt2: { ru: 'Они съели поровну', uz: "Ular teng yedi" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: дольки равны (десятые), а 7 больше 4. Значит, 7/10 > 4/10 — Азиз съел больше.', uz: "To'g'ri: bo'laklar teng (o'ndan), 7 esa 4 dan katta. Demak, 7/10 > 4/10 — Aziz ko'proq yedi." },
    hint_1: { ru: 'Наоборот: 7 долек больше 4. Больше съел Азиз.', uz: "Aksincha: 7 ta bo'lak 4 tadan ko'p. Ko'proq Aziz yedi." },
    hint_2: { ru: 'Числители разные: 4 и 7. Значит, не поровну.', uz: "Suratlar har xil: 4 va 7. Demak, teng emas." },
    hint_3: { ru: 'Плитки одинаковые, знаменатель один — сравнить можно по числителям.', uz: "Plitkalar bir xil, maxraj bir — suratlar bo'yicha solishtirsa bo'ladi." },
    wrong_default: { ru: 'Знаменатель один (10), 7 больше 4. Значит, 7/10 > 4/10 — Азиз съел больше.', uz: "Maxraj bir xil (10), 7 esa 4 dan katta. Demak, 7/10 > 4/10 — Aziz ko'proq yedi." },
    audio: {
      intro: { ru: 'Гулнора съела четыре десятых, Азиз — семь десятых. Кто съел больше? Выбери верное.', uz: "Gulnora o'ndan to'rt, Aziz o'ndan yetti yedi. Kim ko'proq yedi? To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Семь десятых больше четырёх десятых — больше съел Азиз.', uz: "To'g'ri. O'ndan yetti katta o'ndan to'rtdan, ko'proq Aziz yedi." },
      on_wrong: { ru: 'Пока нет. Знаменатель один, сравни числители: 4 и 7.', uz: "Hali emas. Maxraj bir xil, suratlarni solishtiring: 4 va 7." }
    }
  },

  // ---- s10 CASE conclusion (MC, текст): почему 7/10 > 4/10 (correct idx 0) ----
  s10: {
    eyebrow: { ru: 'Задача · шоколад', uz: "Masala · shokolad" },
    label: { ru: 'Почему так', uz: "Nega shunday" },
    question: { ru: 'Почему 7/10 больше 4/10?', uz: "Nega 7/10 katta 4/10 dan?" },
    opt0: { ru: 'Плитки поделены одинаково, и 7 равных долек больше 4 таких же долек.', uz: "Plitkalar bir xil bo'lingan, 7 ta teng bo'lak 4 ta xuddi shunday bo'lakdan ko'p." },
    opt1: { ru: 'Потому что 7 — большое число, оно всегда больше.', uz: "Chunki 7 — katta son, u doim katta." },
    opt2: { ru: 'Потому что у 4/10 знаменатель меньше.', uz: "Chunki 4/10 ning maxraji kichik." },
    opt3: { ru: 'Они на самом деле равны.', uz: "Aslida ular teng." },
    correct_text: { ru: 'Верно: дольки одного размера, поэтому 7 долек больше 4. Дело в числителях.', uz: "To'g'ri: bo'laklar bir o'lchamda, shuning uchun 7 ta bo'lak 4 tadan ko'p. Gap suratlarda." },
    hint_1: { ru: 'Само по себе «7 большое» не работает: 7/100 меньше 4/10. Тут важно, что дольки равны.', uz: "«7 katta» o'zi ishlamaydi: 7/100 kichik 4/10 dan. Bu yerda bo'laklar teng bo'lgani muhim." },
    hint_2: { ru: 'Знаменатель у обеих один и тот же — 10. Дело не в нём, а в числителях.', uz: "Ikkalasining maxraji bir xil — 10. Gap unda emas, suratlarda." },
    hint_3: { ru: 'Числители разные (4 и 7), значит дроби не равны.', uz: "Suratlar har xil (4 va 7), demak kasrlar teng emas." },
    wrong_default: { ru: 'Дольки равны, поэтому 7 долек больше 4 долек. Сравниваем числители.', uz: "Bo'laklar teng, shuning uchun 7 ta bo'lak 4 tadan ko'p. Suratlarni solishtiramiz." },
    audio: {
      intro: { ru: 'Почему семь десятых больше четырёх десятых? Выбери верное объяснение.', uz: "Nega o'ndan yetti katta o'ndan to'rtdan? To'g'ri izohni tanlang." },
      on_correct: { ru: 'Верно. Дольки одного размера, и семь их больше, чем четыре.', uz: "To'g'ri. Bo'laklar bir o'lchamda, ettitasi to'rttadan ko'p." },
      on_wrong: { ru: 'Пока нет. Важно, что дольки равны, а числитель у Азиза больше.', uz: "Hali emas. Bo'laklar teng ekani muhim, Azizning surati esa katta." }
    }
  },

  // ---- s11 TEST (MC, текст-отношение): 5/6 ? 4/6 → 5/6 > 4/6 (correct idx 0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — сравни', uz: "Oxirgisi — solishtiring" },
    question: { ru: 'Сравни 5/6 и 4/6. Что верно?', uz: "5/6 va 4/6 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '5/6 > 4/6', uz: "5/6 > 4/6" },
    opt1: { ru: '5/6 < 4/6', uz: "5/6 < 4/6" },
    opt2: { ru: '5/6 = 4/6', uz: "5/6 = 4/6" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: знаменатель один (6), а 5 больше 4. Значит, 5/6 > 4/6.', uz: "To'g'ri: maxraj bir xil (6), 5 esa 4 dan katta. Demak, 5/6 > 4/6." },
    hint_1: { ru: 'Наоборот: 5 долек больше 4. Значит, 5/6 больше.', uz: "Aksincha: 5 ta bo'lak 4 tadan ko'p. Demak, 5/6 katta." },
    hint_2: { ru: 'Числители разные: 5 и 4. Дроби не равны.', uz: "Suratlar har xil: 5 va 4. Kasrlar teng emas." },
    hint_3: { ru: 'Сравнить можно: знаменатель один, смотрим на числители.', uz: "Solishtirsa bo'ladi: maxraj bir xil, suratlarga qaraymiz." },
    wrong_default: { ru: 'Знаменатель один, 5 больше 4. Значит, 5/6 > 4/6.', uz: "Maxraj bir xil, 5 esa 4 dan katta. Demak, 5/6 > 4/6." },
    audio: {
      intro: { ru: 'Последнее задание. Сравни пять шестых и четыре шестых. Выбери верное.', uz: "Oxirgi topshiriq. Oltidan besh va oltidan to'rtni solishtiring. To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Пять больше четырёх — пять шестых больше.', uz: "To'g'ri. Besh katta to'rtdan, oltidan besh katta." },
      on_wrong: { ru: 'Пока нет. Знаменатель один, сравни числители: 5 и 4.', uz: "Hali emas. Maxraj bir xil, suratlarni solishtiring: 5 va 4." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты сравниваешь дроби с одним знаменателем.', uz: "Endi siz bir xil maxrajli kasrlarni solishtirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Одинаковый знаменатель — дольки одного размера.', uz: "Bir xil maxraj — bo'laklar bir o'lchamda." },
    main_2: { ru: 'Больше та дробь, у которой числитель больше: смотрим только на числители.', uz: "Surati katta bo'lgan kasr katta: faqat suratlarga qaraymiz." },
    main_3: { ru: 'Одинаковый знаменатель не значит «дроби равны».', uz: "Bir xil maxraj «kasrlar teng» degani emas." },
    main_4: { ru: 'Это правило работает, только когда знаменатели одинаковые.', uz: "Bu qoida faqat maxrajlar bir xil bo'lganda ishlaydi." },
    back_to_hook: { ru: 'Нигора съела 3/8, Дилшод — 5/8. Дольки равны, 5 больше 3 — Дилшод съел больше. «Поровну» было ошибкой.', uz: "Nigora 3/8, Dilshod — 5/8 yedi. Bo'laklar teng, 5 esa 3 dan katta — Dilshod ko'proq yedi. «Teng» degani xato edi." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'уроки о дроби: что это, на прямой, как деление.', uz: "kasr darslari: nima, son o'qida, bo'lish natijasi." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сравнение дробей с одинаковым числителем.', uz: "bir xil suratli kasrlarni taqqoslash." },
    audio: { ru: 'Отлично! Теперь ты умеешь сравнивать дроби с одинаковым знаменателем. Одинаковый знаменатель — это дольки одного размера. Больше та дробь, у которой числитель больше: смотрим только на числители. Но одинаковый знаменатель не значит, что дроби равны. И помни: это правило работает, только когда знаменатели одинаковые. Нигора съела три восьмых, Дилшод — пять восьмых. Дольки равны, пять больше трёх — Дилшод съел больше. «Поровну» было ошибкой.', uz: "Zo'r! Endi siz bir xil maxrajli kasrlarni solishtira olasiz. Bir xil maxraj — bu bir o'lchamdagi bo'laklar. Surati katta bo'lgan kasr katta: faqat suratlarga qaraymiz. Lekin bir xil maxraj kasrlar teng degani emas. Va esda tuting: bu qoida faqat maxrajlar bir xil bo'lganda ishlaydi. Nigora 3/8, Dilshod 5/8 yedi. Bo'laklar teng, 5 esa 3 dan katta — Dilshod ko'proq yedi. «Teng» degani xato edi." }
  }
};

// ============================================================
// УРОК-СПЕЦИФИЧНЫЙ ВИЗУАЛИЗАТОР (под тему «сравнение дробей с одним знаменателем»)
// ============================================================
// FracBar: горизонтальная полоса из den равных долей, первые num — закрашены.
// marker — у края заливки скользит вертикальная «финишная черта» (cb-marker/cb-slide).
// winner — на этой полосе у финишной черты появляется флажок (она длиннее = дробь больше).
// animateIn — заливка вырастает 0→цель и черта въезжает при появлении экрана (cb-grow/cb-slide);
//             при animateIn=false ширина/позиция меняются через transition (живой слайдер, шаги).
const FracBar = ({ num, den, color = T.accent, height = 40, marker = false, winner = false, animateIn = false }) => {
  const pct = (num / den) * 100;
  const ease = 'cubic-bezier(0.34, 1.1, 0.64, 1)';
  return (
    <div className="cb-bar" style={{ position: 'relative', width: '100%', height, borderRadius: 9, background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 9, overflow: 'hidden' }}>
        <div className={`cb-fill${animateIn ? ' cb-grow' : ''}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, transition: `width 0.45s ${ease}` }}/>
        {Array.from({ length: den - 1 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${((i + 1) / den) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg }}/>
        ))}
      </div>
      {marker && num > 0 && (
        <div className={`cb-marker${animateIn ? ' cb-slide' : ''}`} style={{ position: 'absolute', left: `${pct}%`, top: -6, bottom: -6, width: 3, marginLeft: -1.5, background: color, borderRadius: 2, boxShadow: `0 0 7px ${color}`, transition: `left 0.45s ${ease}` }}>
          {winner && (
            <svg className="cb-flag" width="18" height="16" viewBox="0 0 18 16" style={{ position: 'absolute', top: -15, left: 1, overflow: 'visible' }}>
              <path d="M1 1 L14 4 L1 8 Z" fill={color}/>
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

// ComparisonBars: две полосы с ОДНИМ den и разным num — для наглядного сравнения.
// fracA / fracB — готовые узлы <Frac/> (подписи слева). Вторая полоса — синяя.
// winner: 'A' | 'B' | null — на чьей полосе показать флажок «больше» (только на обучающих
// экранах; на тестах winner=null, чтобы не выдать ответ). marker/animateIn — см. FracBar.
const ComparisonBars = ({ numA, numB, den, fracA, fracB, marker = true, winner = null, animateIn = true }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 520, margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)' }}>
      <div style={{ width: 'clamp(38px, 9vw, 52px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>{fracA}</div>
      <div style={{ flex: 1 }}><FracBar num={numA} den={den} marker={marker} winner={winner === 'A'} animateIn={animateIn}/></div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)' }}>
      <div style={{ width: 'clamp(38px, 9vw, 52px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>{fracB}</div>
      <div style={{ flex: 1 }}><FracBar num={numB} den={den} color={T.blue} marker={marker} winner={winner === 'B'} animateIn={animateIn}/></div>
    </div>
  </div>
);

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
        <div className="frame fade-up delay-1 hook-alive"><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <ComparisonBars numA={3} numB={5} den={8} marker={false} fracA={<Frac n="3" d="8" size="sm"/>} fracB={<Frac n="5" d="8" size="sm"/>}/>
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

// s1 — EXPLORATION step-by-step: сравниваем 3/8 и 5/8, голос ведёт. Заливка по шагам.
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
  const numA = step >= 2 ? 3 : 0;
  const numB = step >= 2 ? 5 : 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <ComparisonBars numA={numA} numB={numB} den={8} animateIn={false} winner={step >= 3 ? 'B' : null} fracA={<Frac n="3" d="8" size="sm"/>} fracB={<Frac n="5" d="8" size="sm"/>}/>
          {step >= 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="mop" style={{ color: T.success, fontSize: 'clamp(18px, 3vw, 26px)' }}>5/8 &gt; 3/8</span>
              <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>
            </div>
          )}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider + check: собери 5/6 и сравни с 2/6.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 6; const fixed = 2;
  const [num, setNum] = useState(1);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const onSlider = (v) => { if (solved) return; setChecked(false); setNum(v); };
  const check = () => {
    const ok = num === 5;
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
          <ComparisonBars numA={fixed} numB={num} den={den} animateIn={false} winner={solved ? 'B' : null} fracA={<Frac n={String(fixed)} d={String(den)} size="sm"/>} fracB={<Frac n={String(num)} d={String(den)} size="sm"/>}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {num}</p>
            <Slider value={num} min={1} max={6} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: одинаковый знаменатель → сравниваем числители.
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
          <ComparisonBars numA={2} numB={5} den={6} winner="B" fracA={<Frac n="2" d="6" size="sm"/>} fracB={<Frac n="5" d="6" size="sm"/>}/>
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

// s4 — TEST choice (отношение): 5/8 ? 2/8 → 5/8 > 2/8 (correct idx 0).
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><ComparisonBars numA={5} numB={2} den={8} fracA={<Frac n="5" d="8" size="sm"/>} fracB={<Frac n="2" d="8" size="sm"/>}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE: одинаковый знаменатель ≠ равные дроби.
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
          <ComparisonBars numA={1} numB={4} den={5} winner="B" fracA={<Frac n="1" d="5" size="sm"/>} fracB={<Frac n="4" d="5" size="sm"/>}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{t(c.card_ok)}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{t(c.card_bad)}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s6 — TEST choice (отношение): 3/7 ? 6/7 → 3/7 < 6/7 (correct idx 0).
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><ComparisonBars numA={3} numB={6} den={7} fracA={<Frac n="3" d="7" size="sm"/>} fracB={<Frac n="6" d="7" size="sm"/>}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST choice (текст): равны ли дроби с одним знаменателем? (correct idx 0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const options = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} question={question} options={options} correctIdx={0}/>;
};

// s8 — CASE setup: Гулнора и Азиз, плитки шоколада.
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.body_p1)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <ComparisonBars numA={4} numB={7} den={10} fracA={<Frac n="4" d="10" size="sm"/>} fracB={<Frac n="7" d="10" size="sm"/>}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (отношение): 4/10 vs 7/10 → Азиз больше (correct idx 0).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><ComparisonBars numA={4} numB={7} den={10} fracA={<Frac n="4" d="10" size="sm"/>} fracB={<Frac n="7" d="10" size="sm"/>}/></div></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE conclusion (текст): почему 7/10 > 4/10 (correct idx 0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST choice (отношение): 5/6 ? 4/6 → 5/6 > 4/6 (correct idx 0).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 3, 0, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><ComparisonBars numA={5} numB={4} den={6} fracA={<Frac n="5" d="6" size="sm"/>} fracB={<Frac n="4" d="6" size="sm"/>}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s12 — SUMMARY: без счёта, закрывает крючок; finishLesson один раз.
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
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ComparisonBars numA={3} numB={5} den={8} winner="B" fracA={<Frac n="3" d="8" size="sm"/>} fracB={<Frac n="5" d="8" size="sm"/>}/>
          <p className="body" style={{ margin: 0 }}>{t(c.back_to_hook)}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ (шаблон из infrastructure_v1)
// ============================================================
export default function FractionCompareSameDenLesson({
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

/* MATH: полосы сравнения дробей — анимации (frac_5_04). */
.cb-bar { animation: cbBarIn 0.4s ease-out backwards; transform-origin: left center; }
@keyframes cbBarIn { from { opacity: 0; transform: scaleX(0.9); } to { opacity: 1; transform: scaleX(1); } }
/* финишная черта: заливка вырастает 0→цель, черта въезжает 0→край (implicit to = inline left/width). */
.cb-grow { animation: cbGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cbGrow { from { width: 0; } }
.cb-marker { animation: cbMarkerIn 0.3s ease-out backwards; }
@keyframes cbMarkerIn { from { opacity: 0; } }
.cb-slide { animation: cbSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cbSlide { from { left: 0; } }
/* флажок «больше»: выскакивает у финишной черты и мягко покачивается. */
.cb-flag { transform-origin: bottom left; animation: cbFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, cbFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cbFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cbFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
`;
