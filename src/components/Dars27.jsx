import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Нахождение числа по проценту — perc_5_03 (Dars27)
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
// --- POD UROK: perc_5_03 — Foizi bo'yicha sonni topish / Нахождение числа по проценту (PROMPT 2026-06-15) ---
// Markaziy misconception M1: berilgan QISMni butun deb olish ("20% = 10 bo'lsa, butun 10").
// M2: qismni foizga KO'PAYTIRISH yoki noto'g'ri songa bo'lish (to'g'risi: qism / foiz x 100).
// Asosiy usul: foiz qaysi ulush ekanini top, qismni shuncha marta ko'paytir (20% = beshdan bir -> x5);
// yordamchi (har qanday foiz): butun = qism / foiz x 100. Vizualizator RevBar (butun = ?, qismdan
// tiklanadi) + MapHook (yirtilgan xarita loop). SYUJET: KVEST "Yo'qolgan xaritani tikla" — har
// darvoza ma'lum bo'lak (qism + foiz) bo'yicha butun xaritani topib ochiladi. Test turlari (interaktiv
// urg'u): warm-up MC / MC / NumInput / tap-match (juftlash) / slider / number-line / find-the-wrong / MC.
// Hook: Oybek (xaritani 10 katak deb adashadi), Dilnoza (shubha); case: Iroda (sinf so'rovnomasi).
// Faktlar: saylov teskari foizi / foiz belgisi (%) tarixi / diskont teskari hisobi — DRAFT, validatsiya kerak.
// UZ terminologiya (foizi bo'yicha topish, butun, ulush) — draft, o'zbek metodisti tasdig'i kerak.
// ============================================================

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'perc-5-03-v1',
  lessonTitle: { ru: 'Нахождение числа по проценту', uz: "Foizi bo'yicha sonni topish" }
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
  { id: 's10', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — Oybek: yirtilgan xarita bo'lagi = 20% = 10 katak; "xarita 10 katak" (M1). ----
  s0: {
    eyebrow: { ru: 'Загадка', uz: 'Topishmoq' },
    lead: {
      ru: 'Ойбек и Дилноза нашли старую карту, но она порвана. Уцелевший кусок — это 20% всей карты, и на нём 10 клеток. Ойбек говорит: «Значит, вся карта — 10 клеток!» Дилноза сомневается. Прав ли Ойбек?',
      uz: "Oybek va Dilnoza eski xarita topishdi, lekin u yirtilgan. Saqlanib qolgan bo'lak — butun xaritaning 20% i, va unda 10 katak bor. Oybek: «Demak, butun xarita — 10 katak!» — deydi. Dilnoza shubhalanadi. Oybek haqmi?"
    },
    opt0: { ru: 'Да, вся карта — 10 клеток', uz: "Ha, butun xarita — 10 katak" },
    opt1: { ru: 'Нет, вся карта больше', uz: "Yo'q, butun xarita kattaroq" },
    opt2: { ru: 'Так не определить', uz: "Bunday aniqlab bo'lmaydi" },
    reveal: {
      ru: 'Запомни свой ответ. В конце урока вернёмся к карте Ойбека.',
      uz: "Javobingizni eslab qoling. Dars oxirida Oybekning xaritasiga qaytamiz."
    },
    audio: {
      intro: {
        ru: 'Ойбек и Дилноза нашли старую порванную карту. Уцелевший кусок это двадцать процентов всей карты, и на нём десять клеток. Ойбек говорит, что вся карта десять клеток. Дилноза сомневается. Как думаешь, прав ли Ойбек?',
        uz: "Oybek va Dilnoza eski yirtilgan xarita topishdi. Saqlanib qolgan bo'lak butun xaritaning yigirma foizi, va unda o'n katak bor. Oybek butun xarita o'n katak deydi. Dilnoza shubhalanadi. Sizningcha, Oybek haqmi?"
      },
      on_correct: { ru: 'Хорошо. Разберёмся вместе.', uz: "Yaxshi. Birgalikda aniqlab olamiz." },
      on_wrong:   { ru: 'Хорошо. Разберёмся вместе.', uz: "Yaxshi. Birgalikda aniqlab olamiz." }
    }
  },

  // ---- s1 WARM-UP — perc_5_02 eslash (butundan foiz). correct '40' -> target B. ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    question: {
      ru: 'В прошлом уроке мы находили процент от целого. Быстрая проверка: чему равны 20% от 200?',
      uz: "O'tgan darsda butundan foizni topgandik. Tez tekshiruv: 200 ning 20% i nechta?"
    },
    opt0: { ru: '40', uz: '40' },
    opt1: { ru: '20', uz: '20' },
    opt2: { ru: '220', uz: '220' },
    opt3: { ru: '10', uz: '10' },
    correct_text: {
      ru: 'Верно. 1% от 200 = 2, значит 20% = 2 × 20 = 40. А сегодня — наоборот: по проценту найдём целое.',
      uz: "To'g'ri. 200 ning 1% i — 2, demak 20% = 2 x 20 = 40. Bugun esa teskari: foizdan butunni topamiz."
    },
    wrong_1: { ru: '20 — это само число процентов. 20% от 200: 1% = 2, значит 20% = 40.', uz: "20 — bu foiz raqamining o'zi. 200 ning 20% i: 1% = 2, demak 20% = 40." },
    wrong_2: { ru: 'Это сложение (200 + 20). При проценте умножаем: 1% = 2, 20% = 40.', uz: "Bu qo'shish bo'ldi (200 + 20). Foiz topishda ko'paytiramiz: 1% = 2, 20% = 40." },
    wrong_3: { ru: 'Это похоже на 5%. А 20% от 200: 1% = 2, значит 20% = 40.', uz: "Bu 5% ga o'xshaydi. 200 ning 20% i: 1% = 2, demak 20% = 40." },
    audio: {
      intro: {
        ru: 'Вспомним прошлый урок. Тогда мы находили процент от целого. Сколько будет двадцать процентов от двухсот? Выбери вариант.',
        uz: "O'tgan darsni eslaymiz. O'tgan safar butundan foizni topgandik. Ikki yuzning yigirma foizi nechta? Variantni tanlang."
      },
      on_correct: { ru: 'Верно. Сорок. А сегодня изучим обратное: процент известен, ищем целое.', uz: "To'g'ri. Qirq. Bugun esa teskarisini o'rganamiz: foiz ma'lum, butunni topamiz." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION 1 — tap-paced: 20% = 10 -> beshdan bir -> 5 nusxa = 50 ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: {
      ru: 'Вернёмся к карте. Кусок — это 20% карты, и на нём 10 клеток. 20% — это пятая часть. Значит вся карта в 5 раз больше куска. Нажимай и прикладывай куски один за другим.',
      uz: "Xaritaga qaytamiz. Bo'lak — bu xaritaning 20% i, va unda 10 katak. 20% — bu beshdan bir. Demak butun xarita bo'lakdan 5 marta katta. Bosing va bo'laklarni birin-ketin qo'shing."
    },
    btn_step: { ru: 'Приложить кусок', uz: "Bo'lak qo'shish" },
    cells: {
      ru: ['Один кусок — 10 клеток. Продолжай.', 'Два куска — 20 клеток.', 'Три куска — 30 клеток.', 'Четыре куска — 40 клеток.', 'Пять кусков — 50 клеток. Карта целая!'],
      uz: ["Bir bo'lak — 10 katak. Davom eting.", "Ikki bo'lak — 20 katak.", "Uch bo'lak — 30 katak.", "To'rt bo'lak — 40 katak.", "Besh bo'lak — 50 katak. Xarita to'liq!"]
    },
    note: {
      ru: 'Готово. 20% — это пятая часть, поэтому вся карта 5 × 10 = 50 клеток. Ойбек ошибался: 10 — это лишь один кусок.',
      uz: "Tayyor. 20% — bu beshdan bir, shuning uchun butun xarita 5 x 10 = 50 katak. Oybek adashgan edi: 10 — bu faqat bir bo'lak."
    },
    audio: {
      intro: {
        ru: 'Вернёмся к карте. Уцелевший кусок это двадцать процентов всей карты, на нём десять клеток. Двадцать процентов это пятая часть. Значит вся карта в пять раз больше куска. Нажми кнопку и прикладывай куски один за другим.',
        uz: "Xaritaga qaytamiz. Saqlangan bo'lak butun xaritaning yigirma foizi, unda o'n katak bor. Yigirma foiz — bu beshdan bir. Demak butun xarita bo'lakdan besh marta katta. Tugmani bosing va bo'laklarni birin-ketin qo'shing."
      },
      done: {
        ru: 'Пять кусков составляют всю карту. Десять умножить на пять это пятьдесят. Вот вся карта, а не десять клеток. Ойбек принял один кусок за целое и ошибся.',
        uz: "Besh bo'lak butun xaritani tashkil etadi. O'nni beshga ko'paytirsak, ellik chiqadi. Mana butun xarita, o'n katak emas. Oybek bir bo'lakni butun deb o'ylab adashdi."
      }
    }
  },

  // ---- s3 EXPLORATION 2 — jonli slayder: butunni top, 25% = 15 -> 60 ----
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: {
      ru: 'Теперь вторая карта. Кусок — это 25% всей карты, и на нём 15 клеток. Двигай ползунок: найди размер всей карты так, чтобы её 25% были 15 клеток.',
      uz: "Endi ikkinchi xarita. Bo'lak — bu butun xaritaning 25% i, va unda 15 katak. Slayderni suring: butun xarita o'lchamini toping, toki uning 25% i 15 katak bo'lsin."
    },
    hint_move: {
      ru: '25% — это четверть. Если четверть 15, то целое в четыре раза больше: 15 × 4 = 60.',
      uz: "25% — bu chorak. Agar chorak 15 bo'lsa, butun to'rt marta katta: 15 x 4 = 60."
    },
    note_full: {
      ru: 'Нашёл: вся карта 60 клеток. Её 25% — это 15, как раз клетки на куске.',
      uz: "Topdingiz: butun xarita 60 katak. Uning 25% i — 15, ya'ni bo'lakdagi kataklar soni."
    },
    audio: {
      ru: 'На второй карте кусок это двадцать пять процентов, на нём пятнадцать клеток. Двадцать пять процентов это четверть. Двигай ползунок и найди всю карту. Если четверть пятнадцать, то целое в четыре раза больше, то есть шестьдесят. Двадцать пять процентов от шестидесяти снова дают пятнадцать.',
      uz: "Ikkinchi xaritada bo'lak butun xaritaning yigirma besh foizi, unda o'n besh katak bor. Yigirma besh foiz — bu chorak. Slayderni suring va butun xaritani toping. Agar chorak o'n besh bo'lsa, butun to'rt marta katta, ya'ni oltmish. Oltmishning yigirma besh foizi yana o'n beshga teng bo'ladi."
    }
  },

  // ---- s4 RULE 1 — ikki usul ----
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    lead: {
      ru: 'Итак, если известны часть и процент, целое число можно найти двумя надёжными способами.',
      uz: "Demak, qism va foiz ma'lum bo'lsa, butun sonni ikki ishonchli usul bilan topish mumkin."
    },
    rule_main: { ru: 'Способ 1: пойми, какая это доля, и умножь часть во столько же раз', uz: "1-usul: foiz qaysi ulush ekanini toping, keyin qismni shuncha marta ko'paytiring" },
    ex_easy: { ru: 'Например: 20% — пятая часть, значит целое = часть × 5. 10 × 5 = 50.', uz: "Masalan: 20% — beshdan bir, demak butun = qism x 5. 10 x 5 = 50." },
    ex_hard: { ru: 'Способ 2 (для любого процента): целое = часть ÷ процент × 100. 10 ÷ 20 × 100 = 50.', uz: "2-usul (har qanday foiz uchun): butun = qism / foiz x 100. 10 / 20 x 100 = 50." },
    note: {
      ru: 'Оба способа дают одно и то же. Выбирай тот, что удобнее.',
      uz: "Ikkala usul bir xil natija beradi. Qaysi qulay bo'lsa, o'shani tanlang."
    },
    audio: {
      ru: 'Запомни два способа. Первый: пойми, какая это доля, и умножь часть во столько же раз. Двадцать процентов это пятая часть, значит умножаем часть на пять, десять на пять это пятьдесят. Второй способ подходит для любого процента: раздели часть на процент и умножь на сто. Десять разделить на двадцать и умножить на сто снова пятьдесят. Оба способа дают один ответ.',
      uz: "Ikki usulni eslab qoling. Birinchisi: foiz qaysi ulush ekanini toping, keyin qismni shuncha marta ko'paytiring. Yigirma foiz — beshdan bir, demak qismni beshga ko'paytiramiz, o'nni beshga ko'paytirsak ellik. Ikkinchi usul har qanday foiz uchun: qismni foizga bo'ling, keyin yuzga ko'paytiring. O'nni yigirmaga bo'lib yuzga ko'paytirsak, yana ellik. Ikkala usul bitta javob beradi."
    }
  },

  // ---- s5 RULE 2 — M1/M2 ogohlantirish (frame-tip) ----
  s5: {
    eyebrow: { ru: 'Важно', uz: 'Muhim' },
    lead: {
      ru: 'Но будь внимателен: данное число — это ЧАСТЬ, а не ответ.',
      uz: "Lekin ehtiyot bo'ling: berilgan son — bu QISM, javob emas."
    },
    point1: {
      ru: 'Если процент меньше 100, то целое всегда БОЛЬШЕ части.',
      uz: "Foiz 100 dan kichik bo'lsa, butun har doim qismdan KATTA bo'ladi."
    },
    point2: {
      ru: 'Если 20% = 10, то целое не 10, а 50. Ведь 10 — это лишь пятая часть.',
      uz: "Agar 20% = 10 bo'lsa, butun 10 emas — u 50. 10 — bu faqat beshdan bir."
    },
    point3: {
      ru: 'И не умножай часть на процент — дели. Умножение даёт не целое, а маленькое число.',
      uz: "Va qismni foizga ko'paytirmang — bo'ling. Ko'paytirish butunni emas, kichik sonni beradi."
    },
    audio: {
      ru: 'Главное предостережение. Данное число это часть, а не ответ. Если процент меньше ста, целое всегда больше части. Если двадцать процентов это десять, то целое не десять, а пятьдесят. И не умножай часть на процент, а дели. Иначе получишь не целое, а маленькое число.',
      uz: "Asosiy ogohlantirish. Berilgan son — bu qism, javob emas. Foiz yuzdan kichik bo'lsa, butun doim qismdan katta. Agar yigirma foiz o'nga teng bo'lsa, butun o'n emas, ellik. Va qismni foizga ko'paytirmang, bo'ling. Aks holda butunni emas, kichik sonni olasiz."
    }
  },

  // ---- s6 TEST MC — 30% = 60 -> 200. + FAKT A (saylov). correct '200' -> target C ----
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    lead: {
      ru: 'Теперь сам. Новый кусок — это 30% всей карты, и на нём 60 клеток. Сколько клеток во всей карте?',
      uz: "Endi o'zingiz. Yangi bo'lak — bu butun xaritaning 30% i, va unda 60 katak. Butun xaritada nechta katak?"
    },
    opt0: { ru: '200', uz: '200' },
    opt1: { ru: '60',  uz: '60' },
    opt2: { ru: '90',  uz: '90' },
    opt3: { ru: '1800', uz: '1800' },
    correct_text: {
      ru: 'Верно. 60 — это 30%. 1%: 60 ÷ 30 = 2. Сто процентов: 2 × 100 = 200 клеток.',
      uz: "To'g'ri. 60 — bu 30%. 1%: 60 / 30 = 2. Yuz foiz: 2 x 100 = 200 katak."
    },
    wrong_1: { ru: '60 — это данная ЧАСТЬ (30%), а не целое. Целое больше: 60 ÷ 30 × 100 = 200.', uz: "60 — bu berilgan QISM (30%), butun emas. Butun kattaroq: 60 / 30 x 100 = 200." },
    wrong_2: { ru: 'Тут к 60 прибавили 30. Не сложение: найди 1% (60 ÷ 30 = 2), потом × 100 = 200.', uz: "Bu yerda 60 ga 30 ni qo'shgansiz. Qo'shish emas: 1% ni toping (60 / 30 = 2), keyin x 100 = 200." },
    wrong_3: { ru: 'Ты умножил часть на процент (60 × 30). Наоборот — дели: 60 ÷ 30 = 2, потом × 100 = 200.', uz: "Qismni foizga ko'paytirdingiz (60 x 30). Aksincha — bo'ling: 60 / 30 = 2, keyin x 100 = 200." },
    fact: {
      ru: 'На выборах, когда подсчитана часть голосов, по проценту обратно находят, сколько всего проголосовало. Поэтому обратный процент важен в статистике.',
      uz: "Saylovda ovozlarning bir qismi sanalganda, foiz orqali teskari hisoblab jami nechta odam ovoz berganini topishadi. Shuning uchun teskari foiz statistikada muhim."
    },
    audio: {
      intro: {
        ru: 'Новый кусок это тридцать процентов всей карты, на нём шестьдесят клеток. Сколько клеток во всей карте? Сначала найди один процент, потом умножь на сто. Выбери ответ.',
        uz: "Yangi bo'lak butun xaritaning o'ttiz foizi, unda oltmish katak. Butun xaritada nechta katak? Avval bir foizni toping, keyin yuzga ko'paytiring. Javobni tanlang."
      },
      on_correct: {
        ru: 'Верно, двести клеток. Кстати, на выборах по части подсчитанных голосов обратным процентом находят, сколько всего проголосовало.',
        uz: "To'g'ri, ikki yuz katak. Aytgancha, saylovda sanalgan ovozlarning bir qismidan teskari foiz bilan jami nechta odam ovoz berganini topishadi."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s7 TEST NumInput — 50% = 35 -> 70 ----
  s7: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    question: {
      ru: 'Кусок — это 50% карты, и на нём 35 клеток. Сколько клеток во всей карте?',
      uz: "Bo'lak — bu xaritaning 50% i, va unda 35 katak. Butun xarita necha katak?"
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: '50% — это половина. Если половина 35, то целое вдвое больше: 35 × 2 = 70.',
      uz: "50% — bu yarmi. Agar yarmi 35 bo'lsa, butun ikki barobar: 35 x 2 = 70."
    },
    fb_correct: { ru: 'Верно. 50% — половина, целое 35 × 2 = 70 клеток.', uz: "To'g'ri. 50% — yarmi, butun 35 x 2 = 70 katak." },
    audio: {
      intro: {
        ru: 'Кусок это пятьдесят процентов карты, на нём тридцать пять клеток. Сколько клеток во всей карте? Пятьдесят процентов это половина, значит целое вдвое больше. Введи число.',
        uz: "Bo'lak xaritaning ellik foizi, unda o'ttiz besh katak. Butun xarita necha katak? Ellik foiz — bu yarmi, demak butun ikki barobar. Sonni kiriting."
      },
      on_correct: { ru: 'Верно. Семьдесят.', uz: "To'g'ri. Yetmish." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s8 TEST TAP-MATCH — bir xil qism (12), har xil foiz -> har xil butun. M2 sindiradi ----
  s8: {
    eyebrow: { ru: 'Соедини', uz: 'Juftlang' },
    lead: {
      ru: 'У каждого куска свой процент, но клеток поровну — по 12. Выбери число снизу и нажми на нужный кусок, чтобы соединить с размером всей карты.',
      uz: "Har bo'lakda foiz har xil, lekin kataklar teng — har birida 12 ta. Pastdan sonni tanlang va kerakli bo'lakni bosing — butun xarita o'lchamiga ulang."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    clues: [
      { id: 'c1', label: { ru: '20% = 12 клеток', uz: '20% = 12 katak' }, answer: '60',
        hint: { ru: '20% — пятая часть: 12 × 5 = 60.', uz: "20% — beshdan bir: 12 x 5 = 60." } },
      { id: 'c2', label: { ru: '25% = 12 клеток', uz: '25% = 12 katak' }, answer: '48',
        hint: { ru: '25% — четверть: 12 × 4 = 48.', uz: "25% — chorak: 12 x 4 = 48." } },
      { id: 'c3', label: { ru: '50% = 12 клеток', uz: '50% = 12 katak' }, answer: '24',
        hint: { ru: '50% — половина: 12 × 2 = 24.', uz: "50% — yarmi: 12 x 2 = 24." } }
    ],
    chips: { ru: ['24', '48', '60'], uz: ['24', '48', '60'] },
    fb_correct: {
      ru: 'Верно. Часть одна и та же — 12, а целое разное: чем меньше процент, тем больше карта.',
      uz: "To'g'ri. Qism bir xil — 12, butun esa har xil: foiz qancha kichik bo'lsa, xarita shuncha katta."
    },
    audio: {
      intro: {
        ru: 'На каждом куске по двенадцать клеток, но проценты разные. Соедини каждый кусок с размером всей карты, потом нажми проверить.',
        uz: "Har bo'lakda o'n ikki katak, lekin foizlar har xil. Har bo'lakni butun xarita o'lchamiga ulang, keyin tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Часть одинакова, но при меньшем проценте целое больше.', uz: "To'g'ri. Qism bir xil bo'lsa ham, foiz kichraysa, butun kattalashadi." },
      on_wrong:   { ru: 'Пока не всё верно. Посмотри подсказки.', uz: "Hozircha hammasi to'g'ri emas. Maslahatlarga qarang." }
    }
  },

  // ---- s9 TEST SLIDER — butunni top: 40% = 20 -> 50 ----
  s9: {
    eyebrow: { ru: 'Найди целое', uz: 'Butunni toping' },
    lead: {
      ru: 'Новый кусок — это 40% карты, на нём 20 клеток. Двигай ползунок: найди, сколько клеток во всей карте (чтобы её 40% были 20).',
      uz: "Yangi bo'lak — bu xaritaning 40% i, va unda 20 katak. Slayderni suring: butun xarita necha katak ekanini toping (uning 40% i 20 bo'lsin)."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: '40% — это две пятых. Раздели 20 на 2 — это пятая часть, 10. Теперь 10 × 5 = 50.',
      uz: "40% — bu beshdan ikki. 20 ni 2 ga bo'ling — beshdan bir, ya'ni 10. Endi 10 ni 5 ga ko'paytiring — 50."
    },
    fb_correct: { ru: 'Верно. Вся карта 50 клеток: её 40% — 20.', uz: "To'g'ri. Butun xarita 50 katak: uning 40% i — 20." },
    audio: {
      intro: {
        ru: 'Новый кусок это сорок процентов карты, на нём двадцать клеток. Двигай ползунок и найди всю карту. Сначала посчитай в уме, потом поставь маркер и нажми проверить.',
        uz: "Yangi bo'lak xaritaning qirq foizi, unda yigirma katak bor. Slayderni suring va butun xaritani toping. Avval xayolan hisoblang, keyin markerni qo'ying va tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Пятьдесят.', uz: "To'g'ri. Ellik." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s10 TEST NUMBER-LINE — butunni qo'y: 60% = 30 -> 50 (chiziq 0..100) ----
  s10: {
    eyebrow: { ru: 'Отметь на прямой', uz: "Son o'qida belgilang" },
    lead: {
      ru: 'Последний кусок — это 60% карты, на нём 30 клеток. Сколько клеток во всей карте? Поставь маркер на это число.',
      uz: "Oxirgi bo'lak — bu xaritaning 60% i, va unda 30 katak. Butun xarita necha katak? Markerni shu songa qo'ying."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: '60% — это шесть десятых. Раздели 30 на 6 — десятая часть, 5. Теперь 5 × 10 = 50.',
      uz: "60% — bu o'ndan olti. 30 ni 6 ga bo'ling — o'ndan bir, ya'ni 5. Endi 5 ni 10 ga ko'paytiring — 50."
    },
    fb_correct: { ru: 'Верно. Вся карта 50 клеток.', uz: "To'g'ri. Butun xarita 50 katak." },
    audio: {
      intro: {
        ru: 'Последний кусок это шестьдесят процентов карты, на нём тридцать клеток. Сколько клеток во всей карте? Сначала посчитай, потом поставь маркер на прямой и нажми проверить.',
        uz: "Oxirgi bo'lak xaritaning oltmish foizi, unda o'ttiz katak. Butun xarita necha katak? Avval hisoblang, keyin markerni son o'qiga qo'ying va tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Пятьдесят.', uz: "To'g'ri. Ellik." },
      on_wrong:   { ru: 'Пока нет. Посмотри подсказку.', uz: "Hozircha yo'q. Maslahatga qarang." }
    }
  },

  // ---- s11 TEST FIND-THE-WRONG — xato yechimni top (M2). + FAKT B (% tarixi). correct=opt2 -> target D ----
  s11: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q_pre: { ru: 'Один из расчётов ', uz: 'Hisoblardan biri ' },
    q_em:  { ru: 'ОШИБОЧЕН', uz: 'XATO' },
    q_post: { ru: '. Найди именно его.', uz: ". Aynan o'shani toping." },
    opt0: { ru: '25% = 20, целое 80', uz: '25% = 20, butun 80' },
    opt1: { ru: '50% = 30, целое 60', uz: '50% = 30, butun 60' },
    opt2: { ru: '20% = 15, целое 3',  uz: '20% = 15, butun 3' },
    opt3: { ru: '10% = 9, целое 90',  uz: '10% = 9, butun 90' },
    correct_text: {
      ru: 'Верно, ошибка здесь. Если 20% = 15, то целое 75, а не 3. Тут часть умножили на процент.',
      uz: "To'g'ri, xato shu. 20% = 15 bo'lsa, butun 75, 3 emas. Bu yerda qismni foizga ko'paytirgan."
    },
    wrong_0: { ru: 'Это верно: 25% — четверть, 20 × 4 = 80. Ошибка в другом.', uz: "Bu to'g'ri: 25% — chorak, 20 x 4 = 80. Xato boshqasida." },
    wrong_1: { ru: 'Это верно: 50% — половина, 30 × 2 = 60. Ищи ошибку дальше.', uz: "Bu to'g'ri: 50% — yarmi, 30 x 2 = 60. Xatoni boshqa joydan qidiring." },
    wrong_3: { ru: 'Это верно: 10% — десятая часть, 9 × 10 = 90. Ошибка не здесь.', uz: "Bu to'g'ri: 10% — o'ndan bir, 9 x 10 = 90. Xato bu yerda emas." },
    fact: {
      ru: 'Знак процента появился из итальянского «per cento» — «из ста», которое веками сокращалось до значка %. Поэтому процент всегда означает долю от ста.',
      uz: "Foiz belgisi italyancha «per cento» — «yuzdan» — yozuvining asrlar davomida qisqarishidan paydo bo'lgan. Shuning uchun foiz doim yuzdan ulushni bildiradi."
    },
    audio: {
      intro: {
        ru: 'Здесь вопрос наоборот. Один расчёт ошибочен. Найди именно ошибочный и выбери его.',
        uz: "Bu yerda savol teskari. Hisoblardan biri xato. Aynan xato bo'lganini toping va tanlang."
      },
      on_correct: {
        ru: 'Верно. Если двадцать процентов это пятнадцать, то целое семьдесят пять, а не три. Кстати, знак процента появился из итальянского пер ченто, то есть из ста.',
        uz: "To'g'ri. Yigirma foiz o'n beshga teng bo'lsa, butun yetmish besh, uch emas. Aytgancha, foiz belgisi italyancha per cento, ya'ni yuzdan, degan yozuvning qisqarishidan paydo bo'lgan."
      },
      on_wrong: { ru: 'Этот расчёт верный. Ошибка в другом.', uz: "Bu hisob to'g'ri. Xato boshqasida." }
    }
  },

  // ---- s12 CASE setup — Iroda so'rovnoma: 30% = 18 -> jami? ----
  s12: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    lead: {
      ru: 'Карта восстановлена! Теперь этот навык в жизни. Ирода провела опрос в классе: 30% учеников ответили «да», и это 18 человек. Сколько всего учеников в классе?',
      uz: "Xaritani tikladingiz! Endi shu ko'nikma hayotda. Iroda sinfda so'rovnoma o'tkazdi: o'quvchilarning 30% i «ha» dedi, va bu 18 ta o'quvchi. Sinfda jami nechta o'quvchi bor?"
    },
    note: {
      ru: 'Внимание: 18 — это только ответившие «да» (30%), а не весь класс. Весь класс больше.',
      uz: "Diqqat: 18 — bu faqat «ha» deganlar (30%), butun sinf emas. Butun sinf undan katta."
    },
    hint_calc: {
      ru: '30% — это три десятых. Раздели 18 на 3 — десятая часть, 6. Теперь 6 × 10 = 60.',
      uz: "30% — bu o'ndan uch. 18 ni 3 ga bo'ling — o'ndan bir, ya'ni 6. Endi 6 ni 10 ga ko'paytiring — 60."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: 'Ирода провела в классе опрос. Тридцать процентов учеников ответили да, и это восемнадцать человек. Сколько всего учеников в классе? Обрати внимание: восемнадцать это только ответившие да, а не весь класс. Тридцать процентов это три десятых, значит сначала найди десятую часть, потом умножь на десять.',
      uz: "Iroda sinfda so'rovnoma o'tkazdi. O'quvchilarning o'ttiz foizi ha dedi, va bu o'n sakkiz o'quvchi. Sinfda jami nechta o'quvchi bor? Diqqat qiling: o'n sakkiz — bu faqat ha deganlar, butun sinf emas. O'ttiz foiz o'ndan uch, demak avval o'ndan birni toping, keyin o'nga ko'paytiring."
    }
  },

  // ---- s13 CASE/FINAL MC — jami o'quvchi? -> 60. + FAKT C (diskont). correct '60' -> target A ----
  s13: {
    eyebrow: { ru: 'Итог задачи', uz: 'Masala yakuni' },
    lead: {
      ru: 'Сколько всего учеников в классе? «Да» ответили 30% — это 18 человек.',
      uz: "Sinfda jami nechta o'quvchi? «Ha» javobini 30% berdi — bu 18 o'quvchi."
    },
    opt0: { ru: '60', uz: '60' },
    opt1: { ru: '18', uz: '18' },
    opt2: { ru: '54', uz: '54' },
    opt3: { ru: '540', uz: '540' },
    correct_text: {
      ru: 'Верно. 30% — три десятых. 18 ÷ 3 = 6, а 6 × 10 = 60 учеников.',
      uz: "To'g'ri. 30% — o'ndan uch. 18 / 3 = 6, 6 x 10 = 60 o'quvchi."
    },
    wrong_1: { ru: '18 — это только ответившие «да» (30%), а не весь класс. Класс больше: 60.', uz: "18 — bu faqat «ha» deganlar (30%), butun sinf emas. Sinf kattaroq: 60." },
    wrong_2: { ru: 'Ты умножил 18 на 3. Наоборот: сначала раздели на 3 (6), потом × 10 (60).', uz: "18 ni 3 ga ko'paytirdingiz. Aksincha: avval 3 ga bo'ling (6), keyin 10 ga ko'paytiring (60)." },
    wrong_3: { ru: 'Ты умножил часть на процент (18 × 30). Верно: 18 ÷ 30 × 100 = 60.', uz: "Qismni foizga ko'paytirdingiz (18 x 30). To'g'risi: 18 / 30 x 100 = 60." },
    fact: {
      ru: 'Магазины по надписи «вы сэкономили 24 000 сум» обратным процентом находят исходную цену: если 24 000 — это 30%, то цена была 80 000 сум.',
      uz: "Do'konlar «siz 24 000 so'm tejadingiz» yozuvidan asl narxni teskari foiz bilan topadi: 24 000 — bu 30% bo'lsa, asl narx 80 000 so'm."
    },
    audio: {
      intro: {
        ru: 'Сколько всего учеников в классе? Сначала вспомни, сколько процентов это восемнадцать, потом найди целое и выбери ответ.',
        uz: "Sinfda jami nechta o'quvchi? Avval o'n sakkiz necha foiz ekanini eslang, keyin butunni toping va javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Шестьдесят учеников. Кстати, магазины тоже по сумме, которую ты сэкономил, обратным процентом находят исходную цену: двадцать четыре тысячи сум это тридцать процентов, значит цена была восемьдесят тысяч.',
        uz: "To'g'ri. Oltmish o'quvchi. Aytgancha, do'konlar ham siz qancha tejaganingizdan asl narxni teskari foiz bilan topadi: yigirma to'rt ming so'm o'ttiz foiz bo'lsa, asl narx sakson ming so'm."
      },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s14 SUMMARY — Oybek hookini yopadi + ConnectionsBlock ----
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    title: { ru: 'Вернёмся к карте Ойбека.', uz: "Oybekning xaritasiga qaytamiz." },
    main_label: { ru: 'Главное', uz: 'Asosiy' },
    main_1: { ru: 'Если известны часть и процент: пойми, какая это доля, и умножь часть во столько же раз.', uz: "Qism va foiz ma'lum bo'lsa: foiz qaysi ulush ekanini toping va qismni shuncha marta ko'paytiring." },
    main_2: { ru: 'Для любого процента: целое = часть ÷ процент × 100.', uz: "Har qanday foiz uchun: butun = qism / foiz x 100." },
    main_3: { ru: 'Данное число — это ЧАСТЬ, а не ответ. Если процент меньше 100, целое больше части.', uz: "Berilgan son — bu QISM, javob emas. Foiz 100 dan kichik bo'lsa, butun qismdan katta." },
    hook_close: {
      ru: 'Кусок был 20% всей карты, 10 клеток. Значит вся карта 5 × 10 = 50 клеток, а не 10. Ойбек принял один кусок за целое и ошибся.',
      uz: "Bo'lak butun xaritaning 20% i, 10 katak edi. Demak butun xarita 5 x 10 = 50 katak, 10 emas. Oybek bir bo'lakni butun deb o'ylab adashdi."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: '«Процент как сотая доля», «Нахождение процента от числа», «Сокращение дробей».',
      uz: "«Foiz — yuzdan bir ulush», «Sonning foizini topish», «Kasrlarni qisqartirish»."
    },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'начинается геометрия: периметр прямоугольника и квадрата — длина границы фигуры.',
      uz: "geometriya boshlanadi: to'g'ri to'rtburchak va kvadrat perimetri — figuraning chegara uzunligi."
    },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: {
      ru: 'Подведём итог. Если известны часть и процент, пойми, какая это доля, и умножь часть во столько же раз. Для любого процента раздели часть на процент и умножь на сто. И помни: данное число это часть, а не ответ, целое больше неё. Поэтому карта, у которой двадцать процентов это десять клеток, целиком пятьдесят клеток, а не десять. Ойбек принял один кусок за целое и ошибся.',
      uz: "Xulosa qilamiz. Qism va foiz ma'lum bo'lsa, foiz qaysi ulush ekanini toping va qismni shuncha marta ko'paytiring. Har qanday foiz uchun esa qismni foizga bo'lib, yuzga ko'paytiring. Va esda tuting: berilgan son — bu qism, javob emas, butun undan katta. Shuning uchun yigirma foizi o'n katak bo'lgan xarita to'liq ellik katak, o'n emas. Oybek bir bo'lakni butun deb o'ylab adashdi."
    }
  }

};

// ============================================================
// MAJBURIY YORDAMCHILAR (infrastructure_v1 / Dars26 bilan baytma-bayt)
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
const FB_STAT = { ru: 'Знаешь ли ты? · Статистика', uz: "Bilasizmi? · Statistika" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',     uz: "Bilasizmi? · Tarix" };
const FB_LIFE = { ru: 'Знаешь ли ты? · Жизнь',       uz: "Bilasizmi? · Hayot" };

// Saylov — ovoz qutisi to'ladi + "?" (CSS loop).
const AnimVote = () => (<div className="fa-vt"><div className="fa-vt-box"><div className="fa-vt-fill"/></div><span className="fa-vt-q">?</span></div>);
// Foiz belgisi (%) — glif yig'iladi/pulsatsiya (CSS loop).
const AnimPct = () => (<div className="fa-pc"><span className="fa-pc-sign">%</span></div>);
// Diskont — narx-yorlig'i + tejov rozetkasi (CSS loop).
const AnimTag = () => (<div className="fa-tg"><span className="fa-tg-tag">?</span><span className="fa-tg-save">−30%</span></div>);

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
// VIZUALIZATORLAR — perc_5_03 (RevBar teskari + MapHook + MapTiles + NumLine)
// ============================================================
const fmtNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// RevBar: butun (track to'liq eni) = ?, ma'lum qism pct% ni egallaydi, qolgani noma'lum (chiziqli fon).
// reveal=true bo'lsagina butun (whole) ko'rsatiladi — test ekranida javob oshkor bo'lmaydi.
const RevBar = ({ pct = 0, part = null, whole = null, reveal = false, live = false, alive = false, glow = false }) => {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div className={`rb-wrap${glow ? ' rb-glow' : ''}`} aria-hidden="true">
      <div className="rb-track">
        <div className={`rb-frag${live ? ' rb-live' : ''}${alive ? ' rb-alive' : ''}`} style={{ width: `${w}%` }}>
          {part !== null ? <span className="rb-frag-lbl">{fmtNum(part)}</span> : null}
        </div>
      </div>
      <div className="rb-readout">
        <b className="rb-pct">{pct}%</b>
        <span className="rb-arrow" aria-hidden="true">→</span>
        <b className="rb-whole">{reveal && whole !== null ? fmtNum(whole) : '?'}</b>
      </div>
    </div>
  );
};

// MapHook (s0): yirtilgan xarita — bo'lak chapdan kirib keladi (mhIn) + suzadi (mhFloat), "?" pulsatsiya.
const MapHook = () => (
  <div className="mh-wrap" aria-hidden="true">
    <div className="mh-map">
      <div className="mh-frag"><span className="mh-frag-lbl">10</span></div>
      <span className="mh-q">?</span>
    </div>
    <div className="mh-cap"><b className="mh-pct">20%</b><span className="mh-arrow">→</span><b className="mh-whole">?</b></div>
  </div>
);

// MapTiles (s2): bo'laklar birin-ketin qo'shilib butun xaritani yig'adi (har biri 10 katak).
const MapTiles = ({ count = 0, max = 5 }) => (
  <div className="qt-row" aria-hidden="true">
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} className={`qt-tile${i < count ? ' qt-on' : ''}`}>
        <span className="qt-cells">10</span>
      </div>
    ))}
  </div>
);

// NumLine (s10): 0..max son o'qi, markerda joriy qiymat bayrog'i.
const NumLine = ({ val = 0, max = 100, alive = false }) => {
  const w = Math.max(0, Math.min(100, val / max * 100));
  return (
    <div className="nl-wrap" aria-hidden="true">
      <div className="nl-track">
        <div className={`nl-cur${alive ? ' rb-alive' : ''}`} style={{ left: `${w}%` }}>
          <span className="nl-flag">{fmtNum(val)}</span>
        </div>
      </div>
      <div className="nl-axis"><span>0</span><span>{fmtNum(max / 4)}</span><span>{fmtNum(max / 2)}</span><span>{fmtNum(max * 3 / 4)}</span><span>{fmtNum(max)}</span></div>
    </div>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (kvest: yirtilgan xarita). Qaytish: picked TO'LIQ sbros.
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
          <MapHook/>
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

// s1 — WARM-UP (spaced retrieval, scored emas) QuestionScreen orqali (correct B)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (bo'laklarni yig'ish, tap-paced: count 0..5)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const MAX = 5;
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
          <MapTiles count={count} max={MAX}/>
          <div className="pb-calc">
            <span className="pb-calc-unit">10</span>
            <span className="pb-calc-op">×</span>
            <span className="pb-calc-n">{count}</span>
            <span className="pb-calc-op">=</span>
            <span className="pb-calc-res">{fmtNum(count * 10)}</span>
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

// s3 — EXPLORATION (jonli slayder: butunni top, 25% = 15 -> 60)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const PCT = 25; const TARGET = 60;
  const [whole, setWhole] = useState(20);
  const part = Math.round(whole * PCT / 100);
  const matched = whole === TARGET;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={matched ? 'frame fade-up delay-1 pb-pulse' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <RevBar pct={PCT} part={part} whole={whole} reveal={true} live={true} alive={true} glow={matched}/>
        </div>
        <div className="fade-up delay-2"><Slider value={whole} min={0} max={100} step={5} onChange={setWhole}/></div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: matched ? T.success : T.ink2, fontWeight: matched ? 600 : 400 }}>{mt(t(matched ? c.note_full : c.hint_move))}</p>
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
          <RevBar pct={20} part={10} whole={50} reveal={true} alive={true} glow={true}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_hard))}</p>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (M1/M2 ogohlantirish) + ambient
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
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <RevBar pct={20} part={10} whole={50} reveal={true} alive={true}/>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.point2))}</p>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.point3))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST MC: 30% = 60 -> 200 (correct C) + Fakt saylov
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 3, 0, 2]);
  const question = (<><h2 className="title h-sub">{mt(t(c.lead))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><RevBar pct={30} part={60} reveal={false} alive={true}/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_STAT} anim={<AnimVote/>}/>}/>;
};

// s7 — TEST NumInput: 50% = 35 -> 70
const Screen7 = (props) => {
  const c = CONTENT.s7;
  return <NumInputScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={c} correctValue={70} renderVisual={() => <RevBar pct={50} part={35} reveal={false} alive={true}/>}/>;
};

// s8 — TEST tap-match: bir xil qism (12), har xil foiz -> har xil butun (M2 sindiradi)
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const chips = c.chips[lang] || c.chips.ru;
  const correctMap = {}; c.clues.forEach(cl => { correctMap[cl.id] = cl.answer; });
  const wasSolved = storedAnswer?.solved === true;
  const [assign, setAssign] = useState(() => wasSolved ? { ...correctMap } : {});
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(wasSolved);
  const [flash, setFlash] = useState(() => new Set());
  const [hintIds, setHintIds] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const usedVals = Object.values(assign);
  const tapClue = (id) => {
    if (solved) return;
    setHintIds(new Set());
    const had = assign[id] != null;
    setAssign(prev => { const n = { ...prev }; if (had) { delete n[id]; } else if (selected !== null) { n[id] = selected; } return n; });
    if (!had && selected !== null) setSelected(null);
  };
  const tapChip = (ch) => { if (solved) return; if (usedVals.includes(ch)) return; setSelected(s => s === ch ? null : ch); };
  const allAssigned = c.clues.every(cl => assign[cl.id]);
  const check = () => {
    if (solved || !allAssigned) return;
    const wrongClues = c.clues.filter(cl => assign[cl.id] !== cl.answer);
    const ok = wrongClues.length === 0;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.lead[lang], correctAnswer: c.clues.map(cl => `${cl.id}:${cl.answer}`).join(','), studentAnswer: c.clues.map(cl => `${cl.id}:${assign[cl.id] || ''}`).join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setFlash(new Set(wrongClues.map(cl => cl.id)));
      setHintIds(new Set(wrongClues.map(cl => cl.id)));
      setTimeout(() => { setAssign(prev => { const n = { ...prev }; wrongClues.forEach(cl => delete n[cl.id]); return n; }); setFlash(new Set()); }, 700);
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const hintClues = c.clues.filter(cl => hintIds.has(cl.id));
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="dm-clues fade-up delay-1">
          {c.clues.map(cl => {
            const v = assign[cl.id];
            const cls = `dm-clue${v != null ? ' dm-filled' : ''}${flash.has(cl.id) ? ' dm-bad' : ''}${solved ? ' dm-ok' : ''}`;
            return (
              <button key={cl.id} className={cls} disabled={solved} onClick={() => tapClue(cl.id)}>
                <span className="dm-clue-lbl">{mt(t(cl.label))}</span>
                <span className="dm-arrow" aria-hidden="true">→</span>
                <span className="dm-slot">{v != null ? v : '?'}</span>
              </button>
            );
          })}
        </div>
        <div className="dm-chips fade-up delay-2">
          {chips.map((ch, i) => {
            const used = usedVals.includes(ch);
            const sel = selected === ch;
            return <button key={i} className={`dm-chip${sel ? ' dm-sel' : ''}${used ? ' dm-used' : ''}`} disabled={solved || used} onClick={() => tapChip(ch)}>{ch}</button>;
          })}
        </div>
        {hintClues.length > 0 && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {hintClues.map(cl => (<p key={cl.id} className="small" style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}><span style={{ color: T.accent, marginTop: 1 }}><IconNo/></span><span>{mt(t(cl.hint))}</span></p>))}
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allAssigned} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
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

// s9 — TEST slider: butunni top, 40% = 20 -> 50
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's9_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const PCT = 40; const TARGET = 50;
  const wasSolved = storedAnswer?.solved === true;
  const [val, setVal] = useState(wasSolved ? TARGET : (typeof storedAnswer?.studentValue === 'number' ? storedAnswer.studentValue : 0));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const firstValRef = useRef(typeof storedAnswer?.studentValue === 'number' ? storedAnswer.studentValue : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const part = Math.round(val * PCT / 100);
  const submit = () => {
    if (solved) return;
    const isCorrect = val === TARGET;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstValRef.current = val; }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[9].scope, screenIdx: 9, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: String(firstValRef.current), studentValue: firstValRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={solved ? 'frame fade-up delay-1 pb-pulse' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <RevBar pct={PCT} part={part} whole={val} reveal={true} live={true} alive={true} glow={solved}/>
        </div>
        <div className="fade-up delay-2"><Slider value={val} min={0} max={100} step={5} onChange={(v) => { if (!solved) { setVal(v); setHintShown(false); } }}/></div>
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

// s10 — TEST number-line: butunni qo'y, 60% = 30 -> 50
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const TARGET = 50;
  const wasSolved = storedAnswer?.solved === true;
  const [val, setVal] = useState(wasSolved ? TARGET : (typeof storedAnswer?.studentValue === 'number' ? storedAnswer.studentValue : 0));
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const firstValRef = useRef(typeof storedAnswer?.studentValue === 'number' ? storedAnswer.studentValue : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const isCorrect = val === TARGET;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstValRef.current = val; }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[10].scope, screenIdx: 10, question: c.lead[lang], correctAnswer: TARGET, studentAnswer: String(firstValRef.current), studentValue: firstValRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={solved ? 'frame fade-up delay-1 pb-pulse' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <NumLine val={val} max={100} alive={true}/>
        </div>
        <div className="fade-up delay-2"><Slider value={val} min={0} max={100} step={5} onChange={(v) => { if (!solved) { setVal(v); setHintShown(false); } }}/></div>
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

// s11 — TEST find-the-wrong (correct D) + Fakt % tarixi
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 3, 2]);
  const question = (<h2 className="title h-sub">{t(c.q_pre)}<span className="italic" style={{ color: T.accent }}>{t(c.q_em)}</span>{t(c.q_post)}</h2>);
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimPct/>}/>}/>;
};

// s12 — CASE setup (Iroda sinf so'rovnomasi)
const Screen12 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
          <RevBar pct={30} part={18} reveal={false} alive={true}/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s13 — CASE solve / FINAL (correct A) + Fakt diskont
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-sub">{mt(t(c.lead))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><RevBar pct={30} part={18} reveal={false} alive={true}/></div></>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_LIFE} anim={<AnimTag/>}/>}/>;
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
export default function PercentFindNumberLesson({
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

/* MATH perc_5_03: RevBar — teskari bar (butun=?, qismdan tiklanadi). */
.rb-wrap { width: clamp(220px, 60vw, 420px); display: flex; flex-direction: column; gap: 6px; }
.rb-track { position: relative; height: clamp(26px, 5vw, 34px); background: repeating-linear-gradient(45deg, rgba(1, 154, 203, 0.06), rgba(1, 154, 203, 0.06) 8px, rgba(1, 154, 203, 0.12) 8px, rgba(1, 154, 203, 0.12) 16px); border-radius: 8px; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.18); }
.rb-frag { position: relative; height: 100%; background: linear-gradient(90deg, #FF8A66, #FF4F28); border-radius: 8px 0 0 8px; width: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(255, 79, 40, 0.45); }
.rb-frag.rb-live { transition: width 0.15s ease-out; }
.rb-frag.rb-alive { animation: rbShine 2.6s ease-in-out infinite; }
@keyframes rbShine { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.12); } }
.rb-frag-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.2vw, 16px); color: #FFFFFF; }
.rb-readout { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 1.8vw, 14px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 2.8vw, 22px); }
.rb-pct { color: #FF4F28; }
.rb-whole { color: #019ACB; }
.rb-arrow { color: #A7A6A2; }
.rb-glow { animation: pbGlow 0.7s ease; }

/* MATH perc_5_03: MapHook — yirtilgan xarita (CSS-only loop), s0 majburiy animatsiya. */
.mh-wrap { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2vw, 14px); }
.mh-map { position: relative; width: clamp(170px, 44vw, 260px); height: clamp(96px, 20vw, 140px); background: repeating-linear-gradient(45deg, rgba(1, 154, 203, 0.05), rgba(1, 154, 203, 0.05) 10px, rgba(1, 154, 203, 0.10) 10px, rgba(1, 154, 203, 0.10) 20px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.18); overflow: hidden; }
.mh-frag { position: absolute; left: 0; top: 0; width: 20%; height: 100%; background: linear-gradient(90deg, #FF8A66, #FF4F28); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -4px rgba(255, 79, 40, 0.5); animation: mhIn 1s ease both, mhFloat 4s ease-in-out 1s infinite; }
@keyframes mhIn { from { transform: translateX(-120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes mhFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.mh-frag-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 3vw, 22px); color: #FFFFFF; }
.mh-q { position: absolute; right: 22%; top: 50%; transform: translateY(-50%); font-family: 'Fraunces', serif; font-size: clamp(34px, 8vw, 52px); color: #019ACB; animation: mhQ 2.2s ease-in-out infinite; }
@keyframes mhQ { 0%, 100% { opacity: 0.4; transform: translateY(-50%) scale(0.92); } 50% { opacity: 1; transform: translateY(-50%) scale(1.04); } }
.mh-cap { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 14px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 2.8vw, 22px); }
.mh-pct { color: #FF4F28; }
.mh-whole { color: #019ACB; }
.mh-arrow { color: #A7A6A2; }

/* MATH perc_5_03: MapTiles — bo'laklar butun xaritaga yig'iladi (tap). */
.qt-row { display: flex; gap: clamp(6px, 1.4vw, 10px); flex-wrap: wrap; justify-content: center; }
.qt-tile { width: clamp(40px, 9vw, 58px); height: clamp(40px, 9vw, 58px); border-radius: 8px; background: rgba(1, 154, 203, 0.08); box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.15); display: flex; align-items: center; justify-content: center; opacity: 0.35; transition: all 0.3s ease; }
.qt-tile.qt-on { opacity: 1; background: linear-gradient(135deg, #FF8A66, #FF4F28); box-shadow: 0 6px 14px -4px rgba(255, 79, 40, 0.4); animation: qtPop 0.35s ease both; }
@keyframes qtPop { from { transform: scale(0.6); } to { transform: scale(1); } }
.qt-cells { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.4vw, 17px); color: #FFFFFF; }
.qt-tile:not(.qt-on) .qt-cells { color: #019ACB; opacity: 0.5; }

/* MATH perc_5_03: NumLine — 0..max son o'qi, marker bayrog'i. */
.nl-wrap { width: clamp(240px, 64vw, 440px); display: flex; flex-direction: column; gap: 6px; }
.nl-track { position: relative; height: 4px; background: rgba(1, 154, 203, 0.25); border-radius: 99px; margin: 26px 0 6px; }
.nl-cur { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 0 4px #F6F4EF, 0 0 10px rgba(255, 79, 40, 0.5); transition: left 0.15s ease-out; }
.nl-flag { position: absolute; left: 50%; top: -10px; transform: translate(-50%, -100%); background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 2vw, 15px); padding: 3px 8px; border-radius: 8px; white-space: nowrap; box-shadow: 0 4px 12px -2px rgba(255, 79, 40, 0.5); }
.nl-axis { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: clamp(9px, 1.3vw, 11px); color: #019ACB; font-weight: 600; }

/* MATH perc_5_03: tap-match (juftlash) — qism (ipucha) <-> butun. */
.dm-clues { display: flex; flex-direction: column; gap: clamp(7px, 1.4vw, 10px); }
.dm-clue { display: flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); background: #FFFFFF; border: none; border-radius: 12px; padding: clamp(10px, 1.8vw, 13px) clamp(13px, 2.1vw, 17px); cursor: pointer; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.15s; text-align: left; }
.dm-clue:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.dm-clue:disabled { cursor: default; }
.dm-clue-lbl { flex: 1; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.2vw, 16px); color: #0E0E10; }
.dm-arrow { color: #A7A6A2; font-family: 'JetBrains Mono', monospace; }
.dm-slot { flex-shrink: 0; min-width: clamp(46px, 10vw, 60px); text-align: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.5vw, 18px); color: #019ACB; background: rgba(1, 154, 203, 0.08); border-radius: 8px; padding: 6px 10px; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.18); }
.dm-filled .dm-slot { background: rgba(1, 154, 203, 0.16); }
.dm-bad { background: #FFE8E1 !important; animation: msShake 0.4s; }
.dm-ok { background: #E3F0E8 !important; }
.dm-ok .dm-slot { color: #1F7A4D; background: rgba(31, 122, 77, 0.12); box-shadow: inset 0 0 0 2px rgba(31, 122, 77, 0.25); }
.dm-chips { display: flex; gap: clamp(8px, 1.8vw, 12px); justify-content: center; flex-wrap: wrap; }
.dm-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.6vw, 19px); color: #FF4F28; background: #FFFFFF; border: none; border-radius: 12px; padding: clamp(9px, 1.7vw, 12px) clamp(16px, 2.6vw, 22px); cursor: pointer; box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.28); transition: all 0.15s; }
.dm-chip:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.4); }
.dm-sel { box-shadow: 0 0 0 2px #FF4F28, 0 8px 20px -6px rgba(255, 79, 40, 0.4) !important; background: #FFE8E1; }
.dm-used { opacity: 0.35; cursor: default; }

/* MATH perc_5_03: факт-анимации (CSS-only loop). */
.fa-vt { position: relative; width: clamp(60px, 12vw, 86px); height: clamp(60px, 12vw, 86px); display: inline-flex; align-items: flex-end; justify-content: center; }
.fa-vt-box { width: clamp(40px, 8vw, 58px); height: clamp(34px, 7vw, 48px); background: rgba(1, 154, 203, 0.12); border-radius: 6px; box-shadow: inset 0 0 0 2px rgba(1, 154, 203, 0.25); overflow: hidden; display: flex; align-items: flex-end; }
.fa-vt-fill { width: 100%; height: 0; background: #019ACB; animation: faVt 3s ease-in-out infinite; }
@keyframes faVt { 0% { height: 0; } 60% { height: 60%; } 85% { height: 60%; } 100% { height: 0; } }
.fa-vt-q { position: absolute; top: 0; right: 8%; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 3vw, 22px); color: #FF4F28; animation: faVtQ 3s ease-in-out infinite; }
@keyframes faVtQ { 0%, 40% { opacity: 0; } 60%, 100% { opacity: 1; } }
.fa-pc { display: inline-flex; align-items: center; justify-content: center; }
.fa-pc-sign { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(40px, 9vw, 64px); color: #019ACB; animation: faPc 3s ease-in-out infinite; }
@keyframes faPc { 0%, 100% { transform: scale(0.9) rotate(-4deg); opacity: 0.7; } 50% { transform: scale(1.08) rotate(4deg); opacity: 1; } }
.fa-tg { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.fa-tg-tag { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(40px, 9vw, 62px); color: #019ACB; animation: faTg 3.2s ease-in-out infinite; }
@keyframes faTg { 0%, 100% { transform: rotate(-8deg) scale(1); } 50% { transform: rotate(-8deg) scale(1.08); } }
.fa-tg-save { position: absolute; bottom: 6%; right: 0; background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px, 1.8vw, 13px); border-radius: 99px; padding: 2px 7px; box-shadow: 0 4px 10px -2px rgba(255, 79, 40, 0.5); animation: faTgSave 3.2s ease-in-out infinite; }
@keyframes faTgSave { 0%, 40% { opacity: 0; transform: scale(0.6); } 60%, 100% { opacity: 1; transform: scale(1); } }

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
