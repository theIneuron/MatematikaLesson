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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev }) => {
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
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
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : T.ink3 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass={c[`hint_${picked}`] ? 'frame-tip' : undefined}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {mt(solved ? t(c.correct_text) : t(c[`hint_${picked}`] || c[`wrong_${picked}`] || c.wrong_default))}
          </p>
        </FeedbackBlock>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
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
// --- ПОД УРОК: frac_5_06 — Сложение дробей с разными знаменателями ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-06-v1',
  lessonTitle: { ru: 'Сложение дробей с разными знаменателями', uz: "Har xil maxrajli kasrlarni qo'shish" }
};
const TOTAL_SCREENS = 14;

// Обучающий урок: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's11', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // s0 — HOOK: Otabek devorni bo'ydi, 1/2 + 1/3 = 2/5?
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Отабек утром покрасил 1/2 стены, а после обеда ещё 1/3.', uz: "Otabek ertalab devorning 1/2 qismini, tushdan keyin yana 1/3 qismini bo'ydi." },
    body: { ru: 'Но половина стены — это уже много, а 2/5 меньше половины. Стало как будто меньше, хотя он красил дважды. Что-то не так.', uz: "Lekin devorning yarmi — bu allaqachon ko'p, 2/5 esa yarimdan kam. Ikki marta bo'yagan bo'lsa ham, go'yo kamaygandek. Bu yerda nimadir noto'g'ri." },
    question: { ru: 'Как думаешь: 1/2 + 1/3 = 2/5 — это правильно?', uz: "Sizningcha: 1/2 + 1/3 = 2/5 — to'g'rimi?" },
    opt0: { ru: 'Нет, тут ошибка', uz: "Yo'q, bu yerda xato" },
    opt1: { ru: 'Да, всё верно', uz: "Ha, hammasi to'g'ri" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Отабек утром покрасил одну вторую стены, а после обеда ещё одну третью. Он сложил так: одна вторая плюс одна третья равно две пятых. Но половина стены это уже много, а две пятых меньше половины. Получилось как будто меньше, хотя красил он дважды. Как думаешь, это правильно? Выбери ответ.', uz: "Otabek ertalab devorning ikkidan birini, tushdan keyin yana uchdan birini bo'ydi. U shunday qo'shdi: ikkidan bir plyus uchdan bir teng beshdan ikki. Lekin devorning yarmi bu allaqachon ko'p, beshdan ikki esa yarimdan kam. Ikki marta bo'yagan bo'lsa ham, go'yo kamaygandek. Sizningcha, bu to'g'rimi? Javobni tanlang." }
  },

  // s1 — EXPLORATION: bo'laklar har xil o'lchamda
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Половина и треть — это куски разного размера', uz: "Yarim va uchdan bir — har xil o'lchamdagi bo'laklar" },
    conclusion: { ru: 'Половина больше трети. Куски разного размера, поэтому нельзя просто сказать «2 куска из 5». Сначала нужно сделать доли одинаковыми.', uz: "Yarim uchdan birdan katta. Bo'laklar har xil o'lchamda, shuning uchun shunchaki «5 dan 2 bo'lak» deb bo'lmaydi. Avval ulushlarni bir xil qilish kerak." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Как сделать доли одинаковыми?', uz: "Ulushlarni qanday bir xil qilish mumkin?" },
    audio: {
      ru: [
        'Посмотри на стену Отабека двумя способами. Нажимай кнопку дальше.',
        'Сверху стена поделена пополам — одна вторая. Это закрашенный кусок в половину стены, он большой.',
        'Снизу та же стена поделена на три части — одна третья. Этот кусок меньше половины.',
        'Куски разного размера. Поэтому нельзя просто сложить два куска и сказать две пятых. Сначала надо сделать доли одинаковыми.'
      ],
      uz: [
        "Otabekning devoriga ikki xil tarzda qarang. Davom etish tugmasini bosing.",
        "Yuqorida devor teng ikkiga bo'lingan — ikkidan bir. Bu devorning yarmiga teng bo'yalgan bo'lak, u katta.",
        "Pastda o'sha devor uch bo'lakka bo'lingan — uchdan bir. Bu bo'lak yarimdan kichik.",
        "Bo'laklar har xil o'lchamda. Shuning uchun ikki bo'lakni shunchaki qo'shib, beshdan ikki deb bo'lmaydi. Avval ulushlarni bir xil qilish kerak."
      ]
    }
  },

  // s2 — EXPLORATION: to'rlarni ustma-ust → 6 katak
  s2: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Наложим два деления — получится общая сетка', uz: "Ikki bo'linishni ustma-ust qo'yamiz — umumiy to'r chiqadi" },
    conclusion: { ru: 'Стена разбилась на 6 одинаковых клеток. Половина — это 3 клетки (3/6), треть — 2 клетки (2/6). Теперь доли одинаковые.', uz: "Devor 6 ta bir xil katakka bo'lindi. Yarim — bu 3 katak (3/6), uchdan bir — 2 katak (2/6). Endi ulushlar bir xil." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'А как найти это число клеток?', uz: "Bu katak sonini qanday topish mumkin?" },
    audio: {
      ru: [
        'Возьмём одну стену и наложим оба деления. Нажимай дальше.',
        'Сначала делим стену пополам горизонтальной линией — это половинки.',
        'Теперь добавляем деление на три вертикальными линиями. Стена разбилась на шесть одинаковых клеток.',
        'Половина это теперь три клетки из шести, три шестых. Треть это две клетки из шести, две шестых. Доли стали одинаковыми, их можно складывать.'
      ],
      uz: [
        "Bitta devorni olib, ikkala bo'linishni ustma-ust qo'yamiz. Davom etishni bosing.",
        "Avval devorni gorizontal chiziq bilan teng ikkiga bo'lamiz — bu yarimlar.",
        "Endi vertikal chiziqlar bilan uchga bo'lishni qo'shamiz. Devor olti ta bir xil katakka bo'lindi.",
        "Yarim endi oltidan uch katak, oltidan uch. Uchdan bir esa oltidan ikki katak, oltidan ikki. Ulushlar bir xil bo'ldi, ularni qo'shsa bo'ladi."
      ]
    }
  },

  // s3 — EXPLORATION slider: eng kichik umumiy son = 6
  s3: {
    eyebrow: { ru: 'Поиграй', uz: "O'ynab ko'ring" },
    title: { ru: 'Двигай ползунок — ищи число клеток, которое подходит обоим делениям.', uz: "Slayderni suring — ikkala bo'linishga ham mos keladigan katak sonini qidiring." },
    label_slider: { ru: 'Клеток в стене', uz: "Devordagi kataklar" },
    note_fit: { ru: 'Подходит! Делится и на 2, и на 3.', uz: "Mos keldi! Ham 2 ga, ham 3 ga bo'linadi." },
    note_nofit: { ru: 'Не подходит: куски не ложатся на сетку ровно.', uz: "Mos kelmadi: bo'laklar to'rga tekis tushmaydi." },
    conclusion: { ru: 'Подходят 6, 12, 18… — все делятся и на 2, и на 3. Самое маленькое — 6. С ним работы меньше всего.', uz: "6, 12, 18… mos keladi — barchasi ham 2 ga, ham 3 ga bo'linadi. Eng kichigi — 6. U bilan ish eng kam." },
    btn: { ru: 'Понятно, дальше', uz: "Tushunarli, davom" },
    audio: { ru: 'Подвигай ползунок и найди число клеток, в которое укладываются и половинки, и трети. Если число делится и на два, и на три — куски лягут ровно. Подходят шесть, двенадцать, восемнадцать. Самое маленькое это шесть. Произведение два на три тоже даёт шесть, но если знаменатели больше, бери именно наименьшее число, чтобы было меньше работы.', uz: "Slayderni surib, yarimlar ham, uchdan birlar ham joylashadigan katak sonini toping. Agar son ham ikkiga, ham uchga bo'linsa, bo'laklar tekis tushadi. Olti, o'n ikki, o'n sakkiz mos keladi. Eng kichigi bu olti. Ikki karra uch ham olti beradi, lekin maxrajlar katta bo'lganda ish kam bo'lishi uchun eng kichik sonni oling." }
  },

  // s4 — RULE: umumiy maxraj + ekvivalentlik
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Приведение к общему знаменателю', uz: "Umumiy maxrajga keltirish" },
    title: { ru: 'Приводим обе дроби к общему знаменателю.', uz: "Ikkala kasrni umumiy maxrajga keltiramiz." },
    card_top: { ru: '1/2 умножаем на 3/3: получаем 3/6. Доля стала мельче, но величина та же.', uz: "1/2 ni 3/3 ga ko'paytiramiz: 3/6 chiqadi. Ulush maydalashdi, lekin qiymat o'sha." },
    card_bottom: { ru: '1/3 умножаем на 2/2: получаем 2/6. Теперь у обеих дробей знаменатель 6.', uz: "1/3 ni 2/2 ga ko'paytiramiz: 2/6 chiqadi. Endi ikkala kasrning maxraji 6." },
    card_line: { ru: '1/2 = 3/6,  1/3 = 2/6. Общий знаменатель — 6.', uz: "1/2 = 3/6,  1/3 = 2/6. Umumiy maxraj — 6." },
    special_label: { ru: 'Особый случай', uz: "Maxsus holat" },
    special: { ru: 'Если один знаменатель делится на другой — общим будет больший. Для 1/2 и 1/4 это 4, а не 8: 1/2 = 2/4, и 1/2 + 1/4 = 3/4.', uz: "Agar bir maxraj ikkinchisiga bo'linsa — umumiy maxraj ulardan kattasi. 1/2 va 1/4 uchun bu 4, 8 emas: 1/2 = 2/4, va 1/2 + 1/4 = 3/4." },
    outro: { ru: 'Что умножаешь на знаменателе — умножай и на числителе. Тогда величина дроби не меняется (это правило из урока про эквивалентные дроби).', uz: "Maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga ko'paytiring. Shunda kasr qiymati o'zgarmaydi (bu ekvivalent kasrlar darsidagi qoida)." },
    audio: { ru: 'Запомни правило. Чтобы сложить дроби с разными знаменателями, сначала приводим их к общему знаменателю. Одну вторую умножаем на три третьих и получаем три шестых. Одну третью умножаем на две вторых и получаем две шестых. Теперь у обеих дробей знаменатель шесть. Главное: на что умножаешь знаменатель, на то же умножай и числитель, тогда величина дроби не меняется.', uz: "Qoidani eslab qoling. Har xil maxrajli kasrlarni qo'shish uchun avval ularni umumiy maxrajga keltiramiz. Ikkidan birni uchdan uchga ko'paytirib, oltidan uchni olamiz. Uchdan birni ikkidan ikkiga ko'paytirib, oltidan ikkini olamiz. Endi ikkala kasrning maxraji olti. Eng muhimi: maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga ko'paytiring, shunda kasr qiymati o'zgarmaydi." }
  },

  // s5 — TEST choice p1: umumiy maxraj (1/4, 1/6) → 12
  s5: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Найди общий знаменатель', uz: "Umumiy maxrajni toping" },
    question: { ru: 'Какой общий знаменатель у 1/4 и 1/6?', uz: "1/4 va 1/6 ning umumiy maxraji qaysi?" },
    correct_text: { ru: 'Правильно. 12 делится и на 4, и на 6, и это наименьшее такое число.', uz: "To'g'ri. 12 ham 4 ga, ham 6 ga bo'linadi, va bu eng kichik shunday son." },
    wrong_1: { ru: 'Это сумма знаменателей: 4 + 6 = 10. Но 10 не делится на 4 без остатка — клетки не лягут ровно. Нужно число, на которое делятся оба знаменателя.', uz: "Bu maxrajlar yig'indisi: 4 + 6 = 10. Lekin 10 ni 4 ga qoldiqsiz bo'lib bo'lmaydi — kataklar tekis tushmaydi. Har ikkala maxrajga bo'linadigan son kerak." },
    wrong_2: { ru: 'Это произведение: 4 × 6 = 24. Оно подходит, но не наименьшее. С 12 работы меньше, а 24 потом придётся сокращать.', uz: "Bu ko'paytma: 4 × 6 = 24. U mos keladi, lekin eng kichik emas. 12 bilan ish kam, 24 ni keyin qisqartirishga to'g'ri keladi." },
    wrong_3: { ru: 'Это общий делитель: 2 делит и 4, и 6. Но нам нужно наоборот — число, которое само делится на 4 и на 6.', uz: "Bu umumiy bo'luvchi: 2 ham 4 ni, ham 6 ni bo'ladi. Lekin bizga aksincha kerak — o'zi 4 ga ham, 6 ga ham bo'linadigan son." },
    wrong_default: { ru: 'Нужно наименьшее число, которое делится и на 4, и на 6. Это 12.', uz: "4 ga ham, 6 ga ham bo'linadigan eng kichik son kerak. Bu 12." },
    audio: {
      intro: { ru: 'Найди общий знаменатель для дробей одна четвёртая и одна шестая. Выбери правильный вариант.', uz: "Bir to'rtdan va bir oltidan kasrlari uchun umumiy maxrajni toping. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Двенадцать делится и на четыре, и на шесть.', uz: "To'g'ri. O'n ikki ham to'rtga, ham oltiga bo'linadi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s6 — RULE: suratlarni qo'shamiz, maxraj o'zgarmaydi
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Сложение после приведения', uz: "Keltirgandan keyin qo'shish" },
    title: { ru: 'Знаменатели стали равны — складываем числители.', uz: "Maxrajlar tenglashdi — suratlarni qo'shamiz." },
    card_top: { ru: '3/6 + 2/6: доли теперь одинаковые. Складываем количество: 3 + 2 = 5.', uz: "3/6 + 2/6: ulushlar endi bir xil. Sonini qo'shamiz: 3 + 2 = 5." },
    card_bottom: { ru: 'Знаменатель — размер доли, он остаётся 6. Не складываем его и не умножаем.', uz: "Maxraj — ulush o'lchami, u 6 bo'lib qoladi. Uni qo'shmaymiz ham, ko'paytirmaymiz ham." },
    card_line: { ru: '3/6 + 2/6 = 5/6. Не 5/12!', uz: "3/6 + 2/6 = 5/6. 5/12 emas!" },
    steps_label: { ru: 'Как сложить дроби — 4 шага', uz: "Kasrlarni qanday qo'shamiz — 4 qadam" },
    step1: { ru: 'Найди общий знаменатель (наименьший).', uz: "Umumiy maxrajni toping (eng kichik)." },
    step2: { ru: 'Приведи обе дроби к этому знаменателю.', uz: "Ikkala kasrni shu maxrajga keltiring." },
    step3: { ru: 'Сложи числители, знаменатель оставь.', uz: "Suratlarni qo'shing, maxrajni qoldiring." },
    step4: { ru: 'Если можно — сократи ответ.', uz: "Iloji bo'lsa — javobni qisqartiring." },
    outro: { ru: 'Так стена Отабека закрашена на 5/6 — больше половины. Теперь ответ имеет смысл.', uz: "Shunday qilib Otabekning devori 5/6 ga bo'yalgan — yarimdan ko'p. Endi javob mantiqli." },
    audio: { ru: 'Когда знаменатели уже равны, складываем только числители. Три шестых плюс две шестых: доли одинаковые, складываем их количество, три плюс два пять. Знаменатель это размер доли, он остаётся шесть, его не складывают и не умножают. Получается пять шестых, а не пять двенадцатых. Стена Отабека закрашена на пять шестых, это больше половины.', uz: "Maxrajlar allaqachon teng bo'lganda, faqat suratlarni qo'shamiz. Oltidan uch plyus oltidan ikki: ulushlar bir xil, sonini qo'shamiz, uch plyus ikki besh. Maxraj bu ulush o'lchami, u olti bo'lib qoladi, uni qo'shmaymiz ham, ko'paytirmaymiz ham. Oltidan besh chiqadi, o'n ikkidan besh emas. Otabekning devori oltidan besh ga bo'yalgan, bu yarimdan ko'p." }
  },

  // s7 — TEST NumInput p2: umumiy maxraj (1/4 + 1/6) = 12
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Найди наименьший общий знаменатель для 1/4 + 1/6. Введи число.', uz: "1/4 + 1/6 uchun eng kichik umumiy maxrajni toping. Sonni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Ищи наименьшее число, которое делится и на 4, и на 6. Не сумма и не произведение.', uz: "Ham 4 ga, ham 6 ga bo'linadigan eng kichik sonni qidiring. Yig'indi ham, ko'paytma ham emas." },
    fb_correct: { ru: 'Верно. 12 делится и на 4, и на 6, и это наименьшее такое число.', uz: "To'g'ri. 12 ham 4 ga, ham 6 ga bo'linadi, va bu eng kichik shunday son." },
    audio: {
      intro: { ru: 'Найди наименьший общий знаменатель для одной четвёртой и одной шестой. Введи число и нажми кнопку проверить.', uz: "Bir to'rtdan va bir oltidan uchun eng kichik umumiy maxrajni toping. Sonni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Двенадцать — самое маленькое число, которое делится и на четыре, и на шесть.', uz: "To'g'ri. O'n ikki — to'rtga ham, oltiga ham bo'linadigan eng kichik son." },
      on_wrong: { ru: 'Не совсем. Это не сумма и не произведение знаменателей. Ищи наименьшее общее число.', uz: "Unchalik emas. Bu maxrajlar yig'indisi ham, ko'paytmasi ham emas. Eng kichik umumiy sonni qidiring." }
    }
  },

  // s8 — TEST choice p3: 1/3 = ?/12 → 4/12 (M3)
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Приведи дробь к знаменателю 12', uz: "Kasrni 12 maxrajiga keltiring" },
    question: { ru: '1/3 = ?/12. Какой числитель?', uz: "1/3 = ?/12. Surat qaysi?" },
    correct_text: { ru: 'Правильно. Знаменатель умножили на 4 (3 × 4 = 12), значит и числитель на 4: 1 × 4 = 4. Выходит 4/12.', uz: "To'g'ri. Maxrajni 4 ga ko'paytirdik (3 × 4 = 12), demak suratni ham 4 ga: 1 × 4 = 4. 4/12 chiqadi." },
    wrong_1: { ru: 'Здесь поменяли только знаменатель (3 стало 12), а числитель оставили 1. Но 1/3 не равно 1/12. Что делаешь со знаменателем — делай и с числителем.', uz: "Bu yerda faqat maxraj o'zgartirildi (3 dan 12 bo'ldi), surat esa 1 qoldirildi. Lekin 1/3 ga 1/12 teng emas. Maxrajga nima qilsangiz, suratga ham shuni qiling." },
    wrong_2: { ru: 'Числитель посчитан неверно. Знаменатель умножили на 4, значит числитель тоже: 1 × 4 = 4, а не 3.', uz: "Surat noto'g'ri sanaldi. Maxrajni 4 ga ko'paytirdik, demak suratni ham: 1 × 4 = 4, 3 emas." },
    wrong_3: { ru: '12/12 — это целое, а 1/3 меньше половины. Числитель должен быть 4: 1 × 4 = 4.', uz: "12/12 — bu butun, 1/3 esa yarimdan kichik. Surat 4 bo'lishi kerak: 1 × 4 = 4." },
    wrong_default: { ru: 'Знаменатель умножили на 4, значит и числитель: 1 × 4 = 4. Получается 4/12.', uz: "Maxrajni 4 ga ko'paytirdik, demak suratni ham: 1 × 4 = 4. 4/12 chiqadi." },
    audio: {
      intro: { ru: 'Приведи дробь одна третья к знаменателю двенадцать. Какой будет числитель? Выбери ответ.', uz: "Bir uchdan kasrini o'n ikki maxrajiga keltiring. Surat qanday bo'ladi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Умножили на четыре и числитель, и знаменатель. Вышло четыре двенадцатых.', uz: "To'g'ri. Suratni ham, maxrajni ham to'rtga ko'paytirdik. O'n ikkidan to'rt chiqdi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s9 — TEST choice p4: 1/2 + 1/3 = 5/6 (M1 central)
  s9: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сложи дроби', uz: "Kasrlarni qo'shing" },
    question: { ru: '1/2 + 1/3 = ?', uz: "1/2 + 1/3 = ?" },
    correct_text: { ru: 'Правильно. Привели к шестым: 1/2 = 3/6, 1/3 = 2/6. Сложили числители: 3 + 2 = 5. Знаменатель 6. Это 5/6.', uz: "To'g'ri. Oltilarga keltirdik: 1/2 = 3/6, 1/3 = 2/6. Suratlarni qo'shdik: 3 + 2 = 5. Maxraj 6. Bu 5/6." },
    wrong_1: { ru: 'Здесь сложены и числители, и знаменатели: (1+1)/(2+3). Но доли разного размера так складывать нельзя. Сначала общий знаменатель 6, потом 3/6 + 2/6 = 5/6.', uz: "Bu yerda suratlar ham, maxrajlar ham qo'shilgan: (1+1)/(2+3). Lekin har xil o'lchamdagi ulushlarni bunday qo'shib bo'lmaydi. Avval umumiy maxraj 6, keyin 3/6 + 2/6 = 5/6." },
    wrong_2: { ru: 'Числители сложены верно, но знаменатели перемножены (2 × 6). Знаменатель остаётся 6, а не 12. Ответ 5/6.', uz: "Suratlar to'g'ri qo'shilgan, lekin maxrajlar ko'paytirilgan (2 × 6). Maxraj 6 bo'lib qoladi, 12 emas. Javob 5/6." },
    wrong_3: { ru: 'Приведена только одна дробь. Утром закрашено 3/6, а не 1/6. Нужно 3/6 + 2/6 = 5/6.', uz: "Faqat bitta kasr keltirilgan. Ertalab 3/6 bo'yalgan, 1/6 emas. 3/6 + 2/6 = 5/6 kerak." },
    wrong_default: { ru: 'Приведи к шестым: 1/2 = 3/6, 1/3 = 2/6. Тогда 3/6 + 2/6 = 5/6.', uz: "Oltilarga keltiring: 1/2 = 3/6, 1/3 = 2/6. U holda 3/6 + 2/6 = 5/6." },
    audio: {
      intro: { ru: 'Сложи одну вторую и одну третью. Выбери правильный вариант.', uz: "Ikkidan bir va uchdan birni qo'shing. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Три шестых плюс две шестых это пять шестых.', uz: "To'g'ri. Oltidan uch plyus oltidan ikki bu oltidan besh." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s10 — CASE setup: Akmalning polizi
  s10: {
    eyebrow: { ru: 'Задача · огород', uz: "Masala · poliz" },
    title: { ru: 'Акмаль засеял грядку.', uz: "Akmal polizni ekdi." },
    body_p1: { ru: 'Акмаль засадил 1/3 грядки помидорами и 1/4 грядки перцем. Какую часть грядки он засадил всего?', uz: "Akmal polizning 1/3 qismiga pomidor, 1/4 qismiga qalampir ekdi. Polizning jami qancha qismini ekdi?" },
    card_line_label: { ru: 'Помидоры', uz: "Pomidor" },
    card_line_value: { ru: '1/3 грядки', uz: "polizning 1/3 qismi" },
    card_parts_label: { ru: 'Перец', uz: "Qalampir" },
    card_parts_value: { ru: '1/4 грядки', uz: "polizning 1/4 qismi" },
    outro: { ru: 'Знаменатели разные — 3 и 4. Сначала найди общий знаменатель, потом сложи.', uz: "Maxrajlar har xil — 3 va 4. Avval umumiy maxrajni toping, keyin qo'shing." },
    btn_help: { ru: 'Помочь Акмалю', uz: "Akmalga yordam berish" },
    audio: { ru: 'Акмаль засеял грядку. Одну третью грядки он засадил помидорами, а одну четвёртую перцем. Какую часть грядки он засадил всего? Знаменатели разные, три и четыре. Сначала найдём общий знаменатель, потом сложим. Помоги Акмалю на следующем шаге.', uz: "Akmal polizni ekdi. Polizning uchdan birini pomidor bilan, to'rtdan birini qalampir bilan ekdi. Polizning jami qancha qismini ekdi? Maxrajlar har xil, uch va to'rt. Avval umumiy maxrajni topamiz, keyin qo'shamiz. Keyingi bosqichda Akmalga yordam bering." }
  },

  // s11 — CASE step p5: umumiy maxraj (3, 4) → 12
  s11: {
    eyebrow: { ru: 'Задача · 1-й шаг', uz: "Masala · 1-qadam" },
    label: { ru: 'Найди общий знаменатель', uz: "Umumiy maxrajni toping" },
    question: { ru: 'Какой общий знаменатель у 1/3 и 1/4?', uz: "1/3 va 1/4 ning umumiy maxraji qaysi?" },
    correct_text: { ru: 'Правильно. 12 делится и на 3, и на 4, и это наименьшее такое число.', uz: "To'g'ri. 12 ham 3 ga, ham 4 ga bo'linadi, va bu eng kichik shunday son." },
    wrong_1: { ru: 'Это сумма: 3 + 4 = 7. Но 7 не делится ни на 3, ни на 4 — на такую сетку доли не лягут. Нужно число, которое делится на оба.', uz: "Bu yig'indi: 3 + 4 = 7. Lekin 7 ni na 3 ga, na 4 ga bo'lib bo'lmaydi — bunday to'rga ulushlar tushmaydi. Har ikkalasiga bo'linadigan son kerak." },
    wrong_2: { ru: '3 делится на 3, но не делится на 4 — перец не ляжет на сетку ровно. Нужно число, которое делится и на 3, и на 4.', uz: "3 ni 3 ga bo'lib bo'ladi, lekin 4 ga bo'linmaydi — qalampir to'rga tekis tushmaydi. Ham 3 ga, ham 4 ga bo'linadigan son kerak." },
    wrong_3: { ru: 'Это произведение: 3 × 4 = 24. Оно подходит, но не наименьшее. С 12 работы меньше.', uz: "Bu ko'paytma: 3 × 4 = 24. U mos keladi, lekin eng kichik emas. 12 bilan ish kam." },
    wrong_default: { ru: 'Нужно наименьшее число, которое делится и на 3, и на 4. Это 12.', uz: "3 ga ham, 4 ga ham bo'linadigan eng kichik son kerak. Bu 12." },
    audio: {
      intro: { ru: 'Найди общий знаменатель для одной третьей и одной четвёртой. Выбери ответ.', uz: "Bir uchdan va bir to'rtdan uchun umumiy maxrajni toping. Javobni tanlang." },
      on_correct: { ru: 'Верно. Двенадцать делится и на три, и на четыре.', uz: "To'g'ri. O'n ikki ham uchga, ham to'rtga bo'linadi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — CASE conclusion FINAL: 1/3 + 1/4 = 7/12 (M1)
  s12: {
    eyebrow: { ru: 'Задача · итог', uz: "Masala · natija" },
    label: { ru: 'Сколько засажено всего?', uz: "Jami qancha ekildi?" },
    question: { ru: '1/3 + 1/4 = ?', uz: "1/3 + 1/4 = ?" },
    correct_text: { ru: 'Правильно. Привели к 12: 1/3 = 4/12, 1/4 = 3/12. Сложили: 4 + 3 = 7. Засажено 7/12 грядки.', uz: "To'g'ri. 12 ga keltirdik: 1/3 = 4/12, 1/4 = 3/12. Qo'shdik: 4 + 3 = 7. Polizning 7/12 qismi ekildi." },
    wrong_1: { ru: 'Здесь сложены и числители, и знаменатели: (1+1)/(3+4). Так нельзя — доли разного размера. Сначала общий знаменатель 12: 4/12 + 3/12 = 7/12.', uz: "Bu yerda suratlar ham, maxrajlar ham qo'shilgan: (1+1)/(3+4). Bunday bo'lmaydi — ulushlar har xil o'lchamda. Avval umumiy maxraj 12: 4/12 + 3/12 = 7/12." },
    wrong_2: { ru: 'Взят знаменатель 24 (произведение) и не пересчитан. Наименьший общий — 12. Тогда 4/12 + 3/12 = 7/12.', uz: "Maxraj 24 (ko'paytma) olingan va qayta sanalmagan. Eng kichik umumiy — 12. U holda 4/12 + 3/12 = 7/12." },
    wrong_3: { ru: 'При приведении потеряны числители. 1/3 = 4/12 (не 1/12), 1/4 = 3/12. Сумма 7/12.', uz: "Keltirishda suratlar yo'qolgan. 1/3 = 4/12 (1/12 emas), 1/4 = 3/12. Yig'indi 7/12." },
    wrong_default: { ru: 'Приведи к 12: 1/3 = 4/12, 1/4 = 3/12. Тогда 4/12 + 3/12 = 7/12.', uz: "12 ga keltiring: 1/3 = 4/12, 1/4 = 3/12. U holda 4/12 + 3/12 = 7/12." },
    audio: {
      intro: { ru: 'Сложи одну третью и одну четвёртую. Сколько грядки засажено всего? Выбери ответ.', uz: "Bir uchdan va bir to'rtdan qo'shing. Polizning jami qancha qismi ekildi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Четыре двенадцатых плюс три двенадцатых это семь двенадцатых.', uz: "To'g'ri. O'n ikkidan to'rt plyus o'n ikkidan uch bu o'n ikkidan yetti." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // s13 — SUMMARY + ConnectionsBlock
  s13: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты складываешь дроби с разными знаменателями.', uz: "Endi siz har xil maxrajli kasrlarni qo'shasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Дроби с разными знаменателями нельзя складывать сразу — доли разного размера.', uz: "Har xil maxrajli kasrlarni darrov qo'shib bo'lmaydi — ulushlar har xil o'lchamda." },
    main_2: { ru: 'Сначала приводим к общему знаменателю — наименьшему числу, которое делится на оба знаменателя.', uz: "Avval umumiy maxrajga keltiramiz — har ikkala maxrajga bo'linadigan eng kichik songa." },
    main_3: { ru: 'Приводя дробь, умножаем и числитель, и знаменатель на одно число (1/3 = 4/12).', uz: "Kasrni keltirganda, suratni ham, maxrajni ham bir songa ko'paytiramiz (1/3 = 4/12)." },
    main_4: { ru: 'Потом складываем числители, а знаменатель оставляем (3/6 + 2/6 = 5/6).', uz: "Keyin suratlarni qo'shamiz, maxrajni qoldiramiz (3/6 + 2/6 = 5/6)." },
    back_to_hook: { ru: 'Отабек ошибся: 1/2 + 1/3 это не 2/5. Привели к шестым — 3/6 + 2/6 = 5/6. Стена закрашена на 5/6.', uz: "Otabek xato qildi: 1/2 + 1/3 bu 2/5 emas. Oltilarga keltirdik — 3/6 + 2/6 = 5/6. Devor 5/6 ga bo'yalgan." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с равным знаменателем» (складываем числители) и «Эквивалентные дроби» (приведение к общему знаменателю).', uz: "«Teng maxrajli kasrlarni qo'shish» (suratlarni qo'shamiz) va «Ekvivalent kasrlar» (umumiy maxrajga keltirish)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты складываешь дроби с разными знаменателями. Складывать их сразу нельзя, доли разного размера. Сначала приводим к общему знаменателю, это наименьшее число, которое делится на оба знаменателя. Приводя дробь, умножаем и числитель, и знаменатель на одно число. Потом складываем числители, а знаменатель оставляем. Отабек в начале ошибся: одна вторая плюс одна третья это не две пятых, а пять шестых. Дальше научимся вычитать дроби с разными знаменателями.', uz: "Zo'r. Endi siz har xil maxrajli kasrlarni qo'shasiz. Ularni darrov qo'shib bo'lmaydi, ulushlar har xil o'lchamda. Avval umumiy maxrajga keltiramiz, bu har ikkala maxrajga bo'linadigan eng kichik son. Kasrni keltirganda, suratni ham, maxrajni ham bir songa ko'paytiramiz. Keyin suratlarni qo'shamiz, maxrajni qoldiramiz. Otabek boshida xato qildi: ikkidan bir plyus uchdan bir bu beshdan ikki emas, oltidan besh. Keyin har xil maxrajli kasrlarni ayirishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_06: горизонтальная «стена» (WallBar) + 2D-наложение (OverlayWall)
// + соединение долей (CombineBar). accent — 1-е слагаемое, blue — 2-е.
// ============================================================

// Подпись-формула из дробей: a/d (+ b/d) (= sum/d). Слагаемые из parts.
const FracSum = ({ parts, sumN, sumD, sumColor = T.success }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    {parts.map((p, j) => (
      <React.Fragment key={j}>
        {j > 0 && <Op>+</Op>}
        <Frac n={String(p.n)} d={String(p.d)} size="mid" color={p.c}/>
      </React.Fragment>
    ))}
    {sumN != null && <><Op>=</Op><Frac n={String(sumN)} d={String(sumD)} size="mid" color={sumColor}/></>}
  </div>
);

// Эквивалентность: a/b × k/k = (a*k)/(b*k) — строка приведения.
const EquivRow = ({ a, b, k, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', justifyContent: 'center', flexWrap: 'wrap' }}>
    <Frac n={String(a)} d={String(b)} size="mid" color={color}/>
    <span className="mop" style={{ color: T.ink3 }}>×</span>
    <Frac n={String(k)} d={String(k)} size="sm" color={T.ink3}/>
    <Op>=</Op>
    <Frac n={String(a * k)} d={String(b * k)} size="mid" color={color}/>
  </div>
);

// Горизонтальная «стена»: cols равных столбцов. accentW/blueW — доли (0..1) закрашенной
// длины (blue после accent). Разделители за пределами baseCols ВЪЕЗЖАЮТ (sweep) — это
// и есть «приведение на месте»: закрашенная длина не меняется, дробится мельче.
// markers — фиксированные вертикальные метки (для поиска общего знаменателя на s3).
const WallBar = ({ cols, accentW = 0, blueW = 0, baseCols, animateDividers = false, growFill = false, markers = [], aColor = T.accent, lineColor = T.bg, h = 86, maxW = 460 }) => {
  const base = baseCols || cols;
  const lines = [];
  for (let i = 1; i < cols; i++) {
    const isBase = Number.isInteger((i / cols) * base);
    lines.push({ pos: (i / cols) * 100, anim: animateDividers && !isBase, idx: i });
  }
  return (
    <div className="wb-wrap" style={{ position: 'relative', width: '100%', maxWidth: maxW, height: h, margin: '0 auto', borderRadius: 12, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      {accentW > 0 && <div className={growFill ? 'wb-fill wb-grow' : 'wb-fill'} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${accentW * 100}%`, background: aColor }}><span className="ag-shine"/></div>}
      {blueW > 0 && <div className={growFill ? 'wb-fill wb-grow' : 'wb-fill'} style={{ position: 'absolute', left: `${accentW * 100}%`, top: 0, bottom: 0, width: `${blueW * 100}%`, background: T.blue }}><span className="ag-shine"/></div>}
      {lines.map((l, k) => (
        <div key={k} className={l.anim ? 'wb-line wb-line-anim' : 'wb-line'} style={{ position: 'absolute', left: `${l.pos}%`, top: 0, bottom: 0, width: 2, background: lineColor, animationDelay: l.anim ? `${0.5 + k * 0.12}s` : undefined }}/>
      ))}
      {markers.map((m, k) => (
        <div key={'m' + k} className={m.align ? 'wb-mark wb-mark-on' : 'wb-mark'} style={{ position: 'absolute', left: `${m.pos}%`, background: m.align ? T.success : T.ink3 }}/>
      ))}
    </div>
  );
};

// 2D-стена для s2: горизонтальный раздел (половинки) уже есть; при step>=2 вертикальные
// разделы (трети) ВЪЕЗЖАЮТ и режут верхнюю половину на 3 клетки (3/6); step>=3 — низ-слева 2/6 blue.
const OverlayWall = ({ step }) => {
  const showV = step >= 2, showBlue = step >= 3;
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 300, height: 168, margin: '0 auto', borderRadius: 12, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '50%', background: T.accent }}><span className="ag-shine"/></div>
      {showBlue && <div className="ag-blue-in" style={{ position: 'absolute', left: 0, top: '50%', width: `${(2 / 3) * 100}%`, height: '50%', background: T.blue }}><span className="ag-shine"/></div>}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: T.bg }}/>
      {showV && [1, 2].map(i => <div key={i} className="wb-line wb-line-anim" style={{ position: 'absolute', left: `${(i / 3) * 100}%`, top: 0, bottom: 0, width: 2, background: T.bg, animationDelay: `${0.15 + i * 0.18}s` }}/>)}
    </div>
  );
};

// 6-столбцовый бар для s6: 3 accent (готовы) + 2 blue, которые ВЪЕЗЖАЮТ снизу (slide) —
// сложение как физическое соединение долей в одну полосу (3/6 + 2/6 = 5/6).
const CombineBar = () => {
  const cols = 6;
  return (
    <div className="wb-wrap" style={{ position: 'relative', width: '100%', maxWidth: 420, height: 64, margin: '0 auto', borderRadius: 12, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}`, display: 'flex' }}>
      {Array.from({ length: cols }).map((_, i) => {
        const isA = i < 3, isB = i >= 3 && i < 5;
        const bg = isA ? T.accent : (isB ? T.blue : 'transparent');
        const cls = isA ? 'ag-cell wb-pop' : (isB ? 'ag-cell wb-slidein' : 'ag-cell');
        const delay = isA ? `${i * 0.12}s` : (isB ? `${0.6 + (i - 3) * 0.28}s` : undefined);
        return (
          <div key={i} className={cls} style={{ flex: 1, position: 'relative', borderRight: i < cols - 1 ? `2px solid ${T.bg}` : 'none', background: bg, animationDelay: delay }}>
            {bg !== 'transparent' && <span className="ag-shine"/>}
          </div>
        );
      })}
    </div>
  );
};

// Полоса из cols РАВНЫХ клеток с дискретной заливкой дроби num/den (для s3).
// Если доля укладывается в целое число клеток — чисто, рамка зелёная. Если нет —
// последняя клетка закрашена частично (видно, что не делится ровно), рамка серая.
const CellBar = ({ cols, num, den, color }) => {
  const shaded = (num / den) * cols;
  const full = Math.floor(shaded + 1e-9);
  const part = shaded - full;
  const whole = part < 1e-9;
  return (
    <div className="wb-wrap" style={{ position: 'relative', display: 'flex', width: '100%', height: 44, borderRadius: 10, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${whole ? T.success : T.ink3}` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} style={{ flex: 1, position: 'relative', borderRight: i < cols - 1 ? `2px solid ${T.bg}` : 'none', background: i < full ? color : 'transparent', overflow: 'hidden' }}>
          {i === full && part > 1e-9 && <div className="cb-part" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${part * 100}%`, background: color }}/>}
        </div>
      ))}
    </div>
  );
};

// Компактные мини-бары для шапки test-экрана: иллюстрируют дроби из вопроса
// (закрашенная доля + лёгкая сетка). bare — без рамки (для NumInputScreen, у него своя).
const QBars = ({ items, bare = false }) => {
  const inner = items.map((it, k) => (
    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Frac n={it.n} d={it.d} size="sm" color={it.color}/>
      <div style={{ flex: 1 }}><WallBar cols={it.cols} accentW={it.w} aColor={it.color} lineColor={'rgba(167, 166, 162, 0.45)'} h={38} maxW={9999}/></div>
    </div>
  ));
  if (bare) return <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>{inner}</div>;
  return <div className="frame" style={{ marginTop: 14, padding: 'clamp(12px, 2vw, 16px)', display: 'flex', flexDirection: 'column', gap: 10 }}>{inner}</div>;
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

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

// s0 — HOOK: Otabek devorni bo'ydi, 1/2 + 1/3 = 2/5?
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
        <h1 className="title h-title fade-up">{mt(t(c.title))}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="1" d="2" size="mid"/><Op>+</Op><Frac n="1" d="3" size="mid"/><Op>=</Op><Frac n="2" d="5" size="mid" color={T.accent}/><span className="mop" style={{ color: T.ink3 }}>?</span></div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{mt(t(c.body))}</p>
        <h2 className="title h-sub fade-up delay-2">{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: куски разного размера (1/2 и 1/3)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); setTimeout(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step >= 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}><WallBar cols={2} accentW={0.5} growFill aColor={T.accent} h={60} maxW={9999}/></div>
                <Frac n="1" d="2" size="mid" color={T.accent}/>
              </div>
            )}
            {step >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}><WallBar cols={3} accentW={1 / 3} growFill aColor={T.blue} h={60} maxW={9999}/></div>
                <Frac n="1" d="3" size="mid" color={T.blue}/>
              </div>
            )}
          </div>
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION step: наложение → 6 клеток (3/6 + 2/6)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); setTimeout(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
          {step >= 1 && <OverlayWall step={step}/>}
          {step >= 3 && <FracSum parts={[{ n: 3, d: 6, c: T.accent }, { n: 2, d: 6, c: T.blue }]} sumN={5} sumD={6}/>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION slider: поиск наименьшего общего числа клеток
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [n, setN] = useState(5);
  const halfOk = n % 2 === 0, thirdOk = n % 3 === 0;
  const fit = halfOk && thirdOk;
  const chk = (ok, cells) => ok
    ? <Frac n={String(cells)} d={String(n)} size="sm" color={T.success}/>
    : <span className="mono small" style={{ color: T.ink3 }}>—</span>;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className={fit ? 'frame fade-up delay-1 fig-glow' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Frac n="1" d="2" size="sm" color={T.accent}/>
            <div style={{ flex: 1 }}><CellBar cols={n} num={1} den={2} color={T.accent}/></div>
            <div style={{ minWidth: 58, textAlign: 'center' }}>{chk(halfOk, n / 2)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Frac n="1" d="3" size="sm" color={T.blue}/>
            <div style={{ flex: 1 }}><CellBar cols={n} num={1} den={3} color={T.blue}/></div>
            <div style={{ minWidth: 58, textAlign: 'center' }}>{chk(thirdOk, n / 3)}</div>
          </div>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: fit ? T.success : T.ink2, fontWeight: fit ? 600 : 400 }}>{t(fit ? c.note_fit : c.note_nofit)}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.label_slider)}: {n}</p>
          <Slider value={n} min={2} max={12} onChange={setN}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE: umumiy maxraj + ekvivalentlik (1/2=3/6, 1/3=2/6)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <WallBar cols={6} accentW={0.5} baseCols={2} animateDividers aColor={T.accent} h={50} maxW={9999}/>
            <EquivRow a={1} b={2} k={3} color={T.accent}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <WallBar cols={6} accentW={1 / 3} baseCols={3} animateDividers aColor={T.blue} h={50} maxW={9999}/>
            <EquivRow a={1} b={3} k={2} color={T.blue}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 460, margin: '0 auto' }}>
            <p className="small" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="eyebrow" style={{ margin: 0, color: '#A07D14' }}>{t(c.special_label)}</p>
          <p className="small" style={{ margin: 0 }}>{mt(t(c.special))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s5 — TEST choice: общий знаменатель 1/4 и 1/6 -> 12 (правильный на C)
const Screen5 = (props) => {
  const t = useT(); const c = CONTENT.s5;
  const ns = { fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 };
  const base = [
    <span className="mono" style={ns}>12</span>,
    <span className="mono" style={ns}>10</span>,
    <span className="mono" style={ns}>24</span>,
    <span className="mono" style={ns}>2</span>
  ];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '4', cols: 4, w: 1 / 4, color: T.accent }, { n: '1', d: '6', cols: 6, w: 1 / 6, color: T.blue }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={5} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[5]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s6 — RULE: складываем числители, знаменатель оставляем (3/6 + 2/6 = 5/6)
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <FracSum parts={[{ n: 3, d: 6, c: T.accent }, { n: 2, d: 6, c: T.blue }]} sumN={5} sumD={6}/>
          <CombineBar/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
            <p className="eyebrow" style={{ margin: 0, color: T.ink2 }}>{t(c.steps_label)}</p>
            {[c.step1, c.step2, c.step3, c.step4].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span>
                <p className="body" style={{ margin: 0 }}>{mt(t(s))}</p>
              </div>
            ))}
            <p className="small" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST input: общий знаменатель 1/4 + 1/6 -> 12
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <NumInputScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={12}
    renderVisual={() => <QBars bare items={[{ n: '1', d: '4', cols: 4, w: 1 / 4, color: T.accent }, { n: '1', d: '6', cols: 6, w: 1 / 6, color: T.blue }]}/>}/>;
};

// s8 — TEST choice: 1/3 = ?/12 -> 4/12 (правильный на B)
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [<Frac n="4" d="12" size="mid"/>, <Frac n="1" d="12" size="mid"/>, <Frac n="3" d="12" size="mid"/>, <Frac n="12" d="12" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '3', cols: 3, w: 1 / 3, color: T.accent }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s9 — TEST choice: 1/2 + 1/3 -> 5/6 (правильный на D)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [<Frac n="5" d="6" size="mid"/>, <Frac n="2" d="5" size="mid"/>, <Frac n="5" d="12" size="mid"/>, <Frac n="2" d="6" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '2', cols: 2, w: 1 / 2, color: T.accent }, { n: '1', d: '3', cols: 3, w: 1 / 3, color: T.blue }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s10 — CASE setup: Akmalning polizi (1/3 + 1/4)
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}><WallBar cols={3} accentW={1 / 3} growFill aColor={T.accent} h={56} maxW={9999}/></div>
            <Frac n="1" d="3" size="mid" color={T.accent}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}><WallBar cols={4} accentW={1 / 4} growFill aColor={T.blue} h={56} maxW={9999}/></div>
            <Frac n="1" d="4" size="mid" color={T.blue}/>
          </div>
        </div>
        <p className="body fade-up delay-2">{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s11 — CASE step: общий знаменатель 3 и 4 -> 12 (правильный на A)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const ns = { fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 600 };
  const base = [
    <span className="mono" style={ns}>12</span>,
    <span className="mono" style={ns}>7</span>,
    <span className="mono" style={ns}>3</span>,
    <span className="mono" style={ns}>24</span>
  ];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '3', cols: 3, w: 1 / 3, color: T.accent }, { n: '1', d: '4', cols: 4, w: 1 / 4, color: T.blue }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s12 — CASE conclusion FINAL: 1/3 + 1/4 -> 7/12 (правильный на C)
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [<Frac n="7" d="12" size="mid"/>, <Frac n="2" d="7" size="mid"/>, <Frac n="7" d="24" size="mid"/>, <Frac n="1" d="12" size="mid"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 1, 0, 3]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '3', cols: 3, w: 1 / 3, color: T.accent }, { n: '1', d: '4', cols: 4, w: 1 / 4, color: T.blue }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s13 — SUMMARY + связи
const Screen13 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.success }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FracSum parts={[{ n: 1, d: 2, c: T.accent }, { n: 1, d: 3, c: T.blue }]} sumN={5} sumD={6}/>
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

// ============================================================
// CSS-БЛОК (STYLES) — визуальный язык v15 из infrastructure_v1 + math-дополнения
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
.h-title { font-size: clamp(22px, 3.4vw, 30px); }
.h-sub { font-size: clamp(16px, 2.2vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(20px, 3.2vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(8px, 1.4vw, 12px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(8px, 1.3vw, 12px);
  padding-bottom: clamp(12px, 2.2vw, 20px);
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
  padding-top: clamp(9px, 1.5vw, 11px);
  padding-bottom: clamp(9px, 1.5vw, 11px);
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
  padding: clamp(13px, 2.2vw, 17px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
}
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(11px, 1.8vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(11px, 1.8vw, 14px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}

/* MATH: анимация появления цифры в квадрате. */
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(11px, 1.8vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* MATH: сравнение разных знаменателей — приведение к общим долям (frac_5_07). */
.cp-row { animation: cpRowIn 0.42s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpRowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.cp-grow { animation: cpGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpGrow { from { width: 0; } }
/* линии сетки въезжают слева направо (деление на общие доли) */
.cp-line { animation: cpLineIn 0.32s ease-out backwards; transform-origin: center top; }
@keyframes cpLineIn { from { opacity: 0; transform: scaleY(0.1); } to { opacity: 1; transform: scaleY(1); } }
.cp-marker { animation: cpMarkerIn 0.3s ease-out backwards; }
@keyframes cpMarkerIn { from { opacity: 0; } }
.cp-slide { animation: cpSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpSlide { from { left: 0; } }
.cp-flag { transform-origin: bottom left; animation: cpFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, cpFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cpFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cpFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
/* ориентир 1/2 въезжает к центру; точки-дроби мягко появляются */
.cp-half-in { animation: cpHalfIn 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpHalfIn { from { left: 0; opacity: 0; } }
.cp-dot-wrap { animation: cpDotIn 0.35s ease-out backwards; }
@keyframes cpDotIn { from { opacity: 0; } }
/* MATH: сокращение — слияние долей, счётчик, лесенка деления (frac_5_08). */
.cp-merge { animation: cpMerge 0.5s ease forwards; }
@keyframes cpMerge { from { opacity: 1; } to { opacity: 0; } }
.cp-spin { animation: cpSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes cpSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.cp-ladder-step { animation: cpLadderIn 0.4s ease-out backwards; }
@keyframes cpLadderIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }

/* MATH frac_5_09: круг+полоса фигура, интерактивные доли, drag-чипы. */
.fig-cell { transition: background 0.38s cubic-bezier(0.34, 1.1, 0.64, 1); }
.fig-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
.chip {
  font-family: 'JetBrains Mono', monospace; font-weight: 600;
  border: none; border-radius: 10px; cursor: grab; color: #FFFFFF;
  box-shadow: 0 6px 16px -5px rgba(58, 53, 48, 0.42);
  touch-action: none; user-select: none; -webkit-user-select: none;
  transition: box-shadow 0.2s, filter 0.2s;
}
.chip:hover { filter: brightness(1.06); box-shadow: 0 9px 22px -5px rgba(58, 53, 48, 0.5); }
.chip:active { cursor: grabbing; }
.chip-pop { animation: chipPop 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) backwards; }
@keyframes chipPop { from { opacity: 0; transform: scale(0.5); } }
.fig-glow { animation: figGlow 0.7s ease; }
@keyframes figGlow {
  0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); }
  50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); }
  100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); }
}
.fig-pulse { animation: figPulse 0.55s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes figPulse { 0% { transform: scale(1); } 35% { transform: scale(1.06); } 100% { transform: scale(1); } }

/* MATH frac_5_06: 2D area/grid (стена/грядка) — клетки заполняются, сетка въезжает при появлении. */
.ag-wrap { position: relative; }
.ag-cell { position: relative; transition: background 0.42s cubic-bezier(0.34, 1.1, 0.64, 1); }
.ag-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
.ag-in .ag-grid { animation: agGridIn 0.5s cubic-bezier(0.34, 1.1, 0.64, 1); }
@keyframes agGridIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
/* afternoon blue-блок въезжает (s2 overlay) */
.ag-blue-in { animation: agBlueIn 0.45s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes agBlueIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* MATH frac_5_06: горизонтальная стена WallBar — рост заливки, въезд разделителей, snap-маркеры, slide. */
.wb-fill .ag-shine { position: absolute; inset: 0; pointer-events: none; }
.wb-grow { animation: wbGrow 0.6s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes wbGrow { from { width: 0; } }
.wb-line { transform-origin: center top; }
.wb-line-anim { animation: wbLineIn 0.4s ease-out backwards; }
@keyframes wbLineIn { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
.wb-mark { top: -4px; bottom: -4px; width: 3px; border-radius: 2px; transform: translateX(-50%); opacity: 0.55; }
.wb-mark-on { opacity: 1; box-shadow: 0 0 8px rgba(31, 122, 77, 0.6); animation: wbSnap 0.4s cubic-bezier(0.34, 1.5, 0.64, 1); }
@keyframes wbSnap { 0% { transform: translateX(-50%) scaleY(0.55); } 60% { transform: translateX(-50%) scaleY(1.15); } 100% { transform: translateX(-50%) scaleY(1); } }
.wb-slidein { animation: wbSlideIn 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) backwards; }
@keyframes wbSlideIn { from { transform: translateY(70px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.wb-pop { animation: wbPop 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) backwards; }
@keyframes wbPop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
`;
