import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Объём прямоугольного параллелепипеда — geom_5_04 (Dars31)
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

    const gender = segment.g || this.gender;
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
    engine.setGender(ttsConfig.voiceGender || 'm');
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

// mt: рендерит текст, заменяя «a/b» (и «?/b») настоящей дробью Frac — без слэша.
// Если дробей нет, возвращает строку как есть. Применяется во всех видимых текстах.
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
// QUESTION SCREEN — универсальный MC-компонент под формат audio: { intro, on_correct, on_wrong }
// ============================================================
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure }) => {
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
        <div className="fade-up" style={{ maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(16px, 2.6vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(16px, 2.6vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
                style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && i === correctIdx ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
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
// --- POD UROK: geom_5_04 — To'g'ri burchakli parallelepiped hajmi / Объём параллелепипеда (PROMPT 2026-06-17 v2) ---
// Markaziy misconception M1: "hajm = yuza" (faqat tag qatlamni sanab, qatlamlarni unutish).
// M2: uchala o'lchovni emas, ikkitasini ko'paytirish. M3: sm² va sm³ ni chalkashtirish.
// v2 yangilanishlar (metodist 2026-06-17): qisqa sarlavhalar qaytarildi + matn kamaytirildi; bo'sh joy
// kattaroq vizualizator + yengil dekor bilan to'ldirildi; s7 HAQIQIY drag-and-drop; maslahatlar javobni
// OCHMAYDI (faqat yo'naltiradi); animatsiyalar yumshatildi; s3 (4-slayd) figurasi sonlari o'qiladigan
// qilindi; faktlar yashil ramkadan tashqariga (alohida ko'k karta) chiqarildi.
// ============================================================

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'geom-5-04-v1',
  lessonTitle: { ru: 'Объём прямоугольного параллелепипеда', uz: "To'g'ri burchakli parallelepiped hajmi" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — Rustam quti (tag 4x2, balandlik 3). Tuzoq M1: "2 son yetadi". ----
  s0: {
    eyebrow: { ru: 'Вопрос', uz: 'Savol' },
    title: { ru: 'Хватит ли двух чисел?', uz: "Ikki son yetadimi?" },
    lead: {
      ru: 'Дно — 8 кубиков. А вся коробка?',
      uz: "Asos — 8 kubcha. Butun quti-chi?"
    },
    opt0: { ru: 'Да, двух хватит', uz: "Ha, ikkitasi yetadi" },
    opt1: { ru: 'Нет, нужна высота', uz: "Yo'q, balandlik kerak" },
    opt2: { ru: 'Пока не знаю', uz: "Hozircha bilmayman" },
    reveal: {
      ru: 'Запомни ответ. К концу урока научимся находить объём любой коробки.',
      uz: "Javobni eslab qoling. Dars oxirida har qanday quti hajmini topamiz."
    },
    audio: {
      ru: 'Рустам собрал коробку. На дно, четыре на два, влезает восемь кубиков. Для площади дна хватило двух чисел. А чтобы заполнить всю коробку кубиками, двух чисел хватит? Как думаешь?',
      uz: "Rustam quti yasadi. Asosiga, to'rtga ikki, sakkizta kubcha sig'adi. Asosning yuzi uchun ikki son yetdi. Butun qutini kubchalar bilan to'ldirish uchun ikki son yetadimi? Sizningcha-chi?"
    }
  },

  // ---- s1 WARM-UP — tag yuzasi retrieval (geom_5_02). 4x2 = 8. correct B. ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Площадь дна', uz: "Asosning yuzi" },
    done_label: { ru: 'Вопрос', uz: 'Savol' },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: {
      ru: 'Отлично! Площадь дна — это стороны, перемноженные между собой. Это один слой.',
      uz: "Ajoyib! Asosning yuzi — bu tomonlarning ko'paytmasi. Bu bir qatlam."
    },
    questions: [
      {
        q: { ru: 'Дно 4 на 2. Сколько клеток?', uz: "Asos 4 ga 2. Nechta katak?" },
        opts: [{ ru: '8', uz: '8' }, { ru: '6', uz: '6' }, { ru: '12', uz: '12' }, { ru: '16', uz: '16' }],
        correct: 0,
        hint: { ru: 'Стороны не сложить, а перемножить.', uz: "Tomonlarni qo'shmang, ko'paytiring." },
        audio: { ru: 'Сначала вспомним прошлый урок. Дно коробки четыре на два. Сколько клеток на дне?', uz: "Avval o'tgan darsni eslaymiz. Quti asosi to'rtga ikki. Asosiga nechta katak?" }
      },
      {
        q: { ru: 'Дно 3 на 2. Сколько клеток?', uz: "Asos 3 ga 2. Nechta katak?" },
        opts: [{ ru: '5', uz: '5' }, { ru: '6', uz: '6' }, { ru: '9', uz: '9' }, { ru: '12', uz: '12' }],
        correct: 1,
        hint: { ru: 'Перемножь две стороны дна.', uz: "Asosning ikki tomonini ko'paytiring." },
        audio: { ru: 'Дно три на два. Сколько клеток?', uz: "Asos uchga ikki. Nechta katak?" }
      },
      {
        q: { ru: 'Дно 5 на 2. Сколько клеток?', uz: "Asos 5 ga 2. Nechta katak?" },
        opts: [{ ru: '12', uz: '12' }, { ru: '7', uz: '7' }, { ru: '10', uz: '10' }, { ru: '25', uz: '25' }],
        correct: 2,
        hint: { ru: 'Перемножь стороны, не складывай.', uz: "Tomonlarni ko'paytiring, qo'shmang." },
        audio: { ru: 'Дно пять на два. Сколько клеток?', uz: "Asos beshga ikki. Nechta katak?" }
      }
    ],
    audio: {
      next: { ru: 'Верно! Следующий вопрос.', uz: "To'g'ri! Keyingi savol." },
      on_correct: { ru: 'Отлично, все три верно!', uz: "Ajoyib, uchalasi ham to'g'ri!" },
      on_wrong:   { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // ---- s2 EXPLORATION — tag qatlam: 4x2 = 8 kub (step). Yuzaga ko'prik. ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Первый слой', uz: "Birinchi qatlam" },
    lead: {
      ru: 'Заполним дно кубиками. Нажимай и смотри.',
      uz: "Asosni kubchalar bilan to'ldiramiz. Bosing va kuzating."
    },
    caps: {
      ru: [
        'Пустая коробка. Дно — 4 на 2.',
        'Кладём кубики ряд за рядом.',
        'Один слой — это 4 умножить на 2, ровно 8 кубиков.'
      ],
      uz: [
        "Bo'sh quti. Asosi — 4 ga 2.",
        "Kubchalarni qator-qator qo'yamiz.",
        "Bir qatlam — 4 ni 2 ga ko'paytirib, 8 ta kubcha."
      ]
    },
    note: {
      ru: 'Один слой — это как площадь дна: 8 кубиков.',
      uz: "Bir qatlam — asosning yuzi kabi: 8 ta kubcha."
    },
    btn_step: { ru: 'Дальше', uz: 'Keyingi' },
    audio: {
      intro: {
        ru: 'Положим кубики на дно коробки. Дно четыре на два. Нажимай на кнопку и смотри, как заполняется слой.',
        uz: "Quti asosiga kubchalar qo'yamiz. Asosi to'rtga ikki. Tugmani bosing va qatlam qanday to'lishini kuzating."
      },
      done: {
        ru: 'Видишь? Один слой, это четыре умножить на два, восемь кубиков. Это как площадь дна.',
        uz: "Ko'rib turibsizmi? Bir qatlam, bu to'rtni ikkiga ko'paytirib, sakkizta kubcha. Bu asosning yuzi kabi."
      }
    }
  },

  // ---- s3 EXPLORATION — jonli slayder: qatlamlarni ustma-ust, balandlik 1..3; V = 8 x qatlam. ----
  s3: {
    eyebrow: { ru: 'Эксперимент', uz: 'Tajriba' },
    title: { ru: 'Слои друг на друга', uz: "Qatlamlar ustma-ust" },
    lead: {
      ru: 'Каждый слой — 8 кубиков. Двигай ползунок «высота» и смотри, как растёт число кубиков.',
      uz: "Har qatlam — 8 kubcha. «Balandlik» slayderini suring va kubchalar soni o'sishini kuzating."
    },
    slider_label: { ru: 'Высота (число слоёв)', uz: "Balandlik (qatlamlar soni)" },
    note_target: {
      ru: 'Высота 3: три слоя по 8 — это 8 умножить на 3, всего 24 кубика.',
      uz: "Balandlik 3: uch qatlam, har biri 8 — bu 8 ni 3 ga ko'paytirib, 24 ta kubcha."
    },
    hint_move: {
      ru: 'Сколько слоёв — столько раз берём по 8 кубиков.',
      uz: "Necha qatlam bo'lsa — 8 kubchani shuncha marta olamiz."
    },
    audio: {
      ru: 'Двигай ползунок и меняй высоту. Каждый слой, это восемь кубиков. Сколько слоёв, столько раз по восемь. При высоте три получается двадцать четыре кубика.',
      uz: "Slayderni surib, balandlikni o'zgartiring. Har qatlam, bu sakkizta kubcha. Necha qatlam bo'lsa, shuncha marta sakkizta. Balandlik uch bo'lganda yigirma to'rt kubcha bo'ladi."
    }
  },

  // ---- s4 EXPLORATION — birlik kub = 1 sm³; sm² (yuza) va sm³ (hajm) farqi (M3). ----
  s4: {
    eyebrow: { ru: 'Единицы', uz: 'Birliklar' },
    title: { ru: 'См, см² и см³', uz: "Sm, sm² va sm³" },
    lead: {
      ru: 'Один кубик с ребром 1 см — это 1 см³. Почему «кубический»?',
      uz: "Qirrasi 1 sm kubcha — bu 1 sm³. Nega «kub»?"
    },
    point1: {
      ru: 'Длина — одно измерение, см.',
      uz: "Uzunlik — bitta o'lcham, sm."
    },
    point2: {
      ru: 'Площадь — два измерения, см².',
      uz: "Yuza — ikki o'lcham, sm²."
    },
    point3: {
      ru: 'Объём — три измерения, см³.',
      uz: "Hajm — uch o'lcham, sm³."
    },
    audio: {
      ru: 'Один кубик с ребром один сантиметр, это единица объёма. Длина измеряется в сантиметрах, площадь в квадратных сантиметрах, а объём в кубических. Куб, потому что измерений целых три.',
      uz: "Qirrasi bir santimetr bo'lgan bitta kubcha, bu hajm birligi. Uzunlik santimetrda, yuza kvadrat santimetrda, hajm esa kub santimetrda o'lchanadi. Kub, chunki o'lchovlar uchta."
    }
  },

  // ---- s5 RULE 1 — V = a x b x c (bo'yi x eni x balandligi) = asosning yuzi x balandlik. ----
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Правило объёма', uz: "Hajm qoidasi" },
    lead: { ru: 'Запишем правило, которое ты открыл.', uz: "Siz kashf etgan qoidani yozamiz." },
    rule_main: {
      ru: 'Объём = длина × ширина × высота',
      uz: "Hajm = bo'yi × eni × balandligi"
    },
    ex_easy: {
      ru: 'Слой 4 × 2 = 8, и высота 3: 8 × 3 = 24.',
      uz: "Qatlam 4 × 2 = 8, balandlik 3: 8 × 3 = 24."
    },
    note: {
      ru: 'Сначала слой (длина × ширина), потом × число слоёв.',
      uz: "Avval qatlam (bo'yi × eni), keyin × qatlamlar soni."
    },
    audio: {
      ru: 'Запомним правило. Объём равен длину умножить на ширину и на высоту. Это площадь дна, умноженная на высоту. Сначала слой, потом число слоёв.',
      uz: "Qoidani eslab qolamiz. Hajm bo'yini eniga va balandlikka ko'paytirishga teng. Bu asosning yuzi, balandlikka ko'paytirilgan. Avval qatlam, keyin qatlamlar soni."
    }
  },

  // ---- s6 RULE 2 — tuzoq-ogohlantirish: 2 son -> yuza (sm²); 3 son -> hajm (sm³). (M1, M3) ----
  s6: {
    eyebrow: { ru: 'Внимание', uz: 'Diqqat' },
    title: { ru: 'Площадь или объём?', uz: "Yuza yoki hajm?" },
    lead: { ru: 'Не путай площадь и объём.', uz: "Yuza va hajmni chalkashtirmang." },
    point1: {
      ru: 'Два числа — это площадь, см². Только один слой.',
      uz: "Ikki son — bu yuza, sm². Faqat bitta qatlam."
    },
    point2: {
      ru: 'Три измерения — это объём, см³.',
      uz: "Uch o'lcham — bu hajm, sm³."
    },
    point3: {
      ru: 'Забыл высоту — получил площадь дна, а не объём.',
      uz: "Balandlik unutilsa — hajm emas, asosning yuzi chiqadi."
    },
    audio: {
      ru: 'Будь внимателен. Если умножить только два числа, получится площадь, в квадратных сантиметрах, это лишь один слой. Для объёма нужны все три измерения, и ответ в кубических сантиметрах.',
      uz: "E'tiborli bo'ling. Faqat ikki son ko'paytirilsa, yuza chiqadi, kvadrat santimetrda, bu atigi bitta qatlam. Hajm uchun uchala o'lchov kerak, javob esa kub santimetrda."
    }
  },

  // ---- s7 TEST drag-and-drop classify (sm / sm² / sm³ savatlariga sudrash) + Fakt Matematika (1 litr). M3. ----
  s7: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Перетащи в нужную корзину', uz: "Mos savatga sudrang" },
    lead: {
      ru: 'Перетащи каждую карточку в корзину с правильной единицей.',
      uz: "Har bir kartani to'g'ri birlikli savatga sudrang."
    },
    bin_len: { ru: 'Длина · см', uz: 'Uzunlik · sm' },
    bin_area: { ru: 'Площадь · см²', uz: 'Yuza · sm²' },
    bin_vol: { ru: 'Объём · см³', uz: 'Hajm · sm³' },
    it0: { ru: 'Сторона коробки', uz: "Quti tomoni" },
    it1: { ru: 'Площадь дна', uz: "Asosning yuzi" },
    it2: { ru: 'Кубики внутри', uz: "Ichidagi kubchalar" },
    tray_label: { ru: 'Карточки', uz: 'Kartalar' },
    hint_wrong: {
      ru: 'Считай измерения. Длина это одно измерение, площадь два, объём три.',
      uz: "O'lchovlarni sanang. Uzunlik bitta o'lcham, yuza ikkita, hajm uchta."
    },
    correct_text: {
      ru: 'Верно! Сторона — длина (см), дно — площадь (см²), кубики внутри — объём (см³).',
      uz: "To'g'ri! Tomon — uzunlik (sm), asos — yuza (sm²), ichidagi kubchalar — hajm (sm³)."
    },
    fact: {
      ru: 'Кубик с ребром 10 см — это ровно 1 литр: 10 × 10 × 10 = 1000 см³. Вот откуда литр.',
      uz: "Qirrasi 10 sm kubcha — bu aynan 1 litr: 10 × 10 × 10 = 1000 sm³. Litr mana shu yerdan."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: {
        ru: 'Перетащи каждую карточку в корзину с правильной единицей. Длина, площадь или объём? Потом нажми проверить.',
        uz: "Har bir kartani to'g'ri birlikli savatga sudrang. Uzunlik, yuza yoki hajm? Keyin tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. Кубик с ребром десять сантиметров, это ровно один литр, десять на десять на десять, тысяча кубических сантиметров.',
        uz: "To'g'ri. Qirrasi o'n santimetr bo'lgan kubcha, bu aynan bir litr, o'nni o'nga, yana o'nga, ming kub santimetr."
      },
      on_wrong: { ru: 'Не совсем. Посчитай измерения. Длина одно, площадь два, объём три.', uz: "Unchalik emas. O'lchovlarni sanang. Uzunlik bitta, yuza ikkita, hajm uchta." }
    }
  },

  // ---- s8 TEST NumInput — quti 5x2x3 -> V = 30. ----
  s8: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Найди объём', uz: "Hajmni toping" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    done_label: { ru: 'Вопрос', uz: 'Savol' },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: {
      ru: 'Отлично! Ты находишь объём по всем трём числам.',
      uz: "Ajoyib! Hajmni uchala son bo'yicha topyapsiz."
    },
    questions: [
      { q: { ru: 'Коробка 5 × 2 × 3. Объём?', uz: "Quti 5 × 2 × 3. Hajmi?" }, value: 30, cols: 5, rows: 2, layers: 3,
        hint: { ru: 'Найди слой, потом умножь на высоту. Нужны все три числа.', uz: "Qatlamni toping, keyin balandlikka ko'paytiring. Uchala son kerak." },
        audio: { ru: 'Найди объём коробки. Коробка пять на два на три. Чему равен объём?', uz: "Quti hajmini toping. Quti beshga ikkiga uch. Hajmi qancha?" } },
      { q: { ru: 'Коробка 4 × 2 × 2. Объём?', uz: "Quti 4 × 2 × 2. Hajmi?" }, value: 16, cols: 4, rows: 2, layers: 2,
        hint: { ru: 'Слой 4 на 2, потом на высоту 2.', uz: "Qatlam 4 ga 2, keyin balandlik 2 ga." },
        audio: { ru: 'Коробка четыре на два на два. Чему равен объём?', uz: "Quti to'rtga ikkiga ikki. Hajmi qancha?" } },
      { q: { ru: 'Коробка 3 × 3 × 2. Объём?', uz: "Quti 3 × 3 × 2. Hajmi?" }, value: 18, cols: 3, rows: 3, layers: 2,
        hint: { ru: 'Перемножь все три измерения.', uz: "Uchala o'lchovni ko'paytiring." },
        audio: { ru: 'Коробка три на три на два. Чему равен объём?', uz: "Quti uchga uchga ikki. Hajmi qancha?" } }
    ],
    audio: {
      next: { ru: 'Верно! Следующая.', uz: "To'g'ri! Keyingisi." },
      on_correct: { ru: 'Отлично, все три верно!', uz: "Ajoyib, uchalasi ham to'g'ri!" },
      on_wrong: { ru: 'Посмотри подсказку.', uz: "Maslahatga qarang." }
    }
  },

  // ---- s9 TEST find-the-wrong — biri yuzani hajm deb hisoblagan (M1). correct C + Fakt IT (voksel). ----
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    title: { ru: 'Где забыли высоту?', uz: "Balandlik qayerda unutilgan?" },
    q_pre: { ru: 'Три объёма верны, а один —', uz: "Uchta hajm to'g'ri, bittasi esa —" },
    q_em: { ru: 'ОШИБОЧНО', uz: 'XATO' },
    q_post: { ru: '. Найди его.', uz: '. Uni toping.' },
    opt0: { ru: '4 × 3 × 2 → 24', uz: "4 × 3 × 2 → 24" },
    opt1: { ru: '5 × 2 × 2 → 20', uz: "5 × 2 × 2 → 20" },
    opt2: { ru: '6 × 2 × 3 → 12', uz: "6 × 2 × 3 → 12" },
    opt3: { ru: '2 × 2 × 5 → 20', uz: "2 × 2 × 5 → 20" },
    correct_text: {
      ru: 'Верно! Здесь умножили только два числа, 6 × 2 — это площадь дна. А высоту 3 забыли.',
      uz: "To'g'ri! Bu yerda faqat ikki son ko'paytirilgan, 6 × 2 — bu asosning yuzi. Balandlik 3 esa unutilgan."
    },
    wrong_0: {
      ru: 'Здесь перемножены все три измерения, это верно. Ищи дальше.',
      uz: "Bu yerda uchala o'lchov ko'paytirilgan, to'g'ri. Davom etib qidiring."
    },
    wrong_1: {
      ru: 'Здесь все три числа на месте, это верно. Ошибка в другом.',
      uz: "Bu yerda uchala son joyida, to'g'ri. Xato boshqasida."
    },
    wrong_3: {
      ru: 'Здесь тоже три измерения, это верно. Ищи, где их только два.',
      uz: "Bu yerda ham uch o'lcham bor, to'g'ri. Faqat ikkitasi bo'lganini qidiring."
    },
    wrong_default: { ru: 'Ищи решение, где умножили только два числа.', uz: "Faqat ikki son ko'paytirilgan yechimni qidiring." },
    fact: {
      ru: 'В 3D-играх мир собран из «вокселей» — кубиков. Объём фигуры там — это число кубиков.',
      uz: "3D o'yinlarda dunyo «voksel» — kubchalardan yig'iladi. Shakl hajmi — kubchalar soni."
    },
    audio: {
      intro: {
        ru: 'Здесь четыре решения. Три верные, а одно ошибочно. Найди то, где умножили только два числа.',
        uz: "Bu yerda to'rtta yechim bor. Uchtasi to'g'ri, bittasi xato. Faqat ikki son ko'paytirilgan yechimni toping."
      },
      on_correct: {
        ru: 'Верно. Там забыли высоту. В трёхмерных играх мир собран из вокселей, кубиков, и объём, это просто число кубиков.',
        uz: "To'g'ri. U yerda balandlik unutilgan. Uch o'lchamli o'yinlarda dunyo voksellardan, kubchalardan yig'iladi, hajm esa, bu shunchaki kubchalar soni."
      },
      on_wrong: { ru: 'Не там. Ищи, где умножили только два числа.', uz: "U emas. Faqat ikki son ko'paytirilgan yechimni qidiring." }
    }
  },

  // ---- s10 TEST multi-blank — quti 4x3 tag, 2 qatlam: tag=12, qatlam=2, hajm=24. ----
  s10: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Считаем по шагам', uz: "Qadamlab hisoblaymiz" },
    lead: {
      ru: 'Коробка: дно 4 на 3, высота 2. Заполни шаги.',
      uz: "Quti: asosi 4 ga 3, balandlik 2. Qadamlarni to'ldiring."
    },
    lbl_layer: { ru: 'Слой: 4 × 3 =', uz: "Qatlam: 4 × 3 =" },
    lbl_count: { ru: 'Число слоёв =', uz: "Qatlamlar soni =" },
    lbl_vol: { ru: 'Объём =', uz: "Hajm =" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Сначала найди слой, 4 на 3. Потом умножь слой на число слоёв.',
      uz: "Avval qatlamni toping, 4 ga 3. Keyin qatlamni qatlamlar soniga ko'paytiring."
    },
    fb_correct: {
      ru: 'Верно! Слой 12, слоёв 2, объём 12 × 2 = 24.',
      uz: "To'g'ri! Qatlam 12, qatlamlar 2 ta, hajm 12 × 2 = 24."
    },
    audio: {
      intro: {
        ru: 'Заполни шаги. Сначала слой, дно четыре на три. Потом число слоёв. Потом объём. Нажми проверить.',
        uz: "Qadamlarni to'ldiring. Avval qatlam, asosi to'rtga uch. Keyin qatlamlar soni. Keyin hajm. Tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Слой двенадцать, объём двадцать четыре.', uz: "To'g'ri. Qatlam o'n ikki, hajm yigirma to'rt." },
      on_wrong: { ru: 'Не совсем. Сначала найди слой, потом умножь на число слоёв.', uz: "Unchalik emas. Avval qatlamni toping, keyin qatlamlar soniga ko'paytiring." }
    }
  },

  // ---- s11 TEST MC — kub 2x2x2 -> 8. correct A. ----
  s11: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Объём куба', uz: "Kub hajmi" },
    lead: {
      ru: 'У этого кубика длина 2, ширина 2 и высота 2. Чему равен объём?',
      uz: "Bu kubchaning bo'yi 2, eni 2 va balandligi 2. Hajmi qancha?"
    },
    opt0: { ru: '8 см³', uz: "8 sm³" },
    opt1: { ru: '6 см³', uz: "6 sm³" },
    opt2: { ru: '4 см³', uz: "4 sm³" },
    opt3: { ru: '12 см³', uz: "12 sm³" },
    correct_text: {
      ru: 'Верно! 2 × 2 × 2 — это 8 кубиков, 8 см³.',
      uz: "To'g'ri! 2 × 2 × 2 — bu 8 ta kubcha, 8 sm³."
    },
    wrong_1: {
      ru: 'Это сумма. Объём находят умножением, а не сложением.',
      uz: "Bu yig'indi. Hajm ko'paytirish bilan topiladi, qo'shish bilan emas."
    },
    wrong_2: {
      ru: 'Это только дно, два числа. Умножь ещё на высоту.',
      uz: "Bu faqat asos, ikki son. Yana balandlikka ko'paytiring."
    },
    wrong_3: {
      ru: 'Это слишком много. Перемножь три ребра по одному разу.',
      uz: "Bu juda ko'p. Uchala qirrani bir martadan ko'paytiring."
    },
    wrong_default: { ru: 'Объём куба — перемножь три ребра.', uz: "Kub hajmi — uchala qirrani ko'paytiring." },
    audio: {
      intro: {
        ru: 'У коробки длина два, ширина два и высота два. Чему равен объём? Выбери ответ.',
        uz: "Quti bo'yi ikki, eni ikki va balandligi ikki. Hajmi qancha? Javobni tanlang."
      },
      on_correct: { ru: 'Верно. Восемь кубических сантиметров.', uz: "To'g'ri. Sakkiz kub santimetr." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // ---- s12 CASE setup — Shahnoza sovg'a qutisi (5x3x4). ----
  s12: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Коробка Шахнозы', uz: "Shahnozaning qutisi" },
    lead: {
      ru: 'Шахноза наполняет коробку кубиками-конфетами. Длина 5, ширина 3, высота 4. Сколько поместится?',
      uz: "Shahnoza qutini kubcha-konfetlar bilan to'ldirmoqda. Bo'yi 5, eni 3, balandligi 4. Nechta sig'adi?"
    },
    note: {
      ru: 'Объём = длина × ширина × высота.',
      uz: "Hajm = bo'yi × eni × balandligi."
    },
    hint_calc: {
      ru: 'Сначала слой 5 × 3, потом умножь на высоту.',
      uz: "Avval qatlam 5 × 3, keyin balandlikka ko'paytiring."
    },
    btn_help: { ru: 'Посчитать', uz: 'Hisoblash' },
    audio: {
      ru: 'Шахноза наполняет подарочную коробку кубиками-конфетами. Длина пять, ширина три, высота четыре. Сколько конфет поместится? Посчитаем объём.',
      uz: "Shahnoza sovg'a qutisini kubcha-konfetlar bilan to'ldirmoqda. Bo'yi besh, eni uch, balandligi to'rt. Nechta konfet sig'adi? Hajmni hisoblaymiz."
    }
  },

  // ---- s13 CASE/FINAL MC — quti 5x3x4 -> 60. correct D + Fakt Matematika (Rubik). ----
  s13: {
    eyebrow: { ru: 'Итоговое задание', uz: 'Yakuniy topshiriq' },
    title: { ru: 'Сколько конфет?', uz: "Nechta konfet?" },
    lead: {
      ru: 'Коробка Шахнозы: длина 5, ширина 3, высота 4. Сколько кубиков-конфет поместится?',
      uz: "Shahnozaning qutisi: bo'yi 5, eni 3, balandligi 4. Nechta kubcha-konfet sig'adi?"
    },
    opt0: { ru: '60', uz: "60" },
    opt1: { ru: '12', uz: "12" },
    opt2: { ru: '15', uz: "15" },
    opt3: { ru: '120', uz: "120" },
    correct_text: {
      ru: 'Верно! Слой 5 × 3 = 15, и высота 4: 15 × 4 = 60 конфет.',
      uz: "To'g'ri! Qatlam 5 × 3 = 15, balandlik 4: 15 × 4 = 60 ta konfet."
    },
    wrong_1: {
      ru: 'Это сумма. Объём находят умножением, не сложением.',
      uz: "Bu yig'indi. Hajm ko'paytirish bilan topiladi, qo'shish bilan emas."
    },
    wrong_2: {
      ru: 'Это только площадь дна. Умножь её ещё на высоту.',
      uz: "Bu faqat asosning yuzi. Uni yana balandlikka ko'paytiring."
    },
    wrong_3: {
      ru: 'Слишком много. Перемножь три измерения по одному разу.',
      uz: "Juda ko'p. Uchala o'lchovni bir martadan ko'paytiring."
    },
    wrong_default: { ru: 'Объём — перемножь все три измерения.', uz: "Hajm — uchala o'lchovni ko'paytiring." },
    fact: {
      ru: 'Кубик Рубика — это 3 × 3 × 3 = 27 маленьких кубиков. Три слоя по девять.',
      uz: "Rubik kubi — bu 3 × 3 × 3 = 27 ta kichik kub. Uch qatlam, har biri to'qqizta."
    },
    audio: {
      intro: {
        ru: 'Посчитай объём коробки Шахнозы. Длина пять, ширина три, высота четыре. Не забудь все три числа.',
        uz: "Shahnoza qutisining hajmini hisoblang. Bo'yi besh, eni uch, balandligi to'rt. Uchala sonni unutmang."
      },
      on_correct: {
        ru: 'Верно. Шестьдесят. Кубик Рубика, это три на три на три, двадцать семь маленьких кубиков. Три слоя по девять.',
        uz: "To'g'ri. Oltmish. Rubik kubi, bu uchga uchga uch, yigirma yetti kichik kub. Uch qatlam, har biri to'qqizta."
      },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // ---- s14 SUMMARY — hookni yopadi + ConnectionsBlock ----
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    title: { ru: 'Отлично! Ты умеешь находить объём.', uz: "Ajoyib! Hajmni topa olasiz." },
    score_label: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    main_label: { ru: 'Что узнали', uz: "Nimani bildik" },
    main_1: { ru: 'Объём — число кубиков внутри.', uz: "Hajm — ichidagi kubchalar soni." },
    main_2: { ru: 'Объём = длина × ширина × высота.', uz: "Hajm = bo'yi × eni × balandligi." },
    main_3: { ru: 'Два числа — площадь, три — объём.', uz: "Ikki son — yuza, uchta — hajm." },
    hook_close: {
      ru: 'Рустаму двух чисел не хватило — нужна была высота.',
      uz: "Rustamga ikki son yetmadi — balandlik kerak edi."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: 'Площадь прямоугольника (один слой — это площадь дна).',
      uz: "To'rtburchak yuzasi (bir qatlam — bu asosning yuzi)."
    },
    conn_label_next: { ru: 'Следующий урок', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'Отрицательные числа на координатной прямой.',
      uz: "Koordinata to'g'ri chizig'ida manfiy sonlar."
    },
    btn_restart: { ru: 'Пройти заново', uz: 'Qaytadan' },
    audio: {
      ru: 'Отлично. Теперь ты знаешь: объём, это число кубиков внутри. Длина умножить на ширину и на высоту. Два числа дают площадь, а три, объём. Молодец!',
      uz: "Ajoyib. Endi bilasiz: hajm, bu ichidagi kubchalar soni. Bo'yini eniga va balandlikka ko'paytiramiz. Ikki son yuza beradi, uchta esa, hajm. Barakalla!"
    }
  }

};

// ============================================================
// YORDAMCHI KOMPONENTLAR (infra_v2 — Dars30 bilan bir xil)
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

// Qisqa sarlavha — har slayd tepasida (kam so'z, metodist 2026-06-17).
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Dekorativ suzuvchi mini-kubchalar (mavzuga oid: hajm = kubchalar; sekin — bo'sh joyni boyitadi).
const FloatCubes = () => (
  <div className="fcz" aria-hidden="true">
    <span className="fcz-c fcz-1"/>
    <span className="fcz-c fcz-2"/>
    <span className="fcz-c fcz-3"/>
    <span className="fcz-c fcz-4"/>
    <span className="fcz-c fcz-5"/>
    <span className="fcz-c fcz-6"/>
  </div>
);

// s4 (slayd 5) — o'lcham qurish animatsiyasi: 1 o'lcham (chiziq) -> 2 (kvadrat, sm²) -> 3 (kub, sm³). Loop.
const DimBuild = () => (
  <div className="db-host" aria-hidden="true">
    <svg viewBox="0 0 112 96" className="db-svg">
      <rect x="22" y="34" width="54" height="54" className="db-sq"/>
      <polygon points="22,34 40,16 94,16 76,34" className="db-top"/>
      <polygon points="76,34 94,16 94,70 76,88" className="db-side"/>
      <line x1="22" y1="88" x2="76" y2="88" className="db-line"/>
    </svg>
  </div>
);

// Yengil "плавно" mukofot animatsiyasi — to'g'ri javobdan keyin pastdan ko'tariladigan kubchalar.
const RiseCubes = () => (
  <div className="rc-host" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="rc-c" style={{ animationDelay: `${i * 0.32}s` }}/>
    ))}
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ri javobdan keyin, ALOHIDA karta).
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',         uz: "Bilasizmi? · IT" };
const FB_MATH = { ru: 'Знаешь ли ты? · Математика', uz: "Bilasizmi? · Matematika" };

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

// Fakt-animatsiyalar (CSS-only loop, ko'k tema, YUMSHOQ — keskin emas).
// 1 litr = 10x10x10: kubcha suv bilan yumshoq to'ladi (Matematika).
const AnimLitre = () => (
  <svg className="fa-lt" viewBox="0 0 90 64" aria-hidden="true">
    <polygon points="20,18 70,18 70,54 20,54" className="fa-lt-front"/>
    <polygon points="20,18 32,8 82,8 70,18" className="fa-lt-top"/>
    <polygon points="70,18 82,8 82,44 70,54" className="fa-lt-side"/>
    <rect x="20" y="18" width="50" height="36" className="fa-lt-water"/>
  </svg>
);
// Voksel — 3D o'yin kubchalari yumshoq to'lqinli yorishadi (IT).
const AnimVoxel = () => (
  <div className="fa-vx" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <span key={i} className="fa-vx-c" style={{ animationDelay: `${((i % 3) + Math.floor(i / 3)) * 0.22}s` }}/>
    ))}
  </div>
);
// Rubik kubi 3x3 old yuz — qator-qator yumshoq yorishadi (Matematika).
const AnimRubik = () => (
  <div className="fa-rb" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <span key={i} className="fa-rb-c" style={{ animationDelay: `${Math.floor(i / 3) * 0.45}s` }}/>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATOR — LayerBox (izometrik 3D quti, qatlam-qatlam to'ladi), SVG
// ============================================================
// cols=a (bo'yi), rows=b (eni), layers=c (balandlik). filled = to'ldirilgan qatlamlar (0..layers).
// O'lcham yorliqlari OQ fon-tab ustida — aniq o'qiladi (metodist 2026-06-17).
const lbP = (X, Y, Z, ox, oy, w, th, ch) => [ox + (X - Y) * w, oy + (X + Y) * th - Z * ch];
const LayerBox = ({ cols, rows, layers, filled = layers, cell = 24, alive = true, success = false, stagger = false, aLabel, bLabel, hLabel }) => {
  const w = cell, th = cell * 0.5, ch = cell * 0.9;
  const padX = w + 18, padTop = 14, padBot = 26;
  const ox = padX + rows * w;
  const oy = padTop + (layers - 1) * ch + th;
  const svgW = (cols + rows) * w + padX * 2;
  const svgH = padTop + (layers - 1) * ch + (cols + rows) * th + ch + padBot;

  const top = (X, Y) => lbP(X, Y, layers - 1, ox, oy, w, th, ch);
  const bot = (X, Y) => { const p = lbP(X, Y, 0, ox, oy, w, th, ch); return [p[0], p[1] + ch]; };
  const corners = [[0, 0], [cols, 0], [cols, rows], [0, rows]];
  const topPts = corners.map(([X, Y]) => top(X, Y));
  const botPts = corners.map(([X, Y]) => bot(X, Y));
  const poly = (pts) => pts.map(p => p.join(',')).join(' ');

  const cubes = [];
  for (let L = 0; L < filled; L++) {
    for (let gx = 0; gx < cols; gx++) {
      for (let gy = 0; gy < rows; gy++) {
        cubes.push({ gx, gy, L, key: (gx + gy) * 100 + L });
      }
    }
  }
  cubes.sort((a, b) => a.key - b.key);
  const cubeEls = cubes.map((cu, idx) => {
    const { gx, gy, L } = cu;
    const tA = lbP(gx, gy, L, ox, oy, w, th, ch);
    const tB = lbP(gx + 1, gy, L, ox, oy, w, th, ch);
    const tC = lbP(gx + 1, gy + 1, L, ox, oy, w, th, ch);
    const tD = lbP(gx, gy + 1, L, ox, oy, w, th, ch);
    const down = (p) => [p[0], p[1] + ch];
    const topFace = poly([tA, tB, tC, tD]);
    const rightFace = poly([tB, tC, down(tC), down(tB)]);
    const leftFace = poly([tD, tC, down(tC), down(tD)]);
    const st = stagger ? { animationDelay: `${idx * 0.03}s` } : undefined;
    const clsBase = stagger ? 'lb-cube lb-pop' : 'lb-cube';
    return (
      <g key={`${gx}-${gy}-${L}`} className={clsBase} style={st}>
        <polygon points={leftFace} className="lb-left"/>
        <polygon points={rightFace} className="lb-right"/>
        <polygon points={topFace} className="lb-top"/>
      </g>
    );
  });

  // O'lcham yorliqlari — OQ fon-tab + qalin matn (aniq ko'rinadi)
  const labels = [];
  const lblTag = (key, cx, cy, txt) => {
    const s = String(txt);
    const wpx = 13 + s.length * 9;
    labels.push(
      <g key={key}>
        <rect x={cx - wpx / 2} y={cy - 12} width={wpx} height={22} rx={6} className="lb-lbl-bg"/>
        <text x={cx} y={cy + 4} className="lb-lbl" textAnchor="middle">{s}</text>
      </g>
    );
  };
  if (aLabel !== undefined) {
    const m = [(botPts[3][0] + botPts[2][0]) / 2, (botPts[3][1] + botPts[2][1]) / 2];
    lblTag('al', m[0], m[1] + 18, aLabel);
  }
  if (bLabel !== undefined) {
    const m = [(botPts[2][0] + botPts[1][0]) / 2, (botPts[2][1] + botPts[1][1]) / 2];
    lblTag('bl', m[0] + 20, m[1] + 12, bLabel);
  }
  if (hLabel !== undefined) {
    const m = [(topPts[2][0] + botPts[2][0]) / 2, (topPts[2][1] + botPts[2][1]) / 2];
    lblTag('hl', m[0] + 20, m[1], hLabel);
  }

  const cls = `lb${alive ? ' lb-alive' : ''}${success ? ' lb-ok' : ''}`;
  return (
    <svg className={cls} viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <polygon points={poly(topPts)} className="lb-wire"/>
      {corners.map(([X, Y], i) => {
        const a = top(X, Y), b = bot(X, Y);
        return <line key={`v${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="lb-wire"/>;
      })}
      <line x1={botPts[1][0]} y1={botPts[1][1]} x2={botPts[2][0]} y2={botPts[2][1]} className="lb-wire"/>
      <line x1={botPts[2][0]} y1={botPts[2][1]} x2={botPts[3][0]} y2={botPts[3][1]} className="lb-wire"/>
      {cubeEls}
      {labels}
    </svg>
  );
};

// HOOK animatsiyasi — 2D yuza 3D qutiga "o'sadi" (chuqurlik yumshoq nafas oladi, KESKIN EMAS).
const HookGrow = () => (
  <div className="hg-host" aria-hidden="true">
    <svg viewBox="0 0 200 150" className="hg-svg">
      <rect x="34" y="58" width="96" height="72" className="hg-front"/>
      <line x1="58" y1="58" x2="58" y2="130" className="hg-fg"/>
      <line x1="82" y1="58" x2="82" y2="130" className="hg-fg"/>
      <line x1="106" y1="58" x2="106" y2="130" className="hg-fg"/>
      <line x1="34" y1="82" x2="130" y2="82" className="hg-fg"/>
      <line x1="34" y1="106" x2="130" y2="106" className="hg-fg"/>
      <polygon points="34,58 58,34 154,34 130,58" className="hg-top"/>
      <polygon points="130,58 154,34 154,106 130,130" className="hg-side"/>
    </svg>
  </div>
);

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (Rustam quti). Qaytish: picked TO'LIQ sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', padding: 'clamp(12px, 2.4vw, 20px)', display: 'flex', justifyContent: 'center' }}>
          <HookGrow/>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2, textAlign: 'center' }}>{mt(t(c.reveal))}</p>}
      </div>
    </Stage>
  );
};

// s1 — WARM-UP: 3 ta ketma-ket MC; javoblangan savol tepada ✓ qatori bo'lib yig'iladi (scrollsiz).
const Screen1 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1; const sfx = useSfx();
  const QS = c.questions;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: 's1_q0', text: wasSolved ? '' : QS[0].audio[lang], trigger: 'on_mount', waits_for: null }]);
  const [qi, setQi] = useState(wasSolved ? QS.length : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const perfectRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? true) : true);
  const recordedRef = useRef(wasSolved);
  const done = qi >= QS.length;
  const cur = done ? null : QS[qi];
  const finish = () => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    onAnswer({ stage: SCREEN_META[1].scope, screenIdx: 1, question: QS[0].q[lang], correct: perfectRef.current, firstTry: perfectRef.current, attempts: 1, solved: true });
  };
  const pick = (i) => {
    if (done || wrong.has(i)) return;
    if (i === cur.correct) {
      sfx.playCorrect();
      const isLast = qi + 1 >= QS.length;
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isLast ? c.audio.on_correct[lang] : `${c.audio.next[lang]} ${QS[qi + 1].audio[lang]}`); }, 250);
      if (isLast) finish();
      setWrong(new Set());
      setQi(qi + 1);
    } else {
      perfectRef.current = false;
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(cur.hint[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 12px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        {QS.slice(0, qi).map((_, idx) => (
          <div key={idx} className="mq-done fade-up">
            <span className="mq-done-ic"><IconOk/></span>
            <span>{t(c.done_label)} {idx + 1} — {t(c.done_ok)}</span>
          </div>
        ))}
        {!done && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 13px)' }}>
            <h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.q))}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {cur.opts.map((o, i) => {
                const isWrong = wrong.has(i);
                return (
                  <button key={i} className={`option${isWrong ? ' option-picked-wrong' : ''}`} disabled={isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(11px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="mono small" style={{ minWidth: 20, color: isWrong ? T.accent : T.ink3 }}>{isWrong ? '✗' : String.fromCharCode(65 + i)}</span>
                    <span style={{ flex: 1 }}>{mt(t(o))}</span>
                  </button>
                );
              })}
            </div>
            {wrong.size > 0 && (
              <div className="frame-tip" style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
                <p className="body" style={{ margin: 0 }}>{mt(t(cur.hint))}</p>
              </div>
            )}
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "Hammasi to'g'ri" : 'Всё верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p>
            <div style={{ marginTop: 10 }}><RiseCubes/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION (tag qatlam to'ladi: 4x2 = 8 kub, step 0..2)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const MAX = 2;
  const [step, setStep] = useState(0);
  const doneAnnouncedRef = useRef(false);
  const caps = c.caps[lang] || c.caps.ru;
  const done = step >= MAX;
  const doStep = () => {
    if (done) return;
    const nv = step + 1;
    setStep(nv);
    if (nv >= MAX && !doneAnnouncedRef.current) {
      doneAnnouncedRef.current = true;
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.done[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <LayerBox cols={4} rows={2} layers={3} filled={step >= 1 ? 1 : 0} cell={28} stagger={step >= 1 && step < MAX} success={done} aLabel="4" bLabel="2"/>
          {done && (
            <div className="hr-calc">
              <span className="hr-calc-on">4</span><span className="hr-calc-op">×</span><span className="hr-calc-on">2</span>
              <span className="hr-calc-op">=</span><span className="hr-calc-res">8</span>
            </div>
          )}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={doStep} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[step])}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (jonli slayder: balandlik 1..3, V = 8 x qatlam). Sonlar OQ tab ustida (aniq).
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [h, setH] = useState(1);
  const layerCells = 8;
  const vol = layerCells * h;
  const isTarget = h === 3;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <LayerBox cols={4} rows={2} layers={3} filled={h} cell={26} success={isTarget} aLabel="4" bLabel="2" hLabel={String(h)}/>
          <div className="hr-calc">
            <span className="hr-calc-on">8</span><span className="hr-calc-op">×</span><span className="hr-calc-on">{h}</span>
            <span className="hr-calc-op">=</span><span className="hr-calc-res">{vol}</span>
            <span className="hr-calc-unit">{lang === 'uz' ? 'kubcha' : 'кубиков'}</span>
          </div>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative' }}>
          <p className="small mono" style={{ margin: '0 0 2px', textAlign: 'center', color: T.ink2 }}>{t(c.slider_label)}: <span style={{ color: T.accent, fontWeight: 700 }}>{h}</span></p>
          <Slider value={h} min={1} max={3} step={1} onChange={setH}/>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: isTarget ? T.success : T.ink2, fontWeight: isTarget ? 600 : 400 }}>{mt(t(isTarget ? c.note_target : c.hint_move))}</p>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (birlik kub = 1 sm³; sm/sm²/sm³ farqi; M3) + dekor
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  const dims = [
    { lbl: 'sm', node: c.point1, n: 1 },
    { lbl: 'sm²', node: c.point2, n: 2 },
    { lbl: 'sm³', node: c.point3, n: 3 }
  ];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(14px, 3vw, 26px)', flexWrap: 'wrap' }}>
          <DimBuild/>
          <div className="u3-list">
            {dims.map((d, i) => (
              <div key={i} className="u3-row">
                <span className={`u3-badge u3-b${d.n}`}>{d.lbl}</span>
                <p className="body" style={{ margin: 0 }}>{mt(t(d.node))}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE 1 (V = a x b x c) + dekor
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <LayerBox cols={4} rows={2} layers={3} filled={3} cell={24} aLabel="4" bLabel="2" hLabel="3"/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s6 — RULE 2 (2 son -> yuza; 3 son -> hajm; M1, M3) + dekor
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 3.5vw, 30px)', flexWrap: 'wrap' }}>
          <LayerBox cols={4} rows={2} layers={3} filled={1} cell={24} aLabel="4" bLabel="2"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
            <p className="body" style={{ margin: 0 }}><span className="u3-badge u3-b2" style={{ marginRight: 8 }}>sm²</span>{mt(t(c.point1))}</p>
            <p className="body" style={{ margin: 0 }}><span className="u3-badge u3-b3" style={{ marginRight: 8 }}>sm³</span>{mt(t(c.point2))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point3))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST DRAG-AND-DROP classify (chiplarni sm/sm²/sm³ savatlariga sudrash; M3) + Fakt (alohida karta)
const S7_BINS = ['len', 'area', 'vol'];
const S7_OK = ['len', 'area', 'vol']; // it0->len, it1->area, it2->vol
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7; const sfx = useSfx();
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const items = [c.it0, c.it1, c.it2];
  const binLabels = { len: c.bin_len, area: c.bin_area, vol: c.bin_vol };
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? S7_OK.slice() : [null, null, null])); // place[itemIdx] = bin yoki null
  const [sel, setSel] = useState(null);      // tanlangan chip (tap rejimi)
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const dropTo = (bin) => {
    if (solved || sel === null) return;
    setChecked(false);
    setPlace(p => { const n = [...p]; n[sel] = bin; return n; });
    setSel(null);
  };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const n = [...p]; n[i] = null; return n; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = S7_OK.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[7].scope, screenIdx: 7, question: c.lead[lang], correctAnswer: S7_OK.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      // noto'g'ri joylangan chiplar taginiga qaytadi (веди-до-верного)
      setPlace(p => p.map((v, i) => (v === S7_OK[i] ? v : null)));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const trayChips = items.map((it, i) => (place[i] === null ? i : null)).filter(i => i !== null);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        {/* savatlar */}
        <div className="dnd-bins fade-up delay-1" style={{ maxHeight: solved ? 0 : 900, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(9px, 1.7vw, 13px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {S7_BINS.map(bin => {
            const inBin = items.map((it, i) => (place[i] === bin ? i : null)).filter(i => i !== null);
            return (
              <div key={bin}
                className={`dnd-bin${sel !== null ? ' dnd-bin-armed' : ''}`}
                onClick={() => dropTo(bin)}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => { e.preventDefault(); dropTo(bin); }}>
                <span className="dnd-bin-lbl">{t(binLabels[bin])}</span>
                <div className="dnd-bin-slot">
                  {inBin.map(i => {
                    const right = solved && place[i] === S7_OK[i];
                    return (
                      <span key={i} className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`}
                        draggable={!solved} onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                        onClick={e => { e.stopPropagation(); returnChip(i); }}>
                        {mt(t(items[i]))}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* tray (joylanmagan chiplar) */}
        {!solved && (
          <div className="dnd-tray fade-up delay-2">
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`}
                draggable onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => onChipClick(i)}>
                {mt(t(items[i]))}
              </span>
            ))}
          </div>
        )}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            </FeedbackBlock>
            <FactCard text={c.fact} badge={FB_MATH} anim={<AnimLitre/>}/>
          </>
        )}
      </div>
    </Stage>
  );
};

// s8 — TEST: 3 ta ketma-ket NumInput; javoblangan tepada ✓ qatori (bitta ball; scrollsiz).
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const QS = c.questions;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const audio = useAudio([{ id: 's8_q0', text: wasSolved ? '' : QS[0].audio[lang], trigger: 'on_mount', waits_for: null }]);
  const [qi, setQi] = useState(wasSolved ? QS.length : 0);
  const [val, setVal] = useState('');
  const [hintShown, setHintShown] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const perfectRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? true) : true);
  const recordedRef = useRef(wasSolved);
  const done = qi >= QS.length;
  const cur = done ? null : QS[qi];
  const finish = () => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: QS[0].q[lang], correctAnswer: String(QS[0].value), correct: perfectRef.current, firstTry: perfectRef.current, attempts: 1, solved: true });
  };
  const submit = () => {
    if (done || justSolved) return;
    const v = parseFloat(String(val).trim().replace(',', '.')); if (isNaN(v)) return;
    if (Math.abs(v - cur.value) < 1e-9) {
      sfx.playCorrect();
      const isLast = qi + 1 >= QS.length;
      setJustSolved(true);  // figura kubchalar bilan to'ladi, keyin keyingi savol
      if (isLast) finish();
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isLast ? c.audio.on_correct[lang] : c.audio.next[lang]); }, 200);
      setTimeout(() => {
        setJustSolved(false); setVal(''); setHintShown(false); setQi(qi + 1);
        if (!isLast && !audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(QS[qi + 1].audio[lang]); }
      }, 1400);
    } else {
      perfectRef.current = false;
      setHintShown(true); sfx.playWrong();
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(cur.hint[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 12px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        {QS.slice(0, qi).map((_, idx) => (
          <div key={idx} className="mq-done fade-up">
            <span className="mq-done-ic"><IconOk/></span>
            <span>{t(c.done_label)} {idx + 1} — {t(c.done_ok)}</span>
          </div>
        ))}
        {!done && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
            <h2 className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(cur.q))}</h2>
            <LayerBox cols={cur.cols} rows={cur.rows} layers={cur.layers} filled={justSolved ? cur.layers : 0} stagger={justSolved} success={justSolved} cell={20} aLabel={String(cur.cols)} bLabel={String(cur.rows)} hLabel={String(cur.layers)}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input type="number" inputMode="numeric" className={`answer-input ${justSolved ? 'correct' : ''}`} value={val} placeholder={t(c.placeholder)} disabled={justSolved}
                onChange={e => { setVal(e.target.value); setHintShown(false); }}
                onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
              {!justSolved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
            </div>
            {hintShown && (
              <div className="frame-tip" style={{ alignSelf: 'stretch', display: 'flex', gap: 8 }}>
                <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
                <p className="body" style={{ margin: 0 }}>{mt(t(cur.hint))}</p>
              </div>
            )}
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "Hammasi to'g'ri" : 'Всё верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p>
            <div style={{ marginTop: 10 }}><RiseCubes/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s9 — TEST find-the-wrong (correct = opt2 "6x2x3 -> 12", shuffle -> C) + Fakt IT (voksel)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [1, 3, 2, 0]);
  const question = (<><Title node={c.title}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.q_pre)}{' '}<span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<><FactCard text={c.fact} badge={FB_IT} anim={<AnimVoxel/>}/><div style={{ marginTop: 10 }}><RiseCubes/></div></>}/>;
};

// s10 — TEST multi-blank (tag 4x3=12, qatlam=2, hajm=24)
const S10_OK = [12, 2, 24];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10; const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const labels = [c.lbl_layer, c.lbl_count, c.lbl_vol];
  const wasSolved = storedAnswer?.solved === true;
  const [vals, setVals] = useState(() => (wasSolved ? S10_OK.map(String) : ['', '', '']));
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const setVal = (i, v) => { if (solved) return; setChecked(false); setVals(p => { const n = [...p]; n[i] = v; return n; }); };
  const isFieldOk = (i) => { const v = parseFloat(String(vals[i]).trim().replace(',', '.')); return !isNaN(v) && Math.abs(v - S10_OK[i]) < 1e-9; };
  const check = () => {
    if (solved) return;
    if (vals.some(v => String(v).trim() === '')) return;
    const ok = S10_OK.every((_, i) => isFieldOk(i));
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[10].scope, screenIdx: 10, question: c.lead[lang], correctAnswer: S10_OK.join(','), studentAnswer: vals.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <LayerBox cols={4} rows={3} layers={2} filled={solved ? 2 : 0} stagger={solved} success={solved} cell={24} aLabel="4" bLabel="3" hLabel="2"/>
        </div>
        <div style={{ position: 'relative', maxHeight: solved ? 0 : 500, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(10px, 1.9vw, 14px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
          <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
          <div className="mbk-rows">
            {labels.map((lb, i) => (
              <div key={i} className="mbk-row">
                <span className="mbk-lbl">{mt(t(lb))}</span>
                <input type="number" inputMode="numeric" className={`answer-input mbk-box ${solved ? 'correct' : ''} ${checked && !solved && !isFieldOk(i) ? 'mbk-wrong' : ''}`} value={vals[i]} placeholder={t(c.placeholder)} disabled={solved}
                  onChange={e => setVal(i, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && check()}/>
              </div>
            ))}
          </div>
        </div>
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
            <div style={{ marginTop: 10 }}><RiseCubes/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s11 — TEST MC (kub 2x2x2 -> 8, correct A)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<><Title node={c.title}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.lead))}</h2></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <LayerBox cols={2} rows={2} layers={2} filled={solved ? 2 : 0} stagger={solved} success={solved} cell={32} aLabel="2" bLabel="2" hLabel="2"/>} factOnCorrect={<RiseCubes/>}/>;
};

// s12 — CASE setup (Shahnoza sovg'a qutisi 5x3x4)
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px) clamp(10px, 2vw, 16px)' }}>
          <LayerBox cols={5} rows={3} layers={4} filled={4} cell={20} aLabel="5" bLabel="3" hLabel="4"/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s13 — CASE/FINAL MC (quti 5x3x4 -> 60, correct D) + Fakt Matematika (Rubik)
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 1, 2, 0]);
  const question = (<><Title node={c.title}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.lead))}</h2></>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <LayerBox cols={5} rows={3} layers={4} filled={solved ? 4 : 0} stagger={solved} success={solved} cell={17} aLabel="5" bLabel="3" hLabel="4"/>} factOnCorrect={<FactCard text={c.fact} badge={FB_MATH} anim={<AnimRubik/>}/>}/>;
};

// s14 — SUMMARY: ball (to'g'ri javoblar soni, Dars1 kabi) + qisqa xulosa + bog'lanishlar + dekor
const Screen14 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers && answers[i] && answers[i].correct).length;
  const total = scoredIdx.length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatCubes/>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <p className="small fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.hook_close))}</p>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT
// ============================================================
export default function BoxVolumeLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
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
  height: 6px;
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

/* === SLIDER v15 === */
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

/* === INPUT v15 === */
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

/* === FRAMES v15 === */
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
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }
/* MATH: ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста. */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }


/* MATH geom_5_04: LayerBox — izometrik 3D quti, qatlam-qatlam to'ladi (SVG). */
.lb { display: block; }
.lb-wire { fill: none; stroke: #A7A6A2; stroke-width: 1.4; stroke-dasharray: 4 3; opacity: 0.7; }
.lb-top { fill: #FF4F28; fill-opacity: 0.9; stroke: #FFFFFF; stroke-width: 1.2; stroke-linejoin: round; }
.lb-left { fill: #FF4F28; fill-opacity: 0.55; stroke: #FFFFFF; stroke-width: 1.2; stroke-linejoin: round; }
.lb-right { fill: #FF4F28; fill-opacity: 0.72; stroke: #FFFFFF; stroke-width: 1.2; stroke-linejoin: round; }
.lb-ok .lb-top { fill: #1F7A4D; }
.lb-ok .lb-left { fill: #1F7A4D; fill-opacity: 0.55; }
.lb-ok .lb-right { fill: #1F7A4D; fill-opacity: 0.72; }
.lb-alive .lb-top { animation: lbShine 4s ease-in-out infinite; }
.lb-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 16px; fill: #0E0E10; }
.lb-lbl-bg { fill: #FFFFFF; fill-opacity: 0.94; stroke: #A7A6A2; stroke-width: 1; }
.lb-pop { transform-origin: center; animation: lbPop 0.55s ease-out both; }
@keyframes lbShine { 0%, 100% { fill-opacity: 0.88; } 50% { fill-opacity: 1; } }
@keyframes lbPop { from { opacity: 0; transform: translateY(-3px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* MATH geom_5_04: hr-calc — hisob qatori (a x b x c = res). */
.hr-calc { display: inline-flex; align-items: center; gap: clamp(5px, 1.1vw, 9px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.2vw, 24px); flex-wrap: wrap; justify-content: center; }
.hr-calc-on { color: #FF4F28; }
.hr-calc-op { color: #A7A6A2; }
.hr-calc-res { color: #019ACB; min-width: 1.2em; text-align: center; }
.hr-calc-unit { font-size: clamp(11px, 1.4vw, 13px); color: #5A5A60; font-weight: 600; margin-left: 2px; }

/* MATH geom_5_04: u3 — sm/sm²/sm³ birlik-belgilari (faqat palitra: ink2 / blue / accent). */
.u3-list { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
.u3-row { display: flex; align-items: center; gap: 10px; }
.u3-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 38px; padding: 3px 9px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.6vw, 14px); color: #FFFFFF; flex-shrink: 0; }
.u3-b1 { background: #5A5A60; }
.u3-b2 { background: #019ACB; }
.u3-b3 { background: #FF4F28; }

/* MATH geom_5_04: HookGrow — 2D yuza 3D quti; chuqurlik YUMSHOQ nafas oladi (keskin emas). */
.hg-host { display: flex; align-items: center; justify-content: center; width: 100%; }
.hg-svg { width: clamp(190px, 44vw, 230px); height: auto; }
.hg-front { fill: #FF4F28; fill-opacity: 0.85; stroke: #FF4F28; stroke-width: 2; stroke-linejoin: round; }
.hg-fg { stroke: #FFFFFF; stroke-width: 1.4; opacity: 0.7; }
.hg-top { fill: #019ACB; fill-opacity: 0.5; stroke: #FFFFFF; stroke-width: 1.4; stroke-linejoin: round; transform-origin: center; animation: hgFloat 5.5s ease-in-out infinite; }
.hg-side { fill: #019ACB; fill-opacity: 0.68; stroke: #FFFFFF; stroke-width: 1.4; stroke-linejoin: round; transform-origin: center; animation: hgFloat 5.5s ease-in-out infinite; }
@keyframes hgFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

/* MATH geom_5_04: dnd — drag-and-drop (chiplarni sm/sm²/sm³ savatlariga sudrash). */
.dnd-bins { display: flex; gap: clamp(8px, 1.8vw, 14px); }
.dnd-bin { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; background: #FDFBF7; border: 2px dashed #A7A6A2; border-radius: 14px; padding: clamp(8px, 1.5vw, 11px) clamp(6px, 1.2vw, 10px); transition: border-color 0.2s, background 0.2s; }
.dnd-bin-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-bin-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 1.5vw, 13px); color: #5A5A60; text-align: center; }
.dnd-bin-slot { display: flex; flex-direction: column; gap: 6px; min-height: clamp(40px, 8vw, 52px); align-items: stretch; justify-content: center; }
.dnd-tray { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: clamp(9px, 1.6vw, 12px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.dnd-tray-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #A7A6A2; text-transform: uppercase; letter-spacing: 0.06em; }
.dnd-chip { cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none; background: #FFFFFF; border: 1.5px solid #FF4F28; border-radius: 99px; padding: clamp(7px, 1.3vw, 9px) clamp(12px, 2vw, 16px); font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px, 1.6vw, 14px); color: #0E0E10; box-shadow: 0 4px 12px -4px rgba(255, 79, 40, 0.25); transition: transform 0.15s, box-shadow 0.15s, background 0.18s; }
.dnd-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(255, 79, 40, 0.38); }
.dnd-chip-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 8px 20px -5px rgba(255, 79, 40, 0.5); }
.dnd-chip-in { cursor: pointer; text-align: center; border-color: #019ACB; box-shadow: 0 4px 12px -4px rgba(1, 154, 203, 0.28); }
.dnd-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; box-shadow: 0 4px 12px -4px rgba(31, 122, 77, 0.3); }

/* MATH geom_5_04: mbk — multi-blank (tag x qatlam = hajm). */
.mbk-rows { display: flex; flex-direction: column; gap: 10px; }
.mbk-row { display: flex; align-items: center; justify-content: space-between; gap: clamp(10px, 2vw, 18px); }
.mbk-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.4vw, 18px); color: #0E0E10; }
.mbk-box { width: clamp(70px, 16vw, 92px) !important; font-size: clamp(18px, 3.4vw, 24px) !important; }
.mbk-wrong { box-shadow: 0 0 0 2px #D8A93A inset !important; }

/* MATH geom_5_04: fcz — dekorativ suzuvchi mini-kubchalar (sekin, yengil — bo'sh joyni boyitadi). */
.fcz { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.fcz-c { position: absolute; width: 18px; height: 18px; border-radius: 4px; opacity: 0.5; background: linear-gradient(135deg, rgba(255, 79, 40, 0.22), rgba(255, 79, 40, 0.06)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.18); animation: fczFloat 16s ease-in-out infinite; }
.fcz-1 { left: 7%; top: 16%; animation-delay: 0s; }
.fcz-2 { right: 9%; top: 22%; width: 13px; height: 13px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.22), rgba(1, 154, 203, 0.06)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.18); animation-delay: -6s; }
.fcz-3 { left: 14%; bottom: 14%; width: 14px; height: 14px; animation-delay: -10s; }
.fcz-4 { right: 13%; bottom: 20%; width: 20px; height: 20px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.2), rgba(1, 154, 203, 0.05)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.16); animation-delay: -3s; }
.fcz-5 { left: 30%; top: 8%; width: 12px; height: 12px; animation-delay: -13s; }
.fcz-6 { right: 32%; bottom: 9%; width: 15px; height: 15px; background: linear-gradient(135deg, rgba(255, 79, 40, 0.18), rgba(255, 79, 40, 0.05)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.15); animation-delay: -8s; }
@keyframes fczFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.45; } 50% { transform: translateY(-14px) rotate(6deg); opacity: 0.75; } }

/* MATH geom_5_04: mq — ko'p-savol javoblangan ✓ qatori (s1, s8 tepada yig'iladi). */
.mq-done { display: flex; align-items: center; gap: 10px; background: #E3F0E8; border-radius: 10px; padding: clamp(7px, 1.3vw, 10px) clamp(12px, 2vw, 16px); font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px, 1.6vw, 14px); color: #1F7A4D; box-shadow: 0 4px 12px -6px rgba(31, 122, 77, 0.25); }
.mq-done-ic { display: flex; color: #1F7A4D; }

/* MATH geom_5_04: db — DimBuild (1 o'lcham chiziq -> 2 kvadrat -> 3 kub; s4, harakatli). */
.db-host { display: flex; align-items: center; justify-content: center; }
.db-svg { width: clamp(120px, 28vw, 164px); height: auto; }
.db-sq { fill: #FF4F28; fill-opacity: 0.82; stroke: #FFFFFF; stroke-width: 1.4; stroke-linejoin: round; animation: dbSq 5.5s ease-in-out infinite; }
.db-line { stroke: #FF4F28; stroke-width: 5; stroke-linecap: round; animation: dbLine 5.5s ease-in-out infinite; }
.db-top { fill: #019ACB; fill-opacity: 0.5; stroke: #FFFFFF; stroke-width: 1.4; stroke-linejoin: round; transform-origin: center; animation: dbDepth 5.5s ease-in-out infinite; }
.db-side { fill: #019ACB; fill-opacity: 0.68; stroke: #FFFFFF; stroke-width: 1.4; stroke-linejoin: round; transform-origin: center; animation: dbDepth 5.5s ease-in-out infinite; }
@keyframes dbLine { 0%, 12% { opacity: 1; } 24%, 100% { opacity: 0.82; } }
@keyframes dbSq { 0%, 18% { opacity: 0; } 30%, 100% { opacity: 1; } }
@keyframes dbDepth { 0%, 50% { opacity: 0; transform: translate(-7px, 5px); } 64%, 88% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(-7px, 5px); } }

/* MATH geom_5_04: rc — RiseCubes (yengil "плавно" mukofot, to'g'ri javobdan keyin pastdan). */
.rc-host { display: flex; align-items: flex-end; justify-content: center; gap: 8px; height: 30px; }
.rc-c { width: 13px; height: 13px; border-radius: 3px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.5), rgba(1, 154, 203, 0.18)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.3); animation: rcRise 2.8s ease-in-out infinite; }
@keyframes rcRise { 0%, 100% { transform: translateY(5px); opacity: 0.3; } 50% { transform: translateY(-5px); opacity: 0.85; } }

/* MATH geom_5_04: fakt-animatsiyalar (CSS-only loop, ko'k tema, YUMSHOQ — keskin emas). */
/* 1 litr = 10x10x10: kubcha suv bilan yumshoq to'ladi (Matematika). */
.fa-lt { width: clamp(82px, 17vw, 116px); height: auto; }
.fa-lt-front { fill: rgba(1, 154, 203, 0.1); stroke: #019ACB; stroke-width: 2; stroke-linejoin: round; }
.fa-lt-top { fill: rgba(1, 154, 203, 0.22); stroke: #019ACB; stroke-width: 1.6; stroke-linejoin: round; }
.fa-lt-side { fill: rgba(1, 154, 203, 0.3); stroke: #019ACB; stroke-width: 1.6; stroke-linejoin: round; }
.fa-lt-water { fill: #019ACB; fill-opacity: 0.5; transform-origin: 45px 54px; animation: faLt 4s ease-in-out infinite; }
@keyframes faLt { 0%, 100% { transform: scaleY(0.82); } 50% { transform: scaleY(1); } }
/* Voksel — 3D o'yin kubchalari yumshoq to'lqinli yorishadi (IT). */
.fa-vx { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: clamp(66px, 13vw, 92px); height: clamp(66px, 13vw, 92px); }
.fa-vx-c { background: #019ACB; opacity: 0.35; border-radius: 3px; animation: faVx 2.6s ease-in-out infinite; }
@keyframes faVx { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
/* Rubik kubi 3x3 old yuz — qator-qator yumshoq yorishadi (Matematika). */
.fa-rb { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: clamp(70px, 14vw, 96px); height: clamp(70px, 14vw, 96px); padding: 4px; background: rgba(1, 154, 203, 0.12); border-radius: 8px; }
.fa-rb-c { background: #019ACB; opacity: 0.35; border-radius: 4px; animation: faRb 3s ease-in-out infinite; }
@keyframes faRb { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.85; } }

/* MATH: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
