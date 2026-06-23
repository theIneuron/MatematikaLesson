import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Угол, прямые и круг. Начало геометрии — geom_5_00
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: solved ? 'center' : 'flex-start' }}>
        {titleNode && <Title node={titleNode}/>}
        {/* Sarlavha (Title) + savol matni to'g'ri javobdan keyin ham qoladi — faqat noto'g'ri variantlar yig'iladi. */}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {/* To'g'ri javobdan keyin: faqat to'g'ri variant qoladi, noto'g'rilari silliq yig'ilib g'oyib bo'ladi (yangilangan anti-scroll). */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
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
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// ============================================================
// --- POD UROK: geom_5_00 — Burchak, chiziqlar va aylana. Geometriya boshlanishi / Угол, прямые и круг. Начало геометрии (PROMPT 2026-06-18) ---
// Markaziy misconception M1: "burchak kattaligi tomon uzunligiga bog'liq" (uzun tomonli burchak kattaroq).
// M2: kesma / nur / to'g'ri chiziqni chalkashtirish (qaysida uch bor). M3: diametr = radius deb chalkashtirish.
// Darslik (Haydarov): kesma/nur/to'g'ri chiziq (I bob), burchak — to'g'ri (90°) va yoyiq (180°) (§48-49),
// aylana — markaz/radius/diametr (= 2 × radius), doira (§26). Burchak terminologiyasi 5-sinf doirasi: to'g'ri va yoyiq.
// Hook: motivatsion ("Geometriya nima?" — atrofdagi shakllar). Vizualizator: SVG figuralar (LineFig/AngleFig/CircleFig).
// Etalon: Dars31 (geom) — figure-li QuestionScreen, Title, FB_MATH, custom raqam-kiritish (NumGeoScreen).
// Faktlar (DRAFT): to'g'ri burchak qurilishda (IT) / geometriya = yer o'lchash (Tarix) / aylana uzunligi diametrdan ~3,14 (Matematika).
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'geom_5_00',
  lessonTitle: { ru: 'Угол, прямые и круг. Начало геометрии', uz: "Burchak, chiziqlar va aylana. Geometriya boshlanishi" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'NumGeoScreen',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {
  // ===== s0 HOOK (motivatsion) =====
  s0: {
    eyebrow: { ru: 'Начало геометрии', uz: "Geometriya boshlanishi" },
    title: { ru: 'Что такое геометрия?', uz: "Geometriya nima?" },
    lead: { ru: 'Вокруг нас формы: колесо, угол книги, натянутая нить. У них есть названия?', uz: "Atrofimizda shakllar bor: g'ildirak, kitob burchagi, tortilgan ip. Ularning nomlari bormi?" },
    opt0: { ru: 'Да, их изучает геометрия', uz: "Ha, ularni geometriya o'rganadi" },
    opt1: { ru: 'Нет, это просто предметы', uz: "Yo'q, bular shunchaki narsalar" },
    opt2: { ru: 'Не знаю', uz: "Bilmayman" },
    reveal: { ru: 'Да! Геометрия — наука о формах и их свойствах. Сегодня знакомимся с линией, углом и окружностью.', uz: "Ha! Geometriya — shakllar va ularning xossalarini o'rganadigan fan. Bugun chiziq, burchak va aylana bilan tanishamiz." },
    audio: { ru: "Посмотрите вокруг: колесо круглое, угол книги острый, нить прямая. У каждой формы есть своё имя в геометрии. Узнаем их.", uz: "Atrofga qarang: g'ildirak dumaloq, kitob burchagi o'tkir, ip to'g'ri. Har bir shaklning geometriyada o'z nomi bor. Ularni bilib olamiz." }
  },

  // ===== s1 WARM-UP — kesma (step: ikki nuqta -> tutashtirish -> kesma). Savolsiz, bosqichli izoh tepada yig'iladi. =====
  s1: {
    eyebrow: { ru: 'Начнём', uz: "Boshlaymiz" },
    title: { ru: 'Две точки', uz: "Ikki nuqta" },
    step_1: { ru: 'Вот две точки — просто два места на листе.', uz: "Mana ikki nuqta — varaqdagi ikki joy." },
    step_2: { ru: 'Соединим их самым коротким путём.', uz: "Ularni eng qisqa yo'l bilan tutashtiramiz." },
    step_3: { ru: 'Этот прямой путь называется отрезком. У него два конца.', uz: "Bu to'g'ri yo'l kesma deyiladi. Uning ikki uchi bor." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "С чего начинается геометрия? С точек. Вот две точки, просто два места.",
        "Соединим их самым коротким путём.",
        "Этот прямой путь между двумя точками называется отрезком. У него два конца."
      ],
      uz: [
        "Geometriya nimadan boshlanadi? Nuqtalardan. Mana, ikki nuqta. Bu shunchaki ikki joy.",
        "Ularni eng qisqa yo'l bilan tutashtiramiz.",
        "Bu ikki nuqta orasidagi to'g'ri yo'l kesma deyiladi. Uning ikki uchi bor."
      ]
    }
  },

  // ===== s2 EXPLORATION — chiziqlar (step) =====
  s2: {
    eyebrow: { ru: 'Три линии', uz: "Uch xil chiziq" },
    title: { ru: 'Отрезок, луч, прямая', uz: "Kesma, nur, to'g'ri chiziq" },
    lead: { ru: 'Линии отличаются концами. Посмотрим.', uz: "Chiziqlar uchlari bilan farq qiladi. Ko'ramiz." },
    line_seg: { ru: 'Отрезок: есть два конца. Он ограничен.', uz: "Kesma: ikki uchi bor. U chegaralangan." },
    line_ray: { ru: 'Луч: один конец, а в другую сторону бесконечен.', uz: "Nur: bir uchi bor, ikkinchi tomonga cheksiz." },
    line_line: { ru: 'Прямая: бесконечна в обе стороны, концов нет.', uz: "To'g'ri chiziq: ikki tomonga cheksiz, uchi yo'q." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Есть три вида прямых линий. Они отличаются концами.",
        "Отрезок ограничен с двух сторон — у него два конца.",
        "У луча только один конец, а в другую сторону он продолжается без конца.",
        "А прямая бесконечна в обе стороны, у неё концов нет вовсе."
      ],
      uz: [
        "Uch xil to'g'ri chiziq bor. Ular uchlari bilan farq qiladi.",
        "Kesma ikki tomondan chegaralangan — uning ikki uchi bor.",
        "Nurning faqat bitta uchi bor, ikkinchi tomonga u cheksiz davom etadi.",
        "To'g'ri chiziq esa ikki tomonga cheksiz, uning uchi umuman yo'q."
      ]
    }
  },

  // ===== s3 EXPLORATION — burchak (slider, M1) =====
  s3: {
    eyebrow: { ru: 'Угол', uz: "Burchak" },
    title: { ru: 'Угол — это раскрытие', uz: "Burchak — bu ochilish" },
    lead: { ru: 'Угол — два луча из одной точки. Меняйте раскрытие.', uz: "Burchak — bir nuqtadan ikki nur. Ochilishni o'zgartiring." },
    slider_label: { ru: 'Раскрытие', uz: "Ochilish" },
    note_acute: { ru: 'Меньше прямого угла.', uz: "To'g'ri burchakdan kichik." },
    note_right: { ru: 'Прямой угол — 90 градусов.', uz: "To'g'ri burchak — to'qson daraja." },
    note_straight: { ru: 'Развёрнутый угол — 180 градусов, прямая линия.', uz: "Yoyiq burchak — bir yuz sakson daraja, to'g'ri chiziq." },
    note_obtuse: { ru: 'Больше прямого угла.', uz: "To'g'ri burchakdan katta." },
    warn: { ru: 'Длина сторон не меняет угол — важно только раскрытие.', uz: "Tomonlar uzunligi burchakni o'zgartirmaydi — faqat ochilish muhim." },
    audio: { ru: "Угол — это два луча, выходящие из одной точки, его вершины. Важно, насколько они раскрыты, а не какой длины стороны. Двигайте и смотрите: при девяноста градусах угол прямой, при ста восьмидесяти — развёрнутый.", uz: "Burchak — bir nuqtadan, uning uchidan chiqqan ikki nur. Muhimi — ular qanchalik ochilgani, tomonlar uzunligi emas. Suring va qarang: to'qson darajada burchak to'g'ri, bir yuz saksonda — yoyiq." }
  },

  // ===== s4 EXPLORATION — aylana (slider radius) =====
  s4: {
    eyebrow: { ru: 'Окружность', uz: "Aylana" },
    title: { ru: 'Центр, радиус, диаметр', uz: "Markaz, radius, diametr" },
    lead: { ru: 'Двигайте радиус и смотрите на диаметр.', uz: "Radiusni suring va diametrga qarang." },
    slider_label: { ru: 'Радиус', uz: "Radius" },
    line_def: { ru: 'Радиус — от центра до края. Диаметр — через центр, от края до края.', uz: "Radius — markazdan chetgacha. Diametr — markazdan o'tib, chetdan chetgacha." },
    line_rel: { ru: 'Диаметр всегда в два раза больше радиуса.', uz: "Diametr har doim radiusdan ikki barobar katta." },
    audio: { ru: "Окружность — это линия, все точки которой одинаково удалены от центра. Радиус идёт от центра до края, а диаметр проходит через центр и равен двум радиусам. Двигайте радиус и проверьте.", uz: "Aylana — barcha nuqtalari markazdan bir xil uzoqlikdagi chiziq. Radius markazdan chetgacha boradi, diametr esa markazdan o'tib, ikki radiusga teng bo'ladi. Radiusni suring va tekshiring." }
  },

  // ===== s5 RULE 1 — chiziqlar + burchak =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Линии и угол', uz: "Chiziqlar va burchak" },
    rule_label: { ru: 'Запомните', uz: "Yodda tuting" },
    rule_1: { ru: 'Отрезок — два конца. Луч — один конец. Прямая — концов нет.', uz: "Kesma — ikki uchi. Nur — bir uchi. To'g'ri chiziq — uchi yo'q." },
    rule_2: { ru: 'Угол — два луча из одной вершины.', uz: "Burchak — bir uchdan chiqqan ikki nur." },
    rule_3: { ru: 'Прямой угол — 90 градусов. Развёрнутый — 180 градусов.', uz: "To'g'ri burchak — to'qson daraja. Yoyiq — bir yuz sakson daraja." },
    rule_4: { ru: 'Размер угла зависит от раскрытия, а не от длины сторон.', uz: "Burchak kattaligi ochilishga bog'liq, tomon uzunligiga emas." },
    audio: { ru: "Итак, отрезок ограничен двумя концами, у луча один конец, а прямая бесконечна. Угол — это два луча из вершины, и его размер задаёт раскрытие.", uz: "Demak, kesma ikki uchi bilan chegaralangan, nurning bir uchi bor, to'g'ri chiziq esa cheksiz. Burchak — uchdan chiqqan ikki nur, uning kattaligini ochilish belgilaydi." }
  },

  // ===== s6 RULE 2 — aylana + TUZOQ =====
  s6: {
    eyebrow: { ru: 'Окружность и ловушка', uz: "Aylana va tuzoq" },
    heading: { ru: 'Окружность и частая ошибка', uz: "Aylana va ko'p uchraydigan xato" },
    rule_1: { ru: 'Окружность — линия вокруг центра; круг — это окружность с её внутренностью.', uz: "Aylana — markaz atrofidagi chiziq; doira — aylana va uning ichi." },
    rule_2: { ru: 'Радиус — от центра до края. Диаметр = 2 радиуса.', uz: "Radius — markazdan chetgacha. Diametr = 2 radius." },
    warn_1: { ru: 'Угол с длинными сторонами НЕ больше угла с короткими, если раскрытие одинаково.', uz: "Uzun tomonli burchak qisqa tomonlidan KATTA emas, agar ochilish bir xil bo'lsa." },
    audio: { ru: "Окружность — это линия вокруг центра, а круг — ещё и всё, что внутри. Радиус идёт до края, диаметр вдвое больше. И помните: длинные стороны не делают угол больше — смотрите только на раскрытие.", uz: "Aylana — markaz atrofidagi chiziq, doira esa — ichidagi hamma narsa ham. Radius chetgacha boradi, diametr ikki barobar. Va yodda tuting: uzun tomonlar burchakni katta qilmaydi — faqat ochilishga qarang." }
  },

  // ===== s7 TEST MC (figure) — qaysi nur? (M2) =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    question: { ru: 'У этой линии один конец, в другую сторону — бесконечна. Что это?', uz: "Bu chiziqning bir uchi bor, ikkinchi tomonga cheksiz. Bu nima?" },
    opt0: { ru: 'Отрезок', uz: "Kesma" },
    opt1: { ru: 'Луч', uz: "Nur" },
    opt2: { ru: 'Прямая', uz: "To'g'ri chiziq" },
    correct_text: { ru: 'Верно: один конец и стрелка в другую сторону — это луч.', uz: "To'g'ri: bir uchi va ikkinchi tomonda o'q — bu nur." },
    wrong_0: { ru: 'У отрезка два конца. А здесь один конец и стрелка.', uz: "Kesmaning ikki uchi bor. Bu yerda bir uchi va o'q." },
    wrong_2: { ru: 'У прямой нет концов, стрелки с обеих сторон. А здесь один конец.', uz: "To'g'ri chiziqning uchi yo'q, ikki tomonda o'q. Bu yerda bir uchi bor." },
    audio: {
      intro: { ru: "Посмотрите на линию: один конец, а в другую сторону стрелка. Как она называется?", uz: "Chiziqqa qarang: bir uchi, ikkinchi tomonda o'q. U qanday ataladi?" },
      on_correct: { ru: "Верно, это луч.", uz: "To'g'ri, bu nur." },
      on_wrong: { ru: "Считайте концы: у луча один конец.", uz: "Uchlarni sanang: nurning bir uchi bor." }
    }
  },

  // ===== s8 TEST MC (figure) — qaysi burchak katta? (M1) [FAKT to'g'ri burchak] =====
  s8: {
    eyebrow: { ru: 'Сравните углы', uz: "Burchaklarni solishtiring" },
    title: { ru: 'Какой угол больше?', uz: "Qaysi burchak katta?" },
    question: { ru: 'У угла А стороны длиннее, у угла Б — короче. Какой угол больше?', uz: "A burchakning tomonlari uzun, B burchakniki qisqa. Qaysi burchak katta?" },
    opt0: { ru: 'Угол А', uz: "A burchak" },
    opt1: { ru: 'Угол Б', uz: "B burchak" },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    correct_text: { ru: 'Верно: у Б раскрытие больше. Длина сторон не важна — важно раскрытие.', uz: "To'g'ri: B ning ochilishi katta. Tomon uzunligi muhim emas — ochilish muhim." },
    wrong_0: { ru: 'Стороны длиннее, но раскрытие меньше. Угол — это раскрытие.', uz: "Tomonlar uzun, lekin ochilishi kichik. Burchak — bu ochilish." },
    wrong_2: { ru: 'Раскрытие у них разное, посмотрите внимательно.', uz: "Ularning ochilishi har xil, diqqat bilan qarang." },
    fact: { ru: 'Прямой угол в 90 градусов нужен в стройке: чтобы стены стояли ровно, их углы проверяют угольником.', uz: "To'qson darajali to'g'ri burchak qurilishda kerak: devorlar tik turishi uchun ularning burchaklari go'niya bilan tekshiriladi." },
    audio: {
      intro: { ru: "У угла А стороны длиннее, у угла Б короче. Не спешите: какой угол больше?", uz: "A burchakning tomonlari uzunroq, B niki qisqaroq. Shoshilmang: qaysi burchak katta?" },
      on_correct: { ru: "Верно, угол Б. А прямой угол очень важен в стройке, чтобы стены стояли ровно.", uz: "To'g'ri, B burchak. To'g'ri burchak esa qurilishda juda muhim, devorlar tik turishi uchun." },
      on_wrong: { ru: "Смотрите на раскрытие, а не на длину сторон.", uz: "Tomon uzunligiga emas, ochilishga qarang." }
    }
  },

  // ===== s9 TEST MC (figure) — qaysi kesma diametr? (M3) =====
  s9: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Радиус или диаметр?', uz: "Radius yoki diametr?" },
    question: { ru: 'Какой отрезок — диаметр?', uz: "Qaysi kesma — diametr?" },
    opt0: { ru: 'Отрезок X (от центра до края)', uz: "X kesma (markazdan chetgacha)" },
    opt1: { ru: 'Отрезок Y (через центр, край-край)', uz: "Y kesma (markazdan o'tib, chet-chet)" },
    correct_text: { ru: 'Верно: диаметр проходит через центр от края до края. X — это радиус.', uz: "To'g'ri: diametr markazdan o'tib, chetdan chetgacha boradi. X — bu radius." },
    wrong_0: { ru: 'X идёт от центра только до края — это радиус, не диаметр.', uz: "X markazdan faqat chetgacha boradi — bu radius, diametr emas." },
    audio: {
      intro: { ru: "На окружности два отрезка. Какой из них диаметр?", uz: "Aylanada ikki kesma bor. Qaysi biri diametr?" },
      on_correct: { ru: "Верно, диаметр идёт через центр.", uz: "To'g'ri, diametr markazdan o'tadi." },
      on_wrong: { ru: "Диаметр проходит через центр, от края до края.", uz: "Diametr markazdan o'tadi, chetdan chetgacha." }
    }
  },

  // ===== s10 TEST NumGeo — radius -> diametr =====
  s10: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'Радиус окружности 5 см. Чему равен диаметр?', uz: "Aylana radiusi 5 sm. Diametr necha sm?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Диаметр в два раза больше радиуса.', uz: "Diametr radiusdan ikki barobar katta." },
    fb_correct: { ru: 'Верно: диаметр равен двум радиусам, это 10 см.', uz: "To'g'ri: diametr ikki radiusga teng, ya'ni 10 sm." },
    audio: {
      intro: { ru: "Радиус окружности пять сантиметров. Чему равен диаметр?", uz: "Aylana radiusi besh santimetr. Diametr necha santimetr?" },
      on_correct: { ru: "Верно, десять сантиметров.", uz: "To'g'ri, o'n santimetr." },
      on_wrong: { ru: "Диаметр в два раза больше радиуса.", uz: "Diametr radiusdan ikki barobar katta." }
    }
  },

  // ===== s11 TEST tasniflash (tap) — to'g'ri burchak / emas [FAKT geometriya] =====
  s11: {
    eyebrow: { ru: 'Разложите по группам', uz: "Guruhlarga ajrating" },
    title: { ru: 'Прямой угол или нет?', uz: "To'g'ri burchakmi yoki yo'q?" },
    lead: { ru: 'Поставьте каждый угол в свою группу.', uz: "Har bir burchakni o'z guruhiga joylang." },
    bin_sq: { ru: 'Прямой угол', uz: "To'g'ri burchak" },
    bin_cu: { ru: 'Не прямой', uz: "To'g'ri emas" },
    tap_prompt: { ru: 'Сначала выберите угол', uz: "Avval burchakni tanlang" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Прямой угол — ровно 90 градусов, как угол квадрата.', uz: "To'g'ri burchak — roppa-rosa to'qson daraja, kvadrat burchagidek." },
    correct_text: { ru: 'Верно! Прямой угол — это 90 градусов.', uz: "To'g'ri! To'g'ri burchak — bu to'qson daraja." },
    fact: { ru: 'Слово геометрия греческое: гео — земля, метрия — измерение. Всё началось с измерения земельных участков.', uz: "Geometriya so'zi yunoncha: geo — yer, metriya — o'lchash. Hammasi yer maydonlarini o'lchashdan boshlangan." },
    audio: {
      intro: { ru: "Поставьте углы по группам: где прямой угол, а где нет. Прямой — это уголок квадрата.", uz: "Burchaklarni guruhlarga joylang: qaysi biri to'g'ri burchak, qaysi biri yo'q. To'g'ri — kvadrat burchagi kabi." },
      on_correct: { ru: "Верно. Прямой угол всегда 90 градусов.", uz: "To'g'ri. To'g'ri burchak har doim to'qson daraja." },
      on_wrong: { ru: "Прямой угол похож на уголок квадрата.", uz: "To'g'ri burchak kvadrat burchagiga o'xshaydi." }
    }
  },

  // ===== s12 CASE intro — Oysha g'ildirak =====
  s12: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Колесо Ойши', uz: "Oyshaning g'ildiragi" },
    lead: { ru: 'У велосипедного колеса Ойши диаметр 60 см. Она хочет узнать радиус.', uz: "Oyshaning velosiped g'ildiragi diametri 60 sm. U radiusni bilmoqchi." },
    note: { ru: 'Чему равен радиус? Вспомним связь диаметра и радиуса.', uz: "Radius necha? Diametr va radius bog'lanishini eslaymiz." },
    hint_calc: { ru: 'Диаметр — это два радиуса. Значит радиус — половина диаметра.', uz: "Diametr — bu ikki radius. Demak radius — diametrning yarmi." },
    btn_help: { ru: 'Помочь Ойше', uz: "Oyshaga yordam berish" },
    audio: { ru: "У колеса Ойши диаметр шестьдесят сантиметров. Она хочет узнать радиус. Вспомните, как связаны диаметр и радиус.", uz: "Oyshaning g'ildiragi diametri oltmish santimetr. U radiusni bilmoqchi. Diametr va radius qanday bog'langanini eslang." }
  },

  // ===== s13 CASE FINAL MC — diametr 60 -> radius 30 [FAKT pi] =====
  s13: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Радиус колеса', uz: "G'ildirak radiusi" },
    question: { ru: 'Диаметр колеса 60 см. Чему равен радиус?', uz: "G'ildirak diametri 60 sm. Radiusi necha sm?" },
    opt0: { ru: '30 см', uz: "30 sm" },
    opt1: { ru: '120 см', uz: "120 sm" },
    opt2: { ru: '60 см', uz: "60 sm" },
    opt3: { ru: '15 см', uz: "15 sm" },
    correct_text: { ru: 'Верно: радиус — половина диаметра, это 30 см.', uz: "To'g'ri: radius — diametrning yarmi, ya'ni 30 sm." },
    wrong_1: { ru: 'Это удвоенный диаметр. А радиус — половина диаметра.', uz: "Bu diametrning ikki barobari. Radius esa — diametrning yarmi." },
    wrong_2: { ru: 'Это сам диаметр. Радиус в два раза меньше.', uz: "Bu diametrning o'zi. Radius ikki barobar kichik." },
    wrong_3: { ru: 'Это четверть. А радиус — половина диаметра.', uz: "Bu chorak. Radius esa — diametrning yarmi." },
    fact: { ru: 'А длина самой окружности примерно в 3,14 раза больше диаметра. Это число называют «пи».', uz: "Aylananing uzunligi esa diametridan taxminan 3,14 barobar katta. Bu son «pi» deb ataladi." },
    audio: {
      intro: { ru: "Последнее задание. Диаметр колеса шестьдесят сантиметров. Чему равен радиус?", uz: "Oxirgi topshiriq. G'ildirak diametri oltmish santimetr. Radiusi necha santimetr?" },
      on_correct: { ru: "Верно, тридцать сантиметров. А длина окружности примерно в три и четырнадцать сотых раза больше диаметра — это число пи.", uz: "To'g'ri, o'ttiz santimetr. Aylana uzunligi esa diametridan taxminan uch butun yuzdan o'n to'rt barobar katta — bu pi soni." },
      on_wrong: { ru: "Радиус — это половина диаметра.", uz: "Radius — diametrning yarmi." }
    }
  },

  // ===== s14 SUMMARY =====
  s14: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Геометрия началась', uz: "Geometriya boshlandi" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Отрезок — два конца, луч — один, прямая — без концов.', uz: "Kesma — ikki uchi, nur — bitta, to'g'ri chiziq — uchsiz." },
    main_2: { ru: 'Угол задаёт раскрытие, а не длина сторон. Прямой угол — 90 градусов.', uz: "Burchakni ochilish belgilaydi, tomon uzunligi emas. To'g'ri burchak — to'qson daraja." },
    main_3: { ru: 'У окружности есть центр и радиус, а диаметр в два раза больше радиуса.', uz: "Aylananing markazi va radiusi bor, diametr esa radiusdan ikki barobar katta." },
    hook_close: { ru: 'Теперь формы вокруг нас не безымянны: это линии, углы и окружности.', uz: "Endi atrofimizdagi shakllar nomsiz emas: bular chiziq, burchak va aylanalar." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Точки и линии из начальной школы.', uz: "Boshlang'ich sinfdagi nuqta va chiziqlar." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Периметр и площадь фигур.', uz: "Figuralarning perimetri va yuzasi." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, мы узнали отрезок, луч и прямую, познакомились с углом и окружностью. Главное про угол — это раскрытие, а диаметр всегда вдвое больше радиуса.", uz: "Demak, kesma, nur va to'g'ri chiziqni bildik, burchak va aylana bilan tanishdik. Burchakda asosiysi — ochilish, diametr esa har doim radiusdan ikki barobar katta." }
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

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
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

const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };

// ============================================================
// DEKOR + MUKOFOT + HOOK animatsiyalari (CSS/SVG, yengil loop)
// ============================================================
const FloatGeo = () => (
  <div className="fg" aria-hidden="true">
    <span className="fg-o fg-1"/><span className="fg-o fg-2"/><span className="fg-o fg-3"/><span className="fg-o fg-4"/>
  </div>
);
// HOOK: aylana, burchak va chiziq birga (geometriya atrofda).
const HookGeo = () => (
  <svg className="hg2" viewBox="0 0 280 116" aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
    <circle cx="48" cy="58" r="30" className="hg2-circ"/>
    <g className="hg2-ang">
      <line x1="120" y1="92" x2="184" y2="92" className="hg2-st"/>
      <line x1="120" y1="92" x2="166" y2="46" className="hg2-st"/>
    </g>
    <line x1="206" y1="36" x2="266" y2="84" className="hg2-line hg2-st"/>
  </svg>
);

// ============================================================
// FAKT-ANIMATSIYALAR (ko'k tema)
// ============================================================
// IT: to'g'ri burchak (qurilish) — go'niya/burchak pulsatsiya.
const AnimRightAngle = () => (
  <svg className="fa-ra" viewBox="0 0 80 80" aria-hidden="true">
    <line x1="16" y1="64" x2="68" y2="64" className="fa-ra-l"/>
    <line x1="16" y1="64" x2="16" y2="12" className="fa-ra-l"/>
    <polyline points="16,46 34,46 34,64" className="fa-ra-sq"/>
  </svg>
);
// Tarix: yer maydonini o'lchash — chiziqli setka pulsatsiya.
const AnimGeoWord = () => (
  <div className="fa-gw" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => <span key={i} className="fa-gw-c" style={{ animationDelay: `${((i % 3) + Math.floor(i / 3)) * 0.2}s` }}/>)}
  </div>
);
// Matematika: aylana + aylanuvchi radius + pi.
const AnimPi = () => (
  <svg className="fa-pi" viewBox="0 0 80 80" aria-hidden="true">
    <circle cx="40" cy="40" r="26" className="fa-pi-c"/>
    <line x1="40" y1="40" x2="66" y2="40" className="fa-pi-r"/>
    <text x="40" y="46" className="fa-pi-t" textAnchor="middle">&#960;</text>
  </svg>
);

// ============================================================
// VIZUALIZATORLAR — LineFig (kesma/nur/chiziq), AngleFig (burchak), CircleFig (aylana)
// ============================================================
const LineFig = ({ kind, success = false }) => {
  const W = 240, H = 56, y = 28, L = 24, R = 216;
  const arrow = (x, dir) => `${x},${y} ${x - dir * 12},${y - 7} ${x - dir * 12},${y + 7}`;
  // To'g'ri javobdan keyin asosiy chiziq va o'q yumshoq yashil bo'ladi (uyg'unlik uchun).
  const strokeStyle = { stroke: success ? '#1F7A4D' : undefined, transition: 'stroke 0.4s ease' };
  const arStyle = { fill: success ? '#1F7A4D' : undefined, transition: 'fill 0.4s ease' };
  return (
    <svg className="gf-l" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      {kind !== 'points' && <line x1={L} y1={y} x2={R} y2={y} className="gf-stroke" style={strokeStyle}/>}
      {(kind === 'segment' || kind === 'points') && <><circle cx={L} cy={y} r="6" className="gf-pt"/><circle cx={R} cy={y} r="6" className="gf-pt"/></>}
      {kind === 'ray' && <><circle cx={L} cy={y} r="6" className="gf-pt"/><polygon points={arrow(R + 2, 1)} className="gf-ar" style={arStyle}/></>}
      {kind === 'line' && <><polygon points={arrow(L - 2, -1)} className="gf-ar" style={arStyle}/><polygon points={arrow(R + 2, 1)} className="gf-ar" style={arStyle}/></>}
    </svg>
  );
};

const AngleFig = ({ deg, len = 78, mark = false, lab, success = false }) => {
  const vx = 84, vy = 120, W = 176, H = 138;
  const rad = deg * Math.PI / 180;
  const x3 = vx + len * Math.cos(rad), y3 = vy - len * Math.sin(rad);
  const arcR = 24;
  const ax = vx + arcR, ay = vy;
  const bx = vx + arcR * Math.cos(rad), by = vy - arcR * Math.sin(rad);
  // To'g'ri javobdan keyin burchak tomonlari yumshoq yashil bo'ladi.
  const strokeStyle = { stroke: success ? '#1F7A4D' : undefined, transition: 'stroke 0.4s ease' };
  const arcStyle = { stroke: success ? '#1F7A4D' : undefined, transition: 'stroke 0.4s ease' };
  return (
    <svg className="gf-a" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <path d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 0 0 ${bx} ${by}`} className="gf-arc" style={arcStyle}/>
      {mark && deg === 90 && <polyline points={`${vx + 17},${vy} ${vx + 17},${vy - 17} ${vx},${vy - 17}`} className="gf-sq"/>}
      <line x1={vx} y1={vy} x2={vx + len} y2={vy} className="gf-stroke" style={strokeStyle}/>
      <line x1={vx} y1={vy} x2={x3} y2={y3} className="gf-stroke" style={strokeStyle}/>
      <circle cx={vx} cy={vy} r="5" className="gf-pt"/>
      {lab && <text x={vx + 2} y={vy + 16} className="gf-lab" textAnchor="middle">{lab}</text>}
    </svg>
  );
};

const CircleFig = ({ r = 52, showR = false, showD = false, radUp = false, rLab, dLab, success = false }) => {
  const S = 150, c = 75;
  // To'g'ri javobdan keyin aylana chizig'i yumshoq yashil bo'ladi.
  const circStyle = { stroke: success ? '#1F7A4D' : undefined, transition: 'stroke 0.4s ease' };
  return (
    <svg className="gf-c" viewBox={`0 0 ${S} ${S}`} width={S} height={S} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <circle cx={c} cy={c} r={r} className="gf-circ" style={circStyle}/>
      {showD && <line x1={c - r} y1={c} x2={c + r} y2={c} className="gf-dia"/>}
      {showR && (radUp
        ? <line x1={c} y1={c} x2={c} y2={c - r} className="gf-rad"/>
        : <line x1={c} y1={c} x2={c + r} y2={c} className="gf-rad"/>)}
      <circle cx={c} cy={c} r="4" className="gf-pt"/>
      {rLab && <text x={radUp ? c + 12 : c + r / 2} y={radUp ? c - r / 2 : c - 7} className="gf-lab" textAnchor="middle">{rLab}</text>}
      {dLab && <text x={c} y={c + 17} className="gf-lab" textAnchor="middle">{dLab}</text>}
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.question))}</h2>
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

// s0 — HOOK (motivatsion). Qaytishda picked TO'LIQ sbros.
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
        <FloatGeo/>
        <Title node={c.title}/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <HookGeo/>
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
        {picked !== null && <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2, textAlign: 'center' }}>{mt(t(c.reveal))}</p>}
      </div>
    </Stage>
  );
};

// s1 — WARM-UP kesma (step: ikki nuqta -> tutashtirish -> kesma). Savolsiz.
// Qadamli izoh tepada YIG'ILADI (joriy qadam ajratiladi) — scrollsiz qolishi uchun (metodist 2026-06-18).
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const kind = step === 0 ? 'points' : 'segment';
  const steps = [c.step_1, c.step_2, c.step_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.title}/>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {steps.map((s, i) => i <= step && (
            <div key={i} className="fade-up" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="mono small" style={{ color: i === step ? T.accent : T.ink3, marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
              <p className="body" style={{ margin: 0, color: i === step ? T.ink : T.ink2, fontWeight: i === step ? 600 : 400 }}>{mt(t(s))}</p>
            </div>
          ))}
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
          <LineFig key={kind} kind={kind}/>
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION chiziqlar (step: kesma -> nur -> to'g'ri chiziq)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const kind = step <= 1 ? 'segment' : (step === 2 ? 'ray' : 'line');
  const lineText = step <= 1 ? c.line_seg : (step === 2 ? c.line_ray : c.line_line);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          <LineFig key={kind} kind={kind}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(lineText))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION burchak (slider, M1)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [deg, setDeg] = useState(45);
  const note = deg < 90 ? c.note_acute : (deg === 90 ? c.note_right : (deg === 180 ? c.note_straight : c.note_obtuse));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <AngleFig deg={deg} len={82} mark={deg === 90}/>
          <p className="small mono" style={{ margin: 0, color: deg === 90 ? T.success : T.accent }}>{deg}&deg;</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}</p>
          <Slider value={deg} min={20} max={180} step={1} onChange={setDeg}/>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', fontWeight: 600, color: deg === 90 ? T.success : T.ink2 }}>{mt(t(note))}</p>
        <p className="small fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: T.ink3 }}>{mt(t(c.warn))}</p>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION aylana (slider radius)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [rr, setRr] = useState(40);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 170 }}>
          <CircleFig r={rr} showR showD rLab="R" dLab="D"/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}</p>
          <Slider value={rr} min={28} max={64} step={2} onChange={setRr}/>
        </div>
        <p className="small fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.line_rel))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 1
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2, c.rule_3, c.rule_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.heading}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s6 — RULE 2 (aylana + TUZOQ, mini ikki burchak)
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.heading}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_1))}</p>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.rule_2))}</p>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <span style={{ width: 54 }}><AngleFig deg={40} len={70} lab="A"/></span>
            <span style={{ width: 54 }}><AngleFig deg={40} len={38} lab="B"/></span>
          </div>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn_1))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST MC (figura nur) M2
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [1, 0, 2]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <LineFig kind="ray" success={solved}/>}/>;
};

// s8 — TEST MC (ikki burchak) M1 [FAKT to'g'ri burchak]
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [2, 0, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const fig = (solved) => (
    <div style={{ display: 'flex', gap: 'clamp(10px, 4vw, 30px)', alignItems: 'flex-end', justifyContent: 'center' }}>
      <span style={{ width: 'clamp(110px, 30vw, 150px)' }}><AngleFig deg={32} len={86} lab="A"/></span>
      <span style={{ width: 'clamp(90px, 24vw, 120px)' }}><AngleFig deg={72} len={46} lab="B" success={solved}/></span>
    </div>
  );
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={fig} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimRightAngle/>}/>}/>;
};

// s9 — TEST MC (qaysi diametr) M3
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [0, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={() => <CircleFig r={54} showR radUp showD rLab="X" dLab="Y"/>}/>;
};

// s10 — TEST NumGeo (radius -> diametr)
const Screen10 = (props) => {
  const c = CONTENT.s10;
  return <NumGeoScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={c} correctValue={10}
    figure={() => <CircleFig r={50} showR rLab="5"/>}/>;
};

// s11 — TEST tasniflash (tap): to'g'ri burchak / emas [FAKT geometriya]
const S11_CARDS = [
  { deg: 90, bin: 'sq' },
  { deg: 45, bin: 'cu' },
  { deg: 90, bin: 'sq' },
  { deg: 130, bin: 'cu' },
  { deg: 90, bin: 'sq' },
  { deg: 60, bin: 'cu' }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11; const sfx = useSfx();
  const audio = useAudio([{ id: 's11_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const allSolved = () => { const o = {}; S11_CARDS.forEach((cd, i) => { o[i] = cd.bin; }); return o; };
  const [assign, setAssign] = useState(() => (wasSolved ? allSolved() : {}));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const tapCard = (i) => {
    if (solved) return;
    setChecked(false);
    if (assign[i]) { setAssign(p => { const n = { ...p }; delete n[i]; return n; }); setSel(null); }
    else { setSel(sel === i ? null : i); }
  };
  const tapBin = (bin) => {
    if (solved || sel === null) return;
    setChecked(false);
    setAssign(p => ({ ...p, [sel]: bin }));
    setSel(null);
  };
  const allAssigned = Object.keys(assign).length === S11_CARDS.length;
  const check = () => {
    if (solved || !allAssigned) return;
    const ok = S11_CARDS.every((cd, i) => assign[i] === cd.bin);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[11].scope, screenIdx: 11, question: c.title[lang], correctAnswer: S11_CARDS.map(cd => cd.bin).join(','), studentAnswer: S11_CARDS.map((_, i) => assign[i] || '').join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const pool = S11_CARDS.map((cd, i) => i).filter(i => !assign[i]);
  const inBin = (bin) => S11_CARDS.map((cd, i) => i).filter(i => assign[i] === bin);
  const chip = (i, placed, extra) => (
    <button key={i} className={`cl-chip cl-chip-fig${extra}`} disabled={solved} onClick={placed ? (e) => { e.stopPropagation(); tapCard(i); } : () => tapCard(i)}>
      <AngleFig deg={S11_CARDS[i].deg} len={26}/>
    </button>
  );
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="cl-pool fade-up delay-1">
          {pool.length === 0 ? <span className="cl-pool-done">{mt(t(c.tap_prompt))}</span> : pool.map(i => chip(i, false, sel === i ? ' cl-chip-sel' : ''))}
        </div>
        <div className="cl-bins fade-up delay-2">
          {['sq', 'cu'].map(bin => (
            <div key={bin} className={`cl-bin${sel !== null ? ' cl-bin-active' : ''}`} onClick={() => tapBin(bin)}>
              <p className="cl-bin-h">{bin === 'sq' ? mt(t(c.bin_sq)) : mt(t(c.bin_cu))}</p>
              <div className="cl-bin-cards">
                {inBin(bin).map(i => {
                  const right = checked && S11_CARDS[i].bin === bin;
                  const bad = checked && !solved && S11_CARDS[i].bin !== bin;
                  return chip(i, true, `${right && solved ? ' cl-chip-ok' : ''}${bad ? ' cl-chip-bad' : ''}`);
                })}
              </div>
            </div>
          ))}
        </div>
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allAssigned} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            <div style={{ marginTop: 12 }}><FactCard text={c.fact} badge={FB_HIST} anim={<AnimGeoWord/>}/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s12 — CASE setup: Oysha g'ildirak
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatGeo/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <CircleFig r={56} showD dLab="60" />
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s13 — CASE FINAL MC (diametr -> radius) [FAKT pi]
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={() => <CircleFig r={54} showD dLab="60"/>} factOnCorrect={<FactCard text={c.fact} badge={FB_MATH} anim={<AnimPi/>}/>}/>;
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <FloatGeo/>
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
export default function GeoIntroLesson({
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
/* MATH: geometriya figuralari (kesma/nur/chiziq, burchak, aylana) + dekor + fakt-anim (geom_5_00). */
/* ============================================================ */
.gf-stroke { stroke: #0E0E10; stroke-width: 3; stroke-linecap: round; fill: none; }
/* LineFig chiziq o'zini chizadi (item 4b) — har remountda (qadam almashganda key bilan) qayta chiziladi */
.gf-l .gf-stroke { stroke-dasharray: 230; stroke-dashoffset: 230; animation: gfDraw 0.55s ease-out forwards; }
@keyframes gfDraw { to { stroke-dashoffset: 0; } }
.gf-pt { fill: #FF4F28; }
.gf-ar { fill: #0E0E10; }
.gf-arc { stroke: #FF4F28; stroke-width: 2.5; fill: none; }
.gf-sq { stroke: #1F7A4D; stroke-width: 2.5; fill: none; }
.gf-lab { fill: #5A5A60; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; }
.gf-circ { stroke: #0E0E10; stroke-width: 3; fill: none; }
.gf-rad { stroke: #FF4F28; stroke-width: 3; stroke-linecap: round; }
.gf-dia { stroke: #019ACB; stroke-width: 3; stroke-linecap: round; }

/* HOOK sahna */
.hg2 { width: 100%; max-width: 300px; }
.hg2-circ { stroke: #FF4F28; stroke-width: 3.5; fill: none; animation: hg2-p 3s ease-in-out infinite; }
.hg2-st { stroke: #0E0E10; stroke-width: 3.5; stroke-linecap: round; }
.hg2-ang { animation: hg2-p 3s ease-in-out infinite 0.5s; }
.hg2-line { animation: hg2-p 3s ease-in-out infinite 1s; }
@keyframes hg2-p { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

/* Dekor — suzuvchi shakllar */
.fg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.fg-o { position: absolute; border: 2px solid rgba(255, 79, 40, 0.18); }
.fg-1 { width: 38px; height: 38px; border-radius: 50%; left: 6%; top: 16%; animation: fg-d 9s ease-in-out infinite; }
.fg-2 { width: 26px; height: 26px; right: 9%; top: 24%; animation: fg-d 11s ease-in-out infinite 1s; }
.fg-3 { width: 30px; height: 30px; border-radius: 50%; right: 14%; bottom: 16%; animation: fg-d 10s ease-in-out infinite 0.6s; }
.fg-4 { width: 20px; height: 20px; left: 12%; bottom: 20%; animation: fg-d 12s ease-in-out infinite 1.6s; }
@keyframes fg-d { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(14deg); } }

/* Tasniflash (tap-to-place) + figura chip */
.cl-pool { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 56px; align-items: center; }
.cl-pool-done { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A7A6A2; }
.cl-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.2vw, 18px); color: #0E0E10; background: #FFFFFF; border: 2px solid #E8E4DC; border-radius: 12px; padding: 8px 13px; cursor: pointer; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.25); transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
.cl-chip:disabled { cursor: default; }
.cl-chip-fig { padding: 4px; width: clamp(54px, 16vw, 68px); }
.cl-chip-fig svg { display: block; width: 100%; height: auto; }
.cl-chip-sel { border-color: #FF4F28; background: #FFE8E1; transform: translateY(-2px) scale(1.05); }
.cl-bins { display: flex; gap: 10px; }
.cl-bin { flex: 1; min-width: 0; border: 2px dashed #D8D3C9; border-radius: 16px; padding: 10px; min-height: 92px; display: flex; flex-direction: column; gap: 8px; cursor: default; transition: border-color 0.15s ease, background 0.15s ease; }
.cl-bin-active { border-color: #FF4F28; background: rgba(255, 79, 40, 0.05); cursor: pointer; }
.cl-bin-h { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 1.8vw, 14px); font-weight: 600; color: #5A5A60; text-align: center; }
.cl-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.cl-chip-in { box-shadow: none; }
.cl-chip-ok { border-color: #1F7A4D; background: #E3F0E8; }
.cl-chip-bad { border-color: #FF4F28; background: #FFE8E1; }

/* Fakt-animatsiyalar */
.fa-ra { width: 100%; height: 100%; }
.fa-ra-l { stroke: #019ACB; stroke-width: 5; stroke-linecap: round; animation: fa-ra-p 2.2s ease-in-out infinite; }
.fa-ra-sq { stroke: #019ACB; stroke-width: 4; fill: none; animation: fa-ra-p 2.2s ease-in-out infinite 0.4s; }
@keyframes fa-ra-p { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.fa-gw { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; width: 100%; height: 100%; padding: 8px; }
.fa-gw-c { background: rgba(1, 154, 203, 0.16); border-radius: 2px; animation: fa-gw-p 2.4s ease-in-out infinite; }
@keyframes fa-gw-p { 0%, 100% { background-color: rgba(1, 154, 203, 0.16); } 50% { background-color: #019ACB; } }
.fa-pi { width: 100%; height: 100%; }
.fa-pi-c { stroke: #019ACB; stroke-width: 4; fill: none; }
.fa-pi-r { stroke: #019ACB; stroke-width: 3; stroke-linecap: round; transform-origin: 40px 40px; animation: fa-pi-spin 4s linear infinite; }
.fa-pi-t { fill: #019ACB; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; }
@keyframes fa-pi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
