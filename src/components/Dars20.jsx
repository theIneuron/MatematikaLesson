import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Умножение десятичных дробей — dec_5_05
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
        {titleNode && <Title node={titleNode}/>}
        {/* Заголовок (Title) + текст вопроса остаются и после верного ответа — сворачиваются только неверные варианты. */}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {/* После верного: остаётся только верный вариант, неверные плавно (с задержкой) сворачиваются — keep-visible anti-scroll. */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;        // после верного неверные сворачиваются
            if (solved) {
              if (isCorrect) cls += ' option-correct';
              // неверным НЕ добавляем цвет-класс — плавно гаснут через inline opacity
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
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
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};


// ============================================================
// --- POD UROK: frac_5_12 — Har xil maxrajli kasrlarni ayirish / Вычитание дробей с разными знаменателями ---
// Markaziy misconception: "suratni ham, maxrajni ham ayiradi" (5/6 − 1/3 → 4/3, butundan KATTA — mumkin emas).
// Asosiy usul (frac_5_06 bilan bir xil, ayirishda): umumiy maxraj → ikkala kasrni keltir →
// FAQAT suratlarni ayir, maxrajga tegma. Umumiy maxraj — vizual qidiruv (NOK yo'q, 6-sinf).
// Vizualizator: AreaGrid (olib tashlash) + JuiceJar (hook idishi) + DenomFinder slayder.
// Hook (sodda hayotiy): Farrux sharbat shishasi 5/6 to'la, 1/3 ichdi; ilova 4/3 ko'rsatdi (o'sganmi?).
// Case: Mohira lentadan band yasaydi (3/4 − 1/3 = 5/12). Yangi qahramonlar: Farrux, Mohira, Sherzod.
// Maxsus slaydlar: s5 = 5 ta oson savol (SeqMC); s10 = 6-8 misol oson→qiyin har xil tur (SeqMix) = YAKUNIY.
// Slayd 11 = bitta MC (telefon batareyasi 7/8 − 1/3); slayd 12 = SeqMix (yakuniy, ko'p misol).
// ============================================================
const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'frac_5_12',
  lessonTitle: { ru: 'Вычитание дробей с разными знаменателями', uz: "Har xil maxrajli kasrlarni ayirish" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (spaced retrieval: umumiy maxraj)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (AreaGrid: 1/3 = 2/6)
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 3  (slayder: umumiy maxraj qidiruvi)
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 4
  { id: 's5',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },  // 5  (5 ta oson savol)
  { id: 's6',  type: 'test',        template: 'FracInput',      scored: true,  scope: 'practice' },  // 6
  { id: 's7',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 7  (noto'g'risini top)
  { id: 's8',  type: 'case',        template: 'custom',         scored: false, scope: null },       // 8  (Mohira — masala konteksti)
  { id: 's9',  type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 9
  // POZITSIYA 10 = bitta MC (Screen11, CONTENT.s11) — practice; POZITSIYA 11 = SeqMix (Screen10, CONTENT.s10) — YAKUNIY.
  { id: 's11', type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 10 (bitta misol — telefon batareyasi)
  { id: 's10', type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },     // 11 (6-8 misol oson→qiyin = yakuniy)
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null }         // 12
];

// ============================================================
// CONTENT — ru + uz + audio (audio TTS-toza: belgisiz, sonlar so'z bilan)
// ============================================================
const CONTENT = {
  // s0 — HOOK: Farrux sharbat 5/6 − 1/3, ilova 4/3 ko'rsatdi (o'sganmi?). Ekranda FAQAT sarlavha + anim; qolgan ma'lumot OVOZDA.
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Jumboq" },
    title: { ru: 'В приложении баг: после глотка сока стало больше?', uz: "Ilovada xato: bir qultumdan keyin sharbat ko'paydimi?" },
    lead: { ru: 'Бутылка Фарруха была заполнена на 5/6. Он выпил 1/3 бутылки.', uz: "Farruxning shishasi 5/6 ga to'la edi. U shishaning 1/3 qismini ichdi." },
    opt0: { ru: 'Нет, это ошибка в расчёте', uz: "Yo'q, bu hisobdagi xato" },
    opt1: { ru: 'Да, так может быть', uz: "Ha, shunday bo'lishi mumkin" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Верное чутьё. Сейчас увидим, где именно ошибся расчёт.', uz: "To'g'ri sezgi. Hozir hisob qayerda xato qilganini ko'ramiz." },
    reveal1: { ru: 'Проверим вместе: жидкость не появляется из ниоткуда.', uz: "Birga tekshiramiz: suyuqlik yo'qdan paydo bo'lmaydi." },
    reveal2: { ru: 'Ничего страшного — к концу урока ответишь уверенно.', uz: "Hechqisi yo'q — dars oxirida ishonch bilan javob berasiz." },
    audio: {
      ru: 'Бутылка Фарруха была заполнена на пять шестых. Он выпил одну третью бутылки. Приложение посчитало так. Пять минус один четыре, шесть минус три три, и показало четыре третьих. Но четыре третьих больше целой бутылки. Выходит, после глотка сока стало больше. Как думаешь, так может быть? Выбери ответ.',
      uz: "Farruxning shishasi oltidan besh qismga to'la edi. U shishaning uchdan bir qismini ichdi. Ilova shunday hisobladi. Besh minus bir to'rt, olti minus uch uch, va uchdan to'rtni ko'rsatdi. Lekin uchdan to'rt butun shishadan ko'p. Demak, bir qultumdan keyin sharbat ko'paygan. Sizningcha, shunday bo'lishi mumkinmi? Javobni tanlang."
    }
  },

  // s1 — WARMUP (spaced retrieval): 1/3 = ?/6  (umumiy maxraj, frac_5_06)
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    bridge: { ru: 'Помнишь, как приводят дроби? С этого и начнём.', uz: "Kasrlarni keltirishni eslaysizmi? Shundan boshlaymiz." },
    title: { ru: 'Сначала вспомним приведение к общему знаменателю.', uz: "Avval umumiy maxrajga keltirishni eslaymiz." },
    question: { ru: 'Сколько шестых в одной третьей? 1/3 = ?/6', uz: "Uchdan birda nechta oltidan bor? 1/3 = ?/6" },
    opt0: { ru: '2/6', uz: '2/6' },
    opt1: { ru: '1/6', uz: '1/6' },
    opt2: { ru: '3/6', uz: '3/6' },
    correct_text: { ru: 'Верно. Знаменатель умножили на 2, значит и числитель на 2: 1/3 = 2/6.', uz: "To'g'ri. Maxrajni 2 ga ko'paytirdik, demak suratni ham 2 ga: 1/3 = 2/6." },
    hint_1: { ru: 'Знаменатель вырос с трёх до шести, значит умножили на два. Числитель умножь на то же число.', uz: "Maxraj uchdan oltiga oshdi, demak ikkiga ko'paytirilgan. Suratni ham o'sha songa ko'paytiring." },
    hint_2: { ru: 'Не угадывай числитель. На сколько умножен знаменатель, на столько же умножается числитель.', uz: "Suratni taxmin qilmang. Maxraj nechaga ko'paytirilgan bo'lsa, surat ham o'shanga ko'paytiriladi." },
    wrong_default: { ru: 'Приведи одну третью к шестым: умножь и числитель, и знаменатель на два.', uz: "Uchdan birni oltilarga keltiring: surat va maxrajni ham ikkiga ko'paytiring." },
    audio: {
      intro: { ru: 'Сначала разминка из прошлого урока. Сколько шестых помещается в одной третьей? Выбери ответ.', uz: "Avval o'tgan darsdan mashq. Uchdan birda nechta oltidan joylashadi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Знаменатель умножили на два, поэтому и числитель на два. Одна третья это две шестых.', uz: "To'g'ri. Maxrajni ikkiga ko'paytirdik, shuning uchun suratni ham ikkiga. Uchdan bir bu oltidan ikki." },
      on_wrong: { ru: 'Не совсем. На сколько умножаешь знаменатель, на столько же умножай числитель.', uz: "Unchalik emas. Maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga ko'paytiring." }
    }
  },

  // s2 — EXPLORATION (AreaGrid): nega 5−1 va 6−3 xato; 1/3 = 2/6
  s2: {
    eyebrow: { ru: 'Почему так', uz: "Nega bunday" },
    bridge: { ru: 'Раз 1/3 = 2/6, посмотрим, почему 6 − 3 — это ошибка.', uz: "1/3 = 2/6 ekan, nega 6 − 3 xato ekanini ko'ramiz." },
    title: { ru: 'Почему 6 − 3 — ошибка', uz: "Nega 6 − 3 — bu xato" },
    cap0: { ru: 'Бутылка поделена на 6 равных долей, налито 5. Это 5/6.', uz: "Shisha 6 ta teng ulushga bo'lingan, 5 tasi to'la. Bu 5/6." },
    cap1: { ru: 'Глоток — это 1/3. Трети крупнее шестых, вычитать их напрямую нельзя.', uz: "Qultum — bu 1/3. Uchdan birlar oltidan birlardan yirik, ularni to'g'ridan ayirib bo'lmaydi." },
    cap2: { ru: 'Но 1/3 — это ровно 2/6. Значит, убрать нужно 2 доли из 5.', uz: "Lekin 1/3 — bu roppa rosa 2/6. Demak, 5 ulushdan 2 tasini olib tashlash kerak." },
    cap3: { ru: 'Осталось 3 доли из 6: 5/6 − 2/6 = 3/6. Бутылка не выросла.', uz: "6 dan 3 ulush qoldi: 5/6 − 2/6 = 3/6. Shisha o'smadi." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    audio: {
      ru: [
        'Разберёмся, почему приложение ошиблось. Бутылка поделена на шесть равных долей, налито пять. Это пять шестых. Нажми кнопку дальше.',
        'Глоток это одна третья. Трети крупнее шестых. Доли разного размера, вычитать их напрямую нельзя.',
        'Но одна третья это ровно две шестых. Наложим и проверим. Значит, убрать нужно две доли из пяти.',
        'Осталось три доли из шести. Пять шестых минус две шестых равно три шестых. Бутылка не выросла, всё сходится.'
      ],
      uz: [
        "Ilova nega xato qilganini aniqlaymiz. Shisha olti teng ulushga bo'lingan, beshtasi to'la. Bu oltidan besh. Davom etish tugmasini bosing.",
        "Qultum bu uchdan bir. Uchdan birlar oltidan birlardan yirik. Ulushlar har xil o'lchamda, ularni to'g'ridan to'g'ri ayirib bo'lmaydi.",
        "Lekin uchdan bir bu roppa rosa oltidan ikki. Ustiga qo'yib tekshiramiz. Demak, besh ulushdan ikkitasini olib tashlash kerak.",
        "Oltidan uch ulush qoldi. Oltidan besh minus oltidan ikki teng oltidan uch. Shisha o'smadi, hammasi to'g'ri."
      ]
    }
  },

  // s3 — EXPLORATION (slayder): umumiy maxraj qidiruvi (1/2 va 1/3 uchun)
  s3: {
    eyebrow: { ru: 'Общий знаменатель', uz: "Umumiy maxraj" },
    bridge: { ru: 'А если знаменатели не делятся друг на друга? Поищем общий.', uz: "Maxrajlar bir-biriga bo'linmasa-chi? Umumiysini qidiramiz." },
    title: { ru: 'Найди число долей, на которое ровно лягут и 1/2, и 1/3.', uz: "1/2 ham, 1/3 ham tekis tushadigan ulushlar sonini toping." },
    label_slider: { ru: 'Число долей', uz: "Ulushlar soni" },
    note_fit: { ru: 'Подходит! Делится и на 2, и на 3.', uz: "Mos keldi! Ham 2 ga, ham 3 ga bo'linadi." },
    note_nofit: { ru: 'Не подходит: одна из дробей не ляжет ровно.', uz: "Mos emas: kasrlardan biri tekis tushmaydi." },
    note_small: { ru: 'Это наименьший общий знаменатель — 6.', uz: "Bu eng kichik umumiy maxraj — 6." },
    conclusion: { ru: 'На 6 долях: 1/2 = 3/6, 1/3 = 2/6. Теперь знаменатели одинаковые.', uz: "6 ulushda: 1/2 = 3/6, 1/3 = 2/6. Endi maxrajlar bir xil." },
    audio: {
      intro: { ru: 'Если знаменатели разные, ищем общий. Двигай ползунок и найди число долей, на которое ровно лягут и одна вторая, и одна третья. Самое маленькое подходящее число это шесть.', uz: "Maxrajlar har xil bo'lsa, umumiysini qidiramiz. Slayderni suring va ikkidan bir ham, uchdan bir ham tekis tushadigan ulushlar sonini toping. Eng kichik mos son bu olti." },
      on_fit: { ru: 'Подходит. И половина, и треть ложатся ровно.', uz: "Mos keldi. Yarim ham, uchdan bir ham tekis tushadi." }
    }
  },

  // s4 — RULE: 3 qadam + pale-yellow ogohlantirish + fakt
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Соберём всё в короткое правило из трёх шагов.', uz: "Hammasini uch qadamli qisqa qoidaga yig'amiz." },
    title: { ru: 'Сначала общий знаменатель, потом вычитаем числители.', uz: "Avval umumiy maxraj, keyin suratlarni ayiramiz." },
    step1: { ru: '1. Найди общий знаменатель — число, которое делится на оба знаменателя.', uz: "1. Umumiy maxrajni toping — har ikkala maxrajga bo'linadigan son." },
    step2: { ru: '2. Приведи обе дроби: на сколько умножаешь знаменатель, на столько же — числитель.', uz: "2. Ikkala kasrni keltiring: maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga." },
    step3: { ru: '3. Вычти только числители. Знаменатель оставь прежним.', uz: "3. Faqat suratlarni ayiring. Maxrajni o'zgartirmang." },
    warn: { ru: 'Знаменатель — это размер доли. Его не вычитают.', uz: "Maxraj — bu ulush o'lchami. U ayirilmaydi." },
    fact: { ru: 'Древние египтяне записывали 5/6 как сумму 1/2 и 1/3 — те же числа, что у Фарруха.', uz: "Qadimgi misrliklar 5/6 ni 1/2 va 1/3 yig'indisi shaklida yozishgan — Farruxdagi sonlar." },
    audio: {
      ru: [
        'Запомни правило из трёх шагов. Шаг один. Находим общий знаменатель, число, которое делится на оба знаменателя. Шаг два. Приводим обе дроби. На что умножаешь знаменатель, на то же умножай и числитель. Шаг три. Вычитаем только числители. Знаменатель оставляем прежним, его не вычитаем, ведь это размер доли.',
        'А теперь интересный факт. Древние египтяне четыре тысячи лет назад записывали дробь пять шестых как сумму одной второй и одной третьей. Те же числа, что в задаче Фарруха.'
      ],
      uz: [
        "Uch qadamli qoidani eslab qoling. Birinchi qadam. Umumiy maxrajni topamiz, bu har ikkala maxrajga bo'linadigan son. Ikkinchi qadam. Ikkala kasrni keltiramiz. Maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga ko'paytiring. Uchinchi qadam. Faqat suratlarni ayiramiz. Maxrajni o'zgartirmaymiz, uni ayirmaymiz, chunki bu ulush o'lchami.",
        "Endi qiziqarli fakt. Qadimgi misrliklar to'rt ming yil oldin oltidan besh kasrini ikkidan bir va uchdan bir yig'indisi shaklida yozishgan. Xuddi Farrux masalasidagi sonlar."
      ]
    }
  },

  // s5 — TEST SeqMC: 5 ta OSON savol (to'g'ri javob pozitsiyalari A/C/B/C/B bo'ylab tarqatilgan)
  s5: {
    eyebrow: { ru: 'Разминка · 5 примеров', uz: "Mashq · 5 ta misol" },
    bridge: { ru: 'Правило ясно — закрепим на пяти быстрых примерах.', uz: "Qoida tushunarli — beshta tezkor misolda mustahkamlaymiz." },
    title: { ru: 'Пять быстрых вычитаний', uz: "Beshta tezkor ayirish" },
    lead: { ru: 'Сначала общий знаменатель, потом вычитай числители.', uz: "Avval umumiy maxraj, keyin suratlarni ayiring." },
    questions: [
      { q: { ru: '1/2 − 1/4', uz: '1/2 − 1/4' }, opts: [{ ru: '1/4', uz: '1/4' }, { ru: '1/6', uz: '1/6' }, { ru: '1/2', uz: '1/2' }], correct: 0,
        ok: { ru: 'Верно. 1/2 = 2/4, и 2/4 − 1/4 = 1/4.', uz: "To'g'ri. 1/2 = 2/4, va 2/4 − 1/4 = 1/4." },
        no: { ru: 'Приведи 1/2 к четвёртым, потом вычти числители.', uz: "1/2 ni to'rtlarga keltiring, keyin suratlarni ayiring." },
        say: { ru: 'Одна вторая минус одна четвёртая.', uz: "Ikkidan bir minus to'rtdan bir." } },
      { q: { ru: '1/2 − 1/3', uz: '1/2 − 1/3' }, opts: [{ ru: '1/5', uz: '1/5' }, { ru: '2/5', uz: '2/5' }, { ru: '1/6', uz: '1/6' }], correct: 2,
        ok: { ru: 'Верно. 3/6 − 2/6 = 1/6.', uz: "To'g'ri. 3/6 − 2/6 = 1/6." },
        no: { ru: 'Общий знаменатель 6: 1/2 = 3/6, 1/3 = 2/6. Знаменатели не вычитают.', uz: "Umumiy maxraj 6: 1/2 = 3/6, 1/3 = 2/6. Maxrajlar ayirilmaydi." },
        say: { ru: 'Одна вторая минус одна третья.', uz: "Ikkidan bir minus uchdan bir." } },
      { q: { ru: '2/3 − 1/2', uz: '2/3 − 1/2' }, opts: [{ ru: '1/1', uz: '1/1' }, { ru: '1/6', uz: '1/6' }, { ru: '1/5', uz: '1/5' }], correct: 1,
        ok: { ru: 'Верно. 4/6 − 3/6 = 1/6.', uz: "To'g'ri. 4/6 − 3/6 = 1/6." },
        no: { ru: 'Приведи к шестым: 2/3 = 4/6, 1/2 = 3/6. Потом вычти числители.', uz: "Oltilarga keltiring: 2/3 = 4/6, 1/2 = 3/6. Keyin suratlarni ayiring." },
        say: { ru: 'Две третьих минус одна вторая.', uz: "Uchdan ikki minus ikkidan bir." } },
      { q: { ru: '5/6 − 1/3', uz: '5/6 − 1/3' }, opts: [{ ru: '4/3', uz: '4/3' }, { ru: '4/9', uz: '4/9' }, { ru: '3/6', uz: '3/6' }], correct: 2,
        ok: { ru: 'Верно. 1/3 = 2/6, и 5/6 − 2/6 = 3/6. Это и есть ответ Фарруха.', uz: "To'g'ri. 1/3 = 2/6, va 5/6 − 2/6 = 3/6. Bu Farruxning javobi." },
        no: { ru: 'Не вычитай числители и знаменатели отдельно. Сначала 1/3 = 2/6.', uz: "Surat va maxrajni alohida ayirmang. Avval 1/3 = 2/6." },
        say: { ru: 'Пять шестых минус одна третья.', uz: "Oltidan besh minus uchdan bir." } },
      { q: { ru: '3/4 − 1/6', uz: '3/4 − 1/6' }, opts: [{ ru: '9/12', uz: '9/12' }, { ru: '7/12', uz: '7/12' }, { ru: '2/2', uz: '2/2' }], correct: 1,
        ok: { ru: 'Верно. 9/12 − 2/12 = 7/12.', uz: "To'g'ri. 9/12 − 2/12 = 7/12." },
        no: { ru: 'Общий знаменатель 12: 3/4 = 9/12, 1/6 = 2/12. Не забудь вычесть числители.', uz: "Umumiy maxraj 12: 3/4 = 9/12, 1/6 = 2/12. Suratlarni ayirishni unutmang." },
        say: { ru: 'Три четвёртых минус одна шестая.', uz: "To'rtdan uch minus oltidan bir." } }
    ],
    audio: {
      intro: { ru: 'Разминка. Пять быстрых вычитаний подряд. Сначала одна вторая минус одна четвёртая. Выбери ответ.', uz: "Mashq. Ketma-ket beshta tezkor ayirish. Avval ikkidan bir minus to'rtdan bir. Javobni tanlang." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." },
      on_done: { ru: 'Все пять верно. Числители вычитаются только после общего знаменателя.', uz: "Beshalasi to'g'ri. Suratlar faqat umumiy maxrajdan keyin ayiriladi." }
    }
  },

  // s6 — TEST FracInput: xatoni tuzat, 5/6 − 1/3 = 3/6 (1/2 ham qabul)
  s6: {
    eyebrow: { ru: 'Исправь баг', uz: "Xatoni tuzating" },
    bridge: { ru: 'Теперь сам почини расчёт из загадки.', uz: "Endi jumboqdagi hisobni o'zingiz tuzating." },
    question: { ru: 'Сколько сока на самом деле осталось? 5/6 − 1/3 = ?', uz: "Aslida qancha sharbat qoldi? 5/6 − 1/3 = ?" },
    placeholder: { ru: '0/0', uz: "0/0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Сначала приведи 1/3 к шестым: умножь числитель тоже. Потом вычти числители.', uz: "Avval 1/3 ni oltilarga keltiring: suratni ham ko'paytiring. Keyin suratlarni ayiring." },
    fb_correct: { ru: 'Верно. 1/3 = 2/6, поэтому 5/6 − 2/6 = 3/6 — половина бутылки. Сок не вырос.', uz: "To'g'ri. 1/3 = 2/6, shuning uchun 5/6 − 2/6 = 3/6 — shishaning yarmi. Sharbat o'smadi." },
    audio: {
      intro: { ru: 'Почини расчёт сам. Сколько сока на самом деле осталось? Пять шестых минус одна третья. Введи ответ дробью, например три шестых, и нажми кнопку проверить.', uz: "Hisobni o'zingiz tuzating. Aslida qancha sharbat qoldi? Oltidan besh minus uchdan bir. Javobni kasr shaklida kiriting, masalan oltidan uch, va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Осталась половина бутылки, три шестых. Никакого роста после глотка.', uz: "To'g'ri. Shishaning yarmi qoldi, oltidan uch. Bir qultumdan keyin hech qanday o'sish yo'q." },
      on_wrong: { ru: 'Не совсем. Сначала приведи одну третью к шестым, потом вычитай числители.', uz: "Unchalik emas. Avval uchdan birni oltilarga keltiring, keyin suratlarni ayiring." }
    }
  },

  // s7 — TEST: noto'g'risini top (error-spotting). To'g'ri javob = XATO tenglik (opt0).
  s7: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    bridge: { ru: 'А теперь поймай чужую ошибку — это проверяет понимание.', uz: "Endi birovning xatosini toping — bu tushunishni sinaydi." },
    title: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    question: { ru: 'Какое равенство НЕВЕРНО?', uz: "Qaysi tenglik NOTO'G'RI?" },
    opt0: { ru: '3/4 − 1/2 = 2/2', uz: '3/4 − 1/2 = 2/2' },
    opt1: { ru: '1/2 − 1/4 = 1/4', uz: '1/2 − 1/4 = 1/4' },
    opt2: { ru: '2/3 − 1/6 = 3/6', uz: '2/3 − 1/6 = 3/6' },
    correct_text: { ru: 'Верно — неверно именно это. Здесь вычли и числители, и знаменатели. На самом деле 3/4 − 1/2 = 3/4 − 2/4 = 1/4.', uz: "To'g'ri — aynan shu noto'g'ri. Bu yerda surat ham, maxraj ham ayirilgan. Aslida 3/4 − 1/2 = 3/4 − 2/4 = 1/4." },
    hint_1: { ru: 'Это равенство верное: одна вторая это две четвёртых, и две четвёртых без одной четвёртой дают одну четвёртую.', uz: "Bu tenglik to'g'ri: ikkidan bir bu to'rtdan ikki, to'rtdan ikkidan to'rtdan birni ayirsak to'rtdan bir chiqadi." },
    hint_2: { ru: 'Это равенство верное: две третьих это четыре шестых, и четыре шестых без одной шестой дают три шестых.', uz: "Bu tenglik to'g'ri: uchdan ikki bu oltidan to'rt, oltidan to'rtdan oltidan birni ayirsak oltidan uch chiqadi." },
    wrong_default: { ru: 'Ищи равенство, где знаменатель тоже изменили при вычитании. Так делать нельзя.', uz: "Maxraj ham ayirishda o'zgartirilgan tenglikni qidiring. Bunday qilib bo'lmaydi." },
    audio: {
      intro: { ru: 'Теперь поймай ошибку. Среди трёх равенств одно неверное. Найди, где числители и знаменатели вычли по отдельности. Выбери неверное равенство.', uz: "Endi xatoni toping. Uchta tenglikdan biri noto'g'ri. Surat va maxraj alohida ayirilgan joyni toping. Noto'g'ri tenglikni tanlang." },
      on_correct: { ru: 'Верно. В этом равенстве знаменатель тоже вычли, а так нельзя. Знаменатель остаётся прежним.', uz: "To'g'ri. Bu tenglikda maxraj ham ayirilgan, bunday qilib bo'lmaydi. Maxraj o'zgarmaydi." },
      on_wrong: { ru: 'Это равенство верное. Ищи то, где изменили знаменатель.', uz: "Bu tenglik to'g'ri. Maxraj o'zgartirilganini qidiring." }
    }
  },

  // s8 — CASE intro (Mohira): lenta 3/4 m, 1/3 m band uchun
  s8: {
    eyebrow: { ru: 'Задача · Мохира', uz: "Masala · Mohira" },
    bridge: { ru: 'Правило работает и в жизни. Помоги Мохире с лентой.', uz: "Qoida hayotda ham ishlaydi. Mohiraga lenta bilan yordam bering." },
    title: { ru: 'У Мохиры 3/4 метра ленты.', uz: "Mohirada 3/4 metr lenta bor." },
    body: { ru: 'На один бант уходит 1/3 метра. Сколько ленты останется после одного банта? Сначала прикинь, потом проверим на следующем шаге.', uz: "Bitta bant uchun 1/3 metr ketadi. Bitta bantdan keyin qancha lenta qoladi? Avval chamalang, keyin keyingi qadamda tekshiramiz." },
    hint_card: { ru: 'Знаменатели 4 и 3. Общий знаменатель — 12.', uz: "Maxrajlar 4 va 3. Umumiy maxraj — 12." },
    audio: { ru: 'У Мохиры три четвёртых метра ленты. На один бант уходит одна третья метра. Сколько ленты останется после одного банта? Знаменатели четыре и три, общий знаменатель двенадцать. Прикинь ответ, на следующем шаге проверим.', uz: "Mohirada to'rtdan uch metr lenta bor. Bitta bant uchun uchdan bir metr ketadi. Bitta bantdan keyin qancha lenta qoladi? Maxrajlar to'rt va uch, umumiy maxraj o'n ikki. Javobni chamalang, keyingi qadamda tekshiramiz." }
  },

  // s9 — CASE MC: 3/4 − 1/3 = 5/12 (to'g'ri = opt0; order [1,2,3,0] → D)
  s9: {
    eyebrow: { ru: 'Задача · Мохира', uz: "Masala · Mohira" },
    bridge: { ru: 'Теперь посчитаем точно.', uz: "Endi aniq hisoblaymiz." },
    title: { ru: 'Лента Мохиры', uz: "Mohiraning lentasi" },
    question: { ru: 'Сколько ленты останется? 3/4 − 1/3 = ?', uz: "Qancha lenta qoladi? 3/4 − 1/3 = ?" },
    opt0: { ru: '5/12', uz: '5/12' },
    opt1: { ru: '2/1', uz: '2/1' },
    opt2: { ru: '2/12', uz: '2/12' },
    opt3: { ru: '5/7', uz: '5/7' },
    correct_text: { ru: 'Верно. 3/4 = 9/12, 1/3 = 4/12, и 9/12 − 4/12 = 5/12 метра.', uz: "To'g'ri. 3/4 = 9/12, 1/3 = 4/12, va 9/12 − 4/12 = 5/12 metr." },
    hint_1: { ru: 'Здесь вычли и числители, и знаменатели по отдельности. Сначала приведи обе дроби к двенадцатым.', uz: "Bu yerda surat va maxraj alohida ayirilgan. Avval ikkala kasrni o'n ikkilarga keltiring." },
    hint_2: { ru: 'Похоже, к двенадцатым привёл только одну дробь. Приведи обе.', uz: "Faqat bitta kasr o'n ikkilarga keltirilganga o'xshaydi. Ikkalasini ham keltiring." },
    hint_3: { ru: 'Знаменатель здесь не семь. Общий знаменатель для четвёртых и третьих это двенадцать.', uz: "Maxraj bu yerda yetti emas. To'rtdan va uchdan uchun umumiy maxraj o'n ikki." },
    wrong_default: { ru: 'Приведи обе дроби к двенадцатым, потом вычти только числители.', uz: "Ikkala kasrni o'n ikkilarga keltiring, keyin faqat suratlarni ayiring." },
    fact: { ru: 'Дробную черту ввёл математик Фибоначчи около 1200 года.', uz: "Kasr chizig'ini matematik Fibonachchi taxminan 1200-yilda kiritgan." },
    audio: {
      intro: { ru: 'Теперь точный счёт. Сколько ленты останется? Три четвёртых минус одна третья. Выбери ответ.', uz: "Endi aniq hisob. Qancha lenta qoladi? To'rtdan uch minus uchdan bir. Javobni tanlang." },
      on_correct: { ru: 'Верно. Три четвёртых это девять двенадцатых, одна третья это четыре двенадцатых, остаётся пять двенадцатых метра. Дробную черту ввёл Фибоначчи около тысяча двухсотого года.', uz: "To'g'ri. To'rtdan uch bu o'n ikkidan to'qqiz, uchdan bir bu o'n ikkidan to'rt, o'n ikkidan besh metr qoladi. Kasr chizig'ini Fibonachchi taxminan ming ikki yuzinchi yili kiritgan." },
      on_wrong: { ru: 'Не совсем. Приведи обе дроби к двенадцатым, знаменатель не трогай.', uz: "Unchalik emas. Ikkala kasrni o'n ikkilarga keltiring, maxrajga tegmang." }
    }
  },

  // s10 — YAKUNIY TEST (SeqMix): 8 misol oson→qiyin, har xil tur
  s10: {
    eyebrow: { ru: 'Итоговое · 8 примеров', uz: "Yakuniy · 8 ta misol" },
    bridge: { ru: 'Финал: соберём всё вместе на восьми примерах.', uz: "Final: hammasini sakkizta misolda birlashtiramiz." },
    title: { ru: 'Итог: от лёгкого к трудному', uz: "Yakun: oddiydan qiyinga" },
    lead: { ru: 'Восемь заданий разного типа. Не торопись.', uz: "Sakkizta har xil turdagi topshiriq. Shoshmang." },
    done_text: { ru: 'Все восемь пройдены. Ты уверенно приводишь дроби и вычитаешь числители.', uz: "Sakkizalasi bajarildi. Siz kasrlarni ishonch bilan keltirib, suratlarni ayiryapsiz." },
    items: [
      // 1 — mc oson
      { type: 'mc', prompt: { ru: '1/2 − 1/4 = ?', uz: '1/2 − 1/4 = ?' }, opts: [{ ru: '1/4', uz: '1/4' }, { ru: '1/2', uz: '1/2' }, { ru: '1/6', uz: '1/6' }], correct: 0,
        say: { ru: 'Одна вторая минус одна четвёртая.', uz: "Ikkidan bir minus to'rtdan bir." },
        ok: { ru: '2/4 − 1/4 = 1/4.', uz: "2/4 − 1/4 = 1/4." },
        no: { ru: 'Приведи 1/2 к четвёртым.', uz: "1/2 ni to'rtlarga keltiring." } },
      // 2 — input oson
      { type: 'input', prompt: { ru: '5/6 − 1/2 = ?', uz: '5/6 − 1/2 = ?' }, accept: ['2/6', '1/3'], primary: '2/6',
        say: { ru: 'Пять шестых минус одна вторая. Введи ответ.', uz: "Oltidan besh minus ikkidan bir. Javobni kiriting." },
        ok: { ru: '1/2 = 3/6, и 5/6 − 3/6 = 2/6.', uz: "1/2 = 3/6, va 5/6 − 3/6 = 2/6." },
        no: { ru: 'Приведи 1/2 к шестым, потом вычти числители.', uz: "1/2 ni oltilarga keltiring, keyin suratlarni ayiring." } },
      // 3 — mc (to'g'ri = idx1)
      { type: 'mc', prompt: { ru: '3/4 − 1/2 = ?', uz: '3/4 − 1/2 = ?' }, opts: [{ ru: '2/2', uz: '2/2' }, { ru: '1/4', uz: '1/4' }, { ru: '2/4', uz: '2/4' }], correct: 1,
        say: { ru: 'Три четвёртых минус одна вторая.', uz: "To'rtdan uch minus ikkidan bir." },
        ok: { ru: '3/4 − 2/4 = 1/4.', uz: "3/4 − 2/4 = 1/4." },
        no: { ru: 'Знаменатель не вычитают. 1/2 = 2/4.', uz: "Maxraj ayirilmaydi. 1/2 = 2/4." } },
      // 4 — multiselect: qaysilar 1/3 ga teng
      { type: 'multi', prompt: { ru: 'Какие дроби равны 1/3?', uz: "Qaysi kasrlar 1/3 ga teng?" }, opts: [{ ru: '2/6', uz: '2/6' }, { ru: '3/9', uz: '3/9' }, { ru: '1/2', uz: '1/2' }, { ru: '4/12', uz: '4/12' }], mask: [true, true, false, true],
        say: { ru: 'Выбери все дроби, равные одной третьей.', uz: "Uchdan birga teng barcha kasrlarni tanlang." },
        ok: { ru: '2/6, 3/9 и 4/12 — все это 1/3. Это помогает приводить дроби.', uz: "2/6, 3/9 va 4/12 — hammasi 1/3. Bu kasrlarni keltirishga yordam beradi." },
        no: { ru: 'Дробь равна 1/3, если числитель в 3 раза меньше знаменателя.', uz: "Kasr 1/3 ga teng, agar surat maxrajdan 3 marta kichik bo'lsa." } },
      // 5 — input (hook soni)
      { type: 'input', prompt: { ru: '5/6 − 1/3 = ?', uz: '5/6 − 1/3 = ?' }, accept: ['3/6', '1/2'], primary: '3/6',
        say: { ru: 'Пять шестых минус одна третья. Введи ответ.', uz: "Oltidan besh minus uchdan bir. Javobni kiriting." },
        ok: { ru: '1/3 = 2/6, и 5/6 − 2/6 = 3/6.', uz: "1/3 = 2/6, va 5/6 − 2/6 = 3/6." },
        no: { ru: 'Приведи 1/3 к шестым, числитель тоже умножь.', uz: "1/3 ni oltilarga keltiring, suratni ham ko'paytiring." } },
      // 6 — order: o'sish tartibida
      { type: 'order', prompt: { ru: 'Расставь по возрастанию (от меньшей к большей)', uz: "O'sish tartibida joylashtiring (kichikdan kattaga)" }, vals: [{ ru: '1/6', uz: '1/6' }, { ru: '1/2', uz: '1/2' }, { ru: '1/3', uz: '1/3' }, { ru: '5/6', uz: '5/6' }], correctOrder: [0, 2, 1, 3],
        say: { ru: 'Расставь дроби по возрастанию. Нажимай от самой маленькой.', uz: "Kasrlarni o'sish tartibida joylang. Eng kichigidan boshlab bosing." },
        ok: { ru: 'Верный порядок: 1/6, 1/3, 1/2, 5/6.', uz: "To'g'ri tartib: 1/6, 1/3, 1/2, 5/6." },
        no: { ru: 'Приведи к шестым и сравни числители.', uz: "Oltilarga keltirib, suratlarni solishtiring." } },
      // 7 — input qiyin (12)
      { type: 'input', prompt: { ru: '5/6 − 3/4 = ?', uz: '5/6 − 3/4 = ?' }, accept: ['1/12'], primary: '1/12',
        say: { ru: 'Пять шестых минус три четвёртых. Введи ответ.', uz: "Oltidan besh minus to'rtdan uch. Javobni kiriting." },
        ok: { ru: '10/12 − 9/12 = 1/12.', uz: "10/12 − 9/12 = 1/12." },
        no: { ru: 'Общий знаменатель 12: 5/6 = 10/12, 3/4 = 9/12.', uz: "Umumiy maxraj 12: 5/6 = 10/12, 3/4 = 9/12." } },
      // 8 — mc eng qiyin (24, to'g'ri = idx2)
      { type: 'mc', prompt: { ru: '7/8 − 5/6 = ?', uz: '7/8 − 5/6 = ?' }, opts: [{ ru: '2/2', uz: '2/2' }, { ru: '2/14', uz: '2/14' }, { ru: '1/24', uz: '1/24' }], correct: 2,
        say: { ru: 'Семь восьмых минус пять шестых.', uz: "Sakkizdan yetti minus oltidan besh." },
        ok: { ru: '21/24 − 20/24 = 1/24. Самый трудный — и он сделан.', uz: "21/24 − 20/24 = 1/24. Eng qiyini — u ham bajarildi." },
        no: { ru: 'Общий знаменатель 24: 7/8 = 21/24, 5/6 = 20/24.', uz: "Umumiy maxraj 24: 7/8 = 21/24, 5/6 = 20/24." } }
    ],
    audio: {
      intro: { ru: 'Итоговый тренажёр. Восемь заданий от лёгкого к трудному, форматы разные. Первое: одна вторая минус одна четвёртая.', uz: "Yakuniy trenajyor. Sakkizta topshiriq oddiydan qiyinga, formatlar har xil. Birinchisi: ikkidan bir minus to'rtdan bir." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку и попробуй снова.', uz: "Unchalik emas. Maslahatga qarang va yana urinib ko'ring." },
      on_done: { ru: 'Все восемь пройдены, включая самый трудный. Отличная работа.', uz: "Sakkizalasi, eng qiyini bilan birga, bajarildi. Ajoyib ish." }
    }
  },

  // s11 — TEST MC (practice): telefon batareyasi 7/8 − 1/3 = 13/24 (original kontekst, IT-relatable)
  s11: {
    eyebrow: { ru: 'Задача · батарея', uz: "Masala · batareya" },
    bridge: { ru: 'Та же идея работает и в телефоне.', uz: "Xuddi shu g'oya telefonda ham ishlaydi." },
    title: { ru: 'Заряд телефона', uz: "Telefon zaryadi" },
    question: { ru: 'У Шерзода телефон заряжен на 7/8. Игра съела 1/3 заряда. Сколько осталось? 7/8 − 1/3 = ?', uz: "Sherzodning telefoni 7/8 zaryadlangan. O'yin zaryadning 1/3 ini yedi. Qancha qoldi? 7/8 − 1/3 = ?" },
    opt0: { ru: '13/24', uz: '13/24' },
    opt1: { ru: '6/5', uz: '6/5' },
    opt2: { ru: '21/24', uz: '21/24' },
    opt3: { ru: '13/11', uz: '13/11' },
    correct_text: { ru: 'Верно. 7/8 = 21/24, 1/3 = 8/24, и 21/24 − 8/24 = 13/24 заряда.', uz: "To'g'ri. 7/8 = 21/24, 1/3 = 8/24, va 21/24 − 8/24 = 13/24 zaryad." },
    hint_1: { ru: 'Здесь вычли и числители, и знаменатели по отдельности. Сначала общий знаменатель двадцать четыре.', uz: "Bu yerda surat va maxraj alohida ayirilgan. Avval umumiy maxraj yigirma to'rt." },
    hint_2: { ru: 'Ты привёл семь восьмых к двадцать четвёртым, но забыл вычесть. Убери восемь двадцать четвёртых.', uz: "Sakkizdan yettini yigirma to'rtlarga keltirdingiz, lekin ayirishni unutdingiz. Yigirma to'rtdan sakkizni oling." },
    hint_3: { ru: 'Знаменатель не вычитают. Общий знаменатель здесь двадцать четыре.', uz: "Maxraj ayirilmaydi. Bu yerda umumiy maxraj yigirma to'rt." },
    wrong_default: { ru: 'Приведи обе дроби к двадцать четвёртым, потом вычти только числители.', uz: "Ikkala kasrni yigirma to'rtlarga keltiring, keyin faqat suratlarni ayiring." },
    fact: { ru: 'Компьютер хранит дробь как пару чисел: числитель и знаменатель — отдельно.', uz: "Kompyuter kasrni ikki son juftligi sifatida saqlaydi: surat va maxraj — alohida." },
    audio: {
      intro: { ru: 'У Шерзода телефон заряжен на семь восьмых. Игра съела одну третью заряда. Сколько осталось? Семь восьмых минус одна третья. Выбери ответ.', uz: "Sherzodning telefoni sakkizdan yetti zaryadlangan. O'yin zaryadning uchdan birini yedi. Qancha qoldi? Sakkizdan yetti minus uchdan bir. Javobni tanlang." },
      on_correct: { ru: 'Верно. Общий знаменатель двадцать четыре, семь восьмых это двадцать одна двадцать четвёртая, одна третья это восемь двадцать четвёртых, остаётся тринадцать двадцать четвёртых. Кстати, компьютер хранит дробь как пару чисел, числитель и знаменатель отдельно.', uz: "To'g'ri. Umumiy maxraj yigirma to'rt, sakkizdan yetti bu yigirma to'rtdan yigirma bir, uchdan bir bu yigirma to'rtdan sakkiz, yigirma to'rtdan o'n uch qoladi. Aytmoqchi, kompyuter kasrni ikki son juftligi sifatida saqlaydi, surat va maxraj alohida." },
      on_wrong: { ru: 'Не совсем. Приведи обе дроби к двадцать четвёртым, знаменатель не вычитай.', uz: "Unchalik emas. Ikkala kasrni yigirma to'rtlarga keltiring, maxrajni ayirmang." }
    }
  },

  // s12 — SUMMARY: hookni yopadi + ConnectionsBlock (Dars09-13 kanonik layout)
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    title: { ru: 'Сок не вырос — баг разгадан', uz: "Sharbat o'smadi — xato yechildi" },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "birinchi urinishda to'g'ri javob" },
    hook_label: { ru: 'Ответ на загадку', uz: "Jumboqqa javob" },
    hook_text: { ru: 'У Фарруха было 5/6, он выпил 1/3 = 2/6. Осталось 5/6 − 2/6 = 3/6 — половина. Приложение ошиблось, потому что вычло знаменатели. Так делать нельзя.', uz: "Farruxda 5/6 bor edi, u 1/3 = 2/6 ichdi. 5/6 − 2/6 = 3/6 — yarmi qoldi. Ilova xato qildi, chunki maxrajlarni ayirdi. Bunday qilib bo'lmaydi." },
    main_label: { ru: 'Что запомнить', uz: "Nimani eslab qolish kerak" },
    main_1: { ru: '1. Сначала общий знаменатель, потом вычитаем числители.', uz: "1. Avval umumiy maxraj, keyin suratlarni ayiramiz." },
    main_2: { ru: '2. Знаменатель — размер доли, его не вычитают.', uz: "2. Maxraj — ulush o'lchami, u ayirilmaydi." },
    main_3: { ru: '3. Наименьший общий знаменатель ищем перебором долей.', uz: "3. Eng kichik umumiy maxrajni ulushlarni saralab topamiz." },
    next_note: { ru: 'А наименьший общий знаменатель через НОК и сокращение через НОД — это уже 6 класс.', uz: "Eng kichik umumiy maxrajni EKUK orqali va qisqartirishni EKUB orqali topish — bu 6-sinf." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Сложение дробей с разными знаменателями; вычитание с равными знаменателями.', uz: "Har xil maxrajli kasrlarni qo'shish; teng maxrajli kasrlarni ayirish." },
    conn_label_next: { ru: 'Следующий урок', uz: "Keyingi dars" },
    conn_next: { ru: 'Смешанные числа: сложение и вычитание.', uz: "Aralash sonlar: qo'shish va ayirish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: 'Подведём итог. У Фарруха было пять шестых, он выпил одну третью, это две шестых. Осталось три шестых, ровно половина. Приложение ошиблось, потому что вычло и знаменатели. Запомни. Сначала общий знаменатель, потом вычитаем только числители. Знаменатель не вычитают. Наименьший общий знаменатель ищем перебором долей. А через наибольший общий делитель и наименьшее общее кратное мы научимся в шестом классе.', uz: "Yakun qilamiz. Farruxda oltidan besh bor edi, u uchdan bir ichdi, bu oltidan ikki. Oltidan uch qoldi, roppa rosa yarmi. Ilova xato qildi, chunki maxrajlarni ham ayirdi. Eslab qoling. Avval umumiy maxraj, keyin faqat suratlarni ayiramiz. Maxraj ayirilmaydi. Eng kichik umumiy maxrajni ulushlarni saralab topamiz. eng katta umumiy bo'luvchi va eng kichik umumiy karrali orqali esa oltinchi sinfda o'rganamiz." }
  }
};

// ============================================================
// QAYTA ISHLATILADIGAN YORDAMCHILAR (Dars28 etalonidan aynan)
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const optEl = (t, node) => <span className="body" style={{ display: 'inline' }}>{mt(t(node))}</span>;
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// FAKT-BLOK — ko'k karta (Dars28 etalonidan)
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };
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
// Fakt-animatsiyalar (ko'k tema, CSS-only loop)
const AnimEgypt = () => (
  <div className="pa-st" aria-hidden="true">
    {['1/2', '+', '1/3'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.4}s`, fontSize: '0.7em' }}>{ch}</span>
    ))}
  </div>
);
const AnimBar = () => (
  <div className="fa-hist" aria-hidden="true">
    <span className="fa-hist-r"/><span className="fa-hist-r"/><span className="fa-hist-r"/><span className="fa-hist-r"/><span className="fa-hist-r"/>
  </div>
);
const AnimPair = () => (
  <div className="fa-bit" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => <span key={i} className={`fa-bit-c${i % 4 === 0 ? ' fa-bit-sign' : ''}`} style={{ animationDelay: `${i * 0.16}s` }}/>)}
  </div>
);

// ============================================================
// VIZUALIZATOR — AreaGrid (olib tashlash) + JuiceJar (hook) + FracInputScreen
// ============================================================
// AreaGrid: bitta polosa `total` katakdan. filled — yashil; remove — o'ngdagi N tasi to'q sariq (ayiriladi);
// step 0/1: faqat to'la; step (rm)>=1: ayiriladiganlari sariq; step>=2: ular o'chadi, natija qoladi.
const AreaGrid = ({ total, filled, remove, step }) => {
  const cells = [];
  for (let i = 0; i < total; i++) {
    let cls = 'ag-cell';
    const isFilled = i < filled;
    const isRemove = i >= filled - remove && i < filled;   // to'lalarning o'ng chetidagi `remove` tasi
    if (isFilled) {
      if (step >= 1 && isRemove) cls += (step >= 2 ? ' ag-gone' : ' ag-rm');
      else cls += ' ag-on';
    }
    cells.push(<span key={i} className={cls} style={{ transitionDelay: `${i * 0.04}s` }}/>);
  }
  return <div className="ag-grid" aria-hidden="true">{cells}</div>;
};

// JuiceJar — hook idishi: tepada qopqoq+bo'g'iz, pastda keng tana; suyuqlik PASTDAN yuqoriga 5/6 gacha to'ladi.
// Sharbat ichida UZLUKSIZ ko'tariluvchi pufakchalar (loop) — ekran o'lik bo'lib qolmaydi.
const JuiceJar = () => (
  <div className="jar" aria-hidden="true">
    <span className="jar-cap"/>
    <span className="jar-neck"/>
    <div className="jar-body">
      <div className="jar-fill">
        <span className="jar-bub jar-bub1"/>
        <span className="jar-bub jar-bub2"/>
        <span className="jar-bub jar-bub3"/>
        <span className="jar-bub jar-bub4"/>
      </div>
      {[1, 2, 3, 4, 5].map(i => <span key={i} className="jar-mark" style={{ bottom: `${(i / 6) * 100}%` }}/>)}
    </div>
  </div>
);

// Kasr-kiritish: FracInputScreen — bardoshli tekshiruv (3/6 = 1/2, qiymat bo'yicha)
const fracVal = (s) => {
  const str = String(s).replace(/\s/g, '').replace(',', '.');
  if (str.indexOf('/') >= 0) { const p = str.split('/'); const a = parseFloat(p[0]); const b = parseFloat(p[1]); return (isNaN(a) || isNaN(b) || b === 0) ? NaN : a / b; }
  const v = parseFloat(str); return isNaN(v) ? NaN : v;
};
const FracInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, accepted, primary, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const targets = (accepted || [primary]).map(fracVal);
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [value, setValue] = useState(wasSolved ? (primary || '') : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = fracVal(value); if (isNaN(v)) return;
    const isCorrect = targets.some(tg => Math.abs(v - tg) < 1e-9);
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(value); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: primary, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          // Ovozda: TTS-toza on_wrong (ekrandagi `hint` belgi/kasr bilan bo'lishi mumkin).
          const wrongVoice = (c.audio.on_wrong && c.audio.on_wrong[lang]);
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input type="text" inputMode="text" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(110px, 24vw, 150px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
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
// SeqMC — ketma-ket tez MC. Ovozda: say (intro) + umumiy on_wrong; per-item `no` faqat ekranda.
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const qs = c.questions; const n = qs.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `seq${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const q = qs[idx];
  const solvedItem = picked === q.correct;
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && qs[i].say) e.pushOneOff(qs[i].say[lang]); } };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const pick = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    const isCorrect = i === q.correct;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = isCorrect;
    if (isCorrect) {
      setPicked(i); sfx.playCorrect();
      const cur = firstTryRef.current.slice();
      advanceRef.current = setTimeout(() => {
        if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); sayItem(ni); }
        else finish(cur);
      }, 850);
    } else {
      sfx.playWrong();
      setWrong(prev => { const s = new Set(prev); s.add(i); return s; });
      // Ovozda: umumiy TTS-toza on_wrong (per-item `no` faqat ekranda).
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <div className="dm-prob">{mt(tx(q.q))}</div>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                    {mt(tx(o))}
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? q.ok : q.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMix — ketma-ket aralash turdagi misollar (mc / input / multi / order). Oson→qiyin.
// Ovozda: say (intro) + umumiy on_wrong; per-item `no` faqat ekranda.
// ============================================================
const SeqMix = ({ screen, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `mix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [done, setDone] = useState(wasSolved);
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [wrongShown, setWrongShown] = useState(false);
  const [mcWrong, setMcWrong] = useState(() => new Set());
  const [inputVal, setInputVal] = useState('');
  const [multiSel, setMultiSel] = useState(() => new Set());
  const [orderSeq, setOrderSeq] = useState([]);
  const [orderBad, setOrderBad] = useState(false);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const usedRetryRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null);
  const it = items[idx];

  const advanceIntro = () => { if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); } };
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const finishAll = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const resetItemState = () => { setMcWrong(new Set()); setInputVal(''); setMultiSel(new Set()); setOrderSeq([]); setOrderBad(false); setWrongShown(false); usedRetryRef.current = false; };
  const markFirstTry = (correct) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct && !usedRetryRef.current; };
  const goNext = () => {
    setSolvedItem(true);
    const snap = firstTryRef.current.slice();
    advRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setSolvedItem(false); resetItemState(); sayItem(ni); }
      else finishAll(snap);
    }, 820);
  };
  const onWrong = () => {
    usedRetryRef.current = true; sfx.playWrong(); setWrongShown(true);
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = false;
    // Ovozda: umumiy TTS-toza on_wrong (per-item `no` faqat ekranda).
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
  };
  const pickMc = (i) => {
    if (done || solvedItem || mcWrong.has(i)) return;
    advanceIntro();
    if (i === it.correct) { markFirstTry(true); sfx.playCorrect(); goNext(); }
    else { setMcWrong(prev => { const s = new Set(prev); s.add(i); return s; }); onWrong(); }
  };
  const submitInput = () => {
    if (done || solvedItem) return;
    const v = fracVal(inputVal); if (isNaN(v)) return;
    advanceIntro();
    const ok = it.accept.map(fracVal).some(tg => Math.abs(v - tg) < 1e-9);
    if (ok) { markFirstTry(true); sfx.playCorrect(); goNext(); } else onWrong();
  };
  const toggleMulti = (i) => { if (done || solvedItem) return; setWrongShown(false); setMultiSel(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const submitMulti = () => {
    if (done || solvedItem) return;
    advanceIntro();
    const ok = it.opts.every((_, i) => multiSel.has(i) === !!it.mask[i]);
    if (ok) { markFirstTry(true); sfx.playCorrect(); goNext(); } else onWrong();
  };
  const tapOrder = (i) => {
    if (done || solvedItem || orderSeq.includes(i)) return;
    advanceIntro();
    const pos = orderSeq.length;
    if (it.correctOrder[pos] === i) {
      const seq = [...orderSeq, i]; setOrderSeq(seq); sfx.playCorrect();
      if (seq.length === it.vals.length) { markFirstTry(true); goNext(); }
    } else { setOrderBad(true); if (advRef.current) clearTimeout(advRef.current); advRef.current = setTimeout(() => setOrderBad(false), 450); onWrong(); }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); }, []);

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const typeBadge = { mc: lang === 'uz' ? 'Tanlash' : 'Выбор', input: lang === 'uz' ? 'Yozish' : 'Ввод', multi: lang === 'uz' ? "Bir nechta" : 'Несколько', order: lang === 'uz' ? 'Tartiblash' : 'Порядок' }[it ? it.type : 'mc'];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.1vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(tx(c.done_text))}</p>
          </div>
        ) : (
          <>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mix-tag">{idx + 1}/{n} · {typeBadge}</span>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(tx(it.prompt))}</p>
            </div>

            {it.type === 'mc' && (
              <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  if (solvedItem && i === it.correct) cls += ' option-correct';
                  else if (mcWrong.has(i)) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || mcWrong.has(i)} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}

            {it.type === 'input' && (
              <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <input type="text" inputMode="text" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={inputVal} placeholder="0/0" disabled={solvedItem}
                  onChange={e => { setInputVal(e.target.value); setWrongShown(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(110px, 24vw, 150px)' }}/>
                {!solvedItem && <button className="btn-white-accent" onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
              </div>
            )}

            {it.type === 'multi' && (
              <>
                <div className="ms-grid fade-up delay-1">
                  {it.opts.map((o, i) => {
                    const on = multiSel.has(i);
                    return (
                      <button key={i} className={`ms-card${on ? ' ms-on' : ''}${solvedItem && it.mask[i] ? ' ms-ok' : ''}`} disabled={solvedItem} onClick={() => toggleMulti(i)}>
                        <span className={`ms-box${on || (solvedItem && it.mask[i]) ? ' ms-box-on' : ''}`}>{(on || (solvedItem && it.mask[i])) && <IconOk/>}</span>
                        <span className="ms-pair">{mt(tx(o))}</span>
                      </button>
                    );
                  })}
                </div>
                {!solvedItem && <button className="btn-white-accent fade-up delay-2" onClick={submitMulti} style={{ alignSelf: 'flex-start', padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
              </>
            )}

            {it.type === 'order' && (
              <div className={`od-grid fade-up delay-1${orderBad ? ' od-shake' : ''}`}>
                {it.vals.map((v, i) => {
                  const pos = orderSeq.indexOf(i);
                  const placed = pos >= 0;
                  return (
                    <button key={i} className={`od-card${placed ? ' od-ok' : ''}`} disabled={placed || solvedItem} onClick={() => tapOrder(i)}>
                      {placed && <span className="od-badge">{pos + 1}</span>}
                      <span className="od-temp">{mt(tx(v))}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <FeedbackBlock show={solvedItem || wrongShown} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? it.ok : it.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK. Ekranda FAQAT sarlavha + JuiceJar anim + variantlar; barcha ma'lumot OVOZDA. Qaytishda picked sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        {/* Faqat sarlavha matnda qoladi; qolgan ma'lumot (5/6, 1/3, 4/3 xato) faqat OVOZDA. */}
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.8vw, 22px)' }}>
          <JuiceJar/>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(reveals[picked]))}</p>}
      </div>
    </Stage>
  );
};

// s1 — WARMUP MC: 1/3 = ?/6 (to'g'ri = A)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (AreaGrid): nega 6−3 xato; 1/3 = 2/6
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2; const sfx = useSfx();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's2_intro', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [step, setStep] = useState(0);
  const caps = [c.cap0, c.cap1, c.cap2, c.cap3];
  const last = lines.length - 1;
  const advance = () => {
    if (step >= last) return;
    const ns = step + 1; setStep(ns);
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(lines[ns]); }
  };
  const gridStep = step >= 3 ? 2 : (step >= 2 ? 1 : 0);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={step < last} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)' }}>
          <AreaGrid total={6} filled={5} remove={2} step={gridStep}/>
          <div className="ag-readout">{step >= 3 ? <><Frac n={5} d={6} size="mid"/><Op>−</Op><Frac n={2} d={6} size="mid"/><Op>=</Op><Frac n={3} d={6} size="mid" color={T.success}/></> : (step >= 2 ? <><Frac n={1} d={3} size="mid"/><Op>=</Op><Frac n={2} d={6} size="mid" color={T.accent}/></> : <Frac n={5} d={6} size="mid"/>)}</div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ minHeight: 56 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(caps[Math.min(step, 3)]))}</p>
        </div>
        {step < last && <button className="btn-white-accent fade-up" onClick={advance} disabled={audio.isPlaying && !audio.muted} style={{ alignSelf: 'flex-start', padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (slayder): umumiy maxraj qidiruvi (1/2 va 1/3)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3; const sfx = useSfx();
  const audio = useAudio([{ id: 's3_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [d, setD] = useState(4);
  const [found, setFound] = useState(false);
  const fits = (d % 2 === 0) && (d % 3 === 0);
  const handle = (v) => {
    setD(v);
    if ((v % 2 === 0) && (v % 3 === 0) && !found) {
      setFound(true); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_fit[lang]); }
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!found} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 'clamp(16px, 3vw, 22px)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10 }}>
            <span className="small mono" style={{ color: T.ink2 }}>{t(c.label_slider)}:</span>
            <span className="dm-prob" style={{ fontSize: 'clamp(28px, 6vw, 44px)', color: fits ? T.success : T.ink }}>{d}</span>
          </div>
          <Slider value={d} min={2} max={12} step={1} onChange={handle}/>
          <div className="ag-readout">
            <span className="small mono" style={{ color: fits ? T.success : T.ink3 }}>1/2 → {(d % 2 === 0) ? `${d / 2}/${d}` : '—'}</span>
            <span className="ag-readout-sep"/>
            <span className="small mono" style={{ color: fits ? T.success : T.ink3 }}>1/3 → {(d % 3 === 0) ? `${d / 3}/${d}` : '—'}</span>
          </div>
        </div>
        <div className={`fade-up delay-2 ${fits ? 'frame-success' : 'frame-tip'}`} style={{ minHeight: 52 }}>
          <p className="body" style={{ margin: 0 }}>{fits ? (d === 6 ? mt(t(c.note_small)) : mt(t(c.note_fit))) : mt(t(c.note_nofit))}</p>
        </div>
        {found && <p className="body fade-up" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.conclusion))}</p>}
      </div>
    </Stage>
  );
};

// s4 — RULE: 3 qadam + pale-yellow ogohlantirish + fakt
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's4_intro', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [showFact, setShowFact] = useState(false);
  const revealFact = () => { if (showFact) return; setShowFact(true); if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(lines[1]); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={false} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 14px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(14px, 2.6vw, 18px)' }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.step1))}</p>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.step2))}</p>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.step3))}</p>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn))}</p>
        </div>
        {showFact
          ? <FactCard text={c.fact} badge={FB_HIST} anim={<AnimEgypt/>}/>
          : <button className="btn-ghost fade-up" onClick={revealFact} style={{ alignSelf: 'flex-start', padding: 'clamp(8px, 1.4vw, 10px) clamp(14px, 2vw, 18px)', fontSize: 'clamp(12px, 1.5vw, 13px)', color: T.blue }}>{lang === 'uz' ? "Qiziqarli fakt" : 'Интересный факт'}</button>}
      </div>
    </Stage>
  );
};

// s5 — TEST SeqMC: 5 ta oson savol
const Screen5 = (props) => <SeqMC {...props} screenContent={CONTENT.s5} scored={true}/>;

// s6 — TEST FracInput: 5/6 − 1/3
const Screen6 = (props) => {
  const c = CONTENT.s6;
  return <FracInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} accepted={['3/6', '1/2']} primary={'3/6'}
    renderVisual={({ solved }) => <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><AreaGrid total={6} filled={5} remove={2} step={solved ? 2 : 1}/><div className="dm-prob" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}><Frac n={5} d={6} size="mid"/><Op>−</Op><Frac n={1} d={3} size="mid"/></div></div>}/>;
};

// s7 — TEST: noto'g'risini top (to'g'ri = opt0; order [1,2,0] → C)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — CASE intro (Mohira)
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio([{ id: 's8_intro', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={false} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 3vw, 22px)', padding: 'clamp(16px, 3vw, 22px)' }}>
          <div className="ribbon" aria-hidden="true"><span className="ribbon-bar"/><span className="ribbon-cut"/></div>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.body))}</p>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.hint_card))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s9 — CASE MC: 3/4 − 1/3 = 5/12 (to'g'ri = opt0; order [1,2,3,0] → D)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimBar/>}/>}/>;
};

// YAKUNIY TEST (pozitsiya 11): SeqMix — 8 misol oson→qiyin (scope='final')
const Screen10 = (props) => <SeqMix {...props} screenContent={CONTENT.s10}/>;

// TEST MC (pozitsiya 10, practice): telefon batareyasi 7/8 − 1/3 = 13/24 (to'g'ri = opt0; order [1,0,2,3] → B)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimPair/>}/>}/>;
};

// s12 — SUMMARY (Dars09-13 kanonik): score + hook yopilishi + ConnectionsBlock
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio([{ id: 's12_intro', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const finishedRef = useRef(false);
  useEffect(() => { if (!finishedRef.current) { finishedRef.current = true; finishLesson(); } }, [finishLesson]);
  const scoredTotal = SCREEN_META.filter(s => s.scored).length;
  const correctCount = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const restart = () => { onReset(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-white-accent" onClick={restart} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 14px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ color: T.success, display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "Dars yakunlandi" : 'Урок пройден'}</p>
        <Title node={c.title}/>
        <div className="frame-success fade-up delay-1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="dm-prob" style={{ color: T.success }}>{correctCount} / {scoredTotal}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame-success fade-up delay-1">
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.hook_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.hook_text))}</p>
        </div>
        <div className="fade-up delay-2">
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: T.ink2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.main_1))}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.main_2))}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.main_3))}</p>
          </div>
        </div>
        <p className="small fade-up delay-2" style={{ margin: 0, color: T.ink3, fontStyle: 'italic' }}>{mt(t(c.next_note))}</p>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionSubtractLesson({
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

  // s10 (SeqMix, 8 misol) va s11 (bitta MC) joyi almashtirildi: ko'p misolli SeqMix endi OXIRGI test = yakuniy (final).
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen11, Screen10, Screen12];
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
// CSS — bazaviy qism (Dars28 etalonidan aynan) + frac_5_12 MATH-dumi
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
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4, .lesson-root h5, .lesson-root h6,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }

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

.btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #0E0E10; color: #F6F4EF; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32); }
.btn:hover:not(:disabled) { background: #FF4F28; box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #FF4F28; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12); }
.btn-white-accent:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55); }
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }
.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #0E0E10; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.option:disabled { cursor: default; }
.option-correct { background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(17px, 2.5vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(11px, 2vw, 11px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 12px); padding-bottom: clamp(17px, 3.4vw, 20px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(11px, 2vw, 11px); padding-bottom: clamp(11px, 2vw, 11px); display: flex; gap: 12px; }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

.track-wrap { position: relative; height: 26px; margin: 8px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }

.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }

.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 17px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; }

.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* ambient — yumshoq suzuvchi doiralar (har ekranda) */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }
.has-amb { position: relative; }
.has-amb > :not(.amb) { position: relative; z-index: 1; }

/* fakt-anim (ko'k tema) */
.fa-hist { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.fa-hist-r { width: 8px; background: #019ACB; opacity: 0.3; border-radius: 3px; animation: faHist 2s ease-in-out infinite; }
.fa-hist-r:nth-child(1) { height: 40%; } .fa-hist-r:nth-child(2) { height: 70%; } .fa-hist-r:nth-child(3) { height: 100%; }
.fa-hist-r:nth-child(4) { height: 60%; } .fa-hist-r:nth-child(5) { height: 85%; }
@keyframes faHist { 0%, 100% { opacity: 0.25; } 45% { opacity: 0.95; } }
.fa-bit { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; width: clamp(76px, 15vw, 104px); }
.fa-bit-c { aspect-ratio: 1; background: #019ACB; opacity: 0.22; border-radius: 4px; animation: faBit 1.8s ease-in-out infinite; }
.fa-bit-sign { opacity: 0.5; box-shadow: 0 0 0 2px #019ACB; }
@keyframes faBit { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.92; } }
.pa-st { display: flex; align-items: center; justify-content: center; gap: 4px; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 5vw, 32px); color: #019ACB; }
.pa-st-c { opacity: 0; animation: pa-st-in 2.2s ease-in-out infinite; }
@keyframes pa-st-in { 0% { opacity: 0; transform: translateY(4px); } 20%, 70% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; } }

/* multi-select / order */
.ms-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); }
.ms-card { cursor: pointer; display: flex; align-items: center; gap: clamp(8px, 1.6vw, 12px); border: 1.5px solid #A7A6A2; background: #FFFFFF; border-radius: 14px; padding: clamp(12px, 2.2vw, 16px) clamp(12px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.16s; text-align: left; }
.ms-card:hover:not(:disabled) { border-color: #FF4F28; }
.ms-card:disabled { cursor: default; }
.ms-box { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; border: 1.6px solid #A7A6A2; display: flex; align-items: center; justify-content: center; color: #FFFFFF; transition: all 0.14s; }
.ms-box-on { background: #FF4F28; border-color: #FF4F28; }
.ms-pair { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.6vw, 20px); color: #0E0E10; }
.ms-on { border-color: #FF4F28; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 18px -6px rgba(255, 79, 40, 0.24); }
.ms-ok { border-color: #1F7A4D; box-shadow: 0 0 0 2px #1F7A4D inset, 0 8px 18px -6px rgba(31, 122, 77, 0.26); }
.ms-ok .ms-box-on { background: #1F7A4D; border-color: #1F7A4D; }
.od-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); }
.od-card { position: relative; cursor: pointer; border: 1.5px solid #A7A6A2; background: #FFFFFF; border-radius: 14px; padding: clamp(14px, 2.6vw, 22px) clamp(6px, 1.4vw, 12px); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.16s; }
.od-card:hover:not(:disabled) { border-color: #FF4F28; }
.od-card:disabled { cursor: default; }
.od-temp { font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(18px, 3.8vw, 26px); color: #0E0E10; }
.od-ok { border-color: #1F7A4D; box-shadow: 0 0 0 2px #1F7A4D inset, 0 8px 18px -6px rgba(31, 122, 77, 0.28); }
.od-badge { position: absolute; top: -9px; left: -9px; width: 24px; height: 24px; border-radius: 50%; background: #1F7A4D; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(31, 122, 77, 0.5); }
.od-shake { animation: odShake 0.4s ease; }
@keyframes odShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

.mix-tag { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #FF4F28; background: #FFE8E1; border-radius: 8px; padding: 4px 9px; }

/* ============================================================ */
/* MATH frac_5_12: AreaGrid (olib tashlash) + JuiceJar (hook) + ribbon (case) */
/* ============================================================ */
.ag-grid { display: flex; gap: 5px; width: clamp(200px, 60vw, 340px); }
.ag-cell { flex: 1; aspect-ratio: 1; background: #EEEAE2; border-radius: 5px; transition: background 0.45s ease, opacity 0.45s ease, transform 0.45s ease; }
.ag-on { background: #1F7A4D; }
.ag-rm { background: #FF4F28; }
.ag-gone { background: #EEEAE2; opacity: 0.5; transform: scale(0.9); }
.ag-readout { display: inline-flex; align-items: center; gap: clamp(6px, 1.5vw, 12px); flex-wrap: wrap; justify-content: center; font-family: 'JetBrains Mono', monospace; }
.ag-readout-sep { width: 1px; height: 18px; background: #E4E1DA; }

.jar { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; }
.jar-cap { width: clamp(24px, 5vw, 30px); height: clamp(8px, 1.8vw, 11px); background: #FF4F28; border-radius: 4px 4px 2px 2px; }
.jar-neck { width: clamp(16px, 3.4vw, 20px); height: clamp(10px, 2.2vw, 14px); background: rgba(1, 154, 203, 0.10); border: 2px solid #5A5A60; border-bottom: none; }
.jar-body { position: relative; width: clamp(54px, 12vw, 72px); height: clamp(76px, 17vw, 104px); border: 2px solid #5A5A60; border-radius: 6px 6px 14px 14px; overflow: hidden; background: rgba(1, 154, 203, 0.05); }
.jar-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 0; overflow: hidden; background: linear-gradient(180deg, #FF7A4F, #FF4F28); animation: jarFill 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; }
@keyframes jarFill { from { height: 0; } to { height: 83.3%; } }
/* Uzluksiz ko'tariluvchi pufakchalar (loop) — sharbat tirik ko'rinadi. */
.jar-bub { position: absolute; bottom: 4px; border-radius: 50%; background: rgba(255, 255, 255, 0.55); animation: jarBub 2.8s ease-in infinite; }
.jar-bub1 { left: 28%; width: 6px; height: 6px; animation-delay: 0s; }
.jar-bub2 { left: 56%; width: 5px; height: 5px; animation-delay: 0.8s; }
.jar-bub3 { left: 42%; width: 7px; height: 7px; animation-delay: 1.5s; }
.jar-bub4 { left: 68%; width: 4px; height: 4px; animation-delay: 2.1s; }
@keyframes jarBub { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 0.85; } 80% { opacity: 0.55; } 100% { transform: translateY(-52px); opacity: 0; } }
.jar-mark { position: absolute; left: 0; width: 7px; height: 2px; background: #A7A6A2; z-index: 1; }

.ribbon { flex-shrink: 0; position: relative; width: clamp(80px, 18vw, 110px); height: clamp(40px, 9vw, 54px); display: flex; align-items: center; }
.ribbon-bar { width: 100%; height: 14px; border-radius: 7px; background: linear-gradient(90deg, #FF4F28, #FF7A4F); box-shadow: 0 4px 10px -4px rgba(255, 79, 40, 0.5); }
.ribbon-cut { position: absolute; right: 26%; top: -6px; bottom: -6px; width: 2px; background: #5A5A60; opacity: 0.6; animation: ribbonCut 2.6s ease-in-out infinite; }
@keyframes ribbonCut { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.75; } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .jar-fill { animation: none; height: 83.3%; }
}
`;
