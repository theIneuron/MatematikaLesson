import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BRIDGES, CONTENT as CONTENT_SOURCE } from './Dars01Content.js';

// ============================================================================
// 4-SINF ETALON · Dars01 · Ko'p xonali sonlar sinflari
// Pedagogy: investigate → formulate → apply → check → prove.
// Story: Lumo City, Data Center launch. Student is the mathematical expert.
// ============================================================================

const T = {
  bg: '#F5F5F0',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  paper: '#FFFFFF',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  lime: '#95C93D',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
  shadowBase: '58, 53, 48',
};

const CONTENT = CONTENT_SOURCE;
const TOTAL_SCREENS = 16;
const FREE_NAV = true;
const MOBILE_DESIGN_W = 390;

const LESSON_META = {
  lessonId: 'num-4-01-v1',
  lessonTitle: {
    ru: 'Урок 1. Классы многозначных чисел',
    uz: "1-dars. Ko'p xonali sonlar sinflari",
  },
};

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'FoundationReview', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's5', type: 'practice', template: 'DividerPlacement', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'ReasoningRounds', scored: false, scope: null },
  { id: 's7', type: 'exploration', template: 'ReasoningRounds', scored: false, scope: null },
  { id: 's8', type: 'exploration', template: 'MCScreen', scored: false, scope: null },
  { id: 's9', type: 'rule', template: 'RuleBuilder', scored: false, scope: null },
  { id: 's10', type: 'practice', template: 'DividerPlacement', scored: false, scope: null },
  { id: 's11', type: 'test', template: 'RapidTestConsole', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'practice', template: 'Strategy', scored: false, scope: null },
  { id: 's13', type: 'case', template: 'MCScreen', scored: false, scope: null },
  { id: 's14', type: 'case', template: 'MCScreen', scored: false, scope: null },
  { id: 's15', type: 'summary', template: 'custom', scored: false, scope: null },
];

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  studentName: '',
  voiceGender: 'f',
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value === null || value === undefined) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.ru ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint
        ? window.innerWidth / MOBILE_DESIGN_W
        : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

const buildTtsUrl = (base, text, gender) => {
  const encoded = encodeURIComponent(String(text).slice(0, 1000));
  return `${base}/api/tts?text=${encoded}&g=${gender === 'm' ? 'm' : 'f'}`;
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.lang = 'ru';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        muted: this.muted,
        ...extra,
      });
    }
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) {
    this.lang = lang;
  }

  loadQueue(segments) {
    this.stop(false);
    this.queue = Array.isArray(segments) ? segments : [];
    this.index = 0;
  }

  start() {
    if (this.muted) {
      this.emit({ completed: true });
      return;
    }
    this.playCurrent();
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playText(segment.text, () => {
      this.index += 1;
      this.playCurrent();
    }, segment.id);
  }

  playText(text, done, id = 'one-off') {
    if (!text || this.muted) {
      done?.();
      return;
    }
    const base = runtimeConfig.ttsApiBase;
    if (base) {
      const audio = this.ensureAudio();
      if (!audio) {
        done?.();
        return;
      }
      audio.onended = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.onerror = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.src = buildTtsUrl(base, text, runtimeConfig.voiceGender);
      const promise = audio.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
          this.isPlaying = true;
          this.emit({ currentSegment: id });
        }).catch(() => {
          this.isPlaying = false;
          this.emit({ completed: true, currentSegment: null });
          done?.();
        });
      }
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: `feedback-${Date.now()}`, text }];
    this.index = 0;
    this.start();
  }

  replay() {
    this.stop(false);
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.stop(false);
    this.emit({ completed: this.muted });
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // no-op
      }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // no-op
      }
    }
    this.isPlaying = false;
    if (emit) this.emit({ currentSegment: null });
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
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
  });

  /* eslint-disable react-hooks/refs -- required audio segment stabilizer; prevents cancel/restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((prev) => ({ ...prev, ...next }));
    if (stableSegments?.length && !engine.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 250);
      return () => {
        clearTimeout(timer);
        engine.stop(false);
      };
    }
    return () => engine.stop(false);
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? audioValue.ru ?? '';
  const items = Array.isArray(localized) ? localized : [localized];
  return items.filter(Boolean).map((text, index) => ({
    id: `${prefix}-${index}`,
    text,
  }));
};

const localizedScreenSegments = (audioValue, lang, screen) => {
  const bridge = screen > 0 ? BRIDGES[`s${screen}`] : null;
  const bridgeText = bridge?.[lang] ?? bridge?.ru ?? '';
  const contentSegments = localizedSegments(audioValue, lang, `s${screen}-audio`);
  return bridgeText
    ? [{ id: `s${screen}-bridge`, text: bridgeText }, ...contentSegments]
    : contentSegments;
};

function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 12000);
    return () => clearTimeout(timer);
  }, []);
  return FREE_NAV || audio.muted || audio.completed || timedOut;
}

function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const timer = setTimeout(() => setDelayElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, [solved]);
  if (FREE_NAV) return true;
  if (!solved) return false;
  if (audio.muted) return true;
  return delayElapsed && !audio.isPlaying;
}

const BIT_CORRECT_REACTIONS = [
  { ru: 'Точно подмечено!', uz: 'Aniq topdingiz!' },
  { ru: 'Отличный ход!', uz: 'Ajoyib qadam!' },
  { ru: 'Верная связь!', uz: 'Bog‘lanish to‘g‘ri!' },
  { ru: 'Хорошо рассуждаешь!', uz: 'Yaxshi fikrlayapsiz!' },
  { ru: 'Структура найдена!', uz: 'Tuzilish topildi!' },
  { ru: 'Проверка сошлась!', uz: 'Tekshiruv mos keldi!' },
  { ru: 'Уверенный шаг!', uz: 'Ishonchli qadam!' },
  { ru: 'Правило сработало!', uz: 'Qoida ishladi!' },
  { ru: 'Место найдено точно!', uz: 'O‘rin aniq topildi!' },
  { ru: 'Сильное решение!', uz: 'Kuchli yechim!' },
  { ru: 'Логика верная!', uz: 'Mantiq to‘g‘ri!' },
  { ru: 'Да, всё совпало!', uz: 'Ha, hammasi mos!' },
];

const BIT_HINT_REACTIONS = [
  { ru: 'Почти. Проверь место цифры.', uz: 'Yaqin. Raqam o‘rnini tekshiring.' },
  { ru: 'Не спеши. Начни справа.', uz: 'Shoshilmang. O‘ngdan boshlang.' },
  { ru: 'Ещё шаг: сравни разряды.', uz: 'Yana bir qadam: xonalarni solishtiring.' },
  { ru: 'Посмотри на один разряд.', uz: 'Bitta xonaga qarang.' },
  { ru: 'Проверь роль нуля.', uz: 'Nol vazifasini tekshiring.' },
  { ru: 'Сохрани порядок цифр.', uz: 'Raqamlar tartibini saqlang.' },
  { ru: 'Вернись к условию.', uz: 'Shartga qayting.' },
  { ru: 'Раздели задачу на шаги.', uz: 'Masalani qadamlarga ajrating.' },
  { ru: 'Сравни соседние места.', uz: 'Qo‘shni o‘rinlarni solishtiring.' },
  { ru: 'Проверь действие вопроса.', uz: 'Savoldagi amalni tekshiring.' },
  { ru: 'Найди опорную тройку.', uz: 'Tayanch uchlikni toping.' },
  { ru: 'Попробуй проверить запись.', uz: 'Yozuvni tekshirib ko‘ring.' },
];

const getBitReaction = (correct, seed = 0) => {
  const collection = correct ? BIT_CORRECT_REACTIONS : BIT_HINT_REACTIONS;
  return collection[Math.abs(seed) % collection.length];
};

const bitSpeech = (t, correct, seed, detail) => (
  `${t(getBitReaction(correct, seed))} ${detail ?? ''}`.trim()
);

const buildOptionOrder = (length, correctIndex, seed = 0) => {
  const naturalOrder = Array.from({ length }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || !naturalOrder.includes(correctIndex)) {
    return naturalOrder;
  }

  const targetPosition = (Math.abs(seed) * 2 + 1) % length;
  const order = naturalOrder.filter((index) => index !== correctIndex);
  order.splice(targetPosition, 0, correctIndex);
  return order;
};

const BitAnswerComment = ({ reaction, children }) => {
  const t = useT();
  return (
    <div className="bit-answer-comment">
      <div className="bit-answer-comment-figure">
        <BitSVG state="happy" />
      </div>
      <div className="bit-answer-comment-copy">
        <strong>{t(reaction)}</strong>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

const FeedbackBlock = ({ show, correct, reaction, children }) => {
  const lang = useLang();
  const t = useT();
  const label = reaction
    ? t(reaction)
    : (correct
      ? (lang === 'uz' ? "To'g'ri!" : 'Верно!')
      : (lang === 'uz' ? "Yana o'ylang." : 'Подумай ещё.'));
  return (
    <div className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show}>
      <div className={`feedback-card g4-bit-reaction ${correct ? 'feedback-correct g4-bit-reaction-ok' : 'feedback-hint g4-bit-reaction-hint'}`}>
        <div className="g4-bit-reaction-figure">
          <BitSVG state={correct ? 'happy' : 'hint'} />
        </div>
        <div className="g4-bit-reaction-copy">
          <strong>{label}</strong>
          {children && <div className="g4-bit-reaction-detail">{children}</div>}
        </div>
      </div>
    </div>
  );
};

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук');
  const replayLabel = lang === 'uz' ? 'Qayta eshitish' : 'Повторить';
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

const NextLabel = () => (useLang() === 'uz' ? 'Davom etish' : 'Дальше');
const BackLabel = () => (useLang() === 'uz' ? 'Orqaga' : 'Назад');

const NavBack = ({ onClick, hidden = false }) => (
  hidden
    ? <span />
    : (
      <button type="button" className="btn btn-ghost" onClick={onClick}>
        <span aria-hidden="true">←</span> <BackLabel />
      </button>
    )
);

const NavNext = ({ onClick, disabled, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={FREE_NAV ? false : disabled} onClick={onClick}>
      {finish ? (lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок') : <NextLabel />}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'uz' ? 'Missiya' : 'Миссия',
    diagnostic: lang === 'uz' ? 'Diagnostika' : 'Диагностика',
    exploration: lang === 'uz' ? 'Kashfiyot' : 'Исследование',
    rule: lang === 'uz' ? 'Qoida' : 'Правило',
    practice: lang === 'uz' ? 'Mashq' : 'Практика',
    test: lang === 'uz' ? 'Tekshiruv' : 'Проверка',
    case: lang === 'uz' ? 'Vazifa' : 'Задача',
    summary: lang === 'uz' ? 'Yakun' : 'Итог',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const MOBILE_AUTO_SCROLL_TARGETS = [
  '.feedback-visible',
  '.explanation-finish-row',
  '.timeline-active',
  '.trainer-done',
  '.divider-outcome-solved',
  '.reflection-solved',
  '.reward-unlocked',
  '.answer-proof-layer.answer-layer-visible',
];

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  useEffect(() => {
    const scroller = contentRef.current;
    if (!isMobile || !scroller) return undefined;

    scroller.scrollTo({ top: 0, behavior: 'auto' });
    let frameId = 0;
    let settleTimer = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const revealCurrentTarget = () => {
      const target = MOBILE_AUTO_SCROLL_TARGETS
        .map((selector) => scroller.querySelector(selector))
        .find(Boolean);
      if (!target) return;

      const viewport = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const safeTop = viewport.top + 10;
      const safeBottom = viewport.bottom - 14;
      let nextTop = scroller.scrollTop;

      if (targetRect.bottom > safeBottom) {
        nextTop += targetRect.bottom - safeBottom;
      } else if (targetRect.top < safeTop) {
        nextTop -= safeTop - targetRect.top;
      } else {
        return;
      }

      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTo({
        top: Math.max(0, Math.min(nextTop, maxTop)),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const scheduleReveal = () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      frameId = requestAnimationFrame(revealCurrentTarget);
      settleTimer = window.setTimeout(revealCurrentTarget, 720);
    };

    const observer = new MutationObserver(scheduleReveal);
    observer.observe(scroller, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
    };
  }, [isMobile, screen]);

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title">
            <span className="status-dot" />
            <span>{t(eyebrow)}</span>
          </div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        {nav}
      </footer>
    </main>
  );
};

// Bridges remain in the narration queue, but are intentionally not duplicated on screen.
const Bridge = () => null;

// The same canonical Bit used in grade 1–3 lessons.
const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const BitAvatar = ({ mood = 'thinking', small = false }) => {
  const state = mood === 'happy' ? 'happy' : (mood === 'hint' ? 'hint' : 'present');
  return (
    <div className={`bit-avatar ${small ? 'bit-small' : ''}`} aria-label="Bit">
      <BitSVG state={state} />
    </div>
  );
};

const BitCoach = ({ text, mood = 'present', actionKey = 0 }) => (
  <aside className={`bit-coach bit-coach-${mood}`}>
    <div
      key={actionKey}
      className={`bit-coach-figure ${actionKey ? 'bit-coach-reacting' : ''}`}
    >
      <BitSVG state={mood} />
    </div>
    <p>{text}</p>
  </aside>
);

const BIT_STEP_MOODS = ['think', 'point', 'idea', 'focus', 'nod', 'point'];

const getBitStepMood = (index, total) => {
  if (index === null || index === undefined) return 'present';
  if (index === 0 || index === total - 1) return 'wave';
  return BIT_STEP_MOODS[(index - 1) % BIT_STEP_MOODS.length];
};

const VisualAnswerProof = ({ formula, label }) => (
  <div className="answer-proof" aria-live="polite">
    <span className="answer-proof-check" aria-hidden="true">✓</span>
    <div>
      <strong>{formula}</strong>
      {label && <small>{label}</small>}
    </div>
  </div>
);

const ColumnCalculation = ({ top, bottom, result, operator }) => (
  <span className="column-calculation" aria-label={`${top} ${operator} ${bottom} = ${result}`}>
    <span className="column-row">{top}</span>
    <span className="column-row column-operation"><i>{operator}</i>{bottom}</span>
    <span className="column-rule" aria-hidden="true" />
    <span className="column-row column-result">{result}</span>
  </span>
);

const PlaceValueCalculation = ({ rows, t }) => (
  <span className="place-value-calculation">
    {rows.map((row) => (
      <span className="place-value-row" key={row.number}>
        <b>{row.number}</b>
        <i aria-hidden="true">→</i>
        <span>{t(row.place)}</span>
        <i aria-hidden="true">→</i>
        <em>{row.value}</em>
      </span>
    ))}
  </span>
);

const getProofFormula = (current, t) => {
  if (current.proofVisual?.type === 'column') {
    return (
      <ColumnCalculation
        top={current.proofVisual.top}
        bottom={current.proofVisual.bottom}
        result={current.proofVisual.result}
        operator={current.proofVisual.operator}
      />
    );
  }
  if (current.proofVisual?.type === 'place-values') {
    return <PlaceValueCalculation rows={current.proofVisual.rows} t={t} />;
  }
  return t(current.proof ?? current.options[current.correctIndex]);
};

const RecapShiftAnimation = ({ lang }) => {
  const labels = lang === 'ru'
    ? ['СОТНИ', 'ДЕСЯТКИ', 'ЕДИНИЦЫ']
    : ['YUZLIK', 'O‘NLIK', 'BIRLIK'];

  return (
    <div className="recap-shift-sequence">
      <svg
        className="recap-shift-svg"
        viewBox="0 0 540 182"
        role="img"
        aria-label={lang === 'ru'
          ? 'Цифра 7 дважды плавно перемещается на разряд влево, а справа появляются нули'
          : '7 raqami ikki marta chapdagi xonaga silliq o‘tadi, o‘ng tomonda nollar paydo bo‘ladi'}
      >
        <path className="recap-shift-guide" d="M 430 42 C 350 12, 190 12, 110 42" />
        <path className="recap-shift-arrow" d="M 123 35 L 109 43 L 123 50" />

        {labels.map((label, index) => {
          const x = 60 + index * 160;
          const slotClass = ['recap-slot-hundreds', 'recap-slot-tens', 'recap-slot-units'][index];
          return (
            <g key={label}>
              <text className="recap-shift-label" x={x + 50} y="69" textAnchor="middle">
                {label}
              </text>
              <rect
                className={`recap-shift-slot ${slotClass}`}
                x={x}
                y="80"
                width="100"
                height="78"
                rx="18"
              />
            </g>
          );
        })}

        <text className="recap-moving-seven" x="430" y="134" textAnchor="middle">7</text>
        <text className="recap-born-zero recap-born-zero-units" x="430" y="134" textAnchor="middle">0</text>
        <text className="recap-born-zero recap-born-zero-tens" x="270" y="134" textAnchor="middle">0</text>
      </svg>

      <div className="recap-shift-readout" aria-hidden="true">
        <span className="recap-readout-seven">7</span>
        <i>×10</i>
        <span className="recap-readout-seventy">70</span>
        <i>×10</i>
        <span className="recap-readout-seven-hundred">700</span>
      </div>
      <p className="recap-shift-note">
        {lang === 'ru'
          ? 'Шаг влево — справа появляется 0'
          : 'Chapga bir qadam — o‘ngda 0 paydo bo‘ladi'}
      </p>
    </div>
  );
};

const DataCenterScene = ({ raw = '125407', resolved = false, t }) => {
  const digits = raw.split('');

  return (
    <div className={`data-scene ${resolved ? 'data-scene-resolved' : ''}`} aria-hidden="true">
      <div className="city-grid" />
      <div className="data-ambient-orbit data-orbit-one" />
      <div className="data-ambient-orbit data-orbit-two" />

      <div className="data-tower">
        <div className="data-console-head">
          <span className="data-node-name"><i /> LUMO DATA · NODE 04</span>
          <span className="data-state">
            {resolved
              ? t({ ru: 'СТРУКТУРА НАЙДЕНА', uz: 'TUZILISH TOPILDI' })
              : t({ ru: 'СТРУКТУРА НЕ ОПРЕДЕЛЕНА', uz: 'TUZILISH ANIQLANMAGAN' })}
          </span>
        </div>

        <div className="tower-screen">
          <div className="tower-label-row">
            <span className="tower-label">{t({ ru: 'ГОРОДСКОЙ КОД', uz: 'SHAHAR KODI' })}</span>
            <small>{t({ ru: '6 ЦИФР', uz: '6 RAQAM' })}</small>
          </div>
          <strong className="data-code">
            {digits.map((digit, index) => (
              <React.Fragment key={`${digit}-${index}`}>
                {index === digits.length - 3 && <i className="data-code-divider" />}
                <span style={{ '--data-digit-delay': `${index * 90}ms` }}>{digit}</span>
              </React.Fragment>
            ))}
          </strong>
          <i className="data-code-scan" />
          <div className="data-class-reveal">
            <span>{t({ ru: 'КЛАСС ТЫСЯЧ', uz: 'MINGLAR SINFI' })}</span>
            <span>{t({ ru: 'КЛАСС ЕДИНИЦ', uz: 'BIRLAR SINFI' })}</span>
          </div>
        </div>

        <div className="data-diagnostics">
          <span><i className="diagnostic-ok" />{t({ ru: 'ЦИФРЫ: 6', uz: 'RAQAMLAR: 6' })}</span>
          <span><i className="diagnostic-ok" />{t({ ru: 'ПОРЯДОК: СОХРАНЁН', uz: 'TARTIB: SAQLANGAN' })}</span>
          <span className="diagnostic-structure">
            <i />
            {resolved
              ? t({ ru: 'КЛАССЫ: 2', uz: 'SINFLAR: 2' })
              : t({ ru: 'КЛАССЫ: ?', uz: 'SINFLAR: ?' })}
          </span>
        </div>
      </div>

      <div className="city-network">
        <svg viewBox="0 0 150 72">
          <path className="network-route" d="M12 54 C34 18 55 54 76 31 S119 11 139 35" />
          <circle className="network-node node-a" cx="12" cy="54" r="5" />
          <circle className="network-node node-b" cx="76" cy="31" r="5" />
          <circle className="network-node node-c" cx="139" cy="35" r="5" />
          <path className="network-building" d="M119 58V37h9V25h12v33M115 58h30" />
          <path className="network-windows" d="M124 43h4m5 0h4m-13 7h4m5 0h4" />
        </svg>
        <span>{t({ ru: 'СЕТЬ УМНОГО ГОРОДА', uz: "AQILLI SHAHAR TARMOG'I" })}</span>
      </div>

      <div className="data-bit-callout">
        {resolved
          ? t({ ru: 'Код понятен!', uz: 'Kod tushunarli!' })
          : t({ ru: 'Как устроен код?', uz: 'Kod qanday tuzilgan?' })}
      </div>
      <BitAvatar mood={resolved ? 'happy' : 'thinking'} />
    </div>
  );
};

const PlaceValueTable = ({
  values = [],
  highlight = -1,
  compact = false,
  showClassBanners = true,
}) => {
  const lang = useLang();
  const labels = lang === 'uz'
    ? ['yuz minglar', "o'n minglar", 'bir minglar', 'yuzlar', "o'nlar", 'birlar']
    : ['сотни тысяч', 'десятки тысяч', 'тысячи', 'сотни', 'десятки', 'единицы'];
  return (
    <div className={`place-table ${compact ? 'place-table-compact' : ''}`}>
      {showClassBanners && (
        <>
          <div className="class-banner class-thousands">{lang === 'uz' ? 'MINGLAR SINFI' : 'КЛАСС ТЫСЯЧ'}</div>
          <div className="class-banner class-units">{lang === 'uz' ? 'BIRLAR SINFI' : 'КЛАСС ЕДИНИЦ'}</div>
        </>
      )}
      {labels.map((label, index) => (
        <div key={label} className={`place-cell ${index === highlight ? 'place-highlight' : ''}`}>
          <span>{label}</span>
          <strong>{values[index] ?? ''}</strong>
        </div>
      ))}
    </div>
  );
};

const PlaceTableTransfer = ({ digits, phase, runKey }) => {
  const lang = useLang();
  const placed = digits.map((_, index) => (index >= 3 ? phase >= 1 : phase >= 2));
  const placementOrder = [2, 1, 0, 2, 1, 0];

  return (
    <div className="place-transfer" data-run={runKey}>
      <div className="place-transfer-prompt">
        <span>{lang === 'uz' ? 'Raqamlar tashqarida' : 'Цифры вне таблицы'}</span>
        <strong>{lang === 'uz' ? "O'ngdan ↓" : 'Справа ↓'}</strong>
      </div>
      <div className="place-transfer-board">
        <div className="place-transfer-source" aria-label={digits.join('')}>
          {digits.map((digit, index) => (
            <span
              key={`${digit}-${index}`}
              className={placed[index] ? 'transfer-digit transfer-digit-placed' : 'transfer-digit'}
              style={{ '--transfer-delay': `${placementOrder[index] * 170}ms` }}
            >
              {digit}
            </span>
          ))}
        </div>
        <div className="transfer-empty-table">
          <PlaceValueTable values={[]} compact />
        </div>
      </div>
      <p className={`transfer-status ${phase >= 3 ? 'transfer-status-visible' : ''}`}>
        {lang === 'uz'
          ? 'Tayyor: 482 | 019.'
          : 'Готово: 482 | 019.'}
      </p>
    </div>
  );
};

const NumberGroups = ({ left, right, active }) => (
  <div className="number-groups">
    <div className={`number-group number-group-thousands ${active === 'left' ? 'group-active' : ''}`}>
      <span>{left}</span>
    </div>
    <span className="group-divider" aria-hidden="true" />
    <div className={`number-group number-group-units ${active === 'right' ? 'group-active' : ''}`}>
      <span>{right}</span>
    </div>
  </div>
);

const ChoiceScreen = ({
  screen,
  c,
  figure,
  options: optionsProp,
  answerOptions: answerOptionsProp,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  resetOnReturn = false,
  fact,
  quick = false,
}) => {
  const lang = useLang();
  const t = useT();
  const optionsRaw = optionsProp ?? c.options;
  const sourceOptions = optionsRaw.map((option) => t(option));
  const sourceAnswerOptions = answerOptionsProp?.map((option) => t(option)) ?? sourceOptions;
  const optionOrder = buildOptionOrder(sourceOptions.length, c.correctIndex, screen);
  const options = optionOrder.map((index) => sourceOptions[index]);
  const answerOptions = optionOrder.map((index) => sourceAnswerOptions[index]);
  const correctIndex = optionOrder.indexOf(c.correctIndex);
  const wasSolved = !resetOnReturn && storedAnswer?.solved === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIndex : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const firstPicked = useRef(storedAnswer?.studentAnswerIndex ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);

  const intro = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(intro, lang, screen),
    [intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const pick = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === c.correctIndex;
    attempts.current += 1;
    if (firstTry.current === null) {
      firstTry.current = correct;
      firstPicked.current = index;
    }
    setPicked(index);
    const reactionSeed = screen * 13 + index;
    if (correct) {
      setSolved(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question ?? c.title),
        options: answerOptions,
        correctIndex,
        correctAnswer: answerOptions[correctIndex],
        studentAnswerIndex: firstPicked.current,
        studentAnswer: answerOptions[firstPicked.current],
        correct: firstTry.current,
        firstTry: firstTry.current,
        attempts: attempts.current,
        solved: true,
      });
      audio.pushOneOff(bitSpeech(
        t,
        true,
        reactionSeed,
        t(c.audio?.on_correct ?? c.correctText),
      ));
      if (fact?.audio) {
        setTimeout(() => getAudioEngine()?.pushOneOff(t(fact.audio)), 1000);
      }
    } else {
      setWrong((prev) => new Set([...prev, index]));
      audio.pushOneOff(bitSpeech(
        t,
        false,
        reactionSeed,
        t(c.wrong?.[sourceIndex] ?? c.audio?.on_wrong),
      ));
    }
  };

  const pickedSourceIndex = picked !== null ? optionOrder[picked] : null;
  const feedbackText = solved
    ? t(c.correctText)
    : (pickedSourceIndex !== null ? t(c.wrong?.[pickedSourceIndex] ?? c.audio?.on_wrong) : '');

  const nav = (
    <>
      <NavBack onClick={onPrev} hidden={screen === 0} />
      <NavNext onClick={onNext} disabled={!canAdvance} />
    </>
  );

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={nav}>
      <div className={`screen-stack ${quick ? 'quick-test-screen' : ''}`}>
        <Bridge screen={screen} />
        {c.topic && <div className="topic-chip">{t(c.topic)}</div>}
        {c.title && <h1 className="title h-title">{t(c.title)}</h1>}
        {quick && (
          <div className="quick-test-meter">
            <span>{t(c.quickLabel)}</span>
            <div aria-hidden="true">
              {[11, 12, 13, 14].map((item) => (
                <i key={item} className={item <= screen ? 'quick-meter-active' : ''} />
              ))}
            </div>
            <strong>{screen - 10} / 4</strong>
          </div>
        )}
        {figure?.({ solved, picked })}
        <h2 className="question-title">{t(c.question)}</h2>
        <div className="answer-stage choice-answer-stage">
          <div className={`answer-layer answer-options-layer ${solved ? 'answer-layer-hidden' : ''}`}>
            <div className={`options-grid ${options.length === 3 ? 'options-three' : ''}`}>
              {options.map((option, index) => {
                const isWrong = wrong.has(index);
                const isCorrect = index === correctIndex;
                return (
                  <button
                    type="button"
                    key={`${option}-${index}`}
                    className={`option ${isWrong ? 'option-wrong' : ''} ${solved && isCorrect ? 'option-correct-reveal option-answer-confirm' : ''} ${solved && !isCorrect ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={!canAnswer || isWrong || solved}
                    onClick={() => pick(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className={`answer-layer answer-proof-layer choice-proof-layer ${solved ? 'answer-layer-visible' : ''}`}>
            <div className="solved-option">
              <span aria-hidden="true">✓</span>
              <strong>{options[correctIndex]}</strong>
            </div>
            <BitAnswerComment reaction={getBitReaction(true, screen * 13 + correctIndex)}>
              <p>{feedbackText}</p>
            </BitAnswerComment>
          </div>
        </div>
        <FeedbackBlock
          show={picked !== null && !solved}
          correct={false}
          reaction={picked !== null ? getBitReaction(false, screen * 13 + picked) : null}
        >
          <p>{feedbackText}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const FOUNDATION_RECAP_MIN_FRAME_MS = [5200, 5200, 9000, 5200, 3200];

const FoundationRecallAnimation = ({ audio, screen, onFinished }) => {
  const lang = useLang();
  const [phase, setPhase] = useState(0);
  const queuedPhase = useRef(0);
  const nextFrameAt = useRef(0);
  const phaseTimers = useRef([]);

  useEffect(() => {
    nextFrameAt.current = Date.now();
  }, []);

  useEffect(() => {
    const marker = `s${screen}-audio-`;
    if (!audio.currentSegment?.startsWith(marker)) return undefined;
    const targetPhase = Math.min(Number(audio.currentSegment.slice(marker.length)), 4);
    if (!Number.isInteger(targetPhase) || targetPhase <= queuedPhase.current) return undefined;

    const now = Date.now();
    for (let next = queuedPhase.current + 1; next <= targetPhase; next += 1) {
      // Keep every recap frame visible for its pedagogical minimum even when
      // several TTS markers arrive together after a slow or failed audio load.
      const previousPhase = next - 1;
      nextFrameAt.current = Math.max(
        nextFrameAt.current + FOUNDATION_RECAP_MIN_FRAME_MS[previousPhase],
        now,
      );
      const delay = Math.max(0, nextFrameAt.current - now);
      const timer = setTimeout(() => setPhase(next), delay);
      phaseTimers.current.push(timer);
    }
    queuedPhase.current = targetPhase;
    return undefined;
  }, [audio.currentSegment, screen]);

  useEffect(() => {
    if (phase !== 4) return undefined;
    const timer = setTimeout(() => onFinished?.(), 2800);
    return () => clearTimeout(timer);
  }, [onFinished, phase]);

  useEffect(() => () => {
    phaseTimers.current.forEach((timer) => clearTimeout(timer));
  }, []);

  const captions = lang === 'uz'
    ? [
      "Xona — raqamning o'rni",
      'Raqam xona qiymatini oladi',
      '7 → 70 → 700: chapga har qadam ×10',
      "Nol o'rinni saqlaydi",
      '3 topshiriq',
    ]
    : [
      'Разряд — место цифры',
      'Место задаёт значение',
      '7 → 70 → 700: каждый шаг влево ×10',
      'Ноль держит место',
      '3 задания',
    ];

  const frames = [
    <div className="recap-place-row" key="places">
      {[
        lang === 'uz' ? 'yuzlar' : 'сотни',
        lang === 'uz' ? "o'nlar" : 'десятки',
        lang === 'uz' ? 'birlar' : 'единицы',
      ].map((label, index) => (
        <div key={label} style={{ '--recap-delay': `${index * 180}ms` }}>
          <strong>{[3, 2, 6][index]}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>,
    <div className="recap-sum" key="sum" aria-label="326 = 300 + 20 + 6">
      <strong>326</strong><span>=</span><b>300</b><span>+</span><b>20</b><span>+</span><b>6</b>
    </div>,
    <RecapShiftAnimation key="shift" lang={lang} />,
    <div className="recap-zero" key="zero">
      <span>8</span><strong>0</strong><span>6</span>
      <p>{lang === 'uz' ? "0 o'nlar o'rnini ushlab turadi" : '0 удерживает место десятков'}</p>
    </div>,
    <div className="recap-task-preview" key="tasks">
      {[1, 2, 3].map((item) => (
        <span key={item}><b>{item}</b><i aria-hidden="true">?</i></span>
      ))}
    </div>,
  ];

  return (
    <div className="foundation-recap" aria-live="polite">
      <div className="recap-progress" aria-hidden="true">
        {frames.map((_, index) => <i key={index} className={index <= phase ? 'recap-progress-active' : ''} />)}
      </div>
      <div className="recap-frame" key={phase}>{frames[phase]}</div>
      <p>{captions[phase]}</p>
    </div>
  );
};

const ReasoningRoundsScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  foundation = false,
}) => {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? c.rounds.length - 1 : 0);
  const [roundSolved, setRoundSolved] = useState(restored);
  const [completed, setCompleted] = useState(restored);
  const [tasksReady, setTasksReady] = useState(!foundation || restored);
  const [recapFinished, setRecapFinished] = useState(!foundation || restored);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState(restored ? t(c.completionText) : '');
  const [reactionSeed, setReactionSeed] = useState(null);
  const firstTry = useRef(storedAnswer?.subResults ?? Array(c.rounds.length).fill(null));
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];
  const optionOrder = buildOptionOrder(
    current.options.length,
    current.correctIndex,
    screen * 4 + round,
  );
  const options = optionOrder.map((index) => current.options[index]);
  const correctIndex = optionOrder.indexOf(current.correctIndex);
  const audioValue = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(audioValue, lang, screen),
    [audioValue, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(completed, audio);
  const proofFormula = getProofFormula(current, t);
  const proofLabel = t(current.proofLabel ?? {
    ru: 'Ответ подтверждён по разрядам',
    uz: "Javob xonalar bo'yicha tasdiqlandi",
  });

  useEffect(() => {
    if (
      !foundation
      || tasksReady
      || (!audio.muted && (!audio.completed || !recapFinished))
    ) return undefined;
    const timer = setTimeout(() => setTasksReady(true), 250);
    return () => clearTimeout(timer);
  }, [audio.completed, audio.muted, foundation, recapFinished, tasksReady]);

  const choose = (index) => {
    if (!canAnswer || roundSolved || wrong.has(index)) return;
    attempts.current += 1;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === current.correctIndex;
    const nextReactionSeed = screen * 17 + round * 3 + index;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    setReactionSeed(nextReactionSeed);

    if (!correct) {
      setWrong((previous) => new Set([...previous, index]));
      setMessage(t(current.wrongText ?? c.wrongText));
      audio.pushOneOff(bitSpeech(
        t,
        false,
        nextReactionSeed,
        t(current.wrongText ?? c.audio?.on_wrong ?? c.wrongText),
      ));
      return;
    }

    setRoundSolved(true);
    setMessage(t(current.correctText));
    audio.pushOneOff(bitSpeech(t, true, nextReactionSeed, t(current.correctText)));
    if (round === c.rounds.length - 1) {
      setCompleted(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.rounds.map((item) => t(item.options[item.correctIndex])).join('; '),
        studentAnswerIndex: null,
        studentAnswer: 'completed',
        correct: firstTry.current.every(Boolean),
        firstTry: firstTry.current.every(Boolean),
        attempts: attempts.current,
        solved: true,
        subResults: [...firstTry.current],
      });
    }
  };

  const nextRound = () => {
    if (!roundSolved || completed) return;
    setRound((value) => value + 1);
    setRoundSolved(false);
    setWrong(new Set());
    setMessage('');
    setReactionSeed(null);
  };

  const renderVisual = () => {
    const values = current.visualValues ?? [current.number];
    return (
      <div className={`reasoning-visual ${values.length > 1 ? 'reasoning-compare' : ''} ${roundSolved ? 'reasoning-visual-solved' : ''}`}>
        {values.filter(Boolean).map((value, index) => (
          <React.Fragment key={`${value}-${index}`}>
            {index > 0 && <span className="reasoning-arrow" aria-hidden="true">↔</span>}
            <strong>{value}</strong>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className={`screen-stack reasoning-screen ${foundation ? 'foundation-screen' : ''}`}>
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        {foundation && !tasksReady && (
          <FoundationRecallAnimation
            audio={audio}
            screen={screen}
            onFinished={() => setRecapFinished(true)}
          />
        )}
        {c.memoryCards && tasksReady && (
          <div className="foundation-memory foundation-memory-ready">
            {c.memoryCards.map((card) => (
              <div key={t(card.label)}>
                <span>{t(card.label)}</span>
              </div>
            ))}
          </div>
        )}
        {tasksReady && <div className="reasoning-card">
          <div className="reasoning-progress">
            <span>{lang === 'uz' ? `Savol ${round + 1}` : `Вопрос ${round + 1}`}</span>
            <div>
              {c.rounds.map((_, index) => (
                <i
                  key={index}
                  className={`${index < round || completed ? 'reasoning-done' : ''} ${index === round && !completed ? 'reasoning-active' : ''}`}
                />
              ))}
            </div>
            <strong>{round + 1} / {c.rounds.length}</strong>
          </div>
          {renderVisual()}
          <h2 className="question-title">{t(current.question)}</h2>
          <div className="answer-stage reasoning-answer-stage">
            <div className={`answer-layer answer-options-layer ${roundSolved ? 'answer-layer-hidden' : ''}`}>
              <div className={`options-grid ${current.options.length === 3 ? 'options-three' : ''}`}>
                {options.map((option, index) => (
                  <button
                    type="button"
                    key={`${t(option)}-${index}`}
                    className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${roundSolved && index === correctIndex ? 'option-correct-reveal option-answer-confirm' : ''} ${roundSolved && index !== correctIndex ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={wrong.has(index) || !canAnswer || roundSolved}
                    onClick={() => choose(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{t(option)}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`answer-layer answer-proof-layer reasoning-proof-layer ${completed ? 'reasoning-proof-completed' : ''} ${roundSolved ? 'answer-layer-visible' : ''}`}>
              <VisualAnswerProof formula={proofFormula} label={proofLabel} />
              {roundSolved && (
                <BitAnswerComment
                  reaction={getBitReaction(true, reactionSeed ?? (screen * 17 + round * 3 + correctIndex))}
                >
                  <p>{message}</p>
                </BitAnswerComment>
              )}
              {roundSolved && !completed && (
                <button type="button" className="btn btn-secondary" onClick={nextRound}>
                  {lang === 'uz' ? 'Keyingi savol' : 'Следующий вопрос'} <span aria-hidden="true">→</span>
                </button>
              )}
              {completed && <p className="reasoning-complete">{t(c.completionText)}</p>}
            </div>
          </div>
        </div>}
        {tasksReady && <FeedbackBlock
          show={Boolean(message) && !roundSolved}
          correct={false}
          reaction={reactionSeed !== null ? getBitReaction(false, reactionSeed) : null}
        >
          <p>{message}</p>
        </FeedbackBlock>}
      </div>
    </Stage>
  );
};

const DividerPlacementScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  guided = false,
}) => {
  const lang = useLang();
  const t = useT();
  const digits = c.raw.split('');
  const [selectedGap, setSelectedGap] = useState(storedAnswer?.selectedGap ?? null);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState(storedAnswer?.solved ? t(c.correctText) : '');
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const audioValue = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(audioValue, lang, screen),
    [audioValue, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const selectGap = (gap) => {
    if (solved || !canAnswer) return;
    setSelectedGap(gap);
    setChecked(false);
    setMessage('');
  };

  const submit = () => {
    if (solved || selectedGap === null) return;
    attempts.current += 1;
    const correct = selectedGap === c.correctGap;
    const reactionSeed = screen * 19 + selectedGap;
    if (firstTry.current === null) firstTry.current = correct;
    setChecked(true);
    if (!correct) {
      setMessage(t(c.wrongText));
      audio.pushOneOff(bitSpeech(t, false, reactionSeed, t(c.wrongText)));
      return;
    }
    setSolved(true);
    setMessage(t(c.correctText));
    audio.pushOneOff(bitSpeech(t, true, reactionSeed, t(c.correctText)));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.title),
      options: null,
      correctIndex: c.correctGap,
      correctAnswer: c.result,
      studentAnswerIndex: selectedGap,
      studentAnswer: `${c.raw.slice(0, selectedGap)} | ${c.raw.slice(selectedGap)}`,
      correct: firstTry.current,
      firstTry: firstTry.current,
      attempts: attempts.current,
      solved: true,
      selectedGap,
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack divider-screen">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="divider-workbench">
          {guided && (
            <div className={`finger-guide ${solved ? 'finger-guide-solved' : ''}`}>
              <span className="finger-guide-hand" aria-hidden="true">{solved ? '✓' : '☝️'}</span>
              <div>
                <strong>
                  {solved
                    ? (lang === 'uz' ? 'Uchta xona topildi' : 'Три разряда найдены')
                    : t(c.guideTitle)}
                </strong>
              </div>
              <div className="finger-count" aria-hidden="true"><i>3</i><b>←</b><i>2</i><b>←</b><i>1</i></div>
            </div>
          )}
          <div className="divider-number" aria-label={c.raw}>
            {digits.map((digit, index) => (
              <React.Fragment key={`${digit}-${index}`}>
                {index > 0 && (
                  <button
                    type="button"
                    className={`divider-gap ${selectedGap === index ? 'divider-gap-selected' : ''} ${checked && selectedGap === index && !solved ? 'divider-gap-wrong' : ''} ${solved && index === c.correctGap ? 'divider-gap-correct' : ''}`}
                    disabled={solved}
                    onClick={() => selectGap(index)}
                    aria-label={lang === 'uz'
                      ? `${index}- va ${index + 1}-raqam orasiga chegara qo'yish`
                      : `Поставить границу между цифрами ${index} и ${index + 1}`}
                  >
                    <span />
                  </button>
                )}
                <span className="divider-digit">{digit}</span>
              </React.Fragment>
            ))}
          </div>
          <div className={`divider-outcome ${solved ? 'divider-outcome-solved' : ''}`}>
            <div className="divider-outcome-layer divider-prompt-layer">
              <div className="divider-instruction">
                <span aria-hidden="true">👆</span>
                <p>{t(c.instruction)}</p>
              </div>
              <div className="inline-action">
                <button type="button" className="btn btn-white-accent" disabled={selectedGap === null || solved} onClick={submit}>
                  {lang === 'uz' ? 'Tekshirish' : 'Проверить'}
                </button>
              </div>
            </div>
            <div className="divider-outcome-layer divider-proof-layer">
              <NumberGroups
                left={c.raw.slice(0, c.correctGap)}
                right={c.raw.slice(c.correctGap)}
              />
              <p>
                {lang === 'uz'
                  ? "Chegara to'g'ri joyga o'rnatildi"
                  : 'Граница встала после трёх разрядов справа'}
              </p>
            </div>
          </div>
        </div>
        <FeedbackBlock
          show={Boolean(message)}
          correct={solved}
          reaction={selectedGap !== null ? getBitReaction(solved, screen * 19 + selectedGap) : null}
        >
          <p>{message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const ClassGroupingAnimation = ({
  digits = ['1', '2', '5', '4', '0', '7'],
  boundaryAfter = 2,
  phase = 0,
  runKey = 0,
  showTable = false,
  tableTransfer = false,
  leftRevealPhase = 2,
}) => {
  const lang = useLang();
  const variant = digits.length <= 4 ? 'four-digit' : 'six-digit';
  const rightStart = boundaryAfter + 1;
  const showRightGroup = phase >= 1;
  const showBoundary = phase >= 2;
  const showLeftGroup = phase >= leftRevealPhase;
  const showClassNames = phase >= 3;
  const directionLabel = lang === 'uz' ? "O'ngdan" : 'Справа';
  const unitsLabel = lang === 'uz' ? 'BIRLAR SINFI' : 'КЛАСС ЕДИНИЦ';
  const thousandsLabel = lang === 'uz' ? 'MINGLAR SINFI' : 'КЛАСС ТЫСЯЧ';

  if (showTable && tableTransfer && digits.length === 6) {
    return <PlaceTableTransfer digits={digits} phase={phase} runKey={runKey} />;
  }

  return (
    <div className={`class-animation class-animation-${variant}`} key={`${variant}-${runKey}`}>
      <div className="class-direction">
        <span>{directionLabel}</span>
        <span className="direction-arrow" aria-hidden="true">←</span>
      </div>
      <div className="animated-number" aria-label={digits.join('')}>
        {digits.map((digit, index) => {
          const isRight = index >= rightStart;
          const active = (isRight && showRightGroup) || (!isRight && showLeftGroup);
          const anchor = phase === 0 && index === digits.length - 1;
          return (
            <React.Fragment key={`${digit}-${index}`}>
              <span
                className={`animated-digit ${active ? (isRight ? 'digit-units' : 'digit-thousands') : ''} ${anchor ? 'digit-anchor' : ''}`}
                style={{ '--digit-delay': `${Math.abs((digits.length - 1) - index) * 90}ms` }}
              >
                {digit}
                {anchor && <small>{lang === 'uz' ? 'birlar' : 'единицы'}</small>}
              </span>
              {index === boundaryAfter && (
                <span className={`animated-divider ${showBoundary ? 'divider-visible' : ''}`} aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div
        className={`class-name-row ${showClassNames ? 'class-names-visible' : ''}`}
        style={{ gridTemplateColumns: `${boundaryAfter + 1}fr ${digits.length - boundaryAfter - 1}fr` }}
      >
        <span className="class-name-thousands">{thousandsLabel}</span>
        <span className="class-name-units">{unitsLabel}</span>
      </div>
      {showTable && showClassNames && digits.length === 6 && (
        <PlaceValueTable values={digits} compact showClassBanners={false} />
      )}
    </div>
  );
};

const AnimatedExplanationScreen = ({
  screen,
  c,
  onNext,
  onPrev,
  showReplayButton = true,
}) => {
  const lang = useLang();
  const t = useT();
  const steps = c.explanationSteps;
  const [phase, setPhase] = useState(null);
  const [visited, setVisited] = useState(() => new Set());
  const [runKey, setRunKey] = useState(0);
  const [bitReactionKey, setBitReactionKey] = useState(0);
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.interactionIntro, lang, screen),
    [c.interactionIntro, lang, screen],
  ));
  const finished = visited.size === steps.length;
  const canAdvance = useAdvanceGate(finished, audio);
  const activePhase = phase ?? 0;

  const explainStep = (index) => {
    if (index > visited.size && !visited.has(index)) return;
    const step = steps[index];
    setPhase(index);
    setVisited((previous) => new Set([...previous, index]));
    setBitReactionKey((current) => current + 1);
    const narration = c.audio?.[lang]?.[index] ?? c.audio?.ru?.[index] ?? t(step.text);
    audio.pushOneOff(narration);
  };

  const replay = () => {
    setPhase(null);
    setVisited(new Set());
    setRunKey((current) => current + 1);
    setBitReactionKey((current) => current + 1);
    audio.pushOneOff(t(c.interactionIntro));
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className={`screen-stack explanation-screen explanation-screen-${screen}`}>
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="explanation-layout">
          <div className="explanation-visual">
            <ClassGroupingAnimation
              digits={c.digits}
              boundaryAfter={c.boundaryAfter}
              phase={steps[activePhase].visualPhase ?? activePhase}
              runKey={runKey}
              showTable={c.showTable}
              tableTransfer={c.tableTransfer}
              leftRevealPhase={c.leftRevealPhase ?? 2}
            />
          </div>
          <div className="explanation-copy" aria-live="polite">
            <BitCoach
              text={phase === null ? t(c.startPrompt) : t(steps[phase].shortText ?? steps[phase].label)}
              mood={getBitStepMood(phase, steps.length)}
              actionKey={bitReactionKey}
            />
          </div>
        </div>
        <div className={`explanation-timeline timeline-count-${steps.length}`} aria-label={t(c.title)}>
          {steps.map((step, index) => (
            <button
              type="button"
              key={t(step.label)}
              className={`timeline-step ${index === phase ? 'timeline-active' : ''} ${visited.has(index) ? 'timeline-visited' : ''} ${phase === null && index === 0 ? 'timeline-awaiting' : ''}`}
              disabled={index > visited.size && !visited.has(index)}
              onClick={() => explainStep(index)}
            >
              <span>{visited.has(index) ? '✓' : index + 1}</span>
              <strong>{t(step.label)}</strong>
            </button>
          ))}
        </div>
        {finished && showReplayButton && (
          <div className="explanation-finish-row">
            <p className="explanation-result">{t(c.resultText)}</p>
            <button type="button" className="btn btn-secondary explanation-replay" onClick={replay}>
              <span aria-hidden="true">↻</span> {t(c.replayLabel)}
            </button>
          </div>
        )}
      </div>
    </Stage>
  );
};

// Retained as a reusable guided-choice template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const GuidedClassTrainerScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const lang = useLang();
  const t = useT();
  const [stepIndex, setStepIndex] = useState(storedAnswer?.solved ? c.trainerSteps.length - 1 : 0);
  const [stepSolved, setStepSolved] = useState(storedAnswer?.solved === true);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState(storedAnswer?.solved ? t(c.doneText) : '');
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? true);
  const currentStep = c.trainerSteps[stepIndex];
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const visualPhase = solved
    ? 3
    : (stepIndex === 0 ? (stepSolved ? 1 : 0) : (stepIndex === 1 ? 1 : 2));

  const pick = (index) => {
    if (!canAnswer || solved || stepSolved || wrong.has(index)) return;
    attempts.current += 1;
    if (index !== currentStep.correctIndex) {
      firstTry.current = false;
      setWrong((previous) => new Set([...previous, index]));
      setMessage(t(currentStep.hint));
      audio.pushOneOff(t(currentStep.hint));
      return;
    }

    setStepSolved(true);
    setMessage(t(currentStep.correctText));
    audio.pushOneOff(t(currentStep.correctText));

    if (stepIndex === c.trainerSteps.length - 1) {
      setSolved(true);
      setMessage(t(c.doneText));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.resultCode,
        studentAnswerIndex: null,
        studentAnswer: c.resultCode,
        correct: firstTry.current,
        firstTry: firstTry.current,
        attempts: attempts.current,
        solved: true,
        trainerStep: c.trainerSteps.length,
      });
    }
  };

  const nextTrainerStep = () => {
    if (!stepSolved || solved) return;
    setStepIndex((current) => current + 1);
    setStepSolved(false);
    setWrong(new Set());
    setMessage('');
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack trainer-screen">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <p className="lead">{t(c.trainerLead)}</p>
        <div className="trainer-layout">
          <div className="trainer-visual">
            <ClassGroupingAnimation
              digits={c.digits}
              boundaryAfter={c.boundaryAfter}
              phase={visualPhase}
              runKey={stepIndex}
              leftRevealPhase={2}
            />
          </div>
          <div className="trainer-task">
            <BitCoach
              text={solved ? t(c.doneText) : t(currentStep.prompt)}
              mood={solved ? 'happy' : 'present'}
            />
            {!solved && (
              <>
                <div className="trainer-progress" aria-label={`${stepIndex + 1} / ${c.trainerSteps.length}`}>
                  {c.trainerSteps.map((_, index) => (
                    <span
                      key={index}
                      className={`${index < stepIndex ? 'trainer-dot-done' : ''} ${index === stepIndex ? 'trainer-dot-active' : ''}`}
                    />
                  ))}
                </div>
                <h2 className="question-title">{t(currentStep.prompt)}</h2>
                <div className="options-grid options-three trainer-options">
                  {currentStep.options.map((option, index) => (
                    <button
                      type="button"
                      key={`${t(option)}-${index}`}
                      className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${stepSolved && index === currentStep.correctIndex ? 'trainer-option-correct' : ''}`}
                      disabled={!canAnswer || stepSolved || wrong.has(index)}
                      onClick={() => pick(index)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{t(option)}</span>
                    </button>
                  ))}
                </div>
                <FeedbackBlock show={Boolean(message)} correct={stepSolved}>
                  <p>{message}</p>
                </FeedbackBlock>
                {stepSolved && stepIndex < c.trainerSteps.length - 1 && (
                  <div className="inline-action">
                    <button type="button" className="btn btn-secondary" onClick={nextTrainerStep}>
                      {lang === 'uz' ? 'Keyingi qadam' : 'Следующий шаг'} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </>
            )}
            {solved && <p className="trainer-done">{t(c.doneText)}</p>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// Retained as a reusable grade-4 interaction template for later lessons.
// eslint-disable-next-line no-unused-vars
const DigitBuilderScreen = ({
  screen,
  c,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const lang = useLang();
  const t = useT();
  const locked = c.target.map((value) => value === null);
  const initialSlots = c.target.map(() => null);
  const [slots, setSlots] = useState(() => {
    if (storedAnswer?.solved && Array.isArray(storedAnswer.finalSlots)) return storedAnswer.finalSlots;
    return initialSlots;
  });
  const sourceDigits = useMemo(
    () => c.digits.map((value, index) => ({ id: `${value}-${index}`, value })),
    [c.digits],
  );
  const [selectedId, setSelectedId] = useState(null);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [checked, setChecked] = useState(false);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const [attemptCount, setAttemptCount] = useState(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const intro = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(intro, lang, screen),
    [intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const usedIds = new Set(slots.filter(Boolean).map((slot) => slot.id));
  const available = sourceDigits.filter((digit) => !usedIds.has(digit.id));

  const place = (digitId, slotIndex) => {
    if (!canAnswer || solved || locked[slotIndex]) return;
    const digit = sourceDigits.find((item) => item.id === digitId);
    if (!digit) return;
    setChecked(false);
    setSlots((prev) => {
      const next = prev.map((slot) => (slot?.id === digitId ? null : slot));
      next[slotIndex] = digit;
      return next;
    });
    setSelectedId(null);
  };

  const clearSlot = (slotIndex) => {
    if (solved || locked[slotIndex]) return;
    if (selectedId) {
      place(selectedId, slotIndex);
      return;
    }
    setChecked(false);
    setSlots((prev) => prev.map((slot, index) => (index === slotIndex ? null : slot)));
  };

  const check = () => {
    if (available.length > 0 || solved) return;
    attempts.current += 1;
    setAttemptCount(attempts.current);
    const correct = slots.every((slot, index) => {
      if (c.target[index] === null) return slot === null;
      return slot?.value === c.target[index];
    });
    if (firstTry.current === null) firstTry.current = correct;
    setChecked(true);
    if (correct) {
      setSolved(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.target.filter((value) => value !== null).join(''),
        studentAnswerIndex: null,
        studentAnswer: slots.map((slot) => slot?.value ?? '').join(''),
        correct: firstTry.current,
        firstTry: firstTry.current,
        attempts: attempts.current,
        solved: true,
        finalSlots: slots,
      });
      audio.pushOneOff(t(c.audio?.on_correct ?? c.doneText));
    } else {
      audio.pushOneOff(t(c.audio?.on_wrong ?? (attempts.current > 1 ? c.hint2 : c.hint1)));
    }
  };

  const nav = (
    <>
      <NavBack onClick={onPrev} />
      <NavNext onClick={onNext} disabled={!canAdvance} />
    </>
  );

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={nav}>
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <p className="lead">{t(c.instruction)}</p>
        <div className="builder-frame">
          <PlaceValueTable values={slots.map((slot) => slot?.value ?? '')} />
          <div className="slot-overlay" aria-label={t(c.title)}>
            {slots.map((slot, index) => (
              <button
                type="button"
                key={`slot-${index}`}
                className={`drop-slot ${locked[index] ? 'drop-locked' : ''} ${selectedId ? 'drop-ready' : ''}`}
                onClick={() => clearSlot(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  place(event.dataTransfer.getData('text/plain'), index);
                }}
                aria-label={`${index + 1}`}
              >
                {locked[index] ? '—' : (slot?.value ?? '·')}
              </button>
            ))}
          </div>
          <div className="digit-tray">
            {available.map((digit) => (
              <button
                type="button"
                key={digit.id}
                className={`digit-card ${selectedId === digit.id ? 'digit-selected' : ''}`}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('text/plain', digit.id)}
                onClick={() => setSelectedId((current) => (current === digit.id ? null : digit.id))}
              >
                {digit.value}
              </button>
            ))}
            {available.length === 0 && <span className="tray-empty">{lang === 'uz' ? 'Barcha raqamlar joylashtirildi' : 'Все цифры размещены'}</span>}
          </div>
          {!solved && (
            <div className="inline-action">
              <button type="button" className="btn btn-white-accent" disabled={available.length > 0} onClick={check}>
                {lang === 'uz' ? 'Tekshirish' : 'Проверить'}
              </button>
            </div>
          )}
        </div>
        <FeedbackBlock show={checked || solved} correct={solved}>
          <p>{solved ? t(c.doneText) : t(attemptCount > 1 ? c.hint2 : c.hint1)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable matching template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const ClassMatchScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState(() => new Set(storedAnswer?.matched ?? []));
  const [message, setMessage] = useState('');
  const [reactionCorrect, setReactionCorrect] = useState(null);
  const solved = matched.size === c.labels.length;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const chooseGroup = (group) => {
    if (!selected || solved || !canAnswer) return;
    const item = c.labels.find((label) => label.id === selected);
    if (item.group === group) {
      const nextMatched = new Set([...matched, selected]);
      setMatched(nextMatched);
      setSelected(null);
      setReactionCorrect(true);
      setMessage(nextMatched.size === c.labels.length
        ? t(c.doneText)
        : (lang === 'uz' ? "To'g'ri. Birinchi moslik topildi." : 'Верно. Первая связь найдена.'));
      if (nextMatched.size === c.labels.length && !storedAnswer?.solved) {
        onAnswer({
          stage: null,
          screenIdx: screen,
          question: t(c.instruction),
          options: c.labels.map((label) => t(label.text)),
          correctIndex: null,
          correctAnswer: '125 → thousands; 407 → units',
          studentAnswerIndex: null,
          studentAnswer: 'matched',
          correct: true,
          firstTry: true,
          attempts: c.labels.length,
          solved: true,
          matched: [...nextMatched],
        });
        audio.pushOneOff(t(c.doneText));
      }
    } else {
      setReactionCorrect(false);
      setMessage(t(c.hint));
      audio.pushOneOff(t(c.hint));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <p className="lead">{t(c.instruction)}</p>
        <div className="match-board">
          <div className="match-labels">
            {c.labels.map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={matched.has(item.id) || !canAnswer}
                className={`class-label ${selected === item.id ? 'class-label-selected' : ''} ${matched.has(item.id) ? 'class-label-done' : ''}`}
                onClick={() => setSelected(item.id)}
              >
                {matched.has(item.id) ? '✓ ' : ''}{t(item.text)}
              </button>
            ))}
          </div>
          <NumberGroups left="125" right="407" active={selected === 'thousands' ? 'left' : (selected === 'units' ? 'right' : null)} />
          <div className="match-targets">
            {c.groups.map((group) => (
              <button type="button" className="match-target" key={group} disabled={!selected || solved} onClick={() => chooseGroup(group)}>
                {group}
              </button>
            ))}
          </div>
        </div>
        <FeedbackBlock show={Boolean(message) || solved} correct={reactionCorrect === true || solved}>
          <p>{solved ? t(c.doneText) : message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable place-value template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const ValueRoundsScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [round, setRound] = useState(storedAnswer?.solved ? c.rounds.length : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [reactionCorrect, setReactionCorrect] = useState(null);
  const solved = round >= c.rounds.length;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio.intro, lang, screen),
    [c.audio.intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];

  const pick = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    if (index === current.correctIndex) {
      const nextRound = round + 1;
      setReactionCorrect(true);
      setMessage(t(c.correctText));
      setWrong(new Set());
      if (nextRound >= c.rounds.length) {
        onAnswer({
          stage: null,
          screenIdx: screen,
          question: t(c.question),
          options: null,
          correctIndex: null,
          correctAnswer: '5 000; 5',
          studentAnswerIndex: null,
          studentAnswer: '5 000; 5',
          correct: true,
          firstTry: true,
          attempts: 2,
          solved: true,
        });
        audio.pushOneOff(t(c.audio.on_correct));
      }
      setTimeout(() => setRound(nextRound), 450);
    } else {
      setReactionCorrect(false);
      setWrong((prev) => new Set([...prev, index]));
      setMessage(t(c.wrongText));
      audio.pushOneOff(t(c.audio.on_wrong));
    }
  };

  const renderNumber = () => {
    const compact = current.number.replace(/\s/g, '');
    return (
      <div className="highlight-number">
        {compact.split('').map((digit, index) => (
          <span key={`${digit}-${index}`} className={index === current.highlight ? 'digit-highlight' : ''}>
            {digit}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        {!solved && (
          <div className="round-card">
            <span className="round-badge">{lang === 'uz' ? `${c.rounds.length} dan ${round + 1}` : `${round + 1} из ${c.rounds.length}`}</span>
            {renderNumber()}
            <h2 className="question-title">{t(c.question)}</h2>
            <div className="value-options">
              {current.options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`option option-center ${wrong.has(index) ? 'option-wrong' : ''}`}
                  disabled={wrong.has(index)}
                  onClick={() => pick(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        {solved && (
          <div className="discovery-card">
            <strong>5 205</strong><span>5 000</span>
            <strong>205 005</strong><span>5</span>
          </div>
        )}
        <FeedbackBlock show={Boolean(message)} correct={reactionCorrect === true || solved}>
          <p>{message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const RuleBuilderScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const fragments = c.fragments[lang];
  const order = [3, 0, 4, 1, 2];
  const [built, setBuilt] = useState(storedAnswer?.built ?? []);
  const [checked, setChecked] = useState(false);
  const solved = storedAnswer?.solved || (checked && built.join(',') === '0,1,2,3,4');
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAdvance = useAdvanceGate(solved, audio);

  const add = (index) => {
    if (solved || built.includes(index)) return;
    setChecked(false);
    setBuilt((prev) => [...prev, index]);
  };

  const remove = (index) => {
    if (solved) return;
    setChecked(false);
    setBuilt((prev) => prev.filter((item) => item !== index));
  };

  const check = () => {
    setChecked(true);
    const correct = built.join(',') === '0,1,2,3,4';
    const reactionSeed = screen * 23 + built.reduce((sum, value) => sum + value, 0);
    if (correct) {
      onAnswer({
        stage: null,
        screenIdx: screen,
        question: t(c.title),
        options: fragments,
        correctIndex: null,
        correctAnswer: t(c.rule),
        studentAnswerIndex: null,
        studentAnswer: built.map((index) => fragments[index]).join(' '),
        correct: true,
        firstTry: true,
        attempts: 1,
        solved: true,
        built,
      });
      audio.pushOneOff(bitSpeech(t, true, reactionSeed, t(c.rule)));
    } else {
      const hint = lang === 'uz'
        ? "Avval son bilan nima qilishimizni, keyin sinflar nomini ayting."
        : 'Сначала назови действие с числом, затем названия классов.';
      audio.pushOneOff(bitSpeech(t, false, reactionSeed, hint));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="rule-builder">
          <div className="rule-built">
            {built.length === 0 && <span>{lang === 'uz' ? 'Qismlarni shu yerga yig\'ing' : 'Собери части здесь'}</span>}
            {built.map((index) => (
              <button type="button" key={index} onClick={() => remove(index)}>{fragments[index]}</button>
            ))}
          </div>
          <div className="fragment-tray">
            {order.filter((index) => !built.includes(index)).map((index) => (
              <button type="button" className="fragment" key={index} onClick={() => add(index)}>
                {fragments[index]}
              </button>
            ))}
          </div>
          {!solved && (
            <div className="inline-action">
              <button type="button" className="btn btn-white-accent" disabled={built.length !== fragments.length} onClick={check}>
                {lang === 'uz' ? 'Tekshirish' : 'Проверить'}
              </button>
            </div>
          )}
        </div>
        <FeedbackBlock
          show={checked || solved}
          correct={solved}
          reaction={(checked || solved)
            ? getBitReaction(solved, screen * 23 + built.reduce((sum, value) => sum + value, 0))
            : null}
        >
          <p>{solved ? t(c.rule) : (lang === 'uz' ? "Avval harakatni, keyin sinflarni nomlang." : 'Сначала назови действие, затем классы.')}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable grouped-choice template for later grade-4 lessons.
// eslint-disable-next-line no-unused-vars
const GuidedGroupsScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [step, setStep] = useState(storedAnswer?.solved ? 2 : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [reactionCorrect, setReactionCorrect] = useState(null);
  const solved = step >= 2;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const canAdvance = useAdvanceGate(solved, audio);

  const choose = (index) => {
    if (solved || wrong.has(index)) return;
    if (index === c.correctIndices[step]) {
      const next = step + 1;
      setWrong(new Set());
      setReactionCorrect(true);
      setMessage(next === 2
        ? t(c.doneText)
        : (lang === 'uz' ? "To'g'ri. O'ng guruh topildi. Endi chap guruhni aniqlang." : 'Верно. Правая группа найдена. Теперь определи левую.'));
      setStep(next);
      if (next === 2) {
        onAnswer({
          stage: null,
          screenIdx: screen,
          question: t(c.title),
          options: null,
          correctIndex: null,
          correctAnswer: '348 | 216',
          studentAnswerIndex: null,
          studentAnswer: '348 | 216',
          correct: true,
          firstTry: true,
          attempts: 2,
          solved: true,
        });
        audio.pushOneOff(t(c.doneText));
      }
    } else {
      const hint = lang === 'uz' ? "O'ng tomondan uchta raqamni sanang." : 'Отсчитай три цифры с правой стороны.';
      setReactionCorrect(false);
      setMessage(hint);
      setWrong((prev) => new Set([...prev, index]));
      audio.pushOneOff(hint);
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="guided-card">
          <div className="raw-number">348216</div>
          {step > 0 && <NumberGroups left={step > 1 ? '348' : '…'} right="216" active={step > 1 ? null : 'right'} />}
          {!solved && (
            <>
              <h2 className="question-title">{t(c.stepQuestions[step])}</h2>
              <div className="value-options">
                {c.stepOptions[step].map((option, index) => (
                  <button
                    type="button"
                    className={`option option-center ${wrong.has(index) ? 'option-wrong' : ''}`}
                    disabled={wrong.has(index)}
                    key={option}
                    onClick={() => choose(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
          {solved && <NumberGroups left="348" right="216" />}
        </div>
        <FeedbackBlock show={Boolean(message) || solved} correct={reactionCorrect === true || solved}>
          <p>{solved ? t(c.doneText) : message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// Retained as a reusable grade-4 interaction template for later lessons.
const StrategyScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const [step, setStep] = useState(storedAnswer?.solved ? 2 : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.solved === true);
  const [reactionSeed, setReactionSeed] = useState(null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const firstTry = useRef(storedAnswer?.firstTry ?? null);
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio.intro, lang, screen),
    [c.audio.intro, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const solved = step === 2;
  const canAdvance = useAdvanceGate(solved, audio);
  const optionsRaw = step === 0 ? c.options : c.followupOptions;
  const sourceCorrectIndex = step === 0 ? c.correctIndex : c.followupCorrectIndex;
  const optionOrder = buildOptionOrder(
    optionsRaw.length,
    sourceCorrectIndex,
    screen * 4 + step + 2,
  );
  const options = optionOrder.map((index) => t(optionsRaw[index]));
  const correctIndex = optionOrder.indexOf(sourceCorrectIndex);

  const choose = (index) => {
    if (!canAnswer || solved || wrong.has(index)) return;
    attempts.current += 1;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === sourceCorrectIndex;
    const nextReactionSeed = screen * 29 + step * 3 + index;
    if (firstTry.current === null) firstTry.current = correct;
    setLastCorrect(correct);
    setReactionSeed(nextReactionSeed);
    if (correct) {
      if (step === 0) {
        setStep(1);
        setWrong(new Set());
        setMessage(t(c.audio.on_correct));
        audio.pushOneOff(bitSpeech(t, true, nextReactionSeed, t(c.audio.on_correct)));
      } else {
        setStep(2);
        setMessage(t(c.correctText));
        onAnswer({
          stage: SCREEN_META[screen].scope,
          screenIdx: screen,
          question: `${t(c.question)} ${t(c.followupQuestion)}`,
          options: [...c.options.map((value) => t(value)), ...c.followupOptions.map((value) => t(value))],
          correctIndex: null,
          correctAnswer: `${t(c.options[c.correctIndex])}; ${t(c.followupOptions[c.followupCorrectIndex])}`,
          studentAnswerIndex: null,
          studentAnswer: `${t(c.options[c.correctIndex])}; ${t(c.followupOptions[index])}`,
          correct: firstTry.current,
          firstTry: firstTry.current,
          attempts: attempts.current,
          solved: true,
        });
        audio.pushOneOff(bitSpeech(t, true, nextReactionSeed, t(c.correctText)));
      }
    } else {
      setWrong((prev) => new Set([...prev, index]));
      const text = step === 0
        ? t(c.wrong[sourceIndex] ?? c.audio.on_wrong)
        : (lang === 'uz' ? 'Minglar sinfidagi guruhga qarang.' : 'Посмотри на группу класса тысяч.');
      setMessage(text);
      audio.pushOneOff(bitSpeech(t, false, nextReactionSeed, text));
    }
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack strategy-screen">
        <Bridge screen={screen} />
        <StrategyDecomposition step={step} t={t} />
        <div className="strategy-phase" key={step}>
          <h1 className="title h-title">{t(step === 0 ? c.question : c.followupQuestion)}</h1>
          <div className="answer-stage strategy-answer-stage">
            <div className={`answer-layer answer-options-layer ${solved ? 'answer-layer-hidden' : ''}`}>
              <div className="options-grid options-three">
                {options.map((option, index) => (
                  <button
                    type="button"
                    className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${solved && index === correctIndex ? 'option-correct-reveal option-answer-confirm' : ''} ${solved && index !== correctIndex ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={wrong.has(index) || solved}
                    key={`${option}-${index}`}
                    onClick={() => choose(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`answer-layer answer-proof-layer ${solved ? 'answer-layer-visible' : ''}`}>
              <VisualAnswerProof
                formula={t(c.followupOptions[c.followupCorrectIndex])}
              />
              {solved && (
                <BitAnswerComment
                  reaction={getBitReaction(true, reactionSeed ?? (screen * 29 + correctIndex))}
                >
                  <p>{t(c.correctText)}</p>
                </BitAnswerComment>
              )}
            </div>
          </div>
        </div>
        <FeedbackBlock
          show={Boolean(message) && !solved}
          correct={lastCorrect}
          reaction={reactionSeed !== null ? getBitReaction(lastCorrect, reactionSeed) : null}
        >
          <p>{solved ? t(c.correctText) : message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const SummaryScreen = ({ screen, c, answers, onAnswer, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const reflectionOrder = buildOptionOrder(
    c.reflectionOptions.length,
    c.reflectionCorrectIndex,
    screen,
  );
  const reflectionOptions = reflectionOrder.map((index) => c.reflectionOptions[index]);
  const reflectionCorrectIndex = reflectionOrder.indexOf(c.reflectionCorrectIndex);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);
  const solved = picked === reflectionCorrectIndex;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(c.audio, lang, screen),
    [c.audio, lang, screen],
  ));
  const correctFirstTry = answers[11]?.correctCount ?? 0;
  const totalScored = answers[11]?.totalQuestions ?? 4;
  const award = CONTENT.awards.find((item) => correctFirstTry >= item.min)
    ?? CONTENT.awards[CONTENT.awards.length - 1];

  const choose = (index) => {
    setPicked(index);
    const sourceIndex = reflectionOrder[index];
    const correct = sourceIndex === c.reflectionCorrectIndex;
    const reactionSeed = screen * 31 + index;
    if (correct) {
      onAnswer({
        stage: null,
        screenIdx: screen,
        question: t(c.reflectionStart),
        options: reflectionOptions.map((option) => t(option)),
        correctIndex: reflectionCorrectIndex,
        correctAnswer: t(reflectionOptions[reflectionCorrectIndex]),
        studentAnswerIndex: index,
        studentAnswer: t(reflectionOptions[index]),
        correct: true,
        firstTry: true,
        attempts: 1,
        solved: true,
      });
      audio.pushOneOff(bitSpeech(
        t,
        true,
        reactionSeed,
        t(c.reflectionCorrectAudio ?? reflectionOptions[index]),
      ));
    } else {
      audio.pushOneOff(bitSpeech(t, false, reactionSeed, t(c.reflectionWrongAudio ?? {
        ru: 'Чтобы увидеть классы, цифры нужно сгруппировать.',
        uz: "Sinflarni ko'rish uchun raqamlarni guruhlaymiz.",
      })));
    }
  };

  const finish = () => {
    if (!solved || finished) return;
    setFinished(true);
    finishLesson();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={finish} disabled={!solved || finished} finish />
        </>
      )}
    >
      <div className="screen-stack summary-stack">
        <div className={`reward-stage ${solved ? 'reward-unlocked' : 'reward-locked'}`}>
          {solved && (
            <div className="reward-confetti" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
            </div>
          )}
          <div className="reward-bit"><BitSVG state={solved ? 'happy' : 'present'} /></div>
          <div className="reward-medal" aria-hidden="true">{solved ? '★' : '🔒'}</div>
          <span className="reward-kicker">
            {solved
              ? (lang === 'uz' ? 'UNVON OCHILDI' : 'ЗВАНИЕ ОТКРЫТО')
              : (lang === 'uz' ? 'OXIRGI QADAM' : 'ПОСЛЕДНИЙ ШАГ')}
          </span>
          <h1>
            {solved
              ? t(award.title)
              : (lang === 'uz' ? 'Mukofotni oching' : 'Открой награду')}
          </h1>
          <div className="reward-score">
            <strong>{correctFirstTry}/{totalScored}</strong>
            <span>{lang === 'uz' ? 'tezkor test birinchi urinishda' : 'блиц-теста с первой попытки'}</span>
          </div>
        </div>
        <div className={`unlock-guide ${solved ? 'unlock-guide-done' : ''}`}>
          <div className="unlock-guide-step">
            <span>1</span>
            <i aria-hidden="true">{solved ? '✓' : '☝'}</i>
            <p>
              {solved
                ? (lang === 'uz' ? "To'g'ri qoida tanlandi" : 'Правильное правило выбрано')
                : (lang === 'uz' ? 'Qoidani tanlang' : 'Выбери правило')}
            </p>
          </div>
          <b aria-hidden="true">→</b>
          <div className="unlock-guide-step">
            <span>2</span>
            <i aria-hidden="true">{solved ? '★' : '🔒'}</i>
            <p>
              {solved
                ? (lang === 'uz' ? 'Unvon va medal ochildi' : 'Звание и медаль открыты')
                : (lang === 'uz' ? 'Medalni oching' : 'Открой медаль')}
            </p>
          </div>
        </div>
        <div className="summary-action-layout">
          <div className="summary-rule-strip">
            <div className="summary-rule-heading">
              <span aria-hidden="true">3 → |</span>
              <h2>{t(c.mainLabel)}</h2>
            </div>
            <div className="summary-rule-items">
              {c.main.map((item, index) => (
                <span key={t(item)}>
                  <i>{index + 1}</i>
                  <p>{t(item)}</p>
                </span>
              ))}
            </div>
          </div>
          <div className="summary-card reflection-card">
            <span className="summary-question-kicker">
              {lang === 'uz' ? 'YAKUNIY SAVOL' : 'ФИНАЛЬНЫЙ ВОПРОС'}
            </span>
            <h2 className="summary-question">{t(c.reflectionQuestion ?? c.reflectionStart)}</h2>
            <p className="summary-question-stem">{t(c.reflectionStart)}</p>
            <div className={`reflection-options ${solved ? 'reflection-options-solved' : ''}`}>
              {reflectionOptions.map((option, index) => (
                <button
                  type="button"
                  key={t(option)}
                  className={`reflection-option ${picked === index && !solved ? 'reflection-wrong' : ''} ${solved && index === reflectionCorrectIndex ? 'option-answer-confirm' : ''} ${solved && index !== reflectionCorrectIndex ? 'option-answer-dismiss' : ''}`}
                  style={{ '--answer-exit-delay': `${index * 85}ms` }}
                  disabled={solved}
                  onClick={() => choose(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {t(option)}
                </button>
              ))}
            </div>
            {solved && (
              <div className="reflection-resolution">
                <div className="reflection-solved">✓ {t(reflectionOptions[reflectionCorrectIndex])}</div>
                <BitAnswerComment reaction={getBitReaction(true, screen * 31 + reflectionCorrectIndex)}>
                  <p>
                    {lang === 'uz'
                      ? 'Ajoyib. Qoida esda — unvon ochildi!'
                      : 'Отлично. Правило запомнено — звание открыто!'}
                  </p>
                </BitAnswerComment>
              </div>
            )}
            <FeedbackBlock
              show={picked !== null && !solved}
              correct={false}
              reaction={picked !== null ? getBitReaction(false, screen * 31 + picked) : null}
            >
              <p>
                {lang === 'uz'
                  ? "Sinflarni ko'rish uchun o'ngdan uchtadan guruhlaymiz."
                  : 'Чтобы увидеть классы, группируем справа по три разряда.'}
              </p>
            </FeedbackBlock>
          </div>
        </div>
      </div>
    </Stage>
  );
};

const QuickNumberCard = ({ c, solved }) => {
  const t = useT();
  const boundaryIndex = c.quickNumber.length - 3;
  return (
    <div className={`quick-number-card ${solved ? 'quick-number-card-solved' : ''}`}>
      <span className="quick-number-label">
        <span aria-hidden="true">⚡</span> {t(c.quickLabel)}
      </span>
      <div className="quick-number-digits" aria-label={c.quickNumber}>
        {c.quickNumber.split('').map((digit, index) => (
          <React.Fragment key={`${digit}-${index}`}>
            {index === boundaryIndex && <i className="quick-class-boundary" aria-hidden="true" />}
            <strong
              className={`${index === c.highlightIndex ? 'quick-digit-highlight' : ''} ${index < boundaryIndex ? 'quick-proof-left' : 'quick-proof-right'}`}
            >
              {digit}
            </strong>
          </React.Fragment>
        ))}
      </div>
      <p className="quick-number-proof">{t(c.proof ?? c.correctText)}</p>
    </div>
  );
};

const RapidTestConsoleScreen = ({
  screen,
  c,
  items,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const lang = useLang();
  const t = useT();
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? items.length - 1 : 0);
  const [roundSolved, setRoundSolved] = useState(restored);
  const [completed, setCompleted] = useState(restored);
  const [wrong, setWrong] = useState(() => new Set());
  const [message, setMessage] = useState(restored ? t(c.completionText) : '');
  const [reactionSeed, setReactionSeed] = useState(null);
  const firstTry = useRef(storedAnswer?.subResults ?? Array(items.length).fill(null));
  const attempts = useRef(storedAnswer?.attemptsByRound ?? Array(items.length).fill(0));
  const current = items[Math.min(round, items.length - 1)];
  const audioValue = c.audio?.intro ?? c.audio;
  const audio = useAudio(useMemo(
    () => localizedScreenSegments(audioValue, lang, screen),
    [audioValue, lang, screen],
  ));
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(completed, audio);
  const optionOrder = buildOptionOrder(
    current.options.length,
    current.correctIndex,
    screen * 4 + round,
  );
  const options = optionOrder.map((index) => t(current.options[index]));
  const correctIndex = optionOrder.indexOf(current.correctIndex);

  const choose = (index) => {
    if (!canAnswer || roundSolved || wrong.has(index)) return;
    attempts.current[round] += 1;
    const sourceIndex = optionOrder[index];
    const correct = sourceIndex === current.correctIndex;
    const nextReactionSeed = screen * 37 + round * 3 + index;
    if (firstTry.current[round] === null) firstTry.current[round] = correct;
    setReactionSeed(nextReactionSeed);
    if (!correct) {
      setWrong((previous) => new Set([...previous, index]));
      const hint = t(current.wrong?.[sourceIndex] ?? current.audio?.on_wrong);
      setMessage(hint);
      audio.pushOneOff(bitSpeech(t, false, nextReactionSeed, hint));
      return;
    }

    setRoundSolved(true);
    setMessage(t(current.correctText));
    audio.pushOneOff(bitSpeech(
      t,
      true,
      nextReactionSeed,
      t(current.audio?.on_correct ?? current.correctText),
    ));
    if (round === items.length - 1) {
      const correctCount = firstTry.current.filter(Boolean).length;
      setCompleted(true);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: items.map((item) => t(item.options[item.correctIndex])).join('; '),
        studentAnswerIndex: null,
        studentAnswer: 'rapid-test-completed',
        correct: correctCount === items.length,
        firstTry: correctCount === items.length,
        attempts: attempts.current.reduce((sum, value) => sum + value, 0),
        solved: true,
        subResults: [...firstTry.current],
        attemptsByRound: [...attempts.current],
        correctCount,
        totalQuestions: items.length,
      });
    }
  };

  const nextRound = () => {
    if (!roundSolved || completed) return;
    setRound((value) => value + 1);
    setRoundSolved(false);
    setWrong(new Set());
    setMessage('');
    setReactionSeed(null);
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} />
          <NavNext onClick={onNext} disabled={!canAdvance} />
        </>
      )}
    >
      <div className="screen-stack rapid-console">
        <Bridge screen={screen} />
        <h1 className="title h-title">{t(c.title)}</h1>
        <div className="rapid-panel">
          <div className="quick-test-meter">
            <span>{t(c.progressLabel)}</span>
            <div aria-hidden="true">
              {items.map((_, index) => (
                <i key={index} className={index <= round || completed ? 'quick-meter-active' : ''} />
              ))}
            </div>
            <strong>{round + 1} / {items.length}</strong>
          </div>
          <QuickNumberCard key={`quick-${round}`} c={current} solved={roundSolved} />
          <h2 className="question-title">{t(current.question)}</h2>
          <div className="answer-stage rapid-answer-stage" key={`rapid-answer-${round}`}>
            <div className={`answer-layer answer-options-layer ${roundSolved ? 'answer-layer-hidden' : ''}`}>
              <div className={`options-grid ${options.length === 3 ? 'options-three' : ''} ${current.optionLayout === 'single-column' ? 'rapid-options-single-column' : ''}`}>
                {options.map((option, index) => (
                  <button
                    type="button"
                    key={`${option}-${index}`}
                    className={`option ${wrong.has(index) ? 'option-wrong' : ''} ${roundSolved && index === correctIndex ? 'option-correct-reveal option-answer-confirm' : ''} ${roundSolved && index !== correctIndex ? 'option-answer-dismiss' : ''}`}
                    style={{ '--answer-exit-delay': `${index * 85}ms` }}
                    disabled={!canAnswer || wrong.has(index) || roundSolved}
                    onClick={() => choose(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`answer-layer answer-proof-layer rapid-proof-layer ${roundSolved ? 'answer-layer-visible' : ''}`}>
              <VisualAnswerProof
                formula={t(current.proof ?? current.options[current.correctIndex])}
                label={t(current.proofLabel ?? current.correctText)}
              />
              {roundSolved && (
                <BitAnswerComment
                  reaction={getBitReaction(true, reactionSeed ?? (screen * 37 + round * 3 + correctIndex))}
                >
                  <p>{message}</p>
                </BitAnswerComment>
              )}
              {roundSolved && !completed && (
                <button type="button" className="btn btn-secondary" onClick={nextRound}>
                  {lang === 'uz' ? 'Keyingi tezkor savol' : 'Следующий быстрый вопрос'} <span aria-hidden="true">→</span>
                </button>
              )}
              {completed && (
                <div className="rapid-complete">
                  <span aria-hidden="true">⚡</span>
                  <strong>{t(c.completionText)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
        <FeedbackBlock
          show={Boolean(message) && !roundSolved}
          correct={false}
          reaction={reactionSeed !== null ? getBitReaction(false, reactionSeed) : null}
        >
          <p>{message}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

const DigitShiftAnimation = ({ t, solved }) => {
  const labels = [
    t({ ru: 'СОТ. ТЫС.', uz: 'YUZ MING' }),
    t({ ru: 'ДЕС. ТЫС.', uz: 'O‘N MING' }),
    t({ ru: 'ТЫС.', uz: 'MING' }),
    t({ ru: 'СОТ.', uz: 'YUZ' }),
    t({ ru: 'ДЕС.', uz: 'O‘N' }),
    t({ ru: 'ЕД.', uz: 'BIR' }),
  ];
  const digits = ['3', '6', '2', '4', '0'];

  return (
    <div className={`digit-shift-sequence ${solved ? 'digit-shift-solved' : 'digit-shift-pending'}`}>
      <svg
        className="digit-shift-svg"
        viewBox="0 0 720 214"
        role="img"
        aria-label={t({
          ru: 'Все цифры числа 36240 перемещаются на один разряд влево. Цифра 6 переходит из тысяч в десятки тысяч, а справа появляется новый ноль.',
          uz: '36240 sonining barcha raqamlari chapga bir xona siljiydi. 6 raqami minglar xonasidan o‘n minglar xonasiga o‘tadi, o‘ngda yangi nol paydo bo‘ladi.',
        })}
      >
        <path className="digit-shift-route" d="M 300 59 C 270 34, 215 34, 185 59" />
        <path className="digit-shift-route-arrow" d="M 199 51 L 184 59 L 198 68" />

        {labels.map((label, index) => {
          const x = 20 + index * 115;
          return (
            <g key={label}>
              <text className="digit-shift-label" x={x + 50} y="26" textAnchor="middle">{label}</text>
              <rect className="digit-shift-slot" x={x} y="69" width="100" height="78" rx="17" />
            </g>
          );
        })}

        {digits.map((digit, index) => {
          const x = 151 + index * 115;
          return (
            <g
              key={`${digit}-${index}`}
              className={`digit-shift-token ${digit === '6' ? 'digit-shift-six' : ''}`}
            >
              <rect x={x} y="78" width="68" height="60" rx="14" />
              <text x={x + 34} y="120" textAnchor="middle">{digit}</text>
            </g>
          );
        })}

        <g className="digit-shift-new-zero">
          <rect x="611" y="78" width="68" height="60" rx="14" />
          <text x="645" y="120" textAnchor="middle">0</text>
        </g>

        <g className="digit-shift-six-value">
          <rect x="205" y="165" width="310" height="37" rx="18" />
          <text x="360" y="190" textAnchor="middle">
            <tspan>6 000</tspan>
            <tspan className="digit-shift-formula-multiply">  × 10  </tspan>
            <tspan className="digit-shift-formula-arrow">=</tspan>
            <tspan>  60 000</tspan>
          </text>
        </g>
      </svg>
      <p className="digit-shift-caption">
        {solved
          ? t({
            ru: 'Цифра 6 перешла из тысяч в десятки тысяч.',
            uz: "6 raqami minglardan o‘n minglarga o‘tdi.",
          })
          : t({
            ru: 'Подсказка: следи только за цифрой 6.',
            uz: 'Maslahat: faqat 6 raqamini kuzating.',
          })}
      </p>
    </div>
  );
};

const BoundaryRepairAnimation = ({ solved, t }) => {
  const digits = ['5', '2', '4', '1', '6'];

  return (
    <div className={`boundary-repair ${solved ? 'boundary-repair-solved' : ''}`}>
      <div className="boundary-repair-bit">
        <BitSVG state={solved ? 'nod' : 'think'} />
        <span>{t({ ru: 'ЗАПИСЬ BIT', uz: 'BIT YOZUVI' })}</span>
      </div>
      <svg
        viewBox="0 0 620 142"
        role="img"
        aria-label={solved
          ? t({ ru: 'Разделители плавно перемещаются к правильной границе 52 и 416', uz: "Ajratgichlar 52 va 416 orasidagi to‘g‘ri chegaraga silliq o‘tadi" })
          : t({ ru: 'Неправильная запись Бита: 5, 241 и 6', uz: "Bitning noto‘g‘ri yozuvi: 5, 241 va 6" })}
      >
        {digits.map((digit, index) => {
          const x = 60 + index * 105;
          return (
            <g key={`${digit}-${index}`} className="repair-digit">
              <rect x={x} y="22" width="72" height="68" rx="15" />
              <text x={x + 36} y="68" textAnchor="middle">{digit}</text>
            </g>
          );
        })}
        <rect className="repair-divider repair-divider-left" x="146" y="27" width="5" height="58" rx="3" />
        <rect className="repair-divider repair-divider-right" x="461" y="27" width="5" height="58" rx="3" />
        <rect className="repair-divider-correct" x="251" y="20" width="6" height="72" rx="3" />
        <text className="repair-group-label repair-label-left" x="147" y="124" textAnchor="middle">
          {t({ ru: '52 · КЛАСС ТЫСЯЧ', uz: '52 · MINGLAR SINFI' })}
        </text>
        <text className="repair-group-label repair-label-right" x="410" y="124" textAnchor="middle">
          {t({ ru: '416 · КЛАСС ЕДИНИЦ', uz: '416 · BIRLAR SINFI' })}
        </text>
      </svg>
    </div>
  );
};

const CityCodeMissionFigure = ({ solved, t }) => {
  const labels = [
    t({ ru: 'сот. тыс.', uz: 'yuz ming' }),
    t({ ru: 'дес. тыс.', uz: 'o‘n ming' }),
    t({ ru: 'тысячи', uz: 'ming' }),
    t({ ru: 'сотни', uz: 'yuz' }),
    t({ ru: 'десятки', uz: 'o‘n' }),
    t({ ru: 'единицы', uz: 'bir' }),
  ];
  const digits = ['1', '8', '0', '2', '4', '0'];
  const clueOrder = [4, 0, 2, 5, 1, 3];

  return (
    <div className={`city-code-mission ${solved ? 'city-code-solved' : ''}`}>
      <div className="city-code-model-stage">
        <div className="city-code-layer city-clue-layer">
          {clueOrder.map((index) => (
            <span key={labels[index]} className="city-clue">
              <small>{labels[index]}</small>
              <strong>{digits[index]}</strong>
            </span>
          ))}
        </div>
        <div className="city-code-layer city-table-layer">
          <PlaceValueTable values={digits} compact />
        </div>
      </div>
      <div className="city-code-result" aria-live="polite">
        <span aria-hidden="true">⌁</span>
        <strong>{t({ ru: 'СТАНЦИЯ · 180 | 240', uz: 'STANSIYA · 180 | 240' })}</strong>
      </div>
    </div>
  );
};

const StrategyDecomposition = ({ step, t }) => {
  const digits = '482731'.split('');

  return (
    <div className={`strategy-decomposition strategy-decomposition-step-${step}`}>
      <div className="strategy-digit-row" aria-label="482731">
        {digits.map((digit, index) => (
          <React.Fragment key={`${digit}-${index}`}>
            {index === 3 && <i className="strategy-boundary" aria-hidden="true" />}
            <span className={index < 3 ? 'strategy-thousands-digit' : 'strategy-units-digit'}>{digit}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="strategy-visual-note">
        {step === 0 && (
          <>
            <span aria-hidden="true">⌕</span>
            <strong>{t({ ru: 'Найди короткий путь', uz: 'Qisqa yo‘lni toping' })}</strong>
          </>
        )}
        {step === 1 && (
          <>
            <span className="strategy-count" aria-hidden="true"><i>3</i><i>2</i><i>1</i></span>
            <strong>{t({ ru: 'Отделяем справа три разряда', uz: 'O‘ngdan uchta xonani ajratamiz' })}</strong>
          </>
        )}
        {step === 2 && (
          <VisualAnswerProof
            formula="482 731 = 482 × 1 000 + 731"
            label={t({ ru: '482 полные тысячи, остаток 731', uz: '482 ta to‘liq ming, qoldiq 731' })}
          />
        )}
      </div>
    </div>
  );
};

const screenFigure = (screen, t) => {
  if (screen === 0) {
    return ({ solved }) => <DataCenterScene raw={CONTENT.s0.numberRaw} resolved={solved} t={t} />;
  }
  if (screen === 1) {
    return () => (
      <div className="mini-place">
        <div><span>{t({ ru: 'сотни', uz: 'yuzlar' })}</span><strong>6</strong></div>
        <div><span>{t({ ru: 'десятки', uz: "o'nlar" })}</span><strong>4</strong></div>
        <div><span>{t({ ru: 'единицы', uz: 'birlar' })}</span><strong>2</strong></div>
      </div>
    );
  }
  if (screen === 2) {
    return () => (
      <div className="overflow-model">
        <strong className="floating-digit">4</strong>
        <div className="mini-place">
          <div><span>{t({ ru: 'сотни', uz: 'yuzlar' })}</span><strong>2</strong></div>
          <div><span>{t({ ru: 'десятки', uz: "o'nlar" })}</span><strong>0</strong></div>
          <div><span>{t({ ru: 'единицы', uz: 'birlar' })}</span><strong>8</strong></div>
        </div>
      </div>
    );
  }
  if (screen === 3) {
    return () => (
      <div className="example-strip">
        {CONTENT.s3.examples.map((value) => <span key={value}>{value}</span>)}
      </div>
    );
  }
  if (screen === 5) {
    return () => (
      <div className="sequence-strip">
        {CONTENT.s5.sequence.map((value, index) => (
          <React.Fragment key={value}>
            <span>{value}</span>{index < CONTENT.s5.sequence.length - 1 && <b>←</b>}
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (screen === 8) {
    return ({ solved }) => <DigitShiftAnimation t={t} solved={solved} />;
  }
  if (screen === 13) {
    return ({ solved }) => <BoundaryRepairAnimation solved={solved} t={t} />;
  }
  if (screen === 14) {
    return ({ solved }) => <CityCodeMissionFigure solved={solved} t={t} />;
  }
  return null;
};

const makeChoiceComponent = (screen, extras = {}) => function ChoiceComponent(props) {
  const t = useT();
  const { contentKey, ...choiceExtras } = extras;
  const c = CONTENT[contentKey ?? `s${screen}`];
  const objectMode = Array.isArray(c.objects);
  const options = objectMode
    ? c.objects.map((item) => (
      <span className="object-option" key={item.code}>
        <span>{t(item.name)}</span>
        <strong>{item.code}</strong>
      </span>
    ))
    : c.options;
  const answerOptions = objectMode
    ? c.objects.map((item) => ({
      ru: `${item.name.ru}: ${item.code}`,
      uz: `${item.name.uz}: ${item.code}`,
    }))
    : c.options;
  return (
    <ChoiceScreen
      {...props}
      {...choiceExtras}
      screen={screen}
      c={c}
      options={options}
      answerOptions={answerOptions}
      figure={screenFigure(screen, t)}
      fact={c.factBadge ? {
        badge: c.factBadge,
        text: c.factText,
        audio: c.factAudio,
      } : null}
    />
  );
};

const Screen0 = makeChoiceComponent(0, { resetOnReturn: true });
const Screen8 = makeChoiceComponent(8);
const Screen13 = makeChoiceComponent(13);
const Screen14 = makeChoiceComponent(14);

const Screen1 = (props) => (
  <ReasoningRoundsScreen {...props} screen={1} c={CONTENT.foundationReview} foundation />
);
const Screen2 = (props) => (
  <AnimatedExplanationScreen {...props} screen={2} c={CONTENT.method1} showReplayButton={false} />
);
const Screen3 = (props) => (
  <AnimatedExplanationScreen {...props} screen={3} c={CONTENT.method2} showReplayButton={false} />
);
const Screen4 = (props) => <AnimatedExplanationScreen {...props} screen={4} c={CONTENT.bonus} showReplayButton={false} />;
const Screen5 = (props) => <DividerPlacementScreen {...props} screen={5} c={CONTENT.dividerGuided} guided />;
const Screen6 = (props) => <ReasoningRoundsScreen {...props} screen={6} c={CONTENT.challenge6} />;
const Screen7 = (props) => <ReasoningRoundsScreen {...props} screen={7} c={CONTENT.challenge7} />;
const Screen9 = (props) => <RuleBuilderScreen {...props} screen={9} c={CONTENT.s9} />;
const Screen10 = (props) => <DividerPlacementScreen {...props} screen={10} c={CONTENT.dividerIndependent} />;
const Screen11 = (props) => (
  <RapidTestConsoleScreen
    {...props}
    screen={11}
    c={CONTENT.rapidTest}
    items={[CONTENT.quick11, CONTENT.quick12, CONTENT.quick13, CONTENT.quick14]}
  />
);
const Screen12 = (props) => <StrategyScreen {...props} screen={12} c={CONTENT.s12} />;
const Screen15 = (props) => <SummaryScreen {...props} screen={15} c={CONTENT.s15} />;

const SCREENS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
  Screen15,
];

export default function Grade4Dars01({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration needs a mount timestamp
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[data.screenIdx] = data;
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const rapidAnswer = answers[11];
    const totalQuestions = rapidAnswer?.totalQuestions ?? 4;
    const correctAnswers = rapidAnswer?.correctCount ?? 0;
    const rapidFirstTry = rapidAnswer?.subResults ?? [];
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: {
        total: totalQuestions,
        firstTryCorrect: rapidFirstTry.filter(Boolean).length,
      },
      skillTags: ['place_value', 'class_grouping', 'internal_zero', 'model_to_number', 'strategy_explanation'],
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else {
      console.log('[Grade4 Dars01 preview]', payload);
    }
  }, [answers, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {preview && (
          <div className="preview-language" aria-label="Preview language">
            {['ru', 'uz'].map((code) => (
              <button
                type="button"
                key={code}
                className={previewLang === code ? 'preview-active' : ''}
                onClick={() => setPreviewLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background:
    radial-gradient(circle at 12% 12%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 88% 80%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root p,
.lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
button { font: inherit; }
.ambient {
  display: none;
}
.ambient-one {
  width: 260px;
  height: 260px;
  left: -150px;
  top: 20%;
  background: rgba(22,143,163,.12);
}
.ambient-two {
  width: 300px;
  height: 300px;
  right: -180px;
  bottom: -80px;
  background: rgba(255,91,53,.11);
}
.title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 650;
  line-height: 1.08;
  letter-spacing: -.012em;
}
.h-title { font-size: clamp(26px, 4.2vw, 36px); }
.lead {
  color: ${T.ink2};
  font-size: clamp(14px, 1.8vw, 16px);
  line-height: 1.48;
  width: min(760px, 100%);
}
.bridge {
  align-self: center;
  color: ${T.cyan};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .02em;
  text-align: center;
}
.topic-chip {
  align-self: center;
  padding: 6px 11px;
  border-radius: 999px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  background: rgba(247,248,244,.88);
  backdrop-filter: blur(14px);
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
.stage-content {
  flex: 1;
  min-height: 0;
  overflow: clip;
  overscroll-behavior: contain;
  padding-top: clamp(8px, 1.4vw, 13px);
  padding-bottom: 10px;
}
.stage-nav {
  flex-shrink: 0;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: rgba(247,248,244,.92);
  border-top: 1px solid rgba(80,97,109,.14);
  backdrop-filter: blur(14px);
}
.screen-stack {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.question-title {
  color: ${T.ink};
  font-size: clamp(17px, 2.5vw, 21px);
  line-height: 1.3;
  font-weight: 750;
}
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.options-three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.option {
  min-height: 58px;
  padding: 12px 14px;
  border: 1px solid rgba(80,97,109,.10);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: linear-gradient(145deg, #FFFFFF, #FBFCFA);
  cursor: pointer;
  text-align: left;
  font-weight: 650;
  box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44);
  transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.option:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},.5), 0 0 0 3px rgba(22,143,163,.07);
}
.option:focus-visible, .btn:focus-visible, .digit-card:focus-visible,
.drop-slot:focus-visible, .fragment:focus-visible, .class-label:focus-visible,
.match-target:focus-visible, .reflection-option:focus-visible {
  outline: 3px solid rgba(22,143,163,.38);
  outline-offset: 3px;
}
.option:disabled { cursor: default; }
.option-wrong { opacity: .28; filter: grayscale(.6); }
.option-letter {
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 800;
}
.solved-option {
  min-height: 58px;
  align-self: center;
  min-width: 0;
  width: 100%;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 15px;
  color: ${T.success};
  background: ${T.successSoft};
  box-shadow: 0 12px 26px -18px rgba(34,122,83,.48);
}
.choice-proof-layer {
  grid-template-columns: minmax(190px, .8fr) minmax(260px, 1.2fr);
  align-items: stretch;
  gap: 10px;
}
.bit-answer-comment {
  min-width: 0;
  min-height: 72px;
  padding: 7px 12px 7px 6px;
  border: 1px solid rgba(34,122,83,.18);
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
  box-shadow: 0 12px 26px -20px rgba(34,122,83,.5);
}
.bit-answer-comment-figure {
  width: 51px;
  height: 64px;
  flex: 0 0 51px;
  animation: g4reactionhop .72s ease .72s both;
}
.bit-answer-comment-figure .g1-char { width: 100%; height: 100%; }
.bit-answer-comment-copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.bit-answer-comment-copy > strong {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.2;
}
.bit-answer-comment-copy p {
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.35;
}
.answer-stage {
  position: relative;
  display: grid;
  min-height: 58px;
}
.answer-layer {
  grid-area: 1 / 1;
  align-self: center;
  min-width: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(10px) scale(.985);
  transition:
    opacity .7s ease,
    transform .8s cubic-bezier(.22,.8,.3,1),
    visibility 0s linear .8s;
}
.answer-options-layer {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
  transition-delay: 0s;
}
.answer-options-layer.answer-layer-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-8px) scale(.985);
  transition:
    opacity .34s ease .56s,
    transform .5s ease .5s,
    visibility 0s linear .92s;
}
.answer-proof-layer.answer-layer-visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
  transition-delay: .72s, .66s, 0s;
}
.option-correct-reveal {
  border-color: rgba(34,122,83,.3);
  color: ${T.success};
  background: ${T.successSoft};
}
.option-answer-dismiss {
  animation: answer-option-dismiss .46s cubic-bezier(.4,0,.7,1) var(--answer-exit-delay, 0ms) both;
}
.option-answer-confirm {
  animation: answer-option-confirm .62s cubic-bezier(.16,1,.3,1) .08s both;
}
@keyframes answer-option-dismiss {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(.96); }
}
@keyframes answer-option-confirm {
  0% { transform: translateY(0) scale(1); box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44); }
  45% { transform: translateY(-7px) scale(1.025); box-shadow: 0 0 0 6px rgba(34,122,83,.10); }
  100% { transform: translateY(-3px) scale(1); box-shadow: 0 12px 26px -17px rgba(34,122,83,.45); }
}
.answer-proof {
  min-width: 0;
  min-height: 58px;
  padding: 9px 14px;
  border: 1px solid rgba(34,122,83,.18);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
  box-shadow: 0 12px 26px -20px rgba(34,122,83,.5);
}
.answer-proof-check {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.success};
  font-weight: 900;
  animation: proof-check-in .7s cubic-bezier(.16,1,.3,1) .35s both;
}
.answer-proof > div { min-width: 0; display: grid; gap: 2px; }
.answer-proof strong {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 2vw, 18px);
  line-height: 1.25;
}
.answer-proof small { color: ${T.success}; font-size: 10px; line-height: 1.25; font-weight: 800; }
.column-calculation {
  width: max-content;
  min-width: 128px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  color: ${T.navy};
  font-variant-numeric: tabular-nums;
}
.column-row {
  position: relative;
  min-height: 22px;
  padding: 0 8px;
  display: block;
  text-align: right;
  white-space: nowrap;
}
.column-operation i {
  position: absolute;
  left: -8px;
  bottom: 0;
  color: ${T.accent};
  font-family: inherit;
  font-size: 1.15em;
  font-style: normal;
}
.column-rule {
  height: 2px;
  margin: 2px 0 3px;
  display: block;
  border-radius: 999px;
  background: ${T.navy};
}
.column-result { color: ${T.success}; font-weight: 900; }
.place-value-calculation {
  width: min(520px, 100%);
  min-width: 0;
  display: grid;
  gap: 5px;
}
.place-value-row {
  padding: 5px 8px;
  border-radius: 9px;
  display: grid;
  grid-template-columns: auto 18px minmax(122px, 1fr) 18px auto;
  align-items: center;
  gap: 5px;
  color: ${T.ink2};
  background: rgba(255,255,255,.72);
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 800;
}
.place-value-row b,
.place-value-row em {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-style: normal;
  white-space: nowrap;
}
.place-value-row em { color: ${T.success}; }
.place-value-row i { color: ${T.accent}; font-style: normal; text-align: center; }
@keyframes proof-check-in {
  from { opacity: 0; transform: scale(.3) rotate(-18deg); }
  to { opacity: 1; transform: scale(1) rotate(0); }
}
.btn {
  min-height: 48px;
  padding: 11px 20px;
  border: 0;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
}
.btn-primary, .btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: #FFFFFF;
  box-shadow: 0 9px 24px -12px rgba(255,91,53,.52), 0 0 0 1px rgba(255,91,53,.14);
}
.btn-primary:hover:not(:disabled), .btn-primary.btn-ready,
.btn-white-accent:hover:not(:disabled), .btn-white-accent.btn-ready {
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 28px -12px rgba(255,91,53,.65);
}
.btn-ready { animation: ready-pulse 1.6s ease-in-out infinite; }
@keyframes ready-pulse {
  50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); }
}
.btn-ghost {
  color: ${T.ink2};
  background: transparent;
}
.btn-ghost:hover { background: #FFFFFF; box-shadow: 0 8px 20px -15px rgba(${T.shadowBase},.4); }
.btn-secondary {
  color: ${T.cyan};
  background: #FFFFFF;
  box-shadow: 0 8px 22px -14px rgba(22,143,163,.55), 0 0 0 1px rgba(22,143,163,.12);
}
.btn-secondary:hover:not(:disabled) { color: #FFFFFF; background: ${T.cyan}; }
.btn:disabled { opacity: .4; cursor: not-allowed; animation: none; box-shadow: none; }
.feedback {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(8px);
  transition: max-height .8s cubic-bezier(.22,.8,.3,1), opacity .6s ease, transform .7s ease;
}
.feedback-visible { max-height: 260px; opacity: 1; transform: translateY(0); }
.feedback-card {
  min-height: 88px;
  padding: 8px 15px 8px 9px;
  border: 1px solid transparent;
  border-radius: 18px;
  display: flex;
  gap: 13px;
  align-items: center;
  line-height: 1.42;
  font-size: 14px;
  box-shadow: 0 14px 28px -22px rgba(${T.shadowBase},.48);
}
.feedback-correct {
  border-color: rgba(34,122,83,.18);
  color: ${T.success};
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
}
.feedback-hint {
  border-color: rgba(169,111,19,.20);
  color: ${T.warn};
  background: linear-gradient(135deg, #FFFFFF, ${T.warnSoft});
}
.g4-bit-reaction-figure {
  width: 62px;
  height: 76px;
  flex: 0 0 62px;
}
.g4-bit-reaction-figure .g1-char { width: 100%; height: 100%; }
.g4-bit-reaction-copy {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 3px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(15px, 2vw, 18px);
  font-weight: 700;
}
.g4-bit-reaction-copy > strong { line-height: 1.22; }
.g4-bit-reaction-detail {
  color: ${T.ink2};
  font-family: 'Nunito Sans', sans-serif;
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
}
.feedback-hint .g4-bit-reaction-detail { color: ${T.warn}; }
.g4-bit-reaction-ok .g4-bit-reaction-figure {
  animation: g4reactionhop .72s ease both;
}
.g4-bit-reaction-hint .g4-bit-reaction-figure {
  animation: g4reactiontilt .72s ease both;
}
@keyframes g4reactionhop {
  0%, 100% { transform: translateY(0) scale(1); }
  35% { transform: translateY(-9px) scale(1.08); }
  65% { transform: translateY(0) scale(1); }
}
@keyframes g4reactiontilt {
  0%, 100% { transform: rotate(0); }
  30% { transform: rotate(-7deg); }
  65% { transform: rotate(6deg); }
}
.data-scene {
  position: relative;
  isolation: isolate;
  width: min(760px, 100%);
  min-height: 206px;
  margin: 0 auto;
  padding: 17px 184px 15px 20px;
  border-radius: 24px;
  overflow: hidden;
  color: #EAF9FB;
  background:
    radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),
    radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),
    linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
  box-shadow: 0 22px 50px -30px rgba(14,33,44,.75);
}
.data-scene::after {
  content: '';
  position: absolute;
  inset: 1px;
  z-index: -1;
  border: 1px solid rgba(144,228,235,.12);
  border-radius: 23px;
  pointer-events: none;
}
.city-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: .18;
  background-image:
    linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px);
  background-size: 30px 30px;
}
.data-ambient-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(121,211,218,.15);
  border-radius: 50%;
  pointer-events: none;
}
.data-orbit-one {
  width: 210px;
  height: 210px;
  right: -75px;
  top: -98px;
}
.data-orbit-two {
  width: 145px;
  height: 145px;
  right: -43px;
  top: -57px;
}
.data-tower {
  position: relative;
  z-index: 2;
}
.data-console-head {
  min-height: 22px;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
}
.data-node-name {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #9DE3E7;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .13em;
}
.data-node-name > i {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  border-radius: 50%;
  background: ${T.lime};
  box-shadow: 0 0 15px rgba(149,201,61,.9);
  animation: data-node-pulse 1.9s ease-in-out infinite;
}
@keyframes data-node-pulse {
  50% { transform: scale(.72); opacity: .7; box-shadow: 0 0 7px rgba(149,201,61,.7); }
}
.data-state {
  padding: 4px 7px;
  border: 1px solid rgba(255,183,107,.22);
  border-radius: 999px;
  color: #FFD29E;
  background: rgba(169,111,19,.16);
  font-size: 7px;
  font-weight: 850;
  letter-spacing: .06em;
  white-space: nowrap;
  transition: color .8s ease, border-color .8s ease, background .8s ease;
}
.data-scene-resolved .data-state {
  border-color: rgba(119,222,168,.26);
  color: #B5F2D2;
  background: rgba(34,122,83,.2);
}
.tower-screen {
  position: relative;
  width: 100%;
  padding: 10px 14px 8px;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(1,13,22,.62);
  box-shadow:
    inset 0 0 0 1px rgba(144,228,235,.18),
    0 12px 26px -22px rgba(1,13,22,.9);
}
.tower-label-row {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.tower-label {
  color: #79D3DA;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .16em;
}
.tower-label-row small {
  color: rgba(234,249,251,.55);
  font-family: 'JetBrains Mono', monospace;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: .08em;
}
.tower-screen .data-code {
  position: relative;
  z-index: 2;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(28px, 5vw, 43px);
  font-weight: 800;
  letter-spacing: .08em;
}
.data-code > span {
  display: inline-grid;
  place-items: center;
  min-width: .78em;
  text-shadow: 0 0 18px rgba(144,228,235,.12);
  animation: data-digit-in .65s cubic-bezier(.16,1,.3,1) both;
  animation-delay: var(--data-digit-delay);
  transition:
    color .8s ease,
    transform 1.15s cubic-bezier(.22,.8,.3,1);
}
@keyframes data-digit-in {
  from { opacity: 0; transform: translateY(9px) scale(.9); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.data-code-scan {
  position: absolute;
  z-index: 1;
  top: 22px;
  bottom: 18px;
  left: -80px;
  width: 76px;
  opacity: .56;
  background: linear-gradient(90deg, transparent, rgba(121,211,218,.22), rgba(255,255,255,.18), transparent);
  transform: skewX(-12deg);
  animation: data-code-scan 3.4s ease-in-out infinite;
  pointer-events: none;
  transition: opacity .6s ease;
}
@keyframes data-code-scan {
  0%, 12% { transform: translateX(0) skewX(-12deg); opacity: 0; }
  24% { opacity: .6; }
  72% { opacity: .5; }
  88%, 100% { transform: translateX(560px) skewX(-12deg); opacity: 0; }
}
.data-scene-resolved .data-code-scan { opacity: 0; animation-play-state: paused; }
.data-class-reveal {
  position: relative;
  z-index: 2;
  min-height: 13px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 19px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .75s ease .75s, transform .9s cubic-bezier(.16,1,.3,1) .7s;
}
.data-class-reveal span {
  padding: 3px 5px;
  border: 1px solid rgba(121,211,218,.12);
  border-radius: 6px;
  color: #9DE3E7;
  background: rgba(22,143,163,.12);
  font-family: 'JetBrains Mono', monospace;
  font-size: 7px;
  font-weight: 850;
  letter-spacing: .08em;
  text-align: center;
}
.data-class-reveal span:last-child {
  border-color: rgba(255,255,255,.12);
  color: #FFFFFF;
  background: rgba(255,255,255,.07);
}
.data-scene-resolved .data-class-reveal {
  opacity: 1;
  transform: translateY(0);
}
.data-code-divider {
  width: 0;
  height: 48px;
  margin: 0;
  border-radius: 99px;
  opacity: 0;
  background: ${T.accent};
  box-shadow: 0 0 0 rgba(255,91,53,0);
  transform: scaleY(.25);
  transition:
    width 1.1s cubic-bezier(.22,.8,.3,1),
    height 1.1s cubic-bezier(.22,.8,.3,1),
    margin 1.1s cubic-bezier(.22,.8,.3,1),
    opacity .65s ease .2s,
    transform 1.1s cubic-bezier(.22,.8,.3,1),
    box-shadow .9s ease .65s;
}
.data-scene-resolved .data-code > span:nth-of-type(-n+3) {
  color: #A8EAF0;
  transform: translateX(-4px);
}
.data-scene-resolved .data-code > span:nth-last-of-type(-n+3) {
  color: #FFFFFF;
  transform: translateX(4px);
}
.data-scene-resolved .data-code-divider {
  width: 4px;
  height: 52px;
  margin: 0 10px;
  opacity: 1;
  transform: scaleY(1);
  box-shadow: 0 0 16px rgba(255,91,53,.55);
}
.data-diagnostics {
  min-height: 27px;
  margin-top: 7px;
  display: grid;
  grid-template-columns: .75fr 1.35fr .85fr;
  gap: 6px;
}
.data-diagnostics > span {
  min-width: 0;
  padding: 5px 6px;
  border: 1px solid rgba(144,228,235,.08);
  border-radius: 7px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(234,249,251,.68);
  background: rgba(255,255,255,.055);
  font-family: 'JetBrains Mono', monospace;
  font-size: 6px;
  font-weight: 800;
  white-space: nowrap;
}
.data-diagnostics i {
  width: 5px;
  height: 5px;
  flex: 0 0 5px;
  border-radius: 50%;
  background: #79D3DA;
  box-shadow: 0 0 7px rgba(121,211,218,.65);
}
.data-diagnostics .diagnostic-structure {
  color: #FFD29E;
  border-color: rgba(255,183,107,.13);
  transition: color .8s ease, border-color .8s ease, background .8s ease;
}
.diagnostic-structure i {
  background: ${T.accent};
  box-shadow: 0 0 8px rgba(255,91,53,.72);
  animation: diagnostic-alert 1.2s ease-in-out infinite;
}
@keyframes diagnostic-alert { 50% { opacity: .35; transform: scale(.72); } }
.data-scene-resolved .diagnostic-structure {
  color: #B5F2D2;
  border-color: rgba(119,222,168,.2);
  background: rgba(34,122,83,.14);
}
.data-scene-resolved .diagnostic-structure i {
  background: #77DEA8;
  box-shadow: 0 0 8px rgba(119,222,168,.62);
  animation: none;
}
.city-network {
  position: absolute;
  z-index: 1;
  top: 18px;
  right: 14px;
  width: 154px;
  color: rgba(157,227,231,.58);
}
.city-network svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.city-network > span {
  display: block;
  margin-top: -1px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 6px;
  font-weight: 800;
  letter-spacing: .1em;
  text-align: center;
}
.network-route {
  fill: none;
  stroke: rgba(121,211,218,.45);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 4 6;
  animation: network-route-flow 2.4s linear infinite;
  transition: stroke .8s ease, stroke-width .8s ease;
}
@keyframes network-route-flow { to { stroke-dashoffset: -20; } }
.network-node {
  fill: #12384B;
  stroke: #79D3DA;
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
  animation: network-node-ping 2s ease-in-out infinite;
}
.node-b { animation-delay: .45s; }
.node-c { animation-delay: .9s; }
@keyframes network-node-ping { 50% { transform: scale(1.35); filter: drop-shadow(0 0 4px #79D3DA); } }
.network-building,
.network-windows {
  fill: none;
  stroke: rgba(234,249,251,.68);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.network-windows { stroke-width: 1.4; }
.data-scene-resolved .network-route {
  stroke: #77DEA8;
  stroke-width: 3;
}
.data-scene-resolved .network-node {
  fill: #77DEA8;
  stroke: #B5F2D2;
}
.data-bit-callout {
  position: absolute;
  z-index: 4;
  top: 91px;
  right: 17px;
  width: 142px;
  padding: 7px 8px;
  border: 1px solid rgba(144,228,235,.2);
  border-radius: 10px 10px 3px 10px;
  color: #D6F5F7;
  background: rgba(5,30,43,.82);
  font-size: 8px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
  box-shadow: 0 8px 18px -13px rgba(1,13,22,.9);
  transition: color .7s ease, border-color .7s ease, background .7s ease;
}
.data-scene-resolved .data-bit-callout {
  border-color: rgba(119,222,168,.3);
  color: #B5F2D2;
  background: rgba(17,69,50,.78);
}
.bit-avatar {
  position: absolute;
  right: 24px;
  bottom: 12px;
  width: 104px;
  height: 130px;
  z-index: 2;
  animation: g4bitfloat 3.2s ease-in-out infinite;
}
.bit-avatar .g1-char {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 7px 13px rgba(1,13,22,.28));
}
.data-scene > .bit-avatar {
  right: 42px;
  bottom: -4px;
  width: 88px;
  height: 110px;
}
.bit-small {
  position: relative;
  right: auto;
  bottom: auto;
  width: 72px;
  height: 90px;
  flex: 0 0 72px;
  margin: -8px 0;
  animation: none;
}
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  filter: drop-shadow(0 6px 12px rgba(58,53,48,.22));
}
.g1-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: g4blink 4.4s infinite;
}
@keyframes g4blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96.5% { transform: scaleY(.12); }
}
.g1-bit-ant {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: g4antbob 2.2s ease-in-out infinite;
}
@keyframes g4antbob {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
.g1-bit-wave {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: g4wavebig 1s ease-in-out infinite;
}
@keyframes g4wavebig {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-26deg); }
}
@keyframes g4bitfloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.bit-coach-reacting {
  animation: bit-coach-step-pop .72s cubic-bezier(.16,1,.3,1) both;
}
.bit-coach-reacting .g1-bit-wave {
  animation: g4waveclick .7s ease-in-out 2;
}
.bit-wave-left,
.bit-wave-right,
.bit-think-hand,
.bit-point-arm,
.bit-idea-bulb,
.bit-focus-hands,
.bit-focus-scan,
.bit-nod-hand,
.bit-nod-check {
  transform-box: fill-box;
  transform-origin: center;
}
.bit-double-wave .bit-wave-left {
  transform-origin: bottom right;
  animation: bit-wave-left 1.05s ease-in-out infinite;
}
.bit-double-wave .bit-wave-right {
  transform-origin: bottom left;
  animation: bit-wave-right 1.05s ease-in-out infinite;
}
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }
.bit-coach-reacting .bit-wave-left,
.bit-coach-reacting .bit-wave-right {
  animation-duration: .62s;
  animation-iteration-count: 2;
}
.bit-coach-reacting .bit-think-hand,
.bit-coach-reacting .bit-point-arm,
.bit-coach-reacting .bit-idea-bulb,
.bit-coach-reacting .bit-focus-hands,
.bit-coach-reacting .bit-nod-hand {
  animation-duration: .72s;
  animation-iteration-count: 1;
}
@keyframes bit-wave-left {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(25deg); }
}
@keyframes bit-wave-right {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes bit-think-tap {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(-2px, -3px) rotate(-7deg); }
}
@keyframes bit-point {
  0%, 100% { transform: translateX(0) rotate(0); }
  48% { transform: translateX(4px) rotate(-5deg); }
}
@keyframes bit-target {
  0%, 100% { opacity: .38; transform: scale(.72); }
  50% { opacity: 1; transform: scale(1.1); }
}
@keyframes bit-idea {
  0%, 100% { opacity: .72; transform: translateY(1px) scale(.9); }
  50% { opacity: 1; transform: translateY(-3px) scale(1.08); }
}
@keyframes bit-focus {
  0%, 100% { transform: scale(.96); }
  50% { transform: scale(1.05); }
}
@keyframes bit-scan {
  0%, 100% { opacity: .42; transform: translateY(-3px); }
  50% { opacity: 1; transform: translateY(6px); }
}
@keyframes bit-nod-hand {
  0%, 100% { transform: rotate(0); }
  48% { transform: rotate(-11deg); }
}
@keyframes bit-check {
  0%, 100% { transform: scale(.86); opacity: .72; }
  50% { transform: scale(1.08); opacity: 1; }
}
@keyframes bit-coach-step-pop {
  0% { opacity: .65; transform: translateY(8px) scale(.9); }
  55% { opacity: 1; transform: translateY(-4px) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes g4waveclick {
  0%, 100% { transform: rotate(4deg); }
  35% { transform: rotate(-38deg); }
  68% { transform: rotate(-8deg); }
}
.bit-coach {
  min-height: 96px;
  padding: 10px 14px 10px 8px;
  border: 1px solid rgba(22,143,163,.14);
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${T.ink};
  background: linear-gradient(135deg, #FFFFFF, ${T.cyanSoft});
  box-shadow: 0 14px 30px -23px rgba(22,143,163,.58);
}
.bit-coach-figure {
  width: 68px;
  height: 85px;
  flex: 0 0 68px;
}
.bit-coach-figure .g1-char { width: 100%; height: 100%; }
.bit-coach p {
  color: ${T.ink2};
  font-size: 13px;
  line-height: 1.48;
  font-weight: 680;
}
.bit-coach-hint {
  border-color: rgba(169,111,19,.22);
  background: linear-gradient(135deg, #FFFFFF, ${T.warnSoft});
}
.bit-coach-happy {
  border-color: rgba(34,122,83,.20);
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
}
.method-badge {
  align-self: flex-start;
  padding: 6px 11px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.explanation-layout, .trainer-layout {
  width: min(940px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(300px, .88fr);
  gap: 16px;
  align-items: stretch;
}
.explanation-visual, .trainer-visual,
.explanation-copy, .trainer-task {
  min-width: 0;
  padding: clamp(13px, 2vw, 18px);
  border-radius: 22px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 18px 42px -30px rgba(${T.shadowBase},.54);
}
.explanation-copy, .trainer-task {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}
.class-animation {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  overflow: hidden;
}
.class-animation-six-digit { min-height: 270px; }
.class-direction {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.direction-arrow {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 25px;
  animation: direction-sweep 1.4s ease-in-out infinite;
}
@keyframes direction-sweep {
  0%, 100% { transform: translateX(5px); opacity: .5; }
  50% { transform: translateX(-7px); opacity: 1; }
}
.animated-number {
  min-height: 86px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(5px, 1vw, 9px);
}
.animated-digit {
  position: relative;
  width: clamp(43px, 7vw, 62px);
  height: clamp(58px, 9vw, 76px);
  border: 2px solid rgba(80,97,109,.12);
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: ${T.ink};
  background: #F7F9F7;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(27px, 4.2vw, 39px);
  font-weight: 900;
  box-shadow: 0 10px 22px -18px rgba(${T.shadowBase},.48);
  transition: color .45s ease, background .45s ease, border-color .45s ease, transform .45s ease;
}
.animated-digit small {
  position: absolute;
  top: calc(100% + 5px);
  left: 50%;
  color: ${T.accent};
  font-family: 'Manrope', sans-serif;
  font-size: 9px;
  font-weight: 900;
  white-space: nowrap;
  transform: translateX(-50%);
}
.digit-anchor {
  border-color: rgba(255,91,53,.48);
  color: ${T.accent};
  background: ${T.accentSoft};
  animation: digit-anchor-pulse 1.35s ease-in-out infinite;
}
@keyframes digit-anchor-pulse {
  50% { transform: translateY(-5px); box-shadow: 0 15px 28px -15px rgba(255,91,53,.62); }
}
.digit-units {
  border-color: rgba(22,143,163,.30);
  color: #0A7183;
  background: ${T.cyanSoft};
  animation: digit-group-in .48s ease both;
  animation-delay: var(--digit-delay);
}
.digit-thousands {
  border-color: rgba(23,59,82,.27);
  color: ${T.navy};
  background: #EDF1F4;
  animation: digit-group-in .48s ease both;
  animation-delay: var(--digit-delay);
}
@keyframes digit-group-in {
  from { opacity: .35; transform: translateY(9px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animated-divider {
  width: 0;
  height: 64px;
  border-left: 0 dashed ${T.accent};
  opacity: 0;
  transform: scaleY(.2);
  transition: opacity .35s ease, transform .4s ease, width .35s ease, border-width .35s ease;
}
.divider-visible {
  width: 7px;
  border-left-width: 3px;
  opacity: 1;
  transform: scaleY(1);
}
.class-name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .45s ease, transform .45s ease;
}
.class-names-visible { opacity: 1; transform: translateY(0); }
.class-name-row span {
  padding: 7px 8px;
  border-radius: 10px;
  text-align: center;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .08em;
}
.class-name-thousands { color: #FFFFFF; background: ${T.navy}; }
.class-name-units { color: #FFFFFF; background: ${T.cyan}; }
.class-animation-four-digit .class-name-row {
  grid-template-columns: minmax(80px, 1fr) minmax(190px, 3fr);
}
.class-animation .place-table { margin-top: 2px; }
.class-animation .place-cell { min-height: 58px; }
.class-animation .place-cell span { min-height: 18px; font-size: 7px; }
.class-animation .place-cell strong { min-height: 24px; font-size: 20px; }
.place-transfer {
  width: 100%;
  display: grid;
  gap: 8px;
}
.place-transfer-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: ${T.ink2};
  font-size: 9px;
  font-weight: 800;
}
.place-transfer-prompt strong { color: ${T.cyan}; }
.place-transfer-board {
  position: relative;
  min-height: 172px;
  padding-top: 58px;
}
.place-transfer-source {
  position: absolute;
  z-index: 3;
  inset: 0 0 auto;
  height: 50px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
}
.transfer-digit {
  width: min(45px, 90%);
  height: 45px;
  justify-self: center;
  border: 1px solid rgba(80,97,109,.13);
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 23px;
  font-weight: 900;
  box-shadow: 0 9px 20px -14px rgba(${T.shadowBase},.65);
  will-change: transform, color, background;
  transition:
    transform 1.65s cubic-bezier(.4,0,.2,1),
    color .75s ease,
    background .75s ease,
    box-shadow .75s ease;
  transition-delay: var(--transfer-delay);
}
.transfer-digit-placed {
  transform: translateY(105px) scale(.88);
  color: ${T.cyan};
  background: ${T.cyanSoft};
  box-shadow: 0 10px 22px -14px rgba(22,143,163,.72);
}
.transfer-empty-table { position: relative; z-index: 1; }
.transfer-empty-table .place-cell {
  border: 1px dashed rgba(22,143,163,.25);
  background: rgba(255,255,255,.68);
}
.transfer-status {
  min-height: 18px;
  opacity: 0;
  color: ${T.success};
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  transform: translateY(5px);
  transition: opacity .45s ease, transform .45s ease;
}
.transfer-status-visible { opacity: 1; transform: translateY(0); }
@keyframes explanation-copy-in {
  from { opacity: .2; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
.explanation-timeline {
  width: min(940px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(102px, 1fr));
  gap: 7px;
}
.timeline-step {
  min-height: 52px;
  padding: 7px 8px;
  border: 1px solid rgba(80,97,109,.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.ink2};
  background: #FFFFFF;
  cursor: pointer;
  text-align: left;
  transition: transform .2s ease, border-color .2s ease, background .2s ease, opacity .2s ease;
}
.timeline-step:disabled { cursor: not-allowed; opacity: .43; }
.timeline-step:not(:disabled):hover { transform: translateY(-2px); }
.timeline-step > span {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.timeline-step strong { font-size: 10px; line-height: 1.2; }
.timeline-active {
  border-color: rgba(255,91,53,.34);
  color: ${T.ink};
  background: ${T.accentSoft};
  box-shadow: 0 9px 22px -18px rgba(255,91,53,.55);
}
.timeline-active > span { color: #FFFFFF; background: ${T.accent}; }
.timeline-visited:not(.timeline-active) {
  border-color: rgba(34,122,83,.2);
  color: ${T.success};
  background: ${T.successSoft};
}
.timeline-visited:not(.timeline-active) > span { color: #FFFFFF; background: ${T.success}; }
.timeline-awaiting {
  border-color: rgba(255,91,53,.45);
  animation: ready-pulse 1.45s ease-in-out infinite;
}
.explanation-result, .trainer-done {
  min-width: 0;
  padding: 9px 13px;
  border-radius: 14px;
  color: ${T.success};
  background: ${T.successSoft};
  text-align: center;
  font-weight: 800;
  animation: explanation-copy-in .4s ease both;
}
.explanation-finish-row {
  width: min(940px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
}
.explanation-replay { min-height: 40px; margin: 0; padding: 8px 13px; }
.trainer-task .question-title { font-size: 17px; }
.trainer-progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.trainer-progress span {
  height: 5px;
  border-radius: 999px;
  background: #E5E9E7;
  transition: background .25s ease, transform .25s ease;
}
.trainer-progress .trainer-dot-done { background: ${T.success}; }
.trainer-progress .trainer-dot-active { background: ${T.accent}; transform: scaleY(1.6); }
.trainer-options { grid-template-columns: 1fr !important; }
.trainer-options .option { min-height: 48px; }
.trainer-option-correct {
  border-color: rgba(34,122,83,.25);
  color: ${T.success};
  background: ${T.successSoft};
}
.trainer-task .inline-action .btn { margin-left: auto; }
.foundation-memory {
  width: min(900px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.foundation-memory > div {
  min-height: 42px;
  padding: 8px 11px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #FFFFFF, #F3F8F6);
  box-shadow: 0 11px 24px -20px rgba(${T.shadowBase},.55);
}
.foundation-memory span {
  color: ${T.cyan};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .04em;
  text-transform: uppercase;
  text-align: center;
}
.foundation-recap {
  width: min(760px, 100%);
  min-height: 270px;
  margin: 2px auto 0;
  padding: 17px;
  border: 1px solid rgba(22,143,163,.13);
  border-radius: 24px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  background:
    radial-gradient(circle at 85% 18%, rgba(255,91,53,.10), transparent 30%),
    linear-gradient(145deg, #FFFFFF, #F1F8F6);
  box-shadow: 0 20px 42px -31px rgba(${T.shadowBase},.58);
}
.recap-progress {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.recap-progress i {
  height: 5px;
  border-radius: 999px;
  background: #DEE7E4;
  transition: background .4s ease, transform .4s ease;
}
.recap-progress .recap-progress-active { background: ${T.cyan}; transform: scaleY(1.35); }
.recap-frame {
  min-height: 160px;
  display: grid;
  place-items: center;
  animation: recap-frame-in .65s cubic-bezier(.22,.78,.26,1) both;
}
@keyframes recap-frame-in {
  from { opacity: 0; transform: translateY(10px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.foundation-recap > p {
  color: ${T.cyan};
  text-align: center;
  font-size: 13px;
  font-weight: 800;
}
.recap-place-row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
}
.recap-place-row > div {
  width: 104px;
  min-height: 100px;
  padding: 12px 8px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #FFFFFF;
  box-shadow: 0 14px 28px -21px rgba(${T.shadowBase},.6);
  animation: recap-card-rise .7s ease both;
  animation-delay: var(--recap-delay);
}
@keyframes recap-card-rise {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.recap-place-row strong {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
}
.recap-place-row span {
  color: ${T.ink2};
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}
.recap-sum, .recap-shift {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(7px, 2vw, 16px);
  font-family: 'JetBrains Mono', monospace;
}
.recap-sum strong, .recap-sum b, .recap-shift span {
  padding: 13px 15px;
  border-radius: 15px;
  color: ${T.navy};
  background: #FFFFFF;
  font-size: clamp(22px, 4vw, 32px);
  box-shadow: 0 12px 25px -20px rgba(${T.shadowBase},.7);
}
.recap-sum strong { color: #FFFFFF; background: ${T.cyan}; }
.recap-sum span { color: ${T.accent}; font-size: 20px; font-weight: 900; }
.recap-shift i {
  position: relative;
  color: ${T.accent};
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  animation: direction-sweep 1.4s ease-in-out infinite;
}
.recap-shift-sequence {
  width: min(500px, 100%);
  display: grid;
  place-items: center;
  gap: 2px;
}
.recap-shift-svg {
  width: min(480px, 100%);
  height: 150px;
  overflow: visible;
}
.recap-shift-guide,
.recap-shift-arrow {
  fill: none;
  stroke: ${T.cyan};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 7 7;
  opacity: .55;
}
.recap-shift-arrow { stroke-dasharray: none; }
.recap-shift-label {
  fill: ${T.ink2};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .05em;
}
.recap-shift-slot {
  fill: rgba(255,255,255,.82);
  stroke: rgba(22,143,163,.16);
  stroke-width: 2;
}
.recap-slot-units { animation: recap-slot-units 7.6s ease-in-out both; }
.recap-slot-tens { animation: recap-slot-tens 7.6s ease-in-out both; }
.recap-slot-hundreds { animation: recap-slot-hundreds 7.6s ease-in-out both; }
.recap-moving-seven,
.recap-born-zero {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 42px;
  font-weight: 900;
}
.recap-moving-seven {
  transform-box: view-box;
  transform-origin: center;
  animation: recap-seven-travel 7.6s ease-in-out both;
}
.recap-born-zero {
  fill: ${T.accent};
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}
.recap-born-zero-units { animation: recap-zero-units 7.6s ease-in-out both; }
.recap-born-zero-tens { animation: recap-zero-tens 7.6s ease-in-out both; }
.recap-shift-readout {
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
}
.recap-shift-readout span {
  min-width: 42px;
  color: ${T.navy};
  text-align: center;
  font-size: 18px;
  opacity: .2;
}
.recap-shift-readout i {
  color: ${T.accent};
  font-size: 10px;
  font-style: normal;
}
.recap-readout-seven { animation: recap-readout-seven 7.6s ease both; }
.recap-readout-seventy { animation: recap-readout-seventy 7.6s ease both; }
.recap-readout-seven-hundred { animation: recap-readout-hundred 7.6s ease both; }
.recap-shift-note {
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 900;
}
@keyframes recap-seven-travel {
  0%, 18% { transform: translateX(0); }
  34%, 46% { transform: translateX(-160px); }
  64%, 100% { transform: translateX(-320px); }
}
@keyframes recap-zero-units {
  0%, 29% { opacity: 0; transform: scale(.4); }
  36%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes recap-zero-tens {
  0%, 59% { opacity: 0; transform: scale(.4); }
  67%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes recap-slot-units {
  0%, 22% { fill: ${T.cyanSoft}; stroke: ${T.cyan}; }
  31%, 100% { fill: rgba(255,255,255,.82); stroke: rgba(22,143,163,.16); }
}
@keyframes recap-slot-tens {
  0%, 27%, 51%, 100% { fill: rgba(255,255,255,.82); stroke: rgba(22,143,163,.16); }
  34%, 45% { fill: ${T.cyanSoft}; stroke: ${T.cyan}; }
}
@keyframes recap-slot-hundreds {
  0%, 57% { fill: rgba(255,255,255,.82); stroke: rgba(22,143,163,.16); }
  65%, 100% { fill: ${T.cyanSoft}; stroke: ${T.cyan}; }
}
@keyframes recap-readout-seven {
  0%, 22% { opacity: 1; transform: scale(1.12); }
  30%, 100% { opacity: .2; transform: scale(1); }
}
@keyframes recap-readout-seventy {
  0%, 28%, 52%, 100% { opacity: .2; transform: scale(1); }
  35%, 46% { opacity: 1; transform: scale(1.12); }
}
@keyframes recap-readout-hundred {
  0%, 58% { opacity: .2; transform: scale(1); }
  66%, 100% { opacity: 1; transform: scale(1.12); }
}
.recap-zero {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 66px);
  justify-content: center;
  gap: 8px;
}
.recap-zero > span, .recap-zero > strong {
  height: 78px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
}
.recap-zero > strong {
  color: #FFFFFF;
  background: ${T.accent};
  animation: ready-pulse 1.4s ease-in-out infinite;
}
.recap-zero p {
  grid-column: 1 / -1;
  color: ${T.ink2};
  text-align: center;
  font-size: 11px;
  font-weight: 800;
}
.recap-task-preview { display: flex; gap: 15px; }
.recap-task-preview > span {
  width: 92px;
  height: 108px;
  border: 2px dashed rgba(22,143,163,.24);
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: rgba(255,255,255,.7);
}
.recap-task-preview b { font-family: 'JetBrains Mono', monospace; font-size: 15px; }
.recap-task-preview i {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.accent};
  font-size: 18px;
  font-style: normal;
  animation: ready-pulse 1.4s ease-in-out infinite;
}
.reasoning-card {
  width: min(860px, 100%);
  margin: 0 auto;
  padding: clamp(13px, 2vw, 18px);
  border-radius: 21px;
  display: grid;
  gap: 12px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 18px 38px -28px rgba(${T.shadowBase},.58);
}
.reasoning-progress {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  color: ${T.ink2};
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.reasoning-progress > div {
  display: grid;
  grid-template-columns: repeat(3, minmax(16px, 1fr));
  gap: 5px;
}
.reasoning-progress i { height: 5px; border-radius: 999px; background: #E1E7E4; }
.reasoning-progress .reasoning-active { background: ${T.accent}; animation: ready-pulse 1.6s ease-in-out infinite; }
.reasoning-progress .reasoning-done { background: ${T.success}; }
.reasoning-progress strong { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; }
.reasoning-visual {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
}
.reasoning-visual strong {
  padding: 10px 16px;
  border-radius: 14px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(22px, 4vw, 34px);
  letter-spacing: .05em;
}
.reasoning-visual-solved strong {
  animation: reasoning-confirm 1.15s cubic-bezier(.16,1,.3,1) both;
}
@keyframes reasoning-confirm {
  0% { box-shadow: 0 0 0 0 rgba(34,122,83,0); transform: scale(1); }
  55% { color: ${T.success}; box-shadow: 0 0 0 7px rgba(34,122,83,.10); transform: scale(1.035); }
  100% { color: ${T.success}; box-shadow: 0 0 0 3px rgba(34,122,83,.08); transform: scale(1); }
}
.reasoning-arrow { color: ${T.accent}; font-size: 24px; font-weight: 900; }
.reasoning-answer-stage,
.rapid-answer-stage {
  min-height: 76px;
}
.reasoning-proof-layer,
.rapid-proof-layer {
  display: grid;
  grid-template-columns: minmax(180px, .9fr) minmax(250px, 1.1fr) auto;
  align-items: center;
  gap: 10px;
}
.reasoning-proof-completed .reasoning-complete,
.rapid-proof-layer .rapid-complete {
  width: 100%;
  min-width: 0;
}
.rapid-proof-layer .btn {
  justify-self: end;
}
.reasoning-proof-layer .reasoning-complete,
.rapid-proof-layer .rapid-complete {
  min-width: 190px;
}
.reasoning-complete {
  padding: 11px 14px;
  border-radius: 13px;
  color: ${T.success};
  background: ${T.successSoft};
  text-align: center;
  font-weight: 800;
}
.divider-workbench {
  width: min(820px, 100%);
  margin: 0 auto;
  padding: clamp(16px, 3vw, 24px);
  border-radius: 23px;
  display: grid;
  gap: 15px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 44px -30px rgba(${T.shadowBase},.58);
}
.finger-guide {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 13px;
  border-radius: 15px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  transition:
    color .7s ease,
    background .7s ease,
    box-shadow .8s ease,
    transform .8s cubic-bezier(.22,.8,.3,1);
}
.finger-guide-hand {
  font-size: 28px;
  transform-origin: 50% 100%;
  animation: finger-tap 2.8s ease-in-out infinite;
}
@keyframes finger-tap {
  0%, 20%, 100% { transform: translateX(0) translateY(0) rotate(-8deg); }
  55% { transform: translateX(-15px) translateY(-5px) rotate(-15deg); }
  72% { transform: translateX(-15px) translateY(2px) rotate(-15deg) scale(.92); }
}
.finger-guide strong { font-size: 12px; }
.finger-guide p { margin-top: 3px; color: ${T.ink2}; font-size: 10px; line-height: 1.35; }
.finger-guide-solved {
  color: ${T.success};
  background: ${T.successSoft};
  box-shadow: inset 0 0 0 1px rgba(34,122,83,.15);
}
.finger-guide-solved .finger-guide-hand {
  animation: guide-check-settle 1.1s cubic-bezier(.16,1,.3,1) both;
}
@keyframes guide-check-settle {
  from { opacity: .25; transform: translateY(9px) scale(.5) rotate(-14deg); }
  to { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
}
.finger-count { display: flex; align-items: center; gap: 5px; color: ${T.cyan}; }
.finger-count i {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #FFFFFF;
  font-style: normal;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.finger-count b { color: ${T.accent}; }
.divider-number {
  min-height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider-digit {
  width: clamp(46px, 8vw, 68px);
  height: clamp(58px, 9vw, 76px);
  border: 1px solid rgba(80,97,109,.12);
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: ${T.ink};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(28px, 4.6vw, 40px);
  font-weight: 900;
  box-shadow: 0 10px 22px -18px rgba(${T.shadowBase},.55);
}
.divider-gap {
  position: relative;
  width: clamp(17px, 3vw, 28px);
  height: clamp(64px, 10vw, 84px);
  margin: 0 2px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
}
.divider-gap span {
  position: absolute;
  inset: 8px 50%;
  width: 3px;
  border-radius: 99px;
  background: rgba(22,143,163,.18);
  transform: translateX(-50%) scaleY(.45);
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}
.divider-gap:hover:not(:disabled) span,
.divider-gap:focus-visible span {
  background: rgba(22,143,163,.55);
  transform: translateX(-50%) scaleY(.85);
}
.divider-gap-selected span {
  background: ${T.cyan};
  box-shadow: 0 0 10px rgba(22,143,163,.42);
  transform: translateX(-50%) scaleY(1);
}
.divider-gap-wrong span { background: ${T.warn}; box-shadow: 0 0 10px rgba(169,111,19,.38); }
.divider-gap-correct span {
  background: ${T.success};
  box-shadow: 0 0 14px rgba(34,122,83,.52);
  animation: divider-lock-in 1.55s cubic-bezier(.16,1,.3,1) both;
}
@keyframes divider-lock-in {
  0% { opacity: .15; transform: translateX(-50%) scaleY(.1); box-shadow: 0 0 0 rgba(34,122,83,0); }
  62% { opacity: 1; transform: translateX(-50%) scaleY(1.08); box-shadow: 0 0 18px rgba(34,122,83,.62); }
  100% { opacity: 1; transform: translateX(-50%) scaleY(1); box-shadow: 0 0 10px rgba(34,122,83,.4); }
}
.divider-instruction {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: ${T.ink2};
  text-align: center;
  font-size: 11px;
}
.divider-instruction span { font-size: 22px; }
.divider-outcome {
  display: grid;
  min-height: 78px;
}
.divider-outcome-layer {
  grid-area: 1 / 1;
  align-self: center;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition:
    opacity .65s ease,
    transform .85s cubic-bezier(.22,.8,.3,1),
    visibility 0s linear 0s;
}
.divider-proof-layer {
  display: grid;
  place-items: center;
  gap: 6px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(9px);
}
.divider-proof-layer > p {
  color: ${T.success};
  font-size: 10px;
  font-weight: 900;
  text-align: center;
}
.divider-outcome-solved .divider-prompt-layer {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition-delay: 0s, 0s, .7s;
}
.divider-outcome-solved .divider-proof-layer {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: .42s, .32s, 0s;
}
.divider-outcome-solved .number-group {
  animation: divider-group-confirm 1.2s cubic-bezier(.16,1,.3,1) .48s both;
}
.divider-outcome-solved .group-divider {
  transform-origin: center;
  animation: divider-center-grow 1.45s cubic-bezier(.16,1,.3,1) .25s both;
}
@keyframes divider-group-confirm {
  from { opacity: 0; transform: translateY(8px) scale(.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes divider-center-grow {
  from { opacity: 0; transform: scaleY(.08); }
  to { opacity: 1; transform: scaleY(1); }
}
.shift-comparison {
  width: min(720px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 13px;
}
.shift-number {
  min-height: 84px;
  padding: 10px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: #FFFFFF;
  box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.5);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 900;
}
.shift-number strong {
  padding: 3px 5px;
  border-radius: 8px;
  color: #FFFFFF;
  background: ${T.accent};
}
.shift-arrow { display: grid; place-items: center; gap: 3px; color: ${T.cyan}; text-align: center; }
.shift-arrow b { font-size: 26px; }
.shift-arrow span { max-width: 90px; font-size: 9px; font-weight: 800; }
.digit-shift-sequence {
  width: min(760px, 100%);
  margin: 0 auto;
  display: grid;
  place-items: center;
  gap: 1px;
}
.digit-shift-svg {
  display: block;
  width: 100%;
  height: min(214px, 27vh);
  overflow: visible;
}
.digit-shift-label {
  fill: ${T.ink2};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .04em;
  opacity: 0;
  transform: translateY(-4px);
}
.digit-shift-slot {
  fill: rgba(255,255,255,.82);
  stroke: rgba(22,143,163,.18);
  stroke-width: 2;
}
.digit-shift-route,
.digit-shift-route-arrow {
  fill: none;
  stroke: ${T.accent};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 7 7;
  opacity: 0;
}
.digit-shift-route-arrow {
  stroke-dasharray: none;
  transform-box: fill-box;
  transform-origin: center;
}
.digit-shift-token { transform: translateX(0); }
.digit-shift-token rect,
.digit-shift-new-zero rect {
  fill: #FFFFFF;
  stroke: rgba(80,97,109,.12);
  stroke-width: 1.5;
  filter: drop-shadow(0 8px 7px rgba(${T.shadowBase},.12));
}
.digit-shift-token text,
.digit-shift-new-zero text {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 900;
}
.digit-shift-six rect {
  fill: ${T.accent};
  stroke: ${T.accent};
}
.digit-shift-six text { fill: #FFFFFF; }
.digit-shift-new-zero {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(.35);
}
.digit-shift-new-zero rect {
  fill: #FFF0EB;
  stroke: ${T.accent};
}
.digit-shift-new-zero text { fill: ${T.accent}; }
.digit-shift-six-value {
  opacity: 0;
  transform: translateY(7px);
}
.digit-shift-six-value rect {
  fill: ${T.cyanSoft};
  stroke: rgba(22,143,163,.19);
}
.digit-shift-six-value text {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 21px;
  font-weight: 900;
}
.digit-shift-six-value .digit-shift-formula-arrow,
.digit-shift-six-value .digit-shift-formula-multiply { fill: ${T.accent}; }
.digit-shift-caption {
  width: min(520px, 100%);
  min-height: 34px;
  padding: 8px 16px;
  border: 2px solid rgba(22,143,163,.2);
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.cyan};
  background: linear-gradient(135deg, #FFFFFF, ${T.cyanSoft});
  box-shadow: 0 10px 22px -18px rgba(22,143,163,.62);
  font-size: clamp(9px, 1.3vw, 11px);
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}
.digit-shift-pending .digit-shift-caption::before {
  content: '◆';
  margin-right: 9px;
  color: ${T.accent};
  font-size: 10px;
}
.digit-shift-pending .digit-shift-caption {
  animation: digit-hint-focus 1.9s ease-in-out infinite;
}
.digit-shift-solved .digit-shift-label {
  animation: digit-labels-reveal 4.8s cubic-bezier(.22,.8,.3,1) both;
}
.digit-shift-solved .digit-shift-route {
  animation: digit-route-reveal 4.8s ease both;
}
.digit-shift-solved .digit-shift-route-arrow {
  animation: digit-arrow-reveal 4.8s cubic-bezier(.16,1,.3,1) both;
}
.digit-shift-solved .digit-shift-token {
  animation: digit-token-left-once 4.8s cubic-bezier(.22,.8,.3,1) both;
}
.digit-shift-solved .digit-shift-new-zero {
  animation: digit-new-zero-once 4.8s cubic-bezier(.16,1,.3,1) both;
}
.digit-shift-solved .digit-shift-six-value {
  animation: digit-six-value-once 4.8s ease both;
}
.digit-shift-solved .digit-shift-caption {
  color: ${T.success};
  border-color: rgba(34,122,83,.16);
  background: linear-gradient(135deg, #FFFFFF, ${T.successSoft});
  animation: digit-result-caption 4.8s ease both;
}
@keyframes digit-hint-focus {
  0%, 100% { transform: translateY(0); box-shadow: 0 10px 22px -18px rgba(22,143,163,.62); }
  50% { transform: translateY(-2px); box-shadow: 0 13px 25px -15px rgba(22,143,163,.78), 0 0 0 4px rgba(22,143,163,.06); }
}
@keyframes digit-labels-reveal {
  0%, 7% { opacity: 0; transform: translateY(-5px); }
  24%, 100% { opacity: 1; transform: translateY(0); }
}
@keyframes digit-route-reveal {
  0%, 24% { opacity: 0; }
  41%, 100% { opacity: .78; }
}
@keyframes digit-arrow-reveal {
  0%, 29% { opacity: 0; transform: translate(-2px, -4px) rotate(-45deg) scale(.72); }
  44%, 100% { opacity: .9; transform: translate(-2px, -4px) rotate(-45deg) scale(1); }
}
@keyframes digit-token-left-once {
  0%, 52% { transform: translateX(0); }
  82%, 100% { transform: translateX(-115px); }
}
@keyframes digit-new-zero-once {
  0%, 75% { opacity: 0; transform: scale(.35); }
  90%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes digit-six-value-once {
  0%, 84% { opacity: 0; transform: translateY(7px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes digit-result-caption {
  0%, 86% { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}
.mini-place {
  width: min(500px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.mini-place > div {
  min-height: 84px;
  padding: 10px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #FFFFFF;
  box-shadow: 0 12px 26px -20px rgba(${T.shadowBase},.5);
}
.mini-place span { color: ${T.ink2}; font-size: 11px; font-weight: 700; }
.mini-place strong { font-family: 'JetBrains Mono', monospace; font-size: 30px; color: ${T.cyan}; }
.overflow-model { position: relative; width: min(590px, 100%); margin: 0 auto; padding-left: 70px; }
.floating-digit {
  position: absolute;
  left: 8px;
  top: 20px;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 24px -14px rgba(255,91,53,.8);
  animation: float-digit 2s ease-in-out infinite;
}
@keyframes float-digit { 50% { transform: translateY(-7px); } }
.example-strip, .sequence-strip, .value-comparison {
  width: min(720px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 2vw, 16px);
}
.example-strip span, .sequence-strip span {
  padding: 12px 16px;
  border-radius: 14px;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(18px, 3vw, 25px);
  font-weight: 800;
  box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},.5);
}
.sequence-strip b { color: ${T.cyan}; }
.value-comparison > div {
  flex: 1;
  padding: 14px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  gap: 5px;
  background: #FFFFFF;
  box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.5);
}
.value-comparison strong { font-family: 'JetBrains Mono', monospace; font-size: 23px; }
.value-comparison span { color: ${T.accent}; font-weight: 800; }
.place-table {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
}
.class-banner {
  grid-column: span 3;
  padding: 6px 5px;
  border-radius: 9px 9px 3px 3px;
  color: #FFFFFF;
  text-align: center;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .08em;
}
.class-thousands { background: ${T.navy}; }
.class-units { background: ${T.cyan}; }
.place-cell {
  min-height: 80px;
  padding: 7px 3px;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,.9);
  box-shadow: inset 0 0 0 1px rgba(80,97,109,.10);
}
.place-cell:nth-of-type(n+3):nth-of-type(-n+5) { background: rgba(23,59,82,.055); }
.place-cell span {
  min-height: 25px;
  color: ${T.ink2};
  font-size: 8px;
  line-height: 1.15;
  text-align: center;
}
.place-cell strong {
  min-height: 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(20px, 3vw, 28px);
}
.place-highlight {
  background: ${T.accentSoft} !important;
  box-shadow: inset 0 0 0 2px rgba(255,91,53,.38);
}
.builder-frame, .match-board, .round-card, .guided-card, .rule-builder, .case-model {
  width: min(780px, 100%);
  margin: 0 auto;
  padding: clamp(14px, 2.8vw, 22px);
  border-radius: 22px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 20px 44px -30px rgba(${T.shadowBase},.5);
}
.slot-overlay {
  margin-top: -47px;
  padding: 0 4px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
  position: relative;
  z-index: 2;
}
.drop-slot {
  height: 40px;
  border: 0;
  border-radius: 8px;
  color: ${T.ink};
  background: rgba(229,245,246,.75);
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 900;
  cursor: pointer;
}
.drop-ready { box-shadow: inset 0 0 0 2px rgba(22,143,163,.35); }
.drop-locked { color: ${T.ink3}; background: rgba(135,148,157,.08); cursor: default; }
.digit-tray {
  min-height: 62px;
  margin-top: 15px;
  padding: 9px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  background: #F3F7F5;
}
.digit-card {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 11px;
  color: #FFFFFF;
  background: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 900;
  cursor: grab;
  box-shadow: 0 8px 16px -10px rgba(23,59,82,.8);
}
.digit-selected { background: ${T.accent}; transform: translateY(-3px); }
.tray-empty { color: ${T.success}; font-size: 12px; font-weight: 800; }
.inline-action { margin-top: 14px; display: flex; justify-content: flex-end; }
.number-groups {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.number-group {
  min-width: 115px;
  padding: 13px 18px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 900;
  transition: transform .2s ease, box-shadow .2s ease;
}
.number-group-thousands { color: ${T.navy}; background: rgba(23,59,82,.09); }
.number-group-units { color: ${T.cyan}; background: ${T.cyanSoft}; }
.group-divider { width: 2px; height: 54px; border-radius: 2px; background: ${T.accent}; }
.group-active { transform: translateY(-4px); box-shadow: 0 12px 22px -14px rgba(22,143,163,.7); }
.match-board { display: grid; gap: 14px; }
.match-labels, .match-targets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
.class-label, .match-target {
  min-height: 48px;
  border: 0;
  border-radius: 13px;
  cursor: pointer;
  font-weight: 800;
}
.class-label { color: ${T.navy}; background: rgba(23,59,82,.08); }
.class-label-selected { color: #FFFFFF; background: ${T.navy}; }
.class-label-done { color: ${T.success}; background: ${T.successSoft}; }
.match-target { color: ${T.cyan}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-size: 22px; }
.round-card { display: grid; gap: 13px; }
.round-badge {
  justify-self: start;
  padding: 5px 9px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 900;
}
.highlight-number {
  display: flex;
  justify-content: center;
  gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(34px, 7vw, 56px);
  font-weight: 900;
}
.highlight-number span { padding: 2px 3px; border-radius: 8px; }
.digit-highlight { color: #FFFFFF; background: ${T.accent}; box-shadow: 0 8px 18px -10px rgba(255,91,53,.7); }
.value-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.option-center { justify-content: center; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 18px; }
.discovery-card {
  width: min(520px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.discovery-card > * {
  padding: 13px;
  border-radius: 12px;
  text-align: center;
  background: #FFFFFF;
}
.discovery-card span { color: ${T.accent}; font-weight: 900; }
.rule-built {
  min-height: 120px;
  padding: 12px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 7px;
  color: ${T.ink3};
  background: ${T.cyanSoft};
}
.rule-built button, .fragment {
  border: 0;
  border-radius: 10px;
  padding: 9px 11px;
  cursor: pointer;
  font-weight: 700;
}
.rule-built button { color: #FFFFFF; background: ${T.cyan}; }
.fragment-tray { min-height: 70px; margin-top: 12px; display: flex; flex-wrap: wrap; gap: 7px; }
.fragment { color: ${T.navy}; background: #FFFFFF; box-shadow: 0 8px 18px -14px rgba(${T.shadowBase},.6); }
.guided-card { display: grid; gap: 14px; }
.raw-number {
  justify-self: center;
  padding: 10px 18px;
  border-radius: 13px;
  color: ${T.navy};
  background: #F0F5F3;
  font-family: 'JetBrains Mono', monospace;
  font-size: 29px;
  font-weight: 900;
  letter-spacing: .12em;
}
.strategy-number { margin: 4px auto; }
.bit-error-card {
  width: min(560px, 100%);
  margin: 0 auto;
  padding: 10px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background: #FFFFFF;
  box-shadow: 0 14px 30px -22px rgba(${T.shadowBase},.55);
}
.bit-error-card > div:last-child { display: grid; gap: 6px; }
.bit-error-card span { color: ${T.ink2}; font-size: 11px; font-weight: 800; text-transform: uppercase; }
.bit-error-card strong { font-family: 'JetBrains Mono', monospace; font-size: 31px; color: ${T.warn}; }
.boundary-repair {
  width: min(760px, 100%);
  min-height: 164px;
  margin: 0 auto;
  padding: 10px 14px;
  border-radius: 21px;
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  overflow: hidden;
  background: rgba(255,255,255,.92);
  box-shadow: 0 16px 34px -26px rgba(${T.shadowBase},.55);
}
.boundary-repair-bit {
  align-self: stretch;
  display: grid;
  grid-template-rows: 1fr auto;
  place-items: center;
  color: ${T.ink2};
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .08em;
}
.boundary-repair-bit .g1-char { width: 76px; height: 95px; }
.boundary-repair > svg {
  display: block;
  width: 100%;
  max-height: 150px;
  overflow: visible;
}
.repair-digit rect {
  fill: #FFFFFF;
  stroke: rgba(80,97,109,.14);
  stroke-width: 1.5;
  filter: drop-shadow(0 8px 7px rgba(${T.shadowBase},.11));
}
.repair-digit text {
  fill: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
  font-weight: 900;
}
.repair-divider {
  fill: ${T.warn};
  opacity: 1;
  transform-box: view-box;
  transition:
    x 1.8s cubic-bezier(.22,.78,.24,1),
    opacity .55s ease 1.35s,
    fill 1.1s ease,
    filter 1.2s ease;
}
.repair-divider-correct {
  fill: ${T.success};
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scaleY(.08);
  filter: drop-shadow(0 0 0 rgba(34,122,83,0));
  transition:
    opacity .5s ease 1.2s,
    transform 1.2s cubic-bezier(.16,1,.3,1) 1.1s,
    filter .9s ease 1.55s;
}
.boundary-repair-solved .repair-divider-left {
  x: 251px;
  fill: ${T.success};
  opacity: 0;
}
.boundary-repair-solved .repair-divider-right {
  x: 251px;
  fill: ${T.success};
  opacity: 0;
}
.boundary-repair-solved .repair-divider-correct {
  opacity: 1;
  transform: scaleY(1);
  filter: drop-shadow(0 0 9px rgba(34,122,83,.62));
}
.repair-group-label {
  fill: ${T.success};
  font-size: 10px;
  font-weight: 900;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity .7s ease 1.7s, transform .8s ease 1.62s;
}
.boundary-repair-solved .repair-group-label {
  opacity: 1;
  transform: translateY(0);
}
.boundary-repair-solved .repair-digit {
  animation: repair-digit-confirm 1.1s ease 1.35s both;
}
@keyframes repair-digit-confirm {
  55% { filter: drop-shadow(0 0 7px rgba(34,122,83,.32)); }
}
.city-code-mission {
  width: min(780px, 100%);
  min-height: 176px;
  margin: 0 auto;
  padding: 12px;
  border-radius: 22px;
  display: grid;
  gap: 8px;
  overflow: hidden;
  background: rgba(255,255,255,.92);
  box-shadow: 0 16px 34px -26px rgba(${T.shadowBase},.55);
}
.city-code-model-stage {
  display: grid;
  min-height: 116px;
}
.city-code-layer {
  grid-area: 1 / 1;
  align-self: center;
  transition:
    opacity .75s ease,
    transform 1s cubic-bezier(.22,.8,.3,1),
    visibility 0s linear .95s;
}
.city-clue-layer {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.city-clue {
  min-height: 82px;
  padding: 7px 4px;
  border: 1px dashed rgba(22,143,163,.23);
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: ${T.ink2};
  background: #F5F8F7;
}
.city-clue small { font-size: 7px; font-weight: 800; text-align: center; }
.city-clue strong {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 25px;
}
.city-table-layer {
  opacity: 0;
  visibility: hidden;
  transform: translateY(9px) scale(.985);
}
.city-code-solved .city-clue-layer {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px) scale(.985);
}
.city-code-solved .city-table-layer {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  transition-delay: .3s, .25s, 0s;
}
.city-code-result {
  min-height: 29px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.success};
  background: ${T.successSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .7s ease .95s, transform .8s ease .88s;
}
.city-code-solved .city-code-result { opacity: 1; transform: translateY(0); }
.strategy-decomposition {
  width: min(760px, 100%);
  min-height: 158px;
  flex-shrink: 0;
  margin: 0 auto;
  padding: 14px 18px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  gap: 8px;
  overflow: hidden;
  background: rgba(255,255,255,.93);
  box-shadow: 0 16px 34px -26px rgba(${T.shadowBase},.55);
}
.strategy-digit-row {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.strategy-digit-row > span {
  width: clamp(42px, 6.5vw, 58px);
  height: clamp(52px, 7vw, 66px);
  border: 1px solid rgba(80,97,109,.13);
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(25px, 3.6vw, 34px);
  font-weight: 900;
  transition:
    color .75s ease,
    background .75s ease,
    transform .9s cubic-bezier(.22,.8,.3,1);
}
.strategy-boundary {
  width: 0;
  height: 58px;
  margin: 0;
  border-radius: 99px;
  opacity: 0;
  background: ${T.accent};
  transform: scaleY(.15);
  transition:
    width 1s cubic-bezier(.16,1,.3,1),
    margin 1s cubic-bezier(.16,1,.3,1),
    opacity .6s ease,
    transform 1.15s cubic-bezier(.16,1,.3,1),
    box-shadow .9s ease .45s;
}
.strategy-decomposition-step-1 .strategy-boundary,
.strategy-decomposition-step-2 .strategy-boundary {
  width: 4px;
  margin: 0 8px;
  opacity: 1;
  transform: scaleY(1);
  box-shadow: 0 0 12px rgba(255,91,53,.42);
}
.strategy-decomposition-step-1 .strategy-thousands-digit,
.strategy-decomposition-step-2 .strategy-thousands-digit {
  color: ${T.navy};
  background: rgba(23,59,82,.08);
  transform: translateX(-3px);
}
.strategy-decomposition-step-1 .strategy-units-digit,
.strategy-decomposition-step-2 .strategy-units-digit {
  color: ${T.cyan};
  background: ${T.cyanSoft};
  transform: translateX(3px);
}
.strategy-visual-note {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: ${T.cyan};
  text-align: center;
  font-size: 11px;
}
.strategy-visual-note > span:not(.strategy-count) { font-size: 24px; }
.strategy-count { display: flex; gap: 4px; }
.strategy-count i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-style: normal;
}
.strategy-decomposition-step-1 .strategy-count i {
  animation: strategy-count-step 1.35s ease both;
}
.strategy-decomposition-step-1 .strategy-count i:nth-child(2) { animation-delay: .18s; }
.strategy-decomposition-step-1 .strategy-count i:nth-child(3) { animation-delay: .36s; }
@keyframes strategy-count-step {
  from { opacity: .2; transform: translateX(10px) scale(.75); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
.strategy-decomposition-step-2 .strategy-boundary {
  background: ${T.success};
  box-shadow: 0 0 14px rgba(34,122,83,.52);
}
.strategy-visual-note .answer-proof { min-height: 54px; }
.strategy-answer-stage { min-height: 74px; }
.strategy-answer-stage .answer-proof-layer {
  display: grid;
  grid-template-columns: minmax(190px, .8fr) minmax(260px, 1.2fr);
  align-items: stretch;
  gap: 10px;
}
.strategy-screen > .feedback { flex-shrink: 0; }
.case-model { display: grid; gap: 10px; }
.case-model p { color: ${T.ink2}; text-align: center; font-size: 13px; line-height: 1.4; }
.object-option { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.object-option strong { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; }
.fact-card {
  width: min(700px, 100%);
  margin: 0 auto;
  padding: 13px 16px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: ${T.navy};
  background: linear-gradient(145deg, #EDF8F7, #FFFFFF);
  box-shadow: 0 12px 26px -20px rgba(22,143,163,.5);
}
.fact-badge {
  flex: 0 0 auto;
  padding: 5px 8px;
  border-radius: 999px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
.fact-card p { font-size: 13px; line-height: 1.4; }
.quick-test-screen {
  width: min(820px, 100%);
  margin: 0 auto;
}
.rapid-console { width: min(900px, 100%); margin: 0 auto; }
.rapid-panel {
  width: min(850px, 100%);
  margin: 0 auto;
  padding: clamp(14px, 2.4vw, 20px);
  border-radius: 23px;
  display: grid;
  gap: 13px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 44px -30px rgba(${T.shadowBase},.58);
}
.rapid-panel .quick-number-card { min-height: 118px; box-shadow: none; background: #F4F8F6; }
.rapid-panel .quick-number-digits strong { height: clamp(48px, 7vw, 62px); }
.rapid-options-single-column {
  grid-template-columns: 1fr;
}
.rapid-options-single-column .option {
  min-height: 56px;
}
.rapid-options-single-column .option > span:last-child {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.35;
}
.rapid-complete {
  min-height: 64px;
  padding: 11px 15px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${T.success};
  background: ${T.successSoft};
}
.rapid-complete span { font-size: 25px; animation: quick-highlight 1.5s ease-in-out infinite; }
.quick-test-meter {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  color: ${T.ink2};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.quick-test-meter > div {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}
.quick-test-meter i {
  height: 5px;
  border-radius: 999px;
  background: #DDE4E1;
}
.quick-test-meter .quick-meter-active { background: ${T.accent}; }
.quick-test-meter strong {
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
}
.quick-number-card {
  width: min(610px, 100%);
  min-height: 152px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  gap: 12px;
  background:
    radial-gradient(circle at 85% 15%, rgba(255,91,53,.12), transparent 32%),
    linear-gradient(145deg, #FFFFFF, #F3F8F6);
  box-shadow: 0 18px 38px -28px rgba(${T.shadowBase},.58);
}
.quick-number-label {
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.quick-number-digits {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1vw, 8px);
}
.quick-number-digits strong {
  width: clamp(44px, 7vw, 62px);
  height: clamp(55px, 8vw, 72px);
  border: 1px solid rgba(80,97,109,.12);
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: ${T.ink};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(27px, 4vw, 38px);
  box-shadow: 0 10px 22px -18px rgba(${T.shadowBase},.45);
}
.quick-number-digits .quick-digit-highlight {
  border-color: ${T.accent};
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 24px -12px rgba(255,91,53,.72);
  animation: quick-highlight 1.5s ease-in-out infinite;
}
.quick-class-boundary {
  width: 0;
  height: 58px;
  margin: 0;
  border-radius: 99px;
  opacity: 0;
  background: ${T.success};
  transform: scaleY(.12);
  transition:
    width 1.15s cubic-bezier(.16,1,.3,1),
    margin 1.15s cubic-bezier(.16,1,.3,1),
    opacity .7s ease,
    transform 1.25s cubic-bezier(.16,1,.3,1),
    box-shadow 1s ease .45s;
}
.quick-number-proof {
  min-height: 16px;
  color: ${T.success};
  font-size: 10px;
  font-weight: 900;
  text-align: center;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity .75s ease .55s, transform .85s ease .48s;
}
.quick-number-card-solved .quick-class-boundary {
  width: 4px;
  margin: 0 6px;
  opacity: 1;
  transform: scaleY(1);
  box-shadow: 0 0 12px rgba(34,122,83,.5);
}
.quick-number-card-solved .quick-proof-left {
  color: ${T.navy};
  background: rgba(23,59,82,.08);
}
.quick-number-card-solved .quick-proof-right {
  color: ${T.cyan};
  background: ${T.cyanSoft};
}
.quick-number-card-solved .quick-digit-highlight {
  animation: none;
  transform: none;
}
.quick-number-card-solved .quick-number-proof {
  opacity: 1;
  transform: translateY(0);
}
@keyframes quick-highlight {
  50% { transform: translateY(-5px); }
}
.summary-stack { gap: 12px; }
.reward-stage {
  position: relative;
  width: min(840px, 100%);
  min-height: 154px;
  margin: 0 auto;
  padding: 16px 145px 15px 108px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  color: #FFFFFF;
  background:
    radial-gradient(circle at 82% 20%, rgba(255,194,60,.26), transparent 30%),
    linear-gradient(135deg, #173B52, #0E6978);
  box-shadow: 0 24px 50px -30px rgba(14,33,44,.8);
  transition: transform .5s ease, box-shadow .5s ease;
}
.reward-locked { filter: saturate(.72); }
.reward-unlocked {
  transform: translateY(-2px);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);
}
.reward-bit {
  position: absolute;
  right: 24px;
  bottom: 7px;
  width: 92px;
  height: 115px;
}
.reward-bit .g1-char { width: 100%; height: 100%; }
.reward-unlocked .reward-bit { animation: g4bitfloat 2.8s ease-in-out infinite; }
.reward-medal {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 66px;
  height: 66px;
  border: 4px solid rgba(255,255,255,.58);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  box-shadow: 0 0 0 8px rgba(255,255,255,.08), 0 15px 30px -15px rgba(0,0,0,.6);
  font-size: 30px;
}
.reward-kicker {
  color: #A8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .13em;
}
.reward-stage h1 {
  max-width: 590px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.05;
}
.reward-stage > p {
  max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  line-height: 1.4;
}
.reward-score {
  align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);
}
.reward-score strong { color: #FFE284; font-family: 'JetBrains Mono', monospace; }
.reward-score span { color: rgba(255,255,255,.72); font-size: 9px; }
.reward-confetti { position: absolute; inset: 0; pointer-events: none; }
.reward-confetti i {
  position: absolute;
  top: -16px;
  width: 7px;
  height: 12px;
  border-radius: 2px;
  animation: reward-confetti 2.4s linear infinite;
}
.reward-confetti i:nth-child(4n+1) { background: #FFC23C; }
.reward-confetti i:nth-child(4n+2) { background: #FF5B35; }
.reward-confetti i:nth-child(4n+3) { background: #77E1EA; }
.reward-confetti i:nth-child(4n) { background: #95C93D; }
.reward-confetti i:nth-child(1) { left: 8%; animation-delay: -.3s; }
.reward-confetti i:nth-child(2) { left: 17%; animation-delay: -1.1s; }
.reward-confetti i:nth-child(3) { left: 29%; animation-delay: -.7s; }
.reward-confetti i:nth-child(4) { left: 41%; animation-delay: -1.7s; }
.reward-confetti i:nth-child(5) { left: 52%; animation-delay: -.2s; }
.reward-confetti i:nth-child(6) { left: 63%; animation-delay: -1.3s; }
.reward-confetti i:nth-child(7) { left: 73%; animation-delay: -.8s; }
.reward-confetti i:nth-child(8) { left: 84%; animation-delay: -1.9s; }
.reward-confetti i:nth-child(9) { left: 12%; animation-delay: -2s; }
.reward-confetti i:nth-child(10) { left: 36%; animation-delay: -1.4s; }
.reward-confetti i:nth-child(11) { left: 68%; animation-delay: -.5s; }
.reward-confetti i:nth-child(12) { left: 91%; animation-delay: -1.6s; }
@keyframes reward-confetti {
  to { transform: translateY(230px) rotate(460deg); }
}
.unlock-guide {
  width: min(840px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 9px;
}
.unlock-guide > b { color: ${T.accent}; font-size: 22px; }
.unlock-guide-step {
  min-height: 58px;
  padding: 7px 10px;
  border: 1px solid rgba(22,143,163,.15);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 23px 29px 1fr;
  align-items: center;
  gap: 7px;
  color: ${T.ink2};
  background: rgba(255,255,255,.86);
}
.unlock-guide-step > span {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
}
.unlock-guide-step > i {
  font-size: 21px;
  font-style: normal;
  text-align: center;
  animation: guide-point 1.35s ease-in-out infinite;
}
@keyframes guide-point {
  50% { transform: translateY(4px); }
}
.unlock-guide-step p { font-size: 11px; line-height: 1.3; font-weight: 800; }
.unlock-guide-done .unlock-guide-step {
  border-color: rgba(34,122,83,.2);
  color: ${T.success};
  background: ${T.successSoft};
}
.unlock-guide-done .unlock-guide-step > span { background: ${T.success}; }
.unlock-guide-done .unlock-guide-step > i { animation: none; }
.summary-action-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}
.summary-rule-strip {
  min-width: 0;
  height: 100%;
  padding: 12px;
  border: 2px solid rgba(22,143,163,.28);
  border-radius: 17px;
  background:
    linear-gradient(135deg, rgba(230,247,250,.72), transparent 42%),
    rgba(255,255,255,.94);
  box-shadow:
    inset 5px 0 0 ${T.cyan},
    0 15px 32px -23px rgba(22,143,163,.7);
}
.summary-rule-heading {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.summary-rule-heading > span {
  min-width: 55px;
  padding: 5px 8px;
  border-radius: 9px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
  box-shadow: 0 7px 15px -10px rgba(22,143,163,.9);
}
.summary-rule-strip h2 { margin: 0; font-size: 14px; }
.summary-rule-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;
}
.summary-rule-items > span {
  min-width: 0;
  padding: 7px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 11px;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 6px;
  color: ${T.ink2};
  background: rgba(255,255,255,.82);
}
.summary-rule-strip i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-style: normal;
  font-weight: 900;
}
.summary-rule-strip p { font-size: 10px; line-height: 1.3; }
.summary-card {
  min-width: 0;
  height: 100%;
  padding: 13px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,.92);
  box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.5);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.reflection-resolution {
  display: grid;
  gap: 7px;
}
.summary-card h2 { margin-bottom: 8px; font-size: 14px; }
.summary-card ul { padding-left: 17px; display: grid; gap: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.35; }
.summary-question-kicker {
  margin-bottom: 4px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}
.summary-card .summary-question {
  margin-bottom: 4px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.18;
}
.summary-question-stem {
  margin-bottom: 7px !important;
  color: ${T.ink2};
  font-size: 10px;
  line-height: 1.3;
}
.reflection-options {
  max-height: 180px;
  display: grid;
  gap: 6px;
  overflow: hidden;
  opacity: 1;
  transition:
    max-height .75s cubic-bezier(.22,.8,.3,1) .48s,
    opacity .28s ease .52s,
    margin .75s cubic-bezier(.22,.8,.3,1) .48s;
}
.reflection-options-solved {
  max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;
}
.reflection-option {
  min-height: 34px;
  padding: 7px 9px;
  border: 0;
  border-radius: 10px;
  color: ${T.ink};
  background: #F4F7F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}
.reflection-option > span {
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
}
.reflection-correct { color: ${T.success}; background: ${T.successSoft}; }
.reflection-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.reflection-solved {
  min-height: 42px;
  padding: 9px 11px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  color: ${T.success};
  background: ${T.successSoft};
  font-size: 11px;
  font-weight: 800;
}
.reflection-card .feedback-card {
  min-height: 62px;
  padding: 5px 10px 5px 6px;
}
.reflection-card .g4-bit-reaction-figure {
  width: 44px;
  height: 54px;
  flex-basis: 44px;
}
.reflection-card .g4-bit-reaction-copy { font-size: 14px; }
.next-mission {
  padding: 10px 13px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
  background: ${T.navy};
}
.next-mission span { color: #98E1E5; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
.next-mission p { font-size: 12px; }
.preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button {
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: ${T.ink2};
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
@media (max-width: 639.98px) {
  .stage-header { padding-top: 60px; }
  .stage-content {
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-x: none;
    overscroll-behavior-y: contain;
    scroll-behavior: smooth;
    scroll-padding-block: 12px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .stage-content::-webkit-scrollbar { display: none; }
  .screen-type { display: none; }
  .stage-nav {
    min-height: calc(68px + env(safe-area-inset-bottom, 0px));
    padding-bottom: max(10px, env(safe-area-inset-bottom, 0px));
  }
  .h-title { font-size: 25px; }
  .options-grid, .options-three { grid-template-columns: 1fr; }
  .option { min-height: 50px; padding: 10px 12px; }
  .choice-proof-layer,
  .strategy-answer-stage .answer-proof-layer {
    grid-template-columns: 1fr;
    gap: 7px;
  }
  .bit-answer-comment { min-height: 68px; padding: 5px 9px 5px 4px; }
  .bit-answer-comment-figure { width: 47px; height: 59px; flex-basis: 47px; }
  .bit-answer-comment-copy > strong { font-size: 13px; }
  .bit-answer-comment-copy p { font-size: 9px; line-height: 1.3; }
  .data-scene { min-height: 164px; padding: 9px 91px 9px 10px; border-radius: 18px; }
  .data-console-head { min-height: 17px; margin-bottom: 4px; }
  .data-node-name { gap: 4px; font-size: 6px; letter-spacing: .07em; }
  .data-node-name > i { width: 6px; height: 6px; flex-basis: 6px; }
  .data-state { display: none; }
  .tower-screen { padding: 7px 8px 5px; border-radius: 11px; }
  .tower-label, .tower-label-row small { font-size: 6px; }
  .tower-screen .data-code { min-height: 43px; font-size: 27px; }
  .data-code-divider { height: 36px; }
  .data-scene-resolved .data-code-divider { height: 39px; margin: 0 5px; width: 3px; }
  .data-class-reveal { min-height: 10px; gap: 10px; }
  .data-class-reveal span { padding: 2px; font-size: 4.5px; }
  .data-code-scan { top: 17px; bottom: 12px; }
  .data-diagnostics { min-height: 20px; margin-top: 4px; gap: 3px; }
  .data-diagnostics > span { padding: 3px; gap: 3px; border-radius: 5px; font-size: 4.5px; }
  .data-diagnostics i { width: 4px; height: 4px; flex-basis: 4px; }
  .city-network { top: 8px; right: 2px; width: 87px; }
  .city-network > span { display: none; }
  .data-bit-callout { top: 61px; right: 4px; width: 83px; padding: 5px 3px; font-size: 6px; }
  .data-scene > .bit-avatar { right: 12px; bottom: -7px; width: 68px; height: 85px; }
  .explanation-screen { gap: 8px; }
  .explanation-screen .lead { font-size: 13px; line-height: 1.32; }
  .explanation-layout, .trainer-layout { grid-template-columns: 1fr; gap: 7px; }
  .explanation-visual, .trainer-visual, .explanation-copy, .trainer-task { padding: 7px; border-radius: 16px; }
  .class-animation, .class-animation-six-digit { min-height: 150px; gap: 6px; }
  .animated-number { gap: 4px; padding: 5px 0; }
  .animated-digit { width: 40px; height: 50px; border-radius: 11px; font-size: 23px; }
  .animated-divider.divider-visible { width: 4px; border-left-width: 2px; }
  .class-animation .place-cell { min-height: 44px; }
  .class-animation .place-cell span { font-size: 6px; }
  .class-animation .place-cell strong { font-size: 16px; }
  .explanation-copy .bit-coach { min-height: 76px; padding: 8px 10px; }
  .explanation-timeline { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
  .explanation-timeline.timeline-count-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .timeline-step { min-height: 43px; padding: 5px; gap: 4px; }
  .timeline-step > span { width: 20px; height: 20px; flex-basis: 20px; font-size: 8px; }
  .timeline-step strong { font-size: 8px; line-height: 1.12; }
  .explanation-finish-row { grid-template-columns: 1fr auto; gap: 5px; }
  .explanation-result { padding: 7px 8px; font-size: 10px; line-height: 1.25; }
  .explanation-replay { min-height: 36px; padding: 6px 8px; font-size: 10px; }
  .foundation-memory { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
  .foundation-memory > div { min-height: 40px; padding: 5px; }
  .foundation-memory span { font-size: 7px; line-height: 1.18; letter-spacing: 0; }
  .foundation-recap { min-height: 225px; padding: 12px; gap: 8px; }
  .recap-frame { min-height: 125px; }
  .recap-shift-sequence { gap: 0; }
  .recap-shift-svg { height: 88px; }
  .recap-shift-readout { min-height: 20px; gap: 5px; }
  .recap-shift-readout span { min-width: 33px; font-size: 14px; }
  .recap-shift-note { font-size: 8px; }
  .recap-place-row { gap: 6px; }
  .recap-place-row > div { width: 94px; min-height: 88px; padding: 8px 5px; }
  .recap-place-row strong { font-size: 29px; }
  .recap-sum strong, .recap-sum b, .recap-shift span { padding: 9px 8px; font-size: 20px; }
  .recap-task-preview { gap: 8px; }
  .recap-task-preview > span { width: 78px; height: 88px; }
  .reasoning-compare { gap: 5px; }
  .reasoning-visual strong { padding: 8px 9px; font-size: 21px; }
  .reasoning-proof-layer, .rapid-proof-layer { grid-template-columns: 1fr; gap: 5px; }
  .reasoning-proof-layer .btn, .rapid-proof-layer .btn { min-height: 36px; padding: 6px 9px; justify-self: center; }
  .answer-proof { min-height: 48px; padding: 7px 9px; }
  .answer-proof strong { font-size: 12px; }
  .answer-proof small { font-size: 8px; }
  .finger-guide { grid-template-columns: auto 1fr; }
  .finger-count { grid-column: 1 / -1; justify-content: center; }
  .divider-workbench { padding: 13px 8px; }
  .divider-digit { width: 40px; height: 56px; font-size: 26px; }
  .divider-gap { width: 12px; margin: 0 1px; }
  .divider-outcome { min-height: 69px; }
  .digit-shift-svg { height: 154px; }
  .digit-shift-sequence > p { font-size: 9px; }
  .boundary-repair { min-height: 139px; padding: 7px; grid-template-columns: 58px minmax(0, 1fr); }
  .boundary-repair-bit .g1-char { width: 54px; height: 68px; }
  .boundary-repair-bit span { font-size: 6px; }
  .boundary-repair > svg { max-height: 126px; }
  .city-code-mission { min-height: 145px; padding: 8px; }
  .city-code-model-stage { min-height: 95px; }
  .city-clue-layer { gap: 3px; }
  .city-clue { min-height: 67px; padding: 4px 2px; border-radius: 9px; }
  .city-clue small { font-size: 5px; }
  .city-clue strong { font-size: 18px; }
  .city-code-result { min-height: 24px; font-size: 8px; }
  .strategy-decomposition { min-height: 132px; padding: 9px 7px; }
  .strategy-digit-row { min-height: 58px; gap: 3px; }
  .strategy-digit-row > span { width: 38px; height: 49px; border-radius: 10px; font-size: 22px; }
  .strategy-boundary { height: 48px; }
  .strategy-decomposition-step-1 .strategy-boundary,
  .strategy-decomposition-step-2 .strategy-boundary { margin: 0 3px; width: 3px; }
  .strategy-visual-note { min-height: 48px; font-size: 9px; }
  .shift-comparison { gap: 5px; }
  .shift-number { min-height: 68px; padding: 7px 4px; font-size: 20px; }
  .shift-arrow span { max-width: 62px; font-size: 7px; }
  .place-transfer-board { min-height: 128px; padding-top: 45px; }
  .place-transfer-source { height: 38px; }
  .transfer-digit { width: 32px; height: 36px; font-size: 18px; }
  .transfer-digit-placed { transform: translateY(76px) scale(.88); }
  .bit-coach { min-height: 84px; }
  .bit-coach-figure { width: 58px; height: 73px; flex-basis: 58px; }
  .g4-bit-reaction-figure { width: 54px; height: 68px; flex-basis: 54px; }
  .quick-number-card { min-height: 126px; padding: 12px 7px; }
  .quick-number-digits { gap: 3px; }
  .quick-number-digits strong { width: 42px; height: 54px; border-radius: 11px; font-size: 25px; }
  .quick-class-boundary { height: 50px; }
  .quick-number-card-solved .quick-class-boundary { margin: 0 3px; width: 3px; }
  .quick-number-proof { font-size: 8px; }
  .summary-stack { gap: 7px; }
  .reward-stage { min-height: 128px; padding: 12px 66px 11px 57px; border-radius: 18px; gap: 3px; }
  .reward-medal { left: 9px; width: 40px; height: 40px; border-width: 3px; font-size: 18px; }
  .reward-bit { right: 0; bottom: 1px; width: 66px; height: 83px; }
  .reward-stage h1 { font-size: 18px; }
  .reward-stage > p { display: none; }
  .reward-score { margin-top: 2px; padding: 3px 6px; gap: 4px; }
  .reward-score strong { font-size: 11px; }
  .reward-score span { font-size: 7px; }
  .place-cell { min-height: 72px; }
  .place-cell span { font-size: 7px; }
  .slot-overlay { margin-top: -42px; }
  .drop-slot { height: 35px; font-size: 20px; }
  .example-strip, .sequence-strip { gap: 5px; }
  .example-strip span, .sequence-strip span { padding: 9px 8px; font-size: 16px; }
  .value-comparison { gap: 7px; }
  .value-comparison strong { font-size: 18px; }
  .number-group { min-width: 96px; padding: 10px 12px; font-size: 22px; }
  .unlock-guide { gap: 5px; }
  .unlock-guide > b { font-size: 15px; }
  .unlock-guide-step { min-height: 52px; padding: 5px; grid-template-columns: 19px 22px 1fr; gap: 4px; }
  .unlock-guide-step > span { width: 19px; height: 19px; font-size: 8px; }
  .unlock-guide-step > i { font-size: 17px; }
  .unlock-guide-step p { font-size: 8px; line-height: 1.18; }
  .summary-action-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    align-items: start;
    gap: 6px;
  }
  .summary-rule-strip,
  .summary-card { height: auto; }
  .summary-rule-strip { min-height: 0; padding: 8px; }
  .summary-rule-strip h2 { margin: 0; font-size: 12px; }
  .summary-rule-heading { margin-bottom: 5px; gap: 5px; }
  .summary-rule-heading > span { min-width: 47px; padding: 4px 6px; font-size: 9px; }
  .summary-rule-items { gap: 4px; }
  .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; gap: 4px; }
  .summary-rule-strip i { width: 18px; height: 18px; font-size: 7px; }
  .summary-rule-strip p { font-size: 8px; line-height: 1.18; }
  .summary-card { padding: 8px; }
  .summary-card h2 { margin-bottom: 5px; font-size: 12px; }
  .summary-question-kicker { font-size: 7px; }
  .summary-card .summary-question { margin-bottom: 3px; font-size: 12px; }
  .summary-question-stem { margin-bottom: 4px !important; font-size: 8px; }
  .reflection-options { grid-template-columns: 1fr; gap: 4px; }
  .reflection-option { min-height: 30px; padding: 4px 6px; font-size: 9px; }
  .reflection-option > span { width: 18px; height: 18px; flex-basis: 18px; font-size: 7px; }
  .feedback-card { font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
  .bit-avatar { transform: none !important; }
  .recap-shift-sequence { opacity: 1 !important; animation: none !important; }
  .recap-moving-seven { transform: translateX(-320px); animation: none !important; }
  .recap-born-zero { opacity: 1; transform: scale(1); animation: none !important; }
  .recap-readout-seven,
  .recap-readout-seventy { opacity: .2; transform: scale(1); animation: none !important; }
  .recap-readout-seven-hundred { opacity: 1; transform: scale(1.12); animation: none !important; }
  .digit-shift-solved .digit-shift-token { transform: translateX(-115px); animation: none !important; }
  .digit-shift-solved .digit-shift-new-zero,
  .digit-shift-solved .digit-shift-six-value {
    opacity: 1;
    transform: scale(1);
    animation: none !important;
  }
}
`;
