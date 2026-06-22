import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Умножение столбиком — nat_5_04 (rebuild: чистая инфра Dars28/37 + порт машины InteractiveMulColumn)
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
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <Floaters/>
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
// --- POD UROK: nat_5_04 — Ustun shaklida ko'paytirish / Умножение столбиком (rebuild 2026-06-20) ---
// Markaziy misconception: qatorlarni surishsiz qo'shish (Bekzod 213×12=639; to'g'risi 2556).
// Ikkilamchi: ko'paytuvchidagi nol qatorini tashlab ketish (xonani saqlamaslik).
// Asosiy usul: xonama-xona, o'ngdan chapga ko'paytir; har qatorni raqam xonasiga qarab surib yoz;
// nol raqami — nol qatori, lekin xonani saqla; oxirida qatorlarni ko'chirishni yo'qotmay qo'sh.
// Mashina (PORT, eski nat_5_04 dan): InteractiveMulColumn + DigitBox (digit-by-digit), AnimatedMulSolution,
// MulColumnStepwise, DistributiveWhy, MulSumSolver (partial-products). Faktlar: surish=×10, kompyuter
// surib-qo'shadi (IT), nol ixtirosi (Tarix). Xilma-xil turlar: error-spotting (s5), ordering (s9).
// ============================================================

const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'nat_5_04',
  lessonTitle: { ru: 'Умножение столбиком', uz: "Ustun shaklida ko'paytirish" }
};

// Jonli `screen` idx — qattiq kod yo'q. Reorderda SCREEN_META + screens massivini bir xil yangilang.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',              scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'MCScreen',            scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',              scored: false, scope: null },       // 2 (213×12 why-shift, MulColumnStepwise+DistributiveWhy + fakt)
  { id: 's3',  type: 'rule',        template: 'custom',              scored: false, scope: null },       // 3
  { id: 's4',  type: 'test',        template: 'InteractiveMulColumn',scored: true,  scope: 'practice' }, // 4 (MASHINA 245×4)
  { id: 's5',  type: 'test',        template: 'custom',              scored: true,  scope: 'practice' }, // 5 (error-spotting 245×14)
  { id: 's6',  type: 'exploration', template: 'custom',              scored: false, scope: null },       // 6 (132×204 nol qator, MulColumnStepwise + fakt)
  { id: 's7',  type: 'rule',        template: 'custom',              scored: false, scope: null },       // 7 (surish+nol, frame-tip + fakt)
  { id: 's8',  type: 'test',        template: 'MulSumSolver',        scored: true,  scope: 'practice' }, // 8 (partial-products 213×103)
  { id: 's9',  type: 'test',        template: 'custom',              scored: true,  scope: 'practice' }, // 9 (ordering 132×204)
  { id: 's10', type: 'case',        template: 'MCScreen',            scored: true,  scope: 'practice' }, // 10 (124×36, Nigora)
  { id: 's11', type: 'test',        template: 'MCScreen',            scored: true,  scope: 'final' },    // 11 (1248×104)
  { id: 's12', type: 'summary',     template: 'custom',              scored: false, scope: null }        // 12
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Вопрос урока', uz: 'Dars savoli' },
    global_q: { ru: 'Куда уходят разряды при умножении?', uz: "Ko'paytirishda xonalar qayerga ketadi?" },
    claim_lead: {
      ru: 'Шахзода снимает видео про быстрый счёт. На экране телефона Бекзод умножает 213 на 12 столбиком, но обе строки пишет одна под другой — без сдвига, складывает и говорит:',
      uz: "Shahzoda tez hisoblash haqida video olyapti. Telefon ekranida Bekzod 213 ni 12 ga ustun shaklida ko'paytiryapti, lekin ikkala qatorni surishsiz bir-birining tagiga yozadi, qo'shadi va deydi:"
    },
    claim_em: { ru: '213 × 12 = 639', uz: '213 × 12 = 639' },
    question: { ru: 'Бекзод прав?', uz: 'Bekzod haqmi?' },
    opt_yes: { ru: 'Бекзод прав', uz: 'Bekzod haq' },
    opt_no: { ru: 'Бекзод ошибается', uz: 'Bekzod xato qilyapti' },
    opt_idk: { ru: 'Не уверен', uz: 'Ishonchim komil emas' },
    audio: {
      intro: {
        ru: 'Шахзода снимает видео про быстрый счёт. На экране телефона Бекзод умножает двести тринадцать на двенадцать столбиком. Но обе строки он пишет одна под другой, без сдвига, складывает и получает шестьсот тридцать девять. Как думаешь, он прав?',
        uz: "Shahzoda tez hisoblash haqida video olyapti. Telefon ekranida Bekzod ikki yuz o'n uchni o'n ikkiga ustun shaklida ko'paytiryapti. Lekin ikkala qatorni surishsiz bir-birining tagiga yozadi, qo'shadi va olti yuz o'ttiz to'qqiz oladi. Sizningcha, u haqmi?"
      },
      on_correct: { ru: 'Сейчас проверим вместе.', uz: 'Hozir birga tekshiramiz.' },
      on_wrong: { ru: 'Сейчас проверим вместе.', uz: 'Hozir birga tekshiramiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz' },
    bridge: { ru: 'Прежде чем считать — вспомним разряды из прошлых уроков.', uz: "Hisoblashdan oldin — o'tgan darslardagi xonalarni eslaymiz." },
    question: { ru: 'В числе 2130 цифра 1 стоит в разряде…', uz: '2130 sonida 1 raqami qaysi xonada turibdi…' },
    opt0: { ru: 'единиц', uz: 'birlar' },
    opt1: { ru: 'десятков', uz: "o'nlar" },
    opt2: { ru: 'сотен', uz: 'yuzlar' },
    opt3: { ru: 'тысяч', uz: 'minglar' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. 2130 — это 2 тысячи, 1 сотня, 3 десятка, 0 единиц. Разряд решает, сколько стоит цифра.', uz: "To'g'ri. 2130 — bu 2 mingta, 1 yuzta, 3 o'nta, 0 birta. Xona raqamning qiymatini belgilaydi." },
    wrong_0: { ru: 'Единицы — самый правый разряд, там стоит ноль. Считай разряды справа налево: единицы, десятки, сотни.', uz: "Birlar — eng o'ngdagi xona, u yerda nol turibdi. Xonalarni o'ngdan chapga sanang: birlar, o'nlar, yuzlar." },
    wrong_1: { ru: 'В десятках стоит тройка. Единица — на одну позицию левее десятков.', uz: "O'nlar xonasida uch turibdi. Bir undan bitta chap tomonda." },
    wrong_3: { ru: 'В тысячах стоит двойка. Единица — на разряд правее тысяч.', uz: "Minglar xonasida ikki turibdi. Bir undan bitta o'ng tomonda." },
    audio: {
      intro: { ru: 'Короткий разогрев. В числе две тысячи сто тридцать в каком разряде стоит цифра один? Выбери ответ.', uz: "Qisqa mashq. Ikki ming bir yuz o'ttiz sonida bir raqami qaysi xonada turibdi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разряд держит цифру на месте.', uz: "To'g'ri. Xona raqamni o'z o'rnida ushlaydi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s2: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz" },
    bridge: { ru: 'Бекзод сложил без сдвига. Посмотрим, что теряется.', uz: "Bekzod surishsiz qo'shdi. Nima yo'qolishini ko'ramiz." },
    title: { ru: 'Почему строки сдвигаются', uz: 'Nega qatorlar suriladi' },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    btn_final: { ru: 'Дальше', uz: 'Davom etish' },
    why_caption: {
      ru: 'Двенадцать — это десять плюс два. Умножаем 213 на 2 и на 10 отдельно, а строку «×10» сдвигаем на разряд влево. Сложить без сдвига — потерять разряды.',
      uz: "O'n ikki — bu o'n qo'shuv ikki. 213 ni 2 ga va 10 ga alohida ko'paytiramiz, '×10' qatorini esa bir xona chapga suramiz. Surishsiz qo'shish — xonalarni yo'qotish."
    },
    fact: { ru: 'Сдвиг на разряд влево — это умножение на 10. Поэтому строка десятков стоит левее: она в десять раз больше.', uz: "Bir xona chapga surish — bu 10 ga ko'paytirish. Shuning uchun o'nlar qatori chaproqda turadi: u o'n barobar katta." },
    fact_audio: { ru: 'Запомни: сдвинуть строку на разряд влево — это то же самое, что умножить её на десять. Вот почему сдвиг нельзя пропускать.', uz: "Eslab qoling: qatorni bir xona chapga surish — uni o'nga ko'paytirish bilan bir xil. Mana nega surishni tashlab bo'lmaydi." },
    audio: { ru: [
      'Проверим вместе. Сначала умножаем двести тринадцать на единицы, то есть на два. Два на три шесть, два на один два, два на два четыре. Выходит четыреста двадцать шесть.',
      'Теперь умножаем на десятки. Цифра десятков это один, но стоит она в разряде десятков, поэтому двести тринадцать пишем со сдвигом на одну клетку влево. На самом деле это две тысячи сто тридцать.',
      'Складываем строки со сдвигом и получаем две тысячи пятьсот пятьдесят шесть. Двенадцать это десять плюс два, и каждую часть мы умножаем отдельно. Сложить без сдвига как у Бекзода значит потерять разряды.'
    ], uz: [
      "Birga tekshiramiz. Avval ikki yuz o'n uchni birlarga, ya'ni ikkiga ko'paytiramiz. Ikki karra uch olti, ikki karra bir ikki, ikki karra ikki to'rt. To'rt yuz yigirma olti chiqadi.",
      "Endi o'nlarga ko'paytiramiz. O'nlar raqami bir, lekin u o'nlar xonasida turibdi, shuning uchun ikki yuz o'n uchni bir katak chapga surib yozamiz. Aslida bu ikki ming bir yuz o'ttiz.",
      "Surilgan qatorlarni qo'shamiz va ikki ming besh yuz ellik olti chiqadi. O'n ikki bu o'n qo'shuv ikki, har bir qismni alohida ko'paytiramiz. Bekzoddek surishsiz qo'shish xonalarni yo'qotish demakdir."
    ] }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Умножение столбиком', uz: "Ustun shaklida ko'paytirish" },
    rule_1: { ru: 'Записываем числа разряд под разрядом, выравнивая справа. Умножаем верхнее число на каждую цифру нижнего по очереди, справа налево.', uz: "Sonlarni xonama-xona, o'ngdan tekislab yozamiz. Yuqori sonni pastki sonning har bir raqamiga navbatma-navbat, o'ngdan chapga ko'paytiramiz." },
    rule_2: { ru: 'Каждый результат пишем со сдвигом: под единицами — без сдвига, под десятками — на разряд левее. В конце складываем строки.', uz: "Har bir natijani surib yozamiz: birlar tagida — surishsiz, o'nlar tagida — bir xona chaproq. Oxirida qatorlarni qo'shamiz." },
    term: { ru: 'Результат умножения на одну цифру — это отдельная строка. Сдвиг показывает разряд этой цифры.', uz: "Bir raqamga ko'paytirish natijasi — alohida qator. Surish shu raqamning xonasini ko'rsatadi." },
    ref: { ru: 'Разряды — из уроков о многозначных числах (nat_5_01).', uz: "Xonalar — ko'p xonali sonlar darslaridan (nat_5_01)." },
    audio: { ru: 'Закрепим. Числа пишем разряд под разрядом и умножаем верхнее на каждую цифру нижнего справа налево. Каждый результат это отдельная строка, и пишем её со сдвигом по разряду цифры: под единицами без сдвига, под десятками на клетку левее. В конце складываем строки.', uz: "Mustahkamlaymiz. Sonlarni xonama-xona yozamiz va yuqorini pastning har bir raqamiga o'ngdan chapga ko'paytiramiz. Har bir natija alohida qator, uni raqam xonasiga qarab surib yozamiz: birlar tagida surishsiz, o'nlar tagida bir katak chaproq. Oxirida qatorlarni qo'shamiz." }
  },

  s4: {
    eyebrow: { ru: 'Тренировка · 1 из 6', uz: 'Mashq · 6 dan 1' },
    bridge: { ru: 'Правило знаем — теперь умножь сам, по разрядам.', uz: "Qoidani bilamiz — endi o'zingiz xonama-xona ko'paytiring." },
    label: { ru: 'Умножь сам', uz: "O'zingiz ko'paytiring" },
    question: { ru: 'Шахзода считает кадры: 245 кадров в секунду, запись 4 секунды. Сколько кадров? Реши 245 × 4 в столбик.', uz: "Shahzoda kadrlarni sanaydi: sekundiga 245 kadr, yozuv 4 sekund. Necha kadr? 245 × 4 ni ustun shaklida yeching." },
    top: '245', mul: '4', result: '980',
    hint: { ru: 'Умножай справа налево: сначала единицы, потом десятки, потом сотни. Перенос держи над чертой и прибавляй к следующему разряду.', uz: "O'ngdan chapga ko'paytiring: avval birlar, keyin o'nlar, keyin yuzlar. Ko'chirishni chiziq ustida saqlang va keyingi xonaga qo'shing." },
    fb_correct: { ru: 'Правильно. 5×4=20 — пишем 0, держим 2; 4×4=16, плюс 2 — 18, пишем 8, держим 1; 2×4=8, плюс 1 — 9. Итог 980.', uz: "To'g'ri. 5×4=20 — 0 yozamiz, 2 dilda; 4×4=16, 2 bilan — 18, 8 yozamiz, 1 dilda; 2×4=8, 1 bilan — 9. Natija 980." },
    fb_wrong: { ru: 'Главное — не потерять перенос. Умножь каждый разряд и прибавь перенос из предыдущего.', uz: "Asosiysi — ko'chirishni yo'qotmaslik. Har bir xonani ko'paytiring va oldingisidan ko'chirishni qo'shing." },
    audio: {
      intro: { ru: 'Теперь твоя очередь. Умножь двести сорок пять на четыре в столбик. Иди справа налево и не теряй перенос.', uz: "Endi sizning navbatingiz. Ikki yuz qirq beshni to'rtga ustun shaklida ko'paytiring. O'ngdan chapga yuring va ko'chirishni yo'qotmang." },
      on_correct: { ru: 'Верно. Перенос на месте.', uz: "To'g'ri. Ko'chirish joyida." },
      on_wrong: { ru: 'Пока не сходится. Проверь перенос в каждом разряде.', uz: "Hali mos emas. Har bir xonadagi ko'chirishni tekshiring." }
    }
  },

  // s5 — error-spotting (custom). solvers: 3 ustun-yechim; errorIdx surilmagan. correctIndex = errorIdx.
  s5: {
    eyebrow: { ru: 'Тренировка · 2 из 6', uz: 'Mashq · 6 dan 2' },
    bridge: { ru: 'Теперь — глаз на ошибку. Один пример сделан неправильно.', uz: "Endi — xatoni topish. Bir misol noto'g'ri yechilgan." },
    question: { ru: 'Трое считали 245 × 14. Кто ошибся?', uz: '245 × 14 ni uch kishi hisobladi. Kim xato qildi?' },
    lead: { ru: 'Сравни строки и сдвиг. Тапни решение с ошибкой.', uz: "Qatorlar va surishni solishtiring. Xato yechimni bosing." },
    top: '245', mul: '14', errorIdx: 2,
    solvers: [
      { name: { ru: 'Карим', uz: 'Karim' }, rows: [{ digits: '980', shift: 0 }, { digits: '245', shift: 1 }], result: '3430', wrong: false },
      { name: { ru: 'Севара', uz: 'Sevara' }, rows: [{ digits: '980', shift: 0 }, { digits: '245', shift: 1 }], result: '3430', wrong: false },
      { name: { ru: 'Жасур', uz: 'Jasur' }, rows: [{ digits: '980', shift: 0 }, { digits: '245', shift: 0 }], result: '1225', wrong: true }
    ],
    correct_text: { ru: 'Верно, ошибся Жасур. Он не сдвинул строку «×10» — сложил 980 и 245 без сдвига. Со сдвигом это 980 и 2450, сумма 3430.', uz: "To'g'ri, Jasur xato qildi. U '×10' qatorini surmadi — 980 va 245 ni surishsiz qo'shdi. Surilganda bu 980 va 2450, yig'indi 3430." },
    wrong_0: { ru: 'У Карима всё верно: строку десятков он сдвинул на разряд влево. Ошибка — у того, кто сложил без сдвига.', uz: "Karimda hammasi to'g'ri: o'nlar qatorini bir xona chapga surgan. Xato — surishsiz qo'shganda." },
    wrong_1: { ru: 'У Севары верно: сдвиг на месте, строки сложены правильно. Ищи того, кто забыл сдвинуть.', uz: "Sevarada to'g'ri: surish joyida, qatorlar to'g'ri qo'shilgan. Surishni unutganni qidiring." },
    audio: {
      intro: { ru: 'Трое умножали двести сорок пять на четырнадцать. У одного строка десятков не сдвинута. Найди ошибочное решение.', uz: "Uch kishi ikki yuz qirq beshni o'n to'rtga ko'paytirdi. Bittasida o'nlar qatori surilmagan. Xato yechimni toping." },
      on_correct: { ru: 'Верно. Без сдвига строки сложить нельзя.', uz: "To'g'ri. Qatorlarni surishsiz qo'shib bo'lmaydi." },
      on_wrong: { ru: 'Это решение верное. Посмотри, где строка не сдвинута.', uz: "Bu yechim to'g'ri. Qaysi birida qator surilmaganini qarang." }
    }
  },

  s6: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz" },
    bridge: { ru: 'А если в множителе есть ноль? Посмотрим.', uz: "Agar ko'paytuvchida nol bo'lsa-chi? Ko'ramiz." },
    title: { ru: 'Что делать с нулём в множителе', uz: "Ko'paytuvchidagi nol bilan nima qilamiz" },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
    btn_final: { ru: 'Дальше', uz: 'Davom etish' },
    fact: { ru: 'Компьютеры умножают так же: сдвигают строки и складывают, только в двоичной системе. Тот же приём «сдвиг и сложение».', uz: "Kompyuterlar ham shunday ko'paytiradi: qatorlarni surib qo'shadi, faqat ikkilik sanoqda. Xuddi o'sha surib qo'shish usuli." },
    fact_audio: { ru: 'Интересно: компьютеры умножают тем же способом, что и ты сейчас. Они сдвигают строки и складывают, только в двоичной системе. Приём называется сдвиг и сложение.', uz: "Qiziq: kompyuterlar ham siz hozir qilayotgan usulda ko'paytiradi. Ular qatorlarni surib qo'shadi, faqat ikkilik sanoqda. Bu usul surib qo'shish deyiladi." },
    audio: { ru: [
      'Умножаем сто тридцать два на двести четыре. Сначала единицы, четыре. Четыре на два восемь, четыре на три двенадцать, четыре на один четыре, с переносом выходит пятьсот двадцать восемь.',
      'В разряде десятков стоит ноль. Умножать не на что, вся строка это ноль. Но место разряда мы держим, поэтому ставим ноль и идём дальше.',
      'Теперь сотни, двойка. Сто тридцать два на два это двести шестьдесят четыре, и пишем со сдвигом на два разряда влево, потому что это сотни.',
      'Складываем строки и получаем двадцать шесть тысяч девятьсот двадцать восемь. Ноль в множителе не пропускаем, он держит разряд.'
    ], uz: [
      "Bir yuz o'ttiz ikkini ikki yuz to'rtga ko'paytiramiz. Avval birlar, to'rt. To'rt karra ikki sakkiz, to'rt karra uch o'n ikki, to'rt karra bir to'rt, ko'chirish bilan besh yuz yigirma sakkiz chiqadi.",
      "O'nlar xonasida nol turibdi. Ko'paytirishga narsa yo'q, butun qator nol. Lekin xona o'rnini saqlaymiz, shuning uchun nol qo'yib oldinga yuramiz.",
      "Endi yuzlar, ikki. Bir yuz o'ttiz ikki karra ikki ikki yuz oltmish to'rt, buni ikki xona chapga surib yozamiz, chunki bu yuzlar.",
      "Qatorlarni qo'shamiz va yigirma olti ming to'qqiz yuz yigirma sakkiz chiqadi. Ko'paytuvchidagi nolni tashlab ketmaymiz, u xonani saqlaydi."
    ] }
  },

  s7: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Сдвиг и ноль в множителе', uz: "Surish va ko'paytuvchidagi nol" },
    rule_1: { ru: 'Каждая следующая строка сдвигается на один разряд левее предыдущей — по разряду цифры, на которую умножаем.', uz: "Har bir keyingi qator oldingisidan bir xona chaproqqa suriladi — ko'paytirilayotgan raqamning xonasiga qarab." },
    rule_2: { ru: 'Если цифра множителя ноль, строка целиком равна нулю, но разряд держим: ставим ноль и переходим к следующей цифре.', uz: "Agar ko'paytuvchi raqami nol bo'lsa, qator butunlay nol, lekin xonani baribir saqlaymiz: nol qo'yib keyingi raqamga o'tamiz." },
    warn: { ru: 'Ноль держит разряд. Пропустишь нулевую строку — все следующие строки встанут не на своё место.', uz: "Nol xonani saqlaydi. Nol qatorini tashlab ketsangiz — keyingi barcha qatorlar o'z o'rnida turmaydi." },
    term: { ru: 'Сдвиг — это запись строки на разряд левее, потому что цифра множителя стоит в старшем разряде.', uz: "Surish — bu qatorni bir xona chaproq yozish, chunki ko'paytuvchi raqami yuqori xonada turibdi." },
    ref: { ru: 'Сложение строк — из урока сложения столбиком (nat_5_03).', uz: "Qatorlarni qo'shish — ustun shaklida qo'shish darsidan (nat_5_03)." },
    fact: { ru: 'Ноль придумали как знак «здесь пусто, но разряд есть». Без него запись 204 и 24 нельзя было бы различить.', uz: "Nol 'bu yer bo'sh, lekin xona bor' degan belgi sifatida o'ylab topilgan. Usiz 204 va 24 yozuvini farqlab bo'lmasdi." },
    fact_audio: { ru: 'Ноль придумали не сразу. Это знак того, что разряд пустой, но он есть. Без нуля нельзя было бы отличить двести четыре от двадцати четырёх.', uz: "Nol birdan o'ylab topilmagan. Bu xona bo'sh, lekin u mavjud degan belgi. Nolsiz ikki yuz to'rtni yigirma to'rtdan ajratib bo'lmasdi." },
    audio: { ru: 'Запомним два момента. Первый: каждая строка сдвигается на разряд левее, по разряду цифры множителя. Второй: если цифра множителя ноль, вся строка ноль, но разряд держим, ставим ноль и идём дальше. А в конце складываем строки, не теряя перенос.', uz: "Ikki narsani eslab qolamiz. Birinchi: har bir qator bir xona chaproqqa suriladi, ko'paytuvchi raqamining xonasiga qarab. Ikkinchi: agar ko'paytuvchi raqami nol bo'lsa, butun qator nol, lekin xonani saqlaymiz, nol qo'yib oldinga yuramiz. Oxirida esa qatorlarni ko'chirishni yo'qotmay qo'shamiz." }
  },

  // s8 — partial-products (MulSumSolver). Tayyor qatorlar berilgan, o'quvchi YIG'INDIni teradi (nol qator bilan).
  s8: {
    eyebrow: { ru: 'Тренировка · 3 из 6', uz: 'Mashq · 6 dan 3' },
    bridge: { ru: 'Теперь собери строки сам — с нулём в середине.', uz: "Endi qatorlarni o'zingiz yig'ing — o'rtada nol bilan." },
    label: { ru: 'Сложи строки', uz: "Qatorlarni qo'shing" },
    question: { ru: 'Строки умножения 213 × 103 уже посчитаны. Сложи их со сдвигом.', uz: "213 × 103 ko'paytirish qatorlari hisoblangan. Ularni surib qo'shing." },
    result: '21939',
    hint: { ru: 'Строка десятков нулевая, но разряд держи. Строку сотен сдвигай на два разряда влево, потом складывай по разрядам.', uz: "O'nlar qatori nol, lekin xonani saqlang. Yuzlar qatorini ikki xona chapga suring, keyin xonama-xona qo'shing." },
    fb_correct: { ru: 'Правильно. 639, нулевая строка, 213 со сдвигом на два разряда это 21300, сумма 21939.', uz: "To'g'ri. 639, nol qatori, 213 ikki xona surilganda 21300, yig'indi 21939." },
    audio: {
      intro: { ru: 'Строки уже посчитаны. Сложи их по разрядам, не забывая про сдвиг и нулевую строку.', uz: "Qatorlar hisoblangan. Ularni xonama-xona qo'shing, surish va nol qatorini unutmang." },
      on_correct: { ru: 'Верно. Ноль удержал разряд, сотни встали на место.', uz: "To'g'ri. Nol xonani ushladi, yuzlar o'z o'rniga turdi." },
      on_wrong: { ru: 'Пока не сходится. Проверь сдвиг и нулевую строку.', uz: "Hali mos emas. Surish va nol qatorini tekshiring." }
    }
  },

  // s9 — ordering (custom). steps display random; correctOrder bo'yicha tartibga sol. веди-до-верного.
  s9: {
    eyebrow: { ru: 'Тренировка · 4 из 6', uz: 'Mashq · 6 dan 4' },
    bridge: { ru: 'Помнишь 132 на 204? Расставь шаги по порядку.', uz: "132 ni 204 ga eslaysizmi? Qadamlarni tartibga soling." },
    title: { ru: 'В каком порядке умножаем 132 × 204 столбиком?', uz: "132 × 204 ni ustun shaklida qaysi tartibda ko'paytiramiz?" },
    lead: { ru: 'Поставь шаги в правильном порядке — сверху вниз.', uz: "Qadamlarni to'g'ri tartibda joylashtiring — yuqoridan pastga." },
    steps: [
      { id: 'a', text: { ru: 'Умножаем на единицы (4): первая строка', uz: "Birlarga (4) ko'paytiramiz: birinchi qator" } },
      { id: 'b', text: { ru: 'Цифра десятков — ноль: нулевая строка, держим разряд', uz: "O'nlar raqami nol: nol qatori, xonani saqlaymiz" } },
      { id: 'c', text: { ru: 'Умножаем на сотни (2): пишем со сдвигом на два разряда', uz: "Yuzlarga (2) ko'paytiramiz: ikki xona surib yozamiz" } },
      { id: 'd', text: { ru: 'Складываем все строки со сдвигом', uz: "Barcha qatorlarni surib qo'shamiz" } }
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
    correct_text: { ru: 'Верно. Идём по разрядам справа налево: единицы, нулевая строка десятков, сотни со сдвигом, потом сложение.', uz: "To'g'ri. Xonalar bo'yicha o'ngdan chapga: birlar, o'nlar nol qatori, surilgan yuzlar, keyin qo'shish." },
    hint: { ru: 'Начинай справа, с единиц. Десятки нулевые, но разряд держи. Сотни сдвигаются дальше всех. Сложение — в конце.', uz: "O'ngdan, birlardan boshlang. O'nlar nol, lekin xonani saqlang. Yuzlar eng uzoq suriladi. Qo'shish — oxirida." },
    audio: {
      intro: { ru: 'Расставь шаги умножения сто тридцать два на двести четыре по порядку, сверху вниз. Начинай с единиц.', uz: "Bir yuz o'ttiz ikkini ikki yuz to'rtga ko'paytirish qadamlarini tartibga soling, yuqoridan pastga. Birlardan boshlang." },
      on_correct: { ru: 'Верно. Разряды идут справа налево, сложение в конце.', uz: "To'g'ri. Xonalar o'ngdan chapga boradi, qo'shish oxirida." },
      on_wrong: { ru: 'Этот шаг не на своём месте. Иди по разрядам справа.', uz: "Bu qadam o'z o'rnida emas. Xonalar bo'yicha o'ngdan yuring." }
    }
  },

  s10: {
    eyebrow: { ru: 'Тренировка · 5 из 6', uz: 'Mashq · 6 dan 5' },
    bridge: { ru: 'Применим на жизненной задаче.', uz: "Hayotiy masalada qo'llaymiz." },
    title: { ru: 'Задача про наклейки', uz: 'Stikerlar haqida masala' },
    question: { ru: 'Нигора собирает альбомы. В одном альбоме 124 наклейки. Сколько наклеек в 36 альбомах? 124 × 36.', uz: "Nigora albomlar yig'yapti. Bitta albomda 124 ta stiker. 36 ta albomda nechta stiker? 124 × 36." },
    result: '4464',
    opt0: { ru: '4464', uz: '4464' },
    opt1: { ru: '1116', uz: '1116' },
    opt2: { ru: '888', uz: '888' },
    opt3: { ru: '4092', uz: '4092' },
    correctIndex: 0,
    correct_text: { ru: 'Правильно. 124×6=744, 124×3=372 со сдвигом это 3720, сумма 4464.', uz: "To'g'ri. 124×6=744, 124×3=372 surilganda 3720, yig'indi 4464." },
    wrong_1: { ru: 'Здесь сложили только цифры множителя. Тридцать шесть это тридцать плюс шесть — умножь на каждую часть отдельно и сложи со сдвигом.', uz: "Bu yerda faqat ko'paytuvchi raqamlari qo'shilgan. O'ttiz olti bu o'ttiz qo'shuv olti — har bir qismga alohida ko'paytirib, surib qo'shing." },
    wrong_2: { ru: 'Это слишком мало для такого произведения. Нужно умножить на обе цифры множителя и сложить строки со сдвигом.', uz: "Bunday ko'paytma uchun bu juda kam. Ko'paytuvchining ikkala raqamiga ko'paytirib, qatorlarni surib qo'shish kerak." },
    wrong_3: { ru: 'Строку десятков забыли сдвинуть. Результат умножения на десятки стоит на разряд левее.', uz: "O'nlar qatorini surishni unutdingiz. O'nlarga ko'paytirish natijasi bir xona chaproqda turadi." },
    audio: {
      intro: { ru: 'Задача про наклейки. В одном альбоме сто двадцать четыре наклейки, альбомов тридцать шесть. Посчитай и выбери верный ответ.', uz: "Stikerlar haqida masala. Bitta albomda bir yuz yigirma to'rt stiker, albomlar o'ttiz oltita. Hisoblab to'g'ri javobni tanlang." },
      on_correct: { ru: 'Верно. Строки сложены со сдвигом.', uz: "To'g'ri. Qatorlar surib qo'shilgan." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s11: {
    eyebrow: { ru: 'Проверка знаний', uz: 'Bilim tekshiruvi' },
    bridge: { ru: 'Финал — большое число с нулём в множителе.', uz: "Yakun — ko'paytuvchida nol bor katta son." },
    title: { ru: 'Проверь себя', uz: "O'zingizni tekshiring" },
    question: { ru: 'Сколько будет 1248 × 104?', uz: '1248 × 104 nechaga teng?' },
    result: '129792',
    opt0: { ru: '129792', uz: '129792' },
    opt1: { ru: '12480', uz: '12480' },
    opt2: { ru: '13728', uz: '13728' },
    opt3: { ru: '124800', uz: '124800' },
    correctIndex: 0,
    correct_text: { ru: 'Правильно. 1248×4=4992, строка десятков нулевая, 1248×1 со сдвигом на два разряда это 124800, сумма 129792.', uz: "To'g'ri. 1248×4=4992, o'nlar qatori nol, 1248×1 ikki xona surilganda 124800, yig'indi 129792." },
    wrong_1: { ru: 'Здесь умножили только на единицы как на десять. Нужна ещё строка единиц и строка сотен со сдвигом.', uz: "Bu yerda faqat o'nga ko'paytirilgan. Birlar qatori va surilgan yuzlar qatori ham kerak." },
    wrong_2: { ru: 'Здесь умножили как на одиннадцать. Средняя цифра ноль, а сотни сдвигаются на два разряда.', uz: "Bu o'n birga ko'paytirilganga o'xshaydi. O'rtadagi raqam nol, yuzlar ikki xona suriladi." },
    wrong_3: { ru: 'Это только строка сотен. Не хватает строки единиц, её тоже надо прибавить.', uz: "Bu faqat yuzlar qatori. Birlar qatori yetishmaydi, uni ham qo'shish kerak." },
    audio: {
      intro: { ru: 'Проверь себя на большом числе. Сколько будет тысяча двести сорок восемь на сто четыре? Выбери верный ответ.', uz: "Katta sonda o'zingizni tekshiring. Bir ming ikki yuz qirq sakkiz karra bir yuz to'rt nechaga teng? To'g'ri javobni tanlang." },
      on_correct: { ru: 'Верно. Все строки и сдвиги на месте.', uz: "To'g'ri. Barcha qatorlar va surishlar joyida." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s12: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    heading: { ru: 'Разряды никуда не уходят', uz: 'Xonalar hech qayerga ketmaydi' },
    title: { ru: 'Сдвиг — это разряд, а не украшение.', uz: "Surish — bu xona, bezak emas." },
    hook_close: { ru: 'Помнишь Бекзода и его 639? Он сложил строки без сдвига и потерял разряды. На самом деле 213 × 12 = 2556.', uz: "Bekzodni va uning 639 ini eslaysizmi? U qatorlarni surishsiz qo'shib, xonalarni yo'qotdi. Aslida 213 × 12 = 2556." },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'Умножаем на каждую цифру отдельно и пишем строки со сдвигом по разряду.', uz: "Har bir raqamga alohida ko'paytiramiz va qatorlarni xonaga qarab surib yozamiz." },
    main_2: { ru: 'Ноль в множителе держит разряд; в конце складываем строки, не теряя перенос.', uz: "Ko'paytuvchidagi nol xonani saqlaydi; oxirida qatorlarni ko'chirishni yo'qotmay qo'shamiz." },
    main_3: { ru: 'Сдвиг — это разряд: строка «×10» в десять раз больше, поэтому стоит на разряд левее.', uz: "Surish — bu xona: '×10' qatori o'n barobar katta, shuning uchun bir xona chaproqda turadi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'Разряды · сдвиг · перенос (nat_5_01 — nat_5_03)', uz: "Xonalar · surish · ko'chirish (nat_5_01 — nat_5_03)" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Деление уголком: как разложить число на равные части.', uz: "Burchak usulida bo'lish: sonni teng qismlarga ajratish." },
    btn_restart: { ru: 'Пройти заново', uz: 'Qaytadan o\'tish' },
    audio: { ru: 'Подведём итог. Бекзод получил шестьсот тридцать девять, потому что сложил строки без сдвига и потерял разряды. На самом деле двести тринадцать на двенадцать дают две тысячи пятьсот пятьдесят шесть. Главное: умножаем на каждую цифру отдельно, пишем строки со сдвигом по разряду, ноль держит разряд, а в конце складываем. Дальше нас ждёт деление уголком.', uz: "Yakunlaymiz. Bekzod olti yuz o'ttiz to'qqiz oldi, chunki qatorlarni surishsiz qo'shib xonalarni yo'qotdi. Aslida ikki yuz o'n uch karra o'n ikki ikki ming besh yuz ellik olti beradi. Asosiysi: har bir raqamga alohida ko'paytiramiz, qatorlarni xonaga qarab surib yozamiz, nol xonani saqlaydi, oxirida qo'shamiz. Keyingi safar burchak usulida bo'lish kutadi." }
  }
};

// Ovozli javob (ANSWER_VOICE) — to'g'ri kiritishda. Yangi idx natijalariga moslangan.
const ANSWER_VOICE = {
  '980':   { ru: 'Верно. Ответ девятьсот восемьдесят.', uz: "To'g'ri. Javob to'qqiz yuz sakson." },
  '21939': { ru: 'Верно. Ответ двадцать одна тысяча девятьсот тридцать девять.', uz: "To'g'ri. Javob yigirma bir ming to'qqiz yuz o'ttiz to'qqiz." }
};

// SOLUTIONS — ozvuchli razbor (AnimatedMulSolution). Yangi idx: s4=245×4, s8=213×103.
// mult — СЛЕВА НАПРАВО (старшие первыми). narr длиной rows+1.
const SOLUTIONS = {
  4: {
    top: '245', mult: [{ d: '4', color: T.accent }], result: { digits: '980' },
    rows: [
      { digits: '980', shift: 0, color: T.accent, caption: '245 × 4', work: [{ a: 5, b: 4 }, { a: 4, b: 4, carryIn: 2 }, { a: 2, b: 4, carryIn: 1 }] }
    ],
    narr: {
      ru: [
        'Идём справа налево. Пять на четыре двадцать. Ноль пишем, два держим в уме. Четыре на четыре шестнадцать, и два из ума, восемнадцать. Восемь пишем, один в уме. Два на четыре восемь, и один из ума, девять.',
        'Получается девятьсот восемьдесят. Вот верный ответ.'
      ],
      uz: [
        "O'ngdan chapga yuramiz. Besh karra to'rt yigirma. Nolni yozamiz, ikkini dilda saqlaymiz. To'rt karra to'rt o'n olti, dildagi ikki bilan o'n sakkiz. Sakkizni yozamiz, bir dilda. Ikki karra to'rt sakkiz, dildagi bir bilan to'qqiz.",
        "To'qqiz yuz sakson chiqadi. Mana to'g'ri javob."
      ]
    }
  },
  8: {
    top: '213', mult: [{ d: '1', color: T.blue }, { d: '0', color: T.ink3 }, { d: '3', color: T.accent }], result: { digits: '21939' },
    rows: [
      { digits: '639', shift: 0, color: T.accent, caption: '213 × 3', work: [{ a: 3, b: 3 }, { a: 1, b: 3 }, { a: 2, b: 3 }] },
      { digits: '0',   shift: 1, color: T.ink3,   caption: '213 × 0 (десятки)', kind: 'zero' },
      { digits: '213', shift: 2, color: T.blue,   caption: '213 × 1 (сотни)', work: [{ a: 3, b: 1 }, { a: 1, b: 1 }, { a: 2, b: 1 }] }
    ],
    narr: {
      ru: [
        'Считаем в столбик. Сначала единицы, три. Три на три девять, один на три три, два на три шесть. Первая строка шестьсот тридцать девять.',
        'В разряде десятков стоит ноль. Вся строка ноль, но разряд держим: ставим ноль и идём дальше.',
        'Теперь сотни, один. Двести тринадцать пишем со сдвигом на два разряда влево. На самом деле это двадцать одна тысяча триста.',
        'Складываем строки и получаем двадцать одну тысячу девятьсот тридцать девять. Вот верный ответ.'
      ],
      uz: [
        "Ustun shaklida hisoblaymiz. Avval birlar, uch. Uch karra uch to'qqiz, bir karra uch uch, ikki karra uch olti. Birinchi qator olti yuz o'ttiz to'qqiz.",
        "O'nlar xonasida nol turibdi. Butun qator nol, lekin xonani saqlaymiz: nol qo'yib oldinga yuramiz.",
        "Endi yuzlar, bir. Ikki yuz o'n uchni ikki xona chapga surib yozamiz. Aslida bu yigirma bir ming uch yuz.",
        "Qatorlarni qo'shamiz va yigirma bir ming to'qqiz yuz o'ttiz to'qqiz chiqadi. Mana to'g'ri javob."
      ]
    }
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
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };
const FB_MATH = { ru: 'Полезно знать · Математика', uz: "Bilib qo'ying · Matematika" };

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

const fmtDec = (v) => { const r = Math.round(v * 100) / 100; return String(r).replace('.', ','); };

const DecInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, correctValue, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    const isCorrect = Math.abs(v - correct) < 1e-6;
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
        <Bridge node={c.bridge}/>
        <div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
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
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
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
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
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
// MASHINA — ustun ko'paytirish (port _Dars04_machine_ref.jsx)
// ============================================================
const ArrowLeft = ({ color }) => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 7H3"/><path d="M9 1 3 7l6 6"/>
  </svg>
);

// Моноширинный контекст: ch-ширина черты считается тем же шрифтом, что и числа,
// поэтому черта точно доходит до краёв самого широкого числа.
const MONO = { fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(20px, 4.4vw, 30px)', lineHeight: 1.5 };

const ColRow = ({ children, caption, captionColor, numStyle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={numStyle}>{children}</div>
    {caption && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: captionColor }}>
        <ArrowLeft color={captionColor}/>
        <span className="mono small" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{caption}</span>
      </div>
    )}
  </div>
);

const renderNum = (str, color, shift, animate) => {
  const chars = String(str).split('');
  const n = chars.length;
  const out = chars.map((ch, i) => (
    <span key={i} className={animate ? 'mb-pop' : undefined}
      style={{ color, fontWeight: 700, animationDelay: animate ? `${(n - 1 - i) * 0.16}s` : undefined }}>{ch}</span>
  ));
  for (let k = 0; k < (shift || 0); k++) out.push(<span key={`sp${k}`}>{'\u00A0'}</span>);
  return out;
};

const WorkChip = ({ w, color, delay, isLast }) => {
  const prod = w.a * w.b;
  const withCarry = prod + (w.carryIn || 0);
  const carryOut = (!isLast && withCarry >= 10) ? Math.floor(withCarry / 10) : 0;
  return (
    <span className="mb-chip mb-pop" style={{ animationDelay: `${delay}s` }}>
      <span className="mono">{w.a} × {w.b}</span>
      {w.carryIn ? <span className="mono" style={{ color: T.ink3 }}> + {w.carryIn}</span> : null}
      <span className="mono"> = </span>
      <span className="mono" style={{ color, fontWeight: 700 }}>{withCarry}</span>
      {carryOut ? <sup className="mb-carry" style={{ color: T.accent }}>+{carryOut}</sup> : null}
    </span>
  );
};

const MulColumnStepwise = ({ top, mult, rows, result }) => {
  const eff = (r) => r.digits.length + (r.shift || 0);
  const multLen = mult.reduce((a, m) => a + String(m.d).length, 0) + 2;
  const maxLen = Math.max(top.length, multLen, ...rows.map(r => eff(r) + 2), result ? result.digits.length : 0);
  const W = `${maxLen}ch`;
  const numStyle = { ...MONO, whiteSpace: 'pre', textAlign: 'right', minWidth: W };
  const rule = <div style={{ ...MONO, height: 2, background: T.ink, width: W, margin: '4px 0', borderRadius: 1 }}/>;
  const op = (c) => <span style={{ color: T.ink2, fontWeight: 700 }}>{c}</span>;
  const addAt = (result && rows.length >= 2) ? rows.length - 1 : -1;
  const activeRow = rows.find(r => r.active && r.kind !== 'zero' && r.work);
  const activeZero = rows.find(r => r.active && r.kind === 'zero');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', width: '100%', alignItems: 'center' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <ColRow numStyle={numStyle}>{top}</ColRow>
        <ColRow numStyle={numStyle}>
          {op('\u00D7 ')}{mult.map((m, i) => <span key={i} style={{ color: m.color, fontWeight: 600 }}>{m.d}</span>)}
        </ColRow>
        {rule}
        {rows.map((r, i) => (
          <ColRow key={i} numStyle={numStyle} caption={r.caption} captionColor={r.color}>
            {i === addAt ? op('+ ') : null}{renderNum(r.digits, r.color, r.shift, !!r.active)}
          </ColRow>
        ))}
        {result && (<>{rule}<ColRow numStyle={numStyle}>{renderNum(result.digits, result.color || T.success, 0, true)}</ColRow></>)}
      </div>
      {(activeRow || activeZero) && (
        <div className="mb-work">
          <div className="mb-work-title mono small" style={{ color: (activeRow || activeZero).color }}>
            {(activeRow || activeZero).caption}
          </div>
          <div className="mb-work-chips">
            {activeRow
              ? activeRow.work.map((w, i) => <WorkChip key={i} w={w} color={activeRow.color} delay={i * 0.18} isLast={i === activeRow.work.length - 1}/>)
              : <span className="mb-chip mb-pop"><span className="mono">{top} × 0 = 0</span></span>}
          </div>
        </div>
      )}
    </div>
  );
};

// Распределительный принцип: наглядное «почему» столбик раскладывает по разрядам.
const DistributiveWhy = ({ top, mult, tens, units, caption }) => {
  const t = useT();
  const lineStyle = { fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(15px, 2.4vw, 19px)', lineHeight: 1.5 };
  return (
    <div className="frame-tip fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
        <span className="mb-pop" style={{ ...lineStyle, animationDelay: '0s', fontWeight: 700 }}>{top} × {mult}</span>
        <span className="mb-pop" style={{ ...lineStyle, animationDelay: '0.5s' }}>= {top} × (<b style={{ color: T.blue }}>{tens}</b> + <b style={{ color: T.accent }}>{units}</b>)</span>
        <span className="mb-pop" style={{ ...lineStyle, animationDelay: '1s' }}>= <b style={{ color: T.blue }}>{top} × {tens}</b> + <b style={{ color: T.accent }}>{top} × {units}</b></span>
      </div>
      {caption && <p className="body" style={{ margin: 0 }}>{t(caption)}</p>}
    </div>
  );
};

const UI = {
  hint:         { ru: 'Подсказка', uz: 'Maslahat' },
  hide:         { ru: 'Скрыть подсказку', uz: 'Maslahatni yashirish' },
  solution:     { ru: 'Решение', uz: 'Yechim' },
  showSolution: { ru: 'Показать решение', uz: "Yechimni ko'rsatish" },
  replay:       { ru: '↻ Повторить', uz: '↻ Qaytarish' },
  tryAgain:     { ru: 'Не сходится. Загляни в подсказку и попробуй ещё раз.', uz: "To'g'ri kelmadi. Maslahatga qarang va yana urinib ko'ring." },
  retryOk:      { ru: 'Теперь верно. В счёт идёт первая попытка.', uz: "Endi to'g'ri. Hisobga birinchi urinish kiradi." },
  gaveUp:       { ru: 'Ничего страшного. Посмотри разбор решения ниже.', uz: "Hechqisi yo'q. Quyida yechim tahlilini ko'ring." },
  wrongAudio:   { ru: 'Не совсем. Попробуй ещё раз.', uz: "Unchalik emas. Yana urinib ko'ring." }
};

const CheckLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Tekshirish' : 'Проверить';
};

const AnimatedMulSolution = ({ sol, onDone }) => {
  const lang = useLang();
  const narr = (sol.narr && sol.narr[lang]) || [];
  const rowCount = sol.rows.length;
  const lastIdx = narr.length - 1;
  const [runId, setRunId] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [reachedLast, setReachedLast] = useState(false);
  const doneRef = useRef(false);
  const fireDone = () => { if (!doneRef.current) { doneRef.current = true; onDone && onDone(); } };
  const segs = narr.map((text, i) => ({ id: `sol${i}`, text, trigger: i === 0 ? 'on_mount' : `solseq${i}`, waits_for: null, _r: runId }));
  const audio = useAudio(segs);
  useEffect(() => {
    const cs = audio.currentSegment;
    if (cs && cs.slice(0, 3) === 'sol') {
      const k = parseInt(cs.slice(3), 10);
      if (!isNaN(k)) { setMaxStep(m => Math.max(m, Math.min(k + 1, rowCount))); if (k >= lastIdx) setReachedLast(true); }
    }
  }, [audio.currentSegment]);
  useEffect(() => { if (reachedLast && !audio.isPlaying) fireDone(); }, [reachedLast, audio.isPlaying]);
  useEffect(() => { const id = setTimeout(fireDone, (narr.length + 1) * 9000); return () => clearTimeout(id); }, []);
  const onReplay = () => { setMaxStep(0); setReachedLast(false); setRunId(r => r + 1); };

  const shownRows = sol.rows.slice(0, maxStep).map((r, i) => ({ ...r, active: !reachedLast && i === maxStep - 1 }));
  const result = reachedLast ? sol.result : null;
  return (
    <div className="frame-success fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span className="mono small" style={{ color: T.success, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{UI.solution[lang]}</span>
        <button className="btn-ghost" onClick={onReplay} style={{ padding: 'clamp(7px, 1.2vw, 9px) clamp(12px, 1.8vw, 16px)', fontSize: 'clamp(12px, 1.4vw, 13px)' }}>{UI.replay[lang]}</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        <MulColumnStepwise top={sol.top} mult={sol.mult} rows={shownRows} result={result}/>
      </div>
      {reachedLast && narr[lastIdx] && <p className="body" style={{ margin: 0, color: T.ink2 }}>{narr[lastIdx]}</p>}
    </div>
  );
};

const DigitBox = ({ value, onChange, status, locked, label, faded, len = 1 }) => (
  <input
    type="text" inputMode="numeric" maxLength={len} value={value} disabled={locked}
    aria-label={label}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(-len))}
    style={{
      width: len > 1 ? '2.2em' : '1.55em', height: '1.55em', padding: 0, textAlign: 'center',
      fontFamily: MONO.fontFamily, fontWeight: 700, fontSize: faded ? '0.66em' : '1em',
      color: status === 'wrong' ? T.accent : (status === 'ok' ? T.success : T.ink),
      background: T.paper, borderRadius: 7, border: 'none', outline: 'none',
      boxShadow: status === 'wrong' ? `0 0 0 2px ${T.accent}`
        : (status === 'ok' ? `0 0 0 2px ${T.success}` : 'inset 0 0 0 1.5px rgba(58, 53, 48, 0.18)'),
      transition: 'box-shadow 0.15s, color 0.15s'
    }}
  />
);

const MulColumnSolver = ({ top, mul, result, texts, narrSol, onResolved }) => {
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const mulNum = parseInt(mul, 10);
  const dU = String(top).split('').map(Number).reverse();   // единицы первыми
  const writes = []; const carryInto = []; let carry = 0;
  for (let j = 0; j < dU.length; j++) {
    carryInto[j] = carry;
    const p = dU[j] * mulNum + carry;
    writes[j] = p % 10;
    carry = Math.floor(p / 10);
  }
  if (carry > 0) { carryInto.push(carry); writes.push(carry % 10); }
  const resStr = writes.slice().reverse().join('');
  const n = resStr.length;
  const topD = String(top).padStart(n, ' ').split('');
  const expResByPos = writes;
  const expCarryByPos = carryInto;

  const [res, setRes] = useState(Array(n).fill(''));
  const [above, setAbove] = useState(Array(n).fill(''));
  const [solved, setSolved] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const firstRef = useRef(null);
  const attemptsRef = useRef(0);
  const resolvedRef = useRef(false);
  const locked = solved || gaveUp;

  const aboveExp = (d) => { const j = n - 1 - d; return (j >= 1 && expCarryByPos[j] > 0) ? String(expCarryByPos[j]) : null; };
  const allAboveFilled = Array.from({ length: n }).every((_, d) => aboveExp(d) === null || above[d] !== '');
  const allFilled = res.every(v => v !== '') && allAboveFilled;
  const allOk = res.every((v, d) => v === String(expResByPos[n - 1 - d]))
    && Array.from({ length: n }).every((_, d) => { const e = aboveExp(d); return e === null || above[d] === e; });

  const fire = (solvedFlag) => { if (!resolvedRef.current) { resolvedRef.current = true; onResolved && onResolved({ firstOk: firstRef.current === 'ok', solved: solvedFlag, attempts: attemptsRef.current }); } };
  const doCheck = () => {
    if (locked || !allFilled) return;
    const ok = allOk;
    attemptsRef.current += 1;
    if (firstRef.current === null) firstRef.current = ok ? 'ok' : 'wrong';
    if (ok) { setSolved(true); setWrongFlash(false); sfx.playCorrect(); fire(true); }
    else { setWrongFlash(true); setWrongCount(w => w + 1); sfx.playWrong(); }
  };
  // «Показать решение»: ввод остаётся, играет озвученный разбор; «Дальше» — по его окончании (fire в onDone).
  const reveal = () => { if (firstRef.current === null) firstRef.current = 'wrong'; setGaveUp(true); };
  const cellStatus = () => solved ? 'ok' : 'idle';

  const numStyle = { fontFamily: MONO.fontFamily, fontWeight: 600, fontSize: 'clamp(20px, 5vw, 26px)', color: T.ink, textAlign: 'center', minWidth: '1.55em', display: 'inline-block', lineHeight: 1 };
  const cells = [];
  for (let d = 0; d < n; d++) {
    const gc = d + 2;
    const ae = aboveExp(d);
    if (ae !== null) {
      cells.push(<div key={`a${d}`} style={{ gridColumn: gc, gridRow: 1, display: 'flex', justifyContent: 'center' }}>
        <DigitBox value={above[d]} onChange={(v) => { if (!locked) { setWrongFlash(false); setAbove(p => { const a = [...p]; a[d] = v; return a; }); } }} status={cellStatus()} locked={locked} faded len={1} label={`перенос над разрядом ${n - d}`}/>
      </div>);
    }
    cells.push(<div key={`t${d}`} style={{ gridColumn: gc, gridRow: 2, ...numStyle }}>{topD[d] === ' ' ? '\u00A0' : topD[d]}</div>);
    cells.push(<div key={`m${d}`} style={{ gridColumn: gc, gridRow: 3, ...numStyle, color: T.accent }}>{d === n - 1 ? String(mul) : '\u00A0'}</div>);
    cells.push(<div key={`r${d}`} style={{ gridColumn: gc, gridRow: 5, display: 'flex', justifyContent: 'center' }}>
      <DigitBox value={res[d]} onChange={(v) => { if (!locked) { setWrongFlash(false); setRes(p => { const a = [...p]; a[d] = v; return a; }); } }} status={cellStatus()} locked={locked} label={`цифра результата, разряд ${n - d}`}/>
    </div>);
  }

  const hintLine = lang === 'uz'
    ? "Chiziq ustiga dilda saqlanadigan raqamlarni, ostiga javob raqamlarini yozing"
    : 'Над чертой впиши перенос (что держишь в уме), под чертой — цифры ответа';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
      {!locked && <p className="small" style={{ margin: 0, color: T.ink2 }}>{hintLine}</p>}
      <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(20px, 3.4vw, 26px) clamp(10px, 2vw, 18px) clamp(16px, 3vw, 24px)', overflowX: 'auto', boxShadow: (wrongFlash && !solved) ? `0 0 0 2px ${T.accent}, 0 8px 22px -6px rgba(58, 53, 48, 0.14)` : undefined }}>
        <div style={{ display: 'inline-grid', gridTemplateColumns: `auto repeat(${n}, auto)`, alignItems: 'center', columnGap: 'clamp(6px, 1.5vw, 10px)', rowGap: 4 }}>
          <div style={{ gridColumn: 1, gridRow: '2 / 4', alignSelf: 'center', justifySelf: 'center', ...numStyle, color: T.ink2 }}>{'\u00D7'}</div>
          <div style={{ gridColumn: `1 / ${n + 2}`, gridRow: 4, height: 2, background: T.ink, borderRadius: 1, margin: '4px 0' }}/>
          {cells}
        </div>
      </div>
      {!locked && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {wrongCount >= 3 && <button className="btn-ghost" onClick={reveal} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 19px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{UI.showSolution[lang]}</button>}
          <button className="btn-white-accent" disabled={!allFilled} onClick={doCheck} style={{ padding: 'clamp(11px, 1.8vw, 13px) clamp(20px, 2.6vw, 28px)', fontSize: 'clamp(13px, 1.6vw, 14px)' }}><CheckLabel/></button>
        </div>
      )}
      {wrongFlash && !solved && (
        <p className="small" style={{ margin: 0, color: T.accent }}>{lang === 'uz' ? "Hali mos emas — qaytadan tekshiring" : 'Пока не сходится — проверь и нажми ещё раз'}</p>
      )}
      {solved && (
        <div className="frame-success fade-up">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
          <p className="body" style={{ margin: 0 }}>{firstRef.current === 'ok' ? (texts && texts.correct ? t(texts.correct) : '') : UI.retryOk[lang]}</p>
        </div>
      )}
      {gaveUp && narrSol && <AnimatedMulSolution sol={narrSol} onDone={() => fire(false)}/>}
      {gaveUp && !narrSol && texts && texts.reveal && (
        <div className="frame-success fade-up"><p className="body" style={{ margin: 0 }}>{t(texts.reveal)}</p></div>
      )}
    </div>
  );
};

const InteractiveMulColumn = ({ idx, screen, totalScreens, storedAnswer, onAnswer, onNext, onPrev }) => {
  const c = CONTENT[`s${idx}`];
  const meta = SCREEN_META[idx];
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [resolved, setResolved] = useState(storedAnswer !== undefined);

  const handleResolved = ({ firstOk, solved, attempts }) => {
    onAnswer({
      stage: meta.scope, screenIdx: idx,
      question: c.question ? c.question[lang] : null,
      correctAnswer: String(c.result),
      correct: firstOk,
      firstTry: firstOk,
      attempts,
      solved
    });
    setResolved(true);
    audio.triggerEvent('check_pressed');
    // верно → короткая озвучка ответа; «Решение» (give-up) озвучивает AnimatedMulSolution сам
    if (solved && ANSWER_VOICE[c.result] && !audio.muted) {
      setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ANSWER_VOICE[c.result][lang]); }, 250);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!resolved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: resolved ? 'clamp(11px, 1.8vw, 15px)' : 'clamp(16px, 2.5vw, 22px)' }}>
        <Floaters/>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          {resolved
            ? <p className="small" style={{ marginTop: 5, color: T.ink2 }}>{t(c.question)}</p>
            : <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>}
        </div>
        <div className="fade-up delay-1"><MulColumnSolver top={c.top} mul={c.mul} result={c.result} texts={{ correct: c.fb_correct, reveal: c.fb_wrong }} narrSol={SOLUTIONS[idx]} onResolved={handleResolved}/></div>
      </div>
    </Stage>
  );
};

const MulSumSolver = ({ sol, onResolved }) => {
  const lang = useLang();
  const sfx = useSfx();
  const expected = sol.result.digits;
  const W = expected.length;
  const topD = String(sol.top).padStart(W, ' ').split('');
  const multD = sol.mult.map(m => m.d);

  const [res, setRes] = useState(Array(W).fill(''));
  const [solved, setSolved] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const attemptsRef = useRef(0);
  const resolvedRef = useRef(false);
  const locked = solved || gaveUp;

  const allFilled = res.every(v => v !== '');
  const allOk = res.join('') === expected;

  const fire = (solvedFlag) => { if (!resolvedRef.current) { resolvedRef.current = true; onResolved && onResolved({ solved: solvedFlag, attempts: attemptsRef.current }); } };
  const doCheck = () => {
    if (locked || !allFilled) return;
    attemptsRef.current += 1;
    if (allOk) { setSolved(true); setWrongFlash(false); sfx.playCorrect(); fire(true); }
    else { setWrongFlash(true); setWrongCount(w => w + 1); sfx.playWrong(); }
  };
  const reveal = () => { setGaveUp(true); };
  const cellStatus = () => solved ? 'ok' : 'idle';

  const numStyle = { fontFamily: MONO.fontFamily, fontWeight: 600, fontSize: 'clamp(18px, 4.2vw, 23px)', color: T.ink, textAlign: 'center', minWidth: '1.55em', display: 'inline-block', lineHeight: 1 };
  const R = sol.rows.length;
  const cells = [];
  // верхнее число и множитель — по правому краю
  for (let d = 0; d < W; d++) {
    cells.push(<div key={`t${d}`} style={{ gridColumn: d + 2, gridRow: 1, ...numStyle }}>{topD[d] === ' ' ? '\u00A0' : topD[d]}</div>);
  }
  for (let k = 0; k < multD.length; k++) {
    const gc = 2 + (W - multD.length) + k;
    cells.push(<div key={`m${k}`} style={{ gridColumn: gc, gridRow: 2, ...numStyle, color: sol.mult[k].color, fontWeight: 600 }}>{multD[k]}</div>);
  }
  // строки неполных произведений (готовые), со сдвигом; знак «+» у последней
  sol.rows.forEach((r, ri) => {
    const L = r.digits.length;
    const s = r.shift || 0;
    for (let k = 0; k < L; k++) {
      const pos = s + (L - 1 - k);            // разряд цифры (0 = единицы)
      const gc = 2 + (W - 1 - pos);
      cells.push(<div key={`p${ri}_${k}`} style={{ gridColumn: gc, gridRow: 4 + ri, ...numStyle, color: r.color, fontWeight: 600 }}>{r.digits[k]}</div>);
    }
  });
  // клетки ввода суммы
  for (let d = 0; d < W; d++) {
    cells.push(<div key={`r${d}`} style={{ gridColumn: d + 2, gridRow: 5 + R, display: 'flex', justifyContent: 'center' }}>
      <DigitBox value={res[d]} onChange={(v) => { if (!locked) { setWrongFlash(false); setRes(p => { const a = [...p]; a[d] = v; return a; }); } }} status={cellStatus()} locked={locked} label={`цифра суммы, разряд ${W - d}`}/>
    </div>);
  }

  const hintLine = lang === 'uz'
    ? "Qatorlarni xonama-xona qo'shing. Surishni unutmang: o'ngdagi bo'sh joy nol degani"
    : 'Сложи строки по разрядам. Помни про сдвиг: пустое место справа считай нулём';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
      {!locked && <p className="small" style={{ margin: 0, color: T.ink2 }}>{hintLine}</p>}
      <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(20px, 3.4vw, 26px) clamp(10px, 2vw, 18px) clamp(16px, 3vw, 24px)', overflowX: 'auto', boxShadow: (wrongFlash && !solved) ? `0 0 0 2px ${T.accent}, 0 8px 22px -6px rgba(58, 53, 48, 0.14)` : undefined }}>
        <div style={{ display: 'inline-grid', gridTemplateColumns: `auto repeat(${W}, auto)`, alignItems: 'center', columnGap: 'clamp(5px, 1.3vw, 9px)', rowGap: 4 }}>
          <div style={{ gridColumn: 1, gridRow: '1 / 3', alignSelf: 'center', justifySelf: 'center', ...numStyle, color: T.ink2 }}>{'\u00D7'}</div>
          <div style={{ gridColumn: `1 / ${W + 2}`, gridRow: 3, height: 2, background: T.ink, borderRadius: 1, margin: '4px 0' }}/>
          <div style={{ gridColumn: 1, gridRow: 3 + R, alignSelf: 'center', justifySelf: 'center', ...numStyle, color: T.ink2 }}>{'+'}</div>
          <div style={{ gridColumn: `1 / ${W + 2}`, gridRow: 4 + R, height: 2, background: T.ink, borderRadius: 1, margin: '4px 0' }}/>
          {cells}
        </div>
      </div>
      {!locked && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {wrongCount >= 3 && <button className="btn-ghost" onClick={reveal} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 19px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{UI.showSolution[lang]}</button>}
          <button className="btn-white-accent" disabled={!allFilled} onClick={doCheck} style={{ padding: 'clamp(11px, 1.8vw, 13px) clamp(20px, 2.6vw, 28px)', fontSize: 'clamp(13px, 1.6vw, 14px)' }}><CheckLabel/></button>
        </div>
      )}
      {wrongFlash && !solved && (
        <p className="small" style={{ margin: 0, color: T.accent }}>{lang === 'uz' ? "Hali mos emas — qaytadan tekshiring" : 'Пока не сходится — проверь и нажми ещё раз'}</p>
      )}
      {solved && (
        <div className="frame-success fade-up">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "Endi to'g'ri" : 'Теперь верно'}</p>
          <p className="body" style={{ margin: 0 }}>{UI.retryOk[lang]}</p>
        </div>
      )}
      {gaveUp && sol.narr && <AnimatedMulSolution sol={sol} onDone={() => fire(false)}/>}
    </div>
  );
};

// ============================================================
// FAKT-ANIMATSIYALAR (CSS-only, .pa-st reuse) — nat_5_04
// ============================================================
// Surish: raqamlar bir xona chapga siljiydi.
const AnimShift = () => (
  <div className="pa-st" aria-hidden="true">
    {['2', '1', '3', '→'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);
// IT: ikkilik sanoq.
const AnimBinary = () => (
  <div className="pa-st" aria-hidden="true">
    {['1', '0', '1', '0'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);
// Tarix: nol — bo'sh xona belgisi.
const AnimZero = () => (
  <div className="pa-st" aria-hidden="true">
    {['2', '0', '4'].map((ch, i) => (
      <span key={i} className="pa-st-c" style={{ animationDelay: `${i * 0.3}s` }}>{ch}</span>
    ))}
  </div>
);

// ============================================================
// SCREEN-KOMPONENTLAR — nat_5_04 (13 ekran)
// ============================================================

// Screen0 — HOOK (telefon REC kadri). Qaytishda picked TO'LIQ sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const opts = [c.opt_no, c.opt_yes, c.opt_idk];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: screen, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
    audio.triggerEvent('option_picked');
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.global_q))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.claim_lead))}</p>
        <div className="rec-frame fade-up delay-1" style={{ position: 'relative' }}>
          <span className="rec-tag"><span className="rec-dot"/>REC</span>
          <span className="rec-eq">213 × 12 = <span className="rec-glitch">639</span></span>
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
      </div>
    </Stage>
  );
};

// Screen1 — WARM-UP MC (keep-visible QuestionScreen)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [3, 0, 2, 1]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// Screen2 — EXPLORATION (213×12, why-shift). Step-by-step + DistributiveWhy + fakt.
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const [factShown, setFactShown] = useState(false);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); if (ns >= last && !factShown) { setFactShown(true); if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.fact_audio[lang]); } } } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const ROWS = [];
  if (step >= 1) ROWS.push({ digits: '426', shift: 0, color: T.accent, caption: '213 × 2', active: step === 1, work: [{ a: 3, b: 2 }, { a: 1, b: 2 }, { a: 2, b: 2 }] });
  if (step >= 2) ROWS.push({ digits: '213', shift: 1, color: T.blue, caption: '213 × 1 (десятки)', active: step === 2, work: [{ a: 3, b: 1 }, { a: 1, b: 1 }, { a: 2, b: 1 }] });
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px) clamp(10px, 2vw, 18px)', overflowX: 'auto', minHeight: 150 }}>
          <MulColumnStepwise top="213" mult={[{ d: '1', color: T.blue }, { d: '2', color: T.accent }]} rows={ROWS} result={step >= last ? { digits: '2556' } : null}/>
        </div>
        {step >= last && <DistributiveWhy top="213" mult="12" tens="10" units="2" caption={c.why_caption}/>}
        {factShown && <FactCard text={c.fact} badge={FB_MATH} anim={<AnimShift/>}/>}
      </div>
    </Stage>
  );
};

// Screen3 — RULE (ustun ko'paytirish qoidasi)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio([{ id: 's3', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'next' } }]);
  const rules = [c.rule_1, c.rule_2];
  const goNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={goNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.term))}</p>
        </div>
        <div className="fade-up delay-3" style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ flexShrink: 0, paddingTop: 3 }}><ArrowLeft color={T.ink3}/></span>
          <span className="small" style={{ color: T.ink3 }}>{mt(t(c.ref))}</span>
        </div>
      </div>
    </Stage>
  );
};

// Screen4 — MASHINA (interaktiv ustun, 245×4)
const Screen4 = (props) => <InteractiveMulColumn {...props} idx={props.screen} totalScreens={TOTAL_SCREENS}/>;

// Screen5 — ERROR-SPOTTING (custom): xato yechimni topish (245×14)
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5; const sfx = useSfx();
  const meta = SCREEN_META[screen];
  const audio = useAudio([{ id: 's5_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const correctIndex = c.errorIdx;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIndex : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isCorrect = i === correctIndex;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstIdxRef.current = i; }
    attemptsRef.current += 1;
    setPicked(i);
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isCorrect) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: meta?.scope ?? null, screenIdx: screen, question: c.question[lang], correctIndex, correctAnswer: c.solvers[correctIndex].name[lang], studentAnswerIndex: firstIdxRef.current, studentAnswer: c.solvers[firstIdxRef.current].name[lang], correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }
    if (!audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) {
          const wrongVoice = (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wrongVoice);
        }
      }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-sub" style={{ marginBottom: 6 }}>{mt(t(c.question))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {c.solvers.map((sv, i) => {
            const isWrongPicked = wrong.has(i);
            const isErr = i === correctIndex;
            const dim = isWrongPicked || (solved && !isErr);
            return (
              <button key={i} className="frame" disabled={solved || isWrongPicked} onClick={() => pick(i)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 'clamp(12px, 2vw, 16px)', cursor: solved || isWrongPicked ? 'default' : 'pointer', border: 'none', background: '#FFFFFF', opacity: dim ? 0.4 : 1, boxShadow: solved && isErr ? `0 0 0 2px ${T.success}` : (isWrongPicked ? `0 0 0 2px ${T.accent}` : undefined), transition: 'opacity 0.4s, box-shadow 0.2s' }}>
                <span className="mono small" style={{ fontWeight: 700, color: solved && isErr ? T.success : T.ink2 }}>{sv.name[lang]}</span>
                <MulColumnStepwise top={c.top} mult={[{ d: '1', color: T.ink }, { d: '4', color: T.ink }]} rows={sv.rows.map(r => ({ ...r, color: T.ink }))} result={{ digits: sv.result }}/>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
          </p>
          <p className="body" style={{ margin: 0 }}>{mt(solved ? t(c.correct_text) : t(c[`wrong_${picked}`] || c.audio.on_wrong))}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Screen6 — EXPLORATION (132×204, nol qator). Step-by-step + fakt.
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s6_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const [factShown, setFactShown] = useState(false);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); if (ns >= last && !factShown) { setFactShown(true); if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.fact_audio[lang]); } } } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const ROWS = [];
  if (step >= 1) ROWS.push({ digits: '528', shift: 0, color: T.accent, caption: '132 × 4', active: step === 1, work: [{ a: 2, b: 4 }, { a: 3, b: 4, carryIn: 1 }, { a: 1, b: 4, carryIn: 1 }] });
  if (step >= 2) ROWS.push({ digits: '0', shift: 1, color: T.ink3, caption: '132 × 0 (десятки)', kind: 'zero', active: step === 2 });
  if (step >= 3) ROWS.push({ digits: '264', shift: 2, color: T.blue, caption: '132 × 2 (сотни)', active: step === 3, work: [{ a: 2, b: 2 }, { a: 3, b: 2 }, { a: 1, b: 2 }] });
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px) clamp(10px, 2vw, 18px)', overflowX: 'auto', minHeight: 150 }}>
          <MulColumnStepwise top="132" mult={[{ d: '2', color: T.blue }, { d: '0', color: T.ink3 }, { d: '4', color: T.accent }]} rows={ROWS} result={step >= last ? { digits: '26928' } : null}/>
        </div>
        {factShown && <FactCard text={c.fact} badge={FB_IT} anim={<AnimBinary/>}/>}
      </div>
    </Stage>
  );
};

// Screen7 — RULE (surish + nol). frame-tip + fakt (Tarix).
const Screen7 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const audio = useAudio([{ id: 's7', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'next' } }]);
  const rules = [c.rule_1, c.rule_2];
  const [factShown, setFactShown] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => { setFactShown(true); }, 600);
    return () => clearTimeout(id);
  }, []);
  const goNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={goNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn))}</p>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ flexShrink: 0, paddingTop: 3 }}><ArrowLeft color={T.ink3}/></span>
          <span className="small" style={{ color: T.ink3 }}>{mt(t(c.ref))}</span>
        </div>
        {factShown && <FactCard text={c.fact} badge={FB_HIST} anim={<AnimZero/>}/>}
      </div>
    </Stage>
  );
};

// Screen8 — PARTIAL-PRODUCTS (MulSumSolver, 213×103)
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const idx = screen;
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const meta = SCREEN_META[idx];
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [resolved, setResolved] = useState(storedAnswer !== undefined);
  const handleResolved = ({ solved, attempts }) => {
    const firstTry = solved && attempts === 1;
    onAnswer({ stage: meta.scope, screenIdx: idx, question: c.question[lang], correctAnswer: c.result, correct: storedAnswer?.firstTry ?? solved, firstTry: storedAnswer?.firstTry ?? firstTry, attempts, solved });
    setResolved(true);
    audio.triggerEvent('check_pressed');
    if (solved && ANSWER_VOICE[c.result] && !audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ANSWER_VOICE[c.result][lang]); }, 250); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!resolved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: resolved ? 'clamp(11px, 1.8vw, 15px)' : 'clamp(16px, 2.5vw, 22px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          {resolved
            ? <p className="small" style={{ marginTop: 5, color: T.ink2 }}>{mt(t(c.question))}</p>
            : <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>}
        </div>
        <div className="fade-up delay-1"><MulSumSolver sol={SOLUTIONS[idx]} onResolved={handleResolved}/></div>
      </div>
    </Stage>
  );
};

// Screen9 — ORDERING (custom): 132×204 qadamlarini tartibga sol. веди-до-верного.
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9; const sfx = useSfx();
  const meta = SCREEN_META[screen];
  const audio = useAudio([{ id: 's9_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const correctOrder = c.correctOrder;
  // Doimiy displey tartibi (Math.random emas — restore uchun).
  const displaySteps = [c.steps[2], c.steps[0], c.steps[3], c.steps[1]];
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [placed, setPlaced] = useState(() => wasSolved ? correctOrder.slice() : []);
  const [flashId, setFlashId] = useState(null);
  const [hintShown, setHintShown] = useState(false);
  const solved = placed.length === correctOrder.length;
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const wrongRef = useRef(false);
  const introAdvancedRef = useRef(wasSolved);
  const recordedRef = useRef(wasSolved);
  const tapStep = (id) => {
    if (solved || placed.includes(id)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const expected = correctOrder[placed.length];
    if (id === expected) {
      const next = [...placed, id];
      setPlaced(next); setHintShown(false); sfx.playCorrect();
      if (next.length === correctOrder.length && !recordedRef.current) {
        recordedRef.current = true;
        const firstTry = !wrongRef.current;
        if (firstTryRef.current === null) firstTryRef.current = firstTry;
        onAnswer({ stage: meta?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: correctOrder.join(''), studentAnswer: next.join(''), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: 1, solved: true });
        if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
      }
    } else {
      wrongRef.current = true;
      setFlashId(id); setHintShown(true); sfx.playWrong();
      setTimeout(() => setFlashId(null), 500);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const stepById = (id) => c.steps.find(s => s.id === id);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="has-amb" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up">
          <h2 className="title h-sub" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {placed.map((id, i) => (
            <div key={`p${id}`} className="frame" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(11px, 1.8vw, 14px)', border: 'none', background: '#FFFFFF', boxShadow: `0 0 0 2px ${T.success}` }}>
              <span className="mono small" style={{ minWidth: 22, fontWeight: 700, color: T.success }}>{i + 1}</span>
              <span className="body" style={{ flex: 1 }}>{mt(t(stepById(id).text))}</span>
            </div>
          ))}
          {displaySteps.filter(s => !placed.includes(s.id)).map((s) => (
            <button key={`o${s.id}`} className="option" disabled={solved} onClick={() => tapStep(s.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(11px, 1.8vw, 14px)', boxShadow: flashId === s.id ? `0 0 0 2px ${T.accent}` : undefined }}>
              <span className="mono small" style={{ minWidth: 22, color: T.ink3 }}>·</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{mt(t(s.text))}</span>
            </button>
          ))}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <div className="frame-success fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// Screen10 — CASE MC (124×36, Nigora)
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// Screen11 — FINAL MC (1248×104)
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 3, 1, 0]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// Screen12 — SUMMARY
const Screen12 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
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

export default function NatMultiplyLesson({
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

/* === MASHINA (ustun ko'paytirish) — nat_5_04 === */
@keyframes mb-pop-in { from { opacity: 0; transform: translateY(6px) scale(0.9); } to { opacity: 1; transform: none; } }
.mb-pop { display: inline-block; animation: mb-pop-in 0.32s ease-out both; }
.mb-work { display: flex; flex-direction: column; gap: 8px; align-items: center; width: 100%; }
.mb-work-title { font-weight: 600; letter-spacing: 0.04em; }
.mb-work-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.mb-chip { background: #FFFFFF; border-radius: 10px; padding: 6px 10px; font-size: clamp(13px, 1.7vw, 15px); box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.16); white-space: nowrap; }
.mb-carry { font-size: 0.6em; margin-left: 1px; font-weight: 700; }

/* === Screen0 telefon REC kadri === */
.rec-frame { display: flex; align-items: center; justify-content: center; gap: clamp(12px, 3vw, 22px); flex-wrap: wrap; background: #1A1A1E; color: #FFFFFF; border-radius: 16px; padding: clamp(18px, 3.5vw, 28px) clamp(16px, 3vw, 26px); box-shadow: 0 12px 30px -10px rgba(14, 14, 16, 0.5); }
.rec-tag { display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.6vw, 14px); letter-spacing: 0.12em; color: #FF4F28; }
.rec-dot { width: 9px; height: 9px; border-radius: 50%; background: #FF4F28; animation: rec-pulse 1.2s ease-in-out infinite; }
@keyframes rec-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
.rec-eq { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(22px, 5vw, 34px); color: #FFFFFF; }
.rec-glitch { color: #FF7A5C; display: inline-block; animation: rec-glitch 1.6s ease-in-out infinite; }
@keyframes rec-glitch { 0%, 100% { transform: none; opacity: 1; } 20% { transform: translateX(-1.5px) skewX(-4deg); opacity: 0.7; } 40% { transform: translateX(1.5px); opacity: 1; } 60% { transform: translateX(-1px) skewX(3deg); opacity: 0.6; } 80% { transform: translateX(1px); opacity: 1; } }
`;
