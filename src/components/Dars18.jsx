import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Вычитание дробей с равными знаменателями — frac_5_10
// --- ИЗ infrastructure_v1 / Dars28 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen) ---
// Перестроен под keep-visible 2-B/2-C. Сестринский к Dars17 (frac_5_09). s6 → классификация (= нулю / больше нуля),
// s10 → error-spotting, s_seq → 5 примеров «вычти дроби» с растущими знаменателями (1→3 знака). Top-align, Bridge, shuffleMC.
// Центральный misconception: уронить знаменатель (5/6 − 2/6 = 3). Спец-случай: разность = 0.
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
// --- ПОД УРОК: frac_5_10 — Вычитание дробей с равными знаменателями ---
// ============================================================
const LESSON_META = {
  lessonId: 'frac-5-10-v1',
  lessonTitle: { ru: 'Вычитание дробей с равными знаменателями', uz: "Bir xil maxrajli kasrlarni ayirish" }
};
const TOTAL_SCREENS = 14;

// Обучающий урок keep-visible: scored у проверочных экранов (первая попытка → LMS), summary без счёта.
const SCREEN_META = [
  { id: 's0',    type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',    type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',    type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',    type: 'test',        template: 'Classify', scored: true,  scope: 'practice' },
  { id: 's7',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's_seq', type: 'test',        template: 'SeqMC',    scored: true,  scope: 'practice' },
  { id: 's8',    type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's9',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's10',   type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's11',   type: 'case',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's12',   type: 'summary',     template: 'custom',   scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Ученик вычел так: 5/6 − 2/6 = 3. Здесь есть ошибка?', uz: "O'quvchi shunday ayirdi: 5/6 − 2/6 = 3. Bu yerda xato bormi?" },
    opt_a: { ru: 'Да, здесь ошибка', uz: "Ha, bu yerda xato" },
    opt_b: { ru: 'Нет, всё верно', uz: "Yo'q, hammasi to'g'ri" },
    opt_c: { ru: 'Пока не уверен(а)', uz: "Hozircha aniq emas" },
    audio: { ru: 'Один ученик вычел две дроби так: пять шестых минус две шестых равно три. Он вычел числители пять минус два, а знаменатель просто убрал. Но пять шестых это меньше одного целого, и отнять немного нельзя так, чтобы получилось целых три. Как думаешь, здесь есть ошибка? Выбери ответ.', uz: "Bir o'quvchi ikki kasrni shunday ayirdi: oltidan besh minus oltidan ikki teng uch. U suratlarni ayirdi, besh minus ikki, maxrajni esa shunchaki olib tashladi. Lekin oltidan besh bitta butundan kam, ozni ayirib butun uch chiqishi mumkin emas. Sizningcha, bu yerda xato bormi? Javobni tanlang." }
  },
  s1: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    bridge: { ru: 'Вернёмся к спорной записи. Вычтем 5/6 и 2/6 по-честному.', uz: "Bahsli yozuvga qaytamiz. 5/6 dan 2/6 ni halol ayiramiz." },
    title: { ru: 'Вычтем 5/6 − 2/6 — на круге и полосе', uz: "5/6 dan 2/6 ni ayiramiz — doira va chiziqda" },
    step1: { ru: 'Круг и полоса поделены на 6 частей. Закрашены 5 — это <b>5/6</b>.', uz: "Doira va chiziq 6 bo'lakka bo'lingan. 5 tasi bo'yalgan — bu <b>5/6</b>." },
    step2: { ru: 'Убираем <b>2/6</b> — гасим две доли того же размера.', uz: "<b>2/6</b> ni olib tashlaymiz — o'sha o'lchamdagi ikki ulushni o'chiramiz." },
    step3: { ru: 'Осталось 3 доли из 6. <b>5/6 − 2/6 = 3/6</b>. Знаменатель остался 6.', uz: "6 tadan 3 ulush qoldi. <b>5/6 − 2/6 = 3/6</b>. Maxraj 6 bo'lib qoldi." },
    audio: {
      ru: [
        'Вычтем из пяти шестых две шестых. Смотри сразу на круг и на полосу. Нажимай кнопку дальше.',
        'Круг и полоса поделены на шесть равных частей. Закрашены пять из них — это пять шестых.',
        'Убираем две шестых — гасим две доли того же размера. Доли одинаковые, поэтому просто считаем, сколько осталось.',
        'Осталось три закрашенные доли из шести. Это три шестых. Знаменатель остался шесть. Значит, пять шестых минус две шестых равно три шестых, а не три.'
      ],
      uz: [
        "Oltidan beshdan oltidan ikkini ayiramiz. Doiraga ham, chiziqqa ham qarang. Davom etish tugmasini bosing.",
        "Doira va chiziq olti teng bo'lakka bo'lingan. Beshtasi bo'yalgan — bu oltidan besh.",
        "Oltidan ikkini olib tashlaymiz — o'sha o'lchamdagi ikki ulushni o'chiramiz. Ulushlar bir xil, shuning uchun nechta qolganini sanaymiz.",
        "Oltidan uchta ulush qoldi. Bu oltidan uch. Maxraj olti bo'lib qoldi. Demak, oltidan besh minus oltidan ikki teng oltidan uch, uch emas."
      ]
    }
  },
  s2: {
    eyebrow: { ru: 'Разбор', uz: "Tahlil" },
    bridge: { ru: 'А что, если убрать все закрашенные доли?', uz: "Agar hamma bo'yalgan ulushni olib tashlasak-chi?" },
    title: { ru: 'Когда убрали всё: 4/6 − 4/6', uz: "Hammasini olib tashlaganda: 4/6 − 4/6" },
    step1: { ru: 'Круг и полоса поделены на 6 частей. Закрашены 4 — это <b>4/6</b>.', uz: "Doira va chiziq 6 bo'lakka bo'lingan. 4 tasi bo'yalgan — bu <b>4/6</b>." },
    step2: { ru: 'Убираем <b>4/6</b> — гасим все четыре доли.', uz: "<b>4/6</b> ni olib tashlaymiz — to'rtala ulushni o'chiramiz." },
    step3: { ru: 'Не осталось ни одной доли. <b>4/6 − 4/6 = 0</b>. Знаменатель остался 6.', uz: "Birorta ulush qolmadi. <b>4/6 − 4/6 = 0</b>. Maxraj 6 bo'lib qoldi." },
    audio: {
      ru: [
        'Знаменатель при вычитании не меняется. Посмотрим, что будет, если убрать все доли. Нажимай дальше.',
        'Круг и полоса поделены на шесть равных частей. Закрашены четыре — это четыре шестых.',
        'Убираем четыре шестых — гасим все четыре доли.',
        'Не осталось ни одной доли. Числитель стал ноль, значит разность равна нулю. Знаменатель при этом остался шесть.'
      ],
      uz: [
        "Ayirganda maxraj o'zgarmaydi. Hamma ulushni olib tashlasak nima bo'lishini ko'ramiz. Davom etish tugmasini bosing.",
        "Doira va chiziq olti teng bo'lakka bo'lingan. To'rttasi bo'yalgan — bu oltidan to'rt.",
        "Oltidan to'rtni olib tashlaymiz — to'rtala ulushni o'chiramiz.",
        "Birorta ulush qolmadi. Surat nol bo'ldi, demak ayirma nolga teng. Maxraj esa olti bo'lib qoldi."
      ]
    }
  },
  s3: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Соберём это в одно правило.', uz: "Buni bitta qoidaga yig'amiz." },
    title: { ru: 'Вычитаем <b>числители</b>, знаменатель <b>не меняем</b>', uz: "<b>Suratlarni</b> ayiramiz, maxrajni <b>o'zgartirmaymiz</b>" },
    card_top: { ru: 'Числитель — <b>сколько долей осталось</b>. Вычитаем: 7 − 4 = 3.', uz: "Surat — <b>nechta ulush qoldi</b>. Ayiramiz: 7 − 4 = 3." },
    card_bottom: { ru: 'Знаменатель — <b>размер доли</b>. Он один и тот же, поэтому не меняется.', uz: "Maxraj — <b>ulush o'lchami</b>. U bir xil, shuning uchun o'zgarmaydi." },
    outro: { ru: 'Убирать знаменатель нельзя — без него это уже не доли, а целые числа.', uz: "Maxrajni olib tashlab bo'lmaydi — usiz bu ulush emas, butun son bo'lib qoladi." },
    audio: { ru: 'Запомни правило. Когда у дробей одинаковый знаменатель, вычитаем только числители, а знаменатель оставляем тем же. Числитель показывает, сколько долей осталось: семь минус четыре три. Знаменатель это размер доли, он один и тот же, поэтому не меняется. Семь девятых минус четыре девятых равно три девятых.', uz: "Qoidani eslab qoling. Kasrlarning maxraji bir xil bo'lganda, faqat suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz. Surat nechta ulush qolganini ko'rsatadi: yetti minus to'rt uch. Maxraj ulush o'lchami, u bir xil, shuning uchun o'zgarmaydi. To'qqizdan yetti minus to'qqizdan to'rt teng to'qqizdan uch." }
  },
  s4: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    bridge: { ru: 'Применим правило.', uz: "Qoidani qo'llaymiz." },
    title: { ru: 'Вычти <b>7/9 − 4/9</b>', uz: "<b>7/9 − 4/9</b> ni ayiring" },
    question: { ru: 'Знаменатель один — девятые. Вычти числители. Что получится?', uz: "Maxraj bitta — to'qqizdan. Suratlarni ayiring. Nima chiqadi?" },
    opt_a: { ru: '3/9', uz: '3/9' },
    opt_b: { ru: '3', uz: '3' },
    opt_c: { ru: '11/9', uz: '11/9' },
    opt_d: { ru: '2/9', uz: '2/9' },
    correct_text: { ru: 'Верно: 7 − 4 = 3, знаменатель 9 не меняется. Получается 3/9.', uz: "To'g'ri: 7 − 4 = 3, maxraj 9 o'zgarmaydi. 3/9 chiqadi." },
    wrong_0: { ru: 'Да: 7 − 4 = 3, знаменатель остаётся 9. Получается 3/9.', uz: "Ha: 7 − 4 = 3, maxraj 9 bo'lib qoladi. 3/9 chiqadi." },
    wrong_1: { ru: 'Знаменатель нельзя убирать. Без него выйдет целое 3, а это совсем другая величина. Оставь знаменатель 9, получится 3/9.', uz: "Maxrajni olib tashlab bo'lmaydi. Usiz butun 3 chiqadi, bu butunlay boshqa qiymat. Maxrajni 9 qoldiring, 3/9 chiqadi." },
    wrong_2: { ru: 'Здесь сложили, а нужно вычесть: 7 − 4 = 3, выйдет 3/9.', uz: "Bu yerda qo'shilgan, ayirish kerak edi: 7 − 4 = 3, 3/9 chiqadi." },
    wrong_3: { ru: 'Числитель посчитан неверно: 7 − 4 = 3, а не 2. Выйдет 3/9.', uz: "Surat noto'g'ri: 7 − 4 = 3, 2 emas. 3/9 chiqadi." },
    fact: { ru: 'В старину долги в долях урожая гасили так же: было 7/9 надела под уплату, отдали 4/9 — осталось 3/9 того же участка, а не три целых поля.', uz: "Qadimda hosil ulushidagi qarz ham shunday uzilgan: 7/9 ulush qarz edi, 4/9 berildi — o'sha uchastkaning 3/9 qismi qoldi, uchta butun dala emas." },
    audio: {
      intro: { ru: 'Вычти из семи девятых четыре девятых. Знаменатель один, девятые. Выбери ответ.', uz: "To'qqizdan yettidan to'qqizdan to'rtni ayiring. Maxraj bitta, to'qqizdan. Javobni tanlang." },
      on_correct: { ru: 'Верно. Семь минус четыре три, знаменатель девять. Так же в старину гасили долги в долях урожая.', uz: "To'g'ri. Yetti minus to'rt uch, maxraj to'qqiz. Qadimda hosil ulushidagi qarzlar ham shunday uzilgan." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь девять, вычти числители семь минус четыре.', uz: "Unchalik emas. Maxrajni to'qqiz qoldiring, suratlar yetti minus to'rtni ayiring." }
    }
  },
  s5: {
    eyebrow: { ru: 'Важно', uz: "Muhim" },
    title: { ru: 'Частая ошибка: <b>убрать знаменатель</b>', uz: "Ko'p uchraydigan xato: <b>maxrajni olib tashlash</b>" },
    rule_main: { ru: 'Если убрать низ: 5/6 − 2/6 даёт <b>3</b> — это три целых! Огромное число, совсем не та величина.', uz: "Agar pastni olib tashlasak: 5/6 − 2/6 <b>3</b> beradi — bu uchta butun! Ulkan son, mutlaqo boshqa qiymat." },
    rule_div: { ru: 'Правильно — знаменатель <b>оставить 6</b>: 5/6 − 2/6 = <b>3/6</b>. Это три доли из шести.', uz: "To'g'risi — maxrajni <b>6 qoldirish</b>: 5/6 − 2/6 = <b>3/6</b>. Bu oltidan uch ulush." },
    outro: { ru: 'Знаменатель — это размер доли. При вычитании он не меняется и не исчезает.', uz: "Maxraj — bu ulush o'lchami. Ayirganda u o'zgarmaydi va yo'qolmaydi." },
    audio: { ru: 'Внимание, частая ошибка. При вычитании вычитают только числители. Если убрать знаменатель, у пяти шестых минус две шестых выйдет целое три, а это огромное число, совсем не та величина. Правильно оставить знаменатель шесть: пять шестых минус две шестых это три шестых. Знаменатель это размер доли, при вычитании он не меняется.', uz: "Diqqat, ko'p uchraydigan xato. Ayirganda faqat suratlar ayriladi. Agar maxrajni olib tashlasak, oltidan besh minus oltidan ikkidan butun uch chiqadi, bu ulkan son, mutlaqo boshqa qiymat. To'g'risi maxrajni olti qoldirish: oltidan besh minus oltidan ikki bu oltidan uch. Maxraj ulush o'lchami, ayirganda u o'zgarmaydi." }
  },
  s6: {
    eyebrow: { ru: 'Сортировка', uz: "Saralash" },
    title: { ru: 'Разложи разности: равны <b>нулю</b> или <b>больше нуля</b>', uz: "Ayirmalarni ajrating: <b>nolga</b> teng yoki <b>noldan katta</b>" },
    lead: { ru: 'Вычти числители в уме. Если числители равны — разность равна нулю.', uz: "Suratlarni xayolan ayiring. Suratlar teng bo'lsa — ayirma nolga teng." },
    ask: { ru: 'разность равна нулю?', uz: "ayirma nolmi?" },
    bin_eq: { ru: 'равно нулю', uz: "nolga teng" },
    bin_uneq: { ru: 'больше нуля', uz: "noldan katta" },
    hint_wrong: { ru: 'Вычти числители. Если получился ноль, разность равна нулю.', uz: "Suratlarni ayiring. Nol chiqsa, ayirma nolga teng." },
    correct_text: { ru: 'Готово. Разность равна нулю, когда числители равны: 4/6 − 4/6 = 0, 6/7 − 6/7 = 0.', uz: "Tayyor. Suratlar teng bo'lganda ayirma nol bo'ladi: 4/6 − 4/6 = 0, 6/7 − 6/7 = 0." },
    audio: {
      intro: { ru: 'Перед тобой разности дробей. Разложи их по корзинам: равно нулю или больше нуля. Вычитай числители в уме и нажимай на разность.', uz: "Oldingizda kasr ayirmalari. Ularni savatga ajrating: nolga teng yoki noldan katta. Suratlarni xayolan ayiring va ayirmani bosing." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Вычти числители. Получился ноль или нет?', uz: "Suratlarni ayiring. Nol chiqdimi yoki yo'q?" }
    }
  },
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Вычти <b>5/7 − 2/7</b>', uz: "<b>5/7 − 2/7</b> ni ayiring" },
    question: { ru: 'Знаменатель — седьмые. Сколько останется?', uz: "Maxraj — yettidan. Qancha qoladi?" },
    opt_a: { ru: '3/7', uz: '3/7' },
    opt_b: { ru: '3', uz: '3' },
    opt_c: { ru: '7/7', uz: '7/7' },
    opt_d: { ru: '4/7', uz: '4/7' },
    correct_text: { ru: 'Верно: 5 − 2 = 3, знаменатель 7 не меняется. Получается 3/7.', uz: "To'g'ri: 5 − 2 = 3, maxraj 7 o'zgarmaydi. 3/7 chiqadi." },
    wrong_0: { ru: 'Да: 5 − 2 = 3, знаменатель остаётся 7. Получается 3/7.', uz: "Ha: 5 − 2 = 3, maxraj 7 bo'lib qoladi. 3/7 chiqadi." },
    wrong_1: { ru: 'Знаменатель нельзя убирать. Без него выйдет целое 3, совсем другая величина. Оставь 7, получится 3/7.', uz: "Maxrajni olib tashlab bo'lmaydi. Usiz butun 3 chiqadi, boshqa qiymat. 7 qoldiring, 3/7 chiqadi." },
    wrong_2: { ru: 'Здесь сложили: 5 + 2 = 7. Нужно вычесть: 5 − 2 = 3, выйдет 3/7.', uz: "Bu yerda qo'shilgan: 5 + 2 = 7. Ayirish kerak: 5 − 2 = 3, 3/7 chiqadi." },
    wrong_3: { ru: 'Числитель посчитан неверно: 5 − 2 = 3, а не 4. Выйдет 3/7.', uz: "Surat noto'g'ri: 5 − 2 = 3, 4 emas. 3/7 chiqadi." },
    audio: {
      intro: { ru: 'Вычти из пяти седьмых две седьмых. Выбери правильный вариант.', uz: "Yettidan beshdan yettidan ikkini ayiring. To'g'ri variantni tanlang." },
      on_correct: { ru: 'Верно. Пять минус два три, знаменатель семь, три седьмых.', uz: "To'g'ri. Besh minus ikki uch, maxraj yetti, yettidan uch." },
      on_wrong: { ru: 'Не совсем. Знаменатель оставь семь, вычти числители пять минус два.', uz: "Unchalik emas. Maxrajni yetti qoldiring, suratlar besh minus ikkini ayiring." }
    }
  },
  s_seq: {
    eyebrow: { ru: 'Тренажёр', uz: "Mashqlar" },
    title: { ru: 'Вычти дроби: <b>5 примеров подряд</b>', uz: "Kasrlarni ayiring: <b>5 ta misol ketma-ket</b>" },
    lead: { ru: 'Числа растут. Вычитай числители, знаменатель оставляй тем же.', uz: "Sonlar o'sib boradi. Suratlarni ayiring, maxrajni o'sha qoldiring." },
    questions: [
      {
        q: '5/7 − 2/7', opts: ['3/7', '3', '7/7'], correct: 0,
        ok: { ru: 'Верно. 5 − 2 = 3, знаменатель 7 не меняется: 3/7.', uz: "To'g'ri. 5 − 2 = 3, maxraj 7 o'zgarmaydi: 3/7." },
        no: { ru: 'Вычти только числители, знаменатель оставь прежним.', uz: "Faqat suratlarni ayiring, maxrajni o'sha qoldiring." }
      },
      {
        q: '9/12 − 4/12', opts: ['5/12', '5', '13/12'], correct: 0,
        ok: { ru: 'Верно. 9 − 4 = 5, знаменатель 12: 5/12.', uz: "To'g'ri. 9 − 4 = 5, maxraj 12: 5/12." },
        no: { ru: 'Вычитай числители, знаменатель оставляй тем же.', uz: "Suratlarni ayiring, maxrajni o'sha qoldiring." }
      },
      {
        q: '15/20 − 8/20', opts: ['7/20', '7', '23/20'], correct: 0,
        ok: { ru: 'Верно. 15 − 8 = 7, знаменатель 20: 7/20.', uz: "To'g'ri. 15 − 8 = 7, maxraj 20: 7/20." },
        no: { ru: 'Знаменатель один и тот же. Вычти только верхние числа.', uz: "Maxraj bir xil. Faqat yuqoridagi sonlarni ayiring." }
      },
      {
        q: '75/100 − 30/100', opts: ['45/100', '45', '105/100'], correct: 0,
        ok: { ru: 'Верно. 75 − 30 = 45, знаменатель 100: 45/100.', uz: "To'g'ri. 75 − 30 = 45, maxraj 100: 45/100." },
        no: { ru: 'Знаменатель оставь прежним, вычти только числители.', uz: "Maxrajni o'sha qoldiring, faqat suratlarni ayiring." },
        say: { ru: 'Числа больше, но правило то же. Вычти числители, знаменатель не меняй.', uz: "Sonlar kattaroq, lekin qoida o'sha. Suratlarni ayiring, maxrajni o'zgartirmang." }
      },
      {
        q: '600/1000 − 250/1000', opts: ['350/1000', '350', '850/1000'], correct: 0,
        ok: { ru: 'Верно. 600 − 250 = 350, знаменатель 1000: 350/1000.', uz: "To'g'ri. 600 − 250 = 350, maxraj 1000: 350/1000." },
        no: { ru: 'И здесь так же: вычитаем числители, знаменатель оставляем тем же.', uz: "Bu yerda ham shunday: suratlarni ayiramiz, maxrajni o'sha qoldiramiz." },
        say: { ru: 'Большие числа. Знаменатель один, вычитаем только числители.', uz: "Katta sonlar. Maxraj bitta, faqat suratlarni ayiramiz." }
      }
    ],
    audio: {
      intro: { ru: 'Пять примеров на вычитание подряд. Вычитай числители, знаменатель оставляй прежним. Нажимай на правильный ответ.', uz: "Ketma-ket besh ayirish misoli. Suratlarni ayiring, maxrajni o'sha qoldiring. To'g'ri javobni bosing." },
      on_done: { ru: 'Отлично, все примеры решены.', uz: "Zo'r, hamma misol yechildi." },
      on_wrong: { ru: 'Вычти только числители, знаменатель не меняй.', uz: "Faqat suratlarni ayiring, maxrajni o'zgartirmang." }
    }
  },
  s8: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Вспомним, что было на круге.', uz: "Doirada nima bo'lganini eslaymiz." },
    title: { ru: 'Если числители <b>равны</b> — разность равна <b>нулю</b>', uz: "Suratlar <b>teng</b> bo'lsa — ayirma <b>nolga</b> teng" },
    card_top: { ru: 'Знаменатель при вычитании не меняется — доли того же размера.', uz: "Ayirganda maxraj o'zgarmaydi — ulushlar o'sha o'lchamda." },
    card_bottom: { ru: 'Когда убрали все доли, числитель стал ноль: <b>4/6 − 4/6 = 0</b>.', uz: "Hamma ulush olib tashlanganda, surat nol bo'ldi: <b>4/6 − 4/6 = 0</b>." },
    outro: { ru: 'Так разность становится нулём, а знаменатель при этом не менялся.', uz: "Shunday qilib ayirma nolga aylanadi, maxraj esa o'zgarmadi." },
    audio: { ru: 'Запомни. Знаменатель это размер доли, при вычитании он не меняется. Когда убрали все доли, числитель становится ноль, и разность равна нулю. Например, четыре шестых минус четыре шестых это ноль.', uz: "Eslab qoling. Maxraj ulush o'lchami, ayirganda u o'zgarmaydi. Hamma ulush olib tashlanganda, surat nol bo'ladi va ayirma nolga teng. Masalan, oltidan to'rt minus oltidan to'rt bu nol." }
  },
  s9: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Вычти <b>4/6 − 4/6</b>', uz: "<b>4/6 − 4/6</b> ni ayiring" },
    question: { ru: 'Знаменатель — шестые. Сколько останется?', uz: "Maxraj — oltidan. Qancha qoladi?" },
    opt_a: { ru: '0', uz: '0' },
    opt_b: { ru: '1', uz: '1' },
    opt_c: { ru: '8/6', uz: '8/6' },
    opt_d: { ru: '4/6', uz: '4/6' },
    correct_text: { ru: 'Верно: 4 − 4 = 0, долей не осталось. 4/6 − 4/6 = 0.', uz: "To'g'ri: 4 − 4 = 0, ulush qolmadi. 4/6 − 4/6 = 0." },
    wrong_0: { ru: 'Да: 4 − 4 = 0, не осталось ни одной доли. Разность равна нулю.', uz: "Ha: 4 − 4 = 0, birorta ulush qolmadi. Ayirma nolga teng." },
    wrong_1: { ru: 'Равные дроби не дают целое. 4 − 4 = 0, значит разность ноль, а не 1.', uz: "Teng kasrlar butun bermaydi. 4 − 4 = 0, demak ayirma nol, 1 emas." },
    wrong_2: { ru: 'Здесь сложили: 4 + 4 = 8. Нужно вычесть: 4 − 4 = 0.', uz: "Bu yerda qo'shilgan: 4 + 4 = 8. Ayirish kerak: 4 − 4 = 0." },
    wrong_3: { ru: 'Нужно вычесть обе доли: 4 − 4 = 0, а не оставить одну. Разность ноль.', uz: "Ikkala ulushni ayirish kerak: 4 − 4 = 0, bittasini qoldirmasdan. Ayirma nol." },
    fact: { ru: 'В лаборатории из мерного стакана выливают столько же долей, сколько налили: было 4 доли, убрали 4 — стакан пуст, ровно ноль, ведь доли одного размера.', uz: "Laboratoriyada o'lchov stakanidan quygancha ulush to'kiladi: 4 ulush bor edi, 4 tasi olindi — stakan bo'sh, aniq nol, chunki ulushlar bir o'lchamda." },
    audio: {
      intro: { ru: 'Вычти из четырёх шестых четыре шестых. Сколько останется? Выбери ответ.', uz: "Oltidan to'rtdan oltidan to'rtni ayiring. Qancha qoladi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Четыре минус четыре ноль, не осталось ни одной доли. Так же в лаборатории: вылили столько же долей, сколько налили, и стакан пуст.', uz: "To'g'ri. To'rt minus to'rt nol, birorta ulush qolmadi. Laboratoriyada ham shunday: quygancha ulush to'kildi va stakan bo'sh bo'ldi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'В какой записи <b>ошибка</b>?', uz: "Qaysi yozuvda <b>xato</b> bor?" },
    question: { ru: 'Три записи верны, одна — нет. Найди неверную.', uz: "Uch yozuv to'g'ri, biri — yo'q. Noto'g'risini toping." },
    opt_a: { ru: '5/6 − 2/6 = 3', uz: '5/6 − 2/6 = 3' },
    opt_b: { ru: '7/8 − 3/8 = 4/8', uz: '7/8 − 3/8 = 4/8' },
    opt_c: { ru: '4/5 − 1/5 = 3/5', uz: '4/5 − 1/5 = 3/5' },
    opt_d: { ru: '6/9 − 2/9 = 4/9', uz: '6/9 − 2/9 = 4/9' },
    correct_text: { ru: 'Верно. Ошибка в 5/6 − 2/6: убрали знаменатель, вышло целое 3. Правильно 3/6 — знаменатель остаётся 6.', uz: "To'g'ri. Xato 5/6 − 2/6 da: maxraj olib tashlangan, butun 3 chiqqan. To'g'risi 3/6 — maxraj 6 bo'lib qoladi." },
    wrong_0: { ru: 'Да: здесь убрали знаменатель. Должно быть 3/6, а не 3.', uz: "Ha: bu yerda maxraj olib tashlangan. 3/6 bo'lishi kerak, 3 emas." },
    wrong_1: { ru: 'Здесь верно: 7 − 3 = 4, знаменатель 8, выйдет 4/8. Ошибка в другой записи.', uz: "Bu to'g'ri: 7 − 3 = 4, maxraj 8, 4/8 chiqadi. Xato boshqa yozuvda." },
    wrong_2: { ru: 'Здесь верно: 4 − 1 = 3, знаменатель 5, выйдет 3/5. Ищи запись без знаменателя.', uz: "Bu to'g'ri: 4 − 1 = 3, maxraj 5, 3/5 chiqadi. Maxrajsiz yozuvni qidiring." },
    wrong_3: { ru: 'Здесь верно: 6 − 2 = 4, знаменатель 9, выйдет 4/9. Ошибка там, где потерян знаменатель.', uz: "Bu to'g'ri: 6 − 2 = 4, maxraj 9, 4/9 chiqadi. Xato maxraj yo'qolgan joyda." },
    audio: {
      intro: { ru: 'Перед тобой четыре записи вычитания. Три верны, в одной ошибка. Найди неверную запись.', uz: "Oldingizda to'rtta ayirish yozuvi. Uchtasi to'g'ri, birida xato. Noto'g'ri yozuvni toping." },
      on_correct: { ru: 'Верно. В той записи убрали знаменатель, вышло целое три вместо трёх шестых.', uz: "To'g'ri. O'sha yozuvda maxraj olib tashlangan, butun uch chiqqan, oltidan uch o'rniga." },
      on_wrong: { ru: 'Ищи запись, где исчез знаменатель. Знаменатель убирать нельзя.', uz: "Maxraj yo'qolgan yozuvni qidiring. Maxrajni olib tashlab bo'lmaydi." }
    }
  },
  s11: {
    eyebrow: { ru: 'Задача · заряд', uz: "Masala · zaryad" },
    bridge: { ru: 'У Шерзода телефон заряжен на 7/8. Он потратил 3/8 заряда.', uz: "Sherzodning telefoni 7/8 zaryadlangan. U zaryadning 3/8 qismini sarfladi." },
    title: { ru: 'Сколько заряда осталось?', uz: "Zaryadning qancha qismi qoldi?" },
    question: { ru: 'Шкала заряда на 8 частей. 7/8 − 3/8 = ?', uz: "Zaryad shkalasi 8 bo'lakka bo'lingan. 7/8 − 3/8 = ?" },
    opt_a: { ru: '4/8', uz: '4/8' },
    opt_b: { ru: '4', uz: '4' },
    opt_c: { ru: '10/8', uz: '10/8' },
    opt_d: { ru: '5/8', uz: '5/8' },
    correct_text: { ru: 'Верно: 7 − 3 = 4, знаменатель 8. Осталось 4/8 заряда.', uz: "To'g'ri: 7 − 3 = 4, maxraj 8. Zaryadning 4/8 qismi qoldi." },
    wrong_0: { ru: 'Да: 7 − 3 = 4, знаменатель остаётся 8. Осталось 4/8.', uz: "Ha: 7 − 3 = 4, maxraj 8 bo'lib qoladi. 4/8 qoldi." },
    wrong_1: { ru: 'Знаменатель нельзя убирать: шкала всё та же, на 8 частей. Выйдет 4/8, а не целое 4.', uz: "Maxrajni olib tashlab bo'lmaydi: shkala o'sha, 8 bo'lakli. 4/8 chiqadi, butun 4 emas." },
    wrong_2: { ru: 'Здесь сложили: 7 + 3 = 10. Заряд тратится, нужно вычесть: 7 − 3 = 4, выйдет 4/8.', uz: "Bu yerda qo'shilgan: 7 + 3 = 10. Zaryad sarflanadi, ayirish kerak: 7 − 3 = 4, 4/8 chiqadi." },
    wrong_3: { ru: 'Числитель: 7 − 3 = 4, а не 5. Выйдет 4/8.', uz: "Surat: 7 − 3 = 4, 5 emas. 4/8 chiqadi." },
    fact: { ru: 'Телефон показывает заряд долями. Программа вычитает: было 7/8, ушло 3/8, осталось 4/8. Когда дойдёт до 0/8, заряд кончился.', uz: "Telefon zaryadni ulushlarda ko'rsatadi. Dastur ayiradi: 7/8 bor edi, 3/8 ketdi, 4/8 qoldi. 0/8 ga yetganda, zaryad tugadi." },
    audio: {
      intro: { ru: 'У Шерзода телефон заряжен на семь восьмых. Он потратил три восьмых. Сколько осталось? Выбери ответ.', uz: "Sherzodning telefoni sakkizdan yetti zaryadlangan. U sakkizdan uchni sarfladi. Qancha qoldi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Семь минус три четыре, знаменатель восемь, четыре восьмых. Так телефон и считает заряд: вычитает доли, и когда дойдёт до нуля, заряд кончился.', uz: "To'g'ri. Yetti minus uch to'rt, maxraj sakkiz, sakkizdan to'rt. Telefon zaryadni shunday hisoblaydi: ulushlarni ayiradi, nolga yetganda zaryad tugaydi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор справа.', uz: "Unchalik emas. O'ngdagi tushuntirishga qarang." }
    }
  },
  s12: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    label: { ru: 'Урок пройден', uz: "Dars tugadi" },
    title: { ru: 'Теперь ты вычитаешь дроби с равным знаменателем', uz: "Endi siz teng maxrajli kasrlarni ayirasiz" },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    main_1: { ru: 'У дробей с равным знаменателем вычитаем <b>числители</b>.', uz: "Teng maxrajli kasrlarda <b>suratlarni</b> ayiramiz." },
    main_2: { ru: 'Знаменатель <b>не меняется</b> и не исчезает — это размер доли.', uz: "Maxraj <b>o'zgarmaydi</b> va yo'qolmaydi — bu ulush o'lchami." },
    main_3: { ru: 'Убирать знаменатель нельзя: <b>5/6 − 2/6 = 3/6</b>, а не 3.', uz: "Maxrajni olib tashlab bo'lmaydi: <b>5/6 − 2/6 = 3/6</b>, 3 emas." },
    main_4: { ru: 'Если числители равны, разность равна нулю: <b>4/6 − 4/6 = 0</b>.', uz: "Suratlar teng bo'lsa, ayirma nolga teng: <b>4/6 − 4/6 = 0</b>." },
    score_caption: { ru: 'верных ответов с первой попытки', uz: "birinchi urinishdagi to'g'ri javoblar" },
    back_to_hook: { ru: 'Тот ученик убрал знаменатель и получил 3. Правильно — 3/6: знаменатель остаётся 6.', uz: "O'sha o'quvchi maxrajni olib tashlab 3 oldi. To'g'risi — 3/6: maxraj 6 bo'lib qoladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Сложение дробей с равным знаменателем» (обратное действие) и «Что такое дробь».', uz: "«Teng maxrajli kasrlarni qo'shish» (teskari amal) va «Kasr nima»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'сложение дробей с разными знаменателями.', uz: "har xil maxrajli kasrlarni qo'shish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Отлично. Теперь ты вычитаешь дроби с равным знаменателем. Вычитаем числители, а знаменатель оставляем тем же, это размер доли. Убирать знаменатель нельзя: пять шестых минус две шестых это три шестых, а не три. А если числители равны, разность равна нулю. Тот ученик в начале ошибся, правильный ответ три шестых. Дальше научимся складывать дроби с разными знаменателями.', uz: "Zo'r. Endi siz teng maxrajli kasrlarni ayirasiz. Suratlarni ayiramiz, maxrajni esa o'sha qoldiramiz, bu ulush o'lchami. Maxrajni olib tashlab bo'lmaydi: oltidan besh minus oltidan ikki bu oltidan uch, uch emas. Agar suratlar teng bo'lsa, ayirma nolga teng. Boshidagi o'quvchi xato qildi, to'g'ri javob oltidan uch. Keyin har xil maxrajli kasrlarni qo'shishni o'rganamiz." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР frac_5_10: круг (пирог) + полоса синхронно. Доли-картинка.
// Уменьшаемое — accent, вычитаемое/убираемое — pale accent. Интерактив: tap/slider.
// ============================================================

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

// Подпись-формула вычитания: a/den − b/den = (a−b)/den. Разность 0 показывается как «0».
const FormulaLabel = ({ counts, den, showSum = true }) => {
  const a = counts[0] || 0, b = counts[1] || 0;
  const diff = a - b;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Frac n={String(a)} d={String(den)} size="mid" color={T.accent}/>
      <Op>−</Op>
      <Frac n={String(b)} d={String(den)} size="mid" color={T.blue}/>
      {showSum && <><Op>=</Op>{diff === 0 ? <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.success }}>0</span> : <Frac n={String(diff)} d={String(den)} size="mid" color={T.success}/>}</>}
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
// s6 — ТАСНИФЛАШ (CLASSIFY): сумма = целому / меньше целого
// ============================================================
const S6_ADD_CARDS = [
  { label: '5/6 − 2/6', bin: 'lt' },
  { label: '4/6 − 4/6', bin: 'eq' },
  { label: '3/5 − 1/5', bin: 'lt' },
  { label: '5/9 − 5/9', bin: 'eq' },
  { label: '7/8 − 3/8', bin: 'lt' },
  { label: '6/7 − 6/7', bin: 'eq' },
  { label: '8/10 − 3/10', bin: 'lt' },
  { label: '6/12 − 6/12', bin: 'eq' },
  { label: '2/3 − 1/3', bin: 'lt' },
  { label: '5/10 − 5/10', bin: 'eq' }
];
const S6_ADD_BINS = [{ key: 'eq' }, { key: 'lt' }];

const ClassifyAdd = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s6; const sfx = useSfx();
  const [deck] = useState(() => { const a = S6_ADD_CARDS.map(x => x); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; });
  const n = deck.length;
  const audio = useAudio([{ id: 's6_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
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
      advRef.current = setTimeout(() => { if (idx + 1 < n) setIdx(idx + 1); else { setIdx(n); finish(snap); } }, 480);
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {deck.map((_, i) => <span key={i} className={`seq-dot${(i < idx || done) ? ' seq-dot-done' : ''}${(i === idx && !done) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        <div className="sort-tray fade-up delay-1">
          {done
            ? <span className="sort-tray-card" style={{ color: T.success }} aria-hidden="true">✓</span>
            : <><span className="sort-tray-card" key={idx}>{mt(cur.label)}</span><span className="sort-tray-ask">{mt(t(c.ask))}</span></>}
        </div>
        <div className="sort-bins fade-up delay-2">
          {S6_ADD_BINS.map(b => (
            <button key={b.key} className={`sort-bin sort-bin-${b.key === 'eq' ? 'sq' : 'cu'}${flash === b.key ? ' sort-bin-bad' : ''}`} disabled={done} onClick={() => tapBin(b.key)}>
              <span className="sort-bin-h">{b.key === 'eq' ? mt(t(c.bin_eq)) : mt(t(c.bin_uneq))}</span>
              <span className="sort-bin-cards">
                {inBin(b.key).map(i => <span key={i} className="sort-chip-in">{mt(deck[i].label)}</span>)}
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
              <span className="small mono" style={{ color: T.ink2 }}>{lang === 'uz' ? "ayir:" : 'вычти:'}</span>
              <div className="dm-prob">{mt(tx(q.q))}</div>
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

// s0 — HOOK: 5/6 − 2/6 = 3 — ошибка? (уронили знаменатель; центрируется, picked сбрасывается)
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt_a, c.opt_b, c.opt_c];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.title[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
    setTimeout(() => onNext(), 650);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h1 className="title h-title fade-up" style={{ position: 'relative' }}>{mt(t(c.title))}</h1>
        <div className="frame fade-up delay-1 hook-alive" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(6px, 1.8vw, 12px)', flexWrap: 'wrap' }}><span className="hook-sheen" aria-hidden="true"/><span className="hook-glow" aria-hidden="true"/>
          <Frac n="5" d="6" size="mid"/><Op>−</Op><Frac n="2" d="6" size="mid"/><Op>=</Op><span className="display" style={{ fontSize: 'clamp(28px, 5vw, 40px)', color: T.accent }}>3</span>
          <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: T.accent }}>?</span>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// Шаг-эксплорация на фигуре (круг+полоса). counts по шагам.
const StepExplore = ({ c, screen, onNext, onPrev, den, countsByStep, sumOnLast }) => {
  const lang = useLang(); const t = useT();
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `se${screen}_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const steps = [c.step1, c.step2, c.step3];
  const counts = countsByStep[Math.min(step, countsByStep.length - 1)];
  const fills = buildFills([{ count: counts[0], color: T.accent }, { count: counts[1], color: 'rgba(255, 79, 40, 0.22)' }], den);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? (lang === 'uz' ? 'Keyingi qadam' : 'Дальше') : <NextLabel/>} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', minHeight: 180, justifyContent: 'center' }}>
          {step >= 1
            ? <FracFigure den={den} fills={fills} pieSize={130}/>
            : <p className="body" style={{ color: T.ink3, margin: 0 }}>…</p>}
          {step >= 1 && <p className="body" style={{ margin: 0, textAlign: 'center', maxWidth: 480 }}>{mt(t(steps[Math.min(step, last) - 1] || c.step1))}</p>}
          {step >= last && <FormulaLabel counts={sumOnLast} den={den}/>}
        </div>
      </div>
    </Stage>
  );
};

// s1 — EXPLORATION: 5/6 − 2/6 = 3/6 (minuend filled, subtrahend removed)
const Screen1 = (props) => <StepExplore {...props} c={CONTENT.s1} den={6} countsByStep={[[0, 0], [5, 0], [3, 2], [3, 0]]} sumOnLast={[5, 2]}/>;

// s2 — EXPLORATION спец-случай: 4/6 − 4/6 = 0 (всё убрали)
const Screen2 = (props) => <StepExplore {...props} c={CONTENT.s2} den={6} countsByStep={[[0, 0], [4, 0], [0, 4], [0, 0]]} sumOnLast={[4, 4]}/>;

// s3 — RULE: складываем числители, знаменатель не меняем. (top-align + Bridge)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><FormulaLabel counts={[7, 4]} den={9}/></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_bottom))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s4 — TEST choice: 4/9 + 2/9 (две полосы-слагаемых). FactCard история.
const Screen4 = (props) => {
  const t = useT(); const c = CONTENT.s4;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [1, 2, 0, 3]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  const figure = () => (
    <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="7" d="9" size="sm"/></div><div style={{ flex: 1 }}><FigBar den={9} fills={buildFills([{ count: 7, color: T.accent }], 9)}/></div></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 'clamp(44px, 10vw, 58px)', flexShrink: 0, display: 'flex', justifyContent: 'center', gap: 2 }}><Op size="sm">−</Op><Frac n="4" d="9" size="sm" color={T.blue}/></div><div style={{ flex: 1 }}><FigBar den={9} fills={buildFills([{ count: 4, color: T.blue }], 9)}/></div></div>
    </div>
  );
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={<FactCard text={c.fact} badge={FB_HIST} anim={<AnimShares/>}/>}/>;
};

// s5 — RULE misconception: убрали знаменатель (3/6 vs целое 3). (top-align)
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 'clamp(54px, 12vw, 70px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Frac n="3" d="6" size="sm"/></div>
            <div style={{ flex: 1 }}><FigBar den={6} fills={buildFills([{ count: 3, color: T.accent }], 6)}/></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 'clamp(54px, 12vw, 70px)', flexShrink: 0, display: 'flex', justifyContent: 'center' }}><span className="display" style={{ fontSize: 'clamp(24px, 5vw, 34px)', color: T.ink3 }}>3</span></div>
            <div style={{ flex: 1, display: 'flex', gap: 8 }}>{[0, 1, 2].map(i => (<div key={i} style={{ width: 'clamp(30px, 7vw, 42px)', height: 'clamp(30px, 7vw, 40px)', borderRadius: 7, background: T.ink3, opacity: 0.45, boxShadow: `inset 0 0 0 2px ${T.ink3}` }}/>))}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.rule_main))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0, color: T.success, fontWeight: 600 }}>{mt(t(c.rule_div))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s6 — TEST классификация (= целому / меньше).
const Screen6 = (props) => <ClassifyAdd {...props}/>;

// s7 — TEST choice: 2/7 + 3/7.
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [0, 2, 1, 3]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx}/>;
};

// s_seq — TEST: 5 примеров «вычти дроби», растущие знаменатели (tap, scored).
const ScreenSeq = (props) => <SeqMC {...props} screenContent={CONTENT.s_seq} scored={true}/>;

// s8 — RULE: числитель = знаменателю → целое (6/6 = 1). (top-align + Bridge)
const Screen8 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.6vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)}</p>
          <h2 className="title h-title" style={{ marginTop: 8 }}>{mt(t(c.title))}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><FormulaLabel counts={[4, 4]} den={6}/></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_top))}</p>
            <div style={{ height: 1, background: 'rgba(167, 166, 162, 0.4)' }}/>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.card_bottom))}</p>
          </div>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.outro))}</p></div>
      </div>
    </Stage>
  );
};

// s9 — TEST choice: 3/6 + 3/6 = 6/6. FactCard наука.
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimJars/>}/>}/>;
};

// s10 — TEST error-spotting: где запись неверна (correct old idx 0).
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt_a), optEl(t, c.opt_b), optEl(t, c.opt_c), optEl(t, c.opt_d)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 0, 1, 2]);
  const question = (<><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} titleNode={c.title}/>;
};

// s11 — CASE final: Достон, загрузка 3/8 + 2/8. FactCard IT.
const Screen11 = (props) => {
  const t = useT(); const c = CONTENT.s11;
  const { options, correctIdx, content } = shuffleMC(c, [t(c.opt_a), t(c.opt_b), t(c.opt_c), t(c.opt_d)], 0, [1, 3, 0, 2]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} titleNode={c.title} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact} badge={FB_IT} anim={<AnimUpload/>}/>}/>;
};

// s12 — SUMMARY: счёт + «Главное»; finishLesson один раз. (top-align)
const Screen12 = ({ screen, answers, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s12;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const mains = [c.main_1, c.main_2, c.main_3, c.main_4];
  const scoreTotal = SCREEN_META.filter(s => s.scored).length;
  const scoreCorrect = (answers || []).filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 16px)' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.success }}>{t(c.label)}</p>
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
          <FormulaLabel counts={[5, 2]} den={6}/>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.back_to_hook))}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function FractionSubSameDenLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenSeq, Screen8, Screen9, Screen10, Screen11, Screen12];
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
`;
