import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

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

  setLang(lang) { this.currentLang = lang; }              // только preview Web Speech
  setGender(g) { this.gender = g === 'f' ? 'f' : 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет

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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure }) => {
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
          if (isCorrect && c.fact_audio && c.fact_audio[lang]) engine.pushOneOff(c.fact_audio[lang]);  // FactCard ovozlanadi (TTS-toza)
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
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
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
// --- POD UROK: num_1_01 — Predmetlarni sanash va 1–5 sonlar (1-sinf, Dars01) ---
// 1-sinf (6–7 yosh): ovoz yetakchi kanal, typing YO'Q (tap/drag), concrete ustun,
// bar model YO'Q. Manba: 1sinf_metodologiya.md (§4, §6, §7 Б1) + DIZAYN_STANDART_1SINF.md.
// Misconception'lar: M1 kardinallik yo'q · M2 miscount (sakrab/ikki marta) · M3 raqam↔miqdor.
// ============================================================

const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'num-1-01-v1',
  lessonTitle: { ru: 'Счёт предметов и числа 1–5', uz: "Predmetlarni sanash va 1–5 sonlar" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // jumboq: nechta olma?
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // sanash ketma-ketligi 1->5
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // o'zi sanaydi (tap)
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // kardinallik
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },  // nechta yulduz?
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // ten-frame (bo'sh kataklar)
  { id: 's6',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // raqam <-> miqdor
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },  // raqam<->guruh juftlash
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // to'g'ri va teskari sanash
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },  // xilma-xil drill (sana/keyingi/ko'p/tushgan)
  { id: 'sd',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // mini-drill (3-5 misol, ball yo'q)
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // final: qaysi savatda 5? + fakt
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }             // yakun + sanaydigan qo'l
];

// Sonlar — so'z bilan (audio_rules: audioda raqam emas, so'z). Indeks = son.
const NUM_WORDS = { ru: ['', 'один', 'два', 'три', 'четыре', 'пять'], uz: ['', 'bir', 'ikki', 'uch', "to'rt", 'besh'] };

const CONTENT = {
  // ---- s0 HOOK — yumshoq jumboq (to'g'ri javob yo'q; sanab keyin topamiz) ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title_part1: { ru: 'К Мадине пришёл', uz: 'Madinaga' },
    title_part2_em: { ru: 'гость', uz: 'mehmon' },
    title_part3: { ru: '. На столе яблоки.', uz: 'keldi. Stolda olmalar bor.' },
    question: { ru: 'Сколько яблок получилось? Нажми число.', uz: 'Nechta olma chiqdi? Sonni bosing.' },
    opt0: { ru: '3', uz: '3' },
    opt1: { ru: '4', uz: '4' },
    opt2: { ru: '5', uz: '5' },
    audio: {
      intro: {
        ru: 'К Мадине пришёл гость. Давай вместе посчитаем яблоки на столе. Один, два, три, четыре, пять.',
        uz: "Madinaga mehmon keldi. Keling, stoldagi olmalarni birga sanaymiz. Bir, ikki, uch, to'rt, besh."
      },
      on_correct: { ru: 'Мы вместе насчитали пять яблок.', uz: "Biz birga beshta olma sanadik." },
      on_wrong: { ru: 'Мы вместе насчитали пять яблок.', uz: "Biz birga beshta olma sanadik." }
    }
  },

  // ---- s1 EXPLORATION — sanash ketma-ketligi 1->5, har xil narsa (darslik 2-bob 1-dars) ----
  s1: {
    eyebrow: { ru: 'Считаем', uz: 'Sanaymiz' },
    instruction: { ru: 'Мадина считает разные вещи', uz: "Madina turli narsalarni sanaydi" },
    fact: { ru: 'Считать можно что угодно: цветы, яблоки, звёзды, рыбок.', uz: "Hamma narsani sanash mumkin: gul, olma, yulduz, baliq." },
    audio: {
      ru: [
        'Мадина считает разные вещи. Числами можно сосчитать что угодно. Цветы, яблоки, звёзды, рыбок.',
        'Посчитаем каждую группу вместе. Число говорит, сколько предметов получилось.'
      ],
      uz: [
        "Madina turli narsalarni sanaydi. Sonlar bilan hamma narsani sanash mumkin. Gul, olma, yulduz, baliq.",
        "Har guruhni birga sanaymiz. Son nechta narsa borligini bildiradi."
      ]
    }
  },

  // ---- s2 EXPLORATION — o'zi sanaydi (tap, birma-bir, kardinallik) ----
  s2: {
    eyebrow: { ru: 'Посчитай сам', uz: 'O\'zingiz sanang' },
    instruction: { ru: 'Нажми на каждое яблоко Мадины и посчитай', uz: "Madinaning har olmasini bosing va sanang" },
    count_label: { ru: 'Посчитано', uz: 'Sanaldi' },
    audio: {
      ru: [
        'Нажимай на каждое яблоко по одному. На каждое нажатие звучит одно число.',
        'Последнее число, пять, говорит, сколько яблок всего.'
      ],
      uz: [
        "Har olmani bittadan bosing. Har bosishda bitta son aytiladi.",
        "Oxirgi son, besh, nechta olma borligini bildiradi."
      ]
    }
  },

  // ---- s3 RULE — kardinallik (jonli namoyish, oxirgi son urg'uli) ----
  s3: {
    eyebrow: { ru: 'Запомним', uz: 'Eslab qolamiz' },
    title_part1: { ru: 'Последнее число — это', uz: 'Oxirgi son — bu' },
    title_part2_em: { ru: 'сколько всего', uz: 'jami nechta' },
    tip: {
      ru: 'Когда считаешь, последнее названное число говорит, сколько предметов всего.',
      uz: "Sanaganda, eng oxirgi aytilgan son jami nechta narsa borligini bildiradi."
    },
    audio: {
      ru: 'Когда мы считаем, самое последнее число говорит, сколько предметов всего. Посчитали до пяти, значит всего пять.',
      uz: "Sanaganimizda, eng oxirgi son jami nechta narsa borligini bildiradi. Beshgacha sanadik, demak jami besh."
    }
  },

  // ---- s4 TEST choice — nechta? (3 yulduz). Variantlar: 2 / 3(to'g'ri) / 4 / 5 ----
  s4: {
    eyebrow: { ru: 'Тренировка · 1 / 4', uz: 'Mashq · 1 / 4' },
    title: { ru: 'Сколько звёзд на платье Мадины?', uz: "Madinaning ko'ylagida nechta yulduz bor?" },
    correct_text: {
      ru: 'Верно. Звёзд три — последнее число при счёте было три.',
      uz: "To'g'ri. Yulduz uchta — sanaganda oxirgi son uch edi."
    },
    wrong_0: {
      ru: 'Здесь не две звезды. Похоже, одну пропустил при счёте. Посчитай снова, не пропуская ни одной.',
      uz: "Bu yerda ikkita emas. Sanaganda bittasini tashlab ketgansiz. Hech birini tashlamasdan qaytadan sanang."
    },
    wrong_2: {
      ru: 'Это не четыре. Похоже, одну звезду посчитал дважды. Посчитай каждую по одному разу.',
      uz: "Bu to'rt emas. Bitta yulduzni ikki marta sanagansiz. Har birini bir martadan sanang."
    },
    wrong_3: {
      ru: 'Это не пять. Кажется, ты выбрал число, не посчитав. Сначала посчитай звёзды по одной.',
      uz: "Bu besh emas. Sanamasdan son tanlagansiz. Avval yulduzlarni bittadan sanang."
    },
    wrong_default: {
      ru: 'Не совсем. Посчитай звёзды по одной и назови последнее число.',
      uz: "Unchalik emas. Yulduzlarni bittadan sanang va oxirgi sonni ayting."
    },
    audio: {
      intro: { ru: 'Сколько звёзд на платье Мадины? Посчитай и нажми правильную цифру.', uz: "Madinaning ko'ylagida nechta yulduz bor? Sanang va to'g'ri raqamni bosing." },
      on_correct: { ru: 'Верно. Звёзд три. Последнее число при счёте было три.', uz: "To'g'ri. Yulduz uchta. Sanaganda oxirgi son uch edi." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana bir bor sanang." }
    }
  },

  // ---- s5 EXPLORATION — interaktiv ten-frame: har katakni bosib bitta olma qo'yamiz ----
  s5: {
    eyebrow: { ru: 'По одному', uz: 'Bittadan' },
    instruction: { ru: 'Мадина накрывает стол. Нажми на клетку — в неё ляжет яблоко', uz: "Madina dasturxon quryapti. Katakni bosing — unga olma tushadi" },
    count_label: { ru: 'Посчитано', uz: 'Sanaldi' },
    full_text: { ru: 'Пять клеток — пять яблок. В каждой по одному.', uz: "Besh katak — besh olma. Har katakda bittadan." },
    audio: {
      ru: [
        'Мадина накрывает стол. В каждую клетку ложится одно яблоко.',
        'Считай вслух. Один, два, три, четыре, пять.'
      ],
      uz: [
        "Madina dasturxon quryapti. Har katakka bitta olma tushadi.",
        "Ovoz chiqarib sanang. Bir, ikki, uch, to'rt, besh."
      ]
    }
  },

  // ---- s6 RULE — raqam <-> miqdor (1..5 qatorlar) ----
  s6: {
    eyebrow: { ru: 'Цифры', uz: 'Raqamlar' },
    title_part1: { ru: 'Цифра показывает', uz: 'Raqam' },
    title_part2_em: { ru: 'сколько', uz: 'nechtaligini' },
    title_part3: { ru: 'предметов', uz: "ko'rsatadi" },
    audio: {
      ru: [
        'Это цифры от одного до пяти. Каждая цифра показывает, сколько предметов.',
        'Цифра один значит одну вещь. А цифра пять значит пять вещей.'
      ],
      uz: [
        "Bular birdan beshgacha raqamlar. Har raqam nechta narsa borligini ko'rsatadi.",
        "Bir raqami bitta narsa degani. Besh raqami esa beshta narsa degani."
      ]
    }
  },

  // ---- s7 TEST tap-pair — raqamni mos guruhga ula (2, 4, 5) ----
  s7: {
    eyebrow: { ru: 'Тренировка · 2 / 4', uz: 'Mashq · 2 / 4' },
    instruction: {
      ru: 'Нажми цифру, потом группу, где столько же',
      uz: "Raqamni bosing, keyin shuncha narsa bor guruhni bosing"
    },
    correct_text: { ru: 'Верно. Все цифры на своих местах.', uz: "To'g'ri. Hamma raqam o'z joyida." },
    wrong_default: {
      ru: 'Здесь столько нет. Посчитай предметы в группе и сравни с цифрой.',
      uz: "Bu yerda shuncha yo'q. Guruhdagi narsalarni sanang va raqam bilan solishtiring."
    },
    audio: {
      intro: { ru: 'Нажми цифру, а потом группу, где столько же предметов. Сначала посчитай.', uz: "Raqamni bosing, keyin shuncha narsa bor guruhni bosing. Avval sanang." },
      on_correct: { ru: 'Верно. Цифры на своих местах.', uz: "To'g'ri. Raqamlar o'z joyida." },
      on_wrong: { ru: 'Не совсем. Посчитай группу ещё раз.', uz: "Unchalik emas. Guruhni yana sanang." }
    }
  },

  // ---- s8 EXPLORATION — to'g'ri va teskari sanash (darslik 2-bob 13-dars) ----
  s8: {
    eyebrow: { ru: 'Туда и обратно', uz: 'Oldinga va orqaga' },
    instruction: { ru: 'Считаем вперёд и назад', uz: "Oldinga va orqaga sanaymiz" },
    fact: { ru: 'Числа можно называть и вперёд, и назад.', uz: "Sonlarni oldinga ham, orqaga ham aytsa bo'ladi." },
    audio: {
      intro: { ru: 'Числа можно называть вперёд и назад. Слушай и считай вместе.', uz: "Sonlarni oldinga ham, orqaga ham aytamiz. Eshiting va birga sanang." }
    }
  },

  // ---- s9 TEST (xilma-xil drill): sana / keyingi-oldingi / ko'p-kam / tushgan son ----
  s9: {
    eyebrow: { ru: 'Тренировка · 3 / 4', uz: 'Mashq · 3 / 4' },
    q_count: { ru: 'Сколько здесь?', uz: 'Bu yerda nechta?' },
    q_next: { ru: 'Какое число идёт дальше?', uz: 'Keyingi son qaysi?' },
    q_prev: { ru: 'Какое число идёт раньше?', uz: 'Oldingi son qaysi?' },
    q_more: { ru: 'Где больше?', uz: "Qayerda ko'proq?" },
    q_missing: { ru: 'Какое число пропущено?', uz: 'Qaysi son tushib qoldi?' },
    correct_text: { ru: 'Верно! Идём дальше.', uz: "To'g'ri! Davom etamiz." },
    done_text: { ru: 'Отлично! Все задания выполнены.', uz: "Zo'r! Hamma topshiriq bajarildi." },
    audio: {
      intro: { ru: 'Несколько разных заданий. Считай и думай. Начинаем.', uz: "Bir nechta xil topshiriq. Sana va o'yla. Boshladik." }
    }
  },

  // ---- s10 TEST final + FactCard — qaysi savatda 5 ta? Savatlar: 4 / 5(to'g'ri) / 3 ----
  s10: {
    eyebrow: { ru: 'Тренировка · 4 / 4', uz: 'Mashq · 4 / 4' },
    title: { ru: 'Гостю нужна корзина с пятью яблоками. В какой?', uz: "Mehmonga beshta olmali savat kerak. Qaysi savatda?" },
    correct_text: { ru: 'Верно. В этой корзине пять яблок.', uz: "To'g'ri. Bu savatda beshta olma bor." },
    wrong_0: {
      ru: 'Здесь четыре — до пяти не хватает одного. Посчитай до пяти.',
      uz: "Bu yerda to'rtta — beshtaga bittasi yetmaydi. Beshtagacha sanang."
    },
    wrong_2: {
      ru: 'Здесь только три. Считай яблоки до пяти, не останавливайся раньше.',
      uz: "Bu yerda atigi uchta. Olmalarni beshtagacha sanang, erta to'xtamang."
    },
    wrong_default: {
      ru: 'Не совсем. Посчитай яблоки в каждой корзине до пяти.',
      uz: "Unchalik emas. Har savatdagi olmalarni beshtagacha sanang."
    },
    fact_badge: { ru: 'А знаешь? · Тело', uz: 'Bilasizmi? · Tana' },
    fact_text: {
      ru: 'На твоей руке тоже пять пальцев — как пять яблок.',
      uz: "Qo'lingizda ham beshta barmoq bor — xuddi beshta olmaday."
    },
    fact_audio: {
      ru: 'На твоей руке тоже пять пальцев. Можно считать на пальцах.',
      uz: "Qo'lingizda ham beshta barmoq bor. Barmoqlarda ham sanasa bo'ladi."
    },
    audio: {
      intro: { ru: 'Гостю нужна корзина с пятью яблоками. Посчитай в каждой корзине и выбери.', uz: "Mehmonga beshta olmali savat kerak. Har savatda sanang va tanlang." },
      on_correct: { ru: 'Верно. В этой корзине пять яблок.', uz: "To'g'ri. Bu savatda beshta olma bor." },
      on_wrong: { ru: 'Не совсем. Посчитай до пяти.', uz: "Unchalik emas. Beshtagacha sanang." }
    }
  },

  // ---- sd — MINI-DRILL: 3-5 tez misol (ball yo'q, mashq) ----
  sd: {
    eyebrow: { ru: 'Потренируемся', uz: 'Mashq qilamiz' },
    instruction: { ru: 'Посчитай и нажми число', uz: 'Sana va sonni bos' },
    correct_text: { ru: 'Верно. Идём дальше.', uz: "To'g'ri. Davom etamiz." },
    done_text: { ru: 'Молодцы! Все примеры сосчитаны.', uz: "Barakalla! Hamma misol sanaldi." },
    audio: {
      intro: { ru: 'Посчитай предметы и нажми правильное число. Готов? Начинаем.', uz: "Narsalarni sanang va to'g'ri sonni bosing. Tayyormisiz? Boshladik." }
    }
  },

  // ---- s11 SUMMARY — sanaydigan qo'l + can-do ----
  s11: {
    eyebrow: { ru: 'Готово', uz: 'Tayyor' },
    main_1: { ru: 'Теперь вы умеете', uz: 'Endi siz' },
    main_2_em: { ru: 'считать до пяти', uz: 'beshgacha sanay olasiz' },
    connections_title: { ru: 'Что дальше', uz: 'Keyin nima' },
    connections_text: {
      ru: 'На следующем уроке научимся писать цифры от одного до пяти.',
      uz: "Keyingi darsda birdan beshgacha raqamlarni yozishni o'rganamiz."
    },
    audio: {
      ru: 'Гость Мадины рад. Вы помогли сосчитать яблоки. Теперь вы умеете считать до пяти, даже на пальцах. На следующем уроке научимся писать цифры.',
      uz: "Madinaning mehmoni xursand. Siz olmalarni sanashga yordam berdingiz. Endi siz beshgacha sanaysiz, hatto barmoqlarda ham. Keyingi darsda raqamlarni yozishni o'rganamiz."
    }
  }
};

// ============================================================
// 1-SINF ANIMATSION KIT (etalon — keyingi darslar shundan meros oladi)
// Barcha sikllar prefers-reduced-motion bilan to'xtaydi (CSS @media + usePrefersReducedMotion).
// ============================================================

// Reduced-motion holatini kuzatadi — JS sikllarini ham to'xtatish uchun.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply); else mq.addListener(apply);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', apply); else mq.removeListener(apply); };
  }, []);
  return reduced;
}

// 0..max gacha sanaydi (sekin, ovoz tempida). loop=false -> max da to'xtaydi (PM audit);
// loop=true -> max da holdMs kutib qaytadan boshlaydi (summary qo'li uchun).
// reduced-motion -> darrov max.
function useCountOnce(max, { stepMs = 1300, startDelay = 600, loop = false, holdMs = 1600 } = {}) {
  const reduced = usePrefersReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced) { const id = setTimeout(() => setK(max), 0); return () => clearTimeout(id); }
    let alive = true; let timer;
    let val = 0;
    const tick = () => {
      if (!alive) return;
      setK(val);
      if (val >= max) {
        if (!loop) return;                       // bir martalik: to'xtaydi
        timer = setTimeout(() => { val = 0; tick(); }, holdMs);  // loop: qaytadan
        return;
      }
      val += 1;
      timer = setTimeout(tick, val === 1 ? startDelay : stepMs);
    };
    timer = setTimeout(tick, startDelay);
    return () => { alive = false; clearTimeout(timer); };
  }, [max, stepMs, startDelay, loop, holdMs, reduced]);
  return k;
}

// Tabiiy shakllar (bolalar taniydigan). viewBox 0 0 40 40.
const ICON = {
  apple: <g><rect x="18.7" y="4" width="2.6" height="7" rx="1.3" fill="#7A5230"/><path d="M27 8c-3 0-5.2 2-6 4.4 3.2 0.6 6-1.4 6-4.4z" fill="#1F7A4D"/><circle cx="20" cy="24" r="13" fill="#FF4F28"/><ellipse cx="15" cy="19" rx="3.2" ry="4.6" fill="rgba(255,255,255,0.4)"/></g>,
  star: <path d="M20 4 L24.7 14.6 L36 15.6 L27.4 23 L30 34 L20 28 L10 34 L12.6 23 L4 15.6 L15.3 14.6 Z" fill="#019ACB"/>,
  fish: <g><ellipse cx="17" cy="20" rx="12" ry="8" fill="#019ACB"/><path d="M29 20 L38 13 L38 27 Z" fill="#019ACB"/><circle cx="12" cy="18" r="1.7" fill="#FFFFFF"/></g>,
  flower: <g><circle cx="20" cy="11" r="4.5" fill="#FF7AA8"/><circle cx="11.4" cy="17.2" r="4.5" fill="#FF7AA8"/><circle cx="14.7" cy="27.3" r="4.5" fill="#FF7AA8"/><circle cx="25.3" cy="27.3" r="4.5" fill="#FF7AA8"/><circle cx="28.6" cy="17.2" r="4.5" fill="#FF7AA8"/><circle cx="20" cy="20" r="5" fill="#FFC23C"/></g>,
  balloon: <g><path d="M20 27 L20 36" stroke="#A7A6A2" strokeWidth="1.4" fill="none"/><ellipse cx="20" cy="15" rx="10" ry="12" fill="#FF4F28"/><path d="M17.6 26 L22.4 26 L20 29 Z" fill="#FF4F28"/><ellipse cx="16" cy="11" rx="2.4" ry="3.4" fill="rgba(255,255,255,0.4)"/></g>
};
const KIND_ORDER = ['apple', 'star', 'fish', 'flower', 'balloon'];

const ObjSvg = ({ kind }) => (
  <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">{ICON[kind] || ICON.apple}</svg>
);

const Obj = ({ kind = 'apple', i = 0, anim = 'bob' }) => (
  <span className={`g1-obj ${anim ? 'g1-' + anim : ''}`} style={{ animationDelay: `${(i % 5) * 0.16}s` }}>
    <ObjSvg kind={kind}/>
  </span>
);

// Pips — statik pips o'rniga animatsion (idle bob/twinkle). API saqlangan (n, kind).
const Pips = ({ n, kind = 'apple', anim = 'bob' }) => (
  <div className="g1-pips">
    {Array.from({ length: n }).map((_, i) => <Obj key={i} kind={kind} i={i} anim={anim}/>)}
  </div>
);

// CountDemo — jonli sanash: narsalar birma-bir paydo (loop), katta son. variety=har xil narsa.
const CountDemo = ({ max = 5, kind = 'apple', variety = false, highlightLast = false, stepMs = 1300, onDone, showNumbers = true }) => {
  const k = useCountOnce(max, { stepMs });
  const firedRef = useRef(false);
  useEffect(() => { if (k >= max && !firedRef.current) { firedRef.current = true; if (onDone) onDone(); } }, [k, max, onDone]);
  return (
    <div className="g1-demo">
      <div className="g1-demo-row">
        {Array.from({ length: max }).map((_, i) => {
          const on = i < k;
          const isLast = i === k - 1;
          const kk = variety ? KIND_ORDER[i % KIND_ORDER.length] : kind;
          return (
            <span key={i} className={`g1-demo-cell ${on ? 'on' : ''} ${on && isLast && highlightLast ? 'pulse' : ''}`}>
              <ObjSvg kind={kk}/>
              {on && showNumbers && <span className="g1-demo-tag mono">{i + 1}</span>}
            </span>
          );
        })}
      </div>
      {showNumbers && <div className={`g1-demo-num mono ${highlightLast ? 'big' : ''}`}>{k}</div>}
    </div>
  );
};

// CountExamples — bir nechta misolni ketma-ket sanaydi (har xil narsa), so'ng onDone.
// "Sonlar bilan hamma narsani sanaymiz" g'oyasi uchun. reduced-motion -> oxirgi misol + onDone.
const S1_EXAMPLES = [{ n: 2, kind: 'flower' }, { n: 3, kind: 'apple' }, { n: 4, kind: 'star' }, { n: 5, kind: 'fish' }];
const CountExamples = ({ examples, onDone, stepMs = 680, pauseMs = 1100 }) => {
  const reduced = usePrefersReducedMotion();
  const [ei, setEi] = useState(0);
  const [k, setK] = useState(0);
  const doneRef = useRef(false);
  useEffect(() => {
    if (reduced) {
      const id = setTimeout(() => { setEi(examples.length - 1); setK(examples[examples.length - 1].n); if (onDone) onDone(); }, 0);
      return () => clearTimeout(id);
    }
    let alive = true; let timer; let e = 0; let c = 0;
    const tick = () => {
      if (!alive) return;
      setEi(e); setK(c);
      const n = examples[e].n;
      if (c < n) { c += 1; timer = setTimeout(tick, stepMs); return; }
      if (e < examples.length - 1) { e += 1; c = 0; timer = setTimeout(tick, pauseMs); return; }
      if (!doneRef.current) { doneRef.current = true; if (onDone) onDone(); }
    };
    timer = setTimeout(tick, 550);
    return () => { alive = false; clearTimeout(timer); };
  }, [examples, onDone, reduced, stepMs, pauseMs]);
  const cur = examples[ei];
  return (
    <div className="g1-demo">
      <div className="g1-demo-row">
        {Array.from({ length: cur.n }).map((_, i) => {
          const on = i < k;
          return (
            <span key={i} className={`g1-demo-cell ${on ? 'on' : ''}`}>
              <ObjSvg kind={cur.kind}/>
              {on && <span className="g1-demo-tag mono">{i + 1}</span>}
            </span>
          );
        })}
      </div>
      <div className="g1-demo-num mono">{k}</div>
    </div>
  );
};

// CountTrack — son qatori: belgi oldinga (1->5), 5 da pauza, keyin orqaga (5->1).
// speak=true bo'lsa, har songa kelganda o'sha son ovozda aytiladi (vizual bilan sinxron).
// Yo'nalish yorlig'i ko'rinadi; demo kuzatish uchun takrorlanadi. reduced-motion -> statik.
const CountTrack = ({ max = 5, speak = false, muted = false, startDelay = 650, onDone }) => {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(0);
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => {
    if (reduced) { const id = setTimeout(() => { setPos(0); setDir(0); if (onDone) onDone(); }, 0); return () => clearTimeout(id); }
    const steps = [];
    for (let n = 1; n <= max; n += 1) steps.push({ n, d: 1 });
    for (let n = max - 1; n >= 1; n -= 1) steps.push({ n, d: -1 });
    let alive = true; let timer; let i = 0; let fired = false;
    const tick = () => {
      if (!alive) return;
      if (i >= steps.length) {
        if (!fired) { fired = true; if (onDone) onDone(); }   // birinchi sweep tugadi
        setPos(0); setDir(0); timer = setTimeout(() => { i = 0; tick(); }, 1700); return;
      }
      const s = steps[i];
      setPos(s.n); setDir(s.d);
      if (speak && !mutedRef.current) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][s.n]); }
      const atPeak = s.n === max && s.d === 1;   // 5 da pauza
      i += 1;
      timer = setTimeout(tick, atPeak ? 1500 : 900);
    };
    timer = setTimeout(tick, startDelay);
    return () => { alive = false; clearTimeout(timer); };
  }, [max, reduced, speak, lang, startDelay, onDone]);
  const label = dir > 0 ? (lang === 'uz' ? 'Oldinga' : 'Вперёд') : dir < 0 ? (lang === 'uz' ? 'Orqaga' : 'Назад') : ' ';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
      <div className={`g1-track-label mono ${dir < 0 ? 'back' : ''}`}>
        {dir > 0 ? '→ ' : dir < 0 ? '← ' : ''}{label}
      </div>
      <div className="g1-track">
        {Array.from({ length: max }).map((_, i) => {
          const n = i + 1;
          const active = pos === n;
          return <div key={n} className={`g1-track-tile ${active ? 'active ' + (dir > 0 ? 'fwd' : 'back') : ''}`}><span className="mono">{n}</span></div>;
        })}
      </div>
    </div>
  );
};

// MissingTrack — son qatori bo'sh joy bilan (figura: 1 2 ? 4 5).
const MissingTrack = ({ seq }) => (
  <div className="g1-track">
    {seq.map((v, i) => (
      <div key={i} className={`g1-track-tile ${v === '?' ? 'gap' : ''}`}><span className="mono">{v}</span></div>
    ))}
  </div>
);

// CountingHand — realroq qo'l: teri rangli kaft + yumaloq barmoqlar (cho'zilgan/bukilgan).
// Barmoqlar 1..max bir marta ko'tariladi (5 da bosh barmoq ham). Darslik 2-bob 13-dars.
const CountingHand = ({ max = 5, big = false, loop = false }) => {
  const k = useCountOnce(max, { stepMs: 950, loop, holdMs: 1700 });
  const SKIN = '#F4BC8E', SKIN2 = '#E3A678', NAIL = '#FCE6D6';
  const palmTop = 86, bottom = 124;
  const fingers = [
    { x: 42, up: 50 },  // ko'rsatkich
    { x: 63, up: 62 },  // o'rta (eng uzun)
    { x: 84, up: 52 },  // nomsiz
    { x: 105, up: 40 }, // jimjiloq
  ];
  const upCount = Math.min(k, 4);
  const thumbUp = k >= 5;
  const ftrans = { transition: 'y 0.32s cubic-bezier(0.34,1.4,0.64,1), height 0.32s cubic-bezier(0.34,1.4,0.64,1), fill 0.3s ease' };
  return (
    <div className={`g1-hand ${big ? 'g1-hand-big' : ''}`}>
      <svg viewBox="0 0 162 184" width="100%" height="100%" aria-hidden="true">
        {/* bilak */}
        <rect x="60" y="150" width="46" height="32" rx="14" fill={SKIN2}/>
        {/* barmoqlar (bukilgan = kalta + to'qroq) */}
        {fingers.map((f, i) => {
          const up = i < upCount;
          const tip = palmTop - (up ? f.up : 18);
          return (
            <g key={i}>
              <rect x={f.x} y={tip} width="17" height={bottom - tip} rx="8.5" fill={up ? SKIN : SKIN2} style={ftrans}/>
              {up && <rect x={f.x + 3.5} y={tip + 6} width="10" height="13" rx="5" fill={NAIL}/>}
            </g>
          );
        })}
        {/* kaft */}
        <rect x="34" y="82" width="94" height="80" rx="34" fill={SKIN}/>
        <path d="M52 118 q29 11 56 0" stroke={SKIN2} strokeWidth="2.4" fill="none" opacity="0.5" strokeLinecap="round"/>
        <path d="M58 134 q23 8 46 0" stroke={SKIN2} strokeWidth="2.2" fill="none" opacity="0.42" strokeLinecap="round"/>
        {/* bosh barmoq (5 da chiqadi) */}
        <g transform={thumbUp ? 'rotate(-42 44 124)' : ''} style={{ transition: 'transform 0.32s ease' }}>
          <rect x={thumbUp ? 14 : 30} y={thumbUp ? 92 : 108} width="18" height={thumbUp ? 50 : 18} rx="9" fill={thumbUp ? SKIN : SKIN2} style={{ transition: 'fill 0.3s ease' }}/>
          {thumbUp && <rect x="18" y="97" width="10" height="13" rx="5" fill={NAIL}/>}
        </g>
      </svg>
      <div className="g1-hand-num mono">{k}</div>
    </div>
  );
};

// AmbientBg — bo'sh joyni to'ldiruvchi yengil suzuvchi shakllar (dekor, reduced-motion bilan o'chadi).
const AmbientBg = () => (
  <div className="amb" aria-hidden="true">
    <div className="amb-o amb-o1"/>
    <div className="amb-o amb-o2"/>
    <div className="amb-o amb-o3"/>
  </div>
);

// MiniDrill — bitta slaydda 3-5 tez misol: narsalarni sana, to'g'ri sonni bos.
// Past bosqichli mashq (ball yo'q), веди-до-верного har item uchun.
const DRILL_ITEMS = [
  { n: 3, kind: 'star' },
  { n: 2, kind: 'apple' },
  { n: 5, kind: 'fish' },
  { n: 4, kind: 'flower' },
];
const DRILL_OPTS = [2, 3, 4, 5];
const MiniDrill = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sd;
  const sfx = useSfx();
  const audio = useAudio([{ id: 'sd_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [idx, setIdx] = useState(0);
  const [solvedItem, setSolvedItem] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const [opts, setOpts] = useState(() => [...DRILL_OPTS]);   // variantlar (aralashtiriladi)
  const item = DRILL_ITEMS[idx];
  const total = DRILL_ITEMS.length;
  const allDone = idx >= total - 1 && solvedItem;

  const shuffledInitRef = useRef(false);
  useEffect(() => {
    if (!shuffledInitRef.current) { shuffledInitRef.current = true; setOpts(shuffleArr([...DRILL_OPTS])); }
  }, []);

  const prevIdxRef = useRef(0);
  useEffect(() => {
    if (idx !== prevIdxRef.current) {
      prevIdxRef.current = idx;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.instruction[lang]); }
    }
  }, [idx, audio.muted, c, lang]);

  const pick = (val) => {
    if (solvedItem || wrong.has(val)) return;
    if (val === item.n) {
      setSolvedItem(true);
      sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff({ ru: NUM_WORDS.ru[item.n], uz: NUM_WORDS.uz[item.n] }[lang]); e.pushOneOff((idx >= total - 1 ? c.done_text : c.correct_text)[lang]); } }
    } else {
      sfx.playWrong();
      setWrong(prev => { const s = new Set(prev); s.add(val); return s; });
    }
  };
  const nextItem = () => { setIdx(i => i + 1); setOpts(shuffleArr([...DRILL_OPTS])); setSolvedItem(false); setWrong(new Set()); };

  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!allDone} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
          <p className="h-sub title fade-up">{t(c.instruction)} <span className="mono small" style={{ color: T.ink3 }}>{idx + 1} / {total}</span></p>
          <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
            <Pips n={item.n} kind={item.kind}/>
          </div>
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {opts.map((val) => {
              const isCorrect = solvedItem && val === item.n;
              const isWrong = wrong.has(val);
              return (
                <button key={val} disabled={solvedItem || isWrong} onClick={() => pick(val)}
                  className={`g1-tile ${isCorrect ? 'g1-tile-ok' : ''} ${isWrong ? 'g1-tile-used' : ''}`}
                  style={{ width: '100%' }}>
                  {val}
                </button>
              );
            })}
          </div>
          {solvedItem && (
            <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <p className="body" style={{ margin: 0, color: T.success, fontWeight: 700 }}>
                <span aria-hidden="true">✓ </span>{t(allDone ? c.done_text : c.correct_text)}
              </p>
              {!allDone && (
                <button className="btn-white-accent" onClick={nextItem}
                  style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                  {lang === 'uz' ? 'Keyingisi' : 'Дальше'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRANLAR
// ============================================================

// s0 — HOOK: avval olmalarni birga sanaymiz (animatsiya), KEYIN savol chiqadi (PM audit).
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [picked, setPicked] = useState(null);
  const [showQ, setShowQ] = useState(false);
  const revealQ = useCallback(() => setShowQ(true), []);
  const pick = (i) => {
    setPicked(i);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const opts = [c.opt0, c.opt1, c.opt2];
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={picked === null} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
          <h1 className="title h-sub fade-up">
            {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span>{t(c.title_part3)}
          </h1>
          <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
            <CountDemo max={5} kind="apple" stepMs={900} onDone={revealQ} showNumbers={false}/>
          </div>
          {showQ && (
            <>
              <p className="body fade-up" style={{ color: T.ink2 }}>{t(c.question)}</p>
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {opts.map((o, i) => (
                  <button key={i} className={`g1-tile ${picked === i ? 'g1-tile-sel' : ''}`} onClick={() => pick(i)} style={{ width: '100%' }}>
                    {t(o)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION: sonlar bilan har xil narsani sanaymiz (misollar ketma-ket).
// NavNext faqat barcha misol ko'rsatilgandan keyin ishlaydi (PM/metodist talabi).
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [done, setDone] = useState(false);
  const onDone = useCallback(() => setDone(true), []);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!done} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
          <CountExamples examples={S1_EXAMPLES} onDone={onDone}/>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="body" style={{ margin: 0 }}><b>{lang === 'uz' ? 'Bilasizmi? ' : 'А знаешь? '}</b>{t(c.fact)}</p>
        </div>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION: o'zi sanaydi (tap, birma-bir). Qaytishda to'liq sbros.
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const N = 5;
  const [orders, setOrders] = useState({});
  const count = Object.keys(orders).length;
  const tap = (i) => {
    if (orders[i]) return;
    const order = count + 1;
    setOrders(prev => ({ ...prev, [i]: order }));
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][order]); }
    if (order === N) audio.triggerEvent('button_click', 'step');
  };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={count < N} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1">
          <div className="g1-count-grid">
            {Array.from({ length: N }).map((_, i) => (
              <button key={i} className={`g1-item ${orders[i] ? 'g1-item-on' : ''}`} onClick={() => tap(i)}>
                <span className={`g1-item-icon ${orders[i] ? '' : 'g1-bob'}`} style={{ animationDelay: `${(i % 5) * 0.16}s` }}><ObjSvg kind="apple"/></span>
                {orders[i] && <span className="g1-item-num mono">{orders[i]}</span>}
              </button>
            ))}
          </div>
          <div className="g1-bigcount mono">{t(c.count_label)}: {count}</div>
        </div>
      </div>
    </Stage>
  );
};

// s3 — RULE: kardinallik (jonli sanash, oxirgi son urg'uli) + qisqa qoida.
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s3;
  const audio = useAudio([{ id: 's3', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const [done, setDone] = useState(false);
  const onDone = useCallback(() => setDone(true), []);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!done} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <h2 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span>
        </h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
          <CountDemo max={5} kind="apple" highlightLast onDone={onDone}/>
        </div>
        <div className="frame-tip fade-up delay-2"><p className="body" style={{ margin: 0 }}>{t(c.tip)}</p></div>
      </div>
    </Stage>
  );
};

// s4 — TEST choice (yirik raqam-variantlar 2/3/4/5, to'g'ri = idx1). Yulduzlar miltillaydi.
const Screen4 = (props) => {
  const c = CONTENT.s4;
  const t = useT();
  const bigNum = (s) => <span style={{ fontSize: 'clamp(24px, 5.5vw, 34px)', fontWeight: 800 }}>{s}</span>;
  return (
    <QuestionScreen
      screen={props.screen} idx={4} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[4]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[bigNum('2'), bigNum('3'), bigNum('4'), bigNum('5')]}
      correctIdx={1}
      figure={() => <Pips n={3} kind="star" anim="twinkle"/>}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s5 — EXPLORATION (interaktiv): har katakni bos -> bitta olma tushadi, sanagich sanaydi.
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const N = 5;
  const [orders, setOrders] = useState({});   // katak indeksi -> tartib (1..5)
  const count = Object.keys(orders).length;
  const full = count === N;
  const tap = (i) => {
    if (orders[i]) return;
    const order = count + 1;
    setOrders(prev => ({ ...prev, [i]: order }));
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][order]); }
  };
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!full} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.2vw, 16px)' }}>
          <div className="g1-tenframe">
            {Array.from({ length: N }).map((_, i) => (
              <button key={i} className={`g1-cell-btn ${orders[i] ? 'filled' : ''}`} onClick={() => tap(i)} disabled={!!orders[i]}>
                {orders[i] && (
                  <span className="g1-cell-obj g1-drop">
                    <ObjSvg kind="apple"/>
                    <span className="g1-cell-num mono">{orders[i]}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="g1-bigcount mono">{t(c.count_label)}: {count}</div>
        </div>
        {full && (
          <div className="frame-success fade-up">
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 700 }}>
              <span aria-hidden="true">✓ </span>{t(c.full_text)}
            </p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — RULE: raqam <-> miqdor (1..5 qatorlar, har qatorda animatsion narsalar).
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <h2 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span> {t(c.title_part3)}
        </h2>
        <div className="frame fade-up delay-1">
          {[1, 2, 3, 4, 5].map((n, i) => (
            <div key={n} className={`g1-numrow fade-up delay-${Math.min(i + 1, 4)}`}>
              <span className="g1-digit mono">{n}</span>
              <Pips n={n} kind="apple"/>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST tap-pair (raqam tanlash -> guruh tanlash). Drag o'rniga tap-juftlash.
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s7;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);

  const GROUPS = [2, 5, 4];   // ko'rinish tartibi (guruhdagi narsalar soni)
  const TILES = [4, 2, 5];    // ko'rinish tartibi (raqamlar)
  const wasSolved = props.storedAnswer?.solved === true;
  const [placed, setPlaced] = useState(() => wasSolved ? { 2: true, 4: true, 5: true } : {});
  const [selected, setSelected] = useState(null);
  const [wrongGroup, setWrongGroup] = useState(null);
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? 0);
  const introAdvancedRef = useRef(wasSolved);
  const solved = Object.keys(placed).length === GROUPS.length;

  const recordIfSolved = (nextPlaced) => {
    if (Object.keys(nextPlaced).length === GROUPS.length) {
      props.onAnswer({
        stage: SCREEN_META[7].scope, screenIdx: 7,
        question: null, options: null, correctIndex: null, correctAnswer: null,
        studentAnswerIndex: null, studentAnswer: null,
        correct: firstTryRef.current !== false, firstTry: firstTryRef.current !== false,
        attempts: attemptsRef.current, solved: true
      });
    }
  };

  const tapTile = (val) => {
    if (placed[val] || solved) return;
    setSelected(val);
  };
  const tapGroup = (count) => {
    if (placed[count] || solved || selected === null) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    attemptsRef.current += 1;
    const ok = selected === count;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      sfx.playCorrect();
      const next = { ...placed, [count]: true };
      setPlaced(next);
      setSelected(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((Object.keys(next).length === GROUPS.length ? c.audio.on_correct : { ru: NUM_WORDS.ru[count], uz: NUM_WORDS.uz[count] })[lang]); }
      recordIfSolved(next);
    } else {
      if (firstTryRef.current === true) firstTryRef.current = false;
      sfx.playWrong();
      setWrongGroup(count);
      setTimeout(() => setWrongGroup(null), 600);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="g1-groups fade-up delay-1">
          {GROUPS.map((count) => {
            let cls = 'g1-group';
            if (placed[count]) cls += ' g1-group-ok';
            else if (wrongGroup === count) cls += ' g1-group-wrong';
            else if (selected !== null) cls += ' g1-group-armed';
            return (
              <div key={count} className={cls} onClick={() => tapGroup(count)}>
                <Pips n={count} kind="apple"/>
                <div className="g1-slot">{placed[count] && <span className="g1-slot-num">{count}</span>}</div>
              </div>
            );
          })}
        </div>
        <div className="g1-tiles fade-up delay-2">
          {TILES.map((val) => (
            <button key={val} disabled={!!placed[val] || solved} onClick={() => tapTile(val)}
              className={`g1-tile ${selected === val ? 'g1-tile-sel' : ''} ${placed[val] ? 'g1-tile-used' : ''}`}>
              {val}
            </button>
          ))}
        </div>
        <FeedbackBlock show={solved} isCorrect={true}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}
          </p>
          <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s8 — EXPLORATION: to'g'ri va teskari sanash (CountTrack belgisi oldinga/orqaga sakraydi).
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [done, setDone] = useState(false);
  const onDone = useCallback(() => setDone(true), []);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!done} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
          <CountTrack max={5} speak muted={audio.muted} startDelay={2600} onDone={onDone}/>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="body" style={{ margin: 0 }}><b>{lang === 'uz' ? 'Bilasizmi? ' : 'А знаешь? '}</b>{t(c.fact)}</p>
        </div>
      </div>
    </Stage>
  );
};

// s9 — TEST (xilma-xil drill): 5 xil mashq (sana / keyingi / ko'p / tushgan son / oldingi).
// Veди-до-верного har item; firstTry (hamma item birinchi urinishda) -> ball.
const DRILL9 = [
  { type: 'count',   n: 3, kind: 'star',  opts: [2, 3, 4, 5], ans: 3 },
  { type: 'next',    from: 2,             opts: [1, 3, 4, 5], ans: 3 },
  { type: 'more',    a: 5, b: 3, kindA: 'apple', kindB: 'fish' },        // ko'p = A
  { type: 'missing', seq: ['1', '2', '3', '?', '5'], opts: [2, 3, 4, 5], ans: 4 },
  { type: 'prev',    from: 4,             opts: [2, 3, 4, 5], ans: 3 },
];
const drill9PromptText = (it, lang, c) => {
  if (it.type === 'count') return c.q_count[lang];
  if (it.type === 'more') return c.q_more[lang];
  if (it.type === 'missing') return c.q_missing[lang];
  if (it.type === 'next') return c.q_next[lang];
  return c.q_prev[lang];
};
// Fisher-Yates (brauzerda Math.random -- faqat hodisalarda/effektda, render'da emas).
const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };
// Item uchun variantlar ro'yxati (son yoki guruh). pick(key, correct) qiymat bo'yicha tekshiradi -> aralashtirsa bo'ladi.
const drill9BuildOpts = (it) => {
  if (it.type === 'more') return [
    { key: 'A', group: true, n: it.a, okind: it.kindA, correct: it.a > it.b },
    { key: 'B', group: true, n: it.b, okind: it.kindB, correct: it.b > it.a },
  ];
  return it.opts.map((v) => ({ key: v, group: false, val: v, correct: v === it.ans }));
};
// BigNumberCue — keyingi/oldingi savoli: tayanch son + yo'nalish. To'g'ri javobdan keyin
// (solved) javob son o'q tomonida paydo bo'ladi (next: 2 -> 3; prev: 3 <- 4).
const BigNumberCue = ({ n, dir, ans, solved }) => (
  <div className="g1-cue">
    {dir === 'prev' && solved && <span className="g1-cue-num g1-cue-ans mono g1-pop-in">{ans}</span>}
    {dir === 'prev' && <span className="g1-cue-arrow">←</span>}
    <span className="g1-cue-num mono">{n}</span>
    {dir === 'next' && <span className="g1-cue-arrow">→</span>}
    {dir === 'next' && solved && <span className="g1-cue-num g1-cue-ans mono g1-pop-in">{ans}</span>}
  </div>
);

const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's9_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const total = DRILL9.length;
  const wasSolved = props.storedAnswer?.solved === true;
  const startIdx = wasSolved ? total - 1 : 0;
  const [idx, setIdx] = useState(startIdx);
  const [solvedItem, setSolvedItem] = useState(wasSolved);
  const [wrong, setWrong] = useState(() => new Set());
  const [opts, setOpts] = useState(() => drill9BuildOpts(DRILL9[startIdx]));   // variantlar (aralashtiriladi)
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? 0);
  const item = DRILL9[idx];
  const allDone = idx >= total - 1 && solvedItem;

  // boshlang'ich variantlarni bir marta aralashtirish (render'da random YO'Q)
  const shuffledInitRef = useRef(false);
  useEffect(() => {
    if (!shuffledInitRef.current) { shuffledInitRef.current = true; setOpts(shuffleArr(drill9BuildOpts(DRILL9[idx]))); }
  }, [idx]);

  const prevIdxRef = useRef(-1);
  useEffect(() => {
    if (idx !== prevIdxRef.current) {
      prevIdxRef.current = idx;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(drill9PromptText(DRILL9[idx], lang, CONTENT.s9)); }
    }
  }, [idx, audio.muted, lang]);

  const pick = (key, correct) => {
    if (solvedItem || wrong.has(key)) return;
    attemptsRef.current += 1;
    if (correct) {
      setSolvedItem(true);
      sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((idx >= total - 1 ? c.done_text : c.correct_text)[lang]); }
      if (idx >= total - 1) {
        const ft = firstTryRef.current !== false;
        props.onAnswer({
          stage: SCREEN_META[9].scope, screenIdx: 9,
          question: null, options: null, correctIndex: null, correctAnswer: null,
          studentAnswerIndex: null, studentAnswer: null,
          correct: ft, firstTry: ft, attempts: attemptsRef.current, solved: true
        });
      }
    } else {
      sfx.playWrong();
      firstTryRef.current = false;
      setWrong(prev => { const s = new Set(prev); s.add(key); return s; });
    }
  };
  const nextItem = () => {
    const ni = idx + 1;
    setIdx(ni);
    setOpts(shuffleArr(drill9BuildOpts(DRILL9[ni])));   // yangi item variantlarini aralashtir
    setSolvedItem(false);
    setWrong(new Set());
  };

  const figure = (() => {
    if (item.type === 'count') return <Pips n={item.n} kind={item.kind}/>;
    if (item.type === 'next' || item.type === 'prev') return <BigNumberCue n={item.from} dir={item.type} ans={item.ans} solved={solvedItem}/>;
    if (item.type === 'missing') return <MissingTrack seq={item.seq}/>;
    return null;
  })();

  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!allDone} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <h2 className="title h-sub fade-up">
          {drill9PromptText(item, lang, c)} <span className="mono small" style={{ color: T.ink3 }}>{idx + 1} / {total}</span>
        </h2>
        {figure && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}>
            {figure}
          </div>
        )}
        {item.type === 'more' ? (
          <div className="g1-groups fade-up delay-1">
            {opts.map((o) => {
              const isWrong = wrong.has(o.key);
              const isOk = solvedItem && o.correct;
              let cls = 'g1-group';
              if (isOk) cls += ' g1-group-ok';
              else if (isWrong) cls += ' g1-group-faded';
              return (
                <div key={o.key} className={cls} onClick={() => { if (!solvedItem && !isWrong) pick(o.key, o.correct); }}>
                  <Pips n={o.n} kind={o.okind}/>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {opts.map((o) => {
              const isWrong = wrong.has(o.key);
              const isOk = solvedItem && o.correct;
              return (
                <button key={o.key} disabled={solvedItem || isWrong} onClick={() => pick(o.key, o.correct)}
                  className={`g1-tile ${isOk ? 'g1-tile-ok' : ''} ${isWrong ? 'g1-tile-used' : ''}`} style={{ width: '100%' }}>
                  {o.val}
                </button>
              );
            })}
          </div>
        )}
        {solvedItem && (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 700 }}>
              <span aria-hidden="true">✓ </span>{t(allDone ? c.done_text : c.correct_text)}
            </p>
            {!allDone && (
              <button className="btn-white-accent" onClick={nextItem}
                style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
                {lang === 'uz' ? 'Keyingisi' : 'Дальше'}
              </button>
            )}
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TEST final + FactCard (savatlar 4/5/3, to'g'ri = idx1). Faktda sanaydigan qo'l.
const Screen10 = (props) => {
  const c = CONTENT.s10;
  const t = useT();
  const fact = (
    <div className="fact-card fade-up">
      <div className="fact-anim"><CountingHand max={5}/></div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(c.fact_badge)}</p>
        <p className="fact-text">{t(c.fact_text)}</p>
      </div>
    </div>
  );
  return (
    <QuestionScreen
      screen={props.screen} idx={11} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[11]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[<Pips n={4} kind="apple"/>, <Pips n={5} kind="apple"/>, <Pips n={3} kind="apple"/>]}
      correctIdx={1}
      factOnCorrect={fact}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s11 — SUMMARY: sanaydigan qo'l (loop) + can-do. NavNext -> finishLesson.
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const audio = useAudio([{ id: 's11', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="frame-success fade-up">
          <h2 className="title h-sub" style={{ margin: 0 }}>
            {t(c.main_1)} <span className="italic" style={{ color: T.success }}>{t(c.main_2_em)}</span>
          </h2>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(10px, 2vw, 16px)' }}>
          <CountingHand max={5} big loop/>
        </div>
        <div className="frame fade-up delay-2">
          <p className="eyebrow" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.connections_title)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.connections_text)}</p>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1)
// ============================================================
export default function CountingLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, MiniDrill, Screen10, Screen11];
  const CurrentScreen = screens[current];

  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <AmbientBg/>
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
  position: relative;
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
  opacity: 0.32 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.06) !important;
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
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; position: relative; z-index: 1; }
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

/* === GRADE1 num_1_01 — sanash vizuallari (animatsion to'plam) === */
.g1-pips { display: flex; flex-wrap: wrap; gap: clamp(7px, 1.8vw, 13px); justify-content: center; align-items: center; }
.g1-obj { width: clamp(28px, 6.5vw, 44px); height: clamp(28px, 6.5vw, 44px); display: inline-flex; flex-shrink: 0; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bob { animation: g1bob 3.6s ease-in-out infinite; }
.g1-twinkle { animation: g1twinkle 2.8s ease-in-out infinite; }
@keyframes g1bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes g1twinkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
@keyframes g1pop { 0% { opacity: 0; transform: scale(0.4); } 60% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
@keyframes g1drop { 0% { opacity: 0; transform: translateY(-30px); } 72% { transform: translateY(3px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes g1pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
@keyframes g1gap { 0%, 100% { transform: scale(1); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.30); } 50% { transform: scale(1.06); box-shadow: 0 10px 22px -6px rgba(255,79,40,0.5); } }

/* CountDemo — jonli sanash */
.g1-demo { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.4vw, 16px); }
.g1-demo-row { display: flex; gap: clamp(10px, 2.4vw, 16px); justify-content: center; align-items: flex-end; min-height: clamp(46px, 10vw, 66px); }
.g1-demo-cell { position: relative; width: clamp(40px, 8.5vw, 60px); height: clamp(40px, 8.5vw, 60px); opacity: 0; }
.g1-demo-cell.on { opacity: 1; animation: g1pop 0.45s ease-out; }
.g1-demo-cell.pulse { animation: g1pop 0.45s ease-out, g1pulse 1.7s ease-in-out 0.5s infinite; }
.g1-demo-cell svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-demo-tag { position: absolute; top: -8px; right: -6px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-demo-num { font-weight: 800; font-size: clamp(30px, 7vw, 48px); color: #FF4F28; line-height: 1; }
.g1-demo-num.big { font-size: clamp(40px, 10vw, 66px); }

/* TenFrame — bo'sh kataklar */
.g1-tenframe { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-cell { width: clamp(50px, 11vw, 72px); height: clamp(50px, 11vw, 72px); border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.25s, box-shadow 0.25s; }
.g1-cell-target { background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); }
.g1-cell-filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; }
.g1-cell-empty { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; }
.g1-cell-obj { width: 74%; height: 74%; display: inline-flex; animation: g1drop 0.4s ease-out; }
.g1-cell-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.18)); }
/* interaktiv ten-frame (s5): bosiladigan kataklar */
.g1-cell-btn { position: relative; width: clamp(50px, 11vw, 72px); height: clamp(50px, 11vw, 72px); border: none; border-radius: 14px; cursor: pointer; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); display: flex; align-items: center; justify-content: center; transition: background 0.2s, box-shadow 0.2s, transform 0.15s; }
.g1-cell-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 2px #019ACB; }
.g1-cell-btn.filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }
.g1-cell-num { position: absolute; top: 3px; right: 6px; font-weight: 800; font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; }

/* CountTrack / MissingTrack — son qatori */
.g1-track-label { font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #FF4F28; letter-spacing: 0.02em; min-height: 1.3em; transition: color 0.25s; }
.g1-track-label.back { color: #019ACB; }
.g1-track { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-track-tile { width: clamp(40px, 9vw, 56px); height: clamp(44px, 10vw, 62px); background: #FFFFFF; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, color 0.25s, box-shadow 0.25s; }
.g1-track-tile span { font-weight: 800; font-size: clamp(22px, 5vw, 32px); color: #0E0E10; }
.g1-track-tile.active { background: #FF4F28; transform: translateY(-7px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-track-tile.active span { color: #FFFFFF; }
.g1-track-tile.gap { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; animation: g1gap 1.4s ease-in-out infinite; }
.g1-track-tile.gap span { color: #D8A93A; }
/* BigNumberCue (keyingi/oldingi savol uchun tayanch son) */
.g1-cue { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 3vw, 22px); }
.g1-cue-num { width: clamp(64px, 16vw, 96px); height: clamp(64px, 16vw, 96px); background: #FF4F28; color: #FFFFFF; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(34px, 8vw, 52px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-cue-arrow { font-size: clamp(34px, 9vw, 54px); font-weight: 800; color: #A7A6A2; }
.g1-cue-num.g1-cue-ans { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-pop-in { animation: g1pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }

/* CountingHand — sanaydigan qo'l */
.g1-hand { position: relative; width: clamp(110px, 25vw, 168px); height: clamp(104px, 23vw, 156px); display: flex; align-items: center; justify-content: center; }
.g1-hand-big { width: clamp(165px, 42vw, 250px); height: clamp(155px, 40vw, 232px); }
.g1-hand svg { width: 100%; height: 100%; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.2)); }
.g1-hand-num { position: absolute; top: -2px; right: 2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(15px, 2.4vw, 20px); min-width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -4px rgba(31,122,77,0.5); }

.g1-count-grid { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.5vw, 18px); justify-content: center; }
.g1-item { position: relative; background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(12px, 2.6vw, 18px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.18s, background 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; }
.g1-item:hover { transform: translateY(-2px); }
.g1-item-on { background: #E3F0E8; box-shadow: 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-item-num { position: absolute; top: 4px; right: 8px; font-weight: 800; font-size: clamp(14px, 2vw, 18px); color: #1F7A4D; }
.g1-item-icon { width: clamp(30px, 7vw, 46px); height: clamp(30px, 7vw, 46px); display: inline-flex; }
.g1-item-icon svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bigcount { text-align: center; margin-top: 14px; font-weight: 800; font-size: clamp(16px, 2.4vw, 20px); color: #0E0E10; }

.g1-numrow { display: flex; align-items: center; gap: clamp(12px, 3vw, 20px); padding: clamp(5px, 1.3vw, 9px) 0; }
.g1-digit { font-weight: 800; font-size: clamp(28px, 6vw, 44px); color: #FF4F28; min-width: 1.2em; text-align: center; }

/* tap-pair (s5) */
.g1-groups { display: flex; gap: clamp(8px, 2vw, 16px); justify-content: center; flex-wrap: wrap; }
.g1-group { flex: 1; min-width: clamp(88px, 26vw, 150px); background: #FFFFFF; border: 2px dashed #A7A6A2; border-radius: 16px; padding: clamp(10px, 2vw, 16px); display: flex; flex-direction: column; align-items: center; gap: 10px; transition: border-color 0.18s, background 0.18s; cursor: pointer; }
.g1-group-armed { border-color: #019ACB; background: #EAF6FB; }
.g1-group-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.g1-group-wrong { border-color: #FF4F28; background: #FFE8E1; }
.g1-group-faded { opacity: 0.3; cursor: default; }
.g1-slot { min-height: clamp(38px, 7vw, 50px); display: flex; align-items: center; justify-content: center; }
.g1-slot-num { font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #1F7A4D; }
.g1-tiles { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; margin-top: 4px; }
.g1-tile { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 5.5vw, 36px); color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.18); transition: transform 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s; }
.g1-tile:hover:not(:disabled) { transform: translateY(-2px); }
.g1-tile-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 10px 24px -6px rgba(255,79,40,0.5); }
.g1-tile-ok { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 10px 24px -6px rgba(31,122,77,0.4); }
.g1-tile-used { opacity: 0.3; cursor: default; }
.g1-tile:disabled { cursor: default; }
`;
