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
// --- ПОД УРОК: frac_5_07 — Эквивалентные дроби — правило ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-07-v1',
  lessonTitle: { ru: 'Эквивалентные дроби — правило', uz: "Ekvivalent kasrlar — qoida" }
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
  // ---- s0 HOOK: Камрон (1/2) и Бобур (3/6) копят на велосипед ----
  s0: {
    eyebrow: { ru: 'Эквивалентные дроби · вступление', uz: "Ekvivalent kasrlar · kirish" },
    title: { ru: 'Камрон и Бобур копят на одинаковый велосипед.', uz: "Kamron va Bobur bir xil velosipedga pul yig'ishyapti." },
    body: { ru: 'Трекер накоплений у Камрона поделён на 2 части, у Бобура — на 6. Оба заполнили его до одной высоты. Камрон: «я накопил 1/2». Бобур: «а я 3/6 — целых три части, значит больше!».', uz: "Kamronning jamg'arma trekeri 2 bo'lakka, Boburniki 6 bo'lakka bo'lingan. Ikkalasi ham uni bir xil balandlikkacha to'ldirgan. Kamron: «men 1/2 yig'dim». Bobur: «men esa 3/6 — uchta bo'lak, demak ko'proq!»." },
    question: { ru: 'А ты как думаешь: кто накопил больше — Камрон (1/2) или Бобур (3/6)?', uz: "Sizningcha-chi: kim ko'proq yig'di — Kamron (1/2) mi yoki Bobur (3/6) mi?" },
    opt0: { ru: 'Поровну — 1/2 и 3/6 это одно и то же', uz: "Teng — 1/2 va 3/6 bir xil narsa" },
    opt1: { ru: 'Бобур — у него 3 части, а у Камрона 1', uz: "Bobur — unda 3 bo'lak, Kamronda 1" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Камрон и Бобур копят на одинаковый велосипед. Трекер у Камрона поделён на две части, у Бобура на шесть. Оба заполнили до одной высоты. Камрон говорит, что накопил одну вторую, а Бобур три шестых, и хвалится, что у него целых три части. А ты как думаешь — кто накопил больше, Камрон с одной второй или Бобур с тремя шестыми? Выбери ответ.', uz: "Kamron va Bobur bir xil velosipedga pul yig'ishyapti. Kamronning trekeri ikki bo'lakka, Boburniki olti bo'lakka bo'lingan. Ikkalasi ham bir xil balandlikkacha to'ldirgan. Kamron ikkidan birni yig'dim, Bobur esa oltidan uchni deydi va uchta bo'lagi borligi bilan maqtanadi. Sizningcha, kim ko'proq yig'di — ikkidan birli Kamronmi yoki oltidan uchli Boburmi? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step-by-step): 1/2 = 2/4 = 3/6 (дробим одну полосу) ----
  s1: {
    eyebrow: { ru: 'Одна и та же длина', uz: "Bir xil uzunlik" },
    title: { ru: 'Посмотрим: 1/2, 2/4 и 3/6 — одна длина', uz: "Ko'ramiz: 1/2, 2/4 va 3/6 — bir xil uzunlik" },
    conclusion: { ru: 'Закрашенная часть везде одинаковая! 1/2 = 2/4 = 3/6 — это одна и та же дробь, записанная по-разному.', uz: "Bo'yalgan qism hamma joyda bir xil! 1/2 = 2/4 = 3/6 — bu bitta kasr, faqat har xil yozilgan." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Посмотрим, как одна и та же длина превращается в разные дроби. Нажимай кнопку Дальше.',
        'Вот полоса, поделённая на 2 части, закрашена одна — это одна вторая.',
        'Теперь разделим каждую долю пополам — стало 4 части. Закрашенная длина не изменилась, но теперь это две четвёртых. Значит, одна вторая равна двум четвёртым.',
        'Разделим ещё мельче — на 6 частей. Закрашено стало три из шести, но длина та же. Одна вторая, две четвёртых и три шестых — это одна и та же дробь.'
      ],
      uz: [
        "Bir xil uzunlik qanday qilib har xil kasrga aylanishini ko'ramiz. Davom etish tugmasini bosing.",
        "Mana 2 bo'lakka bo'lingan polosa, bittasi bo'yalgan — bu ikkidan bir.",
        "Endi har bir ulushni teng ikkiga bo'lamiz — 4 bo'lak bo'ldi. Bo'yalgan uzunlik o'zgarmadi, lekin endi bu to'rtdan ikki. Demak, ikkidan bir to'rtdan ikkiga teng.",
        "Yana maydaroq — 6 bo'lakka bo'lamiz. Bo'yalgani oltidan uchta bo'ldi, lekin uzunlik o'sha. Ikkidan bir, to'rtdan ikki va oltidan uch — bu bitta kasr."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider): подбери числитель, чтобы ?/6 = 1/2 ----
  s2: {
    eyebrow: { ru: 'Собери равную дробь', uz: "Teng kasrni yig'ing" },
    title: { ru: 'Сделай дробь со знаменателем 6, равную 1/2', uz: "Maxraji 6 bo'lgan, 1/2 ga teng kasr yasang" },
    intro: { ru: 'Сверху эталон — одна вторая. Нижняя полоса поделена на шесть. Двигай ползунок и закрашивай доли, пока длина не совпадёт с верхней.', uz: "Yuqorida etalon — ikkidan bir. Pastki polosa oltiga bo'lingan. Slayderni surib, uzunlik yuqorigisiga to'g'ri kelguncha ulushlarni bo'yang." },
    target_text: { ru: 'Цель: закрась столько шестых, чтобы получилось ровно 1/2.', uz: "Maqsad: aniq 1/2 chiqishi uchun shuncha oltidanni bo'yang." },
    eyebrow_slider: { ru: 'Закрашено шестых:', uz: "Bo'yalgan oltidanlar:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала собери', uz: "Avval yig'ing" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Три шестых равно одной второй: длина совпала. Числитель и знаменатель умножили на три: один умножить на три три, два умножить на три шесть.', uz: "Oltidan uch ikkidan birga teng: uzunlik mos keldi. Surat va maxrajni uchga ko'paytirdik: birni uchga ko'paytirsak uch, ikkini uchga ko'paytirsak olti." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'Нужно ровно одна вторая. Половина от шести долей — это три. Поставь ползунок на три.', uz: "Aniq ikkidan bir kerak. Olti ulushning yarmi — uch. Slayderni uchga qo'ying." },
    audio: { ru: 'Сделай дробь со знаменателем шесть, равную одной второй. Сверху стоит эталон, одна вторая. Двигай ползунок и закрашивай шестые доли, пока длина не совпадёт. Половина от шести это три, поэтому три шестых равно одной второй.', uz: "Maxraji olti bo'lgan, ikkidan birga teng kasr yasang. Yuqorida etalon — ikkidan bir. Slayderni surib, uzunlik mos kelguncha oltidan ulushlarni bo'yang. Oltining yarmi uch, shuning uchun oltidan uch ikkidan birga teng." }
  },

  // ---- s3 RULE: умножай числитель и знаменатель на одно число ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Эквивалентные дроби', uz: "Ekvivalent kasrlar" },
    title: { ru: 'Умножь числитель и знаменатель на одно и то же число — получишь равную дробь.', uz: "Surat va maxrajni bir xil songa ko'paytiring — teng kasr chiqadi." },
    card_top: { ru: 'Что делаешь со знаменателем — делай и с числителем.', uz: "Maxrajga nima qilinsa — suratga ham o'sha qilinadi." },
    card_bottom: { ru: 'Долей становится больше, но они мельче — длина не меняется.', uz: "Ulushlar ko'payadi, lekin maydalashadi — uzunlik o'zgarmaydi." },
    card_line: { ru: '1/2 = 2/4 = 3/6 (×2, ×3). Это эквивалентные дроби.', uz: "1/2 = 2/4 = 3/6 (×2, ×3). Bu — ekvivalent kasrlar." },
    outro: { ru: 'Эквивалентные дроби — это одно и то же число, записанное разными долями.', uz: "Ekvivalent kasrlar — bu bitta son, faqat har xil ulushlarda yozilgan." },
    audio: { ru: 'Запомни правило. Чтобы получить равную дробь, умножь числитель и знаменатель на одно и то же число. Что делаешь со знаменателем, делай и с числителем. Долей становится больше, но они мельче, а закрашенная длина не меняется. Одна вторая равна двум четвёртым и трём шестым. Это эквивалентные дроби — одно и то же число, записанное по-разному.', uz: "Qoidani eslab qoling. Teng kasr olish uchun surat va maxrajni bir xil songa ko'paytiring. Maxrajga nima qilinsa, suratga ham o'sha qilinadi. Ulushlar ko'payadi, lekin maydalashadi, bo'yalgan uzunlik esa o'zgarmaydi. Ikkidan bir to'rtdan ikkiga va oltidan uchga teng. Bu ekvivalent kasrlar — bitta son, har xil yozilgan." }
  },

  // ---- s4 TEST (MC, дроби): какая равна 1/2 → 2/4 (correct opt0) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Найди равную дробь', uz: "Teng kasrni toping" },
    question: { ru: 'Какая дробь равна 1/2?', uz: "Qaysi kasr 1/2 ga teng?" },
    correct_text: { ru: 'Верно: 2/4 = 1/2 (умножили на 2: 1×2=2, 2×2=4). Длина одинаковая.', uz: "To'g'ri: 2/4 = 1/2 (2 ga ko'paytirdik: 1×2=2, 2×2=4). Uzunlik bir xil." },
    hint_1: { ru: '2/3 не равно 1/2: 1/2 это 3/6, а 2/3 это 4/6. Разные.', uz: "2/3 1/2 ga teng emas: 1/2 bu 3/6, 2/3 bu 4/6. Har xil." },
    hint_2: { ru: '3/5 не равно 1/2: половина пятых — это 2,5/5, а не 3/5.', uz: "3/5 1/2 ga teng emas: beshdan yarmi — 2,5/5, 3/5 emas." },
    hint_3: { ru: '1/3 меньше 1/2: треть мельче половины.', uz: "1/3 1/2 dan kichik: uchdan bir yarimdan mayda." },
    wrong_default: { ru: 'Чтобы получить равную 1/2, умножь верх и низ на одно число: 1/2 = 2/4.', uz: "1/2 ga teng kasr uchun yuqori va pastni bir songa ko'paytiring: 1/2 = 2/4." },
    audio: {
      intro: { ru: 'Какая дробь равна одной второй? Выбери ответ.', uz: "Qaysi kasr ikkidan birga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Две четвёртых это одна вторая, умножили на два.', uz: "To'g'ri. To'rtdan ikki — bu ikkidan bir, ikkiga ko'paytirdik." },
      on_wrong: { ru: 'Пока нет. Умножь числитель и знаменатель одной второй на одно число.', uz: "Hali emas. Ikkidan birning surat va maxrajini bir songa ko'paytiring." }
    }
  },

  // ---- s5 RULE-2 (misconception): меняй И числитель, не только знаменатель ----
  s5: {
    eyebrow: { ru: 'Правило · ошибка', uz: "Qoida · xato" },
    label: { ru: 'Меняй оба числа, не только нижнее', uz: "Ikkala sonni o'zgartiring, faqat pastdagini emas" },
    title: { ru: '1/2 — это НЕ 1/6. Поменял знаменатель — поменяй и числитель.', uz: "1/2 — bu 1/6 EMAS. Maxraj o'zgarsa — surat ham o'zgaradi." },
    card_ok: { ru: 'Если просто сделать 6 долей, но оставить 1 закрашенную — выйдет 1/6, а это намного меньше 1/2.', uz: "Agar shunchaki 6 ulush qilib, 1 tasi bo'yalsa — 1/6 chiqadi, bu esa 1/2 dan ancha kichik." },
    card_bad: { ru: 'Правильно: числитель тоже умножаем на 3 → 3/6. Вот это равно 1/2.', uz: "To'g'risi: suratni ham 3 ga ko'paytiramiz → 3/6. Mana shu 1/2 ga teng." },
    outro: { ru: 'Эквивалентность — это умножить ОБА числа на одно. Менять только знаменатель нельзя.', uz: "Ekvivalentlik — bu IKKALA sonni bir songa ko'paytirish. Faqat maxrajni o'zgartirib bo'lmaydi." },
    audio: { ru: 'Внимание, частая ошибка. Одна вторая это не одна шестая. Если просто сделать шесть долей, но оставить закрашенной одну, выйдет одна шестая, а она намного меньше половины. Правильно умножить и числитель тоже на три, тогда получится три шестых, и вот это равно одной второй. Меняй оба числа, не только нижнее.', uz: "Diqqat, ko'p uchraydigan xato. Ikkidan bir — bu oltidan bir emas. Agar shunchaki olti ulush qilib, bittasi bo'yalsa, oltidan bir chiqadi, u esa yarimdan ancha kichik. To'g'risi, suratni ham uchga ko'paytirish, shunda oltidan uch chiqadi, mana shu ikkidan birga teng. Ikkala sonni o'zgartiring, faqat pastdagini emas." }
  },

  // ---- s6 TEST (MC, дроби): 3/4 = ?/8 → 6/8 (correct opt0) ----
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Допиши равную дробь', uz: "Teng kasrni to'ldiring" },
    question: { ru: 'Какая дробь со знаменателем 8 равна 3/4?', uz: "Maxraji 8 bo'lgan qaysi kasr 3/4 ga teng?" },
    correct_text: { ru: 'Верно: 3/4 = 6/8 (умножили на 2: 3×2=6, 4×2=8).', uz: "To'g'ri: 3/4 = 6/8 (2 ga ko'paytirdik: 3×2=6, 4×2=8)." },
    hint_1: { ru: '3/8 — это меньше: числитель тоже надо умножить на 2, выйдет 6.', uz: "3/8 — bu kichik: suratni ham 2 ga ko'paytirish kerak, 6 chiqadi." },
    hint_2: { ru: '7/8 больше 3/4. А 3/4 это ровно 6/8.', uz: "7/8 3/4 dan katta. 3/4 esa aniq 6/8." },
    hint_3: { ru: '4/8 — это 1/2, а не 3/4. Нужно 6/8.', uz: "4/8 — bu 1/2, 3/4 emas. 6/8 kerak." },
    wrong_default: { ru: '4 умножили на 2, чтобы вышло 8 — значит и 3 умножь на 2. 3/4 = 6/8.', uz: "8 chiqishi uchun 4 ni 2 ga ko'paytirdik — demak 3 ni ham 2 ga ko'paytiring. 3/4 = 6/8." },
    audio: {
      intro: { ru: 'Какая дробь со знаменателем восемь равна трём четвёртым? Выбери ответ.', uz: "Maxraji sakkiz bo'lgan qaysi kasr to'rtdan uchga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Три четвёртых это шесть восьмых, умножили на два.', uz: "To'g'ri. To'rtdan uch — bu sakkizdan olti, ikkiga ko'paytirdik." },
      on_wrong: { ru: 'Пока нет. 4 умножили на 2, значит и 3 умножь на 2.', uz: "Hali emas. 4 ni 2 ga ko'paytirdik, demak 3 ni ham 2 ga ko'paytiring." }
    }
  },

  // ---- s7 TEST (MC, текст misconception): 1/2 = 1/6? Нет (correct opt0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Только знаменатель?', uz: "Faqat maxrajmi?" },
    question: { ru: 'Чтобы из 1/2 сделать шестые доли, кто-то написал 1/6. Верно?', uz: "1/2 dan oltidan ulush qilish uchun kimdir 1/6 deb yozdi. To'g'rimi?" },
    opt0: { ru: 'Неверно — надо умножить и числитель: 1/2 = 3/6', uz: "Noto'g'ri — suratni ham ko'paytirish kerak: 1/2 = 3/6" },
    opt1: { ru: 'Верно — знаменатель стал 6, значит 1/6', uz: "To'g'ri — maxraj 6 bo'ldi, demak 1/6" },
    opt2: { ru: 'Верно, но только если числитель оставить', uz: "To'g'ri, lekin faqat suratni qoldirsa" },
    opt3: { ru: 'Так дробь вообще не записать', uz: "Bunday kasrni umuman yozib bo'lmaydi" },
    correct_text: { ru: 'Верно: умножили знаменатель на 3 — умножь и числитель на 3. 1/2 = 3/6, а не 1/6.', uz: "To'g'ri: maxrajni 3 ga ko'paytirdik — suratni ham 3 ga ko'paytiring. 1/2 = 3/6, 1/6 emas." },
    hint_1: { ru: 'Это ошибка: 1/6 намного меньше 1/2. Числитель тоже надо умножить на 3.', uz: "Bu xato: 1/6 1/2 dan ancha kichik. Suratni ham 3 ga ko'paytirish kerak." },
    hint_2: { ru: 'Числитель оставлять нельзя — иначе дробь уменьшится. Нужно 3/6.', uz: "Suratni qoldirib bo'lmaydi — aks holda kasr kichrayadi. 3/6 kerak." },
    hint_3: { ru: 'Записать можно: 1/2 = 3/6. Просто умножь оба числа на 3.', uz: "Yozsa bo'ladi: 1/2 = 3/6. Faqat ikkala sonni 3 ga ko'paytiring." },
    wrong_default: { ru: 'Нет. Меняешь знаменатель — меняй и числитель. 1/2 = 3/6.', uz: "Yo'q. Maxraj o'zgarsa — surat ham o'zgaradi. 1/2 = 3/6." },
    audio: {
      intro: { ru: 'Чтобы из одной второй сделать шестые доли, кто-то написал одну шестую. Верно ли это? Выбери ответ.', uz: "Ikkidan birdan oltidan ulush qilish uchun kimdir oltidan bir deb yozdi. Bu to'g'rimi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Надо умножить и числитель на три, выйдет три шестых.', uz: "To'g'ri. Suratni ham uchga ko'paytirish kerak, oltidan uch chiqadi." },
      on_wrong: { ru: 'Это ошибка: меняешь знаменатель — меняй и числитель.', uz: "Bu xato: maxraj o'zgarsa — surat ham o'zgaradi." }
    }
  },

  // ---- s8 CASE setup: Лайло, рецепт (2/3 стакана, мерка в шестых) ----
  s8: {
    eyebrow: { ru: 'Задача · рецепт', uz: "Masala · retsept" },
    title: { ru: 'Лайло готовит по рецепту.', uz: "Laylo retsept bo'yicha tayyorlaydi." },
    body_p1: { ru: 'В рецепте нужно 2/3 стакана муки. Но у Лайло мерный стакан с делениями на шестые доли. Сколько шестых ей отмерить, чтобы вышло ровно 2/3?', uz: "Retseptda 2/3 stakan un kerak. Lekin Layloda oltidan ulushlarga bo'lingan o'lchov stakani bor. Aniq 2/3 chiqishi uchun u nechta oltidanni o'lchashi kerak?" },
    card_line_label: { ru: 'Нужно по рецепту', uz: "Retsept bo'yicha kerak" },
    card_line_value: { ru: '2/3 стакана', uz: "2/3 stakan" },
    card_parts_label: { ru: 'Мерка делит на', uz: "O'lchov bo'ladi" },
    card_parts_value: { ru: 'шестые доли', uz: "oltidan ulushlar" },
    outro: { ru: 'Нужно записать 2/3 в шестых долях. Помоги Лайло на следующем шаге.', uz: "2/3 ni oltidan ulushlarda yozish kerak. Keyingi bosqichda Layloga yordam bering." },
    btn_help: { ru: 'Помочь Лайло', uz: "Layloga yordam berish" },
    audio: { ru: 'Лайло готовит по рецепту. Нужно две третьих стакана муки, но у неё мерный стакан с делениями на шестые доли. Сколько шестых ей отмерить, чтобы вышло ровно две третьих? Нужно записать две третьих в шестых долях. Подумай, как.', uz: "Laylo retsept bo'yicha tayyorlaydi. Ikkidan... ya'ni uchdan ikki stakan un kerak, lekin uning o'lchov stakani oltidan ulushlarga bo'lingan. Aniq uchdan ikki chiqishi uchun u nechta oltidanni o'lchashi kerak? Uchdan ikkini oltidanlarda yozish kerak. Qanday qilishni o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, дроби): 2/3 = ?/6 → 4/6 (correct opt0) ----
  s9: {
    eyebrow: { ru: 'Задача · рецепт', uz: "Masala · retsept" },
    label: { ru: 'Сколько шестых?', uz: "Nechta oltidan?" },
    question: { ru: 'Сколько шестых долей равно 2/3 стакана?', uz: "Necha oltidan ulush 2/3 stakanga teng?" },
    correct_text: { ru: 'Верно: 2/3 = 4/6 (умножили на 2: 2×2=4, 3×2=6). Лайло отмерит 4 шестых.', uz: "To'g'ri: 2/3 = 4/6 (2 ga ko'paytirdik: 2×2=4, 3×2=6). Laylo 4 ta oltidanni o'lchaydi." },
    hint_1: { ru: '2/6 — это 1/3, в два раза меньше. Числитель тоже умножь на 2.', uz: "2/6 — bu 1/3, ikki barobar kichik. Suratni ham 2 ga ko'paytiring." },
    hint_2: { ru: '3/6 — это 1/2, а не 2/3. Нужно 4/6.', uz: "3/6 — bu 1/2, 2/3 emas. 4/6 kerak." },
    hint_3: { ru: '5/6 больше 2/3. А 2/3 это ровно 4/6.', uz: "5/6 2/3 dan katta. 2/3 esa aniq 4/6." },
    wrong_default: { ru: '3 умножили на 2, чтобы вышло 6 — значит и 2 умножь на 2. 2/3 = 4/6.', uz: "6 chiqishi uchun 3 ni 2 ga ko'paytirdik — demak 2 ni ham 2 ga ko'paytiring. 2/3 = 4/6." },
    audio: {
      intro: { ru: 'Сколько шестых долей равно двум третьим стакана? Выбери ответ.', uz: "Necha oltidan ulush uchdan ikki stakanga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Две третьих это четыре шестых, умножили на два.', uz: "To'g'ri. Uchdan ikki — bu oltidan to'rt, ikkiga ko'paytirdik." },
      on_wrong: { ru: 'Пока нет. 3 умножили на 2, значит и 2 умножь на 2.', uz: "Hali emas. 3 ni 2 ga ko'paytirdik, demak 2 ni ham 2 ga ko'paytiring." }
    }
  },

  // ---- s10 CASE conclusion (MC, текст): почему 2/3 = 4/6 (correct opt0) ----
  s10: {
    eyebrow: { ru: 'Задача · рецепт', uz: "Masala · retsept" },
    label: { ru: 'Почему так', uz: "Nega shunday" },
    question: { ru: 'Почему 2/3 равно 4/6?', uz: "Nega 2/3 4/6 ga teng?" },
    opt0: { ru: 'Числитель и знаменатель умножили на одно число (на 2) — длина не изменилась.', uz: "Surat va maxrajni bir songa (2 ga) ko'paytirdik — uzunlik o'zgarmadi." },
    opt1: { ru: 'Потому что 4 и 6 больше, чем 2 и 3.', uz: "Chunki 4 va 6 2 va 3 dan katta." },
    opt2: { ru: 'Потому что мы прибавили 2 к каждому числу.', uz: "Chunki har bir songa 2 qo'shdik." },
    opt3: { ru: 'На самом деле они не равны.', uz: "Aslida ular teng emas." },
    correct_text: { ru: 'Верно: умножили оба числа на 2. 2×2=4, 3×2=6 — дробь та же, только доли мельче.', uz: "To'g'ri: ikkala sonni 2 ga ko'paytirdik. 2×2=4, 3×2=6 — kasr o'sha, faqat ulushlar mayda." },
    hint_1: { ru: 'Дело не в том, что числа больше, а в том, что их умножили на ОДНО число.', uz: "Gap sonlar katta bo'lganida emas, balki ularni BIR songa ko'paytirilganida." },
    hint_2: { ru: 'Не прибавили, а умножили: 2×2 и 3×2. Прибавление дробь меняет.', uz: "Qo'shmadik, ko'paytirdik: 2×2 va 3×2. Qo'shish kasrni o'zgartiradi." },
    hint_3: { ru: 'Они равны: и 2/3, и 4/6 закрашивают одинаковую длину.', uz: "Ular teng: 2/3 ham, 4/6 ham bir xil uzunlikni bo'yaydi." },
    wrong_default: { ru: 'Умножили числитель и знаменатель на одно число (2) — получилась равная дробь.', uz: "Surat va maxrajni bir songa (2 ga) ko'paytirdik — teng kasr chiqdi." },
    audio: {
      intro: { ru: 'Почему две третьих равно четырём шестым? Выбери верное объяснение.', uz: "Nega uchdan ikki oltidan to'rtga teng? To'g'ri izohni tanlang." },
      on_correct: { ru: 'Верно. Умножили оба числа на два, длина не изменилась.', uz: "To'g'ri. Ikkala sonni ikkiga ko'paytirdik, uzunlik o'zgarmadi." },
      on_wrong: { ru: 'Пока нет. Главное — умножили оба числа на одно и то же.', uz: "Hali emas. Asosiysi — ikkala sonni bir xil songa ko'paytirdik." }
    }
  },

  // ---- s11 TEST (MC, дроби): какая равна 3/4 → 6/8 (correct opt0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — найди равную', uz: "Oxirgisi — tengini toping" },
    question: { ru: 'Какая дробь равна 3/4?', uz: "Qaysi kasr 3/4 ga teng?" },
    correct_text: { ru: 'Верно: 6/8 = 3/4 (умножили на 2: 3×2=6, 4×2=8).', uz: "To'g'ri: 6/8 = 3/4 (2 ga ko'paytirdik: 3×2=6, 4×2=8)." },
    hint_1: { ru: '5/8 не равно 3/4: 3/4 это ровно 6/8.', uz: "5/8 3/4 ga teng emas: 3/4 aniq 6/8." },
    hint_2: { ru: '3/8 — это в два раза меньше 3/4. Числитель тоже умножь на 2.', uz: "3/8 — bu 3/4 dan ikki barobar kichik. Suratni ham 2 ga ko'paytiring." },
    hint_3: { ru: '4/6 — это 2/3, а не 3/4. Это разные дроби.', uz: "4/6 — bu 2/3, 3/4 emas. Bu har xil kasrlar." },
    wrong_default: { ru: 'Умножь числитель и знаменатель 3/4 на 2: получится 6/8.', uz: "3/4 ning surat va maxrajini 2 ga ko'paytiring: 6/8 chiqadi." },
    audio: {
      intro: { ru: 'Последнее задание. Какая дробь равна трём четвёртым? Выбери ответ.', uz: "Oxirgi topshiriq. Qaysi kasr to'rtdan uchga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Шесть восьмых это три четвёртых, умножили на два.', uz: "To'g'ri. Sakkizdan olti — bu to'rtdan uch, ikkiga ko'paytirdik." },
      on_wrong: { ru: 'Пока нет. Умножь оба числа трёх четвёртых на одно и то же.', uz: "Hali emas. To'rtdan uchning ikkala sonini bir xil songa ko'paytiring." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок + блок связей ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты узнаёшь равные дроби.', uz: "Endi siz teng kasrlarni taniysiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Эквивалентные дроби — одно и то же число, записанное разными долями.', uz: "Ekvivalent kasrlar — bitta son, har xil ulushlarda yozilgan." },
    main_2: { ru: 'Чтобы получить равную дробь, умножь числитель и знаменатель на одно число.', uz: "Teng kasr olish uchun surat va maxrajni bir songa ko'paytiring." },
    main_3: { ru: 'Меняешь знаменатель — обязательно меняй и числитель (1/2 = 3/6, а не 1/6).', uz: "Maxraj o'zgarsa — surat ham albatta o'zgaradi (1/2 = 3/6, 1/6 emas)." },
    main_4: { ru: 'Закрашенная длина не меняется — меняется только число долей.', uz: "Bo'yalgan uzunlik o'zgarmaydi — faqat ulushlar soni o'zgaradi." },
    back_to_hook: { ru: 'Камрон накопил 1/2, Бобур 3/6. Но 1/2 = 3/6 — это одна и та же высота. Они накопили поровну!', uz: "Kamron 1/2, Bobur 3/6 yig'di. Lekin 1/2 = 3/6 — bu bir xil balandlik. Ular teng yig'gan ekan!" },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сравнение дробей с разными знаменателями» и другие уроки сравнения.', uz: "«Har xil maxrajli kasrlarni taqqoslash» va boshqa taqqoslash darslari." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сокращение дробей — как упростить дробь, разделив на общее число.', uz: "kasrlarni qisqartirish — kasrni umumiy songa bo'lib soddalashtirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично! Теперь ты узнаёшь равные, эквивалентные дроби. Это одно и то же число, записанное разными долями. Чтобы получить равную дробь, умножь числитель и знаменатель на одно и то же число. Если меняешь знаменатель, обязательно меняй и числитель. Закрашенная длина при этом не меняется. Камрон накопил одну вторую, Бобур три шестых, но это одна и та же высота, они накопили поровну. Дальше научимся сокращать дроби.', uz: "Zo'r! Endi siz teng, ekvivalent kasrlarni taniysiz. Bu bitta son, har xil ulushlarda yozilgan. Teng kasr olish uchun surat va maxrajni bir xil songa ko'paytiring. Maxraj o'zgarsa, surat ham albatta o'zgaradi. Bo'yalgan uzunlik bunda o'zgarmaydi. Kamron ikkidan birni, Bobur oltidan uchni yig'di, lekin bu bir xil balandlik, ular teng yig'gan. Keyin kasrlarni qisqartirishni o'rganamiz." }
  }
};

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ (под тему «эквивалентные дроби»)
// ============================================================
// FracBar: полоса. Закраска = num/den (точная длина). grid — число делений сетки.
// sweep — линии сетки въезжают (деление доли). marker/winner — финишная черта + флажок.
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

// EquivStack: стопка эквивалентных дробей — все закрашены на ОДНУ длину, но с разным числом долей.
// rows: [{num, den}]. Наглядно: длина одинаковая → дроби равны. dimWhen — индекс «неправильной» строки (тусклая).
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
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// Детерминированно переставляет варианты MC, чтобы верный ответ не всегда был «A».
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

// Блок связей урока (опора + следующий урок) — печатается на summary.
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
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
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 3, den: 6 }]} animateIn={true}/>
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

// s1 — EXPLORATION step-by-step: 1/2 = 2/4 = 3/6 (стопка растёт, длина та же).
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
  const allRows = [{ num: 1, den: 2 }, { num: 2, den: 4 }, { num: 3, den: 6 }];
  const rows = allRows.slice(0, Math.max(0, step));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 120, justifyContent: 'center' }}>
          {rows.length > 0
            ? <EquivStack rows={rows} animateIn={true} sweep={true}/>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: собери 3/6 = 1/2 (эталон сверху).
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [num, setNum] = useState(1);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const onSlider = (v) => { if (solved) return; setChecked(false); setNum(v); };
  const check = () => {
    const ok = num === 3;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* эталон 1/2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
            <div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="1" d="2" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={1} den={2} color={T.blue} marker={solved} winner={false}/></div>
          </div>
          {/* регулируемая ?/6 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
            <div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n={String(num)} d="6" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={num} den={6} color={T.accent} marker={solved}/></div>
          </div>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {num}</p>
            <Slider value={num} min={0} max={6} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: умножай оба числа.
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
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 2, den: 4 }, { num: 3, den: 6 }]} animateIn={true} sweep={true}/>
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

// s4 — TEST choice (дроби): какая равна 1/2 → 2/4 (correct opt0).
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const base = [<Frac n="2" d="4" size="mid"/>, <Frac n="2" d="3" size="mid"/>, <Frac n="3" d="5" size="mid"/>, <Frac n="1" d="3" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={1} den={2} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE-2: меняй оба числа (1/2 ≠ 1/6).
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
          {/* 1/6 (неправильно, тусклая) vs 3/6 (правильно) */}
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 1, den: 6 }, { num: 3, den: 6 }]} animateIn={true} dimIdx={1}/>
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

// s6 — TEST choice (дроби): 3/4 = ?/8 → 6/8 (correct opt0).
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [<Frac n="6" d="8" size="mid"/>, <Frac n="3" d="8" size="mid"/>, <Frac n="7" d="8" size="mid"/>, <Frac n="4" d="8" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={3} den={4} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST choice (текст): 1/2 = 1/6? Нет (correct opt0).
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [0, 2, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — CASE setup: Лайло, рецепт.
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
          <EquivStack rows={[{ num: 2, den: 3 }]} animateIn={true}/>
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

// s9 — CASE step (дроби): 2/3 = ?/6 → 4/6 (correct opt0).
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [<Frac n="4" d="6" size="mid"/>, <Frac n="2" d="6" size="mid"/>, <Frac n="3" d="6" size="mid"/>, <Frac n="5" d="6" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={2} den={3} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE conclusion (текст): почему 2/3 = 4/6 (correct opt0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST choice (дроби): какая равна 3/4 → 6/8 (correct opt0).
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="6" d="8" size="mid"/>, <Frac n="5" d="8" size="mid"/>, <Frac n="3" d="8" size="mid"/>, <Frac n="4" d="6" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 3, 0, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={3} den={4} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s12 — SUMMARY: без счёта, закрывает крючок + блок связей; finishLesson один раз.
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
          <EquivStack rows={[{ num: 1, den: 2 }, { num: 3, den: 6 }]} animateIn={true}/>
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
export default function FractionEquivalentLesson({
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
`;
