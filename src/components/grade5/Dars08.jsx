import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Степень числа. Квадрат и куб — nat_5_06
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
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'm' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// ============================================================
// TTS-ТЕГИ (язык/тон) — внутри text, в квадратных скобках; на экран НЕ показываются.
// ============================================================
const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const END_TAG = '[end]';
const TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]/g;

const stripAudioTags = (s) => typeof s === 'string'
  ? s.replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]\s*/g, '')
      .replace(/\[[a-zа-яё][^\]]*\]\s*/gi, '')
      .replace(/\s{2,}/g, ' ').trim()
  : s;

// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык — маркерами внутри text (только смешанные строки языковых курсов); math шлёт без маркеров,
// сервер определяет язык сам (ru=кириллица, uz=латиница). Движок свой тег НЕ добавляет.
function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = 'm'; // v5.5-male: erkak ovoz qattiq qulflangan
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

  setLang(lang) { this.currentLang = lang; }              // только preview Web Speech
  setGender(g) { this.gender = 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет

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

    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, gender);
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
    engine.setGender(ttsConfig.voiceGender || 'm');
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
      <div className="stage-content has-amb" style={{ paddingLeft: padH, paddingRight: padH }}>
        <Floaters/>
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
        {/* keep-visible anti-scroll: to'g'ri javobdan keyin savol+to'g'ri variant qoladi, noto'g'rilar yig'iladi. */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;
            if (solved) {
              if (isCorrect) cls += ' option-correct';
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
// --- POD UROK: nat_5_06 — Sonning darajasi. Kvadrat va kub / Степень числа. Квадрат и куб (PROMPT 2026-06-17) ---
// Markaziy misconception M1: "a² = a·2" (kvadratni ikkiga ko'paytirish deb chalkashtirish; 5²=10 deb).
// M2: "a³ = a·3" (kub uchun xuddi shu). M3: "3² = 2³" (asos va ko'rsatkich o'rin almashtirish).
// Asosiy usul: daraja — bir xil ko'paytuvchilar ko'paytmasi; kvadrat = a×a kvadrat-setka (geometrik),
// kub = a×a×a izometrik kub. Vizualizator: DarajaGrid (SquareGrid + CubeStack).
// Hook (konseptual): "Nega 3·3·3·3·3 ni 3⁵ deb yozamiz?" — tuzoq C: 3·5 (aⁿ vs a·n).
// Case: Nilufar piksel-logotip (6×6). Faktlar (DRAFT): kvadrat sonlar = toq sonlar yig'indisi (Fan) /
// kompyuter xotirasi 2¹⁰=1024 bayt=1 KB (IT) / shaxmat-guruch afsonasi 2⁶³ (Tarix).
// Test turlari: warm-up MC / NumInput 5² / MC noto'g'risini-top / MC 2³ / NumInput fill-blank /
// tasniflash (tap-to-place, mobil) / final MC.
// ============================================================
const TOTAL_SCREENS = 11;
const LESSON_META = {
  lessonId: 'nat_5_06',
  lessonTitle: { ru: 'Степень числа. Квадрат и куб', uz: "Sonning darajasi. Kvadrat va kub" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 'b1',  type: 'test',        template: 'SeqMix',         scored: true,  scope: 'practice' }, // 7  BLOCK A (s7-s11)
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },       // 8  case setup
  { id: 'b2',  type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },     // 9  BLOCK B (s13+yangi)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {
  // ===== s0 HOOK =====
  s0: {
    eyebrow: { ru: 'Зачем короткая запись', uz: "Nega qisqa yozuv" },
    title: { ru: 'Длинно или коротко?', uz: "Uzunmi yoki qisqa?" },
    lead: { ru: 'Как записать 3·3·3·3·3 короче?', uz: "3·3·3·3·3 ni qanday qisqaroq yozamiz?" },
    opt0: { ru: 'Есть короткая запись — степень', uz: "Qisqa yozuv bor — daraja" },
    opt1: { ru: 'Никак, только полным умножением', uz: "Hech qanday, faqat to'liq ko'paytma bilan" },
    opt2: { ru: 'Можно записать 3·5', uz: "3·5 deb yozsa bo'ladi" },
    reveal0: { ru: 'Верно! Одинаковые множители сворачивают в степень: 3·3·3·3·3 = 3⁵. Сейчас разберёмся.', uz: "To'g'ri! Bir xil ko'paytuvchilar darajaga yig'iladi: 3·3·3·3·3 = 3⁵. Hozir ko'rib chiqamiz." },
    reveal1: { ru: 'Полная запись работает, но она длинная. Есть короткая — степень. Посмотрим.', uz: "To'liq yozuv ishlaydi, lekin uzun. Qisqa yozuv bor — daraja. Ko'ramiz." },
    reveal2: { ru: 'Осторожно: 3·5 = 15, это сложение пяти троек. А тут тройка умножается сама на себя — это 3⁵, намного больше.', uz: "Ehtiyot bo'ling: 3·5 = 15, bu beshta uchni qo'shish. Bu yerda esa uch o'ziga ko'payadi — bu 3⁵, ancha katta." },
    audio: { ru: "Посмотри на длинную запись. Её можно записать гораздо короче. Как думаешь?", uz: "Uzun yozuvga qarang. Uni ancha qisqa yozish mumkin. Sizningcha, qanday?" }
  },

  // ===== s1 WARM-UP (prereq: ko'paytirish) =====
  s1: {
    eyebrow: { ru: 'Вспомним умножение', uz: "Ko'paytmani eslaylik" },
    title: { ru: 'Разминка', uz: "Mashq" },
    question: { ru: 'Сколько будет 3·3·3?', uz: "3·3·3 nechaga teng?" },
    opt0: { ru: '27', uz: '27' },
    opt1: { ru: '9', uz: '9' },
    opt2: { ru: '6', uz: '6' },
    opt3: { ru: '12', uz: '12' },
    correct_text: { ru: 'Верно: 3·3 = 9, потом 9·3 = 27. Скоро запишем это короче.', uz: "To'g'ri: 3·3 = 9, keyin 9·3 = 27. Tez orada qisqaroq yozamiz." },
    wrong_1: { ru: 'Это только три умножить на три. Множителей три — умножь ещё на три.', uz: "Bu faqat uchni uchga ko'paytirish. Ko'paytuvchilar uchta — yana uchga ko'paytiring." },
    wrong_2: { ru: 'Это три плюс три. Здесь множители умножают, а не складывают.', uz: "Bu uch qo'shuv uch. Bu yerda ko'paytuvchilar ko'paytiriladi, qo'shilmaydi." },
    wrong_3: { ru: 'Почти. Пересчитай: три умножить на три равно девять, затем девять умножить на три.', uz: "Deyarli. Qayta sanang: uchni uchga ko'paytirsak to'qqiz, keyin to'qqizni uchga." },
    audio: {
      intro: { ru: "Вспомним умножение. Сколько будет три на три и ещё на три?", uz: "Ko'paytmani eslaylik. Uchni uchga, yana uchga ko'paytirsak qancha bo'ladi?" },
      on_correct: { ru: "Отлично, двадцать семь. Запомним это число.", uz: "Ajoyib, yigirma yetti. Shu sonni yodda tutaylik." },
      on_wrong: { ru: "Ещё раз: сначала три на три, потом результат на три.", uz: "Yana bir bor: avval uchni uchga, keyin natijani uchga." }
    }
  },

  // ===== s2 EXPLORATION — daraja yozuvi (step) =====
  s2: {
    eyebrow: { ru: 'Запись степени', uz: "Daraja yozuvi" },
    title: { ru: 'Свернём в степень', uz: "Darajaga yig'amiz" },
    lead: { ru: 'Помни 3·3·3 = 27? Теперь запишем это короче.', uz: "3·3·3 = 27 ni eslaysizmi? Endi buni qisqaroq yozamiz." },
    line_chain: { ru: 'Пять одинаковых множителей: 3·3·3·3·3', uz: "Beshta bir xil ko'paytuvchi: 3·3·3·3·3" },
    line_power: { ru: 'Коротко это степень: 3⁵', uz: "Qisqacha bu daraja: 3⁵" },
    line_base: { ru: 'Внизу основание: какое число умножаем.', uz: "Pastda asos: qaysi sonni ko'paytiramiz." },
    line_exp: { ru: 'Вверху показатель: сколько раз.', uz: "Tepada ko'rsatkich: necha marta." },
    line_one: { ru: 'Первая степень равна самому числу: 3¹ = 3.', uz: "Birinchi daraja sonning o'ziga teng: 3¹ = 3." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Помни, мы перемножали тройки. Теперь посмотрим, что делать, когда одинаковых множителей много.",
        "Вот пять одинаковых множителей. Записывать их полностью долго и легко ошибиться.",
        "Поэтому сворачиваем в короткую запись. Нижнее число говорит, какое число мы умножаем.",
        "Верхнее число говорит, сколько раз мы умножаем.",
        "Если число берут один раз, его первая степень равна самому числу."
      ],
      uz: [
        "Yodingizdami, uchlarni ko'paytirgandik. Endi bir xil ko'paytuvchilar ko'p bo'lganda nima qilishni ko'ramiz.",
        "Mana beshta bir xil ko'paytuvchi. Hammasini yozish uzun va xato qilish oson.",
        "Shuning uchun qisqa yozuvga yig'amiz. Pastdagi son qaysi sonni ko'paytirayotganimizni aytadi.",
        "Tepadagi son necha marta ko'paytirayotganimizni aytadi.",
        "Agar son bir marta olinsa, uning birinchi darajasi o'ziga teng bo'ladi."
      ]
    }
  },

  // ===== s3 EXPLORATION — KVADRAT (slider) =====
  s3: {
    eyebrow: { ru: 'Квадрат числа', uz: "Sonning kvadrati" },
    title: { ru: 'Вторая степень — квадрат', uz: "Ikkinchi daraja — kvadrat" },
    lead: { ru: 'Двигай сторону и смотри на клетки.', uz: "Tomonni suring va kataklarga qarang." },
    slider_label: { ru: 'Сторона', uz: "Tomon" },
    line_def: { ru: 'a² = a·a — число, умноженное само на себя.', uz: "a² = a·a — son o'ziga ko'paytirilgani." },
    line_why: { ru: 'Клетки заполняют квадрат. Поэтому это и есть квадрат.', uz: "Kataklar kvadratni to'ldiradi. Shuning uchun bu kvadrat." },
    line_warn: { ru: 'Не путай: a·2 — это всего два ряда, а не квадрат.', uz: "Adashtirmang: a·2 — atigi ikki qator, kvadrat emas." },
    audio: { ru: "Вторая степень — квадрат. Двигай сторону: клетки всегда образуют квадрат. Умножить на два — это не квадрат.", uz: "Ikkinchi daraja — kvadrat. Tomonni suring: kataklar har doim kvadrat hosil qiladi. Ikkiga ko'paytirish kvadrat emas." }
  },

  // ===== s4 EXPLORATION — KUB (slider) =====
  s4: {
    eyebrow: { ru: 'Куб числа', uz: "Sonning kubi" },
    title: { ru: 'Третья степень — куб', uz: "Uchinchi daraja — kub" },
    lead: { ru: 'Двигай ребро и смотри на кубики.', uz: "Qirrani suring va kublarga qarang." },
    slider_label: { ru: 'Ребро', uz: "Qirra" },
    line_def: { ru: 'a³ = a·a·a — три одинаковых множителя.', uz: "a³ = a·a·a — uchta bir xil ko'paytuvchi." },
    line_why: { ru: 'Маленькие кубики заполняют большой куб. Поэтому это куб.', uz: "Kichik kublar katta kubni to'ldiradi. Shuning uchun bu kub." },
    audio: { ru: "Третья степень — куб. Двигай ребро: маленькие кубики образуют полный куб.", uz: "Uchinchi daraja — kub. Qirrani suring: kichik kublar to'la kubni hosil qiladi." }
  },

  // ===== s5 RULE 1 =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Степень числа', uz: "Sonning darajasi" },
    rule_label: { ru: 'Запомни', uz: "Yodda tuting" },
    rule_1: { ru: 'Степень — это произведение одинаковых множителей.', uz: "Daraja — bir xil ko'paytuvchilar ko'paytmasi." },
    rule_2: { ru: 'Квадрат: a² = a·a.  Куб: a³ = a·a·a.', uz: "Kvadrat: a² = a·a.  Kub: a³ = a·a·a." },
    rule_3: { ru: 'Первая степень: a¹ = a.', uz: "Birinchi daraja: a¹ = a." },
    rule_4: { ru: 'Нижнее число — основание, верхнее — показатель.', uz: "Pastki son — asos, tepadagi — ko'rsatkich." },
    audio: { ru: "Итак, степень — это произведение одинаковых множителей. Вторую степень называют квадратом, третью — кубом.", uz: "Demak, daraja bir xil ko'paytuvchilarning ko'paytmasi. Ikkinchi daraja kvadrat, uchinchisi kub deyiladi." }
  },

  // ===== s6 RULE 2 — TUZOQ =====
  s6: {
    eyebrow: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    heading: { ru: 'Частая ошибка', uz: "Ko'p uchraydigan xato" },
    warn_1: { ru: 'a² — это a·a, а не a·2.', uz: "a² — bu a·a, a·2 emas." },
    warn_ex: { ru: 'Например: 5² = 25, а 5·2 = 10. Это разные числа.', uz: "Masalan: 5² = 25, 5·2 esa 10. Bular boshqa-boshqa sonlar." },
    warn_2: { ru: 'Показатель говорит, сколько раз умножать, а не на сколько.', uz: "Ko'rsatkich necha marta ko'paytirishni aytadi, nechaga emas." },
    audio: { ru: "Вот здесь многие ошибаются. Квадрат — это умножить число само на себя, а не на два. Пять в квадрате — двадцать пять, а пять умножить на два — десять.", uz: "Mana shu yerda ko'p bola adashadi. Kvadrat — sonni o'ziga ko'paytirish, ikkiga ko'paytirish emas. Beshning kvadrati yigirma besh, beshni ikkiga ko'paytirsak esa o'n." }
  },

  // ===== s7 TEST NumInput — 5² = 25 =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'Вычисли: 5²', uz: "Hisoblang: 5²" },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Квадрат — это число само на себя: пять умножить на пять. Не пять умножить на два.', uz: "Kvadrat — son o'ziga ko'paytirilgani: beshni beshga. Beshni ikkiga emas." },
    fb_correct: { ru: 'Верно: 5·5 = 25.', uz: "To'g'ri: 5·5 = 25." },
    audio: {
      intro: { ru: "Вычисли пять в квадрате. Помни: само на себя.", uz: "Beshning kvadratini hisoblang. Yodingizda bo'lsin: o'ziga ko'paytiriladi." },
      on_correct: { ru: "Верно, двадцать пять.", uz: "To'g'ri, yigirma besh." },
      on_wrong: { ru: "Не то. Умножь пять само на себя, а не на два.", uz: "Emas. Beshni o'ziga ko'paytiring, ikkiga emas." }
    }
  },

  // ===== s8 TEST — Noto'g'risini top [FAKT toq sonlar] =====
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Внимание, вопрос наоборот', uz: "Diqqat, savol teskari" },
    question: { ru: 'В каком равенстве ошибка?', uz: "Qaysi tenglikda xato bor?" },
    opt0: { ru: '6² = 36', uz: '6² = 36' },
    opt1: { ru: '2³ = 8', uz: '2³ = 8' },
    opt2: { ru: '10² = 100', uz: '10² = 100' },
    opt3: { ru: '4² = 8', uz: '4² = 8' },
    correct_text: { ru: 'Верно! 4² = 4·4 = 16, а не 8. Восьмёрка — это 4·2. Вот и ошибка.', uz: "To'g'ri! 4² = 4·4 = 16, 8 emas. Sakkiz — bu 4·2. Mana xato shu." },
    wrong_0: { ru: 'Шесть в квадрате это шесть умножить на шесть, будет тридцать шесть — это верно. Ищи ошибочное равенство.', uz: "Olti kvadrati — oltini oltiga ko'paytirsak o'ttiz olti, bu to'g'ri. Xato tenglikni qidiring." },
    wrong_1: { ru: 'Два в кубе это два умножить на два и ещё на два, будет восемь — верно. Это не ошибка.', uz: "Ikki kubi — ikkini ikkiga, yana ikkiga ko'paytirsak sakkiz, to'g'ri. Bu xato emas." },
    wrong_2: { ru: 'Десять в квадрате это десять умножить на десять, будет сто — верно. Ищи ошибку.', uz: "O'n kvadrati — o'nni o'nga ko'paytirsak yuz, to'g'ri. Xatoni qidiring." },
    fact: { ru: 'Квадраты — это суммы нечётных чисел: 1, потом 1+3=4, потом 1+3+5=9. Поэтому квадрат всегда складывается из таких слоёв.', uz: "Kvadrat sonlar — toq sonlar yig'indisi: 1, keyin 1+3=4, keyin 1+3+5=9. Shuning uchun kvadrat har doim shunday qatlamlardan tuziladi." },
    audio: {
      intro: { ru: "Будь внимателен: здесь вопрос наоборот. Найди равенство, в котором есть ошибка.", uz: "Diqqat bo'ling: bu yerda savol teskari. Xato bor tenglikni toping." },
      on_correct: { ru: "Точно. Четыре в квадрате — шестнадцать, а не восемь. И вот что красиво: квадраты складываются из нечётных чисел.", uz: "Aniq. To'rtning kvadrati o'n olti, sakkiz emas. Mana qizig'i: kvadrat sonlar toq sonlardan yig'iladi." },
      on_wrong: { ru: "Это равенство верное. Ищи то, где результат не сходится.", uz: "Bu tenglik to'g'ri. Natija to'g'ri kelmaydiganini qidiring." }
    }
  },

  // ===== s9 TEST MC — 2³ [FAKT xotira] =====
  s9: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Куб двойки', uz: "Ikkining kubi" },
    question: { ru: 'Чему равно 2³?', uz: "2³ nechaga teng?" },
    opt0: { ru: '8', uz: '8' },
    opt1: { ru: '6', uz: '6' },
    opt2: { ru: '9', uz: '9' },
    opt3: { ru: '5', uz: '5' },
    correct_text: { ru: 'Верно: 2³ = 2·2·2 = 8.', uz: "To'g'ri: 2³ = 2·2·2 = 8." },
    wrong_1: { ru: 'Шесть — это два умножить на три. А куб — это два умножить на два и ещё на два.', uz: "Olti — bu ikkini uchga ko'paytirish. Kub esa ikkini ikkiga, yana ikkiga." },
    wrong_2: { ru: 'Девять — это три в квадрате. Основание и показатель поменялись местами.', uz: "To'qqiz — bu uch kvadrati. Asos va ko'rsatkich o'rin almashib qoldi." },
    wrong_3: { ru: 'Пять — это два плюс три. Здесь множители умножают.', uz: "Besh — bu ikki qo'shuv uch. Bu yerda ko'paytuvchilar ko'paytiriladi." },
    fact: { ru: 'Память компьютера измеряют степенями двойки: 2¹⁰ = 1024 байта это один килобайт. Поэтому объёмы растут скачками: 256, 512, 1024.', uz: "Kompyuter xotirasi ikkining darajalari bilan o'lchanadi: 2¹⁰ = 1024 bayt — bu bir kilobayt. Shuning uchun hajmlar sakrab o'sadi: 256, 512, 1024." },
    audio: {
      intro: { ru: "Вычисли два в кубе. Куб — три одинаковых множителя.", uz: "Ikkining kubini hisoblang. Kub — uchta bir xil ko'paytuvchi." },
      on_correct: { ru: "Верно, восемь. А степени двойки очень важны в компьютерах: тысяча двадцать четыре байта это один килобайт.", uz: "To'g'ri, sakkiz. Ikkining darajalari kompyuterda juda muhim: bir ming yigirma to'rt bayt — bu bir kilobayt." },
      on_wrong: { ru: "Не то. Умножь двойку саму на себя три раза.", uz: "Emas. Ikkini o'ziga uch marta ko'paytiring." }
    }
  },

  // ===== s10 TEST NumInput — fill-blank ko'rsatkich =====
  s10: {
    eyebrow: { ru: 'Заполни пропуск', uz: "Bo'sh joyni to'ldiring" },
    question: { ru: 'Впиши показатель степени.', uz: "Daraja ko'rsatkichini yozing." },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Показатель — это сколько одинаковых множителей. Сосчитай двойки.', uz: "Ko'rsatkich — nechta bir xil ko'paytuvchi borligi. Ikkilarni sanang." },
    fb_correct: { ru: 'Верно: четыре двойки, значит 2⁴.', uz: "To'g'ri: to'rtta ikki, demak 2⁴." },
    audio: {
      intro: { ru: "Посчитай, сколько здесь одинаковых множителей, и впиши показатель.", uz: "Bu yerda nechta bir xil ko'paytuvchi borligini sanang va ko'rsatkichni yozing." },
      on_correct: { ru: "Верно, четыре.", uz: "To'g'ri, to'rt." },
      on_wrong: { ru: "Пересчитай множители — каждый из них это одна двойка.", uz: "Ko'paytuvchilarni qayta sanang — har biri bitta ikki." }
    }
  },

  // ===== s11 TEST — Tasniflash (tap-to-place) =====
  s11: {
    eyebrow: { ru: 'Разложи по группам', uz: "Guruhlarga ajrating" },
    title: { ru: 'Квадрат или куб?', uz: "Kvadrat yoki kub?" },
    lead: { ru: 'Нажми запись, потом её группу.', uz: "Yozuvni bosing, keyin uning guruhini bosing." },
    bin_sq: { ru: 'Квадрат (a²)', uz: "Kvadrat (a²)" },
    bin_cu: { ru: 'Куб (a³)', uz: "Kub (a³)" },
    tap_prompt: { ru: 'Сначала выбери запись', uz: "Avval yozuvni tanlang" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    reset_hint: { ru: 'Сбросить', uz: "Tozalash" },
    hint_wrong: { ru: 'Смотри на показатель: 2 — квадрат, 3 — куб.', uz: "Ko'rsatkichga qarang: 2 — kvadrat, 3 — kub." },
    correct_text: { ru: 'Верно! Показатель 2 — квадрат, показатель 3 — куб.', uz: "To'g'ri! Ko'rsatkich 2 — kvadrat, ko'rsatkich 3 — kub." },
    audio: {
      intro: { ru: "Разложи записи по группам: где квадрат, а где куб. Подсказка в показателе.", uz: "Yozuvlarni guruhlarga ajrating: qaysi biri kvadrat, qaysi biri kub. Maslahat ko'rsatkichda." },
      on_correct: { ru: "Верно. Показатель сразу говорит, квадрат это или куб.", uz: "To'g'ri. Ko'rsatkich darhol aytadi: kvadratmi yoki kub." },
      on_wrong: { ru: "Посмотри на верхнее число: двойка это квадрат, тройка это куб.", uz: "Tepadagi songa qarang: ikki — kvadrat, uch — kub." }
    }
  },

  // ===== s12 CASE intro — Nilufar =====
  s12: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Логотип Нилуфар', uz: "Nilufarning logotipi" },
    lead: { ru: 'Нилуфар рисует пиксельный логотип. Он квадратный: 6 пикселей в ширину и 6 в высоту.', uz: "Nilufar piksel logotip chizadi. U kvadrat shaklida: eni 6 piksel, bo'yi 6 piksel." },
    note: { ru: 'Сколько всего пикселей в таком квадрате? Сейчас сосчитаем.', uz: "Bunday kvadratda jami nechta piksel bor? Hozir sanaymiz." },
    hint_calc: { ru: 'Квадрат 6 на 6 — это 6², то есть 6·6.', uz: "6 ga 6 kvadrat — bu 6², ya'ni 6·6." },
    btn_help: { ru: 'Помочь Нилуфар', uz: "Nilufarga yordam berish" },
    audio: { ru: "Нилуфар делает квадратный логотип: шесть пикселей в ширину и шесть в высоту. Подумай, как быстро сосчитать все пиксели.", uz: "Nilufar kvadrat logotip qiladi: eni olti piksel, bo'yi olti piksel. Barcha piksellarni qanday tez sanashni o'ylang." }
  },

  // ===== s13 CASE FINAL — 6² = 36 [FAKT shaxmat] =====
  s13: {
    eyebrow: { ru: 'Итоговое задание', uz: "Yakuniy topshiriq" },
    title: { ru: 'Пиксели логотипа', uz: "Logotip piksellari" },
    question: { ru: 'Сколько пикселей в квадрате 6 на 6?', uz: "6 ga 6 kvadratda nechta piksel bor?" },
    opt0: { ru: '36', uz: '36' },
    opt1: { ru: '12', uz: '12' },
    opt2: { ru: '30', uz: '30' },
    opt3: { ru: '18', uz: '18' },
    correct_text: { ru: 'Верно: 6² = 6·6 = 36 пикселей.', uz: "To'g'ri: 6² = 6·6 = 36 piksel." },
    wrong_1: { ru: 'Двенадцать — это шесть умножить на два. А квадрат — это шесть умножить на шесть.', uz: "O'n ikki — bu oltini ikkiga ko'paytirish. Kvadrat esa oltini oltiga." },
    wrong_2: { ru: 'Тридцать — это шесть умножить на пять. Сторона умножается сама на себя: шесть на шесть.', uz: "O'ttiz — bu oltini beshga ko'paytirish. Tomon o'ziga ko'paytiriladi: oltini oltiga." },
    wrong_3: { ru: 'Восемнадцать — это шесть умножить на три. Здесь нужен квадрат: шесть на шесть.', uz: "O'n sakkiz — bu oltini uchga ko'paytirish. Bu yerda kvadrat kerak: oltini oltiga." },
    fact: { ru: 'Есть легенда: за изобретение шахмат попросили класть на клетки зёрна, каждый раз удваивая. На последней клетке вышло 2⁶³ зёрен — больше, чем риса во всём мире. Так быстро растёт степень.', uz: "Bir afsona bor: shaxmat ixtirosi uchun kataklarga don qo'yishni so'rashgan, har safar ikki barobar. Oxirgi katakda 2⁶³ dona chiqqan — dunyodagi barcha guruchdan ko'p. Daraja shunchalik tez o'sadi." },
    audio: {
      intro: { ru: "Последнее задание. Сосчитай, сколько пикселей в квадрате шесть на шесть.", uz: "Oxirgi topshiriq. Eni olti, bo'yi olti kvadratda nechta piksel borligini sanang." },
      on_correct: { ru: "Верно, тридцать шесть. И напоследок: степень растёт так быстро, что на шахматной доске зёрен вышло бы больше, чем во всём мире.", uz: "To'g'ri, o'ttiz olti. Va nihoyat: daraja shunchalik tez o'sadiki, shaxmat taxtasida don dunyodagidan ko'p chiqar edi." },
      on_wrong: { ru: "Это квадрат: умножь шесть само на себя.", uz: "Bu kvadrat: oltini o'ziga ko'paytiring." }
    }
  },

  // ===== s14 SUMMARY =====
  s14: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Степень — это коротко и точно', uz: "Daraja — qisqa va aniq" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Одинаковые множители записывают степенью: 3·3·3·3·3 = 3⁵.', uz: "Bir xil ko'paytuvchilar daraja bilan yoziladi: 3·3·3·3·3 = 3⁵." },
    main_2: { ru: 'Квадрат a² = a·a, куб a³ = a·a·a.', uz: "Kvadrat a² = a·a, kub a³ = a·a·a." },
    main_3: { ru: 'Помни: 3⁵ — это не 3·5. Степень — это умножение, а не сложение.', uz: "Yodda tuting: 3⁵ — bu 3·5 emas. Daraja — ko'paytirish, qo'shish emas." },
    hook_close: { ru: 'Вот и ответ на первый вопрос: 3·3·3·3·3 коротко записывают как 3⁵.', uz: "Mana birinchi savolga javob: 3·3·3·3·3 qisqacha 3⁵ deb yoziladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Умножение столбиком (Урок 4) — степень это многократное умножение.', uz: "Ustun shaklida ko'paytirish (4-dars) — daraja ko'p marta ko'paytirish." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Квадрат пригодится для площади, а куб — для объёма фигур.', uz: "Kvadrat yuza uchun, kub esa hajm uchun kerak bo'ladi." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, степень коротко записывает одинаковые множители. Квадрат — умножить само на себя, куб — три раза. Главное: степень это умножение, а не сложение.", uz: "Demak, daraja bir xil ko'paytuvchilarni qisqa yozadi. Kvadrat — o'ziga ko'paytirish, kub — uch marta. Eng muhimi: daraja ko'paytirish, qo'shish emas." }
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
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука',    uz: "Bilasizmi? · Fan" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };

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
// FAKT-ANIMATSIYALAR (CSS-only loop, ko'k tema, qutiga sig'adi)
// ============================================================
// IT: ikkilik bitlar yonadi (xotira fakti).
const AnimBits = () => (
  <div className="fa-bit" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className={`fa-bit-c${i === 0 ? ' fa-bit-sign' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}/>
    ))}
  </div>
);
// Fan: kvadrat sonlar toq qatlamlardan tuziladi — 3x3 setka qatlam-qatlam yonadi.
const PA_SQ_LAYER = [0, 1, 2, 1, 1, 2, 2, 2, 2];
const AnimSquares = () => (
  <div className="pa-sq" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <span key={i} className="pa-sq-c" style={{ animationDelay: `${PA_SQ_LAYER[i] * 0.35}s` }}/>
    ))}
  </div>
);
// Tarix: shaxmat kataklari diagonal bo'ylab ikki barobar yonadi.
const AnimChess = () => (
  <div className="pa-ch" aria-hidden="true">
    {Array.from({ length: 16 }).map((_, i) => {
      const r = Math.floor(i / 4), col = i % 4;
      return <span key={i} className={`pa-ch-c${(r + col) % 2 === 0 ? ' pa-ch-d' : ''}`} style={{ animationDelay: `${(r + col) * 0.16}s` }}/>;
    })}
  </div>
);

// ============================================================
// VIZUALIZATOR — DarajaGrid: kvadrat-setka (Grid2D) + izometrik kub (CubeStack) + daraja yozuvi (Pw)
// ============================================================
// Pw: asos + ko'rsatkich (yuqori indeks). Daraja yozuvini ko'rsatadi.
const Pw = ({ b, e }) => (
  <span className="dg-pw"><span className="dg-pw-b">{b}</span><sup className="dg-pw-e">{e}</sup></span>
);

// Grid2D: rows x cols katak-setka (SVG). animate — kataklar ketma-ket paydo bo'ladi.
const DG_CELL = 26;
const Grid2D = ({ rows, cols, animate = false, cell = DG_CELL }) => {
  const r0 = Math.max(1, rows), c0 = Math.max(1, cols);
  const w = c0 * cell, h = r0 * cell;
  const cells = [];
  for (let r = 0; r < r0; r++) for (let c = 0; c < c0; c++) cells.push([r, c]);
  return (
    <svg className="dg-sq" viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ maxWidth: '100%', height: 'auto' }} aria-hidden="true">
      {cells.map(([r, c], i) => (
        <rect key={i} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} rx="3"
          className={`dg-cell${animate ? ' dg-cell-in' : ''}`}
          style={animate ? { animationDelay: `${(r + c) * 0.05}s` } : undefined}/>
      ))}
    </svg>
  );
};
const SquareGrid = ({ a, animate = false, cell = DG_CELL }) => <Grid2D rows={a} cols={a} animate={animate} cell={cell}/>;

// CubeStack: a×a×a izometrik kub (SVG). 3 ko'rinadigan yoq + ichki bo'linish chiziqlari.
const CUBE_U = 18;
const cubeIso = (i, j, k, n, u, pad) => {
  const ox = n * 0.866 * u + pad;
  const oy = n * u + pad;
  return `${ox + (i - j) * 0.866 * u},${oy + (i + j) * 0.5 * u - k * u}`;
};
const CubeStack = ({ a }) => {
  const n = Math.max(1, a), u = CUBE_U, pad = 6;
  const w = 2 * n * 0.866 * u + 2 * pad;
  const h = 2 * n * u + 2 * pad;
  const P = (i, j, k) => cubeIso(i, j, k, n, u, pad);
  const lines = [];
  for (let p = 0; p <= n; p++) {
    lines.push([P(p, 0, n), P(p, n, n)]);
    lines.push([P(0, p, n), P(n, p, n)]);
    lines.push([P(p, 0, 0), P(p, 0, n)]);
    lines.push([P(0, 0, p), P(n, 0, p)]);
    lines.push([P(0, p, 0), P(0, p, n)]);
    lines.push([P(0, 0, p), P(0, n, p)]);
  }
  return (
    <svg className="dg-cube" viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ maxWidth: '100%', height: 'auto' }} aria-hidden="true">
      <polygon points={`${P(0, 0, n)} ${P(n, 0, n)} ${P(n, n, n)} ${P(0, n, n)}`} className="cube-top"/>
      <polygon points={`${P(0, 0, 0)} ${P(n, 0, 0)} ${P(n, 0, n)} ${P(0, 0, n)}`} className="cube-right"/>
      <polygon points={`${P(0, 0, 0)} ${P(0, n, 0)} ${P(0, n, n)} ${P(0, 0, n)}`} className="cube-left"/>
      {lines.map((ln, i) => {
        const [x1, y1] = ln[0].split(',');
        const [x2, y2] = ln[1].split(',');
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="cube-edge"/>;
      })}
    </svg>
  );
};

// Hook animatsiyasi: 3·3·3·3·3 ko'paytma zanjiri navbatma-navbat kirib keladi.
const PowerChain = () => (
  <div className="pchain" aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <React.Fragment key={i}>
        {i > 0 && <span className="pchain-op" style={{ animationDelay: `${i * 0.22 - 0.11}s` }}>·</span>}
        <span className="pchain-n" style={{ animationDelay: `${i * 0.22}s` }}>3</span>
      </React.Fragment>
    ))}
  </div>
);

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (konseptual). Qaytishda picked TO'LIQ sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 22px)' }}>
          <PowerChain/>
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

// s1 — WARM-UP (ko'paytma eslash) QuestionScreen
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION: daraja yozuvi (step-reveal)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 168 }}>
          <div className="dg-chain">3·3·3·3·3</div>
          {step >= 1 && <div className="dg-arrow fade-up">↓</div>}
          {step >= 1 && <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Pw b="3" e="5"/></div>}
          {step >= 2 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.accent, fontWeight: 600 }}>{mt(t(c.line_base))}</p>}
          {step >= 3 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.blue, fontWeight: 600 }}>{mt(t(c.line_exp))}</p>}
          {step >= 4 && <p className="small fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.line_one))}</p>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION: KVADRAT (slider + kvadrat-setka)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [a, setA] = useState(3);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', minHeight: 178 }}>
          <SquareGrid a={a}/>
          <div className="dg-readout"><Pw b={a} e="2"/><span className="dg-eq">=</span><span className="dg-val">{a * a}</span></div>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {a}</p>
          <Slider value={a} min={1} max={6} onChange={setA}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center', margin: 0 }}>{mt(t(c.line_warn))}</p>
      </div>
    </Stage>
  );
};

// s4 — EXPLORATION: KUB (slider + izometrik kub)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [a, setA] = useState(2);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', minHeight: 178 }}>
          <CubeStack a={a}/>
          <div className="dg-readout"><Pw b={a} e="3"/><span className="dg-eq">=</span><span className="dg-val">{a * a * a}</span></div>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.slider_label)}: {a}</p>
          <Slider value={a} min={1} max={4} onChange={setA}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center', margin: 0 }}>{mt(t(c.line_def))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 1
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const rules = [c.rule_1, c.rule_2, c.rule_3, c.rule_4];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// s6 — RULE 2: TUZOQ (a² ≠ a·2)
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 'clamp(18px, 5vw, 44px)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <SquareGrid a={5} cell={16}/>
            <p className="small mono" style={{ margin: 0, color: T.success, fontWeight: 600 }}>5² = 25</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Grid2D rows={2} cols={5} cell={16}/>
            <p className="small mono" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>5·2 = 10</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.warn_1))}</p>
          <p className="small" style={{ margin: 0 }}>{mt(t(c.warn_2))}</p>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMix — bitta slaydda 4-5 HAR XIL turdagi qiyin misol KETMA-KET (yozish, MC, multi-select,
// tartiblash). Progress nuqtalari (scrollsiz), веди-до-верного, mobil-do'st. Ovozli xato = on_wrong (toza).
// Daraja matni: 2⁵ ko'rinishida; ovozda so'z bilan. Yangi misollar DRAFT (UZ tasdiq kutadi).
// ============================================================
const W_A8 = {
  eyebrow: { ru: 'Тренировка', uz: 'Mashq' },
  title: { ru: 'Степени, квадраты и кубы', uz: 'Daraja, kvadrat va kub' },
  lead: { ru: 'Несколько разных заданий подряд.', uz: "Bir nechta har xil topshiriq birin-ketin." },
  done_text: { ru: 'Все верно! Степень — это короткая запись повторного умножения.', uz: "Hammasi to'g'ri! Daraja — takror ko'paytirishning qisqa yozuvi." }
};
const W_B8 = {
  eyebrow: { ru: 'Итог', uz: 'Yakun' },
  title: { ru: 'Проверь себя', uz: "O'zingizni tekshiring" },
  lead: { ru: 'Реши задания одно за другим.', uz: "Topshiriqlarni birin-ketin yeching." },
  done_text: { ru: 'Отлично! Ты считаешь степени и сравниваешь их.', uz: "Ajoyib! Darajalarni hisoblaysiz va taqqoslaysiz." }
};
const A8_ITEMS = [
  { type: 'input', pw: { b: '2', e: '5' }, answer: 32, lead: { ru: 'Вычисли 2⁵.', uz: "2⁵ ni hisoblang." }, hint: { ru: 'Умножь двойку на себя пять раз.', uz: "Ikkini o'ziga besh marta ko'paytiring." },
    intro: { ru: 'Вычисли два в пятой степени.', uz: "Ikki ning beshinchi darajasini hisoblang." }, on_correct: { ru: 'Верно. Два в пятой это тридцать два.', uz: "To'g'ri. Ikki ning beshinchisi o'ttiz ikki." }, on_wrong: { ru: 'Умножь двойку на себя пять раз.', uz: "Ikkini o'ziga besh marta ko'paytiring." } },
  { type: 'mc', opt0: { ru: '2⁴', uz: '2⁴' }, opt1: { ru: '3²', uz: '3²' }, opt2: { ru: 'Они равны', uz: 'Ular teng' }, correct: 0, order: [1, 0, 2],
    lead: { ru: 'Что больше: 2⁴ или 3²?', uz: "Qaysi katta: 2⁴ yoki 3²?" },
    wrong_1: { ru: 'Три в квадрате это девять, а два в четвёртой это шестнадцать. Больше два в четвёртой.', uz: "Uch kvadrati — to'qqiz, ikki ning to'rtinchisi — o'n olti. Katta — ikki ning to'rtinchisi." },
    wrong_2: { ru: 'Они не равны: шестнадцать и девять. Больше 2⁴.', uz: "Ular teng emas: o'n olti va to'qqiz. Katta — 2⁴." },
    intro: { ru: 'Что больше: два в четвёртой или три в квадрате?', uz: "Qaysi katta: ikki ning to'rtinchisi yoki uch ning kvadrati?" }, on_correct: { ru: 'Верно. Два в четвёртой шестнадцать, больше девяти.', uz: "To'g'ri. Ikki ning to'rtinchisi o'n olti, to'qqizdan katta." }, on_wrong: { ru: 'Сначала посчитай каждую степень.', uz: "Avval har bir darajani hisoblang." } },
  { type: 'multiselect', items: [{ ru: '16', uz: '16' }, { ru: '25', uz: '25' }, { ru: '36', uz: '36' }, { ru: '20', uz: '20' }, { ru: '30', uz: '30' }], mask: [true, true, true, false, false],
    lead: { ru: 'Отметь все полные квадраты.', uz: "Barcha to'liq kvadratlarni belgilang." }, hint: { ru: 'Полный квадрат — это число вида n². 16=4², 25=5², 36=6².', uz: "To'liq kvadrat — n² ko'rinishidagi son. 16=4², 25=5², 36=6²." },
    intro: { ru: 'Отметь все числа, которые являются полными квадратами.', uz: "To'liq kvadrat bo'lgan barcha sonlarni belgilang." }, on_correct: { ru: 'Верно. Шестнадцать, двадцать пять и тридцать шесть — полные квадраты.', uz: "To'g'ri. O'n olti, yigirma besh va o'ttiz olti — to'liq kvadratlar." }, on_wrong: { ru: 'Полный квадрат это число вида эн в квадрате.', uz: "To'liq kvadrat — en kvadrat ko'rinishidagi son." } },
  { type: 'order', labels: ['3²', '2²', '2³'], vals: [9, 4, 8],
    lead: { ru: 'Расставь от меньшего к большему.', uz: "Kichikdan kattaga tartiblang." }, hint: { ru: 'Сначала посчитай каждую степень, потом сравни.', uz: "Avval har bir darajani hisoblang, keyin taqqoslang." },
    intro: { ru: 'Расставь эти степени от меньшего значения к большему.', uz: "Bu darajalarni qiymati bo'yicha kichikdan kattaga tartiblang." }, on_correct: { ru: 'Верно. Четыре, восемь, девять.', uz: "To'g'ri. To'rt, sakkiz, to'qqiz." }, on_wrong: { ru: 'Посчитай значение каждой степени.', uz: "Har bir darajaning qiymatini hisoblang." } },
  { type: 'mc', opt0: { ru: 'Куб (3³)', uz: 'Kub (3³)' }, opt1: { ru: 'Квадрат', uz: 'Kvadrat' }, opt2: { ru: 'Ни то ни другое', uz: 'Hech qaysi' }, correct: 0, order: [1, 0, 2],
    lead: { ru: 'Число 27 — это…', uz: '27 soni — bu…' },
    wrong_1: { ru: 'Двадцать семь это не квадрат: квадраты это двадцать пять и тридцать шесть. Зато двадцать семь это три умножить на три и ещё на три, то есть три в кубе.', uz: "Yigirma yetti kvadrat emas: kvadratlar yigirma besh va o'ttiz olti. Lekin yigirma yetti — uchni uchga, yana uchga ko'paytirish, ya'ni uch kubi." },
    wrong_2: { ru: 'Двадцать семь это куб тройки: три в кубе равно двадцать семь.', uz: "Yigirma yetti — uch ning kubi: uch kubi yigirma yettiga teng." },
    intro: { ru: 'Число двадцать семь это куб или квадрат?', uz: "Yigirma yetti soni kub yoki kvadratmi?" }, on_correct: { ru: 'Верно. Двадцать семь это три в кубе.', uz: "To'g'ri. Yigirma yetti — uch ning kubi." }, on_wrong: { ru: 'Проверь: три умножить на три и ещё на три.', uz: "Tekshiring: uchni uchga, yana uchga ko'paytiring." } }
];
const B8_ITEMS = [
  { type: 'mc', opt0: { ru: '2⁵', uz: '2⁵' }, opt1: { ru: '5²', uz: '5²' }, opt2: { ru: 'Они равны', uz: 'Ular teng' }, correct: 0, order: [1, 0, 2],
    lead: { ru: 'Что больше: 2⁵ или 5²?', uz: "Qaysi katta: 2⁵ yoki 5²?" },
    wrong_1: { ru: 'Пять в квадрате это двадцать пять, а два в пятой это тридцать два. Больше два в пятой.', uz: "Besh kvadrati — yigirma besh, ikki ning beshinchisi — o'ttiz ikki. Katta — ikki ning beshinchisi." },
    wrong_2: { ru: 'Они не равны: тридцать два и двадцать пять. Больше 2⁵.', uz: "Ular teng emas: o'ttiz ikki va yigirma besh. Katta — 2⁵." },
    intro: { ru: 'Что больше: два в пятой или пять в квадрате?', uz: "Qaysi katta: ikki ning beshinchisi yoki besh ning kvadrati?" }, on_correct: { ru: 'Верно. Два в пятой тридцать два, больше двадцати пяти.', uz: "To'g'ri. Ikki ning beshinchisi o'ttiz ikki, yigirma beshdan katta." }, on_wrong: { ru: 'Посчитай каждую степень.', uz: "Har bir darajani hisoblang." } },
  { type: 'multiselect', items: [{ ru: '4³', uz: '4³' }, { ru: '8²', uz: '8²' }, { ru: '2⁶', uz: '2⁶' }, { ru: '6²', uz: '6²' }], mask: [true, true, true, false],
    lead: { ru: 'Отметь все записи, равные 64.', uz: "64 ga teng barcha yozuvlarni belgilang." }, hint: { ru: '4³=64, 8²=64, 2⁶=64. А 6²=36.', uz: "4³=64, 8²=64, 2⁶=64. 6² esa 36." },
    intro: { ru: 'Отметь все записи, которые равны шестидесяти четырём.', uz: "Oltmish to'rtga teng barcha yozuvlarni belgilang." }, on_correct: { ru: 'Верно. Четыре в кубе, восемь в квадрате и два в шестой все равны шестидесяти четырём.', uz: "To'g'ri. To'rt kub, sakkiz kvadrat va ikki ning oltinchisi — barchasi oltmish to'rtga teng." }, on_wrong: { ru: 'Посчитай каждую запись.', uz: "Har bir yozuvni hisoblang." } },
  { type: 'input', pw: { b: '10', e: '3' }, answer: 1000, lead: { ru: 'Вычисли 10³.', uz: "10³ ni hisoblang." }, hint: { ru: 'Это десять, умноженное на себя три раза.', uz: "Bu o'nni o'ziga uch marta ko'paytirish." },
    intro: { ru: 'Вычисли десять в кубе.', uz: "O'n ning kubini hisoblang." }, on_correct: { ru: 'Верно. Десять в кубе это тысяча.', uz: "To'g'ri. O'n ning kubi ming." }, on_wrong: { ru: 'Десять умножь на десять и ещё на десять.', uz: "O'nni o'nga, yana o'nga ko'paytiring." } },
  { type: 'mc', opt0: { ru: '36', uz: '36' }, opt1: { ru: '12', uz: '12' }, opt2: { ru: '66', uz: '66' }, opt3: { ru: '18', uz: '18' }, correct: 0, order: [1, 0, 3, 2],
    lead: { ru: 'Сколько будет 6²?', uz: '6² nechaga teng?' },
    wrong_1: { ru: 'Шесть в квадрате это не шесть умножить на два. Это шесть умножить на шесть, будет тридцать шесть.', uz: "Olti kvadrati — bu oltini ikkiga ko'paytirish emas. Bu oltini oltiga, o'ttiz olti bo'ladi." },
    wrong_2: { ru: 'Проверь умножение: шесть умножить на шесть равно тридцать шесть.', uz: "Ko'paytmani tekshiring: oltini oltiga ko'paytirsak o'ttiz olti." },
    wrong_3: { ru: 'Шесть в квадрате это шесть умножить на шесть, а не шесть плюс шесть плюс шесть. Получается тридцать шесть.', uz: "Olti kvadrati — bu oltini oltiga ko'paytirish, olti qo'shuv olti qo'shuv olti emas. O'ttiz olti chiqadi." },
    intro: { ru: 'Сколько будет шесть в квадрате?', uz: "Olti ning kvadrati nechaga teng?" }, on_correct: { ru: 'Верно. Шесть в квадрате тридцать шесть.', uz: "To'g'ri. Olti ning kvadrati o'ttiz olti." }, on_wrong: { ru: 'Это шесть умножить на шесть.', uz: "Bu olti karra olti." } }
];

const SeqMix = ({ screen, totalScreens, items, screenContent, scope, factOnDone, storedAnswer, onAnswer, onNext, onPrev }) => {
  const w = screenContent; const t = useT(); const lang = useLang(); const sfx = useSfx();
  const n = items.length;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: `s${screen}_i0`, text: items[0].intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [results, setResults] = useState(() => (wasSolved ? items.map(() => true) : []));
  const [val, setVal] = useState('');
  const [seq, setSeq] = useState([]);
  const [msel, setMsel] = useState([]);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(false);
  const wrongRef = useRef(false);
  const advRef = useRef(wasSolved);
  const done = idx >= n;
  const cur = done ? null : items[idx];
  const sh = (cur && cur.type === 'mc') ? shuffleMC(cur, [cur.opt0, cur.opt1, cur.opt2, cur.opt3].filter(Boolean).map(o => optEl(t, o)), cur.correct, cur.order) : null;
  const speak = (txt) => { if (txt && !audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const advance = (ft) => {
    const nr = [...results]; nr[idx] = ft; const ni = idx + 1;
    setResults(nr); setVal(''); setSeq([]); setMsel([]); setWrongSet(new Set()); setHint(false); setFlash(false); wrongRef.current = false; setIdx(ni);
    if (ni >= n) { const allOk = nr.every(Boolean); onAnswer({ stage: scope, screenIdx: screen, correctAnswer: 'seqmix', studentAnswer: JSON.stringify(nr), correct: allOk, firstTry: allOk, solved: true }); speak(w.done_text && w.done_text[lang]); }
    else speak(items[ni].intro[lang]);
  };
  const fireOk = () => { setFlash(true); sfx.playCorrect(); speak(cur.on_correct && cur.on_correct[lang]); const ft = !wrongRef.current; setTimeout(() => advance(ft), 800); };
  const fireBad = () => { wrongRef.current = true; sfx.playWrong(); setHint(true); speak(cur.on_wrong && cur.on_wrong[lang]); };
  const ensureAdv = () => { if (!advRef.current) { advRef.current = true; audio.triggerEvent('check_pressed'); } };
  const submitInput = () => { if (flash) return; const v = parseInt(String(val).replace(/[^0-9-]/g, ''), 10); if (isNaN(v)) return; ensureAdv(); v === cur.answer ? fireOk() : fireBad(); };
  const pickMC = (i) => { if (flash || wrongSet.has(i)) return; ensureAdv(); if (i === sh.correctIdx) { fireOk(); } else { wrongRef.current = true; sfx.playWrong(); setWrongSet(p => { const s = new Set(p); s.add(i); return s; }); setHint(true); speak(cur.on_wrong && cur.on_wrong[lang]); } };
  const submitOrder = () => { if (flash || seq.length < cur.vals.length) return; ensureAdv(); const sorted = cur.vals.map((v, i) => i).sort((a, b) => cur.vals[a] - cur.vals[b]); const okk = seq.every((s, p) => s === sorted[p]); if (okk) fireOk(); else { fireBad(); setTimeout(() => setSeq([]), 500); } };
  const submitMsel = () => { if (flash) return; ensureAdv(); const okk = cur.mask.every((b, i) => b === msel.includes(i)); okk ? fireOk() : fireBad(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const visHint = cur && (cur.type === 'mc' ? (sh && [...wrongSet].slice(-1)[0] !== undefined && sh.content[`wrong_${[...wrongSet].slice(-1)[0]}`]) : cur.hint);
  return (
    <Stage eyebrow={w.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ margin: 0 }}>{mt(t(w.title))}</h2>
          {!done && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{mt(t(w.lead))}</p>}
        </div>
        <div className="fade-up" style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {items.map((_, k) => (<span key={k} style={{ width: 9, height: 9, borderRadius: '50%', background: k < idx ? T.success : (k === idx ? T.accent : `${T.ink3}55`), transition: 'background 0.3s' }}/>))}
          <span className="small mono" style={{ marginLeft: 6, color: T.ink3 }}>{Math.min(idx + (done ? 0 : 1), n)} / {n}</span>
        </div>
        {cur && (
          <div className="fade-up" key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
            <h3 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.lead))}</h3>
            {cur.type === 'input' && (<>
              {cur.pw && <div className="frame" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}><Pw b={cur.pw.b} e={cur.pw.e}/><span className="mono" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>= ?</span></div>}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <input type="text" inputMode="numeric" className={`answer-input ${flash ? 'correct' : (hint ? 'wrong' : '')}`} value={val} placeholder="0" disabled={flash} onChange={e => { setVal(e.target.value); setHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(110px, 26vw, 150px)' }}/>
                {!flash && <button className="btn-white-accent" disabled={!val} onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
              </div>
            </>)}
            {cur.type === 'mc' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {sh.options.map((opt, i) => { const isWrong = wrongSet.has(i); const isC = flash && i === sh.correctIdx; let cls = 'option'; if (isC) cls += ' option-correct'; else if (isWrong) cls += ' option-picked-wrong';
                  return (<button key={i} className={cls} disabled={flash || isWrong} onClick={() => pickMC(i)} style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(12px, 2vw, 16px)', minHeight: 'clamp(50px, 7vw, 60px)', fontSize: 'clamp(14px, 1.8vw, 16px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mono small" style={{ minWidth: 18, color: isC ? T.success : (isWrong ? T.accent : T.ink3) }}>{isC ? '✓' : (isWrong ? '✗' : String.fromCharCode(65 + i))}</span><span style={{ flex: 1 }}>{opt}</span></button>); })}
              </div>
            )}
            {cur.type === 'order' && (<>
              <div className="od-grid">
                {cur.labels.map((labelTxt, i) => { const pos = seq.indexOf(i); return (
                  <button key={i} className={`od-card${pos !== -1 ? ' od-on' : ''}${flash ? ' od-ok' : ''}`} disabled={flash} onClick={() => { if (!flash) { setSeq(p => p.includes(i) ? p : [...p, i]); setHint(false); } }}>
                    {pos !== -1 && <span className="od-badge">{pos + 1}</span>}<span className="od-temp">{labelTxt}</span></button>); })}
              </div>
              {!flash && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><button className="btn-ghost" disabled={seq.length === 0} onClick={() => setSeq([])} style={{ padding: 'clamp(9px, 1.5vw, 11px) clamp(14px, 2vw, 18px)', fontSize: 'clamp(11px, 1.4vw, 13px)' }}>{lang === 'uz' ? 'Tozalash' : 'Сброс'}</button><button className="btn-white-accent" disabled={seq.length < cur.vals.length} onClick={submitOrder} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
            </>)}
            {cur.type === 'multiselect' && (<>
              <div className="ms-grid">
                {cur.items.map((it, i) => { const on = msel.includes(i); const isC = flash && cur.mask[i]; return (
                  <button key={i} className={`ms-card${on ? ' ms-on' : ''}${isC ? ' ms-ok' : ''}`} disabled={flash} onClick={() => { if (!flash) { setMsel(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]); setHint(false); } }}>
                    <span className={`ms-box${on ? ' ms-box-on' : ''}`} aria-hidden="true">{on && <IconOk/>}</span><span className="ms-pair">{mt(t(it))}</span></button>); })}
              </div>
              {!flash && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submitMsel} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
            </>)}
            {hint && !flash && visHint && (<div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(visHint))}</p></div>)}
          </div>
        )}
        {done && (<>
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? 'Tayyor' : 'Готово'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(w.done_text))}</p>
          </FeedbackBlock>
          {factOnDone}
        </>)}
      </div>
    </Stage>
  );
};

// s7 — BLOCK A: 5 qiyin misol ketma-ket (yozish, MC, multi-select, tartiblash, tur)
const Screen7 = (props) => <SeqMix {...props} items={A8_ITEMS} screenContent={W_A8} scope={SCREEN_META[props.screen].scope} factOnDone={<FactCard text={CONTENT.s8.fact} badge={FB_SCI} anim={<AnimSquares/>}/>}/>;

// s12 — CASE setup: Nilufar piksel-logotip (6×6)
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <SquareGrid a={6} cell={18} animate/>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s13 — BLOCK B (FINAL): qiyin misollar ketma-ket (MC, multi-select, yozish, MC)
const Screen13 = (props) => <SeqMix {...props} items={B8_ITEMS} screenContent={W_B8} scope={SCREEN_META[props.screen].scope} factOnDone={<FactCard text={CONTENT.s13.fact} badge={FB_HIST} anim={<AnimChess/>}/>}/>;

// s14 — SUMMARY + hook yopilishi + bog'lanishlar
// SUMMARY — yagona standart (etalon: Dars09-13): eyebrow + h-title + ball qatori (X/Y) + asosiy + hook + ConnectionsBlock, top-anchor.
const Screen14 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const mains = [c.main_1, c.main_2, c.main_3];
  const scoreTotal = SCREEN_META.filter(s => s.scored).length;
  const scoreCorrect = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)' }}>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.success }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.heading))}</h2>
        </div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{scoreCorrect} / {scoreTotal}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? "savolga birinchi urinishda to'g'ri javob" : 'вопросов решено с первой попытки'}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
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
export default function PowerSquareCubeLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen12, Screen13, Screen14];
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
.has-amb { position: relative; }
.has-amb > :not(.amb) { position: relative; z-index: 1; }
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





/* ============================================================ */
/* MATH: DarajaGrid — daraja yozuvi + kvadrat-setka + izometrik kub + tasniflash + fakt-anim (nat_5_06). */
/* ============================================================ */
.dg-pw { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(28px, 6vw, 44px); color: #0E0E10; line-height: 1; display: inline-flex; align-items: flex-start; }
.dg-pw-e { font-size: 0.55em; color: #FF4F28; margin-left: 1px; line-height: 1; }
.dg-eq { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: clamp(20px, 4vw, 30px); color: #5A5A60; margin: 0 4px; }
.dg-val { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(28px, 6vw, 44px); color: #1F7A4D; line-height: 1; }
.dg-readout { display: flex; align-items: center; gap: 4px; }
.dg-chain { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: clamp(20px, 4.4vw, 30px); color: #0E0E10; letter-spacing: 0.04em; }
.dg-fill { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.dg-arrow { font-size: 22px; color: #A7A6A2; line-height: 1; animation: dg-bounce 1.4s ease-in-out infinite; }
@keyframes dg-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

.dg-sq .dg-cell { fill: #FFE8E1; stroke: #FF4F28; stroke-width: 1.5; }
.dg-cell-in { opacity: 0; transform-box: fill-box; transform-origin: center; animation: dg-pop 0.4s ease-out forwards; }
@keyframes dg-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }

.dg-cube .cube-top { fill: #FFE8E1; }
.dg-cube .cube-left { fill: rgba(255, 79, 40, 0.16); }
.dg-cube .cube-right { fill: rgba(255, 79, 40, 0.26); }
.dg-cube .cube-edge { stroke: #FF4F28; stroke-width: 1.2; opacity: 0.65; }

/* Hook: ko'paytma zanjiri */
.pchain { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; }
.pchain-n { opacity: 0; animation: pchain-in 0.5s ease-out forwards, pchain-puls 2.6s ease-in-out infinite 1.6s; }
.pchain-op { opacity: 0; color: #FF4F28; animation: pchain-in 0.5s ease-out forwards; }
@keyframes pchain-in { from { opacity: 0; transform: translateY(8px) scale(0.7); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pchain-puls { 0%, 100% { color: #0E0E10; } 50% { color: #FF4F28; } }

/* Tasniflash (tap-to-place) */
.cl-pool { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 46px; align-items: center; }
.cl-pool-done { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A7A6A2; }
.cl-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 19px); color: #0E0E10; background: #FFFFFF; border: 2px solid #E8E4DC; border-radius: 12px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.25); transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
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
.pa-sq { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; width: 100%; height: 100%; padding: 6px; }
.pa-sq-c { background: #019ACB; border-radius: 3px; opacity: 0.22; animation: pa-sq-on 2.1s ease-in-out infinite; }
@keyframes pa-sq-on { 0%, 100% { opacity: 0.2; } 45%, 60% { opacity: 1; } }
.pa-ch { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; width: 100%; height: 100%; padding: 6px; }
.pa-ch-c { background: rgba(1, 154, 203, 0.12); border-radius: 2px; animation: pa-ch-on 2.4s ease-in-out infinite; }
.pa-ch-d { background: rgba(1, 154, 203, 0.32); }
@keyframes pa-ch-on { 0%, 100% { background-color: rgba(1, 154, 203, 0.12); } 50% { background-color: #019ACB; } }
`;
