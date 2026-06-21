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
// --- POD UROK: percent_5_03 — Foizi bo'yicha sonni topish / Нахождение числа по проценту (PROMPT 2026-06-20) ---
// Markaziy g'oya (teskari foiz): QISM va uning FOIZI berilgan -> BUTUNni top. "1% ko'prigi": qism / foiz = 1%, *100 = butun.
// Misol: 20% i 10 bo'lsa -> 10 / 20 = 0,5 (bu 1%) -> *100 = 50. Teng usul: qism / (foiz/100).
// M1: qism = butun deb adashish (xarita bo'lagi 10 katak -> butun ham 10 katak deb o'ylash).
// M2: BIR XIL qism, BOSHQA foiz -> BOSHQA butun (12 i 20% bo'lsa 60; 12 i 30% bo'lsa 40 — foiz butunni o'zgartiradi).
// Hook: Oybek yirtilgan xaritani topadi — bo'lak 20% = 10 katak; butun xaritani 10 katak deb adashadi (M1). Case: Iroda sinf so'rovnomasi.
// Vizualizator: PartWholeBar (qism->butun yig'iladi) + TileGrid (Dars35 uzluksiz tgBreathe loop; circling YO'Q). Etalon: Dars28.
// Faktlar (DRAFT): saylov/so'rovnoma teskari foizi (Statistika) / per cento = yuzdan tarixi (Tarix) / chegirmadan asl narx (Hayot).
// ============================================================
const TOTAL_SCREENS = 12;
const LESSON_META = {
  lessonId: 'percent_5_03',
  lessonTitle: { ru: 'Нахождение числа по проценту', uz: "Foizi bo'yicha sonni topish" }
};
// Eslatma: ekran ID lari qattiq indeks emas — har komponent jonli `screen` propidan idx oladi.
// Reorder qilishda faqat SCREEN_META + screens massivini bir xil tartibda yangilang.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',          scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',           scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',          scored: false, scope: null },       // 2
  { id: 's3',  type: 'rule',        template: 'custom',          scored: false, scope: null },       // 3 (qoida + M1/M2 birlashgan)
  { id: 's4',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },  // 4 (ishlangan misol + mashq)
  { id: 's5',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 5
  { id: 's6',  type: 'test',        template: 'DecInputScreen',  scored: true,  scope: 'practice' },  // 6
  { id: 's7',  type: 'test',        template: 'SeqMC',           scored: true,  scope: 'practice' },  // 7 (3 oson teskari misol)
  { id: 's8',  type: 'test',        template: 'custom',          scored: true,  scope: 'practice' },  // 8 (tasniflash, M2)
  { id: 's9',  type: 'test',        template: 'MCScreen',        scored: true,  scope: 'practice' },  // 9 (xatoni top)
  { id: 's10', type: 'case',        template: 'custom',          scored: true,  scope: 'final' },     // 10 (masala + yakuniy birlashgan)
  { id: 's11', type: 'summary',     template: 'custom',          scored: false, scope: null }         // 11
];

const CONTENT = {
  // ===== s0 HOOK (M1: qism = butun) — Oybek yirtilgan xarita =====
  s0: {
    eyebrow: { ru: 'Часть и целое', uz: "Qism va butun" },
    title: { ru: 'Карта Ойбека', uz: "Oybekning xaritasi" },
    lead: { ru: 'Ойбек нашёл обрывок карты: это 20 процентов, в нём 10 клеток. Сколько клеток во всей карте?', uz: "Oybek xarita bo'lagini topdi: bu yigirma foiz, unda 10 katak. Butun xaritada nechta katak?" },
    opt0: { ru: 'Всего 10 клеток', uz: "Jami 10 katak" },
    opt1: { ru: 'Больше 10 клеток', uz: "10 katakdan ko'p" },
    opt2: { ru: 'Меньше 10 клеток', uz: "10 katakdan kam" },
    reveal0: { ru: 'Так думают многие. Но 10 — это только обрывок, 20 процентов. Целая карта больше.', uz: "Ko'pchilik shunday o'ylaydi. Lekin 10 — bu faqat bo'lak, yigirma foiz. Butun xarita kattaroq." },
    reveal1: { ru: 'Верно. Обрывок — это только часть, значит целая карта больше десяти.', uz: "To'g'ri. Bo'lak — bu faqat qism, demak butun xarita o'ndan katta." },
    reveal2: { ru: 'Нет: целое не может быть меньше своей части. Карта больше обрывка.', uz: "Yo'q: butun o'z qismidan kichik bo'lolmaydi. Xarita bo'lakdan katta." },
    audio: { ru: "Ойбек нашёл обрывок старой карты. Это двадцать процентов всей карты, и в нём десять клеток. Подумайте: во всей карте больше или меньше десяти клеток?", uz: "Oybek eski xaritaning bo'lagini topdi. Bu butun xaritaning yigirma foizi, va unda o'nta katak bor. O'ylab ko'ring: butun xaritada o'ntadan ko'pmi yoki kammi?" }
  },

  // ===== s1 WARM-UP — 3 ta tez prereq (1% va foiz) =====
  s1: {
    eyebrow: { ru: 'Вспомним прошлый урок', uz: "O'tgan darsni eslaylik" },
    title: { ru: 'Разминка', uz: "Mashq" },
    lead: { ru: 'Три быстрых примера про проценты. Выбери ответ.', uz: "Foiz haqida uchta tez misol. Javobni tanlang." },
    bridge: { ru: 'Прежде чем помочь Ойбеку, вспомним проценты.', uz: "Oybekka yordam berishdan oldin foizni eslaylik." },
    questions: [
      {
        q: { ru: '1% = 4. Сколько 100%?', uz: "1% = 4. 100% nechaga teng?" },
        say: { ru: "Если один процент равен четырём, чему равно сто процентов?", uz: "Agar bir foiz to'rtga teng bo'lsa, yuz foiz nechaga teng?" },
        opts: [{ ru: '40', uz: '40' }, { ru: '400', uz: '400' }, { ru: '104', uz: '104' }],
        correct: 1,
        ok: { ru: 'Верно: один процент берём сто раз.', uz: "To'g'ri: bir foizni yuz marta olamiz." },
        no: { ru: 'Целое это сто таких частей. Умножьте на сто.', uz: "Butun, bu shunday yuzta qism. Yuzga ko'paytiring." }
      },
      {
        q: { ru: '10% = 5. Сколько 100%?', uz: "10% = 5. 100% nechaga teng?" },
        say: { ru: "Если десять процентов равно пяти, чему равно сто процентов?", uz: "Agar o'n foiz beshga teng bo'lsa, yuz foiz nechaga teng?" },
        opts: [{ ru: '50', uz: '50' }, { ru: '15', uz: '15' }, { ru: '500', uz: '500' }],
        correct: 0,
        ok: { ru: 'Верно: сто процентов — это десять таких десятков.', uz: "To'g'ri: yuz foiz — bu shunday o'nta o'nlik." },
        no: { ru: 'В целом десять таких долей. Подумайте, во сколько раз больше.', uz: "Butunda shunday o'nta ulush bor. Necha barobar ko'pligini o'ylang." }
      },
      {
        q: { ru: '20 разделить на 20', uz: "20 ni 20 ga bo'ling" },
        say: { ru: "Сколько будет двадцать разделить на двадцать?", uz: "Yigirmani yigirmaga bo'lsak qancha bo'ladi?" },
        opts: [{ ru: '1', uz: '1' }, { ru: '0', uz: '0' }, { ru: '20', uz: '20' }],
        correct: 0,
        ok: { ru: 'Верно: число на само себя — единица.', uz: "To'g'ri: son o'ziga bo'linsa — bir." },
        no: { ru: 'Любое число, делённое на само себя, равно единице.', uz: "Har qanday son o'ziga bo'linsa, birga teng." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем помочь Ойбеку, вспомним проценты. Три быстрых примера.", uz: "Oybekka yordam berishdan oldin, foizni eslaylik. Uchta tez misol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Попробуй ещё раз.", uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: "Отлично, разминка пройдена.", uz: "Zo'r, mashq tugadi." }
    }
  },

  // ===== s2 EXPLORATION — 20% = 10 -> *5 = 50 (step, tiles assemble) =====
  s2: {
    eyebrow: { ru: 'Собираем целое', uz: "Butunni yig'amiz" },
    title: { ru: 'От части — к целому', uz: "Qismdan — butunga" },
    lead: { ru: 'Вернёмся к карте: 20 процентов — это 10 клеток.', uz: "Xaritaga qaytamiz: yigirma foiz — bu 10 katak." },
    bridge: { ru: 'Размялись. Теперь шаг за шагом соберём целую карту.', uz: "Mashq qildik. Endi butun xaritani qadam-baqadam yig'amiz." },
    line_part: { ru: '20% — это 10 клеток.', uz: "20% — bu 10 katak." },
    line_count: { ru: 'Сколько таких частей в целом? Сто делим на двадцать — пять.', uz: "Butunda shunday nechta qism bor? Yuzni yigirmaga bo'lamiz — besh." },
    line_whole: { ru: 'Пять раз по 10 клеток — это 50 клеток. Вот вся карта.', uz: "Besh marta 10 katakdan — bu 50 katak. Mana butun xarita." },
    line_key: { ru: 'Часть меньше целого. Чтобы найти целое, узнаём, сколько в нём таких частей.', uz: "Qism butundan kichik. Butunni topish uchun unda shunday nechta qism borligini bilamiz." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Размялись. Теперь соберём целую карту по шагам.",
        "Двадцать процентов, это десять клеток. Это только часть.",
        "Сколько таких частей в целом? Сто делим на двадцать, получается пять.",
        "Пять раз по десять клеток, это пятьдесят клеток. Вот и вся карта."
      ],
      uz: [
        "Mashq qildik. Endi butun xaritani qadamlab yig'amiz.",
        "Yigirma foiz, bu o'nta katak. Bu faqat qism.",
        "Butunda shunday nechta qism bor? Yuzni yigirmaga bo'lamiz, besh chiqadi.",
        "Besh marta o'ntadan katak, bu ellik katak. Mana butun xarita."
      ]
    }
  },

  // ===== s3 RULE + M1/M2 (birlashgan) =====
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Как найти целое по проценту', uz: "Foiz bo'yicha butunni qanday topamiz" },
    bridge: { ru: 'Мы собрали целое руками. Теперь соберём это в правило.', uz: "Butunni qo'l bilan yig'dik. Endi buni qoidaga yig'amiz." },
    rule_label: { ru: 'Мост через один процент', uz: "Bir foiz ko'prigi" },
    rule_1: { ru: 'Делим часть на её процент — получаем один процент.', uz: "Qismni uning foiziga bo'lamiz — bir foizni olamiz." },
    rule_2: { ru: 'Умножаем один процент на сто — получаем целое.', uz: "Bir foizni yuzga ko'paytiramiz — butunni olamiz." },
    rule_3: { ru: 'Коротко: часть делим на процент, потом умножаем на сто.', uz: "Qisqacha: qismni foizga bo'lib, keyin yuzga ko'paytiramiz." },
    ex_label: { ru: 'Пример', uz: "Misol" },
    ex_caption: { ru: '20% = 10 → 10 делим на 20 = 0,5 → умножаем на 100 = 50.', uz: "20% = 10 → 10 ni 20 ga bo'lamiz = 0,5 → yuzga ko'paytiramiz = 50." },
    warn_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warn_1: { ru: 'Часть — не целое. 10 клеток — это только обрывок, не вся карта.', uz: "Qism — butun emas. 10 katak — bu faqat bo'lak, butun xarita emas." },
    warn_2: { ru: 'Одна и та же часть при разном проценте даёт разное целое.', uz: "Bir xil qism turli foizda turli butun beradi." },
    audio: { ru: "Мы собрали целое руками. Теперь правило. Делим часть на её процент и получаем один процент. Потом умножаем один процент на сто и получаем целое. И запомните: одна и та же часть при разном проценте даёт разное целое.", uz: "Butunni qo'l bilan yig'dik. Endi qoida. Qismni uning foiziga bo'lib, bir foizni olamiz. Keyin bir foizni yuzga ko'paytirib, butunni olamiz. Va yodda tuting: bir xil qism turli foizda turli butun beradi." }
  },

  // ===== s4 ISHLANGAN MISOL + MASHQ (scored): yuqorida 30%=15->50; pastda 40%=20->50 (DecInput) =====
  s4: {
    eyebrow: { ru: 'Сначала пример, потом сами', uz: "Avval misol, keyin o'zingiz" },
    title: { ru: 'Найди целое', uz: "Butunni toping" },
    bridge: { ru: 'Правило знаем. Сначала посмотрите пример, потом решите сами.', uz: "Qoidani bilamiz. Avval misolni ko'ring, keyin o'zingiz yeching." },
    we_label: { ru: 'Разобранный пример', uz: "Ishlangan misol" },
    we_caption: { ru: '30% = 15 → 15 делим на 30 = 0,5 → умножаем на 100 = 50.', uz: "30% = 15 → 15 ni 30 ga bo'lamiz = 0,5 → yuzga ko'paytiramiz = 50." },
    question: { ru: 'Теперь сами: 40% числа равно 20. Чему равно число?', uz: "Endi o'zingiz: sonning 40% i 20 ga teng. Son nechaga teng?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Разделите часть на её процент, потом умножьте на сто.', uz: "Qismni uning foiziga bo'ling, keyin yuzga ko'paytiring." },
    fb_correct: { ru: 'Верно: 20 делим на 40 = 0,5, умножаем на 100 = 50.', uz: "To'g'ri: 20 ni 40 ga bo'lamiz = 0,5, yuzga ko'paytiramiz = 50." },
    audio: {
      intro: { ru: "Сначала посмотрите разобранный пример сверху. Теперь сами: сорок процентов числа равно двадцати. Чему равно само число?", uz: "Avval yuqoridagi ishlangan misolni ko'ring. Endi o'zingiz: sonning qirq foizi yigirmaga teng. Sonning o'zi nechaga teng?" },
      on_correct: { ru: "Верно, число пятьдесят.", uz: "To'g'ri, son ellik." },
      on_wrong: { ru: "Разделите часть на её процент, потом умножьте на сто.", uz: "Qismni uning foiziga bo'ling, keyin yuzga ko'paytiring." }
    }
  },

  // ===== s5 TEST MC — 30% = 60 -> 200 [FAKT saylov] =====
  s5: {
    eyebrow: { ru: 'Находим целое', uz: "Butunni topamiz" },
    title: { ru: 'Найди всё число', uz: "Butun sonni toping" },
    question: { ru: '30% числа равно 60. Чему равно число?', uz: "Sonning 30% i 60 ga teng. Son nechaga teng?" },
    opt0: { ru: '200', uz: '200' },
    opt1: { ru: '90', uz: '90' },
    opt2: { ru: '18', uz: '18' },
    opt3: { ru: '600', uz: '600' },
    correct_text: { ru: 'Верно: 60 делим на 30 = 2, умножаем на 100 = 200.', uz: "To'g'ri: 60 ni 30 ga bo'lamiz = 2, yuzga ko'paytiramiz = 200." },
    wrong_1: { ru: 'Вы сложили часть и процент. Разделите часть на процент, потом умножьте на сто.', uz: "Siz qism va foizni qo'shdingiz. Qismni foizga bo'ling, keyin yuzga ko'paytiring." },
    wrong_2: { ru: 'Это часть от 60, а нужно наоборот, найти целое. Целое больше части.', uz: "Bu 60 dan qism, kerak esa aksincha, butunni topish. Butun qismdan katta." },
    wrong_3: { ru: 'Слишком много. Разделите часть на процент, потом умножьте на сто.', uz: "Juda ko'p. Qismni foizga bo'ling, keyin yuzga ko'paytiring." },
    fact: { ru: 'На выборах по части подсчитанных голосов и их проценту обратным счётом находят, сколько всего человек проголосовало.', uz: "Saylovda sanalgan ovozlarning bir qismi va ularning foizi bo'yicha teskari hisob bilan jami nechta odam ovoz berganini topishadi." },
    fact_audio: { ru: "На выборах по части подсчитанных голосов и их проценту обратным счётом находят, сколько всего человек проголосовало.", uz: "Saylovda sanalgan ovozlarning bir qismi va ularning foizi bo'yicha teskari hisob bilan jami nechta odam ovoz berganini topishadi." },
    audio: {
      intro: { ru: "Тридцать процентов числа равно шестидесяти. Чему равно само число?", uz: "Sonning o'ttiz foizi oltmishga teng. Sonning o'zi nechaga teng?" },
      on_correct: { ru: "Верно, двести. Шестьдесят делим на тридцать, получается два, умножаем на сто.", uz: "To'g'ri, ikki yuz. Oltmishni o'ttizga bo'lamiz, ikki chiqadi, yuzga ko'paytiramiz." },
      on_wrong: { ru: "Разделите часть на её процент, потом умножьте на сто.", uz: "Qismni uning foiziga bo'ling, keyin yuzga ko'paytiring." }
    }
  },

  // ===== s6 TEST DecInput — 50% = 35 -> 70 =====
  s6: {
    eyebrow: { ru: 'Половина известна', uz: "Yarmi ma'lum" },
    bridge: { ru: 'Хорошо. Теперь наберите ответ сами.', uz: "Yaxshi. Endi javobni o'zingiz tering." },
    question: { ru: '50% числа равно 35. Чему равно число?', uz: "Sonning 50% i 35 ga teng. Son nechaga teng?" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: '50 процентов это половина. Если половина известна, целое вдвое больше.', uz: "50 foiz, bu yarim. Yarmi ma'lum bo'lsa, butun ikki barobar katta." },
    fb_correct: { ru: 'Верно: 35 делим на 50 = 0,7, умножаем на 100 = 70.', uz: "To'g'ri: 35 ni 50 ga bo'lamiz = 0,7, yuzga ko'paytiramiz = 70." },
    audio: {
      intro: { ru: "Наберите ответ сами. Пятьдесят процентов числа равно тридцати пяти. Чему равно число?", uz: "Javobni o'zingiz tering. Sonning ellik foizi o'ttiz beshga teng. Son nechaga teng?" },
      on_correct: { ru: "Верно, семьдесят. Половина равна тридцати пяти, значит целое семьдесят.", uz: "To'g'ri, yetmish. Yarmi o'ttiz beshga teng, demak butun yetmish." },
      on_wrong: { ru: "Половина известна, целое вдвое больше. Разделите на процент и умножьте на сто.", uz: "Yarmi ma'lum, butun ikki barobar katta. Foizga bo'ling va yuzga ko'paytiring." }
    }
  },

  // ===== s7 TEST SeqMC — 3 ta oson teskari misol (scored) =====
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найди целое', uz: "Butunni toping" },
    lead: { ru: 'Три примера. Часть и процент даны, найдите число.', uz: "Uchta misol. Qism va foiz berilgan, sonni toping." },
    questions: [
      {
        q: { ru: '25% = 5. Целое?', uz: "25% = 5. Butun?" },
        say: { ru: "Двадцать пять процентов равно пяти. Чему равно целое?", uz: "Yigirma besh foiz beshga teng. Butun nechaga teng?" },
        opts: [{ ru: '20', uz: '20' }, { ru: '10', uz: '10' }, { ru: '125', uz: '125' }],
        correct: 0,
        ok: { ru: 'Верно: 5 делим на 25, умножаем на 100.', uz: "To'g'ri: 5 ni 25 ga bo'lib, yuzga ko'paytiramiz." },
        no: { ru: 'Разделите часть на процент, потом умножьте на сто.', uz: "Qismni foizga bo'ling, keyin yuzga ko'paytiring." }
      },
      {
        q: { ru: '10% = 7. Целое?', uz: "10% = 7. Butun?" },
        say: { ru: "Десять процентов равно семи. Чему равно целое?", uz: "O'n foiz yettiga teng. Butun nechaga teng?" },
        opts: [{ ru: '70', uz: '70' }, { ru: '17', uz: '17' }, { ru: '700', uz: '700' }],
        correct: 0,
        ok: { ru: 'Верно: десять таких частей — это семьдесят.', uz: "To'g'ri: shunday o'nta qism — bu yetmish." },
        no: { ru: 'В целом десять таких долей. Разделите на процент, умножьте на сто.', uz: "Butunda shunday o'nta ulush. Foizga bo'ling, yuzga ko'paytiring." }
      },
      {
        q: { ru: '50% = 9. Целое?', uz: "50% = 9. Butun?" },
        say: { ru: "Пятьдесят процентов равно девяти. Чему равно целое?", uz: "Ellik foiz to'qqizga teng. Butun nechaga teng?" },
        opts: [{ ru: '18', uz: '18' }, { ru: '4,5', uz: '4,5' }, { ru: '90', uz: '90' }],
        correct: 0,
        ok: { ru: 'Верно: половина равна девяти, целое вдвое больше.', uz: "To'g'ri: yarmi to'qqizga teng, butun ikki barobar." },
        no: { ru: 'Половина известна, целое вдвое больше.', uz: "Yarmi ma'lum, butun ikki barobar katta." }
      }
    ],
    audio: {
      intro: { ru: "Тренировка. Три примера. Часть и процент даны, найдите целое число.", uz: "Mashq. Uchta misol. Qism va foiz berilgan, butun sonni toping." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Молодец, все примеры верны.", uz: "Barakalla, hamma misol to'g'ri." }
    }
  },

  // ===== s8 TEST tasniflash (sort, M2): bir xil qism 12, foiz boshqa -> butun boshqa =====
  s8: {
    eyebrow: { ru: 'Один и тот же 12', uz: "Bir xil 12" },
    title: { ru: 'Часть 12 — разный процент', uz: "Qism 12 — har xil foiz" },
    lead: { ru: 'Часть всюду 12, но процент разный. В какую группу — целое больше 60 или нет?', uz: "Qism hamma joyda 12, lekin foiz har xil. Qaysi guruhga — butun 60 dan katta yoki yo'q?" },
    bin_sq: { ru: 'Целое 60 и меньше', uz: "Butun 60 va undan kichik" },
    bin_cu: { ru: 'Целое больше 60', uz: "Butun 60 dan katta" },
    ask: { ru: 'В какую группу? Тапни корзину.', uz: "Qaysi guruhga? Savatni bos." },
    done_text: { ru: 'Готово! Чем меньше процент, тем больше целое.', uz: "Tayyor! Foiz qancha kichik bo'lsa, butun shuncha katta." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint_wrong: { ru: 'Подумайте: при меньшем проценте целое больше. Разделите 12 на процент, умножьте на сто.', uz: "O'ylang: foiz kichikroq bo'lsa butun kattaroq. 12 ni foizga bo'ling, yuzga ko'paytiring." },
    correct_text: { ru: 'Верно! Одна и та же часть 12 при разном проценте даёт разное целое.', uz: "To'g'ri! Bir xil qism 12 turli foizda turli butun beradi." },
    audio: {
      intro: { ru: "Часть всюду двенадцать, но процент разный. Поставьте каждое в группу: целое шестьдесят и меньше, или больше шестидесяти. Чем меньше процент, тем больше целое.", uz: "Qism hamma joyda o'n ikki, lekin foiz har xil. Har birini guruhga joylang: butun oltmish va undan kichik, yoki oltmishdan katta. Foiz qancha kichik bo'lsa, butun shuncha katta." },
      on_correct: { ru: "Верно. Одна и та же часть при разном проценте даёт разное целое.", uz: "To'g'ri. Bir xil qism turli foizda turli butun beradi." },
      on_wrong: { ru: "При меньшем проценте целое больше. Разделите часть на процент, умножьте на сто.", uz: "Foiz kichikroq bo'lsa butun kattaroq. Qismni foizga bo'ling, yuzga ko'paytiring." }
    }
  },

  // ===== s9 TEST MC (xatoni top) — teskari hisob xatosi [FAKT per cento] =====
  s9: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где целое найдено неверно?', uz: "Qaysi butun noto'g'ri topilgan?" },
    question: { ru: 'В одном примере целое найдено неправильно. В каком?', uz: "Bitta misolda butun noto'g'ri topilgan. Qaysi birida?" },
    opt0: { ru: '10% = 8 → целое 80', uz: "10% = 8 → butun 80" },
    opt1: { ru: '25% = 6 → целое 24', uz: "25% = 6 → butun 24" },
    opt2: { ru: '20% = 9 → целое 18', uz: "20% = 9 → butun 18" },
    opt3: { ru: '50% = 8 → целое 16', uz: "50% = 8 → butun 16" },
    correct_text: { ru: 'Верно! 9 делим на 20 = 0,45, умножаем на 100 = 45, а не 18.', uz: "To'g'ri! 9 ni 20 ga bo'lamiz = 0,45, yuzga ko'paytiramiz = 45, 18 emas." },
    wrong_0: { ru: 'Здесь верно: 8 делим на 10, умножаем на сто, выходит восемьдесят.', uz: "Bu yerda to'g'ri: 8 ni 10 ga bo'lib, yuzga ko'paytiramiz, sakson chiqadi." },
    wrong_1: { ru: 'Здесь верно: 6 делим на 25, умножаем на сто, выходит двадцать четыре.', uz: "Bu yerda to'g'ri: 6 ni 25 ga bo'lib, yuzga ko'paytiramiz, yigirma to'rt chiqadi." },
    wrong_3: { ru: 'Здесь верно: половина равна восьми, целое шестнадцать.', uz: "Bu yerda to'g'ri: yarmi sakkizga teng, butun o'n olti." },
    wrong_default: { ru: 'Посчитайте каждый: часть делим на процент, умножаем на сто.', uz: "Har birini hisoblang: qismni foizga bo'lib, yuzga ko'paytiramiz." },
    fact: { ru: 'Знак процента вырос из итальянского «per cento» — «из ста». Поэтому процент всегда означает долю от ста.', uz: "Foiz belgisi italyancha «per cento» — «yuzdan» — yozuvidan o'sib chiqqan. Shuning uchun foiz doim yuzdan ulushni bildiradi." },
    fact_audio: { ru: "Знак процента вырос из итальянского пер ченто, что значит из ста. Поэтому процент всегда означает долю от ста.", uz: "Foiz belgisi italyancha per cento, ya'ni yuzdan, degan yozuvdan o'sib chiqqan. Shuning uchun foiz doim yuzdan ulushni bildiradi." },
    audio: {
      intro: { ru: "В одном из этих примеров целое найдено неправильно. Найдите, где обратный счёт сделан с ошибкой.", uz: "Bu misollardan birida butun noto'g'ri topilgan. Teskari hisob xato qilingan joyni toping." },
      on_correct: { ru: "Верно. Девять делим на двадцать, получается ноль целых сорок пять сотых, умножаем на сто, выходит сорок пять, а не восемнадцать.", uz: "To'g'ri. To'qqizni yigirmaga bo'lamiz, nol butun yuzdan qirq besh chiqadi, yuzga ko'paytiramiz, qirq besh bo'ladi, o'n sakkiz emas." },
      on_wrong: { ru: "Посчитайте каждый: разделите часть на процент и умножьте на сто.", uz: "Har birini hisoblang: qismni foizga bo'ling va yuzga ko'paytiring." }
    }
  },

  // ===== s10 CASE setup + FINAL (birlashgan) — Iroda so'rovnoma 30% = 18 -> 60 [FAKT chegirma] =====
  s10: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Опрос в классе Ироды', uz: "Iroda sinfidagi so'rovnoma" },
    bridge: { ru: 'Карта собрана. Теперь применим навык в жизни.', uz: "Xarita yig'ildi. Endi ko'nikmani hayotda qo'llaymiz." },
    lead: { ru: 'Ирода провела опрос. «Да» ответили 30 процентов класса, и это 18 учеников.', uz: "Iroda so'rovnoma o'tkazdi. Sinfning 30 foizi «ha» dedi, va bu 18 o'quvchi." },
    note: { ru: 'Сколько всего учеников в классе?', uz: "Sinfda jami nechta o'quvchi bor?" },
    hint_calc: { ru: '18 это только «да». Разделите 18 на 30, потом умножьте на сто.', uz: "18, bu faqat «ha» deganlar. 18 ni 30 ga bo'ling, keyin yuzga ko'paytiring." },
    compact: { ru: '«Да» = 30% · это 18 учеников', uz: "«Ha» = 30% · bu 18 o'quvchi" },
    btn_help: { ru: 'Помочь Ироде', uz: "Irodaga yordam berish" },
    question: { ru: 'Сколько всего учеников в классе?', uz: "Sinfda jami nechta o'quvchi?" },
    opt0: { ru: '60', uz: '60' },
    opt1: { ru: '18', uz: '18' },
    opt2: { ru: '48', uz: '48' },
    opt3: { ru: '600', uz: '600' },
    correct_text: { ru: 'Верно: 18 делим на 30 = 0,6, умножаем на 100 = 60 учеников.', uz: "To'g'ri: 18 ni 30 ga bo'lamiz = 0,6, yuzga ko'paytiramiz = 60 o'quvchi." },
    wrong_1: { ru: 'Это только ответившие да, а нужен весь класс. Целое больше части.', uz: "Bu faqat ha deganlar, butun sinf kerak. Butun qismdan katta." },
    wrong_2: { ru: 'Вы сложили часть и процент. Разделите часть на процент, умножьте на сто.', uz: "Siz qism va foizni qo'shdingiz. Qismni foizga bo'ling, yuzga ko'paytiring." },
    wrong_3: { ru: 'Слишком много. Разделите часть на процент, потом умножьте на сто.', uz: "Juda ko'p. Qismni foizga bo'ling, keyin yuzga ko'paytiring." },
    fact: { ru: 'В магазине по цене со скидкой и проценту скидки обратным счётом находят первоначальную цену.', uz: "Do'konda chegirmali narx va chegirma foizi bo'yicha teskari hisob bilan dastlabki narxni topishadi." },
    fact_audio: { ru: "В магазине по цене со скидкой и проценту скидки обратным счётом находят первоначальную цену.", uz: "Do'konda chegirmali narx va chegirma foizi bo'yicha teskari hisob bilan dastlabki narxni topishadi." },
    audio: {
      intro: { ru: "Карта собрана, теперь навык в жизни. Ирода провела опрос. Тридцать процентов класса ответили да, и это восемнадцать учеников. Восемнадцать, это только ответившие да, а не весь класс. Нажмите решить.", uz: "Xarita yig'ildi, endi ko'nikma hayotda. Iroda so'rovnoma o'tkazdi. Sinfning o'ttiz foizi ha dedi, va bu o'n sakkiz o'quvchi. O'n sakkiz, bu faqat ha deganlar, butun sinf emas. Yechishni bosing." },
      intro2: { ru: "Сколько всего учеников в классе?", uz: "Sinfda jami nechta o'quvchi bor?" },
      on_correct: { ru: "Верно, шестьдесят. Восемнадцать делим на тридцать, умножаем на сто.", uz: "To'g'ri, oltmish. O'n sakkizni o'ttizga bo'lamiz, yuzga ko'paytiramiz." },
      on_wrong: { ru: "Восемнадцать это часть. Разделите часть на процент, умножьте на сто.", uz: "O'n sakkiz, bu qism. Qismni foizga bo'ling, yuzga ko'paytiring." }
    }
  },

  // ===== s11 SUMMARY =====
  s11: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'По части — найти целое', uz: "Qism bo'yicha butunni topish" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Делим часть на её процент — получаем один процент.', uz: "Qismni uning foiziga bo'lamiz — bir foizni olamiz." },
    main_2: { ru: 'Умножаем один процент на сто — получаем целое.', uz: "Bir foizni yuzga ko'paytiramiz — butunni olamiz." },
    main_3: { ru: 'Одна и та же часть при разном проценте даёт разное целое.', uz: "Bir xil qism turli foizda turli butun beradi." },
    hook_close: { ru: 'Вот и ответ Ойбеку: 20% = 10 клеток, значит вся карта — 50 клеток.', uz: "Mana Oybekka javob: 20% = 10 katak, demak butun xarita — 50 katak." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Процент как доля от ста (Урок 30) и нахождение процента от числа (Урок 31).', uz: "Foiz yuzdan ulush sifatida (30-dars) va sonning foizini topish (31-dars)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Задачи на проценты в жизни.', uz: "Hayotdagi foiz masalalari." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, чтобы найти целое: делим часть на её процент, получаем один процент, и умножаем на сто. И помним: одна и та же часть при разном проценте даёт разное целое.", uz: "Demak, butunni topish uchun: qismni uning foiziga bo'lib, bir foizni olamiz, va yuzga ko'paytiramiz. Va yodda tutamiz: bir xil qism turli foizda turli butun beradi." }
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

// Dekorativ suzuvchi birlik kvadratchalar (qism mavzusi, sekin, yengil) — uzluksiz loop.
const FloatTiles = () => (
  <div className="flt" aria-hidden="true">
    <span className="flt-c flt-1"/><span className="flt-c flt-2"/><span className="flt-c flt-3"/>
    <span className="flt-c flt-4"/><span className="flt-c flt-5"/><span className="flt-c flt-6"/>
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_STAT = { ru: 'Знаешь ли ты? · Статистика', uz: "Bilasizmi? · Statistika" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',     uz: "Bilasizmi? · Tarix" };
const FB_LIFE = { ru: 'Полезно знать · Жизнь',       uz: "Bilib qo'ying · Hayot" };

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
// Statistika: ovoz ustunlari to'lqinli yorishadi (saylov/so'rovnoma).
const AnimVotes = () => (
  <div className="pa-votes" aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => <span key={i} className="pa-votes-b" style={{ animationDelay: `${i * 0.18}s` }}/>)}
  </div>
);
// Tarix: foiz belgisi (per cento) yengil pulse bilan.
const AnimPercent = () => (
  <div className="pa-pct" aria-hidden="true"><span className="pa-pct-s">%</span></div>
);
// Hayot: narx tegi — chegirma ko'rsatkichi to'lqinli yonadi.
const AnimTag = () => (
  <div className="pa-tag" aria-hidden="true"><span className="pa-tag-dot"/><span className="pa-tag-body"/></div>
);

// ============================================================
// VIZUALIZATOR — TileGrid (Dars35 uzluksiz tgBreathe loop) + PartWholeBar (qism->butun yig'iladi) + DecInputScreen
// Hech bir figura prop-gated yoki one-shot animatsiyaga TAYANMAYDI — har biriga uzluksiz "nafas" (infinite).
// ============================================================
const fmtNum = (v) => { const r = Math.round(v * 100) / 100; return String(r).replace('.', ','); };

// TileGrid — to'rtburchak birlik kvadratlar bilan to'ladi (Dars35 dan). Uzluksiz tgBreathe; circling YO'Q.
// filled = to'ldirilgan kataklar soni (null = hammasi). glow/stagger/success — breathe DOIM saqlanadi.
const TileGrid = ({ cols = 5, rows = 2, filled = null, compact = false, glow = false, stagger = false, success = false }) => {
  const total = cols * rows;
  const fill = filled === null ? total : filled;
  const big = Math.max(cols, rows);
  const cell = compact ? (big >= 8 ? 16 : 22) : (big >= 8 ? 24 : 32);
  return (
    <div className={`tg-host${glow ? ' tg-glow' : ''}${success ? ' tg-ok' : ''}`} aria-hidden="true">
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

// PartWholeBar — qism (apelsin segment) butunni (kulrang track) to'ldirishi step bilan ko'rsatiladi.
// Root .pwb-track DOIM uzluksiz pwbBreathe loop; solved/glow holatda glow QO'SHILADI, breathe DROP QILINMAYDI.
// step 0: faqat berilgan qism segment. step >=2: butun to'ladi (yashil) + kichik kapsiya.
const PartWholeBar = ({ part, percent, whole, step = 2, glow = false }) => {
  const segCount = Math.round(100 / percent);                 // butunda nechta shunday qism (masalan 100/20 = 5)
  const show = step >= 2 ? segCount : 1;                       // step<2: faqat berilgan qism; step>=2: butun
  const filledColor = step >= 2 ? T.success : T.accent;
  return (
    <div className="pwb-wrap">
      <div className={`pwb-track${glow || step >= 2 ? ' pwb-glow' : ''}`}>
        {Array.from({ length: segCount }).map((_, i) => (
          <span key={i} className={`pwb-seg${i < show ? ' pwb-on' : ''}`} style={{ background: i < show ? filledColor : undefined, transitionDelay: `${i * 0.06}s` }}/>
        ))}
      </div>
      <div className="pwb-caps">
        <span className="pwb-cap"><span className="pwb-cap-k pwb-cap-part">{fmtNum(part)}</span> = {percent}%</span>
        {step >= 2 && <span className="pwb-cap"><span className="pwb-cap-k pwb-cap-whole">{fmtNum(whole)}</span> = 100%</span>}
      </div>
    </div>
  );
};

// DecInputScreen — o'nli/butun javob: вeди-до-верного + bardoshli tekshiruv (40 = 40; vergul ham qabul). type="number" YO'Q.
const DecInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, topNode, storedAnswer, onAnswer, onNext, onPrev }) => {
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
        {topNode}
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
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

// s0 — HOOK (M1: qism = butun). Qaytishda picked TO'LIQ sbros.
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
          <TileGrid cols={5} rows={2} filled={2} compact={true}/>
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

// s1 — WARM-UP: 3 ta tez prereq (tap)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;
// s7 — MASHQ: 3 ta oson teskari misol (tap, scored)
const Screen7 = (props) => <SeqMC {...props} screenContent={CONTENT.s7} scored={true}/>;

// s2 — EXPLORATION (20% = 10 -> 50, step, tiles assemble)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  // tile to'lishi: step 1 = 10 katak (qism), step 2 = 30, step 3 = 50 (butun). 10x5 setka, 50 katak.
  const fills = [10, 10, 30, 50];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <FloatTiles/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 184 }}>
          <TileGrid cols={10} rows={5} compact={true} filled={fills[step]} stagger={true} glow={step >= last} success={step >= last}/>
          {step >= 1 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_part))}</p>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.line_count))}</p>}
          {step >= 3 && <p className="dm-res fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.line_whole))}</p>}
        </div>
        {step >= last && <div className="frame-tip fade-up" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.line_key))}</p></div>}
      </div>
    </Stage>
  );
};

// s3 — RULE + M1/M2 birlashgan (progressiv: Qoida -> chip -> Ogohlantirish). Scrollsiz.
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio([
    { id: 'rule_a0', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'more' } }
  ]);
  const [phase, setPhase] = useState(0);          // 0 = qoida, 1 = M1/M2 ogohlantirish
  const rules = [c.rule_1, c.rule_2, c.rule_3];
  const reveal = () => { setPhase(1); };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={lang === 'uz' ? "Davom etish" : 'Дальше'}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <FloatTiles/>
        {phase === 0 ? (
          <>
            <Bridge node={c.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
              <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
              </div>
            </div>
            <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 18px)' }}>
              <div style={{ flexShrink: 0 }}><TileGrid cols={5} rows={2} compact={true} glow={true} success={true}/></div>
              <div>
                <p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.ex_label)}</p>
                <p className="body" style={{ margin: 0 }}>{mt(t(c.ex_caption))}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="rule-chip fade-up" onClick={() => setPhase(0)} style={{ position: 'relative' }}>
              <span className="rule-chip-ic" aria-hidden="true"><IconOk/></span>
              <span className="rule-chip-tx">{mt(t(c.heading))}</span>
              <span className="rule-chip-act">{lang === 'uz' ? "ko'rish" : 'показать'}</span>
            </button>
            <h2 className="title h-title fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c.warn_label))}</h2>
            <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn_1))}</p>
            </div>
            <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
              <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn_2))}</p>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s4 — ISHLANGAN MISOL + MASHQ (scored): yuqorida 30%=15->50 statik bar; pastda 40%=20->50 DecInput
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const topNode = (
    <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.we_label)}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}><PartWholeBar part={15} percent={30} whole={50} step={2}/></div>
      <p className="small" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.we_caption))}</p>
    </div>
  );
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={50} topNode={topNode}
    renderVisual={({ solved }) => <PartWholeBar part={20} percent={40} whole={50} step={solved ? 2 : 0} glow={solved}/>}/>;
};

// s5 — TEST MC: 30% = 60 -> 200 [FAKT saylov]
const Screen5 = (props) => {
  const t = useT(); const c = CONTENT.s5;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);   // to'g'ri -> B
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}
    figure={(solved) => <PartWholeBar part={60} percent={30} whole={200} step={solved ? 2 : 0} glow={solved}/>}
    factOnCorrect={<FactCard text={c.fact} badge={FB_STAT} anim={<AnimVotes/>}/>}/>;
};

// s6 — TEST DecInput: 50% = 35 -> 70
const Screen6 = (props) => {
  const c = CONTENT.s6;
  return <DecInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={c} correctValue={70}
    renderVisual={({ solved }) => <PartWholeBar part={35} percent={50} whole={70} step={solved ? 2 : 0} glow={solved}/>}/>;
};

// s8 — TEST tasniflash (M2): bir xil qism 12, foiz boshqa -> butun boshqa. Tartib RANDOM (Fisher-Yates).
const S8_CARDS = [
  { label: '12 = 20%', bin: 'sq' },   // butun 60 -> 60 va undan kichik
  { label: '12 = 30%', bin: 'sq' },   // butun 40
  { label: '12 = 40%', bin: 'sq' },   // butun 30
  { label: '12 = 25%', bin: 'sq' },   // butun 48
  { label: '12 = 10%', bin: 'cu' },   // butun 120 -> 60 dan katta
  { label: '12 = 5%',  bin: 'cu' },   // butun 240
  { label: '12 = 15%', bin: 'cu' },   // butun 80
  { label: '12 = 8%',  bin: 'cu' }    // butun 150
];
const SORT_BINS = [{ key: 'sq', dir: 'down' }, { key: 'cu', dir: 'up' }];
const SortChevron = ({ dir }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {dir === 'down' ? <polyline points="6 9 12 15 18 9"/> : <polyline points="6 15 12 9 18 15"/>}
  </svg>
);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const [deck] = useState(() => { const a = S8_CARDS.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; });
  const n = deck.length;
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
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
            : <><span className="sort-tray-card" key={idx}>{cur.label}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {SORT_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h"><SortChevron dir={b.dir}/>{b.key === 'sq' ? mt(t(c.bin_sq)) : mt(t(c.bin_cu))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{deck[i].label}</span>)}
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

// s9 — TEST MC (xatoni top) [FAKT per cento]
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 2, 3]);   // to'g'ri -> C
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPercent/>}/>}/>;
};

// s10 — CASE setup + FINAL birlashgan (progressiv: shart -> ixcham kontekst KO'RINIB qoladi + MC ochiladi). Scored: final.
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 0, 1, 2]);   // to'g'ri -> B
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
              <PartWholeBar part={18} percent={30} whole={60} step={0}/>
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
            {solved && <FactCard text={c.fact} badge={FB_LIFE} anim={<AnimTag/>}/>}
          </>
        )}
      </div>
    </Stage>
  );
};

// s11 — SUMMARY
const Screen11 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
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

export default function NumberByPercentLesson({
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

  const screens = [Screen0, Screen1, Screen2, ScreenRule, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, ScreenCase, Screen11];
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

/* ============================================================ */
/* MATH percent_5_03: figuralar — TileGrid (uzluksiz tgBreathe) + PartWholeBar (pwbBreathe) + fakt-anim. */
/* HAR figura ildizida infinite nafas loop; solved/glow holatda glow QO'SHILADI, nafas DROP QILINMAYDI. */
/* ============================================================ */

/* TileGrid (Dars35) — birlik kvadratlar bilan to'ldirish (CSS pop + uzluksiz breathe loop; circling YO'Q). */
.tg-host { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: clamp(8px, 1.8vw, 14px); }
.tg-grid { display: grid; gap: 2px; background: #A7A6A2; padding: 2px; border-radius: 4px; animation: tgBreathe 3.6s ease-in-out infinite; }
.tg-glow .tg-grid { animation: tgGlow 0.9s ease, tgBreathe 3.6s ease-in-out infinite; }
.tg-cell { background: #FFFFFF; border-radius: 2px; transition: background 0.3s ease, box-shadow 0.3s ease; }
.tg-on { background: #FF4F28; box-shadow: 0 0 6px rgba(255, 79, 40, 0.45); animation: tgPop 0.3s ease both; }
.tg-pop { transform-origin: center; animation: tgPop 0.4s ease-out both; }
.tg-ok .tg-on { background: #1F7A4D; box-shadow: 0 0 6px rgba(31, 122, 77, 0.45); }
@keyframes tgPop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes tgBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 12px rgba(255, 79, 40, 0.14); } }
@keyframes tgGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 14px rgba(255, 79, 40, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }

/* PartWholeBar — qism->butun segmentli ko'rsatkich. Ildiz .pwb-track DOIM uzluksiz pwbBreathe loop. */
.pwb-wrap { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 440px; margin: 0 auto; align-items: center; }
.pwb-track { display: flex; gap: 3px; width: 100%; padding: 6px; background: rgba(58, 53, 48, 0.08); border-radius: 12px; animation: pwbBreathe 3.6s ease-in-out infinite; }
.pwb-track.pwb-glow { animation: pwbGlow 0.9s ease, pwbBreathe 3.6s ease-in-out infinite; }
.pwb-seg { flex: 1; height: clamp(28px, 6vw, 40px); background: #E4E1DA; border-radius: 7px; transition: background 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.pwb-seg.pwb-on { box-shadow: 0 0 8px rgba(31, 122, 77, 0.25); }
@keyframes pwbBreathe { 0%, 100% { box-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: 0 0 12px rgba(255, 79, 40, 0.14); } }
@keyframes pwbGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 14px rgba(31, 122, 77, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }
.pwb-caps { display: flex; gap: clamp(14px, 4vw, 28px); flex-wrap: wrap; justify-content: center; }
.pwb-cap { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: clamp(13px, 2vw, 16px); color: #5A5A60; }
.pwb-cap-k { font-weight: 800; }
.pwb-cap-part { color: #FF4F28; }
.pwb-cap-whole { color: #1F7A4D; }

/* Fakt-animatsiyalar (ko'k tema, qutiga sig'adi, uzluksiz loop). */
/* Statistika: ovoz ustunlari to'lqinli yorishadi. */
.pa-votes { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.pa-votes-b { width: 9px; background: #019ACB; opacity: 0.3; border-radius: 3px; animation: paVotes 1.9s ease-in-out infinite; }
.pa-votes-b:nth-child(1) { height: 45%; }
.pa-votes-b:nth-child(2) { height: 72%; }
.pa-votes-b:nth-child(3) { height: 100%; }
.pa-votes-b:nth-child(4) { height: 62%; }
.pa-votes-b:nth-child(5) { height: 84%; }
@keyframes paVotes { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }
/* Tarix: foiz belgisi (per cento) yengil pulse. */
.pa-pct { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.pa-pct-s { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(40px, 10vw, 62px); color: #019ACB; animation: paPct 2.6s ease-in-out infinite; }
@keyframes paPct { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.12); opacity: 1; } }
/* Hayot: narx tegi — chegirma ko'rsatkichi to'lqinli yonadi. */
.pa-tag { position: relative; width: clamp(64px, 13vw, 90px); height: clamp(48px, 10vw, 64px); }
.pa-tag-body { position: absolute; inset: 0; background: rgba(1, 154, 203, 0.12); border: 3px solid #019ACB; border-radius: 8px; animation: paTag 2.4s ease-in-out infinite; }
.pa-tag-dot { position: absolute; top: 22%; left: 16%; width: 9px; height: 9px; border-radius: 50%; background: #019ACB; z-index: 2; }
@keyframes paTag { 0%, 100% { box-shadow: inset 0 0 0 rgba(1, 154, 203, 0); } 50% { box-shadow: inset 0 0 16px rgba(1, 154, 203, 0.45); } }

/* flt — dekorativ suzuvchi birlik kvadratchalar (qism mavzusi, sekin, yengil, uzluksiz). */
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
