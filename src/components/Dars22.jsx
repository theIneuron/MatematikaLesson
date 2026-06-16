import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сравнение и округление десятичных дробей — dec_5_02
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
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 9 }}>
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
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 9 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 9 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};


const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'dec-5-02-v1',
  lessonTitle: { ru: 'Сравнение и округление десятичных дробей', uz: "O'nli kasrlarni solishtirish va yaxlitlash" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'review',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // drag-ordering
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // find-the-wrong
  { id: 's11', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // case compare
  { id: 's13', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // ── s0 HOOK (спорт: кто прыгнул выше) ──────────────────────────────
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    lead: { ru: 'Финал по прыжкам в высоту. Жахонгир прыгнул на 1,45 м, Мафтуна — на 1,5 м. Тренер спрашивает: кто чемпион?', uz: "Balandlikka sakrash finali. Jahongir 1,45 m, Maftuna 1,5 m sakradi. Murabbiy so'raydi: chempion kim?" },
    objection: { ru: 'Один зритель говорит: у Жахонгира 1,45 — после запятой две цифры, а у Мафтуны одна. Значит, Жахонгир выше.', uz: "Bir tomoshabin aytadi: Jahongirda 1,45 — verguldan keyin ikkita raqam, Maftunada bitta. Demak, Jahongir balandroq." },
    question: { ru: 'Кто на самом деле прыгнул выше?', uz: "Aslida kim balandroq sakradi?" },
    opt_yes: { ru: 'Жахонгир — у него после запятой больше цифр', uz: "Jahongir — unda verguldan keyin raqam ko'proq" },
    opt_no: { ru: 'Мафтуна — 1,5 м', uz: "Maftuna — 1,5 m" },
    opt_idk: { ru: 'Пока не уверен(а)', uz: "Hozircha ishonchim komil emas" },
    audio: { ru: 'Финал по прыжкам в высоту. Жахонгир прыгнул на одну целую сорок пять сотых метра. Мафтуна — на одну целую пять десятых метра. Один зритель говорит: у Жахонгира после запятой больше цифр, значит он прыгнул выше. Так ли это? Кто на самом деле прыгнул выше? Выбери ответ.', uz: "Balandlikka sakrash finali. Jahongir bir butun yuzdan qirq besh metr sakradi. Maftuna bir butun o'ndan besh metr sakradi. Bir tomoshabin aytadi: Jahongirda verguldan keyin raqam ko'proq, demak u balandroq sakradi. Shundaymi? Aslida kim balandroq sakradi? Javobingizni tanlang." }
  },

  // ── s1 WARM-UP — spaced retrieval (dec_5_01: 0,5 = 5/10) ───────────
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    question: { ru: 'Прошлый урок: как записать 0,5 обыкновенной дробью? 0,5 = ?', uz: "O'tgan dars: 0,5 ni oddiy kasr bilan qanday yozamiz? 0,5 = ?" },
    opt0: { ru: '5/10', uz: "5/10" },
    opt1: { ru: '1/10', uz: "1/10" },
    opt2: { ru: '5/100', uz: "5/100" },
    opt3: { ru: '50/10', uz: "50/10" },
    correct_text: { ru: 'Верно. После запятой одна цифра — это десятые: 0,5 = 5/10. Скоро это пригодится для сравнения.', uz: "To'g'ri. Verguldan keyin bitta raqam — bu o'ndan: 0,5 = 5/10. Tez orada bu solishtirishda asqotadi." },
    wrong_1: { ru: '1/10 это 0,1 — совсем мало. А 0,5 это пять десятых: 5/10.', uz: "1/10 — bu 0,1, juda oz. 0,5 esa o'ndan besh: 5/10." },
    wrong_2: { ru: '5/100 это 0,05 — это сотые. А в 0,5 одна цифра после запятой, это десятые: 5/10.', uz: "5/100 — bu 0,05, ya'ni yuzdan. 0,5 da esa verguldan keyin bitta raqam, bu o'ndan: 5/10." },
    wrong_3: { ru: '50/10 больше целого. А 0,5 меньше целого: это пять десятых, 5/10.', uz: "50/10 butundan katta. 0,5 esa butundan kichik: o'ndan besh, 5/10." },
    audio: {
      intro: { ru: 'Вспомним прошлый урок. Как записать ноль целых пять десятых обыкновенной дробью? Выберите вариант.', uz: "O'tgan darsni eslaymiz. Nol butun o'ndan beshni oddiy kasr bilan qanday yozamiz? Variantni tanlang." },
      on_correct: { ru: 'Верно, пять десятых.', uz: "To'g'ri, o'ndan besh." },
      on_wrong: { ru: 'Не совсем. После запятой одна цифра — это десятые.', uz: "Unchalik emas. Verguldan keyin bitta raqam — bu o'ndan." }
    }
  },

  // ── s2 EXPLORATION 1: дописать ноль и сравнить поразрядно ──────────
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'Вернёмся к загадке. Сравним 0,45 и 0,5. У первого цифр больше — но больше ли само число?', uz: "Topishmoqqa qaytamiz. 0,45 va 0,5 ni solishtiramiz. Birinchisida raqam ko'p — lekin sonning o'zi kattaroqmi?" },
    step_labels: {
      ru: ['Сравним 0,45 и 0,5. Сейчас закрасим клетки — нажмите кнопку.', 'Готово. У 0,5 пять крупных полос, у 0,45 сорок пять мелких клеток. Доли разные.', 'Допишем ноль: 0,5 = 0,50. Делим каждую полосу на десять — стало 50 клеток.', 'Теперь сравниваем: 50 клеток больше 45. Значит 0,5 больше.'],
      uz: ["0,45 va 0,5 ni solishtiramiz. Endi kataklarni bo'yaymiz — tugmani bosing.", "Tayyor. 0,5 da beshta katta bo'lak, 0,45 da qirq beshta mayda katak. Ulushlar har xil.", "Nol qo'shamiz: 0,5 = 0,50. Har bo'lakni o'nga bo'lamiz — 50 katak chiqadi.", "Endi solishtiramiz: 50 katak 45 dan ko'p. Demak 0,5 katta."]
    },
    note: { ru: 'Итак, 0,5 больше 0,45. Решает не длина, а значение разрядов.', uz: "Demak, 0,5 katta 0,45 dan. Uzunlik emas, razryad qiymati hal qiladi." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Вернёмся к загадке про прыжки. Сравним ноль целых сорок пять сотых и ноль целых пять десятых. Сейчас закрасим клетки. Нажмите кнопку.',
        'Клетки закрашены. У ноль целых пять десятых пять крупных полос, а у ноль целых сорок пять сотых сорок пять мелких клеток. Доли разные, сравнивать неудобно.',
        'Допишем ноль справа. Ноль целых пять десятых это то же, что ноль целых пятьдесят сотых. Делим каждую полосу на десять — получается пятьдесят клеток.',
        'Теперь сравнить легко. Пятьдесят клеток больше сорока пяти. Значит ноль целых пять десятых больше.'
      ],
      uz: [
        "Sakrash topishmog'iga qaytamiz. Nol butun yuzdan qirq besh va nol butun o'ndan beshni solishtiramiz. Endi kataklarni bo'yaymiz. Tugmani bosing.",
        "Kataklar bo'yaldi. Nol butun o'ndan beshda beshta katta bo'lak, nol butun yuzdan qirq beshda qirq beshta mayda katak bor. Ulushlar har xil, solishtirish noqulay.",
        "O'ng tomonga nol qo'shamiz. Nol butun o'ndan besh — bu nol butun yuzdan ellik bilan bir xil. Har bo'lakni o'nga bo'lamiz — ellik katak chiqadi.",
        "Endi solishtirish oson. Ellik katak qirq beshdan ko'p. Demak nol butun o'ndan besh katta."
      ]
    }
  },

  // ── s3 EXPLORATION 2: разные целые части / длинное число ───────────
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'А если есть целая часть? Сравним 3,2 и 3,15. У 3,15 цифр больше — проверим.', uz: "Agar butun qism bo'lsa-chi? 3,2 va 3,15 ni solishtiramiz. 3,15 da raqam ko'p — tekshiramiz." },
    step_labels: {
      ru: ['Сначала целая часть: у обоих 3. Поровну — смотрим дальше, после запятой.', 'Допишем ноль: 3,2 = 3,20. Теперь у обоих две цифры после запятой.', 'Сравниваем десятые: у 3,20 это 2, у 3,15 это 1. Значит 3,2 больше.'],
      uz: ["Avval butun qism: ikkalasida ham 3. Teng — verguldan keyingi qismga qaraymiz.", "Nol qo'shamiz: 3,2 = 3,20. Endi ikkalasida verguldan keyin ikkita raqam.", "O'ndanlarni solishtiramiz: 3,20 da bu 2, 3,15 da bu 1. Demak 3,2 katta."]
    },
    note: { ru: 'Хоть у 3,15 цифр больше, 3,2 больше. Сравнивайте разряд за разрядом.', uz: "3,15 da raqam ko'p bo'lsa ham, 3,2 kattaroq. Razryadma-razryad solishtiring." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Возьмём числа с целой частью. Сравним три целых две десятых и три целых пятнадцать сотых. Сначала смотрим целую часть. У обоих три, поровну. Значит, идём дальше. Нажмите кнопку.',
        'Допишем ноль к первому числу. Три целых две десятых это то же, что три целых двадцать сотых. Теперь длина одинаковая.',
        'Сравниваем десятые. У первого числа две десятых, у второго одна. Значит три целых две десятых больше.'
      ],
      uz: [
        "Butun qismi bor sonlarni olamiz. Uch butun o'ndan ikki va uch butun yuzdan o'n beshni solishtiramiz. Avval butun qismga qaraymiz. Ikkalasida uch, teng. Demak davom etamiz. Tugmani bosing.",
        "Birinchi songa nol qo'shamiz. Uch butun o'ndan ikki — bu uch butun yuzdan yigirma bilan bir xil. Endi uzunlik bir xil.",
        "O'ndanlarni solishtiramiz. Birinchi sonda ikki o'ndan, ikkinchisida bir. Demak uch butun o'ndan ikki kattaroq."
      ]
    }
  },

  // ── s4 EXPLORATION 3: округление — ближайшая метка (зачем) ─────────
  s4: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    lead: { ru: 'Теперь округление. Округлить — значит подвести число к ближайшей метке на прямой.', uz: "Endi yaxlitlash. Yaxlitlash — sonni o'qdagi eng yaqin belgiga olib borish." },
    step_labels: {
      ru: ['Округлим 0,46 до десятых. Оно стоит между 0,4 и 0,5.', 'К какой метке ближе 0,46? К 0,5. Значит, 0,46 округляется до 0,5.', 'Ещё пример: 3,7 к какому целому ближе — к 3 или к 4? К 4. Значит, 3,7 это примерно 4.'],
      uz: ["0,46 ni o'ndan razryadigacha yaxlitlaymiz. U 0,4 va 0,5 orasida.", "0,46 qaysi belgiga yaqinroq? 0,5 ga. Demak, 0,46 ni 0,5 ga yaxlitlaymiz.", "Yana misol: 3,7 qaysi butunga yaqinroq — 3 gami yoki 4 gami? 4 ga. Demak, 3,7 taxminan 4."]
    },
    note: { ru: 'Округление — это выбор ближайшей метки: ближайшей десятой или ближайшего целого.', uz: "Yaxlitlash — eng yaqin belgini tanlash: eng yaqin o'ndan yoki eng yaqin butun." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Теперь научимся округлять. Округлим ноль целых сорок шесть сотых до десятых. На прямой оно стоит между ноль целых четыре десятых и ноль целых пять десятых. Нажмите кнопку.',
        'Посмотрим, к какой метке ближе. Ноль целых сорок шесть сотых ближе к ноль целых пять десятых. Значит, округляем до ноль целых пять десятых.',
        'Ещё пример. Три целых семь десятых ближе к четырём, чем к трём. Значит, это примерно четыре.'
      ],
      uz: [
        "Endi yaxlitlashni o'rganamiz. Nol butun yuzdan qirq oltini o'ndan razryadigacha yaxlitlaymiz. O'qda u nol butun o'ndan to'rt va nol butun o'ndan besh orasida. Tugmani bosing.",
        "Qaysi belgiga yaqinroq ekanini ko'ramiz. Nol butun yuzdan qirq olti nol butun o'ndan beshga yaqinroq. Demak, nol butun o'ndan beshga yaxlitlaymiz.",
        "Yana misol. Uch butun o'ndan yetti uchdan ko'ra to'rtga yaqinroq. Demak, bu taxminan to'rt."
      ]
    }
  },

  // ── s5 RULE 1: правило сравнения ───────────────────────────────────
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    rule_main: { ru: 'Чтобы сравнить десятичные: выровняйте по запятой, при необходимости допишите нули, затем сравнивайте разряд за разрядом слева направо.', uz: "O'nli kasrlarni solishtirish uchun: vergul bo'yicha tenglang, kerak bo'lsa nol qo'shing, keyin chapdan o'ngga razryadma-razryad solishtiring." },
    rule_note: { ru: 'Сначала целая часть, потом десятые, потом сотые. Решает первый разряд, где числа различаются.', uz: "Avval butun qism, keyin o'ndan, keyin yuzdan. Sonlar farq qilgan birinchi razryad hal qiladi." },
    audio: { ru: 'Запомним правило сравнения. Сначала выравниваем числа по запятой и при необходимости дописываем нули. Потом сравниваем по разрядам слева направо: целая часть, десятые, сотые. Решает тот разряд, где числа впервые различаются.', uz: "Solishtirish qoidasini eslab qolamiz. Avval sonlarni vergul bo'yicha tenglaymiz va kerak bo'lsa nol qo'shamiz. Keyin chapdan o'ngga razryad bo'yicha solishtiramiz: butun qism, o'ndan, yuzdan. Sonlar birinchi marta farq qilgan razryad hal qiladi." }
  },

  // ── s6 RULE 2: правило округления + предупреждение M2 ──────────────
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    rule_main: { ru: 'Чтобы округлить: посмотрите на цифру справа от нужного разряда. 5 или больше — округляем вверх, меньше 5 — вниз.', uz: "Yaxlitlash uchun: kerakli razryaddan o'ngdagi raqamga qarang. 5 yoki undan katta bo'lsa yuqoriga, 5 dan kichik bo'lsa pastga yaxlitlaymiz." },
    warning_label: { ru: 'Запомните', uz: "Esda tuting" },
    warning: { ru: '0,5 = 0,50 = 0,500. Нули в конце не меняют значение — они лишь помогают выровнять разряды при сравнении.', uz: "0,5 = 0,50 = 0,500. Oxirdagi nollar qiymatni o'zgartirmaydi — ular faqat solishtirishda razryadlarni tenglashga yordam beradi." },
    audio: { ru: 'Теперь правило округления. Смотрим на цифру справа от того разряда, до которого округляем. Если она пять или больше, округляем вверх. Если меньше пяти, вниз. И помните: нули в конце десятичной дроби не меняют её значение. Ноль целых пять десятых это то же, что ноль целых пятьдесят сотых.', uz: "Endi yaxlitlash qoidasi. Yaxlitlanayotgan razryaddan o'ngdagi raqamga qaraymiz. Agar u besh yoki undan katta bo'lsa, yuqoriga yaxlitlaymiz. Besh dan kichik bo'lsa, pastga. Va esda tuting: o'nli kasr oxiridagi nollar uning qiymatini o'zgartirmaydi. Nol butun o'ndan besh — bu nol butun yuzdan ellik bilan bir xil." }
  },

  // ── s7 TEST MC: самое большое (correct A) + Факт запятая/точка ─────
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'Какое из чисел самое БОЛЬШОЕ?', uz: "Qaysi son eng KATTA?" },
    opt0: { ru: '0,8', uz: "0,8" },
    opt1: { ru: '0,75', uz: "0,75" },
    opt2: { ru: '0,7', uz: "0,7" },
    opt3: { ru: '0,79', uz: "0,79" },
    correct_text: { ru: 'Верно. 0,8 = 0,80 это 80 сотых — больше всех. Решает значение разрядов, а не число цифр.', uz: "To'g'ri. 0,8 = 0,80 — bu 80 yuzdan, hammadan katta. Raqam soni emas, razryad qiymati hal qiladi." },
    wrong_1: { ru: '0,75 это 75 сотых. А 0,8 это 80 сотых — больше.', uz: "0,75 — bu 75 yuzdan. 0,8 esa 80 yuzdan — kattaroq." },
    wrong_2: { ru: '0,7 это семь десятых. А 0,8 это восемь десятых — больше.', uz: "0,7 — bu o'ndan yetti. 0,8 esa o'ndan sakkiz — kattaroq." },
    wrong_3: { ru: 'Цифр больше, но 0,79 это 79 сотых. А 0,8 = 80 сотых — всё равно больше.', uz: "Raqami ko'p, lekin 0,79 — bu 79 yuzdan. 0,8 = 80 yuzdan — baribir kattaroq." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" },
      text: { ru: 'Во многих странах десятичный знак — запятая, а в программировании и английском — точка: 3.14.', uz: "Ko'p mamlakatlarda o'nli belgi vergul, dasturlash va ingliz tilida esa nuqta: 3.14." }
    },
    audio: {
      intro: { ru: 'Из четырёх чисел выберите самое большое. Помните: сравнивают по разрядам, а не по длине.', uz: "To'rt sondan eng kattasini tanlang. Esda tuting: uzunlik bo'yicha emas, razryad bo'yicha solishtiriladi." },
      on_correct: { ru: 'Верно, ноль целых восемь десятых самое большое. А теперь интересный факт. Во многих странах десятичный знак это запятая, как у нас. Но в программировании и в английском языке вместо запятой ставят точку. Поэтому одно и то же число можно записать и через запятую, и через точку.', uz: "To'g'ri, nol butun o'ndan sakkiz eng katta. Endi qiziqarli fakt. Ko'p mamlakatlarda o'nli belgi vergul, xuddi bizdagidek. Lekin dasturlashda va ingliz tilida vergul o'rniga nuqta qo'yiladi. Shuning uchun bitta sonni ham vergul, ham nuqta bilan yozish mumkin." },
      on_wrong: { ru: 'Не совсем. Допишите нули и сравните сотые.', uz: "Unchalik emas. Nollarni qo'shing va yuzdanlarni solishtiring." }
    }
  },

  // ── s8 TEST drag-ordering (только трудные числа) ──────────────────
  s8: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    instruction: { ru: 'Расставьте числа по возрастанию: от меньшего к большему.', uz: "Sonlarni o'sish tartibida joylang: kichikdan kattaga." },
    cards: {
      ru: [{ id: 'a', label: '0,3' }, { id: 'b', label: '0,25' }, { id: 'c', label: '0,205' }, { id: 'd', label: '0,5' }],
      uz: [{ id: 'a', label: '0,3' }, { id: 'b', label: '0,25' }, { id: 'c', label: '0,205' }, { id: 'd', label: '0,5' }]
    },
    order: ['c', 'b', 'a', 'd'],
    hint: { ru: 'Выровняйте по запятой: допишите нули и сравните как тысячные. Больше цифр не значит больше число.', uz: "Vergul bo'yicha tenglang: nol qo'shib, mingdan qilib solishtiring. Raqam ko'p bo'lsa, son katta degani emas." },
    ok_text: { ru: 'Все расставлены — нажмите «Проверить».', uz: "Hammasi joylandi — «Tekshirish» ni bosing." },
    wrong_text: { ru: 'Порядок неверный. Самое маленькое — у кого меньше сотых, даже если цифр больше.', uz: "Tartib noto'g'ri. Eng kichigi — yuzdani kam bo'lgan son, raqami ko'p bo'lsa ham." },
    done_text: { ru: 'Верно. По возрастанию: 0,205, затем 0,25, затем 0,3, и самое большое 0,5.', uz: "To'g'ri. O'sish tartibi: 0,205, keyin 0,25, keyin 0,3, eng kattasi 0,5." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    audio: {
      intro: { ru: 'Расставьте четыре числа по возрастанию, от меньшего к большему. Внимание: число с большим количеством цифр не всегда больше. Расставьте и нажмите проверить.', uz: "To'rt sonni o'sish tartibida joylang, kichikdan kattaga. Diqqat: raqami ko'p son har doim katta emas. Joylang va tekshirishni bosing." },
      on_correct: { ru: 'Верно. Ноль целых двести пять тысячных самое маленькое, хоть цифр и больше всех.', uz: "To'g'ri. Nol butun mingdan ikki yuz besh eng kichigi, raqami eng ko'p bo'lsa ham." },
      on_wrong: { ru: 'Порядок неверный. Выровняйте по запятой и сравните разряды.', uz: "Tartib noto'g'ri. Vergul bo'yicha tenglab, razryadlarni solishtiring." }
    }
  },

  // ── s9 TEST NumInput: округлить 0,47 до десятых → 0,5 ──────────────
  s9: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'Округлите 0,47 до десятых.', uz: "0,47 ni o'ndan razryadigacha yaxlitlang." },
    placeholder: { ru: '0,0', uz: "0,0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Смотрим на цифру справа от десятых — это 7. Семь больше пяти, значит округляем вверх: 0,5.', uz: "O'ndan razryadidan o'ngdagi raqamga qaraymiz — bu 7. Yetti besh dan katta, demak yuqoriga yaxlitlaymiz: 0,5." },
    fb_correct: { ru: 'Верно. Следующая цифра 7 больше 5, поэтому округляем вверх: 0,47 это примерно 0,5.', uz: "To'g'ri. Keyingi raqam 7, u 5 dan katta, shuning uchun yuqoriga yaxlitlaymiz: 0,47 taxminan 0,5." },
    audio: {
      intro: { ru: 'Округлите число ноль целых сорок семь сотых до десятых. Впишите ответ и нажмите проверить.', uz: "Nol butun yuzdan qirq yetti sonini o'ndan razryadigacha yaxlitlang. Javobni yozing va tekshirishni bosing." },
      on_correct: { ru: 'Верно, ноль целых пять десятых.', uz: "To'g'ri, nol butun o'ndan besh." },
      on_wrong: { ru: 'Не совсем. Посмотрите на цифру после десятых — она больше пяти.', uz: "Unchalik emas. O'ndandan keyingi raqamga qarang — u beshdan katta." }
    }
  },

  // ── s10 TEST find-the-wrong (correct B, ориг. idx 2) ──────────────
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni top" },
    question_pre: { ru: 'Какое сравнение ', uz: "Qaysi taqqoslash " },
    question_em: { ru: 'ОШИБОЧНО', uz: "XATO" },
    question_post: { ru: '?', uz: "?" },
    opt0: { ru: '0,8 больше 0,75', uz: "0,8 katta 0,75 dan" },
    opt1: { ru: '3,7 округляется до 4', uz: "3,7 yaxlitlanib 4 bo'ladi" },
    opt2: { ru: '0,45 больше 0,5', uz: "0,45 katta 0,5 dan" },
    opt3: { ru: '0,50 равно 0,5', uz: "0,50 teng 0,5 ga" },
    correct_text: { ru: 'Точно! 0,45 больше 0,5 — это ошибка. 0,5 = 0,50 это 50 сотых, а 0,45 это 45 сотых. На деле 0,45 меньше.', uz: "Aniq topdingiz! 0,45 katta 0,5 dan — bu xato. 0,5 = 0,50 bu 50 yuzdan, 0,45 esa 45 yuzdan. Aslida 0,45 kichik." },
    wrong_0: { ru: '0,8 больше 0,75 — это верно: 0,80 это 80 сотых. Ищите ошибочное.', uz: "0,8 katta 0,75 dan — bu to'g'ri: 0,80 bu 80 yuzdan. Xato bo'lganini qidiring." },
    wrong_1: { ru: '3,7 округляется до 4 — это верно: 3,7 ближе к четырём. Ищите ошибочное.', uz: "3,7 yaxlitlanib 4 bo'ladi — bu to'g'ri: 3,7 to'rtga yaqinroq. Xato bo'lganini qidiring." },
    wrong_3: { ru: '0,50 равно 0,5 — это верно, ноль в конце не меняет значение. Ищите ошибочное.', uz: "0,50 teng 0,5 ga — bu to'g'ri, oxirdagi nol qiymatni o'zgartirmaydi. Xato bo'lganini qidiring." },
    audio: {
      intro: { ru: 'Будьте внимательны: одно из сравнений ошибочно. Найдите неверное сравнение и выберите его.', uz: "Diqqatli bo'ling: taqqoslashlardan biri xato. Noto'g'ri taqqoslashni toping va uni tanlang." },
      on_correct: { ru: 'Верно. Сорок пять сотых меньше пятидесяти сотых.', uz: "To'g'ri. Yuzdan qirq besh yuzdan ellikdan kichik." },
      on_wrong: { ru: 'Это сравнение верное. Ищите ошибочное.', uz: "Bu taqqoslash to'g'ri. Xato bo'lganini qidiring." }
    }
  },

  // ── s11 CASE setup (Шерзод, прыжок в длину) ───────────────────────
  s11: {
    eyebrow: { ru: 'Жизненная задача', uz: "Hayotiy masala" },
    lead: { ru: 'Шерзод участвует в прыжках в длину. Две попытки: 4,25 м и 4,3 м. Какая попытка дальше — пойдёт в зачёт.', uz: "Sherzod uzunlikka sakrash musobaqasida qatnashyapti. Ikki urinish: 4,25 m va 4,3 m. Qaysi urinish uzoqroq — o'sha hisobga olinadi." },
    question_setup: { ru: 'Какая попытка дальше: 4,25 м или 4,3 м?', uz: "Qaysi urinish uzoqroq: 4,25 m yoki 4,3 m?" },
    btn_help: { ru: 'Помочь Шерзоду', uz: "Sherzodga yordam berish" },
    audio: { ru: 'Теперь задача из жизни. Шерзод прыгает в длину, у него две попытки: четыре целых двадцать пять сотых метра и четыре целых три десятых метра. Помогите определить, какая попытка дальше.', uz: "Endi hayotiy masala. Sherzod uzunlikka sakraydi, uning ikki urinishi bor: to'rt butun yuzdan yigirma besh metr va to'rt butun o'ndan uch metr. Qaysi urinish uzoqroq ekanini aniqlashga yordam bering." }
  },

  // ── s12 TEST case MC: 4,3 дальше (correct C, ориг. idx 0) + Факт ──
  s12: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    question: { ru: 'Какая попытка Шерзода дальше?', uz: "Sherzodning qaysi urinishi uzoqroq?" },
    opt0: { ru: '4,3 м дальше', uz: "4,3 m uzoqroq" },
    opt1: { ru: '4,25 м дальше', uz: "4,25 m uzoqroq" },
    opt2: { ru: 'Они равны', uz: "Ikkalasi teng" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно. 4,3 = 4,30 это 30 сотых, а 4,25 это 25 сотых. Значит 4,3 метра дальше.', uz: "To'g'ri. 4,3 = 4,30 bu 30 yuzdan, 4,25 esa 25 yuzdan. Demak 4,3 metr uzoqroq." },
    wrong_1: { ru: 'В 4,25 цифр больше, но это 25 сотых. А 4,3 = 4,30 это 30 сотых — дальше.', uz: "4,25 da raqam ko'p, lekin bu 25 yuzdan. 4,3 = 4,30 esa 30 yuzdan — uzoqroq." },
    wrong_2: { ru: 'Они не равны. Допишите ноль: 4,30 и 4,25 — сотые различаются: 30 и 25.', uz: "Ular teng emas. Nol qo'shing: 4,30 va 4,25 — yuzdanlari farq qiladi: 30 va 25." },
    wrong_3: { ru: 'Сравнить можно. Допишите ноль: 4,3 = 4,30, затем сравните сотые.', uz: "Solishtirsa bo'ladi. Nol qo'shing: 4,3 = 4,30, keyin yuzdanlarni solishtiring." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Измерительные приборы округляют: весы показывают массу до десятых долей грамма.', uz: "O'lchov asboblari yaxlitlaydi: tarozi massani grammning o'ndan ulushigacha ko'rsatadi." }
    },
    audio: {
      intro: { ru: 'Помогите Шерзоду. Какая попытка дальше: четыре целых двадцать пять сотых или четыре целых три десятых? Выберите вариант.', uz: "Sherzodga yordam bering. Qaysi urinish uzoqroq: to'rt butun yuzdan yigirma besh yoki to'rt butun o'ndan uch? Variantni tanlang." },
      on_correct: { ru: 'Верно, четыре целых три десятых дальше. А вот интересный факт. Измерительные приборы тоже округляют. Например, весы показывают массу до десятых долей грамма, а не точнее. Поэтому на табло мы видим уже округлённое число.', uz: "To'g'ri, to'rt butun o'ndan uch uzoqroq. Mana qiziqarli fakt. O'lchov asboblari ham yaxlitlaydi. Masalan, tarozi massani grammning o'ndan ulushigacha ko'rsatadi, undan aniqroq emas. Shuning uchun ekranda biz allaqachon yaxlitlangan sonni ko'ramiz." },
      on_wrong: { ru: 'Не совсем. Допишите ноль и сравните сотые.', uz: "Unchalik emas. Nol qo'shing va yuzdanlarni solishtiring." }
    }
  },

  // ── s13 FINAL MC: верное утверждение (correct D, ориг. idx 0) + Факт ─
  s13: {
    eyebrow: { ru: 'Итоговый вопрос', uz: "Yakuniy savol" },
    question: { ru: 'Какое утверждение ВЕРНО?', uz: "Qaysi tasdiq TO'G'RI?" },
    opt0: { ru: '0,5 больше 0,45', uz: "0,5 katta 0,45 dan" },
    opt1: { ru: '0,45 больше 0,5', uz: "0,45 katta 0,5 dan" },
    opt2: { ru: '2,3 округляется до 3', uz: "2,3 yaxlitlanib 3 bo'ladi" },
    opt3: { ru: '0,7 равно 0,07', uz: "0,7 teng 0,07 ga" },
    correct_text: { ru: 'Верно. 0,5 = 0,50 это 50 сотых, а 0,45 это 45 сотых. Значит 0,5 больше.', uz: "To'g'ri. 0,5 = 0,50 bu 50 yuzdan, 0,45 esa 45 yuzdan. Demak 0,5 katta." },
    wrong_1: { ru: '0,45 больше 0,5 — это ошибка. 0,5 = 0,50 это 50 сотых, а 0,45 это 45.', uz: "0,45 katta 0,5 dan — bu xato. 0,5 = 0,50 bu 50 yuzdan, 0,45 esa 45 yuzdan." },
    wrong_2: { ru: '2,3 округляется до 2, а не до 3: следующая цифра 3 меньше пяти, округляем вниз.', uz: "2,3 yaxlitlanib 2 bo'ladi, 3 emas: keyingi raqam 3, u beshdan kichik, pastga yaxlitlaymiz." },
    wrong_3: { ru: '0,7 не равно 0,07. 0,7 это семь десятых, 0,07 это семь сотых — в десять раз меньше.', uz: "0,7 teng emas 0,07 ga. 0,7 — o'ndan yetti, 0,07 — yuzdan yetti, o'n marta kichik." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Число пи равно 3,14159… и бесконечно. 3,14 — это уже округлённое значение.', uz: "Pi soni 3,14159… ga teng va cheksiz. 3,14 — bu allaqachon yaxlitlangan qiymat." }
    },
    audio: {
      intro: { ru: 'Итоговый вопрос. Из четырёх утверждений выберите верное. Помните про сравнение и округление.', uz: "Yakuniy savol. To'rt tasdiqdan to'g'risini tanlang. Solishtirish va yaxlitlashni esda tuting." },
      on_correct: { ru: 'Верно, ноль целых пять десятых больше. И напоследок интересный факт. Число пи бесконечно: его цифры после запятой никогда не заканчиваются. Поэтому в вычислениях мы используем его округлённым, чаще всего до трёх целых четырнадцати сотых.', uz: "To'g'ri, nol butun o'ndan besh katta. Va nihoyat qiziqarli fakt. Pi soni cheksiz: uning verguldan keyingi raqamlari hech qachon tugamaydi. Shuning uchun hisoblashlarda biz uni yaxlitlab, ko'pincha uch butun yuzdan o'n to'rtgacha ishlatamiz." },
      on_wrong: { ru: 'Не совсем. Проверьте каждое: допишите нули, посмотрите следующую цифру.', uz: "Unchalik emas. Har birini tekshiring: nol qo'shing, keyingi raqamga qarang." }
    }
  },

  // ── s14 SUMMARY ───────────────────────────────────────────────────
  s14: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    title: { ru: 'Итак, теперь вы умеете сравнивать и округлять десятичные дроби.', uz: "Demak, endi siz o'nli kasrlarni solishtirish va yaxlitlashni bilasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    points: {
      ru: [
        'Сравнение: выровняйте по запятой, допишите нули, сравните разряд за разрядом. Решает значение, а не число цифр.',
        'Округление: если следующая цифра 5 или больше — вверх, меньше 5 — вниз. Или ближайшая метка на прямой.',
        '0,5 = 0,50 = 0,500. Нули в конце не меняют значение числа.'
      ],
      uz: [
        "Solishtirish: vergul bo'yicha tenglang, nol qo'shing, razryadma-razryad solishtiring. Raqam soni emas, qiymat hal qiladi.",
        "Yaxlitlash: keyingi raqam 5 yoki undan katta bo'lsa yuqoriga, 5 dan kichik bo'lsa pastga. Yoki o'qdagi eng yaqin belgiga.",
        "0,5 = 0,50 = 0,500. Oxirdagi nollar sonning qiymatini o'zgartirmaydi."
      ]
    },
    hook_close: { ru: 'Помните загадку про прыжки? Мафтуна победила: 1,5 = 1,50 это 150 сантиметров, а 1,45 это 145. Значит 1,5 больше — дело в разрядах, а не в числе цифр.', uz: "Sakrash topishmog'i yodingizdami? Maftuna g'olib: 1,5 = 1,50 — bu 150 santimetr, 1,45 esa 145. Demak 1,5 katta — gap razryadda, raqam sonida emas." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Десятичная дробь — концепт», «Сравнение и округление натуральных чисел», «Эквивалентные дроби».', uz: "«O'nli kasr — tushuncha», «Natural sonlarni solishtirish va yaxlitlash», «Ekvivalent kasrlar»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сложение и вычитание десятичных дробей.', uz: "o'nli kasrlarni qo'shish va ayirish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Итак, сегодня мы научились сравнивать и округлять десятичные дроби. Чтобы сравнить, выравниваем по запятой, дописываем нули и смотрим по разрядам. Чтобы округлить, смотрим на следующую цифру: пять или больше — вверх, меньше — вниз. И помните: длина числа не главное. Дальше нас ждёт сложение и вычитание десятичных дробей.', uz: "Demak, bugun o'nli kasrlarni solishtirish va yaxlitlashni o'rgandik. Solishtirish uchun vergul bo'yicha tenglaymiz, nol qo'shamiz va razryadlarga qaraymiz. Yaxlitlash uchun keyingi raqamga qaraymiz: besh yoki undan katta — yuqoriga, kichik — pastga. Va esda tuting: sonning uzunligi muhim emas. Keyingi darsda o'nli kasrlarni qo'shish va ayirish bizni kutadi." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОРЫ dec_5_02 (модульный уровень)
// ============================================================
const decFmt = (v) => String(v).replace('.', ',');

// DecimalGrid — единичный квадрат: десятые (10 полос) или сотые (10×10).
const DecimalGrid = ({ value = 0, mode = 'tenths', color = T.accent, sz = 132, anim = false, live = false }) => {
  if (mode === 'tenths') {
    const cols = Math.round(value * 10);
    return (
      <div className={'dg-square dg-tenths' + (live ? ' dg-live' : '')} style={{ width: sz, height: sz }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={'dg-col' + (i < cols ? ' dg-on' : '')}
            style={{ background: i < cols ? color : undefined, animationDelay: anim ? (i * 0.05) + 's' : undefined }}/>
        ))}
      </div>
    );
  }
  const filled = Math.round(value * 100);
  return (
    <div className={'dg-square dg-hgrid' + (live ? ' dg-live' : '')} style={{ width: sz, height: sz }}>
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className={'dg-cell' + (i < filled ? ' dg-on' : '')}
          style={{ background: i < filled ? color : undefined, animationDelay: anim ? (i * 0.01) + 's' : undefined }}/>
      ))}
    </div>
  );
};

const DecLabel = ({ value, color, accent, text }) => (
  <span className={'display' + (accent ? ' num-accent' : '')} style={{ fontSize: 'clamp(26px, 5vw, 38px)', color: color || T.ink, fontVariantNumeric: 'tabular-nums', display: 'inline-block' }}>{text != null ? text : decFmt(value)}</span>
);

// Разрядная таблица: единицы | , | десятые | сотые | тысячные.
const PlaceTable = ({ whole = 0, tenths = null, hundredths = null, thousandths = null, highlight = '', live = false }) => {
  const t = useT();
  const cols = [
    { key: 'birlar', label: { ru: 'Ед.', uz: 'Birlar' }, val: whole },
    { key: 'ondan', label: { ru: 'Десятые', uz: "O'ndan" }, val: tenths },
    { key: 'yuzdan', label: { ru: 'Сотые', uz: 'Yuzdan' }, val: hundredths },
    { key: 'mingdan', label: { ru: 'Тысячные', uz: 'Mingdan' }, val: thousandths },
  ];
  return (
    <div className={'pt-wrap' + (live ? ' pt-live' : '')}>
      {cols.map((col, i) => (
        <React.Fragment key={col.key}>
          {i === 1 && <div className="pt-comma" aria-hidden="true">,</div>}
          <div className={'pt-col' + (highlight === col.key ? ' pt-hi' : '')}>
            <div className="pt-cell">{col.val === null ? '' : col.val}</div>
            <div className="pt-label mono">{t(col.label)}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

// HOOK s0: JumpBars — два спортивных столбика с числами, поднимаются волной (loop, CSS-only).
const JumpBars = () => (
  <div className="jb-wrap">
    <div className="jb-col">
      <div className="jb-bar jb-a"><span className="jb-val mono small">1,45</span></div>
      <div className="jb-name mono small">Jahongir</div>
    </div>
    <div className="jb-col">
      <div className="jb-bar jb-b"><span className="jb-val mono small">1,5</span></div>
      <div className="jb-name mono small">Maftuna</div>
    </div>
  </div>
);

// RoundLine — числовая прямая для округления: метка value + подсветка ближайшей.
const RoundLine = ({ lo, hi, value, highlight = null, divisions = 10 }) => {
  const span = hi - lo;
  const pos = ((value - lo) / span) * 100;
  return (
    <div className="rl-track">
      <div className="rl-line"/>
      {Array.from({ length: divisions + 1 }).map((_, i) => {
        const tv = lo + (span * i / divisions);
        const left = (i / divisions) * 100;
        const isEnd = i === 0 || i === divisions;
        const isHi = highlight != null && Math.abs(tv - highlight) < 1e-9;
        return (
          <div key={i} className="rl-tick-wrap" style={{ left: left + '%' }}>
            <span className={'rl-tick' + (isEnd ? ' rl-tick-major' : '') + (isHi ? ' rl-tick-hi' : '')}/>
            {(isEnd || isHi) && <span className={'rl-num mono small' + (isHi ? ' rl-num-hi' : '')}>{decFmt(Number(tv.toFixed(2)))}</span>}
          </div>
        );
      })}
      <div className="rl-marker" style={{ left: pos + '%' }}>
        <span className="rl-marker-val mono small">{decFmt(value)}</span>
        <span className="rl-marker-dot"/>
      </div>
    </div>
  );
};

// Ambient-движение для разрежённых экранов (правила, summary): мягкие плавающие круги.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    <span className="amb-o amb-o1"/>
    <span className="amb-o amb-o2"/>
    <span className="amb-o amb-o3"/>
  </div>
);

// ============================================================
// ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста (CSS-only, после верного).
// ============================================================
const FACT_BADGE = { ru: 'Знаешь ли ты? · IT', uz: "Bilasizmi? · IT" };
// запятая ↔ точка: разделитель мигает (страны / программирование).
const AnimDot = () => (<div className="fa-dot"><span className="fa-dot-n">3</span><span className="fa-dot-sep"><span className="fa-dot-c">,</span><span className="fa-dot-p">.</span></span><span className="fa-dot-n">14</span></div>);
// линейка: 10 делений + бегущая подсветка (приборы измеряют до долей).
const AnimRuler = () => (<div className="fa-rul">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <span key={i} className="fa-rul-t" style={{ animationDelay: (i * 0.12) + 's' }}/>)}</div>);
// пи: круг + символ π + точка по орбите (π ↔ окружность; без десятичного текста — не сдвигается).
const AnimPi = () => (<div className="fa-pi"><span className="fa-pi-orb"/><span className="fa-pi-sym">π</span></div>);

const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      <div className="fact-anim">{anim}</div>
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge || FACT_BADGE)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
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

const optEl = (t, node) => <span className="body" style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>{mt(t(node))}</span>;

// Иконки ✓/✗ — feedback не только цветом (accessibility).
const IconOk = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>);
const IconNo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

// s0 — HOOK (концептуальный) с анимацией JumpBars
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt_yes, c.opt_no, c.opt_idk];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
    setTimeout(() => onNext(), 650);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px) clamp(10px, 2vw, 16px)', display: 'flex', justifyContent: 'center' }}>
          <JumpBars/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.objection))}</p>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0 }}>{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s1 — WARM-UP (spaced retrieval, не scored) через QuestionScreen
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// Универсальный exploration step-gated (s2/s3/s4)
const ExplorationStep = ({ screen, onNext, onPrev, cKey, render }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT[cKey];
  const audio = useAudio(makeAudioSegments(c, lang));
  const segs = c.audio[lang] || c.audio.ru;
  const caps = c.step_labels[lang] || c.step_labels.ru;
  const STEPS = segs.length;
  const [step, setStep] = useState(0);
  const stepEndRef = useRef(null);
  const done = step >= STEPS - 1;
  const advance = () => { if (done) return; setStep(s => s + 1); audio.triggerEvent('button_click', 'step'); };
  useEffect(() => { if (stepEndRef.current) stepEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [step]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className={done ? 'frame fade-up dg-glow' : 'frame fade-up'} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          {render(step, done)}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={advance} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p ref={stepEndRef} className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[step])}</p>
      </div>
    </Stage>
  );
};

const Screen2 = (props) => (
  <ExplorationStep {...props} cKey="s2" render={(step, done) => {
    const filled = step >= 1;   // на 1-м нажатии клетки закрашиваются
    const split = step >= 2;    // на 2-м — дописываем ноль: 5 полос → 50 клеток
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px, 3vw, 24px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <DecimalGrid key={split ? 'h' : 't'} value={filled ? 0.5 : 0} mode={split ? 'hundredths' : 'tenths'} color={T.accent} sz={108} anim={filled} live={filled}/>
          <DecLabel text={split ? '0,50' : '0,5'} color={done ? T.success : T.ink} accent={done}/>
        </div>
        {done && <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success, paddingBottom: 30 }}>&gt;</span>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <DecimalGrid value={filled ? 0.45 : 0} mode="hundredths" color={T.blue} sz={108} anim={filled} live={filled}/>
          <DecLabel value={0.45} color={T.blue}/>
        </div>
      </div>
    );
  }}/>
);

const Screen3 = (props) => (
  <ExplorationStep {...props} cKey="s3" render={(step, done) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ minWidth: 56, display: 'flex', justifyContent: 'flex-end' }}><DecLabel value={3.2} color={done ? T.success : T.ink} accent={done}/></span>
        <PlaceTable whole={3} tenths={2} hundredths={step >= 1 ? 0 : null} thousandths={null} highlight={done ? 'ondan' : ''} live={done}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ minWidth: 56, display: 'flex', justifyContent: 'flex-end' }}><DecLabel value={3.15} color={T.ink2}/></span>
        <PlaceTable whole={3} tenths={1} hundredths={5} thousandths={null} highlight={done ? 'ondan' : ''} live={done}/>
      </div>
    </div>
  )}/>
);

const Screen4 = (props) => (
  <ExplorationStep {...props} cKey="s4" render={(step, done) => {
    const cfg = step >= 2
      ? { lo: 3, hi: 4, value: 3.7, highlight: done ? 4 : null }
      : { lo: 0.4, hi: 0.5, value: 0.46, highlight: step >= 1 ? 0.5 : null };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: 380, paddingTop: 28, paddingBottom: 6 }}>
          <RoundLine lo={cfg.lo} hi={cfg.hi} value={cfg.value} highlight={cfg.highlight}/>
        </div>
        {cfg.highlight != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DecLabel value={cfg.value} color={T.ink}/>
            <span className="mono" style={{ color: T.ink2, fontSize: 'clamp(16px, 3vw, 20px)' }}>≈</span>
            <DecLabel value={cfg.highlight} color={T.success} accent={true}/>
          </div>
        )}
      </div>
    );
  }}/>
);

// s5 — RULE 1 (сравнение) + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px, 3vw, 22px)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <PlaceTable whole={0} tenths={5} hundredths={0} thousandths={null} highlight="ondan"/>
            <span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 28px)', color: T.ink3, paddingBottom: 26 }}>&gt;</span>
            <PlaceTable whole={0} tenths={4} hundredths={5} thousandths={null} highlight="ondan"/>
          </div>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_note))}</p>
      </div>
    </Stage>
  );
};

// s6 — RULE 2 (округление + предупреждение M2) + ambient
const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 360, paddingTop: 26, paddingBottom: 4 }}>
            <RoundLine lo={0.4} hi={0.5} value={0.46} highlight={0.5}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DecLabel value={0.46} color={T.ink}/>
            <span className="mono" style={{ color: T.ink2, fontSize: 'clamp(16px, 3vw, 20px)' }}>≈</span>
            <DecLabel value={0.5} color={T.success}/>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.warning_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warning))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s7 — TEST MC: самое большое (correct A) + Факт запятая/точка
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={7} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[7]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimDot/>}/>}/>;
};

// s8 — TEST drag-ordering (tap-card → tap-slot, веди-до-верного)
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const cards = c.cards[lang] || c.cards.ru;
  const order = c.order;
  const wasSolved = storedAnswer?.solved === true;
  const [slots, setSlots] = useState(() => wasSolved ? order.slice() : Array(order.length).fill(null));
  const [locked, setLocked] = useState(() => wasSolved ? new Set(order.map((_, i) => i)) : new Set());
  const [sel, setSel] = useState(null);
  const [feedback, setFeedback] = useState(wasSolved ? 'done' : null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const used = new Set(slots.filter(Boolean));
  const pool = cards.filter(cd => !used.has(cd.id));
  const allPlaced = slots.every(Boolean);
  const done = locked.size === order.length;
  const labelOf = (id) => { const cd = cards.find(x => x.id === id); return cd ? cd.label : ''; };
  const placeInSlot = (cardId, slotIdx) => {
    if (locked.has(slotIdx)) return;
    setSlots(prev => { const next = prev.map(v => v === cardId ? null : v); next[slotIdx] = cardId; return next; });
    setSel(null); setFeedback(null);
  };
  const clearSlot = (slotIdx) => {
    if (locked.has(slotIdx)) return;
    setSlots(prev => { const next = prev.slice(); next[slotIdx] = null; return next; });
    setFeedback(null);
  };
  const check = () => {
    if (!allPlaced || done) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    let allOk = true; const nextLocked = new Set(locked); const nextSlots = slots.slice();
    order.forEach((want, i) => { if (locked.has(i)) return; if (slots[i] === want) nextLocked.add(i); else { allOk = false; nextSlots[i] = null; } });
    attemptsRef.current += 1;
    if (firstTryRef.current === null) firstTryRef.current = allOk;
    setLocked(nextLocked); setSlots(nextSlots);
    if (allOk) {
      sfx.playCorrect(); setFeedback('done');
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.instruction[lang], correctAnswer: 'order', studentAnswer: 'order', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
    } else {
      sfx.playWrong(); setFeedback('wrong');
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.instruction))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 1.6vw, 12px)', minHeight: 50, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 ? <span className="mono small" style={{ color: T.ink3 }}>{mt(t(c.ok_text))}</span> : pool.map(cd => (
            <button key={cd.id} className="chip chip-pop" onClick={() => setSel(sel === cd.id ? null : cd.id)}
              style={{ padding: '10px 16px', fontSize: 'clamp(15px, 2.8vw, 19px)', background: T.ink, outline: sel === cd.id ? `3px solid ${T.accent}` : 'none' }}>
              {cd.label}
            </button>
          ))}
        </div>
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(6px, 1.4vw, 10px)' }}>
          {slots.map((slotVal, i) => {
            const isLocked = locked.has(i);
            return (
              <div key={i} onClick={() => { if (isLocked) return; if (slotVal) clearSlot(i); else if (sel !== null) placeInSlot(sel, i); }}
                className="do-slot"
                style={{ cursor: isLocked ? 'default' : 'pointer', background: isLocked ? T.successSoft : T.paper, boxShadow: isLocked ? '0 8px 22px -6px rgba(31, 122, 77, 0.32)' : `0 6px 16px -6px rgba(${T.shadowBase}, 0.14)` }}>
                <div className="do-rank mono small" style={{ color: T.ink3 }}>{i + 1}</div>
                <div className="do-cell">
                  {slotVal ? <span className="chip" style={{ background: isLocked ? T.success : T.ink, padding: '7px 12px', fontSize: 'clamp(14px, 2.6vw, 18px)' }}>{labelOf(slotVal)}</span> : <span className="mono small" style={{ color: T.ink3 }}>?</span>}
                </div>
                {isLocked && <span style={{ color: T.success, display: 'flex' }}><IconOk/></span>}
              </div>
            );
          })}
        </div>
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: done ? T.success : (feedback === 'wrong' ? T.accent : T.ink2), fontWeight: done || feedback === 'wrong' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {done && <IconOk/>}{feedback === 'wrong' && <IconNo/>}{mt(t(done ? c.done_text : (feedback === 'wrong' ? c.wrong_text : (allPlaced ? c.ok_text : c.hint))))}
        </p>
        {!done && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s9 — TEST NumInput: округлить 0,47 до десятых → 0,5
const Screen9 = (props) => {
  const c = CONTENT.s9;
  return <NumInputScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} correctValue={0.5}
    renderVisual={() => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <DecLabel value={0.47} color={T.ink}/>
        <PlaceTable whole={0} tenths={4} hundredths={7} thousandths={null} highlight=""/>
      </div>
    )}/>;
};

// s10 — TEST find-the-wrong (correct B, ориг. idx 2)
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 2, 1, 3]);
  const question = (<h2 className="title h-sub">{t(c.question_pre)}{' '}<span className="italic" style={{ color: T.accent }}>{t(c.question_em)}</span>{t(c.question_post)}</h2>);
  return <QuestionScreen {...props} idx={10} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[10]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s11 — CASE setup
const Screen11 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 4vw, 32px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><DecLabel value={4.25} color={T.blue}/><span className="mono small" style={{ color: T.ink3 }}>{lang === 'uz' ? '1-urinish · m' : '1-я попытка · м'}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><DecLabel value={4.3} color={T.accent}/><span className="mono small" style={{ color: T.ink3 }}>{lang === 'uz' ? '2-urinish · m' : '2-я попытка · м'}</span></div>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.question_setup))}</h2>
      </div>
    </Stage>
  );
};

// s12 — TEST case MC: 4,3 дальше (correct C, ориг. idx 0) + Факт линейка
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0, 3]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimRuler/>}/>}/>;
};

// s13 — FINAL (MC, correct D, ориг. idx 0) + Факт пи
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<h2 className="title h-sub">{mt(t(c.question))}</h2>);
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimPi/>}/>}/>;
};

// s14 — SUMMARY + закрытие hook + связи + ambient
const Screen14 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = c.points[lang] || c.points.ru;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <DecLabel value={1.5} color={T.ink2}/><span className="display" style={{ fontSize: 'clamp(20px, 3.6vw, 26px)', color: T.success }}>&gt;</span><DecLabel value={1.45} color={T.ink2}/>
          </div>
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
export default function DecimalCompareRoundLesson({
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

  const [current, setCurrent] = useState(0); useEffect(()=>{window.__goScreen=(i)=>setCurrent(i);window.__total=TOTAL_SCREENS;},[]);/*SCROLLPROBE*/
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
/* MATH frac_5_10: ФАКТ-БЛОК (IT) — синяя карта + мини-анимации (loop, CSS-only). */
.fact-card { display: flex; gap: 14px; align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(82px, 17vw, 120px); height: clamp(54px, 12vw, 80px); display: flex; align-items: center; justify-content: center; }
.fact-anim > * { transform: scale(1.55); }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.38; color: #0E0E10; }
/* MATH frac_5_15: drag-чипы (touch + tap). */
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
/* MATH frac_5_15: ambient — мягкие плавающие круги на разрежённых экранах (декор, pointer-events:none). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }
/* MATH frac_5_15: факт-карта — КРУПНАЯ анимация, меньше текста (PROMPT 2026-06-13). */
.fact-card { gap: clamp(12px, 2.5vw, 18px); }
.fact-anim { width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); }
.fact-text { font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; }
/* MATH dec_5_01: DecimalGrid — единичный квадрат как десятые (10 полос) / сотые (10×10). */
.dg-square { display: grid; border: 2px solid rgba(58, 53, 48, 0.35); border-radius: 6px; overflow: hidden; background: #FFFFFF; flex-shrink: 0; }
.dg-tenths { grid-template-columns: repeat(10, 1fr); }
.dg-col { border-right: 1px solid rgba(58, 53, 48, 0.15); transition: background 0.45s ease, border-color 0.35s ease; }
.dg-col:last-child { border-right: none; }
.dg-hgrid { grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(10, 1fr); grid-auto-flow: column; }
.dg-cell { border-right: 1px solid rgba(58, 53, 48, 0.08); border-bottom: 1px solid rgba(58, 53, 48, 0.08); transition: background 0.45s ease, border-color 0.35s ease; }
.dg-live .dg-cell, .dg-live .dg-col { transition: background 0.1s ease; }
/* закрашенная доля «живёт»: вход dgPop + бесконечное мягкое мерцание dgShine (как ub-cell-on в Dars18/19) */
/* закрашенная доля: цвет ЧЕРЕЗ КЛАСС (без transition, чтобы не конфликтовал с dgPop) + бесконечное dgShine → «живёт», не пропадает */
.dg-on { background: #FF4F28; transition: none; animation: dgPop 0.42s cubic-bezier(0.34, 1.2, 0.64, 1) backwards, dgShine 2.6s ease-in-out infinite; }
.dg-on.dg-ok { background: #1F7A4D; }
@keyframes dgPop { 0% { opacity: 0; transform: scale(0.45); } 100% { opacity: 1; transform: scale(1); } }
@keyframes dgShine { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.12); } }
/* свечение рамки при done — через BOX-SHADOW (не filter на родителе, чтобы не сбивать анимации клеток) */
.dg-glow { animation: dgGlow 0.9s ease; }
@keyframes dgGlow { 0% { box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); } 50% { box-shadow: 0 12px 34px -4px rgba(31, 122, 77, 0.5); } 100% { box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); } }
/* MATH dec_5_01: PlaceTable — разрядная таблица (единицы | , | десятые | сотые | тысячные). */
.pt-wrap { display: flex; align-items: stretch; gap: 5px; justify-content: center; }
.pt-comma { display: flex; align-items: flex-end; padding-bottom: 26px; font-family: 'Fraunces', serif; font-size: clamp(24px, 4.4vw, 32px); color: #FF4F28; font-weight: 600; }
.pt-col { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: clamp(44px, 9vw, 58px); }
.pt-cell { width: 100%; height: clamp(38px, 7vw, 46px); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: clamp(20px, 3.6vw, 26px); color: #0E0E10; background: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.18); }
.pt-hi .pt-cell { background: #FFE8E1; color: #FF4F28; box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.30); }
.pt-label { color: #5A5A60; font-size: clamp(9px, 1.3vw, 11px); text-align: center; line-height: 1.1; }
/* MATH dec_5_01: HookGrid — s0 loop-анимация (полосы заливаются волной до 0,5). */
.hg-wrap { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2vw, 14px); }
.hg-square { display: grid; grid-template-columns: repeat(10, 1fr); width: clamp(160px, 32vw, 210px); height: clamp(82px, 16vw, 108px); border: 2px solid rgba(58, 53, 48, 0.35); border-radius: 6px; overflow: hidden; background: #FFFFFF; }
.hg-col { border-right: 1px solid rgba(58, 53, 48, 0.14); }
.hg-col:last-child { border-right: none; }
.hg-on { background: #FF4F28; opacity: 0; animation: hgFill 4.6s ease-in-out infinite; }
@keyframes hgFill { 0% { opacity: 0; } 15%, 68% { opacity: 1; } 88%, 100% { opacity: 0; } }
.hg-cap { display: inline-flex; align-items: center; gap: 8px; }
.hg-comma { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 30px); color: #FF4F28; font-weight: 600; }
.hg-eq { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; }
/* MATH dec_5_01: classify — корзины разрядов (tap-card → tap-bin). */
.cl-bin { border-radius: 12px; padding: clamp(8px, 1.6vw, 12px); display: flex; flex-direction: column; gap: 8px; align-items: center; transition: box-shadow 0.2s; }
.cl-slot { min-height: 42px; display: flex; align-items: center; justify-content: center; }
.cl-label { color: #5A5A60; }
/* MATH dec_5_01: db-box — клетка десятичного знака (fill-in-blank 0,▢). */
.db-box { width: clamp(48px, 9vw, 62px); font-family: 'Fraunces', serif; font-size: clamp(24px, 4.4vw, 32px); font-weight: 400; text-align: center; border: none; border-radius: 10px; background: #FFFFFF; padding: 6px 8px; outline: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.2s; }
.db-box:focus { box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.db-box.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.db-box::-webkit-outer-spin-button, .db-box::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
/* MATH dec_5_01: nlp — числовая прямая 0..1 для теста-расстановки метки. */
.nlp-track { position: relative; height: 30px; margin: 0 16px; }
.nlp-line { position: absolute; left: 0; right: 0; top: 50%; height: 4px; background: rgba(167, 166, 162, 0.35); border-radius: 99px; transform: translateY(-50%); }
.nlp-fill { position: absolute; left: 0; top: 50%; height: 4px; background: #FF4F28; border-radius: 99px; transform: translateY(-50%); transition: width 0.25s ease; box-shadow: 0 0 8px rgba(255, 79, 40, 0.45); }
.nlp-tick-hit { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 28px; height: 34px; background: transparent; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; }
.nlp-tick-hit:disabled { cursor: default; }
.nlp-tick { width: 2px; height: 12px; background: #A7A6A2; border-radius: 2px; }
.nlp-tick-major { height: 18px; width: 2.5px; background: #0E0E10; }
.nlp-tick-num { position: absolute; top: 21px; left: 50%; transform: translateX(-50%); color: #A7A6A2; }
.nlp-marker { position: absolute; bottom: 16px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; transition: left 0.25s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 3; }
.nlp-marker-dot { width: 16px; height: 16px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 0 5px rgba(255, 79, 40, 0.16), 0 0 12px rgba(255, 79, 40, 0.55); }
.nlp-marker-ok .nlp-marker-dot { background: #1F7A4D; box-shadow: 0 0 0 5px rgba(31, 122, 77, 0.16), 0 0 12px rgba(31, 122, 77, 0.55); }
.nlp-marker-val { margin-bottom: 4px; color: #FF4F28; font-weight: 600; }
.nlp-marker-ok .nlp-marker-val { color: #1F7A4D; }
/* MATH dec_5_01: факт-анимации (КРУПНЫЕ, CSS-only loop). */
.fa-ksh { display: flex; align-items: flex-end; gap: 5px; height: 42px; }
.fa-ksh i { width: 9px; border-radius: 3px; background: #019ACB; opacity: 0.22; animation: faKsh 2.9s ease-in-out infinite; }
.fa-ksh i:nth-child(1) { height: 58%; animation-delay: 0s; }
.fa-ksh i:nth-child(2) { height: 80%; animation-delay: 0.3s; }
.fa-ksh i:nth-child(3) { height: 100%; animation-delay: 0.6s; }
.fa-ksh-c { align-self: flex-end; width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; animation: faKshC 2.9s ease-in-out infinite; }
@keyframes faKsh { 0%, 8% { opacity: 0.2; } 40%, 70% { opacity: 1; } 100% { opacity: 0.2; } }
@keyframes faKshC { 0%, 48% { opacity: 0.3; transform: scale(0.7); } 62%, 90% { opacity: 1; transform: scale(1); } 100% { opacity: 0.3; transform: scale(0.7); } }
.fa-stp { position: relative; width: 42px; height: 42px; border-radius: 50%; border: 3px solid #019ACB; }
.fa-stp::before { content: ''; position: absolute; left: 50%; top: -7px; width: 7px; height: 5px; background: #019ACB; transform: translateX(-50%); border-radius: 2px 2px 0 0; }
.fa-stp-sweep { position: absolute; left: 50%; top: 50%; width: 2.5px; height: 42%; background: #FF4F28; transform-origin: bottom center; border-radius: 2px; animation: faStp 1.5s linear infinite; }
.fa-stp-c { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; border-radius: 50%; background: #019ACB; transform: translate(-50%, -50%); }
@keyframes faStp { from { transform: translate(-50%, -100%) rotate(0deg); } to { transform: translate(-50%, -100%) rotate(360deg); } }
.fa-rul { position: relative; display: flex; align-items: flex-end; gap: 3px; height: 30px; padding-bottom: 4px; border-bottom: 3px solid #019ACB; }
.fa-rul-t { width: 2.5px; height: 11px; background: #019ACB; opacity: 0.35; border-radius: 1px; animation: faRul 2.6s ease-in-out infinite; }
.fa-rul-t:nth-child(5n+1) { height: 17px; }
@keyframes faRul { 0%, 100% { opacity: 0.3; transform: scaleY(0.7); } 50% { opacity: 1; transform: scaleY(1); } }
/* Accessibility: уважение к prefers-reduced-motion (PROMPT 2026-06-13) — гасим декоративные циклы. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
/* MATH dec_5_02: JumpBars — s0 hook loop (два столбика поднимаются волной). */
.jb-wrap { display: flex; align-items: flex-end; gap: clamp(22px, 6vw, 48px); justify-content: center; height: clamp(96px, 19vw, 130px); }
.jb-col { display: flex; flex-direction: column; align-items: center; gap: 7px; }
.jb-bar { width: clamp(40px, 9vw, 58px); border-radius: 8px 8px 0 0; position: relative; display: flex; align-items: flex-start; justify-content: center; padding-top: 6px; transform-origin: bottom; box-shadow: 0 8px 20px -8px rgba(58, 53, 48, 0.3); }
.jb-a { height: clamp(70px, 14vw, 96px); background: linear-gradient(180deg, #019ACB, #6fc7e3); animation: jbRise 3.4s ease-in-out infinite; }
.jb-b { height: clamp(74px, 15vw, 102px); background: linear-gradient(180deg, #FF4F28, #ff8a6e); animation: jbRise 3.4s ease-in-out infinite 0.3s; }
@keyframes jbRise { 0% { transform: scaleY(0.18); } 22%, 64% { transform: scaleY(1); } 90%, 100% { transform: scaleY(0.18); } }
.jb-val { color: #FFFFFF; font-weight: 700; }
.jb-name { color: #5A5A60; }
/* MATH dec_5_02: RoundLine — числовая прямая для округления (метка + подсветка ближайшей). */
.rl-track { position: relative; height: 30px; margin: 0 18px; }
.rl-line { position: absolute; left: 0; right: 0; top: 50%; height: 4px; background: rgba(167, 166, 162, 0.35); border-radius: 99px; transform: translateY(-50%); }
.rl-tick-wrap { position: absolute; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; }
.rl-tick { width: 2px; height: 12px; background: #A7A6A2; border-radius: 2px; }
.rl-tick-major { height: 18px; width: 2.5px; background: #0E0E10; }
.rl-tick-hi { height: 22px; width: 3px; background: #1F7A4D; box-shadow: 0 0 8px rgba(31, 122, 77, 0.5); }
.rl-num { position: absolute; top: 21px; left: 50%; transform: translateX(-50%); color: #A7A6A2; white-space: nowrap; }
.rl-num-hi { color: #1F7A4D; font-weight: 600; }
.rl-marker { position: absolute; bottom: 16px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; transition: left 0.3s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 3; }
.rl-marker-dot { width: 16px; height: 16px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 0 5px rgba(255, 79, 40, 0.16), 0 0 12px rgba(255, 79, 40, 0.55); animation: rlPulse 1.8s ease-in-out infinite; }
@keyframes rlPulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 4px rgba(255, 79, 40, 0.14), 0 0 10px rgba(255, 79, 40, 0.5); } 50% { transform: scale(1.32); box-shadow: 0 0 0 7px rgba(255, 79, 40, 0.22), 0 0 16px rgba(255, 79, 40, 0.7); } }
.rl-marker-val { margin-bottom: 4px; color: #FF4F28; font-weight: 600; }
/* MATH dec_5_02: DragOrder — слоты для расстановки по возрастанию (tap-card → tap-slot). */
.do-slot { border-radius: 12px; padding: clamp(7px, 1.4vw, 10px); display: flex; flex-direction: column; gap: 5px; align-items: center; transition: box-shadow 0.2s; min-height: 86px; justify-content: center; }
.do-rank { line-height: 1; }
.do-cell { min-height: 38px; display: flex; align-items: center; justify-content: center; }
/* MATH dec_5_02: акцент НЕ на анимации кадра — глоу рамки выключен. */
.dg-glow { animation: none !important; }
/* ПОСТОЯННАЯ «живая» анимация (как vc-c-glow в dars23): блик скользит по закрашенной
   сетке всё время, пока клетки закрашены — не привязана к done, поэтому не исчезает. */
.dg-square.dg-live { position: relative; }
.dg-square.dg-live::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, 0.55) 50%, transparent 62%); animation: dgSweep 2.8s ease-in-out infinite; }
@keyframes dgSweep { 0% { transform: translateX(-130%); } 55%, 100% { transform: translateX(130%); } }
/* ПОСТОЯННЫЙ пульс запятой в разрядной таблице (как vc-c-glow в dars23) — всегда живой. */
.pt-comma { animation: ptCommaPulse 2.4s ease-in-out infinite; }
@keyframes ptCommaPulse { 0%, 100% { transform: scale(1); text-shadow: 0 0 0 rgba(255, 79, 40, 0); } 50% { transform: scale(1.2); text-shadow: 0 2px 11px rgba(255, 79, 40, 0.55); } }
.pt-live .pt-hi .pt-cell { animation: ptPulse 1.9s ease-in-out infinite; }
@keyframes ptPulse { 0%, 100% { transform: scale(1); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.30); } 50% { transform: scale(1.06); box-shadow: 0 8px 24px -3px rgba(255, 79, 40, 0.62); } }
/* АКЦЕНТ на числах: результат-числа заметно пульсируют (взгляд идёт к числам, не к фону). */
.num-accent { animation: numPulse 1.9s ease-in-out infinite; transform-origin: center; }
@keyframes numPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { transform: scale(1.14); filter: drop-shadow(0 2px 9px rgba(31, 122, 77, 0.42)); } }
/* MATH dec_5_02: факт-карта — анимация НЕ выходит за рамки, нативно крупная (PROMPT §5-A). */
.fact-anim { overflow: hidden; }
.fact-anim > * { transform: none !important; }
/* линейка крупнее (без scale). */
.fa-rul { height: 50px; gap: 4px; align-items: flex-end; }
.fa-rul-t { width: 3px; height: 18px; }
.fa-rul-t:nth-child(5n+1) { height: 30px; }
/* запятая ↔ точка: «3 [,|.] 14», разделитель меняется НА МЕСТЕ (не сдвигается). */
.fa-dot { display: flex; align-items: center; justify-content: center; gap: 2px; height: 52px; font-family: 'Fraunces', serif; font-weight: 600; color: #019ACB; }
.fa-dot-n { font-size: 34px; line-height: 1; }
.fa-dot-sep { position: relative; width: 12px; height: 34px; flex-shrink: 0; }
.fa-dot-c, .fa-dot-p { position: absolute; left: 50%; bottom: 2px; transform: translateX(-50%); font-size: 34px; line-height: 1; color: #FF4F28; }
.fa-dot-c { animation: faDotC 2.6s ease-in-out infinite; }
.fa-dot-p { animation: faDotP 2.6s ease-in-out infinite; }
@keyframes faDotC { 0%, 42% { opacity: 1; } 52%, 100% { opacity: 0; } }
@keyframes faDotP { 0%, 42% { opacity: 0; } 52%, 100% { opacity: 1; } }
/* пи: круг + π + точка по орбите (π ↔ окружность; без десятичного текста). */
.fa-pi { position: relative; width: 56px; height: 56px; border-radius: 50%; border: 3px solid #019ACB; display: flex; align-items: center; justify-content: center; }
.fa-pi-sym { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; color: #019ACB; }
.fa-pi-orb { position: absolute; top: -5px; left: 50%; width: 9px; height: 9px; border-radius: 50%; background: #FF4F28; transform-origin: 50% 33px; animation: faPiOrb 3.4s linear infinite; }
@keyframes faPiOrb { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }
`;
