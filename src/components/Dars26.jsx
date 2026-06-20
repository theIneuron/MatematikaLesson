import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// УРОК: Сложение и вычитание десятичных дробей — dec_5_03
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
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };

// Мост между фазами: видимая ↳-связка «откуда пришли». Текст также вплетён в intro-аудио/lead экрана.
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

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
// --- ПОД УРОК: dec_5_03 — Сложение и вычитание десятичных дробей (PROMPT 2026-06-14) ---
// Центральный misconception: выравнивание по правому краю (как натуральные числа) вместо
// выравнивания по запятой; и потеря запятой в ответе. Визуализатор VergulUstun (столбик с
// подсвеченной линией запятой + дописывание нулей) + hook-анимация HookCommaSnap (CSS-loop).
// Типы тестов: warm-up MC / MC / ColumnFill (многоклеточное) / DecInput / find-the-wrong /
// ordering. Spaced-retrieval s1 (сравнение десятичных, dec_5_02). Linker-связки 4-A, факты,
// ✓/✗ feedback, prefers-reduced-motion.
// ============================================================
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'dec-5-03-v1',
  lessonTitle: { ru: 'Сложение и вычитание десятичных дробей', uz: "O'nli kasrlarni qo'shish va ayirish" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },
  { id: 's1',  type: 'review',      template: 'MCScreen',       scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // ColumnFill
  { id: 's8',  type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // DecInput
  { id: 's9',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'practice' }, // find-the-wrong
  { id: 's10', type: 'test',        template: 'custom',         scored: true,  scope: 'practice' }, // ordering
  { id: 's11', type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },    // case solve
  { id: 's13', type: 'summary',     template: 'custom',         scored: false, scope: null },
];

const CONTENT = {
  // ── s0 HOOK (анимация HookCommaSnap) ─────────────────────────────
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Странный итог пробежки', uz: "Yugurishning g'alati natijasi" },
    lead: { ru: 'Жахонгир пробежал 2 км утром и ещё 0,5 км вечером. Он сложил столбиком, выровняв по правому краю, и получил 0,7 км.', uz: "Jahongir ertalab 2 km, kechqurun yana 0,5 km yugurdi. U ustunda o'ng chetdan tekislab qo'shdi va 0,7 km chiqardi." },
    objection: { ru: 'Но 0,7 меньше, чем 2. Как итог может быть меньше начала?', uz: "Lekin 0,7 — 2 dan kichik. Natija boshlanishdan qanday kam bo'ladi?" },
    question: { ru: 'Жахонгир прав?', uz: "Jahongir haqmi?" },
    opt_yes: { ru: 'Да, 0,7 км — верно', uz: "Ha, 0,7 km — to'g'ri" },
    opt_no: { ru: 'Нет, итог не может быть меньше 2 — надо выровнять по запятой', uz: "Yo'q, natija 2 dan kam bo'lolmaydi — vergul bo'yicha tekislash kerak" },
    opt_idk: { ru: 'Не уверен(а)', uz: "Ishonchim komil emas" },
    audio: { ru: 'Жахонгир пробежал два километра, а потом ещё ноль целых пять десятых километра. Он сложил столбиком, выровняв по правому краю, и получил ноль целых семь десятых. Но это меньше двух. Разве итог может быть меньше начала? Выбери.', uz: "Jahongir ikki kilometr, keyin yana nol butun o'ndan besh kilometr yugurdi. U ustunda o'ng chetdan tekislab qo'shdi va nol butun o'ndan yetti chiqardi. Lekin bu ikkidan kichik. Natija boshlanishdan kam bo'lishi mumkinmi? Tanlang." }
  },

  // ── s1 WARM-UP — spaced retrieval (прошлый урок: сравнение десятичных) ──
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    title: { ru: 'Какое число больше', uz: "Qaysi son katta" },
    question: { ru: 'Помнишь прошлый урок? Какое число больше: 0,5 или 0,45?', uz: "O'tgan dars yodingizdami? Qaysi son katta: 0,5 yoki 0,45?" },
    opt0: { ru: '0,5', uz: "0,5" },
    opt1: { ru: '0,45', uz: "0,45" },
    opt2: { ru: 'Они равны', uz: "Ular teng" },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно. 0,5 это 0,50 — пятьдесят сотых, а это больше сорока пяти сотых.', uz: "To'g'ri. 0,5 bu 0,50 — yuzdan ellik, bu yuzdan qirq beshdan katta." },
    hint_1: { ru: 'Больше цифр не значит больше число. 0,45 это сорок пять сотых, а 0,50 — пятьдесят сотых.', uz: "Raqam ko'p bo'lgani son katta degani emas. 0,45 bu yuzdan qirq besh, 0,50 esa yuzdan ellik." },
    hint_2: { ru: 'Не равны: допиши ноль — 0,50 и 0,45. Видно, что 0,50 больше.', uz: "Teng emas: nol qo'shing — 0,50 va 0,45. 0,50 katta ekani ko'rinadi." },
    hint_3: { ru: 'Сравнить можно: допиши до равной длины — 0,50 и 0,45.', uz: "Solishtirsa bo'ladi: teng uzunlikka to'ldiring — 0,50 va 0,45." },
    audio: {
      intro: { ru: 'Вспомни прошлый урок про сравнение. Какое число больше: ноль целых пять десятых или ноль целых сорок пять сотых? Выбери.', uz: "Taqqoslash haqidagi o'tgan darsni eslang. Qaysi son katta: nol butun o'ndan besh yoki nol butun yuzdan qirq besh? Tanlang." },
      on_correct: { ru: 'Верно, ноль целых пять десятых больше.', uz: "To'g'ri, nol butun o'ndan besh katta." },
      on_wrong: { ru: 'Не совсем. Допиши до равной длины и сравни.', uz: "Unchalik emas. Teng uzunlikka to'ldirib solishtiring." }
    }
  },

  // ── s2 EXPLORATION: сложение, линия запятой + дописывание нуля ─────
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    bridge: { ru: 'Размялись со сравнением — теперь вернёмся к загадке.', uz: "Solishtirish bilan mashq qildik — endi topishmoqqa qaytamiz." },
    title: { ru: 'Складываем по запятой', uz: "Vergul bo'yicha qo'shamiz" },
    lead: { ru: 'Раз сравнивать умеем — вернёмся к загадке. Сложим 2 и 0,5 правильно.', uz: "Solishtirishni bilamiz — endi topishmoqqa qaytamiz. 2 va 0,5 ni to'g'ri qo'shamiz." },
    step_labels: {
      ru: ['Запятую ставим под запятой. Но у числа 2 нет десятых.', 'Поэтому дописываем ноль: 2 это 2,0. Теперь разряды на месте.', 'Складываем по разрядам: десятые 0 и 5 это 5, целые 2 и 0 это 2. Запятая опускается вниз. Итого 2,5.'],
      uz: ["Vergulni vergul ostiga qo'yamiz. Lekin 2 da o'ndan ulush yo'q.", "Shuning uchun nol qo'shamiz: 2 bu 2,0. Endi xonalar joyida.", "Xonalab qo'shamiz: o'ndan 0 va 5 bu 5, butun 2 va 0 bu 2. Vergul pastga tushadi. Jami 2,5."]
    },
    note: { ru: 'Вот в чём секрет: запятая под запятой, а пустой разряд закрываем нулём.', uz: "Mana siri: vergul vergul ostida, bo'sh xona esa nol bilan to'ldiriladi." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Вернёмся к загадке. Запятую ставим под запятой, но у числа два нет десятых долей. Нажми кнопку.',
        'Поэтому дописываем ноль. Два это две целых ноль десятых. Теперь разряды на месте.',
        'Складываем по разрядам. Десятые ноль и пять дают пять, целые два и ноль дают два. Запятая опускается вниз. Получается две целых пять десятых.'
      ],
      uz: [
        "Topishmoqqa qaytamiz. Vergulni vergul ostiga qo'yamiz, lekin ikki sonida o'ndan ulush yo'q. Tugmani bosing.",
        "Shuning uchun nol qo'shamiz. Ikkini ikki butun deb yozamiz, bo'sh xonaga nol. Endi xonalar joyida.",
        "Xonalab qo'shamiz. O'ndan nol va besh beshni beradi, butun ikki va nol ikkini beradi. Vergul pastga tushadi. Ikki butun o'ndan besh bo'ladi."
      ]
    }
  },

  // ── s3 EXPLORATION: вычитание, дописывание нуля + займ ─────────────
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Вычитаем с займом', uz: "Qarz bilan ayiramiz" },
    lead: { ru: 'Это было сложение. Теперь вычитание: 5,2 минус 1,75.', uz: "Bu qo'shish edi. Endi ayirish: 5,2 minus 1,75." },
    step_labels: {
      ru: ['У 5,2 только десятые, а у 1,75 есть сотые. Разряды не совпадают.', 'Допишем ноль: 5,2 это 5,20. Теперь запятые и разряды на месте.', 'Вычитаем по разрядам справа. Из 0 сотых нельзя забрать 5 — занимаем у десятых. Дальше десятые и целые. Итого 3,45.'],
      uz: ["5,2 da faqat o'ndan bor, 1,75 da yuzdan ham bor. Xonalar mos kelmaydi.", "Nol qo'shamiz: 5,2 bu 5,20. Endi vergul va xonalar joyida.", "O'ngdan xonalab ayiramiz. 0 yuzdandan 5 ni olib bo'lmaydi — o'ndandan qarz olamiz. Keyin o'ndan va butunlar. Jami 3,45."]
    },
    note: { ru: 'Снова тот же приём: дописываем ноль, чтобы разрядов хватило, и занимаем при нехватке.', uz: "Yana o'sha usul: xona yetishi uchun nol qo'shamiz, yetmasa qarz olamiz." },
    btn_step: { ru: 'Дальше', uz: "Davom" },
    audio: {
      ru: [
        'Это было сложение. Теперь вычитание. Из пяти целых двух десятых вычитаем один целый семьдесят пять сотых.',
        'Допишем ноль. Пять целых две десятых это пять целых двадцать сотых. Теперь разряды на месте.',
        'Вычитаем по разрядам справа. Из ноля сотых нельзя забрать пять, занимаем у десятых. Дальше десятые и целые. Получается три целых сорок пять сотых.'
      ],
      uz: [
        "Bu qo'shish edi. Endi ayirish. Besh butun o'ndan ikkidan bir butun yuzdan yetmish beshni ayiramiz.",
        "Nol qo'shamiz. Besh butun o'ndan ikki bu besh butun yuzdan yigirma. Endi xonalar joyida.",
        "O'ngdan xonalab ayiramiz. Nol yuzdandan beshni olib bo'lmaydi, o'ndandan qarz olamiz. Keyin o'ndan va butunlar. Uch butun yuzdan qirq besh bo'ladi."
      ]
    }
  },

  // ── s4 RULE 1 ─────────────────────────────────────────────────────
  s4: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    bridge: { ru: 'Сложение и вычитание увидели — теперь соберём правило.', uz: "Qo'shish va ayirishni ko'rdik — endi qoidaga yig'amiz." },
    title: { ru: 'Правило сложения и вычитания', uz: "Qo'shish va ayirish qoidasi" },
    rule_main: { ru: 'Соберём в правило. Чтобы складывать и вычитать десятичные дроби: запятую ставим под запятой, в пустые разряды дописываем ноль, считаем по разрядам как обычные числа, а в ответе запятая опускается на ту же линию.', uz: "Qoidaga yig'amiz. O'nli kasrlarni qo'shish va ayirish uchun: vergulni vergul ostiga qo'yamiz, bo'sh xonalarga nol qo'shamiz, oddiy sonlardek xonalab hisoblaymiz, javobda vergul shu chiziqqa tushadi." },
    rule_note: { ru: 'Почему так? Складывать можно только одинаковые разряды: десятые с десятыми, сотые с сотыми. Запятая под запятой это и гарантирует.', uz: "Nega shunday? Faqat bir xil xonalarni qo'shish mumkin: o'ndanni o'ndanga, yuzdanni yuzdanga. Vergul vergul ostida shuni kafolatlaydi." },
    audio: { ru: 'Соберём увиденное в правило. Запятую ставим под запятой, в пустые разряды дописываем ноль, считаем по разрядам как обычные числа, а запятая в ответе опускается на ту же линию. Так складываются только одинаковые разряды.', uz: "Ko'rganlarimizni qoidaga yig'amiz. Vergulni vergul ostiga qo'yamiz, bo'sh xonalarga nol qo'shamiz, oddiy sonlardek xonalab hisoblaymiz, javobda vergul shu chiziqqa tushadi. Shunda faqat bir xil xonalar qo'shiladi." }
  },

  // ── s5 RULE 2 — две осторожности (M1 + M2) ────────────────────────
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    title: { ru: 'Две осторожности', uz: "Ikkita ehtiyotkorlik" },
    rule_main: { ru: 'Сложение и вычитание знаем. Теперь две осторожности.', uz: "Qo'shish va ayirishni bildik. Endi ikkita ehtiyotkorlik." },
    warn1_label: { ru: 'Осторожно: выравнивание', uz: "Ehtiyot bo'ling: tekislash" },
    warn1: { ru: 'Не выравнивай по правому краю, как обычные числа. Выравнивай по запятой — иначе сложатся разные разряды.', uz: "Oddiy sonlardek o'ng chetdan tekislamang. Vergul bo'yicha tekislang — aks holda har xil xonalar qo'shilib qoladi." },
    warn2_label: { ru: 'Осторожно: запятая', uz: "Ehtiyot bo'ling: vergul" },
    warn2: { ru: 'Не теряй запятую в ответе. Она стоит на той же линии, что и в слагаемых.', uz: "Javobda vergulni yo'qotmang. U qo'shiluvchilardagi vergul chizig'ida turadi." },
    audio: { ru: 'Сложение и вычитание мы знаем. Но есть две осторожности. Первое: не выравнивай по правому краю, выравнивай по запятой, иначе сложатся разные разряды. Второе: не теряй запятую в ответе, она стоит на той же линии.', uz: "Qo'shish va ayirishni bilamiz. Lekin ikkita ehtiyotkorlik bor. Birinchi: o'ng chetdan tekislamang, vergul bo'yicha tekislang, aks holda har xil xonalar qo'shiladi. Ikkinchi: javobda vergulni yo'qotmang, u shu chiziqda turadi." }
  },

  // ── s6 TEST MC: сложение (correct A) ──────────────────────────────
  s6: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    bridge: { ru: 'Правило знаем — теперь попробуй сам.', uz: "Qoidani bildik — endi o'zingiz sinab ko'ring." },
    title: { ru: 'Сложи сам', uz: "O'zingiz qo'shing" },
    question: { ru: 'Теперь сам. Сколько будет 2,5 + 1,25?', uz: "Endi o'zingiz. 2,5 + 1,25 nechaga teng?" },
    opt0: { ru: '3,75', uz: "3,75" },
    opt1: { ru: '0,75', uz: "0,75" },
    opt2: { ru: '3,30', uz: "3,30" },
    opt3: { ru: '1,50', uz: "1,50" },
    correct_text: { ru: 'Верно. 2,5 это 2,50. Сотые 0 и 5 это 5, десятые 5 и 2 это 7, целые 2 и 1 это 3. Итого 3,75.', uz: "To'g'ri. 2,5 bu 2,50. Yuzdan 0 va 5 bu 5, o'ndan 5 va 2 bu 7, butun 2 va 1 bu 3. Jami 3,75." },
    hint_1: { ru: 'Целые части не сложены: 2 и 1 это 3.', uz: "Butun qismlar qo'shilmagan: 2 va 1 bu 3." },
    hint_2: { ru: 'Это выравнивание по правому краю. Запиши 2,5 как 2,50 и выровняй запятые.', uz: "Bu o'ng chetdan tekislash. 2,5 ni 2,50 deb yozing va vergullarni tekislang." },
    hint_3: { ru: 'Запятые не учтены: нельзя складывать как 25 и 125. Выровняй по запятой.', uz: "Vergullar e'tiborga olinmagan: 25 va 125 kabi qo'shib bo'lmaydi. Vergul bo'yicha tekislang." },
    audio: {
      intro: { ru: 'Теперь сам сложи две целых пять десятых и одну целую двадцать пять сотых. Выбери вариант.', uz: "Endi o'zingiz ikki butun o'ndan besh va bir butun yuzdan yigirma beshni qo'shing. Variantni tanlang." },
      on_correct: { ru: 'Верно. Три целых семьдесят пять сотых.', uz: "To'g'ri. Uch butun yuzdan yetmish besh." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s7 TEST ColumnFill: заполни ответ по разрядам (3,6 + 2,75 = 6,35) ──
  s7: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Заполни ответ по разрядам', uz: "Javobni xonalab to'ldiring" },
    lead: { ru: 'Продолжаем. Заполни ответ по разрядам: целые, десятые, сотые.', uz: "Davom etamiz. Javobni xonalab to'ldiring: butun, o'ndan, yuzdan." },
    question: { ru: '3,6 + 2,75 = ?', uz: "3,6 + 2,75 = ?" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Допиши 3,6 как 3,60. Сотые 0 и 5 это 5, десятые 6 и 7 это 13 — пишем 3, один в уме, целые 3 и 2 плюс один это 6.', uz: "3,6 ni 3,60 deb yozing. Yuzdan 0 va 5 bu 5, o'ndan 6 va 7 bu 13 — 3 yozamiz, bir esda, butun 3 va 2 qo'shuv bir bu 6." },
    fb_correct: { ru: 'Верно. 6 целых, 3 десятых, 5 сотых — 6,35.', uz: "To'g'ri. 6 butun, 3 o'ndan, 5 yuzdan — 6,35." },
    audio: {
      intro: { ru: 'Сложи три целых шесть десятых и два целых семьдесят пять сотых. Заполни три клетки ответа: целые, десятые, сотые. Потом нажми проверить.', uz: "Uch butun o'ndan olti va ikki butun yuzdan yetmish beshni qo'shing. Javobning uch katagini to'ldiring: butun, o'ndan, yuzdan. Keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно, шесть целых тридцать пять сотых.', uz: "To'g'ri, olti butun yuzdan o'ttiz besh." },
      on_wrong: { ru: 'Пока нет. Не забудь перенос из десятых.', uz: "Hali emas. O'ndandagi ko'chirishni unutmang." }
    }
  },

  // ── s8 TEST DecInput: вычитание с дописыванием и займом (7,5 − 2,35 = 5,15) ──
  s8: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Теперь вычитание', uz: "Endi ayirish" },
    lead: { ru: 'Хорошо. Теперь вычитание. Заполни ответ по разрядам: целые, десятые, сотые.', uz: "Yaxshi. Endi ayirish. Javobni xonalab to'ldiring: butun, o'ndan, yuzdan." },
    question: { ru: '7,5 − 2,35 = ?', uz: "7,5 − 2,35 = ?" },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Допиши 7,5 как 7,50. Из 0 сотых нельзя забрать 5 — занимай у десятых. Дальше по разрядам.', uz: "7,5 ni 7,50 deb yozing. 0 yuzdandan 5 ni olib bo'lmaydi — o'ndandan qarz oling. Keyin xonalab." },
    fb_correct: { ru: 'Верно. 7,50 минус 2,35 это 5,15.', uz: "To'g'ri. 7,50 minus 2,35 bu 5,15." },
    audio: {
      intro: { ru: 'Хорошо, теперь вычитание. Из семи целых пяти десятых вычти два целых тридцать пять сотых. Допиши ноль и считай по разрядам. Заполни клетки ответа и нажми проверить.', uz: "Yaxshi, endi ayirish. Yetti butun o'ndan beshdan ikki butun yuzdan o'ttiz beshni ayiring. Nol qo'shing va xonalab hisoblang. Javob kataklarini to'ldiring va tekshirishni bosing." },
      on_correct: { ru: 'Верно, пять целых пятнадцать сотых.', uz: "To'g'ri, besh butun yuzdan o'n besh." },
      on_wrong: { ru: 'Пока нет. Допиши ноль и займи при нехватке.', uz: "Hali emas. Nol qo'shing va yetmasa qarz oling." }
    }
  },

  // ── s9 TEST find-the-wrong (correct C) + Факт «запятая или точка» ──
  s9: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    question_pre: { ru: 'Найди ошибку. Какое утверждение про 4,2 + 1,35', uz: "Xatoni toping. 4,2 + 1,35 haqidagi qaysi tasdiq" },
    question_em: { ru: 'неверное', uz: "noto'g'ri" },
    question_post: { ru: '?', uz: "?" },
    opt0: { ru: '4,2 нужно записать как 4,20', uz: "4,2 ni 4,20 deb yozish kerak" },
    opt1: { ru: 'Запятая ставится под запятой', uz: "Vergul vergul ostiga qo'yiladi" },
    opt2: { ru: '4,2 и 1,35 складывают, выровняв по правому краю', uz: "4,2 va 1,35 o'ng chetdan tekislab qo'shiladi" },
    opt3: { ru: 'Ответ равен 5,55', uz: "Javob 5,55 ga teng" },
    correct_text: { ru: 'Верно нашёл. Вот ошибка: по правому краю выравнивать нельзя — только по запятой. Иначе сложатся разные разряды.', uz: "To'g'ri topdingiz. Xato shu: o'ng chetdan tekislab bo'lmaydi — faqat vergul bo'yicha. Aks holda har xil xonalar qo'shiladi." },
    hint_0: { ru: 'Это верно: у 4,2 нет сотых, пишем 4,20. Ищи неверное.', uz: "Bu to'g'ri: 4,2 da yuzdan yo'q, 4,20 deb yozamiz. Noto'g'risini qidiring." },
    hint_1: { ru: 'Это верно: запятая под запятой — главное правило. Ищи другое.', uz: "Bu to'g'ri: vergul vergul ostida — asosiy qoida. Boshqasini qidiring." },
    hint_3: { ru: 'Это верно: 4,20 плюс 1,35 действительно 5,55. Неверное — другое.', uz: "Bu to'g'ri: 4,20 qo'shuv 1,35 haqiqatan 5,55. Noto'g'ri tasdiq — boshqasi." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Запись', uz: "Bilasizmi? · Yozuv" },
      text: { ru: 'В одних странах дробную часть пишут запятой, в других — точкой. В Узбекистане — запятой.', uz: "Ba'zi davlatlarda kasr qismi vergul bilan, ba'zilarida nuqta bilan yoziladi. O'zbekistonda — vergul bilan." }
    },
    audio: {
      intro: { ru: 'Найди неверное утверждение про сложение четырёх целых двух десятых и одного целого тридцати пяти сотых. Какое из них ошибочно? Выбери.', uz: "To'rt butun o'ndan ikki va bir butun yuzdan o'ttiz beshni qo'shish haqidagi noto'g'ri tasdiqni toping. Qaysi biri xato? Tanlang." },
      on_correct: { ru: 'Верно. По правому краю выравнивать нельзя. Кстати, где-то дробную часть пишут точкой, а у нас запятой.', uz: "To'g'ri. O'ng chetdan tekislab bo'lmaydi. Aytgancha, qayerdadir kasr qismi nuqta, bizda vergul bilan yoziladi." },
      on_wrong: { ru: 'Это утверждение верное. Ищи неверное.', uz: "Bu tasdiq to'g'ri. Noto'g'risini qidiring." }
    }
  },

  // ── s10 TEST ordering + Факт аль-Каши ─────────────────────────────
  s10: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Расставь по возрастанию', uz: "O'sish tartibida joylang" },
    instruction: { ru: 'Расставь числа от меньшего к большему: нажимай по порядку.', uz: "Sonlarni kichikdan kattaga joylang: tartib bilan bosing." },
    btn_check: { ru: 'Проверить', uz: "Tekshirish" },
    hint: { ru: 'Допиши до равной длины: 0,25, 0,50, 0,30. Теперь видно, что меньше.', uz: "Teng uzunlikka to'ldiring: 0,25, 0,50, 0,30. Endi qaysi kichik ko'rinadi." },
    ok_text: { ru: 'Готово. Проверь себя.', uz: "Tayyor. O'zingizni tekshiring." },
    wrong_text: { ru: 'Порядок не тот — попробуй снова.', uz: "Tartib noto'g'ri — qayta urinib ko'ring." },
    done_text: { ru: 'Верно: 0,25, потом 0,3, потом 0,5. Больше цифр — не значит больше число.', uz: "To'g'ri: 0,25, keyin 0,3, keyin 0,5. Raqam ko'p bo'lgani son katta degani emas." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" },
      text: { ru: 'Десятичные дроби применял аль-Каши в Самарканде ещё в пятнадцатом веке, задолго до Европы.', uz: "O'nli kasrlarni al-Koshiy Samarqandda XV asrdayoq, Yevropadan ancha oldin qo'llagan." }
    },
    audio: {
      intro: { ru: 'Расставь три числа от меньшего к большему. Нажимай в нужном порядке, потом нажми проверить.', uz: "Uchta sonni kichikdan kattaga joylang. Kerakli tartibda bosing, keyin tekshirishni bosing." },
      on_correct: { ru: 'Верно. Меньше всех ноль целых двадцать пять сотых. А десятичные дроби применял аль-Каши в Самарканде.', uz: "To'g'ri. Eng kichigi nol butun yuzdan yigirma besh. O'nli kasrlarni esa al-Koshiy Samarqandda qo'llagan." },
      on_wrong: { ru: 'Пока нет. Допиши до равной длины и сравни.', uz: "Hali emas. Teng uzunlikka to'ldirib solishtiring." }
    }
  },

  // ── s11 CASE setup (Феруза, вычитание) ────────────────────────────
  s11: {
    eyebrow: { ru: 'Задача', uz: "Masala" },
    bridge: { ru: 'Потренировались — теперь применим в жизни.', uz: "Mashq qildik — endi hayotda qo'llaymiz." },
    title: { ru: 'Лента Ферузы', uz: "Feruzaning lentasi" },
    lead: { ru: 'Всё это нужно в жизни. У Ферузы было 10 метров ленты. На подарки она потратила 3,75 метра.', uz: "Bularning hammasi hayotda kerak. Feruzaning 10 metr lentasi bor edi. Sovg'alarga 3,75 metr ishlatdi." },
    question_setup: { ru: 'Сколько метров ленты осталось?', uz: "Necha metr lenta qoldi?" },
    btn_help: { ru: 'Помочь Ферузе', uz: "Feruzaga yordam berish" },
    audio: { ru: 'Всё это нужно в жизни. У Ферузы было десять метров ленты. На подарки она потратила три целых семьдесят пять сотых метра. Сколько осталось? Здесь придётся дописать нули и занять.', uz: "Bularning hammasi hayotda kerak. Feruzaning o'n metr lentasi bor edi. Sovg'alarga uch butun yuzdan yetmish besh metr ishlatdi. Necha metr qoldi? Bu yerda nol qo'shib, qarz olishga to'g'ri keladi." }
  },

  // ── s12 CASE solve / FINAL (correct D) + Факт термометр ────────────
  s12: {
    eyebrow: { ru: 'Финальная проверка', uz: "Yakuniy tekshiruv" },
    title: { ru: 'Сколько ленты осталось', uz: "Necha lenta qoldi" },
    question: { ru: 'Помоги Ферузе: сколько ленты осталось — 10 − 3,75?', uz: "Feruzaga yordam bering: necha lenta qoldi — 10 − 3,75?" },
    opt0: { ru: '6,25', uz: "6,25" },
    opt1: { ru: '7,25', uz: "7,25" },
    opt2: { ru: '6,75', uz: "6,75" },
    opt3: { ru: '13,75', uz: "13,75" },
    correct_text: { ru: 'Верно. 10 это 10,00. Из 0 сотых занимаем, дальше по разрядам: 10,00 минус 3,75 это 6,25 метра.', uz: "To'g'ri. 10 bu 10,00. 0 yuzdandan qarz olamiz, keyin xonalab: 10,00 minus 3,75 bu 6,25 metr." },
    hint_1: { ru: 'Запятые на месте, но из-за займа ошибка в целых: после займа остаётся 6 целых.', uz: "Vergullar joyida, lekin qarz tufayli butunda xato: qarzdan keyin 6 butun qoladi." },
    hint_2: { ru: 'Ошибка в десятых из-за займа. После займа в десятых получается 2.', uz: "Qarz tufayli o'ndanda xato. Qarzdan keyin o'ndanda 2 chiqadi." },
    hint_3: { ru: 'Это сложение, а нужно вычитание: 10 минус 3,75.', uz: "Bu qo'shish bo'lib qoldi, ayirish kerak edi: 10 minus 3,75." },
    fact: {
      badge: { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" },
      text: { ru: 'Температуру тела измеряют десятичной дробью: 36,6 градуса. Даже полградуса важны.', uz: "Tana harorati o'nli kasr bilan o'lchanadi: 36,6 daraja. Hatto yarim daraja ham muhim." }
    },
    audio: {
      intro: { ru: 'Помоги Ферузе. Десять минус три целых семьдесят пять сотых. Допиши нули и займи. Выбери вариант.', uz: "Feruzaga yordam bering. O'n minus uch butun yuzdan yetmish besh. Nol qo'shing va qarz oling. Variantni tanlang." },
      on_correct: { ru: 'Верно, шесть целых двадцать пять сотых метра. Кстати, температуру тела пишут так же: тридцать шесть и шесть.', uz: "To'g'ri, olti butun yuzdan yigirma besh metr. Aytgancha, tana harorati ham shunday yoziladi: o'ttiz olti butun o'ndan olti." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор ниже.', uz: "Unchalik emas. Quyidagi tushuntirishga qarang." }
    }
  },

  // ── s13 SUMMARY ───────────────────────────────────────────────────
  s13: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    bridge: { ru: 'Задачу решили — подведём итог.', uz: "Masalani yechdik — yakun yasaymiz." },
    heading: { ru: 'Десятичные сложены и вычтены', uz: "O'nli kasrlar qo'shildi va ayrildi" },
    title: { ru: 'Итак, теперь ты умеешь складывать и вычитать десятичные дроби.', uz: "Demak, endi siz o'nli kasrlarni qo'shish va ayirishni bilasiz." },
    main_label: { ru: 'Главное', uz: "Asosiysi" },
    points: {
      ru: [
        'Запятая под запятой, пустой разряд закрываем нулём.',
        'Считаем по разрядам как обычные числа, запятая опускается вниз.',
        'Не выравнивай по правому краю и не теряй запятую в ответе.'
      ],
      uz: [
        "Vergul vergul ostida, bo'sh xona nol bilan to'ldiriladi.",
        "Oddiy sonlardek xonalab hisoblaymiz, vergul pastga tushadi.",
        "O'ng chetdan tekislamang va javobda vergulni yo'qotmang."
      ]
    },
    hook_close: { ru: 'Помнишь загадку? Жахонгир выровнял по правому краю и получил 0,7. По запятой: 2,0 плюс 0,5 это 2,5 км — больше, чем было, как и должно быть.', uz: "Topishmoq yodingizdami? Jahongir o'ng chetdan tekislab 0,7 chiqardi. Vergul bo'yicha: 2,0 qo'shuv 0,5 bu 2,5 km — boshlanishdan ko'p, shunday bo'lishi kerak ham." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: '«Десятичная дробь — что это», «Сравнение десятичных дробей», «Сложение и вычитание столбиком».', uz: "«O'nli kasr — bu nima», «O'nli kasrlarni taqqoslash», «Ustunda qo'shish va ayirish»." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'умножение и деление десятичной дроби на 10, 100, 1000.', uz: "o'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish." },
    btn_reset: { ru: 'Пройти заново', uz: "Qaytadan boshlash" },
    audio: { ru: 'Итак, сегодня мы научились складывать и вычитать десятичные дроби. Запятая под запятой, пустые разряды закрываем нулём, считаем по разрядам, запятая опускается вниз. Дальше нас ждёт умножение и деление на десять, сто и тысячу.', uz: "Demak, bugun o'nli kasrlarni qo'shish va ayirishni o'rgandik. Vergul vergul ostida, bo'sh xonalarni nol bilan to'ldiramiz, xonalab hisoblaymiz, vergul pastga tushadi. Keyingi darsda o'nga, yuzga va mingga ko'paytirish va bo'lish kutadi." }
  }
};

// ============================================================
// ВИЗУАЛИЗАТОР dec_5_03: VergulUstun — столбик с подсвеченной линией запятой.
// Пустые дробные разряды закрываются бледным нулём (зирофилл). Чисто рендер, без state.
// ============================================================
const splitDec = (s) => {
  const str = String(s);
  const ix = str.indexOf(',');
  return ix === -1 ? { int: str, frac: '' } : { int: str.slice(0, ix), frac: str.slice(ix + 1) };
};

const VergulUstun = ({ a, b, op = '+', result = null, zeroFill = true, showResult = false, glow = false }) => {
  const A = splitDec(a), B = splitDec(b);
  const R = (showResult && result) ? splitDec(result) : null;
  const maxInt = Math.max(A.int.length, B.int.length, R ? R.int.length : 1);
  const maxFrac = Math.max(A.frac.length, B.frac.length, R ? R.frac.length : 0);
  const hasFrac = maxFrac > 0;
  // delay !== null → раскадровка появления (результат каскадом слева направо).
  const cell = (ch, key, cls, delay = null) => <span key={key} className={`vc-cell ${cls || ''}`} style={delay != null ? { animationName: 'vcRin', animationDuration: '0.42s', animationFillMode: 'both', animationTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', animationDelay: `${delay}s` } : undefined}>{ch}</span>;
  const rowCells = (P, isResult = false) => {
    const out = [];
    const intPad = maxInt - P.int.length;
    let pos = 0;
    const mk = (ch, key, cls) => { const d = isResult ? pos * 0.075 : null; pos++; return cell(ch, key, cls, d); };
    for (let k = 0; k < maxInt; k++) {
      if (k < intPad) out.push(mk('', `i${k}`, 'vc-empty'));
      else out.push(mk(P.int[k - intPad], `i${k}`, ''));
    }
    if (hasFrac) out.push(mk(',', 'comma', `vc-c ${glow ? 'vc-c-glow' : ''}`));
    for (let k = 0; k < maxFrac; k++) {
      if (k < P.frac.length) out.push(mk(P.frac[k], `f${k}`, ''));
      else out.push(mk(zeroFill ? '0' : '', `f${k}`, zeroFill ? 'vc-zero' : 'vc-empty'));
    }
    return out;
  };
  return (
    <div className={`vc ${glow ? 'vc-on vc-glow' : ''}`}>
      <div className="vc-opcol">{op}</div>
      <div className="vc-body">
        <div className="vc-row">{rowCells(A)}</div>
        <div className="vc-row">{rowCells(B)}</div>
        {R && <div className="vc-row vc-result">{rowCells(R, true)}</div>}
      </div>
    </div>
  );
};

// HOOK-анимация s0 (CSS-only, без state): на mount нижнее число один раз встаёт с правого
// края на линию запятой и ОСТАЁТСЯ; неверное 0,7 (✗) сменяется верным 2,5 (✓) и фиксируется.
// Без бегущего цикла (запрет «путешественника»); живость экрана — мягкий пульс линии запятой.
const HookCommaSnap = () => (
  <div className="hk">
    <div className="hk-grid">
      <div className="hk-line"/>
      <div className="hk-row hk-top"><span className="hk-d">2</span><span className="hk-cm">,</span><span className="hk-d hk-zero">0</span></div>
      <div className="hk-row hk-bot"><span className="hk-d">0</span><span className="hk-cm">,</span><span className="hk-d">5</span></div>
    </div>
    <div className="hk-eq">
      <span className="hk-bad">0,7 <span className="hk-mark">✗</span></span>
      <span className="hk-good">2,5 <span className="hk-mark">✓</span></span>
    </div>
  </div>
);

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
const FACT_BADGE = { ru: 'Знаешь ли ты?', uz: "Bilasizmi?" };
const AnimComma = () => (<div className="fa-cm"><span className="fa-cm-comma">,</span><span className="fa-cm-dot">.</span></div>);
const AnimPiStream = () => (<div className="fa-pis">{['3', ',', '1', '4', '1', '5'].map((d, i) => <span key={i} style={{ animationDelay: `${i * 0.28}s` }}>{d}</span>)}</div>);
const AnimThermo = () => (<div className="fa-th"><span className="fa-th-stem"/><span className="fa-th-merc"/><span className="fa-th-bulb"/></div>);

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

// Универсальный exploration step-gated с произвольным render-prop.
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
          {render(step, done)}
        </div>
        {/* Izohlar TO'PLANADI: yangi qadam pastdan chiqadi, eskisi qoladi (oxirgi, to'g'ri bo'lsa — yashil). */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {caps.slice(0, step + 1).map((label, i) => {
            const green = done && i === step;
            return <div key={i} className={`cap-line fade-up${green ? ' cap-line-ok' : ''}`}><span className="cap-mark">{green ? '✓' : i + 1}</span><p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(label)}</p></div>;
          })}
        </div>
        {!done && (
          <div className="fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-white-accent" onClick={advance} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 28px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_step)}</button>
          </div>
        )}
        <p ref={stepEndRef} className="body fade-up delay-2" style={{ position: 'relative', margin: 0, textAlign: 'center', color: done ? T.success : T.ink2, fontWeight: done ? 600 : 400 }}>{done ? mt(t(c.note)) : ''}</p>
      </div>
    </Stage>
  );
};

// s0 — HOOK (концептуальный) с анимацией HookCommaSnap
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
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px) clamp(10px, 2vw, 16px)' }}>
          <HookCommaSnap/>
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

// s1 — WARM-UP (spaced retrieval, не scored) через QuestionScreen (correct B)
const Screen1 = (props) => {
  const t = useT(); const c = CONTENT.s1;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 0, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={1} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[1]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s2 — EXPLORATION сложение (линия запятой + нуль)
const Screen2 = (props) => (
  <ExplorationStep {...props} cKey="s2" render={(step, done) => (
    <VergulUstun a="2" b="0,5" op="+" result="2,5" zeroFill={step >= 1} showResult={step >= 2} glow={done}/>
  )}/>
);

// s3 — EXPLORATION вычитание (нуль + займ)
const Screen3 = (props) => (
  <ExplorationStep {...props} cKey="s3" render={(step, done) => (
    <VergulUstun a="5,2" b="1,75" op="−" result="3,45" zeroFill={step >= 1} showResult={step >= 2} glow={done}/>
  )}/>
);

// s4 — RULE 1 + ambient
const Screen4 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s4;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.rule_main))}</p>
          <VergulUstun a="2" b="0,5" op="+" result="2,5" zeroFill={true} showResult={true} glow={true}/>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_note))}</p>
      </div>
    </Stage>
  );
};

// s5 — RULE 2 (две осторожности) + контраст неверного/верного + ambient
const Screen5 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s5;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 1.9vw, 15px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ position: 'relative', margin: 0, textAlign: 'center', fontWeight: 600 }}>{mt(t(c.rule_main))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <VergulUstun a="2" b="0,5" op="+" result="2,5" zeroFill={true} showResult={true} glow={true}/>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.ink, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t(c.warn1_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn1))}</p>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="small mono" style={{ margin: 0, fontWeight: 600, color: T.ink, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t(c.warn2_label)}</p>
          <p className="body" style={{ margin: 0 }}>{mt(t(c.warn2))}</p>
        </div>
      </div>
    </Stage>
  );
};

// s6 — TEST MC: сложение (correct A)
const Screen6 = (props) => {
  const t = useT(); const c = CONTENT.s6;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [0, 1, 2, 3]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><VergulUstun a="2,5" b="1,25" op="+"/></div></>);
  return <QuestionScreen {...props} idx={6} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[6]} screenContent={content} question={question} options={options} correctIdx={correctIdx}/>;
};

// s7 — TEST ColumnFill: заполни ответ по разрядам (3,6 + 2,75 = 6,35)
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s7;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's7_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const ANS = ['6', '3', '5'];
  const wasSolved = storedAnswer?.solved === true;
  const [cells, setCells] = useState(wasSolved ? [...ANS] : (storedAnswer?.cells ?? ['', '', '']));
  const [bad, setBad] = useState(() => new Set());
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const setCell = (i, v) => {
    if (solved) return;
    const nv = v.replace(/[^0-9]/g, '').slice(0, 1);
    setCells(prev => { const n = [...prev]; n[i] = nv; return n; });
    setBad(prev => { const n = new Set(prev); n.delete(i); return n; });
    setHintShown(false);
  };
  const submit = () => {
    if (solved) return;
    if (cells.some(x => x === '')) return;
    const wrongIdx = new Set();
    ANS.forEach((a, i) => { if (cells[i] !== a) wrongIdx.add(i); });
    const isCorrect = wrongIdx.size === 0;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); setBad(new Set()); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[7].scope, screenIdx: 7, question: c.question[lang], correctAnswer: '6,35', studentAnswer: cells.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      setBad(wrongIdx); setHintShown(true); setCells(prev => prev.map((x, i) => wrongIdx.has(i) ? '' : x)); sfx.playWrong();
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const box = (i) => <input key={i} type="text" inputMode="numeric" className={`fb-box ${solved ? 'correct' : ''} ${bad.has(i) ? 'wrongcell' : ''}`} value={cells[i]} placeholder="0" disabled={solved} onChange={e => setCell(i, e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(38px, 8vw, 50px)' }}/>;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}><VergulUstun a="3,6" b="2,75" op="+"/></div>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 'clamp(16px, 2.6vw, 20px)', color: T.ink3 }}>=</span>
          {box(0)}<span className="fb-comma">,</span>{box(1)}{box(2)}
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.ink }}><IconNo/></span>
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

// s8 — TEST ColumnFill: заполни ответ по разрядам (как s7), вычитание 7,5 − 2,35 = 5,15
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const ANS = ['5', '1', '5'];
  const wasSolved = storedAnswer?.solved === true;
  const [cells, setCells] = useState(wasSolved ? [...ANS] : (storedAnswer?.cells ?? ['', '', '']));
  const [bad, setBad] = useState(() => new Set());
  const [solved, setSolved] = useState(wasSolved);
  const [hintShown, setHintShown] = useState(false);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const setCell = (i, v) => {
    if (solved) return;
    const nv = v.replace(/[^0-9]/g, '').slice(0, 1);
    setCells(prev => { const n = [...prev]; n[i] = nv; return n; });
    setBad(prev => { const n = new Set(prev); n.delete(i); return n; });
    setHintShown(false);
  };
  const submit = () => {
    if (solved) return;
    if (cells.some(x => x === '')) return;
    const wrongIdx = new Set();
    ANS.forEach((a, i) => { if (cells[i] !== a) wrongIdx.add(i); });
    const isCorrect = wrongIdx.size === 0;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) {
      setSolved(true); setHintShown(false); setBad(new Set()); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[8].scope, screenIdx: 8, question: c.question[lang], correctAnswer: '5,15', studentAnswer: cells.join(','), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else {
      setBad(wrongIdx); setHintShown(true); setCells(prev => prev.map((x, i) => wrongIdx.has(i) ? '' : x)); sfx.playWrong();
    }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]); }, 300);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  const box = (i) => <input key={i} type="text" inputMode="numeric" className={`fb-box ${solved ? 'correct' : ''} ${bad.has(i) ? 'wrongcell' : ''}`} value={cells[i]} placeholder="0" disabled={solved} onChange={e => setCell(i, e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(38px, 8vw, 50px)' }}/>;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}><VergulUstun a="7,5" b="2,35" op="−" zeroFill={true}/></div>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 'clamp(16px, 2.6vw, 20px)', color: T.ink3 }}>=</span>
          {box(0)}<span className="fb-comma">,</span>{box(1)}{box(2)}
          {!solved && <button className="btn-white-accent" onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(16px, 2.2vw, 22px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>}
        </div>
        {hintShown && !solved && (
          <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: T.ink }}><IconNo/></span>
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

// s9 — TEST find-the-wrong (correct C) + Факт «запятая или точка»
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [0, 1, 2, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{t(c.question_pre)} <span className="italic" style={{ color: T.accent }}>{t(c.question_em)}</span>{t(c.question_post)}</h2></>);
  return <QuestionScreen {...props} idx={9} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[9]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimComma/>}/>}/>;
};

// s10 — TEST ordering (расставь по возрастанию) + Факт аль-Каши
const ORDER_ITEMS = [{ id: 'a', label: '0,25', v: 0.25 }, { id: 'b', label: '0,5', v: 0.5 }, { id: 'c', label: '0,3', v: 0.3 }];
const ORDER_SORTED = [...ORDER_ITEMS].sort((x, y) => x.v - y.v).map(x => x.id);
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([{ id: 's10_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  const [seq, setSeq] = useState(wasSolved ? [...ORDER_SORTED] : []);
  const [solved, setSolved] = useState(wasSolved);
  const [feedback, setFeedback] = useState(wasSolved ? 'done' : null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const introAdvancedRef = useRef(wasSolved);
  const inSeq = new Set(seq);
  const pool = ORDER_ITEMS.filter(x => !inSeq.has(x.id));
  const labelOf = (id) => (ORDER_ITEMS.find(x => x.id === id) || {}).label;
  const tapChip = (id) => { if (solved) return; setSeq(prev => [...prev, id]); setFeedback(null); };
  const tapSlot = (i) => { if (solved) return; setSeq(prev => prev.filter((_, k) => k !== i)); setFeedback(null); };
  const check = () => {
    if (seq.length !== ORDER_ITEMS.length || solved) return;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    const ok = seq.every((id, i) => id === ORDER_SORTED[i]);
    attemptsRef.current += 1;
    if (firstTryRef.current === null) firstTryRef.current = ok;
    if (ok) {
      setSolved(true); setFeedback('done'); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[10].scope, screenIdx: 10, question: c.instruction[lang], correctAnswer: ORDER_SORTED.join('<'), studentAnswer: seq.join('<'), correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_correct[lang]); }, 300);
    } else {
      setSeq([]); setFeedback('wrong'); sfx.playWrong();
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(c.audio.on_wrong[lang]); }, 300);
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0, textAlign: 'center' }}>{mt(t(c.instruction))}</p>
        <div className="fade-up delay-1" style={{ display: 'flex', gap: 'clamp(8px, 1.6vw, 12px)', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {ORDER_ITEMS.map((_, i) => {
            const id = seq[i];
            return (
              <React.Fragment key={i}>
                {i > 0 && <span className="mono" style={{ color: T.ink3 }}>&lt;</span>}
                <button onClick={() => tapSlot(i)} className="ord-slot" disabled={!id || solved}
                  style={{ background: id ? (solved ? T.successSoft : T.paper) : 'transparent', color: solved ? T.success : T.ink, boxShadow: id ? `0 6px 16px -6px rgba(${T.shadowBase}, 0.18)` : 'inset 0 0 0 2px rgba(167,166,162,0.4)' }}>
                  {id ? labelOf(id) : <span className="mono small" style={{ color: T.ink3 }}>{i + 1}</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', minHeight: 46 }}>
            {pool.map(p => (
              <button key={p.id} className="chip chip-pop" onClick={() => tapChip(p.id)} style={{ padding: '10px 16px', background: T.accent }}>{p.label}</button>
            ))}
          </div>
        )}
        <p className="body fade-up delay-3" style={{ margin: 0, textAlign: 'center', color: solved ? T.success : (feedback === 'wrong' ? T.accent : T.ink2), fontWeight: solved || feedback === 'wrong' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {solved && <IconOk/>}{mt(t(solved ? c.done_text : (feedback === 'wrong' ? c.wrong_text : (seq.length === ORDER_ITEMS.length ? c.ok_text : c.hint))))}
        </p>
        {!solved && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={seq.length !== ORDER_ITEMS.length} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{t(c.btn_check)}</button>
          </div>
        )}
        {solved && <FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimPiStream/>}/>}
      </div>
    </Stage>
  );
};

// s11 — CASE setup (Феруза)
const Screen11 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s11;
  const audio = useAudio(makeAudioSegments(c, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={t(c.btn_help)}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}><VergulUstun a="10" b="3,75" op="−" zeroFill={true}/></div>
        <h2 className="title h-sub fade-up delay-2" style={{ margin: 0, textAlign: 'center' }}>{mt(t(c.question_setup))}</h2>
      </div>
    </Stage>
  );
};

// s12 — CASE solve / FINAL (correct D) + Факт термометр
const Screen12 = (props) => {
  const t = useT(); const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2><div className="frame" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><VergulUstun a="10" b="3,75" op="−" zeroFill={true}/></div></>);
  return <QuestionScreen {...props} idx={12} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[12]} screenContent={content} question={question} options={options} correctIdx={correctIdx} factOnCorrect={<FactCard text={c.fact.text} badge={c.fact.badge} anim={<AnimThermo/>}/>}/>;
};

// s13 — SUMMARY + закрытие hook + связи + ambient
const Screen13 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s13;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = c.points[lang] || c.points.ru;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_reset)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><VergulUstun a="2" b="0,5" op="+" result="2,5" zeroFill={true} showResult={true} glow={true}/></div>
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
export default function DecimalAddSubLesson({
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
/* MATH dec_5_03: ФАКТ-БЛОК — синяя карта, КРУПНАЯ анимация + мало текста. */
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }

/* MATH dec_5_03: VergulUstun — столбик с подсвеченной линией запятой + зирофилл. */
.vc { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 9px); font-family: 'Fraunces', serif; }
.vc-opcol { display: flex; align-items: center; justify-content: center; min-width: clamp(16px, 3vw, 22px); font-family: 'Manrope', sans-serif; font-weight: 600; color: #5A5A60; font-size: clamp(20px, 4vw, 28px); }
.vc-body { display: inline-flex; flex-direction: column; gap: 2px; }
.vc-row { display: flex; align-items: stretch; justify-content: center; }
.vc-cell { width: clamp(22px, 4.5vw, 30px); text-align: center; font-size: clamp(20px, 4vw, 28px); line-height: 1.18; color: #0E0E10; }
.vc-empty { color: transparent; }
.vc-zero { color: rgba(167, 166, 162, 0.6); animation: vcZeroPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@keyframes vcZeroPop { 0% { opacity: 0; transform: scale(0.35); } 100% { opacity: 1; transform: scale(1); } }
@keyframes vcRin { from { opacity: 0; transform: translateY(-9px); } to { opacity: 1; transform: translateY(0); } }
.vc-c { width: clamp(10px, 2vw, 14px); color: #FF4F28; font-weight: 700; background: rgba(255, 79, 40, 0.07); }
.vc-c-glow { color: #1F7A4D; background: rgba(31, 122, 77, 0.16); animation: vcCommaPulse 2.6s ease-in-out infinite; }
@keyframes vcCommaPulse { 0%, 100% { box-shadow: 0 0 5px rgba(31, 122, 77, 0.25); } 50% { box-shadow: 0 0 13px rgba(31, 122, 77, 0.5); } }
.vc-result { border-top: 2px solid rgba(58, 53, 48, 0.45); margin-top: 2px; padding-top: 2px; }
.vc-on .vc-result .vc-cell { color: #1F7A4D; }
.vc-glow { animation: vcGlow 0.7s ease; opacity: 1; }
@keyframes vcGlow { 0% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } 50% { filter: drop-shadow(0 0 12px rgba(31, 122, 77, 0.4)); } 100% { filter: drop-shadow(0 0 0 rgba(31, 122, 77, 0)); } }

/* MATH dec_5_03: hook-анимация HookCommaSnap — нижнее число один раз встаёт на линию запятой (mount-settle, без бегущего цикла); линия запятой мягко пульсирует на месте. */
.hk { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.2vw, 16px); }
.hk-grid { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 6px 0; }
.hk-line { position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; transform: translateX(-50%); background: #1F7A4D; border-radius: 2px; animation: hkLine 2.6s ease-in-out infinite; }
.hk-row { display: flex; justify-content: center; align-items: center; font-family: 'Fraunces', serif; font-size: clamp(24px, 5vw, 34px); position: relative; }
.hk-d { width: clamp(18px, 3.6vw, 24px); text-align: center; }
.hk-cm { width: clamp(8px, 1.6vw, 11px); text-align: center; color: #FF4F28; font-weight: 700; }
.hk-zero { color: #A7A6A2; }
.hk-bot { animation: hkBot 1.5s cubic-bezier(0.5, 0, 0.2, 1) 0.35s both; }
@keyframes hkBot { from { transform: translateX(26px); } to { transform: translateX(0); } }
@keyframes hkLine { 0%, 100% { opacity: 0.55; box-shadow: 0 0 8px rgba(31, 122, 77, 0.4); } 50% { opacity: 1; box-shadow: 0 0 15px rgba(31, 122, 77, 0.65); } }
.hk-eq { position: relative; height: clamp(26px, 5vw, 34px); display: flex; justify-content: center; align-items: center; font-family: 'Fraunces', serif; font-size: clamp(20px, 4vw, 26px); }
.hk-bad, .hk-good { position: absolute; display: inline-flex; align-items: center; gap: 6px; }
.hk-bad { color: #FF4F28; animation: hkBad 1.5s ease-in 0.35s both; }
.hk-good { color: #1F7A4D; animation: hkGood 1.5s ease-in 0.35s both; }
.hk-mark { font-size: 0.8em; }
@keyframes hkBad { 0% { opacity: 1; } 45%, 100% { opacity: 0; } }
@keyframes hkGood { 0%, 35% { opacity: 0; } 70%, 100% { opacity: 1; } }

/* MATH dec_5_03: fill-in-blank клетки ответа (ColumnFill). */
.fb-box { font-family: 'Fraunces', serif; font-size: clamp(20px, 3.8vw, 26px); font-weight: 400; text-align: center; border: none; border-radius: 8px; background: #FFFFFF; padding: 6px 4px; outline: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); transition: all 0.2s; }
.fb-box:focus { box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.fb-box.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.fb-box.wrongcell { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }
.fb-box::-webkit-outer-spin-button, .fb-box::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.fb-comma { font-family: 'Fraunces', serif; font-size: clamp(20px, 3.8vw, 26px); color: #FF4F28; font-weight: 700; }

/* MATH dec_5_03: ordering — слоты и чипы (tap, touch-friendly). */
.ord-slot { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(18px, 3.4vw, 24px); min-width: clamp(54px, 12vw, 72px); min-height: clamp(46px, 9vw, 56px); border: none; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
.ord-slot:disabled { cursor: default; }
.chip { font-family: 'JetBrains Mono', monospace; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; color: #FFFFFF; box-shadow: 0 6px 16px -5px rgba(58, 53, 48, 0.42); user-select: none; -webkit-user-select: none; transition: box-shadow 0.2s, filter 0.2s; font-size: clamp(15px, 2.6vw, 18px); }
.chip:hover { filter: brightness(1.06); box-shadow: 0 9px 22px -5px rgba(58, 53, 48, 0.5); }
.chip-pop { animation: chipPop 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) backwards; }
@keyframes chipPop { from { opacity: 0; transform: scale(0.5); } }

/* MATH dec_5_03: факт-анимации (CSS-only loop). */
.fa-cm { position: relative; width: clamp(46px, 10vw, 64px); height: clamp(56px, 12vw, 80px); }
.fa-cm-comma, .fa-cm-dot { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(44px, 10vw, 64px); color: #019ACB; line-height: 1; }
.fa-cm-comma { animation: faCm 3s ease-in-out infinite; }
.fa-cm-dot { animation: faCm 3s ease-in-out infinite; animation-delay: 1.5s; }
@keyframes faCm { 0%, 40% { opacity: 1; transform: scale(1); } 50%, 90% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
.fa-pis { display: flex; align-items: center; gap: clamp(2px, 0.6vw, 4px); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(18px, 3.6vw, 26px); color: #019ACB; }
.fa-pis span { opacity: 0; animation: faPis 3.2s ease-in-out infinite; }
@keyframes faPis { 0%, 5% { opacity: 0; transform: translateY(4px); } 30%, 80% { opacity: 1; transform: translateY(0); } 95%, 100% { opacity: 0; } }
.fa-th { position: relative; width: clamp(30px, 6vw, 42px); height: clamp(66px, 13vw, 92px); }
.fa-th-stem { position: absolute; top: 4px; bottom: 16px; left: 50%; transform: translateX(-50%); width: clamp(8px, 1.8vw, 12px); background: rgba(1, 154, 203, 0.18); border-radius: 99px 99px 0 0; }
.fa-th-merc { position: absolute; left: 50%; transform: translateX(-50%); bottom: 12px; width: clamp(8px, 1.8vw, 12px); background: #019ACB; border-radius: 99px 99px 0 0; animation: faTh 2.8s ease-in-out infinite; }
.fa-th-bulb { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: clamp(18px, 3.6vw, 24px); height: clamp(18px, 3.6vw, 24px); border-radius: 50%; background: #019ACB; box-shadow: 0 0 10px rgba(1, 154, 203, 0.5); }
@keyframes faTh { 0%, 100% { height: 16px; } 50% { height: 48px; } }

/* MATH dec_5_03: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Bridge — видимая ↳-связка между фазами урока (PROMPT 2-C). */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* cap-line — qadam izohlari TO'PLANADI (yangi pastdan chiqadi, eskisi qoladi); oxirgi to'g'ri — yashil. */
.cap-line { display: flex; align-items: center; gap: 10px; background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 10px; padding: clamp(7px, 1.4vw, 10px) clamp(10px, 2vw, 14px); }
.cap-line-ok { background: #E3F0E8; border-left-color: #1F7A4D; }
.cap-mark { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: #D8A93A; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; }
.cap-line-ok .cap-mark { background: #1F7A4D; }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы (PROMPT 2026-06-13). */
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;
