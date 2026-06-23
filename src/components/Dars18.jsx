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
      <div className="stage-content has-amb" style={{ paddingLeft: padH, paddingRight: padH }}>
        <Floaters/>
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
// --- UROK: frac_5_10 — Вычитание дробей с равными знаменателями / Bir xil maxrajli kasrlarni ayirish ---
// Infra Dars28 (baytma-bayt) + Stage fon-on-all. Keep-visible standart (PROMPT 2-B/2-C).
// Yangi syujet/personaj: Sevinch (sharbat), Rustam (suv). Vizualizator: LiquidJug (vertikal idish, ulush quyiladi).
// ============================================================
const LESSON_META = {
  lessonId: 'frac_5_10',
  lessonTitle: { ru: 'Вычитание дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni ayirish" }
};
const TOTAL_SCREENS = 10;

// Obuchayushchiy dars: proverochnye ekrany scored (pervaya popytka -> LMS), summary bez schyota.
const SCREEN_META = [
  { id: 's0', type: 'hook',        template: 'custom',  scored: false, scope: 'hook' },     // 0
  { id: 's1', type: 'exploration', template: 'custom',  scored: false, scope: null },       // 1
  { id: 's2', type: 'exploration', template: 'custom',  scored: false, scope: null },       // 2
  { id: 's3', type: 'rule',        template: 'custom',  scored: false, scope: null },       // 3
  { id: 's4', type: 'test',        template: 'SeqMC',   scored: true,  scope: 'practice' }, // 4 (5 oson savol)
  { id: 's5', type: 'rule',        template: 'custom',  scored: false, scope: null },       // 5
  { id: 's6', type: 'test',        template: 'SeqMix',  scored: true,  scope: 'practice' }, // 6 (6-8 misol, har xil tip)
  { id: 's7', type: 'case',        template: 'custom',  scored: true,  scope: 'practice' }, // 7
  { id: 's8', type: 'case',        template: 'QuestionScreen', scored: true, scope: 'final' }, // 8
  { id: 's9', type: 'summary',     template: 'custom',  scored: false, scope: null }        // 9
];

const CONTENT = {
  // ===== s0 HOOK (konseptual M1): ayirganda maxraj o'zgaradimi? =====
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    title: { ru: 'Севинч налила сок гостям', uz: "Sevinch mehmonlarga sharbat quydi" },
    lead: { ru: 'В кувшине было 7/8 сока. Севинч налила из него 3/8 в пиалы.', uz: "Idishda 7/8 sharbat bor edi. Sevinch undan 3/8 ni piyolalarga quydi." },
    question: { ru: 'Когда мы вычитаем, нижнее число — знаменатель — изменится?', uz: "Ayirganimizda pastki son — maxraj — o'zgaradimi?" },
    opt0: { ru: 'Нет, знаменатель остаётся тем же', uz: "Yo'q, maxraj o'sha bo'lib qoladi" },
    opt1: { ru: 'Да, знаменатель тоже уменьшается', uz: "Ha, maxraj ham kichrayadi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Верно. Кувшин всё так же поделён на 8 равных долей. Меняется только число долей: 7/8 − 3/8 = 4/8.', uz: "To'g'ri. Idish baribir 8 teng ulushga bo'lingan. Faqat ulushlar soni kamayadi: 7/8 − 3/8 = 4/8." },
    reveal1: { ru: 'Так думают многие, но нет. Размер доли не меняется — в кувшине всё те же 8 долей. Просто становится на 3 доли меньше.', uz: "Ko'pchilik shunday o'ylaydi, lekin yo'q. Ulush o'lchami o'zgarmaydi — idishda hamon 8 ulush. Faqat 3 ulushga kam bo'ladi." },
    reveal2: { ru: 'Давай посмотрим на кувшине — знаменатель остаётся тем же.', uz: "Keling, idishda ko'rib chiqamiz — maxraj o'sha bo'lib qoladi." },
    audio: { ru: 'В кувшине было семь восьмых сока. Севинч налила из него три восьмых в пиалы. Когда мы вычитаем, нижнее число, знаменатель, изменится или останется тем же? Как думаешь? Выбери ответ.', uz: "Idishda sakkizdan yetti sharbat bor edi. Sevinch undan sakkizdan uchini piyolalarga quydi. Ayirganimizda pastki son, ya'ni maxraj, o'zgaradimi yoki o'sha bo'lib qoladimi? Sizningcha qanday? Javobni tanlang." }
  },

  // ===== s1 EXPLORATION (step): idishdan ulush olamiz, 5/6 - 2/6 = 3/6 =====
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Вычесть — значит убрать доли', uz: "Ayirish — ulushlarni olib tashlash" },
    lead: { ru: 'В кувшине 5/6 сока. Уберём 2/6 и посмотрим, что станет со знаменателем.', uz: "Idishda 5/6 sharbat bor. 2/6 ni olib tashlaymiz va maxrajga nima bo'lishini ko'ramiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    cap1: { ru: 'Убираем две доли сверху.', uz: "Yuqoridan ikki ulushni olamiz." },
    cap2: { ru: 'Доли вылились. Размер доли не изменился.', uz: "Ulushlar quyildi. Ulush o'lchami o'zgarmadi." },
    cap3: { ru: 'Осталось 3 доли из тех же 6. 5/6 − 2/6 = 3/6.', uz: "O'sha 6 dan 3 ulush qoldi. 5/6 − 2/6 = 3/6." },
    audio: {
      ru: [
        'Кувшин поделён на шесть равных долей, в нём пять шестых сока. Нажимай кнопку дальше.',
        'Вычесть две шестых значит убрать две доли сверху.',
        'Две доли вылились из кувшина. Размер доли не изменился.',
        'Осталось три доли из тех же шести. Знаменатель остался шесть, мы убрали только число долей. Пять шестых минус две шестых равно три шестых.'
      ],
      uz: [
        "Idish olti teng ulushga bo'lingan, ichida oltidan besh sharbat bor. Davom etish tugmasini bosing.",
        "Oltidan ikkini ayirish, bu yuqoridan ikki ulushni olib tashlash.",
        "Ikki ulush idishdan quyildi. Ulush o'lchami o'zgarmadi.",
        "O'sha oltidan uch ulush qoldi. Maxraj olti bo'lib qoldi, biz faqat ulushlar sonini ayirdik. Oltidan besh minus oltidan ikki teng oltidan uch."
      ]
    }
  },

  // ===== s2 EXPLORATION (jonli slider): o'quvchi o'zi quyib yuboradi (den 8) =====
  s2: {
    eyebrow: { ru: 'Поиграй', uz: "O'ynab ko'ring" },
    title: { ru: 'Вылей сам — найди разность', uz: "O'zingiz quying — ayirmani toping" },
    lead: { ru: 'В кувшине 7/8 сока. Двигай ползунок и вылей несколько долей.', uz: "Idishda 7/8 sharbat bor. Slayderni surib, bir nechta ulushni quying." },
    slider_label: { ru: 'Вылито долей', uz: "Quyilgan ulush" },
    note: { ru: 'Знаменатель всё время 8 — доли одного размера. Разность не может стать меньше нуля.', uz: "Maxraj doim 8 — ulushlar bir o'lchamda. Ayirma noldan kichik bo'lolmaydi." },
    audio: { ru: 'Двигай ползунок и вылей несколько долей из семи восьмых. Знаменатель всё время восемь, доли одного размера, поэтому мы просто отнимаем число долей. Обрати внимание: разность не может стать меньше нуля.', uz: "Slayderni surib, yettidan sakkizdan bir nechta ulushni quying. Maxraj doim sakkiz, ulushlar bir o'lchamda, shuning uchun biz faqat ulushlar sonini ayiramiz. E'tibor bering: ayirma noldan kichik bo'lolmaydi." }
  },

  // ===== s3 RULE =====
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Вычитаем числители, знаменатель тот же', uz: "Suratlarni ayiramiz, maxraj o'sha" },
    bridge: { ru: 'Мы увидели это на кувшине. Теперь соберём в правило.', uz: "Buni idishda ko'rdik. Endi qoidaga yig'amiz." },
    rule_label: { ru: 'Запомните', uz: "Yodda tuting" },
    rule_1: { ru: 'Если знаменатели равны, вычитаем только числители.', uz: "Maxrajlar bir xil bo'lsa, faqat suratlarni ayiramiz." },
    rule_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    card_top: { ru: 'Числитель — сколько долей. Вычитаем: 5 − 2 = 3.', uz: "Surat — nechta ulush. Ayiramiz: 5 − 2 = 3." },
    card_bottom: { ru: 'Знаменатель — размер доли. Он один и тот же, поэтому не меняется.', uz: "Maxraj — ulush o'lchami. U bir xil, shuning uchun o'zgarmaydi." },
    ex_label: { ru: 'Как это работает', uz: "Bu qanday ishlaydi" },
    ex_caption: { ru: '5/6 − 2/6: знаменатель 6 тот же, ответ 3/6.', uz: "5/6 − 2/6: maxraj 6 o'sha, javob 3/6." },
    audio: { ru: 'Запомните правило. Когда у дробей одинаковый знаменатель, вычитаем только числители, а знаменатель оставляем тем же. Числитель показывает, сколько долей: пять минус два три. Знаменатель это размер доли, он один и тот же, поэтому не меняется. Пять шестых минус две шестых равно три шестых.', uz: "Qoidani yodda tuting. Kasrlarning maxraji bir xil bo'lganda, faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz. Surat nechta ulush ekanini ko'rsatadi: besh minus ikki uch. Maxraj ulush o'lchami, u bir xil, shuning uchun o'zgarmaydi. Oltidan besh minus oltidan ikki teng oltidan uch." }
  },

  // ===== s4 — BESHTA OSON SAVOL (SeqMC, scored) =====
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Пять быстрых примеров', uz: "Beshta tez misol" },
    lead: { ru: 'Вычитай дроби с равным знаменателем. Выбери ответ.', uz: "Bir xil maxrajli kasrlarni ayiring. Javobni tanlang." },
    bridge: { ru: 'Правило знаем — теперь потренируемся.', uz: "Qoidani bilamiz — endi mashq qilamiz." },
    questions: [
      {
        q: '4/5 − 1/5', say: { ru: 'Вычти из четырёх пятых одну пятую.', uz: "Beshdan to'rtdan beshdan birni ayiring." },
        opts: ['3/5', '2/5', '3/10'], correct: 0,
        ok: { ru: 'Верно: 4 − 1 = 3, знаменатель 5.', uz: "To'g'ri: 4 − 1 = 3, maxraj 5." },
        no: { ru: 'Вычитай только числители, знаменатель остаётся тем же.', uz: "Faqat suratlarni ayiring, maxraj o'sha bo'lib qoladi." }
      },
      {
        q: '7/9 − 3/9', say: { ru: 'Вычти из семи девятых три девятых.', uz: "To'qqizdan yettidan to'qqizdan uchni ayiring." },
        opts: ['4/0', '4/9', '10/9'], correct: 1,
        ok: { ru: 'Верно: 7 − 3 = 4, знаменатель 9.', uz: "To'g'ri: 7 − 3 = 4, maxraj 9." },
        no: { ru: 'Знаменатель не вычитается и не складывается, он остаётся тем же.', uz: "Maxraj ayirilmaydi ham, qo'shilmaydi ham, u o'sha bo'lib qoladi." }
      },
      {
        q: '5/6 − 2/6', say: { ru: 'Вычти из пяти шестых две шестых.', uz: "Oltidan beshdan oltidan ikkini ayiring." },
        opts: ['3/12', '7/6', '3/6'], correct: 2,
        ok: { ru: 'Верно: 5 − 2 = 3, знаменатель 6.', uz: "To'g'ri: 5 − 2 = 3, maxraj 6." },
        no: { ru: 'Это вычитание, а знаменатель не трогаем.', uz: "Bu ayirish, maxrajga esa tegmaymiz." }
      },
      {
        q: '6/8 − 2/8', say: { ru: 'Вычти из шести восьмых две восьмых.', uz: "Sakkizdan oltidan sakkizdan ikkini ayiring." },
        opts: ['4/8', '8/8', '4/16'], correct: 0,
        ok: { ru: 'Верно: 6 − 2 = 4, знаменатель 8.', uz: "To'g'ri: 6 − 2 = 4, maxraj 8." },
        no: { ru: 'Вычитаем числители, знаменатель оставляем тем же.', uz: "Suratlarni ayiramiz, maxrajni o'sha qoldiramiz." }
      },
      {
        q: '9/10 − 4/10', say: { ru: 'Вычти из девяти десятых четыре десятых.', uz: "O'ndan to'qqizdan o'ndan to'rtni ayiring." },
        opts: ['13/10', '5/10', '5/0'], correct: 1,
        ok: { ru: 'Верно: 9 − 4 = 5, знаменатель 10.', uz: "To'g'ri: 9 − 4 = 5, maxraj 10." },
        no: { ru: 'Знаменатель не может стать нулём, он остаётся тем же.', uz: "Maxraj nol bo'lolmaydi, u o'sha bo'lib qoladi." }
      }
    ],
    audio: {
      intro: { ru: 'Правило знаем, теперь потренируемся. Пять быстрых примеров.', uz: "Qoidani bilamiz, endi mashq qilamiz. Beshta tez misol." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все примеры решены.', uz: "Zo'r, hamma misol yechildi." }
    }
  },

  // ===== s5 RULE (maxsus holat): suratlar teng -> ayirma nol =====
  s5: {
    eyebrow: { ru: 'Особый случай', uz: "Maxsus holat" },
    heading: { ru: 'Когда разность равна нулю', uz: "Ayirma nolga teng bo'lganda" },
    title: { ru: 'Если числители равны — разность равна нулю.', uz: "Suratlar teng bo'lsa — ayirma nolga teng." },
    card_top: { ru: '3/7 − 3/7: убрали все три доли. Из 7 осталось 0 долей.', uz: "3/7 − 3/7: uchala ulushni oldik. 7 dan 0 ulush qoldi." },
    card_line: { ru: '3/7 − 3/7 = 0/7 = 0. Ноль долей — это просто ноль.', uz: "3/7 − 3/7 = 0/7 = 0. Nol ulush — bu shunchaki nol." },
    btn: { ru: 'Понятно', uz: "Tushunarli" },
    audio: { ru: 'Бывает, что вычитаем все доли. Три седьмых минус три седьмых: убрали все три доли, осталось ноль долей из семи. Ноль седьмых это просто ноль. Знаменатель при этом всё равно не менялся.', uz: "Ba'zan hamma ulushni ayiramiz. Yettidan uch minus yettidan uch: uchala ulushni oldik, yettidan nol ulush qoldi. Yettidan nol bu shunchaki nol. Maxraj baribir o'zgarmadi." }
  },

  // ===== s6 — OLTI-SAKKIZ MISOL, OSONDAN QIYINGA, HAR XIL TIP (SeqMix, scored) =====
  s6: {
    eyebrow: { ru: 'Смешанная тренировка', uz: "Aralash mashq" },
    title: { ru: 'Семь примеров — разного типа', uz: "Yettita misol — har xil turdagi" },
    lead: { ru: 'Каждый пример другого типа: от лёгкого к трудному.', uz: "Har misol boshqacha turdagi: osondan qiyinga." },
    bridge: { ru: 'Теперь проверим себя на разных типах вопросов.', uz: "Endi turli xil savollar bilan o'zimizni sinaymiz." },
    lvl_easy: { ru: 'Лёгкий', uz: "Oson" },
    lvl_mid: { ru: 'Средний', uz: "O'rta" },
    lvl_hard: { ru: 'Трудный', uz: "Qiyin" },
    bin_zero: { ru: 'Ноль', uz: "Nol" },
    bin_pos: { ru: 'Больше нуля', uz: "Noldan katta" },
    bin_ask: { ru: 'Перетащи в корзину или нажми', uz: "Savatga torting yoki bosing" },
    drag_num: { ru: 'Перетащи число в окошко или нажми', uz: "Sonni katakka torting yoki bosing" },
    drag_frac: { ru: 'Перетащи дробь в окошко или нажми', uz: "Kasrni katakka torting yoki bosing" },
    items: [
      // (1) DRAG: sonni katakka — 4/6 − 1/6 = [?]/6, javob 3
      { kind: 'dragnum', lvl: 'easy', a: 4, b: 1, d: 6,
        chips: [{ id: 'c0', label: '3', ok: true }, { id: 'c1', label: '5', ok: false }, { id: 'c2', label: '2', ok: false }],
        say: { ru: 'Вычти из четырёх шестых одну шестую и перетащи нужное число в окошко.', uz: "Oltidan to'rtdan oltidan birni ayiring va kerakli sonni katakka torting." },
        ok: { ru: 'Верно: 4 − 1 = 3, знаменатель 6.', uz: "To'g'ri: 4 − 1 = 3, maxraj 6." },
        no: { ru: 'Вычитай числители, знаменатель не меняется.', uz: "Suratlarni ayiring, maxraj o'zgarmaydi." } },
      // (2) MC
      { kind: 'mc', lvl: 'easy', prob: '3/5 − 2/5', opts: ['1/5', '1/0', '5/5'], correct: 0,
        say: { ru: 'Вычти из трёх пятых две пятых.', uz: "Beshdan uchdan beshdan ikkini ayiring." },
        ok: { ru: 'Верно: 3 − 2 = 1, знаменатель 5.', uz: "To'g'ri: 3 − 2 = 1, maxraj 5." },
        no: { ru: 'Знаменатель остаётся, вычитай только числители.', uz: "Maxraj o'sha qoladi, faqat suratlarni ayiring." } },
      // (3) DRAG: kasrni qutiga — 7/10 − 4/10 = [?], javob 3/10
      { kind: 'dragfrac', lvl: 'mid', a: 7, b: 4, d: 10,
        chips: [{ id: 'c0', frac: ['11', '10'], ok: false }, { id: 'c1', frac: ['3', '10'], ok: true }, { id: 'c2', frac: ['3', '0'], ok: false }],
        say: { ru: 'Вычти из семи десятых четыре десятых и перетащи правильную дробь в окошко.', uz: "O'ndan yettidan o'ndan to'rtni ayiring va to'g'ri kasrni katakka torting." },
        ok: { ru: 'Верно: 7 − 4 = 3, знаменатель 10.', uz: "To'g'ri: 7 − 4 = 3, maxraj 10." },
        no: { ru: 'Знаменатель десять остаётся, вычитай только числители.', uz: "Maxraj o'n bo'lib qoladi, faqat suratlarni ayiring." } },
      // (4) MC: noto'g'risini-top
      { kind: 'mc', lvl: 'mid', prob: 'Qaysi tenglik NOTO\'G\'RI?', probRu: 'Какое равенство НЕВЕРНО?',
        opts: ['6/7 − 2/7 = 4/7', '5/9 − 3/9 = 2/9', '8/8 − 3/8 = 5/0'], correct: 2, optSize: 'sm',
        say: { ru: 'Внимание: найди неверное равенство. Где знаменатель записан неправильно?', uz: "Diqqat: noto'g'ri tenglikni toping. Maxraj qayerda noto'g'ri yozilgan?" },
        ok: { ru: 'Верно: знаменатель нельзя превращать в ноль, он остаётся тем же.', uz: "To'g'ri: maxrajni nolga aylantirib bo'lmaydi, u o'sha bo'lib qoladi." },
        no: { ru: 'Это равенство верное. Ищи то, где тронули знаменатель.', uz: "Bu tenglik to'g'ri. Maxrajga tegilganini qidiring." } },
      // (5) MC: nol holat
      { kind: 'mc', lvl: 'mid', prob: '6/6 − 6/6', opts: ['0', '1', '6/0'], correct: 0,
        say: { ru: 'Вычти из шести шестых шесть шестых.', uz: "Oltidan oltidan oltidan oltini ayiring." },
        ok: { ru: 'Верно: убрали все доли, осталось 0.', uz: "To'g'ri: hamma ulushni oldik, 0 qoldi." },
        no: { ru: 'Числители равны, долей не остаётся, выходит ноль.', uz: "Suratlar teng, ulush qolmaydi, nol chiqadi." } },
      // (6) DRAG: ifodani savatga (klassifikatsiya) — 4/7 − 4/7 → Nol
      { kind: 'dragbin', lvl: 'hard', expr: '4/7 − 4/7', bin: 'zero',
        say: { ru: 'Разность будет ноль или больше нуля? Перетащи в нужную корзину.', uz: "Ayirma nol bo'ladimi yoki noldan kattami? Kerakli savatga torting." },
        ok: { ru: 'Верно: числители равны, значит ноль.', uz: "To'g'ri: suratlar teng, demak nol." },
        no: { ru: 'Сравни числители: если они равны, разность ноль.', uz: "Suratlarni solishtiring: ular teng bo'lsa, ayirma nol." } },
      // (7) DRAG: sonni katakka (butundan) — 7/7 − 2/7 = [?]/7, javob 5
      { kind: 'dragnum', lvl: 'hard', a: 7, b: 2, d: 7,
        chips: [{ id: 'c0', label: '9', ok: false }, { id: 'c1', label: '5', ok: true }, { id: 'c2', label: '3', ok: false }],
        say: { ru: 'Семь седьмых это целое. Вычти из него две седьмых и перетащи число в окошко.', uz: "Yettidan yetti, bu butun. Undan yettidan ikkini ayiring va sonni katakka torting." },
        ok: { ru: 'Верно: 7 − 2 = 5, знаменатель 7.', uz: "To'g'ri: 7 − 2 = 5, maxraj 7." },
        no: { ru: 'Целое это семь седьмых. Вычитай числители, знаменатель тот же.', uz: "Butun, bu yettidan yetti. Suratlarni ayiring, maxraj o'sha." } }
    ],
    fact: { ru: 'Полоса загрузки файла показывает, сколько долей из целого осталось, — это тоже дробь.', uz: "Fayl yuklanish chizig'i butundan necha ulush qolganini ko'rsatadi — bu ham aslida kasr." },
    audio: {
      intro: { ru: 'Теперь проверим себя на разных типах. Семь примеров, каждый другого типа.', uz: "Endi turli xil savollar bilan o'zimizni sinaymiz. Yettita misol, har biri boshqacha." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все типы примеров решены. Кстати, полоса загрузки файла это тоже дробь от целого.', uz: "Ajoyib, barcha turdagi misollar yechildi. Aytgancha, fayl yuklanish chizig'i ham butundan ulush, ya'ni kasr." }
    }
  },

  // ===== s7 — CASE interaktiv: Rustam suv idishi, rosa 4 ulush quyiladi (tap, scored) =====
  s7: {
    eyebrow: { ru: 'Задача · вода', uz: "Masala · suv" },
    title: { ru: 'Рустам полил цветок', uz: "Rustam gulga suv quydi" },
    lead: { ru: 'В лейке было 9/10 воды. Рустам вылил 4 доли. Убери ровно 4 доли — нажми на уровень воды.', uz: "Idishda 9/10 suv bor edi. Rustam 4 ulush quydi. Rosa 4 ulushni oling — suv darajasiga bosing." },
    hint: { ru: 'Нажми на доли в кувшине, чтобы выставить уровень. Нужно убрать ровно 4 доли. Знаменатель остаётся 10.', uz: "Darajani belgilash uchun idishdagi ulushlarga bosing. Rosa 4 ulushni olish kerak. Maxraj 10 bo'lib qoladi." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    btn_reset: { ru: 'Сбросить', uz: "Qaytadan" },
    fb_correct: { ru: 'Верно. Из 9 долей вылили 4, осталось 5. 9/10 − 4/10 = 5/10.', uz: "To'g'ri. 9 ulushdan 4 tasi quyildi, 5 tasi qoldi. 9/10 − 4/10 = 5/10." },
    audio: {
      intro: { ru: 'В лейке было девять десятых воды. Рустам вылил четыре доли. Выставь уровень: убери ровно четыре доли. Знаменатель остаётся десять. Потом нажми проверить.', uz: "Idishda o'ndan to'qqiz suv bor edi. Rustam to'rt ulush quydi. Darajani belgilang: rosa to'rt ulushni oling. Maxraj o'n bo'lib qoladi. Keyin tekshiring." },
      on_correct: { ru: 'Верно. Осталось пять десятых.', uz: "To'g'ri. O'ndan besh qoldi." },
      on_wrong: { ru: 'Пока не то. Убрать нужно ровно четыре доли из девяти.', uz: "Hozircha emas. To'qqiz ulushdan rosa to'rttasini olish kerak." }
    }
  },

  // ===== s8 — CASE yakuniy (QuestionScreen, final): 9/10 - 4/10 = 5/10 =====
  s8: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    title: { ru: 'Посчитай оставшуюся воду', uz: "Qolgan suvni hisoblang" },
    question: { ru: '9/10 − 4/10 = ?', uz: "9/10 − 4/10 = ?" },
    opt0: { ru: '5/10', uz: '5/10' },
    opt1: { ru: '5/0', uz: '5/0' },
    opt2: { ru: '5/20', uz: '5/20' },
    opt3: { ru: '13/10', uz: '13/10' },
    correct_text: { ru: 'Правильно. 9 − 4 = 5, знаменатель 10: осталось 5/10 воды.', uz: "To'g'ri. 9 − 4 = 5, maxraj 10: 5/10 suv qoldi." },
    wrong_1: { ru: 'Знаменатель не может стать нулём. Доли остаются десятыми, вычитай только числители.', uz: "Maxraj nol bo'lolmaydi. Ulushlar o'ndan bo'lib qoladi, faqat suratlarni ayiring." },
    wrong_2: { ru: 'Знаменатель не удваивается. Доли остаются десятыми, вычитай только числители.', uz: "Maxraj ikkilanmaydi. Ulushlar o'ndan bo'lib qoladi, faqat suratlarni ayiring." },
    wrong_3: { ru: 'Это вычитание, а не сложение. Отними числители, знаменатель остаётся тем же.', uz: "Bu ayirish, qo'shish emas. Suratlarni ayiring, maxraj o'sha bo'lib qoladi." },
    wrong_default: { ru: 'Знаменатель остаётся десять, вычитай только числители.', uz: "Maxraj o'n bo'lib qoladi, faqat suratlarni ayiring." },
    fact: { ru: 'В Древнем Египте дроби записывали только как сумму долей с числителем 1.', uz: "Qadimgi Misrda kasrlar faqat surati bir bo'lgan ulushlar yig'indisi sifatida yozilgan." },
    audio: {
      intro: { ru: 'Вычти из девяти десятых четыре десятых. Сколько воды осталось? Выбери ответ.', uz: "O'ndan to'qqizdan o'ndan to'rtni ayiring. Qancha suv qoldi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Осталось пять десятых. А в Древнем Египте такие дроби писали только через доли с единицей наверху.', uz: "To'g'ri. O'ndan besh qoldi. Qadimgi Misrda esa bunday kasrlar faqat yuqorisida bir turgan ulushlar bilan yozilgan." },
      on_wrong: { ru: 'Не совсем. Знаменатель не меняется, вычитай только числители.', uz: "Unchalik emas. Maxraj o'zgarmaydi, faqat suratlarni ayiring." }
    }
  },

  // ===== s9 SUMMARY + ConnectionsBlock =====
  s9: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что мы усвоили', uz: "Nimani o'rgandik" },
    title: { ru: 'Теперь ты вычитаешь дроби с равным знаменателем.', uz: "Endi siz bir xil maxrajli kasrlarni ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'У дробей с равным знаменателем вычитаем только числители.', uz: "Bir xil maxrajli kasrlarda faqat suratlarni ayiramiz." },
    main_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    main_3: { ru: 'Если числители равны, разность равна нулю (3/7 − 3/7 = 0).', uz: "Suratlar teng bo'lsa, ayirma nolga teng (3/7 − 3/7 = 0)." },
    score_label: { ru: 'Верно с первой попытки', uz: "Birinchi urinishda to'g'ri" },
    back_to_hook: { ru: 'Кувшин Севинч: 7/8 − 3/8 = 4/8. Знаменатель не изменился.', uz: "Sevinch idishi: 7/8 − 3/8 = 4/8. Maxraj o'zgarmadi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с равным знаменателем» (тот же принцип) и «Что такое дробь».', uz: "«Bir xil maxrajli kasrlarni qo'shish» (o'sha tamoyil) va «Kasr nima»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni ayirish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты вычитаешь дроби с равным знаменателем. Вычитаем только числители, а знаменатель оставляем тем же, это размер доли. А если числители равны, разность равна нулю. Дальше научимся вычитать дроби с разными знаменателями.', uz: "Zo'r. Endi siz bir xil maxrajli kasrlarni ayirasiz. Faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz, bu ulush o'lchami. Suratlar teng bo'lsa, ayirma nol bo'ladi. Keyingi darsda har xil maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// YORDAMCHILAR (infra'da yo'q — shu yerda) + faktlar
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
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ margin: 0 }}>{mt(t(node))}</p> : null; };

const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-harakat (fon-on-all): Stage.stage-content ichida har ekranda.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// FAKT-BLOK — ko'k karta, katta animatsiya + kam matn (to'g'ridan keyin).
const FB_IT   = { ru: 'Знаешь ли ты? · IT',      uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const AnimDrain = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '0', '0', '%'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);
const AnimEgypt = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '/', '2', '+', '1', '/', '4'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.22}s` }}>{ch}</span>
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
// VIZUALIZATOR frac_5_10: LiquidJug — vertikal idish (sharbat/suv). Maxraj = bandlar soni (o'zgarmaydi),
// surat = to'lgan bandlar. Ayirish = yuqoridan ulushlarni quyib yuborish (drain animatsiya).
// FracMinus — a/d − b/d = res/d (yoki 0) formulasi.
// ============================================================
const LiquidJug = ({ den, num, ghost = 0, pour = false, h = 190, tappable = false, onTapBand }) => {
  const bandH = Math.round(h / den);
  const bands = [];
  for (let i = 0; i < den; i++) {                 // i = 0 — pastki band (column-reverse)
    const filled = i < num;
    const isGhost = filled && i >= num - ghost;
    let cls = 'lj-band';
    if (filled) cls += isGhost ? ' lj-ghost' : ' lj-fill';
    if (tappable) cls += ' lj-tap';
    bands.push(<div key={i} className={cls} style={{ height: bandH }} onClick={tappable && onTapBand ? () => onTapBand(i) : undefined}/>);
  }
  return (
    <div className="lj-wrap">
      <div className="lj-jug">
        <span className="lj-spout" aria-hidden="true"/>
        <span className="lj-handle" aria-hidden="true"/>
        <div className="lj-body">
          {bands}
          <span className="lj-shine"/>
          {pour && <span className="lj-drop"/>}
        </div>
      </div>
      <span className="lj-label"><Frac n={String(num)} d={String(den)} size="mid" color={T.accent}/></span>
    </div>
  );
};

// ExprLine — kasr ifodasini BIR XIL o'lchamda chizadi: kasrlar Frac(size) + operatorlar mos o'lchamda.
// mt() kasrlarni doim frac-sm qiladi, atrofdagi belgilar konteyner o'lchamini oladi — shu nomutanosiblikni hal qiladi.
const ExprLine = ({ s, size = 'mid' }) => {
  const str = String(s);
  const out = []; let last = 0; let m; let k = 0;
  const re = /(\d+|\?)\/(\d+)/g;   // lokal regex — render paytida shared obyekt o'zgartirilmaydi
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last, m.index)}</span>);
    out.push(<Frac key={`f${k}`} n={m[1]} d={m[2]} size={size}/>);
    k += 1; last = m.index + m[0].length;
  }
  if (last < str.length) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last)}</span>);
  return <span className={`expr-row expr-row-${size}`}>{out}</span>;
};

const FracMinus = ({ a, b, d, res, showRes = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    <Frac n={String(a)} d={String(d)} size="mid" color={T.accent}/>
    <Op>−</Op>
    <Frac n={String(b)} d={String(d)} size="mid" color={T.blue}/>
    {showRes && <><Op>=</Op>{res === 0 ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>0</span> : <Frac n={String(res)} d={String(d)} size="mid" color={T.success}/>}</>}
  </div>
);

// ============================================================
// DragDropItem — pointer-asosli drag-and-drop (sichqoncha + touch, setPointerCapture orqali).
// Uch metod: dragnum (sonni katakka), dragfrac (kasrni qutiga), dragbin (ifodani savatga).
// Веди-до-верного: noto'g'ri tashlansa chip qaytadi + maslahat; to'g'ri tashlansa onResult(true).
// ============================================================
const DragChip = ({ chip }) => (
  chip.frac ? <Frac n={chip.frac[0]} d={chip.frac[1]} size="mid"/>
    : chip.expr ? <ExprLine s={chip.expr} size="sm"/>
      : <span className="dd-num">{chip.label}</span>
);

const DragDropItem = ({ it, solved, instr, binLabels, onResult }) => {
  const t = useT();
  const [drag, setDrag] = useState(null);       // { id, x, y, sx, sy, moved }
  const [selected, setSelected] = useState(null); // tap-rejimi: tanlangan chip id
  const [landed, setLanded] = useState(null);   // to'g'ri joylangan chip id
  const [badZone, setBadZone] = useState(null);
  const isBin = it.kind === 'dragbin';
  const chips = isBin ? [{ id: 'e0', expr: it.expr, bin: it.bin }] : it.chips;
  const correctChip = isBin ? chips[0] : chips.find(x => x.ok);
  const placedChip = solved ? correctChip : (landed ? chips.find(x => x.id === landed) : null);
  const locked = solved || !!landed;

  // Joylash (drag yoki tap): to'g'ri zona bo'lsa — to'g'ri, aks holda chip qaytadi.
  const resolve = (id, zid) => {
    if (locked || !zid) return;
    const chip = chips.find(x => x.id === id);
    if (!chip) return;
    const ok = isBin ? (zid === chip.bin) : (zid === 'slot' && chip.ok);
    setSelected(null);
    if (ok) { setLanded(id); onResult(true); } else { setBadZone(zid); onResult(false); }
  };
  const start = (e, id) => {
    if (locked) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { void err; }
    setBadZone(null);
    setDrag({ id, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false });
  };
  const move = (e, id) => {
    if (!drag || drag.id !== id) return;
    const moved = drag.moved || Math.abs(e.clientX - drag.sx) > 7 || Math.abs(e.clientY - drag.sy) > 7;
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
  };
  const end = (e, id) => {
    if (!drag || drag.id !== id) return;
    const wasDrag = drag.moved;
    setDrag(null);
    if (wasDrag) {
      let zid = null;
      try { const el = document.elementFromPoint(e.clientX, e.clientY); const z = el && el.closest && el.closest('[data-zone]'); zid = z ? z.getAttribute('data-zone') : null; } catch (err) { void err; }
      if (zid) resolve(id, zid);
    } else {
      setSelected(prev => (prev === id ? null : id));   // tap = tanlash / bekor qilish
    }
  };
  const zoneTap = (zid) => { if (!locked && selected) resolve(selected, zid); };
  const handlers = (id) => ({ onPointerDown: (e) => start(e, id), onPointerMove: (e) => move(e, id), onPointerUp: (e) => end(e, id) });
  const clone = drag && drag.moved ? chips.find(x => x.id === drag.id) : null;
  const armed = selected !== null;

  // ---- BIN: ifodani savatga torting yoki bosing ----
  if (isBin) {
    return (
      <div className="dd-wrap fade-up delay-1">
        <p className="dd-instr">{mt(t(instr))}</p>
        <div className="dd-tray-row">
          {locked
            ? <span className="dd-chip dd-used"><ExprLine s={it.expr} size="sm"/></span>
            : <button className={`dd-chip dd-chip-expr${(drag && drag.moved) ? ' dd-dragging' : ''}${selected === 'e0' ? ' dd-selected' : ''}`} {...handlers('e0')}><ExprLine s={it.expr} size="sm"/></button>}
        </div>
        <div className="sort-bins">
          {binLabels.map(b => (
            <button key={b.key} type="button" data-zone={b.key} onClick={() => zoneTap(b.key)} disabled={locked}
              className={`sort-bin sort-bin-${b.key === 'zero' ? 'sq' : 'cu'}${badZone === b.key ? ' sort-bin-bad' : ''}${(placedChip && it.bin === b.key) ? ' dd-zone-on' : ''}${armed ? ' dd-zone-armed' : ''}`}>
              <span className="sort-bin-h">{mt(t(b.label))}</span>
              {(placedChip && it.bin === b.key) && <span className="sort-chip-in"><ExprLine s={it.expr} size="sm"/></span>}
            </button>
          ))}
        </div>
        {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><ExprLine s={it.expr} size="sm"/></span>}
      </div>
    );
  }

  // ---- SLOT (dragnum) / BOX (dragfrac): tenglama + kataklar ----
  const slotCls = `${it.kind === 'dragnum' ? 'dd-slot' : 'dd-box'}${placedChip ? ' dd-slot-on' : ''}${badZone === 'slot' ? ' dd-bad' : ''}${armed && !placedChip ? ' dd-zone-armed' : ''}`;
  return (
    <div className="dd-wrap fade-up delay-1">
      <p className="dd-instr">{mt(t(instr))}</p>
      <div className="dd-eq">
        <Frac n={String(it.a)} d={String(it.d)} size="mid" color={T.accent}/>
        <span className="expr-op expr-op-mid">−</span>
        <Frac n={String(it.b)} d={String(it.d)} size="mid" color={T.blue}/>
        <span className="expr-op expr-op-mid">=</span>
        {it.kind === 'dragnum' ? (
          <span className="dd-frac">
            <span data-zone="slot" onClick={() => zoneTap('slot')} className={slotCls}>{placedChip ? placedChip.label : '?'}</span>
            <span className="dd-bar"/>
            <span className="dd-den">{it.d}</span>
          </span>
        ) : (
          <span data-zone="slot" onClick={() => zoneTap('slot')} className={slotCls}>{placedChip ? <Frac n={placedChip.frac[0]} d={placedChip.frac[1]} size="mid"/> : '?'}</span>
        )}
      </div>
      <div className="dd-tray-row">
        {chips.map(ch => {
          const used = placedChip && placedChip.id === ch.id;
          return (
            <button key={ch.id} className={`dd-chip${used ? ' dd-used' : ''}${(drag && drag.moved && drag.id === ch.id) ? ' dd-dragging' : ''}${selected === ch.id ? ' dd-selected' : ''}`} disabled={locked} {...handlers(ch.id)}>
              <DragChip chip={ch}/>
            </button>
          );
        })}
      </div>
      {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><DragChip chip={clone}/></span>}
    </div>
  );
};

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (beshta oson savol). Mobil-do'st tap.
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
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <ExprLine s={tx(q.q)} size="big"/>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <ExprLine s={tx(o)} size="mid"/>
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
// SeqMix — ketma-ket HAR XIL TIPLI misollar (input / mc / classify), osondan qiyinga. Mobil-do'st.
// Веди-до-верного: noto'g'ri -> maslahat, to'g'ri -> avtomatik keyingisi. Yig'iladigan qator yo'q (no-scroll).
// ============================================================
const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev, factOnDone }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const lvlNode = { easy: c.lvl_easy, mid: c.lvl_mid, hard: c.lvl_hard };
  const audio = useAudio([{ id: `smix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);         // mc index | 'ok' (drag) | bin key
  const [wrong, setWrong] = useState(() => new Set()); // mc gashen variantlar
  const [hint, setHint] = useState(false);            // drag noto'g'ri maslahati
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];
  const solvedItem = picked !== null;
  // mc-tarmoq uchun render-vaqti qiymatlari (IIFE'siz — refs rule буzilmasligi uchun)
  const mcProb = it.prob ? ((it.probRu && lang === 'ru') ? it.probRu : it.prob) : '';
  const mcIsExpr = /\//.test(mcProb);
  const mcOptSize = it.optSize || 'mid';
  const advanceIntro = () => { if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); } };
  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const wrongVoice = () => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff((it.no && it.no[lang]) || c.audio.on_wrong[lang]); } };
  const markFirst = (ok) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = ok; };
  const finish = (firstTries) => {
    setDone(true);
    if (scored) {
      const itemsCorrect = firstTries.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };
  const correctNow = (firstTries) => {
    sfx.playCorrect();
    advanceRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setPicked(null); setWrong(new Set()); setHint(false); sayItem(ni); }
      else finish(firstTries);
    }, 820);
  };
  const pickMc = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    advanceIntro();
    const ok = i === it.correct; markFirst(ok);
    if (ok) { setPicked(i); correctNow(firstTryRef.current.slice()); }
    else { sfx.playWrong(); setWrong(p => { const s = new Set(p); s.add(i); return s; }); wrongVoice(); }
  };
  // drag-and-drop natijasi: DragDropItem to'g'ri/noto'g'ri tashlashni xabar qiladi (веди-до-верного).
  const dragResult = (ok) => {
    if (done || solvedItem) return;
    advanceIntro();
    markFirst(ok);
    if (ok) { setPicked('ok'); setHint(false); correctNow(firstTryRef.current.slice()); }
    else { sfx.playWrong(); setHint(true); wrongVoice(); }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const showWrong = !solvedItem && (wrong.size > 0 || hint);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <>
            <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: T.success }}><IconOk/></span>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Barcha turdagi misollar yechildi." : 'Все типы примеров решены.'}</p>
            </div>
            {factOnDone}
          </>
        ) : (
          <>
            <span className="smix-tag fade-up">{mt(tx(lvlNode[it.lvl]))}</span>

            {it.kind === 'mc' && (
              <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
                {mcIsExpr ? <ExprLine s={mcProb} size="big"/> : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontWeight: 700 }}>{mt(mcProb)}</p>}
              </div>
            )}
            {it.kind === 'mc' && (
              <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${it.opts.length >= 3 ? 3 : 2}, minmax(0, 1fr))`, gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <ExprLine s={o} size={mcOptSize}/>
                    </button>
                  );
                })}
              </div>
            )}

            {(it.kind === 'dragnum' || it.kind === 'dragfrac' || it.kind === 'dragbin') && (
              <DragDropItem key={idx} it={it} solved={solvedItem}
                instr={it.kind === 'dragbin' ? c.bin_ask : (it.kind === 'dragfrac' ? c.drag_frac : c.drag_num)}
                binLabels={[{ key: 'zero', label: c.bin_zero }, { key: 'pos', label: c.bin_pos }]}
                onResult={dragResult}/>
            )}

            <FeedbackBlock show={solvedItem || showWrong} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? <IconOk/> : <IconNo/>}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
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
// SCREEN-KOMPONENTLAR (fon — Stage.has-amb orqali har ekranda)
// ============================================================

// s0 — HOOK. Qaytishda picked TO'LIQ sbros.
const ScreenHook = ({ screen, onAnswer, onNext, onPrev }) => {
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px)', display: 'flex', justifyContent: 'center' }}>
          <LiquidJug den={8} num={7} pour h={190}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ margin: 0, color: T.ink2 }}>{mt(t(reveals[picked]))}</p>}
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION (step): idishdan ulush quyiladi.
const ScreenStep = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  const jugNum = step >= 2 ? 3 : 5;
  const jugGhost = step === 1 ? 2 : 0;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <LiquidJug den={6} num={jugNum} ghost={jugGhost} h={190}/>
          {step >= 1 && step < 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(step === 1 ? c.cap1 : c.cap2))}</p>}
          {step >= 3 && <FracMinus a={5} b={2} d={6} res={3}/>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION (jonli slider): o'quvchi o'zi quyadi.
const ScreenSlider = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [removed, setRemoved] = useState(0);
  const remaining = 7 - removed;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 230 }}>
          <LiquidJug den={8} num={remaining} h={190}/>
          <FracMinus a={7} b={removed} d={8} res={remaining}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {removed}</p>
          <Slider value={removed} min={0} max={7} onChange={setRemoved}/>
        </div>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.note))}</p></div>
      </div>
    </Stage>
  );
};

// s3 — RULE.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <FracMinus a={5} b={2} d={6} res={3}/>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p className="body" style={{ margin: 0, marginBottom: 4 }}>{mt(t(c.card_top))}</p>
            <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.card_bottom))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s4 — beshta oson savol.
const ScreenEasy = (props) => <SeqMC {...props} screenContent={CONTENT.s4} scored={true}/>;

// s5 — RULE (maxsus holat: nol).
const ScreenZero = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, fontWeight: 600 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <LiquidJug den={7} num={0} h={190}/>
          <FracMinus a={3} b={3} d={7} res={0}/>
        </div>
        <div className="frame-tip fade-up delay-2"><p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — olti-sakkiz misol, har xil tip.
const ScreenMix = (props) => <SeqMix {...props} screenContent={CONTENT.s6} scored={true} factOnDone={<FactCard text={CONTENT.s6.fact} badge={FB_IT} anim={<AnimDrain/>}/>}/>;

// s7 — CASE interaktiv: Rustam, idishdan rosa 4 ulush oling (tap).
const ScreenCaseDo = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7; const sfx = useSfx();
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [remaining, setRemaining] = useState(wasSolved ? 5 : 9);
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const removed = 9 - remaining;
  const tapBand = (i) => { if (solved) return; setHint(false); setRemaining(i < remaining ? i : i + 1); };
  const check = () => {
    if (solved) return;
    const ok = removed === 4;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: '5/10', studentAnswer: `${remaining}/10`, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setHint(true); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 230 }}>
          <LiquidJug den={10} num={remaining} h={210} tappable={!solved} onTapBand={tapBand}/>
          <FracMinus a={9} b={removed} d={10} res={remaining} showRes={solved}/>
        </div>
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
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

// s8 — CASE yakuniy (QuestionScreen, final).
const ScreenCaseFinal = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}
    figure={() => <LiquidJug den={10} num={9} h={150}/>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimEgypt/>}/>}/>;
};

// s9 — SUMMARY (kanonik: ball qatori + ulanishlar bloki, top-anchor).
const ScreenSummary = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const scoredTotal = SCREEN_META.filter(s => s.scored).length;
  const correctCount = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame-success fade-up delay-1" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="display" style={{ fontSize: 'clamp(26px, 6vw, 38px)', color: T.success }}>{correctCount} / {scoredTotal}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2"><p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

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

  const screens = [ScreenHook, ScreenStep, ScreenSlider, ScreenRule, ScreenEasy, ScreenZero, ScreenMix, ScreenCaseDo, ScreenCaseFinal, ScreenSummary];
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

/* === fon-on-all: Stage.stage-content ichida ambient (Floaters) — har ekranda harakatli fon === */
.has-amb { position: relative; }
.has-amb > :not(.amb) { position: relative; z-index: 1; }

/* === MATH frac_5_10: LiquidJug — KUVSHIN (jo'mrak + dasta + qorin). Maxraj = ulush bandlari; ayirish = ulushlarni quyib yuborish. === */
.lj-wrap { display: inline-flex; flex-direction: column; align-items: center; gap: 10px; }
.lj-jug { position: relative; display: inline-block; padding: 0 clamp(17px, 4.4vw, 23px); }
.lj-body { position: relative; width: clamp(66px, 16vw, 92px); display: flex; flex-direction: column-reverse; background: #FFFFFF; border-radius: 9px 9px 30px 30px; box-shadow: inset 0 0 0 2.5px rgba(58, 53, 48, 0.22), 0 14px 30px -13px rgba(58, 53, 48, 0.34); overflow: hidden; }
.lj-band { border-top: 2px solid #F6F4EF; transition: background-color 0.5s cubic-bezier(0.33, 0, 0.2, 1); background: transparent; }
.lj-band:first-child { border-top: none; }
.lj-fill { background: linear-gradient(180deg, #FF7A5C, #FF4F28); }
.lj-ghost { background: linear-gradient(180deg, #FFB6A4, #FF8C72); animation: ljDrain 0.95s ease forwards; }
.lj-tap { cursor: pointer; }
.lj-tap.lj-fill:hover { filter: brightness(1.06); }
.lj-shine { position: absolute; left: 10%; top: 7%; width: 20%; height: 56%; border-radius: 44%; background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), transparent); pointer-events: none; }
/* jo'mrak — chap-yuqorida quyish uchun uchburchak lab */
.lj-spout { position: absolute; left: clamp(2px, 1vw, 5px); top: clamp(7px, 1.8vw, 11px); width: 0; height: 0; border-top: clamp(7px, 1.8vw, 10px) solid transparent; border-bottom: clamp(7px, 1.8vw, 10px) solid transparent; border-right: clamp(12px, 3vw, 16px) solid #FFFFFF; filter: drop-shadow(-2.5px 0 0 rgba(58, 53, 48, 0.26)); z-index: 2; }
/* dasta — o'ng tomonda C shaklida */
.lj-handle { position: absolute; right: clamp(0px, 0.6vw, 3px); top: 25%; width: clamp(15px, 3.8vw, 21px); height: 44%; border: clamp(5px, 1.4vw, 7px) solid rgba(58, 53, 48, 0.34); border-left: none; border-radius: 0 15px 15px 0; }
.lj-drop { position: absolute; left: clamp(2px, 1vw, 6px); top: clamp(8px, 2vw, 13px); width: 8px; height: 11px; border-radius: 0 50% 50% 50%; background: #FF4F28; animation: ljDrop 1.7s ease-in infinite; pointer-events: none; z-index: 3; }
.lj-label { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(19px, 3.6vw, 25px); color: #FF4F28; line-height: 1; }
@keyframes ljDrain { 0% { opacity: 1; transform: translateY(0); } 60% { opacity: 0.3; } 100% { opacity: 0; transform: translateY(8px); } }
@keyframes ljDrop { 0% { transform: translate(0, 0) rotate(45deg); opacity: 0; } 18% { opacity: 1; } 82% { opacity: 0.9; } 100% { transform: translate(-7px, 54px) rotate(45deg); opacity: 0; } }

/* ExprLine — kasr ifodasini BIR XIL o'lchamda: kasr (Frac) + operator mos kelishi uchun. */
.frac-big { font-size: clamp(30px, 6vw, 44px); }
.expr-row { display: inline-flex; align-items: center; flex-wrap: wrap; justify-content: center; }
.expr-row-big { gap: clamp(5px, 1.4vw, 11px); }
.expr-row-mid { gap: clamp(4px, 1.1vw, 8px); }
.expr-row-sm { gap: clamp(2px, 0.7vw, 5px); }
.expr-op { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0E0E10; white-space: pre; }
.expr-op-big { font-size: clamp(26px, 5.5vw, 38px); }
.expr-op-mid { font-size: clamp(19px, 3.6vw, 26px); }
.expr-op-sm { font-size: clamp(14px, 2vw, 17px); }
.smix-tag { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: #019ACB; }

/* Drag-and-drop (DragDropItem): pointer-asosli, touch ham ishlaydi (touch-action: none). */
.dd-wrap { display: flex; flex-direction: column; align-items: center; gap: clamp(14px, 2.6vw, 20px); }
.dd-instr { margin: 0; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #019ACB; }
.dd-eq { display: inline-flex; align-items: center; gap: clamp(6px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }
.dd-frac { display: inline-flex; flex-direction: column; align-items: center; }
.dd-slot { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(44px, 10vw, 58px); height: clamp(44px, 10vw, 58px); border-radius: 12px; border: 2px dashed #FF4F28; background: #FFFFFF; font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 38px); color: #A7A6A2; line-height: 1; transition: all 0.3s ease; }
.dd-slot-on { border-style: solid; border-color: #1F7A4D; color: #1F7A4D; background: #E3F0E8; }
.dd-bar { width: clamp(52px, 13vw, 72px); height: 3px; background: #0E0E10; border-radius: 2px; margin: clamp(5px, 1.3vw, 8px) 0; }
.dd-den { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 38px); color: #0E0E10; line-height: 1; }
.dd-box { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(66px, 17vw, 96px); height: clamp(54px, 12vw, 74px); border-radius: 12px; border: 2px dashed #FF4F28; background: #FFFFFF; font-family: 'Fraunces', serif; font-size: clamp(26px, 5vw, 34px); color: #A7A6A2; transition: all 0.3s ease; }
.dd-bad { border-color: #FF4F28 !important; animation: odShake 0.4s ease; }
.dd-tray-row { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.4vw, 16px); justify-content: center; }
.dd-chip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(52px, 12vw, 66px); min-height: clamp(52px, 12vw, 66px); padding: 0 clamp(10px, 2vw, 14px); border: none; border-radius: 14px; background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.28), inset 0 0 0 2px rgba(255, 79, 40, 0.25); cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; transition: box-shadow 0.2s ease, opacity 0.2s ease; }
.dd-chip:hover:not(:disabled) { box-shadow: 0 10px 24px -8px rgba(255, 79, 40, 0.4), inset 0 0 0 2px rgba(255, 79, 40, 0.5); }
.dd-chip:active { cursor: grabbing; }
.dd-chip:disabled { cursor: default; }
.dd-chip-expr { min-width: clamp(120px, 34vw, 180px); }
.dd-num { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 36px); color: #FF4F28; line-height: 1; }
.dd-dragging { opacity: 0.28; }
.dd-used { opacity: 0.45; box-shadow: inset 0 0 0 2px rgba(31, 122, 77, 0.4); }
.dd-zone-on { box-shadow: 0 0 0 2px #1F7A4D inset; }
.dd-selected { box-shadow: 0 0 0 3px #FF4F28 inset, 0 11px 24px -8px rgba(255, 79, 40, 0.5) !important; transform: translateY(-2px); }
.dd-zone-armed { cursor: pointer; animation: ddPulse 1.2s ease-in-out infinite; }
@keyframes ddPulse { 0%, 100% { box-shadow: 0 0 0 2px rgba(255, 79, 40, 0.45) inset; } 50% { box-shadow: 0 0 0 3px rgba(255, 79, 40, 0.85) inset; } }
.dd-clone { position: fixed; z-index: 2000; transform: translate(-50%, -50%); pointer-events: none; display: inline-flex; align-items: center; justify-content: center; min-width: clamp(52px, 12vw, 66px); min-height: clamp(52px, 12vw, 66px); padding: 0 clamp(10px, 2vw, 14px); border-radius: 14px; background: #FFFFFF; box-shadow: 0 14px 30px -8px rgba(58, 53, 48, 0.5), inset 0 0 0 2px rgba(255, 79, 40, 0.6); }

@media (prefers-reduced-motion: reduce) {
  .lj-ghost, .lj-drop { animation: none; }
  .lj-ghost { opacity: 0; }
  .dd-bad, .dd-zone-armed { animation: none; }
}

`;
