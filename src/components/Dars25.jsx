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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <Floaters/>
        {titleNode && <Title node={titleNode}/>}
        {/* Заголовок (Title) + текст вопроса остаются и после верного ответа — сворачиваются только неверные варианты. */}
        <div className="fade-up" style={{ position: 'relative' }}>{question}</div>
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
// --- POD UROK: dec_5_02 — Solishtirish va yaxlitlash / Сравнение и округление (etalon: Dars28) ---
// Markaziy misconception M1: "verguldan keyin raqam ko'p = son katta" (0,45 > 0,5? — YO'Q).
// Solishtirish: vergul bo'yicha tenglab, nol qo'shib, chapdan o'ngga xonama-xona.
// Yaxlitlash: kerakli xonadan o'ngdagi raqam 5 yoki katta bo'lsa yuqoriga, kichik bo'lsa pastga.
// Vizualizatorlar: DecimalGrid (solishtirish), PlaceTable, JumpBars (hook), RoundLine (yaxlitlash o'qi).
// Hook: 1,45 vs 1,5 (sakrash). Case: Sherzod uzunlikka (4,25 vs 4,3).
// Faktlar: vergul/nuqta (IT) / tarozi yaxlitlaydi (sport·fan) / pi soni (fan).
// ============================================================
const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'dec-5-02-v1',
  lessonTitle: { ru: 'Сравнение и округление десятичных дробей', uz: "O'nli kasrlarni solishtirish va yaxlitlash" }
};
// Eslatma: ekran ID lari qattiq indeks emas — har komponent jonli `screen` propidan idx oladi.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },     // 0
  { id: 's1',  type: 'warmup',      template: 'SeqMC',    scored: false, scope: null },       // 1
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },       // 2 (solishtirish)
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },       // 3 (yaxlitlash)
  { id: 's5_6', type: 'rule',       template: 'custom',   scored: false, scope: null },       // 4 (solishtirish + yaxlitlash qoidalari)
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },  // 5
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 6 (tartiblash)
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },  // 7 (yaxlitlash)
  { id: 's_practice', type: 'test', template: 'SeqMC',    scored: true,  scope: 'practice' },  // 8
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },  // 9 (xato-top)
  { id: 's11_12', type: 'case',     template: 'custom',   scored: true,  scope: 'practice' },  // 10 (Sherzod)
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },     // 11 (yakuniy)
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }        // 12
];

const CONTENT = {
  // ===== s0 HOOK — M1: ko'p raqam ≠ katta (1,45 vs 1,5) =====
  s0: {
    eyebrow: { ru: 'Загадка', uz: "Topishmoq" },
    title: { ru: 'Кто прыгнул выше?', uz: "Kim balandroq sakradi?" },
    lead: { ru: 'Финал по прыжкам в высоту. Жахонгир — 1,45 м, Мафтуна — 1,5 м. Зритель говорит: у Жахонгира после запятой больше цифр, значит он выше.', uz: "Balandlikka sakrash finali. Jahongir — 1,45 m, Maftuna — 1,5 m. Tomoshabin aytadi: Jahongirda verguldan keyin raqam ko'proq, demak u balandroq." },
    opt0: { ru: 'Жахонгир — у него цифр больше', uz: "Jahongir — raqami ko'proq" },
    opt1: { ru: 'Мафтуна — 1,5 м', uz: "Maftuna — 1,5 m" },
    opt2: { ru: 'Пока не уверен(а)', uz: "Hozircha ishonchim komil emas" },
    reveal0: { ru: 'Так думают многие. Но длина не решает — решают разряды. Проверим к концу урока.', uz: "Ko'pchilik shunday o'ylaydi. Lekin uzunlik emas, xonalar hal qiladi. Dars oxirida tekshiramiz." },
    reveal1: { ru: 'Интуиция верна. Почему — разберём на уроке.', uz: "Sezgi to'g'ri. Nega — darsda ko'ramiz." },
    reveal2: { ru: 'Честно. К концу урока ответишь уверенно.', uz: "Halol. Dars oxirida ishonch bilan javob berasiz." },
    audio: { ru: "Финал по прыжкам в высоту. Жахонгир прыгнул на одну целую сорок пять сотых метра, Мафтуна на одну целую пять десятых. Зритель говорит: у Жахонгира больше цифр после запятой, значит он выше. Так ли это? Выбери ответ.", uz: "Balandlikka sakrash finali. Jahongir bir butun yuzdan qirq besh metr, Maftuna bir butun o'ndan besh metr sakradi. Tomoshabin aytadi: Jahongirda raqam ko'proq, demak u balandroq. Shundaymi? Javobni tanlang." }
  },

  // ===== s1 WARMUP — o'tgan darsni eslash (SeqMC, tap) =====
  s1: {
    eyebrow: { ru: 'Вспомним', uz: "Eslaymiz" },
    title: { ru: 'Разминка', uz: "Mashq" },
    lead: { ru: 'Четыре быстрых вопроса о десятичных дробях.', uz: "O'nli kasrlar haqida to'rtta tez savol." },
    bridge: { ru: 'Прежде чем решить загадку — вспомним прошлый урок.', uz: "Topishmoqni yechishdan oldin — o'tgan darsni eslaylik." },
    questions: [
      {
        q: { ru: '0,5 = ?', uz: '0,5 = ?' },
        say: { ru: "Ноль целых пять десятых — какой дроби равно?", uz: "Nol butun o'ndan besh qaysi kasrga teng?" },
        opts: [{ ru: '5/10', uz: '5/10' }, { ru: '1/10', uz: '1/10' }, { ru: '5/100', uz: '5/100' }],
        correct: 0,
        ok: { ru: 'Верно: одна цифра — десятые. 0,5 = 5/10.', uz: "To'g'ri: bitta raqam — o'ndan. 0,5 = 5/10." },
        no: { ru: 'Одна цифра после запятой это десятые.', uz: "Bitta raqam — o'ndan." }
      },
      {
        q: { ru: '0,7 или 0,5 — что больше?', uz: "0,7 yoki 0,5 — qaysi katta?" },
        say: { ru: "Что больше: семь десятых или пять десятых?", uz: "Qaysi katta: o'ndan yetti yoki o'ndan besh?" },
        opts: [{ ru: '0,7', uz: '0,7' }, { ru: '0,5', uz: '0,5' }, { ru: 'Равны', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: семь десятых больше пяти.', uz: "To'g'ri: o'ndan yetti beshdan katta." },
        no: { ru: 'У обоих десятые. 7 больше 5.', uz: "Ikkalasida o'ndan. 7 esa 5 dan katta." }
      },
      {
        q: { ru: '0,05 = ?', uz: '0,05 = ?' },
        say: { ru: "Ноль целых пять сотых — какой дроби равно?", uz: "Nol butun yuzdan besh qaysi kasrga teng?" },
        opts: [{ ru: '5/100', uz: '5/100' }, { ru: '5/10', uz: '5/10' }, { ru: '1/5', uz: '1/5' }],
        correct: 0,
        ok: { ru: 'Верно: две цифры — сотые. 0,05 = 5/100.', uz: "To'g'ri: ikki raqam — yuzdan. 0,05 = 5/100." },
        no: { ru: 'Две цифры после запятой это сотые.', uz: "Ikki raqam — yuzdan." }
      },
      {
        q: { ru: '0,3 или 0,30 — что больше?', uz: "0,3 yoki 0,30 — qaysi katta?" },
        say: { ru: "Что больше: ноль целых три десятых или ноль целых тридцать сотых?", uz: "Qaysi katta: nol butun o'ndan uch yoki nol butun yuzdan o'ttiz?" },
        opts: [{ ru: 'Равны', uz: 'Teng' }, { ru: '0,30', uz: '0,30' }, { ru: '0,3', uz: '0,3' }],
        correct: 0,
        ok: { ru: 'Верно: 0,3 = 0,30. Ноль в конце не меняет число.', uz: "To'g'ri: 0,3 = 0,30. Oxirdagi nol sonni o'zgartirmaydi." },
        no: { ru: 'Допиши ноль: 0,3 это 0,30. Они равны.', uz: "Nol qo'shing: 0,3 — 0,30. Ular teng." }
      }
    ],
    audio: {
      intro: { ru: "Прежде чем решить загадку, вспомним прошлый урок. Четыре быстрых вопроса.", uz: "Topishmoqni yechishdan oldin, o'tgan darsni eslaylik. To'rtta tez savol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Почти. Попробуй ещё раз.", uz: "Deyarli. Yana urinib ko'ring." },
      on_done: { ru: "Отлично, размялись.", uz: "Zo'r, mashq tugadi." }
    }
  },

  // ===== s2 EXPLORATION — nol qo'shib solishtirish (DecimalGrid) =====
  s2: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Допишем ноль и сравним', uz: "Nol qo'shib solishtiramiz" },
    bridge: { ru: 'Размялись. Теперь раскроем загадку про прыжки.', uz: "Mashq qildik. Endi sakrash topishmog'ini ochamiz." },
    lead: { ru: 'Сравним 0,45 и 0,5. У первого цифр больше — но больше ли число?', uz: "0,45 va 0,5 ni solishtiramiz. Birinchisida raqam ko'p — lekin son kattaroqmi?" },
    step_labels: {
      ru: ['У 0,5 — пять полос, у 0,45 — сорок пять мелких клеток. Доли разные.', 'Допишем ноль: 0,5 = 0,50. Теперь у обоих сотые: 50 клеток и 45.', '50 клеток больше 45. Значит 0,5 больше 0,45.'],
      uz: ["0,5 da beshta bo'lak, 0,45 da qirq beshta mayda katak. Ulushlar har xil.", "Nol qo'shamiz: 0,5 = 0,50. Endi ikkalasida yuzdan: 50 katak va 45.", "50 katak 45 dan ko'p. Demak 0,5 katta 0,45 dan."]
    },
    note: { ru: 'Решает не длина, а значение разрядов. 0,5 больше 0,45.', uz: "Uzunlik emas, xona qiymati hal qiladi. 0,5 katta 0,45 dan." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Размялись, теперь раскроем загадку. Сравним ноль целых сорок пять сотых и ноль целых пять десятых.",
        "У ноль целых пять десятых пять крупных полос, у второго сорок пять мелких клеток. Доли разные.",
        "Допишем ноль. Ноль целых пять десятых это ноль целых пятьдесят сотых. Теперь у обоих сотые.",
        "Пятьдесят клеток больше сорока пяти. Значит ноль целых пять десятых больше."
      ],
      uz: [
        "Mashq qildik, endi topishmoqni ochamiz. Nol butun yuzdan qirq besh va nol butun o'ndan beshni solishtiramiz.",
        "Nol butun o'ndan beshda beshta katta bo'lak, ikkinchisida qirq beshta mayda katak. Ulushlar har xil.",
        "Nol qo'shamiz. Nol butun o'ndan besh — bu nol butun yuzdan ellik. Endi ikkalasida yuzdan.",
        "Ellik katak qirq beshdan ko'p. Demak nol butun o'ndan besh katta."
      ]
    }
  },

  // ===== s3 EXPLORATION — yaxlitlash (RoundLine) =====
  s3: {
    eyebrow: { ru: 'Исследуем', uz: "Tekshiramiz" },
    title: { ru: 'Ближайшая метка', uz: "Eng yaqin belgi" },
    lead: { ru: 'Округлить — значит подвести число к ближайшей метке на прямой. Округлим 0,46 до десятых.', uz: "Yaxlitlash — sonni sonlar nuridagi eng yaqin belgiga olib borish. 0,46 ni o'ndangacha yaxlitlaymiz." },
    step_labels: {
      ru: ['0,46 стоит между 0,4 и 0,5.', 'К какой метке ближе? К 0,5. Значит, 0,46 ≈ 0,5.', 'Ещё: 3,7 ближе к 4, чем к 3. Значит 3,7 ≈ 4.'],
      uz: ["0,46 — 0,4 va 0,5 orasida.", "Qaysi belgiga yaqin? 0,5 ga. Demak 0,46 ≈ 0,5.", "Yana: 3,7 uchdan ko'ra 4 ga yaqin. Demak 3,7 ≈ 4."]
    },
    note: { ru: 'Округление — выбор ближайшей метки: ближайшей десятой или ближайшего целого.', uz: "Yaxlitlash — eng yaqin belgini tanlash: eng yaqin o'ndan yoki butun." },
    btn_step: { ru: 'Дальше', uz: "Keyingi qadam" },
    btn_final: { ru: 'Понятно', uz: "Tushunarli" },
    audio: {
      ru: [
        "Теперь округление. Округлим ноль целых сорок шесть сотых до десятых.",
        "На прямой оно стоит между ноль целых четыре десятых и ноль целых пять десятых.",
        "К какой метке ближе? Ближе к ноль целых пять десятых. Значит, округляем до ноль целых пять десятых.",
        "Ещё пример. Три целых семь десятых ближе к четырём. Значит примерно четыре."
      ],
      uz: [
        "Endi yaxlitlash. Nol butun yuzdan qirq oltini o'ndangacha yaxlitlaymiz.",
        "Sonlar nurida u nol butun o'ndan to'rt va nol butun o'ndan besh orasida turadi.",
        "Qaysi belgiga yaqin? Nol butun o'ndan beshga yaqin. Demak nol butun o'ndan beshga yaxlitlaymiz.",
        "Yana misol. Uch butun o'ndan yetti to'rtga yaqin. Demak taxminan to'rt."
      ]
    }
  },

  // ===== s5 RULE 1 — solishtirish qoidasi =====
  s5: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Правило сравнения', uz: "Solishtirish qoidasi" },
    bridge: { ru: 'Увидели, как сравнивать и округлять. Соберём правила.', uz: "Solishtirish va yaxlitlashni ko'rdik. Qoidalarni yig'amiz." },
    rule_1: { ru: 'Выровняйте числа по запятой.', uz: "Sonlarni vergul bo'yicha tenglang." },
    rule_2: { ru: 'При необходимости допишите нули справа.', uz: "Kerak bo'lsa o'ngga nol qo'shing." },
    rule_3: { ru: 'Сравнивайте разряд за разрядом слева направо.', uz: "Chapdan o'ngga xonama-xona solishtiring." },
    rule_4: { ru: 'Решает первый разряд, где числа различаются.', uz: "Sonlar farq qilgan birinchi xona hal qiladi." },
    rule_label: { ru: 'Сравнение', uz: "Solishtirish" },
    audio: { ru: "Увидели, как сравнивать и округлять, теперь соберём правила. Чтобы сравнить: выравниваем по запятой, при необходимости дописываем нули, потом сравниваем по разрядам слева направо. Решает первый разряд, где числа различаются.", uz: "Solishtirish va yaxlitlashni ko'rdik, endi qoidalarni yig'amiz. Solishtirish uchun: vergul bo'yicha tenglaymiz, kerak bo'lsa nol qo'shamiz, keyin chapdan o'ngga xona bo'yicha solishtiramiz. Sonlar farq qilgan birinchi xona hal qiladi." }
  },

  // ===== s6 RULE 2 — yaxlitlash qoidasi + nol ogohlantirish =====
  s6: {
    eyebrow: { ru: 'Правило', uz: "Qoida" },
    heading: { ru: 'Правило округления', uz: "Yaxlitlash qoidasi" },
    rule_main: { ru: 'Чтобы округлить: посмотрите на цифру справа от нужного разряда. 5 или больше — вверх, меньше 5 — вниз.', uz: "Yaxlitlash uchun: kerakli xonadan o'ngdagi raqamga qarang. 5 yoki katta — yuqoriga, 5 dan kichik — pastga." },
    warn_label: { ru: 'Запомните', uz: "Esda tuting" },
    warn: { ru: '0,5 = 0,50 = 0,500. Нули в конце не меняют число — они лишь выравнивают разряды.', uz: "0,5 = 0,50 = 0,500. Oxirdagi nollar sonni o'zgartirmaydi — ular faqat xonalarni tenglaydi." },
    audio: { ru: "Теперь округление. Смотрим на цифру справа от разряда, до которого округляем. Пять или больше — вверх, меньше пяти — вниз. И помните: нули в конце десятичной дроби не меняют её значение.", uz: "Endi yaxlitlash. Yaxlitlanayotgan xonadan o'ngdagi raqamga qaraymiz. Besh yoki katta — yuqoriga, beshdan kichik — pastga. Va esda tuting: o'nli kasr oxiridagi nollar uning qiymatini o'zgartirmaydi." }
  },

  // ===== s7 TEST MC — eng kattasi (0,8) + IT fakti =====
  s7: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    bridge: { ru: 'Правила знаем — теперь попробуй сам.', uz: "Qoidalarni bilamiz — endi o'zingiz urinib ko'ring." },
    title: { ru: 'Найди самое большое', uz: "Eng kattasini toping" },
    question: { ru: 'Какое число самое БОЛЬШОЕ?', uz: "Qaysi son eng KATTA?" },
    opt0: { ru: '0,8', uz: '0,8' },
    opt1: { ru: '0,75', uz: '0,75' },
    opt2: { ru: '0,7', uz: '0,7' },
    opt3: { ru: '0,79', uz: '0,79' },
    correct_text: { ru: 'Верно. 0,8 = 0,80 это 80 сотых — больше всех.', uz: "To'g'ri. 0,8 = 0,80 — 80 yuzdan, hammadan katta." },
    wrong_1: { ru: '0,75 это 75 сотых. Допиши всем нули до сотых — где их больше?', uz: "0,75 — 75 yuzdan. Hammaga yuzdangacha nol qo'shing — qayerda ko'proq?" },
    wrong_2: { ru: '0,7 это 70 сотых. Сравни по разрядам с остальными.', uz: "0,7 — 70 yuzdan. Boshqalar bilan xona bo'yicha solishtiring." },
    wrong_3: { ru: 'Цифр больше, но это 79 сотых. У кого сотых больше?', uz: "Raqam ko'p, lekin bu 79 yuzdan. Qayerda yuzdan ko'proq?" },
    fact: { ru: 'Во многих странах десятичный знак — запятая, а в программировании и английском — точка: 3.14.', uz: "Ko'p mamlakatlarda o'nli belgi vergul, dasturlash va ingliz tilida nuqta: 3.14." },
    audio: {
      intro: { ru: "Правила знаем, теперь попробуй сам. Из четырёх чисел выбери самое большое.", uz: "Qoidalarni bilamiz, endi o'zingiz urinib ko'ring. To'rt sondan eng kattasini tanlang." },
      on_correct: { ru: "Верно, ноль целых восемь десятых. Кстати, в программировании десятичный знак это точка, а не запятая.", uz: "To'g'ri, nol butun o'ndan sakkiz. Aytgancha, dasturlashda o'nli belgi nuqta, vergul emas." },
      on_wrong: { ru: "Не совсем. Допиши нули и сравни сотые.", uz: "Unchalik emas. Nol qo'shib, yuzdanlarni solishtiring." }
    }
  },

  // ===== s8 — 3 BOSQICHLI MASHQ: solishtirish → tartiblash → xato-top =====
  s8: {
    eyebrow: { ru: 'Тренировка · 3 шага', uz: "Mashq · 3 bosqich" },
    bridge: { ru: 'Три разные задачи подряд — скучать не придётся.', uz: "Uchta har xil topshiriq ketma-ket — zerikmaysiz." },
    title: { ru: 'Три задачи подряд', uz: "Uchta topshiriq ketma-ket" },
    lead: { ru: 'Сравни, расставь по порядку и найди ошибку.', uz: "Solishtiring, tartiblang va xatoni toping." },
    audio: {
      intro: { ru: "Три разные задачи подряд. Сначала сравни два числа, ноль целых сорок пять сотых и ноль целых пять десятых. Какой знак между ними?", uz: "Uchta har xil topshiriq ketma-ket. Avval ikki sonni solishtiring, nol butun yuzdan qirq besh va nol butun o'ndan besh. Ularning orasida qaysi belgi?" },
      on_done: { ru: "Отлично. Все три задачи решены.", uz: "Zo'r. Uchala topshiriq ham yechildi." }
    },
    steps: [
      // 1-bosqich — SOLISHTIRISH (belgi tanlash, MC)
      {
        kind: 'compare',
        label: { ru: 'Сравни', uz: "Solishtiring" },
        prompt: { ru: '0,45 ? 0,5', uz: '0,45 ? 0,5' },
        question: { ru: 'Какой знак поставить между числами?', uz: "Sonlar orasiga qaysi belgi qo'yiladi?" },
        opts: [{ ru: '<', uz: '<' }, { ru: '=', uz: '=' }, { ru: '>', uz: '>' }],
        correct: 0,
        ok: { ru: 'Верно. 0,45 это 45 сотых, 0,5 это 50 сотых — значит 0,45 < 0,5.', uz: "To'g'ri. 0,45 — 45 yuzdan, 0,5 — 50 yuzdan, demak 0,45 < 0,5." },
        no: { ru: 'Допиши ноль: 0,45 и 0,50. У кого сотых больше?', uz: "Nol qo'shing: 0,45 va 0,50. Qayerda yuzdan ko'proq?" },
        noSay: { ru: "Допиши ноль до сотых и сравни. Пятьдесят сотых больше сорока пяти.", uz: "Yuzdangacha nol qo'shib solishtiring. Ellik yuzdan qirq beshdan katta." }
      },
      // 2-bosqich — TARTIBLASH (o'sish tartibida tap)
      {
        kind: 'order',
        label: { ru: 'Расставь', uz: "Tartiblang" },
        title: { ru: 'От меньшего к большему', uz: "Kichikdan kattaga" },
        lead: { ru: 'Тапай по возрастанию: сначала самое маленькое.', uz: "O'sish tartibida bosing: avval eng kichigi." },
        cards: [{ label: '0,3', v: 0.3 }, { label: '0,25', v: 0.25 }, { label: '0,205', v: 0.205 }, { label: '0,5', v: 0.5 }],
        hint_wrong: { ru: 'Сейчас это не самое маленькое. Выровняй по запятой — больше цифр не значит больше.', uz: "Bu hozir eng kichigi emas. Vergul bo'yicha tenglang — raqam ko'p son katta degani emas." },
        done_text: { ru: 'Верно! По возрастанию: 0,205, 0,25, 0,3, 0,5. Длина не главное.', uz: "To'g'ri! O'sish tartibi: 0,205, 0,25, 0,3, 0,5. Uzunlik muhim emas." },
        say: { ru: "Теперь расставь числа по возрастанию, от меньшего к большему. Число с большим количеством цифр не всегда больше.", uz: "Endi sonlarni o'sish tartibida joylang, kichikdan kattaga. Raqami ko'p son har doim katta emas." },
        noSay: { ru: "Не то. Выровняй по запятой и сравни разряды.", uz: "Bu emas. Vergul bo'yicha tenglab, xonalarni solishtiring." }
      },
      // 3-bosqich — XATO-TOP (noto'g'ri solishtirishni top, MC)
      {
        kind: 'findwrong',
        label: { ru: 'Найди ошибку', uz: "Xatoni toping" },
        title: { ru: 'Где ошибка?', uz: "Xato qayerda?" },
        question: { ru: 'Одно сравнение неверное. Найди его.', uz: "Bitta solishtirish noto'g'ri. Uni toping." },
        opts: [
          { ru: '0,3 > 0,25', uz: '0,3 > 0,25' },
          { ru: '0,5 < 0,49', uz: '0,5 < 0,49' },
          { ru: '0,7 > 0,68', uz: '0,7 > 0,68' },
          { ru: '0,6 = 0,60', uz: '0,6 = 0,60' }
        ],
        correct: 1,
        ok: { ru: 'Верно. 0,5 = 0,50, а 0,50 > 0,49 — знак < поставлен неправильно.', uz: "To'g'ri. 0,5 = 0,50, 0,50 esa 0,49 dan katta — < belgisi noto'g'ri qo'yilgan." },
        no: { ru: 'Допиши нули и проверь каждое: 0,50 и 0,49 — кто больше?', uz: "Nol qo'shib, har birini tekshiring: 0,50 va 0,49 — qaysi katta?" },
        say: { ru: "Последняя задача. Здесь четыре сравнения, но одно из них неверное. Найди ошибочное.", uz: "Oxirgi topshiriq. Bu yerda to'rtta solishtirish, biri noto'g'ri. Xatosini toping." },
        noSay: { ru: "Проверь каждое сравнение. Допиши нули до одного разряда.", uz: "Har bir solishtirishni tekshiring. Bitta xonagacha nol qo'shing." }
      }
    ]
  },

  // ===== s9 TEST tap MC — 0,47 ni o'ndangacha yaxlitla =====
  s9: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Округли до десятых', uz: "O'ndangacha yaxlitlang" },
    question: { ru: 'Округли 0,47 до десятых.', uz: "0,47 ni o'ndangacha yaxlitlang." },
    opt0: { ru: '0,5', uz: '0,5' },
    opt1: { ru: '0,4', uz: '0,4' },
    opt2: { ru: '0,47', uz: '0,47' },
    correct_text: { ru: 'Верно. После десятых стоит 7 — это 5 или больше, округляем вверх: 0,5.', uz: "To'g'ri. O'ndandan keyin 7 — bu 5 yoki katta, yuqoriga: 0,5." },
    wrong_1: { ru: 'Вниз округляют, если следующая цифра меньше 5. А тут 7 — вверх.', uz: "Keyingi raqam 5 dan kichik bo'lsa pastga. Bu yerda 7 — yuqoriga." },
    wrong_2: { ru: 'Округлить до десятых — оставить одну цифру после запятой. Смотри на вторую.', uz: "O'ndangacha yaxlitlash — verguldan keyin bitta raqam qoldirish. Ikkinchisiga qarang." },
    audio: {
      intro: { ru: "Округли ноль целых сорок семь сотых до десятых. Посмотри на цифру после десятых.", uz: "Nol butun yuzdan qirq yettini o'ndangacha yaxlitlang. O'ndandan keyingi raqamga qarang." },
      on_correct: { ru: "Верно, ноль целых пять десятых.", uz: "To'g'ri, nol butun o'ndan besh." },
      on_wrong: { ru: "Посмотри на цифру после десятых: 5 или больше — вверх.", uz: "O'ndandan keyingi raqamga qarang: 5 yoki katta — yuqoriga." }
    }
  },

  // ===== s_practice — aralash mashq (SeqMC) =====
  s_practice: {
    eyebrow: { ru: 'Тренировка', uz: "Mashq" },
    title: { ru: 'Сравни и округли', uz: "Solishtiring va yaxlitlang" },
    lead: { ru: 'Четыре примера на сравнение и округление.', uz: "Solishtirish va yaxlitlashga to'rtta misol." },
    bridge: { ru: 'Получается! Закрепим на нескольких примерах.', uz: "Bo'lyapti! Bir nechta misolda mustahkamlaymiz." },
    questions: [
      {
        q: { ru: '0,8 или 0,75 — что больше?', uz: "0,8 yoki 0,75 — qaysi katta?" },
        say: { ru: "Что больше: ноль целых восемь десятых или ноль целых семьдесят пять сотых?", uz: "Qaysi katta: nol butun o'ndan sakkiz yoki nol butun yuzdan yetmish besh?" },
        opts: [{ ru: '0,8', uz: '0,8' }, { ru: '0,75', uz: '0,75' }, { ru: 'Равны', uz: 'Teng' }],
        correct: 0,
        ok: { ru: 'Верно: 0,80 это 80 сотых, больше 75.', uz: "To'g'ri: 0,80 — 80 yuzdan, 75 dan katta." },
        no: { ru: 'Допиши ноль: 0,80 и 0,75.', uz: "Nol qo'shing: 0,80 va 0,75." }
      },
      {
        q: { ru: '0,42 → до десятых?', uz: "0,42 → o'ndangacha?" },
        say: { ru: "Округли ноль целых сорок две сотых до десятых.", uz: "Nol butun yuzdan qirq ikkini o'ndangacha yaxlitlang." },
        opts: [{ ru: '0,4', uz: '0,4' }, { ru: '0,5', uz: '0,5' }, { ru: '0,42', uz: '0,42' }],
        correct: 0,
        ok: { ru: 'Верно: после десятых 2, меньше 5 — вниз: 0,4.', uz: "To'g'ri: o'ndandan keyin 2, 5 dan kichik — pastga: 0,4." },
        no: { ru: 'Следующая цифра 2, меньше 5 — округляем вниз.', uz: "Keyingi raqam 2, 5 dan kichik — pastga." }
      },
      {
        q: { ru: '3,7 → до целого?', uz: "3,7 → butungacha?" },
        say: { ru: "Округли три целых семь десятых до целого.", uz: "Uch butun o'ndan yettini butungacha yaxlitlang." },
        opts: [{ ru: '4', uz: '4' }, { ru: '3', uz: '3' }, { ru: '3,7', uz: '3,7' }],
        correct: 0,
        ok: { ru: 'Верно: 7 это 5 или больше — вверх: 4.', uz: "To'g'ri: 7 — 5 yoki katta — yuqoriga: 4." },
        no: { ru: '3,7 ближе к 4, чем к 3.', uz: "3,7 uchdan ko'ra 4 ga yaqin." }
      },
      {
        q: { ru: '0,6 или 0,60 — что больше?', uz: "0,6 yoki 0,60 — qaysi katta?" },
        say: { ru: "Что больше: ноль целых шесть десятых или ноль целых шестьдесят сотых?", uz: "Qaysi katta: nol butun o'ndan olti yoki nol butun yuzdan oltmish?" },
        opts: [{ ru: 'Равны', uz: 'Teng' }, { ru: '0,60', uz: '0,60' }, { ru: '0,6', uz: '0,6' }],
        correct: 0,
        ok: { ru: 'Верно: 0,6 = 0,60. Ноль в конце ничего не меняет.', uz: "To'g'ri: 0,6 = 0,60. Oxirdagi nol o'zgartirmaydi." },
        no: { ru: 'Допиши ноль: 0,6 это 0,60. Равны.', uz: "Nol qo'shing: 0,6 — 0,60. Teng." }
      }
    ],
    audio: {
      intro: { ru: "Тренировка. Четыре примера на сравнение и округление.", uz: "Mashq. Solishtirish va yaxlitlashga to'rtta misol." },
      on_correct: { ru: "Верно.", uz: "To'g'ri." },
      on_wrong: { ru: "Не совсем, попробуй ещё.", uz: "Unchalik emas, yana urinib ko'ring." },
      on_done: { ru: "Молодец, всё верно.", uz: "Barakalla, hammasi to'g'ri." }
    }
  },

  // ===== s10 TEST find-the-wrong + sport fakti =====
  s10: {
    eyebrow: { ru: 'Найди ошибку', uz: "Xatoni toping" },
    title: { ru: 'Найди неверное', uz: "Noto'g'risini toping" },
    question: { ru: 'Какое утверждение ОШИБОЧНО?', uz: "Qaysi tasdiq XATO?" },
    opt0: { ru: '0,8 больше 0,75', uz: "0,8 > 0,75" },
    opt1: { ru: '3,7 округляется до 4', uz: "3,7 ≈ 4" },
    opt2: { ru: '0,45 больше 0,5', uz: "0,45 > 0,5" },
    opt3: { ru: '0,50 равно 0,5', uz: "0,50 = 0,5" },
    correct_text: { ru: 'Точно! 0,45 больше 0,5 — ошибка. 0,50 это 50 сотых, 0,45 это 45. На деле 0,45 меньше.', uz: "Aniq topdingiz! 0,45 > 0,5 — xato. 0,50 — 50 yuzdan, 0,45 — 45. Aslida 0,45 kichik." },
    wrong_0: { ru: '0,8 больше 0,75 — верно (0,80 это 80 сотых). Ищи ошибочное.', uz: "0,8 > 0,75 — to'g'ri (0,80 — 80 yuzdan). Xatosini qidiring." },
    wrong_1: { ru: '3,7 округляется до 4 — верно, ближе к четырём. Ищи ошибочное.', uz: "3,7 ≈ 4 — to'g'ri, to'rtga yaqin. Xatosini qidiring." },
    wrong_3: { ru: '0,50 равно 0,5 — верно, ноль в конце не меняет. Ищи ошибочное.', uz: "0,50 = 0,5 — to'g'ri, oxirdagi nol o'zgartirmaydi. Xatosini qidiring." },
    fact: { ru: 'Измерительные приборы округляют: весы показывают массу до десятых долей грамма.', uz: "O'lchov asboblari yaxlitlaydi: tarozi massani grammning o'ndan ulushigacha ko'rsatadi." },
    audio: {
      intro: { ru: "Будь внимателен: одно утверждение ошибочно. Найди неверное.", uz: "Diqqatli bo'ling: bitta tasdiq xato. Noto'g'risini toping." },
      on_correct: { ru: "Верно. Сорок пять сотых меньше пятидесяти. Кстати, весы тоже округляют массу до десятых долей грамма.", uz: "To'g'ri. Yuzdan qirq besh ellikdan kichik. Aytgancha, tarozi ham massani grammning o'ndan ulushigacha yaxlitlaydi." },
      on_wrong: { ru: "Это утверждение верное. Ищи ошибочное.", uz: "Bu tasdiq to'g'ri. Xatosini qidiring." }
    }
  },

  // ===== s11 CASE setup — Sherzod uzunlikka =====
  s11: {
    eyebrow: { ru: 'Жизненная задача', uz: "Hayotiy masala" },
    title: { ru: 'Прыжок Шерзода', uz: "Sherzodning sakrashi" },
    bridge: { ru: 'Потренировались. Теперь применим это в жизни.', uz: "Mashq qildik. Endi buni hayotda qo'llaymiz." },
    lead: { ru: 'Шерзод прыгает в длину. Две попытки: 4,25 м и 4,3 м. Дальняя попытка идёт в зачёт.', uz: "Sherzod uzunlikka sakraydi. Ikki urinish: 4,25 m va 4,3 m. Uzoq urinish hisobga olinadi." },
    note: { ru: 'Какая попытка дальше: 4,25 м или 4,3 м?', uz: "Qaysi urinish uzoqroq: 4,25 m yoki 4,3 m?" },
    compact: { ru: 'Попытки: 4,25 м и 4,3 м', uz: "Urinishlar: 4,25 m va 4,3 m" },
    btn_help: { ru: 'Помочь Шерзоду', uz: "Sherzodga yordam berish" },
    audio: { ru: "Потренировались, теперь задача из жизни. Шерзод прыгает в длину, две попытки: четыре целых двадцать пять сотых и четыре целых три десятых метра. Какая дальше?", uz: "Mashq qildik, endi hayotiy masala. Sherzod uzunlikka sakraydi, ikki urinish: to'rt butun yuzdan yigirma besh va to'rt butun o'ndan uch metr. Qaysi uzoqroq?" }
  },

  // ===== s12 CASE MC — 4,3 uzoqroq + fan fakti =====
  s12: {
    eyebrow: { ru: 'Проверка', uz: "Tekshiruv" },
    title: { ru: 'Какая попытка дальше', uz: "Qaysi urinish uzoqroq" },
    question: { ru: 'Какая попытка Шерзода дальше?', uz: "Sherzodning qaysi urinishi uzoqroq?" },
    opt0: { ru: '4,3 м', uz: '4,3 m' },
    opt1: { ru: '4,25 м', uz: '4,25 m' },
    opt2: { ru: 'Они равны', uz: 'Teng' },
    opt3: { ru: 'Сравнить нельзя', uz: "Solishtirib bo'lmaydi" },
    correct_text: { ru: 'Верно. 4,3 = 4,30 это 30 сотых, а 4,25 это 25. Значит 4,3 м дальше.', uz: "To'g'ri. 4,3 = 4,30 — 30 yuzdan, 4,25 — 25. Demak 4,3 m uzoqroq." },
    wrong_1: { ru: 'В 4,25 цифр больше, но допиши ноль ко второму и сравни сотые.', uz: "4,25 da raqam ko'p, lekin ikkinchisiga nol qo'shib yuzdanlarni solishtiring." },
    wrong_2: { ru: 'Допиши ноль: 4,30 и 4,25. Сотые одинаковые?', uz: "Nol qo'shing: 4,30 va 4,25. Yuzdanlar bir xilmi?" },
    wrong_3: { ru: 'Сравнить можно: допиши ноль и сравни разряды.', uz: "Solishtirsa bo'ladi: nol qo'shib xonalarni solishtiring." },
    fact: { ru: 'Измерительные приборы округляют: весы показывают массу до десятых долей грамма.', uz: "O'lchov asboblari yaxlitlaydi: tarozi massani grammning o'ndan ulushigacha ko'rsatadi." },
    fact_audio: { ru: "Кстати, измерительные приборы тоже округляют. Весы показывают массу до десятых долей грамма.", uz: "Aytgancha, o'lchov asboblari ham yaxlitlaydi. Tarozi massani grammning o'ndan ulushigacha ko'rsatadi." },
    audio: {
      intro: { ru: "Помоги Шерзоду. Какая попытка дальше: четыре целых двадцать пять сотых или четыре целых три десятых?", uz: "Sherzodga yordam bering. Qaysi urinish uzoqroq: to'rt butun yuzdan yigirma besh yoki to'rt butun o'ndan uch?" },
      on_correct: { ru: "Верно, четыре целых три десятых дальше.", uz: "To'g'ri, to'rt butun o'ndan uch uzoqroq." },
      on_wrong: { ru: "Не совсем. Допиши ноль и сравни сотые.", uz: "Unchalik emas. Nol qo'shib yuzdanlarni solishtiring." }
    }
  },

  // ===== s13 FINAL MC — to'g'ri tasdiq + pi fakti =====
  s13: {
    eyebrow: { ru: 'Итоговый вопрос', uz: "Yakuniy savol" },
    title: { ru: 'Найди верное', uz: "To'g'risini toping" },
    question: { ru: 'Какое утверждение ВЕРНО?', uz: "Qaysi tasdiq TO'G'RI?" },
    opt0: { ru: '0,5 больше 0,45', uz: "0,5 > 0,45" },
    opt1: { ru: '0,45 больше 0,5', uz: "0,45 > 0,5" },
    opt2: { ru: '2,3 округляется до 3', uz: "2,3 ≈ 3" },
    opt3: { ru: '0,7 равно 0,07', uz: "0,7 = 0,07" },
    correct_text: { ru: 'Верно. 0,5 = 0,50 это 50 сотых, 0,45 это 45. Значит 0,5 больше.', uz: "To'g'ri. 0,5 = 0,50 — 50 yuzdan, 0,45 — 45. Demak 0,5 katta." },
    wrong_1: { ru: 'Допиши ноль и сравни 0,50 и 0,45.', uz: "Nol qo'shib 0,50 va 0,45 ni solishtiring." },
    wrong_2: { ru: '2,3: следующая цифра 3, меньше 5 — вниз, до 2.', uz: "2,3: keyingi raqam 3, 5 dan kichik — pastga, 2 ga." },
    wrong_3: { ru: 'В 0,7 семёрка в десятых, в 0,07 — в сотых. Разные числа.', uz: "0,7 da 7 o'ndanda, 0,07 da yuzdanda. Har xil son." },
    fact: { ru: 'Число пи равно 3,14159… и бесконечно. 3,14 — уже округлённое значение.', uz: "Pi soni 3,14159… ga teng va cheksiz. 3,14 — allaqachon yaxlitlangan qiymat." },
    audio: {
      intro: { ru: "Итоговый вопрос. Из четырёх утверждений выбери верное.", uz: "Yakuniy savol. To'rt tasdiqdan to'g'risini tanlang." },
      on_correct: { ru: "Верно, ноль целых пять десятых больше. Кстати, число пи бесконечно: 3,14 это уже округлённое значение.", uz: "To'g'ri, nol butun o'ndan besh katta. Aytgancha, pi soni cheksiz: 3,14 — allaqachon yaxlitlangan qiymat." },
      on_wrong: { ru: "Не совсем. Проверь каждое: допиши нули, посмотри следующую цифру.", uz: "Unchalik emas. Har birini tekshiring: nol qo'shing, keyingi raqamga qarang." }
    }
  },

  // ===== s14 SUMMARY =====
  s14: {
    eyebrow: { ru: 'Итог', uz: "Yakun" },
    heading: { ru: 'Что ты теперь умеешь', uz: "Endi nimani bilasiz" },
    title: { ru: 'Теперь вы умеете сравнивать и округлять десятичные', uz: "Endi siz o'nli kasrlarni solishtirish va yaxlitlashni bilasiz" },
    main_label: { ru: 'Главное', uz: "Asosiy" },
    main_1: { ru: 'Сравнивай по разрядам, а не по длине: выровняй по запятой, допиши нули.', uz: "Uzunlik emas, xona bo'yicha solishtiring: vergulni tenglab, nol qo'shing." },
    main_2: { ru: 'Округляй по следующей цифре: 5 и больше — вверх, меньше — вниз.', uz: "Keyingi raqamga qarab yaxlitlang: 5 va katta — yuqoriga, kichik — pastga." },
    main_3: { ru: '0,5 = 0,50: нули в конце не меняют число.', uz: "0,5 = 0,50: oxirdagi nollar sonni o'zgartirmaydi." },
    hook_close: { ru: 'Помнишь загадку? Мафтуна прыгнула выше: 1,50 больше 1,45. Решают разряды, а не число цифр.', uz: "Topishmoq yodingizdami? Maftuna balandroq sakradi: 1,50, 1,45 dan katta. Raqam soni emas, xonalar hal qiladi." },
    conn_label_refs: { ru: 'Опирается на', uz: "Tayanadi" },
    conn_refs: { ru: 'Десятичная дробь — концепт, эквивалентные дроби.', uz: "O'nli kasr — konsept, ekvivalent kasrlar." },
    conn_label_next: { ru: 'Дальше', uz: "Keyingi dars" },
    conn_next: { ru: 'Сложение и вычитание десятичных дробей.', uz: "O'nli kasrlarni qo'shish va ayirish." },
    btn_restart: { ru: 'Пройти заново', uz: "Qaytadan o'tish" },
    audio: { ru: "Итак, мы научились сравнивать и округлять десятичные дроби. Сравниваем по разрядам, выровняв по запятой. Округляем по следующей цифре: пять или больше вверх, меньше вниз. И длина числа не главное.", uz: "Demak, o'nli kasrlarni solishtirish va yaxlitlashni o'rgandik. Vergul bo'yicha tenglab, xona bo'yicha solishtiramiz. Keyingi raqamga qarab yaxlitlaymiz: besh yoki katta yuqoriga, kichik pastga. Va sonning uzunligi muhim emas." }
  }
};

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
// Bridge — slaydlararo ma'noli o'tish qatori (faza chegaralarida). Ovozda intro'ga qo'shilgan.
const Bridge = ({ node }) => { const t = useT(); return node ? <p className="bridge fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(node))}</p> : null; };

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
const FB_IT    = { ru: 'Знаешь ли ты? · IT',    uz: "Bilasizmi? · IT" };
const FB_SPORT = { ru: 'Знаешь ли ты? · Спорт', uz: "Bilasizmi? · Sport" };
const FB_SCI   = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" };

const FactCard = ({ text, anim, badge }) => {
  const t = useT();
  return (
    <div className="fact-card fade-up">
      {anim && <div className="fact-anim">{anim}</div>}
      <div className="fact-body">
        <p className="fact-badge"><span className="fact-dot"/>{t(badge)}</p>
        <p className="fact-text">{mt(t(text))}</p>
      </div>
    </div>
  );
};

// ============================================================
// FAKT-ANIMATSIYALAR (CSS-only loop, ko'k tema)
// ============================================================
const AnimDot = () => (<div className="fa-dot" aria-hidden="true"><span className="fa-dot-n">3</span><span className="fa-dot-sep"><span className="fa-dot-c">,</span><span className="fa-dot-p">.</span></span><span className="fa-dot-n">14</span></div>);
const AnimRuler = () => (<div className="fa-rul" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <span key={i} className="fa-rul-t" style={{ animationDelay: (i * 0.12) + 's' }}/>)}</div>);
const AnimPi = () => (<div className="fa-pi" aria-hidden="true"><span className="fa-pi-orb"/><span className="fa-pi-sym">π</span></div>);

// ============================================================
// VIZUALIZATORLAR (dec_5_02): DecimalGrid, DecLabel, PlaceTable, JumpBars, RoundLine
// ============================================================
const decFmt = (v) => String(v).replace('.', ',');

// DecimalGrid — birlik kvadrat: o'ndan (10 ustun) yoki yuzdan (10x10), jonli to'lish.
const DecimalGrid = ({ value = 0, mode = 'tenths', color = T.accent, sz = 130, live = false }) => {
  const n = mode === 'tenths' ? 10 : 100;
  const onCount = mode === 'tenths' ? Math.round(value * 10) : Math.round(value * 100);
  const base = mode === 'tenths' ? 'dg-col' : 'dg-cell';
  return (
    <div className={'dg-square ' + (mode === 'tenths' ? 'dg-tenths' : 'dg-hgrid') + (live ? ' dg-live' : '')} style={{ width: sz, height: sz }} aria-hidden="true">
      {Array.from({ length: n }).map((_, i) => (<div key={i} className={base} style={{ background: i < onCount ? color : undefined }}/>))}
    </div>
  );
};

const DecLabel = ({ value, color, text }) => (
  <span className="display" style={{ fontSize: 'clamp(26px, 5vw, 38px)', color: color || T.ink, fontVariantNumeric: 'tabular-nums', display: 'inline-block' }}>{text != null ? text : decFmt(value)}</span>
);

// PlaceTable — razryad jadvali (butun | , | o'ndan | yuzdan | mingdan).
const PlaceTable = ({ whole = 0, tenths = null, hundredths = null, thousandths = null, highlight = '', places = 3 }) => {
  const t = useT();
  const allCols = [
    { key: 'birlar', label: { ru: 'Цел.', uz: 'Butun' }, val: whole },
    { key: 'ondan', label: { ru: 'Дес.', uz: "O'ndan" }, val: tenths },
    { key: 'yuzdan', label: { ru: 'Сот.', uz: 'Yuzdan' }, val: hundredths },
    { key: 'mingdan', label: { ru: 'Тыс.', uz: 'Mingdan' }, val: thousandths },
  ];
  const cols = allCols.slice(0, 1 + places);
  return (
    <div className="pt-wrap">
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

// JumpBars — s0 hook: ikki sportchi + sonlari + "?". Balandliklar bir xil (javobni ochmaydi).
const JumpBars = () => (
  <div className="jb-wrap" aria-hidden="true">
    <div className="jb-col"><div className="jb-fig jb-fig-a"/><div className="jb-num display">1,45</div><div className="jb-name mono small">Jahongir</div></div>
    <div className="jb-q display">?</div>
    <div className="jb-col"><div className="jb-fig jb-fig-b"/><div className="jb-num display">1,5</div><div className="jb-name mono small">Maftuna</div></div>
  </div>
);

// SignsRow — mavzuli figura: solishtirish/yaxlitlash belgilari sakraydi (test ekranlari bezagi).
const SignsRow = ({ signs }) => (
  <div className="sgn-row" aria-hidden="true">{signs.map((s, i) => <span key={i} className="sgn" style={{ animationDelay: `${i * 0.25}s` }}>{s}</span>)}</div>
);

// RoundLine — yaxlitlash son o'qi: value belgisi + eng yaqin belgini yoritish.
const RoundLine = ({ lo, hi, value, highlight = null, divisions = 10 }) => {
  const span = hi - lo;
  const pos = ((value - lo) / span) * 100;
  return (
    <div className="rl-track" aria-hidden="true">
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
      <div className="rl-marker" style={{ left: pos + '%' }}><span className="rl-marker-val mono small">{decFmt(value)}</span><span className="rl-marker-dot"/></div>
    </div>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR
// ============================================================

// s0 — HOOK (M3). Qaytishda picked TO'LIQ sbros.
const Screen0 = ({ screen, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s0;
  const audio = useAudio(makeAudioSegments(c, lang));
  const opts = [c.opt0, c.opt1, c.opt2];
  const reveals = [c.reveal0, c.reveal1, c.reveal2];
  const [picked, setPicked] = useState(null);
  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer({ stage: 'hook', screenIdx: 0, question: c.lead[lang], options: opts.map(o => o[lang]), correctIndex: null, correctAnswer: null, studentAnswerIndex: i, studentAnswer: opts[i][lang], correct: null, firstTry: null });
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={picked === null} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 14px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.title))}</h2>
        <h2 className="title h-sub fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.lead))}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 20px)' }}>
          <JumpBars/>
        </div>
        <div className="fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {opts.map((o, i) => (
            <button key={i} className="option" disabled={picked !== null} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: picked === i ? '0 8px 22px -6px rgba(255, 79, 40, 0.38)' : undefined }}>
              <span className="mono small" style={{ minWidth: 20, color: T.ink3 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{mt(t(o))}</span>
            </button>
          ))}
        </div>
        {picked !== null && <p className="body fade-up" style={{ position: 'relative', margin: 0, color: T.ink2 }}>{mt(t(reveals[picked]))}</p>}
      </div>
    </Stage>
  );
};

// ============================================================
// SeqMC — ketma-ket bir nechta tez MC (warmup / practice). Mobil-do'st tap (klaviatura yo'q).
// Har savolda веди-до-верного: noto'g'ri o'chadi, to'g'ridan keyin avtomatik keyingisiga o'tadi.
// scored=true bo'lsa, oxirida bitta natija yuboradi (barcha birinchi urinish to'g'ri bo'lsa — correct).
// ============================================================
const SeqMC = ({ screen, screenContent, scored, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent; const sfx = useSfx();
  const [qs] = useState(() => c.questions.map(item => {
    const ord = item.opts.map((_, i) => i);
    for (let k = ord.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = ord[k]; ord[k] = ord[j]; ord[j] = tmp; }
    return { ...item, opts: ord.map(i => item.opts[i]), correct: ord.indexOf(item.correct) };
  }));
  const n = qs.length;
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
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(13px, 2.3vw, 18px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
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
            <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              {(() => { const qStr = tx(q.q); return qStr.length <= 12
                ? <div className="dm-prob">{mt(qStr)}</div>
                : <p className="title h-sub" style={{ margin: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{mt(qStr)}</p>; })()}
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {q.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrong.has(i); const isCorr = i === q.correct;
                if (solvedItem && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solvedItem || isWrong} onClick={() => pick(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {tx(o)}
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

// s1 — WARM-UP: 4 ta tez aralash misol (tap)
const Screen1 = (props) => <SeqMC {...props} screenContent={CONTENT.s1} scored={false}/>;
// s_practice — TRENIROVKA: 4 ta oson ko'paytma (tap, scored)
const ScreenPractice = (props) => <SeqMC {...props} screenContent={CONTENT.s_practice} scored={true}/>;

// s2 — EXPLORATION: nol qo'shib solishtirish (DecimalGrid, step)
const Screen2 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s2;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s2_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const aligned = step >= 2; const won = step >= 3;
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <Bridge node={c.bridge}/>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(14px, 3vw, 28px)', justifyContent: 'center', flexWrap: 'wrap', minHeight: 168 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <DecimalGrid value={0.5} mode={aligned ? 'hundredths' : 'tenths'} color={won ? T.success : T.accent} sz={118}/>
            <DecLabel value={0.5} color={won ? T.success : T.accent} text={aligned ? '0,50' : '0,5'}/>
          </div>
          <span className="display" style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: won ? T.success : T.ink3, paddingBottom: 30 }}>{won ? '>' : '?'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <DecimalGrid value={0.45} mode="hundredths" color={T.blue} sz={118}/>
            <DecLabel value={0.45} color={T.blue}/>
          </div>
        </div>
        {step >= 1 && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {c.step_labels[lang].slice(0, step).map((label, i) => {
              const green = won && i === step - 1;
              return <div key={i} className={`cap-line fade-up${green ? ' cap-line-ok' : ''}`}><span className="cap-mark">{green ? '✓' : i + 1}</span><p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(label))}</p></div>;
            })}
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — EXPLORATION: yaxlitlash (RoundLine, step)
const Screen3 = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s3;
  const arr = c.audio[lang]; const last = arr.length - 1;
  const segs = arr.map((text, i) => ({ id: `s3_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < last ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0);
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isPlaying && !audio.muted} label={step < last ? t(c.btn_step) : t(c.btn_final)} onClick={handleStep}/></>);
  const third = step >= 3;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 15px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(c.title))}</h2>
        <p className="body fade-up" style={{ color: T.ink2, margin: 0 }}>{mt(t(c.lead))}</p>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', justifyContent: 'center', minHeight: 150, padding: 'clamp(18px, 3vw, 28px) clamp(20px, 4vw, 36px)' }}>
          {third
            ? <RoundLine lo={3} hi={4} value={3.7} highlight={step >= 2 ? 4 : null} divisions={10}/>
            : <RoundLine lo={0.4} hi={0.5} value={0.46} highlight={step >= 2 ? 0.5 : null} divisions={10}/>}
        </div>
        {step >= 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {c.step_labels[lang].slice(0, step).map((label, i) => (
              <div key={i} className="cap-line fade-up"><span className="cap-mark">{i + 1}</span><p className="body" style={{ margin: 0, fontWeight: 600 }}>{mt(t(label))}</p></div>
            ))}
          </div>
        )}
      </div>
    </Stage>
  );
};

// s5 + s6 — RULE solishtirish + yaxlitlash (progressiv: chip)
const ScreenRule = ({ screen, onNext, onPrev }) => {
  const lang = useLang(); const t = useT();
  const c5 = CONTENT.s5; const c6 = CONTENT.s6;
  const audio = useAudio([
    { id: 'rule_a0', text: c5.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'more' } },
    { id: 'rule_a1', text: c6.audio[lang], trigger: 'on_event:more', waits_for: { type: 'button_click', target: 'next' } }
  ]);
  const [phase, setPhase] = useState(0); const moreRef = useRef(false);
  const rules = [c5.rule_1, c5.rule_2, c5.rule_3, c5.rule_4];
  const reveal = () => { setPhase(1); if (!moreRef.current) { moreRef.current = true; audio.triggerInternal('more'); } };
  const goNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={lang === 'uz' ? "Davom etish" : 'Дальше'}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={goNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={phase === 0 ? c5.eyebrow : c6.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        {phase === 0 ? (
          <>
            <Bridge node={c5.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c5.heading))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
              <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c5.rule_label)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {rules.map((r, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(r))}</p></div>))}
              </div>
            </div>
            <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <p className="small mono" style={{ margin: 0, color: T.ink3 }}>0,5 = 0,50</p>
              <PlaceTable whole={0} tenths={5} hundredths={0} highlight="ondan" places={2}/>
            </div>
          </>
        ) : (
          <>
            <button className="rule-chip fade-up" onClick={() => setPhase(0)} style={{ position: 'relative' }}>
              <span className="rule-chip-ic" aria-hidden="true"><IconOk/></span>
              <span className="rule-chip-tx">{mt(t(c5.heading))}</span>
              <span className="rule-chip-act">{lang === 'uz' ? "ko'rish" : 'показать'}</span>
            </button>
            <h2 className="title h-title fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c6.heading))}</h2>
            <div className="frame fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c6.rule_main))}</p></div>
            <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}>
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c6.warn_label)}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c6.warn))}</p>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s7 — TEST MC: eng kattasi + IT fakti
const Screen7 = (props) => {
  const t = useT(); const c = CONTENT.s7;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [1, 2, 3, 0]);
  const question = (<><Bridge node={c.bridge}/><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={() => <SignsRow signs={['<', '=', '>']}/>} factOnCorrect={<FactCard text={c.fact} badge={FB_IT}/>}/>;
};

// s8 — 3 BOSQICHLI MASHQ: solishtirish (MC) → tartiblash (tap) → xato-top (MC). веди-до-верного, scored=practice.
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s8; const sfx = useSfx();
  const steps = c.steps; const n = steps.length;
  const orderStepIdx = steps.findIndex(s => s.kind === 'order');
  const orderCards = orderStepIdx >= 0 ? steps[orderStepIdx].cards : [];
  const orderSorted = orderCards.map((_, i) => i).sort((a, b) => orderCards[a].v - orderCards[b].v);
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: 's8_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [step, setStep] = useState(wasSolved ? n - 1 : 0);
  const [stepDone, setStepDone] = useState(wasSolved);
  const [allDone, setAllDone] = useState(wasSolved);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [placed, setPlaced] = useState([]);
  const [flash, setFlash] = useState(null);
  const [orderHint, setOrderHint] = useState(false);
  const firstTryRef = useRef(storedAnswer?.itemsFirstTry ? storedAnswer.itemsFirstTry.slice() : []);
  const introAdvRef = useRef(wasSolved);
  const advanceRef = useRef(null); const flashRef = useRef(null);
  const cur = steps[step];

  const pushOne = (node) => { if (!audio.muted && node) { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(node[lang]); } };
  const sayStep = (i) => { if (steps[i].say) pushOne(steps[i].say); };
  const markIntro = () => { if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); } };

  const goNext = () => {
    if (step < n - 1) {
      const ni = step + 1;
      setStep(ni); setStepDone(false); setPicked(null); setWrongSet(new Set());
      setPlaced([]); setOrderHint(false); setFlash(null);
      sayStep(ni);
    } else {
      setAllDone(true);
      const fts = firstTryRef.current.slice();
      const itemsCorrect = fts.filter(Boolean).length; const allOk = itemsCorrect === n;
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: c.title[lang], correctAnswer: 'all', studentAnswer: `${itemsCorrect}/${n}`, correct: allOk, firstTry: allOk, attempts: n, itemsCorrect, itemsTotal: n, itemsFirstTry: fts, solved: true });
      pushOne(c.audio.on_done);
    }
  };

  const pickMC = (i) => {
    if (stepDone || picked === cur.correct || wrongSet.has(i)) return;
    markIntro();
    const isCorrect = i === cur.correct;
    if (firstTryRef.current[step] === undefined) firstTryRef.current[step] = isCorrect;
    if (isCorrect) {
      setPicked(i); setStepDone(true); sfx.playCorrect();
      advanceRef.current = setTimeout(goNext, 950);
    } else {
      sfx.playWrong(); setWrongSet(prev => { const s = new Set(prev); s.add(i); return s; });
      pushOne(cur.noSay);
    }
  };

  const tapCard = (i) => {
    if (stepDone || placed.includes(i)) return;
    markIntro();
    const expected = orderSorted[placed.length];
    if (i === expected) {
      setOrderHint(false); const np = [...placed, i]; setPlaced(np); sfx.playCorrect();
      if (np.length === orderCards.length) {
        if (firstTryRef.current[step] === undefined) firstTryRef.current[step] = true;
        setStepDone(true);
        advanceRef.current = setTimeout(goNext, 1100);
      }
    } else {
      sfx.playWrong();
      if (firstTryRef.current[step] === undefined) firstTryRef.current[step] = false;
      setOrderHint(true); setFlash(i);
      if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 450);
      pushOne(cur.noSay);
    }
  };

  useEffect(() => () => { if (advanceRef.current) clearTimeout(advanceRef.current); if (flashRef.current) clearTimeout(flashRef.current); }, []);

  const solvedMC = picked === cur.correct;
  const promptDisplay = cur.prompt ? t(cur.prompt).replace('?', stepDone ? t(cur.opts[cur.correct]) : '?') : null;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!allDone} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Floaters/>
        <Bridge node={c.bridge}/>
        <div className="fade-up" style={{ position: 'relative' }}>
          <h2 className="title h-title" style={{ marginBottom: 6 }}>{mt(t(c.title))}</h2>
          <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="seq-dots fade-up" aria-hidden="true">
          {steps.map((_, i) => <span key={i} className={`seq-dot${(i < step || (i === step && stepDone) || allDone) ? ' seq-dot-done' : ''}${(i === step && !allDone && !stepDone) ? ' seq-dot-cur' : ''}`}/>)}
        </div>
        {allDone ? (
          <div className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.success }}><IconOk/></span>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{lang === 'uz' ? "Uchala topshiriq ham yechildi." : 'Все три задачи решены.'}</p>
          </div>
        ) : cur.kind === 'order' ? (
          <>
            <div className="fade-up delay-1" style={{ position: 'relative' }}>
              <p className="eyebrow" style={{ color: T.accent, marginBottom: 6 }}>{t(cur.label)} · {step + 1}/{n}</p>
              <h2 className="title h-sub" style={{ margin: 0, marginBottom: 4 }}>{mt(t(cur.title))}</h2>
              <p className="body" style={{ margin: 0, color: T.ink2 }}>{mt(t(cur.lead))}</p>
            </div>
            <div className="ord-slots fade-up delay-1" style={{ position: 'relative' }}>
              {orderCards.map((_, slot) => (
                <div key={slot} className="ord-slot">{placed[slot] != null ? <span className="ord-chip ord-chip-ok">{orderCards[placed[slot]].label}</span> : <span className="ord-slot-n">{slot + 1}</span>}</div>
              ))}
            </div>
            {!stepDone && <div className="ord-pool fade-up delay-2">
              {orderCards.map((_, i) => i).filter(i => !placed.includes(i)).map(i => <button key={i} className={`ord-card${flash === i ? ' ord-card-bad' : ''}`} onClick={() => tapCard(i)}>{orderCards[i].label}</button>)}
            </div>}
            {orderHint && !stepDone && <div className="frame-tip fade-up" style={{ display: 'flex', gap: 8 }}><span style={{ color: '#D8A93A' }} aria-hidden="true"><IconNo/></span><p className="body" style={{ margin: 0 }}>{mt(t(cur.hint_wrong))}</p></div>}
            {stepDone && <FeedbackBlock show={true} isCorrect={true}><p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><IconOk/>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p><p className="body" style={{ margin: 0 }}>{mt(t(cur.done_text))}</p></FeedbackBlock>}
          </>
        ) : (
          <>
            <div className="fade-up delay-1" style={{ position: 'relative' }}>
              <p className="eyebrow" style={{ color: T.accent, marginBottom: 6 }}>{t(cur.label)} · {step + 1}/{n}</p>
              {promptDisplay && <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)', marginBottom: 10 }}><div className="dm-prob">{mt(promptDisplay)}</div></div>}
              <h2 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.question))}</h2>
            </div>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: cur.kind === 'compare' ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {cur.opts.map((o, i) => {
                let cls = 'option';
                const isWrong = wrongSet.has(i); const isCorr = i === cur.correct;
                if (stepDone && isCorr) cls += ' option-correct';
                else if (isWrong) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={stepDone || isWrong} onClick={() => pickMC(i)}
                    style={{ padding: 'clamp(12px, 1.8vw, 14px) clamp(8px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.1vw, 19px)', minHeight: 'clamp(52px, 8vw, 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {t(o)}
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null || wrongSet.size > 0} isCorrect={solvedMC} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: solvedMC ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span aria-hidden="true">{solvedMC ? '✓' : '✗'}</span>{solvedMC ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}
              </p>
              <p className="body" style={{ margin: 0 }}>{mt(t(solvedMC ? cur.ok : cur.no))}</p>
            </FeedbackBlock>
          </>
        )}
      </div>
    </Stage>
  );
};

// s9 — TEST tap MC: yaxlitlash
const Screen9 = (props) => {
  const t = useT(); const c = CONTENT.s9;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 0, 1]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={() => <SignsRow signs={['<', '≈', '>']}/>}/>;
};

// s10 — TEST find-the-wrong + sport fakti
const Screen10 = (props) => {
  const t = useT(); const c = CONTENT.s10;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 2, [1, 2, 0, 3]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={() => <SignsRow signs={['<', '=', '>']}/>} factOnCorrect={<FactCard text={c.fact} badge={FB_SPORT} anim={<AnimRuler/>}/>}/>;
};

// s11 + s12 — CASE: Sherzod (progressiv, scored=practice) + fan fakti
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c0 = CONTENT.s11; const c = CONTENT.s12;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [3, 0, 1, 2]);
  const audio = useAudio([
    { id: 'case_a0', text: c0.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'help' } },
    { id: 'case_a1', text: c.audio.intro[lang], trigger: 'on_event:help', waits_for: { type: 'option_picked' } }
  ]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [phase, setPhase] = useState(wasSolved ? 1 : 0);
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const helpRef = useRef(wasSolved); const introAdvRef = useRef(wasSolved); const factRef = useRef(wasSolved);
  const reveal = () => { setPhase(1); if (!helpRef.current) { helpRef.current = true; audio.triggerInternal('help'); } };
  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isCorrect = i === correctIdx;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    attemptsRef.current += 1;
    if (!introAdvRef.current) { introAdvRef.current = true; audio.triggerEvent('option_picked'); }
    if (isCorrect) {
      setPicked(i); setSolved(true); sfx.playCorrect();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? null, screenIdx: screen, question: content.question?.[lang] ?? null, correctIndex: correctIdx, studentAnswerIndex: i, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
    } else { sfx.playWrong(); setWrong(prev => { const s = new Set(prev); s.add(i); return s; }); }
    if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) { const wv = (content[`wrong_${i}`] && content[`wrong_${i}`][lang]) || c.audio.on_wrong[lang]; e.pushOneOff(isCorrect ? c.audio.on_correct[lang] : wv); } }, 300);
  };
  useEffect(() => { if (solved && !factRef.current) { factRef.current = true; if (!audio.muted) { const e = getAudioEngine(); if (e && !audio.muted) setTimeout(() => e.pushOneOff(c.fact_audio[lang]), 1600); } } }, [solved]);
  const navContent = phase === 0
    ? (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={reveal} label={t(c0.btn_help)}/></>)
    : (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={phase === 0 ? c0.eyebrow : c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.9vw, 14px)' }}>
        <Floaters/>
        {phase === 0 ? (
          <>
            <Bridge node={c0.bridge}/>
            <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c0.title))}</h2>
            <p className="body fade-up" style={{ position: 'relative', color: T.ink2, margin: 0 }}>{mt(t(c0.lead))}</p>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 36px)' }}><span className="dm-prob">4,25</span><span className="dm-prob" style={{ color: T.ink3 }}>·</span><span className="dm-prob">4,3</span></div>
            </div>
            <p className="body fade-up delay-2" style={{ position: 'relative', margin: 0, fontWeight: 600 }}>{mt(t(c0.note))}</p>
          </>
        ) : (
          <>
            <div className="case-ctx fade-up" style={{ position: 'relative' }}><span className="case-ctx-tag">{mt(t(c0.title))}</span><span className="case-ctx-tx">{mt(t(c0.compact))}</span></div>
            <h2 className="title h-sub fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{mt(t(c.question))}</h2>
            <div className="fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
              {options.map((opt, i) => {
                let cls = 'option'; const isWrongPicked = wrong.has(i); const isCorrect = i === correctIdx; const collapse = solved && !isCorrect;
                if (solved && isCorrect) cls += ' option-correct'; else if (isWrongPicked) cls += ' option-picked-wrong';
                return (
                  <button key={i} className={cls} disabled={solved || isWrongPicked} onClick={() => pick(i)}
                    style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
                    <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>{solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}</p>
              <p className="body" style={{ margin: 0 }}>{mt(solved ? t(content.correct_text) : t(content[`wrong_${picked}`] || c.wrong_default || content.correct_text))}</p>
            </FeedbackBlock>
            {solved && <FactCard text={c.fact} badge={FB_SCI} anim={<AnimRuler/>}/>}
          </>
        )}
      </div>
    </Stage>
  );
};

// s13 — FINAL MC + pi fakti
const Screen13 = (props) => {
  const t = useT(); const c = CONTENT.s13;
  const base = [optEl(t, c.opt0), optEl(t, c.opt1), optEl(t, c.opt2), optEl(t, c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, 0, [2, 3, 0, 1]);
  const question = (<><h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={() => <SignsRow signs={['>', '≈', '=']}/>} factOnCorrect={<FactCard text={c.fact} badge={FB_SCI} anim={<AnimPi/>}/>}/>;
};

// s14 — SUMMARY
const Screen14 = ({ screen, onPrev, onReset, finishLesson }) => {
  const lang = useLang(); const t = useT(); const c = CONTENT.s14;
  const audio = useAudio(makeAudioSegments(c, lang));
  const calledRef = useRef(false);
  useEffect(() => { if (!calledRef.current) { calledRef.current = true; finishLesson(); } }, []);
  const points = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{t(c.btn_restart)}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(9px, 1.7vw, 13px)' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{mt(t(c.heading))}</h2>
        <p className="body fade-up" style={{ position: 'relative', color: T.success, fontWeight: 600, margin: 0 }}>{mt(t(c.title))}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{points.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{mt(t(m))}</p></div>))}</div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{mt(t(c.hook_close))}</p></div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

export default function DecimalCompareLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, ScreenRule, Screen7, Screen8, Screen9, ScreenPractice, Screen10, ScreenCase, Screen13, Screen14];
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
.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

/* Accessibility: prefers-reduced-motion — гасим декоративные циклы. */
/* MATH dec_5_05: AreaModel — единичный квадрат 10×10, столбцы×строки = сотые клетки. */
.am-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; width: clamp(124px, 32vw, 168px); aspect-ratio: 1; }
.am-cell { background: #EEEAE2; border-radius: 2px; transition: background 0.45s ease; }
.am-col { background: rgba(255, 79, 40, 0.24); }
.am-row { background: rgba(1, 154, 203, 0.24); }
.am-both { background: #1F7A4D; }

/* MATH dec_5_05: mbk — пошаговые клетки ввода (без запятой / знаки / ответ). */
.mbk-rows { display: flex; flex-direction: column; gap: 10px; }
.mbk-row { display: flex; align-items: center; justify-content: space-between; gap: clamp(10px, 2vw, 18px); }
.mbk-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px, 2.3vw, 17px); color: #0E0E10; }
.mbk-box { width: clamp(76px, 17vw, 98px) !important; font-size: clamp(18px, 3.4vw, 24px) !important; text-align: center; flex-shrink: 0; }
.mbk-wrong { box-shadow: 0 0 0 2px #D8A93A inset !important; }
.mbk-num { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: #FF4F28; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(255, 79, 40, 0.45); }
.mbk-num-ok { background: #1F7A4D; box-shadow: 0 4px 10px -3px rgba(31, 122, 77, 0.45); }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}





/* ============================================================ */
/* MATH: MagBar (magnituda) + ko'paytirish yozuvi + tasniflash + fakt-anim (dec_5_05). */
/* ============================================================ */
.dm-prob { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(26px, 6vw, 42px); color: #0E0E10; letter-spacing: 0.02em; text-align: center; }
.dm-res { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(26px, 6vw, 40px); color: #1F7A4D; }

.mb-wrap { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 460px; margin: 0 auto; }
.mb-row { display: flex; align-items: center; gap: 12px; }
.mb-cap { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 19px); color: #0E0E10; min-width: 46px; text-align: right; }
.mb-track { flex: 1; height: 22px; background: rgba(58, 53, 48, 0.10); border-radius: 11px; overflow: hidden; }
.mb-fill { height: 100%; border-radius: 11px; transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.mb-fill-base { background: #A7A6A2; }
.mb-fill-res { background: #FF4F28; }
.mb-fill-res.mb-more { background: #1F7A4D; }

/* Tasniflash (tap-to-place) */
.cl-pool { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 46px; align-items: center; }
.cl-pool-done { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #A7A6A2; }
.cl-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.2vw, 18px); color: #0E0E10; background: #FFFFFF; border: 2px solid #E8E4DC; border-radius: 12px; padding: 8px 13px; cursor: pointer; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.25); transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease; }
.cl-chip:disabled { cursor: default; }
.cl-chip-sel { border-color: #FF4F28; background: #FFE8E1; transform: translateY(-2px) scale(1.05); }
.cl-bins { display: flex; gap: 10px; }
.cl-bin { flex: 1; min-width: 0; border: 2px dashed #D8D3C9; border-radius: 16px; padding: 10px; min-height: 96px; display: flex; flex-direction: column; gap: 8px; cursor: default; transition: border-color 0.15s ease, background 0.15s ease; }
.cl-bin-active { border-color: #FF4F28; background: rgba(255, 79, 40, 0.05); cursor: pointer; }
.cl-bin-h { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 1.8vw, 14px); font-weight: 600; color: #5A5A60; text-align: center; }
.cl-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.cl-chip-in { box-shadow: none; }
.cl-chip-ok { border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; }
.cl-chip-bad { border-color: #FF4F28; background: #FFE8E1; }

/* Fakt-animatsiyalar (ko'k tema) */
.pa-dc { display: flex; align-items: baseline; justify-content: center; gap: 2px; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 7vw, 40px); color: #019ACB; }
.pa-dc-sep { position: relative; display: inline-block; width: 0.55em; }
.pa-dc-comma, .pa-dc-dot { position: absolute; left: 0; bottom: 0; }
.pa-dc-comma { animation: pa-dc-a 2.4s steps(1) infinite; }
.pa-dc-dot { animation: pa-dc-b 2.4s steps(1) infinite; }
@keyframes pa-dc-a { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
@keyframes pa-dc-b { 0%, 50% { opacity: 0; } 50.01%, 100% { opacity: 1; } }
.pa-st { display: flex; align-items: center; justify-content: center; gap: 1px; width: 100%; height: 100%; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px, 6vw, 38px); color: #019ACB; }
.pa-st-c { opacity: 0; animation: pa-st-in 1.8s ease-in-out infinite; }
@keyframes pa-st-in { 0% { opacity: 0; transform: translateY(4px); } 20%, 70% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; } }

/* MATH dec_5_05: SeqMC — ketma-ket tez MC progress nuqtalari. */
.seq-dots { display: flex; gap: 8px; justify-content: center; }
.seq-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.3s ease, transform 0.3s ease; }
.seq-dot-cur { background: #FF4F28; transform: scale(1.18); box-shadow: 0 0 8px rgba(255, 79, 40, 0.5); }
.seq-dot-done { background: #1F7A4D; }

/* MATH dec_5_05: MulSolve — "harakatlanuvchi yechim" (vergulsiz → sanash → vergul tushadi). */
.ms-solve { display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); align-items: center; }
.ms-row { display: flex; align-items: baseline; gap: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px, 5.5vw, 38px); color: #0E0E10; }
.ms-fac { transition: color 0.4s ease; }
.ms-dim { color: #A7A6A2; }
.ms-op { color: #5A5A60; font-weight: 600; }
.ms-digits { display: inline-flex; align-items: baseline; }
.ms-dwrap { display: inline-flex; align-items: baseline; }
.ms-d { display: inline-block; padding: 0 1px; border-radius: 4px; transition: background 0.4s ease, color 0.4s ease; }
.ms-d-hl { background: #FBF3D6; color: #0E0E10; }
.ms-comma { display: inline-block; color: #1F7A4D; animation: ms-drop 0.55s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes ms-drop { 0% { opacity: 0; transform: translateY(-0.7em) scale(0.5); } 100% { opacity: 1; transform: none; } }
.ms-result { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px, 5.5vw, 38px); color: #1F7A4D; }

/* MATH dec_5_05: rule-chip — birlashgan qoida ekranida yopilgan qoida tugmasi. */
.rule-chip { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; cursor: pointer; background: #E3F0E8; border: none; border-radius: 12px; padding: clamp(10px, 1.8vw, 13px) clamp(12px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); transition: box-shadow 0.2s ease; }
.rule-chip:hover { box-shadow: 0 10px 22px -6px rgba(31, 122, 77, 0.3); }
.rule-chip-ic { display: flex; color: #1F7A4D; flex-shrink: 0; }
.rule-chip-tx { flex: 1; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px, 1.7vw, 15px); color: #1F7A4D; }
.rule-chip-act { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 12px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A60; flex-shrink: 0; }

/* MATH dec_5_05: case-ctx — birlashgan masala ekranida shart ixcham KO'RINIB qoladigan qatori. */
.case-ctx { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; background: #EFEEE9; border-radius: 12px; padding: clamp(9px, 1.7vw, 12px) clamp(12px, 2vw, 16px); }
.case-ctx-tag { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.3vw, 11px); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #5A5A60; }
.case-ctx-tx { flex: 1; min-width: 0; font-size: clamp(12px, 1.6vw, 14px); color: #0E0E10; }
.case-ctx-prob { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(15px, 2.4vw, 19px); color: #0E0E10; }

/* MATH dec_5_05: sort — ketma-ket tasniflash (son chiqadi → chiroyli savatga joylaydi). */
.sort-tray { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: #FFFFFF; border-radius: 16px; padding: clamp(13px, 2.5vw, 18px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); min-height: clamp(84px, 15vw, 100px); }
.sort-tray-card { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: #0E0E10; animation: sort-pop 0.4s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
@keyframes sort-pop { 0% { opacity: 0; transform: translateY(-8px) scale(0.8); } 100% { opacity: 1; transform: none; } }
.sort-tray-ask { font-size: clamp(12px, 1.6vw, 13px); color: #5A5A60; }
.sort-bins { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(10px, 2vw, 14px); }
.sort-bin { display: flex; flex-direction: column; gap: 10px; background: #FFFFFF; border: none; border-radius: 16px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.16); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease; min-height: clamp(94px, 17vw, 116px); text-align: left; }
.sort-bin:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 28px -6px rgba(58, 53, 48, 0.24); }
.sort-bin:disabled { cursor: default; }
.sort-bin-h { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px, 1.7vw, 14px); padding: 5px 10px; border-radius: 9px; }
.sort-bin-sq .sort-bin-h { color: #019ACB; background: #EAF6FB; }
.sort-bin-cu .sort-bin-h { color: #5A5A60; background: #EFEEE9; }
.sort-bin-cards { display: flex; flex-wrap: wrap; gap: 6px; }
.sort-chip-in { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px, 1.8vw, 14px); color: #1F7A4D; background: #E3F0E8; border-radius: 9px; padding: 5px 9px; animation: sort-pop 0.35s ease both; }
.sort-bin-bad { animation: odShake 0.4s ease; box-shadow: 0 0 0 2px #FF4F28 inset, 0 8px 22px -6px rgba(255, 79, 40, 0.3); }

/* MATH dec_5_05: bridge — slaydlararo ma'noli o'tish qatori (faza chegarasi). */
.bridge { display: flex; align-items: center; gap: 6px; font-size: clamp(12px, 1.5vw, 13px); font-weight: 600; color: #5A5A60; }
.bridge::before { content: "\\21B3"; color: #FF4F28; font-weight: 700; font-size: 1.05em; }

/* MATH dec_5_02: DecimalGrid (o'ndan/yuzdan katak). */
.dg-square { display: grid; border: 2px solid rgba(58, 53, 48, 0.35); border-radius: 6px; overflow: hidden; background: #FFFFFF; flex-shrink: 0; }
.dg-tenths { grid-template-columns: repeat(10, 1fr); }
.dg-col { border-right: 1px solid rgba(58, 53, 48, 0.15); transition: background 0.45s ease; }
.dg-col:last-child { border-right: none; }
.dg-hgrid { grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(10, 1fr); grid-auto-flow: column; }
.dg-cell { border-right: 1px solid rgba(58, 53, 48, 0.08); border-bottom: 1px solid rgba(58, 53, 48, 0.08); transition: background 0.45s ease; }

/* MATH dec_5_02: PlaceTable. */
.pt-wrap { display: flex; align-items: stretch; gap: 5px; justify-content: center; }
.pt-comma { display: flex; align-items: flex-end; padding-bottom: 26px; font-family: 'Fraunces', serif; font-size: clamp(24px, 4.4vw, 32px); color: #FF4F28; font-weight: 600; }
.pt-col { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: clamp(38px, 8vw, 60px); }
.pt-cell { width: 100%; height: clamp(38px, 7vw, 50px); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: clamp(20px, 3.6vw, 28px); color: #0E0E10; background: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.18); }
.pt-hi .pt-cell { background: #FFE8E1; color: #FF4F28; box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.30); }
.pt-label { color: #5A5A60; font-size: clamp(9px, 1.3vw, 11px); text-align: center; line-height: 1.1; }

/* MATH dec_5_02: JumpBars — s0 hook (ikki sportchi, balandlik teng, javobni ochmaydi). */
.jb-wrap { display: flex; align-items: flex-end; gap: clamp(18px, 5vw, 40px); justify-content: center; }
.jb-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.jb-fig { width: clamp(34px, 8vw, 50px); height: clamp(34px, 8vw, 50px); border-radius: 50% 50% 46% 46%; position: relative; box-shadow: 0 8px 18px -8px rgba(58, 53, 48, 0.3); }
.jb-fig::before { content: ''; position: absolute; left: 50%; top: -42%; width: 48%; height: 48%; border-radius: 50%; transform: translateX(-50%); background: inherit; }
.jb-fig-a { background: linear-gradient(180deg, #019ACB, #6fc7e3); animation: jbHop 1.6s ease-in-out infinite; }
.jb-fig-b { background: linear-gradient(180deg, #FF4F28, #ff8a6e); animation: jbHop 1.6s ease-in-out infinite 0.5s; }
@keyframes jbHop { 0%, 100% { transform: translateY(0); } 45% { transform: translateY(-28%); } }
.jb-num { font-size: clamp(20px, 4vw, 28px); color: #0E0E10; font-variant-numeric: tabular-nums; }
.jb-name { color: #5A5A60; }
.jb-q { font-size: clamp(28px, 6vw, 42px); color: #FF4F28; align-self: center; animation: jbQ 1.8s ease-in-out infinite; }
@keyframes jbQ { 0%, 100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.18); opacity: 1; } }

/* MATH dec_5_02: RoundLine — yaxlitlash son o'qi (belgi + eng yaqin nuqta). */
.rl-track { position: relative; height: 30px; width: 100%; max-width: 460px; margin: 0 auto; }
.rl-line { position: absolute; left: 0; right: 0; top: 50%; height: 4px; background: rgba(167, 166, 162, 0.35); border-radius: 99px; transform: translateY(-50%); }
.rl-tick-wrap { position: absolute; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; }
.rl-tick { width: 2px; height: 12px; background: #A7A6A2; border-radius: 2px; }
.rl-tick-major { height: 18px; width: 2.5px; background: #0E0E10; }
.rl-tick-hi { height: 22px; width: 3px; background: #1F7A4D; box-shadow: 0 0 8px rgba(31, 122, 77, 0.5); }
.rl-num { position: absolute; top: 21px; left: 50%; transform: translateX(-50%); color: #A7A6A2; white-space: nowrap; }
.rl-num-hi { color: #1F7A4D; font-weight: 600; }
.rl-marker { position: absolute; bottom: 16px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; transition: left 0.3s cubic-bezier(0.34, 1.1, 0.64, 1); z-index: 3; }
.rl-marker-dot { width: 16px; height: 16px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 0 5px rgba(255, 79, 40, 0.16), 0 0 12px rgba(255, 79, 40, 0.55); animation: rlPulse 1.8s ease-in-out infinite; }
@keyframes rlPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
.rl-marker-val { margin-bottom: 4px; color: #FF4F28; font-weight: 600; }

/* MATH dec_5_02: fakt-animatsiyalar (nuqta/vergul, chizg'ich, pi). */
.fa-rul { position: relative; display: flex; align-items: flex-end; gap: 4px; height: 50px; padding-bottom: 4px; border-bottom: 3px solid #019ACB; }
.fa-rul-t { width: 3px; height: 18px; background: #019ACB; opacity: 0.35; border-radius: 1px; animation: faRul 2.6s ease-in-out infinite; }
.fa-rul-t:nth-child(5n+1) { height: 30px; }
@keyframes faRul { 0%, 100% { opacity: 0.3; transform: scaleY(0.7); } 50% { opacity: 1; transform: scaleY(1); } }
.fa-dot { display: flex; align-items: center; justify-content: center; gap: 2px; height: 52px; font-family: 'Fraunces', serif; font-weight: 600; color: #019ACB; }
.fa-dot-n { font-size: 34px; line-height: 1; }
.fa-dot-sep { position: relative; width: 12px; height: 34px; flex-shrink: 0; }
.fa-dot-c, .fa-dot-p { position: absolute; left: 50%; bottom: 2px; transform: translateX(-50%); font-size: 34px; line-height: 1; color: #FF4F28; }
.fa-dot-c { animation: faDotC 2.6s ease-in-out infinite; }
.fa-dot-p { animation: faDotP 2.6s ease-in-out infinite; }
@keyframes faDotC { 0%, 42% { opacity: 1; } 52%, 100% { opacity: 0; } }
@keyframes faDotP { 0%, 42% { opacity: 0; } 52%, 100% { opacity: 1; } }
.fa-pi { position: relative; width: 56px; height: 56px; border-radius: 50%; border: 3px solid #019ACB; display: flex; align-items: center; justify-content: center; }
.fa-pi-sym { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; color: #019ACB; }
.fa-pi-orb { position: absolute; top: -5px; left: 50%; width: 9px; height: 9px; border-radius: 50%; background: #FF4F28; transform-origin: 50% 33px; animation: faPiOrb 3.4s linear infinite; }
@keyframes faPiOrb { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }

/* MATH dec_5_02: order (tap-in-order) — o'sish tartibi slotlari + pool kartalari. */
.ord-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(8px, 1.8vw, 12px); }
.ord-slot { min-height: clamp(54px, 10vw, 66px); border-radius: 14px; border: 2px dashed #D8D3C9; display: flex; align-items: center; justify-content: center; }
.ord-slot-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2.4vw, 18px); color: #C8C3B9; }
.ord-chip { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(14px, 2.2vw, 17px); padding: 8px 6px; border-radius: 10px; width: 100%; text-align: center; animation: sort-pop 0.35s ease both; }
.ord-chip-ok { color: #1F7A4D; background: #E3F0E8; }
.ord-pool { display: flex; flex-wrap: wrap; gap: clamp(8px, 1.8vw, 12px); justify-content: center; }
.ord-card { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px, 2.6vw, 20px); color: #0E0E10; background: #FFFFFF; border: 2px solid #E8E4DC; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px) clamp(16px, 3vw, 22px); cursor: pointer; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.2); transition: transform 0.15s ease, border-color 0.15s ease; }
.ord-card:hover:not(:disabled) { transform: translateY(-2px); border-color: #FF4F28; }
.ord-card:disabled { cursor: default; }
.ord-card-bad { border-color: #FF4F28; background: #FFE8E1; animation: odShake 0.4s ease; }

/* MATH dec_5_02: SignsRow — mavzuli belgi figurasi (test ekranlari bezagi). */
.sgn-row { display: flex; align-items: center; justify-content: center; gap: clamp(12px, 4vw, 26px); padding: clamp(4px, 1.5vw, 8px) 0; }
.sgn { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(28px, 7vw, 44px); display: inline-block; animation: sgnBob 2.4s ease-in-out infinite; }
.sgn:nth-child(1) { color: #019ACB; }
.sgn:nth-child(2) { color: #5A5A60; }
.sgn:nth-child(3) { color: #1F7A4D; }
@keyframes sgnBob { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-7px) scale(1.14); } }

/* MATH dec_5_02: LongJump — masala figurasi (sakrovchi qum chuquriga sakraydi). */
.lj-wrap { position: relative; width: clamp(180px, 50vw, 260px); height: clamp(56px, 14vw, 76px); }
.lj-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: #A7A6A2; border-radius: 2px; }
.lj-pit { position: absolute; right: 0; bottom: 0; width: 42%; height: 10px; background: linear-gradient(180deg, #E8C97A, #d8b45a); border-radius: 4px 4px 0 0; }
.lj-jumper { position: absolute; bottom: 10px; width: clamp(22px, 6vw, 30px); height: clamp(22px, 6vw, 30px); border-radius: 50% 50% 46% 46%; background: linear-gradient(180deg, #FF4F28, #ff8a6e); box-shadow: 0 8px 18px -8px rgba(58, 53, 48, 0.3); animation: ljJump 2.8s ease-in-out infinite; }
.lj-jumper::before { content: ''; position: absolute; left: 50%; top: -40%; width: 50%; height: 50%; border-radius: 50%; transform: translateX(-50%); background: inherit; }
@keyframes ljJump { 0% { left: 8%; bottom: 10px; } 42% { left: 40%; bottom: 42px; } 72%, 100% { left: 62%; bottom: 12px; } }
.lj2 { width: clamp(180px, 50vw, 240px); height: auto; }

/* MATH dec_5_02: cap-line — qadam izohlari TO'PLANADI (yangi pastdan chiqadi, eskisi qoladi). */
.cap-line { display: flex; align-items: center; gap: 10px; background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 10px; padding: clamp(7px, 1.4vw, 10px) clamp(10px, 2vw, 14px); }
.cap-line-ok { background: #E3F0E8; border-left-color: #1F7A4D; }
.cap-mark { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: #D8A93A; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; }
.cap-line-ok .cap-mark { background: #1F7A4D; }
`;
