import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сложение дробей с разными знаменателями — frac_5_06 (Dars16)
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect }) => {
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
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
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
    const v = parseInt(value, 10); if (isNaN(v)) return;
    const isCorrect = v === correct;
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
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// --- ПОД УРОК: frac_5_10 — Вычитание дробей с равными знаменателями ---
// Визуализатор BackLine: числовая прямая 0..1, маркер прыгает ВЛЕВО (вычитание = шаг назад).
// Анимации: убираемые сегменты гаснут + перечёркиваются, обратный слайд маркера, count-down spin счётчика.
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-06-v2',
  lessonTitle: { ru: 'Сложение дробей с разными знаменателями', uz: "Har xil maxrajli kasrlarni qo'shish" }
};
const TOTAL_SCREENS = 13;

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's10', type: 'case',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // s0 — HOOK (konseptual): nega 1/2 va 1/3 ni darrov qo'shib bo'lmaydi?
  s0: {
    eyebrow: { ru: 'Вопрос', uz: "Savol" },
    lead: { ru: 'Один ученик сложил так: 1/2 + 1/3 = 2/5.', uz: "Bir o'quvchi shunday qo'shdi: 1/2 + 1/3 = 2/5." },
    question: { ru: 'Половина — это уже больше, чем 2/5. Почему так сложить нельзя?', uz: "Yarim — bu 2/5 dan ko'p. Nega bunday qo'shib bo'lmaydi?" },
    opt0: { ru: 'Доли разного размера', uz: "Bo'laklar har xil o'lchamda" },
    opt1: { ru: 'Так складывать можно', uz: "Bunday qo'shsa bo'ladi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Один ученик сложил две дроби так: одна вторая плюс одна третья равно две пятых. Но половина это уже больше, чем две пятых, значит ответ стал меньше, хотя мы складывали. Почему так складывать нельзя? Подумай и выбери ответ.', uz: "Bir o'quvchi ikki kasrni shunday qo'shdi: ikkidan bir plyus uchdan bir teng beshdan ikki. Lekin yarim beshdan ikkidan ko'p, demak qo'shgan bo'lsak ham javob kichrayib qoldi. Nega bunday qo'shib bo'lmaydi? O'ylab, javobni tanlang." }
  },

  // s1 — EXPLORATION (step): bo'laklar har xil o'lchamda
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Половина и треть — доли разного размера', uz: "Yarim va uchdan bir — har xil o'lchamdagi ulushlar" },
    conclusion: { ru: 'Доли разного размера. Чтобы сложить, сначала сделаем их одинаковыми — найдём общий знаменатель.', uz: "Ulushlar har xil o'lchamda. Qo'shish uchun avval ularni bir xil qilamiz — umumiy maxraj topamiz." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Как сделать доли одинаковыми?', uz: "Ulushlarni qanday bir xil qilamiz?" },
    audio: {
      ru: [
        'Сравним половину и треть. Нажимай кнопку дальше.',
        'Половина — это одна доля из двух. Она большая.',
        'Треть — это одна доля из трёх. Она меньше половины.',
        'Доли разного размера, поэтому просто сложить их количество нельзя. Сначала сделаем доли одинаковыми.'
      ],
      uz: [
        "Yarim bilan uchdan birni solishtiramiz. Davom etish tugmasini bosing.",
        "Yarim — bu ikkidan bir ulush. U katta.",
        "Uchdan bir — bu uchdan bir ulush. U yarimdan kichik.",
        "Ulushlar har xil o'lchamda, shuning uchun shunchaki sonini qo'shib bo'lmaydi. Avval ulushlarni bir xil qilamiz."
      ]
    }
  },

  // s2 — EXPLORATION (g'ildiraklar): umumiy karra = 6
  s2: {
    eyebrow: { ru: 'Поиграй', uz: "O'ynab ko'ring" },
    title: { ru: 'Где встретятся шестерёнки? Это и есть общий знаменатель.', uz: "Tishli g'ildiraklar qayerda uchrashadi? Bu — umumiy maxraj." },
    note_hit: { ru: 'Совпало! Обе вернулись в начало через 6 — общий знаменатель 6.', uz: "Mos keldi! Ikkalasi 6 dan keyin boshiga qaytdi — umumiy maxraj 6." },
    note_miss: { ru: 'Ещё не совпало. Крути дальше.', uz: "Hali mos kelmadi. Aylantiring." },
    conclusion: { ru: 'Шестерёнка на 2 и на 3 встречаются на 6. 6 делится и на 2, и на 3 — это наименьший общий знаменатель.', uz: "2 tishli va 3 tishli g'ildirak 6 da uchrashadi. 6 ham 2 ga, ham 3 ga bo'linadi — bu eng kichik umumiy maxraj." },
    btn: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: { ru: 'Крути шестерёнки. Одна делится на два, другая на три. Считай, через сколько шагов обе разом вернутся в начало. Это число делится и на два, и на три — шесть. Шесть и будет общим знаменателем.', uz: "G'ildiraklarni aylantiring. Biri ikkiga, ikkinchisi uchga bo'lingan. Necha qadamdan keyin ikkalasi birga boshiga qaytishini sanang. Bu son ham ikkiga, ham uchga bo'linadi — olti. Olti umumiy maxraj bo'ladi." }
  },

  // s3 — EXPLORATION/RULE: qayta bo'lish (1/2=3/6, 1/3=2/6)
  s3: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Приводим обе дроби к шестым', uz: "Ikkala kasrni oltilarga keltiramiz" },
    conclusion: { ru: '1/2 = 3/6, 1/3 = 2/6. Теперь доли одинаковые — шестые.', uz: "1/2 = 3/6, 1/3 = 2/6. Endi ulushlar bir xil — oltidan." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        'Делим каждую полосу на шесть равных долей. Нажимай дальше.',
        'Половина — это три доли из шести. Значит одна вторая равна три шестых.',
        'Треть — это две доли из шести. Значит одна третья равна две шестых. Теперь обе дроби в шестых.'
      ],
      uz: [
        "Har bir chiziqni olti teng ulushga bo'lamiz. Davom etishni bosing.",
        "Yarim — bu oltidan uch ulush. Demak ikkidan bir teng oltidan uch.",
        "Uchdan bir — bu oltidan ikki ulush. Demak uchdan bir teng oltidan ikki. Endi ikkala kasr oltidan."
      ]
    }
  },

  // s4 — RULE: suratlarni qo'shamiz, maxraj qoladi + algoritm
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Как сложить — 3 шага', uz: "Qanday qo'shamiz — 3 qadam" },
    title: { ru: 'Привели к общему знаменателю — складываем числители.', uz: "Umumiy maxrajga keltirdik — suratlarni qo'shamiz." },
    step1: { ru: 'Найди общий знаменатель (наименьший).', uz: "Umumiy maxrajni toping (eng kichik)." },
    step2: { ru: 'Приведи обе дроби к нему: 1/2 = 3/6, 1/3 = 2/6.', uz: "Ikkala kasrni unga keltiring: 1/2 = 3/6, 1/3 = 2/6." },
    step3: { ru: 'Сложи числители, знаменатель оставь: 3/6 + 2/6 = 5/6.', uz: "Suratlarni qo'shing, maxrajni qoldiring: 3/6 + 2/6 = 5/6." },
    card_line: { ru: '1/2 + 1/3 = 5/6. Не 2/5 и не 5/12!', uz: "1/2 + 1/3 = 5/6. 2/5 ham, 5/12 ham emas!" },
    audio: { ru: 'Запомни три шага. Первый: найди общий знаменатель, для двух и трёх это шесть. Второй: приведи обе дроби к шестым, одна вторая это три шестых, одна третья это две шестых. Третий: сложи числители, а знаменатель оставь. Три шестых плюс две шестых равно пять шестых.', uz: "Uch qadamni eslab qoling. Birinchi: umumiy maxrajni toping, ikki va uch uchun bu olti. Ikkinchi: ikkala kasrni oltilarga keltiring, ikkidan bir bu oltidan uch, uchdan bir bu oltidan ikki. Uchinchi: suratlarni qo'shing, maxrajni qoldiring. Oltidan uch plyus oltidan ikki teng oltidan besh." }
  },

  // s5 — TEST MC p1: umumiy maxraj 1/4 va 1/6 -> 12 (fakt: g'ildiraklar)
  s5: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Найди общий знаменатель', uz: "Umumiy maxrajni toping" },
    question: { ru: 'Общий знаменатель для 1/4 и 1/6?', uz: "1/4 va 1/6 uchun umumiy maxraj?" },
    correct_text: { ru: 'Правильно. 12 делится и на 4, и на 6, и это наименьшее.', uz: "To'g'ri. 12 ham 4 ga, ham 6 ga bo'linadi, va eng kichigi." },
    wrong_1: { ru: 'Это сумма 4 + 6 = 10. Но 10 не делится на 4. Нужно число, которое делится на оба.', uz: "Bu 4 + 6 = 10 yig'indisi. Lekin 10 ni 4 ga bo'lib bo'lmaydi. Ikkalasiga bo'linadigan son kerak." },
    wrong_2: { ru: 'Произведение 4 × 6 = 24 подходит, но не наименьшее. 12 экономнее.', uz: "Ko'paytma 4 × 6 = 24 mos keladi, lekin eng kichik emas. 12 tejamliroq." },
    wrong_3: { ru: 'Это общий делитель 2, а нужно число, которое делится на 4 и 6.', uz: "Bu umumiy bo'luvchi 2, lekin 4 ga ham, 6 ga ham bo'linadigan son kerak." },
    wrong_default: { ru: 'Нужно наименьшее число, делящееся на 4 и 6. Это 12.', uz: "4 ga ham, 6 ga ham bo'linadigan eng kichik son. Bu 12." },
    fact: { ru: 'В механизмах число зубьев у шестерёнок подбирают по общему кратному — иначе они не совпадут.', uz: "Mexanizmlarda g'ildiraklar tish soni umumiy karra bo'yicha tanlanadi — aks holda ular mos kelmaydi." },
    audio: {
      intro: { ru: 'Найди общий знаменатель для одной четвёртой и одной шестой. Выбери ответ.', uz: "Bir to'rtdan va bir oltidan uchun umumiy maxrajni toping. Javobni tanlang." },
      on_correct: { ru: 'Верно. Двенадцать делится и на четыре, и на шесть. Кстати, у шестерёнок число зубьев тоже подбирают по общему кратному.', uz: "To'g'ri. O'n ikki ham to'rtga, ham oltiga bo'linadi. Aytgancha, g'ildiraklar tishi ham umumiy karra bo'yicha tanlanadi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s6 — TEST NumInput p2: umumiy maxraj 1/2 va 1/5 -> 10
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Наименьший общий знаменатель для 1/2 + 1/5. Введи число.', uz: "1/2 + 1/5 uchun eng kichik umumiy maxraj. Sonni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Наименьшее число, делящееся и на 2, и на 5. Не сумма и не больше нужного.', uz: "Ham 2 ga, ham 5 ga bo'linadigan eng kichik son. Yig'indi ham, ortiqcha ham emas." },
    fb_correct: { ru: 'Верно. 10 делится и на 2, и на 5, и это наименьшее.', uz: "To'g'ri. 10 ham 2 ga, ham 5 ga bo'linadi, va eng kichigi." },
    audio: {
      intro: { ru: 'Найди наименьший общий знаменатель для одной второй и одной пятой. Введи число и нажми проверить.', uz: "Bir ikkidan va bir beshdan uchun eng kichik umumiy maxrajni toping. Sonni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Десять делится и на два, и на пять.', uz: "To'g'ri. O'n ham ikkiga, ham beshga bo'linadi." },
      on_wrong: { ru: 'Не совсем. Это не сумма знаменателей. Ищи наименьшее общее.', uz: "Unchalik emas. Bu maxrajlar yig'indisi emas. Eng kichik umumiy sonni qidiring." }
    }
  },

  // s7 — TEST "xatoni top" p3
  s7: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    label: { ru: 'Какое сложение НЕВЕРНО?', uz: "Qaysi qo'shish NOTO'G'RI?" },
    question: { ru: 'Выбери запись, где допущена ошибка.', uz: "Xato qilingan yozuvni tanlang." },
    correct_text: { ru: 'Верно — ошибка здесь. Сложили числители и знаменатели. Нужно привести к общему: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.', uz: "To'g'ri — xato shu yerda. Surat va maxraj qo'shilgan. Umumiy maxrajga keltirish kerak: 1/2 + 1/3 = 3/6 + 2/6 = 5/6." },
    wrong_1: { ru: 'Эта запись верна: привели к шестым, 3/6 + 2/6 = 5/6. Ищи, где сложили знаменатели.', uz: "Bu yozuv to'g'ri: oltilarga keltirildi, 3/6 + 2/6 = 5/6. Maxraj qo'shilgan joyni qidiring." },
    wrong_2: { ru: 'Эта запись верна: 1/4 + 1/4 = 2/4, знаменатели одинаковые. Ошибка в другом.', uz: "Bu yozuv to'g'ri: 1/4 + 1/4 = 2/4, maxrajlar bir xil. Xato boshqasida." },
    wrong_3: { ru: 'Эта запись верна: привели к 12, 4/12 + 3/12 = 7/12. Ищи, где знаменатели сложили.', uz: "Bu yozuv to'g'ri: 12 ga keltirildi, 4/12 + 3/12 = 7/12. Maxraj qo'shilgan joyni qidiring." },
    wrong_default: { ru: 'Ошибка там, где сложили и знаменатели вместо приведения.', uz: "Xato keltirish o'rniga maxraj ham qo'shilgan joyda." },
    audio: {
      intro: { ru: 'Внимание: найди запись, где допущена ошибка. Не где верно, а где неверно. Выбери ответ.', uz: "Diqqat: xato qilingan yozuvni toping. To'g'risini emas, noto'g'risini. Javobni tanlang." },
      on_correct: { ru: 'Верно. В том варианте сложили знаменатели — так нельзя.', uz: "To'g'ri. O'sha variantda maxraj qo'shilgan — bunday bo'lmaydi." },
      on_wrong: { ru: 'Это верная запись. Ищи, где сложили знаменатели.', uz: "Bu to'g'ri yozuv. Maxraj qo'shilganini qidiring." }
    }
  },

  // s8 — TEST bosqichli yechim quruvchi p4: 1/2 + 1/3
  s8: {
    eyebrow: { ru: 'Собери решение', uz: "Yechimni quring" },
    title: { ru: 'Сложи 1/2 + 1/3 по шагам.', uz: "1/2 + 1/3 ni bosqichma-bosqich qo'shing." },
    q_step1: { ru: 'Шаг 1. Общий знаменатель?', uz: "1-qadam. Umumiy maxraj?" },
    q_step2: { ru: 'Шаг 2. Чему равна 1/2 в шестых?', uz: "2-qadam. 1/2 oltilarda nechaga teng?" },
    q_step3: { ru: 'Шаг 3. Сколько будет 3/6 + 2/6?', uz: "3-qadam. 3/6 + 2/6 nechaga teng?" },
    hint_step1: { ru: 'Число, которое делится и на 2, и на 3.', uz: "Ham 2 ga, ham 3 ga bo'linadigan son." },
    hint_step2: { ru: 'Умножь числитель и знаменатель 1/2 на 3.', uz: "1/2 ning surat va maxrajini 3 ga ko'paytiring." },
    hint_step3: { ru: 'Сложи числители, знаменатель оставь 6.', uz: "Suratlarni qo'shing, maxrajni 6 qoldiring." },
    fb_correct: { ru: 'Готово! 1/2 + 1/3 = 3/6 + 2/6 = 5/6.', uz: "Tayyor! 1/2 + 1/3 = 3/6 + 2/6 = 5/6." },
    audio: {
      intro: { ru: 'Собери решение по шагам. Сначала выбери общий знаменатель, потом приведи дробь, потом сложи. Отвечай на каждый шаг.', uz: "Yechimni bosqichma-bosqich quring. Avval umumiy maxrajni tanlang, keyin kasrni keltiring, keyin qo'shing. Har qadamga javob bering." },
      on_correct: { ru: 'Верно. Все три шага собраны: получилось пять шестых.', uz: "To'g'ri. Uchala qadam yig'ildi: oltidan besh chiqdi." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку к шагу.', uz: "Unchalik emas. Qadam maslahatiga qarang." }
    }
  },

  // s9 — CASE setup: Bahodir, o'yin yuklash 1/4 + 1/6
  s9: {
    eyebrow: { ru: 'Задача · загрузка', uz: "Masala · yuklash" },
    title: { ru: 'Баходир скачал игру в два захода.', uz: "Bahodir o'yinni ikki bosqichda yukladi." },
    body_p1: { ru: 'Сначала загрузилось 1/4 игры, потом ещё 1/6. Сколько загрузилось всего?', uz: "Avval o'yinning 1/4 qismi, keyin yana 1/6 qismi yuklandi. Jami qancha yuklandi?" },
    card_line_label: { ru: 'Сначала', uz: "Avval" },
    card_line_value: { ru: '1/4 игры', uz: "o'yinning 1/4 qismi" },
    card_parts_label: { ru: 'Потом', uz: "Keyin" },
    card_parts_value: { ru: 'ещё 1/6', uz: "yana 1/6" },
    outro: { ru: 'Знаменатели разные — 4 и 6. Сначала найди общий знаменатель.', uz: "Maxrajlar har xil — 4 va 6. Avval umumiy maxrajni toping." },
    btn_help: { ru: 'Помочь Баходиру', uz: "Bahodirga yordam berish" },
    audio: { ru: 'Баходир скачал игру в два захода. Сначала загрузилось одна четвёртая игры, потом ещё одна шестая. Сколько загрузилось всего? Знаменатели разные, четыре и шесть. Сначала найдём общий знаменатель. Помоги на следующем шаге.', uz: "Bahodir o'yinni ikki bosqichda yukladi. Avval o'yinning to'rtdan biri, keyin yana oltidan biri yuklandi. Jami qancha yuklandi? Maxrajlar har xil, to'rt va olti. Avval umumiy maxrajni topamiz. Keyingi bosqichda yordam bering." }
  },

  // s10 — CASE drag p5: 1/4 va 1/6 ni 12 li to'rga keltirish (fakt: IT piksel)
  s10: {
    eyebrow: { ru: 'Задача · 1-й шаг', uz: "Masala · 1-qadam" },
    title: { ru: 'Сначала посчитай: сколько это в двенадцатых?', uz: "Avval hisoblang: bu o'n ikkilarda nechta?" },
    q_calc1: { ru: '1/4 = ?/12', uz: "1/4 = ?/12" },
    q_calc2: { ru: '1/6 = ?/12', uz: "1/6 = ?/12" },
    calc_hint: { ru: 'Раздели 12 на знаменатель: 12 ÷ 4 и 12 ÷ 6.', uz: "12 ni maxrajga bo'ling: 12 ni 4 ga va 12 ni 6 ga." },
    place_title: { ru: 'Теперь поставь столько клеток на сетку из 12.', uz: "Endi 12 li to'rga shuncha katak qo'ying." },
    place_hint: { ru: 'Ты нашёл: 1/4 = 3/12, 1/6 = 2/12. Поставь 3 синие и 2 оранжевые.', uz: "Siz topdingiz: 1/4 = 3/12, 1/6 = 2/12. 3 ko'k va 2 to'q sariq qo'ying." },
    chips_a: { ru: '1/4 → синие', uz: "1/4 → ko'k" },
    chips_b: { ru: '1/6 → оранжевые', uz: "1/6 → to'q sariq" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    fb_correct: { ru: 'Верно. 1/4 = 3/12, 1/6 = 2/12. Теперь доли одинаковые.', uz: "To'g'ri. 1/4 = 3/12, 1/6 = 2/12. Endi ulushlar bir xil." },
    fact: { ru: 'Размеры картинок на экране тоже приводят к общему размеру пикселя, прежде чем сложить.', uz: "Ekrandagi rasmlar o'lchami ham qo'shishdan oldin umumiy piksel o'lchoviga keltiriladi." },
    audio: {
      intro: { ru: 'Сначала посчитай в двенадцатых: сколько двенадцатых в одной четвёртой и в одной шестой. Раздели двенадцать на знаменатель. Введи числа и нажми проверить.', uz: "Avval o'n ikkilarda hisoblang: bir to'rtdan va bir oltidan nechta o'n ikkidan bo'ladi. O'n ikkini maxrajga bo'ling. Sonlarni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Одна четвёртая это три двенадцатых, одна шестая две двенадцатых. Кстати, картинки на экране тоже приводят к общему размеру пикселя.', uz: "To'g'ri. Bir to'rtdan bu o'n ikkidan uch, bir oltidan o'n ikkidan ikki. Aytgancha, ekrandagi rasmlar ham umumiy piksel o'lchoviga keltiriladi." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // s11 — CASE final MC: 1/4 + 1/6 = 5/12 (fakt: IT progress)
  s11: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    label: { ru: 'Сколько загрузилось всего?', uz: "Jami qancha yuklandi?" },
    question: { ru: '1/4 + 1/6 = ?', uz: "1/4 + 1/6 = ?" },
    correct_text: { ru: 'Правильно. 1/4 = 3/12, 1/6 = 2/12. 3/12 + 2/12 = 5/12.', uz: "To'g'ri. 1/4 = 3/12, 1/6 = 2/12. 3/12 + 2/12 = 5/12." },
    wrong_1: { ru: 'Сложили числители и знаменатели: (1+1)/(4+6). Сначала общий знаменатель 12: 3/12 + 2/12 = 5/12.', uz: "Surat va maxraj qo'shilgan: (1+1)/(4+6). Avval umumiy maxraj 12: 3/12 + 2/12 = 5/12." },
    wrong_2: { ru: 'Взяли произведение 24 и не пересчитали. Наименьший общий — 12: 5/12.', uz: "Ko'paytma 24 olingan va qayta sanalmagan. Eng kichik umumiy — 12: 5/12." },
    wrong_3: { ru: 'Потеряли числители при приведении. 1/4 = 3/12, 1/6 = 2/12. Сумма 5/12.', uz: "Keltirishda suratlar yo'qolgan. 1/4 = 3/12, 1/6 = 2/12. Yig'indi 5/12." },
    wrong_default: { ru: 'Приведи к 12: 1/4 = 3/12, 1/6 = 2/12. Тогда 5/12.', uz: "12 ga keltiring: 1/4 = 3/12, 1/6 = 2/12. U holda 5/12." },
    fact: { ru: 'Полоса загрузки складывает части по-разному большие, приводя их к общей доле — как мы сейчас.', uz: "Yuklanish chizig'i har xil katta qismlarni umumiy ulushga keltirib qo'shadi — huddi biz hozir qilganday." },
    audio: {
      intro: { ru: 'Сложи одну четвёртую и одну шестую. Сколько игры загрузилось всего? Выбери ответ.', uz: "Bir to'rtdan va bir oltidan qo'shing. O'yinning jami qancha qismi yuklandi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Три двенадцатых плюс две двенадцатых это пять двенадцатых. Полоса загрузки складывает части так же.', uz: "To'g'ri. O'n ikkidan uch plyus o'n ikkidan ikki bu o'n ikkidan besh. Yuklanish chizig'i ham qismlarni shunday qo'shadi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s12 — SUMMARY
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты складываешь дроби с разными знаменателями.', uz: "Endi siz har xil maxrajli kasrlarni qo'shasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Дроби с разными знаменателями нельзя складывать сразу — доли разного размера.', uz: "Har xil maxrajli kasrlarni darrov qo'shib bo'lmaydi — ulushlar har xil o'lchamda." },
    main_2: { ru: 'Сначала находим общий знаменатель — наименьшее число, делящееся на оба.', uz: "Avval umumiy maxraj topamiz — ikkalasiga bo'linadigan eng kichik son." },
    main_3: { ru: 'Приводим обе дроби к нему (1/2 = 3/6, 1/3 = 2/6).', uz: "Ikkala kasrni unga keltiramiz (1/2 = 3/6, 1/3 = 2/6)." },
    main_4: { ru: 'Складываем числители, знаменатель оставляем (3/6 + 2/6 = 5/6).', uz: "Suratlarni qo'shamiz, maxrajni qoldiramiz (3/6 + 2/6 = 5/6)." },
    back_to_hook: { ru: '1/2 + 1/3 это не 2/5. Привели к шестым: 3/6 + 2/6 = 5/6.', uz: "1/2 + 1/3 bu 2/5 emas. Oltilarga keltirdik: 3/6 + 2/6 = 5/6." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Эквивалентные дроби» (приведение) и «Сложение дробей с равным знаменателем».', uz: "«Ekvivalent kasrlar» (keltirish) va «Teng maxrajli kasrlarni qo'shish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты складываешь дроби с разными знаменателями. Сначала находим общий знаменатель, приводим к нему обе дроби, потом складываем числители, а знаменатель оставляем. Одна вторая плюс одна третья это не две пятых, а пять шестых. Дальше научимся вычитать дроби с разными знаменателями.', uz: "Zo'r. Endi siz har xil maxrajli kasrlarni qo'shasiz. Avval umumiy maxraj topamiz, ikkala kasrni unga keltiramiz, keyin suratlarni qo'shamiz, maxrajni qoldiramiz. Ikkidan bir plyus uchdan bir bu beshdan ikki emas, oltidan besh. Keyin har xil maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_06: шестерёнки (общее кратное = общий знаменатель) + полосы-доли.
// ============================================================
const gridFills = (parts, total) => {
  const a = Array.from({ length: total }, () => null); let i = 0;
  parts.forEach(p => { for (let k = 0; k < p.count && i < total; k++) { a[i] = p.color; i++; } });
  return a;
};
const CellRow = ({ total, fills, h = 44, max = 420 }) => (
  <div className="cr-wrap" style={{ display: 'flex', width: '100%', maxWidth: max, height: h, margin: '0 auto', borderRadius: 10, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="cr-cell" style={{ flex: 1, position: 'relative', borderRight: i < total - 1 ? `2px solid ${T.bg}` : 'none', background: (fills && fills[i]) || 'transparent' }}>{(fills && fills[i]) && <span className="cr-shine"/>}</div>
    ))}
  </div>
);
const FracPlus = ({ parts, sumN, sumD, showSum = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    {parts.map((p, j) => (<React.Fragment key={j}>{j > 0 && <Op>+</Op>}<Frac n={String(p.n)} d={String(p.d)} size="mid" color={p.c}/></React.Fragment>))}
    {showSum && <><Op>=</Op><Frac n={String(sumN)} d={String(sumD)} size="mid" color={T.success}/></>}
  </div>
);
// Gear — управляемая шестерёнка: teeth зубьев, поворот по steps (1 шаг = 1/teeth оборота).
// Зелёный зуб (i=0) — «дом»; он возвращается наверх к указателю каждые teeth шагов.
const Gear = ({ teeth, steps, size, color }) => {
  const c = size / 2, rr = c - 11;
  const angle = (steps / teeth) * 360;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <span className="mono" style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', color: T.ink2, fontSize: 14, zIndex: 2 }}>▾</span>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: `rotate(${angle}deg)`, transition: 'transform 0.45s cubic-bezier(0.34, 1.1, 0.64, 1)' }}>
        {Array.from({ length: teeth }).map((_, i) => { const a = ((i / teeth) * 360 - 90) * Math.PI / 180; const x = c + Math.cos(a) * (rr + 5); const y = c + Math.sin(a) * (rr + 5); return <rect key={i} x={x - 5} y={y - 5} width={10} height={10} rx={2} fill={i === 0 ? T.success : color} transform={`rotate(${(i / teeth) * 360} ${x} ${y})`}/>; })}
        <circle cx={c} cy={c} r={rr} fill={color}/>
        <circle cx={c} cy={c} r={rr * 0.4} fill={T.paper}/>
      </svg>
      <span className="mono" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, fontSize: 'clamp(14px, 2vw, 18px)', color }}>{teeth}</span>
    </div>
  );
};

// ============================================================
// ФАКТ-БЛОК — карта с мини-анимацией, открывается на верном ответе.
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const FACT_BADGE_TECH = { ru: 'Знаешь ли ты? · Техника', uz: "Bilasizmi? · Texnika" };
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const AnimPixel = () => (<div className="fa-px">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="fa-px-c" style={{ animationDelay: `${i * 0.16}s` }}/>)}</div>);
const AnimGear = () => (
  <svg className="fa-gear" width="42" height="42" viewBox="0 0 42 42">
    {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * 360 * Math.PI / 180; const x = 21 + Math.cos(a) * 15; const y = 21 + Math.sin(a) * 15; return <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="#019ACB" transform={`rotate(${(i / 8) * 360} ${x} ${y})`}/>; })}
    <circle cx="21" cy="21" r="12" fill="#019ACB"/><circle cx="21" cy="21" r="5" fill="#EAF6FB"/>
  </svg>
);
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

const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; });
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

const numOpt = (x) => <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 }}>{x}</span>;

// s0 — HOOK (konseptual)
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1 hook-alive" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="2" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={2} fills={gridFills([{ count: 1, color: T.accent }], 2)} h={30} max={9999}/></div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="3" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={3} fills={gridFills([{ count: 1, color: T.blue }], 3)} h={30} max={9999}/></div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="2" size="mid" color={T.accent}/><Op>+</Op><Frac n="1" d="3" size="mid" color={T.blue}/><Op>=</Op><Frac n="2" d="5" size="mid" color={T.ink3}/><span className="mop" style={{ color: T.ink3 }}>?</span></div>
        </div>
        <h2 className="title h-sub fade-up delay-2">{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)} style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span><span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: bo'laklar teng emas
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 380 }}><Frac n="1" d="2" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={2} fills={gridFills([{ count: 1, color: T.accent }], 2)} h={34} max={9999}/></div></div>}
          {step >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 380 }}><Frac n="1" d="3" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={3} fills={gridFills([{ count: 1, color: T.blue }], 3)} h={34} max={9999}/></div></div>}
          {step >= 3 && <p className="body" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION g'ildiraklar: umumiy 6
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [steps, setSteps] = useState(0);
  const fit = steps > 0 && steps % 2 === 0 && steps % 3 === 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minHeight: 180, justifyContent: 'center', boxShadow: fit ? '0 0 0 2px #1F7A4D, 0 8px 22px -6px rgba(31, 122, 77, 0.35)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 4vw, 28px)' }}>
            <Gear teeth={2} steps={steps} size={88} color={T.accent}/>
            <Gear teeth={3} steps={steps} size={110} color={T.blue}/>
          </div>
          <p className="mono small" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? 'Qadam' : 'Шаг'}: {steps}</p>
          <p className="body" style={{ margin: 0, textAlign: 'center', fontWeight: fit ? 600 : 400, color: fit ? T.success : T.ink2 }}>{mt(t(fit ? c.note_hit : c.note_miss))}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-white-accent" onClick={() => setSteps(s => s + 1)} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.5vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Aylantir' : 'Крутить'}</button>
          <button className="btn-ghost" onClick={() => setSteps(0)} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Boshidan' : 'Сначала'}</button>
        </div>
        {fit && <p className="small fade-up" style={{ textAlign: 'center', color: T.ink2 }}>{mt(t(c.conclusion))}</p>}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION step: qayta bo'lish 1/2=3/6, 1/3=2/6
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 22px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', minHeight: 150, justifyContent: 'center' }}>
          {step >= 1 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}><Frac n="3" d="6" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={6} fills={gridFills([{ count: 3, color: T.accent }], 6)} h={34} max={9999}/></div></div>}
          {step >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}><Frac n="2" d="6" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={6} fills={gridFills([{ count: 2, color: T.blue }], 6)} h={34} max={9999}/></div></div>}
          {step >= 2 && <p className="body" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.conclusion))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s4 — RULE: 3 qadam
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <CellRow total={6} fills={gridFills([{ count: 3, color: T.accent }, { count: 2, color: T.blue }], 6)} h={40}/>
          <FracPlus parts={[{ n: 3, d: 6, c: T.accent }, { n: 2, d: 6, c: T.blue }]} sumN={5} sumD={6}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
            <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.label)}</p>
            {[c.step1, c.step2, c.step3].map((stp, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span><p className="body" style={{ margin: 0 }}>{mt(t(stp))}</p></div>))}
            <p className="small" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s5 — TEST MC p1: umumiy maxraj 1/4 & 1/6 -> 12 (fakt g'ildirak)
const Screen5 = (props) => {
  const t = useT(); const c = CONTENT.s5;
  const base = [numOpt(12), numOpt(10), numOpt(24), numOpt(2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}><CellRow total={4} fills={gridFills([{ count: 1, color: T.accent }], 4)} h={26}/><CellRow total={6} fills={gridFills([{ count: 1, color: T.blue }], 6)} h={26}/></div></>);
  return <QuestionScreen {...props} idx={5} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[5]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimGear/>} badge={FACT_BADGE_TECH}/>}/>;
};

// s6 — TEST NumInput p2: 1/2 & 1/5 -> 10
const Screen6 = (props) => {
  const c = CONTENT.s6;
  return <NumInputScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={c} correctValue={10}
    renderVisual={() => (<div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 360 }}><CellRow total={2} fills={gridFills([{ count: 1, color: T.accent }], 2)} h={26} max={9999}/><CellRow total={5} fills={gridFills([{ count: 1, color: T.blue }], 5)} h={26} max={9999}/></div>)}/>;
};

// s7 — TEST xatoni-top p3
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const eq = (a, b, d1, d2, r, rd) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Frac n={String(a)} d={String(d1)} size="sm"/><Op size="sm">+</Op><Frac n={String(b)} d={String(d2)} size="sm"/><Op size="sm">=</Op><Frac n={String(r)} d={String(rd)} size="sm"/>
    </span>
  );
  // base[0] — XATO: 1/2 + 1/3 = 2/5 (surat+maxraj qo'shilgan)
  const base = [eq(1, 1, 2, 3, 2, 5), eq(3, 2, 6, 6, 5, 6), eq(1, 1, 4, 4, 2, 4), eq(4, 3, 12, 12, 7, 12)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — TEST bosqichli yechim quruvchi p4: 1/2 + 1/3
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const STEPS = [
    { q: c.q_step1, hint: c.hint_step1, opts: [numOpt(6), numOpt(5), numOpt(3)], correct: 0 },
    { q: c.q_step2, hint: c.hint_step2, opts: [<Frac n="3" d="6" size="mid"/>, <Frac n="1" d="6" size="mid"/>, <Frac n="2" d="6" size="mid"/>], correct: 0 },
    { q: c.q_step3, hint: c.hint_step3, opts: [<Frac n="5" d="6" size="mid"/>, <Frac n="5" d="12" size="mid"/>, <Frac n="2" d="5" size="mid"/>], correct: 0 },
  ];
  const wasSolved = storedAnswer?.solved === true;
  const [stepIdx, setStepIdx] = useState(wasSolved ? 3 : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const allFirstRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? true) : true);
  const introAdvRef = useRef(wasSolved);
  const solved = stepIdx >= 3;
  const pick = (i) => {
    if (solved) return;
    const st = STEPS[stepIdx];
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); }
    if (i === st.correct) {
      sfx.playCorrect();
      const ns = stepIdx + 1;
      setWrong(new Set());
      setStepIdx(ns);
      if (ns >= 3) {
        onAnswer({ stage: 'practice', screenIdx: 8, question: c.title[lang], correctAnswer: '5/6', studentAnswer: '5/6', correct: allFirstRef.current, firstTry: allFirstRef.current, solved: true });
        if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
      }
    } else {
      sfx.playWrong(); allFirstRef.current = false;
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const st = STEPS[Math.min(stepIdx, 2)];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[0, 1, 2].map(s => <span key={s} className="mono small" style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s < stepIdx ? T.success : (s === stepIdx ? T.accent : 'rgba(167,166,162,0.25)'), color: s <= stepIdx ? '#FFF' : T.ink3, fontWeight: 600 }}>{s + 1}</span>)}
        </div>
        {!solved && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="body" style={{ margin: 0, fontWeight: 600, textAlign: 'center' }}>{mt(t(st.q))}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {st.opts.map((opt, i) => { const dead = wrong.has(i); return (
                <button key={i} className={dead ? 'option option-picked-wrong' : 'option'} disabled={dead} onClick={() => pick(i)} style={{ padding: 'clamp(10px, 1.5vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt}</button>
              ); })}
            </div>
            {wrong.size > 0 && <p className="small" style={{ margin: 0, color: '#A07D14', textAlign: 'center' }}>{mt(t(st.hint))}</p>}
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s9 — CASE setup: Bahodir 1/4 + 1/6
const Screen9 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="4" size="sm" color={T.accent}/><div style={{ flex: 1 }}><CellRow total={4} fills={gridFills([{ count: 1, color: T.accent }], 4)} h={28} max={9999}/></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="6" size="sm" color={T.blue}/><div style={{ flex: 1 }}><CellRow total={6} fills={gridFills([{ count: 1, color: T.blue }], 6)} h={28} max={9999}/></div></div>
        </div>
        <p className="body fade-up delay-2">{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s10 — CASE drag/tap p5: 1/4->3/12, 1/6->2/12 (fakt piksel)
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [phase, setPhase] = useState(wasSolved ? 2 : 0);
  const [v1, setV1] = useState(wasSolved ? '3' : '');
  const [v2, setV2] = useState(wasSolved ? '2' : '');
  const [calcHint, setCalcHint] = useState(false);
  const [a, setA] = useState(wasSolved ? 3 : 0);
  const [b, setB] = useState(wasSolved ? 2 : 0);
  const [placeHint, setPlaceHint] = useState(false);
  const erroredRef = useRef(storedAnswer ? !(storedAnswer.firstTry ?? true) : false);
  const introAdvRef = useRef(wasSolved);
  const voice = (key) => { if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio[key][lang]); }, 300); };
  const checkCalc = () => {
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('check_pressed'); }
    const ok = parseInt(v1, 10) === 3 && parseInt(v2, 10) === 2;
    if (ok) { sfx.playCorrect(); setCalcHint(false); setPhase(1); }
    else { erroredRef.current = true; sfx.playWrong(); setCalcHint(true); voice('on_wrong'); }
  };
  const checkPlace = () => {
    const ok = a === 3 && b === 2;
    if (ok) {
      sfx.playCorrect(); setPlaceHint(false); setPhase(2);
      const ft = !erroredRef.current;
      onAnswer({ stage: 'practice', screenIdx: 10, question: c.q_calc1[lang], correctAnswer: '5/12', studentAnswer: `${a + b}/12`, correct: ft, firstTry: ft, solved: true });
      voice('on_correct');
    } else { erroredRef.current = true; sfx.playWrong(); setPlaceHint(true); voice('on_wrong'); }
  };
  const fills = gridFills([{ count: a, color: T.accent }, { count: b, color: T.blue }], 12);
  const inSt = { width: 'clamp(60px, 14vw, 80px)' };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={phase < 2} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        {phase === 0 && (
          <>
            <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
            <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="4" size="mid" color={T.accent}/><Op>=</Op><input type="number" inputMode="numeric" className="answer-input" value={v1} placeholder="0" onChange={e => { setV1(e.target.value); setCalcHint(false); }} style={inSt}/><span className="mono" style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: T.ink2 }}>/12</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="6" size="mid" color={T.blue}/><Op>=</Op><input type="number" inputMode="numeric" className="answer-input" value={v2} placeholder="0" onChange={e => { setV2(e.target.value); setCalcHint(false); }} style={inSt}/><span className="mono" style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: T.ink2 }}>/12</span></div>
            </div>
            {calcHint && (<div className="frame-tip fade-up"><p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.calc_hint))}</p></div>)}
            <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={checkCalc} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>
          </>
        )}
        {phase >= 1 && (
          <>
            <h2 className="title h-sub fade-up">{mt(t(c.place_title))}</h2>
            <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <CellRow total={12} fills={fills} h={40}/>
              <FracPlus parts={[{ n: a, d: 12, c: T.accent }, { n: b, d: 12, c: T.blue }]} sumN={a + b} sumD={12} showSum={phase === 2}/>
            </div>
            {phase === 1 && (
              <>
                <div className="fade-up delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-ghost" onClick={() => { setA(v => (v >= 6 ? 0 : v + 1)); setPlaceHint(false); }} style={{ padding: '10px 16px', boxShadow: '0 4px 12px -4px rgba(255,79,40,0.3)' }}><span style={{ color: T.accent, fontWeight: 600 }}>{t(c.chips_a)}: {a}</span></button>
                  <button className="btn-ghost" onClick={() => { setB(v => (v >= 6 ? 0 : v + 1)); setPlaceHint(false); }} style={{ padding: '10px 16px', boxShadow: '0 4px 12px -4px rgba(1,154,203,0.3)' }}><span style={{ color: T.blue, fontWeight: 600 }}>{t(c.chips_b)}: {b}</span></button>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={checkPlace} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>
                </div>
                {placeHint && (<div className="frame-tip fade-up"><p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.place_hint))}</p></div>)}
              </>
            )}
            {phase === 2 && (<FeedbackBlock show={true} isCorrect={true}><p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p><div style={{ marginTop: 10 }}><FactCard text={c.fact} anim={<AnimPixel/>}/></div></FeedbackBlock>)}
          </>
        )}
      </div>
    </Stage>
  );
};

// s11 — CASE final MC: 1/4 + 1/6 = 5/12 (fakt progress)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="5" d="12" size="mid"/>, <Frac n="2" d="10" size="mid"/>, <Frac n="5" d="24" size="mid"/>, <Frac n="1" d="12" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}><CellRow total={4} fills={gridFills([{ count: 1, color: T.accent }], 4)} h={26}/><CellRow total={6} fills={gridFills([{ count: 1, color: T.blue }], 6)} h={26}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s12 — SUMMARY
const Screen12 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FracPlus parts={[{ n: 1, d: 2, c: T.accent }, { n: 1, d: 3, c: T.blue }]} sumN={5} sumD={6}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionAddUnlikeDenLesson({
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
// CSS-БЛОК (STYLES) — визуальный язык v15 из infrastructure_v1 + BackLine (frac_5_10)
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
/* HOOK jonli animatsiya (uzluksiz bezakli harakat — Dars01 uslubiga monand) */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }
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
/* MATH frac_5_10: BackLine — health-bar: сплошная заливка плавно убывает (transition width) + маркер едет. */
.bl-bar { position: relative; width: 100%; height: 32px; border-radius: 9px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.6); }
.bl-ghost { position: absolute; top: 0; bottom: 0; left: 0; background: rgba(255, 79, 40, 0.12); border-radius: 9px 0 0 9px; }
.bl-fill { position: absolute; top: 0; bottom: 0; left: 0; background: #FF4F28; border-radius: 9px 0 0 9px; transition: width 0.6s cubic-bezier(0.34, 1.1, 0.64, 1); }
.bl-fill-done { background: #1F7A4D; }
.bl-tick { position: absolute; top: 0; bottom: 0; width: 2px; background: #F6F4EF; transform: translateX(-1px); }
.bl-hit { position: absolute; top: 0; bottom: 0; cursor: pointer; z-index: 3; }
.bl-marker { position: absolute; top: -7px; bottom: -7px; width: 3px; background: #0E0E10; border-radius: 2px; transform: translateX(-1.5px); transition: left 0.6s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 4; }
.bl-dot { position: absolute; top: -7px; left: 50%; width: 13px; height: 13px; border-radius: 50%; background: #0E0E10; transform: translateX(-50%); box-shadow: 0 0 8px rgba(14, 14, 16, 0.4); }
.bl-axis { display: flex; justify-content: space-between; margin-top: 6px; }
.bl-count { display: flex; justify-content: center; margin-top: 8px; animation: blSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes blSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.bl-glow { animation: blGlow 0.7s ease; }
@keyframes blGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }

/* MATH frac_5_10: SubMachine — «машина вычитания»: числитель↓, знаменатель заблокирован. */
.sm-rows { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 420px; }
.sm-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #FFFFFF; border-radius: 10px; padding: 10px 14px; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.16); transition: box-shadow 0.4s ease; }
.sm-tag { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.sm-eq { display: inline-flex; align-items: center; gap: 6px; font-size: clamp(17px, 2.5vw, 22px); font-weight: 600; }
.sm-res { font-family: 'Fraunces', serif; font-weight: 600; color: #1F7A4D; display: inline-block; animation: blSpin 0.45s cubic-bezier(0.34, 1.4, 0.64, 1); }
.sm-lock { font-family: 'Manrope', sans-serif; font-size: clamp(11px, 1.4vw, 12px); font-weight: 600; color: #1F7A4D; display: inline-flex; align-items: center; gap: 4px; }
.sm-lock::before { content: '🔒'; font-size: 0.85em; }

/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: 72px; display: flex; align-items: center; justify-content: center; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(13px, 1.6vw, 14px); line-height: 1.45; color: #0E0E10; }
/* progress (загрузка): полоса заполняется + бегущая стрелка вниз */
.fa-prog { position: relative; width: 66px; height: 16px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.2s ease-in-out infinite; }
@keyframes faProg { 0% { width: 6%; } 60% { width: 80%; } 100% { width: 6%; } }
.fa-prog-arr { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: #FFFFFF; animation: faArr 1.1s ease-in-out infinite; }
@keyframes faArr { 0%, 100% { transform: translate(-50%, -75%); opacity: 0.5; } 50% { transform: translate(-50%, -25%); opacity: 1; } }
/* battery (заряд): уровень + пульсирующая молния */
.fa-bat { position: relative; width: 58px; height: 28px; border: 2px solid #019ACB; border-radius: 6px; padding: 2px; }
.fa-bat-tip { position: absolute; right: -6px; top: 8px; width: 4px; height: 10px; background: #019ACB; border-radius: 0 2px 2px 0; }
.fa-bat-fill { height: 100%; border-radius: 3px; animation: faBat 2.8s ease-in-out infinite; }
@keyframes faBat { 0% { width: 90%; background: #1F7A4D; } 50% { width: 26%; background: #FF4F28; } 100% { width: 90%; background: #1F7A4D; } }
.fa-bat-bolt { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; animation: faBolt 1.4s ease-in-out infinite; }
@keyframes faBolt { 0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; } 50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; } }
/* slider (громкость): заполнение + бегущий бегунок */
.fa-sld { position: relative; width: 66px; height: 26px; display: flex; align-items: center; }
.fa-sld-track { position: absolute; left: 0; right: 0; height: 5px; border-radius: 99px; background: rgba(1, 154, 203, 0.22); }
.fa-sld-fill { position: absolute; left: 0; height: 5px; border-radius: 99px; background: #019ACB; animation: faSldFill 2.6s ease-in-out infinite; }
@keyframes faSldFill { 0% { width: 62%; } 50% { width: 8%; } 100% { width: 62%; } }
.fa-sld-knob { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: 50%; background: #019ACB; transform: translate(-50%, -50%); box-shadow: 0 0 0 3px #EAF6FB, 0 0 10px rgba(1, 154, 203, 0.6); animation: faSld 2.6s ease-in-out infinite; }
@keyframes faSld { 0% { left: 62%; } 50% { left: 8%; } 100% { left: 62%; } }
/* egypt (история): пирамида пульсирует + солнце движется */
.fa-pyr { position: relative; width: 60px; height: 34px; display: flex; align-items: flex-end; justify-content: center; }
.fa-pyr-tri { width: 0; height: 0; border-left: 26px solid transparent; border-right: 26px solid transparent; border-bottom: 30px solid #019ACB; animation: faPyr 2.6s ease-in-out infinite; }
@keyframes faPyr { 0%, 100% { filter: drop-shadow(0 0 0 rgba(1, 154, 203, 0)); transform: translateY(0); } 50% { filter: drop-shadow(0 0 9px rgba(1, 154, 203, 0.6)); transform: translateY(-2px); } }
.fa-pyr-sun { position: absolute; top: 0; left: 50%; width: 10px; height: 10px; border-radius: 50%; background: #FF9A3C; box-shadow: 0 0 8px rgba(255, 154, 60, 0.7); animation: faSun 3.2s ease-in-out infinite; }
@keyframes faSun { 0% { transform: translateX(-26px); opacity: 0.4; } 50% { transform: translateX(20px); opacity: 1; } 100% { transform: translateX(-26px); opacity: 0.4; } }

/* MATH frac_5_10: StepLine (son o'qida orqaga qadam) + MinuendBar + batareya (s10 drag/remove). */
.sl-wrap { position: relative; width: 100%; max-width: 440px; margin: 0 auto; }
.sl-track { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; border-radius: 99px; background: rgba(167, 166, 162, 0.30); }
.sl-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; border-radius: 99px; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.45); transition: width 0.5s cubic-bezier(0.34, 1.1, 0.64, 1); }
.sl-tick { position: absolute; top: 50%; width: 2px; height: 10px; transform: translate(-50%, -50%); background: rgba(167, 166, 162, 0.7); border-radius: 2px; }
.sl-marker { position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%; background: #FF4F28; transform: translate(-50%, -50%); box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px rgba(255, 79, 40, 0.55); transition: left 0.5s cubic-bezier(0.34, 1.4, 0.64, 1), background 0.3s; z-index: 2; }
.sl-marker-hi { background: #1F7A4D; box-shadow: 0 0 0 4px #F6F4EF, 0 0 14px rgba(31, 122, 77, 0.6); }
/* MATH frac_5_10: «живой» маркер на примерах — расходящееся кольцо (ripple), цвет нейтральный. */
.sl-alive::after { content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(58, 53, 48, 0.35); transform: translate(-50%, -50%); pointer-events: none; animation: slPing 1.9s ease-out infinite; }
@keyframes slPing { 0% { transform: translate(-50%, -50%) scale(0.55); opacity: 0.85; } 100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; } }
.sl-flag { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.4vw, 13px); font-weight: 600; color: #0E0E10; white-space: nowrap; background: #FFFFFF; padding: 1px 6px; border-radius: 6px; box-shadow: 0 3px 8px -3px rgba(58, 53, 48, 0.25); }
.sl-end { position: absolute; top: calc(50% + 14px); font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.3vw, 12px); color: #A7A6A2; }
.sl-end-0 { left: 0; transform: translateX(-50%); }
.sl-end-1 { right: 0; transform: translateX(50%); }
.sl-loop { animation: slMarkLoop 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite, slMarkGlow 1.4s ease-in-out infinite !important; }
@keyframes slMarkLoop { 0%, 20% { left: 83.333%; } 50%, 70% { left: 50%; } 100% { left: 83.333%; } }
@keyframes slMarkGlow { 0%, 100% { box-shadow: 0 0 0 4px #F6F4EF, 0 0 8px rgba(255, 79, 40, 0.5); } 50% { box-shadow: 0 0 0 4px #F6F4EF, 0 0 20px rgba(255, 79, 40, 0.9); } }
/* MATH frac_5_10: пульс «?» в хуке. */
.hk-q { display: inline-block; animation: hkQ 1.3s ease-in-out infinite; }
@keyframes hkQ { 0%, 100% { transform: scale(1); opacity: 0.7; text-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { transform: scale(1.25); opacity: 1; text-shadow: 0 0 12px rgba(255, 79, 40, 0.5); } }
.sl-loop-fill { animation: slFillLoop 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite !important; }
@keyframes slFillLoop { 0%, 20% { width: 83.333%; } 50%, 70% { width: 50%; } 100% { width: 83.333%; } }
.sl-stepin { animation: slStepIn 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) backwards; }
@keyframes slStepIn { from { left: 83.333%; } }
.sl-stepin-fill { animation: slStepInFill 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) backwards; }
@keyframes slStepInFill { from { width: 83.333%; } }
.mb-wrap { position: relative; display: flex; width: 100%; max-width: 360px; height: 42px; border-radius: 10px; overflow: hidden; background: #FFFFFF; box-shadow: inset 0 0 0 2px #A7A6A2; }
.mb-cell { flex: 1; }
/* MATH frac_5_10: бегущий блик на примере-полосе (движение без раскрытия ответа). */
.mb-shimmer { position: absolute; top: 0; bottom: 0; width: 38%; left: -38%; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent); animation: mbShine 2.4s ease-in-out infinite; }
@keyframes mbShine { 0% { left: -38%; } 70%, 100% { left: 100%; } }
/* MATH frac_5_10: SubFlyLoop — «улетающие доли» в хуке (вычитание = забираем), CSS-only loop. */
.sf-bar { position: relative; display: flex; width: 100%; max-width: 340px; height: 40px; border-radius: 9px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.6); }
.sf-cell { flex: 1; position: relative; }
.sf-on { background: #FF4F28; }
.sf-on:first-child { border-radius: 9px 0 0 9px; }
.sf-fly { animation: sfFly 2.6s ease-in-out infinite; transform-origin: center bottom; }
@keyframes sfFly { 0%, 26% { transform: translateY(0) scale(1); opacity: 1; } 50% { transform: translateY(-24px) scale(0.78); opacity: 0; } 52%, 74% { transform: translateY(-24px); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
/* MATH frac_5_10: FloatFracs — бледные дрейфующие дроби, заполняют пустые зоны движением (декор). */
.ff-wrap { display: flex; justify-content: center; align-items: center; gap: clamp(18px, 6vw, 44px); opacity: 0.3; pointer-events: none; margin-top: 6px; }
.ff { display: inline-flex; color: #5A5A60; animation: ffBob 3.2s ease-in-out infinite; }
.ff-1 { animation-delay: 0s; } .ff-2 { animation-delay: 0.5s; } .ff-3 { animation-delay: 1s; } .ff-4 { animation-delay: 1.5s; }
@keyframes ffBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
/* MATH frac_5_10: TvRewind — ТВ с отмоткой назад (хук, по сюжету сериала). */
.tv { display: flex; flex-direction: column; align-items: center; }
.tv-screen { position: relative; width: clamp(160px, 42vw, 210px); height: clamp(96px, 25vw, 124px); border-radius: 12px; background: #0E0E10; box-shadow: 0 0 0 4px #FFFFFF, 0 10px 24px -6px rgba(58, 53, 48, 0.4); overflow: hidden; }
.tv-tick { position: absolute; top: 8px; bottom: 24px; width: 2px; background: rgba(255, 255, 255, 0.12); transform: translateX(-1px); }
.tv-rew { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -58%); color: #FF4F28; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 7vw, 38px); letter-spacing: -3px; text-shadow: 0 0 14px rgba(255, 79, 40, 0.55); animation: tvRew 1.1s ease-in-out infinite; }
@keyframes tvRew { 0%, 100% { opacity: 0.45; transform: translate(-50%, -58%) scale(0.9); } 50% { opacity: 1; transform: translate(-50%, -58%) scale(1.12); } }
.tv-seek { position: absolute; left: 12px; right: 12px; bottom: 12px; height: 5px; border-radius: 99px; background: rgba(255, 255, 255, 0.22); }
.tv-seek-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: #FF4F28; animation: tvSeek 3s cubic-bezier(0.4, 0, 0.5, 1) infinite; }
@keyframes tvSeek { 0% { width: 12%; } 40% { width: 83.3%; } 58% { width: 50%; } 82% { width: 50%; } 100% { width: 12%; } }
.tv-seek-head { position: absolute; top: 50%; width: 11px; height: 11px; border-radius: 50%; background: #FFFFFF; transform: translate(-50%, -50%); box-shadow: 0 0 6px rgba(255, 255, 255, 0.7); animation: tvHead 3s cubic-bezier(0.4, 0, 0.5, 1) infinite; }
@keyframes tvHead { 0% { left: 12%; } 40% { left: 83.3%; } 58% { left: 50%; } 82% { left: 50%; } 100% { left: 12%; } }
.tv-neck { width: 10px; height: 9px; background: #A7A6A2; }
.tv-base { width: 60px; height: 7px; background: #A7A6A2; border-radius: 99px; }
.bt-wrap { position: relative; display: flex; width: 100%; max-width: 360px; height: 60px; border: 3px solid #019ACB; border-radius: 8px; padding: 3px; background: #FFFFFF; }
.bt-tip { position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 5px; height: 22px; background: #019ACB; border-radius: 0 3px 3px 0; }
.bt-cell { flex: 1; border: none; background: transparent; cursor: pointer; position: relative; border-radius: 3px; transition: background 0.25s; padding: 0; display: flex; align-items: center; justify-content: center; }
.bt-cell.bt-on { background: #1F7A4D; }
.bt-cell.bt-on:hover:not(:disabled) { background: #FF4F28; }
.bt-cell:disabled { cursor: default; }
.bt-x { color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 18px; }


/* MATH frac_5_10: EatingNon — dumaloq lepyoshka, 2 bo'lak aylanada uchib ketadi (ayirish). */
.non-fly { animation: nonFly 3s ease-in-out infinite; }
@keyframes nonFly { 0%, 14% { opacity: 1; transform: translateY(0) scale(1); } 42%, 60% { opacity: 0; transform: translateY(-14px) scale(0.5); } 86%, 100% { opacity: 1; transform: translateY(0) scale(1); } }


/* MATH frac_5_10: FloatFracs — plavayushchaya stroka drobey (dekorativ, reconstructed). */
.ff-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 2px; flex-wrap: wrap; }
.ff-chip { display: inline-flex; animation: ffFloat 2.6s ease-in-out infinite; }
@keyframes ffFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }


/* MATH frac_5_06: shesteryonki (g'ildiraklar), cell-row, fakt-anim (piksel, g'ildirak). */
@keyframes gearSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.cr-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
.fa-gear { animation: gearSpin 4s linear infinite; transform-origin: center; }
.fa-px { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; width: 44px; }
.fa-px-c { width: 100%; aspect-ratio: 1 / 1; border-radius: 2px; background: #019ACB; animation: faPx 2.2s ease-in-out infinite; }
@keyframes faPx { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }

/* Accessibility: prefers-reduced-motion — gasim dekorativ sikllarni. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
