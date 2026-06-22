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
// --- UROK: frac_5_15 — Сложение и вычитание смешанных чисел / Aralash sonlarni qo'shish va ayirish ---
// Infra Dars28 (baytma-bayt) + Stage fon-on-all. Keep-visible standart (PROMPT 2-B/2-C). Etalon 9/28/37.
// Vizualizator: MixedBar (butun plitka + qisman plitka; carry=ko'chirish, borrow=qarz olish/sinish).
// Personajsiz hook (nega-ramka); case Nilufar (lenta), yakuniy Saida (masofa). Drag: mixfill + dragbin(3-savat).
// ============================================================
const LESSON_META = {
  lessonId: 'frac_5_15',
  lessonTitle: { ru: 'Сложение и вычитание смешанных чисел', uz: "Aralash sonlarni qo'shish va ayirish" }
};
const TOTAL_SCREENS = 12;

// Obuchayushchiy dars: proverochnye ekrany scored (pervaya popytka -> LMS), summary bez schyota.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0  why-framed (M1: nega 4/3 ni butunga)
  { id: 's1',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 1  warm-up: noto'g'ri kasr -> aralash (prereq frac_5_14)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  qo'shish + ko'chirish
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 3  ayirish + qarz olish
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 4  har xil maxraj
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 5  qoida + 2-usul
  { id: 's6',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // 6  drag-FILL (mixfill)
  { id: 's7',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' }, // 7  5 oson savol
  { id: 's8',  type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 8  case (Nilufar, lenta)
  { id: 's9',  type: 'test',        template: 'SeqMix',         scored: true,  scope: 'practice' }, // 9  6-8 misol, har xil tip
  { id: 's10', type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'final' },    // 10 yakuniy (Saida, masofa)
  { id: 's11', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 11 yakun + ConnectionsBlock
];

const CONTENT = {
  // ===== s0 HOOK (konseptual, personajsiz): javobda 4/3 qolsa nega butunga ajratamiz? =====
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    title: { ru: 'В ответе осталось 4/3. Это конец?', uz: "Javobda 4/3 qoldi. Bu oxirimi?" },
    lead: { ru: 'Сложили 1 2/3 + 2 2/3 и получили 3 целых и 4/3.', uz: "1 2/3 + 2 2/3 ni qo'shib, 3 butun va 4/3 hosil qildik." },
    question: { ru: '4/3 — это меньше одного целого или больше?', uz: "4/3 — bir butundan kam yoki ko'pmi?" },
    opt0: { ru: 'Больше: 4/3 = 1 целый и 1/3, его выделяют → 4 1/3', uz: "Ko'p: 4/3 = 1 butun va 1/3, uni ajratamiz → 4 1/3" },
    opt1: { ru: 'Ровно или меньше: 3 4/3 — это и есть ответ', uz: "Teng yoki kam: 3 4/3 — bu javobning o'zi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    reveal0: { ru: 'Верно. В 4/3 умещается одно целое (3/3) и ещё 1/3. Его выделяют: 3 + 1 1/3 = 4 1/3.', uz: "To'g'ri. 4/3 ichida bitta butun (3/3) va yana 1/3 bor. Uni ajratamiz: 3 + 1 1/3 = 4 1/3." },
    reveal1: { ru: 'Так оставлять нельзя. 4/3 больше одного целого, поэтому ответ ещё не готов — нужно выделить целое.', uz: "Bunday qoldirib bo'lmaydi. 4/3 bir butundan ko'p, shuning uchun javob hali tayyor emas — butunni ajratish kerak." },
    reveal2: { ru: 'Посмотрим на плитках, что такое 4/3.', uz: "4/3 nimaligini plitkalarda ko'ramiz." },
    audio: { ru: 'Сложили одну целую две третьих и две целых две третьих, получилось три целых и четыре третьих. Четыре третьих больше одного целого, ведь три третьих это уже целое. Как думаешь, такой ответ готов? Выбери ответ.', uz: "Bir butun uchdan ikki va ikki butun uchdan ikkini qo'shib, uch butun va uchdan to'rt hosil qildik. Uchdan to'rt bir butundan ko'p, chunki uchdan uch allaqachon bitta butun. Sizningcha, bunday javob tayyormi? Javobni tanlang." }
  },

  // ===== s1 WARM-UP (QuestionScreen): noto'g'ri kasrni aralash songa (prereq frac_5_14) =====
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslab olamiz" },
    title: { ru: 'Сначала вспомним один приём', uz: "Avval bitta usulni eslaymiz" },
    question: { ru: '7/4 — переведи в смешанное число.', uz: "7/4 ni aralash songa aylantiring." },
    opt0: { ru: '1 3/4', uz: '1 3/4' },
    opt1: { ru: '1 1/4', uz: '1 1/4' },
    opt2: { ru: '3 1/4', uz: '3 1/4' },
    opt3: { ru: '7/4 — уже готово', uz: "7/4 — tayyor" },
    correct_text: { ru: 'Верно. В 7 четвёртых одно целое (4/4) и остаток 3/4. Значит 7/4 = 1 3/4.', uz: "To'g'ri. 7 ta to'rtdan birda bitta butun (4/4) va qoldiq 3/4 bor. Demak 7/4 = 1 3/4." },
    wrong_1: { ru: 'Пересчитай остаток: из 7 убрали 4 (одно целое), осталось 3 — это 3/4.', uz: "Qoldiqni qayta sanang: 7 dan 4 ni oldik (bir butun), 3 qoldi — bu 3/4." },
    wrong_2: { ru: 'Целая часть — это сколько раз 4 умещается в 7. Это один раз, не три.', uz: "Butun qism — 4 ning 7 ichiga necha marta sig'ishi. Bu bir marta, uch emas." },
    wrong_3: { ru: '7/4 — неправильная дробь, числитель больше знаменателя. Её выделяют в целое и остаток.', uz: "7/4 — noto'g'ri kasr, surati maxrajidan katta. Uni butun va qoldiqqa ajratamiz." },
    wrong_default: { ru: 'Раздели 7 на 4: целое — один, остаток — 3, то есть 3/4.', uz: "7 ni 4 ga bo'ling: butun — bir, qoldiq — 3, ya'ni 3/4." },
    audio_hint_1: { ru: 'Пересчитай остаток, целая часть один.', uz: "Qoldiqni qayta sanang, butun qismi bir." },
    audio_hint_2: { ru: 'Целая часть один, остаток возьми в дробь.', uz: "Butun qismi bir, qoldiqni kasrga oling." },
    audio_hint_3: { ru: 'Это неправильная дробь, её надо выделить в смешанное число.', uz: "Bu noto'g'ri kasr, uni aralash songa ajratish kerak." },
    audio: {
      intro: { ru: 'Чтобы складывать смешанные числа, пригодится этот приём. Переведи семь четвёртых в смешанное число. Выбери ответ.', uz: "Aralash sonlarni qo'shish uchun shu usul kerak bo'ladi. Yettidan to'rtni aralash songa aylantiring. Javobni tanlang." },
      on_correct: { ru: 'Верно. Одно целое и три четвёртых.', uz: "To'g'ri. Bir butun va to'rtdan uch." },
      on_wrong: { ru: 'Не совсем. Раздели семь на четыре: целое один, остаток три.', uz: "Unchalik emas. Yettini to'rtga bo'ling: butun bir, qoldiq uch." }
    }
  },

  // ===== s2 EXPLORATION (step): qo'shish + ko'chirish, 1 2/3 + 2 2/3 = 4 1/3 =====
  s2: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Складываем: целые с целыми, доли с долями', uz: "Qo'shamiz: butunni butunga, ulushni ulushga" },
    lead: { ru: '1 2/3 + 2 2/3. Соберём по частям и посмотрим, где спрятано целое.', uz: "1 2/3 + 2 2/3. Bo'laklab yig'amiz va butun qayerda yashiringanini ko'ramiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А вычитание?', uz: "Tushunarli. Ayirish-chi?" },
    cap1: { ru: 'Целые: 1 + 2 = 3.', uz: "Butunlar: 1 + 2 = 3." },
    cap2: { ru: 'Доли: 2/3 + 2/3 = 4/3. Это больше целого.', uz: "Ulushlar: 2/3 + 2/3 = 4/3. Bu butundan ko'p." },
    cap3: { ru: 'Выделяем целое: 4/3 = 1 1/3. Прибавили к 3 → 4 1/3.', uz: "Butunni ajratamiz: 4/3 = 1 1/3. 3 ga qo'shdik → 4 1/3." },
    result: { ru: '1 2/3 + 2 2/3 = 4 1/3', uz: "1 2/3 + 2 2/3 = 4 1/3" },
    audio: {
      ru: [
        'Складываем одну целую две третьих и две целых две третьих. Нажимай кнопку дальше.',
        'Сначала складываем целые: один и два, три целых.',
        'Теперь доли: две третьих и две третьих, четыре третьих. Это больше одного целого, ведь три третьих уже целое.',
        'Выделяем целое: четыре третьих это одна целая и одна третья. Прибавляем к трём, получается четыре целых одна третья.'
      ],
      uz: [
        "Bir butun uchdan ikki va ikki butun uchdan ikkini qo'shamiz. Davom etish tugmasini bosing.",
        "Avval butunlarni qo'shamiz: bir va ikki, uch butun.",
        "Endi ulushlarni: uchdan ikki va uchdan ikki, uchdan to'rt. Bu bir butundan ko'p, chunki uchdan uch allaqachon butun.",
        "Butunni ajratamiz: uchdan to'rt bu bir butun va uchdan bir. Uchga qo'shamiz, to'rt butun uchdan bir hosil bo'ladi."
      ]
    }
  },

  // ===== s3 EXPLORATION (step): ayirish + qarz olish, 3 1/4 − 1 3/4 = 1 2/4 =====
  s3: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Вычитаем: иногда нужно занять у целого', uz: "Ayiramiz: ba'zan butundan qarz olamiz" },
    lead: { ru: '3 1/4 − 1 3/4. Из 1/4 нельзя вычесть 3/4 — займём одно целое.', uz: "3 1/4 − 1 3/4. 1/4 dan 3/4 ni ayirib bo'lmaydi — bitta butunni qarzga olamiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А разные знаменатели?', uz: "Tushunarli. Har xil maxraj-chi?" },
    cap1: { ru: 'Беда: 1/4 меньше 3/4, верхней доли не хватает.', uz: "Muammo: 1/4 dan 3/4 kichik, yuqori ulush yetmaydi." },
    cap2: { ru: 'Занимаем целое: оно ломается на 4 доли. 3 1/4 = 2 5/4.', uz: "Butunni qarzga olamiz: u 4 ulushga sinadi. 3 1/4 = 2 5/4." },
    cap3: { ru: 'Теперь вычитаем: 2 − 1 = 1, 5/4 − 3/4 = 2/4. Ответ 1 2/4.', uz: "Endi ayiramiz: 2 − 1 = 1, 5/4 − 3/4 = 2/4. Javob 1 2/4." },
    result: { ru: '3 1/4 − 1 3/4 = 1 2/4', uz: "3 1/4 − 1 3/4 = 1 2/4" },
    audio: {
      ru: [
        'Вычитаем из трёх целых одной четвёртой одну целую три четвёртых. Нажимай кнопку дальше.',
        'Смотри: из одной четвёртой нельзя вычесть три четвёртых, верхней доли не хватает.',
        'Занимаем одно целое. Оно ломается на четыре доли. Теперь три целых одна четвёртая это две целых пять четвёртых.',
        'Вычитаем: две минус один, одно целое, пять четвёртых минус три четвёртых, две четвёртых. Получается одна целая две четвёртых.'
      ],
      uz: [
        "Uch butun to'rtdan birdan bir butun to'rtdan uchni ayiramiz. Davom etish tugmasini bosing.",
        "Qarang: to'rtdan birdan to'rtdan uchni ayirib bo'lmaydi, yuqori ulush yetmaydi.",
        "Bitta butunni qarzga olamiz. U to'rt ulushga sinadi. Endi uch butun to'rtdan bir bu ikki butun to'rtdan besh.",
        "Ayiramiz: ikki minus bir, bir butun, to'rtdan besh minus to'rtdan uch, to'rtdan ikki. Bir butun to'rtdan ikki hosil bo'ladi."
      ]
    }
  },

  // ===== s4 EXPLORATION (step): har xil maxraj, 1 1/2 + 2 1/3 = 3 5/6 =====
  s4: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Разные знаменатели — сначала уравняем доли', uz: "Maxrajlar har xil — avval ulushlarni tenglashtiramiz" },
    lead: { ru: '1 1/2 + 2 1/3. Доли разного размера, приведём к одному знаменателю.', uz: "1 1/2 + 2 1/3. Ulushlar har xil o'lchamda, bir maxrajga keltiramiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А правило?', uz: "Tushunarli. Qoida-chi?" },
    cap1: { ru: 'Общий знаменатель 6: 1/2 = 3/6, 1/3 = 2/6.', uz: "Umumiy maxraj 6: 1/2 = 3/6, 1/3 = 2/6." },
    cap2: { ru: 'Целые: 1 + 2 = 3. Доли: 3/6 + 2/6 = 5/6.', uz: "Butunlar: 1 + 2 = 3. Ulushlar: 3/6 + 2/6 = 5/6." },
    cap3: { ru: 'Ответ 3 5/6. Здесь целое выделять не нужно: 5/6 меньше целого.', uz: "Javob 3 5/6. Bu yerda butunni ajratish shart emas: 5/6 butundan kam." },
    result: { ru: '1 1/2 + 2 1/3 = 3 5/6', uz: "1 1/2 + 2 1/3 = 3 5/6" },
    audio: {
      ru: [
        'Складываем одну целую одну вторую и две целых одну третью. Доли разного размера. Нажимай кнопку дальше.',
        'Общий знаменатель шесть. Одна вторая это три шестых, одна третья это две шестых.',
        'Теперь по частям: целые один и два, три. Доли три шестых и две шестых, пять шестых.',
        'Получается три целых пять шестых. Целое выделять не нужно, ведь пять шестых меньше одного целого.'
      ],
      uz: [
        "Bir butun ikkidan bir va ikki butun uchdan birni qo'shamiz. Ulushlar har xil o'lchamda. Davom etish tugmasini bosing.",
        "Umumiy maxraj olti. Ikkidan bir bu oltidan uch, uchdan bir bu oltidan ikki.",
        "Endi bo'laklab: butunlar bir va ikki, uch. Ulushlar oltidan uch va oltidan ikki, oltidan besh.",
        "Uch butun oltidan besh hosil bo'ladi. Butunni ajratish shart emas, chunki oltidan besh bir butundan kam."
      ]
    }
  },

  // ===== s5 RULE + 2-usul =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Как складывать и вычитать смешанные числа', uz: "Aralash sonlarni qo'shish va ayirish" },
    bridge: { ru: 'Мы увидели это на плитках. Теперь соберём в правило.', uz: "Buni plitkalarda ko'rdik. Endi qoidaga yig'amiz." },
    rule_label: { ru: 'Запомните', uz: "Yodda tuting" },
    rule_1: { ru: 'Если знаменатели разные — сначала приведите доли к общему знаменателю.', uz: "Maxrajlar har xil bo'lsa — avval ulushlarni umumiy maxrajga keltiring." },
    rule_2: { ru: 'Целые складывайте (вычитайте) с целыми, доли — с долями.', uz: "Butunlarni butun bilan, ulushlarni ulush bilan qo'shing yoki ayiring." },
    rule_3: { ru: 'При сложении доли стали больше целого — выделите одно целое (перенос).', uz: "Qo'shganda ulush butundan oshsa — bitta butunni ajrating (ko'chirish)." },
    rule_4: { ru: 'При вычитании верхней доли не хватает — займите одно целое у целой части.', uz: "Ayirganda yuqori ulush yetmasa — butun qismdan bitta butunni qarzga oling." },
    warn_label: { ru: 'Две частые ошибки', uz: "Ikki tez-tez uchraydigan xato" },
    warn: { ru: 'Оставить в ответе неправильную дробь, например 4/3, и не занять у целого при вычитании.', uz: "Javobda noto'g'ri kasrni, masalan 4/3 ni qoldirib ketish va ayirishda butundan qarz olmaslik." },
    second_label: { ru: 'Второй способ', uz: "Ikkinchi usul" },
    second: { ru: 'Можно перевести в неправильные дроби: 1 2/3 = 5/3, 2 2/3 = 8/3, тогда 5/3 + 8/3 = 13/3 = 4 1/3.', uz: "Noto'g'ri kasrga aylantirib ham yechsa bo'ladi: 1 2/3 = 5/3, 2 2/3 = 8/3, demak 5/3 + 8/3 = 13/3 = 4 1/3." },
    audio: { ru: 'Запомните. Если знаменатели разные, сначала приводим доли к общему знаменателю. Дальше целые складываем или вычитаем с целыми, а доли с долями. Если при сложении доли стали больше целого, выделяем одно целое. Если при вычитании верхней доли не хватает, занимаем одно целое у целой части. И второй способ: можно перевести смешанные числа в неправильные дроби, сложить и снова выделить целое. Одна целая две третьих это пять третьих, две целых две третьих это восемь третьих, вместе тринадцать третьих, то есть четыре целых одна третья.', uz: "Yodda tuting. Maxrajlar har xil bo'lsa, avval ulushlarni umumiy maxrajga keltiramiz. So'ng butunlarni butun bilan, ulushlarni ulush bilan qo'shamiz yoki ayiramiz. Qo'shganda ulush butundan oshsa, bitta butunni ajratamiz. Ayirganda yuqori ulush yetmasa, butun qismdan bitta butunni qarzga olamiz. Ikkinchi usul ham bor: aralash sonni noto'g'ri kasrga aylantirib, qo'shib, yana butunni ajratsa bo'ladi. Bir butun uchdan ikki bu uchdan besh, ikki butun uchdan ikki bu uchdan sakkiz, birga uchdan o'n uch, ya'ni to'rt butun uchdan bir." }
  },

  // ===== s6 DRAG-FILL (mixfill): ko'chirishni to'ldiring, 1 2/3 + 2 2/3 = [4] 1/3 =====
  s6: {
    eyebrow: { ru: 'Собери ответ', uz: "Javobni yig'ing" },
    title: { ru: 'Перетащи целую часть на место', uz: "Butun qismni joyiga torting" },
    lead: { ru: 'Доли уже сложили: 2/3 + 2/3 = 4/3 = 1 1/3. Сколько целых получится?', uz: "Ulushlarni qo'shdik: 2/3 + 2/3 = 4/3 = 1 1/3. Nechta butun chiqadi?" },
    drag_num: { ru: 'Перетащи число в окошко — или нажми число, потом нажми окошко.', uz: "Sonni katakka torting — yoki sonni bosib, so'ng katakka bosing." },
    hint: { ru: 'Целые: 1 + 2 = 3, и ещё одно целое из 4/3. Всего 4, доля 1/3.', uz: "Butunlar: 1 + 2 = 3, va 4/3 dan yana bitta butun. Hammasi 4, ulush 1/3." },
    fb_correct: { ru: 'Верно. 3 целых плюс целое из 4/3 — это 4, и остаётся 1/3. Ответ 4 1/3.', uz: "To'g'ri. 3 butun va 4/3 dan bitta butun — bu 4, hamda 1/3 qoladi. Javob 4 1/3." },
    item: {
      kind: 'mixfill', aw: 1, an: 2, bw: 2, bn: 2, d: 3, op: '+', resN: 1, answer: 4,
      chips: [{ id: 'c0', label: '4', ok: true }, { id: 'c1', label: '3', ok: false }, { id: 'c2', label: '5', ok: false }]
    },
    audio: {
      intro: { ru: 'Доли мы уже сложили: получилось четыре третьих, а это одно целое и одна третья. Сколько всего целых выйдет? Перетащи число в окошко.', uz: "Ulushlarni allaqachon qo'shdik: uchdan to'rt chiqdi, bu bir butun va uchdan bir. Hammasi bo'lib nechta butun chiqadi? Sonni katakka torting." },
      on_correct: { ru: 'Верно. Всего четыре целых и одна третья.', uz: "To'g'ri. Hammasi to'rt butun va uchdan bir." },
      on_wrong: { ru: 'Пока не то. Сложи три целых и ещё одно целое из четырёх третьих.', uz: "Hozircha emas. Uch butun va uchdan to'rtdan chiqqan yana bitta butunni qo'shing." }
    }
  },

  // ===== s7 — BESHTA OSON SAVOL (SeqMC, scored) =====
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Пять быстрых примеров', uz: "Beshta tez misol" },
    lead: { ru: 'Складывай и вычитай смешанные числа. Выбери ответ.', uz: "Aralash sonlarni qo'shing va ayiring. Javobni tanlang." },
    bridge: { ru: 'Правило знаем — теперь потренируемся.', uz: "Qoidani bilamiz — endi mashq qilamiz." },
    questions: [
      {
        q: '1 1/5 + 2 3/5', say: { ru: 'Сложи одну целую одну пятую и две целых три пятых.', uz: "Bir butun beshdan bir va ikki butun beshdan uchni qo'shing." },
        opts: ['3 4/5', '2 4/5', '3 2/5'], correct: 0,
        ok: { ru: 'Верно: 1 + 2 = 3, 1/5 + 3/5 = 4/5.', uz: "To'g'ri: 1 + 2 = 3, 1/5 + 3/5 = 4/5." },
        no: { ru: 'Целые складывай с целыми, доли с долями.', uz: "Butunlarni butunga, ulushlarni ulushga qo'shing." }
      },
      {
        q: '3 3/7 − 1 2/7', say: { ru: 'Вычти из трёх целых трёх седьмых одну целую две седьмых.', uz: "Uch butun yettidan uchdan bir butun yettidan ikkini ayiring." },
        opts: ['2 2/7', '2 1/7', '1 1/7'], correct: 1,
        ok: { ru: 'Верно: 3 − 1 = 2, 3/7 − 2/7 = 1/7.', uz: "To'g'ri: 3 − 1 = 2, 3/7 − 2/7 = 1/7." },
        no: { ru: 'Целое вычитай из целого, долю из доли.', uz: "Butunni butundan, ulushni ulushdan ayiring." }
      },
      {
        q: '1 2/3 + 1 2/3', say: { ru: 'К одной целой двум третьим прибавь ещё одну целую две третьих.', uz: "Bir butun uchdan ikkiga yana bir butun uchdan ikkini qo'shing." },
        opts: ['2 4/3', '3 4/3', '3 1/3'], correct: 2,
        ok: { ru: 'Верно: доли дали 4/3, выделили целое — 3 1/3.', uz: "To'g'ri: ulushlar 4/3 berdi, butunni ajratdik — 3 1/3." },
        no: { ru: 'Если доли стали больше целого, выдели одно целое.', uz: "Ulush butundan oshsa, bitta butunni ajrating." }
      },
      {
        q: '2 3/4 + 1 1/4', say: { ru: 'Сложи две целых три четвёртых и одну целую одну четвёртую.', uz: "Ikki butun to'rtdan uch va bir butun to'rtdan birni qo'shing." },
        opts: ['4', '3 4/4', '4 1/4'], correct: 0,
        ok: { ru: 'Верно: 3/4 + 1/4 = 4/4 = 1, всего 4 целых.', uz: "To'g'ri: 3/4 + 1/4 = 4/4 = 1, hammasi 4 butun." },
        no: { ru: 'Доли дали целое. Прибавь это целое к остальным.', uz: "Ulushlar butun berdi. Bu butunni qolganlariga qo'shing." }
      },
      {
        q: '4 1/6 − 2 1/6', say: { ru: 'Вычти из четырёх целых одной шестой две целых одну шестую.', uz: "To'rt butun oltidan birdan ikki butun oltidan birni ayiring." },
        opts: ['2 2/6', '2', '1 1/6'], correct: 1,
        ok: { ru: 'Верно: 4 − 2 = 2, 1/6 − 1/6 = 0 — остаётся 2.', uz: "To'g'ri: 4 − 2 = 2, 1/6 − 1/6 = 0 — 2 qoladi." },
        no: { ru: 'Доли равны, их разность ноль, останутся только целые.', uz: "Ulushlar teng, ayirmasi nol, faqat butunlar qoladi." }
      }
    ],
    audio: {
      intro: { ru: 'Правило знаем, теперь потренируемся. Пять быстрых примеров.', uz: "Qoidani bilamiz, endi mashq qilamiz. Beshta tez misol." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все примеры решены.', uz: "Zo'r, hamma misol yechildi." }
    }
  },

  // ===== s8 — CASE (Nilufar, lenta): 3 1/4 − 1 3/4 (qarz olish) =====
  s8: {
    eyebrow: { ru: 'Задача · лента', uz: "Masala · lenta" },
    title: { ru: 'Нилуфар шила и отрезала ленту', uz: "Nilufar tikdi va lenta kesdi" },
    question: { ru: 'Было 3 1/4 м ленты, отрезала 1 3/4 м. Сколько осталось?', uz: "3 1/4 m lenta bor edi, 1 3/4 m kesdi. Qancha qoldi?" },
    opt0: { ru: '1 2/4 м', uz: '1 2/4 m' },
    opt1: { ru: '2 2/4 м', uz: '2 2/4 m' },
    opt2: { ru: '1 3/4 м', uz: '1 3/4 m' },
    opt3: { ru: '2 1/4 м', uz: '2 1/4 m' },
    correct_text: { ru: 'Верно. Из 1/4 нельзя вычесть 3/4, заняли целое: 3 1/4 = 2 5/4. Тогда 2 5/4 − 1 3/4 = 1 2/4 м.', uz: "To'g'ri. 1/4 dan 3/4 ni ayirib bo'lmaydi, butunni qarzga oldik: 3 1/4 = 2 5/4. Demak 2 5/4 − 1 3/4 = 1 2/4 m." },
    wrong_1: { ru: 'Похоже, целое не заняли. Из 1/4 нельзя вычесть 3/4 — сначала займи одно целое.', uz: "Butunni qarzga olmadingiz shekilli. 1/4 dan 3/4 ayrilmaydi — avval bitta butunni oling." },
    wrong_2: { ru: 'Это уменьшаемое, а не ответ. Займи целое и вычти доли.', uz: "Bu kamayuvchi, javob emas. Butunni qarzga oling va ulushlarni ayiring." },
    wrong_3: { ru: 'Целую часть посчитали неверно: после займа целых остаётся 1.', uz: "Butun qismni noto'g'ri sanadingiz: qarzdan keyin butun 1 qoladi." },
    wrong_default: { ru: 'Займи одно целое: 3 1/4 = 2 5/4, затем вычти.', uz: "Bitta butunni qarzga oling: 3 1/4 = 2 5/4, so'ng ayiring." },
    audio_hint_1: { ru: 'Сначала займи одно целое, потом вычитай доли.', uz: "Avval bitta butunni qarzga oling, so'ng ulushlarni ayiring." },
    audio_hint_2: { ru: 'Это уменьшаемое, а не ответ. Выполни вычитание.', uz: "Bu kamayuvchi, javob emas. Ayirishni bajaring." },
    audio_hint_3: { ru: 'Пересчитай целую часть после займа, останется один.', uz: "Qarzdan keyin butun qismni qayta sanang, bir qoladi." },
    fact: { ru: 'Портные и плотники всегда меряют смешанными числами: полтора метра, две с половиной доски.', uz: "Tikuvchi va duradgorlar doim aralash son bilan o'lchaydi: bir yarim metr, ikki yarim taxta." },
    audio: {
      intro: { ru: 'У Нилуфар было три целых одна четвёртая метра ленты, она отрезала одну целую три четвёртых. Сколько осталось? Выбери ответ.', uz: "Nilufarda uch butun to'rtdan bir metr lenta bor edi, u bir butun to'rtdan uchni kesdi. Qancha qoldi? Javobni tanlang." },
      on_correct: { ru: 'Верно, осталось одна целая две четвёртых метра. Кстати, портные и плотники всегда меряют смешанными числами.', uz: "To'g'ri, bir butun to'rtdan ikki metr qoldi. Aytgancha, tikuvchi va duradgorlar doim aralash son bilan o'lchaydi." },
      on_wrong: { ru: 'Не совсем. Из одной четвёртой нельзя вычесть три четвёртых, займи целое.', uz: "Unchalik emas. To'rtdan birdan to'rtdan uchni ayirib bo'lmaydi, butunni qarzga oling." }
    }
  },

  // ===== s9 — OLTI-SAKKIZ MISOL, OSONDAN QIYINGA, HAR XIL TIP (SeqMix, scored) =====
  s9: {
    eyebrow: { ru: 'Смешанная тренировка', uz: "Aralash mashq" },
    title: { ru: 'Семь примеров — разного типа', uz: "Yettita misol — har xil turdagi" },
    lead: { ru: 'Разные типы: выбор, перетаскивание, сортировка — от лёгкого к трудному.', uz: "Har xil tur: tanlash, tortish, saralash — osondan qiyinga." },
    bridge: { ru: 'Проверим себя на разных типах вопросов.', uz: "Turli xil savollar bilan o'zimizni sinaymiz." },
    lvl_easy: { ru: 'Лёгкий', uz: "Oson" },
    lvl_mid: { ru: 'Средний', uz: "O'rta" },
    lvl_hard: { ru: 'Трудный', uz: "Qiyin" },
    drag_num: { ru: 'Перетащи число — или нажми число, потом нажми окошко.', uz: "Sonni torting — yoki sonni bosib, so'ng katakka bosing." },
    bin_ask: { ru: 'Что нужно сделать? Перетащи пример — или нажми его, потом нажми корзину.', uz: "Nima qilish kerak? Misolni torting — yoki bosib, so'ng savatga bosing." },
    bin_carry: { ru: 'Нужен перенос', uz: "Ko'chirish kerak" },
    bin_borrow: { ru: 'Нужен заём', uz: "Qarz olish kerak" },
    bin_direct: { ru: 'Напрямую', uz: "To'g'ridan" },
    items: [
      // (1) MC oson
      { kind: 'mc', lvl: 'easy', prob: '1 1/4 + 1 1/4', opts: ['2 2/4', '2 1/4', '1 2/4'], correct: 0,
        say: { ru: 'Сложи одну целую одну четвёртую и одну целую одну четвёртую.', uz: "Bir butun to'rtdan bir va bir butun to'rtdan birni qo'shing." },
        ok: { ru: 'Верно: 1 + 1 = 2, 1/4 + 1/4 = 2/4.', uz: "To'g'ri: 1 + 1 = 2, 1/4 + 1/4 = 2/4." },
        no: { ru: 'Целые с целыми, доли с долями.', uz: "Butunni butunga, ulushni ulushga." } },
      // (2) MIXFILL oson (ko'chirishsiz): 2 1/5 + 1 3/5 = [3] 4/5
      { kind: 'mixfill', lvl: 'easy', aw: 2, an: 1, bw: 1, bn: 3, d: 5, op: '+', resN: 4, answer: 3,
        chips: [{ id: 'c0', label: '3', ok: true }, { id: 'c1', label: '4', ok: false }, { id: 'c2', label: '2', ok: false }],
        say: { ru: 'Сложи две целых одну пятую и одну целую три пятых, перетащи целую часть.', uz: "Ikki butun beshdan bir va bir butun beshdan uchni qo'shing, butun qismni torting." },
        ok: { ru: 'Верно: 2 + 1 = 3, доли 4/5.', uz: "To'g'ri: 2 + 1 = 3, ulush 4/5." },
        no: { ru: 'Сложи целые: 2 и 1. Доли уже меньше целого.', uz: "Butunlarni qo'shing: 2 va 1. Ulush butundan kichik." } },
      // (3) MC o'rta (ko'chirish): 2 3/5 + 1 4/5 = 4 2/5
      { kind: 'mc', lvl: 'mid', prob: '2 3/5 + 1 4/5', opts: ['3 7/5', '4 2/5', '4 7/5'], correct: 1,
        say: { ru: 'Сложи две целых три пятых и одну целую четыре пятых.', uz: "Ikki butun beshdan uch va bir butun beshdan to'rtni qo'shing." },
        ok: { ru: 'Верно: доли дали 7/5 = 1 2/5, всего 4 2/5.', uz: "To'g'ri: ulushlar 7/5 = 1 2/5 berdi, hammasi 4 2/5." },
        no: { ru: 'Доли стали больше целого, выдели одно целое.', uz: "Ulush butundan oshdi, bitta butunni ajrating." } },
      // (4) DRAGBIN o'rta (klassifikatsiya): 3 1/4 − 1 3/4 -> qarz
      { kind: 'dragbin', lvl: 'mid', expr: '3 1/4 − 1 3/4', bin: 'borrow',
        say: { ru: 'Что нужно для этого вычитания? Перетащи в корзину.', uz: "Bu ayirish uchun nima kerak? Savatga torting." },
        ok: { ru: 'Верно: 1/4 меньше 3/4, нужно занять целое.', uz: "To'g'ri: 1/4 dan 3/4 katta, butunni qarzga olish kerak." },
        no: { ru: 'Сравни доли: верхней не хватает, значит заём.', uz: "Ulushlarni solishtiring: yuqorisi yetmaydi, demak qarz." } },
      // (5) MIXFILL o'rta (qarz): 3 1/3 − 1 2/3 = [1] 2/3
      { kind: 'mixfill', lvl: 'mid', aw: 3, an: 1, bw: 1, bn: 2, d: 3, op: '-', resN: 2, answer: 1,
        chips: [{ id: 'c0', label: '1', ok: true }, { id: 'c1', label: '2', ok: false }, { id: 'c2', label: '3', ok: false }],
        say: { ru: 'Вычти из трёх целых одной третьей одну целую две третьих, перетащи целую часть.', uz: "Uch butun uchdan birdan bir butun uchdan ikkini ayiring, butun qismni torting." },
        ok: { ru: 'Верно: заняли целое (2 4/3), осталось 1 2/3.', uz: "To'g'ri: butunni qarzga oldik (2 4/3), 1 2/3 qoldi." },
        no: { ru: 'Сначала займи одно целое у целой части, потом вычитай доли.', uz: "Avval butun qismdan bitta butunni qarzga oling, so'ng ulushlarni ayiring." } },
      // (6) MC qiyin (har xil maxraj): 1 1/2 + 2 1/3 = 3 5/6
      { kind: 'mc', lvl: 'hard', prob: '1 1/2 + 2 1/3', opts: ['3 2/5', '3 5/6', '4 5/6'], correct: 1,
        say: { ru: 'Сложи одну целую одну вторую и две целых одну третью.', uz: "Bir butun ikkidan bir va ikki butun uchdan birni qo'shing." },
        ok: { ru: 'Верно: общий знаменатель 6, 3/6 + 2/6 = 5/6, всего 3 5/6.', uz: "To'g'ri: umumiy maxraj 6, 3/6 + 2/6 = 5/6, hammasi 3 5/6." },
        no: { ru: 'Сначала приведи доли к общему знаменателю шесть.', uz: "Avval ulushlarni umumiy maxraj oltiga keltiring." } },
      // (7) DRAGBIN qiyin: 2 1/2 + 1 3/4 -> umumiy maxraj 4, 2/4+3/4=5/4 -> ko'chirish
      { kind: 'dragbin', lvl: 'hard', expr: '2 1/2 + 1 3/4', bin: 'carry',
        say: { ru: 'Приведи к общему знаменателю и реши, что нужно. Перетащи в корзину.', uz: "Umumiy maxrajga keltiring va nima kerakligini hal qiling. Savatga torting." },
        ok: { ru: 'Верно: 2/4 + 3/4 = 5/4 больше целого — нужен перенос.', uz: "To'g'ri: 2/4 + 3/4 = 5/4 butundan katta — ko'chirish kerak." },
        no: { ru: 'Сложи доли в общем знаменателе: если больше целого, перенос.', uz: "Ulushlarni umumiy maxrajda qo'shing: butundan oshsa, ko'chirish." } }
    ],
    fact: { ru: 'Полоса загрузки файла показывает целое и долю вместе — смешанное число встречается и здесь.', uz: "Fayl yuklanish chizig'i butun va ulushni birga ko'rsatadi — aralash son bu yerda ham bor." },
    audio: {
      intro: { ru: 'Проверим себя на разных типах. Семь примеров: выбор, перетаскивание и сортировка.', uz: "Turli xil tiplarda o'zimizni sinaymiz. Yettita misol: tanlash, tortish va saralash." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Почти. Попробуй ещё раз.', uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: 'Отлично, все типы решены. Кстати, полоса загрузки файла это тоже целое и доля вместе.', uz: "Ajoyib, barcha tur yechildi. Aytgancha, fayl yuklanish chizig'i ham butun va ulush birga." }
    }
  },

  // ===== s10 — YAKUNIY (QuestionScreen, final): Saida, masofa, 1 3/4 + 2 1/2 = 4 1/4 =====
  s10: {
    eyebrow: { ru: 'Итог · дистанция', uz: "Yakun · masofa" },
    title: { ru: 'Саида пробежала утром и вечером', uz: "Saida ertalab va kechqurun yugurdi" },
    question: { ru: 'Утром 1 3/4 км, вечером 2 1/2 км. Сколько всего? (1 3/4 + 2 1/2)', uz: "Ertalab 1 3/4 km, kechqurun 2 1/2 km. Jami qancha? (1 3/4 + 2 1/2)" },
    opt0: { ru: '4 1/4 км', uz: '4 1/4 km' },
    opt1: { ru: '3 5/4 км', uz: '3 5/4 km' },
    opt2: { ru: '3 4/6 км', uz: '3 4/6 km' },
    opt3: { ru: '4 1/2 км', uz: '4 1/2 km' },
    correct_text: { ru: 'Верно. 1/2 = 2/4, доли 3/4 + 2/4 = 5/4 — больше целого. Выделили целое: 3 + 1 1/4 = 4 1/4 км.', uz: "To'g'ri. 1/2 = 2/4, ulushlar 3/4 + 2/4 = 5/4 — butundan ko'p. Butunni ajratdik: 3 + 1 1/4 = 4 1/4 km." },
    wrong_1: { ru: 'Доли стали 5/4 — это больше целого. Выдели одно целое и не оставляй 5/4.', uz: "Ulushlar 5/4 bo'ldi — bu butundan ko'p. Bitta butunni ajrating, 5/4 ni qoldirmang." },
    wrong_2: { ru: 'Сначала общий знаменатель 4, а не 6: 1/2 = 2/4. И не забудь перенос.', uz: "Avval umumiy maxraj 4, 6 emas: 1/2 = 2/4. Ko'chirishni ham unutmang." },
    wrong_3: { ru: 'Доли сложи в общем знаменателе: 3/4 + 2/4 = 5/4, отсюда перенос даёт 1/4.', uz: "Ulushlarni umumiy maxrajda qo'shing: 3/4 + 2/4 = 5/4, ko'chirishdan 1/4 chiqadi." },
    wrong_default: { ru: 'Приведи к знаменателю 4, сложи доли, выдели целое.', uz: "Maxraj 4 ga keltiring, ulushlarni qo'shing, butunni ajrating." },
    audio_hint_1: { ru: 'Доли стали больше целого, выдели одно целое.', uz: "Ulush butundan oshdi, bitta butunni ajrating." },
    audio_hint_2: { ru: 'Общий знаменатель здесь четыре, не шесть.', uz: "Umumiy maxraj bu yerda to'rt, olti emas." },
    audio_hint_3: { ru: 'Сложи доли в общем знаменателе и выдели целое.', uz: "Ulushlarni umumiy maxrajda qo'shing va butunni ajrating." },
    fact: { ru: 'Древние вавилонские учёные писали целое и долю вместе в системе из 60 — часы и минуты пришли оттуда.', uz: "Qadimgi bobillik olimlar butun va ulushni 60 lik tizimda yozgan — soat va daqiqa o'shandan qolgan." },
    audio: {
      intro: { ru: 'Саида пробежала утром одну целую три четвёртых километра и вечером две целых одну вторую. Сколько всего? Выбери ответ.', uz: "Saida ertalab bir butun to'rtdan uch kilometr, kechqurun ikki butun ikkidan bir yugurdi. Jami qancha? Javobni tanlang." },
      on_correct: { ru: 'Верно, всего четыре целых одна четвёртая километра. А ещё часы и минуты идут из вавилонской системы из шестидесяти.', uz: "To'g'ri, hammasi to'rt butun to'rtdan bir kilometr. Yana soat va daqiqa bobilliklarning oltmishlik tizimidan kelgan." },
      on_wrong: { ru: 'Не совсем. Приведи к знаменателю четыре, сложи доли и выдели целое.', uz: "Unchalik emas. Maxraj to'rtga keltiring, ulushlarni qo'shing va butunni ajrating." }
    }
  },

  // ===== s11 SUMMARY + ConnectionsBlock =====
  s11: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что мы усвоили', uz: "Nimani o'rgandik" },
    title: { ru: 'Теперь ты складываешь и вычитаешь смешанные числа.', uz: "Endi siz aralash sonlarni qo'shasiz va ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Разные знаменатели — сначала общий знаменатель, потом по частям.', uz: "Maxrajlar har xil bo'lsa — avval umumiy maxraj, so'ng bo'laklab." },
    main_2: { ru: 'При сложении доли больше целого — выделяем целое (перенос).', uz: "Qo'shganda ulush butundan oshsa — butunni ajratamiz (ko'chirish)." },
    main_3: { ru: 'При вычитании доли не хватает — занимаем целое у целой части.', uz: "Ayirganda ulush yetmasa — butun qismdan butunni qarzga olamiz." },
    score_label: { ru: 'Верно с первой попытки', uz: "Birinchi urinishda to'g'ri" },
    back_to_hook: { ru: 'И ответ из начала: 1 2/3 + 2 2/3 = 4 1/3, а не 3 4/3.', uz: "Boshdagi javob: 1 2/3 + 2 2/3 = 4 1/3, 3 4/3 emas." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Перевод смешанного числа и неправильной дроби» и «Сложение дробей с разными знаменателями».', uz: "«Aralash son va noto'g'ri kasr» hamda «Har xil maxrajli kasrlarni qo'shish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'десятичные дроби — другой способ записывать целое и доли.', uz: "o'nli kasrlar — butun va ulushni boshqacha yozish usuli." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты складываешь и вычитаешь смешанные числа. Если знаменатели разные, сначала приводим к общему знаменателю, потом считаем по частям. Если при сложении доли стали больше целого, выделяем целое. Если при вычитании доли не хватает, занимаем целое у целой части. Дальше нас ждут десятичные дроби — другой способ записывать целое и доли.', uz: "Zo'r. Endi siz aralash sonlarni qo'shasiz va ayirasiz. Maxrajlar har xil bo'lsa, avval umumiy maxrajga keltiramiz, so'ng bo'laklab hisoblaymiz. Qo'shganda ulush butundan oshsa, butunni ajratamiz. Ayirganda ulush yetmasa, butun qismdan butunni qarzga olamiz. Keyingi darsda o'nli kasrlar bizni kutmoqda — butun va ulushni boshqacha yozish usuli." }
  }
};

// ============================================================
// YORDAMCHILAR (infra'da yo'q — shu yerda) + faktlar
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => {
    content[`wrong_${newI}`] = c[`wrong_${oldI}`];
    content[`hint_${newI}`] = c[`hint_${oldI}`];
    content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`];
  });
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

// FAKT-BLOK — ko'k karta, katta animatsiya + kam matn (faqat to'g'ri javobdan keyin).
const FB_IT   = { ru: 'Знаешь ли ты? · IT',      uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_LIFE = { ru: 'Знаешь ли ты? · Жизнь',   uz: "Bilasizmi? · Hayot" };
const AnimMeasure = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '½', '2', '½'].map((ch, i) => (<span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.28}s` }}>{ch}</span>))}
  </div>
);
const AnimLoad = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '0', '0', '%'].map((ch, i) => (<span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>))}
  </div>
);
const AnimClock = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '2', ':', '0', '0'].map((ch, i) => (<span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.24}s` }}>{ch}</span>))}
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
// VIZUALIZATOR frac_5_15: MixedBar — aralash son plitkalarda. Butun = to'liq plitka, ulush = qisman plitka.
// Qo'shish: ulushlar bir butundan oshsa, ortiqcha bo'lak yangi butunga aylanadi (ko'chirish / mb-rise+arrive).
// Ayirish: yuqori ulush yetmasa, bitta butun ulushlarga sinadi (qarz olish / mb-break).
// ============================================================
const UnitBar = ({ den, fill, cls = 'on', breaking = false, arrive = false }) => (
  <span className={`mb-unit${breaking ? ' mb-break' : ''}${arrive ? ' mb-arrive' : ''}`}>
    {Array.from({ length: den }).map((_, i) => <span key={i} className={`mb-cell${i < fill ? ' ' + cls : ''}`}/>)}
  </span>
);

const MixedBar = ({ whole = 0, num = 0, den, over = 0, cls = 'on', breakLast = false, arriveLast = false, riseOver = false }) => {
  const u = [];
  for (let i = 0; i < whole; i++) u.push(<UnitBar key={`w${i}`} den={den} fill={den} cls={cls} breaking={breakLast && i === whole - 1} arrive={arriveLast && i === whole - 1}/>);
  if (num > 0) u.push(<UnitBar key="p" den={den} fill={num} cls={cls}/>);
  if (over > 0) u.push(<span key="ov" className={`mb-over${riseOver ? ' mb-rise' : ''}`}>{Array.from({ length: over }).map((_, i) => <span key={i} className="mb-ov-cell on"/>)}</span>);
  if (u.length === 0) u.push(<UnitBar key="z" den={den} fill={0} cls={cls}/>);
  return <span className="mb-wrap">{u}</span>;
};

// MixedNum — aralash son yozuvi (butun + Frac).
const MixedNum = ({ w, n, d, color }) => (
  <span className="mn">
    {(w !== null && w !== undefined) && <span className="mn-w" style={{ color }}>{w}</span>}
    {(n !== null && n !== undefined && d) && <Frac n={String(n)} d={String(d)} size="mid" color={color}/>}
  </span>
);

// ExprLine — kasr/aralash ifodani BIR XIL o'lchamda chizadi (kasr Frac + operator mos o'lchamda).
const ExprLine = ({ s, size = 'mid' }) => {
  const str = String(s);
  const out = []; let last = 0; let m; let k = 0;
  const re = /(\d+|\?)\/(\d+)/g;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last, m.index)}</span>);
    out.push(<Frac key={`f${k}`} n={m[1]} d={m[2]} size={size}/>);
    k += 1; last = m.index + m[0].length;
  }
  if (last < str.length) out.push(<span key={`o${k}`} className={`expr-op expr-op-${size}`}>{str.slice(last)}</span>);
  return <span className={`expr-row expr-row-${size}`}>{out}</span>;
};

// ============================================================
// DragDropItem — pointer-asosli drag-and-drop (sichqoncha + touch). Metodlar:
//   mixfill — butun-son chipni aralash ifodaning katagiga tashlash.
//   dragbin — ifodani uchta savatdan biriga: ko'chirish / qarz / to'g'ridan.
// Веди-до-верного: noto'g'ri tashlansa chip qaytadi + maslahat; to'g'ri tashlansa onResult(true).
// ============================================================
const DragChipView = ({ chip }) => (chip.expr ? <ExprLine s={chip.expr} size="sm"/> : <span className="dd-num">{chip.label}</span>);

const DragDropItem = ({ it, solved, instr, binLabels, onResult }) => {
  const t = useT();
  // Gibrid: (1) torting (pointer-drag), (2) BOSIB tanlang -> nishonga bosing (tap-rejim, touch'da ishonchli).
  const [drag, setDrag] = useState(null);          // { id, x, y, moved } — suzuvchi klon
  const [selected, setSelected] = useState(null);  // bosib tanlangan chip id (tap-rejim)
  const [landed, setLanded] = useState(null);
  const [badZone, setBadZone] = useState(null);
  const downRef = useRef(null);                     // { id, x, y, moved } — pointer pastga tushgan holat
  const isBin = it.kind === 'dragbin';
  const chips = isBin ? [{ id: 'e0', expr: it.expr, bin: it.bin }] : it.chips;
  const correctChip = isBin ? chips[0] : chips.find(x => x.ok);
  const placedChip = solved ? correctChip : (landed ? chips.find(x => x.id === landed) : null);
  const locked = solved || !!landed;

  const tryDrop = (id, zid) => {
    if (locked || !zid) return;
    const chip = chips.find(x => x.id === id);
    if (!chip) return;
    const ok = isBin ? (zid === chip.bin) : (zid === 'slot' && chip.ok);
    if (ok) { setLanded(id); setSelected(null); setBadZone(null); onResult(true); }
    else { setBadZone(zid); setSelected(null); onResult(false); }
  };
  const down = (e, id) => {
    if (locked) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { void err; }
    setBadZone(null);
    downRef.current = { id, x: e.clientX, y: e.clientY, moved: false };
    setDrag({ id, x: e.clientX, y: e.clientY, moved: false });
  };
  const move = (e, id) => {
    const info = downRef.current;
    if (!info || info.id !== id) return;
    if (Math.abs(e.clientX - info.x) > 6 || Math.abs(e.clientY - info.y) > 6) info.moved = true;
    setDrag(d => (d ? { ...d, x: e.clientX, y: e.clientY, moved: info.moved } : d));
  };
  const up = (e, id) => {
    const info = downRef.current; downRef.current = null;
    setDrag(null);
    if (!info || info.id !== id || locked) return;
    if (info.moved) {
      let zid = null;
      try { const el = document.elementFromPoint(e.clientX, e.clientY); const z = el && el.closest && el.closest('[data-zone]'); zid = z ? z.getAttribute('data-zone') : null; } catch (err) { void err; }
      if (zid) tryDrop(id, zid); else setSelected(id);   // hech qayerga tushmadi -> tanlangan qoladi
    } else {
      setSelected(s => (s === id ? null : id));            // oddiy bosish -> tanlash / bekor qilish
      setBadZone(null);
    }
  };
  const handlers = (id) => ({ onPointerDown: (e) => down(e, id), onPointerMove: (e) => move(e, id), onPointerUp: (e) => up(e, id) });
  const zoneClick = (zid) => { if (!locked && selected) tryDrop(selected, zid); };
  const clone = (drag && drag.moved) ? chips.find(x => x.id === drag.id) : null;
  const pickHint = !!selected && !locked;

  // ---- DRAGBIN: ifodani savatga (carry / borrow / direct) ----
  if (isBin) {
    return (
      <div className="dd-wrap fade-up delay-1">
        <p className="dd-instr">{mt(t(instr))}</p>
        <div className="dd-tray-row">
          {locked
            ? <span className="dd-chip dd-chip-expr dd-used"><ExprLine s={it.expr} size="sm"/></span>
            : <button className={`dd-chip dd-chip-expr${drag && drag.moved ? ' dd-dragging' : ''}${selected === 'e0' ? ' dd-chip-sel' : ''}`} {...handlers('e0')}><ExprLine s={it.expr} size="sm"/></button>}
        </div>
        <div className="dd-bins3">
          {binLabels.map(b => (
            <button key={b.key} type="button" data-zone={b.key} disabled={locked} onClick={() => zoneClick(b.key)}
              className={`sort-bin sort-bin-cu${badZone === b.key ? ' sort-bin-bad' : ''}${(placedChip && it.bin === b.key) ? ' dd-zone-on' : ''}${pickHint ? ' dd-zone-pick' : ''}`}>
              <span className="sort-bin-h">{mt(t(b.label))}</span>
              {(placedChip && it.bin === b.key) && <span className="sort-chip-in"><ExprLine s={it.expr} size="sm"/></span>}
            </button>
          ))}
        </div>
        {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><ExprLine s={it.expr} size="sm"/></span>}
      </div>
    );
  }

  // ---- MIXFILL: aralash ifoda + butun-son katagi ----
  return (
    <div className="dd-wrap fade-up delay-1">
      <p className="dd-instr">{mt(t(instr))}</p>
      <div className="dd-eq">
        <MixedNum w={it.aw} n={it.an} d={it.d} color={T.accent}/>
        <span className="expr-op expr-op-mid">{it.op === '-' ? '−' : '+'}</span>
        <MixedNum w={it.bw} n={it.bn} d={it.d} color={T.blue}/>
        <span className="expr-op expr-op-mid">=</span>
        <span className="mn-result">
          <span data-zone="slot" onClick={() => zoneClick('slot')} role="button" tabIndex={locked ? -1 : 0}
            className={`dd-slot${placedChip ? ' dd-slot-on' : ''}${badZone === 'slot' ? ' dd-bad' : ''}${pickHint ? ' dd-zone-pick' : ''}`}>{placedChip ? placedChip.label : '?'}</span>
          {it.resN != null && <Frac n={String(it.resN)} d={String(it.d)} size="mid"/>}
        </span>
      </div>
      <div className="dd-tray-row">
        {chips.map(ch => {
          const used = placedChip && placedChip.id === ch.id;
          return (
            <button key={ch.id} className={`dd-chip${used ? ' dd-used' : ''}${(drag && drag.moved && drag.id === ch.id) ? ' dd-dragging' : ''}${selected === ch.id ? ' dd-chip-sel' : ''}`} disabled={locked} {...handlers(ch.id)}>
              <DragChipView chip={ch}/>
            </button>
          );
        })}
      </div>
      {clone && <span className="dd-clone" style={{ left: drag.x, top: drag.y }}><DragChipView chip={clone}/></span>}
    </div>
  );
};

// ============================================================
// SeqMC — ketma-ket beshta tez MC (mobil-do'st tap, веди-до-верного).
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
// SeqMix — ketma-ket HAR XIL TIPLI misollar (mc / mixfill / dragbin), osondan qiyinga. Mobil-do'st.
// ============================================================
const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev, factOnDone }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const lvlNode = { easy: c.lvl_easy, mid: c.lvl_mid, hard: c.lvl_hard };
  const audio = useAudio([{ id: `smix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState(() => new Set());
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(wasSolved);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];
  const solvedItem = picked !== null;
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
                <ExprLine s={it.prob} size="big"/>
              </div>
            )}
            {it.kind === 'mc' && (
              <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <ExprLine s={o} size="mid"/>
                    </button>
                  );
                })}
              </div>
            )}

            {(it.kind === 'mixfill' || it.kind === 'dragbin') && (
              <DragDropItem it={it} solved={solvedItem}
                instr={it.kind === 'dragbin' ? c.bin_ask : c.drag_num}
                binLabels={[{ key: 'carry', label: c.bin_carry }, { key: 'borrow', label: c.bin_borrow }, { key: 'direct', label: c.bin_direct }]}
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

// s0 — HOOK (konseptual, personajsiz). Qaytishda picked TO'LIQ sbros.
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
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <MixedBar whole={3} num={3} den={3} over={1} riseOver/>
          <span className="mb-label">3 <Frac n="4" d="3" size="mid" color={T.accent}/></span>
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

// s1 — WARM-UP (QuestionScreen): noto'g'ri kasr -> aralash son.
const ScreenWarm = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]); // to'g'ri -> B
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content}
    titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={() => <MixedBar whole={1} num={3} den={4}/>}/>;
};

// s2 — EXPLORATION (step): qo'shish + ko'chirish.
const ScreenAddCarry = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          {step === 0 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={1} num={2} den={3}/></div>
              <span className="mb-plus">+</span>
              <div className="mb-grp"><MixedBar whole={2} num={2} den={3}/></div>
            </div>
          )}
          {step === 1 && <MixedBar whole={3} den={3}/>}
          {step === 2 && <MixedBar whole={3} num={3} den={3} over={1} riseOver/>}
          {step >= 3 && <MixedBar whole={4} num={1} den={3} arriveLast/>}
          {step >= 1 && step < 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(step === 1 ? c.cap1 : c.cap2))}</p>}
          {step >= 3 && <span className="mb-label"><ExprLine s={t(c.result)} size="mid"/></span>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (step): ayirish + qarz olish.
const ScreenSubBorrow = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          {step <= 1 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={3} num={1} den={4} breakLast={step === 1}/></div>
              <span className="mb-plus">−</span>
              <div className="mb-grp"><MixedBar whole={1} num={3} den={4} cls="on-blue"/></div>
            </div>
          )}
          {step === 2 && <MixedBar whole={2} num={4} den={4} over={1} riseOver/>}
          {step >= 3 && <MixedBar whole={1} num={2} den={4} arriveLast/>}
          {step >= 1 && step < 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(step === 1 ? c.cap1 : c.cap2))}</p>}
          {step >= 3 && <span className="mb-label"><ExprLine s={t(c.result)} size="mid"/></span>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (step): har xil maxraj.
const ScreenDiffDen = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s4_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          {step === 0 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={1} num={1} den={2}/></div>
              <span className="mb-plus">+</span>
              <div className="mb-grp"><MixedBar whole={2} num={1} den={3} cls="on-blue"/></div>
            </div>
          )}
          {step === 1 && (
            <div className="mb-eq">
              <div className="mb-grp"><MixedBar whole={1} num={3} den={6}/></div>
              <span className="mb-plus">+</span>
              <div className="mb-grp"><MixedBar whole={2} num={2} den={6} cls="on-blue"/></div>
            </div>
          )}
          {step >= 2 && <MixedBar whole={3} num={5} den={6} arriveLast={step === 2}/>}
          {step >= 1 && step < 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.cap1))}</p>}
          {step === 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.cap2))}</p>}
          {step >= 3 && <span className="mb-label"><ExprLine s={t(c.result)} size="mid"/></span>}
        </div>
        {step >= 3 && <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(c.cap3))}</p></div>}
      </div>
    </Stage>
  );
};

// s5 — RULE + 2-usul.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2, c.rule_3, c.rule_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="eyebrow" style={{ color: '#A07D14', marginBottom: 6 }}>{t(c.warn_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn))}</p>
        </div>
        <div className="frame fade-up delay-3">
          <p className="eyebrow" style={{ color: T.blue, marginBottom: 6 }}>{t(c.second_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.second))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — DRAG-FILL (mixfill, scored). Bitta DragDropItem + o'z holati.
const ScreenDrag = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const result = (ok) => {
    if (solved) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true); setHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: String(c.item.answer), studentAnswer: String(c.item.answer), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: 1, solved: true });
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      sfx.playWrong(); setHint(true);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.1vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.2vw, 18px)' }}>
          <DragDropItem it={c.item} solved={solved} instr={c.drag_num} onResult={result}/>
        </div>
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
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

// s7 — beshta oson savol.
const ScreenEasy = (props) => <SeqMC {...props} screenContent={CONTENT.s7} scored={true}/>;

// s8 — CASE (Nilufar, QuestionScreen).
const ScreenCase = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 3, 0, 1]); // to'g'ri -> C
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content}
    titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={(solved) => solved ? <MixedBar whole={1} num={2} den={4}/> : <div className="mb-eq"><MixedBar whole={3} num={1} den={4}/><span className="mb-plus">−</span><MixedBar whole={1} num={3} den={4} cls="on-blue"/></div>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_LIFE} anim={<AnimMeasure/>}/>}/>;
};

// s9 — olti-sakkiz misol, har xil tip.
const ScreenMix = (props) => <SeqMix {...props} screenContent={CONTENT.s9} scored={true} factOnDone={<FactCard text={CONTENT.s9.fact} badge={FB_IT} anim={<AnimLoad/>}/>}/>;

// s10 — YAKUNIY (QuestionScreen, final).
const ScreenFinal = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 1, 2, 0]); // to'g'ri -> D
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content}
    titleNode={c.title} question={question} options={options} correctIdx={correctIdx}
    figure={(solved) => solved ? <MixedBar whole={4} num={1} den={4}/> : <div className="mb-eq"><MixedBar whole={1} num={3} den={4}/><span className="mb-plus">+</span><MixedBar whole={2} num={2} den={4} cls="on-blue"/></div>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimClock/>}/>}/>;
};

// s11 — SUMMARY (kanonik: ball qatori + ulanishlar bloki, top-anchor).
const ScreenSummary = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
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

export default function MixedNumbersLesson({
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

  const screens = [ScreenHook, ScreenWarm, ScreenAddCarry, ScreenSubBorrow, ScreenDiffDen, ScreenRule, ScreenDrag, ScreenEasy, ScreenCase, ScreenMix, ScreenFinal, ScreenSummary];
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

/* === MATH frac_5_15: MixedBar — aralash son (butun plitkalar + qisman plitka). Qo'shish=ko'chirish (carry), ayirish=parchalanish (borrow). === */
.mb-eq { display: inline-flex; align-items: center; gap: clamp(6px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }
.mb-grp { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); flex-wrap: wrap; justify-content: center; }
.mb-wrap { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 9px); flex-wrap: wrap; justify-content: center; }
.mb-unit { display: inline-flex; width: clamp(48px, 11.5vw, 70px); height: clamp(36px, 8vw, 50px); border-radius: 8px; overflow: hidden; box-shadow: inset 0 0 0 2px rgba(58, 53, 48, 0.14); background: #FFFFFF; flex-shrink: 0; }
.mb-cell { flex: 1; border-right: 1.5px solid #F1EEE8; background: transparent; transition: background-color 0.5s cubic-bezier(0.33, 0, 0.2, 1); }
.mb-cell:last-child { border-right: none; }
.mb-cell.on { background: linear-gradient(180deg, #FF7A5C, #FF4F28); }
.mb-cell.on-blue { background: linear-gradient(180deg, #4FC0E8, #019ACB); }
.mb-over { display: inline-flex; height: clamp(36px, 8vw, 50px); border-radius: 8px; overflow: hidden; box-shadow: inset 0 0 0 2px rgba(255, 79, 40, 0.45); flex-shrink: 0; }
.mb-ov-cell { width: clamp(15px, 3.8vw, 23px); border-right: 1.5px solid #FFFFFF; }
.mb-ov-cell:last-child { border-right: none; }
.mb-ov-cell.on { background: linear-gradient(180deg, #FFB6A4, #FF8C72); }
.mb-rise { animation: mbRise 1.5s ease-in-out infinite; }
.mb-arrive { animation: mbArrive 0.8s cubic-bezier(0.33, 0, 0.2, 1); }
.mb-break .mb-cell.on, .mb-break .mb-cell.on-blue { animation: mbBreak 0.95s ease forwards; }
.mb-plus { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.4vw, 26px); color: #0E0E10; padding: 0 2px; }
.mb-label { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(18px, 3.4vw, 25px); color: #FF4F28; line-height: 1; }
@keyframes mbRise { 0% { transform: translateY(7px); opacity: 0.45; } 50% { transform: translateY(-5px); opacity: 1; } 100% { transform: translateY(7px); opacity: 0.45; } }
@keyframes mbArrive { 0% { transform: translateY(-16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes mbBreak { 0% { transform: translateY(0); } 25% { transform: translateX(-2px); } 50% { transform: translateX(2px); } 100% { transform: translateY(9px); opacity: 0.3; } }

/* MixedNum — aralash son yozuvi (butun + kasr). */
.mn { display: inline-flex; align-items: center; gap: clamp(3px, 0.9vw, 6px); }
.mn-w { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 5vw, 36px); line-height: 1; }
.mn-result { display: inline-flex; align-items: center; gap: clamp(4px, 1.1vw, 8px); }

/* ExprLine — kasr/aralash ifodani BIR XIL o'lchamda: kasr (Frac) + operator mos kelishi uchun. */
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

/* Drag-and-drop (DragDropItem): pointer-asosli, touch ham ishlaydi (touch-action: none). Metodlar: mixfill (butun sonni katakka), dragbin (ifodani savatga: carry/borrow/oddiy). */
.dd-wrap { display: flex; flex-direction: column; align-items: center; gap: clamp(14px, 2.6vw, 20px); }
.dd-instr { margin: 0; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #019ACB; }
.dd-eq { display: inline-flex; align-items: center; gap: clamp(6px, 1.8vw, 14px); flex-wrap: wrap; justify-content: center; }
.dd-slot { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(44px, 10vw, 58px); height: clamp(48px, 11vw, 62px); border-radius: 12px; border: 2px dashed #FF4F28; background: #FFFFFF; font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 38px); color: #A7A6A2; line-height: 1; transition: all 0.3s ease; }
.dd-slot-on { border-style: solid; border-color: #1F7A4D; color: #1F7A4D; background: #E3F0E8; }
.dd-bad { border-color: #FF4F28 !important; animation: odShake 0.4s ease; }
.dd-tray-row { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.4vw, 16px); justify-content: center; }
.dd-chip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(52px, 12vw, 66px); min-height: clamp(52px, 12vw, 66px); padding: 0 clamp(10px, 2vw, 14px); border: none; border-radius: 14px; background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.28), inset 0 0 0 2px rgba(255, 79, 40, 0.25); cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; transition: box-shadow 0.2s ease, opacity 0.2s ease; }
.dd-chip:hover:not(:disabled) { box-shadow: 0 10px 24px -8px rgba(255, 79, 40, 0.4), inset 0 0 0 2px rgba(255, 79, 40, 0.5); }
.dd-chip:active { cursor: grabbing; }
.dd-chip:disabled { cursor: default; }
.dd-chip-expr { min-width: clamp(140px, 40vw, 210px); }
.dd-num { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(26px, 5.5vw, 36px); color: #FF4F28; line-height: 1; }
.dd-dragging { opacity: 0.28; }
.dd-used { opacity: 0.45; box-shadow: inset 0 0 0 2px rgba(31, 122, 77, 0.4); }
.dd-zone-on { box-shadow: 0 0 0 2px #1F7A4D inset; }
.dd-clone { position: fixed; z-index: 2000; transform: translate(-50%, -50%); pointer-events: none; display: inline-flex; align-items: center; justify-content: center; min-width: clamp(52px, 12vw, 66px); min-height: clamp(52px, 12vw, 66px); padding: 0 clamp(10px, 2vw, 14px); border-radius: 14px; background: #FFFFFF; box-shadow: 0 14px 30px -8px rgba(58, 53, 48, 0.5), inset 0 0 0 2px rgba(255, 79, 40, 0.6); }
.dd-bins3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 14px); width: 100%; }
/* tap-rejim: tanlangan chip + bosish mumkin bo'lgan nishon ko'rsatkichlari */
.dd-chip-sel { box-shadow: 0 0 0 3px #1F7A4D, 0 10px 24px -8px rgba(31, 122, 77, 0.5) !important; }
.dd-zone-pick { animation: ddPick 1.2s ease-in-out infinite; }
.dd-slot.dd-zone-pick { border-color: #1F7A4D; }
@keyframes ddPick { 0%, 100% { box-shadow: 0 0 0 2px rgba(31, 122, 77, 0.35) inset; } 50% { box-shadow: 0 0 0 3px rgba(31, 122, 77, 0.8) inset; } }

@media (prefers-reduced-motion: reduce) {
  .mb-rise, .mb-arrive, .mb-break .mb-cell.on, .mb-break .mb-cell.on-blue, .dd-bad, .dd-zone-pick { animation: none; }
  .mb-over { opacity: 1; }
}

`;
