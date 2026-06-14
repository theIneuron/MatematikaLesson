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
// --- ПОД УРОК: frac_5_11 — Сравнение дробей с разными знаменателями (интуитивно) ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-11-v1',
  lessonTitle: { ru: 'Сравнение дробей с разными знаменателями (интуитивно)', uz: "Har xil maxrajli kasrlarni taqqoslash (intuitiv)" }
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
    label: { ru: 'Приведи к одинаковым долям', uz: "Bir xil ulushga keltiring" },
    title: { ru: 'Чтобы сравнить дроби с разными знаменателями, приведи обе к одинаковым долям.', uz: "Har xil maxrajli kasrlarni solishtirish uchun ikkalasini bir xil ulushga keltiring." },
    card_top: { ru: 'Разрежь обе полосы на одинаковые мелкие доли (общие).', uz: "Ikkala polosani bir xil mayda ulushga (umumiy) bo'ling." },
    card_bottom: { ru: 'Теперь доли равны — сравнивай, сколько их закрашено.', uz: "Endi ulushlar teng — nechtasi bo'yalganini solishtiring." },
    card_line: { ru: '2/3 = 8/12, 3/4 = 9/12. 9 > 8 — значит 3/4 больше.', uz: "2/3 = 8/12, 3/4 = 9/12. 9 > 8 — demak 3/4 katta." },
    outro: { ru: 'Общие доли — это любое число, в которое укладываются оба знаменателя. Удобнее брать самое маленькое (для 3 и 4 — это 12, а не 12×... больше).', uz: "Umumiy ulush — bu har ikki maxraj joylashadigan istalgan son. Eng kichigini olgan qulay (3 va 4 uchun bu 12, ko'paytma emas)." },
    audio: { ru: 'Запомни правило. Чтобы сравнить дроби с разными знаменателями, приведи обе к одинаковым долям. Разрежь полосы на одинаковые мелкие доли, общие для обоих знаменателей. Тогда доли станут равными, и можно просто сравнить, сколько их закрашено. Две третьих это восемь двенадцатых, три четвёртых это девять двенадцатых, девять больше восьми. Общие доли удобнее брать самые маленькие.', uz: "Qoidani eslab qoling. Har xil maxrajli kasrlarni solishtirish uchun ikkalasini bir xil ulushga keltiring. Polosalarni har ikki maxrajga umumiy bo'lgan bir xil mayda ulushga bo'ling. Shunda ulushlar teng bo'ladi va nechtasi bo'yalganini solishtirsa bo'ladi. Uchdan ikki o'n ikkidan sakkizta, to'rtdan uch o'n ikkidan to'qqizta, to'qqiz katta sakkizdan. Umumiy ulushni eng kichigini olgan qulay." }
  },

  // ---- s4 TEST (MC, отношение): 1/2 ? 3/5 → 5/10 vs 6/10 → 3/5 больше (correct opt0) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сравни дроби', uz: "Kasrlarni solishtiring" },
    question: { ru: 'Сравни 1/2 и 3/5. Что верно?', uz: "1/2 va 3/5 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '1/2 < 3/5', uz: "1/2 < 3/5" },
    opt1: { ru: '1/2 > 3/5', uz: "1/2 > 3/5" },
    opt2: { ru: '1/2 = 3/5', uz: "1/2 = 3/5" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: в десятых 1/2 = 5/10, а 3/5 = 6/10. 6 больше 5, значит 3/5 больше. 1/2 < 3/5.', uz: "To'g'ri: o'ndan ulushlarda 1/2 = 5/10, 3/5 = 6/10. 6 katta 5 dan, demak 3/5 katta. 1/2 < 3/5." },
    hint_1: { ru: 'Наоборот: 1/2 это 5/10, а 3/5 это 6/10. Шесть больше пяти — больше 3/5.', uz: "Aksincha: 1/2 bu 5/10, 3/5 bu 6/10. Olti katta beshdan — 3/5 katta." },
    hint_2: { ru: 'Они не равны: 5/10 и 6/10 — разные. Приведи к десятым и сравни.', uz: "Ular teng emas: 5/10 va 6/10 — har xil. O'ndanlarga keltirib solishtiring." },
    hint_3: { ru: 'Сравнить можно: приведи обе к десятым долям. 1/2 = 5/10, 3/5 = 6/10.', uz: "Solishtirsa bo'ladi: ikkalasini o'ndan ulushga keltiring. 1/2 = 5/10, 3/5 = 6/10." },
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

  // ---- s6 TEST (MC, benchmark): 2/5 ? 4/7 → 2/5 < 1/2 < 4/7 (correct opt0) ----
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сравни через 1/2', uz: "1/2 orqali solishtiring" },
    question: { ru: 'Сравни 2/5 и 4/7, опираясь на 1/2. Что верно?', uz: "2/5 va 4/7 ni 1/2 ga tayanib solishtiring. Nima to'g'ri?" },
    opt0: { ru: '2/5 < 4/7', uz: "2/5 < 4/7" },
    opt1: { ru: '2/5 > 4/7', uz: "2/5 > 4/7" },
    opt2: { ru: '2/5 = 4/7', uz: "2/5 = 4/7" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: 2/5 меньше 1/2 (половина — 2,5/5), а 4/7 больше 1/2 (половина — 3,5/7). Значит 2/5 < 4/7.', uz: "To'g'ri: 2/5 1/2 dan kichik (yarim — 2,5/5), 4/7 esa 1/2 dan katta (yarim — 3,5/7). Demak 2/5 < 4/7." },
    hint_1: { ru: 'Наоборот: 2/5 меньше половины, 4/7 больше. Значит 4/7 больше.', uz: "Aksincha: 2/5 yarimdan kichik, 4/7 katta. Demak 4/7 katta." },
    hint_2: { ru: 'Не равны: одна меньше половины, другая больше. Они по разные стороны от 1/2.', uz: "Teng emas: biri yarimdan kichik, ikkinchisi katta. Ular 1/2 ning har xil tomonida." },
    hint_3: { ru: 'Сравнить можно: 2/5 меньше 1/2, 4/7 больше 1/2.', uz: "Solishtirsa bo'ladi: 2/5 1/2 dan kichik, 4/7 1/2 dan katta." },
    wrong_default: { ru: '2/5 меньше половины, 4/7 больше половины. Значит 2/5 < 4/7.', uz: "2/5 yarimdan kichik, 4/7 yarimdan katta. Demak 2/5 < 4/7." },
    audio: {
      intro: { ru: 'Сравни две пятых и четыре седьмых, опираясь на одну вторую. Выбери, что верно.', uz: "Beshdan ikki va yettidan to'rtni ikkidan birga tayanib solishtiring. Nima to'g'ri ekanini tanlang." },
      on_correct: { ru: 'Верно. Две пятых меньше половины, четыре седьмых больше — значит четыре седьмых больше.', uz: "To'g'ri. Beshdan ikki yarimdan kichik, yettidan to'rt katta — demak yettidan to'rt katta." },
      on_wrong: { ru: 'Пока нет. Сравни каждую с половиной: две пятых меньше, четыре седьмых больше.', uz: "Hali emas. Har birini yarim bilan solishtiring: beshdan ikki kichik, yettidan to'rt katta." }
    }
  },

  // ---- s7 TEST (MC, текст misconception): 3/5 > 2/3, потому что 3>2? Нет (correct opt0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Не сравнивай только числители', uz: "Faqat suratlarni solishtirmang" },
    question: { ru: 'Кто-то говорит: «3/5 больше 2/3, ведь сверху 3 больше 2». Это так?', uz: "Kimdir aytadi: «3/5 katta 2/3 dan, axir yuqorida 3 katta 2 dan». Shundaymi?" },
    opt0: { ru: 'Неверно — знаменатели разные; в пятнадцатых 3/5 = 9/15, а 2/3 = 10/15, значит 2/3 больше', uz: "Noto'g'ri — maxrajlar har xil; o'n beshdan ulushlarda 3/5 = 9/15, 2/3 = 10/15, demak 2/3 katta" },
    opt1: { ru: 'Верно — раз 3 больше 2, то 3/5 больше', uz: "To'g'ri — 3 katta 2 dan, demak 3/5 katta" },
    opt2: { ru: 'Они равны — числители близкие', uz: "Ular teng — suratlar yaqin" },
    opt3: { ru: 'Сравнить нельзя — знаменатели разные', uz: "Solishtirib bo'lmaydi — maxrajlar har xil" },
    correct_text: { ru: 'Верно: при разных знаменателях числители так не сравнить. В пятнадцатых: 3/5 = 9/15, 2/3 = 10/15 — значит 2/3 больше.', uz: "To'g'ri: maxrajlar har xil bo'lganda suratlarni shunday solishtirib bo'lmaydi. O'n beshdan ulushlarda: 3/5 = 9/15, 2/3 = 10/15 — demak 2/3 katta." },
    hint_1: { ru: 'Это ловушка. Знаменатели разные, поэтому одни числители ничего не говорят. Приведи к пятнадцатым.', uz: "Bu tuzoq. Maxrajlar har xil, shuning uchun faqat suratlar hech narsa demaydi. O'n beshdanlarga keltiring." },
    hint_2: { ru: 'Не равны: 9/15 и 10/15 — разные. Одна больше.', uz: "Teng emas: 9/15 va 10/15 — har xil. Biri katta." },
    hint_3: { ru: 'Сравнить можно — нужно привести к общим долям, к пятнадцатым.', uz: "Solishtirsa bo'ladi — umumiy ulushga, o'n beshdanlarga keltirish kerak." },
    wrong_default: { ru: 'Знаменатели разные. В пятнадцатых 3/5 = 9/15, 2/3 = 10/15 — значит 2/3 больше.', uz: "Maxrajlar har xil. O'n beshdanlarda 3/5 = 9/15, 2/3 = 10/15 — demak 2/3 katta." },
    audio: {
      intro: { ru: 'Кто-то говорит, что три пятых больше двух третьих, ведь сверху три больше двух. Так ли это? Выбери ответ.', uz: "Kimdir aytadi: beshdan uch katta uchdan ikkidan, axir yuqorida 3 katta 2 dan. Shundaymi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Знаменатели разные, числители так не сравнить. В пятнадцатых два третьих больше.', uz: "To'g'ri. Maxrajlar har xil, suratlarni shunday solishtirib bo'lmaydi. O'n beshdanlarda uchdan ikki katta." },
      on_wrong: { ru: 'Это ловушка: при разных знаменателях нельзя сравнивать одни числители.', uz: "Bu tuzoq: maxrajlar har xil bo'lsa, faqat suratlarni solishtirib bo'lmaydi." }
    }
  },

  // ---- s8 CASE setup: Сабина качает два файла (3/4 и 5/6) ----
  s8: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
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

  // ---- s9 CASE step (MC, отношение): 3/4 vs 5/6 → 9/12 vs 10/12 → второй больше (correct opt0) ----
  s9: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    label: { ru: 'Какой ближе к концу?', uz: "Qaysi oxiriga yaqin?" },
    question: { ru: 'Первый файл на 3/4, второй на 5/6. Что верно?', uz: "Birinchi fayl 3/4 da, ikkinchisi 5/6 da. Nima to'g'ri?" },
    opt0: { ru: 'Второй ближе: 5/6 > 3/4', uz: "Ikkinchisi yaqinroq: 5/6 > 3/4" },
    opt1: { ru: 'Первый ближе: 3/4 > 5/6', uz: "Birinchisi yaqinroq: 3/4 > 5/6" },
    opt2: { ru: 'Загружены поровну', uz: "Teng yuklangan" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: в двенадцатых 3/4 = 9/12, 5/6 = 10/12. 10 больше 9 — значит 5/6 больше, второй файл ближе.', uz: "To'g'ri: o'n ikkidan ulushlarda 3/4 = 9/12, 5/6 = 10/12. 10 katta 9 dan — demak 5/6 katta, ikkinchi fayl yaqinroq." },
    hint_1: { ru: 'Наоборот: 3/4 это 9/12, 5/6 это 10/12. Десять больше девяти — больше 5/6.', uz: "Aksincha: 3/4 bu 9/12, 5/6 bu 10/12. O'n katta to'qqizdan — 5/6 katta." },
    hint_2: { ru: 'Не поровну: 9/12 и 10/12 разные. Приведи к двенадцатым.', uz: "Teng emas: 9/12 va 10/12 har xil. O'n ikkidanlarga keltiring." },
    hint_3: { ru: 'Сравнить можно: приведи обе к двенадцатым долям.', uz: "Solishtirsa bo'ladi: ikkalasini o'n ikkidan ulushga keltiring." },
    wrong_default: { ru: 'В двенадцатых: 3/4 = 9/12, 5/6 = 10/12. Значит 5/6 больше.', uz: "O'n ikkidanlarda: 3/4 = 9/12, 5/6 = 10/12. Demak 5/6 katta." },
    audio: {
      intro: { ru: 'Первый файл загружен на три четвёртых, второй на пять шестых. Какой ближе к концу? Выбери верное.', uz: "Birinchi fayl to'rtdan uchga, ikkinchisi oltidan beshga yuklandi. Qaysi oxiriga yaqin? To'g'risini tanlang." },
      on_correct: { ru: 'Верно. Девять двенадцатых меньше десяти двенадцатых — пять шестых больше.', uz: "To'g'ri. O'n ikkidan to'qqiz o'n ikkidan o'ndan kichik — oltidan besh katta." },
      on_wrong: { ru: 'Пока нет. Приведи обе к двенадцатым: три четвёртых это девять двенадцатых, пять шестых это десять двенадцатых.', uz: "Hali emas. Ikkalasini o'n ikkidanlarga keltiring: to'rtdan uch bu o'n ikkidan to'qqiz, oltidan besh bu o'n ikkidan o'n." }
    }
  },

  // ---- s10 CASE conclusion (MC, текст): почему 5/6 > 3/4 (correct opt0) ----
  s10: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    label: { ru: 'Почему так', uz: "Nega shunday" },
    question: { ru: 'Почему 5/6 больше 3/4?', uz: "Nega 5/6 katta 3/4 dan?" },
    opt0: { ru: 'Если привести к одинаковым (двенадцатым) долям, 5/6 = 10/12, а 3/4 = 9/12 — закрашено больше.', uz: "Bir xil (o'n ikkidan) ulushga keltirsak, 5/6 = 10/12, 3/4 = 9/12 — ko'proq bo'yalgan." },
    opt1: { ru: 'Потому что 6 больше 4, значит 5/6 всегда больше.', uz: "Chunki 6 katta 4 dan, demak 5/6 doim katta." },
    opt2: { ru: 'Потому что сверху 5 больше 3.', uz: "Chunki yuqorida 5 katta 3 dan." },
    opt3: { ru: 'На самом деле они равны.', uz: "Aslida ular teng." },
    correct_text: { ru: 'Верно: при общих двенадцатых долях 5/6 = 10/12, 3/4 = 9/12, и десять больше девяти.', uz: "To'g'ri: umumiy o'n ikkidan ulushlarda 5/6 = 10/12, 3/4 = 9/12, o'n esa to'qqizdan katta." },
    hint_1: { ru: 'Сам по себе больший знаменатель не делает дробь больше. Нужно привести к общим долям.', uz: "Katta maxraj o'zi kasrni katta qilmaydi. Umumiy ulushga keltirish kerak." },
    hint_2: { ru: 'Одни числители при разных знаменателях не сравнивают. Приведи к двенадцатым.', uz: "Maxrajlar har xil bo'lsa, faqat suratlarni solishtirmaydi. O'n ikkidanlarga keltiring." },
    hint_3: { ru: 'Они не равны: 10/12 и 9/12 разные.', uz: "Ular teng emas: 10/12 va 9/12 har xil." },
    wrong_default: { ru: 'Привели к двенадцатым: 5/6 = 10/12, 3/4 = 9/12, десять больше девяти.', uz: "O'n ikkidanlarga keltirdik: 5/6 = 10/12, 3/4 = 9/12, o'n katta to'qqizdan." },
    audio: {
      intro: { ru: 'Почему пять шестых больше трёх четвёртых? Выбери верное объяснение.', uz: "Nega oltidan besh katta to'rtdan uchdan? To'g'ri izohni tanlang." },
      on_correct: { ru: 'Верно. В общих двенадцатых долях пять шестых это десять двенадцатых, а три четвёртых девять.', uz: "To'g'ri. Umumiy o'n ikkidan ulushlarda oltidan besh o'n ikkidan o'nta, to'rtdan uch o'n ikkidan to'qqizta." },
      on_wrong: { ru: 'Пока нет. Нужно привести обе дроби к одинаковым долям и сравнить.', uz: "Hali emas. Ikkala kasrni bir xil ulushga keltirib solishtirish kerak." }
    }
  },

  // ---- s11 TEST (MC, отношение): 1/2 ? 5/8 → 4/8 vs 5/8 → 5/8 больше (correct opt0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — сравни', uz: "Oxirgisi — solishtiring" },
    question: { ru: 'Сравни 1/2 и 5/8. Что верно?', uz: "1/2 va 5/8 ni solishtiring. Nima to'g'ri?" },
    opt0: { ru: '1/2 < 5/8', uz: "1/2 < 5/8" },
    opt1: { ru: '1/2 > 5/8', uz: "1/2 > 5/8" },
    opt2: { ru: '1/2 = 5/8', uz: "1/2 = 5/8" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно: в восьмых 1/2 = 4/8, а 5/8 уже в восьмых. 5 больше 4 — значит 5/8 больше. 1/2 < 5/8.', uz: "To'g'ri: sakkizdan ulushlarda 1/2 = 4/8, 5/8 esa allaqachon sakkizdan. 5 katta 4 dan — demak 5/8 katta. 1/2 < 5/8." },
    hint_1: { ru: 'Наоборот: 1/2 это 4/8, а 5/8 больше четырёх восьмых. Больше 5/8.', uz: "Aksincha: 1/2 bu 4/8, 5/8 esa sakkizdan to'rtdan katta. 5/8 katta." },
    hint_2: { ru: 'Не равны: 4/8 и 5/8 разные. Приведи 1/2 к восьмым.', uz: "Teng emas: 4/8 va 5/8 har xil. 1/2 ni sakkizdanlarga keltiring." },
    hint_3: { ru: 'Сравнить можно: 1/2 это 4/8, дальше сравни с 5/8.', uz: "Solishtirsa bo'ladi: 1/2 bu 4/8, keyin 5/8 bilan solishtiring." },
    wrong_default: { ru: 'В восьмых 1/2 = 4/8, и 5/8 больше. 1/2 < 5/8.', uz: "Sakkizdanlarda 1/2 = 4/8, 5/8 esa katta. 1/2 < 5/8." },
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
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ (под тему «разные знаменатели, интуитивно»)
// ============================================================
// FracBar: полоса. Закраска = num/den (точная длина). grid — число делений сетки
// (по умолчанию = den; при приведении к общим долям передаём общее число — длина
// заливки НЕ меняется, а сетка становится мельче → «общие доли»). sweep — линии сетки
// въезжают слева направо (анимация деления). marker/winner — финишная черта + флажок.
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

// CompareBars: две полосы с РАЗНЫМИ знаменателями. grid=null — у каждой своя сетка;
// grid=N — обе разрезаны на N общих долей (видно приведение). showRegrid — рядом с дробью
// печатается её запись в общих долях (= k/N). winnerIdx — индекс большей дроби (флажок).
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

// BenchmarkLine: числовая прямая 0..1 с выделенной серединой 1/2 и точками-дробями.
// Сразу видно, какая дробь левее/правее половины. animateIn — метка 1/2 въезжает к центру.
const BenchmarkLine = ({ points, animateIn = true, height = 78 }) => {
  const lineTop = 34;
  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
      <div style={{ position: 'relative', height }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: lineTop, height: 3, background: T.ink2, borderRadius: 2 }}/>
        <span className="mono small" style={{ position: 'absolute', left: 0, top: lineTop + 12, color: T.ink2 }}>0</span>
        <span className="mono small" style={{ position: 'absolute', right: 0, top: lineTop + 12, color: T.ink2 }}>1</span>
        {/* середина 1/2 */}
        <div className={`cp-half${animateIn ? ' cp-half-in' : ''}`} style={{ position: 'absolute', left: '50%', top: lineTop - 13, height: 26, width: 3, marginLeft: -1.5, background: T.accent, borderRadius: 2 }}/>
        <span className="mono small" style={{ position: 'absolute', left: '50%', top: lineTop - 32, transform: 'translateX(-50%)', color: T.accent, fontWeight: 600 }}>1/2</span>
        {/* точки-дроби */}
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
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} animateIn={true}/>
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

// s1 — EXPLORATION step-by-step: 1/2 и 2/3 → общие шестые (линии въезжают).
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
  const grid = step >= 2 ? 6 : null;          // на шаге 2 режем на шестые
  const showWinner = step >= 3 ? 1 : null;    // 2/3 (индекс 1) больше
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          {step >= 1
            ? <CompareBars rows={[{ num: 1, den: 2 }, { num: 2, den: 3 }]} grid={grid} sweep={step === 2} showRegrid={step >= 2} winnerIdx={showWinner} marker={step >= 3} animateIn={true}/>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: подбери общие доли для 2/3 и 3/4 (живое деление).
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
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <p className="small fade-up delay-1" style={{ color: T.accent, fontWeight: 600 }}>{t(c.target_text)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} grid={grid} sweep={true} showRegrid={solved} winnerIdx={solved ? 1 : null} marker={solved} animateIn={false}/>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {grid}</p>
            <Slider value={grid} min={2} max={12} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: привести к общим долям.
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
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} grid={12} showRegrid={true} winnerIdx={1} marker={true} animateIn={true} sweep={true}/>
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

// s4 — TEST choice (отношение): 1/2 ? 3/5 → 1/2 < 3/5.
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><CompareBars rows={[{ num: 1, den: 2 }, { num: 3, den: 5 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE benchmark 1/2.
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
          <BenchmarkLine points={[{ num: 3, den: 8, color: T.blue }, { num: 4, den: 7, color: T.accent }]} animateIn={true}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{t(c.card_ok)}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{t(c.card_bad)}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s6 — TEST choice (benchmark): 2/5 ? 4/7 → 2/5 < 4/7.
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [0, 2, 3, 1]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><BenchmarkLine points={[{ num: 2, den: 5, color: T.blue }, { num: 4, den: 7, color: T.accent }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST choice (текст misconception): 3/5 > 2/3? Нет.
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — CASE setup: Сабина, загрузка файлов.
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
          <CompareBars rows={[{ num: 3, den: 4 }, { num: 5, den: 6 }]} animateIn={true}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.blue, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_line_value)}</p></div>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{t(c.card_parts_value)}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{t(c.outro)}</p>
      </div>
    </Stage>
  );
};

// s9 — CASE step (отношение): 3/4 vs 5/6 → 5/6 больше.
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><CompareBars rows={[{ num: 3, den: 4 }, { num: 5, den: 6 }]} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE conclusion (текст): почему 5/6 > 3/4.
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 1, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST choice (отношение): 1/2 ? 5/8 → 1/2 < 5/8.
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [0, 3, 1, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><CompareBars rows={[{ num: 1, den: 2 }, { num: 5, den: 8 }]} animateIn={true}/></div></>);
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
          <CompareBars rows={[{ num: 2, den: 3 }, { num: 3, den: 4 }]} grid={12} showRegrid={true} winnerIdx={1} marker={true} animateIn={true} height={28}/>
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
export default function FractionCompareDiffDenLesson({
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

/* MATH: сравнение разных знаменателей — приведение к общим долям (frac_5_11). */
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
`;
