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
  const g = 'm'; // v5.5-male: erkak ovoz qattiq qulflangan
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
  setGender(g) { this.gender = 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет

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
// --- UROK: nat_5_01 — Огромные числа вокруг нас / Atrofimizdagi katta sonlar ---
// Infra Dars28 (baytma-bayt: T/AudioEngine/useAudio/Stage/FeedbackBlock/QuestionScreen/mt/...).
// Keep-visible standart (PROMPT 2-B/2-C). Vizualizatorlar nat_5_01 ga xos.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'nat_5_01',
  lessonTitle: { ru: 'Огромные числа вокруг нас', uz: 'Atrofimizdagi katta sonlar' }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',           scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen',   scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',           scored: false, scope: null },       // 2 (GroupingReveal)
  { id: 's3',  type: 'rule',        template: 'custom',           scored: false, scope: null },       // 3
  { id: 's4',  type: 'test',        template: 'SpacesInteractive',scored: true,  scope: 'practice' }, // 4
  { id: 's5',  type: 'exploration', template: 'custom',           scored: false, scope: null },       // 5 (3 ranks + fakt)
  { id: 's6',  type: 'rule',        template: 'custom',           scored: false, scope: null },       // 6
  { id: 's7',  type: 'test',        template: 'OddOneOut',        scored: true,  scope: 'practice' }, // 7
  { id: 's8',  type: 'exploration', template: 'custom',           scored: false, scope: null },       // 8 (ZeroMorph merged rule)
  { id: 's9',  type: 'test',        template: 'InputScreen',      scored: true,  scope: 'practice' }, // 9 (1392000 + fakt)
  { id: 's10', type: 'exploration', template: 'custom',           scored: false, scope: null },       // 10 (light speed + fakt)
  { id: 's11', type: 'test',        template: 'DragMatch',        scored: true,  scope: 'practice' }, // 11
  { id: 's12', type: 'test',        template: 'Classify',         scored: true,  scope: 'practice' }, // 12
  { id: 's13', type: 'test',        template: 'InputScreen',      scored: true,  scope: 'final' },    // 13 (149600000 + fakt)
  { id: 's14', type: 'summary',     template: 'custom',           scored: false, scope: null }        // 14
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Вопрос урока', uz: 'Dars savoli' },
    global_q: { ru: 'Как прочитать огромные числа вокруг нас?', uz: "Atrofimizdagi katta sonlarni qanday o'qiymiz?" },
    lead: { ru: 'Земля движется вокруг Солнца. Расстояние до него — вот столько километров:', uz: "Yer Quyosh atrofida aylanadi. Ungacha masofa — mana shuncha kilometr:" },
    number_em: { ru: '149 600 000', uz: '149 600 000' },
    question: { ru: 'Сможешь прочитать это число?', uz: "Bu sonni o'qiy olasizmi?" },
    opt_yes: { ru: 'Прочту легко', uz: "Bemalol o'qiyman" },
    opt_no: { ru: 'Пока трудно', uz: 'Hozircha qiyin' },
    opt_idk: { ru: 'Хочу научиться', uz: "O'rganmoqchiman" },
    audio: {
      intro: { ru: 'Земля движется вокруг Солнца, и расстояние до него сто сорок девять миллионов шестьсот тысяч километров. Прочитать такое число с ходу трудно. Главный вопрос урока: как прочитать и представить себе огромные числа вокруг нас? Сможешь прочитать это число?', uz: "Yer Quyosh atrofida aylanadi, va ungacha masofa bir yuz qirq to'qqiz million olti yuz ming kilometr. Bunday sonni darrov o'qish qiyin. Darsning asosiy savoli: atrofimizdagi katta sonlarni qanday o'qish va tasavvur qilamiz? Bu sonni o'qiy olasizmi?" },
      on_correct: { ru: 'Тогда начнём.', uz: 'Unda boshlaymiz.' },
      on_wrong: { ru: 'Тогда начнём.', uz: 'Unda boshlaymiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz' },
    bridge: { ru: 'Сначала вспомним разряды из начальной школы.', uz: "Avval boshlang'ich sinfdagi xonalarni eslaymiz." },
    question: { ru: 'В числе 2 658 цифра 6 стоит в разряде…', uz: '2 658 sonida 6 raqami qaysi xonada turibdi…' },
    opt0: { ru: 'единиц', uz: 'birlar' },
    opt1: { ru: 'десятков', uz: "o'nlar" },
    opt2: { ru: 'сотен', uz: 'yuzlar' },
    opt3: { ru: 'тысяч', uz: 'minglar' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. 2 658 — это 2 тысячи, 6 сотен, 5 десятков, 8 единиц. Разряд показывает, сколько стоит цифра.', uz: "To'g'ri. 2 658 — bu 2 mingta, 6 yuzta, 5 o'nta, 8 birta. Xona raqamning qiymatini ko'rsatadi." },
    wrong_0: { ru: 'Единицы — самый правый разряд, там стоит восьмёрка. Считай разряды справа налево.', uz: "Birlar — eng o'ngdagi xona, u yerda sakkiz turibdi. Xonalarni o'ngdan chapga sanang." },
    wrong_1: { ru: 'В десятках стоит пятёрка. Шестёрка — на разряд левее десятков.', uz: "O'nlar xonasida besh turibdi. Olti undan bitta chap tomonda." },
    wrong_3: { ru: 'В тысячах стоит двойка. Шестёрка — на разряд правее тысяч.', uz: "Minglar xonasida ikki turibdi. Olti undan bitta o'ng tomonda." },
    audio: {
      intro: { ru: 'Короткий разогрев. В числе две тысячи шестьсот пятьдесят восемь в каком разряде стоит цифра шесть? Выбери ответ.', uz: "Qisqa mashq. Ikki ming olti yuz ellik sakkiz sonida olti raqami qaysi xonada turibdi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Скоро эти разряды соберутся в классы.', uz: "To'g'ri. Tez orada bu xonalar sinflarga yig'iladi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'Это число длинное. Разобьём его на части.', uz: "Bu son uzun. Uni qismlarga ajratamiz." },
    title: { ru: 'Разбиваем число на классы', uz: 'Sonni sinflarga ajratamiz' },
    number_grouped: { ru: '149 600 000', uz: '149 600 000' },
    audio: {
      ru: [
        'Чтобы прочитать число, поставим пробелы через каждые три цифры, считая справа. Первая группа справа это класс единиц.',
        'Следующая группа это класс тысяч.',
        'А слева стоит класс миллионов. Теперь число читается по группам, а не по одной цифре.'
      ],
      uz: [
        "Sonni o'qish uchun o'ngdan boshlab har uch xonadan keyin bo'sh joy qo'yamiz. O'ngdagi birinchi guruh bu birlar sinfi.",
        "Keyingi guruh bu minglar sinfi.",
        "Chapda esa millionlar sinfi turadi. Endi son bittalab emas, guruhlar bo'yicha o'qiladi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Класс', uz: 'Sinf' },
    rule_1: { ru: 'Многозначное число делят на классы по три разряда, считая справа налево.', uz: "Ko'p xonali son o'ngdan chapga uch xonadan sinflarga ajratiladi." },
    rule_2: { ru: 'Каждый класс — это группа из трёх цифр. Между классами ставят пробел.', uz: "Har bir sinf — uchta raqamdan iborat guruh. Sinflar orasiga bo'sh joy qo'yiladi." },
    example: { ru: '149 600 000  →  149 | 600 | 000', uz: '149 600 000  →  149 | 600 | 000' },
    audio: { ru: 'Запомним правило. Многозначное число делят на классы по три разряда, считая справа налево. Каждый класс это группа из трёх цифр, и между классами ставят пробел.', uz: "Qoidani eslab qolamiz. Ko'p xonali son o'ngdan chapga uch xonadan sinflarga ajratiladi. Har bir sinf uchta raqamdan iborat guruh, va sinflar orasiga bo'sh joy qo'yiladi." }
  },

  s4: {
    eyebrow: { ru: 'Тренировка · 1 из 6', uz: 'Mashq · 6 dan 1' },
    bridge: { ru: 'Расстояние до Луны записано без пробелов. Раздели его на классы.', uz: "Oygacha masofa bo'shliqsiz yozilgan. Uni sinflarga ajrating." },
    label: { ru: 'Расставь пробелы', uz: "Bo'shliqlarni qo'ying" },
    context: { ru: 'Расстояние от Земли до Луны, км.', uz: 'Yerdan Oygacha masofa, km.' },
    raw: '384400',
    correct: '384 400',
    hint: { ru: 'Отсчитай три цифры справа и поставь пробел перед ними.', uz: "O'ngdan uchta xonani sanang va ulardan oldin bo'sh joy qo'ying." },
    fb_correct: { ru: 'Верно. Пробел через три цифры справа: 384 400. Это триста восемьдесят четыре тысячи четыреста.', uz: "To'g'ri. Bo'sh joy o'ngdan uch xonadan keyin: 384 400. Bu uch yuz sakson to'rt ming to'rt yuz." },
    fb_wrong: { ru: 'Считай три цифры справа и ставь пробел только там. Так число делится на класс тысяч и класс единиц.', uz: "O'ngdan uchta xonani sanang va faqat o'sha yerga bo'sh joy qo'ying. Shunda son minglar sinfi va birlar sinfiga bo'linadi." },
    audio: {
      intro: { ru: 'Расстояние до Луны записано без пробелов. Поставь пробел так, чтобы число делилось на классы. Потом нажми кнопку проверить.', uz: "Oygacha masofa bo'shliqsiz yozilgan. Son sinflarga bo'linishi uchun bo'sh joy qo'ying. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Через три цифры справа число разделилось на классы. Читается оно как триста восемьдесят четыре тысячи четыреста.', uz: "To'g'ri. O'ngdan uch xonadan keyin son sinflarga bo'lindi. U uch yuz sakson to'rt ming to'rt yuz deb o'qiladi." },
      on_wrong: { ru: 'Пока не так. Считай три цифры справа.', uz: "Hali emas. O'ngdan uchta xonani sanang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'Заглянем внутрь одного класса.', uz: "Bitta sinfning ichiga qaraymiz." },
    title: { ru: 'Три разряда в каждом классе', uz: 'Har bir sinfda uchta xona' },
    fact: { ru: 'Слово «миллион» появилось около 700 лет назад — раньше таких больших чисел почти не считали.', uz: "«Million» so'zi taxminan 700 yil avval paydo bo'lgan — ilgari bunday katta sonlarni deyarli sanashmagan." },
    fact_audio: { ru: 'Интересно: слово миллион появилось лишь около семисот лет назад. Раньше людям почти не приходилось считать такие большие количества.', uz: "Qiziq: million so'zi atigi yetti yuz yilcha avval paydo bo'lgan. Ilgari odamlarga bunday katta miqdorlarni sanash deyarli kerak bo'lmagan." },
    audio: {
      ru: [
        'В каждом классе всегда три разряда, и считаем их справа налево. Самый правый разряд это единицы.',
        'Слева от единиц стоит разряд десятков.',
        'Ещё левее разряд сотен. Эти три разряда повторяются в каждом классе, поэтому любое число читается по одному правилу.'
      ],
      uz: [
        "Har bir sinfda doimo uchta xona bor, va ularni o'ngdan chapga sanaymiz. Eng o'ngdagi xona bu birlar.",
        "Birlardan chapda o'nlar xonasi turadi.",
        "Undan ham chapda yuzlar xonasi. Bu uchta xona har bir sinfda takrorlanadi, shuning uchun har qanday son bitta qoida bilan o'qiladi."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Как читать число', uz: "Sonni qanday o'qiymiz" },
    rule_1: { ru: 'Читаем слева направо: называем число в каждом классе и добавляем название класса.', uz: "Chapdan o'ngga o'qiymiz: har bir sinfdagi sonni aytamiz va sinf nomini qo'shamiz." },
    rule_2: { ru: 'Класс единиц название не получает — его просто называют.', uz: "Birlar sinfining nomi aytilmaydi — uni shunchaki aytamiz." },
    example: { ru: '384 400  →  триста восемьдесят четыре тысячи четыреста', uz: "384 400  →  uch yuz sakson to'rt ming to'rt yuz" },
    audio: { ru: 'Правило чтения. Идём слева направо, называем число в каждом классе и добавляем название класса. Класс единиц название не получает, его просто называют. Например, число на экране читается как триста восемьдесят четыре тысячи четыреста.', uz: "O'qish qoidasi. Chapdan o'ngga boramiz, har bir sinfdagi sonni aytamiz va sinf nomini qo'shamiz. Birlar sinfining nomi aytilmaydi, uni shunchaki aytamiz. Masalan, ekrandagi son uch yuz sakson to'rt ming to'rt yuz deb o'qiladi." }
  },

  s7: {
    eyebrow: { ru: 'Тренировка · 2 из 6', uz: 'Mashq · 6 dan 2' },
    bridge: { ru: 'Три числа прочитаны верно, одно — с ошибкой. Найди ошибку.', uz: "Uch son to'g'ri o'qilgan, bittasi — xato. Xatoni toping." },
    question: { ru: 'В каком числе чтение ошибочно?', uz: "Qaysi sonda o'qish xato?" },
    lead: { ru: 'Сравни число и его чтение. Тапни ошибочное.', uz: "Sonni va uning o'qilishini solishtiring. Xato bo'lganini bosing." },
    errorIdx: 1,
    items: [
      { num: '5 000', reading: { ru: 'пять тысяч', uz: 'besh ming' } },
      { num: '384 400', reading: { ru: 'триста восемьдесят четыре тысячи сорок', uz: "uch yuz sakson to'rt ming qirq" } },
      { num: '60 200', reading: { ru: 'шестьдесят тысяч двести', uz: 'oltmish ming ikki yuz' } },
      { num: '1 392 000', reading: { ru: 'один миллион триста девяносто две тысячи', uz: "bir million uch yuz to'qson ikki ming" } }
    ],
    correct_text: { ru: 'Верно. В 384 400 класс единиц это 400 — четыреста, а не сорок. Потерян ноль: правильно триста восемьдесят четыре тысячи четыреста.', uz: "To'g'ri. 384 400 da birlar sinfi 400 — to'rt yuz, qirq emas. Nol yo'qolgan: to'g'risi uch yuz sakson to'rt ming to'rt yuz." },
    wrong_0: { ru: 'Пять тысяч прочитано верно: в классе тысяч пятёрка, класс единиц пустой. Ищи число, где потеряли ноль.', uz: "Besh ming to'g'ri o'qilgan: minglar sinfida besh, birlar sinfi bo'sh. Nol yo'qolgan sonni qidiring." },
    wrong_2: { ru: 'Шестьдесят тысяч двести прочитано верно. Ищи, где в классе единиц вместо сотен назвали десятки.', uz: "Oltmish ming ikki yuz to'g'ri o'qilgan. Birlar sinfida yuzlar o'rniga o'nlar aytilgan sonni qidiring." },
    wrong_3: { ru: 'Один миллион триста девяносто две тысячи прочитано верно. Ошибка в другом числе.', uz: "Bir million uch yuz to'qson ikki ming to'g'ri o'qilgan. Xato boshqa sonda." },
    audio: {
      intro: { ru: 'Три числа прочитаны верно, а в одном чтение ошибочно. Найди число с ошибкой и тапни его.', uz: "Uch son to'g'ri o'qilgan, bittasida o'qish xato. Xato sonni toping va uni bosing." },
      on_correct: { ru: 'Верно. Ноль в классе единиц нельзя терять. Правильно это число читается как триста восемьдесят четыре тысячи четыреста.', uz: "To'g'ri. Birlar sinfidagi nolni yo'qotib bo'lmaydi. To'g'risi bu son uch yuz sakson to'rt ming to'rt yuz deb o'qiladi." },
      on_wrong: { ru: 'Это число прочитано правильно. Ищи потерянный ноль.', uz: "Bu son to'g'ri o'qilgan. Yo'qolgan nolni qidiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'Вернёмся к числу Солнца и проверим, что делает ноль.', uz: "Quyosh soniga qaytamiz va nol nima qilishini tekshiramiz." },
    title: { ru: 'Ноль держит разряд', uz: 'Nol xonani ushlaydi' },
    number_a: { ru: '149 600 000', uz: '149 600 000' },
    number_b: { ru: '14 960 000', uz: '14 960 000' },
    warn: { ru: 'Если разряд пустой, в нём пишут ноль. Выбросить такой ноль нельзя — иначе цифры сдвинутся и число станет в разы меньше.', uz: "Agar xona bo'sh bo'lsa, unga nol yoziladi. Bunday nolni tashlab bo'lmaydi — aks holda raqamlar suriladi va son necha barobar kichik bo'lib qoladi." },
    audio: {
      ru: [
        'В числе Солнца много нулей, и они держат разряды. Уберём всего один ноль.',
        'Все цифры сдвинулись вправо, и получилось четырнадцать миллионов девятьсот шестьдесят тысяч — в десять раз меньше.',
        'Запомним. Если разряд пустой, в нём пишут ноль. Такой ноль выбрасывать нельзя, иначе остальные цифры сдвинутся и число станет другим.'
      ],
      uz: [
        "Quyosh sonida nollar ko'p, va ular xonalarni ushlab turadi. Atigi bitta nolni olib tashlaymiz.",
        "Barcha raqamlar o'ngga surildi va o'n to'rt million to'qqiz yuz oltmish ming hosil bo'ldi — o'n barobar kichik.",
        "Eslab qolamiz. Agar xona bo'sh bo'lsa, unga nol yoziladi. Bunday nolni tashlab bo'lmaydi, aks holda qolgan raqamlar suriladi va son boshqacha bo'lib qoladi."
      ]
    }
  },

  s9: {
    eyebrow: { ru: 'Тренировка · 3 из 6', uz: 'Mashq · 6 dan 3' },
    bridge: { ru: 'Теперь запиши число цифрами, не теряя нули.', uz: "Endi sonni raqamlar bilan yozing, nollarni yo'qotmay." },
    label: { ru: 'Запиши цифрами', uz: 'Raqamlar bilan yozing' },
    context: { ru: 'Диаметр Солнца, км.', uz: 'Quyosh diametri, km.' },
    question: { ru: 'Запиши цифрами: один миллион триста девяносто две тысячи.', uz: "Raqamlar bilan yozing: bir million uch yuz to'qson ikki ming." },
    placeholder: { ru: '0', uz: '0' },
    answer: '1392000',
    hint: { ru: 'Класс единиц здесь пустой — держи его тремя нулями.', uz: "Bu yerda birlar sinfi bo'sh — uni uchta nol bilan ushlang." },
    fb_correct: { ru: 'Правильно. Миллионы — 1, тысячи — 392, класс единиц пуст и держится нулями: 1 392 000.', uz: "To'g'ri. Millionlar — 1, minglar — 392, birlar sinfi bo'sh va nollar bilan ushlanadi: 1 392 000." },
    fb_wrong: { ru: 'Проверь класс единиц. Он пустой, держи его тремя нулями: миллион, потом триста девяносто две тысячи, потом три нуля.', uz: "Birlar sinfini tekshiring. U bo'sh, uni uchta nol bilan ushlang: million, keyin uch yuz to'qson ikki ming, keyin uchta nol." },
    fact: { ru: 'В нашей галактике около 100 000 000 000 звёзд — их не сосчитать поштучно.', uz: "Bizning galaktikamizda taxminan 100 000 000 000 yulduz bor — ularni bittalab sanab bo'lmaydi." },
    fact_audio: { ru: 'Кстати, в нашей галактике около ста миллиардов звёзд. Столько по одной не сосчитать за всю жизнь.', uz: "Aytgancha, bizning galaktikamizda yuz milliardga yaqin yulduz bor. Bunchani bittalab butun umr sanab bo'lmaydi." },
    audio: {
      intro: { ru: 'Запиши цифрами число один миллион триста девяносто две тысячи. Потом нажми кнопку проверить.', uz: "Bir million uch yuz to'qson ikki ming sonini raqamlar bilan yozing. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Класс единиц пустой и держится тремя нулями.', uz: "To'g'ri. Birlar sinfi bo'sh va uchta nol bilan ushlanadi." },
      on_wrong: { ru: 'Проверь нули в пустом классе.', uz: "Bo'sh sinfdagi nollarni tekshiring." }
    }
  },

  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    bridge: { ru: 'А вот число без единого нуля.', uz: "Mana birorta ham nolsiz son." },
    title: { ru: 'Самое плотное число', uz: 'Eng zich son' },
    number_grouped: { ru: '299 792 458', uz: '299 792 458' },
    fact: { ru: 'Свет от Солнца долетает до Земли примерно за 8 минут, проходя эти 149 600 000 км.', uz: "Quyoshdan yorug'lik Yergacha taxminan 8 daqiqada yetib keladi, shu 149 600 000 km ni bosib o'tib." },
    fact_audio: { ru: 'Интересно: свет от Солнца долетает до Земли примерно за восемь минут. За это время он проходит сто сорок девять миллионов шестьсот тысяч километров.', uz: "Qiziq: Quyoshdan yorug'lik Yergacha taxminan sakkiz daqiqada yetib keladi. Shu vaqtda u bir yuz qirq to'qqiz million olti yuz ming kilometrni bosib o'tadi." },
    audio: {
      ru: [
        'Скорость света очень плотное число, в нём нет ни одного нуля. В классе миллионов двести девяносто девять.',
        'В классе тысяч семьсот девяносто два.',
        'В классе единиц четыреста пятьдесят восемь. Читаем слева направо и получаем всё число.'
      ],
      uz: [
        "Yorug'lik tezligi juda zich son, unda birorta ham nol yo'q. Millionlar sinfida ikki yuz to'qson to'qqiz.",
        "Minglar sinfida yetti yuz to'qson ikki.",
        "Birlar sinfida to'rt yuz ellik sakkiz. Chapdan o'ngga o'qib, butun sonni olamiz."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Тренировка · 4 из 6', uz: 'Mashq · 6 dan 4' },
    bridge: { ru: 'Собери числа урока с их чтением.', uz: "Darsdagi sonlarni o'qilishi bilan moslang." },
    title: { ru: 'Сопоставь число и чтение', uz: "Sonni o'qilishi bilan mosla" },
    lead: { ru: 'Тапни число, потом выбери его чтение.', uz: "Songa bosing, keyin o'qilishini tanlang." },
    pairs: [
      { number: '384 400', label: { ru: 'Луна, км', uz: 'Oy, km' }, reading: { ru: 'триста восемьдесят четыре тысячи четыреста', uz: "uch yuz sakson to'rt ming to'rt yuz" } },
      { number: '1 392 000', label: { ru: 'диаметр Солнца', uz: 'Quyosh diametri' }, reading: { ru: 'один миллион триста девяносто две тысячи', uz: "bir million uch yuz to'qson ikki ming" } },
      { number: '299 792 458', label: { ru: 'скорость света', uz: "yorug'lik tezligi" }, reading: { ru: 'двести девяносто девять миллионов семьсот девяносто две тысячи четыреста пятьдесят восемь', uz: "ikki yuz to'qson to'qqiz million yetti yuz to'qson ikki ming to'rt yuz ellik sakkiz" } }
    ],
    hint: { ru: 'Раздели число на классы по три справа и читай по классам слева направо.', uz: "Sonni o'ngdan uch xonadan sinflarga ajrating va chapdan o'ngga sinflar bo'yicha o'qing." },
    correct_text: { ru: 'Верно. Все числа прочитаны по классам.', uz: "To'g'ri. Barcha sonlar sinflar bo'yicha o'qildi." },
    audio: {
      intro: { ru: 'Сопоставь каждое число с тем, как оно читается. Тапни число, потом выбери чтение.', uz: "Har bir sonni qanday o'qilishi bilan mosla. Songa bosing, keyin o'qilishini tanlang." },
      on_correct: { ru: 'Верно, все числа сопоставлены по классам.', uz: "To'g'ri, barcha sonlar sinflar bo'yicha moslandi." },
      on_wrong: { ru: 'Это не то чтение. Раздели число на классы.', uz: "Bu o'qilishi mos emas. Sonni sinflarga ajrating." }
    }
  },

  s12: {
    eyebrow: { ru: 'Тренировка · 5 из 6', uz: 'Mashq · 6 dan 5' },
    bridge: { ru: 'Разложи числа по самому старшему классу.', uz: "Sonlarni eng yuqori sinfi bo'yicha ajrating." },
    title: { ru: 'До какого класса доходит число?', uz: 'Son qaysi sinfgacha yetadi?' },
    lead: { ru: 'Число появляется по одному. Тапни корзину, куда оно попадает.', uz: "Son bittalab chiqadi. U tushadigan savatni bosing." },
    bin_th: { ru: 'До класса тысяч', uz: 'Minglar sinfigacha' },
    bin_mln: { ru: 'До класса миллионов', uz: 'Millionlar sinfigacha' },
    cards: [
      { label: '7 500', bin: 'th' },
      { label: '384 400', bin: 'th' },
      { label: '60 200', bin: 'th' },
      { label: '1 392 000', bin: 'mln' },
      { label: '149 600 000', bin: 'mln' },
      { label: '299 792 458', bin: 'mln' }
    ],
    hint: { ru: 'Раздели на классы и посмотри, есть ли группа миллионов слева.', uz: "Sinflarga ajrating va chapda millionlar guruhi bor-yo'qligini qarang." },
    correct_text: { ru: 'Верно. Если слева есть третья группа — число доходит до миллионов.', uz: "To'g'ri. Agar chapda uchinchi guruh bo'lsa — son millionlargacha yetadi." },
    audio: {
      intro: { ru: 'Числа появляются по одному. Реши, до какого старшего класса доходит каждое, и тапни нужную корзину.', uz: "Sonlar bittalab chiqadi. Har biri qaysi yuqori sinfgacha yetishini aniqlang va kerakli savatni bosing." },
      on_correct: { ru: 'Верно. Третья группа слева — это миллионы.', uz: "To'g'ri. Chapdagi uchinchi guruh — bu millionlar." },
      on_wrong: { ru: 'Посчитай группы по три справа.', uz: "O'ngdan uchtalik guruhlarni sanang." }
    }
  },

  s13: {
    eyebrow: { ru: 'Проверка знаний', uz: 'Bilim tekshiruvi' },
    bridge: { ru: 'Финал — то самое число Солнца из начала урока.', uz: "Yakun — dars boshidagi o'sha Quyosh soni." },
    label: { ru: 'Запиши цифрами', uz: 'Raqamlar bilan yozing' },
    context: { ru: 'Расстояние от Земли до Солнца, км.', uz: 'Yerdan Quyoshgacha masofa, km.' },
    question: { ru: 'Запиши цифрами: сто сорок девять миллионов шестьсот тысяч.', uz: "Raqamlar bilan yozing: bir yuz qirq to'qqiz million olti yuz ming." },
    placeholder: { ru: '0', uz: '0' },
    answer: '149600000',
    hint: { ru: 'Миллионы, потом тысячи, потом пустой класс единиц из трёх нулей.', uz: "Millionlar, keyin minglar, keyin uchta noldan iborat bo'sh birlar sinfi." },
    fb_correct: { ru: 'Правильно. Миллионы — 149, тысячи — 600, класс единиц пуст: 149 600 000. Ты прочитал число из начала урока.', uz: "To'g'ri. Millionlar — 149, minglar — 600, birlar sinfi bo'sh: 149 600 000. Dars boshidagi sonni o'qidingiz." },
    fb_wrong: { ru: 'Не теряй нули. Сто сорок девять миллионов, шестьсот тысяч, и пустой класс единиц из трёх нулей.', uz: "Nollarni yo'qotmang. Bir yuz qirq to'qqiz million, olti yuz ming, va uchta noldan iborat bo'sh birlar sinfi." },
    fact: { ru: 'Память обычного смартфона — это миллиарды байтов. Большие числа окружают нас каждый день.', uz: "Oddiy smartfon xotirasi — milliardlab bayt. Katta sonlar bizni har kuni o'rab turadi." },
    fact_audio: { ru: 'Кстати, память обычного смартфона измеряется миллиардами байтов. Большие числа окружают нас каждый день.', uz: "Aytgancha, oddiy smartfon xotirasi milliardlab bayt bilan o'lchanadi. Katta sonlar bizni har kuni o'rab turadi." },
    audio: {
      intro: { ru: 'Запиши цифрами расстояние до Солнца: сто сорок девять миллионов шестьсот тысяч. Потом нажми кнопку проверить.', uz: "Quyoshgacha masofani raqamlar bilan yozing: bir yuz qirq to'qqiz million olti yuz ming. Keyin tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Ты записал число из начала урока без потерянных нулей.', uz: "To'g'ri. Dars boshidagi sonni nollarni yo'qotmay yozdingiz." },
      on_wrong: { ru: 'Проверь нули в пустом классе единиц.', uz: "Bo'sh birlar sinfidagi nollarni tekshiring." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    heading: { ru: 'Теперь ты читаешь любое огромное число', uz: "Endi istalgan katta sonni o'qiysiz" },
    title: { ru: 'Помнишь вопрос про Солнце? Теперь ответ у тебя есть.', uz: "Quyosh haqidagi savolni eslaysizmi? Endi javob sizda." },
    hook_close: { ru: 'Расстояние до Солнца 149 600 000 — это сто сорок девять миллионов шестьсот тысяч километров. В начале урока его было трудно прочитать, теперь — нет.', uz: "Quyoshgacha masofa 149 600 000 — bu bir yuz qirq to'qqiz million olti yuz ming kilometr. Dars boshida uni o'qish qiyin edi, endi — yo'q." },
    score_label: { ru: 'вопросов решено с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'Разбей число на классы по три цифры справа.', uz: "Sonni o'ngdan uch xonadan sinflarga ajrating." },
    main_2: { ru: 'В каждом классе три разряда; читай слева направо по классам.', uz: "Har bir sinfda uchta xona; chapdan o'ngga sinflar bo'yicha o'qing." },
    main_3: { ru: 'Ноль держит пустой разряд — без него число в разы меньше.', uz: "Nol bo'sh xonani ushlaydi — usiz son necha barobar kichik." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'разряды и классы из начальной школы', uz: "boshlang'ich sinfdagi xona va sinflar" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'сравнение и округление многозначных чисел', uz: "ko'p xonali sonlarni taqqoslash va yaxlitlash" },
    audio: {
      ru: [
        'Вернёмся к вопросу урока: как прочитать огромные числа вокруг нас.',
        'Разбиваем число на классы по три цифры справа, в каждом классе три разряда, и читаем слева направо.',
        'Ноль держит пустой разряд, выбрасывать его нельзя, иначе число станет в разы меньше.',
        'Теперь даже расстояние до Солнца тебе по силам. Дальше нас ждёт сравнение и округление больших чисел.'
      ],
      uz: [
        "Dars savoliga qaytamiz: atrofimizdagi katta sonlarni qanday o'qiymiz.",
        "Sonni o'ngdan uch xonadan sinflarga ajratamiz, har bir sinfda uchta xona, va chapdan o'ngga o'qiymiz.",
        "Nol bo'sh xonani ushlaydi, uni tashlab bo'lmaydi, aks holda son necha barobar kichik bo'lib qoladi.",
        "Endi hatto Quyoshgacha masofa ham qo'lingizdan keladi. Keyingi safar katta sonlarni taqqoslash va yaxlitlash kutadi."
      ]
    }
  }
};

// ============================================================
// SHUFFLE / FORMAT / ANIM HELPERS (nat_5_01)
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const fmtNum = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffleArr = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const tick = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick); else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
const CountUp = ({ target, duration, style, className }) => {
  const v = useCountUp(target, duration);
  return <span className={className} style={style}>{fmtNum(v)}</span>;
};

// Sinflar guruhi: 3 xonali bloklar ketma-ket yonadi (sayohatchi animatsiya YO'Q).
const GroupingReveal = ({ groups, color, active = -1 }) => (
  <div className="display" style={{ fontSize: 'clamp(28px, 6vw, 50px)', letterSpacing: '0.02em', color: color || T.ink, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(8px, 1.6vw, 16px)' }}>
    {groups.map((g, i) => (
      <span key={i} className="lesson-group cls-cell" style={{ animationDelay: `${(groups.length - 1 - i) * 0.14}s`, background: active === i ? T.accentSoft : 'transparent', color: active === i ? T.accent : (color || T.ink), padding: '2px 8px' }}>{g}</span>
    ))}
  </div>
);
// Nol olib tashlanganda son o'zgaradi (joyida fade — sayohatchi emas).
const ZeroMorph = ({ a, b, collapsed }) => (
  <div style={{ position: 'relative', height: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span className="display" style={{ position: 'absolute', fontSize: 'clamp(28px, 6vw, 48px)', letterSpacing: '0.02em', color: T.ink, transition: 'opacity 0.5s ease', opacity: collapsed ? 0 : 1 }}>{a}</span>
    <span className="display" style={{ position: 'absolute', fontSize: 'clamp(28px, 6vw, 48px)', letterSpacing: '0.02em', color: T.accent, transition: 'opacity 0.5s ease', opacity: collapsed ? 1 : 0 }}>{b}</span>
  </div>
);
// Quyosh + orbit halqasi — Yer statik nuqta (aylanmaydi), faqat Quyosh yumshoq pulslaydi.
const OrbitDiagram = ({ maxW = 300 }) => (
  <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: maxW, margin: '0 auto', display: 'block', transition: 'max-width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <circle cx="100" cy="100" r="72" fill="none" stroke={T.ink3} strokeWidth="1" strokeDasharray="3 5" opacity="0.6"/>
    <line x1="100" y1="100" x2="172" y2="100" stroke={T.accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35"/>
    <circle className="sun-pulse-hero" cx="100" cy="100" r="22" fill={T.accent}/>
    <g className="orbit-spin"><circle cx="172" cy="100" r="8" fill={T.blue}/></g>
  </svg>
);
// Xona katakchalari: bir sinf ichidagi uch raqam to'lganda yashilga o'tadi.
const PlaceGrid = ({ answer, filled }) => {
  const digits = String(answer).split('');
  const n = digits.length;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
      {digits.map((d, i) => {
        const classBreak = (n - i) % 3 === 0 && i !== 0;
        return (
          <React.Fragment key={i}>
            {classBreak && <span style={{ width: 8 }}/>}
            <span className={`place-cell ${filled ? 'filled' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{filled ? d : '·'}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================
// FACTCARD — ovozli fakt to'g'ri javobdan keyin (ko'k tema + darsga xos Anim*).
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',    uz: "Bilasizmi? · IT" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
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
const AnimDigits = () => (<div className="fa-dg" aria-hidden="true">{Array.from({ length: 3 }).map((_, g) => (<span key={g} className="fa-dg-grp">{Array.from({ length: 3 }).map((_, d) => (<i key={d}/>))}</span>))}</div>);
const AnimStars = () => (<div className="fa-st" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => (<span key={i} style={{ animationDelay: `${i * 0.22}s` }}/>))}</div>);
const AnimData = () => (<div className="fa-da" aria-hidden="true">{[40, 60, 80, 100].map((h, i) => (<span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }}/>))}</div>);

// ============================================================
// SHARED SCREEN HELPERS
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Floaters = () => (<div className="amb" aria-hidden="true"><span className="amb-o amb-o1"/><span className="amb-o amb-o2"/><span className="amb-o amb-o3"/></div>);
const StepLine = ({ children, soft }) => (
  <div className={`fade-up ${soft ? 'frame-tip' : 'frame'}`} style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
    <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
  </div>
);
// Bosqichli izohlar yig'iladi: oldingi qatorlar (so'lg'in) qoladi, yangisi pastdan chiqadi (fade-up).
const StepLinesAccum = ({ lines, step }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 12px)' }}>
    {lines.slice(0, step + 1).map((ln, i) => {
      const isCurrent = i === step;
      return (
        <div key={i} className={`${isCurrent ? 'fade-up frame' : 'frame-tip'}`} style={{ padding: 'clamp(12px, 2vw, 16px)', opacity: isCurrent ? 1 : 0.72, transition: 'opacity 0.4s ease' }}>
          <p className="body" style={{ margin: 0, color: isCurrent ? T.ink : T.ink2 }}>{ln}</p>
        </div>
      );
    })}
  </div>
);
const HintBlock = ({ show, children }) => {
  const lang = useLang();
  if (!show) return null;
  return (
    <div className="frame-tip fade-up" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
      <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
      <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
    </div>
  );
};
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// Bosqichli kashfiyot: bitta ovozli qator + bitta ko'rinadigan izoh (skrollsiz, qatorlar yig'ilmaydi).
const StepExploration = ({ screen, screenContent, onNext, onPrev, totalScreens, renderBody, factOnLast }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const last = lines.length - 1;
  const audio = useAudio([{ id: `s${screen}_a0`, text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const [step, setStep] = useState(0);
  const factVoicedRef = useRef(false);
  const speak = (txt) => { if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); speak(lines[ns]); if (ns === last && factOnLast && c.fact_audio && !factVoicedRef.current) { factVoicedRef.current = true; speak(c.fact_audio[lang]); } }
    else { onNext(); }
  };
  // Bitta qatorli kashfiyotda ham faktni oxirida ovozlash.
  useEffect(() => { if (last === 0 && factOnLast && c.fact_audio && !factVoicedRef.current) { factVoicedRef.current = true; if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.fact_audio[lang]); } } /* eslint-disable-next-line */ }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={<NextLabel/>} onClick={handleStep}/></>);
  return (<Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>{renderBody({ t, lang, step, last })}</Stage>);
};

// Qoida ekrani (s3, s6): ikki qoida qatori (pale-yellow) + misol.
const RuleScreen = ({ screen, screenContent, onNext, onPrev, totalScreens, exampleNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_a`, text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 20px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_1)}</p></div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_2)}</p></div>
        <div className="frame fade-up delay-3" style={{ position: 'relative', textAlign: 'center' }}>
          {exampleNode || <p className="body" style={{ margin: 0, color: T.ink }}>{t(c.example)}</p>}
        </div>
      </div>
    </Stage>
  );
};

// Javob terish ekrani (s9, s13) — keep-visible: savol qoladi, faqat input to'ladi/yashilga o'tadi.
const InputScreen = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const norm = (s) => String(s).replace(/[^0-9]/g, '');
  const solvedInit = storedAnswer !== undefined && norm(storedAnswer.studentAnswer) === norm(c.answer);
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(solvedInit);
  const [showHint, setShowHint] = useState(storedAnswer !== undefined && !solvedInit);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const factVoicedRef = useRef(false);
  const isCorrect = norm(value) === norm(c.answer) && norm(value) !== '';

  const submit = () => {
    if (norm(value) === '' || solved) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: null, correctIndex: null, correctAnswer: c.answer, studentAnswerIndex: null, studentAnswer: String(value), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); } else { setShowHint(true); }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine(); if (!e || audio.muted) return;
        if (isCorrect) { e.pushOneOff(c.audio.on_correct[lang]); if (c.fact_audio && !factVoicedRef.current) { factVoicedRef.current = true; e.pushOneOff(c.fact_audio[lang]); } }
        else { e.pushOneOff(c.audio.on_wrong[lang] + ' ' + c.hint[lang]); }
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)} · {t(c.label)}</p>
          {c.context && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.context)}</p>}
          <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : (showHint ? 'wrong' : '')}`} value={value} placeholder={t(c.placeholder)} onChange={e => setValue(e.target.value)} disabled={solved} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'min(100%, 320px)' }}/>
          <PlaceGrid answer={c.answer} filled={solved}/>
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!value} onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
        {solved && factNode}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// Xato o'qishni top (s7) — keep-visible: to'g'ri (xato) variant qoladi, qolganlari yig'iladi.
const OddOneOut = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const correctIdx = c.errorIdx;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);

  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isC = i === correctIdx;
    if (firstTryRef.current === null) firstTryRef.current = isC;
    setPicked(i);
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isC) {
      setSolved(true);
      onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: c.items.map(it => it.num), correctIndex: correctIdx, correctAnswer: c.items[correctIdx].num, studentAnswerIndex: i, studentAnswer: c.items[i].num, correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
    } else {
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine(); if (!e || audio.muted) return;
        const wv = (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
        e.pushOneOff(isC ? c.audio.on_correct[lang] : wv);
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.question)}</h2>
          <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {c.items.map((it, i) => {
            const isCorrect = i === correctIdx;
            const isWrongPicked = wrong.has(i);
            const collapse = solved && !isCorrect;
            let cls = 'option';
            if (solved && isCorrect) cls += ' option-correct';
            else if (isWrongPicked) cls += ' option-picked-wrong';
            return (
              <button key={i} className={cls} disabled={solved || isWrongPicked} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 18px)' : 'clamp(11px, 1.7vw, 14px) clamp(14px, 2.1vw, 18px)', maxHeight: collapse ? 0 : 140, opacity: collapse ? 0 : 1, overflow: 'hidden', borderWidth: collapse ? 0 : undefined, display: 'flex', alignItems: 'center', gap: 12, transition: 'opacity 0.5s cubic-bezier(0.33,0,0.2,1), max-height 0.65s cubic-bezier(0.33,0,0.2,1), padding 0.5s cubic-bezier(0.33,0,0.2,1)', transitionDelay: collapse ? `${i * 0.06}s` : '0s' }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>{solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}</span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                  <span className="display" style={{ fontSize: 'clamp(16px, 2.6vw, 22px)' }}>{it.num}</span>
                  <span className="small" style={{ color: T.ink2 }}>{t(it.reading)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}</p>
          <p className="body" style={{ margin: 0 }}>{t(solved ? c.correct_text : (c[`wrong_${picked}`] || c.audio.on_wrong))}</p>
        </FeedbackBlock>
        {solved && factNode}
      </div>
    </Stage>
  );
};

// Tasniflash (s12) — son bittalab chiqadi, bola savatni bosadi; веди-до-верного; joylanganlar yashil chip.
const Classify = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const cards = c.cards;
  const total = cards.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  // Tartib HAR seansda RANDOM (Fisher-Yates, useState init — seans ichida o'zgarmaydi, tiklanish buzilmaydi).
  const [deck] = useState(() => shuffleArr([...Array(total).keys()]));
  const [pos, setPos] = useState(wasSolved ? total : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? cards.map(c2 => c2.bin) : []));
  const [wrongBin, setWrongBin] = useState(null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const solved = pos >= total;
  const cardIdx = solved ? -1 : deck[pos];

  const tap = (bin) => {
    if (solved) return;
    const isC = bin === cards[cardIdx].bin;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isC) {
      setWrongBin(null);
      const np = [...placed]; np[cardIdx] = bin; setPlaced(np);
      const nPos = pos + 1; setPos(nPos);
      if (nPos >= total) {
        if (firstTryRef.current === null) firstTryRef.current = true;
        onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'sorted', studentAnswer: JSON.stringify(np), correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
        if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      }
    } else {
      if (firstTryRef.current === null || firstTryRef.current === true) firstTryRef.current = false;
      setWrongBin(bin);
      if (!audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang] + ' ' + c.hint[lang]); }, 300); }
    }
  };

  const bins = [{ key: 'th', label: c.bin_th }, { key: 'mln', label: c.bin_mln }];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        {!solved && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 92, justifyContent: 'center' }}>
            <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{pos + 1} / {total}</p>
            <div key={pos} className="display fade-up" style={{ fontSize: 'clamp(26px, 5.6vw, 42px)', color: T.ink }}>{cards[cardIdx].label}</div>
          </div>
        )}
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {bins.map(b => {
            const chips = placed.map((p, k) => (p === b.key ? cards[k].label : null)).filter(Boolean);
            const isWrong = wrongBin === b.key;
            return (
              <button key={b.key} disabled={solved} onClick={() => tap(b.key)} className="option" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', padding: 'clamp(12px, 2vw, 16px)', borderWidth: isWrong ? 2 : undefined, borderStyle: isWrong ? 'solid' : undefined, borderColor: isWrong ? T.accent : undefined, cursor: solved ? 'default' : 'pointer' }}>
                <span className="small mono" style={{ color: T.ink2, fontWeight: 700 }}>{t(b.label)}</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {chips.map((ch, k) => (<span key={k} className="mono small" style={{ padding: '3px 8px', borderRadius: 8, background: '#E3F0E8', color: T.success }}>{ch}</span>))}
                </span>
              </button>
            );
          })}
        </div>
        {wrongBin && !solved && <HintBlock show={true}>{t(c.hint)}</HintBlock>}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// Moslash (s11) — songa bos, ro'yxatdan o'qilishini tanla; keep-visible (savol qoladi); веди-до-верного.
const DragMatch = ({ screen, screenContent, onAnswer, onNext, onPrev, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const isMobile = useIsMobile();
  const pairs = c.pairs;
  const n = pairs.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [order] = useState(() => shuffleArr([...Array(n).keys()]));
  const [assign, setAssign] = useState(() => Array(n).fill(null));
  const [activeSlot, setActiveSlot] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(null);

  const allPlaced = assign.every(a => a !== null);
  const isCorrect = assign.every((a, k) => a === k);
  const slotOf = (pairIdx) => assign.findIndex(a => a === pairIdx);

  const assignToActive = (pairIdx) => {
    if (solved || activeSlot === null) return;
    setAssign(prev => { const nx = prev.map(a => (a === pairIdx ? null : a)); nx[activeSlot] = pairIdx; return nx; });
    setActiveSlot(null);
  };
  const clearSlot = (k, e) => { if (e) e.stopPropagation(); if (solved) return; setAssign(prev => { const nx = [...prev]; nx[k] = null; return nx; }); };

  const check = () => {
    if (solved || !allPlaced) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'match', studentAnswer: JSON.stringify(assign), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); setActiveSlot(null); } else { setShowHint(true); }
    if (!audio.muted) { const txt = isCorrect ? c.audio.on_correct[lang] : (c.audio.on_wrong[lang] + ' ' + c.hint[lang]); setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(txt); }, 300); }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const readingFont = isMobile ? 'clamp(12px, 3.4vw, 14px)' : 'clamp(13px, 1.7vw, 15px)';
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pairs.map((pr, k) => {
            const placedPair = assign[k];
            const active = activeSlot === k;
            return (
              <div key={k} className="frame" onClick={() => { if (!solved) setActiveSlot(active ? null : k); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(10px,1.8vw,14px)', cursor: solved ? 'default' : 'pointer', border: `2px solid ${solved ? T.success : (active ? T.accent : 'transparent')}`, transition: 'border-color 0.25s ease' }}>
                <div style={{ minWidth: 'clamp(100px, 28vw, 150px)' }}>
                  <div className="display" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', color: T.ink }}>{pr.number}</div>
                  <div className="small mono" style={{ color: T.ink3 }}>{t(pr.label)}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {placedPair !== null ? (
                    <>
                      <span style={{ flex: 1, fontSize: readingFont, lineHeight: 1.3, color: solved ? T.success : T.ink }}>{t(pairs[placedPair].reading)}</span>
                      {!solved && <button onClick={(e) => clearSlot(k, e)} aria-label={lang === 'uz' ? 'tozalash' : 'очистить'} className="mono" style={{ border: 'none', background: 'transparent', color: T.ink3, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>}
                    </>
                  ) : (
                    <span className="small" style={{ color: active ? T.accent : T.ink3 }}>{active ? (lang === 'uz' ? "ro'yxatdan tanlang ↓" : 'выбери из списка ↓') : (lang === 'uz' ? 'tanlash' : 'выбрать')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && activeSlot !== null && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.map(pi => {
              const usedSlot = slotOf(pi);
              const usedHere = usedSlot === activeSlot;
              return (
                <button key={pi} onClick={() => assignToActive(pi)} className="option" style={{ padding: 'clamp(10px,1.8vw,13px) clamp(12px,2vw,16px)', fontSize: readingFont, lineHeight: 1.3, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, opacity: usedSlot >= 0 && !usedHere ? 0.5 : 1, borderColor: usedHere ? T.accent : undefined }}>
                  <span className="mono small" style={{ minWidth: 18, color: usedSlot >= 0 ? T.accent : T.ink3 }}>{usedSlot >= 0 ? (usedHere ? '✓' : '•') : ''}</span>
                  <span style={{ flex: 1 }}>{t(pairs[pi].reading)}</span>
                </button>
              );
            })}
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
          </FeedbackBlock>
        )}
        {solved && factNode}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// Bo'shliqlarni qo'yish (s4) — raqamlar orasiga tap; keep-visible (savol qoladi); веди-до-верного.
const SpacesInteractive = ({ screen, screenContent, storedAnswer, onAnswer, onNext, onPrev, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const digits = c.raw.split('');
  const correct = c.correct;
  const parseSpaces = (str) => { const set = new Set(); let d = 0; for (const ch of str) { if (ch === ' ') set.add(d); else d++; } return set; };
  const solvedInit = storedAnswer !== undefined && storedAnswer.studentAnswer === correct;
  const [spaces, setSpaces] = useState(() => storedAnswer?.studentAnswer ? parseSpaces(storedAnswer.studentAnswer) : new Set());
  const [solved, setSolved] = useState(solvedInit);
  const [showHint, setShowHint] = useState(storedAnswer !== undefined && !solvedInit);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);

  const joined = digits.map((d, i) => (i > 0 && spaces.has(i) ? ' ' + d : d)).join('');
  const isCorrect = joined === correct;
  const toggleGap = (i) => { if (solved) return; setSpaces(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; }); };

  const submit = () => {
    if (solved) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.label[lang], options: null, correctIndex: null, correctAnswer: correct, studentAnswer: joined, correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); } else { setShowHint(true); }
    if (!audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (!e || audio.muted) return; if (isCorrect) e.pushOneOff(c.audio.on_correct[lang]); else e.pushOneOff(c.audio.on_wrong[lang] + ' ' + c.hint[lang]); }, 300); }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.label)}</h2>
          {c.context && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.context)}</p>}
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(20px, 4vw, 32px) clamp(12px, 2vw, 16px)' }}>
          <div className="display" style={{ fontSize: 'clamp(34px, 7vw, 56px)', display: 'flex', alignItems: 'center' }}>
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                {i > 0 && (<button onClick={() => toggleGap(i)} disabled={solved} aria-label={lang === 'uz' ? "bo'sh joy" : 'пробел'} className="gap-slot" style={{ width: spaces.has(i) ? 'clamp(14px,3vw,24px)' : 'clamp(7px,1.6vw,12px)', background: spaces.has(i) ? T.accent : 'transparent' }}/>)}
                <span style={{ color: T.ink }}>{d}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={solved} onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
        {solved && factNode}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// ============================================================
const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const startedRef = useRef(false);
  useEffect(() => {
    if (audio.muted) { setShowOptions(true); return; }
    if (audio.isPlaying) startedRef.current = true;
    if (startedRef.current && !audio.isPlaying) setShowOptions(true);
  }, [audio.isPlaying, audio.muted]);
  useEffect(() => {
    const words = (c.audio.intro[lang] || '').trim().split(/\s+/).filter(Boolean).length;
    const ms = Math.max(4000, Math.min(Math.round(words / 2.3 * 1000) + 1500, 16000));
    const tmr = setTimeout(() => setShowOptions(true), ms);
    return () => clearTimeout(tmr);
  }, [lang]);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer({ stage: null, screenIdx: screen, studentAnswer: v, correct: true }); audio.triggerEvent('option_picked'); setTimeout(onNext, 300); };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.accent }}>{t(c.eyebrow)}</p>
        <h1 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.global_q)}</h1>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, maxHeight: showOptions ? 0 : 200, opacity: showOptions ? 0 : 1, marginBottom: showOptions ? 'calc(-1 * clamp(12px, 2.2vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>{t(c.lead)}</p>
        <div className="frame fade-up delay-2" style={{ position: 'relative', textAlign: 'center', padding: showOptions ? 'clamp(14px, 2.5vw, 18px)' : undefined, transition: 'padding 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <OrbitDiagram maxW={showOptions ? 180 : 300}/>
          <div style={{ marginTop: showOptions ? 6 : 10, transition: 'margin-top 0.6s' }}><CountUp target={149600000} duration={1500} className="display" style={{ fontSize: showOptions ? 'clamp(24px, 5vw, 36px)' : 'clamp(30px, 6.4vw, 52px)', color: T.accent, letterSpacing: '0.03em', transition: 'font-size 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}/></div>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative', margin: 0 }}>{t(c.question)}</h2>
        {showOptions && (
          <div className="fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ id: 'yes', label: c.opt_yes }, { id: 'no', label: c.opt_no }, { id: 'idk', label: c.opt_idk }].map(opt => (
              <button key={opt.id} className="option" disabled={picked !== null} onClick={() => pick(opt.id)} style={{ padding: 'clamp(13px, 1.9vw, 15px) clamp(16px, 2.5vw, 20px)', fontSize: 'clamp(15px, 1.9vw, 15px)' }}>{t(opt.label)}</button>
            ))}
          </div>
        )}
      </div>
    </Stage>
  );
};

const Screen1 = (props) => {
  const t = useT();
  const c = CONTENT.s1;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [3, 0, 2, 1]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

const Screen2 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s2} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 20px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s2.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s2.bridge)}</p>
        <div className="frame fade-up delay-2"><GroupingReveal groups={['149', '600', '000']} active={step < 3 ? [2, 1, 0][step] : -1}/></div>
        <StepLinesAccum lines={CONTENT.s2.audio[lang]} step={step}/>
      </div>
    )}/>
);

const Screen3 = (props) => (<RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS} exampleNode={<GroupingReveal groups={['149', '600', '000']} color={T.ink}/>}/>);

const Screen4 = (props) => <SpacesInteractive {...props} screenContent={CONTENT.s4} totalScreens={TOTAL_SCREENS}/>;

const RANKS = [{ ru: 'сотни', uz: 'yuzlar' }, { ru: 'десятки', uz: "o'nlar" }, { ru: 'единицы', uz: 'birlar' }];
const Screen5 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s5} totalScreens={TOTAL_SCREENS} factOnLast
    renderBody={({ t, lang, step, last }) => {
      const active = [2, 1, 0][Math.min(step, 2)];
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 18px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s5.title)}</h2>
          <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s5.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 2vw, 18px)' }}>
            {RANKS.map((cell, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="display cls-cell" style={{ fontSize: 'clamp(28px, 6vw, 44px)', padding: '4px 12px', background: i === active ? T.accentSoft : 'transparent', color: i === active ? T.accent : T.ink }}>{['1', '2', '3'][i]}</div>
                <p className="small mono" style={{ marginTop: 6, color: i === active ? T.accent : T.ink3 }}>{lang === 'uz' ? cell.uz : cell.ru}</p>
              </div>
            ))}
          </div>
          <StepLinesAccum lines={CONTENT.s5.audio[lang]} step={step}/>
          {step >= last && <FactCard badge={FB_HIST} anim={<AnimDigits/>} text={CONTENT.s5.fact}/>}
        </div>
      );
    }}/>
);

const Screen6 = (props) => (<RuleScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS}/>);

const Screen7 = (props) => <OddOneOut {...props} screenContent={CONTENT.s7} totalScreens={TOTAL_SCREENS}/>;

const Screen8 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s8} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 18px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s8.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s8.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ZeroMorph a={t(CONTENT.s8.number_a)} b={t(CONTENT.s8.number_b)} collapsed={step >= 1}/>
          <div>
            <div className="cmp-bar" style={{ width: step >= 1 ? '10%' : '100%' }}/>
            <p className="small mono" style={{ marginTop: 8, color: step >= 1 ? T.accent : T.ink3 }}>{step >= 1 ? t(CONTENT.s8.number_b) : t(CONTENT.s8.number_a)}</p>
          </div>
        </div>
        <StepLinesAccum lines={CONTENT.s8.audio[lang]} step={step}/>
        {step >= 2 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0, color: T.ink }}>{t(CONTENT.s8.warn)}</p></div>}
      </div>
    )}/>
);

const Screen9 = (props) => <InputScreen {...props} screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} factNode={<FactCard badge={FB_SCI} anim={<AnimStars/>} text={CONTENT.s9.fact}/>}/>;

const Screen10 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS} factOnLast
    renderBody={({ t, lang, step, last }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 18px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s10.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s10.bridge)}</p>
        <div className="frame fade-up delay-2">
          <GroupingReveal groups={['299', '792', '458']} active={Math.min(step, 2)}/>
          <div className="light-track"><div className="light-beam"/></div>
        </div>
        <StepLinesAccum lines={CONTENT.s10.audio[lang]} step={step}/>
        {step >= last && <FactCard badge={FB_SCI} anim={<AnimStars/>} text={CONTENT.s10.fact}/>}
      </div>
    )}/>
);

const Screen11 = (props) => <DragMatch {...props} screenContent={CONTENT.s11} totalScreens={TOTAL_SCREENS}/>;

const Screen12 = (props) => <Classify {...props} screenContent={CONTENT.s12} totalScreens={TOTAL_SCREENS}/>;

const Screen13 = (props) => <InputScreen {...props} screenContent={CONTENT.s13} totalScreens={TOTAL_SCREENS} factNode={<FactCard badge={FB_IT} anim={<AnimData/>} text={CONTENT.s13.fact}/>}/>;

const Screen14 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's14_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach(l => e.pushOneOff(l)); }
    /* eslint-disable-next-line */
  }, []);
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers[i]?.correct).length;
  const total = scoredIdx.length;
  const mains = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.success }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{t(c.heading)}</h2>
        </div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{t(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{t(c.hook_close)}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

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
.option-wrong { background: #FFFFFF !important; color: #A7A6A2 !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(17px, 2.5vw, 20px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.5; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(12px, 2vw, 18px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 16px); padding-bottom: clamp(17px, 3.4vw, 34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(12px, 2vw, 15px); padding-bottom: clamp(12px, 2vw, 15px); display: flex; gap: 12px; }

.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

.track-wrap { position: relative; height: 26px; margin: 18px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 30px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (nat_5_01) ===== */
@keyframes lesson-group-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
.lesson-group { display: inline-block; animation: lesson-group-in 0.5s ease-out both; }
.cls-cell { transition: background 0.4s, color 0.4s; border-radius: 8px; }
.cmp-bar { height: clamp(14px, 2.4vw, 18px); border-radius: 99px; background: #FF4F28; transition: width 0.9s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 0 10px rgba(255,79,40,0.40); }
.place-cell { font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center; min-width: clamp(20px, 3.6vw, 30px); height: clamp(28px, 5vw, 40px); border-radius: 8px; background: #FFFFFF; color: #A7A6A2; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); transition: all 0.35s; }
.place-cell.filled { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.30); }

.sun-pulse-hero { transform-box: view-box; transform-origin: 100px 100px; animation: sun-pulse-hero 2.6s ease-in-out infinite; filter: drop-shadow(0 0 7px rgba(255,79,40,0.55)); }
@keyframes sun-pulse-hero { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.07); } }
.orbit-spin { transform-box: view-box; transform-origin: 100px 100px; animation: orbit-rot 16s linear infinite; }
@keyframes orbit-rot { to { transform: rotate(360deg); } }

.light-track { position: relative; height: 4px; margin-top: 16px; border-radius: 99px; background: rgba(167,166,162,0.25); overflow: hidden; }
.light-beam { position: absolute; top: 0; left: 0; height: 100%; width: 30%; border-radius: 99px; background: #FF4F28; box-shadow: 0 0 10px rgba(255,79,40,0.6); animation: light-sweep 1.8s ease-in-out infinite; }
@keyframes light-sweep { 0% { left: -30%; } 100% { left: 100%; } }

.gap-slot { height: clamp(34px, 7vw, 56px); border: none; cursor: pointer; border-radius: 5px; transition: width 0.25s ease, background 0.25s ease; }
.gap-slot:disabled { cursor: default; }
.gap-slot:not(:disabled):hover { background: rgba(255, 79, 40, 0.25) !important; }

.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
.fa-dg { display: flex; gap: 7px; align-items: center; }
.fa-dg-grp { display: flex; gap: 2px; animation: faDg 2.4s ease-in-out infinite; }
.fa-dg-grp i { width: 7px; height: clamp(20px, 4vw, 30px); background: #019ACB; opacity: 0.25; border-radius: 2px; }
.fa-dg-grp:nth-child(1) { animation-delay: 0s; }
.fa-dg-grp:nth-child(2) { animation-delay: 0.3s; }
.fa-dg-grp:nth-child(3) { animation-delay: 0.6s; }
@keyframes faDg { 0%, 100% { opacity: 0.3; } 45% { opacity: 1; } }
.fa-st { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1.4vw, 10px); width: clamp(70px, 14vw, 96px); }
.fa-st span { width: clamp(8px, 1.8vw, 11px); height: clamp(8px, 1.8vw, 11px); border-radius: 50%; background: #019ACB; box-shadow: 0 0 6px rgba(1, 154, 203, 0.6); animation: faSt 2.2s ease-in-out infinite; }
@keyframes faSt { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
.fa-da { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.fa-da span { width: clamp(10px, 2.2vw, 14px); background: #019ACB; opacity: 0.3; border-radius: 3px; animation: faDa 2.4s ease-in-out infinite; }
@keyframes faDa { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }

.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (platform_contract §1)
// ============================================================
export default function NaturalNumbersLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const lang = langProp || 'ru';
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const nextArr = [...prev]; nextArr[screenIdx] = data; return nextArr; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
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
        <CurrentScreen
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
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
