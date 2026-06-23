import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Деление десятичных дробей — dec_5_06
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
// NUM INPUT SCREEN — числовой ввод: веди-до-верного + наводящая подсказка, счёт первой попытки.
// ============================================================
const NumInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();
  const correct = Number(correctValue);
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
    const v = parseFloat(String(value).trim().replace(',', '.')); if (isNaN(v)) return;
    const isCorrect = Math.abs(v - correct) < 1e-9;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(v); }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="fade-up">{c.title && <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>}<h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {c.base && <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 }}>{t(c.base)}</span>}
          {c.base && <span className="mop">≈</span>}
          <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};


// ============================================================
// --- POD UROK: dec_5_06 — O'nli kasrlarni bo'lish / Деление десятичных дробей (PROMPT 2026-06-18) ---
// Markaziy misconception M1: "bo'lish doim kichraytiradi" (6 : 0,5 = 12 — KATTA, 6 da 12 ta yarim bor).
// M2: bo'linmada vergulni unutish/noto'g'ri qo'yish. M3: o'nliga bo'lishda vergulni faqat bittasida surish.
// Usul (Haydarov §41, §43): o'nli÷natural — odatdagidek bo'lamiz, bo'linuvchi vergulidan o'tganda
// bo'linmaga vergul qo'yamiz; o'nli÷o'nli — ikkala sonda vergulni bo'luvchi butun bo'lguncha teng
// o'ngga suramiz, so'ng natural songa bo'lamiz (3,12 : 2,6 = 31,2 : 26 = 1,2).
// Vizualizator: protsedura (vergul-surish + bo'lish, step) + MagBar (magnituda: ÷<1 kattalashtiradi).
// Hook (M1): Kamol 6:0,5 ni oltidan kichik deydi. Case: Bahrom sharbatni stakanlarga (7,2 : 0,6).
// Faktlar (DRAFT): 1:3=0,333... cheksiz (Fan) / nolga bo'lib bo'lmaydi (IT) / bo'lish belgisi tarixi (Tarix).
// Bardoshli o'nli-kiritish: DecInputScreen. Butun NumInput: vergulni nechta xona surishni sanash.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'dec_5_06',
  lessonTitle: { ru: 'Деление десятичных дробей', uz: "O'nli kasrlarni bo'lish" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',          scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',        scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',          scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',          scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',          scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',          scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',          scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'NumInputScreen',  scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',          scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',          scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'MCScreen',        scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',          scored: false, scope: null }
];

const CONTENT = {
  // ===== s0 HOOK (M1) =====
  s0: {
    eyebrow: { ru: 'Деление и размер', uz: "Bo'lish va kattalik" },
    title: { ru: 'Деление всегда уменьшает?', uz: "Bo'lish doim kichraytiradimi?" },
    lead: { ru: 'Камол уверен: 6 : 0,5 меньше шести. Так ли это?', uz: "Kamol ishonadi: 6 : 0,5 oltidan kichik. Shundaymi?" },
    opt0: { ru: 'Больше шести', uz: "Oltidan katta" },
    opt1: { ru: 'Меньше шести', uz: "Oltidan kichik" },
    opt2: { ru: 'Ровно шесть', uz: "Roppa-rosa olti" },
    reveal0: { ru: 'Верно. 6 : 0,5 = 12. Мы считаем, сколько половинок в шести, а их двенадцать — больше.', uz: "To'g'ri. 6 : 0,5 = 12. Oltida nechta yarim borligini sanaymiz, ular o'n ikkita — ko'proq." },
    reveal1: { ru: 'Так думают многие, но 6 : 0,5 = 12. В шести помещается двенадцать половинок.', uz: "Ko'pchilik shunday o'ylaydi, lekin 6 : 0,5 = 12. Oltida o'n ikkita yarim joylashadi." },
    reveal2: { ru: 'Почти, но нет: в шести двенадцать половинок, значит 6 : 0,5 = 12.', uz: "Deyarli, lekin yo'q: oltida o'n ikkita yarim bor, demak 6 : 0,5 = 12." },
    audio: { ru: "Камол думает, что деление всегда уменьшает число. Проверим: сколько половинок помещается в шести — больше или меньше шести?", uz: "Kamol bo'lish doim sonni kichraytiradi deb o'ylaydi. Tekshiramiz: oltida nechta yarim joylashadi — oltidan ko'pmi yoki kammi?" }
  },

  // ===== s1 WARM-UP (÷10) =====
  s1: {
    eyebrow: { ru: 'Вспомним прошлый урок', uz: "O'tgan darsni eslaylik" },
    title: { ru: 'Разминка', uz: "Mashq" },
    question: { ru: 'Сколько будет 25 : 10?', uz: "25 : 10 nechaga teng?" },
    opt0: { ru: '2,5', uz: '2,5' },
    opt1: { ru: '25', uz: '25' },
    opt2: { ru: '0,25', uz: '0,25' },
    opt3: { ru: '250', uz: '250' },
    correct_text: { ru: 'Верно: при делении на 10 запятая сдвигается на один разряд влево.', uz: "To'g'ri: 10 ga bo'lganda vergul bir xona chapga suriladi." },
    wrong_1: { ru: 'Запятая не сдвинулась. При делении на 10 она идёт влево.', uz: "Vergul surilmadi. 10 ga bo'lganda u chapga boradi." },
    wrong_2: { ru: 'Это деление на 100. На 10 запятая сдвигается на один разряд.', uz: "Bu 100 ga bo'lish. 10 ga vergul bir xona suriladi." },
    wrong_3: { ru: 'Это умножение. При делении число уменьшается.', uz: "Bu ko'paytirish. Bo'lganda son kichrayadi." },
    audio: {
      intro: { ru: "Вспомним прошлый урок. Сколько будет двадцать пять разделить на десять?", uz: "O'tgan darsni eslaylik. Yigirma beshni o'nga bo'lsak qancha bo'ladi?" },
      on_correct: { ru: "Верно, две целых пять десятых. Запятая сдвинулась влево.", uz: "To'g'ri, ikki butun o'ndan besh. Vergul chapga surildi." },
      on_wrong: { ru: "При делении на десять запятая сдвигается на один разряд влево.", uz: "O'nga bo'lganda vergul bir xona chapga suriladi." }
    }
  },

  // ===== s2 EXPLORATION (3,6 : 3, step) =====
  s2: {
    eyebrow: { ru: 'Делим на целое', uz: "Butun songa bo'lamiz" },
    title: { ru: 'Десятичная на целое', uz: "O'nli kasrni butun songa" },
    lead: { ru: 'Делить почти как обычно. Посмотрим.', uz: "Bo'lish deyarli oddiy. Ko'ramiz." },
    line_problem: { ru: 'Пример: 3,6 : 3', uz: "Misol: 3,6 : 3" },
    line_nat: { ru: 'Делим как обычно: целую часть 3 : 3 = 1.', uz: "Odatdagidek bo'lamiz: butun qism 3 : 3 = 1." },
    line_count: { ru: 'Дошли до запятой — ставим запятую в ответе.', uz: "Vergulga yetdik — javobga vergul qo'yamiz." },
    line_place: { ru: 'Дальше 6 : 3 = 2. Ответ: 1,2.', uz: "Keyin 6 : 3 = 2. Javob: 1,2." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Деление десятичной на целое почти не отличается от обычного. Посмотрим по шагам.",
        "Сначала делим целую часть, как обычные числа.",
        "Как только в делимом дошли до запятой, ставим запятую и в ответе.",
        "Дальше делим оставшиеся знаки. Вот и ответ."
      ],
      uz: [
        "O'nli kasrni butun songa bo'lish oddiy bo'lishdan deyarli farq qilmaydi. Qadam-baqadam ko'ramiz.",
        "Avval butun qismni oddiy sonlardek bo'lamiz.",
        "Bo'linuvchida vergulga yetishimiz bilan javobga ham vergul qo'yamiz.",
        "Keyin qolgan raqamlarni bo'lamiz. Mana javob."
      ]
    }
  },

  // ===== s3 EXPLORATION (3,12 : 2,6, step) — M3 =====
  s3: {
    eyebrow: { ru: 'Делим на десятичную', uz: "O'nliga bo'lamiz" },
    title: { ru: 'Сдвигаем обе запятые', uz: "Ikkala vergulni suramiz" },
    lead: { ru: 'А если делитель тоже дробный?', uz: "Agar bo'luvchi ham kasr bo'lsa-chi?" },
    line_problem: { ru: 'Пример: 3,12 : 2,6', uz: "Misol: 3,12 : 2,6" },
    line_nat: { ru: 'Делитель 2,6 — дробный. Сделаем его целым.', uz: "Bo'luvchi 2,6 — kasr. Uni butun qilamiz." },
    line_count: { ru: 'Сдвигаем запятую в обоих числах на один разряд вправо.', uz: "Ikkala sonda vergulni bir xona o'ngga suramiz." },
    line_place: { ru: 'Получилось 31,2 : 26 = 1,2.', uz: "31,2 : 26 = 1,2 hosil bo'ldi." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Теперь делитель тоже десятичная дробь. Что делать?",
        "Удобнее, когда делитель — целое число. Сделаем его целым.",
        "Для этого сдвигаем запятую в обоих числах одинаково, на один разряд вправо.",
        "Теперь это деление на целое, и мы уже умеем его делать. Вот ответ."
      ],
      uz: [
        "Endi bo'luvchi ham o'nli kasr. Nima qilamiz?",
        "Bo'luvchi butun son bo'lgani qulay. Uni butun qilamiz.",
        "Buning uchun ikkala sonda vergulni bir xil, bir xona o'ngga suramiz.",
        "Endi bu butun songa bo'lish, buni esa bilamiz. Mana javob."
      ]
    }
  },

  // ===== s4 EXPLORATION (slider, M1) =====
  s4: {
    eyebrow: { ru: 'Когда деление увеличивает', uz: "Bo'lish qachon kattalashtiradi" },
    title: { ru: 'Двигай делитель', uz: "Bo'luvchini suring" },
    lead: { ru: 'Делим 6 на разные числа. Сколько раз делитель помещается в шести?', uz: "6 ni turli sonlarga bo'lamiz. Bo'luvchi oltida necha marta joylashadi?" },
    slider_label: { ru: 'Делитель', uz: "Bo'luvchi" },
    note_less: { ru: 'Делитель меньше 1 → результат больше 6.', uz: "Bo'luvchi 1 dan kichik → natija 6 dan katta." },
    note_eq: { ru: 'Делитель равен 1 → результат равен 6.', uz: "Bo'luvchi 1 ga teng → natija 6 ga teng." },
    note_more: { ru: 'Делитель больше 1 → результат меньше 6.', uz: "Bo'luvchi 1 dan katta → natija 6 dan kichik." },
    audio: { ru: "Делить можно и на дробь меньше единицы. Тогда результат становится больше исходного числа. Двигай делитель и проверь.", uz: "Birdan kichik kasrga ham bo'lish mumkin. Shunda natija boshlang'ich sondan katta bo'ladi. Bo'luvchini suring va tekshiring." }
  },

  // ===== s5 RULE 1 =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Деление десятичных дробей', uz: "O'nli kasrlarni bo'lish" },
    rule_label: { ru: 'Запомни', uz: "Yodda tuting" },
    rule_1: { ru: 'На целое: делим как обычно, у запятой делимого ставим запятую в ответе.', uz: "Butun songa: odatdagidek bo'lamiz, bo'linuvchi vergulida javobga vergul qo'yamiz." },
    rule_2: { ru: 'На десятичную: сдвигаем запятую в обоих числах вправо, пока делитель не станет целым.', uz: "O'nliga: bo'luvchi butun bo'lguncha ikkala sonda vergulni o'ngga suramiz." },
    rule_3: { ru: 'Сдвигаем одинаково в делимом и делителе.', uz: "Bo'linuvchi va bo'luvchida bir xil suramiz." },
    rule_4: { ru: 'Дальше это обычное деление на целое число.', uz: "Keyin bu oddiy butun songa bo'lish." },
    audio: { ru: "Итак, при делении на целое запятая в ответе идёт там же, где в делимом. А чтобы поделить на десятичную, сдвигаем обе запятые вправо и делим на целое.", uz: "Demak, butun songa bo'lganda javobdagi vergul bo'linuvchidagidek turadi. O'nliga bo'lish uchun esa ikkala vergulni o'ngga surib, butun songa bo'lamiz." }
  },

  // ===== s6 RULE 2 — TUZOQ =====
  s6: {
    eyebrow: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    heading: { ru: 'Две частые ошибки', uz: "Ikki ko'p uchraydigan xato" },
    warn_1: { ru: 'Сдвигай запятую в обоих числах одинаково, а не в одном.', uz: "Vergulni ikkala sonda bir xil suring, faqat bittasida emas." },
    warn_ex: { ru: 'И не теряй запятую в ответе.', uz: "Va javobdagi vergulni yo'qotmang." },
    warn_2: { ru: 'Деление на число меньше 1 увеличивает результат.', uz: "Birdan kichik songa bo'lish natijani kattalashtiradi." },
    audio: { ru: "Будь внимателен. Сдвигай запятую в делимом и делителе одинаково. И не забывай запятую в ответе. И помни: деление на число меньше единицы увеличивает результат.", uz: "Ehtiyot bo'ling. Vergulni bo'linuvchi va bo'luvchida bir xil suring. Javobdagi vergulni ham unutmang. Va yodda tuting: birdan kichik songa bo'lish natijani kattalashtiradi." }
  },

  // ===== s7 TEST DecInput — 4,8 : 4 = 1,2 =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'Вычисли: 4,8 : 4', uz: "Hisoblang: 4,8 : 4" },
    placeholder: { ru: '0,0', uz: '0,0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Делим как обычно: 4 : 4 = 1, ставим запятую, 8 : 4 = 2. Ответ 1,2.', uz: "Odatdagidek bo'lamiz: 4 : 4 = 1, vergul qo'yamiz, 8 : 4 = 2. Javob 1,2." },
    fb_correct: { ru: 'Верно: 4,8 : 4 = 1,2.', uz: "To'g'ri: 4,8 : 4 = 1,2." },
    audio: {
      intro: { ru: "Вычисли четыре целых восемь десятых разделить на четыре.", uz: "To'rt butun o'ndan sakkizni to'rtga bo'ling." },
      on_correct: { ru: "Верно, одна целая две десятых.", uz: "To'g'ri, bir butun o'ndan ikki." },
      on_wrong: { ru: "Дели как обычно, а на запятой делимого поставь запятую в ответе.", uz: "Odatdagidek bo'ling, bo'linuvchi vergulida javobga vergul qo'ying." }
    }
  },

  // ===== s8 TEST MC — 6 : 0,5 [FAKT 1:3=0,333...] — M1 =====
  s8: {
    eyebrow: { ru: 'Сколько половинок', uz: "Nechta yarim" },
    title: { ru: 'Деление на половину', uz: "Yarimga bo'lish" },
    question: { ru: 'Чему равно 6 : 0,5?', uz: "6 : 0,5 nechaga teng?" },
    opt0: { ru: '12', uz: '12' },
    opt1: { ru: '3', uz: '3' },
    opt2: { ru: '1,2', uz: '1,2' },
    opt3: { ru: '0,5', uz: '0,5' },
    correct_text: { ru: 'Верно: в шести помещается 12 половинок, значит 6 : 0,5 = 12.', uz: "To'g'ri: oltida 12 ta yarim joylashadi, demak 6 : 0,5 = 12." },
    wrong_1: { ru: 'Это половина шести. А мы делим на 0,5: считаем, сколько половинок в шести — их 12.', uz: "Bu oltining yarmi. Biz esa 0,5 ga bo'lyapmiz: oltida nechta yarim borligini sanaymiz — 12 ta." },
    wrong_2: { ru: 'Деление на 0,5 не уменьшает. Сколько половинок в шести? Двенадцать.', uz: "0,5 ga bo'lish kichraytirmaydi. Oltida nechta yarim bor? O'n ikki." },
    wrong_3: { ru: 'Это сам делитель. А результат — сколько раз 0,5 помещается в 6.', uz: "Bu bo'luvchining o'zi. Natija esa — 0,5 oltida necha marta joylashishi." },
    fact: { ru: 'Не всякое деление заканчивается: 1 : 3 = 0,333… и тройки идут бесконечно. Наше деление, к счастью, закончилось.', uz: "Har qanday bo'lish tugamaydi: 1 : 3 = 0,333… va uchlar cheksiz davom etadi. Bizniki, baxtimizga, tugadi." },
    audio: {
      intro: { ru: "Сколько будет шесть разделить на ноль целых пять десятых?", uz: "Oltini nol butun o'ndan beshga bo'lsak qancha bo'ladi?" },
      on_correct: { ru: "Верно, двенадцать. Кстати, не всякое деление заканчивается: один разделить на три даёт бесконечные тройки.", uz: "To'g'ri, o'n ikki. Aytgancha, har qanday bo'lish tugamaydi: birni uchga bo'lsak, uchlar cheksiz chiqadi." },
      on_wrong: { ru: "Посчитай, сколько половинок помещается в шести.", uz: "Oltida nechta yarim joylashishini sanang." }
    }
  },

  // ===== s9 TEST MC — vergul surish (M3) =====
  s9: {
    eyebrow: { ru: 'Сдвиг запятой', uz: "Vergulni surish" },
    title: { ru: 'Как сделать делитель целым', uz: "Bo'luvchini qanday butun qilamiz" },
    question: { ru: 'Как правильно подготовить 3,12 : 2,6?', uz: "3,12 : 2,6 ni qanday to'g'ri tayyorlaymiz?" },
    opt0: { ru: '31,2 : 26', uz: '31,2 : 26' },
    opt1: { ru: '3,12 : 26', uz: '3,12 : 26' },
    opt2: { ru: '31,2 : 2,6', uz: '31,2 : 2,6' },
    opt3: { ru: '312 : 26', uz: '312 : 26' },
    correct_text: { ru: 'Верно: сдвинули запятую в обоих числах на один разряд вправо.', uz: "To'g'ri: ikkala sonda vergulni bir xona o'ngga surdik." },
    wrong_1: { ru: 'Ты сдвинул только в делителе. Сдвигать нужно в обоих числах.', uz: "Siz faqat bo'luvchida surdingiz. Ikkala sonda surish kerak." },
    wrong_2: { ru: 'Ты сдвинул только в делимом. Делитель так и остался дробным.', uz: "Siz faqat bo'linuvchida surdingiz. Bo'luvchi kasrligicha qoldi." },
    wrong_3: { ru: 'Это сдвиг на два разряда. А нужен один — пока делитель не станет целым.', uz: "Bu ikki xona surish. Bitta kerak — bo'luvchi butun bo'lguncha." },
    audio: {
      intro: { ru: "Чтобы делить на десятичную, сделаем делитель целым. Какой вариант верный?", uz: "O'nliga bo'lish uchun bo'luvchini butun qilamiz. Qaysi variant to'g'ri?" },
      on_correct: { ru: "Верно. Обе запятые сдвинули одинаково.", uz: "To'g'ri. Ikkala vergulni bir xil surdik." },
      on_wrong: { ru: "Запятую сдвигают в обоих числах на одинаковое число разрядов.", uz: "Vergulni ikkala sonda bir xil xonaga suriladi." }
    }
  },

  // ===== s10 TEST NumInput — vergulni nechta xona surish (butun) =====
  s10: {
    eyebrow: { ru: 'Сколько разрядов', uz: "Nechta xona" },
    question: { ru: 'На сколько разрядов сдвинуть запятую в обоих числах при делении на 1,25?', uz: "1,25 ga bo'lishda ikkala sonda vergulni nechta xona surish kerak?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Смотри на делитель: у 1,25 два знака после запятой.', uz: "Bo'luvchiga qarang: 1,25 da verguldan keyin ikki raqam." },
    fb_correct: { ru: 'Верно: два разряда, чтобы 1,25 стало 125.', uz: "To'g'ri: ikki xona, 1,25 son 125 bo'lishi uchun." },
    audio: {
      intro: { ru: "На сколько разрядов нужно сдвинуть запятую, чтобы делитель стал целым числом?", uz: "Bo'luvchi butun son bo'lishi uchun vergulni nechta xona surish kerak?" },
      on_correct: { ru: "Верно, два разряда.", uz: "To'g'ri, ikki xona." },
      on_wrong: { ru: "Посчитай знаки после запятой у делителя.", uz: "Bo'luvchining kasr xonalarini sanang." }
    }
  },

  // ===== s11 TEST tasniflash (tap) — natija bo'linuvchidan katta/kichik =====
  s11: {
    eyebrow: { ru: 'Разложи по группам', uz: "Guruhlarga ajrating" },
    title: { ru: 'Больше или меньше делимого?', uz: "Bo'linuvchidan katta yoki kichik?" },
    lead: { ru: 'Поставь каждое частное в свою группу. Считать точно не нужно.', uz: "Har bir bo'linmani o'z guruhiga joylang. Aniq hisoblash shart emas." },
    bin_sq: { ru: 'Больше делимого', uz: "Bo'linuvchidan katta" },
    bin_cu: { ru: 'Меньше делимого', uz: "Bo'linuvchidan kichik" },
    tap_prompt: { ru: 'Сначала выбери запись', uz: "Avval yozuvni tanlang" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Делитель меньше 1 увеличивает, больше 1 — уменьшает.', uz: "Birdan kichik bo'luvchi kattalashtiradi, kattasi — kichraytiradi." },
    correct_text: { ru: 'Верно! Делитель меньше единицы увеличивает результат.', uz: "To'g'ri! Birdan kichik bo'luvchi natijani kattalashtiradi." },
    fact: { ru: 'А на ноль делить нельзя: ни одно число не подходит. Поэтому калькулятор показывает ошибку.', uz: "Nolga esa bo'lib bo'lmaydi: hech qanday son to'g'ri kelmaydi. Shuning uchun kalkulyator xato ko'rsatadi." },
    audio: {
      intro: { ru: "Поставь частные по группам: какое больше делимого, какое меньше. Считать точно не нужно, прикинь.", uz: "Bo'linmalarni guruhlarga joylang: qaysi biri bo'linuvchidan katta, qaysi biri kichik. Aniq hisoblash shart emas, chamalang." },
      on_correct: { ru: "Верно. Делитель меньше единицы всегда увеличивает число.", uz: "To'g'ri. Birdan kichik bo'luvchi sonni doim kattalashtiradi." },
      on_wrong: { ru: "Прикинь: делитель меньше единицы увеличивает.", uz: "Chamalang: birdan kichik bo'luvchi kattalashtiradi." }
    }
  },

  // ===== s12 CASE intro — Bahrom sharbat =====
  s12: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Сок Бахрома', uz: "Bahromning sharbati" },
    lead: { ru: 'Бахром разливает 7,2 литра сока по стаканам по 0,6 литра.', uz: "Bahrom 7,2 litr sharbatni 0,6 litrli stakanlarga quyadi." },
    note: { ru: 'Сколько стаканов получится? Посчитаем.', uz: "Nechta stakan chiqadi? Hisoblaymiz." },
    hint_calc: { ru: 'Объём делят на объём стакана: 7,2 : 0,6.', uz: "Hajm stakan hajmiga bo'linadi: 7,2 : 0,6." },
    btn_help: { ru: 'Помочь Бахрому', uz: "Bahromga yordam berish" },
    audio: { ru: "Бахром разливает семь целых две десятых литра сока по стаканам по ноль целых шесть десятых литра. Подумай, как узнать число стаканов.", uz: "Bahrom yetti butun o'ndan ikki litr sharbatni nol butun o'ndan olti litrli stakanlarga quyadi. Stakanlar sonini qanday topishni o'ylang." }
  },

  // ===== s13 CASE FINAL MC — 7,2 : 0,6 = 12 [FAKT belgisi tarixi] =====
  s13: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Число стаканов', uz: "Stakanlar soni" },
    question: { ru: 'Сколько стаканов? 7,2 : 0,6', uz: "Nechta stakan? 7,2 : 0,6" },
    opt0: { ru: '12', uz: '12' },
    opt1: { ru: '1,2', uz: '1,2' },
    opt2: { ru: '120', uz: '120' },
    opt3: { ru: '6', uz: '6' },
    correct_text: { ru: 'Верно: 72 : 6 = 12 после сдвига запятых. Двенадцать стаканов.', uz: "To'g'ri: vergullarni surgach 72 : 6 = 12. O'n ikki stakan." },
    wrong_1: { ru: 'Ты не сдвинул запятые. Сделай делитель целым: 72 : 6 = 12.', uz: "Vergullarni surmadingiz. Bo'luvchini butun qiling: 72 : 6 = 12." },
    wrong_2: { ru: 'Слишком много. Сдвиг на один разряд: 72 : 6 = 12.', uz: "Juda ko'p. Bir xona surish: 72 : 6 = 12." },
    wrong_3: { ru: 'Это деление на 1,2. А делитель 0,6: 72 : 6 = 12.', uz: "Bu 1,2 ga bo'lish. Bo'luvchi esa 0,6: 72 : 6 = 12." },
    fact: { ru: 'Знак деления в виде двоеточия и обелюс (÷) ввели около 1659 года. В разных странах пишут и так, и так.', uz: "Bo'lish belgisi — ikki nuqta va obelyus (÷) — taxminan 1659-yili kiritilgan. Turli davlatlarda ham unday, ham bunday yoziladi." },
    audio: {
      intro: { ru: "Последнее задание. Семь целых две десятых литра разливают по стаканам по ноль целых шесть десятых. Сколько стаканов?", uz: "Oxirgi topshiriq. Yetti butun o'ndan ikki litr nol butun o'ndan olti litrli stakanlarga quyiladi. Nechta stakan?" },
      on_correct: { ru: "Верно, двенадцать. Кстати, знак деления придумали больше трёхсот лет назад.", uz: "To'g'ri, o'n ikki. Aytgancha, bo'lish belgisini uch yuz yildan ko'proq oldin o'ylab topishgan." },
      on_wrong: { ru: "Сдвинь обе запятые вправо и раздели на целое.", uz: "Ikkala vergulni o'ngga suring va butun songa bo'ling." }
    }
  },

  // ===== s14 SUMMARY =====
  s14: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Делить десятичные не сложно', uz: "O'nli kasrlarni bo'lish qiyin emas" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'На целое: делим как обычно, запятая в ответе — там же, где в делимом.', uz: "Butun songa: odatdagidek bo'lamiz, javobdagi vergul bo'linuvchidagidek turadi." },
    main_2: { ru: 'На десятичную: сдвигаем обе запятые вправо и делим на целое.', uz: "O'nliga: ikkala vergulni o'ngga surib, butun songa bo'lamiz." },
    main_3: { ru: 'Деление на число меньше 1 увеличивает результат.', uz: "Birdan kichik songa bo'lish natijani kattalashtiradi." },
    hook_close: { ru: 'Вот и ответ Камолу: 6 : 0,5 = 12, больше шести.', uz: "Mana Kamolga javob: 6 : 0,5 = 12, oltidan katta." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Деление на 10, 100, 1000 (Урок 25) и умножение десятичных (Урок 26).', uz: "10, 100, 1000 ga bo'lish (25-dars) va o'nli kasrlarni ko'paytirish (26-dars)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Проценты — сотые доли числа.', uz: "Foizlar — sonning yuzdan ulushlari." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, на целое делим как обычно, а на десятичную — сдвигаем обе запятые и делим на целое. И помним: деление на число меньше единицы увеличивает результат.", uz: "Demak, butun songa odatdagidek bo'lamiz, o'nliga esa — ikkala vergulni surib, butun songa bo'lamiz. Va yodda tutamiz: birdan kichik songa bo'lish natijani kattalashtiradi." }
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
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука',    uz: "Bilasizmi? · Fan" };
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

// ============================================================
// FAKT-ANIMATSIYALAR (CSS-only loop, ko'k tema)
// ============================================================
// Fan: 1 : 3 = 0,333... — uchlar cheksiz davom etadi.
const AnimRepeat = () => (
  <div className="pa-rp" aria-hidden="true">
    <span className="pa-rp-h">0,</span>
    {[0, 1, 2, 3].map(i => <span key={i} className="pa-rp-3" style={{ animationDelay: `${i * 0.28}s` }}>3</span>)}
  </div>
);
// IT: nolga bo'lib bo'lmaydi — xato belgisi.
const AnimZeroDiv = () => (
  <div className="pa-zd" aria-hidden="true">
    <span className="pa-zd-eq">6 ÷ 0</span>
    <span className="pa-zd-x">✕</span>
  </div>
);
// Tarix: bo'lish belgisi (obelyus).
const AnimObelus = () => (
  <div className="pa-ob" aria-hidden="true"><span className="pa-ob-s">÷</span></div>
);

// ============================================================
// VIZUALIZATOR — MagBar (magnituda: ÷<1 kattalashtiradi) + DecInputScreen (bardoshli o'nli kiritish)
// ============================================================
const fmtDec = (v) => { const r = Math.round(v * 100) / 100; return String(r).replace('.', ','); };

const MagBar = ({ base, factor }) => {
  const result = Math.round(base * factor * 100) / 100;
  const max = base * 2;
  const pctB = Math.min(100, (base / max) * 100);
  const pctR = Math.min(100, (result / max) * 100);
  const cls = result > base ? ' mb-more' : (result < base ? ' mb-less' : '');
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

// DecInputScreen — o'nli javob: вeди-до-верного + bardoshli tekshiruv (1,2 = 1.2, qiymat bo'yicha).
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

// s0 — HOOK (M1). Qaytishda picked TO'LIQ sbros.
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
          <MagBar base={6} factor={2}/>
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

// s1 — WARM-UP (÷10) QuestionScreen
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (3,6 : 3, step)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <div className="dm-prob">{mt(t(c.line_problem))}</div>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_nat))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_count))}</p>}
          {step >= 3 && <p className="dm-res fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_place))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (3,12 : 2,6, step) — M3
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <div className="dm-prob">{mt(t(c.line_problem))}</div>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_nat))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_count))}</p>}
          {step >= 3 && <p className="dm-res fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_place))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (slider, M1)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [v, setV] = useState(5);
  const d = v / 10;
  const factor = 1 / d;
  const note = d < 1 ? c.note_less : (d > 1 ? c.note_more : c.note_eq);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch', justifyContent: 'center', minHeight: 150 }}>
          <MagBar base={6} factor={factor}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {fmtDec(d)}</p>
          <Slider value={v} min={5} max={20} onChange={setV}/>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: d < 1 ? T.success : (d > 1 ? T.accent : T.ink2), fontWeight: 600 }}>{mt(t(note))}</p>
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
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
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

// s6 — RULE 2 — TUZOQ
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn_1))}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn_ex))}</p>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn_2))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST DecInput: 4,8 : 4 = 1,2
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <DecInputScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={1.2}
    renderVisual={() => <div className="dm-prob">4,8 : 4</div>}/>;
};

// s8 — TEST MC: 6 : 0,5 [FAKT 1:3=0,333...]
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimRepeat/>}/>}/>;
};

// s9 — TEST MC: vergul surish (M3)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — TEST NumInput: vergulni nechta xona surish (butun javob 2)
const Screen10 = (props) => {
  const c = CONTENT.s10;
  return <NumInputScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={c} correctValue={2}
    renderVisual={() => <div className="dm-prob">… : 1,25</div>}/>;
};

// s11 — TEST tasniflash (tap-to-place): natija bo'linuvchidan katta/kichik [FAKT nolga bo'lish]
const S11_CARDS = [
  { label: '6 : 0,5', bin: 'sq' },
  { label: '4 : 0,5', bin: 'sq' },
  { label: '9 : 0,9', bin: 'sq' },
  { label: '6 : 2', bin: 'cu' },
  { label: '8 : 4', bin: 'cu' },
  { label: '10 : 5', bin: 'cu' }
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
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="cl-pool fade-up delay-1">
          {pool.length === 0 ? <span className="cl-pool-done">{mt(t(c.tap_prompt))}</span> : pool.map(i => (
            <button key={i} className={`cl-chip${sel === i ? ' cl-chip-sel' : ''}`} disabled={solved} onClick={() => tapCard(i)}>{S11_CARDS[i].label}</button>
          ))}
        </div>
        <div className="cl-bins fade-up delay-2">
          {['sq', 'cu'].map(bin => (
            <div key={bin} className={`cl-bin${sel !== null ? ' cl-bin-active' : ''}`} onClick={() => tapBin(bin)}>
              <p className="cl-bin-h">{bin === 'sq' ? mt(t(c.bin_sq)) : mt(t(c.bin_cu))}</p>
              <div className="cl-bin-cards">
                {inBin(bin).map(i => {
                  const right = checked && S11_CARDS[i].bin === bin;
                  const bad = checked && !solved && S11_CARDS[i].bin !== bin;
                  return <button key={i} className={`cl-chip cl-chip-in${right && solved ? ' cl-chip-ok' : ''}${bad ? ' cl-chip-bad' : ''}`} disabled={solved} onClick={(e) => { e.stopPropagation(); tapCard(i); }}>{S11_CARDS[i].label}</button>;
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
            <div style={{ marginTop: 12 }}><FactCard text={c.fact} badge={FB_IT} anim={<AnimZeroDiv/>}/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s12 — CASE setup: Bahrom sharbat
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <div className="dm-prob">7,2 : 0,6</div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s13 — CASE FINAL MC: 7,2 : 0,6 = 12 [FAKT belgisi tarixi]
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimObelus/>}/>}/>;
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
export default function DecDivideLesson({
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
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}





/* ============================================================ */
/* MATH: MagBar (magnituda) + bo'lish yozuvi + tasniflash + fakt-anim (dec_5_06). */
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
.cl-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.1vw, 17px); color: #0E0E10; background: #FFFFFF; border: 2px solid #E8E4DC; border-radius: 12px; padding: 8px 12px; cursor: pointer; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.25); transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
.cl-chip:disabled { cursor: default; }
.cl-chip-sel { border-color: #FF4F28; background: #FFE8E1; transform: translateY(-2px) scale(1.05); }
.cl-bins { display: flex; gap: 10px; }
.cl-bin { flex: 1; min-width: 0; border: 2px dashed #D8D3C9; border-radius: 16px; padding: 10px; min-height: 96px; display: flex; flex-direction: column; gap: 8px; cursor: default; transition: border-color 0.15s ease, background 0.15s ease; }
.cl-bin-active { border-color: #FF4F28; background: rgba(255, 79, 40, 0.05); cursor: pointer; }
.cl-bin-h { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.7vw, 13px); font-weight: 600; color: #5A5A60; text-align: center; }
.cl-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.cl-chip-in { box-shadow: none; }
.cl-chip-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; }
.cl-chip-bad { border-color: #FF4F28; background: #FFE8E1; }

/* Fakt-animatsiyalar (ko'k tema) */
.pa-rp { display: flex; align-items: baseline; justify-content: center; gap: 0; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(22px, 6vw, 36px); color: #019ACB; }
.pa-rp-3 { opacity: 0; animation: pa-rp-in 2s ease-in-out infinite; }
@keyframes pa-rp-in { 0% { opacity: 0; } 30%, 80% { opacity: 1; } 100% { opacity: 0; } }
.pa-zd { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 4.5vw, 26px); color: #019ACB; }
.pa-zd-x { position: absolute; font-size: clamp(34px, 9vw, 54px); color: #FF4F28; font-weight: 900; animation: pa-zd-p 1.6s ease-in-out infinite; }
@keyframes pa-zd-p { 0%, 100% { opacity: 0.15; transform: scale(0.8); } 50% { opacity: 0.85; transform: scale(1.05); } }
.pa-ob { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.pa-ob-s { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(44px, 12vw, 70px); color: #019ACB; animation: pa-ob-a 2.4s ease-in-out infinite; }
@keyframes pa-ob-a { 0%, 100% { transform: scale(0.92); } 50% { transform: scale(1.1); } }
`;
