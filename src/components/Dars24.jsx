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
// --- POD UROK: dec_5_01 — O'nli kasr (konsept) / Десятичная дробь — концепт (etalon: Dars28) ---
// Markaziy misconception M1: "verguldan keyin raqam ko'p = son katta" (0,45 > 0,5? — YO'Q).
// Asosiy g'oya: o'nli kasr = maxraji 10/100/1000 bo'lgan kasr; vergul butunni ulushlardan ajratadi.
// Xonalar o'ngga: o'ndan, yuzdan, mingdan — har biri 10 marta kichik. Solishtirish: nol qo'shib xonama-xona.
// Vizualizatorlar: DecimalGrid (10/100 katak jonli to'lish), PlaceTable (razryad), HookGrid, NumberLine.
// Hook: 0,45 vs 0,5. Case: Oybek kitobning 0,7 qismini o'qidi → son o'qiga belgilash.
// Faktlar: al-Koshiy Samarqand (tarix) / soniyaning yuzdan ulushi (sport) / metr tizimi (fan).
// ============================================================
const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'dec-5-01-v1',
  lessonTitle: { ru: 'Десятичная дробь — концепт', uz: "O'nli kasr — konsept" }
};
// Eslatma: ekran ID lari qattiq indeks emas — har komponent jonli `screen` propidan idx oladi.
// Reorder qilishda faqat shu massiv + screens massivini bir xil tartibda yangilang.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',          scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 3
  { id: 's4_5', type: 'rule',       template: 'custom',         scored: false, scope: null },       // 4 (qoida + M1 ogohlantirish birlashgan)
  { id: 's6',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },  // 5
  { id: 's7',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },  // 6 (sort razryad)
  { id: 's8',  type: 'test',        template: 'DecTap',         scored: true,  scope: 'practice' },  // 7 (raqam-tap)
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },  // 8
  { id: 's_practice', type: 'test', template: 'SeqMC',          scored: true,  scope: 'practice' },  // 9 (solishtirish)
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },  // 10 (xato-top)
  { id: 's11_12', type: 'case',     template: 'custom',         scored: true,  scope: 'final' },     // 11 (masala + son o'qi)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 12
];

const CONTENT = {
  // ===== s0 HOOK — M1: ko'p raqam ≠ katta son (0,45 vs 0,5) =====
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Что значит запятая в числе?', uz: "Songa vergul nima uchun kerak?" },
    lead: { ru: 'Во многих числах есть запятая: 0,5 ; 1,45 ; 3,14. Возьмём 0,5 и 0,45 — у второго цифр больше. Значит, оно больше?', uz: "Ko'p sonlarda vergul bor: 0,5 ; 1,45 ; 3,14. 0,5 va 0,45 ni olaylik — ikkinchisida raqam ko'proq. Demak, u kattaroqmi?" },
    opt0: { ru: '0,45 больше — цифр больше', uz: "0,45 katta — raqam ko'proq" },
    opt1: { ru: '0,5 больше', uz: "0,5 katta" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha ishonchim komil emas" },
    reveal0: { ru: 'Так думают многие. Но дело не в числе цифр, а в разрядах. К концу урока проверим.', uz: "Ko'pchilik shunday o'ylaydi. Lekin gap raqam sonida emas, xonalarda. Dars oxirida tekshiramiz." },
    reveal1: { ru: 'Интуиция подсказывает верно. Почему — разберём на этом уроке.', uz: "Sezgingiz to'g'ri aytyapti. Nega — shu darsda ko'ramiz." },
    reveal2: { ru: 'Честно. К концу урока ты будешь сравнивать такие числа уверенно.', uz: "Halol. Dars oxirida bunday sonlarni ishonch bilan solishtirasiz." },
    audio: { ru: "Во многих числах есть запятая. Возьмём ноль целых пять десятых и ноль целых сорок пять сотых. У второго цифр после запятой больше. Значит ли это, что оно больше? Выбери свой ответ.", uz: "Ko'p sonlarda vergul bor. Nol butun o'ndan besh va nol butun yuzdan qirq beshni olaylik. Ikkinchisida verguldan keyin raqam ko'proq. Bu uni kattaroq qiladimi? Javobingizni tanlang." }
  },

  // ===== s1 WARMUP — kasrlarni eslash (SeqMC, tap) =====
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    title: { ru: 'Разминка про дроби', uz: "Kasrlar bo'yicha mashq" },
    lead: { ru: 'Четыре быстрых вопроса. Выбери ответ.', uz: "To'rtta tez savol. Javobni tanlang." },
    bridge: { ru: 'Прежде чем разгадать загадку — вспомним дроби.', uz: "Topishmoqni yechishdan oldin — kasrlarni eslaylik." },
    questions: [
      {
        q: { ru: '1/2 = ?/10', uz: '1/2 = ?/10' },
        say: { ru: "Чему равна одна вторая со знаменателем десять?", uz: "Ikkidan bir maxraji o'n bilan nechaga teng?" },
        opts: [{ ru: '5/10', uz: '5/10' }, { ru: '2/10', uz: '2/10' }, { ru: '1/10', uz: '1/10' }],
        correct: 0,
        ok: { ru: 'Верно: половина это пять десятых.', uz: "To'g'ri: yarim — o'ndan besh." },
        no: { ru: 'Раздели целое на десять и возьми половину.', uz: "Butunni o'nga bo'lib, yarmini oling." }
      },
      {
        q: { ru: '1/5 = ?/10', uz: '1/5 = ?/10' },
        say: { ru: "Одна пятая со знаменателем десять — это сколько?", uz: "Beshdan bir maxraji o'n bilan necha bo'ladi?" },
        opts: [{ ru: '2/10', uz: '2/10' }, { ru: '5/10', uz: '5/10' }, { ru: '1/10', uz: '1/10' }],
        correct: 0,
        ok: { ru: 'Верно: одна пятая это две десятых.', uz: "To'g'ri: beshdan bir — o'ndan ikki." },
        no: { ru: 'Умножь числитель и знаменатель на два.', uz: "Surat va maxrajni ikkiga ko'paytiring." }
      },
      {
        q: { ru: '1/2 или 1/4 — что больше?', uz: "1/2 yoki 1/4 — qaysi katta?" },
        say: { ru: "Что больше: одна вторая или одна четвёртая?", uz: "Qaysi katta: ikkidan bir yoki to'rtdan bir?" },
        opts: [{ ru: '1/2', uz: '1/2' }, { ru: '1/4', uz: '1/4' }, { ru: 'Равны', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: половина больше четверти.', uz: "To'g'ri: yarim chorakdan katta." },
        no: { ru: 'Чем больше частей, тем меньше каждая.', uz: "Bo'lak ko'p bo'lsa, har biri kichik." }
      },
      {
        q: { ru: '7/10 — больше или меньше целого?', uz: "7/10 — butundan katta yoki kichik?" },
        say: { ru: "Семь десятых больше или меньше целого?", uz: "O'ndan yetti butundan katta yoki kichik?" },
        opts: [{ ru: 'Меньше', uz: 'Kichik' }, { ru: 'Больше', uz: 'Katta' }, { ru: 'Равно', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: целое это 10/10, а 7/10 меньше.', uz: "To'g'ri: butun — 10/10, 7/10 esa kichik." },
        no: { ru: 'Целое это десять десятых. 7 меньше 10.', uz: "Butun — o'ndan o'n. 7 esa 10 dan kichik." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем разгадать загадку, вспомним дроби. Четыре быстрых вопроса.", uz: "Topishmoqni yechishdan oldin, kasrlarni eslaylik. To'rtta tez savol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Попробуй ещё раз.", uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: "Отлично, размялись.", uz: "Zo'r, mashq tugadi." }
    }
  },

  // ===== s2 EXPLORATION — o'ndan ulushlar (slayder + DecimalGrid) =====
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Десятые доли единицы', uz: "Birlikning o'ndan ulushlari" },
    lead: { ru: 'Раз половина это 5/10, посмотрим на десятые. Единица поделена на 10 равных полос — каждая 0,1. Двигайте ползунок.', uz: "Yarim 5/10 ekan, o'ndan ulushlarga qaraymiz. Birlik 10 ta teng bo'lakka bo'lingan — har biri 0,1. Slayderni suring." },
    bridge: { ru: 'Размялись. Теперь разберём, что прячется за запятой.', uz: "Mashq qildik. Endi vergul ortida nima yashirinishini ko'ramiz." },
    note: { ru: 'Что делать: тяни ползунок до 0,3 — три полосы из десяти. Дойдёшь — станет ЗЕЛЁНЫМ, значит верно.', uz: "Nima qilish: slayderni 0,3 gacha torting — o'ntadan uch bo'lak. Yetsangiz YASHIL bo'ladi, demak to'g'ri." },
    note_done: { ru: 'Зелёный — ты на цели! 0,3 это три десятых: 3/10.', uz: "Yashil — maqsadga yetdingiz! 0,3 — o'ndan uch: 3/10." },
    audio: { ru: "Раз половина это пять десятых, посмотрим на десятые доли. Единица разделена на десять равных полос, каждая это одна десятая. Двигайте ползунок и заполняйте полосы. Остановитесь на ноль целых три десятых.", uz: "Yarim o'ndan besh ekan, o'ndan ulushlarga qaraymiz. Birlik o'nta teng bo'lakka bo'lingan, har biri o'ndan bir. Slayderni suring va bo'laklarni to'ldiring. Nol butun o'ndan uchda to'xtang." }
  },

  // ===== s3 EXPLORATION — yuzdan ulushlar (slayder + DecimalGrid 100) =====
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Сотые доли единицы', uz: "Birlikning yuzdan ulushlari" },
    lead: { ru: 'А если доля ещё меньше? Каждую полосу делим ещё на 10 — всего 100 клеток, каждая 0,01. Двигайте ползунок.', uz: "Agar ulush yanada kichik bo'lsa-chi? Har bo'lakni yana 10 ga bo'lamiz — jami 100 ta katak, har biri 0,01. Slayderni suring." },
    note: { ru: 'Что делать: тяни ползунок до 0,45 — сорок пять клеток из ста. Дойдёшь — станет ЗЕЛЁНЫМ, значит верно.', uz: "Nima qilish: slayderni 0,45 gacha torting — yuzdan qirq besh katak. Yetsangiz YASHIL bo'ladi, demak to'g'ri." },
    note_done: { ru: 'Зелёный — ты на цели! 0,45 это 45 сотых: 45/100.', uz: "Yashil — maqsadga yetdingiz! 0,45 — yuzdan qirq besh: 45/100." },
    audio: { ru: "А если доля ещё меньше? Каждую из десяти полос делим ещё на десять — получается сто клеток, каждая ноль целых одна сотая. Двигайте ползунок и наблюдайте, как растёт число. Остановитесь на ноль целых сорок пять сотых.", uz: "Agar ulush yanada kichik bo'lsa-chi? O'nta bo'lakning har birini yana o'nga bo'lamiz — yuzta katak chiqadi, har biri nol butun yuzdan bir. Slayderni suring va sonning o'sishini kuzating. Nol butun yuzdan qirq beshda to'xtang." }
  },

  // ===== s4 RULE 1 — o'nli kasr = kasr 10/100/1000 + PlaceTable =====
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Что такое десятичная дробь', uz: "O'nli kasr nima" },
    bridge: { ru: 'Увидели десятые и сотые. Теперь соберём правило.', uz: "O'ndan va yuzdanni ko'rdik. Endi qoidani yig'amiz." },
    rule_main: { ru: 'Десятичная дробь — это дробь со знаменателем 10, 100 или 1000. Запятая отделяет целую часть от долей.', uz: "O'nli kasr — bu maxraji 10, 100 yoki 1000 bo'lgan kasr. Vergul butun qismni ulushlardan ajratadi." },
    rule_note: { ru: 'Каждый разряд вправо в 10 раз меньше: десятые, сотые, тысячные.', uz: "Har xona o'ngga qarab 10 marta kichik: o'ndan, yuzdan, mingdan." },
    audio: { ru: "Увидели десятые и сотые, теперь соберём правило. Десятичная дробь это дробь со знаменателем десять, сто или тысяча. Запятая отделяет целую часть от долей. Каждый следующий разряд вправо в десять раз меньше: десятые, сотые, тысячные.", uz: "O'ndan va yuzdanni ko'rdik, endi qoidani yig'amiz. O'nli kasr — bu maxraji o'n, yuz yoki ming bo'lgan kasr. Vergul butun qismni ulushlardan ajratadi. Verguldan o'ngga har keyingi xona o'n marta kichik: o'ndan, yuzdan, mingdan." }
  },

  // ===== s5 RULE 2 — M1 ogohlantirish (uzunroq ≠ katta) =====
  s5: {
    eyebrow: { ru: 'Внимание', uz: "Diqqat" },
    heading: { ru: 'Длиннее — не значит больше', uz: "Uzunroq — kattaroq degani emas" },
    rule_main: { ru: 'Больше цифр после запятой — НЕ значит больше число. Сравнивайте по разрядам, а не по длине.', uz: "Verguldan keyin raqam ko'p — son KATTA degani EMAS. Uzunlik emas, xonama-xona solishtiring." },
    warn_label: { ru: 'Секрет сравнения', uz: "Solishtirish siri" },
    warn: { ru: 'Допишите ноль: 0,5 = 0,50. Теперь видно: 0,50 это 50 сотых, а 0,45 это 45 сотых. Значит 0,5 больше.', uz: "Nol qo'shing: 0,5 = 0,50. Endi ko'rinadi: 0,50 — 50 yuzdan, 0,45 — 45 yuzdan. Demak 0,5 katta." },
    audio: { ru: "Важное предупреждение. Если после запятой больше цифр, это не значит, что число больше. Секрет в том, чтобы дописать ноль. Ноль целых пять десятых это то же, что ноль целых пятьдесят сотых. А пятьдесят сотых больше сорока пяти сотых.", uz: "Muhim ogohlantirish. Verguldan keyin raqam ko'p bo'lsa, son katta degani emas. Sir shundaki, oxiriga nol qo'shiladi. Nol butun o'ndan besh — bu nol butun yuzdan ellik bilan bir xil. Yuzdan ellik esa yuzdan qirq beshdan katta." }
  },

  // ===== s6 TEST MC — 0,3 = 3/10 + al-Koshiy fakti =====
  s6: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    bridge: { ru: 'Правило знаем — теперь попробуй сам.', uz: "Qoidani bilamiz — endi o'zingiz urinib ko'ring." },
    title: { ru: 'Переведи в дробь', uz: "Kasrga aylantiring" },
    question: { ru: 'Какой обыкновенной дроби равно 0,3?', uz: "0,3 qaysi oddiy kasrga teng?" },
    opt0: { ru: '3/10', uz: '3/10' },
    opt1: { ru: '3/100', uz: '3/100' },
    opt2: { ru: '1/3', uz: '1/3' },
    opt3: { ru: '10/3', uz: '10/3' },
    correct_text: { ru: 'Верно. После запятой одна цифра — это десятые. 0,3 = 3/10.', uz: "To'g'ri. Verguldan keyin bitta raqam — bu o'ndan. 0,3 = 3/10." },
    wrong_1: { ru: 'Это сотые: 3/100 = 0,03. А в 0,3 одна цифра — десятые.', uz: "Bu yuzdan: 3/100 = 0,03. 0,3 da esa bitta raqam — o'ndan." },
    wrong_2: { ru: 'У 1/3 знаменатель 3, это не десятичная дробь. Считай цифры после запятой.', uz: "1/3 maxraji 3, bu o'nli kasr emas. Verguldan keyingi raqamni sanang." },
    wrong_3: { ru: '10/3 больше целого. А 0,3 меньше целого. Сколько цифр после запятой?', uz: "10/3 butundan katta. 0,3 esa kichik. Verguldan keyin nechta raqam?" },
    fact: { ru: 'Десятичные дроби систематизировал ал-Каши в Самарканде в XV веке, в обсерватории Улугбека.', uz: "O'nli kasrlarni XV asrda Samarqandda, Ulug'bek rasadxonasida Jamshid al-Koshiy tizimlashtirgan." },
    fact_audio: { ru: "Кстати, десятичные дроби систематизировал учёный ал-Каши в Самарканде в пятнадцатом веке, в обсерватории Улугбека.", uz: "Aytgancha, o'nli kasrlarni o'n beshinchi asrda Samarqandda, Ulug'bek rasadxonasida olim Jamshid al-Koshiy tizimlashtirgan." },
    audio: {
      intro: { ru: "Правило знаем, теперь попробуй сам. Какой обыкновенной дроби равно ноль целых три десятых? Выбери вариант.", uz: "Qoidani bilamiz, endi o'zingiz urinib ko'ring. Nol butun o'ndan uch qaysi oddiy kasrga teng? Variantni tanlang." },
      on_correct: { ru: "Верно, три десятых. Кстати, десятичные дроби систематизировал учёный ал-Каши в Самарканде в пятнадцатом веке, в обсерватории Улугбека.", uz: "To'g'ri, o'ndan uch. Aytgancha, o'nli kasrlarni o'n beshinchi asrda Samarqandda, Ulug'bek rasadxonasida olim Jamshid al-Koshiy tizimlashtirgan." },
      on_wrong: { ru: "Не совсем. Посчитай цифры после запятой.", uz: "Unchalik emas. Verguldan keyingi raqamlarni sanang." }
    }
  },

  // ===== s7 SORT — 0,372 raqamlarini xona-savatlariga (ketma-ket) =====
  s7: {
    eyebrow: { ru: 'Разряды', uz: "Xonalar" },
    title: { ru: 'Каждой цифре свой разряд', uz: "Har raqamga o'z xonasi" },
    lead: { ru: 'В числе 0,372 — три цифры. Поставь каждую в свой разряд.', uz: "0,372 sonida uch raqam. Har birini o'z xonasiga qo'ying." },
    ask: { ru: 'В какой разряд? Тапни корзину.', uz: "Qaysi xonaga? Savatni bosing." },
    bin_ondan: { ru: 'Десятые', uz: "O'ndan" },
    bin_yuzdan: { ru: 'Сотые', uz: "Yuzdan" },
    bin_mingdan: { ru: 'Тысячные', uz: "Mingdan" },
    done_text: { ru: 'Верно. 3 — десятые, 7 — сотые, 2 — тысячные.', uz: "To'g'ri. 3 — o'ndan, 7 — yuzdan, 2 — mingdan." },
    hint_wrong: { ru: 'Считай от запятой вправо: первая — десятые, вторая — сотые, третья — тысячные.', uz: "Verguldan o'ngga sanang: birinchi — o'ndan, ikkinchi — yuzdan, uchinchi — mingdan." },
    audio: {
      intro: { ru: "В числе ноль целых триста семьдесят две тысячных каждая цифра в своём разряде. Поставь каждую цифру в нужную корзину.", uz: "Nol butun mingdan uch yuz yetmish ikki sonida har raqam o'z xonasida. Har raqamni kerakli savatga qo'ying." },
      on_correct: { ru: "Верно. Тройка в десятых, семёрка в сотых, двойка в тысячных.", uz: "To'g'ri. Uchlik o'ndan, yettilik yuzdan, ikkilik mingdan xonasida." },
      on_wrong: { ru: "Не совсем. Первая цифра после запятой это десятые.", uz: "Unchalik emas. Verguldan keyingi birinchi raqam — o'ndan." }
    }
  },

  // ===== s8 DecInput — 1/2 ni o'nli yoz (0,5) =====
  s8: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    bridge: { ru: 'Разряды освоили. Теперь записывай числа сам — тапай цифры.', uz: "Xonalarni o'zlashtirdik. Endi sonlarni o'zingiz yozing — raqamlarni bosing." },
    title: { ru: 'Запиши десятичной', uz: "O'nli kasr qilib yozing" },
    lead: { ru: 'Четыре примера. Тапай цифры после запятой.', uz: "To'rtta misol. Verguldan keyingi raqamlarni bosing." },
    questions: [
      {
        prompt: { ru: '1/2 = ?', uz: '1/2 = ?' }, answer: '5',
        say: { ru: "Запиши половину. Одна вторая — сколько десятых?", uz: "Yarimni yozing. Ikkidan bir necha o'ndan?" },
        hint: { ru: 'Половина это пять десятых: 5/10. Значит 0,5.', uz: "Yarim — o'ndan besh: 5/10. Demak 0,5." },
        ok: { ru: '1/2 = 5/10 = 0,5.', uz: "1/2 = 5/10 = 0,5." }
      },
      {
        prompt: { ru: '7/10 = ?', uz: '7/10 = ?' }, answer: '7',
        say: { ru: "Семь десятых — какая цифра после запятой?", uz: "O'ndan yetti — verguldan keyin qaysi raqam?" },
        hint: { ru: 'Семь десятых это 0,7 — одна цифра.', uz: "O'ndan yetti — 0,7, bitta raqam." },
        ok: { ru: '7/10 = 0,7. Одна цифра — десятые.', uz: "7/10 = 0,7. Bitta raqam — o'ndan." }
      },
      {
        prompt: { ru: '3/100 = ?', uz: '3/100 = ?' }, answer: '03',
        say: { ru: "Три сотых. Сотые это вторая цифра — впереди ноль.", uz: "Yuzdan uch. Yuzdan — ikkinchi raqam, oldida nol." },
        hint: { ru: 'Сотые это две цифры. Три сотых это 0,03 — впереди ноль.', uz: "Yuzdan — ikki raqam. Yuzdan uch — 0,03, oldida nol." },
        ok: { ru: '3/100 = 0,03. Десятых ноль, сотых три.', uz: "3/100 = 0,03. O'ndan nol, yuzdan uch." }
      },
      {
        prompt: { ru: '45/100 = ?', uz: '45/100 = ?' }, answer: '45',
        say: { ru: "Сорок пять сотых. Две цифры после запятой.", uz: "Yuzdan qirq besh. Verguldan keyin ikki raqam." },
        hint: { ru: 'Сорок пять сотых это 0,45 — две цифры.', uz: "Yuzdan qirq besh — 0,45, ikki raqam." },
        ok: { ru: '45/100 = 0,45. Это мы видели на сетке.', uz: "45/100 = 0,45. Buni katakda ko'rgan edik." }
      }
    ],
    audio: {
      intro: { ru: "Разряды освоили, теперь записывай сам. Тапай цифры после запятой. Сколько десятых в половине?", uz: "Xonalarni o'zlashtirdik, endi o'zingiz yozing. Verguldan keyingi raqamlarni bosing. Yarimda nechta o'ndan?" },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Отлично, все числа записаны верно.", uz: "Zo'r, hamma son to'g'ri yozildi." }
    }
  },

  // ===== s9 TEST tap MC — 0,07 da nechta yuzdan =====
  s9: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Посчитай сотые', uz: "Yuzdan ulushlarni sanang" },
    question: { ru: 'Сколько сотых в числе 0,07?', uz: "0,07 sonida nechta yuzdan bor?" },
    opt0: { ru: '7', uz: '7' },
    opt1: { ru: '70', uz: '70' },
    opt2: { ru: '0', uz: '0' },
    correct_text: { ru: 'Верно. 0,07 это семь сотых: 7/100. Вторая цифра после запятой — сотые.', uz: "To'g'ri. 0,07 — yuzdan yetti: 7/100. Verguldan keyingi ikkinchi raqam — yuzdan." },
    wrong_1: { ru: '70 это семьдесят сотых, то есть 0,70. А у нас 0,07. Смотри на вторую цифру.', uz: "70 — yuzdan yetmish, ya'ni 0,70. Bizda esa 0,07. Ikkinchi raqamga qarang." },
    wrong_2: { ru: 'Сотые не ноль — вторая цифра после запятой это 7.', uz: "Yuzdan nol emas — verguldan keyingi ikkinchi raqam 7." },
    audio: {
      intro: { ru: "Посмотри на число ноль целых семь сотых. Сколько в нём сотых долей? Выбери вариант.", uz: "Nol butun yuzdan yetti soniga qarang. Unda nechta yuzdan ulush bor? Variantni tanlang." },
      on_correct: { ru: "Верно, семь сотых.", uz: "To'g'ri, yuzdan yetti." },
      on_wrong: { ru: "Вторая цифра после запятой это сотые.", uz: "Verguldan keyingi ikkinchi raqam — yuzdan." }
    }
  },

  // ===== s_practice — solishtirish mashqi (SeqMC) =====
  s_practice: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Сравни числа', uz: "Sonlarni solishtiring" },
    lead: { ru: 'Четыре примера. Сравнивай по разрядам, а не по длине.', uz: "To'rtta misol. Uzunlik emas, xona bo'yicha solishtiring." },
    bridge: { ru: 'Хорошо! Закрепим сравнение на нескольких примерах.', uz: "Yaxshi! Solishtirishni bir nechta misolda mustahkamlaymiz." },
    questions: [
      {
        q: { ru: '0,5 или 0,45 — что больше?', uz: "0,5 yoki 0,45 — qaysi katta?" },
        say: { ru: "Что больше: ноль целых пять десятых или ноль целых сорок пять сотых?", uz: "Qaysi katta: nol butun o'ndan besh yoki nol butun yuzdan qirq besh?" },
        opts: [{ ru: '0,5', uz: '0,5' }, { ru: '0,45', uz: '0,45' }, { ru: 'Равны', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: 0,5 = 0,50 это 50 сотых, больше 45.', uz: "To'g'ri: 0,5 = 0,50 — 50 yuzdan, 45 dan katta." },
        no: { ru: 'Допиши ноль: 0,50 и 0,45. Сравни сотые.', uz: "Nol qo'shing: 0,50 va 0,45. Yuzdanlarni solishtiring." }
      },
      {
        q: { ru: '0,7 или 0,07 — что больше?', uz: "0,7 yoki 0,07 — qaysi katta?" },
        say: { ru: "Что больше: ноль целых семь десятых или ноль целых семь сотых?", uz: "Qaysi katta: nol butun o'ndan yetti yoki nol butun yuzdan yetti?" },
        opts: [{ ru: '0,7', uz: '0,7' }, { ru: '0,07', uz: '0,07' }, { ru: 'Равны', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: семь десятых больше семи сотых.', uz: "To'g'ri: o'ndan yetti yuzdan yettidan katta." },
        no: { ru: 'Десятые крупнее сотых. 0,7 = 0,70.', uz: "O'ndan yuzdandan yirik. 0,7 = 0,70." }
      },
      {
        q: { ru: '0,3 = ?', uz: '0,3 = ?' },
        say: { ru: "Какой дроби равно ноль целых три десятых?", uz: "Nol butun o'ndan uch qaysi kasrga teng?" },
        opts: [{ ru: '3/10', uz: '3/10' }, { ru: '3/100', uz: '3/100' }, { ru: '1/3', uz: '1/3' }],
        correct: 0,
        ok: { ru: 'Верно: одна цифра после запятой — десятые.', uz: "To'g'ri: bitta raqam — o'ndan." },
        no: { ru: 'Одна цифра после запятой это десятые.', uz: "Bitta raqam — o'ndan." }
      },
      {
        q: { ru: '0,6 или 0,60 — что больше?', uz: "0,6 yoki 0,60 — qaysi katta?" },
        say: { ru: "Что больше: ноль целых шесть десятых или ноль целых шестьдесят сотых?", uz: "Qaysi katta: nol butun o'ndan olti yoki nol butun yuzdan oltmish?" },
        opts: [{ ru: 'Равны', uz: 'Teng' }, { ru: '0,60', uz: '0,60' }, { ru: '0,6', uz: '0,6' }],
        correct: 0,
        ok: { ru: 'Верно: 0,6 = 0,60. Ноль в конце не меняет числа.', uz: "To'g'ri: 0,6 = 0,60. Oxirdagi nol sonni o'zgartirmaydi." },
        no: { ru: 'Допиши ноль: 0,6 это 0,60. Они равны.', uz: "Nol qo'shing: 0,6 — bu 0,60. Ular teng." }
      }
    ],
    audio: {
      intro: { ru: "Тренировка. Четыре примера. Сравнивай по разрядам.", uz: "Mashq. To'rtta misol. Xona bo'yicha solishtiring." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Молодец, сравнения освоены.", uz: "Barakalla, solishtirishni o'zlashtirdingiz." }
    }
  },

  // ===== s10 TEST find-the-wrong — xato taqqoslash + sport fakti =====
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Найди ошибочное сравнение', uz: "Xato taqqoslashni toping" },
    question: { ru: 'Какое сравнение ОШИБОЧНО?', uz: "Qaysi taqqoslash XATO?" },
    opt0: { ru: '0,5 больше 0,45', uz: "0,5 > 0,45" },
    opt1: { ru: '0,7 больше 0,07', uz: "0,7 > 0,07" },
    opt2: { ru: '0,45 больше 0,5', uz: "0,45 > 0,5" },
    opt3: { ru: '0,3 равно 3/10', uz: "0,3 = 3/10" },
    correct_text: { ru: 'Точно! 0,45 больше 0,5 — ошибка. 0,50 это 50 сотых, а 0,45 это 45 сотых. На деле 0,45 меньше.', uz: "Aniq topdingiz! 0,45 > 0,5 — xato. 0,50 — 50 yuzdan, 0,45 — 45 yuzdan. Aslida 0,45 kichik." },
    wrong_0: { ru: '0,5 больше 0,45 — это верно (0,5 = 0,50). Ищи ошибочное.', uz: "0,5 > 0,45 — to'g'ri (0,5 = 0,50). Xato bo'lganini qidiring." },
    wrong_1: { ru: '0,7 больше 0,07 — это верно. Ищи ошибочное.', uz: "0,7 > 0,07 — to'g'ri. Xato bo'lganini qidiring." },
    wrong_3: { ru: '0,3 = 3/10 — это верно. Ищи ошибочное сравнение.', uz: "0,3 = 3/10 — to'g'ri. Xato taqqoslashni qidiring." },
    fact: { ru: 'На крупных стартах победителя определяют сотые доли секунды: мировой рекорд в беге на 100 метров около 9,58 с.', uz: "Yirik musobaqalarda g'olib soniyaning yuzdan ulushi bilan aniqlanadi: 100 metr yugurish jahon rekordi taxminan 9,58 soniya." },
    fact_audio: { ru: "Кстати, на крупных стартах победителя определяют сотые доли секунды. Мировой рекорд в беге на сто метров около девяти целых пятидесяти восьми сотых секунды.", uz: "Aytgancha, yirik musobaqalarda g'olibni soniyaning yuzdan ulushlari aniqlaydi. Yuz metr yugurish jahon rekordi taxminan to'qqiz butun yuzdan ellik sakkiz soniya." },
    audio: {
      intro: { ru: "Будь внимателен: одно из сравнений ошибочно. Найди неверное и выбери его.", uz: "Diqqatli bo'ling: taqqoslashlardan biri xato. Noto'g'risini topib tanlang." },
      on_correct: { ru: "Верно. Сорок пять сотых меньше пятидесяти сотых. Кстати, на крупных стартах победителя определяют сотые доли секунды: мировой рекорд в беге на сто метров около девяти целых пятидесяти восьми сотых секунды.", uz: "To'g'ri. Yuzdan qirq besh yuzdan ellikdan kichik. Aytgancha, yirik musobaqalarda g'olibni soniyaning yuzdan ulushlari aniqlaydi: yuz metr yugurish jahon rekordi taxminan to'qqiz butun yuzdan ellik sakkiz soniya." },
      on_wrong: { ru: "Это сравнение верное. Ищи ошибочное.", uz: "Bu taqqoslash to'g'ri. Xato bo'lganini qidiring." }
    }
  },

  // ===== s11 CASE setup — Oybek 0,7 kitob =====
  s11: {
    eyebrow: { ru: 'Жизненная задача', uz: "Hayotiy masala" },
    title: { ru: 'Прочитано 0,7 книги', uz: "Kitobning 0,7 qismi o'qildi" },
    bridge: { ru: 'Потренировались. Теперь применим это в жизни.', uz: "Mashq qildik. Endi buni hayotda qo'llaymiz." },
    lead: { ru: 'Ойбек читает книгу для проекта. Приложение показывает: прочитано 0,7 книги. Он хочет увидеть это на числовой прямой.', uz: "Oybek loyiha uchun kitob o'qiyapti. Ilova ko'rsatadi: kitobning 0,7 qismi o'qildi. U buni sonlar nurida ko'rmoqchi." },
    note: { ru: 'Где на отрезке от 0 до 1 стоит 0,7?', uz: "0 dan 1 gacha kesmada 0,7 qayerda turadi?" },
    compact: { ru: 'Прочитано 0,7 из 1 книги', uz: "1 kitobdan 0,7 qismi o'qildi" },
    btn_help: { ru: 'Помочь Ойбеку', uz: "Oybekka yordam berish" },
    audio: { ru: "Потренировались, теперь задача из жизни. Ойбек читает книгу. Приложение показывает: прочитано ноль целых семь десятых книги. Помоги отметить это на числовой прямой от нуля до единицы.", uz: "Mashq qildik, endi hayotiy masala. Oybek kitob o'qiyapti. Ilova ko'rsatadi: kitobning nol butun o'ndan yetti qismi o'qildi. Buni nol dan bir gacha sonlar nurida belgilashga yordam bering." }
  },

  // ===== s12 — son o'qiga 0,7 belgilash (scored=final) + metr fakti =====
  s12: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Отметь 0,7 на прямой', uz: "0,7 ni sonlar nurida belgilang" },
    instruction: { ru: 'Поставь метку на 0,7. Отрезок от 0 до 1 разделён на десятые.', uz: "Belgini 0,7 ga qo'ying. 0 dan 1 gacha kesma o'ndan ulushlarga bo'lingan." },
    hint: { ru: '0,7 это семь десятых. Отсчитай семь делений от нуля.', uz: "0,7 — bu o'ndan yetti. Noldan boshlab yetti bo'linmani sanang." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    fb_correct: { ru: 'Верно. 0,7 — это семь десятых, седьмое деление.', uz: "To'g'ri. 0,7 — o'ndan yetti, yettinchi bo'linma." },
    hint_wrong: { ru: 'Пока не туда. 0,7 это семь делений из десяти.', uz: "Hozircha noto'g'ri. 0,7 — o'ndan yetti bo'linma." },
    fact: { ru: 'Вся метрическая система десятичная: 1 метр это 10 дециметров и 100 сантиметров.', uz: "Butun metr tizimi o'nlik: 1 metr — bu 10 detsimetr va 100 santimetr." },
    fact_audio: { ru: "Кстати, вся метрическая система десятичная: один метр это десять дециметров и сто сантиметров.", uz: "Aytgancha, butun metr tizimi o'nlikka asoslangan: bir metr — bu o'n detsimetr va yuz santimetr." },
    audio: {
      intro: { ru: "Помоги Ойбеку. Поставь метку на ноль целых семь десятых и нажми проверить. Отрезок разделён на десять равных частей.", uz: "Oybekka yordam bering. Belgini nol butun o'ndan yettiga qo'yib, tekshirishni bosing. Kesma o'nta teng qismga bo'lingan." },
      on_correct: { ru: "Верно, седьмое деление.", uz: "To'g'ri, yettinchi bo'linma." },
      on_wrong: { ru: "Пока не туда. Отсчитай семь делений от нуля.", uz: "Hozircha noto'g'ri. Noldan yetti bo'linmani sanang." }
    }
  },

  // ===== s14 SUMMARY =====
  s14: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Десятичная дробь понятна', uz: "O'nli kasr tushunarli" },
    title: { ru: 'Теперь вы понимаете, что значит десятичная дробь', uz: "Endi siz o'nli kasr nimani anglatishini tushunasiz" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Десятичная дробь — это дробь со знаменателем 10, 100, 1000. Запятая отделяет целое от долей.', uz: "O'nli kasr — maxraji 10, 100, 1000 bo'lgan kasr. Vergul butunni ulushlardan ajratadi." },
    main_2: { ru: 'Разряды вправо: десятые, сотые, тысячные — каждый в 10 раз меньше. 0,1 = 1/10.', uz: "Xonalar o'ngga: o'ndan, yuzdan, mingdan — har biri 10 marta kichik. 0,1 = 1/10." },
    main_3: { ru: 'Больше цифр не значит больше число. Дописывай ноль и сравнивай по разрядам.', uz: "Raqam ko'p — son katta degani emas. Nol qo'shib, xona bo'yicha solishtiring." },
    hook_close: { ru: 'Помните загадку? 0,45 не больше 0,5. Допишем ноль: 0,50 это 50 сотых, 0,45 это 45 сотых. Значит 0,5 больше.', uz: "Topishmoq yodingizdami? 0,45, 0,5 dan katta emas. Nol qo'shamiz: 0,50 — 50 yuzdan, 0,45 — 45 yuzdan. Demak 0,5 katta." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Дробь как часть целого, эквивалентные дроби, разряды натуральных чисел.', uz: "Kasr — butunning qismi, ekvivalent kasrlar, natural sonlar xonalari." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Сравнение и округление десятичных дробей.', uz: "O'nli kasrlarni solishtirish va yaxlitlash." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, десятичная дробь это дробь со знаменателем десять, сто, тысяча. Разряды вправо: десятые, сотые, тысячные. И помни: больше цифр не значит больше число.", uz: "Demak, o'nli kasr — maxraji o'n, yuz, ming bo'lgan kasr. Xonalar o'ngga: o'ndan, yuzdan, mingdan. Va yodda tuting: raqam ko'p — son katta degani emas." }
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
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
// Bridge — slaydlararo ma'noli o'tish qatori (faza chegaralarida). Ovozda intro'ga qo'shilgan.
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-harakat siyrak ekranlar uchun: yumshoq suzuvchi doiralar.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_HIST  = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_SPORT = { ru: 'Знаешь ли ты? · Спорт',   uz: "Bilasizmi? · Sport" };
const FB_SCI   = { ru: 'Знаешь ли ты? · Наука',   uz: "Bilasizmi? · Fan" };

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

// ============================================================
// FAKT-ANIMATSIYALAR (CSS-only loop, ko'k tema)
// ============================================================
// al-Koshiy: xona raqamlari navbat bilan yonadi + miltillovchi vergul (tarix/Samarqand).
const AnimKashi = () => (<div className="fa-ksh" aria-hidden="true"><i/><i/><i/><span className="fa-ksh-c"/></div>);
// sekundomer: doira + tez strelka (soniyaning yuzdan ulushi).
const AnimStop = () => (<div className="fa-stp" aria-hidden="true"><span className="fa-stp-sweep"/><span className="fa-stp-c"/></div>);
// chizg'ich: 10 bo'linma + yuguruvchi yorug'lik (o'nlik metr).
const AnimRuler = () => (<div className="fa-rul" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <span key={i} className="fa-rul-t" style={{ animationDelay: (i * 0.12) + 's' }}/>)}</div>);

// ============================================================
// VIZUALIZATORLAR (dec_5_01): DecimalGrid, DecLabel, PlaceTable, HookGrid, NumberLine
// ============================================================
const decFmt = (v) => String(Math.round(v * 1000) / 1000).replace('.', ',');

// DecimalGrid: birlik kvadrat — o'ndan (10 ustun) yoki yuzdan (100 katak); jonli to'lish.
const DecimalGrid = ({ value = 0, mode = 'tenths', color = T.accent, sz = 130, live = false, success = false }) => {
  const n = mode === 'tenths' ? 10 : 100;
  const onCount = mode === 'tenths' ? Math.round(value * 10) : Math.round(value * 100);
  const base = mode === 'tenths' ? 'dg-col' : 'dg-cell';
  const stag = mode === 'tenths' ? 0.05 : 0.008;
  const fillColor = success ? T.success : color;
  return (
    <div className={'dg-square ' + (mode === 'tenths' ? 'dg-tenths' : 'dg-hgrid')} style={{ width: sz, height: sz }} aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={base} style={{ background: i < onCount ? fillColor : 'transparent', transitionDelay: live ? '0s' : (i * stag) + 's' }}/>
      ))}
    </div>
  );
};

const DecLabel = ({ value, color }) => (
  <span className="display" style={{ fontSize: 'clamp(26px, 5vw, 38px)', color: color || T.ink, fontVariantNumeric: 'tabular-nums' }}>{decFmt(value)}</span>
);

// PlaceTable: birlar | , | o'ndan | yuzdan | mingdan.
const PlaceTable = ({ whole = 0, tenths = null, hundredths = null, thousandths = null, highlight = '' }) => {
  const t = useT();
  const cols = [
    { key: 'birlar', label: { ru: 'Ед.', uz: 'Birlar' }, val: whole },
    { key: 'ondan', label: { ru: 'Десятые', uz: "O'ndan" }, val: tenths },
    { key: 'yuzdan', label: { ru: 'Сотые', uz: 'Yuzdan' }, val: hundredths },
    { key: 'mingdan', label: { ru: 'Тысячные', uz: 'Mingdan' }, val: thousandths },
  ];
  return (
    <div className="pt-wrap">
      {cols.map((col, i) => (
        <React.Fragment key={col.key}>
          {i === 1 && <div className="pt-comma" aria-hidden="true">,</div>}
          <div className={'pt-col' + (highlight === col.key ? ' pt-hi' : '')}>
            <div className="pt-cell">{col.val === null ? '' : col.val}</div>
            <div className="pt-label mono">{t(col.label)}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

// HookGrid: o'ndan to'lqin to'lishi → 0,5 = 5/10 (CSS-loop, state'siz).
const HookGrid = () => (
  <div className="hg-wrap" aria-hidden="true">
    <div className="hg-square">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className={i < 5 ? 'hg-col hg-on' : 'hg-col'} style={{ animationDelay: i < 5 ? (i * 0.18) + 's' : undefined }}/>)}
    </div>
    <div className="hg-cap"><span className="hg-comma">0,5</span><Op>=</Op><Frac n="5" d="10" size="mid" color={T.accent}/></div>
  </div>
);

// NumberLine: 0..1 kesma, 10 bo'linma; bola belgini suradi (slayder), tekshiradi.
// NumberLine — 0..1 kesma; bola bo'linmani BOSADI (tap), belgi shu yerga sakraydi. Mobil-do'st.
const NumberLine = ({ value, onChange, solved }) => {
  const ticks = Array.from({ length: 11 }, (_, i) => i);
  return (
    <div className="nl-wrap">
      <div className="nl-track">
        <span className={'nl-mark' + (solved ? ' nl-mark-ok' : '')} style={{ left: (value * 10) + '%' }}/>
        {ticks.map(i => (
          <button key={i} type="button" className="nl-hit" disabled={solved} style={{ left: (i * 10) + '%' }} onClick={() => onChange(i)} aria-label={decFmt(i / 10)}>
            <span className={'nl-tick' + (i === 0 || i === 10 ? ' nl-tick-end' : '') + (value === i ? ' nl-tick-on' : '')}/>
          </button>
        ))}
      </div>
      <div className="nl-labels"><span>0</span><span>1</span></div>
    </div>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (M3). Qaytishda picked TO'LIQ sbros.
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <HookGrid/>
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

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (warmup / practice). Mobil-do'st tap (klaviatura yo'q).
// Har savolda веди-до-верного: noto'g'ri o'chadi, to'g'ridan keyin avtomatik keyingisiga o'tadi.
// scored=true bo'lsa, oxirida bitta natija yuboradi (barcha birinchi urinish to'g'ri bo'lsa — correct).
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  // To'g'ri javob pozitsiyasini HAR misolda random aralashtiramiz (hammasi A bo'lib qolmasin).
  const [qs] = useState(() => c.questions.map(item => {
    const ord = item.opts.map((_, i) => i);
    for (let k = ord.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = ord[k]; ord[k] = ord[j]; ord[j] = tmp; }
    return { ...item, opts: ord.map(i => item.opts[i]), correct: ord.indexOf(item.correct) };
  }));
  const n = qs.length;
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
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(q.no ? q.no[lang] : c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
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
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{scored ? (lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.') : (lang === 'uz' ? "Mashq tugadi." : 'Разминка пройдена.')}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {tx(o)}
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

// s1 — WARM-UP: 4 ta tez aralash misol (tap)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;
// s_practice — TRENIROVKA: 4 ta oson ko'paytma (tap, scored)
const ScreenPractice = (props) => <SeqMC {...props} screenContent={CONTENT.s_practice} scored={true}/>;

// s2 — EXPLORATION: o'ndan ulushlar (slayder + DecimalGrid, jonli)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [k, setK] = useState(0);
  const hit = k === 3;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 22px)', flexWrap: 'wrap', justifyContent: 'center', minHeight: 156 }}>
          <DecimalGrid value={k / 10} mode="tenths" color={T.accent} sz={130} live={true} success={hit}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minWidth: 170 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 36 }}>
              {k > 0 && <><DecLabel value={k / 10} color={hit ? T.success : T.ink}/><Op>=</Op><Frac n={String(k)} d="10" size="mid" color={hit ? T.success : T.ink}/></>}
            </div>
            <div style={{ width: '100%', maxWidth: 240 }}><Slider value={k} min={0} max={10} onChange={setK}/></div>
          </div>
        </div>
        <div className={`fade-up delay-2 ${hit ? 'frame-success' : 'frame-tip'}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hit && <span style={{ color: T.success, flexShrink: 0 }}><IconOk/></span>}
          <p className="body" style={{ margin: 0, fontWeight: 600, color: hit ? T.success : T.ink }}>{mt(t(hit ? c.note_done : c.note))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION: yuzdan ulushlar (slayder + DecimalGrid 100)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [nn, setNn] = useState(0);
  const hit = nn === 45;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 22px)', flexWrap: 'wrap', justifyContent: 'center', minHeight: 156 }}>
          <DecimalGrid value={nn / 100} mode="hundredths" color={T.blue} sz={130} live={true} success={hit}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minWidth: 170 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 36 }}>
              <DecLabel value={nn / 100} color={hit ? T.success : T.ink}/><Op>=</Op><Frac n={String(nn)} d="100" size="mid" color={hit ? T.success : T.ink}/>
            </div>
            <div style={{ width: '100%', maxWidth: 240 }}><Slider value={nn} min={0} max={100} onChange={setNn}/></div>
          </div>
        </div>
        <div className={`fade-up delay-2 ${hit ? 'frame-success' : 'frame-tip'}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hit && <span style={{ color: T.success, flexShrink: 0 }}><IconOk/></span>}
          <p className="body" style={{ margin: 0, fontWeight: 600, color: hit ? T.success : T.ink }}>{mt(t(hit ? c.note_done : c.note))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s4 + s5 — RULE + M1 ogohlantirish birlashgan (progressiv: qoida → chip → ogohlantirish)
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT();
  const c4 = CONTENT.s4; const c5 = CONTENT.s5;
  const audio = useAudio([
    { id: 'rule_a0', text: c4.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'more' } },
    { id: 'rule_a1', text: c5.audio[lang], trigger: 'on_event:more', waits_for: { type: 'button_click', target: 'next' } }
  ]);
  const [phase, setPhase] = useState(0); const moreRef = useRef(false);
  const reveal = () => { setPhase(1); if (!moreRef.current) { moreRef.current = true; audio.triggerInternal('more'); } };
  const goNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={lang === 'uz' ? "Davom etish" : 'Дальше'}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={goNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={phase === 0 ? c4.eyebrow : c5.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        {phase === 0 ? (
          <>
            <Bridge node={c4.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c4.heading))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c4.rule_main))}</p>
              <PlaceTable whole={0} tenths={4} hundredths={5} thousandths={null} highlight="ondan"/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><DecLabel value={0.45} color={T.accent}/><Op>=</Op><Frac n="45" d="100" size="mid" color={T.ink}/></div>
            </div>
            <p className="body fade-up delay-2" style={{ position: 'relative', color: T.ink2, margin: 0, fontWeight: 600 }}>{mt(t(c4.rule_note))}</p>
          </>
        ) : (
          <>
            <button className="rule-chip fade-up" onClick={() => setPhase(0)} style={{ position: 'relative' }}>
              <span className="rule-chip-ic" aria-hidden="true"><IconOk/></span>
              <span className="rule-chip-tx">{mt(t(c4.heading))}</span>
              <span className="rule-chip-act">{lang === 'uz' ? "ko'rish" : 'показать'}</span>
            </button>
            <h2 className="title h-title fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c5.heading))}</h2>
            <p className="body fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c5.rule_main))}</p>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 'clamp(14px, 3vw, 26px)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}><DecimalGrid value={0.5} mode="hundredths" color={T.accent} sz={104}/><DecLabel value={0.5} color={T.accent}/></div>
              <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.ink3, paddingBottom: 26 }}>&gt;</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}><DecimalGrid value={0.45} mode="hundredths" color={T.blue} sz={104}/><DecLabel value={0.45} color={T.blue}/></div>
            </div>
            <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c5.warn_label)}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c5.warn))}</p>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s6 — TEST MC: 0,3 = 3/10 + al-Koshiy fakti
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimKashi/>}/>}/>;
};

// s7 — SORT 3 ta savat (ketma-ket): 0,372 raqamlarini o'ndan/yuzdan/mingdan ga
const S7_DECK = [{ label: '3', bin: 'ondan' }, { label: '7', bin: 'yuzdan' }, { label: '2', bin: 'mingdan' }];
const S7_BINS = ['ondan', 'yuzdan', 'mingdan'];
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7; const sfx = useSfx();
  const n = S7_DECK.length;
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? { 0: 'ondan', 1: 'yuzdan', 2: 'mingdan' } : {}));
  const [done, setDone] = useState(wasSolved);
  const [hint, setHint] = useState(false); const [flash, setFlash] = useState(null);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvRef = useRef(wasSolved); const advRef = useRef(null); const flashRef = useRef(null);
  const cur = idx < n ? S7_DECK[idx] : null;
  const binLabel = (b) => b === 'ondan' ? c.bin_ondan : (b === 'yuzdan' ? c.bin_yuzdan : c.bin_mingdan);
  const finish = (fts) => {
    setDone(true);
    const ok = fts.filter(Boolean).length === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: 'ondan,yuzdan,mingdan', studentAnswer: `${fts.filter(Boolean).length}/${n}`, correct: ok, firstTry: ok, attempts: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const tapBin = (bin) => {
    if (done || !cur) return;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); }
    const correct = bin === cur.bin;
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct;
    if (correct) {
      setHint(false); setPlaced(p => ({ ...p, [idx]: bin })); sfx.playCorrect();
      const snap = firstTryRef.current.slice();
      advRef.current = setTimeout(() => { if (idx + 1 < n) setIdx(idx + 1); else { setIdx(n); finish(snap); } }, 480);
    } else {
      sfx.playWrong(); setHint(true); setFlash(bin);
      if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (flashRef.current) clearTimeout(flashRef.current); }, []);
  const inBin = (bin) => S7_DECK.map((cd, i) => i).filter(i => placed[i] === bin);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up"><h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2><p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p></div>
        <div className="seq-dots fade-up" aria-hidden="true">{S7_DECK.map((_, i) => <span key={i} className={`seq-dot${(i < idx || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}</div>
        <div className="sort-tray fade-up delay-1">{done ? <span className="sort-tray-card" style={{ color: T.success }} aria-hidden="true">✓</span> : <><span className="sort-tray-card" key={idx}>{cur.label}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}</div>
        <div className="sort-bins sort-bins-3 fade-up delay-2">
          {S7_BINS.map(bin => (
            <button key={bin} className={`sort-bin sort-bin-place${flash === bin ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(bin)}>
              <span className="sort-bin-h">{mt(t(binLabel(bin)))}</span>
              <span className="sort-bin-cards">{inBin(bin).map(i => <span key={i} className="sort-chip-in">{S7_DECK[i].label}</span>)}</span>
            </button>
          ))}
        </div>
        {hint && !done && <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}><span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p></div>}
        {done && <FeedbackBlock show={true} isCorrect={true}><p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p></FeedbackBlock>}
      </div>
    </Stage>
  );
};

// s8 — DecTap ketma-ket (mobil-do'st): 4 ta misol, "0,▢" / "0,▢▢" — bola raqamlarni BOSADI. Veди-до-верного, scored.
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const qs = c.questions; const nQ = qs.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [qi, setQi] = useState(wasSolved ? nQ - 1 : 0);
  const [entry, setEntry] = useState(wasSolved ? qs[nQ - 1].answer : '');
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [bad, setBad] = useState(false);
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvRef = useRef(wasSolved); const advRef = useRef(null); const badRef = useRef(null);
  const q = qs[qi < nQ ? qi : nQ - 1];
  const finish = (fts) => {
    setDone(true);
    const ok = fts.filter(Boolean).length === nQ;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${fts.filter(Boolean).length}/${nQ}`, correct: ok, firstTry: ok, attempts: nQ, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const tapDigit = (d) => {
    if (done || solvedItem || bad) return;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); }
    const next = entry + String(d);
    if (next.length < q.answer.length) { setEntry(next); return; }
    const correct = next === q.answer;
    if (firstTryRef.current[qi] === undefined) firstTryRef.current[qi] = correct;
    if (correct) {
      setEntry(next); setSolvedItem(true); sfx.playCorrect();
      const snap = firstTryRef.current.slice();
      advRef.current = setTimeout(() => {
        if (qi + 1 < nQ) { const ni = qi + 1; setQi(ni); setEntry(''); setSolvedItem(false); if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && qs[ni].say) e.pushOneOff(qs[ni].say[lang]); } }
        else { finish(snap); }
      }, 750);
    } else {
      setEntry(next); setBad(true); sfx.playWrong();
      if (badRef.current) clearTimeout(badRef.current);
      badRef.current = setTimeout(() => { setEntry(''); setBad(false); }, 700);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(q.hint ? q.hint[lang] : c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (badRef.current) clearTimeout(badRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const slots = Array.from({ length: q.answer.length });
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.3vw, 16px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up"><h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2><p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p></div>
        <div className="seq-dots fade-up" aria-hidden="true">{qs.map((_, i) => <span key={i} className={`seq-dot${(i < qi || done) ? ' seq-dot-done' : ''}${(i === qi && !done) ? ' seq-dot-cur' : ''}`}/>)}</div>
        {done ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: T.success }}><IconOk/></span><p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma son to'g'ri yozildi." : 'Все числа записаны верно.'}</p></div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 16px)', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <span className="dm-prob" style={{ fontSize: 'clamp(22px, 5vw, 32px)' }}>{mt(tx(q.prompt))}</span>
              <span className="dtap-build" style={{ color: solvedItem ? T.success : (bad ? T.accent : T.ink) }}>0,{slots.map((_, i) => <span key={i} className={`dtap-slot${bad ? ' dtap-slot-bad' : ''}${solvedItem ? ' dtap-slot-ok' : ''}`}>{entry[i] ?? '_'}</span>)}</span>
            </div>
            <div className="dtap-pad fade-up delay-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => <button key={d} className="dtap-key" disabled={solvedItem || bad} onClick={() => tapDigit(d)}>{d}</button>)}
            </div>
            <FeedbackBlock show={solvedItem || bad} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}</p>
              <p className="body" style={{ margin: 0 }}>{mt(tx(solvedItem ? q.ok : q.hint))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// s9 — TEST tap MC: 0,07 da nechta yuzdan (3 variant)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 1]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — TEST find-the-wrong + sport fakti
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SPORT} anim={<AnimStop/>}/>}/>;
};

// s11 + s12 — CASE: Oybek 0,7 kitob → son o'qiga belgilash (progressiv, scored=final) + metr fakti
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c0 = CONTENT.s11; const c = CONTENT.s12;
  const audio = useAudio([
    { id: 'case_a0', text: c0.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'help' } },
    { id: 'case_a1', text: c.audio.intro[lang], trigger: 'on_event:help', waits_for: { type: 'check_pressed' } }
  ]);
  const wasSolved = storedAnswer?.solved === true;
  const [phase, setPhase] = useState(wasSolved ? 1 : 0);
  const [val, setVal] = useState(wasSolved ? 7 : 0);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const helpRef = useRef(wasSolved); const introAdvRef = useRef(wasSolved); const factRef = useRef(wasSolved);
  const reveal = () => { setPhase(1); if (!helpRef.current) { helpRef.current = true; audio.triggerInternal('help'); } };
  const check = () => {
    if (solved) return;
    const ok = val === 7;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: '0,7', studentAnswer: decFmt(val / 10), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  useEffect(() => { if (solved && !factRef.current) { factRef.current = true; if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) setTimeout(() => e.pushOneOff(c.fact_audio[lang]), 1600); } } }, [solved]);
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={t(c0.btn_help)}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={phase === 0 ? c0.eyebrow : c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        {phase === 0 ? (
          <>
            <Bridge node={c0.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c0.title))}</h2>
            <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c0.lead))}</p>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}><div className="dm-prob">0,7</div></div>
            <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c0.note))}</p>
          </>
        ) : (
          <>
            <div className="case-ctx fade-up" style={{ position: 'relative' }}>
              <span className="case-ctx-tag">{mt(t(c0.title))}</span>
              <span className="case-ctx-tx">{mt(t(c0.compact))}</span>
            </div>
            <h2 className="title h-sub fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c.instruction))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px)' }}>
              <NumberLine value={val} onChange={(v) => { if (!solved) { setVal(v); setChecked(false); } }} solved={solved}/>
              <p className="dm-prob" style={{ marginTop: 16, fontSize: 'clamp(22px, 5vw, 30px)', color: solved ? T.success : T.accent }}>{decFmt(val / 10)}</p>
            </div>
            {checked && !solved && <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}><span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p></div>}
            {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}><button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
            {solved && <FeedbackBlock show={true} isCorrect={true}><p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p></FeedbackBlock>}
            {solved && <FactCard text={c.fact} badge={FB_SCI} anim={<AnimRuler/>}/>}
          </>
        )}
      </div>
    </Stage>
  );
};

// s14 — SUMMARY
const Screen14 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}</div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hook_close))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

export default function DecimalConceptLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, ScreenRule, Screen6, Screen7, Screen8, Screen9, ScreenPractice, Screen10, ScreenCase, Screen14];
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

/* MATH dec_5_01: DecimalGrid — birlik kvadrat: o'ndan (10 ustun) / yuzdan (10x10). */
.dg-square { display: grid; border: 2px solid rgba(58, 53, 48, 0.35); border-radius: 6px; overflow: hidden; background: #FFFFFF; flex-shrink: 0; }
.dg-tenths { grid-template-columns: repeat(10, 1fr); }
.dg-col { border-right: 1px solid rgba(58, 53, 48, 0.15); transition: background 0.45s ease; }
.dg-col:last-child { border-right: none; }
.dg-hgrid { grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(10, 1fr); grid-auto-flow: column; }
.dg-cell { border-right: 1px solid rgba(58, 53, 48, 0.08); border-bottom: 1px solid rgba(58, 53, 48, 0.08); transition: background 0.45s ease; }

/* MATH dec_5_01: PlaceTable — razryad jadvali. */
.pt-wrap { display: flex; align-items: stretch; gap: 5px; justify-content: center; }
.pt-comma { display: flex; align-items: flex-end; padding-bottom: 26px; font-family: 'Fraunces', serif; font-size: clamp(24px, 4.4vw, 32px); color: #FF4F28; font-weight: 600; }
.pt-col { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: clamp(44px, 9vw, 58px); }
.pt-cell { width: 100%; height: clamp(38px, 7vw, 46px); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: clamp(20px, 3.6vw, 26px); color: #0E0E10; background: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.18); }
.pt-hi .pt-cell { background: #FFE8E1; color: #FF4F28; box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.30); }
.pt-label { color: #5A5A60; font-size: clamp(9px, 1.3vw, 11px); text-align: center; line-height: 1.1; }

/* MATH dec_5_01: HookGrid — s0 loop (o'ndan to'lqin 0,5 gacha). */
.hg-wrap { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2vw, 14px); }
.hg-square { display: grid; grid-template-columns: repeat(10, 1fr); width: clamp(160px, 32vw, 210px); height: clamp(82px, 16vw, 108px); border: 2px solid rgba(58, 53, 48, 0.35); border-radius: 6px; overflow: hidden; background: #FFFFFF; }
.hg-col { border-right: 1px solid rgba(58, 53, 48, 0.14); }
.hg-col:last-child { border-right: none; }
.hg-on { background: #FF4F28; opacity: 0; animation: hgFill 4.6s ease-in-out infinite; }
@keyframes hgFill { 0% { opacity: 0; } 15%, 68% { opacity: 1; } 88%, 100% { opacity: 0; } }
.hg-comma { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 30px); color: #FF4F28; font-weight: 600; }

/* MATH dec_5_01: NumberLine — 0..1 kesma, slayder bilan belgilash. */
.nl-wrap { display: flex; flex-direction: column; gap: 4px; max-width: 420px; margin: 0 auto; width: 100%; }
.nl-track { position: relative; height: 44px; margin: 0 8px; }
.nl-track::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 4px; background: rgba(167, 166, 162, 0.35); border-radius: 99px; transform: translateY(-50%); }
.nl-hit { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 34px; height: 44px; background: transparent; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
.nl-hit:disabled { cursor: default; }
.nl-tick { width: 2px; height: 12px; background: #A7A6A2; border-radius: 2px; transition: all 0.15s ease; }
.nl-tick-end { height: 20px; width: 2.5px; background: #0E0E10; }
.nl-tick-on { background: #FF4F28; height: 16px; width: 3px; }
.nl-hit:hover:not(:disabled) .nl-tick { background: #FF4F28; height: 16px; }
.nl-mark { position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%; background: #FF4F28; transform: translate(-50%, -50%); box-shadow: 0 0 0 5px rgba(255, 79, 40, 0.16), 0 0 12px rgba(255, 79, 40, 0.55); transition: left 0.25s cubic-bezier(0.34, 1.1, 0.64, 1), background 0.3s ease; z-index: 3; pointer-events: none; }
.nl-mark-ok { background: #1F7A4D; box-shadow: 0 0 0 5px rgba(31, 122, 77, 0.16), 0 0 12px rgba(31, 122, 77, 0.55); }
.nl-labels { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: #0E0E10; padding: 0 4px; }

/* MATH dec_5_01: fakt-animatsiyalar (al-Koshiy / sekundomer / chizg'ich). */
.fa-ksh { display: flex; align-items: flex-end; gap: 5px; height: 42px; }
.fa-ksh i { width: 9px; border-radius: 3px; background: #019ACB; opacity: 0.22; animation: faKsh 2.9s ease-in-out infinite; }
.fa-ksh i:nth-child(1) { height: 58%; animation-delay: 0s; }
.fa-ksh i:nth-child(2) { height: 80%; animation-delay: 0.3s; }
.fa-ksh i:nth-child(3) { height: 100%; animation-delay: 0.6s; }
.fa-ksh-c { align-self: flex-end; width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; animation: faKshC 2.9s ease-in-out infinite; }
@keyframes faKsh { 0%, 8% { opacity: 0.2; } 40%, 70% { opacity: 1; } 100% { opacity: 0.2; } }
@keyframes faKshC { 0%, 48% { opacity: 0.3; transform: scale(0.7); } 62%, 90% { opacity: 1; transform: scale(1); } 100% { opacity: 0.3; transform: scale(0.7); } }
.fa-stp { position: relative; width: 42px; height: 42px; border-radius: 50%; border: 3px solid #019ACB; animation: faStpPulse 2s ease-in-out infinite; }
.fa-stp::before { content: ''; position: absolute; left: 50%; top: -7px; width: 7px; height: 5px; background: #019ACB; transform: translateX(-50%); border-radius: 2px 2px 0 0; }
.fa-stp-sweep { position: absolute; left: 50%; top: 50%; width: 2.5px; height: 42%; background: #FF4F28; transform-origin: bottom center; border-radius: 2px; transform: translate(-50%, -100%); }
.fa-stp-c { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; border-radius: 50%; background: #019ACB; transform: translate(-50%, -50%); }
@keyframes faStpPulse { 0%, 100% { transform: scale(0.95); } 50% { transform: scale(1.1); } }
.fa-rul { position: relative; display: flex; align-items: flex-end; gap: 3px; height: 30px; padding-bottom: 4px; border-bottom: 3px solid #019ACB; }
.fa-rul-t { width: 2.5px; height: 11px; background: #019ACB; opacity: 0.35; border-radius: 1px; animation: faRul 2.6s ease-in-out infinite; }
.fa-rul-t:nth-child(5n+1) { height: 17px; }
@keyframes faRul { 0%, 100% { opacity: 0.3; transform: scaleY(0.7); } 50% { opacity: 1; transform: scaleY(1); } }

/* MATH dec_5_01: 3 ta savatli sort (razryad). */
.sort-bins-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sort-bin-place { align-items: center; }
.sort-bin-place .sort-bin-h { color: #5A5A60; background: #EFEEE9; align-self: center; }
.sort-bin-place .sort-bin-cards { justify-content: center; }

/* MATH dec_5_01: DecTap — "0,▢" raqam-tap (mobil-do'st o'nli kiritish). */
.dtap-build { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(34px, 8vw, 52px); letter-spacing: 0.02em; }
.dtap-slot { display: inline-block; min-width: 0.7em; text-align: center; border-bottom: 3px solid rgba(167, 166, 162, 0.5); margin-left: 2px; transition: border-color 0.2s ease, color 0.2s ease; }
.dtap-slot-ok { border-bottom-color: #1F7A4D; }
.dtap-slot-bad { border-bottom-color: #FF4F28; }
.dtap-pad { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 12px); max-width: 420px; margin: 0 auto; width: 100%; }
.dtap-key { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.4vw, 24px); color: #0E0E10; background: #FFFFFF; border: none; border-radius: 12px; padding: clamp(12px, 2.4vw, 16px) 0; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.18); transition: transform 0.12s ease, box-shadow 0.2s ease; }
.dtap-key:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.26); }
.dtap-key:disabled { cursor: default; }
.dtap-key-ok { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.3); }
.dtap-key-bad { background: #FFFFFF; color: #A7A6A2; opacity: 0.5; box-shadow: none; }
`;
