import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Периметр прямоугольника и квадрата — geom_5_01 (Dars28)
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure }) => {
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
        <div className="fade-up q-collapse" style={solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(16px, 2.6vw, 18px))' } : undefined}>{question}</div>
        {figure && (
          <div className="frame fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            {typeof figure === 'function' ? figure({ solved }) : figure}
          </div>
        )}
        <div className="fade-up delay-1 q-collapse" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, ...(solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(16px, 2.6vw, 18px))' } : null) }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            if (solved) {
              if (i === correctIdx) cls += ' option-correct';
              else if (isWrongPicked) cls += ' option-picked-wrong';
              else cls += ' option-wrong';
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && i === correctIdx ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
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
        <div className="fade-up q-collapse" style={solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(16px, 2.6vw, 18px))' } : undefined}>{c.title && <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>}<h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1 q-collapse" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', ...(solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(16px, 2.6vw, 18px))' } : null) }}>
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
// --- POD UROK: geom_5_01 — Perimetr / Периметр прямоугольника и квадрата (PROMPT 2026-06-15) ---
// Markaziy misconception M1: perimetrni YUZA bilan adashtirish (5x3=15 ni panjara deb olish).
// M2: faqat ikki tomonni qo'shish (5+3=8). Asosiy usul: "chegarani aylanib chiq" — barcha
// tomonlar yig'indisi; keyin to'rtburchak uchun 2x(a+b), kvadrat uchun 4xa (o'quvchi kashf etadi,
// tayyor berilmaydi). Vizualizator BorderWalk: to'rtburchak chegarasi bo'ylab yuradigan Chumoli
// (CSS loop), tomonlar ketma-ket yoritiladi va yig'iladi. Birinchi geometriya darsi.
// SYUJET: loyihaning O'Z original "Chumoli" mascot'i (IP xavfsiz) yo'lboshchi; Bahrom tomorqasiga
// panjara oladi. Case: Dilnoza rasmga lenta o'raydi. Test turlari: warm-up MC / drag (tap+drag) /
// NumInput / fill-blank / find-the-wrong / case MC / final MC. Faktlar (DRAFT, validatsiya kerak):
// Misr arqon-tortuvchilari (Tarix) / asalari oltiburchak kam perimetr (Tabiat) / marching ants (IT).
// ============================================================

const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'geom-5-01-v1',
  lessonTitle: { ru: 'Периметр прямоугольника и квадрата', uz: "To'rtburchak va kvadrat perimetri" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — Bahrom tomorqaga panjara. Tuzoq: yuzani perimetr deb olish (M1). ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title: { ru: 'Сколько забора нужно Бахрому', uz: "Bahromga qancha panjara kerak" },
    lead: {
      ru: 'Бахром хочет огородить грядку забором. Грядка прямоугольная: 5 метров в длину и 3 в ширину. Бахром говорит: «5 умножить на 3 — будет 15, куплю 15 метров забора». Чумоли, наш муравей-проводник, сомневается. Бахром прав?',
      uz: "Bahrom tomorqasiga panjara o'rnatmoqchi. Tomorqa to'rtburchak: bo'yi 5 metr, eni 3 metr. Bahrom: «5 ni 3 ga ko'paytirsam 15 bo'ladi, 15 metr panjara olaman» — deydi. Yo'lboshchimiz Chumoli shubhalanadi. Bahrom haqmi?"
    },
    opt0: { ru: 'Да, нужно 15 метров забора', uz: "Ha, 15 metr panjara kerak" },
    opt1: { ru: 'Нет, забор считается иначе', uz: "Yo'q, panjara boshqacha hisoblanadi" },
    opt2: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    reveal: {
      ru: 'Запомни свой ответ. В конце урока вернёмся к забору Бахрома.',
      uz: "Javobingizni eslab qoling. Dars oxirida Bahromning panjarasiga qaytamiz."
    },
    audio: {
      intro: {
        ru: 'Бахром хочет огородить прямоугольную грядку забором. В длину она пять метров, в ширину три метра. Бахром умножил пять на три и получил пятнадцать, значит думает купить пятнадцать метров забора. Муравей Чумоли сомневается. Как думаешь, прав ли Бахром?',
        uz: "Bahrom to'rtburchak tomorqasiga panjara o'rnatmoqchi. Uning bo'yi besh metr, eni uch metr. Bahrom beshni uchga ko'paytirib o'n besh chiqardi, shuning uchun o'n besh metr panjara olmoqchi. Chumoli ismli chumoli shubhalanadi. Sizningcha, Bahrom haqmi?"
      },
      on_correct: { ru: 'Хорошо. Разберёмся вместе с Чумоли.', uz: "Yaxshi. Chumoli bilan birga aniqlab olamiz." },
      on_wrong:   { ru: 'Хорошо. Разберёмся вместе с Чумоли.', uz: "Yaxshi. Chumoli bilan birga aniqlab olamiz." }
    }
  },

  // ---- s1 WARM-UP — ko'paytirishni eslash (nat_5_04, formulada kerak). scored=false ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Вспомним умножение', uz: "Ko'paytirishni eslaymiz" },
    question: {
      ru: 'Прежде чем считать забор, вспомним умножение из прошлых уроков. Чему равно 2 умножить на 8?',
      uz: "Panjarani hisoblashdan oldin o'tgan darslardagi ko'paytirishni eslaymiz. 2 ni 8 ga ko'paytirsak, necha bo'ladi?"
    },
    opt0: { ru: '16', uz: '16' },
    opt1: { ru: '10', uz: '10' },
    opt2: { ru: '28', uz: '28' },
    opt3: { ru: '6', uz: '6' },
    correct_text: {
      ru: 'Верно. 2 умножить на 8 — это 8, взятое дважды: 16. Скоро умножение пригодится для периметра.',
      uz: "To'g'ri. 2 ni 8 ga ko'paytirish — bu 8 ni ikki marta olish: 16. Tez orada ko'paytirish perimetr uchun asqotadi."
    },
    wrong_0: {
      ru: 'Похоже, ты сложил 2 и 8. А здесь умножение: 8 нужно взять 2 раза, выйдет 16.',
      uz: "Chamasi, 2 va 8 ni qo'shdingiz. Bu yerda ko'paytirish: 8 ni 2 marta olish kerak, 16 chiqadi."
    },
    wrong_1: {
      ru: 'Это похоже на запись цифр рядом. Умножение: 8 плюс 8 равно 16.',
      uz: "Bu raqamlarni yonma-yon yozishga o'xshaydi. Ko'paytirish: 8 qo'shilgan 8 — 16."
    },
    wrong_2: {
      ru: 'Это вычитание. А нам нужно умножение: два раза по 8 будет 16.',
      uz: "Bu ayirish. Bizga ko'paytirish kerak: ikki marta 8 dan — 16."
    },
    audio: {
      intro: {
        ru: 'Сначала разомнёмся. Сколько будет два умножить на восемь? Выбери ответ.',
        uz: "Avval qizishib olamiz. Ikkini sakkizga ko'paytirsak qancha bo'ladi? Javobni tanlang."
      },
      on_correct: { ru: 'Верно. Шестнадцать.', uz: "To'g'ri. O'n olti." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — "chegarani aylanib chiq": Chumoli tomonlarni bittalab yoritadi, yig'adi ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Пройдём вдоль границы', uz: "Chegara bo'ylab yuramiz" },
    lead: {
      ru: 'Вернёмся к грядке. Чтобы узнать длину забора, пройдём вдоль границы вместе с Чумоли. Нажимай — и проходи сторону за стороной.',
      uz: "Tomorqaga qaytamiz. Panjara uzunligini bilish uchun Chumoli bilan birga chegara bo'ylab yuramiz. Bosing — va tomonma-tomon o'ting."
    },
    btn_step: { ru: 'Пройти сторону', uz: "Tomonni o'tish" },
    caps: {
      ru: ['Чумоли стоит в углу. Граница пока не пройдена.', 'Верхняя сторона — 5 метров.', 'Правая сторона — ещё 3 метра, всего 8.', 'Нижняя сторона — ещё 5, всего 13.', 'Левая сторона — ещё 3, всего 16.'],
      uz: ["Chumoli burchakda turibdi. Chegara hali o'tilmadi.", "Yuqori tomon — 5 metr.", "O'ng tomon — yana 3 metr, jami 8.", "Past tomon — yana 5, jami 13.", "Chap tomon — yana 3, jami 16."]
    },
    note: {
      ru: 'Готово. Чумоли обошёл всю границу: 5 плюс 3 плюс 5 плюс 3 — это 16 метров. Вот сколько забора нужно, а не 15.',
      uz: "Tayyor. Chumoli butun chegarani aylandi: 5 qo'shuv 3 qo'shuv 5 qo'shuv 3 — bu 16 metr. Mana shuncha panjara kerak, 15 emas."
    },
    audio: {
      intro: {
        ru: 'Длина забора — это длина всей границы грядки. Давай пройдём её вместе с Чумоли. Нажимай на кнопку и проходи сторону за стороной, складывая длины.',
        uz: "Panjara uzunligi — bu tomorqa butun chegarasining uzunligi. Keling, uni Chumoli bilan birga o'tamiz. Tugmani bosing va tomonlarni birma-bir o'tib, uzunliklarni qo'shing."
      },
      done: {
        ru: 'Чумоли вернулся в тот же угол. Мы сложили все четыре стороны и получили шестнадцать метров. Длина границы и есть периметр.',
        uz: "Chumoli yana o'sha burchakka qaytdi. Biz to'rtala tomonni qo'shib, o'n olti metr oldik. Chegaraning uzunligi — bu perimetr."
      }
    }
  },

  // ---- s3 EXPLORATION — jonli slayder: bo'yni o'zgartirib perimetrni kuzatish; 2 uzun + 2 qisqa ----
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Две длины и две ширины', uz: "Ikki bo'y va ikki en" },
    lead: {
      ru: 'Теперь поэкспериментируй. Ширина остаётся 3 метра, а длину меняй ползунком. Смотри: у прямоугольника две длинных стороны и две коротких.',
      uz: "Endi tajriba qiling. Eni 3 metrligicha qoladi, bo'yni esa slayder bilan o'zgartiring. Qarang: to'rtburchakda ikkita uzun va ikkita qisqa tomon bor."
    },
    hint_move: {
      ru: 'Две стороны по длине и две по ширине. Периметр — это две длины плюс две ширины.',
      uz: "Ikki tomon bo'y bo'yicha, ikki tomon en bo'yicha. Perimetr — bu ikki bo'y qo'shuv ikki en."
    },
    note_full: {
      ru: 'Когда длина равна ширине — это уже квадрат, и все четыре стороны одинаковые.',
      uz: "Bo'y enga teng bo'lsa — bu allaqachon kvadrat, va to'rtala tomon bir xil."
    },
    audio: {
      ru: 'Двигай ползунок и следи за периметром. Ширина не меняется, а длина растёт. Заметь главное: у прямоугольника всегда две одинаковые длинные стороны и две одинаковые короткие. Поэтому периметр — это две длины и две ширины вместе. А если длина станет равна ширине, получится квадрат с четырьмя равными сторонами.',
      uz: "Slayderni suring va perimetrni kuzating. Eni o'zgarmaydi, bo'yi esa o'sadi. Asosiysini sezing: to'rtburchakda doim ikkita bir xil uzun tomon va ikkita bir xil qisqa tomon bo'ladi. Shuning uchun perimetr — bu ikki bo'y va ikki en birgalikda. Agar bo'y enga teng bo'lsa, to'rtala tomoni teng kvadrat hosil bo'ladi."
    }
  },

  // ---- s4 RULE 1 — perimetr = barcha tomonlar; to'rtburchak 2x(a+b), kvadrat 4xa ----
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Правило периметра', uz: 'Perimetr qoidasi' },
    lead: {
      ru: 'Итак, мы открыли правило. Периметр — это длина всей границы, то есть сумма всех сторон.',
      uz: "Demak, biz qoidani kashf qildik. Perimetr — bu butun chegara uzunligi, ya'ni barcha tomonlar yig'indisi."
    },
    rule_main: { ru: 'У прямоугольника: периметр = две длины плюс две ширины', uz: "To'rtburchakda: perimetr = ikki bo'y qo'shuv ikki en" },
    ex_easy: { ru: 'Например, у грядки 5 и 3: периметр = 5 плюс 3 плюс 5 плюс 3 = 16. Короче: 2 умножить на сумму 5 и 3 = 16.', uz: "Masalan, tomorqada 5 va 3: perimetr = 5 qo'shuv 3 qo'shuv 5 qo'shuv 3 = 16. Qisqasi: 2 ni 5 va 3 yig'indisiga ko'paytiramiz = 16." },
    ex_hard: { ru: 'У квадрата все стороны равны, поэтому проще: периметр = сторона, взятая 4 раза.', uz: "Kvadratda barcha tomonlar teng, shuning uchun osonroq: perimetr = tomonni 4 marta olish." },
    note: {
      ru: 'Главное — сложить все стороны границы. Для прямоугольника и квадрата есть короткие записи.',
      uz: "Asosiysi — chegaraning barcha tomonlarini qo'shish. To'rtburchak va kvadrat uchun qisqa yozuvlar bor."
    },
    audio: {
      ru: 'Запомни правило. Периметр это длина всей границы, то есть сумма всех сторон. У прямоугольника две длины и две ширины, поэтому периметр это два раза длина плюс два раза ширина. У квадрата все четыре стороны равны, поэтому периметр это сторона, взятая четыре раза. Главное всегда одно: сложить все стороны границы.',
      uz: "Qoidani eslab qoling. Perimetr bu butun chegara uzunligi, ya'ni barcha tomonlar yig'indisi. To'rtburchakda ikki bo'y va ikki en bor, shuning uchun perimetr ikki marta bo'y qo'shuv ikki marta en. Kvadratda to'rtala tomon teng, shuning uchun perimetr tomonni to'rt marta olish. Asosiysi doim bitta: chegaraning barcha tomonlarini qo'shish."
    }
  },

  // ---- s5 RULE 2 — M1 ogohlantirish: perimetr (chegara) yuza (ichi) EMAS ----
  s5: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    title: { ru: 'Периметр — это не площадь', uz: 'Perimetr — yuza emas' },
    lead: {
      ru: 'Но будь внимателен — вот где ошибся Бахром. Периметр и площадь — это разное.',
      uz: "Lekin ehtiyot bo'ling — Bahrom mana shu yerda adashdi. Perimetr va yuza — bu har xil narsa."
    },
    point1: {
      ru: 'Периметр — это длина границы, мы идём ВОКРУГ фигуры. Сложение сторон.',
      uz: "Perimetr — bu chegara uzunligi, biz shaklning ATROFIDAN yuramiz. Tomonlarni qo'shish."
    },
    point2: {
      ru: 'А 5 умножить на 3 — это площадь, сколько клеток внутри. Это другое.',
      uz: "5 ni 3 ga ko'paytirish esa — bu yuza, ichida nechta katak borligi. Bu boshqa narsa."
    },
    point3: {
      ru: 'Для забора нужна граница, а не серединка. Поэтому 16 метров, а не 15.',
      uz: "Panjara uchun chegara kerak, o'rtasi emas. Shuning uchun 16 metr, 15 emas."
    },
    audio: {
      ru: 'Запомни главное предостережение. Периметр это длина границы, мы идём вокруг фигуры и складываем стороны. А когда мы умножаем длину на ширину, мы считаем площадь, то есть сколько места внутри. Бахром перепутал границу с серединой. Для забора нужна именно граница, поэтому ответ шестнадцать метров, а не пятнадцать.',
      uz: "Asosiy ogohlantirishni eslab qoling. Perimetr bu chegara uzunligi, biz shakl atrofidan yuramiz va tomonlarni qo'shamiz. Bo'yni enga ko'paytirsak esa, yuzani hisoblaymiz, ya'ni ichida qancha joy borligini. Bahrom chegarani o'rta bilan chalkashtirdi. Panjara uchun aynan chegara kerak, shuning uchun javob o'n olti metr, o'n besh emas."
    }
  },

  // ---- s6 TEST drag — BARCHA tomonlarni yig'indiga joylashtir (6,4,6,4=20). practice (M2) ----
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Собери все стороны', uz: "Barcha tomonlarni yig'ing" },
    lead: {
      ru: 'Теперь сам. У прямоугольника длина 6 и ширина 4. Перетащи или нажми и поставь все стороны в окошки, чтобы собрать периметр.',
      uz: "Endi o'zingiz. To'rtburchakning bo'yi 6, eni 4. Perimetrni yig'ish uchun barcha tomonlarni suring yoki bosib oynachalarga joylashtiring."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    tray_label: { ru: 'Перетащи стороны сюда', uz: "Tomonlarni bu yerga torting" },
    slots_label: { ru: 'Периметр = сумма всех сторон', uz: "Perimetr = barcha tomonlar yig'indisi" },
    hint_two: {
      ru: 'Двух сторон мало. У прямоугольника четыре стороны: 6, 4, 6 и 4. Поставь все четыре.',
      uz: "Ikki tomon kam. To'rtburchakda to'rtta tomon bor: 6, 4, 6 va 4. To'rtalasini ham qo'ying."
    },
    hint_area: {
      ru: 'Число 24 — это площадь, 6 умножить на 4. А для периметра складывают стороны, не умножают длину на ширину.',
      uz: "24 soni — bu yuza, 6 ni 4 ga ko'paytirgan. Perimetr uchun esa tomonlar qo'shiladi, bo'y enga ko'paytirilmaydi."
    },
    hint_sum: {
      ru: 'Число 10 — это только две стороны, 6 плюс 4. Нужны все четыре стороны.',
      uz: "10 soni — bu faqat ikki tomon, 6 qo'shuv 4. Hammasi to'rt tomon kerak."
    },
    fb_correct: { ru: 'Верно. 6 плюс 4 плюс 6 плюс 4 — это 20. Все четыре стороны собраны.', uz: "To'g'ri. 6 qo'shuv 4 qo'shuv 6 qo'shuv 4 — bu 20. To'rtala tomon yig'ildi." },
    audio: {
      intro: {
        ru: 'У прямоугольника длина шесть и ширина четыре. Собери периметр: поставь в окошки все четыре стороны, а не только две. Потом нажми проверить.',
        uz: "To'rtburchakning bo'yi olti, eni to'rt. Perimetrni yig'ing: oynachalarga faqat ikkitasini emas, to'rtala tomonni qo'ying. Keyin tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Двадцать. Все стороны на месте.', uz: "To'g'ri. Yigirma. Barcha tomonlar joyida." },
      on_wrong:   { ru: 'Пока не все стороны верны. Посмотри подсказку.', uz: "Hozircha tomonlar to'g'ri emas. Maslahatga qarang." }
    }
  },

  // ---- s7 TEST NumInput — kvadrat tomoni 7 -> perimetr 28. practice ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Периметр квадрата', uz: 'Kvadrat perimetri' },
    question: {
      ru: 'Клумба квадратная, сторона 7 метров. Чему равен периметр в метрах?',
      uz: "Gulzor kvadrat shaklida, tomoni 7 metr. Perimetri necha metr?"
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'У квадрата все четыре стороны равны. Возьми сторону столько раз, сколько у квадрата сторон, и сложи их.',
      uz: "Kvadratning to'rtala tomoni teng. Tomonni kvadratdagi tomonlar soniga ko'paytiring va ularni qo'shing."
    },
    fb_correct: { ru: 'Верно. 7 умножить на 4 — это 28 метров.', uz: "To'g'ri. 7 ni 4 ga ko'paytirsak — 28 metr." },
    audio: {
      intro: {
        ru: 'Клумба квадратная, сторона семь метров. Чему равен периметр? У квадрата все стороны одинаковые, возьми сторону четыре раза. Введи число.',
        uz: "Gulzor kvadrat shaklida, tomoni yetti metr. Perimetri qancha? Kvadratda barcha tomonlar bir xil, tomonni to'rt marta oling. Sonni kiriting."
      },
      on_correct: { ru: 'Верно. Двадцать восемь.', uz: "To'g'ri. Yigirma sakkiz." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s8 TEST fill-blank — 2x(box+3)=16 -> tomon 5. practice (M2) ----
  s8: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Найди длину стороны', uz: 'Tomon uzunligini toping' },
    lead: {
      ru: 'У прямоугольника периметр 16 метров, а ширина 3 метра. Какова длина? Заполни пропуск.',
      uz: "To'rtburchakning perimetri 16 metr, eni 3 metr. Bo'yi qancha? Bo'sh joyni to'ldiring."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Периметр это две длины и две ширины. Возьми половину периметра — это одна длина и одна ширина вместе. Потом вычти из неё ширину, останется длина.',
      uz: "Perimetr ikki bo'y va ikki endan iborat. Perimetrning yarmini oling — bu bitta bo'y va bitta en birga. Keyin undan enni ayiring, bo'y qoladi."
    },
    fb_correct: { ru: 'Верно. 5 плюс 3 это 8, а две такие пары дают 16. Длина 5.', uz: "To'g'ri. 5 qo'shuv 3 — bu 8, ikki shunday juft 16 beradi. Bo'yi 5." },
    audio: {
      intro: {
        ru: 'У прямоугольника периметр шестнадцать метров, ширина три метра. Найди длину. Половина периметра это одна длина и одна ширина вместе. Введи число.',
        uz: "To'rtburchakning perimetri o'n olti metr, eni uch metr. Bo'yini toping. Perimetrning yarmi — bu bitta bo'y va bitta en birgalikda. Sonni kiriting."
      },
      on_correct: { ru: 'Верно. Пять.', uz: "To'g'ri. Besh." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s9 TEST find-the-wrong — XATO hisobni top (yuza-perimetr chalkashligi). practice + FAKT Tarix ----
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    title: { ru: 'Где спрятана ошибка', uz: 'Xato qayerda yashiringan' },
    q_pre: { ru: 'Один из расчётов ', uz: 'Hisoblardan biri ' },
    q_em:  { ru: 'ОШИБОЧЕН', uz: 'XATO' },
    q_post: { ru: '. Найди именно его.', uz: ". Aynan o'shani toping." },
    opt0: { ru: 'Прямоугольник 5 и 2: периметр 14', uz: "To'rtburchak 5 va 2: perimetr 14" },
    opt1: { ru: 'Квадрат со стороной 3: периметр 12', uz: "Tomoni 3 kvadrat: perimetr 12" },
    opt2: { ru: 'Прямоугольник 6 и 4: периметр 24', uz: "To'rtburchak 6 va 4: perimetr 24" },
    opt3: { ru: 'Квадрат со стороной 5: периметр 20', uz: "Tomoni 5 kvadrat: perimetr 20" },
    correct_text: {
      ru: 'Верно, ошибка здесь. 24 — это площадь, 6 умножить на 4. А периметр это 6 плюс 4 плюс 6 плюс 4 — это 20.',
      uz: "To'g'ri, xato shu. 24 — bu yuza, 6 ni 4 ga ko'paytirgan. Perimetr esa 6 qo'shuv 4 qo'shuv 6 qo'shuv 4 — bu 20."
    },
    wrong_0: {
      ru: 'Здесь сложили все четыре стороны прямоугольника, и сумма сошлась. Этот расчёт верный, ошибка в другом.',
      uz: "Bu yerda to'rtburchakning to'rtala tomoni qo'shilgan va yig'indi to'g'ri chiqqan. Bu hisob to'g'ri, xato boshqasida."
    },
    wrong_1: {
      ru: 'У квадрата сложили все четыре равные стороны, и сумма сошлась. Этот расчёт верный, ищи ошибку дальше.',
      uz: "Kvadratning to'rtala teng tomoni qo'shilgan va yig'indi to'g'ri chiqqan. Bu hisob to'g'ri, xatoni boshqa joydan qidiring."
    },
    wrong_2: {
      ru: 'И здесь сложили все четыре равные стороны квадрата, сумма сошлась. Расчёт верный, ошибка не здесь.',
      uz: "Bu yerda ham kvadratning to'rtala teng tomoni qo'shilgan, yig'indi to'g'ri chiqqan. Hisob to'g'ri, xato bu yerda emas."
    },
    fact: {
      ru: 'В Древнем Египте после разлива Нила границы полей измеряли верёвкой с узлами — её называли натянутой верёвкой. Значит, периметр люди измеряли уже тысячи лет назад.',
      uz: "Qadimgi Misrda Nil toshganidan keyin dala chegaralarini tugunli arqon bilan o'lchashgan — uni tortilgan arqon deyishgan. Demak, perimetrni odamlar ming yillar oldin ham o'lchagan."
    },
    audio: {
      intro: {
        ru: 'Здесь вопрос наоборот. Один расчёт ошибочен. Найди именно ошибочный и выбери его.',
        uz: "Bu yerda savol teskari. Bitta hisob xato. Aynan xato bo'lganini toping va tanlang."
      },
      on_correct: {
        ru: 'Верно. Двадцать четыре это площадь, а не периметр. Кстати, в Древнем Египте границы полей измеряли верёвкой с узлами, поэтому периметр люди умели находить ещё тысячи лет назад.',
        uz: "To'g'ri. Yigirma to'rt bu yuza, perimetr emas. Aytgancha, qadimgi Misrda dala chegaralarini tugunli arqon bilan o'lchashgan, shuning uchun perimetrni odamlar ming yillar oldin ham topa olgan."
      },
      on_wrong: { ru: 'Этот расчёт верный. Ошибка в другом.', uz: "Bu hisob to'g'ri. Xato boshqasida." }
    }
  },

  // ---- s10 CASE setup — Dilnoza rasmga lenta (8x5) ----
  s10: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Лента для фоторамки', uz: 'Foto ramka uchun lenta' },
    lead: {
      ru: 'Дилноза обрамляет фотографию лентой по краю. Фото прямоугольное: 8 сантиметров в длину и 5 в ширину. Сколько ленты нужно на всю рамку?',
      uz: "Dilnoza fotosuratni chekkasi bo'ylab lenta bilan bezamoqda. Foto to'rtburchak: bo'yi 8 santimetr, eni 5 santimetr. Butun ramka uchun necha santimetr lenta kerak?"
    },
    note: {
      ru: 'Лента идёт по самому краю — по границе фото. Значит, это снова периметр.',
      uz: "Lenta aynan chekka bo'ylab — fotoning chegarasi bo'ylab ketadi. Demak, bu yana perimetr."
    },
    hint_calc: {
      ru: 'Сложи все четыре стороны: 8 плюс 5 плюс 8 плюс 5. Или короче: 2 умножить на сумму 8 и 5.',
      uz: "To'rtala tomonni qo'shing: 8 qo'shuv 5 qo'shuv 8 qo'shuv 5. Yoki qisqasi: 2 ni 8 va 5 yig'indisiga ko'paytiring."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: 'Дилноза обрамляет фотографию лентой по самому краю. Фото прямоугольное, в длину восемь сантиметров и в ширину пять. Лента идёт по границе фото, значит это снова периметр. Чтобы узнать длину ленты, сложи все четыре стороны.',
      uz: "Dilnoza fotosuratni aynan chekka bo'ylab lenta bilan bezamoqda. Foto to'rtburchak, bo'yi sakkiz santimetr, eni besh. Lenta foto chegarasi bo'ylab ketadi, demak bu yana perimetr. Lenta uzunligini bilish uchun to'rtala tomonni qo'shing."
    }
  },

  // ---- s11 TEST case MC — lenta uzunligi? -> 26. practice + FAKT Tabiat. correct (shuffle) ----
  s11: {
    eyebrow: { ru: 'Решение задачи', uz: 'Masala yechimi' },
    title: { ru: 'Сколько ленты нужно', uz: 'Qancha lenta kerak' },
    lead: {
      ru: 'Фото 8 на 5 сантиметров. Сколько сантиметров ленты нужно на всю рамку?',
      uz: "Foto 8 ga 5 santimetr. Butun ramka uchun necha santimetr lenta kerak?"
    },
    opt0: { ru: '26', uz: '26' },
    opt1: { ru: '40', uz: '40' },
    opt2: { ru: '13', uz: '13' },
    opt3: { ru: '18', uz: '18' },
    correct_text: {
      ru: 'Верно. 8 плюс 5 плюс 8 плюс 5 — это 26 сантиметров ленты.',
      uz: "To'g'ri. 8 qo'shuv 5 qo'shuv 8 qo'shuv 5 — bu 26 santimetr lenta."
    },
    wrong_0: {
      ru: 'Это площадь, длину умножили на ширину. А лента идёт по границе, поэтому стороны нужно сложить, а не умножать.',
      uz: "Bu yuza, bo'y enga ko'paytirilgan. Lenta esa chegara bo'ylab ketadi, shuning uchun tomonlarni qo'shish kerak, ko'paytirish emas."
    },
    wrong_1: {
      ru: 'Так сложили только две стороны. У рамки их четыре, сложи все четыре стороны.',
      uz: "Bunda faqat ikki tomon qo'shilgan. Ramkada esa to'rtta tomon bor, to'rtala tomonni qo'shing."
    },
    wrong_2: {
      ru: 'Это близко, но учтены не все стороны. Сложи все четыре стороны рамки.',
      uz: "Bu yaqin, lekin barcha tomon hisobga olinmagan. Ramkaning to'rtala tomonini qo'shing."
    },
    fact: {
      ru: 'Пчёлы строят соты шестиугольниками: у такой формы граница самая короткая при той же площади, поэтому уходит меньше воска. Природа сама экономит периметр.',
      uz: "Asalarilar uyachalarini oltiburchak qilib quradi: shu shaklda bir xil yuzada chegara eng qisqa, shuning uchun kamroq mum ketadi. Tabiat o'zi perimetrni tejaydi."
    },
    audio: {
      intro: {
        ru: 'Фото восемь на пять сантиметров. Сколько ленты нужно на всю рамку? Лента идёт по границе, сложи все стороны и выбери ответ.',
        uz: "Foto sakkiz ga besh santimetr. Butun ramka uchun qancha lenta kerak? Lenta chegara bo'ylab ketadi, barcha tomonlarni qo'shing va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Двадцать шесть сантиметров. Кстати, пчёлы строят соты шестиугольниками, потому что у такой формы граница самая короткая при той же площади, и воска уходит меньше.',
        uz: "To'g'ri. Yigirma olti santimetr. Aytgancha, asalarilar uyachalarni oltiburchak qilib quradi, chunki shu shaklda bir xil yuzada chegara eng qisqa bo'ladi va mum kamroq ketadi."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s12 CASE/FINAL MC — kvadrat hovli tomoni 9 -> panjara 36. final + FAKT IT. M1+M2 ----
  s12: {
    eyebrow: { ru: 'Итоговая задача', uz: 'Yakuniy masala' },
    title: { ru: 'Забор вокруг двора', uz: 'Hovli atrofidagi panjara' },
    lead: {
      ru: 'Последняя задача. Двор квадратный, сторона 9 метров. Сколько метров забора нужно вокруг двора?',
      uz: "Oxirgi masala. Hovli kvadrat shaklida, tomoni 9 metr. Hovli atrofiga necha metr panjara kerak?"
    },
    opt0: { ru: '36', uz: '36' },
    opt1: { ru: '81', uz: '81' },
    opt2: { ru: '18', uz: '18' },
    opt3: { ru: '27', uz: '27' },
    correct_text: {
      ru: 'Верно. У квадрата 9 плюс 9 плюс 9 плюс 9 — это 36 метров. Или 9, взятое 4 раза.',
      uz: "To'g'ri. Kvadratda 9 qo'shuv 9 qo'shuv 9 qo'shuv 9 — bu 36 metr. Yoki 9 ni 4 marta olish."
    },
    wrong_0: {
      ru: 'Это площадь, сторону умножили саму на себя. А забор идёт по границе, поэтому возьми сторону столько раз, сколько у квадрата сторон.',
      uz: "Bu yuza, tomon o'ziga ko'paytirilgan. Panjara esa chegara bo'ylab ketadi, shuning uchun tomonni kvadratdagi tomonlar soniga ko'paytiring."
    },
    wrong_1: {
      ru: 'Так взяли только две стороны. У квадрата их четыре, возьми сторону четыре раза.',
      uz: "Bunda faqat ikki tomon olingan. Kvadratda to'rtta tomon bor, tomonni to'rt marta oling."
    },
    wrong_2: {
      ru: 'Так взяли три стороны, а у квадрата их четыре. Возьми сторону столько раз, сколько у квадрата сторон.',
      uz: "Bunda uch tomon olingan, kvadratda esa ular to'rtta. Tomonni kvadratdagi tomonlar soniga ko'paytiring."
    },
    fact: {
      ru: 'В графических редакторах выделение обводит пунктир, который бежит по краю, — его так и зовут «марширующие муравьи». Этот пунктир проходит ровно по периметру выделения. Совсем как наш Чумоли.',
      uz: "Grafik muharrirlarda tanlovni chekka bo'ylab yuguradigan punktir o'rab oladi — uni «yuruvchi chumolilar» deb atashadi. Bu punktir aynan tanlov perimetri bo'ylab o'tadi. Xuddi bizning Chumoli kabi."
    },
    audio: {
      intro: {
        ru: 'Последняя задача. Двор квадратный, сторона девять метров. Сколько забора нужно вокруг двора? Это периметр квадрата, посчитай и выбери ответ.',
        uz: "Oxirgi masala. Hovli kvadrat shaklida, tomoni to'qqiz metr. Hovli atrofiga qancha panjara kerak? Bu kvadrat perimetri, hisoblang va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Тридцать шесть метров. Кстати, в графических редакторах выделение обводит бегущий пунктир, его называют марширующими муравьями, и он проходит ровно по периметру, совсем как наш Чумоли.',
        uz: "To'g'ri. O'ttiz olti metr. Aytgancha, grafik muharrirlarda tanlovni yuguradigan punktir o'rab oladi, uni yuruvchi chumolilar deyishadi, va u aynan perimetr bo'ylab o'tadi, xuddi bizning Chumoli kabi."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s13 SUMMARY — Bahrom hookini yopadi + ConnectionsBlock ----
  s13: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    heading: { ru: 'Что мы узнали', uz: 'Biz nimani bilib oldik' },
    title: {
      ru: 'Вернёмся к забору Бахрома.',
      uz: "Bahromning panjarasiga qaytamiz."
    },
    main_label: { ru: 'Главное', uz: 'Asosiy' },
    main_1: { ru: 'Периметр — это длина всей границы, то есть сумма всех сторон фигуры.', uz: "Perimetr — bu butun chegara uzunligi, ya'ni shaklning barcha tomonlari yig'indisi." },
    main_2: {
      ru: 'У прямоугольника: две длины плюс две ширины. У квадрата: сторона, взятая 4 раза.',
      uz: "To'rtburchakda: ikki bo'y qo'shuv ikki en. Kvadratda: tomonni 4 marta olish."
    },
    main_3: {
      ru: 'Периметр — это граница, а не серединка. Не путай его с площадью.',
      uz: "Perimetr — bu chegara, o'rtasi emas. Uni yuza bilan chalkashtirmang."
    },
    hook_close: {
      ru: 'Грядка 5 на 3: периметр это 5 плюс 3 плюс 5 плюс 3, то есть 16 метров забора, а не 15. Бахром посчитал площадь, а нужна была граница.',
      uz: "Tomorqa 5 ga 3: perimetr — bu 5 qo'shuv 3 qo'shuv 5 qo'shuv 3, ya'ni 16 metr panjara, 15 emas. Bahrom yuzani hisobladi, chegara esa kerak edi."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: '«Умножение столбиком», периметр из 4 класса.',
      uz: "«Ustun shaklida ko'paytirish», 4-sinf perimetri."
    },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'площадь прямоугольника: сколько клеток помещается ВНУТРИ границы.',
      uz: "to'rtburchak yuzasi: chegara ICHIGA nechta katak sig'adi."
    },
    score_label: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: {
      ru: 'Подведём итог. Периметр это длина всей границы, то есть сумма всех сторон. У прямоугольника это две длины и две ширины, у квадрата это сторона, взятая четыре раза. И помни: периметр это граница, а не серединка, не путай его с площадью. Поэтому у грядки пять на три периметр шестнадцать метров, а не пятнадцать. Бахром посчитал площадь, а для забора нужна была граница.',
      uz: "Xulosa qilamiz. Perimetr bu butun chegara uzunligi, ya'ni barcha tomonlar yig'indisi. To'rtburchakda bu ikki bo'y va ikki en, kvadratda bu tomonni to'rt marta olish. Va esda tuting: perimetr bu chegara, o'rtasi emas, uni yuza bilan chalkashtirmang. Shuning uchun besh ga uch tomorqada perimetr o'n olti metr, o'n besh emas. Bahrom yuzani hisobladi, panjara uchun esa chegara kerak edi."
    }
  }

};

// ============================================================
// MAJBURIY YORDAMCHILAR (infrastructure_v1 / Dars26 bilan baytma-bayt)
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

// Ustuvor javob tekshiruvi QIYMAT bo'yicha: butun/o'nli (0,5=0.5).
const parseAnswerValue = (raw) => {
  const s = String(raw).trim().replace(',', '.');
  if (s === '') return null;
  const mf = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (mf) { const d = Number(mf[2]); if (d === 0) return null; return { n: Number(mf[1]), d }; }
  const num = Number(s);
  if (!isNaN(num)) return { n: num, d: 1 };
  return null;
};
const answerEq = (raw, target) => {
  const a = parseAnswerValue(raw); if (!a) return false;
  const tg = parseAnswerValue(target); if (!tg) return false;
  return a.n * tg.d === tg.n * a.d;
};

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-harakat siyrak ekranlar uchun: yumshoq suzuvchi konturli to'rtburchaklar (perimetr motifi).
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
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_HIST   = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_IT     = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_NATURE = { ru: 'Знаешь ли ты? · Природа',  uz: "Bilasizmi? · Tabiat" };

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

// Misr arqon-tortuvchilari — tugunli arqon cho'ziladi (CSS loop).
const AnimRope = () => (<div className="fa-rp" aria-hidden="true"><span className="fa-rp-cord"><i/><i/><i/><i/></span></div>);
// Asalari oltiburchagi — kam perimetr (CSS pulse loop).
const AnimHex = () => (<div className="fa-hx" aria-hidden="true"><span className="fa-hx-cell fa-hx-a"/><span className="fa-hx-cell fa-hx-b"/></div>);
// Marching ants — punktir to'rtburchak chegara bo'ylab yuguradi (SVG stroke-dashoffset loop).
const AnimAnts = () => (
  <div className="fa-ma" aria-hidden="true">
    <svg viewBox="0 0 60 44" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect className="fa-ma-rect" x="6" y="6" width="48" height="32" rx="3" fill="none" stroke="#019ACB" strokeWidth="3" strokeDasharray="6 5"/>
    </svg>
  </div>
);

// ============================================================
// VIZUALIZATORLAR — geom_5_01 (BorderWalk: chegara + yuruvchi Chumoli)
// ============================================================
// Chumoli (ant) mascot — kichik SVG, qutiga sig'adi.
const AntMascot = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <ellipse cx="12" cy="5.2" rx="2.3" ry="2.3" fill="#0E0E10"/>
    <ellipse cx="12" cy="11" rx="2.7" ry="2.9" fill="#FF4F28"/>
    <ellipse cx="12" cy="17.8" rx="3.1" ry="3.3" fill="#0E0E10"/>
    <g stroke="#0E0E10" strokeWidth="1.2" strokeLinecap="round">
      <line x1="9.6" y1="9.2" x2="5.6" y2="7.2"/><line x1="9.6" y1="11" x2="5.2" y2="11"/><line x1="9.6" y1="12.8" x2="5.6" y2="14.8"/>
      <line x1="14.4" y1="9.2" x2="18.4" y2="7.2"/><line x1="14.4" y1="11" x2="18.8" y2="11"/><line x1="14.4" y1="12.8" x2="18.4" y2="14.8"/>
      <line x1="10.7" y1="3.4" x2="9.6" y2="1.6"/><line x1="13.3" y1="3.4" x2="14.4" y2="1.6"/>
    </g>
  </svg>
);

// Perimetr vizualizatori: to'rtburchak + chegara bo'ylab yuruvchi Chumoli (CSS loop).
// a,b — tomonlar; lit — yoritilgan tomonlar soni (0..4); square — kvadrat; compact — kichik variant.
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
        <span className="bw-ant"><AntMascot/></span>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (panjara). Qaytish: picked TO'LIQ sbros.
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
        <FloatFrames/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', padding: 'clamp(16px, 2.8vw, 24px) clamp(10px, 2vw, 16px)', display: 'flex', justifyContent: 'center' }}>
          <BorderWalk a={5} b={3} unit="" lit={4}/>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
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

// s1 — WARM-UP (ko'paytirishni eslash, scored emas) QuestionScreen orqali (correct C)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (chegarani aylanib chiq: lit 0..4, captions, sum)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const MAX = 4;
  const [lit, setLit] = useState(0);
  const doneAnnouncedRef = useRef(false);
  const caps = c.caps[lang] || c.caps.ru;
  const done = lit >= MAX;
  const SIDES = [5, 3, 5, 3];
  const total = SIDES.slice(0, lit).reduce((s, v) => s + v, 0);
  const step = () => {
    if (done) return;
    const nv = lit + 1;
    setLit(nv);
    if (nv >= MAX && !doneAnnouncedRef.current) {
      doneAnnouncedRef.current = true;
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.done[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatFrames/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up bw-pulse' : 'frame fade-up'} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <BorderWalk a={5} b={3} unit="" lit={lit} glow={done}/>
          <div className="bw-calc">
            {SIDES.map((v, i) => (
              <span key={i} className="bw-calc-grp">
                {i > 0 && <span className="bw-calc-op">+</span>}
                <span className={i < lit ? 'bw-calc-on' : 'bw-calc-off'}>{v}</span>
              </span>
            ))}
            <span className="bw-calc-op">=</span>
            <span className="bw-calc-res">{lit > 0 ? total : '?'}</span>
          </div>
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={step} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[lit])}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (jonli slayder: bo'y o'zgaradi, en=3)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const B = 3;
  const [a, setA] = useState(5);
  const per = 2 * (a + B);
  const isSquare = a === B;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatFrames/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <BorderWalk a={a} b={B} unit="" lit={4} glow={isSquare}/>
          <div className="bw-calc">
            <span className="bw-calc-op">2</span><span className="bw-calc-op">×</span>
            <span className="bw-calc-grp">(<span className="bw-calc-on">{a}</span><span className="bw-calc-op">+</span><span className="bw-calc-on">{B}</span>)</span>
            <span className="bw-calc-op">=</span>
            <span className="bw-calc-res">{per}</span>
          </div>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative' }}><Slider value={a} min={2} max={8} step={1} onChange={setA}/></div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: isSquare ? T.success : T.ink2, fontWeight: isSquare ? 600 : 400 }}>{mt(t(isSquare ? c.note_full : c.hint_move))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE 1 (perimetr = barcha tomonlar) + ambient
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatFrames/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <BorderWalk a={5} b={3} unit="" lit={4} compact={true}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_hard))}</p>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (M1: perimetr yuza emas) + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <FloatFrames/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point1))}</p>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.point2))}</p>
        </div>
        <div className="frame-soft fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point3))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST drag/tap: BARCHA tomonlarni joylashtir (6,4,6,4 = 20)
const TRAY6 = [{ id: 'p1', val: 6 }, { id: 'p2', val: 4 }, { id: 'a1', val: 24 }, { id: 'p3', val: 6 }, { id: 's1', val: 10 }, { id: 'p4', val: 4 }];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const SLOTS = ['k1', 'k2', 'k3', 'k4'];
  const wasSolved = storedAnswer?.solved === true;
  const solvedFill = { k1: 'p1', k2: 'p2', k3: 'p3', k4: 'p4' };
  const [place, setPlace] = useState(() => (wasSolved ? solvedFill : { k1: null, k2: null, k3: null, k4: null }));
  const [held, setHeld] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [hintKind, setHintKind] = useState(null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const usedIds = Object.values(place).filter(Boolean);
  const chipById = (id) => TRAY6.find(ch => ch.id === id);
  const putInSlot = (slot, chipId) => {
    if (solved || !chipId) return;
    setPlace(prev => {
      const n = { ...prev };
      for (const k of SLOTS) if (n[k] === chipId) n[k] = null;
      n[slot] = chipId;
      return n;
    });
    setHeld(null); setHintKind(null);
  };
  const clearSlot = (slot) => { if (solved) return; setPlace(prev => ({ ...prev, [slot]: null })); setHintKind(null); };
  const tapChip = (id) => { if (solved || usedIds.includes(id)) return; setHeld(h => (h === id ? null : id)); };
  const tapSlot = (slot) => {
    if (solved) return;
    if (held) putInSlot(slot, held);
    else if (place[slot]) clearSlot(slot);
  };
  const allFilled = SLOTS.every(k => place[k]);
  const check = () => {
    if (solved || !allFilled) return;
    const vals = SLOTS.map(k => chipById(place[k]).val);
    const total = vals.reduce((s, v) => s + v, 0);
    const ok = total === 20;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHintKind(null); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[6].scope, screenIdx: 6, question: c.lead[lang], correctAnswer: '20', studentAnswer: String(total), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setHintKind(vals.includes(24) ? 'area' : (vals.includes(10) ? 'sum' : 'two'));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const hintText = hintKind === 'area' ? c.hint_area : (hintKind === 'sum' ? c.hint_sum : c.hint_two);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <div className="fade-up q-collapse" style={solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(10px, 1.8vw, 14px))' } : undefined}>
          <h2 className="title h-title" style={{ margin: '0 0 8px' }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="frame fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
          <BorderWalk a={6} b={4} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', alignItems: 'center' }}>
          <p className="small mono" style={{ margin: 0, color: T.ink2 }}>{t(c.slots_label)}</p>
          <div className="dg-slots">
            {SLOTS.map((k, i) => {
              const ch = place[k] ? chipById(place[k]) : null;
              return (
                <span key={k} className="dg-slotgrp">
                  {i > 0 && <span className="dg-plus">+</span>}
                  <button className={`dg-slot${ch ? ' dg-slot-full' : ''}${solved ? ' dg-slot-ok' : ''}`} disabled={solved}
                    onClick={() => tapSlot(k)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); putInSlot(k, held); }}>
                    {ch ? ch.val : ''}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{t(c.tray_label)}</p>
            <div className="dg-tray">
              {TRAY6.map(ch => {
                const used = usedIds.includes(ch.id);
                return (
                  <button key={ch.id} className={`dg-chip${held === ch.id ? ' dg-held' : ''}${used ? ' dg-used' : ''}`} disabled={used}
                    draggable={!used} onDragStart={() => setHeld(ch.id)} onClick={() => tapChip(ch.id)}>
                    {ch.val}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {hintKind && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(hintText))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allFilled} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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

// s7 — TEST NumInput: kvadrat tomoni 7 -> perimetr 28
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <NumInputScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={28} renderVisual={({ solved }) => <BorderWalk a={7} b={7} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>}/>;
};

// s8 — TEST fill-blank: 2 × (box + 3) = 16 -> tomon 5
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const TARGET = '5';
  const wasSolved = storedAnswer?.solved === true;
  const [value, setValue] = useState(wasSolved ? TARGET : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    if (value.trim() === '') return;
    const isCorrect = answerEq(value, TARGET);
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = value.trim(); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <div className="fade-up q-collapse" style={solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(12px, 2.2vw, 16px))' } : undefined}>
          <h2 className="title h-title" style={{ margin: '0 0 8px' }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        </div>
        {solved && (
          <div className="frame fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <BorderWalk a={5} b={3} unit="" lit={4} success={true} compact={true}/>
          </div>
        )}
        <div className="fade-up delay-1 q-collapse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(7px, 1.4vw, 11px)', flexWrap: 'wrap', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 'clamp(17px, 3.2vw, 24px)', ...(solved ? { maxHeight: 0, opacity: 0, overflow: 'hidden', marginBottom: 'calc(-1 * clamp(12px, 2.2vw, 16px))' } : null) }}>
          <span>2</span>
          <span className="mop" style={{ fontSize: 'clamp(15px, 2.4vw, 20px)' }}>×</span>
          <span>(</span>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(72px, 16vw, 96px)' }}/>
          <span className="mop" style={{ fontSize: 'clamp(15px, 2.4vw, 20px)' }}>+</span>
          <span>3)</span>
          <span className="mop" style={{ fontSize: 'clamp(15px, 2.4vw, 20px)' }}>=</span>
          <span>16</span>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.ink2 }}><IconNo/></span>
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

// s9 — TEST find-the-wrong (correct = 6&4 -> 24) + Fakt Tarix
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [2, 0, 3, 1]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.q_pre)}<span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimRope/>}/>}/>;
};

// s10 — CASE setup (Dilnoza rasmga lenta 8x5)
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatFrames/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 2.8vw, 24px) clamp(10px, 2vw, 16px)' }}>
          <BorderWalk a={8} b={5} unit="" lit={4}/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s11 — TEST case MC: lenta 8,5 -> 26 (correct A->shuffle) + Fakt Tabiat
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.lead))}</h2></>);
  const figure = ({ solved }) => <BorderWalk a={8} b={5} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>;
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_NATURE} anim={<AnimHex/>}/>}/>;
};

// s12 — CASE/FINAL MC: kvadrat 9 -> 36 (correct A->shuffle D) + Fakt IT
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.lead))}</h2></>);
  const figure = ({ solved }) => <BorderWalk a={9} b={9} unit="" lit={solved ? 4 : 0} success={solved} compact={true}/>;
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimAnts/>}/>}/>;
};

// s13 — SUMMARY + hook yopilishi + bog'lanishlar + ambient
const Screen13 = ({ screen, onPrev, onReset, finishLesson, answers }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const total = scoredIdx.length;
  const correct = scoredIdx.filter(i => (answers || [])[i] && (answers || [])[i].correct === true).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <FloatFrames/>
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
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="mono" style={{ color: T.success, fontWeight: 700, fontSize: 'clamp(20px, 4vw, 28px)' }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT
// ============================================================
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

/* Collapse-on-correct: вопрос/варианты сворачиваются, остаётся фигура + разбор. */
.q-collapse { max-height: 1200px; transition: max-height 0.45s ease-out, opacity 0.3s ease-out, margin-bottom 0.45s ease-out; }

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


/* MATH geom_5_01: BorderWalk — to'rtburchak chegarasi + yuruvchi Chumoli (CSS loop). */
.bw-host { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: clamp(20px, 4.5vw, 32px); }
.bw-host.bw-glow .bw-rect { animation: bwGlow 0.8s ease; }
.bw-rect { position: relative; flex-shrink: 0; }
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
.bw-ant { position: absolute; top: 0; left: 0; transform: translate(-50%, -50%); z-index: 3; display: flex; animation: bwWalk 7s linear infinite; }
@keyframes bwWalk { 0% { left: 0%; top: 0%; } 25% { left: 100%; top: 0%; } 50% { left: 100%; top: 100%; } 75% { left: 0%; top: 100%; } 100% { left: 0%; top: 0%; } }
.bw-pulse { animation: bwGlow 0.8s ease; }
@keyframes bwGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(255, 79, 40, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }

/* MATH geom_5_01: bw-calc — tomonlar yig'indisi (yoritilgani accent, qolgani xira). */
.bw-calc { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.8vw, 20px); flex-wrap: wrap; justify-content: center; }
.bw-calc-grp { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); }
.bw-calc-op { color: #A7A6A2; }
.bw-calc-on { color: #FF4F28; }
.bw-calc-off { color: #A7A6A2; opacity: 0.5; }
.bw-calc-res { color: #019ACB; min-width: 1.2em; text-align: center; }

/* MATH geom_5_01: drag/tap — tomonlarni oynachalarga joylash (touch: tap, desktop: drag). */
.dg-slots { display: flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); flex-wrap: wrap; justify-content: center; }
.dg-slotgrp { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); }
.dg-plus { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #A7A6A2; font-size: clamp(16px, 2.6vw, 20px); }
.dg-slot { width: clamp(46px, 10vw, 60px); height: clamp(46px, 10vw, 60px); border-radius: 12px; border: 2px dashed #A7A6A2; background: #F6F4EF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.4vw, 24px); color: #0E0E10; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
.dg-slot:hover:not(:disabled) { border-color: #FF4F28; }
.dg-slot-full { border-style: solid; border-color: #FF4F28; background: #FFFFFF; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.18); }
.dg-slot-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; }
.dg-slot:disabled { cursor: default; }
.dg-tray { display: flex; gap: clamp(8px, 1.8vw, 12px); flex-wrap: wrap; justify-content: center; }
.dg-chip { min-width: clamp(46px, 10vw, 58px); height: clamp(44px, 9vw, 54px); border-radius: 12px; border: none; background: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(17px, 3.2vw, 22px); color: #0E0E10; cursor: grab; transition: all 0.15s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.16); padding: 0 clamp(8px, 1.6vw, 12px); touch-action: none; }
.dg-chip:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.24); }
.dg-chip:active { cursor: grabbing; }
.dg-held { box-shadow: 0 0 0 2px #FF4F28, 0 8px 20px -6px rgba(255, 79, 40, 0.34); color: #FF4F28; }
.dg-used { visibility: hidden; }

/* MATH geom_5_01: факт-анимации (CSS-only loop, KRUPNYE, qutiga sig'adi). */
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

/* MATH: ambient — мягкие плавающие контуры-рамки на разрежённых экранах (мотив периметра, декор). */
.flf { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.flf-c { position: absolute; border-radius: 14px; background: transparent; animation: flfFloat 16s ease-in-out infinite; }
.flf-c1 { width: 96px; height: 64px; left: 5%; top: 9%; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.12); animation-delay: 0s; }
.flf-c2 { width: 120px; height: 120px; right: 4%; bottom: 7%; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.12); animation-delay: -5s; }
.flf-c3 { width: 58px; height: 44px; left: 40%; top: 64%; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.10); animation-delay: -9s; }
.flf-c4 { width: 74px; height: 74px; right: 14%; top: 14%; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.10); animation-delay: -3s; }
.flf-c5 { width: 50px; height: 70px; left: 12%; bottom: 16%; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.10); animation-delay: -12s; }
.flf-c6 { width: 66px; height: 50px; left: 64%; top: 30%; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.10); animation-delay: -7s; }
@keyframes flfFloat { 0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); } 33% { transform: translateY(-14px) translateX(8px) rotate(2deg); } 66% { transform: translateY(8px) translateX(-10px) rotate(-2deg); } }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
