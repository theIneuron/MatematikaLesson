// ============================================================
// УРОК nat_5_02 — Сравнение и округление многозначных чисел, 5 класс.
// Пересборка под HTTP-контракт V5.1 (06.06.2026):
//   - инфраструктура строка-в-строку из infrastructure_v1 (HTTP-TTS:
//     buildTtsUrl, configureLesson, useSfx, gradeAnswer, stripAudioTags,
//     автостарт + resumeIfBlocked; speechSynthesis удалён);
//   - точка входа: default export = сам урок, контракт platform_contract §1
//     ({ studentName, lang, ttsApiBase, correctSoundUrl, wrongSoundUrl,
//        aiGradingEndpoint, onFinished }), фолбэки внутри, отдельной
//     Preview-обёртки и переключателя языка нет;
//   - цветовая семантика math (design_system, math-секция v1.1):
//     справочное (подсказки, правила, выводы, ring_back) — жёлтый .frame-tip.
// Урочный слой (CONTENT, экраны, визуализаторы) — без изменений от v1.
// ============================================================

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

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
    // Нет базы / нет текста → движок молчит, но логика очереди сохраняется.
    if (!base || !segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
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

const FeedbackBlock = ({ show, isCorrect, children }) => {
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
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      <div className={isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div>
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev }) => {
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
          engine.pushOneOff(isCorrect ? c.audio.on_correct[lang] : c.audio.on_wrong[lang]);
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(17px, 2.5vw, 24px)' }}>
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                style={{ padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : T.ink3 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? "Noto'g'ri" : 'Не совсем')}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {solved ? t(c.correct_text) : t(c[`wrong_${picked}`] || c.wrong_default)}
          </p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// ============================================================
// LESSON META
// ============================================================
const LESSON_META = {
  lessonId: 'nat-5-02-v2',
  lessonTitle: {
    ru: 'Сравнение и округление многозначных чисел',
    uz: "Ko'p xonali sonlarni taqqoslash va yaxlitlash"
  },
  globalQuestion: {
    ru: 'Как сравнить два космических числа и прикинуть, что больше и насколько?',
    uz: "Ikki kosmik sonni qanday taqqoslab, qaysi biri qancha kattaligini chamalash mumkin?"
  }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen',       scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's2',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',         scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen',       scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10',  type: 'test',        template: 'NumInputScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11',  type: 'case',        template: 'custom',         scored: false, scope: null },
  { id: 's12', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'case',        template: 'MCScreen',       scored: true,  scope: 'module-mikro' },
  { id: 's14', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's15', type: 'test',        template: 'MCScreen',       scored: true,  scope: 'final' },
  { id: 's16', type: 'summary',     template: 'custom',         scored: false, scope: null }
];

const TOTAL_SCREENS = SCREEN_META.length;

const CONTENT = {
  // ───────────────────────────── s0 · HOOK ─────────────────────────────
  s0: {
    eyebrow: { ru: 'Вопрос урока', uz: 'Dars savoli' },
    global_q: {
      ru: 'Как понять, какое из двух космических чисел больше?',
      uz: "Ikki kosmik sondan qaysi biri katta ekanini qanday bilish mumkin?"
    },
    claim_lead: { ru: 'Бекзод смотрит на Марс и Землю и говорит:', uz: 'Bekzod Marsga va Yerga qarab shunday deydi:' },
    claim_em: {
      ru: 'Марс больше — у него 6 779 начинается с шестёрки, а у Земли 12 742 с единицы.',
      uz: "Mars katta — uning 6 779 i oltidan, Yerning 12 742 si esa birdan boshlanadi."
    },
    planet_mars: { ru: 'Марс', uz: 'Mars' },
    planet_earth: { ru: 'Земля', uz: 'Yer' },
    question: { ru: 'Бекзод прав?', uz: 'Bekzod haqmi?' },
    opt_yes: { ru: 'Бекзод прав', uz: 'Bekzod haq' },
    opt_no: { ru: 'Бекзод ошибается', uz: 'Bekzod xato qilyapti' },
    opt_idk: { ru: 'Не уверен', uz: 'Ishonchim komil emas' },
    correctIndex: null,
    audio: {
      intro: {
        ru: 'Бекзод смотрит на два диаметра. У Марса шесть тысяч семьсот семьдесят девять километров, у Земли двенадцать тысяч семьсот сорок два. Он говорит: Марс больше, ведь его число начинается с шестёрки. Прав ли он?',
        uz: "Bekzod ikki diametrga qaraydi. Marsda olti ming yetti yuz yetmish to'qqiz kilometr, Yerda o'n ikki ming yetti yuz qirq ikki. U aytadi: Mars katta, chunki uning soni oltidan boshlanadi. U haqmi?"
      },
      on_correct: { ru: 'Хорошо. Сейчас проверим.', uz: 'Yaxshi. Hozir tekshiramiz.' },
      on_wrong: { ru: 'Хорошо. Сейчас проверим.', uz: 'Yaxshi. Hozir tekshiramiz.' }
    }
  },

  // ─────────────────────── s1 · EXPLORATION (step-by-step) ───────────────────────
  s1: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz" },
    title: { ru: 'Разложим диаметры по разрядам', uz: 'Diametrlarni xonalarga ajratamiz' },
    intro: {
      ru: 'Поставим оба числа в таблицу разрядов и посмотрим, сколько в каждом разрядов.',
      uz: "Ikkala sonni xonalar jadvaliga qo'yamiz va har birida nechta xona borligini ko'ramiz."
    },
    step1_label: { ru: 'Марс — 6 779', uz: 'Mars — 6 779' },
    step1_text: {
      ru: 'Четыре разряда: тысячи, сотни, десятки, единицы.',
      uz: "To'rt xona: minglar, yuzlar, o'nlar, birlar."
    },
    step2_label: { ru: 'Земля — 12 742', uz: 'Yer — 12 742' },
    step2_text: {
      ru: 'Пять разрядов: есть десятки тысяч, которых у Марса нет.',
      uz: "Besh xona: Marsda yo'q bo'lgan o'n minglar bor."
    },
    step3_label: { ru: 'Вывод', uz: 'Xulosa' },
    step3_text: {
      ru: 'У Земли разрядов больше — значит, она больше. Шестёрка в начале Марса ничего не решает.',
      uz: "Yerda xona ko'proq — demak, u katta. Marsning boshidagi olti hech narsani hal qilmaydi."
    },
    btn_step: { ru: 'Дальше', uz: 'Davom etish' },
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
      ]
    }
  },

  // ───────────────────────────── s2 · RULE (сравнение) ─────────────────────────────
  s2: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Как сравнивать многозначные числа?', uz: "Ko'p xonali sonlarni qanday taqqoslash mumkin?" },
    rule_1: {
      ru: 'У какого числа разрядов больше — то и больше.',
      uz: "Qaysi sonda xona ko'p bo'lsa, o'sha katta."
    },
    rule_2: {
      ru: 'Если разрядов поровну — сравниваем слева направо до первой разной цифры.',
      uz: "Agar xona soni teng bo'lsa — chapdan o'ngga, birinchi farqli raqamgacha taqqoslaymiz."
    },
    example_1: { ru: '4 879 < 139 820 — у Юпитера разрядов больше.', uz: "4 879 < 139 820 — Yupiterda xona ko'proq." },
    example_2: { ru: '50 724 > 49 244 — разрядов поровну, но слева 5 больше 4.', uz: '50 724 > 49 244 — xona teng, lekin chapda 5 — 4 dan katta.' },
    audio: {
      ru: 'Если у одного числа разрядов больше, оно больше. Если разрядов поровну, идём слева направо и сравниваем цифры до первого различия. Например, пятьдесят тысяч семьсот двадцать четыре больше сорока девяти тысяч двухсот сорока четырёх, потому что слева пять больше четырёх.',
      uz: "Agar bir sonda xona ko'p bo'lsa, u katta. Agar xona teng bo'lsa, chapdan o'ngga raqamlarni birinchi farqgacha taqqoslaymiz. Masalan, ellik ming yetti yuz yigirma to'rt qirq to'qqiz ming ikki yuz qirq to'rtdan katta, chunki chapda besh to'rtdan katta."
    }
  },

  // ─────────────────────── s3 · TEST choice (разная длина) ───────────────────────
  s3: {
    eyebrow: { ru: 'Тренировка · 1 из 4', uz: 'Mashq · 4 dan 1' },
    label: { ru: 'Сравни планеты', uz: 'Sayyoralarni taqqoslang' },
    question: { ru: 'Какая планета больше: Меркурий (4 879 км) или Юпитер (139 820 км)?', uz: 'Qaysi sayyora katta: Merkuriy (4 879 km) yoki Yupiter (139 820 km)?' },
    opt0: { ru: 'Юпитер — у него больше разрядов', uz: "Yupiter — unda xona ko'proq" },
    opt1: { ru: 'Меркурий — у него первая цифра 4', uz: 'Merkuriy — uning birinchi raqami 4' },
    opt2: { ru: 'Нельзя сказать без подсчёта цифр', uz: "Raqamlarni sanamasdan aytib bo'lmaydi" },
    correctIndex: 0,
    correct_text: {
      ru: 'Правильно. У Юпитера шесть разрядов, а у Меркурия четыре, поэтому он больше.',
      uz: "To'g'ri. Yupiterda olti xona, Merkuriyda esa to'rt, shuning uchun u katta."
    },
    wrong_1: {
      ru: 'Первая цифра не решает. У Юпитера на два разряда больше, значит, он больше при любых цифрах.',
      uz: "Birinchi raqam hal qilmaydi. Yupiterda ikkita xona ko'proq, demak u istalgan raqamlarda ham katta."
    },
    wrong_2: {
      ru: 'Считать долго не нужно. Достаточно сравнить число разрядов: шесть против четырёх.',
      uz: "Uzoq sanash shart emas. Xona sonini taqqoslash kifoya: olti va to'rt."
    },
    hint_1: { ru: 'Сравни, сколько разрядов в каждом числе, а не первую цифру.', uz: "Birinchi raqamni emas, har bir sonda nechta xona borligini taqqoslang." },
    hint_2: { ru: 'Сравнить можно сразу, посмотри на число разрядов.', uz: "Darrov taqqoslash mumkin, xonalar soniga qarang." },
    audio: {
      intro: { ru: 'Какая планета больше: Меркурий, четыре тысячи восемьсот семьдесят девять километров, или Юпитер, сто тридцать девять тысяч восемьсот двадцать? Выбери ответ.', uz: "Qaysi sayyora katta: Merkuriy, to'rt ming sakkiz yuz yetmish to'qqiz kilometr, yoki Yupiter, bir yuz o'ttiz to'qqiz ming sakkiz yuz yigirma? Javobni tanlang." },
      on_correct: { ru: 'Верно. У Юпитера шесть разрядов, а у Меркурия четыре, поэтому он больше.', uz: "To'g'ri. Yupiterda olti xona, Merkuriyda esa to'rt, shuning uchun u katta." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ─────────────────────── s4 · TEST choice (равная длина) ───────────────────────
  s4: {
    eyebrow: { ru: 'Тренировка · 2 из 4', uz: 'Mashq · 4 dan 2' },
    label: { ru: 'Сравни планеты', uz: 'Sayyoralarni taqqoslang' },
    question: { ru: 'Какая планета больше: Нептун (49 244 км) или Уран (50 724 км)?', uz: 'Qaysi sayyora katta: Neptun (49 244 km) yoki Uran (50 724 km)?' },
    opt0: { ru: 'Нептун — в нём есть крупная девятка', uz: "Neptun — unda yirik to'qqiz bor" },
    opt1: { ru: 'Уран — слева 5 больше 4', uz: 'Uran — chapda 5 — 4 dan katta' },
    opt2: { ru: 'Они почти равны', uz: 'Ular deyarli teng' },
    correctIndex: 1,
    correct_text: {
      ru: 'Правильно. Разрядов поровну, а в разряде десятков тысяч 5 больше 4.',
      uz: "To'g'ri. Xona soni teng, o'n minglar xonasida esa 5 — 4 dan katta."
    },
    wrong_0: {
      ru: 'Девятка не делает число больше. Сравниваем слева: 5 больше 4, дальше смотреть не нужно.',
      uz: "To'qqiz sonni katta qilmaydi. Chapdan taqqoslaymiz: 5 — 4 dan katta, keyingisiga qarash shart emas."
    },
    wrong_2: {
      ru: 'Близкие числа — это ещё не равные. В разряде десятков тысяч цифры разные, поэтому Уран больше.',
      uz: "Yaqin sonlar — bu hali teng emas. O'n minglar xonasida raqamlar har xil, shuning uchun Uran katta."
    },
    hint_0: { ru: 'Разрядов поровну. Сравни старшие цифры слева, а не ищи крупную девятку.', uz: "Xona teng. Yirik to'qqizni qidirma, chapdagi katta raqamlarni taqqoslang." },
    hint_2: { ru: 'Числа близкие, но не равные. Сравни цифры в старшем разряде.', uz: "Sonlar yaqin, lekin teng emas. Katta xonadagi raqamlarni taqqoslang." },
    audio: {
      intro: { ru: 'Какая планета больше: Нептун, сорок девять тысяч двести сорок четыре, или Уран, пятьдесят тысяч семьсот двадцать четыре? Выбери ответ.', uz: "Qaysi sayyora katta: Neptun, qirq to'qqiz ming ikki yuz qirq to'rt, yoki Uran, ellik ming yetti yuz yigirma to'rt? Javobni tanlang." },
      on_correct: { ru: 'Верно. Разрядов поровну, а в разряде десятков тысяч пять больше четырёх.', uz: "To'g'ri. Xona soni teng, o'n minglar xonasida esa besh to'rtdan katta." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ─────────────────────── s5 · EXPLORATION (slider, зум-ось) ───────────────────────
  s5: {
    eyebrow: { ru: 'Исследуем', uz: 'Tekshiramiz' },
    title: { ru: 'К какому круглому числу ближе?', uz: 'Qaysi yaxlit songa yaqinroq?' },
    intro: {
      ru: 'Перед тобой число между 12 000 и 13 000. Поставь ползунок в любое место и смотри, к какому круглому числу оно ближе.',
      uz: "Oldingizda 12 000 bilan 13 000 oralig'idagi son. Slayderni xohlagan joyga qo'ying va u qaysi yaxlit songa yaqinroq ekanini ko'ring."
    },
    axis_left: { ru: '12 000', uz: '12 000' },
    axis_point: { ru: '12 742', uz: '12 742' },
    axis_right: { ru: '13 000', uz: '13 000' },
    axis_left_note: { ru: 'ближайшая круглая тысяча снизу', uz: "pastdan eng yaqin yaxlit ming" },
    axis_right_note: { ru: 'ближайшая круглая тысяча сверху', uz: "tepadan eng yaqin yaxlit ming" },
    prompt: { ru: 'Двигай ползунок и наблюдай, к какому круглому ближе.', uz: "Slayderni harakatlantiring va qaysi yaxlit songa yaqinroq ekanini kuzating." },
    play_hint: { ru: 'Подвигай ползунок и попробуй разные числа — так легче почувствовать, к какому круглому каждое ближе.', uz: "Slayderni harakatlantiring va turli sonlarni sinab ko'ring — har biri qaysi yaxlit songa yaqinroq ekanini his qilish osonroq bo'ladi." },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      ru: [
        'Это число стоит между двенадцатью и тринадцатью тысячами. Двигай ползунок и смотри, к какой из двух круглых отметок оно ближе.',
        'Подвигай ползунок и попробуй разные числа. Так ты почувствуешь, к какому круглому числу каждое из них ближе, и поймёшь, как работает округление.'
      ],
      uz: [
        "Bu son o'n ikki ming bilan o'n uch ming oralig'ida. Slayderni harakatlantiring va u ikki yaxlit belgidan qaysi biriga yaqinroq ekanini ko'ring.",
        "Slayderni harakatlantiring va turli sonlarni sinab ko'ring. Shunda har biri qaysi yaxlit songa yaqinroq ekanini his qilasiz va yaxlitlash qanday ishlashini tushunasiz."
      ]
    }
  },

  // ───────────────────────────── s6 · RULE (округление, ось) ─────────────────────────────
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Как округлять число', uz: 'Sonni qanday yaxlitlash' },
    rule_meaning: {
      ru: 'Округлить — значит выбрать ближайшее круглое число нужного разряда.',
      uz: "Yaxlitlash — kerakli xonadagi eng yaqin yaxlit sonni tanlash demakdir."
    },
    rule_trick: {
      ru: 'Посмотри на следующую младшую цифру: от 0 до 4 — берём меньшее круглое число, от 5 до 9 — большее. Младшие разряды становятся нулями.',
      uz: "Keyingi kichik raqamga qarang: 0 dan 4 gacha — kichik yaxlit son, 5 dan 9 gacha — katta yaxlit son. Kichik xonalar nolga aylanadi."
    },
    rule_mid: {
      ru: 'Если число ровно посередине (цифра 5), берём большее круглое число.',
      uz: "Agar son aynan o'rtada bo'lsa (raqam 5), katta yaxlit sonni olamiz."
    },
    example: { ru: '12 742 ≈ 13 000', uz: '12 742 ≈ 13 000' },
    audio: {
      ru: 'Округлить число значит выбрать ближайшее круглое число нужного разряда. Смотрим на следующую младшую цифру. Если она от нуля до четырёх, берём меньшее круглое число. Если от пяти до девяти, берём большее. Например, двенадцать тысяч семьсот сорок два приблизительно равно тринадцати тысячам.',
      uz: "Sonni yaxlitlash kerakli xonadagi eng yaqin yaxlit sonni tanlash demakdir. Keyingi kichik raqamga qaraymiz. Agar u noldan to'rtgacha bo'lsa, kichik yaxlit sonni olamiz. Beshdan to'qqizgacha bo'lsa, katta yaxlit sonni olamiz. Masalan, o'n ikki ming yetti yuz qirq ikki taxminan o'n uch mingga teng."
    }
  },

  // ─────────────────────── s7 · TEST choice (округл. до тысяч) ───────────────────────
  s7: {
    eyebrow: { ru: 'Разберём', uz: "Ko'rib chiqamiz" },
    title: { ru: 'Округлять можно до любого разряда', uz: 'Sonni istalgan xonagacha yaxlitlash mumkin' },
    intro: { ru: 'Возьмём число 12 742. Нажимай на разряд — и смотри, до какого круглого числа оно округлится.', uz: "12 742 sonini olamiz. Xonani bosing — u qaysi yaxlit songacha yaxlitlanishini ko'ring." },
    tap_prompt: { ru: 'Открывай разряды по порядку — все четыре', uz: 'Xonalarni tartib bilan bosing — barchasini' },
    r_tens: { ru: 'до десятков', uz: "o'nlar xonasigacha" },
    r_hundreds: { ru: 'до сотен', uz: 'yuzlar xonasigacha' },
    r_thousands: { ru: 'до тысяч', uz: 'minglar xonasigacha' },
    r_tenK: { ru: 'до десятков тысяч', uz: "o'n minglar xonasigacha" },
    why_tens: { ru: 'Смотрим на единицы (2) — это вниз.', uz: 'Birlarga (2) qaraymiz — bu pastga.' },
    why_hundreds: { ru: 'Смотрим на десятки (4) — это вниз.', uz: "O'nlarga (4) qaraymiz — bu pastga." },
    why_thousands: { ru: 'Смотрим на сотни (7) — это вверх.', uz: 'Yuzlarga (7) qaraymiz — bu yuqoriga.' },
    why_tenK: { ru: 'Смотрим на тысячи (2) — это вниз.', uz: 'Minglarga (2) qaraymiz — bu pastga.' },
    conclusion: { ru: 'Чем выше разряд, тем грубее округление. Округление до тысяч и крупнее — это уже округление до целого класса.', uz: "Xona qancha katta bo'lsa, yaxlitlash shunchalik qo'pol. Minglar xonasigacha va undan kattagacha yaxlitlash — bu butun sinfgacha yaxlitlash." },
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
      ]
    }
  },
  s8: {
    eyebrow: { ru: 'Тренировка · 3 из 4', uz: 'Mashq · 4 dan 3' },
    label: { ru: 'Округли число', uz: 'Sonni yaxlitlang' },
    question: { ru: 'Округли диаметр Земли 12 742 до тысяч.', uz: 'Yer diametri 12 742 ni minglar xonasigacha yaxlitlang.' },
    opt0: { ru: '12 000', uz: '12 000' },
    opt1: { ru: '12 700', uz: '12 700' },
    opt2: { ru: '13 000', uz: '13 000' },
    correctIndex: 2,
    correct_text: {
      ru: 'Правильно. В разряде сотен 7, это больше 5, поэтому округляем вверх до 13 000.',
      uz: "To'g'ri. Yuzlar xonasida 7, bu 5 dan katta, shuning uchun 13 000 gacha yuqoriga yaxlitlaymiz."
    },
    wrong_0: {
      ru: 'Это вниз. Смотреть надо на сотни, а там 7 — это вверх, к 13 000.',
      uz: "Bu pastga. Yuzlarga qarash kerak, u yerda 7 — bu yuqoriga, 13 000 ga."
    },
    wrong_1: {
      ru: 'Это округление до сотен, а нужно до тысяч. До тысяч младшие разряды становятся нулями.',
      uz: "Bu yuzlar xonasigacha yaxlitlash, kerak esa minglar xonasigacha. Minglar xonasigacha kichik xonalar nolga aylanadi."
    },
    hint_0: { ru: 'Посмотри на разряд сотен, он подсказывает, в какую сторону округлять.', uz: "Yuzlar xonasiga qarang, u qaysi tomonga yaxlitlashni aytadi." },
    hint_1: { ru: 'Тебя просили округлить до тысяч, а не до сотен. До какого разряда округляем?', uz: "Sendan minglar xonasigacha so'rashdi, yuzlar xonasigacha emas. Qaysi xonagacha yaxlitlaymiz?" },
    audio: {
      intro: { ru: 'Округли диаметр Земли, двенадцать тысяч семьсот сорок два, до тысяч. Выбери ответ.', uz: "Yer diametrini, o'n ikki ming yetti yuz qirq ikkini, minglar xonasigacha yaxlitlang. Javobni tanlang." },
      on_correct: { ru: 'Верно. В разряде сотен семь, это больше пяти, поэтому округляем вверх до тринадцати тысяч.', uz: "To'g'ri. Yuzlar xonasida yetti, bu beshdan katta, shuning uchun o'n uch minggacha yuqoriga yaxlitlaymiz." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ─────────────────────── s8 · TEST input (серединный случай) ───────────────────────
  s9: {
    eyebrow: { ru: 'Тренировка · ввод', uz: 'Mashq · kiritish' },
    label: { ru: 'Напиши сам', uz: "O'zingiz yozing" },
    question: { ru: 'Округли диаметр Венеры 12 104 до тысяч. Введи ответ.', uz: "Venera diametri 12 104 ni minglar xonasigacha yaxlitlang. Javobni kiriting." },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    correctValue: '12000',
    hint: { ru: 'Посмотри на разряд сотен, он решает, в какую сторону округлять. Округляем до тысяч.', uz: "Yuzlar xonasiga qarang, u qaysi tomonga yaxlitlashni hal qiladi. Minglar xonasigacha yaxlitlaymiz." },
    fb_correct: { ru: 'Правильно. В сотнях 1, это меньше 5 — округляем вниз, до 12 000.', uz: "To'g'ri. Yuzlarda 1, bu 5 dan kichik — pastga, 12 000 gacha yaxlitlaymiz." },
    audio: {
      intro: { ru: 'Округли диаметр Венеры, двенадцать тысяч сто четыре, до тысяч. Введи ответ и нажми проверить.', uz: "Venera diametrini, o'n ikki ming bir yuz to'rtni, minglar xonasigacha yaxlitlang. Javobni kiriting va tekshirishni bosing." },
      on_correct: { ru: 'Верно. В разряде сотен один, это меньше пяти, округляем вниз до двенадцати тысяч.', uz: "To'g'ri. Yuzlar xonasida bir, bu beshdan kichik, o'n ikki minggacha pastga yaxlitlaymiz." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку.', uz: 'Unchalik emas. Maslahatga qarang.' }
    }
  },
  s10: {
    eyebrow: { ru: 'Тренировка · 4 из 4', uz: 'Mashq · 4 dan 4' },
    label: { ru: 'Округли число', uz: 'Sonni yaxlitlang' },
    question: { ru: 'Спутник летит на высоте 750 км. Округли до сотен. Введи ответ.', uz: "Sun'iy yo'ldosh 750 km balandlikda uchadi. Yuzlar xonasigacha yaxlitlang. Javobni kiriting." },
    hint: { ru: 'Это число ровно посередине между 700 и 800. Куда округляют серединное число?', uz: "Bu son 700 bilan 800 ning aynan o'rtasida. O'rtadagi son qayoqqa yaxlitlanadi?" },
    audio_hint: { ru: 'Это число ровно посередине между семьюстами и восемьюстами. Вспомни, куда округляют серединное.', uz: "Bu son yetti yuz bilan sakkiz yuzning aynan o'rtasida. O'rtadagi son qayoqqa yaxlitlanishini eslang." },
    placeholder: { ru: '0', uz: '0' },
    btn_check: { ru: 'Проверить', uz: 'Tekshirish' },
    correctValue: '800',
    fb_correct: {
      ru: 'Правильно. 750 стоит ровно между 700 и 800, поэтому берём большее — 800.',
      uz: "To'g'ri. 750 aynan 700 bilan 800 oralig'ida, shuning uchun kattasini — 800 ni olamiz."
    },
    fb_wrong: {
      ru: 'Здесь число ровно посередине. По правилу серединное число округляем вверх — до 800.',
      uz: "Bu yerda son aynan o'rtada. Qoidaga ko'ra o'rtadagi sonni yuqoriga — 800 ga yaxlitlaymiz."
    },
    audio: {
      intro: { ru: 'Спутник летит на высоте семьсот пятьдесят километров. Округли до сотен, введи ответ и нажми кнопку проверить.', uz: "Sun'iy yo'ldosh yetti yuz ellik kilometr balandlikda uchadi. Yuzlar xonasigacha yaxlitlang, javobni kiriting va tekshirish tugmasini bosing." },
      on_correct: { ru: 'Верно. Это ровно середина между семьюстами и восемьюстами. Серединное округляют к большему, к восьмистам.', uz: "To'g'ri. Bu yetti yuz bilan sakkiz yuzning aynan o'rtasi. O'rtadagi son kattaga yaxlitlanadi, sakkiz yuzga." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ───────────────────────────── s9 · CASE setup ─────────────────────────────
  s11: {
    eyebrow: { ru: 'Случай из космоса', uz: 'Kosmik holat' },
    title: { ru: 'Расставим планеты по росту', uz: "Sayyoralarni o'lchami bo'yicha tartiblaymiz" },
    intro: {
      ru: 'Точные диаметры сравнивать трудно. Округлим их до круглых чисел — и сразу станет видно, кто больше.',
      uz: "Aniq diametrlarni taqqoslash qiyin. Ularni yaxlit sonlargacha yaxlitlaymiz — va kim katta ekani darrov ko'rinadi."
    },
    fact_1: { ru: 'Марс — 6 779 км', uz: 'Mars — 6 779 km' },
    fact_2: { ru: 'Земля — 12 742 км', uz: 'Yer — 12 742 km' },
    fact_3: { ru: 'Юпитер — 139 820 км', uz: 'Yupiter — 139 820 km' },
    cta: { ru: 'Начать', uz: 'Boshlash' },
    audio: {
      ru: 'У нас три планеты: Марс, Земля и Юпитер. Их точные диаметры сравнивать неудобно, поэтому сначала округлим каждый, а потом расставим планеты по размеру.',
      uz: "Bizda uchta sayyora bor: Mars, Yer va Yupiter. Ularning aniq diametrlarini taqqoslash noqulay, shuning uchun avval har birini yaxlitlaymiz, keyin sayyoralarni o'lchami bo'yicha tartiblaymiz."
    }
  },

  // ───────────────────────────── s10 · CASE step ─────────────────────────────
  s12: {
    eyebrow: { ru: 'Случай из космоса', uz: 'Kosmik holat' },
    label: { ru: 'Округли диаметр', uz: 'Diametrni yaxlitlang' },
    question: { ru: 'Округли диаметр Юпитера 139 820 до десятков тысяч.', uz: "Yupiter diametri 139 820 ni o'n minglar xonasigacha yaxlitlang." },
    opt0: { ru: '140 000', uz: '140 000' },
    opt1: { ru: '130 000', uz: '130 000' },
    opt2: { ru: '139 800', uz: '139 800' },
    correctIndex: 0,
    correct_text: {
      ru: 'Правильно. В разряде тысяч 9, это больше 5, округляем вверх до 140 000.',
      uz: "To'g'ri. Minglar xonasida 9, bu 5 dan katta, 140 000 gacha yuqoriga yaxlitlaymiz."
    },
    wrong_1: {
      ru: 'Это вниз. В разряде тысяч 9, а это округление вверх — до 140 000.',
      uz: "Bu pastga. Minglar xonasida 9, bu esa yuqoriga — 140 000 gacha yaxlitlash."
    },
    wrong_2: {
      ru: 'Это округление до сотен, а нужно до десятков тысяч. Младшие разряды становятся нулями.',
      uz: "Bu yuzlar xonasigacha yaxlitlash, kerak esa o'n minglar xonasigacha. Kichik xonalar nolga aylanadi."
    },
    hint_1: { ru: 'Посмотри на разряд тысяч в 139 820, он решает, вверх или вниз.', uz: "139 820 dagi minglar xonasiga qarang, u yuqorimi yoki pastmi hal qiladi." },
    audio_hint_1: { ru: 'Посмотри на разряд тысяч в числе сто тридцать девять тысяч восемьсот двадцать. Он решает, вверх или вниз.', uz: "Bir yuz o'ttiz to'qqiz ming sakkiz yuz yigirma sonidagi minglar xonasiga qarang. U yuqorimi yoki pastmi hal qiladi." },
    hint_2: { ru: 'Это округление до сотен. А просят до десятков тысяч, какой это разряд?', uz: "Bu yuzlar xonasigacha yaxlitlash. So'rashayotgani o'n minglar xonasigacha, bu qaysi xona?" },
    audio: {
      intro: { ru: 'Округли диаметр Юпитера, сто тридцать девять тысяч восемьсот двадцать, до десятков тысяч. Выбери ответ.', uz: "Yupiter diametrini, bir yuz o'ttiz to'qqiz ming sakkiz yuz yigirmani, o'n minglar xonasigacha yaxlitlang. Javobni tanlang." },
      on_correct: { ru: 'Верно. В разряде тысяч девять, это больше пяти, округляем вверх до ста сорока тысяч.', uz: "To'g'ri. Minglar xonasida to'qqiz, bu beshdan katta, bir yuz qirq minggacha yuqoriga yaxlitlaymiz." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ───────────────────────────── s11 · CASE conclusion ─────────────────────────────
  s13: {
    eyebrow: { ru: 'Случай из космоса', uz: 'Kosmik holat' },
    label: { ru: 'Расставь по размеру', uz: "O'lchami bo'yicha tartibla" },
    question: {
      ru: 'Округлили: Марс ≈ 7 000, Земля ≈ 13 000, Юпитер ≈ 140 000 км. Расставь от меньшей к большей.',
      uz: "Yaxlitladik: Mars ≈ 7 000, Yer ≈ 13 000, Yupiter ≈ 140 000 km. Kichikdan kattaga tartibla."
    },
    opt0: { ru: 'Юпитер, Земля, Марс', uz: 'Yupiter, Yer, Mars' },
    opt1: { ru: 'Марс, Земля, Юпитер', uz: 'Mars, Yer, Yupiter' },
    opt2: { ru: 'Земля, Марс, Юпитер', uz: 'Yer, Mars, Yupiter' },
    correctIndex: 1,
    correct_text: {
      ru: 'Правильно. 7 000 меньше 13 000, а 13 000 меньше 140 000 — порядок от меньшей к большей.',
      uz: "To'g'ri. 7 000 — 13 000 dan kichik, 13 000 esa 140 000 dan kichik — kichikdan kattaga tartib."
    },
    wrong_0: {
      ru: 'Это от большей к меньшей. Нас просили наоборот — от меньшей к большей.',
      uz: 'Bu kattadan kichikka. Bizdan teskarisi — kichikdan kattaga so\u2018ralgan.'
    },
    wrong_2: {
      ru: 'Марс 7 000 — самый маленький, он должен быть первым. Сравни округлённые числа по разрядам.',
      uz: 'Mars 7 000 — eng kichigi, u birinchi bo\u2018lishi kerak. Yaxlit sonlarni xonalar bo\u2018yicha taqqoslang.'
    },
    hint_0: { ru: 'Нас просили от меньшей к большей. Сравни округлённые числа.', uz: "Bizdan kichikdan kattaga so'rashdi. Yaxlit sonlarni taqqoslang." },
    hint_2: { ru: 'Сравни округлённые: 7 000, 13 000, 140 000, какое меньше?', uz: "Yaxlit sonlarni taqqoslang: 7 000, 13 000, 140 000, qaysi biri kichik?" },
    audio_hint_2: { ru: 'Сравни округлённые: семь тысяч, тринадцать тысяч, сто сорок тысяч. Какое меньше?', uz: "Yaxlit sonlarni taqqoslang: yetti ming, o'n uch ming, bir yuz qirq ming. Qaysi biri kichik?" },
    audio: {
      intro: { ru: 'Округлённые диаметры: Марс около семи тысяч, Земля около тринадцати тысяч, Юпитер около ста сорока тысяч. Расставь планеты от меньшей к большей.', uz: "Yaxlit diametrlar: Mars yetti ming atrofida, Yer o'n uch ming atrofida, Yupiter bir yuz qirq ming atrofida. Sayyoralarni kichikdan kattaga tartibla." },
      on_correct: { ru: 'Верно. Семь тысяч меньше тринадцати тысяч, а тринадцать тысяч меньше ста сорока тысяч. Порядок от меньшего к большему.', uz: "To'g'ri. Yetti ming o'n uch mingdan kichik, o'n uch ming esa bir yuz qirq mingdan kichik. Kichikdan kattaga tartib." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ─────────────────────── s12 · TEST choice · FINAL (сравнение) ───────────────────────
  s14: {
    eyebrow: { ru: 'Итог · 1 из 2', uz: 'Yakun · 2 dan 1' },
    label: { ru: 'Сравни числа', uz: 'Sonlarni taqqoslang' },
    question: { ru: 'Зонд показал два расстояния: 5 000 009 км и 5 000 010 км. Какое больше?', uz: 'Zond ikki masofani ko\u2018rsatdi: 5 000 009 km va 5 000 010 km. Qaysi biri katta?' },
    opt0: { ru: '5 000 009 — в нём есть девятка', uz: "5 000 009 — unda to'qqiz bor" },
    opt1: { ru: 'Они равны', uz: 'Ular teng' },
    opt2: { ru: '5 000 010', uz: '5 000 010' },
    correctIndex: 2,
    correct_text: {
      ru: 'Правильно. Старшие разряды совпадают, а в десятках у второго числа 1 против 0.',
      uz: "To'g'ri. Katta xonalar bir xil, o'nlarda esa ikkinchi sonda 0 ga qarshi 1 turibdi."
    },
    wrong_0: {
      ru: 'Девятка в единицах не делает число больше. Различие в десятках: 1 больше 0.',
      uz: "Birlardagi to'qqiz sonni katta qilmaydi. Farq o'nlarda: 1 — 0 dan katta."
    },
    wrong_1: {
      ru: 'Совпадение старших разрядов — не равенство. Идём дальше до первой разной цифры.',
      uz: "Katta xonalarning bir xilligi — tenglik emas. Birinchi farqli raqamgacha davom etamiz."
    },
    hint_0: { ru: 'Старшие разряды совпадают, иди дальше, к младшим, до первой разной цифры.', uz: "Katta xonalar bir xil, kichigiga, birinchi farqli raqamgacha o't." },
    hint_1: { ru: 'Числа не равны. Найди первый разряд, где цифры отличаются.', uz: "Sonlar teng emas. Raqamlar farq qiladigan birinchi xonani toping." },
    audio: {
      intro: { ru: 'Зонд показал два расстояния: пять миллионов девять и пять миллионов десять километров. Какое больше? Выбери ответ.', uz: "Zond ikki masofani ko'rsatdi: besh million to'qqiz va besh million o'n kilometr. Qaysi biri katta? Javobni tanlang." },
      on_correct: { ru: 'Верно. Старшие разряды совпадают, а в разряде десятков у второго числа один против нуля.', uz: "To'g'ri. Katta xonalar bir xil, o'nlar xonasida esa ikkinchi sonda nolga qarshi bir turibdi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ─────────────────────── s13 · TEST choice · FINAL (переход через разряд) ───────────────────────
  s15: {
    eyebrow: { ru: 'Итог · 2 из 2', uz: 'Yakun · 2 dan 2' },
    label: { ru: 'Округли число', uz: 'Sonni yaxlitlang' },
    question: { ru: 'Астероид пролетел в 9 859 км от станции. Округли до тысяч.', uz: 'Asteroid stansiyadan 9 859 km uzoqlikda uchib o\u2018tdi. Minglar xonasigacha yaxlitlang.' },
    opt0: { ru: '9 000', uz: '9 000' },
    opt1: { ru: '9 800', uz: '9 800' },
    opt2: { ru: '9 900', uz: '9 900' },
    opt3: { ru: '10 000', uz: '10 000' },
    correctIndex: 3,
    correct_text: {
      ru: 'Правильно. В сотнях 8, это вверх. 9 тысяч плюс одна дают ровно 10 000.',
      uz: "To'g'ri. Yuzlarda 8, bu yuqoriga. 9 ming va yana bir ming aynan 10 000 ni beradi."
    },
    wrong_0: {
      ru: 'Это вниз. В сотнях 8 — это округление вверх, через разряд к 10 000.',
      uz: "Bu pastga. Yuzlarda 8 — bu yuqoriga, xonadan o'tib 10 000 ga yaxlitlash."
    },
    wrong_1: {
      ru: 'Это округление до сотен, а нужно до тысяч. Округляя до тысяч, смотрим на сотни (8) и обнуляем младшие разряды.',
      uz: "Bu yuzlar xonasigacha yaxlitlash, kerak esa minglar xonasigacha. Minglar xonasigacha yaxlitlaganda yuzlarga (8) qaraymiz va kichik xonalarni nolga aylantiramiz."
    },
    wrong_2: {
      ru: 'Недостаточно. 9 тысяч округляются вверх до целых 10 000, а не до 9 900.',
      uz: "Yetarli emas. 9 ming yuqoriga to'liq 10 000 gacha yaxlitlanadi, 9 900 gacha emas."
    },
    hint_0: { ru: 'Посмотри на сотни, это вверх или вниз?', uz: "Yuzlarga qarang, bu yuqorimi yoki pastmi?" },
    hint_1: { ru: 'Это округление до сотен. А нужно до тысяч.', uz: "Bu yuzlar xonasigacha yaxlitlash. Kerak esa minglar xonasigacha." },
    hint_2: { ru: 'Округляем до тысяч, а не до сотен. Что станет с младшими разрядами?', uz: "Minglar xonasigacha yaxlitlaymiz, yuzlar xonasigacha emas. Kichik xonalar nima bo'ladi?" },
    audio: {
      intro: { ru: 'Астероид пролетел в девяти тысячах восьмистах пятидесяти девяти километрах от станции. Округли до тысяч. Выбери ответ.', uz: "Asteroid stansiyadan to'qqiz ming sakkiz yuz ellik to'qqiz kilometr uzoqlikda uchib o'tdi. Minglar xonasigacha yaxlitlang. Javobni tanlang." },
      on_correct: { ru: 'Верно. В разряде сотен восемь, это вверх. Девять тысяч и ещё одна дают ровно десять тысяч.', uz: "To'g'ri. Yuzlar xonasida sakkiz, bu yuqoriga. To'qqiz ming va yana bir ming aynan o'n mingni beradi." },
      on_wrong: { ru: 'Не совсем. Посмотри разбор.', uz: 'Unchalik emas. Tushuntirishga qarang.' }
    }
  },

  // ───────────────────────────── s14 · SUMMARY / ВЫВОД (кольцо) ─────────────────────────────
  s16: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
    title: { ru: 'Что ты теперь умеешь', uz: 'Endi nimani bilasiz' },
    ring_back: {
      ru: 'Помнишь Марс и Землю? Бекзод ошибся: у Земли больше разрядов, поэтому 12 742 больше, чем 6 779.',
      uz: "Mars va Yer esingizdami? Bekzod xato qildi: Yerda xona ko'proq, shuning uchun 12 742 — 6 779 dan katta."
    },
    learned_1: {
      ru: 'Сравнивать большие числа по разрядам, а не по крупным цифрам.',
      uz: "Katta sonlarni yirik raqamlar bo'yicha emas, xonalar bo'yicha taqqoslash."
    },
    learned_2: {
      ru: 'Округлять число до нужного разряда, выбирая ближайшее круглое на числовой оси.',
      uz: "Son o'qidagi eng yaqin yaxlit sonni tanlab, sonni kerakli xonagacha yaxlitlash."
    },
    why_heading: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak' },
    why_1: {
      ru: 'Сравнение и прикидка помогают понять масштаб: что больше и насколько примерно.',
      uz: 'Taqqoslash va chama miqyosni tushunishga yordam beradi: nima katta va taxminan qancha.'
    },
    why_2: {
      ru: 'Округление помогает проверить, разумный ли получился ответ в любой задаче.',
      uz: "Yaxlitlash istalgan masalada javob mantiqiymi yo'qmi, tekshirishga yordam beradi."
    },
    teaser: {
      ru: 'Дальше — сложение и вычитание столбиком, где прикидка проверит твой результат. А позже округление вернётся уже для десятичных дробей.',
      uz: "Keyin — ustun usulida qo'shish va ayirish, u yerda chama natijangizni tekshiradi. Keyinroq yaxlitlash o'nli kasrlar uchun qaytadi."
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
        "Endi siz katta sonlarni xonalar bo'yicha taqqoslay olasiz va ularni son o'qida kerakli xonagacha yaxlitlay olasiz.",
        "Bu miqyosni tushunishga, nima katta va taxminan qancha ekanini ko'rishga, hamda javob mantiqiy chiqdimi tekshirishga yordam beradi.",
        "Keyin ustun usulida qo'shish va ayirish bo'ladi, u yerda chama natijani tekshiradi. Keyinroq yaxlitlash o'nli kasrlar uchun qaytadi."
      ]
    }
  }
};

// ============================================================
// SCREEN-КОМПОНЕНТЫ (космическая нить, тип Урока 1, анимации)
// ============================================================

// ===== MC с подсказками: повтор без показа ответа, зачёт по первой попытке (lesson-local) =====
const QuestionScreenHint = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang(); const t = useT(); const c = screenContent;
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [tried, setTried] = useState([]);
  const [solved, setSolved] = useState(storedAnswer !== undefined && (storedAnswer.solved === true || storedAnswer.correct === true));
  const [lastWrong, setLastWrong] = useState(null);
  const recordedRef = useRef(storedAnswer !== undefined);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const introAdvancedRef = useRef(storedAnswer !== undefined);
  const pick = (i) => {
    if (solved || tried.includes(i)) return;
    const isCorrect = i === correctIdx;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstIdxRef.current = i; }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isCorrect) {
      setSolved(true); setLastWrong(null);
      if (!recordedRef.current) {
        recordedRef.current = true;
        onAnswer({ stage: screenMeta?.scope ?? null, screenIdx: idx, question: typeof question === 'string' ? question : null, options: options.map(o => typeof o === 'string' ? o : null), correctIndex: correctIdx, correctAnswer: typeof options[correctIdx] === 'string' ? options[correctIdx] : null, studentAnswerIndex: firstIdxRef.current, studentAnswer: typeof options[firstIdxRef.current] === 'string' ? options[firstIdxRef.current] : null, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      }
      if (!audio.muted) { const e = getAudioEngine(); if (e) setTimeout(() => e.pushOneOff(c.audio.on_correct[lang]), 300); }
    } else {
      setTried(prev => prev.includes(i) ? prev : [...prev, i]);
      setLastWrong(i);
      if (!audio.muted) {
        const e = getAudioEngine();
        const seg = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]);
        if (e && seg) setTimeout(() => e.pushOneOff(seg), 300);
      }
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(17px, 2.5vw, 24px)' }}>
        <div className="fade-up">{question}</div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (solved && i === correctIdx) cls += ' option-correct';
            else if (tried.includes(i)) cls += ' option-picked-wrong';
            const dis = solved || tried.includes(i);
            return (
              <button key={i} className={cls} disabled={dis} onClick={() => pick(i)} style={{ padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && i === correctIdx ? T.success : (tried.includes(i) ? T.accent : T.ink3) }}>{solved && i === correctIdx ? '✓' : (tried.includes(i) ? '✗' : String.fromCharCode(65 + i))}</span>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        {!solved && lastWrong !== null && (
          <div className="frame-tip">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : '\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c[`hint_${lastWrong}`])}</p>
          </div>
        )}
        <FeedbackBlock show={solved} isCorrect={true}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : '\u0412\u0435\u0440\u043d\u043e'}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// ===== SCREEN 0: HOOK — Марс vs Земля, центральный вопрос =====
const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer({ stage: 'hook', screenIdx: 0, studentAnswer: v, correct: true });
    audio.triggerEvent('option_picked');
    setTimeout(onNext, 300);
  };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2.8vw, 24px)' }}>
        <h1 className="title h-title fade-up">{t(c.global_q)}</h1>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.claim_lead)} <span className="italic" style={{ color: T.accent }}>{t(c.claim_em)}</span></p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(24px, 8vw, 64px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="planet" style={{ width: 'clamp(44px, 11vw, 64px)', height: 'clamp(44px, 11vw, 64px)', background: 'linear-gradient(135deg, #C75B39, #8f3a20)' }}/>
            <span className="mono small" style={{ color: T.ink2 }}>{t(c.planet_mars)}</span>
            <span className="display pulse" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: T.accent }}>6 779</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="planet" style={{ width: 'clamp(74px, 18vw, 104px)', height: 'clamp(74px, 18vw, 104px)', background: 'linear-gradient(135deg, #2E7DBE, #1F9A6B)' }}/>
            <span className="mono small" style={{ color: T.ink2 }}>{t(c.planet_earth)}</span>
            <span className="display" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>12 742</span>
          </div>
        </div>
        <p className="h-sub title fade-up delay-3">{t(c.question)}</p>
        <div className="fade-up delay-4" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[{ id: 'yes', label: c.opt_yes }, { id: 'no', label: c.opt_no }, { id: 'idk', label: c.opt_idk }].map(o => (
            <button key={o.id} className="option" disabled={picked !== null} onClick={() => pick(o.id)} style={{ padding: 'clamp(14px, 2vw, 15px) clamp(16px, 2.5vw, 20px)', fontSize: 'clamp(15px, 1.9vw, 15px)' }}>{t(o.label)}</button>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1: EXPLORATION — разрядная таблица (слайд справа налево) =====
const Screen1 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s1; const t = useT(); const lang = useLang();
  const segs = c.audio[lang].map((text, i) => ({ id: `s1_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`, waits_for: { type: 'button_click', target: i < c.audio[lang].length - 1 ? 'step' : 'next' } }));
  const audio = useAudio(segs);
  const [step, setStep] = useState(0); const last = c.audio[lang].length - 1;
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); audio.triggerInternal(`step_${ns}`); } else { audio.triggerEvent('button_click', 'next'); onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : <NextLabel/>} onClick={handleStep}/></>);
  const cellBase = { width: 'clamp(38px, 8vw, 56px)', height: 'clamp(44px, 9vw, 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 4vw, 30px)', borderRadius: 10, background: T.paper, boxShadow: `0 3px 9px -4px rgba(${T.shadowBase}, 0.16), 0 1px 3px -1px rgba(${T.shadowBase}, 0.10)` };
  const ghost = { ...cellBase, background: 'transparent', boxShadow: 'none' };
  const row = { display: 'flex', gap: 'clamp(4px, 1vw, 8px)' };
  const renderRow = (digits, hiFirst) => (
    <div style={row}>
      {digits.map((dg, i) => {
        if (dg === '') return <div key={i} style={ghost}/>;
        const hi = hiFirst && i === 0;
        const delay = (digits.length - 1 - i) * 0.08;
        return <div key={i} className="cell-anim" style={{ ...cellBase, animationDelay: `${delay}s`, background: hi ? T.accentSoft : T.paper, color: hi ? T.accent : T.ink, fontWeight: hi ? 700 : 400 }}>{dg}</div>;
      })}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 24px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
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
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.step3_label)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.step3_text)}</p>
        </div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2: RULE — сравнение =====
const Screen2 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s2; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's2_a', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'next' } }]);
  const handleNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={handleNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 3vw, 24px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'start' }}>
            <span className="mono small" style={{ color: T.accent, fontWeight: 600 }}>1</span>
            <p className="body" style={{ margin: 0 }}>{t(c.rule_1)}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'start' }}>
            <span className="mono small" style={{ color: T.accent, fontWeight: 600 }}>2</span>
            <p className="body" style={{ margin: 0 }}>{t(c.rule_2)}</p>
          </div>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="small mono" style={{ color: T.ink2, margin: 0 }}>{t(c.example_1)}</p>
          <p className="small mono" style={{ color: T.ink2, margin: 0 }}>{t(c.example_2)}</p>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3: TEST — сравнение разной длины =====
const Screen3 = (props) => { const c = CONTENT.s3; const t = useT();
  return <QuestionScreenHint {...props} idx={3} screenMeta={SCREEN_META[3]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2)]} correctIdx={0}/>; };

// ===== SCREEN 4: TEST — сравнение равной длины =====
const Screen4 = (props) => { const c = CONTENT.s4; const t = useT();
  return <QuestionScreenHint {...props} idx={4} screenMeta={SCREEN_META[4]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2)]} correctIdx={1}/>; };

// ===== SCREEN 5: EXPLORATION — анимированная зум-ось =====
const Screen5 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s5; const t = useT(); const lang = useLang();
  const audio = useAudio(c.audio[lang].map((text, i) => ({ id: `s5_a${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: i === c.audio[lang].length - 1 ? { type: 'check_pressed' } : null })));
  const MIN = 12000, MAX = 13000, MID = 12500;
  const [value, setValue] = useState(12500); const [checked, setChecked] = useState(false); const fbRef = useRef(null);
  const dLeft = value - MIN, dRight = MAX - value, nearer = value < MID ? MIN : MAX;
  const handleChange = (v) => { setValue(v); if (checked) setChecked(false); };
  const handleCheck = () => { setChecked(true); audio.triggerEvent('check_pressed'); };
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  useEffect(() => { if (checked && fbRef.current) { setTimeout(() => { if (fbRef.current) fbRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 200); } }, [checked]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!checked} label={<NextLabel/>} onClick={onNext}/></>);
  const barRow = (labelNode, dist, isNear) => (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
      <span className="mono small" style={{ color: T.ink3, minWidth: 'clamp(48px, 12vw, 64px)' }}>{labelNode}</span>
      <div style={{ flex: 1, height: 10, background: `${T.ink3}33`, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(dist / 1000) * 100}%`, background: isNear ? T.accent : T.ink3, borderRadius: 99, transition: 'width 0.2s ease-out' }}/>
      </div>
      <span className="mono small" style={{ color: isNear ? T.accent : T.ink2, minWidth: 38, textAlign: 'right' }}>{dist}</span>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 22px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <p className="small fade-up delay-1" style={{ color: T.ink3 }}>{t(c.play_hint)}</p>
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
          {barRow(t(c.axis_left), dLeft, nearer === MIN)}
          {barRow(t(c.axis_right), dRight, nearer === MAX)}
        </div>
        <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-white-accent" disabled={checked} onClick={handleCheck}>{t(c.btn_check)}</button>
        </div>
        {checked && (<div ref={fbRef} className="frame-success">
          <p className="body" style={{ margin: 0 }}>{t({ ru: `${value} ближе к ${nearer}.${value === MID ? ' Ровно посередине — берём большее.' : ''}`, uz: `${value} ${nearer} ga yaqinroq.${value === MID ? " Aynan o'rtada — kattasini olamiz." : ''}` })}</p>
        </div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 6: RULE — округление на оси (snap) =====
const Screen6 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s6; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's6_a', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'next' } }]);
  const handleNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={handleNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 22px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="mono small" style={{ color: T.ink3 }}>12 000</span>
            <span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>13 000</span>
          </div>
          <div style={{ position: 'relative', height: 34, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: `${T.ink3}55`, borderRadius: 99 }}/>
            <div style={{ position: 'absolute', left: '74.2%', top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: T.ink, boxShadow: '0 0 10px 0 rgba(58,53,48,0.35)' }}/>
            <div className="snap-ghost" style={{ position: 'absolute', left: '82%', top: '50%', transform: 'translate(-50%, -50%)', color: T.accent, fontSize: 20, fontWeight: 700 }}>{'\u2192'}</div>
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

// ===== SCREEN 7: TEST — округление до тысяч =====
// ===== SCREEN 7: EXPLORATION — округление по разрядам (интерактив) =====
const Screen7 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s7; const t = useT(); const lang = useLang();
  const segs = c.audio[lang].map((text, i) => ({ id: `s7_a${i}`, text, trigger: i === 0 ? 'on_mount' : `on_event:open_${i}`, waits_for: { type: 'button_click', target: 'next' } }));
  const audio = useAudio(segs);
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
  const open = (r, i) => { if (i < opened.length) { setSel(r.key); return; } if (i !== opened.length) return; setOpened(prev => prev.includes(r.key) ? prev : [...prev, r.key]); setSel(r.key); audio.triggerInternal(`open_${i + 1}`); };
  const handleNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!allOpen} label={<NextLabel/>} onClick={handleNext}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 22px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="frame fade-up delay-2" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 'clamp(34px, 7vw, 56px)', letterSpacing: '0.04em' }}>12 742</div>
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
              <Op size="mid">{'\u2248'}</Op>
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

const Screen8 = (props) => { const c = CONTENT.s8; const t = useT();
  return <QuestionScreenHint {...props} idx={8} screenMeta={SCREEN_META[8]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2)]} correctIdx={2}/>; };

// ===== SCREEN 8: TEST input — серединный случай =====
// ===== INPUT (ввод) с подсказкой + повтором, зачёт по первой попытке (lesson-local) =====
const InputScreenHint = ({ screen, idx, totalScreens, base, correctValue, screenContent, storedAnswer, onAnswer, onNext, onPrev }) => {
  const c = screenContent; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: `s${idx}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const correct = parseInt(String(correctValue).replace(/\s/g, ''), 10);
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(storedAnswer !== undefined && (storedAnswer.solved === true || storedAnswer.correct === true));
  const [hintShown, setHintShown] = useState(false);
  const recordedRef = useRef(storedAnswer !== undefined);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const firstAnsRef = useRef(storedAnswer?.studentAnswer ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const introAdvancedRef = useRef(storedAnswer !== undefined);
  const submit = () => {
    if (solved) return;
    const v = parseInt(value, 10); if (isNaN(v)) return;
    const isCorrect = v === correct;
    if (firstTryRef.current === null) { firstTryRef.current = isCorrect; firstAnsRef.current = String(v); }
    attemptsRef.current += 1;
    if (!introAdvancedRef.current) { introAdvancedRef.current = true; audio.triggerEvent('check_pressed'); }
    if (isCorrect) { setSolved(true); setHintShown(false); if (!recordedRef.current) { recordedRef.current = true; onAnswer({ stage: SCREEN_META[idx].scope, screenIdx: idx, question: t(c.question), correctAnswer: String(correct), studentAnswer: firstAnsRef.current, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true }); } if (!audio.muted) { const e = getAudioEngine(); if (e) setTimeout(() => e.pushOneOff(c.audio.on_correct[lang]), 300); } }
    else { setHintShown(true); if (!audio.muted) { const e = getAudioEngine(); const seg = (c.audio_hint && c.audio_hint[lang]) || (c.hint && c.hint[lang]) || (c.audio.on_wrong && c.audio.on_wrong[lang]); if (e && seg) setTimeout(() => e.pushOneOff(seg), 300); } }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 3vw, 24px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p>
          <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 16px)', flexWrap: 'wrap' }}>
          <span className="display" style={{ fontSize: 'clamp(26px, 5vw, 38px)' }}>{base}</span>
          <Op size="mid">{'\u2248'}</Op>
          <input type="number" inputMode="numeric" className={`answer-input ${solved ? 'correct' : ''}`} value={value} placeholder={t(c.placeholder)} onChange={e => { if (!solved) { setValue(e.target.value); setHintShown(false); } }} disabled={solved} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'clamp(100px, 22vw, 140px)' }}/>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-white-accent" disabled={!value || solved} onClick={submit}>{t(c.btn_check)}</button>
        </div>
        {hintShown && !solved && (
          <div className="frame-tip">
            <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : '\u041f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.hint)}</p>
          </div>
        )}
        <FeedbackBlock show={solved} isCorrect={true}>
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : '\u0412\u0435\u0440\u043d\u043e'}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9: INPUT — округление Венеры (ввод) =====
const Screen9 = (props) => <InputScreenHint {...props} idx={9} base="12 104" correctValue="12000" screenContent={CONTENT.s9}/>;

// ===== SCREEN 10: INPUT — серединный случай, спутник (ввод) =====
const Screen10 = (props) => <InputScreenHint {...props} idx={10} base="750" correctValue="800" screenContent={CONTENT.s10}/>;

// ===== SCREEN 9: CASE setup — планеты по росту =====
const Screen11 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s11; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's11_a', text: c.audio[lang], trigger: 'on_mount', waits_for: { type: 'button_click', target: 'next' } }]);
  const handleNext = () => { audio.triggerEvent('button_click', 'next'); onNext(); };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={t(c.cta)} onClick={handleNext}/></>);
  const facts = [c.fact_1, c.fact_2, c.fact_3];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 3vw, 24px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame fade-up delay-1"><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.intro)}</p></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
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

// ===== SCREEN 10: CASE step — округлить диаметр Юпитера =====
const Screen12 = (props) => { const c = CONTENT.s12; const t = useT();
  return <QuestionScreenHint {...props} idx={12} screenMeta={SCREEN_META[12]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2)]} correctIdx={0}/>; };

// ===== SCREEN 11: CASE conclusion — расставить по размеру =====
const Screen13 = (props) => { const c = CONTENT.s13; const t = useT();
  return <QuestionScreenHint {...props} idx={13} screenMeta={SCREEN_META[13]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2)]} correctIdx={1}/>; };

// ===== SCREEN 12: FINAL — сравнение близких =====
const Screen14 = (props) => { const c = CONTENT.s14; const t = useT();
  return <QuestionScreenHint {...props} idx={14} screenMeta={SCREEN_META[14]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2)]} correctIdx={2}/>; };

// ===== SCREEN 13: FINAL — переход через разряд =====
const Screen15 = (props) => { const c = CONTENT.s15; const t = useT();
  return <QuestionScreenHint {...props} idx={15} screenMeta={SCREEN_META[15]} screenContent={c}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2></>}
    options={[t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)]} correctIdx={3}/>; };

// ===== SCREEN 14: SUMMARY / ВЫВОД (кольцо) =====
const Screen16 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s16; const t = useT(); const lang = useLang();
  const audio = useAudio(c.audio[lang].map((text, i) => ({ id: `s16_a${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null })));
  const scored = [3, 4, 8, 9, 10, 12, 13, 14, 15];
  const correct = scored.filter(i => answers[i]?.correct).length; const total = scored.length;
  useEffect(() => { finishLesson(); /* eslint-disable-next-line */ }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(16px, 3vw, 24px)' }}>
        <h2 className="title h-title fade-up">{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1"><p className="body" style={{ margin: 0 }}>{t(c.ring_back)}</p></div>
        <div className="frame fade-up delay-2" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 'clamp(44px, 9vw, 72px)' }}>
            <span style={{ color: correct >= total * 0.7 ? T.success : T.accent }}>{correct}</span><span style={{ color: T.ink3 }}>/{total}</span>
          </div>
        </div>
        <div className="frame fade-up delay-3">
          <ul className="body" style={{ paddingLeft: 20, color: T.ink2, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>{t(c.learned_1)}</li>
            <li>{t(c.learned_2)}</li>
          </ul>
        </div>
        <div className="frame-success fade-up delay-4">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.why_heading)}</p>
          <p className="body" style={{ margin: 0, marginBottom: 6 }}>{t(c.why_1)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.why_2)}</p>
        </div>
        <p className="body fade-up delay-4" style={{ color: T.ink2 }}>{t(c.teaser)}</p>
      </div>
    </Stage>
  );
};

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — production-контракт platform_contract §1.
// Default export = сам урок. Фолбэки для запуска в artifacts внутри:
// пустой ttsApiBase -> движок молчит, урок работает.
// ============================================================
export default function NumbersLesson_5_02({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const lang = langProp || 'ru';
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  // Конфигурируем урок: движок/SFX/AI читают из ttsConfig.
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => {
      const next = [...prev];
      next[screenIdx] = data;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setAnswers([]);
    setCurrent(0);
    startTimeRef.current = Date.now();
  }, []);

  const finishLesson = useCallback(() => {
    // Обучающие уроки не оцениваются (teaching_methodology §1.4). Балл не считаем.
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
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

// ============================================================
// STYLES (CSS-ядро из infrastructure_v1 + урочный слой)
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
/* .btn — Dark CTA, резерв. Главные действия используют .btn-white-accent. */
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

/* .btn-white-accent — главная CTA (белая, оранжевая тень, текст оранжевый; на hover заливается оранжевым, текст белый) */
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

/* .btn-ghost — вторичная (прозрачная без тени → белая карточка на hover) */
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
.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(17px, 2.5vw, 20px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.5; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(12px, 2vw, 18px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(10px, 1.7vw, 16px);
  padding-bottom: clamp(17px, 3.4vw, 34px);
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
  padding-top: clamp(12px, 2vw, 15px);
  padding-bottom: clamp(12px, 2vw, 15px);
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
  padding: clamp(17px, 3.4vw, 30px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
}
/* frame-soft и frame-success сохраняют polosa 4px слева как функциональный сигнал статуса */
.frame-soft {
  background: #FFE8E1;
  border-left: 4px solid #FF4F28;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 20px);
  box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22);
}
.frame-success {
  background: #E3F0E8;
  border-left: 4px solid #1F7A4D;
  border-radius: 12px;
  padding: clamp(14px, 2.5vw, 20px);
  box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22);
}

/* MATH: бледно-жёлтый callout для справочного (подсказки, выводы, термины, факты). */
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* Анимации космической версии */
@keyframes slide-in-right { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
.cell-anim { animation: slide-in-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
@keyframes soft-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.13); } }
.pulse { animation: soft-pulse 1.6s ease-in-out infinite; display: inline-block; }
.planet { border-radius: 50%; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.30), inset -6px -6px 16px rgba(0, 0, 0, 0.18); flex-shrink: 0; }
@keyframes snap-glide { 0% { transform: translate(-50%, -50%); opacity: 0.3; } 50% { opacity: 1; } 100% { transform: translate(calc(-50% + 14px), -50%); opacity: 0.3; } }
.snap-ghost { animation: snap-glide 1.6s ease-in-out infinite; }
@keyframes tap-pulse { 0%, 100% { box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); } 50% { box-shadow: 0 8px 20px -4px rgba(255, 79, 40, 0.45); } }
.tap-pulse { animation: tap-pulse 1.4s ease-in-out infinite; }
`;
