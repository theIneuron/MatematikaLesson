import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Вычитание дробей с равными знаменателями — frac_5_10
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
// --- ПОД УРОК: frac_5_14 — Перевод смешанного <-> неправильную дробь ---
// СЮЖЕТ: квест охотника за сокровищами (Дониёр). Монеты складываются в сундуки,
// каждый сундук вмещает [знаменатель] монет. Неправильная дробь = все монеты;
// смешанное число = полные сундуки + остаток. Деление с остатком = «сколько сундуков».
// Обновления по PROMPT 2026-06-13: spaced-retrieval разминка (s1), слайды связаны
// линкерами (4-A), типы заданий чередуются, факты — крупная анимация/короткий голос,
// доступность (✓/✗ + prefers-reduced-motion), анимация на s0 и в пустотах.
// ============================================================
const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'frac-5-14-v1',
  lessonTitle: { ru: 'Перевод смешанного числа в неправильную дробь и обратно', uz: "Aralash sonni noto'g'ri kasrga va aksincha o'tkazish" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },   // spaced retrieval (frac_5_13)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'example',     template: 'custom',         scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'DragMatch',      scored: true,  scope: 'practice' },
  { id: 's14', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's15', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Приключение', uz: "Sarguzasht" },
    title: { ru: 'Карта клада с пометкой', uz: "Belgili xazina xaritasi" },
    lead: { ru: 'Дониёр нашёл старую карту сокровищ. На ней клад отмечен как «пять третьих сундука золота». В один сундук помещается три монеты.', uz: "Doniyor eski xazina xaritasini topdi. Unda xazina «uchdan besh sandiq oltin» deb belgilangan. Bitta sandiqqa uchta tanga sig'adi." },
    question: { ru: 'Пять третьих — это одно количество или ошибочная пометка?', uz: "Uchdan besh — bu bitta miqdormi yoki xato belgimi?" },
    options: [
      { ru: 'Это одно количество', uz: "Bu bitta miqdor" },
      { ru: 'Нет, это ошибка', uz: "Yo'q, bu xato" },
      { ru: 'Не уверен(а)', uz: "Ishonchim komil emas" },
    ],
    audio: { ru: 'Дониёр нашёл старую карту сокровищ. На ней клад отмечен как пять третьих сундука золота, а в один сундук входит три монеты. Как вы думаете, пять третьих — это одно настоящее количество или ошибочная пометка? Выберите ответ.', uz: "Doniyor eski xazina xaritasini topdi. Unda xazina uchdan besh sandiq oltin deb belgilangan, bitta sandiqqa esa uchta tanga sig'adi. Sizningcha, uchdan besh — bu bitta haqiqiy miqdormi yoki xato belgimi? Javobni tanlang." }
  },
  // s1 — SPACED RETRIEVAL: разминка по прошлому уроку (правильная/неправильная дробь)
  // s1 — SPACED RETRIEVAL: классификация по 3 сундукам (правильная/неправильная/смешанное) — обзор frac_5_13
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslab ko'ring" },
    title: { ru: 'Разложите по трём сундукам', uz: "Uchta savatga ajrating" },
    lead: { ru: 'Прежде чем идти за кладом, вспомним прошлый урок: разложите записи по трём сундукам.', uz: "Xazina ortidan ketishdan oldin o'tgan darsni eslaylik: yozuvlarni uchta savatga ajrating." },
    baskets: { ru: ['Правильная', 'Неправильная', 'Смешанное'], uz: ["To'g'ri kasr", "Noto'g'ri kasr", "Aralash son"] },
    cards: [
      { v: '2/3', cat: 0 },
      { v: '5/3', cat: 1 },
      { v: '1 2/3', cat: 2 },
      { v: '7/4', cat: 1 },
    ],
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    pick_hint: { ru: 'Сначала разложите все карточки, потом проверьте.', uz: "Avval hamma kartani joylang, keyin tekshiring." },
    retry_hint: { ru: 'Некоторые не в своём сундуке. Правильная — верх меньше низа; неправильная — больше; смешанное — есть целое.', uz: "Ba'zilari o'z savatida emas. To'g'ri kasr — surat kichik; noto'g'ri — katta; aralash — butun ham bor." },
    fb_correct: { ru: '✓ Верно! Правильная — верх меньше низа, неправильная — больше, смешанное — целое и дробь. Как раз неправильные и смешанные мы будем превращать.', uz: "✓ To'g'ri! To'g'ri kasr — surat kichik, noto'g'ri — katta, aralash — butun va kasr. Aynan noto'g'ri va aralashni aylantiramiz." },
    audio: {
      intro: { ru: 'Прежде чем идти за кладом, вспомним прошлый урок. Разложите записи по трём сундукам: правильная дробь, неправильная дробь и смешанное число. Потом проверьте.', uz: "Xazina ortidan ketishdan oldin o'tgan darsni eslaylik. Yozuvlarni uchta savatga ajrating: to'g'ri kasr, noto'g'ri kasr va aralash son. Keyin tekshiring." },
      on_correct: { ru: 'Верно, все по своим сундукам.', uz: "To'g'ri, hammasi o'z savatida." },
      on_wrong: { ru: 'Не всё на месте. Посмотрите на верх и низ.', uz: "Hammasi joyida emas. Surat va maxrajga qarang." }
    }
  },
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Складываем монеты по одной', uz: "Tangalarni bittalab joylaymiz" },
    lead: { ru: 'Итак, пять третьих — настоящий клад. Теперь сложим монеты в сундуки по одной: в каждый входит три.', uz: "Demak, uchdan besh — haqiqiy xazina. Endi tangalarni sandiqlarga bittalab joylaymiz: har biriga uchta." },
    cells: {
      ru: ['Нажимайте кнопку и кладите по одной монете.', 'Одна третья сундука.', 'Две третьих сундука.', 'Три монеты — первый сундук полон, это одно целое.', 'Четыре третьих — пошёл второй сундук.', 'Пять третьих. Это один целый сундук и две третьих.'],
      uz: ["Tugmani bosib, bittalab tanga qo'shib boring.", "Sandiqning uchdan biri.", "Sandiqning uchdan ikkisi.", "Uchta tanga — birinchi sandiq to'ldi, bu bir butun.", "Uchdan to'rt — ikkinchi sandiq boshlandi.", "Uchdan besh. Bu bir butun sandiq va uchdan ikki."]
    },
    note: { ru: 'Значит один целый сундук и две третьих — это пять третьих: целое умножили на знаменатель и прибавили числитель.', uz: "Demak bir butun sandiq va uchdan ikki — bu uchdan besh: butunni maxrajga ko'paytirib, suratni qo'shdik." },
    btn_step: { ru: 'Добавить монету', uz: "Tanga qo'shish" },
    audio: { ru: 'Итак, пять третьих — настоящий клад. Складываем его по монетам, в каждый сундук входит три. С каждым нажатием кладём одну монету. Считайте, сколько наберётся, пока сундук не переполнится.', uz: "Demak, uchdan besh — haqiqiy xazina. Uni tangalab to'playmiz, har sandiqqa uchta sig'adi. Tugmani bosgan sayin bitta tanga qo'shiladi. Sandiq to'lguncha nechta yig'ilishini sanab boring." },
    audio_done: { ru: 'Набралось пять монет — пять третьих. Это тот же клад, что один целый сундук и две третьих.', uz: "Beshta tanga yig'ildi — uchdan besh. Bu bir butun sandiq va uchdan ikki bilan bir xil xazina." }
  },
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Обратный путь: монеты в сундуки', uz: "Teskari yo'l: tangalar sandiqqa" },
    lead: { ru: 'Это мы увидели. Теперь наоборот: у Дониёра одиннадцать монет, а в сундук входит четыре. Сколько будет сундуков?', uz: "Buni ko'rdik. Endi teskari: Doniyorda o'n bitta tanga bor, sandiqqa esa to'rtta sig'adi. Nechta sandiq bo'ladi?" },
    step_labels: {
      ru: ['Одиннадцать четвёртых — одиннадцать монет.', 'Каждые четыре монеты — один полный сундук: набралось два сундука.', 'Три монеты остались. Одиннадцать делим на четыре: два сундука, остаток три.'],
      uz: ["To'rtdan o'n bir — o'n bitta tanga.", "Har to'rt tanga bitta to'la sandiq: ikkita sandiq yig'ildi.", "Uchta tanga ortdi. O'n birni to'rtga bo'lsak, ikki sandiq, qoldiq uch."]
    },
    note: { ru: 'Получается, одиннадцать четвёртых — это два целых сундука и три четвёртых.', uz: "Ko'rib turibmizki, to'rtdan o'n bir — bu ikki butun sandiq va to'rtdan uch." },
    rem_word: { ru: 'ост.', uz: "qoldiq" },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Это мы увидели. Теперь наоборот: у Дониёра одиннадцать монет, а в каждый сундук входит четыре. Разложим их по сундукам.',
        'Каждые четыре монеты дают один полный сундук. Из одиннадцати монет выходит два сундука.',
        'Три монеты остаются в остатке. Это то же самое, что разделить одиннадцать на четыре с остатком.'
      ],
      uz: [
        "Buni ko'rdik. Endi teskari: Doniyorda o'n bitta tanga bor, har sandiqqa esa to'rtta sig'adi. Ularni sandiqlarga taqsimlaymiz.",
        "Har to'rt tanga bitta to'la sandiq beradi. O'n bir tangadan ikkita sandiq chiqadi.",
        "Uchta tanga qoldiqda qoladi. Bu o'n birni to'rtga qoldiq bilan bo'lish bilan bir xil."
      ]
    }
  },
  s4: {
    eyebrow: { ru: 'Попробуй сам', uz: "O'zingiz sinab ko'ring" },
    title: { ru: 'Двигайте ползунок сами', uz: "Slayderni o'zingiz suring" },
    lead: { ru: 'Теперь попробуйте сами: двигайте ползунок и меняйте число монет. В сундук по-прежнему входит четыре.', uz: "Endi o'zingiz sinab ko'ring: slayderni surib, tangalar sonini o'zgartiring. Sandiqqa avvalgidek to'rtta sig'adi." },
    note: { ru: 'Как только монет больше, чем в одном сундуке, клад можно записать смешанным числом.', uz: "Tangalar bitta sandiqdan ko'p bo'lishi bilanoq xazinani aralash son bilan yozish mumkin." },
    audio: { ru: 'Теперь попробуйте сами. Подвигайте ползунок: когда меняется число монет, сундуки заполняются, а клад показан сразу как неправильная дробь и как смешанное число. Это всегда одно количество.', uz: "Endi o'zingiz sinab ko'ring. Slayderni suring: tangalar soni o'zgarganda sandiqlar to'ladi, xazina esa darhol ham noto'g'ri kasr, ham aralash son ko'rinishida ko'rinadi. Bu doim bitta miqdor." }
  },
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Правило: туда', uz: "Qoida: oldinga" },
    rule_title: { ru: 'Смешанное → неправильная дробь', uz: "Aralash → noto'g'ri kasr" },
    rule_body: { ru: 'Целые сундуки умножьте на вместимость и прибавьте остаток монет. Знаменатель не меняется.', uz: "To'la sandiqlarni sig'imiga ko'paytiring, ortgan tangalarni qo'shing. Maxraj o'zgarmaydi." },
    audio: { ru: 'Получается, каждый раз одно и то же действие — сделаем из него правило. Чтобы из смешанного числа получить неправильную дробь, целое умножают на знаменатель и прибавляют числитель.', uz: "Ko'rib turibmizki, har gal bir xil amal — uni qoida qilamiz. Aralash sondan noto'g'ri kasr olish uchun butun maxrajga ko'paytiriladi va surat qo'shiladi." }
  },
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Правило: обратно', uz: "Qoida: orqaga" },
    rule_title: { ru: 'Неправильная дробь → смешанное число', uz: "Noto'g'ri kasr → aralash son" },
    rule_body: { ru: 'Разделите монеты на сундуки с остатком. Частное — полные сундуки, остаток — лишние монеты.', uz: "Tangalarni sandiqlarga qoldiqli bo'ling. Bo'linma — to'la sandiqlar, qoldiq — ortgan tangalar." },
    warning_label: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    warning: { ru: 'Не потеряйте полные сундуки. Если остаток ноль, клад умещается ровно в целые сундуки.', uz: "To'la sandiqlarni tushirib qoldirmang. Qoldiq nol bo'lsa, xazina aynan butun sandiqlarga sig'adi." },
    rem_word: { ru: 'ост.', uz: "qoldiq" },
    audio: { ru: 'А теперь правило обратного пути. Чтобы из неправильной дроби получить смешанное число, числитель делят на знаменатель с остатком. Главное, не потеряйте сундуки, которые уже полны.', uz: "Endi esa teskari yo'lning qoidasi. Noto'g'ri kasrdan aralash son olish uchun surat maxrajga qoldiqli bo'linadi. Eng muhimi, to'lib bo'lgan sandiqlarni tushirib qoldirmang." }
  },
  s7: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Оба пути в одной записи', uz: "Ikki yo'l bitta yozuvda" },
    lead: { ru: 'Соберём оба пути вместе — на одной записи карты.', uz: "Ikkala yo'lni birga yig'amiz — bitta xarita yozuvida." },
    fwd_label: { ru: 'Туда', uz: "Oldinga" },
    rev_label: { ru: 'Обратно', uz: "Orqaga" },
    note: { ru: 'Два пути отменяют друг друга: туда умножаем, обратно делим.', uz: "Ikki yo'l bir-birini bekor qiladi: oldinga ko'paytiramiz, orqaga bo'lamiz." },
    rem_word: { ru: 'ост.', uz: "qoldiq" },
    audio: { ru: 'Соберём оба пути вместе. Два целых сундука и три пятых: туда — два на пять и плюс три, выходит тринадцать пятых. Обратно — тринадцать делим на пять и снова получаем два целых три пятых. Пути отменяют друг друга.', uz: "Ikkala yo'lni birga yig'amiz. Ikki butun sandiq va beshdan uch: oldinga — ikkini beshga, ustiga uch, beshdan o'n uch chiqadi. Orqaga — o'n uchni beshga bo'lamiz va yana ikki butun beshdan uch chiqadi. Yo'llar bir-birini bekor qiladi." }
  },
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Сколько монет всего?', uz: "Jami nechta tanga?" },
    question: { ru: 'Теперь сами. Два целых сундука и две пятых, в сундук входит пять монет — сколько монет всего, как неправильная дробь?', uz: "Endi o'zingiz. Ikki butun sandiq va beshdan ikki, sandiqqa besh tanga sig'adi — noto'g'ri kasr bilan jami nechta tanga?" },
    opt0: { ru: '12/5', uz: "12/5" },
    opt1: { ru: '4/5', uz: "4/5" },
    opt2: { ru: '10/5', uz: "10/5" },
    opt3: { ru: '7/5', uz: "7/5" },
    correct_text: { ru: '✓ Верно. Два сундука по пять — десять монет, плюс две — двенадцать пятых.', uz: "✓ To'g'ri. Ikki sandiq beshtadan — o'n tanga, ustiga ikki — beshdan o'n ikki." },
    wrong_1: { ru: '✗ Здесь сложили сундуки и монеты без умножения. Сначала умножьте два на пять.', uz: "✗ Bu yerda sandiq va tangalar ko'paytirilmay qo'shildi. Avval ikkini beshga ko'paytiring." },
    wrong_2: { ru: '✗ Сундуки умножили, но забыли прибавить лишние монеты. Нужно добавить ещё две.', uz: "✗ Sandiqlarni ko'paytirdingiz, lekin ortgan tangalarni qo'shmadingiz. Yana ikkita qo'shilishi kerak." },
    wrong_3: { ru: '✗ Перепутаны действия. Умножьте два на пять, потом прибавьте две.', uz: "✗ Amallar chalkashdi. Ikkini beshga ko'paytiring, keyin ikkitani qo'shing." },
    audio: {
      intro: { ru: 'Теперь посчитайте сами. Два целых сундука и две пятых, в сундук входит пять монет. Сколько монет всего, как неправильная дробь?', uz: "Endi o'zingiz hisoblang. Ikki butun sandiq va beshdan ikki, sandiqqa besh tanga sig'adi. Noto'g'ri kasr bilan jami nechta tanga?" },
      on_correct: { ru: 'Верно. Два на пять — десять, прибавили две — двенадцать пятых.', uz: "To'g'ri. Ikki karra besh — o'n, ustiga ikki — beshdan o'n ikki." },
      on_wrong: { ru: 'Пока нет. Не забудьте умножить сундуки на вместимость.', uz: "Hali emas. Sandiqlarni sig'imiga ko'paytirishni unutmang." }
    }
  },
  s9: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Посчитайте монеты тайника', uz: "Xilxona tangalarini sanang" },
    question: { ru: 'Следующий тайник: три полных сундука и четыре монеты, в сундук входит пять. Сколько монет всего?', uz: "Navbatdagi xilxona: uch to'la sandiq va to'rt tanga, sandiqqa besh sig'adi. Jami nechta tanga?" },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Умножьте сундуки на вместимость: три на пять. Потом прибавьте лишние монеты — четыре.', uz: "Sandiqlarni sig'imiga ko'paytiring: uchni beshga. Keyin ortgan tangalarni, ya'ni to'rtni qo'shing." },
    fb_correct: { ru: '✓ Верно. Три на пять — пятнадцать, плюс четыре — девятнадцать монет.', uz: "✓ To'g'ri. Uch karra besh — o'n besh, ustiga to'rt — o'n to'qqiz tanga." },
    audio: {
      intro: { ru: 'Следующий тайник: три полных сундука и четыре монеты, в каждый сундук входит пять. Сколько монет всего? Введите число.', uz: "Navbatdagi xilxona: uch to'la sandiq va to'rt tanga, har sandiqqa besh sig'adi. Jami nechta tanga? Sonni kiriting." },
      on_correct: { ru: 'Верно, девятнадцать монет.', uz: "To'g'ri, o'n to'qqiz tanga." },
      on_wrong: { ru: 'Пока нет. Сначала умножьте сундуки на вместимость.', uz: "Hali emas. Avval sandiqlarni sig'imiga ko'paytiring." }
    }
  },
  // s10 — MULTI-SELECT: какие превращения верны (обратный путь, ловушки M1+M2) + Факт modulo
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найдите верные превращения', uz: "To'g'ri o'tkazishlarni toping" },
    question_pre: { ru: 'Теперь обратный путь. Какие превращения', uz: "Endi teskari yo'l. Qaysi o'tkazishlar" },
    question_em: { ru: 'верны', uz: "TO'G'RI" },
    question_post: { ru: '? Отметьте все.', uz: "? Hammasini belgilang." },
    items: [
      { txt: '11/3 = 3 2/3', correct: true },
      { txt: '7/2 = 3 1/2', correct: true },
      { txt: '1 2/3 = 3/3', correct: false },
      { txt: '9/4 = 3/4', correct: false },
    ],
    item_wrong: {
      ru: ['', '', 'Один на три и плюс два — пять третьих, а не три третьих.', 'Здесь потеряны целые: девять четвёртых — это две целых одна четвёртая.'],
      uz: ['', '', "Bir karra uch, ustiga ikki — uchdan besh, uchdan uch emas.", "Bu yerda butun yo'qoldi: to'rtdan to'qqiz — ikki butun to'rtdan bir."]
    },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    miss_hint: { ru: 'Отмечены не все верные. Проверьте каждое превращение.', uz: "Hamma to'g'ri belgilanmadi. Har o'tkazishni tekshiring." },
    fb_correct: { ru: '✓ Верно. Одиннадцать третьих — это три целых две третьих, семь вторых — три с половиной.', uz: "✓ To'g'ri. Uchdan o'n bir — uch butun uchdan ikki, ikkidan yetti — uch butun ikkidan bir." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" },
      text: { ru: 'Деление с остатком знали и старинные торговцы. Сегодня в программировании это действие называют модуло.', uz: "Qoldiqli bo'lishni qadimgi savdogarlar ham bilgan. Bugun dasturlashda bu amal modulo deb ataladi." }
    },
    audio: {
      intro: { ru: 'Теперь обратный путь. Из четырёх превращений отметьте все верные, а ошибочные не отмечайте. Потом проверьте.', uz: "Endi teskari yo'l. To'rt o'tkazishdan to'g'rilarining hammasini belgilang, xatolarini belgilamang. Keyin tekshiring." },
      on_correct: { ru: 'Верно, обе записи правильные. Кстати, деление с остатком в программировании зовут модуло.', uz: "To'g'ri, ikkala yozuv ham to'g'ri. Aytmoqchi, qoldiqli bo'lish dasturda modulo deb ataladi." },
      on_wrong: { ru: 'Пока нет. Проверьте каждое превращение по отдельности.', uz: "Hali emas. Har o'tkazishni alohida tekshiring." }
    }
  },
  s11: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найдите ошибочную запись', uz: "Xato yozuvni toping" },
    question_pre: { ru: 'Но осторожно: на карте четыре пометки, и одна неверна. Какая запись', uz: "Lekin ehtiyot bo'ling: xaritada to'rt belgi bor, bittasi noto'g'ri. Qaysi yozuv" },
    question_em: { ru: 'ошибочна', uz: "XATO" },
    question_post: { ru: '?', uz: "?" },
    opt0: { ru: '2 1/4 = 9/4', uz: "2 1/4 = 9/4" },
    opt1: { ru: '1 2/3 = 3/3', uz: "1 2/3 = 3/3" },
    opt2: { ru: '7/2 = 3 1/2', uz: "7/2 = 3 1/2" },
    opt3: { ru: '9/4 = 2 1/4', uz: "9/4 = 2 1/4" },
    correct_text: { ru: '✓ Верно, ошибка здесь. Один сундук и две третьих — это не три третьих, а пять третьих: один на три и плюс два.', uz: "✓ To'g'ri, xato shu yerda. Bir sandiq va uchdan ikki — uchdan uch emas, uchdan besh: bir karra uch, ustiga ikki." },
    wrong_0: { ru: '✗ Эта запись верна: два на четыре и плюс один — девять четвёртых. Ошибку ищите в другой пометке.', uz: "✗ Bu yozuv to'g'ri: ikki karra to'rt, ustiga bir — to'rtdan to'qqiz. Xatoni boshqa belgidan qidiring." },
    wrong_2: { ru: '✗ Эта запись верна: в семи вторых три сундука и одна монета. Ошибка не здесь.', uz: "✗ Bu yozuv to'g'ri: ikkidan yettida uchta sandiq va bir tanga. Xato bunda emas." },
    wrong_3: { ru: '✗ Эта запись верна: в девяти четвёртых два сундука и одна монета. Ошибка не здесь.', uz: "✗ Bu yozuv to'g'ri: to'rtdan to'qqizda ikkita sandiq va bir tanga. Xato bunda emas." },
    audio: {
      intro: { ru: 'Но осторожно: вопрос наоборот. На карте четыре пометки, и одна из них ошибочна. Какая запись неверна? Выберите вариант.', uz: "Lekin ehtiyot bo'ling: savol teskari. Xaritada to'rt belgi bor va bittasi xato. Qaysi yozuv noto'g'ri? Variantni tanlang." },
      on_correct: { ru: 'Верно. Один целый и две третьих равны пяти третьим, а не трём третьим.', uz: "To'g'ri. Bir butun va uchdan ikki uchdan beshga teng, uchdan uchga emas." },
      on_wrong: { ru: 'Эта запись на самом деле верна. Ошибка в другой пометке.', uz: "Bu yozuv aslida to'g'ri. Xato boshqa belgida." }
    }
  },
  s12: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Запертые ворота клада', uz: "Xazinaning berk darvozasi" },
    lead: { ru: 'Путь привёл к запертым воротам клада. Там ждёт спутница Дониёра — Ирода. Замок откроется, только если соединить две записи одного количества: смешанное число и неправильную дробь.', uz: "Yo'l xazinaning berk darvozasiga olib keldi. U yerda Doniyorning hamrohi Iroda kutmoqda. Qulf bitta miqdorning ikki yozuvini — aralash son va noto'g'ri kasrni — ulagandagina ochiladi." },
    btn_help: { ru: 'Открыть замок', uz: "Qulfni ochish" },
    audio: { ru: 'Путь привёл к запертым воротам клада. Там ждёт Ирода. Замок откроется, только если для каждого количества соединить две его записи: смешанное число и неправильную дробь. Поможем подобрать пары.', uz: "Yo'l xazinaning berk darvozasiga olib keldi. U yerda Iroda kutmoqda. Qulf har bir miqdorning ikki yozuvini — aralash son va noto'g'ri kasrni — ulagandagina ochiladi. Juftlarni topishga yordam beramiz." }
  },
  s13: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Соедините пары и откройте замок', uz: "Juftlarni ulab, qulfni oching" },
    question: { ru: 'Перетащите каждое смешанное число к его неправильной дроби — и замок откроется.', uz: "Har bir aralash sonni mos noto'g'ri kasriga suring — va qulf ochiladi." },
    pairs: [
      { mixed: '2 1/2', improper: '5/2' },
      { mixed: '1 3/4', improper: '7/4' },
      { mixed: '3 1/3', improper: '10/3' },
    ],
    slot_order: [1, 2, 0],
    btn_check: { ru: 'Проверить замок', uz: "Qulfni tekshirish" },
    drag_hint: { ru: 'Сначала поставьте каждую карточку в пару, потом проверьте.', uz: "Avval har bir kartochkani juftiga qo'ying, keyin tekshiring." },
    fb_correct: { ru: '✓ Замок щёлкнул — все пары верны. Ворота открыты.', uz: "✓ Qulf ochildi — hamma juftlar to'g'ri. Darvoza ochiq." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" },
      text: { ru: 'В древнеегипетских свитках дроби писали только долями с числителем один.', uz: "Qadimgi Misr o'ramlarida kasrlar faqat surati bir bo'lgan ulushlar bilan yozilgan." }
    },
    audio: {
      intro: { ru: 'Замок открывается так: перетащите каждое смешанное число к его неправильной дроби, потом проверьте.', uz: "Qulf shunday ochiladi: har bir aralash sonni mos noto'g'ri kasriga suring, keyin tekshiring." },
      on_correct: { ru: 'Замок открылся, все пары верны. Кстати, в древнем Египте дроби писали с числителем один.', uz: "Qulf ochildi, hamma juftlar to'g'ri. Aytmoqchi, qadimgi Misrda kasrlar bir surat bilan yozilgan." },
      on_wrong: { ru: 'Замок не поддался. Превратите каждое смешанное число в неправильную дробь и сравните.', uz: "Qulf ochilmadi. Har bir aralash sonni noto'g'ri kasrga aylantirib solishtiring." }
    }
  },
  s14: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    title: { ru: 'Последний тайник клада', uz: "Xazinaning so'nggi xilxonasi" },
    question: { ru: 'Вот и последний тайник: восемь монет, в сундук входит три. Каким смешанным числом записать клад?', uz: "Mana so'nggi xilxona: sakkizta tanga, sandiqqa uchta sig'adi. Xazinani qaysi aralash son bilan yozamiz?" },
    opt0: { ru: '2 2/3', uz: "2 2/3" },
    opt1: { ru: '2 1/3', uz: "2 1/3" },
    opt2: { ru: '2/3', uz: "2/3" },
    opt3: { ru: '3 2/3', uz: "3 2/3" },
    correct_text: { ru: '✓ Верно. Восемь делим на три: два сундука, остаток два — две целых две третьих.', uz: "✓ To'g'ri. Sakkizni uchga bo'lsak: ikki sandiq, qoldiq ikki — ikki butun uchdan ikki." },
    wrong_1: { ru: '✗ Остаток неверный. В восьми два полных сундука, в остатке две монеты, не одна.', uz: "✗ Qoldiq xato. Sakkizda ikkita to'la sandiq, qoldiqda ikki tanga, bitta emas." },
    wrong_2: { ru: '✗ Здесь потеряны полные сундуки. Есть ещё два целых.', uz: "✗ Bu yerda to'la sandiqlar yo'qoldi. Ikkita to'la sandiq ham bor." },
    wrong_3: { ru: '✗ Слишком много сундуков. В восьми только два полных сундука.', uz: "✗ Sandiq ko'p olindi. Sakkizda atigi ikkita to'la sandiq bor." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Время тоже смешанное число: два часа тридцать минут — это два с половиной часа.', uz: "Vaqt ham aralash son: ikki soat o'ttiz daqiqa — bu ikki yarim soat." }
    },
    audio: {
      intro: { ru: 'Вот и последний тайник: восемь монет, в сундук входит три. Каким смешанным числом записать клад?', uz: "Mana so'nggi xilxona: sakkizta tanga, sandiqqa uchta sig'adi. Xazinani qaysi aralash son bilan yozamiz?" },
      on_correct: { ru: 'Верно, два сундука и две монеты. Кстати, два часа тридцать минут — это два с половиной часа.', uz: "To'g'ri, ikki sandiq va ikki tanga. Aytmoqchi, ikki soat o'ttiz daqiqa — bu ikki yarim soat." },
      on_wrong: { ru: 'Пока нет. Поделите восемь на три с остатком.', uz: "Hali emas. Sakkizni uchga qoldiqli bo'ling." }
    }
  },
  s15: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Клад найден!', uz: "Xazina topildi!" },
    title: { ru: 'Клад найден! Теперь вы переводите смешанное число в неправильную дробь и обратно.', uz: "Xazina topildi! Endi siz aralash sonni noto'g'ri kasrga va aksincha o'tkazasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    points: {
      ru: [
        'Туда: целые сундуки умножить на вместимость и прибавить лишние монеты. Знаменатель тот же.',
        'Обратно: монеты разделить на сундуки с остатком. Частное — сундуки, остаток — монеты.',
        'Полные сундуки терять нельзя — иначе клад станет меньше.'
      ],
      uz: [
        "Oldinga: to'la sandiqlarni sig'imiga ko'paytirib, ortgan tangalarni qo'shing. Maxraj o'sha.",
        "Orqaga: tangalarni sandiqlarga qoldiqli bo'ling. Bo'linma — sandiqlar, qoldiq — tangalar.",
        "To'la sandiqlarni yo'qotib bo'lmaydi — aks holda xazina kichrayadi."
      ]
    },
    hook_close: { ru: 'Помните карту Дониёра с пометкой пять третьих? Теперь ясно: это не ошибка, а один целый сундук и две третьих.', uz: "Doniyorning uchdan besh belgili xaritasi esingizdami? Endi aniq: bu xato emas, bir butun sandiq va uchdan ikki." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Правильные, неправильные, смешанные числа», деление с остатком.', uz: "«To'g'ri, noto'g'ri va aralash sonlar», qoldiqli bo'lish." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сложение и вычитание смешанных чисел.', uz: "aralash sonlarni qo'shish va ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Вот мы и связали весь путь в одну цепочку. Вместе с Дониёром нашли клад и научились переводить смешанное число в неправильную дробь и обратно: туда умножаем, обратно делим, а полные сундуки не теряем. Дальше будем складывать и вычитать смешанные числа.', uz: "Mana, butun yo'lni bitta zanjirga bog'ladik. Doniyor bilan xazinani topdik va aralash sonni noto'g'ri kasrga va aksincha o'tkazishni o'rgandik: oldinga ko'paytiramiz, orqaga bo'lamiz, to'la sandiqlarni yo'qotmaymiz. Keyin aralash sonlarni qo'shish va ayirishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОРЫ frac_5_14 (квест): UnitBars — сундуки с золотыми монетами (.ub-*),
// полный сундук помечен ✓ (не только цветом — доступность). DivLadder, MixedLabel,
// CalcRow, HookLoop (анимация s0), AmbientCoins (живой фон в пустотах).
// ============================================================
const UnitBars = ({ den, filled, units = 2, splitWholes = false, success = false, showLine = false, lineMax = 2, markerValue = null, live = false, maxW = 520 }) => {
  const mv = markerValue === null ? filled : markerValue;
  return (
    <div className={live ? 'ub-wrap ub-live' : 'ub-wrap'} style={{ maxWidth: maxW }}>
      <div className="ub-row">
        {Array.from({ length: units }).map((_, u) => {
          const inUnit = Math.max(0, Math.min(den, filled - u * den));
          const whole = splitWholes && inUnit === den;
          return (
            <div key={u} className={whole ? 'ub-unit ub-unit-whole' : 'ub-unit'}>
              {Array.from({ length: den }).map((_, i) => {
                const on = (u * den + i) < filled;
                const cls = on ? (whole ? 'ub-cell ub-cell-whole' : 'ub-cell ub-cell-on') : 'ub-cell';
                return <div key={i} className={cls}/>;
              })}
            </div>
          );
        })}
      </div>
      {showLine && (
        <div className="ub-line">
          <div className="ub-line-track">
            {Array.from({ length: lineMax * den + 1 }).map((_, i) => (
              <div key={i} className={i % den === 0 ? 'ub-tick ub-tick-whole' : 'ub-tick'} style={{ left: `${(i / (lineMax * den)) * 100}%` }}/>
            ))}
            <div className={success ? 'ub-marker ub-marker-done' : 'ub-marker'} style={{ left: `${Math.min(100, (mv / (lineMax * den)) * 100)}%` }}><span className="ub-dot"/></div>
          </div>
          <div className="ub-axis">
            {Array.from({ length: lineMax + 1 }).map((_, i) => <span key={i} className="mono small" style={{ color: T.ink3 }}>{i}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

const MixedLabel = ({ whole, n, d, color }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    <span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', color: color || T.success }}>{whole}</span>
    <Frac n={String(n)} d={String(d)} size="mid" color={color || T.success}/>
  </span>
);

const CalcRow = ({ items }) => (
  <div className="cv-row">
    {items.map((it, i) => it.op
      ? <Op key={i}>{it.t}</Op>
      : <span key={i} className="display" style={{ fontSize: 'clamp(19px, 3.4vw, 26px)', color: it.c || T.ink }}>{it.t}</span>)}
  </div>
);

const DivLadder = ({ num, den, remWord }) => {
  const q = Math.floor(num / den);
  const r = num % den;
  return (
    <div className="dl">
      <CalcRow items={[{ t: String(num) }, { op: true, t: '÷' }, { t: String(den) }, { op: true, t: '=' }, { t: String(q), c: T.success }]}/>
      <span className="dl-rem mono small">{remWord} {r}</span>
    </div>
  );
};

// HOOK-анимация (CSS-only loop): монеты падают в сундук, первые 3 = 1 целый (скобка), 2 = остаток.
const HookLoop = () => (
  <div className="hk-stage">
    <div className="hk-bar">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={i < 3 ? 'hk-cell hk-cell-a' : 'hk-cell hk-cell-b'} style={{ animationDelay: `${i * 0.32}s` }}/>
      ))}
      <div className="hk-brace"/>
    </div>
  </div>
);

// Живой фон для пустот: медленно дрейфующие искры-монеты (CSS-only, не отвлекает).
const AmbientCoins = () => (
  <div className="amb" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, i) => <span key={i} className={`amb-d amb-d${i}`}/>)}
  </div>
);

// ============================================================
// ФАКТ-БЛОК — синяя карта; анимация КРУПНАЯ, текст краткий (PROMPT 2026-06-13).
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
const AnimCoinSplit = () => (<div className="fa-cs"><i/><i/><i/><span className="fa-cs-rem"/></div>);
const AnimScroll = () => (<div className="fa-scr"><span/><span/><span/></div>);
const AnimSunArc = () => (<div className="fa-sun"><span className="fa-sun-dot"/></div>);

const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim fact-anim-big">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge || FACT_BADGE)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// ============================================================
// ВСПОМОГАТЕЛЬНОЕ
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

const optEl = (t, node) => <span className="body" style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>{mt(t(node))}</span>;

const parseMixed = (s) => {
  const parts = String(s).trim().split(' ');
  if (parts.length === 2) { const [n, d] = parts[1].split('/'); return { whole: parts[0], n, d }; }
  const [n, d] = parts[0].split('/');
  return { whole: null, n, d };
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// s0 — HOOK (квест-завязка): карта помечена 5/3 — ошибка или одно количество? + живая анимация
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = c.options;
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame amb-host fade-up delay-1" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 20px)', padding: 'clamp(16px, 2.8vw, 24px)' }}>
          <AmbientCoins/>
          <HookLoop/>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(16px, 4vw, 34px)', position: 'relative', zIndex: 1 }}>
            <Frac n="5" d="3" size="mid" color={T.accent}/>
            <span className="hk-q">?</span>
            <MixedLabel whole={1} n={2} d={3} color={T.blue}/>
          </div>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — SPACED RETRIEVAL (классификация по сундукам): tap-to-sort, веди-до-верного, ✓ (доступность)
const Screen1 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1; const sfx = useSfx();
  const audio = useAudio([{ id: 's1_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const cards = c.cards;
  const baskets = c.baskets[lang] || c.baskets.ru;
  const wasSolved = storedAnswer?.solved === true;
  const [assign, setAssign] = useState(wasSolved ? cards.map(cd => cd.cat) : cards.map(() => null));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState('');
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const introAdvancedRef = useRef(wasSolved);
  const placeInBasket = (b) => {
    if (solved || selected === null) return;
    setAssign(prev => { const n = prev.slice(); n[selected] = b; return n; });
    setSelected(null); setHint('');
  };
  const tapCard = (ci) => {
    if (solved) return;
    if (assign[ci] !== null) { setAssign(prev => { const n = prev.slice(); n[ci] = null; return n; }); setSelected(null); setHint(''); return; }
    setSelected(s => (s === ci ? null : ci));
  };
  const check = () => {
    if (solved) return;
    if (assign.some(a => a === null)) { setHint('pick'); return; }
    const allCorrect = assign.every((b, i) => b === cards[i].cat);
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (firstTryRef.current === null) firstTryRef.current = allCorrect;
    if (allCorrect) {
      setSolved(true); setHint(''); sfx.playCorrect();
      onAnswer({ stage: null, screenIdx: 1, question: 'classify', correctAnswer: 'sorted', studentAnswer: 'sorted', correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
    } else {
      sfx.playWrong(); setHint('retry');
      setAssign(prev => prev.map((b, i) => (b === cards[i].cat ? b : null)));
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const cardEl = (v, color) => { const m = parseMixed(v); return m.whole !== null ? <MixedLabel whole={m.whole} n={m.n} d={m.d} color={color}/> : <Frac n={m.n} d={m.d} size="mid" color={color}/>; };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="cl-baskets fade-up delay-1">
          {baskets.map((b, bi) => (
            <div key={bi} className={`cl-basket${!solved && selected !== null ? ' cl-basket-active' : ''}`} onClick={() => placeInBasket(bi)}>
              <span className="cl-basket-label mono small">{b}</span>
              <div className="cl-basket-drop">
                {assign.map((a, ci) => a === bi && (
                  <span key={ci} className={`cl-chip${solved ? ' cl-chip-done' : ''}`} onClick={(e) => { e.stopPropagation(); tapCard(ci); }}>
                    {solved && <span className="cl-ok" aria-hidden="true">✓</span>}{cardEl(cards[ci].v, solved ? T.success : T.ink)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="cl-tray fade-up delay-2">
          {cards.map((cd, ci) => assign[ci] === null && (
            <span key={ci} className={`cl-chip cl-chip-free${selected === ci ? ' cl-chip-sel' : ''}`} onClick={() => tapCard(ci)}>{cardEl(cd.v, selected === ci ? T.accent : T.ink)}</span>
          ))}
        </div>
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ textAlign: 'center' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(hint === 'pick' ? c.pick_hint : c.retry_hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION (по одной монете за нажатие): 1 2/3 -> 5/3
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const caps = c.cells[lang] || c.cells.ru;
  const MAX = 5;
  const [filled, setFilled] = useState(0);
  const doneVoicedRef = useRef(false);
  const done = filled >= MAX;
  const add = () => {
    if (filled >= MAX) return;
    const nv = filled + 1;
    setFilled(nv);
    if (nv === MAX && !doneVoicedRef.current) {
      doneVoicedRef.current = true;
      if (!audio.muted) setTimeout(() => { const eng = getAudioEngine(); if (eng && !audio.muted) eng.pushOneOff(c.audio_done[lang]); }, 280);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up ub-glow' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <UnitBars den={3} filled={filled} units={2} splitWholes={true} success={done}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 16px)', flexWrap: 'wrap', justifyContent: 'center', minHeight: 'clamp(34px, 6vw, 44px)' }}>
            {filled > 0 && <Frac n={String(filled)} d="3" size="mid" color={done ? T.success : T.accent}/>}
            {done && <><Op>=</Op><MixedLabel whole={1} n={2} d={3}/></>}
          </div>
          {done && <CalcRow items={[{ t: '1' }, { op: true, t: '×' }, { t: '3' }, { op: true, t: '+' }, { t: '2' }, { op: true, t: '=' }, { t: '5', c: T.success }]}/>}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <button className="btn-white-accent" onClick={add} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
            <span className="mono small" style={{ color: T.ink3 }}>{filled} / {MAX}</span>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[filled])}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (step-gated): 11/4 -> 2 3/4 (раскладка по сундукам + деление с остатком)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const segs = c.audio[lang] || c.audio.ru;
  const caps = c.step_labels[lang] || c.step_labels.ru;
  const STEPS = segs.length;
  const [step, setStep] = useState(0);
  const done = step >= STEPS - 1;
  const advance = () => { if (done) return; setStep(s => s + 1); audio.triggerEvent('button_click', 'step'); };
  const splitW = step >= 1;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up ub-glow' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <UnitBars den={4} filled={11} units={3} splitWholes={splitW} success={done}/>
          {step >= 2 && <DivLadder num={11} den={4} remWord={t(c.rem_word)}/>}
          {done && <MixedLabel whole={2} n={3} d={4}/>}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={advance} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[step])}</p>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (slider): живая связь неправильная <-> смешанная (den=4)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 4;
  const [num, setNum] = useState(2);
  const whole = Math.floor(num / den);
  const rem = num % den;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <UnitBars den={den} filled={num} units={3} splitWholes={true} showLine={true} lineMax={3} live={true} success={num % den === 0 && num > 0}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Frac n={String(num)} d={String(den)} size="mid" color={T.accent}/>
            <Op>=</Op>
            {num >= den
              ? <MixedLabel whole={whole} n={rem === 0 ? 0 : rem} d={den} color={T.ink}/>
              : <Frac n={String(num)} d={String(den)} size="mid" color={T.ink}/>}
          </div>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Slider value={num} min={1} max={12} onChange={setNum}/>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 1: смешанное -> неправильная
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame amb-host fade-up" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <AmbientCoins/>
          <p className="small mono" style={{ margin: 0, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, position: 'relative', zIndex: 1 }}>{t(c.rule_title)}</p>
          <p className="body" style={{ margin: 0, textAlign: 'center', position: 'relative', zIndex: 1 }}>{mt(t(c.rule_body))}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 18px)', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <MixedLabel whole={1} n={2} d={3} color={T.ink}/>
            <Op>=</Op>
            <CalcRow items={[{ t: '1' }, { op: true, t: '×' }, { t: '3' }, { op: true, t: '+' }, { t: '2' }, { op: true, t: '=' }, { t: '5', c: T.accent }]}/>
            <Op>=</Op>
            <Frac n="5" d="3" size="mid" color={T.accent}/>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s6 — RULE 2: неправильная -> смешанное (M2-предупреждение)
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t(c.rule_title)}</p>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_body))}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.5vw, 18px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Frac n="11" d="4" size="mid" color={T.ink}/>
            <Op>=</Op>
            <DivLadder num={11} den={4} remWord={t(c.rem_word)}/>
            <Op>=</Op>
            <MixedLabel whole={2} n={3} d={4} color={T.accent}/>
          </div>
        </div>
        <div className="frame-soft fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.warning_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warning))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — WORKED EXAMPLE: 2 3/5 <-> 13/5 (оба направления)
const Screen7 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="small mono" style={{ margin: 0, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t(c.fwd_label)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <MixedLabel whole={2} n={3} d={5} color={T.ink}/>
            <Op>=</Op>
            <CalcRow items={[{ t: '2' }, { op: true, t: '×' }, { t: '5' }, { op: true, t: '+' }, { t: '3' }, { op: true, t: '=' }, { t: '13', c: T.accent }]}/>
            <Op>=</Op>
            <Frac n="13" d="5" size="mid" color={T.accent}/>
          </div>
        </div>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="small mono" style={{ margin: 0, color: T.success, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t(c.rev_label)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2.2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Frac n="13" d="5" size="mid" color={T.ink}/>
            <Op>=</Op>
            <DivLadder num={13} den={5} remWord={t(c.rem_word)}/>
            <Op>=</Op>
            <MixedLabel whole={2} n={3} d={5} color={T.success}/>
          </div>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s8 — TEST: 2 2/5 -> 12/5 (correct на A, ловушка M1 opt1)
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}><MixedLabel whole={2} n={2} d={5} color={T.ink}/></div></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s9 — TEST input: монет в 3 4/5 (вместимость 5) -> 19
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={19}
    renderVisual={({ solved }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <MixedLabel whole={3} n={4} d={5} color={T.ink}/>
        <CalcRow items={[{ t: '3' }, { op: true, t: '×' }, { t: '5' }, { op: true, t: '+' }, { t: '4' }, { op: true, t: '=' }, { t: solved ? '19' : '?', c: solved ? T.success : T.accent }]}/>
      </div>
    )}/>;
};

// s10 — MULTI-SELECT (выбрать все верные превращения): веди-до-верного, ✓/✗ (доступность) + Факт modulo
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10; const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const items = c.items;
  const wrongTexts = c.item_wrong[lang] || c.item_wrong.ru;
  const correctSet = items.map(it => it.correct);
  const wasSolved = storedAnswer?.solved === true;
  const [sel, setSel] = useState(wasSolved ? items.map(it => it.correct) : items.map(() => false));
  const [marks, setMarks] = useState(items.map(() => null));
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const introAdvancedRef = useRef(wasSolved);
  const toggle = (i) => {
    if (solved) return;
    setSel(prev => { const n = prev.slice(); n[i] = !n[i]; return n; });
    setMarks(prev => { const n = prev.slice(); n[i] = null; return n; });
    setHint(false);
  };
  const check = () => {
    if (solved) return;
    const allCorrect = sel.every((s, i) => s === correctSet[i]);
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (firstTryRef.current === null) firstTryRef.current = allCorrect;
    if (allCorrect) {
      setSolved(true); setHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[10]?.scope ?? null, screenIdx: 10, question: 'multi-select', correctAnswer: 'set', studentAnswer: 'set', correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
    } else {
      sfx.playWrong(); setHint(true);
      setMarks(items.map((it, i) => (sel[i] && !it.correct ? 'bad' : null)));
      setSel(prev => prev.map((s, i) => (s && !items[i].correct ? false : s)));
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up">{t(c.question_pre)} <span className="italic" style={{ color: T.success }}>{t(c.question_em)}</span>{t(c.question_post)}</h2>
        <div className="ms-list fade-up delay-1">
          {items.map((it, i) => {
            const on = sel[i];
            const cls = solved ? (it.correct ? 'ms-item ms-ok' : 'ms-item ms-muted') : (marks[i] === 'bad' ? 'ms-item ms-bad' : (on ? 'ms-item ms-on' : 'ms-item'));
            const icon = (solved && it.correct) || on ? '✓' : (marks[i] === 'bad' ? '✗' : '');
            return (
              <button key={i} className={cls} disabled={solved} onClick={() => toggle(i)}>
                <span className="ms-box" aria-hidden="true">{icon}</span>
                <span className="ms-txt">{mt(it.txt)}</span>
              </button>
            );
          })}
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {hint && !solved && (
          <div className="frame-tip fade-up">
            {marks.some(m => m === 'bad')
              ? items.map((it, i) => (marks[i] === 'bad' && wrongTexts[i] ? <p key={i} className="body" style={{ margin: '0 0 4px' }}>✗ {mt(wrongTexts[i])}</p> : null))
              : <p className="body" style={{ margin: 0 }}>{mt(t(c.miss_hint))}</p>}
          </div>
        )}
        {solved && (
          <>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
            </FeedbackBlock>
            <FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimCoinSplit/>}/>
          </>
        )}
      </div>
    </Stage>
  );
};

// s11 — TEST find-the-wrong: какая запись карты ошибочна (correct на B = opt1, ловушка M1)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 1, [2, 1, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.question_pre)} <span className="italic" style={{ color: T.accent }}>{t(c.question_em)}</span>{t(c.question_post)}</h2></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s12 — CASE setup (Ирода у запертых ворот)
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame amb-host fade-up delay-1" style={{ position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(14px, 4vw, 32px)', flexWrap: 'wrap' }}>
          <AmbientCoins/>
          <MixedLabel whole={2} n={1} d={2} color={T.blue}/>
          <span className="mono" style={{ color: T.ink3, position: 'relative', zIndex: 1 }}>·</span>
          <MixedLabel whole={1} n={3} d={4} color={T.blue}/>
          <span className="mono" style={{ color: T.ink3, position: 'relative', zIndex: 1 }}>·</span>
          <MixedLabel whole={3} n={1} d={3} color={T.blue}/>
        </div>
      </div>
    </Stage>
  );
};

// s13 — CASE drag-match: соединить смешанное <-> неправильную (touch-friendly) + Факт Египет
const Screen13 = ({ screen, idx, totalScreens, screenMeta, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13; const sfx = useSfx();
  void idx; void totalScreens; void screenMeta; void screenContent;
  const audio = useAudio([{ id: 's13_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const pairs = c.pairs;
  const SLOTS = c.slot_order;
  const correctAssign = pairs.map((_, i) => SLOTS.indexOf(i));
  const wasSolved = storedAnswer?.solved === true;
  const [assign, setAssign] = useState(wasSolved ? correctAssign : pairs.map(() => null));
  const [solved, setSolved] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const [drag, setDrag] = useState(null);
  const slotRefs = useRef([]);
  const solvedRef = useRef(wasSolved);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const handlersRef = useRef(null);

  useEffect(() => () => {
    if (handlersRef.current) {
      window.removeEventListener('pointermove', handlersRef.current.move);
      window.removeEventListener('pointerup', handlersRef.current.up);
    }
  }, []);

  const startDrag = (chip, e) => {
    if (solvedRef.current) return;
    e.preventDefault();
    const move = (ev) => setDrag({ chip, x: ev.clientX, y: ev.clientY });
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      handlersRef.current = null;
      setDrag(null);
      let target = null;
      slotRefs.current.forEach((el, si) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) target = si;
      });
      setAssign(prev => {
        const next = prev.slice();
        if (target === null) { next[chip] = null; return next; }
        next.forEach((s, ci) => { if (s === target && ci !== chip) next[ci] = null; });
        next[chip] = target;
        return next;
      });
      setHint(false);
    };
    handlersRef.current = { move, up };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    setDrag({ chip, x: e.clientX, y: e.clientY });
  };

  const check = () => {
    if (solvedRef.current) return;
    if (assign.some(a => a === null)) { setHint(true); return; }
    attemptsRef.current += 1;
    const allCorrect = assign.every((slot, chip) => slot === correctAssign[chip]);
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (firstTryRef.current === null) firstTryRef.current = allCorrect;
    if (allCorrect) {
      setSolved(true); solvedRef.current = true; setHint(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: 'drag-match', correctAnswer: 'matched', studentAnswer: 'matched', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      if (!audio.muted) { setTimeout(() => { const eng = getAudioEngine(); if (eng && !audio.muted) eng.pushOneOff(c.audio.on_correct[lang]); }, 300); }
    } else {
      setHint(true); sfx.playWrong();
      setAssign(prev => prev.map((slot, chip) => (slot === correctAssign[chip] ? slot : null)));
      if (!audio.muted) { setTimeout(() => { const eng = getAudioEngine(); if (eng && !audio.muted) eng.pushOneOff(c.audio.on_wrong[lang]); }, 300); }
    }
  };

  const chipFrac = (s, color) => { const m = parseMixed(s); return m.whole !== null ? <MixedLabel whole={m.whole} n={m.n} d={m.d} color={color}/> : <Frac n={m.n} d={m.d} size="mid" color={color}/>; };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up">{mt(t(c.question))}</h2>
        <div className="dg-slots fade-up delay-1">
          {SLOTS.map((impIdx, si) => {
            const occChip = assign.findIndex(a => a === si);
            const ok = solved || (occChip !== -1 && occChip === pairs.findIndex((_, i) => correctAssign[i] === si));
            return (
              <div key={si} ref={el => { slotRefs.current[si] = el; }} className={`dg-slot${occChip !== -1 ? ' dg-slot-filled' : ''}${solved ? ' dg-slot-done' : ''}`}>
                <div className="dg-slot-target">{chipFrac(pairs[impIdx].improper, T.ink2)}</div>
                <div className="dg-slot-drop">
                  {occChip !== -1
                    ? <div className={`dg-chip dg-chip-placed${solved ? ' dg-chip-done' : ''}`}>{solved && <span className="dg-ok" aria-hidden="true">✓</span>}{chipFrac(pairs[occChip].mixed, ok ? T.success : T.accent)}</div>
                    : <span className="dg-slot-hintdot"/>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="dg-tray fade-up delay-2">
          {pairs.map((p, ci) => assign[ci] === null && (
            <div key={ci} className="dg-chip dg-chip-free" onPointerDown={(e) => startDrag(ci, e)} style={{ touchAction: 'none', opacity: drag && drag.chip === ci ? 0.3 : 1 }}>
              {chipFrac(p.mixed, T.accent)}
            </div>
          ))}
        </div>
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {hint && !solved && (
          <div className="frame-tip fade-up" style={{ textAlign: 'center' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.drag_hint))}</p>
          </div>
        )}
        {solved && (
          <>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
            </FeedbackBlock>
            <FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimScroll/>}/>
          </>
        )}
      </div>
      {drag && (() => { const m = parseMixed(pairs[drag.chip].mixed); return (
        <div className="dg-chip dg-chip-ghost" style={{ left: drag.x, top: drag.y }}>
          {m.whole !== null ? <MixedLabel whole={m.whole} n={m.n} d={m.d} color={T.accent}/> : <Frac n={m.n} d={m.d} size="mid" color={T.accent}/>}
        </div>
      ); })()}
    </Stage>
  );
};

// s14 — TEST FINAL: 8/3 -> 2 2/3 (correct на D, ловушки M1+M2) + Факт время
const Screen14 = (props) => {
  const t = useT(); const c = CONTENT.s14;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}><Frac n="8" d="3" size="mid" color={T.accent}/></div></>);
  return <QuestionScreen {...props} idx={14} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[14]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimSunArc/>}/>}/>;
};

// s15 — SUMMARY + закрытие hook + связи
const Screen15 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s15;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = c.points[lang] || c.points.ru;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success amb-host fade-up delay-2" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AmbientCoins/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <Frac n="5" d="3" size="mid" color={T.ink2}/>
            <Op>=</Op>
            <MixedLabel whole={1} n={2} d={3}/>
          </div>
          <p className="body" style={{ margin: 0, position: 'relative', zIndex: 1 }}>{mt(t(c.hook_close))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function MixedConvertLesson({
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

.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4, .lesson-root h5, .lesson-root h6,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }

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

/* === КНОПКИ v15 === */
.btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #0E0E10; color: #F6F4EF; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32); }
.btn:hover:not(:disabled) { background: #FF4F28; box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #FF4F28; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12); }
.btn-white-accent:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55); }
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }
.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #0E0E10; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

/* === ОПЦИИ v15 === */
.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.option:disabled { cursor: default; }
.option-correct { background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important; }
.option-wrong { background: #FFFFFF !important; color: #A7A6A2 !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

/* === ТИПОГРАФИКА v15 === */
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(17px, 2.5vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(11px, 2vw, 11px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 12px); padding-bottom: clamp(17px, 3.4vw, 20px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(11px, 2vw, 11px); padding-bottom: clamp(11px, 2vw, 11px); display: flex; gap: 12px; }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

/* === PROGRESS v15 === */
.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

/* === SLIDER v15 === */
.track-wrap { position: relative; height: 26px; margin: 18px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

/* === INPUT v15 === */
.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

/* === FRAMES v15 === */
.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 17px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* MATH frac_5_14: CalcRow / DivLadder. */
.cv-row { display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: center; }
.dl { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; }
.dl-rem { color: #1F7A4D; font-weight: 600; }

/* MATH frac_5_14 (квест): UnitBars — СУНДУКИ с золотыми МОНЕТАМИ; полный сундук помечен ✓ (доступность). */
.ub-wrap { width: 100%; max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.ub-row { display: flex; gap: 14px; justify-content: center; }
.ub-unit { position: relative; display: flex; gap: 5px; flex: 1; max-width: 175px; height: clamp(44px, 8.4vw, 58px); padding: 7px; border-radius: 10px; background: linear-gradient(#FFFDF8, #F3ECdd); box-shadow: inset 0 0 0 2px rgba(168, 132, 58, 0.55), inset 0 5px 0 -2px rgba(168, 132, 58, 0.25); align-items: center; transition: box-shadow 0.3s; }
.ub-unit-whole { box-shadow: inset 0 0 0 2px rgba(31, 122, 77, 0.85), inset 0 5px 0 -2px rgba(31, 122, 77, 0.3); }
.ub-unit-whole::after { content: '✓'; position: absolute; top: -9px; right: -7px; width: 18px; height: 18px; border-radius: 50%; background: #1F7A4D; color: #FFFFFF; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(31, 122, 77, 0.4); }
.ub-cell { flex: 1; align-self: stretch; border-radius: 50%; background: rgba(168, 132, 58, 0.16); box-shadow: inset 0 0 0 1px rgba(168, 132, 58, 0.2); transition: background 0.4s ease; }
.ub-cell-on { background: radial-gradient(circle at 36% 30%, #FBDD7C, #D89B1E); box-shadow: inset 0 0 0 1px rgba(140, 96, 16, 0.4), 0 1px 3px rgba(140, 96, 16, 0.35); animation: ubPop 0.42s cubic-bezier(0.34, 1.2, 0.64, 1), ubShine 2.6s ease-in-out infinite; }
.ub-cell-whole { background: radial-gradient(circle at 36% 30%, #7FD3A6, #1F7A4D); box-shadow: inset 0 0 0 1px rgba(20, 80, 50, 0.4), 0 1px 3px rgba(20, 80, 50, 0.3); animation: ubPop 0.42s cubic-bezier(0.34, 1.2, 0.64, 1), ubShine 2.6s ease-in-out infinite; }
@keyframes ubPop { 0% { opacity: 0.3; transform: scale(0.2); } 100% { opacity: 1; transform: scale(1); } }
@keyframes ubShine { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.14); } }
.ub-live .ub-cell-on, .ub-live .ub-cell-whole { animation: none; }
.ub-line { width: 100%; }
.ub-line-track { position: relative; height: 8px; margin: 16px 6px 0; background: repeating-linear-gradient(90deg, rgba(168,132,58,0.45) 0 7px, transparent 7px 14px); border-radius: 99px; }
.ub-tick { position: absolute; top: -4px; width: 2px; height: 16px; background: rgba(168, 132, 58, 0.7); transform: translateX(-1px); }
.ub-tick-whole { background: #8A6A1E; height: 20px; top: -6px; }
.ub-marker { position: absolute; top: -10px; width: 3px; height: 26px; background: #C0392B; border-radius: 2px; transform: translateX(-1.5px); transition: left 0.5s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 3; }
.ub-marker-done { background: #1F7A4D; }
.ub-dot { position: absolute; top: -9px; left: 50%; width: 13px; height: 13px; border-radius: 2px 2px 2px 0; background: inherit; transform: translateX(-50%) rotate(45deg); box-shadow: 0 0 8px rgba(192, 57, 43, 0.4); }
.ub-axis { display: flex; justify-content: space-between; margin: 8px 6px 0; }
.ub-glow { animation: ubGlow 0.7s ease; }
@keyframes ubGlow { 0% { filter: drop-shadow(0 0 0 rgba(216, 155, 30, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(216, 155, 30, 0.5)); } 100% { filter: drop-shadow(0 0 0 rgba(216, 155, 30, 0)); } }

/* MATH frac_5_14: HOOK — монеты падают в сундук (s0, обязательная анимация). */
.hk-stage { display: flex; justify-content: center; padding: 8px 0 16px; position: relative; z-index: 1; }
.hk-bar { position: relative; display: flex; gap: 6px; }
.hk-cell { width: clamp(26px, 6vw, 38px); height: clamp(26px, 6vw, 38px); border-radius: 50%; background: rgba(168, 132, 58, 0.18); box-shadow: inset 0 0 0 1px rgba(168, 132, 58, 0.25); }
.hk-cell-a { animation: hkA 4s ease-in-out infinite; }
.hk-cell-b { animation: hkB 4s ease-in-out infinite; }
@keyframes hkA { 0%, 6% { background: rgba(168, 132, 58, 0.18); transform: scale(0.6); } 20%, 72% { background: radial-gradient(circle at 36% 30%, #7FD3A6, #1F7A4D); transform: scale(1); } 92%, 100% { background: rgba(168, 132, 58, 0.18); transform: scale(0.6); } }
@keyframes hkB { 0%, 6% { background: rgba(168, 132, 58, 0.18); transform: scale(0.6); } 20%, 72% { background: radial-gradient(circle at 36% 30%, #FBDD7C, #D89B1E); transform: scale(1); } 92%, 100% { background: rgba(168, 132, 58, 0.18); transform: scale(0.6); } }
.hk-brace { position: absolute; left: 0; bottom: -11px; width: calc(3 * clamp(26px, 6vw, 38px) + 12px); height: 9px; border: 2px solid #1F7A4D; border-top: none; border-radius: 0 0 7px 7px; opacity: 0; animation: hkBrace 4s ease-in-out infinite; }
@keyframes hkBrace { 0%, 34% { opacity: 0; } 48%, 78% { opacity: 0.8; } 94%, 100% { opacity: 0; } }
.hk-q { font-family: 'JetBrains Mono', monospace; color: #A7A6A2; font-size: clamp(18px, 3vw, 24px); animation: hkPulse 1.6s ease-in-out infinite; }
@keyframes hkPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }

/* MATH frac_5_14: AMBIENT — медленно дрейфующие искры в пустотах (не отвлекают). */
.amb-host { position: relative; }
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-d { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: radial-gradient(circle at 36% 30%, #FBDD7C, #D89B1E); opacity: 0.22; animation: ambDrift 13s ease-in-out infinite; }
.amb-d0 { left: 8%; top: 30%; animation-delay: 0s; } .amb-d1 { left: 24%; top: 70%; animation-delay: 2.2s; }
.amb-d2 { left: 54%; top: 20%; animation-delay: 4.4s; } .amb-d3 { left: 72%; top: 64%; animation-delay: 1.1s; }
.amb-d4 { left: 88%; top: 34%; animation-delay: 6.1s; } .amb-d5 { left: 40%; top: 84%; animation-delay: 3.3s; }
@keyframes ambDrift { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.12; } 50% { transform: translateY(-14px) scale(1.25); opacity: 0.3; } }

/* MATH frac_5_14: CLASSIFY (3 сундука) — tap-to-sort, ✓ при верной (доступность). */
.cl-baskets { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.cl-basket { flex: 1; min-width: 92px; max-width: 200px; display: flex; flex-direction: column; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 14px; padding: clamp(8px, 1.6vw, 12px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); transition: box-shadow 0.2s, transform 0.15s; cursor: default; }
.cl-basket-active { cursor: pointer; box-shadow: 0 10px 24px -6px rgba(255, 79, 40, 0.3); transform: translateY(-2px); }
.cl-basket-label { color: #5A5A60; text-align: center; }
.cl-basket-drop { width: 100%; min-height: clamp(46px, 8vw, 56px); border-radius: 10px; border: 2px dashed rgba(168, 132, 58, 0.45); display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: center; padding: 6px; background: rgba(246, 244, 239, 0.6); }
.cl-tray { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; min-height: clamp(50px, 9vw, 60px); align-items: center; }
.cl-chip { display: inline-flex; align-items: center; gap: 5px; padding: clamp(7px, 1.5vw, 11px) clamp(11px, 2.2vw, 16px); border-radius: 12px; background: #FFFFFF; border: none; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.18); cursor: pointer; font-family: 'Manrope', sans-serif; }
.cl-chip-free { box-shadow: 0 6px 16px -6px rgba(216, 155, 30, 0.34); }
.cl-chip-sel { box-shadow: 0 0 0 2px #FF4F28, 0 8px 20px -6px rgba(255, 79, 40, 0.4); transform: translateY(-2px); }
.cl-chip-done { box-shadow: none; background: transparent; cursor: default; }
.cl-ok { color: #1F7A4D; font-weight: 700; font-size: 13px; }

/* MATH frac_5_14: MULTI-SELECT — отметить все верные; ✓ выбрано / ✗ ошибка (доступность). */
.ms-list { display: flex; flex-direction: column; gap: 10px; }
.ms-item { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: #FFFFFF; border: none; border-radius: 12px; padding: clamp(11px, 1.8vw, 14px) clamp(14px, 2.2vw, 18px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); cursor: pointer; transition: all 0.18s; font-family: 'Manrope', sans-serif; }
.ms-item:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.ms-on { box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.3), 0 0 0 1px rgba(31, 122, 77, 0.25); }
.ms-bad { background: #FFE8E1; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.36); }
.ms-ok { background: #E3F0E8; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32); }
.ms-muted { opacity: 0.5; }
.ms-box { flex-shrink: 0; width: 24px; height: 24px; border-radius: 7px; box-shadow: inset 0 0 0 2px rgba(167, 166, 162, 0.6); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; color: #1F7A4D; }
.ms-on .ms-box { box-shadow: inset 0 0 0 2px #1F7A4D; background: #E3F0E8; }
.ms-bad .ms-box { box-shadow: inset 0 0 0 2px #FF4F28; color: #FF4F28; }
.ms-ok .ms-box { box-shadow: inset 0 0 0 2px #1F7A4D; background: #1F7A4D; color: #FFFFFF; }
.ms-txt { flex: 1; }

/* MATH frac_5_14: DRAG-MATCH (touch-friendly), ✓ при верной паре (доступность). */
.dg-slots { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.dg-slot { flex: 1; min-width: 96px; max-width: 170px; display: flex; flex-direction: column; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 14px; padding: clamp(10px, 1.8vw, 14px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); transition: box-shadow 0.2s; }
.dg-slot-filled { box-shadow: 0 10px 24px -6px rgba(216, 155, 30, 0.32); }
.dg-slot-done { box-shadow: 0 10px 24px -6px rgba(31, 122, 77, 0.30); }
.dg-slot-target { display: flex; align-items: center; justify-content: center; min-height: 40px; }
.dg-slot-drop { width: 100%; min-height: clamp(46px, 8vw, 56px); border-radius: 10px; border: 2px dashed rgba(168, 132, 58, 0.5); display: flex; align-items: center; justify-content: center; background: rgba(246, 244, 239, 0.6); }
.dg-slot-filled .dg-slot-drop, .dg-slot-done .dg-slot-drop { border-style: solid; border-color: transparent; background: transparent; }
.dg-slot-hintdot { width: 9px; height: 9px; border-radius: 50%; background: rgba(168, 132, 58, 0.45); }
.dg-tray { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; min-height: clamp(52px, 9vw, 64px); align-items: center; }
.dg-chip { display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: clamp(8px, 1.6vw, 12px) clamp(12px, 2.4vw, 18px); border-radius: 12px; background: #FFFFFF; box-shadow: 0 6px 16px -6px rgba(216, 155, 30, 0.34); }
.dg-chip-free { cursor: grab; touch-action: none; transition: transform 0.12s, box-shadow 0.2s; }
.dg-chip-free:hover { box-shadow: 0 10px 22px -6px rgba(216, 155, 30, 0.46); transform: translateY(-2px); }
.dg-chip-free:active { cursor: grabbing; }
.dg-chip-placed { box-shadow: none; padding: 4px 8px; }
.dg-chip-done { background: transparent; }
.dg-ok { color: #1F7A4D; font-weight: 700; font-size: 14px; }
.dg-chip-ghost { position: fixed; transform: translate(-50%, -50%); z-index: 1200; pointer-events: none; box-shadow: 0 14px 30px -8px rgba(216, 155, 30, 0.5); background: #FFFFFF; }

/* MATH frac_5_10: ФАКТ-БЛОК — синяя карта; анимация КРУПНАЯ, текст краткий. */
.fact-card { display: flex; gap: 16px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: 54px; display: flex; align-items: center; justify-content: center; }
.fact-anim-big { width: clamp(84px, 16vw, 108px); }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

/* MATH frac_5_14: ФАКТ-анимации (CSS-only, КРУПНЫЕ) — монеты+остаток / свиток / солнце по дуге. */
.fa-cs { display: flex; align-items: center; gap: 6px; }
.fa-cs i { width: clamp(15px, 3vw, 19px); height: clamp(15px, 3vw, 19px); border-radius: 50%; background: radial-gradient(circle at 36% 30%, #7FD3A6, #1F7A4D); animation: faCsGroup 2.8s ease-in-out infinite; }
.fa-cs i:nth-child(2) { animation-delay: 0.12s; } .fa-cs i:nth-child(3) { animation-delay: 0.24s; }
.fa-cs-rem { width: clamp(15px, 3vw, 19px); height: clamp(15px, 3vw, 19px); border-radius: 50%; margin-left: 6px; background: radial-gradient(circle at 36% 30%, #FBDD7C, #D89B1E); animation: faCsRem 2.8s ease-in-out infinite; }
@keyframes faCsGroup { 0%, 12% { transform: translateX(7px) scale(0.7); opacity: 0.4; } 32%, 72% { transform: translateX(0) scale(1); opacity: 1; } 92%, 100% { transform: translateX(7px) scale(0.7); opacity: 0.4; } }
@keyframes faCsRem { 0%, 40% { transform: scale(1); } 60% { transform: scale(1.35) translateY(-4px); } 80%, 100% { transform: scale(1); } }
.fa-scr { position: relative; width: clamp(66px, 14vw, 88px); height: clamp(52px, 11vw, 70px); border-radius: 7px; background: linear-gradient(#FBF3D6, #F0E4B8); box-shadow: inset 0 0 0 2px rgba(168, 132, 58, 0.4); display: flex; flex-direction: column; justify-content: center; gap: clamp(6px, 1.8vw, 10px); padding: 0 12px; }
.fa-scr span { height: 4px; border-radius: 2px; background: #019ACB; transform-origin: left; animation: faScr 3s ease-in-out infinite; }
.fa-scr span:nth-child(1) { width: 100%; animation-delay: 0s; } .fa-scr span:nth-child(2) { width: 70%; animation-delay: 0.4s; } .fa-scr span:nth-child(3) { width: 85%; animation-delay: 0.8s; }
@keyframes faScr { 0%, 10% { transform: scaleX(0); opacity: 0; } 28%, 78% { transform: scaleX(1); opacity: 1; } 96%, 100% { transform: scaleX(0); opacity: 0; } }
.fa-sun { position: relative; width: clamp(80px, 16vw, 104px); height: clamp(46px, 9vw, 58px); overflow: hidden; }
.fa-sun::after { content: ''; position: absolute; left: 6%; right: 6%; bottom: 5px; height: 2px; background: rgba(168, 132, 58, 0.5); border-radius: 2px; }
.fa-sun-dot { position: absolute; bottom: 5px; left: 50%; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: radial-gradient(circle at 36% 30%, #FFE08A, #F2A93B); box-shadow: 0 0 12px rgba(242, 169, 59, 0.6); transform-origin: 50% 100%; animation: faSun 3.4s ease-in-out infinite; }
@keyframes faSun { 0% { transform: rotate(-78deg) translateY(-28px); } 50% { transform: rotate(0deg) translateY(-28px); } 100% { transform: rotate(78deg) translateY(-28px); } }

/* Accessibility: уважать prefers-reduced-motion — гасим декоративные/loop-анимации. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
