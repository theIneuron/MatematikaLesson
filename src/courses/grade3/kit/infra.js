// ============================================================================
// grade3/kit/infra.js — ДВИЖОК И ХУКИ УРОКА
//
// Источник: src/components/grade3/Dars01.jsx, версия ИЗ КОММИТА (HEAD), а не из
// рабочего дерева. Причина: в рабочем дереве лежит чужая незакоммиченная правка,
// которая (а) ставит FREE_NAV = true «временно, для проверки» и (б) вырезает
// автоскролл целиком — `const autoScrollTo = () => {}` плюс удалённый
// scrollIntoView в FeedbackBlock. И то, и другое противоречит ETALON_3SINF_v2
// (§6.3 автоскролл обязателен, §5 FREE_NAV всегда false).
//
// AudioEngine перенесён без изменений поведения: он БАЙТ-ИДЕНТИЧЕН во всех 19
// эталонных уроках 3 класса и уже содержит правильную обработку on_event
// (guard в playNext + forced в triggerInternalEvent и pushOneOff — все три части).
// Не «улучшать»: любая правка здесь ломает озвучку во всём классе.
//
// Отличия от источника — только там, где источник противоречил контракту:
//   1. useT больше НЕ подменяет язык молча → идёт через kit/i18n.js (3 локали).
//   2. gradeAnswer принимает lessonId параметром, а не читает глобаль LESSON_META
//      (в оригинале при отсутствии глобали молча уходила пустая строка).
//   3. Добавлен NavUnlockContext — разблокировка уже пройденных экранов (ETALON §10).
//      Идея взята из правки рабочего дерева, реализация чистая.
// ============================================================================

import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { PALETTE } from './schema.js';
import { makeT as makeLocalizer, stripAudioTags } from './i18n.js';

// ---------------------------------------------------------------------------
// ПАЛИТРА — единственный источник цвета, из schema.js (ETALON v2 §7)
// ---------------------------------------------------------------------------
export const T = PALETTE;

// ---------------------------------------------------------------------------
// КОНФИГ УРОКА (props от платформы). Движок, SFX и AI-проверка читают отсюда.
// ---------------------------------------------------------------------------
let ttsConfig = {
  ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '',
  aiGradingEndpoint: '', studentName: '', voiceGender: 'f',
};
export const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };
export const getTtsConfig = () => ttsConfig;

/** Признак preview: платформа не передала базу TTS, значит это локальный просмотр. */
export const isPreview = () => !ttsConfig.ttsApiBase;

// Блокировка перехода между слайдами. ETALON v2 §5: ВСЕГДА false.
// true допустим только в личной отладке и никогда не коммитится.
export const FREE_NAV = false;

// ---------------------------------------------------------------------------
// TTS: теги языка и сборка URL. Контракт v5.2 — только text и g.
// ---------------------------------------------------------------------------
export const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
export const END_TAG = '[end]';
export { stripAudioTags };

export function buildTtsUrl(base, text, gender) {
  const raw = String(text);
  const enc = encodeURIComponent(raw.slice(0, 1000)).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = gender === 'f' ? 'f' : 'm';
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

// ---------------------------------------------------------------------------
// SFX — короткие звуки верно/неверно; при отсутствии URL звучит синтезированный чайм.
// ---------------------------------------------------------------------------
let chimeCtx = null;
export function playChime(ok) {
  try {
    if (typeof window === 'undefined') return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    chimeCtx = chimeCtx || new AC();
    const ctx = chimeCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const notes = ok ? [660, 880] : [320, 240];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      const t0 = now + i * 0.12;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.2);
    });
  } catch { /* звук не критичен: урок проходится и без него */ }
}

export function useSfx() {
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const { correctSoundUrl, wrongSoundUrl } = ttsConfig;
    if (correctSoundUrl) { const a = new Audio(correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; correctRef.current = a; }
    if (wrongSoundUrl) { const a = new Audio(wrongSoundUrl); a.preload = 'auto'; a.volume = 0.6; wrongRef.current = a; }
    return () => {
      try { if (correctRef.current) correctRef.current.pause(); } catch { /* noop */ }
      try { if (wrongRef.current) wrongRef.current.pause(); } catch { /* noop */ }
      correctRef.current = null;
      wrongRef.current = null;
    };
  }, []);
  const play = useCallback((kind) => {
    const ref = kind === 'correct' ? correctRef : wrongRef;
    const a = ref.current;
    if (!a) { playChime(kind === 'correct'); return; }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch { /* noop */ }
  }, []);
  return {
    playCorrect: useCallback(() => play('correct'), [play]),
    playWrong: useCallback(() => play('wrong'), [play]),
  };
}

// ---------------------------------------------------------------------------
// AI-проверка открытых ответов — единственный разрешённый fetch (кроме <audio>.src).
// lessonId передаётся ЯВНО: в оригинале читалась глобаль LESSON_META, и при её
// отсутствии на сервер уходил пустой id.
// ---------------------------------------------------------------------------
export async function gradeAnswer({ lessonId, screenIdx, question, rubric, lang, mode, answerText, audioBlob }) {
  const endpoint = ttsConfig.aiGradingEndpoint;
  if (!endpoint) throw new Error('No grading endpoint configured');
  if (!lessonId) throw new Error('gradeAnswer: lessonId обязателен');
  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId);
    fd.append('screenIdx', String(screenIdx));
    fd.append('question', question || '');
    fd.append('rubric', rubric || '');
    fd.append('lang', lang);
    fd.append('mode', 'voice');
    if (audioBlob) fd.append('audio', audioBlob, 'answer.webm');
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, screenIdx, question: question || '', rubric: rubric || '', lang, mode: 'text', answerText: answerText || '' }),
    });
  }
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') throw new Error('Malformed grading response');
  return data;
}

// ---------------------------------------------------------------------------
// КОНТЕКСТЫ
// ---------------------------------------------------------------------------
export const LangContext = createContext('ru');
export const useLang = () => useContext(LangContext);

// Копилка звёзд: верные ответы накапливаются в шапке.
export const ProgressContext = createContext({ stars: 0, total: 0 });
export const useProgress = () => useContext(ProgressContext);

// Разблокировка уже пройденных экранов: назад ходить можно, и там ждать озвучку
// заново не нужно (ETALON v2 §10).
export const NavUnlockContext = createContext(false);

/**
 * useT — перевод без тихой подмены языка.
 *
 * Прежняя реализация во всех уроках 1–8 классов заканчивалась строкой
 *     return stripAudioTags(node.ru ?? '');
 * то есть при отсутствии перевода показывала русский и не сообщала об этом.
 * С тремя локалями это ловушка. Здесь: в preview — видимый маркер ⟨en?⟩,
 * в production — запасной текст плюс предупреждение в консоль.
 */
export const useT = () => {
  const lang = useLang();
  // useMemo, а не useCallback: makeLocalizer возвращает готовую функцию,
  // а useCallback требует инлайн-выражение.
  return useMemo(() => makeLocalizer(lang, {
    strict: isPreview(),
    onMissing: ({ lang: missing, used }) => {
      console.warn(`[i18n] нет локали "${missing}"${used ? `, показан "${used}"` : ''}`);
    },
  }), [lang]);
};

// ---------------------------------------------------------------------------
// АДАПТИВНОСТЬ (ETALON v2 §6.3)
// ---------------------------------------------------------------------------
export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// Единый мобильный масштаб: <640px весь урок укладывается в 390px и зумится под
// реальный экран — одинаковый вид на всех телефонах, QA только на 390px.
// Высота в JS не измеряется: .lesson-root position:fixed + inset:0.
export const MOBILE_DESIGN_W = 390;
export function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g1z', String(z));
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--g1z');
    };
  }, [breakpoint]);
}

// ---------------------------------------------------------------------------
// AUDIO ENGINE — перенесён без изменений поведения.
// Байт-идентичен во всех 19 эталонных уроках 3 класса. НЕ ПРАВИТЬ.
// ---------------------------------------------------------------------------
class AudioEngine {
  constructor() {
    this.queue = [];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.onStateChange = null;
    this.waitingFor = null;
    this.currentLang = 'ru';
    this.gender = 'f';
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
  setGender(g) { this.gender = g === 'f' ? 'f' : 'm'; }

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
  }

  playSegment(segment) {
    if (!segment) return;
    const base = ttsConfig.ttsApiBase;
    if (!segment.text) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
    // База не пришла от платформы → preview. speechSynthesis запрещён в боевой
    // ветке (platform_contract §4), здесь допустим только как стендин.
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
        this.autoplayBlocked = true;
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      });
    }
  }

  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.handleSegmentEnd(segment), 0);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const clean = stripAudioTags(String(segment.text));
    const u = new SpeechSynthesisUtterance(clean);
    const lang = segment.lang || this.currentLang;
    u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
    u.rate = 0.95;
    u.pitch = 1.0;
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
    setTimeout(() => { try { synth.speak(u); } catch { this.handleSegmentEnd(segment); } }, 60);
  }

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
      this.currentIdx += 1;
      this.playNext();
    }
  }

  // ЧАСТЬ 1 из 3 обработки on_event: сегмент ЖДЁТ своего события и не проигрывается
  // сам. Без этого ломается «вопрос до правила»: объяснение звучит до ответа ребёнка.
  playNext(forced = false) {
    if (this.currentIdx >= this.queue.length) return;
    const seg = this.queue[this.currentIdx];
    if (!forced && seg && typeof seg.trigger === 'string' && seg.trigger.indexOf('on_event:') === 0) {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
      return;
    }
    this.playSegment(seg);
  }

  start() {
    this.currentIdx = 0;
    this.waitingFor = null;
    this.playNext();
  }

  triggerEvent(eventType, target) {
    if (!this.waitingFor) return;
    const matches = this.waitingFor.type === eventType
      && (this.waitingFor.target === target || !this.waitingFor.target);
    if (matches) {
      this.waitingFor = null;
      this.currentIdx += 1;
      this.playNext();
    }
  }

  // ЧАСТЬ 2 из 3: событие пришло — играем ПРИНУДИТЕЛЬНО, иначе guard из playNext
  // не даст сегменту зазвучать и урок замолчит.
  triggerInternalEvent(eventName) {
    const nextIdx = this.queue.findIndex((s, i) => i >= this.currentIdx && s.trigger === `on_event:${eventName}`);
    if (nextIdx !== -1) {
      this.currentIdx = nextIdx;
      this.waitingFor = null;
      this.playNext(true);
    }
  }

  // ЧАСТЬ 3 из 3: разбор ответа вставляется вне очереди — тоже принудительно.
  pushOneOff(text, gender) {
    if (!text) return;
    this.queue.push({ id: `oneoff_${this.queue.length}_${text.length}`, text, trigger: 'manual', waits_for: null, g: gender });
    this.currentIdx = this.queue.length - 1;
    this.playNext(true);
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx -= 1;
    this.waitingFor = null;
    this.playNext(true);
  }

  stop() {
    if (this.audioEl) {
      try { this.audioEl.pause(); this.audioEl.onended = null; this.audioEl.onerror = null; } catch { /* noop */ }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    }
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null });
  }
}

let audioEngineInstance = null;
export const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

// ---------------------------------------------------------------------------
// useAudio — очередь сегментов экрана.
// Сегменты стабилизируются ПО СОДЕРЖИМОМУ, не по ссылке: иначе каждый рендер
// перезагружает очередь, движок сам себя отменяет и звук пропадает.
// ---------------------------------------------------------------------------
export function useAudio(segments) {
  const lang = useLang();
  // reachedIndex — сколько сегментов уже начинало звучать (монотонно растёт).
  // Живёт ЗДЕСЬ, а не в экране: экраны с поэтапным reveal (§3.1) раньше держали
  // собственный useState + useEffect и обновляли его синхронно в теле эффекта —
  // это нарушение react-hooks/set-state-in-effect и лишнее дублирование в каждом
  // экране. Знание «докуда дошла озвучка» принадлежит аудио-слою.
  const [state, setState] = useState({
    isPlaying: false, currentSegment: null, waitingFor: null, muted: false, reachedIndex: -1,
  });
  const engineRef = useRef(null);

  // Оригинал делал это через запись в ref прямо во время рендера — приём рабочий,
  // но запрещённый правилами React (react-hooks/refs) и дающий 2923 ошибки линта
  // по проекту. Здесь то же самое через useMemo от сериализованного ключа:
  // идентичность меняется только когда меняется СОДЕРЖИМОЕ сегментов.
  // Побочная польза: в движок гарантированно уходят простые данные.
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const stableSegments = useMemo(() => (segmentsKey ? JSON.parse(segmentsKey) : null), [segmentsKey]);
  const muted = state.muted;

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.setGender(ttsConfig.voiceGender || 'f');
    engine.onStateChange = (s) => setState((prev) => {
      // Индекс сегмента берём из id: сегменты нумеруются как `${prefix}_${i}`.
      let reachedIndex = prev.reachedIndex;
      if (s.currentSegment) {
        const m = /_(\d+)$/.exec(s.currentSegment);
        if (m) reachedIndex = Math.max(reachedIndex, Number(m[1]));
      }
      return { ...prev, ...s, reachedIndex };
    });
    const resume = () => { if (engineRef.current) engineRef.current.resumeIfBlocked(); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    if (stableSegments && stableSegments.length > 0 && !muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 300);
      return () => { clearTimeout(timer); cleanupListeners(); engine.stop(); };
    }
    return () => { cleanupListeners(); engine.stop(); };
  }, [stableSegments, lang, muted]);

  const triggerEvent = useCallback((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const triggerInternal = useCallback((eventName) => {
    if (engineRef.current) engineRef.current.triggerInternalEvent(eventName);
  }, []);
  const replay = useCallback(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const pushOneOff = useCallback((text, gender) => {
    if (engineRef.current) engineRef.current.pushOneOff(text, gender);
  }, []);
  const toggleMute = useCallback(() => {
    setState((prev) => {
      const next = !prev.muted;
      if (next && engineRef.current) engineRef.current.stop();
      return { ...prev, muted: next };
    });
  }, []);

  return { ...state, triggerEvent, triggerInternal, replay, pushOneOff, toggleMute };
}

// ---------------------------------------------------------------------------
// Сборка сегментов из данных экрана.
// makeAutoSegments — цепочка сама играет подряд (объяснение без шагов ребёнка).
// makeStepSegments — каждый следующий кусок ждёт действия ребёнка.
// ---------------------------------------------------------------------------
export const makeAutoSegments = (audioArray, idPrefix = 'aud') => {
  const arr = Array.isArray(audioArray) ? audioArray : (audioArray ? [audioArray] : []);
  return arr.map((text, i) => ({
    id: `${idPrefix}_${i}`,
    text,
    trigger: i === 0 ? 'on_mount' : 'after_previous',
    waits_for: null,
  }));
};

export const makeStepSegments = (audioArray, idPrefix = 'aud') => {
  const arr = Array.isArray(audioArray) ? audioArray : (audioArray ? [audioArray] : []);
  return arr.map((text, i) => ({
    id: `${idPrefix}_${i}`,
    text,
    trigger: i === 0 ? 'on_mount' : (i === 1 ? 'after_previous' : `on_event:step_${i - 1}`),
    waits_for: i < arr.length - 1
      ? { type: 'button_click', target: 'step' }
      : { type: 'button_click', target: 'next' },
  }));
};

// ---------------------------------------------------------------------------
// ВОРОТА: сначала слушаем, потом отвечаем; «Davom» — после разбора.
// ETALON v2 §5. Оба хука уважают NavUnlockContext: на уже пройденном экране
// ждать озвучку заново не нужно.
// ---------------------------------------------------------------------------
export function useCanAnswer(audio) {
  const navUnlocked = useContext(NavUnlockContext);
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    if (audio.isPlaying && !hasPlayed) {
      const id = setTimeout(() => setHasPlayed(true), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [audio.isPlaying, hasPlayed]);
  // Защита 12 с: при сбое TTS урок не должен заблокироваться.
  useEffect(() => {
    const id = setTimeout(() => setHasPlayed(true), 12000);
    return () => clearTimeout(id);
  }, []);
  return FREE_NAV || navUnlocked || audio.muted || (hasPlayed && !audio.isPlaying);
}

export function useAdvanceGate(solved, audio) {
  const navUnlocked = useContext(NavUnlockContext);
  const [fbStarted, setFbStarted] = useState(false);
  useEffect(() => {
    if (solved && audio.isPlaying && !fbStarted) {
      const id = setTimeout(() => setFbStarted(true), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [solved, audio.isPlaying, fbStarted]);
  // Защита 6 с на случай, если разбор не зазвучал.
  useEffect(() => {
    if (!solved) return undefined;
    const id = setTimeout(() => setFbStarted(true), 6000);
    return () => clearTimeout(id);
  }, [solved]);
  if (navUnlocked) return true;
  if (!solved) return false;
  if (audio.muted) return true;
  return fbStarted && !audio.isPlaying;
}

// ---------------------------------------------------------------------------
// АВТОСКРОЛЛ (ETALON v2 §6.3) — обязателен: появился блок ниже сгиба, значит
// доводим до него. В рабочем дереве этот код был вырезан до `() => {}`.
// ---------------------------------------------------------------------------
export const autoScrollTo = (el, block = 'nearest') => {
  if (!el || typeof el.scrollIntoView !== 'function') return;
  const reduce = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
};

// Двойной requestAnimationFrame + задержка: сначала блок встал на место после
// fade-up, только потом скролл. Иначе прокрутка дёргается.
export function useRevealScroll(active, delay = 400, block = 'nearest') {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return undefined;
    let tid;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      tid = setTimeout(() => autoScrollTo(ref.current, block), delay);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(tid); };
  }, [active, delay, block]);
  return ref;
}
