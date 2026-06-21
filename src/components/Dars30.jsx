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
// --- POD UROK: perc_5_01 — Foiz — yuzdan bir ulush / Процент как сотая доля (REBUILD na Dars28 etalon 2026-06-20) ---
// Markaziy g'oya: foiz = yuzdan ulush. 1% = 1/100 = 0,01. Bitta son = to'rt yozuv (foiz / /100 kasr / qisqartirilgan / o'nli).
// 100% = butun. Foiz — bu NISBAT, miqdorning o'zi emas (TwinGlasses: katta va kichik stakanning yarmi ham 50%).
// M1: foiz va oddiy kasrni adashtirish. M2: foiz = absolyut miqdor (Rustam batareya hooki).
// Hook (M2): Rustam ikki har xil o'lchamli batareya, ikkalasi 50%. Case (M2): Nafisa 7-A 180/240=75% vs 7-B 210/300=70%.
// Vizualizator: PercentGrid (10x10, uzluksiz pgBreathe loop) + BatteryHook + FourForms + TwinGlasses + sort kartalar.
// HAR figura ildizida uzluksiz "nafas" (infinite); circling/traveling YO'Q. Etalon: Dars28, namuna: Dars32.
// Faktlar (DRAFT): per centum etimologiya (Tarix), batareya zaryadi (IT), tana taxminan 60% suv (Fan).
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'perc_5_01',
  lessonTitle: { ru: 'Процент как сотая доля', uz: "Foiz — yuzdan bir ulush" }
};
// Eslatma: ekran ID lari qattiq indeks emas — har komponent jonli `screen` propidan idx oladi.
// Reorder qilishda faqat SCREEN_META + screens massivini bir xil tartibda yangilang.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',          scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',           scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 2 (PercentGrid tap)
  { id: 's3',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 3 (slider four-forms)
  { id: 's4',  type: 'rule',        template: 'custom',          scored: false, scope: null },       // 4
  { id: 's5',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 5 (25/50/75 misol, step)
  { id: 's6',  type: 'rule',        template: 'custom',          scored: false, scope: null },       // 6 (100%=butun + nisbat, step)
  { id: 's7',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 7
  { id: 's8',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },  // 8
  { id: 's9',  type: 'test',        template: 'custom',          scored: true,  scope: 'practice' },  // 9 (sort =1/2)
  { id: 's10', type: 'test',        template: 'SeqMC',           scored: true,  scope: 'practice' },  // 10
  { id: 's11', type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 11 (find-the-wrong)
  { id: 's12', type: 'case',        template: 'custom',          scored: true,  scope: 'final' },     // 12 (masala + yakuniy birlashgan)
  { id: 's13', type: 'summary',     template: 'custom',          scored: false, scope: null }         // 13
];

const CONTENT = {
  // ===== s0 HOOK (M2: foiz = miqdor) — Rustam batareya =====
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title: { ru: 'Загадка про заряд', uz: "Zaryad topishmog'i" },
    lead: { ru: 'У Рустама на телефоне заряд 50 процентов. На повербанке тоже 50 процентов. В обоих одинаковый запас энергии?', uz: "Rustam telefonida zaryad 50 foiz. Power-bankda ham 50 foiz. Ikkalasida energiya zaxirasi bir xilmi?" },
    opt0: { ru: 'Да, оба по 50 процентов — значит, поровну', uz: "Ha, ikkalasi 50 foiz — demak teng" },
    opt1: { ru: 'Нет, запас может быть разным', uz: "Yo'q, zaxira har xil bo'lishi mumkin" },
    opt2: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    reveal0: { ru: 'Запомни свой ответ. В конце урока вернёмся к этой загадке.', uz: "Javobingizni eslab qoling. Dars oxirida shu topishmoqqa qaytamiz." },
    reveal1: { ru: 'Запомни свой ответ. В конце урока вернёмся к этой загадке.', uz: "Javobingizni eslab qoling. Dars oxirida shu topishmoqqa qaytamiz." },
    reveal2: { ru: 'Запомни свой ответ. В конце урока вернёмся к этой загадке.', uz: "Javobingizni eslab qoling. Dars oxirida shu topishmoqqa qaytamiz." },
    audio: { ru: "У Рустама телефон заряжен на пятьдесят процентов. И повербанк тоже на пятьдесят процентов. Как думаешь, запас энергии в них одинаковый?", uz: "Rustam telefoni ellik foizga zaryadlangan. Power-bank ham ellik foizga. Sizningcha, ulardagi energiya zaxirasi bir xilmi?" }
  },

  // ===== s1 WARM-UP — 3 ta foiz prerekviziti (aralash tip, tap). scored=false =====
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Вспомним сотые', uz: "Yuzdan ulushni eslaymiz" },
    lead: { ru: 'Три быстрых вопроса. Выбери ответ.', uz: "Uchta tez savol. Javobni tanlang." },
    bridge: { ru: 'Прежде чем говорить о процентах — вспомним сотые.', uz: "Foiz haqida gapirishdan oldin — yuzdan ulushni eslaylik." },
    questions: [
      {
        q: { ru: 'Из ста клеток закрашены 9. Какая это дробь?', uz: "Yuzta katakdan 9 tasi bo'yalgan. Bu qaysi kasr?" },
        say: { ru: "Из ста клеток закрашены девять. Какая это десятичная дробь?", uz: "Yuzta katakdan to'qqiztasi bo'yalgan. Bu qaysi o'nli kasr?" },
        opts: [{ ru: '0,09', uz: '0,09' }, { ru: '0,9', uz: '0,9' }, { ru: '0,009', uz: '0,009' }],
        correct: 0,
        ok: { ru: 'Верно: девять из ста — это ноль целых девять сотых.', uz: "To'g'ri: yuzdan to'qqiz, bu nol butun yuzdan to'qqiz." },
        no: { ru: 'Клеток сто, значит разряд — сотые.', uz: "Katak yuzta, demak xona — yuzdan." }
      },
      {
        q: { ru: 'Если сократить 20/100, что получится?', uz: "20/100 ni qisqartirsak, nima chiqadi?" },
        say: { ru: "А теперь сократи дробь двадцать сотых.", uz: "Endi yuzdan yigirma kasrini qisqartiring." },
        opts: [{ ru: '1/4', uz: '1/4' }, { ru: '1/5', uz: '1/5' }, { ru: '2/5', uz: '2/5' }],
        correct: 1,
        ok: { ru: 'Верно: двадцать сотых — это одна пятая.', uz: "To'g'ri: yuzdan yigirma — bu beshdan bir." },
        no: { ru: 'Раздели и числитель, и знаменатель на двадцать.', uz: "Ham suratni, ham maxrajni yigirmaga bo'ling." }
      },
      {
        q: { ru: 'Как записать 1/2 десятичной дробью?', uz: "1/2 ni o'nli kasrda qanday yozamiz?" },
        say: { ru: "И последнее. Как записать одну вторую десятичной дробью?", uz: "Va oxirgisi. Ikkidan birni o'nli kasrda qanday yozamiz?" },
        opts: [{ ru: '0,2', uz: '0,2' }, { ru: '0,15', uz: '0,15' }, { ru: '0,5', uz: '0,5' }],
        correct: 2,
        ok: { ru: 'Верно: половина — это ноль целых пять десятых.', uz: "To'g'ri: yarmi — bu nol butun o'ndan besh." },
        no: { ru: 'Половина — это пятьдесят сотых.', uz: "Yarmi — bu yuzdan ellik." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем говорить о процентах, вспомним сотые. Три быстрых вопроса.", uz: "Foiz haqida gapirishdan oldin, yuzdan ulushni eslaylik. Uchta tez savol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Попробуй ещё раз.", uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: "Отлично, размялись.", uz: "Zo'r, mashq qildik." }
    }
  },

  // ===== s2 EXPLORATION — 10x10 PercentGrid, tap bilan 9 katak bo'yaladi (1% = 1 katak). Step-audio gated. =====
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Сотая доля целого', uz: "Butunning yuzdan biri" },
    lead: { ru: 'Целое разделили на 100 равных клеток. Закрась клетки по одной.', uz: "Butunni 100 ta teng katakka bo'ldik. Kataklarni bittadan bo'yang." },
    btn_step: { ru: 'Закрасить клетку', uz: "Katakni bo'yash" },
    btn_final: { ru: 'Понятно', uz: 'Tushunarli' },
    progress: { ru: '{n}/9', uz: "{n}/9" },
    note_done: { ru: '9 клеток из ста — это 9 процентов, то есть 9/100 = 0,09.', uz: "Yuzdan 9 ta katak — bu 9 foiz, ya'ni 9/100 = 0,09." },
    audio: {
      tap: { ru: "Это целое, разделённое на сто равных клеток. Нажимай и закрашивай по одной. Одна клетка из ста это один процент, то есть одна сотая.", uz: "Bu butun yuzta teng katakka bo'lingan. Bosing va bittadan bo'yang. Yuzdan bitta katak, bu bir foiz, ya'ni yuzdan bir." },
      done: { ru: "Девять клеток это девять процентов, то есть девять сотых. Процент это всегда доля из ста.", uz: "To'qqizta katak, bu to'qqiz foiz, ya'ni yuzdan to'qqiz. Foiz doim yuzdan olingan ulush." }
    }
  },

  // ===== s3 EXPLORATION — slider 0-100 -> PercentGrid + FourForms (bitta son, to'rt yozuv). =====
  s3: {
    eyebrow: { ru: 'Одно число', uz: 'Bitta son' },
    title: { ru: 'Одно число — четыре записи', uz: "Bitta son — to'rt yozuv" },
    lead: { ru: 'Двигай ползунок: сколько клеток закрашено — столько процентов.', uz: "Slayderni suring: nechta katak bo'yalsa — shuncha foiz." },
    slider_label: { ru: 'Процент', uz: 'Foiz' },
    instr: { ru: 'Двигай ползунок и смотри на четыре записи одного числа.', uz: "Slayderni suring va bitta sonning to'rt yozuviga qarang." },
    instr_full: { ru: '100 процентов — это все сто клеток, то есть целое.', uz: "100 foiz — bu barcha yuzta katak, ya'ni butun." },
    audio: { ru: "Двигай ползунок и следи за подписями. Двадцать процентов это двадцать сотых, после сокращения одна пятая, а десятичной дробью ноль целых две десятых. Это одно число в четырёх записях. Доведи до конца: сто процентов это все клетки, целое.", uz: "Slayderni suring va yozuvlarni kuzating. Yigirma foiz, bu yuzdan yigirma, qisqartirilganda beshdan bir, o'nli kasrda esa nol butun o'ndan ikki. Bu, to'rt yozuvdagi bitta son. Oxirigacha suring: yuz foiz, bu barcha kataklar, butun." }
  },

  // ===== s4 RULE — N% = N/100 (lean). Bridge. =====
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    heading: { ru: 'Процент — это сотая', uz: "Foiz — yuzdan ulush" },
    bridge: { ru: 'Мы увидели, что такое процент. Теперь соберём правило.', uz: "Foiz nima ekanini ko'rdik. Endi qoidani yig'amiz." },
    rule_label: { ru: 'Запомните', uz: 'Yodda tuting' },
    rule_1: { ru: 'Процент — это сотая доля целого.', uz: "Foiz — bu butunning yuzdan ulushi." },
    rule_2: { ru: 'N процентов = N/100.', uz: "N foiz = N/100." },
    rule_3: { ru: 'Дробь со знаменателем 100 при желании сокращаем.', uz: "Maxraji 100 bo'lgan kasrni istasak qisqartiramiz." },
    ex_label: { ru: 'Как это работает', uz: "Bu qanday ishlaydi" },
    ex_caption: { ru: '20% = 20/100 = 1/5 = 0,2.', uz: "20% = 20/100 = 1/5 = 0,2." },
    audio: { ru: "Мы увидели, что такое процент. Теперь соберём правило. Любой процент это число сотых. Эн процентов равно эн сотым. Например, двадцать процентов это двадцать сотых, после сокращения одна пятая, а десятичной дробью ноль целых две десятых. Одно число, разные записи.", uz: "Foiz nima ekanini ko'rdik. Endi qoidani yig'amiz. Har qanday foiz, bu yuzdan ulushlar soni. En foiz teng yuzdan en. Masalan, yigirma foiz, bu yuzdan yigirma, qisqartirilganda beshdan bir, o'nli kasr bilan esa nol butun o'ndan ikki. Bitta son, har xil yozuv." }
  },

  // ===== s5 EXAMPLES — 25/50/75% har biri to'rt yozuvda (step reveal, OLTIN gridlar). Step-audio gated. =====
  s5: {
    eyebrow: { ru: 'Разбор', uz: 'Ishlangan misol' },
    title: { ru: 'Ещё три разбора', uz: "Yana uchta ishlangan misol" },
    lead: { ru: 'У любого процента есть четыре равные записи. Посмотрим по одной.', uz: "Har qanday foizning to'rt teng yozuvi bor. Bittadan ko'ramiz." },
    btn_step: { ru: 'Ещё пример', uz: 'Yana misol' },
    btn_final: { ru: 'Понятно', uz: 'Tushunarli' },
    ex_note: [
      { ru: 'Двадцать пять процентов — это четверть.', uz: "Yigirma besh foiz — bu chorak." },
      { ru: 'Пятьдесят процентов — это половина.', uz: "Ellik foiz — bu yarmi." },
      { ru: 'Семьдесят пять процентов — это три четвёртых.', uz: "Yetmish besh foiz — bu to'rtdan uch." }
    ],
    audio: {
      ru: [
        "У любого процента есть четыре равные записи. Посмотрим по одной.",
        "Двадцать пять процентов это двадцать пять сотых, после сокращения одна четвёртая, а десятичной дробью ноль целых двадцать пять сотых.",
        "Пятьдесят процентов это половина, то есть ноль целых пять десятых.",
        "Семьдесят пять процентов это три четвёртых, то есть ноль целых семьдесят пять сотых. Одно число, четыре одежды."
      ],
      uz: [
        "Har qanday foizning to'rt teng yozuvi bor. Bittadan ko'ramiz.",
        "Yigirma besh foiz, bu yuzdan yigirma besh, qisqartirilganda to'rtdan bir, o'nli kasrda esa nol butun yuzdan yigirma besh.",
        "Ellik foiz, bu yarmi, ya'ni nol butun o'ndan besh.",
        "Yetmish besh foiz, bu to'rtdan uch, ya'ni nol butun yuzdan yetmish besh. Bitta son, to'rt kiyim."
      ]
    }
  },

  // ===== s6 MERGE — 100% = butun + foiz NISBAT (TwinGlasses) + foiz hayotda qayerda. Step reveal, pale-yellow. =====
  s6: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    title: { ru: '100% — это целое', uz: "100% — bu butun" },
    bridge: { ru: 'Прежде чем тренироваться — два важных момента.', uz: "Mashq qilishdan oldin — ikki muhim narsa." },
    point1: { ru: '100% — это целое, всё. А каким будет целое — зависит от того, о чём речь.', uz: "100% — bu butun, hammasi. Bu butun qanday bo'lishi nima haqida gap ketayotganiga bog'liq." },
    point2: { ru: 'Половина большого стакана и половина маленького — обе 50%, хотя воды в них разное количество. Процент — это отношение, а не само количество.', uz: "Katta stakanning yarmi va kichigining yarmi — ikkalasi ham 50%, garchi suv miqdori har xil. Foiz — bu nisbat, miqdorning o'zi emas." },
    sec2_h: { ru: 'Процент — это отношение', uz: "Foiz — bu nisbat" },
    sec3_h: { ru: 'Где живёт процент', uz: "Foiz hayotda qayerda" },
    use1_label: { ru: 'Скидка', uz: 'Chegirma' },
    use1_val:   { ru: 'минус 30%', uz: 'minus 30%' },
    use2_label: { ru: 'Заряд батареи', uz: 'Batareya zaryadi' },
    use2_val:   { ru: '85%', uz: '85%' },
    use3_label: { ru: 'Балл за экзамен', uz: 'Imtihon bali' },
    use3_val:   { ru: '4 из 5 = 80%', uz: "5 dan 4 = 80%" },
    use4_label: { ru: 'Статистика', uz: 'Statistika' },
    use4_val:   { ru: '60%', uz: '60%' },
    btn_step: { ru: 'Дальше', uz: 'Keyingi qadam' },
    btn_final: { ru: 'Понятно', uz: 'Tushunarli' },
    audio: {
      ru: [
        "Прежде чем тренироваться, два важных момента. Запомни: сто процентов это целое, всё. Но каким будет целое зависит от того, о чём речь.",
        "Половина большого стакана и половина маленького обе равны пятидесяти процентам, хотя воды в них разное количество. Процент это отношение, а не само количество.",
        "Вот почему процент так удобен. Скидка в магазине, заряд батареи, балл за экзамен, статистика. Везде он сравнивает доли по единой мерке из ста."
      ],
      uz: [
        "Mashq qilishdan oldin, ikki muhim narsa. Eslab qoling: yuz foiz, bu butun, hammasi. Lekin bu butun qanday bo'lishi nima haqida gap ketayotganiga bog'liq.",
        "Katta stakanning yarmi va kichigining yarmi ikkalasi ham ellik foizga teng, garchi suv miqdori har xil. Foiz, bu nisbat, miqdorning o'zi emas.",
        "Mana shuning uchun foiz juda qulay. Do'kondagi chegirma, batareya zaryadi, imtihon bali, statistika. Hamma joyda u ulushlarni yuzdan iborat yagona o'lchov bilan solishtiradi."
      ]
    }
  },

  // ===== s7 TEST MC — 45% = 9/20. practice + FAKT etimologiya. =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Процент в дробь', uz: "Foizni kasrga" },
    question: { ru: 'Какой обыкновенной дроби равны 45%? Выбери сокращённую запись.', uz: "45% qaysi oddiy kasrga teng? Qisqartirilgan yozuvni tanlang." },
    opt0: { ru: '9/20', uz: '9/20' },
    opt1: { ru: '9/25', uz: '9/25' },
    opt2: { ru: '1/2', uz: '1/2' },
    opt3: { ru: '9/100', uz: '9/100' },
    correct_text: { ru: 'Верно. 45% = 45/100, сокращаем на 5 — получаем 9/20.', uz: "To'g'ri. 45% = 45/100, 5 ga qisqartiramiz — 9/20 chiqadi." },
    wrong_1: { ru: 'Знаменатель не тот. Дели 45/100 на 5: и числитель, и знаменатель.', uz: "Maxraj noto'g'ri. 45/100 ni 5 ga bo'ling: ham suratni, ham maxrajni." },
    wrong_2: { ru: 'Числа близкие, но не равны. Запиши 45/100 и сократи точно.', uz: "Sonlar yaqin, lekin teng emas. 45/100 ni yozing va aniq qisqartiring." },
    wrong_3: { ru: 'Это запись до сокращения. Раздели числитель и знаменатель на пять.', uz: "Bu qisqartirishdan oldingi yozuv. Surat va maxrajni beshga bo'ling." },
    fact: { ru: 'Слово процент идёт от латинского per centum — за сотню. И сам знак процента вырос из числа 100.', uz: "Foiz so'zi lotincha per centum — yuzdan degani. Foiz belgisi ham 100 sonidan o'sib chiqqan." },
    audio: {
      intro: { ru: "Сорок пять процентов это какая обыкновенная дробь? Выбери сокращённый вариант.", uz: "Qirq besh foiz qaysi oddiy kasr? Qisqartirilgan variantni tanlang." },
      on_correct: { ru: "Верно, девять двадцатых. Кстати, слово процент с латыни и значит за сотню.", uz: "To'g'ri, yigirmadan to'qqiz. Aytgancha, foiz so'zi lotincha yuzdan degani." },
      on_wrong: { ru: "Запиши сорок пять сотых и сократи на пять.", uz: "Yuzdan qirq beshni yozing va beshga qisqartiring." }
    }
  },

  // ===== s8 TEST DecInput — 7/20 = ?% -> 35. practice. =====
  s8: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    bridge: { ru: 'Из дроби в процент — обратный путь.', uz: "Kasrdan foizga — teskari yo'l." },
    question: { ru: 'Сколько процентов составляет 7/20?', uz: "7/20 necha foizni tashkil qiladi?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: { ru: 'Приведи 7/20 к знаменателю 100. Умножь числитель и знаменатель на пять.', uz: "7/20 ni 100 maxrajiga keltiring. Surat va maxrajni beshga ko'paytiring." },
    fb_correct: { ru: 'Верно. 7/20 = 35/100 = 35%.', uz: "To'g'ri. 7/20 = 35/100 = 35%." },
    audio: {
      intro: { ru: "Семь двадцатых это сколько процентов? Приведи к сотым и введи число.", uz: "Yigirmadan yetti, bu necha foiz? Yuzdan ulushga keltiring va sonni kiriting." },
      on_correct: { ru: "Верно. Тридцать пять процентов, потому что семь двадцатых это тридцать пять сотых.", uz: "To'g'ri. O'ttiz besh foiz, chunki yigirmadan yetti, bu yuzdan o'ttiz besh." },
      on_wrong: { ru: "Умножь числитель и знаменатель на пять, чтобы внизу стало сто.", uz: "Pastda yuz bo'lishi uchun surat va maxrajni beshga ko'paytiring." }
    }
  },

  // ===== s9 TEST sort — =1/2 / teng emas (one-at-a-time, RANDOM, 8 karta). practice. M1 sindirgich. =====
  s9: {
    eyebrow: { ru: 'Разложите по группам', uz: "Guruhlarga ajrating" },
    title: { ru: 'Найди половину', uz: "Yarmini toping" },
    lead: { ru: 'Одно число прячется в разных одеждах. Поставь каждую карточку в свою группу.', uz: "Bitta son har xil kiyimda yashirinadi. Har kartani o'z guruhiga joylang." },
    bin_sq:  { ru: 'Равно 1/2', uz: "1/2 ga teng" },
    bin_cu:  { ru: 'Не равно 1/2', uz: "1/2 ga teng emas" },
    ask: { ru: 'Это равно 1/2? Тапни корзину.', uz: "Bu 1/2 ga tengmi? Savatni bos." },
    hint_wrong: { ru: 'Переведи карточку в проценты или в сотые. Половина — это пятьдесят процентов.', uz: "Kartani foizga yoki yuzdan ulushga aylantiring. Yarmi — bu ellik foiz." },
    correct_text: { ru: 'Верно. 50%, 0,5, 150/300 и 4/8 — это всё половина. А 5%, 0,05, 2/5 и 9/20 — нет.', uz: "To'g'ri. 50%, 0,5, 150/300 va 4/8 — bularning hammasi yarmi. 5%, 0,05, 2/5 va 9/20 esa — yo'q." },
    audio: {
      intro: { ru: "Поставь каждую карточку по группам: какая равна одной второй, а какая нет. Тапни корзину.", uz: "Har kartani guruhlarga joylang: qaysi biri ikkidan birga teng, qaysi biri yo'q. Savatni bos." },
      on_correct: { ru: "Верно. Пятьдесят процентов, ноль целых пять десятых и сто пятьдесят из трёхсот это одна и та же половина.", uz: "To'g'ri. Ellik foiz, nol butun o'ndan besh va uch yuzdan bir yuz ellik bu o'sha bitta yarmi." },
      on_wrong: { ru: "Переведи карточку в проценты: половина это пятьдесят процентов.", uz: "Kartani foizga aylantiring: yarmi, bu ellik foiz." }
    }
  },

  // ===== s10 TEST SeqMC — uchta ulushni foizga (9/100->9, 3/4->75, 130/200->65). practice. =====
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Доля в процентах', uz: "Ulush foizda" },
    lead: { ru: 'Три доли подряд. Переведи каждую в проценты.', uz: "Uchta ulush ketma-ket. Har birini foizga aylantiring." },
    questions: [
      {
        q: { ru: '9/100 = ?%', uz: '9/100 = ?%' },
        say: { ru: "Девять сотых это сколько процентов?", uz: "Yuzdan to'qqiz necha foiz?" },
        opts: [{ ru: '9%', uz: '9%' }, { ru: '90%', uz: '90%' }, { ru: '1%', uz: '1%' }],
        correct: 0,
        ok: { ru: 'Верно: девять из ста — это девять процентов.', uz: "To'g'ri: yuzdan to'qqiz, bu to'qqiz foiz." },
        no: { ru: 'Каждая клетка из ста — это один процент.', uz: "Yuzdan har katak — bu bir foiz." }
      },
      {
        q: { ru: '3/4 = ?%', uz: '3/4 = ?%' },
        say: { ru: "Три четвёртых это сколько процентов? Приведи к сотым.", uz: "To'rtdan uch necha foiz? Yuzdan ulushga keltiring." },
        opts: [{ ru: '34%', uz: '34%' }, { ru: '75%', uz: '75%' }, { ru: '70%', uz: '70%' }],
        correct: 1,
        ok: { ru: 'Верно: три четвёртых — это семьдесят пять сотых.', uz: "To'g'ri: to'rtdan uch — bu yuzdan yetmish besh." },
        no: { ru: 'Умножь числитель и знаменатель на двадцать пять.', uz: "Surat va maxrajni yigirma beshga ko'paytiring." }
      },
      {
        q: { ru: '130/200 = ?%', uz: '130/200 = ?%' },
        say: { ru: "В зале двести мест, заняты сто тридцать. Сколько это процентов?", uz: "Zalda ikki yuz o'rindiq, bir yuz o'ttiztasi band. Bu necha foiz?" },
        opts: [{ ru: '65%', uz: '65%' }, { ru: '60%', uz: '60%' }, { ru: '13%', uz: '13%' }],
        correct: 0,
        ok: { ru: 'Верно: сто тридцать из двухсот — это шестьдесят пять сотых.', uz: "To'g'ri: ikki yuzdan bir yuz o'ttiz — bu yuzdan oltmish besh." },
        no: { ru: 'Раздели числитель и знаменатель на два — внизу станет сто.', uz: "Surat va maxrajni ikkiga bo'ling — pastda yuz bo'ladi." }
      }
    ],
    audio: {
      intro: { ru: "Тренировка. Три доли подряд. Переведи каждую в проценты.", uz: "Mashq. Uchta ulush ketma-ket. Har birini foizga aylantiring." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Отлично. Любую долю можно перевести в проценты, приведя её к сотым.", uz: "Zo'r. Har qanday ulushni yuzdan ulushga keltirib, foizga aylantirish mumkin." }
    }
  },

  // ===== s11 TEST find-the-wrong — XATO tenglikni top. practice + FAKT batareya. correct = 3/5=35%. =====
  s11: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni top' },
    title: { ru: 'Неверное равенство', uz: "Xato tenglik" },
    question: { ru: 'Одно из равенств ошибочно. Найди именно его.', uz: "Tengliklardan biri xato. Aynan o'shani toping." },
    opt0: { ru: '150/200 = 75%', uz: '150/200 = 75%' },
    opt1: { ru: '0,6 = 60%', uz: '0,6 = 60%' },
    opt2: { ru: '1/4 = 25%', uz: '1/4 = 25%' },
    opt3: { ru: '3/5 = 35%', uz: '3/5 = 35%' },
    correct_text: { ru: 'Верно, это и есть ошибка. 3/5 = 60/100 = 60%, а не 35%.', uz: "To'g'ri, xato shu. 3/5 = 60/100 = 60%, 35% emas." },
    wrong_0: { ru: 'Это равенство верное: 150/200 = 75/100 = 75%. Ошибка в другом.', uz: "Bu tenglik to'g'ri: 150/200 = 75/100 = 75%. Xato boshqasida." },
    wrong_1: { ru: 'Это равенство верное: 0,6 — это 60/100 = 60%. Ищи ошибку дальше.', uz: "Bu tenglik to'g'ri: 0,6 — bu 60/100 = 60%. Xatoni boshqa joydan qidiring." },
    wrong_2: { ru: 'Это равенство верное: 1/4 = 25/100 = 25%. Ошибка не здесь.', uz: "Bu tenglik to'g'ri: 1/4 = 25/100 = 25%. Xato bu yerda emas." },
    fact: { ru: 'Заряд телефона тоже в процентах: 100% — батарея полная, 0% — пустая. Каждый процент — сотая доля ёмкости.', uz: "Telefon zaryadi ham foizda: 100% — batareya to'la, 0% — bo'sh. Har foiz — sig'imning yuzdan biri." },
    audio: {
      intro: { ru: "Здесь вопрос наоборот. Одно равенство ошибочно. Найди именно ошибочное и выбери его.", uz: "Bu yerda savol teskari. Bitta tenglik xato. Aynan xato bo'lganini toping va tanlang." },
      on_correct: { ru: "Верно. Три пятых это шестьдесят процентов, а не тридцать пять. Кстати, заряд телефона тоже доля из ста.", uz: "To'g'ri. Beshdan uch, bu oltmish foiz, o'ttiz besh emas. Aytgancha, telefon zaryadi ham yuzdan ulush." },
      on_wrong: { ru: "Переведи каждую долю в проценты, приведя к сотым.", uz: "Har ulushni yuzdan ulushga keltirib, foizga aylantiring." }
    }
  },

  // ===== s12 CASE setup + FINAL (birlashgan) — Nafisa ikki sinf -> 7-A 75%. final + FAKT tana suv. =====
  s12: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Сравним два класса', uz: "Ikki sinfni solishtiramiz" },
    bridge: { ru: 'Хорошо потренировались. Теперь жизненная задача.', uz: "Yaxshi mashq qildik. Endi hayotiy masala." },
    lead: { ru: 'Нафиса посмотрела результаты двух классов на олимпиаде. Баллы разные, и максимум у классов разный.', uz: "Nafisa ikki sinfning olimpiada natijasini ko'rdi. Ballar har xil, sinflarning maksimal bali ham har xil." },
    note: { ru: 'Чтобы сравнить честно, переведём каждый результат в проценты.', uz: "Halol solishtirish uchun har natijani foizga aylantiramiz." },
    hint_calc: { ru: '7-А набрал 180 из 240, 7-Б набрал 210 из 300. Приведи каждую долю к сотым.', uz: "7-A 240 dan 180, 7-B 300 dan 210 to'pladi. Har ulushni yuzdan ulushga keltiring." },
    compact: { ru: '7-А: 180 из 240 · 7-Б: 210 из 300', uz: "7-A: 240 dan 180 · 7-B: 300 dan 210" },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    question: { ru: 'В каком классе результат лучше?', uz: "Qaysi sinf natijasi yaxshiroq?" },
    opt0: { ru: 'Класс 7-А — это 75%', uz: "7-A sinf — bu 75%" },
    opt1: { ru: 'Класс 7-Б — это 70%', uz: "7-B sinf — bu 70%" },
    opt2: { ru: 'Поровну', uz: "Bir xil" },
    opt3: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    correct_text: { ru: 'Верно. 180/240 = 75%, а 210/300 = 70%. У класса 7-А результат выше.', uz: "To'g'ri. 180/240 = 75%, 210/300 esa = 70%. 7-A sinf natijasi yuqoriroq." },
    wrong_1: { ru: 'У 7-Б больше баллов, но и максимум больше. Сравнивай не количество, а долю — приведи обе дроби к сотым.', uz: "7-B da ko'proq ball, lekin maksimal bal ham kattaroq. Miqdorni emas, ulushni solishtiring — ikkala kasrni yuzdan ulushga keltiring." },
    wrong_2: { ru: 'Не поровну. Приведи обе дроби к сотым и сравни.', uz: "Bir xil emas. Ikkala kasrni yuzdan ulushga keltiring va solishtiring." },
    wrong_3: { ru: 'Определить можно — для этого и нужны проценты. Приведи обе доли к знаменателю сто.', uz: "Aniqlash mumkin — foiz aynan shuning uchun kerak. Ikkala ulushni yuz maxrajiga keltiring." },
    fact: { ru: 'Тело человека примерно на 60% состоит из воды. Это тоже доля из ста.', uz: "Inson tanasi taxminan 60% suvdan iborat. Bu ham — yuzdan ulush." },
    audio: {
      intro: { ru: "Хорошо потренировались, теперь жизненная задача. Нафиса смотрит результаты двух классов. Класс семь А набрал сто восемьдесят баллов из двухсот сорока. Класс семь Б набрал двести десять из трёхсот. Баллы большие и разные, поэтому сравним их в процентах. Нажми решить.", uz: "Yaxshi mashq qildik, endi hayotiy masala. Nafisa ikki sinf natijasini ko'radi. Yetti A sinf ikki yuz qirq balldan bir yuz sakson ball to'pladi. Yetti B sinf uch yuzdan ikki yuz o'n ball to'pladi. Ballar katta va har xil, shuning uchun ularni foizda solishtiramiz. Yechishni bos." },
      intro2: { ru: "В каком классе результат лучше?", uz: "Qaysi sinf natijasi yaxshiroq?" },
      on_correct: { ru: "Верно. Семьдесят пять процентов больше семидесяти. Кстати, тело человека почти на шестьдесят процентов из воды.", uz: "To'g'ri. Yetmish besh foiz yetmishdan katta. Aytgancha, inson tanasi deyarli oltmish foiz suvdan iborat." },
      on_wrong: { ru: "Приведи обе доли к сотым и сравни проценты.", uz: "Ikkala ulushni yuzdan ulushga keltiring va foizni solishtiring." }
    }
  },

  // ===== s13 SUMMARY — batareya hookini yopadi + ConnectionsBlock. =====
  s13: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Процент — это сотая доля', uz: "Foiz — bu yuzdan ulush" },
    main_label: { ru: 'Главное', uz: 'Asosiy' },
    main_1: { ru: 'Процент — это сотая доля: 1% = 1/100 = 0,01.', uz: "Foiz — bu yuzdan ulush: 1% = 1/100 = 0,01." },
    main_2: { ru: 'Одно число — четыре записи: процент, дробь /100, сокращённая дробь и десятичная дробь.', uz: "Bitta son — to'rt yozuv: foiz, /100 kasr, qisqartirilgan kasr va o'nli kasr." },
    main_3: { ru: '100% — это целое, а процент это отношение, а не само количество.', uz: "100% — bu butun, foiz esa — nisbat, miqdorning o'zi emas." },
    hook_close: { ru: 'Оба заряда по 50% — но это половина разных батарей, поэтому энергии в них разное количество.', uz: "Ikkala zaryad ham 50% — lekin bu har xil batareyalarning yarmi, shuning uchun energiya miqdori har xil." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'Сокращение дробей, эквивалентные дроби и десятичная дробь.', uz: "Kasrlarni qisqartirish, ekvivalent kasrlar va o'nli kasr." },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi dars' },
    conn_next: { ru: 'нахождение процента от числа: 20% от 50.', uz: "sonning foizini topish: 50 ning 20 foizi." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Подведём итог. Процент это сотая доля: один процент это одна сотая. Одно число можно записать процентом, дробью со знаменателем сто, сокращённой дробью и десятичной дробью. А сто процентов это целое, и процент это отношение, а не само количество. Поэтому у Рустама оба заряда по пятьдесят процентов, но энергия в них разная.", uz: "Xulosa qilamiz. Foiz, bu yuzdan ulush: bir foiz, bu yuzdan bir. Bitta sonni foiz, maxraji yuz bo'lgan kasr, qisqartirilgan kasr va o'nli kasr bilan yozish mumkin. Yuz foiz esa, bu butun, foiz, nisbat, miqdorning o'zi emas. Shuning uchun Rustamda ikkala zaryad ham ellik foiz, lekin ulardagi energiya har xil." }
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
// Bridge — slaydlararo ma'noli o'tish qatori (faza chegaralarida). Ovozda intro'ga qo'shilgan.
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

// Ikonkalar — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Dekorativ suzuvchi birlik kvadratchalar (qism/yuzdan ulush mavzusi, sekin, yengil) — uzluksiz loop.
const FloatTiles = () => (
  <div className="flt" aria-hidden="true">
    <span className="flt-c flt-1"/><span className="flt-c flt-2"/><span className="flt-c flt-3"/>
    <span className="flt-c flt-4"/><span className="flt-c flt-5"/><span className="flt-c flt-6"/>
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука',    uz: "Bilasizmi? · Fan" };

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
// FAKT-ANIMATSIYALAR (CSS-only loop, ko'k tema) — har biri uzluksiz infinite.
// ============================================================
// Tarix: 100 soni -> foiz belgisi navbatma-navbat (per centum etimologiyasi).
const AnimPercent = () => (<div className="fa-pc" aria-hidden="true"><span className="fa-pc-num">100</span><span className="fa-pc-sign">%</span></div>);
// IT: batareya 0% dan 100% gacha to'ladi (zaryad foizda).
const AnimBat = () => (<div className="fa-bt" aria-hidden="true"><div className="fa-bt-fill"/><span className="fa-bt-tip"/></div>);
// Fan: tana taxminan 60% suvga to'ladi.
const AnimBody = () => (<div className="fa-wb" aria-hidden="true"><div className="fa-wb-fill"/><span className="fa-wb-mark">60%</span></div>);

// ============================================================
// VIZUALIZATOR — perc_5_01: PercentGrid (10x10) + FourForms + BatteryHook + TwinGlasses + sort kartalar.
// HAR figura ildizida uzluksiz "nafas" (infinite pgBreathe/bhBreathe/tgBreathe); circling/traveling YO'Q.
// glow/success/pop — uzluksiz nafas USTIGA qo'shiladi, nafas hech qachon DROP qilinmaydi.
// ============================================================
const pgGcd = (a, b) => (b ? pgGcd(b, a % b) : a);
const pctDec = (n) => n === 0 ? '0' : (n === 100 ? '1' : (n % 10 === 0 ? `0,${n / 10}` : `0,${String(n).padStart(2, '0')}`));

// 10x10 = 100 katakli setka; bo'yalgan kataklar = foiz. Ildiz .pg-grid DOIM uzluksiz pgBreathe loop.
// success: to'g'ri javobdan keyin yashil. pop: katak to'lganda yengil ko'tarilish (per-cell, root nafas saqlanadi).
const PercentGrid = ({ shaded = 0, glow = false, success = false, sm = false }) => {
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const on = i < shaded;
    cells.push(<span key={i} className={`pg-cell${on ? (success ? ' pg-ok' : ' pg-on') : ''}${on ? ' pg-pop' : ''}`} style={on ? { animationDelay: `${(i % 20) * 0.012}s` } : undefined}/>);
  }
  return <div className={`pg-grid${sm ? ' pg-sm' : ''}${glow ? ' pg-glow' : ''}${success ? ' pg-success' : ''}`} aria-hidden="true">{cells}</div>;
};

// To'rt yozuv: N% = N/100 = qisqartirilgan = o'nli.
const FourForms = ({ n }) => {
  const t = useT();
  if (n === 0) return <span className="pg-forms"><b>0%</b> <Op size="sm">=</Op> 0</span>;
  if (n === 100) return <span className="pg-forms"><b>100%</b> <Op size="sm">=</Op> 1 ({t({ ru: 'целое', uz: 'butun' })})</span>;
  const g = pgGcd(n, 100); const a = n / g; const b = 100 / g;
  return (
    <span className="pg-forms">
      <b>{n}%</b> <Op size="sm">=</Op> <Frac n={n} d={100} size="sm"/>
      {g > 1 && <> <Op size="sm">=</Op> <Frac n={a} d={b} size="sm"/></>}
      <Op size="sm">=</Op> {pctDec(n)}
    </span>
  );
};

// Hook: ikki har xil o'lchamli batareya, ikkalasi 50% to'la. Ildiz .bh-wrap DOIM uzluksiz bhBreathe loop.
const BatteryHook = () => (
  <div className="bh-wrap" aria-hidden="true">
    <div className="bh-one">
      <div className="bh-bat bh-big"><div className="bh-fill"/><span className="bh-tip"/></div>
      <span className="bh-pct">50%</span>
    </div>
    <div className="bh-one">
      <div className="bh-bat bh-small"><div className="bh-fill"/><span className="bh-tip"/></div>
      <span className="bh-pct">50%</span>
    </div>
  </div>
);

// Ikki har xil o'lchamli stakan, ikkalasi 50% to'la (foiz = nisbat, miqdor emas). OLTIN-sariq teaching toni.
// Ildiz .tw-wrap DOIM uzluksiz twBreathe loop.
const TwinGlasses = () => (
  <div className="tw-wrap" aria-hidden="true">
    <svg width="120" height="80" viewBox="0 0 120 80">
      <rect x="10" y="14" width="30" height="58" rx="4" fill="none" stroke="#D8A93A" strokeWidth="2.4"/>
      <rect x="11.5" y="43" width="27" height="28" rx="3" fill="rgba(216,169,58,0.40)"/>
      <text x="25" y="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="11" fill="#B8901F">50%</text>
      <rect x="76" y="36" width="24" height="36" rx="4" fill="none" stroke="#D8A93A" strokeWidth="2.4"/>
      <rect x="77.5" y="54" width="21" height="17" rx="3" fill="rgba(216,169,58,0.40)"/>
      <text x="88" y="31" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="11" fill="#B8901F">50%</text>
    </svg>
  </div>
);

// DecInputScreen — o'nli/butun javob (text + inputMode, vergul va nuqtani qabul qiladi). type="number" YO'Q. Веди-до-верного.
const DecInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, suffix, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    const isCorrect = Math.abs(v - correct) < 1e-9;
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
        <Bridge node={c.bridge}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input type="text" inputMode="decimal" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(110px, 24vw, 150px)' }}/>
          {suffix && <span className="mop" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>{suffix}</span>}
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
// SeqMC — ketma-ket bir nechta tez MC (warmup / practice). Mobil-do'st tap.
// Har savolda веди-до-верного; to'g'ridan keyin avto o'tadi. scored=true bo'lsa oxirida bitta natija.
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
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{scored ? (lang === 'uz' ? "Hamma misol yechildi." : 'Все примеры решены.') : (lang === 'uz' ? "Mashq tugadi." : 'Разминка пройдена.')}</p>
          </div>
        ) : (
          <>
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 14
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {tx(o)}
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
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (batareya, M2). Qaytishda picked TO'LIQ sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <BatteryHook/>
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

// s1 — WARM-UP: 3 ta foiz prereq (tap)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;
// s10 — MASHQ: 3 ta ulushni foizga (tap, scored)
const Screen10 = (props) => <SeqMC {...props} screenContent={CONTENT.s10} scored={true}/>;

// s2 — EXPLORATION: 10x10 PercentGrid, tap bilan 9 katak bo'yaladi (1% = 1 katak). Step-audio gated.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([
    { id: 's2_tap', text: c.audio.tap[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'cell' } },
    { id: 's2_done', text: c.audio.done[lang], trigger: 'on_event:done', waits_for: { type: 'button_click', target: 'next' } }
  ]);
  const [n, setN] = useState(0);
  const doneRef = useRef(false);
  const tapCell = () => {
    if (n >= 9) return;
    const nn = n + 1; setN(nn);
    if (nn === 1) audio.triggerEvent('button_click', 'cell');
    if (nn === 9 && !doneRef.current) { doneRef.current = true; audio.triggerInternal('done'); }
  };
  const goNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const progressTxt = t(c.progress).replace('{n}', String(n));
  const navContent = n < 9
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={t(c.btn_step)} onClick={tapCell}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={t(c.btn_final)} onClick={goNext}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <PercentGrid shaded={n} glow={n >= 9} success={n >= 9}/>
          <p className="dm-prob fade-up" style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 26px)' }}>{progressTxt}</p>
          {n >= 9 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.note_done))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION: slider 0-100 -> PercentGrid + FourForms (bitta son, to'rt yozuv).
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [v, setV] = useState(20);
  const reachedFull = v >= 100;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', alignItems: 'center', justifyContent: 'center' }}>
          <PercentGrid shaded={v}/>
          <div className="pg-forms-wrap"><FourForms n={v}/></div>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {v}%</p>
          <Slider value={v} min={0} max={100} step={5} onChange={setV}/>
          <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink3 }}>{mt(t(reachedFull ? c.instr_full : c.instr))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s4 — RULE: N% = N/100 (lean). Bridge.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2, c.rule_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)' }}>
          <div style={{ flexShrink: 0 }}><PercentGrid shaded={20} glow={true} sm={true}/></div>
          <div>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.ex_label)}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.ex_caption))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s5 — EXAMPLES: 25/50/75% har biri to'rt yozuvda (step reveal, OLTIN gridlar). Step-audio gated.
const EX_PCTS = [25, 50, 75];
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s5_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);   // 0 = lead only; 1..3 = misol 1..3 ochiq
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 13px)' }}>
        <FloatTiles/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        {EX_PCTS.map((p, i) => (step >= i + 1) && (
          <div key={p} className="frame fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)' }}>
            <div style={{ flexShrink: 0 }}><PercentGrid shaded={p} glow={true} sm={true}/></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div className="pg-forms-wrap pg-forms-gold"><FourForms n={p}/></div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.ex_note[i]))}</p>
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

// s6 — MERGE: 100% = butun + foiz NISBAT (TwinGlasses) + foiz hayotda qayerda. Step reveal, pale-yellow.
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s6_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);   // 0 = 100%=butun; 1 = nisbat (TwinGlasses); 2 = hayotda qayerda
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const uses = [[c.use1_label, c.use1_val], [c.use2_label, c.use2_val], [c.use3_label, c.use3_val], [c.use4_label, c.use4_val]];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 13px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.point1))}</p>
        </div>
        {step >= 1 && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)' }}>
            <TwinGlasses/>
            <div style={{ minWidth: 0 }}>
              <p className="eyebrow" style={{ color: '#B8901F', marginBottom: 4 }}>{t(c.sec2_h)}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.point2))}</p>
            </div>
          </div>
        )}
        {step >= 2 && (
          <div className="frame fade-up" style={{ position: 'relative' }}>
            <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.sec3_h)}</p>
            <div className="use-grid">
              {uses.map(([lb, val], i) => (
                <div key={i} className="use-cell">
                  <span className="use-lbl">{t(lb)}</span>
                  <span className="use-val">{mt(t(val))}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s7 — TEST MC: 45% = 9/20 [FAKT etimologiya]
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);   // to'g'ri -> A
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPercent/>}/>}/>;
};

// s8 — TEST DecInput: 7/20 = ?% -> 35
const Screen8 = (props) => {
  const c = CONTENT.s8;
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={35} suffix="%"
    renderVisual={() => <div className="dm-prob"><Frac n={7} d={20} size="mid"/> = ?%</div>}/>;
};

// s9 — TEST sort: =1/2 / teng emas. Tartib RANDOM (Fisher-Yates). 8 karta, zich.
const S9_CARDS = [
  { label: '50%',      bin: 'sq' },   // = 1/2
  { label: '0,5',      bin: 'sq' },   // = 1/2
  { label: '150/300',  bin: 'sq' },   // = 1/2
  { label: '4/8',      bin: 'sq' },   // = 1/2
  { label: '5%',       bin: 'cu' },   // != 1/2
  { label: '0,05',     bin: 'cu' },   // != 1/2
  { label: '2/5',      bin: 'cu' },   // != 1/2 (1 ga yaqin emas, lekin tuzoq: 40%)
  { label: '9/20',     bin: 'cu' }    // != 1/2 (45%, 1/2 ga yaqin — qiyin)
];
const SORT_BINS = [{ key: 'sq', dir: 'down' }, { key: 'cu', dir: 'up' }];
const SortChevron = ({ dir }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {dir === 'down' ? <polyline points="6 9 12 15 18 9"/> : <polyline points="6 15 12 9 18 15"/>}
  </svg>
);
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9; const sfx = useSfx();
  const [deck] = useState(() => { const a = S9_CARDS.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; });
  const n = deck.length;
  const audio = useAudio([{ id: 's9_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const allPlaced = () => { const o = {}; deck.forEach((cd, i) => { o[i] = cd.bin; }); return o; };
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? allPlaced() : {}));
  const [done, setDone] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(null);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null); const flashRef = useRef(null);
  const cur = idx < n ? deck[idx] : null;
  const finish = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: deck.map(cd => cd.bin).join(','), studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const tapBin = (bin) => {
    if (done || !cur) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const correct = bin === cur.bin;
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct;
    if (correct) {
      setHint(false); setPlaced(p => ({ ...p, [idx]: bin })); sfx.playCorrect();
      const snap = firstTryRef.current.slice();
      advRef.current = setTimeout(() => { if (idx + 1 < n) setIdx(idx + 1); else { setIdx(n); finish(snap); } }, 480);
    } else {
      sfx.playWrong(); setHint(true);
      setFlash(bin); if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (flashRef.current) clearTimeout(flashRef.current); }, []);
  const inBin = (bin) => deck.map((cd, i) => i).filter(i => placed[i] === bin);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {deck.map((_, i) => <span key={i} className={`seq-dot${(i < idx || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        <div className="sort-tray fade-up delay-1">
          {done
            ? <span className="sort-tray-card" style={{ color: T.success }} aria-hidden="true">✓</span>
            : <><span className="sort-tray-card" key={idx}>{mt(cur.label)}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {SORT_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h"><SortChevron dir={b.dir}/>{b.key === 'sq' ? mt(t(c.bin_sq)) : mt(t(c.bin_cu))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{mt(deck[i].label)}</span>)}
              </span>
            </button>
          ))}
        </div>
        {hint && !done && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s11 — TEST find-the-wrong (xato tenglikni top) [FAKT batareya]
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 3, [2, 3, 0, 1]);   // to'g'ri (3/5=35% xato) -> B
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimBat/>}/>}/>;
};

// s12 — CASE setup + FINAL birlashgan (progressiv: shart -> ixcham kontekst KO'RINIB qoladi + MC ochiladi). Scored: final.
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);   // to'g'ri (7-A 75%) -> D
  const audio = useAudio([
    { id: 'case_a0', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'help' } },
    { id: 'case_a1', text: c.audio.intro2[lang], trigger: 'on_event:help', waits_for: { type: 'option_picked' } }
  ]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [phase, setPhase] = useState(wasSolved ? 1 : 0);
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const helpRef = useRef(wasSolved);
  const reveal = () => { setPhase(1); if (!helpRef.current) { helpRef.current = true; audio.triggerInternal('help'); } };
  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isCorrect = i === correctIdx;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstIdxRef.current = i; }
    attemptsRef.current += 1;
    setPicked(i);
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isCorrect) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: content.question?.[lang] ?? null, correctIndex: correctIdx, correctAnswer: typeof options[correctIdx] === 'string' ? options[correctIdx] : null, studentAnswerIndex: firstIdxRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setWrong(prev => { const nn = new Set(prev); nn.add(i); return nn; });
    }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) {
          const wrongVoice = (content[`wrong_${i}`] && content[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={t(c.btn_help)}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        {phase === 0 ? (
          <>
            <Bridge node={c.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
            <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
              <div className="dm-prob" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)' }}>{mt(t(c.compact))}</div>
            </div>
            <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.note))}</p>
            <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
          </>
        ) : (
          <>
            <div className="case-ctx fade-up" style={{ position: 'relative' }}>
              <span className="case-ctx-tag">{mt(t(c.title))}</span>
              <span className="case-ctx-tx">{mt(t(c.compact))}</span>
            </div>
            <h2 className="title h-sub fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c.question))}</h2>
            <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
              {options.map((opt, i) => {
                let cls = 'option';
                const isWrongPicked = wrong.has(i);
                const isCorrect = i === correctIdx;
                const collapse = solved && !isCorrect;
                if (solved && isCorrect) cls += ' option-correct';
                else if (isWrongPicked) cls += ' option-picked-wrong';
                const disabled = solved || isWrongPicked;
                return (
                  <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                    style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
                    <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>{solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(solved ? t(content.correct_text) : t(content[`wrong_${picked}`] || content.wrong_default || content.correct_text))}</p>
            </FeedbackBlock>
            {solved && <FactCard text={c.fact} badge={FB_SCI} anim={<AnimBody/>}/>}
          </>
        )}
      </div>
    </Stage>
  );
};

// s13 — SUMMARY
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
        <FloatTiles/>
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

export default function PercentConceptLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, ScreenRule, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenCase, Screen13];
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
/* MATH perc_5_01: figuralar — PercentGrid (uzluksiz pgBreathe) + BatteryHook (bhBreathe) + */
/* TwinGlasses (twBreathe) + sort + fakt-anim. HAR figura ildizida uzluksiz nafas; circling YO'Q. */
/* solved/glow/pop holatda effekt QO'SHILADI, nafas hech qachon DROP qilinmaydi. */
/* ============================================================ */
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; display: inline-flex; align-items: center; gap: 6px; }
.dm-res { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(26px, 6vw, 40px); color: #1F7A4D; }

/* PercentGrid — 10x10 birlik kvadrat. Ildiz .pg-grid DOIM uzluksiz pgBreathe loop. */
.pg-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; width: clamp(150px, 40vw, 210px); aspect-ratio: 1; padding: 4px; background: #EEEAE2; border-radius: 6px; animation: pgBreathe 3.6s ease-in-out infinite; }
.pg-grid.pg-sm { width: clamp(96px, 26vw, 124px); gap: 1.5px; padding: 3px; }
.pg-grid.pg-glow { animation: pgGlow 0.9s ease, pgBreathe 3.6s ease-in-out infinite; }
.pg-grid.pg-success { animation: pgGlowOk 0.9s ease, pgBreathe 3.6s ease-in-out infinite; }
.pg-cell { background: #FFFFFF; border-radius: 1px; transition: background 0.3s ease; }
.pg-on { background: #FF4F28; }
.pg-ok { background: #1F7A4D; }
.pg-pop { animation: pgPop 0.34s ease-out both; }
@keyframes pgPop { from { opacity: 0.2; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
@keyframes pgBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 14px rgba(255, 79, 40, 0.14); } }
@keyframes pgGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 16px rgba(255, 79, 40, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }
@keyframes pgGlowOk { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 16px rgba(31, 122, 77, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }

/* FourForms — bitta sonning to'rt yozuvi qatori. */
.pg-forms-wrap { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; }
.pg-forms { display: inline-flex; align-items: center; flex-wrap: wrap; justify-content: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 22px); color: #0E0E10; }
.pg-forms b { color: #FF4F28; font-weight: 800; }
.pg-forms-gold .pg-forms b { color: #B8901F; }

/* BatteryHook — ikki har xil o'lchamli batareya, ikkalasi 50% to'la. Ildiz .bh-wrap DOIM uzluksiz bhBreathe loop. */
.bh-wrap { display: flex; align-items: flex-end; justify-content: center; gap: clamp(20px, 5vw, 40px); padding: 6px; border-radius: 12px; animation: bhBreathe 3.6s ease-in-out infinite; }
.bh-one { display: flex; flex-direction: column; align-items: center; gap: 7px; }
.bh-bat { position: relative; border: 3px solid #5A5A60; border-radius: 7px; background: #FFFFFF; display: flex; align-items: flex-end; overflow: hidden; }
.bh-big { width: clamp(54px, 13vw, 78px); height: clamp(96px, 22vw, 132px); }
.bh-small { width: clamp(40px, 9vw, 54px); height: clamp(56px, 13vw, 78px); }
.bh-tip { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 40%; height: 6px; background: #5A5A60; border-radius: 3px 3px 0 0; }
.bh-fill { width: 100%; height: 50%; background: linear-gradient(180deg, #FF7A5C, #FF4F28); }
.bh-pct { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(15px, 2.6vw, 19px); color: #FF4F28; }
@keyframes bhBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 14px rgba(255, 79, 40, 0.12); } }

/* TwinGlasses — ikki har xil stakan, ikkalasi 50% (foiz = nisbat). Ildiz .tw-wrap DOIM uzluksiz twBreathe loop. */
.tw-wrap { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; padding: 6px; border-radius: 12px; animation: twBreathe 3.6s ease-in-out infinite; }
@keyframes twBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(216, 169, 58, 0); } 50% { box-shadow: 0 0 14px rgba(216, 169, 58, 0.18); } }

/* use-grid — foiz hayotda qayerda (4 ta misol kartasi). */
.use-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 12px); }
.use-cell { display: flex; flex-direction: column; gap: 3px; background: #F6F4EF; border-radius: 10px; padding: clamp(8px, 1.6vw, 11px) clamp(10px, 2vw, 13px); }
.use-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); text-transform: uppercase; letter-spacing: 0.06em; color: #A7A6A2; }
.use-val { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(14px, 2.2vw, 17px); color: #019ACB; }

/* SeqMC — ketma-ket tez MC progress nuqtalari. */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

/* sort — ketma-ket tasniflash (son chiqadi -> chiroyli savatga joylaydi). */
.sort-tray { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 16px; padding: clamp(13px, 2.5vw, 18px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); min-height: clamp(84px, 15vw, 100px); }
.sort-tray-card { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #0E0E10; animation: sort-pop 0.4s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes sort-pop { 0% { opacity: 0; transform: translateY(-8px) scale(0.8); } 100% { opacity: 1; transform: none; } }
.sort-tray-ask { font-size: clamp(12px, 1.6vw, 13px); color: #5A5A60; }
.sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2vw, 14px); }
.sort-bin { display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border: none; border-radius: 16px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.16); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease; min-height: clamp(94px, 17vw, 116px); text-align: left; }
.sort-bin:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 28px -6px rgba(58, 53, 48, 0.24); }
.sort-bin:disabled { cursor: default; }
.sort-bin-h { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); padding: 5px 10px; border-radius: 9px; }
.sort-bin-sq .sort-bin-h { color: #1F7A4D; background: #E3F0E8; }
.sort-bin-cu .sort-bin-h { color: #5A5A60; background: #EFEEE9; }
.sort-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; }
.sort-chip-in { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.8vw, 14px); color: #1F7A4D; background: #E3F0E8; border-radius: 9px; padding: 5px 9px; animation: sort-pop 0.35s ease both; }
.sort-bin-bad { animation: odShake 0.4s ease; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 22px -6px rgba(255, 79, 40, 0.3); }

/* bridge — slaydlararo ma'noli o'tish qatori (faza chegarasi). */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* Fakt-animatsiyalar (ko'k tema, qutiga sig'adi, uzluksiz infinite loop). */
/* Tarix: 100 soni -> foiz belgisi navbatma-navbat (per centum). */
.fa-pc { position: relative; width: clamp(76px, 16vw, 110px); height: clamp(56px, 12vw, 80px); display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; }
.fa-pc-num { position: absolute; font-size: clamp(26px, 6vw, 38px); color: #019ACB; animation: faPcNum 3s ease-in-out infinite; }
.fa-pc-sign { position: absolute; font-size: clamp(34px, 8vw, 50px); color: #019ACB; animation: faPcSign 3s ease-in-out infinite; }
@keyframes faPcNum { 0%, 40% { opacity: 1; transform: scale(1); } 55%, 95% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
@keyframes faPcSign { 0%, 40% { opacity: 0; transform: scale(0.8); } 55%, 95% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.8); } }
/* IT: batareya 0% dan 100% gacha to'ladi. */
.fa-bt { position: relative; width: clamp(46px, 10vw, 64px); height: clamp(64px, 14vw, 88px); border: 3px solid #019ACB; border-radius: 7px; background: rgba(1, 154, 203, 0.08); display: flex; align-items: flex-end; overflow: hidden; }
.fa-bt-tip { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 40%; height: 6px; background: #019ACB; border-radius: 3px 3px 0 0; }
.fa-bt-fill { width: 100%; background: #019ACB; animation: faBt 3.2s ease-in-out infinite; }
@keyframes faBt { 0% { height: 10%; } 50% { height: 100%; } 100% { height: 10%; } }
/* Fan: tana taxminan 60% suvga to'ladi. */
.fa-wb { position: relative; width: clamp(56px, 12vw, 80px); height: clamp(60px, 13vw, 84px); border: 3px solid #019ACB; border-radius: 10px; background: rgba(1, 154, 203, 0.08); display: flex; align-items: flex-end; justify-content: center; overflow: hidden; }
.fa-wb-fill { position: absolute; left: 0; bottom: 0; width: 100%; height: 60%; background: rgba(1, 154, 203, 0.45); animation: faWb 3.4s ease-in-out infinite; }
.fa-wb-mark { position: relative; z-index: 2; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px, 2.4vw, 17px); color: #019ACB; margin-bottom: 6px; }
@keyframes faWb { 0%, 100% { height: 54%; } 50% { height: 64%; } }

/* flt — dekorativ suzuvchi birlik kvadratchalar (yuzdan ulush mavzusi, sekin, yengil, uzluksiz). */
.flt { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.flt-c { position: absolute; width: 18px; height: 18px; border-radius: 4px; opacity: 0.5; background: linear-gradient(135deg, rgba(255, 79, 40, 0.22), rgba(255, 79, 40, 0.06)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.18); animation: fltFloat 16s ease-in-out infinite; }
.flt-1 { left: 7%; top: 16%; animation-delay: 0s; }
.flt-2 { right: 9%; top: 22%; width: 13px; height: 13px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.22), rgba(1, 154, 203, 0.06)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.18); animation-delay: -6s; }
.flt-3 { left: 14%; bottom: 14%; width: 14px; height: 14px; animation-delay: -10s; }
.flt-4 { right: 13%; bottom: 20%; width: 20px; height: 20px; background: linear-gradient(135deg, rgba(1, 154, 203, 0.2), rgba(1, 154, 203, 0.05)); box-shadow: inset 0 0 0 1px rgba(1, 154, 203, 0.16); animation-delay: -3s; }
.flt-5 { left: 30%; top: 8%; width: 12px; height: 12px; animation-delay: -13s; }
.flt-6 { right: 32%; bottom: 9%; width: 15px; height: 15px; background: linear-gradient(135deg, rgba(255, 79, 40, 0.18), rgba(255, 79, 40, 0.05)); box-shadow: inset 0 0 0 1px rgba(255, 79, 40, 0.15); animation-delay: -8s; }
@keyframes fltFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.45; } 50% { transform: translateY(-14px) rotate(6deg); opacity: 0.75; } }

`;
