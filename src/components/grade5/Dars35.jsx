import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Площадь прямоугольника и квадрата — geom_5_02
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
        <FloatTiles/>
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
// --- POD UROK: geom_5_02 — To'g'ri to'rtburchak va kvadrat yuzasi / Площадь прямоугольника и квадрата (PROMPT 2026-06-19) ---
// Markaziy misconception M1: yuzani perimetr bilan chalkashtirish (tomonlarni QO'SHADI, ko'paytirish o'rniga).
// M2: faqat ikki tomonni ko'paytirish o'rniga noto'g'ri amal. M3: kvadratda a·a emas, 4·a (perimetr) hisoblash.
// Darslik: yuza = ichidagi birlik kvadratlar soni = a·b; kvadrat yuzasi a·a; o'lcham birligi sm²; yuza ≠ perimetr.
// Hook: yangi qahramon (Akmal) to'g'ri to'rtburchak pol/devorni 1x1 plitkalar bilan qoplaydi, lekin tomonlarni QO'SHADI (= perimetr).
// Vizualizator: TileGrid (to'g'ri to'rtburchak birlik kvadratlar bilan to'ladi/yashilga aylanadi; circling-trace YO'Q).
// Etalon: Dars28 (geom_5_01) — keep-visible QuestionScreen, NumGeoScreen, FloatTiles ambient, FactCard.
// Faktlar (DRAFT): geometriya = yer o'lchash (Tarix) / shaxmat taxtasi katakchalari (Matematika) / ekran piksellari (IT).
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'geom_5_02',
  lessonTitle: { ru: 'Площадь прямоугольника и квадрата', uz: "To'g'ri to'rtburchak va kvadrat yuzasi" }
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
  // ===== s0 HOOK — Akmal to'g'ri to'rtburchak polni plitka bilan qoplaydi, lekin tomonlarni QO'SHADI (= perimetr, M1) =====
  s0: {
    eyebrow: { ru: 'Начало', uz: "Boshlanish" },
    title: { ru: 'Плитка Акмаля', uz: "Akmalning plitkasi" },
    lead: { ru: 'Акмаль выкладывает пол плитками 1 на 1. Пол прямоугольный: 5 и 3. Он сложил 5 + 3 + 5 + 3 и говорит: «нужно 16 плиток». Он прав?', uz: "Akmal polni 1 ga 1 plitkalar bilan qoplayapti. Pol to'g'ri to'rtburchak: 5 va 3. U 5 + 3 + 5 + 3 ni qo'shdi va «16 plitka kerak» deyapti. U haqmi?" },
    opt0: { ru: 'Да, 16 плиток', uz: "Ha, 16 plitka" },
    opt1: { ru: 'Нет, нужно заполнить весь пол', uz: "Yo'q, butun polni to'ldirish kerak" },
    opt2: { ru: 'Не знаю', uz: "Bilmayman" },
    reveal: { ru: 'Плитки покрывают весь пол, а не только его край. Сложение даёт длину границы, а нам нужно, сколько места внутри. Сегодня разберёмся.', uz: "Plitkalar butun polni qoplaydi, faqat chetini emas. Qo'shish chegara uzunligini beradi, bizga esa ichidagi joy kerak. Bugun shuni o'rganamiz." },
    audio: { ru: "Акмаль выкладывает пол плитками один на один. Пол пять на три. Он сложил все стороны и говорит, что нужно шестнадцать плиток. Подумай, плитки покрывают весь пол или только его край?", uz: "Akmal polni bir ga bir plitkalar bilan qoplayapti. Pol besh ga uch. U barcha tomonlarni qo'shdi va o'n olti plitka kerak deyapti. O'ylab ko'ring, plitkalar butun polni qoplaydimi yoki faqat chetinimi?" }
  },

  // ===== s1 WARM-UP — uchta ketma-ket ko'paytma (✓-fold). Veди-do-vernogo har savolda. =====
  s1: {
    eyebrow: { ru: 'Разминка', uz: "Mashq" },
    title: { ru: 'Быстрый счёт', uz: "Tez hisob" },
    lead: { ru: 'Прежде чем считать плитки, разомнёмся. Умножение пригодится для площади.', uz: "Plitkalarni hisoblashdan oldin mashq qilamiz. Ko'paytirish yuza uchun asqotadi." },
    questions: [
      {
        q: { ru: 'Сколько будет 4 × 3?', uz: "4 × 3 nechaga teng?" },
        opts: [{ ru: '12', uz: "12" }, { ru: '7', uz: "7" }, { ru: '14', uz: "14" }, { ru: '9', uz: "9" }],
        correct: 0,
        hint: { ru: 'Это четыре раза по три, то есть три, и три, и три, и три.', uz: "Bu to'rt marta uch, ya'ni uch, va uch, va uch, va uch." },
        audio: { ru: "Сколько будет четыре умножить на три?", uz: "To'rtni uchga ko'paytirsak nechi bo'ladi?" }
      },
      {
        q: { ru: 'Сколько будет 5 × 6?', uz: "5 × 6 nechaga teng?" },
        opts: [{ ru: '11', uz: "11" }, { ru: '25', uz: "25" }, { ru: '30', uz: "30" }, { ru: '35', uz: "35" }],
        correct: 2,
        hint: { ru: 'Возьми шесть пять раз подряд.', uz: "Oltini ketma-ket besh marta oling." },
        audio: { ru: "А сколько будет пять умножить на шесть?", uz: "Beshni oltiga ko'paytirsak nechi bo'ladi?" }
      },
      {
        q: { ru: 'Сколько будет 7 × 2?', uz: "7 × 2 nechaga teng?" },
        opts: [{ ru: '9', uz: "9" }, { ru: '14', uz: "14" }, { ru: '12', uz: "12" }, { ru: '16', uz: "16" }],
        correct: 1,
        hint: { ru: 'Это семь два раза, семь и ещё семь.', uz: "Bu yetti ikki marta, yetti va yana yetti." },
        audio: { ru: "И последнее. Сколько будет семь умножить на два?", uz: "Va oxirgisi. Yettini ikkiga ko'paytirsak nechi bo'ladi?" }
      }
    ],
    done_label: { ru: 'Вопрос', uz: "Savol" },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: { ru: 'Отлично, умножение работает. Теперь идём заполнять фигуры квадратами.', uz: "Zo'r, ko'paytirish ishlayapti. Endi figuralarni kvadratlar bilan to'ldirishga o'tamiz." },
    audio: {
      next: { ru: 'Разомнёмся перед задачами.', uz: "Masalalardan oldin mashq qilamiz." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посчитай ещё раз спокойно.', uz: "Yana bir bor xotirjam hisoblang." }
    }
  },

  // ===== s2 EXPLORATION — qator-qator birlik kvadratlar bilan to'ldirish (step), 5x3 = 15 =====
  s2: {
    eyebrow: { ru: 'Заполняем', uz: "To'ldiramiz" },
    bridge: { ru: 'Счёт работает, теперь заполним прямоугольник рядами.', uz: "Hisob ishladi, endi to'g'ri to'rtburchakni qatorlab to'ldiramiz." },
    title: { ru: 'Заполняем рядами', uz: "Qatorlab to'ldiramiz" },
    lead: { ru: 'Заполним прямоугольник 5 на 3 квадратиками 1 на 1, ряд за рядом.', uz: "5 ga 3 to'g'ri to'rtburchakni 1 ga 1 kvadratchalar bilan qatorlab to'ldiramiz." },
    step_1: { ru: 'Первый ряд: 5 квадратиков. Всего 5.', uz: "Birinchi qator: 5 kvadratcha. Jami 5." },
    step_2: { ru: 'Второй ряд: ещё 5. Всего 10.', uz: "Ikkinchi qator: yana 5. Jami 10." },
    step_3: { ru: 'Третий ряд: ещё 5. Всего 15.', uz: "Uchinchi qator: yana 5. Jami 15." },
    step_4: { ru: 'Три ряда по 5 — это 3 умножить на 5, всего 15 квадратиков. Это площадь.', uz: "5 tadan uch qator — bu 3 ni 5 ga ko'paytirish, jami 15 kvadratcha. Bu yuza." },
    btn_step: { ru: 'Следующий ряд', uz: "Keyingi qator" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Заполним прямоугольник квадратиками один на один, ряд за рядом. В первом ряду пять квадратиков.",
        "Добавим второй ряд, ещё пять, стало десять.",
        "Добавим третий ряд, ещё пять, стало пятнадцать.",
        "Три ряда по пять, это три умножить на пять, пятнадцать квадратиков. Столько места внутри, это и есть площадь."
      ],
      uz: [
        "To'g'ri to'rtburchakni bir ga bir kvadratchalar bilan qatorlab to'ldiramiz. Birinchi qatorda besh kvadratcha.",
        "Ikkinchi qatorni qo'shamiz, yana besh, o'n bo'ldi.",
        "Uchinchi qatorni qo'shamiz, yana besh, o'n besh bo'ldi.",
        "Beshtadan uch qator, bu uchni beshga ko'paytirish, o'n besh kvadratcha. Ichidagi joy shuncha, mana shu yuza."
      ]
    }
  },

  // ===== s3 EXPLORATION — slider: bo'y o'zgaradi; yuza = a*b o'sadi; a=b bo'lsa kvadrat =====
  s3: {
    eyebrow: { ru: 'Стороны', uz: "Tomonlar" },
    title: { ru: 'Площадь растёт', uz: "Yuza o'sadi" },
    lead: { ru: 'Двигай длину и смотри, как растёт число квадратиков внутри — это площадь.', uz: "Bo'yni suring va ichidagi kvadratchalar soni qanday o'sishini ko'ring — bu yuza." },
    slider_label: { ru: 'Длина', uz: "Bo'y" },
    note_rect: { ru: 'Квадратиков внутри столько, сколько даёт длина умножить на ширину.', uz: "Ichidagi kvadratchalar soni bo'yni enga ko'paytirgancha." },
    note_square: { ru: 'Длина равна ширине — получился квадрат!', uz: "Bo'y enga teng — kvadrat hosil bo'ldi!" },
    audio: { ru: "Двигай длину. Чем длиннее прямоугольник, тем больше квадратиков внутри. Их число это длина умножить на ширину, то есть площадь. Когда длина станет равна ширине, получится квадрат.", uz: "Bo'yni suring. To'g'ri to'rtburchak qancha uzun bo'lsa, ichida shuncha ko'p kvadratcha bo'ladi. Ularning soni bo'yni enga ko'paytirgancha, ya'ni yuza. Bo'y enga teng bo'lganda kvadrat hosil bo'ladi." }
  },

  // ===== s4 RULE 1 — yuza = a*b = birlik kvadratlar soni; kvadrat a*a; birlik sm² =====
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Мы заполнили прямоугольник, соберём это в правило.', uz: "To'g'ri to'rtburchakni to'ldirdik, buni qoidaga yig'amiz." },
    heading: { ru: 'Как найти площадь', uz: "Yuzani qanday topamiz" },
    rule_label: { ru: 'Запомни', uz: "Yodda tuting" },
    rule_1: { ru: 'Площадь — это сколько единичных квадратиков помещается внутри фигуры.', uz: "Yuza — figura ichiga nechta birlik kvadrat sig'ishi." },
    rule_2: { ru: 'У прямоугольника: S = a · b, где a и b — длина и ширина. У квадрата: S = a · a.', uz: "To'g'ri to'rtburchakda: S = a · b, bu yerda a va b — bo'y va en. Kvadratda: S = a · a." },
    rule_3: { ru: 'Площадь измеряют в квадратных единицах, например в квадратных сантиметрах, sm².', uz: "Yuza kvadrat birliklarda o'lchanadi, masalan kvadrat santimetrda, sm²." },
    audio: { ru: "Итак, площадь это сколько единичных квадратиков помещается внутри. У прямоугольника берут длину умножить на ширину. У квадрата сторону умножить на ту же сторону. И помни, площадь измеряют в квадратных сантиметрах.", uz: "Demak, yuza ichiga nechta birlik kvadrat sig'ishi. To'g'ri to'rtburchakda bo'yni enga ko'paytiriladi. Kvadratda tomonni o'sha tomonga ko'paytiriladi. Va yodda tuting, yuza kvadrat santimetrda o'lchanadi." }
  },

  // ===== s5 RULE 2 — yuza ≠ perimetr (Akmal shu yerda yanglishgan), xulosa frame-tip da =====
  s5: {
    eyebrow: { ru: 'Внутри, а не вокруг', uz: "Ichida, atrofida emas" },
    heading: { ru: 'Площадь — это не периметр', uz: "Yuza — perimetr emas" },
    rule_1: { ru: 'Площадь — это сколько места внутри. Её находят умножением сторон.', uz: "Yuza — ichidagi joy miqdori. Uni tomonlarni ko'paytirib topadilar." },
    rule_2: { ru: 'Периметр — это длина границы, путь вокруг фигуры. Его складывают.', uz: "Perimetr — chegara uzunligi, figura atrofidagi yo'l. Uni qo'shadilar." },
    tip: { ru: 'Акмалю нужны плитки на весь пол — это площадь, а не периметр.', uz: "Akmalga butun polga plitka kerak — bu yuza, perimetr emas." },
    audio: { ru: "Запомни разницу. Площадь это место внутри, её получают умножением сторон. А периметр это длина границы, его получают сложением. Акмаль сложил стороны и нашёл периметр, но для плиток нужно именно место внутри, то есть площадь.", uz: "Farqni yodda tuting. Yuza ichidagi joy, uni tomonlarni ko'paytirib olamiz. Perimetr esa chegara uzunligi, uni qo'shib olamiz. Akmal tomonlarni qo'shib perimetrni topdi, lekin plitkalar uchun aynan ichidagi joy, ya'ni yuza kerak." }
  },

  // ===== s6 TEST (interaktiv): "Kataklar bilan to'ldir" — to'g'ri to'rtburchak ICHINI qatorlab to'ldirib yuza yig'iladi (Dars35 imzo metodi) =====
  s6: {
    eyebrow: { ru: 'Собери площадь', uz: "Yuzani yig'ing" },
    bridge: { ru: 'Правило знаем, теперь собери площадь сам.', uz: "Qoidani bilamiz, endi yuzani o'zingiz yig'ing." },
    title: { ru: 'Заполни прямоугольник', uz: "To'g'ri to'rtburchakni to'ldiring" },
    lead: { ru: 'Прямоугольник 6 на 4. Нажимай на него — каждое нажатие добавляет ряд квадратиков. Заполни весь и подтверди площадь.', uz: "To'g'ri to'rtburchak 6 ga 4. Uni bosing — har bosish bitta qator kvadratcha qo'shadi. To'liq to'ldirib, yuzani tasdiqlang." },
    fill_label: { ru: 'Заполнено', uz: "To'ldirildi" },
    btn_confirm: { ru: 'Подтвердить площадь', uz: "Yuzani tasdiqlash" },
    hint: { ru: 'Ты заполнил не весь прямоугольник. Площадь — это все квадратики внутри, заполни каждый ряд.', uz: "Butun to'g'ri to'rtburchakni to'ldirmadingiz. Yuza — ichidagi barcha kvadratchalar, har qatorni to'ldiring." },
    correct_text: { ru: 'Верно: 4 ряда по 6 — это 6 · 4 = 24 квадратика. Это и есть площадь.', uz: "To'g'ri: 6 tadan 4 qator — bu 6 · 4 = 24 kvadratcha. Mana shu yuza." },
    audio: {
      intro: { ru: "Нажимай на прямоугольник, каждое нажатие заполняет один ряд квадратиков. Заполни его целиком, считай квадратики, а потом подтверди площадь.", uz: "To'g'ri to'rtburchakni bosing, har bosish bitta qator kvadratchani to'ldiradi. Uni to'liq to'ldiring, kvadratchalarni sanang, keyin yuzani tasdiqlang." },
      on_correct: { ru: "Верно, двадцать четыре. Четыре ряда по шесть квадратиков. Это площадь.", uz: "To'g'ri, yigirma to'rt. Oltitadan to'rt qator kvadratcha. Bu yuza." },
      on_wrong: { ru: "Заполни каждый ряд прямоугольника, а потом подтверди.", uz: "To'g'ri to'rtburchakning har qatorini to'ldiring, keyin tasdiqlang." }
    }
  },

  // ===== s7 TEST (aralash blok): 4 ta har xil tipdagi savol — MC, typed, to'g'ri/noto'g'ri, tasniflash =====
  s7: {
    eyebrow: { ru: 'Разные задачи', uz: "Har xil savollar" },
    title: { ru: 'Четыре разных вопроса', uz: "To'rt xil savol" },
    lead: { ru: 'Четыре задания на площадь — все разного вида. Отвечай по очереди.', uz: "Yuzaga oid to'rt topshiriq — har biri har xil. Navbatma-navbat javob bering." },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    items: [
      { kind: 'choice', cols: 5, rows: 4,
        q: { ru: 'Выбери площадь прямоугольника 5 на 4.', uz: "5 ga 4 to'g'ri to'rtburchak yuzasini tanlang." },
        opts: [{ ru: '20', uz: '20' }, { ru: '18', uz: '18' }, { ru: '9', uz: '9' }, { ru: '16', uz: '16' }], correct: 0,
        hint: { ru: 'Умножь длину на ширину.', uz: "Bo'yni enga ko'paytiring." },
        audio_q: { ru: "Первый вопрос. Выбери площадь прямоугольника пять на четыре.", uz: "Birinchi savol. Besh ga to'rt to'g'ri to'rtburchak yuzasini tanlang." },
        audio_ok: { ru: "Верно, двадцать. Пять умножить на четыре.", uz: "To'g'ri, yigirma. Beshni to'rtga ko'paytirdik." } },
      { kind: 'num', cols: 6, rows: 6, answer: 36,
        q: { ru: 'Квадрат со стороной 6. Посчитай площадь сам.', uz: "Tomoni 6 kvadrat. Yuzasini o'zingiz hisoblang." },
        hint: { ru: 'У квадрата стороны равны. Умножь сторону саму на себя.', uz: "Kvadratning tomonlari teng. Tomonni o'ziga ko'paytiring." },
        audio_q: { ru: "Второй вопрос. У квадрата сторона шесть. Посчитай площадь сам и введи ответ.", uz: "Ikkinchi savol. Kvadrat tomoni olti. Yuzasini o'zingiz hisoblang va javobni kiriting." },
        audio_ok: { ru: "Верно, тридцать шесть. Шесть умножить на шесть.", uz: "To'g'ri, o'ttiz olti. Oltini oltiga ko'paytirdik." } },
      { kind: 'choice',
        q: { ru: 'Верно ли: у квадрата со стороной 5 площадь равна 20?', uz: "To'g'rimi: tomoni 5 kvadratning yuzasi 20?" },
        opts: [{ ru: 'Верно', uz: "To'g'ri" }, { ru: 'Неверно', uz: "Noto'g'ri" }], correct: 1,
        hint: { ru: 'Подумай: 20 — это сумма сторон, периметр. Площадь умножают.', uz: "O'ylab ko'ring: 20 — bu tomonlar yig'indisi, perimetr. Yuzani ko'paytiradilar." },
        audio_q: { ru: "Третий вопрос. Верно ли, что у квадрата со стороной пять площадь равна двадцати?", uz: "Uchinchi savol. Tomoni besh kvadratning yuzasi yigirma, to'g'rimi?" },
        audio_ok: { ru: "Правильно, это неверно. Двадцать это периметр, а площадь равна двадцати пяти.", uz: "To'g'ri javob, bu noto'g'ri. Yigirma — bu perimetr, yuza esa yigirma beshga teng." } },
      { kind: 'sort',
        q: { ru: 'Что находит каждая формула — площадь или периметр?', uz: "Har bir formula nimani topadi — yuzanimi yoki perimetrnimi?" },
        cat_area: { ru: 'Площадь', uz: "Yuza" },
        cat_perim: { ru: 'Периметр', uz: "Perimetr" },
        cards: [
          { label: { ru: 'сторона × сторона', uz: "tomon × tomon" }, cat: 'area' },
          { label: { ru: '2 · (длина + ширина)', uz: "2 · (bo'y + en)" }, cat: 'perim' },
          { label: { ru: 'длина × ширина', uz: "bo'y × en" }, cat: 'area' }
        ],
        hint: { ru: 'Умножение даёт площадь, сложение сторон — периметр.', uz: "Ko'paytirish yuzani beradi, tomonlarni qo'shish — perimetrni." },
        audio_q: { ru: "Четвёртый вопрос. Определи для каждой формулы: она находит площадь или периметр?", uz: "To'rtinchi savol. Har bir formula uchun aniqlang: u yuzani topadimi yoki perimetrni?" },
        audio_ok: { ru: "Верно. Где стороны умножают — это площадь, где складывают — периметр.", uz: "To'g'ri. Tomonlar ko'paytirilsa — yuza, qo'shilsa — perimetr." } }
    ],
    done_label: { ru: 'Вопрос', uz: "Savol" },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: { ru: 'Отлично, ты справился со всеми четырьмя.', uz: "Zo'r, to'rttasini ham yechdingiz." },
    audio: {
      next: { ru: 'Четыре разных задания на площадь.', uz: "Yuzaga oid to'rt xil topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри подсказку и попробуй ещё раз.', uz: "Maslahatni ko'ring va yana urinib ko'ring." }
    }
  },

  // ===== s8 TEST MC — teskari: yuza 24, en 4 -> bo'y 6 (M: 20, 12, 8) =====
  s8: {
    eyebrow: { ru: 'Обратная задача', uz: "Teskari masala" },
    title: { ru: 'Найди сторону', uz: "Tomonni toping" },
    question: { ru: 'Площадь прямоугольника 24, ширина 4. Чему равна длина?', uz: "To'g'ri to'rtburchak yuzasi 24, eni 4. Bo'yi nechaga teng?" },
    opt0: { ru: '6', uz: "6" },
    opt1: { ru: '20', uz: "20" },
    opt2: { ru: '12', uz: "12" },
    opt3: { ru: '8', uz: "8" },
    correct_text: { ru: 'Верно: площадь это длина умножить на ширину, значит длина это 24 поделить на 4, получается 6.', uz: "To'g'ri: yuza bo'yni enga ko'paytirgan, demak bo'y 24 ni 4 ga bo'lgan, ya'ni 6." },
    wrong_1: { ru: 'Ты вычел ширину из площади. Площадь это произведение, значит нужно делить, а не вычитать.', uz: "Siz enni yuzadan ayirdingiz. Yuza ko'paytma, demak bo'lish kerak, ayirish emas." },
    wrong_2: { ru: 'Это половина площади. А длину находят делением площади на ширину.', uz: "Bu yuzaning yarmi. Bo'y esa yuzani enga bo'lib topiladi." },
    wrong_3: { ru: 'Почти, но проверь. Восемь умножить на четыре это тридцать два, а нам нужно двадцать четыре.', uz: "Deyarli, lekin tekshiring. Sakkizni to'rtga ko'paytirsak o'ttiz ikki, bizga esa yigirma to'rt kerak." },
    audio: {
      intro: { ru: "Задача наоборот. Площадь прямоугольника двадцать четыре, ширина четыре. Чему равна длина?", uz: "Teskari masala. To'g'ri to'rtburchak yuzasi yigirma to'rt, eni to'rt. Bo'yi nechaga teng?" },
      on_correct: { ru: "Верно, шесть. Площадь это длина умножить на ширину, значит длину находят делением, двадцать четыре поделить на четыре равно шесть.", uz: "To'g'ri, olti. Yuza bo'yni enga ko'paytirgan, demak bo'y bo'lish bilan topiladi, yigirma to'rtni to'rtga bo'lsak olti bo'ladi." },
      on_wrong: { ru: "Площадь делят на ширину, чтобы найти длину.", uz: "Bo'yni topish uchun yuzani enga bo'ladilar." }
    }
  },

  // ===== s9 TEST MC — qaysi hisob NOTO'G'RI (perimetr hisoblangan) + FactCard FB_HIST (AnimLand) =====
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где ошибка?', uz: "Xato qayerda?" },
    question: { ru: 'Три ученика искали площадь прямоугольника 5 на 3. Кто посчитал НЕправильно?', uz: "Uch o'quvchi 5 ga 3 to'g'ri to'rtburchak yuzasini topdi. Kim NOTO'G'RI hisobladi?" },
    opt0: { ru: 'Диёра: 5 · 3 = 15', uz: "Diyora: 5 · 3 = 15" },
    opt1: { ru: 'Бобур: 5 + 3 + 5 + 3 = 16', uz: "Bobur: 5 + 3 + 5 + 3 = 16" },
    opt2: { ru: 'Санжар: 3 · 5 = 15', uz: "Sanjar: 3 · 5 = 15" },
    correct_text: { ru: 'Верно: Бобур сложил стороны и нашёл периметр, а не площадь. Правильная площадь — 15.', uz: "To'g'ri: Bobur tomonlarni qo'shib perimetrni topdi, yuzani emas. To'g'ri yuza — 15." },
    wrong_0: { ru: 'Диёра взяла 5 умножить на 3 и получила пятнадцать, это верная площадь.', uz: "Diyora 5 ni 3 ga ko'paytirib o'n besh oldi, bu to'g'ri yuza." },
    wrong_2: { ru: 'Санжар взял 3 умножить на 5 и получил пятнадцать, это верная площадь.', uz: "Sanjar 3 ni 5 ga ko'paytirib o'n besh oldi, bu to'g'ri yuza." },
    fact: { ru: 'Само слово «геометрия» значит «измерение земли». В древности так делили поля и считали их площадь.', uz: "«Geometriya» so'zining o'zi «yer o'lchash» degani. Qadimda dalalarni shunday bo'lib, yuzasini hisoblashgan." },
    fact_audio: { ru: "Само слово геометрия значит измерение земли. В древности так делили поля и считали их площадь.", uz: "Geometriya so'zining o'zi yer o'lchash degani. Qadimda dalalarni shunday bo'lib, yuzasini hisoblashgan." },
    audio: {
      intro: { ru: "Три ученика искали площадь прямоугольника пять на три. Найди того, кто посчитал неправильно.", uz: "Uch o'quvchi besh ga uch to'g'ri to'rtburchak yuzasini topdi. Noto'g'ri hisoblaganini toping." },
      on_correct: { ru: "Верно, ошибся Бобур. Он сложил стороны и получил периметр, а площадь это произведение сторон, пятнадцать.", uz: "To'g'ri, Bobur xato qildi. U tomonlarni qo'shib perimetrni topdi, yuza esa tomonlar ko'paytmasi, o'n besh." },
      on_wrong: { ru: "Площадь умножают. Кто сложил стороны, тот нашёл периметр.", uz: "Yuzani ko'paytiradilar. Kim tomonlarni qo'shgan bo'lsa, perimetrni topgan." }
    }
  },

  // ===== s10 CASE setup — Laylo devorni plitka bilan qoplaydi, 8x3 =====
  s10: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    bridge: { ru: 'Задачи решили, перейдём к настоящей стене из плиток.', uz: "Masalalarni yechdik, endi haqiqiy plitkali devorga o'tamiz." },
    title: { ru: 'Стена Лайло', uz: "Layloning devori" },
    lead: { ru: 'Лайло выкладывает плитками прямоугольную стену: 8 и 3. Каждая плитка — это единичный квадрат.', uz: "Laylo to'g'ri to'rtburchak devorni plitka bilan qoplayapti: 8 va 3. Har bir plitka — birlik kvadrat." },
    note: { ru: 'Сколько плиток нужно, чтобы покрыть всю стену?', uz: "Butun devorni qoplash uchun nechta plitka kerak?" },
    hint_calc: { ru: 'Плитки покрывают всё внутри — это площадь. Умножь длину на ширину.', uz: "Plitkalar butun ichni qoplaydi — bu yuza. Bo'yni enga ko'paytiring." },
    btn_help: { ru: 'Решить', uz: "Yechish" },
    audio: { ru: "Лайло выкладывает плитками стену восемь на три. Подумай, плитки покрывают всё внутри, значит их число это площадь.", uz: "Laylo sakkizga uch devorni plitka bilan qoplayapti. O'ylab ko'ring, plitkalar butun ichni qoplaydi, demak ularning soni yuza." }
  },

  // ===== s11 TEST MC (case) — plitkalar soni 8x3 -> 24 + FactCard FB_MATH (AnimChess) =====
  s11: {
    eyebrow: { ru: 'Итоговое задание', uz: "Topshiriq" },
    title: { ru: 'Сколько плиток', uz: "Nechta plitka" },
    question: { ru: 'Стена 8 на 3. Сколько единичных плиток нужно, чтобы её покрыть?', uz: "Devor 8 ga 3. Uni qoplash uchun nechta birlik plitka kerak?" },
    opt0: { ru: '24', uz: "24" },
    opt1: { ru: '22', uz: "22" },
    opt2: { ru: '11', uz: "11" },
    opt3: { ru: '16', uz: "16" },
    correct_text: { ru: 'Верно: 8 · 3 = 24. Внутри помещается 24 единичных квадрата.', uz: "To'g'ri: 8 · 3 = 24. Ichiga 24 birlik kvadrat sig'adi." },
    wrong_1: { ru: 'Это сумма всех сторон, получился периметр стены, а не число плиток внутри.', uz: "Bu barcha tomonlar yig'indisi, devor perimetri chiqdi, ichidagi plitkalar soni emas." },
    wrong_2: { ru: 'Ты сложил две стороны. Для числа плиток стороны умножают.', uz: "Siz ikki tomonni qo'shdingiz. Plitkalar soni uchun tomonlar ko'paytiriladi." },
    wrong_3: { ru: 'Этого не хватит. Умножь 8 на 3.', uz: "Bu yetmaydi. 8 ni 3 ga ko'paytiring." },
    fact: { ru: 'Шахматная доска — это квадрат 8 на 8. Перемножив стороны, получаем 64 клетки, это её площадь в клетках.', uz: "Shaxmat taxtasi — 8 ga 8 kvadrat. Tomonlarni ko'paytirsak 64 katak chiqadi, bu uning kataklardagi yuzasi." },
    fact_audio: { ru: "Шахматная доска это квадрат восемь на восемь. Перемножив стороны, получаем шестьдесят четыре клетки, это её площадь.", uz: "Shaxmat taxtasi sakkizga sakkiz kvadrat. Tomonlarni ko'paytirsak oltmish to'rt katak chiqadi, bu uning yuzasi." },
    audio: {
      intro: { ru: "Стена восемь на три. Сколько единичных плиток нужно, чтобы её покрыть?", uz: "Devor sakkizga uch. Uni qoplash uchun nechta birlik plitka kerak?" },
      on_correct: { ru: "Верно, двадцать четыре. Плитки покрывают всё внутри, восемь умножить на три равно двадцать четыре.", uz: "To'g'ri, yigirma to'rt. Plitkalar butun ichni qoplaydi, sakkizni uchga ko'paytirsak yigirma to'rt bo'ladi." },
      on_wrong: { ru: "Плитки покрывают всё внутри, умножь стороны.", uz: "Plitkalar butun ichni qoplaydi, tomonlarni ko'paytiring." }
    }
  },

  // ===== s12 FINAL MC — kvadrat gilam, tomon 9 -> 81 + FactCard FB_IT (AnimPixels) =====
  s12: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Квадратный ковёр', uz: "Kvadrat gilam" },
    question: { ru: 'Квадратный ковёр, сторона 9. Чему равна его площадь?', uz: "Kvadrat gilam, tomoni 9. Uning yuzasi nechaga teng?" },
    opt0: { ru: '81', uz: "81" },
    opt1: { ru: '36', uz: "36" },
    opt2: { ru: '18', uz: "18" },
    opt3: { ru: '72', uz: "72" },
    correct_text: { ru: 'Верно: у квадрата сторону умножают саму на себя, 9 · 9 = 81.', uz: "To'g'ri: kvadratda tomonni o'ziga ko'paytiriladi, 9 · 9 = 81." },
    wrong_1: { ru: 'Это 4 умножить на 9, получился периметр ковра, а площадь это сторона умножить на сторону.', uz: "Bu 4 ni 9 ga ko'paytirish, gilam perimetri chiqdi, yuza esa tomonni tomonga ko'paytirish." },
    wrong_2: { ru: 'Это две стороны. Для площади сторону умножают на ту же сторону.', uz: "Bu ikki tomon. Yuza uchun tomonni o'sha tomonga ko'paytiriladi." },
    wrong_3: { ru: 'Почти, но проверь. Восемь умножить на девять это семьдесят два, а сторона равна девяти.', uz: "Deyarli, lekin tekshiring. Sakkizni to'qqizga ko'paytirsak yetmish ikki, tomon esa to'qqizga teng." },
    fact: { ru: 'Экран составлен из крошечных квадратиков — пикселей. Перемножив ширину на высоту в пикселях, узнают, сколько их всего.', uz: "Ekran mayda kvadratchalardan, ya'ni piksellardan iborat. Enni bo'yiga piksellarda ko'paytirib, ularning umumiy sonini bilishadi." },
    fact_audio: { ru: "Экран составлен из крошечных квадратиков, пикселей. Перемножив ширину на высоту, узнают, сколько их всего.", uz: "Ekran mayda kvadratchalardan, piksellardan iborat. Enni bo'yiga ko'paytirib, ularning umumiy sonini bilishadi." },
    audio: {
      intro: { ru: "Последнее задание. Квадратный ковёр со стороной девять. Чему равна его площадь?", uz: "Oxirgi topshiriq. Tomoni to'qqiz bo'lgan kvadrat gilam. Uning yuzasi nechaga teng?" },
      on_correct: { ru: "Верно, восемьдесят один. У квадрата сторону умножают на ту же сторону, девять умножить на девять равно восемьдесят один.", uz: "To'g'ri, sakson bir. Kvadratda tomonni o'sha tomonga ko'paytiriladi, to'qqizni to'qqizga ko'paytirsak sakson bir bo'ladi." },
      on_wrong: { ru: "У квадрата сторону умножают саму на себя.", uz: "Kvadratda tomonni o'ziga ko'paytiriladi." }
    }
  },

  // ===== s13 SUMMARY =====
  s13: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Площадь — это место внутри', uz: "Yuza — bu ichidagi joy" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Площадь — сколько единичных квадратов помещается внутри фигуры.', uz: "Yuza — figura ichiga nechta birlik kvadrat sig'ishi." },
    main_2: { ru: 'У прямоугольника S = a · b, у квадрата S = a · a. Измеряют в sm².', uz: "To'g'ri to'rtburchakda S = a · b, kvadratda S = a · a. sm² da o'lchanadi." },
    main_3: { ru: 'Площадь умножают, а периметр — складывают. Это разные вещи.', uz: "Yuzani ko'paytiradilar, perimetrni esa qo'shadilar. Bu ikki xil narsa." },
    hook_close: { ru: 'Теперь ясно: Акмалю нужно не 16, а 15 плиток — это площадь пола, а 16 было бы периметром.', uz: "Endi aniq: Akmalga 16 emas, 15 plitka kerak — bu pol yuzasi, 16 esa perimetr bo'lardi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Умножение, периметр прямоугольника и квадрата.', uz: "Ko'paytirish, to'g'ri to'rtburchak va kvadrat perimetri." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Единицы площади и площадь сложных фигур.', uz: "Yuza birliklari va murakkab figuralar yuzasi." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, площадь это сколько места внутри, число единичных квадратов. У прямоугольника длину умножают на ширину, у квадрата сторону на ту же сторону. И помни, площадь умножают, а периметр складывают.", uz: "Demak, yuza ichidagi joy miqdori, birlik kvadratlar soni. To'g'ri to'rtburchakda bo'yni enga ko'paytiriladi, kvadratda tomonni o'sha tomonga. Va yodda tuting, yuzani ko'paytiradilar, perimetrni qo'shadilar." }
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
// DEKOR — FloatTiles (suzuvchi birlik kvadratchalar, yuza motivi)
// ============================================================
const FloatTiles = () => (
  <div className="flt" aria-hidden="true">
    <span className="flt-c flt-1"/>
    <span className="flt-c flt-2"/>
    <span className="flt-c flt-3"/>
    <span className="flt-c flt-4"/>
    <span className="flt-c flt-5"/>
    <span className="flt-c flt-6"/>
  </div>
);

// ============================================================
// FAKT-ANIMATSIYALAR (ko'k tema, CSS-only loop)
// ============================================================
// Tarix: geometriya = yer o'lchash — dala ustidan o'lchov chizig'i yuradi (CSS loop).
const AnimLand = () => (<div className="fa-ld" aria-hidden="true"><span className="fa-ld-plot"/><span className="fa-ld-scan"/></div>);
// Matematika: shaxmat taxtasi 4x4 — yengil ichki pulse (CSS loop).
const AnimChess = () => (
  <div className="fa-ch" aria-hidden="true">
    {Array.from({ length: 16 }).map((_, i) => {
      const dark = (((i % 4) + Math.floor(i / 4)) % 2) === 0;
      return <span key={i} className={`fa-ch-c${dark ? ' fa-ch-d' : ''}`}/>;
    })}
  </div>
);
// IT: ekran piksellari 4x4 — to'lqinli yorishuv (CSS loop).
const AnimPixels = () => (
  <div className="fa-px" aria-hidden="true">
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} className="fa-px-c" style={{ animationDelay: `${(((i % 4) + Math.floor(i / 4)) * 0.12)}s` }}/>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATOR — TileGrid: to'g'ri to'rtburchak birlik kvadratlar bilan to'ladi (circling-trace YO'Q)
// cols,rows — tomonlar; filled = to'ldirilgan kataklar soni (null = hammasi, row-major);
// unit — o'lcham belgisi; compact — kichik; glow/stagger/success — yoritish va to'g'ri javob.
// ============================================================
const TileGrid = ({ cols = 5, rows = 3, filled = null, unit = '', compact = false, glow = false, stagger = false, success = false, nextRow = null }) => {
  const total = cols * rows;
  const fill = filled === null ? total : filled;
  const big = Math.max(cols, rows);
  const cell = compact ? (big >= 8 ? 16 : 22) : (big >= 8 ? 24 : 32);
  return (
    <div className={`tg-host${glow ? ' tg-glow' : ''}${success ? ' tg-ok' : ''}`} aria-hidden="true">
      {unit !== '' && <span className="tg-dim tg-dim-top">{cols}{unit}</span>}
      {unit !== '' && <span className="tg-dim tg-dim-left">{rows}{unit}</span>}
      <div className="tg-grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridTemplateRows: `repeat(${rows}, ${cell}px)` }}>
        {Array.from({ length: total }).map((_, i) => {
          const on = i < fill;
          const delay = (i % cols) + Math.floor(i / cols);
          const isNext = nextRow !== null && Math.floor(i / cols) === nextRow;
          return <span key={i} className={`tg-cell${on ? ' tg-on' : ''}${on && stagger ? ' tg-pop' : ''}${isNext ? ' tg-next' : ''}`} style={{ animationDelay: on ? `${delay * (stagger ? 0.03 : 0.05)}s` : undefined }}/>;
        })}
      </div>
    </div>
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
        <FloatTiles/>
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

// s0 — HOOK (Akmal plitka, M1: tomonlarni qo'shgan = perimetr). Qaytishda picked TO'LIQ sbros.
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
        <FloatTiles/>
        <Title node={c.title}/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <TileGrid cols={5} rows={3}/>
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

// s1 — WARM-UP: 3 ketma-ket ko'paytma (✓-fold). Veди-do-vernogo har savolda; javoblangan savol yashil qatorga yig'iladi.
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
        <FloatTiles/>
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

// s2 — EXPLORATION: qator-qator birlik kvadratlar bilan to'ldirish, 5x3 = 15.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  if (c.bridge && segs[0]) segs[0] = { ...segs[0], text: `${t(c.bridge)} ${segs[0].text}` };
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step_1, c.step_2, c.step_3, c.step_4];
  const sums = [5, 10, 15, 15];
  const fills = [5, 10, 15, 15];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          <TileGrid cols={5} rows={3} filled={fills[step]} stagger={true} glow={step === last}/>
          <p className="small mono" style={{ margin: 0, color: step === last ? T.success : T.accent }}>{sums[step]}</p>
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

// s3 — EXPLORATION: slider bo'y o'zgaradi; yuza = a*b o'sadi; a=b bo'lsa kvadrat.
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [a, setA] = useState(7);
  const B = 3;
  const isSquare = a === B;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <TileGrid cols={a} rows={B} glow={isSquare}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}</p>
          <Slider value={a} min={3} max={8} step={1} onChange={setA}/>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, fontWeight: 600, color: isSquare ? T.success : T.ink2 }}>{mt(t(isSquare ? c.note_square : c.note_rect))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE 1: yuza = a*b = birlik kvadratlar soni; kvadrat a*a; birlik sm².
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
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <Title node={c.heading}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <TileGrid cols={4} rows={4} compact={true} glow={true}/>
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE 2: yuza ≠ perimetr (Akmal shu yerda yanglishgan). Xulosa frame-tip da.
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
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

// s6 — TEST MC: to'g'ri to'rtburchak 6x4 -> 24 (M1: 20 perimetr, M2: 10, M3: 16).
// s6 — TEST (interaktiv): "Kataklar bilan to'ldir" — o'quvchi to'g'ri to'rtburchak ichini qatorlab to'ldirib yuzani yig'adi.
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const COLS = 6, ROWS = 4, AREA = COLS * ROWS;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [rowsFilled, setRowsFilled] = useState(wasSolved ? ROWS : 0);
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const filledCount = rowsFilled * COLS;
  const introText = c.bridge ? `${t(c.bridge)} ${c.audio.intro[lang]}` : c.audio.intro[lang];
  const audio = useAudio([{ id: 's6_intro', text: introText, trigger: 'on_mount', waits_for: null }]);
  const voice = (text) => { if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(text); }, 300); };
  const tapNext = () => { if (solved || rowsFilled >= ROWS) return; setHint(false); setRowsFilled(v => Math.min(ROWS, v + 1)); };
  const confirm = () => {
    if (solved) return;
    attemptsRef.current += 1;
    const ok = rowsFilled === ROWS;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true); sfx.playCorrect();
      voice(c.audio.on_correct[lang]);
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: String(AREA), studentAnswer: String(filledCount), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setHint(true); voice(c.audio.on_wrong[lang]); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          <button className="areafill-zone" onClick={tapNext} disabled={solved} aria-label={t(c.btn_confirm)}>
            <TileGrid cols={COLS} rows={ROWS} compact={true} filled={solved ? AREA : filledCount} nextRow={solved || rowsFilled >= ROWS ? null : rowsFilled} stagger={solved} success={solved}/>
          </button>
          <p className="mono" style={{ margin: 0, fontSize: 'clamp(15px, 2.4vw, 18px)', fontWeight: 700, color: solved ? T.success : T.accent }}>{t(c.fill_label)}: {solved ? AREA : filledCount} ({rowsFilled}/{ROWS})</p>
        </div>
        {!solved && <button className="btn-white-accent fade-up delay-3" onClick={confirm} style={{ position: 'relative', alignSelf: 'flex-start', padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_confirm)}</button>}
        {hint && !solved && (
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

// s7 — TEST NumGeo: kvadrat tomoni 5 -> 25.
// s7 — TEST (aralash blok): 4 ta har xil tipdagi savol ketma-ket (MC, typed, to'g'ri/noto'g'ri, tasniflash), ✓-buklash + веди-до-верного.
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7; const sfx = useSfx();
  const items = c.items;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [qi, setQi] = useState(wasSolved ? items.length : 0);
  const [wrong, setWrong] = useState(() => new Set());        // choice
  const [val, setVal] = useState('');                          // num
  const [numWrong, setNumWrong] = useState(false);
  const [sortDone, setSortDone] = useState({});                // sort: cardIdx -> cat
  const [sortWrong, setSortWrong] = useState(() => new Set()); // sort: "ci:cat"
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const allFirstRef = useRef(storedAnswer ? (storedAnswer.correct ?? true) : true);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const audio = useAudio([{ id: 's7_q0', text: items[0].audio_q[lang], trigger: 'on_mount', waits_for: null }]);
  const voice = (text) => { if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(text); }, 300); };
  const cur = items[Math.min(qi, items.length - 1)];

  const advance = (firstOk) => {
    if (!firstOk) allFirstRef.current = false;
    const okVoice = cur.audio_ok[lang];
    if (qi < items.length - 1) {
      const ni = qi + 1;
      setQi(ni); setWrong(new Set()); setVal(''); setNumWrong(false); setSortDone({}); setSortWrong(new Set());
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
  const pickCat = (ci, k) => {
    if (done || sortDone[ci]) return;
    attemptsRef.current += 1;
    if (k === cur.cards[ci].cat) {
      sfx.playCorrect();
      const nd = { ...sortDone, [ci]: k };
      setSortDone(nd);
      if (Object.keys(nd).length === cur.cards.length) advance(sortWrong.size === 0);
    } else { sfx.playWrong(); setSortWrong(prev => { const n = new Set(prev); n.add(`${ci}:${k}`); return n; }); voice(cur.hint[lang]); }
  };
  const showHint = !done && ((cur.kind === 'choice' && wrong.size > 0) || (cur.kind === 'num' && numWrong) || (cur.kind === 'sort' && sortWrong.size > 0));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((it, i) => (i < qi || (done && i === items.length - 1)) ? (
            <div key={`d${i}`} className="mq-done fade-up"><span className="mq-done-ic"><IconOk/></span><span>{t(c.done_label)} {i + 1} — {t(c.done_ok)}</span></div>
          ) : null)}
          {!done && (
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cur.kind === 'choice' && cur.cols && <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(8px, 1.8vw, 14px)' }}><TileGrid cols={cur.cols} rows={cur.rows} compact={true}/></div>}
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
                  {cur.cards.map((card, ci) => { const dCat = sortDone[ci]; return (
                    <div key={ci} className="sort-card">
                      <span className="sort-card-label mono">{mt(t(card.label))}</span>
                      {dCat ? (
                        <span className="sort-card-done"><IconOk/> {t(cur[`cat_${card.cat}`])}</span>
                      ) : (
                        <div className="sort-card-btns">
                          {['area', 'perim'].map(k => { const w = sortWrong.has(`${ci}:${k}`); return (
                            <button key={k} className={`sort-btn${w ? ' sort-btn-wrong' : ''}`} disabled={w} onClick={() => pickCat(ci, k)}>{t(cur[`cat_${k}`])}</button>
                          ); })}
                        </div>
                      )}
                    </div>
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

// s8 — TEST MC: teskari masala, yuza 24, en 4 -> bo'y 6.
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <TileGrid cols={6} rows={4} compact={true} filled={solved ? 24 : 0} stagger={solved} success={solved}/>}/>;
};

// s9 — TEST MC: qaysi hisob NOTO'G'RI (Bobur perimetr hisobladi). [FAKT geometriya = yer o'lchash]
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [0, 2, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimLand/>}/>}/>;
};

// s10 — CASE setup: Laylo devorni plitka bilan qoplaydi, 8x3.
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const segs = makeAudioSegments(c, lang);
  if (c.bridge && segs[0]) segs[0] = { ...segs[0], text: `${t(c.bridge)} ${segs[0].text}` };
  const audio = useAudio(segs);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <TileGrid cols={8} rows={3}/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s11 — TEST MC (case): plitkalar soni 8x3 -> 24. [FAKT shaxmat taxtasi]
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const figure = (solved) => <TileGrid cols={8} rows={3} compact={true} filled={solved ? 24 : 0} stagger={solved} success={solved}/>;
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_MATH} anim={<AnimChess/>}/>}/>;
};

// s12 — FINAL MC: kvadrat gilam, tomon 9 -> 81. [FAKT ekran piksellari IT]
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const figure = (solved) => <TileGrid cols={9} rows={9} compact={true} filled={solved ? 81 : 0} stagger={solved} success={solved}/>;
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimPixels/>}/>}/>;
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
        <FloatTiles/>
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

export default function AreaLesson({
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
/* MATH geom_5_02: TileGrid — birlik kvadratlar bilan to'ldirish (CSS pop + uzluksiz breathe loop). */
/* ============================================================ */
.tg-host { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: clamp(14px, 3vw, 24px) clamp(10px, 2.4vw, 18px) clamp(8px, 1.6vw, 12px) clamp(20px, 4vw, 32px); }
.tg-grid { display: grid; gap: 2px; background: #A7A6A2; padding: 2px; border-radius: 4px; animation: tgBreathe 3.6s ease-in-out infinite; }
.tg-glow .tg-grid { animation: tgGlow 0.9s ease, tgBreathe 3.6s ease-in-out infinite; }
.tg-cell { background: #FFFFFF; border-radius: 2px; transition: background 0.3s ease, box-shadow 0.3s ease; }
.tg-on { background: #FF4F28; box-shadow: 0 0 6px rgba(255, 79, 40, 0.45); animation: tgPop 0.3s ease both; }
.tg-pop { transform-origin: center; animation: tgPop 0.4s ease-out both; }
.tg-ok .tg-on { background: #1F7A4D; box-shadow: 0 0 6px rgba(31, 122, 77, 0.45); }
/* s6 interaktiv: butun figura bitta katta tap-zona (mobil-do'st); keyingi to'ladigan qator pulslaydi */
.areafill-zone { border: none; background: none; padding: 4px; cursor: pointer; appearance: none; -webkit-appearance: none; border-radius: 10px; transition: transform 0.12s ease; }
.areafill-zone:active:not(:disabled) { transform: scale(0.98); }
.tg-next { animation: tgNext 1.4s ease-in-out infinite; }
@keyframes tgNext { 0%, 100% { box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.3); } 50% { box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.8); } }
/* Bridge — slaydlararo ulovchi gap (↳ qator) */
.bridge { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); font-weight: 600; color: #FF4F28; letter-spacing: 0.01em; opacity: 0.92; }
.bridge::before { content: '↳ '; opacity: 0.7; }
/* s7 tasniflash (sort) — karta + 2 katta toifa tugmasi (mobil-do'st) */
.sort-card { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #FFFFFF; border: 1.5px solid rgba(58, 53, 48, 0.12); border-radius: 12px; padding: clamp(10px, 1.8vw, 14px) clamp(12px, 2vw, 16px); }
.sort-card-label { font-size: clamp(14px, 2vw, 17px); font-weight: 700; color: #3A3530; }
.sort-card-btns { display: flex; gap: 8px; }
.sort-btn { padding: clamp(9px, 1.5vw, 11px) clamp(14px, 2.2vw, 20px); border-radius: 10px; border: 2px solid rgba(1, 154, 203, 0.35); background: #FFFFFF; color: #019ACB; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.6vw, 14px); cursor: pointer; transition: border-color 0.18s ease, background 0.18s ease, opacity 0.18s ease; }
.sort-btn:hover:not(:disabled) { border-color: #019ACB; background: #EAF6FB; }
.sort-btn-wrong { opacity: 0.4; border-color: #FF4F28; color: #FF4F28; cursor: default; }
.sort-card-done { display: inline-flex; align-items: center; gap: 6px; color: #1F7A4D; font-weight: 700; font-size: clamp(13px, 1.8vw, 15px); }
/* s7 raqam-paneli (num) — ekran klaviaturasiz, tap-asosli (mobil+desktop) */
.numpad-display { min-width: 130px; min-height: 46px; padding: 8px 18px; border: 2px solid rgba(58, 53, 48, 0.18); border-radius: 10px; font-size: clamp(20px, 4vw, 26px); font-weight: 700; text-align: center; background: #FFFFFF; }
.numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%; max-width: 280px; }
.numpad-key { padding: clamp(10px, 2.2vw, 14px) 0; border-radius: 10px; border: 1.5px solid rgba(58, 53, 48, 0.14); background: #FFFFFF; color: #3A3530; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 2.8vw, 20px); cursor: pointer; transition: background 0.12s ease, transform 0.1s ease; }
.numpad-key:hover { background: #F4F2EF; }
.numpad-key:active { transform: scale(0.95); background: #FFE9E2; }
@keyframes tgPop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes tgBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 12px rgba(255, 79, 40, 0.14); } }
@keyframes tgGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 14px rgba(255, 79, 40, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }
.tg-dim { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 2vw, 14px); color: #5A5A60; white-space: nowrap; }
.tg-dim-top { top: 0; left: 50%; transform: translateX(-50%); }
.tg-dim-left { left: 0; top: 50%; transform: translateY(-50%); }

/* MATH geom_5_02: факт-анимации (CSS-only loop, ko'k/yashil tema, qutiga sig'adi). */
/* Geometriya = "yer o'lchash" — dala ustidan o'lchov chizig'i yuradi (Tarix). */
.fa-ld { position: relative; width: clamp(72px, 15vw, 100px); height: clamp(54px, 11vw, 76px); }
.fa-ld-plot { position: absolute; inset: 0; background: rgba(1, 154, 203, 0.12); border: 3px solid #019ACB; border-radius: 4px; }
.fa-ld-scan { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: #1F7A4D; box-shadow: 0 0 8px rgba(31, 122, 77, 0.55); animation: faLd 2.6s ease-in-out infinite; }
@keyframes faLd { 0% { top: 0; } 50% { top: calc(100% - 3px); } 100% { top: 0; } }
/* Shaxmat taxtasi 4x4 — yengil ichki pulse (Matematika). */
.fa-ch { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); width: clamp(60px, 12vw, 82px); height: clamp(60px, 12vw, 82px); border: 2px solid #019ACB; border-radius: 3px; overflow: hidden; animation: faChPulse 3s ease-in-out infinite; }
.fa-ch-c { background: #EAF6FB; }
.fa-ch-d { background: #019ACB; }
@keyframes faChPulse { 0%, 100% { box-shadow: inset 0 0 0 rgba(1, 154, 203, 0); } 50% { box-shadow: inset 0 0 14px rgba(1, 154, 203, 0.45); } }
/* Ekran piksellari 4x4 — to'lqinli yorishuv (IT). */
.fa-px { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); gap: 3px; width: clamp(58px, 12vw, 82px); height: clamp(58px, 12vw, 82px); }
.fa-px-c { background: #019ACB; border-radius: 2px; opacity: 0.22; animation: faPx 1.8s ease-in-out infinite; }
@keyframes faPx { 0%, 100% { opacity: 0.18; } 50% { opacity: 1; } }

/* MATH geom_5_02: flt — dekorativ suzuvchi birlik kvadratchalar (yuza mavzusi, sekin, yengil). */
.flt { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.flt-c { position: absolute; width: 18px; height: 18px; border-radius: 4px; opacity: 0.5; background: linear-gradient(135deg, rgba(255, 79, 40, 0.22), rgba(255, 79, 40, 0.06)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.18); animation: fltFloat 16s ease-in-out infinite; }
.flt-1 { left: 7%; top: 16%; animation-delay: 0s; }
.flt-2 { right: 9%; top: 22%; width: 13px; height: 13px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.22), rgba(1, 154, 203, 0.06)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.18); animation-delay: -6s; }
.flt-3 { left: 14%; bottom: 14%; width: 14px; height: 14px; animation-delay: -10s; }
.flt-4 { right: 13%; bottom: 20%; width: 20px; height: 20px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.2), rgba(1, 154, 203, 0.05)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.16); animation-delay: -3s; }
.flt-5 { left: 30%; top: 8%; width: 12px; height: 12px; animation-delay: -13s; }
.flt-6 { right: 32%; bottom: 9%; width: 15px; height: 15px; background: linear-gradient(135deg, rgba(255, 79, 40, 0.18), rgba(255, 79, 40, 0.05)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.15); animation-delay: -8s; }
@keyframes fltFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.45; } 50% { transform: translateY(-14px) rotate(6deg); opacity: 0.75; } }
`;
