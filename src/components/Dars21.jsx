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
// --- POD UROK: frac_5_13 — To'g'ri, noto'g'ri va aralash sonlar / Правильные, неправильные, смешанные числа ---
// Markaziy misconception 1: "surat maxrajdan katta bo'lolmaydi" (9/4 = xato). YO'Q — bu noto'g'ri kasr.
// Markaziy misconception 2: "aralash son = butun KO'PAYTIRILGAN kasr". YO'Q — bu butun + kasr YIG'INDISI.
// Asosiy usul: noto'g'ri kasr -> aralash son: suratni maxrajga BO'L (qoldiq bilan); butun = bo'linma, qoldiq = yangi surat.
// Vizualizator: FillWholes (to'lib-toshuvchi butun-qutilar) + NumLine (sonlar nuriga joylash) + dnd (sudrash).
// Hook (sodda hayotiy): Madina non yopdi (har non 4 bo'lak), 9 bo'lak = 9/4; do'sti Kamol "xato" dedi (9/4 = 2 1/4).
// Case: Oybek 11/4 stakan sharbat (= 2 3/4). Yangi qahramonlar: Madina, Kamol, Oybek.
// Maxsus slaydlar: s5 = 5 ta oson savol (SeqMC); s12 = 6-8 misol oson->qiyin har xil tur (SeqMix) = YAKUNIY.
// Drag: s6 = drag-CLASSIFY (To'g'ri/Noto'g'ri/Aralash savatlariga); s11 = drag-ORDER (kichikdan kattaga).
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'frac_5_13',
  lessonTitle: { ru: 'Правильные, неправильные, смешанные числа', uz: "To'g'ri, noto'g'ri va aralash sonlar" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (spaced retrieval: 4/4 = 1)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (noto'g'ri kasr tug'iladi)
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 3  (aralash son + bo'lish-qoldiq)
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 4
  { id: 's5',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },  // 5  (5 ta oson savol)
  { id: 's6',  type: 'test',        template: 'DragClassify',   scored: true,  scope: 'practice' },  // 6  (sudrab klassifikatsiya)
  { id: 's7',  type: 'test',        template: 'MixedInput',     scored: true,  scope: 'practice' },  // 7  (7/4 -> 1 3/4)
  { id: 's8',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 8  (noto'g'risini top)
  { id: 's9',  type: 'case',        template: 'custom',         scored: false, scope: null },       // 9  (Oybek — masala konteksti)
  { id: 's10', type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 10 (11/4 = 2 3/4)
  { id: 's11', type: 'test',        template: 'DragOrder',      scored: true,  scope: 'practice' },  // 11 (kichikdan kattaga sudrash)
  { id: 's12', type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },     // 12 (6-8 misol oson->qiyin = yakuniy)
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }         // 13
];

// ============================================================
// CONTENT — ru + uz + audio (audio TTS-toza: belgisiz, kasrlar so'z bilan "maxrajdan surat")
// ============================================================
const CONTENT = {
  // s0 — HOOK: Madina non 9/4, Kamol "xato" dedi. Ekranda FAQAT sarlavha + FillWholes anim; qolgani OVOZDA.
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Jumboq" },
    title: { ru: 'Приложение показало 9/4 — это ошибка?', uz: "Ilova 9/4 ko'rsatdi — bu xatomi?" },
    lead: { ru: 'Мадина испекла лепёшки. Каждая лепёшка разделена на 4 равные доли.', uz: "Madina non yopdi. Har bir non 4 ta teng bo'lakka bo'lingan." },
    opt0: { ru: 'Да, это ошибка', uz: "Ha, bu xato" },
    opt1: { ru: 'Нет, так бывает', uz: "Yo'q, bunday bo'ladi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Проверим вместе: посмотрим, ошибка это или нет.', uz: "Birga tekshiramiz: bu xatomi yoki yo'qmi, ko'ramiz." },
    reveal1: { ru: 'Верное чутьё. Сейчас увидим, почему так бывает.', uz: "To'g'ri sezgi. Hozir nega bunday bo'lishini ko'ramiz." },
    reveal2: { ru: 'Ничего страшного — к концу урока ответишь уверенно.', uz: "Hechqisi yo'q — dars oxirida ishonch bilan javob berasiz." },
    audio: {
      ru: 'Мадина испекла лепёшки. Каждая лепёшка разделена на четыре равные доли. Она насчитала девять долей, и приложение показало девять четвёртых. Её друг Камол сказал так не бывает, верх не может быть больше низа, это ошибка. Как думаешь, Камол прав? Выбери ответ.',
      uz: "Madina non yopdi. Har bir non to'rtta teng bo'lakka bo'lingan. U to'qqizta bo'lak sanadi va ilova to'rtdan to'qqizni ko'rsatdi. Do'sti Kamol bunday bo'lmaydi, surat maxrajdan katta bo'lolmaydi, bu xato dedi. Sizningcha, Kamol haqmi? Javobni tanlang."
    }
  },

  // s1 — WARMUP (spaced retrieval): 4/4 = 1 (noto'g'ri kasrga ko'prik)
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    bridge: { ru: 'Сначала вспомним одну простую вещь.', uz: "Avval bitta oddiy narsani eslaymiz." },
    title: { ru: 'Одно целое — это сколько долей?', uz: "Bitta butun — bu necha ulush?" },
    question: { ru: 'Лепёшка разделена на 4 доли. Сколько будет 4/4?', uz: "Non 4 ulushga bo'lingan. To'rtdan to'rt nechaga teng?" },
    opt0: { ru: '1', uz: '1' },
    opt1: { ru: '4', uz: '4' },
    opt2: { ru: '1/4', uz: '1/4' },
    correct_text: { ru: 'Верно. Четыре четвёртых доли вместе дают одно целое: 4/4 = 1.', uz: "To'g'ri. To'rtta to'rtdan bir ulush birgalikda bitta butun beradi: 4/4 = 1." },
    hint_1: { ru: 'Четыре — это не доли, а сколько частей в целом. А сколько целых получается из всех четырёх долей?', uz: "To'rt — bu ulush emas, butundagi qismlar soni. Hamma to'rtta ulushdan nechta butun chiqadi?" },
    hint_2: { ru: 'Одна четвёртая это только одна доля. А тут собрали все четыре доли.', uz: "To'rtdan bir bu faqat bitta ulush. Bu yerda esa to'rtala ulush yig'ilgan." },
    wrong_default: { ru: 'Все доли целого вместе дают ровно одно целое. Значит четыре четвёртых это один.', uz: "Butunning hamma ulushi birgalikda roppa rosa bitta butun beradi. Demak to'rtta to'rtdan bir bitta." },
    audio: {
      intro: { ru: 'Сначала разминка. Одна лепёшка разделена на четыре доли. Сколько будет четыре четвёртых? Выбери ответ.', uz: "Avval mashq. Bitta non to'rtta ulushga bo'lingan. To'rtdan to'rt nechaga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Все четыре доли вместе это одно целое. Это нам сейчас пригодится.', uz: "To'g'ri. To'rtala ulush birgalikda bitta butun. Bu hozir asqotadi." },
      on_wrong: { ru: 'Не совсем. Все доли целого вместе дают одно целое.', uz: "Unchalik emas. Butunning hamma ulushi birgalikda bitta butun beradi." }
    }
  },

  // s2 — EXPLORATION (FillWholes step): noto'g'ri kasr tug'iladi (9/4, surat>maxraj)
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    bridge: { ru: 'Раз 4/4 это одно целое, посмотрим, что будет с девятью долями.', uz: "To'rtdan to'rt bitta butun ekan, to'qqizta ulushga nima bo'lishini ko'ramiz." },
    title: { ru: 'Когда долей больше, чем в одном целом', uz: "Ulush bitta butundagidan ko'p bo'lganda" },
    note: { ru: 'Долей оказалось 9, а в одной лепёшке только 4. Верх больше низа — это правильно, так и должно быть. Такую дробь называют неправильной.', uz: "Ulush 9 ta chiqdi, bitta nonda esa atigi 4 ta. Surat maxrajdan katta — bu to'g'ri, shunday bo'lishi kerak. Bunday kasr noto'g'ri kasr deyiladi." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    audio: {
      ru: [
        'Будем добавлять доли по одной лепёшке. Первая лепёшка заполнилась — четыре доли, это одно целое. Нажми кнопку дальше.',
        'Вторая лепёшка тоже заполнилась — ещё одно целое. Уже два целых, восемь долей.',
        'Добавили ещё одну долю в третью лепёшку. Всего девять долей — это девять четвёртых.',
        'Верх дроби девять, низ четыре. Верх больше низа, и это нормально. Такую дробь называют неправильной.'
      ],
      uz: [
        "Bittadan non bo'yicha ulush qo'shamiz. Birinchi non to'ldi — to'rtta ulush, bu bitta butun. Davom etish tugmasini bosing.",
        "Ikkinchi non ham to'ldi — yana bitta butun. Endi ikkita butun, sakkizta ulush.",
        "Uchinchi nonga yana bitta ulush qo'shildi. Hammasi bo'lib to'qqizta ulush — bu to'rtdan to'qqiz.",
        "Kasrning surati to'qqiz, maxraji to'rt. Surat maxrajdan katta, va bu normal. Bunday kasr noto'g'ri kasr deyiladi."
      ]
    }
  },

  // s3 — EXPLORATION (FillWholes mixed + bo'lish-qoldiq): aralash son tug'iladi
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    bridge: { ru: 'А теперь прочитаем те же девять долей по-другому.', uz: "Endi o'sha to'qqizta ulushni boshqacha o'qiymiz." },
    title: { ru: 'Рождение смешанного числа', uz: "Aralash sonning paydo bo'lishi" },
    note: { ru: 'Две лепёшки заполнены целиком — это 2 целых. В третьей одна доля — это 1/4. Вместе: 2 целых и 1/4. Это смешанное число. А найти его просто: 9 разделить на 4 — два, остаток один.', uz: "Ikkita non to'liq to'ldi — bu 2 butun. Uchinchisida bitta ulush — bu 1/4. Birgalikda: 2 butun va 1/4. Bu aralash son. Topish oson: 9 ni 4 ga bo'lsak — ikki, qoldiq bir." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    audio: {
      ru: [
        'Те же девять долей сгруппируем. Две лепёшки заполнены целиком — это два целых. Нажми кнопку дальше.',
        'В третьей лепёшке осталась одна доля из четырёх — это одна четвёртая.',
        'Вместе получается два целых и одна четвёртая. Это и есть смешанное число.',
        'Найти его можно делением. Девять разделить на четыре будет два, остаток один. Два это целые, остаток один это новый верх дроби.'
      ],
      uz: [
        "O'sha to'qqizta ulushni guruhlaymiz. Ikkita non to'liq to'ldi — bu ikkita butun. Davom etish tugmasini bosing.",
        "Uchinchi nonda to'rttadan bitta ulush qoldi — bu to'rtdan bir.",
        "Birgalikda ikki butun va to'rtdan bir bo'ladi. Mana shu aralash son.",
        "Uni bo'lish bilan topsa bo'ladi. To'qqizni to'rtga bo'lsak ikki bo'ladi, qoldiq bir. Ikki — bu butun, qoldiq bir — bu kasrning yangi surati."
      ]
    }
  },

  // s4 — RULE: 3 ta'rif + "yig'indi, ko'paytma emas" ogohlantirish + fakt
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Соберём три новых слова в одно короткое правило.', uz: "Uchta yangi so'zni bitta qisqa qoidaga yig'amiz." },
    title: { ru: 'Три вида чисел из долей', uz: "Ulushlardan uch xil son" },
    def1_h: { ru: 'Правильная дробь', uz: "To'g'ri kasr" },
    def1: { ru: 'верх меньше низа, она меньше единицы. Например 3/4.', uz: "surat maxrajdan kichik, u birdan kichik. Masalan 3/4." },
    def2_h: { ru: 'Неправильная дробь', uz: "Noto'g'ri kasr" },
    def2: { ru: 'верх больше низа или равен ему, она больше единицы или равна. Например 9/4, 4/4.', uz: "surat maxrajdan katta yoki teng, u birdan katta yoki teng. Masalan 9/4, 4/4." },
    def3_h: { ru: 'Смешанное число', uz: "Aralash son" },
    def3: { ru: 'целое и правильная дробь рядом. Например 2 1/4.', uz: "butun son va to'g'ri kasr yonma-yon. Masalan 2 1/4." },
    warn: { ru: 'Смешанное число — это сумма целого и дроби, а не произведение. 2 1/4 = 2 + 1/4.', uz: "Aralash son — bu butun va kasrning yig'indisi, ko'paytmasi emas. 2 1/4 = 2 + 1/4." },
    fact: { ru: 'Записывать смешанное число — целое рядом с дробью — начали индийские математики больше тысячи лет назад. Поэтому и мы пишем целое слева от дроби.', uz: "Aralash sonni — butunni kasr yoniga — yozishni hind matematiklari ming yildan ko'proq oldin boshlagan. Shuning uchun biz ham butunni kasrning chap tomoniga yozamiz." },
    fact_btn: { ru: 'Интересный факт', uz: "Qiziqarli fakt" },
    audio: {
      ru: [
        'Запомни три слова. Первое. Правильная дробь, у неё верх меньше низа, она меньше одного целого. Второе. Неправильная дробь, у неё верх больше низа или равен ему, она больше одного целого или равна. Третье. Смешанное число, это целое и правильная дробь рядом. И самое важное. Смешанное число это сумма целого и дроби, а не произведение. Два целых одна четвёртая это два плюс одна четвёртая.',
        'Интересный факт. Записывать смешанное число, целое рядом с дробью, начали индийские математики больше тысячи лет назад. Поэтому и мы пишем целое слева от дроби.'
      ],
      uz: [
        "Uchta so'zni eslab qoling. Birinchi. To'g'ri kasr, uning surati maxrajdan kichik, u bitta butundan kichik. Ikkinchi. Noto'g'ri kasr, uning surati maxrajdan katta yoki teng, u bitta butundan katta yoki teng. Uchinchi. Aralash son, bu butun va to'g'ri kasr yonma-yon. Va eng muhimi. Aralash son butun va kasrning yig'indisi, ko'paytmasi emas. Ikki butun to'rtdan bir bu ikki qo'shuv to'rtdan bir.",
        "Qiziqarli fakt. Aralash sonni, butunni kasr yoniga yozishni hind matematiklari ming yildan ko'proq oldin boshlagan. Shuning uchun biz ham butunni kasrning chap tomoniga yozamiz."
      ]
    }
  },

  // s5 — TEST SeqMC: 5 ta OSON savol (to'g'ri javob pozitsiyalari A/B/C/A/B bo'ylab)
  s5: {
    eyebrow: { ru: 'Разминка · 5 вопросов', uz: "Mashq · 5 ta savol" },
    bridge: { ru: 'Правило ясно — закрепим на пяти быстрых вопросах.', uz: "Qoida tushunarli — beshta tezkor savolda mustahkamlaymiz." },
    title: { ru: 'Пять быстрых вопросов', uz: "Beshta tezkor savol" },
    lead: { ru: 'Определи вид числа или ответь коротко.', uz: "Son turini aniqlang yoki qisqa javob bering." },
    questions: [
      { q: { ru: 'Какая это дробь: 3/4?', uz: '3/4 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 0,
        ok: { ru: 'Верно. Верх меньше низа — дробь правильная.', uz: "To'g'ri. Surat maxrajdan kichik — kasr to'g'ri." },
        no: { ru: 'Посмотри на верх и низ: верх меньше низа.', uz: "Surat va maxrajga qarang: surat maxrajdan kichik." },
        say: { ru: 'Какая это дробь, три четвёртых?', uz: "To'rtdan uch — qaysi kasr?" } },
      { q: { ru: 'Какая это дробь: 7/4?', uz: '7/4 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 1,
        ok: { ru: 'Верно. Верх больше низа — дробь неправильная.', uz: "To'g'ri. Surat maxrajdan katta — kasr noto'g'ri." },
        no: { ru: 'Верх больше низа, значит дробь больше целого.', uz: "Surat maxrajdan katta, demak kasr butundan katta." },
        say: { ru: 'Какая это дробь, семь четвёртых?', uz: "To'rtdan yetti — qaysi kasr?" } },
      { q: { ru: 'Какое это число: 2 1/3?', uz: '2 1/3 — qaysi son?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 2,
        ok: { ru: 'Верно. Целое и дробь рядом — смешанное число.', uz: "To'g'ri. Butun va kasr yonma-yon — aralash son." },
        no: { ru: 'Тут есть целое число рядом с дробью.', uz: "Bu yerda kasr yonida butun son bor." },
        say: { ru: 'Какое это число, два целых одна третья?', uz: "Ikki butun uchdan bir — qaysi son?" } },
      { q: { ru: 'В неправильной дроби верх...', uz: "Noto'g'ri kasrda surat..." }, opts: [{ ru: 'больше или равен', uz: "katta yoki teng" }, { ru: 'всегда меньше', uz: "doim kichik" }, { ru: 'всегда равен', uz: "doim teng" }], correct: 0,
        ok: { ru: 'Верно. Верх больше низа или равен ему.', uz: "To'g'ri. Surat maxrajdan katta yoki unga teng." },
        no: { ru: 'Вспомни 9/4 и 4/4: верх не меньше низа.', uz: "9/4 va 4/4 ni eslang: surat maxrajdan kichik emas." },
        say: { ru: 'В неправильной дроби верх какой?', uz: "Noto'g'ri kasrda surat qanday?" } },
      { q: { ru: 'Сколько целых в 5/4?', uz: "5/4 da nechta butun bor?" }, opts: [{ ru: '5', uz: '5' }, { ru: '1', uz: '1' }, { ru: '4', uz: '4' }], correct: 1,
        ok: { ru: 'Верно. 5/4 это одно целое и одна четвёртая.', uz: "To'g'ri. 5/4 bu bitta butun va to'rtdan bir." },
        no: { ru: 'Раздели 5 на 4: сколько целых лепёшек получится?', uz: "5 ni 4 ga bo'ling: nechta to'la non chiqadi?" },
        say: { ru: 'Сколько целых в пяти четвёртых?', uz: "To'rtdan beshda nechta butun bor?" } }
    ],
    audio: {
      intro: { ru: 'Разминка. Пять быстрых вопросов. Первый. Какая это дробь, три четвёртых? Выбери ответ.', uz: "Mashq. Beshta tezkor savol. Birinchi. To'rtdan uch — qaysi kasr? Javobni tanlang." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." },
      on_done: { ru: 'Все пять верно. Виды чисел ты различаешь уверенно.', uz: "Beshalasi to'g'ri. Son turlarini ishonch bilan ajratyapsiz." }
    }
  },

  // s6 — TEST DragClassify: kasrlarni To'g'ri / Noto'g'ri / Aralash savatlariga sudrash
  s6: {
    eyebrow: { ru: 'Перетащи · разбери', uz: "Sudrab ajrating" },
    bridge: { ru: 'Теперь сам разложи числа по трём корзинам.', uz: "Endi sonlarni uchta savatga o'zingiz ajrating." },
    title: { ru: 'Разложи по видам', uz: "Turlarga ajrating" },
    lead: { ru: 'Перетащи каждое число в нужную корзину (или нажми число, потом корзину).', uz: "Har bir sonni kerakli savatga suring (yoki sonni, keyin savatni bosing)." },
    bin_T: { ru: 'Правильная', uz: "To'g'ri" },
    bin_N: { ru: 'Неправильная', uz: "Noto'g'ri" },
    bin_A: { ru: 'Смешанное', uz: "Aralash" },
    tray_label: { ru: 'Числа', uz: "Sonlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Не всё на месте. Правильная — верх меньше низа; неправильная — верх не меньше низа; смешанное — есть целое рядом.', uz: "Hammasi joyida emas. To'g'ri — surat maxrajdan kichik; noto'g'ri — surat maxrajdan kichik emas; aralash — yonida butun bor." },
    fb_correct: { ru: 'Верно. Каждое число в своей корзине: вид определяется по верху, низу и наличию целого.', uz: "To'g'ri. Har bir son o'z savatida: tur surat, maxraj va butun bor-yo'qligi bilan aniqlanadi." },
    audio: {
      intro: { ru: 'Разложи шесть чисел по трём корзинам. Правильная дробь, неправильная дробь и смешанное число. Перетащи число в корзину или нажми число, потом корзину. Когда разложишь все, нажми кнопку проверить.', uz: "Olti sonni uchta savatga ajrating. To'g'ri kasr, noto'g'ri kasr va aralash son. Sonni savatga suring yoki sonni, keyin savatni bosing. Hammasini ajratgach, tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Все числа на своих местах.', uz: "To'g'ri. Hamma son o'z joyida." },
      on_wrong: { ru: 'Пока не всё на месте. Правильная меньше целого, неправильная не меньше целого, у смешанного есть целое рядом.', uz: "Hozircha hammasi joyida emas. To'g'ri kasr butundan kichik, noto'g'ri kichik emas, aralash sonda yonida butun bor." }
    }
  },

  // s7 — TEST MixedInput: 7/4 = 1 butun 3/4
  s7: {
    eyebrow: { ru: 'Переведи', uz: "O'tkazing" },
    bridge: { ru: 'Переведём неправильную дробь в смешанное число сами.', uz: "Noto'g'ri kasrni aralash songa o'zimiz o'tkazamiz." },
    title: { ru: 'Из неправильной дроби в смешанное число', uz: "Noto'g'ri kasrdan aralash songa" },
    question: { ru: 'Запиши 7/4 как смешанное число: 7/4 = ? целых ?/4', uz: "7/4 ni aralash son qilib yozing: 7/4 = ? butun ?/4" },
    label_whole: { ru: 'целых', uz: "butun" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Раздели верх на низ: семь разделить на четыре. Целая часть это сколько раз четыре уложилось, остаток это новый верх.', uz: "Suratni maxrajga bo'ling: yettini to'rtga bo'ling. Butun qism — to'rt necha marta joylashgani, qoldiq — yangi surat." },
    fb_correct: { ru: 'Верно. 7 разделить на 4 — один, остаток три. Значит 7/4 = 1 целая 3/4.', uz: "To'g'ri. 7 ni 4 ga bo'lsak — bir, qoldiq uch. Demak 7/4 = 1 butun 3/4." },
    audio: {
      intro: { ru: 'Переведи семь четвёртых в смешанное число. Сколько целых и сколько четвёртых останется? Раздели семь на четыре. Введи целую часть и верх дроби, потом нажми кнопку проверить.', uz: "To'rtdan yettini aralash songa o'tkazing. Nechta butun va to'rtdan nechta qoladi? Yettini to'rtga bo'ling. Butun qismni va kasrning suratini kiriting, keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Семь разделить на четыре будет один, остаток три. Семь четвёртых это одно целое и три четвёртых.', uz: "To'g'ri. Yettini to'rtga bo'lsak bir bo'ladi, qoldiq uch. To'rtdan yetti bu bitta butun va to'rtdan uch." },
      on_wrong: { ru: 'Не совсем. Раздели семь на четыре: целая часть один, остаток три.', uz: "Unchalik emas. Yettini to'rtga bo'ling: butun qism bir, qoldiq uch." }
    }
  },

  // s8 — TEST: noto'g'risini top (error-spotting). To'g'ri javob = XATO yozuv (opt0).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    bridge: { ru: 'А теперь поймай ошибку в чужой записи.', uz: "Endi birovning yozuvidagi xatoni toping." },
    title: { ru: 'Найди неверную запись', uz: "Noto'g'ri yozuvni toping" },
    question: { ru: 'Какая запись НЕВЕРНА?', uz: "Qaysi yozuv NOTO'G'RI?" },
    opt0: { ru: '5/4 = 5 целых 1/4', uz: '5/4 = 5 butun 1/4' },
    opt1: { ru: '9/4 = 2 целых 1/4', uz: '9/4 = 2 butun 1/4' },
    opt2: { ru: '3/4 — правильная дробь', uz: "3/4 — to'g'ri kasr" },
    correct_text: { ru: 'Верно — неверна именно эта. Целое берут не из верха, а из числа целых лепёшек: 5/4 = 1 целая 1/4, а не 5 целых.', uz: "To'g'ri — aynan shu noto'g'ri. Butun surat sonidan emas, to'la nonlar sonidan olinadi: 5/4 = 1 butun 1/4, 5 butun emas." },
    hint_1: { ru: 'Эта запись верная: девять четвёртых это две целых лепёшки и одна доля.', uz: "Bu yozuv to'g'ri: to'rtdan to'qqiz bu ikkita to'la non va bitta ulush." },
    hint_2: { ru: 'Эта запись верная: верх меньше низа, значит дробь правильная.', uz: "Bu yozuv to'g'ri: surat maxrajdan kichik, demak kasr to'g'ri." },
    wrong_default: { ru: 'Ищи запись, где целую часть взяли прямо из верха дроби. Так нельзя.', uz: "Butun qismni to'g'ridan to'g'ri kasrning suratidan olgan yozuvni qidiring. Bunday qilib bo'lmaydi." },
    fact: { ru: 'В рецептах часто пишут смешанным числом: полтора стакана муки — это 1 1/2 стакана, а дробью 3/2.', uz: "Retseptlarda ko'pincha aralash son yoziladi: bir yarim stakan un — bu 1 1/2 stakan, kasr bilan 3/2." },
    audio: {
      intro: { ru: 'Поймай ошибку. Среди трёх записей одна неверна. Найди, где целую часть взяли прямо из верха дроби. Выбери неверную запись.', uz: "Xatoni toping. Uchta yozuvdan biri noto'g'ri. Butun qismni to'g'ridan to'g'ri kasr suratidan olgan joyni toping. Noto'g'ri yozuvni tanlang." },
      on_correct: { ru: 'Верно. Целую часть берут из числа целых лепёшек, а не из верха дроби. Кстати, в рецептах полтора стакана это смешанное число.', uz: "To'g'ri. Butun qism to'la nonlar sonidan olinadi, kasr suratidan emas. Aytmoqchi, retseptdagi bir yarim stakan — bu aralash son." },
      on_wrong: { ru: 'Эта запись верная. Ищи ту, где целую часть взяли из верха дроби.', uz: "Bu yozuv to'g'ri. Butun qismni kasr suratidan olgan yozuvni qidiring." }
    }
  },

  // s9 — CASE intro (Oybek): 11/4 stakan sharbat
  s9: {
    eyebrow: { ru: 'Задача · Ойбек', uz: "Masala · Oybek" },
    bridge: { ru: 'Смешанные числа встречаются в жизни. Помоги Ойбеку.', uz: "Aralash sonlar hayotda uchraydi. Oybekka yordam bering." },
    title: { ru: 'У Ойбека 11/4 стакана сока.', uz: "Oybekda 11/4 stakan sharbat bor." },
    body: { ru: 'Каждый стакан делится на 4 равные части, и у Ойбека 11 таких частей. Сколько это полных стаканов и сколько останется? Сначала прикинь, потом проверим.', uz: "Har stakan 4 ta teng qismga bo'linadi, Oybekda esa 11 ta shunday qism bor. Bu nechta to'la stakan va qancha ortadi? Avval chamalang, keyin tekshiramiz." },
    hint_card: { ru: 'Раздели 11 на 4: целая часть и остаток.', uz: "11 ni 4 ga bo'ling: butun qism va qoldiq." },
    audio: { ru: 'У Ойбека одиннадцать четвёртых стакана сока. Каждый стакан делится на четыре части, и таких частей одиннадцать. Сколько это полных стаканов и сколько останется? Раздели одиннадцать на четыре. Прикинь ответ, на следующем шаге проверим.', uz: "Oybekda to'rtdan o'n bir stakan sharbat bor. Har stakan to'rtta qismga bo'linadi, shunday qism o'n bitta. Bu nechta to'la stakan va qancha ortadi? O'n birni to'rtga bo'ling. Javobni chamalang, keyingi qadamda tekshiramiz." }
  },

  // s10 — CASE MC: 11/4 = 2 3/4 (to'g'ri = opt0; order [2,0,3,1])
  s10: {
    eyebrow: { ru: 'Задача · Ойбек', uz: "Masala · Oybek" },
    bridge: { ru: 'Теперь посчитаем точно.', uz: "Endi aniq hisoblaymiz." },
    title: { ru: 'Сок Ойбека', uz: "Oybekning sharbati" },
    question: { ru: 'Сколько это стаканов? 11/4 = ?', uz: "Bu necha stakan? 11/4 = ?" },
    opt0: { ru: '2 целых 3/4', uz: '2 butun 3/4' },
    opt1: { ru: '2 целых 1/4', uz: '2 butun 1/4' },
    opt2: { ru: '4 целых 3/4', uz: '4 butun 3/4' },
    opt3: { ru: '11 целых 1/4', uz: '11 butun 1/4' },
    correct_text: { ru: 'Верно. 11 разделить на 4 — два, остаток три. Значит 11/4 = 2 целых 3/4 стакана.', uz: "To'g'ri. 11 ni 4 ga bo'lsak — ikki, qoldiq uch. Demak 11/4 = 2 butun 3/4 stakan." },
    hint_1: { ru: 'Раздели 11 на 4. Сколько раз четыре уложилось целиком и что в остатке?', uz: "11 ni 4 ga bo'ling. To'rt necha marta to'la joylashdi va qoldiqda nima qoldi?" },
    hint_2: { ru: 'Целых тут больше двух не получится: два целых стакана и остаток.', uz: "Bu yerda ikkitadan ortiq butun chiqmaydi: ikkita to'la stakan va qoldiq." },
    hint_3: { ru: 'Целое берут из числа полных стаканов, а не из верха дроби.', uz: "Butun to'la stakanlar sonidan olinadi, kasr suratidan emas." },
    wrong_default: { ru: 'Раздели одиннадцать на четыре: целая часть два, остаток три. Это два целых и три четвёртых.', uz: "O'n birni to'rtga bo'ling: butun qism ikki, qoldiq uch. Bu ikki butun, to'rtdan uch." },
    fact: { ru: 'Время тоже мерят смешанным числом: 1 час 30 минут — это 1 целый и 1/2 часа.', uz: "Vaqt ham aralash son bilan o'lchanadi: 1 soat 30 daqiqa — bu 1 butun va 1/2 soat." },
    audio: {
      intro: { ru: 'Теперь точный счёт. Сколько это стаканов? Одиннадцать четвёртых. Выбери ответ.', uz: "Endi aniq hisob. Bu necha stakan? To'rtdan o'n bir. Javobni tanlang." },
      on_correct: { ru: 'Верно. Одиннадцать разделить на четыре будет два, остаток три. Это два целых и три четвёртых стакана. Кстати, время тоже мерят смешанным числом, час тридцать это полтора часа.', uz: "To'g'ri. O'n birni to'rtga bo'lsak ikki bo'ladi, qoldiq uch. Bu ikki butun va to'rtdan uch stakan. Aytmoqchi, vaqt ham aralash son bilan o'lchanadi, bir soat o'ttiz daqiqa bu bir yarim soat." },
      on_wrong: { ru: 'Не совсем. Раздели одиннадцать на четыре: целых два, остаток три.', uz: "Unchalik emas. O'n birni to'rtga bo'ling: butun ikki, qoldiq uch." }
    }
  },

  // s11 — TEST DragOrder: kichikdan kattaga (1/2, 5/4, 2/3, 1 1/2)
  s11: {
    eyebrow: { ru: 'Перетащи · по порядку', uz: "Sudrab tartiblang" },
    bridge: { ru: 'Сравним правильные, неправильные и смешанные вместе.', uz: "To'g'ri, noto'g'ri va aralash sonlarni birga solishtiramiz." },
    title: { ru: 'Расставь от меньшего к большему', uz: "Kichikdan kattaga joylashtiring" },
    lead: { ru: 'Перетащи числа в слоты по возрастанию (или нажми число, потом слот).', uz: "Sonlarni o'sish tartibida kataklarga suring (yoki sonni, keyin katakni bosing)." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Не по порядку. Меньше единицы — это правильные дроби, больше единицы — неправильные и смешанные.', uz: "Tartib noto'g'ri. Birdan kichigi — to'g'ri kasrlar, birdan kattasi — noto'g'ri va aralash sonlar." },
    fb_correct: { ru: 'Верно. По возрастанию: 1/2, 2/3, 5/4, 1 1/2. Правильные дроби меньше единицы, неправильная и смешанное больше.', uz: "To'g'ri. O'sish tartibida: 1/2, 2/3, 5/4, 1 1/2. To'g'ri kasrlar birdan kichik, noto'g'ri va aralash kattaroq." },
    audio: {
      intro: { ru: 'Расставь четыре числа от меньшего к большему. Перетащи число в слот или нажми число, потом слот. Когда расставишь все, нажми кнопку проверить.', uz: "To'rtta sonni kichikdan kattaga joylashtiring. Sonni katakka suring yoki sonni, keyin katakni bosing. Hammasini joylagach, tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Порядок правильный: половина, две третьих, пять четвёртых, полтора.', uz: "To'g'ri. Tartib to'g'ri: yarim, uchdan ikki, to'rtdan besh, bir yarim." },
      on_wrong: { ru: 'Пока не по порядку. Меньше одного целого идут правильные дроби, потом больше единицы.', uz: "Hozircha tartib noto'g'ri. Bitta butundan kichigi to'g'ri kasrlar, keyin birdan kattasi keladi." }
    }
  },

  // s12 — YAKUNIY TEST (SeqMix): 7 misol oson->qiyin, har xil tur (mc/minput/place)
  s12: {
    eyebrow: { ru: 'Итоговое · 7 заданий', uz: "Yakuniy · 7 ta topshiriq" },
    bridge: { ru: 'Финал: соберём всё на семи заданиях.', uz: "Final: hammasini yettita topshiriqda birlashtiramiz." },
    title: { ru: 'Итог: от лёгкого к трудному', uz: "Yakun: oddiydan qiyinga" },
    lead: { ru: 'Семь заданий разного типа. Не торопись.', uz: "Yettita har xil turdagi topshiriq. Shoshmang." },
    done_text: { ru: 'Все семь пройдены. Ты уверенно различаешь дроби и переводишь их в смешанные числа.', uz: "Yettalasi bajarildi. Siz kasrlarni ishonch bilan ajratib, aralash songa o'tkazyapsiz." },
    items: [
      // 1 — mc-classify oson
      { type: 'mc', prompt: { ru: 'Какая это дробь: 2/5?', uz: '2/5 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 0,
        say: { ru: 'Какая это дробь, две пятых?', uz: "Beshdan ikki — qaysi kasr?" },
        ok: { ru: 'Верх меньше низа — правильная.', uz: "Surat maxrajdan kichik — to'g'ri." },
        no: { ru: 'Верх меньше низа.', uz: "Surat maxrajdan kichik." } },
      // 2 — mc-classify
      { type: 'mc', prompt: { ru: 'Какая это дробь: 8/5?', uz: '8/5 — qaysi kasr?' }, opts: [{ ru: 'Правильная', uz: "To'g'ri" }, { ru: 'Неправильная', uz: "Noto'g'ri" }, { ru: 'Смешанное', uz: "Aralash" }], correct: 1,
        say: { ru: 'Какая это дробь, восемь пятых?', uz: "Beshdan sakkiz — qaysi kasr?" },
        ok: { ru: 'Верх больше низа — неправильная.', uz: "Surat maxrajdan katta — noto'g'ri." },
        no: { ru: 'Верх больше низа.', uz: "Surat maxrajdan katta." } },
      // 3 — minput oson
      { type: 'minput', prompt: { ru: 'Переведи: 5/4 = ? целых ?/4', uz: '5/4 ni o\'tkaz: 5/4 = ? butun ?/4' }, w: 1, num: 1, den: 4,
        say: { ru: 'Переведи пять четвёртых в смешанное число.', uz: "To'rtdan beshni aralash songa o'tkazing." },
        ok: { ru: '5 разделить на 4 — один, остаток один.', uz: "5 ni 4 ga bo'lsak — bir, qoldiq bir." },
        no: { ru: 'Раздели 5 на 4: целое один, остаток один.', uz: "5 ni 4 ga bo'ling: butun bir, qoldiq bir." } },
      // 4 — place oson (5/4 = 1.25 sonlar nurida)
      { type: 'place', prompt: { ru: 'Поставь 5/4 на числовой прямой', uz: "5/4 ni sonlar nuriga qo'ying" }, max: 2, den: 4, targetK: 5,
        say: { ru: 'Поставь пять четвёртых на числовой прямой. Это между одним и двумя.', uz: "To'rtdan beshni sonlar nuriga qo'ying. Bu bir bilan ikki orasida." },
        ok: { ru: 'Верно. 5/4 это чуть больше одного целого.', uz: "To'g'ri. 5/4 bu bitta butundan sal kattaroq." },
        no: { ru: '5/4 больше единицы, но меньше двух.', uz: "5/4 birdan katta, lekin ikkidan kichik." } },
      // 5 — mc find-wrong
      { type: 'mc', prompt: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" }, opts: [{ ru: '3/2 = 1 1/2', uz: '3/2 = 1 1/2' }, { ru: '6/6 = 1 целая 1/6', uz: '6/6 = 1 butun 1/6' }, { ru: '2/3 — правильная', uz: "2/3 — to'g'ri" }], correct: 1,
        say: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
        ok: { ru: '6/6 это ровно одно целое, без остатка.', uz: "6/6 bu roppa rosa bitta butun, qoldiqsiz." },
        no: { ru: '6/6 это один, остатка нет.', uz: "6/6 bu bir, qoldiq yo'q." } },
      // 6 — minput qiyin (11/4 = 2 3/4)
      { type: 'minput', prompt: { ru: 'Переведи: 11/4 = ? целых ?/4', uz: '11/4 ni o\'tkaz: 11/4 = ? butun ?/4' }, w: 2, num: 3, den: 4,
        say: { ru: 'Переведи одиннадцать четвёртых в смешанное число.', uz: "To'rtdan o'n birni aralash songa o'tkazing." },
        ok: { ru: '11 разделить на 4 — два, остаток три.', uz: "11 ni 4 ga bo'lsak — ikki, qoldiq uch." },
        no: { ru: 'Раздели 11 на 4: целое два, остаток три.', uz: "11 ni 4 ga bo'ling: butun ikki, qoldiq uch." } },
      // 7 — place qiyin (2 1/3 sonlar nurida, max 3 den 3 -> k=7)
      { type: 'place', prompt: { ru: 'Поставь 2 1/3 на числовой прямой', uz: "2 1/3 ni sonlar nuriga qo'ying" }, max: 3, den: 3, targetK: 7,
        say: { ru: 'Поставь два целых одну третью на числовой прямой. Это между двумя и тремя.', uz: "Ikki butun uchdan birni sonlar nuriga qo'ying. Bu ikki bilan uch orasida." },
        ok: { ru: 'Верно. Самое трудное — и оно сделано.', uz: "To'g'ri. Eng qiyini — u ham bajarildi." },
        no: { ru: '2 1/3 чуть больше двух целых.', uz: "2 1/3 ikki butundan sal kattaroq." } }
    ],
    audio: {
      intro: { ru: 'Итоговый тренажёр. Семь заданий от лёгкого к трудному, форматы разные. Первое. Какая это дробь, две пятых?', uz: "Yakuniy trenajyor. Yettita topshiriq oddiydan qiyinga, formatlar har xil. Birinchi. Beshdan ikki — qaysi kasr?" },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку и попробуй снова.', uz: "Unchalik emas. Maslahatga qarang va yana urinib ko'ring." },
      on_done: { ru: 'Все семь пройдены, включая самое трудное. Отличная работа.', uz: "Yettalasi, eng qiyini bilan birga, bajarildi. Ajoyib ish." }
    }
  },

  // s13 — SUMMARY (Dars09-13 kanonik): score + hookni yopadi + ConnectionsBlock
  s13: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    title: { ru: 'Девять четвёртых — не ошибка', uz: "To'rtdan to'qqiz — xato emas" },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "birinchi urinishda to'g'ri javob" },
    hook_label: { ru: 'Ответ на загадку', uz: "Jumboqqa javob" },
    hook_text: { ru: 'Мадина насчитала 9 долей. 9/4 — это неправильная дробь, а не ошибка. Она равна 2 целым и 1/4: 9/4 = 2 1/4. Камол ошибся: верх может быть больше низа.', uz: "Madina 9 ta ulush sanadi. 9/4 — bu noto'g'ri kasr, xato emas. U 2 butun va 1/4 ga teng: 9/4 = 2 1/4. Kamol xato qildi: surat maxrajdan katta bo'lishi mumkin." },
    main_label: { ru: 'Что запомнить', uz: "Nimani eslab qolish kerak" },
    main_1: { ru: '1. Правильная дробь меньше целого, неправильная больше или равна целому.', uz: "1. To'g'ri kasr butundan kichik, noto'g'ri kasr butundan katta yoki teng." },
    main_2: { ru: '2. Смешанное число — это целое плюс правильная дробь, а не произведение.', uz: "2. Aralash son — bu butun qo'shuv to'g'ri kasr, ko'paytma emas." },
    main_3: { ru: '3. Из неправильной дроби в смешанное: верх делим на низ, целое = частное, остаток = новый верх.', uz: "3. Noto'g'ri kasrdan aralashga: suratni maxrajga bo'lamiz, butun = bo'linma, qoldiq = yangi surat." },
    next_note: { ru: 'А обратный перевод — из смешанного числа в неправильную дробь — на следующем уроке.', uz: "Teskari o'tkazish — aralash sondan noto'g'ri kasrga — keyingi darsda." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Понятие дроби; сравнение дробей.', uz: "Kasr tushunchasi; kasrlarni taqqoslash." },
    conn_label_next: { ru: 'Следующий урок', uz: "Keyingi dars" },
    conn_next: { ru: 'Перевод смешанного числа в неправильную дробь и обратно.', uz: "Aralash sonni noto'g'ri kasrga va aksincha o'tkazish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: 'Подведём итог. Мадина насчитала девять долей. Девять четвёртых это неправильная дробь, а не ошибка. Она равна двум целым и одной четвёртой. Камол ошибся, ведь верх может быть больше низа. Запомни. Правильная дробь меньше целого, неправильная больше целого или равна ему. Смешанное число это целое плюс правильная дробь, а не произведение. Чтобы перевести неправильную дробь в смешанное число, делим верх на низ, целое это частное, остаток это новый верх. А обратный перевод мы изучим на следующем уроке.', uz: "Yakun qilamiz. Madina to'qqizta ulush sanadi. To'rtdan to'qqiz bu noto'g'ri kasr, xato emas. U ikki butun va to'rtdan birga teng. Kamol xato qildi, chunki surat maxrajdan katta bo'lishi mumkin. Eslab qoling. To'g'ri kasr butundan kichik, noto'g'ri kasr butundan katta yoki unga teng. Aralash son bu butun qo'shuv to'g'ri kasr, ko'paytma emas. Noto'g'ri kasrni aralash songa o'tkazish uchun suratni maxrajga bo'lamiz, butun bu bo'linma, qoldiq bu yangi surat. Teskari o'tkazishni esa keyingi darsda o'rganamiz." }
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
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_LIFE = { ru: 'Знаешь ли ты? · Из жизни', uz: "Bilasizmi? · Hayotdan" };
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
const AnimMixed = () => (
  <div className="pa-st" aria-hidden="true">
    {['2', '+', '1/4'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.4}s`, fontSize: '0.7em' }}>{mt(ch)}</span>
    ))}
  </div>
);
const AnimCup = () => (
  <div className="fa-cup" aria-hidden="true"><span className="fa-cup-fill"/><span className="fa-cup-mark"/></div>
);
const AnimClock = () => (
  <div className="fa-clock" aria-hidden="true"><span className="fa-clock-h"/><span className="fa-clock-m"/></div>
);

// ============================================================
// VIZUALIZATOR — FillWholes (to'lib-toshuvchi butun-qutilar) + NumLine (sonlar nuri)
// ============================================================
// FillWholes: `wholes` ta butun-quti yonma-yon, har biri `den` katak. `filled` katak chapdan to'ladi.
// mixed=false: barcha to'la katak yashil. mixed=true: to'liq to'lgan quti "1" badge + yashil; qisman quti accent.
const FillWholes = ({ den, filled, wholes, mixed = false, animate = true, max = 360 }) => {
  const boxes = [];
  for (let w = 0; w < wholes; w++) {
    const fullThisBox = Math.min(den, Math.max(0, filled - w * den));
    const boxComplete = fullThisBox === den;
    const cells = [];
    for (let i = 0; i < den; i++) {
      const on = i < fullThisBox;
      let cls = 'fw-cell';
      if (on) cls += mixed ? (boxComplete ? ' fw-on-whole' : ' fw-on-part') : ' fw-on';
      cells.push(<span key={i} className={cls} style={animate ? { transitionDelay: `${(w * den + i) * 0.05}s` } : undefined}/>);
    }
    boxes.push(
      <div key={w} className={`fw-box${boxComplete ? ' fw-box-done' : ''}`}>
        {cells}
        {mixed && boxComplete && <span className="fw-badge">1</span>}
      </div>
    );
  }
  return <div className="fw-row" aria-hidden="true" style={{ maxWidth: max }}>{boxes}</div>;
};

// NumLine — 0..max sonlar nuri, har k/den da nuqta; butun belgilar yorliqli. Bosib joylanadi (place test).
const NumLine = ({ max, den, picked, targetK, solved, onPick }) => {
  const total = max * den;
  const dots = [];
  for (let k = 0; k <= total; k++) {
    const left = (k / total) * 100;
    const isInt = k % den === 0;
    const isPicked = picked === k;
    const right = solved && k === targetK;
    let cls = 'nl-dot';
    if (isInt) cls += ' nl-dot-int';
    if (isPicked) cls += right ? ' nl-dot-ok' : ' nl-dot-sel';
    dots.push(
      <button key={k} className={cls} style={{ left: `${left}%` }} disabled={solved}
        onClick={() => onPick && onPick(k)} aria-label={`${k}`}>
        {isInt && <span className="nl-int-lbl">{k / den}</span>}
      </button>
    );
  }
  return (
    <div className="nl-wrap">
      <div className="nl-track"/>
      {(picked !== null && picked !== undefined) && <span className={`nl-marker${solved && picked === targetK ? ' nl-marker-ok' : ''}`} style={{ left: `${(picked / total) * 100}%` }}/>}
      {dots}
    </div>
  );
};

// ============================================================
// MixedInputScreen — noto'g'ri kasrni aralash songa: butun + surat (ikki maydon), maxraj qat'iy.
// ============================================================
const MixedInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, w, num, den, figure, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [whole, setWhole] = useState(wasSolved ? String(w) : (storedAnswer?.studentWhole ?? ''));
  const [top, setTop] = useState(wasSolved ? String(num) : (storedAnswer?.studentTop ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const wv = parseInt(whole, 10); const tv = parseInt(top, 10);
    if (isNaN(wv) || isNaN(tv)) return;
    const isCorrect = wv === w && tv === num;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: `${w} ${num}/${den}`, studentWhole: whole, studentTop: top, studentAnswer: `${whole} ${top}/${den}`, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]);
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {figure && <div className="frame fade-up delay-1" style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{figure(solved)}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={whole} placeholder="0" disabled={solved}
            onChange={e => { if (!solved) { setWhole(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(64px, 14vw, 84px)' }}/>
          <span className="small mono" style={{ color: T.ink2 }}>{t(c.label_whole)}</span>
          <div className="mix-frac">
            <input type="text" inputMode="numeric" className={`answer-input mix-top ${solved ? 'correct' : ''}`} value={top} placeholder="0" disabled={solved}
              onChange={e => { if (!solved) { setTop(e.target.value); setHintShown(false); } }}
              onKeyDown={e => e.key === 'Enter' && submit()}/>
            <span className="mix-bar"/>
            <span className="mix-den">{den}</span>
          </div>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
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
// SeqMC — ketma-ket tez MC (Dars28/Dars20 etalonidan). Ovozda: say (intro) + umumiy on_wrong; per-item `no` ekranda.
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
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma savol yechildi." : 'Все вопросы решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <div className="dm-prob" style={{ fontSize: 'clamp(20px, 4vw, 30px)' }}>{mt(tx(q.q))}</div>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(13px, 1.8vw, 16px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
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
// SeqMix — ketma-ket aralash turdagi misollar (mc / minput / place). Oson->qiyin.
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
  const [whole, setWhole] = useState('');
  const [top, setTop] = useState('');
  const [placed, setPlaced] = useState(null);
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
  const resetItemState = () => { setMcWrong(new Set()); setWhole(''); setTop(''); setPlaced(null); setWrongShown(false); usedRetryRef.current = false; };
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
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
  };
  const pickMc = (i) => {
    if (done || solvedItem || mcWrong.has(i)) return;
    advanceIntro();
    if (i === it.correct) { markFirstTry(true); sfx.playCorrect(); goNext(); }
    else { setMcWrong(prev => { const s = new Set(prev); s.add(i); return s; }); onWrong(); }
  };
  const submitMinput = () => {
    if (done || solvedItem) return;
    const wv = parseInt(whole, 10); const tv = parseInt(top, 10);
    if (isNaN(wv) || isNaN(tv)) return;
    advanceIntro();
    if (wv === it.w && tv === it.num) { markFirstTry(true); sfx.playCorrect(); goNext(); } else onWrong();
  };
  const pickPlace = (k) => {
    if (done || solvedItem) return;
    advanceIntro();
    setPlaced(k);
    if (k === it.targetK) { markFirstTry(true); sfx.playCorrect(); goNext(); } else onWrong();
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); }, []);

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const typeBadge = { mc: lang === 'uz' ? 'Tanlash' : 'Выбор', minput: lang === 'uz' ? 'Yozish' : 'Ввод', place: lang === 'uz' ? "Son o'qi" : 'Прямая' }[it ? it.type : 'mc'];
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
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(13px, 1.8vw, 16px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}

            {it.type === 'minput' && (
              <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <input type="text" inputMode="numeric" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={whole} placeholder="0" disabled={solvedItem}
                  onChange={e => { setWhole(e.target.value); setWrongShown(false); }} onKeyDown={e => e.key === 'Enter' && submitMinput()} style={{ width: 'clamp(60px, 13vw, 80px)' }}/>
                <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? 'butun' : 'целых'}</span>
                <div className="mix-frac">
                  <input type="text" inputMode="numeric" className={`answer-input mix-top ${solvedItem ? 'correct' : ''}`} value={top} placeholder="0" disabled={solvedItem}
                    onChange={e => { setTop(e.target.value); setWrongShown(false); }} onKeyDown={e => e.key === 'Enter' && submitMinput()}/>
                  <span className="mix-bar"/>
                  <span className="mix-den">{it.den}</span>
                </div>
                {!solvedItem && <button className="btn-white-accent" onClick={submitMinput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
              </div>
            )}

            {it.type === 'place' && (
              <div className="frame fade-up delay-1" style={{ padding: 'clamp(18px, 3vw, 26px) clamp(16px, 3vw, 24px)' }}>
                <NumLine max={it.max} den={it.den} picked={placed} targetK={it.targetK} solved={solvedItem} onPick={pickPlace}/>
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
// DragClassify — kasrlarni 3 savatga sudrash (tap+drag, Dars37 modeli). Keep-visible: yechilganda savatlar yig'iladi.
// ============================================================
const S6_BINS = ['T', 'N', 'A'];
const S6_ITEMS = ['2/5', '5/8', '9/4', '3/3', '1 1/2', '2 3/4'];
const S6_OK = ['T', 'T', 'N', 'N', 'A', 'A'];
const DragClassify = ({ screen, idx, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const binLabels = { T: c.bin_T, N: c.bin_N, A: c.bin_A };
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? S6_OK.slice() : S6_ITEMS.map(() => null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const dropTo = (bin) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const nx = [...p]; nx[sel] = bin; return nx; }); setSel(null); };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const nx = [...p]; nx[i] = null; return nx; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = S6_OK.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[idx].scope, screenIdx: idx, question: t(c.lead), correctAnswer: S6_OK.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setPlace(p => p.map((v, i) => (v === S6_OK[i] ? v : null))); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const trayChips = S6_ITEMS.map((it, i) => (place[i] === null ? i : null)).filter(i => i !== null);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-bins fade-up delay-1" style={{ maxHeight: solved ? 0 : 900, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(11px, 2vw, 15px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {S6_BINS.map(bin => {
            const inBin = S6_ITEMS.map((it, i) => (place[i] === bin ? i : null)).filter(i => i !== null);
            return (
              <div key={bin} className={`dnd-bin${sel !== null ? ' dnd-bin-armed' : ''}`}
                onClick={() => dropTo(bin)} onDragOver={e => { e.preventDefault(); }} onDrop={e => { e.preventDefault(); dropTo(bin); }}>
                <span className="dnd-bin-lbl">{t(binLabels[bin])}</span>
                <div className="dnd-bin-slot">
                  {inBin.map(i => {
                    const right = solved && place[i] === S6_OK[i];
                    return (
                      <span key={i} className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`}
                        draggable={!solved} onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                        onClick={e => { e.stopPropagation(); returnChip(i); }}>{mt(S6_ITEMS[i])}</span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2">
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`}
                draggable onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => onChipClick(i)}>{mt(S6_ITEMS[i])}</span>
            ))}
          </div>
        )}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allPlaced} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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
// DragOrder — sonlarni kichikdan kattaga kataklarga sudrash (tap+drag). slot[s] = item indeksi.
// ============================================================
const S11_VALS = [{ node: '1/2', val: 0.5 }, { node: '5/4', val: 1.25 }, { node: '2/3', val: 2 / 3 }, { node: '1 1/2', val: 1.5 }];
const S11_ORDER = S11_VALS.map((_, i) => i).sort((a, b) => S11_VALS[a].val - S11_VALS[b].val); // slot -> to'g'ri item
const DragOrder = ({ screen, idx, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const N = S11_VALS.length;
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [slots, setSlots] = useState(() => (wasSolved ? S11_ORDER.slice() : Array(N).fill(null))); // slots[s] = item idx
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const placedItems = slots.filter(v => v !== null);
  const dropTo = (s) => {
    if (solved || sel === null || slots[s] !== null) return;
    setChecked(false); setSlots(p => { const nx = [...p]; nx[s] = sel; return nx; }); setSel(null);
  };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(v => (v === i ? null : i)); };
  const returnSlot = (s) => { if (solved) return; setChecked(false); setSlots(p => { const nx = [...p]; nx[s] = null; return nx; }); };
  const allPlaced = slots.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = slots.every((v, s) => v === S11_ORDER[s]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[idx].scope, screenIdx: idx, question: t(c.lead), correctAnswer: S11_ORDER.join(','), studentAnswer: slots.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setSlots(p => p.map((v, s) => (v === S11_ORDER[s] ? v : null))); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const trayChips = S11_VALS.map((it, i) => (placedItems.includes(i) ? null : i)).filter(i => i !== null);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.1vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-slots fade-up delay-1">
          {slots.map((item, s) => {
            const right = solved && item === S11_ORDER[s];
            return (
              <div key={s} className={`dnd-slot${sel !== null && item === null ? ' dnd-slot-armed' : ''}${right ? ' dnd-slot-ok' : ''}`}
                onClick={() => dropTo(s)} onDragOver={e => { e.preventDefault(); }} onDrop={e => { e.preventDefault(); dropTo(s); }}>
                <span className="dnd-slot-pos">{s + 1}</span>
                {item !== null
                  ? <span className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`} draggable={!solved}
                      onDragStart={e => { setSel(item); e.dataTransfer.effectAllowed = 'move'; }}
                      onClick={e => { e.stopPropagation(); returnSlot(s); }}>{mt(S11_VALS[item].node)}</span>
                  : <span className="dnd-slot-empty">—</span>}
              </div>
            );
          })}
        </div>
        <div className="small mono fade-up delay-1" style={{ textAlign: 'center', color: T.ink3 }}>{lang === 'uz' ? "kichik  →  katta" : 'меньше  →  больше'}</div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2">
            <span className="dnd-tray-lbl">{lang === 'uz' ? 'Sonlar' : 'Числа'}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`}
                draggable onDragStart={e => { setSel(i); e.dataTransfer.effectAllowed = 'move'; }}
                onClick={() => onChipClick(i)}>{mt(S11_VALS[i].node)}</span>
            ))}
          </div>
        )}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allPlaced} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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

// s0 — HOOK. Ekranda FAQAT sarlavha + FillWholes anim + variantlar; barcha ma'lumot OVOZDA. Qaytishda picked sbros.
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
        {/* Faqat sarlavha matnda; qolgan ma'lumot (9/4, 2 1/4, Kamol xatosi) faqat OVOZDA. */}
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <FillWholes den={4} filled={9} wholes={3}/>
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

// s1 — WARMUP MC: 4/4 = 1 (to'g'ri = opt0; order [1,2,0] → C)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (FillWholes step): noto'g'ri kasr tug'iladi
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's2_intro', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [step, setStep] = useState(0);
  const last = lines.length - 1;
  const fills = [4, 8, 9, 9];
  const advance = () => {
    if (step >= last) return;
    const ns = step + 1; setStep(ns);
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(lines[ns]); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={step < last} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)' }}>
          <FillWholes den={4} filled={fills[step]} wholes={3} animate={false}/>
          <div className="ag-readout">
            {step >= 2 ? <Frac n={9} d={4} size="mid" color={T.accent}/> : <span className="dm-prob" style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}>{fills[step]} / 4</span>}
          </div>
        </div>
        {step >= last
          ? <div className="frame-success fade-up" style={{ minHeight: 56 }}><p className="body" style={{ margin: 0 }}>{mt(t(c.note))}</p></div>
          : <button className="btn-white-accent fade-up" onClick={advance} disabled={audio.isPlaying && !audio.muted} style={{ alignSelf: 'flex-start', padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (FillWholes mixed + bo'lish-qoldiq): aralash son tug'iladi
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's3_intro', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [step, setStep] = useState(0);
  const last = lines.length - 1;
  const advance = () => {
    if (step >= last) return;
    const ns = step + 1; setStep(ns);
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(lines[ns]); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={step < last} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)' }}>
          <FillWholes den={4} filled={9} wholes={3} mixed={true} animate={false}/>
          <div className="ag-readout">
            {step >= 2
              ? <><Frac n={9} d={4} size="mid"/><Op>=</Op><span className="mix-read"><b>2</b><Frac n={1} d={4} size="sm" color={T.success}/></span></>
              : <Frac n={9} d={4} size="mid"/>}
            {step >= 3 && <span className="nl-div-note">9 ÷ 4 = 2, qoldiq 1</span>}
          </div>
        </div>
        {step >= last
          ? <div className="frame-success fade-up" style={{ minHeight: 56 }}><p className="body" style={{ margin: 0 }}>{mt(t(c.note))}</p></div>
          : <button className="btn-white-accent fade-up" onClick={advance} disabled={audio.isPlaying && !audio.muted} style={{ alignSelf: 'flex-start', padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>}
      </div>
    </Stage>
  );
};

// s4 — RULE: 3 ta'rif + "yig'indi, ko'paytma emas" ogohlantirish + fakt
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's4_intro', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [showFact, setShowFact] = useState(false);
  const revealFact = () => { if (showFact) return; setShowFact(true); if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(lines[1]); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={false} onClick={onNext} label={<NextLabel/>}/></>);
  const defs = [[c.def1_h, c.def1, T.success], [c.def2_h, c.def2, T.accent], [c.def3_h, c.def3, T.blue]];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 13px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {defs.map(([h, body, col], i) => (
            <div key={i} className="frame" style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: 'clamp(11px, 2vw, 14px) clamp(13px, 2.3vw, 16px)' }}>
              <span className="mono" style={{ fontWeight: 700, color: col, flexShrink: 0, fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(h)}</span>
              <span className="body" style={{ margin: 0 }}>{mt(t(body))}</span>
            </div>
          ))}
        </div>
        <div className="frame-tip fade-up delay-2" style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn))}</p>
        </div>
        {showFact
          ? <FactCard text={c.fact} badge={FB_HIST} anim={<AnimMixed/>}/>
          : <button className="btn-ghost fade-up" onClick={revealFact} style={{ alignSelf: 'flex-start', padding: 'clamp(8px, 1.4vw, 10px) clamp(14px, 2vw, 18px)', fontSize: 'clamp(12px, 1.5vw, 13px)', color: T.blue }}>{t(c.fact_btn)}</button>}
      </div>
    </Stage>
  );
};

// s5 — TEST SeqMC: 5 ta oson savol
const Screen5 = (props) => <SeqMC {...props} screenContent={CONTENT.s5} scored={true}/>;

// s6 — TEST DragClassify
const Screen6 = (props) => <DragClassify {...props} idx={props.screen} screenContent={CONTENT.s6}/>;

// s7 — TEST MixedInput: 7/4 = 1 butun 3/4
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <MixedInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} w={1} num={3} den={4}
    figure={(solved) => <FillWholes den={4} filled={7} wholes={2} mixed={solved}/>}/>;
};

// s8 — TEST: noto'g'risini top (to'g'ri = opt0; order [1,2,0] → C)
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={() => <FillWholes den={4} filled={5} wholes={2}/>} factOnCorrect={<FactCard text={c.fact} badge={FB_LIFE} anim={<AnimCup/>}/>}/>;
};

// s9 — CASE intro (Oybek 11/4)
const Screen9 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio([{ id: 's9_intro', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={false} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 'clamp(16px, 3vw, 22px)' }}>
          <FillWholes den={4} filled={11} wholes={3}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.body))}</p>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.hint_card))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s10 — CASE MC: 11/4 = 2 3/4 (to'g'ri = opt0; order [2,0,3,1] → B)
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_LIFE} anim={<AnimClock/>}/>}/>;
};

// s11 — TEST DragOrder
const Screen11 = (props) => <DragOrder {...props} idx={props.screen} screenContent={CONTENT.s11}/>;

// s12 — YAKUNIY TEST SeqMix (scope='final')
const Screen12 = (props) => <SeqMix {...props} screenContent={CONTENT.s12}/>;

// s13 — SUMMARY (Dars09-13 kanonik): score + hookni yopadi + ConnectionsBlock
const Screen13 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio([{ id: 's13_intro', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
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
export default function MixedNumbersLesson({
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


// ============================================================
// CSS — bazaviy qism (Dars28 etalonidan) + frac_5_13 MATH-dumi
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


/* MATH neg_5_02: CoordLine — gorizontal koordinata o'qi (dars maqsadi) + mirror (qarama-qarshi). */
.cn { display: block; }
.cn-neg { fill: rgba(1, 154, 203, 0.10); }
.cn-pos { fill: rgba(255, 79, 40, 0.06); }
.cn-axis { stroke: #0E0E10; stroke-width: 2; }
.cn-arrow { fill: #0E0E10; }
.cn-tick { stroke: #A7A6A2; stroke-width: 1.5; }
.cn-tick0 { stroke: #019ACB; stroke-width: 2.6; }
.cn-tickhl { stroke: #FF4F28; stroke-width: 2.4; }
.cn-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 12px; fill: #5A5A60; }
.cn-lbl0 { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; fill: #019ACB; }
.cn-lblhl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; fill: #FF4F28; }
.cn-mk { transition: transform 0.42s cubic-bezier(0.34, 1.2, 0.64, 1); }
.cn-pin { fill: #FF4F28; stroke: #FFFFFF; stroke-width: 1.4; transform-box: fill-box; transform-origin: center bottom; animation: cnPulse 2.4s ease-in-out infinite; }
.cn-pin-ok { fill: #1F7A4D; }
.cn-pin2 { fill: #019ACB; stroke: #FFFFFF; stroke-width: 1.4; animation: none; }
.cn-dot { fill: #FF4F28; }
.cn-dot-ok { fill: #1F7A4D; }
@keyframes cnPulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
/* mirror: noldan teng masofa punktiri (qarama-qarshi simmetriya). */
.cn-span { stroke: #019ACB; stroke-width: 2; stroke-dasharray: 3 3; opacity: 0.55; animation: cnSpan 2.8s ease-in-out infinite; }
@keyframes cnSpan { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
.cn-readout { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); flex-wrap: wrap; justify-content: center; }
.cn-ro-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); text-transform: uppercase; letter-spacing: 0.06em; color: #A7A6A2; }
.cn-ro-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.4vw, 24px); color: #FF4F28; }
.cn-ro-opp { color: #019ACB; }
.cn-ro-sep { width: 1px; height: 20px; background: #E4E1DA; }

/* MATH neg_5_02: od — tartiblash kartalari (o'sish tartibi tap-in-order). */
.od-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); }
.od-card { position: relative; cursor: pointer; border: 1.5px solid #A7A6A2; background: #FFFFFF; border-radius: 14px; padding: clamp(14px, 2.6vw, 22px) clamp(6px, 1.4vw, 12px); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.16s; }
.od-card:hover:not(:disabled) { border-color: #FF4F28; }
.od-card:disabled { cursor: default; }
.od-temp { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.8vw, 26px); color: #0E0E10; }
.od-on { border-color: #FF4F28; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 18px -6px rgba(255, 79, 40, 0.28); }
.od-badge { position: absolute; top: -9px; left: -9px; width: 24px; height: 24px; border-radius: 50%; background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(255, 79, 40, 0.5); }
.od-ok { border-color: #1F7A4D; box-shadow: 0 0 0 2px #1F7A4D inset, 0 8px 18px -6px rgba(31, 122, 77, 0.28); }
.od-ok .od-badge { background: #1F7A4D; box-shadow: 0 4px 10px -3px rgba(31, 122, 77, 0.5); }
.od-bad { border-color: #FF4F28; animation: odShake 0.4s ease; }
@keyframes odShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

/* MATH neg_5_02: ms — multi-select (qaysi juftlar qarama-qarshi). */
.ms-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); }
.ms-card { cursor: pointer; display: flex; align-items: center; gap: clamp(8px, 1.6vw, 12px); border: 1.5px solid #A7A6A2; background: #FFFFFF; border-radius: 14px; padding: clamp(12px, 2.2vw, 18px) clamp(12px, 2vw, 18px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.16s; text-align: left; }
.ms-card:hover:not(:disabled) { border-color: #FF4F28; }
.ms-card:disabled { cursor: default; }
.ms-box { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; border: 1.6px solid #A7A6A2; display: flex; align-items: center; justify-content: center; color: #FFFFFF; transition: all 0.14s; }
.ms-box-on { background: #FF4F28; border-color: #FF4F28; }
.ms-pair { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.6vw, 20px); color: #0E0E10; }
.ms-on { border-color: #FF4F28; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 18px -6px rgba(255, 79, 40, 0.24); }
.ms-bad { border-color: #FF4F28; animation: odShake 0.4s ease; }
.ms-ok { border-color: #1F7A4D; box-shadow: 0 0 0 2px #1F7A4D inset, 0 8px 18px -6px rgba(31, 122, 77, 0.26); }
.ms-ok .ms-box-on { background: #1F7A4D; border-color: #1F7A4D; }

/* MATH neg_5_02: fakt-animatsiyalar (CSS-only loop, ko'k tema, qutiga sig'adi). */
/* Tarix: qadimgi sanoq tayoqchalari navbatma-navbat yorishadi. */
.fa-hist { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.fa-hist-r { width: 7px; background: #019ACB; opacity: 0.3; border-radius: 3px; animation: faHist 2s ease-in-out infinite; }
.fa-hist-r:nth-child(1) { height: 40%; }
.fa-hist-r:nth-child(2) { height: 70%; }
.fa-hist-r:nth-child(3) { height: 100%; }
.fa-hist-r:nth-child(4) { height: 60%; }
.fa-hist-r:nth-child(5) { height: 85%; }
@keyframes faHist { 0%, 100% { opacity: 0.25; } 45% { opacity: 0.95; } }
/* Eng past harorat: termometr simobi pastga tushadi. */
.fa-th { width: clamp(34px, 7vw, 46px); height: auto; }
.fa-th-tube { fill: rgba(1, 154, 203, 0.12); stroke: #019ACB; stroke-width: 1.6; }
.fa-th-bulb { fill: #019ACB; }
.fa-th-merc { fill: #019ACB; transform-box: fill-box; transform-origin: bottom; animation: faTh 2.8s ease-in-out infinite; }
@keyframes faTh { 0%, 100% { transform: scaleY(0.2); } 55%, 75% { transform: scaleY(1); } }
/* IT: ikkilik bitlar yonadi, belgi-bit ko'kroq. */
.fa-bit { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; width: clamp(76px, 15vw, 104px); }
.fa-bit-c { aspect-ratio: 1; background: #019ACB; opacity: 0.22; border-radius: 4px; animation: faBit 1.8s ease-in-out infinite; }
.fa-bit-sign { opacity: 0.5; box-shadow: 0 0 0 2px #019ACB; }
@keyframes faBit { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.92; } }

/* MATH: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы. */
/* MATH dec_5_05: AreaModel — единичный квадрат 10×10, столбцы×строки = сотые клетки. */
.am-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; width: clamp(124px, 32vw, 168px); aspect-ratio: 1; }
.am-cell { background: #EEEAE2; border-radius: 2px; transition: background 0.45s ease; }
.am-col { background: rgba(255, 79, 40, 0.24); }
.am-row { background: rgba(1, 154, 203, 0.24); }
.am-both { background: #1F7A4D; }

/* MATH dec_5_05: mbk — пошаговые клетки ввода (без запятой / знаки / ответ). */
.mbk-rows { display: flex; flex-direction: column; gap: 10px; }
.mbk-row { display: flex; align-items: center; justify-content: space-between; gap: clamp(10px, 2vw, 18px); }
.mbk-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.3vw, 17px); color: #0E0E10; }
.mbk-box { width: clamp(76px, 17vw, 98px) !important; font-size: clamp(18px, 3.4vw, 24px) !important; text-align: center; flex-shrink: 0; }
.mbk-wrong { box-shadow: 0 0 0 2px #D8A93A inset !important; }
.mbk-num { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(255, 79, 40, 0.45); }
.mbk-num-ok { background: #1F7A4D; box-shadow: 0 4px 10px -3px rgba(31, 122, 77, 0.45); }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}





/* ============================================================ */
/* MATH: MagBar (magnituda) + ko'paytirish yozuvi + tasniflash + fakt-anim (dec_5_05). */
/* ============================================================ */
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }
.dm-res { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(26px, 6vw, 40px); color: #1F7A4D; }

.mb-wrap { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 460px; margin: 0 auto; }
.mb-row { display: flex; align-items: center; gap: 12px; }
.mb-cap { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 19px); color: #0E0E10; min-width: 46px; text-align: right; }
.mb-track { flex: 1; height: 22px; background: rgba(58, 53, 48, 0.10); border-radius: 11px; overflow: hidden; }
.mb-fill { height: 100%; border-radius: 11px; transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.mb-fill-base { background: #A7A6A2; }
.mb-fill-res { background: #FF4F28; }
.mb-fill-res.mb-more { background: #1F7A4D; }

/* Tasniflash (tap-to-place) */
.cl-pool { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 46px; align-items: center; }
.cl-pool-done { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A7A6A2; }
.cl-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.2vw, 18px); color: #0E0E10; background: #FFFFFF; border: 2px solid #E8E4DC; border-radius: 12px; padding: 8px 13px; cursor: pointer; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.25); transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
.cl-chip:disabled { cursor: default; }
.cl-chip-sel { border-color: #FF4F28; background: #FFE8E1; transform: translateY(-2px) scale(1.05); }
.cl-bins { display: flex; gap: 10px; }
.cl-bin { flex: 1; min-width: 0; border: 2px dashed #D8D3C9; border-radius: 16px; padding: 10px; min-height: 96px; display: flex; flex-direction: column; gap: 8px; cursor: default; transition: border-color 0.15s ease, background 0.15s ease; }
.cl-bin-active { border-color: #FF4F28; background: rgba(255, 79, 40, 0.05); cursor: pointer; }
.cl-bin-h { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 1.8vw, 14px); font-weight: 600; color: #5A5A60; text-align: center; }
.cl-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.cl-chip-in { box-shadow: none; }
.cl-chip-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; }
.cl-chip-bad { border-color: #FF4F28; background: #FFE8E1; }

/* Fakt-animatsiyalar (ko'k tema) */
.pa-dc { display: flex; align-items: baseline; justify-content: center; gap: 2px; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 7vw, 40px); color: #019ACB; }
.pa-dc-sep { position: relative; display: inline-block; width: 0.55em; }
.pa-dc-comma, .pa-dc-dot { position: absolute; left: 0; bottom: 0; }
.pa-dc-comma { animation: pa-dc-a 2.4s steps(1) infinite; }
.pa-dc-dot { animation: pa-dc-b 2.4s steps(1) infinite; }
@keyframes pa-dc-a { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
@keyframes pa-dc-b { 0%, 50% { opacity: 0; } 50.01%, 100% { opacity: 1; } }
.pa-st { display: flex; align-items: center; justify-content: center; gap: 1px; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px, 6vw, 38px); color: #019ACB; }
.pa-st-c { opacity: 0; animation: pa-st-in 1.8s ease-in-out infinite; }
@keyframes pa-st-in { 0% { opacity: 0; transform: translateY(4px); } 20%, 70% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; } }

/* MATH dec_5_05: SeqMC — ketma-ket tez MC progress nuqtalari. */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

/* MATH dec_5_05: MulSolve — "harakatlanuvchi yechim" (vergulsiz → sanash → vergul tushadi). */
.ms-solve { display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); align-items: center; }
.ms-row { display: flex; align-items: baseline; gap: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px, 5.5vw, 38px); color: #0E0E10; }
.ms-fac { transition: color 0.4s ease; }
.ms-dim { color: #A7A6A2; }
.ms-op { color: #5A5A60; font-weight: 600; }
.ms-digits { display: inline-flex; align-items: baseline; }
.ms-dwrap { display: inline-flex; align-items: baseline; }
.ms-d { display: inline-block; padding: 0 1px; border-radius: 4px; transition: background 0.4s ease, color 0.4s ease; }
.ms-d-hl { background: #FBF3D6; color: #0E0E10; }
.ms-comma { display: inline-block; color: #1F7A4D; animation: ms-drop 0.55s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes ms-drop { 0% { opacity: 0; transform: translateY(-0.7em) scale(0.5); } 100% { opacity: 1; transform: none; } }
.ms-result { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px, 5.5vw, 38px); color: #1F7A4D; }

/* MATH dec_5_05: rule-chip — birlashgan qoida ekranida yopilgan qoida tugmasi. */
.rule-chip { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer; background: #E3F0E8; border: none; border-radius: 12px; padding: clamp(10px, 1.8vw, 13px) clamp(12px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); transition: box-shadow 0.2s ease; }
.rule-chip:hover { box-shadow: 0 10px 22px -6px rgba(31, 122, 77, 0.3); }
.rule-chip-ic { display: flex; color: #1F7A4D; flex-shrink: 0; }
.rule-chip-tx { flex: 1; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px, 1.7vw, 15px); color: #1F7A4D; }
.rule-chip-act { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 12px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A60; flex-shrink: 0; }

/* MATH dec_5_05: case-ctx — birlashgan masala ekranida shart ixcham KO'RINIB qoladigan qatori. */
.case-ctx { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; background: #EFEEE9; border-radius: 12px; padding: clamp(9px, 1.7vw, 12px) clamp(12px, 2vw, 16px); }
.case-ctx-tag { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A60; }
.case-ctx-tx { flex: 1; min-width: 0; font-size: clamp(12px, 1.6vw, 14px); color: #0E0E10; }
.case-ctx-prob { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(15px, 2.4vw, 19px); color: #0E0E10; }

/* MATH dec_5_05: sort — ketma-ket tasniflash (son chiqadi → chiroyli savatga joylaydi). */
.sort-tray { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 16px; padding: clamp(13px, 2.5vw, 18px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); min-height: clamp(84px, 15vw, 100px); }
.sort-tray-card { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #0E0E10; animation: sort-pop 0.4s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes sort-pop { 0% { opacity: 0; transform: translateY(-8px) scale(0.8); } 100% { opacity: 1; transform: none; } }
.sort-tray-ask { font-size: clamp(12px, 1.6vw, 13px); color: #5A5A60; }
.sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2vw, 14px); }
.sort-bin { display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border: none; border-radius: 16px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.16); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease; min-height: clamp(94px, 17vw, 116px); text-align: left; }
.sort-bin:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 28px -6px rgba(58, 53, 48, 0.24); }
.sort-bin:disabled { cursor: default; }
.sort-bin-h { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); padding: 5px 10px; border-radius: 9px; }
.sort-bin-sq .sort-bin-h { color: #019ACB; background: #EAF6FB; }
.sort-bin-cu .sort-bin-h { color: #5A5A60; background: #EFEEE9; }
.sort-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; }
.sort-chip-in { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.8vw, 14px); color: #1F7A4D; background: #E3F0E8; border-radius: 9px; padding: 5px 9px; animation: sort-pop 0.35s ease both; }
.sort-bin-bad { animation: odShake 0.4s ease; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 22px -6px rgba(255, 79, 40, 0.3); }

/* MATH dec_5_05: bridge — slaydlararo ma'noli o'tish qatori (faza chegarasi). */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* ============================================================ */
/* MATH frac_5_13: FillWholes (to'lib-toshuvchi butunlar) + NumLine + dnd (classify/order) + mix-input */
/* ============================================================ */
.fw-row { display: flex; gap: clamp(10px, 2.5vw, 18px); width: 100%; justify-content: center; flex-wrap: wrap; }
.fw-box { position: relative; display: flex; gap: 3px; padding: 5px; background: #FBF8F2; border: 2px solid #E4E1DA; border-radius: 10px; flex: 1; min-width: clamp(64px, 16vw, 96px); max-width: 116px; transition: border-color 0.4s ease, box-shadow 0.4s ease; }
.fw-box-done { border-color: #1F7A4D; box-shadow: 0 0 0 2px rgba(31, 122, 77, 0.18), 0 8px 18px -8px rgba(31, 122, 77, 0.35); animation: fwPulse 1.6s ease-in-out; }
@keyframes fwPulse { 0%, 100% { box-shadow: 0 0 0 2px rgba(31, 122, 77, 0.18), 0 8px 18px -8px rgba(31, 122, 77, 0.35); } 50% { box-shadow: 0 0 0 4px rgba(31, 122, 77, 0.30), 0 10px 22px -8px rgba(31, 122, 77, 0.5); } }
.fw-cell { flex: 1; aspect-ratio: 1; background: #EEEAE2; border-radius: 4px; transition: background 0.45s ease; }
.fw-on { background: #1F7A4D; }
.fw-on-whole { background: #1F7A4D; }
.fw-on-part { background: #FF4F28; }
.fw-badge { position: absolute; top: -10px; right: -8px; min-width: 22px; height: 22px; padding: 0 5px; border-radius: 11px; background: #1F7A4D; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(31, 122, 77, 0.5); }

.nl-wrap { position: relative; width: 100%; max-width: 520px; margin: 0 auto; height: 64px; }
.nl-track { position: absolute; left: 2%; right: 2%; top: 26px; height: 4px; background: rgba(167, 166, 162, 0.4); border-radius: 99px; }
.nl-dot { position: absolute; top: 26px; transform: translate(-50%, -50%); width: 14px; height: 14px; border-radius: 50%; border: none; background: #CFCBC2; cursor: pointer; padding: 0; transition: transform 0.15s, background 0.2s; }
.nl-dot:hover:not(:disabled) { transform: translate(-50%, -50%) scale(1.3); background: #FF4F28; }
.nl-dot:disabled { cursor: default; }
.nl-dot-int { width: 10px; height: 22px; border-radius: 4px; background: #A7A6A2; }
.nl-int-lbl { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #5A5A60; }
.nl-dot-sel { background: #FF4F28 !important; box-shadow: 0 0 0 4px rgba(255, 79, 40, 0.2); }
.nl-dot-ok { background: #1F7A4D !important; box-shadow: 0 0 0 4px rgba(31, 122, 77, 0.22); }
.nl-marker { position: absolute; top: 26px; transform: translate(-50%, -50%); width: 18px; height: 18px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 0 4px #F6F4EF, 0 4px 12px -2px rgba(255, 79, 40, 0.5); pointer-events: none; transition: left 0.25s cubic-bezier(0.22, 1, 0.36, 1); z-index: 2; }
.nl-marker-ok { background: #1F7A4D; box-shadow: 0 0 0 4px #F6F4EF, 0 4px 12px -2px rgba(31, 122, 77, 0.5); }
.nl-div-note { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 1.6vw, 14px); font-weight: 700; color: #019ACB; }
.mix-read { display: inline-flex; align-items: center; gap: 4px; }
.mix-read b { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(24px, 5vw, 30px); color: #1F7A4D; }

/* mix-tag (SeqMix tur belgisi) */
.mix-tag { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #FF4F28; background: #FFE8E1; border-radius: 8px; padding: 4px 9px; }

/* mixed-input: butun + kasr ikki maydon */
.mix-frac { display: inline-flex; flex-direction: column; align-items: center; }
.mix-top { width: clamp(56px, 12vw, 72px) !important; font-size: clamp(18px, 3.5vw, 22px) !important; padding: 4px 8px !important; }
.mix-bar { width: clamp(40px, 9vw, 56px); height: 2px; background: #0E0E10; margin: 4px 0; }
.mix-den { font-family: 'Fraunces', serif; font-size: clamp(20px, 4vw, 26px); color: #0E0E10; }

/* dnd — drag-and-drop (Dars37 modeli) */
.dnd-bins { display: flex; gap: clamp(8px, 1.8vw, 14px); }
.dnd-bin { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; background: #FDFBF7; border: 2px dashed #A7A6A2; border-radius: 14px; padding: clamp(8px, 1.5vw, 11px) clamp(6px, 1.2vw, 10px); transition: border-color 0.2s, background 0.2s; }
.dnd-bin-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-bin-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 1.5vw, 13px); color: #5A5A60; text-align: center; }
.dnd-bin-slot { display: flex; flex-direction: column; gap: 6px; min-height: clamp(44px, 9vw, 58px); align-items: stretch; justify-content: center; }
.dnd-tray { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: clamp(9px, 1.6vw, 12px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.dnd-tray-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #A7A6A2; text-transform: uppercase; letter-spacing: 0.06em; }
.dnd-chip { cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none; background: #FFFFFF; border: 1.5px solid #FF4F28; border-radius: 99px; padding: clamp(7px, 1.3vw, 9px) clamp(12px, 2vw, 16px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 1.7vw, 15px); color: #0E0E10; box-shadow: 0 4px 12px -4px rgba(255, 79, 40, 0.25); transition: transform 0.15s, box-shadow 0.15s, background 0.18s; text-align: center; }
.dnd-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(255, 79, 40, 0.38); }
.dnd-chip-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 8px 20px -5px rgba(255, 79, 40, 0.5); }
.dnd-chip-in { cursor: pointer; border-color: #019ACB; box-shadow: 0 4px 12px -4px rgba(1, 154, 203, 0.28); }
.dnd-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; box-shadow: 0 4px 12px -4px rgba(31, 122, 77, 0.3); }

/* dnd-slots — tartiblash kataklari (order) */
.dnd-slots { display: flex; gap: clamp(8px, 1.8vw, 14px); }
.dnd-slot { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center; min-height: clamp(56px, 11vw, 72px); background: #FDFBF7; border: 2px dashed #A7A6A2; border-radius: 14px; padding: clamp(8px, 1.5vw, 12px); transition: border-color 0.2s, background 0.2s; }
.dnd-slot-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-slot-ok { border-color: #1F7A4D; background: #E3F0E8; }
.dnd-slot-pos { position: absolute; top: -9px; left: -9px; width: 22px; height: 22px; border-radius: 50%; background: #5A5A60; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
.dnd-slot-empty { color: #CFCBC2; font-size: 20px; }

/* fakt-anim: cup (retsept) + clock (vaqt) */
.fa-cup { position: relative; width: clamp(56px, 12vw, 76px); height: clamp(56px, 12vw, 76px); border: 3px solid #019ACB; border-radius: 6px 6px 16px 16px; overflow: hidden; background: rgba(1, 154, 203, 0.06); }
.fa-cup-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; background: linear-gradient(180deg, #4FC3E8, #019ACB); animation: faCup 2.6s ease-in-out infinite; }
@keyframes faCup { 0%, 100% { height: 45%; } 50% { height: 75%; } }
.fa-cup-mark { position: absolute; left: 0; top: 40%; width: 8px; height: 2px; background: #019ACB; opacity: 0.6; }
.fa-clock { position: relative; width: clamp(54px, 11vw, 72px); height: clamp(54px, 11vw, 72px); border: 3px solid #019ACB; border-radius: 50%; background: rgba(1, 154, 203, 0.06); }
.fa-clock-h { position: absolute; left: 50%; top: 50%; width: 3px; height: 28%; background: #019ACB; transform-origin: bottom center; transform: translate(-50%, -100%) rotate(0deg); border-radius: 2px; animation: faClockH 6s linear infinite; }
.fa-clock-m { position: absolute; left: 50%; top: 50%; width: 2.5px; height: 38%; background: #4FC3E8; transform-origin: bottom center; transform: translate(-50%, -100%) rotate(90deg); border-radius: 2px; animation: faClockM 2.4s linear infinite; }
@keyframes faClockH { from { transform: translate(-50%, -100%) rotate(0deg); } to { transform: translate(-50%, -100%) rotate(360deg); } }
@keyframes faClockM { from { transform: translate(-50%, -100%) rotate(0deg); } to { transform: translate(-50%, -100%) rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .fw-box-done, .fa-cup-fill, .fa-clock-h, .fa-clock-m { animation: none !important; }
  .fa-cup-fill { height: 60%; }
}

`;
