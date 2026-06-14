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
// --- ПОД УРОК: frac_5_08 — Сокращение дробей ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-08-v1',
  lessonTitle: { ru: 'Сокращение дробей', uz: "Kasrlarni qisqartirish" }
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
  // ---- s0 HOOK (why): ответ 6/8 верный, но можно ли проще? зачем? ----
  s0: {
    eyebrow: { ru: 'Сокращение дробей · вступление', uz: "Kasrlarni qisqartirish · kirish" },
    title: { ru: 'Ответ 6/8 — верный. Но можно ли записать его проще?', uz: "Javob 6/8 — to'g'ri. Lekin uni soddaroq yozsa bo'ladimi?" },
    body: { ru: '6/8 и 3/4 закрашивают одинаковую длину — это одно и то же число. 3/4 записать проще: меньше частей, легче читать и считать. Возникает вопрос: зачем и как «сокращать» дробь до простого вида?', uz: "6/8 va 3/4 bir xil uzunlikni bo'yaydi — bu bitta son. 3/4 ni yozish soddaroq: bo'laklar kam, o'qish va hisoblash oson. Savol tug'iladi: kasrni sodda holatga «qisqartirish» nima uchun va qanday kerak?" },
    question: { ru: 'А ты как думаешь: 6/8 и 3/4 — это одно и то же, и зачем тогда сокращать?', uz: "Sizningcha-chi: 6/8 va 3/4 — bir xilmi, va nima uchun qisqartiramiz?" },
    opt0: { ru: 'Это одно и то же число; сокращаем, чтобы запись была проще', uz: "Bu bitta son; yozuv soddaroq bo'lishi uchun qisqartiramiz" },
    opt1: { ru: 'Это разные числа; 3/4 меньше 6/8', uz: "Bu har xil sonlar; 3/4 6/8 dan kichik" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Ответ шесть восьмых верный. Но шесть восьмых и три четвёртых закрашивают одинаковую длину, это одно и то же число. Три четвёртых записать проще: меньше частей, легче читать. Зачем и как сокращать дробь до простого вида? А ты как думаешь — шесть восьмых и три четвёртых это одно и то же, и зачем тогда сокращать? Выбери ответ.', uz: "Javob oltidan olti... ya'ni sakkizdan olti to'g'ri. Lekin sakkizdan olti va to'rtdan uch bir xil uzunlikni bo'yaydi, bu bitta son. To'rtdan uch yozish soddaroq: bo'laklar kam, o'qish oson. Kasrni sodda holatga qisqartirish nima uchun va qanday kerak? Sizningcha, 6/8 va 3/4 bir xilmi, va nima uchun qisqartiramiz? Javobni tanlang." }
  },

  // ---- s1 EXPLORATION (step): объединяем доли 6/8 → 3/4 ----
  s1: {
    eyebrow: { ru: 'Объединяем доли', uz: "Ulushlarni birlashtiramiz" },
    title: { ru: 'Объединим мелкие доли: 6/8 → 3/4', uz: "Mayda ulushlarni birlashtiramiz: 6/8 → 3/4" },
    conclusion: { ru: 'Сгруппировали по 2 доли — частей стало вдвое меньше. Числитель и знаменатель разделили на 2: 6÷2=3, 8÷2=4. Длина та же: 6/8 = 3/4.', uz: "2 tadan guruhladik — bo'laklar ikki barobar kamaydi. Surat va maxrajni 2 ga bo'ldik: 6÷2=3, 8÷2=4. Uzunlik o'sha: 6/8 = 3/4." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Объединим мелкие доли. Нажимай кнопку Дальше.',
        'Вот полоса, поделённая на 8 частей, закрашено шесть — это шесть восьмых.',
        'Сгруппируем доли по две: соседние линии исчезают, и восемь долей превращаются в четыре. Закрашенная длина не меняется.',
        'Теперь закрашено три части из четырёх — это три четвёртых. Мы разделили и числитель, и знаменатель на два: шесть на два три, восемь на два четыре. Шесть восьмых равно трём четвёртым, просто записано проще.'
      ],
      uz: [
        "Mayda ulushlarni birlashtiramiz. Davom etish tugmasini bosing.",
        "Mana 8 bo'lakka bo'lingan polosa, oltitasi bo'yalgan — bu sakkizdan olti.",
        "Ulushlarni ikkitadan guruhlaymiz: yondosh chiziqlar yo'qoladi va sakkizta ulush to'rttaga aylanadi. Bo'yalgan uzunlik o'zgarmaydi.",
        "Endi to'rttadan uchtasi bo'yalgan — bu to'rtdan uch. Biz surat va maxrajni ham ikkiga bo'ldik: olti bo'lib ikki uch, sakkiz bo'lib ikki to'rt. Sakkizdan olti to'rtdan uchga teng, faqat soddaroq yozilgan."
      ]
    }
  },

  // ---- s2 EXPLORATION (slider, divisor): сократи 8/12 до конца ----
  s2: {
    eyebrow: { ru: 'Подбери делитель', uz: "Bo'luvchini tanlang" },
    title: { ru: 'Сократи 8/12 как можно сильнее', uz: "8/12 ni imkon qadar kuchli qisqartiring" },
    intro: { ru: 'Двигай ползунок — на какое число делить и числитель, и знаменатель. Подходит только то, на что делятся оба. Найди самое большое такое число.', uz: "Slayderni suring — surat va maxrajni qaysi songa bo'lish. Faqat ikkalasi ham bo'linadigan son to'g'ri keladi. Eng katta shunday sonni toping." },
    target_text: { ru: 'Цель: сократи 8/12 до самой простой дроби.', uz: "Maqsad: 8/12 ni eng sodda kasrgacha qisqartiring." },
    eyebrow_slider: { ru: 'Делим на:', uz: "Bo'luvchi:" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_disabled_label: { ru: 'Сначала сократи', uz: "Avval qisqartiring" },
    fb_success_title: { ru: 'Верно', uz: "To'g'ri" },
    fb_success: { ru: 'Восемь и двенадцать делятся на четыре, это наибольший общий делитель. Восемь разделить на четыре два, двенадцать разделить на четыре три. Получилось две третьих, проще уже не сократить.', uz: "Sakkiz va o'n ikki to'rtga bo'linadi, bu eng katta umumiy bo'luvchi. Sakkizni to'rtga bo'lsak ikki, o'n ikkini to'rtga bo'lsak uch. Uchdan ikki chiqdi, bundan sodda qisqarmaydi." },
    fb_wrong_title: { ru: 'Почти', uz: "Deyarli" },
    fb_wrong: { ru: 'И восемь, и двенадцать делятся на четыре. Восемь разделить на четыре два, двенадцать разделить на четыре три. На четыре самое сильное сокращение. Поставь ползунок на четыре.', uz: "Sakkiz ham, o'n ikki ham to'rtga bo'linadi. Sakkizni to'rtga bo'lsak ikki, o'n ikkini to'rtga bo'lsak uch. To'rtga eng kuchli qisqartirish. Slayderni to'rtga qo'ying." },
    audio: { ru: 'Сократи восемь двенадцатых как можно сильнее. Двигай ползунок: на какое число делить и числитель, и знаменатель. Подходит только то, на что делятся оба. И восемь, и двенадцать делятся на четыре, это самое большое такое число. Восемь на четыре два, двенадцать на четыре три. Получится две третьих.', uz: "Sakkizdan o'n ikkidan... ya'ni o'n ikkidan sakkizni imkon qadar kuchli qisqartiring. Slayderni suring: surat va maxrajni qaysi songa bo'lish. Faqat ikkalasi bo'linadigan son to'g'ri. 8 ham, 12 ham 4 ga bo'linadi, bu eng katta son. Sakkiz bo'lib to'rt ikki, o'n ikki bo'lib to'rt uch. Uchdan ikki chiqadi." }
  },

  // ---- s3 RULE: делим И числитель, И знаменатель на общий делитель ----
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Сокращение дроби', uz: "Kasrni qisqartirish" },
    title: { ru: 'Раздели числитель и знаменатель на их общий делитель — дробь станет проще, но не изменится.', uz: "Surat va maxrajni ularning umumiy bo'luvchisiga bo'ling — kasr soddalashadi, lekin o'zgarmaydi." },
    card_top: { ru: 'Найди число, на которое делятся и числитель, и знаменатель.', uz: "Surat ham, maxraj ham bo'linadigan sonni toping." },
    card_bottom: { ru: 'Раздели оба на это число. Длина дроби не меняется — меняется только запись.', uz: "Ikkalasini shu songa bo'ling. Kasr uzunligi o'zgarmaydi — faqat yozuv o'zgaradi." },
    card_line: { ru: '6/8 = 3/4 (÷2). Это обратное к умножению из прошлого урока.', uz: "6/8 = 3/4 (÷2). Bu o'tgan darsdagi ko'paytirishning teskarisi." },
    outro: { ru: 'Если делить на наибольший общий делитель — дробь сразу становится самой простой.', uz: "Eng katta umumiy bo'luvchiga bo'linsa — kasr darrov eng sodda holga keladi." },
    audio: { ru: 'Запомни правило. Чтобы сократить дробь, раздели числитель и знаменатель на их общий делитель. Найди число, на которое делятся оба, и раздели на него и верх, и низ. Длина дроби не меняется, меняется только запись. Шесть восьмых равно трём четвёртым, разделили на два. Это обратное действие к умножению из прошлого урока. Если разделить на наибольший общий делитель, дробь сразу станет самой простой.', uz: "Qoidani eslab qoling. Kasrni qisqartirish uchun surat va maxrajni ularning umumiy bo'luvchisiga bo'ling. Ikkalasi bo'linadigan sonni toping va unga yuqorini ham, pastni ham bo'ling. Kasr uzunligi o'zgarmaydi, faqat yozuv o'zgaradi. Sakkizdan olti to'rtdan uchga teng, ikkiga bo'ldik. Bu o'tgan darsdagi ko'paytirishning teskarisi. Eng katta umumiy bo'luvchiga bo'linsa, kasr darrov eng sodda bo'ladi." }
  },

  // ---- s4 TEST (MC, дроби): 6/9 = ? → 2/3 (correct opt0) ----
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сократи дробь', uz: "Kasrni qisqartiring" },
    question: { ru: 'Сократи 6/9 до простого вида. Что получится?', uz: "6/9 ni sodda holgacha qisqartiring. Nima chiqadi?" },
    correct_text: { ru: 'Верно: 6 и 9 делятся на 3. 6÷3=2, 9÷3=3. Получается 2/3.', uz: "To'g'ri: 6 ham, 9 ham 3 ga bo'linadi. 6÷3=2, 9÷3=3. 2/3 chiqadi." },
    hint_1: { ru: '3/4 — это другая дробь. 6/9 делим на 3, выйдет 2/3.', uz: "3/4 — boshqa kasr. 6/9 ni 3 ga bo'lamiz, 2/3 chiqadi." },
    hint_2: { ru: '2/4 не равно 6/9. На 3 делятся оба: 6 и 9. Выйдет 2/3.', uz: "2/4 6/9 ga teng emas. 3 ga ikkalasi bo'linadi: 6 va 9. 2/3 chiqadi." },
    hint_3: { ru: '6/9 — это ещё не сокращённая запись. Раздели оба на 3.', uz: "6/9 — hali qisqarmagan yozuv. Ikkalasini 3 ga bo'ling." },
    wrong_default: { ru: '6 и 9 делятся на 3: 6÷3=2, 9÷3=3. Значит 6/9 = 2/3.', uz: "6 va 9 3 ga bo'linadi: 6÷3=2, 9÷3=3. Demak 6/9 = 2/3." },
    audio: {
      intro: { ru: 'Сократи шесть девятых до простого вида. Что получится? Выбери ответ.', uz: "To'qqizdan oltini sodda holgacha qisqartiring. Nima chiqadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на три: вышло две третьих.', uz: "To'g'ri. Uchga bo'ldik: uchdan ikki chiqdi." },
      on_wrong: { ru: 'Пока нет. И 6, и 9 делятся на 3. Раздели оба.', uz: "Hali emas. 6 ham, 9 ham 3 ga bo'linadi. Ikkalasini bo'ling." }
    }
  },

  // ---- s5 RULE-2 (misconception): делим ОБА числа, не только одно ----
  s5: {
    eyebrow: { ru: 'Правило · ошибка', uz: "Qoida · xato" },
    label: { ru: 'Делим оба числа, не одно', uz: "Ikkala sonni bo'lamiz, bittasini emas" },
    title: { ru: 'Сокращать нужно И числитель, И знаменатель. Разделишь только одно — дробь изменится.', uz: "Qisqartirishda surat ham, maxraj ham bo'linadi. Faqat bittasi bo'linsa — kasr o'zgaradi." },
    card_ok: { ru: 'Если у 6/8 разделить только числитель → 3/8. Это короче закрашено, дробь стала ДРУГОЙ, меньше.', uz: "6/8 da faqat surat bo'linsa → 3/8. Bo'yoq qisqaradi, kasr BOSHQA, kichik bo'lib qoladi." },
    card_bad: { ru: 'Правильно: делим и числитель, и знаменатель на 2 → 3/4. Длина та же, дробь равна.', uz: "To'g'risi: surat va maxrajni ham 2 ga bo'lamiz → 3/4. Uzunlik o'sha, kasr teng." },
    outro: { ru: 'Сокращение не меняет величину дроби — но только если делить оба числа на одно.', uz: "Qisqartirish kasr qiymatini o'zgartirmaydi — lekin faqat ikkala son bir songa bo'linsa." },
    audio: { ru: 'Внимание, частая ошибка. Сокращать нужно и числитель, и знаменатель. Если у шести восьмых разделить только числитель, выйдет три восьмых, и закрашено станет короче, дробь стала другой, меньше. Правильно делить и верх, и низ на два, тогда выйдет три четвёртых, длина та же. Сокращение не меняет величину дроби, но только если делить оба числа на одно и то же.', uz: "Diqqat, ko'p uchraydigan xato. Qisqartirishda surat ham, maxraj ham bo'linadi. Sakkizdan oltida faqat surat bo'linsa, sakkizdan uch chiqadi, bo'yoq qisqaradi, kasr boshqa, kichik bo'lib qoladi. To'g'risi yuqorini ham, pastni ham ikkiga bo'lish, shunda to'rtdan uch chiqadi, uzunlik o'sha. Qisqartirish kasr qiymatini o'zgartirmaydi, lekin faqat ikkala son bir songa bo'linsa." }
  },

  // ---- s6 TEST (MC, дроби): 10/15 = ? → 2/3 (correct opt0) ----
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сократи дробь', uz: "Kasrni qisqartiring" },
    question: { ru: 'Сократи 10/15 до простого вида. Что получится?', uz: "10/15 ni sodda holgacha qisqartiring. Nima chiqadi?" },
    correct_text: { ru: 'Верно: 10 и 15 делятся на 5. 10÷5=2, 15÷5=3. Получается 2/3.', uz: "To'g'ri: 10 va 15 5 ga bo'linadi. 10÷5=2, 15÷5=3. 2/3 chiqadi." },
    hint_1: { ru: 'Числа перепутаны: делим 10 (верх) и 15 (низ) на 5, выйдет 2/3, а не 5/3.', uz: "Sonlar almashgan: 10 (yuqori) va 15 (past) ni 5 ga bo'lamiz, 2/3 chiqadi, 5/3 emas." },
    hint_2: { ru: '2/5 не равно 10/15. На 5 делятся оба: 10 и 15. Выйдет 2/3.', uz: "2/5 10/15 ga teng emas. 5 ga ikkalasi bo'linadi: 10 va 15. 2/3 chiqadi." },
    hint_3: { ru: '10/15 — ещё не сокращено. Раздели оба числа на 5.', uz: "10/15 — hali qisqarmagan. Ikkala sonni 5 ga bo'ling." },
    wrong_default: { ru: '10 и 15 делятся на 5: 10÷5=2, 15÷5=3. Значит 10/15 = 2/3.', uz: "10 va 15 5 ga bo'linadi: 10÷5=2, 15÷5=3. Demak 10/15 = 2/3." },
    audio: {
      intro: { ru: 'Сократи десять пятнадцатых. Что получится? Выбери ответ.', uz: "O'n beshdan o'nni qisqartiring. Nima chiqadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на пять: вышло две третьих.', uz: "To'g'ri. Beshga bo'ldik: uchdan ikki chiqdi." },
      on_wrong: { ru: 'Пока нет. И 10, и 15 делятся на 5. Раздели оба.', uz: "Hali emas. 10 ham, 15 ham 5 ga bo'linadi. Ikkalasini bo'ling." }
    }
  },

  // ---- s7 TEST (MC, текст misconception): сократил только числитель 6/8→3/8? Нет (correct opt0) ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Оба числа или одно?', uz: "Ikkala sonmi yoki bitta?" },
    question: { ru: 'Кто-то «сократил» 6/8, разделив только числитель: 6÷2=3, и написал 3/8. Верно?', uz: "Kimdir 6/8 ni faqat suratni bo'lib «qisqartirdi»: 6÷2=3, va 3/8 deb yozdi. To'g'rimi?" },
    opt0: { ru: 'Неверно — надо разделить и знаменатель: 6/8 = 3/4', uz: "Noto'g'ri — maxrajni ham bo'lish kerak: 6/8 = 3/4" },
    opt1: { ru: 'Верно — числитель сократили, значит 3/8', uz: "To'g'ri — suratni qisqartirdik, demak 3/8" },
    opt2: { ru: 'Верно, но только если дробь была меньше 1', uz: "To'g'ri, lekin faqat kasr 1 dan kichik bo'lsa" },
    opt3: { ru: 'Так дробь вообще не сократить', uz: "Bunday kasrni umuman qisqartirib bo'lmaydi" },
    correct_text: { ru: 'Верно: разделили только верх — дробь уменьшилась. Надо делить оба: 6÷2=3, 8÷2=4 → 3/4.', uz: "To'g'ri: faqat yuqorini bo'ldik — kasr kichraydi. Ikkalasini bo'lish kerak: 6÷2=3, 8÷2=4 → 3/4." },
    hint_1: { ru: 'Это ошибка: 3/8 меньше 6/8. Знаменатель тоже надо разделить на 2.', uz: "Bu xato: 3/8 6/8 dan kichik. Maxrajni ham 2 ga bo'lish kerak." },
    hint_2: { ru: 'Делить только числитель нельзя — дробь меняется. Нужно 3/4.', uz: "Faqat suratni bo'lib bo'lmaydi — kasr o'zgaradi. 3/4 kerak." },
    hint_3: { ru: 'Сократить можно: раздели оба числа на 2 → 3/4.', uz: "Qisqartirsa bo'ladi: ikkala sonni 2 ga bo'ling → 3/4." },
    wrong_default: { ru: 'Нет. Делим и числитель, и знаменатель на 2: 6/8 = 3/4.', uz: "Yo'q. Surat va maxrajni 2 ga bo'lamiz: 6/8 = 3/4." },
    audio: {
      intro: { ru: 'Кто-то сократил шесть восьмых, разделив только числитель, и написал три восьмых. Верно ли это? Выбери ответ.', uz: "Kimdir sakkizdan oltini faqat suratni bo'lib qisqartirdi va sakkizdan uch deb yozdi. Bu to'g'rimi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Надо разделить и знаменатель: вышло бы три четвёртых.', uz: "To'g'ri. Maxrajni ham bo'lish kerak: to'rtdan uch chiqardi." },
      on_wrong: { ru: 'Это ошибка: делишь верх — дели и низ на то же число.', uz: "Bu xato: yuqori bo'linsa — past ham shu songa bo'linadi." }
    }
  },

  // ---- s8 CASE setup (what-for): Санжар, рецепт 8/12 → проще измерить ----
  s8: {
    eyebrow: { ru: 'Задача · рецепт', uz: "Masala · retsept" },
    title: { ru: 'Санжар печёт по рецепту.', uz: "Sanjar retsept bo'yicha pishiradi." },
    body_p1: { ru: 'В рецепте странно записано: 8/12 стакана сахара. Мерный стакан у Санжара делится на трети. В какой простой дроби удобно отмерить — то есть до чего сократить 8/12?', uz: "Retseptda g'alati yozilgan: 8/12 stakan shakar. Sanjarning o'lchov stakani uchdanlarga bo'lingan. Qaysi sodda kasrda o'lchash qulay — ya'ni 8/12 ni nimagacha qisqartirish kerak?" },
    card_line_label: { ru: 'В рецепте', uz: "Retseptda" },
    card_line_value: { ru: '8/12 стакана', uz: "8/12 stakan" },
    card_parts_label: { ru: 'Мерка делит на', uz: "O'lchov bo'ladi" },
    card_parts_value: { ru: 'трети', uz: "uchdanlar" },
    outro: { ru: 'Нужно сократить 8/12 до дроби со знаменателем 3. Помоги Санжару на следующем шаге.', uz: "8/12 ni maxraji 3 bo'lgan kasrgacha qisqartirish kerak. Keyingi bosqichda Sanjarga yordam bering." },
    btn_help: { ru: 'Помочь Санжару', uz: "Sanjarga yordam berish" },
    audio: { ru: 'Санжар печёт по рецепту. Там странно записано: восемь двенадцатых стакана сахара. А мерный стакан делится на трети. В какой простой дроби удобно отмерить, то есть до чего сократить восемь двенадцатых? Нужно получить дробь со знаменателем три. Подумай, как.', uz: "Sanjar retsept bo'yicha pishiradi. U yerda g'alati yozilgan: o'n ikkidan sakkiz stakan shakar. O'lchov stakani esa uchdanlarga bo'lingan. Qaysi sodda kasrda o'lchash qulay, ya'ni o'n ikkidan sakkizni nimagacha qisqartirish kerak? Maxraji uch bo'lgan kasr olish kerak. Qanday qilishni o'ylab ko'ring." }
  },

  // ---- s9 CASE step (MC, дроби): 8/12 = ? → 2/3 (correct opt0) ----
  s9: {
    eyebrow: { ru: 'Задача · рецепт', uz: "Masala · retsept" },
    label: { ru: 'До чего сократить?', uz: "Nimagacha qisqaradi?" },
    question: { ru: 'Сократи 8/12 до простого вида (со знаменателем 3). Что получится?', uz: "8/12 ni sodda holgacha (maxraji 3) qisqartiring. Nima chiqadi?" },
    correct_text: { ru: 'Верно: 8 и 12 делятся на 4. 8÷4=2, 12÷4=3. Получается 2/3 — Санжар отмерит две трети.', uz: "To'g'ri: 8 va 12 4 ga bo'linadi. 8÷4=2, 12÷4=3. 2/3 chiqadi — Sanjar uchdan ikkini o'lchaydi." },
    hint_1: { ru: '4/6 ещё не сокращено до конца: и 4, и 6 делятся на 2. Дойди до 2/3.', uz: "4/6 hali oxirigacha qisqarmagan: 4 ham, 6 ham 2 ga bo'linadi. 2/3 gacha yetkazing." },
    hint_2: { ru: '2/4 не равно 8/12. На 4 делятся оба: 8 и 12. Выйдет 2/3.', uz: "2/4 8/12 ga teng emas. 4 ga ikkalasi bo'linadi: 8 va 12. 2/3 chiqadi." },
    hint_3: { ru: '8/12 — ещё не сокращено. Раздели оба на 4.', uz: "8/12 — hali qisqarmagan. Ikkalasini 4 ga bo'ling." },
    wrong_default: { ru: '8 и 12 делятся на 4: 8÷4=2, 12÷4=3. Значит 8/12 = 2/3.', uz: "8 va 12 4 ga bo'linadi: 8÷4=2, 12÷4=3. Demak 8/12 = 2/3." },
    audio: {
      intro: { ru: 'Сократи восемь двенадцатых до дроби со знаменателем три. Что получится? Выбери ответ.', uz: "O'n ikkidan sakkizni maxraji uch bo'lgan kasrgacha qisqartiring. Nima chiqadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на четыре: вышло две третьих.', uz: "To'g'ri. To'rtga bo'ldik: uchdan ikki chiqdi." },
      on_wrong: { ru: 'Пока нет. И 8, и 12 делятся на 4. Раздели оба.', uz: "Hali emas. 8 ham, 12 ham 4 ga bo'linadi. Ikkalasini bo'ling." }
    }
  },

  // ---- s10 CASE conclusion (MC, текст): почему 8/12 = 2/3 (correct opt0) ----
  s10: {
    eyebrow: { ru: 'Задача · рецепт', uz: "Masala · retsept" },
    label: { ru: 'Почему так', uz: "Nega shunday" },
    question: { ru: 'Почему 8/12 можно записать как 2/3?', uz: "Nega 8/12 ni 2/3 deb yozsa bo'ladi?" },
    opt0: { ru: 'Числитель и знаменатель разделили на одно число (4) — длина не изменилась.', uz: "Surat va maxrajni bir songa (4 ga) bo'ldik — uzunlik o'zgarmadi." },
    opt1: { ru: 'Потому что 2 и 3 меньше, чем 8 и 12.', uz: "Chunki 2 va 3 8 va 12 dan kichik." },
    opt2: { ru: 'Потому что вычли по одинаковому числу.', uz: "Chunki bir xil son ayirdik." },
    opt3: { ru: 'На самом деле они не равны.', uz: "Aslida ular teng emas." },
    correct_text: { ru: 'Верно: разделили оба числа на 4. 8÷4=2, 12÷4=3 — дробь та же, только записана проще.', uz: "To'g'ri: ikkala sonni 4 ga bo'ldik. 8÷4=2, 12÷4=3 — kasr o'sha, faqat soddaroq yozilgan." },
    hint_1: { ru: 'Дело не в том, что числа меньше, а в том, что их разделили на ОДНО число.', uz: "Gap sonlar kichik bo'lganida emas, balki ularni BIR songa bo'linganida." },
    hint_2: { ru: 'Не вычли, а разделили: 8÷4 и 12÷4. Вычитание меняет дробь.', uz: "Ayirmadik, bo'ldik: 8÷4 va 12÷4. Ayirish kasrni o'zgartiradi." },
    hint_3: { ru: 'Они равны: 8/12 и 2/3 закрашивают одинаковую длину.', uz: "Ular teng: 8/12 va 2/3 bir xil uzunlikni bo'yaydi." },
    wrong_default: { ru: 'Разделили числитель и знаменатель на одно число (4) — дробь та же, проще.', uz: "Surat va maxrajni bir songa (4 ga) bo'ldik — kasr o'sha, soddaroq." },
    audio: {
      intro: { ru: 'Почему восемь двенадцатых можно записать как две третьих? Выбери верное объяснение.', uz: "Nega o'n ikkidan sakkizni uchdan ikki deb yozsa bo'ladi? To'g'ri izohni tanlang." },
      on_correct: { ru: 'Верно. Разделили оба числа на четыре, длина не изменилась.', uz: "To'g'ri. Ikkala sonni to'rtga bo'ldik, uzunlik o'zgarmadi." },
      on_wrong: { ru: 'Пока нет. Главное — разделили оба числа на одно и то же.', uz: "Hali emas. Asosiysi — ikkala sonni bir xil songa bo'ldik." }
    }
  },

  // ---- s11 TEST (MC, дроби): 12/16 = ? → 3/4 (correct opt0) ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    label: { ru: 'Последняя — сократи', uz: "Oxirgisi — qisqartiring" },
    question: { ru: 'Сократи 12/16 до простого вида. Что получится?', uz: "12/16 ni sodda holgacha qisqartiring. Nima chiqadi?" },
    correct_text: { ru: 'Верно: 12 и 16 делятся на 4. 12÷4=3, 16÷4=4. Получается 3/4.', uz: "To'g'ri: 12 va 16 4 ga bo'linadi. 12÷4=3, 16÷4=4. 3/4 chiqadi." },
    hint_1: { ru: '6/8 ещё не сокращено до конца: оба делятся на 2. Дойди до 3/4.', uz: "6/8 hali oxirigacha qisqarmagan: ikkalasi 2 ga bo'linadi. 3/4 gacha yetkazing." },
    hint_2: { ru: '4/4 — это целое (1), а 12/16 меньше 1. Раздели оба на 4 → 3/4.', uz: "4/4 — bu butun (1), 12/16 esa 1 dan kichik. Ikkalasini 4 ga bo'ling → 3/4." },
    hint_3: { ru: '12/16 — ещё не сокращено. Раздели оба на 4.', uz: "12/16 — hali qisqarmagan. Ikkalasini 4 ga bo'ling." },
    wrong_default: { ru: '12 и 16 делятся на 4: 12÷4=3, 16÷4=4. Значит 12/16 = 3/4.', uz: "12 va 16 4 ga bo'linadi: 12÷4=3, 16÷4=4. Demak 12/16 = 3/4." },
    audio: {
      intro: { ru: 'Последнее задание. Сократи двенадцать шестнадцатых. Что получится? Выбери ответ.', uz: "Oxirgi topshiriq. O'n oltidan o'n ikkini qisqartiring. Nima chiqadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разделили на четыре: вышло три четвёртых.', uz: "To'g'ri. To'rtga bo'ldik: to'rtdan uch chiqdi." },
      on_wrong: { ru: 'Пока нет. И 12, и 16 делятся на 4. Раздели оба.', uz: "Hali emas. 12 ham, 16 ham 4 ga bo'linadi. Ikkalasini bo'ling." }
    }
  },

  // ---- s12 SUMMARY: закрывает крючок + блок связей ----
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты умеешь сокращать дроби.', uz: "Endi siz kasrlarni qisqartira olasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Сократить дробь — записать её проще, не меняя величину.', uz: "Kasrni qisqartirish — qiymatini o'zgartirmasdan soddaroq yozish." },
    main_2: { ru: 'Раздели числитель и знаменатель на их общий делитель.', uz: "Surat va maxrajni ularning umumiy bo'luvchisiga bo'ling." },
    main_3: { ru: 'Делить нужно ОБА числа на одно — иначе дробь изменится.', uz: "IKKALA sonni bir songa bo'lish kerak — aks holda kasr o'zgaradi." },
    main_4: { ru: 'На наибольший общий делитель — и дробь сразу самая простая.', uz: "Eng katta umumiy bo'luvchiga — kasr darrov eng sodda bo'ladi." },
    back_to_hook: { ru: 'Так зачем сокращать? 6/8 и 3/4 — одно число, но 3/4 проще: меньше частей, легче читать и считать. Вот зачем.', uz: "Xo'sh, nima uchun qisqartiramiz? 6/8 va 3/4 — bitta son, lekin 3/4 soddaroq: bo'laklar kam, o'qish va hisoblash oson. Mana nima uchun." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Эквивалентные дроби» (обратное действие) и «Деление столбиком».', uz: "«Ekvivalent kasrlar» (teskari amal) va «Burchak usulida bo'lish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сложение дробей с одинаковым знаменателем — начинаем действия с дробями.', uz: "bir xil maxrajli kasrlarni qo'shish — kasrlar ustida amallarni boshlaymiz." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично! Теперь ты умеешь сокращать дроби. Сократить дробь значит записать её проще, не меняя величину. Для этого раздели числитель и знаменатель на их общий делитель. Делить нужно оба числа на одно, иначе дробь изменится. А если разделить на наибольший общий делитель, дробь сразу станет самой простой. Зачем сокращать? Шесть восьмых и три четвёртых это одно число, но три четвёртых проще читать и считать. Дальше начнём складывать дроби.', uz: "Zo'r! Endi siz kasrlarni qisqartira olasiz. Kasrni qisqartirish — qiymatini o'zgartirmasdan soddaroq yozish. Buning uchun surat va maxrajni ularning umumiy bo'luvchisiga bo'ling. Ikkala sonni bir songa bo'lish kerak, aks holda kasr o'zgaradi. Eng katta umumiy bo'luvchiga bo'linsa, kasr darrov eng sodda bo'ladi. Nima uchun qisqartiramiz? 6/8 va 3/4 bitta son, lekin 3/4 ni o'qish va hisoblash oson. Keyin kasrlarni qo'shishni boshlaymiz." }
  }
};

// ============================================================
// УРОК-СПЕЦИФИЧНЫЕ ВИЗУАЛИЗАТОРЫ (под тему «сокращение дробей»)
// ============================================================
// FracBar: полоса, закраска num/den. grid — число делений. mergeTo+merging — при сокращении
// «лишние» линии (не кратные grid/mergeTo) плавно исчезают (cp-merge): доли объединяются.
const FracBar = ({ num, den, grid = null, mergeTo = null, merging = false, color = T.accent, height = 38, marker = false, winner = false, animateIn = false }) => {
  const pct = (num / den) * 100;
  const g = grid || den;
  const keep = (mergeTo && mergeTo > 0) ? g / mergeTo : 1;
  const ease = 'cubic-bezier(0.34, 1.1, 0.64, 1)';
  return (
    <div className="cp-bar" style={{ position: 'relative', width: '100%', height, borderRadius: 8, background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
        <div className={`cp-fill${animateIn ? ' cp-grow' : ''}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, transition: `width 0.5s ${ease}` }}/>
        {Array.from({ length: g - 1 }).map((_, i) => {
          const survive = !merging || !(mergeTo && mergeTo > 0) || ((i + 1) % keep === 0);
          return <div key={`${g}-${merging}-${i}`} className={(merging && !survive) ? 'cp-merge' : undefined} style={{ position: 'absolute', left: `${((i + 1) / g) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg }}/>;
        })}
      </div>
      {marker && num > 0 && (
        <div className={`cp-marker${animateIn ? ' cp-slide' : ''}`} style={{ position: 'absolute', left: `${pct}%`, top: -5, bottom: -5, width: 3, marginLeft: -1.5, background: color, borderRadius: 2, boxShadow: `0 0 7px ${color}`, transition: `left 0.5s ${ease}` }}>
          {winner && (<svg className="cp-flag" width="18" height="16" viewBox="0 0 18 16" style={{ position: 'absolute', top: -15, left: 1, overflow: 'visible' }}><path d="M1 1 L14 4 L1 8 Z" fill={color}/></svg>)}
        </div>
      )}
    </div>
  );
};

// SpinNum: число, которое «впрыгивает» при изменении (key=value → перемонтаж → cp-spin).
const SpinNum = ({ value, color = T.ink, size = 'clamp(22px, 4vw, 32px)' }) => (
  <span key={value} className="cp-spin display" style={{ color, fontSize: size, display: 'inline-block' }}>{value}</span>
);

// DivLadder: «лесенка деления» — строки сокращения с подписью ÷.
// steps: [{ a, b, by }] — было a/b, разделили на by.
const DivLadder = ({ steps }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
    {steps.map((s, i) => (
      <div key={i} className="cp-ladder-step" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', animationDelay: `${i * 0.18}s` }}>
        <Frac n={String(s.a)} d={String(s.b)} size="mid"/>
        <span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>÷{s.by}</span>
        <Op size="mid">=</Op>
        <Frac n={String(s.a / s.by)} d={String(s.b / s.by)} size="mid" color={T.accent}/>
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
        <div className="frame fade-up delay-1 hook-alive" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <div style={{ width: '100%', maxWidth: 520 }}><FracBar num={6} den={8} color={T.accent} animateIn={true}/></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="6" d="8" size="mid"/><Op>=</Op><Frac n="3" d="4" size="mid"/><span className="mop" style={{ color: T.ink3 }}>?</span></div>
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

// s1 — EXPLORATION step-by-step: 6/8 → 3/4 (доли объединяются).
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
  const merging = step >= 2;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 120, justifyContent: 'center' }}>
          {step >= 1
            ? <>
                <div style={{ width: '100%', maxWidth: 520 }}><FracBar num={6} den={8} grid={8} mergeTo={4} merging={merging} marker={step >= 3} color={T.accent}/></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Frac n={step >= 3 ? '3' : '6'} d={step >= 3 ? '4' : '8'} size="mid"/>
                  {step >= 3 && <><Op>=</Op><span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>6÷2=<SpinNum value={3} color={T.accent} size="clamp(16px,3vw,22px)"/>, 8÷2=<SpinNum value={4} color={T.accent} size="clamp(16px,3vw,22px)"/></span></>}
                </div>
              </>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(c.conclusion)}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: сократи 8/12 до конца (живое объединение).
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [d, setD] = useState(1);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const valid = (d > 1) && (8 % d === 0) && (12 % d === 0);   // делит оба
  const mergeTo = valid ? 12 / d : null;
  const onSlider = (v) => { if (solved) return; setChecked(false); setD(v); };
  const check = () => {
    const ok = d === 4;
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
          <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}><FracBar num={8} den={12} grid={12} mergeTo={mergeTo} merging={valid} marker={solved} color={T.accent}/></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Frac n="8" d="12" size="mid"/>
            {valid && <><span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>÷{d}</span><Op>=</Op><Frac n={String(8 / d)} d={String(12 / d)} size="mid" color={T.accent}/></>}
          </div>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.eyebrow_slider)} {d}{valid ? '' : (d > 1 ? ' ✗' : '')}</p>
            <Slider value={d} min={1} max={6} step={1} onChange={onSlider} disabled={solved}/>
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

// s3 — RULE: делим оба на общий делитель.
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
          <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}><FracBar num={6} den={8} grid={8} mergeTo={4} merging={true} marker={true} color={T.accent}/></div>
          <DivLadder steps={[{ a: 6, b: 8, by: 2 }]}/>
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

// s4 — TEST choice (дроби): 6/9 → 2/3.
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const base = [<Frac n="2" d="3" size="mid"/>, <Frac n="3" d="4" size="mid"/>, <Frac n="2" d="4" size="mid"/>, <Frac n="6" d="9" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={6} den={9} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s5 — RULE-2: делим оба числа, не одно.
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 3/8 — неправильно (только числитель), тусклая */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', opacity: 0.55 }}>
            <div style={{ width: 'clamp(48px, 11vw, 64px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="8" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={3} den={8} color={T.ink3} height={30}/></div>
          </div>
          {/* 3/4 — правильно */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
            <div style={{ width: 'clamp(48px, 11vw, 64px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="4" size="sm"/></div>
            <div style={{ flex: 1 }}><FracBar num={3} den={4} color={T.accent} marker={true} winner={true} height={30}/></div>
          </div>
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

// s6 — TEST choice (дроби): 10/15 → 2/3.
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [<Frac n="2" d="3" size="mid"/>, <Frac n="5" d="3" size="mid"/>, <Frac n="2" d="5" size="mid"/>, <Frac n="10" d="15" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 3, 1]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={10} den={15} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST choice (текст): сократил только числитель? Нет.
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 3, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — CASE setup: Санжар, рецепт.
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
          <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}><FracBar num={8} den={12} color={T.blue} animateIn={true}/></div>
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

// s9 — CASE step (дроби): 8/12 → 2/3.
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [<Frac n="2" d="3" size="mid"/>, <Frac n="4" d="6" size="mid"/>, <Frac n="2" d="4" size="mid"/>, <Frac n="8" d="12" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={8} den={12} color={T.blue} animateIn={true}/></div></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE conclusion (текст): почему 8/12 = 2/3.
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [2, 1, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST choice (дроби): 12/16 → 3/4.
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="3" d="4" size="mid"/>, <Frac n="6" d="8" size="mid"/>, <Frac n="4" d="4" size="mid"/>, <Frac n="12" d="16" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 3, 1, 2]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2><div className="frame" style={{ marginTop: 16 }}><FracBar num={12} den={16} color={T.blue} animateIn={true}/></div></>);
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
          <DivLadder steps={[{ a: 6, b: 8, by: 2 }]}/>
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
export default function FractionReduceLesson({
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
/* MATH: сокращение — слияние долей, счётчик, лесенка деления (frac_5_08). */
.cp-merge { animation: cpMerge 0.5s ease forwards; }
@keyframes cpMerge { from { opacity: 1; } to { opacity: 0; } }
.cp-spin { animation: cpSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes cpSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.cp-ladder-step { animation: cpLadderIn 0.4s ease-out backwards; }
@keyframes cpLadderIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
`;
