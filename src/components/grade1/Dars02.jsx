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
        <div className="fade-up" style={{ maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(16px, 2.6vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, maxHeight: solved ? 0 : 600, opacity: solved ? 0 : 1, marginBottom: solved ? 'calc(-1 * clamp(16px, 2.6vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
// --- POD UROK: num_1_02 — Raqamlar 1–5 (1-sinf, Dars02) ---
// 1-sinf (6–7 yosh): ovoz yetakchi, typing YO'Q (tap/tartiblash), concrete ustun, bar model YO'Q.
// Manba: 1sinf_metodologiya.md (§7 Б1, §4 CRA, §6 yoy) + DIZAYN_STANDART_1SINF.md.
// Pererekvizit: Dars 1 (num_1_01). Fokus: raqam SHAKLI (1–5), raqam↔miqdor, 1→5 tartiblash.
// Misconception'lar: M1 o'xshash shakl (2↔5) · M2 off-by-one · M3 ketma-ketlik.
// ============================================================

const TOTAL_SCREENS = 9;
const LESSON_META = {
  lessonId: 'num-1-02-v1',
  lessonTitle: { ru: 'Цифры 1–5', uz: 'Raqamlar 1–5' }
};
const SCREEN_META = [
  { id: 's0', type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's3', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6', type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' },
  { id: 's7', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's8', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const NUM_WORDS = { ru: ['', 'один', 'два', 'три', 'четыре', 'пять'], uz: ['', 'bir', 'ikki', 'uch', "to'rt", 'besh'] };

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title_part1: { ru: 'Цифры', uz: 'Raqamlar' },
    title_part2_em: { ru: 'спрятались', uz: 'aralashib' },
    title_part3: { ru: 'и перепутались.', uz: 'ketdi.' },
    question: { ru: 'Ты узнаёшь их все? Давай проверим.', uz: 'Hammasini taniysizmi? Keling, tekshiramiz.' },
    opt0: { ru: 'Да', uz: 'Ha' },
    opt1: { ru: 'Не все', uz: 'Hammasini emas' },
    opt2: { ru: 'Не уверен', uz: 'Ishonchim komil emas' },
    audio: {
      intro: {
        ru: 'Цифры от одного до пяти перепутались. У каждой свой вид и своё имя. Ты узнаёшь их все? Давай проверим вместе.',
        uz: "Birdan beshgacha raqamlar aralashib ketdi. Har birining o'z ko'rinishi va o'z nomi bor. Hammasini taniysizmi? Keling, birga tekshiramiz."
      },
      on_correct: { ru: 'Хорошо. Посмотрим на каждую.', uz: "Yaxshi. Har biriga qaraymiz." },
      on_wrong: { ru: 'Хорошо. Посмотрим на каждую.', uz: "Yaxshi. Har biriga qaraymiz." }
    }
  },
  s1: {
    eyebrow: { ru: 'Узнаём', uz: 'Tanishamiz' },
    instruction: { ru: 'Нажми на каждую цифру', uz: "Har raqamni bosing" },
    audio: {
      ru: [
        'Нажимай на каждую цифру по очереди. Услышишь имя и увидишь, сколько это.',
        'У каждой цифры свой вид и своё число. Один, два, три, четыре, пять.'
      ],
      uz: [
        "Har raqamni navbat bilan bosing. Nomini eshitasiz va nechtaligini ko'rasiz.",
        "Har raqamning o'z ko'rinishi va o'z soni bor. Bir, ikki, uch, to'rt, besh."
      ]
    }
  },
  s2: {
    eyebrow: { ru: 'Запомним', uz: 'Eslab qolamiz' },
    title_part1: { ru: 'У каждой цифры', uz: 'Har raqamning' },
    title_part2_em: { ru: 'свой вид', uz: "o'z ko'rinishi" },
    title_part3: { ru: 'и своё место', uz: "va o'rni bor" },
    tip: {
      ru: 'Цифры идут по порядку: один, два, три, четыре, пять. У каждой свой вид.',
      uz: "Raqamlar tartib bilan keladi: bir, ikki, uch, to'rt, besh. Har birining o'z ko'rinishi bor."
    },
    audio: {
      ru: 'У каждой цифры свой вид и своё имя. Они идут по порядку: один, два, три, четыре, пять.',
      uz: "Har raqamning o'z ko'rinishi va o'z nomi bor. Ular tartib bilan keladi: bir, ikki, uch, to'rt, besh."
    }
  },
  s3: {
    eyebrow: { ru: 'Тренировка · 1 / 4', uz: 'Mashq · 1 / 4' },
    title: { ru: 'Где четыре предмета?', uz: "Qayerda to'rtta narsa bor?" },
    target_digit: { ru: '4', uz: '4' },
    correct_text: { ru: 'Верно. В этой группе ровно четыре.', uz: "To'g'ri. Bu guruhda roppa-rosa to'rtta." },
    wrong_0: { ru: 'Здесь только три. До четырёх не хватает одного. Посчитай до четырёх.', uz: "Bu yerda atigi uchta. To'rttaga bittasi yetmaydi. To'rttagacha sanang." },
    wrong_2: { ru: 'Здесь пять — на один больше четырёх. Считай и остановись на четырёх.', uz: "Bu yerda beshta — to'rttadan bitta ortiq. Sanang va to'rttada to'xtang." },
    wrong_3: { ru: 'Здесь только два. Цифра четыре — это четыре предмета. Посчитай ещё раз.', uz: "Bu yerda atigi ikkita. To'rt raqami — bu to'rtta narsa. Yana bir bor sanang." },
    wrong_default: { ru: 'Не совсем. Посчитай предметы в каждой группе до четырёх.', uz: "Unchalik emas. Har guruhdagi narsalarni to'rttagacha sanang." },
    audio: {
      intro: { ru: 'Цифра четыре. В какой группе четыре предмета? Посчитай и выбери.', uz: "To'rt raqami. Qaysi guruhda to'rtta narsa bor? Sanang va tanlang." },
      on_correct: { ru: 'Верно. Здесь четыре.', uz: "To'g'ri. Bu yerda to'rtta." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana sanang." }
    }
  },
  s4: {
    eyebrow: { ru: 'Тренировка · 2 / 4', uz: 'Mashq · 2 / 4' },
    title: { ru: 'Сколько здесь? Выбери цифру.', uz: 'Bu yerda nechta? Raqamni tanlang.' },
    correct_text: { ru: 'Верно. Три предмета — это цифра три.', uz: "To'g'ri. Uchta narsa — bu uch raqami." },
    wrong_0: { ru: 'Это не два. Похоже, одну пропустил. Посчитай снова, не пропуская.', uz: "Bu ikki emas. Bittasini tashlab ketgansiz. Tashlamasdan qaytadan sanang." },
    wrong_2: { ru: 'Это не четыре. Похоже, одну посчитал дважды. Считай каждую по разу.', uz: "Bu to'rt emas. Bittasini ikki marta sanagansiz. Har birini bir martadan sanang." },
    wrong_3: { ru: 'Это цифра пять, а не три. Посмотри на её вид и посчитай предметы.', uz: "Bu besh raqami, uch emas. Uning ko'rinishiga qarang va narsalarni sanang." },
    wrong_default: { ru: 'Не совсем. Посчитай предметы и выбери нужную цифру.', uz: "Unchalik emas. Narsalarni sanang va kerakli raqamni tanlang." },
    audio: {
      intro: { ru: 'Сколько здесь предметов? Посчитай и нажми нужную цифру.', uz: "Bu yerda nechta narsa bor? Sanang va kerakli raqamni bosing." },
      on_correct: { ru: 'Верно. Их три.', uz: "To'g'ri. Ular uchta." },
      on_wrong: { ru: 'Не совсем. Посчитай ещё раз.', uz: "Unchalik emas. Yana sanang." }
    }
  },
  s5: {
    eyebrow: { ru: 'Тренировка · 3 / 4', uz: 'Mashq · 3 / 4' },
    title: { ru: 'Где цифра пять?', uz: 'Qaysi biri besh?' },
    correct_text: { ru: 'Верно. Это цифра пять.', uz: "To'g'ri. Bu besh raqami." },
    wrong_0: { ru: 'Это цифра два. Два и пять похожи, но смотрят в разные стороны. Найди пять.', uz: "Bu ikki raqami. Ikki va besh o'xshash, lekin har xil tomonga qaraydi. Beshni toping." },
    wrong_2: { ru: 'Это цифра три — у неё два изгиба. Цифра пять другая. Посмотри снова.', uz: "Bu uch raqami — uning ikkita egriligi bor. Besh raqami boshqacha. Yana qarang." },
    wrong_3: { ru: 'Это цифра четыре, не пять. Сравни их вид и выбери пять.', uz: "Bu to'rt raqami, besh emas. Ko'rinishini solishtiring va beshni tanlang." },
    wrong_default: { ru: 'Не совсем. Найди цифру пять по её виду.', uz: "Unchalik emas. Besh raqamini ko'rinishidan toping." },
    audio: {
      intro: { ru: 'Где здесь цифра пять? Посмотри на вид каждой и выбери.', uz: "Bu yerda besh raqami qaysi biri? Har birining ko'rinishiga qarang va tanlang." },
      on_correct: { ru: 'Верно. Это пять.', uz: "To'g'ri. Bu besh." },
      on_wrong: { ru: 'Не совсем. Посмотри на вид ещё раз.', uz: "Unchalik emas. Ko'rinishiga yana qarang." }
    }
  },
  s6: {
    eyebrow: { ru: 'Тренировка · 4 / 4', uz: 'Mashq · 4 / 4' },
    instruction: { ru: 'Нажимай цифры по порядку: от 1 до 5', uz: "Raqamlarni tartib bilan bosing: 1 dan 5 gacha" },
    correct_text: { ru: 'Верно. Все цифры по порядку: один, два, три, четыре, пять.', uz: "To'g'ri. Hamma raqam tartib bilan: bir, ikki, uch, to'rt, besh." },
    wrong_default: { ru: 'Это не следующая цифра. Подумай: какое число идёт после предыдущего?', uz: "Bu keyingi raqam emas. O'ylang: oldingi sondan keyin qaysi son keladi?" },
    audio: {
      intro: { ru: 'Нажимай цифры по порядку, от одного до пяти. Начни с одного.', uz: "Raqamlarni tartib bilan bosing, birdan beshgacha. Birdan boshlang." },
      on_correct: { ru: 'Верно. Цифры по порядку.', uz: "To'g'ri. Raqamlar tartib bilan." },
      on_wrong: { ru: 'Не совсем. Какая цифра дальше?', uz: "Unchalik emas. Keyingi raqam qaysi?" }
    }
  },
  s7: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    title: { ru: 'Где пять предметов?', uz: 'Qayerda beshta narsa bor?' },
    target_digit: { ru: '5', uz: '5' },
    correct_text: { ru: 'Верно. Цифра пять — это пять предметов.', uz: "To'g'ri. Besh raqami — bu beshta narsa." },
    wrong_0: { ru: 'Здесь четыре — до пяти не хватает одного. Посчитай до пяти.', uz: "Bu yerda to'rtta — beshtaga bittasi yetmaydi. Beshtagacha sanang." },
    wrong_2: { ru: 'Здесь только три. Цифра пять — это пять. Посчитай ещё раз.', uz: "Bu yerda atigi uchta. Besh raqami — bu beshta. Yana sanang." },
    wrong_default: { ru: 'Не совсем. Посчитай предметы в каждой группе до пяти.', uz: "Unchalik emas. Har guruhdagi narsalarni beshtagacha sanang." },
    fact_badge: { ru: 'А знаешь? · Мир', uz: 'Bilasizmi? · Dunyo' },
    fact_text: { ru: 'Эти цифры пишут одинаково во всём мире.', uz: "Bu raqamlar butun dunyoda bir xil yoziladi." },
    audio: {
      intro: { ru: 'Цифра пять. В какой группе пять предметов? Посчитай и выбери.', uz: "Besh raqami. Qaysi guruhda beshta narsa bor? Sanang va tanlang." },
      on_correct: { ru: 'Верно. Их пять. А знаешь, эти цифры пишут одинаково во всём мире.', uz: "To'g'ri. Ular beshta. Bilasizmi, bu raqamlar butun dunyoda bir xil yoziladi." },
      on_wrong: { ru: 'Не совсем. Посчитай до пяти.', uz: "Unchalik emas. Beshtagacha sanang." }
    }
  },
  s8: {
    eyebrow: { ru: 'Готово', uz: 'Tayyor' },
    main_1: { ru: 'Теперь вы', uz: 'Endi siz' },
    main_2_em: { ru: 'узнаёте цифры 1–5', uz: '1–5 raqamlarini taniysiz' },
    connections_title: { ru: 'Что дальше', uz: 'Keyin nima' },
    connections_text: { ru: 'На следующем уроке — числа от 6 до 10 и число ноль.', uz: "Keyingi darsda — 6 dan 10 gacha sonlar va nol soni." },
    audio: {
      ru: 'Сегодня вы научились узнавать цифры от одного до пяти и ставить их по порядку. На следующем уроке встретим числа от шести до десяти и ноль.',
      uz: "Bugun siz birdan beshgacha raqamlarni tanishni va tartiblashni o'rgandingiz. Keyingi darsda olti dan o'ngacha sonlar va nol bilan tanishamiz."
    }
  }
};

// ============================================================
// YORDAMCHI KOMPONENTLAR
// ============================================================
const Pips = ({ n, kind = 'apple' }) => (
  <div className="g1-pips">
    {Array.from({ length: n }).map((_, i) => (<span key={i} className={`g1-pip g1-pip-${kind}`} />))}
  </div>
);
const Big = ({ children }) => <span style={{ fontSize: 'clamp(26px, 6vw, 38px)', fontWeight: 800 }}>{children}</span>;

// ============================================================
// EKRANLAR
// ============================================================

// s0 — HOOK (custom): aralash raqamlar; picked TO'LIQ sbros.
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [picked, setPicked] = useState(null);
  const pick = (i) => { setPicked(i); if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); } };
  const opts = [c.opt0, c.opt1, c.opt2];
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={props.onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <h1 className="title h-sub fade-up">
          {t(c.title_part1)} <span className="italic" style={{ color: T.accent }}>{t(c.title_part2_em)}</span> {t(c.title_part3)}
        </h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 3vw, 22px)', padding: 'clamp(18px, 3.4vw, 26px)' }}>
          {[3, 1, 5, 2, 4].map((d, i) => <span key={i} className="g1-digit mono">{d}</span>)}
        </div>
        <p className="body fade-up delay-2" style={{ color: T.ink2 }}>{t(c.question)}</p>
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className={`g1-tile ${picked === i ? 'g1-tile-sel' : ''}`} onClick={() => pick(i)} style={{ width: '100%', fontSize: 'clamp(14px, 2.2vw, 18px)' }}>
              {t(o)}
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION tap-reveal (raqam kartalari 1–5).
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio(makeAudioSegments(c, lang));
  const N = 5;
  const [revealed, setRevealed] = useState(() => new Set());
  const tap = (val) => {
    if (revealed.has(val)) return;
    const next = new Set(revealed); next.add(val); setRevealed(next);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(NUM_WORDS[lang][val]); }
    if (next.size === N) audio.triggerEvent('button_click', 'step');
  };
  const done = revealed.size === N;
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={props.onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="g1-digcards fade-up delay-1">
          {[1, 2, 3, 4, 5].map((val) => (
            <button key={val} className={`g1-digcard ${revealed.has(val) ? 'g1-digcard-on' : ''}`} onClick={() => tap(val)}>
              <span className="g1-digit mono">{val}</span>
              <div className="g1-digcard-dots">{revealed.has(val) && <Pips n={val} kind="apple"/>}</div>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s2 — RULE (raqam qatori 1–5).
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={false} onClick={props.onNext} label={<NextLabel/>}/></>);
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
        <div className="frame-tip fade-up delay-2"><p className="body" style={{ margin: 0 }}>{t(c.tip)}</p></div>
      </div>
    </Stage>
  );
};

// s3 — TEST choice: raqam(4) → guruh. Guruhlar 3/4/5/2, to'g'ri idx1.
const Screen3 = (props) => {
  const t = useT();
  const c = CONTENT.s3;
  return (
    <QuestionScreen
      screen={props.screen} idx={3} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[3]} screenContent={c}
      question={<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ display: 'flex', justifyContent: 'center' }}><Big>{t(c.target_digit)}</Big></div><h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(c.title)}</h2></div>}
      options={[<Pips n={3} kind="apple"/>, <Pips n={4} kind="apple"/>, <Pips n={5} kind="apple"/>, <Pips n={2} kind="apple"/>]}
      correctIdx={1}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer} onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s4 — TEST choice: 3 nuqta → raqam. Raqamlar 2/3/4/5, to'g'ri idx1.
const Screen4 = (props) => {
  const t = useT();
  const c = CONTENT.s4;
  return (
    <QuestionScreen
      screen={props.screen} idx={4} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[4]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[<Big>2</Big>, <Big>3</Big>, <Big>4</Big>, <Big>5</Big>]}
      correctIdx={1}
      figure={() => <Pips n={3} kind="star"/>}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer} onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s5 — TEST choice: qaysi biri besh? Raqamlar 2/5/3/4, to'g'ri idx1.
const Screen5 = (props) => {
  const t = useT();
  const c = CONTENT.s5;
  return (
    <QuestionScreen
      screen={props.screen} idx={5} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[5]} screenContent={c}
      question={<h2 className="title h-sub">{t(c.title)}</h2>}
      options={[<Big>2</Big>, <Big>5</Big>, <Big>3</Big>, <Big>4</Big>]}
      correctIdx={1}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer} onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s6 — TEST tap-order (custom): 1→5 tartibla.
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const TILES = [3, 1, 5, 2, 4];
  const N = 5;
  const wasSolved = props.storedAnswer?.solved === true;
  const [placed, setPlaced] = useState(() => wasSolved ? [1, 2, 3, 4, 5] : []);
  const [wrongTile, setWrongTile] = useState(null);
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? 0);
  const introAdvancedRef = useRef(wasSolved);
  const solved = placed.length === N;

  const tap = (val) => {
    if (solved || placed.includes(val)) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    attemptsRef.current += 1;
    const expected = placed.length + 1;
    const ok = val === expected;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      sfx.playCorrect();
      const next = [...placed, val]; setPlaced(next);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((next.length === N ? c.audio.on_correct : { ru: NUM_WORDS.ru[val], uz: NUM_WORDS.uz[val] })[lang]); }
      if (next.length === N) {
        props.onAnswer({
          stage: SCREEN_META[6].scope, screenIdx: 6,
          question: null, options: null, correctIndex: null, correctAnswer: null,
          studentAnswerIndex: null, studentAnswer: null,
          correct: firstTryRef.current !== false, firstTry: firstTryRef.current !== false,
          attempts: attemptsRef.current, solved: true
        });
      }
    } else {
      if (firstTryRef.current === true) firstTryRef.current = false;
      sfx.playWrong();
      setWrongTile(val); setTimeout(() => setWrongTile(null), 600);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };

  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={props.onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
        <p className="h-sub title fade-up">{t(c.instruction)}</p>
        <div className="g1-order-line fade-up delay-1">
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} className={`g1-order-slot ${placed[i] ? 'g1-order-slot-ok' : ''}`}>{placed[i] || ''}</div>
          ))}
        </div>
        <div className="g1-tiles fade-up delay-2">
          {TILES.map((val) => (
            <button key={val} disabled={placed.includes(val) || solved}
              className={`g1-tile ${placed.includes(val) ? 'g1-tile-used' : ''} ${wrongTile === val ? 'g1-tile-wrong' : ''}`} onClick={() => tap(val)}>
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

// s7 — TEST final + FactCard: raqam(5) → guruh. Guruhlar 4/5/3, to'g'ri idx1.
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const fact = (
    <div className="fact-card fade-up">
      <div className="fact-anim"><Pips n={5} kind="apple"/></div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(c.fact_badge)}</p>
        <p className="fact-text">{t(c.fact_text)}</p>
      </div>
    </div>
  );
  return (
    <QuestionScreen
      screen={props.screen} idx={7} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[7]} screenContent={c}
      question={<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ display: 'flex', justifyContent: 'center' }}><Big>{t(c.target_digit)}</Big></div><h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(c.title)}</h2></div>}
      options={[<Pips n={4} kind="apple"/>, <Pips n={5} kind="apple"/>, <Pips n={3} kind="apple"/>]}
      correctIdx={1}
      factOnCorrect={fact}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer} onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// s8 — SUMMARY.
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const audio = useAudio([{ id: 's8', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="frame-success fade-up">
          <h2 className="title h-sub" style={{ margin: 0 }}>
            {t(c.main_1)} <span className="italic" style={{ color: T.success }}>{t(c.main_2_em)}</span>
          </h2>
        </div>
        <div className="frame fade-up delay-1">
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
export default function CountingDigitsLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8];
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

/* === GRADE1 num_1_01 — sanash vizuallari (yirik, tap/juftlash) === */
.g1-pips { display: flex; flex-wrap: wrap; gap: clamp(7px, 1.8vw, 13px); justify-content: center; align-items: center; }
.g1-pip { width: clamp(26px, 6.5vw, 42px); height: clamp(26px, 6.5vw, 42px); border-radius: 50%; display: inline-block; flex-shrink: 0; }
.g1-pip-apple { background: #FF4F28; box-shadow: inset 0 -4px 0 rgba(0,0,0,0.08), 0 4px 10px -4px rgba(255,79,40,0.45); }
.g1-pip-star { background: #019ACB; box-shadow: 0 4px 10px -4px rgba(1,154,203,0.45); }

.g1-count-grid { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.5vw, 18px); justify-content: center; }
.g1-item { position: relative; background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(12px, 2.6vw, 18px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.18s, background 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; }
.g1-item:hover { transform: translateY(-2px); }
.g1-item-on { background: #E3F0E8; box-shadow: 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-item-num { position: absolute; top: 4px; right: 8px; font-weight: 800; font-size: clamp(14px, 2vw, 18px); color: #1F7A4D; }
.g1-bigcount { text-align: center; margin-top: 14px; font-weight: 800; font-size: clamp(16px, 2.4vw, 20px); color: #0E0E10; }

.g1-numrow { display: flex; align-items: center; gap: clamp(12px, 3vw, 20px); padding: clamp(5px, 1.3vw, 9px) 0; }
.g1-digit { font-weight: 800; font-size: clamp(28px, 6vw, 44px); color: #FF4F28; min-width: 1.2em; text-align: center; }

/* tap-pair (s5) */
.g1-groups { display: flex; gap: clamp(8px, 2vw, 16px); justify-content: center; flex-wrap: wrap; }
.g1-group { flex: 1; min-width: clamp(88px, 26vw, 150px); background: #FFFFFF; border: 2px dashed #A7A6A2; border-radius: 16px; padding: clamp(10px, 2vw, 16px); display: flex; flex-direction: column; align-items: center; gap: 10px; transition: border-color 0.18s, background 0.18s; cursor: pointer; }
.g1-group-armed { border-color: #019ACB; background: #EAF6FB; }
.g1-group-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.g1-group-wrong { border-color: #FF4F28; background: #FFE8E1; }
.g1-slot { min-height: clamp(38px, 7vw, 50px); display: flex; align-items: center; justify-content: center; }
.g1-slot-num { font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #1F7A4D; }
.g1-tiles { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; margin-top: 4px; }
.g1-tile { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(10px, 2vw, 16px) clamp(16px, 3vw, 24px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 5.5vw, 36px); color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.18); transition: transform 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s; }
.g1-tile:hover:not(:disabled) { transform: translateY(-2px); }
.g1-tile-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 10px 24px -6px rgba(255,79,40,0.5); }
.g1-tile-used { opacity: 0.35; cursor: default; }
.g1-tile:disabled { cursor: default; }

/* === GRADE1 num_1_02 qo'shimchalari (tap-reveal, tap-order) === */
.g1-digcards { display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); justify-content: center; }
.g1-digcard { display: flex; flex-direction: column; align-items: center; gap: 8px; background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(10px, 2.2vw, 16px) clamp(12px, 2.4vw, 18px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.18s, background 0.18s, box-shadow 0.18s; min-width: clamp(58px, 16vw, 92px); }
.g1-digcard:hover { transform: translateY(-2px); }
.g1-digcard-on { background: #E3F0E8; box-shadow: 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-digcard-dots { min-height: clamp(30px, 7vw, 46px); display: flex; align-items: center; justify-content: center; }

/* tap-order (s6) */
.g1-order-line { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.g1-order-slot { width: clamp(46px, 12vw, 64px); height: clamp(52px, 13vw, 72px); border-radius: 14px; border: 2px dashed #A7A6A2; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px, 5.5vw, 36px); color: #1F7A4D; background: #FDFBF7; }
.g1-order-slot-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; }
.g1-tile-wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.4); }
`;
