import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Вычитание дробей с разными знаменателями — frac_5_12 (Dars17, квест «Kasr orollari»)
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
      {isCorrect && <RewardBurst/>}
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
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            const exiting = solved && i !== correctIdx;   // to'g'ri javobdan keyin noto'g'ri variantlar yig'iladi (Dars1 metodi)
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            if (solved && i === correctIdx) cls += ' option-correct';
            else if (!solved && isWrongPicked) cls += ' option-picked-wrong';
            const disabled = solved || isWrongPicked;
            return (
              <button key={i} className={cls} disabled={disabled} aria-hidden={exiting} tabIndex={exiting ? -1 : undefined} onClick={() => pick(i)}
                style={{ paddingLeft: 'clamp(14px, 2.1vw, 19px)', paddingRight: 'clamp(14px, 2.1vw, 19px)', paddingTop: exiting ? 0 : 'clamp(12px, 1.7vw, 12px)', paddingBottom: exiting ? 0 : 'clamp(12px, 1.7vw, 12px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: exiting ? 0 : 'clamp(50px, 7vw, 60px)', display: 'flex', alignItems: 'center', gap: 12, maxHeight: exiting ? 0 : 200, opacity: exiting ? 0 : 1, borderWidth: exiting ? 0 : undefined, overflow: 'hidden', transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), min-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// --- ПОД УРОК: frac_5_12 — Вычитание дробей с разными знаменателями (квест Kasr orollari) ---
// ============================================================

const LESSON_META = {
  lessonId: 'frac-5-12-v1',
  lessonTitle: { ru: 'Вычитание дробей с разными знаменателями', uz: "Har xil maxrajli kasrlarni ayirish" }
};
const TOTAL_SCREENS = 17;

// Обучающий урок: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's6',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's11', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'NumInputScreen', scored: true,  scope: 'practice' },
  { id: 's13', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's14', type: 'test',        template: 'custom',         scored: true,  scope: 'final' },
  { id: 's15', type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'final' },
  { id: 's16', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // s0 — HOOK: баг в игре, 5/6 − 1/3 = 4/3
  s0: {
    eyebrow: { ru: 'Острова дробей', uz: "Kasr orollari" },
    title: { ru: 'Баг в игре: после удара щит стал больше.', uz: "O'yinda xato: zarbadan keyin qalqon kattalashdi." },
    body: { ru: 'Игра посчитала так: 5 − 1 = 4 и 6 − 3 = 3. Но 4/3 — больше целого щита! Выходит, после удара щит вырос. Что-то тут не так.', uz: "O'yin shunday hisobladi: 5 − 1 = 4 va 6 − 3 = 3. Lekin 4/3 — butun qalqondan katta! Demak, zarbadan keyin qalqon o'sgan. Bu yerda nimadir noto'g'ri." },
    question: { ru: 'Может ли щит вырасти после удара дракона?', uz: "Ajdaho zarbasidan keyin qalqon o'sishi mumkinmi?" },
    reveal: { ru: 'Запомни свой ответ — в конце урока вернёмся к нему.', uz: "Javobingizni eslab qoling — dars oxirida unga qaytamiz." },
    opt0: { ru: 'Нет, это баг в игре', uz: "Yo'q, bu o'yindagi xato" },
    opt1: { ru: 'Да, так бывает', uz: "Ha, shunday bo'ladi" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Сардор играет в квест Острова дробей. Щит героя был заполнен на пять шестых. Дракон ударил и снял одну третью. Игра посчитала так. Пять минус один четыре, шесть минус три три. И показала четыре третьих. Но четыре третьих больше целого щита. Выходит, после удара щит вырос. Как думаешь, так может быть? Выбери ответ.', uz: "Sardor Kasr orollari kvestini o'ynayapti. Qahramon qalqoni oltidan besh qismga to'la edi. Ajdaho urib, uchdan bir qismini olib tashladi. O'yin shunday hisobladi. Besh minus bir to'rt, olti minus uch uch. Va uchdan to'rtni ko'rsatdi. Lekin uchdan to'rt butun qalqondan katta. Demak, zarbadan keyin qalqon o'sgan. Sizningcha, shunday bo'lishi mumkinmi? Javobni tanlang." }
  },

  // s1 — EXPLORATION step: куски разного размера, 1/3 = 2/6
  s1: {
    eyebrow: { ru: 'Уровень 1 · Кусочки', uz: "1-daraja · Bo'laklar" },
    title: { ru: 'Почему 5 − 1 и 6 − 3 — это баг', uz: "Nega 5 − 1 va 6 − 3 — bu xato" },
    conclusion: { ru: 'Куски разного размера. Но 1/3 — это ровно 2/6.', uz: "Bo'laklar har xil o'lchamda. Lekin 1/3 — bu roppa rosa 2/6." },
    btn_step: { ru: 'Дальше', uz: "Davom etish" },
    btn_final: { ru: 'На следующий уровень', uz: "Keyingi darajaga" },
    audio: {
      ru: [
        'Разберёмся, почему игра ошиблась. Нажимай кнопку дальше.',
        'Щит поделён на шесть клеток, закрашено пять. Это пять шестых.',
        'Удар дракона это одна третья. Трети крупнее шестых. Куски разного размера, вычитать их напрямую нельзя.',
        'Но одна третья это ровно две шестых. Накладываем и проверяем. Значит, вычесть нужно две клетки из пяти.'
      ],
      uz: [
        "O'yin nega xato qilganini aniqlaymiz. Davom etish tugmasini bosing.",
        "Qalqon olti katakka bo'lingan, beshtasi bo'yalgan. Bu oltidan besh.",
        "Ajdaho zarbasi bu uchdan bir. Uchdan birlar oltidan birlardan yirikroq. Bo'laklar har xil o'lchamda, ularni to'g'ridan to'g'ri ayirib bo'lmaydi.",
        "Lekin uchdan bir bu roppa rosa oltidan ikki. Ustiga qo'yib tekshiramiz. Demak, besh katakdan ikkitasini ayirish kerak."
      ]
    }
  },

  // s2 — EXPLORATION slider: мост, общий знаменатель для 1/2 и 1/3 → 6
  s2: {
    eyebrow: { ru: 'Уровень 2 · Мост', uz: "2-daraja · Ko'prik" },
    title: { ru: 'Найди число долей, на которое ровно лягут 1/2 и 1/3.', uz: "1/2 va 1/3 tekis tushadigan ulushlar sonini toping." },
    label_slider: { ru: 'Досок в мосту', uz: "Ko'prikdagi taxtalar" },
    note_fit: { ru: 'Подходит! Делится и на 2, и на 3.', uz: "Mos keldi! Ham 2 ga, ham 3 ga bo'linadi." },
    note_nofit: { ru: 'Не подходит: куски не лягут ровно.', uz: "Mos emas: bo'laklar tekis tushmaydi." },
    conclusion: { ru: 'Подходит! На 6 долях обе дроби лягут ровно.', uz: "Mos keldi! 6 ulushda ikkala kasr tekis tushadi." },
    btn: { ru: 'Перейти мост', uz: "Ko'prikdan o'tish" },
    audio: { ru: 'Чтобы попасть на следующий остров, нужен мост из одинаковых досок. Подвигай ползунок и найди число досок, на которое ровно лягут и половина, и треть. Подходит шесть. Половина это три шестых, одна третья это две шестых. Теперь вычитаем. Три шестых минус две шестых равно одна шестая. Мост готов.', uz: "Keyingi orolga o'tish uchun bir xil taxtalardan ko'prik kerak. Slayderni surib, yarim ham, uchdan bir ham tekis tushadigan taxtalar sonini toping. Olti mos keladi. Yarim bu oltidan uch, uchdan bir esa oltidan ikki. Endi ayiramiz. Oltidan uch minus oltidan ikki teng oltidan bir. Ko'prik tayyor." }
  },

  // s3 — RULE: 3 шага + fact-карта №1 (Египет)
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    label: { ru: 'Вычитание дробей с разными знаменателями', uz: "Har xil maxrajli kasrlarni ayirish" },
    title: { ru: 'Сначала — общий знаменатель, потом вычитаем числители.', uz: "Avval umumiy maxraj, keyin suratlarni ayiramiz." },
    card_top: { ru: '1. Общий знаменатель.', uz: "1. Umumiy maxraj." },
    card_bottom: { ru: '2. Привести обе дроби: числитель — на то же число, что и знаменатель.', uz: "2. Ikkala kasrni keltirish: suratni ham maxraj ko'paytirilgan songa." },
    card_line: { ru: '3. Вычесть только числители. Знаменатель не трогаем.', uz: "3. Faqat suratlarni ayirish. Maxrajga tegmaymiz." },
    outro: { ru: 'Знаменатель — размер куска. Его не вычитают.', uz: "Maxraj — bo'lak o'lchami. U ayirilmaydi." },
    fact_label: { ru: 'Интересный факт', uz: "Qiziqarli fakt" },
    fact_text: { ru: 'Древние египтяне дробь 5/6 писали как 1/2 + 1/3 — те же числа, что в квесте.', uz: "Qadimgi misrliklar 5/6 ni 1/2 + 1/3 shaklida yozishgan — xuddi kvestdagi sonlar." },
    audio: {
      ru: [
        'Запомни правило из трёх шагов. Шаг один. Находим общий знаменатель, наименьшее число, которое делится на оба знаменателя. Шаг два. Приводим обе дроби. На что умножаешь знаменатель, на то же умножай и числитель. Шаг три. Вычитаем только числители. Знаменатель остаётся прежним, его не вычитаем.',
        'А теперь интересный факт. Древние египтяне четыре тысячи лет назад записывали только дроби с числителем один. Дробь пять шестых они писали как сумму одной второй и одной третьей. Те же числа, что в нашем квесте.'
      ],
      uz: [
        "Uch qadamli qoidani eslab qoling. Birinchi qadam. Umumiy maxrajni topamiz, bu har ikkala maxrajga bo'linadigan eng kichik son. Ikkinchi qadam. Ikkala kasrni keltiramiz. Maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga ko'paytiring. Uchinchi qadam. Faqat suratlarni ayiramiz. Maxraj o'zgarmaydi, uni ayirmaymiz.",
        "Endi qiziqarli fakt. Qadimgi misrliklar to'rt ming yil oldin faqat surati bir bo'lgan kasrlarni yozishgan. Oltidan besh kasrini ular ikkidan bir va uchdan bir yig'indisi shaklida yozishgan. Xuddi kvestimizdagi sonlar."
      ]
    }
  },

  // s4 — TEST MC: 3/4 − 1/2 = 1/4. База (до shuffle): [1/4✓, 1, 2/4, 5/4]
  s4: {
    eyebrow: { ru: 'Уровень 3 · Испытание 1', uz: "3-daraja · Sinov 1" },
    label: { ru: 'Разминка', uz: "Mashq" },
    title: { ru: 'Три быстрых вычитания', uz: "Uchta tezkor ayirish" },
    questions: [
      {
        q: { ru: '1/2 − 1/4 = ?', uz: "1/2 − 1/4 = ?" },
        opts: [{ ru: '1/4', uz: '1/4' }, { ru: '1/6', uz: '1/6' }, { ru: '1/2', uz: '1/2' }, { ru: '2/4', uz: '2/4' }],
        correct: 0,
        hint: { ru: 'Приведи обе дроби к четвёртым, потом вычти числители.', uz: "Ikkala kasrni to'rtlarga keltiring, keyin suratlarni ayiring." },
        audio: { ru: 'Сколько будет одна вторая минус одна четвёртая?', uz: "Ikkidan bir minus to'rtdan bir nechaga teng?" }
      },
      {
        q: { ru: '3/4 − 1/2 = ?', uz: "3/4 − 1/2 = ?" },
        opts: [{ ru: '1/2', uz: '1/2' }, { ru: '1/6', uz: '1/6' }, { ru: '1/4', uz: '1/4' }, { ru: '2/4', uz: '2/4' }],
        correct: 2,
        hint: { ru: 'Одна вторая — это сколько четвёртых? Сначала общий знаменатель.', uz: "Ikkidan bir bu nechta to'rtdan? Avval umumiy maxraj." },
        audio: { ru: 'Сколько будет три четвёртых минус одна вторая?', uz: "To'rtdan uch minus ikkidan bir nechaga teng?" }
      },
      {
        q: { ru: '2/3 − 1/6 = ?', uz: "2/3 − 1/6 = ?" },
        opts: [{ ru: '1/3', uz: '1/3' }, { ru: '3/6', uz: '3/6' }, { ru: '1/6', uz: '1/6' }, { ru: '5/6', uz: '5/6' }],
        correct: 1,
        hint: { ru: 'Приведи к шестым: трети — это шестые. Потом вычти числители.', uz: "Oltilarga keltiring: uchdan — bu oltidan. Keyin suratlarni ayiring." },
        audio: { ru: 'Сколько будет две третьих минус одна шестая?', uz: "Uchdan ikki minus oltidan bir nechaga teng?" }
      }
    ],
    done_text: { ru: 'Все три — верно. Числители вычитаются только после общего знаменателя.', uz: "Uchalasi ham to'g'ri. Suratlar faqat umumiy maxrajdan keyin ayiriladi." },
    fact: { ru: 'Чёрточку дроби ввёл Фибоначчи около 1200 года.', uz: "Kasr chizig'ini Fibonachchi taxminan 1200-yilda kiritgan." },
    audio: {
      intro: { ru: 'Разминка. Три быстрых вычитания подряд. Сколько будет одна вторая минус одна четвёртая?', uz: "Mashq. Ketma-ket uchta tezkor ayirish. Ikkidan bir minus to'rtdan bir nechaga teng?" },
      next: { ru: 'Верно! Следующее.', uz: "To'g'ri! Keyingisi." },
      on_correct: { ru: 'Отлично, все три верно. Ты быстро приводишь дроби к общему знаменателю. Чёрточку дроби в Европе ввёл Фибоначчи около тысяча двухсотого года.', uz: "Ajoyib, uchalasi ham to'g'ri. Kasrlarni umumiy maxrajga tez keltiryapsiz. Kasr chizig'ini Yevropada Fibonachchi taxminan ming ikki yuzinchi yili kiritgan." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // s5 — TEST FracInput: 5/6 − 1/3 = 3/6 (принимается 3/6 и 1/2)
  s5: {
    eyebrow: { ru: 'Уровень 3 · Испытание 2', uz: "3-daraja · Sinov 2" },
    question: { ru: 'Исправь баг: сколько щита на самом деле осталось? 5/6 − 1/3 = ?', uz: "Xatoni tuzating: aslida qancha qalqon qoldi? 5/6 − 1/3 = ?" },
    placeholder: { ru: '0/0', uz: "0/0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Сначала приведи 1/3 к шестым (числитель тоже умножь!), потом вычти числители.', uz: "Avval 1/3 ni oltilarga keltiring (suratni ham ko'paytiring!), keyin suratlarni ayiring." },
    fb_correct: { ru: 'Верно. 1/3 = 2/6, поэтому 5/6 − 2/6 = 3/6 — половина щита. Баг исправлен.', uz: "To'g'ri. 1/3 = 2/6, shuning uchun 5/6 − 2/6 = 3/6 — qalqonning yarmi. Xato tuzatildi." },
    fb_wrong: { ru: 'Не то. Приведи 1/3 к шестым (числитель тоже умножь), потом вычти числители.', uz: "Bunday emas. 1/3 ni oltilarga keltiring (suratni ham ko'paytiring), keyin suratlarni ayiring." },
    audio: {
      intro: { ru: 'Почини игру сам. Вычисли, сколько щита на самом деле осталось. Пять шестых минус одна третья. Введи ответ дробью и нажми кнопку проверить.', uz: "O'yinni o'zingiz tuzating. Aslida qancha qalqon qolganini hisoblang. Oltidan besh minus uchdan bir. Javobni kasr shaklida kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Осталась половина щита, три шестых. Никакого роста после удара.', uz: "To'g'ri. Qalqonning yarmi qoldi, oltidan uch. Zarbadan keyin hech qanday o'sish yo'q." },
      on_wrong: { ru: 'Не совсем. Сначала приведи одну третью к шестым, потом вычитай числители.', uz: "Unchalik emas. Avval uchdan birni oltilarga keltiring, keyin suratlarni ayiring." }
    }
  },

  // s6 — EXPLORATION drag: ключи 1/2, 2/3, 3/4, 5/6 → замки 6/12, 8/12, 9/12, 10/12 (не scored)
  s6: {
    eyebrow: { ru: 'Уровень 4 · Ключи', uz: "4-daraja · Kalitlar" },
    title: { ru: 'Соедини ключ с равной дробью в двенадцатых.', uz: "Kalitni o'n ikkilardagi teng kasr bilan ulang." },
    ok_text: { ru: 'Замок открыт!', uz: "Qulf ochildi!" },
    wrong_text: { ru: 'Не подходит. Умножь и числитель на то же число.', uz: "Mos emas. Suratni ham o'sha songa ko'paytiring." },
    done_text: { ru: 'Все 4 замка открыты!', uz: "Barcha 4 qulf ochildi!" },
    btn: { ru: 'К тайной двери', uz: "Sirli eshik sari" },
    audio: { ru: 'Перед тобой четыре замка с дробями в двенадцатых и четыре ключа. Перетащи каждый ключ к замку с равной дробью. Помни. На что умножаешь знаменатель, на то же умножай числитель.', uz: "Oldingizda o'n ikkilardagi kasrlar yozilgan to'rtta qulf va to'rtta kalit bor. Har bir kalitni teng kasrli qulfga sudrang. Esda tuting. Maxrajni nechaga ko'paytirsangiz, suratni ham o'shanga ko'paytiring." }
  },

  // s7 — EXPLORATION slider: 5/6 и 3/4 → 12, а не 24
  s7: {
    eyebrow: { ru: 'Уровень 4 · Тайная дверь', uz: "4-daraja · Sirli eshik" },
    title: { ru: 'Найди общее число долей для 5/6 и 3/4. Нужно ли 24?', uz: "5/6 va 3/4 uchun umumiy ulushlar sonini toping. 24 kerakmi?" },
    label_slider: { ru: 'Клеток', uz: "Kataklar" },
    note_fit: { ru: 'Подходит! Делится и на 6, и на 4.', uz: "Mos keldi! Ham 6 ga, ham 4 ga bo'linadi." },
    note_nofit: { ru: 'Не подходит.', uz: "Mos emas." },
    note_24: { ru: '24 тоже подходит, но клеток вдвое больше — лишняя работа.', uz: "24 ham mos, lekin kataklar ikki barobar ko'p — ortiqcha ish." },
    conclusion: { ru: '12 — наименьшее общее число. 24 не нужно — лишняя работа.', uz: "12 — eng kichik umumiy son. 24 shart emas — ortiqcha ish." },
    btn: { ru: 'Открыть дверь', uz: "Eshikni ochish" },
    audio: { ru: 'Кажется, что для шести и четырёх нужно перемножить знаменатели и взять двадцать четыре. Подвигай ползунок и проверь числа поменьше. Двенадцать делится и на шесть, и на четыре. Это меньше, чем двадцать четыре, а работает так же. Пять шестых это десять двенадцатых, три четвёртых это девять двенадцатых.', uz: "Olti va to'rt uchun maxrajlarni ko'paytirib, yigirma to'rtni olish kerakdek tuyuladi. Slayderni surib, kichikroq sonlarni tekshiring. O'n ikki ham oltiga, ham to'rtga bo'linadi. Bu yigirma to'rtdan kichik, lekin xuddi shunday ishlaydi. Oltidan besh bu o'n ikkidan o'n, to'rtdan uch bu o'n ikkidan to'qqiz." }
  },

  // s8 — TEST MC сложный: 5/6 − 3/4 = 1/12. База: [1/12✓, 1, 2/12, 19/12]
  s8: {
    eyebrow: { ru: 'Уровень 4 · Испытание 3', uz: "4-daraja · Sinov 3" },
    label: { ru: 'Реши по шагам', uz: "Bosqichma-bosqich yeching" },
    question: { ru: '5/6 − 3/4 = ?', uz: "5/6 − 3/4 = ?" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    step_convert: { ru: 'Приведи дробь к двенадцатым', uz: "Kasrni o'n ikkilarga keltiring" },
    step_subtract: { ru: 'Теперь вычти числители', uz: "Endi suratlarni ayiring" },
    hint_convert: { ru: 'Числитель умножь на то же число, что и знаменатель.', uz: "Suratni ham maxraj ko'paytirilgan songa ko'paytiring." },
    hint_subtract: { ru: 'Знаменатель не меняется — вычти только числители.', uz: "Maxraj o'zgarmaydi — faqat suratlarni ayiring." },
    done_text: { ru: 'Все шаги верны: 5/6 = 10/12, 3/4 = 9/12, разность 1/12.', uz: "Hamma qadam to'g'ri: 5/6 = 10/12, 3/4 = 9/12, ayirma 1/12." },
    fact: { ru: 'Повара вычитают дроби с разными знаменателями каждый день — отмеряя соус.', uz: "Oshpazlar har kuni har xil maxrajli kasrlarni ayiradi — sous o'lchaganda." },
    audio: {
      intro: { ru: 'Решим по шагам. Сначала приведи пять шестых к двенадцатым. Сколько двенадцатых получится?', uz: "Bosqichma-bosqich yechamiz. Avval oltidan beshni o'n ikkilarga keltiring. Nechta o'n ikkidan bo'ladi?" },
      next: { ru: 'Верно! Следующий шаг.', uz: "To'g'ri! Keyingi qadam." },
      on_correct: { ru: 'Верно. Десять двенадцатых минус девять двенадцатых это одна двенадцатая. Кстати, повара так считают каждый день, отмеряя соус.', uz: "To'g'ri. O'n ikkidan o'n minus o'n ikkidan to'qqiz bu o'n ikkidan bir. Aytgancha, oshpazlar sous o'lchaganda har kuni shunday hisoblaydi." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: "Unchalik emas. Maslahatga qarang." }
    }
  },

  // s9 — TEST MC debug: найди баг в решении 2/3 − 1/2. Опции = 3 шага (без shuffle), правильный — шаг 2 (B)
  s9: {
    eyebrow: { ru: 'Уровень 5 · Охота на баг', uz: "5-daraja · Xato ovi" },
    label: { ru: 'Найди строку с ошибкой', uz: "Xatoli qatorni toping" },
    intro_text: { ru: 'Игрок решал 2/3 − 1/2 и у него ничего не вышло. Вот решение:', uz: "O'yinchi 2/3 − 1/2 ni yechdi va hech narsa chiqmadi. Mana yechim:" },
    step_1: { ru: 'Шаг 1. Общий знаменатель для 3 и 2 — это 6.', uz: "1-qadam. 3 va 2 uchun umumiy maxraj — 6." },
    step_2: { ru: 'Шаг 2. 2/3 = 2/6', uz: "2-qadam. 2/3 = 2/6" },
    step_3: { ru: 'Шаг 3. 1/2 = 3/6', uz: "3-qadam. 1/2 = 3/6" },
    result_line: { ru: 'Итог: 2/6 − 3/6 = … не получается!', uz: "Natija: 2/6 − 3/6 = … chiqmayapti!" },
    question: { ru: 'В каком шаге баг?', uz: "Xato qaysi qadamda?" },
    opt_1: { ru: 'Шаг 1', uz: "1-qadam" },
    opt_2: { ru: 'Шаг 2', uz: "2-qadam" },
    opt_3: { ru: 'Шаг 3', uz: "3-qadam" },
    correct_text: { ru: 'Точно. Знаменатель умножили на 2, а числитель забыли: 2/3 = 4/6, а не 2/6. Тогда 4/6 − 3/6 = 1/6 — всё сходится.', uz: "Aniq. Maxraj 2 ga ko'paytirildi, surat esa unutildi: 2/3 = 4/6, 2/6 emas. U holda 4/6 − 3/6 = 1/6 — hammasi to'g'ri chiqadi." },
    wrong_0: { ru: 'Этот шаг верный. Баг ниже.', uz: "Bu qadam to'g'ri. Xato pastroqda." },
    wrong_2: { ru: 'Этот шаг верный. Баг выше.', uz: "Bu qadam to'g'ri. Xato yuqoriroqda." },
    wrong_default: { ru: 'Проверь шаг 2: умножили ли числитель на то же число, что и знаменатель?', uz: "2-qadamni tekshiring: surat ham maxraj ko'paytirilgan songa ko'paytirildimi?" },
    audio: {
      intro: { ru: 'Игрок решал пример две третьих минус одна вторая, и у него ничего не вышло. В решении три шага, в одном спрятан баг. Найди строку с ошибкой.', uz: "O'yinchi uchdan ikki minus ikkidan bir misolini yechdi va hech narsa chiqmadi. Yechimda uch qadam bor, bittasida xato yashiringan. Xatoli qatorni toping." },
      on_correct: { ru: 'Баг найден. Две третьих это четыре шестых. Тогда четыре шестых минус три шестых равно одна шестая.', uz: "Xato topildi. Uchdan ikki bu oltidan to'rt. U holda oltidan to'rt minus oltidan uch teng oltidan bir." },
      on_wrong: { ru: 'Эта строка верная. Баг в другом месте.', uz: "Bu qator to'g'ri. Xato boshqa joyda." }
    }
  },

  // s10 — CASE setup: босс, 7/8 − 1/4 − 1/2, нужно ≥ 1/8 + fact-карта №2 (HP-бары/CSS)
  s10: {
    eyebrow: { ru: 'Босс · Ворота дракона', uz: "Boss · Ajdaho darvozasi" },
    title: { ru: 'Финальный бой', uz: "Yakuniy jang" },
    body_p1: { ru: 'У героя 7/8 энергии. Щит — 1/4, ворота — 1/2. Пройти можно, если останется не меньше 1/8.', uz: "Qahramonda 7/8 energiya. Qalqon — 1/4, darvoza — 1/2. Kamida 1/8 qolsa, o'tib bo'ladi." },
    card_line_label: { ru: 'Щит', uz: "Qalqon" },
    card_line_value: { ru: '1/4 энергии', uz: "1/4 energiya" },
    card_parts_label: { ru: 'Ворота', uz: "Darvoza" },
    card_parts_value: { ru: '1/2 энергии', uz: "1/2 energiya" },
    card_req_label: { ru: 'Проход', uz: "O'tish" },
    card_req_value: { ru: 'нужно не меньше 1/8', uz: "kamida 1/8 kerak" },
    outro: { ru: 'Знаменатели разные. Приведи всё к восьмым.', uz: "Maxrajlar har xil. Hammasini sakkizlarga keltiring." },
    fact_label: { ru: 'Интересный факт', uz: "Qiziqarli fakt" },
    fact_text: { ru: 'Полоска здоровья в играх — это дробь: 60 HP из 80 — это 6/8.', uz: "O'yinlardagi salomatlik chizig'i — bu kasr: 80 dan 60 HP — bu 6/8." },
    btn_help: { ru: 'Начать бой', uz: "Jangni boshlash" },
    audio: {
      ru: [
        'Финальный бой. У героя семь восьмых энергии. Заклинание щита стоит одну четвёртую, открыть ворота стоит одну вторую. Чтобы пройти, в конце должно остаться не меньше одной восьмой. Знаменатели разные. Восемь, четыре и два. Сначала приведём всё к восьмым.',
        'Кстати, полоска здоровья в любой игре это дробь. Шестьдесят очков из восьмидесяти это шесть восьмых. И веб-разработчики делят экран дробями. Одна колонка из трёх равных это одна третья страницы.'
      ],
      uz: [
        "Yakuniy jang. Qahramonda sakkizdan yetti energiya bor. Qalqon afsuni to'rtdan bir turadi, darvozani ochish ikkidan bir turadi. O'tish uchun oxirida kamida sakkizdan bir qolishi kerak. Maxrajlar har xil. Sakkiz, to'rt va ikki. Avval hammasini sakkizlarga keltiramiz.",
        "Aytgancha, har qanday o'yindagi salomatlik chizig'i bu kasr. Saksondan oltmish ochko bu sakkizdan olti. Veb-dasturchilar ham ekranni kasrlar bilan bo'lishadi. Uchta teng ustundan bittasi bu sahifaning uchdan biri."
      ]
    }
  },

  // s11 — CASE MC: 1/4 и 1/2 в восьмых. База: [2/8 и 4/8 ✓, 1/8 и 1/8, 2/8 и 1/8, 4/8 и 2/8]
  s11: {
    eyebrow: { ru: 'Босс · 1-й шаг', uz: "Boss · 1-qadam" },
    label: { ru: 'Приведи к восьмым', uz: "Sakkizlarga keltiring" },
    question: { ru: 'Щит 1/4 и ворота 1/2 — сколько это в восьмых?', uz: "Qalqon 1/4 va darvoza 1/2 — bu sakkizlarda qancha?" },
    correct_text: { ru: 'Правильно. 1/4 = 2/8 (умножили на 2), 1/2 = 4/8 (умножили на 4) — и числитель, и знаменатель.', uz: "To'g'ri. 1/4 = 2/8 (2 ga ko'paytirdik), 1/2 = 4/8 (4 ga ko'paytirdik) — suratni ham, maxrajni ham." },
    wrong_1: { ru: 'Знаменатель заменил, а числитель — нет. Умножай и числитель на то же число.', uz: "Maxrajni almashtirdingiz, suratni esa yo'q. Suratni ham o'sha songa ko'paytiring." },
    wrong_2: { ru: 'Половину переведи внимательно: умножай и числитель тоже.', uz: "Yarmini diqqat bilan keltiring: suratni ham ko'paytiring." },
    wrong_3: { ru: 'Числа верные, но перепутаны местами. Четверть меньше половины.', uz: "Sonlar to'g'ri, lekin o'rinlari almashgan. Chorak yarimdan kichik." },
    wrong_default: { ru: 'Умножай и числитель, и знаменатель на одно и то же число.', uz: "Suratni ham, maxrajni ham bitta songa ko'paytiring." },
    fact: { ru: 'Полоса загрузки в телефоне тоже приводит дроби к общему знаменателю.', uz: "Telefondagi yuklash chizig'i ham kasrlarni umumiy maxrajga keltiradi." },
    audio: {
      intro: { ru: 'Приведи цены к восьмым. Одна четвёртая и одна вторая. Сколько это в восьмых? Выбери пару.', uz: "Narxlarni sakkizlarga keltiring. To'rtdan bir va ikkidan bir. Bu sakkizlarda qancha? Juftlikni tanlang." },
      on_correct: { ru: 'Верно. Щит две восьмых, ворота четыре восьмых. Кстати, полоса загрузки в телефоне делает то же самое. Чтобы показать остаток одной полосой, программа приводит дроби к общему знаменателю.', uz: "To'g'ri. Qalqon sakkizdan ikki, darvoza sakkizdan to'rt. Aytgancha, telefondagi yuklash chizig'i ham xuddi shunday qiladi. Qoldiqni bitta chiziqda ko'rsatish uchun dastur kasrlarni umumiy maxrajga keltiradi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: "Unchalik emas. Tushuntirishga qarang." }
    }
  },

  // s12 — CASE FracInput: 7/8 − 2/8 − 4/8 = 1/8
  s12: {
    eyebrow: { ru: 'Босс · 2-й шаг', uz: "Boss · 2-qadam" },
    lock_label: { ru: 'Босс', uz: "Boss" },
    question: { ru: 'Вычти все траты: 7/8 − 2/8 − 4/8 = ?', uz: "Barcha sarflarni ayiring: 7/8 − 2/8 − 4/8 = ?" },
    placeholder: { ru: '0/0', uz: "0/0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Знаменатель уже общий — вычитай только числители.', uz: "Maxraj allaqachon umumiy — faqat suratlarni ayiring." },
    fb_correct: { ru: 'Верно. 7 − 2 − 4 = 1. Остаётся 1/8 энергии.', uz: "To'g'ri. 7 − 2 − 4 = 1. 1/8 energiya qoladi." },
    fb_wrong: { ru: 'Знаменатель не вычитается, он остаётся. Вычитай только числители.', uz: "Maxraj ayirilmaydi, u o'zgarmaydi. Faqat suratlarni ayiring." },
    audio: {
      intro: { ru: 'Теперь вычти из семи восьмых сначала две восьмых, потом четыре восьмых. Введи, сколько энергии останется, и нажми проверить.', uz: "Endi sakkizdan yettidan avval sakkizdan ikkini, keyin sakkizdan to'rtni ayiring. Qancha energiya qolishini kiriting va tekshirishni bosing." },
      on_correct: { ru: 'Верно. Остаётся одна восьмая.', uz: "To'g'ri. Sakkizdan bir qoladi." },
      on_wrong: { ru: 'Не совсем. Знаменатель не вычитается. Вычти числители. Семь минус два минус четыре.', uz: "Unchalik emas. Maxraj ayirilmaydi. Suratlarni ayiring. Yetti minus ikki minus to'rt." }
    }
  },

  // s13 — CASE conclusion MC: 1/8 ≥ 1/8 → проходит. База: [ровно хватает ✓, не хватит, останется больше]
  s13: {
    eyebrow: { ru: 'Босс · Развязка', uz: "Boss · Yakun" },
    label: { ru: 'Хватит ли энергии?', uz: "Energiya yetadimi?" },
    question: { ru: 'Осталось 1/8. Для прохода нужно не меньше 1/8. Герой пройдёт?', uz: "1/8 qoldi. O'tish uchun kamida 1/8 kerak. Qahramon o'tadimi?" },
    opt0: { ru: 'Да — ровно столько, сколько нужно', uz: "Ha — roppa rosa kerakligicha" },
    opt1: { ru: 'Нет, не хватит', uz: "Yo'q, yetmaydi" },
    opt2: { ru: 'Останется даже больше', uz: "Hatto ko'proq qoladi" },
    correct_text: { ru: 'Точно. 1/8 равно 1/8 — ровно на пределе, но хватает. Ворота открыты, босс повержен.', uz: "Aniq. 1/8 1/8 ga teng — roppa rosa chegarada, lekin yetadi. Darvoza ochiq, boss yengildi." },
    wrong_1: { ru: 'Сравни: 1/8 и 1/8 равны — это не «меньше».', uz: "Solishtiring: 1/8 va 1/8 teng — bu «kam» emas." },
    wrong_2: { ru: 'Посчитай ещё раз, сколько осталось, и сравни с 1/8.', uz: "Qancha qolganini qayta hisoblang va 1/8 bilan solishtiring." },
    wrong_default: { ru: 'Сравни оставшееся с 1/8.', uz: "Qolganni 1/8 bilan solishtiring." },
    audio: {
      intro: { ru: 'Осталась одна восьмая, нужно не меньше одной восьмой. Пройдёт ли герой? Выбери ответ.', uz: "Sakkizdan bir qoldi, kamida sakkizdan bir kerak. Qahramon o'tadimi? Javobni tanlang." },
      on_correct: { ru: 'Победа. Ровно одна восьмая, этого достаточно. Ворота открыты.', uz: "G'alaba. Roppa rosa sakkizdan bir, bu yetarli. Darvoza ochildi." },
      on_wrong: { ru: 'Сравни. Одна восьмая равна одной восьмой, значит хватает.', uz: "Solishtiring. Sakkizdan bir sakkizdan birga teng, demak yetadi." }
    }
  },

  // s14 — FINAL MC: 3/4 − 1/3 = 5/12. База: [5/12✓, 2, 2/12, 13/12]
  s14: {
    eyebrow: { ru: 'Финальное испытание · 1', uz: "Yakuniy sinov · 1" },
    label: { ru: 'Собери ответ', uz: "Javobni yig'ing" },
    question: { ru: '3/4 − 1/3 = ?', uz: "3/4 − 1/3 = ?" },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    hint: { ru: 'Найди общий знаменатель, приведи обе дроби и вычти числители.', uz: "Umumiy maxrajni toping, ikkala kasrni keltiring va suratlarni ayiring." },
    hint_empty: { ru: 'Сначала выбери числитель и знаменатель.', uz: "Avval surat va maxrajni tanlang." },
    correct_text: { ru: 'Правильно. Общий знаменатель 12: 3/4 = 9/12, 1/3 = 4/12. Вычли: 9 − 4 = 5. Ответ 5/12.', uz: "To'g'ri. Umumiy maxraj 12: 3/4 = 9/12, 1/3 = 4/12. Ayirdik: 9 − 4 = 5. Javob 5/12." },
    audio: {
      intro: { ru: 'Финальное испытание. Собери ответ для три четвёртых минус одна третья. Сначала числитель, потом знаменатель.', uz: "Yakuniy sinov. To'rtdan uch minus uchdan bir uchun javobni yig'ing. Avval surat, keyin maxraj." },
      on_correct: { ru: 'Верно. Девять двенадцатых минус четыре двенадцатых это пять двенадцатых.', uz: "To'g'ri. O'n ikkidan to'qqiz minus o'n ikkidan to'rt bu o'n ikkidan besh." },
      on_wrong: { ru: 'Не совсем. Найди общий знаменатель и вычти числители.', uz: "Unchalik emas. Umumiy maxrajni toping va suratlarni ayiring." }
    }
  },

  // s15 — FINAL FracInput сложный: 3/8 − 1/6 = 5/24 (принимается 5/24 и 10/48)
  s15: {
    eyebrow: { ru: 'Финальное испытание · 2', uz: "Yakuniy sinov · 2" },
    lock_label: { ru: 'Замок', uz: "Qulf" },
    question: { ru: 'Последний замок: 3/8 − 1/6 = ?', uz: "Oxirgi qulf: 3/8 − 1/6 = ?" },
    placeholder: { ru: '0/0', uz: "0/0" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Перемножать 8 и 6 не обязательно. Поищи число поменьше, которое делится на оба.', uz: "8 va 6 ni ko'paytirish shart emas. Ikkalasiga bo'linadigan kichikroq sonni qidiring." },
    fb_correct: { ru: 'Верно. 3/8 = 9/24, 1/6 = 4/24, разность 5/24. Квест пройден!', uz: "To'g'ri. 3/8 = 9/24, 1/6 = 4/24, ayirma 5/24. Kvest o'tildi!" },
    fb_wrong: { ru: 'Сначала общий знаменатель, потом вычти числители.', uz: "Avval umumiy maxraj, keyin suratlarni ayiring." },
    audio: {
      intro: { ru: 'Последний замок квеста. Три восьмых минус одна шестая. Введи ответ дробью и нажми проверить.', uz: "Kvestning oxirgi qulfi. Sakkizdan uch minus oltidan bir. Javobni kasr shaklida kiriting va tekshirishni bosing." },
      on_correct: { ru: 'Верно. Пять двадцать четвёртых. Замок щёлкнул и открылся.', uz: "To'g'ri. Yigirma to'rtdan besh. Qulf shiqillab ochildi." },
      on_wrong: { ru: 'Не совсем. Найди общий знаменатель для восьми и шести. Подойдёт двадцать четыре.', uz: "Unchalik emas. Sakkiz va olti uchun umumiy maxrajni toping. Yigirma to'rt mos keladi." }
    }
  },

  // s16 — SUMMARY + fact-карта №3 (музыка) + связи
  s16: {
    eyebrow: { ru: 'Квест пройден', uz: "Kvest o'tildi" },
    label: { ru: 'Итоги', uz: "Yakun" },
    score_label: { ru: 'ответов с первой попытки верны', uz: "savol birinchi urinishda to'g'ri" },
    title: { ru: 'Теперь ты вычитаешь дроби с любыми знаменателями.', uz: "Endi siz istalgan maxrajli kasrlarni ayirasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'Разные знаменатели нельзя вычитать напрямую.', uz: "Har xil maxrajlarni to'g'ridan to'g'ri ayirib bo'lmaydi." },
    main_2: { ru: 'Сначала общий знаменатель — наименьший общий.', uz: "Avval umumiy maxraj — eng kichik umumiysi." },
    main_3: { ru: 'Приводим обе дроби: числитель — на то же число.', uz: "Ikkala kasrni keltiramiz: suratni ham o'sha songa." },
    main_4: { ru: 'Вычитаем только числители.', uz: "Faqat suratlarni ayiramiz." },
    back_to_hook: { ru: 'Вернёмся к твоему ответу: щит не вырос — это был баг. На самом деле 5/6 − 1/3 = 1/2.', uz: "Javobingizga qaytamiz: qalqon kattalashmadi — bu xato edi. Aslida 5/6 − 1/3 = 1/2." },
    fact_label: { ru: 'Интересный факт', uz: "Qiziqarli fakt" },
    fact_text: { ru: 'Ноты в музыке — это дроби: целая, половинная (1/2), четвертная (1/4), восьмая (1/8). Барабанщик, выстукивая ритм, складывает и вычитает дроби в уме.', uz: "Musiqadagi notalar — bu kasrlar: butun, yarim (1/2), chorak (1/4), sakkizdan bir (1/8). Barabanchi ritm chalayotganda xayolan kasrlarni qo'shadi va ayiradi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с разными знаменателями» (общий знаменатель) и «Вычитание дробей с равными знаменателями» (вычитаем числители).', uz: "«Har xil maxrajli kasrlarni qo'shish» (umumiy maxraj) va «Teng maxrajli kasrlarni ayirish» (suratlarni ayiramiz)." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'правильные и неправильные дроби, смешанные числа — что будет, если числитель больше знаменателя.', uz: "to'g'ri va noto'g'ri kasrlar, aralash sonlar — surat maxrajdan katta bo'lsa nima bo'ladi." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: {
      ru: [
        'Квест пройден. Теперь ты вычитаешь дроби с любыми знаменателями. Напрямую вычитать нельзя, куски разного размера. Сначала находим общий знаменатель, наименьшее число, которое делится на оба. Приводим обе дроби, числитель умножаем на то же число, что и знаменатель. Потом вычитаем только числители, знаменатель не трогаем. Баг из начала больше не обманет. Пять шестых минус одна третья это три шестых, половина щита.',
        'И напоследок. Ноты в музыке это дроби. Целая, половинная, четвертная, восьмая. Барабанщик, выстукивая ритм, складывает и вычитает дроби в уме. Дальше узнаем, что будет, если числитель больше знаменателя.'
      ],
      uz: [
        "Kvest o'tildi. Endi siz istalgan maxrajli kasrlarni ayirasiz. To'g'ridan to'g'ri ayirib bo'lmaydi, bo'laklar har xil o'lchamda. Avval umumiy maxrajni topamiz, bu har ikkalasiga bo'linadigan eng kichik son. Ikkala kasrni keltiramiz, suratni ham maxraj ko'paytirilgan songa ko'paytiramiz. Keyin faqat suratlarni ayiramiz, maxrajga tegmaymiz. Boshidagi xato endi alday olmaydi. Oltidan besh minus uchdan bir bu oltidan uch, qalqonning yarmi.",
        "Va nihoyat. Musiqadagi notalar bu kasrlar. Butun, yarim, chorak, sakkizdan bir. Barabanchi ritm chalayotganda xayolan kasrlarni qo'shadi va ayiradi. Keyin surat maxrajdan katta bo'lsa nima bo'lishini bilib olamiz."
      ]
    }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_12: квест — щит/HP-бар (WallBar), замки и ключи (drag),
// строка вычитания (FracRow), fact-карты. accent — уменьшаемое, blue — вычитаемое.
// ============================================================

// Подпись-формула из дробей: a/d − b/d (− c/d) (= res/d). Оп — минус.
const FracRow = ({ parts, op = '−', sumN, sumD, sumColor = T.success }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
    {parts.map((p, j) => (
      <React.Fragment key={j}>
        {j > 0 && <Op>{op}</Op>}
        <Frac n={String(p.n)} d={String(p.d)} size="mid" color={p.c}/>
      </React.Fragment>
    ))}
    {sumN != null && <><Op>=</Op><Frac n={String(sumN)} d={String(sumD)} size="mid" color={sumColor}/></>}
  </div>
);

// Эквивалентность: a/b × k/k = (a*k)/(b*k) — строка приведения.
const EquivRow = ({ a, b, k, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', justifyContent: 'center', flexWrap: 'wrap' }}>
    <Frac n={String(a)} d={String(b)} size="mid" color={color}/>
    <span className="mop" style={{ color: T.ink3 }}>×</span>
    <Frac n={String(k)} d={String(k)} size="sm" color={T.ink3}/>
    <Op>=</Op>
    <Frac n={String(a * k)} d={String(b * k)} size="mid" color={color}/>
  </div>
);

// Горизонтальная полоса-«щит»: cols равных столбцов. accentW/blueW — доли (0..1) закрашенной
// длины (blue после accent). Разделители за пределами baseCols ВЪЕЗЖАЮТ (sweep) — «приведение
// на месте»: закрашенная длина не меняется, дробится мельче. markers — фиксированные метки.
const WallBar = ({ cols, accentW = 0, blueW = 0, baseCols, animateDividers = false, growFill = false, markers = [], aColor = T.accent, lineColor = T.bg, h = 86, maxW = 460 }) => {
  const base = baseCols || cols;
  const lines = [];
  for (let i = 1; i < cols; i++) {
    const isBase = Number.isInteger((i / cols) * base);
    lines.push({ pos: (i / cols) * 100, anim: animateDividers && !isBase, idx: i });
  }
  return (
    <div className="wb-wrap" style={{ position: 'relative', width: '100%', maxWidth: maxW, height: h, margin: '0 auto', borderRadius: 12, overflow: 'hidden', background: T.paper, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}>
      {accentW > 0 && <div className={growFill ? 'wb-fill wb-grow' : 'wb-fill'} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${accentW * 100}%`, background: aColor }}><span className="ag-shine"/></div>}
      {blueW > 0 && <div className={growFill ? 'wb-fill wb-grow' : 'wb-fill'} style={{ position: 'absolute', left: `${accentW * 100}%`, top: 0, bottom: 0, width: `${blueW * 100}%`, background: T.blue }}><span className="ag-shine"/></div>}
      {lines.map((l, k) => (
        <div key={k} className={l.anim ? 'wb-line wb-line-anim' : 'wb-line'} style={{ position: 'absolute', left: `${l.pos}%`, top: 0, bottom: 0, width: 2, background: lineColor, animationDelay: l.anim ? `${0.5 + k * 0.12}s` : undefined }}/>
      ))}
      {markers.map((m, k) => (
        <div key={'m' + k} className={m.align ? 'wb-mark wb-mark-on' : 'wb-mark'} style={{ position: 'absolute', left: `${m.pos}%`, background: m.align ? T.success : T.ink3 }}/>
      ))}
    </div>
  );
};

// Компактные мини-бары для шапки test-экрана: иллюстрируют дроби из вопроса
// (закрашенная доля + лёгкая сетка). bare — без рамки (для FracInputScreen, у него своя).
const QBars = ({ items, bare = false }) => {
  const inner = items.map((it, k) => (
    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Frac n={it.n} d={it.d} size="sm" color={it.color}/>
      <div style={{ flex: 1 }}><WallBar cols={it.cols} accentW={it.w} aColor={it.color} lineColor={'rgba(167, 166, 162, 0.45)'} h={38} maxW={9999}/></div>
    </div>
  ));
  if (bare) return <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>{inner}</div>;
  return <div className="frame" style={{ marginTop: 14, padding: 'clamp(12px, 2vw, 16px)', display: 'flex', flexDirection: 'column', gap: 10 }}>{inner}</div>;
};

// MATH: квест-замок — «заперт» (accent) → «открыт» (success + галочка) при solved.
// Декоративная тема (мост/дверь/босс), не показывает ответ. (frac_5_12 s12/s15)
const QuestLock = ({ open, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div className={open ? 'qlock qlock-open' : 'qlock'} aria-hidden="true">
      <span className="qlock-shackle"/>
      <span className="qlock-body">{open
        ? <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>✓</span>
        : <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'block' }}/>}</span>
    </div>
    {label && <span className="small" style={{ color: open ? T.success : T.ink3, fontWeight: 600 }}>{label}</span>}
  </div>
);

// ============================================================
// FACTCARD — fakt to'g'ri javobdan keyin (FB_* badge + Anim*). Namuna: Dars06.
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',       uz: "Bilasizmi? · IT" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука',    uz: "Bilasizmi? · Fan" };
const FB_HIST = { ru: 'Знаешь ли ты? · История',  uz: "Bilasizmi? · Tarix" };

// MUKOFOT — to'g'ri javobdan keyin yuqoriga ko'tarilib so'nadigan mayda bo'laklar (mavzuga oid bayram).
const RewardBurst = () => (
  <div className="rw-burst" aria-hidden="true">
    {Array.from({ length: 7 }).map((_, i) => (
      <span key={i} className="rw-bit" style={{ left: `${10 + i * 13}%`, background: i % 2 ? '#1F7A4D' : '#FF4F28', animationDelay: `${i * 0.05}s` }}/>
    ))}
  </div>
);

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
// Tarix (umumiy maxraj): ikki har xil bo'lak bir umumiy o'lchovga keltiriladi — yonma-yon ustunlar tenglashadi.
const AnimDenom = () => (
  <div className="fc17-denom" aria-hidden="true">
    <span className="fc17-denom-c fc17-denom-1"/>
    <span className="fc17-denom-c fc17-denom-2"/>
    <span className="fc17-denom-c fc17-denom-3"/>
  </div>
);
// Fan (retsept ayirmasi): stakan yuqori belgidan pastki belgigacha ayrilib tushadi.
const AnimCup = () => (
  <div className="fc17-cup" aria-hidden="true">
    <span className="fc17-cup-fill"/>
    <span className="fc17-cup-mark fc17-cup-mark-hi"/>
    <span className="fc17-cup-mark fc17-cup-mark-lo"/>
  </div>
);
// IT (progress ayirmasi): chiziq to'lib, keyin bir bo'lakka kamayadi.
const AnimBar = () => (
  <div className="fc17-bar" aria-hidden="true">
    <span className="fc17-bar-fill"/>
  </div>
);

// Аудио-массив БЕЗ step-пауз: сегменты идут подряд (rule/case-setup/summary с fact-картой).
const seqSegments = (c, lang, sid) => {
  const arr = c.audio[lang];
  if (Array.isArray(arr)) return arr.map((text, i) => ({ id: `${sid}_a${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null }));
  return makeAudioSegments(c, lang);
};

// ============================================================
// FRAC INPUT SCREEN — ввод дроби «a/b» (лесcон-локальный, по образцу NumInputScreen из
// infrastructure_v1): веди-до-верного, наводящая подсказка (после 2-й ошибки — разбор),
// счёт первой попытки. accepted — список верных записей ('3/6', '1/2').
// ============================================================
const FracInputScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, accepted, primary, renderVisual, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = screenContent;
  const sfx = useSfx();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const normFrac = (s) => {
    const m = String(s).trim().match(/^(\d+)\s*\/\s*(\d+)$/);
    return m ? `${parseInt(m[1], 10)}/${parseInt(m[2], 10)}` : null;
  };
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  // Мобильно-дружелюбный ввод: два числовых поля (числитель / знаменатель) вместо одного
  // текстового «a/b» — «/» не печатается (статичный разделитель), всплывает цифровая клавиатура.
  const initParts = String(wasSolved ? primary : (storedAnswer?.studentAnswer ?? '')).match(/^(\d+)\s*\/\s*(\d+)$/);
  const [num, setNum] = useState(initParts ? initParts[1] : '');
  const [den, setDen] = useState(initParts ? initParts[2] : '');
  const value = (num || den) ? `${num}/${den}` : '';
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  // Qaysi maydon (surat/maxraj) noto'g'ri — primary ('a/b') bilan solishtiramiz (#4).
  const [badField, setBadField] = useState(null);
  const _pm = String(primary).match(/^(\d+)\/(\d+)$/); const pNum = _pm ? _pm[1] : ''; const pDen = _pm ? _pm[2] : '';
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const submit = () => {
    if (solved) return;
    const v = normFrac(value); if (!v) { setHintShown(true); return; }
    const isCorrect = accepted.indexOf(v) !== -1;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(value).trim(); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof c.question === 'object' ? (c.question[lang] || c.question.ru) : null, correctAnswer: primary, studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setHintShown(true); sfx.playWrong(); setBadField((num !== pNum && den !== pDen) ? 'both' : (num !== pNum ? 'num' : (den !== pDen ? 'den' : null))); }
    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c.audio_hint && c.audio_hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
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
        {renderVisual && <div className="frame fade-up delay-1" style={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderVisual({ value, solved })}</div>}
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
          <input type="text" inputMode="numeric" pattern="[0-9]*" aria-label={lang === 'uz' ? 'surat' : 'числитель'} className={`answer-input ${solved ? 'correct' : ''}`} value={num} placeholder="0" disabled={solved}
            onChange={e => { if (!solved) { setNum(e.target.value.replace(/\D/g, '').slice(0, 3)); setHintShown(false); setBadField(null); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(58px, 15vw, 84px)', textAlign: 'center', boxShadow: (badField === 'num' || badField === 'both') ? '0 0 0 2px #FF4F28' : undefined }}/>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5vw, 32px)', color: T.ink2, lineHeight: 1 }}>/</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" aria-label={lang === 'uz' ? 'maxraj' : 'знаменатель'} className={`answer-input ${solved ? 'correct' : ''}`} value={den} placeholder="0" disabled={solved}
            onChange={e => { if (!solved) { setDen(e.target.value.replace(/\D/g, '').slice(0, 3)); setHintShown(false); setBadField(null); } }}
            onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(58px, 15vw, 84px)', textAlign: 'center', boxShadow: (badField === 'den' || badField === 'both') ? '0 0 0 2px #FF4F28' : undefined }}/>
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
            {badField && <p className="small" style={{ margin: '0 0 6px', fontWeight: 600, color: T.accent }}>{lang === 'uz' ? (badField === 'num' ? "Surat noto'g'ri" : badField === 'den' ? "Maxraj noto'g'ri" : "Surat ham, maxraj ham noto'g'ri") : (badField === 'num' ? 'Числитель неверный' : badField === 'den' ? 'Знаменатель неверный' : 'И числитель, и знаменатель неверны')}</p>}
            <p className="body" style={{ margin: 0 }}>{mt(t(attemptsRef.current >= 2 ? (c.fb_wrong || c.hint) : c.hint))}</p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.fb_correct))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ
// ============================================================

// DRAG-BUILD SCREEN — javobni o'zi yig'adi: surat/maxraj kataklarini raqam-chiplardan to'ldiradi.
// Tap-to-assign (mobil uchun drag'dan ishonchliroq, PROMPT_YANGI_DARS). veди-до-верного, firstTry ball.
const DragBuildScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, numAns, denAns, chips, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [num, setNum] = useState(wasSolved ? String(numAns) : (storedAnswer?.num ?? null));
  const [den, setDen] = useState(wasSolved ? String(denAns) : (storedAnswer?.den ?? null));
  const [active, setActive] = useState('num');
  const [solved, setSolved] = useState(wasSolved);
  const [bad, setBad] = useState({ num: false, den: false });
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const placeChip = (v) => {
    if (solved) return;
    setHintShown(false); setBad({ num: false, den: false });
    if (active === 'num') { setNum(String(v)); setActive('den'); }
    else { setDen(String(v)); setActive('num'); }
  };
  const reset = () => { if (solved) return; setNum(null); setDen(null); setActive('num'); setHintShown(false); setBad({ num: false, den: false }); };
  const submit = () => {
    if (solved) return;
    if (num === null || den === null) { setHintShown(true); return; }
    const nOk = parseInt(num, 10) === numAns, dOk = parseInt(den, 10) === denAns;
    const allOk = nOk && dOk;
    if (firstTryRef.current === null) firstTryRef.current = allOk;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (allOk) {
      setSolved(true); setHintShown(false); setBad({ num: false, den: false }); sfx.playCorrect();
      onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, correctAnswer: `${numAns}/${denAns}`, studentAnswer: `${num}/${den}`, num, den, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { setBad({ num: !nOk, den: !dOk }); setHintShown(true); sfx.playWrong(); }
    if (!audio.muted) { setTimeout(() => { const en = getAudioEngine(); if (en && !audio.muted) en.pushOneOff(allOk ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300); }
  };
  const slot = (which, value) => (
    <button onClick={() => !solved && setActive(which)} disabled={solved} aria-label={which === 'num' ? (lang === 'uz' ? 'surat' : 'числитель') : (lang === 'uz' ? 'maxraj' : 'знаменатель')}
      style={{ width: 'clamp(54px, 13vw, 66px)', height: 'clamp(48px, 11vw, 58px)', borderRadius: 12, border: `2px ${value === null ? 'dashed' : 'solid'} ${bad[which] ? '#FF4F28' : (active === which && !solved ? T.accent : 'rgba(167, 166, 162, 0.6)')}`, background: value === null ? 'transparent' : 'rgba(31, 122, 77, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 700, color: value === null ? T.ink3 : (solved ? T.success : T.ink), cursor: solved ? 'default' : 'pointer', transition: 'border-color 0.2s ease' }}>
      {value === null ? '?' : value}
    </button>
  );
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.8vw, 13px)', justifyContent: 'flex-start' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(9px, 1.8vw, 13px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {slot('num', num)}
            <span style={{ width: 'clamp(60px, 15vw, 74px)', height: 3, background: T.ink2, borderRadius: 2 }}/>
            {slot('den', den)}
          </div>
          {!solved && <p className="small" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? (active === 'num' ? "Suratni tanlang" : "Maxrajni tanlang") : (active === 'num' ? 'Выбери числитель' : 'Выбери знаменатель')}</p>}
          {!solved && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(8px, 1.8vw, 12px)' }}>
              {chips.map((v, i) => (
                <button key={i} onClick={() => placeChip(v)} style={{ minWidth: 'clamp(44px, 11vw, 54px)', height: 'clamp(44px, 11vw, 54px)', borderRadius: 11, border: 'none', background: '#FFFFFF', boxShadow: '0 3px 9px -3px rgba(58, 53, 48, 0.28)', fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(17px, 4vw, 21px)', fontWeight: 700, color: T.ink, cursor: 'pointer' }}>{v}</button>
              ))}
            </div>
          )}
          {!solved && (num !== null || den !== null) && (
            <button onClick={reset} className="small" style={{ background: 'none', border: 'none', color: T.ink3, textDecoration: 'underline', cursor: 'pointer', padding: 4 }}>{lang === 'uz' ? 'Tozalash' : 'Сбросить'}</button>
          )}
        </div>
        {!solved && <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {hintShown && !solved && (
          <div className="frame-tip fade-up">
            {(bad.num || bad.den) && <p className="small" style={{ margin: '0 0 6px', fontWeight: 600, color: T.accent }}>{lang === 'uz' ? ((bad.num && bad.den) ? "Surat ham, maxraj ham noto'g'ri" : bad.num ? "Surat noto'g'ri" : "Maxraj noto'g'ri") : ((bad.num && bad.den) ? 'И числитель, и знаменатель неверны' : bad.num ? 'Числитель неверный' : 'Знаменатель неверный')}</p>}
            <p className="body" style={{ margin: 0, display: 'flex', gap: 8 }}><span style={{ color: '#D8A93A', flexShrink: 0 }} aria-hidden="true">✗</span><span>{mt(t((num === null || den === null) ? c.hint_empty : c.hint))}</span></p>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// WARMUP SCREEN — ketma-ket rapid-fire: bitta ekranda 3 ta tezkor savol birin-ketin.
// Yechilgan savol yashil ✓-qatorga yig'iladi, bitta ball, veди-do-vernogo (Dars31 s1 metodi).
const WarmupScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const QS = c.questions;
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const audio = useAudio([{ id: `s${idx}_q0`, text: wasSolved ? '' : c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [qi, setQi] = useState(wasSolved ? QS.length : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? true) : true);
  const recordedRef = useRef(wasSolved);
  const done = qi >= QS.length;
  const cur = done ? null : QS[qi];
  const finish = () => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: 1, solved: true });
  };
  const pick = (i) => {
    if (done || wrong.has(i)) return;
    if (i === cur.correct) {
      sfx.playCorrect();
      const isLast = qi + 1 >= QS.length;
      if (!audio.muted) setTimeout(() => { const en = getAudioEngine(); if (en && !audio.muted) en.pushOneOff(isLast ? c.audio.on_correct[lang] : `${c.audio.next[lang]} ${QS[qi + 1].audio[lang]}`); }, 250);
      if (isLast) finish();
      setWrong(new Set());
      setQi(qi + 1);
    } else {
      firstTryRef.current = false;
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
      if (!audio.muted) setTimeout(() => { const en = getAudioEngine(); if (en && !audio.muted) en.pushOneOff(cur.hint[lang]); }, 250);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.6vw, 12px)', justifyContent: 'flex-start' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        {QS.slice(0, qi).map((q, di) => (
          <div key={di} className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(31, 122, 77, 0.08)', border: '1px solid rgba(31, 122, 77, 0.25)', borderRadius: 12, padding: 'clamp(8px, 1.4vw, 11px) clamp(12px, 2vw, 16px)' }}>
            <span aria-hidden="true" style={{ color: T.success, fontWeight: 700 }}>✓</span>
            <span className="body" style={{ flex: 1 }}>{mt(t(q.q))}</span>
            <span className="mono" style={{ color: T.success, fontWeight: 700 }}>{mt(t(q.opts[q.correct]))}</span>
          </div>
        ))}
        {!done && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.8vw, 12px)' }}>
            <h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.q))}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {cur.opts.map((o, i) => {
                const isWrong = wrong.has(i);
                return (
                  <button key={i} className={`option${isWrong ? ' option-picked-wrong' : ''}`} disabled={isWrong} onClick={() => pick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(11px, 1.7vw, 13px) clamp(14px, 2.1vw, 18px)', minHeight: 'clamp(46px, 6.2vw, 54px)' }}>
                    <span className="mono small" style={{ minWidth: 18, color: isWrong ? T.accent : T.ink3 }}>{isWrong ? '✗' : String.fromCharCode(65 + i)}</span>
                    <span style={{ flex: 1, fontSize: 'clamp(14px, 2vw, 16px)' }}>{mt(t(o))}</span>
                  </button>
                );
              })}
            </div>
            {wrong.size > 0 && (
              <div className="frame-tip" style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#D8A93A' }} aria-hidden="true">✗</span>
                <p className="body" style={{ margin: 0 }}>{mt(t(cur.hint))}</p>
              </div>
            )}
          </div>
        )}
        {done && (
          <>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "Hammasi to'g'ri" : 'Всё верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p>
            </FeedbackBlock>
            {factOnCorrect}
          </>
        )}
      </div>
    </Stage>
  );
};

// SOLVE-STEPS SCREEN — ketma-ket yechim: o'quvchi masalani bosqichma-bosqich O'ZI ishlaydi.
// Har frac uchun → umumiy maxrajga keltirish (surat kiritish), so'ng suratlarni ayirish.
// Yechilgan qadam yashil ✓-qatorga yig'iladi, keyingisi ochiladi. веди-до-верного, firstTry ball.
const SolveStepsScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, fracs, den, resNum, factOnCorrect, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const steps = [...fracs.map(f => ({ kind: 'conv', n: f.n, d: f.d, ans: f.conv })), { kind: 'sub', ans: resNum }];
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [si, setSi] = useState(wasSolved ? steps.length : 0);
  const [val, setVal] = useState('');
  const [bad, setBad] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? true) : true);
  const recordedRef = useRef(wasSolved);
  const introAdvancedRef = useRef(wasSolved);
  const done = si >= steps.length;
  const cur = done ? null : steps[si];
  const finish = () => { if (recordedRef.current) return; recordedRef.current = true; onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, correctAnswer: `${resNum}/${den}`, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: 1, solved: true }); };
  const submit = () => {
    if (done) return;
    if (val.trim() === '') { setHintShown(true); return; }
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (parseInt(val, 10) === cur.ans) {
      sfx.playCorrect();
      const isLast = si + 1 >= steps.length;
      if (!audio.muted) setTimeout(() => { const en = getAudioEngine(); if (en && !audio.muted) en.pushOneOff(isLast ? c.audio.on_correct[lang] : c.audio.next[lang]); }, 250);
      if (isLast) finish();
      setSi(si + 1); setVal(''); setBad(false); setHintShown(false);
    } else {
      firstTryRef.current = false; setBad(true); setHintShown(true); sfx.playWrong();
      if (!audio.muted) setTimeout(() => { const en = getAudioEngine(); if (en && !audio.muted) en.pushOneOff(c.audio.on_wrong[lang]); }, 250);
    }
  };
  const fracInput = (color) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2, color }}>
      <input type="text" inputMode="numeric" pattern="[0-9]*" aria-label={lang === 'uz' ? 'surat' : 'числитель'} className="answer-input" value={val} placeholder="0"
        onChange={ev => { setVal(ev.target.value.replace(/\D/g, '').slice(0, 3)); setHintShown(false); setBad(false); }} onKeyDown={ev => ev.key === 'Enter' && submit()}
        style={{ width: 'clamp(42px, 10vw, 52px)', textAlign: 'center', padding: 'clamp(3px, 0.8vw, 6px) 4px', boxShadow: bad ? '0 0 0 2px #FF4F28' : undefined }}/>
      <span style={{ width: '100%', height: 2, background: color, borderRadius: 2 }}/>
      <span className="mono" style={{ fontSize: 'clamp(13px, 2.4vw, 16px)', color }}>{den}</span>
    </span>
  );
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.6vw, 12px)', justifyContent: 'flex-start' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></div>
        {steps.slice(0, si).map((st, i) => (
          <div key={i} className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(31, 122, 77, 0.08)', border: '1px solid rgba(31, 122, 77, 0.25)', borderRadius: 12, padding: 'clamp(7px, 1.3vw, 10px) clamp(12px, 2vw, 16px)' }}>
            <span aria-hidden="true" style={{ color: T.success, fontWeight: 700, flexShrink: 0 }}>✓</span>
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {st.kind === 'conv'
                ? (<><Frac n={String(st.n)} d={String(st.d)} size="sm"/><Op>=</Op><Frac n={String(st.ans)} d={String(den)} size="sm" color={T.success}/></>)
                : (<><Frac n={String(fracs[0].conv)} d={String(den)} size="sm"/><Op>−</Op><Frac n={String(fracs[1].conv)} d={String(den)} size="sm"/><Op>=</Op><Frac n={String(resNum)} d={String(den)} size="sm" color={T.success}/></>)}
            </span>
          </div>
        ))}
        {!done && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.8vw, 12px)' }}>
            <p className="small" style={{ margin: 0, color: T.ink2, fontWeight: 600 }}>{lang === 'uz' ? `${si + 1}-qadam · ${t(cur.kind === 'conv' ? c.step_convert : c.step_subtract)}` : `Шаг ${si + 1} · ${t(cur.kind === 'conv' ? c.step_convert : c.step_subtract)}`}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {cur.kind === 'conv'
                ? (<><Frac n={String(cur.n)} d={String(cur.d)} size="mid" color={T.accent}/><Op>=</Op>{fracInput(T.success)}</>)
                : (<><Frac n={String(fracs[0].conv)} d={String(den)} size="mid" color={T.accent}/><Op>−</Op><Frac n={String(fracs[1].conv)} d={String(den)} size="mid" color={T.blue}/><Op>=</Op>{fracInput(T.success)}</>)}
            </div>
          </div>
        )}
        {!done && <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button></div>}
        {hintShown && !done && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: '#D8A93A', flexShrink: 0 }} aria-hidden="true">✗</span>
            <p className="body" style={{ margin: 0 }}>{mt(t(cur.kind === 'conv' ? c.hint_convert : c.hint_subtract))}</p>
          </div>
        )}
        {done && (
          <>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.done_text))}</p>
            </FeedbackBlock>
            {factOnCorrect}
          </>
        )}
      </div>
    </Stage>
  );
};

const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; });
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

// s0 — HOOK: баг в игре, 5/6 − 1/3 = 4/3 (полный сброс picked при возврате)
// MATH: umumiy maxraj — bitta 0..1 chiziq, slayder n bo'lakka bo'ladi; kasr belgisi
// n den ga bo'linsa to'r chizig'iga "qulflanadi" (frac_5_12 slayd 3 & 8).
const CommonLine = ({ n, marks }) => (
  <div className="cl-wrap">
    <div className="cl-band">
      <div className="cl-line"/>
      {Array.from({ length: n + 1 }).map((_, i) => (
        <div key={i} className={i === 0 || i === n ? 'cl-tick cl-tick-end' : 'cl-tick'} style={{ left: `${(i / n) * 100}%` }}/>
      ))}
      {marks.map((m, k) => {
        const pos = (m.num / m.den) * 100;
        const locked = n % m.den === 0;
        return (
          <div key={k} className={`cl-mark ${k === 0 ? 'cl-mark-up' : 'cl-mark-down'} ${locked ? 'cl-mark-lock' : ''}`} style={{ left: `${pos}%`, color: m.color }}>
            <span className="cl-lab">{locked
              ? <Frac n={String((n / m.den) * m.num)} d={String(n)} size="sm" color={m.color}/>
              : <Frac n={String(m.num)} d={String(m.den)} size="sm" color={m.color}/>}</span>
            <span className="cl-stem"/>
            <span className="cl-dot"/>
          </div>
        );
      })}
    </div>
    <div className="cl-axis"><span className="mono small" style={{ color: T.ink3 }}>0</span><span className="mono small" style={{ color: T.ink3 }}>1</span></div>
  </div>
);

const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.question[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'flex-start' }}>
        <h1 className="title h-title fade-up">{mt(t(c.title))}</h1>
        <div className="frame fade-up delay-1 hook-alive" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <WallBar cols={6} accentW={5 / 6} growFill aColor={T.accent} h={46} maxW={420}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Frac n="5" d="6" size="mid"/><Op>−</Op><Frac n="1" d="3" size="mid" color={T.blue}/><Op>=</Op><span className="hook-trap" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Frac n="4" d="3" size="mid" color={T.accent}/><span className="mop" style={{ color: T.ink3 }}>?</span></span></div>
        </div>
        <h2 className="title h-sub fade-up delay-2">{mt(t(c.question))}</h2>
        <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{t(o)}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ color: T.ink2, textAlign: 'center', margin: 0 }}>{mt(t(c.reveal))}</p>}
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION step: куски разного размера, 1/3 = 2/6 (overlay)
const Screen1 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s1;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const endRef = useRef(null);
  const handleStep = () => {
    if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); }
    else { audio.triggerEvent('button_click', 'next'); onNext(); }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 18px)', justifyContent: 'flex-start' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {step >= 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}><WallBar cols={6} accentW={5 / 6} growFill aColor={T.accent} h={54} maxW={9999}/></div>
                <Frac n="5" d="6" size="mid" color={T.accent}/>
              </div>
            )}
            {step >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}><WallBar cols={3} accentW={1 / 3} growFill aColor={T.blue} h={54} maxW={9999}/></div>
                <Frac n="1" d="3" size="mid" color={T.blue}/>
              </div>
            )}
            {step >= 3 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}><WallBar cols={6} baseCols={3} animateDividers accentW={0} blueW={2 / 6} aColor={T.blue} h={54} maxW={9999}/></div>
                <Frac n="2" d="6" size="mid" color={T.blue}/>
              </div>
            )}
          </div>
          {step >= 3 && <EquivRow a={1} b={3} k={2} color={T.blue}/>}
          {step >= 3 && <p className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>}
        </div>
        <div ref={endRef}/>
      </div>
    </Stage>
  );
};

// s2 — EXPLORATION slider: мост — общий знаменатель для 1/2 и 1/3 (→ 6)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [n, setN] = useState(5);
  const fit = n % 2 === 0 && n % 3 === 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!fit} onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'flex-start' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className={fit ? 'frame fade-up delay-1 fig-glow' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CommonLine n={n} marks={[{ num: 1, den: 2, color: T.accent }, { num: 1, den: 3, color: T.blue }]}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: fit ? T.success : T.ink2, fontWeight: fit ? 600 : 400 }}>{t(fit ? c.note_fit : c.note_nofit)}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.label_slider)}: {n}</p>
          <Slider value={n} min={2} max={12} onChange={setN}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>
      </div>
    </Stage>
  );
};

// s3 — RULE: алгоритм из 3 шагов + fact-карта (Египет)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(seqSegments(c, lang, 's3'));
  const steps = [c.card_top, c.card_bottom, c.card_line];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'flex-start' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="mono small" style={{ color: T.accent, marginTop: 1 }}>{i + 1}</span>
                <p className="body" style={{ margin: 0 }}>{mt(t(s))}</p>
              </div>
            ))}
          </div>
          <FracRow parts={[{ n: 3, d: 6, c: T.accent }, { n: 2, d: 6, c: T.blue }]} sumN={1} sumD={6}/>
        </div>
        <div className="frame-tip fade-up delay-2">
          <p className="small" style={{ margin: 0, fontWeight: 600 }}>{mt(t(c.outro))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s4 — TEST choice: 3/4 − 1/2 = 1/4 (правильный на B)
const Screen4 = (props) => {
  const c = CONTENT.s4;
  return <WarmupScreen {...props} idx={4} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[4]} screenContent={c} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimDenom/>}/>}/>;
};

// s5 — TEST input (дробь): 5/6 − 1/3 = 3/6 (или 1/2)
const Screen5 = (props) => {
  const c = CONTENT.s5;
  return <FracInputScreen {...props} idx={5} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[5]} screenContent={c} accepted={['3/6', '1/2']} primary={'3/6'}
    renderVisual={({ solved }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <QBars bare items={[{ n: '5', d: '6', cols: 6, w: 5 / 6, color: T.accent }, { n: '1', d: '3', cols: 3, w: 1 / 3, color: T.blue }]}/>
        {solved && <WallBar cols={6} accentW={3 / 6} growFill aColor={T.success} h={38} maxW={9999}/>}
      </div>
    )}/>;
};

// s6 — EXPLORATION drag: ключи-эквиваленты к замкам в двенадцатых (не scored)
const KEYS12 = [
  { n: '1', d: '2', target: '6/12', color: T.accent },
  { n: '2', d: '3', target: '8/12', color: T.blue },
  { n: '3', d: '4', target: '9/12', color: T.accent },
  { n: '5', d: '6', target: '10/12', color: T.blue },
];
const LOCKS12 = ['8/12', '10/12', '6/12', '9/12'];

const Screen6 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [opened, setOpened] = useState({});   // lock -> keyIdx
  const [sel, setSel] = useState(null);       // выбранный ключ (tap-режим)
  const [wrongLock, setWrongLock] = useState(null);
  const [drag, setDrag] = useState(null);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const lockRefs = useRef({});
  const wrongTimerRef = useRef(null);
  useEffect(() => () => { if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current); }, []);
  const done = Object.keys(opened).length === KEYS12.length;
  const usedKeys = new Set(Object.values(opened));
  const speak = (textObj) => {
    if (audio.muted) return;
    setTimeout(() => { const engine = getAudioEngine(); if (engine) engine.pushOneOff(textObj[lang]); }, 200);
  };
  const attempt = (keyIdx, lock) => {
    if (opened[lock] !== undefined || keyIdx === null || usedKeys.has(keyIdx)) return;
    if (KEYS12[keyIdx].target === lock) {
      setOpened(prev => ({ ...prev, [lock]: keyIdx }));
      setSel(null); setWrongLock(null);
      speak(c.ok_text);
    } else {
      setWrongLock(lock);
      speak(c.wrong_text);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => setWrongLock(null), 1100);
    }
  };
  const onDown = (e, i) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} movedRef.current = false; startRef.current = { x: e.clientX, y: e.clientY }; setDrag({ i, dx: 0, dy: 0 }); };
  const onMove = (e) => { if (!drag) return; const dx = e.clientX - startRef.current.x, dy = e.clientY - startRef.current.y; if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movedRef.current = true; setDrag(d => d ? { ...d, dx, dy } : d); };
  const onUp = (e, i) => {
    if (!drag) return;
    if (!movedRef.current) { setSel(sel === i ? null : i); }
    else {
      let hit = null;
      LOCKS12.forEach(lock => {
        const el = lockRefs.current[lock];
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hit = lock;
      });
      if (hit) attempt(i, hit);
    }
    setDrag(null);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'flex-start' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className={done ? 'frame fade-up delay-1 fig-glow' : 'frame fade-up delay-1'} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {LOCKS12.map(lock => {
            const isOpen = opened[lock] !== undefined;
            const isWrong = wrongLock === lock;
            const [ln, ld] = lock.split('/');
            return (
              <div key={lock} ref={el => { lockRefs.current[lock] = el; }} onClick={() => attempt(sel, lock)}
                className={isWrong ? 'qk-shake' : (isOpen ? 'qk-open' : undefined)}
                style={{ borderRadius: 12, padding: 'clamp(10px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: sel !== null && !isOpen ? 'pointer' : 'default', minHeight: 64,
                         background: isOpen ? T.successSoft : (isWrong ? T.accentSoft : T.paper),
                         boxShadow: isOpen ? '0 8px 22px -6px rgba(31, 122, 77, 0.32)' : (isWrong ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : `0 6px 16px -6px rgba(${T.shadowBase}, 0.14)`) }}>
                <span style={{ fontSize: 18 }}>{isOpen ? '🔓' : '🔒'}</span>
                <Frac n={ln} d={ld} size="sm" color={isOpen ? T.success : T.ink}/>
                {isOpen && <Frac n={KEYS12[opened[lock]].n} d={KEYS12[opened[lock]].d} size="sm" color={T.success}/>}
              </div>
            );
          })}
        </div>
        {!done && (
          <div className="fade-up delay-2" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {KEYS12.map((k, i) => usedKeys.has(i) ? null : (
              <button key={i} className="chip chip-pop" onPointerDown={(e) => onDown(e, i)} onPointerMove={onMove} onPointerUp={(e) => onUp(e, i)}
                style={{ padding: '10px 14px', background: k.color, transform: drag && drag.i === i ? `translate(${drag.dx}px, ${drag.dy}px)` : 'none', zIndex: drag && drag.i === i ? 20 : 1, position: 'relative',
                         outline: sel === i ? `3px solid ${T.ink}` : 'none' }}>
                <span style={{ marginRight: 6 }}>🗝️</span><Frac n={k.n} d={k.d} size="sm" color="#FFFFFF"/>
              </button>
            ))}
          </div>
        )}
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: done ? T.success : (wrongLock ? T.accent : T.ink2), fontWeight: done || wrongLock ? 600 : 400 }}>
          {t(done ? c.done_text : (wrongLock ? c.wrong_text : c.ok_text))}
        </p>
      </div>
    </Stage>
  );
};

// s7 — EXPLORATION slider: 5/6 и 3/4 — хватит ли 12? (24 не обязательно)
const Screen7 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const audio = useAudio(makeAudioSegments(c, lang));
  const [n, setN] = useState(8);
  const fit = n % 6 === 0 && n % 4 === 0;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!fit} onClick={onNext} label={t(c.btn)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)', justifyContent: 'flex-start' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <div className={fit ? 'frame fade-up delay-1 fig-glow' : 'frame fade-up delay-1'} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CommonLine n={n} marks={[{ num: 5, den: 6, color: T.accent }, { num: 3, den: 4, color: T.blue }]}/>
          <p className="body" style={{ margin: 0, textAlign: 'center', color: fit ? (n === 24 ? T.ink2 : T.success) : T.ink2, fontWeight: fit ? 600 : 400 }}>
            {t(fit ? (n === 24 ? c.note_24 : c.note_fit) : c.note_nofit)}
          </p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 460, margin: '0 auto', width: '100%' }}>
          <p className="small mono" style={{ margin: 0, color: T.accent }}>{t(c.label_slider)}: {n}</p>
          <Slider value={n} min={4} max={24} onChange={setN}/>
        </div>
        <p className="small fade-up delay-3" style={{ color: T.ink3, textAlign: 'center' }}>{mt(t(c.conclusion))}</p>
      </div>
    </Stage>
  );
};

// s8 — TEST choice сложный: 5/6 − 3/4 = 1/12 (правильный на C)
const Screen8 = (props) => {
  const c = CONTENT.s8;
  return <SolveStepsScreen {...props} idx={8} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[8]} screenContent={c} fracs={[{ n: 5, d: 6, conv: 10 }, { n: 3, d: 4, conv: 9 }]} den={12} resNum={1} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimCup/>}/>}/>;
};

// s9 — TEST choice debug: найди баг в решении 2/3 − 1/2 (опции = шаги, правильный — шаг 2, B)
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const options = [t(c.opt_1), t(c.opt_2), t(c.opt_3)];
  const steps = [c.step_1, c.step_2, c.step_3];
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <div className="frame" style={{ marginTop: 14, padding: 'clamp(12px, 2vw, 16px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p className="small" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.intro_text))}</p>
        {steps.map((s, i) => (
          <p key={i} className="small mono" style={{ margin: 0, padding: '4px 8px', borderRadius: 8, background: 'rgba(167, 166, 162, 0.12)' }}>{mt(t(s))}</p>
        ))}
        <p className="small mono" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{mt(t(c.result_line))}</p>
      </div>
    </>
  );
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={c} question={question} options={options} correctIdx={1}/>;
};

// s10 — CASE setup: босс — Ворота дракона (7/8 − 1/4 − 1/2, нужно ≥ 1/8) + fact-карта
const Screen10 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const audio = useAudio(seqSegments(c, lang, 's10'));
  const costs = [
    { l: c.card_line_label, v: c.card_line_value },
    { l: c.card_parts_label, v: c.card_parts_value },
    { l: c.card_req_label, v: c.card_req_value },
  ];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 1.9vw, 16px)', justifyContent: 'flex-start' }}>
        <h2 className="title h-title fade-up">{mt(t(c.title))}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{mt(t(c.body_p1))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}><WallBar cols={8} accentW={7 / 8} growFill aColor={T.accent} h={46} maxW={9999}/></div>
            <Frac n="7" d="8" size="mid" color={T.accent}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {costs.map((row, i) => (
              <div key={i} style={{ borderRadius: 10, padding: '8px 10px', background: 'rgba(167, 166, 162, 0.12)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="small mono" style={{ color: T.ink2 }}>{t(row.l)}</span>
                <span className="small" style={{ fontWeight: 600 }}>{mt(t(row.v))}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="body fade-up delay-2">{mt(t(c.outro))}</p>
      </div>
    </Stage>
  );
};

// s11 — CASE step: 1/4 и 1/2 в восьмых → 2/8 и 4/8 (правильный на A)
const PairOpt = ({ a, b }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <Frac n={a[0]} d={a[1]} size="mid"/>
    <span className="mop" style={{ color: T.ink3 }}>·</span>
    <Frac n={b[0]} d={b[1]} size="mid"/>
  </span>
);
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const base = [
    <PairOpt a={['2', '8']} b={['4', '8']}/>,
    <PairOpt a={['1', '8']} b={['1', '8']}/>,
    <PairOpt a={['2', '8']} b={['1', '8']}/>,
    <PairOpt a={['4', '8']} b={['2', '8']}/>
  ];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '4', cols: 4, w: 1 / 4, color: T.accent }, { n: '1', d: '2', cols: 2, w: 1 / 2, color: T.blue }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={11} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[11]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimBar/>}/>}/>;
};

// s12 — CASE step input (дробь): 7/8 − 2/8 − 4/8 = 1/8 (HP-бар гаснет до 1/8 при верном ответе)
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  return <FracInputScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={c} accepted={['1/8']} primary={'1/8'}
    renderVisual={({ solved }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 4vw, 32px)', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <WallBar cols={8} accentW={solved ? 1 / 8 : 7 / 8} aColor={solved ? T.success : T.accent} h={44} maxW={9999}/>
          <FracRow parts={[{ n: 7, d: 8, c: T.accent }, { n: 2, d: 8, c: T.blue }, { n: 4, d: 8, c: T.blue }]} sumN={solved ? 1 : null} sumD={8}/>
        </div>
        <QuestLock open={solved} label={t(c.lock_label)}/>
      </div>
    )}/>;
};

// s13 — CASE conclusion: 1/8 ровно хватает (правильный на C)
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 0]);
  const question = (
    <>
      <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
      <h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2>
      <QBars items={[{ n: '1', d: '8', cols: 8, w: 1 / 8, color: T.success }, { n: '1', d: '8', cols: 8, w: 1 / 8, color: T.blue }]}/>
    </>
  );
  return <QuestionScreen {...props} idx={13} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[13]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s14 — FINAL choice: 3/4 − 1/3 = 5/12 (правильный на D, без опорных баров)
const Screen14 = (props) => {
  const c = CONTENT.s14;
  return <DragBuildScreen {...props} idx={14} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[14]} screenContent={c} numAns={5} denAns={12} chips={[3, 4, 5, 7, 9, 12]}/>;
};

// s15 — FINAL input (дробь) сложный: 3/8 − 1/6 = 5/24 (24 < произведения 48; принимается и 10/48)
const Screen15 = (props) => {
  const t = useT(); const c = CONTENT.s15;
  return <FracInputScreen {...props} idx={15} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[15]} screenContent={c} accepted={['5/24', '10/48']} primary={'5/24'}
    renderVisual={({ solved }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 4vw, 32px)', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}><QBars items={[{ n: '3', d: '8', cols: 8, w: 3 / 8, color: T.accent }, { n: '1', d: '6', cols: 6, w: 1 / 6, color: T.blue }]} bare/></div>
        <QuestLock open={solved} label={t(c.lock_label)}/>
      </div>
    )}/>;
};

// s16 — SUMMARY + fact-карта (музыка) + связи
const Screen16 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s16;
  const audio = useAudio(seqSegments(c, lang, 's16'));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers && answers[i] && answers[i].correct).length;
  const total = scoredIdx.length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div className="sum-dense" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 1.9vw, 16px)', justifyContent: 'flex-start' }}>
        <div className="fade-up"><p className="eyebrow" style={{ color: T.success }}>{t(c.label)}</p><h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2></div>
        <div className="frame-success fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{t(c.score_label)}</span>
        </div>
        <div className="frame fade-up delay-2">
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 6 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}
          </div>
        </div>
        <p className="small fade-up delay-3" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.back_to_hook))}</p>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionSubUnlikeDenLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16];
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
  transition: all 0.32s ease;
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
  transition: all 0.32s ease;
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
  transition: all 0.32s ease;
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
  transition: all 0.32s ease;
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
.hook-trap { transform-origin: center; animation: hookTrap 2.4s ease-in-out infinite; }
@keyframes hookTrap { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
/* MATH: umumiy maxraj — bitta 0..1 chiziq, belgilar to'rga qulflanadi (frac_5_12 s2/s7). */
.cl-wrap { width: 100%; max-width: 480px; margin: 0 auto; padding: 0 18px; }
.cl-band { position: relative; height: 92px; }
.cl-line { position: absolute; left: 0; right: 0; top: 50%; height: 3px; background: rgba(167, 166, 162, 0.45); border-radius: 99px; transform: translateY(-50%); }
.cl-tick { position: absolute; top: 50%; width: 2px; height: 12px; background: rgba(167, 166, 162, 0.7); transform: translate(-50%, -50%); border-radius: 2px; }
.cl-tick-end { height: 22px; background: rgba(167, 166, 162, 0.95); }
.cl-mark { position: absolute; top: 0; height: 100%; width: 0; transform: translateX(-50%); }
.cl-dot { position: absolute; top: 50%; left: 0; transform: translate(-50%, -50%); width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid currentColor; background: #FFFFFF; transition: background 0.32s ease, box-shadow 0.32s ease; z-index: 2; }
.cl-mark-lock .cl-dot { background: currentColor; box-shadow: 0 0 0 4px rgba(31, 122, 77, 0.20); }
.cl-stem { position: absolute; left: 0; width: 2px; transform: translateX(-50%); background: currentColor; opacity: 0.4; }
.cl-mark-up .cl-stem { top: 24px; height: calc(50% - 24px); }
.cl-mark-down .cl-stem { bottom: 24px; height: calc(50% - 24px); }
.cl-lab { position: absolute; left: 0; transform: translateX(-50%); white-space: nowrap; }
.cl-mark-up .cl-lab { top: 0; }
.cl-mark-down .cl-lab { bottom: 0; }
.cl-axis { display: flex; justify-content: space-between; margin-top: 2px; }
/* MATH: квест-замок (frac_5_12 s12/s15). */
.qlock { display: inline-flex; flex-direction: column; align-items: center; }
.qlock-shackle { width: 24px; height: 16px; border: 4px solid #FF4F28; border-bottom: none; border-radius: 12px 12px 0 0; transition: transform 0.4s ease, border-color 0.4s ease; transform-origin: 100% 100%; margin-bottom: -2px; }
.qlock-body { width: 40px; height: 32px; border-radius: 8px; background: #FF4F28; display: flex; align-items: center; justify-content: center; transition: background 0.4s ease; }
.qlock-open .qlock-shackle { transform: rotate(-32deg); border-color: #1F7A4D; }
.qlock-open .qlock-body { background: #1F7A4D; }
/* MUKOFOT: to'g'ri javobda yuqoriga ko'tarilib so'nadigan bo'laklar (frac_5_12). */
.rw-burst { position: fixed; left: 50%; top: 42%; width: min(440px, 82vw); transform: translateX(-50%); height: 0; pointer-events: none; z-index: 60; }
.rw-bit { position: absolute; top: 0; width: 9px; height: 9px; border-radius: 2px; opacity: 0; animation: rwRise 0.95s cubic-bezier(0.33, 1, 0.68, 1) forwards; }
@keyframes rwRise { 0% { opacity: 0; transform: translateY(16px) scale(0.5) rotate(0deg); } 25% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-60px) scale(1) rotate(35deg); } }
@media (prefers-reduced-motion: reduce) { .rw-bit { animation: none; opacity: 0; } }
/* MATH: summary mobil zichlash (390x844 da scroll'ni ketkazadi; desktop o'zgarmaydi). frac_5_12 s16 */
@media (max-width: 640px) {
  .sum-dense { gap: 8px !important; }
  .sum-dense .frame, .sum-dense .frame-success, .sum-dense .frame-tip { padding: 10px 12px; }
  .sum-dense .body { font-size: 13.5px; line-height: 1.28; }
  .sum-dense .small { line-height: 1.3; }
  .sum-dense .h-title { font-size: 20px; }
}
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; position: relative; z-index: 1; }
/* Ambient: fon'da sekin suzuvchi yengil motivlar — bo'sh joyni jonlantiradi, chalg'itmaydi (#2). */
.lesson-root::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 12% 70%, rgba(255,79,40,0.07), transparent 22%), radial-gradient(circle at 88% 64%, rgba(1,154,203,0.07), transparent 20%), radial-gradient(circle at 50% 95%, rgba(31,122,77,0.06), transparent 18%); animation: ambDrift 22s ease-in-out infinite; }
.lesson-root::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(circle at 82% 22%, transparent 30px, rgba(255,79,40,0.06) 31px 34px, transparent 35px), radial-gradient(circle at 15% 28%, transparent 22px, rgba(1,154,203,0.06) 23px 25px, transparent 26px), radial-gradient(circle at 70% 88%, transparent 18px, rgba(31,122,77,0.05) 19px 21px, transparent 22px); animation: ambDrift2 28s ease-in-out infinite; }
@keyframes ambDrift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes ambDrift2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(14px, 18px); } }
@media (prefers-reduced-motion: reduce) { .lesson-root::before, .lesson-root::after { animation: none; } }
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
  transition: transform 0.25s ease;
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
  transition: all 0.32s ease;
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
.cell-pop { display: inline-block; animation: cellPop 0.34s cubic-bezier(0.33, 1, 0.68, 1); }
@keyframes cellPop { 0% { opacity: 0; transform: scale(0.4) translateY(-6px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 14px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* MATH: сравнение разных знаменателей — приведение к общим долям (frac_5_07). */
.cp-row { animation: cpRowIn 0.42s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes cpRowIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.cp-grow { animation: cpGrow 0.55s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes cpGrow { from { width: 0; } }
/* линии сетки въезжают слева направо (деление на общие доли) */
.cp-line { animation: cpLineIn 0.32s ease-out backwards; transform-origin: center top; }
@keyframes cpLineIn { from { opacity: 0; transform: scaleY(0.1); } to { opacity: 1; transform: scaleY(1); } }
.cp-marker { animation: cpMarkerIn 0.3s ease-out backwards; }
@keyframes cpMarkerIn { from { opacity: 0; } }
.cp-slide { animation: cpSlide 0.55s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes cpSlide { from { left: 0; } }
.cp-flag { transform-origin: bottom left; animation: cpFlagPop 0.4s cubic-bezier(0.33, 1, 0.68, 1) 0.45s backwards, cpFlagWave 1.8s ease-in-out 0.9s infinite; }
@keyframes cpFlagPop { from { opacity: 0; transform: scale(0); } }
@keyframes cpFlagWave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-7deg); } }
/* ориентир 1/2 въезжает к центру; точки-дроби мягко появляются */
.cp-half-in { animation: cpHalfIn 0.55s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes cpHalfIn { from { left: 0; opacity: 0; } }
.cp-dot-wrap { animation: cpDotIn 0.35s ease-out backwards; }
@keyframes cpDotIn { from { opacity: 0; } }
/* MATH: сокращение — слияние долей, счётчик, лесенка деления (frac_5_08). */
.cp-merge { animation: cpMerge 0.5s ease forwards; }
@keyframes cpMerge { from { opacity: 1; } to { opacity: 0; } }
.cp-spin { animation: cpSpin 0.4s cubic-bezier(0.33, 1, 0.68, 1); }
@keyframes cpSpin { 0% { opacity: 0; transform: translateY(-8px) scale(0.6); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.cp-ladder-step { animation: cpLadderIn 0.4s ease-out backwards; }
@keyframes cpLadderIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }

/* MATH frac_5_09: круг+полоса фигура, интерактивные доли, drag-чипы. */
.fig-cell { transition: background 0.38s cubic-bezier(0.33, 1, 0.68, 1); }
.fig-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
.chip {
  font-family: 'JetBrains Mono', monospace; font-weight: 600;
  border: none; border-radius: 10px; cursor: grab; color: #FFFFFF;
  box-shadow: 0 6px 16px -5px rgba(58, 53, 48, 0.42);
  touch-action: none; user-select: none; -webkit-user-select: none;
  transition: box-shadow 0.32s ease, filter 0.32s ease;
}
.chip:hover { filter: brightness(1.06); box-shadow: 0 9px 22px -5px rgba(58, 53, 48, 0.5); }
.chip:active { cursor: grabbing; }
.chip-pop { animation: chipPop 0.3s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes chipPop { from { opacity: 0; transform: scale(0.5); } }
.fig-glow { animation: figGlow 0.7s ease; opacity: 1; }
@keyframes figGlow {
  0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); }
  50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.45)); }
  100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); }
}
.fig-pulse { animation: figPulse 0.55s cubic-bezier(0.33, 1, 0.68, 1); }
@keyframes figPulse { 0% { transform: scale(1); } 35% { transform: scale(1.06); } 100% { transform: scale(1); } }

/* MATH frac_5_06: 2D area/grid (стена/грядка) — клетки заполняются, сетка въезжает при появлении. */
.ag-wrap { position: relative; }
.ag-cell { position: relative; transition: background 0.42s cubic-bezier(0.33, 1, 0.68, 1); }
.ag-shine { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0) 55%); }
.ag-in .ag-grid { animation: agGridIn 0.5s cubic-bezier(0.33, 1, 0.68, 1); }
@keyframes agGridIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
/* afternoon blue-блок въезжает (s2 overlay) */
.ag-blue-in { animation: agBlueIn 0.45s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes agBlueIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* MATH frac_5_06: горизонтальная стена WallBar — рост заливки, въезд разделителей, snap-маркеры, slide. */
.wb-fill .ag-shine { position: absolute; inset: 0; pointer-events: none; }
.wb-grow { animation: wbGrow 0.6s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes wbGrow { from { width: 0; } }
.wb-line { transform-origin: center top; }
.wb-line-anim { animation: wbLineIn 0.4s ease-out backwards; }
@keyframes wbLineIn { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
.wb-mark { top: -4px; bottom: -4px; width: 3px; border-radius: 2px; transform: translateX(-50%); opacity: 0.55; }
.wb-mark-on { opacity: 1; box-shadow: 0 0 8px rgba(31, 122, 77, 0.6); animation: wbSnap 0.4s cubic-bezier(0.33, 1, 0.68, 1); }
@keyframes wbSnap { 0% { transform: translateX(-50%) scaleY(0.6); } 100% { transform: translateX(-50%) scaleY(1); } }
.wb-slidein { animation: wbSlideIn 0.5s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes wbSlideIn { from { transform: translateY(70px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.wb-pop { animation: wbPop 0.4s cubic-bezier(0.33, 1, 0.68, 1) backwards; }
@keyframes wbPop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }

/* MATH frac_5_12: квест — замки/ключи (drag), дрожание неверного замка, pop открытия. */
.qk-shake { animation: qkShake 0.4s ease; }
@keyframes qkShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 60% { transform: translateX(5px); } 80% { transform: translateX(-3px); } }
.qk-open { animation: qkOpen 0.45s cubic-bezier(0.33, 1, 0.68, 1); }
@keyframes qkOpen { 0% { transform: scale(0.96); } 100% { transform: scale(1); } }

/* MATH: FactCard — fakt to'g'ri javobdan keyin (ko'k tema). */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
/* Tarix (umumiy maxraj): har xil bo'laklar bir o'lchovga tenglashadi. */
.fc17-denom { display: flex; flex-direction: column; gap: 7px; width: clamp(84px, 16vw, 112px); }
.fc17-denom-c { height: 12px; border-radius: 3px; background: #019ACB; opacity: 0.25; animation: fc17Denom 2.6s ease-in-out infinite; }
.fc17-denom-1 { width: 100%; animation-delay: 0s; }
.fc17-denom-2 { width: 55%; animation-delay: 0.35s; }
.fc17-denom-3 { width: 78%; animation-delay: 0.7s; }
@keyframes fc17Denom { 0%, 100% { width: 45%; opacity: 0.22; } 50% { width: 100%; opacity: 0.92; } }
/* Fan (retsept ayirmasi): stakan yuqori belgidan pastki belgigacha tushadi. */
.fc17-cup { position: relative; width: clamp(42px, 9vw, 56px); height: clamp(64px, 13vw, 84px); border: 2px solid #019ACB; border-radius: 5px 5px 10px 10px; overflow: hidden; }
.fc17-cup-fill { position: absolute; left: 0; right: 0; bottom: 0; background: #019ACB; opacity: 0.32; animation: fc17Cup 2.8s ease-in-out infinite; }
.fc17-cup-mark { position: absolute; left: 4px; right: 4px; height: 2px; background: #019ACB; opacity: 0.5; }
.fc17-cup-mark-hi { top: 28%; }
.fc17-cup-mark-lo { top: 64%; }
@keyframes fc17Cup { 0%, 100% { height: 72%; } 50% { height: 36%; } }
/* IT (progress ayirmasi): chiziq to'lib, keyin bir bo'lakka kamayadi. */
.fc17-bar { width: clamp(86px, 17vw, 116px); height: clamp(20px, 4.5vw, 26px); border-radius: 5px; background: rgba(1, 154, 203, 0.16); overflow: hidden; }
.fc17-bar-fill { display: block; height: 100%; border-radius: 5px; background: #019ACB; opacity: 0.85; animation: fc17Bar 2.8s ease-in-out infinite; }
@keyframes fc17Bar { 0% { width: 18%; } 45% { width: 92%; } 70%, 100% { width: 42%; } }

/* Accessibility: prefers-reduced-motion — gasim dekorativ sikllarni. */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
