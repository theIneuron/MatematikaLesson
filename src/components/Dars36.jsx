import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Площадь треугольника — geom_5_03
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
          if (isCorrect && c.fact_audio && c.fact_audio[lang]) engine.pushOneOff(c.fact_audio[lang]);  // FactCard ovozlanadi (TTS-toza)
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <FloatTris/>
        {titleNode && <div style={{ position: 'relative' }}><Title node={titleNode}/></div>}
        {/* Sarlavha (Title) + savol matni to'g'ri javobdan keyin ham qoladi — faqat noto'g'ri variantlar yig'iladi. */}
        <div className="fade-up" style={{ position: 'relative' }}>{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {/* To'g'ri javobdan keyin: faqat to'g'ri variant qoladi, noto'g'rilari silliq yig'ilib g'oyib bo'ladi (yangilangan anti-scroll). */}
        <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;        // to'g'ri javobdan keyin noto'g'rilar yig'iladi
            if (solved) {
              if (isCorrect) cls += ' option-correct';
              // noto'g'rilar yig'ilayotgani uchun rang-klass qo'shilmaydi — inline opacity bilan silliq so'nadi
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;      // верное решает, погашенный неверный — не кликается; остальные активны
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
        {solved && <div style={{ position: 'relative' }}>{factOnCorrect}</div>}
      </div>
    </Stage>
  );
};

// ============================================================
// --- POD UROK: geom_5_03 — Uchburchak yuzasi / Площадь треугольника (PROMPT 2026-06-19) ---
// Markaziy misconception M1: ikkiga bo'lishni UNUTISH (asos x balandlik beradi to'rtburchak yuzasini, ikki barobar ko'p).
// M2: balandlik o'rniga qiya tomonni olish (balandlik = asosga perpendikulyar).
// Darslik: uchburchak = to'rtburchakning yarmi; S = (asos x balandlik) : 2; balandlik asosga perpendikulyar.
// Hook: yangi qahramon (Temur) uchburchak yuzasini asos x balandlik deb hisoblaydi, ikkiga bo'lishni unutadi (= ikki barobar).
// Vizualizator: TriViz (uchburchak = to'rtburchakning yarmi; aylanuvchi/iz-trace YO'Q, faqat figurada yumshoq shine).
// Etalon: Dars28 (geom) — keep-visible QuestionScreen, NumGeoScreen, FloatTris ambient, FactCard.
// Faktlar (DRAFT): Misr piramidalari / uchburchak eng mustahkam shakl (Matematika) / 3D-grafika uchburchak mesh (IT).
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'geom_5_03',
  lessonTitle: { ru: 'Площадь треугольника', uz: "Uchburchak yuzasi" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {
  // ===== s0 HOOK — Temur uchburchak yuzasini asos x balandlik deb hisoblaydi, ikkiga bo'lishni unutadi (M1) =====
  s0: {
    eyebrow: { ru: 'Начало', uz: "Boshlanish" },
    title: { ru: 'Расчёт Темура', uz: "Temurning hisobi" },
    lead: { ru: 'У треугольника основание 6 и высота 4. Темур умножил 6 на 4 и говорит: «площадь 24». Он прав?', uz: "Uchburchakning asosi 6, balandligi 4. Temur 6 ni 4 ga ko'paytirdi va «yuza 24» deyapti. U haqmi?" },
    opt0: { ru: 'Да, 24', uz: "Ha, 24" },
    opt1: { ru: 'Нет, это площадь прямоугольника', uz: "Yo'q, bu to'rtburchak yuzasi" },
    opt2: { ru: 'Не знаю', uz: "Bilmayman" },
    reveal: { ru: 'Умножение основания на высоту даёт площадь прямоугольника. Треугольник — это его половина, поэтому 24 вдвое больше. Сегодня разберёмся.', uz: "Asosni balandlikka ko'paytirish to'rtburchak yuzasini beradi. Uchburchak esa uning yarmi, shuning uchun 24 ikki barobar ko'p. Bugun shuni o'rganamiz." },
    audio: { ru: "У треугольника основание шесть и высота четыре. Темур умножил шесть на четыре и говорит, что площадь двадцать четыре. Подумайте, треугольник занимает весь прямоугольник или только его половину?", uz: "Uchburchakning asosi olti, balandligi to'rt. Temur oltini to'rtga ko'paytirdi va yuza yigirma to'rt deyapti. O'ylab ko'ring, uchburchak butun to'rtburchakni egallaydimi yoki uning yarmini?" }
  },

  // ===== s1 WARM-UP — uchta savol (✓-fold): ko'paytirish VA yarmini olish =====
  s1: {
    eyebrow: { ru: 'Разминка', uz: "Mashq" },
    title: { ru: 'Быстрый счёт', uz: "Tez hisob" },
    lead: { ru: 'Прежде чем считать треугольники, разомнёмся. Умножение и деление пополам пригодятся.', uz: "Uchburchaklarni hisoblashdan oldin mashq qilamiz. Ko'paytirish va yarmini olish asqotadi." },
    questions: [
      {
        q: { ru: 'Сколько будет 6 × 4?', uz: "6 × 4 nechaga teng?" },
        opts: [{ ru: '24', uz: "24" }, { ru: '18', uz: "18" }, { ru: '20', uz: "20" }, { ru: '28', uz: "28" }],
        correct: 0,
        hint: { ru: 'Это шесть раз по четыре подряд.', uz: "Bu ketma-ket olti marta to'rt." },
        audio: { ru: "Сколько будет шесть умножить на четыре?", uz: "Oltini to'rtga ko'paytirsak nechi bo'ladi?" }
      },
      {
        q: { ru: 'Половина от 24 — это сколько?', uz: "24 ning yarmi nechaga teng?" },
        opts: [{ ru: '10', uz: "10" }, { ru: '12', uz: "12" }, { ru: '8', uz: "8" }, { ru: '14', uz: "14" }],
        correct: 1,
        hint: { ru: 'Поделите двадцать четыре на два.', uz: "Yigirma to'rtni ikkiga bo'ling." },
        audio: { ru: "А чему равна половина от двадцати четырёх?", uz: "Yigirma to'rtning yarmi nechaga teng?" }
      },
      {
        q: { ru: 'Сколько будет 8 × 3?', uz: "8 × 3 nechaga teng?" },
        opts: [{ ru: '21', uz: "21" }, { ru: '18', uz: "18" }, { ru: '24', uz: "24" }, { ru: '27', uz: "27" }],
        correct: 2,
        hint: { ru: 'Возьмите восемь три раза подряд.', uz: "Sakkizni ketma-ket uch marta oling." },
        audio: { ru: "И последнее. Сколько будет восемь умножить на три?", uz: "Va oxirgisi. Sakkizni uchga ko'paytirsak nechi bo'ladi?" }
      }
    ],
    done_label: { ru: 'Вопрос', uz: "Savol" },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: { ru: 'Отлично, счёт работает. Теперь идём искать площадь треугольника.', uz: "Zo'r, hisob ishlayapti. Endi uchburchak yuzasini topishga o'tamiz." },
    audio: {
      next: { ru: 'Разомнёмся перед задачами.', uz: "Masalalardan oldin mashq qilamiz." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посчитайте ещё раз спокойно.', uz: "Yana bir bor xotirjam hisoblang." }
    }
  },

  // ===== s2 EXPLORATION — to'rtburchak diagonal bo'yicha 2 teng uchburchakka bo'linadi (step), TriViz split =====
  s2: {
    eyebrow: { ru: 'Половина', uz: "Yarmi" },
    bridge: { ru: 'Счёт работает, теперь разрежем прямоугольник.', uz: "Hisob ishladi, endi to'rtburchakni kesamiz." },
    title: { ru: 'Разрежем прямоугольник', uz: "To'rtburchakni kesamiz" },
    lead: { ru: 'Возьмём прямоугольник и проведём в нём диагональ. Посмотрим, что получится.', uz: "To'rtburchak olamiz va unda diagonal o'tkazamiz. Nima bo'lishini ko'ramiz." },
    step_1: { ru: 'Вот прямоугольник: основание 6, высота 4.', uz: "Mana to'rtburchak: asosi 6, balandligi 4." },
    step_2: { ru: 'Проводим диагональ из угла в угол. Получились два треугольника.', uz: "Burchakdan burchakka diagonal o'tkazamiz. Ikki uchburchak hosil bo'ldi." },
    step_3: { ru: 'Эти два треугольника одинаковые, их можно наложить друг на друга.', uz: "Bu ikki uchburchak bir xil, ularni bir-birining ustiga qo'yish mumkin." },
    step_4: { ru: 'Значит один треугольник — это ровно половина прямоугольника.', uz: "Demak bitta uchburchak to'rtburchakning aynan yarmi." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Возьмём прямоугольник с основанием шесть и высотой четыре.",
        "Проведём диагональ из угла в угол. Прямоугольник разделился на два треугольника.",
        "Эти два треугольника одинаковые, их можно наложить друг на друга.",
        "Значит один треугольник это ровно половина прямоугольника."
      ],
      uz: [
        "Asosi olti, balandligi to'rt bo'lgan to'rtburchak olamiz.",
        "Burchakdan burchakka diagonal o'tkazamiz. To'rtburchak ikki uchburchakka bo'lindi.",
        "Bu ikki uchburchak bir xil, ularni bir-birining ustiga qo'yish mumkin.",
        "Demak bitta uchburchak to'rtburchakning aynan yarmi."
      ]
    }
  },

  // ===== s3 EXPLORATION — to'rtburchak yuzasi = asos x balandlik; uchburchak shuning yarmi (step) =====
  s3: {
    eyebrow: { ru: 'Половина площади', uz: "Yuzaning yarmi" },
    title: { ru: 'Площадь — половина', uz: "Yuza — yarmi" },
    lead: { ru: 'Высота равна 4. Двигайте основание и смотрите: треугольник всегда занимает ровно половину прямоугольника.', uz: "Balandlik 4 ga teng. Asosni suring va qarang: uchburchak doim to'rtburchakning aynan yarmini egallaydi." },
    slider_label: { ru: 'Основание', uz: "Asos" },
    note_rect: { ru: 'Площадь прямоугольника', uz: "To'rtburchak yuzasi" },
    note_tri: { ru: 'Половина — площадь треугольника', uz: "Yarmi — uchburchak yuzasi" },
    audio: { ru: "Высота равна четырём. Двигайте основание и смотрите на закрашенный треугольник. Сначала находим площадь всего прямоугольника, основание умножить на высоту. Потом берём половину, и это площадь треугольника.", uz: "Balandlik to'rtga teng. Asosni suring va bo'yalgan uchburchakka qarang. Avval butun to'rtburchak yuzasini topamiz, asosni balandlikka ko'paytiramiz. Keyin yarmini olamiz, bu uchburchak yuzasi." }
  },

  // ===== s4 RULE 1 — S = (asos x balandlik) : 2; balandlik asosga perpendikulyar =====
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Мы увидели половину, соберём это в правило.', uz: "Yarmini ko'rdik, buni qoidaga yig'amiz." },
    heading: { ru: 'Как найти площадь', uz: "Yuzani qanday topamiz" },
    rule_label: { ru: 'Запомните', uz: "Yodda tuting" },
    rule_1: { ru: 'Площадь треугольника: S = (основание × высота) : 2.', uz: "Uchburchak yuzasi: S = (asos × balandlik) : 2." },
    rule_2: { ru: 'Сначала умножаем основание на высоту, потом делим результат пополам.', uz: "Avval asosni balandlikka ko'paytiramiz, keyin natijani yarmiga bo'lamiz." },
    rule_3: { ru: 'Высота проводится к основанию под прямым углом.', uz: "Balandlik asosga to'g'ri burchak ostida o'tkaziladi." },
    audio: { ru: "Итак, площадь треугольника равна основанию умножить на высоту и разделить на два. Сначала перемножаем основание и высоту, а потом берём половину. Важно, что высота идёт к основанию под прямым углом.", uz: "Demak, uchburchak yuzasi asosni balandlikka ko'paytirib, natijani ikkiga bo'lishga teng. Avval asos va balandlikni ko'paytiramiz, keyin yarmini olamiz. Muhimi, balandlik asosga to'g'ri burchak ostida boradi." }
  },

  // ===== s5 RULE 2 — ikkiga bo'lishni unutmang (M1) + balandlik qiya tomon emas (M2). Xulosa frame-tip da =====
  s5: {
    eyebrow: { ru: 'Две ловушки', uz: "Ikki tuzoq" },
    heading: { ru: 'Не попадись в ловушку', uz: "Tuzoqqa tushmang" },
    rule_1: { ru: 'Не забывайте делить на два. Без этого получится площадь прямоугольника, вдвое больше.', uz: "Ikkiga bo'lishni unutmang. Busiz to'rtburchak yuzasi, ikki barobar ko'p chiqadi." },
    rule_2: { ru: 'Высота — это перпендикуляр к основанию, а не наклонная сторона треугольника.', uz: "Balandlik — asosga perpendikulyar, uchburchakning qiya tomoni emas." },
    tip: { ru: 'Темур забыл разделить на два — взял площадь прямоугольника, а не треугольника.', uz: "Temur ikkiga bo'lishni unutdi — uchburchak emas, to'rtburchak yuzasini oldi." },
    audio: { ru: "Запомните две ловушки. Первая, не забудьте разделить на два, иначе получится площадь прямоугольника, вдвое больше. Вторая, высота это перпендикуляр к основанию, а не наклонная сторона. Темур забыл взять половину, поэтому ошибся.", uz: "Ikki tuzoqni yodda tuting. Birinchisi, ikkiga bo'lishni unutmang, aks holda to'rtburchak yuzasi, ikki barobar ko'p chiqadi. Ikkinchisi, balandlik asosga perpendikulyar, qiya tomon emas. Temur yarmini olishni unutdi, shuning uchun yanglishdi." }
  },

  // ===== s6 TEST (interaktiv): "Balandlikni top" — perpendikulyar balandlikni aniqlash (M2), keyin yuza yarmini ko'rish (Dars36 imzo metodi) =====
  s6: {
    eyebrow: { ru: 'Найди высоту', uz: "Balandlikni toping" },
    bridge: { ru: 'Правило знаем, теперь найди высоту сам.', uz: "Qoidani bilamiz, endi balandlikni o'zingiz toping." },
    title: { ru: 'Где высота треугольника?', uz: "Uchburchak balandligi qayerda?" },
    lead: { ru: 'Высота — это перпендикуляр от вершины к основанию, под прямым углом. Выбери её, а не наклонную сторону.', uz: "Balandlik — uchidan asosga tushirilgan perpendikulyar, to'g'ri burchak ostida. Uni tanlang, qiya tomonni emas." },
    opts: [
      { ru: 'Перпендикуляр к основанию', uz: "Asosga perpendikulyar" },
      { ru: 'Наклонная сторона', uz: "Qiya tomon" },
      { ru: 'Основание', uz: "Asos" }
    ],
    correct: 0,
    hint: { ru: 'Высота всегда под прямым углом к основанию, а не вдоль наклонной стороны.', uz: "Balandlik doim asosga to'g'ri burchak ostida, qiya tomon bo'ylab emas." },
    correct_text: { ru: 'Верно: высота — это перпендикуляр. Теперь площадь — половина от 6 · 4 = 12.', uz: "To'g'ri: balandlik — perpendikulyar. Endi yuza — 6 · 4 ning yarmi = 12." },
    audio: {
      intro: { ru: "Выбери высоту треугольника. Это перпендикуляр от вершины к основанию, под прямым углом, а не наклонная сторона.", uz: "Uchburchak balandligini tanlang. Bu uchidan asosga tushirilgan perpendikulyar, to'g'ri burchak ostida, qiya tomon emas." },
      on_correct: { ru: "Верно. Высота это перпендикуляр к основанию. Теперь площадь это половина от шесть умножить четыре, то есть двенадцать.", uz: "To'g'ri. Balandlik asosga perpendikulyar. Endi yuza olti ko'paytiruv to'rtning yarmi, ya'ni o'n ikki." },
      on_wrong: { ru: "Высота под прямым углом к основанию, а не вдоль наклонной стороны.", uz: "Balandlik asosga to'g'ri burchak ostida, qiya tomon bo'ylab emas." }
    }
  },

  // ===== s7 TEST (aralash blok): 4 ta har xil tipdagi savol — MC, o'nlik typed, to'g'ri/noto'g'ri, qadamlarni tartiblash =====
  s7: {
    eyebrow: { ru: 'Разные задачи', uz: "Har xil savollar" },
    title: { ru: 'Четыре разных вопроса', uz: "To'rt xil savol" },
    lead: { ru: 'Четыре задания на площадь треугольника — все разного вида. Отвечай по очереди.', uz: "Uchburchak yuzasiga oid to'rt topshiriq — har biri har xil. Navbatma-navbat javob bering." },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    items: [
      { kind: 'choice', base: 6, height: 4,
        q: { ru: 'Выбери площадь треугольника: основание 6, высота 4.', uz: "Uchburchak yuzasini tanlang: asos 6, balandlik 4." },
        opts: [{ ru: '12', uz: '12' }, { ru: '24', uz: '24' }, { ru: '10', uz: '10' }, { ru: '20', uz: '20' }], correct: 0,
        hint: { ru: 'Умножь основание на высоту и возьми половину.', uz: "Asosni balandlikka ko'paytirib, yarmini ol." },
        audio_q: { ru: "Первый вопрос. Выбери площадь треугольника с основанием шесть и высотой четыре.", uz: "Birinchi savol. Asosi olti, balandligi to'rt uchburchak yuzasini tanlang." },
        audio_ok: { ru: "Верно, двенадцать. Шесть на четыре, потом половина.", uz: "To'g'ri, o'n ikki. Olti ko'paytiruv to'rt, keyin yarmi." } },
      { kind: 'num', dec: true, base: 5, height: 3, answer: 7.5,
        q: { ru: 'Основание 5, высота 3. Посчитай площадь сам — может получиться дробь.', uz: "Asos 5, balandlik 3. Yuzasini o'zingiz hisoblang — kasr chiqishi mumkin." },
        hint: { ru: 'Пять умножить на три, потом половина. Ответ может быть с запятой.', uz: "Beshni uchga ko'paytir, keyin yarmini. Javob vergulli bo'lishi mumkin." },
        audio_q: { ru: "Второй вопрос. Основание пять, высота три. Посчитай площадь сам, ответ может быть дробным.", uz: "Ikkinchi savol. Asos besh, balandlik uch. Yuzasini o'zingiz hisoblang, javob kasrli bo'lishi mumkin." },
        audio_ok: { ru: "Верно, семь целых пять десятых. Пять на три это пятнадцать, а половина это семь с половиной.", uz: "To'g'ri, yetti butun o'ndan besh. Beshni uchga ko'paytirsak o'n besh, yarmi esa yetti yarim." } },
      { kind: 'choice',
        q: { ru: 'Верно ли: у треугольника с основанием 6 и высотой 4 площадь равна 24?', uz: "To'g'rimi: asosi 6, balandligi 4 uchburchakning yuzasi 24?" },
        opts: [{ ru: 'Верно', uz: "To'g'ri" }, { ru: 'Неверно', uz: "Noto'g'ri" }], correct: 1,
        hint: { ru: '24 — это площадь прямоугольника. У треугольника берут половину.', uz: "24 — bu to'rtburchak yuzasi. Uchburchakda yarmini oladilar." },
        audio_q: { ru: "Третий вопрос. Верно ли, что у треугольника с основанием шесть и высотой четыре площадь равна двадцати четырём?", uz: "Uchinchi savol. Asosi olti, balandligi to'rt uchburchakning yuzasi yigirma to'rt, to'g'rimi?" },
        audio_ok: { ru: "Правильно, это неверно. Двадцать четыре это прямоугольник, а у треугольника половина, двенадцать.", uz: "To'g'ri javob, bu noto'g'ri. Yigirma to'rt — bu to'rtburchak, uchburchakda esa yarmi, o'n ikki." } },
      { kind: 'order',
        q: { ru: 'Расставь шаги по порядку: как найти площадь треугольника?', uz: "Qadamlarni tartibga sol: uchburchak yuzasini qanday topamiz?" },
        steps: [
          { ru: 'Умножить основание на высоту', uz: "Asosni balandlikka ko'paytirish" },
          { ru: 'Разделить результат на два', uz: "Natijani ikkiga bo'lish" },
          { ru: 'Получили площадь треугольника', uz: "Uchburchak yuzasini oldik" }
        ],
        shuffle: [1, 2, 0],
        hint: { ru: 'Сначала умножают стороны, и только потом делят пополам.', uz: "Avval tomonlarni ko'paytiradilar, keyin yarmiga bo'ladilar." },
        audio_q: { ru: "Четвёртый вопрос. Расставь по порядку шаги: как найти площадь треугольника?", uz: "To'rtinchi savol. Qadamlarni tartibga sol: uchburchak yuzasini qanday topamiz?" },
        audio_ok: { ru: "Верно. Сначала умножить основание на высоту, потом разделить пополам.", uz: "To'g'ri. Avval asosni balandlikka ko'paytirish, keyin yarmiga bo'lish." } }
    ],
    done_label: { ru: 'Вопрос', uz: "Savol" },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: { ru: 'Отлично, ты справился со всеми четырьмя.', uz: "Zo'r, to'rttasini ham yechdingiz." },
    audio: {
      next: { ru: 'Четыре разных задания на площадь треугольника.', uz: "Uchburchak yuzasiga oid to'rt xil topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри подсказку и попробуй ещё раз.', uz: "Maslahatni ko'ring va yana urinib ko'ring." }
    }
  },

  // ===== s8 TEST MC — asos 10, balandlik 6 -> 30 (M1: 60, +16, +40) =====
  s8: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Ещё треугольник', uz: "Yana uchburchak" },
    question: { ru: 'У треугольника основание 10, высота 6. Чему равна площадь?', uz: "Uchburchakning asosi 10, balandligi 6. Yuzasi nechaga teng?" },
    opt0: { ru: '30', uz: "30" },
    opt1: { ru: '60', uz: "60" },
    opt2: { ru: '16', uz: "16" },
    opt3: { ru: '40', uz: "40" },
    correct_text: { ru: 'Верно: 10 × 6 = 60, потом 60 : 2 = 30.', uz: "To'g'ri: 10 × 6 = 60, keyin 60 : 2 = 30." },
    wrong_1: { ru: 'Это площадь прямоугольника. У треугольника нужно взять половину. Поделите на два.', uz: "Bu to'rtburchak yuzasi. Uchburchakda yarmini olish kerak. Ikkiga bo'ling." },
    wrong_2: { ru: 'Похоже, вы сложили стороны. Площадь, это основание умножить на высоту и взять половину.', uz: "Tomonlarni qo'shganga o'xshaysiz. Yuza, asosni balandlikka ko'paytirib, yarmini olish." },
    wrong_3: { ru: 'Почти. Сначала 10 умножить на 6, это 60, а потом возьмите половину.', uz: "Deyarli. Avval 10 ni 6 ga ko'paytiring, bu 60, keyin yarmini oling." },
    audio: {
      intro: { ru: "Теперь побольше. Основание десять, высота шесть. Чему равна площадь?", uz: "Endi kattaroq. Asosi o'n, balandligi olti. Yuzasi nechaga teng?" },
      on_correct: { ru: "Верно, тридцать. Десять умножить на шесть это шестьдесят, а половина от шестидесяти это тридцать.", uz: "To'g'ri, o'ttiz. O'nni oltiga ko'paytirsak oltmish, oltmishning yarmi esa o'ttiz." },
      on_wrong: { ru: "Умножьте основание на высоту, а потом возьмите половину.", uz: "Asosni balandlikka ko'paytiring, keyin yarmini oling." }
    }
  },

  // ===== s9 TEST MC — qaysi hisob NOTO'G'RI (yarmini olmagan, to'rtburchak yuzasi) + FactCard FB_HIST (AnimPyramid) =====
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где ошибка?', uz: "Xato qayerda?" },
    question: { ru: 'Три ученика искали площадь треугольника с основанием 6 и высотой 4. Кто посчитал НЕправильно?', uz: "Uch o'quvchi asosi 6, balandligi 4 uchburchak yuzasini topdi. Kim NOTO'G'RI hisobladi?" },
    opt0: { ru: 'Малика: 6 × 4 : 2 = 12', uz: "Malika: 6 × 4 : 2 = 12" },
    opt1: { ru: 'Азиз: 6 × 4 = 24', uz: "Aziz: 6 × 4 = 24" },
    opt2: { ru: 'Дильшод: (6 × 4) : 2 = 12', uz: "Dilshod: (6 × 4) : 2 = 12" },
    correct_text: { ru: 'Верно: Азиз умножил основание на высоту, но не взял половину. Это площадь прямоугольника, а не треугольника. Правильно — 12.', uz: "To'g'ri: Aziz asosni balandlikka ko'paytirdi, lekin yarmini olmadi. Bu to'rtburchak yuzasi, uchburchakniki emas. To'g'risi — 12." },
    wrong_0: { ru: 'Малика умножила основание на высоту и взяла половину, получила двенадцать. Это верно.', uz: "Malika asosni balandlikka ko'paytirib yarmini oldi, o'n ikki chiqdi. Bu to'g'ri." },
    wrong_2: { ru: 'Дильшод сначала перемножил стороны, потом взял половину, получил двенадцать. Это верно.', uz: "Dilshod avval tomonlarni ko'paytirdi, keyin yarmini oldi, o'n ikki chiqdi. Bu to'g'ri." },
    fact: { ru: 'Грани египетских пирамид — огромные треугольники. Строители тысячи лет назад умели находить их площадь, чтобы рассчитать камень.', uz: "Misr piramidalarining yon yuzlari — ulkan uchburchaklar. Quruvchilar ming yillar oldin tosh hisoblash uchun ularning yuzasini topa olishgan." },
    fact_audio: { ru: "Грани египетских пирамид это огромные треугольники. Строители тысячи лет назад умели находить их площадь, чтобы рассчитать камень.", uz: "Misr piramidalarining yon yuzlari ulkan uchburchaklar. Quruvchilar ming yillar oldin tosh hisoblash uchun ularning yuzasini topa olishgan." },
    audio: {
      intro: { ru: "Три ученика искали площадь треугольника с основанием шесть и высотой четыре. Найдите того, кто посчитал неправильно.", uz: "Uch o'quvchi asosi olti, balandligi to'rt uchburchak yuzasini topdi. Noto'g'ri hisoblaganini toping." },
      on_correct: { ru: "Верно, ошибся Азиз. Он умножил основание на высоту, но не взял половину, поэтому получил площадь прямоугольника, двадцать четыре вместо двенадцати.", uz: "To'g'ri, Aziz xato qildi. U asosni balandlikka ko'paytirdi, lekin yarmini olmadi, shuning uchun to'rtburchak yuzasini topdi, o'n ikki o'rniga yigirma to'rt." },
      on_wrong: { ru: "Кто не разделил на два, тот нашёл площадь прямоугольника.", uz: "Kim ikkiga bo'lmagan bo'lsa, to'rtburchak yuzasini topgan." }
    }
  },

  // ===== s10 CASE setup — Bekzod uchburchak bayroq tikadi, asos 8, balandlik 6 =====
  s10: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    bridge: { ru: 'Задачи решили, перейдём к настоящему флажку.', uz: "Masalalarni yechdik, endi haqiqiy bayroqchaga o'tamiz." },
    title: { ru: 'Флажок Бекзода', uz: "Bekzodning bayrog'i" },
    lead: { ru: 'Бекзод шьёт треугольный флажок. Основание флажка 8 см, высота 6 см.', uz: "Bekzod uchburchak bayroqcha tikyapti. Bayroqning asosi 8 sm, balandligi 6 sm." },
    note: { ru: 'Сколько ткани нужно на один такой флажок?', uz: "Bitta shunday bayroq uchun qancha mato kerak?" },
    hint_calc: { ru: 'Площадь ткани — это площадь треугольника. Умножьте основание на высоту и возьмите половину.', uz: "Mato yuzasi — uchburchak yuzasi. Asosni balandlikka ko'paytirib, yarmini oling." },
    btn_help: { ru: 'Решить', uz: "Yechish" },
    audio: { ru: "Бекзод шьёт треугольный флажок. Основание восемь сантиметров, высота шесть. Подумайте, площадь ткани это площадь треугольника, значит основание умножить на высоту и взять половину.", uz: "Bekzod uchburchak bayroqcha tikyapti. Asosi sakkiz santimetr, balandligi olti. O'ylab ko'ring, mato yuzasi uchburchak yuzasi, demak asosni balandlikka ko'paytirib, yarmini olish kerak." }
  },

  // ===== s11 TEST MC (case) — bayroq yuzasi 8x6 -> 24 + FactCard FB_MATH (AnimHalf) =====
  s11: {
    eyebrow: { ru: 'Итоговое задание', uz: "Topshiriq" },
    title: { ru: 'Площадь флажка', uz: "Bayroq yuzasi" },
    question: { ru: 'Флажок: основание 8 см, высота 6 см. Сколько ткани нужно?', uz: "Bayroq: asosi 8 sm, balandligi 6 sm. Qancha mato kerak?" },
    opt0: { ru: '24 см²', uz: "24 sm²" },
    opt1: { ru: '48 см²', uz: "48 sm²" },
    opt2: { ru: '14 см²', uz: "14 sm²" },
    opt3: { ru: '28 см²', uz: "28 sm²" },
    correct_text: { ru: 'Верно: 8 × 6 = 48, потом 48 : 2 = 24 см².', uz: "To'g'ri: 8 × 6 = 48, keyin 48 : 2 = 24 sm²." },
    wrong_1: { ru: 'Это площадь прямоугольника. Флажок треугольный, нужно взять половину. Поделите на два.', uz: "Bu to'rtburchak yuzasi. Bayroq uchburchak shaklida, yarmini olish kerak. Ikkiga bo'ling." },
    wrong_2: { ru: 'Похоже, вы сложили стороны. Площадь, это основание умножить на высоту и взять половину.', uz: "Tomonlarni qo'shganga o'xshaysiz. Yuza, asosni balandlikka ko'paytirib, yarmini olish." },
    wrong_3: { ru: 'Почти. Сначала 8 умножить на 6, это 48, а потом возьмите половину.', uz: "Deyarli. Avval 8 ni 6 ga ko'paytiring, bu 48, keyin yarmini oling." },
    fact: { ru: 'Половина прямоугольника — это и есть треугольник. Поэтому площадь треугольника всегда вдвое меньше площади прямоугольника с теми же основанием и высотой.', uz: "To'rtburchakning yarmi — aynan uchburchak. Shuning uchun uchburchak yuzasi xuddi shu asos va balandlikka ega to'rtburchak yuzasidan doim ikki barobar kichik." },
    fact_audio: { ru: "Половина прямоугольника это и есть треугольник. Поэтому площадь треугольника всегда вдвое меньше площади прямоугольника с теми же основанием и высотой.", uz: "To'rtburchakning yarmi aynan uchburchak. Shuning uchun uchburchak yuzasi xuddi shu asos va balandlikka ega to'rtburchak yuzasidan doim ikki barobar kichik." },
    audio: {
      intro: { ru: "Флажок с основанием восемь сантиметров и высотой шесть. Сколько ткани нужно?", uz: "Asosi sakkiz santimetr, balandligi olti bo'lgan bayroq. Qancha mato kerak?" },
      on_correct: { ru: "Верно, двадцать четыре квадратных сантиметра. Восемь умножить на шесть это сорок восемь, а половина от сорока восьми это двадцать четыре.", uz: "To'g'ri, yigirma to'rt kvadrat santimetr. Sakkizni oltiga ko'paytirsak qirq sakkiz, qirq sakkizning yarmi esa yigirma to'rt." },
      on_wrong: { ru: "Умножьте основание на высоту, а потом возьмите половину.", uz: "Asosni balandlikka ko'paytiring, keyin yarmini oling." }
    }
  },

  // ===== s12 FINAL MC — uchburchak tom peshtoqi, asos 10, balandlik 4 -> 20 + FactCard FB_IT (AnimMesh) =====
  s12: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Фронтон крыши', uz: "Tom peshtog'i" },
    question: { ru: 'Треугольный фронтон крыши: основание 10 м, высота 4 м. Чему равна его площадь?', uz: "Tomning uchburchak peshtog'i: asosi 10 m, balandligi 4 m. Yuzasi nechaga teng?" },
    opt0: { ru: '20 м²', uz: "20 m²" },
    opt1: { ru: '40 м²', uz: "40 m²" },
    opt2: { ru: '14 м²', uz: "14 m²" },
    opt3: { ru: '28 м²', uz: "28 m²" },
    correct_text: { ru: 'Верно: 10 × 4 = 40, потом 40 : 2 = 20 м².', uz: "To'g'ri: 10 × 4 = 40, keyin 40 : 2 = 20 m²." },
    wrong_1: { ru: 'Это площадь прямоугольника. Фронтон треугольный, нужно взять половину. Поделите на два.', uz: "Bu to'rtburchak yuzasi. Peshtoq uchburchak shaklida, yarmini olish kerak. Ikkiga bo'ling." },
    wrong_2: { ru: 'Похоже, вы сложили стороны. Площадь, это основание умножить на высоту и взять половину.', uz: "Tomonlarni qo'shganga o'xshaysiz. Yuza, asosni balandlikka ko'paytirib, yarmini olish." },
    wrong_3: { ru: 'Почти. Сначала 10 умножить на 4, это 40, а потом возьмите половину.', uz: "Deyarli. Avval 10 ni 4 ga ko'paytiring, bu 40, keyin yarmini oling." },
    fact: { ru: 'В компьютерной графике любую 3D-модель собирают из тысяч маленьких треугольников. Площадь каждого считают по той же формуле.', uz: "Kompyuter grafikasida har qanday uch o'lchamli model minglab kichik uchburchaklardan yig'iladi. Har birining yuzasi xuddi shu formula bilan hisoblanadi." },
    fact_audio: { ru: "В компьютерной графике любую трёхмерную модель собирают из тысяч маленьких треугольников. Площадь каждого считают по той же формуле.", uz: "Kompyuter grafikasida har qanday uch o'lchamli model minglab kichik uchburchaklardan yig'iladi. Har birining yuzasi xuddi shu formula bilan hisoblanadi." },
    audio: {
      intro: { ru: "Последнее задание. Треугольный фронтон крыши, основание десять метров, высота четыре. Чему равна площадь?", uz: "Oxirgi topshiriq. Tomning uchburchak peshtog'i, asosi o'n metr, balandligi to'rt. Yuzasi nechaga teng?" },
      on_correct: { ru: "Верно, двадцать квадратных метров. Десять умножить на четыре это сорок, а половина от сорока это двадцать.", uz: "To'g'ri, yigirma kvadrat metr. O'nni to'rtga ko'paytirsak qirq, qirqning yarmi esa yigirma." },
      on_wrong: { ru: "Умножьте основание на высоту, а потом возьмите половину.", uz: "Asosni balandlikka ko'paytiring, keyin yarmini oling." }
    }
  },

  // ===== s13 SUMMARY =====
  s13: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Треугольник — половина', uz: "Uchburchak — yarmi" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Треугольник — это половина прямоугольника с теми же основанием и высотой.', uz: "Uchburchak — xuddi shu asos va balandlikka ega to'rtburchakning yarmi." },
    main_2: { ru: 'Площадь треугольника: S = (основание × высота) : 2.', uz: "Uchburchak yuzasi: S = (asos × balandlik) : 2." },
    main_3: { ru: 'Не забывайте делить на два, а высоту берите перпендикулярно основанию.', uz: "Ikkiga bo'lishni unutmang, balandlikni esa asosga perpendikulyar oling." },
    hook_close: { ru: 'Теперь ясно: у Темура площадь не 24, а 12 — он забыл взять половину. 24 — это площадь прямоугольника.', uz: "Endi aniq: Temurda yuza 24 emas, 12 — u yarmini olishni unutdi. 24 — bu to'rtburchak yuzasi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Площадь прямоугольника, умножение и деление пополам.', uz: "To'rtburchak yuzasi, ko'paytirish va yarmiga bo'lish." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Площадь сложных фигур из прямоугольников и треугольников.', uz: "To'rtburchak va uchburchaklardan iborat murakkab figuralar yuzasi." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, треугольник это половина прямоугольника. Площадь треугольника равна основанию умножить на высоту и разделить на два. Главное, не забывайте брать половину, а высоту проводите к основанию под прямым углом.", uz: "Demak, uchburchak to'rtburchakning yarmi. Uchburchak yuzasi asosni balandlikka ko'paytirib, ikkiga bo'lishga teng. Asosiysi, yarmini olishni unutmang, balandlikni esa asosga to'g'ri burchak ostida o'tkazing." }
  }
};
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
// Bridge — slaydlararo ulovchi gap (faza chegaralarida): ekranda ↳ qator, ovozda intro boshiga qo'shiladi.
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const FB_IT     = { ru: 'Знаешь ли ты? · IT',         uz: "Bilasizmi? · IT" };
const FB_MATH   = { ru: 'Знаешь ли ты? · Математика', uz: "Bilasizmi? · Matematika" };

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

const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };

// ============================================================
// DEKOR — FloatTris (suzuvchi mini-uchburchaklar, uchburchak motivi)
// ============================================================
const FloatTris = () => (
  <div className="ftr" aria-hidden="true">
    <span className="ftr-t ftr-t1"/>
    <span className="ftr-t ftr-t2 ftr-c"/>
    <span className="ftr-t ftr-t3"/>
    <span className="ftr-t ftr-t4 ftr-c"/>
    <span className="ftr-t ftr-t5"/>
    <span className="ftr-t ftr-t6 ftr-c"/>
  </div>
);

// ============================================================
// FAKT-ANIMATSIYALAR (ko'k tema, CSS-only loop, aylanuvchi/iz YO'Q)
// ============================================================
// Tarix: Misr piramidasi — uchburchak yuz + quyosh yumshoq pulsi.
const AnimPyramid = () => (
  <svg className="fa-py" viewBox="0 0 90 64" aria-hidden="true">
    <circle cx="70" cy="16" r="7" className="fa-py-sun"/>
    <polygon points="45,12 82,56 8,56" className="fa-py-t"/>
    <line x1="45" y1="12" x2="45" y2="56" className="fa-py-h"/>
  </svg>
);
// Matematika: to'rtburchakning yarmi = uchburchak; B yarmi yumshoq pulslaydi.
const AnimHalf = () => (
  <svg className="fa-hf" viewBox="0 0 90 64" aria-hidden="true">
    <rect x="6" y="6" width="78" height="52" className="fa-hf-r"/>
    <polygon points="6,58 84,58 84,6" className="fa-hf-a"/>
    <polygon points="6,58 6,6 84,6" className="fa-hf-b"/>
    <line x1="6" y1="58" x2="84" y2="6" className="fa-hf-d"/>
  </svg>
);
// IT: 3D mesh — kichik uchburchaklar to'lqinli yorishadi.
const AnimMesh = () => (
  <div className="fa-ms" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <span key={i} className={`fa-ms-t${i % 2 ? ' fa-ms-d' : ''}`} style={{ animationDelay: `${(i % 3 + Math.floor(i / 3)) * 0.16}s` }}/>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATOR — TriViz: uchburchak = to'rtburchakning yarmi (SVG)
// alive=false bo'lganda harakatsiz; aylanuvchi/iz-trace element YO'Q (faqat figurada yumshoq shine).
// base(a) x height(h) birlik kataklarda. mode: 'tri' (uchburchak + o'rab turgan to'rtburchak ghost),
// 'split' (to'rtburchak + diagonal + 2 teng uchburchak; phase 0 rect / 1 ikkala yarim / 2 bitta yarim).
// ============================================================
const TriViz = ({ base, height, cell = 28, mode = 'tri', phase = 1, apexFrac = 0.5, grid = false, showHeight = false, success = false, showHalf = false, alive = true, compact = false, aLabel, hLabel }) => {
  const cs = compact ? Math.max(18, cell - 7) : cell;
  const padL = 30, padB = 24, padT = 12, padR = 12;
  const W = base * cs, H = height * cs;
  const x0 = padL, y0 = padT, xR = x0 + W, yB = y0 + H;
  const apexX = x0 + apexFrac * W;
  const svgW = W + padL + padR, svgH = H + padT + padB;
  const gridLines = [];
  if (grid) {
    for (let i = 1; i < base; i++) gridLines.push(<line key={`v${i}`} x1={x0 + i * cs} y1={y0} x2={x0 + i * cs} y2={yB} className="tv-grid"/>);
    for (let j = 1; j < height; j++) gridLines.push(<line key={`h${j}`} x1={x0} y1={y0 + j * cs} x2={xR} y2={y0 + j * cs} className="tv-grid"/>);
  }
  const cls = `tv${alive ? ' tv-alive' : ''}${success ? ' tv-ok' : ''}`;
  return (
    <svg className={cls} viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect x={x0} y={y0} width={W} height={H} className="tv-rect"/>
      {grid && gridLines}
      {mode === 'split' ? (
        <>
          {phase >= 1 && <polygon points={`${x0},${yB} ${xR},${yB} ${xR},${y0}`} className={`tv-fillA${phase === 2 ? ' tv-fillA-hi' : ''}`}/>}
          {phase >= 1 && <polygon points={`${x0},${yB} ${x0},${y0} ${xR},${y0}`} className={`tv-fillB${phase === 2 ? ' tv-fillB-dim' : ''}`}/>}
          {phase >= 1 && <line x1={x0} y1={yB} x2={xR} y2={y0} className="tv-diag"/>}
        </>
      ) : (
        <>
          {showHalf && <polygon points={`${x0},${y0} ${apexX},${y0} ${x0},${yB}`} className="tv-half"/>}
          {showHalf && <polygon points={`${apexX},${y0} ${xR},${y0} ${xR},${yB}`} className="tv-half"/>}
          <polygon points={`${x0},${yB} ${xR},${yB} ${apexX},${y0}`} className="tv-fill"/>
          {showHeight && <line x1={apexX} y1={y0} x2={apexX} y2={yB} className="tv-height"/>}
          {showHeight && <polyline points={`${apexX - 8},${yB} ${apexX - 8},${yB - 8} ${apexX},${yB - 8}`} className="tv-rangle"/>}
        </>
      )}
      {aLabel !== undefined && <text x={x0 + W / 2} y={yB + 17} className="tv-lbl" textAnchor="middle">{aLabel}</text>}
      {hLabel !== undefined && mode !== 'split' && <text x={x0 - 9} y={y0 + H / 2} className="tv-lbl" textAnchor="middle" transform={`rotate(-90 ${x0 - 9} ${y0 + H / 2})`}>{hLabel}</text>}
    </svg>
  );
};

// NumGeoScreen — bitta raqamli javob: вeди-до-верного + bardoshli tekshiruv + figura (Dars31 uslubi).
const NumGeoScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, figure, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const correct = Number(correctValue);
  const norm = (s) => parseFloat(String(s).replace(',', '.').replace(/\s/g, ''));
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
    const v = norm(value); if (isNaN(v)) return;
    const isCorrect = Math.abs(v - correct) < 1e-6;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(value); }
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
          const wrongVoice = (c.hint && c.hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <FloatTris/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.question))}</h2>
        {figure && <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>{figure(solved)}</div>}
        <div className="fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative' }}>
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: T.ink2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (Temur ikkiga bo'lishni unutdi, M1). Qaytishda picked TO'LIQ sbros.
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <FloatTris/>
        <Title node={c.title}/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <TriViz base={6} height={4} cell={28} mode="tri" apexFrac={0.5} showHeight={true} aLabel="6" hLabel="4"/>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(c.reveal))}</p>}
      </div>
    </Stage>
  );
};

// s1 — WARM-UP: 3 ketma-ket savol (✓-fold). Veди-do-vernogo har savolda; javoblangan savol yashil qatorga yig'iladi.
const Screen1 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1; const sfx = useSfx();
  const qs = c.questions;
  const [qi, setQi] = useState(0);            // joriy savol indeksi
  const [wrong, setWrong] = useState(() => new Set()); // joriy savoldagi погашенные variantlar
  const [done, setDone] = useState(false);
  const firstTryRef = useRef(null);
  const attemptsRef = useRef(0);
  const audio = useAudio([{ id: 's1_intro', text: qs[0].audio[lang], trigger: 'on_mount', waits_for: null }]);
  const voice = (text) => { if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(text); }, 300); };
  const pick = (i) => {
    if (done) return;
    if (wrong.has(i)) return;
    const cur = qs[qi];
    const isCorrect = i === cur.correct;
    attemptsRef.current += 1;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    if (isCorrect) {
      sfx.playCorrect();
      if (qi < qs.length - 1) {
        const ni = qi + 1;
        setQi(ni); setWrong(new Set());
        voice(c.audio.on_correct[lang]);
        setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(qs[ni].audio[lang]); }, 1200);
      } else {
        setDone(true);
        voice(`${c.audio.on_correct[lang]} ${c.done_text[lang]}`);
        onAnswer({ stage: null, screenIdx: 1, question: c.title[lang], correctAnswer: 'all', studentAnswer: 'all', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      }
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
      voice(cur.hint[lang]);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const cur = qs[qi];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <FloatTris/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {qs.map((q, qIdx) => (qIdx < qi || (done && qIdx === qs.length - 1)) ? (
            <div key={qIdx} className="mq-done fade-up">
              <span className="mq-done-ic"><IconOk/></span>
              <span>{t(c.done_label)} {qIdx + 1} — {t(c.done_ok)}</span>
            </div>
          ) : null)}
          {!done && (
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.q))}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {cur.opts.map((o, i) => {
                  const isWrongPicked = wrong.has(i);
                  return (
                    <button key={i} className={`option${isWrongPicked ? ' option-picked-wrong' : ''}`} disabled={isWrongPicked} onClick={() => pick(i)}
                      style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="mono small" style={{ minWidth: 20, display: 'flex', justifyContent: 'center', color: isWrongPicked ? T.accent : T.ink3 }}>{isWrongPicked ? <IconNo/> : String.fromCharCode(65 + i)}</span>
                      <span style={{ flex: 1 }}>{mt(t(o))}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <FeedbackBlock show={wrong.size > 0 && !done} isCorrect={false} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}
          </p>
          <p className="body" style={{ margin: 0 }}>{mt(t(cur.hint))}</p>
        </FeedbackBlock>
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION: to'rtburchak diagonal bo'yicha 2 teng uchburchakka bo'linadi (step), TriViz split.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  if (c.bridge && segs[0]) segs[0] = { ...segs[0], text: `${t(c.bridge)} ${segs[0].text}` };
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step_1, c.step_2, c.step_3, c.step_4];
  // phase: 0 -> faqat to'rtburchak; 1 -> diagonal + 2 yarim; 2 -> bitta yarim ajraladi.
  const phases = [0, 1, 1, 2];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <FloatTris/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
          <TriViz base={6} height={4} cell={28} mode="split" phase={phases[step]} grid={true} alive={true} success={step === last}/>
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {steps.map((s, i) => i <= step && (
            <div key={i} className="fade-up" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="mono small" style={{ color: i === step ? T.accent : T.ink3, marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
              <p className="body" style={{ margin: 0, color: i === step ? T.ink : T.ink2, fontWeight: i === step ? 600 : 400 }}>{mt(t(s))}</p>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION: slider asosni o'zgartiradi; uchburchak doim to'rtburchakning yarmi.
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [a, setA] = useState(6);
  const H = 4;
  const rect = a * H;
  const tri = rect / 2;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTris/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <TriViz base={a} height={H} cell={26} mode="tri" apexFrac={0.5} grid={true} showHalf={true} showHeight={true} alive={true} aLabel={String(a)} hLabel="4"/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}</p>
          <Slider value={a} min={3} max={8} step={1} onChange={setA}/>
        </div>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.note_rect)}: <span className="mono" style={{ color: T.ink, fontWeight: 700 }}>{a} × {H} = {rect}</span></p>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{t(c.note_tri)}: <span className="mono" style={{ color: T.success, fontWeight: 700 }}>{rect} : 2 = {tri}</span></p>
        </div>
      </div>
    </Stage>
  );
};

// s4 — RULE 1: S = (asos x balandlik) : 2; balandlik perpendikulyar.
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const segs = makeAudioSegments(c, lang);
  if (c.bridge && segs[0]) segs[0] = { ...segs[0], text: `${t(c.bridge)} ${segs[0].text}` };
  const audio = useAudio(segs);
  const rules = [c.rule_1, c.rule_2, c.rule_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTris/>
        <Bridge node={c.bridge}/>
        <Title node={c.heading}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <TriViz base={6} height={4} cell={26} mode="tri" apexFrac={0.34} showHeight={true} alive={true} aLabel="asos" hLabel="balandlik"/>
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE 2: ikkiga bo'lishni unutmang (M1) + balandlik qiya tomon emas (M2). Xulosa frame-tip da.
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTris/>
        <Title node={c.heading}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_1))}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_2))}</p>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.tip))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST (interaktiv): "Balandlikni top" — perpendikulyar balandlikni tanlash (M2), keyin uchburchak to'rtburchakning yarmi sifatida to'ladi.
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const introText = c.bridge ? `${t(c.bridge)} ${c.audio.intro[lang]}` : c.audio.intro[lang];
  const audio = useAudio([{ id: 's6_intro', text: introText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    attemptsRef.current += 1;
    const ok = i === c.correct;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: c.opts[c.correct][lang], studentAnswer: c.opts[c.correct][lang], correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setWrong(prev => { const n = new Set(prev); n.add(i); return n; }); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <FloatTris/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <TriViz base={6} height={4} cell={26} mode="tri" apexFrac={0.32} showHeight={solved} showHalf={solved} success={solved} compact={true} aLabel="asos"/>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {c.opts.map((o, i) => {
            const isW = wrong.has(i);
            const isC = solved && i === c.correct;
            const collapse = solved && i !== c.correct;
            return (
              <button key={i} className={`option${isC ? ' option-correct' : ''}${isW ? ' option-picked-wrong' : ''}`} disabled={solved || isW} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.5s cubic-bezier(0.33, 0, 0.2, 1)' }}>
                <span className="mono small" style={{ minWidth: 20, display: 'flex', justifyContent: 'center', color: isC ? T.success : (isW ? T.accent : T.ink3) }}>{isC ? '✓' : (isW ? <IconNo/> : String.fromCharCode(65 + i))}</span>
                <span style={{ flex: 1 }}>{mt(t(o))}</span>
              </button>
            );
          })}
        </div>
        {wrong.size > 0 && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative' }}>
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s7 — TEST NumGeo: asos 8 balandlik 5 -> 20.
// s7 — TEST (aralash blok): 4 ta har xil tipdagi savol ketma-ket (MC, o'nlik typed, to'g'ri/noto'g'ri, tartiblash), ✓-buklash + веди-до-верного. Hammasi tap-asosli (mobil+desktop).
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7; const sfx = useSfx();
  const items = c.items;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [qi, setQi] = useState(wasSolved ? items.length : 0);
  const [wrong, setWrong] = useState(() => new Set());        // choice
  const [val, setVal] = useState('');                          // num
  const [numWrong, setNumWrong] = useState(false);
  const [picked, setPicked] = useState([]);                    // order: tanlangan original indekslar ketma-ketligi
  const [orderHint, setOrderHint] = useState(false);
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const allFirstRef = useRef(storedAnswer ? (storedAnswer.correct ?? true) : true);
  const orderCleanRef = useRef(true);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const audio = useAudio([{ id: 's7_q0', text: items[0].audio_q[lang], trigger: 'on_mount', waits_for: null }]);
  const voice = (text) => { if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(text); }, 300); };
  const cur = items[Math.min(qi, items.length - 1)];

  const advance = (firstOk) => {
    if (!firstOk) allFirstRef.current = false;
    const okVoice = cur.audio_ok[lang];
    if (qi < items.length - 1) {
      const ni = qi + 1;
      setQi(ni); setWrong(new Set()); setVal(''); setNumWrong(false); setPicked([]); setOrderHint(false); orderCleanRef.current = true;
      voice(okVoice);
      setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(items[ni].audio_q[lang]); }, 1500);
    } else {
      setDone(true);
      if (firstTryRef.current === null) firstTryRef.current = allFirstRef.current;
      voice(`${okVoice} ${c.done_text[lang]}`);
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: 'all', studentAnswer: 'all', correct: allFirstRef.current, firstTry: allFirstRef.current, attempts: attemptsRef.current, solved: true });
    }
  };
  const pickChoice = (i) => {
    if (done || wrong.has(i)) return;
    attemptsRef.current += 1;
    const firstForItem = wrong.size === 0;
    if (i === cur.correct) { sfx.playCorrect(); advance(firstForItem); }
    else { sfx.playWrong(); setWrong(prev => { const n = new Set(prev); n.add(i); return n; }); voice(cur.hint[lang]); }
  };
  const submitNum = () => {
    if (done) return;
    const norm = parseFloat(String(val).replace(',', '.').replace(/\s/g, ''));
    if (Number.isNaN(norm)) return;
    attemptsRef.current += 1;
    const firstForItem = !numWrong;
    if (Math.abs(norm - cur.answer) < 1e-9) { sfx.playCorrect(); advance(firstForItem); }
    else { sfx.playWrong(); setNumWrong(true); voice(cur.hint[lang]); }
  };
  const numKey = (k) => {
    if (done) return;
    setNumWrong(false);
    if (k === '⌫') setVal(v => v.slice(0, -1));
    else if (k === ',') setVal(v => (v.includes(',') ? v : (v === '' ? '0,' : v + ',')));
    else setVal(v => (v.length < 6 ? v + k : v));
  };
  const tapStep = (oi) => {
    if (done || picked.includes(oi)) return;
    attemptsRef.current += 1;
    if (oi === picked.length) {            // to'g'ri keyingi qadam
      sfx.playCorrect(); setOrderHint(false);
      const np = [...picked, oi]; setPicked(np);
      if (np.length === cur.steps.length) advance(orderCleanRef.current);
    } else { sfx.playWrong(); setOrderHint(true); orderCleanRef.current = false; voice(cur.hint[lang]); }
  };
  const showHint = !done && ((cur.kind === 'choice' && wrong.size > 0) || (cur.kind === 'num' && numWrong) || (cur.kind === 'order' && orderHint));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTris/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) => (i < qi || (done && i === items.length - 1)) ? (
            <div key={`d${i}`} className="mq-done fade-up"><span className="mq-done-ic"><IconOk/></span><span>{t(c.done_label)} {i + 1} — {t(c.done_ok)}</span></div>
          ) : null)}
          {!done && (
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cur.kind === 'choice' && cur.base && <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(8px, 1.8vw, 14px)' }}><TriViz base={cur.base} height={cur.height} cell={22} mode="tri" apexFrac={0.34} showHeight={true} compact={true} aLabel="asos"/></div>}
              <h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.q))}</h2>
              {cur.kind === 'choice' ? (
                <div style={{ display: 'grid', gridTemplateColumns: cur.opts.length > 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 10 }}>
                  {cur.opts.map((o, i) => { const isW = wrong.has(i); return (
                    <button key={i} className={`option${isW ? ' option-picked-wrong' : ''}`} disabled={isW} onClick={() => pickChoice(i)}
                      style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="mono small" style={{ minWidth: 20, display: 'flex', justifyContent: 'center', color: isW ? T.accent : T.ink3 }}>{isW ? <IconNo/> : String.fromCharCode(65 + i)}</span>
                      <span style={{ flex: 1 }}>{mt(t(o))}</span>
                    </button>
                  ); })}
                </div>
              ) : cur.kind === 'num' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                  <div className="numpad-display mono" style={{ color: val ? T.ink : T.ink3 }}>{val || t(c.placeholder)}</div>
                  <div className="numpad">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'].map(k => (
                      <button key={k} className="numpad-key" onClick={() => numKey(k)}>{k}</button>
                    ))}
                  </div>
                  <button className="btn-white-accent" onClick={submitNum} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 3vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cur.shuffle.map((oi, slot) => { const pos = picked.indexOf(oi); const isP = pos >= 0; return (
                    <button key={slot} className={`order-card${isP ? ' order-card-done' : ''}`} disabled={isP} onClick={() => tapStep(oi)}>
                      <span className="order-num">{isP ? pos + 1 : '?'}</span>
                      <span style={{ flex: 1 }}>{mt(t(cur.steps[oi]))}</span>
                      {isP && <IconOk/>}
                    </button>
                  ); })}
                </div>
              )}
            </div>
          )}
        </div>
        {showHint && (
          <div className="frame-tip fade-up" style={{ position: 'relative' }}>
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(cur.hint))}</p>
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s8 — TEST MC: asos 10, balandlik 6 -> 30 (M1: 60, +16, +40).
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <TriViz base={10} height={6} cell={20} mode="tri" apexFrac={0.5} showHeight={true} compact={true} success={solved} showHalf={solved} alive={true} aLabel="10" hLabel="6"/>}/>;
};

// s9 — TEST MC: qaysi hisob NOTO'G'RI (Aziz yarmini olmadi). [FAKT Misr piramidalari]
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [0, 2, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPyramid/>}/>}/>;
};

// s10 — CASE setup: Bekzod uchburchak bayroq tikadi, asos 8, balandlik 6.
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const segs = makeAudioSegments(c, lang);
  if (c.bridge && segs[0]) segs[0] = { ...segs[0], text: `${t(c.bridge)} ${segs[0].text}` };
  const audio = useAudio(segs);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTris/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <TriViz base={8} height={6} cell={24} mode="tri" apexFrac={0.5} showHeight={true} alive={true} aLabel="8 sm" hLabel="6 sm"/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s11 — TEST MC (case): bayroq yuzasi 8x6 -> 24. [FAKT to'rtburchakning yarmi]
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const figure = (solved) => <TriViz base={8} height={6} cell={22} mode="tri" apexFrac={0.5} showHeight={true} compact={true} success={solved} showHalf={solved} alive={true} aLabel="8 sm" hLabel="6 sm"/>;
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_MATH} anim={<AnimHalf/>}/>}/>;
};

// s12 — FINAL MC: uchburchak tom peshtoqi, asos 10, balandlik 4 -> 20. [FAKT 3D mesh IT]
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const figure = (solved) => <TriViz base={10} height={4} cell={20} mode="tri" apexFrac={0.42} showHeight={true} compact={true} success={solved} showHalf={solved} alive={true} aLabel="10 m" hLabel="4 m"/>;
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimMesh/>}/>}/>;
};

// s13 — SUMMARY: hook yopiladi + ConnectionsBlock.
const Screen13 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <FloatTris/>
        <Title node={c.heading}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.hook_close))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

export default function TriangleAreaLesson({
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
/* To'g'ri javob "pop" mikro-animatsiyasi (item 4c) */
.option-correct { animation: optPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@keyframes optPop { 0% { transform: scale(0.96); } 55% { transform: scale(1.03); } 100% { transform: scale(1); } }

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

/* ============================================================ */
/* MATH geom_5_03: TriViz — uchburchak = to'rtburchakning yarmi (SVG, figurada yumshoq shine; aylanuvchi/iz YO'Q). */
/* ============================================================ */
.tv-rect { fill: none; stroke: #A7A6A2; stroke-width: 1.5; stroke-dasharray: 4 3; }
.tv-grid { stroke: rgba(167, 166, 162, 0.4); stroke-width: 1; }
.tv-fill { fill: #FF4F28; fill-opacity: 0.82; stroke: #FF4F28; stroke-width: 2; stroke-linejoin: round; transition: fill 0.3s ease, fill-opacity 0.3s ease; }
.tv-ok .tv-fill { fill: #1F7A4D; stroke: #1F7A4D; }
.tv-half { fill: #019ACB; fill-opacity: 0.16; }
.tv-alive .tv-fill { animation: tvShine 2.8s ease-in-out infinite; }
.tv-fillA { fill: #FF4F28; fill-opacity: 0.82; stroke: #FFFFFF; stroke-width: 1.5; stroke-linejoin: round; }
.tv-fillB { fill: #019ACB; fill-opacity: 0.5; stroke: #FFFFFF; stroke-width: 1.5; stroke-linejoin: round; }
.tv-ok .tv-fillA, .tv-ok .tv-fillA-hi { fill: #1F7A4D; }
.tv-fillA-hi { fill-opacity: 0.92; }
.tv-fillB-dim { fill-opacity: 0.18; }
.tv-alive .tv-fillA { animation: tvShine 2.8s ease-in-out infinite; }
.tv-diag { stroke: #0E0E10; stroke-width: 2; }
.tv-height { stroke: #019ACB; stroke-width: 2; stroke-dasharray: 5 3; }
.tv-rangle { fill: none; stroke: #019ACB; stroke-width: 1.5; }
.tv-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; fill: #5A5A60; }
@keyframes tvShine { 0%, 100% { fill-opacity: 0.82; } 50% { fill-opacity: 1; } }
/* Bridge — slaydlararo ulovchi gap (↳ qator) */
.bridge { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); font-weight: 600; color: #FF4F28; letter-spacing: 0.01em; opacity: 0.92; }
.bridge::before { content: '↳ '; opacity: 0.7; }
/* s7 qadamlarni tartiblash (order) — tap-asosli karta (mobil+desktop) */
.order-card { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; padding: clamp(11px, 1.8vw, 14px) clamp(13px, 2vw, 17px); border-radius: 12px; border: 2px solid rgba(255, 79, 40, 0.28); background: #FFFFFF; color: #3A3530; font-family: 'Manrope', sans-serif; font-size: clamp(13px, 1.7vw, 15px); font-weight: 600; cursor: pointer; transition: border-color 0.18s ease, background 0.18s ease, transform 0.12s ease; }
.order-card:hover:not(:disabled) { border-color: #FF4F28; background: #FFF6F3; }
.order-card:active:not(:disabled) { transform: scale(0.99); }
.order-card-done { border-color: #1F7A4D; background: #EAF6EE; cursor: default; }
.order-num { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; background: rgba(255, 79, 40, 0.12); color: #FF4F28; }
.order-card-done .order-num { background: #1F7A4D; color: #FFFFFF; }
/* s7 raqam-paneli (num) — ekran klaviaturasiz, tap-asosli (mobil+desktop) */
.numpad-display { min-width: 130px; min-height: 46px; padding: 8px 18px; border: 2px solid rgba(58, 53, 48, 0.18); border-radius: 10px; font-size: clamp(20px, 4vw, 26px); font-weight: 700; text-align: center; background: #FFFFFF; }
.numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%; max-width: 280px; }
.numpad-key { padding: clamp(10px, 2.2vw, 14px) 0; border-radius: 10px; border: 1.5px solid rgba(58, 53, 48, 0.14); background: #FFFFFF; color: #3A3530; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 2.8vw, 20px); cursor: pointer; transition: background 0.12s ease, transform 0.1s ease; }
.numpad-key:hover { background: #F4F2EF; }
.numpad-key:active { transform: scale(0.95); background: #FFE9E2; }

/* MATH geom_5_03: fakt-animatsiyalar (CSS-only loop, qutiga sig'adi, aylanuvchi/iz YO'Q). */
/* Misr piramidasi — uchburchak yuz + quyosh pulsi (Tarix). */
.fa-py { width: clamp(78px, 16vw, 110px); height: auto; }
.fa-py-sun { fill: #019ACB; animation: faPySun 2.6s ease-in-out infinite; }
.fa-py-t { fill: #FF4F28; fill-opacity: 0.85; stroke: #FF4F28; stroke-width: 1.5; stroke-linejoin: round; }
.fa-py-h { stroke: #FFFFFF; stroke-width: 1.5; stroke-dasharray: 4 3; }
@keyframes faPySun { 0%, 100% { opacity: 0.45; transform: scale(0.9); transform-origin: 70px 16px; } 50% { opacity: 1; transform: scale(1.1); transform-origin: 70px 16px; } }
/* To'rtburchakning yarmi = uchburchak; B yarmi yumshoq pulslaydi (Matematika). */
.fa-hf { width: clamp(78px, 16vw, 110px); height: auto; }
.fa-hf-r { fill: rgba(1, 154, 203, 0.08); stroke: #A7A6A2; stroke-width: 2; stroke-dasharray: 4 3; }
.fa-hf-a { fill: #FF4F28; fill-opacity: 0.85; }
.fa-hf-b { fill: #019ACB; animation: faHfB 2.4s ease-in-out infinite; }
.fa-hf-d { stroke: #0E0E10; stroke-width: 2; }
@keyframes faHfB { 0%, 100% { fill-opacity: 0.2; } 50% { fill-opacity: 0.6; } }
/* 3D mesh — kichik uchburchaklar to'lqinli yorishadi (IT). */
.fa-ms { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: clamp(66px, 13vw, 92px); height: clamp(66px, 13vw, 92px); }
.fa-ms-t { background: #019ACB; opacity: 0.25; clip-path: polygon(50% 0, 100% 100%, 0 100%); animation: faMs 1.8s ease-in-out infinite; }
.fa-ms-d { clip-path: polygon(0 0, 100% 0, 50% 100%); }
@keyframes faMs { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.95; } }

/* MATH geom_5_03: ambient — suzuvchi mini-uchburchaklar (uchburchak motivi, dekor). */
.ftr { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.ftr-t { position: absolute; clip-path: polygon(50% 0, 100% 100%, 0 100%); background: rgba(255, 79, 40, 0.08); animation: ftrFloat 16s ease-in-out infinite; }
.ftr-c { background: rgba(1, 154, 203, 0.08); }
.ftr-t1 { width: 64px; height: 64px; left: 5%; top: 10%; animation-delay: 0s; }
.ftr-t2 { width: 96px; height: 96px; right: 4%; bottom: 8%; animation-delay: -4s; }
.ftr-t3 { width: 44px; height: 44px; left: 40%; top: 62%; animation-delay: -8s; }
.ftr-t4 { width: 56px; height: 56px; right: 16%; top: 14%; animation-delay: -11s; }
.ftr-t5 { width: 38px; height: 38px; left: 12%; bottom: 14%; animation-delay: -6s; }
.ftr-t6 { width: 72px; height: 72px; left: 64%; top: 44%; animation-delay: -13s; }
@keyframes ftrFloat { 0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); } 33% { transform: translateY(-14px) translateX(8px) rotate(8deg); } 66% { transform: translateY(8px) translateX(-10px) rotate(-6deg); } }
`;
