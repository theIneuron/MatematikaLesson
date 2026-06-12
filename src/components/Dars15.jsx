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
// --- ПОД УРОК: frac_5_10 — Вычитание дробей с равными знаменателями ---
// Визуализатор BackLine: числовая прямая 0..1, маркер прыгает ВЛЕВО (вычитание = шаг назад).
// Анимации: убираемые сегменты гаснут + перечёркиваются, обратный слайд маркера, count-down spin счётчика.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'frac-5-10-v1',
  lessonTitle: { ru: 'Вычитание дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni ayirish" }
};

// Обучающий урок: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's10', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Один ученик вычел дроби так:', uz: "Bir o'quvchi kasrlarni shunday ayirdi:" },
    body: { ru: 'Он вычел и числители, и знаменатели. Получилось 3/0 — но на ноль делить нельзя, а доли остались того же размера. Что-то не так.', uz: "U suratlarni ham, maxrajlarni ham ayirdi. 3/0 chiqdi — lekin nolga bo'lib bo'lmaydi, ulushlar esa o'sha o'lchamda qoldi. Bu yerda nimadir noto'g'ri." },
    question: { ru: 'Как думаешь: 5/6 − 2/6 = 3/0 — это правильно?', uz: "Sizningcha: 5/6 − 2/6 = 3/0 — to'g'rimi?" },
    opt0: { ru: 'Нет, тут ошибка', uz: "Yo'q, bu yerda xato" },
    opt1: { ru: 'Да, всё верно', uz: "Ha, hammasi to'g'ri" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Один ученик вычел дроби так: пять шестых минус две шестых равно три нулевых. Он вычел и числители, и знаменатели. Но на ноль делить нельзя, а доли остались того же размера. Как думаешь, это правильно? Выбери ответ.', uz: "Bir o'quvchi kasrlarni shunday ayirdi: oltidan besh minus oltidan ikki teng noldan uch. U suratlarni ham, maxrajlarni ham ayirdi. Lekin nolga bo'lib bo'lmaydi, ulushlar esa o'sha o'lchamda qoldi. Sizningcha, bu to'g'rimi? Javobni tanlang." }
  },
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    title: { ru: 'Вычтем 2/6 из 5/6 — на числовой прямой', uz: "5/6 dan 2/6 ni ayiramiz — son o'qida" },
    conclusion: { ru: 'Доли одного размера. Маркер сделал 2 шага назад: было 5 долей, убрали 2 — осталось 3. Знаменатель тот же. 5/6 − 2/6 = 3/6.', uz: "Ulushlar bir o'lchamda. Marker 2 qadam orqaga yurdi: 5 ulush bor edi, 2 tasi olindi — 3 tasi qoldi. Maxraj o'sha. 5/6 − 2/6 = 3/6." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'Понятно. А есть правило?', uz: "Tushunarli. Qoida bormi?" },
    audio: {
      ru: [
        'Вычтем две шестых из пяти шестых. Смотри на числовую прямую. Нажимай кнопку дальше.',
        'Прямая поделена на шесть равных долей. Маркер стоит на пяти шестых — это пять долей.',
        'Убираем две шестых — маркер делает два шага назад. Доли одного размера, поэтому просто считаем, сколько осталось.',
        'Маркер встал на трёх шестых. Осталось три доли из шести. Знаменатель остался шесть. Значит, пять шестых минус две шестых равно три шестых, а не три нулевых.'
      ],
      uz: [
        "Oltidan besh minus oltidan ikkini hisoblaymiz. Son o'qiga qarang. Davom etish tugmasini bosing.",
        "O'q olti teng ulushga bo'lingan. Marker oltidan beshda turibdi — bu besh ulush.",
        "Oltidan ikkini olamiz — marker ikki qadam orqaga yuradi. Ulushlar bir o'lchamda, shuning uchun nechta qolganini sanaymiz.",
        "Marker oltidan uchga keldi. Oltidan uch ulush qoldi. Maxraj olti bo'lib qoldi. Demak, oltidan besh minus oltidan ikki teng oltidan uch, noldan uch emas."
      ]
    }
  },
  s2: {
    eyebrow: { ru: 'Сделай сам', uz: "O'zingiz ayiring" },
    title: { ru: 'Убери доли сам: из 7/8 убери 3/8.', uz: "Ulushlarni o'zingiz oling: 7/8 dan 3/8 ni oling." },
    hint_a: { ru: 'Тяни ползунок — убери три восьмых.', uz: "Slayderni suring — sakkizdan uchni oling." },
    hint_b: { ru: 'Продолжай убирать. Доли того же размера, знаменатель не меняется.', uz: "Olishda davom eting. Ulushlar o'sha o'lchamda, maxraj o'zgarmaydi." },
    conclusion: { ru: 'Убрали 3 доли из 7: осталось 4. 7/8 − 3/8 = 4/8. Знаменатель остался 8.', uz: "7 tadan 3 ulush olindi: 4 tasi qoldi. 7/8 − 3/8 = 4/8. Maxraj 8 bo'lib qoldi." },
    audio: { ru: 'Убери доли сам. Двигай ползунок и убери три восьмых. Смотри, как доли одного размера просто убираются по количеству, а знаменатель остаётся восемь.', uz: "Ulushlarni o'zingiz oling. Slayderni suring va sakkizdan uchni oling. Bir o'lchamdagi ulushlar shunchaki soni bo'yicha olinishini ko'ring, maxraj esa sakkiz bo'lib qoladi." }
  },
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Вычитание при равном знаменателе', uz: "Maxraj teng bo'lganda ayirish" },
    title: { ru: 'Вычитаем числители, а знаменатель не меняем.', uz: "Suratlarni ayiramiz, maxrajni o'zgartirmaymiz." },
    card_top: { ru: 'Числитель — сколько долей. Вычитаем: 5 − 2 = 3.', uz: "Surat — nechta ulush. Ayiramiz: 5 − 2 = 3." },
    card_bottom: { ru: 'Знаменатель — размер доли. Он один и тот же, поэтому не меняется.', uz: "Maxraj — ulush o'lchami. U bir xil, shuning uchun o'zgarmaydi." },
    card_line: { ru: '5/6 − 2/6 = 3/6. Знаменатель остался 6.', uz: "5/6 − 2/6 = 3/6. Maxraj 6 bo'lib qoldi." },
    outro: { ru: 'Вычитать знаменатели нельзя — это размер доли, а не количество.', uz: "Maxrajlarni ayirib bo'lmaydi — bu ulush o'lchami, soni emas." },
    audio: { ru: 'Запомни правило. Когда у дробей одинаковый знаменатель, вычитаем только числители, а знаменатель оставляем тем же. Числитель показывает, сколько долей: пять минус два три. Знаменатель это размер доли, он один и тот же, поэтому не меняется. Пять шестых минус две шестых равно три шестых.', uz: "Qoidani eslab qoling. Kasrlarning maxraji bir xil bo'lganda, faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz. Surat nechta ulush ekanini ko'rsatadi: besh minus ikki uch. Maxraj ulush o'lchami, u bir xil, shuning uchun o'zgarmaydi. Oltidan besh minus oltidan ikki teng oltidan uch." }
  },
  s4: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Вычти дроби', uz: "Kasrlarni ayiring" },
    question: { ru: '5/6 − 2/6 = ?', uz: "5/6 − 2/6 = ?" },
    correct_text: { ru: 'Правильно. Числители 5 − 2 = 3, знаменатель 6 не меняется: 3/6.', uz: "To'g'ri. Suratlar 5 − 2 = 3, maxraj 6 o'zgarmaydi: 3/6." },
    wrong_1: { ru: 'Вычитать знаменатели нельзя. Знаменатель это размер доли, он остаётся 6. Вычти только числители: 5 − 2 = 3.', uz: "Maxrajlarni ayirib bo'lmaydi. Maxraj ulush o'lchami, u 6 bo'lib qoladi. Faqat suratlarni ayiring: 5 − 2 = 3." },
    wrong_2: { ru: 'Это сложение, а не вычитание. Числители нужно вычесть: 5 − 2 = 3. Знаменатель остаётся 6.', uz: "Bu ayirish emas, qo'shish. Suratlarni ayirish kerak: 5 − 2 = 3. Maxraj 6 bo'lib qoladi." },
    wrong_3: { ru: 'Числитель посчитан неверно. Пять минус два это три, а не два. Выйдет 3/6.', uz: "Surat noto'g'ri sanaldi. Besh minus ikki bu uch, ikki emas. 3/6 chiqadi." },
    wrong_default: { ru: 'Знаменатель остаётся 6, вычитаем числители: 5 − 2 = 3. Получается 3/6.', uz: "Maxraj 6 bo'lib qoladi, suratlarni ayiramiz: 5 − 2 = 3. 3/6 chiqadi." },
    fact: { ru: '75% на полосе загрузки — это три четвёртых. Любой прогресс-бар это дробь: сколько долей заполнено из всех.', uz: "Yuklanish chizig'idagi 75% — bu to'rtdan uch. Har qanday progress-bar — kasr: hammasidan nechta ulush to'lgani." },
    audio: {
      intro: { ru: 'Вычти две шестых из пяти шестых. Выбери правильный вариант.', uz: "Oltidan besh minus oltidan ikki nechiga teng? To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Пять минус два три, знаменатель шесть.', uz: "To'g'ri. Besh minus ikki uch, maxraj olti." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s5: {
    eyebrow: { ru: 'Сам реши', uz: "O'zingiz yeching" },
    title: { ru: 'Теперь сам: убери 4/7 из 6/7.', uz: "Endi o'zingiz: 6/7 dan 4/7 ni oling." },
    hint_a: { ru: 'Тяни ползунок — убери четыре седьмых.', uz: "Slayderni suring — yettidan to'rtni oling." },
    hint_b: { ru: 'Продолжай убирать. Знаменатель не меняется — семь.', uz: "Olishda davom eting. Maxraj o'zgarmaydi — yetti." },
    conclusion: { ru: 'Убрали 4 доли из 6: осталось 2. 6/7 − 4/7 = 2/7. Знаменатель остался 7.', uz: "6 tadan 4 ulush olindi: 2 tasi qoldi. 6/7 − 4/7 = 2/7. Maxraj 7 bo'lib qoldi." },
    audio: { ru: 'Теперь реши сам. Двигай ползунок и убери четыре седьмых. Смотри, как знаменатель остаётся семь.', uz: "Endi o'zingiz yeching. Slayderni suring va yettidan to'rtni oling. Maxraj yetti bo'lib qolishini ko'ring." }
  },
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    question: { ru: 'Вычти: 7/8 − 3/8 = ?/8. Введи числитель.', uz: "Ayiring: 7/8 − 3/8 = ?/8. Suratni kiriting." },
    placeholder: { ru: '0', uz: "0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель остаётся 8. Вычти только числители: 7 − 3.', uz: "Maxraj 8 bo'lib qoladi. Faqat suratlarni ayiring: 7 − 3." },
    fb_correct: { ru: 'Верно. 7 − 3 = 4, знаменатель 8 не меняется: получается 4/8.', uz: "To'g'ri. 7 − 3 = 4, maxraj 8 o'zgarmaydi: 4/8 chiqadi." },
    audio: {
      intro: { ru: 'Вычти три восьмых из семи восьмых. Введи числитель и нажми кнопку проверить.', uz: "Sakkizdan yetti minus sakkizdan uchni hisoblang. Suratni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Семь минус три четыре, знаменатель восемь.', uz: "To'g'ri. Yetti minus uch to'rt, maxraj sakkiz." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь восемь, вычти числители семь и три.', uz: "Unchalik emas. Maxrajni sakkiz qoldiring, suratlar yetti va uchni ayiring." }
    }
  },
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    question: { ru: 'В каком решении ошибка?', uz: "Qaysi yechimda xato bor?" },
    correct_text: { ru: 'Правильно. Здесь вычли знаменатели: 10 − 10 = 0. Так нельзя — знаменатель остаётся 10, должно быть 5/10.', uz: "To'g'ri. Bu yerda maxrajlar ayirilgan: 10 − 10 = 0. Bunday bo'lmaydi — maxraj 10 bo'lib qoladi, 5/10 bo'lishi kerak." },
    wrong_1: { ru: 'Здесь ошибки нет. 6 − 2 = 4, знаменатель 7 остаётся: 4/7 верно. Ищи решение, где менялся знаменатель.', uz: "Bu yerda xato yo'q. 6 − 2 = 4, maxraj 7 bo'lib qoladi: 4/7 to'g'ri. Maxraj o'zgargan yechimni qidiring." },
    wrong_2: { ru: 'Здесь ошибки нет. 4 − 1 = 3, знаменатель 5 остаётся: 3/5 верно. Ищи, где знаменатель стал нулём.', uz: "Bu yerda xato yo'q. 4 − 1 = 3, maxraj 5 bo'lib qoladi: 3/5 to'g'ri. Maxraj nolga aylangan joyni qidiring." },
    wrong_3: { ru: 'Здесь ошибки нет. 5 − 1 = 4, знаменатель 9 остаётся: 4/9 верно. Ошибка в другом решении.', uz: "Bu yerda xato yo'q. 5 − 1 = 4, maxraj 9 bo'lib qoladi: 4/9 to'g'ri. Xato boshqa yechimda." },
    wrong_default: { ru: 'Ошибка там, где вычли знаменатели и получили ноль внизу. Знаменатель всегда остаётся прежним.', uz: "Xato maxrajlar ayirilib, pastda nol chiqqan joyda. Maxraj doim o'sha bo'lib qoladi." },
    audio: {
      intro: { ru: 'Перед тобой четыре решения. В одном из них знаменатель вычли — это ошибка. Найди его.', uz: "Oldingizda to'rtta yechim bor. Bittasida maxraj ayirilgan — bu xato. Uni toping." },
      on_correct: { ru: 'Верно. Знаменатель нельзя вычитать, он остаётся прежним.', uz: "To'g'ri. Maxrajni ayirib bo'lmaydi, u o'sha bo'lib qoladi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    label: { ru: 'Сколько получится?', uz: "Qancha chiqadi?" },
    question: { ru: '4/4 − 4/4 = ?', uz: "4/4 − 4/4 = ?" },
    correct_text: { ru: 'Правильно. 4 − 4 = 0, числитель стал ноль: 0/4 — это ноль, долей не осталось. Знаменатель оставался 4.', uz: "To'g'ri. 4 − 4 = 0, surat nolga tushdi: 0/4 — bu nol, ulush qolmadi. Maxraj 4 bo'lib qoldi." },
    wrong_1: { ru: 'Вычел и числители, и знаменатели. Знаменатель не вычитают — он остаётся 4. Числители 4 − 4 = 0, выходит 0/4, то есть ноль.', uz: "Suratlarni ham, maxrajlarni ham ayirdingiz. Maxrajni ayirmaydilar — u 4 bo'lib qoladi. Suratlar 4 − 4 = 0, 0/4 chiqadi, ya'ni nol." },
    wrong_2: { ru: 'Вычел только знаменатель — так нельзя. Знаменатель остаётся 4. Вычти числители: 4 − 4 = 0. Получается ноль.', uz: "Faqat maxrajni ayirdingiz — bunday bo'lmaydi. Maxraj 4 bo'lib qoladi. Suratlarni ayiring: 4 − 4 = 0. Nol chiqadi." },
    wrong_3: { ru: 'Это сложение. Нужно вычесть: 4 − 4 = 0. Долей не осталось — это ноль.', uz: "Bu qo'shish. Ayirish kerak: 4 − 4 = 0. Ulush qolmadi — bu nol." },
    wrong_default: { ru: 'Знаменатель остаётся 4, числители 4 − 4 = 0. Долей не осталось — это ноль.', uz: "Maxraj 4 bo'lib qoladi, suratlar 4 − 4 = 0. Ulush qolmadi — bu nol." },
    audio: {
      intro: { ru: 'Вычти четыре четвёртых из четырёх четвёртых. Сколько получится? Выбери ответ.', uz: "To'rtdan to'rt minus to'rtdan to'rt nechiga teng? Javobni tanlang." },
      on_correct: { ru: 'Верно. Долей не осталось — это ноль.', uz: "To'g'ri. Ulush qolmadi — bu nol." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s9: {
    eyebrow: { ru: 'Задача · игра', uz: "Masala · o'yin" },
    title: { ru: 'Ботир сражается в игре.', uz: "Botir o'yinda jang qilmoqda." },
    body_p1: { ru: 'Полоса здоровья поделена на 8 частей. У Ботира было 7/8 здоровья. В бою он потерял 3/8. Сколько здоровья осталось у Ботира?', uz: "Jon chizig'i 8 ta ulushga bo'lingan. Botirning joni 7/8 edi. Jangda u 3/8 jonini yo'qotdi. Botirda qancha jon qoldi?" },
    card_line_label: { ru: 'Было', uz: "Bor edi" },
    card_line_value: { ru: '7/8 здоровья', uz: "jonning 7/8 qismi" },
    card_parts_label: { ru: 'Потерял', uz: "Yo'qotdi" },
    card_parts_value: { ru: '3/8', uz: "3/8" },
    outro: { ru: 'Знаменатель у обеих долей один — восьмые. Помоги Ботиру на следующем шаге.', uz: "Har ikkala ulushning maxraji bir — sakkizdan. Keyingi bosqichda Botirga yordam bering." },
    btn_help: { ru: 'Помочь Ботиру', uz: "Botirga yordam berish" },
    audio: { ru: 'Ботир сражается в игре. Полоса здоровья поделена на восемь частей. У Ботира было семь восьмых здоровья, в бою он потерял три восьмых. Сколько здоровья осталось? Знаменатель у обеих долей один, восьмые. Подумай, как вычесть.', uz: "Botir o'yinda jang qilmoqda. Jon chizig'i sakkiz ulushga bo'lingan. Botirning joni sakkizdan yetti edi, jangda u sakkizdan uchni yo'qotdi. Qancha jon qoldi? Har ikkala ulushning maxraji bir, sakkizdan. Qanday ayirishni o'ylab ko'ring." }
  },
  s10: {
    eyebrow: { ru: 'Задача · игра', uz: "Masala · o'yin" },
    label: { ru: 'Какое действие?', uz: "Qaysi amal?" },
    question: { ru: 'Что описывает ситуацию: было 7/8, потерял 3/8?', uz: "Vaziyatni nima ifodalaydi: 7/8 bor edi, 3/8 yo'qotdi?" },
    correct_text: { ru: 'Правильно. Потерял — значит убираем: 7/8 − 3/8.', uz: "To'g'ri. Yo'qotdi — demak olamiz: 7/8 − 3/8." },
    wrong_1: { ru: 'Это сложение. Но Ботир потерял здоровье, значит его стало меньше — нужно вычитание.', uz: "Bu qo'shish. Lekin Botir jon yo'qotdi, demak joni kamaydi — ayirish kerak." },
    wrong_2: { ru: 'Порядок перепутан. Было больше — 7/8, убираем меньшее — 3/8. Уменьшаемое идёт первым.', uz: "Tartib chalkashdi. Ko'pi 7/8 edi, kamini olamiz — 3/8. Kamayuvchi birinchi turadi." },
    wrong_3: { ru: 'У Ботира было 7/8 здоровья, а не полная полоса. Вычитаем из 7/8: 7/8 − 3/8.', uz: "Botirning joni 7/8 edi, to'liq chiziq emas. 7/8 dan ayiramiz: 7/8 − 3/8." },
    wrong_default: { ru: 'Ботир потерял часть здоровья, значит вычитаем меньшее из большего: 7/8 − 3/8.', uz: "Botir jonining bir qismini yo'qotdi, demak kattadan kichikni ayiramiz: 7/8 − 3/8." },
    audio: {
      intro: { ru: 'У Ботира было семь восьмых здоровья, он потерял три восьмых. Каким действием это записать? Выбери вариант.', uz: "Botirning joni sakkizdan yetti edi, u sakkizdan uchni yo'qotdi. Buni qaysi amal bilan yozamiz? Variantni tanlang." },
      on_correct: { ru: 'Верно. Потерял — это вычитание.', uz: "To'g'ri. Yo'qotdi — bu ayirish." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s11: {
    eyebrow: { ru: 'Задача · игра', uz: "Masala · o'yin" },
    label: { ru: 'Сколько осталось?', uz: "Qancha qoldi?" },
    question: { ru: '7/8 − 3/8 = ?', uz: "7/8 − 3/8 = ?" },
    correct_text: { ru: 'Правильно. 7 − 3 = 4, выходит 4/8. А 4/8 — это половина здоровья, 1/2.', uz: "To'g'ri. 7 − 3 = 4, 4/8 chiqadi. 4/8 esa jonning yarmi, 1/2." },
    wrong_1: { ru: 'Значение верное, но половину записывают проще: 4/8 = 1/2.', uz: "Qiymati to'g'ri, lekin yarmi soddaroq yoziladi: 4/8 = 1/2." },
    wrong_2: { ru: 'Вычитать знаменатели нельзя. Знаменатель остаётся 8. Числители 7 − 3 = 4.', uz: "Maxrajlarni ayirib bo'lmaydi. Maxraj 8 bo'lib qoladi. Suratlar 7 − 3 = 4." },
    wrong_3: { ru: 'Это сложение. Ботир потерял здоровье, значит вычитаем: 7 − 3 = 4.', uz: "Bu qo'shish. Botir jon yo'qotdi, demak ayiramiz: 7 − 3 = 4." },
    wrong_default: { ru: 'Знаменатель 8 остаётся, числители 7 − 3 = 4. Получается 4/8, а это половина, 1/2.', uz: "Maxraj 8 bo'lib qoladi, suratlar 7 − 3 = 4. 4/8 chiqadi, bu esa yarim, 1/2." },
    fact: { ru: 'Заряд телефона и полоса здоровья в игре — тоже дробь. Когда они убывают, программа вычитает дроби так же: числитель меньше, знаменатель тот же.', uz: "Telefon batareyasi va o'yindagi jon chizig'i ham kasr. Ular kamayganda dastur xuddi shunday kasr ayiradi: surat kamayadi, maxraj o'sha." },
    audio: {
      intro: { ru: 'Сколько здоровья осталось у Ботира? Запиши ответ в самом простом виде. Выбери вариант.', uz: "Botirda qancha jon qoldi? Javobni eng sodda ko'rinishda yozing. Variantni tanlang." },
      on_correct: { ru: 'Верно. Четыре восьмых это половина здоровья.', uz: "To'g'ri. Sakkizdan to'rt bu jonning yarmi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s12: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    label: { ru: 'Вычти дроби', uz: "Kasrlarni ayiring" },
    question: { ru: '9/11 − 4/11 = ?', uz: "9/11 − 4/11 = ?" },
    correct_text: { ru: 'Правильно. 9 − 4 = 5, знаменатель 11 не меняется: 5/11.', uz: "To'g'ri. 9 − 4 = 5, maxraj 11 o'zgarmaydi: 5/11." },
    wrong_1: { ru: 'Вычитать знаменатели нельзя. Знаменатель остаётся 11. Числители 9 − 4 = 5.', uz: "Maxrajlarni ayirib bo'lmaydi. Maxraj 11 bo'lib qoladi. Suratlar 9 − 4 = 5." },
    wrong_2: { ru: 'Это сложение. Нужно вычесть: 9 − 4 = 5. Знаменатель 11.', uz: "Bu qo'shish. Ayirish kerak: 9 − 4 = 5. Maxraj 11." },
    wrong_3: { ru: 'Знаменатели не складывают и не вычитают. Знаменатель остаётся 11, а не 22. Числители 9 − 4 = 5.', uz: "Maxrajlar qo'shilmaydi ham, ayirilmaydi ham. Maxraj 11 bo'lib qoladi, 22 emas. Suratlar 9 − 4 = 5." },
    wrong_default: { ru: 'Знаменатель 11 остаётся, вычитаем числители: 9 − 4 = 5. Получается 5/11.', uz: "Maxraj 11 bo'lib qoladi, suratlarni ayiramiz: 9 − 4 = 5. 5/11 chiqadi." },
    audio: {
      intro: { ru: 'Вычти четыре одиннадцатых из девяти одиннадцатых. Выбери правильный вариант.', uz: "O'n birdan to'qqiz minus o'n birdan to'rt nechiga teng? To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Девять минус четыре пять, знаменатель одиннадцать.', uz: "To'g'ri. To'qqiz minus to'rt besh, maxraj o'n bir." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s13: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    label: { ru: 'В самом простом виде', uz: "Eng sodda ko'rinishda" },
    question: { ru: '10/12 − 4/12 = ?', uz: "10/12 − 4/12 = ?" },
    correct_text: { ru: 'Правильно. 10 − 4 = 6, выходит 6/12. А 6/12 сокращается до 1/2.', uz: "To'g'ri. 10 − 4 = 6, 6/12 chiqadi. 6/12 esa 1/2 gacha qisqaradi." },
    wrong_1: { ru: 'Значение верное, но это не простейший вид. 6/12 = 1/2.', uz: "Qiymati to'g'ri, lekin bu eng sodda ko'rinish emas. 6/12 = 1/2." },
    wrong_2: { ru: 'Вычитать знаменатели нельзя. Знаменатель остаётся 12. Числители 10 − 4 = 6, потом сократи.', uz: "Maxrajlarni ayirib bo'lmaydi. Maxraj 12 bo'lib qoladi. Suratlar 10 − 4 = 6, keyin qisqartiring." },
    wrong_3: { ru: 'Это сложение. Нужно вычесть: 10 − 4 = 6. Затем 6/12 = 1/2.', uz: "Bu qo'shish. Ayirish kerak: 10 − 4 = 6. Keyin 6/12 = 1/2." },
    wrong_default: { ru: 'Знаменатель 12 остаётся, числители 10 − 4 = 6. Получается 6/12, а это 1/2.', uz: "Maxraj 12 bo'lib qoladi, suratlar 10 − 4 = 6. 6/12 chiqadi, bu esa 1/2." },
    fact: { ru: 'Громкость и яркость экрана — тоже дробь: от 0 до максимума. Сдвинуть ползунок вниз — уменьшить дробь.', uz: "Ovoz balandligi va ekran yorqinligi ham kasr: 0 dan to'liqgacha. Slayderni pasaytirish — kasrni kamaytirish." },
    audio: {
      intro: { ru: 'Вычти четыре двенадцатых из десяти двенадцатых и запиши ответ в самом простом виде. Выбери вариант.', uz: "O'n ikkidan o'n minus o'n ikkidan to'rtni hisoblang va javobni eng sodda ko'rinishda yozing. Variantni tanlang." },
      on_correct: { ru: 'Верно. Шесть двенадцатых это половина, одна вторая.', uz: "To'g'ri. O'n ikkidan olti bu yarim, ikkidan bir." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },
  s14: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты вычитаешь дроби с равным знаменателем.', uz: "Endi siz teng maxrajli kasrlarni ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'У дробей с равным знаменателем вычитаем числители.', uz: "Teng maxrajli kasrlarda suratlarni ayiramiz." },
    main_2: { ru: 'Знаменатель не меняется — это размер доли, а не количество.', uz: "Maxraj o'zgarmaydi — bu ulush o'lchami, soni emas." },
    main_3: { ru: 'Вычитать знаменатели нельзя (5/6 − 2/6 это 3/6, а не 3/0).', uz: "Maxrajlarni ayirib bo'lmaydi (5/6 − 2/6 bu 3/6, 3/0 emas)." },
    main_4: { ru: 'Если убрать все доли, разность равна нулю (5/5 − 5/5 = 0), а знаменатель не меняется.', uz: "Agar hamma ulush olinsa, ayirma nolga teng (5/5 − 5/5 = 0), maxraj esa o'zgarmaydi." },
    back_to_hook: { ru: 'Тот ученик вычел и числители, и знаменатели и получил 3/0. Правильно — 3/6: знаменатель остаётся шесть.', uz: "O'sha o'quvchi suratlarni ham, maxrajlarni ham ayirib 3/0 oldi. To'g'risi — 3/6: maxraj olti bo'lib qoladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с равным знаменателем» (тот же приём с числителями) и «Сокращение дробей».', uz: "«Teng maxrajli kasrlarni qo'shish» (suratlar bilan o'sha amal) va «Kasrlarni qisqartirish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сложение и вычитание дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni qo'shish va ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты вычитаешь дроби с равным знаменателем. Вычитаем числители, а знаменатель оставляем тем же, это размер доли. Вычитать знаменатели нельзя: пять шестых минус две шестых это три шестых, а не три нулевых. Если убрать все доли, разность равна нулю, а знаменатель всё равно не меняется. Тот ученик в начале ошибся, правильный ответ три шестых. Дальше научимся вычитать и складывать дроби с разными знаменателями.', uz: "Zo'r. Endi siz teng maxrajli kasrlarni ayirasiz. Suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz, bu ulush o'lchami. Maxrajlarni ayirib bo'lmaydi: oltidan besh minus oltidan ikki bu oltidan uch, noldan uch emas. Agar hamma ulush olinsa, ayirma nolga teng bo'ladi, maxraj esa baribir o'zgarmaydi. Boshidagi o'quvchi xato qildi, to'g'ri javob oltidan uch. Keyin har xil maxrajli kasrlarni ayirish va qo'shishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_10: BackLine — числовая прямая, маркер прыгает влево.
// ============================================================

// Подпись-уравнение вычитания: a/den − b/den (= result). result === 0 рисуется как целое 0.
const EqLabel = ({ den, a, b, showResult = false }) => {
  const r = a - b;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Frac n={String(a)} d={String(den)} size="mid" color={T.accent}/>
      <Op>−</Op>
      <Frac n={String(b)} d={String(den)} size="mid" color={T.ink2}/>
      {showResult && <><Op>=</Op>{r === 0
        ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>0</span>
        : <Frac n={String(r)} d={String(den)} size="mid" color={T.success}/>}</>}
    </div>
  );
};

// BackLine — прямая 0..1 как «health-bar»: сплошная заливка current/den ПЛАВНО убывает (transition width),
// маркер едет по краю. ghost — исходный уровень (start). onCell — клик по доле (убрать до неё).
const BackLine = ({ den, start, current, success = false, onCell, showCount = true }) => {
  const fillPct = (current / den) * 100;
  const ghostPct = (start / den) * 100;
  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div className="bl-bar">
        <div className="bl-ghost" style={{ width: `${ghostPct}%` }}/>
        <div className={success ? 'bl-fill bl-fill-done' : 'bl-fill'} style={{ width: `${fillPct}%` }}/>
        {Array.from({ length: den - 1 }).map((_, i) => (
          <div key={`t${i}`} className="bl-tick" style={{ left: `${((i + 1) / den) * 100}%` }}/>
        ))}
        {onCell && Array.from({ length: den }).map((_, i) => (
          <div key={`h${i}`} className="bl-hit" onClick={() => onCell(i)} style={{ left: `${(i / den) * 100}%`, width: `${100 / den}%` }}/>
        ))}
        <div className="bl-marker" style={{ left: `${fillPct}%` }}><span className="bl-dot"/></div>
      </div>
      <div className="bl-axis">
        <span className="mono small" style={{ color: T.ink3 }}>0</span>
        <span className="mono small" style={{ color: T.ink3 }}>1</span>
      </div>
      {showCount && (
        <div className="bl-count" key={current}>
          <Frac n={String(current)} d={String(den)} size="sm" color={success ? T.success : T.accent}/>
        </div>
      )}
    </div>
  );
};

// Живая прямая для input-теста: маркер на введённое число (числитель остатка).
const LiveBackLine = ({ den, start, value, solved }) => {
  const raw = parseInt(value, 10);
  const cur = isNaN(raw) ? start : Math.max(0, Math.min(start, raw));
  return (
    <div className={solved ? 'bl-glow' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
      <BackLine den={den} start={start} current={cur} success={solved}/>
    </div>
  );
};

// ============================================================
// ФАКТ-БЛОК (IT) — пилот: маленькая карта с мини-анимацией, не мешает основному.
// Только визуал (без аудио), чтобы не конкурировать с основным нарративом.
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
// Мини-анимации (CSS-only, без set-state-in-effect)
const AnimProgress = () => (<div className="fa-prog"><div className="fa-prog-fill"/></div>);
const AnimBattery = () => (<div className="fa-bat"><div className="fa-bat-fill"/><span className="fa-bat-tip"/></div>);
const AnimSlider = () => (<div className="fa-sld"><div className="fa-sld-track"/><div className="fa-sld-knob"/></div>);

const FactCard = ({ text, anim }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(FACT_BADGE)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
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

// s0 — HOOK (без персонажей): провокация 5/6 − 2/6 = 3/0
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="5" d="6" size="mid"/><Op>−</Op><Frac n="2" d="6" size="mid"/><Op>=</Op><Frac n="3" d="0" size="mid" color={T.accent}/><span className="mop" style={{ color: T.ink3 }}>?</span></div>
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

// s1 — EXPLORATION step: 5/6 − 2/6 = 3/6 (маркер влево)
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
  const current = step >= 2 ? 3 : 5;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <BackLine den={6} start={5} current={current} success={step >= 3}/>
          <EqLabel den={6} a={5} b={2} showResult={step >= 3}/>
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION interactive: убрать 3/8 из 7/8 (ползунок → бар сливается вживую)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 8, start = 7, sub = 3;
  const [removed, setRemoved] = useState(0);
  const current = start - removed;
  const done = removed === sub;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className={done ? 'frame fade-up delay-1 bl-glow' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <BackLine den={den} start={start} current={current} success={done}/>
          <EqLabel den={den} a={start} b={sub} showResult={done}/>
        </div>
        <div className="fade-up delay-2" style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: '0 0 6px', color: T.accent }}>{lang === 'uz' ? 'Olindi' : 'Убрано'}: {removed}/{den}</p>
          <Slider value={removed} min={0} max={start} onChange={setRemoved}/>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.conclusion) : (removed === 0 ? t(c.hint_a) : t(c.hint_b)))}</p>
      </div>
    </Stage>
  );
};

// s3 — RULE: вычитаем числители (5/6 − 2/6)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BackLine den={6} start={5} current={3} showCount={false}/>
          <EqLabel den={6} a={5} b={2} showResult={true}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_bottom))}</p>
            <p className="small" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.card_line))}</p>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s4 — TEST choice 5/6 − 2/6 -> 3/6 (correct на B)
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const base = [<Frac n="3" d="6" size="sm"/>, <Frac n="3" d="0" size="sm"/>, <Frac n="7" d="6" size="sm"/>, <Frac n="2" d="6" size="sm"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><div className="frame" style={{ marginTop: 12, padding: '12px 16px', display: 'flex', justifyContent: 'center' }}><EqLabel den={6} a={5} b={2}/></div></>);
  return <QuestionScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimProgress/>}/>}/>;
};

// s5 — EXPLORATION interactive (сам реши): 6/7 − 4/7 -> 2/7 (тап по долям)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const den = 7, start = 6, sub = 4;
  const [removed, setRemoved] = useState(0);
  const current = start - removed;
  const done = removed === sub;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className={done ? 'frame fade-up delay-1 bl-glow' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <BackLine den={den} start={start} current={current} success={done}/>
          <EqLabel den={den} a={start} b={sub} showResult={done}/>
        </div>
        <div className="fade-up delay-2" style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: '0 0 6px', color: T.accent }}>{lang === 'uz' ? 'Olindi' : 'Убрано'}: {removed}/{den}</p>
          <Slider value={removed} min={0} max={start} onChange={setRemoved}/>
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.conclusion) : (removed === 0 ? t(c.hint_a) : t(c.hint_b)))}</p>
      </div>
    </Stage>
  );
};

// s6 — TEST input 7/8 − 3/8 -> 4
const Screen6 = (props) => {
  const c = CONTENT.s6;
  return <NumInputScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={c} correctValue={4} renderVisual={({ value, solved }) => <LiveBackLine den={8} start={7} value={value} solved={solved}/>}/>;
};

// s7 — TEST choice: найди ошибку (5/0) (correct на C)
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const eq = (n1, d1, n2, d2, rn, rd) => (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Frac n={n1} d={d1} size="sm"/><Op size="sm">−</Op><Frac n={n2} d={d2} size="sm"/><Op size="sm">=</Op><Frac n={rn} d={rd} size="sm"/></span>);
  const base = [eq('8', '10', '3', '10', '5', '0'), eq('6', '7', '2', '7', '4', '7'), eq('4', '5', '1', '5', '3', '5'), eq('5', '9', '1', '9', '4', '9')];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 1, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s8 — TEST choice 4/4 − 4/4 -> 0 (correct на D)
const Screen8 = (props) => {
  const t = useT(); const c = CONTENT.s8;
  const base = [<span className="display" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: T.ink }}>0</span>, <Frac n="0" d="0" size="sm"/>, <Frac n="4" d="0" size="sm"/>, <Frac n="8" d="8" size="sm"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 1, 2, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><div className="frame" style={{ marginTop: 12, padding: '12px 16px', display: 'flex', justifyContent: 'center' }}><EqLabel den={4} a={4} b={4}/></div></>);
  return <QuestionScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s9 — CASE setup (Ботир, игра: здоровье 7/8 − 3/8)
const Screen9 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BackLine den={8} start={7} current={7} showCount={false}/>
          <EqLabel den={8} a={7} b={3}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 6vw, 56px)', flexWrap: 'wrap' }}>
            <div><p className="eyebrow" style={{ color: T.accent, marginBottom: 4 }}>{t(c.card_line_label)}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.card_line_value))}</p></div>
            <div><p className="eyebrow" style={{ color: T.ink2, marginBottom: 4 }}>{t(c.card_parts_label)}</p><p className="body" style={{ margin: 0 }}>{mt(t(c.card_parts_value))}</p></div>
          </div>
        </div>
        <p className="body fade-up delay-2">{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s10 — CASE step: какое действие (correct на A)
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const expr = (op, n1, d1, n2, d2) => (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Frac n={n1} d={d1} size="sm"/><Op size="sm">{op}</Op><Frac n={n2} d={d2} size="sm"/></span>);
  const base = [expr('−', '7', '8', '3', '8'), expr('+', '7', '8', '3', '8'), expr('−', '3', '8', '7', '8'), expr('−', '8', '8', '3', '8')];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 16 }}><BackLine den={8} start={7} current={7}/></div></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — CASE conclusion 7/8 − 3/8 = 1/2 (correct на C)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [<Frac n="1" d="2" size="sm"/>, <Frac n="4" d="8" size="sm"/>, <Frac n="4" d="0" size="sm"/>, <Frac n="10" d="8" size="sm"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><div className="frame" style={{ marginTop: 12, padding: '12px 16px', display: 'flex', justifyContent: 'center' }}><EqLabel den={8} a={7} b={3}/></div></>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimBattery/>}/>}/>;
};

// s12 — TEST FINAL 9/11 − 4/11 -> 5/11 (correct на B)
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [<Frac n="5" d="11" size="sm"/>, <Frac n="5" d="0" size="sm"/>, <Frac n="13" d="11" size="sm"/>, <Frac n="5" d="22" size="sm"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 3, 1]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><div className="frame" style={{ marginTop: 12, padding: '12px 16px', display: 'flex', justifyContent: 'center' }}><EqLabel den={11} a={9} b={4}/></div></>);
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s13 — TEST FINAL 10/12 − 4/12 = 1/2 (correct на D)
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [<Frac n="1" d="2" size="sm"/>, <Frac n="6" d="12" size="sm"/>, <Frac n="6" d="0" size="sm"/>, <Frac n="14" d="12" size="sm"/>];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 2, 1, 0]);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><div className="frame" style={{ marginTop: 12, padding: '12px 16px', display: 'flex', justifyContent: 'center' }}><EqLabel den={12} a={10} b={4}/></div></>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} anim={<AnimSlider/>}/>}/>;
};

// s14 — SUMMARY + связи
const Screen14 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
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
          <EqLabel den={6} a={5} b={2} showResult={true}/>
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
export default function FractionSubtractSameDenLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
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

/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: 54px; display: flex; align-items: center; justify-content: center; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(13px, 1.6vw, 14px); line-height: 1.45; color: #0E0E10; }
/* progress bar fill loop */
.fa-prog { width: 50px; height: 12px; border-radius: 99px; background: rgba(1, 154, 203, 0.18); overflow: hidden; }
.fa-prog-fill { height: 100%; border-radius: 99px; background: #019ACB; animation: faProg 2.4s ease-in-out infinite; }
@keyframes faProg { 0% { width: 8%; } 60% { width: 75%; } 100% { width: 8%; } }
/* battery drain loop */
.fa-bat { position: relative; width: 46px; height: 22px; border: 2px solid #019ACB; border-radius: 5px; padding: 2px; }
.fa-bat-tip { position: absolute; right: -5px; top: 6px; width: 3px; height: 8px; background: #019ACB; border-radius: 0 2px 2px 0; }
.fa-bat-fill { height: 100%; border-radius: 2px; animation: faBat 2.8s ease-in-out infinite; }
@keyframes faBat { 0% { width: 90%; background: #1F7A4D; } 50% { width: 28%; background: #FF4F28; } 100% { width: 90%; background: #1F7A4D; } }
/* slider knob loop */
.fa-sld { position: relative; width: 52px; height: 22px; display: flex; align-items: center; }
.fa-sld-track { width: 100%; height: 4px; border-radius: 99px; background: rgba(1, 154, 203, 0.25); }
.fa-sld-knob { position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%; background: #019ACB; transform: translateY(-50%); box-shadow: 0 0 8px rgba(1, 154, 203, 0.5); animation: faSld 2.6s ease-in-out infinite; }
@keyframes faSld { 0% { left: 62%; } 50% { left: 4%; } 100% { left: 62%; } }
`;
