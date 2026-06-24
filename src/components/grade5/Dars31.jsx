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
// --- POD UROK: perc_5_02 — Sonning foizini topish / Нахождение процента от числа (REBUILD na Dars28 etalon 2026-06-20) ---
// Markaziy g'oya: SON va uning FOIZI berilgan -> QISMni (foiz) top. "1% ko'prigi": son / 100 = 1%, *foiz = qism.
// Misol: 1200 ning 20% i -> 1200 / 100 = 12 (bu 1%) -> *20 = 240. Teng usul: (foiz/100) * son.
// M1: foiz RAQAMINI javob deb adashish (1200 ning 20% i = 20 deb o'ylash; aslida 240). Sondan FOIZ hisoblanadi.
// Hook: Kamol smartfon ko'radi, narxi 1200, chegirma 20% — chegirma 20 deb o'ylaydi (M1). Case: Feruza ikki do'kon.
// Vizualizator: PercentBar (sondan qism to'ladi) + TileGrid (Dars35 uzluksiz tgBreathe loop; circling YO'Q). Etalon: Dars28.
// Faktlar (DRAFT): Rim "centesima" solig'i yuzdan bir (Tarix) / yuklash-progress foizi (IT) / sport statistikasi, jarima 80% (Sport).
// ============================================================
const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'perc_5_02',
  lessonTitle: { ru: 'Нахождение процента от числа', uz: "Sonning foizini topish" }
};
// Eslatma: ekran ID lari qattiq indeks emas — har komponent jonli `screen` propidan idx oladi.
// Reorder qilishda faqat SCREEN_META + screens massivini bir xil tartibda yangilang.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',          scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',           scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 2 (1% usuli, step)
  { id: 's3',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 3 (slider %->qism)
  { id: 's4',  type: 'rule',        template: 'custom',          scored: false, scope: null },       // 4 (qoida + M1 birlashgan)
  { id: 's5',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },  // 5 (ishlangan misol + mashq)
  { id: 's6',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 6
  { id: 's7',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },  // 7
  { id: 's8',  type: 'test',        template: 'custom',          scored: true,  scope: 'practice' },  // 8 (multi-select)
  { id: 's9',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 9 (xatoni top)
  { id: 's10', type: 'test',        template: 'SeqMC',           scored: true,  scope: 'practice' },  // 10 (3 oson misol)
  { id: 's11', type: 'case',        template: 'custom',          scored: true,  scope: 'final' },     // 11 (masala + yakuniy birlashgan)
  { id: 's12', type: 'summary',     template: 'custom',          scored: false, scope: null }         // 12
];

const CONTENT = {
  // ===== s0 HOOK (M1: foiz raqami = javob) — Kamol smartfon chegirmasi =====
  s0: {
    eyebrow: { ru: 'Скидка', uz: "Chegirma" },
    title: { ru: 'Скидка Камола', uz: "Kamolning chegirmasi" },
    lead: { ru: 'Камол увидел смартфон за 1200. Скидка 20 процентов. На сколько подешевеет?', uz: "Kamol 1200 turadigan smartfon ko'rdi. Chegirma yigirma foiz. Necha pulga arzonlashadi?" },
    opt0: { ru: 'На 20', uz: "20 ga" },
    opt1: { ru: 'На 240', uz: "240 ga" },
    opt2: { ru: 'На 200', uz: "200 ga" },
    reveal0: { ru: 'Так думают многие. Но 20 — это процент, а не сумма скидки. Скидка считается от цены.', uz: "Ko'pchilik shunday o'ylaydi. Lekin 20 — bu foiz, chegirma summasi emas. Chegirma narxdan hisoblanadi." },
    reveal1: { ru: 'Похоже на правду. Дальше проверим: 20 процентов от 1200 — это сколько?', uz: "Haqiqatga o'xshaydi. Keyin tekshiramiz: 1200 ning yigirma foizi — bu nechaga teng?" },
    reveal2: { ru: 'Близко, но не точно. Дальше посчитаем 20 процентов от 1200 шаг за шагом.', uz: "Yaqin, lekin aniq emas. Keyin 1200 ning yigirma foizini qadam-baqadam hisoblaymiz." },
    audio: { ru: "Камол увидел смартфон за тысячу двести. На него скидка двадцать процентов. Подумай: на сколько подешевеет смартфон? На двадцать или на другую сумму?", uz: "Kamol ming ikki yuz turadigan smartfon ko'rdi. Unga yigirma foiz chegirma bor. O'ylab ko'ring: smartfon necha pulga arzonlashadi? Yigirmagami yoki boshqa summagami?" }
  },

  // ===== s1 WARM-UP — 3 ta tez prereq (1% va foiz) =====
  s1: {
    eyebrow: { ru: 'Вспомним прошлый урок', uz: "O'tgan darsni eslaylik" },
    title: { ru: 'Разминка', uz: "Mashq" },
    lead: { ru: 'Три быстрых примера про проценты. Выбери ответ.', uz: "Foiz haqida uchta tez misol. Javobni tanlang." },
    bridge: { ru: 'Прежде чем помочь Камолу, вспомним проценты.', uz: "Kamolga yordam berishdan oldin foizni eslaylik." },
    questions: [
      {
        q: { ru: '1% от 300', uz: "300 ning 1% i" },
        say: { ru: "Сколько будет один процент от трёхсот?", uz: "Uch yuzning bir foizi nechaga teng?" },
        opts: [{ ru: '3', uz: '3' }, { ru: '30', uz: '30' }, { ru: '300', uz: '300' }],
        correct: 0,
        ok: { ru: 'Верно: один процент — это число разделить на сто.', uz: "To'g'ri: bir foiz — bu sonni yuzga bo'lish." },
        no: { ru: 'Один процент это сотая доля. Раздели число на сто.', uz: "Bir foiz, bu yuzdan bir ulush. Sonni yuzga bo'ling." }
      },
      {
        q: { ru: '10% от 200', uz: "200 ning 10% i" },
        say: { ru: "Сколько будет десять процентов от двухсот?", uz: "Ikki yuzning o'n foizi nechaga teng?" },
        opts: [{ ru: '2', uz: '2' }, { ru: '20', uz: '20' }, { ru: '210', uz: '210' }],
        correct: 1,
        ok: { ru: 'Верно: десять процентов — это десятая доля.', uz: "To'g'ri: o'n foiz — bu o'ndan bir ulush." },
        no: { ru: 'Десять процентов это десятая доля. Раздели число на десять.', uz: "O'n foiz, bu o'ndan bir ulush. Sonni o'nga bo'ling." }
      },
      {
        q: { ru: '12 умножить на 3', uz: "12 ni 3 ga ko'paytiring" },
        say: { ru: "Сколько будет двенадцать умножить на три?", uz: "O'n ikkini uchga ko'paytirsak qancha bo'ladi?" },
        opts: [{ ru: '36', uz: '36' }, { ru: '15', uz: '15' }, { ru: '4', uz: '4' }],
        correct: 0,
        ok: { ru: 'Верно: двенадцать взяли три раза.', uz: "To'g'ri: o'n ikkini uch marta oldik." },
        no: { ru: 'Это умножение: двенадцать взять три раза.', uz: "Bu ko'paytirish: o'n ikkini uch marta olish." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем помочь Камолу, вспомним проценты. Три быстрых примера.", uz: "Kamolga yordam berishdan oldin, foizni eslaylik. Uchta tez misol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Попробуй ещё раз.", uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: "Отлично, разминка пройдена.", uz: "Zo'r, mashq tugadi." }
    }
  },

  // ===== s2 EXPLORATION — 1% usuli: 1200 ning 1% = 12 -> *20 = 240 (step, bar to'ladi) =====
  s2: {
    eyebrow: { ru: 'Метод одного процента', uz: "Bir foiz usuli" },
    title: { ru: 'От одного процента — к скидке', uz: "Bir foizdan — chegirmaga" },
    lead: { ru: 'Вернёмся к смартфону: цена 1200, скидка 20 процентов.', uz: "Smartfonga qaytamiz: narxi 1200, chegirma yigirma foiz." },
    bridge: { ru: 'Размялись. Теперь шаг за шагом найдём скидку.', uz: "Mashq qildik. Endi chegirmani qadam-baqadam topamiz." },
    line_one: { ru: 'Сначала один процент: 1200 делим на 100 — это 12.', uz: "Avval bir foiz: 1200 ni 100 ga bo'lamiz — bu 12." },
    line_mul: { ru: 'Нам нужно 20 процентов: берём 12 двадцать раз.', uz: "Bizga 20 foiz kerak: 12 ni yigirma marta olamiz." },
    line_res: { ru: '12 умножить на 20 — это 240. Вот вся скидка.', uz: "12 ni 20 ga ko'paytiramiz — bu 240. Mana butun chegirma." },
    line_key: { ru: 'Процент берут от числа. Один процент — это число делить на сто.', uz: "Foiz sondan olinadi. Bir foiz — bu sonni yuzga bo'lish." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Размялись. Теперь найдём скидку по шагам.",
        "Сначала один процент. Тысячу двести делим на сто, получается двенадцать.",
        "Нам нужно двадцать процентов. Значит берём двенадцать двадцать раз.",
        "Двенадцать умножить на двадцать, это двести сорок. Вот и вся скидка."
      ],
      uz: [
        "Mashq qildik. Endi chegirmani qadamlab topamiz.",
        "Avval bir foiz. Ming ikki yuzni yuzga bo'lamiz, o'n ikki chiqadi.",
        "Bizga yigirma foiz kerak. Demak o'n ikkini yigirma marta olamiz.",
        "O'n ikkini yigirmaga ko'paytiramiz, bu ikki yuz qirq. Mana butun chegirma."
      ]
    }
  },

  // ===== s3 EXPLORATION — slider: foizni sur, sondan qism to'ladi (jami 80 qat'iy) =====
  s3: {
    eyebrow: { ru: 'Двигай процент', uz: "Foizni suring" },
    title: { ru: 'Процент от числа 80', uz: "80 sonidan foiz" },
    lead: { ru: 'Число всегда 80. Двигай процент — смотри, какая часть берётся.', uz: "Son doim 80. Foizni suring — qaysi qism olinishini kuzating." },
    slider_label: { ru: 'Процент', uz: "Foiz" },
    instr: { ru: 'Чем больше процент, тем больше часть от числа.', uz: "Foiz qancha katta bo'lsa, sondan olingan qism shuncha katta." },
    legend_pct: { ru: 'процент', uz: "foiz" },
    legend_val: { ru: 'часть от 80', uz: "80 dan qism" },
    audio: { ru: "Здесь число всегда восемьдесят. Двигай ползунок процента и смотри, какая часть от числа берётся. Чем больше процент, тем больше часть.", uz: "Bu yerda son doim sakson. Foiz slayderini suring va sondan qaysi qism olinishini kuzating. Foiz qancha katta bo'lsa, qism shuncha katta." }
  },

  // ===== s4 RULE + M1 (birlashgan) =====
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Как найти процент от числа', uz: "Sondan foizni qanday topamiz" },
    bridge: { ru: 'Мы нашли часть руками. Теперь соберём это в правило.', uz: "Qismni qo'l bilan topdik. Endi buni qoidaga yig'amiz." },
    rule_label: { ru: 'Мост через один процент', uz: "Bir foiz ko'prigi" },
    rule_1: { ru: 'Делим число на сто — получаем один процент.', uz: "Sonni yuzga bo'lamiz — bir foizni olamiz." },
    rule_2: { ru: 'Умножаем один процент на нужный процент — получаем часть.', uz: "Bir foizni kerakli foizga ko'paytiramiz — qismni olamiz." },
    rule_3: { ru: 'Коротко: число делим на сто, потом умножаем на процент.', uz: "Qisqacha: sonni yuzga bo'lib, keyin foizga ko'paytiramiz." },
    ex_label: { ru: 'Пример', uz: "Misol" },
    ex_caption: { ru: '25% от 80 → 80 делим на 100 = 0,8 → умножаем на 25 = 20.', uz: "80 ning 25% i → 80 ni 100 ga bo'lamiz = 0,8 → 25 ga ko'paytiramiz = 20." },
    warn_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warn_1: { ru: 'Процент — это не ответ. Скидка 20 процентов от 1200 равна 240, а не 20.', uz: "Foiz — bu javob emas. 1200 dan 20 foiz chegirma 240 ga teng, 20 emas." },
    audio: { ru: "Мы нашли часть руками. Теперь правило. Делим число на сто и получаем один процент. Потом умножаем один процент на нужный процент и получаем часть. И запомни: сам процент это не ответ, его всегда берут от числа.", uz: "Qismni qo'l bilan topdik. Endi qoida. Sonni yuzga bo'lib, bir foizni olamiz. Keyin bir foizni kerakli foizga ko'paytirib, qismni olamiz. Va yodda tuting: foizning o'zi javob emas, u doim sondan olinadi." }
  },

  // ===== s5 ISHLANGAN MISOL + MASHQ (scored): yuqorida 25%=20 statik; pastda 30% dan 50 = 15 (DecInput) =====
  s5: {
    eyebrow: { ru: 'Сначала пример, потом сам', uz: "Avval misol, keyin o'zingiz" },
    title: { ru: 'Найди часть', uz: "Qismni toping" },
    bridge: { ru: 'Правило знаем. Сначала посмотри пример, потом реши сам.', uz: "Qoidani bilamiz. Avval misolni ko'ring, keyin o'zingiz yeching." },
    we_label: { ru: 'Разобранный пример', uz: "Ishlangan misol" },
    we_caption: { ru: '25% от 80 → 80 делим на 100 = 0,8 → умножаем на 25 = 20.', uz: "80 ning 25% i → 80 ni 100 ga bo'lamiz = 0,8 → 25 ga ko'paytiramiz = 20." },
    question: { ru: 'Теперь сам: сколько будет 30% от 50?', uz: "Endi o'zingiz: 50 ning 30% i nechaga teng?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Раздели число на сто, потом умножь на процент.', uz: "Sonni yuzga bo'ling, keyin foizga ko'paytiring." },
    fb_correct: { ru: 'Верно: 50 делим на 100 = 0,5, умножаем на 30 = 15.', uz: "To'g'ri: 50 ni 100 ga bo'lamiz = 0,5, 30 ga ko'paytiramiz = 15." },
    audio: {
      intro: { ru: "Сначала посмотри разобранный пример сверху. Теперь сам: сколько будет тридцать процентов от пятидесяти?", uz: "Avval yuqoridagi ishlangan misolni ko'ring. Endi o'zingiz: ellikning o'ttiz foizi nechaga teng?" },
      on_correct: { ru: "Верно, пятнадцать.", uz: "To'g'ri, o'n besh." },
      on_wrong: { ru: "Раздели число на сто, потом умножь на процент.", uz: "Sonni yuzga bo'ling, keyin foizga ko'paytiring." }
    }
  },

  // ===== s6 TEST MC — 25% от 80 -> 20 [FAKT Rim] =====
  s6: {
    eyebrow: { ru: 'Находим часть', uz: "Qismni topamiz" },
    title: { ru: 'Часть от числа', uz: "Sondan qism" },
    question: { ru: 'Сколько будет 25% от 80?', uz: "80 ning 25% i nechaga teng?" },
    opt0: { ru: '20', uz: '20' },
    opt1: { ru: '25', uz: '25' },
    opt2: { ru: '40', uz: '40' },
    opt3: { ru: '320', uz: '320' },
    correct_text: { ru: 'Верно: 80 делим на 100 = 0,8, умножаем на 25 = 20.', uz: "To'g'ri: 80 ni 100 ga bo'lamiz = 0,8, 25 ga ko'paytiramiz = 20." },
    wrong_1: { ru: 'Это сам процент, а не часть. Раздели число на сто и умножь на процент.', uz: "Bu foizning o'zi, qism emas. Sonni yuzga bo'lib, foizga ko'paytiring." },
    wrong_2: { ru: 'Это половина, а нужна четверть. Раздели на сто, умножь на двадцать пять.', uz: "Bu yarmi, kerak esa chorak. Yuzga bo'ling, yigirma beshga ko'paytiring." },
    wrong_3: { ru: 'Слишком много. Часть меньше числа. Раздели на сто, умножь на процент.', uz: "Juda ko'p. Qism sondan kichik. Yuzga bo'ling, foizga ko'paytiring." },
    fact: { ru: 'В Древнем Риме был налог «центезима» — сотая доля цены при продаже. Это и есть один процент.', uz: "Qadimgi Rimda «centesima» solig'i bo'lgan — sotuvda narxning yuzdan bir ulushi. Bu, aslida, bir foiz." },
    fact_audio: { ru: "В Древнем Риме был налог центезима, сотая доля цены при продаже. Это и есть один процент.", uz: "Qadimgi Rimda centesima solig'i bo'lgan, sotuvda narxning yuzdan bir ulushi. Bu, aslida, bir foiz." },
    audio: {
      intro: { ru: "Сколько будет двадцать пять процентов от восьмидесяти?", uz: "Saksonning yigirma besh foizi nechaga teng?" },
      on_correct: { ru: "Верно, двадцать. Восемьдесят делим на сто, выходит ноль целых восемь десятых, умножаем на двадцать пять.", uz: "To'g'ri, yigirma. Saksonni yuzga bo'lamiz, nol butun o'ndan sakkiz chiqadi, yigirma beshga ko'paytiramiz." },
      on_wrong: { ru: "Раздели число на сто, потом умножь на процент.", uz: "Sonni yuzga bo'ling, keyin foizga ko'paytiring." }
    }
  },

  // ===== s7 TEST DecInput — 40% от 350 -> 140 =====
  s7: {
    eyebrow: { ru: 'Набери ответ', uz: "Javobni tering" },
    bridge: { ru: 'Хорошо. Теперь набери ответ сам.', uz: "Yaxshi. Endi javobni o'zingiz tering." },
    question: { ru: 'Сколько будет 40% от 350?', uz: "350 ning 40% i nechaga teng?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Раздели число на сто, потом умножь на процент.', uz: "Sonni yuzga bo'ling, keyin foizga ko'paytiring." },
    fb_correct: { ru: 'Верно: 350 делим на 100 = 3,5, умножаем на 40 = 140.', uz: "To'g'ri: 350 ni 100 ga bo'lamiz = 3,5, 40 ga ko'paytiramiz = 140." },
    audio: {
      intro: { ru: "Набери ответ сам. Сколько будет сорок процентов от трёхсот пятидесяти?", uz: "Javobni o'zingiz tering. Uch yuz ellikning qirq foizi nechaga teng?" },
      on_correct: { ru: "Верно, сто сорок. Триста пятьдесят делим на сто, выходит три целых пять десятых, умножаем на сорок.", uz: "To'g'ri, bir yuz qirq. Uch yuz ellikni yuzga bo'lamiz, uch butun o'ndan besh chiqadi, qirqqa ko'paytiramiz." },
      on_wrong: { ru: "Раздели число на сто, потом умножь на процент.", uz: "Sonni yuzga bo'ling, keyin foizga ko'paytiring." }
    }
  },

  // ===== s8 TEST multi-select — qaysi hisoblar to'g'ri? (веди-до-верного) =====
  s8: {
    eyebrow: { ru: 'Несколько верных', uz: "Bir nechta to'g'ri" },
    title: { ru: 'Какие расчёты верны?', uz: "Qaysi hisoblar to'g'ri?" },
    lead: { ru: 'Отметь все верные равенства. Их несколько.', uz: "Barcha to'g'ri tengliklarni belgilang. Ular bir nechta." },
    items: [
      { label: { ru: '10% от 200 = 20', uz: "200 ning 10% i = 20" }, ok: true },
      { label: { ru: '50% от 60 = 30', uz: "60 ning 50% i = 30" }, ok: true },
      { label: { ru: '20% от 90 = 20', uz: "90 ning 20% i = 20" }, ok: false },
      { label: { ru: '25% от 40 = 10', uz: "40 ning 25% i = 10" }, ok: true }
    ],
    ask: { ru: 'Отметь верные и нажми «Проверить».', uz: "To'g'rilarni belgilang va «Tekshirish» ni bosing." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Проверь каждое: число делим на сто, потом умножаем на процент.', uz: "Har birini tekshiring: sonni yuzga bo'lib, keyin foizga ko'paytiring." },
    correct_text: { ru: 'Верно! Неверным было только 20% от 90 — там получается 18, а не 20.', uz: "To'g'ri! Faqat 90 ning 20% i noto'g'ri edi — u yerda 18 chiqadi, 20 emas." },
    audio: {
      intro: { ru: "Отметь все верные равенства, их несколько. В каждом проверь: число делим на сто, потом умножаем на процент.", uz: "Barcha to'g'ri tengliklarni belgilang, ular bir nechta. Har birida tekshiring: sonni yuzga bo'lib, keyin foizga ko'paytiramiz." },
      on_correct: { ru: "Верно. В неверном равенстве двадцать процентов от девяноста дают восемнадцать, а не двадцать.", uz: "To'g'ri. Noto'g'ri tenglikda to'qsonning yigirma foizi o'n sakkizni beradi, yigirmani emas." },
      on_wrong: { ru: "Проверь каждое: число делим на сто, потом умножаем на процент.", uz: "Har birini tekshiring: sonni yuzga bo'lib, keyin foizga ko'paytiramiz." }
    }
  },

  // ===== s9 TEST MC (xatoni top) [FAKT IT] =====
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где посчитано неверно?', uz: "Qaysi biri noto'g'ri hisoblangan?" },
    question: { ru: 'В одном примере процент найден неправильно. В каком?', uz: "Bitta misolda foiz noto'g'ri topilgan. Qaysi birida?" },
    opt0: { ru: '10% от 70 = 7', uz: "70 ning 10% i = 7" },
    opt1: { ru: '20% от 50 = 10', uz: "50 ning 20% i = 10" },
    opt2: { ru: '30% от 60 = 9', uz: "60 ning 30% i = 9" },
    opt3: { ru: '50% от 40 = 20', uz: "40 ning 50% i = 20" },
    correct_text: { ru: 'Верно! 60 делим на 100 = 0,6, умножаем на 30 = 18, а не 9.', uz: "To'g'ri! 60 ni 100 ga bo'lamiz = 0,6, 30 ga ko'paytiramiz = 18, 9 emas." },
    wrong_0: { ru: 'Здесь верно: 70 делим на сто, умножаем на десять, выходит семь.', uz: "Bu yerda to'g'ri: 70 ni yuzga bo'lib, o'nga ko'paytiramiz, yetti chiqadi." },
    wrong_1: { ru: 'Здесь верно: 50 делим на сто, умножаем на двадцать, выходит десять.', uz: "Bu yerda to'g'ri: 50 ni yuzga bo'lib, yigirmaga ko'paytiramiz, o'n chiqadi." },
    wrong_3: { ru: 'Здесь верно: половина от сорока равна двадцати.', uz: "Bu yerda to'g'ri: qirqning yarmi yigirmaga teng." },
    wrong_default: { ru: 'Посчитай каждый: число делим на сто, умножаем на процент.', uz: "Har birini hisoblang: sonni yuzga bo'lib, foizga ko'paytiramiz." },
    fact: { ru: 'Когда файл загружается, индикатор показывает проценты: это часть от целого файла, уже скачанная.', uz: "Fayl yuklanayotganda ko'rsatkich foizlarni ko'rsatadi: bu butun fayldan allaqachon yuklab olingan qism." },
    fact_audio: { ru: "Когда файл загружается, индикатор показывает проценты. Это часть от целого файла, которая уже скачана.", uz: "Fayl yuklanayotganda ko'rsatkich foizlarni ko'rsatadi. Bu butun fayldan allaqachon yuklab olingan qism." },
    audio: {
      intro: { ru: "В одном из этих примеров процент найден неправильно. Найди, где сделана ошибка.", uz: "Bu misollardan birida foiz noto'g'ri topilgan. Xato qilingan joyni toping." },
      on_correct: { ru: "Верно. Шестьдесят делим на сто, выходит ноль целых шесть десятых, умножаем на тридцать, получается восемнадцать, а не девять.", uz: "To'g'ri. Oltmishni yuzga bo'lamiz, nol butun o'ndan olti chiqadi, o'ttizga ko'paytiramiz, o'n sakkiz bo'ladi, to'qqiz emas." },
      on_wrong: { ru: "Посчитай каждый: раздели число на сто и умножь на процент.", uz: "Har birini hisoblang: sonni yuzga bo'ling va foizga ko'paytiring." }
    }
  },

  // ===== s10 TEST SeqMC — 3 ta oson misol (scored) =====
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найди процент', uz: "Foizni toping" },
    lead: { ru: 'Три примера. Найди процент от числа.', uz: "Uchta misol. Sondan foizni toping." },
    questions: [
      {
        q: { ru: '10% от 50', uz: "50 ning 10% i" },
        say: { ru: "Сколько будет десять процентов от пятидесяти?", uz: "Ellikning o'n foizi nechaga teng?" },
        opts: [{ ru: '5', uz: '5' }, { ru: '10', uz: '10' }, { ru: '50', uz: '50' }],
        correct: 0,
        ok: { ru: 'Верно: 50 делим на сто, умножаем на десять.', uz: "To'g'ri: 50 ni yuzga bo'lib, o'nga ko'paytiramiz." },
        no: { ru: 'Раздели число на сто, потом умножь на процент.', uz: "Sonni yuzga bo'ling, keyin foizga ko'paytiring." }
      },
      {
        q: { ru: '50% от 60', uz: "60 ning 50% i" },
        say: { ru: "Сколько будет пятьдесят процентов от шестидесяти?", uz: "Oltmishning ellik foizi nechaga teng?" },
        opts: [{ ru: '30', uz: '30' }, { ru: '50', uz: '50' }, { ru: '6', uz: '6' }],
        correct: 0,
        ok: { ru: 'Верно: пятьдесят процентов — это половина.', uz: "To'g'ri: ellik foiz — bu yarmi." },
        no: { ru: 'Пятьдесят процентов это половина. Раздели число пополам.', uz: "Ellik foiz, bu yarim. Sonni teng ikkiga bo'ling." }
      },
      {
        q: { ru: '25% от 40', uz: "40 ning 25% i" },
        say: { ru: "Сколько будет двадцать пять процентов от сорока?", uz: "Qirqning yigirma besh foizi nechaga teng?" },
        opts: [{ ru: '10', uz: '10' }, { ru: '25', uz: '25' }, { ru: '4', uz: '4' }],
        correct: 0,
        ok: { ru: 'Верно: двадцать пять процентов — это четверть.', uz: "To'g'ri: yigirma besh foiz — bu chorak." },
        no: { ru: 'Двадцать пять процентов это четверть. Раздели число на четыре.', uz: "Yigirma besh foiz, bu chorak. Sonni to'rtga bo'ling." }
      }
    ],
    audio: {
      intro: { ru: "Тренировка. Три примера. Найди процент от числа.", uz: "Mashq. Uchta misol. Sondan foizni toping." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Молодец, все примеры верны.", uz: "Barakalla, hamma misol to'g'ri." }
    }
  },

  // ===== s11 CASE setup + FINAL (birlashgan) — Feruza ikki do'kon [FAKT sport] =====
  s11: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Два магазина Ферузы', uz: "Feruzaning ikki do'koni" },
    bridge: { ru: 'Навык есть. Теперь применим его в жизни.', uz: "Ko'nikma bor. Endi uni hayotda qo'llaymiz." },
    lead: { ru: 'Феруза сравнивает скидки. Магазин А: 800, скидка 25 процентов. Магазин Б: 600, скидка 40 процентов.', uz: "Feruza chegirmalarni solishtiradi. A do'kon: 800, chegirma yigirma besh foiz. B do'kon: 600, chegirma qirq foiz." },
    note: { ru: 'Где скидка в деньгах больше?', uz: "Qaysi do'konda chegirma pulda ko'proq?" },
    hint_calc: { ru: 'Посчитай скидку в каждом: число делим на сто, умножаем на процент.', uz: "Har birida chegirmani hisoblang: sonni yuzga bo'lib, foizga ko'paytiring." },
    compact: { ru: 'А: 800 · −25% · Б: 600 · −40%', uz: "A: 800 · −25% · B: 600 · −40%" },
    btn_help: { ru: 'Помочь Ферузе', uz: "Feruzaga yordam berish" },
    question: { ru: 'Где скидка в деньгах больше?', uz: "Qaysi do'konda chegirma pulda ko'proq?" },
    opt0: { ru: 'В магазине Б: скидка 240', uz: "B do'konda: chegirma 240" },
    opt1: { ru: 'В магазине А: скидка 200', uz: "A do'konda: chegirma 200" },
    opt2: { ru: 'Скидки равны', uz: "Chegirmalar teng" },
    opt3: { ru: 'У Б больше процент, значит и деньги', uz: "B da foiz ko'proq, demak pul ham" },
    correct_text: { ru: 'Верно: А даёт скидку 200, а Б даёт 240. У Б скидка в деньгах больше.', uz: "To'g'ri: A 200 chegirma beradi, B esa 240. B da chegirma pulda ko'proq." },
    wrong_1: { ru: 'У А скидка 200, но у Б — 240. Посчитай обе и сравни деньги.', uz: "A da chegirma 200, lekin B da — 240. Ikkalasini hisoblab, pulni solishtiring." },
    wrong_2: { ru: 'Скидки не равны: у А 200, у Б 240. Цены и проценты разные.', uz: "Chegirmalar teng emas: A da 200, B da 240. Narx va foizlar har xil." },
    wrong_3: { ru: 'Больший процент не всегда больше денег. Посчитай обе скидки.', uz: "Katta foiz doim ko'p pul degani emas. Ikkala chegirmani hisoblang." },
    fact: { ru: 'В спорте процент показывает точность: баскетболист с 80 процентами штрафных попадает 8 из 10 раз.', uz: "Sportda foiz aniqlikni ko'rsatadi: jarima zarbalarda 80 foizli basketbolchi 10 tadan 8 tasini kiritadi." },
    fact_audio: { ru: "В спорте процент показывает точность. Баскетболист с восьмьюдесятью процентами штрафных попадает восемь раз из десяти.", uz: "Sportda foiz aniqlikni ko'rsatadi. Jarima zarbalarda sakson foizli basketbolchi o'n tadan sakkiz tasini kiritadi." },
    audio: {
      intro: { ru: "Навык есть, теперь применим в жизни. Феруза сравнивает скидки. Магазин А: восемьсот, скидка двадцать пять процентов. Магазин Б: шестьсот, скидка сорок процентов. Не спеши выбрать больший процент. Нажми помочь.", uz: "Ko'nikma bor, endi hayotda qo'llaymiz. Feruza chegirmalarni solishtiradi. A do'kon: sakkiz yuz, chegirma yigirma besh foiz. B do'kon: olti yuz, chegirma qirq foiz. Katta foizni tanlashga shoshilmang. Yordam berishni bosing." },
      intro2: { ru: "Где скидка в деньгах больше?", uz: "Qaysi do'konda chegirma pulda ko'proq?" },
      on_correct: { ru: "Верно. У А скидка двести, у Б двести сорок. У Б больше.", uz: "To'g'ri. A da chegirma ikki yuz, B da ikki yuz qirq. B da ko'proq." },
      on_wrong: { ru: "Посчитай обе скидки и сравни деньги, а не проценты.", uz: "Ikkala chegirmani hisoblab, foizni emas, pulni solishtiring." }
    }
  },

  // ===== s12 SUMMARY =====
  s12: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Процент от числа', uz: "Sondan foiz" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Делим число на сто — получаем один процент.', uz: "Sonni yuzga bo'lamiz — bir foizni olamiz." },
    main_2: { ru: 'Умножаем один процент на нужный процент — получаем часть.', uz: "Bir foizni kerakli foizga ko'paytiramiz — qismni olamiz." },
    main_3: { ru: 'Процент это не ответ. Его всегда берут от числа.', uz: "Foiz — bu javob emas. U doim sondan olinadi." },
    hook_close: { ru: 'Вот и ответ Камолу: 20% от 1200 — это 240, а не 20.', uz: "Mana Kamolga javob: 1200 ning 20% i — bu 240, 20 emas." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Процент как доля от ста (Урок 30).', uz: "Foiz yuzdan ulush sifatida (30-dars)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Нахождение числа по проценту (Урок 32).', uz: "Foizi bo'yicha sonni topish (32-dars)." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, чтобы найти процент от числа: делим число на сто, получаем один процент, и умножаем на нужный процент. И помним: сам процент это не ответ, его всегда берут от числа.", uz: "Demak, sondan foizni topish uchun: sonni yuzga bo'lib, bir foizni olamiz, va kerakli foizga ko'paytiramiz. Va yodda tutamiz: foizning o'zi javob emas, u doim sondan olinadi." }
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

// Ikonkalar — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Dekorativ suzuvchi birlik kvadratchalar (qism mavzusi, sekin, yengil) — uzluksiz loop.
const FloatTiles = () => (
  <div className="flt" aria-hidden="true">
    <span className="flt-c flt-1"/><span className="flt-c flt-2"/><span className="flt-c flt-3"/>
    <span className="flt-c flt-4"/><span className="flt-c flt-5"/><span className="flt-c flt-6"/>
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_HIST = { ru: 'Знаешь ли ты? · История',   uz: "Bilasizmi? · Tarix" };
const FB_IT   = { ru: 'Знаешь ли ты? · IT',        uz: "Bilasizmi? · IT" };
const FB_SPORT = { ru: 'Полезно знать · Спорт',    uz: "Bilib qo'ying · Sport" };

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
// FAKT-ANIMATSIYALAR (CSS-only loop, ko'k tema) — har biri uzluksiz infinite.
// ============================================================
// Tarix: foiz belgisi (centesima/yuzdan bir) yengil pulse bilan.
const AnimPercent = () => (
  <div className="pa-pct" aria-hidden="true"><span className="pa-pct-s">%</span></div>
);
// IT: yuklash progress-bari to'lqinli to'ladi.
const AnimProgress = () => (
  <div className="pa-prog" aria-hidden="true"><span className="pa-prog-fill"/></div>
);
// Sport: nishon — jarima aniqligi to'lqinli yonadi.
const AnimTarget = () => (
  <div className="pa-tgt" aria-hidden="true"><span className="pa-tgt-r1"/><span className="pa-tgt-r2"/><span className="pa-tgt-r3"/></div>
);

// ============================================================
// VIZUALIZATOR — TileGrid (Dars35 uzluksiz tgBreathe loop) + PercentBar (sondan qism to'ladi) + DecInputScreen
// Hech bir figura prop-gated yoki one-shot animatsiyaga TAYANMAYDI — har biriga uzluksiz "nafas" (infinite).
// ============================================================
const fmtNum = (v) => { const r = Math.round(v * 100) / 100; return String(r).replace('.', ','); };

// TileGrid — to'g'ri to'rtburchak birlik kvadratlar bilan to'ladi (Dars35 dan). Uzluksiz tgBreathe; circling YO'Q.
// filled = to'ldirilgan kataklar soni (null = hammasi). glow/stagger/success — breathe DOIM saqlanadi.
const TileGrid = ({ cols = 5, rows = 2, filled = null, compact = false, glow = false, stagger = false, success = false }) => {
  const total = cols * rows;
  const fill = filled === null ? total : filled;
  const big = Math.max(cols, rows);
  const cell = compact ? (big >= 8 ? 16 : 22) : (big >= 8 ? 24 : 32);
  return (
    <div className={`tg-host${glow ? ' tg-glow' : ''}${success ? ' tg-ok' : ''}`} aria-hidden="true">
      <div className="tg-grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridTemplateRows: `repeat(${rows}, ${cell}px)` }}>
        {Array.from({ length: total }).map((_, i) => {
          const on = i < fill;
          const delay = (i % cols) + Math.floor(i / cols);
          return <span key={i} className={`tg-cell${on ? ' tg-on' : ''}${on && stagger ? ' tg-pop' : ''}`} style={{ animationDelay: on ? `${delay * (stagger ? 0.03 : 0.05)}s` : undefined }}/>;
        })}
      </div>
    </div>
  );
};

// PercentBar — to'liq son (kulrang track) ichida olingan QISM (apelsin/yashil) foizga mos to'ladi.
// Root .pcb-track DOIM uzluksiz pcbBreathe loop; solved/glow holatda glow QO'SHILADI, breathe DROP QILINMAYDI.
// step 0: faqat tor berilgan qism. step >=2: qism to'liq to'ladi (yashil) + kapsiya.
const PercentBar = ({ number, percent, part, step = 2, glow = false }) => {
  const shown = step >= 2 ? percent : Math.min(percent, 6);   // step<2: ozgina urg'u; step>=2: to'liq foiz
  const filledColor = step >= 2 ? T.success : T.accent;
  return (
    <div className="pcb-wrap">
      <div className={`pcb-track${glow || step >= 2 ? ' pcb-glow' : ''}`}>
        <div className="pcb-fill" style={{ width: `${shown}%`, background: filledColor }}/>
      </div>
      <div className="pcb-caps">
        <span className="pcb-cap"><span className="pcb-cap-k pcb-cap-num">{fmtNum(number)}</span> = 100%</span>
        {step >= 2 && <span className="pcb-cap"><span className="pcb-cap-k pcb-cap-part">{fmtNum(part)}</span> = {percent}%</span>}
      </div>
    </div>
  );
};

// DecInputScreen — o'nli/butun javob: вeди-до-верного + bardoshli tekshiruv (140 = 140; vergul ham qabul). type="number" YO'Q.
const DecInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, topNode, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    const isCorrect = Math.abs(v - correct) < 1e-9;
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        {topNode}
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
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
// SeqMC — ketma-ket bir nechta tez MC (warmup / practice). Mobil-do'st tap.
// Har savolda веди-до-верного; to'g'ridan keyin avto o'tadi. scored=true bo'lsa oxirida bitta natija.
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
              {(() => { const qStr = tx(q.q); return qStr.length <= 14
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

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (M1: foiz raqami = javob). Qaytishda picked TO'LIQ sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: screen, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <PercentBar number={1200} percent={20} part={240} step={0}/>
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

// s1 — WARM-UP: 3 ta tez prereq (tap)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;
// s10 — MASHQ: 3 ta oson misol (tap, scored)
const Screen10 = (props) => <SeqMC {...props} screenContent={CONTENT.s10} scored={true}/>;

// s2 — EXPLORATION (1% usuli: 1200 -> 12 -> 240, step, bar assemble)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  // bar to'lishi: step 1 = 1% urg'usi, step 2 = 20% (qism), step 3 = to'liq qism (yashil).
  const barStep = step >= 2 ? 2 : 0;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 170 }}>
          <PercentBar number={1200} percent={20} part={240} step={barStep} glow={step >= last}/>
          {step >= 1 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_one))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.line_mul))}</p>}
          {step >= 3 && <p className="dm-res fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_res))}</p>}
        </div>
        {step >= last && <div className="frame-tip fade-up" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.line_key))}</p></div>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION: slider foizni suradi, sondan qism to'ladi (jami 80 qat'iy). Vidjet + formula + legenda.
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const NUM = 80;
  const [v, setV] = useState(25);
  const part = Math.round((NUM * v) / 100 * 100) / 100;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          <div className="sl-formula">
            <span className="sl-f-pct">{v}%</span>
            <span className="sl-f-op">{lang === 'uz' ? 'dan' : 'от'} {NUM}</span>
            <span className="sl-f-eq">=</span>
            <span className="sl-f-res">{fmtNum(part)}</span>
          </div>
          <PercentBar number={NUM} percent={v} part={part} step={2}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {v}%</p>
          <Slider value={v} min={0} max={100} step={5} onChange={setV}/>
          <div className="sl-legend">
            <span className="sl-leg-i"><span className="sl-leg-d sl-leg-num"/>{mt(t(c.legend_val))}</span>
            <span className="sl-leg-i"><span className="sl-leg-d sl-leg-pct"/>{mt(t(c.legend_pct))}</span>
          </div>
          <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink3 }}>{mt(t(c.instr))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s4 — RULE + M1 birlashgan (progressiv: Qoida -> chip -> Ogohlantirish). Scrollsiz.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio([
    { id: 'rule_a0', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'more' } }
  ]);
  const [phase, setPhase] = useState(0);          // 0 = qoida, 1 = M1 ogohlantirish
  const rules = [c.rule_1, c.rule_2, c.rule_3];
  const reveal = () => { setPhase(1); };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={lang === 'uz' ? "Davom etish" : 'Дальше'}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        {phase === 0 ? (
          <>
            <Bridge node={c.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
              <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
              </div>
            </div>
            <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)' }}>
              <div style={{ flexShrink: 0 }}><TileGrid cols={5} rows={2} compact={true} glow={true} success={true}/></div>
              <div>
                <p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.ex_label)}</p>
                <p className="body" style={{ margin: 0 }}>{mt(t(c.ex_caption))}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="rule-chip fade-up" onClick={() => setPhase(0)} style={{ position: 'relative' }}>
              <span className="rule-chip-ic" aria-hidden="true"><IconOk/></span>
              <span className="rule-chip-tx">{mt(t(c.heading))}</span>
              <span className="rule-chip-act">{lang === 'uz' ? "ko'rish" : 'показать'}</span>
            </button>
            <h2 className="title h-title fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c.warn_label))}</h2>
            <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn_1))}</p>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s5 — ISHLANGAN MISOL + MASHQ (scored): yuqorida 25%=20 statik bar; pastda 30% dan 50 = 15 DecInput
const Screen5 = (props) => {
  const t = useT(); const c = CONTENT.s5;
  const topNode = (
    <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.we_label)}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}><PercentBar number={80} percent={25} part={20} step={2}/></div>
      <p className="small" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.we_caption))}</p>
    </div>
  );
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={15} topNode={topNode}
    renderVisual={({ solved }) => <PercentBar number={50} percent={30} part={15} step={solved ? 2 : 0} glow={solved}/>}/>;
};

// s6 — TEST MC: 25% от 80 -> 20 [FAKT Rim]
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);   // to'g'ri -> B
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}
    figure={(solved) => <PercentBar number={80} percent={25} part={20} step={solved ? 2 : 0} glow={solved}/>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPercent/>}/>}/>;
};

// s7 — TEST DecInput: 40% от 350 -> 140
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={140}
    renderVisual={({ solved }) => <PercentBar number={350} percent={40} part={140} step={solved ? 2 : 0} glow={solved}/>}/>;
};

// s8 — TEST multi-select (qaysi hisoblar to'g'ri?). веди-до-верного: noto'g'ri belgilangan bo'lsa hint; faqat to'g'ri to'plam o'tkazadi.
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const correctSet = () => new Set(items.map((it, i) => (it.ok ? i : -1)).filter(i => i >= 0));
  const [sel, setSel] = useState(() => (wasSolved ? correctSet() : new Set()));
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const toggle = (i) => { if (solved) return; setHint(false); setSel(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const check = () => {
    if (solved) return;
    const isCorrect = items.every((it, i) => it.ok === sel.has(i));
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: items.map((it, i) => (it.ok ? i : null)).filter(x => x !== null).join(','), studentAnswer: Array.from(sel).join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHint(true); sfx.playWrong(); }
    if (!audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="ms-grid fade-up delay-1">
          {items.map((it, i) => {
            const on = sel.has(i);
            let cls = 'ms-card';
            if (solved) { if (it.ok) cls += ' ms-ok'; }
            else if (on) cls += ' ms-on';
            return (
              <button key={i} className={cls} disabled={solved} onClick={() => toggle(i)}>
                <span className={`ms-box${on ? ' ms-box-on' : ''}`}>{on ? <IconOk/> : null}</span>
                <span className="ms-pair">{mt(t(it.label))}</span>
              </button>
            );
          })}
        </div>
        {!solved && <button className="btn-white-accent fade-up delay-2" onClick={check} style={{ alignSelf: 'flex-start', padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
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

// s9 — TEST MC (xatoni top) [FAKT IT]
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 2, 3]);   // to'g'ri -> C
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimProgress/>}/>}/>;
};

// s11 — CASE setup + FINAL birlashgan (progressiv: shart -> ixcham kontekst KO'RINIB qoladi + MC ochiladi). Scored: final.
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 0, 1, 2]);   // to'g'ri -> B
  const audio = useAudio([
    { id: 'case_a0', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'help' } },
    { id: 'case_a1', text: c.audio.intro2[lang], trigger: 'on_event:help', waits_for: { type: 'option_picked' } }
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
      setWrong(prev => { const nn = new Set(prev); nn.add(i); return nn; });
    }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) {
          const wrongVoice = (content[`wrong_${i}`] && content[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
          if (isCorrect && c.fact_audio && c.fact_audio[lang]) e.pushOneOff(c.fact_audio[lang]);  // FactCard ovozlanadi (TTS-toza)
        }
      }, 300);
    }
  };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={t(c.btn_help)}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        {phase === 0 ? (
          <>
            <Bridge node={c.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
            <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <PercentBar number={800} percent={25} part={200} step={0}/>
              <PercentBar number={600} percent={40} part={240} step={0}/>
            </div>
            <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.note))}</p>
            <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
          </>
        ) : (
          <>
            <div className="case-ctx fade-up" style={{ position: 'relative' }}>
              <span className="case-ctx-tag">{mt(t(c.title))}</span>
              <span className="case-ctx-tx">{mt(t(c.compact))}</span>
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
              <p className="body" style={{ margin: 0 }}>{mt(solved ? t(content.correct_text) : t(content[`wrong_${picked}`] || content.wrong_default || content.correct_text))}</p>
            </FeedbackBlock>
            {solved && <FactCard text={c.fact} badge={FB_SPORT} anim={<AnimTarget/>}/>}
          </>
        )}
      </div>
    </Stage>
  );
};

// s12 — SUMMARY
const Screen12 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <FloatTiles/>
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

export default function PercentOfNumberLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, ScreenRule, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, ScreenCase, Screen12];
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

/* MATH: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

/* ============================================================ */
/* MATH perc_5_02: figuralar + interaktiv blocklar (REBUILD na Dars28). */
/* ============================================================ */
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }
.dm-res { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(26px, 6vw, 40px); color: #1F7A4D; }

/* SeqMC — ketma-ket tez MC progress nuqtalari. */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

/* rule-chip — birlashgan qoida ekranida yopilgan qoida tugmasi. */
.rule-chip { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer; background: #E3F0E8; border: none; border-radius: 12px; padding: clamp(10px, 1.8vw, 13px) clamp(12px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); transition: box-shadow 0.2s ease; }
.rule-chip:hover { box-shadow: 0 10px 22px -6px rgba(31, 122, 77, 0.3); }
.rule-chip-ic { display: flex; color: #1F7A4D; flex-shrink: 0; }
.rule-chip-tx { flex: 1; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px, 1.7vw, 15px); color: #1F7A4D; }
.rule-chip-act { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 12px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A60; flex-shrink: 0; }

/* case-ctx — birlashgan masala ekranida shart ixcham KO'RINIB qoladigan qatori. */
.case-ctx { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; background: #EFEEE9; border-radius: 12px; padding: clamp(9px, 1.7vw, 12px) clamp(12px, 2vw, 16px); }
.case-ctx-tag { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A60; }
.case-ctx-tx { flex: 1; min-width: 0; font-size: clamp(12px, 1.6vw, 14px); color: #0E0E10; }

/* multi-select (qaysi hisoblar to'g'ri?). */
.ms-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); }
.ms-card { cursor: pointer; display: flex; align-items: center; gap: clamp(8px, 1.6vw, 12px); border: 1.5px solid #A7A6A2; background: #FFFFFF; border-radius: 14px; padding: clamp(12px, 2.2vw, 18px) clamp(12px, 2vw, 18px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.16s; text-align: left; }
.ms-card:hover:not(:disabled) { border-color: #FF4F28; }
.ms-card:disabled { cursor: default; }
.ms-box { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; border: 1.6px solid #A7A6A2; display: flex; align-items: center; justify-content: center; color: #FFFFFF; transition: all 0.14s; }
.ms-box-on { background: #FF4F28; border-color: #FF4F28; }
.ms-pair { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.6vw, 20px); color: #0E0E10; }
.ms-on { border-color: #FF4F28; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 18px -6px rgba(255, 79, 40, 0.24); }
.ms-ok { border-color: #1F7A4D; box-shadow: 0 0 0 2px #1F7A4D inset, 0 8px 18px -6px rgba(31, 122, 77, 0.26); }
.ms-ok .ms-box-on { background: #1F7A4D; border-color: #1F7A4D; }

/* bridge — slaydlararo ma'noli o'tish qatori (faza chegarasi). */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* slider formula + legenda (vidjet yolg'iz qoldirilmaydi). */
.sl-formula { display: flex; align-items: baseline; justify-content: center; flex-wrap: wrap; gap: clamp(6px, 1.4vw, 10px); font-family: 'JetBrains Mono', monospace; }
.sl-f-pct { font-weight: 800; font-size: clamp(22px, 5vw, 34px); color: #FF4F28; }
.sl-f-op { font-weight: 600; font-size: clamp(14px, 2.4vw, 18px); color: #5A5A60; }
.sl-f-eq { font-weight: 600; font-size: clamp(18px, 3.4vw, 24px); color: #5A5A60; }
.sl-f-res { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px, 5.5vw, 36px); color: #1F7A4D; }
.sl-legend { display: flex; gap: clamp(14px, 4vw, 26px); justify-content: center; flex-wrap: wrap; }
.sl-leg-i { display: inline-flex; align-items: center; gap: 6px; font-size: clamp(11px, 1.4vw, 12px); color: #5A5A60; }
.sl-leg-d { width: 12px; height: 12px; border-radius: 3px; }
.sl-leg-num { background: #1F7A4D; }
.sl-leg-pct { background: #FF4F28; }

/* ============================================================ */
/* MATH perc_5_02: figuralar — TileGrid (uzluksiz tgBreathe) + PercentBar (pcbBreathe) + fakt-anim. */
/* HAR figura ildizida infinite nafas loop; solved/glow holatda glow QO'SHILADI, nafas DROP QILINMAYDI. */
/* ============================================================ */

/* TileGrid (Dars35) — birlik kvadratlar bilan to'ldirish (CSS pop + uzluksiz breathe loop; circling YO'Q). */
.tg-host { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: clamp(8px, 1.8vw, 14px); }
.tg-grid { display: grid; gap: 2px; background: #A7A6A2; padding: 2px; border-radius: 4px; animation: tgBreathe 3.6s ease-in-out infinite; }
.tg-glow .tg-grid { animation: tgGlow 0.9s ease, tgBreathe 3.6s ease-in-out infinite; }
.tg-cell { background: #FFFFFF; border-radius: 2px; transition: background 0.3s ease, box-shadow 0.3s ease; }
.tg-on { background: #FF4F28; box-shadow: 0 0 6px rgba(255, 79, 40, 0.45); animation: tgPop 0.3s ease both; }
.tg-pop { transform-origin: center; animation: tgPop 0.4s ease-out both; }
.tg-ok .tg-on { background: #1F7A4D; box-shadow: 0 0 6px rgba(31, 122, 77, 0.45); }
@keyframes tgPop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes tgBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 12px rgba(255, 79, 40, 0.14); } }
@keyframes tgGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 14px rgba(255, 79, 40, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }

/* PercentBar — to'liq son ichida olingan QISM foizga mos to'ladi. Ildiz .pcb-track DOIM uzluksiz pcbBreathe loop. */
.pcb-wrap { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 440px; margin: 0 auto; align-items: center; }
.pcb-track { position: relative; width: 100%; height: clamp(30px, 6.5vw, 44px); padding: 0; background: rgba(58, 53, 48, 0.10); border-radius: 12px; overflow: hidden; animation: pcbBreathe 3.6s ease-in-out infinite; }
.pcb-track.pcb-glow { animation: pcbGlow 0.9s ease, pcbBreathe 3.6s ease-in-out infinite; }
.pcb-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 12px; transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s ease; box-shadow: 0 0 8px rgba(31, 122, 77, 0.25); }
@keyframes pcbBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 12px rgba(255, 79, 40, 0.14); } }
@keyframes pcbGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 14px rgba(31, 122, 77, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }
.pcb-caps { display: flex; gap: clamp(14px, 4vw, 28px); flex-wrap: wrap; justify-content: center; }
.pcb-cap { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: clamp(13px, 2vw, 16px); color: #5A5A60; }
.pcb-cap-k { font-weight: 800; }
.pcb-cap-num { color: #5A5A60; }
.pcb-cap-part { color: #1F7A4D; }

/* Fakt-animatsiyalar (ko'k tema, qutiga sig'adi, uzluksiz loop). */
/* Tarix: foiz belgisi (centesima) yengil pulse. */
.pa-pct { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.pa-pct-s { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(40px, 10vw, 62px); color: #019ACB; animation: paPct 2.6s ease-in-out infinite; }
@keyframes paPct { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.12); opacity: 1; } }
/* IT: yuklash progress-bari to'lqinli to'ladi. */
.pa-prog { width: clamp(76px, 16vw, 108px); height: 14px; background: rgba(1, 154, 203, 0.15); border-radius: 7px; overflow: hidden; }
.pa-prog-fill { display: block; height: 100%; width: 40%; background: #019ACB; border-radius: 7px; animation: paProg 2.2s ease-in-out infinite; }
@keyframes paProg { 0% { width: 12%; } 50% { width: 92%; } 100% { width: 12%; } }
/* Sport: nishon halqalari to'lqinli yonadi. */
.pa-tgt { position: relative; width: clamp(60px, 13vw, 84px); height: clamp(60px, 13vw, 84px); display: flex; align-items: center; justify-content: center; }
.pa-tgt-r1, .pa-tgt-r2, .pa-tgt-r3 { position: absolute; border-radius: 50%; border: 3px solid #019ACB; opacity: 0.3; animation: paTgt 2.4s ease-in-out infinite; }
.pa-tgt-r1 { width: 100%; height: 100%; animation-delay: 0s; }
.pa-tgt-r2 { width: 64%; height: 64%; animation-delay: 0.25s; }
.pa-tgt-r3 { width: 28%; height: 28%; background: #019ACB; border: none; animation-delay: 0.5s; }
@keyframes paTgt { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.9; } }

/* flt — dekorativ suzuvchi birlik kvadratchalar (qism mavzusi, sekin, yengil, uzluksiz). */
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
