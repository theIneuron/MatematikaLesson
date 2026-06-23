import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сложение дробей с равными знаменателями — frac_5_09
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C. s6 → классификация (= целое / меньше целого), s10 → error-spotting,
// s_seq → 5 примеров «сложи дроби» с растущими знаменателями (1→4 знака). Top-align, Bridge, shuffleMC.
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
const BOLD_RE = /<b>([\s\S]*?)<\/b>/g;
const mtFrac = (s, kp) => {
  if (s.indexOf('/') === -1) return [s];
  const out = []; let last = 0; let m; let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<Frac key={`${kp}f${key}`} n={m[1]} d={m[2]} size="sm"/>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};
const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (s.indexOf('/') === -1 && s.indexOf('<b>') === -1) return s;
  const out = []; let last = 0; let m; let key = 0;
  BOLD_RE.lastIndex = 0;
  while ((m = BOLD_RE.exec(s)) !== null) {
    if (m.index > last) out.push(...mtFrac(s.slice(last, m.index), `mt${key}o`));
    out.push(<strong key={`mtb${key}`}>{mtFrac(m[1], `mt${key}i`)}</strong>);
    key += 1;
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(...mtFrac(s.slice(last), `mt${key}e`));
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, titleNode, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure, bigOptions = false }) => {
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

  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong]   = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);

  const pick = (i) => {
    if (solved) return;
    if (wrong.has(i)) return;
    const isCorrect = i === correctIdx;

    if (firstTryRef.current === null) {
      firstTryRef.current = isCorrect;
      firstIdxRef.current = i;
    }
    attemptsRef.current += 1;
    setPicked(i);

    if (!introAdvancedRef.current) {
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
        studentAnswerIndex: firstIdxRef.current,
        studentAnswer: typeof options[firstIdxRef.current] === 'string' ? options[firstIdxRef.current] : null,
        correct: firstTryRef.current,
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        {titleNode && <Title node={titleNode}/>}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
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
            const disabled = solved || isWrongPicked;
            const showMark = solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : null);
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: bigOptions ? 'clamp(18px, 3.4vw, 24px)' : 'clamp(13px, 1.6vw, 14px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: bigOptions ? 'center' : 'flex-start', gap: bigOptions ? 8 : 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
                {(!bigOptions || showMark) && (
                  <span className="mono small" style={{ minWidth: bigOptions ? 'auto' : 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>
                    {showMark || String.fromCharCode(65 + i)}
                  </span>
                )}
                <span style={{ flex: bigOptions ? '0 1 auto' : 1, textAlign: bigOptions ? 'center' : 'left' }}>{opt}</span>
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
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// FACTCARD — fakt to'g'ri javobdan keyin (FB_* badge + Anim*). Namuna: Dars06.
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
// Tarix (meros/hosil bo'linishi): ulushlar ketma-ket yonib, butunni yig'adi.
const AnimShares = () => (
  <div className="fa-sh" aria-hidden="true">
    {Array.from({ length: 7 }).map((_, i) => (
      <span key={i} className="fa-sh-c" style={{ animationDelay: `${i * 0.18}s` }}/>
    ))}
  </div>
);
// Fan (bir xil stakanlar): ikki idish ulushma-ulush to'lib, hajmlar qo'shiladi.
const AnimJars = () => (
  <div className="fa-jars" aria-hidden="true">
    <span className="fa-jar">
      {Array.from({ length: 3 }).map((_, i) => (<span key={i} className="fa-jar-c" style={{ animationDelay: `${i * 0.3}s` }}/>))}
    </span>
    <span className="fa-jar-plus">+</span>
    <span className="fa-jar">
      {Array.from({ length: 3 }).map((_, i) => (<span key={i} className="fa-jar-c" style={{ animationDelay: `${0.9 + i * 0.3}s` }}/>))}
    </span>
  </div>
);
// IT (yuklash bo'laklari): bo'laklar ketma-ket qo'shilib 100% (butun) bo'ladi.
const AnimUpload = () => (
  <div className="fa-up" aria-hidden="true">
    <div className="fa-up-bar">
      {Array.from({ length: 5 }).map((_, i) => (<span key={i} className="fa-up-seg" style={{ animationDelay: `${i * 0.22}s` }}/>))}
    </div>
    <span className="fa-up-pct">100%</span>
  </div>
);

// ============================================================
// --- ПОД УРОК: frac_5_09 — Сложение дробей с равными знаменателями ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-09-v3',
  lessonTitle: { ru: 'Сложение дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni qo'shish" }
};
const TOTAL_SCREENS = 13;

// Обучающий урок keep-visible (noldan qayta yig'ilgan): sharbat-hook, 5-savol warmup, 7-misol SeqMC,
// 3-savatli tasniflash, fill-blank. scored — proverka ekranlarida (1-urinish → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'SeqMC',          scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'Classify',       scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'SeqMC',          scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // ===== s0 HOOK — «nega?» konseptual, sharbat (Nilufar) =====
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    title: { ru: 'Сколько сока стало?', uz: "Sharbat qancha bo'ldi?" },
    lead: { ru: 'У Нилуфар два стакана одного сока: 2/6 и 3/6. Она сливает их в один. Подруга говорит: стало 5/12. Так ли это?', uz: "Nilufarda bir xil sharbatli ikki stakan: 2/6 va 3/6. U ularni bittaga quyadi. Dugonasi: 5/12 bo'ldi, deydi. Shundaymi?" },
    opt0: { ru: '5/6', uz: '5/6' },
    opt1: { ru: '5/12', uz: '5/12' },
    opt2: { ru: '6/6', uz: '6/6' },
    reveal0: { ru: 'Верно. Доли одинаковые, шестые. Складываем только доли: 2 и 3 это 5. Знаменатель остаётся 6.', uz: "To'g'ri. Ulushlar bir xil, oltidan. Faqat ulushlarni qo'shamiz: 2 va 3 bu 5. Maxraj 6 bo'lib qoladi." },
    reveal1: { ru: 'Так думают многие. Но знаменатель показывает размер доли, он не меняется. Доли складываются: получается 5/6.', uz: "Ko'pchilik shunday o'ylaydi. Lekin maxraj ulush kattaligini ko'rsatadi, u o'zgarmaydi. Ulushlar qo'shiladi: 5/6 chiqadi." },
    reveal2: { ru: 'Почти. 6/6 это полный стакан. Но мы налили только 2 и 3 доли, всего 5 из 6.', uz: "Deyarli. 6/6 to'la stakan. Lekin biz faqat 2 va 3 ulush quydik, oltidan 5 ta." },
    audio: { ru: "У Нилуфар два стакана одного и того же сока. В одном две шестых, в другом три шестых. Она сливает оба в один стакан. Сколько сока стало? Подумай, прежде чем выбрать.", uz: "Nilufarda bir xil sharbatli ikki stakan bor. Birida oltidan ikki, ikkinchisida oltidan uch. U ikkalasini bitta stakanga quyadi. Sharbat qancha bo'ldi? Tanlashdan oldin o'ylab ko'ring." }
  },

  // ===== s1 WARMUP SeqMC — 5 oson savol (prerekvizit recall) =====
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaylik' },
    title: { ru: 'Разминка: пять вопросов', uz: "Mashq: besh savol" },
    lead: { ru: 'Пять быстрых вопросов про доли. Выбери ответ.', uz: "Ulushlar haqida beshta tez savol. Javobni tanlang." },
    bridge: { ru: 'Прежде чем ответить Нилуфар, вспомним, что такое доли.', uz: "Nilufarga javob berishdan oldin, ulush nimaligini eslaylik." },
    questions: [
      {
        q: { ru: 'Что больше: 3/7 или 5/7?', uz: "Qaysi katta: 3/7 yoki 5/7?" },
        say: { ru: "Доли одинаковые, седьмые. Что больше: три седьмых или пять седьмых?", uz: "Ulushlar bir xil, yettidan. Qaysi katta: yettidan uch yoki yettidan besh?" },
        opts: [{ ru: '5/7', uz: '5/7' }, { ru: '3/7', uz: '3/7' }, { ru: 'Равны', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: доли одинаковы, больше та, где долей больше.', uz: "To'g'ri: ulushlar bir xil, ulushi ko'pi katta." },
        no: { ru: 'Доли одинаковые. Смотри, где их больше.', uz: "Ulushlar bir xil. Qayerda ko'p ekaniga qarang." }
      },
      {
        q: { ru: 'Какой знаменатель у дроби 2/9?', uz: "2/9 kasrning maxraji qaysi?" },
        say: { ru: "Назови знаменатель дроби две девятых.", uz: "To'qqizdan ikki kasrning maxrajini ayting." },
        opts: [{ ru: '2', uz: '2' }, { ru: '9', uz: '9' }, { ru: '11', uz: '11' }],
        correct: 1,
        ok: { ru: 'Верно: знаменатель внизу, он показывает число долей.', uz: "To'g'ri: maxraj pastda, u ulushlar sonini ko'rsatadi." },
        no: { ru: 'Знаменатель внизу. Он показывает, на сколько долей разделили.', uz: "Maxraj pastda. U nechta ulushga bo'linganini ko'rsatadi." }
      },
      {
        q: { ru: 'Лепёшку разделили на 8 равных долей. Одна доля — это?', uz: "Non 8 teng ulushga bo'lindi. Bitta ulush — bu?" },
        say: { ru: "Лепёшку разделили на восемь равных долей. Одна такая доля это какая дробь?", uz: "Non sakkiz teng ulushga bo'lindi. Bitta shunday ulush qaysi kasr?" },
        opts: [{ ru: '8/1', uz: '8/1' }, { ru: '1/4', uz: '1/4' }, { ru: '1/8', uz: '1/8' }],
        correct: 2,
        ok: { ru: 'Верно: одна доля из восьми — это 1/8.', uz: "To'g'ri: sakkizdan bitta ulush — bu 1/8." },
        no: { ru: 'Берём одну долю из восьми: вверху один, внизу восемь.', uz: "Sakkizdan bitta ulush olamiz: yuqorida bir, pastda sakkiz." }
      },
      {
        q: { ru: 'Чему равна дробь 4/4?', uz: "4/4 kasr nechaga teng?" },
        say: { ru: "Сколько будет четыре четвёртых?", uz: "To'rtdan to'rt qancha bo'ladi?" },
        opts: [{ ru: 'Целому', uz: 'Butunga' }, { ru: '4', uz: '4' }, { ru: 'Нулю', uz: 'Nolga' }],
        correct: 0,
        ok: { ru: 'Верно: все доли на месте — это целое.', uz: "To'g'ri: barcha ulush joyida — bu butun." },
        no: { ru: 'Когда взяты все доли, получается целое.', uz: "Hamma ulush olinganda, butun bo'ladi." }
      },
      {
        q: { ru: 'Что меньше: 1/6 или 5/6?', uz: "Qaysi kichik: 1/6 yoki 5/6?" },
        say: { ru: "Доли шестые. Что меньше: одна шестая или пять шестых?", uz: "Ulushlar oltidan. Qaysi kichik: oltidan bir yoki oltidan besh?" },
        opts: [{ ru: '5/6', uz: '5/6' }, { ru: 'Равны', uz: 'Teng' }, { ru: '1/6', uz: '1/6' }],
        correct: 2,
        ok: { ru: 'Верно: одна доля меньше пяти таких же долей.', uz: "To'g'ri: bitta ulush shunday besh ulushdan kichik." },
        no: { ru: 'Доли одинаковые. Меньше та, где их меньше.', uz: "Ulushlar bir xil. Ulushi kami kichik." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем ответить Нилуфар, вспомним доли. Пять быстрых вопросов.", uz: "Nilufarga javob berishdan oldin, ulushlarni eslaylik. Beshta tez savol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Посмотри ещё раз.", uz: "Deyarli. Yana bir qarang." },
      on_done: { ru: "Разминка пройдена. Теперь к сложению.", uz: "Mashq tugadi. Endi qo'shishga o'tamiz." }
    }
  },

  // ===== s2 EXPLORATION — bar/doira step (2/6 + 3/6 = 5/6) =====
  s2: {
    eyebrow: { ru: 'Смотрим на доли', uz: "Ulushlarga qaraymiz" },
    title: { ru: 'Складываем 2/6 и 3/6', uz: "2/6 va 3/6 ni qo'shamiz" },
    lead: { ru: 'Вернёмся к соку Нилуфар. Доли одинаковые — шестые.', uz: "Nilufar sharbatiga qaytamiz. Ulushlar bir xil — oltidan." },
    bridge: { ru: 'Доли вспомнили. Теперь шаг за шагом сложим их.', uz: "Ulushlarni esladik. Endi ularni qadam-baqadam qo'shamiz." },
    line_intro: { ru: 'Одна полоса разделена на 6 равных долей.', uz: "Bitta chiziq 6 teng ulushga bo'lingan." },
    line_first: { ru: 'Закрасим 2 доли — это первый стакан, 2/6.', uz: "2 ulushni bo'yaymiz — bu birinchi stakan, 2/6." },
    line_second: { ru: 'Добавим ещё 3 доли — второй стакан, 3/6.', uz: "Yana 3 ulush qo'shamiz — ikkinchi stakan, 3/6." },
    line_count: { ru: 'Считаем закрашенные доли: 2 + 3 = 5. Получилось 5/6.', uz: "Bo'yalgan ulushlarni sanaymiz: 2 + 3 = 5. 5/6 chiqdi." },
    line_key: { ru: 'Размер доли не изменился — осталась шестой. Сложились только сами доли.', uz: "Ulush kattaligi o'zgarmadi — oltidanligicha qoldi. Faqat ulushlarning o'zi qo'shildi." },
    audio: {
      ru: [
        "Вернёмся к соку. Полоса разделена на шесть равных долей.",
        "Закрашиваем две доли. Это первый стакан, две шестых.",
        "Добавляем ещё три доли. Это второй стакан, три шестых.",
        "Считаем закрашенные доли: две и три это пять. Получилось пять шестых.",
        "Размер доли не менялся. Она так и осталась шестой. Сложились только сами доли."
      ],
      uz: [
        "Sharbatga qaytamiz. Chiziq olti teng ulushga bo'lingan.",
        "Ikki ulushni bo'yaymiz. Bu birinchi stakan, oltidan ikki.",
        "Yana uch ulush qo'shamiz. Bu ikkinchi stakan, oltidan uch.",
        "Bo'yalgan ulushlarni sanaymiz: ikki va uch besh. Oltidan besh chiqdi.",
        "Ulush kattaligi o'zgarmadi. U oltidanligicha qoldi. Faqat ulushlarning o'zi qo'shildi."
      ]
    }
  },

  // ===== s3 EXPLORATION — interaktiv +/-, jonli formula (den=7) =====
  s3: {
    eyebrow: { ru: 'Попробуй сам', uz: "O'zingiz sinab ko'ring" },
    title: { ru: 'Добавляй доли сам', uz: "Ulushlarni o'zingiz qo'shing" },
    lead: { ru: 'Знаменатель — седьмые. Кнопками набери два числителя и смотри на сумму.', uz: "Maxraj — yettidan. Tugmalar bilan ikkita suratni tering va yig'indiga qarang." },
    instr: { ru: 'Меняй числители кнопками плюс и минус.', uz: "Suratlarni plyus va minus tugmalari bilan o'zgartiring." },
    instr_done: { ru: 'Видишь: меняется только верх дроби, низ остаётся 7.', uz: "Ko'ryapsiz: faqat kasrning usti o'zgaradi, pasti 7 bo'lib qoladi." },
    leg_a: { ru: 'Первая', uz: "Birinchi" },
    leg_b: { ru: 'Вторая', uz: "Ikkinchi" },
    leg_sum: { ru: 'Сумма', uz: "Yig'indi" },
    note_rule: { ru: 'Числители складываются, знаменатель 7 не меняется.', uz: "Suratlar qo'shiladi, maxraj 7 o'zgarmaydi." },
    audio: { ru: "Теперь попробуй сам. Знаменатель у обеих дробей одинаковый, седьмые. Меняй числители кнопками и смотри: внизу всё время остаётся семь, а вверху доли складываются.", uz: "Endi o'zingiz sinab ko'ring. Ikkala kasrning maxraji bir xil, yettidan. Suratlarni tugmalar bilan o'zgartiring va qarang: pastda doim yetti qoladi, yuqorida esa ulushlar qo'shiladi." }
  },

  // ===== s4 RULE =====
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Сложение дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni qo'shish" },
    bridge: { ru: 'Мы увидели, как это работает. Соберём в одно правило.', uz: "Bu qanday ishlashini ko'rdik. Bitta qoidaga yig'amiz." },
    rule_label: { ru: 'Запомни', uz: "Yodda tuting" },
    rule_1: { ru: 'Складываем числители — верхние числа.', uz: "Suratlarni — yuqoridagi sonlarni qo'shamiz." },
    rule_2: { ru: 'Знаменатель оставляем тот же — он показывает размер доли.', uz: "Maxrajni o'sha holicha qoldiramiz — u ulush kattaligini ko'rsatadi." },
    ex_label: { ru: 'Как это работает', uz: "Bu qanday ishlaydi" },
    ex_caption: { ru: '2/6 + 3/6: складываем 2 + 3 = 5, знаменатель 6 → 5/6.', uz: "2/6 + 3/6: 2 + 3 = 5 qo'shamiz, maxraj 6 → 5/6." },
    audio: { ru: "Запомним правило. Когда знаменатели одинаковые, складываем только числители, а знаменатель оставляем тот же. Например, две шестых плюс три шестых дают пять шестых.", uz: "Qoidani yodda tutamiz. Maxrajlar bir xil bo'lganda, faqat suratlarni qo'shamiz, maxrajni o'sha holicha qoldiramiz. Masalan, oltidan ikki va oltidan uch oltidan beshni beradi." }
  },

  // ===== s5 RULE 2 — TUZOQ (pale-yellow) =====
  s5: {
    eyebrow: { ru: 'Осторожно', uz: "Ehtiyot bo'ling" },
    heading: { ru: 'Знаменатели не складываются', uz: "Maxrajlar qo'shilmaydi" },
    warn_1: { ru: 'Самая частая ошибка — сложить и знаменатели тоже.', uz: "Eng ko'p uchraydigan xato — maxrajlarni ham qo'shib yuborish." },
    ok_label: { ru: 'Правильно', uz: "To'g'ri" },
    ok_note: { ru: 'Знаменатель остаётся шестым.', uz: "Maxraj oltidan bo'lib qoladi." },
    bad_label: { ru: 'Неправильно', uz: "Noto'g'ri" },
    bad_cause: { ru: 'Здесь сложили и знаменатели: 6 + 6 = 12.', uz: "Bu yerda maxrajlar ham qo'shilgan: 6 + 6 = 12." },
    bad_note: { ru: 'Так нельзя — знаменатель не складывают.', uz: "Bunday bo'lmaydi — maxraj qo'shilmaydi." },
    warn_2: { ru: 'Знаменатель — это размер доли. Долю не делим заново, поэтому он не меняется.', uz: "Maxraj — bu ulush kattaligi. Ulushni qaytadan bo'lmaymiz, shuning uchun u o'zgarmaydi." },
    audio: { ru: "Будь внимателен. Самая частая ошибка это сложить ещё и знаменатели: шесть плюс шесть двенадцать. Тогда вместо пяти шестых получится пять двенадцатых. Но знаменатель показывает размер доли, и он остаётся прежним, шестым.", uz: "Diqqat bo'ling. Eng ko'p uchraydigan xato bu maxrajlarni ham qo'shib yuborish: olti qo'shuv olti o'n ikki. Unda oltidan besh o'rniga o'n ikkidan besh chiqadi. Lekin maxraj ulush kattaligini ko'rsatadi, va u o'sha holicha, oltidan bo'lib qoladi." }
  },

  // ===== s6 TEST MC — 2/7 + 4/7 (FAKT: musiqa) =====
  s6: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    bridge: { ru: 'Правило знаем — теперь попробуй применить его сам.', uz: "Qoidani bilamiz — endi uni o'zingiz qo'llab ko'ring." },
    title: { ru: 'Сложи <b>2/7 + 4/7</b>', uz: "<b>2/7 + 4/7</b> ni qo'shing" },
    question: { ru: 'Знаменатель — седьмые. Сколько получится?', uz: "Maxraj — yettidan. Qancha chiqadi?" },
    opt0: { ru: '6/7', uz: '6/7' },
    opt1: { ru: '6/14', uz: '6/14' },
    opt2: { ru: '8/7', uz: '8/7' },
    opt3: { ru: '2/7', uz: '2/7' },
    correct_text: { ru: 'Верно: 2 + 4 = 6, знаменатель 7 не меняется. Получается 6/7.', uz: "To'g'ri: 2 + 4 = 6, maxraj 7 o'zgarmaydi. 6/7 chiqadi." },
    wrong_1: { ru: 'Ты сложил и знаменатели тоже. Так делать нельзя, знаменатель остаётся прежним.', uz: "Siz maxrajlarni ham qo'shdingiz. Bunday qilib bo'lmaydi, maxraj o'sha holicha qoladi." },
    wrong_2: { ru: 'Числители сложены неверно. Сложи только верхние числа.', uz: "Suratlar noto'g'ri qo'shilgan. Faqat yuqoridagi sonlarni qo'shing." },
    wrong_3: { ru: 'Это только первая дробь. Прибавь к ней и вторую долю.', uz: "Bu faqat birinchi kasr. Unga ikkinchi ulushni ham qo'shing." },
    fact: { ru: 'В музыке так же: четверть плюс четверть это половина (1/4 + 1/4 = 1/2). Доли длительности складываются, как доли целого.', uz: "Musiqada ham xuddi shunday: chorak qo'shuv chorak — bu yarim (1/4 + 1/4 = 1/2). Davomiylik ulushlari butun ulushlaridek qo'shiladi." },
    audio: {
      intro: { ru: "Правило знаем, теперь попробуй сам. Сколько будет две седьмых плюс четыре седьмых?", uz: "Qoidani bilamiz, endi o'zingiz urinib ko'ring. Yettidan ikki va yettidan to'rt qancha bo'ladi?" },
      on_correct: { ru: "Верно, шесть седьмых. Кстати, в музыке доли длительности складываются так же: четверть и ещё четверть дают половину.", uz: "To'g'ri, yettidan olti. Aytgancha, musiqada davomiylik ulushlari xuddi shunday qo'shiladi: chorak va yana chorak yarimni beradi." },
      on_wrong: { ru: "Сложи только числители, знаменатель оставь прежним.", uz: "Faqat suratlarni qo'shing, maxrajni o'sha holicha qoldiring." }
    }
  },

  // ===== s7 TEST error-spotting (FAKT: vaqt) =====
  s7: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Где запись <b>неверная</b>?', uz: "Qaysi yozuv <b>noto'g'ri</b>?" },
    question: { ru: 'Три записи верны, одна — нет. Найди неверную.', uz: "Uch yozuv to'g'ri, biri — yo'q. Noto'g'risini toping." },
    opt0: { ru: '1/5 + 2/5 = 3/5', uz: '1/5 + 2/5 = 3/5' },
    opt1: { ru: '2/9 + 4/9 = 6/9', uz: '2/9 + 4/9 = 6/9' },
    opt2: { ru: '3/8 + 4/8 = 7/16', uz: '3/8 + 4/8 = 7/16' },
    opt3: { ru: '1/4 + 2/4 = 3/4', uz: '1/4 + 2/4 = 3/4' },
    correct_text: { ru: 'Верно. В 3/8 + 4/8 сложили и знаменатели: вышло 7/16. Правильно 7/8 — знаменатель остаётся 8.', uz: "To'g'ri. 3/8 + 4/8 da maxrajlar ham qo'shilgan: 7/16 chiqqan. To'g'risi 7/8 — maxraj 8 bo'lib qoladi." },
    wrong_0: { ru: 'Эта запись верна, знаменатель остался прежним. Ищи дальше.', uz: "Bu yozuv to'g'ri, maxraj o'sha holicha qoldi. Boshqasidan qidiring." },
    wrong_1: { ru: 'Эта запись верна, знаменатель остался прежним. Ищи дальше.', uz: "Bu yozuv to'g'ri, maxraj o'sha holicha qoldi. Boshqasidan qidiring." },
    wrong_3: { ru: 'Эта запись верна, знаменатель остался прежним. Ищи дальше.', uz: "Bu yozuv to'g'ri, maxraj o'sha holicha qoldi. Boshqasidan qidiring." },
    wrong_default: { ru: 'Проверь каждую запись: знаменатель не должен меняться.', uz: "Har bir yozuvni tekshiring: maxraj o'zgarmasligi kerak." },
    fact: { ru: 'На часах так же: четверть часа плюс четверть часа это полчаса (1/4 + 1/4 = 2/4). Доли времени складываются как доли целого.', uz: "Soatda ham shunday: chorak soat qo'shuv chorak soat — bu yarim soat (1/4 + 1/4 = 2/4). Vaqt ulushlari butun ulushlaridek qo'shiladi." },
    audio: {
      intro: { ru: "Одна из этих записей неверная. Найди ту, где знаменатель сложили вместе с числителями.", uz: "Bu yozuvlardan biri noto'g'ri. Maxrajni suratlar bilan qo'shib yuborilgan yozuvni toping." },
      on_correct: { ru: "Верно, здесь сложили и знаменатели. Кстати, на часах доли времени складываются правильно: четверть часа и ещё четверть это полчаса.", uz: "To'g'ri, bu yerda maxrajlar ham qo'shilgan. Aytgancha, soatda vaqt ulushlari to'g'ri qo'shiladi: chorak soat va yana chorak yarim soatni beradi." },
      on_wrong: { ru: "Проверь каждую запись: знаменатель должен остаться прежним.", uz: "Har bir yozuvni tekshiring: maxraj o'sha holicha qolishi kerak." }
    }
  },

  // ===== s8 TEST classify — yig'indi: butundan kichik / teng / katta (3 savat) =====
  s8: {
    eyebrow: { ru: 'Разложи по группам', uz: "Guruhlarga ajrating" },
    title: { ru: 'Сумма меньше целого, равна или больше?', uz: "Yig'indi butundan kichik, teng yoki katta?" },
    lead: { ru: 'Посчитай каждую сумму и поставь её в свою группу. Сравни числитель со знаменателем.', uz: "Har bir yig'indini hisoblang va o'z guruhiga joylang. Suratni maxraj bilan solishtiring." },
    bin_lt: { ru: 'Меньше целого', uz: "Butundan kichik" },
    bin_eq: { ru: 'Равно целому', uz: "Butunga teng" },
    bin_gt: { ru: 'Больше целого', uz: "Butundan katta" },
    cards: [
      { expr: '1/5 + 2/5', bin: 'lt', say: { ru: 'Одна пятая плюс две пятых', uz: "Beshdan bir qo'shuv beshdan ikki" } },
      { expr: '2/6 + 1/6', bin: 'lt', say: { ru: 'Две шестых плюс одна шестая', uz: "Oltidan ikki qo'shuv oltidan bir" } },
      { expr: '3/6 + 3/6', bin: 'eq', say: { ru: 'Три шестых плюс три шестых', uz: "Oltidan uch qo'shuv oltidan uch" } },
      { expr: '4/8 + 4/8', bin: 'eq', say: { ru: 'Четыре восьмых плюс четыре восьмых', uz: "Sakkizdan to'rt qo'shuv sakkizdan to'rt" } },
      { expr: '5/6 + 4/6', bin: 'gt', say: { ru: 'Пять шестых плюс четыре шестых', uz: "Oltidan besh qo'shuv oltidan to'rt" } },
      { expr: '3/4 + 2/4', bin: 'gt', say: { ru: 'Три четвёртых плюс две четвёртых', uz: "To'rtdan uch qo'shuv to'rtdan ikki" } }
    ],
    ask: { ru: 'В какую группу? Тапни корзину.', uz: "Qaysi guruhga? Savatni bosing." },
    done_text: { ru: 'Готово. Сумма равна целому, когда числитель сравнялся со знаменателем, и больше целого, когда числитель его перерос.', uz: "Tayyor. Surat maxrajga tenglashganda yig'indi butunga teng, suratdan oshganda esa butundan katta bo'ladi." },
    hint_wrong: { ru: 'Сложи числители и сравни со знаменателем: меньше, равно или больше.', uz: "Suratlarni qo'shib maxraj bilan solishtiring: kichik, teng yoki katta." },
    correct_text: { ru: 'Верно. Числитель меньше знаменателя — меньше целого, равен — целое, больше — больше целого.', uz: "To'g'ri. Surat maxrajdan kichik — butundan kichik, teng — butun, katta — butundan katta." },
    audio: {
      intro: { ru: "Поставь каждую сумму в свою группу: меньше целого, равна целому или больше. Сложи числители и сравни со знаменателем.", uz: "Har bir yig'indini o'z guruhiga joylang: butundan kichik, butunga teng yoki katta. Suratlarni qo'shib maxraj bilan solishtiring." },
      on_correct: { ru: "Верно. Когда числитель равен знаменателю, дробь это целое.", uz: "To'g'ri. Surat maxrajga teng bo'lganda, kasr butun bo'ladi." },
      on_wrong: { ru: "Сложи числители и сравни со знаменателем.", uz: "Suratlarni qo'shib maxraj bilan solishtiring." }
    }
  },

  // ===== s9 TEST fill-blank — 3/8 + 2/8 = ?/8 (o'zi teradi) =====
  s9: {
    eyebrow: { ru: 'Впиши ответ', uz: "Javobni kiriting" },
    question: { ru: 'Сложи: 3/8 + 2/8 = ?/8. Впиши числитель.', uz: "Qo'shing: 3/8 + 2/8 = ?/8. Suratni kiriting." },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель уже стоит. Сложи только числители, то есть верхние числа.', uz: "Maxraj allaqachon turibdi. Faqat suratlarni, ya'ni yuqoridagi sonlarni qo'shing." },
    fb_correct: { ru: 'Верно: 3 + 2 = 5, знаменатель 8 → 5/8.', uz: "To'g'ri: 3 + 2 = 5, maxraj 8 → 5/8." },
    audio: {
      intro: { ru: "Знаменатель уже стоит, восемь. Впиши числитель: сколько будет три восьмых плюс две восьмых?", uz: "Maxraj allaqachon turibdi, sakkiz. Suratni kiriting: sakkizdan uch va sakkizdan ikki qancha bo'ladi?" },
      on_correct: { ru: "Верно, пять восьмых. Сложили только числители.", uz: "To'g'ri, sakkizdan besh. Faqat suratlarni qo'shdik." },
      on_wrong: { ru: "Сложи числители, знаменатель не трогай.", uz: "Suratlarni qo'shing, maxrajga tegmang." }
    }
  },

  // ===== s10 TEST SeqMC — 7 misol oson→qiyin =====
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Семь примеров: от лёгкого к трудному', uz: "Yetti misol: osondan qiyiniga" },
    lead: { ru: 'Складывай дроби. Знаменатель не меняем. Дальше — сложнее.', uz: "Kasrlarni qo'shing. Maxraj o'zgarmaydi. Keyingisi — qiyinroq." },
    questions: [
      {
        q: { ru: '1/4 + 2/4', uz: '1/4 + 2/4' },
        say: { ru: "Одна четвёртая плюс две четвёртых.", uz: "To'rtdan bir qo'shuv to'rtdan ikki." },
        opts: [{ ru: '3/4', uz: '3/4' }, { ru: '3/8', uz: '3/8' }, { ru: '2/4', uz: '2/4' }],
        correct: 0,
        ok: { ru: 'Верно: 1 + 2 = 3, знаменатель 4.', uz: "To'g'ri: 1 + 2 = 3, maxraj 4." },
        no: { ru: 'Сложи числители, знаменатель оставь прежним.', uz: "Suratlarni qo'shing, maxrajni o'sha holicha qoldiring." }
      },
      {
        q: { ru: '2/5 + 1/5', uz: '2/5 + 1/5' },
        say: { ru: "Две пятых плюс одна пятая.", uz: "Beshdan ikki qo'shuv beshdan bir." },
        opts: [{ ru: '3/10', uz: '3/10' }, { ru: '3/5', uz: '3/5' }, { ru: '1/5', uz: '1/5' }],
        correct: 1,
        ok: { ru: 'Верно: 2 + 1 = 3, знаменатель 5.', uz: "To'g'ri: 2 + 1 = 3, maxraj 5." },
        no: { ru: 'Знаменатель не складываем, он остаётся прежним.', uz: "Maxrajni qo'shmaymiz, u o'sha holicha qoladi." }
      },
      {
        q: { ru: '3/7 + 2/7', uz: '3/7 + 2/7' },
        say: { ru: "Три седьмых плюс две седьмых.", uz: "Yettidan uch qo'shuv yettidan ikki." },
        opts: [{ ru: '5/14', uz: '5/14' }, { ru: '6/7', uz: '6/7' }, { ru: '5/7', uz: '5/7' }],
        correct: 2,
        ok: { ru: 'Верно: 3 + 2 = 5, знаменатель 7.', uz: "To'g'ri: 3 + 2 = 5, maxraj 7." },
        no: { ru: 'Сложи только числители.', uz: "Faqat suratlarni qo'shing." }
      },
      {
        q: { ru: '4/9 + 4/9', uz: '4/9 + 4/9' },
        say: { ru: "Четыре девятых плюс четыре девятых.", uz: "To'qqizdan to'rt qo'shuv to'qqizdan to'rt." },
        opts: [{ ru: '8/9', uz: '8/9' }, { ru: '8/18', uz: '8/18' }, { ru: '16/9', uz: '16/9' }],
        correct: 0,
        ok: { ru: 'Верно: 4 + 4 = 8, знаменатель 9.', uz: "To'g'ri: 4 + 4 = 8, maxraj 9." },
        no: { ru: 'Числители сложи, знаменатель оставь прежним.', uz: "Suratlarni qo'shing, maxrajni o'sha holicha qoldiring." }
      },
      {
        q: { ru: '3/6 + 3/6', uz: '3/6 + 3/6' },
        say: { ru: "Три шестых плюс три шестых.", uz: "Oltidan uch qo'shuv oltidan uch." },
        opts: [{ ru: '6/12', uz: '6/12' }, { ru: '6/6', uz: '6/6' }, { ru: '3/6', uz: '3/6' }],
        correct: 1,
        ok: { ru: 'Верно: 3 + 3 = 6, знаменатель 6. Это 6/6 — целое.', uz: "To'g'ri: 3 + 3 = 6, maxraj 6. Bu 6/6 — butun." },
        no: { ru: 'Сложи числители, знаменатель оставь прежним.', uz: "Suratlarni qo'shing, maxrajni o'sha holicha qoldiring." }
      },
      {
        q: { ru: '5/8 + 3/8', uz: '5/8 + 3/8' },
        say: { ru: "Пять восьмых плюс три восьмых.", uz: "Sakkizdan besh qo'shuv sakkizdan uch." },
        opts: [{ ru: '8/16', uz: '8/16' }, { ru: '8/8', uz: '8/8' }, { ru: '15/8', uz: '15/8' }],
        correct: 1,
        ok: { ru: 'Верно: 5 + 3 = 8, знаменатель 8. Это 8/8 — целое.', uz: "To'g'ri: 5 + 3 = 8, maxraj 8. Bu 8/8 — butun." },
        no: { ru: 'Знаменатель не меняем. Сложи верхние числа.', uz: "Maxrajni o'zgartirmaymiz. Yuqoridagi sonlarni qo'shing." }
      },
      {
        q: { ru: '5/6 + 4/6', uz: '5/6 + 4/6' },
        say: { ru: "Пять шестых плюс четыре шестых.", uz: "Oltidan besh qo'shuv oltidan to'rt." },
        opts: [{ ru: '9/6', uz: '9/6' }, { ru: '9/12', uz: '9/12' }, { ru: '1/6', uz: '1/6' }],
        correct: 0,
        ok: { ru: 'Верно: 5 + 4 = 9, знаменатель 6. Получается 9/6 — больше целого.', uz: "To'g'ri: 5 + 4 = 9, maxraj 6. 9/6 chiqadi — butundan katta." },
        no: { ru: 'Сложи числители. Сумма может быть больше целого.', uz: "Suratlarni qo'shing. Yig'indi butundan katta bo'lishi mumkin." }
      }
    ],
    audio: {
      intro: { ru: "Семь примеров, от лёгкого к трудному. Складывай числители, знаменатель оставляй прежним.", uz: "Yetti misol, osondan qiyiniga. Suratlarni qo'shing, maxrajni o'sha holicha qoldiring." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Складывай только числители.", uz: "Deyarli. Faqat suratlarni qo'shing." },
      on_done: { ru: "Все семь готовы. Даже когда сумма больше целого, знаменатель не меняется.", uz: "Yettalasi tayyor. Yig'indi butundan katta bo'lganda ham, maxraj o'zgarmaydi." }
    }
  },

  // ===== s11 CASE — internet/GB (Behruz), final MC (FAKT: internet) =====
  s11: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    title: { ru: 'Загрузка файла у Бехруза', uz: "Behruzning fayl yuklashi" },
    bridge: { ru: 'Хорошо потренировались. Применим сложение в жизни.', uz: "Yaxshi mashq qildik. Qo'shishni hayotda qo'llaymiz." },
    lead: { ru: 'Бехруз качает файл. Сначала загрузилось 1/8 файла, потом ещё 3/8. Доли одинаковые — восьмые.', uz: "Behruz fayl yuklayapti. Avval faylning 1/8 qismi yuklandi, keyin yana 3/8. Ulushlar bir xil — sakkizdan." },
    note: { ru: 'Сколько файла загрузилось всего?', uz: "Jami faylning qancha qismi yuklandi?" },
    question: { ru: 'Сколько загрузилось всего? <b>1/8 + 3/8</b>', uz: "Jami qancha yuklandi? <b>1/8 + 3/8</b>" },
    opt0: { ru: '4/8', uz: '4/8' },
    opt1: { ru: '4/16', uz: '4/16' },
    opt2: { ru: '3/8', uz: '3/8' },
    opt3: { ru: '1/8', uz: '1/8' },
    correct_text: { ru: 'Верно: 1 + 3 = 4, знаменатель 8. Загрузилось 4/8 файла — это половина.', uz: "To'g'ri: 1 + 3 = 4, maxraj 8. Faylning 4/8 qismi yuklandi — bu yarmi." },
    wrong_1: { ru: 'Ты сложил и знаменатели тоже. Знаменатель остаётся прежним.', uz: "Siz maxrajlarni ham qo'shdingiz. Maxraj o'sha holicha qoladi." },
    wrong_2: { ru: 'Это только вторая загрузка. Прибавь и первую долю.', uz: "Bu faqat ikkinchi yuklash. Birinchi ulushni ham qo'shing." },
    wrong_3: { ru: 'Это только первая загрузка. Прибавь и вторую долю.', uz: "Bu faqat birinchi yuklash. Ikkinchi ulushni ham qo'shing." },
    fact: { ru: 'Полоска загрузки в телефоне — это дробь: загруженная часть от всего файла. 4/8 это половина, полоса заполнена наполовину.', uz: "Telefondagi yuklash chizig'i — bu kasr: butun fayldan yuklangan qism. 4/8 — bu yarim, chiziq yarmigacha to'lgan." },
    audio: {
      intro: { ru: "Бехруз качает файл. Сначала загрузилась одна восьмая, потом ещё три восьмых. Сколько файла загрузилось всего?", uz: "Behruz fayl yuklayapti. Avval sakkizdan bir yuklandi, keyin yana sakkizdan uch. Jami faylning qancha qismi yuklandi?" },
      on_correct: { ru: "Верно, четыре восьмых, это ровно половина файла. Кстати, полоска загрузки и есть такая дробь.", uz: "To'g'ri, sakkizdan to'rt, bu faylning aniq yarmi. Aytgancha, yuklash chizig'i ham xuddi shunday kasr." },
      on_wrong: { ru: "Сложи только числители, знаменатель оставь прежним.", uz: "Faqat suratlarni qo'shing, maxrajni o'sha holicha qoldiring." }
    }
  },

  // ===== s12 SUMMARY — hookni yopadi + ConnectionsBlock =====
  s12: {
    eyebrow: { ru: 'Итог', uz: "Xulosa" },
    heading: { ru: 'Что мы поняли', uz: "Nimani tushundik" },
    title: { ru: 'Сложить дроби с равным знаменателем легко', uz: "Bir xil maxrajli kasrlarni qo'shish oson" },
    score_caption: { ru: 'верных ответов с первой попытки.', uz: "ta javob birinchi urinishda to'g'ri." },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Складываем только числители.', uz: "Faqat suratlarni qo'shamiz." },
    main_2: { ru: 'Знаменатель оставляем тот же — его не складываем.', uz: "Maxrajni o'sha holicha qoldiramiz — uni qo'shmaymiz." },
    main_3: { ru: 'Когда числитель сравнялся со знаменателем, дробь равна целому.', uz: "Surat maxrajga tenglashganda, kasr butunga teng bo'ladi." },
    hook_close: { ru: 'Вот и ответ Нилуфар: 2/6 + 3/6 = 5/6, а не 5/12. Знаменатель не меняется.', uz: "Mana Nilufarga javob: 2/6 + 3/6 = 5/6, 5/12 emas. Maxraj o'zgarmaydi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Что такое доля целого и сравнение дробей с равным знаменателем.', uz: "Butun ulushi nima va bir xil maxrajli kasrlarni taqqoslash." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Вычитание дробей с равными знаменателями.', uz: "Bir xil maxrajli kasrlarni ayirish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, складываем только числители, а знаменатель оставляем прежним. А когда числитель сравнялся со знаменателем, дробь становится целым. Вот и ответ Нилуфар: две шестых плюс три шестых это пять шестых.", uz: "Demak, faqat suratlarni qo'shamiz, maxrajni esa o'sha holicha qoldiramiz. Surat maxrajga tenglashganda kasr butun bo'ladi. Mana Nilufarga javob: oltidan ikki va oltidan uch bu oltidan besh." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_09: круг (пирог) + полоса синхронно. Доли-картинка.
// 1-е слагаемое — accent, 2-е — blue, 3-е — violet. Интерактив: tap/slider/drag.
// ============================================================
const VIOLET = '#7A5AF0';
const ADDEND_COLORS = [T.accent, T.blue, VIOLET];

// Точка на окружности (старт сверху, по часовой).
const polar = (cx, cy, r, deg) => {
  const a = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
// SVG-путь сектора круга.
const wedgePath = (cx, cy, r, startDeg, endDeg) => {
  const [x1, y1] = polar(cx, cy, r, startDeg);
  const [x2, y2] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
};
// Из списка слагаемых [{count,color}] собираем массив длины den (цвет доли или null).
const buildFills = (parts, den) => {
  const arr = Array.from({ length: den }, () => null);
  let idx = 0;
  parts.forEach(p => { for (let k = 0; k < p.count && idx < den; k++) { arr[idx] = p.color; idx++; } });
  return arr;
};

// Круг-пирог: den секторов, каждый — цвет из fills или пустой. onCell → клик по сектору.
const FracPie = ({ den, fills, size = 150, onCell }) => {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
      {Array.from({ length: den }).map((_, i) => {
        const start = (i / den) * 360, end = ((i + 1) / den) * 360;
        const col = fills[i];
        return (
          <path key={i} d={wedgePath(cx, cy, r, start, end)}
            fill={col || T.paper} stroke={T.bg} strokeWidth={2}
            onClick={onCell ? () => onCell(i) : undefined}
            style={{ cursor: onCell ? 'pointer' : 'default', transition: 'fill 0.38s cubic-bezier(0.34, 1.1, 0.64, 1)', transitionDelay: col ? `${i * 35}ms` : '0ms' }}/>
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.ink3} strokeWidth={2}/>
    </svg>
  );
};

// Полоса: den ячеек, цвет из fills или пусто, с глянцем.
const FigBar = ({ den, fills, height = 40, onCell }) => (
  <div style={{ display: 'flex', width: '100%', height, borderRadius: 9, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
    {Array.from({ length: den }).map((_, i) => (
      <div key={i} className="fig-cell" onClick={onCell ? () => onCell(i) : undefined}
        style={{ flex: 1, position: 'relative', borderRight: i < den - 1 ? `2px solid ${T.bg}` : 'none', background: fills[i] || 'transparent', cursor: onCell ? 'pointer' : 'default', transitionDelay: fills[i] ? `${i * 35}ms` : '0ms' }}>
        {fills[i] && <span className="fig-shine"/>}
      </div>
    ))}
  </div>
);

// Круг + полоса вместе (на узком экране переносятся друг под друга).
const FracFigure = ({ den, fills, onCell, pieSize = 150, figRef }) => (
  <div ref={figRef} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 4vw, 38px)', width: '100%' }}>
    <FracPie den={den} fills={fills} size={pieSize} onCell={onCell}/>
    <div style={{ flex: '1 1 240px', minWidth: 200, maxWidth: 520 }}>
      <FigBar den={den} fills={fills} onCell={onCell}/>
    </div>
  </div>
);

// Подпись-формула из дробей: a/den + b/den (+ c/den) = sum. Нулевые слагаемые скрываются.
const FormulaLabel = ({ counts, den, showSum = true, colors = ADDEND_COLORS }) => {
  const shown = counts.map((n, i) => ({ n, c: colors[i] })).filter(x => x.n > 0);
  const sum = counts.reduce((s, n) => s + n, 0);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
      {shown.map((x, j) => (
        <React.Fragment key={j}>
          {j > 0 && <Op>+</Op>}
          <Frac n={String(x.n)} d={String(den)} size="mid" color={x.c}/>
        </React.Fragment>
      ))}
      {showSum && <><Op>=</Op>{sum === den ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>1</span> : <Frac n={String(sum)} d={String(den)} size="mid" color={T.success}/>}</>}
    </div>
  );
};

// Живая фигура для input-теста: заполняется на введённое число (его сумму-числитель).
// Цвет accent, пока решают; success + glow, когда верно. Ответ не подсказывает — рисует то, что ввели.
const LiveFillFigure = ({ den, value, solved }) => {
  const raw = parseInt(value, 10);
  const n = isNaN(raw) ? 0 : Math.max(0, Math.min(den, raw));
  const fills = buildFills([{ count: n, color: solved ? T.success : T.accent }], den);
  return (
    <div className={solved ? 'fig-glow fig-pulse' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
      <FracFigure den={den} fills={fills} pieSize={130}/>
      <span className={solved ? 'cell-pop' : undefined} style={{ display: 'inline-flex' }}>
        <Frac n={n > 0 ? String(n) : '?'} d={String(den)} size="mid" color={solved ? T.success : (n > 0 ? T.accent : T.ink3)}/>
      </span>
    </div>
  );
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
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
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);
// ============================================================
// s8 — ТАСНИФЛАШ (CLASSIFY) 3 savat: yig'indi butundan kichik / teng / katta.
// Kartalar CONTENT.s8.cards dan; tartib har seansda random (Fisher-Yates, useState init).
// ============================================================
const SUM_BINS = [{ key: 'lt' }, { key: 'eq' }, { key: 'gt' }];

const ClassifySum = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const [deck] = useState(() => { const a = c.cards.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; });
  const n = deck.length;
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const allPlaced = () => { const o = {}; deck.forEach((cd, i) => { o[i] = cd.bin; }); return o; };
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? allPlaced() : {}));
  const [done, setDone] = useState(wasSolved);
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(null);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvancedRef = useRef(wasSolved);
  const advRef = useRef(null); const flashRef = useRef(null);
  const cur = idx < n ? deck[idx] : null;
  const binLabel = (key) => key === 'lt' ? c.bin_lt : (key === 'eq' ? c.bin_eq : c.bin_gt);
  const sayCard = (cd) => { if (!audio.muted && cd && cd.say) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(cd.say[lang]); } };
  const finish = (fts) => {
    setDone(true);
    const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: deck.map(cd => cd.bin).join(','), studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
    if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }
  };
  const tapBin = (bin) => {
    if (done || !cur) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const correct = bin === cur.bin;
    if (firstTryRef.current[idx] === undefined) firstTryRef.current[idx] = correct;
    if (correct) {
      setHint(false); setPlaced(p => ({ ...p, [idx]: bin })); sfx.playCorrect();
      const snap = firstTryRef.current.slice();
      advRef.current = setTimeout(() => { if (idx + 1 < n) { const ni = idx + 1; setIdx(ni); sayCard(deck[ni]); } else { setIdx(n); finish(snap); } }, 480);
    } else {
      sfx.playWrong(); setHint(true);
      setFlash(bin); if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => () => { if (advRef.current) clearTimeout(advRef.current); if (flashRef.current) clearTimeout(flashRef.current); }, []);
  const inBin = (bin) => deck.map((cd, i) => i).filter(i => placed[i] === bin);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {deck.map((_, i) => <span key={i} className={`seq-dot${(i < idx || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        <div className="sort-tray fade-up delay-1">
          {done
            ? <span className="sort-tray-card" style={{ color: T.success }} aria-hidden="true">✓</span>
            : <><span className="sort-tray-card" key={idx}>{mt(cur.expr)}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins sort-bins-3 fade-up delay-2">
          {SUM_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h">{mt(t(binLabel(b.key)))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{mt(deck[i].expr)}</span>)}
              </span>
            </button>
          ))}
        </div>
        {hint && !done && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};
// ============================================================
// SeqMC — ketma-ket tez MC (tap). Веди-до-верного. Опции — дроби (mt).
// ============================================================
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
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
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(10px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {scored ? (
                <>
                  <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? "qo'sh:" : 'сложи:'}</span>
                  <div className="dm-prob">{mt(tx(q.q))}</div>
                </>
              ) : (
                <h3 className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(tx(q.q))}</h3>
              )}
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(18px, 3.4vw, 24px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    {mt(tx(o))}
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
// SCREEN-КОМПОНЕНТЫ (по экранам)
// ============================================================

// s0 — HOOK: 3/5 + 1/5 = 4/10 — ошибка? (центрируется, picked сбрасывается)
// Fakt-badgelar (FB_IT/FB_SCI/FB_HIST infra'da; bu darsga musiqa va vaqt qo'shildi).
const FB_MUS  = { ru: 'Знаешь ли ты? · Музыка', uz: "Bilasizmi? · Musiqa" };
const FB_TIME = { ru: 'Знаешь ли ты? · Время',  uz: "Bilasizmi? · Vaqt" };

// ============================================================
// s0 — HOOK: sharbat quyilishi (2/6 + 3/6). Konseptual «nega?», tuzoq 5/12.
// picked TO'LIQ toza (useState(null)); javobdan keyin reveal ko'rinadi, hook yopilmaydi.
// ============================================================
const JuicePour = () => (
  <div className="jp" aria-hidden="true">
    <div className="jp-col">
      <div className="jp-glass"><span className="jp-liq" style={{ height: '33%' }}/></div>
      <span className="jp-cap"><Frac n="2" d="6" size="sm" color={T.accent}/></span>
    </div>
    <span className="jp-plus">+</span>
    <div className="jp-col">
      <div className="jp-glass"><span className="jp-liq" style={{ height: '50%' }}/></div>
      <span className="jp-cap"><Frac n="3" d="6" size="sm" color={T.blue}/></span>
    </div>
    <span className="jp-arrow">{'→'}</span>
    <div className="jp-col">
      <div className="jp-glass jp-target">
        <span className="jp-stream jp-stream-a"/><span className="jp-stream jp-stream-b"/>
        <span className="jp-liq jp-liq-fill"/>
      </div>
      <span className="jp-cap"><span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 26px)', color: T.accent }}>?</span></span>
    </div>
  </div>
);

const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: screen, question: c.title[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 16px)' }}>
        <Floaters/>
        <h1 className="title h-title fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}><JuicePour/></div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          {opts.map((o, i) => {
            const isPicked = picked === i;
            let cls = 'option';
            if (isPicked) cls += i === 0 ? ' option-correct' : ' option-picked-wrong';
            return (
              <button key={i} className={cls} disabled={picked !== null} onClick={() => pick(i)}
                style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(18px, 3.4vw, 24px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mt(t(o))}
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={picked === 0} wrongClass="frame-tip">
          <p className="body" style={{ margin: 0 }}>{mt(picked !== null ? t(reveals[picked]) : '')}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s1 — WARMUP: 5 oson savol (prerekvizit recall), scored=false.
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;

// ============================================================
// s2 — EXPLORATION step (bar+doira): 2/6 + 3/6 = 5/6, qadam-baqadam to'ladi.
// ============================================================
const StepBarExplore = ({ c, screen, onNext, onPrev, den, lines, countsByStep, sumStep }) => {
  const lang = useLang(); const t = useT();
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `se${screen}_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const counts = countsByStep[Math.min(step, countsByStep.length - 1)];
  const fills = buildFills([{ count: counts[0], color: T.accent }, { count: counts[1], color: T.blue }], den);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? (lang === 'uz' ? 'Keyingi qadam' : 'Дальше') : <NextLabel/>} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: '6px 0 0', color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 190, justifyContent: 'center' }}>
          <FracFigure den={den} fills={fills} pieSize={130}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', maxWidth: 480 }}>{mt(t(lines[Math.min(step, lines.length - 1)]))}</p>
          {step >= sumStep && <FormulaLabel counts={countsByStep[countsByStep.length - 1]} den={den}/>}
        </div>
      </div>
    </Stage>
  );
};
const Screen2 = (props) => <StepBarExplore {...props} c={CONTENT.s2} den={6} lines={[CONTENT.s2.line_intro, CONTENT.s2.line_first, CONTENT.s2.line_second, CONTENT.s2.line_count, CONTENT.s2.line_key]} countsByStep={[[0, 0], [2, 0], [2, 3], [2, 3], [2, 3]]} sumStep={3}/>;

// ============================================================
// s3 — EXPLORATION interaktiv: +/- bilan ikki suratni o'zgartirib, jonli yig'indi (den=7).
// ============================================================
const S3Interactive = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3; const den = 7;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [a, setA] = useState(2); const [b, setB] = useState(3); const [touched, setTouched] = useState(false);
  const setAv = (v) => { const nv = Math.max(0, Math.min(den - b, v)); setA(nv); setTouched(true); };
  const setBv = (v) => { const nv = Math.max(0, Math.min(den - a, v)); setB(nv); setTouched(true); };
  const fills = buildFills([{ count: a, color: T.accent }, { count: b, color: T.blue }], den);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  const Stepper = ({ value, on, color, label }) => (
    <div className="num-stepper">
      <span className="num-stepper-lbl" style={{ color }}>{mt(t(label))}</span>
      <div className="num-stepper-row">
        <button className="step-btn" disabled={value <= 0} onClick={() => on(value - 1)} aria-label="minus">{'−'}</button>
        <span className="num-stepper-val" style={{ color }}><Frac n={String(value)} d={String(den)} size="sm" color={color}/></span>
        <button className="step-btn" disabled={a + b >= den} onClick={() => on(value + 1)} aria-label="plus">+</button>
      </div>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.4vw, 16px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: '6px 0 0', color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <FracFigure den={den} fills={fills} pieSize={130}/>
          <FormulaLabel counts={[a, b]} den={den}/>
          <div style={{ display: 'flex', gap: 'clamp(16px, 5vw, 40px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Stepper value={a} on={setAv} color={T.accent} label={c.leg_a}/>
            <Stepper value={b} on={setBv} color={T.blue} label={c.leg_b}/>
          </div>
        </div>
        <p className="bridge fade-up delay-2" style={{ position: 'relative', margin: 0 }}>{mt(t(touched ? c.instr_done : c.instr))}</p>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.note_rule))}</p></div>
      </div>
    </Stage>
  );
};
const Screen3 = (props) => <S3Interactive {...props}/>;

// s4 — RULE: suratlarni qo'shamiz, maxraj o'zgarmaydi. (top-align + Bridge)
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.heading))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{t(c.rule_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>01</span><p className="body" style={{ margin: 0 }}>{mt(t(c.rule_1))}</p></div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>02</span><p className="body" style={{ margin: 0 }}>{mt(t(c.rule_2))}</p></div>
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="eyebrow" style={{ color: T.success, margin: 0 }}>{t(c.ex_label)}</p>
          <FormulaLabel counts={[2, 3]} den={6}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.ex_caption))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 TUZOQ (pale-yellow): maxrajlar qo'shilmaydi (5/6 emas 5/12).
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: '#A07D14' }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.heading))}</h2>
        </div>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn_1))}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ color: T.success, display: 'inline-flex' }}><IconOk/></span>
                <Frac n="2" d="6" size="mid"/><Op>+</Op><Frac n="3" d="6" size="mid"/><Op>=</Op><Frac n="5" d="6" size="mid" color={T.success}/>
              </span>
              <span className="small" style={{ color: T.success, fontWeight: 600 }}>{t(c.ok_note)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ color: T.accent, display: 'inline-flex' }}><IconNo/></span>
                <Frac n="2" d="6" size="mid"/><Op>+</Op><Frac n="3" d="6" size="mid"/><Op>=</Op><Frac n="5" d="12" size="mid" color={T.accent}/>
              </span>
              <span className="small" style={{ color: T.accent, fontWeight: 700 }}>{t(c.bad_cause)}</span>
              <span className="small" style={{ color: T.ink2 }}>{t(c.bad_note)}</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(180, 138, 30, 0.3)' }}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn_2))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST MC: 2/7 + 4/7 (qo'shiluvchi-polosalar). FactCard musiqa.
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 0, 2, 3]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  const figure = () => (
    <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="2" d="7" size="sm"/></div><div style={{ flex: 1 }}><FigBar den={7} fills={buildFills([{ count: 2, color: T.accent }], 7)}/></div></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="4" d="7" size="sm" color={T.blue}/></div><div style={{ flex: 1 }}><FigBar den={7} fills={buildFills([{ count: 4, color: T.blue }], 7)}/></div></div>
    </div>
  );
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} bigOptions factOnCorrect={<FactCard text={c.fact} badge={FB_MUS} anim={<AnimShares/>}/>}/>;
};

// s7 — TEST error-spotting: qaysi yozuv noto'g'ri (correct old idx 2). FactCard vaqt.
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_TIME} anim={<AnimJars/>}/>}/>;
};

// s8 — TEST tasniflash (3 savat).
const Screen8 = (props) => <ClassifySum {...props}/>;

// s9 — TEST fill-blank: 3/8 + 2/8 = ?/8, surat teriladi (den=8, javob 5).
const Screen9 = (props) => (
  <NumInputScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={CONTENT.s9} correctValue={5}
    renderVisual={({ value, solved }) => <LiveFillFigure den={8} value={value} solved={solved}/>}/>
);

// s10 — TEST: 7 misol oson→qiyin (tap, scored).
const Screen10 = (props) => <SeqMC {...props} screenContent={CONTENT.s10} scored={true}/>;

// s11 — CASE final: Behruz, fayl yuklash 1/8 + 3/8. FactCard internet.
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)], 0, [1, 2, 0, 3]);
  const question = (
    <>
      <Bridge node={c.bridge}/>
      <h2 className="title h-title" style={{ marginTop: 8, marginBottom: 6 }}>{mt(t(c.title))}</h2>
      <div className="frame-tip" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
        <p className="body" style={{ margin: 0 }}>{mt(t(c.lead))}</p>
        <p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
      <h3 className="title h-sub" style={{ margin: 0 }}>{mt(t(c.question))}</h3>
    </>
  );
  const figure = () => (
    <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="1" d="8" size="sm"/></div><div style={{ flex: 1 }}><FigBar den={8} fills={buildFills([{ count: 1, color: T.accent }], 8)}/></div></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="8" size="sm" color={T.blue}/></div><div style={{ flex: 1 }}><FigBar den={8} fills={buildFills([{ count: 3, color: T.blue }], 8)}/></div></div>
    </div>
  );
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} bigOptions factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimUpload/>}/>}/>;
};

// s12 — SUMMARY: hisob + «Главное»; hookni yopadi; finishLesson bir marta. (top-align)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
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
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.success }}>{t(c.heading)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{scoreCorrect} / {scoreTotal}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_caption)}</span>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FormulaLabel counts={[2, 3]} den={6}/>
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
export default function FractionAddSameDenLesson({
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

// ============================================================
// CSS-БЛОК (STYLES) — визуальный язык v15 из infrastructure_v1 + math-дополнения
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
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(17px, 2.5vw, 18px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
/* HOOK jonli animatsiya (uzluksiz bezakli harakat — Dars01 uslubiga monand) */
.hook-alive { position: relative; overflow: hidden; }
.hook-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit; animation: hookGlow 3.4s ease-in-out infinite; }
.hook-sheen { position: absolute; top: 0; bottom: 0; left: 0; width: 45%; pointer-events: none; z-index: 2; background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translateX(-110%); animation: hookSheen 3.4s ease-in-out infinite; }
@keyframes hookSheen { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(240%); } }
@keyframes hookGlow { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255, 79, 40, 0); } 50% { box-shadow: inset 0 0 26px 2px rgba(255, 79, 40, 0.10); } }
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

/* MATH: сравнение разных знаменателей — приведение к общим долям (frac_5_07). */
.cp-row { animation: cpRowIn 0.42s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpRowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.cp-grow { animation: cpGrow 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpGrow { from { width: 0; } }
/* линии сетки въезжают слева направо (деление на общие доли) */
.cp-line { animation: cpLineIn 0.32s ease-out backwards; transform-origin: center top; }
@keyframes cpLineIn { from { opacity: 0; transform: scaleY(0.1); } to { opacity: 1; transform: scaleY(1); } }
.cp-marker { animation: cpMarkerIn 0.3s ease-out backwards; }
@keyframes cpMarkerIn { from { opacity: 0; } }
.cp-slide { animation: cpSlide 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpSlide { from { left: 0; } }
.cp-flag { transform-origin: bottom left; animation: cpFlagPop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) 0.45s backwards, cpFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cpFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cpFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
/* ориентир 1/2 въезжает к центру; точки-дроби мягко появляются */
.cp-half-in { animation: cpHalfIn 0.55s cubic-bezier(0.34, 1.1, 0.64, 1) backwards; }
@keyframes cpHalfIn { from { left: 0; opacity: 0; } }
.cp-dot-wrap { animation: cpDotIn 0.35s ease-out backwards; }
@keyframes cpDotIn { from { opacity: 0; } }
/* MATH: сокращение — слияние долей, счётчик, лесенка деления (frac_5_08). */
.cp-merge { animation: cpMerge 0.5s ease forwards; }
@keyframes cpMerge { from { opacity: 1; } to { opacity: 0; } }
.cp-spin { animation: cpSpin 0.4s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes cpSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.cp-ladder-step { animation: cpLadderIn 0.4s ease-out backwards; }
@keyframes cpLadderIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }

/* MATH frac_5_09: круг+полоса фигура, интерактивные доли, drag-чипы. */
.fig-cell { transition: background 0.38s cubic-bezier(0.34, 1.1, 0.64, 1); }
.fig-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
.chip {
  font-family: 'JetBrains Mono', monospace; font-weight: 600;
  border: none; border-radius: 10px; cursor: grab; color: #FFFFFF;
  box-shadow: 0 6px 16px -5px rgba(58, 53, 48, 0.42);
  touch-action: none; user-select: none; -webkit-user-select: none;
  transition: box-shadow 0.2s, filter 0.2s;
}
.chip:hover { filter: brightness(1.06); box-shadow: 0 9px 22px -5px rgba(58, 53, 48, 0.5); }
.chip:active { cursor: grabbing; }
.chip-pop { animation: chipPop 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) backwards; }
@keyframes chipPop { from { opacity: 0; transform: scale(0.5); } }
.fig-glow { animation: figGlow 0.7s ease; }
@keyframes figGlow {
  0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); }
  50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); }
  100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); }
}
.fig-pulse { animation: figPulse 0.55s cubic-bezier(0.34, 1.4, 0.64, 1); }
@keyframes figPulse { 0% { transform: scale(1); } 35% { transform: scale(1.06); } 100% { transform: scale(1); } }

/* MATH: FactCard — fakt to'g'ri javobdan keyin (ko'k tema). */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
/* Tarix (meros/hosil ulushlari): yettita ulush to'lqin bo'lib yonib, butunni yig'adi. */
.fa-sh { display: flex; gap: 3px; width: clamp(92px, 18vw, 120px); align-items: flex-end; height: clamp(40px, 9vw, 56px); }
.fa-sh-c { flex: 1; height: 100%; background: #019ACB; opacity: 0.16; border-radius: 3px; transform-origin: bottom; animation: faSh 2.6s ease-in-out infinite; }
@keyframes faSh { 0%, 100% { opacity: 0.16; transform: scaleY(0.55); } 45% { opacity: 0.92; transform: scaleY(1); } }
/* Fan (bir xil stakanlar): ikki idish ulushma-ulush pastdan to'ladi. */
.fa-jars { display: flex; align-items: flex-end; gap: 6px; }
.fa-jar { display: flex; flex-direction: column-reverse; gap: 3px; width: clamp(26px, 5.5vw, 34px); height: clamp(54px, 11vw, 72px); padding: 3px; border: 2px solid #019ACB; border-radius: 4px 4px 8px 8px; }
.fa-jar-c { flex: 1; background: #019ACB; opacity: 0.18; border-radius: 2px; animation: faJar 3s ease-in-out infinite; }
.fa-jar-plus { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #019ACB; font-size: clamp(14px, 3vw, 18px); padding-bottom: clamp(18px, 4vw, 26px); }
@keyframes faJar { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; } }
/* IT (yuklash bo'laklari): segmentlar ketma-ket qo'shilib 100% bo'ladi. */
.fa-up { display: flex; flex-direction: column; gap: 7px; width: clamp(92px, 18vw, 122px); align-items: center; }
.fa-up-bar { display: flex; gap: 3px; width: 100%; height: clamp(16px, 3.6vw, 22px); }
.fa-up-seg { flex: 1; background: #019ACB; opacity: 0.16; border-radius: 3px; animation: faUp 2.4s ease-in-out infinite; }
.fa-up-pct { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px, 2.2vw, 13px); color: #019ACB; animation: faUpPct 2.4s ease-in-out infinite; }
@keyframes faUp { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.92; } }
@keyframes faUpPct { 0%, 70% { opacity: 0.3; } 90%, 100% { opacity: 1; } }

/* MATH: ketma-ket misol — nuqtali progress + katta масала. */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }

/* MATH: tasniflash (sort) — tray + savatlar. */
.sort-tray { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 16px; padding: clamp(13px, 2.5vw, 18px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); min-height: clamp(84px, 15vw, 100px); }
.sort-tray-card { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px, 5.4vw, 36px); color: #0E0E10; animation: sort-pop 0.4s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes sort-pop { 0% { opacity: 0; transform: translateY(-8px) scale(0.8); } 100% { opacity: 1; transform: none; } }
.sort-tray-ask { font-size: clamp(12px, 1.6vw, 13px); color: #5A5A60; }
.sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2vw, 14px); }
.sort-bin { display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border: none; border-radius: 16px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.16); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease; min-height: clamp(94px, 17vw, 116px); text-align: left; }
.sort-bin:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 28px -6px rgba(58, 53, 48, 0.24); }
.sort-bin:disabled { cursor: default; }
.sort-bin-h { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); padding: 5px 10px; border-radius: 9px; }
.sort-bin-sq .sort-bin-h { color: #1F7A4D; background: #E3F0E8; }
.sort-bin-cu .sort-bin-h { color: #5A5A60; background: #EFEEE9; }
.sort-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sort-chip-in { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.8vw, 14px); color: #1F7A4D; background: #E3F0E8; border-radius: 9px; padding: 5px 9px; animation: sort-pop 0.35s ease both; }
.sort-bin-bad { animation: odShake 0.4s ease; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 22px -6px rgba(255, 79, 40, 0.3); }
@keyframes odShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

/* MATH: bridge — qadamlararo bog'lovchi satr. */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* Accessibility: prefers-reduced-motion — gasim dekorativ sikllarni. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

/* === AMBIENT FLOATERS (har ekranda yengil uzluksiz harakat — fonда) === */
.amb { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.amb-o { position: absolute; border-radius: 50%; background: radial-gradient(circle at 35% 30%, rgba(255, 79, 40, 0.12), rgba(255, 79, 40, 0) 70%); will-change: transform; }
.amb-o1 { width: clamp(120px, 26vw, 220px); height: clamp(120px, 26vw, 220px); top: -4%; right: -6%; animation: ambFloatA 17s ease-in-out infinite; }
.amb-o2 { width: clamp(90px, 20vw, 170px); height: clamp(90px, 20vw, 170px); bottom: 2%; left: -7%; background: radial-gradient(circle at 35% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0) 70%); animation: ambFloatB 21s ease-in-out infinite; }
.amb-o3 { width: clamp(70px, 14vw, 120px); height: clamp(70px, 14vw, 120px); top: 38%; left: 44%; background: radial-gradient(circle at 35% 30%, rgba(31, 122, 77, 0.08), rgba(31, 122, 77, 0) 70%); animation: ambFloatC 25s ease-in-out infinite; }
@keyframes ambFloatA { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-18px, 22px); } }
@keyframes ambFloatB { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(22px, -16px); } }
@keyframes ambFloatC { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(14px, 18px) scale(1.08); } }

/* === HOOK: sharbat quyilishi (s0) === */
.jp { display: flex; align-items: flex-end; justify-content: center; gap: clamp(8px, 2.6vw, 22px); }
.jp-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.jp-glass { position: relative; width: clamp(40px, 10vw, 58px); height: clamp(62px, 15vw, 90px); border: 2.5px solid #019ACB; border-top: none; border-radius: 4px 4px 11px 11px; overflow: hidden; background: rgba(1, 154, 203, 0.05); }
.jp-liq { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, #FF8A5C, #FF4F28); }
.jp-liq::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: rgba(255, 255, 255, 0.4); }
.jp-cap { line-height: 1; }
.jp-plus, .jp-arrow { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #019ACB; font-size: clamp(15px, 3.2vw, 21px); padding-bottom: clamp(26px, 6vw, 40px); }
.jp-target .jp-liq-fill { height: 0; animation: jpFill 4.6s ease-in-out infinite; }
@keyframes jpFill { 0%, 6% { height: 0; } 36%, 70% { height: 83%; } 92%, 100% { height: 0; } }
.jp-stream { position: absolute; top: -4px; width: 3px; height: 0; background: #FF6A3D; border-radius: 2px; opacity: 0; }
.jp-stream-a { left: 32%; animation: jpStream 4.6s ease-in-out infinite; }
.jp-stream-b { left: 60%; animation: jpStream 4.6s ease-in-out infinite 0.25s; }
@keyframes jpStream { 0%, 8% { height: 0; opacity: 0; } 14%, 52% { height: 58%; opacity: 0.85; } 64%, 100% { height: 0; opacity: 0; } }

/* === CLASSIFY 3 savat (s8) === */
.sort-bins-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sort-bin-lt .sort-bin-h { color: #019ACB; background: #EAF6FB; }
.sort-bin-eq .sort-bin-h { color: #1F7A4D; background: #E3F0E8; }
.sort-bin-gt .sort-bin-h { color: #FF4F28; background: #FFE8E1; }

/* === NUM STEPPER +/- (s3 interaktiv) === */
.num-stepper { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.num-stepper-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px, 1.6vw, 13px); }
.num-stepper-row { display: flex; align-items: center; gap: 12px; }
.num-stepper-val { display: inline-flex; min-width: 36px; justify-content: center; }
.step-btn { width: clamp(34px, 7vw, 40px); height: clamp(34px, 7vw, 40px); border-radius: 50%; border: none; background: #FFFFFF; color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3vw, 22px); cursor: pointer; box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.32); transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.step-btn:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 9px 20px -6px rgba(255, 79, 40, 0.5); }
.step-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
`;
