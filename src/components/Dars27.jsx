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
// --- UROK: dec_5_04 — O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish
//          Умножение и деление десятичной дроби на 10, 100, 1000
// Keep-visible noldan yig'ish (etalon: Dars28/Dars37/Dars09). Infra Dars28 dan bayt-aniq.
// Model: VergulSakraydi — raqam yo'lakchasi; vergul o'ngga (×) yoki chapga (÷) sakraydi,
//        bo'sh kataklarga nol to'ladi. Hook = konseptual "nega nol qo'shsak xato?".
// ============================================================
const LESSON_META = {
  lessonId: 'dec-5-04-v2',
  lessonTitle: { ru: 'Умножение и деление десятичной дроби на 10, 100, 1000', uz: "O'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish" }
};
const TOTAL_SCREENS = 13;
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',          scored: false, scope: null },        // 1  spaced-retrieval (razryadlar)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },        // 2  ×10
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },        // 3  ×100/×1000
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },        // 4  ÷ (chapga, oldida nollar)
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },        // 5  qoida (birlashgan)
  { id: 's6',  type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },  // 6  5 OSON SAVOL
  { id: 's7',  type: 'test',        template: 'DragToBins',     scored: true,  scope: 'practice' },  // 7  drag-classify ×/÷
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },  // 8  vergulni qo'yish
  { id: 's9',  type: 'test',        template: 'DragToSlots',    scored: true,  scope: 'practice' },  // 9  drag-fill (nechaga?)
  { id: 's10', type: 'case',        template: 'QuestionScreen', scored: true,  scope: 'practice' },  // 10 masala (Nilufar)
  { id: 's11', type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },      // 11 6-8 MISOL OSON->QIYIN
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null }          // 12
];

const CONTENT = {
  // ── s0 HOOK — konseptual "nega nol qo'shsak xato?" (harakatli VergulSakraydi) ──
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    lead: { ru: 'Кто-то умножил 2,5 на 10 и просто приписал ноль справа — получил 2,50.', uz: "Kimdir 2,5 ni 10 ga ko'paytirdi va o'ngiga shunchaki nol qo'shdi — 2,50 chiqardi." },
    question: { ru: 'Почему приписать ноль (2,50) — это ошибка?', uz: "Nega oxiriga nol qo'shish (2,50) — bu xato?" },
    opt0: { ru: '2,50 это столько же, сколько 2,5. Умножение должно увеличить число — двигаем запятую, выходит 25.', uz: "2,50 bu 2,5 ning o'zi. Ko'paytirish sonni kattalashtirishi kerak — vergulni suramiz, 25 bo'ladi." },
    opt1: { ru: 'Всё верно, 2,50 — это правильный ответ.', uz: "Hammasi to'g'ri, 2,50 — to'g'ri javob." },
    opt2: { ru: 'Пока не уверен(а).', uz: "Hozircha aniq emas." },
    audio: { ru: 'Смотри: число две целых пять десятых умножили на десять и просто приписали ноль справа, получив две целых пять десятых с нулём. Но это то же самое число, оно не выросло. А умножение должно увеличивать. Значит ноль приписывать нельзя. Подумай, в чём тут секрет, и выбери ответ.', uz: "Qara: ikki butun o'ndan besh sonini o'nga ko'paytirib, o'ngiga shunchaki nol qo'shishdi, nol bilan ikki butun o'ndan besh chiqdi. Lekin bu o'sha sonning o'zi, u o'smadi. Ko'paytirish esa kattalashtirishi kerak. Demak nol qo'shib bo'lmaydi. Siri nimada ekanini o'ylab, javobni tanlang." }
  },

  // ── s1 WARM-UP — SeqMC, spaced retrieval (razryadlar, dec_5_01) ──
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    title: { ru: 'Вспомним разряды', uz: "Xonalarni eslaymiz" },
    lead: { ru: 'Три быстрых вопроса — сегодня пригодятся.', uz: "Uchta tez savol — bugun asqotadi." },
    audio: {
      intro: { ru: 'Перед новой темой вспомним разряды. Чему равна ноль целых семь десятых обыкновенной дробью? Нажми ответ.', uz: "Yangi mavzudan oldin xonalarni eslaymiz. Nol butun o'ndan yetti oddiy kasr bilan nechaga teng? Javobni bosing." },
      on_wrong: { ru: 'Не совсем. Сколько цифр после запятой, столько нулей в знаменателе.', uz: "Unchalik emas. Verguldan keyin nechta raqam, maxrajda shuncha nol." },
      on_done: { ru: 'Разряды помним. Теперь к новой теме.', uz: "Xonalarni eslaymiz. Endi yangi mavzuga." }
    },
    questions: [
      { q: { ru: '0,7 = ?', uz: "0,7 = ?" }, opts: ['7/100', '7/10', '1/7'], correct: 1,
        say: { ru: 'Сколько это обыкновенной дробью?', uz: "Bu oddiy kasr bilan nechaga teng?" },
        ok: { ru: 'Одна цифра после запятой — десятые: 7/10.', uz: "Verguldan keyin bitta raqam — o'ndan: 7/10." },
        no: { ru: 'Одна цифра после запятой, это десятые.', uz: "Verguldan keyingi bitta raqam, o'ndan." } },
      { q: { ru: '0,03 = ?', uz: "0,03 = ?" }, opts: ['3/100', '3/10', '3/1000'], correct: 0,
        say: { ru: 'А теперь сотые.', uz: "Endi yuzdan." },
        ok: { ru: 'Две цифры после запятой — сотые: 3/100.', uz: "Verguldan keyin ikki raqam — yuzdan: 3/100." },
        no: { ru: 'Две цифры после запятой, это сотые.', uz: "Verguldan keyin ikki raqam, yuzdan." } },
      { q: { ru: '1/1000 = ?', uz: "1/1000 = ?" }, opts: ['0,1', '0,01', '0,001'], correct: 2,
        say: { ru: 'И последний.', uz: "Va oxirgisi." },
        ok: { ru: 'Тысячные — три цифры после запятой: 0,001.', uz: "Mingdan — verguldan keyin uch raqam: 0,001." },
        no: { ru: 'Тысячные стоят на третьем месте после запятой.', uz: "Mingdan verguldan keyin uchinchi o'rinda turadi." } }
    ]
  },

  // ── s2 EXPLORATION: ×10 — vergul 1 o'rin o'ngga (harakatli) ──
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Умножаем на 10', uz: "10 ga ko'paytiramiz" },
    conclusion: { ru: 'Умножить на 10 — это сдвинуть запятую на одно место вправо. 2,5 стало 25 — в десять раз больше.', uz: "10 ga ko'paytirish — vergulni bir o'rin o'ngga surish. 2,5 endi 25 bo'ldi — o'n marta katta." },
    btn_step: { ru: 'Умножить на 10', uz: "10 ga ko'paytirish" },
    btn_final: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: {
      ru: [
        'Вернёмся к нашему числу две целых пять десятых. Умножим его на десять. Нажми кнопку.',
        'Запятая прыгнула на одно место вправо. Было две целых пять десятых, стало двадцать пять. Это в десять раз больше, как и должно быть при умножении. Никакого нуля приписывать не нужно.'
      ],
      uz: [
        "Sonimizga qaytamiz, ikki butun o'ndan besh. Uni o'nga ko'paytiramiz. Tugmani bosing.",
        "Vergul bir o'rin o'ngga sakradi. Ikki butun o'ndan besh edi, yigirma besh bo'ldi. Bu o'n marta katta, ko'paytirishda shunday bo'lishi kerak. Hech qanday nol qo'shish shart emas."
      ]
    }
  },

  // ── s3 EXPLORATION: ×100 — ikki sakrash, bo'sh xonaga nol ──
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'На 100 — два прыжка', uz: "100 ga — ikki sakrash" },
    conclusion: { ru: 'Сколько нулей в множителе — на столько мест прыгает запятая. На 100 — два места; не хватило цифры — встал ноль: 250. На 1000 было бы три места.', uz: "Ko'paytuvchida nechta nol — vergul shuncha o'rin sakraydi. 100 ga — ikki o'rin; raqam yetmadi — nol turdi: 250. 1000 ga uch o'rin bo'lardi." },
    btn_step: { ru: 'Умножить на 100', uz: "100 ga ko'paytirish" },
    btn_final: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: {
      ru: [
        'А если умножить на сто? У ста два нуля, значит запятая прыгнет на два места. Нажми кнопку.',
        'Запятая прыгнула на два места вправо. Цифры не хватило, и на пустой разряд встал ноль, получилось двести пятьдесят. А на тысячу запятая прыгнула бы на три места, потому что у тысячи три нуля.'
      ],
      uz: [
        "100 ga ko'paytirsak-chi? Yuzning ikkita noli bor, demak vergul ikki o'rin sakraydi. Tugmani bosing.",
        "Vergul ikki o'rin o'ngga sakradi. Raqam yetmadi va bo'sh xonaga nol turdi, ikki yuz ellik bo'ldi. Mingga esa vergul uch o'rin sakrardi, chunki mingning uchta noli bor."
      ]
    }
  },

  // ── s4 EXPLORATION: ÷100 — vergul chapga, oldida nollar ──
  s4: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Делим — запятая идёт влево', uz: "Bo'lamiz — vergul chapga boradi" },
    conclusion: { ru: 'При делении запятая идёт влево. 5 разделить на 100 — два места влево; слева цифр не хватило, поэтому впереди появились нули и ноль целых: 0,05. На 1000 было бы три места — 0,005.', uz: "Bo'lishda vergul chapga boradi. 5 ni 100 ga — ikki o'rin chapga; chapda raqam yetmadi, shuning uchun oldida nollar va nol butun paydo bo'ldi: 0,05. 1000 ga uch o'rin bo'lardi — 0,005." },
    btn_step: { ru: 'Разделить на 100', uz: "100 ga bo'lish" },
    btn_final: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: {
      ru: [
        'Теперь деление. Возьмём целое число пять и разделим на сто. У ста два нуля. Нажми кнопку.',
        'Запятая пошла влево на два места. Слева цифр не хватило, поэтому впереди появились нули и ноль целых, получилось ноль целых пять сотых. Деление уменьшает число, и это правильно.'
      ],
      uz: [
        "Endi bo'lish. Butun son beshni olamiz va yuzga bo'lamiz. Yuzning ikkita noli bor. Tugmani bosing.",
        "Vergul chapga ikki o'rin bordi. Chapda raqam yetmadi, shuning uchun oldida nollar va nol butun paydo bo'ldi, nol butun yuzdan besh chiqdi. Bo'lish sonni kichraytiradi, bu to'g'ri."
      ]
    }
  },

  // ── s5 RULE — birlashgan qoida ──
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Одно правило для всего', uz: "Hammasi uchun bitta qoida" },
    label: { ru: 'Запомни', uz: "Eslab qoling" },
    rule_mul: { ru: 'Умножаем на 10, 100, 1000 — запятая идёт ВПРАВО на столько мест, сколько нулей в множителе.', uz: "10, 100, 1000 ga ko'paytiramiz — vergul ko'paytuvchidagi nollar soni qancha bo'lsa, shuncha o'rin O'NGGA boradi." },
    rule_div: { ru: 'Делим на 10, 100, 1000 — запятая идёт ВЛЕВО на столько же мест.', uz: "10, 100, 1000 ga bo'lamiz — vergul shuncha o'rin CHAPGA boradi." },
    warn_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warn: { ru: 'Не приписывай ноль, как у целых чисел! Двигай запятую, а нули — только чтобы заполнить пустые разряды.', uz: "Butun sonlardek nol qo'shmang! Vergulni suring, nollarni esa — faqat bo'sh xonalarni to'ldirish uchun." },
    audio: { ru: 'Соберём одно правило. Чтобы умножить на десять, сто или тысячу, сдвигаем запятую вправо на столько мест, сколько нулей в множителе. Чтобы разделить — на столько же мест, но влево. И главное: не приписывай ноль, как у целых чисел. Мы двигаем запятую, а нули ставим только туда, где не хватило цифр.', uz: "Bitta qoidaga yig'amiz. O'nga, yuzga yoki mingga ko'paytirish uchun vergulni nollar soni qancha bo'lsa shuncha o'rin o'ngga suramiz. Bo'lish uchun — shuncha o'rin, lekin chapga. Eng muhimi: butun sonlardek nol qo'shmang. Biz vergulni suramiz, nollarni esa faqat raqam yetmagan joyga qo'yamiz." }
  },

  // ── s6 — 5 OSON SAVOL (SeqMC, scored practice) ──
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: '5 быстрых примеров', uz: "5 ta tez misol" },
    lead: { ru: 'Сдвигай запятую в уме. Нажми ответ.', uz: "Vergulni xayolan suring. Javobni bosing." },
    audio: {
      intro: { ru: 'Пять быстрых примеров. Считай, на сколько мест и в какую сторону идёт запятая. Нажимай ответ.', uz: "Besh ta tez misol. Vergul necha o'rin va qaysi tomonga borishini sanang. Javobni bosing." },
      on_wrong: { ru: 'Не спеши. Сколько нулей, столько мест; умножаем, вправо, делим, влево.', uz: "Shoshmang. Nechta nol, shuncha o'rin; ko'paytirsak, o'ngga, bo'lsak, chapga." },
      on_done: { ru: 'Отлично, все пять решены.', uz: "Ajoyib, beshtasi ham yechildi." }
    },
    questions: [
      { q: { ru: '1,4 × 10', uz: "1,4 × 10" }, opts: ['1,40', '14', '140'], correct: 1,
        say: { ru: 'Одна целая четыре десятых умножить на десять.', uz: "Bir butun o'ndan to'rt karra o'n." },
        ok: { ru: 'На 10 — одно место вправо: 14.', uz: "10 ga — bir o'rin o'ngga: 14." },
        no: { ru: 'Двигай запятую на одно место вправо, ноль не дописывай.', uz: "Vergulni bir o'rin o'ngga suring, nol qo'shmang." } },
      { q: { ru: '6 ÷ 10', uz: "6 ÷ 10" }, opts: ['0,6', '60', '0,06'], correct: 0,
        say: { ru: 'Шесть разделить на десять.', uz: "Olti bo'lingan o'n." },
        ok: { ru: 'На 10 — одно место влево: 0,6.', uz: "10 ga — bir o'rin chapga: 0,6." },
        no: { ru: 'При делении запятая идёт влево на одно место.', uz: "Bo'lishda vergul bir o'rin chapga boradi." } },
      { q: { ru: '0,3 × 100', uz: "0,3 × 100" }, opts: ['3', '300', '30'], correct: 2,
        say: { ru: 'Ноль целых три десятых умножить на сто.', uz: "Nol butun o'ndan uch karra yuz." },
        ok: { ru: 'На 100 — два места вправо: 30.', uz: "100 ga — ikki o'rin o'ngga: 30." },
        no: { ru: 'На сто двигай вправо на два места.', uz: "Yuzga ikki o'rin o'ngga suring." } },
      { q: { ru: '2,5 × 10', uz: "2,5 × 10" }, opts: ['2,50', '25', '250'], correct: 1,
        say: { ru: 'Две целых пять десятых умножить на десять.', uz: "Ikki butun o'ndan besh karra o'n." },
        ok: { ru: 'Верно: 25, а не 2,50. Запятую двигаем, ноль не приписываем.', uz: "To'g'ri: 25, 2,50 emas. Vergulni suramiz, nol qo'shmaymiz." },
        no: { ru: '2,50 это то же, что 2,5. Сдвинь запятую, будет 25.', uz: "2,50 bu 2,5 ning o'zi. Vergulni suring, 25 bo'ladi." } },
      { q: { ru: '45 ÷ 1000', uz: "45 ÷ 1000" }, opts: ['0,45', '0,045', '0,0045'], correct: 1,
        say: { ru: 'Сорок пять разделить на тысячу.', uz: "Qirq besh bo'lingan ming." },
        ok: { ru: 'На 1000 — три места влево: 0,045.', uz: "1000 ga — uch o'rin chapga: 0,045." },
        no: { ru: 'На тысячу запятая идёт влево на три места.', uz: "Mingga vergul uch o'rin chapga boradi." } }
    ]
  },

  // ── s7 — DRAG-CLASSIFY: ×(katta) / ÷(kichik) savatlari ──
  s7: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'Станет больше или меньше?', uz: "Katta yoki kichik bo'ladi?" },
    lead: { ru: 'Перетащи каждую запись в нужную корзину: число станет больше или меньше.', uz: "Har bir yozuvni kerakli savatga sudrang: son katta yoki kichik bo'ladi." },
    bin_big: { ru: 'Станет больше (×)', uz: "Katta bo'ladi (×)" },
    bin_small: { ru: 'Станет меньше (÷)', uz: "Kichik bo'ladi (÷)" },
    it0: { ru: '2,5 × 10', uz: "2,5 × 10" },
    it1: { ru: '6 ÷ 10', uz: "6 ÷ 10" },
    it2: { ru: '0,3 × 100', uz: "0,3 × 100" },
    it3: { ru: '40 ÷ 1000', uz: "40 ÷ 1000" },
    tray_label: { ru: 'Записи', uz: "Yozuvlar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Умножение увеличивает число, деление уменьшает. Смотри на знак.', uz: "Ko'paytirish sonni kattalashtiradi, bo'lish kichraytiradi. Belgiga qarang." },
    correct_text: { ru: 'Верно! Умножение на 10, 100, 1000 увеличивает, деление — уменьшает.', uz: "To'g'ri! 10, 100, 1000 ga ko'paytirish kattalashtiradi, bo'lish — kichraytiradi." },
    fact: { ru: 'Компьютер умножение на 10, 100 и 1000 делает сдвигом запятой — это одна из самых быстрых операций.', uz: "Kompyuter 10, 100, 1000 ga ko'paytirishni vergul surish bilan bajaradi — bu eng tez amallardan biri." },
    audio: {
      intro: { ru: 'Рассортируй записи. Если умножаем, число станет больше, если делим, меньше. Нажми или перетащи в корзину, потом нажми проверить.', uz: "Yozuvlarni ajrating. Ko'paytirsak, son katta, bo'lsak, kichik bo'ladi. Savatga bosing yoki sudrang, keyin tekshirishni bosing." },
      on_correct: { ru: 'Отлично. Умножение увеличивает, деление уменьшает.', uz: "Ajoyib. Ko'paytirish kattalashtiradi, bo'lish kichraytiradi." },
      on_wrong: { ru: 'Пока не так. Знак умножения увеличивает, деления, уменьшает.', uz: "Hozircha emas. Ko'paytirish belgisi kattalashtiradi, bo'lish, kichraytiradi." }
    }
  },

  // ── s8 — VERGULNI QO'YISH (custom): 475 ÷ 100 = 4,75 ──
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Поставь запятую', uz: "Vergulni qo'ying" },
    lead: { ru: '475 ÷ 100. Нажми на промежуток между цифрами, куда встанет запятая.', uz: "475 ÷ 100. Vergul turadigan, raqamlar orasidagi oraliqni bosing." },
    digits: '475',
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'На 100 запятая идёт влево на два места от правого края: между 4 и 7.', uz: "100 ga vergul o'ng chetdan chapga ikki o'rin boradi: 4 va 7 orasiga." },
    correct_text: { ru: 'Верно: 475 ÷ 100 = 4,75. Два места влево.', uz: "To'g'ri: 475 ÷ 100 = 4,75. Ikki o'rin chapga." },
    audio: {
      intro: { ru: 'Поставь запятую сам. Четыреста семьдесят пять разделить на сто. Нажми на нужный промежуток между цифрами, потом нажми проверить.', uz: "Vergulni o'zingiz qo'ying. To'rt yuz yetmish beshni yuzga bo'lamiz. Kerakli oraliqni bosing, keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно, четыре целых семьдесят пять сотых.', uz: "To'g'ri, to'rt butun yuzdan yetmish besh." },
      on_wrong: { ru: 'Пока нет. На сто, это два места влево от конца.', uz: "Hali emas. Yuzga, bu oxiridan ikki o'rin chapga." }
    }
  },

  // ── s9 — DRAG-FILL: 0,04 ni nechaga ko'paytirsak 40 chiqadi? ──
  s9: {
    eyebrow: { ru: 'Перетащи', uz: "Sudrang" },
    title: { ru: 'На что умножили?', uz: "Nechaga ko'paytirilgan?" },
    lead: { ru: 'Обратный ход. Перетащи нужный множитель в клетку, чтобы из 0,04 получилось 40.', uz: "Teskari yo'l. 0,04 dan 40 chiqishi uchun kerakli ko'paytuvchini katakka sudrang." },
    tray_label: { ru: 'Множители', uz: "Ko'paytuvchilar" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'От 0,04 до 40 запятая прыгнула на три места вправо. Три нуля — это 1000.', uz: "0,04 dan 40 gacha vergul uch o'rin o'ngga sakradi. Uch nol — bu 1000." },
    correct_text: { ru: 'Верно! Запятая прыгнула на три места — значит умножили на 1000.', uz: "To'g'ri! Vergul uch o'rin sakradi — demak 1000 ga ko'paytirilgan." },
    fact: { ru: 'Размеры данных растут шагами по 1000: килобайт, мегабайт, гигабайт. Каждый шаг — сдвиг запятой на три места.', uz: "Ma'lumot hajmi 1000 lik qadamlar bilan o'sadi: kilobayt, megabayt, gigabayt. Har qadam — vergulni uch o'rin surish." },
    audio: {
      intro: { ru: 'Обратный ход. На что умножили ноль целых четыре сотых, чтобы вышло сорок? Перетащи или нажми нужный множитель в клетку, потом нажми проверить.', uz: "Teskari yo'l. Nol butun yuzdan to'rtni nechaga ko'paytirsak qirq chiqadi? Kerakli ko'paytuvchini katakka sudrang yoki bosing, keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно, на тысячу. Запятая прошла три места вправо.', uz: "To'g'ri, mingga. Vergul uch o'rin o'ngga bordi." },
      on_wrong: { ru: 'Пока нет. Посчитай, на сколько мест прыгнула запятая.', uz: "Hali emas. Vergul necha o'rin sakraganini sanang." }
    }
  },

  // ── s10 — CASE (Nilufar, foto hajmi): 100 × 0,2 = 20 MB (QuestionScreen, keep-visible) ──
  s10: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    label: { ru: 'Сколько весят все фото?', uz: "Hamma foto qancha tortadi?" },
    lead: { ru: 'Это нужно в жизни. Нилуфар загружает в облако 100 фотографий, каждая по 0,2 МБ.', uz: "Bu hayotda kerak. Nilufar bulutga 100 ta foto yuklamoqda, har biri 0,2 MB." },
    question_text: { ru: '100 × 0,2 МБ = ?', uz: "100 × 0,2 MB = ?" },
    opt0: { ru: '20 МБ', uz: "20 MB" },
    opt1: { ru: '2 МБ', uz: "2 MB" },
    opt2: { ru: '200 МБ', uz: "200 MB" },
    opt3: { ru: '0,2 МБ', uz: "0,2 MB" },
    correct_text: { ru: 'Верно. Умножаем на 100 — запятая на два места вправо: 0,2 → 20 МБ.', uz: "To'g'ri. 100 ga ko'paytiramiz — vergul ikki o'rin o'ngga: 0,2 → 20 MB." },
    wrong_1: { ru: 'Это сдвиг лишь на одно место (на 10). А множитель 100 — два места: 20 МБ.', uz: "Bu faqat bir o'rin surish (10 ga). Ko'paytuvchi 100 esa — ikki o'rin: 20 MB." },
    wrong_2: { ru: 'Три места — это умножение на 1000. А у нас 100 — два места: 20 МБ.', uz: "Uch o'rin — bu 1000 ga ko'paytirish. Bizda 100 — ikki o'rin: 20 MB." },
    wrong_3: { ru: 'Это размер одной фотографии. А их 100, значит число станет больше: 20 МБ.', uz: "Bu bitta fotoning hajmi. Ular 100 ta, demak son katta bo'ladi: 20 MB." },
    wrong_default: { ru: 'Умножаем на 100 — два места вправо: 0,2 → 20 МБ.', uz: "100 ga ko'paytiramiz — ikki o'rin o'ngga: 0,2 → 20 MB." },
    audio_hint_1: { ru: 'Это сдвиг только на одно место. У множителя сто два нуля, нужно два места.', uz: "Bu faqat bir o'rin surish. Ko'paytuvchi yuzning ikkita noli bor, ikki o'rin kerak." },
    audio_hint_2: { ru: 'Три места, это для тысячи. У нас сто, значит два места.', uz: "Uch o'rin, bu ming uchun. Bizda yuz, demak ikki o'rin." },
    audio_hint_3: { ru: 'Это размер одной фотографии. Их сто, поэтому число должно вырасти.', uz: "Bu bitta fotoning hajmi. Ular yuzta, shuning uchun son o'sishi kerak." },
    fact: { ru: 'Учёные большие и малые числа пишут через степени десяти и сдвиг запятой. Скорость света — около 3·10⁵ км/с.', uz: "Olimlar katta va kichik sonlarni o'nning darajasi va vergul surish bilan yozadi. Yorug'lik tezligi — taxminan 3·10⁵ km/s." },
    audio: {
      intro: { ru: 'Нилуфар загружает сто фотографий, каждая по ноль целых две десятых мегабайта. Сколько мегабайт займут все сто? Здесь умножаем на сто. Выбери ответ.', uz: "Nilufar yuzta foto yuklamoqda, har biri nol butun o'ndan ikki megabayt. Hammasi yuztasi necha megabayt egallaydi? Bu yerda yuzga ko'paytiramiz. Javobni tanlang." },
      on_correct: { ru: 'Верно. Умножили на сто, запятая прошла два места вправо: ноль целых две десятых стало двадцать. А вот и факт: учёные большие и малые числа записывают через степени десяти и сдвиг запятой.', uz: "To'g'ri. Yuzga ko'paytirdik, vergul ikki o'rin o'ngga bordi: nol butun o'ndan ikki yigirma bo'ldi. Mana fakt: olimlar katta va kichik sonlarni o'nning darajalari va vergul surish bilan yozadi." },
      on_wrong: { ru: 'Пока нет. Посмотри разбор.', uz: "Hali emas. Tushuntirishga qarang." }
    }
  },

  // ── s11 — 6-8 MISOL OSON->QIYIN (SeqMix: mc / input / multi), YAKUNIY ──
  s11: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Примеры: от простого к сложному', uz: "Misollar: oddiydan murakkabga" },
    lead: { ru: 'Семь примеров. Каждый чуть сложнее.', uz: "Yetti misol. Har biri biroz qiyinroq." },
    audio: {
      intro: { ru: 'Семь примеров, от простого к сложному. Для каждого считай, на сколько мест и в какую сторону идёт запятая. Поехали.', uz: "Yetti misol, oddiydan murakkabga. Har biriga vergul necha o'rin va qaysi tomonga borishini sanang. Boshladik." },
      on_wrong: { ru: 'Не совсем. Считай нули множителя и сторону: умножаем, вправо, делим, влево.', uz: "Unchalik emas. Ko'paytuvchi nollarini va tomonni sanang: ko'paytirsak, o'ngga, bo'lsak, chapga." },
      on_done: { ru: 'Отлично. Ты прошёл от простого примера до самого трудного.', uz: "Zo'r. Oson misoldan eng qiyiniga qadar yetib bordingiz." }
    },
    items: [
      { type: 'mc', q: { ru: '3,1 × 10', uz: "3,1 × 10" }, opts: ['31', '3,10', '310'], correct: 0,
        say: { ru: 'Три целых одна десятая умножить на десять.', uz: "Uch butun o'ndan bir karra o'n." },
        ok: { ru: 'Верно. Одно место вправо: 31.', uz: "To'g'ri. Bir o'rin o'ngga: 31." },
        no: { ru: 'На 10, одно место вправо, ноль не дописывай.', uz: "10 ga, bir o'rin o'ngga, nol qo'shmang." } },
      { type: 'input', q: { ru: '8 ÷ 10 = ?', uz: "8 ÷ 10 = ?" }, answer: 0.8,
        say: { ru: 'Восемь разделить на десять. Введи ответ.', uz: "Sakkiz bo'lingan o'n. Javobni kiriting." },
        ok: { ru: 'Верно. 8 это 8,0; влево на одно место — 0,8.', uz: "To'g'ri. 8 bu 8,0; chapga bir o'rin — 0,8." },
        no: { ru: 'У 8 запятая справа: 8,0. Подвинь влево на одно место.', uz: "8 da vergul o'ngda: 8,0. Chapga bir o'rin suring." } },
      { type: 'mc', q: { ru: '0,5 × 100', uz: "0,5 × 100" }, opts: ['5', '50', '500'], correct: 1,
        say: { ru: 'Ноль целых пять десятых умножить на сто.', uz: "Nol butun o'ndan besh karra yuz." },
        ok: { ru: 'Верно. Два места вправо — запятая ушла, стало целое 50.', uz: "To'g'ri. Ikki o'rin o'ngga — vergul ketdi, butun 50 bo'ldi." },
        no: { ru: 'На 100, два места вправо. Запятая уйдёт за цифру, выйдет целое.', uz: "100 ga, ikki o'rin o'ngga. Vergul raqamdan o'tadi, butun chiqadi." } },
      { type: 'multi', q: { ru: 'Какие записи равны 25?', uz: "Qaysi yozuvlar 25 ga teng?" }, opts: ['2,5 × 10', '2,50', '250 ÷ 10', '0,25 × 100'], correctSet: [0, 2, 3],
        say: { ru: 'Отметь все записи, равные двадцати пяти. Их несколько.', uz: "Yigirma beshga teng barcha yozuvlarni belgilang. Ular bir nechta." },
        ok: { ru: 'Верно. 2,5 × 10, 250 ÷ 10 и 0,25 × 100 дают 25. А 2,50 это всего лишь 2,5.', uz: "To'g'ri. 2,5 × 10, 250 ÷ 10 va 0,25 × 100 25 ga teng. 2,50 esa atigi 2,5." },
        no: { ru: 'Посчитай каждую и помни: приписать ноль нельзя, 2,50 это 2,5.', uz: "Har birini hisoblang va yodda tuting: nol qo'shib bo'lmaydi, 2,50 bu 2,5." } },
      { type: 'input', q: { ru: '5 ÷ 100 = ?', uz: "5 ÷ 100 = ?" }, answer: 0.05,
        say: { ru: 'Пять разделить на сто. Запятая пойдёт влево на два места.', uz: "Beshni yuzga bo'lamiz. Vergul chapga ikki o'rin boradi." },
        ok: { ru: 'Верно. Слева не хватило цифр — впереди ноль целых и ноль: 0,05.', uz: "To'g'ri. Chapda raqam yetmadi — oldida nol butun va nol: 0,05." },
        no: { ru: 'Двигай запятую влево и впереди допиши нули: 0,05.', uz: "Vergulni chapga suring va oldiga nol qo'shing: 0,05." } },
      { type: 'mc', q: { ru: '3,6 ÷ 100', uz: "3,6 ÷ 100" }, opts: ['36', '0,036', '0,36'], correct: 1,
        say: { ru: 'Три целых шесть десятых разделить на сто.', uz: "Uch butun o'ndan olti bo'lingan yuz." },
        ok: { ru: 'Верно. Влево на два места, впереди нули: 0,036.', uz: "To'g'ri. Chapga ikki o'rin, oldida nollar: 0,036." },
        no: { ru: 'Деление, влево на два места; впереди допиши нули.', uz: "Bo'lish, chapga ikki o'rin; oldiga nol qo'shing." } },
      { type: 'input', q: { ru: '0,008 × 1000 = ?', uz: "0,008 × 1000 = ?" }, answer: 8,
        say: { ru: 'Ноль целых восемь тысячных умножить на тысячу. Введи ответ.', uz: "Nol butun mingdan sakkiz karra ming. Javobni kiriting." },
        ok: { ru: 'Верно. Три места вправо — запятая ушла, стало целое 8.', uz: "To'g'ri. Uch o'rin o'ngga — vergul ketdi, butun 8 bo'ldi." },
        no: { ru: 'У 1000 три нуля, три места вправо. Запятая уйдёт, выйдет 8.', uz: "1000 ning uchta noli bor, uch o'rin o'ngga. Vergul ketadi, 8 chiqadi." } }
    ]
  },

  // ── s12 — SUMMARY (kanonik Dars09-13 layout) ──
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты умножаешь и делишь на 10, 100 и 1000.', uz: "Endi siz 10, 100 va 1000 ga ko'paytirasiz va bo'lasiz." },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "savolga birinchi urinishda to'g'ri javob" },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Умножаем — запятая идёт вправо, делим — влево.', uz: "Ko'paytiramiz — vergul o'ngga, bo'lamiz — chapga boradi." },
    main_2: { ru: 'На сколько мест: сколько нулей в множителе (10 — одно, 100 — два, 1000 — три).', uz: "Necha o'rin: ko'paytuvchida nechta nol (10 — bir, 100 — ikki, 1000 — uch)." },
    main_3: { ru: 'Не хватает цифр — ставим нули в пустые разряды (250; 0,05).', uz: "Raqam yetmasa — bo'sh xonalarga nol qo'yamiz (250; 0,05)." },
    main_4: { ru: 'Не приписывай ноль, как у целых: 2,5 × 10 это 25, а не 2,50.', uz: "Butun sonlardek nol qo'shmang: 2,5 × 10 bu 25, 2,50 emas." },
    back_to_hook: { ru: '2,5 × 10 это не 2,50, а 25 — запятая шагнула вправо.', uz: "2,5 × 10 bu 2,50 emas, 25 — vergul o'ngga qadam tashladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Десятичная дробь и разряды» — десятые, сотые, тысячные.', uz: "«O'nli kasr va xonalar» — o'ndan, yuzdan, mingdan." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'умножение десятичной дроби на десятичную дробь.', uz: "o'nli kasrni o'nli kasrga ko'paytirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты умножаешь и делишь десятичную дробь на десять, сто и тысячу. Умножаем — запятая идёт вправо, делим — влево, на столько мест, сколько нулей в множителе. Если цифр не хватило, ставим нули в пустые разряды. И помни: ноль приписывать нельзя — две целых пять десятых умножить на десять это двадцать пять, а не две целых пять десятых с нулём. Дальше научимся умножать десятичную дробь на десятичную.', uz: "Zo'r. Endi siz o'nli kasrni o'nga, yuzga va mingga ko'paytirasiz va bo'lasiz. Ko'paytiramiz — vergul o'ngga, bo'lamiz — chapga, ko'paytuvchidagi nollar soni qancha bo'lsa shuncha o'rin. Raqam yetmasa, bo'sh xonalarga nol qo'yamiz. Va yodda tuting: nol qo'shib bo'lmaydi — ikki butun o'ndan besh karra o'n bu yigirma besh, nol bilan ikki butun o'ndan besh emas. Keyin o'nli kasrni o'nli kasrga ko'paytirishni o'rganamiz." }
  }
};

// ============================================================
// YORDAMCHILAR (Title/shuffleMC/ConnectionsBlock/Floaters infra'da YO'Q — shu yerda)
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };

const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

// Ikonka ✓ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);

const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// ============================================================
// FAKT-BLOK (ko'k karta, to'g'ri javobdan keyin)
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const FACT_BADGE_SCI = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" };
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const AnimPow = () => (<div className="fa-pow"><span className="fa-pow-b">10</span><span className="fa-pow-e">n</span></div>);
const FactCard = ({ text, anim, badge = FACT_BADGE }) => {
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
// VIZUALIZATOR — VergulSakraydi (raqam yo'lakchasi; vergul sakraydi, bo'sh katakka nol)
// cells: [{ d:'2', state:'on'|'off'|'new' }], comma: chegara indeksi (1..cells.length).
// vergul left = comma * (katak eni + 4px); transition bilan siljiydi. comma===length => butun (yashirin).
// ============================================================
const CommaHop = ({ cells, comma, cw = 'clamp(28px, 6.5vw, 40px)' }) => {
  const n = cells.length;
  const showComma = comma > 0 && comma < n;
  return (
    <div className="vh-wrap" aria-hidden="true">
      <span className="vh-cells" style={{ '--vcw': cw, '--cp': comma }}>
        {cells.map((cell, i) => (
          <span key={i} className={`vh-cell${cell.state === 'off' ? ' vh-off' : ''}${cell.state === 'new' ? ' vh-new' : ''}`}>{cell.state === 'off' ? '' : cell.d}</span>
        ))}
        <span className={`vh-comma${showComma ? '' : ' vh-comma-off'}`}>,</span>
      </span>
    </div>
  );
};
// Tayyor satr "a × b = c" / "a ÷ b = c" — mono, bo'yalgan natija (rule/case uchun).
const EqLine = ({ a, op, b, c }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 10px)', justifyContent: 'center', flexWrap: 'wrap', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 'clamp(18px, 3.4vw, 24px)' }}>
    <span style={{ color: T.ink }}>{a}</span><Op>{op}</Op><span style={{ color: T.ink }}>{b}</span><Op>=</Op><span style={{ color: T.success }}>{c}</span>
  </div>
);

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (mobil tap). веди-до-верного; oxirida bitta ball.
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true" style={{ position: 'relative' }}>
          {qs.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma savol yechildi." : 'Все вопросы решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(16px, 2.4vw, 20px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {mt(tx(o))}
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
// SeqMix — ketma-ket har xil turdagi savollar (mc / input / multi). веди-до-верного; oxirida bitta ball.
// input — o'nli son (vergul yoki nuqta qabul qilinadi).
// ============================================================
const parseDec = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/[^\d.-]/g, '')); return isNaN(v) ? null : v; };
const fmtDec = (n) => String(n).replace('.', ',');

const SeqMix = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const items = c.items; const n = items.length;
  const tx = (v) => (typeof v === 'string' ? v : t(v));
  const audio = useAudio([{ id: `mix${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [idx, setIdx] = useState(wasSolved ? n - 1 : 0);
  const [done, setDone] = useState(wasSolved);
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [wrong, setWrong] = useState(() => new Set());
  const [sel, setSel] = useState(() => new Set());
  const [val, setVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const itemErrRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const advanceRef = useRef(null);
  const it = items[idx];

  const sayItem = (i) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted && items[i].say) e.pushOneOff(items[i].say[lang]); } };
  const voiceWrong = (node) => { if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff((node && node[lang]) || c.audio.on_wrong[lang]); } };

  const finishAll = (firstTries) => {
    setDone(true);
    if (scored) {
      const ok = firstTries.filter(Boolean).length; const allOk = ok === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: tx(c.title), correctAnswer: 'all', studentAnswer: `${ok}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect: ok, itemsTotal: n, itemsFirstTry: firstTries, solved: true });
    }
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_done[lang]); }
  };

  const markFirstTry = (correct) => { if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct; };
  const advance = () => {
    setSolvedItem(true); sfx.playCorrect();
    const cur = firstTryRef.current.slice();
    advanceRef.current = setTimeout(() => {
      if (idx < n - 1) { const ni = idx + 1; setIdx(ni); setSolvedItem(false); setWrong(new Set()); setSel(new Set()); setVal(''); setShowHint(false); itemErrRef.current = false; sayItem(ni); }
      else finishAll(cur);
    }, 850);
  };

  const pickMc = (i) => {
    if (done || solvedItem || wrong.has(i)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = i === it.correct;
    if (isCorrect) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setWrong(prev => { const s = new Set(prev); s.add(i); return s; }); voiceWrong(it.no); }
  };
  const submitInput = () => {
    if (done || solvedItem) return;
    const v = parseDec(val);
    if (v === null) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const isCorrect = Math.abs(v - it.answer) < 1e-9;
    if (isCorrect) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setShowHint(true); voiceWrong(it.no); }
  };
  const toggleMulti = (i) => { if (done || solvedItem) return; setShowHint(false); setSel(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const submitMulti = () => {
    if (done || solvedItem) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const want = new Set(it.correctSet);
    const ok = sel.size === want.size && [...sel].every(i => want.has(i));
    if (ok) { markFirstTry(!itemErrRef.current); advance(); }
    else { itemErrRef.current = true; markFirstTry(false); sfx.playWrong(); setShowHint(true); voiceWrong(it.no); }
  };
  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(tx(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(tx(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true" style={{ position: 'relative' }}>
          {items.map((_, i) => <span key={i} className={`seq-dot${(i < idx || (i === idx && solvedItem) || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {done ? (
          <div className="frame-success fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.'}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 'clamp(14px, 2.6vw, 20px)' }}>
              {(() => { const qStr = tx(it.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(qStr)}</p>; })()}
              {it.type === 'input' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <input type="text" inputMode="decimal" className={`answer-input ${solvedItem ? 'correct' : ''}`} value={solvedItem ? fmtDec(it.answer) : val} placeholder="0,0" disabled={solvedItem}
                    onChange={e => { setVal(e.target.value); setShowHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(100px, 22vw, 130px)' }}/>
                  {!solvedItem && <button className="btn-white-accent" onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
                </div>
              )}
            </div>
            {it.type === 'mc' && (
              <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {it.opts.map((o, i) => {
                  let cls = 'option';
                  const isWrong = wrong.has(i); const isCorr = i === it.correct;
                  if (solvedItem && isCorr) cls += ' option-correct';
                  else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pickMc(i)}
                      style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.2vw, 19px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      {mt(tx(o))}
                    </button>
                  );
                })}
              </div>
            )}
            {it.type === 'multi' && (
              <>
                <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  {it.opts.map((o, i) => {
                    const on = sel.has(i);
                    return (
                      <button key={i} className={`option${on ? ' option-correct' : ''}`} disabled={solvedItem} onClick={() => toggleMulti(i)}
                        style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {mt(tx(o))}
                      </button>
                    );
                  })}
                </div>
                {!solvedItem && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submitMulti} disabled={sel.size === 0} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
              </>
            )}
            <FeedbackBlock show={solvedItem || showHint || wrong.size > 0} isCorrect={solvedItem} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedItem ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedItem ? '✓' : '✗'}</span>{solvedItem ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
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
// DRAG-AND-DROP — tap (mobil) + sichqoncha-drag gibridi. веди-до-верного, keep-visible, storedAnswer tiklash.
// ============================================================
const DragToSlots = ({ screen, idx, c, chips, correct, renderBoard, slotSize = 'sm', factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const N = correct.length;
  const audio = useAudio([{ id: `d${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? correct.slice() : Array(N).fill(null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const chipById = (id) => chips.find(ch => ch.id === id);
  const dropTo = (slot) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const m = [...p]; m[slot] = sel; return m; }); setSel(null); };
  const returnChip = (slot) => { if (solved) return; setChecked(false); setPlace(p => { const m = [...p]; m[slot] = null; return m; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = correct.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: correct.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setPlace(p => p.map((v, i) => (v === correct[i] ? v : null)));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const slotEl = (i) => (
    <span key={`sl${i}`} className={`dnd-slot dnd-slot-${slotSize}${sel !== null && place[i] === null ? ' dnd-slot-armed' : ''}${solved ? ' dnd-ok' : ''}`}
      onClick={() => { if (place[i] === null) dropTo(i); else returnChip(i); }}
      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); dropTo(i); }}>
      {place[i] !== null ? chipById(place[i]).node : <span className="dnd-slot-q">?</span>}
    </span>
  );
  const trayChips = chips.filter(ch => !place.includes(ch.id));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>{renderBoard(slotEl)}</div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2" style={{ position: 'relative' }}>
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(ch => (
              <span key={ch.id} className={`dnd-chip${sel === ch.id ? ' dnd-chip-sel' : ''}`} draggable onDragStart={() => setSel(ch.id)} onClick={() => setSel(s => (s === ch.id ? null : ch.id))}>{ch.node}</span>
            ))}
          </div>
        )}
        {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

const DragToBins = ({ screen, idx, c, items, bins, correct, factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const audio = useAudio([{ id: `d${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => (wasSolved ? correct.slice() : items.map(() => null)));
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const dropTo = (bin) => { if (solved || sel === null) return; setChecked(false); setPlace(p => { const m = [...p]; m[sel] = bin; return m; }); setSel(null); };
  const onChipClick = (i) => { if (solved) return; setChecked(false); setSel(s => (s === i ? null : i)); };
  const returnChip = (i) => { if (solved) return; setChecked(false); setPlace(p => { const m = [...p]; m[i] = null; return m; }); };
  const allPlaced = place.every(v => v !== null);
  const check = () => {
    if (solved || !allPlaced) return;
    const ok = correct.every((v, i) => v === place[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: correct.join(','), studentAnswer: place.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setPlace(p => p.map((v, i) => (v === correct[i] ? v : null)));
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const trayChips = items.map((it, i) => (place[i] === null ? i : null)).filter(i => i !== null);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="dnd-bins fade-up delay-1" style={{ position: 'relative', maxHeight: solved ? 0 : 900, opacity: solved ? 0 : 1, overflow: 'hidden', transition: 'opacity 0.4s, max-height 0.6s' }}>
          {bins.map(bin => {
            const inBin = items.map((it, i) => (place[i] === bin.id ? i : null)).filter(i => i !== null);
            return (
              <div key={bin.id} className={`dnd-bin${sel !== null ? ' dnd-bin-armed' : ''}`} onClick={() => dropTo(bin.id)}
                onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); dropTo(bin.id); }}>
                <span className="dnd-bin-lbl">{t(bin.label)}</span>
                <div className="dnd-bin-slot">
                  {inBin.map(i => {
                    const right = solved && place[i] === correct[i];
                    return (
                      <span key={i} className={`dnd-chip dnd-chip-in${right ? ' dnd-ok' : ''}`} draggable={!solved} onDragStart={() => setSel(i)}
                        onClick={e => { e.stopPropagation(); returnChip(i); }}>{items[i].node}</span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && (
          <div className="dnd-tray fade-up delay-2" style={{ position: 'relative' }}>
            <span className="dnd-tray-lbl">{t(c.tray_label)}:</span>
            {trayChips.length === 0 && <span className="small" style={{ color: T.ink3 }}>—</span>}
            {trayChips.map(i => (
              <span key={i} className={`dnd-chip${sel === i ? ' dnd-chip-sel' : ''}`} draggable onDragStart={() => setSel(i)} onClick={() => onChipClick(i)}>{items[i].node}</span>
            ))}
          </div>
        )}
        {!solved && <div className="fade-up" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && factOnCorrect}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================
// s0 — HOOK: konseptual, harakatli VergulSakraydi (2,5 ↔ 25 loop) + reveal-MC
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const [picked, setPicked] = useState(null);
  const [phase, setPhase] = useState(0);   // 0: 2,5  1: 25 (vergul o'ngga sakradi)
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p === 0 ? 1 : 0)), 1700);
    return () => clearInterval(id);
  }, []);
  const cells = [{ d: '2', state: 'on' }, { d: '5', state: 'on' }];
  const comma = phase === 0 ? 1 : 2;
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <CommaHop cells={cells} comma={comma}/>
          <p className="mono small" style={{ margin: 0, color: phase === 1 ? T.success : T.ink2, fontWeight: 600 }}>{phase === 0 ? '2,5  × 10 …' : (lang === 'uz' ? "→ vergul o'ngga: 25" : '→ запятая вправо: 25')}</p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: T.ink3, textDecoration: 'line-through' }}>2,50 ✗</span>
            <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: T.success, fontWeight: 700 }}>25 ✓</span>
          </div>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative' }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)} style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span><span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — WARM-UP SeqMC (razryadlar)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;

// s2 — EXPLORATION ×10 (VergulSakraydi)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const cells = [{ d: '2', state: 'on' }, { d: '5', state: 'on' }];
  const comma = step >= 1 ? 2 : 1;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: step >= 1 ? T.success : T.ink2, fontWeight: 600 }}>{step >= 1 ? '2,5 × 10 = 25' : '2,5 × 10'}</span>
          <CommaHop cells={cells} comma={comma}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION ×100 (ikki sakrash + nol)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const cells = [{ d: '2', state: 'on' }, { d: '5', state: 'on' }, { d: '0', state: step >= 1 ? 'new' : 'off' }];
  const comma = step >= 1 ? 3 : 1;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: step >= 1 ? T.success : T.ink2, fontWeight: 600 }}>{step >= 1 ? '2,5 × 100 = 250' : '2,5 × 100'}</span>
          <CommaHop cells={cells} comma={comma}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION ÷100 (chapga, oldida nollar)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s4_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  // 5 ÷ 100 = 0,05  →  cells ['0','0','5']; boshda faqat '5' (butun, comma=3), keyin chapga 2 o'rin (comma=1), oldida ikki nol
  const cells = [{ d: '0', state: step >= 1 ? 'new' : 'off' }, { d: '0', state: step >= 1 ? 'new' : 'off' }, { d: '5', state: 'on' }];
  const comma = step >= 1 ? 1 : 3;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 170, justifyContent: 'center' }}>
          <span className="mono" style={{ fontSize: 'clamp(15px, 2.4vw, 18px)', color: step >= 1 ? T.success : T.ink2, fontWeight: 600 }}>{step >= 1 ? '5 ÷ 100 = 0,05' : '5 ÷ 100'}</span>
          <CommaHop cells={cells} comma={comma}/>
          {step >= 1 && <p className="body fade-up" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE (birlashgan)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-sub fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <EqLine a="2,5" op="×" b="10" c="25"/>
            <EqLine a="5" op="÷" b="100" c="0,05"/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.label)}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span style={{ color: T.success, fontWeight: 700, marginTop: 1 }}>→</span><p className="body" style={{ margin: 0 }}>{mt(t(c.rule_mul))}</p></div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span style={{ color: T.blue, fontWeight: 700, marginTop: 1 }}>←</span><p className="body" style={{ margin: 0 }}>{mt(t(c.rule_div))}</p></div>
          </div>
          <div className="frame-tip" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p className="small mono" style={{ margin: 0, fontWeight: 700, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.warn_label)}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.warn))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s6 — 5 OSON SAVOL (SeqMC)
const Screen6 = (props) => <SeqMC {...props} screenContent={CONTENT.s6} scored={true}/>;

// s7 — DRAG-CLASSIFY (×/÷ savatlari)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const items = [c.it0, c.it1, c.it2, c.it3].map((node, i) => ({ id: i, node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(14px, 2.1vw, 17px)' }}>{t(node)}</span> }));
  const bins = [{ id: 'big', label: c.bin_big }, { id: 'small', label: c.bin_small }];
  const correct = ['big', 'small', 'big', 'small'];   // 2,5×10 / 6÷10 / 0,3×100 / 40÷1000
  return <DragToBins {...props} idx={7} c={c} items={items} bins={bins} correct={correct} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>} badge={FACT_BADGE}/>}/>;
};

// s8 — VERGULNI QO'YISH (custom): 475 ÷ 100 = 4,75
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const digits = c.digits.split('');                  // ['4','7','5']
  const correctGap = 1;                               // 4 | 7 5  →  4,75
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [pickedGap, setPickedGap] = useState(wasSolved ? correctGap : null);
  const [solved, setSolved] = useState(wasSolved);
  const [wrong, setWrong] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvRef = useRef(wasSolved);
  const pickGap = (g) => {
    if (solved) return;
    const ok = g === correctGap;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    setPickedGap(g);
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); }
    if (ok) {
      setSolved(true); setWrong(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: t(c.title), correctAnswer: '4,75', studentAnswer: '4,75', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setWrong(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <Title node={c.title}/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 26px)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <button className={`cp-gap${pickedGap === i ? (i === correctGap ? ' cp-gap-ok' : ' cp-gap-no') : ''}`} disabled={solved} onClick={() => pickGap(i)} aria-label="comma slot">
                    <span className="cp-comma">{pickedGap === i ? ',' : ''}</span>
                  </button>
                )}
                <span className="cp-digit">{d}</span>
              </React.Fragment>
            ))}
          </span>
        </div>
        <FeedbackBlock show={pickedGap !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>{mt(t(solved ? c.correct_text : c.hint_wrong))}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s9 — DRAG-FILL: 0,04 × [1000] = 40
const Screen9 = (props) => {
  const c = CONTENT.s9;
  const chips = ['10', '100', '1000'].map(v => ({ id: v, node: <span className="mono" style={{ fontWeight: 700, fontSize: 'clamp(15px, 2.4vw, 19px)' }}>{v}</span> }));
  const correct = ['1000'];
  const renderBoard = (slotEl) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(6px, 1.8vw, 12px)', flexWrap: 'wrap', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 'clamp(18px, 3.4vw, 24px)' }}>
      <span style={{ color: T.ink }}>0,04</span><Op>×</Op>{slotEl(0)}<Op>=</Op><span style={{ color: T.success }}>40</span>
    </span>
  );
  return <DragToSlots {...props} idx={9} c={c} chips={chips} correct={correct} slotSize="lg" renderBoard={renderBoard} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>} badge={FACT_BADGE}/>}/>;
};

// s10 — CASE final MC (Nilufar): 100 × 0,2 = 20 MB (keep-visible)
const Screen10 = (props) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const base = [c.opt0[lang], c.opt1[lang], c.opt2[lang], c.opt3[lang]];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const lead = (
    <>
      <p className="body fade-up" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 20px)', marginTop: 12 }}>
        <span className="mono" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: T.ink }}>{mt(t(c.question_text))}</span>
      </div>
    </>
  );
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} titleNode={c.label} question={lead} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimPow/>} badge={FACT_BADGE_SCI}/>}/>;
};

// s11 — 6-8 MISOL OSON->QIYIN (SeqMix), YAKUNIY
const Screen11 = (props) => <SeqMix {...props} screenContent={CONTENT.s11} scored={true}/>;

// s12 — SUMMARY (kanonik Dars09-13 layout)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, [finishLesson]);
  const scoredScreens = SCREEN_META.filter(s => s.scored);
  const total = scoredScreens.length;
  const correct = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-white-accent" onClick={onReset} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.success, margin: 0 }}>{t(c.label)}</p>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 700, color: T.success }}>{correct} / {total}</span>
          <span className="small" style={{ color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.main_label)}</p>
          {mains.map((mn, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span><p className="body" style={{ margin: 0 }}>{mt(t(mn))}</p></div>))}
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.back_to_hook))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVIY KOMPONENT
// ============================================================
export default function DecimalShiftLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12];
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

// ============================================================
// CSS — bazaviy (Dars28) + dars27 maxsus (vergul-yo'lakcha/hook/fakt-anim/dnd/vergul-qo'yish)
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


/* === Dars27 (dec_5_04) maxsus CSS === */
/* HOOK jonli animatsiya */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }

/* === VergulSakraydi — raqam yo'lakchasi === */
.vh-wrap { display: flex; justify-content: center; width: 100%; padding: 6px 0; }
.vh-cells { position: relative; display: inline-flex; }
.vh-cell { width: var(--vcw); height: calc(var(--vcw) * 1.34); margin: 0 2px; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(22px, 5vw, 32px); color: #0E0E10; border-radius: 8px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.35); transition: background 0.3s, box-shadow 0.3s, color 0.3s; }
.vh-off { background: rgba(167, 166, 162, 0.08); box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.16); color: transparent; }
.vh-new { animation: vhPop 0.55s cubic-bezier(0.34, 1.5, 0.6, 1) backwards; color: #019ACB; box-shadow: inset 0 0 0 2px #019ACB; }
@keyframes vhPop { from { transform: translateY(-12px) scale(0.4); opacity: 0; } }
.vh-comma { position: absolute; bottom: calc(var(--vcw) * 0.12); left: calc(var(--cp) * (var(--vcw) + 4px)); transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #FF4F28; line-height: 1; pointer-events: none; transition: left 0.6s cubic-bezier(0.34, 1.1, 0.64, 1), opacity 0.45s; }
.vh-comma-off { opacity: 0; }

/* === vergulni qo'yish (s8) === */
.cp-digit { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(30px, 7vw, 46px); color: #0E0E10; padding: 0 2px; }
.cp-gap { width: clamp(16px, 4vw, 24px); height: clamp(40px, 9vw, 58px); border: none; background: transparent; cursor: pointer; position: relative; vertical-align: middle; border-radius: 8px; transition: background 0.2s; }
.cp-gap:not(:disabled):hover { background: rgba(1, 154, 203, 0.12); }
.cp-gap::after { content: ''; position: absolute; left: 50%; bottom: 8px; width: 2px; height: 40%; transform: translateX(-50%); background: rgba(167, 166, 162, 0.45); border-radius: 2px; transition: background 0.2s; }
.cp-gap:not(:disabled):hover::after { background: #019ACB; }
.cp-gap-ok::after { background: transparent; }
.cp-gap-no::after { background: transparent; }
.cp-comma { position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px, 6.5vw, 42px); line-height: 1; }
.cp-gap-ok .cp-comma { color: #1F7A4D; }
.cp-gap-no .cp-comma { color: #FF4F28; }

/* === fakt-anim === */
.fa-prog { position: relative; width: 66px; height: 16px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.2s ease-in-out infinite; }
@keyframes faProg { 0% { width: 6%; } 60% { width: 80%; } 100% { width: 6%; } }
.fa-pow { display: inline-flex; align-items: flex-start; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #019ACB; }
.fa-pow-b { font-size: clamp(26px, 5vw, 34px); }
.fa-pow-e { font-size: clamp(14px, 2.6vw, 18px); animation: faPowE 1.8s ease-in-out infinite; }
@keyframes faPowE { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-3px); opacity: 1; } }

/* === ambient fon (har bir ekranda) === */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; border-radius: inherit; }
.amb-o { position: absolute; border-radius: 50%; filter: blur(2px); opacity: 0.5; }
.amb-o1 { width: 120px; height: 120px; left: -28px; top: 8%; background: radial-gradient(circle at 30% 30%, rgba(255,79,40,0.16), rgba(255,79,40,0)); animation: ambFloat 13s ease-in-out infinite; }
.amb-o2 { width: 90px; height: 90px; right: -20px; top: 38%; background: radial-gradient(circle at 30% 30%, rgba(1,154,203,0.16), rgba(1,154,203,0)); animation: ambFloat 17s ease-in-out infinite reverse; }
.amb-o3 { width: 70px; height: 70px; left: 22%; bottom: -18px; background: radial-gradient(circle at 30% 30%, rgba(31,122,77,0.13), rgba(31,122,77,0)); animation: ambFloat 15s ease-in-out infinite; }
@keyframes ambFloat { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(14px, -16px); } 66% { transform: translate(-10px, 12px); } }

/* === DRAG-AND-DROP (Dars37 dnd uslubi) === */
.dnd-bins { display: flex; gap: clamp(8px, 1.8vw, 14px); }
.dnd-bin { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; background: #FDFBF7; border: 2px dashed #A7A6A2; border-radius: 14px; padding: clamp(8px, 1.5vw, 11px) clamp(6px, 1.2vw, 10px); transition: border-color 0.2s, background 0.2s; cursor: pointer; }
.dnd-bin-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-bin-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.6vw, 14px); color: #5A5A60; text-align: center; }
.dnd-bin-slot { display: flex; flex-direction: column; gap: 6px; min-height: clamp(42px, 8vw, 54px); align-items: stretch; justify-content: center; }
.dnd-tray { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: clamp(9px, 1.6vw, 12px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.dnd-tray-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #A7A6A2; text-transform: uppercase; letter-spacing: 0.06em; }
.dnd-chip { cursor: grab; user-select: none; -webkit-user-select: none; touch-action: none; display: inline-flex; align-items: center; justify-content: center; background: #FFFFFF; border: 1.5px solid #FF4F28; border-radius: 99px; padding: clamp(8px, 1.4vw, 10px) clamp(13px, 2.1vw, 17px); font-weight: 600; color: #0E0E10; box-shadow: 0 4px 12px -4px rgba(255, 79, 40, 0.25); transition: transform 0.15s, box-shadow 0.15s, background 0.18s; }
.dnd-chip:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(255, 79, 40, 0.38); }
.dnd-chip-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 8px 20px -5px rgba(255, 79, 40, 0.5); }
.dnd-chip-in { cursor: pointer; text-align: center; border-color: #019ACB; box-shadow: 0 4px 12px -4px rgba(1, 154, 203, 0.28); }
.dnd-ok { border-color: #1F7A4D !important; background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 4px 12px -4px rgba(31, 122, 77, 0.3) !important; }
.dnd-slot { display: inline-flex; align-items: center; justify-content: center; border: 2px dashed #A7A6A2; border-radius: 10px; background: #FDFBF7; cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.15s; vertical-align: middle; }
.dnd-slot-sm { min-width: clamp(34px, 7vw, 44px); min-height: clamp(30px, 6vw, 38px); }
.dnd-slot-lg { min-width: clamp(56px, 13vw, 76px); min-height: clamp(52px, 11vw, 66px); }
.dnd-slot-armed { border-color: #019ACB; background: #EAF6FB; }
.dnd-slot-q { color: #A7A6A2; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 20px); }

/* === reduced-motion === */
@media (prefers-reduced-motion: reduce) {
  .hook-sheen, .hook-glow, .vh-new, .fa-prog-fill, .fa-pow-e, .amb-o { animation: none !important; }
  .vh-comma { transition: none !important; }
}
`;
