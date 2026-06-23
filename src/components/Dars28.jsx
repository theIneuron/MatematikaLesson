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
// --- POD UROK: dec_5_05 — O'nli kasrlarni ko'paytirish / Умножение десятичных дробей (PROMPT 2026-06-17) ---
// Markaziy misconception M3: "ko'paytirish doim kattalashtiradi" (0,5×6=3, 6 dan KICHIK).
// M2: ko'paytmada vergul xonasini noto'g'ri sanash (0,2×0,3=0,6; to'g'risi 0,06, jami 2 kasr xona).
// M1: vergullarni qo'shishdagidek tenglashtirish (ko'paytirishda kerak emas).
// Asosiy usul (Haydarov VII bob §40-42): vergulsiz ko'paytir → ko'paytuvchilardagi kasr
// xonalar yig'indisicha o'ngdan ajratib vergul qo'y (yetmasa bosh nol). Konseptual: ×<1 kamaytiradi.
// Vizualizator: protsedura (vergulsiz ko'paytirish + vergul qo'yish, step) + MagBar (magnituda: ×<1 kichrayadi).
// Hook (konseptual M3): Madina 0,5×6 ni oltidan katta deydi. Case: Laziz mato (1,5 × 1,2).
// Faktlar (DRAFT): vergul yoki nuqta — dasturlashda nuqta (IT) / o'nli kasrlarni Simon Stevin ~1585 kiritgan (Tarix).
// Bardoshli o'nli-kiritish: DecInputScreen (0,8=0.8, qiymat bo'yicha). Butun NumInput: kasr xonalar sonini sanash.
// ============================================================
const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'dec_5_05',
  lessonTitle: { ru: 'Умножение десятичных дробей', uz: "O'nli kasrlarni ko'paytirish" }
};
// Eslatma: ekran ID lari endi qattiq indeks emas — har komponent jonli `screen` propidan idx oladi.
// Reorder qilishda faqat shu massiv + screens massivini bir xil tartibda yangilang.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',          scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',           scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 2
  { id: 's3',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 3
  { id: 's4',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 4
  { id: 's_area',    type: 'exploration', template: 'custom',     scored: false, scope: null },       // 5
  { id: 's5_6', type: 'rule',       template: 'custom',          scored: false, scope: null },       // 6 (qoida + ikki xato birlashgan)
  { id: 's7',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },  // 7
  { id: 's8',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 8
  { id: 's9',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 9
  { id: 's_practice', type: 'test', template: 'SeqMC',           scored: true,  scope: 'practice' },  // 10 (4 oson misol)
  { id: 's11', type: 'test',        template: 'custom',          scored: true,  scope: 'practice' },  // 11
  { id: 's_colmul',  type: 'test',  template: 'custom',          scored: true,  scope: 'practice' },  // 12
  { id: 's_errspot', type: 'test',  template: 'MCScreen',        scored: true,  scope: 'practice' },  // 13
  { id: 's12_13', type: 'case',     template: 'custom',          scored: true,  scope: 'final' },     // 14 (masala + yakuniy javob birlashgan)
  { id: 's14', type: 'summary',     template: 'custom',          scored: false, scope: null }        // 15
];

const CONTENT = {
  // ===== s0 HOOK (M3) =====
  s0: {
    eyebrow: { ru: 'Умножение и размер', uz: "Ko'paytirish va kattalik" },
    title: { ru: 'Умножение всегда увеличивает?', uz: "Ko'paytirish doim kattalashtiradimi?" },
    lead: { ru: 'Мадина уверена: 0,5 × 6 больше шести. Так ли это?', uz: "Madina ishonadi: 0,5 × 6 oltidan katta. Shundaymi?" },
    opt0: { ru: 'Меньше шести', uz: "Oltidan kichik" },
    opt1: { ru: 'Больше шести', uz: "Oltidan katta" },
    opt2: { ru: 'Ровно шесть', uz: "Roppa-rosa olti" },
    reveal0: { ru: 'Верно. 0,5 × 6 = 3 — это половина шести, меньше. Умножение на число меньше единицы уменьшает.', uz: "To'g'ri. 0,5 × 6 = 3 — bu oltining yarmi, kichikroq. Birdan kichik songa ko'paytirish kamaytiradi." },
    reveal1: { ru: 'Так думают многие, но 0,5 × 6 = 3. Взять половину шести — это меньше шести.', uz: "Ko'pchilik shunday o'ylaydi, lekin 0,5 × 6 = 3. Oltining yarmini olish — oltidan kam." },
    reveal2: { ru: 'Почти, но нет: 0,5 — это половина, а половина шести равна 3.', uz: "Deyarli, lekin yo'q: 0,5 — bu yarim, oltining yarmi esa 3." },
    audio: { ru: "Мадина думает, что умножение всегда увеличивает число. Проверим: половина от шести больше или меньше шести?", uz: "Madina ko'paytirish doim sonni kattalashtiradi deb o'ylaydi. Tekshiramiz: oltining yarmi oltidan ko'pmi yoki kammi?" }
  },

  // ===== s1 WARM-UP — ketma-ket 4 ta tez misol (aralash tip, tap) =====
  s1: {
    eyebrow: { ru: 'Вспомним прошлый урок', uz: "O'tgan darsni eslaylik" },
    title: { ru: 'Разминка', uz: "Mashq" },
    lead: { ru: 'Четыре быстрых примера. Выбери ответ.', uz: "To'rtta tez misol. Javobni tanlang." },
    bridge: { ru: 'Прежде чем ответить Мадине — вспомним прошлый урок.', uz: "Madinaga javob berishdan oldin — o'tgan darsni eslaylik." },
    questions: [
      {
        q: { ru: '2,5 × 10', uz: '2,5 × 10' },
        say: { ru: "Сколько будет две целых пять десятых умножить на десять?", uz: "Ikki butun o'ndan beshni o'nga ko'paytirsak qancha bo'ladi?" },
        opts: [{ ru: '25', uz: '25' }, { ru: '2,5', uz: '2,5' }, { ru: '250', uz: '250' }],
        correct: 0,
        ok: { ru: 'Верно: запятая на разряд вправо.', uz: "To'g'ri: vergul bir xona o'ngga." },
        no: { ru: 'При умножении на 10 запятая идёт вправо.', uz: "10 ga ko'paytirganda vergul o'ngga boradi." }
      },
      {
        q: { ru: '0,3 × 100', uz: '0,3 × 100' },
        say: { ru: "А теперь ноль целых три десятых умножить на сто?", uz: "Endi nol butun o'ndan uchni yuzga ko'paytirsak-chi?" },
        opts: [{ ru: '3', uz: '3' }, { ru: '30', uz: '30' }, { ru: '300', uz: '300' }],
        correct: 1,
        ok: { ru: 'Верно: на 100 — два разряда вправо.', uz: "To'g'ri: 100 ga — ikki xona o'ngga." },
        no: { ru: 'На 100 запятая идёт на два разряда.', uz: "100 ga vergul ikki xona suriladi." }
      },
      {
        q: { ru: '1,2 × 10', uz: '1,2 × 10' },
        say: { ru: "Сколько будет одна целая две десятых умножить на десять?", uz: "Bir butun o'ndan ikkini o'nga ko'paytirsak qancha bo'ladi?" },
        opts: [{ ru: '12', uz: '12' }, { ru: '1,2', uz: '1,2' }, { ru: '120', uz: '120' }],
        correct: 0,
        ok: { ru: 'Верно: 1,2 стало 12.', uz: "To'g'ri: 1,2 son 12 bo'ldi." },
        no: { ru: 'Сдвинь запятую на один разряд вправо.', uz: "Vergulni bir xona o'ngga suring." }
      },
      {
        q: { ru: '0,5 × 8 — больше или меньше восьми?', uz: "0,5 × 8 — sakkizdan katta yoki kichik?" },
        say: { ru: "Ноль целых пять десятых умножить на восемь — больше или меньше восьми?", uz: "Nol butun o'ndan beshni sakkizga ko'paytirsak — sakkizdan ko'pmi yoki kammi?" },
        opts: [{ ru: 'Меньше', uz: "Kichik" }, { ru: 'Больше', uz: "Katta" }, { ru: 'Равно', uz: "Teng" }],
        correct: 0,
        ok: { ru: 'Верно: половина восьми — четыре.', uz: "To'g'ri: sakkizning yarmi — to'rt." },
        no: { ru: 'Множитель меньше единицы уменьшает.', uz: "Birdan kichik ko'paytuvchi kamaytiradi." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем ответить Мадине, вспомним прошлый урок. Четыре быстрых примера.", uz: "Madinaga javob berishdan oldin, o'tgan darsni eslaylik. To'rtta tez misol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Попробуй ещё раз.", uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: "Отлично, разминка пройдена.", uz: "Zo'r, mashq tugadi." }
    }
  },

  // ===== s2 EXPLORATION (1,2 × 3, step) =====
  s2: {
    eyebrow: { ru: 'Умножаем без запятой', uz: "Vergulsiz ko'paytiramiz" },
    title: { ru: 'Десятичная на целое', uz: "O'nli kasrni butun songa" },
    lead: { ru: 'Помни умножение на 10? Теперь возьмём обычное число.', uz: "O'nga ko'paytirishni eslaysizmi? Endi oddiy sonni olamiz." },
    bridge: { ru: 'Размялись. Теперь шаг за шагом разберём само умножение.', uz: "Mashq qildik. Endi ko'paytirishning o'zini qadam-baqadam ko'ramiz." },
    line_problem: { ru: 'Пример: 3,6 × 4', uz: "Misol: 3,6 × 4" },
    line_nat: { ru: 'Без запятой: 36 × 4 = 144.', uz: "Vergulsiz: 36 × 4 = 144." },
    line_count: { ru: 'У множителей один знак после запятой.', uz: "Ko'paytuvchilarda bitta kasr xona." },
    line_place: { ru: 'Отделяем справа один знак: 14,4.', uz: "O'ngdan bitta raqam ajratamiz: 14,4." },
    line_key: { ru: 'Запятые не выравниваем, как при сложении. Считаем только знаки.', uz: "Vergullarni qo'shishdagidek tenglashtirmaymiz. Faqat xonalarni sanaymiz." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Размялись. Теперь умножим по шагам.",
        "Сначала без запятой. Тридцать шесть на четыре.",
        "У множителей один знак после запятой.",
        "Отделяем справа один знак. Четырнадцать целых четыре десятых.",
        "Запятые не выравнивают, как при сложении."
      ],
      uz: [
        "Mashq qildik. Endi qadamlab ko'paytiramiz.",
        "Avval vergulsiz. O'ttiz olti karra to'rt.",
        "Ko'paytuvchilarda bitta kasr xona.",
        "O'ngdan bitta raqam ajratamiz. O'n to'rt butun o'ndan to'rt.",
        "Vergullar qo'shishdagidek tenglashtirilmaydi."
      ]
    }
  },

  // ===== s3 EXPLORATION (0,2 × 0,3, step) — M2 =====
  s3: {
    eyebrow: { ru: 'Два дробных множителя', uz: "Ikki kasr ko'paytuvchi" },
    title: { ru: 'Когда нужен ноль впереди', uz: "Qachon oldiga nol kerak" },
    lead: { ru: 'А если оба множителя дробные?', uz: "Agar ikkala ko'paytuvchi ham kasr bo'lsa-chi?" },
    line_problem: { ru: 'Пример: 0,12 × 0,3', uz: "Misol: 0,12 × 0,3" },
    line_nat: { ru: 'Без запятой: 12 × 3 = 36.', uz: "Vergulsiz: 12 × 3 = 36." },
    line_count: { ru: 'Знаков после запятой: два и один, всего три.', uz: "Kasr xonalar: ikki va bitta, jami uchta." },
    line_place: { ru: 'Нужно три знака, а цифр две. Дописываем нули слева: 0,036.', uz: "Uch xona kerak, raqam esa ikkita. Chapga nol qo'shamiz: 0,036." },
    line_key: { ru: 'Не хватает цифр — дописываем нули слева, пока не наберётся нужное число знаков.', uz: "Raqam yetmasa — kerakli xona soni to'lguncha chapga nol qo'shamiz." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Теперь один множитель с двумя знаками.",
        "Снова без запятой. Двенадцать на три, тридцать шесть.",
        "Знаков после запятой два и один, всего три.",
        "Цифр всего две, а нужно три знака.",
        "Дописываем ноль слева. Ноль целых тридцать шесть тысячных."
      ],
      uz: [
        "Endi bitta ko'paytuvchida ikkita xona.",
        "Yana vergulsiz. O'n ikki karra uch, o'ttiz olti.",
        "Kasr xonalar ikki va bir, jami uch.",
        "Raqam ikkita, uch xona kerak.",
        "Chapga nol qo'shamiz. Nol butun mingdan o'ttiz olti."
      ]
    }
  },

  // ===== s4 EXPLORATION (slider, M3) =====
  s4: {
    eyebrow: { ru: 'Когда умножение уменьшает', uz: "Ko'paytirish qachon kamaytiradi" },
    title: { ru: 'Двигай множитель', uz: "Ko'paytuvchini suring" },
    lead: { ru: 'Берём число 6 и умножаем на разные множители. Ползунок задаёт множитель.', uz: "6 sonini olib, turli ko'paytuvchilarga ko'paytiramiz. Slayder ko'paytuvchini belgilaydi." },
    instr: { ru: 'Двигай ползунок и смотри, как меняется результат.', uz: "Slayderni suring va natija qanday o'zgarishini kuzating." },
    instr_done: { ru: 'Двигай дальше или прочитай факт ниже.', uz: "Davom eting yoki pastdagi faktni o'qing." },
    leg_base: { ru: 'Было — 6', uz: "Avval — 6" },
    leg_res: { ru: 'Стало', uz: "Hozir" },
    slider_label: { ru: 'Множитель', uz: "Ko'paytuvchi" },
    note_less: { ru: 'Множитель меньше 1 → результат меньше 6.', uz: "Ko'paytuvchi 1 dan kichik → natija 6 dan kichik." },
    note_eq: { ru: 'Множитель равен 1 → результат равен 6.', uz: "Ko'paytuvchi 1 ga teng → natija 6 ga teng." },
    note_more: { ru: 'Множитель больше 1 → результат больше 6.', uz: "Ko'paytuvchi 1 dan katta → natija 6 dan katta." },
    fact: { ru: 'Взять половину — это умножить на 0,5. Поэтому скидка «половина цены» всегда меньше целого.', uz: "Yarmini olish — bu 0,5 ga ko'paytirish. Shuning uchun «yarim narx» chegirma doim butundan kichik." },
    fact_audio: { ru: "Взять половину это умножить на ноль целых пять десятых. Поэтому половина цены всегда меньше целого.", uz: "Yarmini olish bu nol butun o'ndan beshga ko'paytirish. Shuning uchun yarim narx doim butundan kichik." },
    audio: { ru: "Умножать можно и на дробь меньше единицы. Тогда результат становится меньше исходного числа. Двигай множитель и проверь.", uz: "Birdan kichik kasrga ham ko'paytirish mumkin. Shunda natija boshlang'ich sondan kichik bo'ladi. Ko'paytuvchini suring va tekshiring." }
  },

  // ===== s5 RULE 1 =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Умножение десятичных дробей', uz: "O'nli kasrlarni ko'paytirish" },
    bridge: { ru: 'Мы увидели, как и почему это работает. Теперь соберём всё в одно правило.', uz: "Qanday va nega ishlashini ko'rdik. Endi hammasini bitta qoidaga yig'amiz." },
    rule_label: { ru: 'Запомни', uz: "Yodda tuting" },
    rule_1: { ru: 'Умножай, не обращая внимания на запятые.', uz: "Vergullarga e'tibor bermay ko'paytiring." },
    rule_2: { ru: 'Сложи количество знаков после запятой у обоих множителей.', uz: "Ikkala ko'paytuvchidagi kasr xonalar sonini qo'shing." },
    rule_3: { ru: 'Отдели справа столько же знаков и поставь запятую.', uz: "O'ngdan o'shancha raqam ajratib vergul qo'ying." },
    rule_4: { ru: 'Если цифр не хватает — допиши нули слева.', uz: "Raqam yetmasa — chap tomonga nol qo'shing." },
    ex_label: { ru: 'Как это работает', uz: "Bu qanday ishlaydi" },
    ex_caption: { ru: '2 × 3 = 6, один знак после запятой → 0,6.', uz: "2 × 3 = 6, bitta kasr xona → 0,6." },
    audio: { ru: "Мы увидели, как это работает. Теперь соберём правило. Умножаем без запятой, потом считаем знаки после запятой у обоих множителей и отделяем столько же в ответе. Например, ноль целых две десятых умножить на три равно ноль целых шесть десятых.", uz: "Qanday ishlashini ko'rdik. Endi qoidani yig'amiz. Vergulsiz ko'paytiramiz, keyin ikkala ko'paytuvchidagi kasr xonalarni sanab, javobda o'shancha ajratamiz. Masalan, nol butun o'ndan ikkini uchga ko'paytirsak, nol butun o'ndan olti bo'ladi." }
  },

  // ===== s6 RULE 2 — TUZOQ =====
  s6: {
    eyebrow: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    heading: { ru: 'Две частые ошибки', uz: "Ikki ko'p uchraydigan xato" },
    warn_1: { ru: 'Не равняй запятые, как при сложении. Здесь это не нужно.', uz: "Vergullarni qo'shishdagidek tenglashtirmang. Bu yerda kerak emas." },
    warn_ex: { ru: 'Считай знаки: 0,2 × 0,3 = 0,06, а не 0,6.', uz: "Xonalarni sanang: 0,2 × 0,3 = 0,06, 0,6 emas." },
    warn_2: { ru: 'Умножение на число меньше 1 уменьшает результат.', uz: "Birdan kichik songa ko'paytirish natijani kamaytiradi." },
    audio: { ru: "Будь внимателен с двумя вещами. Не равняй запятые, как при сложении. И всегда считай знаки после запятой, иначе ответ будет в десять раз больше.", uz: "Ikki narsaga e'tibor bering. Vergullarni qo'shishdagidek tenglashtirmang. Va kasr xonalarni doim sanang, aks holda javob o'n barobar katta chiqadi." }
  },

  // ===== s7 TEST DecInput — 0,2 × 4 = 0,8 =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    bridge: { ru: 'Правило знаем — теперь попробуй применить его сам.', uz: "Qoidani bilamiz — endi uni o'zingiz qo'llab ko'ring." },
    question: { ru: 'Вычисли: 0,2 × 4', uz: "Hisoblang: 0,2 × 4" },
    placeholder: { ru: '0,0', uz: '0,0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Сначала перемножь без запятой, потом посчитай знаки у множителей и отдели столько же.', uz: "Avval vergulsiz ko'paytiring, keyin ko'paytuvchilardagi xonalarni sanab, o'shancha ajrating." },
    fb_correct: { ru: 'Верно: 0,2 × 4 = 0,8.', uz: "To'g'ri: 0,2 × 4 = 0,8." },
    audio: {
      intro: { ru: "Правило знаем, теперь попробуй сам. Вычисли ноль целых две десятых умножить на четыре.", uz: "Qoidani bilamiz, endi o'zingiz urinib ko'ring. Nol butun o'ndan ikkini to'rtga ko'paytiring." },
      on_correct: { ru: "Верно, ноль целых восемь десятых.", uz: "To'g'ri, nol butun o'ndan sakkiz." },
      on_wrong: { ru: "Умножь без запятой, потом отдели один знак.", uz: "Vergulsiz ko'paytiring, keyin bitta raqam ajrating." }
    }
  },

  // ===== s8 TEST MC — 0,2 × 0,3 [FAKT vergul/nuqta] =====
  s8: {
    eyebrow: { ru: 'Считаем знаки', uz: "Xonalarni sanaymiz" },
    title: { ru: 'Сколько знаков в ответе?', uz: "Javobda nechta xona?" },
    question: { ru: 'Чему равно 0,2 × 0,3?', uz: "0,2 × 0,3 nechaga teng?" },
    opt0: { ru: '0,06', uz: '0,06' },
    opt1: { ru: '0,6', uz: '0,6' },
    opt2: { ru: '0,006', uz: '0,006' },
    opt3: { ru: '6', uz: '6' },
    correct_text: { ru: 'Верно: 2 × 3 = 6, два знака после запятой → 0,06.', uz: "To'g'ri: 2 × 3 = 6, ikki kasr xona → 0,06." },
    wrong_1: { ru: 'Ты отделил один знак. Посчитай: сколько их у обоих множителей вместе?', uz: "Siz bitta xona ajratdingiz. Sanab ko'ring: ikkala ko'paytuvchida jami nechta?" },
    wrong_2: { ru: 'Знаков слишком много. Сложи знаки после запятой у обоих множителей.', uz: "Xona juda ko'p. Ikkala ko'paytuvchidagi kasr xonalarni qo'shing." },
    wrong_3: { ru: 'Ты потерял запятую. Сначала перемножь, потом посчитай знаки.', uz: "Vergulni yo'qotdingiz. Avval ko'paytiring, keyin xonalarni sanang." },
    fact: { ru: 'В одних странах дробь пишут с запятой (0,06), в других — с точкой (0.06). В программировании всегда точка.', uz: "Ba'zi davlatlarda kasr vergul bilan yoziladi (0,06), boshqalarida nuqta bilan (0.06). Dasturlashda doim nuqta." },
    audio: {
      intro: { ru: "Сколько будет ноль целых две десятых умножить на ноль целых три десятых?", uz: "Nol butun o'ndan ikkini nol butun o'ndan uchga ko'paytirsak qancha bo'ladi?" },
      on_correct: { ru: "Верно, ноль целых шесть сотых. Кстати, в программировании дробь всегда пишут с точкой, а не с запятой.", uz: "To'g'ri, nol butun yuzdan olti. Aytgancha, dasturlashda kasr doim nuqta bilan yoziladi, vergul bilan emas." },
      on_wrong: { ru: "Сложи знаки после запятой у обоих множителей.", uz: "Ikkala ko'paytuvchidagi kasr xonalarni qo'shing." }
    }
  },

  // ===== s9 TEST MC chama (M3) =====
  s9: {
    eyebrow: { ru: 'Без вычислений', uz: "Hisoblamasdan" },
    title: { ru: 'Прикинем', uz: "Chamalaymiz" },
    question: { ru: '0,5 × 8 — больше или меньше восьми?', uz: "0,5 × 8 — sakkizdan katta yoki kichik?" },
    opt0: { ru: 'Меньше восьми', uz: "Sakkizdan kichik" },
    opt1: { ru: 'Больше восьми', uz: "Sakkizdan katta" },
    opt2: { ru: 'Ровно восемь', uz: "Roppa-rosa sakkiz" },
    correct_text: { ru: 'Верно: 0,5 — это половина. Половина восьми равна 4, это меньше.', uz: "To'g'ri: 0,5 — bu yarim. Sakkizning yarmi 4, bu kichikroq." },
    wrong_1: { ru: 'Множитель меньше единицы, значит результат уменьшается.', uz: "Ko'paytuvchi birdan kichik, demak natija kamayadi." },
    wrong_2: { ru: 'Ровно восемь было бы при умножении на 1. А 0,5 меньше единицы.', uz: "Roppa-rosa sakkiz 1 ga ko'paytirilganda bo'lardi. 0,5 esa birdan kichik." },
    audio: {
      intro: { ru: "Не вычисляя точно: ноль целых пять десятых умножить на восемь — больше или меньше восьми?", uz: "Aniq hisoblamasdan: nol butun o'ndan beshni sakkizga ko'paytirsak — sakkizdan ko'pmi yoki kammi?" },
      on_correct: { ru: "Верно, меньше. Половина восьми — это четыре.", uz: "To'g'ri, kichik. Sakkizning yarmi — to'rt." },
      on_wrong: { ru: "Множитель меньше единицы уменьшает число.", uz: "Birdan kichik ko'paytuvchi sonni kamaytiradi." }
    }
  },

  // ===== s11 TEST tasniflash (tap) — 1 dan kichik/katta =====
  s11: {
    eyebrow: { ru: 'Разложи по группам', uz: "Guruhlarga ajrating" },
    title: { ru: 'Меньше или больше единицы?', uz: "Birdan kichikmi yoki katta?" },
    lead: { ru: 'Поставь каждое произведение в свою группу. Считать точно не нужно.', uz: "Har bir ko'paytmani o'z guruhiga joylang. Aniq hisoblash shart emas." },
    bin_sq: { ru: 'Меньше 1', uz: "1 dan kichik" },
    bin_cu: { ru: 'Больше 1', uz: "1 dan katta" },
    ask: { ru: 'В какую группу? Тапни корзину.', uz: "Qaysi guruhga? Savatni bosing." },
    done_text: { ru: 'Готово! Все произведения разложены по группам.', uz: "Tayyor! Hamma ko'paytma guruhlarga ajratildi." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Множитель меньше 1 уменьшает, больше 1 — увеличивает. Прикинь ещё раз.', uz: "Birdan kichik ko'paytuvchi kamaytiradi, kattasi — oshiradi. Yana chamalab ko'ring." },
    correct_text: { ru: 'Верно! Множитель меньше единицы уменьшает результат.', uz: "To'g'ri! Birdan kichik ko'paytuvchi natijani kamaytiradi." },
    audio: {
      intro: { ru: "Поставь произведения по группам: какое меньше единицы, какое больше. Считать точно не нужно, прикинь.", uz: "Ko'paytmalarni guruhlarga joylang: qaysi biri birdan kichik, qaysi biri katta. Aniq hisoblash shart emas, chamalang." },
      on_correct: { ru: "Верно. Множитель меньше единицы всегда уменьшает число.", uz: "To'g'ri. Birdan kichik ko'paytuvchi sonni doim kamaytiradi." },
      on_wrong: { ru: "Прикинь: множитель меньше единицы уменьшает.", uz: "Chamalang: birdan kichik ko'paytuvchi kamaytiradi." }
    }
  },

  // ===== s12 CASE intro — Laziz mato =====
  s12: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Покупка Лазиза', uz: "Lazizning xaridi" },
    bridge: { ru: 'Хорошо потренировались. Теперь применим умножение в жизненной задаче.', uz: "Yaxshi mashq qildik. Endi ko'paytirishni hayotiy masalada qo'llaymiz." },
    lead: { ru: 'Лазиз покупает ткань. Один метр стоит 1,5 единицы, он берёт 1,2 метра.', uz: "Laziz mato sotib oladi. Bir metri 1,5 birlik, u 1,2 metr oladi." },
    note: { ru: 'Сколько заплатит Лазиз? Посчитаем.', uz: "Laziz qancha to'laydi? Hisoblaymiz." },
    hint_calc: { ru: 'Цену умножают на длину: 1,5 × 1,2.', uz: "Narx uzunlikka ko'paytiriladi: 1,5 × 1,2." },
    compact: { ru: 'Цена 1,5 за метр · длина 1,2 метра', uz: "Narx — metriga 1,5 · uzunlik 1,2 metr" },
    btn_help: { ru: 'Помочь Лазизу', uz: "Lazizga yordam berish" },
    audio: { ru: "Хорошо потренировались. Теперь жизненная задача. Лазиз покупает ткань: один метр стоит одна целая пять десятых, он берёт одну целую две десятых метра. Подумай, как посчитать стоимость.", uz: "Yaxshi mashq qildik. Endi hayotiy masala. Laziz mato sotib oladi: bir metri bir butun o'ndan besh, u bir butun o'ndan ikki metr oladi. Narxni qanday hisoblashni o'ylang." }
  },

  // ===== s13 CASE FINAL MC — 1,5 × 1,2 = 1,8 [FAKT Stevin] =====
  s13: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Стоимость ткани', uz: "Matoning narxi" },
    question: { ru: 'Сколько заплатит Лазиз? 1,5 × 1,2', uz: "Laziz qancha to'laydi? 1,5 × 1,2" },
    opt0: { ru: '1,8', uz: '1,8' },
    opt1: { ru: '18', uz: '18' },
    opt2: { ru: '0,18', uz: '0,18' },
    opt3: { ru: '2,7', uz: '2,7' },
    correct_text: { ru: 'Верно: 15 × 12 = 180, два знака → 1,80, то есть 1,8.', uz: "To'g'ri: 15 × 12 = 180, ikki xona → 1,80, ya'ni 1,8." },
    wrong_1: { ru: 'Запятая потерялась. Посчитай знаки после запятой у обоих множителей.', uz: "Vergul yo'qoldi. Ikkala ko'paytuvchidagi kasr xonalarni sanang." },
    wrong_2: { ru: 'Знаков слишком много. Сколько их у множителей вместе?', uz: "Xona juda ko'p. Ko'paytuvchilarda jami nechta?" },
    wrong_3: { ru: 'Это сложение. А цену умножают на длину.', uz: "Bu qo'shish. Narx esa uzunlikka ko'paytiriladi." },
    fact: { ru: 'Десятичные дроби ввёл в широкое употребление Симон Стевин около 1585 года. До него дроби писали очень сложно.', uz: "O'nli kasrlarni keng qo'llanishga Simon Stevin taxminan 1585-yili kiritgan. Undan oldin kasrlar juda murakkab yozilardi." },
    audio: {
      intro: { ru: "Последнее задание. Один метр стоит одна целая пять десятых, длина одна целая две десятых. Сколько всего?", uz: "Oxirgi topshiriq. Bir metr bir butun o'ndan besh, uzunlik bir butun o'ndan ikki. Jami qancha?" },
      on_correct: { ru: "Верно, одна целая восемь десятых. Кстати, десятичные дроби придумал Симон Стевин больше четырёхсот лет назад.", uz: "To'g'ri, bir butun o'ndan sakkiz. Aytgancha, o'nli kasrlarni Simon Stevin to'rt yuz yildan ko'proq oldin o'ylab topgan." },
      on_wrong: { ru: "Умножь пятнадцать на двенадцать, потом отдели два знака.", uz: "O'n beshni o'n ikkiga ko'paytiring, keyin ikki raqam ajrating." }
    }
  },

  // ===== s14 SUMMARY =====
  s14: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Умножать десятичные легко', uz: "O'nli kasrlarni ko'paytirish oson" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Умножаем без запятой, как обычные числа.', uz: "Vergulsiz, oddiy sonlardek ko'paytiramiz." },
    main_2: { ru: 'Считаем знаки после запятой у множителей и отделяем столько же в ответе.', uz: "Ko'paytuvchilardagi kasr xonalarni sanab, javobda o'shancha ajratamiz." },
    main_3: { ru: 'Умножение на число меньше 1 уменьшает результат.', uz: "Birdan kichik songa ko'paytirish natijani kamaytiradi." },
    hook_close: { ru: 'Вот и ответ Мадине: 0,5 × 6 = 3, меньше шести.', uz: "Mana Madinaga javob: 0,5 × 6 = 3, oltidan kichik." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Умножение на 10, 100, 1000 (Урок 25) и умножение столбиком (Урок 4).', uz: "10, 100, 1000 ga ko'paytirish (25-dars) va ustun ko'paytirish (4-dars)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Деление десятичных дробей.', uz: "O'nli kasrlarni bo'lish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, умножаем без запятой, считаем знаки и отделяем столько же. И помним: умножение на число меньше единицы уменьшает результат.", uz: "Demak, vergulsiz ko'paytiramiz, xonalarni sanaymiz va o'shancha ajratamiz. Va yodda tutamiz: birdan kichik songa ko'paytirish natijani kamaytiradi." }
  },

  // ===== s_area — НОВЫЙ EXPLORATION: модель площади (ПОЧЕМУ сотые) =====
  s_area: {
    eyebrow: { ru: 'Почему сотые?', uz: "Nega yuzdan?" },
    title: { ru: 'Смотрим на площади', uz: "Yuzaga qaraymiz" },
    lead: { ru: 'Почему 0,3 × 0,4 даёт сотые? Посмотрим на квадрат.', uz: "Nega 0,3 × 0,4 yuzdan beradi? Kvadratga qaraymiz." },
    line_cols: { ru: '0,3 — это 3 столбца из 10.', uz: "0,3 — bu o'ntadan 3 ustun." },
    line_rows: { ru: '0,4 — это 4 строки из 10.', uz: "0,4 — bu o'ntadan 4 qator." },
    line_result: { ru: 'Пересечение: 3 × 4 = 12 клеток. Каждая — сотая. Значит 0,12.', uz: "Kesishma: 3 × 4 = 12 ta katak. Har biri — yuzdan. Demak 0,12." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Почему при умножении дробей получаются сотые? Посмотрим на квадрат, разделённый на сто клеток.",
        "Ноль целых три десятых — это три столбца из десяти.",
        "Ноль целых четыре десятых — это четыре строки из десяти.",
        "Там, где они пересекаются, получается двенадцать клеток. Каждая клетка — это одна сотая. Поэтому ответ ноль целых двенадцать сотых."
      ],
      uz: [
        "Nega kasrlarni ko'paytirganda yuzdan kelib chiqadi? Yuzta katakka bo'lingan kvadratga qaraymiz.",
        "Nol butun o'ndan uch — bu o'ntadan uchta ustun.",
        "Nol butun o'ndan to'rt — bu o'ntadan to'rtta qator.",
        "Ular kesishgan joyda o'n ikkita katak hosil bo'ladi. Har bir katak — bu bitta yuzdan. Shuning uchun javob nol butun yuzdan o'n ikki."
      ]
    }
  },

  // ===== s_colmul — НОВЫЙ TEST (mbk): пошаговое умножение, ребёнок ВЫПОЛНЯЕТ =====
  s_colmul: {
    eyebrow: { ru: 'Считаем по шагам', uz: "Qadamlab hisoblaymiz" },
    title: { ru: 'Умножаем 0,3 × 0,4', uz: "0,3 × 0,4 ni ko'paytiramiz" },
    lead: { ru: 'Реши сам: заполни три поля по порядку и нажми «Проверить».', uz: "O'zingiz yeching: uchta katakni tartib bilan to'ldiring va «Tekshirish»ni bosing." },
    lbl_1: { ru: 'Умножь без запятой: 3 × 4 =', uz: "Vergulsiz ko'paytiring: 3 × 4 =" },
    lbl_2: { ru: 'Сколько знаков после запятой всего?', uz: "Verguldan keyin jami nechta xona?" },
    lbl_3: { ru: 'Поставь запятую — ответ:', uz: "Vergul qo'ying — javob:" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Сначала перемножь 3 и 4 без запятой. Потом сложи знаки после запятой и отдели столько же.', uz: "Avval 3 va 4 ni vergulsiz ko'paytiring. Keyin kasr xonalarni qo'shib, o'shancha ajrating." },
    fb_correct: { ru: 'Верно: 12, два знака, ответ 0,12.', uz: "To'g'ri: 12, ikki xona, javob 0,12." },
    audio: {
      intro: { ru: "Заполни три шага. Сначала умножь три на четыре без запятой. Потом сколько знаков после запятой. Потом ответ. Нажми проверить.", uz: "Uchta qadamni to'ldiring. Avval uchni to'rtga vergulsiz ko'paytiring. Keyin nechta kasr xona. Keyin javob. Tekshirishni bosing." },
      on_correct: { ru: "Верно. Три на четыре двенадцать, два знака, ответ ноль целых двенадцать сотых.", uz: "To'g'ri. Uch karra to'rt o'n ikki, ikki xona, javob nol butun yuzdan o'n ikki." },
      on_wrong: { ru: "Сначала умножь без запятой, потом посчитай знаки после запятой у обоих множителей.", uz: "Avval vergulsiz ko'paytiring, keyin ikkala ko'paytuvchidagi kasr xonalarni sanang." }
    }
  },

  // ===== s_errspot — НОВЫЙ TEST (error-spotting): неверная запятая (M2) =====
  s_errspot: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где ответ неверный?', uz: "Qaysi javob noto'g'ri?" },
    question: { ru: 'Один из ответов посчитан неправильно. Какой?', uz: "Javoblardan biri noto'g'ri hisoblangan. Qaysi biri?" },
    opt0: { ru: '0,2 × 0,3 = 0,06', uz: '0,2 × 0,3 = 0,06' },
    opt1: { ru: '0,1 × 0,6 = 0,06', uz: '0,1 × 0,6 = 0,06' },
    opt2: { ru: '0,5 × 0,5 = 2,5', uz: '0,5 × 0,5 = 2,5' },
    opt3: { ru: '0,4 × 0,5 = 0,20', uz: '0,4 × 0,5 = 0,20' },
    correct_text: { ru: 'Верно! 5 × 5 = 25, два знака после запятой → 0,25, а не 2,5.', uz: "To'g'ri! 5 × 5 = 25, ikki kasr xona → 0,25, 2,5 emas." },
    wrong_0: { ru: 'Этот ответ посчитан правильно. Ошибка в другом.', uz: "Bu javob to'g'ri hisoblangan. Xato boshqasida." },
    wrong_1: { ru: 'Этот ответ правильный. Ищи ошибку дальше.', uz: "Bu javob to'g'ri. Xatoni boshqasidan qidiring." },
    wrong_3: { ru: 'Тут всё верно, запятая на месте.', uz: "Bu yerda hammasi to'g'ri, vergul joyida." },
    wrong_default: { ru: 'Посчитай каждый пример и сравни.', uz: "Har bir misolni hisoblab solishtiring." },
    fact: { ru: 'В программировании дробь пишут с точкой: 0.25, а не 0,25.', uz: "Dasturlashda kasr nuqta bilan yoziladi: 0.25, 0,25 emas." },
    audio: {
      intro: { ru: "Один из этих ответов посчитан неправильно. Найди, где запятая стоит не на своём месте.", uz: "Bu javoblardan biri noto'g'ri hisoblangan. Vergul o'z joyida turmagan javobni toping." },
      on_correct: { ru: "Верно. Пять на пять двадцать пять, два знака после запятой, значит ноль целых двадцать пять сотых, а не два целых пять десятых.", uz: "To'g'ri. Besh karra besh yigirma besh, ikki kasr xona, demak nol butun yigirma besh, ikki butun besh emas." },
      on_wrong: { ru: "Посчитай каждый пример: умножь без запятой и отдели столько знаков, сколько их у множителей вместе.", uz: "Har bir misolni hisoblang: vergulsiz ko'paytiring va ko'paytuvchilardagi xonalar yig'indisicha ajrating." }
    }
  },

  // ===== s_practice — НОВЫЙ TEST: 4 ta tez oson misol (tap, mobil-do'st) =====
  s_practice: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Посчитай произведение', uz: "Ko'paytmani hisoblang" },
    lead: { ru: 'Четыре примера. Выбери верный ответ — считай в уме.', uz: "To'rtta misol. To'g'ri javobni tanlang — xayolan hisoblang." },
    questions: [
      {
        q: { ru: '0,2 × 3', uz: '0,2 × 3' },
        say: { ru: "Ноль целых две десятых умножить на три.", uz: "Nol butun o'ndan ikkini uchga ko'paytiring." },
        opts: [{ ru: '0,6', uz: '0,6' }, { ru: '6', uz: '6' }, { ru: '0,06', uz: '0,06' }],
        correct: 0,
        ok: { ru: 'Верно: 2 × 3 = 6, один знак → 0,6.', uz: "To'g'ri: 2 × 3 = 6, bitta xona → 0,6." },
        no: { ru: 'Умножь без запятой, отдели один знак.', uz: "Vergulsiz ko'paytiring, bitta xona ajrating." }
      },
      {
        q: { ru: '0,1 × 0,5', uz: '0,1 × 0,5' },
        say: { ru: "Ноль целых одна десятая умножить на ноль целых пять десятых.", uz: "Nol butun o'ndan birni nol butun o'ndan beshga ko'paytiring." },
        opts: [{ ru: '0,5', uz: '0,5' }, { ru: '0,05', uz: '0,05' }, { ru: '0,005', uz: '0,005' }],
        correct: 1,
        ok: { ru: 'Верно: 1 × 5 = 5, два знака → 0,05.', uz: "To'g'ri: 1 × 5 = 5, ikki xona → 0,05." },
        no: { ru: 'Перемножь без запятой, потом сложи знаки после запятой у множителей.', uz: "Vergulsiz ko'paytiring, keyin ko'paytuvchilardagi kasr xonalarni qo'shing." }
      },
      {
        q: { ru: '1,1 × 2', uz: '1,1 × 2' },
        say: { ru: "Одна целая одна десятая умножить на два.", uz: "Bir butun o'ndan birni ikkiga ko'paytiring." },
        opts: [{ ru: '2,2', uz: '2,2' }, { ru: '22', uz: '22' }, { ru: '0,22', uz: '0,22' }],
        correct: 0,
        ok: { ru: 'Верно: 11 × 2 = 22, один знак → 2,2.', uz: "To'g'ri: 11 × 2 = 22, bitta xona → 2,2." },
        no: { ru: 'Перемножь без запятой, потом посчитай знаки после запятой.', uz: "Vergulsiz ko'paytiring, keyin verguldan keyin nechta xona borligini sanang." }
      },
      {
        q: { ru: '0,4 × 0,2', uz: '0,4 × 0,2' },
        say: { ru: "Ноль целых четыре десятых умножить на ноль целых две десятых.", uz: "Nol butun o'ndan to'rtni nol butun o'ndan ikkiga ko'paytiring." },
        opts: [{ ru: '0,8', uz: '0,8' }, { ru: '0,08', uz: '0,08' }, { ru: '0,008', uz: '0,008' }],
        correct: 1,
        ok: { ru: 'Верно: 4 × 2 = 8, два знака → 0,08.', uz: "To'g'ri: 4 × 2 = 8, ikki xona → 0,08." },
        no: { ru: 'Сложи знаки после запятой у обоих множителей и отдели столько же.', uz: "Ikkala ko'paytuvchidagi kasr xonalarni qo'shib, o'shancha ajrating." }
      }
    ],
    audio: {
      intro: { ru: "Тренировка. Четыре примера. Считай в уме.", uz: "Mashq. To'rtta misol. Xayolan hisoblang." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Молодец, все примеры верны.", uz: "Barakalla, hamma misol to'g'ri." }
    }
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
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };
const FB_MATH = { ru: 'Полезно знать · Математика', uz: "Bilib qo'ying · Matematika" };
// Yarim = 0,5 ga ko'paytirish — qisqa ko'k anim (FactCard qutisiga sig'adi).
const AnimHalf = () => (
  <div className="pa-st" aria-hidden="true">
    {['×', '0', ',', '5'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);

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
// IT: vergul va nuqta navbatma-navbat ko'rinadi.
const AnimDotComma = () => (
  <div className="pa-dc" aria-hidden="true">
    <span className="pa-dc-num">3</span>
    <span className="pa-dc-sep"><span className="pa-dc-comma">,</span><span className="pa-dc-dot">.</span></span>
    <span className="pa-dc-num">14</span>
  </div>
);
// Tarix: o'nli kasr raqamlari ketma-ket yoziladi (yangi yozuv).
const AnimStevin = () => (
  <div className="pa-st" aria-hidden="true">
    {['0', ',', '3', '7', '5'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATOR — MagBar (magnituda: ×<1 kichraytiradi) + DecInputScreen (bardoshli o'nli kiritish)
// ============================================================
const fmtDec = (v) => { const r = Math.round(v * 100) / 100; return String(r).replace('.', ','); };

// MagBar: boshlang'ich son (kulrang) va natija (o'sib/kichrayib boruvchi) ustunlar.
const MagBar = ({ base, factor }) => {
  const result = Math.round(base * factor * 100) / 100;
  const max = base * 2;
  const pctB = Math.min(100, (base / max) * 100);
  const pctR = Math.min(100, (result / max) * 100);
  const cls = result < base ? ' mb-less' : (result > base ? ' mb-more' : '');
  return (
    <div className="mb-wrap">
      <div className="mb-row">
        <span className="mb-cap">{fmtDec(base)}</span>
        <div className="mb-track"><div className="mb-fill mb-fill-base" style={{ width: `${pctB}%` }}/></div>
      </div>
      <div className="mb-row">
        <span className="mb-cap">{fmtDec(result)}</span>
        <div className="mb-track"><div className={`mb-fill mb-fill-res${cls}`} style={{ width: `${pctR}%` }}/></div>
      </div>
    </div>
  );
};

// DecInputScreen — o'nli javob: вeди-до-верного + bardoshli tekshiruv (0,8 = 0.8, qiymat bo'yicha).
// ВИЗУАЛИЗАТОР dec_5_05: AreaModel — единичный квадрат 10×10. cols столбцов (напр. 0,3) ×
// rows строк (0,4) = cols·rows сотых клеток. Показывает, ПОЧЕМУ произведение в сотых.
// Шаги: 1 — столбцы (доля ширины), 2 — строки (доля высоты), 3 — пересечение (произведение).
// Клетки ЗАЛИВАЮТСЯ (без бегущих анимаций); лёгкий stagger по диагонали.
const AreaModel = ({ cols = 3, rows = 4, step = 3 }) => {
  const cells = [];
  for (let r = 0; r < 10; r++) {
    for (let col = 0; col < 10; col++) {
      const inCol = col < cols;
      const inRow = r < rows;
      let cls = 'am-cell';
      if (step >= 3 && inCol && inRow) cls += ' am-both';
      else if (step >= 2 && inRow) cls += ' am-row';
      else if (step >= 1 && inCol) cls += ' am-col';
      cells.push(<span key={`${r}-${col}`} className={cls} style={{ transitionDelay: `${(r + col) * 0.012}s` }}/>);
    }
  }
  return <div className="am-grid" aria-hidden="true">{cells}</div>;
};

// ============================================================
// MulSolve — "harakatlanuvchi yechim": vergulsiz ko'paytma → kasr xonalarni sanash → vergul joyiga tushadi.
// step 0: a × b (vergullar xira). step 1: vergulsiz ko'paytma ko'rinadi.
// step 2: oxirgi `places` raqam bledniy-jeltiy yoritiladi (sanash). step 3: vergul "tushadi" (drop-in), natija yashil.
// Yetmagan raqam — chap tomonga nol qo'shiladi (0,06 holati ko'rinadi).
// ============================================================
const MulSolve = ({ a, b, bare, places, result, step }) => {
  let s = String(bare);
  while (s.length <= places) s = '0' + s;       // kamida bitta butun xona + `places` kasr xona
  const digits = s.split('');
  const commaAt = digits.length - places;       // vergul shu indeksdan oldin
  return (
    <div className="ms-solve" aria-hidden="true">
      <div className="ms-row">
        <span className={`ms-fac${step >= 1 ? ' ms-dim' : ''}`}>{a}</span>
        <span className="ms-op">×</span>
        <span className={`ms-fac${step >= 1 ? ' ms-dim' : ''}`}>{b}</span>
      </div>
      {step >= 1 && (
        <div className="ms-row fade-up">
          <span className="ms-op">=</span>
          <span className="ms-digits">
            {digits.map((d, i) => (
              <span key={i} className="ms-dwrap">
                {step >= 3 && i === commaAt && commaAt > 0 && <span className="ms-comma">,</span>}
                <span className={`ms-d${(step >= 2 && i >= commaAt && places > 0) ? ' ms-d-hl' : ''}`}>{d}</span>
              </span>
            ))}
          </span>
        </div>
      )}
      {step >= 3 && result && <div className="ms-result fade-up">{result}</div>}
    </div>
  );
};

const DecInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const correct = Number(correctValue);
  const norm = (s) => parseFloat(String(s).replace(',', '.').replace(/\s/g, ''));
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [value, setValue] = useState(wasSolved ? String(correct).replace('.', ',') : (storedAnswer?.studentAnswer ?? ''));
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
          const wrongVoice = (c.audio_hint && c.audio_hint[lang]) || (c.hint && c.hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input type="text" inputMode="decimal" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <MagBar base={6} factor={0.5}/>
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

// s2 — EXPLORATION (1,2 × 3, step)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 184 }}>
          <MulSolve a="3,6" b="4" bare="144" places={1} result="14,4" step={step}/>
          {step >= 1 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.line_nat))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_count))}</p>}
        </div>
        {step >= last && <div className="frame-tip fade-up" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.line_key))}</p></div>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (0,12 × 0,3, step) — M2: chapga nol
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 184 }}>
          <MulSolve a="0,12" b="0,3" bare="36" places={3} result="0,036" step={step}/>
          {step >= 1 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.line_nat))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_count))}</p>}
        </div>
        {step >= last && <div className="frame-tip fade-up" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.line_key))}</p></div>}
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (slider, M3)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [v, setV] = useState(5);
  const factor = v / 10;
  const result = Math.round(6 * factor * 100) / 100;
  const resColor = factor < 1 ? T.accent : (factor > 1 ? T.success : T.ink);
  const note = factor < 1 ? c.note_less : (factor > 1 ? c.note_more : c.note_eq);
  const [factShown, setFactShown] = useState(false);
  const factTimerRef = useRef(null);
  const onSlide = (val) => {
    setV(val);
    if (!factShown) {
      if (factTimerRef.current) clearTimeout(factTimerRef.current);
      factTimerRef.current = setTimeout(() => {
        setFactShown(true);
        if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.fact_audio[lang]); }
      }, 1400);
    }
  };
  useEffect(() => () => { if (factTimerRef.current) clearTimeout(factTimerRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', alignItems: 'stretch', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px, 5vw, 32px)', letterSpacing: '0.02em' }}>
            <span>6</span> <span style={{ color: T.ink2 }}>×</span> <span style={{ color: T.accent }}>{fmtDec(factor)}</span> <span style={{ color: T.ink2 }}>=</span> <span style={{ color: resColor }}>{fmtDec(result)}</span>
          </div>
          <MagBar base={6} factor={factor}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'clamp(11px, 1.4vw, 12px)', color: T.ink2 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#A7A6A2' }}/>{t(c.leg_base)}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'clamp(11px, 1.4vw, 12px)', color: T.ink2 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: resColor }}/>{t(c.leg_res)}: {fmtDec(result)}</span>
          </div>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {fmtDec(factor)}</p>
          <Slider value={v} min={1} max={20} onChange={onSlide}/>
          <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink3 }}>{mt(t(factShown ? c.instr_done : c.instr))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: factor < 1 ? T.accent : (factor > 1 ? T.success : T.ink2), fontWeight: 600 }}>{mt(t(note))}</p>
        {factShown && <FactCard text={c.fact} badge={FB_MATH} anim={<AnimHalf/>}/>}
      </div>
    </Stage>
  );
};

// s5 + s6 — RULE + TUZOQ birlashgan (progressiv: Qoida → chip → Ikki xato). Scrollsiz.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT();
  const c5 = CONTENT.s5; const c6 = CONTENT.s6;
  const audio = useAudio([
    { id: 'rule_a0', text: c5.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'more' } },
    { id: 'rule_a1', text: c6.audio[lang], trigger: 'on_event:more', waits_for: { type: 'button_click', target: 'next' } }
  ]);
  const [phase, setPhase] = useState(0);          // 0 = qoida, 1 = ikki xato
  const moreRef = useRef(false);
  const rules = [c5.rule_1, c5.rule_2, c5.rule_3, c5.rule_4];
  const reveal = () => { setPhase(1); if (!moreRef.current) { moreRef.current = true; audio.triggerInternal('more'); } };
  const goNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={lang === 'uz' ? "Davom etish" : 'Дальше'}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={goNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={phase === 0 ? c5.eyebrow : c6.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        {phase === 0 ? (
          <>
            <Bridge node={c5.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c5.heading))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
              <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c5.rule_label)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
              </div>
            </div>
            <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)' }}>
              <div style={{ flexShrink: 0 }}><MulSolve a="0,2" b="3" bare="6" places={1} result="0,6" step={3}/></div>
              <div>
                <p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c5.ex_label)}</p>
                <p className="body" style={{ margin: 0 }}>{mt(t(c5.ex_caption))}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="rule-chip fade-up" onClick={() => setPhase(0)} style={{ position: 'relative' }}>
              <span className="rule-chip-ic" aria-hidden="true"><IconOk/></span>
              <span className="rule-chip-tx">{mt(t(c5.heading))}</span>
              <span className="rule-chip-act">{lang === 'uz' ? "ko'rish" : 'показать'}</span>
            </button>
            <h2 className="title h-title fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c6.heading))}</h2>
            <div className="frame-tip fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c6.warn_1))}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c6.warn_ex))}</p>
            </div>
            <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c6.warn_2))}</p>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s7 — TEST DecInput: 0,2 × 4 = 0,8
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={0.8}
    renderVisual={() => <div className="dm-prob">0,2 × 4</div>}/>;
};

// s8 — TEST MC: 0,2 × 0,3 [FAKT vergul/nuqta]
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimDotComma/>}/>}/>;
};

// s9 — TEST MC chama (M3), 3 variant
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST tasniflash: 1 dan kichik / katta. Oson (aniq) + qiyin (1 ga yaqin) aralash; tartib random.
const S11_CARDS = [
  { label: '0,5 × 0,4', bin: 'sq' },   // 0,20 — oson
  { label: '0,2 × 0,3', bin: 'sq' },   // 0,06 — oson
  { label: '0,9 × 0,9', bin: 'sq' },   // 0,81 — qiyin (1 ga yaqin)
  { label: '0,8 × 1,1', bin: 'sq' },   // 0,88 — qiyin (bittasi >1)
  { label: '0,5 × 6',   bin: 'cu' },   // 3 — oson
  { label: '3 × 1,5',   bin: 'cu' },   // 4,5 — oson
  { label: '4 × 2',     bin: 'cu' },   // 8 — oson
  { label: '2 × 0,8',   bin: 'cu' },   // 1,6 — qiyin (bittasi <1)
  { label: '1,2 × 0,9', bin: 'cu' }    // 1,08 — qiyin (1 ga yaqin)
];
const SORT_BINS = [{ key: 'sq', dir: 'down' }, { key: 'cu', dir: 'up' }];
const SortChevron = ({ dir }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {dir === 'down' ? <polyline points="6 9 12 15 18 9"/> : <polyline points="6 15 12 9 18 15"/>}
  </svg>
);
// s11 — TASNIFLASH (ketma-ket): son chiqadi → bola savatga joylaydi. Веди-до-верного, scored.
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11; const sfx = useSfx();
  const [deck] = useState(() => { const a = S11_CARDS.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; });
  const n = deck.length;
  const audio = useAudio([{ id: 's11_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const allPlaced = () => { const o = {}; deck.forEach((cd, i) => { o[i] = cd.bin; }); return o; };
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? allPlaced() : {}));
  const [done, setDone] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(null);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null); const flashRef = useRef(null);
  const cur = idx < n ? deck[idx] : null;
  const finish = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: deck.map(cd => cd.bin).join(','), studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const tapBin = (bin) => {
    if (done || !cur) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const correct = bin === cur.bin;
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct;
    if (correct) {
      setHint(false); setPlaced(p => ({ ...p, [idx]: bin })); sfx.playCorrect();
      const snap = firstTryRef.current.slice();
      advRef.current = setTimeout(() => { if (idx + 1 < n) setIdx(idx + 1); else { setIdx(n); finish(snap); } }, 480);
    } else {
      sfx.playWrong(); setHint(true);
      setFlash(bin); if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (flashRef.current) clearTimeout(flashRef.current); }, []);
  const inBin = (bin) => deck.map((cd, i) => i).filter(i => placed[i] === bin);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {deck.map((_, i) => <span key={i} className={`seq-dot${(i < idx || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        <div className="sort-tray fade-up delay-1">
          {done
            ? <span className="sort-tray-card" style={{ color: T.success }} aria-hidden="true">✓</span>
            : <><span className="sort-tray-card" key={idx}>{cur.label}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {SORT_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h"><SortChevron dir={b.dir}/>{b.key === 'sq' ? mt(t(c.bin_sq)) : mt(t(c.bin_cu))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{deck[i].label}</span>)}
              </span>
            </button>
          ))}
        </div>
        {hint && !done && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s12 + s13 — CASE birlashgan (progressiv: shart → ixcham kontekst KO'RINIB qoladi + savol ochiladi). Scored: final.
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c0 = CONTENT.s12; const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const audio = useAudio([
    { id: 'case_a0', text: c0.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'help' } },
    { id: 'case_a1', text: c.audio.intro[lang], trigger: 'on_event:help', waits_for: { type: 'option_picked' } }
  ]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [phase, setPhase] = useState(wasSolved ? 1 : 0);
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const helpRef = useRef(wasSolved);
  const reveal = () => { setPhase(1); if (!helpRef.current) { helpRef.current = true; audio.triggerInternal('help'); } };
  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isCorrect = i === correctIdx;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstIdxRef.current = i; }
    attemptsRef.current += 1;
    setPicked(i);
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isCorrect) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: content.question?.[lang] ?? null, correctIndex: correctIdx, correctAnswer: typeof options[correctIdx] === 'string' ? options[correctIdx] : null, studentAnswerIndex: firstIdxRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) {
          const wrongVoice = (content[`wrong_${i}`] && content[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
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
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
              <div className="dm-prob">1,5 × 1,2</div>
            </div>
            <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c0.note))}</p>
            <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c0.hint_calc))}</p></div>
          </>
        ) : (
          <>
            <div className="case-ctx fade-up" style={{ position: 'relative' }}>
              <span className="case-ctx-tag">{mt(t(c0.title))}</span>
              <span className="case-ctx-tx">{mt(t(c0.compact))}</span>
              <span className="case-ctx-prob">1,5 × 1,2</span>
            </div>
            <h2 className="title h-sub fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c.question))}</h2>
            <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
              {options.map((opt, i) => {
                let cls = 'option';
                const isWrongPicked = wrong.has(i);
                const isCorrect = i === correctIdx;
                const collapse = solved && !isCorrect;
                if (solved && isCorrect) cls += ' option-correct';
                else if (isWrongPicked) cls += ' option-picked-wrong';
                const disabled = solved || isWrongPicked;
                return (
                  <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                    style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
                    <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>{solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(solved ? t(content.correct_text) : t(content[`wrong_${picked}`] || c.wrong_default || content.correct_text))}</p>
            </FeedbackBlock>
            {solved && <FactCard text={c.fact} badge={FB_HIST} anim={<AnimStevin/>}/>}
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
// ===== s_area — НОВЫЙ EXPLORATION: модель площади 0,3 × 0,4 = 0,12 (ПОЧЕМУ сотые) =====
const ScreenAreaModel = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s_area;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s_area_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <AreaModel cols={3} rows={4} step={step}/>
          {step >= 1 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_cols))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.blue, fontWeight: 600 }}>{mt(t(c.line_rows))}</p>}
          {step >= 3 && <p className="dm-res fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_result))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== s_colmul — НОВЫЙ TEST (mbk): пошаговое умножение 0,3 × 0,4, ребёнок ВЫПОЛНЯЕТ процедуру =====
const SCM_OK = [12, 2, 0.12];
const ScreenColMul = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s_colmul; const sfx = useSfx();
  const audio = useAudio([{ id: 's_colmul_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const labels = [c.lbl_1, c.lbl_2, c.lbl_3];
  const wasSolved = storedAnswer?.solved === true;
  const [vals, setVals] = useState(() => (wasSolved ? ['12', '2', '0,12'] : ['', '', '']));
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const setVal = (i, v) => { if (solved) return; setChecked(false); setVals(p => { const n = [...p]; n[i] = v; return n; }); };
  const isFieldOk = (i) => { const v = parseFloat(String(vals[i]).trim().replace(',', '.')); return !isNaN(v) && Math.abs(v - SCM_OK[i]) < 1e-9; };
  const check = () => {
    if (solved) return;
    if (vals.some(v => String(v).trim() === '')) return;
    const ok = SCM_OK.every((_, i) => isFieldOk(i));
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.lead[lang], correctAnswer: '12,2,0.12', studentAnswer: vals.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <Floaters/>
        <Title node={c.title}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(8px, 1.7vw, 14px)' }}>
          <AreaModel cols={3} rows={4} step={3}/>
        </div>
        <div style={{ position: 'relative', maxHeight: solved ? 0 : 500, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(9px, 1.7vw, 13px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
          <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
          <div className="mbk-rows">
            {labels.map((lb, i) => (
              <div key={i} className="mbk-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <span className={`mbk-num${solved ? ' mbk-num-ok' : ''}`}>{i + 1}</span>
                  <span className="mbk-lbl">{mt(t(lb))}</span>
                </span>
                <input type="text" inputMode="decimal" className={`answer-input mbk-box ${solved ? 'correct' : ''} ${checked && !solved && !isFieldOk(i) ? 'mbk-wrong' : ''}`} value={vals[i]} placeholder={t(c.placeholder)} disabled={solved} onChange={e => setVal(i, e.target.value)} onKeyDown={e => e.key === 'Enter' && check()}/>
              </div>
            ))}
          </div>
        </div>
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
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
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ===== s_errspot — НОВЫЙ TEST (error-spotting): где запятая поставлена НЕВЕРНО (M2) =====
const ScreenErrSpot = (props) => {
  const t = useT(); const c = CONTENT.s_errspot;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimDotComma/>}/>}/>;
};

export default function DecMultiplyLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, ScreenAreaModel, ScreenRule, Screen7, Screen8, Screen9, ScreenPractice, Screen11, ScreenColMul, ScreenErrSpot, ScreenCase, Screen14];
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
`;
