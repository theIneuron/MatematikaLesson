import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ============================================================================
// ░░ 2-SINF · Dars18 — "Закрепление · перестановка множителей" (mul-2-18-v1) · Б3 (YUPITER) · ETALON §11 ░░
// 2-SINF · syujet-qobiq v3: YUPITER orbitasi, KEMA ISSIQXONASI/OMBORI. Program d.20 (SYUJET_2SINF.md Б3 yakuni).
// Baza: Dars17.jsx (×8/×9 jadvali — issiqxona sahnasi + geo/plant ArrayViz + TableFill + jadval-yordamchi max=9).
// Infra: grade1 Dars28.jsx dan BAYT-ANIQ (mobil zoom-qatlam + avtoskroll + keep-visible
// QuestionScreen + AnsPop + useCanAnswer/useAdvanceGate + v5.2 AudioEngine, ayol ovoz g=f).
// YADRO: MUSTAHKAMLASH + O'RIN ALMASHISH (kommutativlik) — a×b = b×a. Massivni BURSAK (qator↔ustun) jami
//   O'ZGARMAYDI. Butun jadvalni (×2..×9) qo'llash. Yangi mexanika: CommuteViz (massiv burilishi) + «teng?» Ha/Yo'q.
// DUNYO: Yupiter orbitasi, kema issiqxonasi/ombori — yig'ilgan hosil qutilarga terilganda o'rin almashadi.
//   Cast: Bit (kapitan-diktor, ayol ovoz). Jadval-yordamchi (MultTable) max=9 — to'liq Pifagor jadvali.
// MEXANIKA: «MASSIV+SKIP-SANASH» + «JADVALNI TO'LDIRISH» (meros) + «O'RIN ALMASHISH» (CommuteViz burilish, Ha/Yo'q teng?).
// Misconception'lar: M1 3×5 ≠ 5×3 deb o'ylash · M2 skip-sanashда o'tkazib yuborish · M3 jadval bo'sh joyini noto'g'ri.
//
// FREE_NAV=true (blokirovka o'chiq — push oldidan false ga qaytariladi).
//
// ETALON KIT bloklari (grade1 Dars28 merosi):
//   1) INFRA — T, ttsConfig/configureLesson, buildTtsUrl, useSfx/playChime, LangContext/useT,
//      useIsMobile/useMobileZoom, AudioEngine/useAudio, useCanAnswer/useAdvanceGate,
//      Op/Frac/mt, AudioIndicator, autoScrollTo/useRevealScroll, FeedbackBlock, Slider,
//      Stage/NavBack/NavNext, QuestionScreen (keep-visible)
//   2) ANIMATSION KIT — usePrefersReducedMotion, useCountOnce, GradientDefs, ICON/Obj/Pips
//   3) BIT-KARTOCHKA + rag'bat — Reaction, PRAISE/ENCOURAGE, nextPraise/nextEncourage
//   4) PERSONAJ — BitSVG (yakka cast), HeroContext/useHero, StageHero, Confetti
//   5) AnsPop + SparkBurst; CSS (STYLES) — bazaviy + mobil zoom-qatlam + reduced-motion
// ============================================================================

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
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'f' };
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, ...cfg }; };

// Slaydlararo o'tish blokirovkasi (production): "Davom" javob/ovoz tugagach ochiladi,
// javob faqat ovoz tugagach tanlanadi. (Test paytida vaqtincha true qilingan edi.)
const FREE_NAV = true;   // TEST/EDIT — blokirovka o'chiq (erkin navigatsiya). PUSH oldidan false ga qaytaring!

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

// Yulduz-kopilka: to'g'ri javoblar soni (test ekranlari) — yuqorida to'planib boradi.
const ProgressContext = createContext({ stars: 0, total: 0 });

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
// useMobileZoom — mobil yagona masshtab qatlami (etalon kenglik 390px).
// <640px: butun urok 390px kenglikda joylashadi va real ekranga zoom bilan
// fotografik masshtablanadi — barcha telefonlarda BIR XIL ko'rinish, QA faqat
// 390px da. Desktop (>=640px): --g1z=1, hech narsa o'zgarmaydi.
// Balandlik JS'da o'lchanmaydi: .lesson-root position:fixed + inset:0 —
// brauzer viewport o'zgarishini (URL-panel) o'zi kuzatadi.
// ============================================================
const MOBILE_DESIGN_W = 390;
function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
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
    engine.setGender(ttsConfig.voiceGender || 'f');
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

// Avto-zanjir segmentlar: barcha bo'laklar ketma-ket O'ZI yangraydi (step-tugmasiz).
// Interaktiv bo'lmagan tushuntirish slaydlari uchun (s1, s5, s6).
const makeAutoSegments = (screenContent, lang) => {
  const a = screenContent.audio?.[lang];
  const arr = Array.isArray(a) ? a : (a ? [a] : []);
  return arr.map((text, i) => ({ id: `aud_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null }));
};

// useCanAnswer — javob tanlash faqat ovoz tugagandan keyin (bola avval tinglaydi).
// Ovoz yangrayotganda yoki hali boshlanmaganda -> false. Mute -> true. 12s himoya (bloklanmasin).
function useCanAnswer(audio) {
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    if (audio.isPlaying && !hasPlayed) { const id = setTimeout(() => setHasPlayed(true), 0); return () => clearTimeout(id); }
    return undefined;
  }, [audio.isPlaying, hasPlayed]);
  useEffect(() => { const id = setTimeout(() => setHasPlayed(true), 12000); return () => clearTimeout(id); }, []);
  return FREE_NAV || audio.muted || (hasPlayed && !audio.isPlaying);
}

// useAdvanceGate — "Davom" faqat javobdan keyingi izoh ovozi TUGAGACH ochiladi
// (o'quvchi tushuntirishni oxirigacha eshitsin). Mute -> darrov. 6s himoya.
function useAdvanceGate(solved, audio) {
  const [fbStarted, setFbStarted] = useState(false);
  useEffect(() => {
    if (solved && audio.isPlaying && !fbStarted) { const id = setTimeout(() => setFbStarted(true), 0); return () => clearTimeout(id); }
    return undefined;
  }, [solved, audio.isPlaying, fbStarted]);
  useEffect(() => {
    if (!solved) return undefined;
    const id = setTimeout(() => setFbStarted(true), 6000);
    return () => clearTimeout(id);
  }, [solved]);
  if (!solved) return false;
  if (audio.muted) return true;
  return fbStarted && !audio.isPlaying;
}

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

// autoScrollTo — yangi paydo bo'lgan kontentni ko'rinish zonasiga olib keladi.
// 'nearest' — element ko'rinib turgan bo'lsa sakramaydi; reduced-motion'da silliqsiz.
const autoScrollTo = (el, block = 'nearest') => {
  if (!el || typeof el.scrollIntoView !== 'function') return;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
};

// useRevealScroll — active=true bo'lganda (kontent paydo bo'lganda) unga avtoskroll.
// FeedbackBlock naqshi: double-rAF + kechikish (fade-up animatsiyasi joylashgach).
function useRevealScroll(active, delay = 350, block = 'nearest') {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    let tid;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      tid = setTimeout(() => autoScrollTo(ref.current, block), delay);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(tid); };
  }, [active, delay, block]);
  return ref;
}

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

const NavNext = ({ disabled, label, onClick }) => {
  const isDisabled = FREE_NAV ? false : disabled;
  // Faol (bosilishi kerak) bo'lganda — to'q rang + puls (bola e'tiborini tortadi).
  return (
    <button className={isDisabled ? 'btn-white-accent' : 'btn-white-accent btn-ready'} disabled={isDisabled} onClick={onClick}
      style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>
      {label}
    </button>
  );
};

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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, figure, celebrateOnCorrect, mascot = true, optionsCols = 2 }) => {
  const lang = useLang();
  const c = screenContent;
  const sfx = useSfx();

  const audio = useAudio([{
    id: `s${idx}_intro`,
    text: c.audio.intro[lang],
    trigger: 'on_mount',
    waits_for: { type: 'option_picked' }
  }]);
  const canAns = useCanAnswer(audio);   // javob faqat ovoz tugagach

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
  const [praiseWord, setPraiseWord] = useState('');   // navbatdagi maqtov so'zi (reaktsiya uchun)
  const [encWord, setEncWord] = useState('');         // navbatdagi UNIKAL rag'bat (xato javob)
  const praiseRef = useRef('');

  const pick = (i) => {
    if (!canAns) return;       // ovoz tugamaguncha javob yo'q
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
      const pw = nextPraise(lang); praiseRef.current = pw; setPraiseWord(pw);
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
      setEncWord(nextEncourage(lang));   // har xatoda boshqa pozitiv so'z
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }

    if (!audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          if (isCorrect) { engine.pushOneOff(praiseRef.current); engine.pushOneOff(c.audio.on_correct[lang]); }   // maqtov so'zi + izoh
          else engine.pushOneOff(wrongVoice);
          if (isCorrect && c.fact_audio && c.fact_audio[lang]) engine.pushOneOff(c.fact_audio[lang]);  // FactCard ovozlanadi (TTS-toza)
        }
      }, 300);
    }
  };

  const canAdv = useAdvanceGate(solved, audio);   // izoh ovozi tugagach Davom
  const factRef = useRevealScroll(solved && !!factOnCorrect, 900);   // feedback skrollidan keyin fakt ham ko'rinadi
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        <div className="fade-up">{question}</div>
        {figure && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figure(solved)}</div>}
        {!solved && (
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${optionsCols}, minmax(0, 1fr))`, gap: 10 }}>
          {options.map((opt, i) => {
            const isWrongPicked = wrong.has(i);
            const cls = `option${isWrongPicked ? ' option-picked-wrong' : ''}`;
            const disabled = isWrongPicked || !canAns;   // ovoz tugamaguncha + погашенный неверный
            return (
              <button key={i} className={cls} disabled={disabled} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: isWrongPicked ? '#D8A93A' : T.ink3 }}>
                  {isWrongPicked ? '↺' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>{opt}</span>
              </button>
            );
          })}
        </div>
        )}
        {/* to'g'ri javobdan keyin: faqat to'g'ri variant qoladi (noto'g'rilari yo'qoladi). celebrateOnCorrect bo'lsa -> animatsiya */}
        {solved && !celebrateOnCorrect && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="g1-cele-wrap">
              <button className="option option-correct" disabled
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6vw, 54px)', minWidth: 'clamp(120px, 40vw, 220px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: T.success }}>✓</span>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>{options[correctIdx]}</span>
              </button>
              <SparkBurst/>
            </span>
          </div>
        )}
        {solved && celebrateOnCorrect && <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>{typeof celebrateOnCorrect === 'function' ? celebrateOnCorrect() : celebrateOnCorrect}</div>}
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <Reaction state={solved ? 'correct' : 'wrong'} praise={solved ? praiseWord : encWord} mascot={mascot}/>
        </FeedbackBlock>
        {solved && factOnCorrect && <div ref={factRef}>{factOnCorrect}</div>}
      </div>
    </Stage>
  );
};

// ============================================================
// --- 2-SINF DARS: num_2_01 — O'nliklar va birliklar (Б1, 100 gacha) ---
// 7-8 yosh: ovoz yetakchi kanal, typing YO'Q (tap), concrete-avval (batareya/kasseta ->
// pult-bloklar -> displey kartasi), bar model YO'Q. Manba: 2sinf_metodologiya.md +
// ETALON_2SINF.md + Dars01_CONTENT.md v2 (Yulduz porti). Barcha sonlar 100 ichida (Б1).
// ============================================================

// v5 IXCHAMLASH (18 -> 15): test tomoni ixchamlashdi (tushuntirish s2-s6 + qoida s7 TEGILMADI).
//   sPANEL «Bort testi» = eski s11 + sCMP + sERR (3 ketma-ket sub).
//   sCASE «Yuk xati» = eski s12 (kirish) + s13 (savol) BITTA ekranда.
// v6 FAKT ALOHIDA (bekor): sPANEL sub-1 dagi FactCard SKROLL chiqargani uchun undan olindi.
// v7 FAKT FINAL SLAYDGA (16 -> 15): alohida fakt-slaydi BEKOR; fakt endi FINAL test s14 ga
//   factOnCorrect bilan (bitta savolli slaydда joy bor, skrollsiz — etalon naqsh). sPANEL faktsiz qoladi.
const TOTAL_SCREENS = 16;
const LESSON_META = {
  lessonId: 'geo-2-26-v1',
  lessonTitle: { ru: 'Урок 26. Луч, прямая, отрезок', uz: "26-dars. Nur, to'g'ri chiziq, kesma" }
};
// STRUKTURA (Б5 URAN YO'LDOSHI, geometriya boshi; Uran gaz/muz gigant — QO'NIB bo'lmaydi, yo'ldoshda stansiya, osmonda Uran): s0 hook (uch soni bilan tur) · s1 to'g'ri chiziq (∞ ikki tomon) · s2 nur (1 boshi) · s3 QOIDA (uch soni: 0/1/2 → chiziq/nur/kesma) + check · s4 kesma (2 uchi) + check · sTBL uch tur kaliti · s5–s11 mashq (tur-tanish + saralash aralash) · s13 masala · s14 final · s15 xulosa (→ ko'pburchaklar).
// MEXANIKA (YANGI, Van Hiele 0→1): LineTypeStage (chiziq/nur/kesma figurasini UCH SONI bo'yicha tanish, MC + hayotiy langar: ufq/fonar/qalam) + LineSortStage (obyektlarni turiga drag-saralash). Distraktor = boshqa tur.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },      // 0  hook: 12÷2=? (distraktor 10=12−2)
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 1  son o'qida orqaga 2-talik sakrash: 12→0 = 6 sakrash
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 2  ÷2 jadval-qatori: 2,4,6…→1,2,3…
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },        // 3  QOIDA: ÷2 = 2 ta guruh / ×2 teskari + check
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 4  ÷3 jadval-qatori (3,6,9…→1,2,3…) + check
  { id: 'sTBL', type: 'exploration', template: 'custom',  scored: false, scope: null },        // 5  ÷2 va ÷3 to'liq jadvali
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 6  mashq JADVAL-TO'LDIRISH ÷2 single
  { id: 's6',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 7  mashq SON O'QI orqaga sakrash single
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 8  mashq OILA-TOP: 3 round
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 9  mashq JADVAL-TO'LDIRISH: 3 round
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 10 mashq SON O'QI: 3 round
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 11 mashq OILA-TOP: 3 round
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 12 mashq JADVAL-TO'LDIRISH: 3 round
  { id: 'sCASE', type: 'case',      template: 'custom',   scored: true,  scope: 'practice' },  // 13 MASALA: son o'qi orqaga sakrash
  { id: 's14',  type: 'test',       template: 'custom',   scored: true,  scope: 'final' },     // 14 FINAL: 3 round oila-top + FactCard
  { id: 's15',  type: 'summary',    template: 'custom',   scored: false, scope: 'final' }      // 15 yakun + QOIDA recap (→ ÷4/÷5)
];

// shuffleMC — variantlarni QAT'IY order bo'yicha joylashtiradi va wrong_N/hint_N
// kalitlarni YANGI indekslarga ko'chiradi (wrong_N kontentda ASL indeks bilan yoziladi,
// to'g'ri javob indeksi tashlab ketiladi). order[newIdx] = oldIdx. (grade5 etalon helper.)
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};

// Fisher-Yates (brauzerda Math.random — faqat hodisalarda/effektda, render'da emas).
const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };

// ============================================================
// CONTENT — Dars01_CONTENT.md v3 «KEMA ICHIDA» (metodist tasdiqlagan). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Xato-hint faqat METODNI ko'rsatadi, yakuniy sonni AYTMAYDI.
// wrong_N — ASL variant-indeks bilan (shuffleMC yangi o'ringa ko'chiradi).
// v3 matn o'zgarishlari: s0 (kema ichi/vaznsizlik), s1 (porlovchi birlik-element),
//   s6 (lyuk), s12 (bo'limga joylash). Qolgan matnlar v2 bilan bir xil.
// ============================================================

const CONTENT = {
  // s0 — HOOK (scope: hook): 12 kristal 2 talik vagonlarga → nechta vagon? 12÷2=6. Distraktor 10 (=12−2)
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Луч, прямая, отрезок', uz: "Mavzu: Nur, to'g'ri chiziq, kesma" },
    lead: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    q: { ru: 'Луч фонарика идёт в одну сторону и имеет один конец — начало. Как называется такая линия?', uz: "Fonar nuri bir tomonga ketadi va bitta uchi — boshi bor. Bunday chiziq qanday ataladi?" },
    opt0: { ru: 'Прямая', uz: "To'g'ri chiziq" },   // distraktor
    opt1: { ru: 'Луч', uz: 'Nur' },                 // to'g'ri
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Мы прилетели к спутнику Урана. На твёрдой поверхности экипаж строит станцию, а в небе виден сам Уран.',
          'У фонарика луч идёт в одну сторону и имеет один конец — начало.',
          'Бит спрашивает: как называется такая линия — с одним концом? Выбери название.',
          'Послушай два ответа. Первый — прямая. Второй — луч. Или ты пока не знаешь. Выбери свой ответ.'
        ],
        uz: [
          "Uran yo'ldoshiga uchib keldik. Qattiq sirtda ekipaj stansiya quryapti, osmonda esa Uranning o'zi ko'rinadi.",
          "Fonar nuri bir tomonga ketadi va bitta uchi — boshi bor.",
          "Bit so'raydi: bitta uchi bor bunday chiziq qanday ataladi? Nomini tanla.",
          "Ikki javobni tinglang. Birinchi — to'g'ri chiziq. Ikkinchi — nur. Yoki hali bilmaysiz. O'z javobingizni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Луч имеет одно начало и идёт в одну сторону без конца. Сейчас разберём все линии.', uz: "To'g'ri. Nurning bitta boshi bor va bir tomonga uchsiz ketadi. Hozir barcha chiziqlarni ko'ramiz." },
      on_wrong: { ru: 'У прямой нет концов, а у луча один конец — начало. Это луч. Сейчас разберём.', uz: "To'g'ri chiziqning uchi yo'q, nurning bitta uchi — boshi bor. Bu nur. Hozir ko'ramiz." },
      on_unknown: { ru: 'Ничего. Разберём прямую, луч и отрезок.', uz: "Hechqisi yo'q. To'g'ri chiziq, nur va kesmani ko'ramiz." }
    }
  },

  // s1 — TUSHUNTIRISH-1: TO'G'RI CHIZIQ — ikki tomonga cheksiz, uchi yo'q (ufq chizig'i)
  s1: {
    eyebrow: { ru: 'Прямая', uz: "To'g'ri chiziq" },
    lead: { ru: 'Прямая — без концов.', uz: "To'g'ri chiziq — uchsiz." },
    body: { ru: 'Прямая линия идёт в обе стороны без конца — у неё нет концов. Стрелки на рисунке показывают: она тянется дальше и дальше. Как линия горизонта: она уходит в обе стороны, и концов её не видно.', uz: "To'g'ri chiziq ikki tomonga uchsiz ketadi — uning uchi yo'q. Rasmdagi strelkalar ko'rsatadi: u yana-da uzoqqa cho'ziladi. Ufq chizig'i kabi: u ikki tomonga ketadi, uchlari ko'rinmaydi." },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'У прямой нет концов — она бесконечна в обе стороны.', uz: "To'g'ri chiziqning uchi yo'q — ikki tomonga cheksiz." },
    audio: {
      ru: [
        'Прямая линия идёт в обе стороны без конца.',
        'У неё нет концов. Стрелки показывают, что она тянется дальше и дальше.',
        'Как линия горизонта: она уходит в обе стороны, и концов её не видно. Это прямая.'
      ],
      uz: [
        "To'g'ri chiziq ikki tomonga uchsiz ketadi.",
        "Uning uchi yo'q. Strelkalar u yana-da uzoqqa cho'zilishini ko'rsatadi.",
        "Ufq chizig'i kabi: u ikki tomonga ketadi, uchlari ko'rinmaydi. Bu to'g'ri chiziq."
      ]
    }
  },

  // s2 — TUSHUNTIRISH-2: NUR — bitta boshi, bir tomonga cheksiz (fonar/quyosh nuri)
  s2: {
    eyebrow: { ru: 'Луч', uz: 'Nur' },
    lead: { ru: 'Луч — один конец.', uz: "Nur — bitta uch." },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'У луча одно начало и одна стрелка: он идёт в одну сторону без конца.', uz: "Nurning bitta boshi va bitta strelkasi bor: u bir tomonga uchsiz ketadi." },
    audio: {
      ru: [
        'Луч имеет одно начало — один конец. Это зелёная точка.',
        'В другую сторону он идёт без конца, туда показывает стрелка.',
        'Как луч фонарика или солнца: начинается в одной точке и летит вперёд.'
      ],
      uz: [
        "Nurning bitta boshi — bitta uchi bor. Bu yashil nuqta.",
        "Boshqa tomonga u uchsiz ketadi, u yoqqa strelka ko'rsatadi.",
        "Fonar yoki quyosh nuri kabi: bitta nuqtadan boshlanib, oldinga uchadi."
      ]
    }
  },

  // s3 — QOIDA: bo'lish = teng ulashish, ÷ belgi kiritiladi + check MC (8÷2=4)
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Считай концы (зелёные точки): 0 концов — прямая, 1 конец — луч, 2 конца — отрезок.', uz: "Uchlarni sanang (yashil nuqtalar): 0 uch — to'g'ri chiziq, 1 uch — nur, 2 uch — kesma." },
    check_q: { ru: 'У этой линии нет концов, стрелки в обе стороны. Что это?', uz: "Bu chiziqning uchi yo'q, strelka ikki tomonga. Bu nima?" },
    opts: [{ ru: 'Прямая', uz: "To'g'ri chiziq", ok: true }, { ru: 'Луч', uz: 'Nur' }, { ru: 'Отрезок', uz: 'Kesma' }],
    wrong: { ru: 'Нет концов и стрелки в обе стороны — это прямая.', uz: "Uchi yo'q, strelka ikki tomonga — bu to'g'ri chiziq." },
    check_ok: { ru: 'Верно! Нет концов — это прямая.', uz: "To'g'ri! Uchi yo'q — bu to'g'ri chiziq." },
    audio: {
      ru: [
        'Запишем главное. Слушай и запомни.',
        'Считай концы линии — зелёные точки.',
        'Ноль концов — прямая, один конец — луч, два конца — отрезок.',
        'Проверь. У этой линии нет концов, а стрелки в обе стороны. Что это?'
      ],
      uz: [
        "Asosiyni yozamiz. Tinglang va yodlang.",
        "Chiziqning uchlarini sana — yashil nuqtalar.",
        "Nol uch — to'g'ri chiziq, bir uch — nur, ikki uch — kesma.",
        "Tekshir. Bu chiziqning uchi yo'q, strelka ikki tomonga. Bu nima?"
      ]
    }
  },

  // s4 — TUSHUNTIRISH-3: KESMA — ikki uchi bor, ikki nuqta orasi (qalam) + check
  s4: {
    eyebrow: { ru: 'Отрезок', uz: 'Kesma' },
    lead: { ru: 'Отрезок — два конца.', uz: "Kesma — ikki uch." },
    body: { ru: 'Отрезок — это часть линии между двумя точками. У него два конца и нет стрелок. Как карандаш: он где-то начинается и где-то заканчивается.', uz: "Kesma — chiziqning ikki nuqta orasidagi qismi. Uning ikki uchi bor va strelkasi yo'q. Qalam kabi: u bir joyda boshlanadi va bir joyda tugaydi." },
    warn: { ru: 'Отрезок можно измерить линейкой — у него есть длина. Прямую и луч — нельзя.', uz: "Kesmani chizg'ich bilan o'lchash mumkin — uning uzunligi bor. To'g'ri chiziq va nurni — bo'lmaydi." },
    check_q: { ru: 'У этой линии два конца и нет стрелок. Что это?', uz: "Bu chiziqning ikki uchi bor, strelkasi yo'q. Bu nima?" },
    opts: [{ ru: 'Отрезок', uz: 'Kesma', ok: true }, { ru: 'Луч', uz: 'Nur' }, { ru: 'Прямая', uz: "To'g'ri chiziq" }],
    wrong: { ru: 'Два конца, нет стрелок — это отрезок.', uz: "Ikki uch, strelka yo'q — bu kesma." },
    check_ok: { ru: 'Верно! Два конца — это отрезок.', uz: "To'g'ri! Ikki uch — bu kesma." },
    audio: {
      ru: [
        'Отрезок — это часть линии между двумя точками.',
        'У него два конца и нет стрелок. Как карандаш: он начинается и заканчивается.',
        'Отрезок можно измерить линейкой — у него есть длина.',
        'Проверь. У этой линии два конца и нет стрелок. Что это?'
      ],
      uz: [
        "Kesma — chiziqning ikki nuqta orasidagi qismi.",
        "Uning ikki uchi bor va strelkasi yo'q. Qalam kabi: u boshlanadi va tugaydi.",
        "Kesmani chizg'ich bilan o'lchash mumkin — uning uzunligi bor.",
        "Tekshir. Bu chiziqning ikki uchi bor, strelkasi yo'q. Bu nima?"
      ]
    }
  },

  // sTBL — TUSHUNTIRISH: UCH TUR KALITI (nur/to'g'ri chiziq/kesma — uch soni bilan)
  sTBL: {
    eyebrow: { ru: 'Ключ', uz: 'Kalit' },
    lead: { ru: 'Три линии — по концам', uz: "Uch chiziq — uchlari bilan" },
    info_badge: { ru: 'Главное', uz: 'Asosiy' },
    info: { ru: 'Прямая — 0 концов, луч — 1 конец, отрезок — 2 конца. Считай зелёные точки!', uz: "To'g'ri chiziq — 0 uch, nur — 1 uch, kesma — 2 uch. Yashil nuqtalarni sanang!" },
    audio: {
      ru: [
        'Запомни ключ: смотри на концы линии — зелёные точки.',
        'У прямой концов нет, у луча один конец, у отрезка два конца.',
        'Считаешь концы — сразу узнаёшь линию.'
      ],
      uz: [
        "Kalitni yodla: chiziqning uchlariga qara — yashil nuqtalar.",
        "To'g'ri chiziqning uchi yo'q, nurning bitta uchi, kesmaning ikki uchi.",
        "Uchlarni sanasang — chiziqni darrov bilasan."
      ]
    }
  },

  // s5 — MASHQ single tur-tanish (nur)
  s5: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    lead: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    transition: { ru: 'Объяснение закончили. Теперь узнавай линии по концам.', uz: "Tushuntirishni tugatdik. Endi chiziqlarni uchlari bo'yicha taning." },
    type: 'ray',
    wrong: { ru: 'Один конец и одна стрелка — это луч.', uz: "Bitta uch va bitta strelka — bu nur." },
    done_text: { ru: 'Верно! Один конец — это луч.', uz: "To'g'ri! Bitta uch — bu nur." },
    audio: {
      intro: { ru: 'Тренировка. Посмотри на концы и назови линию.', uz: "Mashq. Uchlarga qarab chiziqni ayting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай концы: сколько зелёных точек?', uz: "Uchlarni sanang: nechta yashil nuqta?" }
    }
  },

  // s6 — MASHQ uch-sanash (3 round)
  s6: {
    eyebrow: { ru: 'Считай концы', uz: 'Uchlarni sanang' },
    lead: { ru: 'Сколько концов?', uz: "Nechta uchi bor?" },
    rounds: [ { type: 'segment', ask: 'count' }, { type: 'line', ask: 'count' }, { type: 'ray', ask: 'count' } ],
    wrong: { ru: 'Считай зелёные точки на концах.', uz: "Uchlardagi yashil nuqtalarni sanang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Считай концы линии — зелёные точки.', uz: "Chiziqning uchlarini — yashil nuqtalarni sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'У прямой ноль, у луча один, у отрезка два.', uz: "To'g'ri chiziqda nol, nurda bir, kesmada ikki." }
    }
  },

  // s7 — MASHQ HAYOTIY langar (tur-tanish, 3 round: ufq/fonar/qalam)
  s7: {
    eyebrow: { ru: 'В жизни', uz: 'Hayotda' },
    lead: { ru: 'На что это похоже?', uz: "Bu nimaga o'xshaydi?" },
    rounds: [ { type: 'line', kind: 'horizon' }, { type: 'ray', kind: 'beam' }, { type: 'segment', kind: 'edge' } ],
    wrong: { ru: 'Линия горизонта — в обе стороны, луч фонаря — в одну, карандаш — с двумя концами.', uz: "Ufq chizig'i — ikki tomonga, fonar nuri — bir tomonga, qalam — ikki uchli." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Посмотри на предмет и назови линию: прямая, луч или отрезок.', uz: "Buyumga qarab chiziqni ayting: to'g'ri chiziq, nur yoki kesma." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай концы: у линии горизонта их нет, у луча один, у карандаша два.', uz: "Uchlarni sanang: ufq chizig'i uchsiz, nur bitta, qalam ikkita." }
    }
  },

  // s8 — MASHQ tur-tanish (3 round abstrakt)
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    lead: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    rounds: [ { type: 'segment' }, { type: 'ray' }, { type: 'line' } ],
    wrong: { ru: 'Считай концы — зелёные точки.', uz: "Uchlarni — yashil nuqtalarni sanang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Смотри на концы и называй линию.', uz: "Uchlarga qarab chiziqni ayting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Ноль — прямая, один — луч, два — отрезок.', uz: "Nol — to'g'ri chiziq, bir — nur, ikki — kesma." }
    }
  },

  // s9 — MASHQ uch-sanash (3 round)
  s9: {
    eyebrow: { ru: 'Считай концы', uz: 'Uchlarni sanang' },
    lead: { ru: 'Сколько концов?', uz: "Nechta uchi bor?" },
    rounds: [ { type: 'line', ask: 'count' }, { type: 'ray', ask: 'count' }, { type: 'segment', ask: 'count' } ],
    wrong: { ru: 'Считай зелёные точки на концах.', uz: "Uchlardagi yashil nuqtalarni sanang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Снова считай концы линии.', uz: "Yana chiziqning uchlarini sanang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри только на концы линии.', uz: "Faqat chiziqning uchlariga qarang." }
    }
  },

  // s10 — MASHQ HAYOTIY langar (tur-tanish, 3 round)
  s10: {
    eyebrow: { ru: 'В жизни', uz: 'Hayotda' },
    lead: { ru: 'На что это похоже?', uz: "Bu nimaga o'xshaydi?" },
    rounds: [ { type: 'ray', kind: 'beam' }, { type: 'segment', kind: 'edge' }, { type: 'line', kind: 'horizon' } ],
    wrong: { ru: 'Луч — один конец, карандаш — два, линия горизонта — без концов.', uz: "Nur — bitta uch, qalam — ikkita, ufq chizig'i — uchsiz." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Снова назови линию по предмету.', uz: "Yana buyumga qarab chiziqni ayting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай концы предмета.', uz: "Buyumning uchlarini sanang." }
    }
  },

  // s11 — MASHQ tur-tanish (3 round abstrakt)
  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    lead: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    rounds: [ { type: 'ray' }, { type: 'line' }, { type: 'segment' } ],
    wrong: { ru: 'Считай концы — зелёные точки.', uz: "Uchlarni — yashil nuqtalarni sanang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    audio: {
      intro: { ru: 'Последняя тренировка перед задачей. Назови линию.', uz: "Masaladan oldingi oxirgi mashq. Chiziqni ayting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Ноль — прямая, один — луч, два — отрезок.', uz: "Nol — to'g'ri chiziq, bir — nur, ikki — kesma." }
    }
  },

  // s12 — MASALA (kirish/kontekst, ishlatilmaydi — s13 ichida story). Saqlanadi.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Зухра делит кристаллы.', uz: "Zuhra kristallarni ulashadi." },
    manifest_label: { ru: 'добыча', uz: "o'lja" },
    audio: {
      ru: 'Зухра делит добычу поровну.',
      uz: "Zuhra o'ljani teng ulashadi."
    }
  },

  // s13 — MASALA (scored, LineTypeStage hayotiy): qalam = kesma
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Помоги экипажу.', uz: "Ekipajga yordam bering." },
    type: 'segment', kind: 'edge',
    story: { ru: 'Экипаж измеряет карандаш для чертежа. Какая это линия?', uz: "Ekipaj chizma uchun qalamni o'lchayapti. Bu qanday chiziq?" },
    wrong: { ru: 'У карандаша два конца — начало и конец.', uz: "Qalamning ikki uchi bor — boshi va oxiri." },
    done_text: { ru: 'Верно! Карандаш — отрезок, у него два конца.', uz: "To'g'ri! Qalam — kesma, uning ikki uchi bor." },
    audio: {
      intro: { ru: 'Экипаж измеряет карандаш для чертежа. Какая это линия — прямая, луч или отрезок?', uz: "Ekipaj chizma uchun qalamni o'lchayapti. Bu qanday chiziq — to'g'ri chiziq, nur yoki kesma?" },
      on_correct: { ru: 'Верно. Отрезок можно измерить — у него два конца.', uz: "To'g'ri. Kesmani o'lchash mumkin — uning ikki uchi bor." },
      on_wrong: { ru: 'У карандаша два конца — это отрезок.', uz: "Qalamning ikki uchi bor — bu kesma." }
    }
  },

  // s14 — FINAL (scored, 3 round tur-tanish + FactCard Uran)
  s14: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    lead: { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
    rounds: [ { type: 'line' }, { type: 'ray' }, { type: 'segment' } ],
    wrong: { ru: 'Считай концы — зелёные точки.', uz: "Uchlarni — yashil nuqtalarni sanang." },
    done_text: { ru: 'Верно!', uz: "To'g'ri!" },
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Уран вращается «на боку» — лёжа, как будто катится. Другие планеты крутятся стоя.', uz: "Uran «yonboshlab» aylanadi — yotgan holda, xuddi dumalayotgandek. Boshqa sayyoralar tik aylanadi." },
    fact_audio: { ru: 'Уран — необычная планета: она вращается на боку, лёжа, как будто катится по орбите.', uz: "Uran — g'ayrioddiy sayyora: u yonboshlab, yotgan holda aylanadi, xuddi orbitada dumalab ketayotgandek." },
    audio: {
      intro: { ru: 'Финальная проверка. Смотри на концы и называй линию.', uz: "Yakuniy tekshiruv. Uchlarga qarab chiziqni ayting." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Ноль концов — прямая, один — луч, два — отрезок.', uz: "Nol uch — to'g'ri chiziq, bir — nur, ikki — kesma." }
    }
  },

  // s15 — YAKUN: QOIDA recap + bog'lanishlar (keyingi: ko'pburchaklar)
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Миссия выполнена!', uz: 'Missiya bajarildi!' },
    cando: { ru: 'Теперь ты различаешь прямую, луч и отрезок!', uz: "Endi siz to'g'ri chiziq, nur va kesmani ajratasiz!" },
    // QOIDA recap (ko'rinadigan):
    rule_recap: { ru: 'Прямая — 0 концов, луч — 1 конец, отрезок — 2 конца. Считай концы!', uz: "To'g'ri chiziq — 0 uch, nur — 1 uch, kesma — 2 uch. Uchlarni sanang!" },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'точка и линия', uz: "nuqta va chiziq" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'дальше: многоугольники', uz: "keyingi: ko'pburchaklar" },
    audio: {
      ru: 'Миссия выполнена. Мы научились различать линии по концам. У прямой концов нет, у луча один конец, у отрезка два конца. На спутнике Урана экипаж начертил линии для станции. Дальше научимся узнавать многоугольники.',
      uz: "Missiya bajarildi. Chiziqlarni uchlari bo'yicha ajratishni o'rgandik. To'g'ri chiziqning uchi yo'q, nurning bitta uchi, kesmaning ikki uchi bor. Uran yo'ldoshida ekipaj stansiya uchun chiziqlar chizdi. Keyin ko'pburchaklarni tanishni o'rganamiz."
    }
  }
};

// v8 missiya-zanjiri — slaydlararo ↳ ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Начнём с прямой линии.', uz: "To'g'ri chiziqdan boshlaymiz." },
  s2:  { ru: 'Теперь луч.', uz: "Endi nur." },
  s3:  { ru: 'Как различить линии?', uz: "Chiziqlarni qanday ajratamiz?" },
  s4:  { ru: 'И наконец отрезок.', uz: "Va nihoyat kesma." },
  sTBL: { ru: 'Запомним ключ по концам.', uz: 'Uchlar kalitini yodlaymiz.' },
  s5:  { ru: 'Теперь узнавай линии сам.', uz: "Endi chiziqlarni o'zingiz taning." },
  s6:  { ru: 'Считай концы.', uz: "Uchlarni sanang." },
  s7:  { ru: 'Найди линию в жизни.', uz: "Hayotda chiziqni toping." },
  s8:  { ru: 'Что это за линия?', uz: "Bu qanday chiziq?" },
  s9:  { ru: 'Снова считай концы.', uz: "Yana uchlarni sanang." },
  s10: { ru: 'Ещё раз — в жизни.', uz: "Yana — hayotda." },
  s11: { ru: 'Последняя тренировка.', uz: 'Oxirgi trenirovka.' },
  s12: { ru: 'Экипаж чертит линии.', uz: "Ekipaj chiziqlar chizadi." },
  s13: { ru: 'Помоги экипажу.', uz: "Ekipajga yordam bering." },
  s14: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s15: { ru: 'Кристаллы разъехались по вагонеткам!', uz: "Kristallar vagonchalarga taqsimlandi!" }
};

// s15 payoff (xulosadan oldin aytiladi)
const S15_PAYOFF = {
  ru: 'На спутнике Урана экипаж начертил прямые, лучи и отрезки для станции. Линии различены! Спасибо за помощь.',
  uz: "Uran yo'ldoshida ekipaj stansiya uchun to'g'ri chiziq, nur va kesmalar chizdi. Chiziqlar ajratildi! Yordamingiz uchun rahmat."
};

// «UCHISHGA TAYYORLIK» -> yo'l xaritasi yozuvi (lang-lookup)
const READY_LABEL = { ru: 'Путь домой', uz: "Uyga yo'l" };

// ============================================================
// 1-SINF ANIMATSION KIT (etalon — keyingi darslar shundan meros oladi)
// Barcha sikllar prefers-reduced-motion bilan to'xtaydi (CSS @media + usePrefersReducedMotion).
// ============================================================

// Reduced-motion holatini kuzatadi — JS sikllarini ham to'xtatish uchun.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply); else mq.addListener(apply);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', apply); else mq.removeListener(apply); };
  }, []);
  return reduced;
}

// 0..max gacha sanaydi (sekin, ovoz tempida). loop=false -> max da to'xtaydi (PM audit);
// loop=true -> max da holdMs kutib qaytadan boshlaydi (summary qo'li uchun).
// reduced-motion -> darrov max.
function useCountOnce(max, { stepMs = 1300, startDelay = 600, loop = false, holdMs = 1600 } = {}) {
  const reduced = usePrefersReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced) { const id = setTimeout(() => setK(max), 0); return () => clearTimeout(id); }
    let alive = true; let timer;
    let val = 0;
    const tick = () => {
      if (!alive) return;
      setK(val);
      if (val >= max) {
        if (!loop) return;                       // bir martalik: to'xtaydi
        timer = setTimeout(() => { val = 0; tick(); }, holdMs);  // loop: qaytadan
        return;
      }
      val += 1;
      timer = setTimeout(tick, val === 1 ? startDelay : stepMs);
    };
    timer = setTimeout(tick, startDelay);
    return () => { alive = false; clearTimeout(timer); };
  }, [max, stepMs, startDelay, loop, holdMs, reduced]);
  return k;
}

// Umumiy gradientlar — bir marta hujjatga qo'yiladi; ObjSvg va barcha sahnalar shu id'larga murojaat qiladi.
const GradientDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="g1apA" cx="36%" cy="28%" r="74%">
        <stop offset="0%" stopColor="#FF7A63"/><stop offset="48%" stopColor="#E5301C"/><stop offset="100%" stopColor="#9C1008"/>
      </radialGradient>
      <radialGradient id="g1chrG" cx="36%" cy="30%" r="72%">
        <stop offset="0%" stopColor="#FF6A66"/><stop offset="50%" stopColor="#C8102E"/><stop offset="100%" stopColor="#7A0820"/>
      </radialGradient>
      <radialGradient id="g1nonG" cx="40%" cy="33%" r="72%">
        <stop offset="0%" stopColor="#F0CC86"/><stop offset="58%" stopColor="#D9A35A"/><stop offset="100%" stopColor="#B07734"/>
      </radialGradient>
      <radialGradient id="g1teaG" cx="36%" cy="28%" r="82%">
        <stop offset="0%" stopColor="#46BEE8"/><stop offset="68%" stopColor="#019ACB"/><stop offset="100%" stopColor="#016E93"/>
      </radialGradient>
      <radialGradient id="g1starG" cx="42%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FFE08A"/><stop offset="55%" stopColor="#FFC23C"/><stop offset="100%" stopColor="#EE9A1E"/>
      </radialGradient>
      <radialGradient id="g1fishG" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#5FCAEF"/><stop offset="65%" stopColor="#019ACB"/><stop offset="100%" stopColor="#0179A0"/>
      </radialGradient>
      <radialGradient id="g1flwG" cx="40%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#FFA6C6"/><stop offset="55%" stopColor="#FF6FA0"/><stop offset="100%" stopColor="#E0497E"/>
      </radialGradient>
    </defs>
  </svg>
);

// Tabiiy shakllar (bolalar taniydigan). viewBox 0 0 40 40. Mevalar (apple/cherry) — realniy, gradientli.
const ICON = {
  apple: <g transform="translate(20 21)"><path d="M0 -7 C -5 -13 -11 -13 -13.5 -8 C -16.5 -2 -15.5 9 -8 14.5 C -4 17 -1.5 16.5 0 14.5 C 1.5 16.5 4 17 8 14.5 C 15.5 9 16.5 -2 13.5 -8 C 11 -13 5 -13 0 -7 Z" fill="url(#g1apA)"/><circle cx="0" cy="14.2" r="1.5" fill="rgba(110,40,20,0.45)"/><path d="M0 -8 Q1 -16 5 -18" stroke="#6E3A20" strokeWidth="2.4" fill="none" strokeLinecap="round"/><ellipse cx="9" cy="-16" rx="6" ry="3.4" fill="#2C9A57" transform="rotate(-18 9 -16)"/><ellipse cx="-6.5" cy="-1" rx="2.8" ry="6.2" fill="rgba(255,255,255,0.55)" transform="rotate(-16 -6.5 -1)"/><circle cx="-3.5" cy="-7" r="1.8" fill="rgba(255,255,255,0.7)"/></g>,
  star: <g><path d="M20 3 L24.9 14.7 L37.5 15.8 L28 24.2 L30.9 36.5 L20 29.8 L9.1 36.5 L12 24.2 L2.5 15.8 L15.1 14.7 Z" fill="url(#g1starG)" stroke="#E0992A" strokeWidth="0.8" strokeLinejoin="round"/><path d="M20 9 L22.4 15.4 L20 20 L17.6 15.4 Z" fill="rgba(255,255,255,0.38)"/></g>,
  fish: <g><path d="M26 20 L39 9 L39 31 Z" fill="url(#g1fishG)"/><ellipse cx="16" cy="20" rx="15" ry="12" fill="url(#g1fishG)"/><path d="M11 11 Q16 6 21 11" stroke="#0179A0" strokeWidth="1.8" fill="none" strokeLinecap="round"/><ellipse cx="12" cy="14.5" rx="5" ry="2.7" fill="rgba(255,255,255,0.4)"/><circle cx="8.5" cy="18" r="2.4" fill="#FFFFFF"/><circle cx="8" cy="18" r="1.2" fill="#0E0E10"/></g>,
  flower: <g><g fill="url(#g1flwG)"><ellipse cx="20" cy="10" rx="5.5" ry="8"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(72 20 20)"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(144 20 20)"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(216 20 20)"/><ellipse cx="20" cy="10" rx="5.5" ry="8" transform="rotate(288 20 20)"/></g><circle cx="20" cy="20" r="6" fill="#FFC23C" stroke="#E8A92A" strokeWidth="0.8"/><circle cx="17.6" cy="17.6" r="1.8" fill="rgba(255,255,255,0.45)"/></g>,
  balloon: <g><path d="M20 27 L20 36" stroke="#A7A6A2" strokeWidth="1.4" fill="none"/><ellipse cx="20" cy="15" rx="10" ry="12" fill="#FF4F28"/><path d="M17.6 26 L22.4 26 L20 29 Z" fill="#FF4F28"/><ellipse cx="16" cy="11" rx="2.4" ry="3.4" fill="rgba(255,255,255,0.4)"/></g>,
  cherry: <g><path d="M20 9 Q27 13 28 25" stroke="#3E7D2A" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M20 9 Q14 14 12 24" stroke="#3E7D2A" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M19 9 Q24 3 31 6 Q26 10 19 9 Z" fill="#3E9B3A"/><circle cx="12" cy="29" r="8" fill="url(#g1chrG)"/><circle cx="27" cy="27" r="8" fill="url(#g1chrG)"/><ellipse cx="9.5" cy="26" rx="2.3" ry="3.3" fill="rgba(255,255,255,0.6)" transform="rotate(-18 9.5 26)"/><ellipse cx="24.5" cy="24" rx="2.3" ry="3.3" fill="rgba(255,255,255,0.6)" transform="rotate(-18 24.5 24)"/></g>
};
const KIND_ORDER = ['apple', 'star', 'fish', 'flower', 'balloon'];

const ObjSvg = ({ kind }) => (
  <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">{ICON[kind] || ICON.apple}</svg>
);

const Obj = ({ kind = 'apple', i = 0, anim = 'bob' }) => (
  <span className={`g1-obj ${anim ? 'g1-' + anim : ''}`} style={{ animationDelay: `${(i % 5) * 0.16}s` }}>
    <ObjSvg kind={kind}/>
  </span>
);

// Pips — statik pips o'rniga animatsion (idle bob/twinkle). API saqlangan (n, kind).
// wrap=true -> ko'p qatorga o'raladi (tor idishda skrol bo'lmasin); aks holda bitta qator (sanash uchun).
const Pips = ({ n, kind = 'apple', anim = 'bob', wrap = false }) => (
  <div className={`g1-pips ${wrap ? 'g1-pips-wrap' : ''}`}>
    {Array.from({ length: n }).map((_, i) => <Obj key={i} kind={kind} i={i} anim={anim}/>)}
  </div>
);
// ============================================================
// ETALON KIT · BIT-KARTOCHKA + RAG'BAT — yagona reaktsiya (Bit + maqtov) barcha javob ekranlarida
// ============================================================
// Maqtov so'zlari navbat bilan (monoton bo'lmasin)
const PRAISE = { ru: ['Молодец!', 'Отлично!', 'Здорово!', 'Умница!'], uz: ['Barakalla!', 'Ajoyib!', "Zo'r!", 'Ofarin!'] };
// Rag'bat — xato javobda navbat bilan UNIKAL, to'g'ri javobga YO'NALTIRUVCHI so'z
// (javobni OCHIB QO'YMAYDI — faqat usulni ko'rsatadi: qaytadan/bittadan/diqqat bilan sana).
const ENCOURAGE = {
  ru: [
    'Почти! Посчитай ещё раз, по одному.',
    'Уже близко! Посмотри внимательно и сосчитай снова.',
    'Хорошая попытка! Считай не спеша, по порядку.',
    'Ещё чуть-чуть! Дотронься до каждого и посчитай.',
    'Молодец! Начни счёт сначала, спокойно.'
  ],
  uz: [
    'Sal qoldi! Yana bir bor, bittadan sanang.',
    'Yaqin qoldingiz! Diqqat bilan qaytadan sanang.',
    'Yaxshi urinish! Shoshmasdan, tartib bilan sanang.',
    'Ozgina qoldi! Har biriga qarab, bittadan sanang.',
    "Zo'r harakat! Sanashni boshidan, sekin boshlang."
  ]
};
let _encIdx = 0;
const nextEncourage = (lang) => { const a = ENCOURAGE[lang] || ENCOURAGE.ru; const p = a[_encIdx % a.length]; _encIdx += 1; return p; };
let _praiseIdx = 0;
const nextPraise = (lang) => { const a = PRAISE[lang] || PRAISE.ru; const p = a[_praiseIdx % a.length]; _praiseIdx += 1; return p; };
// Bit — robot-yordamchi/boshlovchi (gradient korpus, panjalar, oyoq soyasi, ekran porlashi).
// state: present (salomlashadi) | happy (to'g'ri javob) | hint (xato/yordam)
const BitSVG = ({ state = 'present', className = '' }) => (
  <svg className={`g1-char g1-char-bit ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g1bbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2ECF2"/><stop offset="100%" stopColor="#B6C7D2"/></linearGradient>
      <linearGradient id="g1bhead" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EBF2F6"/><stop offset="100%" stopColor="#C4D3DC"/></linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)"/>
    {/* antenna */}
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="60" cy="11" r="6" fill="#FF4F28"/>
      <circle cx="58" cy="9" r="2" fill="#FFB9A6"/>
    </g>
    {/* oyoqchalar */}
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF"/>
    {/* tana */}
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g1bbody)" stroke="#A9BCC8" strokeWidth="2"/>
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5"/>
    {/* qo'llar + panjalar (state) */}
    {state === 'happy' && (
      <g>
        <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="22" cy="47" r="5" fill="#B6C7D2"/>
        <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="47" r="5" fill="#B6C7D2"/>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/>
        <g className="g1-bit-wave"><path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="98" cy="43" r="5" fill="#B6C7D2"/></g>
      </g>
    )}
    {state === 'hint' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="30" cy="103" r="5" fill="#B6C7D2"/>
        <path d="M84 74 C 92 64 96 54 95 46" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="95" cy="45" r="5" fill="#B6C7D2"/>
      </g>
    )}
    {/* bosh */}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g1bhead)" stroke="#A9BCC8" strokeWidth="2"/>
    {/* ekran-yuz + porlash */}
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C"/>
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)"/>
    <g className="g1-eyes" fill="#5BD6F2">
      {state === 'hint'
        ? <><circle cx="50" cy="50" r="4.5"/><circle cx="70" cy="49" r="5.5"/></>
        : <><circle cx="50" cy="50" r="5"/><circle cx="70" cy="50" r="5"/></>}
    </g>
    {state === 'happy' && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round"/>}
    {state === 'present' && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round"/>}
    {state === 'hint' && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2"/>}
    {/* hint: yordam belgisi */}
    {state === 'hint' && <g><circle cx="99" cy="38" r="9" fill="#FFC23C"/><text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text></g>}
  </svg>
);

// Personaj holatini butun urok darajasida boshqaruvchi kontekst.
// Har bir ekran o'z holatini e'lon qiladi (useHero), bitta doimiy overlay ko'rsatadi.
const HeroContext = createContext({ setMood: () => {} });
const useHero = (mood) => {
  const { setMood } = useContext(HeroContext);
  useEffect(() => { setMood(mood); }, [mood, setMood]);
};
// Overlay personaj (pastki-chap): o'quv ekranlarida Ra'no (syujet ichi), ramkada Bit (boshlovchi).
// 'present' — Bit BOSHLOVCHI (sIntro/sGuest/s11). Reaksiyada Bit endi OVERLAY emas, KARTOCHKADA (Reaction).
// Overlay faqat BIT (boshlovchi, 'present' — ramka ekranlari). Ra'no overlay olib tashlandi
// (metodist talabi): Ra'no endi faqat frame ichidagi cast'da; reaksiya — Bit-kartochkada.
const StageHero = ({ mood }) => {
  if (mood !== 'present') return null;
  return (
    <div className="g1-stage-hero g1-sh-present" aria-hidden="true">
      <BitSVG state="present" className="g1-hero-bit"/>
    </div>
  );
};

// Confetti — bayram bo'laklari (qayta ishlatiladigan)
const Confetti = () => (
  <>
    <span className="g1-conf g1-conf1"/><span className="g1-conf g1-conf2"/><span className="g1-conf g1-conf3"/>
    <span className="g1-conf g1-conf4"/><span className="g1-conf g1-conf5"/><span className="g1-conf g1-conf6"/>
  </>
);

// Reaction — javob otkligi: Bit-KARTOCHKA (matn + o'ngda animatsion Bit), 5-sinf fakt-kartochka uslubi.
// To'g'ri -> Bit happy (sakraydi); xato -> Bit hint (yordam, qiyshayadi). Ra'no overlay ham reaksiya qiladi.
const Reaction = ({ state, praise }) => {
  const ok = state === 'correct';
  useHero(ok ? 'happy' : 'encourage');
  return (
    <div className={`g1-bitcard ${ok ? 'g1-bitcard-ok' : 'g1-bitcard-enc'}`}>
      <div className="g1-bitcard-fig"><BitSVG state={ok ? 'happy' : 'hint'}/></div>
      <div className="g1-bitcard-body"><span className="g1-bitcard-txt">{praise}</span></div>
    </div>
  );
};
// AnsPop — to'g'ri javob raqami savol vizualining o'zida paydo bo'ladi ("= N", pop).
// Barcha test-figuralar shu orqali javobni ko'rsatadi (bola javobni rasmda ham ko'radi).
const AnsPop = ({ n }) => (
  <span className="g1-anspop g1-pop-in" aria-hidden="true">
    <i className="g1-anspop-eq">=</i><b className="g1-anspop-num">{n}</b>
  </span>
);
const SPARKS = [
  { dx: '0px', dy: '-30px', s: 8, d: '0s' },
  { dx: '24px', dy: '-20px', s: 6, d: '0.05s' },
  { dx: '-24px', dy: '-20px', s: 6, d: '0.09s' },
  { dx: '30px', dy: '2px', s: 5, d: '0.13s' },
  { dx: '-30px', dy: '2px', s: 5, d: '0.07s' },
  { dx: '14px', dy: '-28px', s: 4, d: '0.11s' },
];
const SparkBurst = () => (
  <>{SPARKS.map((p, i) => (
    <span key={i} className="g1-csp" style={{ width: `${p.s}px`, height: `${p.s}px`, ['--dx']: p.dx, ['--dy']: p.dy, animationDelay: p.d }}/>
  ))}</>
);

// ============================================================
// D2 VIZUALIZATORLAR — «KEMA ICHIDA» (o'nlik/birlik), MIKROGRAVITATSIYA:
// yuk bo'limi interyeri (SceneBg-texnika), realistik batareya (birlik) / kasseta (o'nlik),
// yuklash pulti, neon-displey, lyuk-kod panellari, magnit-rack + yuk xati, illyuminator warp.
// Barcha harakat = suzish/aylanish/magnit-dok (tortishish-tushish YO'Q).
// ============================================================

// Umumiy D2 gradientlar (realistik metall/element ranglari).
const D2Defs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <linearGradient id="d2batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96"/><stop offset="22%" stopColor="#43B6E0"/><stop offset="50%" stopColor="#8FE0F4"/><stop offset="74%" stopColor="#2FA0CC"/><stop offset="100%" stopColor="#0A5876"/></linearGradient>
      <linearGradient id="d2battcap" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8FA0AE"/><stop offset="35%" stopColor="#EEF3F7"/><stop offset="65%" stopColor="#C6D2DB"/><stop offset="100%" stopColor="#7E93A2"/></linearGradient>
      <linearGradient id="d2battband" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B23A26"/><stop offset="30%" stopColor="#FF7A5E"/><stop offset="100%" stopColor="#C7401F"/></linearGradient>
      <linearGradient id="d2cass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5E82"/><stop offset="24%" stopColor="#7385AB"/><stop offset="52%" stopColor="#8C9EC4"/><stop offset="76%" stopColor="#63739A"/><stop offset="100%" stopColor="#4E5E82"/></linearGradient>
      <linearGradient id="d2metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F5EEE0"/><stop offset="50%" stopColor="#EDE4D2"/><stop offset="100%" stopColor="#E3D9C4"/></linearGradient>
      <linearGradient id="d2rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#E7DCC6"/><stop offset="45%" stopColor="#F1E9D9"/><stop offset="55%" stopColor="#F6F0E2"/><stop offset="100%" stopColor="#E7DCC6"/></linearGradient>
      <radialGradient id="d2space" cx="50%" cy="45%" r="70%"><stop offset="0%" stopColor="#2E4B7C"/><stop offset="100%" stopColor="#16294C"/></radialGradient>
      <linearGradient id="d2rocket" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#AFC2D0"/><stop offset="45%" stopColor="#F4F8FB"/><stop offset="100%" stopColor="#9EB2C0"/></linearGradient>
      <linearGradient id="d2flameG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE08A"/><stop offset="55%" stopColor="#FF9A3C"/><stop offset="100%" stopColor="#FF4F28"/></linearGradient>
      <linearGradient id="d2planet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5C7CB0"/><stop offset="100%" stopColor="#2C3E68"/></linearGradient>
      <linearGradient id="d2ship" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8CA0B8"/><stop offset="45%" stopColor="#C6D6E4"/><stop offset="100%" stopColor="#5E718C"/></linearGradient>
    </defs>
  </svg>
);

// --- BATAREYA (birlik): realistik sanoat elementi — terminal, yorliq-band, soya/porlash.
const BatterySvg = ({ className = '' }) => (
  <svg className={`d2-battsvg ${className}`} viewBox="0 0 22 34" aria-hidden="true">
    <rect x="8" y="0.6" width="6" height="3.6" rx="1.5" fill="url(#d2battcap)" stroke="#6E828F" strokeWidth="0.6"/>
    <rect x="9.4" y="0.2" width="3.2" height="1.4" rx="0.7" fill="#F4F8FA"/>
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="url(#d2batt)" stroke="#093F55" strokeWidth="1"/>
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6"/>
    <rect x="1.4" y="12.5" width="19.2" height="9" fill="url(#d2battband)" opacity="0.95"/>
    <path d="M12.6 14 L8.8 20.4 L11.2 20.4 L9.8 25.6 L14.4 18.4 L11.8 18.4 Z" fill="#FFE9A6" stroke="#D89A18" strokeWidth="0.4"/>
    <rect x="3.4" y="6" width="2.4" height="25" rx="1.2" fill="rgba(255,255,255,0.4)"/>
    <rect x="16.4" y="6" width="1.4" height="25" rx="0.7" fill="rgba(0,0,0,0.18)"/>
  </svg>
);

// (v11: mavhum "porlovchi birlik-element" olib tashlandi — metodist: tushunarsiz.
// s1 endi darsning O'Z buyumlari bilan ishlaydi: PackTenViz, pastda.)

// --- KASSETA (o'nlik) = realistik magazin: g'ilof, yon qovurg'alar, burchak parchinlari,
// holat-LED (to'lganda yashil yonadi), ichida 10 batareya-slot ko'rinadi.
const CassetteSvg = ({ lit = true, className = '' }) => (
  <svg className={`d2-casssvg ${className}`} viewBox="0 0 48 66" aria-hidden="true">
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#d2cass)" stroke="#33415F" strokeWidth="1.4"/>
    <rect x="1" y="4" width="46" height="61" rx="7" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7"/>
    {/* yon qovurg'alar (grip) */}
    <g fill="rgba(0,0,0,0.22)">
      <rect x="3.4" y="18" width="2" height="30" rx="1"/><rect x="42.6" y="18" width="2" height="30" rx="1"/>
    </g>
    {/* burchak parchinlari */}
    <g fill="#8494AE"><circle cx="6" cy="9.5" r="1.3"/><circle cx="42" cy="9.5" r="1.3"/><circle cx="6" cy="60" r="1.3"/><circle cx="42" cy="60" r="1.3"/></g>
    {/* holat-LED */}
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" stroke="#2A3550" strokeWidth="0.6"/>
    <circle cx="24" cy="9.2" r="2" fill={lit ? '#6EF29B' : '#3A4A66'} stroke="#10182A" strokeWidth="0.6"/>
    {lit && <circle className="d2-casslight" cx="24" cy="9.2" r="4.4" fill="rgba(110,242,155,0.4)"/>}
    {/* 10 batareya-slot */}
    {Array.from({ length: 10 }).map((_, i) => {
      const col = i % 2; const row = Math.floor(i / 2);
      return (
        <g key={i} transform={`translate(${6.5 + col * 19.5} ${16 + row * 9.4})`}>
          <rect x="0" y="0" width="15" height="7.4" rx="2.4" fill="#33415F" stroke="#5A6B8840" strokeWidth="0.5"/>
          <rect x="1" y="1" width="13" height="5.4" rx="1.8" fill="url(#d2batt)" stroke="#093F55" strokeWidth="0.4"/>
          <rect x="1.8" y="1.6" width="11.4" height="1.5" rx="0.7" fill="rgba(255,255,255,0.3)"/>
        </g>
      );
    })}
  </svg>
);

// --- KASSETA + BATAREYA vizual: tens ta kasseta + ones ta yakka batareya (suzuvchi).
// ans != null -> AnsPop. dock -> magnit-dok kirish animatsiyasi (yondan suzib keladi).
const CassBattViz = ({ tens = 0, ones = 0, ans = null, dock = false, small = false }) => (
  <div className={`d2-bsviz ${small ? 'd2-bsviz-sm' : ''}`}>
    {tens > 0 && (
      <span className="d2-bs-grp d2-float">
        {Array.from({ length: tens }).map((_, i) => <span key={`t${i}`} className={dock ? 'd2-dock' : ''} style={dock ? { animationDelay: `${i * 0.1}s` } : undefined}><CassetteSvg/></span>)}
      </span>
    )}
    {ones > 0 && (
      <span className="d2-bs-grp d2-bs-ones d2-float d2-float-b">
        {Array.from({ length: ones }).map((_, i) => <span key={`o${i}`} className={dock ? 'd2-dock d2-dock-r' : ''} style={dock ? { animationDelay: `${(tens + i) * 0.09}s` } : undefined}><BatterySvg/></span>)}
      </span>
    )}
    {tens === 0 && ones === 0 && <span className="d2-bs-empty mono">?</span>}
    {ans != null && <AnsPop n={ans}/>}
  </div>
);

// --- s1 figura (v11): 10 BATAREYA vaznsizlikda suzadi -> to'g'ri javobda markazga suzib
// BITTA KASSETAGA joylashadi (yopiladi, LED yonadi) — s2 da bola O'ZI qiladigan ishning
// oldindan-ko'rsatuvi (watch -> do juftligi). s0/s2 dagi suzish/magnit-latch lug'ati.
// reduced-motion -> statik yakuniy holat (yopiq lit kasseta).
const PACK_POS = [
  { x: 8,  y: 16, r: -24 }, { x: 26, y: 58, r: 18 },  { x: 40, y: 10, r: -8 },
  { x: 56, y: 52, r: 26 },  { x: 14, y: 66, r: -30 }, { x: 70, y: 20, r: 10 },
  { x: 33, y: 30, r: 32 },  { x: 62, y: 72, r: -18 }, { x: 84, y: 48, r: 22 },
  { x: 86, y: 12, r: 8 }
];
const PackTenViz = ({ merged = false }) => (
  <div className="d2-packviz">
    {PACK_POS.map((p, i) => (
      <span key={i} className={`d2-packb ${merged ? 'd2-packin' : ''}`}
        style={{ left: `${p.x}%`, top: `${p.y}%`, ['--r']: `${p.r}deg`, animationDelay: merged ? `${(i % 5) * 0.07}s` : undefined }}>
        <span className="d2-packb-in" style={!merged ? { animationDuration: `${8 + (i % 4)}s`, animationDelay: `${(i % 5) * 0.5}s` } : undefined}>
          <BatterySvg/>
        </span>
      </span>
    ))}
    {merged && (
      <span className="d2-packcass">
        <span className="d2-packcass-pop">
          <span className="d2-packcass-idle"><CassetteSvg lit className="d2-casssvg-big"/></span>
        </span>
      </span>
    )}
  </div>
);

// --- KATTA SON-DISPLEY (pult ekranlari): joriy qiymat.
const BigNum = ({ v, accent = false }) => (
  <span className={`d2-bignum ${accent ? 'd2-bignum-accent' : ''}`}>{v}</span>
);

// --- RAKETA (faqat s11 fakt-kartochkasida — teskari sanash haqidagi fakt).
const RocketSvg = ({ flame = true, className = '' }) => (
  <svg className={`d2-rocketsvg ${className}`} viewBox="0 0 60 124" aria-hidden="true">
    {flame && (
      <g className="d2-flame">
        <path d="M30 100 C 22 108 24 118 30 123 C 36 118 38 108 30 100 Z" fill="url(#d2flameG)"/>
        <path d="M30 103 C 26 109 27 115 30 118 C 33 115 34 109 30 103 Z" fill="#FFF3C4"/>
      </g>
    )}
    <path d="M30 2 C 42 14 46 30 46 48 L46 84 L14 84 L14 48 C 14 30 18 14 30 2 Z" fill="url(#d2rocket)" stroke="#8AA0B2" strokeWidth="1.6"/>
    <path d="M14 62 L2 86 L14 84 Z" fill="#E0563B" stroke="#B23A26" strokeWidth="1.2"/>
    <path d="M46 62 L58 86 L46 84 Z" fill="#E0563B" stroke="#B23A26" strokeWidth="1.2"/>
    <rect x="22" y="84" width="16" height="8" rx="3" fill="#8AA0B2"/>
    <circle cx="30" cy="40" r="9" fill="#9FE0F2" stroke="#2C7BD6" strokeWidth="2.4"/>
    <circle cx="27" cy="37" r="2.6" fill="rgba(255,255,255,0.75)"/>
    <path d="M30 2 C 36 8 40 16 42 24 L18 24 C 20 16 24 8 30 2 Z" fill="#E0563B"/>
  </svg>
);

// --- ILLYUMINATOR ORTIDAGI KOINOT (fon ichida qayta ishlatiladi): yulduzlar + halqali sayyora.
const D2_STARS = [
  [16, 20, 1.4], [40, 40, 1.0], [66, 14, 1.3], [92, 34, 1.0], [30, 62, 1.1],
  [78, 58, 1.2], [54, 26, 0.9], [104, 48, 1.1], [20, 46, 1.0], [88, 22, 1.2]
];
const PortholeSpace = ({ warp = false, earth = false }) => (
  <g>
    <circle cx="60" cy="40" r="40" fill="url(#d2space)"/>
    {/* statik yulduzlar doim ko'rinadi (reduced-motion'da ham); warp'da xiraroq fon bo'ladi */}
    {D2_STARS.map(([x, y, r], i) => (
      <circle key={`s${i}`} className="d2-star" style={{ animationDelay: `${(i % 5) * 0.6}s` }} cx={x} cy={y} r={r} fill="#DCEAF8" opacity={warp ? 0.45 : 1}/>
    ))}
    {warp && D2_STARS.map(([x, y, r], i) => (
      <line key={`w${i}`} className="d2-streak" style={{ animationDelay: `${4 + (i % 5) * 0.12}s` }} x1={x} y1={y} x2={x} y2={y} stroke="#DCEAF8" strokeWidth={r} strokeLinecap="round"/>
    ))}
    {earth ? (
      // s0 — YER (ohista suzadi); s15 (warp) — kema uchgani uchun Yer kichrayib UZOQLASHADI
      <g className={`d2-earth ${warp ? 'd2-earth-recede' : ''}`}>
        <defs>
          <radialGradient id="d2earthg" cx="36%" cy="30%" r="80%"><stop offset="0%" stopColor="#7EC0EE"/><stop offset="55%" stopColor="#2E7CC4"/><stop offset="100%" stopColor="#134F8C"/></radialGradient>
          <clipPath id="d2earthclip"><circle cx="64" cy="46" r="16"/></clipPath>
        </defs>
        <circle cx="64" cy="46" r="16" fill="url(#d2earthg)"/>
        <g clipPath="url(#d2earthclip)">
          <g fill="#3E9B5F">
            <path d="M52 40 q7 -5 13 -1 q4 5 -1 9 q-9 3 -12 -3 z"/>
            <path d="M68 52 q6 -2 9 3 q1 5 -5 6 q-6 -1 -6 -5 z"/>
            <path d="M58 55 q4 1 6 5 q-4 3 -8 0 z"/>
          </g>
          <g className="d2-earth-clouds" fill="rgba(255,255,255,0.5)">
            <ellipse cx="56" cy="42" rx="8" ry="2.6"/>
            <ellipse cx="71" cy="48" rx="7" ry="2.4"/>
            <ellipse cx="62" cy="55" rx="6" ry="2"/>
          </g>
        </g>
        <circle cx="64" cy="46" r="16" fill="none" stroke="rgba(175,215,255,0.6)" strokeWidth="1.5"/>
        <ellipse cx="57" cy="39" rx="6" ry="4" fill="rgba(255,255,255,0.22)"/>
      </g>
    ) : null}{/* sayyora YO'Q — rejaga ko'ra hali yetilmagan; faqat yulduzlar */}
  </g>
);

// --- YUK BO'LIMI INTERYERI (SceneBg-texnika: viewBox 400x230, xMidYMax meet):
// metall qovurg'ali devor, shift chirog'i, illyuminator (koinot), tutqichlar, boshqaruv paneli, panjara-pol.
const CargoHoldBg = ({ earth = false, fill = false }) => (
  <svg className="d2-scene-bg" viewBox="0 0 400 230" preserveAspectRatio={fill ? 'xMidYMid slice' : 'xMidYMax meet'} aria-hidden="true">
    <rect x="0" y="0" width="400" height="230" fill="url(#d2metal)"/>
    {/* shift yorug'lik chizig'i */}
    <rect x="40" y="6" width="320" height="7" rx="3.5" fill="#E0D7C4"/>
    <rect x="46" y="8" width="308" height="3" rx="1.5" fill="#8FE0F4" opacity="0.75"/>
    <rect x="46" y="8" width="308" height="3" rx="1.5" className="d2-ceilglow" fill="#CFF3FF" opacity="0.35"/>
    {/* devor qovurg'alari (vertikal ribbing) */}
    <g>
      {[24, 60, 96, 300, 336, 372].map((x, i) => (
        <rect key={i} x={x} y="20" width="16" height="156" rx="4" fill="url(#d2rib)" stroke="#151D30" strokeWidth="1"/>
      ))}
    </g>
    {/* parchin qatorlari */}
    <g fill="#C3B79E" opacity="0.8">
      {[30, 120, 210, 300, 384].map((x) => [26, 92, 158].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5"/>)).flat()}
    </g>
    {/* ILLYUMINATOR (markaz-chap) — qalin gardishli deraza, ortida koinot */}
    <g transform="translate(70 44)">
      <circle cx="60" cy="40" r="47" fill="#1D3159" stroke="#CFC3AA" strokeWidth="7"/>
      <circle cx="60" cy="40" r="47" fill="none" stroke="#2A3550" strokeWidth="2"/>
      <clipPath id="d2porthole"><circle cx="60" cy="40" r="40"/></clipPath>
      <g clipPath="url(#d2porthole)"><PortholeSpace warp/></g>{/* Dars02: doim uchishda — yulduzlar oqadi */}
      {/* gardish parchinlari */}
      <g fill="#8494AE">{Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <circle key={i} cx={60 + Math.cos(a) * 44} cy={40 + Math.sin(a) * 44} r="1.8"/>; })}</g>
      <path d="M40 22 A 40 40 0 0 1 74 14" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeLinecap="round"/>
    </g>
    {/* BOSHQARUV PANELI (o'ng devor) — neon knopkalar + kichik displey */}
    <g transform="translate(300 60)">
      <rect x="0" y="0" width="74" height="86" rx="6" fill="#EFE7D5" stroke="#D0C4AB" strokeWidth="2"/>
      <rect x="8" y="8" width="58" height="20" rx="3" fill="#08111F"/>
      <text x="37" y="23" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill="#6EF29B" opacity="0.9">100</text>
      <g>
        <circle className="d2-neon" cx="16" cy="44" r="4.4" fill="#5BD6F2"/>
        <circle className="d2-neon" style={{ animationDelay: '0.6s' }} cx="37" cy="44" r="4.4" fill="#FFC23C"/>
        <circle className="d2-neon" style={{ animationDelay: '1.1s' }} cx="58" cy="44" r="4.4" fill="#FF7AA8"/>
      </g>
      <rect x="10" y="58" width="54" height="7" rx="3.5" fill="#26386A"/>
      <rect x="10" y="70" width="36" height="7" rx="3.5" fill="#26386A"/>
      {/* ogohlantirish yo'lagi */}
      <rect x="10" y="-8" width="54" height="5" rx="1.5" fill="#FFC23C"/>
      <g stroke="#1E273E" strokeWidth="2"><path d="M14 -8 l4 5 M22 -8 l4 5 M30 -8 l4 5 M38 -8 l4 5 M46 -8 l4 5 M54 -8 l4 5"/></g>
    </g>
    {/* TUTQICHLAR / grab-bar */}
    <g stroke="#7E8FA8" strokeWidth="5" strokeLinecap="round" fill="none">
      <path d="M210 96 h64"/><circle cx="210" cy="96" r="3.2" fill="#5A6B88" stroke="none"/><circle cx="274" cy="96" r="3.2" fill="#5A6B88" stroke="none"/>
    </g>
    <g stroke="#7E8FA8" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85">
      <path d="M24 150 v-30"/><path d="M376 150 v-30"/>
    </g>
    {/* panjara-pol */}
    <rect x="0" y="176" width="400" height="54" fill="#EAE0CC"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#3A4763" strokeWidth="2"/>
    <g stroke="#2A3550" strokeWidth="1.4">
      {[40, 90, 140, 190, 240, 290, 340].map((x) => <line key={x} x1={x} y1="180" x2={x - 14} y2="228"/>)}
      <line x1="0" y1="196" x2="400" y2="196"/><line x1="0" y1="214" x2="400" y2="214"/>
    </g>
  </svg>
);

// s15 KEMA-DEVORI: CargoHoldBg elementlari (markaziy illyuminatorsiz — o'rtada WarpScene porthole).
// Devorlarga kosmik kema hissini beradi: qovurg'a, parchin, boshqaruv panellari, tutqich, panjara-pol.
const S15Walls = () => (
  <svg className="d2-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect x="0" y="0" width="400" height="230" fill="url(#d2metal)"/>
    <rect x="40" y="6" width="320" height="7" rx="3.5" fill="#E0D7C4"/>
    <rect x="46" y="8" width="308" height="3" rx="1.5" fill="#8FE0F4" opacity="0.75"/>
    <rect x="46" y="8" width="308" height="3" rx="1.5" className="d2-ceilglow" fill="#CFF3FF" opacity="0.35"/>
    {/* devor qovurg'alari — chekkalarda */}
    <g>
      {[16, 52, 348, 384].map((x, i) => (
        <rect key={i} x={x} y="20" width="16" height="152" rx="4" fill="url(#d2rib)" stroke="#151D30" strokeWidth="1"/>
      ))}
    </g>
    {/* parchin qatorlari */}
    <g fill="#C3B79E" opacity="0.8">
      {[30, 120, 280, 370].map((x) => [30, 100, 160].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5"/>)).flat()}
    </g>
    {/* boshqaruv paneli — o'ng devor */}
    <g transform="translate(314 58)">
      <rect x="0" y="0" width="64" height="80" rx="6" fill="#EFE7D5" stroke="#D0C4AB" strokeWidth="2"/>
      <rect x="7" y="8" width="50" height="18" rx="3" fill="#08111F"/>
      <text x="32" y="22" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill="#6EF29B" opacity="0.9">OK</text>
      <g>
        <circle className="d2-neon" cx="15" cy="42" r="4" fill="#5BD6F2"/>
        <circle className="d2-neon" style={{ animationDelay: '0.6s' }} cx="32" cy="42" r="4" fill="#FFC23C"/>
        <circle className="d2-neon" style={{ animationDelay: '1.1s' }} cx="49" cy="42" r="4" fill="#6EF29B"/>
      </g>
      <rect x="9" y="56" width="46" height="6" rx="3" fill="#26386A"/>
      <rect x="9" y="66" width="30" height="6" rx="3" fill="#26386A"/>
    </g>
    {/* boshqaruv paneli — chap devor */}
    <g transform="translate(22 68)">
      <rect x="0" y="0" width="44" height="58" rx="5" fill="#EFE7D5" stroke="#D0C4AB" strokeWidth="2"/>
      <g>
        <circle className="d2-neon" cx="12" cy="13" r="3.4" fill="#FF7AA8"/>
        <circle className="d2-neon" style={{ animationDelay: '0.5s' }} cx="24" cy="13" r="3.4" fill="#5BD6F2"/>
        <circle className="d2-neon" style={{ animationDelay: '0.9s' }} cx="36" cy="13" r="3.4" fill="#FFC23C"/>
      </g>
      <rect x="8" y="25" width="28" height="6" rx="3" fill="#26386A"/>
      <rect x="8" y="37" width="28" height="6" rx="3" fill="#26386A"/>
      <rect x="8" y="49" width="18" height="6" rx="3" fill="#26386A"/>
    </g>
    {/* tutqichlar (chap/o'ng) */}
    <g stroke="#7E8FA8" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85">
      <path d="M20 152 v-26"/><path d="M380 152 v-26"/>
    </g>
    {/* panjara-pol */}
    <rect x="0" y="182" width="400" height="48" fill="#EAE0CC"/>
    <line x1="0" y1="182" x2="400" y2="182" stroke="#3A4763" strokeWidth="2"/>
    <g stroke="#2A3550" strokeWidth="1.4">
      {[40, 90, 140, 190, 240, 290, 340].map((x) => <line key={x} x1={x} y1="186" x2={x - 12} y2="228"/>)}
      <line x1="0" y1="200" x2="400" y2="200"/><line x1="0" y1="216" x2="400" y2="216"/>
    </g>
  </svg>
);

// --- HOOK SAHNASI: yuk bo'limi + Bit (suzadi) + batareyalar KONTEYNER MARKAZIDAN
// turli yo'nalishga inersiya bilan suzib tarqaladi (per-item --dx/--dy traektoriya,
// --r burchak butun davomida saqlanadi; idle float ICHKI o'rovchida — svg root'da EMAS).
// gathered=true (yetakchi) -> batareyalar kassetaga suzib kelib magnit bilan qulflanadi.
// Markaz (konteyner) ~ (52%, 46%). --dx/--dy = final o'rin bilan markaz orasidagi vektor (cq).
const D2_BOX = { x: 52, y: 46 };
const D2_BATT_SCATTER = [
  { x: 24, y: 30, r: 74,  sp: 8 },  { x: 40, y: 66, r: -58, sp: 11 }, { x: 52, y: 24, r: 96,  sp: 9 },
  { x: 66, y: 62, r: -84, sp: 12 }, { x: 72, y: 30, r: 62,  sp: 8 },  { x: 80, y: 58, r: -72, sp: 10 },
  { x: 86, y: 34, r: 88,  sp: 13 }, { x: 34, y: 48, r: -98, sp: 9 },  { x: 74, y: 46, r: 78,  sp: 11 },
  { x: 30, y: 64, r: -66, sp: 12 }, { x: 90, y: 50, r: 58,  sp: 8 },  { x: 46, y: 20, r: -88, sp: 10 }
];
const D2_BATT_GATHER = Array.from({ length: 10 }).map((_, i) => ({ x: 55 + (i % 2) * 4.6, y: 44 + Math.floor(i / 2) * 6.2, r: 0 }));
const HookScene = ({ gathered = false }) => (
  <div className="d2-scene">
    <CargoHoldBg earth fill/>
    <FloatingDebris/>
    <div className={`d2-scene-bit ${gathered ? 'd2-bit-cheer' : ''}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></div>
    {/* KONTEYNER — qopqog'i ochiladi (batareyalar shundan otiladi) */}
    <span className={`d2-hbox ${gathered ? 'd2-hbox-empty' : ''}`} aria-hidden="true">
      <i className="d2-hbox-lid"/><i className="d2-hbox-body"/>
    </span>
    {D2_BATT_SCATTER.map((p, i) => {
      const isGather = gathered && i < 10;
      const g = isGather ? D2_BATT_GATHER[i] : p;
      return (
        <span key={i} className={`d2-hbatt ${isGather ? 'd2-hbatt-latch' : 'd2-hbatt-burst'}`}
          style={{
            left: `${g.x}%`, top: `${g.y}%`,
            ['--dx']: `${(p.x - D2_BOX.x)}cqw`, ['--dy']: `${(p.y - D2_BOX.y)}cqh`,
            ['--r']: `${isGather ? 0 : p.r}deg`, animationDelay: `${(i % 6) * 0.14}s`
          }}>
          <span className="d2-hbatt-in" style={{ animationDuration: `${p.sp}s`, animationDelay: `${(i % 5) * 0.5}s` }}><BatterySvg/></span>
        </span>
      );
    })}
    {gathered && <span className="d2-hcass g1-pop-in"><span className="d2-hbatt-in" style={{ animationDuration: '9s' }}><CassetteSvg lit className="d2-casssvg-big"/></span></span>}
  </div>
);

// --- NEON-DISPLEY KARTASI (tasvir-4): 34 <-> 30 + 4 (bosib ochish/yig'ish).
const SplitCards = ({ split, done, onTap, disabled }) => (
  <button className={`d2-cardbtn ${!done ? 'd2-tap-pulse' : ''}`} onClick={onTap} disabled={disabled} aria-label="34">
    {!split ? (
      <span className="d2-card g1-pop-in">34</span>
    ) : (
      <span className="d2-splitrow g1-pop-in">
        <span className="d2-card d2-card-tens">30</span>
        <span className="d2-plus">+</span>
        <span className="d2-card d2-card-ones">4</span>
      </span>
    )}
  </button>
);

// --- LYUK-KOD PANELI (tasvir-5, v10 ANIQLIK): bitta g'oya ko'rinsin —
// raqam <-> yuk bog'i. Har raqam ostida o'z belgisi (kasseta/batareya) + ingichka
// ulagich chiziq + AYNAN o'sha raqamga mos yuk-guruh. Panelda raqobatlashuvchi
// harakat YO'Q (lampa statik, yuk suzmaydi) — reveal o'zi audio bilan sinxron.
const HatchDigitCol = ({ d, kind, count }) => (
  <div className={`d2-hcol d2-hcol-${kind}`}>
    <span className="d2-hdigit mono">{d}</span>
    <span className="d2-hicon">{kind === 'tens' ? <CassetteSvg className="d2-mini"/> : <BatterySvg className="d2-mini"/>}</span>
    <i className="d2-hline" aria-hidden="true"/>
    <div className="d2-hcargo">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.35 + i * 0.14}s`, display: 'inline-flex' }}>
          {kind === 'tens' ? <CassetteSvg className="d2-hgc"/> : <BatterySvg className="d2-hgb"/>}
        </span>
      ))}
    </div>
  </div>
);
const HatchPanel = ({ tens, ones, on, tone = 'green' }) => (
  <div className={`d2-panel d2-hpanel ${on ? 'on' : ''}`}>
    <span className={`d2-lamp ${on ? (tone === 'green' ? 'd2-lamp-still-g' : 'd2-lamp-still-y') : ''}`} aria-hidden="true"/>
    {on && (
      <div className="d2-hcols">
        <HatchDigitCol d={tens} kind="tens" count={tens}/>
        <HatchDigitCol d={ones} kind="ones" count={ones}/>
      </div>
    )}
    {!on && <span className="d2-hwait mono">?</span>}
  </div>
);

// --- RAQAM ALMASHISH vizuali (s6 3-qadam): 4 va 5 ko'rinib joy almashadi (yoy bo'ylab),
// so'ng ikkala panel yonma-yon taqqoslash uchun qoladi. Bitta sekin harakat, bir marta.
const SwapDigits = () => (
  <div className="d2-swap" aria-hidden="true">
    <span className="d2-swapchip d2-swapchip-l mono">4</span>
    <span className="d2-swaparrow mono">⇄</span>
    <span className="d2-swapchip d2-swapchip-r mono">5</span>
  </div>
);

// --- YUK-GURUHLARI VIZUALI (masala, v10 ANIQLIK): eski "sirli uzun tayoq" (magnit-rack
// relsi) OLIB TASHLANDI — yuk endi ikki toza yorliqli guruhda: "6" chipli kasseta-guruhi va
// "3" chipli batareya-guruhi. Animatsiya TUSHUNARLI va ketma-ket (audio bilan sinxron):
// yuk-xati "6" qatori yonadi -> kasseta-guruh bir porlaydi; keyin "3" qatori -> batareyalar.
const CargoRackViz = ({ tens = 6, ones = 3, ans = null, withManifest = false }) => {
  const t = useT();
  return (
    <div className="d2-rackwrap">
      {withManifest && (
        <div className="d2-manifest g1-pop-in">
          <span className="d2-manifest-title mono">{t(CONTENT.s12.manifest_label)}</span>
          <span className="d2-manifest-row d2-mrow-1"><b className="mono">6 ×</b> <CassetteSvg className="d2-mini"/></span>
          <span className="d2-manifest-row d2-mrow-2"><b className="mono">3 ×</b> <BatterySvg className="d2-mini"/></span>
        </div>
      )}
      <div className="d2-cargogrps">
        <div className="d2-cgrp d2-cgrp-1">
          <span className="d2-cgrp-chip d2-cgrp-chip-c mono">{tens}</span>
          <div className="d2-cgrp-items">
            {Array.from({ length: tens }).map((_, i) => <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.2 + i * 0.12}s`, display: 'inline-flex' }}><CassetteSvg className="d2-cgrp-cass"/></span>)}
          </div>
        </div>
        <div className="d2-cgrp d2-cgrp-2">
          <span className="d2-cgrp-chip d2-cgrp-chip-b mono">{ones}</span>
          <div className="d2-cgrp-items">
            {Array.from({ length: ones }).map((_, i) => <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.8 + i * 0.12}s`, display: 'inline-flex' }}><BatterySvg className="d2-cgrp-batt"/></span>)}
          </div>
        </div>
        {ans != null && <AnsPop n={ans}/>}
      </div>
    </div>
  );
};

// --- TESKARI SANASH fakt-vizuali (s11): raketa + 10 9 8 raqamlari.
const FactRocket = () => (
  <span className="d2-factrocket" aria-hidden="true">
    <span className="d2-cd mono"><i>10</i><i>9</i><i>8</i></span>
    <RocketSvg className="d2-rocket-fact"/>
  </span>
);

// --- YUKLASH TABLOSI (s14, v10): haqiqiy devor-tablo — qora bezel, montaj boltlari,
// porlovchi sarlavha-chizig'i (til-neytral belgi-ikonkalar), skanline'li displey-oyna.
// AnsPop "= 47" tablo EKRANINING o'zida chiqadi (children ichida).
const TabloBoard = ({ children }) => (
  <div className="d2-tablo">
    <span className="d2-tablo-bolt d2-tb1" aria-hidden="true"/><span className="d2-tablo-bolt d2-tb2" aria-hidden="true"/>
    <span className="d2-tablo-bolt d2-tb3" aria-hidden="true"/><span className="d2-tablo-bolt d2-tb4" aria-hidden="true"/>
    <div className="d2-tablo-head" aria-hidden="true">
      <CassetteSvg className="d2-mini"/>
      <span className="d2-tablo-plus mono">+</span>
      <BatterySvg className="d2-mini"/>
      <i className="d2-tablo-lamp"/>
    </div>
    <div className="d2-tablo-screen">
      {children}
      <i className="d2-tablo-scan" aria-hidden="true"/>
    </div>
  </div>
);

// --- YAKUN (v10, 3 taktli o'qiladigan sekvensiya, CSS-only, holatsiz — animation-delay zanjiri):
// 1) ZARYAD (0-2.5s): kassetalar dvigatel slotlariga suzib dok qiladi, indikator yashilga to'ladi;
// 2) OT OLDIRISH (~2.6s): korpus tebranadi, dvigatel porlashi kuchayadi;
// 3) UCHISH (4s+): illyuminatorda yulduzlar warp-chiziqqa cho'ziladi, sayyora uzoqlashadi.
// Old planda Bit bayram qiladi. reduced-motion -> statik yakuniy holat.
const WarpScene = () => (
  <div className="d2-launchseq" aria-hidden="true">
    <div className="d2-warp-svgwrap d2-hullvib">
      <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid meet" className="d2-warp-svg">
        {/* ichki metal-panel olib tashlandi — porthole atrofdagi d2-scene foni bilan bir xil */}
        <g transform="translate(60 30)">
          <circle cx="60" cy="45" r="52" fill="#1D3159" stroke="#CFC3AA" strokeWidth="8"/>
          <clipPath id="d2warphole"><circle cx="60" cy="45" r="44"/></clipPath>
          <g clipPath="url(#d2warphole)"><circle cx="60" cy="45" r="44" fill="url(#d2space)"/><PortholeSpace warp/></g>
          <g fill="#8494AE">{Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <circle key={i} cx={60 + Math.cos(a) * 48} cy={45 + Math.sin(a) * 48} r="2"/>; })}</g>
        </g>
      </svg>
      <span className="d2-engglow"/>
    </div>
    {/* 1-takt: dvigatel slot-qatori — kassetalar dok qiladi, indikator to'ladi */}
    <div className="d2-engrow">
      <span className="d2-engslots">
        {[0, 1, 2].map(i => (
          <span key={i} className="d2-engslot">
            <span className="d2-engcass" style={{ animationDelay: `${0.2 + i * 0.55}s` }}><CassetteSvg className="d2-engcass-svg"/></span>
          </span>
        ))}
      </span>
      <span className="d2-engbar"><i className="d2-engfill"/></span>
    </div>
    <span className="d2-launch-bit"><span className="g1-cast-fig"><BitSVG state="happy"/></span></span>
  </div>
);

// --- KEMA (sCMP taqqoslash uchun) — kichik yuk kemasi, bort-kodli oyna + yuk ko'rinadi.
const ShipSvg = ({ code, className = '' }) => (
  <svg className={`d2-shipsvg ${className}`} viewBox="0 0 120 78" aria-hidden="true">
    <ellipse cx="60" cy="70" rx="40" ry="5" fill="rgba(0,0,0,0.3)"/>
    <path d="M14 44 Q60 22 106 44 L98 58 Q60 70 22 58 Z" fill="url(#d2ship)" stroke="#6E8496" strokeWidth="2"/>
    <path d="M40 34 Q60 24 80 34 L78 44 Q60 50 42 44 Z" fill="#B8D8EA" stroke="#6E8496" strokeWidth="1.4"/>
    <rect x="46" y="30" width="28" height="12" rx="3" fill="#0C1424"/>
    <text x="60" y="40" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill="#6EF29B">{code}</text>
    <circle className="d2-neon" cx="24" cy="50" r="2.6" fill="#6EF29B"/>
    <circle className="d2-neon" style={{ animationDelay: '0.6s' }} cx="96" cy="50" r="2.6" fill="#FFC23C"/>
    <path d="M40 62 L34 74 M60 66 L60 76 M80 62 L86 74" stroke="#7E93A6" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// sCMP figura: ikki kema (45 va 54) yonma-yon; to'g'ri javobdan KEYIN g'olib kema porlaydi.
const CompareShips = ({ highlight = false }) => (
  <div className="d2-cmp">
    <div className="d2-cmp-ship">
      <ShipSvg code="45"/>
      <CassBattViz tens={4} ones={5} small/>
    </div>
    <span className="d2-cmp-vs mono">?</span>
    <div className={`d2-cmp-ship ${highlight ? 'd2-cmp-win' : ''}`}>
      <ShipSvg code="54"/>
      <CassBattViz tens={5} ones={4} small/>
    </div>
  </div>
);

// sERR ko'rsatkich qatori (readout): son = tens o'nlik + ones birlik (ko'rinadigan matn).
// bad -> nosoz (o'rin almashgan). QuestionScreen variant sifatida ishlatiladi.
const ReadoutRow = ({ n, tens, ones }) => {
  const t = useT();
  const c = CONTENT.sERR;
  return (
    <span className="d2-readout">
      <b className="d2-readout-n mono">{n}</b>
      <i className="d2-readout-eq mono">=</i>
      <span className="d2-readout-part"><b className="mono">{tens}</b> {t(c.tens_word)}</span>
      <span className="d2-readout-part"><b className="mono">{ones}</b> {t(c.ones_word)}</span>
    </span>
  );
};

// --- MC raqam-varianti (katta o'qiladigan son) ---
const NumOpt = ({ v }) => <span className="d2-mcnum">{v}</span>;

// --- Tap-plita (sDIAG sub-savol / bosiladigan son varianti) ---
const TapNum = ({ v }) => <span className="d2-tapnum mono">{v}</span>;

// --- Savol sarlavhasi (QuestionScreen uchun): kichik lead + savol.
const QTitle = ({ title, q }) => (
  <div>
    {title && <p className="d2-qlead">{title}</p>}
    <h2 className="title h-sub" style={{ textAlign: 'center' }}>{q}</h2>
  </div>
);

// --- Suzuvchi chang-zarralar (har ekranda ambient) — reduced-motion'da statik.
const D2Motes = () => (
  <div className="d2-motes" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => <i key={i} className="d2-mote" style={{ animationDelay: `${i * 1.6}s` }}/>)}
  </div>
);

// --- SUZUVCHI DEBRIS (mikrogravitatsiya): zaxira batareyalar, rangli simlar, lampochkalar —
// xaotik suzadi/aylanadi (chalg'ituvchi-o'yin qatlami). aria-hidden, pointer-events yo'q.
// s2 fonidagi suzuvchi rekvizit — batareyaga O'XSHAMAYDI (aldov bo'lmasin): tishli g'ildirak, gayka,
// lampochka, rangli simlar. Faqat haqiqiy yig'iladigan batareyalar batareya ko'rinishida qoladi.
const DEBRIS = [
  { type: 'gear', x: 12, y: 20, s: 22, dur: 12, del: 0,   col: '#9AA6B4' },
  { type: 'bulb', x: 80, y: 26, s: 17, dur: 9,  del: 1.2, col: '#FFC23C' },
  { type: 'wire', x: 62, y: 74, s: 42, dur: 14, del: 0.5, col: '#EC5B8E' },
  { type: 'bolt', x: 86, y: 60, s: 18, dur: 11, del: 2.2, col: '#B8C0CC' },
  { type: 'bulb', x: 26, y: 80, s: 14, dur: 13, del: 1.6, col: '#5BD6F2' },
  { type: 'wire', x: 16, y: 52, s: 36, dur: 15, del: 0.9, col: '#8FF7B6' },
  { type: 'bulb', x: 50, y: 16, s: 13, dur: 10, del: 2.6, col: '#FF7AA8' }
];
const FloatingDebris = () => (
  <div className="d2-debris" aria-hidden="true">
    {DEBRIS.map((d, i) => (
      <span key={i} className="d2-debris-el" style={{ left: `${d.x}%`, top: `${d.y}%`, animationDuration: `${d.dur}s`, animationDelay: `${d.del}s` }}>
        {d.type === 'gear' && (
          <svg viewBox="0 0 24 24" width={d.s} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
              <rect key={k} x="10.7" y="1" width="2.6" height="4.4" rx="0.7" fill={d.col} transform={`rotate(${k * 45} 12 12)`}/>
            ))}
            <circle cx="12" cy="12" r="7.6" fill={d.col}/>
            <circle cx="12" cy="12" r="3.1" fill="#EFE7D4"/>
            <path d="M6 8 A7.6 7.6 0 0 1 12 4.4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
        {d.type === 'bolt' && (
          <svg viewBox="0 0 24 22" width={d.s} aria-hidden="true">
            <polygon points="6,2 18,2 24,11 18,20 6,20 0,11" fill={d.col} stroke="#8A93A0" strokeWidth="1"/>
            <ellipse cx="10" cy="5.5" rx="5" ry="1.6" fill="rgba(255,255,255,0.4)"/>
            <circle cx="12" cy="11" r="4.4" fill="#EFE7D4" stroke="#8A93A0" strokeWidth="1"/>
          </svg>
        )}
        {d.type === 'bulb' && (
          <svg viewBox="0 0 20 26" width={d.s} aria-hidden="true"><circle cx="10" cy="11" r="10" fill={d.col} opacity="0.28"/><circle cx="10" cy="11" r="7" fill={d.col} opacity="0.92"/><rect x="7" y="18" width="6" height="5" rx="1.5" fill="#9AA6B4"/><ellipse cx="7.5" cy="8" rx="2.4" ry="1.5" fill="rgba(255,255,255,0.65)"/></svg>
        )}
        {d.type === 'wire' && (
          <svg viewBox="0 0 46 22" width={d.s} aria-hidden="true"><path d="M3 11 Q 13 -1 23 11 T 43 11" fill="none" stroke={d.col} strokeWidth="3.2" strokeLinecap="round"/><circle cx="3" cy="11" r="2.6" fill="#9AA6B4"/><circle cx="43" cy="11" r="2.6" fill="#9AA6B4"/></svg>
        )}
      </span>
    ))}
  </div>
);

// --- FOYDALI matematik ma'lumot/qoida kartasi (tushuntirish slaydlarida)
const InfoNote = ({ badge, text }) => (
  <div className="d2-infonote fade-up">
    <span className="d2-infonote-badge mono">{badge}</span>
    <p className="d2-infonote-txt">{text}</p>
  </div>
);

// --- v8/v9 KO'PRIK — v9 MATN DIETA: ko'prik EKRANDA ko'rinmaydi (7-8 yosh — matn-devor emas),
// FAQAT OVOZDA qoladi (v8 yetakchi audio-segment/withBridgeAudio o'zgarmagan). Chaqiruv joylari
// saqlangan — metodist qaytarsa, render shu yerda tiklanadi.
const Bridge = () => null;

// brgSeg — custom ekranlar useAudio massivi boshiga qo'shiladigan ALOHIDA ko'prik-segment
// (bir fikr, on_mount; mavjud birinchi segment 'after_previous' ga o'zgartiriladi).
const brgSeg = (key, lang) => ({ id: `${key}_brg`, text: BRIDGES[key][lang], trigger: 'on_mount', waits_for: null });

// withBridgeAudio — screenContent.audio.intro boshiga ko'prikni qo'shadi (yetakchi qisqa fikr).
// QuestionScreen bitta intro-segment o'qigani uchun (infra tegilmaydi) bu ekranlarda ko'prik
// intro boshiga jumla sifatida qo'yiladi; custom ekranlarда esa ALOHIDA segment (useAudio massivi).
const withBridgeAudio = (c, key) => {
  const b = BRIDGES[key];
  if (!b || !c.audio || !c.audio.intro) return c;
  return { ...c, audio: { ...c.audio, intro: { ru: `${b.ru} ${c.audio.intro.ru}`, uz: `${b.uz} ${c.audio.intro.uz}` } } };
};

// --- MC EKRAN o'rami: shuffleMC (qat'iy order) + keep-visible QuestionScreen. v8: ko'prik.
const MCScreen = ({ props, cKey, base, correctIndex, order, figure, fact = null, cols = 2, titleNode = null }) => {
  const c0 = CONTENT[cKey];
  const t = useT();
  const brg = BRIDGES[cKey];
  const { options, correctIdx, content } = shuffleMC(c0, base, correctIndex, order);
  const sc = brg ? withBridgeAudio(content, cKey) : content;   // ko'prik audio-intro boshiga
  const q = titleNode || (
    <div>
      {brg && <Bridge text={t(brg)}/>}
      <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(c0.q)}</h2>
    </div>
  );
  return (
    <QuestionScreen
      screen={props.screen} idx={props.screen} totalScreens={TOTAL_SCREENS}
      screenMeta={SCREEN_META[props.screen]} screenContent={sc}
      question={q}
      figure={figure} options={options} correctIdx={correctIdx} optionsCols={cols}
      factOnCorrect={fact} mascot={false}
      storedAnswer={props.storedAnswer} onAnswer={props.onAnswer}
      onNext={props.onNext} onPrev={props.onPrev}
    />
  );
};

// --- v8 «UCHISHGA TAYYORLIK» shkalasi (dars-ichi element — INFRA/Stage TEGILMAYDI).
// screen indeksidan deterministik: pct = screen / (total - 1); oxirgi slaydda to'la.
// Kontent zonasidan tashqarida (lesson-root darajasida), o'ng chekkada ixcham vertikal
// quvvat-shkala + ko'tarilayotgan mini-raketa. Skrollsiz, pointer-events yo'q; nav/audio/
// javoblar bilan urishmaydi (o'ng gutterда). reduced-motion — statik to'ldirish.
// C — YO'L XARITASI: Yer (past) → Mars → Yupiter → Saturn → Uran → Neptun → Bit uyi (tepa).
// Dars01 = birinchi bosqich (Yer'dan uchish); raketa Yer'dan Mars tomon shu dars davomida ohista suzadi.
const JOURNEY_DOTS = ['#3E8FC4', '#C1543A', '#D9A066', '#D9C48A', '#7FC4D6', '#4A6FB5']; // Yer,Mars,Yupiter,Saturn,Uran,Neptun

// Real ko'rinishli mini-sayyoralar (yo'l xaritasi bekatlari). viewBox 26x24, tana markazi (13,12).
const JourneyPlanet = ({ i, cur, style }) => {
  const u = `jp${i}`;
  const cls = `d2-jplanet ${cur ? 'd2-jplanet-cur' : ''}`;
  const body = (() => {
    switch (i) {
      case 0: // Yer — okean + qit'alar + atmosfera
        return (
          <svg viewBox="0 0 26 24">
            <defs>
              <radialGradient id={`${u}g`} cx="38%" cy="33%" r="78%">
                <stop offset="0%" stopColor="#7FC0EE"/><stop offset="52%" stopColor="#2E74B5"/><stop offset="100%" stopColor="#0B3B6F"/>
              </radialGradient>
              <clipPath id={`${u}c`}><circle cx="13" cy="12" r="9"/></clipPath>
            </defs>
            <circle cx="13" cy="12" r="9" fill={`url(#${u}g)`}/>
            <g clipPath={`url(#${u}c)`}>
              <path d="M6 9 Q9 6.5 11.5 8.5 Q13.5 10.5 10.5 12.5 Q7 14 5 11.5 Z" fill="#43A65C"/>
              <path d="M14.5 6.5 Q18.5 6.5 19.5 9.5 Q17.5 11.5 15 10.5 Q13 8.5 14.5 6.5Z" fill="#4FB868"/>
              <path d="M12.5 15.5 Q15.5 14.5 18 16.5 Q15.5 18.5 12.5 17.5 Z" fill="#43A65C"/>
              <ellipse cx="9" cy="16" rx="4" ry="1.4" fill="rgba(255,255,255,0.5)"/>
            </g>
            <circle cx="13" cy="12" r="9" fill="none" stroke="rgba(150,210,255,0.55)" strokeWidth="0.7"/>
          </svg>
        );
      case 1: // Mars — zangori-qizil + qora dog'lar + qutb qalpog'i
        return (
          <svg viewBox="0 0 26 24">
            <defs>
              <radialGradient id={`${u}g`} cx="38%" cy="33%" r="78%">
                <stop offset="0%" stopColor="#E88A5A"/><stop offset="55%" stopColor="#C1543A"/><stop offset="100%" stopColor="#7E2E1C"/>
              </radialGradient>
              <clipPath id={`${u}c`}><circle cx="13" cy="12" r="9"/></clipPath>
            </defs>
            <circle cx="13" cy="12" r="9" fill={`url(#${u}g)`}/>
            <g clipPath={`url(#${u}c)`}>
              <ellipse cx="10" cy="13" rx="3" ry="2" fill="#9C3F27" opacity="0.6"/>
              <ellipse cx="16" cy="10" rx="2.2" ry="1.5" fill="#9C3F27" opacity="0.55"/>
              <ellipse cx="13" cy="5.2" rx="3.4" ry="1.6" fill="rgba(255,248,240,0.9)"/>
            </g>
          </svg>
        );
      case 2: // Yupiter — gorizontal chiziqlar + qizil dog'
        return (
          <svg viewBox="0 0 26 24">
            <defs>
              <radialGradient id={`${u}g`} cx="40%" cy="34%" r="80%">
                <stop offset="0%" stopColor="#F0DCB8"/><stop offset="60%" stopColor="#D9A066"/><stop offset="100%" stopColor="#A9743E"/>
              </radialGradient>
              <clipPath id={`${u}c`}><circle cx="13" cy="12" r="9"/></clipPath>
            </defs>
            <circle cx="13" cy="12" r="9" fill={`url(#${u}g)`}/>
            <g clipPath={`url(#${u}c)`}>
              <rect x="4" y="7" width="18" height="1.9" fill="#C08A50" opacity="0.7"/>
              <rect x="4" y="11" width="18" height="2.3" fill="#B07C46" opacity="0.65"/>
              <rect x="4" y="15" width="18" height="1.8" fill="#C89A62" opacity="0.7"/>
              <ellipse cx="10" cy="14" rx="2.2" ry="1.5" fill="#C0553A"/>
            </g>
          </svg>
        );
      case 3: // Saturn — och tilla tana + halqa
        return (
          <svg viewBox="0 0 26 24">
            <defs>
              <radialGradient id={`${u}g`} cx="40%" cy="34%" r="80%">
                <stop offset="0%" stopColor="#F3E4B8"/><stop offset="60%" stopColor="#D9C48A"/><stop offset="100%" stopColor="#A88E52"/>
              </radialGradient>
            </defs>
            <g transform="rotate(-18 13 12)">
              <ellipse cx="13" cy="12" rx="12.5" ry="3.4" fill="none" stroke="#C9B77E" strokeWidth="1.8" opacity="0.55"/>
              <path d="M0.7 12 A12.5 3.4 0 0 1 25.3 12" fill="none" stroke="#8F7A44" strokeWidth="0.9" opacity="0.5"/>
              <circle cx="13" cy="12" r="7.6" fill={`url(#${u}g)`}/>
              <path d="M13 4.4 A7.6 7.6 0 0 1 13 19.6 L13 12 Z" fill="#00000018"/>
              <path d="M0.7 12 A12.5 3.4 0 0 0 25.3 12" fill="none" stroke="#EBDCA6" strokeWidth="1.9"/>
            </g>
          </svg>
        );
      case 4: // Uran — och feruza + nozik tik halqa
        return (
          <svg viewBox="0 0 26 24">
            <defs>
              <radialGradient id={`${u}g`} cx="40%" cy="34%" r="80%">
                <stop offset="0%" stopColor="#CFF2EE"/><stop offset="58%" stopColor="#7FC4D6"/><stop offset="100%" stopColor="#4E93A4"/>
              </radialGradient>
            </defs>
            <ellipse cx="13" cy="12" rx="3" ry="9.6" fill="none" stroke="#9FD8DE" strokeWidth="0.8" opacity="0.6"/>
            <circle cx="13" cy="12" r="9" fill={`url(#${u}g)`}/>
            <path d="M13 3 A9 9 0 0 1 13 21 L13 12 Z" fill="#0000000F"/>
          </svg>
        );
      default: // Neptun — to'q ko'k + yorug' chiziq + bo'ron dog'i
        return (
          <svg viewBox="0 0 26 24">
            <defs>
              <radialGradient id={`${u}g`} cx="40%" cy="34%" r="80%">
                <stop offset="0%" stopColor="#6E9BE0"/><stop offset="55%" stopColor="#3D63C0"/><stop offset="100%" stopColor="#1C3480"/>
              </radialGradient>
              <clipPath id={`${u}c`}><circle cx="13" cy="12" r="9"/></clipPath>
            </defs>
            <circle cx="13" cy="12" r="9" fill={`url(#${u}g)`}/>
            <g clipPath={`url(#${u}c)`}>
              <rect x="4" y="10.5" width="18" height="2" fill="#8FB2EC" opacity="0.5"/>
              <ellipse cx="10" cy="14" rx="2.2" ry="1.5" fill="#1B2C6E" opacity="0.7"/>
            </g>
          </svg>
        );
    }
  })();
  return <span className={cls} style={style} aria-hidden="true">{body}</span>;
};

const ReadinessMeter = ({ screen, total, lang }) => {
  const pct = total > 1 ? Math.max(0, Math.min(100, (screen / (total - 1)) * 100)) : 0;
  const label = (READY_LABEL[lang] || READY_LABEL.ru);
  const rocketBottom = ((4 + pct / 100) / 6) * 100;   // Б5: Uran(66.6%) → Neptun(83.3%) oralig`ida
  return (
    <div className="d2-gauge" aria-hidden="true">
      <span className="d2-gauge-label mono">{label}</span>
      <span className="d2-jroute">
        <span className="d2-jhome">🏠</span>
        {JOURNEY_DOTS.map((_, i) => (
          <JourneyPlanet key={i} i={i} cur={i === 4} style={{ bottom: `${(i / 6) * 100}%` }}/>
        ))}
        <span className="d2-gauge-rocket" style={{ bottom: `${rocketBottom}%` }}><RocketSvg flame/></span>
      </span>
    </div>
  );
};

// ============================================================
// SCREEN-KOMPONENTLAR — Dars01 (16 ekran) — o'nliklar va birliklar (Б1, kema ichi, mikrogravitatsiya)
// ============================================================

// s0 — HOOK (prognoz): konteyner ochildi, batareyalar vaznsizlikda suzadi; yetakchi = "o'ntadan kassetaga".
// Xato tanlovga YASHIL "to'g'ri" chiqmaydi — yumshoq on_wrong/on_unknown, keyin Davom ochiladi.
// Bit — sahna ICHIDA (ichki mezbon). Qaytishda picked to'liq reset (useState(null)).
// ============================================================
// SCREEN-KOMPONENTLAR — Dars01 (16 ekran) — 🪐 Energiya sayyorasi, uyga qaytish
// ============================================================

// razryad jadvali (o'nliklar | birliklar ustunlari)
const RazryadTable = ({ tens, ones, tensLabel, onesLabel, emph = null, concrete = false }) => {
  const tensBg = emph === 'tens' ? T.accentSoft : 'transparent';
  const onesBg = emph === 'ones' ? '#EAF6FB' : 'transparent';
  const tensOp = emph === 'ones' ? 0.35 : 1;
  const onesOp = emph === 'tens' ? 0.35 : 1;
  const tr = 'all 0.3s';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: 'min(300px, 92%)', border: `2px solid ${T.ink3}`, borderRadius: 14, overflow: 'hidden', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
      <div style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontSize: 'clamp(11px, 1.7vw, 14px)', color: T.ink2, background: T.bg, borderRight: `1px solid ${T.ink3}`, borderBottom: `1px solid ${T.ink3}`, opacity: tensOp, transition: tr }}>{tensLabel}</div>
      <div style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontSize: 'clamp(11px, 1.7vw, 14px)', color: T.ink2, background: T.bg, borderBottom: `1px solid ${T.ink3}`, opacity: onesOp, transition: tr }}>{onesLabel}</div>
      <div style={{ padding: '8px', textAlign: 'center', fontSize: 'clamp(30px, 6.5vw, 46px)', fontWeight: 800, color: T.accent, borderRight: `1px solid ${T.ink3}`, background: tensBg, opacity: tensOp, transition: tr }}>{tens}</div>
      <div style={{ padding: '8px', textAlign: 'center', fontSize: 'clamp(30px, 6.5vw, 46px)', fontWeight: 800, color: T.blue, background: onesBg, opacity: onesOp, transition: tr }}>{ones}</div>
      {concrete && (
        <>
          <div style={{ padding: '7px 4px', display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end', justifyContent: 'center', borderRight: `1px solid ${T.ink3}`, borderTop: `1px solid ${T.ink3}`, background: tensBg, opacity: tensOp, transition: tr }}>
            {Array.from({ length: tens }).map((_, i) => <span key={i} className="g1-pop-in" style={{ display: 'inline-flex', animationDelay: `${i * 0.05}s` }}><CassetteSvg className="d2-casssvg-btn"/></span>)}
          </div>
          <div style={{ padding: '7px 4px', display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-end', justifyContent: 'center', borderTop: `1px solid ${T.ink3}`, background: onesBg, opacity: onesOp, transition: tr }}>
            {Array.from({ length: ones }).map((_, i) => <span key={i} className="g1-pop-in" style={{ display: 'inline-flex', animationDelay: `${i * 0.05}s` }}><BatterySvg className="d2-battsvg-btn"/></span>)}
          </div>
        </>
      )}
    </div>
  );
};

// son o'qi (0..40): 0->30 o'nliklar (aksent), 30->34 birliklar (ko'k), 34 markeri
const NumberLine = () => {
  const W = 300, H = 74, pad = 18, y = 44, max = 40;
  const x = (v) => pad + (v / max) * (W - 2 * pad);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 'min(320px, 96%)', height: 'auto' }} aria-hidden="true">
      <line x1={x(0)} y1={y} x2={x(max)} y2={y} stroke={T.ink3} strokeWidth="2"/>
      <line x1={x(0)} y1={y} x2={x(30)} y2={y} stroke="#FF4F28" strokeWidth="4" strokeLinecap="round"/>
      <line x1={x(30)} y1={y} x2={x(34)} y2={y} stroke="#019ACB" strokeWidth="4" strokeLinecap="round"/>
      {[0, 10, 20, 30, 40].map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={y - 5} x2={x(v)} y2={y + 5} stroke={T.ink2} strokeWidth="2"/>
          <text x={x(v)} y={y + 19} textAnchor="middle" fontSize="11" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      ))}
      <circle cx={x(34)} cy={y} r="5" fill={T.ink}/>
      <text x={x(34)} y={y - 11} textAnchor="middle" fontSize="15" fontWeight="800" fill={T.ink} fontFamily="'JetBrains Mono', monospace">34</text>
    </svg>
  );
};

// s0 — HOOK: sayyoraga qo'nish, quvvat o'ntalab (picked to'liq reset qaytishda)
// suzuvchi BUYUMLAR (mikrogravitatsiya) — odam ishlatadigan narsalar (sim/buzuq qism EMAS)
const ItemSvg = ({ type, s }) => {
  const w = { width: s, height: 'auto', display: 'block', filter: 'drop-shadow(0 3px 5px rgba(18,24,40,0.4))' };
  if (type === 'mug') return (
    <svg viewBox="0 0 32 32" style={w}>
      <path d="M22 12 q6 0 6 5.5 q0 5.5 -6 5.5" fill="none" stroke="#CFC6B2" strokeWidth="3.4"/>
      <path d="M22 13.4 q4.2 0 4.2 4.1 q0 4.1 -4.2 4.1" fill="none" stroke="#EFE8D8" strokeWidth="1.4"/>
      <rect x="6" y="9" width="16" height="16" rx="3.4" fill="#EFE8D8"/>
      <rect x="6.2" y="9" width="4.6" height="16" rx="2.4" fill="#FFFFFF" opacity="0.42"/>
      <rect x="17.6" y="9" width="4.4" height="16" rx="2.4" fill="#000000" opacity="0.09"/>
      <path d="M6 12.4 h16 v-0.6 a3 3 0 0 0 -3 -2.8 h-10 a3 3 0 0 0 -3 2.8 z" fill="#7A5636"/>
      <ellipse cx="14" cy="10.6" rx="7" ry="1.9" fill="#4A3323"/>
    </svg>
  );
  if (type === 'driver') return (
    <svg viewBox="0 0 32 32" style={w}>
      <g transform="rotate(42 16 16)">
        <rect x="12.4" y="4" width="7.2" height="10.5" rx="3.2" fill="#E0533F"/>
        <rect x="13.2" y="4.4" width="2" height="9.6" rx="1" fill="#FFFFFF" opacity="0.38"/>
        <rect x="17.5" y="4.4" width="2" height="9.6" rx="1" fill="#000000" opacity="0.14"/>
        <rect x="14.2" y="14" width="3.6" height="10.5" fill="#CBD2DA"/>
        <rect x="14.2" y="14" width="1.2" height="10.5" fill="#FFFFFF" opacity="0.55"/>
        <rect x="14.2" y="24.2" width="3.6" height="2.8" fill="#868F9C"/>
      </g>
    </svg>
  );
  if (type === 'tablet') return (
    <svg viewBox="0 0 32 32" style={w}>
      <rect x="7" y="4" width="18" height="24" rx="3.2" fill="#2E3A57" stroke="#1E2740" strokeWidth="1"/>
      <rect x="9" y="7" width="14" height="16.6" rx="1.6" fill="#0C1626"/>
      <rect x="9.7" y="7.7" width="12.6" height="15.2" rx="1" fill="#57B4DE"/>
      <rect x="9.7" y="7.7" width="12.6" height="6.6" rx="1" fill="#8FD8F4" opacity="0.55"/>
      <circle cx="16" cy="25.7" r="1.2" fill="#6A7690"/>
    </svg>
  );
  if (type === 'pencil') return (
    <svg viewBox="0 0 32 32" style={w}>
      <g transform="rotate(40 16 16)">
        <rect x="13" y="6" width="6" height="15" fill="#F2C14E"/>
        <rect x="13" y="6" width="2" height="15" fill="#FFFFFF" opacity="0.3"/>
        <rect x="16.6" y="6" width="2.4" height="15" fill="#000000" opacity="0.15"/>
        <path d="M13 21 h6 l-3 5.4 z" fill="#EAD0A6"/>
        <path d="M14.7 24 h2.6 l-1.3 2.6 z" fill="#2A2A2A"/>
        <rect x="13" y="6" width="6" height="3" fill="#C7CDD4"/>
        <rect x="13" y="3.4" width="6" height="3" rx="1.2" fill="#EC6A5B"/>
      </g>
    </svg>
  );
  return (
    <svg viewBox="0 0 32 32" style={w}>
      <path d="M16 10 c-2 -1.6 -4.4 -1.8 -6.4 -0.6 c-2.8 1.7 -3.6 6 -2 9.8 c1.5 3.6 4.6 6.4 8.4 6.4 c3.8 0 6.9 -2.8 8.4 -6.4 c1.6 -3.8 0.8 -8.1 -2 -9.8 c-2 -1.2 -4.4 -1 -6.4 0.6 z" fill="#D0392E"/>
      <ellipse cx="12" cy="15.5" rx="3.6" ry="5.2" fill="#F0705E" opacity="0.55"/>
      <path d="M16 10 q0.6 -4 4.6 -4.7" fill="none" stroke="#6B4A2A" strokeWidth="1.9" strokeLinecap="round"/>
      <path d="M19.6 5.6 q4.4 -1.7 5.8 1.7 q-3.3 2.5 -6.4 0.2 z" fill="#63A83E"/>
    </svg>
  );
};
const D2_ITEMS = [
  { type: 'mug', x: 10, y: 26, s: 56, dur: 12, del: 0 }, { type: 'driver', x: 77, y: 30, s: 60, dur: 10, del: 1.2 },
  { type: 'tablet', x: 56, y: 66, s: 52, dur: 14, del: 0.5 }, { type: 'pencil', x: 16, y: 62, s: 56, dur: 13, del: 1.6 },
  { type: 'apple', x: 84, y: 55, s: 46, dur: 11, del: 2.2 }, { type: 'apple', x: 42, y: 82, s: 40, dur: 13, del: 0.9 }
];
const FloatingItems = () => (
  <div className="d2-debris" aria-hidden="true">
    {D2_ITEMS.map((d, i) => (
      <span key={i} className="d2-debris-el" style={{ left: `${d.x}%`, top: `${d.y}%`, animationDuration: `${d.dur}s`, animationDelay: `${d.del}s` }}>
        <ItemSvg type={d.type} s={d.s}/>
      </span>
    ))}
  </div>
);

// s0/s15 sahna (Dars03): KOSMIK QUVVAT STANSIYASI — kema qo'nib zaryadlanadi (s0),
// oxirida stansiyadan uchib chiqadi (s15). Б1 ochiq koinot; stansiya = quvvat ombori moslamasi.
const STATION_STARS = [[6, 16, 3], [17, 66, 2], [30, 12, 3], [12, 40, 2], [40, 8, 3], [9, 84, 3], [22, 52, 2], [35, 88, 2], [46, 30, 2], [4, 60, 2], [50, 68, 2], [15, 26, 2]];
// SolarArray — 3D katakli quyosh massivi (oltin ramka + kataklar + porlash-sheen)
const SolarArray = ({ x, y, rot }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x="-2.5" y="-2.5" width="77" height="49" rx="2" fill="#8A6E28"/>
    <rect x="0" y="0" width="72" height="44" fill="url(#stnPanel)"/>
    {[1, 2, 3, 4, 5].map((c) => <line key={`c${c}`} x1={c * 12} y1="0" x2={c * 12} y2="44" stroke="#2E6E9E" strokeWidth="1"/>)}
    {[1, 2].map((r) => <line key={`r${r}`} x1="0" y1={r * 14.6} x2="72" y2={r * 14.6} stroke="#2E6E9E" strokeWidth="1"/>)}
    <polygon points="0,0 26,0 8,44 0,44" fill="#BFE6FA" opacity="0.12"/>
    <rect x="0" y="0" width="72" height="44" fill="none" stroke="#D8B457" strokeWidth="1.6"/>
  </g>
);
// StationScene — BUTUN sahna BITTA SVG (kema + koridor + shlang + stansiya bir o'qda, y=126).
// 3D: silindr/gumbaz gradientlar bilan yumaloq ko'rinadi. Harakat juda YUMSHOQ (d2gentle, aylanishsiz).
const StationScene = ({ departing = false }) => (
  <div className="d2-scene" style={{ background: 'radial-gradient(ellipse at 70% 38%, #1c2b4e 0%, #0c1122 62%, #070b16 100%)' }}>
    <div style={{ position: 'absolute', left: '-8%', top: '-12%', width: '58%', height: '72%', background: 'radial-gradient(ellipse at center, rgba(92,72,164,0.22), transparent 70%)', filter: 'blur(7px)', zIndex: 0, pointerEvents: 'none' }}/>
    <div style={{ position: 'absolute', right: '2%', bottom: '-18%', width: '52%', height: '62%', background: 'radial-gradient(ellipse at center, rgba(38,116,156,0.16), transparent 70%)', filter: 'blur(9px)', zIndex: 0, pointerEvents: 'none' }}/>
    <div style={{ position: 'absolute', left: '-18%', top: '30%', width: '40%', aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle at 64% 30%, #4a6ba0 0%, #24365e 55%, #111a32 100%)', boxShadow: 'inset -12px -12px 30px rgba(0,0,0,0.5), 0 0 26px rgba(90,140,200,0.2)', zIndex: 1, pointerEvents: 'none' }}/>
    {STATION_STARS.map(([x, y, s], i) => (
      <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 1, fontSize: `${s * 3.5}px`, color: i % 3 ? '#EAF2FF' : '#FFD873', textShadow: '0 0 6px currentColor', animation: `g1twinkle ${1.6 + (i % 4) * 0.4}s ease-in-out ${i * 0.14}s infinite`, pointerEvents: 'none' }}>✦</span>
    ))}
    <svg viewBox="0 0 460 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}>
      <defs>
        <linearGradient id="stnCyl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7E8B99"/><stop offset="16%" stopColor="#EEF3F7"/><stop offset="42%" stopColor="#C6D2DC"/><stop offset="100%" stopColor="#66727F"/></linearGradient>
        <linearGradient id="stnCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9C7D4"/><stop offset="45%" stopColor="#E4EBF1"/><stop offset="100%" stopColor="#77848F"/></linearGradient>
        <linearGradient id="stnFoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9A24B"/><stop offset="26%" stopColor="#F3D98C"/><stop offset="56%" stopColor="#D9B45E"/><stop offset="100%" stopColor="#A9832E"/></linearGradient>
        <linearGradient id="stnPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#123B5E"/><stop offset="50%" stopColor="#1E5E8C"/><stop offset="100%" stopColor="#0B2540"/></linearGradient>
        <linearGradient id="stnTank" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8A97A4"/><stop offset="26%" stopColor="#EEF3F7"/><stop offset="58%" stopColor="#C6D2DC"/><stop offset="100%" stopColor="#727F8C"/></linearGradient>
        <linearGradient id="stnRad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4F7FA"/><stop offset="100%" stopColor="#BFC9D2"/></linearGradient>
        <linearGradient id="shipHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8CA0B4"/><stop offset="20%" stopColor="#F0F5F9"/><stop offset="52%" stopColor="#BAC8D5"/><stop offset="100%" stopColor="#6C7A88"/></linearGradient>
        <radialGradient id="shipGlass" cx="38%" cy="30%" r="75%"><stop offset="0%" stopColor="#EAFCFF"/><stop offset="45%" stopColor="#5FC0DE"/><stop offset="100%" stopColor="#245C74"/></radialGradient>
        <linearGradient id="shipFin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9C7D4"/><stop offset="100%" stopColor="#66727F"/></linearGradient>
        <linearGradient id="nozzle" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3A4652"/><stop offset="55%" stopColor="#8A97A4"/><stop offset="100%" stopColor="#4A5662"/></linearGradient>
      </defs>

      {/* ==== STANSIYA (o'ngda, doking porti chapga qaragan, y=126) — juda yumshoq drift ==== */}
      <g style={{ animation: 'd2gentle 13s ease-in-out infinite' }}>
        {/* radiatorlar (hab orqasida) */}
        <g transform="rotate(-7 398 100)"><rect x="384" y="86" width="34" height="18" rx="1.5" fill="url(#stnRad)" stroke="#8A98A6" strokeWidth="1"/><line x1="384" y1="95" x2="418" y2="95" stroke="#B7C2CC" strokeWidth="0.8"/></g>
        <g transform="rotate(7 398 152)"><rect x="384" y="148" width="34" height="18" rx="1.5" fill="url(#stnRad)" stroke="#8A98A6" strokeWidth="1"/><line x1="384" y1="157" x2="418" y2="157" stroke="#B7C2CC" strokeWidth="0.8"/></g>
        {/* fermalar + quyosh massivlari */}
        <line x1="393" y1="122" x2="418" y2="70" stroke="#9AA7B3" strokeWidth="4"/><line x1="395" y1="122" x2="420" y2="70" stroke="#6E7C8A" strokeWidth="1.4"/>
        <line x1="393" y1="130" x2="418" y2="182" stroke="#9AA7B3" strokeWidth="4"/><line x1="395" y1="130" x2="420" y2="182" stroke="#6E7C8A" strokeWidth="1.4"/>
        <SolarArray x={402} y={30} rot={-9}/>
        <SolarArray x={402} y={168} rot={9}/>
        <rect x="384" y="120" width="14" height="12" rx="1" fill="#8A98A6"/>
        {/* HAB SILINDR (3D) — uchki qopqoqlar + tanаsi */}
        <ellipse cx="384" cy="126" rx="9" ry="34" fill="#5E6B78"/>
        <rect x="288" y="92" width="96" height="68" rx="8" fill="url(#stnCyl)" stroke="#5E6B78" strokeWidth="2"/>
        <ellipse cx="288" cy="126" rx="9" ry="34" fill="#B9C7D4" stroke="#5E6B78" strokeWidth="2"/>
        {/* oltin folga sektsiyasi */}
        <rect x="298" y="94" width="30" height="64" fill="url(#stnFoil)" opacity="0.96"/>
        {[100, 108, 116, 124, 132, 140, 148].map((fy) => <line key={fy} x1="298" y1={fy} x2="328" y2={fy} stroke="#9A7726" strokeWidth="0.7" opacity="0.55"/>)}
        {/* qovurg'alar + belbog' */}
        {[340, 352, 364, 374].map((rx) => <line key={rx} x1={rx} y1="95" x2={rx} y2="157" stroke="#9EAAB8" strokeWidth="1.2" opacity="0.6"/>)}
        <rect x="298" y="121" width="86" height="8" fill="#5E6C7A" opacity="0.4"/>
        {/* illyuminatorlar (issiq nur) */}
        {[344, 360].map((cx) => <g key={cx}><circle cx={cx} cy="112" r="6.5" fill="#0C1626" stroke="#5E6B78" strokeWidth="1.4"/><circle cx={cx} cy="112" r="3.4" fill="#FFCE7A"/><circle cx={cx - 1.6} cy="110.4" r="1.1" fill="#FFF3D6"/></g>)}
        {/* handrail (tutqich) */}
        <path d="M336 150 q6 6 12 0" fill="none" stroke="#8A98A6" strokeWidth="1.6"/>
        <text x="358" y="150" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="800" fill="#46545F" letterSpacing="1.5">ORBITA</text>
        {/* antenna tarelka */}
        <g transform="translate(330,92)">
          <line x1="0" y1="0" x2="-2" y2="-15" stroke="#8A98A6" strokeWidth="2.4"/>
          <ellipse cx="-3" cy="-19" rx="15" ry="8" fill="#D3DDE5" stroke="#69788A" strokeWidth="1.6" transform="rotate(-24 -3 -19)"/>
          <ellipse cx="-3" cy="-19" rx="9" ry="4.6" fill="#AEBCC9" transform="rotate(-24 -3 -19)"/>
          <line x1="-3" y1="-19" x2="4" y2="-27" stroke="#8A98A6" strokeWidth="1.4"/><circle cx="4" cy="-27" r="2" fill="#FFC23C"/>
        </g>
        {/* quvvat bloklari (pastda, 3D silindr) */}
        <g transform="translate(310,160)">
          <rect x="0" y="0" width="18" height="40" rx="9" fill="url(#stnTank)" stroke="#727F8C" strokeWidth="1.4"/><rect x="0" y="13" width="18" height="6" fill="#FF7A45"/><rect x="0" y="24" width="18" height="3" fill="#C1381A" opacity="0.7"/>
          <rect x="26" y="0" width="18" height="40" rx="9" fill="url(#stnTank)" stroke="#727F8C" strokeWidth="1.4"/><rect x="26" y="13" width="18" height="6" fill="#FF7A45"/><rect x="26" y="24" width="18" height="3" fill="#C1381A" opacity="0.7"/>
        </g>
        {/* DOKING KONUSI (adapter, hab -> port) */}
        <path d="M252 114 L288 100 L288 152 L252 138 Z" fill="url(#stnCone)" stroke="#5E6B78" strokeWidth="2"/>
        <ellipse cx="252" cy="126" rx="4.5" ry="12" fill="#2A3646" stroke="#8A98A6" strokeWidth="2"/><ellipse cx="252" cy="126" rx="2" ry="6" fill="#0C1626"/>
        {/* xavf-chizig'i + port chirog'i */}
        <path d="M262 108 l6 0 -8 12 6 0 -8 12" fill="none" stroke="#FFB33A" strokeWidth="1.6"/>
        <circle className="d2-neon" cx="254" cy="126" r="2.6" fill="#FF9166"/>
        {/* navigatsiya chiroqlari */}
        <circle className="d2-neon" cx="420" cy="70" r="2.6" fill="#6EF29B"/>
        <circle className="d2-neon" style={{ animationDelay: '0.8s' }} cx="420" cy="182" r="2.6" fill="#FF5A5A"/>
      </g>

      {/* ==== DOKING KORIDORI + QUVVAT KABELI (faqat qo'nganda) ==== */}
      {!departing && (
        <g>
          <rect x="141" y="118" width="112" height="16" rx="3" fill="url(#stnCyl)" stroke="#5E6B78" strokeWidth="1.5"/>
          {[162, 182, 202, 222, 242].map((lx) => <line key={lx} x1={lx} y1="118" x2={lx} y2="134" stroke="#8A98A6" strokeWidth="1.2"/>)}
          <line x1="150" y1="144" x2="252" y2="144" stroke="#7a3a20" strokeWidth="6" strokeLinecap="round"/>
          <line className="d2-neon" x1="150" y1="144" x2="252" y2="144" stroke="#FF9166" strokeWidth="3.4" strokeDasharray="9 8" strokeLinecap="round"/>
          <rect x="145" y="140" width="9" height="9" rx="2" fill="#3A2A20" stroke="#C1381A" strokeWidth="1.3"/>
          <rect x="248" y="140" width="9" height="9" rx="2" fill="#3A2A20" stroke="#C1381A" strokeWidth="1.3"/>
        </g>
      )}

      {/* ==== BIT KEMASI (3D shuttle) — chapda qo'ngan / yuqori-chapda uchayotgan ==== */}
      <g transform={departing ? undefined : 'translate(20,126)'} style={departing ? { animation: 'd2depart 10s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' } : undefined}>
        <g style={{ animation: 'd2gentle2 9s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
        {/* dvigatel alangasi (dumda, faqat uchayotganda) */}
        {departing && <path d="M126 -8 Q174 0 126 8 Q144 0 126 -8 Z" fill="url(#d2flameG)" opacity="0.92" style={{ animation: 'g1pulse 0.4s ease-in-out infinite' }}/>}
        {/* qanotlar (o'rtada, orqaga qaragan) */}
        <path d="M68 -15 L92 -29 L96 -12 Z" fill="url(#shipFin)" stroke="#5E7183" strokeWidth="1"/>
        <path d="M68 15 L92 29 L96 12 Z" fill="url(#shipFin)" stroke="#5E7183" strokeWidth="1"/>
        {/* korpus — chapda uchli burun, o'ngda dum (3D tube) */}
        <path d="M8 -17 Q-14 0 8 17 L100 17 Q111 11 111 0 Q111 -11 100 -17 Z" fill="url(#shipHull)" stroke="#5E7183" strokeWidth="1.8"/>
        <path d="M2 -12 Q44 -20 102 -12" stroke="#FFFFFF" strokeWidth="2.2" opacity="0.5" fill="none" strokeLinecap="round"/>
        {/* dvigatel bo'limi + soplolar (o'ngda) */}
        <rect x="100" y="-14" width="12" height="28" rx="3" fill="#8A97A4" stroke="#5E7183" strokeWidth="1.4"/>
        <path d="M112 -11 L126 -14 L126 -3 L112 -5 Z" fill="url(#nozzle)" stroke="#3A4652" strokeWidth="0.8"/>
        <path d="M112 11 L126 14 L126 3 L112 5 Z" fill="url(#nozzle)" stroke="#3A4652" strokeWidth="0.8"/>
        {/* kokpit oynasi (burun yaqinida) */}
        <circle cx="28" cy="0" r="11" fill="url(#shipGlass)" stroke="#5E7183" strokeWidth="1.5"/>
        <ellipse cx="24" cy="-4" rx="4" ry="2.5" fill="#EAFCFF" opacity="0.7"/>
        {/* registratsiya "45" */}
        <rect x="54" y="-8" width="26" height="16" rx="3" fill="#0B1220"/>
        <text x="67" y="4.5" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill="#6EF29B">45</text>
        {/* doking halqasi (dumda, s0 da koridorga ulanadi) */}
        {!departing && <rect x="124" y="-6" width="10" height="12" rx="2" fill="#B4C2CE" stroke="#5E7183" strokeWidth="1.2"/>}
        </g>
      </g>
    </svg>
    <div className="d2-scene-bit"><span className="g1-cast-fig"><BitSVG state="present"/></span></div>
  </div>
);

// s0 sahna (Dars02, endi ishlatilmaydi): UCHISH BOSHQARUV-DEKI — kema interyeri + illyuminator
const D2_HOOK_CODES = [{ x: 44, y: 8, code: '47', c: '#6EF29B' }, { x: 60, y: 7, code: '63', c: '#FFC23C' }, { x: 75, y: 12, code: '82', c: '#5BD6F2' }];
const FlightDeckScene = () => (
  <div className="d2-scene">
    <CargoHoldBg fill/>
    <FloatingItems/>
    {D2_HOOK_CODES.map((d, i) => (
      <span key={i} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, zIndex: 2, padding: '2px 7px', borderRadius: 5, background: 'rgba(8,17,31,0.92)', border: '1px solid #2c3554', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(13px, 3.4cqw, 20px)', fontWeight: 800, letterSpacing: '0.05em', color: d.c, textShadow: `0 0 8px ${d.c}`, animation: `d2neon 1.6s ease-in-out ${i * 0.4}s infinite` }}>{d.code}</span>
    ))}
    <div className="d2-scene-bit"><span className="g1-cast-fig"><BitSVG state="present"/></span></div>
  </div>
);

// ============================================================
// DARS03 qayta ishlatiladigan Stage-komponentlar (OmborRaf mexanikasi)
// TeachStage — sof tushuntirish · MCStage — veди-до-верного variant · BuildStage — kod ter
// ============================================================
const TeachStage = ({ props, cKey, figure, body = null, info = null }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[cKey];
  const audio = useAudio([
    brgSeg(cKey, lang),
    ...c.audio[lang].map((text, i) => ({ id: `${cKey}_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAdv = useAdvanceGate(true, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {body && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 2vw, 17px)', textAlign: 'center', lineHeight: 1.55 }}>{t(body)}</p>}
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          {figure(audio)}
        </div>
        {info && <InfoNote badge={t(c.info_badge)} text={t(info)}/>}
      </div>
    </Stage>
  );
};

// Ko'p-raund yordamchilari: raund-nuqtalar + «Keyingi misol» tugmasi (ketma-ket ochilish)
const NEXT_EX = { ru: 'Следующий пример', uz: 'Keyingi misol' };
const RoundDots = ({ ri, total }) => (
  <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7 }}>
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: i < ri ? T.success : (i === ri ? T.accent : T.ink3), transition: 'all .3s' }}/>
    ))}
  </div>
);
const NextExBtn = ({ onClick, label }) => (
  <button className="fade-up" onClick={onClick} style={{ alignSelf: 'center', padding: 'clamp(9px,1.6vw,12px) clamp(20px,3.4vw,30px)', fontSize: 'clamp(14px,2vw,16px)', fontWeight: 800, fontFamily: "'Manrope', sans-serif", background: T.accent, color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>{label} →</button>
);

const MCStage = ({ props, cKey, figure = null, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const isArr = Array.isArray(c.audio[lang]);
  const audio = useAudio(isArr
    ? [brgSeg(cKey, lang), ...c.audio[lang].map((text, i) => ({ id: `${cKey}_${i}`, text, trigger: 'after_previous', waits_for: null }))]
    : [brgSeg(cKey, lang), { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]
  );
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const [wrong, setWrong] = useState(() => new Set());
  const [solved, setSolved] = useState(false);
  const cur = rounds[ri];
  const correctIdx = cur.opts.findIndex((o) => o.ok);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const attemptsRef = useRef(0);
  const revealRef = useRevealScroll(solved, 400);
  const report = (correct) => {
    if (!props.onAnswer) return;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: t(cur.q || c.lead), options: cur.opts.map((o) => o[lang]), correctIndex: correctIdx, correctAnswer: cur.opts[correctIdx][lang], studentAnswerIndex: null, studentAnswer: null, correct, firstTry: correct, attempts: attemptsRef.current, solved: true });
  };
  const nextRound = () => { setRi((r) => r + 1); setWrong(new Set()); setSolved(false); attemptsRef.current = 0; };
  const pick = (i, ok) => {
    if (!canAct || solved || wrong.has(i)) return;
    attemptsRef.current += 1;
    if (ok) {
      sfx.playCorrect();
      const ft = wrong.size === 0;
      setSolved(true);
      if (meta.scored) report(ft);
      if (!audio.muted) {
        const e = getAudioEngine();
        if (e) {
          if (!isArr && c.audio.on_correct) e.pushOneOff(c.audio.on_correct[lang]);
          if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]);
        }
      }
    } else {
      sfx.playWrong();
      setWrong((w) => new Set(w).add(i));
      if (!audio.muted && !isArr && c.audio.on_wrong) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const hasSep = c.lead && cur.q;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead || cur.q)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {figure && (
          <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
            {figure(cur, audio, { solved, sign: solved && correctIdx >= 0 ? t(cur.opts[correctIdx]) : null })}
          </div>
        )}
        {hasSep && <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.ink2, fontSize: 'clamp(14px, 2vw, 16px)', textAlign: 'center' }}>{t(cur.q)}</p>}
        <div key={`o${ri}`} className="fade-up" style={{ display: 'grid', gridTemplateColumns: cur.opts.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10, width: '100%' }}>
          {cur.opts.map((o, i) => { const lab = t(o); const isSign = lab.length <= 2; return (
            <button key={i} className={`option ${solved && o.ok ? 'option-correct' : ''} ${wrong.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || solved || wrong.has(i)} onClick={() => pick(i, !!o.ok)}
              style={{ padding: 'clamp(10px,1.7vw,13px) clamp(12px,2.2vw,18px)', fontSize: isSign ? 'clamp(22px,4.4vw,32px)' : 'clamp(14px,2.1vw,17px)', fontWeight: isSign ? 800 : 700, fontFamily: isSign ? "'JetBrains Mono', monospace" : "'Source Serif 4', serif", minHeight: 'clamp(46px,7vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{lab}</button>
          ); })}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};

const BuildStage = ({ props, cKey, header = null }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [{ target: c.target }];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const [tens, setTens] = useState(null);
  const [ones, setOnes] = useState(null);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const cur = rounds[ri];
  const target = cur.target;
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const attemptsRef = useRef(0);
  const revealRef = useRevealScroll(solved, 400);
  const slot = tens === null ? 'tens' : (ones === null ? 'ones' : null);
  const place = (d) => {
    if (!canAct || solved) return;
    if (wrong) setWrong(false);
    if (tens === null) setTens(d);
    else if (ones === null) setOnes(d);
  };
  const clear = () => { if (solved) return; setTens(null); setOnes(null); setWrong(false); };
  const nextRound = () => { setRi((r) => r + 1); setTens(null); setOnes(null); setWrong(false); setSolved(false); attemptsRef.current = 0; };
  const check = () => {
    if (!canAct || solved || tens === null || ones === null) return;
    attemptsRef.current += 1;
    if (tens === target[0] && ones === target[1]) {
      sfx.playCorrect();
      const ft = !wrong && attemptsRef.current === 1;
      setSolved(true);
      if (meta.scored && props.onAnswer) props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: t(c.q), options: null, correctIndex: null, correctAnswer: String(target[0] * 10 + target[1]), studentAnswerIndex: null, studentAnswer: `${tens}${ones}`, correct: ft, firstTry: ft, attempts: attemptsRef.current, solved: true });
    } else {
      sfx.playWrong();
      setWrong(true);
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && ri === 0 && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {header && <div key={ri} className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center' }}>{header(cur)}</div>}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 16px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <OmborRaf tens={tens || 0} ones={ones || 0} tensLabel={t(c.tens_label)} onesLabel={t(c.ones_label)} emph={slot} showEq={solved} code={solved ? target[0] * 10 + target[1] : null}/>
          {!solved && (
            <>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 300 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
                  <button key={d} className="option" disabled={!canAct || slot === null} onClick={() => place(d)}
                    style={{ width: 'clamp(38px,8.6vw,48px)', height: 'clamp(42px,8.6vw,50px)', fontSize: 'clamp(19px,4.2vw,25px)', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="option" disabled={!canAct || (tens === null && ones === null)} onClick={clear}
                  style={{ padding: 'clamp(8px,1.5vw,11px) clamp(14px,2.4vw,18px)', fontSize: 'clamp(15px,2vw,18px)', fontWeight: 700 }}>↺</button>
                <button className="option" disabled={!canAct || tens === null || ones === null} onClick={check}
                  style={{ padding: 'clamp(9px,1.6vw,12px) clamp(18px,3vw,26px)', fontSize: 'clamp(14px,2vw,16px)', fontWeight: 800, background: T.accent, color: '#fff', border: 'none' }}>{t(c.check_label)}</button>
              </div>
            </>
          )}
        </div>
        {wrong && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
      </div>
    </Stage>
  );
};

const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const ok = picked === 1;
  const fbKey = (i) => (i === 1 ? 'on_correct' : (i === 0 ? 'on_wrong' : 'on_unknown'));
  const pick = (i) => {
    if (picked !== null || !canAct) return;
    setPicked(i);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio[fbKey(i)][lang]); }
  };
  const canAdv = useAdvanceGate(picked !== null, audio);
  const navContent = (
    <>
      {props.screen > 0 && <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>}
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const opts = [c.opt0, c.opt1, c.opt2];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <UranScene shown={picked !== null}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: opts.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(12px, 2vw, 16px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span>{t(opts[picked])}</span>
            </button>
          </div>
        )}
        {picked !== null && (
          <FeedbackBlock show={true} isCorrect={ok} wrongClass="frame-tip">
            <Reaction state={ok ? 'correct' : 'wrong'} praise={t(c.audio[fbKey(picked)])}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s1 — TUSHUNTIRISH-1: razryad raflari (kasseta=o'nlik / batareya=birlik)
const Screen1 = (props) => {
  const t = useT();
  const c = CONTENT.s1;
  return (
    <TeachStage props={props} cKey="s1" body={c.body} info={c.info}
      figure={() => (
        <LineFig type="line"/>
      )}
    />
  );
};

// s2 — OCHILISH-1: tap-to-cassette — 10 batareyani kassetaga
// batareyalar markazdagi kasseta ATROFIDA halqa bo'lib joylashadi (markaz bo'sh — kasseta uchun)
// ambient-deka: o'qish ekranlari chetlarini to'ldiruvchi suzuvchi buyumlar (mikrogravitatsiya)
const D2_DECK = [
  { type: 'clip', x: 7, y: 28, s: 48, dur: 12, del: 0 }, { type: 'pencil', x: 13, y: 70, s: 44, dur: 13, del: 1.4 },
  { type: 'mug', x: 90, y: 26, s: 48, dur: 11, del: 0.6 }, { type: 'apple', x: 91, y: 68, s: 38, dur: 12, del: 1.8 }
];
const AmbientDeck = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', opacity: 0.6 }}>
    {D2_DECK.map((f, i) => (
      <span key={i} style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, transform: 'translate(-50%,-50%)', animation: `d2hover ${f.dur}s ease-in-out ${f.del}s infinite` }}>
        <ItemSvg type={f.type} s={f.s}/>
      </span>
    ))}
  </div>
);

// KATTA KOSMIK ESHIK (airlock) — o'qish sahnasi: yonida kod-tablo turadi (filmlardek). To'g'ri kod -> eshik ochiladi.
const DOOR_STARS = [[24, 34], [48, 30], [64, 50], [38, 66], [56, 92], [30, 104], [70, 80], [44, 116]];
const BigDoor = ({ unlocked = false }) => (
  <svg viewBox="0 0 100 150" style={{ width: 'clamp(80px, 21vw, 124px)', height: 'auto', display: 'block', flexShrink: 0, filter: 'drop-shadow(0 4px 8px rgba(18,24,40,0.4))' }} aria-hidden="true">
    <rect x="3" y="3" width="94" height="144" rx="9" fill="#28324b" stroke="#161d2e" strokeWidth="3"/>
    <clipPath id="d2doorclip"><rect x="10" y="22" width="80" height="114" rx="3"/></clipPath>
    <g clipPath="url(#d2doorclip)">
      <rect x="10" y="22" width="80" height="114" fill="#0a1120"/>
      {DOOR_STARS.map(([x, y], i) => <circle key={i} className="d2-star" style={{ animationDelay: `${(i % 5) * 0.5}s` }} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} fill="#DCEAF8"/>)}
    </g>
    <g style={{ transition: 'transform .7s cubic-bezier(.5,0,.2,1)' }} transform={unlocked ? 'translate(-16 0)' : ''}>
      <rect x="11" y="22" width="38" height="114" rx="2" fill="url(#d2metal)" stroke="#5a6788" strokeWidth="1.4"/>
      <rect x="15" y="30" width="30" height="45" rx="2" fill="#3b4568" opacity="0.7"/>
      <rect x="15" y="83" width="30" height="45" rx="2" fill="#3b4568" opacity="0.7"/>
      <circle cx="44" cy="79" r="2.2" fill="#6b7899"/>
    </g>
    <g style={{ transition: 'transform .7s cubic-bezier(.5,0,.2,1)' }} transform={unlocked ? 'translate(16 0)' : ''}>
      <rect x="51" y="22" width="38" height="114" rx="2" fill="url(#d2metal)" stroke="#5a6788" strokeWidth="1.4"/>
      <rect x="55" y="30" width="30" height="45" rx="2" fill="#3b4568" opacity="0.7"/>
      <rect x="55" y="83" width="30" height="45" rx="2" fill="#3b4568" opacity="0.7"/>
      <circle cx="56" cy="79" r="2.2" fill="#6b7899"/>
    </g>
    <rect x="12" y="12" width="76" height="7" fill="#FFC23C"/>
    <g stroke="#1E273E" strokeWidth="2.6">{[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <path key={i} d={`M${13 + i * 8.5} 12 l4.5 7`}/>)}</g>
    <circle className={unlocked ? '' : 'd2-neon'} cx="50" cy="141" r="3.4" fill={unlocked ? '#6EF29B' : '#E0533F'} style={{ transition: 'fill .4s' }}/>
  </svg>
);

// s2 — OCHILISH-1 (FAOL O'QISH, yumaloq/nol): kod 40 -> «qirq»; nol o'qilmaydi, lekin yoziladi
// s2 — TUSHUNTIRISH-2 (ishlab ko'rsatish): 45 -> 40 + 5, audio bo'yicha bosqichma-bosqich yig'iladi
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s2_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (seg === 's2_1') setStep((s) => Math.max(s, 1));
    else if (seg === 's2_2') setStep((s) => Math.max(s, 2));
    else if (seg === 's2_3') setStep((s) => Math.max(s, 3));
  }, [seg]);
  const reveal = step >= 2 ? 2 : (step >= 1 ? 1 : 0);   // s2_1 → idishlarga ulash, s2_2 → tenglama
  const done = step >= 3;
  const revealRef = useRevealScroll(done, 500);
  const canAdv = useAdvanceGate(true, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(200px, 46vw, 280px)' }}>
          <LineFig type="ray" hi={reveal >= 2}/>
        </div>
        {done && <div ref={revealRef}><InfoNote badge={t(c.info_badge)} text={t(c.info)}/></div>}
      </div>
    </Stage>
  );
};

// s3 — OCHILISH-2 (FAOL YOZISH): nomdan kod terish — Bit «ellik uch» deydi, bola raqam-plita bilan 53 ni yozadi
// s3 — QOIDA: razryadli qo'shiluvchilar (45 = 40 + 5) + farqlash-cheki (веди-до-верного)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s3_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const ruleActive = seg === 's3_1' || seg === 's3_3';
  const canAct = useCanAnswer(audio);
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(false);
  const revealRef = useRevealScroll(done, 500);
  const pick = (i, ok) => {
    if (!canAct || done || wrong.has(i)) return;
    if (ok) { sfx.playCorrect(); setDone(true); }
    else { sfx.playWrong(); setWrong((w) => new Set(w).add(i)); }
  };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <div className="fade-up" style={{ position: 'relative', background: '#FFF8EC', border: `2px solid ${T.accent}`, borderRadius: 16, margin: '8px 0 0', padding: 'clamp(15px, 2.8vw, 20px)', boxShadow: ruleActive ? `0 0 0 4px ${T.accentSoft}` : '0 4px 14px -6px rgba(255,79,40,0.25)', transform: ruleActive ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.3s ease' }}>
          <span style={{ position: 'absolute', top: -12, left: 16, background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(11px,1.7vw,13px)', letterSpacing: '.04em', padding: '3px 12px', borderRadius: 999 }}>{lang === 'uz' ? 'QOIDA' : 'ПРАВИЛО'}</span>
          <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 'clamp(15px,2.3vw,19px)', color: T.ink, lineHeight: 1.5 }}>{t(c.rule)}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LineFig type="line" hi={done}/>
        </div>
        <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.ink2, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(c.check_q)}</p>
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: c.opts.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10, width: '100%' }}>
          {c.opts.map((o, i) => (
            <button key={i} className={`option ${done && o.ok ? 'option-correct' : ''} ${wrong.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || done || wrong.has(i)} onClick={() => pick(i, !!o.ok)}
              style={{ padding: 'clamp(9px,1.6vw,12px)', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", minHeight: 'clamp(46px,7vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{t(o)}</button>
          ))}
        </div>
        {wrong.size > 0 && !done && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.wrong)}/></div>}
        {done && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(c.check_ok)}/></div>}
      </div>
    </Stage>
  );
};

// s4 — OCHILISH-3 (razryad kartasi): 34 -> o'nlik|birlik; 34 = 30 + 4
// REAL-VAQT: ovoz o'zi ketma-ket yangraydi; ustunlar ovozga sinxron yonadi, tenglama o'zi yig'iladi (tugma yo'q).
// KOD-TABLO (Dars02 o'z mexanikasi): boshqaruv minorasi displeyi — ikki raqam-xona (rang-kod),
// yorliqlar + pastda nom. Kasseta/batareya YO'Q (o'qish/yozish darsi, place-value emas).
const CodeTablo = ({ tens, ones, tensLabel, onesLabel, emph = null, name = null }) => {
  const tHi = emph === 'tens', oHi = emph === 'ones';
  const CBG = 'linear-gradient(180deg,#0e1526,#1a2340)';
  const cell = (v, color, glow, hi, dim) => (
    <div style={{ background: CBG, padding: 'clamp(10px,2.4vw,16px)', textAlign: 'center', lineHeight: 1, fontSize: 'clamp(52px,13vw,84px)', fontWeight: 800, color, textShadow: hi ? `0 0 20px ${glow}` : `0 0 7px ${glow}`, opacity: dim ? 0.4 : 1, transition: 'all .3s', fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
  );
  const lab = (txt, dim) => (
    <div style={{ background: CBG, padding: '7px 4px', textAlign: 'center', fontSize: 'clamp(10px,1.8vw,13px)', fontWeight: 800, letterSpacing: '.02em', color: '#8fa0c0', textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: dim ? 0.4 : 1, transition: 'all .3s' }}>{txt}</div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px,1.8vw,12px)' }}>
      {/* grid-gap chiziqlari: 2px gap orqali konteyner foni (#2c3554) ko'rinadi -> qator/ustun ajratgichlari ANIQ tekis tushadi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: 'min(360px,96%)', borderRadius: 16, overflow: 'hidden', border: '2px solid #2c3554', background: '#2c3554', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
        {lab(tensLabel, oHi)}{lab(onesLabel, tHi)}
        {cell(tens, '#FF9166', 'rgba(255,138,92,.85)', tHi, oHi)}
        {cell(ones, '#5BD6F2', 'rgba(91,214,242,.85)', oHi, tHi)}
      </div>
      {name && <span className="title g1-pop-in" style={{ fontSize: 'clamp(19px,3.6vw,26px)', fontWeight: 700, color: T.ink }}>{name}</span>}
    </div>
  );
};

// ============================================================
// OmborRaf — Dars03 star-vizual: kodni ikki razryad-RAFIGA ajratish.
// O'nlik rafi = kasseta bloklari (10 li), birlik rafi = batareya birliklari (1 li).
// tensCap/onesCap berilsa — bo'sh (dashed) slotlar ko'rsatiladi (nechta joylash kerak).
// emph — dual-coding (audio aytayotgan razryadni yoritadi). showEq — 45 = 40 + 5.
// ============================================================
const OmborKasseta = () => (
  <div style={{ width: 'clamp(20px,4.6vw,26px)', height: 'clamp(42px,9vw,54px)', borderRadius: 4, background: 'linear-gradient(180deg,#FF7A55,#FF4F28)', border: '1.5px solid #C1381A', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '4px 3px', boxShadow: '0 2px 5px rgba(193,56,26,0.4)', flexShrink: 0 }}>
    {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.55)' }}/>)}
  </div>
);
const OmborBatareya = () => (
  <div style={{ position: 'relative', width: 'clamp(13px,3vw,17px)', height: 'clamp(24px,5vw,30px)', borderRadius: 3, background: 'linear-gradient(180deg,#33B8E3,#019ACB)', border: '1.5px solid #0B7BA3', boxShadow: '0 2px 4px rgba(11,123,163,0.4)', flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 6, height: 4, borderRadius: '2px 2px 0 0', background: '#0B7BA3' }}/>
  </div>
);
const OmborRaf = ({ tens = 0, ones = 0, tensLabel, onesLabel, tensCap = null, onesCap = null, emph = null, code = null, showEq = false }) => {
  const tHi = emph === 'tens', oHi = emph === 'ones';
  const total = code != null ? code : tens * 10 + ones;
  const shelf = (items, cap, count, label, color, soft, dim, hi, unit) => (
    <div style={{ opacity: dim ? 0.45 : 1, transition: 'all .3s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ minWidth: 'clamp(56px,12vw,72px)', fontSize: 'clamp(10px,1.8vw,13px)', fontWeight: 800, letterSpacing: '.02em', textTransform: 'uppercase', color, textAlign: 'right', paddingBottom: 6 }}>{label}</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: unit === 'ten' ? 'clamp(5px,1.4vw,9px)' : 'clamp(4px,1vw,6px)', minHeight: 'clamp(46px,10vw,58px)', padding: '0 4px 6px', borderBottom: `3px solid ${hi ? color : '#C9C6BE'}`, transition: 'border-color .3s', flexWrap: 'wrap' }}>
          {items}
          {cap != null && Array.from({ length: Math.max(0, cap - count) }).map((_, i) => (
            <div key={'g' + i} style={{ width: unit === 'ten' ? 'clamp(20px,4.6vw,26px)' : 'clamp(13px,3vw,17px)', height: unit === 'ten' ? 'clamp(42px,9vw,54px)' : 'clamp(24px,5vw,30px)', borderRadius: 4, border: `2px dashed ${color}`, opacity: 0.3, flexShrink: 0 }}/>
          ))}
        </div>
        <div style={{ minWidth: 'clamp(40px,9vw,52px)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(20px,4.4vw,28px)', color, background: hi ? soft : 'transparent', borderRadius: 8, padding: '2px 4px', transition: 'all .3s' }}>{unit === 'ten' ? count * 10 : count}</div>
      </div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2.2vw,14px)', width: 'min(400px,98%)' }}>
      {shelf(Array.from({ length: tens }).map((_, i) => <span key={i} className="g1-pop-in" style={{ display: 'inline-flex' }}><CassetteSvg className="d2-casssvg-btn"/></span>), tensCap, tens, tensLabel, '#FF4F28', '#FFE8E1', oHi, tHi, 'ten')}
      {shelf(Array.from({ length: ones }).map((_, i) => <span key={i} className="g1-pop-in" style={{ display: 'inline-flex' }}><BatterySvg className="d2-battsvg-btn"/></span>), onesCap, ones, onesLabel, '#019ACB', '#E1F3FB', tHi, oHi, 'one')}
      {showEq && (
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px,1.6vw,10px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px,5vw,32px)', marginTop: 2 }}>
          <span style={{ color: T.ink }}>{total}</span>
          <span style={{ color: T.ink3 }}>=</span>
          <span style={{ color: '#FF4F28' }}>{tens * 10}</span>
          <span style={{ color: T.ink3 }}>+</span>
          <span style={{ color: '#019ACB' }}>{ones}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// FuelTank + TankCompare — Dars04 star-vizual: ikki quvvat bloki (son + to'lish darajasi:
// katta son = to'laroq -> taqqoslash intuitsiyasi). O'rtada > < = belgi sloti.
// Raqamlar rang-kodli: o'nlik #FF4F28 (sariq-qizil), birlik #019ACB (ko'k).
// ============================================================
const FuelTank = ({ code, emph = false, dim = false, emphDigit = null }) => {
  const tens = Math.floor(code / 10), ones = code % 10;
  const fill = Math.max(9, code);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: dim ? 0.5 : 1, transition: 'all .3s', flexShrink: 0 }}>
      <div style={{ width: 'clamp(20px,4vw,28px)', height: 'clamp(5px,1.1vw,7px)', borderRadius: '3px 3px 0 0', background: emph ? T.success : '#7E8B99', transition: 'all .3s' }}/>
      <div style={{ position: 'relative', width: 'clamp(58px,14vw,84px)', height: 'clamp(90px,21vw,126px)', borderRadius: 12, border: `3px solid ${emph ? T.success : '#7E8B99'}`, background: '#1E252E', overflow: 'hidden', boxShadow: emph ? `0 0 0 4px ${T.successSoft}` : 'inset 0 2px 8px rgba(0,0,0,0.45)', transition: 'all .3s' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${fill}%`, background: 'linear-gradient(180deg,#8DF5B0,#25C06A 55%,#0E9E53)', transition: 'height .5s ease', boxShadow: '0 0 14px rgba(45,200,110,0.55)' }}/>
        {[25, 50, 75].map((y) => <div key={y} style={{ position: 'absolute', left: 4, right: 4, bottom: `${y}%`, height: 1, background: 'rgba(255,255,255,0.16)' }}/>)}
        <svg viewBox="0 0 24 24" style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 'clamp(13px,2.8vw,17px)', opacity: 0.55 }} aria-hidden="true"><path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" fill="#FFE08A"/></svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(25px,6.2vw,40px)', fontWeight: 800, textShadow: '0 2px 5px rgba(0,0,0,0.65)' }}>
          <span style={{ color: '#FF9166', opacity: emphDigit === 'ones' ? 0.35 : 1, transition: 'opacity .3s' }}>{tens}</span>
          <span style={{ color: '#5BD6F2', opacity: emphDigit === 'tens' ? 0.35 : 1, transition: 'opacity .3s' }}>{ones}</span>
        </div>
      </div>
    </div>
  );
};
const TankCompare = ({ a, b, sign = null, emph = null, emphDigit = null }) => {
  const win = emph || (sign === '>' ? 'a' : sign === '<' ? 'b' : null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px,2.6vw,20px)' }}>
      <FuelTank code={a} emph={win === 'a'} dim={win === 'b'} emphDigit={emphDigit}/>
      <div style={{ minWidth: 'clamp(50px,11vw,68px)', height: 'clamp(50px,11vw,68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {sign ? (
          <span key={sign} className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', borderRadius: 14, background: T.successSoft, border: `3px solid ${T.success}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(28px,6.6vw,44px)', fontWeight: 800, color: T.success, boxShadow: `0 0 0 4px ${T.successSoft}` }}>{sign}</span>
        ) : (
          <span style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(44px,10.5vw,66px)', fontWeight: 800, color: T.ink3, animation: 'd2signflip 2.6s ease-in-out infinite' }}>{'<'}</span>
        )}
      </div>
      <FuelTank code={b} emph={win === 'b'} dim={win === 'a'} emphDigit={emphDigit}/>
    </div>
  );
};

// ============================================================
// ChargeGauge — Dars05 star-vizual: 10-segmentli zaryad shkalasi (har segment = 10),
// pastda son (o'nlik sariq / birlik ko'k). count 0..100. emph = yashil ramka.
// ChargeSeq — o'nlab ketma-ketlik: son-chiplar qatori, biri "?" (yetishmagan) -> javob.
// ============================================================
const ChargeGauge = ({ count = 0, emph = false }) => {
  const segs = Math.max(0, Math.min(10, Math.round(count / 10)));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px,1.8vw,12px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: 6, borderRadius: 12, border: `3px solid ${emph ? T.success : '#7E8B99'}`, background: '#1E252E', boxShadow: emph ? `0 0 0 4px ${T.successSoft}` : 'inset 0 2px 8px rgba(0,0,0,0.4)', transition: 'all .3s' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width: 'clamp(9px,2.1vw,15px)', height: 'clamp(34px,8vw,52px)', borderRadius: 3, background: i < segs ? 'linear-gradient(180deg,#8DF5B0,#25C06A)' : '#2b333d', boxShadow: i < segs ? '0 0 7px rgba(45,200,110,0.55)' : 'none', transition: 'all .3s' }}/>
        ))}
        <div style={{ width: 6, height: 'clamp(16px,4vw,24px)', borderRadius: '0 3px 3px 0', background: '#7E8B99', marginLeft: 2 }}/>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(30px,7vw,48px)', lineHeight: 1 }}>
        {count === 0 ? <span style={{ color: T.ink3 }}>0</span> : <><span style={{ color: '#FF7A45' }}>{count / 10}</span><span style={{ color: '#5BD6F2' }}>0</span></>}
      </span>
    </div>
  );
};
const ChargeChip = ({ n, missing, ans }) => {
  const solved = missing && ans != null;
  const shown = missing ? (solved ? ans : null) : n;
  return (
    <div style={{ minWidth: 'clamp(42px,9.5vw,62px)', height: 'clamp(46px,10vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(20px,4.6vw,30px)', padding: '0 6px', transition: 'all .3s',
      background: missing ? (solved ? T.successSoft : '#EEF2F6') : 'linear-gradient(180deg,#0e1526,#1a2340)',
      color: missing ? (solved ? T.success : T.ink3) : '#E4ECF6',
      border: missing ? `2.5px ${solved ? 'solid' : 'dashed'} ${solved ? T.success : '#A7A6A2'}` : '2px solid #2c3554' }}>
      {shown != null ? shown : '?'}
    </div>
  );
};
const ChargeSeq = ({ seq, missing = -1, ans = null }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px,1.2vw,9px)', flexWrap: 'wrap' }}>
    {seq.map((n, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ color: T.ink3, fontWeight: 700, fontSize: 'clamp(15px,2.6vw,20px)' }}>›</span>}
        <span className={i === missing && ans != null ? 'g1-pop-in' : ''}><ChargeChip n={n} missing={i === missing} ans={i === missing ? ans : null}/></span>
      </React.Fragment>
    ))}
  </div>
);

// NumberLine — Dars06 star-vizual: 0..100 son o'qi (o'nlab belgilangan), markerда kema/nuqta.
// answer null -> "?"; javob berilganda yashil, son ko'rinadi. emphTens -> o'nlik belgilarini yoritadi.
const NumTrack = ({ value, answer = null, max = 100, emphTens = false }) => {
  const pct = (value / max) * 100;
  const shown = answer != null;
  const tens = [];
  for (let n = 0; n <= max; n += 10) tens.push(n);
  return (
    <div style={{ width: 'min(99%, 580px)', margin: '0 auto', padding: 'clamp(42px,8vw,56px) 16px 36px', position: 'relative', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', top: 2, left: `${pct}%`, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
        <div className={shown ? 'g1-pop-in' : ''} style={{ minWidth: 'clamp(40px,8vw,54px)', height: 'clamp(36px,7vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(19px,4.2vw,28px)', background: shown ? T.successSoft : '#EEF2F6', color: shown ? T.success : T.ink3, border: `2.5px ${shown ? 'solid' : 'dashed'} ${shown ? T.success : '#A7A6A2'}` }}>{shown ? value : '?'}</div>
        <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `10px solid ${shown ? T.success : '#A7A6A2'}` }}/>
      </div>
      <div style={{ position: 'relative', height: 8, background: 'linear-gradient(90deg,#C9C6BE,#A7A6A2)', borderRadius: 4 }}>
        {Array.from({ length: max + 1 }).map((_, n) => (n % 10 !== 0 ? <div key={n} style={{ position: 'absolute', left: `${(n / max) * 100}%`, top: -4, width: n % 5 === 0 ? 2 : 1.3, height: n % 5 === 0 ? 16 : 12, background: n % 5 === 0 ? '#8A98A6' : '#AEABA3', borderRadius: 1 }}/> : null))}
        {tens.map((n) => (
          <div key={n} style={{ position: 'absolute', left: `${(n / max) * 100}%`, top: -9, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 3, height: 23, background: emphTens ? '#FF4F28' : '#5E6B78', borderRadius: 2 }}/>
            <span style={{ marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(11px,2.2vw,14px)', fontWeight: 800, color: emphTens ? '#FF4F28' : T.ink2 }}>{n}</span>
          </div>
        ))}
        <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(14px,3vw,18px)', height: 'clamp(14px,3vw,18px)', borderRadius: '50%', background: shown ? T.success : T.accent, border: '3px solid #fff', boxShadow: `0 0 0 3px ${shown ? T.successSoft : T.accentSoft}`, zIndex: 2 }}/>
      </div>
    </div>
  );
};

// TrackHero — s0 sahnasi: KOSMIK TRASSA (son o'qi) kema uni bo'ylab uchadi, raqamlar bilan.
const TRACK_TENS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const TRACK_STARS = [[8, 20], [20, 70], [34, 14], [50, 82], [64, 24], [78, 68], [92, 18], [14, 46], [72, 54], [44, 30]];
const TrackHero = ({ answer = null }) => {
  const shown = answer != null;
  const fly = { left: '28%', animation: 'd2trackfly 4s ease-in-out forwards' };
  return (
    <div className="d2-scene" style={{ background: 'radial-gradient(ellipse at 50% 45%, #1a2846 0%, #0a0f1e 74%)' }}>
      {TRACK_STARS.map(([x, y], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 1, fontSize: `${9 + (i % 3) * 4}px`, color: i % 2 ? '#EAF2FF' : '#FFD873', textShadow: '0 0 6px currentColor', animation: `g1twinkle ${1.6 + (i % 4) * 0.4}s ease-in-out ${i * 0.15}s infinite`, pointerEvents: 'none' }}>✦</span>
      ))}
      <div style={{ position: 'absolute', left: '7%', right: '7%', top: '62%', transform: 'translateY(-50%)', zIndex: 2 }}>
        <div style={{ position: 'relative', height: 'clamp(4px,1vw,6px)', background: 'linear-gradient(90deg,#274b73,#5BD6F2,#274b73)', borderRadius: 4, boxShadow: '0 0 12px rgba(91,214,242,0.55)' }}>
          {Array.from({ length: 101 }).map((_, n) => (n % 10 !== 0 ? <div key={n} style={{ position: 'absolute', left: `${n}%`, top: -3, width: n % 5 === 0 ? 1.6 : 1, height: n % 5 === 0 ? 12 : 8, background: n % 5 === 0 ? '#7FA8CE' : '#4E6C8C', borderRadius: 1 }}/> : null))}
          {TRACK_TENS.map((n) => (
            <div key={n} style={{ position: 'absolute', left: `${n}%`, top: -8, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 2.5, height: 18, background: '#9EC4E6', borderRadius: 2 }}/>
              <span style={{ marginTop: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px,2vw,13px)', fontWeight: 800, color: '#CFE7FF' }}>{n}</span>
            </div>
          ))}
          <div style={{ position: 'absolute', ...fly, top: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(13px,2.8vw,17px)', height: 'clamp(13px,2.8vw,17px)', borderRadius: '50%', background: shown ? T.success : '#FFC23C', border: '2.5px solid #fff', boxShadow: `0 0 10px ${shown ? 'rgba(31,122,77,0.8)' : 'rgba(255,194,60,0.8)'}`, zIndex: 3 }}/>
        </div>
        <div style={{ position: 'absolute', ...fly, bottom: 'clamp(16px,4vw,26px)', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 4 }}>
          <div className={shown ? 'g1-pop-in' : ''} style={{ minWidth: 'clamp(34px,7vw,46px)', height: 'clamp(30px,6vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(17px,3.6vw,24px)', background: shown ? T.successSoft : '#F2F5F8', color: shown ? T.success : T.ink3, border: `2.5px ${shown ? 'solid' : 'dashed'} ${shown ? T.success : '#A7A6A2'}`, animation: shown ? 'none' : 'g1pulse 1.5s ease-in-out infinite' }}>{shown ? 68 : '?'}</div>
          <div style={{ width: 'clamp(50px,11vw,72px)', marginTop: 2, animation: 'd2hover 4s ease-in-out infinite' }}><div style={{ transform: 'scaleX(-1)' }}><HeroShip/></div></div>
        </div>
      </div>
      <div className="d2-scene-bit"><span className="g1-cast-fig"><BitSVG state="present"/></span></div>
    </div>
  );
};

// ColumnAdd — Dars07 star-vizual: ustunlab qo'shish (столбик). O'nlik ustuni sariq, birlik ko'k.
// «+» ikki qo'shiluvchi ORASIDA (chap gutterда, ikki qatorga markazlashgan — 5-sinf uslubi).
// sum null -> yig'indi "?"; sum berilганда yashil. emph 'units'|'tens' -> faol ustunni yoritadi.
const COL_W = 'clamp(38px,8.4vw,52px)';
const colCell = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: COL_W, height: COL_W, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(26px,6vw,40px)', lineHeight: 1 };
// ColumnCard — umumiy столбик maketi. resTens/resUnits — natija katagi tuguni (raqam yoki drop-slot).
const ColumnCard = ({ at, au, bt, bu, dimT, dimU, resTens, resUnits }) => {
  const t = useT();
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: `auto ${COL_W} ${COL_W}`, alignItems: 'center', columnGap: 'clamp(3px,1.2vw,7px)', rowGap: 3, padding: 'clamp(12px,2.6vw,18px) clamp(18px,3.4vw,26px)', background: '#F6F4EF', borderRadius: 14, border: `2px solid ${T.ink3}`, boxShadow: '0 4px 14px -8px rgba(0,0,0,0.25)' }}>
      <span style={{ gridColumn: 2, gridRow: 1, width: COL_W, textAlign: 'center', fontSize: 'clamp(9px,1.6vw,11px)', fontWeight: 800, color: '#FF4F28', textTransform: 'uppercase', letterSpacing: '.02em' }}>{t({ ru: 'дес', uz: "o'n" })}</span>
      <span style={{ gridColumn: 3, gridRow: 1, width: COL_W, textAlign: 'center', fontSize: 'clamp(9px,1.6vw,11px)', fontWeight: 800, color: '#019ACB', textTransform: 'uppercase', letterSpacing: '.02em' }}>{t({ ru: 'ед', uz: 'bir' })}</span>
      <span style={{ gridColumn: 1, gridRow: '2 / 4', alignSelf: 'center', justifySelf: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(24px,5.4vw,36px)', color: T.ink2 }}>+</span>
      <span style={{ ...colCell, gridColumn: 2, gridRow: 2, color: '#FF4F28', opacity: dimT ? 0.32 : 1, transition: 'opacity .3s' }}>{at}</span>
      <span style={{ ...colCell, gridColumn: 3, gridRow: 2, color: '#019ACB', opacity: dimU ? 0.32 : 1, transition: 'opacity .3s' }}>{au}</span>
      <span style={{ ...colCell, gridColumn: 2, gridRow: 3, color: '#FF4F28', opacity: dimT ? 0.32 : 1, transition: 'opacity .3s' }}>{bt}</span>
      <span style={{ ...colCell, gridColumn: 3, gridRow: 3, color: '#019ACB', opacity: dimU ? 0.32 : 1, transition: 'opacity .3s' }}>{bu}</span>
      <span style={{ gridColumn: '1 / 4', gridRow: 4, height: 3, background: T.ink, borderRadius: 2, margin: '3px 0' }}/>
      <span style={{ gridColumn: 2, gridRow: 5, display: 'flex', justifyContent: 'center' }}>{resTens}</span>
      <span style={{ gridColumn: 3, gridRow: 5, display: 'flex', justifyContent: 'center' }}>{resUnits}</span>
    </div>
  );
};
const ColumnAdd = ({ a, b, sum = null, emph = null }) => {
  const dg = (n) => [Math.floor(n / 10), n % 10];
  const [at, au] = dg(a), [bt, bu] = dg(b);
  const shown = sum != null;
  const [st, su] = shown ? dg(sum) : ['?', '?'];
  const dimT = emph === 'units', dimU = emph === 'tens';
  const res = (d) => <span className={shown ? 'g1-pop-in' : ''} style={{ ...colCell, color: shown ? T.success : T.ink3 }}>{d}</span>;
  return <ColumnCard at={at} au={au} bt={bt} bu={bu} dimT={dimT} dimU={dimU} resTens={res(st)} resUnits={res(su)}/>;
};

// RazryadBreak — s1 «NEGA ustunlab» tushuntirishi: har sonni razryadga ajratadi (34 = 30 + 4).
// O'nlik sariq, birlik ko'k — bola o'z ko'zi bilan ko'radi: o'nlik o'nlik bilan, birlik birlik bilan
// bir ustunga tushadi. Dars03 «razryad tarkibi» ga bog'lanadi.
const RB_ROW = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(5px,1.4vw,10px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 };
const RB_CHIP = { borderRadius: 10, padding: 'clamp(4px,1vw,7px) clamp(9px,2vw,14px)', fontSize: 'clamp(22px,4.6vw,30px)', lineHeight: 1 };
const RazryadBreak = ({ a, b }) => {
  const t = useT();
  const row = (n, i) => {
    const tens = Math.floor(n / 10) * 10, units = n % 10;
    return (
      <div key={i} className="fade-up" style={{ ...RB_ROW, animationDelay: `${0.15 + i * 0.25}s` }}>
        <span style={{ fontSize: 'clamp(28px,6vw,40px)', color: T.ink, minWidth: 'clamp(44px,10vw,60px)', textAlign: 'right' }}>{n}</span>
        <span style={{ fontSize: 'clamp(19px,3.6vw,26px)', color: T.ink3 }}>=</span>
        <span style={{ ...RB_CHIP, background: '#FFF1EC', border: '2px solid #FF4F28', color: '#FF4F28' }}>{tens}</span>
        <span style={{ fontSize: 'clamp(19px,3.6vw,26px)', color: T.ink2 }}>+</span>
        <span style={{ ...RB_CHIP, background: '#E9F7FC', border: '2px solid #019ACB', color: '#019ACB' }}>{units}</span>
      </div>
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(9px,2.2vw,14px)' }}>
      {row(a, 0)}
      {row(b, 1)}
      <p className="fade-up" style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 'clamp(13px,2vw,16px)', textAlign: 'center', animationDelay: '0.65s' }}>
        <span style={{ color: '#FF4F28' }}>{t({ ru: 'десятки — с десятками', uz: "o'nlik — o'nlik bilan" })}</span>
        <span style={{ color: T.ink3 }}>, </span>
        <span style={{ color: '#019ACB' }}>{t({ ru: 'единицы — с единицами', uz: 'birlik — birlik bilan' })}</span>
      </p>
    </div>
  );
};

// MarsBase — Dars07 s0 sahnasi: kema Marsga qo'ngan, yonida YUK BAZASI (gumbaz depo).
// Ikki konteyner (34 + 25) bazaga yuklanadi -> jami "?"→59.
const D8_MARS_STARS = [[10, 16], [26, 9], [45, 20], [63, 11], [82, 18], [91, 32], [15, 38], [73, 40]];
const CargoCrate = ({ n, ca, cb, br }) => (
  <div style={{ width: 'clamp(34px,7.6vw,50px)', height: 'clamp(34px,7.6vw,50px)', borderRadius: 8, background: `linear-gradient(160deg,${ca},${cb})`, border: `2px solid ${br}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.4)', position: 'relative', flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: 4, left: 4, right: 4, height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }}/>
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(15px,3.2vw,21px)', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{n}</span>
  </div>
);
// Marsga qo'ngan raketa: tik turgan, qo'nish oyoqlarida, batafsil (panel, zakovka, lyuk, sopло).
const LandedRocket = ({ w }) => (
  <svg viewBox="0 0 80 120" style={{ width: w, height: 'auto', display: 'block', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))' }} aria-hidden="true">
    <defs><linearGradient id="d8rhull" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF"/><stop offset="0.5" stopColor="#DCE4EF"/><stop offset="1" stopColor="#A9B5C8"/></linearGradient></defs>
    {/* qo'nish oyoqlari + tovonlar */}
    <path d="M27 92 L13 112" stroke="#7E8B99" strokeWidth="5" strokeLinecap="round"/>
    <path d="M53 92 L67 112" stroke="#7E8B99" strokeWidth="5" strokeLinecap="round"/>
    <rect x="6" y="110" width="15" height="6" rx="2.5" fill="#697384"/>
    <rect x="59" y="110" width="15" height="6" rx="2.5" fill="#697384"/>
    {/* qanotlar */}
    <path d="M27 74 L10 100 L27 90 Z" fill="#D94A2A" stroke="#B23A1F" strokeWidth="1.4"/>
    <path d="M53 74 L70 100 L53 90 Z" fill="#D94A2A" stroke="#B23A1F" strokeWidth="1.4"/>
    {/* korpus */}
    <rect x="26" y="34" width="28" height="60" rx="14" fill="url(#d8rhull)" stroke="#94A0B4" strokeWidth="1.6"/>
    <line x1="27" y1="56" x2="53" y2="56" stroke="#B9C4D4" strokeWidth="1.1"/>
    <line x1="27" y1="78" x2="53" y2="78" stroke="#B9C4D4" strokeWidth="1.1"/>
    {[[31, 60], [49, 60], [31, 82], [49, 82]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="1.1" fill="#9AA6B8"/>)}
    {/* burun konusi + chiziq */}
    <path d="M40 4 L57 36 L23 36 Z" fill="#FF6A3D" stroke="#D94A2A" strokeWidth="1.6"/>
    <path d="M40 4 L48 20 L32 20 Z" fill="#FF9166" opacity="0.85"/>
    {/* oyna */}
    <circle cx="40" cy="50" r="10" fill="#0E1526" stroke="#5BD6F2" strokeWidth="3"/>
    <circle cx="40" cy="50" r="4.6" fill="#5BD6F2" opacity="0.75"/>
    <path d="M35 46 A6 6 0 0 1 43 44" stroke="#EAF7FF" strokeWidth="1.6" fill="none" opacity="0.85" strokeLinecap="round"/>
    {/* lyuk */}
    <rect x="34" y="66" width="12" height="15" rx="3" fill="#0E1526" stroke="#94A0B4" strokeWidth="1.4"/>
    <circle cx="43" cy="73" r="1.3" fill="#5BD6F2"/>
    {/* soplo */}
    <path d="M33 94 L47 94 L44 105 L36 105 Z" fill="#8A94A6" stroke="#697384" strokeWidth="1.2"/>
  </svg>
);
// Yuk OMBORI: katta gumbazli baza — quyosh paneli, antenna tarelkasi, shlyuz-eshik, illyuminatorlar, bayroq.
const CargoBase = ({ w }) => (
  <svg viewBox="0 0 150 104" style={{ width: w, height: 'auto', display: 'block', filter: 'drop-shadow(0 7px 9px rgba(0,0,0,0.45))' }} aria-hidden="true">
    <defs>
      <linearGradient id="d8dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1F5FB"/><stop offset="0.5" stopColor="#CBD5E3"/><stop offset="1" stopColor="#A2AEC1"/></linearGradient>
      <linearGradient id="d8panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A6FB0"/><stop offset="1" stopColor="#153862"/></linearGradient>
    </defs>
    {/* quyosh paneli qanoti (o'ngda) */}
    <line x1="116" y1="84" x2="116" y2="62" stroke="#7E8B99" strokeWidth="3.4"/>
    <rect x="104" y="40" width="44" height="24" rx="2" fill="url(#d8panel)" stroke="#5A6B84" strokeWidth="1.6"/>
    {[115, 126, 137].map((x) => <line key={x} x1={x} y1="40" x2={x} y2="64" stroke="#5A83B0" strokeWidth="0.9"/>)}
    <line x1="104" y1="52" x2="148" y2="52" stroke="#5A83B0" strokeWidth="0.9"/>
    {/* antenna tarelkasi (chap tepa) */}
    <line x1="30" y1="58" x2="22" y2="42" stroke="#7E8B99" strokeWidth="2.6"/>
    <ellipse cx="17" cy="35" rx="13" ry="8.5" transform="rotate(-26 17 35)" fill="#E4EAF2" stroke="#8290A6" strokeWidth="1.6"/>
    <line x1="17" y1="35" x2="24" y2="31" stroke="#8290A6" strokeWidth="1.6"/>
    <circle cx="25" cy="30" r="1.8" className="d2-neon" fill="#FF6A3D"/>
    {/* gumbaz */}
    <path d="M20 86 A50 50 0 0 1 120 86 Z" fill="url(#d8dome)" stroke="#7C8AA0" strokeWidth="2.2"/>
    {/* gumbaz panel choklari */}
    <path d="M70 38 L70 86 M50 43 L44 86 M90 43 L96 86 M34 58 L24 86 M106 58 L116 86" stroke="#AEB9CB" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <path d="M44 54 A38 38 0 0 1 78 42" stroke="#FFFFFF" strokeWidth="3.2" opacity="0.5" fill="none" strokeLinecap="round"/>
    {/* asos platformasi + oyoqlar */}
    <rect x="14" y="84" width="112" height="10" rx="3.5" fill="#7C8AA0"/>
    <rect x="22" y="94" width="11" height="8" fill="#697384"/>
    <rect x="108" y="94" width="11" height="8" fill="#697384"/>
    {/* shlyuz-eshik */}
    <path d="M56 86 L56 56 A14 14 0 0 1 84 56 L84 86 Z" fill="#0E1526" stroke="#5BD6F2" strokeWidth="2.6"/>
    <path d="M60 86 L60 58 A10 10 0 0 1 80 58 L80 86 Z" fill="#12324A" opacity="0.85"/>
    <circle cx="77" cy="73" r="2.6" fill="#5BD6F2"/>
    {/* illyuminatorlar */}
    <circle cx="37" cy="68" r="8" fill="#0E1526" stroke="#019ACB" strokeWidth="2.6"/>
    <circle cx="37" cy="68" r="3.2" fill="#019ACB" opacity="0.7"/>
    <circle cx="103" cy="68" r="8" fill="#0E1526" stroke="#FF6A3D" strokeWidth="2.6"/>
    <circle cx="103" cy="68" r="3.2" fill="#FF6A3D" opacity="0.7"/>
    {/* bayroq (chapda) */}
    <line x1="26" y1="86" x2="26" y2="60" stroke="#C3CDDC" strokeWidth="2.6"/>
    <path d="M26 60 L26 73 L44 66.5 Z" fill="#FF4F28"/>
  </svg>
);
// Mars osmoni/sirti elementlari — real-hayotiy sahnasi uchun.
const MarsMoon = ({ x, y, s, c }) => (
  <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: '50%', background: `radial-gradient(circle at 34% 30%, ${c}, #5b5b62)`, boxShadow: '0 0 8px rgba(200,200,220,0.3)', zIndex: 1 }} aria-hidden="true">
    <div style={{ position: 'absolute', top: '28%', left: '46%', width: s * 0.2, height: s * 0.2, borderRadius: '50%', background: 'rgba(0,0,0,0.22)' }}/>
    <div style={{ position: 'absolute', top: '58%', left: '24%', width: s * 0.14, height: s * 0.14, borderRadius: '50%', background: 'rgba(0,0,0,0.18)' }}/>
  </div>
);
const MarsCrater = ({ x, y, w }) => (
  <div style={{ position: 'absolute', left: `${x}%`, bottom: `${y}%`, width: w, height: w * 0.42, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 34%, #6E2E16, #55220F)', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.55), 0 -1.5px 0 rgba(255,180,120,0.4)', zIndex: 2 }} aria-hidden="true"/>
);
const MarsRock = ({ x, y, s }) => (
  <div style={{ position: 'absolute', left: `${x}%`, bottom: `${y}%`, width: s, height: s * 0.68, zIndex: 3 }} aria-hidden="true">
    <svg viewBox="0 0 24 16" style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.35))' }}>
      <path d="M2 15 L5 6 L11 3 L18 5 L22 12 L20 15 Z" fill="#9A4526" stroke="#6E2E16" strokeWidth="1"/>
      <path d="M5 6 L11 3 L18 5 L14 8 Z" fill="#B85B33" opacity="0.75"/>
    </svg>
  </div>
);
// Mars roveri — kichik quyoshli tadqiqot mashinasi (hayotiylik uchun).
const MarsRover = ({ w }) => (
  <svg viewBox="0 0 50 32" style={{ width: w, height: 'auto', display: 'block', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }} aria-hidden="true">
    <line x1="11" y1="25" x2="41" y2="25" stroke="#8A94A6" strokeWidth="2.4"/>
    {[11, 26, 41].map((cx) => (<g key={cx}><circle cx={cx} cy="25" r="5.2" fill="#2b2f36" stroke="#697384" strokeWidth="1.6"/><circle cx={cx} cy="25" r="1.6" fill="#697384"/></g>))}
    <rect x="13" y="13" width="24" height="9" rx="2" fill="#D7E0EC" stroke="#9AA6B8" strokeWidth="1"/>
    <rect x="10" y="8" width="30" height="4" rx="1" fill="#173A63" stroke="#2A6FB0" strokeWidth="1"/>
    {[16, 22, 28, 34].map((lx) => (<line key={lx} x1={lx} y1="8" x2={lx} y2="12" stroke="#2A6FB0" strokeWidth="0.7"/>))}
    <line x1="17" y1="13" x2="17" y2="4" stroke="#8A94A6" strokeWidth="1.6"/>
    <rect x="14" y="1" width="6" height="4" rx="1" fill="#FF6A3D"/>
  </svg>
);
const MarsBase = ({ answer = null }) => {
  const shown = answer != null;
  return (
    <div className="d2-scene" style={{ background: 'radial-gradient(ellipse at 50% 20%, #34180f 0%, #140a08 78%)' }}>
      {D8_MARS_STARS.map(([x, y], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 1, fontSize: `${8 + (i % 3) * 3}px`, color: '#FFE3C0', textShadow: '0 0 5px currentColor', animation: `g1twinkle ${1.6 + (i % 4) * 0.4}s ease-in-out ${i * 0.15}s infinite`, pointerEvents: 'none' }}>✦</span>
      ))}
      {/* osmon: ikki oy (Fobos/Deymos) + uzoq Yer (ko'k nuqta) */}
      <MarsMoon x={16} y={12} s={22} c="#c9b8a8"/>
      <MarsMoon x={30} y={22} s={13} c="#b9a89a"/>
      <div style={{ position: 'absolute', right: '13%', top: '15%', width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle at 38% 38%, #8ED0FF, #2A6FB0)', boxShadow: '0 0 9px rgba(120,200,255,0.85)', zIndex: 1 }} aria-hidden="true"/>
      {/* Olympus Mons — ufqda keng vulqon */}
      <div style={{ position: 'absolute', left: '6%', bottom: '37%', width: '46%', height: '20%', background: 'linear-gradient(180deg,#7E3418,#5A2412)', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', opacity: 0.82, zIndex: 1 }} aria-hidden="true">
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '20%', height: '26%', borderRadius: '50%', background: '#49200F' }}/>
      </div>
      {/* ufq changi (atmosfera nuri) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '40%', height: '13%', background: 'linear-gradient(180deg, rgba(255,150,90,0) 0%, rgba(255,140,80,0.3) 100%)', zIndex: 1 }} aria-hidden="true"/>
      {/* Mars yer yuzasi (katta egri) */}
      <div style={{ position: 'absolute', left: '-6%', right: '-6%', bottom: 0, height: '46%', background: 'linear-gradient(180deg,#C1502E 0%,#9A3D1E 55%,#7E3418 100%)', borderRadius: '50% 50% 0 0 / 40% 40% 0 0', boxShadow: 'inset 0 6px 18px rgba(255,180,120,0.28)' }}/>
      {/* sirt elementlari: kraterlar + toshlar */}
      <MarsCrater x={30} y={11} w={52}/>
      <MarsCrater x={64} y={8} w={40}/>
      <MarsCrater x={7} y={16} w={30}/>
      <MarsRock x={4} y={20} s={22}/>
      <MarsRock x={88} y={13} s={26}/>
      <MarsRock x={40} y={7} s={18}/>
      <MarsRock x={72} y={22} s={16}/>
      {/* rover (sirtda, o'ng-markazda) */}
      <div style={{ position: 'absolute', left: '63%', bottom: '19%', width: 'clamp(34px,8vw,50px)', zIndex: 3 }}><MarsRover w="100%"/></div>
      {/* yuk ombori (chapda) — kattaroq */}
      <div style={{ position: 'absolute', left: '19%', bottom: '27%', transform: 'translateX(-50%)', width: 'clamp(120px,31vw,190px)', zIndex: 4 }}><CargoBase w="100%"/></div>
      {/* qo'ngan raketa (o'ngda) — kattaroq */}
      <div style={{ position: 'absolute', right: '11%', bottom: '28%', transform: 'translateX(50%)', width: 'clamp(58px,14.5vw,90px)', zIndex: 4 }}><LandedRocket w="100%"/></div>
      {/* konteynerlar (o'rtada, yerda) */}
      <div style={{ position: 'absolute', left: '48%', bottom: '17%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 'clamp(5px,1.4vw,10px)', zIndex: 5 }}>
        <CargoCrate n={34} ca="#FF9166" cb="#FF4F28" br="#C1381A"/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(18px,3.6vw,26px)', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>+</span>
        <CargoCrate n={25} ca="#33B8E3" cb="#019ACB" br="#0B7BA3"/>
      </div>
      {/* jami pufakcha */}
      <div style={{ position: 'absolute', left: '48%', top: '9%', transform: 'translateX(-50%)', zIndex: 6 }}>
        <div className={shown ? 'g1-pop-in' : ''} style={{ minWidth: 'clamp(40px,8vw,54px)', height: 'clamp(36px,7vw,48px)', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(19px,4.2vw,28px)', background: shown ? T.successSoft : '#F2F5F8', color: shown ? T.success : T.ink3, border: `2.5px ${shown ? 'solid' : 'dashed'} ${shown ? T.success : '#A7A6A2'}`, animation: shown ? 'none' : 'g1pulse 1.5s ease-in-out infinite' }}>{shown ? 59 : '?'}</div>
      </div>
      <div className="d2-scene-bit"><span className="g1-cast-fig"><BitSVG state="present"/></span></div>
    </div>
  );
};

// s4 — TUSHUNTIRISH-3 (NOL-O'RIN): 30 = 3 o'nlik 0 birlik; 30 != 3
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s4_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const canAct = useCanAnswer(audio);
  const warnActive = seg === 's4_2';
  const [wrong, setWrong] = useState(() => new Set());
  const [done, setDone] = useState(false);
  const [addShown, setAddShown] = useState(false);
  useEffect(() => { if (seg === 's4_1' || seg === 's4_2' || seg === 's4_3') setAddShown(true); }, [seg]);
  const reveal = done ? 3 : (addShown ? 2 : 1);   // takroriy qo'shish tushuntirishda; jami faqat check'dan keyin
  const revealRef = useRevealScroll(done, 500);
  const pick = (i, ok) => {
    if (!canAct || done || wrong.has(i)) return;
    if (ok) { sfx.playCorrect(); setDone(true); }
    else { sfx.playWrong(); setWrong((w) => new Set(w).add(i)); }
  };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 2vw, 17px)', textAlign: 'center', lineHeight: 1.55 }}>{t(c.body)}</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LineFig type="segment" hi={done}/>
        </div>
        <div className="fade-up" style={{ background: '#FBEEEE', border: '2px solid #D64545', borderRadius: 12, padding: 'clamp(10px,2vw,14px)', boxShadow: warnActive ? '0 0 0 4px rgba(214,69,69,0.15)' : 'none', transition: 'all .3s', textAlign: 'center', fontWeight: 700, color: '#B23A3A', fontSize: 'clamp(14px,2.1vw,17px)' }}>{t(c.warn)}</div>
        <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.ink2, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(c.check_q)}</p>
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: c.opts.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10, width: '100%' }}>
          {c.opts.map((o, i) => (
            <button key={i} className={`option ${done && o.ok ? 'option-correct' : ''} ${wrong.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || done || wrong.has(i)} onClick={() => pick(i, !!o.ok)}
              style={{ padding: 'clamp(9px,1.6vw,12px)', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", minHeight: 'clamp(46px,7vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{t(o)}</button>
          ))}
        </div>
        {wrong.size > 0 && !done && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.wrong)}/></div>}
        {done && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(c.check_ok)}/></div>}
      </div>
    </Stage>
  );
};

// s5 — OCHILISH-4 (o'rin hal qiladi): 45 va 54, kod terish
const POS_TARGETS = [[4, 7], [7, 4]];   // Dars02 reversal: 47 va 74 (o'qish/yozish)
// s5 — animatsion LYUK: kod to'g'ri terilganda eshiklar ikki tomonga suriladi, ortida koinot + yashil yorug'.
const HATCH_STARS = [[34, 30], [58, 24], [78, 42], [98, 30], [46, 56], [90, 58], [66, 48], [110, 44]];
// ICHMA-ICH 2 bosqichli lyuk: OLD (tashqi) gorizontal eshiklar; ular ochilgach ORTIDA
// ICHKI vertikal eshiklar ko'rinadi; ular ham ochilgach — OCHIQ KOINOT (sayyora YO'Q).
const HatchDoor = ({ outerOpen, innerOpen, wrong }) => {
  const o = outerOpen ? 44 : 0;
  const iv = innerOpen ? 44 : 0;
  const tr = 'transform 0.7s cubic-bezier(0.5, 0, 0.2, 1)';
  return (
    <div className={`d2-hatchwrap ${wrong ? 'd2-hatch-shake' : ''}`} style={{ width: 'min(330px, 94%)', margin: '0 auto' }}>
      <svg viewBox="0 0 160 108" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden="true">
        <defs><clipPath id="hatchwin"><rect x="18" y="14" width="124" height="72" rx="9"/></clipPath></defs>
        <rect x="4" y="4" width="152" height="92" rx="14" fill="#EDE4D2" stroke="#C9BDA4" strokeWidth="2.5"/>
        {[[16, 16], [144, 16], [16, 84], [144, 84]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r="2.6" fill="#A99E88"/>))}
        <g clipPath="url(#hatchwin)">
          {/* eng ort — ochiq koinot (yulduzlar faqat ikkinchi lyuk ochilganda); sayyora yo'q */}
          <rect x="18" y="14" width="124" height="72" fill="url(#d2space)"/>
          {HATCH_STARS.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r="1.2" fill="#EAF2FB" style={{ opacity: innerOpen ? 1 : 0, transition: `opacity 0.4s ${0.1 + i * 0.05}s` }}/>))}
          {/* ICHKI lyuk — vertikal eshiklar (ozroq to'qroq qatlam) */}
          <g style={{ transform: `translateY(${-iv}px)`, transition: tr }}>
            <rect x="18" y="14" width="124" height="38" fill="#E7DCC6" stroke="#C9BDA4" strokeWidth="1"/>
            <rect x="18" y="44" width="124" height="8" fill="#CFC3AA"/>
            <g fill="#B8AC93">{[54, 80, 106].map((x) => (<circle key={x} cx={x} cy="28" r="1.6"/>))}</g>
          </g>
          <g style={{ transform: `translateY(${iv}px)`, transition: tr }}>
            <rect x="18" y="48" width="124" height="38" fill="#E7DCC6" stroke="#C9BDA4" strokeWidth="1"/>
            <rect x="18" y="48" width="124" height="8" fill="#CFC3AA"/>
            <g fill="#B8AC93">{[54, 80, 106].map((x) => (<circle key={x} cx={x} cy="72" r="1.6"/>))}</g>
          </g>
          {/* TASHQI lyuk — gorizontal eshiklar (old plan) */}
          <g style={{ transform: `translateX(${-o}px)`, transition: tr }}>
            <rect x="18" y="14" width="62" height="72" fill="url(#d2metal)" stroke="#C9BDA4" strokeWidth="1"/>
            <rect x="72" y="14" width="8" height="72" fill="#D9CCB2"/>
            <g fill="#C3B79E">{[28, 44, 60].map((y) => (<circle key={y} cx="34" cy={y} r="1.6"/>))}</g>
          </g>
          <g style={{ transform: `translateX(${o}px)`, transition: tr }}>
            <rect x="80" y="14" width="62" height="72" fill="url(#d2metal)" stroke="#C9BDA4" strokeWidth="1"/>
            <rect x="80" y="14" width="8" height="72" fill="#D9CCB2"/>
            <g fill="#C3B79E">{[28, 44, 60].map((y) => (<circle key={y} cx="126" cy={y} r="1.6"/>))}</g>
          </g>
        </g>
        <rect x="66" y="90" width="28" height="12" rx="6" fill="#EDE4D2" stroke="#C9BDA4" strokeWidth="1.5"/>
        <circle cx="80" cy="96" r="3.4" fill={outerOpen ? '#1F7A4D' : '#D64545'} style={{ transition: 'fill 0.3s' }}/>
      </svg>
    </div>
  );
};
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: { type: 'r1_wait' } },
    { id: 's5_1', text: c.audio[lang][1], trigger: 'on_event:r1', waits_for: { type: 'r2_wait' } },
    { id: 's5_2', text: c.audio[lang][2], trigger: 'on_event:r2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [completed, setCompleted] = useState([]);
  const [slots, setSlots] = useState([null, null]);
  const [wrong, setWrong] = useState(false);
  const [opened, setOpened] = useState(false);
  const [spark, setSpark] = useState(0);
  const roundIdx = completed.length;
  const done = completed.length === 2;
  // ichma-ich lyuk: 1-kod -> tashqi (gorizontal) ochiladi; 2-kod -> ichki (vertikal) ochiladi
  const outerOpen = completed.length >= 1 || (opened && roundIdx === 0);
  const innerOpen = completed.length >= 2 || (opened && roundIdx === 1);
  const target = POS_TARGETS[roundIdx] || [0, 0];
  const revealRef = useRevealScroll(done, 500);
  const nextEmpty = slots[0] === null ? 0 : (slots[1] === null ? 1 : -1);
  const placeDigit = (d) => {
    if (!canAct || done || slots.includes(d)) return;
    if (wrong) setWrong(false);   // qayta urinishда yordam yo'qoladi
    if (slots[0] === null) { setSlots([d, null]); return; }
    if (slots[1] !== null) return;
    const ns = [slots[0], d];
    setSlots(ns);
    if (ns[0] === target[0] && ns[1] === target[1]) {
      const code = target[0] * 10 + target[1];
      const nextCount = completed.length + 1;
      sfx.playCorrect(); setOpened(true); setSpark((s) => s + 1);
      setTimeout(() => {
        setCompleted(cs => [...cs, code]);
        audio.triggerInternal(nextCount === 1 ? 'r1' : 'r2');
        setSlots([null, null]); setOpened(false);
      }, 950);
    } else {
      sfx.playWrong && sfx.playWrong(); setWrong(true);
      setTimeout(() => setSlots([null, null]), 1200);
    }
  };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Bridge text={t(BRIDGES.s5)}/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(16px, 3vw, 24px)', position: 'relative' }}>
          <span key={spark} className="g1-cele-wrap" style={{ position: 'absolute', left: '50%', top: '28%', width: 0, height: 0, pointerEvents: 'none' }}>{spark > 0 && <SparkBurst/>}</span>
          <HatchDoor outerOpen={outerOpen} innerOpen={innerOpen} wrong={wrong}/>
          {completed.length > 0 && (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              {completed.map((code, i) => (
                <div key={i} className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 12, background: T.successSoft, border: `2px solid ${T.success}` }}>
                  <span className="mono" style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 800, color: T.success }}>{code}</span>
                  <span style={{ color: T.success, fontWeight: 800 }}>✓</span>
                </div>
              ))}
            </div>
          )}
          {!done && (
            <>
              <div className="d2-hatchtablo">
                <span className="mono" style={{ fontSize: 'clamp(9px, 1.3vw, 11px)', fontWeight: 800, letterSpacing: '0.14em', color: T.ink3, textTransform: 'uppercase' }}>{lang === 'uz' ? 'Kod tablosi' : 'Табло кода'}</span>
                <p className="mono" style={{ margin: 0, fontWeight: 700, color: T.ink2, fontSize: 'clamp(13px, 1.9vw, 15px)', textAlign: 'center' }}>{t(roundIdx === 0 ? c.round1 : c.round2)}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: 'min(340px, 96%)', border: `2px solid ${wrong ? '#D64545' : T.ink3}`, borderRadius: 14, overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", transition: 'border-color 0.2s' }}>
                  <div style={{ padding: '6px 4px', textAlign: 'center', fontSize: 'clamp(10px,1.7vw,13px)', fontWeight: 700, whiteSpace: 'nowrap', color: T.ink2, background: T.bg, borderRight: `1px solid ${T.ink3}`, borderBottom: `1px solid ${T.ink3}` }}>{t(c.tens_label)}</div>
                  <div style={{ padding: '6px 4px', textAlign: 'center', fontSize: 'clamp(10px,1.7vw,13px)', fontWeight: 700, whiteSpace: 'nowrap', color: T.ink2, background: T.bg, borderBottom: `1px solid ${T.ink3}` }}>{t(c.ones_label)}</div>
                  {[0, 1].map(si => (
                    <div key={si} style={{ minHeight: 'clamp(56px, 12vw, 76px)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontSize: 'clamp(40px, 10vw, 60px)', fontWeight: 800, color: slots[si] === null ? T.ink3 : (si === 0 ? '#FF4F28' : '#019ACB'), borderRight: si === 0 ? `1px solid ${T.ink3}` : 'none', background: (nextEmpty === si) ? T.accentSoft : 'transparent' }}>{slots[si] ?? ''}</div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[4, 7].map(d => (
                  <button key={d} className="option" disabled={!canAct || slots.includes(d)} onClick={() => placeDigit(d)}
                    style={{ width: 'clamp(56px, 12vw, 70px)', height: 'clamp(56px, 11vw, 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontSize: 'clamp(26px, 5.5vw, 34px)', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{d}</button>
                ))}
              </div>
            </>
          )}
        </div>
        {wrong && (
          <div className="frame-tip fade-up">
            <Reaction state="wrong" praise={t(c.wrong)}/>
          </div>
        )}
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — animatsion son o'qi: marker o'zi sakraydi (3 katta sakrash -> 30, 4 kichik qadam -> 34), ovoz bilan sinxron
const NL_W = 320, NL_pad = 26, NL_y = 68, NL_max = 40;
const nlx = (v) => NL_pad + (v / NL_max) * (NL_W - 2 * NL_pad);
const NumberLineAnim = ({ phase, guess = null, onGuess = null }) => {
  const ref = useRef(null);
  const pos = phase >= 2 ? 34 : phase >= 1 ? 30 : 0;
  const asking = guess === null && !!onGuess;
  const arc = (a, b, h) => { const mx = (nlx(a) + nlx(b)) / 2; return `M ${nlx(a)} ${NL_y} Q ${mx} ${NL_y - h} ${nlx(b)} ${NL_y}`; };
  const handleClick = (e) => {
    if (!asking) return;
    const rect = ref.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * NL_W;
    let v = Math.round(((svgX - NL_pad) / (NL_W - 2 * NL_pad)) * NL_max);
    v = Math.max(0, Math.min(NL_max, v));
    onGuess(v);
  };
  return (
    <svg ref={ref} onClick={handleClick} viewBox={`0 0 ${NL_W} 104`} style={{ width: 'min(340px, 96%)', height: 'auto', cursor: asking ? 'pointer' : 'default' }} aria-hidden={!asking}>
      {/* savol fazasida bosiladigan keng zona */}
      {asking && <rect x="0" y={NL_y - 26} width={NL_W} height="52" fill="transparent"/>}
      {/* «bu chiziqqa bo's» — chiziq bo'ylab suzib yuruvchi qo'l ishorasi */}
      {asking && (
        <g className="d2-nlcue-slide" style={{ pointerEvents: 'none' }} aria-hidden="true">
          <circle className="d2-nlcue-ring" cx={nlx(0)} cy={NL_y} r="7" fill="none" stroke="#F0A81E" strokeWidth="2"/>
          <text className="d2-nlcue-hand" x={nlx(0)} y={NL_y + 30} textAnchor="middle" fontSize="19">👆</text>
        </g>
      )}
      <line x1={nlx(0)} y1={NL_y} x2={nlx(NL_max)} y2={NL_y} stroke={T.ink3} strokeWidth="2"/>
      {!asking && <line x1={nlx(0)} y1={NL_y} x2={nlx(Math.min(pos, 30))} y2={NL_y} stroke="#FF4F28" strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.6s' }}/>}
      {!asking && pos > 30 && <line x1={nlx(30)} y1={NL_y} x2={nlx(pos)} y2={NL_y} stroke="#019ACB" strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.6s' }}/>}
      {[0, 10, 20, 30, 40].map((v) => (
        <g key={v}>
          <line x1={nlx(v)} y1={NL_y - 5} x2={nlx(v)} y2={NL_y + 5} stroke={T.ink2} strokeWidth="2"/>
          <text x={nlx(v)} y={NL_y + 20} textAnchor="middle" fontSize="12" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      ))}
      {!asking && [[0, 10], [10, 20], [20, 30]].map(([a, b], i) => (
        <g key={i} style={{ opacity: phase >= 1 ? 1 : 0, transition: `opacity 0.4s ${i * 0.35}s` }}>
          <path d={arc(a, b, 30)} fill="none" stroke="#FF4F28" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3.5"/>
          <text x={(nlx(a) + nlx(b)) / 2} y={NL_y - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill="#FF4F28" fontFamily="'JetBrains Mono', monospace">+10</text>
        </g>
      ))}
      {!asking && [30, 31, 32, 33].map((a, i) => (
        <path key={i} d={arc(a, a + 1, 13)} fill="none" stroke="#019ACB" strokeWidth="2.2" strokeLinecap="round"
          style={{ opacity: phase >= 2 ? 1 : 0, transition: `opacity 0.3s ${i * 0.2}s` }}/>
      ))}
      {/* bola taxmini — amber belgi */}
      {guess !== null && (
        <g>
          <line x1={nlx(guess)} y1={NL_y - 20} x2={nlx(guess)} y2={NL_y + 6} stroke="#F0A81E" strokeWidth="2.5" strokeLinecap="round"/>
          <path d={`M ${nlx(guess) - 5} ${NL_y - 20} L ${nlx(guess) + 5} ${NL_y - 20} L ${nlx(guess)} ${NL_y - 13} Z`} fill="#F0A81E"/>
        </g>
      )}
      {/* haqiqiy marker — Dars02: kod-displey chipi (neon), marshrutdagi kod */}
      {!asking && (
        <g style={{ transform: `translateX(${nlx(pos) - nlx(0)}px)`, transition: 'transform 0.7s cubic-bezier(0.34, 1.2, 0.4, 1)' }}>
          <rect x={nlx(0) - 16} y={NL_y - 32} width="32" height="21" rx="4" fill="#0e1526" stroke="#2c3554" strokeWidth="1.5"/>
          <text x={nlx(0)} y={NL_y - 17} textAnchor="middle" fontSize="13" fontWeight="800" fill="#8FE0F4" fontFamily="'JetBrains Mono', monospace" style={{ filter: 'drop-shadow(0 0 4px rgba(143,224,244,0.7))' }}>{pos}</text>
          <line x1={nlx(0)} y1={NL_y - 11} x2={nlx(0)} y2={NL_y} stroke="#2c3554" strokeWidth="1.5"/>
          <circle cx={nlx(0)} cy={NL_y} r="5.5" fill="#0e1526" stroke="#5BD6F2" strokeWidth="1.6"/>
        </g>
      )}
    </svg>
  );
};
// s6 — AVVAL SAVOL: bola 34 ni chiziqda taxmin qilib bosadi, KEYIN animatsion tushuntirish o'zi yuradi.
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const sfx = useSfx();
  // srazu SAVOLdan boshlanadi (kirish-ko'prik ovozi olib tashlandi — metodist 2026-07-13)
  const audio = useAudio([
    { id: 's6_q', text: c.q_audio[lang], trigger: 'on_mount', waits_for: { type: 'guessed' } },
    ...c.audio[lang].map((text, i) => ({ id: `s6_${i}`, text, trigger: i === 0 ? 'on_event:go' : 'after_previous', waits_for: null }))
  ]);
  const canAns = useCanAnswer(audio);
  const seg = audio.currentSegment;
  const [guess, setGuess] = useState(null);
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s6_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const phase = reached >= 2 ? 2 : reached >= 1 ? 1 : 0;
  const done = reached >= 2;
  const revealRef = useRevealScroll(done, 500);
  const onGuess = (v) => {
    if (guess !== null || !canAns) return;
    setGuess(v); sfx.playCorrect();
    audio.triggerInternal('go');
  };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge text={t(BRIDGES.s6)}/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {guess === null && (
          <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        )}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(140px, 30vw, 190px)' }}>
          <NumberLineAnim phase={phase} guess={guess} onGuess={onGuess}/>
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
        {done && <InfoNote badge={t(c.info_badge)} text={t(c.info)}/>}
      </div>
    </Stage>
  );
};

// s7 — QOIDA / QONUN (asosiy tushuntirish): rang-kodli qoida-karta + farqlash-cheki
const S7_CHECK = [7, 2];
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s7;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s7', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s7_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [checkOk, setCheckOk] = useState(false);
  const [checkWrong, setCheckWrong] = useState(false);
  const revealRef = useRevealScroll(checkOk, 500);
  const emph = audio.currentSegment === 's7_2' ? 'tens' : audio.currentSegment === 's7_3' ? 'ones' : null;
  const tensStyle = { opacity: emph === 'ones' ? 0.28 : 1, transform: emph === 'tens' ? 'scale(1.18)' : 'scale(1)', transition: 'all 0.3s ease', display: 'inline-block' };
  const onesStyle = { opacity: emph === 'tens' ? 0.28 : 1, transform: emph === 'ones' ? 'scale(1.18)' : 'scale(1)', transition: 'all 0.3s ease', display: 'inline-block' };
  const ruleActive = audio.currentSegment === 's7_4';
  const tapDigit = (pos) => {
    if (!canAct || checkOk) return;
    if (pos === 0) { setCheckOk(true); setCheckWrong(false); sfx.playCorrect(); }
    else { setCheckWrong(true); }
  };
  const canAdv = useAdvanceGate(checkOk, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge text={t(BRIDGES.s7)}/>
        <div className="fade-up" style={{ position: 'relative', background: '#FFF8EC', border: `2px solid ${T.accent}`, borderRadius: 16, margin: '6px 0 0', padding: 'clamp(14px, 2.6vw, 20px) clamp(14px, 2.6vw, 18px)', boxShadow: ruleActive ? `0 0 0 4px ${T.accentSoft}` : '0 4px 14px -6px rgba(255,79,40,0.25)', transform: ruleActive ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.3s ease' }}>
          <span style={{ position: 'absolute', top: -11, left: 16, background: T.accent, color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(10px, 1.5vw, 12px)', letterSpacing: '0.1em', padding: '3px 12px', borderRadius: 99 }}>{lang === 'ru' ? 'ПРАВИЛО' : 'QOIDA'}</span>
          <p className="title" style={{ margin: 0, fontSize: 'clamp(16px, 2.5vw, 21px)', lineHeight: 1.35, color: T.ink }}>
            {lang === 'ru' ? (
              <>Читаем слева направо: имя <b style={{ color: '#FF4F28' }}>десятков</b>, потом имя <b style={{ color: '#019ACB' }}>единиц</b>.</>
            ) : (
              <>Chapdan o'ngga o'qiymiz: <b style={{ color: '#FF4F28' }}>o'nliklar</b> nomi, keyin <b style={{ color: '#019ACB' }}>birliklar</b> nomi.</>
            )}
          </p>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 16px)' }}>
          <span className="d2-panel-num d2-claim-num">
            <span className="d2-digit-tens" style={tensStyle}>4</span>
            <span className="d2-digit-ones" style={onesStyle}>5</span>
          </span>
          <span className="d2-panel-tags mono">
            <i className="d2-tag-tens" style={tensStyle}>{t(c.tens_label)}</i>
            <i className="d2-tag-ones" style={onesStyle}>{t(c.ones_label)}</i>
          </span>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)' }}>
          <p className="mono" style={{ margin: 0, fontWeight: 700, color: T.ink2, fontSize: 'clamp(13px, 1.9vw, 15px)', textAlign: 'center' }}>{t(c.check_q)}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {S7_CHECK.map((d, pos) => (
              <button key={pos} className="option" disabled={!canAct || checkOk} onClick={() => tapDigit(pos)}
                style={{ width: 'clamp(54px, 12vw, 68px)', height: 'clamp(60px, 12vw, 76px)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontSize: 'clamp(32px, 7vw, 44px)', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                         color: checkOk ? (pos === 0 ? '#FF4F28' : '#019ACB') : T.ink,
                         borderColor: checkOk && pos === 0 ? T.success : undefined }}>{d}</button>
            ))}
          </div>
        </div>
        {checkWrong && !checkOk && (
          <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.check_no)}/></div>
        )}
        {checkOk && (
          <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(c.check_ok)}/></div>
        )}
      </div>
    </Stage>
  );
};

// s8 — MASHQ-1 (scored, build+check): 45 ni yig'ish
const S8_TARGETS = [[4, 5], [3, 2], [6, 7]];   // ketma-ket 3 son: 45, 32, 67
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const sfx = useSfx();
  const total = S8_TARGETS.length;
  const wasSolved = props.storedAnswer?.solved === true;
  const audio = useAudio([brgSeg('s8', lang), { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const [round, setRound] = useState(wasSolved ? total : 0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [solved, setSolved] = useState(wasSolved);
  const [wrongN, setWrongN] = useState(0);
  const [praiseWord, setPraiseWord] = useState('');
  const [encWord, setEncWord] = useState('');
  const [fb, setFb] = useState(null);
  const [spark, setSpark] = useState(0);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? (wasSolved ? total : 0));
  const target = S8_TARGETS[Math.min(round, total - 1)];
  const targetNum = target[0] * 10 + target[1];
  const check = () => {
    if (solved || !canAns) return;
    attemptsRef.current += 1;
    const ok = tens === target[0] && ones === target[1];
    if (ok) {
      sfx.playCorrect();
      const pw = nextPraise(lang); setPraiseWord(pw); setFb('correct'); setSpark((s) => s + 1);
      const next = round + 1;
      if (next >= total) {
        setSolved(true);
        const ft = wrongN === 0;
        props.onAnswer({
          stage: SCREEN_META[props.screen].scope, screenIdx: props.screen,
          question: c.q[lang], options: null,
          correctIndex: null, correctAnswer: 'built',
          studentAnswerIndex: null, studentAnswer: 'built',
          correct: ft, firstTry: ft, attempts: attemptsRef.current, solved: true
        });
        if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.audio.on_correct[lang]); } }
      } else {
        setRound(next); setTens(0); setOnes(0);
        if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(pw); }
      }
    } else {
      setWrongN(w => w + 1); sfx.playWrong(); setFb('wrong');
      setEncWord(nextEncourage(lang));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const srcBtn = (kind, label, on, dis) => (
    <button className={`d2-conbtn ${kind === 'cass' ? 'd2-conbtn-cass' : 'd2-conbtn-batt'}`} disabled={dis || solved} onClick={on}>
      <span className="d2-conbtn-lbl" style={{ fontSize: '1.7em', fontWeight: 800, lineHeight: 1 }}>＋</span>
    </button>
  );
  const minusBtn = (kind, on, dis) => (
    <button className={`d2-conbtn-minus mono ${kind === 'cass' ? 'd2-conbtn-minus-c' : 'd2-conbtn-minus-b'}`} disabled={dis || solved} onClick={on} aria-label="minus">−</button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <Bridge text={t(BRIDGES.s8)}/>
        <div className="d2-diag-head fade-up">
          <span className="d2-diag-title mono">{lang === 'uz' ? 'Yozish' : 'Запись'}</span>
          <span className="d2-diag-prog mono">{Math.min(round, total)} / {total}</span>
        </div>
        <h1 key={round} className="title h-sub fade-up" style={{ textAlign: 'center' }}>{lang === 'uz' ? `Kodni yozing: ${numName(targetNum, 'uz')}` : `Запиши код: ${numName(targetNum, 'ru')}`}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)', position: 'relative' }}>
          <span key={spark} className="g1-cele-wrap" style={{ position: 'absolute', left: '50%', top: '30%', width: 0, height: 0, pointerEvents: 'none' }}>{spark > 0 && <SparkBurst/>}</span>
          <CodeTablo tens={tens} ones={ones} tensLabel={t(c.tens_label)} onesLabel={t(c.ones_label)}/>
          {!solved && (
            <div className="d2-buildrows">
              <div className="d2-buildcol">
                <span className="d2-collabel mono">{t(c.tens_label)}</span>
                <div className="d2-pm">
                  {srcBtn('cass', t(c.src_tens), () => setTens(v => Math.min(v + 1, 9)), !canAns || tens >= 9)}
                  {minusBtn('cass', () => setTens(v => Math.max(v - 1, 0)), !canAns || tens <= 0)}
                </div>
              </div>
              <div className="d2-buildcol">
                <span className="d2-collabel mono">{t(c.ones_label)}</span>
                <div className="d2-pm">
                  {srcBtn('batt', t(c.src_ones), () => setOnes(v => Math.min(v + 1, 9)), !canAns || ones >= 9)}
                  {minusBtn('batt', () => setOnes(v => Math.max(v - 1, 0)), !canAns || ones <= 0)}
                </div>
              </div>
            </div>
          )}
          {!solved && (
            <button className="d2-gobtn" disabled={!canAns || (tens === 0 && ones === 0)} onClick={check}>
              {t(c.check_label)}
            </button>
          )}
        </div>
        <FeedbackBlock show={fb !== null || solved} isCorrect={fb === 'correct' || solved} wrongClass="frame-tip">
          <Reaction state={fb === 'wrong' && !solved ? 'wrong' : 'correct'} praise={fb === 'wrong' && !solved ? encWord : praiseWord}/>
        </FeedbackBlock>
      </div>
    </Stage>
  );
};

// s9 — MASHQ-2 (scored, tasniflash): kodlarni YUMALOQ (nol birlik) / BIRLIKLI tryumlarga ajratish
const SORT_ITEMS = [
  { id: 'a', code: 40 }, { id: 'b', code: 45 }, { id: 'c', code: 70 },
  { id: 'd', code: 63 }, { id: 'e', code: 80 }, { id: 'f', code: 52 }
];
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  const wasSolved = props.storedAnswer?.solved === true;
  const audio = useAudio([brgSeg('s9', lang), { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const [placed, setPlaced] = useState(() => wasSolved ? new Set(SORT_ITEMS.map(i => i.id)) : new Set());
  const [sel, setSel] = useState(null);
  const [wrongBin, setWrongBin] = useState(null);
  const [showWrong, setShowWrong] = useState(false);
  const [solved, setSolved] = useState(wasSolved);
  const [praiseWord, setPraiseWord] = useState('');
  const [encWord, setEncWord] = useState('');
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const revealRef = useRevealScroll(solved, 500);
  const binFor = (item) => (item.code % 10 === 0 ? 'round' : 'units');
  const finish = () => {
    setSolved(true); sfx.playCorrect();
    const pw = nextPraise(lang); setPraiseWord(pw);
    if (firstTryRef.current === null) firstTryRef.current = true;
    props.onAnswer({
      stage: SCREEN_META[props.screen].scope, screenIdx: props.screen,
      question: c.q[lang], options: null, correctIndex: null, correctAnswer: 'sorted',
      studentAnswerIndex: null, studentAnswer: 'sorted',
      correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true
    });
    if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(c.audio.on_correct[lang]); } }
  };
  const tapItem = (id) => { if (!canAns || solved || placed.has(id)) return; setSel(s => (s === id ? null : id)); setShowWrong(false); };
  const tapBin = (bin) => {
    if (!canAns || solved || sel === null) return;
    const item = SORT_ITEMS.find(i => i.id === sel);
    attemptsRef.current += 1;
    if (binFor(item) === bin) {
      const np = new Set(placed); np.add(sel); setPlaced(np); setSel(null); setShowWrong(false);
      if (np.size === SORT_ITEMS.length) setTimeout(finish, 160);
    } else {
      if (firstTryRef.current === null) firstTryRef.current = false;
      setSel(null); setWrongBin(bin); setShowWrong(true); setEncWord(nextEncourage(lang)); sfx.playWrong();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
      setTimeout(() => setWrongBin(null), 500);
    }
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const unplaced = SORT_ITEMS.filter(i => !placed.has(i.id));
  const codeChip = (code, sm) => (
    <span className="mono" style={{ fontSize: sm ? 'clamp(15px,2.8vw,20px)' : 'clamp(24px,5vw,32px)', fontWeight: 800, padding: sm ? '3px 8px' : '5px 12px', borderRadius: 8, background: 'linear-gradient(180deg,#0e1526,#1a2340)', border: '1px solid #2c3554', color: '#E4ECF6', lineHeight: 1, display: 'inline-flex' }}>{code}</span>
  );
  const binCodes = (r) => SORT_ITEMS.filter(i => placed.has(i.id) && (i.code % 10 === 0) === r).map(i => i.code);
  const Hold = ({ bin, label, codes }) => (
    <button className={`d2-hold ${solved ? 'd2-hold-ok' : ''} ${wrongBin === bin ? 'd2-hold-wrong' : ''} ${sel !== null ? 'd2-hold-armed' : ''}`}
      disabled={!canAns || solved || sel === null} onClick={() => tapBin(bin)}>
      <span className="d2-hold-label mono">{label}</span>
      <span className="d2-hold-slot">{codes.map((code, k) => <span key={k} className="d2-hold-chip">{codeChip(code, true)}</span>)}</span>
      <span className={`d2-hold-count mono ${codes.length > 0 ? 'on' : ''}`}>{codes.length}</span>
    </button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge text={t(BRIDGES.s9)}/>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center' }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(10px, 2vw, 16px)', minHeight: 'clamp(56px, 13vw, 84px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {unplaced.length > 0 ? (
            <div className="d2-sortpool">
              {unplaced.map((it) => (
                <button key={it.id} className={`d2-sortitem ${sel === it.id ? 'd2-sortitem-sel' : ''}`} disabled={!canAns || solved} onClick={() => tapItem(it.id)} style={{ padding: 4 }}>
                  {codeChip(it.code)}
                </button>
              ))}
            </div>
          ) : (
            <span className="d2-sortdone mono">✓</span>
          )}
        </div>
        <div className="d2-holds fade-up delay-1">
          <Hold bin="round" label={t(c.hold_round)} codes={binCodes(true)}/>
          <Hold bin="units" label={t(c.hold_units)} codes={binCodes(false)}/>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={praiseWord}/>
          </div>
        )}
        {!solved && showWrong && (
          <FeedbackBlock show={true} isCorrect={false} wrongClass="frame-tip">
            <Reaction state="wrong" praise={encWord}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s10 — MASHQ-3 (scored MC): 5 o'nlik 2 birlik -> 52
// SeqMCPanel — bitta slaydda KETMA-KET bir necha MC savol (веди-до-верного, progress, panel yashil).
// subs: [{ figure, q:{ru,uz}, options:[node], correctIdx, wrongText:(i,lang)=>string }]
const SeqMCPanel = ({ props, cKey, panelLabel, doneText, subs, cols = 4, fact = null, factAudio = null }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[cKey];
  const sfx = useSfx();
  const total = subs.length;
  const wasSolved = props.storedAnswer?.solved === true;
  const audio = useAudio([brgSeg(cKey, lang), { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]);
  const canAns = useCanAnswer(audio);
  const [curr, setCurr] = useState(wasSolved ? total : 0);
  const [wrong, setWrong] = useState(() => new Set());
  const [encWord, setEncWord] = useState('');
  const [praiseWord, setPraiseWord] = useState('');
  const [solved, setSolved] = useState(wasSolved);
  const [spark, setSpark] = useState(0);
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? null) : null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? (wasSolved ? total : 0));
  const revealRef = useRevealScroll(solved, 500);
  const subRef = useRevealScroll(curr > 0 && curr < total, 250);
  const factRef = useRevealScroll(solved && !!fact, 900);
  const pick = (i) => {
    if (!canAns || solved || curr >= total || wrong.has(i)) return;
    const sub = subs[curr];
    attemptsRef.current += 1;
    if (i === sub.correctIdx) {
      sfx.playCorrect(); setWrong(new Set()); setSpark((s) => s + 1);
      const next = curr + 1; setCurr(next);
      if (next >= total) {
        setSolved(true);
        if (firstTryRef.current === null) firstTryRef.current = true;
        const pw = nextPraise(lang); setPraiseWord(pw);
        props.onAnswer({ stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: c.audio.intro[lang], options: null, correctIndex: null, correctAnswer: 'panel', studentAnswerIndex: null, studentAnswer: 'panel', correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
        if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(doneText[lang]); if (factAudio) e.pushOneOff(factAudio[lang]); } }
      }
    } else {
      if (firstTryRef.current === null) firstTryRef.current = false;
      setWrong(p => { const s = new Set(p); s.add(i); return s; });
      setEncWord(nextEncourage(lang)); sfx.playWrong();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(sub.wrongText(i, lang)); }
    }
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/></>);
  const sub = curr < total ? subs[curr] : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge text={t(BRIDGES[cKey])}/>
        <div className="d2-diag-head fade-up">
          <span className="d2-diag-title mono">{t(panelLabel)}</span>
          <span className="d2-diag-prog mono">{Math.min(curr, total)} / {total}</span>
        </div>
        <div className={`frame fade-up delay-1 ${solved ? 'd2-diag-panel-ok' : ''}`} style={{ padding: 'clamp(12px, 2.4vw, 18px)', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', position: 'relative' }}>
          <span key={spark} className="g1-cele-wrap" style={{ position: 'absolute', left: '50%', top: '42%', width: 0, height: 0, pointerEvents: 'none' }}>{spark > 0 && <SparkBurst/>}</span>
          <div className="d2-diag-rows">
            {subs.map((s, i) => i < curr && (
              <div key={i} className="d2-diag-done g1-pop-in">
                <span style={{ color: '#1F7A4D', fontWeight: 800 }}>✓</span>
                <span className="d2-diag-donetxt">{lang === 'uz' ? 'Savol' : 'Вопрос'} {i + 1}</span>
              </div>
            ))}
            {sub && !solved && (
              <div ref={subRef} className="d2-diag-active">
                {sub.figure && <div style={{ display: 'flex', justifyContent: 'center' }}>{sub.figure}</div>}
                <p className="d2-diag-q">{t(sub.q)}</p>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 'clamp(7px, 1.6vw, 10px)' }}>
                  {sub.options.map((o, i) => {
                    const w = wrong.has(i);
                    return (
                      <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAns || w} onClick={() => pick(i)}
                        style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(10px, 1.8vw, 15px)', minHeight: 'clamp(44px, 6vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        {solved && (<div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={praiseWord}/></div>)}
        {solved && fact && <div ref={factRef}>{fact}</div>}
        {!solved && wrong.size > 0 && (<FeedbackBlock show={true} isCorrect={false} wrongClass="frame-tip"><Reaction state="wrong" praise={encWord}/></FeedbackBlock>)}
      </div>
    </Stage>
  );
};

// razryad savol-generatori: {tens, ones} figura + [to'g'ri, o'rin-almashgan, qo'shilgan, so'zma-so'z] variantlar.
const RZ_WRONG = {
  swap: { ru: 'Здесь цифры переставлены. Слева десятки, справа единицы.', uz: "Bu yerda raqamlar o'rni almashgan. Chapda o'nliklar, o'ngda birliklar." },
  sum: { ru: 'Это если сложить. А десятки и единицы стоят рядом, не складываются.', uz: "Bu — qo'shsak chiqadi. O'nlik va birlik yonma-yon turadi, qo'shilmaydi." },
  lit: { ru: 'Слишком большое. Десятки — левая цифра, а не сотни.', uz: "Juda katta. O'nliklar — chap raqam, yuzlik emas." }
};
const razryadSub = (tens, ones, order) => {
  const vals = [tens * 10 + ones, ones * 10 + tens, tens + ones, tens * 100 + ones];
  const types = ['correct', 'swap', 'sum', 'lit'];
  const optTypes = order.map((oi) => types[oi]);
  return {
    figure: <CassBattViz tens={tens} ones={ones} small/>,
    q: { ru: 'Какое число на дисплее двигателя?', uz: "Dvigatel displeyida qaysi son?" },
    options: order.map((oi, i) => <NumOpt key={i} v={vals[oi]}/>),
    correctIdx: order.indexOf(0),
    wrongText: (i, lg) => (RZ_WRONG[optTypes[i]] || RZ_WRONG.sum)[lg]
  };
};
// s10 — O'QISH paneli (Dars02): kod ko'rsatiladi, to'g'ri NOMni tanla (reversal + konkatenatsiya distraktori)
const TENS_NM = { ru: ['', 'десять', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'], uz: ['', "o'n", 'yigirma', "o'ttiz", 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', "to'qson"] };
const ONES_NM = { ru: ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'], uz: ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"] };
const numName = (code, lg) => { const t = Math.floor(code / 10), o = code % 10; return TENS_NM[lg][t] + (o > 0 ? ' ' + ONES_NM[lg][o] : ''); };
const concatNm = (code, lg) => ONES_NM[lg][Math.floor(code / 10)] + ' ' + ONES_NM[lg][code % 10];
const MiniCode = ({ code }) => {
  const t = Math.floor(code / 10), o = code % 10;
  return (
    <span style={{ display: 'inline-flex', gap: 3, padding: '7px 16px', borderRadius: 11, background: 'linear-gradient(180deg,#0e1526,#1a2340)', border: '2px solid #2c3554', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(30px,7vw,46px)', fontWeight: 800, lineHeight: 1 }}>
      <span style={{ color: '#FF9166', textShadow: '0 0 8px rgba(255,138,92,.6)' }}>{t}</span>
      <span style={{ color: '#5BD6F2', textShadow: '0 0 8px rgba(91,214,242,.6)' }}>{o}</span>
    </span>
  );
};
const NameOpt = ({ ru, uz }) => { const t = useT(); return <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 'clamp(15px,2.4vw,19px)' }}>{t({ ru, uz })}</span>; };
const READ_WRONG = {
  swap: { ru: 'Место цифр решает: слева десятки, справа единицы.', uz: "Raqam o'rni hal qiladi: chapda o'nliklar, o'ngda birliklar." },
  concat: { ru: 'Читаем по разрядам, а не по цифрам: имя десятков и имя единиц.', uz: "Xonalab o'qiymiz, raqamlab emas: o'nlik nomi va birlik nomi." }
};
const readSub = (code, order) => {
  const t = Math.floor(code / 10), o = code % 10;
  const rev = o * 10 + t;
  const defs = [{ ru: numName(code, 'ru'), uz: numName(code, 'uz') }, { ru: numName(rev, 'ru'), uz: numName(rev, 'uz') }, { ru: concatNm(code, 'ru'), uz: concatNm(code, 'uz') }];
  const types = ['correct', 'swap', 'concat'];
  return {
    figure: <MiniCode code={code}/>,
    q: { ru: 'Как читается код?', uz: "Kod qanday o'qiladi?" },
    options: order.map((oi, i) => <NameOpt key={i} ru={defs[oi].ru} uz={defs[oi].uz}/>),
    correctIdx: order.indexOf(0),
    wrongText: (i, lg) => (READ_WRONG[types[order[i]]] || READ_WRONG.swap)[lg]
  };
};
const S10_LABEL = { ru: 'Бортовой тест', uz: 'Bort testi' };
const S10_DONE = { ru: 'Отлично! Ты читаешь любой бортовой код.', uz: "Zo'r! Har qanday bort kodini o'qiysiz." };
const Screen10 = (props) => (
  <SeqMCPanel props={props} cKey="s10" panelLabel={S10_LABEL} doneText={S10_DONE} cols={1}
    subs={[readSub(63, [1, 0, 2]), readSub(52, [0, 2, 1]), readSub(47, [2, 1, 0]), readSub(74, [1, 2, 0])]}/>
);

// s11 — MASHQ-4 (scored MC): taqqoslash 45 va 54
// taqqoslash savol-generatori: ikki son, qaysi katta (avval o'nlikni solishtir).
const compareSub = (a, b) => ({
  figure: (
    <div style={{ display: 'flex', gap: 'clamp(10px, 2.4vw, 16px)', alignItems: 'center', justifyContent: 'center' }}>
      <CassBattViz tens={Math.floor(a / 10)} ones={a % 10} small/>
      <span className="mono" style={{ fontWeight: 800, fontSize: 'clamp(18px, 3.4vw, 24px)', color: T.ink3 }}>?</span>
      <CassBattViz tens={Math.floor(b / 10)} ones={b % 10} small/>
    </div>
  ),
  q: { ru: 'В каком энергоблоке заряда больше?', uz: "Qaysi blokda quvvat ko'p?" },
  options: [<NumOpt v={a}/>, <NumOpt v={b}/>],
  correctIdx: a > b ? 0 : 1,
  wrongText: (i, lg) => ({ ru: 'Сначала сравни десятки: у кого их больше, в том энергоблоке заряда больше.', uz: "Avval o'nliklarni solishtiring: kimda ko'p, o'sha blokda quvvat ko'p." }[lg])
});
// s11 — YOZISH paneli (Dars02): nom ko'rsatiladi, to'g'ri KODni tanla (reversal + qo'shish distraktori)
const NameFig = ({ code }) => { const t = useT(); return <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 'clamp(24px,5vw,34px)', color: T.ink }}>{t({ ru: numName(code, 'ru'), uz: numName(code, 'uz') })}</span>; };
const WRITE_WRONG = {
  swap: { ru: 'Имя десятков ставим слева. Проверь порядок цифр.', uz: "O'nlik nomini chapga qo'ying. Raqamlar tartibini tekshiring." },
  sum: { ru: 'Не складываем: десятки и единицы пишем рядом.', uz: "Qo'shmaymiz: o'nlik va birlikni yonma-yon yozamiz." }
};
const writeSub = (code, order) => {
  const t = Math.floor(code / 10), o = code % 10;
  const vals = [code, o * 10 + t, t + o];
  const types = ['correct', 'swap', 'sum'];
  return {
    figure: <NameFig code={code}/>,
    q: { ru: 'Какой это код?', uz: "Bu qanday kod?" },
    options: order.map((oi, i) => <NumOpt key={i} v={vals[oi]}/>),
    correctIdx: order.indexOf(0),
    wrongText: (i, lg) => (WRITE_WRONG[types[order[i]]] || WRITE_WRONG.swap)[lg]
  };
};
const S11_LABEL = { ru: 'Запись кода', uz: 'Kodni yozish' };
const S11_DONE = { ru: 'Верно! Ты записываешь код по имени.', uz: "To'g'ri! Nom bo'yicha kodni yozasiz." };
const Screen11 = (props) => (
  <SeqMCPanel props={props} cKey="s11" panelLabel={S11_LABEL} doneText={S11_DONE} cols={3}
    subs={[writeSub(53, [1, 0, 2]), writeSub(48, [0, 2, 1]), writeSub(29, [2, 1, 0]), writeSub(61, [1, 2, 0])]}/>
);

// s12 — MASALA (kirish/kontekst): yuk xati (keep-visible)
// s12+s13 BIRLASHTIRILGAN — YUK XATI masalasi: kontekst (6 kasseta 3 batareya) DOIM ko'rinadi + savol.
const SCASE_BASE = [<NumOpt v={63}/>, <NumOpt v={36}/>, <NumOpt v={9}/>, <NumOpt v={60}/>];
const ScreenCase = (props) => {
  const lang = useLang();
  const t = useT();
  const cx = CONTENT.s12;
  const cq = CONTENT.s13;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 'case_ctx', text: cx.audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 'case_q', text: cq.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAns = useCanAnswer(audio);
  const { options, correctIdx, content } = shuffleMC(cq, SCASE_BASE, 0, [0, 3, 1, 2]);
  const wasSolved = props.storedAnswer?.solved === true || props.storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const [praiseWord, setPraiseWord] = useState('');
  const [encWord, setEncWord] = useState('');
  const firstTryRef = useRef(props.storedAnswer ? (props.storedAnswer.firstTry ?? props.storedAnswer.correct ?? null) : null);
  const firstIdxRef = useRef(props.storedAnswer?.studentAnswerIndex ?? null);
  const attemptsRef = useRef(props.storedAnswer?.attempts ?? (wasSolved ? 1 : 0));
  const pick = (i) => {
    if (!canAns || solved || wrong.has(i)) return;
    const isC = i === correctIdx;
    if (firstTryRef.current === null) { firstTryRef.current = isC; firstIdxRef.current = i; }
    attemptsRef.current += 1; setPicked(i);
    if (isC) {
      setSolved(true); sfx.playCorrect();
      const pw = nextPraise(lang); setPraiseWord(pw);
      props.onAnswer({ stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: cq.q[lang], options: null, correctIndex: null, correctAnswer: '63', studentAnswerIndex: firstIdxRef.current, studentAnswer: null, correct: firstTryRef.current, firstTry: firstTryRef.current, attempts: attemptsRef.current, solved: true });
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(pw); e.pushOneOff(cq.audio.on_correct[lang]); } }
    } else {
      sfx.playWrong(); setEncWord(nextEncourage(lang));
      setWrong(p => { const s = new Set(p); s.add(i); return s; });
      if (!audio.muted) { const e = getAudioEngine(); if (e) { const wv = (content[`wrong_${i}`] && content[`wrong_${i}`][lang]) || cq.audio.on_wrong[lang]; e.pushOneOff(wv); } }
    }
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={cx.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <Bridge text={t(BRIDGES.s12)}/>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.9vw, 15px)', margin: 0 }}>{t(cx.lead)}</p>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(10px, 2vw, 14px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px,1.4vw,10px)', padding: 'clamp(10px,2vw,16px)', borderRadius: 12, background: '#F4F0E8', border: `1px dashed ${T.ink3}` }}>
            <span className="mono" style={{ fontSize: 'clamp(10px,1.5vw,12px)', fontWeight: 800, letterSpacing: '.1em', color: T.ink3, textTransform: 'uppercase' }}>{t(cx.manifest_label)}</span>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 'clamp(24px,5.4vw,36px)', color: T.ink }}>{t({ ru: numName(63, 'ru'), uz: numName(63, 'uz') })}</span>
          </div>
        </div>
        <h2 className="title fade-up" style={{ textAlign: 'center', fontSize: 'clamp(16px, 2.4vw, 20px)' }}>{t(cq.q)}</h2>
        {!solved ? (
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(7px, 1.6vw, 10px)' }}>
            {options.map((o, i) => { const w = wrong.has(i); return (<button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAns || w} onClick={() => pick(i)} style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(8px, 1.6vw, 12px)', minHeight: 'clamp(44px, 6vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{o}</button>); })}
          </div>
        ) : (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="g1-cele-wrap"><button className="option option-correct" disabled style={{ padding: 'clamp(8px, 1.4vw, 11px) clamp(18px, 2.6vw, 24px)', minHeight: 'clamp(44px, 6vw, 54px)', display: 'flex', alignItems: 'center', gap: 10 }}><span className="mono small" style={{ color: T.success }}>✓</span>{options[correctIdx]}</button><SparkBurst/></span>
          </div>
        )}
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip"><Reaction state={solved ? 'correct' : 'wrong'} praise={solved ? praiseWord : encWord}/></FeedbackBlock>
      </div>
    </Stage>
  );
};

// s14 — FINAL (scored, 4 ketma-ket razryad savol + FactCard): oxirgisi 47 (tablo).
const S14_LABEL = { ru: 'Финальный тест', uz: 'Yakuniy test' };
const S14_DONE = { ru: 'Тест пройден! Ты читаешь и пишешь любой бортовой код.', uz: "Test o'tdi! Har qanday bort kodini o'qiysiz va yozasiz." };
const Screen14 = (props) => {
  const c = CONTENT.s14;
  const t = useT();
  return (
    <SeqMCPanel props={props} cKey="s14" panelLabel={S14_LABEL} doneText={S14_DONE}
      factAudio={c.fact_audio}
      fact={(
        <div className="g1-factcard fade-up d2-fact-final">
          <span className="g1-factcard-badge mono">{t(c.fact_badge)}</span>
          <div className="g1-factcard-row">
            <FactRocket/>
            <p className="g1-factcard-txt">{t(c.fact_text)}</p>
          </div>
        </div>
      )}
      cols={1}
      subs={[readSub(58, [1, 0, 2]), writeSub(84, [0, 2, 1]), readSub(36, [2, 1, 0]), writeSub(72, [1, 2, 0])]}/>
  );
};

// s15 — YAKUN: uchish + QOIDA recap + bog'lanishlar
// A — EKIPAJ (sayohat skafandrida): Ra'no/Anvar/Zuhra/Jasur. Soddalashtirilgan kaska+vizor+kombinezon
// (kanonik yuzli SVG'lar — grade1 fayllaridan ko'chirish keyingi qadam, metodist ko'rib turib).
const CREW = [["Ra'no", '#E86A4E'], ['Anvar', '#2FA0CC'], ['Zuhra', '#8B6FB0'], ['Jasur', '#3E9B5F']];
const CrewMini = () => (
  <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 14px)', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-end' }}>
    {CREW.map(([name, col], i) => (
      <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.2 + i * 0.12}s`, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <svg viewBox="0 0 40 54" style={{ width: 'clamp(30px, 7vw, 44px)', height: 'auto', display: 'block' }} aria-hidden="true">
          <rect x="7" y="27" width="26" height="24" rx="9" fill={col}/>
          <rect x="7" y="27" width="26" height="8" rx="4" fill="rgba(255,255,255,0.22)"/>
          <rect x="16" y="40" width="8" height="4" rx="2" fill="rgba(255,255,255,0.85)"/>
          <circle cx="20" cy="18" r="13.5" fill="#EDE4D2" stroke="#C9BDA4" strokeWidth="1.6"/>
          <path d="M9 17 A 11 11 0 0 1 31 17 L31 21 A 11 11 0 0 1 9 21 Z" fill="#7EC0EE"/>
          <ellipse cx="15" cy="15" rx="3.4" ry="2.2" fill="rgba(255,255,255,0.7)"/>
        </svg>
        <b style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 1.4vw, 11px)', color: '#5A5A60', fontWeight: 700 }}>{name}</b>
      </span>
    ))}
  </div>
);
// s15 bayram: markaziy porthole atrofidagi chap/o'ng bo'sh zonalarni to'ldiruvchi
// suzuvchi yuk (yig'ilgan kargo) — kasseta: hover, batareya: float; turli tezlik/kechikish.
const S15_FLOAT = [
  { x: 7, y: 24, t: 'cass', dur: 6.4, del: 0 }, { x: 18, y: 58, t: 'batt', dur: 7.1, del: 0.5 },
  { x: 3, y: 70, t: 'cass', dur: 6.9, del: 0.9 }, { x: 22, y: 34, t: 'batt', dur: 5.8, del: 0.3 },
  { x: 14, y: 44, t: 'batt', dur: 6.6, del: 1.2 },
  { x: 90, y: 22, t: 'cass', dur: 6.7, del: 0.2 }, { x: 80, y: 56, t: 'batt', dur: 7.4, del: 0.7 },
  { x: 94, y: 70, t: 'cass', dur: 6.2, del: 0.4 }, { x: 78, y: 32, t: 'batt', dur: 5.6, del: 1.0 },
  { x: 86, y: 46, t: 'batt', dur: 6.9, del: 0.15 }
];
// HeroShip — StationScene bilan bir xil 3D raketa (burun chapda; nozsiz/raqamsiz, qayta ishlatiladi).
const HeroShip = () => (
  <svg viewBox="-18 -34 200 68" aria-hidden="true" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
    <defs>
      <linearGradient id="hsHull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8CA0B4"/><stop offset="20%" stopColor="#F0F5F9"/><stop offset="52%" stopColor="#BAC8D5"/><stop offset="100%" stopColor="#6C7A88"/></linearGradient>
      <radialGradient id="hsGlass" cx="38%" cy="30%" r="75%"><stop offset="0%" stopColor="#EAFCFF"/><stop offset="45%" stopColor="#5FC0DE"/><stop offset="100%" stopColor="#245C74"/></radialGradient>
      <linearGradient id="hsFin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9C7D4"/><stop offset="100%" stopColor="#66727F"/></linearGradient>
      <linearGradient id="hsNoz" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3A4652"/><stop offset="55%" stopColor="#8A97A4"/><stop offset="100%" stopColor="#4A5662"/></linearGradient>
      <linearGradient id="hsFlame" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FFF3C0"/><stop offset="45%" stopColor="#FF9A3C"/><stop offset="100%" stopColor="#FF4F28" stopOpacity="0"/></linearGradient>
    </defs>
    {/* ikkala dvigatel alangasi (ikki turbina) */}
    <g style={{ animation: 'g1pulse 0.32s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'left center' }}>
      <path d="M126 -12 Q152 -8 176 -8 Q152 -1 126 -3 Z" fill="url(#hsFlame)"/>
      <path d="M126 12 Q152 8 176 8 Q152 1 126 3 Z" fill="url(#hsFlame)"/>
      <path d="M126 -10 Q144 -8 158 -8 Q144 -5 126 -6 Z" fill="#FFF6D2" opacity="0.85"/>
      <path d="M126 10 Q144 8 158 8 Q144 5 126 6 Z" fill="#FFF6D2" opacity="0.85"/>
    </g>
    <path d="M68 -15 L92 -29 L96 -12 Z" fill="url(#hsFin)" stroke="#5E7183" strokeWidth="1"/>
    <path d="M68 15 L92 29 L96 12 Z" fill="url(#hsFin)" stroke="#5E7183" strokeWidth="1"/>
    <path d="M8 -17 Q-14 0 8 17 L100 17 Q111 11 111 0 Q111 -11 100 -17 Z" fill="url(#hsHull)" stroke="#5E7183" strokeWidth="1.8"/>
    <path d="M2 -12 Q44 -20 102 -12" stroke="#FFFFFF" strokeWidth="2.2" opacity="0.5" fill="none" strokeLinecap="round"/>
    <rect x="100" y="-14" width="12" height="28" rx="3" fill="#8A97A4" stroke="#5E7183" strokeWidth="1.4"/>
    <path d="M112 -11 L126 -14 L126 -3 L112 -5 Z" fill="url(#hsNoz)" stroke="#3A4652" strokeWidth="0.8"/>
    <path d="M112 11 L126 14 L126 3 L112 5 Z" fill="url(#hsNoz)" stroke="#3A4652" strokeWidth="0.8"/>
    <ellipse cx="28" cy="0" rx="11" ry="11" fill="url(#hsGlass)" stroke="#5E7183" strokeWidth="1.5"/>
    <ellipse cx="24" cy="-4" rx="4" ry="2.5" fill="#EAFCFF" opacity="0.7"/>
    <rect x="54" y="-7" width="26" height="15" rx="3" fill="#0B1220"/>
    <circle className="d2-neon" cx="63" cy="0.5" r="2.6" fill="#6EF29B"/><circle className="d2-neon" style={{ animationDelay: '.5s' }} cx="71" cy="0.5" r="2.6" fill="#FFC23C"/>
  </svg>
);
// WarpDepart — Dars05 xulosa sahnasi: kema WARP tezligida, cho'zilgan yulduzlar + kometalar oralab uchadi.
const WARP_STREAKS = [[10, 3], [22, 7], [35, 2], [48, 9], [60, 4], [72, 7], [85, 3], [15, 6], [40, 5], [66, 8], [90, 6], [28, 4], [54, 7], [78, 5], [6, 5], [95, 4]];
const WarpDepart = () => (
  <div className="d2-scene" style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a2848 0%, #0a0f1e 66%, #05070f 100%)' }}>
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: '48%', height: '48%', background: 'radial-gradient(circle, rgba(120,170,255,0.32), transparent 68%)', filter: 'blur(6px)', zIndex: 0, pointerEvents: 'none', animation: 'd2warpglow 3s ease-in-out infinite' }}/>
    {WARP_STREAKS.map(([y, len], i) => (
      <div key={i} aria-hidden="true" style={{ position: 'absolute', top: `${y}%`, left: 0, width: `${18 + len * 4}%`, height: 'clamp(1.5px,0.5vw,3px)', borderRadius: 2, background: `linear-gradient(90deg, transparent, ${i % 3 ? '#BFE3FF' : '#FFFFFF'})`, boxShadow: `0 0 6px ${i % 3 ? 'rgba(120,180,255,0.7)' : 'rgba(255,255,255,0.7)'}`, zIndex: 1, animation: `d2warpstreak ${1.4 + (i % 5) * 0.3}s cubic-bezier(0.45,0,0.9,0.5) ${i * 0.13}s infinite` }}/>
    ))}
    {[[16, '#8FE0F4'], [64, '#FFD873']].map(([y, c], i) => (
      <div key={`c${i}`} aria-hidden="true" style={{ position: 'absolute', top: `${y}%`, left: '70%', zIndex: 2, animation: `d2comet ${3.4 + i * 0.8}s linear ${i * 1.6}s infinite` }}>
        <div style={{ width: 'clamp(30px,7vw,50px)', height: 'clamp(3px,0.8vw,5px)', borderRadius: 3, background: `linear-gradient(90deg, transparent, ${c})` }}/>
        <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 'clamp(7px,1.6vw,11px)', height: 'clamp(7px,1.6vw,11px)', borderRadius: '50%', background: c, boxShadow: `0 0 10px ${c}` }}/>
      </div>
    ))}
    <div style={{ position: 'absolute', left: '48%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(42%, 210px)', zIndex: 3, animation: 'd2hover 4.5s ease-in-out infinite' }}>
      <div style={{ transform: 'scaleX(-1)' }}><HeroShip/></div>
    </div>
    <div className="d2-scene-bit"><span className="g1-cast-fig"><BitSVG state="present"/></span></div>
  </div>
);
// MarsCargoDone — XULOSA sahnasi (mazmunli): ekipaj Marsda, yuk BAZADA ustunlab sanaldi —
// natija (jami) yashil tabloda ✓ bilan chiqadi. Eski «MarsApproach» (kemaning Marsga
// yaqinlashishi) bu dars uchun mantiqsiz edi: ekipaj allaqachon Marsda, yuk sanash — dars mavzusi.
const MarsCargoDone = ({ total, label }) => {
  const t = useT();
  return (
    <div className="d2-scene" style={{ background: 'radial-gradient(ellipse at 50% 20%, #34180f 0%, #140a08 78%)' }}>
      {D8_MARS_STARS.map(([x, y], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 1, fontSize: `${8 + (i % 3) * 3}px`, color: '#FFE3C0', textShadow: '0 0 5px currentColor', animation: `g1twinkle ${1.6 + (i % 4) * 0.4}s ease-in-out ${i * 0.15}s infinite`, pointerEvents: 'none' }}>✦</span>
      ))}
      <MarsMoon x={15} y={12} s={20} c="#c9b8a8"/>
      <MarsMoon x={29} y={20} s={12} c="#b9a89a"/>
      <div style={{ position: 'absolute', right: '14%', top: '14%', width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle at 38% 38%, #8ED0FF, #2A6FB0)', boxShadow: '0 0 9px rgba(120,200,255,0.85)', zIndex: 1 }} aria-hidden="true"/>
      {/* Mars sirti */}
      <div style={{ position: 'absolute', left: '-6%', right: '-6%', bottom: 0, height: '44%', background: 'linear-gradient(180deg,#C1502E 0%,#9A3D1E 55%,#7E3418 100%)', borderRadius: '50% 50% 0 0 / 40% 40% 0 0', boxShadow: 'inset 0 6px 18px rgba(255,180,120,0.28)' }}/>
      <MarsCrater x={28} y={10} w={46}/>
      <MarsCrater x={66} y={8} w={34}/>
      <MarsRock x={6} y={17} s={20}/>
      <MarsRock x={87} y={13} s={22}/>
      {/* yuk ombori (chap) + qo'ngan kema (o'ng) */}
      <div style={{ position: 'absolute', left: '19%', bottom: '25%', transform: 'translateX(-50%)', width: 'clamp(116px,30vw,182px)', zIndex: 4 }}><CargoBase w="100%"/></div>
      <div style={{ position: 'absolute', right: '12%', bottom: '26%', transform: 'translateX(50%)', width: 'clamp(56px,14vw,84px)', zIndex: 4 }}><LandedRocket w="100%"/></div>
      {/* sanab bo'lingan yuk (dekor, ketma-ket pop-in) */}
      <div style={{ position: 'absolute', left: '49%', bottom: '16%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end', gap: 'clamp(4px,1.2vw,8px)', zIndex: 5 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="g1-pop-in" aria-hidden="true" style={{ animationDelay: `${0.35 + i * 0.26}s`, width: `clamp(${24 - i * 2}px,${6 - i}vw,${36 - i * 3}px)`, height: `clamp(${24 - i * 2}px,${6 - i}vw,${36 - i * 3}px)`, borderRadius: 6, background: 'linear-gradient(160deg,#E7A57A,#C96A3F)', border: '2px solid #9A4526', boxShadow: '0 3px 7px rgba(0,0,0,0.4)' }}/>
        ))}
      </div>
      {/* natija tablosi: jami + ✓ */}
      <div style={{ position: 'absolute', left: '49%', top: '7%', transform: 'translateX(-50%)', zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 'clamp(9px,1.6vw,12px)', fontWeight: 800, letterSpacing: '.05em', color: '#FFE3C0', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{t(label)}</span>
        <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 'clamp(52px,11vw,72px)', height: 'clamp(38px,7.4vw,50px)', padding: '0 clamp(10px,2vw,15px)', justifyContent: 'center', borderRadius: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px,4.6vw,30px)', background: T.successSoft, color: T.success, border: `2.5px solid ${T.success}`, boxShadow: '0 4px 14px -4px rgba(31,122,77,0.5)' }}>
          {total}<span style={{ fontSize: 'clamp(17px,3.4vw,23px)' }}>✓</span>
        </div>
      </div>
      <div className="d2-scene-bit"><span className="g1-cast-fig"><BitSVG state="present"/></span></div>
    </div>
  );
};
const Screen15 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s15;
  // chap StageHero olib tashlandi (WarpScene ichidagi bayram-Bit yetarli) — mood 'present' qilinmaydi
  const audio = useAudio([brgSeg('s15', lang), { id: 's15_pay', text: S15_PAYOFF[lang], trigger: 'after_previous', waits_for: null }, { id: 's15_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 16px)', position: 'relative' }}>
        <Bridge text={t(BRIDGES.s15)}/>
        {/* tepada ixcham 3 yulduz (maqtov-matnsiz — skrollsiz) */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.1 + i * 0.18}s`, display: 'inline-flex' }}>
              <svg viewBox="0 0 40 40" style={{ width: 'clamp(26px,6vw,34px)', height: 'auto', animation: `g1twinkle ${1.8 + i * 0.3}s ease-in-out ${0.7 + i * 0.25}s infinite` }} aria-hidden="true">
                <path d="M20 3 L25.2 14.6 L38 16 L28.5 24.6 L31.2 37 L20 30.4 L8.8 37 L11.5 24.6 L2 16 L14.8 14.6 Z" fill="#FFC23C"/>
              </svg>
            </span>
          ))}
        </div>
        <Confetti/>
        <div className="frame-success fade-up">
          <h2 className="title h-title" style={{ margin: 0 }}>{t(c.mission_done)}</h2>
          <p className="title" style={{ margin: 'clamp(4px, 1vw, 8px) 0 0', fontSize: 'clamp(14px, 2vw, 17px)', color: '#1F7A4D' }}>{t(c.cando)}</p>
        </div>
        {/* Yakun sahnasi: Saturn konida kristallar teng ulashildi (12÷3=4) + ✓ */}
        <div className="fade-up delay-1">
          <UranField label={{ ru: 'Линии различены', uz: 'Chiziqlar ajratildi' }}/>
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// DARS03 EKRANLARI (thin) — s5..s14: OmborRaf / CodeTablo + qayta ishlatiladigan Stage-lar
// (Eski Dars02 Screen5..Screen14 tanаlari YUQORIDA dead-code — screens massivida ishlatilmaydi.)
// ============================================================
const LBL_T = { ru: 'десятки', uz: "o'nliklar" };
const LBL_O = { ru: 'единицы', uz: 'birliklar' };
// ============================================================
// DropColumnStage — Dars07 amaliyot mexanikasi: o'quvchi raqam-plitalarni bo'sh natija
// katakchalariga SUDRAB (drag) yoki BOSIB (tap) qo'yadi. Ikkalasi to'g'ri bo'lsa —
// столбик yechim bosqichma-bosqich animatsiya bilan ochiladi (birlik -> o'nlik).
// ============================================================
const DROP_HINT = { ru: 'Перетащи цифры в пустые клетки', uz: "Raqamlarni bo'sh katakchalarga sudrab qo'y" };
const D8_TILE = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(40px,9vw,54px)', height: 'clamp(48px,10vw,62px)', borderRadius: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(24px,5.4vw,34px)', background: 'linear-gradient(180deg,#ffffff,#EEF2F6)', border: '2px solid #B9C4D2', color: T.ink, boxShadow: '0 3px 8px -3px rgba(0,0,0,0.3)', cursor: 'grab', touchAction: 'none', userSelect: 'none' };
const d8Shuffle = (arr, seed) => {
  const a = [...arr]; let s = (seed + 1) * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 233280 + 1) % 99991; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const d8BuildTiles = (st, su, seed) => {
  const need = [st, su];
  const cand = [(su + 1) % 10, (st + 1) % 10, (su + 3) % 10, (st + 7) % 10, (su + 6) % 10];
  const dist = [];
  for (const d of cand) { if (dist.length >= 3) break; if (d !== st && d !== su && !dist.includes(d)) dist.push(d); }
  while (dist.length < 3) { const d = (dist.length + su + 4) % 10; if (d !== st && d !== su && !dist.includes(d)) dist.push(d); else dist.push((d + 1) % 10); }
  return d8Shuffle([...need, ...dist], seed).map((d, i) => ({ id: `${seed}-${i}`, d }));
};
const D8DropSlot = React.forwardRef(({ digit, color, state, onClear }, ref) => {
  const border = state === 'ok' ? T.success : state === 'wrong' ? '#D64545' : state === 'filled' ? color : '#A7A6A2';
  const bg = state === 'ok' ? T.successSoft : state === 'wrong' ? '#FBEEEE' : '#ffffff';
  const clickable = digit != null && state !== 'ok';
  return (
    <span ref={ref} onClick={clickable ? onClear : undefined} className={state === 'ok' ? 'g1-pop-in' : ''}
      style={{ ...colCell, borderRadius: 10, border: `2.5px ${digit != null ? 'solid' : 'dashed'} ${border}`, background: bg, color: state === 'ok' ? T.success : (digit != null ? color : T.ink3), cursor: clickable ? 'pointer' : 'default', transition: 'all .2s' }}>
      {digit != null ? digit : ''}
    </span>
  );
});
const DropColumnStage = ({ props, cKey, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const isArr = Array.isArray(c.audio[lang]);
  const audio = useAudio(isArr
    ? [brgSeg(cKey, lang), ...c.audio[lang].map((text, i) => ({ id: `${cKey}_${i}`, text, trigger: 'after_previous', waits_for: null }))]
    : [brgSeg(cKey, lang), { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]
  );
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const a = cur.a, b = cur.b, sum = a + b;
  const at = Math.floor(a / 10), au = a % 10, bt = Math.floor(b / 10), bu = b % 10;
  const st = Math.floor(sum / 10), su = sum % 10;
  const tiles = React.useMemo(() => d8BuildTiles(st, su, ri), [ri, st, su]);
  const [placed, setPlaced] = useState({ tens: null, units: null });
  const [wrongFlash, setWrongFlash] = useState(null);
  const [solved, setSolved] = useState(false);
  const [reveal, setReveal] = useState(0);
  const attemptsRef = useRef(0);
  const wrongRef = useRef(0);
  const tmrRef = useRef([]);
  const tensRef = useRef(null);
  const unitsRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const evalRef = useRef(false);

  useEffect(() => () => tmrRef.current.forEach(clearTimeout), []);

  const tileById = (id) => tiles.find((tl) => tl.id === id);
  const usedIds = [placed.tens, placed.units].filter((x) => x != null);
  const trayTiles = tiles.filter((tl) => !usedIds.includes(tl.id));
  const digitOf = (slot) => (placed[slot] != null ? tileById(placed[slot]).d : null);

  const report = (correct) => {
    if (!props.onAnswer) return;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: t(cur.q || c.lead), options: [], correctIndex: -1, correctAnswer: String(sum), studentAnswerIndex: null, studentAnswer: String(sum), correct, firstTry: correct, attempts: attemptsRef.current, solved: true });
  };
  const nextRound = () => {
    tmrRef.current.forEach(clearTimeout); tmrRef.current = [];
    setRi((r) => r + 1); setPlaced({ tens: null, units: null }); setWrongFlash(null); setSolved(false); setReveal(0);
    attemptsRef.current = 0; wrongRef.current = 0; evalRef.current = false;
  };
  const placeTile = (slot, tileId) => {
    if (solved) return;
    setWrongFlash(null);
    setPlaced((p) => { const np = { ...p }; if (np.tens === tileId) np.tens = null; if (np.units === tileId) np.units = null; np[slot] = tileId; return np; });
  };
  const clearSlot = (slot) => { if (solved) return; setWrongFlash(null); setPlaced((p) => ({ ...p, [slot]: null })); };

  // baholash — ikki katak ham to'lganda
  useEffect(() => {
    if (solved || evalRef.current) return;
    if (placed.tens == null || placed.units == null) return;
    const dt = tileById(placed.tens).d, du = tileById(placed.units).d;
    attemptsRef.current += 1;
    if (dt === st && du === su) {
      evalRef.current = true;
      sfx.playCorrect();
      const ft = wrongRef.current === 0;
      setSolved(true);
      if (meta.scored) report(ft);
      if (!audio.muted) { const e = getAudioEngine(); if (e) { if (!isArr && c.audio.on_correct) e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } }
      setReveal(1);
      tmrRef.current.push(setTimeout(() => setReveal(2), 1300));
      tmrRef.current.push(setTimeout(() => setReveal(3), 2600));
    } else {
      wrongRef.current += 1;
      sfx.playWrong();
      const wf = (dt !== st && du !== su) ? 'both' : (dt !== st ? 'tens' : 'units');
      setWrongFlash(wf);
      if (!audio.muted && !isArr && c.audio.on_wrong) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
      tmrRef.current.push(setTimeout(() => {
        setWrongFlash(null);
        setPlaced((p) => { const np = { ...p }; if (dt !== st) np.tens = null; if (du !== su) np.units = null; return np; });
      }, 950));
    }
  }, [placed]); // eslint-disable-line

  // pointer drag/tap
  const hit = (ref, x, y) => { const el = ref.current; if (!el) return false; const r = el.getBoundingClientRect(); return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 10 && y <= r.bottom + 10; };
  const slotAt = (x, y) => (hit(tensRef, x, y) ? 'tens' : hit(unitsRef, x, y) ? 'units' : null);
  const onDown = (tileId, d, e) => {
    if (!canAct || solved) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    dragRef.current = { tileId, d, x: e.clientX, y: e.clientY, downX: e.clientX, downY: e.clientY, moved: false };
    setDrag({ ...dragRef.current });
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const moved = dragRef.current.moved || Math.hypot(e.clientX - dragRef.current.downX, e.clientY - dragRef.current.downY) > 6;
    dragRef.current = { ...dragRef.current, x: e.clientX, y: e.clientY, moved };
    setDrag({ ...dragRef.current });
  };
  const onUp = (e) => {
    const dr = dragRef.current; if (!dr) { return; }
    let slot = slotAt(e.clientX, e.clientY);
    if (!slot && !dr.moved) slot = placed.units == null ? 'units' : (placed.tens == null ? 'tens' : null);
    if (slot) placeTile(slot, dr.tileId);
    dragRef.current = null; setDrag(null);
  };

  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const slotState = (slot, digit) => solved ? 'ok' : (wrongFlash === slot || wrongFlash === 'both') ? 'wrong' : (digit != null ? 'filled' : 'empty');
  const dimT = reveal === 1, dimU = reveal === 2;
  const stepText = reveal === 1
    ? { ru: `Единицы: ${au} + ${bu} = ${su}`, uz: `Birliklar: ${au} + ${bu} = ${su}` }
    : reveal >= 2
      ? { ru: `Десятки: ${at} + ${bt} = ${st}`, uz: `O'nliklar: ${at} + ${bt} = ${st}` }
      : null;
  const resTens = <D8DropSlot ref={tensRef} digit={digitOf('tens')} color="#FF4F28" state={slotState('tens', digitOf('tens'))} onClear={() => clearSlot('tens')}/>;
  const resUnits = <D8DropSlot ref={unitsRef} digit={digitOf('units')} color="#019ACB" state={slotState('units', digitOf('units'))} onClear={() => clearSlot('units')}/>;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', touchAction: 'none' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead || cur.q)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {cur.q && c.lead && <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.ink2, fontSize: 'clamp(14px, 2vw, 16px)', textAlign: 'center' }}>{t(cur.q)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px,2vw,14px)', padding: 'clamp(14px, 2.6vw, 20px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <ColumnCard at={at} au={au} bt={bt} bu={bu} dimT={dimT} dimU={dimU} resTens={resTens} resUnits={resUnits}/>
          {stepText && <div className="g1-pop-in" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(15px,2.8vw,20px)', color: T.success }}>{t(stepText)}</div>}
          {!solved && (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px,1.6vw,11px)', minHeight: 'clamp(48px,10vw,62px)' }}>
                {trayTiles.map((tl) => (
                  <span key={tl.id} onPointerDown={(e) => onDown(tl.id, tl.d, e)} onPointerMove={onMove} onPointerUp={onUp}
                    style={{ ...D8_TILE, opacity: (drag && drag.tileId === tl.id) ? 0.25 : (canAct ? 1 : 0.5) }}>{tl.d}</span>
                ))}
              </div>
              <p className="fade-up" style={{ margin: 0, fontSize: 'clamp(12px,1.9vw,14px)', fontWeight: 700, color: T.ink3, textAlign: 'center' }}>{t(DROP_HINT)}</p>
            </>
          )}
        </div>
        {wrongFlash && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
      {drag && (
        <div style={{ position: 'fixed', left: drag.x, top: drag.y, transform: 'translate(-50%,-50%)', zIndex: 9999, pointerEvents: 'none', ...D8_TILE, cursor: 'grabbing', boxShadow: '0 8px 18px -4px rgba(0,0,0,0.45)' }}>{drag.d}</div>
      )}
    </Stage>
  );
};
// (Dars07 «столбik» oilasi DropColumnStage Dars13 da ISHLATILMAYDI — o'lik kod.)

// ============================================================
// «TENG QATORLAR MASSIVI» — Dars13 mexanikasi (metodist 2026-07-15).
// R qator × C hosil; bola bir qatorni sanaydi → teng qatorlar → takroriy qo'shish
// (C+C+C) → «R marta C» = «R × C». ArrayViz reveal 0-3. Mashq: ArrayStage (bitta MC + reveal).
// ============================================================
// CropSprout — hosil ko'chati: hajmli (gradient + barg-tomir + kurtak + soya). 3D ko'rinish.
const CropSprout = ({ s = 24 }) => (
  <svg viewBox="0 0 26 30" width={s} height={s * 30 / 26} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="d13stem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2E9B4E"/><stop offset="45" stopColor="#57D383"/><stop offset="1" stopColor="#2E9B4E"/></linearGradient>
      <radialGradient id="d13leaf" cx="32%" cy="28%" r="82%"><stop offset="0" stopColor="#8FEAA6"/><stop offset="58%" stopColor="#46C86C"/><stop offset="100%" stopColor="#2A8F48"/></radialGradient>
    </defs>
    <ellipse cx="13" cy="27.6" rx="7.6" ry="2.2" fill="rgba(0,0,0,0.3)"/>
    <path d="M13 27.5 V10.5" stroke="url(#d13stem)" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M13 19.5 C 4.5 18.5 2.5 12 4.5 6.5 C 11.5 8 13 13 13 19.5 Z" fill="url(#d13leaf)" stroke="#2A8F48" strokeWidth="0.5"/>
    <path d="M13 17.5 C 21.5 16.5 23.5 10 21.5 4.5 C 14.5 6 13 11 13 17.5 Z" fill="url(#d13leaf)" stroke="#2A8F48" strokeWidth="0.5"/>
    <path d="M13 18.5 Q9 15.5 6 10" stroke="#2A8F48" strokeWidth="0.7" fill="none" opacity="0.55"/>
    <path d="M13 16.5 Q17 13.5 20 8" stroke="#2A8F48" strokeWidth="0.7" fill="none" opacity="0.55"/>
    <circle cx="13" cy="8.6" r="2.4" fill="#9EE87F"/>
    <circle cx="12.1" cy="7.9" r="0.95" fill="#D6F8BE"/>
  </svg>
);
const ARR_CELL = 'clamp(20px,4.8vw,30px)';
// Golo-panel nuqtasi (abstrakt counter) — porlaydigan doira.
const GeoDot = () => (
  <span aria-hidden="true" style={{ display: 'inline-block', width: 'clamp(15px,3.6vw,22px)', height: 'clamp(15px,3.6vw,22px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #9CF3D0, #35C88A 58%, #1C8F5F)', boxShadow: '0 0 7px 1px rgba(53,200,138,0.55), inset 0 -2px 3px rgba(0,0,0,0.28), inset 0 2px 2px rgba(255,255,255,0.35)' }}/>
);
// ArrayViz — variant 'geo' (porlaydigan nuqta massivi, golo-panel — tushuntirish/mashq) yoki
// 'plant' (haqiqiy o'simlik, tuproq — yakuniy test). reveal 0-3: massiv→qator-struktura→takroriy qo'shish→R×C.
const ArrayViz = ({ r, c, reveal = 0, variant = 'geo' }) => {
  const t = useT();
  const total = r * c;
  const plant = variant === 'plant';
  const rowHi = plant ? 'rgba(255,220,120,0.5)' : 'rgba(90,214,180,0.55)';
  const rowBg = plant ? 'rgba(255,255,255,0.06)' : 'rgba(90,214,180,0.1)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px,1.8vw,12px)' }}>
      {/* massiv — teng qatorlar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: plant ? 'clamp(4px,1.2vw,7px)' : 'clamp(5px,1.4vw,9px)', padding: 'clamp(9px,2.2vw,15px)', borderRadius: 14, background: plant ? 'linear-gradient(180deg,#6E4A2A,#4E3218)' : 'linear-gradient(180deg,#122234,#0A1420)', border: `2px solid ${plant ? '#3A2510' : '#243C52'}`, boxShadow: plant ? 'inset 0 2px 8px rgba(0,0,0,0.4)' : 'inset 0 2px 10px rgba(0,0,0,0.5), 0 0 0 1px rgba(90,180,220,0.14)' }}>
        {Array.from({ length: r }).map((_, ri) => (
          <div key={ri} style={{ display: 'flex', gap: plant ? 'clamp(3px,1vw,6px)' : 'clamp(6px,1.6vw,11px)', justifyContent: 'center', alignItems: 'center', padding: '2px clamp(5px,1.4vw,9px)', borderRadius: 8, background: reveal >= 1 ? rowBg : 'transparent', boxShadow: reveal >= 1 ? `inset 0 0 0 1.5px ${rowHi}` : 'none', transition: 'all .3s' }}>
            {Array.from({ length: c }).map((_, ci) => plant
              ? <span key={ci} style={{ width: ARR_CELL, height: ARR_CELL, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CropSprout s={20}/></span>
              : <GeoDot key={ci}/>)}
          </div>
        ))}
      </div>
      {reveal >= 1 && <p className="fade-up" style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(13px,2vw,16px)', color: plant ? '#C08A2E' : '#2FB584' }}>{t({ ru: `${r} ряда по ${c}`, uz: `${r} qator, ${c} tadan` })}</p>}
      {reveal >= 2 && (
        <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(3px,1vw,6px)', flexWrap: 'wrap', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(16px,3.2vw,23px)' }}>
          {Array.from({ length: r }).map((_, i) => (<React.Fragment key={i}>{i > 0 && <span style={{ color: T.ink3 }}>+</span>}<span style={{ color: '#2E9B4E' }}>{c}</span></React.Fragment>))}
          <span style={{ color: T.ink3 }}>=</span><span style={{ color: reveal >= 3 ? T.success : T.ink3 }}>{reveal >= 3 ? total : '?'}</span>
        </div>
      )}
      {reveal >= 3 && (
        <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px,4.6vw,32px)', color: T.ink }}>{r} × {c}</span>
          <span style={{ color: T.ink3, fontWeight: 800 }}>=</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(24px,5vw,34px)', color: T.success }}>{total}</span>
        </div>
      )}
    </div>
  );
};
// CommuteViz — O'RIN ALMASHISH: bir massiv (R×C) va uni BURGAN massiv (C×R) yonma-yon; ikkalasi ham
// bir xil jami. reveal 0 -> faqat chap; 1 -> o'ng (burilgan) paydo bo'ladi; 2 -> a×b=b×a=jami tenglama.
const CDot = () => (
  <span aria-hidden="true" style={{ display: 'inline-block', width: 'clamp(11px,2.7vw,16px)', height: 'clamp(11px,2.7vw,16px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #9CF3D0, #35C88A 58%, #1C8F5F)', boxShadow: '0 0 5px 1px rgba(53,200,138,0.5), inset 0 -1px 2px rgba(0,0,0,0.28)' }}/>
);
const MiniArray = ({ rows, cols }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3px,1vw,5px)', padding: 'clamp(6px,1.6vw,10px)', borderRadius: 11, background: 'linear-gradient(180deg,#122234,#0A1420)', border: '2px solid #243C52', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
    {Array.from({ length: rows }).map((_, ri) => (
      <div key={ri} style={{ display: 'flex', gap: 'clamp(3px,1.1vw,6px)', justifyContent: 'center' }}>
        {Array.from({ length: cols }).map((_, ci) => <CDot key={ci}/>)}
      </div>
    ))}
  </div>
);
const CommuteViz = ({ r, c, reveal = 2 }) => {
  const total = r * c;
  const lab = (a, b) => (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(13px,2.4vw,18px)', color: '#2FB584' }}>{a} × {b}</span>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px,2vw,14px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px,1.6vw,12px)', flexWrap: 'nowrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <MiniArray rows={r} cols={c}/>{lab(r, c)}
        </div>
        {reveal >= 1 && (
          <div className="g1-pop-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: T.accent }}>
            <span style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800 }}>↻</span>
            <span style={{ fontSize: 'clamp(9px,1.5vw,11px)', fontWeight: 800 }}>bur</span>
          </div>
        )}
        {reveal >= 1 && (
          <div className="g1-pop-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <MiniArray rows={c} cols={r}/>{lab(c, r)}
          </div>
        )}
      </div>
      {reveal >= 2 && (
        <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px,1.2vw,8px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(16px,3.4vw,24px)' }}>
          <span style={{ color: T.ink }}>{r} × {c}</span><span style={{ color: T.ink3 }}>=</span>
          <span style={{ color: T.ink }}>{c} × {r}</span><span style={{ color: T.ink3 }}>=</span>
          <span style={{ color: T.success }}>{total}</span>
        </div>
      )}
    </div>
  );
};
// MC opsiyalari (deterministik, distraktor=misconception: R+C qo'shish, qator kam/ortiq).
const uniqOpts = (correct, cands, seed) => {
  const out = [correct];
  for (const v of cands) { if (out.length >= 4) break; if (Number.isInteger(v) && v >= 0 && v <= 100 && !out.includes(v)) out.push(v); }
  let k = 1;
  while (out.length < 4) { const v = correct + (k % 2 ? k + 1 : -(k + 1)); if (Number.isInteger(v) && v >= 0 && v <= 100 && !out.includes(v)) out.push(v); k += 1; if (k > 80) break; }
  const arr = [...out]; let s = (seed + 3) * 9301 + 49297;
  for (let i = arr.length - 1; i > 0; i -= 1) { s = (s * 233280 + 1) % 99991; const j = s % (i + 1); const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
  return arr.map((v) => ({ v, ok: v === correct }));
};
const arrayOpts = (r, c, seed) => uniqOpts(r * c, [r + c, r * c - c, r * c + c, r * c - 1], seed);
const ARR_Q = { ru: 'Сколько всего?', uz: 'Jami nechta?' };
const ARR_OPT = { padding: 'clamp(10px,1.7vw,13px)', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", minHeight: 'clamp(46px,7vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
// KO'PAYTIRISH JADVALI (yordamchi) — 1..max × 1..max. O'quvchi hali jadvalни bilmaydi, shuning uchun
// har test slaydidа ochib ishlata oladi (metodist 2026-07-15). Kichik (1–6) — birinchi dars uchun.
const MTBL_CELL = { textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(10px,2.1vw,14px)', padding: 'clamp(3px,0.9vw,6px) 0', borderRadius: 4, minWidth: 'clamp(20px,4.8vw,30px)', transition: 'all .3s' };
// hr/hc — yoritiladigan satr/ustun (tushuntirish uchun); hres — kesishuv katagini yashil qiladi.
const MultTable = ({ max = 6, hr = 0, hc = 0, hres = false }) => {
  const nums = [];
  for (let i = 1; i <= max; i += 1) nums.push(i);
  const hdr = (on) => ({ ...MTBL_CELL, color: '#fff', background: on ? '#C1381A' : T.accent, boxShadow: on ? '0 0 0 2px #FFC7B8' : 'none' });
  return (
    <div className="fade-up" style={{ display: 'inline-block', padding: 'clamp(6px,1.6vw,10px)', borderRadius: 12, background: '#FFFFFF', border: `2px solid ${T.accent}`, boxShadow: '0 6px 18px -6px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${max + 1}, 1fr)`, gap: 'clamp(2px,0.6vw,4px)' }}>
        <span style={{ ...MTBL_CELL, color: T.accent }}>×</span>
        {nums.map((n) => <span key={`h${n}`} style={hdr(n === hc)}>{n}</span>)}
        {nums.map((rn) => (
          <React.Fragment key={`r${rn}`}>
            <span style={hdr(rn === hr)}>{rn}</span>
            {nums.map((cn) => {
              const isRes = hres && rn === hr && cn === hc;
              const inLine = rn === hr || cn === hc;
              const bg = isRes ? T.success : inLine && (hr || hc) ? '#FFE8E1' : ((rn + cn) % 2 ? '#F6F4EF' : '#ECE8DF');
              return <span key={`${rn}x${cn}`} className={isRes ? 'g1-pop-in' : ''} style={{ ...MTBL_CELL, color: isRes ? '#fff' : T.ink, background: bg, boxShadow: isRes ? '0 0 0 2px #A7E0BF' : 'none' }}>{rn * cn}</span>;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
const TBL_SHOW = { ru: 'Таблица умножения', uz: "Ko'paytirish jadvali" };
const TBL_HIDE = { ru: 'Скрыть таблицу', uz: 'Jadvalni yashirish' };

// ============================================================
// «BO'LISH» MEXANIKASI (Dars19, Б4 SATURN — metodist tanlagan ikki mexanika):
//  1) DealStage/DealViz — TENG ULASHISH (partitiv): JAMI ni k idishga birma-bir tarqatamiz →
//     «har biriga nechta?». reveal 0=uyum, 1=idishlarga ulashilgan, 2=tenglama total÷groups=per.
//  2) ArrayRevStage/ArrayRevViz — GURUHLASH (kvotativ): JAMI ni k tadan teng guruhga yig'amiz →
//     «nechta guruh?». reveal 0=uyum, 1=guruhlangan qatorlar, 2=total÷size=count + count×size=total.
//  FamilyViz — ×↔÷ oila kartasi (bitta massiv → 1 ta × va 2 ta ÷). Distraktor = misconception:
//     total−div (bo'lishni ayirish deb ko'rish), div (belgi chalkashligi), ±1. Bo'lish BUTUN (qoldiqsiz).
// ============================================================
// Kristall — Saturn koni o'ljasi: qirrali, porlaydigan (3D fasetlar + yorug'lik + soya).
// s — px (number) yoki cqw/vw string (sahnada container bilan masshtablanadi; height=auto + aspect-ratio).
const Crystal = ({ s = 20 }) => (
  <svg viewBox="0 0 26 34" width={s} height={typeof s === 'number' ? s * 34 / 26 : undefined} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...(typeof s === 'number' ? {} : { height: 'auto', aspectRatio: '26 / 34' }) }}>
    <defs>
      <linearGradient id="d19cryF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B8F0FF"/><stop offset="0.5" stopColor="#5FC7E8"/><stop offset="1" stopColor="#2E7FB8"/></linearGradient>
      <linearGradient id="d19cryL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EAFCFF"/><stop offset="1" stopColor="#86DAF0"/></linearGradient>
    </defs>
    <ellipse cx="13" cy="32.2" rx="6.6" ry="1.7" fill="rgba(0,0,0,0.28)"/>
    <path d="M13 1 L22 11 L16.5 31 L9.5 31 L4 11 Z" fill="url(#d19cryF)" stroke="#2A6E9E" strokeWidth="0.6"/>
    <path d="M13 1 L4 11 L9.5 31 L13 12.5 Z" fill="url(#d19cryL)" opacity="0.9"/>
    <path d="M13 1 L22 11 L13 12.5 L4 11 Z" fill="#E4FAFF" opacity="0.72"/>
    <path d="M13 12.5 L16.5 31 L13 31 Z" fill="#1F5E86" opacity="0.5"/>
    <path d="M10.5 4.5 L8.4 10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.85"/>
  </svg>
);
// Kristall uyumi (reveal 0 — hali ulashilmagan JAMI)
const CrystalPile = ({ total, s = 20 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(3px,1vw,6px)', justifyContent: 'center', alignItems: 'center', maxWidth: 'clamp(180px,62vw,330px)', padding: 'clamp(9px,2.2vw,14px)', borderRadius: 13, background: 'linear-gradient(180deg,#122234,#0A1420)', border: '2px solid #243C52', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5), 0 0 0 1px rgba(90,180,220,0.14)' }}>
    {Array.from({ length: total }).map((_, i) => <Crystal key={i} s={s}/>)}
  </div>
);
// Kristall panjarasi (FamilyViz massivi)
const CrystalGrid = ({ rows, cols, s = 15 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3px,1vw,5px)', padding: 'clamp(6px,1.6vw,10px)', borderRadius: 11, background: 'linear-gradient(180deg,#122234,#0A1420)', border: '2px solid #243C52', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
    {Array.from({ length: rows }).map((_, ri) => (
      <div key={ri} style={{ display: 'flex', gap: 'clamp(3px,1.1vw,6px)', justifyContent: 'center' }}>
        {Array.from({ length: cols }).map((_, ci) => <Crystal key={ci} s={s}/>)}
      </div>
    ))}
  </div>
);
const DIV_LBL = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: '#5FC7E8' };
// DealViz — 12 kristalni k idishga TENG ULASH. reveal 0=uyum; 1=idishlarga ulashilgan; 2=tenglama.
const DealViz = ({ total, groups, reveal = 0 }) => {
  const t = useT();
  const per = total / groups;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px,2.2vw,15px)' }}>
      {reveal < 1 && <CrystalPile total={total} s={20}/>}
      {reveal < 1 && <p style={{ margin: 0, ...DIV_LBL, fontSize: 'clamp(12px,1.9vw,15px)' }}>{t({ ru: `Всего: ${total}`, uz: `Jami: ${total}` })}</p>}
      {reveal >= 1 && (
        <div style={{ display: 'flex', gap: 'clamp(6px,1.8vw,12px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {Array.from({ length: groups }).map((_, g) => (
            <div key={g} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ minHeight: 'clamp(34px,8vw,48px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(2px,0.8vw,4px)', justifyContent: 'center', alignItems: 'flex-end', padding: 'clamp(5px,1.4vw,8px)', width: 'clamp(46px,13vw,72px)', borderRadius: '5px 5px 11px 11px', background: 'linear-gradient(180deg,#3A2E52,#241A38)', border: '2px solid #4C3A6C', boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.5)' }}>
                {Array.from({ length: per }).map((_, i) => <span key={i} className="g1-pop-in" style={{ display: 'inline-flex', animationDelay: `${(i * groups + g) * 0.09}s` }}><Crystal s={16}/></span>)}
              </div>
              <div style={{ width: 'clamp(52px,14.5vw,80px)', height: 'clamp(5px,1.4vw,8px)', borderRadius: '0 0 5px 5px', background: 'linear-gradient(180deg,#5C4A80,#3A2E52)' }}/>
            </div>
          ))}
        </div>
      )}
      {reveal >= 2 && (
        <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px,1.2vw,8px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px,4.6vw,32px)' }}>
          <span style={{ color: T.ink }}>{total} ÷ {groups}</span><span style={{ color: T.ink3 }}>=</span><span style={{ color: T.success }}>{per}</span>
        </div>
      )}
    </div>
  );
};
// ArrayRevViz — JAMI ni size tadan teng GURUHlarga yig'ish. reveal 0=uyum; 1=guruhlar; 2=total÷size=count.
const ArrayRevViz = ({ total, size, reveal = 0 }) => {
  const t = useT();
  const count = total / size;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(9px,2vw,13px)' }}>
      {reveal < 1 ? <CrystalPile total={total} s={20}/> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px,1.4vw,9px)', padding: 'clamp(9px,2.2vw,15px)', borderRadius: 14, background: 'linear-gradient(180deg,#122234,#0A1420)', border: '2px solid #243C52', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
          {Array.from({ length: count }).map((_, ri) => (
            <div key={ri} className="g1-pop-in" style={{ animationDelay: `${ri * 0.12}s`, display: 'flex', gap: 'clamp(3px,1.1vw,6px)', justifyContent: 'center', padding: '2px clamp(5px,1.4vw,9px)', borderRadius: 8, background: 'rgba(90,199,232,0.12)', boxShadow: 'inset 0 0 0 1.5px rgba(95,199,232,0.5)' }}>
              {Array.from({ length: size }).map((_, ci) => <Crystal key={ci} s={16}/>)}
            </div>
          ))}
        </div>
      )}
      {reveal >= 1 && reveal < 2 && <p style={{ margin: 0, ...DIV_LBL, fontSize: 'clamp(12px,1.9vw,15px)' }}>{t({ ru: `по ${size} в группе`, uz: `${size} tadan guruh` })}</p>}
      {reveal >= 2 && (
        <div className="g1-pop-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
          <div style={{ fontSize: 'clamp(22px,4.6vw,32px)' }}><span style={{ color: T.ink }}>{total} ÷ {size}</span> <span style={{ color: T.ink3 }}>=</span> <span style={{ color: T.success }}>{count}</span></div>
          <div style={{ fontSize: 'clamp(13px,2.3vw,17px)', color: T.ink3 }}>{count} × {size} = {total}</div>
        </div>
      )}
    </div>
  );
};
// FamilyViz — ×↔÷ OILA: bitta massiv (a×b) bitta ko'paytirish va ikkita bo'lish beradi.
// blank=true → izlanayotgan a'zo (dashed sariq); solved bo'lsa yashil.
const FamRow = ({ expr, accent = false, blank = false, solved = false }) => {
  const bg = blank && !solved ? 'rgba(255,220,120,0.16)' : blank && solved ? T.successSoft : accent ? T.accentSoft : 'rgba(90,199,232,0.1)';
  const bd = blank && !solved ? '2px dashed #E7B94E' : blank && solved ? `2px solid ${T.success}` : `1.5px solid ${accent ? T.accent : 'rgba(95,199,232,0.4)'}`;
  const col = blank && !solved ? '#C08A2E' : blank && solved ? T.success : accent ? T.accent : '#2FA0C8';
  return (
    <div className={blank && solved ? 'g1-pop-in' : ''} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'clamp(6px,1.4vw,9px) clamp(10px,2.2vw,15px)', borderRadius: 10, background: bg, border: bd }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(16px,3vw,22px)', color: col }}>{expr}</span>
    </div>
  );
};
// reveal: 0 = faqat massiv + × (÷ yashirin); >=1 = ÷ oila. blankBy: shu ÷ a'zosi «?» (topiladi), solved → to'ldiriladi.
const FamilyViz = ({ a, b, reveal = 2, blankBy = null, solved = false }) => {
  const total = a * b;
  const d1blank = blankBy === a, d2blank = blankBy === b;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,24px)', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <CrystalGrid rows={a} cols={b} s={15}/>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(13px,2.4vw,18px)', color: '#2FA0C8' }}>{a} × {b} = {total}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1.6vw,10px)' }}>
        <FamRow expr={`${a} × ${b} = ${total}`} accent/>
        {reveal >= 1 && <div className="g1-pop-in"><FamRow expr={d1blank && !solved ? `${total} ÷ ${a} = ?` : `${total} ÷ ${a} = ${b}`} blank={d1blank} solved={solved}/></div>}
        {reveal >= 1 && <div className="g1-pop-in" style={{ animationDelay: '0.12s' }}><FamRow expr={d2blank && !solved ? `${total} ÷ ${b} = ?` : `${total} ÷ ${b} = ${a}`} blank={d2blank} solved={solved}/></div>}
      </div>
    </div>
  );
};
// bo'linma MC — distraktor = misconception: total−div (ayirish), div (belgi chalkash), ±1.
const quotOpts = (total, div, seed) => uniqOpts(total / div, [total - div, div, total / div + 1, total / div - 1], seed);
const DEAL_Q = { ru: 'Сколько каждому?', uz: 'Har biriga nechta?' };
const GRP_Q = { ru: 'Сколько групп?', uz: 'Nechta guruh?' };
// DealStage — TENG ULASHISH mashqi (single yoki rounds). cKey: s5/s7/s9/s11/s13.
const DealStage = ({ props, cKey, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const total = cur.total, groups = cur.groups;
  const per = total / groups;
  const opts = quotOpts(total, groups, ri * 7 + 1);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const reveal = solved ? 2 : 0;
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${total}÷${groups}`, options: [], correctIndex: -1, correctAnswer: String(per), studentAnswerIndex: null, studentAnswer: String(per), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) {
      sfx.playCorrect(); setSolved(true); report();
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } }
    } else {
      sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && ri === 0 && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {(cur.story || c.story) && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.1vw,17px)', textAlign: 'center', lineHeight: 1.5 }}>{t(cur.story || c.story)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <DealViz total={total} groups={groups} reveal={reveal}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(DEAL_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return (
                <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>
              ); })}
            </div>
          </>
        )}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9}/>}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
// ArrayRevStage — GURUHLASH mashqi (single yoki rounds). cKey: s6/s8/s10/s14.
const ArrayRevStage = ({ props, cKey, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const total = cur.total, size = cur.size;
  const count = total / size;
  const opts = quotOpts(total, size, ri * 5 + 3);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const reveal = solved ? 2 : 0;
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${total}÷${size}`, options: [], correctIndex: -1, correctAnswer: String(count), studentAnswerIndex: null, studentAnswer: String(count), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) {
      sfx.playCorrect(); setSolved(true); report();
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } }
    } else {
      sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {(cur.story || c.story) && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.1vw,17px)', textAlign: 'center', lineHeight: 1.5 }}>{t(cur.story || c.story)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <ArrayRevViz total={total} size={size} reveal={reveal}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(GRP_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return (
                <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>
              ); })}
            </div>
          </>
        )}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9}/>}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
const ArrayStage = ({ props, cKey, fact = false, variant = 'geo' }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const r = cur.r, cc = cur.c;
  const total = r * cc;
  const opts = arrayOpts(r, cc, ri * 7 + 1);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const reveal = solved ? 3 : 0;
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: t(cur.story || c.lead), options: [], correctIndex: -1, correctAnswer: String(total), studentAnswerIndex: null, studentAnswer: String(total), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) {
      sfx.playCorrect(); setSolved(true); report();
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } }
    } else {
      sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && ri === 0 && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {cur.story && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.1vw,17px)', textAlign: 'center', lineHeight: 1.5 }}>{t(cur.story)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <ArrayViz r={r} c={cc} reveal={reveal} variant={variant}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(ARR_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return (
                <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>
              ); })}
            </div>
          </>
        )}
        {/* KO'PAYTIRISH JADVALI yordamchisi — o'quvchi hali jadvalni bilmaydi, ochib ishlata oladi */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9}/>}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
// ============================================================
// ============================================================
// Dars21 MEXANIKA — ÷ JADVAL + SON O'QI (metodist «aralash» 2026-07-16):
//  NumberLineBackViz/Stage — son o'qida orqaga step-talik sakrash (total→0); sakrashlar = total/step.
//  DivTableRow/DivTableFillStage — ÷by jadval-qatori (by·n ÷ by = n), bo'sh katakni MC bilan to'ldirish.
//  DivTable — sTBL: ÷2 va ÷3 to'liq jadvali. Distraktor quotOpts (ayirish-xato ham).
// ============================================================
const NLB_Q = { ru: 'Сколько прыжков назад?', uz: 'Orqaga nechta sakrash?' };
// reveal>=2 da: nuqta BOSHIDAN (total) 0 gacha birma-bir SEKIN sakrab boradi; har sakragan yoy chiziladi.
const NumberLineBackViz = ({ total, step, reveal = 0 }) => {
  const count = total / step;
  const ticks = [];
  for (let v = 0; v <= total; v += step) ticks.push(v);
  const W = 320, H = 104, padX = 22, y = 66;
  const xOf = (v) => padX + (v / total) * (W - 2 * padX);
  const [hop, setHop] = useState(0);   // bajarilgan sakrashlar soni (0..count)
  const tRef = useRef(null);
  useEffect(() => {
    clearInterval(tRef.current);
    if (reveal < 2) { setHop(0); return undefined; }
    setHop(0);
    let h = 0;
    tRef.current = setInterval(() => { h += 1; setHop(h); if (h >= count) clearInterval(tRef.current); }, 1050);   // SEKIN: har 1.05s
    return () => clearInterval(tRef.current);
  }, [reveal, count]);
  const markerX = xOf(total - hop * step);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
      <defs><marker id="d21arw" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#F2A23A"/></marker></defs>
      <line x1={xOf(0)} y1={y} x2={xOf(total)} y2={y} stroke="#5A4A72" strokeWidth="3" strokeLinecap="round"/>
      {ticks.map((v) => (
        <g key={v}>
          <circle cx={xOf(v)} cy={y} r="3.4" fill={v === 0 ? '#6EF29B' : '#8A7AA6'}/>
          <text x={xOf(v)} y={y + 20} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="800" fontSize="11" fill="#B79AF0">{v}</text>
        </g>
      ))}
      {/* bajarilgan sakrash yoylari (birma-bir paydo bo'ladi) */}
      {reveal >= 2 && ticks.slice(1, hop + 1).map((_, i) => {
        const from = total - i * step, to = from - step;
        const x1 = xOf(from), x2 = xOf(to), mx = (x1 + x2) / 2;
        return <path key={i} d={`M${x1} ${y - 7} Q ${mx} ${y - 30} ${x2 + 3} ${y - 7}`} fill="none" stroke="#F2A23A" strokeWidth="2.4" markerEnd="url(#d21arw)"/>;
      })}
      {/* SAKRAB BORUVCHI NUQTA — boshda total da, sekin 0 gacha */}
      {reveal >= 2 && (
        <g style={{ transform: `translateX(${markerX}px)`, transition: 'transform .6s cubic-bezier(.4,1.1,.5,1)' }}>
          <g key={hop} className="d21-hop">
            <circle cx="0" cy={y} r="7" fill="#F2A23A" stroke="#fff" strokeWidth="1.6"/>
          </g>
        </g>
      )}
      {reveal >= 2 && hop >= count && <text x={W / 2} y={H - 3} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="800" fontSize="16" fill="#1F7A4D">{total} ÷ {step} = {count}</text>}
    </svg>
  );
};
const NumberLineBackStage = ({ props, cKey, fact = false }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([brgSeg(cKey, lang), { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const total = cur.total, step = cur.step, ans = total / step;
  const opts = quotOpts(total, step, ri * 7 + 1);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => { if (!meta.scored || !props.onAnswer) return; const ft = !anyWrongRef.current; props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${total}÷${step}`, options: [], correctIndex: -1, correctAnswer: String(ans), studentAnswerIndex: null, studentAnswer: String(ans), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true }); };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) { sfx.playCorrect(); setSolved(true); report(); if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } } }
    else { sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v)); if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); } }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && ri === 0 && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {(cur.story || c.story) && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.1vw,17px)', textAlign: 'center', lineHeight: 1.5 }}>{t(cur.story || c.story)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <NumberLineBackViz total={total} step={step} reveal={solved ? 2 : 0}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(NLB_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>; })}
            </div>
          </>
        )}
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
// ÷ JADVAL-QATORI: by·n ÷ by = n. dividend yuqorida, bo'linma pastda; bir katak bo'sh.
const DTR_CELL = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(2px,0.7vw,4px)' };
const DivTableRow = ({ by, upto = 6, fill = upto, blankIdx = 0, solved = false }) => {
  const cells = []; for (let n = 1; n <= upto; n += 1) cells.push(n);
  return (
    <div style={{ display: 'flex', gap: 'clamp(4px,1.2vw,7px)', flexWrap: 'nowrap', padding: 'clamp(7px,1.8vw,12px)', borderRadius: 14, background: 'linear-gradient(180deg,#122234,#0A1420)', border: '2px solid #243C52', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
      {cells.map((n) => {
        const dividend = by * n;
        const isBlank = blankIdx === n;
        const active = isBlank ? true : (blankIdx ? true : n <= fill);
        const shown = isBlank ? (solved ? n : '?') : (active ? n : '?');
        const bg = isBlank && !solved ? 'rgba(255,220,120,0.16)' : isBlank && solved ? T.success : active ? 'rgba(90,214,180,0.14)' : 'rgba(255,255,255,0.04)';
        const bd = isBlank && !solved ? '2px dashed #E7B94E' : isBlank && solved ? '2px solid #A7E0BF' : active ? '1.5px solid rgba(90,214,180,0.4)' : '1.5px solid rgba(255,255,255,0.08)';
        const col = isBlank && solved ? '#fff' : active ? '#DFF6EC' : T.ink3;
        return (
          <div key={n} style={DTR_CELL}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(9px,1.7vw,12px)', color: 'rgba(150,200,180,0.8)', whiteSpace: 'nowrap' }}>{dividend}÷{by}</span>
            <span className={isBlank && solved ? 'g1-pop-in' : ''} style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(15px,3.2vw,22px)', width: 'clamp(26px,6vw,38px)', height: 'clamp(30px,6.6vw,42px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: bg, border: bd, color: col, transition: 'all .3s' }}>{shown}</span>
          </div>
        );
      })}
    </div>
  );
};
const DTFILL_Q = { ru: 'Что в пустой клетке?', uz: "Bo'sh katakda nima?" };
const DivTableFillStage = ({ props, cKey }) => {
  const lang = useLang(); const t = useT(); const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([brgSeg(cKey, lang), { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const by = cur.by, blank = cur.blank, upto = cur.upto || 6;
  const ans = blank;
  const opts = quotOpts(by * blank, by, ri * 5 + 2);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => { if (!meta.scored || !props.onAnswer) return; const ft = !anyWrongRef.current; props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${by * blank}÷${by}`, options: [], correctIndex: -1, correctAnswer: String(ans), studentAnswerIndex: null, studentAnswer: String(ans), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true }); };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) { sfx.playCorrect(); setSolved(true); report(); if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); } }
    else { sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v)); if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); } }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(12px, 2.4vw, 18px)', overflowX: 'auto' }}>
          <DivTableRow by={by} upto={upto} blankIdx={blank} solved={solved}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(DTFILL_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>; })}
            </div>
          </>
        )}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9}/>}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
      </div>
    </Stage>
  );
};
// sTBL uchun ÷2 va ÷3 to'liq jadvali
const DivTable = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px,2.2vw,14px)', overflowX: 'auto', maxWidth: '100%' }}>
    {[3, 6, 9].map((by) => (
      <div key={by} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px,1.6vw,10px)' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(14px,2.6vw,19px)', color: '#2FA0C8', minWidth: 'clamp(28px,6vw,38px)' }}>÷{by}</span>
        <DivTableRow by={by} upto={5}/>
      </div>
    ))}
  </div>
);
// Dars20 MEXANIKA — ×↔÷ OILA:
//  FamilyFindStage — oilaning BO'SH ÷ a'zosini top (MC). FamilyViz blankBy bilan; quotOpts distraktor.
//  MatchStage — × faktni bir oiladagi ÷ faktiga MOSLASH (tap-tanlash: chap × → o'ng ÷).
// ============================================================
const FAM_Q = { ru: 'Что пропало в семье?', uz: "Oilada nima yo'qoldi?" };
const FamilyFindStage = ({ props, cKey, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const a = cur.a, b = cur.b, by = cur.by;
  const total = a * b, ans = total / by;
  const opts = quotOpts(total, by, ri * 7 + 1);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${total}÷${by}`, options: [], correctIndex: -1, correctAnswer: String(ans), studentAnswerIndex: null, studentAnswer: String(ans), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) {
      sfx.playCorrect(); setSolved(true); report();
      if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } }
    } else {
      sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && ri === 0 && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {(cur.story || c.story) && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.1vw,17px)', textAlign: 'center', lineHeight: 1.5 }}>{t(cur.story || c.story)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(14px, 2.6vw, 20px)', overflowX: 'auto' }}>
          <FamilyViz a={a} b={b} reveal={1} blankBy={by} solved={solved}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(FAM_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return (
                <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>
              ); })}
            </div>
          </>
        )}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9}/>}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
// MatchStage — × faktni bir oiladagi ÷ faktiga MOSLASH (tap: chap × → o'ng ÷). p÷a = b (mahsulot bo'yicha mos).
const MATCH_HINT = { ru: 'Протяни ниточку от умножения к его делению — откроется люк', uz: "Simni ko'paytirishdan uning bo'lishiga tort — lyuk ochiladi" };
const MATCH_COLORS = ['#5FC7E8', '#F2A23A', '#7F4FD0', '#E8863A'];
const MCELL = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(15px,3.2vw,22px)', padding: '0 clamp(6px,1.4vw,12px)', height: '100%', minHeight: 'clamp(42px,7vw,54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', transition: 'all .2s' };
// MatchDoor — ko'p-etapli LYUK: har to'g'ri juft bitta panelni yuqoriga suradi; hammasi ochilsa kristallar + koinot ko'rinadi.
const DOOR_STARS20 = [[10, 32], [28, 62], [46, 24], [62, 58], [82, 34], [22, 78], [76, 72], [52, 82], [92, 60]];
const MatchDoor = ({ open, total }) => {
  const full = open >= total;
  return (
    <div style={{ position: 'relative', width: '100%', height: 'clamp(56px,15vw,90px)', borderRadius: 12, overflow: 'hidden', border: 'clamp(4px,1.1vw,7px) solid', borderColor: '#CFD6E0 #9AA2AE #7E8692 #B6BEC8', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 42%, #241a44 0%, #070610 88%)' }}/>
      {DOOR_STARS20.map(([x, y], i) => <span key={i} className="d2-star" aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 2, height: 2, borderRadius: '50%', background: '#DCEAF8', animationDelay: `${i * 0.3}s` }}/>)}
      {/* kristall mukofot — panellar ochilganda ko'rinadi */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(5px,2vw,12px)' }}>
        {Array.from({ length: total + 1 }).map((_, i) => <span key={i} className={full ? 'g1-pop-in' : ''} style={{ display: 'inline-flex', width: 'clamp(15px,4vw,22px)', animationDelay: `${i * 0.08}s` }}><Crystal s={18}/></span>)}
      </div>
      {full && <div className="g1-pop-in" style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(9px,1.6vw,12px)', letterSpacing: '.08em', color: '#8FE0C0', textShadow: '0 0 6px rgba(140,224,192,0.7)' }}>◍ OCHILDI</div>}
      {/* PANELLAR (yuqoriga suriladi) */}
      {Array.from({ length: total }).map((_, i) => {
        const isOpen = i < open;
        return (
          <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i / total) * 100}%`, width: `${100 / total}%`, background: 'linear-gradient(180deg,#EAEEF3,#98A0AC)', borderRight: i < total - 1 ? '1.5px solid #7E8692' : 'none', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)', transform: isOpen ? 'translateY(-104%)' : 'translateY(0)', transition: 'transform .6s cubic-bezier(.5,0,.2,1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 'clamp(10px,2.6vw,15px)', height: 'clamp(10px,2.6vw,15px)', borderRadius: '50%', background: isOpen ? '#6EF29B' : '#E0533F', boxShadow: `0 0 6px ${isOpen ? '#6EF29B' : '#E0533F'}`, transition: 'all .3s' }}/>
            <span aria-hidden="true" style={{ position: 'absolute', top: 5, left: 5, width: 3, height: 3, borderRadius: '50%', background: '#8A94A6' }}/>
            <span aria-hidden="true" style={{ position: 'absolute', bottom: 5, right: 5, width: 3, height: 3, borderRadius: '50%', background: '#8A94A6' }}/>
          </div>
        );
      })}
      {/* tepa ogohlantirish chizig'i */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: 'repeating-linear-gradient(45deg,#FFC23C 0 6px,#1E273E 6px 12px)', opacity: full ? 0 : 0.85, transition: 'opacity .4s' }}/>
    </div>
  );
};
const MatchStage = ({ props, cKey }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const fams = c.pairs;
  const n = fams.length;
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const order = React.useMemo(() => shuffleArr(fams.map((_, i) => i)), [cKey]); // o'ng ustun: right[pos] = oila indeksi
  const [matched, setMatched] = useState(() => new Set());
  const [wrongPos, setWrongPos] = useState(null);
  const [drag, setDrag] = useState(null);   // {from, vx, vy, hover} — viewBox koordinatalarда (0..100)
  const dragRef = useRef(null);
  const boxRef = useRef(null);              // sim-overlay konteyneri (koordinata bazasi)
  const rightRefs = useRef([]);
  const anyWrongRef = useRef(false);
  const reportedRef = useRef(false);
  const tmr = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });   // overlay konteyner o'lchami (piksel-viewBox uchun — shakl buzilmaydi)
  useEffect(() => () => clearTimeout(tmr.current), []);
  useEffect(() => {
    const el = boxRef.current; if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); setBox({ w: r.width, h: r.height }); };
    measure();
    if (typeof ResizeObserver !== 'undefined') { const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect(); }
    window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure);
  }, []);
  const solved = matched.size === n;
  const revealRef = useRevealScroll(solved, 400);
  useEffect(() => {
    if (solved && !reportedRef.current) {
      reportedRef.current = true;
      if (meta.scored && props.onAnswer) { const ft = !anyWrongRef.current; props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: 0, question: 'match', options: [], correctIndex: -1, correctAnswer: 'match', studentAnswerIndex: null, studentAnswer: 'match', correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true }); }
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    }
  }, [solved]); // eslint-disable-line
  // klient-koordinatani overlay pikseliga o'tkazish (viewBox = konteyner piksellari → shakl buzilmaydi)
  const toPx = (cx, cy) => { const r = boxRef.current.getBoundingClientRect(); return { px: cx - r.left, py: cy - r.top }; };
  // pointer qaysi o'ng÷ karta ustida (hit-test)
  const rightAt = (cx, cy) => { for (let pos = 0; pos < n; pos += 1) { const el = rightRefs.current[pos]; if (!el) continue; const r = el.getBoundingClientRect(); if (cx >= r.left - 8 && cx <= r.right + 8 && cy >= r.top - 8 && cy <= r.bottom + 8) return pos; } return -1; };
  const onDown = (i, e) => {
    if (!canAct || matched.has(i)) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    setWrongPos(null);
    dragRef.current = { from: i, ...toPx(e.clientX, e.clientY), hover: -1 };
    setDrag({ ...dragRef.current });
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const hv = rightAt(e.clientX, e.clientY);
    dragRef.current = { ...dragRef.current, ...toPx(e.clientX, e.clientY), hover: matched.has(order[hv]) ? -1 : hv };
    setDrag({ ...dragRef.current });
  };
  const onUp = (e) => {
    const dr = dragRef.current; if (!dr) return;
    const pos = rightAt(e.clientX, e.clientY);
    if (pos >= 0) {
      const fam = order[pos];
      if (!matched.has(fam) && fam === dr.from) { sfx.playCorrect(); setMatched((m) => new Set(m).add(fam)); }
      else if (!matched.has(fam)) { sfx.playWrong(); anyWrongRef.current = true; setWrongPos(pos); if (!audio.muted) { const en = getAudioEngine(); if (en) en.pushOneOff(c.audio.on_wrong[lang]); } clearTimeout(tmr.current); tmr.current = setTimeout(() => setWrongPos(null), 700); }
    }
    dragRef.current = null; setDrag(null);
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const leftStyle = (i) => matched.has(i)
    ? { ...MCELL, background: T.successSoft, border: `2px solid ${T.success}`, color: T.success, cursor: 'default' }
    : drag && drag.from === i ? { ...MCELL, background: T.accentSoft, border: `2.5px solid ${T.accent}`, color: T.accent, cursor: 'grabbing' }
    : { ...MCELL, background: '#fff', border: '2px solid #C9D3DE', color: T.ink, cursor: 'grab' };
  const rightStyle = (pos) => { const fam = order[pos]; return matched.has(fam)
    ? { ...MCELL, background: T.successSoft, border: `2px solid ${T.success}`, color: T.success, cursor: 'default' }
    : wrongPos === pos ? { ...MCELL, background: '#FBEEEE', border: '2.5px solid #D64545', color: '#B23A3A' }
    : drag && drag.hover === pos ? { ...MCELL, background: T.accentSoft, border: `2.5px dashed ${T.accent}`, color: T.ink }
    : { ...MCELL, background: '#fff', border: '2px solid #C9D3DE', color: T.ink }; };
  // PIKSEL geometriya (viewBox = konteyner o'lchami → doiralar dumaloq, sim tabiiy)
  const LX = box.w * 0.415, RX = box.w * 0.585;   // chap ulagich / o'ng soket x
  const yOf = (k) => ((k + 0.5) / n) * box.h;
  const wires = [...matched].map((fam) => { const pos = order.indexOf(fam); return { fam, y1: yOf(fam), y2: yOf(pos), color: MATCH_COLORS[fam % MATCH_COLORS.length] }; });
  const dY = drag ? yOf(drag.from) : 0;
  const dCol = drag ? MATCH_COLORS[drag.from % MATCH_COLORS.length] : '#000';
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', touchAction: drag ? 'none' : 'auto' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {/* LYUK — ochilish darajasi = moslashgan juftlar soni */}
        <div className="fade-up delay-1"><MatchDoor open={matched.size} total={n}/></div>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <div ref={boxRef} style={{ position: 'relative' }}>
            {/* ELASTIK SIMLAR overlay (moslashgan + sudralayotgan) */}
            <svg viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3, overflow: 'visible' }}>
              {box.w > 0 && (
                <>
                  {/* chap ulagich-tugmalari (sudrash uchun ishora) */}
                  {fams.map((_, i) => !matched.has(i) && !(drag && drag.from === i) && <circle key={`ln${i}`} cx={LX} cy={yOf(i)} r="4.5" fill={MATCH_COLORS[i % MATCH_COLORS.length]} opacity="0.9"/>)}
                  {/* o'ng soketlar */}
                  {order.map((fam, pos) => !matched.has(fam) && <circle key={`rn${pos}`} cx={RX} cy={yOf(pos)} r="4.5" fill="#EEF3F8" stroke="#9FB0C0" strokeWidth="2"/>)}
                  {/* moslashgan simlar */}
                  {wires.map((w) => (
                    <g key={w.fam}>
                      <path className="d20-wire" d={`M${LX} ${w.y1} C ${(LX + RX) / 2} ${w.y1}, ${(LX + RX) / 2} ${w.y2}, ${RX} ${w.y2}`} fill="none" stroke={w.color} strokeWidth="3.5" strokeLinecap="round" pathLength="1"/>
                      <circle cx={LX} cy={w.y1} r="5" fill={w.color}/>
                      <circle cx={RX} cy={w.y2} r="5" fill={w.color}/>
                    </g>
                  ))}
                  {/* SUDRALAYOTGAN sim (pointerga ergashadi) */}
                  {drag && (
                    <g>
                      <path d={`M${LX} ${dY} C ${(LX + drag.px) / 2} ${dY}, ${(LX + drag.px) / 2} ${drag.py}, ${drag.px} ${drag.py}`} fill="none" stroke={dCol} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 5"/>
                      <circle cx={LX} cy={dY} r="5" fill={dCol}/>
                      <circle cx={drag.px} cy={drag.py} r="6" fill={dCol} opacity="0.9"/>
                    </g>
                  )}
                </>
              )}
            </svg>
            <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr 5fr', gridTemplateRows: `repeat(${n}, 1fr)`, columnGap: 0, rowGap: 0, height: `calc(${n} * clamp(54px, 11vw, 66px))`, touchAction: 'none' }}>
              {fams.map((f, i) => (
                <button key={`l${i}`} disabled={!canAct || matched.has(i)} onPointerDown={(e) => onDown(i, e)} onPointerMove={onMove} onPointerUp={onUp} style={{ ...leftStyle(i), gridColumn: 1, gridRow: i + 1, alignSelf: 'center', height: 'clamp(42px,7.4vw,54px)', touchAction: 'none' }}>{f.a} × {f.b}{matched.has(i) && <span style={{ marginLeft: 6 }}>✓</span>}</button>
              ))}
              {order.map((fam, pos) => { const f = fams[fam]; return (
                <div key={`r${pos}`} ref={(el) => { rightRefs.current[pos] = el; }} style={{ ...rightStyle(pos), gridColumn: 3, gridRow: pos + 1, alignSelf: 'center', height: 'clamp(42px,7.4vw,54px)' }}>{f.a * f.b} ÷ {f.a}{matched.has(fam) && <span style={{ marginLeft: 6 }}>✓</span>}</div>
              ); })}
            </div>
          </div>
        </div>
        {!solved && <p className="fade-up" style={{ margin: 0, fontSize: 'clamp(12px,1.9vw,14px)', fontWeight: 700, color: T.ink3, textAlign: 'center' }}>{t(MATCH_HINT)}</p>}
        {wrongPos !== null && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(c.done_text)}/></div>}
      </div>
    </Stage>
  );
};
// ============================================================
// Dars24 YANGI MEXANIKA — OpChoiceStage: hayotiy masala → AVVAL amal (÷ yoki ×) tanlanadi, KEYIN javob.
// Amalni tanib olishga urg'u (masala tushunish). Distraktor amal = total×div; javob distraktor = quotOpts.
// ============================================================
const OP_Q = { ru: 'Какое действие нужно?', uz: 'Qaysi amal kerak?' };
const OP_COMPUTE = { ru: 'Теперь посчитай:', uz: 'Endi hisoblang:' };
const OpChoiceStage = ({ props, cKey, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const total = c.total, div = c.div, ans = total / div;
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [step, setStep] = useState(0);        // 0 = amal tanlash, 1 = javob
  const [wrongOp, setWrongOp] = useState(false);
  const [wrongAns, setWrongAns] = useState(() => new Set());
  const [solved, setSolved] = useState(false);
  const anyWrongRef = useRef(false);
  const revealRef = useRevealScroll(solved, 400);
  const opts = quotOpts(total, div, 3);
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: 0, question: `${total}÷${div}`, options: [], correctIndex: -1, correctAnswer: String(ans), studentAnswerIndex: null, studentAnswer: String(ans), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pickOp = (isDiv) => {
    if (!canAct || step > 0) return;
    if (isDiv) { sfx.playCorrect(); setStep(1); setWrongOp(false); }
    else { sfx.playWrong(); anyWrongRef.current = true; setWrongOp(true); if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); } }
  };
  const pickAns = (v, ok) => {
    if (!canAct || solved || wrongAns.has(v)) return;
    if (ok) { sfx.playCorrect(); setSolved(true); report(); if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } } }
    else { sfx.playWrong(); anyWrongRef.current = true; setWrongAns((w) => new Set(w).add(v)); }
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const opBtn = (label, isDiv) => (
    <button className="option" disabled={!canAct || step > 0} onClick={() => pickOp(isDiv)} style={{ ...ARR_OPT, opacity: step > 0 && isDiv ? 1 : (step > 0 ? 0.4 : 1), borderColor: step > 0 && isDiv ? T.success : undefined }}>{label}</button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px,2vw,14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <p style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.2vw,18px)', textAlign: 'center', lineHeight: 1.5 }}>{t(c.story)}</p>
          <CrystalPile total={total} s={17}/>
        </div>
        {step === 0 && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(OP_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(8px,1.6vw,12px)' }}>
              {opBtn(`${total} ÷ ${div}`, true)}
              {opBtn(`${total} × ${div}`, false)}
            </div>
            {wrongOp && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.wrong_op)}/></div>}
          </>
        )}
        {step === 1 && !solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 800, color: T.ink, fontSize: 'clamp(15px,2.6vw,20px)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{t(OP_COMPUTE)} {total} ÷ {div} = ?</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrongAns.has(o.v); return <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pickAns(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>; })}
            </div>
            {wrongAns.size > 0 && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(c.wrong)}/></div>}
          </>
        )}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(c.done_text)}/></div>}
        {solved && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
// ============================================================
// Dars26 MEXANIKA — CHIZIQ TURLARI (Van Hiele 0→1): nur/to'g'ri chiziq/kesma UCH SONI bo'yicha.
//  LineFig — abstrakt figura (to'g'ri chiziq: 2 strelka, 0 uch; nur: 1 uch + 1 strelka; kesma: 2 uch).
//  RealObj — hayotiy langar (ufq chizig'i=chiziq, fonar nuri=nur, qalam=kesma).
//  LineTypeStage — figurani ko'rsatib «qaysi tur?» (ask:'type') yoki «nechta uchi?» (ask:'count') MC.
// ============================================================
const LINE_TYPES = { line: { ru: 'Прямая', uz: "To'g'ri chiziq" }, ray: { ru: 'Луч', uz: 'Nur' }, segment: { ru: 'Отрезок', uz: 'Kesma' } };
const LT_ENDS = { line: 0, ray: 1, segment: 2 };
// Uchlarni porlaydigan yashil doira, strelka — accent. Chiziq — Uran moviy.
const LineEnd = ({ x, y, big }) => (
  <g>
    <circle cx={x} cy={y} r={big ? 7.4 : 6} fill="url(#d26end)" stroke="#fff" strokeWidth="1.5"/>
    <circle cx={x - 2} cy={y - 2.2} r={big ? 2.3 : 1.8} fill="rgba(255,255,255,0.8)"/>
  </g>
);
const LineFig = ({ type, hi = false }) => {
  const y = 32;
  const x1 = type === 'line' ? 18 : 46;
  const x2 = type === 'segment' ? 174 : 202;
  return (
    <svg viewBox="0 0 220 72" style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id="d26rod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9ECDF8"/><stop offset="0.34" stopColor="#3E7FD6"/><stop offset="1" stopColor="#1B4079"/></linearGradient>
        <linearGradient id="d26cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FC2F3"/><stop offset="1" stopColor="#1E4785"/></linearGradient>
        <radialGradient id="d26end" cx="0.35" cy="0.3"><stop offset="0" stopColor="#8FF0BC"/><stop offset="0.5" stopColor="#2E9A62"/><stop offset="1" stopColor="#14603A"/></radialGradient>
      </defs>
      {/* CHIZIQ — 3D silindr-sterjen */}
      <rect x={x1} y={y - 5} width={x2 - x1} height="10" rx="5" fill="url(#d26rod)"/>
      <rect x={x1 + 3} y={y - 3.4} width={Math.max(0, x2 - x1 - 6)} height="2.8" rx="1.4" fill="rgba(255,255,255,0.55)"/>
      {/* STRELKALAR — 3D konus (cheksizlik) */}
      {type !== 'segment' && <g><path d={`M${x2} ${y - 10} L${x2 + 15} ${y} L${x2} ${y + 10} Z`} fill="url(#d26cone)"/><path d={`M${x2} ${y - 10} L${x2 + 15} ${y} L${x2} ${y} Z`} fill="rgba(255,255,255,0.28)"/></g>}
      {type === 'line' && <g><path d={`M${x1} ${y - 10} L${x1 - 15} ${y} L${x1} ${y + 10} Z`} fill="url(#d26cone)"/><path d={`M${x1} ${y - 10} L${x1 - 15} ${y} L${x1} ${y} Z`} fill="rgba(255,255,255,0.28)"/></g>}
      {/* UCHLAR — 3D shar (sanaladigan) */}
      {(type === 'ray' || type === 'segment') && <LineEnd x={46} y={y} big={hi}/>}
      {type === 'segment' && <LineEnd x={174} y={y} big={hi}/>}
    </svg>
  );
};
// Hayotiy langar: horizon=ufq chizig'i (chiziq), beam=fonar nuri (nur), edge=qalam (kesma).
const RealObj = ({ kind }) => {
  if (kind === 'horizon') return ( // UFQ CHIZIG'I — yo'ldosh ufqi: butun kadr bo'ylab, ikki chetdan tashqariga chiqadi; uchi YO'Q (to'g'ri chiziq)
    <svg viewBox="0 0 220 68" style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id="d26sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#081620"/><stop offset="1" stopColor="#1C4553"/></linearGradient>
        <linearGradient id="d26ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#63808E"/><stop offset="0.5" stopColor="#3C4E5A"/><stop offset="1" stopColor="#232F38"/></linearGradient>
        <linearGradient id="d26hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset="0.45" stopColor="#8FE6EC"/><stop offset="1" stopColor="#2E7C88"/></linearGradient>
        {/* haqiqiy bloom — chiziq atrofida yorug'lik yoyiladi (kuchli aksent) */}
        <filter id="d26hzbloom" x="-6%" y="-400%" width="112%" height="900%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* osmon */}
      <rect x="0" y="0" width="220" height="37" fill="url(#d26sky)"/>
      {[[18, 10], [46, 20], [78, 8], [112, 16], [150, 9], [184, 19], [206, 13], [64, 27], [132, 25], [96, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 0.9 : 1.5} fill="#DCEFF2" opacity="0.9"/>)}
      {/* muzli tekislik */}
      <rect x="0" y="37" width="220" height="31" fill="url(#d26ice)"/>
      {/* ufq atrofidagi nur — uch qatlam, ko'zni shu joyga tortadi */}
      <rect x="0" y="22" width="220" height="30" fill="rgba(127,216,222,0.16)"/>
      <rect x="0" y="28" width="220" height="19" fill="rgba(127,216,222,0.26)"/>
      <rect x="0" y="32" width="220" height="11" fill="rgba(184,242,250,0.34)"/>
      {/* UFQ CHIZIG'I — KUCHLI AKSENT: bloom + porlash; butun kenglik bo'ylab, ikki chetdan tashqariga (uchi ko'rinmaydi) */}
      <g filter="url(#d26hzbloom)">
        <g className="d19-cryglow">
          <rect x="0" y="32.6" width="220" height="8.4" fill="url(#d26hz)"/>
          <rect x="0" y="33.4" width="220" height="3.2" fill="#FFFFFF"/>
        </g>
      </g>
    </svg>
  );
  if (kind === 'beam') return ( // FONAR — real qo'l fonari; nur bir tomonga kengayib, uchsiz ketadi (nur)
    <svg viewBox="0 0 220 68" style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id="d26fbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#78848F"/><stop offset="0.33" stopColor="#454F5A"/><stop offset="0.72" stopColor="#2A333C"/><stop offset="1" stopColor="#161D24"/></linearGradient>
        <linearGradient id="d26fhead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A6B2BE"/><stop offset="0.42" stopColor="#5E6A76"/><stop offset="1" stopColor="#232B34"/></linearGradient>
        <radialGradient id="d26flens" cx="0.42" cy="0.35"><stop offset="0" stopColor="#FFFDF0"/><stop offset="0.5" stopColor="#FFD86B"/><stop offset="1" stopColor="#B8871F"/></radialGradient>
        <linearGradient id="d26fcone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="rgba(255,226,146,0.9)"/><stop offset="1" stopColor="rgba(255,226,146,0.04)"/></linearGradient>
      </defs>
      <path d="M66 34 L216 6 L216 62 Z" fill="url(#d26fcone)"/>
      <path d="M66 34 L216 17 L216 51 Z" fill="rgba(255,244,202,0.4)"/>
      <rect x="4" y="26" width="34" height="17" rx="4" fill="url(#d26fbody)"/>
      {[10, 15, 20, 25, 30].map((x) => <line key={x} x1={x} y1="27" x2={x} y2="42" stroke="rgba(255,255,255,0.16)" strokeWidth="1.6"/>)}
      <rect x="36" y="24" width="16" height="21" rx="3" fill="url(#d26fhead)"/>
      <path d="M52 20 L64 25 L64 44 L52 49 Z" fill="url(#d26fhead)"/>
      <ellipse cx="64" cy="34.5" rx="3.6" ry="9.6" fill="url(#d26flens)"/>
      <ellipse cx="63" cy="31" rx="1.4" ry="3" fill="rgba(255,255,255,0.85)"/>
      <rect x="16" y="22" width="9" height="5" rx="2" fill="#C4402E"/>
      <circle cx="66" cy="34" r="6" fill="#1F7A4D" stroke="#fff" strokeWidth="1.6"/>
    </svg>
  );
  return ( // QALAM — ikki uchi bor, uzunligi o'lchanadi (kesma)
    <svg viewBox="0 0 220 68" style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id="d26pbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE79E"/><stop offset="0.34" stopColor="#F2C84B"/><stop offset="1" stopColor="#B0821B"/></linearGradient>
        <linearGradient id="d26pwood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5DCB0"/><stop offset="0.4" stopColor="#DBA96A"/><stop offset="1" stopColor="#956A34"/></linearGradient>
        <linearGradient id="d26pfer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EDF2F7"/><stop offset="0.4" stopColor="#A8B4C0"/><stop offset="1" stopColor="#626D78"/></linearGradient>
      </defs>
      <path d="M44 34 L64 24 L64 44 Z" fill="url(#d26pwood)"/>
      <path d="M44 34 L52.5 29.7 L52.5 38.3 Z" fill="#37373D"/>
      <rect x="64" y="24" width="98" height="20" fill="url(#d26pbody)"/>
      <rect x="64" y="26.4" width="98" height="4" fill="rgba(255,255,255,0.45)"/>
      <rect x="64" y="39.4" width="98" height="3" fill="rgba(90,60,10,0.22)"/>
      <rect x="162" y="23" width="14" height="22" fill="url(#d26pfer)"/>
      {[165.5, 169, 172.5].map((x) => <line key={x} x1={x} y1="23" x2={x} y2="45" stroke="rgba(70,80,92,0.45)" strokeWidth="1"/>)}
      <rect x="176" y="25" width="12" height="18" rx="4.5" fill="#E88AA0"/>
      <circle cx="44" cy="34" r="6" fill="#1F7A4D" stroke="#fff" strokeWidth="1.6"/>
      <circle cx="188" cy="34" r="6" fill="#1F7A4D" stroke="#fff" strokeWidth="1.6"/>
    </svg>
  );
};
const LT_TYPE_Q = { ru: 'Что это?', uz: "Bu nima?" };
const LT_COUNT_Q = { ru: 'Сколько концов?', uz: "Nechta uchi bor?" };
const LT_OPT = { padding: 'clamp(10px,1.7vw,13px)', fontSize: 'clamp(14px,2.3vw,17px)', fontWeight: 800, minHeight: 'clamp(46px,7vw,56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' };
const ltShuffle3 = (seed) => { const a = ['line', 'ray', 'segment']; let s = (seed + 2) * 9301 + 49297; for (let i = a.length - 1; i > 0; i -= 1) { s = (s * 233280 + 1) % 99991; const j = s % (i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const LineTypeStage = ({ props, cKey, fact = false }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([brgSeg(cKey, lang), { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const type = cur.type, ask = cur.ask || 'type', kind = cur.kind;
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => { if (!meta.scored || !props.onAnswer) return; const ft = !anyWrongRef.current; props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `linetype:${type}:${ask}`, options: [], correctIndex: -1, correctAnswer: ask === 'count' ? String(LT_ENDS[type]) : type, studentAnswerIndex: null, studentAnswer: '', correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true }); };
  const hit = (ok, key) => {
    if (!canAct || solved || wrong.has(key)) return;
    if (ok) { sfx.playCorrect(); setSolved(true); report(); if (!audio.muted) { const e = getAudioEngine(); if (e) { e.pushOneOff(c.audio.on_correct[lang]); if (isLast && fact && c.fact_audio) e.pushOneOff(c.fact_audio[lang]); } } }
    else { sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(key)); if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); } }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (<><NavBack onPrev={props.onPrev} label={<BackLabel/>}/><NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/></>);
  const order = ltShuffle3(ri * 3 + 1);
  const countOpts = [0, 1, 2, 3];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        {c.transition && ri === 0 && (
          <div className="fade-up" style={{ background: T.accentSoft, border: `1.5px solid ${T.accent}`, borderRadius: 14, padding: 'clamp(11px,2.2vw,15px) clamp(14px,2.6vw,18px)' }}>
            <span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontWeight: 800, fontSize: 'clamp(10px,1.6vw,12px)', letterSpacing: '.05em', padding: '3px 10px', borderRadius: 999, marginBottom: 6 }}>{lang === 'uz' ? 'MASHQ' : 'ТРЕНИРОВКА'}</span>
            <p style={{ margin: 0, fontWeight: 700, color: T.ink, fontSize: 'clamp(14px,2.1vw,17px)', lineHeight: 1.45 }}>{t(c.transition)}</p>
          </div>
        )}
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        {(cur.story || c.story) && <p className="fade-up delay-1" style={{ margin: 0, color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px,2.1vw,17px)', textAlign: 'center', lineHeight: 1.5 }}>{t(cur.story || c.story)}</p>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px,1.8vw,12px)', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(120px,26vw,170px)', justifyContent: 'center' }}>
          {kind ? <RealObj kind={kind}/> : <LineFig type={type} hi={solved}/>}
          {solved && <div className="g1-pop-in" style={{ fontWeight: 800, fontSize: 'clamp(14px,2.2vw,18px)', color: T.success }}>{t(LINE_TYPES[type])} · {LT_ENDS[type]} {lang === 'uz' ? 'uch' : 'конца'}</div>}
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(ask === 'count' ? LT_COUNT_Q : LT_TYPE_Q)}</p>
            {ask === 'count' ? (
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
                {countOpts.map((v) => { const w = wrong.has('c' + v); return <button key={v} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => hit(v === LT_ENDS[type], 'c' + v)} style={{ ...ARR_OPT }}>{v}</button>; })}
              </div>
            ) : (
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(6px,1.4vw,9px)' }}>
                {order.map((ty) => { const w = wrong.has(ty); return <button key={ty} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => hit(ty === type, ty)} style={LT_OPT}>{t(LINE_TYPES[ty])}</button>; })}
              </div>
            )}
          </>
        )}
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
        {allDone && fact && <div className="fade-up" style={{ marginTop: 4 }}><InfoNote badge={t(c.fact_badge)} text={t(c.fact_text)}/></div>}
      </div>
    </Stage>
  );
};
// Dars26 wrapper'lari — chiziq turlari (LineTypeStage: figura/hayotiy langar, «tur?»/«nechta uch?» aralash).
const A5 = (props) => <LineTypeStage props={props} cKey="s5"/>;
const A6 = (props) => <LineTypeStage props={props} cKey="s6"/>;
const A7 = (props) => <LineTypeStage props={props} cKey="s7"/>;
const A8 = (props) => <LineTypeStage props={props} cKey="s8"/>;
const A9 = (props) => <LineTypeStage props={props} cKey="s9"/>;
const A10 = (props) => <LineTypeStage props={props} cKey="s10"/>;
const A11 = (props) => <LineTypeStage props={props} cKey="s11"/>;
const ACase = (props) => <LineTypeStage props={props} cKey="s13"/>;
const A14 = (props) => <LineTypeStage props={props} cKey="s14" fact/>;

// ============================================================
// TABLE-FILL MEXANIKASI — skip-sanash qatori (2,4,6,8,10,12 …); bir katak bo'sh, o'quvchi to'ldiradi.
// TableRow: `by` ga jadval qatori (×1..×upto). `fill` = bosqichli ochish (tushuntirish);
// `blankIdx` = bo'sh (savol) katagi 1-indeks (mashq). solved -> bo'sh katak yashil to'ladi.
// ============================================================
const TR_CELL = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(3px,0.8vw,5px)' };
const TR_VAL = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(17px,3.6vw,26px)', width: 'clamp(30px,7vw,44px)', height: 'clamp(34px,7.6vw,48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, transition: 'all .3s' };
const TableRow = ({ by, upto = 6, fill = upto, blankIdx = 0, solved = false }) => {
  const cells = [];
  for (let n = 1; n <= upto; n += 1) cells.push(n);
  return (
    <div style={{ display: 'flex', gap: 'clamp(4px,1.2vw,8px)', alignItems: 'flex-end', flexWrap: 'nowrap', padding: 'clamp(8px,2vw,14px)', borderRadius: 14, background: 'linear-gradient(180deg,#122234,#0A1420)', border: '2px solid #243C52', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
      {cells.map((n) => {
        const val = by * n;
        const isBlank = blankIdx === n;
        const shown = isBlank ? (solved ? val : '?') : (blankIdx ? val : (n <= fill ? val : '?'));
        const active = isBlank ? true : (blankIdx ? true : n <= fill);
        const bg = isBlank && !solved ? 'rgba(255,220,120,0.16)'
          : isBlank && solved ? T.success
          : active ? 'rgba(90,214,180,0.14)' : 'rgba(255,255,255,0.04)';
        const bd = isBlank && !solved ? '2px dashed #E7B94E' : isBlank && solved ? '2px solid #A7E0BF' : active ? '1.5px solid rgba(90,214,180,0.4)' : '1.5px solid rgba(255,255,255,0.08)';
        const col = isBlank && solved ? '#fff' : active ? '#DFF6EC' : T.ink3;
        return (
          <div key={n} style={TR_CELL}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(9px,1.7vw,12px)', color: 'rgba(150,200,180,0.75)' }}>×{n}</span>
            <span className={isBlank && solved ? 'g1-pop-in' : ''} style={{ ...TR_VAL, background: bg, border: bd, color: col }}>{shown}</span>
          </div>
        );
      })}
    </div>
  );
};
const tableFillOpts = (by, blank, seed) => uniqOpts(by * blank, [by * (blank - 1), by * (blank + 1), by * blank + 1, by * blank - 1], seed);
const TFILL_Q = { ru: 'Что в пустой клетке?', uz: "Bo'sh katakda nima?" };
// TableFillStage — skip-sanash qatorining bo'sh katagini MC bilan to'ldirish (s6/s8/s10).
const TableFillStage = ({ props, cKey }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const by = cur.by, blank = cur.blank, upto = cur.upto || 6;
  const total = by * blank;
  const opts = tableFillOpts(by, blank, ri * 5 + 2);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(new Set()); anyWrongRef.current = false; };
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${by}×${blank}`, options: [], correctIndex: -1, correctAnswer: String(total), studentAnswerIndex: null, studentAnswer: String(total), correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pick = (v, ok) => {
    if (!canAct || solved || wrong.has(v)) return;
    if (ok) {
      sfx.playCorrect(); setSolved(true); report();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      sfx.playWrong(); anyWrongRef.current = true; setWrong((w) => new Set(w).add(v));
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(12px, 2.4vw, 18px)', overflowX: 'auto' }}>
          <TableRow by={by} upto={upto} blankIdx={blank} solved={solved}/>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(TFILL_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px,1.4vw,9px)' }}>
              {opts.map((o, i) => { const w = wrong.has(o.v); return (
                <button key={i} className={`option ${w ? 'option-picked-wrong' : ''}`} disabled={!canAct || w} onClick={() => pick(o.v, o.ok)} style={ARR_OPT}>{o.v}</button>
              ); })}
            </div>
          </>
        )}
        {/* KO'PAYTIRISH JADVALI yordamchisi */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9} hr={by} hc={blank}/>}
        </div>
        {wrong.size > 0 && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text)}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
      </div>
    </Stage>
  );
};
// (eski TableFillStage wrapper'lari Dars19 da olib tashlandi — A6/A8 yuqorida ArrayRevStage'ga ulangan.)

// ============================================================
// COMMUTE MEXANIKASI — «TENG?»: ikki ko'paytma (a×b va e×f) yonma-yon massiv bilan; teng bo'ladimi?
// O'rin almashish (a×b = b×a) → Ha; sonlar boshqa (masalan 3×5 va 5×4) → Yo'q. Ha/Yo'q tanlov.
// ============================================================
const YESNO = { yes: { ru: 'Да, равны', uz: 'Ha, teng' }, no: { ru: 'Нет', uz: "Yo'q" } };
const COMMUTE_Q = { ru: 'Эти два равны?', uz: 'Bu ikkalasi teng bo\'ladimi?' };
const CommuteStage = ({ props, cKey }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[cKey];
  const rounds = c.rounds || [c];
  const audio = useAudio([
    brgSeg(cKey, lang),
    { id: `${cKey}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const meta = SCREEN_META[props.screen];
  const [ri, setRi] = useState(0);
  const cur = rounds[ri];
  const p1 = cur.a * cur.b, p2 = cur.e * cur.f;
  const isEqual = p1 === p2;
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const anyWrongRef = useRef(false);
  const [showTable, setShowTable] = useState(false);
  const isLast = ri === rounds.length - 1;
  const allDone = solved && isLast;
  const revealRef = useRevealScroll(solved, 400);
  const nextRound = () => { setRi((x) => x + 1); setSolved(false); setWrong(false); anyWrongRef.current = false; };
  const report = () => {
    if (!meta.scored || !props.onAnswer) return;
    const ft = !anyWrongRef.current;
    props.onAnswer({ stage: meta.scope, screenIdx: props.screen, subIndex: ri, question: `${cur.a}×${cur.b} = ${cur.e}×${cur.f}?`, options: [], correctIndex: -1, correctAnswer: isEqual ? 'ha' : 'yoq', studentAnswerIndex: null, studentAnswer: isEqual ? 'ha' : 'yoq', correct: ft, firstTry: ft, attempts: anyWrongRef.current ? 2 : 1, solved: true });
  };
  const pick = (choiceYes) => {
    if (!canAct || solved) return;
    const ok = choiceYes === isEqual;
    if (ok) {
      sfx.playCorrect(); setSolved(true); report();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      sfx.playWrong(); anyWrongRef.current = true; setWrong(true);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  const canAdv = useAdvanceGate(allDone, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const pairLabel = (a, b) => (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(14px,2.6vw,20px)', color: '#2FB584' }}>{a} × {b}</span>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {rounds.length > 1 && <RoundDots ri={ri} total={rounds.length}/>}
        <div key={ri} className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'clamp(12px, 2.4vw, 18px)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,16px)', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><MiniArray rows={cur.a} cols={cur.b}/>{pairLabel(cur.a, cur.b)}{solved && <span className="mono" style={{ color: T.ink3, fontWeight: 800 }}>{p1}</span>}</div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(20px,4.6vw,30px)', color: solved ? (isEqual ? T.success : '#C1381A') : T.ink3 }}>{solved ? (isEqual ? '=' : '≠') : '?'}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><MiniArray rows={cur.e} cols={cur.f}/>{pairLabel(cur.e, cur.f)}{solved && <span className="mono" style={{ color: T.ink3, fontWeight: 800 }}>{p2}</span>}</div>
          </div>
        </div>
        {!solved && (
          <>
            <p className="mono fade-up" style={{ margin: 0, fontWeight: 700, color: T.accent, fontSize: 'clamp(13px,1.9vw,15px)', textAlign: 'center' }}>{t(c.q || COMMUTE_Q)}</p>
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(8px,1.6vw,12px)' }}>
              <button className="option" disabled={!canAct} onClick={() => pick(true)} style={ARR_OPT}>{t(YESNO.yes)}</button>
              <button className="option" disabled={!canAct} onClick={() => pick(false)} style={ARR_OPT}>{t(YESNO.no)}</button>
            </div>
          </>
        )}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px,1.6vw,11px)' }}>
          <button onClick={() => setShowTable((s) => !s)} className="btn-ghost" style={{ padding: 'clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px)', fontSize: 'clamp(12px,1.7vw,14px)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: T.accent }}>×</span>{showTable ? t(TBL_HIDE) : t(TBL_SHOW)}
          </button>
          {showTable && <MultTable max={9}/>}
        </div>
        {wrong && !solved && <div className="frame-tip fade-up"><Reaction state="wrong" praise={t(cur.wrong || c.wrong)}/></div>}
        {solved && <div ref={revealRef} className="frame-success fade-up"><Reaction state="correct" praise={t(cur.done_text || c.done_text || (isEqual ? c.done_yes : c.done_no))}/></div>}
        {solved && !isLast && <NextExBtn onClick={nextRound} label={t(NEXT_EX)}/>}
      </div>
    </Stage>
  );
};
// (eski CommuteStage wrapper'lari Dars19 da olib tashlandi — A5/A7/A10 yuqorida Deal/ArrayRev'ga ulangan.)
// sTBL — ko'paytirish jadvalidan foydalanishni o'rgatadi (3 × 4 misolда, bosqichli yoritish).
const ScreenTable = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sTBL;
  const audio = useAudio([
    brgSeg('sTBL', lang),
    ...c.audio[lang].map((text, i) => ({ id: `sTBL_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [done, setDone] = useState(false);
  // sTBL 3 segment: oxirgi segment (sTBL_2 — simmetriya) yangraganda info ochiladi.
  useEffect(() => { if (seg === 'sTBL_2') setDone(true); }, [seg]);
  const revealRef = useRevealScroll(done, 500);
  const canAdv = useAdvanceGate(true, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <Bridge/>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.8vw, 22px)', minHeight: 'clamp(190px, 44vw, 260px)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px,2.2vw,15px)', width: '100%' }}>
            {['line', 'ray', 'segment'].map((ty) => (
              <div key={ty} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,14px)' }}>
                <span style={{ minWidth: 'clamp(74px,20vw,120px)', fontWeight: 800, fontSize: 'clamp(13px,2.2vw,17px)', color: '#2FA0C8' }}>{t(LINE_TYPES[ty])}</span>
                <div style={{ flex: 1, minWidth: 0 }}><LineFig type={ty}/></div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(13px,2.2vw,17px)', color: T.success, minWidth: 'clamp(28px,6vw,40px)', textAlign: 'center' }}>{LT_ENDS[ty]} {t({ ru: 'к.', uz: 'uch' })}</span>
              </div>
            ))}
          </div>
        </div>
        {done && <div ref={revealRef}><InfoNote badge={t(c.info_badge)} text={t(c.info)}/></div>}
      </div>
    </Stage>
  );
};

// ============================================================
// YUPITER SAHNALARI — Б3 biom. MUHIM (metodist 2026-07-15): Yupiter GAZ sayyorasi — unda qattiq
// sirt yo'q, HOSIL O'SMAYDI, kema QO'NA OLMAYDI. Shuning uchun ekipaj Yupiter ORBITASIDA uchadi,
// hosil KEMA ICHIDAGI ISSIQXONADA (teng qator-tublarda) o'sadi; Yupiter ILLYUMINATORdan ko'rinadi.
// ============================================================
const YupiterPlanet = ({ w = '100%' }) => (
  <svg viewBox="0 0 120 120" style={{ width: w, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs>
      <radialGradient id="d13jup" cx="38%" cy="32%" r="86%"><stop offset="0%" stopColor="#F7E8C8"/><stop offset="52%" stopColor="#D9A066"/><stop offset="100%" stopColor="#8A5A2E"/></radialGradient>
      <radialGradient id="d13term" cx="34%" cy="30%" r="80%"><stop offset="46%" stopColor="rgba(0,0,0,0)"/><stop offset="100%" stopColor="rgba(20,10,4,0.62)"/></radialGradient>
      <radialGradient id="d13spec" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(255,250,235,0.9)"/><stop offset="100%" stopColor="rgba(255,250,235,0)"/></radialGradient>
      <radialGradient id="d13halo" cx="50%" cy="50%" r="50%"><stop offset="62%" stopColor="rgba(230,180,110,0)"/><stop offset="82%" stopColor="rgba(230,180,110,0.28)"/><stop offset="100%" stopColor="rgba(230,180,110,0)"/></radialGradient>
      <clipPath id="d13jupc"><circle cx="60" cy="60" r="52"/></clipPath>
    </defs>
    {/* atmosfera halosi (pulslaydi) */}
    <circle className="d13-jhalo" cx="60" cy="60" r="60" fill="url(#d13halo)"/>
    <circle cx="60" cy="60" r="52" fill="url(#d13jup)"/>
    <g clipPath="url(#d13jupc)">
      {/* gaz chiziqlari — sekin siljiydi (d13-jband) */}
      <g className="d13-jband">
        <rect x="-30" y="26" width="180" height="8" rx="4" fill="#C99060" opacity="0.72"/>
        <rect x="-30" y="41" width="180" height="12" rx="6" fill="#AE7A44" opacity="0.62"/>
        <rect x="-30" y="60" width="180" height="9" rx="4" fill="#D6A56E" opacity="0.66"/>
        <rect x="-30" y="76" width="180" height="11" rx="5" fill="#A87340" opacity="0.56"/>
        <rect x="-30" y="92" width="180" height="7" rx="3" fill="#C99060" opacity="0.6"/>
      </g>
      {/* Katta Qizil Dog' (girdobli) */}
      <ellipse cx="44" cy="70" rx="14" ry="8" fill="#B84A30"/>
      <ellipse cx="44" cy="70" rx="9.5" ry="5" fill="#DD6B4A" opacity="0.8"/>
      <ellipse cx="44" cy="70" rx="5" ry="2.6" fill="#F2A488" opacity="0.7"/>
      {/* terminator (3D soya) */}
      <circle cx="60" cy="60" r="52" fill="url(#d13term)"/>
      {/* specular yorug'lik (yuqori-chap) */}
      <ellipse cx="42" cy="38" rx="17" ry="12" fill="url(#d13spec)" opacity="0.55" transform="rotate(-24 42 38)"/>
    </g>
    {/* rim-light (yorug' chekka yoy) */}
    <path d="M22 34 A52 52 0 0 1 96 30" fill="none" stroke="rgba(255,246,222,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(120,80,40,0.5)" strokeWidth="1"/>
  </svg>
);
const PANO_STARS = [[8, 16], [20, 30], [33, 11], [46, 24], [58, 13], [70, 27], [83, 15], [92, 30], [14, 42], [64, 40], [88, 44], [40, 46]];
// Osilgan liana — tepa ramkadan tushadi, sekin tebranadi (d13-vine).
const HangingVine = ({ flip = false }) => (
  <svg viewBox="0 0 22 74" width="100%" style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : 'none' }} aria-hidden="true">
    <path d="M11 0 Q 6 20 12 38 Q 17 54 8 72" stroke="#3E9B5F" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {[12, 26, 40, 54, 66].map((y, i) => (
      <path key={i} d={i % 2 ? 'M0 0 C 7 -2 8 5 2 7 C -2 4 -1 0 0 0 Z' : 'M0 0 C -7 -2 -8 5 -2 7 C 2 4 1 0 0 0 Z'} fill={i % 2 ? '#4FB06A' : '#43A65C'} transform={`translate(${i % 2 ? 13 : 9} ${y})`}/>
    ))}
  </svg>
);
// Bitta ekin-planter (3D raised bed, ENLIK): old yuz + yon + tuproq; 4 realistik o'simlik teng qator
// (tebranadi) + nam-tuman.
const PlanterRow = ({ n = 4, celebrate = false, ri = 0 }) => (
  <div style={{ position: 'relative', display: 'flex', gap: 'clamp(8px,2.2vw,15px)', justifyContent: 'center', padding: '0 clamp(12px,3vw,20px) clamp(9px,2.2vw,13px)', borderRadius: '6px 6px 10px 10px', background: 'linear-gradient(180deg,#9A7648 0%,#7A5230 14%,#5A3A1E 42%,#3A2510 100%)', boxShadow: 'inset 0 -4px 6px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,220,170,0.25), 0 4px 9px rgba(0,0,0,0.5)', border: '1.5px solid #241407', borderTop: '3px solid #B98F58' }}>
    {/* tuproq yuzasi */}
    <div style={{ position: 'absolute', left: 4, right: 4, top: 3, height: 'clamp(6px,1.5vw,9px)', borderRadius: 3, background: 'repeating-linear-gradient(92deg,#4A2F16 0 3px,#38230F 3px 6px)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.55)' }}/>
    {/* nam-tuman zarralari (ko'tariladi) */}
    {[0, 1, 2, 3].map((m) => <span key={'m' + m} className="d13-mist" aria-hidden="true" style={{ position: 'absolute', left: `${16 + m * 22}%`, top: -1, width: 'clamp(4px,1vw,6px)', height: 'clamp(4px,1vw,6px)', borderRadius: '50%', background: 'rgba(205,240,255,0.55)', animationDelay: `${m * 0.7 + ri * 0.4}s` }}/>)}
    {Array.from({ length: n }).map((_, ci) => (
      <span key={ci} className={celebrate ? 'g1-pop-in' : ''} style={{ width: 'clamp(20px,5vw,30px)', marginTop: 'clamp(-15px,-3.4vw,-12px)', zIndex: 1, animationDelay: celebrate ? `${0.2 + (ri * 4 + ci) * 0.05}s` : undefined }}>
        <span className="d13-sway" style={{ display: 'inline-block', transformOrigin: '50% 100%', animationDelay: `${(ri * 4 + ci) * 0.35}s` }}><ScenePlant s={24}/></span>
      </span>
    ))}
  </div>
);
// Tuvakdagi butazor o'simlik (floor burchagi — dekorativ, sanaladigan qatorlardan farqli).
const PottedPlant = ({ w = 44 }) => (
  <svg viewBox="0 0 44 50" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs>
      <radialGradient id="d13bush" cx="34%" cy="26%" r="82%"><stop offset="0" stopColor="#86E79E"/><stop offset="58%" stopColor="#3FB264"/><stop offset="100%" stopColor="#258443"/></radialGradient>
      <linearGradient id="d13pot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9A5028"/><stop offset="0.45" stopColor="#C97B45"/><stop offset="1" stopColor="#8A461F"/></linearGradient>
    </defs>
    <ellipse cx="22" cy="48" rx="12" ry="2.2" fill="rgba(0,0,0,0.2)"/>
    <g stroke="#258443" strokeWidth="0.6" fill="url(#d13bush)"><ellipse cx="14" cy="22" rx="9.5" ry="12"/><ellipse cx="30" cy="20" rx="9.5" ry="12.5"/><ellipse cx="22" cy="13" rx="9" ry="11"/></g>
    <path d="M15 20 Q12 12 9 6" stroke="#258443" strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M29 19 Q32 11 35 6" stroke="#258443" strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M12 32 L32 32 L28.5 47 L15.5 47 Z" fill="url(#d13pot)" stroke="#7A3F1B" strokeWidth="1"/>
    <ellipse cx="22" cy="32" rx="10" ry="2.3" fill="#CE7E42"/>
    <path d="M12 32 L32 32 L31 36 L13 36 Z" fill="#A85A28" opacity="0.4"/>
  </svg>
);
// Shiftdan osilgan tuvak + osilib tushuvchi o'simlik.
const HangingPot = ({ w = 32 }) => (
  <svg viewBox="0 0 34 58" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d13pot2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9A5028"/><stop offset="0.45" stopColor="#C97B45"/><stop offset="1" stopColor="#8A461F"/></linearGradient></defs>
    <path d="M17 0 L8 22 M17 0 L26 22 M17 0 L17 22" stroke="#6A7480" strokeWidth="1"/>
    <path d="M8 22 L26 22 L23 33 L11 33 Z" fill="url(#d13pot2)" stroke="#7A3F1B" strokeWidth="1"/>
    <ellipse cx="17" cy="22" rx="9" ry="2.2" fill="#CE7E42"/>
    <g fill="#3FB264" stroke="#258443" strokeWidth="0.4"><ellipse cx="17" cy="19" rx="8" ry="4.5"/><ellipse cx="11" cy="20" rx="4" ry="3"/><ellipse cx="23" cy="20" rx="4" ry="3"/></g>
    <path d="M12 24 Q8 42 13 56" stroke="#3E9B5F" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    <path d="M22 24 Q26 40 20 52" stroke="#3E9B5F" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    {[[10, 40], [14, 52], [24, 38], [19, 49]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3" ry="1.7" fill="#4FB06A" transform={`rotate(${i % 2 ? 28 : -28} ${x} ${y})`}/>)}
  </svg>
);
// KEMA ISSIQXONA-MODULI (Yupiter orbitasida) — YORUG' interyer: shift + yon devor + pol yorug' metall;
// PANORAMA OYNA (konteyner) da koinot + Yupiter (faqat oyna ichi qorong'i). Grow-lightlar SHIFTDAN
// SIMLAR bilan osilgan. Ko'p o'simlik: 3×4 markaziy planter (sanaladigan) + osilgan tuvak/liana +
// burchak tuvak-o'simliklar. Barcha element jonli/3D (halo/yo'ldosh/tebranish/nur/tuman).
// (GreenWall — chap yashil-devor — metodist 2026-07-15 talabi bilan sahnadan olib tashlandi.)
// Javon + ko'chat-lotoklari (ikki qavat) — devorда.
const ShelfTrays = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px,1.1vw,7px)' }}>
    {[0, 1].map((sh) => (
      <div key={sh} style={{ position: 'relative', width: 'clamp(30px,7.6vw,46px)', height: 'clamp(13px,3.2vw,19px)', borderRadius: '2px 2px 4px 4px', background: 'linear-gradient(180deg,#8A6A42,#523318)', border: '1px solid #241407', boxShadow: '0 2px 3px rgba(0,0,0,0.4)' }}>
        <div style={{ position: 'absolute', left: 2, right: 2, top: 2, height: '38%', borderRadius: 2, background: 'repeating-linear-gradient(90deg,#4A2F16 0 3px,#38230F 3px 6px)' }}/>
        {[0, 1, 2, 3].map((i) => <span key={i} className="d13-sway" style={{ position: 'absolute', bottom: '40%', left: `${10 + i * 22}%`, transformOrigin: '50% 100%', animationDelay: `${(sh * 4 + i) * 0.25}s` }}><svg viewBox="0 0 8 11" width="clamp(5px,1.3vw,8px)" aria-hidden="true"><path d="M4 11 V5" stroke="#2E9B4E" strokeWidth="1" strokeLinecap="round"/><path d="M4 7 C1 6 1 3 2 2 C3.5 3 4 5 4 7 Z" fill="#57D383"/><path d="M4 7 C7 6 7 3 6 2 C4.5 3 4 5 4 7 Z" fill="#46C86C"/></svg></span>)}
      </div>
    ))}
  </div>
);
// Sug'orish idishi (floorда rekvizit).
const WateringCan = ({ w }) => (
  <svg viewBox="0 0 42 34" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d13can" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FD0E0"/><stop offset="1" stopColor="#4E93A4"/></linearGradient></defs>
    <path d="M9 15 L31 15 L29 33 L11 33 Z" fill="url(#d13can)" stroke="#37727F" strokeWidth="1.2"/>
    <path d="M31 17 Q40 15 37 27" stroke="#4E93A4" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M9 15 Q6 6 1 4 L0 8 Q5 10 6 16 Z" fill="url(#d13can)" stroke="#37727F" strokeWidth="1"/>
    <ellipse cx="20" cy="15" rx="11" ry="2.4" fill="#A6E0EC"/>
    <circle cx="1.5" cy="6" r="2.6" fill="#B0E2EE" stroke="#37727F" strokeWidth="0.6"/>
  </svg>
);
// ScenePlant — realistik yosh o'simlik (poya + 4 barg + tomir + kurtak, gradient). Sahna planterlarida.
const ScenePlant = ({ s = 20 }) => (
  <svg viewBox="0 0 28 38" width={s} height={s * 38 / 28} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs>
      <linearGradient id="d13pstem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2A8F48"/><stop offset="0.5" stopColor="#5AD383"/><stop offset="1" stopColor="#2A8F48"/></linearGradient>
      <radialGradient id="d13pleaf" cx="32%" cy="26%" r="84%"><stop offset="0" stopColor="#93EDAA"/><stop offset="56%" stopColor="#46C86C"/><stop offset="100%" stopColor="#25823F"/></radialGradient>
    </defs>
    <ellipse cx="14" cy="35.6" rx="8" ry="2.1" fill="rgba(0,0,0,0.26)"/>
    <path d="M14 35.5 C 13 26 15 18 14 8" stroke="url(#d13pstem)" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
    <path d="M14 28 C 4 27 1.5 19 4 12 C 12 14 14 20 14 28 Z" fill="url(#d13pleaf)" stroke="#25823F" strokeWidth="0.5"/>
    <path d="M14 26 C 24 25 26.5 17 24 10 C 16 12 14 18 14 26 Z" fill="url(#d13pleaf)" stroke="#25823F" strokeWidth="0.5"/>
    <path d="M14 19 C 7 18.5 5.5 13 7 8 C 12.5 9.5 14 14 14 19 Z" fill="url(#d13pleaf)" stroke="#25823F" strokeWidth="0.4"/>
    <path d="M14 17 C 21 16.5 22.5 11 21 6 C 15.5 7.5 14 12 14 17 Z" fill="url(#d13pleaf)" stroke="#25823F" strokeWidth="0.4"/>
    <path d="M14 27 Q9 22 5.5 15" stroke="#25823F" strokeWidth="0.6" fill="none" opacity="0.5"/>
    <path d="M14 25 Q19 20 22.5 13" stroke="#25823F" strokeWidth="0.6" fill="none" opacity="0.5"/>
    <circle cx="14" cy="6.5" r="2.4" fill="#9EE87F"/><circle cx="13.1" cy="5.8" r="0.9" fill="#DAF8C0"/>
  </svg>
);
// Bog'bon-dron — o'simlik ustida suzadi (parragi aylanadi, skaner nur). d13-hover.
const GardenDrone = ({ w }) => (
  <svg viewBox="0 0 46 32" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d13drone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF1F5"/><stop offset="1" stopColor="#96A0AC"/></linearGradient></defs>
    <line x1="9" y1="9" x2="19" y2="15" stroke="#6A7480" strokeWidth="2"/><line x1="37" y1="9" x2="27" y2="15" stroke="#6A7480" strokeWidth="2"/>
    <ellipse className="d13-rotor" cx="9" cy="8" rx="8.5" ry="1.7" fill="#8A94A6" opacity="0.7" style={{ transformOrigin: '9px 8px' }}/>
    <ellipse className="d13-rotor" cx="37" cy="8" rx="8.5" ry="1.7" fill="#8A94A6" opacity="0.7" style={{ transformOrigin: '37px 8px', animationDelay: '.1s' }}/>
    <rect x="15" y="12" width="16" height="10" rx="4.5" fill="url(#d13drone)" stroke="#7E8692" strokeWidth="1"/>
    <path d="M20 22 L17 31 L29 31 L26 22 Z" fill="rgba(110,242,155,0.22)"/>
    <circle className="d13-led" cx="23" cy="21" r="1.9" fill="#6EF29B"/>
  </svg>
);
// (WaterTank — «shisha»/suv-baki — metodist 2026-07-15 talabi bilan sahnadan olib tashlandi.)
// Harorat-namlik datchik-paneli (devor).
const SensorPanel = ({ w }) => (
  <div style={{ width: w, borderRadius: 5, background: 'linear-gradient(180deg,#2A3342,#141B25)', border: '1.5px solid #0C121A', boxShadow: '0 2px 5px rgba(0,0,0,0.4)', padding: 'clamp(3px,0.9vw,5px)', display: 'flex', flexDirection: 'column', gap: 2, fontFamily: "'JetBrains Mono', monospace" }} aria-hidden="true">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 'clamp(7px,1.5vw,10px)', color: '#FFC266', fontWeight: 800 }}>24°C</span>
      <span className="d13-led" style={{ width: 'clamp(3px,0.8vw,5px)', height: 'clamp(3px,0.8vw,5px)', borderRadius: '50%', background: '#6EF29B', boxShadow: '0 0 4px #6EF29B' }}/>
    </div>
    <span style={{ fontSize: 'clamp(7px,1.5vw,10px)', color: '#5BD6F2', fontWeight: 800 }}>70%</span>
    <div style={{ height: 'clamp(2px,0.6vw,3px)', borderRadius: 2, background: 'linear-gradient(90deg,#5BD6F2 70%,#2A3342 70%)' }}/>
  </div>
);
// Kapalak — sahna bo'ylab uchadi (d13-fly), qanotlari qoqadi (d13-wing).
const Butterfly = () => (
  <svg viewBox="0 0 20 16" width="clamp(15px,4vw,23px)" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <g className="d13-wingl" style={{ transformOrigin: '10px 8px' }}><path d="M10 8 C 2 1 -1 8 3 13 C 6 13 10 10 10 8 Z" fill="#FF9E4D" stroke="#E07A2C" strokeWidth="0.5"/></g>
    <g className="d13-wingr" style={{ transformOrigin: '10px 8px' }}><path d="M10 8 C 18 1 21 8 17 13 C 14 13 10 10 10 8 Z" fill="#FFB86B" stroke="#E07A2C" strokeWidth="0.5"/></g>
    <ellipse cx="10" cy="8" rx="1.1" ry="3.6" fill="#3A2A1A"/>
    <path d="M10 5 L8 2 M10 5 L12 2" stroke="#3A2A1A" strokeWidth="0.6" strokeLinecap="round"/>
  </svg>
);
// CrewChar — ekipaj a'zosi SKAFANDRDA (dubulg'a+vizor+kombinezon+ranecha+etik), qo'li silkinadi (d13-wave).
// Zuhra rangi #8B6FB0. Real/jonli: idle-suzish (g1-cast-fig) + qo'l silkitish.
const CrewChar = ({ color = '#8B6FB0' }) => (
  <svg className="g1-char" viewBox="0 0 60 98" aria-hidden="true" style={{ height: '100%', width: 'auto', display: 'block' }}>
    <ellipse cx="30" cy="95.5" rx="17" ry="3" fill="rgba(0,0,0,0.22)"/>
    {/* ranecha (hayot-ta'minot) */}
    <rect x="16" y="36" width="28" height="32" rx="7" fill="#9AA4B0" stroke="#6E7884" strokeWidth="1.4"/>
    <rect x="19" y="40" width="22" height="6" rx="2" fill="#7E8894"/>
    {/* oyoqlar + etik */}
    <rect x="22" y="70" width="7.5" height="20" rx="3.5" fill={color}/><rect x="30.5" y="70" width="7.5" height="20" rx="3.5" fill={color}/>
    <rect x="20" y="88" width="11" height="7" rx="3" fill="#EDEFF2" stroke="#BFC7CE" strokeWidth="0.8"/><rect x="29" y="88" width="11" height="7" rx="3" fill="#EDEFF2" stroke="#BFC7CE" strokeWidth="0.8"/>
    {/* tana (kombinezon) */}
    <rect x="17" y="41" width="26" height="35" rx="11" fill={color}/>
    <rect x="17" y="41" width="26" height="11" rx="8" fill="rgba(255,255,255,0.22)"/>
    {/* ko'krak paneli */}
    <rect x="23" y="50" width="14" height="10" rx="2.5" fill="#222A38"/><circle cx="27" cy="55" r="1.6" fill="#6EF29B"/><circle cx="32" cy="55" r="1.6" fill="#FFC23C"/>
    {/* chap qo'l (pastda) */}
    <path d="M19 46 C 12 52 11 61 14 67" stroke={color} strokeWidth="7.5" fill="none" strokeLinecap="round"/><circle cx="14" cy="68" r="4.8" fill="#EDEFF2"/>
    {/* o'ng qo'l (SILKINADI) */}
    <g className="d13-wave" style={{ transformBox: "view-box", transformOrigin: '41px 46px' }}>
      <path d="M41 46 C 50 42 53 31 51 22" stroke={color} strokeWidth="7.5" fill="none" strokeLinecap="round"/>
      <circle cx="51" cy="21" r="4.8" fill="#EDEFF2"/>
    </g>
    {/* dubulg'a */}
    <circle cx="30" cy="25" r="16.5" fill="#E8EEF4" stroke="#A9BCC8" strokeWidth="1.6"/>
    <path d="M16.5 23 A 14 14 0 0 1 43.5 21 L 43.5 29 A 14 14 0 0 1 16.5 31 Z" fill="#3E8FC4"/>
    <path d="M16.5 23 A 14 14 0 0 1 43.5 21 L 43.5 24 A 14 14 0 0 1 16.5 26 Z" fill="#7EC8EE"/>
    <ellipse cx="23" cy="21" rx="4.2" ry="2.6" fill="rgba(255,255,255,0.65)" transform="rotate(-18 23 21)"/>
    <circle cx="30" cy="25" r="16.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
  </svg>
);
const GROW_LAMPS = [36, 50, 64];
const ShipGreenhouse = ({ arrive = false, celebrate = false, bubbleNode, charNode }) => (
  <div className="d2-scene" style={{ background: 'linear-gradient(180deg,#E4E9DF 0%,#D2DACC 52%,#BEC6B6 100%)' }}>
    {/* SHIFT (yorug') + panel-lampalar */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '11%', background: 'linear-gradient(180deg,#EFF1EB,#C6CCC0)', boxShadow: '0 3px 8px rgba(0,0,0,0.16)', zIndex: 6 }}>
      <div style={{ position: 'absolute', left: '7%', right: '7%', bottom: 2, height: 'clamp(4px,1vw,7px)', borderRadius: 3, background: 'linear-gradient(180deg,#BCC2B6,#8E948A)' }}/>
      {[20, 50, 80].map((x) => <div key={x} style={{ position: 'absolute', left: `${x}%`, top: '24%', transform: 'translateX(-50%)', width: 'clamp(20px,5vw,32px)', height: 'clamp(4px,1vw,7px)', borderRadius: 3, background: '#FFE7A8', boxShadow: '0 0 9px 2px rgba(255,215,140,0.75)' }}/>)}
    </div>
    {/* yon devorlar (yorug' metall panel) */}
    <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: '11%', bottom: 0, width: '6%', background: 'linear-gradient(90deg,#DAE0D2,#C2CABC)', boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.1)', zIndex: 1 }}/>
    <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: '11%', bottom: 0, width: '6%', background: 'linear-gradient(270deg,#DAE0D2,#C2CABC)', boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.1)', zIndex: 1 }}/>
    {/* PANORAMA OYNA (konteyner) — koinot + Yupiter (faqat shu yer qorong'i) */}
    <div style={{ position: 'absolute', left: '7%', right: '7%', top: '12%', height: '42%', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 14px rgba(0,0,0,0.26)', zIndex: 2, border: 'clamp(5px,1.4vw,8px) solid', borderColor: '#CFD6E0 #9AA2AE #7E8692 #B6BEC8' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 66% 44%, #1b2a4e 0%, #070b16 84%)' }}/>
      <div style={{ position: 'absolute', left: '2%', top: '10%', width: '46%', height: '70%', background: 'radial-gradient(ellipse at 40% 40%, rgba(90,120,220,0.16), rgba(150,90,200,0.08) 55%, transparent 74%)', filter: 'blur(4px)' }}/>
      {PANO_STARS.map(([x, y], i) => <span key={i} className="d2-star" style={{ position: 'absolute', left: `${x}%`, top: `${(y * 1.7) % 90}%`, width: i % 3 ? 1.6 : 2.6, height: i % 3 ? 1.6 : 2.6, borderRadius: '50%', background: '#DCEAF8', animationDelay: `${i * 0.4}s` }}/>)}
      <div className={arrive ? 'g1-pop-in' : ''} style={{ position: 'absolute', right: '3%', top: '-30%', width: 'clamp(98px,27vw,158px)', zIndex: 1 }}><YupiterPlanet/></div>
      <span className="d13-moon1" aria-hidden="true" style={{ position: 'absolute', top: '62%', width: 'clamp(9px,2.2vw,14px)', height: 'clamp(9px,2.2vw,14px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #F0EAD8, #8A7A60 78%, #4A4030)', boxShadow: '0 0 6px rgba(230,220,200,0.5)' }}/>
      <span className="d13-moon2" aria-hidden="true" style={{ position: 'absolute', top: '28%', width: 'clamp(6px,1.6vw,10px)', height: 'clamp(6px,1.6vw,10px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #CFE0F0, #6A7A8A 80%, #3A4450)', boxShadow: '0 0 5px rgba(190,210,235,0.5)' }}/>
      {[33, 66].map((x) => <div key={x} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: 0, bottom: 0, width: 'clamp(4px,1.1vw,7px)', background: 'linear-gradient(90deg,rgba(46,54,66,0.75),rgba(120,132,150,0.9),rgba(46,54,66,0.75))' }}/>)}
      <div className="d13-sheen" style={{ position: 'absolute', top: 0, bottom: 0, width: '26%', background: 'linear-gradient(115deg, rgba(255,255,255,0.16), transparent 60%)', transform: 'skewX(-14deg)' }}/>
      <div style={{ position: 'absolute', left: '4%', top: '8%', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(8px,1.5vw,11px)', letterSpacing: '.08em', color: '#8FE0C0', textShadow: '0 0 6px rgba(140,224,192,0.6)' }}>◍ YUPITER · ORBITA</div>
    </div>
    {/* POL (yorug' metall + perspektiva grid) */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: 'linear-gradient(180deg,#CDD4C8 0%,#B6BEAC 46%,#9AA290 100%)', boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.14)', zIndex: 3 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 'clamp(4px,1vw,7px)', background: 'linear-gradient(180deg,#DEE3D7,#AEB6A6)' }}/>
      {[26, 50, 74].map((x) => <div key={x} style={{ position: 'absolute', bottom: 0, left: `${x}%`, width: 1, height: '72%', background: 'rgba(110,118,102,0.28)', transform: `skewX(${(x - 50) * 0.5}deg)`, transformOrigin: 'bottom' }}/>)}
    </div>
    {/* GROW-LIGHTLAR — SHIFTDAN SIMLAR bilan osilgan (sim + lampa + glow + nur-konus) */}
    {GROW_LAMPS.map((x, i) => (
      <React.Fragment key={i}>
        <div aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: '11%', height: '37%', width: 2, background: 'linear-gradient(180deg,#48505C,#6C7480)', transform: 'translateX(-50%)', zIndex: 4 }}/>
        <div style={{ position: 'absolute', left: `${x}%`, top: '47%', transform: 'translateX(-50%)', zIndex: 4, width: 'clamp(40px,10vw,60px)', height: 'clamp(8px,2vw,13px)', borderRadius: 4, background: 'linear-gradient(180deg,#E8ECF2,#8E96A2)', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>
          <div className="d13-glow" style={{ position: 'absolute', inset: '2px 4px', borderRadius: 3, background: 'linear-gradient(180deg,#FFE39A,#FF9E38)' }}/>
          <div className="d13-beam" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', width: '200%', height: 'clamp(64px,18vw,108px)', background: 'linear-gradient(180deg, rgba(255,196,96,0.42), rgba(255,196,96,0.06) 68%, transparent)', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0% 100%)', pointerEvents: 'none' }}/>
          {/* tomchi-sug'orish */}
          <span className="d13-drop" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '120%', transform: 'translateX(-50%)', width: 'clamp(3px,0.8vw,5px)', height: 'clamp(5px,1.2vw,7px)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'rgba(150,215,235,0.85)', animationDelay: `${i * 0.9}s` }}/>
        </div>
      </React.Fragment>
    ))}
    {/* OSILGAN O'SIMLIKLAR — faqat O'NG tomon (kattaroq); chap tomon bo'sh (metodist) */}
    <div className="d13-vine" style={{ position: 'absolute', right: '23%', top: '10%', width: 'clamp(20px,5.4vw,32px)', transformOrigin: '50% 0%', zIndex: 6, animationDuration: '5.6s' }}><HangingVine flip/></div>
    <div className="d13-vine d13-vine2" style={{ position: 'absolute', right: '6.5%', top: '10%', width: 'clamp(24px,6.4vw,40px)', transformOrigin: '50% 0%', zIndex: 6 }}><HangingPot w="100%"/></div>
    {/* JAVON-LOTOKLAR (o'ng yon, kattaroq) */}
    <div style={{ position: 'absolute', right: '0.5%', top: '25%', transform: 'scale(1.32)', transformOrigin: 'right top', zIndex: 4 }}><ShelfTrays/></div>
    {/* O'NG BURCHAK TUVAK-O'SIMLIK (kattaroq) + sug'orish idishi (kattaroq) */}
    <div style={{ position: 'absolute', right: '2%', bottom: '2%', width: 'clamp(40px,10.4vw,64px)', zIndex: 4 }}><PottedPlant w="100%"/></div>
    <div style={{ position: 'absolute', right: '18%', bottom: '3%', width: 'clamp(32px,8vw,50px)', zIndex: 4 }}><WateringCan w="100%"/></div>
    {/* DATCHIK-PANEL (o'ng devor, kattaroq) */}
    <div style={{ position: 'absolute', right: '0.5%', top: '57%', width: 'clamp(34px,8.4vw,54px)', zIndex: 4 }}><SensorPanel w="100%"/></div>
    {/* PODIUM + markaziy 3×5 (SANALADIGAN, ajratilgan) */}
    <div style={{ position: 'absolute', left: '50%', bottom: '3%', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px,1.2vw,8px)', padding: 'clamp(4px,1vw,7px)', borderRadius: 12, background: 'rgba(255,246,222,0.1)', boxShadow: '0 0 0 2px rgba(255,214,120,0.5), 0 6px 16px rgba(0,0,0,0.3)' }}>
        {[0, 1, 2].map((ri) => <PlanterRow key={ri} n={5} celebrate={celebrate} ri={ri}/>)}
      </div>
      {/* podium plita */}
      <div style={{ marginTop: -1, width: '116%', height: 'clamp(9px,2.4vw,15px)', borderRadius: '4px 4px 7px 7px', background: 'linear-gradient(180deg,#E8ECE2,#ACB4A4)', boxShadow: '0 6px 13px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,214,120,0.45), inset 0 1px 2px rgba(255,255,255,0.6)' }}/>
    </div>
    {/* BOG'BON-DRON — o'simliklar ustida suzadi (kattaroq) */}
    <div className="d13-hover" style={{ position: 'absolute', left: '67%', top: '40%', width: 'clamp(46px,11.5vw,72px)', zIndex: 6 }}><GardenDrone w="100%"/></div>
    {/* KAPALAK — sahna bo'ylab uchadi (kattaroq) */}
    <div className="d13-fly" style={{ position: 'absolute', left: '27%', top: '39%', zIndex: 6 }}><Butterfly/></div>
    {bubbleNode}
    {/* PERSONAJ — «?»/tablo tagida (chapda, old planда, z-index baland) */}
    {charNode}
  </div>
);
// s0 — YUPITER ORBITASIGA KELISH: illyuminatorda Yupiter ochiladi; issiqxona 3×4 ekin + jami "?".
const YupiterScene = ({ answer = null }) => {
  const shown = answer != null;
  return (
    <ShipGreenhouse arrive
      bubbleNode={(
        <div style={{ position: 'absolute', left: '15%', top: '34%', transform: 'translateX(-50%)', zIndex: 7 }}>
          <div className={shown ? 'g1-pop-in' : ''} style={{ minWidth: 'clamp(40px,8vw,54px)', height: 'clamp(36px,7vw,48px)', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(19px,4.2vw,28px)', background: shown ? T.successSoft : '#FFFFFF', color: shown ? T.success : T.ink3, border: `2.5px ${shown ? 'solid' : 'dashed'} ${shown ? T.success : '#A7A6A2'}`, boxShadow: '0 3px 10px rgba(0,0,0,0.35)', animation: shown ? 'none' : 'g1pulse 1.5s ease-in-out infinite' }}>{shown ? 15 : '?'}</div>
        </div>
      )}
      charNode={(
        <div className="d2-scene-bit" style={{ right: 'auto', left: '15%', bottom: '2%', height: '50%', zIndex: 7, transform: 'translateX(-50%)' }}>
          <span className="g1-cast-fig"><BitSVG state="present"/></span>
        </div>
      )}/>
  );
};
// s15 — KEMA ISSIQXONASI (xulosa): hosil ko'paytirib sanaldi + yashil ✓ tablo.
const YupiterField = ({ label }) => {
  const t = useT();
  return (
    <ShipGreenhouse celebrate
      bubbleNode={(
        <div style={{ position: 'absolute', left: '16%', top: '30%', transform: 'translateX(-50%)', zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 'clamp(9px,1.6vw,12px)', fontWeight: 800, letterSpacing: '.05em', color: '#EAF0FF', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>{t(label)}</span>
          <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 'clamp(52px,11vw,72px)', height: 'clamp(38px,7.4vw,50px)', padding: '0 clamp(10px,2vw,15px)', justifyContent: 'center', borderRadius: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px,4.6vw,30px)', background: T.successSoft, color: T.success, border: `2.5px solid ${T.success}`, boxShadow: '0 4px 14px -4px rgba(31,122,77,0.5)' }}>
            15<span style={{ fontSize: 'clamp(17px,3.4vw,23px)' }}>✓</span>
          </div>
        </div>
      )}
      charNode={(
        <div className="d2-scene-bit" style={{ right: 'auto', left: '16%', bottom: '2%', height: '50%', zIndex: 7, transform: 'translateX(-50%)' }}>
          <span className="g1-cast-fig"><BitSVG state="happy"/></span>
        </div>
      )}/>
  );
};

// ============================================================
// SATURN SAHNALARI — Б4 biom (SYUJET §Б4). Metodist talabi (2026-07-16): s0/s15 HAQIQIY, HAJMLI 3D,
// JONLI. Saturn — halqali gaz sayyorasi; ekipaj uning YO'LDOSHIDAGI KON og'zida (qattiq sirt), kristall
// o'ljasi qoyaga o'rnashgan. Kon ichida kristallarni teng IDISHLARGA ulashadi (bo'lish mavzusi).
// Saturnning o'zi kon og'zidan (ochiq osmon) halqasi bilan ko'rinadi. Hammasi jonli: halo, halqa-shu'la,
// kristall-porlash, chang zarralari, lampa-nur, kon-arava, dron.
// ============================================================
// SaturnPlanet — realistik halqali sayyora: banded tana + terminator soya + rim-light + OLD/ORQA halqa
// yoylari (planeta ortida/oldida o'tadi) + Cassini bo'shlig'i + halqa soyasi tanaда + atmosfera halosi.
// SaturnPlanet — FOTOREALISTIK halqali sayyora: oblat (yassilangan) tana + ko'p qatlamli gaz-kamarlar +
// muzli A/B/C halqalar (Cassini bo'shlig'i) + halqa OLD/ORQA yoyi (planeta oldida/ortida) + halqa soyasi
// tanada + planeta soyasi halqada + yumshoq terminator + rim-light + specular + atmosfera halosi.
const SaturnPlanet = ({ w = '100%' }) => (
  <svg viewBox="0 0 200 140" style={{ width: w, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs>
      <radialGradient id="d19sat" cx="38%" cy="30%" r="88%"><stop offset="0%" stopColor="#FBF1D6"/><stop offset="34%" stopColor="#F0D49A"/><stop offset="66%" stopColor="#D9A860"/><stop offset="100%" stopColor="#8F6330"/></radialGradient>
      <radialGradient id="d19satTerm" cx="34%" cy="28%" r="82%"><stop offset="52%" stopColor="rgba(0,0,0,0)"/><stop offset="100%" stopColor="rgba(30,15,4,0.66)"/></radialGradient>
      <radialGradient id="d19satSpec" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(255,252,242,0.95)"/><stop offset="100%" stopColor="rgba(255,252,242,0)"/></radialGradient>
      <radialGradient id="d19satHalo" cx="50%" cy="50%" r="50%"><stop offset="58%" stopColor="rgba(244,218,164,0)"/><stop offset="82%" stopColor="rgba(244,218,164,0.28)"/><stop offset="100%" stopColor="rgba(244,218,164,0)"/></radialGradient>
      <linearGradient id="d19ringA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="rgba(150,124,88,0)"/><stop offset="0.12" stopColor="rgba(198,172,130,0.82)"/><stop offset="0.5" stopColor="rgba(234,216,182,0.42)"/><stop offset="0.88" stopColor="rgba(198,172,130,0.82)"/><stop offset="1" stopColor="rgba(150,124,88,0)"/></linearGradient>
      <linearGradient id="d19ringB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="rgba(180,150,108,0)"/><stop offset="0.1" stopColor="rgba(240,224,190,0.98)"/><stop offset="0.5" stopColor="rgba(252,242,214,0.62)"/><stop offset="0.9" stopColor="rgba(240,224,190,0.98)"/><stop offset="1" stopColor="rgba(180,150,108,0)"/></linearGradient>
      <clipPath id="d19satBody"><ellipse cx="100" cy="70" rx="37" ry="34"/></clipPath>
      <clipPath id="d19satFront"><rect x="0" y="70" width="200" height="70"/></clipPath>
    </defs>
    {/* atmosfera halosi (pulslaydi) */}
    <ellipse className="d19-sathalo" cx="100" cy="70" rx="52" ry="49" fill="url(#d19satHalo)"/>
    {/* ORQA halqa (planeta ortida — to'liq ellips; tana bilan qoplanadi) */}
    <g transform="rotate(-15 100 70)">
      <ellipse cx="100" cy="70" rx="90" ry="23.5" fill="none" stroke="url(#d19ringA)" strokeWidth="7"/>
      <ellipse cx="100" cy="70" rx="76" ry="19.8" fill="none" stroke="url(#d19ringB)" strokeWidth="12"/>
      <ellipse cx="100" cy="70" rx="60" ry="15.6" fill="none" stroke="url(#d19ringA)" strokeWidth="5" opacity="0.6"/>
    </g>
    {/* TANA (oblat ellips) */}
    <ellipse cx="100" cy="70" rx="37" ry="34" fill="url(#d19sat)"/>
    <g clipPath="url(#d19satBody)">
      {/* gaz kamarlari — egri (ellips), sekin siljiydi */}
      <g className="d19-satband">
        <ellipse cx="100" cy="52" rx="60" ry="4" fill="#EBD6A6" opacity="0.55"/>
        <ellipse cx="100" cy="60" rx="62" ry="5" fill="#C99A5A" opacity="0.5"/>
        <ellipse cx="100" cy="70" rx="63" ry="4.4" fill="#F0DCAE" opacity="0.55"/>
        <ellipse cx="100" cy="79" rx="61" ry="5.4" fill="#BC8E4E" opacity="0.48"/>
        <ellipse cx="100" cy="88" rx="57" ry="3.6" fill="#D8B478" opacity="0.5"/>
        {/* qutb tuslari */}
        <ellipse cx="100" cy="41" rx="30" ry="6" fill="#CDB488" opacity="0.4"/>
      </g>
      {/* halqa SOYASI tanaда (nozik qorong'i egri chiziq) */}
      <ellipse cx="100" cy="72.5" rx="39" ry="4.6" fill="rgba(40,22,8,0.42)" transform="rotate(-15 100 70)"/>
      {/* terminator (3D soya) */}
      <ellipse cx="100" cy="70" rx="37" ry="34" fill="url(#d19satTerm)"/>
      {/* specular yorug'lik (yuqori-chap) */}
      <ellipse cx="82" cy="48" rx="16" ry="10.5" fill="url(#d19satSpec)" opacity="0.5" transform="rotate(-24 82 48)"/>
    </g>
    {/* rim-light (yorug' quyoshli chekka yoy) */}
    <path d="M66 44 A37 34 0 0 1 134 42" fill="none" stroke="rgba(255,249,228,0.55)" strokeWidth="1.6" strokeLinecap="round"/>
    <ellipse cx="100" cy="70" rx="37" ry="34" fill="none" stroke="rgba(118,82,42,0.45)" strokeWidth="1"/>
    {/* OLD halqa yoyi (planeta oldida — pastki yarim) + planeta soyasi halqada (o'ng past) */}
    <g transform="rotate(-15 100 70)" clipPath="url(#d19satFront)">
      <ellipse cx="100" cy="70" rx="90" ry="23.5" fill="none" stroke="url(#d19ringA)" strokeWidth="7"/>
      <ellipse cx="100" cy="70" rx="76" ry="19.8" fill="none" stroke="url(#d19ringB)" strokeWidth="12"/>
      <ellipse cx="100" cy="70" rx="60" ry="15.6" fill="none" stroke="url(#d19ringA)" strokeWidth="5" opacity="0.6"/>
      {/* planeta soyasi old halqada — o'ng tomonда qorong'i segment */}
      <ellipse cx="118" cy="82" rx="20" ry="10" fill="rgba(10,7,20,0.5)"/>
    </g>
  </svg>
);
// Devorдаги kristall tomiri — qoyaga o'rnashgan porlaydigan kristallar klasteri.
const CrystalVein = ({ flip = false }) => (
  <svg viewBox="0 0 46 84" width="100%" style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : 'none' }} aria-hidden="true">
    <defs><linearGradient id="d19rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A2E52"/><stop offset="1" stopColor="#221838"/></linearGradient></defs>
    <path d="M4 22 Q0 48 8 74 Q26 82 40 70 Q46 44 38 20 Q22 12 4 22 Z" fill="url(#d19rock)" stroke="#4A3A66" strokeWidth="1"/>
    <g className="d19-cryglow">
      <g transform="translate(14 30) rotate(-14)"><Cr/></g>
      <g transform="translate(26 40) rotate(10) scale(1.15)"><Cr/></g>
      <g transform="translate(17 52) rotate(-6) scale(0.85)"><Cr/></g>
    </g>
  </svg>
);
// (Cr — CrystalVein ichidagi kichik kristall silueti)
const Cr = () => (
  <g>
    <path d="M0 0 L7 8 L4.5 24 L-4.5 24 L-7 8 Z" fill="#5FC7E8" stroke="#2A6E9E" strokeWidth="0.5"/>
    <path d="M0 0 L-7 8 L-4.5 24 L0 9 Z" fill="#A6E8F8" opacity="0.9"/>
    <path d="M0 0 L7 8 L0 9 Z" fill="#DFF7FF" opacity="0.7"/>
  </g>
);
// Kon og'zi (ochiq osmon) yulduzlari.
const CAVE_STARS = [[10, 18], [24, 10], [38, 22], [52, 12], [66, 24], [80, 14], [90, 26], [16, 30], [72, 32], [46, 30]];
// Kon lampasi — shiftdan osilgan, sovuq-oq nur konusi.
const MINE_LAMPS = [30, 52, 74];
// Kon-arava (floor rekvizit) — kristall bilan to'la.
const OreCart = ({ w }) => (
  <svg viewBox="0 0 60 44" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d19cart" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A7480"/><stop offset="1" stopColor="#3A424C"/></linearGradient></defs>
    <path d="M6 14 L54 14 L48 34 L12 34 Z" fill="url(#d19cart)" stroke="#2A313A" strokeWidth="1.4"/>
    <path d="M9 20 L51 20" stroke="#2A313A" strokeWidth="1" opacity="0.5"/>
    <g><g transform="translate(20 8) scale(0.5)"><Cr/></g><g transform="translate(32 6) scale(0.6)"><Cr/></g><g transform="translate(42 9) scale(0.45)"><Cr/></g></g>
    <circle cx="18" cy="38" r="5" fill="#2A313A" stroke="#565E68" strokeWidth="1.4"/><circle cx="42" cy="38" r="5" fill="#2A313A" stroke="#565E68" strokeWidth="1.4"/>
    <circle cx="18" cy="38" r="1.6" fill="#565E68"/><circle cx="42" cy="38" r="1.6" fill="#565E68"/>
  </svg>
);
// Kon-droni — o'lja ustida suzadi, skaner nur (parragi aylanadi).
const MineBot = ({ w }) => (
  <svg viewBox="0 0 46 34" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d19bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF1F5"/><stop offset="1" stopColor="#96A0AC"/></linearGradient></defs>
    <line x1="9" y1="9" x2="19" y2="15" stroke="#6A7480" strokeWidth="2"/><line x1="37" y1="9" x2="27" y2="15" stroke="#6A7480" strokeWidth="2"/>
    <ellipse className="d13-rotor" cx="9" cy="8" rx="8.5" ry="1.7" fill="#8A94A6" opacity="0.7" style={{ transformOrigin: '9px 8px' }}/>
    <ellipse className="d13-rotor" cx="37" cy="8" rx="8.5" ry="1.7" fill="#8A94A6" opacity="0.7" style={{ transformOrigin: '37px 8px', animationDelay: '.1s' }}/>
    <rect x="15" y="12" width="16" height="10" rx="4.5" fill="url(#d19bot)" stroke="#7E8692" strokeWidth="1"/>
    <path d="M20 22 L17 31 L29 31 L26 22 Z" fill="rgba(95,199,232,0.24)"/>
    <circle className="d13-led" cx="23" cy="21" r="1.9" fill="#5FC7E8"/>
  </svg>
);
// SORTLASH IDISHLARI — markaziy podium: 3 idish, har birida teng kristall (bo'lish teması, 12→3×4).
const SortBins = ({ per = 4, groups = 3, celebrate = false }) => (
  <div style={{ display: 'flex', gap: '2.2cqw', justifyContent: 'center', alignItems: 'flex-end' }}>
    {Array.from({ length: groups }).map((_, g) => (
      <div key={g} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ minHeight: '5cqw', display: 'flex', flexWrap: 'wrap', gap: '0.5cqw', justifyContent: 'center', alignItems: 'flex-end', padding: '1cqw', width: '9.5cqw', borderRadius: '4px 4px 9px 9px', background: 'linear-gradient(180deg,#3A2E52,#241A38)', border: '2px solid #4C3A6C', boxShadow: 'inset 0 3px 7px rgba(0,0,0,0.5)' }}>
          {Array.from({ length: per }).map((_, i) => <span key={i} className={celebrate ? 'g1-pop-in' : ''} style={{ display: 'inline-flex', width: '2.5cqw', animationDelay: celebrate ? `${(i * groups + g) * 0.07}s` : undefined }}><Crystal s="2.5cqw"/></span>)}
        </div>
        <div style={{ width: '11cqw', height: '1.3cqw', borderRadius: '0 0 4px 4px', background: 'linear-gradient(180deg,#5C4A80,#3A2E52)' }}/>
      </div>
    ))}
  </div>
);
// KON MODULI (Saturn yo'ldoshi) — qorong'i g'or interyeri: qoya devor + kristall tomirlar + shift-lampalar +
// kon og'zi (ochiq osmonда Saturn halqasi bilan) + pol + markaziy sortlash-podium. Barcha element jonli/3D.
const SaturnMine = ({ arrive = false, celebrate = false, dealt = false, bubbleNode, charNode }) => (
  <div className="d2-scene" style={{ background: 'linear-gradient(180deg,#0C0A1A 0%,#171029 46%,#241636 100%)' }}>
    {/* SHIFT (qoya) + lampalar rafi */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '11%', background: 'linear-gradient(180deg,#241838,#150E24)', boxShadow: '0 3px 10px rgba(0,0,0,0.5)', zIndex: 6 }}>
      <div style={{ position: 'absolute', left: '7%', right: '7%', bottom: 2, height: 'clamp(4px,1vw,7px)', borderRadius: 3, background: 'linear-gradient(180deg,#3A2A52,#221838)' }}/>
    </div>
    {/* yon qoya devorlari */}
    <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: '11%', bottom: 0, width: '7%', background: 'linear-gradient(90deg,#241838,#150E24)', boxShadow: 'inset -3px 0 7px rgba(0,0,0,0.4)', zIndex: 1 }}/>
    <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: '11%', bottom: 0, width: '7%', background: 'linear-gradient(270deg,#241838,#150E24)', boxShadow: 'inset 3px 0 7px rgba(0,0,0,0.4)', zIndex: 1 }}/>
    {/* KON OG'ZI (ochiq osmon) — koinot + Saturn halqasi bilan */}
    <div style={{ position: 'absolute', left: '7%', right: '7%', top: '12%', height: '42%', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 16px rgba(0,0,0,0.4)', zIndex: 2, border: 'clamp(5px,1.4vw,8px) solid', borderColor: '#3A2A52 #221838 #150E24 #2E2044' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, #241a44 0%, #070610 86%)' }}/>
      <div style={{ position: 'absolute', left: '4%', top: '8%', width: '48%', height: '72%', background: 'radial-gradient(ellipse at 42% 40%, rgba(120,90,200,0.14), rgba(90,120,220,0.06) 56%, transparent 76%)', filter: 'blur(4px)' }}/>
      {CAVE_STARS.map(([x, y], i) => <span key={i} className="d2-star" style={{ position: 'absolute', left: `${x}%`, top: `${(y * 1.8) % 88}%`, width: i % 3 ? 1.6 : 2.6, height: i % 3 ? 1.6 : 2.6, borderRadius: '50%', background: '#DCEAF8', animationDelay: `${i * 0.4}s` }}/>)}
      <div className={arrive ? 'g1-pop-in' : ''} style={{ position: 'absolute', right: '2%', top: '-16%', width: '34cqw', zIndex: 1 }}><SaturnPlanet/></div>
      <span className="d13-moon1" aria-hidden="true" style={{ position: 'absolute', top: '66%', width: 'clamp(8px,2vw,12px)', height: 'clamp(8px,2vw,12px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #E8E0D0, #8A7A60 78%, #4A4030)', boxShadow: '0 0 6px rgba(230,220,200,0.5)' }}/>
      <div className="d13-sheen" style={{ position: 'absolute', top: 0, bottom: 0, width: '26%', background: 'linear-gradient(115deg, rgba(255,255,255,0.12), transparent 60%)', transform: 'skewX(-14deg)' }}/>
      <div style={{ position: 'absolute', left: '4%', top: '8%', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(8px,1.5vw,11px)', letterSpacing: '.08em', color: '#B79AF0', textShadow: '0 0 6px rgba(150,120,224,0.6)' }}>◍ SATURN · ORBITA</div>
    </div>
    {/* POL (kon zamini) */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: 'linear-gradient(180deg,#2A1E40 0%,#1E1530 46%,#140D22 100%)', boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.4)', zIndex: 3 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 'clamp(4px,1vw,7px)', background: 'linear-gradient(180deg,#3A2A52,#241838)' }}/>
      {[26, 50, 74].map((x) => <div key={x} style={{ position: 'absolute', bottom: 0, left: `${x}%`, width: 1, height: '70%', background: 'rgba(120,90,180,0.22)', transform: `skewX(${(x - 50) * 0.5}deg)`, transformOrigin: 'bottom' }}/>)}
    </div>
    {/* KON-LAMPALAR — shiftdan osilgan (sim + lampa + sovuq glow + nur-konus) */}
    {MINE_LAMPS.map((x, i) => (
      <React.Fragment key={i}>
        <div aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: '11%', height: '37%', width: 2, background: 'linear-gradient(180deg,#3A3050,#5A4A72)', transform: 'translateX(-50%)', zIndex: 4 }}/>
        <div style={{ position: 'absolute', left: `${x}%`, top: '47%', transform: 'translateX(-50%)', zIndex: 4, width: '9.5cqw', height: '2cqw', borderRadius: 4, background: 'linear-gradient(180deg,#C6CCE2,#7A82A0)', boxShadow: '0 2px 5px rgba(0,0,0,0.4)' }}>
          <div className="d13-glow" style={{ position: 'absolute', inset: '2px 4px', borderRadius: 3, background: 'linear-gradient(180deg,#E8F4FF,#9CC8F0)' }}/>
          <div className="d13-beam" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', width: '200%', height: '20cqw', background: 'linear-gradient(180deg, rgba(190,220,255,0.34), rgba(190,220,255,0.05) 68%, transparent)', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0% 100%)', pointerEvents: 'none' }}/>
        </div>
      </React.Fragment>
    ))}
    {/* DEVOR KRISTALL TOMIRLARI (o'ng va chap) */}
    <div style={{ position: 'absolute', right: '0.5%', top: '30%', width: '8.5cqw', zIndex: 4 }}><CrystalVein/></div>
    <div style={{ position: 'absolute', left: '0.5%', top: '55%', width: '7cqw', zIndex: 4 }}><CrystalVein flip/></div>
    {/* KON-ARAVA (o'ng past) */}
    <div style={{ position: 'absolute', right: '2%', bottom: '2%', width: '11cqw', zIndex: 4 }}><OreCart w="100%"/></div>
    {/* SORTLASH-PODIUM (o'ng-markaz) — dealt=false: 12 kristal UYUMI (ulashilmagan); dealt=true: 4 idish × 3 */}
    <div style={{ position: 'absolute', left: '63%', bottom: '3%', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: 'clamp(4px,1vw,7px)', borderRadius: 12, background: 'rgba(120,90,200,0.1)', boxShadow: '0 0 0 2px rgba(150,120,224,0.4), 0 6px 16px rgba(0,0,0,0.35)' }}>
        {dealt
          ? <SortBins per={4} groups={5} celebrate={celebrate}/>
          : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6cqw', justifyContent: 'center', alignItems: 'flex-end', width: '19cqw', minHeight: '5cqw', padding: '1cqw', borderRadius: '5px 5px 10px 10px', background: 'linear-gradient(180deg,#3A2E52,#241A38)', border: '2px solid #4C3A6C', boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.5)' }}>
              {Array.from({ length: 12 }).map((_, i) => <span key={i} className={arrive ? 'g1-pop-in' : ''} style={{ display: 'inline-flex', width: '2.7cqw', animationDelay: arrive ? `${i * 0.05}s` : undefined }}><Crystal s="2.7cqw"/></span>)}
            </div>
          )}
      </div>
      <div style={{ marginTop: -1, width: '116%', height: 'clamp(9px,2.4vw,15px)', borderRadius: '4px 4px 7px 7px', background: 'linear-gradient(180deg,#3A2A52,#241838)', boxShadow: '0 6px 13px rgba(0,0,0,0.35), 0 0 0 2px rgba(150,120,224,0.35), inset 0 1px 2px rgba(180,150,224,0.4)' }}/>
    </div>
    {/* KON-DRONI — o'lja ustida suzadi */}
    <div className="d13-hover" style={{ position: 'absolute', left: '85%', top: '40%', width: '10cqw', zIndex: 6 }}><MineBot w="100%"/></div>
    {/* CHANG ZARRALARI (mikro-gravitatsiya) */}
    {[0, 1, 2, 3].map((m) => <span key={'d' + m} className="d13-mist" aria-hidden="true" style={{ position: 'absolute', left: `${22 + m * 20}%`, bottom: '6%', width: 'clamp(3px,0.9vw,5px)', height: 'clamp(3px,0.9vw,5px)', borderRadius: '50%', background: 'rgba(180,150,240,0.5)', zIndex: 5, animationDelay: `${m * 0.8}s` }}/>)}
    {bubbleNode}
    {charNode}
  </div>
);
// CrewFace — ekipaj a'zosi KOSMIK KIYIMда, YUZI TO'LIQ KO'RINADI (metodist 2026-07-16: shar-shlem xunuk edi →
// olib tashlandi; 1-SINF character sifati). To'liq gavda + 1-sinf yuz grammatikasi (grade1 Anvar/Zuhra SVG:
// gradient teri, jingalak soch, qosh, ko'z+jilva, burun, tabassum, yonoq). Anvar = o'g'il, ko'k skafandr, kalta
// soch. Zuhra = qiz, sariq skafandr, jingalak soch + pushti gul qisqich + dumaloq ko'k ko'zoynak (1-sinf ZuhraSVG).
// Yumshoq kosmik yoqa (vizor ochiq) + antenna = kosmik his; shar-shlem YO'Q. hold=kristall, happy=katta tabassum.
const CrewFace = ({ who = 'anvar', hold = false, happy = false }) => {
  const A = who === 'anvar';
  const idp = A ? 'd19anv' : 'd19zuh';
  const suit = A ? '#3E7FD6' : '#F2A23A';
  const suitDk = A ? '#2A5BA8' : '#DE801A';
  const hair = A ? '#2E2620' : '#3E2A1A';
  const hairDk = A ? '#1C1611' : '#241307';
  return (
    <svg viewBox="0 0 120 180" aria-hidden="true" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${idp}sk`} cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#F8CBA0"/><stop offset="100%" stopColor="#E0A06E"/></radialGradient>
        <linearGradient id={`${idp}su`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={suit}/><stop offset="100%" stopColor={suitDk}/></linearGradient>
        <linearGradient id={`${idp}wt`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FBFCFE"/><stop offset="52%" stopColor="#E6EBF1"/><stop offset="100%" stopColor="#CAD2DC"/></linearGradient>
        <linearGradient id={`${idp}hr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={hair}/><stop offset="100%" stopColor={hairDk}/></linearGradient>
      </defs>
      <ellipse cx="60" cy="174" rx="30" ry="4.5" fill="rgba(0,0,0,0.16)"/>
      {/* PLSS ranecha (hayot-ta'minot bloki) — ventilyatsiya panjarasi bilan */}
      <rect x="39" y="60" width="42" height="55" rx="9" fill={`url(#${idp}wt)`} stroke="#9AA4B0" strokeWidth="1.6"/>
      <rect x="44" y="65" width="32" height="9" rx="2.5" fill="#B4BEC8"/>
      <g stroke="#AAB4BE" strokeWidth="1.1">{[82, 90, 98, 106].map((y) => <line key={y} x1="45" y1={y} x2="75" y2={y}/>)}</g>
      {/* OYOQLAR — oq skafandr + tizza bo'g'im halqalari + etik */}
      <rect x="49.5" y="116" width="10.5" height="48" rx="4.5" fill={`url(#${idp}wt)`} stroke="#C4CCD4" strokeWidth="1"/>
      <rect x="60" y="116" width="10.5" height="48" rx="4.5" fill={`url(#${idp}wt)`} stroke="#C4CCD4" strokeWidth="1"/>
      <g stroke="#B4BEC8" strokeWidth="1.3">{[137, 142].map((y) => <React.Fragment key={y}><line x1="50" y1={y} x2="60" y2={y}/><line x1="60.5" y1={y} x2="70.5" y2={y}/></React.Fragment>)}</g>
      <path d="M47 164 h16 v-3 a3 3 0 0 0 -3 -3 h-10 a3 3 0 0 0 -3 3 Z" fill="#EDEFF2" stroke="#B4BEC8" strokeWidth="1.2"/>
      <path d="M57 164 h16 v-3 a3 3 0 0 0 -3 -3 h-10 a3 3 0 0 0 -3 3 Z" fill="#EDEFF2" stroke="#B4BEC8" strokeWidth="1.2"/>
      {/* CHAP qo'l — oq skafandr, tirsak halqasi + qo'lqop cuff */}
      <path d="M45 67 Q37 83 35 98" stroke={`url(#${idp}wt)`} strokeWidth="9" fill="none" strokeLinecap="round"/>
      <line x1="40" y1="80" x2="34" y2="83" stroke="#B4BEC8" strokeWidth="1.3"/>
      <circle cx="35" cy="99" r="6" fill="#EDEFF2" stroke="#B4BEC8" strokeWidth="1.3"/>
      {/* O'NG qo'l — hold ? kristall ko'tarib : silkinadi (oq skafandr + qo'lqop) */}
      {hold ? (
        <g>
          <path d="M75 67 Q87 56 89 42" stroke={`url(#${idp}wt)`} strokeWidth="9" fill="none" strokeLinecap="round"/>
          <line x1="83" y1="55" x2="88" y2="59" stroke="#B4BEC8" strokeWidth="1.3"/>
          <circle cx="90" cy="41" r="6" fill="#EDEFF2" stroke="#B4BEC8" strokeWidth="1.3"/>
          <g transform="translate(90 28) scale(0.98)"><Cr/></g>
        </g>
      ) : (
        <g className="d13-wave" style={{ transformBox: "view-box", transformOrigin: '75px 67px' }}>
          <path d="M75 67 Q87 54 89 40" stroke={`url(#${idp}wt)`} strokeWidth="9" fill="none" strokeLinecap="round"/>
          <circle cx="90" cy="39" r="6" fill="#EDEFF2" stroke="#B4BEC8" strokeWidth="1.3"/>
        </g>
      )}
      {/* HUT — qattiq ustki tana (oq bell shakl) */}
      <path d="M42 62 Q44 54 54 52 L66 52 Q76 54 78 62 L86 116 Q60 124 34 116 Z" fill={`url(#${idp}wt)`} stroke="#C4CCD4" strokeWidth="1"/>
      {/* RANGLI yelka yokasi (personaj rangi) + qo'l chizig'i */}
      <path d="M42 62 Q44 54 54 52 L66 52 Q76 54 78 62 L76 72 Q60 66 44 72 Z" fill={`url(#${idp}su)`}/>
      <path d="M44 72 Q60 66 76 72" stroke={suitDk} strokeWidth="1.2" fill="none"/>
      {/* bel bo'g'im halqasi */}
      <path d="M37 110 Q60 118 83 110 L84 116 Q60 124 36 116 Z" fill="#D3DAE2" stroke="#B4BEC8" strokeWidth="1"/>
      {/* KO'KRAK BOSHQARUV MODULI (DCM) — batafsil: displey, tugmalar, o'lchagichlar, naycha */}
      <rect x="47" y="80" width="26" height="20" rx="3" fill="#2A3340" stroke="#171D26" strokeWidth="1.2"/>
      <rect x="49" y="82" width="14" height="6" rx="1.5" fill="#5FC7E8"/>
      <g fill="#171D26" stroke="#3A4453" strokeWidth="0.6"><circle cx="67" cy="85" r="2.4"/><circle cx="67" cy="94" r="2.4"/></g>
      <circle className="d13-led" cx="51" cy="94" r="1.8" fill="#6EF29B"/><circle cx="56" cy="94" r="1.8" fill="#FFC23C"/><circle cx="61" cy="94" r="1.8" fill="#FF6B5A"/>
      <path d="M47 90 Q40 94 39 104" stroke="#B4BEC8" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      {/* MISSIYA-PATCH (dumaloq emblema, personaj rangi) */}
      <circle cx="74" cy="90" r="5" fill={`url(#${idp}su)`} stroke="#FFFFFF" strokeWidth="1.2"/><circle cx="74" cy="90" r="1.6" fill="#FFFFFF"/>
      {/* KOSMIK YUMSHOQ YOQA (vizor ochiq — shar yo'q), rangli jiyak */}
      <path d="M45 55 Q60 63 75 55 Q76 48 72 45 L48 45 Q44 48 45 55 Z" fill="#DCE2EA" stroke="#AEB6C0" strokeWidth="1.2"/>
      <path d="M47 51 Q60 58 73 51" stroke={suit} strokeWidth="1.8" fill="none"/>
      {/* quloqlar */}
      <ellipse cx="44.5" cy="42" rx="2.6" ry="3.4" fill={`url(#${idp}sk)`}/><ellipse cx="75.5" cy="42" rx="2.6" ry="3.4" fill={`url(#${idp}sk)`}/>
      {/* SOCH orqa (Zuhra jingalak bulut) */}
      {!A && <path d="M40 48 Q31 30 44 24 Q45 14 56 16 Q60 9 66 15 Q79 15 79 28 Q87 35 80 49 L78 40 Q78 27 60 27 Q42 27 42 40 Z" fill={`url(#${idp}hr)`}/>}
      {!A && <><circle cx="42" cy="47" r="7" fill={`url(#${idp}hr)`}/><circle cx="78" cy="47" r="7" fill={`url(#${idp}hr)`}/><circle cx="40" cy="38" r="5.5" fill={`url(#${idp}hr)`}/><circle cx="80" cy="38" r="5.5" fill={`url(#${idp}hr)`}/></>}
      {/* bosh */}
      <circle cx="60" cy="40" r="17" fill={`url(#${idp}sk)`}/>
      {/* peshona sochi */}
      {A ? (
        <>
          <path d="M43 42 Q42 25 60 23 Q78 25 77 42 Q71 32 60 32 Q49 32 43 42 Z" fill={`url(#${idp}hr)`}/>
          <path d="M43 42 Q41 47 44 50 L47 43 Z" fill={hairDk}/><path d="M77 42 Q79 47 76 50 L73 43 Z" fill={hairDk}/>
        </>
      ) : (
        <path d="M45 40 Q44 26 53 24 Q57 18 60 23 Q63 18 67 24 Q76 26 75 40 Q71 32 66 32 Q63 28 60 32 Q57 28 54 32 Q49 32 45 40 Z" fill={`url(#${idp}hr)`}/>
      )}
      {/* Zuhra pushti gul qisqich (chap) */}
      {!A && <g><circle cx="47" cy="26" r="2" fill="#FF9CC0"/><circle cx="47" cy="22" r="1.9" fill="#FFB2D2"/><circle cx="51" cy="25" r="1.9" fill="#FFB2D2"/><circle cx="49.5" cy="29" r="1.9" fill="#FFB2D2"/><circle cx="44" cy="29" r="1.9" fill="#FFB2D2"/><circle cx="43.5" cy="24" r="1.9" fill="#FFB2D2"/><circle cx="47" cy="25.5" r="1.2" fill="#FFD86B"/></g>}
      {/* qoshlar */}
      <g stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round"><path d="M52 37.6 Q55.5 36.1 58.4 37.6"/><path d="M61.6 37.6 Q64.5 36.1 68 37.6"/></g>
      {/* ko'zlar */}
      <circle cx="55" cy="41" r="2.2" fill="#2E2018"/><circle cx="65" cy="41" r="2.2" fill="#2E2018"/>
      <circle cx="55.8" cy="40.2" r="0.7" fill="#FFFFFF"/><circle cx="65.8" cy="40.2" r="0.7" fill="#FFFFFF"/>
      {/* Zuhra dumaloq ko'k ko'zoynak (1-sinf) */}
      {!A && <g fill="none" stroke="#2B7CD3" strokeWidth="1.7" strokeLinecap="round"><circle cx="55" cy="41" r="5.2"/><circle cx="65" cy="41" r="5.2"/><path d="M60 41 Q60.5 39.9 61 41"/><path d="M49.8 39.8 L46 38.2"/><path d="M70.2 39.8 L74 38.2"/></g>}
      {/* burun */}
      <path d="M60 42.6 Q60.7 44.6 59.2 45" stroke="#C98A6A" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      {/* tabassum */}
      {happy
        ? <path d="M54.5 47 Q60 52.5 65.5 47 Q60 49.8 54.5 47 Z" fill="#C0392B"/>
        : <path d="M55.5 47.4 Q60 50.2 64.5 47.4" stroke="#C0392B" strokeWidth="1.8" fill="none" strokeLinecap="round"/>}
      {/* yonoq qizarishi */}
      <ellipse cx="51" cy="45.6" rx="2.9" ry="1.9" fill="rgba(255,120,120,0.34)"/><ellipse cx="69" cy="45.6" rx="2.9" ry="1.9" fill="rgba(255,120,120,0.34)"/>
      {/* antenna (yelkadan) */}
      <line x1="77" y1="57" x2="83" y2="48" stroke="#AEB6C0" strokeWidth="1.6" strokeLinecap="round"/><circle className="d13-led" cx="83.5" cy="47" r="2" fill="#FF6B5A"/>
    </svg>
  );
};
// SaturnCrew — sahna personajlari: Bit (kapitan, chapda) + Anvar (kristall ko'tarib) + Zuhra, ism yorliqlari bilan.
const CREW_TAG = { position: 'absolute', top: '-13%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 'clamp(8px,1.5vw,11px)', fontWeight: 800, color: '#EAF0FF', background: 'rgba(28,18,46,0.82)', padding: '2px 8px', borderRadius: 999, letterSpacing: '.03em', boxShadow: '0 1px 4px rgba(0,0,0,0.5)' };
const SaturnCrew = ({ present = false, happy = false }) => (
  <>
    {/* Bit — kapitan (chapda); FOIZ-balandlik (shipped-proven; cqh bu sahnada 0 ga tushadi) */}
    <div className="d2-scene-bit" style={{ right: 'auto', left: '12%', bottom: '2%', height: '48%', zIndex: 7, transform: 'translateX(-50%)' }}>
      <span className="g1-cast-fig"><BitSVG state={happy ? 'happy' : 'present'}/></span>
    </div>
    {/* Anvar — ko'k skafandr, kristall ko'tarib keltirdi (KENGLIK-asosli cqw — ishonchli render; kattalashtirildi) */}
    <div style={{ position: 'absolute', left: '30%', bottom: '3%', width: '19cqw', zIndex: 7, transform: 'translateX(-50%)' }}>
      <span style={CREW_TAG}>Anvar</span>
      <span className="g1-cast-fig" style={{ display: 'block', height: 'auto', width: '100%' }}><CrewFace who="anvar" hold={present} happy={happy}/></span>
    </div>
    {/* Zuhra — sariq skafandr (qiz: jingalak soch + gul + ko'k ko'zoynak; kattalashtirildi) */}
    <div style={{ position: 'absolute', left: '49%', bottom: '3%', width: '19cqw', zIndex: 7, transform: 'translateX(-50%)' }}>
      <span style={CREW_TAG}>Zuhra</span>
      <span className="g1-cast-fig" style={{ display: 'block', height: 'auto', width: '100%', animationDelay: '.6s' }}><CrewFace who="zuhra" hold={present} happy={happy}/></span>
    </div>
  </>
);
// s0 — SATURN KONIGA KELISH: Anvar+Jasur kristall keltirib Bitdan so'raydi; markazda uyum + jami "?" (12÷4=3).
const SaturnScene = ({ answer = null }) => {
  const shown = answer != null;
  return (
    <SaturnMine arrive
      bubbleNode={(
        <div style={{ position: 'absolute', left: '63%', top: '26%', transform: 'translateX(-50%)', zIndex: 7 }}>
          <div className={shown ? 'g1-pop-in' : ''} style={{ minWidth: 'clamp(40px,8vw,54px)', height: 'clamp(36px,7vw,48px)', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(19px,4.2vw,28px)', background: shown ? T.successSoft : '#FFFFFF', color: shown ? T.success : T.ink3, border: `2.5px ${shown ? 'solid' : 'dashed'} ${shown ? T.success : '#A7A6A2'}`, boxShadow: '0 3px 10px rgba(0,0,0,0.35)', animation: shown ? 'none' : 'g1pulse 1.5s ease-in-out infinite' }}>{shown ? 3 : '?'}</div>
        </div>
      )}
      charNode={<SaturnCrew present/>}/>
  );
};
// s15 — SATURN KONI (xulosa): kristallar teng ulashildi + yashil ✓ tablo (har biriga 3).
const SaturnField = ({ label }) => {
  const t = useT();
  return (
    <SaturnMine celebrate dealt
      bubbleNode={(
        <div style={{ position: 'absolute', left: '63%', top: '22%', transform: 'translateX(-50%)', zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 'clamp(9px,1.6vw,12px)', fontWeight: 800, letterSpacing: '.05em', color: '#EAF0FF', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{t(label)}</span>
          <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 'clamp(52px,11vw,72px)', height: 'clamp(38px,7.4vw,50px)', padding: '0 clamp(10px,2vw,15px)', justifyContent: 'center', borderRadius: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(22px,4.6vw,30px)', background: T.successSoft, color: T.success, border: `2.5px solid ${T.success}`, boxShadow: '0 4px 14px -4px rgba(31,122,77,0.5)' }}>
            4<span style={{ fontSize: 'clamp(17px,3.4vw,23px)' }}>✓</span>
          </div>
        </div>
      )}
      charNode={<SaturnCrew happy/>}/>
  );
};

// ============================================================
// URAN SAHNALARI — Б5 biom (SYUJET §Б5: Uran, yonboshlab aylanuvchi, «maydon/stansiya qurish»).
// Uran — moviy-yashil gaz sayyorasi, halqalari deyarli VERTIKAL (real: Uran yonboshlab aylanadi).
// Sahna: koinot + Uran osmonda + qurilish-panjara maydoni (geoboard/stansiya poydevori) + ekipaj.
// ============================================================
const UranPlanet = ({ w = '100%' }) => (
  <svg viewBox="0 0 140 150" style={{ width: w, height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs>
      <radialGradient id="d26ur" cx="38%" cy="34%" r="86%"><stop offset="0%" stopColor="#CFF3F2"/><stop offset="52%" stopColor="#8FD8DE"/><stop offset="100%" stopColor="#3E8FA6"/></radialGradient>
      <radialGradient id="d26urT" cx="34%" cy="30%" r="80%"><stop offset="50%" stopColor="rgba(0,0,0,0)"/><stop offset="100%" stopColor="rgba(10,40,55,0.6)"/></radialGradient>
      <radialGradient id="d26urH" cx="50%" cy="50%" r="50%"><stop offset="60%" stopColor="rgba(150,225,230,0)"/><stop offset="83%" stopColor="rgba(150,225,230,0.28)"/><stop offset="100%" stopColor="rgba(150,225,230,0)"/></radialGradient>
      <linearGradient id="d26urR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(170,220,225,0)"/><stop offset="0.14" stopColor="rgba(190,230,235,0.75)"/><stop offset="0.5" stopColor="rgba(220,245,248,0.4)"/><stop offset="0.86" stopColor="rgba(190,230,235,0.75)"/><stop offset="1" stopColor="rgba(170,220,225,0)"/></linearGradient>
      <clipPath id="d26urc"><circle cx="70" cy="75" r="34"/></clipPath>
    </defs>
    <ellipse className="d19-sathalo" cx="70" cy="75" rx="44" ry="46" fill="url(#d26urH)"/>
    {/* VERTIKAL halqa (Uran yonboshlab aylanadi) — orqa yoy */}
    <g transform="rotate(8 70 75)">
      <ellipse cx="70" cy="75" rx="20" ry="60" fill="none" stroke="url(#d26urR)" strokeWidth="6"/>
    </g>
    <circle cx="70" cy="75" r="34" fill="url(#d26ur)"/>
    <g clipPath="url(#d26urc)">
      <g className="d19-satband">
        <ellipse cx="70" cy="66" rx="40" ry="4" fill="#B6E8EC" opacity="0.5"/>
        <ellipse cx="70" cy="80" rx="42" ry="5" fill="#6FC2CC" opacity="0.45"/>
        <ellipse cx="70" cy="92" rx="38" ry="3.5" fill="#A6DDE2" opacity="0.5"/>
      </g>
      <circle cx="70" cy="75" r="34" fill="url(#d26urT)"/>
      <ellipse cx="56" cy="56" rx="13" ry="9" fill="rgba(255,255,255,0.5)" transform="rotate(-22 56 56)"/>
    </g>
    <path d="M40 52 A34 34 0 0 1 100 50" fill="none" stroke="rgba(230,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="70" cy="75" r="34" fill="none" stroke="rgba(60,130,150,0.5)" strokeWidth="1"/>
    {/* OLD halqa yoyi (pastki, vertikal) */}
    <g transform="rotate(8 70 75)" clipPath="url(#d26urc)"><ellipse cx="70" cy="75" rx="20" ry="60" fill="none" stroke="url(#d26urR)" strokeWidth="6"/></g>
  </svg>
);
const URAN_STARS = [[8, 14], [22, 30], [36, 12], [52, 26], [66, 14], [80, 28], [90, 18], [14, 44], [72, 40], [40, 48], [28, 20], [60, 34]];
// Muzli qoya — hajmli fasetlar + yorug'lik (yo'ldosh sirti rekviziti).
const IceRock = ({ flip = false }) => (
  <svg viewBox="0 0 64 48" width="100%" style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : 'none' }} aria-hidden="true">
    <defs><linearGradient id="d26ice" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#DCF2F5"/><stop offset="0.5" stopColor="#9FCED6"/><stop offset="1" stopColor="#5A8892"/></linearGradient></defs>
    <ellipse cx="32" cy="45" rx="24" ry="3" fill="rgba(0,0,0,0.28)"/>
    <path d="M6 46 L20 16 L34 30 L44 8 L58 46 Z" fill="url(#d26ice)" stroke="#4A7680" strokeWidth="0.8"/>
    <path d="M20 16 L34 30 L27 46 L14 46 Z" fill="#BEE4EA" opacity="0.7"/>
    <path d="M44 8 L58 46 L46 46 L40 26 Z" fill="#7FB4BE" opacity="0.6"/>
    <path d="M20 16 L23 24 M44 8 L41 20" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
  </svg>
);
// Geodeziya tripodi (teodolit) — chiziq/burchak o'lchaydi, skaner nur (geometriya rekviziti).
const SurveyTripod = ({ w }) => (
  <svg viewBox="0 0 50 64" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <line x1="25" y1="30" x2="10" y2="60" stroke="#8A94A6" strokeWidth="2.4"/><line x1="25" y1="30" x2="40" y2="60" stroke="#8A94A6" strokeWidth="2.4"/><line x1="25" y1="30" x2="25" y2="60" stroke="#6E7884" strokeWidth="2.4"/>
    <rect x="17" y="18" width="16" height="12" rx="3" fill="url(#d26tri)"/>
    <defs><linearGradient id="d26tri" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF3F7"/><stop offset="1" stopColor="#96A0AC"/></linearGradient></defs>
    <circle cx="33" cy="24" r="3.4" fill="#1B2430"/><circle cx="33" cy="24" r="1.4" fill="#7FD8DE"/>
    {/* skaner nur (chiziq chizadi) */}
    <line className="d13-led" x1="36" y1="24" x2="50" y2="22" stroke="#7FD8DE" strokeWidth="1.4"/>
    <circle className="d13-led" cx="25" cy="16" r="1.8" fill="#6EF29B"/>
  </svg>
);
// Yarim qurilgan stansiya moduli (gumbaz + panel + antenna).
const StationModule = ({ w }) => (
  <svg viewBox="0 0 70 54" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d26mod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C6D2DC"/><stop offset="1" stopColor="#6E7C88"/></linearGradient></defs>
    <path d="M8 50 A27 27 0 0 1 62 50 Z" fill="url(#d26mod)" stroke="#4A545E" strokeWidth="1.4"/>
    <path d="M35 24 A26 26 0 0 1 61 49" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4"/>
    <rect x="26" y="36" width="18" height="14" rx="2" fill="#1B2A38"/><rect x="29" y="39" width="5" height="8" fill="#7FD8DE" opacity="0.8"/><rect x="36" y="39" width="5" height="8" fill="#5AA6B0" opacity="0.6"/>
    <g stroke="#5A6470" strokeWidth="1">{[18, 35, 52].map((x) => <line key={x} x1={x} y1="50" x2={x - (x - 35) * 0.12} y2="26"/>)}</g>
    <line x1="52" y1="26" x2="58" y2="10" stroke="#8A94A6" strokeWidth="1.6"/><circle className="d13-led" cx="58.5" cy="9" r="2" fill="#6EF29B"/>
  </svg>
);
// Geodeziya-droni — sirt ustida suzadi, skaner nur (parragi aylanadi).
const UranDrone = ({ w }) => (
  <svg viewBox="0 0 46 34" width={w} style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <defs><linearGradient id="d26dr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EAF4F6"/><stop offset="1" stopColor="#8FA6AE"/></linearGradient></defs>
    <line x1="9" y1="9" x2="19" y2="15" stroke="#6A7480" strokeWidth="2"/><line x1="37" y1="9" x2="27" y2="15" stroke="#6A7480" strokeWidth="2"/>
    <ellipse className="d13-rotor" cx="9" cy="8" rx="8.5" ry="1.7" fill="#8AA4AC" opacity="0.7" style={{ transformOrigin: '9px 8px' }}/>
    <ellipse className="d13-rotor" cx="37" cy="8" rx="8.5" ry="1.7" fill="#8AA4AC" opacity="0.7" style={{ transformOrigin: '37px 8px', animationDelay: '.1s' }}/>
    <rect x="15" y="12" width="16" height="10" rx="4.5" fill="url(#d26dr)" stroke="#7E8692" strokeWidth="1"/>
    <path d="M20 22 L17 31 L29 31 L26 22 Z" fill="rgba(127,216,222,0.26)"/>
    <circle className="d13-led" cx="23" cy="21" r="1.9" fill="#7FD8DE"/>
  </svg>
);
// Mayoq — qurilish maydoni chekkasi (chiroq pulslaydi).
const Beacon = ({ delay = 0 }) => (
  <svg viewBox="0 0 14 40" width="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
    <rect x="5.5" y="10" width="3" height="28" rx="1.5" fill="#5A6470"/>
    <ellipse cx="7" cy="39" rx="6" ry="1.6" fill="rgba(0,0,0,0.3)"/>
    <circle className="d13-led" cx="7" cy="7" r="4" fill="#FFB84D" style={{ animationDelay: `${delay}s` }}/>
    <circle cx="7" cy="7" r="6.5" fill="none" stroke="rgba(255,184,77,0.35)" strokeWidth="1"/>
  </svg>
);
// UranStation — Uran yo'ldoshidagi KATTA baza (Mars CargoBase miqyosida, muz-palitra):
// yon modul + gumbaz + shlyuz + quyosh paneli qanoti + antenna tarelkasi + platforma/oyoqlar + illyuminatorlar.
const UranStation = ({ w }) => (
  <svg viewBox="0 0 150 104" style={{ width: w, height: 'auto', display: 'block', filter: 'drop-shadow(0 7px 9px rgba(0,0,0,0.45))' }} aria-hidden="true">
    <defs>
      <linearGradient id="d26stDome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2F8FA"/><stop offset="0.5" stopColor="#C6DCE4"/><stop offset="1" stopColor="#8CA6B2"/></linearGradient>
      <linearGradient id="d26stPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2E7C88"/><stop offset="1" stopColor="#123A46"/></linearGradient>
      <linearGradient id="d26stMod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DDE8ED"/><stop offset="1" stopColor="#8A9BA6"/></linearGradient>
    </defs>
    {/* quyosh paneli qanoti (o'ngda) */}
    <line x1="116" y1="84" x2="116" y2="62" stroke="#7E8B99" strokeWidth="3.4"/>
    <rect x="104" y="40" width="44" height="24" rx="2" fill="url(#d26stPanel)" stroke="#5A6B84" strokeWidth="1.6"/>
    {[115, 126, 137].map((x) => <line key={x} x1={x} y1="40" x2={x} y2="64" stroke="#5FAEBC" strokeWidth="0.9"/>)}
    <line x1="104" y1="52" x2="148" y2="52" stroke="#5FAEBC" strokeWidth="0.9"/>
    {/* antenna tarelkasi (chap tepa) */}
    <line x1="30" y1="58" x2="22" y2="42" stroke="#7E8B99" strokeWidth="2.6"/>
    <ellipse cx="17" cy="35" rx="13" ry="8.5" transform="rotate(-26 17 35)" fill="#E8F2F5" stroke="#7C93A0" strokeWidth="1.6"/>
    <line x1="17" y1="35" x2="24" y2="31" stroke="#7C93A0" strokeWidth="1.6"/>
    <circle className="d13-led" cx="25" cy="30" r="2" fill="#6EF29B"/>
    {/* yon modul (chapda, gumbazga ulanadi) */}
    <rect x="2" y="68" width="28" height="18" rx="6" fill="url(#d26stMod)" stroke="#6E8593" strokeWidth="1.6"/>
    <rect x="4" y="71" width="24" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
    {/* gumbaz */}
    <path d="M20 86 A50 50 0 0 1 120 86 Z" fill="url(#d26stDome)" stroke="#6E8593" strokeWidth="2.2"/>
    {/* gumbaz panel choklari */}
    <path d="M70 38 L70 86 M50 43 L44 86 M90 43 L96 86 M34 58 L24 86 M106 58 L116 86" stroke="#A9BFC9" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <path d="M44 54 A38 38 0 0 1 78 42" stroke="#FFFFFF" strokeWidth="3.2" opacity="0.5" fill="none" strokeLinecap="round"/>
    {/* asos platformasi + oyoqlar */}
    <rect x="14" y="84" width="112" height="10" rx="3.5" fill="#6E8593"/>
    <rect x="22" y="94" width="11" height="8" fill="#5A6E7A"/>
    <rect x="108" y="94" width="11" height="8" fill="#5A6E7A"/>
    {/* shlyuz-eshik (yorug') */}
    <path d="M56 86 L56 56 A14 14 0 0 1 84 56 L84 86 Z" fill="#0E2028" stroke="#7FD8DE" strokeWidth="2.6"/>
    <path d="M60 86 L60 58 A10 10 0 0 1 80 58 L80 86 Z" fill="#12414E" opacity="0.85"/>
    <circle className="d13-led" cx="77" cy="73" r="2.6" fill="#7FD8DE"/>
    {/* illyuminatorlar (yorug') */}
    <circle cx="40" cy="70" r="4.6" fill="#0E2028" stroke="#7FD8DE" strokeWidth="1.6"/>
    <circle cx="40" cy="70" r="2.2" fill="#7FD8DE" opacity="0.85"/>
    <circle cx="100" cy="70" r="4.6" fill="#0E2028" stroke="#7FD8DE" strokeWidth="1.6"/>
    <circle cx="100" cy="70" r="2.2" fill="#7FD8DE" opacity="0.7"/>
    {/* tepa mayoq */}
    <line x1="70" y1="38" x2="70" y2="26" stroke="#7E8B99" strokeWidth="2"/>
    <circle className="d13-led" cx="70" cy="24" r="2.6" fill="#FFB84D"/>
  </svg>
);
// Muzli TOG' TIZMASI — orqa fon: ufq ortidan ko'tariladigan haqiqiy muz-tog'lar
// (uzoq tumanli qatlam + asosiy tizma + qor cho'qqilari + soya yoqlari). Sirt ortida turadi.
const IceRidge = () => (
  <svg viewBox="0 0 400 130" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d26rdgFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#54798A"/><stop offset="1" stopColor="#25404C"/></linearGradient>
      <linearGradient id="d26rdgNear" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stopColor="#CDE9F2"/><stop offset="0.4" stopColor="#84B6C6"/><stop offset="1" stopColor="#3A5E6E"/></linearGradient>
      <linearGradient id="d26rdgSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#D6EDF5"/></linearGradient>
    </defs>
    {/* uzoq qatlam (tumanli, chuqurlik beradi) */}
    <path d="M0 130 L0 84 L44 44 L86 80 L132 36 L188 88 L238 48 L296 92 L348 52 L400 96 L400 130 Z" fill="url(#d26rdgFar)" opacity="0.5"/>
    {/* asosiy tizma */}
    <path d="M0 130 L0 110 L34 88 L78 26 L124 78 L168 18 L222 84 L268 40 L322 88 L370 58 L400 92 L400 130 Z" fill="url(#d26rdgNear)"/>
    {/* soya yoqlari (yorug'lik o'ngdan — Uran tomondan) */}
    <path d="M78 26 L124 78 L106 78 Z" fill="rgba(18,46,60,0.38)"/>
    <path d="M168 18 L222 84 L202 84 Z" fill="rgba(18,46,60,0.34)"/>
    <path d="M268 40 L322 88 L306 88 Z" fill="rgba(18,46,60,0.32)"/>
    {/* qor cho'qqilari */}
    <path d="M78 26 L97 48 L88 51 L78 42 L67 51 L59 48 Z" fill="url(#d26rdgSnow)"/>
    <path d="M168 18 L191 46 L180 50 L168 39 L155 50 L145 46 Z" fill="url(#d26rdgSnow)"/>
    <path d="M268 40 L286 62 L278 65 L268 57 L257 65 L249 62 Z" fill="url(#d26rdgSnow)"/>
    {/* cho'qqi porlashi */}
    <path d="M168 18 L155 50 L145 46 Z" fill="rgba(255,255,255,0.45)"/>
    <path d="M78 26 L67 51 L59 48 Z" fill="rgba(255,255,255,0.4)"/>
  </svg>
);
// Uran sahnasi konteyner — koinot + Uran + uzoq yo'ldoshlar + shafaq + yo'ldosh sirti + qurilish + ekipaj.
const UranBase = ({ celebrate = false, bubbleNode, charNode }) => (
  <div className="d2-scene" style={{ background: 'linear-gradient(180deg,#08131A 0%,#0F2530 48%,#243A42 100%)' }}>
    {/* KOINOT (yuqori 58%) */}
    <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '58%', background: 'radial-gradient(ellipse at 66% 42%, #123642 0%, #060F14 88%)' }}/>
    {/* shafaq/tumanlik nuri (sekin pulslaydi) */}
    <div className="d19-sathalo" aria-hidden="true" style={{ position: 'absolute', left: '-10%', top: '6%', width: '70%', height: '40%', background: 'radial-gradient(ellipse at 40% 50%, rgba(90,200,210,0.16), rgba(120,90,200,0.08) 55%, transparent 75%)', filter: 'blur(6px)', zIndex: 1 }}/>
    {URAN_STARS.map(([x, y], i) => <span key={i} className="d2-star" aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${(y * 1.1) % 52}%`, width: i % 3 ? 1.6 : 2.6, height: i % 3 ? 1.6 : 2.6, borderRadius: '50%', background: '#DCEFF2', animationDelay: `${i * 0.4}s`, zIndex: 1 }}/>)}
    {/* URAN (osmonda, kattaroq) + halosi */}
    <div className={celebrate ? '' : 'g1-pop-in'} style={{ position: 'absolute', right: '3%', top: '0%', width: 'clamp(96px,26vw,164px)', zIndex: 2 }}><UranPlanet/></div>
    {/* uzoq yo'ldoshlar (suzadi) */}
    <span className="d13-moon1" aria-hidden="true" style={{ position: 'absolute', top: '16%', width: 'clamp(7px,1.8vw,11px)', height: 'clamp(7px,1.8vw,11px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #E4EEF0, #7A8E96 78%, #3A4650)', boxShadow: '0 0 6px rgba(210,230,235,0.5)', zIndex: 1 }}/>
    <span className="d13-moon2" aria-hidden="true" style={{ position: 'absolute', top: '30%', width: 'clamp(5px,1.3vw,8px)', height: 'clamp(5px,1.3vw,8px)', borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #CFE4E8, #6A828A 80%, #3A4650)', boxShadow: '0 0 5px rgba(190,220,225,0.5)', zIndex: 1 }}/>
    <div style={{ position: 'absolute', left: '4%', top: '5%', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(8px,1.5vw,11px)', letterSpacing: '.08em', color: '#7FD8DE', textShadow: '0 0 6px rgba(127,216,222,0.6)', zIndex: 3 }}>◍ URAN · YO'LDOSH</div>
    {/* MUZLI TOG' TIZMASI — orqa fon (ufq ortidan ko'tariladi; sirt uni pastdan yopadi) */}
    <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: '40%', height: '30%', zIndex: 1 }}><IceRidge/></div>
    {/* tog' etagidagi tuman (chuqurlik) */}
    <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: '42%', height: '7%', background: 'linear-gradient(180deg, transparent, rgba(150,200,215,0.2))', filter: 'blur(4px)', zIndex: 2 }}/>
    {/* URAN YO'LDOSHI SIRTI (pastki 44%) */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '44%', background: 'linear-gradient(180deg,#3E4E58 0%,#2A373F 46%,#1A242B 100%)', boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.4)', zIndex: 3 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 'clamp(4px,1vw,7px)', background: 'linear-gradient(180deg,#9FC6D0,#4A6470)', boxShadow: '0 0 10px rgba(159,198,208,0.6)' }}/>
      {[[16, 60, 30], [84, 72, 34], [52, 86, 22], [34, 90, 18]].map(([x, y, r], i) => <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${r}px`, height: `${r * 0.45}px`, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0.3), transparent 70%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.14)' }}/>)}
      {/* qurilish-panjara (stansiya poydevori) */}
      <div style={{ position: 'absolute', inset: '22% 24% 20% 20%', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gridTemplateRows: 'repeat(3,1fr)', placeItems: 'center', opacity: 0.85, zIndex: 1 }}>
        {Array.from({ length: 18 }).map((_, i) => <span key={i} style={{ width: 'clamp(3px,0.9vw,5px)', height: 'clamp(3px,0.9vw,5px)', borderRadius: '50%', background: '#7FD8DE', boxShadow: '0 0 4px rgba(127,216,222,0.7)' }}/>)}
      </div>
    </div>
    {/* FOREGROUND ELEMENTLAR */}
    {/* muzli qoyalar (ikki chekka) */}
    <div style={{ position: 'absolute', left: '1%', bottom: '2%', width: 'clamp(30px,8vw,50px)', zIndex: 4 }}><IceRock/></div>
    <div style={{ position: 'absolute', right: '34%', bottom: '1%', width: 'clamp(20px,5.5vw,34px)', zIndex: 4 }}><IceRock flip/></div>
    {/* stansiya moduli (o'ng) */}
    <div style={{ position: 'absolute', right: '1%', bottom: '2%', width: 'clamp(120px,31vw,190px)', zIndex: 4 }}><UranStation w="100%"/></div>
    {/* geodeziya tripodi (chap-markaz — chiziq o'lchaydi) */}
    <div style={{ position: 'absolute', left: '18%', bottom: '3%', width: 'clamp(34px,9vw,52px)', zIndex: 5 }}><SurveyTripod w="100%"/></div>
    {/* mayoqlar */}
    <div style={{ position: 'absolute', left: '38%', bottom: '20%', width: 'clamp(10px,2.4vw,15px)', zIndex: 4 }}><Beacon/></div>
    <div style={{ position: 'absolute', left: '58%', bottom: '17%', width: 'clamp(9px,2.2vw,13px)', zIndex: 4 }}><Beacon delay={0.6}/></div>
    {/* geodeziya droni (suzadi) */}
    <div className="d13-hover" style={{ position: 'absolute', left: '70%', top: '42%', width: 'clamp(40px,10vw,60px)', zIndex: 6 }}><UranDrone w="100%"/></div>
    {/* muz zarralari (mikro-gravitatsiya, ko'tariladi) */}
    {[0, 1, 2, 3, 4].map((m) => <span key={'p' + m} className="d13-mist" aria-hidden="true" style={{ position: 'absolute', left: `${16 + m * 17}%`, bottom: '7%', width: 'clamp(3px,0.9vw,5px)', height: 'clamp(3px,0.9vw,5px)', borderRadius: '50%', background: 'rgba(180,230,240,0.6)', zIndex: 5, animationDelay: `${m * 0.7}s` }}/>)}
    {bubbleNode}
    {charNode}
  </div>
);
// s0 — URAN MAYDONIGA KELISH
const UranScene = ({ shown = false }) => (
  <UranBase
    bubbleNode={(
      <div style={{ position: 'absolute', left: '62%', top: '28%', transform: 'translateX(-50%)', zIndex: 7 }}>
        <div className={shown ? 'g1-pop-in' : ''} style={{ minWidth: 'clamp(38px,8vw,52px)', height: 'clamp(34px,7vw,46px)', padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(18px,4vw,26px)', background: shown ? T.successSoft : '#FFFFFF', color: shown ? T.success : T.ink3, border: `2.5px ${shown ? 'solid' : 'dashed'} ${shown ? T.success : '#A7A6A2'}`, boxShadow: '0 3px 10px rgba(0,0,0,0.35)', animation: shown ? 'none' : 'g1pulse 1.5s ease-in-out infinite' }}>{shown ? '✓' : '?'}</div>
      </div>
    )}
    charNode={<SaturnCrew present/>}/>
);
// s15 — URAN MAYDONI (xulosa)
const UranField = ({ label }) => {
  const t = useT();
  return (
    <UranBase celebrate
      bubbleNode={(
        <div style={{ position: 'absolute', left: '62%', top: '24%', transform: 'translateX(-50%)', zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 'clamp(9px,1.6vw,12px)', fontWeight: 800, letterSpacing: '.05em', color: '#EAF6F8', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{t(label)}</span>
          <div className="g1-pop-in" style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 'clamp(44px,10vw,60px)', height: 'clamp(36px,7vw,48px)', padding: '0 clamp(10px,2vw,15px)', justifyContent: 'center', borderRadius: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 'clamp(20px,4.4vw,28px)', background: T.successSoft, color: T.success, border: `2.5px solid ${T.success}`, boxShadow: '0 4px 14px -4px rgba(31,122,77,0.5)' }}>✓</div>
        </div>
      )}
      charNode={<SaturnCrew happy/>}/>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function RazryadLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'f' });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [heroMood, setHeroMood] = useState('pointing');   // personaj holati (butun urok bo'ylab bitta overlay)
  const heroCtx = React.useMemo(() => ({ setMood: setHeroMood }), []);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); setHeroMood('pointing'); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
  const scored = SCREEN_META.filter(s => s.scored);
  const finalScreens = scored.filter(s => s.scope === 'final');
  const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && SCREEN_META[i]?.scored && a.correct).length;
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, ScreenTable, A5, A6, A7, A8, A9, A10, A11, ACase, A14, Screen15];
  const CurrentScreen = screens[current];

  // Ekran almashganda personajni "ko'rsatadi" (pointing) holatiga qaytaramiz;
  // javobdan keyin Reaction uni happy/encourage'ga o'zgartiradi.
  const next = () => { setHeroMood('pointing'); setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { setHeroMood('pointing'); setCurrent(s => Math.max(s - 1, 0)); };

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  const starTotal = SCREEN_META.filter((s) => s.scored).length;
  const starsEarned = answers.filter((a, i) => a && SCREEN_META[i] && SCREEN_META[i].scored && a.correct).length;

  return (
    <LangContext.Provider value={lang}>
      <ProgressContext.Provider value={{ stars: starsEarned, total: starTotal }}>
      <HeroContext.Provider value={heroCtx}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <GradientDefs/>
        <D2Defs/>
        <D2Motes/>
        <StageHero mood={heroMood}/>
        {/* v8: «UCHISHGA TAYYORLIK» shkalasi — INFRA/Stage'дан TASHQARIDA (lesson-root darajasi) */}
        <ReadinessMeter screen={current} total={TOTAL_SCREENS} lang={lang}/>
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
      </HeroContext.Provider>
      </ProgressContext.Provider>
    </LangContext.Provider>
  );
}

const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
/* position: fixed + inset: 0 — dars oqimdan chiqib, doim aynan KO'RINADIGAN
   viewport'ga mixlanadi. Host (LessonPage/LMS) 100vh bilan balandroq bo'lsa ham
   body-skroll darsga ta'sir qilmaydi, "Davom" tugmasi joyidan siljimaydi.
   URL-panel ochilib-yopilganda balandlikni brauzer o'zi kuzatadi (JS o'lchovsiz). */
.lesson-root {
  font-family: 'Manrope', system-ui, sans-serif;
  color: #0E0E10;
  background: #F6F4EF;
  position: fixed;
  inset: 0;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g1z, 1);
}
/* Mobil yagona masshtab (useMobileZoom): layout doim 390px, zoom real ekranga
   moslaydi — barcha telefonlarda aynan bir xil ko'rinish. Desktop tegilmaydi. */
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
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
/* btn-ready — "Davom" bosish kerak bo'lgan paytdagi holat: to'q rang + puls (g1) */
.btn-white-accent.btn-ready {
  background: #FF4F28;
  color: #FFFFFF;
  box-shadow: 0 10px 26px -5px rgba(255, 79, 40, 0.5), 0 0 0 1px rgba(255, 79, 40, 0.25);
  animation: btnReadyPulse 1.5s ease-in-out infinite;
}
.btn-white-accent.btn-ready:hover:not(:disabled) { background: #E8431F; color: #FFFFFF; }
@keyframes btnReadyPulse {
  0%, 100% { transform: scale(1);     box-shadow: 0 10px 26px -5px rgba(255, 79, 40, 0.45), 0 0 0 0 rgba(255, 79, 40, 0.5); }
  50%      { transform: scale(1.045); box-shadow: 0 14px 30px -6px rgba(255, 79, 40, 0.6),  0 0 0 9px rgba(255, 79, 40, 0); }
}
@media (prefers-reduced-motion: reduce) { .btn-white-accent.btn-ready { animation: none; } }

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
  opacity: 0.32 !important;
  box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.06) !important;
}
.option-picked-wrong {
  background: #FBF3D6 !important;
  color: #C99A2E !important;
  box-shadow: 0 8px 22px -6px rgba(216, 169, 58, 0.32) !important;
}

/* === ТИПОГРАФИКА v15 (× 0.85 upper bounds) === */
.h-title { font-size: clamp(22px, 4vw, 30px); }
.h-sub { font-size: clamp(20px, 3.2vw, 23px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(24px, 5vw, 24px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

/* === STAGE v15 (sticky stage-header) === */
.stage { max-width: 936px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; position: relative; z-index: 1; }
.stage-header {
  flex-shrink: 0;
  background: #F6F4EF;
  padding-top: clamp(11px, 2vw, 11px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
}
.stage-content {
  flex: 1;
  padding-top: clamp(8px, 1.5vw, 11px);
  padding-bottom: clamp(11px, 2.4vw, 15px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
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
/* yulduz-kopilka (yuqorida): to'g'ri javoblar to'planadi */
.g1-stars { display: flex; gap: clamp(2px,0.8vw,5px); align-items: center; }
.g1-star-slot { font-size: clamp(13px,1.9vw,17px); line-height: 1; color: rgba(167,166,162,0.4); }
.g1-star-slot.on { color: #FFC23C; animation: g1starpop 0.45s cubic-bezier(0.34,1.6,0.64,1); }
@keyframes g1starpop { 0% { transform: scale(0.3); } 60% { transform: scale(1.35); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-star-slot.on { animation: none; } }
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
  padding: clamp(20px, 4.2vw, 24px);
  border: none;
  box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14);
  overflow: hidden;
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

/* MATH: ambient — мягкие плавающие круги на разрежённых экранах (декор). */
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

/* === GRADE1 num_1_01 — sanash vizuallari (animatsion to'plam) === */
.g1-listen-hint { margin: 0; color: #019ACB; font-weight: 600; letter-spacing: 0.04em; opacity: 0.9; animation: g1twinkle 1.8s ease-in-out infinite; }
.g1-pips { display: flex; flex-wrap: nowrap; gap: clamp(4px, 1.2vw, 9px); justify-content: center; align-items: center; max-width: 100%; }
.g1-pips-wrap { flex-wrap: wrap; }
.g1-obj { width: clamp(36px, 8.5vw, 58px); aspect-ratio: 1 / 1; height: auto; min-width: 0; display: inline-flex; flex-shrink: 1; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bob { animation: g1bob 3s ease-in-out infinite; }
.g1-drop { animation: g1drop 0.5s ease-out both; }
.g1-twinkle { animation: g1twinkle 2s ease-in-out infinite; }
@keyframes g1bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-7px) rotate(3deg); } }
/* Ambient — masala olami sahnasiga yengil jon. reduced-motion'da o'chadi. */
.g1-amb-cloud { animation: g1drift 9s ease-in-out infinite alternate; }
.g1-amb-cloud2 { animation: g1driftB 12s ease-in-out infinite alternate; }
.g1-amb-sun { transform-box: fill-box; transform-origin: center; animation: g1sunPulse 4.5s ease-in-out infinite; }
.g1-amb-rays { transform-box: fill-box; transform-origin: center; animation: g1sunRays 44s linear infinite; }
.g1-amb-sway { transform-box: fill-box; transform-origin: bottom center; animation: g1sway 4.8s ease-in-out infinite; }
@keyframes g1drift { 0% { transform: translateX(0); } 100% { transform: translateX(24px); } }
@keyframes g1driftB { 0% { transform: translateX(0); } 100% { transform: translateX(-20px); } }
@keyframes g1sunPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.93; } }
@keyframes g1sunRays { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes g1sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@media (prefers-reduced-motion: reduce) { .g1-amb-cloud, .g1-amb-cloud2, .g1-amb-sun, .g1-amb-rays, .g1-amb-sway { animation: none; } }
/* To'g'ri javob nishonlashi — uchqun + yengil sakrash. reduced-motion'da o'chadi. */
.g1-cele-wrap { position: relative; display: inline-flex; animation: g1celePop 0.7s cubic-bezier(0.3, 1.3, 0.5, 1) both; }
@keyframes g1celePop { 0% { transform: scale(1); } 30% { transform: scale(1.14); } 60% { transform: scale(0.97); } 100% { transform: scale(1); } }
.g1-csp { position: absolute; top: 40%; left: 50%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFF4CC, #FFB23C); box-shadow: 0 0 5px rgba(255,190,70,0.85); opacity: 0; pointer-events: none; }
.g1-cele-wrap .g1-csp { animation: g1sparkPop 0.8s ease-out both; }
@keyframes g1sparkPop { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); } 25% { opacity: 1; } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, -24px))) scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-cele-wrap, .g1-cele-wrap .g1-csp { animation: none; } }
@keyframes g1twinkle { 0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); } 50% { opacity: 0.5; transform: scale(0.82) rotate(8deg); } }
/* --- Dars13 kema-issiqxona jonli/3D animatsiyalari --- */
@keyframes d13jhalo { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
.d13-jhalo { transform-box: fill-box; transform-origin: center; animation: d13jhalo 5s ease-in-out infinite; }
@keyframes d13jband { 0% { transform: translateX(0); } 100% { transform: translateX(-52px); } }
.d13-jband { animation: d13jband 26s linear infinite; }
@keyframes d13sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
.d13-sway { animation: d13sway 3.4s ease-in-out infinite; }
@keyframes d13mist { 0% { transform: translateY(0) scale(1); opacity: 0; } 20% { opacity: .7; } 100% { transform: translateY(-26px) scale(1.7); opacity: 0; } }
.d13-mist { animation: d13mist 3.2s ease-out infinite; }
@keyframes d13moon1 { 0% { left: -6%; } 100% { left: 104%; } }
.d13-moon1 { animation: d13moon1 34s linear infinite; }
@keyframes d13moon2 { 0% { left: 104%; } 100% { left: -6%; } }
.d13-moon2 { animation: d13moon2 46s linear infinite; }
@keyframes d13vine { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
.d13-vine { animation: d13vine 5s ease-in-out infinite; }
.d13-vine2 { animation-duration: 6.2s; animation-delay: .6s; }
@keyframes d13glow { 0%, 100% { box-shadow: 0 8px 22px 4px rgba(255,190,90,0.45); } 50% { box-shadow: 0 11px 30px 7px rgba(255,200,110,0.7); } }
.d13-glow { animation: d13glow 3s ease-in-out infinite; }
@keyframes d13beam { 0%, 100% { opacity: .55; } 50% { opacity: .9; } }
.d13-beam { animation: d13beam 3s ease-in-out infinite; }
@keyframes d13sheen { 0% { left: -30%; } 60%, 100% { left: 110%; } }
.d13-sheen { animation: d13sheen 9s ease-in-out infinite; }
@keyframes d13drop { 0% { transform: translate(-50%, 0); opacity: 0; } 15% { opacity: .85; } 85% { opacity: .85; } 100% { transform: translate(-50%, 40px); opacity: 0; } }
.d13-drop { animation: d13drop 2.8s ease-in infinite; }
@keyframes d13hover { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-6px) rotate(1deg); } }
.d13-hover { animation: d13hover 3.4s ease-in-out infinite; }
@keyframes d13rotor { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.18); } }
.d13-rotor { animation: d13rotor 0.14s linear infinite; }
@keyframes d13bubble { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: .8; } 100% { transform: translateY(-20px); opacity: 0; } }
.d13-bubble { animation: d13bubble 2.4s ease-in infinite; }
@keyframes d13led { 0%, 60% { opacity: 1; } 80%, 100% { opacity: 0.25; } }
.d13-led { animation: d13led 2.2s ease-in-out infinite; }
@keyframes d13wingl { 0%, 100% { transform: rotateY(0deg); } 50% { transform: rotateY(62deg); } }
@keyframes d13wingr { 0%, 100% { transform: rotateY(0deg); } 50% { transform: rotateY(-62deg); } }
.d13-wingl { animation: d13wingl 0.22s ease-in-out infinite; }
.d13-wingr { animation: d13wingr 0.22s ease-in-out infinite; }
@keyframes d13fly { 0% { transform: translate(0, 0); } 25% { transform: translate(60px, -22px); } 50% { transform: translate(130px, 8px); } 75% { transform: translate(70px, 30px); } 100% { transform: translate(0, 0); } }
.d13-fly { animation: d13fly 13s ease-in-out infinite; }
@keyframes d13wave { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(15deg); } }
.d13-wave { transform-box: fill-box; animation: d13wave 1.2s ease-in-out infinite; }
/* Dars19 Saturn: atmosfera halosi pulsi + gaz-chiziq siljishi + kristall porlash */
@keyframes d19sathalo { 0%, 100% { opacity: .6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.035); } }
.d19-sathalo { animation: d19sathalo 4.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes d19satband { 0% { transform: translateX(0); } 100% { transform: translateX(-40px); } }
.d19-satband { animation: d19satband 16s linear infinite; }
@keyframes d19cryglow { 0%, 100% { opacity: .78; filter: drop-shadow(0 0 2px rgba(95,199,232,0.5)); } 50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(95,199,232,0.95)); } }
.d19-cryglow { animation: d19cryglow 2.8s ease-in-out infinite; }
/* Dars20 MatchStage — elastik sim: chapdan o'ngga «tortiladi» (draw-in) + yengil prujin */
@keyframes d20draw { 0% { stroke-dashoffset: 1; } 70% { stroke-dashoffset: -0.04; } 100% { stroke-dashoffset: 0; } }
.d20-wire { stroke-dasharray: 1; animation: d20draw .5s cubic-bezier(.34,1.56,.64,1) forwards; }
/* Dars21 son o'qi — nuqta har sakraganda yuqoriga sapchiydi (sekin, ko'z charchatmaydi) */
@keyframes d21hop { 0% { transform: translateY(0); } 45% { transform: translateY(-15px); } 100% { transform: translateY(0); } }
.d21-hop { transform-box: fill-box; transform-origin: center; animation: d21hop .6s cubic-bezier(.4,0,.4,1); }
@media (prefers-reduced-motion: reduce) { .d20-wire { animation: none; stroke-dasharray: none; } .d21-hop { animation: none; } }
@media (prefers-reduced-motion: reduce) {
  .d13-jhalo, .d13-jband, .d13-sway, .d13-mist, .d13-moon1, .d13-moon2, .d13-vine, .d13-vine2, .d13-glow, .d13-beam, .d13-sheen, .d13-drop, .d13-hover, .d13-rotor, .d13-bubble, .d13-led, .d13-wingl, .d13-wingr, .d13-fly, .d13-wave, .d19-sathalo, .d19-satband, .d19-cryglow { animation: none; }
}
@keyframes g1pop { 0% { opacity: 0; transform: scale(0.4); } 60% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
@keyframes g1drop { 0% { opacity: 0; transform: translateY(-30px); } 72% { transform: translateY(3px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes g1pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
@keyframes g1gap { 0%, 100% { transform: scale(1); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.30); } 50% { transform: scale(1.06); box-shadow: 0 10px 22px -6px rgba(255,79,40,0.5); } }

/* CountDemo — jonli sanash */
.g1-demo { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.4vw, 16px); }
.g1-demo-row { display: flex; gap: clamp(12px, 3vw, 20px); justify-content: center; align-items: flex-end; min-height: clamp(60px, 13vw, 86px); }
.g1-demo-cell { position: relative; width: clamp(52px, 11vw, 78px); height: clamp(52px, 11vw, 78px); opacity: 0; }
.g1-demo-cell.on { opacity: 1; animation: g1pop 0.45s ease-out; }
.g1-demo-cell.pulse { animation: g1pop 0.45s ease-out, g1pulse 1.7s ease-in-out 0.5s infinite; }
.g1-demo-cell svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-demo-tag { position: absolute; top: -8px; right: -6px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-demo-num { font-weight: 800; font-size: clamp(40px, 9vw, 62px); color: #FF4F28; line-height: 1; }
.g1-demo-num.big { font-size: clamp(52px, 13vw, 86px); }

/* TenFrame — bo'sh kataklar */
.g1-tenframe { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-cell { width: clamp(64px, 14vw, 94px); height: clamp(64px, 14vw, 94px); border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.25s, box-shadow 0.25s; }
.g1-cell-target { background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); }
.g1-cell-filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; }
.g1-cell-empty { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; }
.g1-cell-obj { width: 74%; height: 74%; display: inline-flex; animation: g1drop 0.4s ease-out; }
.g1-cell-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.18)); }
/* interaktiv ten-frame (s5): bosiladigan kataklar */
.g1-cell-btn { position: relative; width: clamp(64px, 14vw, 94px); height: clamp(64px, 14vw, 94px); border: none; border-radius: 14px; cursor: pointer; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.45); display: flex; align-items: center; justify-content: center; transition: background 0.2s, box-shadow 0.2s, transform 0.15s; }
.g1-cell-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 2px #019ACB; }
.g1-cell-btn.filled { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }
.g1-cell-num { position: absolute; top: 3px; right: 6px; font-weight: 800; font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; }

/* CountTrack / MissingTrack — son qatori */
.g1-track-label { font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #FF4F28; letter-spacing: 0.02em; min-height: 1.3em; transition: color 0.25s; }
.g1-track-label.back { color: #019ACB; }
.g1-track { display: flex; gap: clamp(7px, 1.8vw, 12px); justify-content: center; }
.g1-track-tile { width: clamp(52px, 11.5vw, 72px); height: clamp(56px, 13vw, 80px); background: #FFFFFF; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, color 0.25s, box-shadow 0.25s; }
.g1-track-tile span { font-weight: 800; font-size: clamp(28px, 6.5vw, 42px); color: #0E0E10; }
.g1-track-tile.active { background: #FF4F28; transform: translateY(-7px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-track-tile.active span { color: #FFFFFF; }
.g1-track-tile.gap { background: #FBF3D6; box-shadow: inset 0 0 0 2px #D8A93A; animation: g1gap 1.4s ease-in-out infinite; }
.g1-track-tile.gap span { color: #D8A93A; }
.g1-track-tile.g1-track-filled { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-track-tile.g1-track-filled span { color: #FFFFFF; }
/* count javob badge'i (sanagandan keyin son paydo bo'ladi) */
.g1-countfig { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-countfig-ans { font-weight: 800; font-size: clamp(30px, 7vw, 46px); color: #1F7A4D; }
/* BigNumberCue (keyingi/oldingi savol uchun tayanch son) */
.g1-cue { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 3vw, 22px); }
.g1-cue-num { width: clamp(82px, 20vw, 124px); height: clamp(82px, 20vw, 124px); background: #FF4F28; color: #FFFFFF; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(44px, 10vw, 68px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.5); }
.g1-cue-arrow { font-size: clamp(44px, 11vw, 70px); font-weight: 800; color: #A7A6A2; }
.g1-cue-num.g1-cue-ans { background: #1F7A4D; box-shadow: 0 12px 26px -6px rgba(31,122,77,0.5); }
.g1-pop-in { animation: g1pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }

/* CountingHand — sanaydigan qo'l */
.g1-hand { position: relative; width: clamp(143px, 32vw, 218px); height: clamp(135px, 30vw, 204px); display: flex; align-items: center; justify-content: center; }
.g1-hand-big { width: clamp(200px, 50vw, 300px); height: clamp(190px, 48vw, 280px); }
.g1-hand svg { width: 100%; height: 100%; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.2)); }
.g1-hand-num { position: absolute; top: -2px; right: 2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(15px, 2.4vw, 20px); min-width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -4px rgba(31,122,77,0.5); }

/* s5 dasturxon: tepadan ko'rilgan stol (naqshli) + non/choynak + likobchalar */
.g1-dasturxon { position: relative; background: #FBF3DE; border-radius: 18px; border: clamp(6px,1.6vw,9px) solid #019ACB; padding: clamp(12px,2.6vw,18px) clamp(12px,2.6vw,18px) clamp(14px,3vw,20px); display: flex; flex-direction: column; align-items: center; gap: clamp(10px,2.2vw,15px); box-shadow: 0 8px 22px -6px rgba(58,53,48,0.18); }
.g1-dasturxon::before { content: ''; position: absolute; inset: clamp(4px,1vw,6px); border: 2px dashed rgba(1,154,203,0.45); border-radius: 12px; pointer-events: none; }
.g1-dx-decor { display: flex; align-items: flex-end; justify-content: center; gap: clamp(8px,2vw,16px); position: relative; z-index: 1; }
.g1-dx-non { width: clamp(34px,8vw,48px); height: clamp(34px,8vw,48px); filter: drop-shadow(0 3px 5px rgba(58,53,48,0.18)); }
.g1-dx-teapot { width: clamp(44px,10vw,60px); height: clamp(34px,8vw,46px); filter: drop-shadow(0 3px 5px rgba(58,53,48,0.18)); }
/* SYUJET (hikoya) sahnalari — kirish (dasturxon) va ko'prik (mehmon) */
.g1-table-scene { display: flex; justify-content: center; width: 100%; }
.g1-table-svg { width: clamp(280px, 72vw, 430px); height: auto; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.16)); }
/* ovqat: realroq — joyida turadi, faqat sezilmas vertikal "nafas" (aylanishsiz) */
.g1-table-non { animation: g1float 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.g1-table-apples { animation: g1float 4s ease-in-out 0.7s infinite; transform-box: fill-box; transform-origin: center bottom; }
@keyframes g1float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
.g1-steam { transform-box: fill-box; transform-origin: center bottom; animation: g1steam 2.9s ease-in-out infinite; }
.g1-steam2 { animation-delay: 0.95s; }
.g1-steam3 { animation-delay: 1.7s; }
@keyframes g1steam { 0% { opacity: 0; transform: translateY(6px) scale(0.8); } 35% { opacity: 0.85; } 70% { opacity: 0.5; } 100% { opacity: 0; transform: translateY(-24px) scale(1.18); } }
/* dasturxon ustidan suzib o'tuvchi yorug'lik (chap->o'ng) — "tayyor, chiroyli" */
.g1-table-sweep { animation: g1tsweep 3.6s ease-in-out infinite; }
@keyframes g1tsweep { 0% { transform: translateX(-110px) skewX(-20deg); opacity: 0; } 22% { opacity: 0.9; } 78% { opacity: 0.9; } 100% { transform: translateX(300px) skewX(-20deg); opacity: 0; } }
/* tayyorlangan dasturxon ustidagi uchqunlar */
.g1-table-spark { animation: g1tspark 1.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes g1tspark { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-table-non, .g1-table-apples, .g1-steam, .g1-table-sweep, .g1-table-spark { animation: none; } }
.g1-guest-scene svg { width: clamp(275px, 68vw, 420px); height: auto; }
/* yo'riqnoma chipi (1-slayd): tingla -> Davom */
.g1-onboard { display: flex; align-items: center; justify-content: center; gap: clamp(8px,1.6vw,12px); align-self: center; background: #EAF6FB; border: 1px solid rgba(1,154,203,0.3); border-radius: 99px; padding: clamp(8px,1.5vw,11px) clamp(14px,2.6vw,20px); }
.g1-onboard-ic { flex-shrink: 0; animation: g1twinkle 1.8s ease-in-out infinite; }
.g1-onboard-txt { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.7vw,15px); color: #017BA3; }
.g1-onboard-arrow { color: #A7A6A2; font-weight: 800; font-size: clamp(15px,2vw,18px); }
.g1-onboard-pill { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,1.5vw,13px); color: #FFFFFF; background: #FF4F28; border-radius: 99px; padding: clamp(5px,1vw,7px) clamp(12px,2.2vw,16px); }
/* mehmon: o'ngdan kirib keladi (1x), keyin yengil tebranadi */
.g1-guest { animation: g1guestEnter 0.85s cubic-bezier(0.34,1.5,0.6,1) both, g1guestBob 2.6s ease-in-out 0.9s infinite; }
.g1-guest-hand { animation: g1wave 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom left; }
.g1-knock { transform-box: fill-box; transform-origin: left center; animation: g1knock 1.5s ease-in-out infinite; }
.g1-doorglow { animation: g1glow 2.2s ease-in-out infinite; }
.g1-giftspark { animation: g1giftspark 1.4s ease-in-out infinite; }
@keyframes g1guestEnter { 0% { opacity: 0; transform: translateX(48px); } 100% { opacity: 1; transform: translateX(0); } }
@keyframes g1guestBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes g1wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-14deg); } }
@keyframes g1knock { 0% { opacity: 0; transform: translateX(-4px) scale(0.85); } 45% { opacity: 1; } 100% { opacity: 0; transform: translateX(6px) scale(1.14); } }
@keyframes g1glow { 0%,100% { opacity: 0.22; } 50% { opacity: 0.6; } }
@keyframes g1giftspark { 0%,100% { opacity: 0.1; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-guest, .g1-guest-hand, .g1-knock, .g1-doorglow, .g1-giftspark { animation: none; } }
.g1-tablescene { display: flex; flex-direction: column; align-items: center; width: 100%; }
.g1-plates { display: flex; gap: clamp(6px,1.8vw,12px); justify-content: center; position: relative; z-index: 1; flex-wrap: wrap; }
.g1-plate { position: relative; width: clamp(62px,14vw,90px); height: clamp(62px,14vw,90px); border-radius: 50%; border: clamp(3px,0.8vw,4px) solid #5FBFE0; cursor: pointer; background: radial-gradient(circle at 50% 36%, #FFFFFF 0%, #FBFAF5 54%, #E6DDCB 100%); box-shadow: 0 7px 16px -6px rgba(58,53,48,0.4), inset 0 7px 12px -5px rgba(58,53,48,0.22); display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.g1-plate::before { content: ''; position: absolute; inset: clamp(6px,1.5vw,9px); border-radius: 50%; border: 1.5px dashed rgba(1,154,203,0.5); pointer-events: none; }
.g1-plate:hover:not(:disabled) { transform: translateY(-2px); }
.g1-plate.filled { cursor: default; }
.g1-plate-obj { width: 62%; height: 62%; display: inline-flex; }
.g1-plate-obj svg { width: 100%; height: 100%; filter: drop-shadow(0 3px 5px rgba(58,53,48,0.2)); }
.g1-plate-num { position: absolute; bottom: -2px; right: -2px; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px,1.6vw,14px); min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
.g1-tabletop { width: clamp(230px,60vw,380px); height: clamp(20px,4.4vw,30px); background: linear-gradient(#C8893E, #B17B34); border-radius: 7px; box-shadow: 0 8px 16px -6px rgba(58,53,48,0.35); position: relative; z-index: 0; }

/* s4 figura (TOZA): idle animatsiya HTML div'da — kafolatli ishlaydi */
.g1-s4fig { position: relative; display: inline-block; line-height: 0; animation: g1idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
.g1-s4fig-svg { width: clamp(150px,38vw,200px); height: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.18)); }
.g1-s4fig-happy { animation: g1jump 0.7s ease, g1idle 3.2s ease-in-out 0.7s infinite; }

/* DressStars (s4) eski meros — endi ishlatilmaydi (saqlangan, zararsiz) */
.g1-dress { position: relative; display: inline-flex; }
.g1-dress-svg { width: clamp(150px,38vw,200px); height: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.18)); }
.g1-arm-up { opacity: 0; transition: opacity 0.35s; }
.g1-arm-dn { opacity: 1; transition: opacity 0.35s; }
.g1-dress-happy .g1-arm-up { opacity: 1; }
.g1-dress-happy .g1-arm-dn { opacity: 0; }
.g1-dress-happy .g1-dress-svg { animation: g1jump 0.7s ease; transform-origin: center bottom; }
@keyframes g1jump { 0%, 100% { transform: translateY(0); } 35% { transform: translateY(-14px); } 70% { transform: translateY(0); } }
.g1-mouth-happy { opacity: 0; }
.g1-dress-happy .g1-mouth-happy { opacity: 1; }
.g1-dress-happy .g1-mouth { opacity: 0; }
.g1-spark { position: absolute; width: 14px; height: 14px; background: radial-gradient(circle, #FFD86B 0%, rgba(255,216,107,0) 70%); border-radius: 50%; pointer-events: none; }
.g1-spark1 { left: 8%; top: 22%; animation: g1spark 0.9s ease-out 0s infinite; }
.g1-spark2 { right: 6%; top: 30%; animation: g1spark 0.9s ease-out 0.3s infinite; }
.g1-spark3 { left: 16%; top: 52%; animation: g1spark 0.9s ease-out 0.6s infinite; }
@keyframes g1spark { 0% { opacity: 0; transform: scale(0.4); } 40% { opacity: 1; transform: scale(1.15); } 100% { opacity: 0; transform: scale(0.5); } }
.g1-conf { position: absolute; top: -8%; width: 8px; height: 12px; border-radius: 2px; pointer-events: none; }
.g1-conf1 { left: 16%; background: #FF4F28; animation: g1conf 1.1s ease-in 0s infinite; }
.g1-conf2 { left: 34%; background: #019ACB; animation: g1conf 1.3s ease-in 0.2s infinite; }
.g1-conf3 { left: 50%; background: #FFC23C; animation: g1conf 1.0s ease-in 0.45s infinite; }
.g1-conf4 { left: 64%; background: #1F7A4D; animation: g1conf 1.25s ease-in 0.1s infinite; }
.g1-conf5 { left: 80%; background: #FF7AA8; animation: g1conf 1.15s ease-in 0.55s infinite; }
.g1-conf6 { left: 26%; background: #9B5DE5; animation: g1conf 1.2s ease-in 0.75s infinite; }
@keyframes g1conf { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 12% { opacity: 1; } 100% { opacity: 0; transform: translateY(190px) rotate(420deg); } }
/* Reaction — yagona emotsional otklik (maskot + maqtov) */
.g1-react { display: flex; align-items: center; gap: clamp(8px,1.8vw,12px); }
/* === PNG personaj overlay — butun urok bo'ylab bitta doimiy element (personaj.md) ===
   Doimiy joylashuv (sakramaydi), pastki chap burchak, nav ustida; pointer-events yo'q
   (taplar o'tib ketadi, tugma/predmetlarni bloklamaydi). */
.g1-hero { width: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.24)); }
/* SVG personajlar (Ra'no/Anvar/Bit): bazaviy o'lcham + jonlanish */
.g1-char { display: block; height: 100%; width: auto; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.22)); }
.g1-eyes { transform-box: fill-box; transform-origin: center; animation: g1blink 4.4s infinite; }
@keyframes g1blink { 0%, 93%, 100% { transform: scaleY(1); } 96.5% { transform: scaleY(0.12); } }
.g1-bit-ant { transform-box: fill-box; transform-origin: bottom center; animation: g1antbob 2.2s ease-in-out infinite; }
@keyframes g1antbob { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
.g1-bit-wave, .g1-anvar-wave { transform-box: fill-box; transform-origin: bottom left; animation: g1wavebig 1s ease-in-out infinite; }
@keyframes g1wavebig { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(-26deg); } }
@keyframes g1bitfloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
/* idle — Ra'no/Anvar figuralar (cast + s4 ko'ylak) sezilarli nafas/tebranish (#8: kattaroq) */
/* idle — HTML o'rovchida (svg ildizida emas; ishonchli va yaqqol ko'rinadi) */
.g1-cast-fig, .g1-dress { animation: g1idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
@keyframes g1idle { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
.g1-stage-hero { position: absolute; left: clamp(2px,1.6vw,28px); bottom: clamp(72px,11vh,104px); z-index: 6; pointer-events: none; display: flex; align-items: flex-end; gap: clamp(2px,1vw,8px); }
.g1-stage-hero .g1-hero { transform-origin: bottom center; }
.g1-stage-hero .g1-hero-rano { height: clamp(104px,22vh,208px); }
.g1-stage-hero .g1-hero-bit { height: clamp(80px,17vh,156px); }   /* Bit Ra'nodan kichikroq */
/* Mobil (tor ekran): personaj kichikroq va burchakka, kontentni kamroq yopadi */
@media (max-width: 640px) {
  .g1-stage-hero { left: 0; bottom: clamp(62px,9vh,84px); gap: 0; }
  .g1-stage-hero .g1-hero-rano { height: clamp(78px,14vh,116px); }
  .g1-stage-hero .g1-hero-bit { height: clamp(62px,11vh,92px); }
}
.g1-sh-pointing .g1-hero-rano { animation: g1heroIn 0.45s ease; }
.g1-sh-happy .g1-hero-rano { animation: g1mhop 0.6s ease; }
.g1-sh-encourage .g1-hero-rano { animation: g1mtilt 0.7s ease; }
.g1-sh-encourage .g1-hero-bit { animation: g1heroIn 0.45s ease 0.1s both; }
.g1-sh-celebrate .g1-hero-rano { animation: g1mhop 0.9s ease; }
/* Bit BOSHLOVCHI (present) — ramka ekranlarida diktor, Ra'no o'lchamida (kirish + suzish) */
.g1-sh-present .g1-hero-bit { height: clamp(104px,22vh,200px); animation: g1heroIn 0.45s ease, g1bitfloat 3.2s ease-in-out 0.45s infinite; }
@media (max-width: 640px) { .g1-sh-present .g1-hero-bit { height: clamp(76px,14vh,112px); } }
/* Story cast (frame ichi): Ra'no + Anvar, bosqichma-bosqich ochiladi (useStoryReveal) */
/* Orqa sahna (xona/eshik) — personajlar oldida, REAL masshtab (personaj katta, jihoz proporsional) */
.g1-scene { position: relative; width: 100%; display: flex; align-items: flex-end; justify-content: center; min-height: clamp(200px,44vw,340px); overflow: hidden; border-radius: 14px; }
.g1-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.g1-scene > .g1-cast-row { position: relative; z-index: 1; padding-bottom: clamp(8px,2.4vw,18px); }
.g1-scene .g1-cast-fig { height: clamp(132px,32vw,230px); }   /* sahnada personaj kattaroq */
/* slayd 1 dasturxon (chiroyli stol) — personajlar orqasida, polda */
.g1-scene-table { position: absolute; left: 50%; bottom: clamp(2px,1.4vw,12px); transform: translateX(-50%); width: clamp(230px,60vw,420px); z-index: 0; pointer-events: none; }
.g1-scene-table .g1-table-svg { width: 100%; filter: drop-shadow(0 8px 16px rgba(58,53,48,0.14)); }
.g1-scene-intro .g1-cast-row { gap: clamp(80px,30vw,260px); }   /* personajlar dasturxon yon tomonlarida */
.g1-cast-row { display: flex; align-items: flex-end; justify-content: center; gap: clamp(18px,5vw,48px); flex-wrap: wrap; }
.g1-cast { display: flex; flex-direction: column; align-items: center; gap: clamp(6px,1.4vw,10px); opacity: 0; transform: translateY(10px) scale(0.96); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-cast.in { opacity: 1; transform: translateY(0) scale(1); }
.g1-cast-fig { height: clamp(96px,20vw,150px); display: flex; align-items: flex-end; justify-content: center; }
.g1-cast-sm .g1-cast-fig { height: clamp(72px,15vw,110px); }
.g1-cast-img { height: 100%; width: auto; display: block; filter: drop-shadow(0 6px 12px rgba(58,53,48,0.22)); }
.g1-cast-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.8vw,16px); color: #5A5A60; }
.g1-cast-sub { color: #A7A6A2; font-weight: 600; }
/* Anvar PLACEHOLDER (rasm hali yo'q): punktir ramka -> "rasm tez orada keladi" signali */
.g1-anvar-ph { height: 100%; aspect-ratio: 2 / 3; display: flex; align-items: center; justify-content: center; padding: clamp(6px,1.4vw,10px); border: 2px dashed rgba(1,154,203,0.55); border-radius: 16px; background: rgba(205,231,241,0.18); }
.g1-anvar-coming { opacity: 0.92; }
.g1-anvar-door { animation: g1pulse 1.8s ease-in-out infinite; }
.g1-anvar-happy { animation: g1mhop 0.9s ease; }
/* s10/s11 final bayram: savat + Anvar yonma-yon */
.g1-final-cel { display: flex; align-items: center; justify-content: center; gap: clamp(12px,3vw,28px); flex-wrap: wrap; }
/* s10 fakt: 5 barmoqli qo'l + matn (barmoqlar ko'rsatiladi) */
.g1-handfact { display: flex; align-items: center; gap: clamp(12px,2.6vw,18px); background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px,2.2vw,16px); box-shadow: 0 6px 16px -6px rgba(1,154,203,0.22); margin-top: clamp(10px,2vw,14px); }
.g1-handfact-hand { flex-shrink: 0; }
.g1-handfact-hand .g1-hand { width: clamp(96px,22vw,150px); height: clamp(92px,21vw,142px); }
.g1-handfact-txt { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,2vw,18px); color: #0E5F7F; }
@media (prefers-reduced-motion: reduce) { .g1-cast { transition: none; } .g1-anvar-door, .g1-anvar-happy, .g1-cast-fig, .g1-dress { animation: none; } }
@keyframes g1heroIn { 0% { opacity: 0; transform: translateY(10px) scale(0.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes g1mhop { 0%,100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-13px) scale(1.14); } 55% { transform: translateY(0) scale(1); } 70% { transform: translateY(-6px) scale(1.07); } }
@keyframes g1mtilt { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-11deg); } 55% { transform: rotate(8deg); } 80% { transform: rotate(-4deg); } }
.g1-react-txt { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(16px,2.6vw,22px); }
.g1-react-ok .g1-react-txt { color: #1F7A4D; }
.g1-react-enc .g1-react-txt { color: #D8A93A; }
/* Bit-KARTOCHKA (har javobda): matn chap, animatsion Bit o'ng — 5-sinf fakt-kartochka uslubi */
.g1-bitcard { display: flex; align-items: center; gap: clamp(10px,2.4vw,16px); width: 100%; }
.g1-bitcard-body { flex: 1; min-width: 0; }
.g1-bitcard-txt { font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(16px,2.6vw,22px); }
.g1-bitcard-ok .g1-bitcard-txt { color: #1F7A4D; }
.g1-bitcard-enc .g1-bitcard-txt { color: #D8A93A; }
.g1-bitcard-fig { flex-shrink: 0; height: clamp(48px,11vw,68px); }
.g1-bitcard-ok .g1-bitcard-fig .g1-char { animation: g1mhop 0.7s ease; }
.g1-bitcard-enc .g1-bitcard-fig .g1-char { animation: g1mtilt 0.7s ease; }
@media (prefers-reduced-motion: reduce) {
  .g1-hero, .g1-char, .g1-eyes, .g1-bit-ant, .g1-bit-wave, .g1-anvar-wave { animation: none !important; }
  .g1-sh-present .g1-hero-bit, .g1-bitcard-ok .g1-bitcard-fig .g1-char, .g1-bitcard-enc .g1-bitcard-fig .g1-char { animation: none !important; }
}
@media (prefers-reduced-motion: reduce) { .g1-s4fig, .g1-s4fig-happy, .g1-dress-happy .g1-dress-svg, .g1-spark1, .g1-spark2, .g1-spark3, .g1-conf1, .g1-conf2, .g1-conf3, .g1-conf4, .g1-conf5, .g1-conf6 { animation: none; } }
/* yakuniy reyting (rag'bat): 3 yulduz + maqtov */
.g1-rating { display: flex; flex-direction: column; align-items: center; gap: clamp(4px,1vw,8px); }
.g1-rating-stars { display: flex; gap: clamp(6px,1.6vw,12px); }
.g1-rating-star { width: clamp(50px,11vw,72px); height: clamp(50px,11vw,72px); display: inline-flex; }
.g1-rating-star svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 8px rgba(255,194,60,0.55)); }
.g1-rating-praise { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: clamp(22px,5vw,32px); color: #FF4F28; }

/* === GameDrill (drag+tap o'yin bloki) === */
.g1-tray { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px,1.7vw,12px); padding: clamp(7px,1.7vw,11px); min-height: clamp(48px,10vw,68px); background: #FBF9F4; border-radius: 14px; }
.g1-token { background: #FFFFFF; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; display: flex; align-items: center; justify-content: center; padding: clamp(8px,1.8vw,12px); min-width: clamp(58px,13vw,78px); min-height: clamp(58px,13vw,78px); transition: transform 0.15s, box-shadow 0.15s; }
.g1-token:active { cursor: grabbing; transform: scale(1.05); }
.g1-token-sel { box-shadow: 0 0 0 3px #FF4F28, 0 8px 20px -6px rgba(255,79,40,0.4); }
/* noto'g'ri sudralganda: token yumshoq sakrab qaytadi (jazo emas) */
.g1-bounceback { animation: g1bounceback 0.5s ease; }
@keyframes g1bounceback { 0% { transform: translateY(0) scale(1); } 28% { transform: translateY(-9px) scale(1.1); } 55% { transform: translateY(0) scale(0.97); } 78% { transform: translateY(-3px) scale(1.02); } 100% { transform: translateY(0) scale(1); } }
/* savatga qo'yishni ko'rsatuvchi qo'l-demo */
.g1-bhd { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; pointer-events: none; z-index: 7; padding-bottom: clamp(6px,1.6vw,12px); }
.g1-bhd-move { display: flex; flex-direction: column; align-items: center; animation: g1bhd 2.6s ease-in-out infinite; filter: drop-shadow(0 8px 14px rgba(58,53,48,0.28)); }
.g1-bhd-apple { width: clamp(30px,7vw,42px); height: clamp(30px,7vw,42px); display: inline-flex; }
.g1-bhd-apple svg { width: 100%; height: 100%; }
.g1-bhd-petal { width: clamp(26px,6vw,36px); height: clamp(32px,7.5vw,46px); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: linear-gradient(155deg, #FFB6CE 0%, #FF6FA0 52%, #DA4A82 100%); display: inline-block; }
.g1-bhd-hand { width: clamp(28px,6.5vw,38px); height: auto; margin-top: -4px; }
@keyframes g1bhd { 0% { transform: translateY(12px); opacity: 0; } 12% { opacity: 1; } 46% { transform: translateY(-58px); opacity: 1; } 58% { transform: translateY(-58px) scale(0.94); } 74% { opacity: 1; } 88% { transform: translateY(-64px); opacity: 0; } 100% { transform: translateY(-64px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .g1-bounceback, .g1-bhd-move { animation: none; } }
.g1-token-obj { width: clamp(40px,9vw,56px); height: clamp(40px,9vw,56px); display: inline-flex; pointer-events: none; }
.g1-token-obj svg { width: 100%; height: 100%; }
.g1-token-num { font-weight: 800; font-size: clamp(32px,7vw,44px); color: #0E0E10; pointer-events: none; }
.g1-piece { width: clamp(30px,7vw,44px); height: clamp(30px,7vw,44px); border-radius: 8px; display: inline-block; pointer-events: none; }
.g1-dropzone { transition: background 0.2s, box-shadow 0.2s; cursor: pointer; }
/* noto'g'ri sudralganda: yumshoq sariq puls (jazo emas, "yana sana") */
.g1-nudge { animation: g1nudge 0.45s ease; }
@keyframes g1nudge { 0%, 100% { outline: 2px solid rgba(216,169,58,0); outline-offset: 2px; } 45% { outline: 3px solid rgba(216,169,58,0.75); outline-offset: 3px; } }
@media (prefers-reduced-motion: reduce) { .g1-nudge { animation: none; } }
.g1-basket { min-width: clamp(150px,42vw,280px); min-height: clamp(80px,16vw,112px); background: #FBF3D6; border-radius: 16px; box-shadow: inset 0 0 0 2px #D8A93A; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: clamp(10px,2vw,14px); }
.g1-basket-objs { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(5px,1.4vw,9px); }
.g1-basket-objs .g1-token-obj { width: clamp(26px,6vw,38px); height: clamp(26px,6vw,38px); }
.g1-basket-count { font-weight: 800; font-size: clamp(20px,3.4vw,26px); color: #1F7A4D; }
.g1-puzzle { display: flex; gap: clamp(5px,1.4vw,8px); }
.g1-slot { width: clamp(34px,8vw,52px); height: clamp(46px,10vw,66px); border-radius: 10px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; }
.g1-slot.filled { box-shadow: none; }
.g1-slot .g1-piece { width: 82%; height: 86%; }
/* match: har variant (2/4/5 olma) o'z qatorida — raqam-uyasi chapda, olmalar bitta qatorda o'ngda */
.g1-mbaskets { display: flex; flex-direction: column; gap: clamp(8px,1.8vw,12px); align-items: stretch; width: 100%; max-width: clamp(280px,90vw,460px); margin: 0 auto; }
.g1-mbasket { background: #FFFFFF; border-radius: 14px; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); padding: clamp(8px,1.8vw,12px) clamp(12px,2.6vw,18px); display: flex; flex-direction: row; align-items: center; gap: clamp(12px,3vw,20px); min-width: 0; }
.g1-mbasket-num { flex-shrink: 0; width: clamp(46px,10vw,60px); height: clamp(46px,9vw,58px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: clamp(30px,6.5vw,40px); color: #1F7A4D; }
.g1-order { display: flex; gap: clamp(6px,1.6vw,10px); justify-content: center; }
.g1-pos { width: clamp(56px,12vw,74px); height: clamp(60px,13vw,80px); border-radius: 12px; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; background: #FFFFFF; }
.g1-pos.filled { box-shadow: 0 6px 16px -6px rgba(31,122,77,0.3); background: #E3F0E8; }
.g1-pos .g1-token-num { color: #1F7A4D; }
.g1-ghost { position: fixed; transform: translate(-50%,-50%); z-index: 999; pointer-events: none; background: #FFFFFF; border-radius: 12px; box-shadow: 0 12px 28px -6px rgba(58,53,48,0.35); padding: clamp(6px,1.4vw,10px); display: flex; align-items: center; justify-content: center; }
/* pazl = gul yig'ish */
.g1-flowerwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); }
.g1-flower { position: relative; width: clamp(210px,50vw,290px); height: clamp(210px,50vw,290px); }
.g1-flower-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: clamp(40px,10vw,58px); height: clamp(40px,10vw,58px); border-radius: 50%; background: #FFC23C; box-shadow: 0 4px 10px -4px rgba(180,138,30,0.5); }
.g1-petal-slot { position: absolute; transform: translate(-50%,-50%); width: clamp(54px,13vw,76px); height: clamp(54px,13vw,76px); border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(167,166,162,0.5); display: flex; align-items: center; justify-content: center; }
.g1-petal-slot.filled { box-shadow: none; }
.g1-petal { width: clamp(38px,9vw,56px); height: clamp(48px,11vw,68px); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: linear-gradient(155deg, #FFB6CE 0%, #FF6FA0 52%, #DA4A82 100%); box-shadow: 0 4px 9px -4px rgba(218,74,130,0.55), inset 0 2px 5px rgba(255,255,255,0.4); display: inline-block; pointer-events: none; }
.g1-petal-slot .g1-petal { width: 80%; height: 88%; }
/* gul yig'ilib bo'lgach: bir marta sakrab, keyin sekin aylanadi */
.g1-flower-spin { animation: g1flowerPop 0.55s ease-out, g1spin 5s linear 0.55s infinite; }
@keyframes g1flowerPop { 0% { transform: scale(1) rotate(0deg); } 45% { transform: scale(1.14) rotate(18deg); } 100% { transform: scale(1) rotate(0deg); } }
@keyframes g1spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* savat (3 olma + 2 gilos) */
.g1-basketwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); width: 100%; }
.g1-recipe { display: flex; gap: clamp(12px,3vw,22px); }
.g1-recipe-item { display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 10px; padding: 5px 10px; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); }
.g1-recipe-ic { width: clamp(22px,4.5vw,30px); height: clamp(22px,4.5vw,30px); display: inline-flex; }
.g1-recipe-ic svg { width: 100%; height: 100%; }
.g1-recipe-cnt { font-weight: 800; font-size: clamp(14px,2vw,17px); color: #1F7A4D; }
/* SVG savat (BasketArt) + ustidan olmalar (gardishdan ko'rinadi) */
.g1-realbasket { position: relative; width: clamp(230px,60vw,356px); aspect-ratio: 220 / 170; cursor: pointer; }
.g1-rb-svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 9px 18px rgba(58,53,48,0.34)); }
.g1-rb-bowl {
  position: absolute; left: 16%; right: 16%; top: 14%; bottom: 48%; z-index: 1;
  display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: clamp(3px,1.2vw,7px);
}
.g1-rb-bowl .g1-token-obj { width: clamp(24px,5.5vw,36px); height: clamp(24px,5.5vw,36px); animation: g1drop 0.5s ease-out; }
/* yakuniy test: savat ko'tarilib, olmalar sekin tushadi */
.g1-celebrate { display: flex; justify-content: center; }
.g1-celebrate-basket { animation: g1rise 0.6s ease-out; }
.g1-celebrate-apple { animation: g1fallin 0.7s ease-in both; }
@keyframes g1rise { from { transform: translateY(70px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes g1fallin { 0% { transform: translateY(-80px); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }

.g1-count-grid { display: flex; flex-wrap: wrap; gap: clamp(10px, 2.5vw, 18px); justify-content: center; }
.g1-item { position: relative; background: #FFFFFF; border: none; border-radius: 16px; cursor: pointer; padding: clamp(16px, 3.4vw, 24px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.16); transition: transform 0.18s, background 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; }
.g1-item:hover { transform: translateY(-2px); }
.g1-item-on { background: #E3F0E8; box-shadow: 0 8px 20px -6px rgba(31,122,77,0.3); }
.g1-item-num { position: absolute; top: 4px; right: 8px; font-weight: 800; font-size: clamp(14px, 2vw, 18px); color: #1F7A4D; }
.g1-item-icon { width: clamp(40px, 9vw, 60px); height: clamp(40px, 9vw, 60px); display: inline-flex; }
.g1-item-icon svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 7px rgba(58,53,48,0.18)); }
.g1-bigcount { text-align: center; margin-top: 14px; font-weight: 800; font-size: clamp(22px, 3.4vw, 28px); color: #0E0E10; }

.g1-numrow { display: flex; align-items: center; gap: clamp(12px, 3vw, 20px); padding: clamp(5px, 1.3vw, 9px) clamp(8px, 1.6vw, 12px); border-radius: 12px; transition: background 0.3s ease; }
.g1-numrow-on { background: #FFE8E1; }
.g1-digit { font-weight: 800; font-size: clamp(36px, 8vw, 58px); color: #FF4F28; min-width: 1.2em; text-align: center; transition: transform 0.3s cubic-bezier(0.34,1.4,0.64,1); }
.g1-numrow-on .g1-digit { transform: scale(1.18); }

/* tap-pair (s5) */
.g1-groups { display: flex; gap: clamp(8px, 2vw, 16px); justify-content: center; flex-wrap: wrap; }
.g1-group { flex: 1; min-width: clamp(88px, 26vw, 150px); background: #FFFFFF; border: 2px dashed #A7A6A2; border-radius: 16px; padding: clamp(10px, 2vw, 16px); display: flex; flex-direction: column; align-items: center; gap: 10px; transition: border-color 0.18s, background 0.18s; cursor: pointer; }
.g1-group-armed { border-color: #019ACB; background: #EAF6FB; }
.g1-group-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.g1-group-wrong { border-color: #D8A93A; background: #FBF3D6; }
.g1-group-faded { opacity: 0.3; cursor: default; }
.g1-slot { min-height: clamp(38px, 7vw, 50px); display: flex; align-items: center; justify-content: center; }
.g1-slot-num { font-weight: 800; font-size: clamp(34px, 8vw, 52px); color: #1F7A4D; }
.g1-tiles { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; margin-top: 4px; }
.g1-tile { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(13px, 2.6vw, 21px) clamp(21px, 4vw, 31px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(32px, 7vw, 46px); color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.18); transition: transform 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s; }
.g1-tile:hover:not(:disabled) { transform: translateY(-2px); }
.g1-tile-sel { background: #FF4F28; color: #FFFFFF; box-shadow: 0 10px 24px -6px rgba(255,79,40,0.5); }
.g1-tile-ok { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 10px 24px -6px rgba(31,122,77,0.4); }
.g1-tile-used { opacity: 0.3; cursor: default; }
.g1-tile:disabled { cursor: default; }

/* ===== Dars02 — RAQAMLI UYLAR (digit / house / street) ===== */
.g1-digit { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #3A3530; display: inline-flex; align-items: center; justify-content: center; }
.g1-digit-ink { color: #3A3530; }
.g1-digit-accent { color: #FF4F28; }
.g1-digit-success { color: #1F7A4D; }
.g1-digit-sm { font-size: clamp(26px, 5.2vw, 38px); }
.g1-digit-mid { font-size: clamp(40px, 8vw, 60px); }
.g1-digit-big { font-size: clamp(60px, 13vw, 104px); }

/* hook — sochilgan uy raqamlari */
.g1-scatter { position: relative; width: 100%; max-width: 360px; height: clamp(150px, 26vw, 200px); }
.g1-scatter-d { position: absolute; animation: g1Float 3.4s ease-in-out infinite; filter: drop-shadow(0 4px 8px rgba(58,53,48,0.18)); }
@keyframes g1Float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-9px) rotate(var(--r,0deg)); } }

/* savol / izoh matni */
.g1-q { font-size: clamp(15px, 2vw, 18px); font-weight: 600; color: #3A3530; margin: 0; }
.g1-hint-txt { font-size: clamp(13px, 1.7vw, 15px); color: #8A8780; }
.g1-arrow { font-size: clamp(28px, 5vw, 44px); color: #8A8780; }
.g1-tip-txt { font-size: clamp(14px, 1.8vw, 16px); color: #3A3530; line-height: 1.45; }

/* qator konteyner + sanagich */
.g1-drow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 1.8vw, 14px); }
.g1-dpips { min-height: clamp(92px, 18vw, 128px); display: flex; align-items: center; justify-content: center; }

/* TenFrame — "besh-besh ramka": pastki qator (besh) qizil, tepa qator (ortiqcha) ko'k */
.g1-tenframe { display: inline-flex; flex-direction: column; gap: clamp(5px, 1vw, 8px); padding: clamp(7px, 1.5vw, 11px); background: #FFFFFF; border-radius: 16px; box-shadow: 0 5px 16px -9px rgba(58, 53, 48, 0.4); }
.g1-tf-row { display: flex; gap: clamp(5px, 1vw, 8px); }
.g1-tf-cell { width: clamp(26px, 5.2vw, 38px); height: clamp(26px, 5.2vw, 38px); border-radius: 9px; border: 2px solid #E6E1D6; background: #F6F4EF; display: flex; align-items: center; justify-content: center; }
.g1-tf-base .g1-tf-cell { border-color: #FFD2C6; }
.g1-tf-dot { width: 56%; height: 56%; border-radius: 50%; background: transparent; }
.g1-tf-cell.on { background: #FFE8E1; border-color: #FF4F28; }
.g1-tf-cell.on .g1-tf-dot { background: #FF4F28; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell.on { background: #E3F2FB; border-color: #019ACB; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell.on .g1-tf-dot { background: #019ACB; }
@keyframes g1tfPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
.g1-tf-pop .g1-tf-dot { animation: g1tfPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
@media (prefers-reduced-motion: reduce) { .g1-tf-pop .g1-tf-dot { animation: none; } }

/* PROPIS — kataklı daftarda raqam yozish (Dars02'dan) + s3 raqam tanlovi */
.g1-kcell { position: relative; aspect-ratio: 64 / 92; padding: 0; overflow: hidden; border: 2.5px solid #BFE0EC; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  background-color: #FBFEFF;
  background-image: linear-gradient(#D7EEF6 1.2px, transparent 1.2px), linear-gradient(90deg, #D7EEF6 1.2px, transparent 1.2px);
  background-size: clamp(15px, 3.6vw, 24px) clamp(15px, 3.6vw, 24px); }
.g1-kcell.active { border-color: #FF4F28; box-shadow: 0 0 0 2px #FFD3C7; }
.g1-kcell-write { flex: 0 0 auto; width: clamp(70px, 13vw, 94px); }
.g1-kcell .g1-write { width: 100%; height: 100%; }
.g1-write { width: clamp(80px, 17vw, 116px); height: auto; }
.g1-write-ghost { fill: none; stroke: #F2DDD3; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
.g1-write-ink { fill: none; stroke: #FF4F28; stroke-width: 8.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 100; }
.g1-digit-pick { display: flex; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.g1-pickbtn { width: clamp(40px, 8vw, 52px); height: clamp(40px, 8vw, 52px); border-radius: 12px; border: 2px solid #E6E1D6; background: #FFFFFF; font-family: 'Fraunces', Georgia, serif; font-size: clamp(18px, 3.4vw, 24px); font-weight: 600; color: #5A5A60; cursor: pointer; transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease, transform 0.15s ease; box-shadow: 0 3px 8px -4px rgba(58, 53, 48, 0.3); }
.g1-pickbtn:hover:not(.active) { transform: translateY(-2px); }
.g1-pickbtn.active { border-color: #FF4F28; color: #FF4F28; background: #FFF3EF; }

/* FingerHand — barmoqlar vizualizatori (s2) */
.g1-fhand { width: clamp(72px, 15vw, 104px); height: auto; }
.g1-hand-group, .g1-handbtn { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-handbtn { border: 2.5px dashed #FFB9A8; border-radius: 16px; background: #FFF6F3; padding: clamp(6px, 1.4vw, 10px); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.g1-handbtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px -8px rgba(255, 79, 40, 0.5); }
.g1-handbtn:disabled { cursor: default; border-style: solid; border-color: #1F7A4D; background: #E3F0E8; }
.g1-hand-cap { font-size: clamp(17px, 3vw, 22px); font-weight: 700; color: #FF4F28; }
.g1-handbtn:disabled .g1-hand-cap { color: #1F7A4D; }

/* Ten-frame drag o'yin (sd): drop zona + nuqta tokenlar */
.g1-tfdrop { padding: clamp(8px, 2vw, 14px); border-radius: 18px; border: 2.5px dashed #BFD9E6; background: #F7FBFD; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-token-dot { width: clamp(20px, 4.4vw, 28px); height: clamp(20px, 4.4vw, 28px); border-radius: 50%; background: #FF4F28; display: block; box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.15); }
/* ten-frame PREDMET rejimi (sd o'yini): kataklar neytral, ichida buyum, tushganda pop */
.g1-tf-cell-obj.on { background: #FFFDF9; border-color: #E0DACE; }
.g1-tf-row:not(.g1-tf-base) .g1-tf-cell-obj.on { background: #FFFDF9; border-color: #E0DACE; }
.g1-tf-base .g1-tf-cell-obj { border-color: #E0DACE; }
.g1-tf-item { width: 82%; height: 82%; display: flex; align-items: center; justify-content: center; animation: g1tfDrop 0.46s cubic-bezier(0.34, 1.4, 0.64, 1) backwards; }
@keyframes g1tfDrop { 0% { transform: translateY(-75%); opacity: 0; } 65% { transform: translateY(7%); } 100% { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g1-tf-item { animation: none; } }
/* keyingi to'ldiriladigan katak — pulslab "qayerga qo'yish"ni ko'rsatadi */
.g1-tf-next { border-color: #FF4F28; border-style: dashed; animation: g1tfPulse 1.1s ease-in-out infinite; }
@keyframes g1tfPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255, 79, 40, 0.45); } 60% { box-shadow: 0 0 0 6px rgba(255, 79, 40, 0); } }
.g1-dropzone-wait { border-color: #FF8A6E; background: #FFF4F0; }
.g1-drophint { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: clamp(13px, 1.8vw, 15px); color: #C23B1E; font-weight: 600; }
.g1-drophint-arrow { font-size: clamp(18px, 3vw, 24px); animation: g1hintBounce 1s ease-in-out infinite; }
@keyframes g1hintBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .g1-tf-next, .g1-drophint-arrow { animation: none; } }
/* s8 — raqam plitasini eshikka sudrash */
.g1-plate-drop { padding: clamp(10px, 2.4vw, 16px); border-radius: 18px; border: 2.5px dashed #BFD9E6; background: #F7FBFD; display: flex; justify-content: center; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-plate-house { display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); }
.g1-plate-house .g1-house-svg { width: clamp(88px, 19vw, 124px); }
.g1-token-plate { background: #FCFAF5; border: 2px solid #C9A877; box-shadow: 0 4px 10px -4px rgba(58, 53, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6); min-width: clamp(48px, 10vw, 62px); min-height: clamp(48px, 10vw, 62px); }

/* sGuest (slayd 15) yaqin plan: yangi uy 0 -> 1 (Zuhra ko'chib keladi) */
.g1-newhouse-scene { display: flex; align-items: center; justify-content: center; gap: clamp(16px, 5vw, 48px); flex-wrap: wrap; min-height: clamp(170px, 32vw, 230px); }
.g1-newhouse-house .g1-house-svg { width: clamp(118px, 25vw, 176px); }
.g1-newhouse-side { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 2vw, 14px); }
.g1-zerorow { display: flex; align-items: center; gap: clamp(6px, 1.6vw, 12px); }
.g1-newhouse-zuhra { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g1-newhouse-zuhra .g1-char { width: clamp(58px, 12vw, 86px); height: auto; }
.g1-newhouse-empty { font-size: clamp(13px, 1.8vw, 16px); color: #8A8780; }
.g1-newhouse-num { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.g1-newhouse-note { font-size: clamp(12px, 1.7vw, 15px); color: #1F7A4D; font-weight: 600; }
.g1-count-line { display: flex; align-items: center; justify-content: center; gap: 10px; }
.g1-count-label { font-size: clamp(13px, 1.7vw, 15px); color: #8A8780; }
.g1-count-val { font-size: clamp(16px, 2.2vw, 20px); font-weight: 800; color: #FF4F28; }

/* ESHIK (raqam plitasi bilan) */
.g1-door { position: relative; display: inline-flex; flex-direction: column; align-items: center; width: clamp(54px, 11.5vw, 76px); height: clamp(78px, 16.5vw, 106px); background: repeating-linear-gradient(90deg, rgba(122,78,34,0) 0, rgba(122,78,34,0.12) 5px, rgba(255,255,255,0.05) 9px, rgba(122,78,34,0) 13px), linear-gradient(180deg, #C2864F, #9A6738); border: 2px solid #7A4E22; border-radius: 11px 11px 4px 4px; box-shadow: inset 0 2px 0 rgba(255,255,255,0.18), 0 4px 10px -5px rgba(58,53,48,0.35); overflow: hidden; }
.g1-door-panel { position: absolute; left: 16%; right: 16%; top: 34%; bottom: 9%; border: 2px solid rgba(0,0,0,0.16); border-radius: 4px; background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.07)); }
.g1-door-plate { position: relative; z-index: 2; margin-top: clamp(5px, 1.4vw, 9px); background: #FCFAF5; border: 1.5px solid #C9A877; border-radius: 6px; padding: 0 clamp(6px, 1.4vw, 10px); box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.g1-door-knob { position: absolute; right: clamp(7px, 1.6vw, 10px); top: 56%; width: 7px; height: 7px; border-radius: 50%; background: #FFD86B; box-shadow: 0 0 0 1px #B8862E; z-index: 2; }
.g1-doorbtn { background: transparent; border: none; padding: 5px; cursor: pointer; border-radius: 12px; transition: transform 0.15s ease; }
.g1-doorbtn:hover:not(:disabled) { transform: translateY(-3px); }
.g1-doorbtn.active .g1-door { border-color: #FF4F28; box-shadow: 0 0 0 3px #FFD3C7, inset 0 2px 0 rgba(255,255,255,0.18); }
.g1-doorbtn.seen .g1-door { border-color: #1F7A4D; }
.g1-doorbtn.used { opacity: 0.4; }
.g1-doorbtn.placed { opacity: 0.45; }
.g1-doorbtn:disabled { cursor: default; }

/* UY (svg) + hovli */
.g1-house-svg { width: clamp(92px, 19vw, 126px); height: auto; display: block; }
.g1-housefig { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.g1-yard { display: flex; justify-content: center; }
.g1-s2house .g1-house-svg { width: clamp(92px, 19vw, 122px); }
/* Dars02 realizatsiyasi: uy variantlari BIR QATORDAN, gorizontal tasma (uy | predmetlar), chapga */
.g1-opt-house { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: clamp(12px, 3vw, 24px); width: 100%; padding-left: clamp(4px, 2vw, 14px); }
.g1-opt-house .g1-house-svg { width: clamp(56px, 12vw, 78px); flex: none; }
.g1-opt-house .g1-yard { flex: 1 1 auto; justify-content: flex-start; min-width: 0; }
.g1-opt-house .g1-pips { justify-content: flex-start; }

/* s8 / s9 — uy tugmalari */
.g1-houses { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 14px); }
.g1-housebtn { background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 18px; padding: clamp(8px, 1.8vw, 13px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease, opacity 0.2s ease; }
/* s8/s9 uy tugmalari ham bir qatordan, gorizontal tasma (uy | predmetlar), chapga */
.g1-houses .g1-housebtn, .g1-match-houses .g1-housebtn { flex-direction: row; justify-content: flex-start; width: 100%; gap: clamp(12px, 3vw, 22px); }
.g1-houses .g1-housebtn .g1-house-svg, .g1-match-houses .g1-housebtn .g1-house-svg { width: clamp(54px, 12vw, 74px); flex: none; }
.g1-houses .g1-housebtn .g1-yard, .g1-match-houses .g1-housebtn .g1-yard { flex: 1 1 auto; justify-content: flex-start; min-width: 0; }
.g1-houses .g1-pips, .g1-match-houses .g1-pips { justify-content: flex-start; }
.g1-housebtn:hover:not(:disabled) { transform: translateY(-2px); }
.g1-housebtn-ok { border-color: #1F7A4D; background: #EFF7F1; }
.g1-housebtn-faded { opacity: 0.4; }
.g1-housebtn:disabled { cursor: default; }
.g1-housebtn .g1-house-svg { width: clamp(64px, 13.5vw, 92px); }

/* s9 — juftlash tartibi */
.g1-match { display: flex; flex-direction: column; gap: clamp(12px, 2.4vw, 18px); }
.g1-match-digits { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); }
.g1-match-houses { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); }

/* s5 — shakl belgisi */
.g1-feature { display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: clamp(90px, 18vw, 130px); justify-content: center; }
.g1-feature-txt { font-size: clamp(14px, 1.9vw, 17px); font-weight: 600; color: #FF4F28; }

/* s2 — joylash katakchalari */
.g1-tapgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(8px, 1.6vw, 12px); }
.g1-tapcell { position: relative; background: #FFFFFF; border: 2px solid #E7E1D6; border-radius: 14px; width: clamp(50px, 10vw, 64px); height: clamp(50px, 10vw, 64px); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s ease, border-color 0.2s ease; }
.g1-tapcell svg { width: 64%; height: 64%; opacity: 0.5; transition: opacity 0.2s ease; }
.g1-tapcell.on { border-color: #1F7A4D; background: #EFF7F1; }
.g1-tapcell.on svg { opacity: 1; }
.g1-tapcell-tag { position: absolute; top: 2px; right: 5px; font-size: 12px; color: #1F7A4D; font-weight: 700; }
.g1-tapcell:disabled { cursor: default; }

/* sd — o'yin: uy oldiga buyum torting */
.g1-collecthouse { position: relative; display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); padding: clamp(8px, 1.8vw, 14px); border-radius: 18px; border: 2px dashed #D8CFBF; transition: border-color 0.2s ease, background 0.2s ease; }
.g1-collecthouse.g1-dropzone { background: #FCF7EE; }
.g1-yard-drop { min-height: clamp(40px, 8vw, 54px); align-items: center; }

/* KO'CHA sahnasi — fon + ustiga uylar/personajlar (proporsiya qulflangan) */
.g1-street { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 400 / 218; container-type: size; border-radius: 14px; overflow: hidden; }
.g1-street-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.g1-street-houses { position: absolute; left: 2%; right: 2%; bottom: 13%; display: flex; justify-content: center; align-items: flex-end; gap: 1cqw; }
.g1-street-house { opacity: 0; transform: translateY(8%); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-street-house.in { opacity: 1; transform: none; }
.g1-street-house .g1-house-svg { width: 15cqw; }   /* 6 uy (5 raqamli + 1 bo'sh) sig'ishi uchun ozroq tor */
.g1-street-new { margin-left: 2.5cqw; }            /* yangi bo'sh uy — ko'cha oxirida ajralib turadi */
.g1-street-target .g1-house-svg { filter: drop-shadow(0 0 7px rgba(255,79,40,0.8)); }
.g1-street-anvar, .g1-street-rano, .g1-street-zuhra { position: absolute; display: flex; flex-direction: column; align-items: center; opacity: 0; transition: opacity 0.5s ease; z-index: 3; }
.g1-street-anvar.in, .g1-street-rano.in, .g1-street-zuhra.in { opacity: 1; }
/* personajlar OLD PLANDA, kichik (eshik bo'yida) — real proporsiya + chuqurlik */
.g1-street-anvar { left: 6%; bottom: 0; }
.g1-street-rano { left: 22%; bottom: 4%; }
.g1-street-zuhra { right: 4%; bottom: 0; }
.g1-street-anvar .g1-char, .g1-street-rano .g1-char, .g1-street-zuhra .g1-char { width: 6cqw; height: auto; }
.g1-street .g1-cast-name { display: none; }
.g1-street-final .g1-street-anvar { left: auto; right: 27%; bottom: 0; }
.g1-street-final .g1-street-rano { left: auto; right: 15%; bottom: 4%; }
.g1-street-final .g1-street-zuhra { right: 3%; bottom: 6%; }
/* Anvar YURIB keladi (chapdan o'z joyiga) */
@keyframes g1WalkIn {
  0%   { transform: translateX(-260%) translateY(0)    rotate(0deg); }
  18%  { transform: translateX(-205%) translateY(-5%)  rotate(2.5deg); }
  36%  { transform: translateX(-150%) translateY(0)    rotate(-2.5deg); }
  54%  { transform: translateX(-100%) translateY(-5%)  rotate(2.5deg); }
  72%  { transform: translateX(-55%)  translateY(0)    rotate(-2.5deg); }
  88%  { transform: translateX(-16%)  translateY(-3%)  rotate(1.5deg); }
  100% { transform: translateX(0)     translateY(0)    rotate(0deg); }
}
.g1-street-anvar.in { animation: g1WalkIn 2.6s ease-out both; }

/* "5 va yana" — 5 talik guruh + qolgani orasida bo'shliq (6-10 ni o'qish uchun) */
.g1-pips-five { gap: 0; }
.g1-five-grp, .g1-more-grp { display: inline-flex; flex-wrap: nowrap; gap: clamp(4px, 1.2vw, 9px); align-items: center; }
.g1-five-grp { padding-right: clamp(8px, 2.4vw, 18px); border-right: 2px dashed rgba(58,53,48,0.16); margin-right: clamp(8px, 2.4vw, 18px); }
.g1-pips-wrap.g1-pips-five { flex-wrap: wrap; row-gap: clamp(4px, 1.2vw, 9px); }

/* s2 — "5 ta tayyor" kataklari (bosib bo'lmaydi, yengil ko'rsatilgan) */
.g1-tapcell-base { border-color: #D8D0C2; background: #F4F1EA; cursor: default; }
.g1-tapcell-base svg { opacity: 0.78; }

/* final / summary — rasm + matn YONMA-YON (skrolsiz) */
.g1-final-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(12px, 2.6vw, 22px); width: 100%; }
.g1-final-row .g1-final-street { flex: 1 1 280px; max-width: 420px; }
.g1-final-row .g1-handfact { flex: 1 1 200px; max-width: 320px; display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.g1-sum-row { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(12px, 2.6vw, 22px); }
.g1-sum-row .g1-final-street { flex: 1 1 300px; max-width: 440px; }
.g1-sum-col { flex: 1 1 240px; min-width: 230px; display: flex; flex-direction: column; gap: clamp(10px, 2vw, 14px); }
.g1-final-street { width: 100%; }

/* s11 — final fakt: 1-5 raqamlari qatori */
.g1-factdigits { display: flex; justify-content: center; gap: clamp(6px, 1.6vw, 12px); }
.g1-handfact-txt { font-size: clamp(13px, 1.7vw, 15px); color: #3A3530; line-height: 1.4; text-align: center; margin: 0; }

/* summary — ball + bog'lanishlar */
.g1-score { font-size: clamp(18px, 2.6vw, 24px); font-weight: 800; color: #1F7A4D; margin: 6px 0 0; }
.g1-conn { display: flex; flex-direction: column; gap: 8px; }
.g1-conn-title { font-size: clamp(14px, 1.8vw, 16px); font-weight: 800; color: #3A3530; margin: 0 0 2px; }
.g1-conn-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.g1-conn-tag { font-size: clamp(11px, 1.4vw, 13px); font-weight: 700; padding: 3px 10px; border-radius: 99px; white-space: nowrap; }
.g1-conn-ref { background: #EAF6FB; color: #017CA3; }
.g1-conn-next { background: #FFF1EC; color: #D63E18; }
.g1-conn-txt { font-size: clamp(13px, 1.7vw, 15px); color: #5A5A60; }

@media (prefers-reduced-motion: reduce) {
  .g1-scatter-d { animation: none; }
  .g1-street-house, .g1-street-anvar, .g1-street-rano, .g1-street-zuhra { transition: none; }
  .g1-street-anvar.in { animation: none; }
}


/* ====== Dars07 — qo'shishning ma'nosi: pufakchali savatlar + hovli sahnasi ====== */

/* --- birlashtirish qatori (pufakchali savatlar) --- */
.g1-cg { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 18px); }
.g1-cg-joined { flex-direction: column; gap: clamp(8px, 1.8vw, 14px); }
.g1-cg-op { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #FF4F28; line-height: 1; }
.g1-cg-sent { display: flex; align-items: center; gap: clamp(5px, 1.4vw, 10px); font-weight: 800; font-size: clamp(22px, 4.6vw, 34px); color: #0E0E10; }
.g1-cg-sent .g1-cg-sign { font-style: normal; color: #FF4F28; }
.g1-cg-sent .g1-cg-tot { color: #1F7A4D; }

/* birlashganda pufakcha suzib kiradi */
.d4-mount { animation: d4slidein 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
.d4-mount-r { animation: d4slideinr 0.55s cubic-bezier(0.34,1.2,0.64,1) both; }
@keyframes d4slidein { from { opacity: 0; transform: translateX(-30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes d4slideinr { from { opacity: 0; transform: translateX(30px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }

/* --- TEPADAN savat (sodda %-o'lcham, container-query YO'Q) --- */
.bt { position: relative; width: clamp(100px, 25vw, 152px); aspect-ratio: 1 / 0.9; }
.bt-rim { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 6px 13px rgba(58,53,48,0.26)); }
.bt-fruit { position: absolute; left: 18%; right: 18%; top: 15%; bottom: 22%; display: flex; flex-wrap: wrap; align-items: center; align-content: center; justify-content: center; gap: 1.5%; }
.bt-f { aspect-ratio: 1 / 1; display: inline-flex; align-items: center; justify-content: center; }
.bt-f svg { width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(58,53,48,0.18)); }

/* --- o'ylov pufakchasi (ichida tepadan savat) --- */
.fb { display: inline-flex; flex-direction: column; align-items: center; }
.fb-body { background: #FFFFFF; border-radius: 50%; box-shadow: 0 6px 18px -6px rgba(58,53,48,0.3); padding: clamp(7px, 1.8vw, 13px); width: clamp(84px, 22vw, 128px); }
.fb-body .bt { width: 100%; }
.fb-dot { background: #FFFFFF; border-radius: 50%; box-shadow: 0 2px 5px -1px rgba(58,53,48,0.25); }
.fb-dot1 { width: 11px; height: 11px; margin-top: 3px; }
.fb-dot2 { width: 7px; height: 7px; margin-top: 2px; }
/* birlashtirish figurasidagi pufakcha o'lchami (skrolsiz) */
.g1-cg .fb-body { width: clamp(78px, 20vw, 116px); }
.g1-cg-joined .fb-body { width: clamp(92px, 24vw, 134px); }

/* --- s5 sudrab-birlashtirish: drop-zona = tepadan savat (punktir -> javobda yashil) + tray --- */
.g1-cg-drop { position: relative; transition: outline 0.2s, background 0.2s; }
.g1-s5-drop { width: clamp(118px, 30vw, 168px); aspect-ratio: 1 / 0.9; display: flex; align-items: center; justify-content: center; padding: 5px; border-radius: 50%; outline: 2px dashed rgba(255,79,40,0.5); outline-offset: 3px; }
.g1-s5-drop .bt { width: 100%; }
.g1-s5-drop.full { outline: 2px solid #1F7A4D; }
.g1-combine-row { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(8px, 2vw, 18px); }
.g1-combine-grouplabel { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g1-combine-name { font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.5vw, 13px); color: #5A5A60; font-weight: 700; }
.g1-gameopts { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 18px); }
.g1-numopt { display: flex; align-items: center; justify-content: center; min-width: clamp(56px, 14vw, 78px); min-height: clamp(56px, 14vw, 78px);
  background: #FFFFFF; border: none; border-radius: 16px; box-shadow: 0 4px 12px -5px rgba(58,53,48,0.3); cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
.g1-numopt:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 18px -7px rgba(58,53,48,0.4); }
.g1-numopt-wrong { opacity: 0.4; box-shadow: inset 0 0 0 2px #FFCDBF; cursor: default; }
.g1-numopt-ok { background: #E3F0E8; box-shadow: inset 0 0 0 2px #1F7A4D; cursor: default; }

/* AnsPop — javob raqami savol vizualida ("= N", yashil, pop). Barcha test-figuralar. */
.g1-anspop { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); margin-left: clamp(4px, 1vw, 8px); }
.g1-anspop-eq { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #5A5A60; line-height: 1; }
.g1-anspop-num { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(44px, 9vw, 66px); line-height: 1; color: #1F7A4D; }

/* --- s6 son-yozuv varianti --- */
.g1-sent { display: inline-flex; align-items: center; gap: clamp(4px, 1.2vw, 8px); font-weight: 800; font-size: clamp(20px, 4vw, 30px); color: #0E0E10; }
.g1-sent .g1-sent-op { font-style: normal; font-weight: 800; }
.g1-sent .g1-sent-plus { color: #FF4F28; }
.g1-sent .g1-sent-minus { color: #5A5A60; }

/* --- s8 fakt kartasi (ko'k) --- */
.g1-factcard { display: flex; flex-direction: column; gap: 6px; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 14px; padding: clamp(9px, 1.8vw, 14px); }
.g1-factcard-badge { font-size: clamp(10px, 1.3vw, 12px); letter-spacing: 0.12em; text-transform: uppercase; color: #0A7FA8; font-weight: 700; }
.g1-factcard-row { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.g1-factcard-plus { flex: 0 0 auto; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #019ACB;
  font-size: clamp(34px, 8vw, 52px); line-height: 1; animation: factPlus 2.4s ease-in-out infinite; }
.g1-factcard-txt { margin: 0; font-size: clamp(13px, 1.8vw, 15px); line-height: 1.38; color: #0E0E10; }
@keyframes factPlus { 0%,100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(90deg) scale(1.12); } }

/* --- hovli sahnasi (CastScene) — 560px cheklangan (skrolsiz) --- */
.g1-yardscene { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 400 / 215; container-type: size; border-radius: 14px; overflow: hidden; }
.g1-yard-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.g1-yard-cast { position: absolute; inset: 0; }
.g1-yc-fig { position: absolute; bottom: 4cqh; display: flex; flex-direction: column; align-items: center; gap: 2px;
  opacity: 0; transform: translateY(8cqh) scale(0.96); transition: opacity 0.5s ease, transform 0.5s ease; }
.g1-yc-fig.in { opacity: 1; transform: translateY(0) scale(1); }
.g1-yc-fig .g1-cast-svg { height: 42cqh; width: auto; }
.g1-yc-rano { left: 16cqw; }
.g1-yc-anvar { left: 44cqw; }
.g1-yc-zuhra { right: 14cqw; }
.g1-yc-zuhra.walkin { animation: yardWalkIn 1.6s ease-out both; }
/* Dars13 maktab sahnasi — 4 personaj (Jasur kirib keladi), kattaroq + yengil tebranish (jonli) */
.g1-maktabscene .g1-yc-fig .g1-cast-svg { height: 48cqh; animation: g1castbob 3.2s ease-in-out infinite; }
.g1-maktabscene .g1-cast-name { font-size: clamp(10px, 1.5vw, 13px); }
.g1-yc-mrano { left: 2cqw; }
.g1-yc-mrano .g1-cast-svg { animation-delay: 0s; }
.g1-yc-manvar { left: 25cqw; }
.g1-yc-manvar .g1-cast-svg { animation-delay: 0.5s; }
.g1-yc-mzuhra { left: 49cqw; }
.g1-yc-mzuhra .g1-cast-svg { animation-delay: 1s; }
.g1-yc-jasur { right: 2cqw; }
.g1-yc-jasur .g1-cast-svg { animation-delay: 0.75s; }
.g1-yc-jasur.walkin { animation: yardWalkIn 1.4s cubic-bezier(0.34, 1.2, 0.64, 1) both; }
@keyframes g1castbob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3%); } }
@media (prefers-reduced-motion: reduce) { .g1-maktabscene .g1-yc-fig .g1-cast-svg { animation: none; } }
/* yerda turgan savatlar (Dars04 uslubi) — personaj yonida, oyog'i oldida, dekorativ (bo'sh) */
.g1-yard-basket { position: absolute; bottom: 1cqh; width: 15cqw; z-index: 4; opacity: 0; transition: opacity 0.5s ease; }
.g1-yard-basket.in { opacity: 1; }
.g1-yard-basket .g1-rb-svg { width: 100%; height: auto; filter: drop-shadow(0 4px 8px rgba(58,53,48,0.28)); }
.g1-yard-basket-rano { left: 1cqw; }
.g1-yard-basket-zuhra { right: 1cqw; }
/* o'ylov pufakchasi — personaj boshidan YUQORIDA, yuzni to'smaydi (Ra'no 3, Zuhra 2) */
.g1-yard-bubble { position: absolute; bottom: 54cqh; width: 16cqw; z-index: 5; opacity: 0; transition: opacity 0.5s ease; }
.g1-yard-bubble.in { opacity: 1; }
.g1-yard-bubble .fb, .g1-yard-bubble .fb-body { width: 100%; }
.g1-yard-bubble-rano { left: 13cqw; }
.g1-yard-bubble-zuhra { right: 11cqw; }
@keyframes yardWalkIn { from { opacity: 0; transform: translateX(18cqw) translateY(0) scale(1); } to { opacity: 1; transform: translateX(0) translateY(0) scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .g1-factcard-plus, .g1-yc-zuhra.walkin, .d4-mount, .d4-mount-r { animation: none; }
  .g1-yc-fig, .g1-yard-bubble { transition: none; }
}

/* === Dars07 — ayirish vizuallari === */
/* BondFrame (s7, Dars06 dan): 10 katak, qizil/yashil olma, "?" yashirin qism */
@keyframes g1pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
.g1-bf { display: inline-grid; grid-template-columns: repeat(5, auto); gap: clamp(4px, 1.2vw, 9px); padding: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); justify-items: center; }
.g1-bf-cell { width: clamp(38px, 8vw, 52px); height: clamp(38px, 8vw, 52px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); display: flex; align-items: center; justify-content: center; }
.g1-bf-cell.on { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.13); }
.g1-bf-q { font-weight: 800; font-size: clamp(20px, 4vw, 28px); color: #B6B2AB; }
.g1-bf-ap { width: 80%; height: 80%; display: inline-flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.2)); }
.g1-bf-ap svg { width: 100%; height: 100%; }
.g1-bf-pop { animation: g1pop 0.4s ease-out; }

/* RemoveRow (MC figuralari): total olma, oxirgi "gone" tasi xira + chizib tashlangan */
.g1-removerow { display: flex; flex-wrap: wrap; gap: clamp(6px, 1.6vw, 12px); justify-content: center; align-items: center; max-width: 470px; }
.g1-rr-item { width: clamp(34px, 7vw, 46px); height: clamp(34px, 7vw, 46px); display: inline-flex; align-items: center; justify-content: center; position: relative; transition: opacity 0.3s ease; }
.g1-rr-item svg { width: 100%; height: 100%; }
.g1-rr-gone { opacity: 0.24; }
.g1-rr-gone::after { content: ''; position: absolute; left: 10%; right: 10%; top: 50%; height: 3px; background: #C0392B; border-radius: 2px; transform: rotate(-14deg); opacity: 0.72; }

/* tap-to-remove (s0, sg): olma bosilsa uchib ketadi */
.g1-rcell { cursor: pointer; }
.g1-flyaway { animation: g1flyaway 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards; pointer-events: none; }
@keyframes g1flyaway { 0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); } 100% { opacity: 0; transform: translateY(-46px) scale(0.5) rotate(18deg); } }

/* nishon satri (sg) */
.g1-target-row { display: flex; align-items: center; gap: 10px; }
.g1-target-num { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 5.5vw, 40px); color: #FF4F28; line-height: 1; }

/* katta ifoda (s3 qoida): 7 − 2 = 5 */
.g1-sent-lg { font-size: clamp(28px, 6vw, 44px); gap: clamp(8px, 2vw, 14px); }
.g1-sent .g1-sent-eq { font-style: normal; font-weight: 800; color: #5A5A60; }
.g1-sent .g1-sent-res { color: #1F7A4D; }

/* ayirish belgisi variantlari */
.g1-cg-op-minus { color: #5A5A60; }
.g1-factcard-minus { animation: none; }
.g1-s5-basket { box-shadow: inset 0 0 0 2px rgba(58,53,48,0.08); }

@media (prefers-reduced-motion: reduce) {
  .g1-flyaway { animation: none; opacity: 0; }
  .g1-bf-pop { animation: none; }
}

/* === Dars09 — son oqi (NumberLine) + juftlash ===*/
.g1-nl { width: 100%; display: flex; justify-content: center; }
.g1-nl-line { width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: clamp(2px, 1vw, 8px); padding: clamp(58px, 13vw, 76px) clamp(14px, 3.4vw, 26px) clamp(6px, 1.6vw, 12px); background: #FBF9F4; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.06); position: relative; }
.g1-nl-line::before { content: ""; position: absolute; left: calc(clamp(14px, 3.4vw, 26px) + clamp(10px, 2.2vw, 14px)); right: calc(clamp(14px, 3.4vw, 26px) + clamp(10px, 2.2vw, 14px)); top: calc(clamp(58px, 13vw, 76px) + clamp(10px, 2.2vw, 14px)); height: 3px; background: #D8D2C6; border-radius: 2px; }
/* quyon-sakrovchi: o'lchanган pozitsiyaga gorizontal siljiydi; ichki span yoy chizib sakraydi + qo'nishda sapchiydi */
.g1-nl-rabbit { position: absolute; z-index: 4; pointer-events: none; transform: translate(-50%, -100%); transition: left 1.2s cubic-bezier(0.34, 1.06, 0.66, 1), top 1.2s cubic-bezier(0.34, 1.06, 0.66, 1); }
.g1-nl-rabbit-hop { display: block; width: clamp(36px, 8.5vw, 50px); transform-origin: center bottom; animation: g1rabbithop 1.25s cubic-bezier(0.4, 0, 0.5, 1); }
.g1-nl-rabbit-hop svg { width: 100%; height: auto; display: block; transform: scaleX(1.3); transform-origin: center bottom; filter: drop-shadow(0 4px 5px rgba(58,53,48,0.2)); }
/* sakrash izi: ikki raqam orasidagi yoy chiziq (qisqa muddat ko'rinib o'chadi) */
.g1-nl-trail { position: absolute; z-index: 2; pointer-events: none; height: clamp(20px, 4.6vw, 28px); border: 2.5px dashed #FF8A6E; border-bottom: none; border-radius: 50% 50% 0 0 / 100% 100% 0 0; transform: translateY(-100%); animation: g1trail 1.5s ease-out both; }
@keyframes g1trail { 0% { opacity: 0; } 22% { opacity: 0.95; } 100% { opacity: 0; } }
@keyframes g1rabbithop {
  0%   { transform: translateY(0)     scaleX(1)    scaleY(1);    }
  16%  { transform: translateY(3px)   scaleX(1.12) scaleY(0.82); }
  50%  { transform: translateY(-24px) scaleX(0.93) scaleY(1.1);  }
  84%  { transform: translateY(0)     scaleX(1.14) scaleY(0.84); }
  100% { transform: translateY(0)     scaleX(1)    scaleY(1);    }
}
@media (prefers-reduced-motion: reduce) {
  .g1-nl-rabbit { transition: none; }
  .g1-nl-rabbit-hop { animation: none; }
  .g1-nl-trail { animation: none; opacity: 0.55; }
}
.g1-nl-tick { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; background: transparent; border: none; padding: 0 clamp(2px, 0.8vw, 6px); cursor: default; }
button.g1-nl-tick { cursor: pointer; }
.g1-nl-dot { width: clamp(20px, 4.4vw, 28px); height: clamp(20px, 4.4vw, 28px); border-radius: 50%; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.16); transition: transform 0.2s ease, background 0.2s ease; }
.g1-nl-dot.marker { background: #FF4F28; box-shadow: 0 2px 8px rgba(255,79,40,0.4); transform: scale(1.15); }
.g1-nl-tick.inpath .g1-nl-dot { background: #FFD3C7; }
button.g1-nl-tick.picked .g1-nl-dot { background: #FFE8E1; box-shadow: inset 0 0 0 2px #FF8A6E; }
button.g1-nl-tick.ok .g1-nl-dot { background: #1F7A4D; box-shadow: 0 2px 8px rgba(31,122,77,0.4); transform: scale(1.15); }
button.g1-nl-tick:not(:disabled):hover .g1-nl-dot { transform: scale(1.12); }
.g1-nl-num { font-size: clamp(13px, 2vw, 16px); font-weight: 700; color: #5A5A60; }
.g1-nl-legend { display: flex; gap: clamp(16px, 4vw, 32px); }
.g1-nl-leg { display: inline-flex; align-items: center; gap: 6px; font-size: clamp(13px, 1.8vw, 15px); font-weight: 700; color: #0E0E10; }
.g1-nl-arrow { font-size: clamp(18px, 3.4vw, 24px); font-weight: 800; }
.g1-nl-arrow-fwd { color: #FF4F28; }
.g1-nl-arrow-back { color: #5A5A60; }
.g1-mrow { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 2vw, 14px); }
.g1-numopt-sel { box-shadow: 0 0 0 3px #FF4F28, 0 4px 12px rgba(255,79,40,0.25) !important; }
.g1-mexp { background: #FFFFFF; border: none; border-radius: 14px; padding: clamp(8px, 1.8vw, 14px) clamp(12px, 2.6vw, 20px); cursor: pointer; box-shadow: inset 0 0 0 2px rgba(58,53,48,0.1); transition: transform 0.15s ease, box-shadow 0.2s ease; }
.g1-mexp:not(:disabled):hover { transform: translateY(-2px); }
.g1-mexp:disabled { cursor: default; }
.g1-mexp-ok { box-shadow: inset 0 0 0 2px #1F7A4D, 0 4px 12px rgba(31,122,77,0.18); background: #E3F0E8; }

/* === Dars12 — TIMSOH-BELGI (> < =) — Dars04 KIT CSS, baytma-bayt === */
.d4-sign { font-family: 'Manrope', sans-serif; font-weight: 800; line-height: 1; color: #FF4F28; font-size: clamp(38px, 8vw, 58px); display: inline-flex; align-items: center; justify-content: center; }
.d4-sign-big { font-size: clamp(52px, 12vw, 86px); }
.d4-croc svg { width: 1.55em; height: 1.18em; overflow: visible; filter: drop-shadow(0 3px 6px rgba(58,53,48,0.22)); }
.d4-croc-anim { animation: d4crocopen 0.5s cubic-bezier(0.34,1.5,0.64,1) both, d4crocbreathe 2.8s ease-in-out 0.55s infinite; transform-origin: center; }
@keyframes d4crocopen { 0% { opacity: 0; transform: scaleX(0.5); } 100% { opacity: 1; transform: scaleX(1); } }
@keyframes d4crocbreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
.d4-numtile { font-family: 'Manrope', sans-serif; font-weight: 800; color: #0E0E10; font-size: clamp(30px, 6.6vw, 46px); line-height: 1; display: inline-flex; align-items: center; justify-content: center; min-width: 1.1em; }

/* === Dars13 — REKENREK (munchoq tasmasi) — YANGI MEXANIKA === */
.g1-rk { display: inline-flex; flex-direction: column; gap: clamp(9px, 2.2vw, 15px); padding: clamp(12px, 2.8vw, 18px) clamp(15px, 3.4vw, 24px); background: linear-gradient(100deg, #D9AB73 0%, #C0904F 40%, #A8763E 100%); border-radius: 18px; border: 2px solid #7E5429; box-shadow: inset 0 3px 4px rgba(255,255,255,0.34), inset 0 -4px 6px rgba(0,0,0,0.24), inset 3px 0 5px rgba(255,255,255,0.12), 0 9px 22px -8px rgba(58,53,48,0.4); }
.g1-rk-row { position: relative; display: flex; justify-content: space-between; align-items: center; min-width: clamp(170px, 44vw, 290px); max-width: 100%; height: clamp(24px, 5vw, 32px); }
.g1-rk-wire { position: absolute; left: -3px; right: -3px; top: 50%; height: 4px; background: linear-gradient(#9A8463, #6E5436 45%, #4E3A22); transform: translateY(-50%); border-radius: 3px; box-shadow: 0 1px 0 rgba(255,255,255,0.18), inset 0 1px 1px rgba(255,255,255,0.25); }
.g1-rk-grp { position: relative; z-index: 1; display: inline-flex; gap: clamp(1px, 0.5vw, 3px); }
.g1-rk-bead { position: relative; width: clamp(18px, 4.3vw, 27px); height: clamp(18px, 4.3vw, 27px); border-radius: 50%; box-shadow: 0 3px 5px rgba(58,53,48,0.34), inset 0 -3px 4px rgba(0,0,0,0.26), inset 0 2px 3px rgba(255,255,255,0.4); }
.g1-rk-bead::after { content: ""; position: absolute; top: 13%; left: 19%; width: 40%; height: 32%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 75%); pointer-events: none; }
.g1-rk-red { background: radial-gradient(circle at 36% 30%, #FBA388 0%, #EC6040 38%, #C7401F 78%, #A8331A 100%); }
.g1-rk-white { background: radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F4EFE5 48%, #DCD2C0 82%, #C7BBA4 100%); }
.g1-rk-gap { margin-left: clamp(7px, 1.8vw, 13px); }
.g1-rk-bslide { animation: g1rkbead 0.62s cubic-bezier(0.34, 1.56, 0.5, 1) both; }
@keyframes g1rkbead {
  0%   { transform: translateX(44px) scale(0.8) rotate(7deg);                  opacity: 0; }
  42%  { transform: translateX(-6px) scaleX(1.2) scaleY(0.84) rotate(-4deg);   opacity: 1; }
  60%  { transform: translateX(4px)  scaleX(0.9) scaleY(1.14) rotate(2.5deg); }
  76%  { transform: translateX(-2px) scaleX(1.07) scaleY(0.96) rotate(-1deg); }
  90%  { transform: translateX(1px)  scale(1.02) rotate(0.5deg); }
  100% { transform: translateX(0)    scale(1) rotate(0); }
}
/* ramka zarbadan yengil silkinadi (jonli) */
.g1-rk-shake { animation: g1rkshake 0.5s ease-out 0.18s both; }
@keyframes g1rkshake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-2px) rotate(-0.5deg); }
  55% { transform: translateX(2px) rotate(0.5deg); }
  80% { transform: translateX(-1px) rotate(0); }
}
@media (prefers-reduced-motion: reduce) { .g1-rk-bslide, .g1-rk-shake { animation: none; } }

/* === Dars15 — BOZOR sahnasi jonli harakatlari === */
.g1-bz-swing { transform-box: view-box; transform-origin: 330px 28px; animation: g1bzswing 3.6s ease-in-out infinite; }
@keyframes g1bzswing { 0%, 100% { transform: rotate(-2.4deg); } 50% { transform: rotate(2.4deg); } }
.g1-bz-sway { transform-box: view-box; transform-origin: 200px 44px; animation: g1bzsway 4.4s ease-in-out infinite; }
@keyframes g1bzsway { 0%, 100% { transform: translateY(0) rotate(-0.7deg); } 50% { transform: translateY(1.6px) rotate(0.7deg); } }
.g1-bz-fringe { transform-box: view-box; transform-origin: 200px 28px; animation: g1bzfringe 3.1s ease-in-out infinite; }
@keyframes g1bzfringe { 0%, 100% { transform: skewX(0deg) translateY(0); } 50% { transform: skewX(1.5deg) translateY(0.9px); } }
@media (prefers-reduced-motion: reduce) { .g1-bz-swing, .g1-bz-sway, .g1-bz-fringe { animation: none; } }

/* === Dars15 — OLMA / yashik (bozor sanoq metodi) === */
.g1-apple { display: inline-flex; width: clamp(20px, 4.6vw, 30px); }
.g1-apple svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 2px rgba(58,53,48,0.18)); }
.g1-crate { position: relative; display: inline-flex; flex-direction: column; align-items: center; padding: clamp(6px, 1.6vw, 9px) clamp(8px, 2vw, 12px) clamp(16px, 3.4vw, 22px); background: linear-gradient(#CDA068, #A8763E); border-radius: 9px; border: 2px solid #855A2F; box-shadow: inset 0 2px 3px rgba(255,255,255,0.28), inset 0 -3px 5px rgba(0,0,0,0.18), 0 5px 12px -5px rgba(58,53,48,0.32); }
.g1-crate-apples { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(1px, 0.5vw, 3px); }
.g1-crate-label { position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); font-weight: 800; font-size: clamp(11px, 2.2vw, 15px); color: #FBEFD8; letter-spacing: 0.04em; }
.g1-fviz { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px, 2.6vw, 20px); flex-wrap: wrap; }
.g1-fviz-ones { display: inline-flex; flex-wrap: wrap; align-items: flex-end; gap: clamp(2px, 0.8vw, 5px); max-width: clamp(120px, 34vw, 210px); }
.g1-fviz-one { display: inline-flex; }
.g1-fviz-plus { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 4vw, 30px); color: #A7A6A2; align-self: center; }
.g1-fviz-pop .g1-fviz-one { animation: g1fpop 0.42s cubic-bezier(0.34, 1.5, 0.6, 1) both; }
@keyframes g1fpop { 0% { transform: translateY(-16px) scale(0.6); opacity: 0; } 60% { transform: translateY(2px) scale(1.1); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) { .g1-fviz-pop .g1-fviz-one { animation: none; } }

/* ============================================================ */
/* === D2 (2-sinf Dars01) — «KEMA ICHIDA»: yuk bo'limi + MIKROGRAVITATSIYA + realistik hardware === */
/* Barcha harakat = suzish/aylanish/magnit-dok. Tortishish-tushish YO'Q. reduced-motion -> statik. */
/* ============================================================ */

/* YUK BO'LIMI interyeri — SceneBg-texnika: aspect-ratio 400/230 + container-type:size,
   fon svg preserveAspectRatio="xMidYMax meet" — fon va figuralar BIRGA miqyoslanadi. */
.d2-scene { position: relative; width: 100%; min-height: clamp(200px, 42vw, 280px); container-type: size; border-radius: 14px; overflow: hidden; background: #E3D9C4; }
.d2-scene-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.d2-scene-bit { position: absolute; right: 3cqw; bottom: 8cqh; height: 42cqh; z-index: 2; display: flex; align-items: flex-end; animation: d2hover 6.5s ease-in-out infinite; }
.d2-scene-bit .g1-cast-fig { height: 100%; }
.d2-scene-bit .g1-char { height: 100%; width: auto; }
.d2-bit-cheer { animation: d2hover 6.5s ease-in-out infinite; }
/* Bit vaznsizlikda suzadi (yuqori-past + yengil aylanish) */
@keyframes d2hover { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-4%) rotate(1.5deg); } }
@keyframes d2gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.3%); } }
@keyframes d2signflip { 0%, 42% { transform: rotate(0deg); } 50%, 92% { transform: rotate(180deg); } 100% { transform: rotate(360deg); } }
@keyframes d2warpstreak { 0% { transform: translateX(60%) scaleX(0.3); opacity: 0; } 16% { opacity: 0.9; } 100% { transform: translateX(-160%) scaleX(1); opacity: 0; } }
@keyframes d2comet { 0% { transform: translate(70%, -20%); opacity: 0; } 12% { opacity: 1; } 100% { transform: translate(-170%, 60%); opacity: 0; } }
@keyframes d2warpglow { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.8; } }
@keyframes d2trackfly { 0%, 10% { left: 28%; } 100% { left: 68%; } }
@keyframes d2marsfly { 0% { left: -16%; opacity: 0; } 14% { opacity: 1; } 100% { left: 34%; opacity: 1; } }
@keyframes d2gentle2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.2%); } }
@keyframes d2depart { 0% { transform: translate(118px, 118px); opacity: 0; } 12% { transform: translate(118px, 118px); opacity: 1; } 86% { transform: translate(-120px, 118px); opacity: 1; } 100% { transform: translate(-196px, 118px); opacity: 0; } }

/* ambient: illyuminator yulduzlari miltillashi + neon + kasseta LED + shift porlashi */
.d2-star { animation: d2tw 2.8s ease-in-out infinite; }
@keyframes d2tw { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.d2-neon { animation: d2neon 2.2s ease-in-out infinite; }
@keyframes d2neon { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.d2-casslight { animation: d2neon 1.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.d2-ceilglow { animation: d2neon 4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .d2-star, .d2-neon, .d2-casslight, .d2-ceilglow, .d2-scene-bit, .d2-bit-cheer { animation: none; } }

/* MIKROGRAVITATSIYA — universal suzish: sekin yuqori-past + doimiy yengil aylanish (inersiya). */
.d2-float { animation: d2float 9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.d2-float-b { animation-duration: 11s; animation-delay: -3s; }
@keyframes d2float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
/* magnit-dok: buyum yondan suzib kelib ohista joylashadi (ease-out, tushish YO'Q) */
.d2-dock { animation: d2dockL 0.7s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-dock-r { animation-name: d2dockR; }
@keyframes d2dockL { 0% { transform: translateX(-26px) rotate(-10deg); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0) rotate(0); opacity: 1; } }
@keyframes d2dockR { 0% { transform: translateX(26px) rotate(10deg); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0) rotate(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d2-float, .d2-float-b, .d2-dock, .d2-dock-r { animation: none; } }

/* suzuvchi chang-zarralar (har ekranda ambient) */
.d2-motes { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.d2-mote { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle at 40% 40%, rgba(143,224,244,0.5), rgba(143,224,244,0)); animation: d2mote 22s linear infinite; }
.d2-mote:nth-child(1) { left: 12%; top: 20%; } .d2-mote:nth-child(2) { left: 30%; top: 70%; width: 4px; height: 4px; }
.d2-mote:nth-child(3) { left: 52%; top: 30%; } .d2-mote:nth-child(4) { left: 68%; top: 62%; width: 6px; height: 6px; }
.d2-mote:nth-child(5) { left: 82%; top: 24%; } .d2-mote:nth-child(6) { left: 44%; top: 84%; width: 4px; height: 4px; }
.d2-mote:nth-child(7) { left: 90%; top: 50%; } .d2-mote:nth-child(8) { left: 8%; top: 56%; width: 6px; height: 6px; }
@keyframes d2mote { 0% { transform: translate(0, 0); opacity: 0; } 15% { opacity: 0.7; } 85% { opacity: 0.7; } 100% { transform: translate(22px, -30px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .d2-mote { animation: none; opacity: 0.4; } }

/* hook (s0) — KONTEYNER markazidan burst -> inersiya bilan suzish; --r butun davomida saqlanadi.
   OUTER (.d2-hbatt): pozitsiya (left/top) + burst (markazdan --dx/--dy vektor bo'ylab, rotate(--r)).
   INNER (.d2-hbatt-in): doimiy idle drift+spin (svg root'da EMAS — HTML o'rovchida). */
.d2-hbatt { position: absolute; width: 5.6cqw; z-index: 3; }
.d2-hbatt-in { display: inline-block; width: 100%; transform-origin: center; }
.d2-hbatt-in .d2-battsvg, .d2-hbatt-in .d2-casssvg { width: 100%; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45)); }
/* burst: markazdan (translate(-dx,-dy)) o'z joyiga, sekin ease-out (inersiya); rotate(--r) doim saqlanadi */
.d2-hbatt-burst { animation: d2burst 1.15s cubic-bezier(0.16, 0.75, 0.28, 1) both; }
@keyframes d2burst {
  0%   { transform: translate(calc(var(--dx, 0px) * -1), calc(var(--dy, 0px) * -1)) rotate(var(--r, 0deg)) scale(0.45); opacity: 0; }
  28%  { opacity: 1; }
  100% { transform: translate(0, 0) rotate(var(--r, 0deg)) scale(1); opacity: 1; }
}
/* idle: parallaks tezlikda suzish (Y) + sekin spin — inner wrapper, base --r bilan urishmaydi */
.d2-hbatt-in { animation: d2floatspin 9s ease-in-out infinite; }
@keyframes d2floatspin { 0%, 100% { transform: translateY(0) rotate(-7deg); } 50% { transform: translateY(-7px) rotate(7deg); } }
/* yig'ilish: markazga suzib kelib magnit qulf (green snap glow); --r -> 0 */
.d2-hbatt-latch { transition: left 1s cubic-bezier(0.22, 0.9, 0.3, 1), top 1s cubic-bezier(0.22, 0.9, 0.3, 1); animation: d2latch 0.6s ease-out 0.9s both; }
.d2-hbatt-latch .d2-hbatt-in { animation: none; }
@keyframes d2latch { 0% { filter: drop-shadow(0 0 0 rgba(110,242,155,0)); } 45% { filter: drop-shadow(0 0 8px rgba(110,242,155,0.95)); } 100% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45)); } }
.d2-hcass { position: absolute; left: 52%; top: 42%; width: 12cqw; z-index: 4; filter: drop-shadow(0 3px 7px rgba(0,0,0,0.55)); }
/* konteyner (qopqog'i ochiladi, batareyalar shundan otiladi) */
.d2-hbox { position: absolute; left: 48%; top: 40%; width: 12cqw; height: 10cqh; z-index: 2; transition: opacity 0.5s ease; }
.d2-hbox i { position: absolute; left: 0; right: 0; border-radius: 2px; }
.d2-hbox-body { bottom: 0; height: 62%; background: linear-gradient(#3A4763, #1E273E); box-shadow: inset 0 0 0 1.5px #55697C; }
.d2-hbox-lid { top: 0; height: 34%; background: linear-gradient(#55697C, #3A4763); box-shadow: inset 0 0 0 1.5px #7E93A8; transform-origin: left bottom; animation: d2lidpop 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) both; }
@keyframes d2lidpop { 0% { transform: rotate(0); } 100% { transform: rotate(-46deg); } }
.d2-hbox-empty { opacity: 0.55; }
@media (prefers-reduced-motion: reduce) {
  .d2-hbatt-burst, .d2-hbatt-in, .d2-hbatt-latch, .d2-hbox-lid { animation: none; }
  .d2-hbatt-latch { transition: none; }
  .d2-hbatt-burst { transform: rotate(var(--r, 0deg)); }
}

/* s1 (v11) — PackTenViz: 10 batareya suzadi -> to'g'ri javobda markazga suzib BITTA
   kassetaga joylashadi (magnit-latch porlashi + LED). Mavhum "element" CSS olib tashlandi. */
.d2-packviz { position: relative; width: 100%; max-width: clamp(250px, 62vw, 380px); height: clamp(110px, 24vw, 170px); margin: 0 auto; }
.d2-packb { position: absolute; width: clamp(14px, 3vw, 20px); transform: rotate(var(--r, 0deg)); }
.d2-packb .d2-battsvg { width: 100%; height: auto; filter: drop-shadow(0 2px 3px rgba(58,53,48,0.3)); }
/* javobgacha: sekin drift + spin (mikrogravitatsiya, s0 lug'ati) */
.d2-packb-in { display: inline-block; animation: d2floatspin 9s ease-in-out infinite; transform-origin: center; }
/* to'g'ri javobda: markazga suzib kirish (left/top + kichrayish), so'ng yo'qoladi */
.d2-packin { animation: d2packin 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) forwards; }
.d2-packin .d2-packb-in { animation: none; }
@keyframes d2packin {
  55%  { opacity: 1; }
  100% { left: 48%; top: 42%; transform: rotate(0deg) scale(0.45); opacity: 0; }
}
/* yig'ilgan kasseta: markazda pop + magnit-latch porlashi (d2latch), keyin tinch suzish */
.d2-packcass { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.d2-packcass-pop { display: inline-block; opacity: 0; animation: d2packpop 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) 0.75s forwards, d2latch 0.6s ease-out 0.85s both; }
@keyframes d2packpop { 0% { opacity: 0; transform: scale(0.4); } 100% { opacity: 1; transform: scale(1); } }
.d2-packcass-idle { display: inline-block; animation: d2float 9s ease-in-out 1.4s infinite; }
@media (prefers-reduced-motion: reduce) {
  .d2-packb-in { animation: none; }
  .d2-packin { animation: none; opacity: 0; }
  .d2-packcass-pop { animation: none; opacity: 1; }
  .d2-packcass-idle { animation: none; }
}

/* BATAREYA / KASSETA o'lchamlari */
.d2-battsvg { width: clamp(14px, 3vw, 20px); height: auto; display: inline-block; }
.d2-battsvg-slot { width: clamp(12px, 2.6vw, 17px); }
.d2-battsvg-btn { width: clamp(12px, 2.6vw, 17px); }
.d2-casssvg { width: clamp(36px, 8vw, 56px); height: auto; display: inline-block; }
.d2-casssvg-big { width: clamp(56px, 13vw, 86px); }
.d2-casssvg-btn { width: clamp(24px, 5vw, 34px); }
.d2-mini { width: clamp(16px, 3.4vw, 24px); height: auto; display: inline-block; }

/* kasseta+batareya vizuali: o'nliklar guruhi chapda, birliklar o'ngda */
.d2-bsviz { display: flex; align-items: flex-end; justify-content: center; gap: clamp(14px, 3.4vw, 26px); flex-wrap: wrap; min-height: clamp(56px, 12vw, 84px); }
.d2-bs-grp { display: inline-flex; align-items: flex-end; gap: clamp(4px, 1vw, 8px); flex-wrap: wrap; justify-content: center; max-width: clamp(190px, 48vw, 330px); }
.d2-bs-ones { gap: clamp(2px, 0.7vw, 5px); }
.d2-bs-empty { font-weight: 800; font-size: clamp(30px, 6.5vw, 44px); color: #B6B2AB; }
.d2-bsviz-sm .d2-casssvg { width: clamp(28px, 6vw, 42px); }
.d2-bsviz-sm .d2-battsvg { width: clamp(11px, 2.4vw, 16px); }

/* katta son-displey (pult ekranlari) */
.d2-bignum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(38px, 8vw, 58px); line-height: 1; color: #0E0E10; }
.d2-bignum-accent { color: #1F7A4D; }

/* s2 — kassetaga joylash maydoni (yuk bo'limi panel) */
.d2-field { position: relative; width: 100%; min-height: clamp(200px, 42vw, 280px); background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 14px; box-shadow: inset 0 0 0 2px #D9CCB2; overflow: hidden; }
/* suzuvchi debris — xaotik mikrogravitatsiya (batareya/sim/lampochka) */
.d2-debris { position: absolute; inset: 0; pointer-events: none; }
.d2-debris-el { position: absolute; line-height: 0; filter: drop-shadow(0 2px 4px rgba(58,53,48,0.22)); animation-name: d2debris; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
@keyframes d2debris { 0% { transform: translate(0,0) rotate(0deg); } 25% { transform: translate(14px,-11px) rotate(48deg); } 50% { transform: translate(-6px,10px) rotate(-24deg); } 75% { transform: translate(9px,6px) rotate(30deg); } 100% { transform: translate(0,0) rotate(0deg); } }
@media (prefers-reduced-motion: reduce) { .d2-debris-el { animation: none; } }
.d2-nlcue-slide { animation: d2nlcueslide 3.4s ease-in-out infinite; }
.d2-nlcue-hand { animation: d2nlcuebob 1.1s ease-in-out infinite; }
.d2-nlcue-ring { transform-box: fill-box; transform-origin: center; animation: d2nlcuering 1.1s ease-in-out infinite; }
@keyframes d2nlcueslide { 0%, 100% { transform: translateX(54px); } 50% { transform: translateX(214px); } }
@keyframes d2nlcuebob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes d2nlcuering { 0% { opacity: 0.85; transform: scale(0.7); } 70% { opacity: 0; transform: scale(1.9); } 100% { opacity: 0; transform: scale(1.9); } }
@media (prefers-reduced-motion: reduce) { .d2-nlcue-slide { animation: none; transform: translateX(134px); } .d2-nlcue-hand, .d2-nlcue-ring { animation: none; } }
.d2-fbatt { position: absolute; background: transparent; border: none; padding: 8px; cursor: pointer; transform: rotate(var(--r, 0deg)); animation: d2driftin 0.6s ease-out both, d2float 10s ease-in-out 0.6s infinite; }
.d2-fbatt .d2-battsvg { width: clamp(17px, 3.6vw, 24px); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.d2-fbatt:hover:not(:disabled) { filter: drop-shadow(0 0 6px rgba(143,224,244,0.8)); }
.d2-fbatt:disabled { cursor: default; }
@keyframes d2driftin { 0% { opacity: 0; transform: scale(0.6) rotate(var(--r, 0deg)); } 100% { opacity: 1; transform: scale(1) rotate(var(--r, 0deg)); } }
@media (prefers-reduced-motion: reduce) { .d2-fbatt { animation: none; } }
.d2-casszone { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: clamp(130px, 33vw, 195px); min-height: clamp(104px, 23vw, 156px); border: 2.5px dashed rgba(58,71,99,0.45); border-radius: 16px; background: rgba(246,240,226,0.86); box-shadow: 0 6px 18px -8px rgba(58,53,48,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: clamp(8px, 1.8vw, 12px); transition: border-color 0.25s, background 0.25s, box-shadow 0.25s; z-index: 2; }
.d2-casszone-tied { border-style: solid; border-color: #1F7A4D; background: rgba(227,240,232,0.92); box-shadow: 0 0 16px -6px rgba(31,122,77,0.45); }
.d2-slotgrid { display: grid; grid-template-columns: repeat(5, auto); gap: clamp(3px, 0.8vw, 6px); justify-items: center; }
.d2-slot { width: clamp(18px, 4vw, 26px); height: clamp(26px, 5.6vw, 36px); border-radius: 6px; box-shadow: inset 0 0 0 1.5px rgba(58,71,99,0.3); display: flex; align-items: center; justify-content: center; }
.d2-slot-full { box-shadow: inset 0 0 0 1.5px #1F7A4D; background: rgba(31,122,77,0.12); }
.d2-slot .g1-pop-in { animation: d2dockR 0.55s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-count { font-weight: 800; font-size: clamp(13px, 1.9vw, 16px); color: #5A6B88; }
.d2-count-ok { color: #1F7A4D; }

/* manba-tugmalar (s3/s4/s8): kasseta+ / batareya+ */
.d2-srcrow { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; flex-wrap: wrap; }
.d2-srcbtn { display: inline-flex; align-items: center; gap: clamp(8px, 1.8vw, 12px); font-size: clamp(15px, 2.2vw, 19px) !important; padding: clamp(10px, 2vw, 15px) clamp(14px, 2.8vw, 22px) !important; }
.d2-src-wait { opacity: 0.45; }
.d2-srcbtn:disabled { cursor: default; }

/* yuklash pulti (brushed-metal panel) — vizual + displey ichida */
.d2-console { width: 100%; background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 16px; box-shadow: inset 0 0 0 2px #D9CCB2, inset 0 2px 6px rgba(255,255,255,0.5), 0 8px 22px -10px rgba(58,53,48,0.25); padding: clamp(12px, 2.6vw, 20px); display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2.2vw, 16px); position: relative; }
.d2-console::before { content: ''; position: absolute; top: 7px; left: 10px; right: 10px; height: 4px; border-radius: 2px; background: repeating-linear-gradient(90deg, #F0A81E 0 8px, #D9CCB2 8px 14px); opacity: 0.5; }
.d2-console-sm { padding: clamp(10px, 2vw, 14px); }
.d2-console .d2-bignum { color: #2A3550; }
.d2-console .d2-bignum-accent { color: #1F7A4D; }
.d2-console .d2-bs-empty { color: #A79E88; }
.d2-console .g1-anspop-num { color: #1F7A4D; }
.d2-console .g1-anspop-eq { color: #5A6B88; }

/* s5 — neon-displey kartasi (34 <-> 30 + 4), 7-seg-ish porlash */
.d2-cardbtn { background: transparent; border: none; padding: 6px; cursor: pointer; }
.d2-cardbtn:disabled { cursor: default; }
.d2-card { display: inline-flex; align-items: center; justify-content: center; background: #0C1424; border-radius: 18px; box-shadow: inset 0 0 0 2px #2C3A60, 0 8px 22px -6px rgba(16,24,44,0.55); font-family: 'JetBrains Mono', monospace; font-weight: 800; letter-spacing: 0.06em; font-size: clamp(44px, 10vw, 68px); line-height: 1; color: #5BD6F2; text-shadow: 0 0 14px rgba(91,214,242,0.7); padding: clamp(12px, 2.6vw, 20px) clamp(20px, 4.4vw, 34px); }
.d2-card-tens { color: #FF8A6E; text-shadow: 0 0 14px rgba(255,138,110,0.6); }
.d2-card-ones { color: #6EF29B; text-shadow: 0 0 14px rgba(110,242,155,0.6); }
.d2-splitrow { display: inline-flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.d2-plus { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px, 6vw, 44px); color: #9FD8EA; }
.d2-tap-pulse { animation: d2tappulse 1.8s ease-in-out infinite; }
@keyframes d2tappulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.d2-eq { font-weight: 800; font-size: clamp(20px, 4.4vw, 32px); color: #1F7A4D; }
/* s15 QOIDA recap — yakunda qoidani qayta ko'rsatadi (ko'rinadigan qonun qatori) */
.d2-recap { margin-top: clamp(8px, 1.6vw, 12px); padding: clamp(7px, 1.4vw, 10px) clamp(12px, 2.2vw, 16px); border-radius: 12px; background: #FFFFFF; box-shadow: inset 0 0 0 2px rgba(31,122,77,0.35); color: #1F7A4D; font-weight: 800; font-size: clamp(12px, 1.8vw, 15px); text-align: center; }
/* FOYDALI matematik ma'lumot/qoida kartasi */
.d2-infonote { display: flex; align-items: flex-start; gap: clamp(8px, 1.8vw, 12px); background: #EAF6FB; border-radius: 14px; padding: clamp(9px, 1.8vw, 13px) clamp(12px, 2.2vw, 16px); box-shadow: inset 3px 0 0 #019ACB; }
.d2-infonote-badge { flex-shrink: 0; font-size: clamp(9px, 1.4vw, 11px); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #017CA3; background: #FFFFFF; border-radius: 99px; padding: 3px 10px; margin-top: 2px; }
.d2-infonote-txt { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(13px, 1.9vw, 15px); line-height: 1.4; color: #0E0E10; }
/* s5 lyuk — noto'g'ri kodda silkinish */
.d2-hatchwrap { line-height: 0; }
.d2-hatch-shake { animation: d2hshake 0.45s ease; }
@keyframes d2hshake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
@media (prefers-reduced-motion: reduce) { .d2-hatch-shake { animation: none; } }
/* s0 «video» — Yer globusi: bulutlar sekin aylanadi, globus ohista suzadi (kema uzoqlashadi) */
.d2-earth { animation: d2earthdrift 26s ease-in-out infinite alternate; }
.d2-earth-clouds { transform-origin: 64px 46px; animation: d2earthspin 46s linear infinite; }
@keyframes d2earthdrift { from { transform: translate(0px, 0px); } to { transform: translate(-5px, 4px); } }
@keyframes d2earthspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* s15 warp — Yer uzoqlashadi (kichrayadi + chetga suzadi), kema uchmoqda */
.d2-earth-recede { transform-origin: 64px 46px; animation: d2earthrecede 5.5s ease-in 0.4s forwards; }
@keyframes d2earthrecede { 0% { transform: scale(1) translate(0px, 0px); opacity: 1; } 100% { transform: scale(0.28) translate(34px, -22px); opacity: 0.85; } }
@media (prefers-reduced-motion: reduce) { .d2-earth, .d2-earth-clouds, .d2-earth-recede { animation: none; } }
/* s5 — lyuk oldidagi KOD TABLOSI (o'rnatilgan panel) */
.d2-hatchtablo { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); width: min(290px, 88%); background: #F6F0E2; border-radius: 14px; box-shadow: inset 0 0 0 2px #D9CCB2, 0 5px 14px -7px rgba(58,53,48,0.22); padding: clamp(8px, 1.8vw, 12px) clamp(12px, 2.2vw, 16px); margin-top: clamp(-10px, -1.6vw, -6px); }
@media (prefers-reduced-motion: reduce) { .d2-tap-pulse { animation: none; } }

/* s6 — lyuk-kod panellari (45 va 54) — v10 ANIQLIK: raqam <-> yuk bog'i ko'rinadi.
   Panelda raqobatlashuvchi harakat YO'Q (lampa statik, faqat reveal + pop). */
.d2-panels { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; align-items: stretch; flex-wrap: wrap; }
.d2-panel { position: relative; flex: 1 1 150px; max-width: 340px; background: #FFFFFF; border-radius: 14px; box-shadow: 0 8px 22px -6px rgba(58,53,48,0.14); padding: clamp(12px, 2.4vw, 18px); display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); opacity: 0.22; transform: translateY(6px); transition: opacity 0.5s ease, transform 0.5s ease; }
.d2-panel.on { opacity: 1; transform: none; }
.d2-panel-num { display: inline-flex; gap: 2px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(36px, 7.5vw, 54px); line-height: 1; color: #0E0E10; }
.d2-panel-num span { transition: color 0.3s ease; }
.d2-digit-tens { color: #FF4F28; }
.d2-digit-ones { color: #019ACB; }
.d2-lamp { width: clamp(12px, 2.6vw, 17px); height: clamp(12px, 2.6vw, 17px); border-radius: 50%; background: #C8CDD4; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.15); }
.d2-lamp-still-g { background: #6EF29B; box-shadow: 0 0 8px rgba(110,242,155,0.7); }
.d2-lamp-still-y { background: #FFC23C; box-shadow: 0 0 8px rgba(255,194,60,0.7); }
.d2-hpanel { min-height: clamp(190px, 42vw, 280px); justify-content: flex-start; }
.d2-hwait { font-weight: 800; font-size: clamp(34px, 7vw, 52px); color: #B6B2AB; margin: auto 0; }
/* ikki ustun: raqam + belgi + ulagich + yuk-guruh (bog' shubhasiz ko'rinsin) */
.d2-hcols { display: flex; gap: clamp(10px, 2.4vw, 18px); align-items: stretch; justify-content: center; width: 100%; }
.d2-hcol { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: clamp(3px, 0.8vw, 6px); border-radius: 12px; padding: clamp(6px, 1.4vw, 10px) clamp(4px, 1vw, 8px); }
.d2-hcol-tens { background: #EAF6FB; box-shadow: inset 0 0 0 1.5px rgba(1,154,203,0.35); }
.d2-hcol-ones { background: #FFF4E0; box-shadow: inset 0 0 0 1.5px rgba(199,119,0,0.3); }
.d2-hdigit { font-weight: 800; font-size: clamp(40px, 9vw, 62px); line-height: 1; letter-spacing: 0.04em; }
.d2-hcol-tens .d2-hdigit { color: #017CA3; }
.d2-hcol-ones .d2-hdigit { color: #C77700; }
.d2-hicon { display: inline-flex; opacity: 0.9; }
.d2-hline { width: 2px; height: clamp(10px, 2.2vw, 16px); border-radius: 1px; }
.d2-hcol-tens .d2-hline { background: rgba(1,154,203,0.55); }
.d2-hcol-ones .d2-hline { background: rgba(199,119,0,0.5); }
.d2-hcargo { display: flex; flex-wrap: wrap; gap: clamp(2px, 0.6vw, 5px); justify-content: center; align-items: flex-end; min-height: clamp(38px, 8.5vw, 58px); }
.d2-hgc { width: clamp(20px, 4.4vw, 30px); height: auto; display: inline-block; }
.d2-hgb { width: clamp(10px, 2.2vw, 15px); height: auto; display: inline-block; }
/* 3-qadam: 4 va 5 KO'RINIB joy almashadi (yoy bo'ylab, bir marta, sekin) */
.d2-swap { position: relative; display: flex; align-items: center; justify-content: center; gap: clamp(34px, 9vw, 60px); min-height: clamp(40px, 8.5vw, 58px); }
.d2-swapchip { display: inline-flex; align-items: center; justify-content: center; width: clamp(34px, 7.4vw, 50px); height: clamp(34px, 7.4vw, 50px); border-radius: 12px; font-weight: 800; font-size: clamp(22px, 4.8vw, 32px); background: #FFFFFF; box-shadow: 0 6px 16px -6px rgba(58,53,48,0.3); }
.d2-swapchip-l { color: #017CA3; animation: d2swapL 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards; }
.d2-swapchip-r { color: #C77700; animation: d2swapR 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards; }
.d2-swaparrow { font-weight: 800; font-size: clamp(18px, 4vw, 26px); color: #A7A6A2; }
@keyframes d2swapL { 0% { transform: translate(0, 0); } 50% { transform: translate(calc(50% + clamp(26px, 6.5vw, 43px)), -18px); } 100% { transform: translateX(calc(100% + clamp(52px, 13vw, 86px))); } }
@keyframes d2swapR { 0% { transform: translate(0, 0); } 50% { transform: translate(calc(-50% - clamp(26px, 6.5vw, 43px)), 18px); } 100% { transform: translateX(calc(-100% - clamp(52px, 13vw, 86px))); } }
.d2-panel-tags { display: inline-flex; gap: clamp(8px, 2vw, 14px); }
.d2-panel-tags i { font-style: normal; font-weight: 700; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.08em; text-transform: uppercase; border-radius: 99px; padding: 3px 9px; }
.d2-tag-tens { background: #FFE8E1; color: #D63E18; }
.d2-tag-ones { background: #EAF6FB; color: #017CA3; }
@media (prefers-reduced-motion: reduce) { .d2-panel { transition: none; } .d2-swapchip-l, .d2-swapchip-r { animation: none; } }

/* s10 — bort kodi 63 (7-seg tablo) */
.d2-claim { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8vw, 12px); }
.d2-board { display: inline-flex; gap: clamp(3px, 0.8vw, 6px); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; font-weight: 800; font-size: clamp(44px, 10vw, 68px); line-height: 1; background: #0C1424; color: #E8F4FF; border-radius: 14px; padding: clamp(8px, 1.8vw, 14px) clamp(18px, 4vw, 30px); box-shadow: inset 0 0 0 2px #2C3A60, 0 8px 22px -6px rgba(16,24,44,0.5); }
.d2-board .d2-digit-tens { color: #FF8A6E; text-shadow: 0 0 10px rgba(255,138,110,0.5); }
.d2-board .d2-digit-ones { color: #5BD6F2; text-shadow: 0 0 10px rgba(91,214,242,0.5); }
.d2-board span { transition: color 0.3s ease; }

/* s8 — build+check boshqaruvi */
.d2-buildrows { display: flex; gap: clamp(16px, 4vw, 32px); justify-content: center; flex-wrap: wrap; }
.d2-buildcol { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-collabel { font-weight: 700; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.1em; text-transform: uppercase; color: #5A6B88; }
.d2-pm { display: flex; gap: clamp(6px, 1.4vw, 10px); align-items: stretch; }

/* MC raqam-varianti */
.d2-mcnum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(21px, 4.4vw, 30px); line-height: 1; color: inherit; }
.d2-qlead { margin: 0 0 clamp(4px, 1vw, 8px); text-align: center; color: #A7A6A2; font-weight: 600; font-size: clamp(12px, 1.6vw, 14px); }

/* MASALA — magnit-rack + yuk xati */
.d2-rackwrap { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.6vw, 22px); flex-wrap: wrap; }
.d2-manifest { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 8px); background: #F3EBDA; border: 2px solid #D9CCB2; border-radius: 12px; padding: clamp(8px, 1.8vw, 13px) clamp(10px, 2.2vw, 16px); box-shadow: 0 6px 16px -8px rgba(58,53,48,0.28); }
.d2-manifest-title { font-weight: 800; font-size: clamp(10px, 1.4vw, 12px); letter-spacing: 0.1em; text-transform: uppercase; color: #1F7A4D; border-bottom: 1.5px dashed #D9CCB2; padding-bottom: 3px; }
.d2-manifest-row { display: inline-flex; align-items: center; gap: 7px; font-size: clamp(13px, 1.8vw, 16px); color: #2A3550; border-radius: 8px; padding: 2px 6px; }
.d2-manifest-row b { font-weight: 800; color: #5A6B88; }
/* v10: yuk-xati qatorlari KETMA-KET yonadi (audio bilan sinxron): avval "6", keyin "3" */
.d2-mrow-1 { animation: d2mrowhl 1.4s ease 1s; }
.d2-mrow-2 { animation: d2mrowhl 1.4s ease 4.2s; }
@keyframes d2mrowhl { 0%, 100% { background: transparent; } 35% { background: rgba(110,242,155,0.22); box-shadow: 0 0 10px -2px rgba(110,242,155,0.6); } }
@media (prefers-reduced-motion: reduce) { .d2-mrow-1, .d2-mrow-2 { animation: none; } }
/* magnit-rack: yuqorida magnit-bar, ostida suzuvchi yuk */
/* v10: "sirli uzun tayoq" (magnit-rack relsi) OLIB TASHLANDI — yuk endi ikki toza
   YORLIQLI guruhda: "6" chipli kassetalar + "3" chipli batareyalar; chip+guruh
   yuk-xati qatori bilan bir vaqtda ketma-ket porlaydi (tushunarli sekvensiya). */
.d2-cargogrps { display: flex; align-items: flex-end; justify-content: center; gap: clamp(14px, 3.4vw, 26px); flex-wrap: wrap; }
.d2-cgrp { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); border-radius: 14px; padding: clamp(8px, 1.8vw, 12px); }
.d2-cgrp-1 { background: rgba(91,214,242,0.08); box-shadow: inset 0 0 0 1.5px rgba(91,214,242,0.35); animation: d2grpglow 1.4s ease 1s; }
.d2-cgrp-2 { background: rgba(255,194,60,0.08); box-shadow: inset 0 0 0 1.5px rgba(255,194,60,0.35); animation: d2grpglow 1.4s ease 4.2s; }
@keyframes d2grpglow { 0%, 100% { transform: scale(1); } 35% { transform: scale(1.04); box-shadow: inset 0 0 0 2px rgba(110,242,155,0.8), 0 0 16px -2px rgba(110,242,155,0.6); } }
.d2-cgrp-chip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(24px, 5.2vw, 34px); height: clamp(24px, 5.2vw, 34px); border-radius: 99px; font-weight: 800; font-size: clamp(15px, 3vw, 21px); padding: 0 8px; }
.d2-cgrp-chip-c { background: #EAF6FB; color: #017CA3; box-shadow: inset 0 0 0 1.5px rgba(1,154,203,0.4); }
.d2-cgrp-chip-b { background: #FFF4E0; color: #C77700; box-shadow: inset 0 0 0 1.5px rgba(199,119,0,0.35); }
.d2-cgrp-items { display: flex; flex-wrap: wrap; gap: clamp(3px, 0.8vw, 6px); justify-content: center; align-items: flex-end; max-width: clamp(150px, 38vw, 250px); }
.d2-cgrp-cass { width: clamp(24px, 5.2vw, 36px); height: auto; display: inline-block; }
.d2-cgrp-batt { width: clamp(11px, 2.4vw, 16px); height: auto; display: inline-block; }
@media (prefers-reduced-motion: reduce) { .d2-cgrp-1, .d2-cgrp-2 { animation: none; } }

/* raketa + olov (faqat s11 fakt) */
.d2-rocketsvg { width: clamp(44px, 9.5vw, 66px); height: auto; display: inline-block; filter: drop-shadow(0 4px 8px rgba(16,24,44,0.4)); }
.d2-rocket-fact { width: clamp(34px, 7vw, 48px); }
.d2-flame { transform-box: fill-box; transform-origin: center top; animation: d2flick 0.5s ease-in-out infinite alternate; }
@keyframes d2flick { 0% { transform: scaleY(0.85) scaleX(0.95); } 100% { transform: scaleY(1.12) scaleX(1.05); } }
@media (prefers-reduced-motion: reduce) { .d2-flame { animation: none; } }

/* s11 fakt: teskari sanash */
.d2-factrocket { flex: 0 0 auto; display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-cd { display: inline-flex; flex-direction: column; gap: 2px; align-items: flex-end; }
.d2-cd i { font-style: normal; font-weight: 800; color: #019ACB; line-height: 1; }
.d2-cd i:nth-child(1) { font-size: clamp(16px, 3vw, 22px); animation: d2neon 1.8s ease-in-out infinite; }
.d2-cd i:nth-child(2) { font-size: clamp(13px, 2.4vw, 18px); opacity: 0.75; animation: d2neon 1.8s ease-in-out 0.6s infinite; }
.d2-cd i:nth-child(3) { font-size: clamp(11px, 2vw, 15px); opacity: 0.55; animation: d2neon 1.8s ease-in-out 1.2s infinite; }
@media (prefers-reduced-motion: reduce) { .d2-cd i { animation: none; } }

/* s15 — v10 UCHISH SEKVENSIYASI (3 takt, animation-delay zanjiri, holatsiz):
   1) zaryad (0-2.5s): kassetalar dvigatel slotlariga dok, indikator to'ladi;
   2) ot oldirish (~2.6s): korpus tebranadi + dvigatel porlashi;
   3) uchish (4s+): warp-chiziqlar + sayyora uzoqlashadi. reduced-motion -> statik. */
.d2-launchseq { position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d2-warp-svgwrap { position: relative; width: 100%; max-width: clamp(240px, 62vw, 380px); }
.d2-warp-svg { width: 100%; height: auto; border-radius: 14px; display: block; }
/* 2-takt: korpus tebranishi — dvigatel ot olgach boshlanadi (2.6s dan) */
.d2-hullvib { animation: d2hull 0.18s ease-in-out 2.6s infinite; }
@keyframes d2hull { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(0.6px, -0.4px); } 75% { transform: translate(-0.5px, 0.5px); } }
/* dvigatel porlashi (pastdan) — 2.6s da yonadi, so'ng lipillaydi */
.d2-engglow { position: absolute; left: 12%; right: 12%; bottom: -4px; height: clamp(10px, 2.2vw, 16px); border-radius: 99px; background: radial-gradient(ellipse at center, rgba(110,242,155,0.85), rgba(110,242,155,0)); opacity: 0; animation: d2glowon 1s ease 2.6s forwards, d2neon 1.6s ease-in-out 3.6s infinite; }
@keyframes d2glowon { from { opacity: 0; } to { opacity: 1; } }
/* 3-takt: warp-chiziqlar (delay inline 4s+), sayyora 4s dan uzoqlashadi */
.d2-streak { animation: d2warpstreak 1.3s ease-in infinite; opacity: 0; }
@keyframes d2warpstreak {
  0%   { transform: translateY(0) scaleY(1); opacity: 0.9; }
  60%  { transform: translateY(26px) scaleY(9); opacity: 1; }
  100% { transform: translateY(60px) scaleY(16); opacity: 0; }
}
.d2-planet-recede { animation: d2recede 4s ease-in 4s forwards; transform-box: fill-box; transform-origin: center; }
@keyframes d2recede { 0% { transform: scale(1); opacity: 0.95; } 100% { transform: scale(0.35); opacity: 0.35; } }
/* 1-takt: dvigatel slot-qatori — kassetalar chapdan suzib dok qiladi, indikator yashilga to'ladi */
.d2-engrow { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 16px); background: #EFE8D8; border-radius: 12px; box-shadow: inset 0 0 0 2px #D9CCB2; padding: clamp(6px, 1.4vw, 10px) clamp(10px, 2.2vw, 16px); }
.d2-engslots { display: inline-flex; gap: clamp(5px, 1.2vw, 8px); }
.d2-engslot { display: inline-flex; align-items: center; justify-content: center; width: clamp(26px, 5.6vw, 38px); height: clamp(34px, 7.4vw, 50px); border-radius: 8px; background: #F6F0E2; box-shadow: inset 0 0 0 1.5px #D9CCB2; overflow: hidden; }
.d2-engcass { display: inline-flex; animation: d2engdock 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) both; }
.d2-engcass-svg { width: clamp(18px, 4vw, 27px); height: auto; display: inline-block; }
@keyframes d2engdock { 0% { transform: translateX(-34px); opacity: 0; } 70% { opacity: 1; } 100% { transform: translateX(0); opacity: 1; } }
.d2-engbar { position: relative; width: clamp(60px, 14vw, 100px); height: clamp(8px, 1.8vw, 12px); border-radius: 99px; background: #EAE0CC; box-shadow: inset 0 0 0 1.5px #D9CCB2; overflow: hidden; }
.d2-engfill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; border-radius: 99px; background: linear-gradient(90deg, #2FA0CC, #6EF29B); animation: d2engfill 1.8s ease-out 0.5s forwards; }
@keyframes d2engfill { from { width: 0; } to { width: 100%; } }
/* old planda Bit bayram qiladi */
.d2-launch-bit { position: absolute; right: clamp(2px, 1vw, 10px); bottom: clamp(2px, 1vw, 10px); height: clamp(56px, 12.5vw, 86px); z-index: 3; animation: d2hover 6.5s ease-in-out infinite; pointer-events: none; }
.d2-launch-bit .g1-cast-fig { height: 100%; }
.d2-launch-bit .g1-char { height: 100%; width: auto; }
@media (prefers-reduced-motion: reduce) {
  .d2-hullvib, .d2-streak, .d2-planet-recede, .d2-engcass, .d2-engfill, .d2-engglow, .d2-launch-bit { animation: none; }
  .d2-engfill { width: 100%; }
  .d2-engglow { opacity: 0.8; }
}

/* === v4 — sSORT (tasniflash: tap-to-bin) === */
.d2-sortpool { display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); justify-content: center; align-items: center; }
.d2-sortitem { background: #FFFFFF; border: 2px solid #D9CCB2; border-radius: 12px; padding: clamp(6px, 1.4vw, 10px); cursor: pointer; transition: transform 0.15s, box-shadow 0.2s, border-color 0.2s; display: inline-flex; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-sortitem .d2-casssvg { width: clamp(30px, 6.5vw, 46px); }
.d2-sortitem .d2-battsvg { width: clamp(15px, 3.2vw, 21px); }
.d2-sortitem:hover:not(:disabled) { transform: translateY(-2px); }
.d2-sortitem-sel { border-color: #FF4F28; box-shadow: 0 0 14px -2px rgba(255,79,40,0.5); }
.d2-sortitem:disabled { cursor: default; }
.d2-sortdone { font-weight: 800; font-size: clamp(30px, 7vw, 46px); color: #6EF29B; }
.d2-holds { display: flex; gap: clamp(10px, 2.4vw, 18px); justify-content: center; align-items: stretch; }
.d2-hold { flex: 1 1 0; max-width: 260px; min-height: clamp(78px, 17vw, 110px); background: #FFFFFF; border: 2.5px dashed #A7A6A2; border-radius: 16px; padding: clamp(8px, 1.8vw, 12px); display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 1vw, 8px); cursor: pointer; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
.d2-hold-armed { border-color: #5BD6F2; background: #F2FBFE; }
.d2-hold-armed:hover:not(:disabled) { box-shadow: 0 0 14px -3px rgba(91,214,242,0.6); }
.d2-hold-ok { border-style: solid; border-color: #1F7A4D; background: #E3F0E8; cursor: default; }
.d2-hold-wrong { border-color: #D8A93A; background: #FBF3D6; animation: d2holdnudge 0.45s ease; }
@keyframes d2holdnudge { 0%,100% { transform: translateX(0); } 30% { transform: translateX(-4px); } 60% { transform: translateX(4px); } }
.d2-hold:disabled { cursor: default; }
.d2-hold-label { font-weight: 800; font-size: clamp(11px, 1.6vw, 13px); letter-spacing: 0.08em; color: #5A5A60; }
.d2-hold-ok .d2-hold-label { color: #1F7A4D; }
.d2-hold-slot { flex: 1; display: flex; flex-wrap: wrap; gap: 3px; align-items: center; justify-content: center; min-height: clamp(28px, 6vw, 42px); }
.d2-hold-chip .d2-casssvg-btn { width: clamp(18px, 4vw, 28px); }
.d2-hold-chip .d2-battsvg-btn { width: clamp(10px, 2.2vw, 15px); }
.d2-hold-count { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(16px, 2.6vw, 22px); color: #A7A6A2; }
.d2-hold-count.on { color: #1F7A4D; }
@media (prefers-reduced-motion: reduce) { .d2-hold-wrong { animation: none; } }

/* === v4 — sDIAG (diagnostika: ketma-ket sub) === */
.d2-diag-head { display: flex; align-items: center; justify-content: space-between; }
.d2-diag-title { font-weight: 800; font-size: clamp(11px, 1.5vw, 13px); letter-spacing: 0.14em; text-transform: uppercase; color: #017CA3; }
.d2-diag-prog { font-weight: 800; font-size: clamp(13px, 1.8vw, 15px); color: #5A5A60; }
.d2-diag-panel-ok { box-shadow: 0 0 0 2px #1F7A4D, 0 8px 22px -6px rgba(31,122,77,0.3) !important; background: #F1FAF4 !important; }
.d2-diag-rows { display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); }
.d2-diag-done { display: flex; align-items: center; gap: 10px; background: #E3F0E8; border-radius: 10px; padding: clamp(6px, 1.3vw, 9px) clamp(10px, 2vw, 14px); }
.d2-diag-check { width: clamp(18px, 3vw, 22px); height: clamp(18px, 3vw, 22px); border-radius: 50%; background: #1F7A4D; color: #fff; font-weight: 800; font-size: clamp(11px, 1.6vw, 14px); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.d2-diag-donetxt { font-weight: 700; font-size: clamp(13px, 1.8vw, 15px); color: #1F7A4D; }
.d2-diag-active { display: flex; flex-direction: column; gap: clamp(8px, 1.8vw, 12px); background: #FBF9F4; border-radius: 12px; padding: clamp(10px, 2vw, 14px); box-shadow: inset 0 0 0 2px rgba(1,154,203,0.25); }
.d2-diag-q { margin: 0; text-align: center; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px, 2.1vw, 18px); color: #0E0E10; }
.d2-diag-opts { display: flex; gap: clamp(8px, 2vw, 14px); justify-content: center; flex-wrap: wrap; }
.d2-tapbtn { background: #FFFFFF; border: none; border-radius: 14px; cursor: pointer; padding: clamp(8px, 1.8vw, 12px) clamp(16px, 3.4vw, 26px); box-shadow: 0 6px 16px -6px rgba(58,53,48,0.2); transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s; }
.d2-tapbtn:hover:not(:disabled) { transform: translateY(-2px); }
.d2-tapbtn-wrong { opacity: 0.32; box-shadow: inset 0 0 0 2px #E7C46B; cursor: default; }
.d2-tapbtn:disabled { cursor: default; }
.d2-tapnum { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(24px, 5vw, 34px); line-height: 1; color: #0E0E10; }

/* === v4 — sCMP (taqqoslash: ikki kema) === */
.d2-cmp { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2.4vw, 20px); flex-wrap: nowrap; }
.d2-cmp-ship { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); padding: clamp(8px, 1.8vw, 12px); border-radius: 14px; border: 2px solid transparent; transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
.d2-cmp-win { border-color: #6EF29B; box-shadow: 0 0 18px -3px rgba(110,242,155,0.7); transform: translateY(-3px); }
.d2-shipsvg { width: clamp(96px, 24vw, 150px); height: auto; display: block; filter: drop-shadow(0 4px 8px rgba(16,24,44,0.4)); }
.d2-cmp-vs { font-weight: 800; font-size: clamp(22px, 4.6vw, 32px); color: #A7A6A2; }

/* === v4 — sERR (xatoni-top: ko'rsatkich qatorlari) === */
.d2-readout { display: flex; align-items: center; gap: clamp(6px, 1.4vw, 10px); flex-wrap: wrap; justify-content: center; width: 100%; }
.d2-readout-n { font-weight: 800; font-size: clamp(22px, 4.6vw, 32px); color: #0E0E10; min-width: 1.6em; text-align: right; }
.d2-readout-eq { font-weight: 800; font-size: clamp(18px, 3.4vw, 24px); color: #A7A6A2; }
.d2-readout-part { display: inline-flex; align-items: baseline; gap: 4px; font-size: clamp(13px, 1.9vw, 16px); color: #5A5A60; }
.d2-readout-part b { font-size: clamp(19px, 3.6vw, 26px); color: #0E0E10; }
.option .d2-readout-n, .option .d2-readout-part b { color: #0E0E10; }
.option-correct .d2-readout-n, .option-correct .d2-readout-part b, .option-correct .d2-readout-part, .option-correct .d2-readout-eq { color: #1F7A4D !important; }

/* === v5 — sPANEL (bort testi: har sub o'z figurasi + reveal payoff) === */
.d2-panel-fig { display: flex; justify-content: center; padding: clamp(4px, 1vw, 8px) 0; }
.d2-panel-reveal { display: flex; align-items: center; justify-content: center; padding: clamp(8px, 2vw, 14px) 0; min-height: clamp(60px, 13vw, 90px); }
.d2-err-found { display: inline-flex; align-items: center; gap: clamp(8px, 2vw, 14px); background: #E3F0E8; border-radius: 12px; padding: clamp(8px, 1.6vw, 12px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 2px #1F7A4D; }
.d2-err-badge { width: clamp(22px, 4vw, 28px); height: clamp(22px, 4vw, 28px); border-radius: 50%; background: #1F7A4D; color: #fff; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.d2-err-found .d2-readout-n, .d2-err-found .d2-readout-part b { color: #1F7A4D; }

/* === v5 — sCASE (yuk xati: kontekst + savol bitta ekranда) === */
.d2-case-ctx { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px, 2vw, 17px); line-height: 1.3; color: #0E0E10; }

/* === v7/v10 — s14 FINAL: haqiqiy devor-TABLO (bezel + boltlar + porlovchi sarlavha + skanline) === */
.d2-tablo { position: relative; width: 100%; max-width: clamp(280px, 74vw, 460px); margin: 0 auto; background: linear-gradient(#F3EBDA, #E8DEC9); border-radius: 16px; box-shadow: inset 0 0 0 3px #D9CCB2, inset 0 2px 6px rgba(255,255,255,0.5), 0 10px 26px -10px rgba(58,53,48,0.3); padding: clamp(10px, 2.2vw, 16px); }
.d2-tablo-bolt { position: absolute; width: clamp(6px, 1.3vw, 9px); height: clamp(6px, 1.3vw, 9px); border-radius: 50%; background: radial-gradient(circle at 35% 35%, #AEBEC9, #55697C); box-shadow: inset 0 -1px 1px rgba(0,0,0,0.5); }
.d2-tb1 { left: 6px; top: 6px; } .d2-tb2 { right: 6px; top: 6px; } .d2-tb3 { left: 6px; bottom: 6px; } .d2-tb4 { right: 6px; bottom: 6px; }
.d2-tablo-head { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 10px); padding-bottom: clamp(6px, 1.4vw, 10px); margin-bottom: clamp(6px, 1.4vw, 10px); border-bottom: 2px solid rgba(58,71,99,0.22); box-shadow: 0 8px 12px -11px rgba(58,53,48,0.4); }
.d2-tablo-plus { font-weight: 800; font-size: clamp(14px, 2.8vw, 19px); color: #5A6B88; }
.d2-tablo-lamp { width: clamp(8px, 1.7vw, 12px); height: clamp(8px, 1.7vw, 12px); border-radius: 50%; background: #6EF29B; box-shadow: 0 0 8px rgba(110,242,155,0.85); animation: d2neon 2.2s ease-in-out infinite; margin-left: clamp(6px, 1.4vw, 10px); }
/* displey-oyna: ichida yuk-o'qish + skanline (ekran bo'lib o'qilsin) */
.d2-tablo-screen { position: relative; border-radius: 10px; background: #F6F0E2; box-shadow: inset 0 0 0 2px #D9CCB2; padding: clamp(10px, 2.2vw, 16px); overflow: hidden; }
.d2-tablo-screen .d2-casssvg { width: clamp(26px, 5.6vw, 40px); }
.d2-tablo-screen .d2-battsvg { width: clamp(10px, 2.2vw, 15px); }
.d2-tablo-screen .g1-anspop-num { color: #1F7A4D; }
.d2-tablo-screen .g1-anspop-eq { color: #5A6B88; }
.d2-tablo-scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(180deg, rgba(58,71,99,0.025) 0 2px, transparent 2px 4px); }
.d2-tablo-scan::after { content: ''; position: absolute; left: 0; right: 0; height: 18%; background: linear-gradient(rgba(143,224,244,0), rgba(143,224,244,0.1), rgba(143,224,244,0)); animation: d2scan 4.5s linear infinite; }
@keyframes d2scan { 0% { top: -20%; } 100% { top: 120%; } }
@media (prefers-reduced-motion: reduce) { .d2-tablo-lamp, .d2-tablo-scan::after { animation: none; } }
/* FactCard s14 javob zonasida — ixcham (bir qator), skrollsiz */
.d2-fact-final { margin-top: clamp(8px, 1.8vw, 12px); padding: clamp(8px, 1.6vw, 12px) clamp(10px, 2vw, 14px); }
.d2-fact-final .g1-factcard-txt { font-size: clamp(13px, 1.8vw, 15px); line-height: 1.36; }
.d2-fact-final .d2-rocket-fact { width: clamp(30px, 6.5vw, 44px); }

/* === v10 — s8 pult-tugmalari: predmet-ikonkali, rangli (kasseta=moviy, batareya=amber) === */
.d2-conbtn { display: inline-flex; align-items: center; gap: clamp(7px, 1.6vw, 11px); border: none; border-radius: 14px; cursor: pointer; padding: clamp(10px, 2vw, 14px) clamp(13px, 2.6vw, 20px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px, 2vw, 17px); color: #1F2430; transition: transform 0.15s, box-shadow 0.2s, filter 0.2s; }
.d2-conbtn-ic { width: clamp(20px, 4.4vw, 30px); height: auto; display: inline-block; }
.d2-conbtn-icb { width: clamp(13px, 2.8vw, 19px); height: auto; display: inline-block; }
.d2-conbtn-lbl { line-height: 1; }
.d2-conbtn-cass { background: #FFFFFF; box-shadow: inset 0 0 0 2px #2AA9D0, 0 6px 16px -6px rgba(58,53,48,0.2); }
.d2-conbtn-batt { background: #FFFFFF; box-shadow: inset 0 0 0 2px #F0A81E, 0 6px 16px -6px rgba(58,53,48,0.2); }
.d2-conbtn:hover:not(:disabled) { transform: translateY(-2px); }
.d2-conbtn-cass:active:not(:disabled) { box-shadow: inset 0 0 0 2px #2AA9D0, 0 0 16px -4px rgba(42,169,208,0.55); }
.d2-conbtn-batt:active:not(:disabled) { box-shadow: inset 0 0 0 2px #F0A81E, 0 0 16px -4px rgba(240,168,30,0.55); }
.d2-conbtn:disabled { opacity: 0.38; cursor: default; filter: saturate(0.5); }
/* minus — mos rangli kichik dumaloq */
.d2-conbtn-minus { width: clamp(34px, 7vw, 44px); border: none; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: clamp(18px, 3.6vw, 24px); line-height: 1; color: #5A6B88; background: #FFFFFF; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.18); transition: transform 0.15s, box-shadow 0.2s; }
.d2-conbtn-minus-c { box-shadow: inset 0 0 0 1.5px rgba(42,169,208,0.5), 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-conbtn-minus-b { box-shadow: inset 0 0 0 1.5px rgba(240,168,30,0.55), 0 4px 12px -6px rgba(58,53,48,0.18); }
.d2-conbtn-minus:hover:not(:disabled) { transform: translateY(-2px); }
.d2-conbtn-minus:disabled { opacity: 0.35; cursor: default; }
/* Tekshirish — konsol GO-tugmasi (manba-tugmalardan aniq farqli, yashil) */
.d2-gobtn { border: none; border-radius: 99px; cursor: pointer; padding: clamp(11px, 2.2vw, 15px) clamp(26px, 5vw, 40px); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px, 2.2vw, 18px); letter-spacing: 0.04em; color: #0B2A1A; background: linear-gradient(#8FF7B6, #5BE08E); box-shadow: inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 3px rgba(255,255,255,0.5), 0 8px 20px -6px rgba(110,242,155,0.65); transition: transform 0.15s, box-shadow 0.2s; }
.d2-gobtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 26px -6px rgba(110,242,155,0.8); }
.d2-gobtn:disabled { opacity: 0.4; cursor: not-allowed; filter: saturate(0.4); }

/* === v8 — «UCHISHGA TAYYORLIK» missiya-shkalasi (dars-ichi, INFRA'дан tashqarida) === */
/* O'ng gutterда ixcham vertikal quvvat-shkala; markazда vertikal (nav/audio/javob bilan urishmaydi).
   pointer-events yo'q; skroll qo'shmaydi; Stage progress-baridan FARQLI (thematik). */
.d2-gauge { position: absolute; right: clamp(1px, 0.6vw, 8px); top: 50%; transform: translateY(-50%); z-index: 6; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 8px; height: clamp(210px, 58vh, 370px); }
.d2-gauge-label { writing-mode: vertical-rl; text-orientation: mixed; font-size: clamp(9px, 1.4vw, 12px); letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: #5A6B88; opacity: 0.85; }
.d2-gauge-track { position: relative; flex: 1; width: clamp(6px, 1.3vw, 9px); border-radius: 99px; background: #E0D7C4; box-shadow: inset 0 0 0 1px #D0C4AB; overflow: visible; }
.d2-gauge-fill { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 99px; background: linear-gradient(180deg, #6EF29B, #2FA0CC); box-shadow: 0 0 8px rgba(110,242,155,0.55); transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.d2-gauge-rocket { position: absolute; left: 50%; transform: translate(-50%, 50%); width: clamp(22px, 4.6vw, 34px); transition: bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.d2-gauge-rocket .d2-rocketsvg { width: 100%; filter: drop-shadow(0 2px 4px rgba(16,24,44,0.5)); }
/* C — yo'l xaritasi: vertikal marshrut (Yer past → Bit uyi tepa), planeta-nuqtalar */
.d2-jroute { position: relative; flex: 1; width: clamp(30px, 6.4vw, 44px); }
.d2-jroute::before { content: ''; position: absolute; left: 50%; top: 12px; bottom: 10px; width: 3px; transform: translateX(-50%); background: #D0C4AB; border-radius: 2px; }
.d2-jplanet { position: absolute; left: 50%; transform: translate(-50%, 50%); width: clamp(17px, 3.8vw, 24px); line-height: 0; filter: drop-shadow(0 1px 2px rgba(58,53,48,0.34)); }
.d2-jplanet svg { width: 100%; height: auto; display: block; overflow: visible; }
.d2-jplanet-cur { width: clamp(22px, 4.8vw, 30px); filter: drop-shadow(0 0 7px rgba(80,155,215,0.9)) drop-shadow(0 1px 2px rgba(58,53,48,0.34)); }
.d2-jhome { position: absolute; left: 50%; top: -10px; transform: translateX(-50%); font-size: clamp(17px, 3.4vw, 24px); line-height: 1; }
/* juda tor ekranда (mobil zoom-qatlam <=640) yozuv olib tashlanadi — faqat shkala + raketa */
@media (max-width: 639.98px) { .d2-gauge { height: clamp(180px, 46vh, 280px); } .d2-gauge-label { display: none; } }
@media (prefers-reduced-motion: reduce) { .d2-gauge-fill, .d2-gauge-rocket { transition: none; } }
`;
