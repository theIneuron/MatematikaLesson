import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Отрицательные числа на координатной прямой — neg_5_01 (Dars32)
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
        {/* keep-visible anti-scroll: to'g'ri javobdan keyin savol+to'g'ri variant qoladi, noto'g'rilar ketma-ket yig'iladi. */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;   // noto'g'ri variantlar yig'iladi
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
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} disabled={solved}
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
// --- POD UROK: neg_5_01 — Manfiy sonlar koordinata to'g'ri chizig'ida / Отрицательные числа на координатной прямой (PROMPT 2026-06-15) ---
// Markaziy misconception M1: "−5, −3 dan katta, chunki 5 > 3" (whole-number bias).
// M2: "minus — shunchaki belgi, ma'nosi yo'q". Operatsiyalar YO'Q (blok 9: faqat o'qish,
// joylashtirish, taqqoslash). Asosiy usul (CPA, concrete): dengiz sathi — 0 sath, yuqorida
// musbat (cho'qqi), pastda manfiy (suv osti). Keyin gorizontal koordinata o'qiga ko'chiriladi.
// Vizualizatorlar: SeaScale (vertikal sath o'qi, suzuvchi marker + ko'piklar, jonli) va
// CoordLine (gorizontal koordinata o'qi, marker pulslaydi, slayder/bosish bilan harakat).
// Hook: Nilufar (−3 m) va Asror (−5 m) sho'ng'ishyapti — kim balandroq? Case: Zarina (−4 m)
// va Komil (−2 m) — kim chuqurroq? Test turlari (palitradan aralash): warm-up MC (son o'qida
// o'ngdagi katta) / NumInput (nuqtani o'qish) / MC (taqqoslash) / son o'qiga bosib qo'yish /
// tartiblash (sovuqdan issiqqa) / savatlarga tasniflash (musbat/manfiy/nol) / final MC.
// Faktlar (DRAFT, validatsiya kerak): manfiy sonlarni qadimgi Xitoy va Hindiston olimlari
// birinchi qo'llagan (Tarix) / absolyut nol ~ minus 273 daraja (Fan) / kompyuterda butun son
// musbat ham, manfiy ham bo'ladi (IT) / O'lik dengiz dengiz sathidan ~430 metr past (Fan).
// ============================================================

const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'neg-5-01-v1',
  lessonTitle: { ru: 'Отрицательные числа на координатной прямой', uz: "Manfiy sonlar koordinata to'g'ri chizig'ida" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'warmup',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's12', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const CONTENT = {

  // ---- s0 HOOK — Nilufar (−3) va Asror (−5) sho'ng'ishyapti. Tuzoq M1: "5 > 3 demak balandroq". ----
  s0: {
    eyebrow: { ru: 'Вопрос', uz: 'Savol' },
    title: { ru: 'Кто выше под водой', uz: "Suv ostida kim balandroq" },
    lead: {
      ru: 'Нилуфар и Асрор ныряют в море. Нилуфар на 3 метра ниже уровня моря, Асрор — на 5 метров ниже. Асрор говорит: «Я выше, ведь 5 больше 3». Он прав?',
      uz: "Nilufar va Asror dengizda sho'ng'ishyapti. Nilufar dengiz sathidan 3 metr pastda, Asror esa 5 metr pastda. Asror «men balandroqman, chunki 5 dan 3 katta» deydi. U haqmi?"
    },
    opt0: { ru: 'Да, Асрор выше (5 больше 3)', uz: "Ha, Asror balandroqda (5 dan 3 katta)" },
    opt1: { ru: 'Нет, Асрор ниже', uz: "Yo'q, Asror pastroqda" },
    opt2: { ru: 'Пока не знаю', uz: "Hozircha bilmayman" },
    reveal: {
      ru: 'Запомни свой ответ. К концу урока научимся сравнивать такие числа на прямой.',
      uz: "Javobingizni eslab qoling. Dars oxirida bunday sonlarni o'qda taqqoslashni o'rganamiz."
    },
    audio: {
      ru: 'Нилуфар и Асрор ныряют. Нилуфар на три метра ниже воды, Асрор на пять метров ниже. Асрор думает, что он выше, ведь пять больше трёх. А ты как думаешь, он прав?',
      uz: "Nilufar va Asror sho'ng'ishyapti. Nilufar suvdan uch metr pastda, Asror esa besh metr pastda. Asror o'zini balandroq deb o'ylaydi, chunki besh uchdan katta. Sizningcha, u haqmi?"
    }
  },

  // ---- s1 WARM-UP — son o'qida o'ngdagi katta (prereq retrieval). correct "7" (B). ----
  s1: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslab olamiz' },
    title: { ru: 'Кто стоит правее', uz: "Kim o'ngroqda turadi" },
    question: {
      ru: 'Помнишь числовую прямую? Число 7 стоит правее, чем 2. Какое из них больше?',
      uz: "Son o'qini eslaysizmi? 7 soni 2 dan o'ngroqda turadi. Qaysi biri katta?"
    },
    opt0: { ru: '7', uz: '7' },
    opt1: { ru: '2', uz: '2' },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    opt3: { ru: 'Нельзя сравнить', uz: "Taqqoslab bo'lmaydi" },
    correct_text: {
      ru: 'Верно. На прямой правее — значит больше. 7 правее 2, поэтому 7 больше. Это правило пригодится сегодня.',
      uz: "To'g'ri. O'qda o'ngroqda — demak kattaroq. 7 soni 2 dan o'ngda, shuning uchun 7 katta. Bu qoida bugun asqotadi."
    },
    wrong_0: {
      ru: '2 стоит левее, а левее — это меньше. Правее стоит 7, поэтому больше именно 7.',
      uz: "2 soni chaproqda, chaproq esa — kichikroq. O'ngroqda 7 turadi, shuning uchun 7 katta."
    },
    wrong_2: {
      ru: 'Они не равны: 7 и 2 — разные точки. Правее стоит 7, значит 7 больше.',
      uz: "Ular teng emas: 7 va 2 — turli nuqtalar. O'ngroqda 7 turadi, demak 7 katta."
    },
    wrong_3: {
      ru: 'Сравнить можно: кто правее на прямой, тот больше. Это 7.',
      uz: "Taqqoslasa bo'ladi: o'qda kim o'ngroqda, o'sha katta. Bu — 7."
    },
    wrong_default: { ru: 'Правее на прямой — больше. Это 7.', uz: "O'qda o'ngroqda — katta. Bu — 7." },
    audio: {
      intro: {
        ru: 'Сначала вспомним. На числовой прямой семь стоит правее, чем два. Какое число больше? Выбери ответ.',
        uz: "Avval eslaymiz. Son o'qida yetti soni ikkidan o'ngroqda turadi. Qaysi son katta? Javobni tanlang."
      },
      on_correct: { ru: 'Верно. Кто правее, тот больше.', uz: "To'g'ri. Kim o'ngroqda, o'sha katta." },
      on_wrong:   { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },

  // ---- s2 EXPLORATION — SeaScale: sath 0, marker pastga tushadi −1, −2, −3 (step). M2. ----
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Спускаемся ниже нуля', uz: "Noldan pastga tushamiz" },
    lead: {
      ru: 'Уровень моря — это ноль. Нажимай и смотри, как ныряльщик опускается ниже нуля.',
      uz: "Dengiz sathi — bu nol. Tugmani bosing va g'avvos noldan pastga qanday tushishini kuzating."
    },
    caps: {
      ru: [
        'Ныряльщик на поверхности. Здесь ноль.',
        'Спустился на 1 метр ниже воды — это −1.',
        'Ещё ниже: −2, потом −3. Минус значит «ниже нуля».'
      ],
      uz: [
        "G'avvos suv yuzasida. Bu yer — nol.",
        "Suvdan 1 metr pastga tushdi — bu −1.",
        "Yana pastga: −2, keyin −3. Minus «noldan past» degani."
      ]
    },
    note: {
      ru: 'Минус — не просто значок. Он показывает: число ниже нуля, под водой.',
      uz: "Minus — shunchaki belgi emas. U sonni noldan past, suv ostida ekanini ko'rsatadi."
    },
    btn_step: { ru: 'Глубже', uz: 'Chuqurroq' },
    audio: {
      intro: {
        ru: 'Уровень моря, это ноль. Нажимай на кнопку и смотри, как ныряльщик уходит ниже нуля.',
        uz: "Dengiz sathi, bu nol. Tugmani bosing va g'avvos noldan pastga qanday ketishini kuzating."
      },
      done: {
        ru: 'Видишь? Ниже нуля идут минус один, минус два, минус три. Минус значит ниже нуля.',
        uz: "Ko'rdingizmi? Noldan past minus bir, minus ikki, minus uch boradi. Minus noldan past degani."
      }
    }
  },

  // ---- s3 EXPLORATION — CoordLine slayder: 0 markaz, chap manfiy, o'ng musbat; qarama-qarshi son. ----
  s3: {
    eyebrow: { ru: 'Эксперимент', uz: 'Tajriba' },
    title: { ru: 'Слева минус, справа плюс', uz: "Chapda minus, o'ngda plyus" },
    lead: {
      ru: 'Повернём прямую горизонтально. Ноль в центре. Двигай ползунок — смотри, где число.',
      uz: "O'qni gorizontal qilamiz. Nol — markazda. Slayderni suring — son qayerda ekanini kuzating."
    },
    note_neg: {
      ru: 'Число слева от нуля — отрицательное, оно меньше нуля.',
      uz: "Noldan chapdagi son — manfiy, u noldan kichik."
    },
    note_pos: {
      ru: 'Число справа от нуля — положительное, оно больше нуля.',
      uz: "Noldan o'ngdagi son — musbat, u noldan katta."
    },
    note_zero: {
      ru: 'Ноль — это центр, граница между минусом и плюсом.',
      uz: "Nol — markaz, minus bilan plyus orasidagi chegara."
    },
    cur_label: { ru: 'Сейчас', uz: 'Hozir' },
    opp_label: { ru: 'Напротив нуля', uz: 'Noldan narida' },
    audio: {
      ru: 'Двигай ползунок. Слева от нуля числа отрицательные, они меньше нуля. Справа положительные, они больше. А минус три и три стоят на равном расстоянии от нуля, только в разные стороны.',
      uz: "Slayderni suring. Noldan chapda sonlar manfiy, ular noldan kichik. O'ngda musbat, ular katta. Minus uch va uch esa noldan teng masofada, faqat har xil tomonda turadi."
    }
  },

  // ---- s4 RULE 1 — CoordLine: 0 dan o'ng musbat / chap manfiy; o'ngga — katta. ----
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Правило про знаки', uz: "Belgilar haqida qoida" },
    lead: { ru: 'Запишем правило, которое ты открыл.', uz: "Siz kashf etgan qoidani yozamiz." },
    rule_main: {
      ru: 'Справа от нуля — плюс, слева — минус',
      uz: "Noldan o'ngda — plyus, chapda — minus"
    },
    ex_easy: {
      ru: 'Чем правее число на прямой, тем оно больше. Чем левее — тем меньше.',
      uz: "Son o'qda qancha o'ngroqda bo'lsa, shuncha katta. Qancha chaproqda — shuncha kichik."
    },
    note: {
      ru: 'Поэтому 1 больше нуля, а −1 меньше нуля.',
      uz: "Shuning uchun 1 noldan katta, −1 esa noldan kichik."
    },
    audio: {
      ru: 'Запомним правило. Справа от нуля плюс, слева минус. Чем правее число, тем оно больше. Чем левее, тем меньше.',
      uz: "Qoidani eslab qolamiz. Noldan o'ngda plyus, chapda minus. Son qancha o'ngroqda, shuncha katta. Qancha chaproqda, shuncha kichik."
    }
  },

  // ---- s5 RULE 2 — tuzoq-ogohlantirish: −5, −3 dan KICHIK (chapda). M1. CoordLine highlight. ----
  s5: {
    eyebrow: { ru: 'Внимание', uz: 'Diqqat' },
    title: { ru: 'У минусов всё наоборот', uz: "Minuslarda hammasi teskari" },
    lead: { ru: 'Важно: у минусов всё наоборот.', uz: "Muhim: minuslarda hammasi teskari." },
    point1: {
      ru: 'У обычных чисел: 5 больше 3. У минусов −5 меньше −3.',
      uz: "Oddiy sonlarda: 5, 3 dan katta. Minuslarda −5, −3 dan kichik."
    },
    point2: {
      ru: 'Почему? −5 стоит левее на прямой, а левее — значит меньше.',
      uz: "Nega? −5 o'qda chaproqda turadi, chaproq esa — kichik."
    },
    warn: {
      ru: 'Ловушка: смотреть только на 5 и 3 и забыть про минус. Решает место на прямой.',
      uz: "Tuzoq: faqat 5 va 3 ga qarab, minusni unutish. O'qdagi o'rin hal qiladi."
    },
    audio: {
      ru: 'Будь внимателен. У обычных чисел пять больше трёх. А у минусов наоборот: минус пять меньше минус трёх, потому что он левее на прямой. Не смотри только на цифры пять и три.',
      uz: "E'tiborli bo'ling. Oddiy sonlarda besh uchdan katta. Minuslarda esa teskari: minus besh minus uchdan kichik, chunki u o'qda chaproqda. Faqat besh va uch raqamlariga qaramang."
    }
  },

  // ---- s6 TEST NumInput — CoordLine marker −4 ni o'qish. correctValue −4. ----
  s6: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Прочитай число на прямой', uz: "O'qdagi sonni o'qing" },
    question: {
      ru: 'Какое число отмечено на прямой? Если оно отрицательное, напиши со знаком минус.',
      uz: "O'qda qaysi son belgilangan? Agar manfiy bo'lsa, minus belgisi bilan yozing."
    },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: {
      ru: 'Отметка слева от нуля — значит минус. Отсчитай шаги от нуля влево: их четыре.',
      uz: "Belgi noldan chapda — demak minus. Noldan chapga qadamlarni sanang: ular to'rtta."
    },
    fb_correct: {
      ru: 'Верно! Точка на 4 шага левее нуля — это −4.',
      uz: "To'g'ri! Nuqta noldan 4 qadam chapda — bu −4."
    },
    audio: {
      intro: {
        ru: 'Посмотри, какое число отмечено на прямой. Если оно левее нуля, не забудь знак минус. Напиши ответ и нажми проверить.',
        uz: "O'qda qaysi son belgilanganini qarang. Agar u noldan chapda bo'lsa, minus belgisini unutmang. Javobni yozib, tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Минус четыре.', uz: "To'g'ri. Minus to'rt." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: "Maslahatga qarang." }
    }
  },

  // ---- s7 TEST MC — taqqoslash −5 va −3, qaysi katta. correct −3 (A). M1. Fakt Tarix. ----
  s7: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Какое число больше', uz: "Qaysi son katta" },
    lead: {
      ru: 'Какое число больше: −5 или −3? Вспомни, где они на прямой.',
      uz: "Qaysi son katta: −5 yoki −3? Ular o'qda qayerda turishini eslang."
    },
    opt0: { ru: '−3', uz: "−3" },
    opt1: { ru: '−5', uz: "−5" },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    opt3: { ru: 'Нельзя сравнить', uz: "Taqqoslab bo'lmaydi" },
    correct_text: {
      ru: 'Верно! −3 правее на прямой, чем −5, а правее — значит больше. Поэтому −3 больше.',
      uz: "To'g'ri! −3 o'qda −5 dan o'ngroqda, o'ngroq esa — kattaroq. Shuning uchun −3 katta."
    },
    wrong_1: {
      ru: '−5 кажется больше, ведь 5 больше 3. Но −5 левее на прямой, значит он меньше. Больше −3.',
      uz: "−5 katta tuyuladi, axir 5, 3 dan katta. Lekin −5 o'qda chaproqda, demak u kichik. −3 kattaroq."
    },
    wrong_2: {
      ru: 'Они не равны: −3 и −5 — разные точки. −3 правее, значит больше.',
      uz: "Ular teng emas: −3 va −5 — turli nuqtalar. −3 o'ngroqda, demak katta."
    },
    wrong_3: {
      ru: 'Отрицательные тоже сравнивают: кто правее, тот больше. Это −3.',
      uz: "Manfiy sonlar ham taqqoslanadi: kim o'ngroqda, o'sha katta. Bu — −3."
    },
    wrong_default: { ru: 'Правее на прямой — больше. Это −3.', uz: "O'qda o'ngroqda — katta. Bu — −3." },
    fact: {
      ru: 'Отрицательные числа долго не признавали «настоящими». Первыми их стали использовать математики древних Китая и Индии — поэтому и мы понимаем их не сразу.',
      uz: "Manfiy sonlar uzoq vaqt haqiqiy son deb tan olinmagan. Ularni birinchi bo'lib qadimgi Xitoy va Hindiston olimlari qo'llagan — shuning uchun biz ham ularni asta tushunamiz."
    },
    audio: {
      intro: {
        ru: 'Какое число больше: минус пять или минус три? Подумай, где каждое на прямой. Выбери ответ.',
        uz: "Qaysi son katta: minus besh yoki minus uch? Har biri o'qda qayerda turishini o'ylang. Javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Минус три больше. Отрицательные числа первыми стали использовать в древних Китае и Индии.',
        uz: "To'g'ri. Minus uch katta. Manfiy sonlarni qadimda Xitoy va Hindiston olimlari birinchi qo'llagan."
      },
      on_wrong: { ru: 'Не совсем. Кто правее на прямой, тот больше.', uz: "Unchalik emas. O'qda kim o'ngroqda, o'sha katta." }
    }
  },

  // ---- s8 TEST son o'qiga bosib qo'yish — markerni −2 ga. correct −2. ----
  s8: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Отметь число на прямой', uz: "O'qda sonni belgilang" },
    lead: {
      ru: 'Поставь отметку на число −2. Нажми на нужное деление прямой.',
      uz: "Markerni −2 soniga qo'ying. O'qdagi kerakli bo'linmani bosing."
    },
    hint_wrong: {
      ru: '−2 — это два шага влево от нуля. Отсчитай: ноль, минус один, минус два.',
      uz: "−2 — bu noldan chapga ikki qadam. Sanang: nol, minus bir, minus ikki."
    },
    correct_text: {
      ru: 'Верно! −2 стоит на два шага левее нуля.',
      uz: "To'g'ri! −2 noldan ikki qadam chapda turadi."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    tap_prompt: { ru: 'Нажми деление на прямой', uz: "O'qdagi bo'linmani bosing" },
    audio: {
      intro: {
        ru: 'Поставь отметку на число минус два. Нажми на нужное деление прямой и нажми проверить.',
        uz: "Markerni minus ikki soniga qo'ying. O'qdagi kerakli bo'linmani bosib, tekshirishni bosing."
      },
      on_correct: { ru: 'Верно. Два шага влево от нуля.', uz: "To'g'ri. Noldan ikki qadam chapga." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // ---- s9 TEST tartiblash — haroratlarni sovuqdan issiqgacha. correct −7, −2, 0, 3. Fakt Fan. ----
  s9: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'От холода к теплу', uz: "Sovuqdan issiqqa" },
    lead: {
      ru: 'Расставь температуры от самой холодной к самой тёплой. Нажимай по порядку.',
      uz: "Haroratlarni eng sovuqdan eng issiqga qarab joylashtiring. Tartib bilan bosing."
    },
    hint_wrong: {
      ru: 'Самая холодная — самая маленькая, она левее всех на прямой. Это −7, потом −2, потом 0, потом 3.',
      uz: "Eng sovuq — eng kichik, u o'qda hammadan chapda. Bu −7, keyin −2, keyin 0, keyin 3."
    },
    correct_text: {
      ru: 'Верно! От холода к теплу: −7, −2, 0, 3. Это порядок слева направо на прямой.',
      uz: "To'g'ri! Sovuqdan issiqga: −7, −2, 0, 3. Bu o'qda chapdan o'ngga tartib."
    },
    fact: {
      ru: 'Самая низкая температура — абсолютный ноль, около минус 273 градусов; ниже опуститься нельзя. Поэтому отрицательные температуры нам так знакомы.',
      uz: "Eng past harorat — absolyut nol, taxminan minus 273 daraja; undan pastga tushib bo'lmaydi. Shuning uchun manfiy haroratlar bizga shunchalik tanish."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    reset_hint: { ru: 'Нажми ещё раз, чтобы начать заново', uz: "Qaytadan boshlash uchun yana bosing" },
    audio: {
      intro: {
        ru: 'Расставь температуры от самой холодной к самой тёплой. Нажимай карточки по порядку и нажми проверить.',
        uz: "Haroratlarni eng sovuqdan eng issiqga joylashtiring. Kartalarni tartib bilan bosib, tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. От холода к теплу. Самая низкая температура, это абсолютный ноль, около минус двести семьдесят три градуса.',
        uz: "To'g'ri. Sovuqdan issiqga. Eng past harorat, bu absolyut nol, taxminan minus ikki yuz yetmish uch daraja."
      },
      on_wrong: { ru: 'Не совсем. Самая холодная стоит левее всех.', uz: "Unchalik emas. Eng sovuq hammadan chapda turadi." }
    }
  },

  // ---- s10 TEST tasniflash — sonlarni musbat/manfiy/nol savatlariga. Fakt IT. ----
  s10: {
    eyebrow: { ru: 'Задание', uz: 'Topshiriq' },
    title: { ru: 'Разложи по корзинам', uz: "Savatlarga ajrating" },
    lead: {
      ru: 'Разложи числа по корзинам: положительное, отрицательное или ноль.',
      uz: "Sonlarni savatlarga ajrating: musbat, manfiy yoki nol."
    },
    bin_pos: { ru: 'Положительное', uz: 'Musbat' },
    bin_neg: { ru: 'Отрицательное', uz: 'Manfiy' },
    bin_zero: { ru: 'Ноль', uz: 'Nol' },
    it0: { ru: '−4', uz: "−4" },
    it1: { ru: '5', uz: "5" },
    it2: { ru: '0', uz: "0" },
    hint_wrong: {
      ru: 'Со знаком минус — отрицательное. Справа от нуля, без минуса — положительное. Ноль сам по себе.',
      uz: "Minus belgisi bilan — manfiy. Noldan o'ngda, minussiz — musbat. Nol esa o'zi alohida."
    },
    correct_text: {
      ru: 'Верно! −4 отрицательное, 5 положительное, а 0 — ни то, ни другое.',
      uz: "To'g'ri! −4 manfiy, 5 musbat, 0 esa na u, na bu."
    },
    fact: {
      ru: 'В компьютере целые числа бывают и положительными, и отрицательными; знак минус хранится особым битом. Значит отрицательные числа нужны и технике.',
      uz: "Kompyuterda butun sonlar musbat ham, manfiy ham bo'ladi; minus belgisi maxsus bit bilan saqlanadi. Demak manfiy sonlar texnikaga ham kerak."
    },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: {
        ru: 'Разложи числа по корзинам. Положительное, отрицательное или ноль? Выбери для каждого и нажми проверить.',
        uz: "Sonlarni savatlarga ajrating. Musbat, manfiy yoki nol? Har biri uchun tanlab, tekshirishni bosing."
      },
      on_correct: {
        ru: 'Верно. В компьютере целые числа тоже бывают и положительными, и отрицательными.',
        uz: "To'g'ri. Kompyuterda ham butun sonlar musbat ham, manfiy ham bo'ladi."
      },
      on_wrong: { ru: 'Не совсем. Со знаком минус — отрицательное.', uz: "Unchalik emas. Minus belgisi bilan — manfiy." }
    }
  },

  // ---- s11 CASE setup — Zarina (−4) va Komil (−2) suv ostida. SeaScale. ----
  s11: {
    eyebrow: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
    title: { ru: 'Кто из них глубже', uz: "Qaysi biri chuqurroqda" },
    lead: {
      ru: 'Зарина и Комил исследуют море. Зарина на отметке −4 метра, Комил — на −2 метра. Кто из них глубже?',
      uz: "Zarina va Komil dengizni o'rganmoqda. Zarina −4 metr belgisida, Komil esa −2 metrda. Qaysi biri chuqurroqda?"
    },
    note: {
      ru: 'Глубже — значит ниже на прямой, дальше от нуля вниз.',
      uz: "Chuqurroq — demak o'qda pastroqda, noldan pastga uzoqroqda."
    },
    hint_calc: {
      ru: 'Сравни −4 и −2. Кто левее (ниже) на прямой, тот глубже.',
      uz: "−4 va −2 ni taqqoslang. O'qda kim chapda (pastda), o'sha chuqurroqda."
    },
    btn_help: { ru: 'Решить', uz: 'Yechish' },
    audio: {
      ru: 'Зарина и Комил под водой. Зарина на минус четыре метра, Комил на минус два. Кто из них глубже? Сравним эти числа.',
      uz: "Zarina va Komil suv ostida. Zarina minus to'rt metrda, Komil minus ikki metrda. Qaysi biri chuqurroqda? Bu sonlarni taqqoslaymiz."
    }
  },

  // ---- s12 CASE/FINAL MC — kim chuqurroqda. correct Zarina −4 (D). M1. Fakt Fan (O'lik dengiz). ----
  s12: {
    eyebrow: { ru: 'Итоговое задание', uz: 'Yakuniy topshiriq' },
    title: { ru: 'Реши задачу про глубину', uz: "Chuqurlik masalasini yeching" },
    lead: {
      ru: 'Зарина на −4 метра, Комил на −2 метра. Кто глубже под водой?',
      uz: "Zarina −4 metrda, Komil −2 metrda. Kim suv ostida chuqurroqda?"
    },
    opt0: { ru: 'Зарина (−4 м)', uz: "Zarina (−4 m)" },
    opt1: { ru: 'Комил (−2 м)', uz: "Komil (−2 m)" },
    opt2: { ru: 'Одинаково', uz: "Bir xil chuqurlikda" },
    opt3: { ru: 'Нельзя узнать', uz: "Bilib bo'lmaydi" },
    correct_text: {
      ru: 'Верно! −4 меньше −2 и левее (ниже) на прямой. Значит Зарина глубже.',
      uz: "To'g'ri! −4, −2 dan kichik va o'qda chaproqda (pastroqda). Demak Zarina chuqurroqda."
    },
    wrong_1: {
      ru: 'Кажется, что Комил глубже, ведь 2 меньше 4. Но −4 ниже −2 на прямой. Глубже Зарина.',
      uz: "Komil chuqurroq tuyuladi, axir 2, 4 dan kichik. Lekin −4 o'qda −2 dan pastroqda. Chuqurroqda — Zarina."
    },
    wrong_2: {
      ru: 'Они не на одной глубине: −4 ниже −2. Глубже Зарина.',
      uz: "Ular bir xil chuqurlikda emas: −4, −2 dan pastda. Chuqurroqda — Zarina."
    },
    wrong_3: {
      ru: 'Узнать можно: сравни −4 и −2 на прямой. Ниже — Зарина.',
      uz: "Bilsa bo'ladi: −4 va −2 ni o'qda taqqoslang. Pastda — Zarina."
    },
    wrong_default: { ru: '−4 ниже −2 на прямой. Глубже Зарина.', uz: "−4 o'qda −2 dan pastda. Chuqurroqda — Zarina." },
    fact: {
      ru: 'Берег Мёртвого моря — самая низкая суша на Земле, около 430 метров ниже уровня моря. Вот где встречаются такие глубокие минусы в жизни.',
      uz: "O'lik dengiz qirg'og'i — Yerdagi eng past quruqlik, dengiz sathidan taxminan 430 metr past. Mana shunday chuqur minuslar hayotda uchraydi."
    },
    audio: {
      intro: {
        ru: 'Зарина на минус четыре метра, Комил на минус два. Кто глубже под водой? Выбери ответ.',
        uz: "Zarina minus to'rt metrda, Komil minus ikki metrda. Kim suv ostida chuqurroqda? Javobni tanlang."
      },
      on_correct: {
        ru: 'Верно. Глубже Зарина. Берег Мёртвого моря, это самая низкая суша на Земле, около четырёхсот тридцати метров ниже уровня моря.',
        uz: "To'g'ri. Chuqurroqda — Zarina. O'lik dengiz qirg'og'i, bu Yerdagi eng past quruqlik, dengiz sathidan taxminan to'rt yuz o'ttiz metr past."
      },
      on_wrong: { ru: 'Не совсем. Минус четыре ниже минус двух на прямой.', uz: "Unchalik emas. Minus to'rt, o'qda minus ikkidan pastda." }
    }
  },

  // ---- s13 SUMMARY — hookni yopadi + ConnectionsBlock ----
  s13: {
    eyebrow: { ru: 'Итог', uz: 'Xulosa' },
    heading: { ru: 'Что мы узнали об отрицательных числах', uz: "Manfiy sonlar haqida nimani bildik" },
    title: { ru: 'Отлично! Теперь ты понимаешь отрицательные числа.', uz: "Ajoyib! Endi siz manfiy sonlarni tushunasiz." },
    main_label: { ru: 'Что мы узнали', uz: "Nimani bilib oldik" },
    main_1: { ru: 'Минус показывает: число ниже нуля, слева на прямой.', uz: "Minus shuni ko'rsatadi: son noldan past, o'qda chapda." },
    main_2: { ru: 'Справа на прямой — больше, слева — меньше.', uz: "O'qda o'ngda — katta, chapda — kichik." },
    main_3: { ru: 'У минусов наоборот: −5 меньше −3.', uz: "Minuslarda teskari: −5, −3 dan kichik." },
    hook_close: {
      ru: 'Помнишь Асрора? Он был на −5, а Нилуфар на −3. Асрор думал, что выше, ведь 5 больше 3. Но −5 ниже −3, значит Асрор был глубже.',
      uz: "Asrorni eslaysizmi? U −5 da, Nilufar esa −3 da edi. Asror o'zini balandroq deb o'yladi, axir 5, 3 dan katta. Lekin −5, −3 dan past, demak Asror chuqurroq edi."
    },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: {
      ru: 'Числовая прямая и сравнение чисел (правее — больше).',
      uz: "Son o'qi va sonlarni taqqoslash (o'ngroq — kattaroq)."
    },
    conn_label_next: { ru: 'Следующий урок', uz: 'Keyingi dars' },
    conn_next: {
      ru: 'Сравнение целых чисел и противоположные числа.',
      uz: "Butun sonlarni taqqoslash va qarama-qarshi sonlar."
    },
    btn_restart: { ru: 'Пройти заново', uz: 'Qaytadan' },
    audio: {
      ru: 'Отлично. Теперь ты знаешь: минус значит ниже нуля, левее на прямой. Справа числа больше, слева меньше. А у минусов всё наоборот. Молодец!',
      uz: "Ajoyib. Endi bilasiz: minus noldan past, o'qda chapda degani. O'ngda sonlar katta, chapda kichik. Minuslarda esa hammasi teskari. Barakalla!"
    }
  }

};

// ============================================================
// YORDAMCHI KOMPONENTLAR (infra_v2 — Dars31 bilan bir xil)
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
// Tarix: qadimgi sanoq tayoqchalari (rod numerals) navbatma-navbat yorishadi (Tarix).
const AnimHistory = () => (
  <div className="fa-hist" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="fa-hist-r" style={{ animationDelay: `${i * 0.18}s` }}/>
    ))}
  </div>
);
// Absolyut nol: termometr simobi pastga tushadi (Fan).
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
// O'lik dengiz: marker chuqur belgiga tushadi (Fan).
const AnimDeadSea = () => (
  <svg className="fa-ds" viewBox="0 0 60 80" aria-hidden="true">
    <rect x="0" y="20" width="60" height="60" className="fa-ds-water"/>
    <line x1="0" y1="20" x2="60" y2="20" className="fa-ds-surf"/>
    <circle cx="30" cy="28" r="6" className="fa-ds-dot"/>
  </svg>
);

// ============================================================
// VIZUALIZATORLAR — SeaScale (vertikal sath o'qi) + CoordLine (gorizontal koordinata o'qi)
// ============================================================
// SeaScale: dengiz sathi konkret modeli. 0 — sath, yuqori (musbat) ochiq, past (manfiy) suv.
// markers: [{ v, label, ok }]. dive=true — markerlar yuqoridan tushib keladi (hook). Suv ostida
// ko'piklar doimiy ko'tariladi (jonli). yOf(v): v=max yuqorida, v=min pastda.
const SS_UNIT = 22;
const SeaScale = ({ min = -6, max = 6, markers = [], unit = SS_UNIT, dive = false }) => {
  const padTop = 16, padBot = 16, axisX = 98, svgW = 196;
  const yOf = (v) => padTop + (max - v) * unit;
  const svgH = padTop + (max - min) * unit + padBot;
  const y0 = yOf(0);
  const ticks = [];
  for (let v = min; v <= max; v++) ticks.push(v);
  return (
    <svg className="ss" viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} aria-hidden="true" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect x="0" y={padTop - 4} width={svgW} height={y0 - padTop + 4} className="ss-sky"/>
      <rect x="0" y={y0} width={svgW} height={svgH - y0} className="ss-water"/>
      {[0, 1, 2, 3].map(i => (
        <circle key={i} className={`ss-bub ss-bub${i}`} cx={axisX + 30 + (i % 2) * 14} cy={svgH - 8} r={2.5 + (i % 2)}/>
      ))}
      <line x1={axisX} y1={padTop} x2={axisX} y2={svgH - padBot} className="ss-axis"/>
      {ticks.map(v => (
        <g key={v}>
          <line x1={axisX - 5} y1={yOf(v)} x2={axisX + 5} y2={yOf(v)} className={v === 0 ? 'ss-tick0' : 'ss-tick'}/>
          <text x={axisX - 13} y={yOf(v) + 4} className={v === 0 ? 'ss-lbl0' : 'ss-lbl'} textAnchor="end">{fmtN(v)}</text>
        </g>
      ))}
      <line x1="6" y1={y0} x2={svgW - 6} y2={y0} className="ss-surface"/>
      {markers.map((mk, i) => (
        <g key={i} className={`ss-mk${dive ? ' ss-dive' : ''}`} style={dive ? { animationDelay: `${i * 0.3}s` } : undefined}>
          <line x1={axisX} y1={y0} x2={axisX} y2={yOf(mk.v)} className="ss-stem"/>
          <circle cx={axisX} cy={yOf(mk.v)} r="8" className={`ss-dot${mk.ok ? ' ss-dot-ok' : ''}`}/>
          {mk.label && <text x={axisX + 16} y={yOf(mk.v) + 4} className="ss-mlbl" textAnchor="start">{mk.label}</text>}
        </g>
      ))}
    </svg>
  );
};

// CoordLine: gorizontal koordinata o'qi (dars maqsadi). 0 markaz. marker translateX bilan
// suriladi (slayder/bosishda silliq transition). onPick berilsa — bo'linmalar bosiladi.
const CN_UNIT = 32;
const CoordLine = ({ min = -6, max = 6, value = null, value2 = null, unit = CN_UNIT, onPick = null, picked = null, success = false, highlight = [] }) => {
  const padX = 24, axisY = 54, h = 88;
  const xOf = (v) => padX + (v - min) * unit;
  const svgW = padX * 2 + (max - min) * unit;
  const ticks = [];
  for (let v = min; v <= max; v++) ticks.push(v);
  const showVal = picked !== null ? picked : value;
  return (
    <svg className="cn" viewBox={`0 0 ${svgW} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ maxWidth: svgW, height: 'auto', display: 'block', margin: '0 auto' }}>
      <rect x={xOf(min)} y={axisY - 7} width={xOf(0) - xOf(min)} height="14" className="cn-neg"/>
      <rect x={xOf(0)} y={axisY - 7} width={xOf(max) - xOf(0)} height="14" className="cn-pos"/>
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

// s0 — HOOK (Nilufar −3, Asror −5, dengiz sathi). Qaytish: picked TO'LIQ sbros.
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
          <SeaScale min={-6} max={3} markers={[{ v: -3, label: 'Nilufar' }, { v: -5, label: 'Asror' }]} dive unit={20}/>
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

// s1 — WARM-UP (son o'qida o'ngdagi katta) QuestionScreen (correct 7 -> B)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION (SeaScale: marker noldan pastga −1,−2,−3; step 0..3)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio([{ id: 's2_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const MAX = 3;
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
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <SeaScale min={-4} max={2} markers={[{ v: -step, label: fmtN(-step), ok: done }]} unit={20}/>
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={doStep} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{mt(done ? t(c.note) : caps[Math.min(step, caps.length - 1)])}</p>
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION (CoordLine slayder: 0 markaz, chap manfiy / o'ng musbat)
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
          <CoordLine value={v} highlight={[-Math.abs(v), Math.abs(v)].filter(n => n !== 0)}/>
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

// s4 — RULE 1 (CoordLine: o'ng musbat / chap manfiy) + ambient
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
          <CoordLine value={null}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: T.ink2 }}>{mt(t(c.ex_easy))}</p>
        </div>
        <p className="body fade-up delay-3" style={{ position: 'relative', margin: 0, textAlign: 'center', color: T.success, fontWeight: 600 }}>{mt(t(c.note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (tuzoq: −5 < −3, chapda) + CoordLine highlight + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <CoordLine value={-5} value2={-3} highlight={[-5, -3]} min={-6} max={4}/>
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

// s6 — TEST NumInput (CoordLine marker −4 ni o'qish)
// ============================================================
// SeqMix — bitta slaydda 4-5 HAR XIL turdagi savol KETMA-KET (kiritish, taqqoslash MC,
// o'qqa belgilash tap, tartiblash). Progress nuqtalari (qatorlar yig'ilmaydi → scrollsiz),
// веди-до-верного, mobil-do'st. Ovozli xato = on_wrong (toza). Son so'z bilan.
// ============================================================
const MIX_W = {
  eyebrow: { ru: 'Тренировка', uz: 'Mashq' },
  title: { ru: 'Числа на прямой', uz: "Son o'qida" },
  lead: { ru: 'Несколько разных заданий подряд.', uz: "Bir nechta har xil topshiriq birin-ketin." },
  done_text: { ru: 'Все верно! Ты читаешь, сравниваешь и отмечаешь числа на прямой.', uz: "Hammasi to'g'ri! Sonlarni o'qda o'qiysan, taqqoslaysan va belgilaysan." }
};
const MIX_ITEMS = [
  { type: 'input', value: -4, answer: -4,
    lead: { ru: 'Какое число отмечено на прямой? Напиши со знаком.', uz: "O'qda qaysi son belgilangan? Ishorasi bilan yoz." },
    hint: { ru: 'Отметка слева от нуля — значит минус. Сосчитай шаги влево.', uz: "Belgi noldan chapda — demak minus. Chapga qadamlarni sana." },
    intro: { ru: 'Какое число отмечено на прямой? Напиши со знаком минус, если оно слева от нуля.', uz: "O'qda qaysi son belgilangan? Agar noldan chapda bo'lsa, minus bilan yoz." },
    on_correct: { ru: 'Верно. Минус четыре.', uz: "To'g'ri. Minus to'rt." }, on_wrong: { ru: 'Слева от нуля — это минус.', uz: "Noldan chapda — bu minus." } },
  { type: 'mc', opt0: { ru: '−3', uz: '−3' }, opt1: { ru: '−5', uz: '−5' }, opt2: { ru: 'Они равны', uz: 'Ular teng' }, correct: 0, order: [1, 0, 2],
    lead: { ru: 'Какое число больше: −5 или −3?', uz: "Qaysi son katta: −5 yoki −3?" },
    wrong_1: { ru: '−5 левее, значит меньше. Больше −3.', uz: "−5 chaproqda, demak kichik. Katta — −3." },
    wrong_2: { ru: 'Они разные. Правее — больше, это −3.', uz: "Ular har xil. O'ngroqda — katta, bu −3." },
    intro: { ru: 'Какое число больше: минус пять или минус три? Выбери ответ.', uz: "Qaysi son katta: minus besh yoki minus uch? Javobni tanla." },
    on_correct: { ru: 'Верно. Минус три больше.', uz: "To'g'ri. Minus uch katta." }, on_wrong: { ru: 'Кто правее на прямой, тот больше.', uz: "O'qda kim o'ngroqda, o'sha katta." } },
  { type: 'place', answer: -2, min: -6, max: 6,
    lead: { ru: 'Отметь на прямой число −2. Нажми на нужное деление.', uz: "O'qda −2 sonini belgila. Kerakli bo'linmani bos." },
    hint: { ru: 'Отсчитай два шага влево от нуля.', uz: "Noldan chapga ikki qadam sana." },
    intro: { ru: 'Поставь отметку на число минус два. Нажми на нужное деление прямой.', uz: "Markerni minus ikki soniga qo'y. O'qdagi kerakli bo'linmani bos." },
    on_correct: { ru: 'Верно. Минус два — два шага влево от нуля.', uz: "To'g'ri. Minus ikki — noldan ikki qadam chapda." }, on_wrong: { ru: 'Это два шага влево от нуля.', uz: "Bu noldan ikki qadam chapda." } },
  { type: 'order', vals: [-5, -1, 3],
    lead: { ru: 'Расставь от меньшего к большему. Нажимай по порядку.', uz: "Kichikdan kattaga tartibla. Tartib bilan bos." },
    hint: { ru: 'Левее на прямой — меньше. Начни с самого левого.', uz: "O'qda chaproq — kichik. Eng chapdagidan boshla." },
    intro: { ru: 'Расставь числа от меньшего к большему. Нажимай их по порядку.', uz: "Sonlarni kichikdan kattaga tartibla. Ularni tartib bilan bos." },
    on_correct: { ru: 'Верно. Минус пять, минус один, три.', uz: "To'g'ri. Minus besh, minus bir, uch." }, on_wrong: { ru: 'Левее на прямой — меньше.', uz: "O'qda chaproq — kichik." } },
  { type: 'mc', opt0: { ru: '−8', uz: '−8' }, opt1: { ru: '−12', uz: '−12' }, opt2: { ru: 'Они равны', uz: 'Ular teng' }, correct: 0, order: [1, 0, 2],
    lead: { ru: 'Какое число больше: −12 или −8?', uz: "Qaysi son katta: −12 yoki −8?" },
    wrong_1: { ru: 'Большая цифра не делает минус больше. −12 левее. Больше −8.', uz: "Katta raqam minusni katta qilmaydi. −12 chaproqda. Katta — −8." },
    wrong_2: { ru: 'Они разные. Правее — больше, это −8.', uz: "Ular har xil. O'ngroqda — katta, bu −8." },
    intro: { ru: 'Какое число больше: минус двенадцать или минус восемь? Выбери ответ.', uz: "Qaysi son katta: minus o'n ikki yoki minus sakkiz? Javobni tanla." },
    on_correct: { ru: 'Верно. Минус восемь больше.', uz: "To'g'ri. Minus sakkiz katta." }, on_wrong: { ru: 'Кто правее на прямой, тот больше.', uz: "O'qda kim o'ngroqda, o'sha katta." } }
];

const SeqMix = ({ screen, totalScreens, items, screenContent, scope, storedAnswer, onAnswer, onNext, onPrev }) => {
  const w = screenContent; const t = useT(); const lang = useLang(); const sfx = useSfx();
  const n = items.length;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: `s${screen}_i0`, text: items[0].intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [results, setResults] = useState(() => (wasSolved ? items.map(() => true) : []));
  const [val, setVal] = useState('');
  const [pickV, setPickV] = useState(null);
  const [seq, setSeq] = useState([]);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hint, setHint] = useState(false);
  const [flash, setFlash] = useState(false);
  const wrongRef = useRef(false);
  const advRef = useRef(wasSolved);
  const done = idx >= n;
  const cur = done ? null : items[idx];
  const sh = (cur && cur.type === 'mc') ? shuffleMC(cur, [cur.opt0, cur.opt1, cur.opt2].map(o => optEl(t, o)), cur.correct, cur.order || [0, 1, 2]) : null;
  const speak = (txt) => { if (txt && !audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const advance = (ft) => {
    const nr = [...results]; nr[idx] = ft; const ni = idx + 1;
    setResults(nr); setVal(''); setPickV(null); setSeq([]); setWrongSet(new Set()); setHint(false); setFlash(false); wrongRef.current = false; setIdx(ni);
    if (ni >= n) { const allOk = nr.every(Boolean); onAnswer({ stage: scope, screenIdx: screen, correctAnswer: 'seqmix', studentAnswer: JSON.stringify(nr), correct: allOk, firstTry: allOk, solved: true }); speak(w.done_text && w.done_text[lang]); }
    else speak(items[ni].intro[lang]);
  };
  const fireOk = () => { setFlash(true); sfx.playCorrect(); speak(cur.on_correct && cur.on_correct[lang]); const ft = !wrongRef.current; setTimeout(() => advance(ft), 800); };
  const fireBad = () => { wrongRef.current = true; sfx.playWrong(); setHint(true); speak(cur.on_wrong && cur.on_wrong[lang]); };
  const ensureAdv = () => { if (!advRef.current) { advRef.current = true; audio.triggerEvent('check_pressed'); } };
  const submitInput = () => { if (flash) return; const v = parseInt(String(val).replace(/[^0-9-]/g, ''), 10); if (isNaN(v)) return; ensureAdv(); v === cur.answer ? fireOk() : fireBad(); };
  const submitPlace = () => { if (flash || pickV === null) return; ensureAdv(); pickV === cur.answer ? fireOk() : fireBad(); };
  const pickMC = (i) => { if (flash || wrongSet.has(i)) return; ensureAdv(); if (i === sh.correctIdx) { setPickV(i); fireOk(); } else { wrongRef.current = true; sfx.playWrong(); setWrongSet(p => { const s = new Set(p); s.add(i); return s; }); setHint(true); speak(cur.on_wrong && cur.on_wrong[lang]); } };
  const submitOrder = () => { if (flash || seq.length < cur.vals.length) return; ensureAdv(); const sorted = [...cur.vals].sort((a, b) => a - b); const okk = seq.every((s, p) => cur.vals[s] === sorted[p]); if (okk) fireOk(); else { fireBad(); setTimeout(() => setSeq([]), 500); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
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
            {cur.type === 'input' && (
              <>
                <div className="frame" style={{ display: 'flex', justifyContent: 'center' }}><CoordLine value={cur.value} min={-6} max={6} success={flash}/></div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <input type="text" inputMode="numeric" className={`answer-input ${flash ? 'correct' : (hint ? 'wrong' : '')}`} value={val} placeholder="0" disabled={flash} onChange={e => { setVal(e.target.value); setHint(false); }} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(100px, 24vw, 140px)' }}/>
                  {!flash && <button className="btn-white-accent" disabled={!val} onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>}
                </div>
              </>
            )}
            {cur.type === 'place' && (
              <>
                <div className="frame" style={{ display: 'flex', justifyContent: 'center' }}><CoordLine min={cur.min} max={cur.max} onPick={(v) => { if (!flash) { setPickV(v); setHint(false); } }} picked={pickV} success={flash}/></div>
                {!flash && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" disabled={pickV === null} onClick={submitPlace} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
              </>
            )}
            {cur.type === 'mc' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {sh.options.map((opt, i) => {
                  const isWrong = wrongSet.has(i); const isC = flash && i === sh.correctIdx;
                  let cls = 'option'; if (isC) cls += ' option-correct'; else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={flash || isWrong} onClick={() => pickMC(i)} style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(12px, 2vw, 16px)', minHeight: 'clamp(50px, 7vw, 60px)', fontSize: 'clamp(14px, 1.8vw, 16px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="mono small" style={{ minWidth: 18, color: isC ? T.success : (isWrong ? T.accent : T.ink3) }}>{isC ? '✓' : (isWrong ? '✗' : String.fromCharCode(65 + i))}</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {cur.type === 'order' && (
              <>
                <div className="od-grid">
                  {cur.vals.map((v, i) => { const pos = seq.indexOf(i); return (
                    <button key={i} className={`od-card${pos !== -1 ? ' od-on' : ''}${flash ? ' od-ok' : ''}`} disabled={flash} onClick={() => { if (!flash) { setSeq(p => p.includes(i) ? p : [...p, i]); setHint(false); } }}>
                      {pos !== -1 && <span className="od-badge">{pos + 1}</span>}<span className="od-temp">{fmtN(v)}</span>
                    </button>); })}
                </div>
                {!flash && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><button className="btn-ghost" disabled={seq.length === 0} onClick={() => setSeq([])} style={{ padding: 'clamp(9px, 1.5vw, 11px) clamp(14px, 2vw, 18px)', fontSize: 'clamp(11px, 1.4vw, 13px)' }}>{lang === 'uz' ? 'Tozalash' : 'Сброс'}</button><button className="btn-white-accent" disabled={seq.length < cur.vals.length} onClick={submitOrder} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button></div>}
              </>
            )}
            {hint && !flash && (cur.hint || cur.wrong_1) && (
              <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(cur.hint || (lastWrongHint(cur, sh, wrongSet)) || cur.on_wrong))}</p></div>
            )}
          </div>
        )}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? 'Tayyor' : 'Готово'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(w.done_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};
function lastWrongHint(cur, sh, wrongSet) {
  if (cur.type !== 'mc' || !sh) return null;
  const last = [...wrongSet].slice(-1)[0];
  return (last !== undefined && sh.content[`wrong_${last}`]) || null;
}

// s6 — BLOCK: 4-5 har xil turdagi savol ketma-ket (kiritish / MC / o'qqa belgilash / tartiblash)
const Screen6 = (props) => <SeqMix {...props} idx={6} totalScreens={TOTAL_SCREENS} items={MIX_ITEMS} screenContent={MIX_W} scope={SCREEN_META[6].scope}/>;

// ============================================================
// SeqMCBlock — bitta slaydda ko'p MC misol KETMA-KET (mobil-do'st, веди-до-верного,
// to'g'ri javobda keyingisi ochiladi, javob berilgani ✓ qatorga buklanadi).
// Ovozli xato = on_wrong (toza); ko'rinadigan maslahat = wrong_N. Son so'z bilan.
// ============================================================
const SeqMCBlock = ({ screen, totalScreens, screenContent, items, scope, storedAnswer, onAnswer, onNext, onPrev, factOnDone }) => {
  const w = screenContent; const t = useT(); const lang = useLang(); const sfx = useSfx();
  const n = items.length;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: `s${screen}_i0`, text: items[0].c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [results, setResults] = useState(() => (wasSolved ? items.map(() => true) : []));
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [lastWrong, setLastWrong] = useState(null);
  const wrongRef = useRef(false);
  const advancedRef = useRef(wasSolved);
  const done = idx >= n;
  const cur = done ? null : items[idx];
  const sh = cur ? shuffleMC(cur.c, cur.optKeys.map(k => optEl(t, cur.c[k])), cur.correct, cur.order || cur.optKeys.map((_, i) => i)) : null;
  const speak = (txt) => { if (txt && !audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };

  const advance = (ft) => {
    const nr = [...results]; nr[idx] = ft; const ni = idx + 1;
    setResults(nr); setWrongSet(new Set()); setPicked(null); setLastWrong(null); wrongRef.current = false; setIdx(ni);
    if (ni >= n) {
      const allOk = nr.every(Boolean);
      onAnswer({ stage: scope, screenIdx: screen, correctAnswer: 'seq', studentAnswer: JSON.stringify(nr), correct: allOk, firstTry: allOk, solved: true });
      speak(w.done_text && w.done_text[lang]);
    } else { speak(items[ni].c.audio.intro[lang]); }
  };
  const pick = (i) => {
    if (done || wrongSet.has(i) || picked !== null) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (i === sh.correctIdx) {
      setPicked(i); sfx.playCorrect();
      speak(cur.c.audio.on_correct && cur.c.audio.on_correct[lang]);
      const ft = !wrongRef.current; setTimeout(() => advance(ft), 750);
    } else {
      wrongRef.current = true; sfx.playWrong();
      setWrongSet(prev => { const s = new Set(prev); s.add(i); return s; });
      setLastWrong(i);
      speak(cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  const hintNode = (lastWrong !== null && sh && (sh.content[`wrong_${lastWrong}`] || sh.content[`hint_${lastWrong}`])) || (cur && cur.c.wrong_default);
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
        {results.slice(0, idx).map((ft, k) => (
          <div key={k} className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'clamp(9px, 1.6vw, 12px) clamp(12px, 2vw, 16px)' }}>
            <span className="mono small" style={{ color: T.success, fontWeight: 700 }} aria-hidden="true">✓</span>
            <span className="small" style={{ color: T.ink2 }}>{(lang === 'uz' ? 'Misol ' : 'Пример ') + (k + 1) + (lang === 'uz' ? " — to'g'ri" : ' — верно')}</span>
          </div>
        ))}
        {cur && (
          <div className="fade-up" key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
            <h3 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.c.lead))}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {sh.options.map((opt, i) => {
                const isWrong = wrongSet.has(i);
                const isC = picked !== null && i === sh.correctIdx;
                let cls = 'option'; if (isC) cls += ' option-correct'; else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={picked !== null || isWrong} onClick={() => pick(i)} style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(12px, 2vw, 16px)', minHeight: 'clamp(50px, 7vw, 60px)', fontSize: 'clamp(14px, 1.8vw, 16px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mono small" style={{ minWidth: 18, color: isC ? T.success : (isWrong ? T.accent : T.ink3) }}>{isC ? '✓' : (isWrong ? '✗' : String.fromCharCode(65 + i))}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            {lastWrong !== null && picked === null && hintNode && (
              <div className="frame-tip fade-up"><p className="body" style={{ margin: 0 }}>{mt(t(hintNode))}</p></div>
            )}
          </div>
        )}
        {done && (
          <>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? 'Tayyor' : 'Готово'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(w.done_text))}</p>
            </FeedbackBlock>
            {factOnDone}
          </>
        )}
      </div>
    </Stage>
  );
};

// Yangi taqqoslash misollari (draft — UZ metodist tasdig'ini kutadi).
const NEW_A1 = {
  lead: { ru: 'Какое число больше: −12 или −8?', uz: "Qaysi son katta: −12 yoki −8?" },
  opt0: { ru: '−8', uz: '−8' }, opt1: { ru: '−12', uz: '−12' }, opt2: { ru: 'Они равны', uz: 'Ular teng' },
  correct_text: { ru: 'Верно. −8 правее −12 на прямой, значит больше. Большая цифра не делает минус больше.', uz: "To'g'ri. −8 o'qda −12 dan o'ngroqda, demak katta. Katta raqam minusni katta qilmaydi." },
  wrong_1: { ru: '−12 кажется больше, ведь 12 больше 8. Но он левее, значит меньше. Больше −8.', uz: "−12 katta tuyuladi, axir 12, 8 dan katta. Lekin u chaproqda, demak kichik. Katta — −8." },
  wrong_2: { ru: 'Это разные точки. Кто правее — больше, это −8.', uz: "Bular turli nuqta. Kim o'ngroqda — katta, bu −8." },
  wrong_default: { ru: 'Правее на прямой — больше.', uz: "O'qda o'ngroqda — katta." },
  audio: { intro: { ru: 'Какое число больше: минус двенадцать или минус восемь? Выбери ответ.', uz: "Qaysi son katta: minus o'n ikki yoki minus sakkiz? Javobni tanlang." }, on_correct: { ru: 'Верно. Минус восемь больше.', uz: "To'g'ri. Minus sakkiz katta." }, on_wrong: { ru: 'Большая цифра не делает минус больше. Кто правее, тот больше.', uz: "Katta raqam minusni katta qilmaydi. Kim o'ngroqda, o'sha katta." } }
};
const NEW_A2 = {
  lead: { ru: 'Какое число больше: −1 или 1?', uz: "Qaysi son katta: −1 yoki 1?" },
  opt0: { ru: '1', uz: '1' }, opt1: { ru: '−1', uz: '−1' }, opt2: { ru: 'Они равны', uz: 'Ular teng' },
  correct_text: { ru: 'Верно. 1 правее нуля, −1 левее. Любое положительное больше любого отрицательного.', uz: "To'g'ri. 1 noldan o'ngda, −1 chapda. Har qanday musbat har qanday manfiydan katta." },
  wrong_1: { ru: '−1 и 1 не равны по знаку: −1 левее нуля, 1 правее. Больше 1.', uz: "−1 va 1 ishorasi bilan teng emas: −1 noldan chapda, 1 o'ngda. Katta — 1." },
  wrong_2: { ru: 'Они не равны: у них разные знаки. Положительное 1 больше.', uz: "Ular teng emas: ishoralari har xil. Musbat 1 katta." },
  wrong_default: { ru: 'Положительное всегда больше отрицательного.', uz: "Musbat doim manfiydan katta." },
  audio: { intro: { ru: 'Какое число больше: минус один или один? Выбери ответ.', uz: "Qaysi son katta: minus bir yoki bir? Javobni tanlang." }, on_correct: { ru: 'Верно. Положительное один больше отрицательного.', uz: "To'g'ri. Musbat bir manfiydan katta." }, on_wrong: { ru: 'Положительное правее нуля, отрицательное левее.', uz: "Musbat noldan o'ngda, manfiy chapda." } }
};
const NEW_B1 = {
  lead: { ru: 'Какое число больше: −19 или −20?', uz: "Qaysi son katta: −19 yoki −20?" },
  opt0: { ru: '−19', uz: '−19' }, opt1: { ru: '−20', uz: '−20' }, opt2: { ru: 'Они равны', uz: 'Ular teng' },
  correct_text: { ru: 'Верно. −19 на один шаг правее −20, значит чуть больше.', uz: "To'g'ri. −19, −20 dan bir qadam o'ngroqda, demak bir oz katta." },
  wrong_1: { ru: '−20 кажется больше, ведь 20 больше 19. Но он левее, значит меньше. Больше −19.', uz: "−20 katta tuyuladi, axir 20, 19 dan katta. Lekin u chaproqda, demak kichik. Katta — −19." },
  wrong_2: { ru: 'Числа близкие, но не равные: −19 правее −20.', uz: "Sonlar yaqin, lekin teng emas: −19, −20 dan o'ngroqda." },
  wrong_default: { ru: 'Правее на прямой — больше.', uz: "O'qda o'ngroqda — katta." },
  audio: { intro: { ru: 'Какое число больше: минус девятнадцать или минус двадцать? Выбери ответ.', uz: "Qaysi son katta: minus o'n to'qqiz yoki minus yigirma? Javobni tanlang." }, on_correct: { ru: 'Верно. Минус девятнадцать больше.', uz: "To'g'ri. Minus o'n to'qqiz katta." }, on_wrong: { ru: 'Кто правее на прямой, тот больше.', uz: "O'qda kim o'ngroqda, o'sha katta." } }
};
const NEW_B2 = {
  lead: { ru: 'Какое число самое маленькое: −2, −11 или −7?', uz: "Qaysi son eng kichik: −2, −11 yoki −7?" },
  opt0: { ru: '−11', uz: '−11' }, opt1: { ru: '−2', uz: '−2' }, opt2: { ru: '−7', uz: '−7' },
  correct_text: { ru: 'Верно. −11 левее всех на прямой, значит самое маленькое.', uz: "To'g'ri. −11 o'qda hammadan chapda, demak eng kichik." },
  wrong_1: { ru: '−2 правее всех, значит самое большое, а не маленькое. Меньше всех −11.', uz: "−2 hammadan o'ngda, demak eng katta, kichik emas. Eng kichigi — −11." },
  wrong_2: { ru: '−7 левее −2, но −11 ещё левее. Самое маленькое −11.', uz: "−7, −2 dan chapda, lekin −11 yanada chapda. Eng kichigi — −11." },
  wrong_default: { ru: 'Левее на прямой — меньше.', uz: "O'qda chaproqda — kichik." },
  audio: { intro: { ru: 'Какое число самое маленькое: минус два, минус одиннадцать или минус семь? Выбери ответ.', uz: "Qaysi son eng kichik: minus ikki, minus o'n bir yoki minus yetti? Javobni tanlang." }, on_correct: { ru: 'Верно. Минус одиннадцать самое маленькое.', uz: "To'g'ri. Minus o'n bir eng kichik." }, on_wrong: { ru: 'Кто левее на прямой, тот меньше.', uz: "O'qda kim chaproqda, o'sha kichik." } }
};
const W_BLOCK_A = {
  eyebrow: { ru: 'Тренировка · сравнение', uz: 'Mashq · taqqoslash' },
  title: { ru: 'Сравни числа по очереди', uz: 'Sonlarni navbat bilan taqqosla' },
  lead: { ru: 'Несколько примеров подряд. Подумай, кто правее на прямой.', uz: "Bir nechta misol birin-ketin. O'qda kim o'ngroqda — o'ylab ko'r." },
  done_text: { ru: 'Все верно! Кто правее на прямой, тот больше — даже среди отрицательных.', uz: "Hammasi to'g'ri! O'qda kim o'ngroqda, o'sha katta — manfiylar orasida ham." }
};
const W_BLOCK_B = {
  eyebrow: { ru: 'Итог · сравнение', uz: 'Yakun · taqqoslash' },
  title: { ru: 'Проверь себя', uz: "O'zingni tekshir" },
  lead: { ru: 'Реши примеры один за другим.', uz: "Misollarni birin-ketin yech." },
  done_text: { ru: 'Отлично! Ты сравниваешь отрицательные числа по их месту на прямой.', uz: "Ajoyib! Manfiy sonlarni o'qdagi o'rni bo'yicha taqqoslayapsan." }
};

// s7 — BLOCK A: ketma-ket taqqoslash misollari (s7 + 2 yangi) + Fakt Tarix
const Screen7 = (props) => {
  const items = [
    { c: CONTENT.s7, optKeys: ['opt0', 'opt1', 'opt2', 'opt3'], correct: 0, order: [1, 2, 0, 3] },
    { c: NEW_A1, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [1, 0, 2] },
    { c: NEW_A2, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [2, 0, 1] }
  ];
  return <SeqMCBlock {...props} idx={7} totalScreens={TOTAL_SCREENS} screenContent={W_BLOCK_A} items={items} scope={SCREEN_META[7].scope} factOnDone={<FactCard text={CONTENT.s7.fact} badge={FB_HIST} anim={<AnimHistory/>}/>}/>;
};

// s8 — TEST son o'qiga bosib qo'yish (marker −2 ga)
const S8_OK = -2;
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [picked, setPicked] = useState(() => (wasSolved ? S8_OK : null));
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const choose = (v) => { if (solved) return; setChecked(false); setPicked(v); };
  const check = () => {
    if (solved) return;
    if (picked === null) return;
    const ok = picked === S8_OK;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.lead[lang], correctAnswer: String(S8_OK), studentAnswer: String(picked), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <CoordLine min={-6} max={6} onPick={choose} picked={picked} success={solved}/>
          <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{picked === null ? t(c.tap_prompt) : fmtN(picked)}</p>
        </div>
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.hint_wrong))}</p>
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s9 — TEST tartiblash (sovuqdan issiqga: −7, −2, 0, 3) tap-in-order + Fakt Fan
const S9_VALS = [3, -7, 0, -2];          // ko'rsatish tartibi
const S9_ORDER = [1, 3, 2, 0];           // to'g'ri ketma-ketlik (index): −7, −2, 0, 3
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s9; const sfx = useSfx();
  const audio = useAudio([{ id: 's9_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [seq, setSeq] = useState(() => (wasSolved ? S9_ORDER.slice() : []));
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const tap = (i) => {
    if (solved) return;
    setChecked(false);
    setSeq(prev => (prev.includes(i) ? prev : [...prev, i]));
  };
  const clear = () => { if (!solved) { setSeq([]); setChecked(false); } };
  const check = () => {
    if (solved) return;
    if (seq.length < S9_VALS.length) return;
    const ok = seq.every((idx, pos) => idx === S9_ORDER[pos]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[9].scope, screenIdx: 9, question: c.lead[lang], correctAnswer: S9_ORDER.join(','), studentAnswer: seq.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setTimeout(() => setSeq([]), 600); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)', justifyContent: 'center' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="od-grid fade-up delay-1">
          {S9_VALS.map((v, i) => {
            const pos = seq.indexOf(i);
            const isBad = checked && !solved && pos !== -1 && seq[pos] !== S9_ORDER[pos];
            return (
              <button key={i} className={`od-card${pos !== -1 ? ' od-on' : ''}${solved ? ' od-ok' : ''}${isBad ? ' od-bad' : ''}`} disabled={solved} onClick={() => tap(i)}>
                {pos !== -1 && <span className="od-badge">{pos + 1}</span>}
                <span className="od-temp">{fmtN(v)}°</span>
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
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <button className="btn-ghost" onClick={clear} disabled={seq.length === 0} style={{ padding: 'clamp(9px, 1.5vw, 11px) clamp(14px, 2vw, 18px)', fontSize: 'clamp(11px, 1.4vw, 13px)' }}>{t(c.reset_hint)}</button>
            <button className="btn-white-accent" onClick={check} disabled={seq.length < S9_VALS.length} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.4vw, 24px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && <div className="fade-up"><FactCard text={c.fact} badge={FB_SCI} anim={<AnimAbsZero/>}/></div>}
      </div>
    </Stage>
  );
};

// s10 — TEST tasniflash (musbat/manfiy/nol) tap-to-bin + Fakt IT
const S10_BINS = ['neg', 'pos', 'zero'];
const S10_OK = ['neg', 'pos', 'zero'];   // it0(−4)->neg, it1(5)->pos, it2(0)->zero
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10; const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const items = [c.it0, c.it1, c.it2];
  const binLabels = { neg: c.bin_neg, pos: c.bin_pos, zero: c.bin_zero };
  const wasSolved = storedAnswer?.solved === true;
  const [sel, setSel] = useState(() => (wasSolved ? S10_OK.slice() : [null, null, null]));
  const [solved, setSolved] = useState(wasSolved);
  const [checked, setChecked] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const choose = (itemIdx, bin) => { if (solved) return; setChecked(false); setSel(p => { const n = [...p]; n[itemIdx] = bin; return n; }); };
  const check = () => {
    if (solved) return;
    if (sel.some(v => v === null)) return;
    const ok = S10_OK.every((v, i) => v === sel[i]);
    if (firstTryRef.current === null) firstTryRef.current = ok;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    setChecked(true);
    if (ok) {
      setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[10].scope, screenIdx: 10, question: c.lead[lang], correctAnswer: S10_OK.join(','), studentAnswer: sel.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(ok ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c.lead))}</p>
        <div className="cl-list fade-up delay-1" style={{ position: 'relative' }}>
          {items.map((it, i) => {
            const right = checked && sel[i] === S10_OK[i];
            const bad = checked && !solved && sel[i] !== null && sel[i] !== S10_OK[i];
            return (
              <div key={i} className={`cl-row${right && solved ? ' cl-ok' : ''}${bad ? ' cl-bad' : ''}`}>
                <span className="cl-item">{mt(t(it))}</span>
                <div className="cl-bins">
                  {S10_BINS.map(bin => (
                    <button key={bin} className={`cl-bin${sel[i] === bin ? ' cl-on' : ''}`} disabled={solved} onClick={() => choose(i, bin)}>{t(binLabels[bin])}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {checked && !solved && (
          <div className="frame-tip fade-up" style={{ position: 'relative', display: 'flex', gap: 8 }}>
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
          </FeedbackBlock>
        )}
        {solved && <div className="fade-up"><FactCard text={c.fact} badge={FB_IT} anim={<AnimBits/>}/></div>}
      </div>
    </Stage>
  );
};

// s11 — CASE setup (Zarina −4, Komil −2; SeaScale)
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
          <SeaScale min={-6} max={2} markers={[{ v: -2, label: 'Komil' }, { v: -4, label: 'Zarina' }]} unit={20}/>
        </div>
        <p className="body fade-up delay-2" style={{ margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.note))}</p>
        <div className="frame-tip fade-up delay-3"><p className="body" style={{ margin: 0 }}>{mt(t(c.hint_calc))}</p></div>
      </div>
    </Stage>
  );
};

// s12 — BLOCK B (FINAL): ketma-ket taqqoslash misollari (s12 + 2 yangi) + Fakt Fan (O'lik dengiz)
const Screen12 = (props) => {
  const items = [
    { c: CONTENT.s12, optKeys: ['opt0', 'opt1', 'opt2', 'opt3'], correct: 0, order: [3, 1, 2, 0] },
    { c: NEW_B1, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [1, 2, 0] },
    { c: NEW_B2, optKeys: ['opt0', 'opt1', 'opt2'], correct: 0, order: [2, 1, 0] }
  ];
  return <SeqMCBlock {...props} idx={12} totalScreens={TOTAL_SCREENS} screenContent={W_BLOCK_B} items={items} scope={SCREEN_META[12].scope} factOnDone={<FactCard text={CONTENT.s12.fact} badge={FB_SCI} anim={<AnimDeadSea/>}/>}/>;
};

// s13 — SUMMARY + hook yopilishi + bog'lanishlar + ambient
// SUMMARY — barcha darslar uchun YAGONA tuzilma (etalon: Dars09-13): eyebrow + h-title +
// ball qatori (X/Y) + asosiy punktlar + hookni yopish + ConnectionsBlock, top-anchor.
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
export default function NegNumberLineLesson({
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


/* MATH neg_5_01: SeaScale — vertikal dengiz sathи o'qи (0 sath, yuqori musbat, past suv). */
.ss { display: block; }
.ss-sky { fill: rgba(255, 79, 40, 0.04); }
.ss-water { fill: rgba(1, 154, 203, 0.12); }
.ss-axis { stroke: #A7A6A2; stroke-width: 1.6; }
.ss-tick { stroke: #A7A6A2; stroke-width: 1.4; }
.ss-tick0 { stroke: #019ACB; stroke-width: 2.2; }
.ss-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 11px; fill: #5A5A60; }
.ss-lbl0 { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; fill: #019ACB; }
.ss-surface { stroke: #019ACB; stroke-width: 2; stroke-dasharray: 5 4; opacity: 0.8; }
.ss-stem { stroke: #FF4F28; stroke-width: 2; opacity: 0.5; }
.ss-mlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; fill: #0E0E10; }
.ss-dot { fill: #FF4F28; stroke: #FFFFFF; stroke-width: 2; transform-box: fill-box; transform-origin: center; animation: ssPulse 2.6s ease-in-out infinite; }
.ss-dot-ok { fill: #1F7A4D; }
@keyframes ssPulse { 0%, 100% { r: 8px; } 50% { r: 9.5px; } }
.ss-mk.ss-dive { animation: ssDive 0.9s cubic-bezier(0.34, 1.1, 0.64, 1) both; }
@keyframes ssDive { from { transform: translateY(-64px); opacity: 0; } }
.ss-bub { fill: #019ACB; opacity: 0; }
.ss-bub0 { animation: ssBub 3.4s ease-in infinite; }
.ss-bub1 { animation: ssBub 4.2s ease-in 0.8s infinite; }
.ss-bub2 { animation: ssBub 3.8s ease-in 1.6s infinite; }
.ss-bub3 { animation: ssBub 4.6s ease-in 2.3s infinite; }
@keyframes ssBub { 0% { transform: translateY(0); opacity: 0; } 18% { opacity: 0.5; } 100% { transform: translateY(-58px); opacity: 0; } }

/* MATH neg_5_01: CoordLine — gorizontal koordinata o'qи (dars maqsadi). */
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
.cn-readout { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); flex-wrap: wrap; justify-content: center; }
.cn-ro-lbl { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); text-transform: uppercase; letter-spacing: 0.06em; color: #A7A6A2; }
.cn-ro-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.4vw, 24px); color: #FF4F28; }
.cn-ro-opp { color: #019ACB; }
.cn-ro-sep { width: 1px; height: 20px; background: #E4E1DA; }

/* MATH neg_5_01: od — tartiblash kartalarи (sovuqдан issiqга tap-in-order). */
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

/* MATH neg_5_01: cl — classify (musbat/manfiy/nol tap-to-bin). */
.cl-list { display: flex; flex-direction: column; gap: 10px; }
.cl-row { display: flex; align-items: center; justify-content: space-between; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; background: #FFFFFF; border-radius: 12px; padding: clamp(9px, 1.5vw, 12px) clamp(12px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.18s; }
.cl-item { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 2.6vw, 20px); color: #0E0E10; font-weight: 700; }
.cl-bins { display: flex; gap: 6px; flex-wrap: wrap; }
.cl-bin { cursor: pointer; border: 1.5px solid #A7A6A2; background: #FFFFFF; border-radius: 99px; padding: clamp(6px, 1vw, 8px) clamp(10px, 1.6vw, 14px); font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; transition: all 0.16s; }
.cl-bin:hover:not(:disabled) { border-color: #FF4F28; color: #0E0E10; }
.cl-bin:disabled { cursor: default; }
.cl-on { background: #FF4F28; border-color: #FF4F28; color: #FFFFFF; }
.cl-bad { box-shadow: 0 0 0 2px #FF4F28 inset, 0 6px 16px -6px rgba(255, 79, 40, 0.3); }
.cl-ok { box-shadow: 0 0 0 2px #1F7A4D inset, 0 6px 16px -6px rgba(31, 122, 77, 0.3); }
.cl-ok .cl-on { background: #1F7A4D; border-color: #1F7A4D; }

/* MATH neg_5_01: fakt-animatsiyalar (CSS-only loop, ko'k tema, qutiga sig'adi). */
/* Tarix: qadimgi sanoq tayoqchaлари navbatма-navbat yorishadi. */
.fa-hist { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.fa-hist-r { width: 7px; background: #019ACB; opacity: 0.3; border-radius: 3px; animation: faHist 2s ease-in-out infinite; }
.fa-hist-r:nth-child(1) { height: 40%; }
.fa-hist-r:nth-child(2) { height: 70%; }
.fa-hist-r:nth-child(3) { height: 100%; }
.fa-hist-r:nth-child(4) { height: 60%; }
.fa-hist-r:nth-child(5) { height: 85%; }
@keyframes faHist { 0%, 100% { opacity: 0.25; } 45% { opacity: 0.95; } }
/* Absolyut nol: termometr simobи pastга tushadi. */
.fa-th { width: clamp(34px, 7vw, 46px); height: auto; }
.fa-th-tube { fill: rgba(1, 154, 203, 0.12); stroke: #019ACB; stroke-width: 1.6; }
.fa-th-bulb { fill: #019ACB; }
.fa-th-merc { fill: #019ACB; transform-box: fill-box; transform-origin: bottom; animation: faTh 2.8s ease-in-out infinite; }
@keyframes faTh { 0%, 100% { transform: scaleY(0.2); } 55%, 75% { transform: scaleY(1); } }
/* IT: ikkilik bitlar yonadi, belgi-bit ko'kроq. */
.fa-bit { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; width: clamp(76px, 15vw, 104px); }
.fa-bit-c { aspect-ratio: 1; background: #019ACB; opacity: 0.22; border-radius: 4px; animation: faBit 1.8s ease-in-out infinite; }
.fa-bit-sign { opacity: 0.5; box-shadow: 0 0 0 2px #019ACB; }
@keyframes faBit { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.92; } }
/* O'lik dengiz: marker chuqur belgига tushadi. */
.fa-ds { width: clamp(48px, 10vw, 64px); height: auto; }
.fa-ds-water { fill: rgba(1, 154, 203, 0.14); }
.fa-ds-surf { stroke: #019ACB; stroke-width: 2; stroke-dasharray: 4 3; }
.fa-ds-dot { fill: #019ACB; transform-box: fill-box; transform-origin: center; animation: faDs 3s ease-in-out infinite; }
@keyframes faDs { 0%, 12% { transform: translateY(0); } 60%, 80% { transform: translateY(40px); } 100% { transform: translateY(0); } }

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
