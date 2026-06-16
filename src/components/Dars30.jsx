import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Площадь треугольника — geom_5_03 (Dars30)
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
// --- POD UROK: geom_5_03 — Uchburchak yuzasi / Площадь треугольника (PROMPT 2026-06-15) ---
// Markaziy misconception M1: yuzani (asos x balandlik) deb hisoblab, IKKIGA BO'LISHNI unutish.
// M2: balandlik o'rniga QIYA tomonni olish (balandlik = perpendikulyar). Asosiy usul: uchburchak
// = to'rtburchakning YARMI (CPA: diagonal bo'yicha bo'lish -> 2 teng uchburchak -> S = (a x h) : 2,
// o'quvchi kashf etadi). Vizualizator HalfRect/TriViz (SVG): to'rtburchak diagonal bo'yicha 2 teng
// uchburchakka bo'linadi; jonli shine loop, balandlik perpendikulyari + to'g'ri burchak belgisi.
// Hook: Feruza uchburchak bayroqcha tikadi (to'rtburchak matoning yarmi). Case: Anvar bog'da
// uchburchak gulzor. Test turlari (1+2 aralashmasi): warm-up MC (to'rtburchak yuzasi retrieval) /
// multi-select / NumInput / fill-blank / find-the-wrong / balandlik-tap (interaktiv) / final MC.
// Faktlar (DRAFT, validatsiya kerak): ikkiga bo'lish = yarmi (Matematika) / Misr piramidalari
// uchburchak yuzlar (Tarix) / uchburchak eng mustahkam shakl, ferma (IT) / 3D grafika uchburchaklardan (IT).
// ============================================================

const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'geom-5-03-v1',
  lessonTitle: { ru: 'Площадь треугольника', uz: "Uchburchak yuzasi" }
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
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's13', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's14', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's15', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — Feruza uchburchak bayroqcha (matoning yarmi). Tuzoq M1: to'liq 24. ----
  s0: {
    eyebrow: { ru: 'Квест', uz: 'Kvest' },
    lead: {
      ru: 'Феруза шьёт треугольный флажок. Она берёт прямоугольный кусок ткани со сторонами 6 и 4 и разрезает его по диагонали — получается треугольник. В прямоугольник помещается 24 клетки. Сколько же занимает треугольник?',
      uz: "Feruza uchburchak bayroqcha tikmoqda. U tomonlari 6 va 4 bo'lgan to'rtburchak matoni olib, uni diagonal bo'yicha kesadi — uchburchak hosil bo'ladi. To'rtburchakka 24 ta katak sig'adi. Uchburchak qancha joy egallaydi?"
    },
    opt0: { ru: 'Столько же — 24', uz: "Xuddi shuncha — 24" },
    opt1: { ru: 'Половину — 12', uz: "Yarmini — 12" },
    opt2: { ru: 'Пока не знаю', uz: "Hozircha bilmayman" },
    reveal: {
      ru: 'Запомни свой ответ. К концу урока научимся быстро находить площадь любого треугольника.',
      uz: "Javobingizni eslab qoling. Dars oxirida har qanday uchburchak yuzasini tez topishni o'rganamiz."
    },
    audio: {
      ru: 'Феруза шьёт треугольный флажок. Она берёт прямоугольную ткань и разрезает её по диагонали. Получается треугольник. В прямоугольник помещается двадцать четыре клетки. Сколько же места занимает треугольник? Как думаешь?',
      uz: "Feruza uchburchak bayroqcha tikmoqda. U to'rtburchak matoni olib, uni diagonal bo'yicha kesadi. Uchburchak hosil bo'ladi. To'rtburchakka yigirma to'rtta katak sig'adi. Uchburchak qancha joy egallaydi? Sizningcha-chi?"
    }
  },

  // ---- s1 WARM-UP — to'rtburchak yuzasi retrieval (geom_5_02). 6x4 = 24. correct B. ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    question: {
      ru: 'На прошлом уроке мы находили площадь прямоугольника. У прямоугольника стороны 6 и 4 — сколько клеток внутри, то есть чему равна площадь?',
      uz: "O'tgan darsda to'rtburchak yuzasini topgandik. To'rtburchakning tomonlari 6 va 4 — ichida nechta katak bor, ya'ni yuzasi qancha?"
    },
    opt0: { ru: '24', uz: '24' },
    opt1: { ru: '20', uz: '20' },
    opt2: { ru: '10', uz: '10' },
    opt3: { ru: '48', uz: '48' },
    correct_text: {
      ru: 'Верно. Площадь — это клетки ВНУТРИ: 6 умножить на 4, всего 24. А теперь заглянем в треугольник.',
      uz: "To'g'ri. Yuza — bu ICHIDAGI kataklar: 6 ni 4 ga ko'paytiramiz, jami 24. Endi esa uchburchakka qaraymiz."
    },
    wrong_1: {
      ru: '20 — это длина границы, периметр: 6 плюс 4 плюс 6 плюс 4. А клеток внутри 6 умножить на 4 — 24.',
      uz: "20 — bu chegara uzunligi, perimetr: 6 qo'shuv 4 qo'shuv 6 qo'shuv 4. Ichidagi kataklar esa 6 ni 4 ga ko'paytirib, 24."
    },
    wrong_2: {
      ru: 'Это только две стороны, 6 плюс 4. Клеток внутри 6 умножить на 4 — 24.',
      uz: "Bu faqat ikki tomon, 6 qo'shuv 4. Ichidagi kataklar esa 6 ni 4 ga ko'paytirib, 24."
    },
    wrong_3: {
      ru: 'Это вдвое больше, чем нужно. Площадь прямоугольника 6 умножить на 4 — 24.',
      uz: "Bu keragidan ikki barobar ko'p. To'rtburchak yuzasi 6 ni 4 ga ko'paytirib, 24."
    },
    wrong_default: { ru: 'Площадь прямоугольника — 6 умножить на 4, это 24.', uz: "To'rtburchak yuzasi — 6 ni 4 ga ko'paytirib, 24." },
    audio: {
      intro: {
        ru: 'Сначала вспомним прошлый урок. У прямоугольника стороны шесть и четыре. Чему равна его площадь? Выбери ответ.',
        uz: "Avval o'tgan darsni eslaymiz. To'rtburchakning tomonlari olti va to'rt. Uning yuzasi qancha? Javobni tanlang."
      },
 on_correct: { ru: 'Верно. Двадцать четыре. Теперь, треугольник.', uz: "To'g'ri. Yigirma to'rt. Endi, uchburchak." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — to'rtburchakni diagonal bo'yicha 2 teng uchburchakka bo'lish (step). ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: {
      ru: 'Возьмём прямоугольник 6 на 4 — в нём 24 клетки. Проведём диагональ и посмотрим, что получится.',
      uz: "6 ga 4 to'rtburchakni olamiz — unda 24 ta katak bor. Diagonal o'tkazamiz va nima bo'lishini ko'ramiz."
    },
    caps: {
      ru: [
        'Прямоугольник: 6 умножить на 4 — это 24 клетки.',
        'Диагональ разделила его на ДВА одинаковых треугольника.',
        'Каждый треугольник — ровно половина: 24 пополам — это 12.'
      ],
      uz: [
        "To'rtburchak: 6 ni 4 ga ko'paytirib, 24 ta katak.",
        "Diagonal uni IKKITA bir xil uchburchakka bo'ldi.",
        "Har bir uchburchak — aynan yarmi: 24 ning yarmi — 12."
      ]
    },
    note: {
      ru: 'Треугольник — это половина прямоугольника. Запомним это.',
      uz: "Uchburchak — bu to'rtburchakning yarmi. Buni eslab qolamiz."
    },
    btn_step: { ru: 'Дальше', uz: 'Keyingi' },
    audio: {
      intro: {
        ru: 'Возьмём прямоугольник со сторонами шесть и четыре. В нём двадцать четыре клетки. Нажимай на кнопку и смотри, что произойдёт.',
        uz: "Tomonlari olti va to'rt bo'lgan to'rtburchakni olamiz. Unda yigirma to'rtta katak bor. Tugmani bosing va nima bo'lishini kuzating."
      },
      done: {
        ru: 'Видишь? Диагональ делит прямоугольник на два одинаковых треугольника. Каждый из них, ровно половина.',
 uz: "Ko'rib turibsizmi? Diagonal to'rtburchakni ikkita bir xil uchburchakka bo'ladi. Har biri, aynan yarmi."
      }
    }
  },

  // ---- s3 EXPLORATION — birlik setkada uchburchak (to'liq + yarim kataklar = 12). ----
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: {
      ru: 'Итак, треугольник — половина. Посчитаем клетки прямо внутри него.',
      uz: "Demak, uchburchak — yarmi. Endi uning ichidagi kataklarni sanaymiz."
    },
    note_unit: {
      ru: 'Целые клетки и половинки клеток вместе дают 12.',
      uz: "To'liq kataklar va yarim kataklar birgalikda 12 ta bo'ladi."
    },
    note_many: {
      ru: 'А 12 — это ровно половина из 24. Всё сходится.',
      uz: "12 esa — 24 ning aynan yarmi. Hammasi to'g'ri keladi."
    },
    audio: {
      ru: 'Посмотри на сам треугольник. Внутри него целые клетки и половинки. Если всё сложить, получится двенадцать. Это ровно половина прямоугольника.',
      uz: "Uchburchakning o'ziga qarang. Uning ichida to'liq kataklar va yarimtalar bor. Hammasini qo'shsak, o'n ikki bo'ladi. Bu to'rtburchakning aynan yarmi."
    }
  },

  // ---- s4 EXPLORATION — jonli slayder: asos o'zgaradi, balandlik=4, S=(a x 4):2. ----
  s4: {
    eyebrow: { ru: 'Эксперимент', uz: 'Tajriba' },
    lead: {
      ru: 'Теперь подвигай ползунок. Меняется основание, высота остаётся 4. Смотри, как считается площадь.',
      uz: "Endi slayderni suring. Asos o'zgaradi, balandlik 4 bo'lib qoladi. Yuza qanday hisoblanishini kuzating."
    },
    note_target: {
      ru: 'При основании 6: 6 умножить на 4 — 24, и пополам — 12. Всегда половина!',
      uz: "Asos 6 bo'lganda: 6 ni 4 ga ko'paytirib, 24, yarmi esa — 12. Doimo yarmi!"
    },
    hint_move: {
      ru: 'Что бы ты ни выбрал, площадь — это основание умножить на высоту и разделить пополам.',
      uz: "Nimani tanlamang, yuza — bu asosni balandlikka ko'paytirib, ikkiga bo'lish."
    },
    audio: {
      ru: 'Двигай ползунок и меняй основание. Высота остаётся четыре. Что бы ты ни выбрал, площадь, это основание умножить на высоту и потом разделить пополам.',
 uz: "Slayderni surib, asosni o'zgartiring. Balandlik to'rt bo'lib qoladi. Nimani tanlamang, yuza, bu asosni balandlikka ko'paytirib, keyin ikkiga bo'lish."
    }
  },

  // ---- s5 RULE 1 — S = (asos x balandlik) : 2. ----
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    lead: { ru: 'Запишем правило, которое ты открыл.', uz: "Siz kashf etgan qoidani yozamiz." },
    rule_main: {
      ru: 'Площадь треугольника = (основание × высота) : 2',
      uz: "Uchburchak yuzasi = (asos × balandlik) : 2"
    },
    ex_easy: {
      ru: 'Например: 6 × 4 = 24, и 24 : 2 = 12.',
      uz: "Masalan: 6 × 4 = 24, va 24 : 2 = 12."
    },
    note: {
      ru: 'Сначала умножаем стороны, потом берём половину.',
      uz: "Avval tomonlarni ko'paytiramiz, keyin yarmini olamiz."
    },
    audio: {
      ru: 'Запомним правило. Площадь треугольника равна основанию умножить на высоту и разделить на два. Сначала умножаем стороны, а потом берём половину.',
      uz: "Qoidani eslab qolamiz. Uchburchak yuzasi asosni balandlikka ko'paytirib, ikkiga bo'lishga teng. Avval tomonlarni ko'paytiramiz, keyin yarmini olamiz."
    }
  },

  // ---- s6 RULE 2 — balandlik = perpendikulyar, qiya tomon EMAS (M2). ----
  s6: {
    eyebrow: { ru: 'Внимание', uz: 'Diqqat' },
    lead: { ru: 'Важно: высота — это НЕ наклонная сторона.', uz: "Muhim: balandlik — bu QIYA tomon EMAS." },
    point1: {
      ru: 'Высота — это перпендикуляр от вершины к основанию (на рисунке — пунктир).',
      uz: "Balandlik — bu uchdan asosga tushgan perpendikulyar (rasmda — punktir chiziq)."
    },
    point2: {
      ru: 'Наклонные стороны длиннее, но в формулу идёт именно высота.',
      uz: "Qiya tomonlar uzunroq, lekin formulaga aynan balandlik kiradi."
    },
    point3: {
      ru: 'Бери высоту, а не наклонную сторону — иначе площадь будет неверной.',
      uz: "Qiya tomonni emas, balandlikni oling — aks holda yuza noto'g'ri chiqadi."
    },
    audio: {
      ru: 'Будь внимателен с высотой. Высота, это перпендикуляр от вершины к основанию, на рисунке он показан пунктиром. Наклонные стороны длиннее, но в формулу идёт именно высота, а не они.',
 uz: "Balandlikka e'tibor bering. Balandlik, bu uchdan asosga tushgan perpendikulyar, rasmda u punktir bilan ko'rsatilgan. Qiya tomonlar uzunroq, lekin formulaga aynan balandlik kiradi, ular emas."
    }
  },

  // ---- s7 RULE 3 / worked example — a=8, h=3 -> (8x3):2 = 12. ----
  s7: {
    eyebrow: { ru: 'Пример', uz: 'Misol' },
    lead: { ru: 'Разберём пример по шагам.', uz: "Misolni qadamma-qadam ko'ramiz." },
    point1: { ru: '1) Основание × высота: 8 × 3 = 24.', uz: "1) Asos × balandlik: 8 × 3 = 24." },
    point2: { ru: '2) Делим пополам: 24 : 2 = 12.', uz: "2) Ikkiga bo'lamiz: 24 : 2 = 12." },
    point3: { ru: 'Готово: площадь треугольника — 12.', uz: "Tayyor: uchburchak yuzasi — 12." },
    audio: {
      ru: 'Разберём пример. Основание восемь, высота три. Сначала умножаем: восемь на три, двадцать четыре. Потом делим пополам, получаем двенадцать. Это и есть площадь.',
 uz: "Misolni ko'ramiz. Asos sakkiz, balandlik uch. Avval ko'paytiramiz: sakkizni uchga, yigirma to'rt bo'ladi. Keyin ikkiga bo'lamiz, o'n ikki chiqadi. Mana shu yuza."
    }
  },

  // ---- s8 TEST multi-select — qaysilari to'g'ri yuza? (M1 tuzoq) + Fakt Matematika ----
  s8: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    lead: {
      ru: 'Какие площади посчитаны ВЕРНО? Отметь все правильные.',
      uz: "Qaysi yuzalar TO'G'RI hisoblangan? Hammasini belgilang."
    },
    opt0: { ru: 'Основание 6, высота 4 → площадь 12', uz: "Asos 6, balandlik 4 → yuza 12" },
    opt1: { ru: 'Основание 10, высота 4 → площадь 40', uz: "Asos 10, balandlik 4 → yuza 40" },
    opt2: { ru: 'Основание 8, высота 2 → площадь 8', uz: "Asos 8, balandlik 2 → yuza 8" },
    opt3: { ru: 'Основание 5, высота 6 → площадь 30', uz: "Asos 5, balandlik 6 → yuza 30" },
    hint_wrong: {
      ru: 'Где-то забыли разделить пополам. 10 × 4 — это 40, но у треугольника половина: 20. 5 × 6 — это 30, половина: 15. Проверь ещё раз.',
      uz: "Bir joyda ikkiga bo'lish unutilgan. 10 ni 4 ga ko'paytirsa 40, lekin uchburchakda yarmi: 20. 5 ni 6 ga ko'paytirsa 30, yarmi: 15. Yana tekshiring."
    },
    correct_text: {
      ru: 'Верно! Правильные — первый и третий: 6 × 4 : 2 = 12 и 8 × 2 : 2 = 8. В остальных забыли половину.',
      uz: "To'g'ri! To'g'rilari — birinchi va uchinchi: 6 × 4 : 2 = 12 va 8 × 2 : 2 = 8. Qolganlarida yarmi unutilgan."
    },
    fact: {
      ru: 'Делить пополам — значит брать половину: треугольник всегда вдвое меньше своего прямоугольника.',
      uz: "Ikkiga bo'lish — yarmini olish demakdir: uchburchak doimo o'z to'rtburchagidan ikki barobar kichik."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: {
        ru: 'Перед тобой четыре подсчёта. Отметь все, где площадь треугольника найдена верно. Не забудь про половину.',
        uz: "Oldingizda to'rtta hisob bor. Uchburchak yuzasi to'g'ri topilgan hammasini belgilang. Yarmini unutmang."
      },
      on_correct: {
        ru: 'Верно. Правильных два. Делить пополам, значит брать половину: треугольник всегда вдвое меньше своего прямоугольника.',
 uz: "To'g'ri. To'g'risi ikkita. Ikkiga bo'lish, yarmini olish demakdir: uchburchak doimo o'z to'rtburchagidan ikki barobar kichik."
      },
      on_wrong: { ru: 'Не совсем. Где-то забыли половину. Посмотри подсказку.', uz: "Unchalik emas. Bir joyda yarmi unutilgan. Maslahatga qarang." }
    }
  },

  // ---- s9 TEST NumInput — a=10, h=6 -> (10x6):2 = 30. ----
  s9: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    question: {
      ru: 'Найди площадь треугольника: основание 10, высота 6.',
      uz: "Uchburchak yuzasini toping: asos 10, balandlik 6."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Сначала 10 умножить на 6 — это 60. Потом раздели пополам: 60 : 2 — это 30.',
      uz: "Avval 10 ni 6 ga ko'paytiring — 60 bo'ladi. Keyin ikkiga bo'ling: 60 : 2 — 30."
    },
    fb_correct: {
      ru: 'Верно! 10 умножить на 6 — это 60, а половина — 30.',
      uz: "To'g'ri! 10 ni 6 ga ko'paytirsa 60, yarmi esa — 30."
    },
    audio: {
      intro: {
        ru: 'Найди площадь треугольника. Основание десять, высота шесть. Не забудь разделить пополам.',
        uz: "Uchburchak yuzasini toping. Asos o'n, balandlik olti. Ikkiga bo'lishni unutmang."
      },
      on_correct: { ru: 'Верно. Тридцать.', uz: "To'g'ri. O'ttiz." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: "Maslahatga qarang." }
    }
  },

  // ---- s10 TEST fill-blank — (6x4) : [box] = 12, box=2. ----
  s10: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    lead: {
      ru: 'Заполни пропуск, чтобы формула площади треугольника стала верной.',
      uz: "Uchburchak yuzasi formulasi to'g'ri bo'lishi uchun bo'sh katakni to'ldiring."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Прямоугольник 6 на 4 — это 24. Треугольник — половина, 12. На сколько надо разделить 24, чтобы получить 12? На 2.',
      uz: "6 ga 4 to'rtburchak — bu 24. Uchburchak — yarmi, 12. 12 ni olish uchun 24 ni nechaga bo'lish kerak? 2 ga."
    },
    fb_correct: {
      ru: 'Верно! Делим на 2 — берём половину.',
      uz: "To'g'ri! 2 ga bo'lamiz — yarmini olamiz."
    },
    audio: {
      intro: {
        ru: 'Заполни пропуск. Прямоугольник шесть на четыре. Треугольник, его половина. На сколько делим, чтобы получить половину?',
 uz: "Bo'sh katakni to'ldiring. To'rtburchak olti ga to'rt. Uchburchak, uning yarmi. Yarmini olish uchun nechaga bo'lamiz?"
      },
      on_correct: { ru: 'Верно. Делим на два.', uz: "To'g'ri. Ikkiga bo'lamiz." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: "Maslahatga qarang." }
    }
  },

  // ---- s11 TEST find-the-wrong — qaysi yechim XATO? (M1) + Fakt Tarix ----
  s11: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q_pre: { ru: 'Три решения верные, а одно —', uz: "Uchta yechim to'g'ri, bittasi esa —" },
    q_em: { ru: 'ОШИБОЧНО', uz: 'XATO' },
    q_post: { ru: '. Найди ошибочное.', uz: '. Xatosini toping.' },
    opt0: { ru: 'осн. 8, выс. 4 → (8 × 4) : 2 = 16', uz: "asos 8, bal. 4 → (8 × 4) : 2 = 16" },
    opt1: { ru: 'осн. 6, выс. 5 → (6 × 5) : 2 = 15', uz: "asos 6, bal. 5 → (6 × 5) : 2 = 15" },
    opt2: { ru: 'осн. 10, выс. 4 → 10 × 4 = 40', uz: "asos 10, bal. 4 → 10 × 4 = 40" },
    opt3: { ru: 'осн. 4, выс. 4 → (4 × 4) : 2 = 8', uz: "asos 4, bal. 4 → (4 × 4) : 2 = 8" },
    correct_text: {
      ru: 'Верно! Здесь забыли разделить пополам: 10 × 4 — это площадь прямоугольника, 40. У треугольника половина — 20.',
      uz: "To'g'ri! Bu yerda ikkiga bo'lish unutilgan: 10 ni 4 ga ko'paytirsa, bu to'rtburchak yuzasi, 40. Uchburchakda yarmi — 20."
    },
    wrong_0: {
      ru: 'Это решение верное: 8 × 4 = 32, и пополам — 16. Ошибка в другом.',
      uz: "Bu yechim to'g'ri: 8 × 4 = 32, yarmi esa — 16. Xato boshqasida."
    },
    wrong_1: {
      ru: 'Это верно: 6 × 5 = 30, пополам — 15. Ищи ошибку в другом.',
      uz: "Bu to'g'ri: 6 × 5 = 30, yarmi — 15. Xatoni boshqasidan qidiring."
    },
    wrong_3: {
      ru: 'Это верно: 4 × 4 = 16, пополам — 8. Ищи ошибку в другом.',
      uz: "Bu to'g'ri: 4 × 4 = 16, yarmi — 8. Xatoni boshqasidan qidiring."
    },
    wrong_default: { ru: 'Ищи решение, где забыли разделить пополам.', uz: "Ikkiga bo'lish unutilgan yechimni qidiring." },
    fact: {
      ru: 'Грани египетских пирамид — огромные треугольники, и их площадь умели считать ещё тысячи лет назад.',
      uz: "Misr piramidalarining yon yuzlari — ulkan uchburchaklar, ularning yuzasini ming yillar avval ham hisoblay olishgan."
    },
    audio: {
      intro: {
        ru: 'Здесь четыре решения. Три верные, а одно ошибочно. Найди то, где допущена ошибка.',
        uz: "Bu yerda to'rtta yechim bor. Uchtasi to'g'ri, bittasi xato. Xato qilingan yechimni toping."
      },
      on_correct: {
        ru: 'Верно. Там забыли взять половину. Грани египетских пирамид, огромные треугольники, и их площадь умели считать ещё тысячи лет назад.',
 uz: "To'g'ri. U yerda yarmini olish unutilgan. Misr piramidalarining yon yuzlari, ulkan uchburchaklar, ularning yuzasini ming yillar avval ham hisoblay olishgan."
      },
      on_wrong: { ru: 'Не там. Ищи решение без деления пополам.', uz: "U emas. Ikkiga bo'lmagan yechimni qidiring." }
    }
  },

  // ---- s12 TEST balandlik-tap — perpendikulyarni bos (M2) + Fakt IT ----
  s12: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    lead: {
      ru: 'Какая из линий — ВЫСОТА треугольника? Нажми на неё.',
      uz: "Chiziqlardan qaysi biri — uchburchak BALANDLIGI? Uni bosing."
    },
    hint_slant: {
      ru: 'Это наклонная сторона, она длиннее. Высота — это перпендикуляр от вершины к основанию.',
      uz: "Bu qiya tomon, u uzunroq. Balandlik — bu uchdan asosga tushgan perpendikulyar."
    },
    fb_correct: {
      ru: 'Верно! Высота — это перпендикуляр от вершины к основанию.',
      uz: "To'g'ri! Balandlik — bu uchdan asosga tushgan perpendikulyar."
    },
    fact: {
      ru: 'Треугольник — самая прочная фигура: из треугольных ферм строят мосты, краны и каркасы.',
      uz: "Uchburchak — eng mustahkam shakl: uchburchak fermalardan ko'priklar, kranlar va karkaslar quriladi."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: {
        ru: 'Какая из линий, высота треугольника? Высота идёт от вершины перпендикулярно основанию. Нажми на неё.',
        uz: "Chiziqlardan qaysi biri, uchburchak balandligi? Balandlik uchdan asosga perpendikulyar tushadi. Uni bosing."
      },
      on_correct: {
        ru: 'Верно. Высота, это перпендикуляр. Треугольник, самая прочная фигура: из треугольных ферм строят мосты и краны.',
 uz: "To'g'ri. Balandlik, bu perpendikulyar. Uchburchak, eng mustahkam shakl: uchburchak fermalardan ko'priklar va kranlar quriladi."
      },
      on_wrong: { ru: 'Это наклонная сторона. Высота, перпендикуляр к основанию.', uz: "Bu qiya tomon. Balandlik, asosga perpendikulyar." }
    }
  },

  // ---- s13 CASE setup — Anvar uchburchak gulzor (asos 5 m, balandlik 4 m). ----
  s13: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    lead: {
      ru: 'Анвар разбивает в саду треугольную клумбу. Основание — 5 метров, высота — 4 метра. Сколько земли под цветы?',
      uz: "Anvar bog'da uchburchak gulzor barpo qilmoqda. Asos — 5 metr, balandlik — 4 metr. Gullar uchun qancha yer kerak?"
    },
    note: {
      ru: 'Площадь = (основание × высота) : 2.',
      uz: "Yuza = (asos × balandlik) : 2."
    },
    hint_calc: {
      ru: 'Сначала 5 × 4, потом раздели пополам.',
      uz: "Avval 5 × 4, keyin ikkiga bo'ling."
    },
    btn_help: { ru: 'Посчитать', uz: 'Hisoblash' },
    audio: {
      ru: 'Анвар разбивает треугольную клумбу. Основание пять метров, высота четыре метра. Сколько земли понадобится под цветы? Посчитаем площадь.',
      uz: "Anvar uchburchak gulzor barpo qilmoqda. Asos besh metr, balandlik to'rt metr. Gullar uchun qancha yer kerak bo'ladi? Yuzani hisoblaymiz."
    }
  },

  // ---- s14 CASE/FINAL MC — gulzor yuzasi (5x4):2 = 10. correct D + Fakt IT ----
  s14: {
    eyebrow: { ru: 'Итоговое задание', uz: 'Yakuniy topshiriq' },
    lead: {
      ru: 'Клумба Анвара: основание 5 м, высота 4 м. Чему равна площадь?',
      uz: "Anvarning gulzori: asos 5 m, balandlik 4 m. Yuzasi qancha?"
    },
    opt0: { ru: '10 м²', uz: "10 m²" },
    opt1: { ru: '20 м²', uz: "20 m²" },
    opt2: { ru: '9 м²', uz: "9 m²" },
    opt3: { ru: '40 м²', uz: "40 m²" },
    correct_text: {
      ru: 'Верно! 5 × 4 — это 20, а половина — 10 квадратных метров.',
      uz: "To'g'ri! 5 ni 4 ga ko'paytirsa 20, yarmi esa — 10 kvadrat metr."
    },
    wrong_1: {
      ru: 'Почти: 5 × 4 — это 20, но это весь прямоугольник. У треугольника половина — 10.',
      uz: "Deyarli: 5 ni 4 ga ko'paytirsa 20, lekin bu butun to'rtburchak. Uchburchakda yarmi — 10."
    },
    wrong_2: {
      ru: 'Это 5 плюс 4. А нужна площадь: 5 × 4, потом пополам — 10.',
      uz: "Bu 5 qo'shuv 4. Yuza esa kerak: 5 ni 4 ga ko'paytirib, keyin yarmi — 10."
    },
    wrong_3: {
      ru: 'Это слишком много. 5 × 4 — это 20, и пополам — 10.',
      uz: "Bu juda ko'p. 5 ni 4 ga ko'paytirsa 20, yarmi esa — 10."
    },
    wrong_default: { ru: 'Площадь треугольника: 5 × 4, потом пополам — 10.', uz: "Uchburchak yuzasi: 5 ni 4 ga ko'paytirib, keyin yarmi — 10." },
    fact: {
      ru: 'В играх и мультфильмах все трёхмерные фигуры собраны из тысяч маленьких треугольников.',
      uz: "O'yinlar va multfilmlarda barcha uch o'lchamli shakllar minglab kichik uchburchaklardan yig'iladi."
    },
    audio: {
      intro: {
        ru: 'Посчитай площадь клумбы. Основание пять метров, высота четыре. Не забудь про половину.',
        uz: "Gulzor yuzasini hisoblang. Asos besh metr, balandlik to'rt. Yarmini unutmang."
      },
      on_correct: {
        ru: 'Верно. Десять квадратных метров. В играх и мультфильмах все трёхмерные фигуры собраны из тысяч маленьких треугольников.',
        uz: "To'g'ri. O'n kvadrat metr. O'yinlar va multfilmlarda barcha uch o'lchamli shakllar minglab kichik uchburchaklardan yig'iladi."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s15 SUMMARY — hookni yopadi + ConnectionsBlock ----
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    title: { ru: 'Отлично! Теперь ты умеешь находить площадь треугольника.', uz: "Ajoyib! Endi siz uchburchak yuzasini topa olasiz." },
    main_label: { ru: 'Что мы узнали', uz: "Nimani bilib oldik" },
    main_1: { ru: 'Треугольник — это половина прямоугольника.', uz: "Uchburchak — bu to'rtburchakning yarmi." },
    main_2: { ru: 'Площадь = (основание × высота) : 2.', uz: "Yuza = (asos × balandlik) : 2." },
    main_3: { ru: 'Высота — это перпендикуляр, а не наклонная сторона.', uz: "Balandlik — bu perpendikulyar, qiya tomon emas." },
    hook_close: {
      ru: 'Помнишь флажок Ферузы? Прямоугольник ткани 6 на 4 — это 24, а треугольный флажок — половина, 12. Она была права!',
      uz: "Feruzaning bayroqchasini eslaysizmi? 6 ga 4 to'rtburchak mato — bu 24, uchburchak bayroqcha esa yarmi, 12. U haq edi!"
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: 'Площадь прямоугольника (треугольник — его половина).',
      uz: "To'rtburchak yuzasi (uchburchak — uning yarmi)."
    },
    conn_label_next: { ru: 'Следующий урок', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'Объём прямоугольного параллелепипеда.',
      uz: "To'g'ri burchakli parallelepiped hajmi."
    },
    btn_restart: { ru: 'Пройти заново', uz: 'Qaytadan' },
    audio: {
      ru: 'Отлично. Теперь ты знаешь: треугольник, половина прямоугольника, а его площадь, основание умножить на высоту и разделить пополам. И помни про высоту: это перпендикуляр. Молодец!',
 uz: "Ajoyib. Endi bilasiz: uchburchak, to'rtburchakning yarmi, uning yuzasi esa, asosni balandlikka ko'paytirib, ikkiga bo'lish. Balandlikni ham yodda tuting: bu perpendikulyar. Barakalla!"
    }
  }

};

// ============================================================
// YORDAMCHI KOMPONENTLAR (infra_v2 — Dars29 bilan bir xil)
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

// Ambient-harakat siyrak ekranlar uchun: yumshoq suzuvchi doiralar.
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

// Fakt-animatsiyalar (CSS-only loop, ko'k tema, qutiga sig'adi — overflow:hidden).
// Ikkiga bo'lish = yarmi: to'rtburchak diagonal bilan 2 ga bo'linadi, B yarmi pulslaydi (Matematika).
const AnimHalf = () => (
  <svg className="fa-hf" viewBox="0 0 90 64" aria-hidden="true">
    <rect x="6" y="6" width="78" height="52" className="fa-hf-r"/>
    <polygon points="6,58 84,58 84,6" className="fa-hf-a"/>
    <polygon points="6,58 6,6 84,6" className="fa-hf-b"/>
    <line x1="6" y1="58" x2="84" y2="6" className="fa-hf-d"/>
  </svg>
);
// Misr piramidasi — uchburchak yuz + quyosh pulsi (Tarix).
const AnimPyramid = () => (
  <svg className="fa-py" viewBox="0 0 90 64" aria-hidden="true">
    <circle cx="70" cy="16" r="7" className="fa-py-sun"/>
    <polygon points="45,12 82,56 8,56" className="fa-py-t"/>
    <line x1="45" y1="12" x2="45" y2="56" className="fa-py-h"/>
  </svg>
);
// Uchburchak ferma (ko'prik) — yuk yengil sakraydi (IT/muhandislik).
const AnimTruss = () => (
  <svg className="fa-tr" viewBox="0 0 90 64" aria-hidden="true">
    <polygon points="8,54 26,20 44,54" className="fa-tr-t"/>
    <polygon points="46,54 64,20 82,54" className="fa-tr-t"/>
    <rect x="4" y="54" width="82" height="4" className="fa-tr-base"/>
    <circle cx="45" cy="12" r="5" className="fa-tr-load"/>
  </svg>
);
// 3D mesh — kichik uchburchaklar to'lqinli yorishadi (IT).
const AnimMesh = () => (
  <div className="fa-ms" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <span key={i} className={`fa-ms-t${i % 2 ? ' fa-ms-d' : ''}`} style={{ animationDelay: `${(i % 3 + Math.floor(i / 3)) * 0.16}s` }}/>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATOR — TriViz (uchburchak = to'rtburchakning yarmi), SVG
// ============================================================
// base(a) x height(h) birlik kataklarda. mode: 'tri' (uchburchak + o'rab turgan to'rtburchak ghost),
// 'split' (to'rtburchak + diagonal + 2 teng uchburchak; phase 0 rect / 1 ikkala yarim / 2 bitta yarim).
// apexFrac: uchning gorizontal o'rni (0..1). showHeight: ichki perpendikulyar + to'g'ri burchak belgisi.
// alive: uzluksiz shine loop. success: yashil. grid: birlik setka chiziqlari.
const TriViz = ({ base, height, cell = 28, mode = 'tri', phase = 1, apexFrac = 0.5, grid = false, showHeight = false, success = false, alive = true, compact = false, aLabel, hLabel }) => {
  const cs = compact ? Math.max(18, cell - 7) : cell;
  const padL = 30, padB = 24, padT = 12, padR = 12;
  const W = base * cs, H = height * cs;
  const x0 = padL, y0 = padT, xR = x0 + W, yB = y0 + H;
  const apexX = x0 + apexFrac * W;
  const svgW = W + padL + padR, svgH = H + padT + padB;
  const gridLines = [];
  if (grid) {
    for (let i = 1; i < base; i++) gridLines.push(<line key={`v${i}`} x1={x0 + i * cs} y1={y0} x2={x0 + i * cs} y2={yB} className="tv-grid"/>);
    for (let j = 1; j < height; j++) gridLines.push(<line key={`h${j}`} x1={x0} y1={y0 + j * cs} x2={xR} y2={y0 + j * cs} className="tv-grid"/>);
  }
  const cls = `tv${alive ? ' tv-alive' : ''}${success ? ' tv-ok' : ''}`;
  return (
    <svg className={cls} viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect x={x0} y={y0} width={W} height={H} className="tv-rect"/>
      {grid && gridLines}
      {mode === 'split' ? (
        <>
          {phase >= 1 && <polygon points={`${x0},${yB} ${xR},${yB} ${xR},${y0}`} className={`tv-fillA${phase === 2 ? ' tv-fillA-hi' : ''}`}/>}
          {phase >= 1 && <polygon points={`${x0},${yB} ${x0},${y0} ${xR},${y0}`} className={`tv-fillB${phase === 2 ? ' tv-fillB-dim' : ''}`}/>}
          {phase >= 1 && <line x1={x0} y1={yB} x2={xR} y2={y0} className="tv-diag"/>}
        </>
      ) : (
        <>
          <polygon points={`${x0},${yB} ${xR},${yB} ${apexX},${y0}`} className="tv-fill"/>
          {showHeight && <line x1={apexX} y1={y0} x2={apexX} y2={yB} className="tv-height"/>}
          {showHeight && <polyline points={`${apexX - 8},${yB} ${apexX - 8},${yB - 8} ${apexX},${yB - 8}`} className="tv-rangle"/>}
        </>
      )}
      {aLabel !== undefined && <text x={x0 + W / 2} y={yB + 17} className="tv-lbl" textAnchor="middle">{aLabel}</text>}
      {hLabel !== undefined && mode !== 'split' && <text x={x0 - 9} y={y0 + H / 2} className="tv-lbl" textAnchor="middle" transform={`rotate(-90 ${x0 - 9} ${y0 + H / 2})`}>{hLabel}</text>}
    </svg>
  );
};

// HOOK animatsiyasi — to'rtburchak diagonal bilan 2 uchburchakka bo'linadi (CSS-only loop).
const HookSplit = () => (
  <div className="hk-host" aria-hidden="true">
    <svg viewBox="0 0 200 140" className="hk-svg">
      <rect x="20" y="14" width="160" height="112" className="hk-rect"/>
      <polygon points="20,126 180,126 180,14" className="hk-a"/>
      <polygon points="20,126 20,14 180,14" className="hk-b"/>
      <line x1="20" y1="126" x2="180" y2="14" className="hk-diag"/>
    </svg>
  </div>
);

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (Feruza bayroqcha). Qaytish: picked TO'LIQ sbros.
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
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(10px, 2vw, 16px)', display: 'flex', justifyContent: 'center' }}>
          <HookSplit/>
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

// s1 — WARM-UP (to'rtburchak yuzasi retrieval) QuestionScreen orqali (correct B)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (to'rtburchak -> diagonal -> 2 teng uchburchak, step 0..2)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const MAX = 2;
  const [step, setStep] = useState(0);
  const doneAnnouncedRef = useRef(false);
  const caps = c.caps[lang] || c.caps.ru;
  const done = step >= MAX;
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <TriViz base={6} height={4} cell={28} mode="split" phase={step} grid={true} success={done}/>
          {done && (
            <div className="hr-calc">
              <span className="hr-calc-on">24</span><span className="hr-calc-op">:</span><span className="hr-calc-on">2</span>
              <span className="hr-calc-op">=</span><span className="hr-calc-res">12</span>
            </div>
          )}
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

// s3 — EXPLORATION (birlik setkada uchburchak: to'liq + yarim kataklar = 12)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <TriViz base={6} height={4} cell={30} mode="tri" apexFrac={0} grid={true} showHeight={true} aLabel="6" hLabel="4"/>
          <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? "to'liq + yarim kataklar = 12" : 'целые + половинки = 12'}</span>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.note_unit))}</p>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note_many))}</p>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION (jonli slayder: asos a o'zgaradi, balandlik=4; S=(a x 4):2)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const H = 4;
  const [a, setA] = useState(6);
  const rect = a * H;
  const area = rect / 2;
  const isTarget = a === 6;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <TriViz base={a} height={H} cell={26} mode="tri" apexFrac={0.5} showHeight={true} success={isTarget} aLabel={String(a)} hLabel="4"/>
          <div className="hr-calc">
            <span className="hr-calc-on">{a}</span><span className="hr-calc-op">×</span><span className="hr-calc-on">{H}</span>
            <span className="hr-calc-op">:</span><span className="hr-calc-on">2</span>
            <span className="hr-calc-op">=</span><span className="hr-calc-res">{area}</span>
          </div>
        </div>
        <div className="fade-up delay-2"><Slider value={a} min={2} max={8} step={1} onChange={setA}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: isTarget ? T.success : T.ink2, fontWeight: isTarget ? 600 : 400 }}>{mt(t(isTarget ? c.note_target : c.hint_move))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 1 (S = (a x h) : 2) + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <TriViz base={6} height={4} cell={24} mode="tri" apexFrac={0.5} showHeight={true} compact={true} aLabel="6" hLabel="4"/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s6 — RULE 2 (balandlik = perpendikulyar, qiya tomon emas; M2) + ambient
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 3.5vw, 30px)', flexWrap: 'wrap' }}>
          <TriViz base={6} height={4} cell={26} mode="tri" apexFrac={0.34} showHeight={true} aLabel="asos" hLabel=""/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.point1))}</p>
            <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.point2))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point3))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — worked example (a=8, h=3 -> (8x3):2 = 12) + ambient
const Screen7 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 3.5vw, 30px)', flexWrap: 'wrap' }}>
          <TriViz base={8} height={3} cell={26} mode="tri" apexFrac={0.5} showHeight={true} aLabel="8" hLabel="3"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.point1))}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.point2))}</p>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{mt(t(c.point3))}</p>
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s8 — TEST multi-select (qaysilari to'g'ri yuza?) + Fakt Matematika
const MS8_OK = [true, false, true, false];
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const opts = [c.opt0, c.opt1, c.opt2, c.opt3];
  const wasSolved = storedAnswer?.solved === true;
  const [sel, setSel] = useState(() => (wasSolved ? MS8_OK.map(v => v) : [false, false, false, false]));
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const toggle = (i) => { if (solved) return; setChecked(false); setSel(p => { const n = [...p]; n[i] = !n[i]; return n; }); };
  const check = () => {
    if (solved) return;
    const ok = MS8_OK.every((v, i) => v === sel[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.lead[lang], correctAnswer: '0,2', studentAnswer: sel.map((v, i) => (v ? i : '')).filter(x => x !== '').join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="ms-list fade-up delay-1" style={{ position: 'relative' }}>
          {opts.map((o, i) => {
            const on = sel[i];
            let cls = 'ms-item';
            if (on) cls += ' ms-on';
            if (checked && !solved) { if (on && !MS8_OK[i]) cls += ' ms-bad'; if (!on && MS8_OK[i]) cls += ' ms-missed'; }
            if (solved && MS8_OK[i]) cls += ' ms-ok';
            return (
              <button key={i} className={cls} disabled={solved} onClick={() => toggle(i)}>
                <span className="ms-box">{on ? <IconOk/> : null}</span>
                <span className="ms-txt">{mt(t(o))}</span>
              </button>
            );
          })}
        </div>
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
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
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            <div style={{ marginTop: 12 }}><FactCard text={c.fact} badge={FB_MATH} anim={<AnimHalf/>}/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s9 — TEST NumInput (a=10, h=6 -> 30)
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={30} renderVisual={() => <TriViz base={10} height={6} cell={20} mode="tri" apexFrac={0.5} showHeight={true} compact={true} aLabel="10" hLabel="6"/>}/>;
};

// s10 — TEST fill-blank ((6 x 4) : [box] = 12, box=2)
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10; const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const CORR = 2;
  const wasSolved = storedAnswer?.solved === true;
  const [value, setValue] = useState(wasSolved ? String(CORR) : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = parseFloat(String(value).trim().replace(',', '.')); if (isNaN(v)) return;
    const ok = Math.abs(v - CORR) < 1e-9;
    if (firstTryRef.current === null) { firstTryRef.current = ok; firstAnsRef.current = String(v); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[10].scope, screenIdx: 10, question: c.lead[lang], correctAnswer: String(CORR), studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)', flexWrap: 'wrap' }}>
          <span className="fb-expr">( 6 <Op size="mid">×</Op> 4 )</span>
          <Op size="mid">:</Op>
          <input type="number" inputMode="numeric" className={`answer-input fb-box ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()}/>
          <Op size="mid">=</Op>
          <span className="fb-expr">12</span>
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative' }}>
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
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

// s11 — TEST find-the-wrong (correct = opt2 "10x4=40", shuffle -> C) + Fakt Tarix
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [1, 3, 2, 0]);
  const question = (<h2 className="title h-sub">{t(c.q_pre)}{' '}<span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPyramid/>}/>}/>;
};

// s12 — TEST balandlik-tap (perpendikulyarni bos; M2) + Fakt IT
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12; const sfx = useSfx();
  const audio = useAudio([{ id: 's12_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [solved, setSolved] = useState(wasSolved);
  const [wrong, setWrong] = useState(() => new Set());
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const pick = (which) => {
    if (solved || wrong.has(which)) return;
    const ok = which === 'h';
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); setShowHint(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[12].scope, screenIdx: 12, question: c.lead[lang], correctAnswer: 'height', studentAnswer: which, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong(); setShowHint(true);
      setWrong(prev => { const n = new Set(prev); n.add(which); return n; });
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  // Umumiy uchburchak: asos pastda, uch (apex) o'ngga siljigan; balandlik = ichki perpendikulyar.
  const x0 = 40, y0 = 18, W = 200, H = 120, xR = x0 + W, yB = y0 + H, apexX = x0 + 0.66 * W;
  const sideCls = (k) => `ht-side${wrong.has(k) ? ' ht-dim' : ''}`;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${xR + 30} ${yB + 26}`} className={`ht-svg${solved ? ' ht-ok' : ''}`} style={{ maxWidth: '100%', height: 'auto' }}>
            <polygon points={`${x0},${yB} ${xR},${yB} ${apexX},${y0}`} className="ht-fill"/>
            {/* balandlik (to'g'ri javob) */}
            <line x1={apexX} y1={y0} x2={apexX} y2={yB} className={`ht-h${solved ? ' ht-h-ok' : ''}`}/>
            <polyline points={`${apexX - 9},${yB} ${apexX - 9},${yB - 9} ${apexX},${yB - 9}`} className="ht-rangle"/>
            {/* qiya tomonlar (chalg'ituvchilar) */}
            <line x1={x0} y1={yB} x2={apexX} y2={y0} className={sideCls('l')}/>
            <line x1={xR} y1={yB} x2={apexX} y2={y0} className={sideCls('r')}/>
            {/* bosish zonalari (shaffof, qalin) */}
            {!solved && <line x1={apexX} y1={y0} x2={apexX} y2={yB} className="ht-hit" onClick={() => pick('h')}/>}
            {!solved && <line x1={x0} y1={yB} x2={apexX} y2={y0} className="ht-hit" onClick={() => pick('l')}/>}
            {!solved && <line x1={xR} y1={yB} x2={apexX} y2={y0} className="ht-hit" onClick={() => pick('r')}/>}
            <text x={x0 + W / 2} y={yB + 18} className="tv-lbl" textAnchor="middle">{lang === 'uz' ? 'asos' : 'основание'}</text>
          </svg>
        </div>
        {showHint && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.accent }}><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_slant))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
            <div style={{ marginTop: 12 }}><FactCard text={c.fact} badge={FB_IT} anim={<AnimTruss/>}/></div>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s13 — CASE setup (Anvar uchburchak gulzor 5x4)
const Screen13 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px) clamp(10px, 2vw, 16px)' }}>
          <TriViz base={5} height={4} cell={30} mode="tri" apexFrac={0.5} showHeight={true} aLabel="5 m" hLabel="4 m"/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s14 — CASE/FINAL MC (gulzor (5x4):2 = 10, correct D) + Fakt IT
const Screen14 = (props) => {
  const t = useT(); const c = CONTENT.s14;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-sub">{mt(t(c.lead))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><TriViz base={5} height={4} cell={24} mode="tri" apexFrac={0.5} showHeight={true} compact={true} aLabel="5 m" hLabel="4 m"/></div></>);
  return <QuestionScreen {...props} idx={14} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[14]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimMesh/>}/>}/>;
};

// s15 — SUMMARY + hook yopilishi + bog'lanishlar + ambient
const Screen15 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s15;
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
export default function TriangleAreaLesson({
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


/* MATH geom_5_03: TriViz — uchburchak = to'rtburchakning yarmi (SVG, jonli shine loop). */
.tv-rect { fill: none; stroke: #A7A6A2; stroke-width: 1.5; stroke-dasharray: 4 3; }
.tv-grid { stroke: rgba(167, 166, 162, 0.4); stroke-width: 1; }
.tv-fill { fill: #FF4F28; fill-opacity: 0.82; stroke: #FF4F28; stroke-width: 2; stroke-linejoin: round; transition: fill 0.3s ease, fill-opacity 0.3s ease; }
.tv-ok .tv-fill { fill: #1F7A4D; stroke: #1F7A4D; }
.tv-alive .tv-fill { animation: tvShine 2.8s ease-in-out infinite; }
.tv-fillA { fill: #FF4F28; fill-opacity: 0.82; stroke: #FFFFFF; stroke-width: 1.5; stroke-linejoin: round; }
.tv-fillB { fill: #019ACB; fill-opacity: 0.5; stroke: #FFFFFF; stroke-width: 1.5; stroke-linejoin: round; }
.tv-ok .tv-fillA, .tv-ok .tv-fillA-hi { fill: #1F7A4D; }
.tv-fillA-hi { fill-opacity: 0.92; }
.tv-fillB-dim { fill-opacity: 0.18; }
.tv-alive .tv-fillA { animation: tvShine 2.8s ease-in-out infinite; }
.tv-diag { stroke: #0E0E10; stroke-width: 2; }
.tv-height { stroke: #019ACB; stroke-width: 2; stroke-dasharray: 5 3; }
.tv-rangle { fill: none; stroke: #019ACB; stroke-width: 1.5; }
.tv-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; fill: #5A5A60; }
@keyframes tvShine { 0%, 100% { fill-opacity: 0.82; } 50% { fill-opacity: 1; } }

/* MATH geom_5_03: hr-calc — hisob qatori (a x h : 2 = res). */
.hr-calc { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 3vw, 22px); flex-wrap: wrap; justify-content: center; }
.hr-calc-on { color: #FF4F28; }
.hr-calc-op { color: #A7A6A2; }
.hr-calc-res { color: #019ACB; min-width: 1.2em; text-align: center; }

/* MATH geom_5_03: HookSplit — to'rtburchak diagonal bilan 2 uchburchakka bo'linadi (CSS loop). */
.hk-host { display: flex; align-items: center; justify-content: center; width: 100%; }
.hk-svg { width: clamp(180px, 42vw, 220px); height: auto; }
.hk-rect { fill: rgba(1, 154, 203, 0.06); stroke: #A7A6A2; stroke-width: 2; stroke-dasharray: 5 3; }
.hk-a { fill: #FF4F28; fill-opacity: 0.85; transform-origin: center; animation: hkA 5s ease-in-out infinite; }
.hk-b { fill: #019ACB; fill-opacity: 0; animation: hkB 5s ease-in-out infinite; }
.hk-diag { stroke: #0E0E10; stroke-width: 2.5; stroke-dasharray: 220; stroke-dashoffset: 220; animation: hkD 5s ease-in-out infinite; }
@keyframes hkA { 0%, 8% { opacity: 0; transform: scale(0.6); } 22%, 100% { opacity: 1; transform: scale(1); } }
@keyframes hkB { 0%, 46% { fill-opacity: 0; } 62%, 90% { fill-opacity: 0.5; } 100% { fill-opacity: 0; } }
@keyframes hkD { 0%, 14% { stroke-dashoffset: 220; } 36%, 100% { stroke-dashoffset: 0; } }

/* MATH geom_5_03: ms — multi-select (qaysilari to'g'ri yuza?). */
.ms-list { display: flex; flex-direction: column; gap: 10px; }
.ms-item { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; cursor: pointer; background: #FFFFFF; border: none; border-radius: 12px; padding: clamp(11px, 1.7vw, 13px) clamp(14px, 2vw, 18px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.18s; font-family: 'Manrope', sans-serif; }
.ms-item:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.ms-item:disabled { cursor: default; }
.ms-box { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; border: 2px solid #A7A6A2; display: flex; align-items: center; justify-content: center; color: #FFFFFF; background: #FFFFFF; transition: all 0.18s; }
.ms-on .ms-box { background: #FF4F28; border-color: #FF4F28; }
.ms-txt { flex: 1; font-size: clamp(13px, 1.8vw, 15px); color: #0E0E10; }
.ms-on { box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.3); }
.ms-bad { background: #FFE8E1 !important; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36) !important; }
.ms-bad .ms-box { background: #FF4F28; border-color: #FF4F28; }
.ms-missed { box-shadow: 0 0 0 2px #D8A93A inset, 0 6px 16px -6px rgba(180, 138, 30, 0.24) !important; }
.ms-ok { background: #E3F0E8 !important; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.3) !important; }
.ms-ok .ms-box { background: #1F7A4D; border-color: #1F7A4D; }

/* MATH geom_5_03: fb — fill-blank ifoda ((6 x 4) : [box] = 12). */
.fb-expr { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(20px, 4vw, 28px); color: #0E0E10; }
.fb-box { width: clamp(64px, 14vw, 84px) !important; font-size: clamp(20px, 4vw, 26px) !important; }

/* MATH geom_5_03: ht — balandlik-tap (perpendikulyarni tanlash; M2). */
.ht-svg { width: clamp(220px, 56vw, 300px); height: auto; }
.ht-fill { fill: rgba(255, 79, 40, 0.1); stroke: none; }
.ht-ok .ht-fill { fill: rgba(31, 122, 77, 0.1); }
.ht-side { stroke: #5A5A60; stroke-width: 3; stroke-linecap: round; transition: opacity 0.2s, stroke 0.2s; }
.ht-side.ht-dim { opacity: 0.3; stroke: #A7A6A2; }
.ht-h { stroke: #A7A6A2; stroke-width: 3; stroke-dasharray: 6 4; stroke-linecap: round; transition: stroke 0.2s; }
.ht-h-ok { stroke: #1F7A4D; stroke-dasharray: none; }
.ht-rangle { fill: none; stroke: #A7A6A2; stroke-width: 1.5; }
.ht-ok .ht-rangle { stroke: #1F7A4D; }
.ht-hit { stroke: transparent; stroke-width: 16; stroke-linecap: round; cursor: pointer; }

/* MATH geom_5_03: fakt-animatsiyalar (CSS-only loop, qutiga sig'adi, overflow:hidden). */
/* Ikkiga bo'lish = yarmi: to'rtburchak diagonali + B yarmi pulsi (Matematika). */
.fa-hf { width: clamp(78px, 16vw, 110px); height: auto; }
.fa-hf-r { fill: rgba(1, 154, 203, 0.08); stroke: #A7A6A2; stroke-width: 2; stroke-dasharray: 4 3; }
.fa-hf-a { fill: #FF4F28; fill-opacity: 0.85; }
.fa-hf-b { fill: #019ACB; animation: faHfB 2.4s ease-in-out infinite; }
.fa-hf-d { stroke: #0E0E10; stroke-width: 2; }
@keyframes faHfB { 0%, 100% { fill-opacity: 0.2; } 50% { fill-opacity: 0.6; } }
/* Misr piramidasi — uchburchak yuz + quyosh pulsi (Tarix). */
.fa-py { width: clamp(78px, 16vw, 110px); height: auto; }
.fa-py-sun { fill: #019ACB; animation: faPySun 2.6s ease-in-out infinite; }
.fa-py-t { fill: #FF4F28; fill-opacity: 0.85; stroke: #FF4F28; stroke-width: 1.5; stroke-linejoin: round; }
.fa-py-h { stroke: #FFFFFF; stroke-width: 1.5; stroke-dasharray: 4 3; }
@keyframes faPySun { 0%, 100% { opacity: 0.45; transform: scale(0.9); transform-origin: 70px 16px; } 50% { opacity: 1; transform: scale(1.1); transform-origin: 70px 16px; } }
/* Uchburchak ferma — yuk yengil sakraydi (IT). */
.fa-tr { width: clamp(80px, 16vw, 112px); height: auto; }
.fa-tr-t { fill: rgba(1, 154, 203, 0.12); stroke: #019ACB; stroke-width: 2.5; stroke-linejoin: round; }
.fa-tr-base { fill: #5A5A60; }
.fa-tr-load { fill: #FF4F28; animation: faTrLoad 1.8s ease-in-out infinite; }
@keyframes faTrLoad { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
/* 3D mesh — kichik uchburchaklar to'lqinli yorishadi (IT). */
.fa-ms { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: clamp(66px, 13vw, 92px); height: clamp(66px, 13vw, 92px); }
.fa-ms-t { background: #019ACB; opacity: 0.25; clip-path: polygon(50% 0, 100% 100%, 0 100%); animation: faMs 1.8s ease-in-out infinite; }
.fa-ms-d { clip-path: polygon(0 0, 100% 0, 50% 100%); }
@keyframes faMs { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.95; } }

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
