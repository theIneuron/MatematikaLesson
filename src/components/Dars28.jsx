import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Периметр прямоугольника и квадрата — geom_5_01
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
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS: {base}/api/tts?text=<теги+текст, encoded>&g=m|f
// Если в тексте уже есть языковой тег (смешанные языки) — свой не добавляем.
function buildTtsUrl(base, text, lang, gender) {
  const tag = LANG_TAG[lang] || LANG_TAG.ru;
  const raw = String(text);
  const tagged = TAG_RE.test(raw) ? raw : `${tag} ${raw}`;
  const enc = encodeURIComponent(tagged.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
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

  setLang(lang) { this.currentLang = lang; }

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

    const lang = segment.lang || this.currentLang;
    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, lang, gender);
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
// --- POD UROK: geom_5_01 — To'rtburchak va kvadrat perimetri / Периметр прямоугольника и квадрата (PROMPT 2026-06-19) ---
// Markaziy misconception M1: perimetrni yuza bilan chalkashtirish (tomonlarni KO'PAYTIRADI, qo'shish o'rniga).
// M2: faqat ikki tomonni qo'shish (qarama-qarshi tomonlar teng ekanini unutish). M3: kvadratda 4 emas, 2 tomonni hisoblash.
// Darslik: perimetr = barcha tomonlar yig'indisi; to'rtburchak P = 2·(a+b); kvadrat P = 4·a; yuza ≠ perimetr.
// Hook: yangi qahramon (Jasur) to'rtburchak narsa atrofiga panjara/chegara o'rnatmoqchi, lekin tomonlarni KO'PAYTIRADI (= yuza).
// Vizualizator: BorderWalk (to'rtburchak chegarasi + uzluksiz ko'k iz/trace, chumolisiz).
// Etalon: Dars37 (geom) — keep-visible QuestionScreen, NumGeoScreen, FloatFrames ambient, FactCard.
// Faktlar (DRAFT): Misr arqon-o'lchovchilari / asalari oltiburchagi (kam perimetr) / marching ants (IT).
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'geom_5_01',
  lessonTitle: { ru: 'Периметр прямоугольника и квадрата', uz: "To'rtburchak va kvadrat perimetri" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'NumGeoScreen',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {
  // ===== s0 HOOK — Jasur to'rtburchak yer atrofiga panjara, lekin tomonlarni KO'PAYTIRADI (= yuza, M1) =====
  s0: {
    eyebrow: { ru: 'Начало', uz: "Boshlanish" },
    title: { ru: 'Забор Жасура', uz: "Jasurning panjarasi" },
    lead: { ru: 'Жасур ставит забор вокруг прямоугольного огорода: 8 метров и 5 метров. Он умножил 8 на 5 и говорит: «нужно 40 метров забора». Он прав?', uz: "Jasur to'rtburchak tomorqa atrofiga panjara o'rnatyapti: 8 metr va 5 metr. U 8 ni 5 ga ko'paytirdi va «40 metr panjara kerak» deyapti. U haqmi?" },
    opt0: { ru: 'Да, 40 метров', uz: "Ha, 40 metr" },
    opt1: { ru: 'Нет, забор — это длина границы', uz: "Yo'q, panjara — chegara uzunligi" },
    opt2: { ru: 'Не знаю', uz: "Bilmayman" },
    reveal: { ru: 'Забор идёт по границе, а не закрывает поле целиком. Умножение даёт площадь, а нам нужна длина границы. Сегодня разберёмся.', uz: "Panjara chegara bo'ylab boradi, butun maydonni qoplamaydi. Ko'paytirish yuzani beradi, bizga esa chegara uzunligi kerak. Bugun shuni o'rganamiz." },
    audio: { ru: "Жасур ставит забор вокруг огорода восемь на пять метров. Он умножил восемь на пять и говорит, что нужно сорок метров забора. Подумайте, забор идёт по краю или закрывает всё поле?", uz: "Jasur sakkizga besh metrli tomorqa atrofiga panjara o'rnatyapti. U sakkizni beshga ko'paytirdi va qirq metr panjara kerak deyapti. O'ylab ko'ring, panjara chet bo'ylab boradimi yoki butun maydonni qoplaydimi?" }
  },

  // ===== s1 WARM-UP — uchta ketma-ket ko'paytma (✓-fold). Veди-do-vernogo har savolda. =====
  s1: {
    eyebrow: { ru: 'Разминка', uz: "Mashq" },
    title: { ru: 'Быстрый счёт', uz: "Tez hisob" },
    lead: { ru: 'Прежде чем считать заборы, разомнёмся. Сложение и умножение пригодятся.', uz: "Panjaralarni hisoblashdan oldin mashq qilamiz. Qo'shish va ko'paytirish asqotadi." },
    questions: [
      {
        q: { ru: 'Сколько будет 2 × 8?', uz: "2 × 8 nechaga teng?" },
        opts: [{ ru: '16', uz: "16" }, { ru: '10', uz: "10" }, { ru: '18', uz: "18" }, { ru: '14', uz: "14" }],
        correct: 0,
        hint: { ru: 'Это два раза по восемь: 8 и ещё 8.', uz: "Bu ikki marta sakkiz: 8 va yana 8." },
        audio: { ru: "Сколько будет два умножить на восемь?", uz: "Ikkini sakkizga ko'paytirsak nechi bo'ladi?" }
      },
      {
        q: { ru: 'Сколько будет 4 × 7?', uz: "4 × 7 nechaga teng?" },
        opts: [{ ru: '24', uz: "24" }, { ru: '21', uz: "21" }, { ru: '28', uz: "28" }, { ru: '32', uz: "32" }],
        correct: 2,
        hint: { ru: 'Возьмите семь четыре раза подряд.', uz: "Yettini ketma-ket to'rt marta oling." },
        audio: { ru: "А сколько будет четыре умножить на семь?", uz: "To'rtni yettiga ko'paytirsak nechi bo'ladi?" }
      },
      {
        q: { ru: 'Сколько будет 4 × 9?', uz: "4 × 9 nechaga teng?" },
        opts: [{ ru: '32', uz: "32" }, { ru: '36', uz: "36" }, { ru: '45', uz: "45" }, { ru: '40', uz: "40" }],
        correct: 1,
        hint: { ru: 'Возьмите девять четыре раза подряд.', uz: "To'qqizni ketma-ket to'rt marta oling." },
        audio: { ru: "И последнее. Сколько будет четыре умножить на девять?", uz: "Va oxirgisi. To'rtni to'qqizga ko'paytirsak nechi bo'ladi?" }
      }
    ],
    done_label: { ru: 'Вопрос', uz: "Savol" },
    done_ok: { ru: 'верно', uz: "to'g'ri" },
    done_text: { ru: 'Отлично, счёт работает. Теперь идём считать границы фигур.', uz: "Zo'r, hisob ishlayapti. Endi figuralar chegarasini hisoblashga o'tamiz." },
    audio: {
      next: { ru: 'Разомнёмся перед задачами.', uz: "Masalalardan oldin mashq qilamiz." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посчитайте ещё раз спокойно.', uz: "Yana bir bor xotirjam hisoblang." }
    }
  },

  // ===== s2 EXPLORATION — chegara bo'ylab yurish (step), tomonlar yig'indisi 5,8,13,16 =====
  s2: {
    eyebrow: { ru: 'Граница', uz: "Chegara" },
    title: { ru: 'Идём по границе', uz: "Chegara bo'ylab yuramiz" },
    lead: { ru: 'Теперь пройдём по краю прямоугольника со сторонами 5 и 3 и сложим путь.', uz: "Endi 5 va 3 tomonli to'rtburchak chetidan yuramiz va yo'lni qo'shamiz." },
    step_1: { ru: 'Первая сторона: 5. Прошли пять.', uz: "Birinchi tomon: 5. Beshni o'tdik." },
    step_2: { ru: 'Плюс короткая сторона 3. Стало 8.', uz: "Qisqa 3 tomon qo'shildi. 8 bo'ldi." },
    step_3: { ru: 'Плюс ещё длинная сторона 5. Стало 13.', uz: "Yana uzun 5 tomon qo'shildi. 13 bo'ldi." },
    step_4: { ru: 'Плюс последняя сторона 3. Весь путь — 16. Это и есть периметр.', uz: "Oxirgi 3 tomon qo'shildi. Butun yo'l — 16. Mana shu perimetr." },
    btn_step: { ru: 'Следующая сторона', uz: "Keyingi tomon" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Пройдём по краю прямоугольника и будем складывать стороны. Первая сторона пять.",
        "Прибавим короткую сторону три, получилось восемь.",
        "Прибавим вторую длинную сторону пять, получилось тринадцать.",
        "Прибавим последнюю сторону три, получилось шестнадцать. Длина всей границы и есть периметр."
      ],
      uz: [
        "To'rtburchak chetidan yuramiz va tomonlarni qo'shamiz. Birinchi tomon besh.",
        "Qisqa tomon uchni qo'shamiz, sakkiz bo'ldi.",
        "Ikkinchi uzun tomon beshni qo'shamiz, o'n uch bo'ldi.",
        "Oxirgi tomon uchni qo'shamiz, o'n olti bo'ldi. Butun chegara uzunligi perimetr bo'ladi."
      ]
    }
  },

  // ===== s3 EXPLORATION — slider: uzun tomon o'zgaradi; a=b bo'lsa kvadrat =====
  s3: {
    eyebrow: { ru: 'Стороны', uz: "Tomonlar" },
    title: { ru: 'Две пары сторон', uz: "Ikki juft tomon" },
    lead: { ru: 'Итак, у прямоугольника две длинные и две короткие стороны. Двигайте длину и смотрите, что будет.', uz: "Demak, to'rtburchakda ikki uzun va ikki qisqa tomon bor. Bo'yni suring va nima bo'lishini ko'ring." },
    slider_label: { ru: 'Длина', uz: "Bo'y" },
    note_rect: { ru: 'Длинные стороны равны между собой, короткие — тоже.', uz: "Uzun tomonlar o'zaro teng, qisqalar ham." },
    note_square: { ru: 'Все четыре стороны равны — это квадрат!', uz: "Hamma to'rt tomon teng — bu kvadrat!" },
    audio: { ru: "У прямоугольника противоположные стороны равны, это две длинные и две короткие. Двигайте длину. Когда длина станет равна ширине, все стороны сравняются, и получится квадрат.", uz: "To'rtburchakda qarama-qarshi tomonlar teng, ya'ni ikki uzun va ikki qisqa. Bo'yni suring. Bo'y enga teng bo'lganda hamma tomon tenglashadi va kvadrat hosil bo'ladi." }
  },

  // ===== s4 RULE 1 — P = barcha tomonlar; P = 2·(a+b); kvadrat P = 4·a =====
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Как найти периметр', uz: "Perimetrni qanday topamiz" },
    rule_label: { ru: 'Запомните', uz: "Yodda tuting" },
    rule_1: { ru: 'Периметр — это сумма всех сторон фигуры.', uz: "Perimetr — figuraning barcha tomonlari yig'indisi." },
    rule_2: { ru: 'У прямоугольника: P = 2·(a + b), где a и b — длина и ширина.', uz: "To'rtburchakda: P = 2·(a + b), bu yerda a va b — bo'y va en." },
    rule_3: { ru: 'У квадрата все стороны равны: P = 4·a.', uz: "Kvadratda barcha tomon teng: P = 4·a." },
    audio: { ru: "Итак, периметр это сумма всех сторон. У прямоугольника две длины и две ширины, поэтому периметр равен двум суммам стороны а и стороны бэ. А у квадрата все четыре стороны равны, значит периметр равен четырём сторонам.", uz: "Demak, perimetr barcha tomonlar yig'indisi. To'rtburchakda ikki bo'y va ikki en bor, shuning uchun perimetr a tomon va b tomon yig'indisining ikki barobariga teng. Kvadratda esa hamma to'rt tomon teng, ya'ni perimetr to'rt tomonga teng." }
  },

  // ===== s5 RULE 2 — perimetr ≠ yuza (Jasur shu yerda yanglishgan), xulosa frame-tip da =====
  s5: {
    eyebrow: { ru: 'Граница, а не поле', uz: "Chegara, maydon emas" },
    heading: { ru: 'Периметр — это не площадь', uz: "Perimetr — yuza emas" },
    rule_1: { ru: 'Периметр — это длина границы, путь вокруг фигуры. Его складывают.', uz: "Perimetr — chegara uzunligi, figura atrofidagi yo'l. Uni qo'shadilar." },
    rule_2: { ru: 'Площадь — это сколько места внутри. Её находят умножением сторон.', uz: "Yuza — ichidagi joy miqdori. Uni tomonlarni ko'paytirib topadilar." },
    tip: { ru: 'Жасур умножил стороны и получил площадь, а забор идёт по границе. Для забора нужен периметр — стороны складывают.', uz: "Jasur tomonlarni ko'paytirib yuzani topdi, panjara esa chegara bo'ylab boradi. Panjara uchun perimetr kerak — tomonlar qo'shiladi." },
    audio: { ru: "Запомните разницу. Периметр это длина границы, его получают сложением сторон. А площадь это место внутри, её получают умножением. Жасур умножил стороны и нашёл площадь, но для забора нужна именно граница, то есть периметр.", uz: "Farqni yodda tuting. Perimetr chegara uzunligi, uni tomonlarni qo'shib olamiz. Yuza esa ichidagi joy, uni ko'paytirib olamiz. Jasur tomonlarni ko'paytirib yuzani topdi, lekin panjara uchun aynan chegara, ya'ni perimetr kerak." }
  },

  // ===== s6 TEST MC — to'rtburchak 6x4 -> 20 (M1: 24 yuza, M2: 10, +12) =====
  s6: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Периметр прямоугольника', uz: "To'rtburchak perimetri" },
    question: { ru: 'У прямоугольника стороны 6 и 4. Чему равен периметр?', uz: "To'rtburchak tomonlari 6 va 4. Perimetri nechaga teng?" },
    opt0: { ru: '20', uz: "20" },
    opt1: { ru: '24', uz: "24" },
    opt2: { ru: '10', uz: "10" },
    opt3: { ru: '12', uz: "12" },
    correct_text: { ru: 'Верно: 6 + 4 + 6 + 4 = 20. Можно и так: 2·(6 + 4) = 20.', uz: "To'g'ri: 6 + 4 + 6 + 4 = 20. Yoki: 2·(6 + 4) = 20." },
    wrong_1: { ru: 'Это 6 умножить на 4, получилась площадь, а не периметр. Стороны нужно сложить.', uz: "Bu 6 ni 4 ga ko'paytirish, yuza chiqdi, perimetr emas. Tomonlarni qo'shish kerak." },
    wrong_2: { ru: 'Вы сложили только две стороны. У прямоугольника их четыре.', uz: "Siz faqat ikki tomonni qo'shdingiz. To'rtburchakda ular to'rtta." },
    wrong_3: { ru: 'Этого мало. Сложите все четыре стороны прямоугольника.', uz: "Bu kam. To'rtburchakning to'rtala tomonini qo'shing." },
    audio: {
      intro: { ru: "Теперь сами. У прямоугольника стороны шесть и четыре. Чему равен периметр?", uz: "Endi o'zingiz. To'rtburchak tomonlari olti va to'rt. Perimetri nechaga teng?" },
      on_correct: { ru: "Верно, двадцать. Сложили все четыре стороны, шесть плюс четыре плюс шесть плюс четыре, получилось двадцать.", uz: "To'g'ri, yigirma. To'rtta tomonni qo'shdik, olti qo'shamiz to'rt qo'shamiz olti qo'shamiz to'rt, yigirma bo'ldi." },
      on_wrong: { ru: "Сложите все четыре стороны, не умножайте.", uz: "To'rtta tomonni qo'shing, ko'paytirmang." }
    }
  },

  // ===== s7 TEST NumGeo — kvadrat tomoni 7 -> 28 =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'У квадрата сторона 7. Чему равен периметр?', uz: "Kvadrat tomoni 7. Perimetri nechaga teng?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'У квадрата четыре равные стороны. Возьмите сторону четыре раза.', uz: "Kvadratning to'rt teng tomoni bor. Tomonni to'rt marta oling." },
    fb_correct: { ru: 'Верно: 4 умножить на 7 равно 28.', uz: "To'g'ri: 4 ni 7 ga ko'paytirsak 28 bo'ladi." },
    audio: {
      intro: { ru: "А теперь квадрат. Его сторона семь. Чему равен периметр?", uz: "Endi kvadrat. Uning tomoni yetti. Perimetri nechaga teng?" },
      on_correct: { ru: "Верно, двадцать восемь. У квадрата четыре равные стороны, четыре умножить на семь равно двадцать восемь.", uz: "To'g'ri, yigirma sakkiz. Kvadratning to'rt teng tomoni bor, to'rtni yettiga ko'paytirsak yigirma sakkiz bo'ladi." },
      on_wrong: { ru: "У квадрата четыре равные стороны, сложите их.", uz: "Kvadratning to'rt teng tomoni bor, ularni qo'shing." }
    }
  },

  // ===== s8 TEST MC — teskari: P=16, en=3 -> bo'y 5 =====
  s8: {
    eyebrow: { ru: 'Обратная задача', uz: "Teskari masala" },
    title: { ru: 'Найди сторону', uz: "Tomonni toping" },
    question: { ru: 'Периметр прямоугольника 16, ширина 3. Чему равна длина?', uz: "To'rtburchak perimetri 16, eni 3. Bo'yi nechaga teng?" },
    opt0: { ru: '5', uz: "5" },
    opt1: { ru: '13', uz: "13" },
    opt2: { ru: '8', uz: "8" },
    opt3: { ru: '10', uz: "10" },
    correct_text: { ru: 'Верно: две ширины — это 6, значит на две длины осталось 16 − 6 = 10, и одна длина — это 5.', uz: "To'g'ri: ikki en — bu 6, demak ikki bo'yga 16 − 6 = 10 qoldi, bitta bo'y esa 5." },
    wrong_1: { ru: 'Вы вычли только одну ширину, а их две. Вычтите из периметра обе ширины.', uz: "Siz faqat bitta enni ayirdingiz, ular ikkita. Perimetrdan ikkala enni ayiring." },
    wrong_2: { ru: 'Это половина периметра. Но в неё входит и ширина, её ещё нужно вычесть.', uz: "Bu perimetrning yarmi. Lekin unda en ham bor, uni yana ayirish kerak." },
    wrong_3: { ru: 'Это сумма двух длин. Одну длину нужно поделить пополам.', uz: "Bu ikki bo'y yig'indisi. Bitta bo'yni yarmiga bo'lish kerak." },
    audio: {
      intro: { ru: "Задача наоборот. Периметр прямоугольника шестнадцать, ширина три. Чему равна длина?", uz: "Teskari masala. To'rtburchak perimetri o'n olti, eni uch. Bo'yi nechaga teng?" },
      on_correct: { ru: "Верно, пять. Две ширины это шесть, осталось десять на две длины, значит одна длина равна пяти.", uz: "To'g'ri, besh. Ikki en olti, ikki bo'yga o'n qoldi, demak bitta bo'y beshga teng." },
      on_wrong: { ru: "Вычтите обе ширины из периметра, потом поделите на две длины.", uz: "Perimetrdan ikkala enni ayiring, keyin ikki bo'yga bo'ling." }
    }
  },

  // ===== s9 TEST MC — qaysi hisob NOTO'G'RI (yuza hisoblangan) + FactCard FB_HIST (AnimRope) =====
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где ошибка?', uz: "Xato qayerda?" },
    question: { ru: 'Три ученика искали периметр прямоугольника 5 на 3. Кто посчитал НЕправильно?', uz: "Uch o'quvchi 5 ga 3 to'rtburchak perimetrini topdi. Kim NOTO'G'RI hisobladi?" },
    opt0: { ru: 'Камола: 5 + 3 + 5 + 3 = 16', uz: "Kamola: 5 + 3 + 5 + 3 = 16" },
    opt1: { ru: 'Отабек: 5 умножить на 3 = 15', uz: "Otabek: 5 ni 3 ga ko'paytirsak = 15" },
    opt2: { ru: 'Сардор: 2 умножить на (5 + 3) = 16', uz: "Sardor: 2 ni (5 + 3) ga ko'paytirsak = 16" },
    correct_text: { ru: 'Верно: Отабек умножил стороны и нашёл площадь, а не периметр. Правильный периметр — 16.', uz: "To'g'ri: Otabek tomonlarni ko'paytirib yuzani topdi, perimetrni emas. To'g'ri perimetr — 16." },
    wrong_0: { ru: 'Камола сложила все четыре стороны и получила шестнадцать, это верный периметр.', uz: "Kamola to'rtta tomonni qo'shib o'n olti oldi, bu to'g'ri perimetr." },
    wrong_2: { ru: 'Сардор взял 2 умножить на сумму сторон и получил шестнадцать, это верный способ.', uz: "Sardor 2 ni tomonlar yig'indisiga ko'paytirib o'n olti oldi, bu to'g'ri usul." },
    fact: { ru: 'В Древнем Египте землю отмеряли верёвкой с узлами: натягивали её по границе участка. Так измеряли периметр полей.', uz: "Qadimgi Misrda yerni tugunli arqon bilan o'lchashgan: uni yer chegarasi bo'ylab tortishgan. Maydonlar perimetri shunday o'lchangan." },
    audio: {
      intro: { ru: "Три ученика искали периметр прямоугольника пять на три. Найдите того, кто посчитал неправильно.", uz: "Uch o'quvchi besh ga uch to'rtburchak perimetrini topdi. Noto'g'ri hisoblaganini toping." },
      on_correct: { ru: "Верно, ошибся Отабек. Он умножил стороны и получил площадь, а периметр это сумма сторон, шестнадцать.", uz: "To'g'ri, Otabek xato qildi. U tomonlarni ko'paytirib yuzani topdi, perimetr esa tomonlar yig'indisi, o'n olti." },
      on_wrong: { ru: "Периметр складывают. Кто умножил стороны, тот нашёл площадь.", uz: "Perimetrni qo'shadilar. Kim tomonlarni ko'paytirgan bo'lsa, yuzani topgan." }
    }
  },

  // ===== s10 CASE setup — Sevara rasmni lenta bilan o'raydi, 8x5 =====
  s10: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Рамка Севары', uz: "Sevaraning ramkasi" },
    lead: { ru: 'Севара обрамляет фотографию лентой по краю. Фото прямоугольное: 8 см и 5 см.', uz: "Sevara fotosuratni chet bo'ylab lenta bilan o'rayapti. Foto to'rtburchak: 8 sm va 5 sm." },
    note: { ru: 'Сколько ленты нужно, чтобы обойти фото по границе?', uz: "Fotoni chegara bo'ylab aylanib chiqish uchun qancha lenta kerak?" },
    hint_calc: { ru: 'Лента идёт по краю — это периметр. Сложите все четыре стороны.', uz: "Lenta chet bo'ylab boradi — bu perimetr. To'rtta tomonni qo'shing." },
    btn_help: { ru: 'Решить', uz: "Yechish" },
    audio: { ru: "Севара обрамляет фотографию лентой по краю. Фото восемь на пять сантиметров. Подумайте, лента идёт по границе, значит её длина это периметр.", uz: "Sevara fotosuratni chet bo'ylab lenta bilan o'rayapti. Foto sakkizga besh santimetr. O'ylab ko'ring, lenta chegara bo'ylab boradi, demak uning uzunligi perimetr." }
  },

  // ===== s11 TEST MC (case) — lenta uzunligi 8x5 -> 26 + FactCard FB_NATURE (AnimHex) =====
  s11: {
    eyebrow: { ru: 'Итоговое задание', uz: "Topshiriq" },
    title: { ru: 'Длина ленты', uz: "Lenta uzunligi" },
    question: { ru: 'Фото 8 см на 5 см. Сколько ленты нужно на рамку по краю?', uz: "Foto 8 sm ga 5 sm. Chet bo'ylab ramkaga qancha lenta kerak?" },
    opt0: { ru: '26 см', uz: "26 sm" },
    opt1: { ru: '40 см', uz: "40 sm" },
    opt2: { ru: '13 см', uz: "13 sm" },
    opt3: { ru: '18 см', uz: "18 sm" },
    correct_text: { ru: 'Верно: 8 + 5 + 8 + 5 = 26 см. Или 2·(8 + 5) = 26 см.', uz: "To'g'ri: 8 + 5 + 8 + 5 = 26 sm. Yoki 2·(8 + 5) = 26 sm." },
    wrong_1: { ru: 'Это 8 умножить на 5, получилась площадь фото, а не длина рамки.', uz: "Bu 8 ni 5 ga ko'paytirish, foto yuzasi chiqdi, ramka uzunligi emas." },
    wrong_2: { ru: 'Это только две стороны. Лента обходит все четыре.', uz: "Bu faqat ikki tomon. Lenta to'rttasini aylanib chiqadi." },
    wrong_3: { ru: 'Этого не хватит. Сложите все четыре стороны рамки.', uz: "Bu yetmaydi. Ramkaning to'rtala tomonini qo'shing." },
    fact: { ru: 'Пчёлы строят соты шестиугольниками: у такой формы самая короткая граница при той же площади, поэтому экономится воск.', uz: "Asalarilar uyacha hujayralarini oltiburchak qilib quradi: bunday shaklning yuzasi bir xilda chegarasi eng qisqa, shuning uchun mum tejaladi." },
    audio: {
      intro: { ru: "Фото восемь на пять сантиметров. Сколько ленты нужно на рамку по краю?", uz: "Foto sakkizga besh santimetr. Chet bo'ylab ramkaga qancha lenta kerak?" },
      on_correct: { ru: "Верно, двадцать шесть сантиметров. Лента обходит все четыре стороны, восемь плюс пять плюс восемь плюс пять.", uz: "To'g'ri, yigirma olti santimetr. Lenta to'rtta tomonni aylanadi, sakkiz qo'shamiz besh qo'shamiz sakkiz qo'shamiz besh." },
      on_wrong: { ru: "Лента идёт по краю, сложите все четыре стороны.", uz: "Lenta chet bo'ylab boradi, to'rtta tomonni qo'shing." }
    }
  },

  // ===== s12 FINAL MC — kvadrat hovli panjara, tomon 9 -> 36 + FactCard FB_IT (AnimAnts) =====
  s12: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Забор вокруг двора', uz: "Hovli atrofidagi panjara" },
    question: { ru: 'Квадратный двор, сторона 9 м. Сколько метров забора нужно по всему краю?', uz: "Kvadrat hovli, tomoni 9 m. Butun chet bo'ylab necha metr panjara kerak?" },
    opt0: { ru: '36 м', uz: "36 m" },
    opt1: { ru: '81 м', uz: "81 m" },
    opt2: { ru: '18 м', uz: "18 m" },
    opt3: { ru: '27 м', uz: "27 m" },
    correct_text: { ru: 'Верно: у квадрата 4 стороны по 9, значит 4·9 = 36 м.', uz: "To'g'ri: kvadratning 4 tomoni 9 dan, ya'ni 4·9 = 36 m." },
    wrong_1: { ru: 'Это 9 умножить на 9, получилась площадь двора, а забор идёт по границе.', uz: "Bu 9 ni 9 ga ko'paytirish, hovli yuzasi chiqdi, panjara esa chegara bo'ylab boradi." },
    wrong_2: { ru: 'Это только две стороны. У квадрата их четыре.', uz: "Bu faqat ikki tomon. Kvadratning to'rttasi bor." },
    wrong_3: { ru: 'Это три стороны. У квадрата четыре стороны.', uz: "Bu uch tomon. Kvadratning to'rt tomoni bor." },
    fact: { ru: 'В компьютерной графике пунктир, который «бежит» по краю выделенной области, называют «марширующими муравьями» — это и есть его периметр.', uz: "Kompyuter grafikasida tanlangan soha cheti bo'ylab «yuguradigan» punktir «yuruvchi chumolilar» deyiladi — bu uning perimetri." },
    audio: {
      intro: { ru: "Последнее задание. Квадратный двор со стороной девять метров. Сколько метров забора нужно по всему краю?", uz: "Oxirgi topshiriq. Tomoni to'qqiz metr bo'lgan kvadrat hovli. Butun chet bo'ylab necha metr panjara kerak?" },
      on_correct: { ru: "Верно, тридцать шесть метров. У квадрата четыре стороны по девять, четыре умножить на девять равно тридцать шесть.", uz: "To'g'ri, o'ttiz olti metr. Kvadratning to'rt tomoni to'qqizdan, to'rtni to'qqizga ko'paytirsak o'ttiz olti bo'ladi." },
      on_wrong: { ru: "Забор идёт по краю. Сложите четыре стороны квадрата.", uz: "Panjara chet bo'ylab boradi. Kvadratning to'rt tomonini qo'shing." }
    }
  },

  // ===== s13 SUMMARY =====
  s13: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Периметр — это граница', uz: "Perimetr — bu chegara" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Периметр — длина границы фигуры, сумма всех её сторон.', uz: "Perimetr — figura chegarasi uzunligi, barcha tomonlari yig'indisi." },
    main_2: { ru: 'У прямоугольника P = 2·(a + b), у квадрата P = 4·a.', uz: "To'rtburchakda P = 2·(a + b), kvadratda P = 4·a." },
    main_3: { ru: 'Периметр складывают, а площадь — умножают. Это разные вещи.', uz: "Perimetrni qo'shadilar, yuzani esa ko'paytiradilar. Bu ikki xil narsa." },
    hook_close: { ru: 'Теперь ясно: Жасуру нужно не 40, а 26 метров забора — это периметр огорода, а 40 было бы площадью.', uz: "Endi aniq: Jasurga 40 emas, 26 metr panjara kerak — bu tomorqa perimetri, 40 esa yuza bo'lardi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Сложение и умножение, отрезки и стороны фигур.', uz: "Qo'shish va ko'paytirish, kesma va figura tomonlari." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Площадь прямоугольника и квадрата.', uz: "To'rtburchak va kvadrat yuzasi." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, периметр это длина границы, сумма всех сторон. У прямоугольника берут две суммы длины и ширины, а у квадрата четыре стороны. И помните, периметр складывают, а площадь умножают.", uz: "Demak, perimetr chegara uzunligi, barcha tomonlar yig'indisi. To'rtburchakda bo'y va en yig'indisining ikki barobari, kvadratda esa to'rt tomon olinadi. Va yodda tuting, perimetrni qo'shadilar, yuzani ko'paytiradilar." }
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
const FB_IT     = { ru: 'Знаешь ли ты? · IT',         uz: "Bilasizmi? · IT" };
const FB_NATURE = { ru: 'Знаешь ли ты? · Природа',    uz: "Bilasizmi? · Tabiat" };

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
// DEKOR — FloatFrames (suzuvchi kontur-ramkalar, perimetr motivi)
// ============================================================
const FloatFrames = () => (
  <div className="flf" aria-hidden="true">
    <span className="flf-c flf-c1"/>
    <span className="flf-c flf-c2"/>
    <span className="flf-c flf-c3"/>
    <span className="flf-c flf-c4"/>
    <span className="flf-c flf-c5"/>
    <span className="flf-c flf-c6"/>
  </div>
);

// ============================================================
// FAKT-ANIMATSIYALAR (ko'k tema, CSS-only loop)
// ============================================================
// Tarix: Misr tugunli arqoni cho'ziladi (yer chegarasini o'lchash).
const AnimRope = () => (<div className="fa-rp" aria-hidden="true"><span className="fa-rp-cord"><i/><i/><i/><i/></span></div>);
// Tabiat: asalari oltiburchagi — kam perimetr (CSS pulse loop).
const AnimHex = () => (<div className="fa-hx" aria-hidden="true"><span className="fa-hx-cell fa-hx-a"/><span className="fa-hx-cell fa-hx-b"/></div>);
// IT: marching ants — punktir to'rtburchak chegara bo'ylab yuguradi (SVG stroke-dashoffset loop).
const AnimAnts = () => (
  <div className="fa-ma" aria-hidden="true">
    <svg viewBox="0 0 60 44" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect className="fa-ma-rect" x="6" y="6" width="48" height="32" rx="3" fill="none" stroke="#019ACB" strokeWidth="3" strokeDasharray="6 5"/>
    </svg>
  </div>
);

// ============================================================
// VIZUALIZATOR — BorderWalk: to'rtburchak chegarasi + uzluksiz ko'k iz (trace)
// a,b — tomonlar; lit — yoritilgan tomonlar soni (0..4); compact — kichik variant.
// ============================================================
const SIDE_ORDER = ['top', 'right', 'bottom', 'left'];
const BorderWalk = ({ a = 5, b = 3, unit = 'm', lit = 4, compact = false, glow = false, success = false }) => {
  const big = Math.max(a, b);
  const base = compact ? (big >= 8 ? 16 : 22) : (big >= 8 ? 26 : 34);
  const W = Math.round(a * base);
  const H = Math.round(b * base);
  const sides = { top: a, bottom: a, left: b, right: b };
  const isLit = (name) => SIDE_ORDER.indexOf(name) < lit;
  return (
    <div className={`bw-host${glow ? ' bw-glow' : ''}${success ? ' bw-success' : ''}`} aria-hidden="true">
      <div className="bw-rect" style={{ width: W, height: H }}>
        {SIDE_ORDER.map((name, si) => (
          <span key={name} className={`bw-side bw-${name}${isLit(name) ? ' bw-lit' : ''}`}
            style={success ? { animationDelay: `${si * 0.12}s` } : undefined}/>
        ))}
        {SIDE_ORDER.map((name) => (
          <span key={`l-${name}`} className={`bw-len bw-len-${name}${isLit(name) ? ' bw-len-lit' : ''}`}>{sides[name]}{unit}</span>
        ))}
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <FloatFrames/>
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

// s0 — HOOK (Jasur panjara, M1: tomonlarni ko'paytirgan). Qaytishda picked TO'LIQ sbros.
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
        <FloatFrames/>
        <Title node={c.title}/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <BorderWalk a={8} b={5} unit="" lit={4}/>
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
        <FloatFrames/>
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

// s2 — EXPLORATION: chegara bo'ylab yurish (step), tomonlar yig'indisi 5,8,13,16.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step_1, c.step_2, c.step_3, c.step_4];
  const sums = [5, 8, 13, 16];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <FloatFrames/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          <BorderWalk a={5} b={3} unit="" lit={step + 1} glow={step === last}/>
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

// s3 — EXPLORATION: slider bo'y o'zgaradi; a=b bo'lsa kvadrat.
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
        <FloatFrames/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <BorderWalk a={a} b={B} unit="" lit={4} glow={isSquare}/>
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

// s4 — RULE 1: P = barcha tomonlar; P = 2·(a+b); kvadrat P = 4·a.
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2, c.rule_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatFrames/>
        <Title node={c.heading}/>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <BorderWalk a={6} b={4} unit="" lit={4} compact={true}/>
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE 2: perimetr ≠ yuza (Jasur shu yerda yanglishgan). Xulosa frame-tip da.
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatFrames/>
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

// s6 — TEST MC: to'rtburchak 6x4 -> 20 (M1: 24 yuza, M2: 10, +12).
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <BorderWalk a={6} b={4} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>}/>;
};

// s7 — TEST NumGeo: kvadrat tomoni 7 -> 28.
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <NumGeoScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={28}
    figure={(solved) => <BorderWalk a={7} b={7} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>}/>;
};

// s8 — TEST MC: teskari masala, P=16, en=3 -> bo'y 5.
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <BorderWalk a={5} b={3} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>}/>;
};

// s9 — TEST MC: qaysi hisob NOTO'G'RI (Otabek yuza hisobladi). [FAKT Misr arqoni]
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [0, 2, 1]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimRope/>}/>}/>;
};

// s10 — CASE setup: Sevara rasmni lenta bilan o'raydi, 8x5.
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatFrames/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <BorderWalk a={8} b={5} unit="" lit={4}/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s11 — TEST MC (case): lenta uzunligi 8x5 -> 26. [FAKT asalari oltiburchagi]
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const figure = (solved) => <BorderWalk a={8} b={5} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>;
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_NATURE} anim={<AnimHex/>}/>}/>;
};

// s12 — FINAL MC: kvadrat hovli panjara, tomon 9 -> 36. [FAKT marching ants IT]
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h2>);
  const figure = (solved) => <BorderWalk a={9} b={9} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>;
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimAnts/>}/>}/>;
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
        <FloatFrames/>
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

export default function PerimeterLesson({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
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
/* MATH geom_5_01: BorderWalk — to'rtburchak chegarasi + uzluksiz ko'k iz (trace, chumolisiz). */
/* ============================================================ */
.bw-host { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: clamp(20px, 4.5vw, 32px); }
.bw-host.bw-glow .bw-rect { animation: bwGlow 0.8s ease; }
.bw-rect { position: relative; flex-shrink: 0; transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.bw-side { position: absolute; background: #A7A6A2; border-radius: 2px; transition: background 0.3s ease, box-shadow 0.3s ease; }
.bw-top { top: -2px; left: 0; right: 0; height: 4px; }
.bw-bottom { bottom: -2px; left: 0; right: 0; height: 4px; }
.bw-left { left: -2px; top: 0; bottom: 0; width: 4px; }
.bw-right { right: -2px; top: 0; bottom: 0; width: 4px; }
.bw-lit { background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.bw-success .bw-side { background: #1F7A4D; box-shadow: 0 0 8px rgba(31, 122, 77, 0.5); animation: bwEdge 0.5s ease-out both; }
.bw-success .bw-len { color: #1F7A4D; }
@keyframes bwEdge { 0% { opacity: 0.25; box-shadow: 0 0 0 rgba(31, 122, 77, 0); } 60% { opacity: 1; box-shadow: 0 0 12px rgba(31, 122, 77, 0.6); } 100% { opacity: 1; box-shadow: 0 0 8px rgba(31, 122, 77, 0.5); } }
.bw-len { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 2vw, 14px); color: #5A5A60; transition: color 0.3s ease; white-space: nowrap; }
.bw-len-top { bottom: 100%; left: 50%; transform: translate(-50%, -5px); }
.bw-len-bottom { top: 100%; left: 50%; transform: translate(-50%, 5px); }
.bw-len-left { right: 100%; top: 50%; transform: translate(-6px, -50%); }
.bw-len-right { left: 100%; top: 50%; transform: translate(6px, -50%); }
.bw-len-lit { color: #FF4F28; }
.bw-pulse { animation: bwGlow 0.8s ease; }
@keyframes bwGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(255, 79, 40, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }
/* Uzluksiz ko'k iz — chegara bo'ylab aylanadi (kulrang/accent/yashil ustida ham ko'rinadi). */

/* MATH geom_5_01: факт-анимации (CSS-only loop, ko'k tema, qutiga sig'adi). */
/* Misr tugunli arqoni cho'ziladi (Tarix). */
.fa-rp { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.fa-rp-cord { position: relative; width: clamp(56px, 12vw, 84px); height: 4px; background: #019ACB; border-radius: 2px; transform-origin: left center; animation: faRp 3s ease-in-out infinite; }
.fa-rp-cord i { position: absolute; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: #FF4F28; transform: translate(-50%, -50%); }
.fa-rp-cord i:nth-child(1) { left: 0; } .fa-rp-cord i:nth-child(2) { left: 33%; } .fa-rp-cord i:nth-child(3) { left: 66%; } .fa-rp-cord i:nth-child(4) { left: 100%; }
@keyframes faRp { 0% { transform: scaleX(0.35); } 50% { transform: scaleX(1); } 100% { transform: scaleX(0.35); } }
/* Asalari oltiburchagi — kam perimetr (Tabiat). */
.fa-hx { position: relative; width: clamp(72px, 15vw, 100px); height: clamp(64px, 13vw, 90px); display: flex; align-items: center; justify-content: center; }
.fa-hx-cell { position: absolute; width: clamp(34px, 7vw, 46px); height: clamp(38px, 8vw, 52px); background: rgba(1, 154, 203, 0.16); border: 3px solid #019ACB; clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%); }
.fa-hx-a { animation: faHxA 3s ease-in-out infinite; }
.fa-hx-b { transform: translateX(58%) scale(0.78); opacity: 0.45; animation: faHxB 3s ease-in-out infinite; }
@keyframes faHxA { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
@keyframes faHxB { 0%, 100% { transform: translateX(58%) scale(0.76); opacity: 0.4; } 50% { transform: translateX(58%) scale(0.84); opacity: 0.6; } }
/* Marching ants — punktir chegara bo'ylab yuguradi (IT). */
.fa-ma { width: clamp(72px, 15vw, 100px); height: clamp(54px, 11vw, 76px); display: flex; align-items: center; justify-content: center; }
.fa-ma-rect { animation: faMa 1.2s linear infinite; }
@keyframes faMa { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -22; } }

/* MATH geom_5_01: ambient — suzuvchi kontur-ramkalar (perimetr motivi, dekor). */
.flf { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.flf-c { position: absolute; border-radius: 14px; background: transparent; animation: flfFloat 16s ease-in-out infinite; }
.flf-c1 { width: 96px; height: 64px; left: 5%; top: 9%; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.12); animation-delay: 0s; }
.flf-c2 { width: 120px; height: 120px; right: 4%; bottom: 7%; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.12); animation-delay: -5s; }
.flf-c3 { width: 58px; height: 44px; left: 40%; top: 64%; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.10); animation-delay: -9s; }
.flf-c4 { width: 74px; height: 74px; right: 14%; top: 14%; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.10); animation-delay: -3s; }
.flf-c5 { width: 50px; height: 70px; left: 12%; bottom: 16%; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.10); animation-delay: -12s; }
.flf-c6 { width: 66px; height: 50px; left: 64%; top: 30%; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.10); animation-delay: -7s; }
@keyframes flfFloat { 0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); } 33% { transform: translateY(-14px) translateX(8px) rotate(2deg); } 66% { transform: translateY(8px) translateX(-10px) rotate(-2deg); } }
`;
