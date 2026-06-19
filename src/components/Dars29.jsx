import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Площадь прямоугольника и квадрата — geom_5_02 (Dars29)
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: solved ? 'center' : 'flex-start' }}>
        {/* Sarlavha + savol matni to'g'ri javobdan keyin ham qoladi — faqat noto'g'ri variantlar yig'iladi (yangilangan anti-scroll 2026-06-18, Dars37 etaloni). */}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
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
        <div className="fade-up" style={{ maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(16px, 2.6vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>{c.title && <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>}<h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(16px, 2.6vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
// --- POD UROK: geom_5_02 — Yuza / Площадь прямоугольника и квадрата (PROMPT 2026-06-15) ---
// Markaziy misconception M1: yuzani PERIMETR bilan adashtirish (chegarani sanash). M2: faqat
// kontur bo'ylab sanash, ichini emas. M3: sm va sm^2 ni farqlamaslik. Asosiy usul: birlik
// kvadratlar bilan to'ldirish (CPA) -> qatorlar x ustunlar -> S = a x b (o'quvchi kashf etadi,
// tayyor berilmaydi). Vizualizator TileGrid: to'rtburchak birlik kvadratlar bilan to'ladi (CSS
// pop + uzluksiz breathe loop), o'lcham belgilari. Konseptual "nega ko'paytiramiz?" hook
// (qahramonsiz, purpose-driven). Case: Shahnoza xona poliga koshin teradi. Test turlari:
// warm-up MC (perimetr retrieval) / MC / NumInput / find-the-wrong / tap-to-shade / drag-classify
// / final MC. Faktlar (DRAFT, validatsiya kerak): geometriya = "yer o'lchash" (Tarix) /
// shaxmat 8x8 = 64 (Matematika) / ekran million piksel-kvadrat (IT).
// ============================================================

const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'geom-5-02-v1',
  lessonTitle: { ru: 'Площадь прямоугольника и квадрата', uz: "To'rtburchak va kvadrat yuzasi" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's13', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's14', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's15', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — "nega ko'paytiramiz?" konseptual (qahramonsiz). Grid 5x3 to'ladi. ----
  s0: {
    eyebrow: { ru: 'Квест', uz: 'Kvest' },
    title: { ru: 'Сколько блоков нужно?', uz: "Nechta blok kerak?" },
    lead: {
      ru: 'Ты строишь в игре: нужно покрыть прямоугольный участок земли квадратными блоками. В один ряд помещается 5 блоков, и таких рядов 3. Сколько всего блоков нужно? Можно ставить по одному — раз, два, три... А можно ли быстрее?',
      uz: "O'yinda qurmoqdasiz: to'rtburchak yer uchastkasini kvadrat bloklar bilan qoplash kerak. Bir qatorga 5 ta blok sig'adi, shunday qatorlar esa 3 ta. Hammasi bo'lib nechta blok kerak? Bittalab qo'ysa bo'ladi — bir, ikki, uch... Ammo tezroq yo'li bormi?"
    },
    opt0: { ru: 'Только по одному: ставим 15 раз', uz: "Faqat bittalab: 15 marta qo'yamiz" },
    opt1: { ru: 'Быстрее: 5 умножить на 3', uz: "Tezroq: 5 ni 3 ga ko'paytiramiz" },
    opt2: { ru: 'Так не узнать', uz: "Bunday bilib bo'lmaydi" },
    reveal: {
      ru: 'Запомни свой ответ. К концу урока узнаем, как быстро считать такие блоки.',
      uz: "Javobingizni eslab qoling. Dars oxirida bunday bloklarni qanday tez sanashni bilib olamiz."
    },
    audio: {
      intro: {
        ru: 'В игре нужно покрыть прямоугольный участок квадратными блоками. В одном ряду пять блоков, а таких рядов три. Сколько всего блоков нужно на весь участок? Можно ставить по одному, но это долго. Как думаешь, есть ли способ быстрее?',
        uz: "O'yinda to'rtburchak uchastkani kvadrat bloklar bilan qoplash kerak. Bir qatorda beshta blok, shunday qatorlar esa uchta. Butun uchastkaga hammasi bo'lib nechta blok kerak? Bittalab qo'ysa bo'ladi, lekin bu uzoq. Sizningcha, tezroq usul bormi?"
      },
      on_correct: { ru: 'Хорошо. Давай разберёмся вместе.', uz: "Yaxshi. Keling, birga aniqlab olamiz." },
      on_wrong:   { ru: 'Хорошо. Давай разберёмся вместе.', uz: "Yaxshi. Keling, birga aniqlab olamiz." }
    }
  },

  // ---- s1 WARM-UP — perimetr retrieval (Dars28). 5x3 perimetri = 16. Tuzoq 15 = yuza (oldindan). ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Вспомним периметр', uz: "Perimetrni eslaymiz" },
    question: {
      ru: 'На прошлом уроке мы измеряли границу. У прямоугольника 5 на 3 — чему равен периметр, то есть длина всей границы?',
      uz: "O'tgan darsda chegarani o'lchagandik. 5 ga 3 to'rtburchakning perimetri, ya'ni butun chegara uzunligi qancha?"
    },
    opt0: { ru: '16', uz: '16' },
    opt1: { ru: '15', uz: '15' },
    opt2: { ru: '8', uz: '8' },
    opt3: { ru: '30', uz: '30' },
    correct_text: {
      ru: 'Верно. Граница — это 5 плюс 3 плюс 5 плюс 3, всего 16. А теперь заглянем ВНУТРЬ этой границы.',
      uz: "To'g'ri. Chegara — bu 5 qo'shuv 3 qo'shuv 5 qo'shuv 3, jami 16. Endi esa shu chegaraning ICHIGA qaraymiz."
    },
    wrong_0: {
      ru: 'Число 16 как раз верное: 5 плюс 3 плюс 5 плюс 3. Выбери его.',
      uz: "16 soni aynan to'g'ri: 5 qo'shuv 3 qo'shuv 5 qo'shuv 3. O'shani tanlang."
    },
    wrong_1: {
      ru: '15 — это сколько клеток ВНУТРИ, это площадь, её мы изучим сегодня. А граница: 5 плюс 3 плюс 5 плюс 3 — это 16.',
      uz: "15 — bu ICHIDAGI kataklar soni, ya'ni yuza, uni bugun o'rganamiz. Chegara esa: 5 qo'shuv 3 qo'shuv 5 qo'shuv 3 — bu 16."
    },
    wrong_2: {
      ru: 'Это только две стороны, 5 плюс 3. У границы все четыре стороны: всего 16.',
      uz: "Bu faqat ikki tomon, 5 qo'shuv 3. Chegarada to'rtala tomon bor: jami 16."
    },
    wrong_3: {
      ru: 'Это вдвое больше, чем нужно. Сложи стороны один раз: 5 плюс 3 плюс 5 плюс 3 — это 16.',
      uz: "Bu keragidan ikki barobar ko'p. Tomonlarni bir marta qo'shing: 5 qo'shuv 3 qo'shuv 5 qo'shuv 3 — bu 16."
    },
    audio: {
      intro: {
        ru: 'Сначала вспомним прошлый урок. У прямоугольника пять на три. Чему равна длина всей его границы? Выбери ответ.',
        uz: "Avval o'tgan darsni eslaymiz. To'rtburchak besh ga uch. Uning butun chegarasi uzunligi qancha? Javobni tanlang."
      },
      on_correct: { ru: 'Верно. Шестнадцать. Теперь — внутрь границы.', uz: "To'g'ri. O'n olti. Endi — chegaraning ichiga." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — birlik kvadratlar bilan to'ldirish: qatorma-qator. 5x3 = 15. ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Заглянем внутрь фигуры', uz: "Shakl ichiga qaraymiz" },
    lead: {
      ru: 'Заглянем внутрь. Заполним прямоугольник одинаковыми квадратиками и посчитаем их. Нажимай — будем выкладывать ряд за рядом.',
      uz: "Ichiga qaraymiz. To'rtburchakni bir xil kvadratchalar bilan to'ldirib, ularni sanaymiz. Bosing — qatorma-qator teramiz."
    },
    btn_step: { ru: 'Выложить ряд', uz: "Qatorni terish" },
    caps: {
      ru: ['Внутри пока пусто. Будем заполнять клетками.', 'Первый ряд — 5 клеток.', 'Второй ряд — ещё 5, всего 10.', 'Третий ряд — ещё 5, всего 15.'],
      uz: ["Ichi hozircha bo'sh. Kataklar bilan to'ldiramiz.", "Birinchi qator — 5 ta katak.", "Ikkinchi qator — yana 5 ta, jami 10.", "Uchinchi qator — yana 5 ta, jami 15."]
    },
    note: {
      ru: 'Готово. Внутри уместилось 15 клеток. Вот это и есть площадь — сколько одинаковых квадратиков помещается внутри.',
      uz: "Tayyor. Ichiga 15 ta katak sig'di. Mana shu — yuza, ya'ni ichiga nechta bir xil kvadratcha sig'ishi."
    },
    audio: {
      intro: {
        ru: 'Площадь — это сколько одинаковых квадратиков помещается внутри фигуры. Давай заполним прямоугольник ряд за рядом и сосчитаем клетки. Нажимай на кнопку.',
        uz: "Yuza — bu shaklning ichiga nechta bir xil kvadratcha sig'ishi. Keling, to'rtburchakni qatorma-qator to'ldirib, kataklarni sanaymiz. Tugmani bosing."
      },
      done: {
        ru: 'Внутри уместилось пятнадцать клеток. Значит, площадь этого прямоугольника — пятнадцать клеток.',
        uz: "Ichiga o'n beshta katak sig'di. Demak, bu to'rtburchakning yuzasi — o'n beshta katak."
      }
    }
  },

  // ---- s3 EXPLORATION — bitta birlik kvadrat: 1 sm x 1 sm = 1 sm^2 ----
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Мерка площади', uz: "Yuza o'lchovi" },
    lead: {
      ru: 'А какой квадратик мы считаем за один? Договорились о мерке: квадрат со стороной 1 сантиметр. Его площадь — один квадратный сантиметр.',
      uz: "Qaysi kvadratchani bittaga olamiz? O'lchov haqida kelishamiz: tomoni 1 santimetr bo'lgan kvadrat. Uning yuzasi — bir kvadrat santimetr."
    },
    note_unit: {
      ru: 'Сторона измеряется в сантиметрах, а площадь — в квадратных сантиметрах. Это разные единицы.',
      uz: "Tomon santimetrda o'lchanadi, yuza esa — kvadrat santimetrda. Bu har xil birliklar."
    },
    note_many: {
      ru: 'Если таких квадратиков 6 — площадь 6 квадратных сантиметров. Площадь всегда считают в таких квадратиках.',
      uz: "Agar shunday kvadratchalar 6 ta bo'lsa — yuza 6 kvadrat santimetr. Yuza doim shunday kvadratchalarda hisoblanadi."
    },
    audio: {
      ru: "Договоримся о мерке площади. За единицу берём квадрат, у которого сторона один сантиметр. Площадь такого квадрата — один квадратный сантиметр. Запомни главное: длину мы меряем в сантиметрах, а площадь — в квадратных сантиметрах, это разные единицы. Если внутри фигуры шесть таких квадратиков, то её площадь шесть квадратных сантиметров.",
      uz: "Yuza o'lchovi haqida kelishamiz. Birlik qilib tomoni bir santimetr bo'lgan kvadratni olamiz. Bunday kvadratning yuzasi — bir kvadrat santimetr. Asosiysini eslab qoling: uzunlikni santimetrda o'lchaymiz, yuzani esa kvadrat santimetrda, bular har xil birliklar. Agar shakl ichida shunday oltita kvadratcha bo'lsa, uning yuzasi olti kvadrat santimetr."
    }
  },

  // ---- s4 EXPLORATION — jonli slayder: bo'y o'zgaradi, en=4; S = a x 4 ----
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Зачем умножать?', uz: "Nega ko'paytiramiz?" },
    lead: {
      ru: 'Считать по одной долго. Заметь: в каждом ряду одинаковое число клеток, а рядов несколько. Двигай ползунок и смотри, как меняется площадь.',
      uz: "Bittalab sanash uzoq. Sezing: har qatorda bir xil sondagi katak, qatorlar esa bir nechta. Slayderni suring va yuza qanday o'zgarishini kuzating."
    },
    hint_move: {
      ru: 'В каждом ряду 4 клетки. Рядов несколько. Поэтому площадь — это число клеток в ряду, взятое столько раз, сколько рядов.',
      uz: "Har qatorda 4 ta katak. Qatorlar bir nechta. Shuning uchun yuza — bu qatordagi kataklar sonini qatorlar soniga ko'paytirgan."
    },
    note_square: {
      ru: 'Когда рядов столько же, сколько клеток в ряду, получается квадрат.',
      uz: "Qatorlar soni qatordagi kataklar soniga teng bo'lsa, kvadrat hosil bo'ladi."
    },
    audio: {
      ru: "Двигай ползунок и следи за числом клеток. В каждом ряду четыре клетки, и таких рядов несколько. Считать по одной долго, поэтому посмотри на закономерность: чтобы узнать все клетки, число клеток в одном ряду берут столько раз, сколько всего рядов. Это и есть умножение. А когда рядов столько же, сколько клеток в ряду, получается квадрат.",
      uz: "Slayderni suring va kataklar sonini kuzating. Har qatorda to'rtta katak, shunday qatorlar esa bir nechta. Bittalab sanash uzoq, shuning uchun qonuniyatga qarang: barcha kataklarni bilish uchun bitta qatordagi kataklar soni qatorlar soniga ko'paytiriladi. Bu — ko'paytirish. Qatorlar soni qatordagi kataklar soniga teng bo'lganda esa kvadrat hosil bo'ladi."
    }
  },

  // ---- s5 RULE 1 — S = a x b (bo'yi x eni) ----
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Площадь прямоугольника', uz: "To'rtburchak yuzasi" },
    lead: {
      ru: 'Итак, мы открыли правило. Чтобы найти площадь прямоугольника, число клеток в ряду умножают на число рядов.',
      uz: "Demak, biz qoidani kashf qildik. To'rtburchak yuzasini topish uchun qatordagi kataklar soni qatorlar soniga ko'paytiriladi."
    },
    rule_main: { ru: 'Площадь прямоугольника = длина умножить на ширину', uz: "To'rtburchak yuzasi = bo'yi ko'paytirilgan eni" },
    ex_easy: { ru: 'Например, 5 на 3: площадь = 5 умножить на 3 = 15 клеток. Не нужно считать по одной.', uz: "Masalan, 5 ga 3: yuza = 5 ni 3 ga ko'paytirsak = 15 katak. Bittalab sanash shart emas." },
    note: {
      ru: 'Главное — умножить длину на ширину. Это короткий путь вместо счёта по одной клетке.',
      uz: "Asosiysi — bo'yni enga ko'paytirish. Bu bittalab sanash o'rniga qisqa yo'l."
    },
    audio: {
      ru: "Запомни правило. Чтобы найти площадь прямоугольника, длину умножают на ширину. Например, у прямоугольника пять на три площадь равна пяти умножить на три, то есть пятнадцать клеток. Не нужно считать каждую клетку по отдельности, умножение делает это сразу.",
      uz: "Qoidani eslab qoling. To'rtburchak yuzasini topish uchun bo'yni enga ko'paytiriladi. Masalan, besh ga uch to'rtburchakning yuzasi beshni uchga ko'paytirgan, ya'ni o'n besh katak. Har bir katakni alohida sanash shart emas, ko'paytirish buni darrov bajaradi."
    }
  },

  // ---- s6 RULE 2 — kvadrat: S = a x a ----
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Площадь квадрата', uz: "Kvadrat yuzasi" },
    lead: {
      ru: 'А у квадрата всё ещё проще. У него длина и ширина равны, поэтому сторону умножают саму на себя.',
      uz: "Kvadratda esa bundan ham oson. Unda bo'y va en teng, shuning uchun tomon o'zini-o'ziga ko'paytiriladi."
    },
    rule_main: { ru: 'Площадь квадрата = сторона умножить на сторону', uz: "Kvadrat yuzasi = tomon ko'paytirilgan tomon" },
    ex_easy: { ru: 'Например, у квадрата со стороной 4: площадь = 4 умножить на 4 = 16 клеток.', uz: "Masalan, tomoni 4 kvadratning yuzasi = 4 ni 4 ga ko'paytirsak = 16 katak." },
    note: {
      ru: 'У квадрата длина и ширина одинаковые, поэтому площадь — это сторона, умноженная сама на себя.',
      uz: "Kvadratda bo'y va en bir xil, shuning uchun yuza — bu tomonni o'ziga ko'paytirgan."
    },
    audio: {
      ru: "У квадрата правило ещё проще. У квадрата длина и ширина одинаковые, поэтому сторону умножают саму на себя. Например, у квадрата со стороной четыре площадь равна четыре умножить на четыре, то есть шестнадцать клеток.",
      uz: "Kvadratda qoida yanada oson. Kvadratda bo'y va en bir xil, shuning uchun tomon o'zini-o'ziga ko'paytiriladi. Masalan, tomoni to'rt kvadratning yuzasi to'rtni to'rtga ko'paytirgan, ya'ni o'n olti katak."
    }
  },

  // ---- s7 RULE 3 / TIP — M1 ogohlantirish: yuza (ichi) perimetr (chegara) EMAS; sm va sm^2 ----
  s7: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    title: { ru: 'Не путай с периметром', uz: "Perimetr bilan adashtirmang" },
    lead: {
      ru: 'Но будь внимателен. Площадь легко спутать с периметром. Это разные вещи.',
      uz: "Lekin ehtiyot bo'ling. Yuzani perimetr bilan adashtirish oson. Bu har xil narsa."
    },
    point1: {
      ru: 'Периметр — это длина границы, мы идём ВОКРУГ и складываем стороны.',
      uz: "Perimetr — bu chegara uzunligi, biz shakl ATROFIDAN yuramiz va tomonlarni qo'shamiz."
    },
    point2: {
      ru: 'Площадь — это сколько клеток ВНУТРИ, мы умножаем длину на ширину.',
      uz: "Yuza — bu ICHIDA nechta katak borligi, biz bo'yni enga ko'paytiramiz."
    },
    point3: {
      ru: 'И единицы разные: длину меряют в сантиметрах, а площадь — в квадратных сантиметрах.',
      uz: "Birliklar ham har xil: uzunlik santimetrda, yuza esa kvadrat santimetrda o'lchanadi."
    },
    audio: {
      ru: "Запомни главное предостережение. Периметр это длина границы: мы идём вокруг фигуры и складываем стороны. А площадь это сколько клеток внутри: мы умножаем длину на ширину. Не путай их. И единицы тоже разные: длину меряют в сантиметрах, а площадь в квадратных сантиметрах.",
      uz: "Asosiy ogohlantirishni eslab qoling. Perimetr bu chegara uzunligi: biz shakl atrofidan yuramiz va tomonlarni qo'shamiz. Yuza esa bu ichida nechta katak borligi: biz bo'yni enga ko'paytiramiz. Ularni adashtirmang. Birliklar ham har xil: uzunlikni santimetrda, yuzani esa kvadrat santimetrda o'lchaydilar."
    }
  },

  // ---- s8 TEST MC — 4x3 yuzasi? correct 12 (C). Tuzoq 14 = perimetr. practice + FAKT Tarix ----
  s8: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Найди площадь', uz: "Yuzani toping" },
    lead: { ru: 'Теперь сам. У прямоугольника длина 4 и ширина 3. Чему равна его площадь в клетках?', uz: "Endi o'zingiz. To'rtburchakning bo'yi 4, eni 3. Uning yuzasi necha katak?" },
    opt0: { ru: '12', uz: '12' },
    opt1: { ru: '14', uz: '14' },
    opt2: { ru: '7', uz: '7' },
    opt3: { ru: '24', uz: '24' },
    correct_text: {
      ru: 'Верно. Площадь = 4 умножить на 3 = 12 клеток. Три ряда по 4 клетки.',
      uz: "To'g'ri. Yuza = 4 ni 3 ga ko'paytirsak = 12 katak. To'rttadan uchta qator."
    },
    wrong_1: {
      ru: 'Это периметр, длина границы. Стороны складывают по кругу. А площадь находят умножением, сосчитай клетки внутри и умножь длину на ширину.',
      uz: "Bu perimetr, chegara uzunligi. Tomonlar aylana bo'ylab qo'shiladi. Yuza esa ko'paytirish bilan topiladi, ichidagi kataklarni sanang va bo'yni enga ko'paytiring."
    },
    wrong_2: {
      ru: 'Здесь ты сложил стороны. Площадь не складывают, а умножают. Возьми длину столько раз, сколько рядов.',
      uz: "Bu yerda siz tomonlarni qo'shdingiz. Yuza qo'shilmaydi, balki ko'paytiriladi. Bo'yni qatorlar soniga ko'paytiring."
    },
    wrong_3: {
      ru: 'Это слишком много, вдвое больше нужного. Перемножь стороны один раз, не удваивай.',
      uz: "Bu juda ko'p, keragidan ikki barobar. Tomonlarni bir marta ko'paytiring, ikkilantirmang."
    },
    fact: {
      ru: 'Само слово «геометрия» значит «измерение земли». В Древнем Египте после разлива Нила поля заново перемеряли — так и родилась наука о площадях. Поэтому мы начинаем с измерения.',
      uz: "«Geometriya» so'zining o'zi «yer o'lchash» degani. Qadimgi Misrda Nil toshganidan keyin dalalar qayta o'lchangan — yuzalar haqidagi fan shunday tug'ilgan. Shuning uchun biz o'lchashdan boshlaymiz."
    },
    audio: {
      intro: {
        ru: 'У прямоугольника длина четыре и ширина три. Чему равна его площадь? Вспомни правило и выбери ответ.',
        uz: "To'rtburchakning bo'yi to'rt, eni uch. Uning yuzasi qancha? Qoidani eslang va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Двенадцать клеток. Кстати, слово геометрия значит измерение земли: в Древнем Египте после разлива Нила поля заново перемеряли, так и началась наука о площадях.',
        uz: "To'g'ri. O'n ikki katak. Aytgancha, geometriya so'zi yer o'lchash degani: qadimgi Misrda Nil toshganidan keyin dalalar qayta o'lchangan, yuzalar haqidagi fan shunday boshlangan."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s9 TEST NumInput — bo'yi 6, eni 4 -> yuza 24. practice ----
  s9: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Посчитай площадь', uz: "Yuzani hisoblang" },
    question: { ru: 'У прямоугольника длина 6 и ширина 4. Чему равна площадь в клетках?', uz: "To'rtburchakning bo'yi 6, eni 4. Yuzasi necha katak?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Площадь — это длина умножить на ширину. Не складывай стороны, а умножь: возьми 6 раз по 4 клетки.',
      uz: "Yuza — bu bo'yni enga ko'paytirish. Tomonlarni qo'shmang, balki ko'paytiring: 4 ta katakni 6 marta oling."
    },
    fb_correct: { ru: 'Верно. 6 умножить на 4 — это 24 клетки.', uz: "To'g'ri. 6 ni 4 ga ko'paytirsak — 24 katak." },
    audio: {
      intro: {
        ru: 'У прямоугольника длина шесть и ширина четыре. Чему равна площадь? Умножь длину на ширину и введи число.',
        uz: "To'rtburchakning bo'yi olti, eni to'rt. Yuzasi qancha? Bo'yni enga ko'paytiring va sonni kiriting."
      },
      on_correct: { ru: 'Верно. Двадцать четыре.', uz: "To'g'ri. Yigirma to'rt." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s10 TEST find-the-wrong — XATO hisobni top. correct = opt2 (6x4: yuza 20, aslida 24). practice ----
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    title: { ru: 'Где ошибка?', uz: "Xato qayerda?" },
    q_pre: { ru: 'Один из расчётов площади ', uz: 'Yuza hisoblaridan biri ' },
    q_em:  { ru: 'ОШИБОЧЕН', uz: 'XATO' },
    q_post: { ru: '. Найди именно его.', uz: ". Aynan o'shani toping." },
    opt0: { ru: 'Прямоугольник 5 и 2: площадь 10', uz: "To'rtburchak 5 va 2: yuza 10" },
    opt1: { ru: 'Квадрат со стороной 3: площадь 9', uz: "Tomoni 3 kvadrat: yuza 9" },
    opt2: { ru: 'Прямоугольник 6 и 4: площадь 20', uz: "To'rtburchak 6 va 4: yuza 20" },
    opt3: { ru: 'Квадрат со стороной 5: площадь 25', uz: "Tomoni 5 kvadrat: yuza 25" },
    correct_text: {
      ru: 'Верно, ошибка здесь. 20 — это периметр, граница: 6 плюс 4 плюс 6 плюс 4. А площадь это 6 умножить на 4 — это 24.',
      uz: "To'g'ri, xato shu. 20 — bu perimetr, chegara: 6 qo'shuv 4 qo'shuv 6 qo'shuv 4. Yuza esa 6 ni 4 ga ko'paytirgan — 24."
    },
    wrong_0: {
      ru: 'Это верно. Пять умножить на два это десять. Ошибка в другом расчёте.',
      uz: "Bu to'g'ri. Besh ni ikki ga ko'paytirsak o'n bo'ladi. Xato boshqa hisobda."
    },
    wrong_1: {
      ru: 'Это верно. У квадрата три умножить на три это девять. Ищи ошибку дальше.',
      uz: "Bu to'g'ri. Kvadratda uch ni uch ga ko'paytirsak to'qqiz bo'ladi. Xatoni boshqa joydan qidiring."
    },
    wrong_3: {
      ru: 'Это верно. У квадрата пять умножить на пять это двадцать пять. Ошибка не здесь.',
      uz: "Bu to'g'ri. Kvadratda besh ni besh ga ko'paytirsak yigirma besh bo'ladi. Xato bu yerda emas."
    },
    audio: {
      intro: {
        ru: 'Здесь вопрос наоборот. Один расчёт площади ошибочен. Найди именно ошибочный и выбери его.',
        uz: "Bu yerda savol teskari. Bitta yuza hisobi xato. Aynan xato bo'lganini toping va tanlang."
      },
      on_correct: {
        ru: 'Верно. Двадцать это периметр, а не площадь. Площадь шесть на четыре это двадцать четыре.',
        uz: "To'g'ri. Yigirma bu perimetr, yuza emas. Olti ga to'rt yuzasi yigirma to'rt."
      },
      on_wrong: { ru: 'Этот расчёт верный. Ошибка в другом.', uz: "Bu hisob to'g'ri. Xato boshqasida." }
    }
  },

  // ---- s11 TEST tap-to-shade — "4x3 = nechta katak? O'shancha bo'yang" -> 12. practice + FAKT Matematika ----
  s11: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Закрась площадь', uz: "Yuzani bo'yang" },
    lead: {
      ru: 'Закрась столько клеток, какова площадь прямоугольника 4 на 3. Нажимай на клетки, потом проверь.',
      uz: "Bo'yi 4, eni 3 to'rtburchakning yuzasi qancha bo'lsa, shuncha katakni bo'yang. Kataklarni bosing, keyin tekshiring."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    count_label: { ru: 'Закрашено клеток', uz: "Bo'yalgan kataklar" },
    hint_low: {
      ru: 'Пока мало. Площадь 4 на 3 — это длина умножить на ширину. Закрась столько клеток, сколько получится при умножении.',
      uz: "Hozircha kam. 4 ga 3 yuzasi — bu bo'yni enga ko'paytirgan. Ko'paytirish natijasi qancha bo'lsa, shuncha katakni bo'yang."
    },
    hint_high: {
      ru: 'Слишком много. Нужно ровно столько клеток, сколько даёт 4 умножить на 3. Убери лишние.',
      uz: "Juda ko'p. Aynan 4 ni 3 ga ko'paytirgan natijacha katak kerak. Ortiqchasini olib tashlang."
    },
    fb_correct: { ru: 'Верно. 12 клеток — это и есть площадь 4 умножить на 3.', uz: "To'g'ri. 12 ta katak — bu aynan 4 ni 3 ga ko'paytirgan yuza." },
    fact: {
      ru: 'У шахматной доски 8 рядов по 8 клеток, поэтому всего 8 умножить на 8 — это 64 клетки. Площадь любой клетчатой доски находят так же.',
      uz: "Shaxmat taxtasida 8 tadan 8 qator, shuning uchun hammasi 8 ni 8 ga ko'paytirgan — 64 katak. Har qanday katakli taxta yuzasi ham shunday topiladi."
    },
    audio: {
      intro: {
        ru: 'Закрась столько клеток, какова площадь прямоугольника четыре на три. Нажимай на клетки, а потом нажми проверить.',
        uz: "Bo'yi to'rt, eni uch to'rtburchakning yuzasi qancha bo'lsa, shuncha katakni bo'yang. Kataklarni bosing, keyin tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. Двенадцать клеток. Кстати, у шахматной доски восемь рядов по восемь, поэтому на ней всего шестьдесят четыре клетки.',
        uz: "To'g'ri. O'n ikki katak. Aytgancha, shaxmat taxtasida sakkiztadan sakkiz qator, shuning uchun unda hammasi oltmish to'rtta katak bor."
      },
      on_wrong: { ru: 'Пока не ровно. Посмотри подсказку.', uz: "Hozircha aniq emas. Maslahatga qarang." }
    }
  },

  // ---- s12 TEST drag-classify — chiplarni Yuza / Perimetr savatlariga ajratish. practice (M1+M3) ----
  s12: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Площадь или периметр?', uz: "Yuza yoki perimetr?" },
    lead: {
      ru: 'Разложи карточки по корзинам: что относится к площади, а что — к периметру. Нажми карточку, потом корзину. Затем проверь.',
      uz: "Kartochkalarni savatlarga ajrating: nimasi yuzaga, nimasi perimetrga tegishli. Kartochkani bosing, keyin savatni. So'ng tekshiring."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    bin_area: { ru: 'Площадь', uz: 'Yuza' },
    bin_per: { ru: 'Периметр', uz: 'Perimetr' },
    chip_mul: { ru: 'длина × ширина', uz: "bo'yi × eni" },
    chip_sum: { ru: 'сумма сторон', uz: "tomonlar yig'indisi" },
    chip_sm2: { ru: 'см²', uz: "sm²" },
    chip_sm: { ru: 'см', uz: "sm" },
    hint_wrong: {
      ru: 'Не всё на месте. Площадь — это умножение сторон и квадратные сантиметры. Периметр — сумма сторон и просто сантиметры.',
      uz: "Hammasi joyida emas. Yuza — bu tomonlarni ko'paytirish va kvadrat santimetr. Perimetr — tomonlar yig'indisi va oddiy santimetr."
    },
    fb_correct: { ru: 'Верно. Площадь — умножение и см². Периметр — сумма сторон и см.', uz: "To'g'ri. Yuza — ko'paytirish va sm². Perimetr — tomonlar yig'indisi va sm." },
    audio: {
      intro: {
        ru: 'Разложи карточки по двум корзинам: площадь и периметр. Нажми на карточку, затем на нужную корзину. Когда разложишь все, нажми проверить.',
        uz: "Kartochkalarni ikki savatga ajrating: yuza va perimetr. Kartochkani bosing, keyin kerakli savatni bosing. Hammasini ajratgach, tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Площадь это умножение, периметр это сумма сторон.', uz: "To'g'ri. Yuza bu ko'paytirish, perimetr bu tomonlar yig'indisi." },
      on_wrong:   { ru: 'Пока не всё верно. Посмотри подсказку.', uz: "Hozircha hammasi to'g'ri emas. Maslahatga qarang." }
    }
  },

  // ---- s13 CASE setup — Shahnoza xona poliga koshin (6x4) ----
  s13: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Плитки для пола', uz: "Pol uchun koshinlar" },
    lead: {
      ru: 'Шахноза выкладывает пол комнаты квадратными плитками. Пол прямоугольный: 6 метров в длину и 4 в ширину, а каждая плитка — это квадрат 1 на 1 метр. Сколько плиток нужно на весь пол?',
      uz: "Shahnoza xona poliga kvadrat koshinlar teradi. Pol to'rtburchak: bo'yi 6 metr, eni 4 metr, har bir koshin esa 1 ga 1 metrli kvadrat. Butun polga nechta koshin kerak?"
    },
    note: {
      ru: 'Плитки заполняют пол изнутри, как наши клетки. Значит, нужна площадь пола, а не граница.',
      uz: "Koshinlar polni ichidan to'ldiradi, xuddi bizning kataklar kabi. Demak, chegara emas, polning yuzasi kerak."
    },
    hint_calc: {
      ru: 'Площадь — это длина умножить на ширину: 6 умножить на 4. Столько плиток и поместится.',
      uz: "Yuza — bu bo'yni enga ko'paytirish: 6 ni 4 ga ko'paytirgan. Shuncha koshin sig'adi."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: "Шахноза выкладывает пол комнаты квадратными плитками. Пол прямоугольный, в длину шесть метров и в ширину четыре, а каждая плитка это квадрат один на один метр. Плитки заполняют пол изнутри, как наши клетки, значит нужна площадь пола, а не его граница. Чтобы узнать число плиток, умножь длину на ширину.",
      uz: "Shahnoza xona poliga kvadrat koshinlar teradi. Pol to'rtburchak, bo'yi olti metr, eni to'rt, har bir koshin esa bir ga bir metrli kvadrat. Koshinlar polni ichidan to'ldiradi, xuddi bizning kataklar kabi, demak chegara emas, polning yuzasi kerak. Koshinlar sonini bilish uchun bo'yni enga ko'paytiring."
    }
  },

  // ---- s14 CASE/FINAL MC — koshin soni? correct 24 (A). Tuzoq 20 = perimetr. final + FAKT IT ----
  s14: {
    eyebrow: { ru: 'Итоговая задача', uz: 'Yakuniy masala' },
    title: { ru: 'Сколько плиток нужно?', uz: "Nechta koshin kerak?" },
    lead: {
      ru: 'Пол 6 на 4 метра, плитки по 1 метру. Сколько всего плиток нужно на весь пол?',
      uz: "Pol 6 ga 4 metr, koshinlar 1 metrdan. Butun polga hammasi bo'lib nechta koshin kerak?"
    },
    opt0: { ru: '24', uz: '24' },
    opt1: { ru: '20', uz: '20' },
    opt2: { ru: '10', uz: '10' },
    opt3: { ru: '48', uz: '48' },
    correct_text: {
      ru: 'Верно. Площадь пола = 6 умножить на 4 = 24 плитки. Шесть рядов по 4 плитки.',
      uz: "To'g'ri. Pol yuzasi = 6 ni 4 ga ko'paytirsak = 24 koshin. To'rttadan oltita qator."
    },
    wrong_1: {
      ru: 'Это периметр, граница пола. Стороны складывают по кругу. А плитки заполняют пол внутри, умножь длину на ширину.',
      uz: "Bu perimetr, pol chegarasi. Tomonlar aylana bo'ylab qo'shiladi. Koshinlar esa polni ichidan to'ldiradi, bo'yni enga ko'paytiring."
    },
    wrong_2: {
      ru: 'Здесь ты сложил стороны. Плитки внутри считают умножением, длину на ширину.',
      uz: "Bu yerda siz tomonlarni qo'shdingiz. Ichidagi koshinlar ko'paytirish bilan sanaladi, bo'yni enga."
    },
    wrong_3: {
      ru: 'Это слишком много, вдвое больше нужного. Перемножь стороны один раз, не удваивай.',
      uz: "Bu juda ko'p, keragidan ikki barobar. Tomonlarni bir marta ko'paytiring, ikkilantirmang."
    },
    fact: {
      ru: 'Экран телефона состоит из миллионов крошечных квадратиков — пикселей. Размер картинки тоже считают так: ширину умножают на высоту в пикселях. Например, 1000 на 2000 — это два миллиона пикселей.',
      uz: "Telefon ekrani millionlab mayda kvadratchalardan — piksellardan iborat. Rasm o'lchami ham shunday hisoblanadi: kenglik balandlikka ko'paytiriladi. Masalan, 1000 ga 2000 — bu ikki million piksel."
    },
    audio: {
      intro: {
        ru: 'Последняя задача. Пол шесть на четыре метра, плитки по одному метру. Сколько плиток нужно на весь пол? Это площадь пола, посчитай и выбери ответ.',
        uz: "Oxirgi masala. Pol olti ga to'rt metr, koshinlar bir metrdan. Butun polga nechta koshin kerak? Bu polning yuzasi, hisoblang va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Двадцать четыре плитки. Кстати, экран телефона состоит из миллионов квадратиков-пикселей, и размер картинки считают так же: ширину умножают на высоту.',
        uz: "To'g'ri. Yigirma to'rt koshin. Aytgancha, telefon ekrani millionlab kvadratcha-piksellardan iborat, va rasm o'lchami ham shunday hisoblanadi: kenglik balandlikka ko'paytiriladi."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s15 SUMMARY — hookni yopadi + ConnectionsBlock ----
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    heading: { ru: 'Площадь освоена', uz: "Yuza o'zlashtirildi" },
    title: { ru: 'Вернёмся к блокам на участке.', uz: "Uchastkadagi bloklarga qaytamiz." },
    main_label: { ru: 'Главное', uz: 'Asosiy' },
    main_1: { ru: 'Площадь — это сколько одинаковых квадратиков помещается ВНУТРИ фигуры.', uz: "Yuza — bu shakl ICHIGA nechta bir xil kvadratcha sig'ishi." },
    main_2: {
      ru: 'У прямоугольника площадь = длина умножить на ширину. У квадрата = сторона умножить на сторону.',
      uz: "To'rtburchak yuzasi = bo'yni enga ko'paytirgan. Kvadrat yuzasi = tomonni tomonga ko'paytirgan."
    },
    main_3: {
      ru: 'Площадь — это серединка, а не граница. Не путай её с периметром, и считай в квадратных сантиметрах.',
      uz: "Yuza — bu o'rta, chegara emas. Uni perimetr bilan chalkashtirmang va kvadrat santimetrda hisoblang."
    },
    hook_close: {
      ru: '5 плиток в ряд и 3 ряда — не нужно считать по одной. Площадь = 5 умножить на 3 = 15 плиток. Умножение и есть быстрый способ сосчитать клетки.',
      uz: "Bir qatorda 5 ta, qator 3 ta — bittalab sanash shart emas. Yuza = 5 ni 3 ga ko'paytirsak = 15 koshin. Ko'paytirish — kataklarni tez sanashning aynan o'zi."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: '«Периметр прямоугольника» (граница) и «Умножение столбиком».',
      uz: "«To'rtburchak perimetri» (chegara) va «Ustun shaklida ko'paytirish»."
    },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'площадь треугольника: это половина прямоугольника.',
      uz: "uchburchak yuzasi: bu to'rtburchakning yarmi."
    },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    score_label: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    audio: {
      ru: "Подведём итог. Площадь это сколько одинаковых квадратиков помещается внутри фигуры. У прямоугольника площадь равна длине умножить на ширину, у квадрата стороне умножить на сторону. И помни: площадь это серединка, а не граница, не путай её с периметром, и меряй в квадратных сантиметрах. Поэтому пять плиток в ряд и три ряда это пять умножить на три, всего пятнадцать плиток. Умножение и есть быстрый способ сосчитать клетки.",
      uz: "Xulosa qilamiz. Yuza bu shakl ichiga nechta bir xil kvadratcha sig'ishi. To'rtburchak yuzasi bo'yni enga ko'paytirgan, kvadrat yuzasi tomonni tomonga ko'paytirgan. Va esda tuting: yuza bu o'rta, chegara emas, uni perimetr bilan chalkashtirmang va kvadrat santimetrda o'lchang. Shuning uchun bir qatorda besh koshin va uch qator bu beshni uchga ko'paytirgan, hammasi o'n besh koshin. Ko'paytirish kataklarni tez sanashning aynan o'zi."
    }
  }

};

// ============================================================
// MAJBURIY YORDAMCHILAR (infrastructure_v1 / Dars28 bilan baytma-bayt)
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

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Tematik dekor (yuza mavzusi): sekin suzuvchi birlik kvadratchalar — bo'sh joyni boyitadi.
const FloatTiles = () => (
  <div className="flt" aria-hidden="true">
    <span className="flt-c flt-1"/>
    <span className="flt-c flt-2"/>
    <span className="flt-c flt-3"/>
    <span className="flt-c flt-4"/>
    <span className="flt-c flt-5"/>
    <span className="flt-c flt-6"/>
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_HIST = { ru: 'Знаешь ли ты? · История',    uz: "Bilasizmi? · Tarix" };
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

// Geometriya = "yer o'lchash" — dala ustidan o'lchov chizig'i yuradi (CSS loop). Tarix.
const AnimLand = () => (<div className="fa-ld" aria-hidden="true"><span className="fa-ld-plot"/><span className="fa-ld-scan"/></div>);
// Shaxmat taxtasi 4x4 — yengil pulse (CSS loop). Matematika.
const AnimChess = () => (
  <div className="fa-ch" aria-hidden="true">
    {Array.from({ length: 16 }).map((_, i) => {
      const dark = (((i % 4) + Math.floor(i / 4)) % 2) === 0;
      return <span key={i} className={`fa-ch-c${dark ? ' fa-ch-d' : ''}`}/>;
    })}
  </div>
);
// Ekran piksellari 4x4 — to'lqinli yorishuv (CSS loop). IT.
const AnimPixels = () => (
  <div className="fa-px" aria-hidden="true">
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} className="fa-px-c" style={{ animationDelay: `${(((i % 4) + Math.floor(i / 4)) * 0.12)}s` }}/>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATORLAR — geom_5_02 (TileGrid: birlik kvadratlar bilan to'ldirish)
// ============================================================
// TileGrid: to'rtburchak cols x rows birlik kataklar; filled = to'ldirilgan kataklar soni
// (row-major, null = hammasi); unit — o'lcham birligi belgisi; compact — kichik; glow — yoritish.
const TileGrid = ({ cols = 5, rows = 3, filled = null, unit = '', compact = false, glow = false, stagger = false, success = false }) => {
  const total = cols * rows;
  const fill = filled === null ? total : filled;
  const big = Math.max(cols, rows);
  const cell = compact ? (big >= 8 ? 16 : 22) : (big >= 8 ? 24 : 32);
  return (
    <div className={`tg-host${glow ? ' tg-glow' : ''}${success ? ' tg-ok' : ''}`} aria-hidden="true">
      {unit !== '' && <span className="tg-dim tg-dim-top">{cols}{unit}</span>}
      {unit !== '' && <span className="tg-dim tg-dim-left">{rows}{unit}</span>}
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

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK ("nega ko'paytiramiz?"). Qaytish: picked TO'LIQ sbros.
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
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', padding: 'clamp(14px, 2.6vw, 22px) clamp(10px, 2vw, 16px)', display: 'flex', justifyContent: 'center' }}>
          <TileGrid cols={5} rows={3}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center' }}>{mt(t(c.reveal))}</p>}
      </div>
    </Stage>
  );
};

// s1 — WARM-UP (perimetr retrieval) QuestionScreen orqali (correct B)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (birlik kataklar bilan to'ldirish: filled 0..15, qatorma-qator)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const COLS = 5; const ROWS = 3; const MAX = ROWS;
  const [step, setStep] = useState(0);
  const doneAnnouncedRef = useRef(false);
  const caps = c.caps[lang] || c.caps.ru;
  const done = step >= MAX;
  const filled = step * COLS;
  const doStep = () => {
    if (done) return;
    const nv = step + 1;
    setStep(nv);
    if (nv >= MAX && !doneAnnouncedRef.current) {
      doneAnnouncedRef.current = true;
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.done[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <TileGrid cols={COLS} rows={ROWS} filled={filled} glow={done}/>
          <div className="yz-calc">
            <span className={filled > 0 ? 'yz-calc-on' : 'yz-calc-off'}>{filled}</span>
            <span className="yz-calc-op">{lang === 'uz' ? 'ta katak' : 'клеток'}</span>
          </div>
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={doStep} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[step])}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (birlik kvadrat: 1 sm x 1 sm = 1 sm^2)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(18px, 4vw, 36px)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div className="us-unit"><span className="us-lbl us-lbl-top">1 sm</span><span className="us-lbl us-lbl-left">1 sm</span><span className="us-area">1 sm²</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <TileGrid cols={3} rows={2}/>
            <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? '6 ta birlik kvadrat' : '6 единичных квадратов'}</span>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.note_unit))}</p>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note_many))}</p>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (jonli slayder: bo'y a o'zgaradi, en=4; S = a x 4)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const B = 4;
  const [a, setA] = useState(5);
  const area = a * B;
  const isSquare = a === B;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <TileGrid cols={a} rows={B} glow={isSquare}/>
          <div className="yz-calc">
            <span className="yz-calc-on">{a}</span><span className="yz-calc-op">×</span><span className="yz-calc-on">{B}</span>
            <span className="yz-calc-op">=</span><span className="yz-calc-res">{area}</span>
          </div>
        </div>
        <div className="fade-up delay-2"><Slider value={a} min={2} max={7} step={1} onChange={setA}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: isSquare ? T.success : T.ink2, fontWeight: isSquare ? 600 : 400 }}>{mt(t(isSquare ? c.note_square : c.hint_move))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 1 (S = a x b) + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <TileGrid cols={5} rows={3} compact={true}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s6 — RULE 2 (kvadrat S = a x a) + ambient
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <TileGrid cols={4} rows={4} compact={true} glow={true}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s7 — RULE 3 / TIP (M1: yuza perimetr emas; sm va sm^2) + ambient
const Screen7 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <FloatTiles/>
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

// s8 — TEST MC (4x3 yuzasi 12, correct C) + Fakt Tarix
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 3, 0, 2]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.lead))}</h2></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <TileGrid cols={4} rows={3} compact={true} filled={solved ? 12 : 0} stagger={solved} success={solved}/>} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimLand/>}/>}/>;
};

// s9 — TEST NumInput (6x4 -> 24)
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={24} renderVisual={({ solved }) => <TileGrid cols={6} rows={4} compact={true} filled={solved ? 24 : 0} stagger={solved} success={solved}/>}/>;
};

// s10 — TEST find-the-wrong (correct = opt2 "6x4: yuza 20", shuffle -> D)
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.q_pre)}<span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — TEST tap-to-shade (4x3 yuzasi = 12 katakni bo'yang) + Fakt Matematika
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's11_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const COLS = 5; const ROWS = 4; const TOTAL = COLS * ROWS; const TARGET = 12;
  const wasSolved = storedAnswer?.solved === true;
  const solvedFill = () => { const a = Array(TOTAL).fill(false); for (let i = 0; i < TARGET; i++) a[i] = true; return a; };
  const [cells, setCells] = useState(() => (wasSolved ? solvedFill() : Array(TOTAL).fill(false)));
  const [solved, setSolved] = useState(wasSolved);
  const [hintKind, setHintKind] = useState(null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const count = cells.filter(Boolean).length;
  const toggle = (i) => { if (solved) return; setHintKind(null); setCells(prev => { const n = [...prev]; n[i] = !n[i]; return n; }); };
  const check = () => {
    if (solved) return;
    const ok = count === TARGET;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHintKind(null); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[11].scope, screenIdx: 11, question: c.lead[lang], correctAnswer: String(TARGET), studentAnswer: String(count), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setHintKind(count < TARGET ? 'low' : 'high');
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const hintText = hintKind === 'low' ? c.hint_low : c.hint_high;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <div className="fade-up" style={{ maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(10px, 1.8vw, 14px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
          <h2 className="title h-title" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div className={`sh-grid${solved ? ' sh-ok' : ''}`} style={{ gridTemplateColumns: `repeat(${COLS}, clamp(30px, 6.6vw, 44px))`, gridTemplateRows: `repeat(${ROWS}, clamp(30px, 6.6vw, 44px))` }}>
            {cells.map((on, i) => (
              <button key={i} className={`sh-cell${on ? ' sh-on' : ''}`} disabled={solved} onClick={() => toggle(i)} aria-label="cell"/>
            ))}
          </div>
          <p className="small mono" style={{ margin: 0, color: count === TARGET ? T.success : T.ink2 }}>{t(c.count_label)}: <span style={{ fontWeight: 700 }}>{count}</span></p>
        </div>
        {hintKind && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(hintText))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
            <div style={{ marginTop: 12 }}><FactCard text={c.fact} badge={FB_MATH} anim={<AnimChess/>}/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s12 — TEST drag-classify (Yuza / Perimetr savatlari)
const CHIPS12 = [
  { id: 'mul', bin: 'area', label: 'chip_mul' },
  { id: 'sum', bin: 'per',  label: 'chip_sum' },
  { id: 'sm2', bin: 'area', label: 'chip_sm2' },
  { id: 'sm',  bin: 'per',  label: 'chip_sm' }
];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's12_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const solvedPlace = () => { const o = {}; CHIPS12.forEach(ch => { o[ch.id] = ch.bin; }); return o; };
  const [place, setPlace] = useState(() => (wasSolved ? solvedPlace() : { mul: null, sum: null, sm2: null, sm: null }));
  const [held, setHeld] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const placeIn = (bin, chipId) => { if (solved || !chipId) return; setPlace(prev => ({ ...prev, [chipId]: bin })); setHeld(null); setHintShown(false); };
  const tapChip = (id) => { if (solved) return; setHeld(h => (h === id ? null : id)); };
  const tapBin = (bin) => { if (solved) return; if (held) placeIn(bin, held); };
  const clearChip = (id) => { if (solved) return; setPlace(prev => ({ ...prev, [id]: null })); setHintShown(false); };
  const allPlaced = CHIPS12.every(ch => place[ch.id]);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = CHIPS12.every(ch => place[ch.id] === ch.bin);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[12].scope, screenIdx: 12, question: c.lead[lang], correctAnswer: 'area:mul,sm2 / per:sum,sm', studentAnswer: JSON.stringify(place), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setHintShown(true); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const trayChips = CHIPS12.filter(ch => !place[ch.id]);
  const binChips = (bin) => CHIPS12.filter(ch => place[ch.id] === bin);
  const renderBin = (bin, labelNode) => (
    <button className={`cl-bin${solved ? ' cl-bin-ok' : ''}`} disabled={solved} onClick={() => tapBin(bin)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); placeIn(bin, held); }}>
      <span className="cl-bin-label">{labelNode}</span>
      <div className="cl-bin-drop">
        {binChips(bin).map(ch => (
          <span key={ch.id} className="cl-chip cl-chip-set" onClick={(e) => { e.stopPropagation(); clearChip(ch.id); }}>{mt(t(c[ch.label]))}</span>
        ))}
      </div>
    </button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <div className="fade-up" style={{ maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(10px, 1.8vw, 14px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
          <h2 className="title h-title" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="cl-bins fade-up delay-1">
          {renderBin('area', t(c.bin_area))}
          {renderBin('per', t(c.bin_per))}
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div className="cl-tray">
              {trayChips.map(ch => (
                <button key={ch.id} className={`cl-chip${held === ch.id ? ' cl-held' : ''}`} draggable onDragStart={() => setHeld(ch.id)} onClick={() => tapChip(ch.id)}>{mt(t(c[ch.label]))}</button>
              ))}
              {trayChips.length === 0 && <span className="small mono" style={{ color: T.ink3 }}>{lang === 'uz' ? 'Hammasi joylashtirildi' : 'Все разложены'}</span>}
            </div>
          </div>
        )}
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} disabled={!allPlaced} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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

// s13 — CASE setup (Shahnoza xona poliga koshin 6x4)
const Screen13 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px) clamp(10px, 2vw, 16px)' }}>
          <TileGrid cols={6} rows={4} unit="m"/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s14 — CASE/FINAL MC (koshin 6x4 -> 24, correct A) + Fakt IT
const Screen14 = (props) => {
  const t = useT(); const c = CONTENT.s14;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.lead))}</h2></>);
  return <QuestionScreen {...props} idx={14} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[14]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={(solved) => <TileGrid cols={6} rows={4} compact={true} filled={solved ? 24 : 0} stagger={solved} success={solved}/>} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimPixels/>}/>}/>;
};

// s15 — SUMMARY + hook yopilishi + bog'lanishlar + ambient
const Screen15 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s15;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers && answers[i] && answers[i].correct).length;
  const total = scoredIdx.length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
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

// ============================================================
// KORNEVOY KOMPONENT
// ============================================================
export default function AreaLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];
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


/* MATH geom_5_02: TileGrid — birlik kvadratlar bilan to'ldirish (CSS pop + uzluksiz breathe loop). */
.tg-host { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: clamp(14px, 3vw, 24px) clamp(10px, 2.4vw, 18px) clamp(8px, 1.6vw, 12px) clamp(20px, 4vw, 32px); }
.tg-grid { display: grid; gap: 2px; background: #A7A6A2; padding: 2px; border-radius: 4px; animation: tgBreathe 3.6s ease-in-out infinite; }
.tg-glow .tg-grid { animation: tgGlow 0.9s ease, tgBreathe 3.6s ease-in-out infinite; }
.tg-cell { background: #FFFFFF; border-radius: 2px; transition: background 0.3s ease, box-shadow 0.3s ease; }
.tg-on { background: #FF4F28; box-shadow: 0 0 6px rgba(255, 79, 40, 0.45); animation: tgPop 0.3s ease both; }
.tg-pop { transform-origin: center; animation: tgPop 0.4s ease-out both; }
.tg-ok .tg-on { background: #1F7A4D; box-shadow: 0 0 6px rgba(31, 122, 77, 0.45); }
@keyframes tgPop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes tgBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 12px rgba(255, 79, 40, 0.14); } }
@keyframes tgGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 14px rgba(255, 79, 40, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }
.tg-dim { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 2vw, 14px); color: #5A5A60; white-space: nowrap; }
.tg-dim-top { top: 0; left: 50%; transform: translateX(-50%); }
.tg-dim-left { left: 0; top: 50%; transform: translateY(-50%); }

/* MATH geom_5_02: yz-calc — yuza ko'paytmasi (a x b = res). */
.yz-calc { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 3vw, 22px); flex-wrap: wrap; justify-content: center; }
.yz-calc-on { color: #FF4F28; }
.yz-calc-op { color: #A7A6A2; }
.yz-calc-off { color: #A7A6A2; opacity: 0.5; }
.yz-calc-res { color: #019ACB; min-width: 1.2em; text-align: center; }

/* MATH geom_5_02: us-unit — bitta birlik kvadrat (1 sm x 1 sm = 1 sm^2). */
.us-unit { position: relative; width: clamp(54px, 12vw, 76px); height: clamp(54px, 12vw, 76px); background: rgba(255, 79, 40, 0.12); border: 3px solid #FF4F28; border-radius: 4px; display: flex; align-items: center; justify-content: center; animation: tgBreathe 3.6s ease-in-out infinite; }
.us-area { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 2vw, 13px); color: #FF4F28; }
.us-lbl { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px, 1.8vw, 12px); color: #5A5A60; white-space: nowrap; }
.us-lbl-top { bottom: 100%; left: 50%; transform: translate(-50%, -4px); }
.us-lbl-left { right: 100%; top: 50%; transform: translate(-6px, -50%); }

/* MATH geom_5_02: sh-grid — tap-to-shade test (kataklarni bosib bo'yash). */
.sh-grid { display: grid; gap: 3px; background: #A7A6A2; padding: 3px; border-radius: 5px; animation: tgBreathe 3.6s ease-in-out infinite; }
.sh-grid.sh-ok { animation: tgGlow 0.9s ease, tgBreathe 3.6s ease-in-out infinite; }
.sh-cell { border: none; background: #FFFFFF; border-radius: 2px; cursor: pointer; transition: background 0.15s ease, box-shadow 0.15s ease; padding: 0; }
.sh-cell:hover:not(:disabled) { background: #FDFBF7; }
.sh-on { background: #FF4F28; box-shadow: 0 0 6px rgba(255, 79, 40, 0.4); }
.sh-ok .sh-on { background: #1F7A4D; box-shadow: 0 0 6px rgba(31, 122, 77, 0.4); }
.sh-cell:disabled { cursor: default; }

/* MATH geom_5_02: cl — drag/tap-classify (Yuza / Perimetr savatlari). */
.cl-bins { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; }
.cl-bin { flex: 1; max-width: 260px; min-height: clamp(96px, 18vw, 128px); border-radius: 14px; border: 2px dashed #A7A6A2; background: #FFFFFF; cursor: pointer; transition: border-color 0.15s, background 0.15s; display: flex; flex-direction: column; gap: 8px; padding: clamp(10px, 2vw, 14px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.12); animation: clBreathe 4s ease-in-out infinite; }
.cl-bin:hover:not(:disabled) { border-color: #FF4F28; }
.cl-bin-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; animation: none; }
.cl-bin:disabled { cursor: default; }
.cl-bin-label { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px, 2.4vw, 18px); color: #0E0E10; text-align: center; }
.cl-bin-drop { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; flex: 1; }
@keyframes clBreathe { 0%, 100% { box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.12); } 50% { box-shadow: 0 8px 20px -6px rgba(1, 154, 203, 0.2); } }
.cl-tray { display: flex; gap: clamp(8px, 1.8vw, 12px); flex-wrap: wrap; justify-content: center; min-height: 44px; align-items: center; }
.cl-chip { border: none; background: #FFFFFF; border-radius: 12px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px, 2vw, 15px); color: #0E0E10; cursor: pointer; transition: box-shadow 0.15s, color 0.15s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.16); padding: clamp(8px, 1.6vw, 11px) clamp(12px, 2.2vw, 16px); touch-action: none; }
.cl-chip:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.24); }
.cl-held { box-shadow: 0 0 0 2px #FF4F28, 0 8px 20px -6px rgba(255, 79, 40, 0.34); color: #FF4F28; }
.cl-chip-set { background: #FFE8E1; color: #FF4F28; box-shadow: none; padding: 6px 10px; font-size: clamp(12px, 1.8vw, 14px); }
.cl-bin-ok .cl-chip-set { background: #FFFFFF; color: #1F7A4D; }

/* MATH geom_5_02: факт-анимации (CSS-only loop, ko'k/yashil tema, qutiga sig'adi). */
/* Geometriya = "yer o'lchash" — dala ustidan o'lchov chizig'i yuradi (Tarix). */
.fa-ld { position: relative; width: clamp(72px, 15vw, 100px); height: clamp(54px, 11vw, 76px); }
.fa-ld-plot { position: absolute; inset: 0; background: rgba(1, 154, 203, 0.12); border: 3px solid #019ACB; border-radius: 4px; }
.fa-ld-scan { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: #1F7A4D; box-shadow: 0 0 8px rgba(31, 122, 77, 0.55); animation: faLd 2.6s ease-in-out infinite; }
@keyframes faLd { 0% { top: 0; } 50% { top: calc(100% - 3px); } 100% { top: 0; } }
/* Shaxmat taxtasi 4x4 — yengil ichki pulse (Matematika). */
.fa-ch { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); width: clamp(60px, 12vw, 82px); height: clamp(60px, 12vw, 82px); border: 2px solid #019ACB; border-radius: 3px; overflow: hidden; animation: faChPulse 3s ease-in-out infinite; }
.fa-ch-c { background: #EAF6FB; }
.fa-ch-d { background: #019ACB; }
@keyframes faChPulse { 0%, 100% { box-shadow: inset 0 0 0 rgba(1, 154, 203, 0); } 50% { box-shadow: inset 0 0 14px rgba(1, 154, 203, 0.45); } }
/* Ekran piksellari 4x4 — to'lqinli yorishuv (IT). */
.fa-px { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); gap: 3px; width: clamp(58px, 12vw, 82px); height: clamp(58px, 12vw, 82px); }
.fa-px-c { background: #019ACB; border-radius: 2px; opacity: 0.22; animation: faPx 1.8s ease-in-out infinite; }
@keyframes faPx { 0%, 100% { opacity: 0.18; } 50% { opacity: 1; } }

/* MATH geom_5_02: flt — dekorativ suzuvchi birlik kvadratchalar (yuza mavzusi, sekin, yengil). */
.flt { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.flt-c { position: absolute; width: 18px; height: 18px; border-radius: 4px; opacity: 0.5; background: linear-gradient(135deg, rgba(255, 79, 40, 0.22), rgba(255, 79, 40, 0.06)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.18); animation: fltFloat 16s ease-in-out infinite; }
.flt-1 { left: 7%; top: 16%; animation-delay: 0s; }
.flt-2 { right: 9%; top: 22%; width: 13px; height: 13px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.22), rgba(1, 154, 203, 0.06)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.18); animation-delay: -6s; }
.flt-3 { left: 14%; bottom: 14%; width: 14px; height: 14px; animation-delay: -10s; }
.flt-4 { right: 13%; bottom: 20%; width: 20px; height: 20px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.2), rgba(1, 154, 203, 0.05)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.16); animation-delay: -3s; }
.flt-5 { left: 30%; top: 8%; width: 12px; height: 12px; animation-delay: -13s; }
.flt-6 { right: 32%; bottom: 9%; width: 15px; height: 15px; background: linear-gradient(135deg, rgba(255, 79, 40, 0.18), rgba(255, 79, 40, 0.05)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.15); animation-delay: -8s; }
@keyframes fltFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.45; } 50% { transform: translateY(-14px) rotate(6deg); opacity: 0.75; } }

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
`;
