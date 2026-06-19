import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Процент как сотая доля — perc_5_01 (Dars25)
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
        <div className="fade-up">{c.title && <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>}<h2 className="title h-sub">{mt(t(c.question))}</h2></div>
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
// --- ПОД УРОК: dec_5_04 — Умножение и деление десятичной на 10, 100, 1000 (PROMPT 2026-06-14) ---
// Центральный misconception: "×10 = приписать ноль" (как у натуральных): 2,5×10=2,50 вместо 25.
// Плюс: двигает запятую не в ту сторону; теряет/дописывает лишние нули. Визуализатор CommaHop
// ("прыгающая запятая": ×→вправо, ÷→влево, нули материализуются). Hook-loop HookZeroTrap.
// Типы тестов: warm-up MC / MC / NumInput / find-the-wrong / fill-blank / comma-placement / MC.
// Spaced-retrieval s1 (разряды, dec_5_01). Linker-связки 4-A, факты, ✓/✗ feedback, reduced-motion.
// IT-сюжет: Davron (hook, размеры файлов), Madina (кейс). Факты: научная запись / КБ-МБ-ГБ /
// двоичный сдвиг — все DRAFT, требуют валидации методиста.
// ============================================================

const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'perc-5-01-v1',
  lessonTitle: { ru: 'Процент как сотая доля', uz: "Foiz — yuzdan bir ulush" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's12', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — batareya (Rustam). Tuzoq: foiz = absolyut miqdor (M2). ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title: { ru: 'Загадка про заряд', uz: "Zaryad topishmog'i" },
    lead: {
      ru: 'У Рустама на телефоне заряд 50%. На повербанке тоже 50%. В обоих одинаковый запас энергии?',
      uz: "Rustam telefonida zaryad 50%. Power-bankda ham 50%. Ikkalasida energiya zaxirasi bir xilmi?"
    },
    opt0: { ru: 'Да, оба по 50% — значит, поровну', uz: "Ha, ikkalasi 50% — demak teng" },
    opt1: { ru: 'Нет, запас может быть разным', uz: "Yo'q, zaxira har xil bo'lishi mumkin" },
    opt2: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    reveal: {
      ru: 'Запомни свой ответ. В конце урока вернёмся к этой загадке.',
      uz: "Javobingizni eslab qoling. Dars oxirida shu topishmoqqa qaytamiz."
    },
    audio: {
      intro: {
        ru: 'У Рустама телефон заряжен на пятьдесят процентов. И повербанк тоже на пятьдесят процентов. Как думаешь, запас энергии в них одинаковый?',
        uz: "Rustam telefoni ellik foizga zaryadlangan. Power-bank ham ellik foizga. Sizningcha, ulardagi energiya zaxirasi bir xilmi?"
      },
      on_correct: { ru: 'Хорошо. Разберёмся вместе.', uz: "Yaxshi. Birgalikda aniqlab olamiz." },
      on_wrong:   { ru: 'Хорошо. Разберёмся вместе.', uz: "Yaxshi. Birgalikda aniqlab olamiz." }
    }
  },

  // ---- s1 WARM-UP — Dars21 ni eslash (yuzdan ulush -> o'nli kasr). scored=false, correct A ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Вспомним сотые', uz: "Yuzdan ulushni eslaymiz" },
    question: {
      ru: 'Из ста клеток закрашены 9. Какая это десятичная дробь?',
      uz: "Yuzta katakdan 9 tasi bo'yalgan. Bu qanday o'nli kasr?"
    },
    opt0: { ru: '0,09 — девять сотых', uz: "0,09 — yuzdan to'qqiz" },
    opt1: { ru: '0,9 — девять десятых', uz: "0,9 — o'ndan to'qqiz" },
    opt2: { ru: '9,0 — девять целых', uz: "9,0 — to'qqiz butun" },
    opt3: { ru: '0,009 — девять тысячных', uz: "0,009 — mingdan to'qqiz" },
    correct_text: {
      ru: 'Верно. 9 клеток из ста — это 9/100, то есть 0,09.',
      uz: "To'g'ri. Yuzdan 9 ta katak — bu 9/100, ya'ni 0,09."
    },
    wrong_0: {
      ru: 'Это другая дробь. 0,9 — это девять десятых, то есть 9 клеток из десяти, а у нас из ста.',
      uz: "Bu boshqa kasr. 0,9 — o'ndan to'qqiz, ya'ni o'ndan 9 ta, bizda esa yuzdan."
    },
    wrong_1: {
      ru: 'Девять целых — это уже больше одного. А закрашена лишь часть из ста клеток.',
      uz: "To'qqiz butun — bu allaqachon birdan katta. Bizda esa yuzta katakning bir qismi bo'yalgan."
    },
    wrong_2: {
      ru: 'Тысячных тут нет: клеток сто, а не тысяча. Значит, разряд — сотые.',
      uz: "Bu yerda mingdan yo'q: katak yuzta, ming emas. Demak xona — yuzdan."
    },
    audio: {
      intro: {
        ru: 'Из ста клеток закрашены девять. Запиши это десятичной дробью и выбери вариант.',
        uz: "Yuzta katakdan to'qqiztasi bo'yalgan. Buni o'nli kasr bilan yozing va variantni tanlang."
      },
      on_correct: { ru: 'Верно. Девять сотых.', uz: "To'g'ri. Yuzdan to'qqiz." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — 100-setka: 1 katak = 1% = 1/100 = 0,01. Step-gated ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Сотая доля целого', uz: "Butunning yuzdan biri" },
    lead: {
      ru: 'Возьмём целое и разделим на 100 равных клеток. Одна клетка — это сотая доля целого.',
      uz: "Butunni olamiz va 100 ta teng katakka bo'lamiz. Bitta katak — butunning yuzdan biri."
    },
    btn_step: { ru: 'Закрасить клетку', uz: "Katakni bo'yash" },
    cells: {
      ru: ['Нажми кнопку и закрашивай по одной.', '1 клетка из 100 — это 1% = 1/100 = 0,01.', '2 клетки — 2%, сотых две.', '3 клетки — 3%.', '4 клетки — 4%.', '5 клеток — 5%.', '6 клеток — 6%.', '7 клеток — 7%.', 'Ещё одна — и будет девять.'],
      uz: ["Tugmani bosing va bittadan bo'yang.", "100 dan 1 katak — bu 1% = 1/100 = 0,01.", "2 katak — 2%, yuzdan ikki.", "3 katak — 3%.", "4 katak — 4%.", "5 katak — 5%.", "6 katak — 6%.", "7 katak — 7%.", "Yana bitta — to'qqiz bo'ladi."]
    },
    note: {
      ru: '9 клеток из ста — это 9%, то есть 9/100 = 0,09. Процент — это всегда доля из ста.',
      uz: "Yuzdan 9 ta katak — bu 9%, ya'ni 9/100 = 0,09. Foiz — bu doim yuzdan olingan ulush."
    },
    audio: {
      intro: {
        ru: 'Это целое, разделённое на сто равных клеток. Нажимай и закрашивай по одной. Одна клетка из ста это один процент, то есть одна сотая.',
        uz: "Bu butun yuzta teng katakka bo'lingan. Bosing va bittadan bo'yang. Yuzdan bitta katak, bu bir foiz, ya'ni yuzdan bir."
      },
      done: {
        ru: 'Девять клеток это девять процентов, то есть девять сотых. Процент это всегда доля из ста.',
        uz: "To'qqizta katak, bu to'qqiz foiz, ya'ni yuzdan to'qqiz. Foiz doim yuzdan olingan ulush."
      }
    }
  },

  // ---- s3 EXPLORATION — jonli slayder, to'rt shakl morflanadi; 100% = butun ----
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Одно число — четыре записи', uz: "Bitta son — to'rt yozuv" },
    lead: {
      ru: 'Теперь подвигай ползунок. Сколько клеток закрашено — столько и процентов. Смотри, как меняются четыре записи одного числа.',
      uz: "Endi slayderni suring. Nechta katak bo'yalsa — shuncha foiz. Bitta sonning to'rt yozuvi qanday o'zgarishini kuzating."
    },
    hint_move: {
      ru: 'Процент, дробь со знаменателем 100, сокращённая дробь и десятичная дробь — это одно число.',
      uz: "Foiz, maxraji 100 bo'lgan kasr, qisqartirilgan kasr va o'nli kasr — bu bitta son."
    },
    note_full: {
      ru: '100% — это все сто клеток, то есть целое.',
      uz: "100% — bu barcha yuzta katak, ya'ni butun."
    },
    audio: {
      ru: 'Двигай ползунок и следи за подписями. Двадцать процентов это двадцать сотых, после сокращения одна пятая, а десятичной дробью ноль целых две десятых. Это одно и то же число в четырёх записях. Доведи до конца: сто процентов это все клетки, целое.',
      uz: "Slayderni suring va yozuvlarni kuzating. Yigirma foiz, bu yuzdan yigirma, qisqartirilganda beshdan bir, o'nli kasrda esa nol butun o'ndan ikki. Bu, to'rt yozuvdagi bitta son. Oxirigacha suring: yuz foiz, bu barcha kataklar, butun."
    }
  },

  // ---- s4 RULE 1 — N% = N/100, to'rt ko'rinish (oson 20%, qiyin 45%) ----
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Процент — это сотая', uz: "Foiz — yuzdan ulush" },
    lead: {
      ru: 'Итак, процент — это сотая доля. Значит, любой процент легко записать дробью и десятичной дробью.',
      uz: "Demak, foiz — bu yuzdan ulush. Demak, har qanday foizni kasr va o'nli kasr bilan oson yozish mumkin."
    },
    rule_main: { ru: 'N процентов = N/100', uz: "N foiz = N/100" },
    ex_easy: { ru: 'Просто: 20% = 20/100 = 1/5 = 0,2', uz: "Oson: 20% = 20/100 = 1/5 = 0,2" },
    ex_hard: { ru: 'Сложнее: 45% = 45/100 = 9/20 = 0,45', uz: "Qiyinroq: 45% = 45/100 = 9/20 = 0,45" },
    note: {
      ru: 'Сначала пишем дробь со знаменателем 100, потом при желании сокращаем.',
      uz: "Avval maxraji 100 bo'lgan kasrni yozamiz, keyin istasak qisqartiramiz."
    },
    audio: {
      ru: 'Любой процент это число сотых. Эн процентов равно эн сотым. Например, сорок пять процентов это сорок пять сотых. Сократим до девяти двадцатых, а десятичной дробью это ноль целых сорок пять сотых. Одно число, три записи.',
      uz: "Har qanday foiz, bu yuzdan ulushlar soni. En foiz teng yuzdan en. Masalan, qirq besh foiz, bu yuzdan qirq besh. Yigirmadan to'qqizgacha qisqartiramiz, o'nli kasr bilan esa nol butun yuzdan qirq besh. Bitta son, uchta yozuv."
    }
  },

  // ---- s5 RULE 2 — M2 chuqur (100% = butun, nisbat) + M1 (foiz = kasr) ----
  s5: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    title: { ru: '100% — это целое', uz: "100% — bu butun" },
    lead: {
      ru: 'Но будь внимателен: 100% — это не всегда одно и то же количество.',
      uz: "Lekin ehtiyot bo'ling: 100% — bu har doim bir xil miqdor emas."
    },
    point1: {
      ru: '100% — это целое, всё. А каким будет это целое — зависит от того, о чём речь.',
      uz: "100% — bu butun, hammasi. Bu butun qanday bo'lishi esa nima haqida gap ketayotganiga bog'liq."
    },
    point2: {
      ru: 'Половина большого стакана и половина маленького — обе 50%, хотя воды в них разное количество. Процент — это отношение, а не само количество.',
      uz: "Katta stakanning yarmi va kichigining yarmi — ikkalasi ham 50%, garchi suv miqdori har xil. Foiz — bu nisbat, miqdorning o'zi emas."
    },
    point3: {
      ru: 'И ещё: процент — это не отдельный мир. Это обыкновенная дробь со знаменателем 100.',
      uz: "Va yana: foiz — alohida dunyo emas. Bu maxraji 100 bo'lgan oddiy kasr."
    },
    audio: {
      ru: 'Запомни два важных момента. Сто процентов это целое, но величина целого бывает разной. Половина большого стакана и половина маленького обе равны пятидесяти процентам, хотя воды в них разное количество. Поэтому процент это отношение, а не само количество. И второе: процент это обычная дробь со знаменателем сто, а не что-то отдельное.',
      uz: "Ikki muhim narsani eslab qoling. Yuz foiz, bu butun, lekin butunning kattaligi har xil bo'ladi. Katta stakanning yarmi va kichigining yarmi ikkalasi ham ellik foizga teng, garchi suv miqdori har xil. Shuning uchun foiz, bu nisbat, miqdorning o'zi emas. Ikkinchidan: foiz, maxraji yuz bo'lgan oddiy kasr, alohida narsa emas."
    }
  },

  // ---- s6 TEST MC — 45% = 9/20 (qisqartirish). practice + FAKT etimologiya. correct B ----
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Процент в дробь', uz: "Foizni kasrga" },
    lead: {
      ru: 'Какой обыкновенной дроби равны 45%? Выбери сокращённую запись.',
      uz: "45% qaysi oddiy kasrga teng? Qisqartirilgan yozuvni tanlang."
    },
    opt0: { ru: '9/20', uz: '9/20' },
    opt1: { ru: '9/25', uz: '9/25' },
    opt2: { ru: '1/2', uz: '1/2' },
    opt3: { ru: '9/100', uz: '9/100' },
    correct_text: {
      ru: 'Верно. 45% = 45/100, сокращаем на 5 — получаем 9/20.',
      uz: "To'g'ri. 45% = 45/100, 5 ga qisqartiramiz — 9/20 chiqadi."
    },
    wrong_0: {
      ru: 'Знаменатель не тот. 9/25 — это 36/100, то есть 36%, а нам нужно 45%. Дели 45/100 на 5: и числитель, и знаменатель.',
      uz: "Maxraj noto'g'ri. 9/25 — bu 36/100, ya'ni 36%, bizga esa 45% kerak. 45/100 ni 5 ga bo'ling: ham suratni, ham maxrajni."
    },
    wrong_1: {
      ru: '1/2 — это 50%, а не 45%. Числа близкие, но не равны. Запиши 45/100 и сократи точно.',
      uz: "1/2 — bu 50%, 45% emas. Sonlar yaqin, lekin teng emas. 45/100 ni yozing va aniq qisqartiring."
    },
    wrong_2: {
      ru: 'Здесь потерян ноль. 9/100 — это 9%, а не 45%. Сначала 45/100, потом сокращай на 5.',
      uz: "Bu yerda nol tushib qolgan. 9/100 — bu 9%, 45% emas. Avval 45/100, keyin 5 ga qisqartiring."
    },
    fact: {
      ru: 'Слово процент идёт от латинского per centum — за сотню. И сам знак процента вырос из числа 100.',
      uz: "Foiz so'zi lotincha per centum — yuzdan degani. Foiz belgisi ham 100 sonidan o'sib chiqqan."
    },
    audio: {
      intro: {
        ru: 'Сорок пять процентов это какая обыкновенная дробь? Выбери сокращённый вариант.',
        uz: "Qirq besh foiz qaysi oddiy kasr? Qisqartirilgan variantni tanlang."
      },
      on_correct: {
        ru: 'Верно, девять двадцатых. Кстати, слово процент с латыни и значит за сотню.',
        uz: "To'g'ri, yigirmadan to'qqiz. Aytgancha, foiz so'zi lotincha yuzdan degani."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s7 TEST fill-blank — 7/20 = box% -> 35. practice ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Дробь в процент', uz: "Kasrni foizga" },
    lead: {
      ru: 'Двигаемся в обратную сторону: от дроби к проценту. Заполни пропуск.',
      uz: "Teskari tomonga boramiz: kasrdan foizga. Bo'sh joyni to'ldiring."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Приведи 7/20 к знаменателю 100. Умножь и числитель, и знаменатель на 5: 20 станет 100.',
      uz: "7/20 ni 100 maxrajiga keltiring. Ham suratni, ham maxrajni 5 ga ko'paytiring: 20 — 100 bo'ladi."
    },
    fb_correct: { ru: 'Верно. 7/20 = 35/100 = 35%.', uz: "To'g'ri. 7/20 = 35/100 = 35%." },
    audio: {
      intro: {
        ru: 'Семь двадцатых это сколько процентов? Приведи к сотым и введи число.',
        uz: "Yigirmadan yetti, bu necha foiz? Yuzdan ulushga keltiring va sonni kiriting."
      },
      on_correct: { ru: 'Верно. Тридцать пять процентов.', uz: "To'g'ri. O'ttiz besh foiz." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s8 TEST classify — savatlar = 1/2 / != 1/2. practice (M1 sindirgich) ----
  s8: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Найди половину', uz: "Yarmini toping" },
    lead: {
      ru: 'Одно число прячется в разных одеждах. Разложи карточки: какие равны 1/2, а какие нет.',
      uz: "Bitta son har xil kiyimda yashirinadi. Kartalarni ajrating: qaysilari 1/2 ga teng, qaysilari yo'q."
    },
    bin_eq:  { ru: 'Равно 1/2', uz: "1/2 ga teng" },
    bin_neq: { ru: 'Не равно 1/2', uz: "1/2 ga teng emas" },
    cards: [
      { id: 'c1', label: { ru: '50%',     uz: '50%' },     bin: 'eq'  },
      { id: 'c2', label: { ru: '0,5',     uz: '0,5' },     bin: 'eq'  },
      { id: 'c3', label: { ru: '150/300', uz: '150/300' }, bin: 'eq'  },
      { id: 'c4', label: { ru: '5/100',   uz: '5/100' },   bin: 'neq' },
      { id: 'c5', label: { ru: '0,05',    uz: '0,05' },    bin: 'neq' },
      { id: 'c6', label: { ru: '2/5',     uz: '2/5' },     bin: 'neq' }
    ],
    tap_hint: { ru: 'Нажми карточку, потом — корзину.', uz: "Kartani bosing, keyin — savatni." },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Переведи каждую карточку в проценты или в сотые. Половина — это 50%, то есть 50/100 или 0,5.',
      uz: "Har kartani foizga yoki yuzdan ulushga aylantiring. Yarmi — bu 50%, ya'ni 50/100 yoki 0,5."
    },
    fb_correct: {
      ru: 'Верно. 50%, 0,5 и 150/300 — это всё половина. А 5/100, 0,05 и 2/5 — нет.',
      uz: "To'g'ri. 50%, 0,5 va 150/300 — bularning hammasi yarmi. 5/100, 0,05 va 2/5 esa — yo'q."
    },
    audio: {
      intro: {
        ru: 'Разложи карточки по корзинам: какие равны одной второй, а какие нет. Потом нажми проверить.',
        uz: "Kartalarni savatlarga ajrating: qaysilari ikkidan birga teng, qaysilari yo'q. Keyin tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. Пятьдесят процентов, ноль целых пять десятых и сто пятьдесят из трёхсот это одна и та же половина.',
        uz: "To'g'ri. Ellik foiz, nol butun o'ndan besh va uch yuzdan bir yuz ellik bu o'sha bitta yarmi."
      },
      on_wrong: { ru: 'Пока не всё верно. Посмотри подсказку.', uz: "Hozircha hammasi to'g'ri emas. Maslahatga qarang." }
    }
  },

  // ---- s9 TEST NumInput — 130/200 = ?% -> 65. practice (3 xonali butun) ----
  s9: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Доля в процентах', uz: "Ulush foizda" },
    question: {
      ru: 'В зале 200 мест, заняты 130. Сколько это процентов?',
      uz: "Zalda 200 o'rindiq bor, 130 tasi band. Bu necha foiz?"
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Приведи 130/200 к сотым. Раздели и числитель, и знаменатель на 2: 200 станет 100, а 130 станет 65.',
      uz: "130/200 ni yuzdan ulushga keltiring. Ham suratni, ham maxrajni 2 ga bo'ling: 200 — 100 bo'ladi, 130 esa — 65."
    },
    fb_correct: { ru: 'Верно. 130/200 = 65/100 = 65%.', uz: "To'g'ri. 130/200 = 65/100 = 65%." },
    audio: {
      intro: {
        ru: 'В зале двести мест, заняты сто тридцать. Сколько это процентов? Приведи к сотым и введи число.',
        uz: "Zalda ikki yuz o'rindiq, bir yuz o'ttiztasi band. Bu necha foiz? Yuzdan ulushga keltiring va sonni kiriting."
      },
      on_correct: { ru: 'Верно. Шестьдесят пять процентов.', uz: "To'g'ri. Oltmish besh foiz." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s10 TEST find-the-wrong — XATO tenglikni top. practice + FAKT batareya. correct C ----
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni top' },
    title: { ru: 'Неверное равенство', uz: "Xato tenglik" },
    q_pre: { ru: 'Одно из равенств ', uz: 'Tengliklardan biri ' },
    q_em:  { ru: 'ОШИБОЧНО', uz: 'XATO' },
    q_post: { ru: '. Найди именно его.', uz: '. Aynan o\'shani toping.' },
    opt0: { ru: '150/200 = 75%', uz: '150/200 = 75%' },
    opt1: { ru: '0,6 = 60%', uz: '0,6 = 60%' },
    opt2: { ru: '1/4 = 25%', uz: '1/4 = 25%' },
    opt3: { ru: '3/5 = 35%', uz: '3/5 = 35%' },
    correct_text: {
      ru: 'Верно, это и есть ошибка. 3/5 = 60/100 = 60%, а не 35%.',
      uz: "To'g'ri, xato shu. 3/5 = 60/100 = 60%, 35% emas."
    },
    wrong_0: {
      ru: 'Это равенство верное: 150/200 = 75/100 = 75%. Ошибка в другом варианте.',
      uz: "Bu tenglik to'g'ri: 150/200 = 75/100 = 75%. Xato boshqa variantda."
    },
    wrong_1: {
      ru: 'Это равенство верное: 0,6 — это шесть десятых, то есть 60/100 = 60%. Ищи ошибку дальше.',
      uz: "Bu tenglik to'g'ri: 0,6 — o'ndan olti, ya'ni 60/100 = 60%. Xatoni boshqa joydan qidiring."
    },
    wrong_2: {
      ru: 'Это равенство верное: 1/4 = 25/100 = 25%. Ошибка не здесь.',
      uz: "Bu tenglik to'g'ri: 1/4 = 25/100 = 25%. Xato bu yerda emas."
    },
    fact: {
      ru: 'Заряд телефона тоже в процентах: 100% — батарея полная, 0% — пустая. Каждый процент — сотая доля ёмкости.',
      uz: "Telefon zaryadi ham foizda: 100% — batareya to'la, 0% — bo'sh. Har foiz — sig'imning yuzdan biri."
    },
    audio: {
      intro: {
        ru: 'Здесь вопрос наоборот. Одно равенство ошибочно. Найди именно ошибочное и выбери его.',
        uz: "Bu yerda savol teskari. Bitta tenglik xato. Aynan xato bo'lganini toping va tanlang."
      },
      on_correct: {
        ru: 'Верно. Три пятых это шестьдесят процентов, а не тридцать пять. Кстати, заряд телефона тоже доля из ста.',
        uz: "To'g'ri. Beshdan uch, bu oltmish foiz, o'ttiz besh emas. Aytgancha, telefon zaryadi ham yuzdan ulush."
      },
      on_wrong: { ru: 'Это равенство верное. Ошибка в другом.', uz: "Bu tenglik to'g'ri. Xato boshqasida." }
    }
  },

  // ---- s11 CASE setup — Nafisa, ikki sinf olimpiada bali (3 xonali) ----
  s11: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Сравним два класса', uz: "Ikki sinfni solishtiramiz" },
    lead: {
      ru: 'Нафиса посмотрела результаты двух классов на олимпиаде. Баллы разные, и максимум у классов разный.',
      uz: "Nafisa ikki sinfning olimpiada natijasini ko'rdi. Ballar har xil, sinflarning maksimal bali ham har xil."
    },
    labelA: { ru: 'Класс 7-А', uz: '7-A sinf' },
    labelB: { ru: 'Класс 7-Б', uz: '7-B sinf' },
    note: {
      ru: 'Чтобы сравнить честно, переведём каждый результат в проценты.',
      uz: "Halol solishtirish uchun har natijani foizga aylantiramiz."
    },
    hint_calc: {
      ru: '7-А: 180/240 = 3/4 = 75/100. 7-Б: 210/300 = 7/10 = 70/100.',
      uz: "7-A: 180/240 = 3/4 = 75/100. 7-B: 210/300 = 7/10 = 70/100."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: 'Нафиса смотрит результаты двух классов. Класс семь А набрал сто восемьдесят баллов из двухсот сорока. Класс семь Б набрал двести десять из трёхсот. Баллы большие и разные, поэтому сравним их в процентах. Сократи каждую дробь и приведи к сотым.',
      uz: "Nafisa ikki sinf natijasini ko'radi. Yetti A sinf ikki yuz qirq balldan bir yuz sakson ball to'pladi. Yetti B sinf uch yuzdan ikki yuz o'n ball to'pladi. Ballar katta va har xil, shuning uchun ularni foizda solishtiramiz. Har kasrni qisqartiring va yuzdan ulushga keltiring."
    }
  },

  // ---- s12 CASE/FINAL MC — qaysi sinf natijasi yaxshiroq? -> 7-A (75%). final + FAKT. correct D ----
  s12: {
    eyebrow: { ru: 'Итог задачи', uz: 'Masala yakuni' },
    title: { ru: 'Чей результат лучше', uz: "Kimning natijasi yaxshi" },
    lead: {
      ru: 'В каком классе результат лучше? 7-А: 180 из 240. 7-Б: 210 из 300.',
      uz: "Qaysi sinf natijasi yaxshiroq? 7-A: 240 dan 180. 7-B: 300 dan 210."
    },
    opt0: { ru: 'Класс 7-А — это 75%', uz: "7-A sinf — bu 75%" },
    opt1: { ru: 'Класс 7-Б — это 70%', uz: "7-B sinf — bu 70%" },
    opt2: { ru: 'Поровну', uz: "Bir xil" },
    opt3: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    correct_text: {
      ru: 'Верно. 180/240 = 75%, а 210/300 = 70%. У класса 7-А результат выше.',
      uz: "To'g'ri. 180/240 = 75%, 210/300 esa = 70%. 7-A sinf natijasi yuqoriroq."
    },
    wrong_0: {
      ru: 'У класса 7-Б больше баллов по числу, но и максимум больше. В долях это 70%, а у 7-А 75%. Сравнивай проценты, а не количество.',
      uz: "7-B sinfda son jihatdan ko'proq ball, lekin maksimal bal ham kattaroq. Ulushda bu 70%, 7-A da esa 75%. Miqdorni emas, foizni solishtiring."
    },
    wrong_1: {
      ru: 'Не поровну. 75% и 70% — это разные доли. Приведи обе дроби к сотым и сравни.',
      uz: "Bir xil emas. 75% va 70% — har xil ulushlar. Ikkala kasrni yuzdan ulushga keltiring va solishtiring."
    },
    wrong_2: {
      ru: 'Определить можно — для этого и нужны проценты. Переведи обе доли к знаменателю 100.',
      uz: "Aniqlash mumkin — foiz aynan shuning uchun kerak. Ikkala ulushni 100 maxrajiga keltiring."
    },
    fact: {
      ru: 'Тело человека примерно на 60% состоит из воды. Это тоже доля из ста.',
      uz: "Inson tanasi taxminan 60% suvdan iborat. Bu ham — yuzdan ulush."
    },
    audio: {
      intro: {
        ru: 'В каком классе результат лучше? Сравни доли в процентах и выбери ответ.',
        uz: "Qaysi sinf natijasi yaxshiroq? Ulushlarni foizda solishtiring va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Семьдесят пять процентов больше семидесяти. Кстати, тело человека почти на шестьдесят процентов из воды.',
        uz: "To'g'ri. Yetmish besh foiz yetmishdan katta. Aytgancha, inson tanasi deyarli oltmish foiz suvdan iborat."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s13 SUMMARY — batareya hookini yopadi + ConnectionsBlock ----
  s13: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: {
      ru: 'Вернёмся к загадке Рустама.',
      uz: "Rustam topishmog'iga qaytamiz."
    },
    main_label: { ru: 'Главное', uz: 'Asosiy' },
    main_1: { ru: 'Процент — это сотая доля: 1% = 1/100 = 0,01.', uz: "Foiz — bu yuzdan ulush: 1% = 1/100 = 0,01." },
    main_2: {
      ru: 'Одно число можно записать четырьмя способами: процентом, дробью /100, сокращённой дробью и десятичной дробью.',
      uz: "Bitta sonni to'rt usulda yozish mumkin: foiz, /100 kasr, qisqartirilgan kasr va o'nli kasr."
    },
    main_3: {
      ru: '100% — это целое, а процент это отношение, а не само количество.',
      uz: "100% — bu butun, foiz esa — nisbat, miqdorning o'zi emas."
    },
    hook_close: {
      ru: 'Оба заряда по 50% — но это половина разных батарей, поэтому энергии в них разное количество.',
      uz: "Ikkala zaryad ham 50% — lekin bu har xil batareyalarning yarmi, shuning uchun energiya miqdori har xil."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: '«Дробь — часть целого», «Сокращение дробей», «Эквивалентные дроби», «Десятичная дробь — концепт».',
      uz: "«Kasr — butunning qismi», «Kasrlarni qisqartirish», «Ekvivalent kasrlar», «O'nli kasr — tushuncha»."
    },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'нахождение процента от числа: 20% от 50.',
      uz: "sonning foizini topish: 50 ning 20 foizi."
    },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: {
      ru: 'Подведём итог. Процент это сотая доля: один процент это одна сотая или ноль целых одна сотая. Одно число можно записать процентом, дробью со знаменателем сто, сокращённой дробью и десятичной дробью. А сто процентов это целое, и процент это отношение, а не само количество. Поэтому у Рустама оба заряда по пятьдесят процентов, но энергия в них разная.',
      uz: "Xulosa qilamiz. Foiz, bu yuzdan ulush: bir foiz, bu yuzdan bir yoki nol butun yuzdan bir. Bitta sonni foiz, maxraji yuz bo'lgan kasr, qisqartirilgan kasr va o'nli kasr bilan yozish mumkin. Yuz foiz esa, bu butun, foiz, nisbat, miqdorning o'zi emas. Shuning uchun Rustamda ikkala zaryad ham ellik foiz, lekin ulardagi energiya har xil."
    }
  }

};

// ============================================================
// МАJBURIY ЁRDAMCHILAR (infrastructure_v1 / Dars24 bilan baytma-bayt)
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

// Устойчивая проверка ответа ПО ЗНАЧЕНИЮ: целые/десятичные (0,5=0.5) и дроби (4/6=2/3).
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

// Иконки ✓/✗ — feedback не только цветом (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// Ambient-движение для разрежённых экранов (правила, summary): мягкие плавающие круги.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста (после верного).
// ============================================================
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука',    uz: "Bilasizmi? · Fan" };

const AnimPercent = () => (<div className="fa-pc"><span className="fa-pc-num">100</span><span className="fa-pc-sign">%</span></div>);
const AnimBat = () => (<div className="fa-bt"><div className="fa-bt-fill"/><span className="fa-bt-tip"/></div>);
const AnimBody = () => (<div className="fa-wb"><div className="fa-wb-fill"/><span className="fa-wb-mark">60%</span></div>);

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
// ВИЗУАЛИЗАТОРЫ — perc_5_01 (PercentGrid, FourForms, BatteryHook)
// ============================================================
const pgGcd = (a, b) => (b ? pgGcd(b, a % b) : a);
const pctDec = (n) => n === 0 ? '0' : (n === 100 ? '1' : (n % 10 === 0 ? `0,${n / 10}` : `0,${String(n).padStart(2, '0')}`));

// 10x10 = 100 katakli setka; bo'yalgan kataklar = foiz.
const PercentGrid = ({ shaded = 0, live = false, alive = false, glow = false }) => {
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const on = i < shaded;
    const pop = on && !live && !alive; // staggered entrance только для статичной сетки
    cells.push(<span key={i} className={`pg-cell${on ? ' pg-on' : ''}${pop ? ' pg-pop' : ''}`} style={pop ? { animationDelay: `${(i % 20) * 0.012}s` } : undefined}/>);
  }
  return <div className={`pg-grid${alive ? ' pg-alive' : ''}${live ? ' pg-live' : ''}${glow ? ' pg-pulse' : ''}`} aria-hidden="true">{cells}</div>;
};

// To'rt shakl: N% = N/100 = qisqartirilgan = o'nli.
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

// Hook: ikki har xil o'lchamli batareya, ikkalasi 50% gacha to'ladi (CSS loop).
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

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// s0 — HOOK (batareya). Возврат: полный сброс picked.
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
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(14px, 2.6vw, 20px) clamp(10px, 2vw, 16px)', display: 'flex', justifyContent: 'center' }}>
          <BatteryHook/>
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

// s1 — WARM-UP (spaced retrieval, не scored) через QuestionScreen (correct A)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (100-katak, TAP-PACED: har bosishda +1 katak; bo'yalgan kataklar yo'qolmaydi)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const MAX = 9;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [filled, setFilled] = useState(0);
  const doneRef = useRef(false);
  const done = filled >= MAX;
  const add = () => {
    if (filled >= MAX) return;
    const nv = filled + 1;
    setFilled(nv);
    if (nv >= MAX && !doneRef.current) {
      doneRef.current = true;
      if (!audio.muted) { const e = getAudioEngine(); if (e) setTimeout(() => e.pushOneOff(c.audio.done[lang]), 200); }
    }
  };
  const caps = c.cells[lang] || c.cells.ru;
  const cap = done ? t(c.note) : caps[Math.min(filled, caps.length - 1)];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={filled < 1} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up pg-pulse' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
          <PercentGrid shaded={filled} alive={true} glow={done}/>
          <FourForms n={filled}/>
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={add} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.accent, fontWeight: 600 }}>{mt(cap)}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (jonli slayder, to'rt shakl)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [n, setN] = useState(20);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <PercentGrid shaded={n} live={true} glow={n === 100}/>
          <FourForms n={n}/>
        </div>
        <div className="fade-up delay-2"><Slider value={n} min={0} max={100} step={1} onChange={setN}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: n === 100 ? T.success : T.ink2, fontWeight: n === 100 ? 600 : 400 }}>{mt(t(n === 100 ? c.note_full : c.hint_move))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE 1 (N% = N/100) + ambient
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <div style={{ display: 'flex', gap: 'clamp(12px, 2.6vw, 22px)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <PercentGrid shaded={45} glow={true}/>
            <FourForms n={45}/>
          </div>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (M2 chuqur + M1) + ambient + ikki stakan
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point1))}</p>
        </div>
        <div className="frame-soft fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="58" height="48" viewBox="0 0 58 48" style={{ flexShrink: 0 }} aria-hidden="true">
            <rect x="6" y="8" width="18" height="34" rx="3" fill="none" stroke="#FF4F28" strokeWidth="2"/>
            <rect x="7" y="25" width="16" height="16" rx="2" fill="rgba(255,79,40,0.35)"/>
            <rect x="34" y="16" width="14" height="26" rx="3" fill="none" stroke="#FF4F28" strokeWidth="2"/>
            <rect x="35" y="29" width="12" height="12" rx="2" fill="rgba(255,79,40,0.35)"/>
          </svg>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point2))}</p>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point3))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST MC: 45% -> 9/20 (correct B) + Факт этимология
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 1, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.lead))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><PercentGrid shaded={45}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPercent/>}/>}/>;
};

// s7 — TEST fill-blank: 7/20 = box% -> 35
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const TARGET = '35';
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
      onAnswer({ stage: SCREEN_META[7].scope, screenIdx: 7, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.6vw, 12px)', flexWrap: 'wrap' }}>
          <Frac n="7" d="20" size="mid"/>
          <span className="mop" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>=</span>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
            onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(90px, 20vw, 120px)' }}/>
          <span className="mop" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>%</span>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#A07D14' }}><IconNo/></span>
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

// s8 — TEST classify: 1/2 ga teng / teng emas (tap-card-then-bin, веди-до-верного)
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [place, setPlace] = useState(() => { const o = {}; c.cards.forEach(cd => { o[cd.id] = wasSolved ? cd.bin : null; }); return o; });
  const [sel, setSel] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [flash, setFlash] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const tapCard = (id) => { if (solved) return; setSel(s => s === id ? null : id); };
  const assign = (bin) => { if (solved || !sel) return; setPlace(p => ({ ...p, [sel]: bin })); setSel(null); };
  const allPlaced = c.cards.every(cd => place[cd.id] !== null);
  const tray = c.cards.filter(cd => place[cd.id] === null);
  const inBin = (bin) => c.cards.filter(cd => place[cd.id] === bin);
  const check = () => {
    if (solved || !allPlaced) return;
    const wrong = c.cards.filter(cd => place[cd.id] !== cd.bin);
    const ok = wrong.length === 0;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.lead[lang], correctAnswer: 'eq: 50%, 0,5, 150/300', studentAnswer: 'classified', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setFlash(new Set(wrong.map(cd => cd.id)));
      setTimeout(() => { setPlace(p => { const n = { ...p }; wrong.forEach(cd => { n[cd.id] = null; }); return n; }); setFlash(new Set()); }, 700);
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const chip = (cd) => (
    <button key={cd.id} className={`cl-card${sel === cd.id ? ' cl-sel' : ''}${flash.has(cd.id) ? ' cl-bad' : ''}${solved ? ' cl-ok' : ''}`} disabled={solved} onClick={() => tapCard(cd.id)}>
      {solved && <IconOk/>}{mt(t(cd.label))}
    </button>
  );
  const binBox = (bin, label) => (
    <div className={`cl-bin${sel ? ' cl-bin-active' : ''}`} onClick={() => { if (sel) assign(bin); }} role="button" tabIndex={0}>
      <span className="cl-bin-label">{t(label)}</span>
      <div className="cl-bin-cards">{inBin(bin).map(cd => chip(cd))}</div>
    </div>
  );
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="cl-tray fade-up delay-1">{tray.length ? tray.map(cd => chip(cd)) : <span className="small" style={{ color: T.ink3 }}>{t(c.tap_hint)}</span>}</div>
        <div className="cl-bins fade-up delay-2">
          {binBox('eq', c.bin_eq)}
          {binBox('neq', c.bin_neq)}
        </div>
        {allPlaced && !solved && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {!solved && !allPlaced && <p className="small fade-up" style={{ margin: 0, color: T.ink3, textAlign: 'center' }}>{t(c.tap_hint)}</p>}
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

// s9 — TEST NumInput: 130/200 = 65%
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={65} renderVisual={() => <Frac n="130" d="200" size="display"/>}/>;
};

// s10 — TEST find-the-wrong (correct C) + Факт батарея
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 3, [0, 1, 3, 2]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.q_pre)} <span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2></>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimBat/>}/>}/>;
};

// s11 — CASE setup (Nafisa, ikki sinf olimpiada bali)
const Screen11 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  const card = (label, n, d) => (
    <div className="frame" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', minWidth: 130 }}>
      <p className="small mono" style={{ margin: 0, color: T.ink2 }}>{t(label)}</p>
      <Frac n={n} d={d} size="mid"/>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', gap: 'clamp(12px, 2.6vw, 22px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {card(c.labelA, '180', '240')}
          {card(c.labelB, '210', '300')}
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ display: 'flex', gap: 8 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s12 — CASE solve / FINAL (correct D) + Факт тело-вода
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (
    <><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.lead))}</h2>
    <div className="frame" style={{ marginTop: 10, display: 'flex', gap: 'clamp(12px, 2.6vw, 22px)', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Frac n="180" d="240" size="mid"/>
      <Frac n="210" d="300" size="mid"/>
    </div></>
  );
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimBody/>}/>}/>;
};

// s13 — SUMMARY + закрытие hook + связи + ambient
const Screen13 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)', justifyContent: 'center' }}>
        <Floaters/>
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

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
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
/* MATH: ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста. */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

/* MATH perc_5_01: PercentGrid — 10x10 = 100 katakli setka (foiz = yuzdan ulush). */
.pg-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: clamp(1px, 0.4vw, 3px); width: clamp(112px, 24vw, 168px); aspect-ratio: 1 / 1; }
.pg-cell { width: 100%; aspect-ratio: 1 / 1; border-radius: 2px; background: rgba(255, 79, 40, 0.10); transition: background 0.12s ease-out; }
.pg-on { background: #FF4F28; }
.pg-pop { animation: pgPop 0.34s cubic-bezier(0.34, 1.2, 0.64, 1); }
@keyframes pgPop { 0% { opacity: 0; transform: scale(0.4); } 100% { opacity: 1; transform: scale(1); } }
/* alive: bo'yalgan katak kirib keladi (pop) + doimiy jonli puls (shine) — bosishda yo'qolmaydi */
.pg-alive .pg-on { animation: pgPop 0.4s cubic-bezier(0.34, 1.2, 0.64, 1), pgShine 2.4s ease-in-out 0.4s infinite; }
@keyframes pgShine { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.18); } }
.pg-live .pg-cell { transition: background 0.12s ease-out; }
.pg-pulse { animation: pgGlow 0.7s ease; }
@keyframes pgGlow { 0% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(255, 79, 40, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(255, 79, 40, 0)); } }
.pg-forms { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); flex-wrap: wrap; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.4vw, 18px); font-weight: 600; color: #0E0E10; }
.pg-forms b { font-weight: 700; color: #FF4F28; }

/* MATH perc_5_01: BatteryHook — ikki har xil o'lchamli batareya, ikkalasi 50% (CSS loop). */
.bh-wrap { display: flex; gap: clamp(16px, 4vw, 30px); align-items: flex-end; justify-content: center; }
.bh-one { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.bh-bat { position: relative; border: 2.5px solid #5A5A60; border-radius: 6px; padding: 3px; display: flex; align-items: stretch; }
.bh-big { width: clamp(90px, 20vw, 120px); height: clamp(44px, 9vw, 56px); }
.bh-small { width: clamp(56px, 13vw, 76px); height: clamp(30px, 6.5vw, 40px); }
.bh-tip { position: absolute; right: -7px; top: 50%; transform: translateY(-50%); width: 4px; height: 40%; background: #5A5A60; border-radius: 0 2px 2px 0; }
.bh-fill { width: 0; border-radius: 3px; background: linear-gradient(90deg, #FF8A66, #FF4F28); animation: bhFill 3.6s ease-in-out infinite; }
@keyframes bhFill { 0% { width: 0; } 35% { width: 50%; } 80% { width: 50%; } 100% { width: 0; } }
.bh-pct { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.2vw, 16px); color: #FF4F28; }

/* MATH perc_5_01: classify — tap-card-then-bin (1/2 ga teng / teng emas). */
.cl-tray { display: flex; flex-wrap: wrap; gap: clamp(6px, 1.4vw, 10px); justify-content: center; min-height: clamp(44px, 9vw, 54px); align-items: center; }
.cl-card { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.4vw, 18px); background: #FFFFFF; color: #0E0E10; border: none; border-radius: 10px; padding: clamp(8px, 1.6vw, 11px) clamp(12px, 2.2vw, 16px); cursor: pointer; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.16); display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; }
.cl-card:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.24); }
.cl-card:disabled { cursor: default; }
.cl-sel { box-shadow: 0 0 0 2px #FF4F28, 0 8px 20px -6px rgba(255, 79, 40, 0.4) !important; }
.cl-bad { background: #FFE8E1 !important; color: #FF4F28 !important; animation: clShake 0.4s; }
@keyframes clShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
.cl-ok { background: #E3F0E8 !important; color: #1F7A4D !important; }
.cl-bins { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px, 2vw, 16px); }
.cl-bin { background: rgba(58, 53, 48, 0.04); border: 2px dashed rgba(167, 166, 162, 0.6); border-radius: 14px; padding: clamp(10px, 2vw, 14px); min-height: clamp(86px, 16vw, 110px); cursor: default; display: flex; flex-direction: column; gap: 8px; transition: all 0.15s; }
.cl-bin-active { border-color: #FF4F28; background: rgba(255, 79, 40, 0.05); cursor: pointer; }
.cl-bin-label { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: clamp(11px, 1.5vw, 13px); color: #5A5A60; text-transform: uppercase; letter-spacing: 0.06em; }
.cl-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; }

/* MATH perc_5_01: факт-анимации (CSS-only loop, КРУПНЫЕ). */
.fa-pc { position: relative; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #019ACB; }
.fa-pc-num { font-size: clamp(20px, 4vw, 30px); animation: faPcNum 2.8s ease-in-out infinite; }
.fa-pc-sign { position: absolute; font-size: clamp(34px, 7vw, 52px); animation: faPcSign 2.8s ease-in-out infinite; }
@keyframes faPcNum { 0%, 30% { opacity: 1; transform: scale(1); } 55%, 100% { opacity: 0; transform: scale(0.6); } }
@keyframes faPcSign { 0%, 35% { opacity: 0; transform: scale(0.6); } 60%, 100% { opacity: 1; transform: scale(1); } }
.fa-bt { position: relative; width: clamp(64px, 13vw, 92px); height: clamp(34px, 7vw, 48px); border: 2.5px solid #019ACB; border-radius: 6px; padding: 3px; display: flex; align-items: stretch; }
.fa-bt::after { content: ''; position: absolute; right: -7px; top: 50%; transform: translateY(-50%); width: 4px; height: 40%; background: #019ACB; border-radius: 0 2px 2px 0; }
.fa-bt-tip { display: none; }
.fa-bt-fill { width: 0; border-radius: 3px; background: #019ACB; animation: faBt 3s ease-in-out infinite; }
@keyframes faBt { 0% { width: 6%; background: #FF4F28; } 50% { width: 96%; background: #1F7A4D; } 100% { width: 6%; background: #FF4F28; } }
.fa-wb { position: relative; width: clamp(50px, 10vw, 70px); height: clamp(64px, 13vw, 92px); border: 2.5px solid #019ACB; border-radius: 8px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
.fa-wb-fill { position: absolute; left: 0; bottom: 0; width: 100%; height: 0; background: linear-gradient(180deg, #4FC3E8, #019ACB); animation: faWb 3.4s ease-in-out infinite; }
@keyframes faWb { 0% { height: 0; } 45% { height: 60%; } 85% { height: 60%; } 100% { height: 0; } }
.fa-wb-mark { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 1.8vw, 14px); color: #FFFFFF; margin-bottom: 4px; }

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
