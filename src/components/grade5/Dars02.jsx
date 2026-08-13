import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Умножение десятичных дробей — dec_5_05
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

// Ведущий маркер языка для TTS: без него голос читает базовый язык неправильно.
// Ставится ОДИН раз — движком, перед отправкой (playSegment), а не в CONTENT: строки
// склеиваются и уходят через pushOneOff, в тексте маркер попал бы в середину.
const LEAD_TAG_RE = /^\s*\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/;
const withLangTag = (text, lang) => {
  const s = String(text == null ? '' : text).trim();
  if (!s) return s;
  if (LEAD_TAG_RE.test(s)) return s;
  return (LANG_TAG[lang] || LANG_TAG.ru) + ' ' + s;
};

// Метка урока в запросе озвучки: сервер по ней отделяет кэш одного урока от другого
// (без неё ключ — только текст, и озвучка всех уроков лежит вперемешку).
// student_uuid не шлём: LMS не передаёт его уроку.
const lessonMetaQuery = (lang) => {
  const meta = (typeof LESSON_META !== 'undefined' && LESSON_META) || null;
  if (!meta || !meta.lessonId) return '';
  const title = meta.lessonTitle || {};
  const name = title[lang] || title.ru || '';
  return '&lesson_id=' + encodeURIComponent(meta.lessonId)
       + (name ? '&lesson_name=' + encodeURIComponent(name) : '');
};

// HTTP TTS: {base}/api/tts?text=<encoded>&g=m|f&lesson_id=<id>&lesson_name=<название>.
// text и g — контракт v5.2; lesson_id и lesson_name добавлены, чтобы сервер раскладывал
// кэш озвучки по урокам, а не в общую кучу (решение методиста, 2026-08-12).
// Язык — ведущим маркером внутри text: [Русское произношение] / [O'zbekcha tallaffuz].
// Маркер ставит движок (withLangTag) перед отправкой; сервер по нему выбирает произношение.
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

  setLang(lang) { this.currentLang = lang; }              // язык ведущего маркера TTS + preview Web Speech
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
    const lang = segment.lang || this.currentLang;
    el.src = buildTtsUrl(base, withLangTag(segment.text, lang), gender) + lessonMetaQuery(lang);
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
  return lang === 'uz' ? 'Davom etish' : lang === 'en' ? "Next" : 'Дальше';
};

const BackLabel = () => {
  const lang = useLang();
  return lang === 'uz' ? 'Orqaga' : lang === 'en' ? "Back" : 'Назад';
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
        {/* Заголовок (Title) + текст вопроса остаются и после верного ответа — сворачиваются только неверные варианты. */}
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {/* После верного: остаётся только верный вариант, неверные плавно (с задержкой) сворачиваются — keep-visible anti-scroll. */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;        // после верного неверные сворачиваются
            if (solved) {
              if (isCorrect) cls += ' option-correct';
              // неверным НЕ добавляем цвет-класс — плавно гаснут через inline opacity
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
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : lang === 'en' ? "Correct" : 'Верно') : (lang === 'uz' ? 'Maslahat' : lang === 'en' ? "Hint" : 'Подсказка')}
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
// --- UROK: nat_5_02 — Сравнение и округление / Taqqoslash va yaxlitlash ---
// Infra Dars28 (baytma-bayt). Keep-visible standart (PROMPT 2-B/2-C).
// ============================================================
const CONTENT = {
  // ───────────────────────────── s0 · HOOK ─────────────────────────────
  s0: {
    eyebrow: { ru: 'Вопрос урока', uz: 'Dars savoli', en: 'The question of the lesson' },
    global_q: {
      ru: 'Как понять, какое из двух космических чисел больше?',
      uz: "Ikki kosmik sondan qaysi biri katta ekanini qanday bilish mumkin?",
      en: 'How do you tell which of two space numbers is bigger?'
    },
    claim_lead: { ru: 'Бекзод смотрит на Марс и Землю и говорит:', uz: 'Bekzod Marsga va Yerga qarab shunday deydi:', en: 'Bekzod looks at Mars and the Earth and says:' },
    claim_em: {
      ru: 'Марс больше — у него 6 779 начинается с шестёрки, а у Земли 12 742 с единицы.',
      uz: "Mars katta — uning 6 779 i oltidan, Yerning 12 742 si esa birdan boshlanadi.",
      en: "Mars is bigger, because its 6 779 starts with a six and the Earth's 12 742 starts with a one."
    },
    planet_mars: { ru: 'Марс', uz: 'Mars', en: 'Mars' },
    planet_earth: { ru: 'Земля', uz: 'Yer', en: 'The Earth' },
    question: { ru: 'Бекзод прав?', uz: 'Bekzod haqmi?', en: 'Is Bekzod right?' },
    opt_yes: { ru: 'Бекзод прав', uz: 'Bekzod haq', en: 'Bekzod is right' },
    opt_no: { ru: 'Бекзод ошибается', uz: 'Bekzod xato qilyapti', en: 'Bekzod is wrong' },
    opt_idk: { ru: 'Не уверен', uz: 'Ishonchim komil emas', en: 'I am not sure' },
    correctIndex: null,
    audio: {
      intro: {
        ru: 'Бекзод смотрит на два диаметра. У Марса шесть тысяч семьсот семьдесят девять километров, у Земли двенадцать тысяч семьсот сорок два. Он говорит: Марс больше, ведь его число начинается с шестёрки. Прав ли он?',
        uz: "Bekzod ikki diametrga qaraydi. Marsda olti ming yetti yuz yetmish to'qqiz kilometr, Yerda o'n ikki ming yetti yuz qirq ikki. U aytadi: Mars katta, chunki uning soni oltidan boshlanadi. U haqmi?",
        en: 'Bekzod is looking at two diameters. Mars is six thousand seven hundred and seventy nine kilometres and the Earth is twelve thousand seven hundred and forty two. He says Mars is bigger because its number starts with a six. Is he right?'
      },
      on_correct: { ru: 'Хорошо. Сейчас проверим.', uz: 'Yaxshi. Hozir tekshiramiz.', en: 'Good. Let us check.' },
      on_wrong: { ru: 'Хорошо. Сейчас проверим.', uz: 'Yaxshi. Hozir tekshiramiz.', en: 'Good. Let us check.' }
    }
  },

  // ─────────────────────── s1 · EXPLORATION (step-by-step) ───────────────────────
  s1: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz", en: 'Let us look into it' },
    title: { ru: 'Разложим диаметры по разрядам', uz: 'Diametrlarni xonalarga ajratamiz', en: 'Let us lay the diameters out by place' },
    intro: {
      ru: 'Поставим оба числа в таблицу разрядов и посмотрим, сколько в каждом разрядов.',
      uz: "Ikkala sonni xonalar jadvaliga qo'yamiz va har birida nechta xona borligini ko'ramiz.",
      en: 'Let us put both numbers into a place table and see how many places each one has.'
    },
    step1_label: { ru: 'Марс — 6 779', uz: 'Mars — 6 779', en: 'Mars, 6 779' },
    step1_text: {
      ru: 'Четыре разряда: тысячи, сотни, десятки, единицы.',
      uz: "To'rt xona: minglar, yuzlar, o'nlar, birlar.",
      en: 'Four places: thousands, hundreds, tens and ones.'
    },
    step2_label: { ru: 'Земля — 12 742', uz: 'Yer — 12 742', en: 'The Earth, 12 742' },
    step2_text: {
      ru: 'Пять разрядов: есть десятки тысяч, которых у Марса нет.',
      uz: "Besh xona: Marsda yo'q bo'lgan o'n minglar bor.",
      en: 'Five places: there are ten thousands, which Mars does not have.'
    },
    step3_label: { ru: 'Вывод', uz: 'Xulosa', en: 'The conclusion' },
    step3_text: {
      ru: 'У Земли разрядов больше — значит, она больше. Шестёрка в начале Марса ничего не решает.',
      uz: "Yerda xona ko'proq — demak, u katta. Marsning boshidagi olti hech narsani hal qilmaydi.",
      en: 'The Earth has more places, so it is bigger. The six at the start of Mars decides nothing.'
    },
    btn_step: { ru: 'Дальше', uz: 'Davom etish', en: 'Next' },
    audio: {
      ru: [
        'Поставим шесть тысяч семьсот семьдесят девять в таблицу разрядов. В нём четыре разряда: тысячи, сотни, десятки и единицы.',
        'Теперь двенадцать тысяч семьсот сорок два. В нём пять разрядов. Есть разряд десятков тысяч, которого у Марса нет.',
        'У Земли разрядов больше, поэтому она больше. Крупная шестёрка в начале Марса ничего не меняет.'
      ],
      uz: [
        "Olti ming yetti yuz yetmish to'qqizni xonalar jadvaliga qo'yamiz. Unda to'rt xona bor: minglar, yuzlar, o'nlar va birlar.",
        "Endi o'n ikki ming yetti yuz qirq ikki. Unda besh xona bor. Marsda yo'q bo'lgan o'n minglar xonasi mavjud.",
        "Yerda xona ko'proq, shuning uchun u katta. Marsning boshidagi yirik olti hech narsani o'zgartirmaydi."
      ],
      en: ['Let us put six thousand seven hundred and seventy nine into the place table. It has four places: thousands, hundreds, tens and ones.', 'Now twelve thousand seven hundred and forty two. It has five places. There is a ten thousands place, which Mars does not have.', 'The Earth has more places, so it is bigger. The big six at the start of Mars changes nothing.']
    }
  },

  // ───────────────────────────── s2 · RULE (сравнение) ─────────────────────────────
  s2: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как сравнивать многозначные числа?', uz: "Ko'p xonali sonlarni qanday taqqoslash mumkin?", en: 'How do you compare long numbers?' },
    rule_1: {
      ru: 'У какого числа разрядов больше — то и больше.',
      uz: "Qaysi sonda xona ko'p bo'lsa, o'sha katta.",
      en: 'The number with more places is the bigger one.'
    },
    rule_2: {
      ru: 'Если разрядов поровну — сравниваем слева направо до первой разной цифры.',
      uz: "Agar xona soni teng bo'lsa — chapdan o'ngga, birinchi farqli raqamgacha taqqoslaymiz.",
      en: 'If they have the same number of places, we compare from left to right up to the first digit that differs.'
    },
    example_1: { ru: '4 879 < 139 820 — у Юпитера разрядов больше.', uz: "4 879 < 139 820 — Yupiterda xona ko'proq.", en: '4 879 < 139 820, Jupiter has more places.' },
    example_2: { ru: '50 724 > 49 244 — разрядов поровну, но слева 5 больше 4.', uz: '50 724 > 49 244 — xona teng, lekin chapda 5 — 4 dan katta.', en: '50 724 > 49 244, the same number of places, but on the left 5 is more than 4.' },
    audio: {
      ru: 'Если у одного числа разрядов больше, оно больше. Если разрядов поровну, идём слева направо и сравниваем цифры до первого различия. Например, пятьдесят тысяч семьсот двадцать четыре больше сорока девяти тысяч двухсот сорока четырёх, потому что слева пять больше четырёх.',
      uz: "Agar bir sonda xona ko'p bo'lsa, u katta. Agar xona teng bo'lsa, chapdan o'ngga raqamlarni birinchi farqgacha taqqoslaymiz. Masalan, ellik ming yetti yuz yigirma to'rt qirq to'qqiz ming ikki yuz qirq to'rtdan katta, chunki chapda besh to'rtdan katta.",
      en: 'If one number has more places, it is bigger. If they have the same number of places, we go from left to right and compare the digits up to the first difference. For example, fifty thousand seven hundred and twenty four is bigger than forty nine thousand two hundred and forty four, because on the left five is more than four.'
    }
  },

  // ─────────────────────── s3 · TEST choice (разная длина) ───────────────────────
  s3: {
    eyebrow: { ru: 'Тренировка · 1 из 4', uz: 'Mashq · 4 dan 1', en: 'Practice · 1 of 4' },
    label: { ru: 'Сравни планеты', uz: 'Sayyoralarni taqqoslang', en: 'Compare the planets' },
    question: { ru: 'Какая планета больше: Меркурий (4 879 км) или Юпитер (139 820 км)?', uz: 'Qaysi sayyora katta: Merkuriy (4 879 km) yoki Yupiter (139 820 km)?', en: 'Which planet is bigger, Mercury (4 879 km) or Jupiter (139 820 km)?' },
    opt0: { ru: 'Юпитер — у него больше разрядов', uz: "Yupiter — unda xona ko'proq", en: 'Jupiter, it has more places' },
    opt1: { ru: 'Меркурий — у него первая цифра 4', uz: 'Merkuriy — uning birinchi raqami 4', en: 'Mercury, its first digit is 4' },
    opt2: { ru: 'Нельзя сказать без подсчёта цифр', uz: "Raqamlarni sanamasdan aytib bo'lmaydi", en: 'You cannot tell without counting the digits' },
    correctIndex: 0,
    correct_text: {
      ru: 'Правильно. У Юпитера шесть разрядов, а у Меркурия четыре, поэтому он больше.',
      uz: "To'g'ri. Yupiterda olti xona, Merkuriyda esa to'rt, shuning uchun u katta.",
      en: 'Correct. Jupiter has six places and Mercury has four, so Jupiter is bigger.'
    },
    wrong_1: {
      ru: 'Первая цифра не решает. У Юпитера на два разряда больше, значит, он больше при любых цифрах.',
      uz: "Birinchi raqam hal qilmaydi. Yupiterda ikkita xona ko'proq, demak u istalgan raqamlarda ham katta.",
      en: 'The first digit does not decide it. Jupiter has two more places, so it is bigger whatever the digits are.'
    },
    wrong_2: {
      ru: 'Считать долго не нужно. Достаточно сравнить число разрядов: шесть против четырёх.',
      uz: "Uzoq sanash shart emas. Xona sonini taqqoslash kifoya: olti va to'rt.",
      en: 'There is no need for a long count. Just compare the number of places: six against four.'
    },
    hint_1: { ru: 'Сравни, сколько разрядов в каждом числе, а не первую цифру.', uz: "Birinchi raqamni emas, har bir sonda nechta xona borligini taqqoslang.", en: 'Compare how many places each number has, not the first digit.' },
    hint_2: { ru: 'Сравнить можно сразу, посмотри на число разрядов.', uz: "Darrov taqqoslash mumkin, xonalar soniga qarang.", en: 'You can compare them at once, just look at the number of places.' },
    audio: {
      intro: { ru: 'Какая планета больше: Меркурий, четыре тысячи восемьсот семьдесят девять километров, или Юпитер, сто тридцать девять тысяч восемьсот двадцать? Выбери ответ.', uz: "Qaysi sayyora katta: Merkuriy, to'rt ming sakkiz yuz yetmish to'qqiz kilometr, yoki Yupiter, bir yuz o'ttiz to'qqiz ming sakkiz yuz yigirma? Javobni tanlang.", en: 'Which planet is bigger, Mercury at four thousand eight hundred and seventy nine kilometres, or Jupiter at one hundred and thirty nine thousand eight hundred and twenty? Choose an answer.' },
      on_correct: { ru: 'Верно. У Юпитера шесть разрядов, а у Меркурия четыре, поэтому он больше.', uz: "To'g'ri. Yupiterda olti xona, Merkuriyda esa to'rt, shuning uchun u katta.", en: 'That is right. Jupiter has six places and Mercury has four, so Jupiter is bigger.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ─────────────────────── s4 · TEST choice (равная длина) ───────────────────────
  s4: {
    eyebrow: { ru: 'Тренировка · 2 из 4', uz: 'Mashq · 4 dan 2', en: 'Practice · 2 of 4' },
    label: { ru: 'Сравни планеты', uz: 'Sayyoralarni taqqoslang', en: 'Compare the planets' },
    question: { ru: 'Какая планета больше: Нептун (49 244 км) или Уран (50 724 км)?', uz: 'Qaysi sayyora katta: Neptun (49 244 km) yoki Uran (50 724 km)?', en: 'Which planet is bigger, Neptune (49 244 km) or Uranus (50 724 km)?' },
    opt0: { ru: 'Нептун — в нём есть крупная девятка', uz: "Neptun — unda yirik to'qqiz bor", en: 'Neptune, it has a big nine in it' },
    opt1: { ru: 'Уран — слева 5 больше 4', uz: 'Uran — chapda 5 — 4 dan katta', en: 'Uranus, on the left 5 is more than 4' },
    opt2: { ru: 'Они почти равны', uz: 'Ular deyarli teng', en: 'They are almost equal' },
    correctIndex: 1,
    correct_text: {
      ru: 'Правильно. Разрядов поровну, а в разряде десятков тысяч 5 больше 4.',
      uz: "To'g'ri. Xona soni teng, o'n minglar xonasida esa 5 — 4 dan katta.",
      en: 'Correct. They have the same number of places, and in the ten thousands place 5 is more than 4.'
    },
    wrong_0: {
      ru: 'Девятка не делает число больше. Сравниваем слева: 5 больше 4, дальше смотреть не нужно.',
      uz: "To'qqiz sonni katta qilmaydi. Chapdan taqqoslaymiz: 5 — 4 dan katta, keyingisiga qarash shart emas.",
      en: 'A nine does not make a number bigger. We compare from the left: 5 is more than 4, and there is no need to look further.'
    },
    wrong_2: {
      ru: 'Близкие числа — это ещё не равные. В разряде десятков тысяч цифры разные, поэтому Уран больше.',
      uz: "Yaqin sonlar — bu hali teng emas. O'n minglar xonasida raqamlar har xil, shuning uchun Uran katta.",
      en: 'Close numbers are not equal numbers. The digits in the ten thousands place are different, so Uranus is bigger.'
    },
    hint_0: { ru: 'Разрядов поровну. Сравни старшие цифры слева, а не ищи крупную девятку.', uz: "Xona teng. Yirik to'qqizni qidirma, chapdagi katta raqamlarni taqqoslang.", en: 'They have the same number of places. Compare the leading digits on the left instead of looking for a big nine.' },
    hint_2: { ru: 'Числа близкие, но не равные. Сравни цифры в старшем разряде.', uz: "Sonlar yaqin, lekin teng emas. Katta xonadagi raqamlarni taqqoslang.", en: 'The numbers are close but not equal. Compare the digits in the highest place.' },
    audio: {
      intro: { ru: 'Какая планета больше: Нептун, сорок девять тысяч двести сорок четыре, или Уран, пятьдесят тысяч семьсот двадцать четыре? Выбери ответ.', uz: "Qaysi sayyora katta: Neptun, qirq to'qqiz ming ikki yuz qirq to'rt, yoki Uran, ellik ming yetti yuz yigirma to'rt? Javobni tanlang.", en: 'Which planet is bigger, Neptune at forty nine thousand two hundred and forty four, or Uranus at fifty thousand seven hundred and twenty four? Choose an answer.' },
      on_correct: { ru: 'Верно. Разрядов поровну, а в разряде десятков тысяч пять больше четырёх.', uz: "To'g'ri. Xona soni teng, o'n minglar xonasida esa besh to'rtdan katta.", en: 'That is right. They have the same number of places, and in the ten thousands place five is more than four.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ─────────────────────── s5 · EXPLORATION (slider, зум-ось) ───────────────────────
  s5: {
    eyebrow: { ru: 'Исследуем', uz: 'Tekshiramiz', en: 'Let us explore' },
    title: { ru: 'К какому круглому числу ближе?', uz: 'Qaysi yaxlit songa yaqinroq?', en: 'Which round number is it closer to?' },
    intro: {
      ru: 'Перед тобой число между 12 000 и 13 000. Поставь ползунок в любое место и смотри, к какому круглому числу оно ближе.',
      uz: "Oldingizda 12 000 bilan 13 000 oralig'idagi son. Slayderni xohlagan joyga qo'ying va u qaysi yaxlit songa yaqinroq ekanini ko'ring.",
      en: 'Here is a number between 12 000 and 13 000. Put the slider anywhere and see which round number it is closer to.'
    },
    axis_left: { ru: '12 000', uz: '12 000', en: '12 000' },
    axis_point: { ru: '12 742', uz: '12 742', en: '12 742' },
    axis_right: { ru: '13 000', uz: '13 000', en: '13 000' },
    axis_left_note: { ru: 'ближайшая круглая тысяча снизу', uz: "pastdan eng yaqin yaxlit ming", en: 'the nearest round thousand below' },
    axis_right_note: { ru: 'ближайшая круглая тысяча сверху', uz: "tepadan eng yaqin yaxlit ming", en: 'the nearest round thousand above' },
    prompt: { ru: 'Двигай ползунок и наблюдай, к какому круглому ближе.', uz: "Slayderni harakatlantiring va qaysi yaxlit songa yaqinroq ekanini kuzating.", en: 'Move the slider and watch which round number it is closer to.' },
    bars_caption: { ru: 'Расстояние до каждой границы:', uz: "Har bir chegaragacha masofa:", en: 'The distance to each end:' },
    near_tag: { ru: 'ближе', uz: "yaqinroq", en: 'closer' },
    near_note: {
      ru: 'Оранжевая — ближняя граница: к ней и округляем.',
      uz: "To'q sariq — yaqin chegara: shu tomonga yaxlitlaymiz.",
      en: 'The orange one is the nearer end, and that is what we round to.'
    },
    play_hint: { ru: 'Подвигай ползунок и попробуй разные числа — так легче почувствовать, к какому круглому каждое ближе.', uz: "Slayderni harakatlantiring va turli sonlarni sinab ko'ring — har biri qaysi yaxlit songa yaqinroq ekanini his qilish osonroq bo'ladi.", en: 'Move the slider and try different numbers, it makes it easier to feel which round number each one is closer to.' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
    audio: {
      ru: [
        'Это число стоит между двенадцатью и тринадцатью тысячами. Двигай ползунок и смотри, к какой из двух круглых отметок оно ближе.',
        'Подвигай ползунок и попробуй разные числа. Так ты почувствуешь, к какому круглому числу каждое из них ближе, и поймёшь, как работает округление.'
      ],
      uz: [
        "Bu son o'n ikki ming bilan o'n uch ming oralig'ida. Slayderni harakatlantiring va u ikki yaxlit belgidan qaysi biriga yaqinroq ekanini ko'ring.",
        "Slayderni harakatlantiring va turli sonlarni sinab ko'ring. Shunda har biri qaysi yaxlit songa yaqinroq ekanini his qilasiz va yaxlitlash qanday ishlashini tushunasiz."
      ],
      en: ['This number stands between twelve and thirteen thousand. Move the slider and see which of the two round marks it is closer to.', 'Move the slider and try different numbers. That way you will feel which round number each one is closer to and understand how rounding works.']
    }
  },

  // ───────────────────────────── s6 · RULE (округление, ось) ─────────────────────────────
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Как округлять число', uz: 'Sonni qanday yaxlitlash', en: 'How to round a number' },
    rule_meaning: {
      ru: 'Округлить — значит выбрать ближайшее круглое число нужного разряда.',
      uz: "Yaxlitlash — kerakli xonadagi eng yaqin yaxlit sonni tanlash demakdir.",
      en: 'Rounding means choosing the nearest round number of the place you need.'
    },
    rule_trick: {
      ru: 'Посмотри на следующую младшую цифру: от 0 до 4 — берём меньшее круглое число, от 5 до 9 — большее. Младшие разряды становятся нулями.',
      uz: "Keyingi kichik raqamga qarang: 0 dan 4 gacha — kichik yaxlit son, 5 dan 9 gacha — katta yaxlit son. Kichik xonalar nolga aylanadi.",
      en: 'Look at the next digit down: from 0 to 4 we take the smaller round number, from 5 to 9 the bigger one. The lower places become zeros.'
    },
    rule_mid: {
      ru: 'Если число ровно посередине (цифра 5), берём большее круглое число.',
      uz: "Agar son aynan o'rtada bo'lsa (raqam 5), katta yaxlit sonni olamiz.",
      en: 'If the number is exactly in the middle (the digit 5), we take the bigger round number.'
    },
    example: { ru: '12 742 ≈ 13 000', uz: '12 742 ≈ 13 000', en: '12 742 ≈ 13 000' },
    audio: {
      ru: 'Округлить число значит выбрать ближайшее круглое число нужного разряда. Смотрим на следующую младшую цифру. Если она от нуля до четырёх, берём меньшее круглое число. Если от пяти до девяти, берём большее. Например, двенадцать тысяч семьсот сорок два приблизительно равно тринадцати тысячам.',
      uz: "Sonni yaxlitlash kerakli xonadagi eng yaqin yaxlit sonni tanlash demakdir. Keyingi kichik raqamga qaraymiz. Agar u noldan to'rtgacha bo'lsa, kichik yaxlit sonni olamiz. Beshdan to'qqizgacha bo'lsa, katta yaxlit sonni olamiz. Masalan, o'n ikki ming yetti yuz qirq ikki taxminan o'n uch mingga teng.",
      en: 'Rounding a number means choosing the nearest round number of the place you need. We look at the next digit down. If it is from zero to four we take the smaller round number. If it is from five to nine we take the bigger one. For example, twelve thousand seven hundred and forty two is about thirteen thousand.'
    }
  },

  // ─────────────────────── s7 · TEST choice (округл. до тысяч) ───────────────────────
  s7: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz", en: 'Let us look into it' },
    title: { ru: 'Округлять можно до любого разряда', uz: 'Sonni istalgan xonagacha yaxlitlash mumkin', en: 'You can round to any place' },
    intro: { ru: 'Возьмём число 12 742. Нажимай на разряд и смотри, до какого круглого числа оно округлится.', uz: "12 742 sonini olamiz. Xonani bosing, u qaysi yaxlit songacha yaxlitlanishini ko'ring.", en: 'Let us take the number 12 742. Tap a place and see which round number it rounds to.' },
    tap_prompt: { ru: 'Открывай разряды по порядку — все четыре', uz: 'Xonalarni tartib bilan bosing — barchasini', en: 'Open the places in order, all four of them' },
    r_tens: { ru: 'до десятков', uz: "o'nlar xonasigacha", en: 'to the nearest ten' },
    r_hundreds: { ru: 'до сотен', uz: 'yuzlar xonasigacha', en: 'to the nearest hundred' },
    r_thousands: { ru: 'до тысяч', uz: 'minglar xonasigacha', en: 'to the nearest thousand' },
    r_tenK: { ru: 'до десятков тысяч', uz: "o'n minglar xonasigacha", en: 'to the nearest ten thousand' },
    why_tens: { ru: 'Смотрим на единицы (2) — это вниз.', uz: 'Birlarga (2) qaraymiz — bu pastga.', en: 'We look at the ones (2), so it rounds down.' },
    why_hundreds: { ru: 'Смотрим на десятки (4) — это вниз.', uz: "O'nlarga (4) qaraymiz — bu pastga.", en: 'We look at the tens (4), so it rounds down.' },
    why_thousands: { ru: 'Смотрим на сотни (7) — это вверх.', uz: 'Yuzlarga (7) qaraymiz — bu yuqoriga.', en: 'We look at the hundreds (7), so it rounds up.' },
    why_tenK: { ru: 'Смотрим на тысячи (2) — это вниз.', uz: 'Minglarga (2) qaraymiz — bu pastga.', en: 'We look at the thousands (2), so it rounds down.' },
    conclusion: { ru: 'Чем выше разряд, тем грубее округление. Округление до тысяч и крупнее — это уже округление до целого класса.', uz: "Xona qancha katta bo'lsa, yaxlitlash shunchalik qo'pol. Minglar xonasigacha va undan kattagacha yaxlitlash — bu butun sinfgacha yaxlitlash.", en: 'The higher the place, the rougher the rounding. Rounding to thousands and above is already rounding to a whole group.' },
    audio: {
      ru: [
        'Возьмём число двенадцать тысяч семьсот сорок два. Округлим его до разных разрядов. Открывай их по порядку, от десятков.',
        'До десятков получится двенадцать тысяч семьсот сорок.',
        'До сотен получится двенадцать тысяч семьсот.',
        'До тысяч получится тринадцать тысяч.',
        'До десятков тысяч получится десять тысяч. Чем выше разряд, тем грубее прикидка.'
      ],
      uz: [
        "O'n ikki ming yetti yuz qirq ikki sonini olamiz. Uni turli xonagacha yaxlitlaymiz. Xonalarni tartib bilan bosing, o'nlardan boshlab.",
        "O'nlar xonasigacha o'n ikki ming yetti yuz qirq bo'ladi.",
        "Yuzlar xonasigacha o'n ikki ming yetti yuz bo'ladi.",
        "Minglar xonasigacha o'n uch ming bo'ladi.",
        "O'n minglar xonasigacha o'n ming bo'ladi. Xona qancha katta bo'lsa, chama shunchalik qo'pol."
      ],
      en: ['Let us take the number twelve thousand seven hundred and forty two. We will round it to different places. Open them in order, starting with the tens.', 'To the nearest ten it comes out as twelve thousand seven hundred and forty.', 'To the nearest hundred it comes out as twelve thousand seven hundred.', 'To the nearest thousand it comes out as thirteen thousand.', 'To the nearest ten thousand it comes out as ten thousand. The higher the place, the rougher the estimate.']
    }
  },
  s8: {
    eyebrow: { ru: 'Тренировка · 3 из 4', uz: 'Mashq · 4 dan 3', en: 'Practice · 3 of 4' },
    label: { ru: 'Округли число', uz: 'Sonni yaxlitlang', en: 'Round the number' },
    question: { ru: 'Округли диаметр Земли 12 742 до тысяч.', uz: 'Yer diametri 12 742 ni minglar xonasigacha yaxlitlang.', en: "Round the Earth's diameter, 12 742, to the nearest thousand." },
    opt0: { ru: '12 000', uz: '12 000', en: '12 000' },
    opt1: { ru: '12 700', uz: '12 700', en: '12 700' },
    opt2: { ru: '13 000', uz: '13 000', en: '13 000' },
    correctIndex: 2,
    correct_text: {
      ru: 'Правильно. В разряде сотен 7, это больше 5, поэтому округляем вверх до 13 000.',
      uz: "To'g'ri. Yuzlar xonasida 7, bu 5 dan katta, shuning uchun 13 000 gacha yuqoriga yaxlitlaymiz.",
      en: 'Correct. There is a 7 in the hundreds place, which is more than 5, so we round up to 13 000.'
    },
    wrong_0: {
      ru: 'Это вниз. Смотреть надо на сотни, а там 7 — это вверх, к 13 000.',
      uz: "Bu pastga. Yuzlarga qarash kerak, u yerda 7 — bu yuqoriga, 13 000 ga.",
      en: 'That is rounding down. You have to look at the hundreds, and there is a 7 there, so it rounds up, to 13 000.'
    },
    wrong_1: {
      ru: 'Это округление до сотен, а нужно до тысяч. До тысяч младшие разряды становятся нулями.',
      uz: "Bu yuzlar xonasigacha yaxlitlash, kerak esa minglar xonasigacha. Minglar xonasigacha kichik xonalar nolga aylanadi.",
      en: 'That is rounding to the nearest hundred, but you need the nearest thousand. For thousands the lower places become zeros.'
    },
    hint_0: { ru: 'Посмотри на разряд сотен, он подсказывает, в какую сторону округлять.', uz: "Yuzlar xonasiga qarang, u qaysi tomonga yaxlitlashni aytadi.", en: 'Look at the hundreds place, it tells you which way to round.' },
    hint_1: { ru: 'Тебя просили округлить до тысяч, а не до сотен. До какого разряда округляем?', uz: "Sendan minglar xonasigacha so'rashdi, yuzlar xonasigacha emas. Qaysi xonagacha yaxlitlaymiz?", en: 'You were asked to round to the nearest thousand, not the nearest hundred. Which place are we rounding to?' },
    audio: {
      intro: { ru: 'Округли диаметр Земли, двенадцать тысяч семьсот сорок два, до тысяч. Выбери ответ.', uz: "Yer diametrini, o'n ikki ming yetti yuz qirq ikkini, minglar xonasigacha yaxlitlang. Javobni tanlang.", en: "Round the Earth's diameter, twelve thousand seven hundred and forty two, to the nearest thousand. Choose an answer." },
      on_correct: { ru: 'Верно. В разряде сотен семь, это больше пяти, поэтому округляем вверх до тринадцати тысяч.', uz: "To'g'ri. Yuzlar xonasida yetti, bu beshdan katta, shuning uchun o'n uch minggacha yuqoriga yaxlitlaymiz.", en: 'That is right. There is a seven in the hundreds place, which is more than five, so we round up to thirteen thousand.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ─────────────────────── s8 · TEST input (серединный случай) ───────────────────────
  s9: {
    eyebrow: { ru: 'Тренировка · ввод', uz: 'Mashq · kiritish', en: 'Practice · typing' },
    label: { ru: 'Напиши сам', uz: "O'zingiz yozing", en: 'Write it yourself' },
    question: { ru: 'Округли диаметр Венеры 12 104 до тысяч. Введи ответ.', uz: "Venera diametri 12 104 ni minglar xonasigacha yaxlitlang. Javobni kiriting.", en: "Round Venus's diameter, 12 104, to the nearest thousand. Type the answer." },
    placeholder: { ru: '0', uz: '0', en: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
    correctValue: '12000',
    hint: { ru: 'Посмотри на разряд сотен, он решает, в какую сторону округлять. Округляем до тысяч.', uz: "Yuzlar xonasiga qarang, u qaysi tomonga yaxlitlashni hal qiladi. Minglar xonasigacha yaxlitlaymiz.", en: 'Look at the hundreds place, it decides which way to round. We are rounding to the nearest thousand.' },
    fb_correct: { ru: 'Правильно. В сотнях 1, это меньше 5 — округляем вниз, до 12 000.', uz: "To'g'ri. Yuzlarda 1, bu 5 dan kichik — pastga, 12 000 gacha yaxlitlaymiz.", en: 'Correct. There is a 1 in the hundreds, which is less than 5, so we round down, to 12 000.' },
    audio: {
      intro: { ru: 'Округли диаметр Венеры, двенадцать тысяч сто четыре, до тысяч. Введи ответ и нажми проверить.', uz: "Venera diametrini, o'n ikki ming bir yuz to'rtni, minglar xonasigacha yaxlitlang. Javobni kiriting va tekshirishni bosing.", en: "Round Venus's diameter, twelve thousand one hundred and four, to the nearest thousand. Type the answer and tap check." },
      on_correct: { ru: 'Верно. В разряде сотен один, это меньше пяти, округляем вниз до двенадцати тысяч.', uz: "To'g'ri. Yuzlar xonasida bir, bu beshdan kichik, o'n ikki minggacha pastga yaxlitlaymiz.", en: 'That is right. There is a one in the hundreds place, which is less than five, so we round down to twelve thousand.' },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: 'Unchalik emas. Maslahatga qarang.', en: 'Not quite. Look at the hint.' }
    }
  },
  s10: {
    eyebrow: { ru: 'Тренировка · 4 из 4', uz: 'Mashq · 4 dan 4', en: 'Practice · 4 of 4' },
    label: { ru: 'Округли число', uz: 'Sonni yaxlitlang', en: 'Round the number' },
    question: { ru: 'Спутник летит на высоте 750 км. Округли до сотен. Введи ответ.', uz: "Sun'iy yo'ldosh 750 km balandlikda uchadi. Yuzlar xonasigacha yaxlitlang. Javobni kiriting.", en: 'A satellite is flying at a height of 750 km. Round it to the nearest hundred. Type the answer.' },
    hint: { ru: 'Это число ровно посередине между 700 и 800. Куда округляют серединное число?', uz: "Bu son 700 bilan 800 ning aynan o'rtasida. O'rtadagi son qayoqqa yaxlitlanadi?", en: 'This number is exactly in the middle between 700 and 800. Which way is a middle number rounded?' },
    audio_hint: { ru: 'Это число ровно посередине между семьюстами и восемьюстами. Вспомни, куда округляют серединное.', uz: "Bu son yetti yuz bilan sakkiz yuzning aynan o'rtasida. O'rtadagi son qayoqqa yaxlitlanishini eslang.", en: 'This number is exactly in the middle between seven hundred and eight hundred. Remember which way a middle number is rounded.' },
    placeholder: { ru: '0', uz: '0', en: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
    correctValue: '800',
    fb_correct: {
      ru: 'Правильно. 750 стоит ровно между 700 и 800, поэтому берём большее — 800.',
      uz: "To'g'ri. 750 aynan 700 bilan 800 oralig'ida, shuning uchun kattasini — 800 ni olamiz.",
      en: 'Correct. 750 stands exactly between 700 and 800, so we take the bigger one, 800.'
    },
    fb_wrong: {
      ru: 'Здесь число ровно посередине. По правилу серединное число округляем вверх — до 800.',
      uz: "Bu yerda son aynan o'rtada. Qoidaga ko'ra o'rtadagi sonni yuqoriga — 800 ga yaxlitlaymiz.",
      en: 'This number is exactly in the middle. By the rule a middle number rounds up, to 800.'
    },
    audio: {
      intro: { ru: 'Спутник летит на высоте семьсот пятьдесят километров. Округли до сотен, введи ответ и нажми кнопку проверить.', uz: "Sun'iy yo'ldosh yetti yuz ellik kilometr balandlikda uchadi. Yuzlar xonasigacha yaxlitlang, javobni kiriting va tekshirish tugmasini bosing.", en: 'A satellite is flying at a height of seven hundred and fifty kilometres. Round it to the nearest hundred, type the answer and tap the check button.' },
      on_correct: { ru: 'Верно. Это ровно середина между семьюстами и восемьюстами. Серединное округляют к большему, к восьмистам.', uz: "To'g'ri. Bu yetti yuz bilan sakkiz yuzning aynan o'rtasi. O'rtadagi son kattaga yaxlitlanadi, sakkiz yuzga.", en: 'That is right. It is exactly the middle between seven hundred and eight hundred. A middle number rounds to the bigger one, to eight hundred.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ───────────────────────────── s9 · CASE setup ─────────────────────────────
  s11: {
    eyebrow: { ru: 'Случай из космоса', uz: 'Kosmik holat', en: 'A case from space' },
    title: { ru: 'Расставим планеты по росту', uz: "Sayyoralarni o'lchami bo'yicha tartiblaymiz", en: 'Let us line the planets up by size' },
    intro: {
      ru: 'Точные диаметры сравнивать трудно. Округлим их до круглых чисел — и сразу станет видно, кто больше.',
      uz: "Aniq diametrlarni taqqoslash qiyin. Ularni yaxlit sonlargacha yaxlitlaymiz — va kim katta ekani darrov ko'rinadi.",
      en: 'Exact diameters are hard to compare. Let us round them to round numbers and it will be clear at once which is bigger.'
    },
    fact_1: { ru: 'Марс — 6 779 км', uz: 'Mars — 6 779 km', en: 'Mars, 6 779 km' },
    fact_2: { ru: 'Земля — 12 742 км', uz: 'Yer — 12 742 km', en: 'The Earth, 12 742 km' },
    fact_3: { ru: 'Юпитер — 139 820 км', uz: 'Yupiter — 139 820 km', en: 'Jupiter, 139 820 km' },
    cta: { ru: 'Начать', uz: 'Boshlash', en: 'Start' },
    audio: {
      ru: 'У нас три планеты: Марс, Земля и Юпитер. Их точные диаметры сравнивать неудобно, поэтому сначала округлим каждый, а потом расставим планеты по размеру.',
      uz: "Bizda uchta sayyora bor: Mars, Yer va Yupiter. Ularning aniq diametrlarini taqqoslash noqulay, shuning uchun avval har birini yaxlitlaymiz, keyin sayyoralarni o'lchami bo'yicha tartiblaymiz.",
      en: 'We have three planets: Mars, the Earth and Jupiter. Their exact diameters are awkward to compare, so first we round each one and then line the planets up by size.'
    }
  },

  // ───────────────────────────── s10 · CASE step ─────────────────────────────
  s12: {
    eyebrow: { ru: 'Случай из космоса', uz: 'Kosmik holat', en: 'A case from space' },
    label: { ru: 'Округли диаметр', uz: 'Diametrni yaxlitlang', en: 'Round the diameter' },
    question: { ru: 'Округли диаметр Юпитера 139 820 до десятков тысяч.', uz: "Yupiter diametri 139 820 ni o'n minglar xonasigacha yaxlitlang.", en: "Round Jupiter's diameter, 139 820, to the nearest ten thousand." },
    opt0: { ru: '140 000', uz: '140 000', en: '140 000' },
    opt1: { ru: '130 000', uz: '130 000', en: '130 000' },
    opt2: { ru: '139 800', uz: '139 800', en: '139 800' },
    correctIndex: 0,
    correct_text: {
      ru: 'Правильно. В разряде тысяч 9, это больше 5, округляем вверх до 140 000.',
      uz: "To'g'ri. Minglar xonasida 9, bu 5 dan katta, 140 000 gacha yuqoriga yaxlitlaymiz.",
      en: 'Correct. There is a 9 in the thousands place, which is more than 5, so we round up to 140 000.'
    },
    wrong_1: {
      ru: 'Это вниз. В разряде тысяч 9, а это округление вверх — до 140 000.',
      uz: "Bu pastga. Minglar xonasida 9, bu esa yuqoriga — 140 000 gacha yaxlitlash.",
      en: 'That is rounding down. There is a 9 in the thousands place, so it rounds up, to 140 000.'
    },
    wrong_2: {
      ru: 'Это округление до сотен, а нужно до десятков тысяч. Младшие разряды становятся нулями.',
      uz: "Bu yuzlar xonasigacha yaxlitlash, kerak esa o'n minglar xonasigacha. Kichik xonalar nolga aylanadi.",
      en: 'That is rounding to the nearest hundred, but you need the nearest ten thousand. The lower places become zeros.'
    },
    hint_1: { ru: 'Посмотри на разряд тысяч в 139 820, он решает, вверх или вниз.', uz: "139 820 dagi minglar xonasiga qarang, u yuqorimi yoki pastmi hal qiladi.", en: 'Look at the thousands place in 139 820, it decides up or down.' },
    audio_hint_1: { ru: 'Посмотри на разряд тысяч в числе сто тридцать девять тысяч восемьсот двадцать. Он решает, вверх или вниз.', uz: "Bir yuz o'ttiz to'qqiz ming sakkiz yuz yigirma sonidagi minglar xonasiga qarang. U yuqorimi yoki pastmi hal qiladi.", en: 'Look at the thousands place in the number one hundred and thirty nine thousand eight hundred and twenty. It decides up or down.' },
    hint_2: { ru: 'Это округление до сотен. А просят до десятков тысяч, какой это разряд?', uz: "Bu yuzlar xonasigacha yaxlitlash. So'rashayotgani o'n minglar xonasigacha, bu qaysi xona?", en: 'That is rounding to the nearest hundred. But you are asked for the nearest ten thousand, so which place is that?' },
    audio: {
      intro: { ru: 'Округли диаметр Юпитера, сто тридцать девять тысяч восемьсот двадцать, до десятков тысяч. Выбери ответ.', uz: "Yupiter diametrini, bir yuz o'ttiz to'qqiz ming sakkiz yuz yigirmani, o'n minglar xonasigacha yaxlitlang. Javobni tanlang.", en: "Round Jupiter's diameter, one hundred and thirty nine thousand eight hundred and twenty, to the nearest ten thousand. Choose an answer." },
      on_correct: { ru: 'Верно. В разряде тысяч девять, это больше пяти, округляем вверх до ста сорока тысяч.', uz: "To'g'ri. Minglar xonasida to'qqiz, bu beshdan katta, bir yuz qirq minggacha yuqoriga yaxlitlaymiz.", en: 'That is right. There is a nine in the thousands place, which is more than five, so we round up to one hundred and forty thousand.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ───────────────────────────── s11 · CASE conclusion ─────────────────────────────
  s13: {
    eyebrow: { ru: 'Случай из космоса', uz: 'Kosmik holat', en: 'A case from space' },
    label: { ru: 'Расставь по размеру', uz: "O'lchami bo'yicha tartiblang", en: 'Line them up by size' },
    question: {
      ru: 'Округлили: Марс ≈ 7 000, Земля ≈ 13 000, Юпитер ≈ 140 000 км. Расставь от меньшей к большей.',
      uz: "Yaxlitladik: Mars ≈ 7 000, Yer ≈ 13 000, Yupiter ≈ 140 000 km. Kichikdan kattaga tartiblang.",
      en: 'Rounded: Mars ≈ 7 000, the Earth ≈ 13 000, Jupiter ≈ 140 000 km. Line them up from smallest to biggest.'
    },
    opt0: { ru: 'Юпитер, Земля, Марс', uz: 'Yupiter, Yer, Mars', en: 'Jupiter, the Earth, Mars' },
    opt1: { ru: 'Марс, Земля, Юпитер', uz: 'Mars, Yer, Yupiter', en: 'Mars, the Earth, Jupiter' },
    opt2: { ru: 'Земля, Марс, Юпитер', uz: 'Yer, Mars, Yupiter', en: 'The Earth, Mars, Jupiter' },
    correctIndex: 1,
    correct_text: {
      ru: 'Правильно. 7 000 меньше 13 000, а 13 000 меньше 140 000 — порядок от меньшей к большей.',
      uz: "To'g'ri. 7 000 — 13 000 dan kichik, 13 000 esa 140 000 dan kichik — kichikdan kattaga tartib.",
      en: 'Correct. 7 000 is less than 13 000 and 13 000 is less than 140 000, so that is the order from smallest to biggest.'
    },
    wrong_0: {
      ru: 'Это от большей к меньшей. Нас просили наоборот — от меньшей к большей.',
      uz: "Bu kattadan kichikka. Bizdan teskarisi — kichikdan kattaga so'ralgan.",
      en: 'That is from biggest to smallest. You were asked for the other way round, smallest to biggest.'
    },
    wrong_2: {
      ru: 'Марс 7 000 — самый маленький, он должен быть первым. Сравни округлённые числа по разрядам.',
      uz: "Mars 7 000 — eng kichigi, u birinchi bo'lishi kerak. Yaxlit sonlarni xonalar bo'yicha taqqoslang.",
      en: 'Mars at 7 000 is the smallest, so it should come first. Compare the rounded numbers place by place.'
    },
    hint_0: { ru: 'Нас просили от меньшей к большей. Сравни округлённые числа.', uz: "Bizdan kichikdan kattaga so'rashdi. Yaxlit sonlarni taqqoslang.", en: 'You were asked for smallest to biggest. Compare the rounded numbers.' },
    hint_2: { ru: 'Сравни округлённые: 7 000, 13 000, 140 000, какое меньше?', uz: "Yaxlit sonlarni taqqoslang: 7 000, 13 000, 140 000, qaysi biri kichik?", en: 'Compare the rounded numbers: 7 000, 13 000, 140 000. Which is smallest?' },
    audio_hint_2: { ru: 'Сравни округлённые: семь тысяч, тринадцать тысяч, сто сорок тысяч. Какое меньше?', uz: "Yaxlit sonlarni taqqoslang: yetti ming, o'n uch ming, bir yuz qirq ming. Qaysi biri kichik?", en: 'Compare the rounded numbers: seven thousand, thirteen thousand, one hundred and forty thousand. Which is smallest?' },
    audio: {
      intro: { ru: 'Округлённые диаметры: Марс около семи тысяч, Земля около тринадцати тысяч, Юпитер около ста сорока тысяч. Расставь планеты от меньшей к большей.', uz: "Yaxlit diametrlar: Mars yetti ming atrofida, Yer o'n uch ming atrofida, Yupiter bir yuz qirq ming atrofida. Sayyoralarni kichikdan kattaga tartiblang.", en: 'The rounded diameters are: Mars about seven thousand, the Earth about thirteen thousand, Jupiter about one hundred and forty thousand. Line the planets up from smallest to biggest.' },
      on_correct: { ru: 'Верно. Семь тысяч меньше тринадцати тысяч, а тринадцать тысяч меньше ста сорока тысяч. Порядок от меньшего к большему.', uz: "To'g'ri. Yetti ming o'n uch mingdan kichik, o'n uch ming esa bir yuz qirq mingdan kichik. Kichikdan kattaga tartib.", en: 'That is right. Seven thousand is less than thirteen thousand and thirteen thousand is less than one hundred and forty thousand. That is the order from smallest to biggest.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ─────────────────────── s12 · TEST choice · FINAL (сравнение) ───────────────────────
  s14: {
    eyebrow: { ru: 'Итог · 1 из 2', uz: 'Yakun · 2 dan 1', en: 'Final · 1 of 2' },
    label: { ru: 'Сравни числа', uz: 'Sonlarni taqqoslang', en: 'Compare the numbers' },
    question: { ru: 'Зонд показал два расстояния: 5 000 009 км и 5 000 010 км. Какое больше?', uz: "Zond ikki masofani ko'rsatdi: 5 000 009 km va 5 000 010 km. Qaysi biri katta?", en: 'The probe showed two distances: 5 000 009 km and 5 000 010 km. Which is bigger?' },
    opt0: { ru: '5 000 009 — в нём есть девятка', uz: "5 000 009 — unda to'qqiz bor", en: '5 000 009, it has a nine in it' },
    opt1: { ru: 'Они равны', uz: 'Ular teng', en: 'They are equal' },
    opt2: { ru: '5 000 010', uz: '5 000 010', en: '5 000 010' },
    correctIndex: 2,
    correct_text: {
      ru: 'Правильно. Старшие разряды совпадают, а в десятках у второго числа 1 против 0.',
      uz: "To'g'ri. Katta xonalar bir xil, o'nlarda esa ikkinchi sonda 0 ga qarshi 1 turibdi.",
      en: 'Correct. The higher places match, and in the tens the second number has a 1 against a 0.'
    },
    wrong_0: {
      ru: 'Девятка в единицах не делает число больше. Различие в десятках: 1 больше 0.',
      uz: "Birlardagi to'qqiz sonni katta qilmaydi. Farq o'nlarda: 1 — 0 dan katta.",
      en: 'A nine in the ones does not make a number bigger. The difference is in the tens: 1 is more than 0.'
    },
    wrong_1: {
      ru: 'Совпадение старших разрядов — не равенство. Идём дальше до первой разной цифры.',
      uz: "Katta xonalarning bir xilligi — tenglik emas. Birinchi farqli raqamgacha davom etamiz.",
      en: 'Matching higher places does not mean the numbers are equal. We carry on to the first digit that differs.'
    },
    hint_0: { ru: 'Старшие разряды совпадают, иди дальше, к младшим, до первой разной цифры.', uz: "Katta xonalar bir xil, kichigiga, birinchi farqli raqamgacha o't.", en: 'The higher places match, so carry on down to the first digit that differs.' },
    hint_1: { ru: 'Числа не равны. Найди первый разряд, где цифры отличаются.', uz: "Sonlar teng emas. Raqamlar farq qiladigan birinchi xonani toping.", en: 'The numbers are not equal. Find the first place where the digits differ.' },
    audio: {
      intro: { ru: 'Зонд показал два расстояния: пять миллионов девять и пять миллионов десять километров. Какое больше? Выбери ответ.', uz: "Zond ikki masofani ko'rsatdi: besh million to'qqiz va besh million o'n kilometr. Qaysi biri katta? Javobni tanlang.", en: 'The probe showed two distances: five million and nine, and five million and ten kilometres. Which is bigger? Choose an answer.' },
      on_correct: { ru: 'Верно. Старшие разряды совпадают, а в разряде десятков у второго числа один против нуля.', uz: "To'g'ri. Katta xonalar bir xil, o'nlar xonasida esa ikkinchi sonda nolga qarshi bir turibdi.", en: 'That is right. The higher places match, and in the tens place the second number has a one against a zero.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ─────────────────────── s13 · TEST choice · FINAL (переход через разряд) ───────────────────────
  s15: {
    eyebrow: { ru: 'Итог · 2 из 2', uz: 'Yakun · 2 dan 2', en: 'Final · 2 of 2' },
    label: { ru: 'Округли число', uz: 'Sonni yaxlitlang', en: 'Round the number' },
    question: { ru: 'Астероид пролетел в 9 859 км от станции. Округли до тысяч.', uz: "Asteroid stansiyadan 9 859 km uzoqlikda uchib o'tdi. Minglar xonasigacha yaxlitlang.", en: 'An asteroid passed 9 859 km from the station. Round it to the nearest thousand.' },
    opt0: { ru: '9 000', uz: '9 000', en: '9 000' },
    opt1: { ru: '9 800', uz: '9 800', en: '9 800' },
    opt2: { ru: '9 900', uz: '9 900', en: '9 900' },
    opt3: { ru: '10 000', uz: '10 000', en: '10 000' },
    correctIndex: 3,
    correct_text: {
      ru: 'Правильно. В сотнях 8, это вверх. 9 тысяч плюс одна дают ровно 10 000.',
      uz: "To'g'ri. Yuzlarda 8, bu yuqoriga. 9 ming va yana bir ming aynan 10 000 ni beradi.",
      en: 'Correct. There is an 8 in the hundreds, so it rounds up. 9 thousand plus one makes exactly 10 000.'
    },
    wrong_0: {
      ru: 'Это вниз. В сотнях 8 — это округление вверх, через разряд к 10 000.',
      uz: "Bu pastga. Yuzlarda 8 — bu yuqoriga, xonadan o'tib 10 000 ga yaxlitlash.",
      en: 'That is rounding down. There is an 8 in the hundreds, so it rounds up, carrying over to 10 000.'
    },
    wrong_1: {
      ru: 'Это округление до сотен, а нужно до тысяч. Округляя до тысяч, смотрим на сотни (8) и обнуляем младшие разряды.',
      uz: "Bu yuzlar xonasigacha yaxlitlash, kerak esa minglar xonasigacha. Minglar xonasigacha yaxlitlaganda yuzlarga (8) qaraymiz va kichik xonalarni nolga aylantiramiz.",
      en: 'That is rounding to the nearest hundred, but you need the nearest thousand. Rounding to thousands we look at the hundreds (8) and turn the lower places into zeros.'
    },
    wrong_2: {
      ru: 'Недостаточно. 9 тысяч округляются вверх до целых 10 000, а не до 9 900.',
      uz: "Yetarli emas. 9 ming yuqoriga to'liq 10 000 gacha yaxlitlanadi, 9 900 gacha emas.",
      en: 'Not enough. 9 thousand rounds up to a whole 10 000, not to 9 900.'
    },
    hint_0: { ru: 'Посмотри на сотни, это вверх или вниз?', uz: "Yuzlarga qarang, bu yuqorimi yoki pastmi?", en: 'Look at the hundreds. Is it up or down?' },
    hint_1: { ru: 'Это округление до сотен. А нужно до тысяч.', uz: "Bu yuzlar xonasigacha yaxlitlash. Kerak esa minglar xonasigacha.", en: 'That is rounding to the nearest hundred. You need the nearest thousand.' },
    hint_2: { ru: 'Округляем до тысяч, а не до сотен. Что станет с младшими разрядами?', uz: "Minglar xonasigacha yaxlitlaymiz, yuzlar xonasigacha emas. Kichik xonalar nima bo'ladi?", en: 'We are rounding to the nearest thousand, not the nearest hundred. What happens to the lower places?' },
    audio: {
      intro: { ru: 'Астероид пролетел в девяти тысячах восьмистах пятидесяти девяти километрах от станции. Округли до тысяч. Выбери ответ.', uz: "Asteroid stansiyadan to'qqiz ming sakkiz yuz ellik to'qqiz kilometr uzoqlikda uchib o'tdi. Minglar xonasigacha yaxlitlang. Javobni tanlang.", en: 'An asteroid passed nine thousand eight hundred and fifty nine kilometres from the station. Round it to the nearest thousand. Choose an answer.' },
      on_correct: { ru: 'Верно. В разряде сотен восемь, это вверх. Девять тысяч и ещё одна дают ровно десять тысяч.', uz: "To'g'ri. Yuzlar xonasida sakkiz, bu yuqoriga. To'qqiz ming va yana bir ming aynan o'n mingni beradi.", en: 'That is right. There is an eight in the hundreds place, so it rounds up. Nine thousand and one more makes exactly ten thousand.' },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.', en: 'Not quite. Look at the working.' }
    }
  },

  // ───────────────────────────── s14 · SUMMARY / ВЫВОД (кольцо) ─────────────────────────────
  s16: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni', en: 'The end of the lesson' },
    title: { ru: 'Что ты теперь умеешь', uz: 'Endi nimani bilasiz', en: 'What you can do now' },
    ring_back: {
      ru: 'Помнишь Марс и Землю? Бекзод ошибся: у Земли больше разрядов, поэтому 12 742 больше, чем 6 779.',
      uz: "Mars va Yer esingizdami? Bekzod xato qildi: Yerda xona ko'proq, shuning uchun 12 742 — 6 779 dan katta.",
      en: 'Remember Mars and the Earth? Bekzod was wrong: the Earth has more places, so 12 742 is bigger than 6 779.'
    },
    learned_1: {
      ru: 'Сравнивать большие числа по разрядам, а не по крупным цифрам.',
      uz: "Katta sonlarni yirik raqamlar bo'yicha emas, xonalar bo'yicha taqqoslash.",
      en: 'Compare big numbers by their places, not by big looking digits.'
    },
    learned_2: {
      ru: 'Округлять число до нужного разряда, выбирая ближайшее круглое на числовой оси.',
      uz: "Sonlar nuridagi eng yaqin yaxlit sonni tanlab, sonni kerakli xonagacha yaxlitlash.",
      en: 'Round a number to the place you need by choosing the nearest round number on the number line.'
    },
    why_heading: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why this is useful' },
    why_1: {
      ru: 'Сравнение и прикидка помогают понять масштаб: что больше и насколько примерно.',
      uz: 'Taqqoslash va chama miqyosni tushunishga yordam beradi: nima katta va taxminan qancha.',
      en: 'Comparing and estimating help you get a sense of scale: which is bigger and roughly by how much.'
    },
    why_2: {
      ru: 'Округление помогает проверить, разумный ли получился ответ в любой задаче.',
      uz: "Yaxlitlash istalgan masalada javob mantiqiymi yo'qmi, tekshirishga yordam beradi.",
      en: 'Rounding helps you check whether an answer is sensible in any problem.'
    },
    teaser: {
      ru: 'Дальше — сложение и вычитание столбиком, где прикидка проверит твой результат. А позже округление вернётся уже для десятичных дробей.',
      uz: "Keyin — ustun usulida qo'shish va ayirish, u yerda chama natijangizni tekshiradi. Keyinroq yaxlitlash o'nli kasrlar uchun qaytadi.",
      en: 'Next come adding and subtracting in columns, where estimating will check your result. And later rounding comes back for decimals.'
    },
    audio: {
      ru: [
        'Вернёмся к началу. Бекзод думал, что Марс больше Земли, но он ошибся: у Земли больше разрядов, поэтому двенадцать тысяч больше шести.',
        'Теперь ты умеешь сравнивать большие числа по разрядам и округлять их до нужного разряда на числовой оси.',
        'Это помогает понять масштаб, увидеть что больше и насколько примерно, и проверить, разумный ли вышел ответ.',
        'Дальше будет сложение и вычитание столбиком, где прикидка проверит результат. А позже округление вернётся для десятичных дробей.'
      ],
      uz: [
        "Boshiga qaytamiz. Bekzod Mars Yerdan katta deb o'yladi, lekin xato qildi: Yerda xona ko'proq, shuning uchun o'n ikki ming oltidan katta.",
        "Endi siz katta sonlarni xonalar bo'yicha taqqoslay olasiz va ularni sonlar nurida kerakli xonagacha yaxlitlay olasiz.",
        "Bu miqyosni tushunishga, nima katta va taxminan qancha ekanini ko'rishga, hamda javob mantiqiy chiqdimi tekshirishga yordam beradi.",
        "Keyin ustun usulida qo'shish va ayirish bo'ladi, u yerda chama natijani tekshiradi. Keyinroq yaxlitlash o'nli kasrlar uchun qaytadi."
      ],
      en: ['Let us go back to the start. Bekzod thought Mars was bigger than the Earth, but he was wrong: the Earth has more places, so twelve thousand is bigger than six.', 'Now you can compare big numbers by their places and round them to the place you need on the number line.', 'That helps you get a sense of scale, see which is bigger and roughly by how much, and check whether an answer came out sensible.', 'Next come adding and subtracting in columns, where estimating will check the result. And later rounding comes back for decimals.']
    }
  }
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ (nat_5_02 — keep-visible rebuild, Dars28 infra, 14 ekran)
// ============================================================
const LESSON_META = {
  lessonId: 'grade5-02',
  lessonTitle: { ru: 'Сравнение и округление больших чисел', uz: "Katta sonlarni taqqoslash va yaxlitlash", en: 'Comparing and rounding big numbers' }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        scored: false, scope: 'hook' },      // 0
  { id: 's1',  type: 'exploration', scored: false, scope: null },        // 1  разрядная таблица
  { id: 's2',  type: 'rule',        scored: false, scope: null },        // 2  правило сравнения
  { id: 's3',  type: 'test',        scored: true,  scope: 'practice' },   // 3  сравнение разной длины
  { id: 's4',  type: 'test',        scored: true,  scope: 'practice' },   // 4  сравнение равной длины
  { id: 's5',  type: 'exploration', scored: false, scope: null },        // 5  slider-ось
  { id: 's6',  type: 'rule',        scored: false, scope: null },        // 6  правило округления
  { id: 's7',  type: 'exploration', scored: false, scope: null },        // 7  округление по разрядам (tap)
  { id: 's8',  type: 'test',        scored: true,  scope: 'practice' },   // 8  SEQ округление (3 misol)
  { id: 's9',  type: 'case',        scored: false, scope: null },        // 9  case setup (планеты)
  { id: 's10', type: 'test',        scored: true,  scope: 'practice' },   // 10 SEQ случай+итог (4 misol)
  { id: 's11', type: 'test',        scored: true,  scope: 'practice' },   // 11 SEQ qiyin yaxlitlash 1 (3 misol)
  { id: 's12', type: 'test',        scored: true,  scope: 'final' },      // 12 SEQ qiyin yaxlitlash 2 (3 misol)
  { id: 's13', type: 'summary',     scored: false, scope: null }         // 13 итог
];
const TOTAL_SCREENS = SCREEN_META.length;

// ── Bloklar uchun o'ram matni (sarlavha/lead/yakun) ──
const W_ROUND = {
  eyebrow: { ru: 'Тренировка · округление', uz: 'Mashq · yaxlitlash', en: 'Practice · rounding' },
  title: { ru: 'Округли числа по очереди', uz: 'Sonlarni navbat bilan yaxlitlang', en: 'Round the numbers one after another' },
  lead: { ru: 'Реши три примера один за другим. Где написано — введи ответ сам.', uz: "Uch misolni birin-ketin yeching. Yozish kerak bo'lsa, javobni o'zingiz kiriting.", en: 'Work through three examples one after another. Where it says so, type the answer yourself.' },
  done_text: { ru: 'Все три числа округлены верно. Разряд решает, куда округлять.', uz: "Uchala son to'g'ri yaxlitlandi. Qaysi tomonga yaxlitlashni xona hal qiladi.", en: 'All three numbers are rounded correctly. The place decides which way to round.' }
};
const W_MIX = {
  eyebrow: { ru: 'Случай и итог', uz: 'Holat va yakun', en: 'The case and the finish' },
  title: { ru: 'Расставь планеты и проверь себя', uz: "Sayyoralarni tartiblang va o'zingizni tekshiring", en: 'Line the planets up and check yourself' },
  lead: { ru: 'Четыре задания подряд: округление, порядок и сравнение.', uz: "To'rt topshiriq ketma-ket: yaxlitlash, tartib va taqqoslash.", en: 'Four tasks in a row: rounding, order and comparing.' },
  done_text: { ru: 'Готово. Ты округлил, расставил по размеру и сравнил близкие числа.', uz: "Tayyor. Yaxlitladingiz, o'lchami bo'yicha tartibladingiz va yaqin sonlarni taqqosladingiz.", en: 'Done. You rounded, lined them up by size and compared close numbers.' }
};
const W_HARD1 = {
  eyebrow: { ru: 'Сложные примеры · 1', uz: 'Qiyin misollar · 1', en: 'Harder examples · 1' },
  title: { ru: 'Округление с переносом', uz: "Ko'tarish bilan yaxlitlash", en: 'Rounding with a carry' },
  lead: { ru: 'Здесь округление поднимает соседний разряд. Реши по очереди.', uz: "Bu yerda yaxlitlash qo'shni xonani ko'taradi. Navbat bilan yeching.", en: 'Here rounding pushes the next place up. Work through them one at a time.' },
  done_text: { ru: 'Отлично. Когда цифра 5 или больше, перенос может дойти до старшего класса.', uz: "Zo'r. Raqam 5 yoki katta bo'lsa, ko'tarish katta sinfgacha yetishi mumkin.", en: 'Excellent. When the digit is 5 or more, the carry can reach all the way to a higher group.' }
};
const W_HARD2 = {
  eyebrow: { ru: 'Сложные примеры · 2', uz: 'Qiyin misollar · 2', en: 'Harder examples · 2' },
  title: { ru: 'Середина и цепной перенос', uz: "O'rta holat va zanjirli ko'tarish", en: 'The middle and a chain of carries' },
  lead: { ru: 'Серединное число округляем вверх, а перенос идёт цепочкой. Реши все три.', uz: "O'rtadagi sonni yuqoriga yaxlitlaymiz, ko'tarish esa zanjir bo'lib boradi. Uchalasini yeching.", en: 'A middle number rounds up and the carry runs in a chain. Work through all three.' },
  done_text: { ru: 'Ты справился со сложными случаями округления — переносом и серединой.', uz: "Yaxlitlashning qiyin holatlarini — ko'tarish va o'rtani — uddaladingiz.", en: 'You managed the harder cases of rounding, the carry and the middle.' }
};

// ── Yangi qiyin misollar (draft, RU+UZ, TTS-toza) ──
const HARD1_ITEMS = [
  { type: 'mc', correct: 1, optKeys: ['opt0', 'opt1', 'opt2'], order: [1, 0, 2], c: {
    question: { ru: 'Округли 2 999 500 до тысяч.', uz: "2 999 500 ni minglar xonasigacha yaxlitlang.", en: 'Round 2 999 500 to the nearest thousand.' },
    opt0: { ru: '2 999 000', uz: '2 999 000', en: '2 999 000' }, opt1: { ru: '3 000 000', uz: '3 000 000', en: '3 000 000' }, opt2: { ru: '2 990 000', uz: '2 990 000', en: '2 990 000' },
    hint_0: { ru: 'В разряде сотен 5, округляем вверх, а перенос идёт дальше.', uz: "Yuzlar xonasida 5, yuqoriga yaxlitlaymiz, ko'tarish davom etadi.", en: 'There is a 5 in the hundreds place, so we round up and the carry runs on.' },
    hint_2: { ru: 'Смотри на сотни, а не на десятки тысяч.', uz: "O'n minglarga emas, yuzlarga qarang.", en: 'Look at the hundreds, not at the ten thousands.' },
    audio: { intro: { ru: 'Округли два миллиона девятьсот девяносто девять тысяч пятьсот до тысяч.', uz: "Ikki million to'qqiz yuz to'qson to'qqiz ming besh yuzni minglar xonasigacha yaxlitlang.", en: 'Round two million nine hundred and ninety nine thousand five hundred to the nearest thousand.' },
      on_correct: { ru: 'Верно. В сотнях пять, округляем вверх, перенос проходит через все девятки и даёт три миллиона.', uz: "To'g'ri. Yuzlarda besh, yuqoriga yaxlitlaymiz, ko'tarish hamma to'qqizlardan o'tib uch million beradi.", en: 'That is right. There is a five in the hundreds, so we round up, the carry runs through all the nines and gives three million.' },
      on_wrong: { ru: 'Посмотри на разряд сотен.', uz: "Yuzlar xonasiga qarang.", en: 'Look at the hundreds place.' } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [2, 0, 1], c: {
    question: { ru: 'Округли 149 600 000 до миллионов.', uz: "149 600 000 ni millionlar xonasigacha yaxlitlang.", en: 'Round 149 600 000 to the nearest million.' },
    opt0: { ru: '150 000 000', uz: '150 000 000', en: '150 000 000' }, opt1: { ru: '149 000 000', uz: '149 000 000', en: '149 000 000' }, opt2: { ru: '140 000 000', uz: '140 000 000', en: '140 000 000' },
    hint_1: { ru: 'Смотри на разряд сотен тысяч: там 6, это вверх.', uz: "Yuz minglar xonasiga qarang: u yerda 6, bu yuqoriga.", en: 'Look at the hundred thousands place: there is a 6 there, so it rounds up.' },
    hint_2: { ru: 'Это округление до десятков миллионов. А нужно до миллионов.', uz: "Bu o'n millionlargacha yaxlitlash. Kerak esa millionlargacha.", en: 'That is rounding to the nearest ten million. You need the nearest million.' },
    audio: { intro: { ru: 'Округли сто сорок девять миллионов шестьсот тысяч до миллионов.', uz: "Bir yuz qirq to'qqiz million olti yuz mingni millionlar xonasigacha yaxlitlang.", en: 'Round one hundred and forty nine million six hundred thousand to the nearest million.' },
      on_correct: { ru: 'Верно. В разряде сотен тысяч шесть, это больше пяти, округляем вверх до ста пятидесяти миллионов.', uz: "To'g'ri. Yuz minglar xonasida olti, bu beshdan katta, bir yuz ellik milliongacha yuqoriga yaxlitlaymiz.", en: 'That is right. There is a six in the hundred thousands place, which is more than five, so we round up to one hundred and fifty million.' },
      on_wrong: { ru: 'Найди разряд после миллионов.', uz: "Millionlardan keyingi xonani toping.", en: 'Find the place after the millions.' } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [1, 2, 0], c: {
    question: { ru: 'Округли 45 678 до тысяч.', uz: "45 678 ni minglar xonasigacha yaxlitlang.", en: 'Round 45 678 to the nearest thousand.' },
    opt0: { ru: '46 000', uz: '46 000', en: '46 000' }, opt1: { ru: '45 000', uz: '45 000', en: '45 000' }, opt2: { ru: '45 700', uz: '45 700', en: '45 700' },
    hint_1: { ru: 'В сотнях 6, это больше пяти, значит вверх.', uz: "Yuzlarda 6, bu beshdan katta, demak yuqoriga.", en: 'There is a 6 in the hundreds, which is more than five, so it rounds up.' },
    hint_2: { ru: 'Это округление до сотен, а нужно до тысяч.', uz: "Bu yuzlargacha yaxlitlash, kerak esa minglargacha.", en: 'That is rounding to the nearest hundred, but you need the nearest thousand.' },
    audio: { intro: { ru: 'Округли сорок пять тысяч шестьсот семьдесят восемь до тысяч.', uz: "Qirq besh ming olti yuz yetmish sakkizni minglar xonasigacha yaxlitlang.", en: 'Round forty five thousand six hundred and seventy eight to the nearest thousand.' },
      on_correct: { ru: 'Верно. В сотнях шесть, округляем вверх до сорока шести тысяч.', uz: "To'g'ri. Yuzlarda olti, qirq olti minggacha yuqoriga yaxlitlaymiz.", en: 'That is right. There is a six in the hundreds, so we round up to forty six thousand.' },
      on_wrong: { ru: 'Посмотри на сотни.', uz: "Yuzlarga qarang.", en: 'Look at the hundreds.' } } } }
];
const HARD2_ITEMS = [
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [2, 1, 0], c: {
    question: { ru: 'Округли 8 500 до тысяч.', uz: "8 500 ni minglar xonasigacha yaxlitlang.", en: 'Round 8 500 to the nearest thousand.' },
    opt0: { ru: '9 000', uz: '9 000', en: '9 000' }, opt1: { ru: '8 000', uz: '8 000', en: '8 000' }, opt2: { ru: '8 500', uz: '8 500', en: '8 500' },
    hint_1: { ru: 'Это ровно середина. Серединное число округляют вверх.', uz: "Bu aynan o'rta. O'rtadagi son yuqoriga yaxlitlanadi.", en: 'This is exactly the middle. A middle number rounds up.' },
    hint_2: { ru: 'Округление убирает младшие разряды, они становятся нулями.', uz: "Yaxlitlash kichik xonalarni olib tashlaydi, ular nolga aylanadi.", en: 'Rounding clears the lower places and they become zeros.' },
    audio: { intro: { ru: 'Округли восемь тысяч пятьсот до тысяч.', uz: "Sakkiz ming besh yuzni minglar xonasigacha yaxlitlang.", en: 'Round eight thousand five hundred to the nearest thousand.' },
      on_correct: { ru: 'Верно. Это ровно посередине, серединное округляем вверх, до девяти тысяч.', uz: "To'g'ri. Bu aynan o'rtada, o'rtadagini yuqoriga, to'qqiz minggacha yaxlitlaymiz.", en: 'That is right. It is exactly in the middle, and a middle number rounds up, to nine thousand.' },
      on_wrong: { ru: 'Вспомни правило про середину.', uz: "O'rta haqidagi qoidani eslang.", en: 'Remember the rule about the middle.' } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [1, 0, 2], c: {
    question: { ru: 'Округли 199 950 до сотен.', uz: "199 950 ni yuzlar xonasigacha yaxlitlang.", en: 'Round 199 950 to the nearest hundred.' },
    opt0: { ru: '200 000', uz: '200 000', en: '200 000' }, opt1: { ru: '199 900', uz: '199 900', en: '199 900' }, opt2: { ru: '199 000', uz: '199 000', en: '199 000' },
    hint_1: { ru: 'В десятках 5, это вверх. Перенос пройдёт цепочкой через девятки.', uz: "O'nlarda 5, yuqoriga. Ko'tarish to'qqizlar orqali zanjir bo'lib o'tadi.", en: 'There is a 5 in the tens, so it rounds up. The carry will run in a chain through the nines.' },
    hint_2: { ru: 'Это округление до тысяч, а нужно до сотен.', uz: "Bu minglargacha yaxlitlash, kerak esa yuzlargacha.", en: 'That is rounding to the nearest thousand, but you need the nearest hundred.' },
    audio: { intro: { ru: 'Округли сто девяносто девять тысяч девятьсот пятьдесят до сотен.', uz: "Bir yuz to'qson to'qqiz ming to'qqiz yuz ellikni yuzlar xonasigacha yaxlitlang.", en: 'Round one hundred and ninety nine thousand nine hundred and fifty to the nearest hundred.' },
      on_correct: { ru: 'Верно. В десятках пять, округляем вверх, и цепной перенос даёт двести тысяч.', uz: "To'g'ri. O'nlarda besh, yuqoriga yaxlitlaymiz, zanjirli ko'tarish ikki yuz ming beradi.", en: 'That is right. There is a five in the tens, so we round up, and the chain of carries gives two hundred thousand.' },
      on_wrong: { ru: 'Посмотри на разряд десятков.', uz: "O'nlar xonasiga qarang.", en: 'Look at the tens place.' } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [2, 0, 1], c: {
    question: { ru: 'Округли 6 449 до сотен.', uz: "6 449 ni yuzlar xonasigacha yaxlitlang.", en: 'Round 6 449 to the nearest hundred.' },
    opt0: { ru: '6 400', uz: '6 400', en: '6 400' }, opt1: { ru: '6 500', uz: '6 500', en: '6 500' }, opt2: { ru: '6 000', uz: '6 000', en: '6 000' },
    hint_1: { ru: 'Смотри на десятки: там 4, это меньше пяти, значит вниз.', uz: "O'nlarga qarang: u yerda 4, bu beshdan kichik, demak pastga.", en: 'Look at the tens: there is a 4 there, which is less than five, so it rounds down.' },
    hint_2: { ru: 'Это округление до тысяч, а нужно до сотен.', uz: "Bu minglargacha yaxlitlash, kerak esa yuzlargacha.", en: 'That is rounding to the nearest thousand, but you need the nearest hundred.' },
    audio: { intro: { ru: 'Округли шесть тысяч четыреста сорок девять до сотен.', uz: "Olti ming to'rt yuz qirq to'qqizni yuzlar xonasigacha yaxlitlang.", en: 'Round six thousand four hundred and forty nine to the nearest hundred.' },
      on_correct: { ru: 'Верно. В десятках четыре, это меньше пяти, округляем вниз до шести тысяч четырёхсот.', uz: "To'g'ri. O'nlarda to'rt, bu beshdan kichik, olti ming to'rt yuzgacha pastga yaxlitlaymiz.", en: 'That is right. There is a four in the tens, which is less than five, so we round down to six thousand four hundred.' },
      on_wrong: { ru: 'Посмотри на десятки.', uz: "O'nlarga qarang.", en: 'Look at the tens.' } } } }
];

// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Floaters = () => (<div className="amb" aria-hidden="true"><span className="amb-o amb-o1"/><span className="amb-o amb-o2"/><span className="amb-o amb-o3"/></div>);
const HintBlock = ({ show, children }) => {
  const lang = useLang();
  if (!show) return null;
  return (
    <div className="frame-tip fade-up" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
      <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : lang === 'en' ? "Hint" : 'Подсказка'}</p>
      <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
    </div>
  );
};
// Taqqoslanayotgan sonlar — katta, markazda, urg'uli (slayd 3 aksenti).
// to'g'ri javobdan keyin "?" mos belgiga (< / > / =) animatsiya bilan o'zgaradi.
const CompareFigure = ({ a, b, solved }) => {
  const na = Number(String(a).replace(/\s/g, ''));
  const nb = Number(String(b).replace(/\s/g, ''));
  const sign = na < nb ? '<' : na > nb ? '>' : '=';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(14px, 5vw, 40px)', flexWrap: 'wrap' }}>
      <span className="display" style={{ fontSize: 'clamp(28px, 7vw, 48px)', color: T.ink, letterSpacing: '0.02em' }}>{a}</span>
      <span
        key={solved ? 'sign' : 'q'}
        className={`mono compare-sign${solved ? ' revealed' : ''}`}
        style={{ fontSize: 'clamp(26px, 5.5vw, 40px)', color: solved ? T.success : T.accent, fontWeight: 700, minWidth: '0.7em', textAlign: 'center', display: 'inline-block' }}
      >
        {solved ? sign : '?'}
      </span>
      <span className="display" style={{ fontSize: 'clamp(28px, 7vw, 48px)', color: T.ink, letterSpacing: '0.02em' }}>{b}</span>
    </div>
  );
};

// MC ekran (keep-visible infra QuestionScreen + shuffleMC), ixtiyoriy figura.
const mcOf = (props, c, optKeys, correctIndex, order, figure) => {
  const t = props.t;
  const base = optKeys.map(k => t(c[k]));
  const { options, correctIdx, content } = shuffleMC(c, base, correctIndex, order);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// ============================================================
// SeqSolve — ketma-ket misollar bitta ekranda (tap MC + o'zi yozish aralash).
// Веди-до-верного, javob berilgani ✓ qatorga buklanadi, mobil-do'st, scrollsiz.
// ============================================================
const SeqSolve = ({ screen, totalScreens, screenContent, items, scope, storedAnswer, onAnswer, onNext, onPrev }) => {
  const w = screenContent; const t = useT(); const lang = useLang();
  const n = items.length;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: `s${screen}_i0`, text: items[0].c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [results, setResults] = useState(() => (wasSolved ? items.map(() => true) : []));
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [picked, setPicked] = useState(null);
  const [value, setValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [lastWrong, setLastWrong] = useState(null);
  const wrongRef = useRef(false);
  const advancedRef = useRef(wasSolved);
  const done = idx >= n;
  const cur = done ? null : items[idx];
  const sh = (cur && cur.type === 'mc') ? shuffleMC(cur.c, cur.optKeys.map(k => t(cur.c[k])), cur.correct, cur.order || cur.optKeys.map((_, i) => i)) : null;
  const speak = (txt) => { if (txt && !audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };

  const advance = (firstTry) => {
    const nr = [...results]; nr[idx] = firstTry;
    const ni = idx + 1;
    setResults(nr); setWrongSet(new Set()); setPicked(null); setValue(''); setShowHint(false); setLastWrong(null); wrongRef.current = false;
    setIdx(ni);
    if (ni >= n) {
      const allOk = nr.every(Boolean);
      onAnswer({ stage: scope, screenIdx: screen, correctAnswer: 'seq', studentAnswer: JSON.stringify(nr), correct: allOk, firstTry: allOk, solved: true });
      speak(w.done_text[lang]);
    } else {
      speak(items[ni].c.audio.intro[lang]);
    }
  };

  const pickMC = (i) => {
    if (done || wrongSet.has(i) || picked !== null) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (i === sh.correctIdx) {
      setPicked(i);
      speak(cur.c.audio.on_correct && cur.c.audio.on_correct[lang]);
      const ft = !wrongRef.current;
      setTimeout(() => advance(ft), 700);
    } else {
      wrongRef.current = true;
      setWrongSet(prev => { const s = new Set(prev); s.add(i); return s; });
      setLastWrong(i);
      setShowHint(true);
      speak((sh.content[`hint_${i}`] && sh.content[`hint_${i}`][lang]) || (cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]));
    }
  };
  const submitInput = () => {
    if (done) return;
    const v = String(value).replace(/[^0-9]/g, ''); if (!v) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    const ok = parseInt(v, 10) === parseInt(String(cur.answer).replace(/\s/g, ''), 10);
    if (ok) {
      setPicked(0);
      speak(cur.c.audio.on_correct && cur.c.audio.on_correct[lang]);
      const ft = !wrongRef.current;
      setTimeout(() => advance(ft), 700);
    } else {
      wrongRef.current = true; setShowHint(true);
      speak((cur.c.hint && cur.c.hint[lang]) || (cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]));
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={w.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ margin: 0 }}>{t(w.title)}</h2>
          {!done && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(w.lead)}</p>}
        </div>
        {/* progress nuqtalar */}
        <div className="fade-up" style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {items.map((_, k) => (<span key={k} style={{ width: 9, height: 9, borderRadius: '50%', background: k < idx ? T.success : (k === idx ? T.accent : `${T.ink3}55`), transition: 'background 0.3s' }}/>))}
          <span className="small mono" style={{ marginLeft: 6, color: T.ink3 }}>{Math.min(idx + (done ? 0 : 1), n)} / {n}</span>
        </div>
        {/* javob berilgan misollar — ixcham yashil qator */}
        {results.length > 0 && results.slice(0, idx).map((ft, k) => (
          <div key={k} className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'clamp(9px, 1.6vw, 12px) clamp(12px, 2vw, 16px)' }}>
            <span className="mono small" style={{ color: T.success, fontWeight: 700 }} aria-hidden="true">✓</span>
            <span className="small" style={{ color: T.ink2 }}>{(lang === 'uz' ? 'Misol ' : lang === 'en' ? "Example " : 'Пример ') + (k + 1) + (lang === 'uz' ? " — to'g'ri" : lang === 'en' ? " — correct" : ' — верно')}</span>
          </div>
        ))}
        {/* joriy misol */}
        {cur && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }} key={idx}>
            <h3 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.c.question))}</h3>
            {cur.type === 'mc' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {sh.options.map((opt, i) => {
                  const isWrong = wrongSet.has(i);
                  const isC = picked !== null && i === sh.correctIdx;
                  let cls = 'option'; if (isC) cls += ' option-correct'; else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={picked !== null || isWrong} onClick={() => pickMC(i)} style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(12px, 2vw, 16px)', minHeight: 'clamp(50px, 7vw, 60px)', fontSize: 'clamp(14px, 1.8vw, 16px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="mono small" style={{ minWidth: 18, color: isC ? T.success : (isWrong ? T.accent : T.ink3) }}>{isC ? '✓' : (isWrong ? '✗' : String.fromCharCode(65 + i))}</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {cur.type === 'input' && (
              <>
                <div className="frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 16px)', flexWrap: 'wrap' }}>
                  <span className="display" style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{cur.base}</span>
                  <Op size="mid">{'≈'}</Op>
                  <input type="text" inputMode="numeric" className={`answer-input ${picked !== null ? 'correct' : (showHint ? 'wrong' : '')}`} value={value} placeholder={lang === 'uz' ? '0' : '0'} onChange={e => { if (picked === null) { setValue(e.target.value); setShowHint(false); } }} disabled={picked !== null} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(110px, 26vw, 150px)' }}/>
                </div>
                {picked === null && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-white-accent" disabled={!value} onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : lang === 'en' ? "Check" : 'Проверить'}</button>
                  </div>
                )}
              </>
            )}
            <HintBlock show={showHint && picked === null}>{t(cur.type === 'mc' ? ((lastWrong !== null && sh.content[`hint_${lastWrong}`]) || cur.c.audio.on_wrong) : (cur.c.hint || cur.c.audio.on_wrong))}</HintBlock>
          </div>
        )}
        {/* blok yakuni */}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? 'Tayyor' : lang === 'en' ? "Done" : 'Готово'}</p>
            <p className="body" style={{ margin: 0 }}>{t(w.done_text)}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// ============================================================
const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const startedRef = useRef(false);
  useEffect(() => {
    if (audio.muted) { setShowOptions(true); return; }
    if (audio.isPlaying) startedRef.current = true;
    if (startedRef.current && !audio.isPlaying) setShowOptions(true);
  }, [audio.isPlaying, audio.muted]);
  useEffect(() => {
    const words = (c.audio.intro[lang] || '').trim().split(/\s+/).filter(Boolean).length;
    const ms = Math.max(4000, Math.min(Math.round(words / 2.3 * 1000) + 1500, 16000));
    const tmr = setTimeout(() => setShowOptions(true), ms);
    return () => clearTimeout(tmr);
  }, [lang]);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: v, correct: true }); audio.triggerEvent('option_picked'); setTimeout(onNext, 300); };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.accent }}>{t(c.eyebrow)}</p>
        <h1 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.global_q)}</h1>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, maxHeight: showOptions ? 0 : 200, opacity: showOptions ? 0 : 1, marginBottom: showOptions ? 'calc(-1 * clamp(14px, 2.4vw, 20px))' : 0, overflow: 'hidden', transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1), max-height 0.6s cubic-bezier(0.4,0,0.2,1), margin-bottom 0.6s cubic-bezier(0.4,0,0.2,1)' }}>{t(c.claim_lead)} <span className="italic" style={{ color: T.accent }}>{t(c.claim_em)}</span></p>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(24px, 8vw, 64px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="planet pulse" style={{ width: 'clamp(44px, 11vw, 64px)', height: 'clamp(44px, 11vw, 64px)', background: 'linear-gradient(135deg, #C75B39, #8f3a20)' }}/>
            <span className="mono small" style={{ color: T.ink2 }}>{t(c.planet_mars)}</span>
            <span className="display" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: T.accent }}>6 779</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="planet pulse pulse-slow" style={{ width: 'clamp(74px, 18vw, 104px)', height: 'clamp(74px, 18vw, 104px)', background: 'linear-gradient(135deg, #2E7DBE, #1F9A6B)' }}/>
            <span className="mono small" style={{ color: T.ink2 }}>{t(c.planet_earth)}</span>
            <span className="display" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>12 742</span>
          </div>
        </div>
        <h2 className="title h-sub fade-up delay-3" style={{ position: 'relative', margin: 0 }}>{t(c.question)}</h2>
        {showOptions && (
          <div className="fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ id: 'yes', label: c.opt_yes }, { id: 'no', label: c.opt_no }, { id: 'idk', label: c.opt_idk }].map(o => (
              <button key={o.id} className="option" disabled={picked !== null} onClick={() => pick(o.id)} style={{ padding: 'clamp(14px, 2vw, 15px) clamp(16px, 2.5vw, 20px)', fontSize: 'clamp(15px, 1.9vw, 15px)' }}>{t(o.label)}</button>
            ))}
          </div>
        )}
      </div>
    </Stage>
  );
};

const Screen1 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s1; const t = useT(); const lang = useLang();
  const lines = c.audio[lang]; const last = lines.length - 1;
  const audio = useAudio([{ id: 's1_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const [step, setStep] = useState(0);
  const speak = (txt) => { if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); speak(lines[ns]); } else { onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : <NextLabel/>} onClick={handleStep}/></>);
  const cellBase = { width: 'clamp(36px, 7.5vw, 52px)', height: 'clamp(42px, 8.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 4vw, 28px)', borderRadius: 10, background: T.paper, boxShadow: `0 3px 9px -4px rgba(${T.shadowBase}, 0.16)` };
  const ghost = { ...cellBase, background: 'transparent', boxShadow: 'none' };
  const renderRow = (digits, hiFirst) => (
    <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)' }}>
      {digits.map((dg, i) => {
        if (dg === '') return <div key={i} style={ghost}/>;
        const hi = hiFirst && i === 0;
        return <div key={i} className="cell-anim" style={{ ...cellBase, animationDelay: `${(digits.length - 1 - i) * 0.08}s`, background: hi ? T.accentSoft : T.paper, color: hi ? T.accent : T.ink, fontWeight: hi ? 700 : 400 }}>{dg}</div>;
      })}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="fade-up delay-2">
          <p className="mono small" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.step1_label)}</p>
          {renderRow(['', '6', '7', '7', '9'], false)}
          <p className="small" style={{ color: T.ink3, marginTop: 8 }}>{t(c.step1_text)}</p>
        </div>
        {step >= 1 && (<div className="fade-up">
          <p className="mono small" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.step2_label)}</p>
          {renderRow(['1', '2', '7', '4', '2'], true)}
          <p className="small" style={{ color: T.ink3, marginTop: 8 }}>{t(c.step2_text)}</p>
        </div>)}
        {step >= 2 && (<div className="fade-up frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.step3_label)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.step3_text)}</p>
        </div>)}
      </div>
    </Stage>
  );
};

// s2 — qoida (taqqoslash) + AKSENT: misol sonlari katta, markazda
const Screen2 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s2; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's2_a', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 20px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[c.rule_1, c.rule_2].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'start' }}>
              <span className="mono small" style={{ color: T.accent, fontWeight: 600 }}>{i + 1}</span>
              <p className="body" style={{ margin: 0 }}>{t(r)}</p>
            </div>
          ))}
        </div>
        {/* AKSENT: katta markazlashtirilgan taqqoslash misollari */}
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 18px)', alignItems: 'center' }}>
          <CompareFigure a="4 879" b="139 820"/>
          <CompareFigure a="50 724" b="49 244"/>
        </div>
      </div>
    </Stage>
  );
};

const Screen3 = (props) => mcOf({ ...props, t: useT() }, CONTENT.s3, ['opt0', 'opt1', 'opt2'], 0, [1, 2, 0], (solved) => <CompareFigure a="4 879" b="139 820" solved={solved}/>);
const Screen4 = (props) => mcOf({ ...props, t: useT() }, CONTENT.s4, ['opt0', 'opt1', 'opt2'], 1, [1, 0, 2], (solved) => <CompareFigure a="49 244" b="50 724" solved={solved}/>);

// s5 — округление на оси (slider, без скролла)
const Screen5 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s5; const t = useT(); const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's5_a0', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const MIN = 12000, MAX = 13000, MID = 12500;
  const [value, setValue] = useState(12742);
  const [checked, setChecked] = useState(false);
  const playedRef = useRef(false);
  const dLeft = value - MIN, dRight = MAX - value, nearer = value < MID ? MIN : MAX;
  const handleChange = (v) => { setValue(v); if (checked) setChecked(false); if (!playedRef.current && !audio.muted) { playedRef.current = true; const e = getAudioEngine(); if (e && lines[1]) e.pushOneOff(lines[1]); } };
  const handleCheck = () => { setChecked(true); audio.triggerEvent('check_pressed'); };
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!checked} label={<NextLabel/>} onClick={onNext}/></>);
  const barRow = (labelNode, dist, isNear, tagNode) => (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
      <span className="mono small" style={{ color: isNear ? T.accent : T.ink3, fontWeight: isNear ? 700 : 400, minWidth: 'clamp(48px, 12vw, 64px)' }}>{labelNode}</span>
      <div style={{ flex: 1, height: 10, background: `${T.ink3}33`, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(dist / 1000) * 100}%`, background: isNear ? T.accent : T.ink3, borderRadius: 99, transition: 'width 0.2s ease-out' }}/>
      </div>
      <span className="mono small" style={{ color: isNear ? T.accent : T.ink2, minWidth: 38, textAlign: 'right' }}>{dist}</span>
      <span style={{ minWidth: 'clamp(56px, 16vw, 76px)', display: 'flex', justifyContent: 'flex-start' }}>
        {isNear && (
          <span key={`near-${nearer}`} className="near-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 9px', borderRadius: 99, background: `${T.accent}1A`, color: T.accent, fontWeight: 700, fontSize: 'clamp(9px, 1.4vw, 11px)', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
            <span aria-hidden="true">←</span>{tagNode}
          </span>
        )}
      </span>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="frame fade-up delay-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '44%' }}>
              <span className="mono small" style={{ color: nearer === MIN ? T.accent : T.ink3, fontWeight: nearer === MIN ? 700 : 400 }}>{t(c.axis_left)}</span>
              <span className="small" style={{ color: T.ink3, fontSize: 'clamp(10px, 1.3vw, 11px)', lineHeight: 1.2, marginTop: 2 }}>{t(c.axis_left_note)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '44%', textAlign: 'right' }}>
              <span className="mono small" style={{ color: nearer === MAX ? T.accent : T.ink3, fontWeight: nearer === MAX ? 700 : 400 }}>{t(c.axis_right)}</span>
              <span className="small" style={{ color: T.ink3, fontSize: 'clamp(10px, 1.3vw, 11px)', lineHeight: 1.2, marginTop: 2 }}>{t(c.axis_right_note)}</span>
            </div>
          </div>
          <div style={{ position: 'relative', height: 30, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: `${T.ink3}55`, borderRadius: 99 }}/>
            <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 24, height: 24, borderRadius: '50%', background: 'radial-gradient(circle at 32% 30%, #5BB0E8, #1F6FB0 72%)', boxShadow: '0 0 12px 0 rgba(1,154,203,0.55), inset -3px -3px 6px rgba(0,0,0,0.25)' }}/>
            <div className="display" style={{ position: 'absolute', left: `${pct}%`, top: -26, transform: 'translateX(-50%)', fontSize: 'clamp(15px, 2.4vw, 19px)', color: T.ink, whiteSpace: 'nowrap' }}>{value}</div>
          </div>
          <Slider value={value} min={MIN} max={MAX} step={1} onChange={handleChange}/>
          <p className="mono" style={{ margin: 0, marginTop: 'clamp(12px, 2.2vw, 16px)', color: T.ink2, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 'clamp(10px, 1.4vw, 11px)' }}>{t(c.bars_caption)}</p>
          {barRow(t(c.axis_left), dLeft, nearer === MIN, t(c.near_tag))}
          {barRow(t(c.axis_right), dRight, nearer === MAX, t(c.near_tag))}
          <p className="small" style={{ margin: 0, marginTop: 'clamp(8px, 1.6vw, 12px)', color: T.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: T.accent, flexShrink: 0 }} aria-hidden="true"/>
            {t(c.near_note)}
          </p>
        </div>
        {!checked && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={handleCheck}>{t(c.btn_check)}</button>
          </div>
        )}
        {checked && (<div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t({ ru: `${value} ближе к ${nearer}.${value === MID ? ' Ровно посередине — берём большее.' : ''}`, uz: `${value} ${nearer} ga yaqinroq.${value === MID ? " Aynan o'rtada — kattasini olamiz." : ''}`, en: `${value} is closer to ${nearer}.${value === MID ? ' Exactly halfway, so we take the bigger one.' : ''}` })}</p>
        </div>)}
      </div>
    </Stage>
  );
};

const Screen6 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s6; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's6_a', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className="frame fade-up delay-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="mono small" style={{ color: T.ink3 }}>12 000</span>
            <span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>13 000</span>
          </div>
          <div style={{ position: 'relative', height: 34, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: `${T.ink3}55`, borderRadius: 99 }}/>
            <div style={{ position: 'absolute', left: '74.2%', top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: T.ink, boxShadow: '0 0 10px 0 rgba(58,53,48,0.35)' }}/>
            <div style={{ position: 'absolute', left: '83%', top: '50%', transform: 'translate(-50%, -50%)', color: T.accent, fontSize: 20, fontWeight: 700 }}>{'→'}</div>
            <div className="mono small" style={{ position: 'absolute', left: '74.2%', top: -22, transform: 'translateX(-50%)', color: T.ink }}>12 742</div>
          </div>
          <p className="small mono" style={{ color: T.ink2, marginTop: 10, marginBottom: 0, textAlign: 'center' }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '1.3em' }}>12 742</span> <Op size="sm">{'≈'}</Op> <span style={{ fontFamily: "'Fraunces', serif", fontSize: '1.3em', color: T.accent }}>13 000</span>
          </p>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="body" style={{ margin: 0 }}>{t(c.rule_meaning)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.rule_trick)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.rule_mid)}</p>
        </div>
      </div>
    </Stage>
  );
};

const Screen7 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s7; const t = useT(); const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's7_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const rows = [
    { key: 'tens', label: c.r_tens, result: '12 740', why: c.why_tens },
    { key: 'hundreds', label: c.r_hundreds, result: '12 700', why: c.why_hundreds },
    { key: 'thousands', label: c.r_thousands, result: '13 000', why: c.why_thousands },
    { key: 'tenK', label: c.r_tenK, result: '10 000', why: c.why_tenK }
  ];
  const [opened, setOpened] = useState([]);
  const [sel, setSel] = useState(null);
  const allOpen = opened.length === rows.length;
  const cur = rows.find(r => r.key === sel);
  const speak = (txt) => { if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const open = (r, i) => {
    if (i < opened.length) { setSel(r.key); return; }
    if (i !== opened.length) return;
    setOpened(prev => prev.includes(r.key) ? prev : [...prev, r.key]); setSel(r.key);
    if (lines[i + 1]) speak(lines[i + 1]);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!allOpen} label={<NextLabel/>} onClick={onNext}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="frame fade-up delay-2" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 'clamp(30px, 6.4vw, 50px)', letterSpacing: '0.04em' }}>12 742</div>
        </div>
        {!allOpen && <p className="small" style={{ textAlign: 'center', color: T.accent, fontWeight: 600, margin: 0 }}>{t(c.tap_prompt)}</p>}
        <div className="fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {rows.map((r, i) => {
            const isNext = i === opened.length; const locked = i > opened.length;
            return (
              <button key={r.key} disabled={locked} className={`option${isNext && !allOpen ? ' tap-pulse' : ''}`} onClick={() => open(r, i)} style={{ padding: 'clamp(12px, 1.7vw, 15px)', fontSize: 'clamp(13px, 1.6vw, 14px)', textAlign: 'center', background: sel === r.key ? T.accentSoft : T.paper, color: sel === r.key ? T.accent : (locked ? T.ink3 : T.ink), opacity: locked ? 0.45 : 1 }}>{t(r.label)}</button>
            );
          })}
        </div>
        {cur && (
          <div className="frame-success fade-up" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 14px)', flexWrap: 'wrap' }}>
              <span className="display" style={{ fontSize: 'clamp(20px, 4vw, 28px)', color: T.ink2 }}>12 742</span>
              <Op size="mid">{'≈'}</Op>
              <span className="display" style={{ fontSize: 'clamp(24px, 5vw, 34px)', color: T.accent }}>{cur.result}</span>
            </div>
            <p className="small" style={{ margin: 0, marginTop: 8, color: T.ink2 }}>{t(cur.why)}</p>
          </div>
        )}
        <div className="frame-tip fade-up delay-4"><p className="body" style={{ margin: 0 }}>{t(c.conclusion)}</p></div>
      </div>
    </Stage>
  );
};

// s8 — SEQ: yaxlitlash mashqi (eski s8 MC + s9, s10 input)
const Screen8 = (props) => {
  const items = [
    { type: 'mc', c: CONTENT.s8, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s8.correctIndex, order: [0, 2, 1] },
    { type: 'input', c: CONTENT.s9, base: '12 104', answer: CONTENT.s9.correctValue },
    { type: 'input', c: CONTENT.s10, base: '750', answer: CONTENT.s10.correctValue }
  ];
  return <SeqSolve {...props} items={items} scope="practice" screenContent={W_ROUND}/>;
};

// s9 — kosmik holat (case setup)
const Screen9 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s11; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's_case_a', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={t(c.cta)} onClick={onNext}/></>);
  const facts = [c.fact_1, c.fact_2, c.fact_3];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.intro)}</p></div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {facts.map((f, i) => (
            <div key={i} className={`frame fade-up delay-${i + 2}`} style={{ padding: 'clamp(14px, 2.5vw, 18px)', textAlign: 'center' }}>
              <p className="body" style={{ margin: 0 }}>{t(f)}</p>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s10 — SEQ: случай+итог (eski s12, s13, s14, s15)
const Screen10 = (props) => {
  const items = [
    { type: 'mc', c: CONTENT.s12, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s12.correctIndex, order: [2, 0, 1] },
    { type: 'mc', c: CONTENT.s13, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s13.correctIndex, order: [0, 2, 1] },
    { type: 'mc', c: CONTENT.s14, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s14.correctIndex, order: [1, 2, 0] },
    { type: 'mc', c: CONTENT.s15, optKeys: ['opt0', 'opt1', 'opt2', 'opt3'], correct: CONTENT.s15.correctIndex, order: [0, 3, 1, 2] }
  ];
  return <SeqSolve {...props} items={items} scope="practice" screenContent={W_MIX}/>;
};

// s11, s12 — SEQ: yangi qiyin yaxlitlash
const Screen11 = (props) => <SeqSolve {...props} items={HARD1_ITEMS} scope="practice" screenContent={W_HARD1}/>;
const Screen12 = (props) => <SeqSolve {...props} items={HARD2_ITEMS} scope="final" screenContent={W_HARD2}/>;

// s13 — yakun
const Screen13 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s16; const t = useT(); const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's_sum_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach(l => e.pushOneOff(l)); }
    /* eslint-disable-next-line */
  }, []);
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers[i]?.correct).length;
  const total = scoredIdx.length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{lang === 'uz' ? "Qaytadan o'tish" : lang === 'en' ? "Do it again" : 'Пройти заново'}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : lang === 'en' ? "Finish the lesson" : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{t(c.ring_back)}</p></div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? "blok birinchi urinishda to'g'ri" : lang === 'en' ? "blocks answered correctly first time" : 'блоков решено с первой попытки'}</span>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative' }}>
          <ul className="body" style={{ paddingLeft: 20, color: T.ink2, display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
            <li>{t(c.learned_1)}</li>
            <li>{t(c.learned_2)}</li>
          </ul>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}>
          <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {lang === 'uz' ? 'Keyingi' : lang === 'en' ? "Next" : 'Дальше'}:</span> {t(c.teaser)}</p>
        </div>
      </div>
    </Stage>
  );
};

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13];

// ============================================================
const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: #0E0E10; background: #F6F4EF; height: 100dvh; overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4, .lesson-root h5, .lesson-root h6, .lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }

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
.delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }

.btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #0E0E10; color: #F6F4EF; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32); }
.btn:hover:not(:disabled) { background: #FF4F28; box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #FF4F28; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12); }
.btn-white-accent:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55); }
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }
.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #0E0E10; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.option:disabled { cursor: default; }
.option-correct { background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important; }
.option-wrong { background: #FFFFFF !important; color: #A7A6A2 !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(17px, 2.5vw, 20px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.5; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(12px, 2vw, 18px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 16px); padding-bottom: clamp(17px, 3.4vw, 34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(12px, 2vw, 15px); padding-bottom: clamp(12px, 2vw, 15px); display: flex; gap: 12px; }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

.track-wrap { position: relative; height: 26px; margin: 18px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 30px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (nat_5_02 — космос) ===== */
@keyframes slide-in-right { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
.cell-anim { animation: slide-in-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
@keyframes soft-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
.pulse { animation: soft-pulse 2.4s ease-in-out infinite; display: inline-block; }
.pulse-slow { animation-duration: 3.2s; }
.planet { border-radius: 50%; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.30), inset -6px -6px 16px rgba(0, 0, 0, 0.18); flex-shrink: 0; }
@keyframes tap-pulse { 0%, 100% { box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); } 50% { box-shadow: 0 8px 20px -4px rgba(255, 79, 40, 0.45); } }
.tap-pulse { animation: tap-pulse 1.4s ease-in-out infinite; }
/* "?" → to'g'ri belgi (< / > / =) almashinuvi: belgiga aylanib chiqadi */
@keyframes compare-pop { 0% { opacity: 0; transform: scale(0.4) rotate(-12deg); } 60% { opacity: 1; transform: scale(1.25) rotate(4deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
.compare-sign { transition: color 0.3s ease; }
.compare-sign.revealed { animation: compare-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1) both; }
/* "ближе" yorlig'i yaqin chegara tomonga sakraganda yumshoq paydo bo'ladi */
@keyframes near-badge-pop { 0% { opacity: 0; transform: translateX(-6px) scale(0.85); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
.near-badge { animation: near-badge-pop 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }

.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (platform_contract §1)
// ============================================================
export default function NumbersLesson_5_02({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const lang = langProp || 'ru';
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : lang === 'en' ? "Pupil" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm' });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const nextArr = [...prev]; nextArr[screenIdx] = data; return nextArr; });
  }, []);
  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);
  const finishLesson = useCallback(() => {
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    safeOnFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    });
  }, [answers, safeOnFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));
  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <CurrentScreen
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
