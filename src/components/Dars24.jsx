import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Умножение и деление десятичной дроби на 10, 100, 1000 — dec_5_04
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
            <div className="mono small" style={{ color: T.ink3 }}>
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, findWrong = false }) => {
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
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || c.audio.on_wrong[lang];
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
        <div className="fade-up">{typeof question === 'function' ? question(solved) : question}</div>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            if (solved) {
              if (i === correctIdx) cls += findWrong ? ' option-picked-wrong' : ' option-correct';
              else if (isWrongPicked) cls += ' option-picked-wrong';
              else cls += ' option-wrong';
            } else if (isWrongPicked) {
              cls += ' option-picked-wrong';
            }
            const disabled = solved || isWrongPicked;   // верное решает, погашенный неверный — не кликается; остальные активны
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? (findWrong ? T.accent : T.success) : (isWrongPicked ? T.accent : T.ink3) }}>
                  {solved && i === correctIdx ? (findWrong ? '✗' : '✓') : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (findWrong ? (lang === 'uz' ? "Xatoni topdingiz" : 'Ошибку нашли') : (lang === 'uz' ? "To'g'ri" : 'Верно')) : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
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
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
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
// --- ПОД УРОК: dec_5_04 — Умножение и деление десятичной на 10, 100, 1000 (PROMPT 2026-06-14) ---
// Центральный misconception: "×10 = приписать ноль" (как у натуральных): 2,5×10=2,50 вместо 25.
// Плюс: двигает запятую не в ту сторону; теряет/дописывает лишние нули. Визуализатор CommaHop
// (CommaHop/CommaSlide: запятая едет вправо/влево, нули материализуются). Hook = HookUpload (загрузка картинки).
// Типы тестов: warm-up MC / MC / NumInput / find-the-wrong / fill-blank / comma-placement / MC.
// Spaced-retrieval s1 (разряды, dec_5_01). Linker-связки 4-A, факты, ✓/✗ feedback, reduced-motion.
// IT-сюжет: Davron (hook, размеры файлов), Madina (кейс). Факты: научная запись / КБ-МБ-ГБ /
// двоичный сдвиг — все DRAFT, требуют валидации методиста.
// ============================================================
const TOTAL_SCREENS = 17;
const LESSON_META = {
  lessonId: 'dec-5-04-v1',
  lessonTitle: { ru: 'Умножение и деление десятичной дроби на 10, 100, 1000', uz: "O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'review',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // find-the-wrong
  { id: 's11', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // fill-blank
  { id: 's12', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // comma-placement
  { id: 's13', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // case solve
  { id: 's15', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's16', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // ── s0 HOOK (анимация HookUpload — загрузка CoddyCamp.jpeg) ──────
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    lead: { ru: 'Davron загрузил для игры 10 картинок, каждая по 2,5 МБ. Чтобы найти общий размер, он умножил 2,5 на 10 и приписал ноль — получил 2,50 МБ.', uz: "Davron o'yin uchun 10 ta rasm yukladi, har biri 2,5 MB. Umumiy hajmni topish uchun u 2,5 ni 10 ga ko'paytirdi va oxiriga nol qo'shdi — 2,50 MB chiqardi." },
    objection: { ru: 'Но 2,50 — это столько же, сколько 2,5, то есть как одна картинка. Разве 10 картинок весят как одна?', uz: "Lekin 2,50 — bu 2,5 ning o'zi, ya'ni bitta rasmcha. 10 ta rasm bittasidek tortadimi?" },
    question: { ru: 'Davron прав?', uz: "Davron haqmi?" },
    opt_yes: { ru: 'Да, 2,50 МБ — верно', uz: "Ha, 2,50 MB — to'g'ri" },
    opt_no: { ru: 'Нет, 2,50 это то же, что 2,5 — надо двигать запятую, будет 25', uz: "Yo'q, 2,50 bu 2,5 ning o'zi — vergulni surish kerak, 25 bo'ladi" },
    opt_idk: { ru: 'Не уверен(а)', uz: "Ishonchim komil emas" },
    audio: { ru: 'Davron загрузил десять картинок, каждая по две целых пять десятых мегабайта. Он умножил на десять и просто приписал ноль, получив две целых пять десятых, только с нулём на конце. Но это столько же, сколько одна картинка. Разве десять картинок весят как одна? Выбери.', uz: "Davron o'nta rasm yukladi, har biri ikki butun o'ndan besh megabayt. U o'nga ko'paytirib, oxiriga shunchaki nol qo'shdi va yana ikki butun o'ndan besh chiqardi, faqat nol bilan. Lekin bu bitta rasmcha bilan barobar. O'nta rasm bittasidek tortadimi? Tanlang." }
  },

  // ── s1 WARM-UP — spaced retrieval (прошлый блок: разряды, dec_5_01) ──
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    question: { ru: 'Сначала вспомним разряды. Чему равна 0,7 в виде дроби?', uz: "Avval razryadlarni eslaymiz. 0,7 kasr ko'rinishida nechaga teng?" },
    opt0: { ru: '7/10', uz: "7/10" },
    opt1: { ru: '7/100', uz: "7/100" },
    opt2: { ru: '1/7', uz: "1/7" },
    opt3: { ru: '70', uz: "70" },
    correct_text: { ru: 'Верно. 0,7 это семь десятых, то есть 7/10. Первый разряд после запятой — десятые.', uz: "To'g'ri. 0,7 bu o'ndan yetti, ya'ni 7/10. Verguldan keyingi birinchi razryad — o'ndan." },
    wrong_1: { ru: 'Это сотые. У 0,7 одна цифра после запятой — это десятые: 7/10.', uz: "Bu yuzdan. 0,7 da verguldan keyin bitta raqam — bu o'ndan: 7/10." },
    wrong_2: { ru: '0,7 это семь десятых, а не одна седьмая. Знаменатель — 10.', uz: "0,7 bu o'ndan yetti, yettidan bir emas. Maxraj — 10." },
    wrong_3: { ru: '0,7 меньше единицы, это не 70. Это семь десятых: 7/10.', uz: "0,7 birdan kichik, bu 70 emas. Bu o'ndan yetti: 7/10." },
    audio: {
      intro: { ru: 'Вспомни прошлый блок про разряды. Чему равна ноль целых семь десятых в виде обыкновенной дроби? Выбери.', uz: "Razryadlar haqidagi o'tgan blokni eslang. Nol butun o'ndan yetti oddiy kasr ko'rinishida nechaga teng? Tanlang." },
      on_correct: { ru: 'Верно, семь десятых.', uz: "To'g'ri, o'ndan yetti." },
      on_wrong: { ru: 'Не совсем. Одна цифра после запятой — это десятые.', uz: "Unchalik emas. Verguldan keyingi bitta raqam — bu o'ndan." }
    }
  },

  // ── s2 EXPLORATION: ×10 — запятая прыгает на 1 разряд вправо ──────
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'Разряды помним — вернёмся к загадке. Умножим 2,5 на 10 правильно.', uz: "Razryadlarni eslaymiz — topishmoqqa qaytamiz. 2,5 ni 10 ga to'g'ri ko'paytiramiz." },
    step_labels: {
      ru: ['Вот число 2,5. Умножаем на 10 — каждая цифра поднимается на разряд.', 'Запятая прыгнула на одно место вправо: было 2,5, стало 25. В десять раз больше — как и должно быть.'],
      uz: ["Mana 2,5 soni. 10 ga ko'paytiramiz — har bir raqam bir razryadga ko'tariladi.", "Vergul bir o'rin o'ngga sakradi: 2,5 edi, 25 bo'ldi. O'n marta ko'p — shunday bo'lishi kerak ham."]
    },
    note: { ru: 'Вот секрет: умножить на 10 — это сдвинуть запятую на одно место вправо.', uz: "Mana siri: 10 ga ko'paytirish — vergulni bir o'rin o'ngga surish." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Разряды мы помним, вернёмся к загадке. Вот число две целых пять десятых, умножаем его на десять. Нажми кнопку.',
        'Запятая прыгнула на одно место вправо. Было две целых пять десятых, стало двадцать пять. Это в десять раз больше, как и должно быть.'
      ],
      uz: [
        "Razryadlarni eslaymiz, topishmoqqa qaytamiz. Mana ikki butun o'ndan besh soni, uni o'nga ko'paytiramiz. Tugmani bosing.",
        "Vergul bir o'rin o'ngga sakradi. Ikki butun o'ndan besh edi, yigirma besh bo'ldi. Bu o'n marta ko'p, shunday bo'lishi kerak ham."
      ]
    }
  },

  // ── s3 EXPLORATION: ×100 и ×1000 — два и три прыжка, нули появляются ──
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'А если на 100? Тогда запятая прыгает на два места. На 1000 — на три.', uz: "100 ga-chi? Unda vergul ikki o'rin sakraydi. 1000 ga — uch o'rin." },
    step_labels: {
      ru: ['2,5 умножаем на 100. Запятая прыгает на одно место…', '…и на второе место. Цифр не хватило — на пустой разряд встал ноль. Стало 250.', 'На 1000 запятая прыгнула бы на три места: 2,5 стало бы 2500, с двумя нулями.'],
      uz: ["2,5 ni 100 ga ko'paytiramiz. Vergul bir o'rin sakraydi…", "…va ikkinchi o'ringa. Raqam yetmadi — bo'sh razryadga nol turdi. 250 bo'ldi.", "1000 ga vergul uch o'rin sakrardi: 2,5 endi 2500 bo'lardi, ikkita nol bilan."]
    },
    note: { ru: 'Сколько нулей в множителе — на столько мест прыгает запятая вправо. Не хватает цифр — дописываем нули.', uz: "Ko'paytuvchida nechta nol — vergul shuncha o'rin o'ngga sakraydi. Raqam yetmasa — nol qo'shamiz." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'А если умножить на сто? Тогда запятая прыгает на два места. Первый прыжок. Нажми кнопку.',
        'Второй прыжок. Цифр не хватило, и на пустой разряд встал ноль. Получилось двести пятьдесят.',
        'А на тысячу запятая прыгнула бы на три места, и две целых пять десятых стало бы две тысячи пятьсот, с двумя нулями.'
      ],
      uz: [
        "100 ga ko'paytirsak-chi? Unda vergul ikki o'rin sakraydi. Birinchi sakrash. Tugmani bosing.",
        "Ikkinchi sakrash. Raqam yetmadi va bo'sh razryadga nol turdi. Ikki yuz ellik bo'ldi.",
        "Mingga esa vergul uch o'rin sakrardi, ikki butun o'ndan besh ikki ming besh yuz bo'lardi, ikkita nol bilan."
      ]
    }
  },

  // ── s4 EXPLORATION: пограничные случаи (запятая исчезает / нули слева) ──
  s4: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'Теперь два особых случая на краях. Смотри внимательно.', uz: "Endi cheklardagi ikki maxsus holat. Diqqat bilan qarang." },
    cap_a: { ru: '0,5 × 100: запятая ушла за последнюю цифру — число стало целым: 50.', uz: "0,5 × 100: vergul oxirgi raqamdan o'tdi — son butun bo'ldi: 50." },
    cap_b: { ru: '5 ÷ 100: цифр слева не хватило — впереди появились нули: 0,05.', uz: "5 ÷ 100: chapda raqam yetmadi — oldida nollar paydo bo'ldi: 0,05." },
    note: { ru: 'При умножении запятая может исчезнуть (целое), при делении — впереди дописываем нули и ноль целых.', uz: "Ko'paytirishda vergul yo'qolishi mumkin (butun), bo'lishda — oldiga nol va nol butun qo'shamiz." },
    audio: { ru: 'Теперь два особых случая. Ноль целых пять десятых умножить на сто: запятая ушла за последнюю цифру, и число стало целым — пятьдесят. А пять разделить на сто: слева цифр не хватило, поэтому впереди появились нули, получилось ноль целых пять сотых.', uz: "Endi ikki maxsus holat. Nol butun o'ndan beshni yuzga ko'paytiramiz: vergul oxirgi raqamdan o'tdi va son butun bo'ldi — ellik. Beshni yuzga bo'lsak: chapda raqam yetmadi, shuning uchun oldida nollar paydo bo'ldi, nol butun yuzdan besh bo'ldi." }
  },

  // ── s5 EXPLORATION: живой выбор операции (направление) ─────────────
  s5: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'Попробуй сам. Возьмём 7,5 и нажимай — запятая прыгает живьём.', uz: "O'zingiz sinab ko'ring. 7,5 ni olamiz va bosing — vergul jonli sakraydi." },
    mul_label: { ru: 'Умножить', uz: "Ko'paytirish" },
    div_label: { ru: 'Разделить', uz: "Bo'lish" },
    hint_pick: { ru: 'Нажми любую кнопку — посмотри, куда и на сколько прыгнет запятая.', uz: "Istalgan tugmani bosing — vergul qayoqqa va qancha sakrashini ko'ring." },
    note_mul: { ru: 'Умножаем — запятая идёт вправо, число растёт.', uz: "Ko'paytiramiz — vergul o'ngga boradi, son o'sadi." },
    note_div: { ru: 'Делим — запятая идёт влево, число уменьшается.', uz: "Bo'lamiz — vergul chapga boradi, son kichrayadi." },
    audio: { ru: 'Теперь попробуй сам. Возьмём семь целых пять десятых. Нажимай кнопки умножения и деления и смотри, куда прыгает запятая. При умножении она идёт вправо, при делении — влево.', uz: "Endi o'zingiz sinab ko'ring. Yetti butun o'ndan beshni olamiz. Ko'paytirish va bo'lish tugmalarini bosing va vergul qayoqqa sakrashini kuzating. Ko'paytirishda u o'ngga, bo'lishda chapga boradi." }
  },

  // ── s6 RULE 1 ─────────────────────────────────────────────────────
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    rule_main: { ru: 'Соберём в правило. Чтобы умножить на 10, 100 или 1000 — сдвигаем запятую вправо на столько мест, сколько нулей в множителе. Если цифр не хватает, дописываем нули.', uz: "Qoidaga yig'amiz. 10, 100 yoki 1000 ga ko'paytirish uchun — vergulni ko'paytuvchidagi nollar soni qancha bo'lsa, shuncha o'rin o'ngga suramiz. Raqam yetmasa, nol qo'shamiz." },
    rule_note: { ru: 'Почему вправо? Умножение на 10 поднимает каждую цифру на разряд выше — десятые становятся единицами.', uz: "Nega o'ngga? 10 ga ko'paytirish har bir raqamni bir razryad yuqori ko'taradi — o'ndan birlarga aylanadi." },
    audio: { ru: 'Соберём увиденное в правило. Чтобы умножить на десять, сто или тысячу, сдвигаем запятую вправо на столько мест, сколько нулей в множителе. Если цифр не хватает, дописываем нули. Так выходит, потому что каждая цифра поднимается на разряд выше.', uz: "Ko'rganlarimizni qoidaga yig'amiz. O'nga, yuzga yoki mingga ko'paytirish uchun vergulni nollar soni qancha bo'lsa shuncha o'rin o'ngga suramiz. Raqam yetmasa nol qo'shamiz. Shunday bo'ladi, chunki har bir raqam bir razryad yuqori ko'tariladi." }
  },

  // ── s7 RULE 2 — две осторожности (направление + лишние нули) ───────
  s7: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    rule_main: { ru: 'Умножение знаем. Деление — наоборот, и есть две осторожности.', uz: "Ko'paytirishni bildik. Bo'lish — aksincha, va ikkita ehtiyotkorlik bor." },
    warn1_label: { ru: 'Деление: влево', uz: "Bo'lish: chapga" },
    warn1: { ru: 'При делении на 10, 100, 1000 запятая идёт влево — на столько мест, сколько нулей. Не хватает цифр слева — впереди дописываем нули и ноль целых.', uz: "10, 100, 1000 ga bo'lishda vergul chapga boradi — nollar soni qancha bo'lsa shuncha o'rin. Chapda raqam yetmasa — oldiga nol va nol butun qo'shamiz." },
    warn2_label: { ru: 'Осторожно: лишний ноль', uz: "Ehtiyot bo'ling: ortiqcha nol" },
    warn2: { ru: 'Не приписывай ноль, как у натуральных чисел. 2,5 × 10 это 25, а не 2,50. Двигай запятую, а нули — только чтобы заполнить пустые разряды.', uz: "Natural sonlardek nol qo'shmang. 2,5 × 10 bu 25, 2,50 emas. Vergulni suring, nollarni esa — faqat bo'sh razryadlarni to'ldirish uchun." },
    audio: { ru: 'Умножение мы знаем, а деление — наоборот: запятая идёт влево на столько мест, сколько нулей. И две осторожности. Первое: при нехватке цифр слева впереди дописываем нули и ноль целых. Второе: не приписывай лишний ноль, как у натуральных чисел. Две целых пять десятых на десять это двадцать пять, а не две целых пять десятых с нулём.', uz: "Ko'paytirishni bilamiz, bo'lish esa aksincha: vergul nollar soni qancha bo'lsa shuncha o'rin chapga boradi. Va ikkita ehtiyotkorlik. Birinchi: chapda raqam yetmasa oldiga nol va nol butun qo'shamiz. Ikkinchi: natural sonlardek ortiqcha nol qo'shmang. Ikki butun o'ndan besh karra o'n bu yigirma besh, nol bilan ikki butun o'ndan besh emas." }
  },

  // ── s8 TEST MC: ×100 (correct C) + Факт научная запись ─────────────
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Теперь сам. Сколько будет 3,2 × 100?', uz: "Endi o'zingiz. 3,2 × 100 nechaga teng?" },
    opt0: { ru: '320', uz: "320" },
    opt1: { ru: '0,032', uz: "0,032" },
    opt2: { ru: '3,200', uz: "3,200" },
    opt3: { ru: '32', uz: "32" },
    correct_text: { ru: 'Верно. На 100 запятая прыгает на два места вправо: 3,2 стало 320. Один ноль дописали.', uz: "To'g'ri. 100 ga vergul ikki o'rin o'ngga sakraydi: 3,2 320 bo'ldi. Bitta nol qo'shildi." },
    wrong_1: { ru: 'Это деление — запятая ушла влево. А при умножении она идёт вправо: 320.', uz: "Bu bo'lish — vergul chapga ketdi. Ko'paytirishda esa o'ngga boradi: 320." },
    wrong_2: { ru: 'Это приписанный ноль, число не изменилось. Двигай запятую вправо на два места: 320.', uz: "Bu qo'shilgan nol, son o'zgarmadi. Vergulni o'ngga ikki o'rin suring: 320." },
    wrong_3: { ru: 'Это умножение только на 10. А на 100 — два места: 320.', uz: "Bu faqat 10 ga ko'paytirish. 100 ga esa — ikki o'rin: 320." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Учёные большие и малые числа пишут через степени десяти и сдвиг запятой. Скорость света — около 3·10⁵ км/с.', uz: "Olimlar katta va kichik sonlarni o'nning darajasi va vergul surish bilan yozadi. Yorug'lik tezligi — taxminan 3·10⁵ km/s." }
    },
    audio: {
      intro: { ru: 'Теперь сам. Сколько будет три целых две десятых умножить на сто? Выбери вариант.', uz: "Endi o'zingiz. Uch butun o'ndan ikki karra yuz nechaga teng? Variantni tanlang." },
      on_correct: { ru: 'Верно, триста двадцать. А вот и факт: учёные большие и малые числа пишут через степени десяти и сдвиг запятой. Например, скорость света — около трёхсот тысяч километров в секунду.', uz: "To'g'ri, uch yuz yigirma. Mana fakt: olimlar katta va kichik sonlarni o'nning darajalari va vergul surish bilan yozadi. Masalan, yorug'lik tezligi taxminan uch yuz ming kilometr soniyada." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s9 TEST NumInput: деление, целое → десятичная (5 ÷ 100 = 0,05) ──
  s9: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Хорошо. А теперь деление: 5 ÷ 100. Введи ответ.', uz: "Yaxshi. Endi bo'lish: 5 ÷ 100. Javobni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'На 100 запятая идёт влево на два места. У 5 запятая справа: 5,0. Цифр слева не хватает — впереди ноль целых и ноль: 0,05.', uz: "100 ga vergul chapga ikki o'rin boradi. 5 da vergul o'ngda: 5,0. Chapda raqam yetmaydi — oldiga nol butun va nol: 0,05." },
    fb_correct: { ru: 'Верно. 5 это 5,0; запятая влево на два места — 0,05.', uz: "To'g'ri. 5 bu 5,0; vergul chapga ikki o'rin — 0,05." },
    audio: {
      intro: { ru: 'Хорошо, теперь деление. Пять разделить на сто. Запятая пойдёт влево на два места. Введи ответ и нажми проверить.', uz: "Yaxshi, endi bo'lish. Beshni yuzga bo'lamiz. Vergul chapga ikki o'rin boradi. Javobni kiriting va tekshirishni bosing." },
      on_correct: { ru: 'Верно, ноль целых пять сотых.', uz: "To'g'ri, nol butun yuzdan besh." },
      on_wrong: { ru: 'Пока нет. Двигай запятую влево и впереди допиши нули.', uz: "Hali emas. Vergulni chapga suring va oldiga nol qo'shing." }
    }
  },

  // ── s10 TEST find-the-wrong (correct B) + Факт КБ-МБ-ГБ ─────────────
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question_pre: { ru: 'Найди ошибку. Какая запись', uz: "Xatoni toping. Qaysi yozuv" },
    question_em: { ru: 'неверная', uz: "noto'g'ri" },
    question_post: { ru: '?', uz: "?" },
    opt0: { ru: '3,1 × 10 = 31', uz: "3,1 × 10 = 31" },
    opt1: { ru: '2,5 × 10 = 2,50', uz: "2,5 × 10 = 2,50" },
    opt2: { ru: '0,5 × 100 = 50', uz: "0,5 × 100 = 50" },
    opt3: { ru: '8,4 ÷ 10 = 0,84', uz: "8,4 ÷ 10 = 0,84" },
    correct_text: { ru: 'Верно нашёл. 2,5 × 10 = 2,50 — ошибка: 2,50 это то же, что 2,5. Надо двигать запятую: 25.', uz: "To'g'ri topdingiz. 2,5 × 10 = 2,50 — xato: 2,50 bu 2,5 ning o'zi. Vergulni surish kerak: 25." },
    wrong_0: { ru: 'Ошибка не здесь: 3,1 × 10 = 31 записано правильно. Ищи неверную запись.', uz: "Xato bu yerda emas: 3,1 × 10 = 31 to'g'ri yozilgan. Noto'g'ri yozuvni qidiring." },
    wrong_2: { ru: 'Ошибка не здесь: 0,5 × 100 = 50 записано правильно. Ищи неверную запись.', uz: "Xato bu yerda emas: 0,5 × 100 = 50 to'g'ri yozilgan. Noto'g'ri yozuvni qidiring." },
    wrong_3: { ru: 'Ошибка не здесь: 8,4 ÷ 10 = 0,84 записано правильно. Ищи неверную запись.', uz: "Xato bu yerda emas: 8,4 ÷ 10 = 0,84 to'g'ri yozilgan. Noto'g'ri yozuvni qidiring." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" },
      text: { ru: 'Размеры данных растут шагами по 1000: килобайт, мегабайт, гигабайт. Каждый шаг — сдвиг запятой на три места.', uz: "Ma'lumot hajmi 1000 lik qadamlar bilan o'sadi: kilobayt, megabayt, gigabayt. Har qadam — vergulni uch o'rin surish." }
    },
    audio: {
      intro: { ru: 'Найди неверную запись среди четырёх. В какой из них ошибка? Выбери.', uz: "To'rttasi orasidan noto'g'ri yozuvni toping. Qaysi birida xato? Tanlang." },
      on_correct: { ru: 'Верно. Приписать ноль нельзя, надо двигать запятую. А вот и факт: размеры данных растут шагами по тысяче — килобайт, мегабайт, гигабайт. Каждый шаг это сдвиг запятой на три места.', uz: "To'g'ri. Nol qo'shib bo'lmaydi, vergulni surish kerak. Mana fakt: ma'lumot hajmi mingtalab qadam bilan o'sadi — kilobayt, megabayt, gigabayt. Har bir qadam vergulni uch o'rin surishdir." },
      on_wrong: { ru: 'Здесь ошибки нет, запись верная. Ищи ту, где приписали ноль вместо сдвига.', uz: "Bu yerda xato yo'q, yozuv to'g'ri. Nol qo'shilgan, surilmagan yozuvni qidiring." }
    }
  },

  // ── s11 TEST fill-blank: на что умножили (0,04 × ▢ = 40 → 1000) ─────
  s11: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    lead: { ru: 'Обратный ход. На что умножили 0,04, чтобы получить 40? Впиши множитель.', uz: "Teskari yo'l. 0,04 ni nechaga ko'paytirsak 40 chiqadi? Ko'paytuvchini yozing." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'От 0,04 до 40 запятая прыгнула на три места вправо. Три нуля — это 1000.', uz: "0,04 dan 40 gacha vergul uch o'rin o'ngga sakradi. Uch nol — bu 1000." },
    fb_correct: { ru: 'Верно. Запятая прыгнула на три места — значит умножили на 1000.', uz: "To'g'ri. Vergul uch o'rin sakradi — demak 1000 ga ko'paytirilgan." },
    audio: {
      intro: { ru: 'Обратный ход. На что умножили ноль целых четыре сотых, чтобы вышло сорок? Впиши множитель и нажми проверить.', uz: "Teskari yo'l. Nol butun yuzdan to'rtni nechaga ko'paytirsak qirq chiqadi? Ko'paytuvchini yozing va tekshirishni bosing." },
      on_correct: { ru: 'Верно, на тысячу.', uz: "To'g'ri, mingga." },
      on_wrong: { ru: 'Пока нет. Посчитай, на сколько мест прыгнула запятая.', uz: "Hali emas. Vergul necha o'rin sakraganini sanang." }
    }
  },

  // ── s12 TEST comma-placement: поставь запятую (475 ÷ 100 = 4,75) ────
  s12: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    lead: { ru: 'Поставь запятую сам. 475 ÷ 100 — нажми на нужный промежуток между цифрами.', uz: "Vergulni o'zingiz qo'ying. 475 ÷ 100 — raqamlar orasidagi kerakli oraliqni bosing." },
    digits: '475',
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'На 100 запятая идёт влево на два места от правого края: между 4 и 7 — будет 4,75.', uz: "100 ga vergul o'ng chetdan chapga ikki o'rin boradi: 4 va 7 orasida — 4,75 bo'ladi." },
    pick_text: { ru: 'Нажми на промежуток, куда встанет запятая.', uz: "Vergul turadigan oraliqni bosing." },
    wrong_text: { ru: 'Не там. На 100 — два места влево от конца.', uz: "U yer emas. 100 ga — oxiridan ikki o'rin chapga." },
    done_text: { ru: 'Верно: 475 ÷ 100 = 4,75. Два места влево.', uz: "To'g'ri: 475 ÷ 100 = 4,75. Ikki o'rin chapga." },
    audio: {
      intro: { ru: 'Поставь запятую сам. Четыреста семьдесят пять разделить на сто. Нажми на промежуток между цифрами, куда встанет запятая, и нажми проверить.', uz: "Vergulni o'zingiz qo'ying. To'rt yuz yetmish beshni yuzga bo'lamiz. Vergul turadigan oraliqni bosing va tekshirishni bosing." },
      on_correct: { ru: 'Верно, четыре целых семьдесят пять сотых.', uz: "To'g'ri, to'rt butun yuzdan yetmish besh." },
      on_wrong: { ru: 'Пока нет. На сто — это два места влево от конца.', uz: "Hali emas. Yuzga — bu oxiridan ikki o'rin chapga." }
    }
  },

  // ── s13 CASE setup (Madina, размер фото) ──────────────────────────
  s13: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    lead: { ru: 'Это нужно в жизни. Madina загружает в галерею 100 фотографий, каждая по 0,2 МБ.', uz: "Bu hayotda kerak. Madina galereyaga 100 ta foto yuklamoqda, har biri 0,2 MB." },
    question_setup: { ru: 'Сколько мегабайт займут все 100 фотографий?', uz: "Hammasi 100 ta foto necha megabayt egallaydi?" },
    btn_help: { ru: 'Помочь Madina', uz: "Madinaga yordam berish" },
    audio: { ru: 'Это нужно в жизни. Madina загружает сто фотографий, каждая по ноль целых две десятых мегабайта. Сколько мегабайт займут все сто? Здесь умножаем на сто.', uz: "Bu hayotda kerak. Madina yuzta foto yuklamoqda, har biri nol butun o'ndan ikki megabayt. Hammasi yuztasi necha megabayt egallaydi? Bu yerda yuzga ko'paytiramiz." }
  },

  // ── s14 CASE solve: 0,2 × 100 (correct A) + Факт двоичный сдвиг ─────
  s14: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Помоги Madina: 100 фото по 0,2 МБ — это сколько?', uz: "Madinaga yordam bering: 100 ta foto, har biri 0,2 MB — bu nechta?" },
    opt0: { ru: '20 МБ', uz: "20 MB" },
    opt1: { ru: '2 МБ', uz: "2 MB" },
    opt2: { ru: '200 МБ', uz: "200 MB" },
    opt3: { ru: '0,02 МБ', uz: "0,02 MB" },
    correct_text: { ru: 'Верно. 0,2 × 100 — запятая на два места вправо: 20 МБ.', uz: "To'g'ri. 0,2 × 100 — vergul ikki o'rin o'ngga: 20 MB." },
    wrong_1: { ru: 'Это умножение только на 10. А на 100 — два места: 20 МБ.', uz: "Bu faqat 10 ga ko'paytirish. 100 ga esa — ikki o'rin: 20 MB." },
    wrong_2: { ru: 'Это слишком много — на два места, а не на три. Будет 20 МБ.', uz: "Bu juda ko'p — ikki o'rin, uch emas. 20 MB bo'ladi." },
    wrong_3: { ru: 'Запятая ушла влево, как при делении. При умножении — вправо: 20 МБ.', uz: "Vergul chapga ketdi, bo'lishdagidek. Ko'paytirishda — o'ngga: 20 MB." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" },
      text: { ru: 'Компьютер считает в двоичной системе: там сдвиг цифр умножает на 2. У нас сдвиг запятой умножает на 10.', uz: "Kompyuter ikkilik sanoqda ishlaydi: u yerda raqam surish 2 ga ko'paytiradi. Bizda vergul surish 10 ga ko'paytiradi." }
    },
    audio: {
      intro: { ru: 'Помоги Madina. Сто фотографий по ноль целых две десятых мегабайта. Умножь на сто. Выбери вариант.', uz: "Madinaga yordam bering. Yuzta foto, har biri nol butun o'ndan ikki megabayt. Yuzga ko'paytiring. Variantni tanlang." },
      on_correct: { ru: 'Верно, двадцать мегабайт. А вот и факт: компьютер считает в двоичной системе, там сдвиг цифр умножает на два, а у нас сдвиг запятой умножает на десять.', uz: "To'g'ri, yigirma megabayt. Mana fakt: kompyuter ikkilik sanoqda ishlaydi, u yerda raqam surish ikkiga ko'paytiradi, bizda esa vergul surish o'nga ko'paytiradi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s15 FINAL: деление, целое → тысячные (45 ÷ 1000 = 0,045) (correct D) ──
  s15: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    question: { ru: 'Последнее. 45 МБ — это сколько ГБ? Раздели 45 на 1000.', uz: "Oxirgisi. 45 MB — bu necha GB? 45 ni 1000 ga bo'ling." },
    opt0: { ru: '0,45', uz: "0,45" },
    opt1: { ru: '4,5', uz: "4,5" },
    opt2: { ru: '0,0045', uz: "0,0045" },
    opt3: { ru: '0,045', uz: "0,045" },
    correct_text: { ru: 'Верно. На 1000 запятая влево на три места. У 45 запятая справа: 45,0. Впереди ноль целых и ноль: 0,045 ГБ.', uz: "To'g'ri. 1000 ga vergul chapga uch o'rin. 45 da vergul o'ngda: 45,0. Oldiga nol butun va nol: 0,045 GB." },
    wrong_0: { ru: 'Это деление только на 100 — два места. А на 1000 — три: 0,045.', uz: "Bu faqat 100 ga bo'lish — ikki o'rin. 1000 ga esa — uch: 0,045." },
    wrong_1: { ru: 'Это деление только на 10 — одно место. А на 1000 — три: 0,045.', uz: "Bu faqat 10 ga bo'lish — bir o'rin. 1000 ga esa — uch: 0,045." },
    wrong_2: { ru: 'Это четыре места влево — лишний ноль. Нужно три места: 0,045.', uz: "Bu chapga to'rt o'rin — ortiqcha nol. Uch o'rin kerak: 0,045." },
    audio: {
      intro: { ru: 'Последнее задание. Сорок пять мегабайт — это сколько гигабайт? Раздели сорок пять на тысячу. Запятая пойдёт влево на три места. Выбери вариант.', uz: "Oxirgi topshiriq. Qirq besh megabayt — bu necha gigabayt? Qirq beshni mingga bo'ling. Vergul chapga uch o'rin boradi. Variantni tanlang." },
      on_correct: { ru: 'Верно, ноль целых сорок пять тысячных.', uz: "To'g'ri, nol butun mingdan qirq besh." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s16 SUMMARY ───────────────────────────────────────────────────
  s16: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    title: { ru: 'Итак, теперь вы умеете умножать и делить десятичные на 10, 100, 1000.', uz: "Demak, endi siz o'nli kasrlarni 10, 100, 1000 ga ko'paytirish va bo'lishni bilasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    points: {
      ru: [
        'Умножаем — запятая вправо, делим — влево; на столько мест, сколько нулей.',
        'Не хватает цифр — дописываем нули (а при делении — ноль целых впереди).',
        'Не приписывай лишний ноль: 2,5 × 10 это 25, а не 2,50.'
      ],
      uz: [
        "Ko'paytirsak — vergul o'ngga, bo'lsak — chapga; nollar soni qancha bo'lsa shuncha o'rin.",
        "Raqam yetmasa — nol qo'shamiz (bo'lishda esa — oldiga nol butun).",
        "Ortiqcha nol qo'shmang: 2,5 × 10 bu 25, 2,50 emas."
      ]
    },
    hook_close: { ru: 'Помнишь Davron? Он приписал ноль и получил 2,50 — как одна картинка. По правилу 2,5 × 10 это 25 МБ — в десять раз больше, как и должно быть.', uz: "Davron yodingizdami? U nol qo'shib 2,50 chiqardi — bitta rasmcha kabi. Qoida bo'yicha 2,5 × 10 bu 25 MB — o'n marta ko'p, shunday bo'lishi kerak ham." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Десятичная дробь — концепт», «Сравнение десятичных», «Сложение и вычитание десятичных».', uz: "«O'nli kasr — tushuncha», «O'nli kasrlarni solishtirish», «O'nli kasrlarni qo'shish va ayirish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'проценты — сотые доли числа.', uz: "foizlar — sonning yuzdan ulushlari." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Итак, сегодня мы научились умножать и делить десятичные на десять, сто и тысячу. Умножаем — запятая вправо, делим — влево, на столько мест, сколько нулей. Лишний ноль не приписываем. Дальше нас ждут проценты — сотые доли числа.', uz: "Demak, bugun o'nli kasrlarni o'nga, yuzga va mingga ko'paytirish va bo'lishni o'rgandik. Ko'paytirsak vergul o'ngga, bo'lsak chapga, nollar soni qancha bo'lsa shuncha o'rin. Ortiqcha nol qo'shmaymiz. Keyingi darsda foizlar — sonning yuzdan ulushlari kutadi." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР dec_5_04: CommaHop — "прыгающая запятая".
// Число + операция ×/÷ 10/100/1000. При showResult запятая перепрыгивает на places мест
// (mul → вправо, div → влево), новые нули материализуются (ch-new). На тестах showResult=false →
// виден только пример (без ответа). Чистый рендер, без state.
// ============================================================
const splitDec = (s) => {
  const str = String(s);
  const ix = str.indexOf(',');
  return ix === -1 ? { int: str, frac: '' } : { int: str.slice(0, ix), frac: str.slice(ix + 1) };
};
const OP_SIGN = { mul: '×', div: '÷' };
const placesOf = (f) => (f >= 1000 ? 3 : f >= 100 ? 2 : 1);

const CommaHop = ({ value, op = 'mul', factor = 10, step = 0, showResult = false, glow = false }) => {
  const places = placesOf(factor);
  const moved = Math.max(0, Math.min(step, places));
  const sp = splitDec(value);
  const digits = (sp.int + sp.frac).split('');
  let comma = sp.int.length;
  let lead = 0, trail = 0;
  if (showResult && moved > 0) {
    if (op === 'div') {
      comma -= moved;
      while (comma < 1) { digits.unshift('0'); comma += 1; lead += 1; }
    } else {
      comma += moved;
      while (comma > digits.length) { digits.push('0'); trail += 1; }
    }
  }
  const isNew = (i) => i < lead || i >= digits.length - trail;
  const cells = [];
  digits.forEach((d, i) => {
    if (i === comma) cells.push(<span key="cm" className={`ch-cm ${glow ? 'ch-cm-glow' : ''}`}>,</span>);
    cells.push(<span key={`d${i}`} className={`ch-d ${(lead || trail) && isNew(i) ? 'ch-new' : ''}`}>{d}</span>);
  });
  return (
    <div className={`ch ${glow ? 'ch-glow' : ''}`}>
      <div className="ch-op"><span className="ch-op-sign">{OP_SIGN[op]}</span><span className="ch-op-f">{factor}</span></div>
      <div className="ch-num">{cells}</div>
    </div>
  );
};

// ВИЗУАЛИЗАТОР dec_5_04: CommaSlide — запятая ПЛАВНО скользит между разрядами (CSS transition
// на left), нули проявляются по мере прохода. Сетка ячеек фиксирована (lead+digits+trail),
// запятая абсолютна по индексу. Объясняет правило ДВИЖЕНИЕМ, не текстом. Чистый рендер.
const CommaSlide = ({ value, op = 'mul', factor = 10, step = 0, lead = 0, trail = 0, keepComma = false }) => {
  const places = placesOf(factor);
  const moved = Math.max(0, Math.min(step, places));
  const sp = splitDec(value);
  const digits = (sp.int + sp.frac).split('');
  const L = lead, len = digits.length;
  const origComma = lead + sp.int.length;
  const commaIndex = origComma + (op === 'div' ? -moved : moved);
  const total = lead + len + trail;
  const activeOf = (i) => {
    if (i >= L && i < L + len) return true;   // исходная цифра — всегда
    if (i < L) return i >= commaIndex - 1;    // ведущий ноль (деление)
    return i <= commaIndex - 1;               // хвостовой ноль (умножение)
  };
  let firstActive = -1;
  for (let i = 0; i < total; i++) { if (activeOf(i)) { firstActive = i; break; } }
  // незначащий ведущий ноль исходного числа (стало >= 1) — прячем (0,2 × 100 = 20, не 020)
  const hideLeadZero = firstActive >= L && digits[firstActive - L] === '0' && (commaIndex - firstActive) >= 2;
  const lzIdx = hideLeadZero ? firstActive : -1;
  let hasFrac = false;
  for (let i = commaIndex; i < total; i++) { if (activeOf(i)) { hasFrac = true; break; } }
  const cells = [];
  for (let i = 0; i < total; i++) {
    const isOrig = i >= L && i < L + len;
    const ch = isOrig ? digits[i - L] : '0';
    const on = activeOf(i) && i !== lzIdx;
    cells.push(<span key={i} className={`cs-d ${isOrig ? '' : 'cs-z'} ${on ? 'cs-on' : 'cs-off'}`}>{ch}</span>);
  }
  return (
    <div className="cs">
      <div className="ch-op"><span className="ch-op-sign">{OP_SIGN[op]}</span><span className="ch-op-f">{factor}</span></div>
      <div className="cs-row">
        {cells}
        <span className={`cs-cm ${(hasFrac || keepComma) ? '' : 'cs-cm-hide'}`} style={{ left: `calc(${commaIndex} * var(--cw))` }}>,</span>
      </div>
    </div>
  );
};

// ВИЗУАЛИЗАТОР dec_5_04: CommaLoop — НЕПРЕРЫВНАЯ петля: запятая ездит база↔результат, нули
// пульсируют (CSS keyframes, без state). Для s5 — меняется по нажатой кнопке (op/factor).
const CommaLoop = ({ value, op = 'mul', factor = 10, lead = 0, trail = 0 }) => {
  const places = placesOf(factor);
  const sp = splitDec(value);
  const digits = (sp.int + sp.frac).split('');
  const L = lead, len = digits.length;
  const baseIndex = lead + sp.int.length;
  const targetIndex = baseIndex + (op === 'div' ? -places : places);
  const total = lead + len + trail;
  const targetActive = (i) => {
    if (i >= L && i < L + len) return true;
    if (i < L) return i >= targetIndex - 1;
    return i <= targetIndex - 1;
  };
  const cells = [];
  for (let i = 0; i < total; i++) {
    const isOrig = i >= L && i < L + len;
    const ch = isOrig ? digits[i - L] : '0';
    const pulseZero = !isOrig && targetActive(i);
    cells.push(<span key={i} className={`cs-d ${isOrig ? '' : (pulseZero ? 'cs-z cl-z' : 'cs-off')}`}>{ch}</span>);
  }
  return (
    <div className="cs">
      <div className="ch-op"><span className="ch-op-sign">{OP_SIGN[op]}</span><span className="ch-op-f">{factor}</span></div>
      <div className="cs-row" style={{ '--from': `calc(${baseIndex} * var(--cw))`, '--shiftT': `translateX(calc(${targetIndex - baseIndex} * var(--cw)))` }}>
        {cells}
        <span className="cs-cm cl-cm" style={{ left: 'var(--from)' }}>,</span>
      </div>
    </div>
  );
};

// HOOK loop-анимация s0 (CSS-only, без state): ребёнок загружает картинку (квадрат
// "CoddyCamp.jpeg", 2,5 МБ) в компьютер — карточка едет в монитор и повторяется (как 10 файлов).
const HookUpload = () => (
  <div className="hu">
    <div className="hu-kid" aria-hidden="true"><span className="hu-head"/><span className="hu-body"/></div>
    <div className="hu-track">
      <div className="hu-file">
        <span className="hu-img"><span className="hu-sun"/><span className="hu-hill"/></span>
        <span className="hu-meta"><span className="hu-name">CoddyCamp.jpeg</span><span className="hu-size">2,5 MB</span></span>
      </div>
    </div>
    <div className="hu-pc" aria-hidden="true"><span className="hu-screen"><span className="hu-arrow"/></span><span className="hu-stand"/><span className="hu-base"/></div>
  </div>
);

// ============================================================
// SCREEN-КОМПОНЕНТЫ — переиспользуемые helpers (из infrastructure_v1 / Dars23)
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

// Устойчивая проверка ответа ПО ЗНАЧЕНИЮ: целые/десятичные (0,5=0.5) и дроби (4/6=2/3).
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

// Иконки ✓/✗ — feedback не только цветом (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-движение для разрежённых экранов (правила, summary): мягкие плавающие круги.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста (CSS-only, после верного).
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты?', uz: "Bilasizmi?" };
const AnimSci = () => (<div className="fa-sci"><span className="fa-sci-base">10</span><span className="fa-sci-exp">5</span><span className="fa-sci-cm">,</span></div>);
const AnimUnits = () => (<div className="fa-du">{['KB', 'MB', 'GB'].map((u, i) => <span key={u} className="fa-du-u" style={{ animationDelay: `${i * 0.9}s` }}>{u}</span>)}</div>);
const AnimBinary = () => (<div className="fa-bin">{['1', '0', '1', '0'].map((b, i) => <span key={i} style={{ animationDelay: `${i * 0.3}s` }}>{b}</span>)}</div>);

const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge || FACT_BADGE)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// Универсальный exploration step-gated с произвольным render-prop.
const ExplorationStep = ({ screen, onNext, onPrev, cKey, render }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT[cKey];
  const audio = useAudio(makeAudioSegments(c, lang));
  const segs = c.audio[lang] || c.audio.ru;
  const caps = c.step_labels[lang] || c.step_labels.ru;
  const STEPS = segs.length;
  const [step, setStep] = useState(0);
  const stepEndRef = useRef(null);
  const done = step >= STEPS - 1;
  const advance = () => { if (done) return; setStep(s => s + 1); audio.triggerEvent('button_click', 'step'); };
  useEffect(() => { if (stepEndRef.current) stepEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [step]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up ch-pulse' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
          {render(step, done)}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={advance} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p ref={stepEndRef} className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[step])}</p>
      </div>
    </Stage>
  );
};

// s0 — HOOK (концептуальный) с анимацией HookUpload
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt_yes, c.opt_no, c.opt_idk];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
    setTimeout(() => onNext(), 650);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px) clamp(10px, 2vw, 16px)' }}>
          <HookUpload/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.objection))}</p>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — WARM-UP (spaced retrieval, не scored) через QuestionScreen (correct B)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION ×10 (один прыжок)
const Screen2 = (props) => (
  <ExplorationStep {...props} cKey="s2" render={(step) => (
    <CommaSlide value="2,5" op="mul" factor={10} step={step} lead={0} trail={0} keepComma={true}/>
  )}/>
);

// s3 — EXPLORATION ×100 / ×1000 (два прыжка + нуль)
const Screen3 = (props) => (
  <ExplorationStep {...props} cKey="s3" render={(step) => (
    <CommaSlide value="2,5" op="mul" factor={100} step={step} lead={0} trail={1} keepComma={true}/>
  )}/>
);

// s4 — EXPLORATION пограничные случаи (целое / нули слева) — custom
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', gap: 'clamp(10px, 2vw, 18px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="frame ch-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', minWidth: 150 }}>
            <CommaHop value="0,5" op="mul" factor={100} step={2} showResult={true} glow={true}/>
            <p className="small" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.cap_a))}</p>
          </div>
          <div className="frame ch-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', minWidth: 150 }}>
            <CommaHop value="5" op="div" factor={100} step={2} showResult={true} glow={true}/>
            <p className="small" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.cap_b))}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — EXPLORATION живой выбор операции — custom (кнопки ×/÷, живой CommaHop)
const MUL_OPS = [{ op: 'mul', f: 10 }, { op: 'mul', f: 100 }, { op: 'mul', f: 1000 }];
const DIV_OPS = [{ op: 'div', f: 10 }, { op: 'div', f: 100 }];
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [sel, setSel] = useState(null);
  const opBtn = (o) => {
    const active = sel && sel.op === o.op && sel.f === o.f;
    return (
      <button key={`${o.op}${o.f}`} className="chip" onClick={() => setSel(o)}
        style={{ padding: '8px 14px', background: active ? (o.op === 'mul' ? T.success : T.blue) : T.ink2 }}>
        {OP_SIGN[o.op]} {o.f}
      </button>
    );
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1 ch-pulse" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 130 }}>
          <CommaLoop value="7,5" op={sel ? sel.op : 'mul'} factor={sel ? sel.f : 10} lead={2} trail={2}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="mono small" style={{ color: T.success, minWidth: 78 }}>{t(c.mul_label)}</span>
            {MUL_OPS.map(opBtn)}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="mono small" style={{ color: T.blue, minWidth: 78 }}>{t(c.div_label)}</span>
            {DIV_OPS.map(opBtn)}
          </div>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: sel ? (sel.op === 'mul' ? T.success : T.blue) : T.ink2, fontWeight: sel ? 600 : 400 }}>
          {mt(t(sel ? (sel.op === 'mul' ? c.note_mul : c.note_div) : c.hint_pick))}
        </p>
      </div>
    </Stage>
  );
};

// s6 — RULE 1 + ambient
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <CommaHop value="2,5" op="mul" factor={100} step={2} showResult={true} glow={true}/>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_note))}</p>
      </div>
    </Stage>
  );
};

// s7 — RULE 2 (деление + две осторожности) + контраст + ambient
const Screen7 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 1.9vw, 15px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_main))}</p>
        <div className="fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <CommaHop value="5" op="div" factor={100} step={2} showResult={true} glow={true}/>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t(c.warn1_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn1))}</p>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t(c.warn2_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn2))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s8 — TEST MC: ×100 (correct C) + Факт научная запись
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 3, 0, 2]);
  const question = (<><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><CommaHop value="3,2" op="mul" factor={100} showResult={false}/></div></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimSci/>}/>}/>;
};

// s9 — TEST NumInput: 5 ÷ 100 = 0,05
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={0.05} renderVisual={({ solved }) => <CommaSlide value="5" op="div" factor={100} step={solved ? 2 : 0} lead={2} trail={0}/>}/>;
};

// s10 — TEST find-the-wrong (correct B) + Факт КБ-МБ-ГБ
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [3, 1, 0, 2]);
  const question = (<h2 className="title h-sub">{t(c.question_pre)} <span className="italic" style={{ color: T.accent }}>{t(c.question_em)}</span>{t(c.question_post)}</h2>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx} findWrong={true} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimUnits/>}/>}/>;
};

// s11 — TEST fill-blank: на что умножили (0,04 × ▢ = 40 → 1000)
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's11_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const TARGET = '1000';
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
      onAnswer({ stage: SCREEN_META[11].scope, screenIdx: 11, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', fontWeight: 600 }}>0,04</span>
          <span className="mop" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>×</span>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(90px, 20vw, 120px)' }}/>
          <span className="mop" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>=</span>
          <span className="mono" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', fontWeight: 600 }}>40</span>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }}><IconNo/></span>
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

// s12 — TEST comma-placement: поставь запятую в 475 (475 ÷ 100 = 4,75; верный gap = 1)
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's12_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const DIG = c.digits.split('');
  const CORRECT_GAP = 1; // между 4 и 7
  const wasSolved = storedAnswer?.solved === true;
  const [pickedGap, setPickedGap] = useState(wasSolved ? CORRECT_GAP : (storedAnswer?.pickedGap ?? null));
  const [solved, setSolved] = useState(wasSolved);
  const [bad, setBad] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const pick = (g) => {
    if (solved || bad.has(g)) return;
    const isCorrect = g === CORRECT_GAP;
    setPickedGap(g);
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isCorrect) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[12].scope, screenIdx: 12, question: c.lead[lang], correctAnswer: '4,75', studentAnswer: '4,75', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
    } else {
      setBad(prev => { const n = new Set(prev); n.add(g); return n; }); setPickedGap(null); sfx.playWrong();
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, minHeight: 110 }}>
          {DIG.map((d, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <button className={`cp-gap ${solved && CORRECT_GAP === i ? 'cp-on' : ''} ${bad.has(i) ? 'cp-bad' : ''}`} disabled={solved || bad.has(i)} onClick={() => pick(i)} aria-label="comma gap">
                  <span className="cp-cm" style={{ opacity: (solved && CORRECT_GAP === i) || pickedGap === i ? 1 : 0 }}>,</span>
                </button>
              )}
              <span className="cp-d">{d}</span>
            </React.Fragment>
          ))}
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: solved ? T.success : (bad.size ? T.accent : T.ink2), fontWeight: solved || bad.size ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {solved && <IconOk/>}{mt(t(solved ? c.done_text : (bad.size ? c.wrong_text : c.pick_text)))}
        </p>
      </div>
    </Stage>
  );
};

// s13 — CASE setup (Madina)
const Screen13 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}><CommaHop value="0,2" op="mul" factor={100} showResult={false}/></div>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.question_setup))}</h2>
      </div>
    </Stage>
  );
};

// s14 — CASE solve (correct A) + Факт двоичный сдвиг
const Screen14 = (props) => {
  const t = useT(); const c = CONTENT.s14;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (solved) => (<><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><CommaSlide value="0,2" op="mul" factor={100} step={solved ? 2 : 0} lead={0} trail={1}/></div></>);
  return <QuestionScreen {...props} idx={14} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[14]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimBinary/>}/>}/>;
};

// s15 — FINAL (correct D)
const Screen15 = (props) => {
  const t = useT(); const c = CONTENT.s15;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 3, [1, 0, 2, 3]);
  const question = (solved) => (<><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><CommaSlide value="45" op="div" factor={1000} step={solved ? 3 : 0} lead={2} trail={0}/></div></>);
  return <QuestionScreen {...props} idx={15} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[15]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s16 — SUMMARY + закрытие hook + связи + ambient
const Screen16 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s16;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = c.points[lang] || c.points.ru;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><CommaHop value="2,5" op="mul" factor={10} step={1} showResult={true} glow={true}/></div>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.hook_close))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function DecimalMulDivLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <div className="amb-host"><Floaters/></div>
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
  height: 3px;
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

/* === SLIDER v15 (track-wrap + track-bg + track-fill + glow + круговая тень handle) === */
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

/* === INPUT v15 (без рамок, на тенях) === */
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

/* === FRAMES v15 (без рамок, на тенях; polosa-исключение в soft/success) === */
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

/* MATH: анимация появления цифры в квадрате. */
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }
/* MATH dec_5_03: ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста. */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

/* MATH dec_5_04: CommaHop — "прыгающая запятая" (×/÷ 10/100/1000). */
.ch { display: inline-flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.ch-op { display: inline-flex; align-items: center; gap: 4px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px, 2.2vw, 16px); color: #019ACB; background: rgba(1, 154, 203, 0.10); border-radius: 99px; padding: 3px 12px; }
.ch-op-sign { font-weight: 700; }
.ch-num { display: inline-flex; align-items: flex-end; font-family: 'Fraunces', serif; font-size: clamp(28px, 6vw, 42px); line-height: 1; }
.ch-d { display: inline-block; min-width: clamp(16px, 3.4vw, 24px); text-align: center; color: #0E0E10; }
.ch-cm { display: inline-block; width: clamp(8px, 1.7vw, 12px); text-align: center; color: #FF4F28; font-weight: 700; }
.ch-cm-glow { color: #1F7A4D; }
.ch-new { color: #A7A6A2; animation: chNew 0.4s cubic-bezier(0.34, 1.3, 0.64, 1); }
@keyframes chNew { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
.ch-glow { animation: chGlow 0.7s ease; }
@keyframes chGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }
.ch-pulse { animation: chGlow 0.7s ease; }
/* MATH dec_5_04: living element — раскрытая запятая дышит (exploration не статична после шагов). */
.ch-cm-glow { animation: chBreathe 2.8s ease-in-out infinite; }
@keyframes chBreathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
/* MATH dec_5_04: непрерывное движение фоном на КАЖДОМ экране (ambient за сценой) + fact-anim не вылезает. */
.amb-host { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.stage { position: relative; z-index: 1; }
.fact-anim { overflow: hidden; }

/* MATH dec_5_04: CommaSlide — запятая плавно скользит (transition на left) + проявление нулей. */
.cs { display: inline-flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.6vw, 12px); }
.cs-row { position: relative; --cw: clamp(22px, 4.6vw, 32px); display: flex; align-items: flex-end; height: clamp(42px, 8.5vw, 58px); }
.cs-d { width: var(--cw); text-align: center; font-family: 'Fraunces', serif; font-size: clamp(28px, 6vw, 42px); line-height: 1; color: #0E0E10; transition: opacity 0.35s ease; }
.cs-off { opacity: 0; }
.cs-on { opacity: 1; }
.cs-z.cs-on { animation: chNew 0.4s cubic-bezier(0.34, 1.3, 0.64, 1); }
.cs-cm { position: absolute; bottom: clamp(-2px, 0vw, 0px); transform: translateX(-50%); font-family: 'Fraunces', serif; font-size: clamp(28px, 6vw, 42px); line-height: 1; color: #FF4F28; font-weight: 700; transition: left 0.5s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.45s ease; }
.cs-cm-hide { opacity: 0; }
/* MATH dec_5_04: CommaLoop — петля (запятая ездит база↔результат, нули пульсируют). */
.cl-cm { animation: clHop 3.2s ease-in-out infinite; }
@keyframes clHop { 0%, 12% { transform: translateX(-50%) translateX(0); } 45%, 58% { transform: translateX(-50%) var(--shiftT); } 90%, 100% { transform: translateX(-50%) translateX(0); } }
.cl-z { animation: clZero 3.2s ease-in-out infinite; }
@keyframes clZero { 0%, 24% { opacity: 0; } 46%, 58% { opacity: 1; } 80%, 100% { opacity: 0; } }

/* MATH dec_5_04: HookUpload — ребёнок загружает картинку CoddyCamp.jpeg в компьютер (CSS loop). */
.hu { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 18px); min-height: clamp(96px, 18vw, 128px); }
.hu-kid { position: relative; width: clamp(26px, 5vw, 36px); height: clamp(46px, 9vw, 64px); flex-shrink: 0; }
.hu-head { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: clamp(15px, 3vw, 21px); height: clamp(15px, 3vw, 21px); border-radius: 50%; background: #FF4F28; }
.hu-body { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: clamp(24px, 4.6vw, 34px); height: clamp(26px, 5vw, 36px); border-radius: 12px 12px 6px 6px; background: rgba(255, 79, 40, 0.5); }
.hu-track { position: relative; flex: 1; max-width: clamp(120px, 30vw, 210px); height: clamp(60px, 12vw, 84px); }
.hu-file { position: absolute; top: 50%; left: 0; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px; border-radius: 10px; background: #FFFFFF; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.28); animation: huFly 3.6s ease-in-out infinite; }
@keyframes huFly { 0% { left: 0; transform: translateY(-50%) scale(0.7); opacity: 0; } 16% { opacity: 1; transform: translateY(-50%) scale(1); } 68% { left: 100%; transform: translate(-100%, -50%) scale(1); opacity: 1; } 84%, 100% { left: 100%; transform: translate(-100%, -50%) scale(0.5); opacity: 0; } }
.hu-img { position: relative; width: clamp(34px, 7vw, 50px); height: clamp(26px, 5.4vw, 38px); border-radius: 5px; overflow: hidden; background: linear-gradient(160deg, #EAF6FB, rgba(1, 154, 203, 0.22)); display: block; }
.hu-sun { position: absolute; top: 4px; right: 5px; width: clamp(7px, 1.6vw, 11px); height: clamp(7px, 1.6vw, 11px); border-radius: 50%; background: #FF4F28; }
.hu-hill { position: absolute; bottom: 0; left: 0; right: 0; height: 55%; background: #1F7A4D; clip-path: polygon(0 100%, 30% 35%, 55% 75%, 80% 20%, 100% 60%, 100% 100%); }
.hu-meta { display: flex; flex-direction: column; align-items: center; line-height: 1.1; }
.hu-name { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: clamp(8px, 1.5vw, 10px); color: #0E0E10; }
.hu-size { font-family: 'JetBrains Mono', monospace; font-size: clamp(7px, 1.3vw, 9px); color: #019ACB; }
.hu-pc { position: relative; width: clamp(46px, 9vw, 64px); height: clamp(48px, 9.5vw, 66px); flex-shrink: 0; }
.hu-screen { position: absolute; top: 0; left: 0; right: 0; height: clamp(34px, 6.6vw, 46px); border-radius: 7px; background: #0E0E10; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.28); }
.hu-arrow { width: clamp(11px, 2.4vw, 16px); height: clamp(11px, 2.4vw, 16px); border-right: 3px solid #019ACB; border-bottom: 3px solid #019ACB; animation: huArrow 1.4s ease-in-out infinite; }
@keyframes huArrow { 0%, 100% { opacity: 0.3; transform: rotate(45deg) translate(-2px, -2px); } 50% { opacity: 1; transform: rotate(45deg) translate(2px, 2px); } }
.hu-stand { position: absolute; bottom: clamp(7px, 1.5vw, 11px); left: 50%; transform: translateX(-50%); width: 6px; height: clamp(8px, 1.6vw, 11px); background: #A7A6A2; }
.hu-base { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: clamp(30px, 6vw, 42px); height: 5px; border-radius: 3px; background: #A7A6A2; }

/* MATH dec_5_04: comma-placement — промежутки между цифрами (tap). */
.cp-d { font-family: 'Fraunces', serif; font-size: clamp(30px, 6.5vw, 46px); line-height: 1; color: #0E0E10; padding: 0 2px; }
.cp-gap { width: clamp(20px, 4.4vw, 30px); height: clamp(44px, 9vw, 60px); border: none; border-radius: 8px; background: rgba(255, 79, 40, 0.06); cursor: pointer; display: inline-flex; align-items: flex-end; justify-content: center; transition: all 0.2s; box-shadow: inset 0 0 0 1.5px rgba(255, 79, 40, 0.18); }
.cp-gap:hover:not(:disabled) { background: rgba(255, 79, 40, 0.14); }
.cp-gap:disabled { cursor: default; }
.cp-on { background: rgba(31, 122, 77, 0.16) !important; box-shadow: inset 0 0 0 1.5px rgba(31, 122, 77, 0.4) !important; }
.cp-bad { background: #FFFFFF !important; box-shadow: none !important; opacity: 0.4; }
.cp-cm { font-family: 'Fraunces', serif; font-size: clamp(30px, 6.5vw, 46px); font-weight: 700; color: #1F7A4D; line-height: 1; transition: opacity 0.2s; }
.cp-gap:not(.cp-on) .cp-cm { color: #FF4F28; }

/* MATH dec_5_04: факт-анимации (CSS-only loop). */
.fa-sci { position: relative; display: inline-flex; align-items: flex-start; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #019ACB; }
.fa-sci-base { font-size: clamp(34px, 7vw, 50px); line-height: 1; }
.fa-sci-exp { font-size: clamp(18px, 3.6vw, 26px); line-height: 1; margin-top: -4px; animation: faSci 2.4s ease-in-out infinite; }
.fa-sci-cm { position: absolute; left: 2px; bottom: 6px; font-size: clamp(20px, 4vw, 28px); color: #FF4F28; opacity: 0; animation: faSciCm 2.4s ease-in-out infinite; }
@keyframes faSci { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(-4px); opacity: 0.55; } }
@keyframes faSciCm { 0%, 60% { opacity: 0; transform: translateX(0); } 75% { opacity: 1; transform: translateX(2px); } 100% { opacity: 0; } }
.fa-du { display: inline-flex; gap: clamp(6px, 1.4vw, 10px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.8vw, 19px); color: #019ACB; }
.fa-du-u { opacity: 0.3; animation: faDu 2.7s ease-in-out infinite; }
@keyframes faDu { 0%, 8% { opacity: 0.3; transform: scale(1); } 22%, 30% { opacity: 1; transform: scale(1.18); } 50%, 100% { opacity: 0.3; transform: scale(1); } }
.fa-bin { display: inline-flex; gap: clamp(4px, 1vw, 7px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(22px, 4.4vw, 32px); color: #019ACB; }
.fa-bin span { display: inline-block; animation: faBin 1.6s ease-in-out infinite; }
@keyframes faBin { 0%, 100% { transform: translateX(0); opacity: 1; } 40% { transform: translateX(7px); opacity: 0.5; } 60% { transform: translateX(7px); opacity: 0.5; } }

/* MATH dec_5_03: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы (PROMPT 2026-06-13). */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
