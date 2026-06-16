import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Нахождение процента от числа — perc_5_02 (Dars26)
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
// --- POD UROK: perc_5_02 — Sonning foizini topish / Нахождение процента от числа (PROMPT 2026-06-15) ---
// Markaziy misconception M1: foiz raqamining o'zini javob deb olish / asos sonni e'tiborga olmaslik
// ("$1200 ning 20% i = 20"). M2: masala turini chalkashtirish (foizni topish <-> son bo'yicha topish).
// Asosiy usul: 1% = N/100, keyin x foiz (intuitiv); yordamchi: X/100 x N (kasr). Vizualizator
// PercentBar (dual-axis: tepada %, pastda qiymat) + hook-loop PercentHook (iPhone narx yorlig'i).
// SYUJET: yangi iPhone xaridi, narxlar DOLLARDA (hisobni soddalashtirish uchun). Test turlari:
// warm-up MC / MC / NumInput / fill-blank / multi-select / find-the-wrong / slider-placement / MC.
// Hook: Kamol (chegirma xatosi), Madina (shubha); case: Feruza (ikki do'kon iPhone bitimi).
// IP-OGOHLANTIRISH: "iPhone" — Apple savdo belgisi; tijoriy ishlatish huquqlarini Fuzayl/legal
// tozalashi kerak (umumiy "smartfon" ga almashtirish bir tahrir). Faktlar: Rim 1% solig'i /
// fayl yuklash / sport — DRAFT, validatsiya kerak.
// ============================================================

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'perc-5-02-v1',
  lessonTitle: { ru: 'Нахождение процента от числа', uz: "Sonning foizini topish" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — Kamol iPhone chegirma xatosi. Tuzoq: foiz raqamini javob deb olish (M1). ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    lead: {
      ru: 'Новый iPhone стоит 1200 долларов, на него скидка 20%. (Считаем в долларах — так проще.) Камол говорит: «Сэкономлю 20 долларов!» Мадина сомневается. Камол прав?',
      uz: "Yangi iPhone narxi 1200 dollar, unga 20% chegirma bor. (Dollarda hisoblaymiz — shunday osonroq.) Kamol: «20 dollar tejayman!» — deydi. Madina shubhalanadi. Kamol haqmi?"
    },
    opt0: { ru: 'Да, скидка — это 20 долларов', uz: "Ha, chegirma — 20 dollar" },
    opt1: { ru: 'Нет, скидка считается иначе', uz: "Yo'q, chegirma boshqacha hisoblanadi" },
    opt2: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    reveal: {
      ru: 'Запомни свой ответ. В конце урока вернёмся к покупке Камола.',
      uz: "Javobingizni eslab qoling. Dars oxirida Kamolning xaridiga qaytamiz."
    },
    audio: {
      intro: {
        ru: 'Новый айфон стоит тысячу двести долларов, на него скидка двадцать процентов. Считать будем в долларах, так проще. Камол говорит, что сэкономит двадцать долларов. Мадина сомневается. Как думаешь, прав ли Камол?',
        uz: "Yangi ayfon narxi ming ikki yuz dollar, unga yigirma foiz chegirma bor. Dollarda hisoblaymiz, shunday osonroq. Kamol yigirma dollar tejayman deydi. Madina shubhalanadi. Sizningcha, Kamol haqmi?"
      },
      on_correct: { ru: 'Хорошо. Разберёмся вместе.', uz: "Yaxshi. Birgalikda aniqlab olamiz." },
      on_wrong:   { ru: 'Хорошо. Разберёмся вместе.', uz: "Yaxshi. Birgalikda aniqlab olamiz." }
    }
  },

  // ---- s1 WARM-UP — perc_5_01 ni eslash (foiz = yuzdan ulush). scored=false, correct C ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    question: {
      ru: 'В прошлом уроке: чему равны 45%, если записать обыкновенной дробью?',
      uz: "O'tgan darsda: 45% oddiy kasr bilan yozilsa, nimaga teng?"
    },
    opt0: { ru: '45/100', uz: '45/100' },
    opt1: { ru: '45 целых', uz: '45 butun' },
    opt2: { ru: '100/45', uz: '100/45' },
    opt3: { ru: '4,5', uz: '4,5' },
    correct_text: {
      ru: 'Верно. Процент — это сотая доля, поэтому 45% = 45/100.',
      uz: "To'g'ri. Foiz — bu yuzdan ulush, shuning uchun 45% = 45/100."
    },
    wrong_0: {
      ru: '45 целых — это очень много. А процент — это всегда доля из ста, меньше или равно целому.',
      uz: "45 butun — bu juda ko'p. Foiz esa doim yuzdan ulush, butundan kichik yoki teng."
    },
    wrong_1: {
      ru: 'Дробь перевёрнута. Знаменатель у процента — всегда 100, ведь процент это доля из ста.',
      uz: "Kasr ag'darilgan. Foizning maxraji — doim 100, chunki foiz yuzdan ulush."
    },
    wrong_2: {
      ru: '4,5 — это другое число. 45% десятичной дробью будет 0,45, а обыкновенной — 45/100.',
      uz: "4,5 — boshqa son. 45% o'nli kasrda 0,45 bo'ladi, oddiy kasrda esa — 45/100."
    },
    audio: {
      intro: {
        ru: 'Вспомним прошлый урок. Сорок пять процентов это какая обыкновенная дробь? Выбери вариант.',
        uz: "O'tgan darsni eslaymiz. Qirq besh foiz qaysi oddiy kasr? Variantni tanlang."
      },
      on_correct: { ru: 'Верно. Сорок пять сотых.', uz: "To'g'ri. Yuzdan qirq besh." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — 1% usuli (tap-paced): 1% = 12 dollar, x20 = 240 ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: {
      ru: 'Вернёмся к айфону. Чтобы найти 20% от 1200 долларов, сначала найдём 1%. Делим на сто: 1% = 12 долларов. Теперь нажимай и набирай по одному проценту.',
      uz: "Ayfonga qaytamiz. 1200 dollarning 20% ini topish uchun avval 1% ni topamiz. Yuzga bo'lamiz: 1% = 12 dollar. Endi bosing va bittadan foiz to'plang."
    },
    btn_step: { ru: 'Прибавить 1%', uz: "1% qo'shish" },
    cells: {
      ru: ['1% это 12 долларов. Нажимай дальше.', '2% это 24.', '3% это 36.', '4% это 48.', '5% это 60.', '6% это 72.', '7% это 84.', '8% это 96.', '9% это 108.', '10% это 120 — половина пути.', '11% это 132.', '12% это 144.', '13% это 156.', '14% это 168.', '15% это 180.', '16% это 192.', '17% это 204.', '18% это 216.', '19% это 228.', 'Ещё один процент — и будет двадцать.'],
      uz: ["1% bu 12 dollar. Davom eting.", "2% bu 24.", "3% bu 36.", "4% bu 48.", "5% bu 60.", "6% bu 72.", "7% bu 84.", "8% bu 96.", "9% bu 108.", "10% bu 120 — yo'lning yarmi.", "11% bu 132.", "12% bu 144.", "13% bu 156.", "14% bu 168.", "15% bu 180.", "16% bu 192.", "17% bu 204.", "18% bu 216.", "19% bu 228.", "Yana bir foiz — yigirma bo'ladi."]
    },
    note: {
      ru: 'Готово. 20% это 1%, взятый 20 раз: 12 × 20 = 240. Значит, скидка — 240 долларов, а не 20.',
      uz: "Tayyor. 20% — bu 20 marta olingan 1%: 12 x 20 = 240. Demak, chegirma — 240 dollar, 20 emas."
    },
    audio: {
      intro: {
        ru: 'Чтобы найти процент от числа, удобно сначала найти один процент. Делим тысячу двести на сто и получаем двенадцать. Теперь нажимай кнопку и набирай проценты по одному.',
        uz: "Sonning foizini topish uchun avval bir foizni topgan qulay. Ming ikki yuzni yuzga bo'lamiz va o'n ikki chiqadi. Endi tugmani bosing va foizlarni bittadan to'plang."
      },
      done: {
        ru: 'Двадцать процентов это один процент, взятый двадцать раз. Двенадцать умножить на двадцать это двести сорок. Вот настоящая скидка, а не двадцать долларов.',
        uz: "Yigirma foiz, bu yigirma marta olingan bir foiz. O'n ikkini yigirmaga ko'paytirsak, ikki yuz qirq chiqadi. Mana, haqiqiy chegirma, yigirma dollar emas."
      }
    }
  },

  // ---- s3 EXPLORATION — jonli slayder: foiz <-> qiymat bog'lanishi (total=200, quloqchin) ----
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: {
      ru: 'А теперь наушники за 200 долларов. Подвигай ползунок: сколько процентов — столько и долларов скидки. Процент и сумма связаны.',
      uz: "Endi 200 dollarlik quloqchin. Slayderni suring: necha foiz bo'lsa — shuncha dollar chegirma. Foiz va summa bog'liq."
    },
    hint_move: {
      ru: 'Один процент от 200 это 2 доллара. Сколько процентов — столько раз по 2.',
      uz: "200 ning bir foizi — 2 dollar. Necha foiz bo'lsa — shuncha marta 2 dan."
    },
    note_full: {
      ru: '100% от 200 — это всё число, то есть 200. А 0% — это ничего.',
      uz: "200 ning 100% i — bu butun son, ya'ni 200. 0% esa — hech narsa."
    },
    audio: {
      ru: 'Двигай ползунок и следи за двумя шкалами. Сверху проценты, снизу доллары. Например, тридцать процентов от двухсот это шестьдесят долларов. Пятьдесят процентов это половина, то есть сто. А сто процентов это всё число, двести. Процент и сумма всегда связаны.',
      uz: "Slayderni suring va ikki shkalani kuzating. Tepada foizlar, pastda dollarlar. Masalan, ikki yuzning o'ttiz foizi oltmish dollarga teng. Ellik foiz, bu yarmi, ya'ni yuz. Yuz foiz esa butun son, ikki yuz. Foiz va summa doim bog'liq."
    }
  },

  // ---- s4 RULE 1 — ikki usul (1% x X asosiy; X/100 x N yordamchi) ----
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    lead: {
      ru: 'Итак, чтобы найти процент от числа, есть два надёжных способа.',
      uz: "Demak, sonning foizini topish uchun ikkita ishonchli usul bor."
    },
    rule_main: { ru: 'Способ 1: найди 1% (раздели на 100), потом умножь на число процентов', uz: "1-usul: 1% ni toping (100 ga bo'ling), keyin foizlar soniga ko'paytiring" },
    ex_easy: { ru: 'Например: 1% от 1200 = 12, значит 20% = 12 × 20 = 240.', uz: "Masalan: 1200 ning 1% i = 12, demak 20% = 12 x 20 = 240." },
    ex_hard: { ru: 'Способ 2 (через дробь): 20% от 1200 = 20/100 × 1200 = 240.', uz: "2-usul (kasr orqali): 1200 ning 20% i = 20/100 x 1200 = 240." },
    note: {
      ru: 'Оба способа дают одно и то же. Выбирай тот, что удобнее.',
      uz: "Ikkala usul bir xil natija beradi. Qaysi qulay bo'lsa, o'shani tanlang."
    },
    audio: {
      ru: 'Запомни два способа. Первый: найди один процент, разделив число на сто, а потом умножь на число процентов. Один процент от тысячи двухсот это двенадцать, а двадцать процентов это двенадцать умножить на двадцать, то есть двести сорок. Второй способ через дробь: двадцать сотых умножить на тысячу двести тоже даёт двести сорок. Оба способа дают один ответ.',
      uz: "Ikki usulni eslab qoling. Birinchisi: sonni yuzga bo'lib bir foizni toping, keyin foizlar soniga ko'paytiring. Ming ikki yuzning bir foizi o'n ikkiga teng, yigirma foizi esa o'n ikkini yigirmaga ko'paytirgan, ya'ni ikki yuz qirq. Ikkinchi usul kasr orqali: yuzdan yigirmani ming ikki yuzga ko'paytirsak, yana ikki yuz qirq. Ikkala usul bitta javob beradi."
    }
  },

  // ---- s5 RULE 2 — M1 ogohlantirish: javob ASOS songa bog'liq ----
  s5: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    lead: {
      ru: 'Но будь внимателен: «20%» само по себе — это ещё не ответ.',
      uz: "Lekin ehtiyot bo'ling: «20%» o'zi hali javob emas."
    },
    point1: {
      ru: 'Сколько это — 20% — зависит от того, от какого числа мы их берём.',
      uz: "20% qancha ekani — uni qaysi sondan olishimizga bog'liq."
    },
    point2: {
      ru: '20% от 50 — это 10. А 20% от 200 — это уже 40. Процент один, а суммы разные.',
      uz: "50 ning 20% i — bu 10. 200 ning 20% i esa — 40. Foiz bir xil, summalar har xil."
    },
    point3: {
      ru: 'Поэтому всегда смотри: процент от КАКОГО числа нужно найти. Сначала число, потом действие.',
      uz: "Shuning uchun doim qarang: QAYSI sondan foiz topish kerak. Avval son, keyin amal."
    },
    audio: {
      ru: 'Запомни главное предостережение. Двадцать процентов само по себе ещё не ответ, потому что сумма зависит от числа. Двадцать процентов от пятидесяти это десять, а двадцать процентов от двухсот это сорок. Процент одинаковый, а значения разные. Поэтому всегда смотри, от какого числа нужно взять процент.',
      uz: "Asosiy ogohlantirishni eslab qoling. Yigirma foiz o'zi hali javob emas, chunki summa songa bog'liq. Ellikning yigirma foizi o'nga teng, ikki yuzning yigirma foizi esa qirqqa teng. Foiz bir xil, qiymatlar har xil. Shuning uchun doim qaysi sondan foiz olish kerakligiga qarang."
    }
  },

  // ---- s6 TEST MC — 80 ning 25% i? -> 20. practice + FAKT Rim. correct A ----
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    lead: {
      ru: 'Теперь сам. Чехол стоит 80 долларов, скидка 25%. Сколько это в долларах?',
      uz: "Endi o'zingiz. G'ilof narxi 80 dollar, chegirma 25%. Bu necha dollar?"
    },
    opt0: { ru: '20', uz: '20' },
    opt1: { ru: '25', uz: '25' },
    opt2: { ru: '32', uz: '32' },
    opt3: { ru: '8', uz: '8' },
    correct_text: {
      ru: 'Верно. 1% от 80 = 0,8, значит 25% = 0,8 × 25 = 20. Или: 80/4 = 20.',
      uz: "To'g'ri. 80 ning 1% i = 0,8, demak 25% = 0,8 x 25 = 20. Yoki: 80/4 = 20."
    },
    wrong_0: {
      ru: 'Это само число процентов, а не ответ. Найди 25% именно от 80: 1% = 0,8, умножь на 25, получится 20.',
      uz: "Bu foiz raqamining o'zi, javob emas. 25% ni aynan 80 dan toping: 1% = 0,8, 25 ga ko'paytiring, 20 chiqadi."
    },
    wrong_1: {
      ru: 'Похоже, ты сложил 25 и часть числа. Нужно умножать: 1% это 0,8, а 25% это 0,8 × 25 = 20.',
      uz: "Chamasi, 25 va sonning bir qismini qo'shdingiz. Ko'paytirish kerak: 1% bu 0,8, 25% esa 0,8 x 25 = 20."
    },
    wrong_2: {
      ru: 'Это меньше нужного — похоже на 10%. А 25% это четверть: 80 разделить на 4 будет 20.',
      uz: "Bu keragidan kam — 10% ga o'xshaydi. 25% esa chorak: 80 ni 4 ga bo'lsak, 20 bo'ladi."
    },
    fact: {
      ru: 'В Древнем Риме с продажи на рынке брали налог в 1% — его называли «центезима». Значит, находить процент от числа люди умели уже две тысячи лет назад.',
      uz: "Qadimgi Rimda bozordagi savdodan 1% soliq olingan — uni «centesima» deb atashgan. Demak, sonning foizini topishni odamlar ikki ming yil oldin ham bilgan."
    },
    audio: {
      intro: {
        ru: 'Чехол стоит восемьдесят долларов, скидка двадцать пять процентов. Сколько это? Сначала найди один процент, потом умножь. Выбери ответ.',
        uz: "G'ilof narxi sakson dollar, chegirma yigirma besh foiz. Bu qancha? Avval bir foizni toping, keyin ko'paytiring. Javobni tanlang."
      },
      on_correct: {
        ru: 'Верно, двадцать долларов. Кстати, в Древнем Риме с продажи на рынке брали налог в один процент, его называли центезима. Значит, находить процент от числа люди умели уже две тысячи лет назад.',
        uz: "To'g'ri, yigirma dollar. Aytgancha, qadimgi Rimda bozordagi savdodan bir foiz soliq olingan, uni centesima deb atashgan. Demak, sonning foizini topishni odamlar ikki ming yil oldin ham bilgan."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s7 TEST NumInput — 350 ning 40% i? -> 140. practice ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    question: {
      ru: 'Часы стоят 350 долларов, скидка 40%. Сколько это в долларах?',
      uz: "Soat narxi 350 dollar, chegirma 40%. Bu necha dollar?"
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Найди 1% от 350: это 3,5. Теперь умножь на 40: 3,5 × 40 = 140.',
      uz: "350 ning 1% ini toping: bu 3,5. Endi 40 ga ko'paytiring: 3,5 x 40 = 140."
    },
    fb_correct: { ru: 'Верно. 1% от 350 = 3,5, а 40% = 3,5 × 40 = 140.', uz: "To'g'ri. 350 ning 1% i = 3,5, 40% esa = 3,5 x 40 = 140." },
    audio: {
      intro: {
        ru: 'Часы стоят триста пятьдесят долларов, скидка сорок процентов. Сколько это? Найди один процент и умножь на сорок. Введи число.',
        uz: "Soat narxi uch yuz ellik dollar, chegirma qirq foiz. Bu qancha? Bir foizni toping va qirqga ko'paytiring. Sonni kiriting."
      },
      on_correct: { ru: 'Верно. Сто сорок.', uz: "To'g'ri. Bir yuz qirq." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s8 TEST fill-blank — 150 ning 12% i = box -> 18. practice ----
  s8: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    lead: {
      ru: 'Зарядка стоит 150 долларов, скидка 12%. Процент «неудобный» — считай через 1%. Заполни пропуск.',
      uz: "Quvvatlagich narxi 150 dollar, chegirma 12%. Foiz «noqulay» — 1% orqali hisoblang. Bo'sh joyni to'ldiring."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: '1% от 150 это 1,5. Теперь 12% это 1,5 × 12 = 18.',
      uz: "150 ning 1% i — 1,5. Endi 12% bu 1,5 x 12 = 18."
    },
    fb_correct: { ru: 'Верно. 1% от 150 = 1,5, а 12% = 1,5 × 12 = 18.', uz: "To'g'ri. 150 ning 1% i = 1,5, 12% esa = 1,5 x 12 = 18." },
    audio: {
      intro: {
        ru: 'Зарядка стоит сто пятьдесят долларов, скидка двенадцать процентов. Сколько это? Найди один процент, это полтора, и умножь на двенадцать. Введи число.',
        uz: "Quvvatlagich narxi bir yuz ellik dollar, chegirma o'n ikki foiz. Bu qancha? Bir foizni toping, bu bir butun beshdan bir, va o'n ikkiga ko'paytiring. Sonni kiriting."
      },
      on_correct: { ru: 'Верно. Восемнадцать.', uz: "To'g'ri. O'n sakkiz." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s9 TEST multi-select — qaysi hisoblar TO'G'RI? practice (M1/M2 tuzoqlari) ----
  s9: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    lead: {
      ru: 'Магазин обещает скидки. Здесь верных ответов несколько. Отметь ВСЕ верные равенства.',
      uz: "Do'kon chegirmalar va'da qilmoqda. Bu yerda to'g'ri javob bir nechta. BARCHA to'g'ri tengliklarni belgilang."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    items: [
      { id: 'm1', label: { ru: '50% от 60 = 30', uz: "60 ning 50% i = 30" }, correct: true,
        hint: { ru: 'Это верно: половина от 60 это 30.', uz: "Bu to'g'ri: 60 ning yarmi — 30." } },
      { id: 'm2', label: { ru: '10% от 200 = 20', uz: "200 ning 10% i = 20" }, correct: true,
        hint: { ru: 'Это верно: 1% от 200 это 2, значит 10% это 20.', uz: "Bu to'g'ri: 200 ning 1% i — 2, demak 10% — 20." } },
      { id: 'm3', label: { ru: '25% от 40 = 100', uz: "40 ning 25% i = 100" }, correct: false,
        hint: { ru: 'Ошибка: 25% это четверть, 40 разделить на 4 будет 10, а не 100.', uz: "Xato: 25% — chorak, 40 ni 4 ga bo'lsak 10 bo'ladi, 100 emas." } },
      { id: 'm4', label: { ru: '20% от 90 = 20', uz: "90 ning 20% i = 20" }, correct: false,
        hint: { ru: 'Ошибка: 20 это само число процентов. 1% от 90 это 0,9, а 20% это 18.', uz: "Xato: 20 — foiz raqamining o'zi. 90 ning 1% i — 0,9, 20% esa — 18." } }
    ],
    fb_correct: {
      ru: 'Верно. Правы первые два: 50% от 60 = 30 и 10% от 200 = 20. Остальные — ловушки.',
      uz: "To'g'ri. Birinchi ikkitasi to'g'ri: 60 ning 50% i = 30 va 200 ning 10% i = 20. Qolganlari — tuzoq."
    },
    audio: {
      intro: {
        ru: 'Здесь несколько равенств. Отметь все верные, а ловушки оставь. Потом нажми проверить.',
        uz: "Bu yerda bir nechta tenglik bor. Barcha to'g'rilarini belgilang, tuzoqlarini qoldiring. Keyin tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. Ты отделил настоящие равенства от ловушек.',
        uz: "To'g'ri. Haqiqiy tengliklarni tuzoqlardan ajratdingiz."
      },
      on_wrong: { ru: 'Пока не всё верно. Посмотри подсказки.', uz: "Hozircha hammasi to'g'ri emas. Maslahatlarga qarang." }
    }
  },

  // ---- s10 TEST find-the-wrong — XATO hisobni top. practice + FAKT IT. correct B ----
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q_pre: { ru: 'Один из расчётов ', uz: 'Hisoblardan biri ' },
    q_em:  { ru: 'ОШИБОЧЕН', uz: 'XATO' },
    q_post: { ru: '. Найди именно его.', uz: '. Aynan o\'shani toping.' },
    opt0: { ru: '50% от 200 = 100', uz: "200 ning 50% i = 100" },
    opt1: { ru: '10% от 60 = 6', uz: "60 ning 10% i = 6" },
    opt2: { ru: '20% от 50 = 20', uz: "50 ning 20% i = 20" },
    opt3: { ru: '25% от 40 = 10', uz: "40 ning 25% i = 10" },
    correct_text: {
      ru: 'Верно, ошибка здесь. 20% от 50 = 10, а не 20. Здесь спутали процент с ответом.',
      uz: "To'g'ri, xato shu. 50 ning 20% i = 10, 20 emas. Bu yerda foizni javob bilan chalkashtirgan."
    },
    wrong_0: {
      ru: 'Это верно: 50% это половина, половина от 200 это 100. Ошибка в другом.',
      uz: "Bu to'g'ri: 50% — yarmi, 200 ning yarmi — 100. Xato boshqasida."
    },
    wrong_1: {
      ru: 'Это верно: 1% от 60 это 0,6, значит 10% это 6. Ищи ошибку дальше.',
      uz: "Bu to'g'ri: 60 ning 1% i — 0,6, demak 10% — 6. Xatoni boshqa joydan qidiring."
    },
    wrong_2: {
      ru: 'Это верно: 25% это четверть, 40 разделить на 4 это 10. Ошибка не здесь.',
      uz: "Bu to'g'ri: 25% — chorak, 40 ni 4 ga bo'lsak — 10. Xato bu yerda emas."
    },
    fact: {
      ru: 'Когда файл загружается, процент показывает долю от всего размера: 40% от файла в 500 мегабайт — это 200 мегабайт. Поэтому полоса загрузки тоже находит процент от числа.',
      uz: "Fayl yuklanganda foiz to'liq hajmning ulushini ko'rsatadi: 500 megabaytli faylning 40% i — bu 200 megabayt. Shuning uchun yuklash chizig'i ham sonning foizini topadi."
    },
    audio: {
      intro: {
        ru: 'Здесь вопрос наоборот. Один расчёт ошибочен. Найди именно ошибочный и выбери его.',
        uz: "Bu yerda savol teskari. Bitta hisob xato. Aynan xato bo'lganini toping va tanlang."
      },
      on_correct: {
        ru: 'Верно. Двадцать процентов от пятидесяти это десять, а не двадцать. Кстати, когда файл загружается, процент показывает долю от всего размера: сорок процентов от пятисот мегабайт это двести мегабайт.',
        uz: "To'g'ri. Ellikning yigirma foizi o'nga teng, yigirma emas. Aytgancha, fayl yuklanganda foiz to'liq hajmning ulushini ko'rsatadi: besh yuz megabaytning qirq foizi ikki yuz megabaytga teng."
      },
      on_wrong: { ru: 'Этот расчёт верный. Ошибка в другом.', uz: "Bu hisob to'g'ri. Xato boshqasida." }
    }
  },

  // ---- s11 TEST slider-placement — 200 ning 30% i turgan joyni belgila -> 60. practice ----
  s11: {
    eyebrow: { ru: 'Отметь на шкале', uz: 'Shkalada belgilang' },
    lead: {
      ru: 'Колонка стоит 200 долларов. Передвинь маркер туда, где находятся 30% от 200.',
      uz: "Kolonka narxi 200 dollar. Markerni 200 ning 30% i turgan joyga suring."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    val_label: { ru: 'Сейчас выбрано', uz: 'Hozir tanlangan' },
    hint: {
      ru: '1% от 200 это 2. Значит 30% это 2 × 30 = 60. Поставь маркер на 60.',
      uz: "200 ning 1% i — 2. Demak 30% bu 2 x 30 = 60. Markerni 60 ga qo'ying."
    },
    fb_correct: { ru: 'Верно. 30% от 200 — это 60.', uz: "To'g'ri. 200 ning 30% i — bu 60." },
    audio: {
      intro: {
        ru: 'Колонка стоит двести долларов. Передвинь маркер туда, где находятся тридцать процентов от двухсот. Сначала посчитай в уме, потом поставь маркер и нажми проверить.',
        uz: "Kolonka narxi ikki yuz dollar. Markerni ikki yuzning o'ttiz foizi turgan joyga suring. Avval xayolan hisoblang, keyin markerni qo'ying va tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Шестьдесят.', uz: "To'g'ri. Oltmish." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s12 CASE setup — Feruza ikki do'kon iPhone bitimi (A: 800$ 25%; B: 600$ 40%) ----
  s12: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    lead: {
      ru: 'Феруза ищет, где iPhone выгоднее. Магазин А: 800 долларов, скидка 25%. Магазин Б: 600 долларов, скидка 40%. Где скидка БОЛЬШЕ в долларах?',
      uz: "Feruza iPhone qayerda foydaliroq ekanini qidirmoqda. A do'kon: 800 dollar, chegirma 25%. B do'kon: 600 dollar, chegirma 40%. Qayerda chegirma KO'PROQ dollar?"
    },
    labelA: { ru: 'Магазин А: 25% от 800', uz: "A do'kon: 800 ning 25% i" },
    labelB: { ru: 'Магазин Б: 40% от 600', uz: "B do'kon: 600 ning 40% i" },
    note: {
      ru: 'Не спеши: больший процент не всегда даёт больше денег, но и большая цена тоже. Посчитай каждую скидку.',
      uz: "Shoshilmang: kattaroq foiz ham, kattaroq narx ham har doim ko'proq pul bermaydi. Har chegirmani hisoblang."
    },
    hint_calc: {
      ru: 'Магазин А: 1% от 800 = 8, значит 25% = 200. Магазин Б: 1% от 600 = 6, значит 40% = 240.',
      uz: "A do'kon: 800 ning 1% i = 8, demak 25% = 200. B do'kon: 600 ning 1% i = 6, demak 40% = 240."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: 'Феруза ищет, где айфон выгоднее. В магазине А цена восемьсот долларов и скидка двадцать пять процентов. В магазине Б цена шестьсот долларов и скидка сорок процентов. Где скидка больше в долларах? Не спеши: большая цена не значит большая скидка. Посчитай каждую скидку через один процент.',
      uz: "Feruza ayfon qayerda foydaliroq ekanini qidirmoqda. A do'konda narx sakkiz yuz dollar va chegirma yigirma besh foiz. B do'konda narx olti yuz dollar va chegirma qirq foiz. Qayerda chegirma ko'proq dollar? Shoshilmang: katta narx katta chegirma degani emas. Har chegirmani bir foiz orqali hisoblang."
    }
  },

  // ---- s13 CASE/FINAL MC — qayerda chegirma ko'proq? -> B (240). final + FAKT sport. correct D ----
  s13: {
    eyebrow: { ru: 'Итог задачи', uz: 'Masala yakuni' },
    lead: {
      ru: 'Где скидка больше в долларах? А: 25% от 800. Б: 40% от 600.',
      uz: "Qayerda chegirma ko'proq dollar? A: 800 ning 25% i. B: 600 ning 40% i."
    },
    opt0: { ru: 'Магазин Б — это 240 долларов', uz: "B do'kon — bu 240 dollar" },
    opt1: { ru: 'Магазин А — это 200 долларов', uz: "A do'kon — bu 200 dollar" },
    opt2: { ru: 'Скидки равны', uz: "Chegirmalar teng" },
    opt3: { ru: 'В А цена больше, значит А', uz: "A da narx katta, demak A" },
    correct_text: {
      ru: 'Верно. В А скидка 200, в Б — 240. Больший процент от меньшей цены дал больше денег.',
      uz: "To'g'ri. A da chegirma 200, B da — 240. Kichik narxdan olingan kattaroq foiz ko'proq pul berdi."
    },
    wrong_0: {
      ru: 'В А это 25% от 800 = 200, а в Б 40% от 600 = 240. Больше в магазине Б.',
      uz: "A da bu 800 ning 25% i = 200, B da esa 600 ning 40% i = 240. B do'konda ko'proq."
    },
    wrong_1: {
      ru: 'Посчитай обе скидки: 200 и 240. Они разные, значит не равны.',
      uz: "Ikkala chegirmani hisoblang: 200 va 240. Ular har xil, demak teng emas."
    },
    wrong_2: {
      ru: 'Большая цена не значит большая скидка. 25% от 800 это 200, а 40% от 600 это 240.',
      uz: "Katta narx katta chegirma degani emas. 800 ning 25% i — 200, 600 ning 40% i esa — 240."
    },
    fact: {
      ru: 'В баскетболе точность штрафных бросков считают в процентах: 80% при 25 бросках это 20 попаданий. Вот почему в спорте проценты так важны.',
      uz: "Basketbolda erkin tashlash aniqligini foizda hisoblashadi: 25 ta tashlashda 80% — bu 20 ta to'g'ri tashlash. Mana shu sababli sportda foiz juda muhim."
    },
    audio: {
      intro: {
        ru: 'Где скидка больше в долларах? Посчитай каждую скидку и выбери ответ.',
        uz: "Qayerda chegirma ko'proq dollar? Har chegirmani hisoblang va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Двести сорок больше двухсот. Кстати, в баскетболе точность штрафных бросков считают в процентах: восемьдесят процентов при двадцати пяти бросках это двадцать попаданий.',
        uz: "To'g'ri. Ikki yuz qirq ikki yuzdan ko'p. Aytgancha, basketbolda erkin tashlash aniqligini foizda hisoblashadi: yigirma besh ta tashlashda sakson foiz, bu yigirma ta to'g'ri tashlash."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s14 SUMMARY — Kamol hookini yopadi + ConnectionsBlock ----
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    title: {
      ru: 'Вернёмся к покупке Камола.',
      uz: "Kamolning xaridiga qaytamiz."
    },
    main_label: { ru: 'Главное', uz: 'Asosiy' },
    main_1: { ru: 'Чтобы найти процент от числа, найди 1% (раздели на 100), потом умножь на число процентов.', uz: "Sonning foizini topish uchun 1% ni toping (100 ga bo'ling), keyin foizlar soniga ko'paytiring." },
    main_2: {
      ru: 'Другой способ — через дробь: N% от числа = N/100 × число.',
      uz: "Boshqa usul — kasr orqali: sonning N% i = N/100 x son."
    },
    main_3: {
      ru: 'Сам процент — ещё не ответ: сумма зависит от того, от какого числа его берут.',
      uz: "Foizning o'zi hali javob emas: summa uni qaysi sondan olishga bog'liq."
    },
    hook_close: {
      ru: 'Скидка 20% на iPhone за 1200 долларов — это 240 долларов, а не 20. Камол ошибся: он принял число процентов за саму скидку.',
      uz: "1200 dollarlik iPhone ga 20% chegirma — bu 240 dollar, 20 emas. Kamol adashdi: u foiz raqamini chegirmaning o'zi deb oldi."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: '«Процент как сотая доля», «Сокращение дробей», «Десятичная дробь — концепт».',
      uz: "«Foiz — yuzdan bir ulush», «Kasrlarni qisqartirish», «O'nli kasr — tushuncha»."
    },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'нахождение числа по его проценту: 20% числа равны 10 — найди число.',
      uz: "son bo'yicha topish: sonning 20% i 10 ga teng — sonni toping."
    },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: {
      ru: 'Подведём итог. Чтобы найти процент от числа, найди один процент, разделив число на сто, а потом умножь на число процентов. Другой способ через дробь. И помни: сам процент ещё не ответ, сумма зависит от числа. Поэтому скидка двадцать процентов на айфон за тысячу двести долларов это двести сорок долларов, а не двадцать. Камол принял число процентов за саму скидку и ошибся.',
      uz: "Xulosa qilamiz. Sonning foizini topish uchun sonni yuzga bo'lib bir foizni toping, keyin foizlar soniga ko'paytiring. Boshqa usul kasr orqali. Va esda tuting: foizning o'zi hali javob emas, summa songa bog'liq. Shuning uchun ming ikki yuz dollarlik ayfonga yigirma foiz chegirma ikki yuz qirq dollar, yigirma emas. Kamol foiz raqamini chegirmaning o'zi deb oldi va adashdi."
    }
  }

};

// ============================================================
// MAJBURIY YORDAMCHILAR (infrastructure_v1 / Dars25 bilan baytma-bayt)
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

// Ustuvor javob tekshiruvi QIYMAT bo'yicha: butun/o'nli (0,5=0.5) va kasr (4/6=2/3).
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

// Ikonkalar ✓/✗ — feedback faqat rang bilan emas (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-harakat siyrak ekranlar uchun (qoida, summary): yumshoq suzuvchi doiralar.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// FAKT-BLOK — ko'k karta, KATTA animatsiya + kam matn (to'g'ridan keyin).
// ============================================================
const FB_HIST  = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_IT    = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_SPORT = { ru: 'Знаешь ли ты? · Спорт',    uz: "Bilasizmi? · Sport" };

// Rim 1% solig'i — tanga + "1%" muhri (CSS loop).
const AnimRome = () => (<div className="fa-rm"><span className="fa-rm-coin">₵</span><span className="fa-rm-pct">1%</span></div>);
// Fayl yuklash — progress chizig'i to'ladi, "200 MB" chiqadi (CSS loop).
const AnimDownload = () => (<div className="fa-dl"><div className="fa-dl-bar"><div className="fa-dl-fill"/></div><span className="fa-dl-mark">200<br/>MB</span></div>);
// Sport — to'p halqaga, "80%" (CSS loop).
const AnimHoop = () => (<div className="fa-hp"><span className="fa-hp-rim"/><span className="fa-hp-ball"/><span className="fa-hp-pct">80%</span></div>);

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
// VIZUALIZATORLAR — perc_5_02 (PercentBar dual-axis, PercentHook loop)
// ============================================================
const fmtNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const pctValue = (total, pct) => Math.round(total * pct / 100);

// Ikki o'qli bar: tepada foiz (0..100), pastda qiymat (0..total), marker ikkalasini bog'laydi.
const PercentBar = ({ pct = 0, total = 100, live = false, alive = false, glow = false, hidePct = false, hideVal = false }) => {
  const val = pctValue(total, pct);
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div className={`pb-wrap${glow ? ' pb-glow' : ''}`} aria-hidden="true">
      <div className="pb-axis">
        <span>{hidePct ? '' : '0%'}</span><span>{hidePct ? '·' : '25%'}</span><span>{hidePct ? '·' : '50%'}</span><span>{hidePct ? '·' : '75%'}</span><span>{hidePct ? '' : '100%'}</span>
      </div>
      <div className="pb-track">
        <div className={`pb-fill${live ? ' pb-live' : ''}${alive ? ' pb-alive' : ''}`} style={{ width: `${w}%` }}/>
        <div className="pb-marker" style={{ left: `${w}%` }}/>
      </div>
      <div className="pb-axis pb-axis-bot">
        <span>0</span><span>{fmtNum(total / 4)}</span><span>{fmtNum(total / 2)}</span><span>{fmtNum(total * 3 / 4)}</span><span>{fmtNum(total)}</span>
      </div>
      <div className="pb-readout">
        <b>{hidePct ? '?' : `${pct}%`}</b>
        <span className="pb-arrow" aria-hidden="true">→</span>
        <b className="pb-val">{hideVal ? '?' : fmtNum(val)}</b>
      </div>
    </div>
  );
};

// Hook: iPhone narx yorlig'i + chegirma rozetkasi + bar 0->20% suzadi (CSS-only loop).
const PercentHook = () => (
  <div className="ph-wrap" aria-hidden="true">
    <div className="ph-tag">
      <span className="ph-name">iPhone</span>
      <span className="ph-price">$1200</span>
      <span className="ph-badge">−20%</span>
    </div>
    <div className="ph-bar"><div className="ph-fill"/></div>
    <span className="ph-q">= ?</span>
  </div>
);

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (chegirma). Qaytish: picked TO'LIQ sbros.
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(14px, 2.6vw, 20px) clamp(10px, 2vw, 16px)', display: 'flex', justifyContent: 'center' }}>
          <PercentHook/>
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

// s1 — WARM-UP (spaced retrieval, scored emas) QuestionScreen orqali (correct C)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (1% usuli, tap-paced: count 0..20)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const MAX = 20;
  const [count, setCount] = useState(0);
  const doneAnnouncedRef = useRef(false);
  const caps = c.cells[lang] || c.cells.ru;
  const done = count >= MAX;
  const add = () => {
    if (done) return;
    const nv = count + 1;
    setCount(nv);
    if (nv >= MAX && !doneAnnouncedRef.current) {
      doneAnnouncedRef.current = true;
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.done[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up pb-pulse' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <PercentBar pct={count} total={1200} alive={true} glow={done}/>
          <div className="pb-calc">
            <span className="pb-calc-unit">1% = 12</span>
            <span className="pb-calc-op">×</span>
            <span className="pb-calc-n">{count}</span>
            <span className="pb-calc-op">=</span>
            <span className="pb-calc-res">{fmtNum(count * 12)}</span>
          </div>
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={add} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[Math.max(0, count - 1)])}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (jonli slayder, foiz<->qiymat, total=200)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [n, setN] = useState(30);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <PercentBar pct={n} total={200} live={true} glow={n === 100}/>
        </div>
        <div className="fade-up delay-2"><Slider value={n} min={0} max={100} step={5} onChange={setN}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: (n === 100 || n === 0) ? T.success : T.ink2, fontWeight: (n === 100 || n === 0) ? 600 : 400 }}>{mt(t((n === 100 || n === 0) ? c.note_full : c.hint_move))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE 1 (ikki usul) + ambient
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <PercentBar pct={20} total={1200} glow={true}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_hard))}</p>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (M1: javob asos songa bog'liq) + ambient + ikki bar
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point1))}</p>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', gap: 'clamp(12px, 3vw, 26px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <PercentBar pct={20} total={50}/>
          <PercentBar pct={20} total={200}/>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point2))}</p>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.point3))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST MC: 80 ning 25% i -> 20 (correct A) + Fakt Rim
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 2, 1, 3]);
  const question = (<><h2 className="title h-sub">{mt(t(c.lead))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><PercentBar pct={25} total={80} hideVal={true}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimRome/>}/>}/>;
};

// s7 — TEST NumInput: 350 ning 40% i -> 140
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <NumInputScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={140} renderVisual={() => <PercentBar pct={40} total={350} hideVal={true}/>}/>;
};

// s8 — TEST fill-blank: 150 ning 12% i = box -> 18
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const TARGET = '18';
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
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.6vw, 12px)', flexWrap: 'wrap', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 'clamp(18px, 3.4vw, 26px)' }}>
          <span>150</span>
          <span className="mop" style={{ fontSize: 'clamp(16px, 2.6vw, 22px)' }}>×</span>
          <span>12%</span>
          <span className="mop" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>=</span>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(90px, 20vw, 120px)' }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.ink2 }}><IconNo/></span>
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

// s9 — TEST multi-select: qaysi hisoblar TO'G'RI (веди-до-верного, ✓/✗ per item)
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's9_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const correctIds = c.items.filter(it => it.correct).map(it => it.id);
  const [picked, setPicked] = useState(() => new Set(wasSolved ? correctIds : []));
  const [solved, setSolved] = useState(wasSolved);
  const [flash, setFlash] = useState(() => new Set());
  const [hintIds, setHintIds] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const toggle = (id) => { if (solved) return; setPicked(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); setHintIds(new Set()); };
  const check = () => {
    if (solved) return;
    const wrongPicked = c.items.filter(it => picked.has(it.id) && !it.correct);
    const missing = c.items.filter(it => !picked.has(it.id) && it.correct);
    const ok = wrongPicked.length === 0 && missing.length === 0;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[9].scope, screenIdx: 9, question: c.lead[lang], correctAnswer: correctIds.join(','), studentAnswer: Array.from(picked).join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setFlash(new Set(wrongPicked.map(it => it.id)));
      setHintIds(new Set(wrongPicked.map(it => it.id)));
      setTimeout(() => { setPicked(p => { const n = new Set(p); wrongPicked.forEach(it => n.delete(it.id)); return n; }); setFlash(new Set()); }, 700);
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const hintItems = c.items.filter(it => hintIds.has(it.id));
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="ms-list fade-up delay-1">
          {c.items.map(it => {
            const on = picked.has(it.id);
            const cls = `ms-item${on ? ' ms-on' : ''}${flash.has(it.id) ? ' ms-bad' : ''}${solved && it.correct ? ' ms-ok' : ''}`;
            return (
              <button key={it.id} className={cls} disabled={solved} onClick={() => toggle(it.id)}>
                <span className="ms-box" aria-hidden="true">{solved && it.correct ? <IconOk/> : (flash.has(it.id) ? <IconNo/> : (on ? <IconOk/> : null))}</span>
                <span className="ms-label">{mt(t(it.label))}</span>
              </button>
            );
          })}
        </div>
        {hintItems.length > 0 && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {hintItems.map(it => (<p key={it.id} className="small" style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}><span style={{ color: T.accent, marginTop: 1 }}><IconNo/></span><span>{mt(t(it.hint))}</span></p>))}
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
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s10 — TEST find-the-wrong (correct B) + Fakt IT
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 2, 1, 3]);
  const question = (<h2 className="title h-sub">{t(c.q_pre)}<span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimDownload/>}/>}/>;
};

// s11 — TEST slider-placement: 200 ning 30% i = 60
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's11_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const TOTAL = 200; const TARGET = 60;
  const wasSolved = storedAnswer?.solved === true;
  const [val, setVal] = useState(wasSolved ? TARGET : (typeof storedAnswer?.studentValue === 'number' ? storedAnswer.studentValue : 0));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const firstValRef = useRef(typeof storedAnswer?.studentValue === 'number' ? storedAnswer.studentValue : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const pct = Math.round(val / TOTAL * 100);
  const submit = () => {
    if (solved) return;
    const isCorrect = val === TARGET;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstValRef.current = val; }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[11].scope, screenIdx: 11, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: String(firstValRef.current), studentValue: firstValRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={solved ? 'frame fade-up delay-1 pb-pulse' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <PercentBar pct={pct} total={TOTAL} live={true} hidePct={true}/>
          <p className="small mono" style={{ margin: 0, color: solved ? T.success : T.ink2 }}>{t(c.val_label)}: <b style={{ fontSize: 'clamp(15px, 2.4vw, 18px)' }}>{fmtNum(val)}</b></p>
        </div>
        <div className="fade-up delay-2"><Slider value={val} min={0} max={TOTAL} step={10} onChange={(v) => { if (!solved) { setVal(v); setHintShown(false); } }}/></div>
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.ink2 }}><IconNo/></span>
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

// s12 — CASE setup (Feruza ikki do'kon iPhone bitimi)
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
          <div className="frame" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="small mono" style={{ margin: 0, color: T.ink2 }}>{t(c.labelA)}</p>
            <PercentBar pct={25} total={800} hideVal={true}/>
          </div>
          <div className="frame" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="small mono" style={{ margin: 0, color: T.ink2 }}>{t(c.labelB)}</p>
            <PercentBar pct={40} total={600} hideVal={true}/>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s13 — CASE solve / FINAL (correct D) + Fakt sport
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.lead))}</h2>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SPORT} anim={<AnimHoop/>}/>}/>;
};

// s14 — SUMMARY + hook yopilishi + bog'lanishlar + ambient
const Screen14 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <Floaters/>
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

// ============================================================
// KORNEVOY KOMPONENT
// ============================================================
export default function PercentOfNumberLesson({
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

/* MATH perc_5_02: PercentBar — dual-axis bar (tepada foiz, pastda qiymat). */
.pb-wrap { width: clamp(220px, 60vw, 420px); display: flex; flex-direction: column; gap: 4px; }
.pb-axis { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: clamp(9px, 1.3vw, 11px); color: #5A5A60; }
.pb-axis-bot { color: #019ACB; font-weight: 600; }
.pb-track { position: relative; height: clamp(22px, 4.5vw, 30px); background: rgba(255, 79, 40, 0.10); border-radius: 8px; overflow: visible; }
.pb-fill { height: 100%; background: linear-gradient(90deg, #FF8A66, #FF4F28); border-radius: 8px; width: 0; }
.pb-fill.pb-live { transition: width 0.12s ease-out; }
.pb-fill.pb-alive { animation: pbShine 2.6s ease-in-out infinite; }
@keyframes pbShine { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.12); } }
.pb-marker { position: absolute; top: -4px; bottom: -4px; width: 3px; background: #0E0E10; border-radius: 2px; transform: translateX(-50%); transition: left 0.12s ease-out; box-shadow: 0 0 6px rgba(14, 14, 16, 0.35); }
.pb-readout { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 1.8vw, 14px); margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.6vw, 20px); }
.pb-readout b { color: #FF4F28; }
.pb-readout .pb-val { color: #019ACB; }
.pb-arrow { color: #A7A6A2; font-size: clamp(14px, 2.2vw, 18px); }
.pb-glow { animation: pbGlow 0.7s ease; }
@keyframes pbGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(255, 79, 40, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }
.pb-pulse { animation: pbGlow 0.7s ease; }
.pb-calc { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.4vw, 18px); flex-wrap: wrap; justify-content: center; }
.pb-calc-unit { color: #FF4F28; }
.pb-calc-op { color: #A7A6A2; }
.pb-calc-n { color: #0E0E10; min-width: 1.4em; text-align: center; }
.pb-calc-res { color: #019ACB; }

/* MATH perc_5_02: PercentHook — iPhone narx yorlig'i + chegirma (CSS-only loop). */
.ph-wrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.ph-tag { position: relative; display: inline-flex; align-items: baseline; gap: 8px; background: #FFFFFF; border-radius: 12px; padding: clamp(8px, 1.8vw, 12px) clamp(16px, 3vw, 24px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.18); }
.ph-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px, 2vw, 16px); color: #5A5A60; }
.ph-price { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(20px, 4vw, 30px); color: #0E0E10; }
.ph-badge { position: absolute; top: -12px; right: -12px; background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 1.8vw, 14px); border-radius: 99px; padding: 4px 10px; box-shadow: 0 4px 12px -2px rgba(255, 79, 40, 0.5); animation: phBadge 2.6s ease-in-out infinite; }
@keyframes phBadge { 0%, 100% { transform: scale(1) rotate(-6deg); } 50% { transform: scale(1.12) rotate(-6deg); } }
.ph-bar { width: clamp(180px, 50vw, 300px); height: clamp(14px, 3vw, 20px); background: rgba(255, 79, 40, 0.12); border-radius: 8px; overflow: hidden; }
.ph-fill { height: 100%; background: linear-gradient(90deg, #FF8A66, #FF4F28); border-radius: 8px; width: 0; animation: phFill 3.4s ease-in-out infinite; }
@keyframes phFill { 0% { width: 0; } 35% { width: 20%; } 80% { width: 20%; } 100% { width: 0; } }
.ph-q { font-family: 'Fraunces', serif; font-size: clamp(20px, 4vw, 30px); color: #019ACB; animation: phQ 2.6s ease-in-out infinite; }
@keyframes phQ { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

/* MATH perc_5_02: multi-select — bir nechta to'g'ri (✓/✗ per item, веди-до-верного). */
.ms-list { display: flex; flex-direction: column; gap: clamp(7px, 1.4vw, 10px); }
.ms-item { display: flex; align-items: center; gap: 12px; background: #FFFFFF; border: none; border-radius: 12px; padding: clamp(10px, 1.8vw, 13px) clamp(13px, 2.1vw, 17px); cursor: pointer; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.15s; text-align: left; }
.ms-item:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.ms-item:disabled { cursor: default; }
.ms-box { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; border: 2px solid #A7A6A2; display: flex; align-items: center; justify-content: center; color: #FF4F28; }
.ms-on { box-shadow: 0 0 0 2px #FF4F28, 0 8px 20px -6px rgba(255, 79, 40, 0.32); }
.ms-on .ms-box { border-color: #FF4F28; }
.ms-bad { background: #FFE8E1 !important; animation: msShake 0.4s; }
.ms-bad .ms-box { border-color: #FF4F28; color: #FF4F28; }
@keyframes msShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
.ms-ok { background: #E3F0E8 !important; }
.ms-ok .ms-box { border-color: #1F7A4D; color: #1F7A4D; }
.ms-label { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.3vw, 17px); color: #0E0E10; }

/* MATH perc_5_02: факт-анимации (CSS-only loop, КРУПНЫЕ). */
.fa-rm { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.fa-rm-coin { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(46px, 10vw, 70px); color: #019ACB; animation: faRmSpin 3.2s ease-in-out infinite; }
.fa-rm-pct { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 3vw, 22px); color: #FF4F28; animation: faRmPct 3.2s ease-in-out infinite; }
@keyframes faRmSpin { 0%, 100% { transform: scale(1) rotateY(0deg); } 50% { transform: scale(1.06) rotateY(180deg); } }
@keyframes faRmPct { 0%, 40% { opacity: 0; transform: scale(0.6); } 60%, 100% { opacity: 1; transform: scale(1); } }
.fa-dl { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
.fa-dl-bar { width: clamp(58px, 12vw, 84px); height: clamp(12px, 2.6vw, 18px); background: rgba(1, 154, 203, 0.14); border-radius: 6px; overflow: hidden; }
.fa-dl-fill { height: 100%; background: #019ACB; border-radius: 6px; width: 0; animation: faDl 3s ease-in-out infinite; }
@keyframes faDl { 0% { width: 0; } 60% { width: 40%; } 85% { width: 40%; } 100% { width: 0; } }
.fa-dl-mark { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 1.8vw, 14px); color: #019ACB; text-align: center; line-height: 1.05; }
.fa-hp { position: relative; width: clamp(60px, 12vw, 86px); height: clamp(60px, 12vw, 86px); display: inline-flex; align-items: center; justify-content: center; }
.fa-hp-rim { position: absolute; bottom: 12%; width: clamp(30px, 6vw, 44px); height: clamp(10px, 2vw, 14px); border: 3px solid #FF4F28; border-radius: 50%; }
.fa-hp-ball { position: absolute; width: clamp(14px, 3vw, 20px); height: clamp(14px, 3vw, 20px); border-radius: 50%; background: #019ACB; animation: faHp 2.8s ease-in-out infinite; }
@keyframes faHp { 0% { transform: translateY(-150%); opacity: 0; } 30% { opacity: 1; } 70% { transform: translateY(60%); opacity: 1; } 100% { transform: translateY(60%); opacity: 0; } }
.fa-hp-pct { position: absolute; top: 4%; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.4vw, 18px); color: #FF4F28; }

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
