import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сравнение целых чисел. Противоположные числа — neg_5_02 (Dars33)
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
// --- POD UROK: neg_5_02 — Butun sonlarni taqqoslash va qarama-qarshi sonlar / Сравнение целых чисел. Противоположные числа (PROMPT 2026-06-15) ---
// Markaziy misconception M1: "−5, −3 dan katta" (whole-number bias, neg_5_01 dan davom).
// M2: "qarama-qarshi son — minusni olib tashlash" (aslida ISHORANI almashtirish: 4 ning
// qarama-qarshisi −4, −4 niki 4, 0 niki 0; noldan teng masofa). Operatsiyalar YO'Q (blok 9).
// Asosiy usul: gorizontal koordinata o'qi — o'ngroqda turgan son katta (manfiy ham, musbat
// ham); qarama-qarshi son nol atrofida SIMMETRIK (ko'zgu). Bu — 5-sinf dasturining OXIRGI darsi.
// Vizualizator: CoordLine (Dars32 dan, mirror prop qo'shildi — v va −v noldan teng masofada).
// Hook: Aziza «minusni olib tashlasa qarama-qarshi son chiqadi» deydi (−7→7 to'g'ri), lekin
// 4 niki ham 4 deydi (xato — M2). Case: Oybek (−3) va Nafisa (2) bilim o'yinida — kim oldinda?
// Test turlari (palitradan aralash): warm-up MC / NumInput (qarama-qarshini yoz) / MC (noldan
// o'tib taqqoslash) / son o'qiga bosish (qarama-qarshini top) / tartiblash (o'sish) /
// MULTI-SELECT (qaysi juftlar qarama-qarshi) / final MC.
// Faktlar (DRAFT, validatsiya kerak): minus belgisi ~500 yil oldin paydo bo'lgan (Tarix) /
// Yerdagi eng past harorat ~ minus 89 daraja, Antarktida (Fan) / o'yin grafikasida koordinatalar
// manfiy ham bo'ladi, ekran markazi nol (IT).
// ============================================================

const TOTAL_SCREENS = 10;
const LESSON_META = {
  lessonId: 'neg-5-02-v1',
  lessonTitle: { ru: 'Сравнение целых чисел. Противоположные числа', uz: "Butun sonlarni taqqoslash va qarama-qarshi sonlar" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 'b1',  type: 'test',        template: 'SeqMix',         scored: true,  scope: 'practice' }, // 6  BLOCK1 (s6+s7+s8)
  { id: 's11', type: 'case',        template: 'custom',         scored: false, scope: null },       // 7  case setup
  { id: 'b2',  type: 'test',        template: 'SeqMix',         scored: true,  scope: 'final' },     // 8  BLOCK2 (s9+s10+s12)
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 9  xulosa
];

const CONTENT = {

  // ---- s0 HOOK — Aziza: "minusni olib tashlasa qarama-qarshi son chiqadi". Tuzoq M2: 4 niki ham 4. ----
  s0: {
    eyebrow: { ru: 'Вопрос', uz: 'Savol' },
    title: { ru: 'Права ли Азиза', uz: "Aziza haqmi" },
    lead: {
      ru: 'Азиза говорит: «Найти противоположное число легко — просто убери минус». Для −7 она получила 7. А для 4 сказала, что противоположное тоже 4. Она права?',
      uz: "Aziza «qarama-qarshi sonni topish oson — minusni olib tashlasa bo'ldi» deydi. −7 uchun u 7 ni topdi. 4 uchun esa qarama-qarshisi ham 4 dedi. U haqmi?"
    },
    opt0: { ru: 'Да, для 4 противоположное — это 4', uz: "Ha, 4 uchun qarama-qarshisi — 4" },
    opt1: { ru: 'Нет, у 4 противоположное другое', uz: "Yo'q, 4 ning qarama-qarshisi boshqa" },
    opt2: { ru: 'Пока не знаю', uz: "Hozircha bilmayman" },
    reveal: {
      ru: 'Запомни свой ответ. К концу урока научимся находить противоположное число и сравнивать целые числа.',
      uz: "Javobingizni eslab qoling. Dars oxirida qarama-qarshi sonni topish va butun sonlarni taqqoslashni o'rganamiz."
    },
    audio: {
      ru: 'Азиза думает, что противоположное число, это просто убрать минус. Для минус семи получилось семь. А для четырёх она говорит, что противоположное тоже четыре. А ты как думаешь, она права?',
      uz: "Aziza qarama-qarshi son, bu shunchaki minusni olib tashlash deb o'ylaydi. Minus yetti uchun yetti chiqdi. To'rt uchun esa qarama-qarshisi ham to'rt deydi. Sizningcha, u haqmi?"
    }
  },

  // ---- s1 WARM-UP — neg_5_01 recall: −5 va −3, qaysi katta. correct −3 (B). M1. ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Какое число больше', uz: "Qaysi son katta" },
    question: {
      ru: 'На прошлом уроке мы сравнивали числа на прямой. Какое число больше: −5 или −3?',
      uz: "O'tgan darsda sonlarni son o'qida taqqosladik. Qaysi son katta: −5 yoki −3?"
    },
    opt0: { ru: '−3', uz: "−3" },
    opt1: { ru: '−5', uz: "−5" },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    opt3: { ru: 'Нельзя сравнить', uz: "Taqqoslab bo'lmaydi" },
    correct_text: {
      ru: 'Верно. −3 правее на прямой, чем −5, а правее — значит больше. Это правило нам сегодня пригодится.',
      uz: "To'g'ri. −3 son o'qida −5 dan o'ngroqda, o'ngroq esa — kattaroq. Bu qoida bugun asqotadi."
    },
    wrong_1: {
      ru: '−5 кажется больше, ведь 5 больше 3. Но −5 левее на прямой, значит он меньше. Больше −3.',
      uz: "−5 katta tuyuladi, axir 5, 3 dan katta. Lekin −5 son o'qida chaproqda, demak u kichik. −3 kattaroq."
    },
    wrong_2: {
      ru: 'Они не равны: −3 и −5 — разные точки. −3 правее, значит больше.',
      uz: "Ular teng emas: −3 va −5 — turli nuqtalar. −3 o'ngroqda, demak katta."
    },
    wrong_3: {
      ru: 'Отрицательные тоже сравнивают: кто правее, тот больше. Это −3.',
      uz: "Manfiy sonlar ham taqqoslanadi: kim o'ngroqda, o'sha katta. Bu — −3."
    },
    wrong_default: { ru: 'Правее на прямой — больше. Это −3.', uz: "Son o'qida o'ngroqda — katta. Bu — −3." },
    audio: {
      intro: {
        ru: 'Сначала вспомним прошлый урок. Какое число больше: минус пять или минус три? Выбери ответ.',
        uz: "Avval o'tgan darsni eslaymiz. Qaysi son katta: minus besh yoki minus uch? Javobni tanlang."
      },
      on_correct: { ru: 'Верно. Минус три правее, значит больше.', uz: "To'g'ri. Minus uch o'ngroqda, demak katta." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — CoordLine slayder: v ni 1 bilan taqqoslash, noldan o'tib (manfiy < musbat). ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Кто правее, тот больше', uz: "Kim o'ngroqda, o'sha katta" },
    lead: {
      ru: 'Ноль в центре. Двигай ползунок и сравнивай число с единицей: кто правее на прямой, тот больше.',
      uz: "Nol — markazda. Slayderni suring va sonni 1 bilan taqqoslang: son o'qida kim o'ngroqda, o'sha katta."
    },
    note_bigger: {
      ru: 'Это число правее единицы — значит оно больше единицы.',
      uz: "Bu son birdan o'ngroqda — demak u birdan katta."
    },
    note_smaller: {
      ru: 'Это число левее единицы — значит меньше. Любое отрицательное число меньше любого положительного.',
      uz: "Bu son birdan chaproqda — demak kichik. Har qanday manfiy son istalgan musbatdan kichik."
    },
    note_eq: {
      ru: 'Это та же точка, что и единица — числа равны.',
      uz: "Bu — bir bilan bir xil nuqta — sonlar teng."
    },
    cur_label: { ru: 'Число', uz: 'Son' },
    ref_label: { ru: 'Сравниваем с', uz: 'Taqqoslaymiz' },
    audio: {
      ru: 'Двигай ползунок. Сравнивай число с единицей. Если число правее единицы, оно больше. Если левее, меньше. И запомни: любое отрицательное число меньше любого положительного, ведь минусы стоят левее нуля.',
      uz: "Slayderni suring. Sonni bir bilan taqqoslang. Agar son birdan o'ngda bo'lsa, u katta. Chapda bo'lsa, kichik. Yodda tuting: har qanday manfiy son istalgan musbatdan kichik, chunki minuslar noldan chapda turadi."
    }
  },

  // ---- s3 EXPLORATION — CoordLine mirror: v va −v noldan teng masofada (qarama-qarshi). M2. ----
  s3: {
    eyebrow: { ru: 'Эксперимент', uz: 'Tajriba' },
    title: { ru: 'Зеркало вокруг нуля', uz: "Nol atrofidagi ko'zgu" },
    lead: {
      ru: 'Двигай ползунок. Смотри: число и его противоположное стоят на равном расстоянии от нуля, по разные стороны.',
      uz: "Slayderni suring. Qarang: son va uning qarama-qarshisi noldan teng masofada, har xil tomonda turadi."
    },
    note_neg: {
      ru: 'Число слева, его противоположное — справа, на том же расстоянии. Меняется только знак.',
      uz: "Son chapda, qarama-qarshisi — o'ngda, xuddi shu masofada. Faqat ishora o'zgaradi."
    },
    note_pos: {
      ru: 'Число справа, его противоположное — слева. Расстояние до нуля одинаковое.',
      uz: "Son o'ngda, qarama-qarshisi — chapda. Nolgacha masofa bir xil."
    },
    note_zero: {
      ru: 'Ноль особый: его противоположное — тоже ноль.',
      uz: "Nol alohida: uning qarama-qarshisi — yana nol."
    },
    cur_label: { ru: 'Число', uz: 'Son' },
    opp_label: { ru: 'Противоположное', uz: 'Qarama-qarshisi' },
    audio: {
      ru: 'Двигай ползунок. Число и его противоположное всегда на равном расстоянии от нуля, только по разные стороны. У тройки противоположное минус три, у минус двойки противоположное два. Меняется только знак, а не цифра.',
      uz: "Slayderni suring. Son va uning qarama-qarshisi har doim noldan teng masofada, faqat har xil tomonda. Uchning qarama-qarshisi minus uch, minus ikkining qarama-qarshisi ikki. Faqat ishora o'zgaradi, raqam emas."
    }
  },

  // ---- s4 RULE 1 — taqqoslash: son o'qida o'ngroq — katta (har qanday butun son). ----
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Правило сравнения', uz: "Taqqoslash qoidasi" },
    lead: { ru: 'Запишем первое правило — про сравнение.', uz: "Birinchi qoidani yozamiz — taqqoslash haqida." },
    rule_main: {
      ru: 'Кто правее на прямой, тот больше',
      uz: "Son o'qida kim o'ngroqda, o'sha katta"
    },
    ex_easy: {
      ru: 'Это работает для всех целых чисел: −2 меньше 3, потому что −2 левее. Любой минус меньше любого плюса.',
      uz: "Bu barcha butun sonlar uchun ishlaydi: −2, 3 dan kichik, chunki −2 chaproqda. Har qanday minus har qanday plyusdan kichik."
    },
    note: {
      ru: 'Отрицательные — слева от нуля, положительные — справа, ноль — посередине.',
      uz: "Manfiylar — noldan chapda, musbatlar — o'ngda, nol — o'rtada."
    },
    audio: {
      ru: 'Первое правило. Кто правее на прямой, тот больше. Это верно для любых целых чисел. Минус два меньше трёх, ведь минус два стоит левее. И любое отрицательное меньше любого положительного.',
      uz: "Birinchi qoida. Son o'qida kim o'ngroqda, o'sha katta. Bu istalgan butun son uchun to'g'ri. Minus ikki uchdan kichik, chunki minus ikki chaproqda. Va har qanday manfiy har qanday musbatdan kichik."
    }
  },

  // ---- s5 RULE 2 — qarama-qarshi + tuzoq-ogohlantirish: ishorani almashtirish (minusni olib tashlash emas). M2. ----
  s5: {
    eyebrow: { ru: 'Внимание', uz: 'Diqqat' },
    title: { ru: 'Противоположное — смена знака', uz: "Qarama-qarshi — ishorani almashtirish" },
    lead: { ru: 'Второе правило — про противоположное число.', uz: "Ikkinchi qoida — qarama-qarshi son haqida." },
    point1: {
      ru: 'Противоположное число — это смена знака: у 4 это −4, у −4 это 4, у нуля это сам ноль.',
      uz: "Qarama-qarshi son — bu ishorani almashtirish: 4 niki −4, −4 niki 4, nol niki esa o'zi nol."
    },
    point2: {
      ru: 'Оба числа на равном расстоянии от нуля, по разные стороны.',
      uz: "Ikkala son noldan teng masofada, har xil tomonda turadi."
    },
    warn: {
      ru: 'Ловушка: думать, что противоположное — это «убрать минус». Тогда у 4 не получится −4. Правильно — поменять знак.',
      uz: "Tuzoq: qarama-qarshini «minusni olib tashlash» deb o'ylash. Unda 4 dan −4 chiqmaydi. To'g'risi — ishorani almashtirish."
    },
    audio: {
      ru: 'Второе правило. Противоположное число, это смена знака. У четырёх противоположное минус четыре, у минус четырёх это четыре, у нуля это сам ноль. Не путай: противоположное, это не убрать минус, а поменять знак.',
      uz: "Ikkinchi qoida. Qarama-qarshi son, bu ishorani almashtirish. To'rtning qarama-qarshisi minus to'rt, minus to'rtniki to'rt, nolniki esa o'zi nol. Adashmang, qarama-qarshi minusni olib tashlash emas, balki ishorani almashtirish."
    }
  },

  // ---- s6 TEST NumInput — 5 ning qarama-qarshi soni. correctValue −5. ----
  s6: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Найди противоположное', uz: "Qarama-qarshisini toping" },
    question: {
      ru: 'Какое число противоположно числу 5? Напиши со знаком, если нужно.',
      uz: "5 soniga qaysi son qarama-qarshi? Kerak bo'lsa, ishora bilan yozing."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Противоположное — это смена знака, не «убрать минус». У 5 на прямой пара слева, на том же расстоянии: −5.',
      uz: "Qarama-qarshi — bu ishorani almashtirish, «minusni olib tashlash» emas. 5 ning son o'qida chapdagi jufti, xuddi shu masofada: −5."
    },
    fb_correct: {
      ru: 'Верно! Противоположное к 5 — это −5. Знак сменился, расстояние от нуля то же.',
      uz: "To'g'ri! 5 ning qarama-qarshisi — −5. Ishora o'zgardi, noldan masofa o'sha."
    },
    audio: {
      intro: {
        ru: 'Какое число противоположно числу пять? Помни: меняем знак. Напиши ответ и нажми проверить.',
        uz: "5 soniga qaysi son qarama-qarshi? Yodda tuting: ishorani almashtiramiz. Javobni yozib, tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Минус пять.', uz: "To'g'ri. Minus besh." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: "Maslahatga qarang." }
    }
  },

  // ---- s7 TEST MC — noldan o'tib taqqoslash: −4 va 2, qaysi katta. correct 2 (A). M1. Fakt Tarix. ----
  s7: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Сравни через ноль', uz: "Noldan o'tib taqqoslang" },
    lead: {
      ru: 'Какое число больше: −4 или 2? Подумай, где они на прямой.',
      uz: "Qaysi son katta: −4 yoki 2? Ular son o'qida qayerda turishini o'ylang."
    },
    opt0: { ru: '2', uz: "2" },
    opt1: { ru: '−4', uz: "−4" },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    opt3: { ru: 'Нельзя сравнить', uz: "Taqqoslab bo'lmaydi" },
    correct_text: {
      ru: 'Верно! 2 справа от нуля, а −4 слева. Справа — значит больше. Любое положительное больше любого отрицательного.',
      uz: "To'g'ri! 2 noldan o'ngda, −4 esa chapda. O'ngda — demak katta. Har qanday musbat har qanday manfiydan katta."
    },
    wrong_1: {
      ru: '−4 кажется больше, ведь 4 больше 2. Но −4 слева от нуля, а 2 справа. Справа больше — это 2.',
      uz: "−4 katta tuyuladi, axir 4, 2 dan katta. Lekin −4 noldan chapda, 2 esa o'ngda. O'ngda katta — bu 2."
    },
    wrong_2: {
      ru: 'Они не равны: −4 слева, 2 справа — разные точки. Больше 2.',
      uz: "Ular teng emas: −4 chapda, 2 o'ngda — turli nuqtalar. Katta — 2."
    },
    wrong_3: {
      ru: 'Сравнить можно: положительное правее отрицательного. Больше 2.',
      uz: "Taqqoslasa bo'ladi: musbat manfiydan o'ngroqda. Katta — 2."
    },
    wrong_default: { ru: 'Справа на прямой — больше. Это 2.', uz: "Son o'qida o'ngroqda — katta. Bu — 2." },
    fact: {
      ru: 'Знак минус появился у математиков около 500 лет назад; до этого отрицательные числа записывали словами. Поэтому привыкнуть к минусу — это нормально.',
      uz: "Minus belgisi matematiklarda taxminan 500 yil oldin paydo bo'lgan; undan oldin manfiy sonlarni so'z bilan yozishgan. Shuning uchun minusga ko'nikish — bu tabiiy."
    },
    audio: {
      intro: {
        ru: 'Какое число больше: минус четыре или два? Подумай, где каждое на прямой. Выбери ответ.',
        uz: "Qaysi son katta: minus to'rt yoki ikki? Har biri son o'qida qayerda turishini o'ylang. Javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Два больше. Кстати, знак минус появился у математиков всего около пятисот лет назад.',
        uz: "To'g'ri. Ikki katta. Aytgancha, minus belgisi matematiklarda atigi besh yuz yilcha oldin paydo bo'lgan."
      },
      on_wrong: { ru: 'Не совсем. Положительное правее отрицательного.', uz: "Unchalik emas. Musbat manfiydan o'ngroqda." }
    }
  },

  // ---- s8 TEST son o'qiga bosish — −3 (ko'k pin) ning qarama-qarshisini belgilash. correct 3. ----
  s8: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Отметь противоположное', uz: "Qarama-qarshisini belgilang" },
    lead: {
      ru: 'Синяя метка стоит на −3. Поставь отметку на противоположное число. Нажми нужное деление прямой.',
      uz: "Ko'k belgi −3 da turibdi. Uning qarama-qarshi soniga marker qo'ying. Son o'qidagi kerakli bo'linmani bosing."
    },
    hint_wrong: {
      ru: 'Противоположное к −3 — на том же расстоянии от нуля, но справа. Отсчитай три шага вправо: это 3.',
      uz: "−3 ning qarama-qarshisi — noldan xuddi shu masofada, lekin o'ngda. O'ngga uch qadam sanang: bu 3."
    },
    correct_text: {
      ru: 'Верно! 3 стоит справа от нуля на том же расстоянии, что и −3 слева. Это противоположные числа.',
      uz: "To'g'ri! 3 noldan o'ngda, −3 chapdagi masofa bilan bir xil. Bular qarama-qarshi sonlar."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    tap_prompt: { ru: 'Нажми деление на прямой', uz: "Son o'qidagi bo'linmani bosing" },
    audio: {
      intro: {
        ru: 'Синяя метка на минус три. Поставь отметку на противоположное число. Нажми нужное деление и нажми проверить.',
        uz: "Ko'k belgi minus uchda. Uning qarama-qarshi soniga marker qo'ying. Kerakli bo'linmani bosib, tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Три, на том же расстоянии справа.', uz: "To'g'ri. Uch, o'ngda xuddi shu masofada." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // ---- s9 TEST tartiblash — sonlarni o'sish tartibida. correct −5, −1, 2, 4. Fakt Fan. ----
  s9: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Расставь по порядку', uz: "Tartib bilan joylashtiring" },
    lead: {
      ru: 'Расставь числа от меньшего к большему. Нажимай по порядку.',
      uz: "Sonlarni kichikdan kattaga qarab joylashtiring. Tartib bilan bosing."
    },
    hint_wrong: {
      ru: 'Самое маленькое — левее всех на прямой. Это −5, потом −1, потом 2, потом 4.',
      uz: "Eng kichik — son o'qida hammadan chapda. Bu −5, keyin −1, keyin 2, keyin 4."
    },
    correct_text: {
      ru: 'Верно! От меньшего к большему: −5, −1, 2, 4. Это порядок слева направо на прямой.',
      uz: "To'g'ri! Kichikdan kattaga: −5, −1, 2, 4. Bu son o'qida chapdan o'ngga tartib."
    },
    fact: {
      ru: 'Самая низкая температура на Земле, около минус 89 градусов, измерена в Антарктиде. Отрицательные числа помогают записывать такой холод.',
      uz: "Yerdagi eng past harorat, taxminan minus 89 daraja, Antarktidada o'lchangan. Manfiy sonlar shunday sovuqni yozishga yordam beradi."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    reset_hint: { ru: 'Нажми ещё раз, чтобы начать заново', uz: "Qaytadan boshlash uchun yana bosing" },
    audio: {
      intro: {
        ru: 'Расставь числа от меньшего к большему. Нажимай карточки по порядку и нажми проверить.',
        uz: "Sonlarni kichikdan kattaga joylashtiring. Kartalarni tartib bilan bosib, tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. От меньшего к большему. Кстати, самая низкая температура на Земле, около минус восьмидесяти девяти градусов.',
        uz: "To'g'ri. Kichikdan kattaga. Aytgancha, Yerdagi eng past harorat taxminan minus sakson to'qqiz daraja."
      },
      on_wrong: { ru: 'Не совсем. Самое маленькое стоит левее всех.', uz: "Unchalik emas. Eng kichik hammadan chapda turadi." }
    }
  },

  // ---- s10 TEST MULTI-SELECT — qaysi juftlar qarama-qarshi sonlar. correct {0,1}. M2. Fakt IT (s12 da). ----
  s10: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Найди все пары', uz: "Barcha juftlarni toping" },
    lead: {
      ru: 'Отметь ВСЕ пары противоположных чисел. Их может быть несколько.',
      uz: "Qarama-qarshi sonlarning BARCHA juftlarini belgilang. Ular bir nechta bo'lishi mumkin."
    },
    it0: { ru: '−4 и 4', uz: "−4 va 4" },
    it1: { ru: '5 и −5', uz: "5 va −5" },
    it2: { ru: '−2 и 6', uz: "−2 va 6" },
    it3: { ru: '3 и 3', uz: "3 va 3" },
    hint_wrong: {
      ru: 'Противоположные — на равном расстоянии от нуля и с разными знаками. −2 и 6 — расстояния разные. 3 и 3 — одно и то же число, не пара.',
      uz: "Qarama-qarshilar — noldan teng masofada va ishoralari har xil. −2 va 6 — masofalar har xil. 3 va 3 — bitta sonning o'zi, juft emas."
    },
    correct_text: {
      ru: 'Верно! Противоположные пары: −4 и 4, 5 и −5. У них одинаковое расстояние до нуля и разные знаки.',
      uz: "To'g'ri! Qarama-qarshi juftlar: −4 va 4, 5 va −5. Ularning nolgacha masofasi bir xil, ishoralari har xil."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: {
        ru: 'Отметь все пары противоположных чисел. Их может быть несколько. Выбери и нажми проверить.',
        uz: "Qarama-qarshi sonlarning barcha juftlarini belgilang. Ular bir nechta bo'lishi mumkin. Tanlab, tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. Противоположные пары на равном расстоянии от нуля с разными знаками.',
        uz: "To'g'ri. Qarama-qarshi juftlar noldan teng masofada, ishoralari har xil."
      },
      on_wrong: { ru: 'Не совсем. Проверь расстояние до нуля и знаки.', uz: "Unchalik emas. Nolgacha masofa va ishoralarni tekshiring." }
    }
  },

  // ---- s11 CASE setup — Oybek (−3) va Nafisa (2) bilim o'yinida. CoordLine. ----
  s11: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Кто впереди в викторине', uz: "O'yinda kim oldinda" },
    lead: {
      ru: 'Ойбек и Нафиса играют в викторину. За ошибку очки уходят в минус. У Ойбека счёт −3, у Нафисы 2. Кто из них впереди?',
      uz: "Oybek va Nafisa bilim o'yinida o'ynamoqda. Xato uchun ochko minusga ketadi. Oybekning hisobi −3, Nafisaniki 2. Qaysi biri oldinda?"
    },
    note: {
      ru: 'Впереди — у кого счёт больше, то есть правее на прямой.',
      uz: "Oldinda — hisobi katta bo'lgan, ya'ni son o'qida o'ngroqda turgan."
    },
    hint_calc: {
      ru: 'Сравни −3 и 2. Кто правее на прямой, у того счёт больше.',
      uz: "−3 va 2 ni taqqoslang. Son o'qida kim o'ngroqda, o'shaning hisobi katta."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: 'Ойбек и Нафиса играют в викторину. За ошибку очки уходят в минус. У Ойбека счёт минус три, у Нафисы два. Кто впереди? Сравним эти числа.',
      uz: "Oybek va Nafisa bilim o'yinida o'ynamoqda. Xato uchun ochko minusga ketadi. Oybekning hisobi minus uch, Nafisaniki ikki. Kim oldinda? Bu sonlarni taqqoslaymiz."
    }
  },

  // ---- s12 CASE/FINAL MC — kim oldinda. correct Nafisa 2 (D). M1. Fakt IT. ----
  s12: {
    eyebrow: { ru: 'Итоговое задание', uz: 'Yakuniy topshiriq' },
    title: { ru: 'Кто впереди', uz: "Kim oldinda" },
    lead: {
      ru: 'У Ойбека счёт −3, у Нафисы 2. Кто впереди?',
      uz: "Oybekning hisobi −3, Nafisaniki 2. Kim oldinda?"
    },
    opt0: { ru: 'Ойбек (−3)', uz: "Oybek (−3)" },
    opt1: { ru: 'Одинаково', uz: "Bir xil" },
    opt2: { ru: 'Нельзя узнать', uz: "Bilib bo'lmaydi" },
    opt3: { ru: 'Нафиса (2)', uz: "Nafisa (2)" },
    correct_text: {
      ru: 'Верно! 2 больше −3, ведь 2 справа от нуля, а −3 слева. Впереди Нафиса.',
      uz: "To'g'ri! 2, −3 dan katta, axir 2 noldan o'ngda, −3 esa chapda. Oldinda — Nafisa."
    },
    wrong_0: {
      ru: 'Кажется, что Ойбек впереди, ведь 3 больше 2. Но −3 слева от нуля, значит меньше. Впереди Нафиса.',
      uz: "Oybek oldinda tuyuladi, axir 3, 2 dan katta. Lekin −3 noldan chapda, demak kichik. Oldinda — Nafisa."
    },
    wrong_1: {
      ru: 'Счёт не одинаковый: −3 слева, 2 справа. Впереди Нафиса.',
      uz: "Hisob bir xil emas: −3 chapda, 2 o'ngda. Oldinda — Nafisa."
    },
    wrong_2: {
      ru: 'Узнать можно: сравни −3 и 2 на прямой. Больше 2 — впереди Нафиса.',
      uz: "Bilsa bo'ladi: −3 va 2 ni son o'qida taqqoslang. Katta — 2, oldinda Nafisa."
    },
    wrong_default: { ru: '2 правее −3 на прямой. Впереди Нафиса.', uz: "2 son o'qida −3 dan o'ngda. Oldinda — Nafisa." },
    fact: {
      ru: 'В компьютерных играх и графике координаты бывают отрицательными: центр экрана — это ноль. Так что отрицательные числа нужны и здесь.',
      uz: "Kompyuter o'yinlari va grafikasida koordinatalar manfiy bo'lishi mumkin: ekran markazi — bu nol. Demak manfiy sonlar bu yerda ham kerak."
    },
    audio: {
      intro: {
        ru: 'У Ойбека счёт минус три, у Нафисы два. Кто впереди? Выбери ответ.',
        uz: "Oybekning hisobi minus uch, Nafisaniki ikki. Kim oldinda? Javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Впереди Нафиса. Кстати, в компьютерных играх координаты тоже бывают отрицательными, ведь центр экрана, это ноль.',
        uz: "To'g'ri. Oldinda Nafisa. Aytgancha, kompyuter o'yinlarida ham koordinatalar manfiy bo'ladi, axir ekran markazi, bu nol."
      },
      on_wrong: { ru: 'Не совсем. Два правее минус трёх на прямой.', uz: "Unchalik emas. Ikki, son o'qida minus uchdan o'ngda." }
    }
  },

  // ---- s13 SUMMARY — hookni yopadi + ConnectionsBlock (5-sinf oxiri → 6-sinf) ----
  s13: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    heading: { ru: 'Целые числа покорены', uz: "Butun sonlar bo'ysundi" },
    title: { ru: 'Отлично! Это был последний урок 5 класса.', uz: "Ajoyib! Bu 5-sinfning oxirgi darsi edi." },
    main_label: { ru: 'Что мы узнали', uz: "Nimani bilib oldik" },
    main_1: { ru: 'Кто правее на прямой, тот больше — для любых целых чисел.', uz: "Son o'qida kim o'ngroqda, o'sha katta — barcha butun sonlar uchun." },
    main_2: { ru: 'Любое отрицательное меньше любого положительного.', uz: "Har qanday manfiy har qanday musbatdan kichik." },
    main_3: { ru: 'Противоположное число — это смена знака; у нуля это сам ноль.', uz: "Qarama-qarshi son — bu ishorani almashtirish; nol niki esa o'zi nol." },
    hook_close: {
      ru: 'Помнишь Азизу? Она думала, что противоположное — это «убрать минус». Для −7 вышло 7 — случайно верно. Но у 4 противоположное не 4, а −4. Главное — менять знак.',
      uz: "Azizani eslaysizmi? U qarama-qarshi son — «minusni olib tashlash» deb o'yladi. −7 uchun 7 chiqdi — tasodifan to'g'ri. Lekin 4 ning qarama-qarshisi 4 emas, −4. Asosiysi — ishorani almashtirish."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: 'Отрицательные числа на координатной прямой (правее — больше).',
      uz: "Manfiy sonlar son o'qida (o'ngroq — kattaroq)."
    },
    conn_label_next: { ru: 'Дальше', uz: 'Keyin' },
    conn_next: {
      ru: 'В 6 классе — действия с отрицательными числами и пропорции.',
      uz: "6-sinfda — manfiy sonlar bilan amallar va nisbatlar."
    },
    btn_restart: { ru: 'Пройти заново', uz: 'Qaytadan' },
    audio: {
      ru: 'Отлично. Теперь ты знаешь: кто правее на прямой, тот больше, а любое отрицательное меньше любого положительного. А противоположное число, это смена знака. Это был последний урок пятого класса. Молодец!',
      uz: "Ajoyib. Endi bilasiz: son o'qida kim o'ngroqda, o'sha katta, har qanday manfiy esa istalgan musbatdan kichik. Qarama-qarshi son, bu ishorani almashtirish. Bu 5-sinfning oxirgi darsi edi. Barakalla!"
    }
  }

};

// ============================================================
// YORDAMCHI KOMPONENTLAR (infra_v2 — Dars32 bilan bir xil)
// ============================================================
const fmtN = (v) => String(v).replace('-', '−');

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

// Fakt-animatsiyalar (CSS-only loop, ko'k tema, qutiga sig'adi — overflow:hidden).
// Tarix: qadimgi sanoq tayoqchalari navbatma-navbat yorishadi (Tarix).
const AnimHistory = () => (
  <div className="fa-hist" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="fa-hist-r" style={{ animationDelay: `${i * 0.18}s` }}/>
    ))}
  </div>
);
// Eng past harorat: termometr simobi pastga tushadi (Fan).
const AnimAbsZero = () => (
  <svg className="fa-th" viewBox="0 0 40 80" aria-hidden="true">
    <rect x="16" y="6" width="8" height="54" rx="4" className="fa-th-tube"/>
    <circle cx="20" cy="66" r="9" className="fa-th-bulb"/>
    <rect x="17.5" y="10" width="5" height="52" rx="2.5" className="fa-th-merc"/>
  </svg>
);
// IT: ikkilik bitlar yonadi, belgi-bit ko'k yorishadi (IT).
const AnimBits = () => (
  <div className="fa-bit" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className={`fa-bit-c${i === 0 ? ' fa-bit-sign' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}/>
    ))}
  </div>
);

// ============================================================
// VIZUALIZATOR — CoordLine (gorizontal koordinata o'qi) + mirror (qarama-qarshi)
// ============================================================
// CoordLine: 0 markaz, chap manfiy / o'ng musbat. marker translateX bilan suriladi
// (slayder/bosishda silliq transition). onPick berilsa — bo'linmalar bosiladi. value2 — ko'k pin.
// mirror=true: son va qarama-qarshisi (−value) noldan teng masofada — punktir bog'lovchi.
const CN_UNIT = 32;
const CoordLine = ({ min = -6, max = 6, value = null, value2 = null, unit = CN_UNIT, onPick = null, picked = null, success = false, highlight = [], mirror = false }) => {
  const padX = 24, axisY = 54, h = 88;
  const xOf = (v) => padX + (v - min) * unit;
  const svgW = padX * 2 + (max - min) * unit;
  const ticks = [];
  for (let v = min; v <= max; v++) ticks.push(v);
  const showVal = picked !== null ? picked : value;
  const showMirror = mirror && showVal !== null && showVal !== 0;
  return (
    <svg className="cn" viewBox={`0 0 ${svgW} ${h}`} width={svgW} height={h} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect x={xOf(min)} y={axisY - 7} width={xOf(0) - xOf(min)} height="14" className="cn-neg"/>
      <rect x={xOf(0)} y={axisY - 7} width={xOf(max) - xOf(0)} height="14" className="cn-pos"/>
      {showMirror && (
        <g>
          <line x1={xOf(0)} y1={axisY - 18} x2={xOf(showVal)} y2={axisY - 18} className="cn-span"/>
          <line x1={xOf(0)} y1={axisY - 18} x2={xOf(-showVal)} y2={axisY - 18} className="cn-span"/>
        </g>
      )}
      <line x1={padX - 8} y1={axisY} x2={svgW - padX + 8} y2={axisY} className="cn-axis"/>
      <polygon points={`${svgW - padX + 8},${axisY} ${svgW - padX - 3},${axisY - 5} ${svgW - padX - 3},${axisY + 5}`} className="cn-arrow"/>
      <polygon points={`${padX - 8},${axisY} ${padX + 3},${axisY - 5} ${padX + 3},${axisY + 5}`} className="cn-arrow"/>
      {ticks.map(v => {
        const hl = highlight.includes(v);
        const clk = !!onPick;
        return (
          <g key={v} onClick={clk ? () => onPick(v) : undefined} style={clk ? { cursor: 'pointer' } : undefined}>
            {clk && <rect x={xOf(v) - unit / 2} y={axisY - 26} width={unit} height="52" fill="transparent"/>}
            <line x1={xOf(v)} y1={axisY - (v === 0 ? 9 : 6)} x2={xOf(v)} y2={axisY + (v === 0 ? 9 : 6)} className={v === 0 ? 'cn-tick0' : (hl ? 'cn-tickhl' : 'cn-tick')}/>
            <text x={xOf(v)} y={axisY + 23} className={v === 0 ? 'cn-lbl0' : (hl ? 'cn-lblhl' : 'cn-lbl')} textAnchor="middle">{fmtN(v)}</text>
          </g>
        );
      })}
      {value2 !== null && (
        <polygon points={`${xOf(value2)},${axisY - 9} ${xOf(value2) - 7},${axisY - 22} ${xOf(value2) + 7},${axisY - 22}`} className="cn-pin cn-pin2"/>
      )}
      {showVal !== null && (
        <g className="cn-mk" style={{ transform: `translateX(${xOf(showVal) - xOf(0)}px)` }}>
          <polygon points={`${xOf(0)},${axisY - 9} ${xOf(0) - 7},${axisY - 22} ${xOf(0) + 7},${axisY - 22}`} className={`cn-pin${success ? ' cn-pin-ok' : ''}`}/>
          <circle cx={xOf(0)} cy={axisY} r="5" className={`cn-dot${success ? ' cn-dot-ok' : ''}`}/>
        </g>
      )}
    </svg>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (Aziza: qarama-qarshi son = minusni olib tashlash?). Qaytish: picked TO'LIQ sbros.
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
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.6vw, 12px)', display: 'flex', justifyContent: 'center' }}>
          <CoordLine value={4} value2={-4} mirror min={-6} max={6}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
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

// s1 — WARM-UP (neg_5_01 recall: −5 va −3, correct −3 -> B) QuestionScreen
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (CoordLine slayder: v ni 1 bilan taqqoslash, noldan o'tib)
const S2_REF = 1;
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [v, setV] = useState(-3);
  const note = v > S2_REF ? c.note_bigger : (v < S2_REF ? c.note_smaller : c.note_eq);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <CoordLine value={v} value2={S2_REF} highlight={[v, S2_REF]}/>
          <div className="cn-readout">
            <span className="cn-ro-lbl">{t(c.cur_label)}</span>
            <span className="cn-ro-val">{fmtN(v)}</span>
            <span className="cn-ro-sep"/>
            <span className="cn-ro-lbl">{t(c.ref_label)}</span>
            <span className="cn-ro-val cn-ro-opp">{fmtN(S2_REF)}</span>
          </div>
        </div>
        <div className="fade-up delay-2"><Slider value={v} min={-6} max={6} step={1} onChange={setV}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: v > S2_REF ? T.success : (v < S2_REF ? T.accent : T.ink2), fontWeight: 600 }}>{mt(t(note))}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (CoordLine mirror: v va −v noldan teng masofada — qarama-qarshi)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [v, setV] = useState(-3);
  const note = v < 0 ? c.note_neg : (v > 0 ? c.note_pos : c.note_zero);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <CoordLine value={v} value2={-v} mirror highlight={[v, -v].filter(n => n !== 0)}/>
          <div className="cn-readout">
            <span className="cn-ro-lbl">{t(c.cur_label)}</span>
            <span className="cn-ro-val">{fmtN(v)}</span>
            <span className="cn-ro-sep"/>
            <span className="cn-ro-lbl">{t(c.opp_label)}</span>
            <span className="cn-ro-val cn-ro-opp">{fmtN(-v)}</span>
          </div>
        </div>
        <div className="fade-up delay-2"><Slider value={v} min={-6} max={6} step={1} onChange={setV}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: v < 0 ? T.accent : (v > 0 ? T.success : T.ink2), fontWeight: 600 }}>{mt(t(note))}</p>
      </div>
    </Stage>
  );
};

// s4 — RULE 1 (taqqoslash: o'ngroq — katta) + ambient
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <CoordLine value={-2} value2={3} highlight={[-2, 3]}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (qarama-qarshi = ishorani almashtirish; tuzoq M2) + CoordLine mirror + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <CoordLine value={4} value2={-4} mirror highlight={[4, -4]} min={-6} max={6}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.point1))}</p>
            <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.point2))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn))}</p>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMix — bitta slaydda 4-5 HAR XIL turdagi savol KETMA-KET (kiritish, taqqoslash MC,
// o'qqa belgilash, tartiblash, multi-select). Progress nuqtalari (scrollsiz), веди-до-верного,
// mobil-do'st. Ovozli xato = on_wrong (toza). Son so'z bilan. Fakt blok oxirida alohida karta.
// ============================================================
const W_B1 = {
  eyebrow: { ru: 'Тренировка', uz: 'Mashq' },
  title: { ru: 'Противоположные числа и сравнение', uz: "Qarama-qarshi sonlar va taqqoslash" },
  lead: { ru: 'Несколько разных заданий подряд.', uz: "Bir nechta har xil topshiriq birin-ketin." },
  done_text: { ru: 'Все верно! Противоположное меняет знак, а правее на прямой — больше.', uz: "Hammasi to'g'ri! Qarama-qarshi son ishorani almashtiradi, son o'qida o'ngroq esa — katta." }
};
const W_B2 = {
  eyebrow: { ru: 'Итог', uz: 'Yakun' },
  title: { ru: 'Проверь себя', uz: "O'zingizni tekshiring" },
  lead: { ru: 'Реши задания одно за другим.', uz: "Topshiriqlarni birin-ketin yeching." },
  done_text: { ru: 'Отлично! Ты сравниваешь, упорядочиваешь и находишь противоположные числа.', uz: "Ajoyib! Sonlarni taqqoslaysiz, tartiblaysiz va qarama-qarshisini topasiz." }
};
// Yangi qiyin taqqoslash misollari (draft — UZ tasdiq kutadi). c-shape: lead + opt + wrong_N + audio.
const NH1 = {
  lead: { ru: 'Что больше: −15 или −8?', uz: "Qaysi katta: −15 yoki −8?" },
  opt0: { ru: '−8', uz: '−8' }, opt1: { ru: '−15', uz: '−15' }, opt2: { ru: 'Они равны', uz: 'Ular teng' },
  wrong_1: { ru: '−15 кажется больше, ведь 15 больше 8. Но он левее, значит меньше. Больше −8.', uz: "−15 katta tuyuladi, axir 15, 8 dan katta. Lekin u chaproqda, demak kichik. Katta — −8." },
  wrong_2: { ru: 'Они не равны: −8 правее −15.', uz: "Ular teng emas: −8, −15 dan o'ngroqda." },
  audio: { intro: { ru: 'Что больше: минус пятнадцать или минус восемь? Выбери ответ.', uz: "Qaysi katta: minus o'n besh yoki minus sakkiz? Javobni tanlang." }, on_correct: { ru: 'Верно. Минус восемь больше.', uz: "To'g'ri. Minus sakkiz katta." }, on_wrong: { ru: 'Большая цифра не делает минус больше. Кто правее, тот больше.', uz: "Katta raqam minusni katta qilmaydi. Kim o'ngroqda, o'sha katta." } }
};
const NH2 = {
  lead: { ru: 'Чему равно противоположное числу −7?', uz: "−7 ning qarama-qarshisi nechaga teng?" },
  opt0: { ru: '7', uz: '7' }, opt1: { ru: '−7', uz: '−7' }, opt2: { ru: '0', uz: '0' },
  wrong_1: { ru: 'Противоположное меняет знак. У −7 противоположное это +7.', uz: "Qarama-qarshi ishorani almashtiradi. −7 ning qarama-qarshisi +7." },
  wrong_2: { ru: 'Противоположное к −7 это не ноль, а 7 — на той же высоте справа от нуля.', uz: "−7 ning qarama-qarshisi nol emas, balki 7 — noldan o'ng tomonda, xuddi shu masofada." },
  audio: { intro: { ru: 'Чему равно число, противоположное минус семи? Выбери ответ.', uz: "Minus yettiga qarama-qarshi son nechaga teng? Javobni tanlang." }, on_correct: { ru: 'Верно. Противоположное минус семи это семь.', uz: "To'g'ri. Minus yettining qarama-qarshisi yetti." }, on_wrong: { ru: 'Противоположное меняет только знак.', uz: "Qarama-qarshi faqat ishorani almashtiradi." } }
};
const NH3 = {
  lead: { ru: 'Что больше: −20 или −19?', uz: "Qaysi katta: −20 yoki −19?" },
  opt0: { ru: '−19', uz: '−19' }, opt1: { ru: '−20', uz: '−20' }, opt2: { ru: 'Они равны', uz: 'Ular teng' },
  wrong_1: { ru: '−20 левее −19 на один шаг, значит меньше. Больше −19.', uz: "−20, −19 dan bir qadam chaproqda, demak kichik. Katta — −19." },
  wrong_2: { ru: 'Числа близкие, но не равные. Больше −19.', uz: "Sonlar yaqin, lekin teng emas. Katta — −19." },
  audio: { intro: { ru: 'Что больше: минус двадцать или минус девятнадцать? Выбери ответ.', uz: "Qaysi katta: minus yigirma yoki minus o'n to'qqiz? Javobni tanlang." }, on_correct: { ru: 'Верно. Минус девятнадцать больше.', uz: "To'g'ri. Minus o'n to'qqiz katta." }, on_wrong: { ru: 'Кто правее на прямой, тот больше.', uz: "Son o'qida kim o'ngroqda, o'sha katta." } }
};
const NH4 = {
  lead: { ru: 'Какое число самое маленькое: −2, −11 или −7?', uz: "Qaysi son eng kichik: −2, −11 yoki −7?" },
  opt0: { ru: '−11', uz: '−11' }, opt1: { ru: '−2', uz: '−2' }, opt2: { ru: '−7', uz: '−7' },
  wrong_1: { ru: '−2 правее всех, значит самое большое, а не маленькое. Меньше всех −11.', uz: "−2 hammadan o'ngda, demak eng katta, kichik emas. Eng kichigi — −11." },
  wrong_2: { ru: '−7 левее −2, но −11 ещё левее. Самое маленькое −11.', uz: "−7, −2 dan chapda, lekin −11 yanada chapda. Eng kichigi — −11." },
  audio: { intro: { ru: 'Какое число самое маленькое: минус два, минус одиннадцать или минус семь? Выбери ответ.', uz: "Qaysi son eng kichik: minus ikki, minus o'n bir yoki minus yetti? Javobni tanlang." }, on_correct: { ru: 'Верно. Минус одиннадцать самое маленькое.', uz: "To'g'ri. Minus o'n bir eng kichik." }, on_wrong: { ru: 'Кто левее на прямой, тот меньше.', uz: "Son o'qida kim chaproqda, o'sha kichik." } }
};
const B1_ITEMS = [
  { type: 'input', c: CONTENT.s6, answer: -5, coord: { value: 5, value2: -5, mirror: true } },
  { type: 'mc', c: CONTENT.s7, optKeys: ['opt0', 'opt1', 'opt2', 'opt3'], correct: 0, order: [1, 2, 0, 3] },
  { type: 'place', c: CONTENT.s8, answer: 3, coord: { value2: -3 } },
  { type: 'mc', c: NH1, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [1, 0, 2] },
  { type: 'mc', c: NH2, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [2, 0, 1] }
];
const B2_ITEMS = [
  { type: 'order', c: CONTENT.s9, vals: [4, -5, 2, -1], correctOrder: [1, 3, 2, 0] },
  { type: 'multiselect', c: CONTENT.s10, itemKeys: ['it0', 'it1', 'it2', 'it3'], mask: [true, true, false, false] },
  { type: 'mc', c: NH3, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [1, 2, 0] },
  { type: 'mc', c: NH4, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [2, 1, 0] },
  { type: 'mc', c: CONTENT.s12, optKeys: ['opt0', 'opt1', 'opt2', 'opt3'], correct: 3, order: [3, 1, 2, 0] }
];

const SeqMix = ({ screen, totalScreens, items, screenContent, scope, factOnDone, storedAnswer, onAnswer, onNext, onPrev }) => {
  const w = screenContent; const t = useT(); const lang = useLang(); const sfx = useSfx();
  const n = items.length;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: `s${screen}_i0`, text: items[0].c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [results, setResults] = useState(() => (wasSolved ? items.map(() => true) : []));
  const [val, setVal] = useState('');
  const [pickV, setPickV] = useState(null);
  const [seq, setSeq] = useState([]);
  const [msel, setMsel] = useState([]);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(false);
  const wrongRef = useRef(false);
  const advRef = useRef(wasSolved);
  const done = idx >= n;
  const cur = done ? null : items[idx];
  const sh = (cur && cur.type === 'mc') ? shuffleMC(cur.c, cur.optKeys.map(k => optEl(t, cur.c[k])), cur.correct, cur.order || cur.optKeys.map((_, i) => i)) : null;
  const speak = (txt) => { if (txt && !audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const advance = (ft) => {
    const nr = [...results]; nr[idx] = ft; const ni = idx + 1;
    setResults(nr); setVal(''); setPickV(null); setSeq([]); setMsel([]); setWrongSet(new Set()); setHint(false); setFlash(false); wrongRef.current = false; setIdx(ni);
    if (ni >= n) { const allOk = nr.every(Boolean); onAnswer({ stage: scope, screenIdx: screen, correctAnswer: 'seqmix', studentAnswer: JSON.stringify(nr), correct: allOk, firstTry: allOk, solved: true }); speak(w.done_text && w.done_text[lang]); }
    else speak(items[ni].c.audio.intro[lang]);
  };
  const fireOk = () => { setFlash(true); sfx.playCorrect(); speak(cur.c.audio.on_correct && cur.c.audio.on_correct[lang]); const ft = !wrongRef.current; setTimeout(() => advance(ft), 800); };
  const fireBad = () => { wrongRef.current = true; sfx.playWrong(); setHint(true); speak(cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]); };
  const ensureAdv = () => { if (!advRef.current) { advRef.current = true; audio.triggerEvent('check_pressed'); } };
  const submitInput = () => { if (flash) return; const v = parseInt(String(val).replace(/[^0-9-]/g, ''), 10); if (isNaN(v)) return; ensureAdv(); v === cur.answer ? fireOk() : fireBad(); };
  const submitPlace = () => { if (flash || pickV === null) return; ensureAdv(); pickV === cur.answer ? fireOk() : fireBad(); };
  const pickMC = (i) => { if (flash || wrongSet.has(i)) return; ensureAdv(); if (i === sh.correctIdx) { fireOk(); } else { wrongRef.current = true; sfx.playWrong(); setWrongSet(p => { const s = new Set(p); s.add(i); return s; }); setHint(true); speak(cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]); } };
  const submitOrder = () => { if (flash || seq.length < cur.vals.length) return; ensureAdv(); const okk = seq.every((s, p) => s === cur.correctOrder[p]); if (okk) fireOk(); else { fireBad(); setTimeout(() => setSeq([]), 500); } };
  const submitMsel = () => { if (flash) return; ensureAdv(); const okk = cur.mask.every((b, i) => b === msel.includes(i)); okk ? fireOk() : fireBad(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const visHint = cur && (cur.type === 'mc' ? (sh && [...wrongSet].slice(-1)[0] !== undefined && sh.content[`wrong_${[...wrongSet].slice(-1)[0]}`]) : (cur.c.hint || cur.c.hint_wrong));
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
            <h3 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.c.lead || cur.c.title))}</h3>
            {cur.type === 'input' && (<>
              <div className="frame" style={{ display: 'flex', justifyContent: 'center' }}><CoordLine value={cur.coord.value} value2={cur.coord.value2} mirror={cur.coord.mirror} min={-6} max={6} success={flash}/></div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <input type="text" inputMode="numeric" className={`answer-input ${flash ? 'correct' : (hint ? 'wrong' : '')}`} value={val} placeholder="0" disabled={flash} onChange={e => { setVal(e.target.value); setHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(100px, 24vw, 140px)' }}/>
                {!flash && <button className="btn-white-accent" disabled={!val} onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(cur.c.btn_check) || (lang === 'uz' ? 'Tekshirish' : 'Проверить')}</button>}
              </div>
            </>)}
            {cur.type === 'place' && (<>
              <div className="frame" style={{ display: 'flex', justifyContent: 'center' }}><CoordLine min={-6} max={6} value2={cur.coord.value2} onPick={(v) => { if (!flash) { setPickV(v); setHint(false); } }} picked={pickV} success={flash}/></div>
              {!flash && <div style={{ display: 'flex', justifyContent: 'center' }}><button className="btn-white-accent" disabled={pickV === null} onClick={submitPlace} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(cur.c.btn_check) || (lang === 'uz' ? 'Tekshirish' : 'Проверить')}</button></div>}
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
                {cur.vals.map((v, i) => { const pos = seq.indexOf(i); return (
                  <button key={i} className={`od-card${pos !== -1 ? ' od-on' : ''}${flash ? ' od-ok' : ''}`} disabled={flash} onClick={() => { if (!flash) { setSeq(p => p.includes(i) ? p : [...p, i]); setHint(false); } }}>
                    {pos !== -1 && <span className="od-badge">{pos + 1}</span>}<span className="od-temp">{fmtN(v)}</span></button>); })}
              </div>
              {!flash && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><button className="btn-ghost" disabled={seq.length === 0} onClick={() => setSeq([])} style={{ padding: 'clamp(9px, 1.5vw, 11px) clamp(14px, 2vw, 18px)', fontSize: 'clamp(11px, 1.4vw, 13px)' }}>{lang === 'uz' ? 'Tozalash' : 'Сброс'}</button><button className="btn-white-accent" disabled={seq.length < cur.vals.length} onClick={submitOrder} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(cur.c.btn_check) || (lang === 'uz' ? 'Tekshirish' : 'Проверить')}</button></div>}
            </>)}
            {cur.type === 'multiselect' && (<>
              <div className="ms-grid">
                {cur.itemKeys.map((k, i) => { const on = msel.includes(i); const isC = flash && cur.mask[i]; return (
                  <button key={i} className={`ms-card${on ? ' ms-on' : ''}${isC ? ' ms-ok' : ''}`} disabled={flash} onClick={() => { if (!flash) { setMsel(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]); setHint(false); } }}>
                    <span className={`ms-box${on ? ' ms-box-on' : ''}`} aria-hidden="true">{on && <IconOk/>}</span><span className="ms-pair">{mt(t(cur.c[k]))}</span></button>); })}
              </div>
              {!flash && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submitMsel} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(cur.c.btn_check) || (lang === 'uz' ? 'Tekshirish' : 'Проверить')}</button></div>}
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

// s6 — BLOCK 1: kiritish + taqqoslash MC + o'qqa belgilash (ketma-ket)
const Screen6 = (props) => <SeqMix {...props} items={B1_ITEMS} screenContent={W_B1} scope={SCREEN_META[props.screen].scope} factOnDone={<FactCard text={CONTENT.s7.fact} badge={FB_HIST} anim={<AnimHistory/>}/>}/>;




// s11 — CASE setup (Oybek −3, Nafisa 2; CoordLine)
const Screen11 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(8px, 1.8vw, 14px)' }}>
          <CoordLine value={2} value2={-3} highlight={[2, -3]} min={-6} max={6}/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// BLOCK 2: tartiblash + multi-select + final MC (ketma-ket)
const ScreenB2 = (props) => <SeqMix {...props} items={B2_ITEMS} screenContent={W_B2} scope={SCREEN_META[props.screen].scope} factOnDone={<FactCard text={CONTENT.s12.fact} badge={FB_IT} anim={<AnimBits/>}/>}/>;

// s13 — SUMMARY + hook yopilishi + bog'lanishlar + ambient
// SUMMARY — yagona standart (etalon: Dars09-13): eyebrow + h-title + ball qatori (X/Y) +
// asosiy punktlar + hookni yopish + ConnectionsBlock, top-anchor.
const Screen13 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3];
  const scoreTotal = SCREEN_META.filter(s => s.scored).length;
  const scoreCorrect = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
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

// ============================================================
// KORNEVOY KOMPONENT
// ============================================================
export default function NegCompareLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen11, ScreenB2, Screen13];
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




`;
