import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
// УРОК: Умножение десятичных дробей — dec_5_05
// --- ИЗ infrastructure_v1 (строка-в-строку): общая база + секция math (Frac/Op/QuestionScreen/NumInputScreen) ---

// ============================================================
// ПАЛИТРА
// ============================================================
const T = {
  bg: '#F6F4EF',
  ink: '#0E0E10',
  ink2: '#494550',
  ink3: '#8A8883',
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

// Ekrandagi formula o'z ko'rinishida qoladi, TTS esa matematik belgilarni
// tabiiy so'zlar bilan oladi. Bu ayniqsa "Nega shunday" qatorlari uchun kerak:
// brauzer/TTS provayderi ":" yoki "·" ni o'zicha, ba'zan noto'g'ri o'qimasin.
const NUM_WORDS = {
  uz: {
    0: 'nol', 1: 'bir', 2: 'ikki', 3: 'uch', 4: "to'rt", 5: 'besh',
    6: 'olti', 7: 'yetti', 8: 'sakkiz', 9: "to'qqiz", 10: "o'n",
    20: 'yigirma', 30: "o'ttiz", 40: 'qirq', 50: 'ellik',
    60: 'oltmish', 70: 'yetmish', 80: 'sakson', 90: "to'qson",
  },
  ru: {
    0: 'ноль', 1: 'один', 2: 'два', 3: 'три', 4: 'четыре', 5: 'пять',
    6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять', 10: 'десять',
    11: 'одиннадцать', 12: 'двенадцать', 13: 'тринадцать', 14: 'четырнадцать',
    15: 'пятнадцать', 16: 'шестнадцать', 17: 'семнадцать',
    18: 'восемнадцать', 19: 'девятнадцать', 20: 'двадцать',
    30: 'тридцать', 40: 'сорок', 50: 'пятьдесят', 60: 'шестьдесят',
    70: 'семьдесят', 80: 'восемьдесят', 90: 'девяносто',
  },
};

const numberToWords = (value, lang) => {
  const n = Number(value);
  const words = NUM_WORDS[lang] || NUM_WORDS.uz;
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(value);
  if (Object.prototype.hasOwnProperty.call(words, n)) return words[n];
  if (n < 20 && lang === 'uz') return `${words[10]} ${words[n - 10]}`;
  if (n < 100) return `${words[Math.floor(n / 10) * 10]} ${words[n % 10]}`.trim();
  const hundred = lang === 'ru'
    ? ({ 1: 'сто', 2: 'двести', 3: 'триста', 4: 'четыреста', 5: 'пятьсот', 6: 'шестьсот', 7: 'семьсот', 8: 'восемьсот', 9: 'девятьсот' })[Math.floor(n / 100)]
    : `${words[Math.floor(n / 100)]} yuz`;
  const rest = n % 100;
  return rest ? `${hundred} ${numberToWords(rest, lang)}` : hundred;
};

const toTtsMath = (text, lang) => {
  const ops = lang === 'ru'
    ? { mul: ' умножить на ', div: ' разделить на ', eq: ' равно ', minus: ' минус ', plus: ' плюс ' }
    : { mul: ' karra ', div: " bo'lingan ", eq: ' teng ', minus: ' minus ', plus: " qo'shuv " };
  const pronunciationSafe = lang === 'uz'
    ? stripAudioTags(String(text || ''))
        .replace(/\bqismga\b/gi, "bo'lakka")
        .replace(/\bqismda\b/gi, "bo'lakda")
        .replace(/\bqismni\b/gi, "bo'lakni")
        .replace(/\bqism\b/gi, "bo'lak")
    : stripAudioTags(String(text || ''));
  const clean = pronunciationSafe.replace(
    /\b(\d{1,3})\s*:\s*(\d{1,3})\s*=\s*(\d{1,3})\b/g,
    (_, a, b, c) => lang === 'ru'
      ? `${numberToWords(a, lang)} разделить на ${numberToWords(b, lang)} равно ${numberToWords(c, lang)}`
      : `${numberToWords(a, lang)}ni ${numberToWords(b, lang)}ga bo'lsak, ${numberToWords(c, lang)} chiqadi`
  );
  return clean
    .replace(/\s*·\s*/g, ops.mul)
    .replace(/\s+:\s+/g, ops.div)
    .replace(/\s*=\s*/g, ops.eq)
    .replace(/\s*\+\s*/g, ops.plus)
    .replace(/\s*[−–]\s*/g, ops.minus)
    .replace(/\b\d{1,3}\b/g, (m) => numberToWords(m, lang))
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык — маркерами внутри text (только смешанные строки языковых курсов); math шлёт без маркеров,
// сервер определяет язык сам (ru=кириллица, uz=латиница). Движок свой тег НЕ добавляет.
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
    this.gender = 'm';
    this.autoplayBlocked = false;
    this.audioEl = null;
    this.isStarting = false;
    this.isBusy = false;
    this.muted = false;
    this.watchdog = null;
    this.hasStarted = false;
    this.advanceTimer = null;
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
  setGender(g) { this.gender = 'm'; }   // дефолтный пол голоса (v5.2); segment.g переопределяет
  setMuted(value) { this.muted = !!value; if (this.muted) this.stop(); }

  emit(patch) {
    if (this.onStateChange) this.onStateChange({
      isPlaying: this.isPlaying,
      isBusy: this.isBusy,
      currentSegment: null,
      ...patch,
    });
  }

  clearWatchdog() {
    if (this.watchdog) clearTimeout(this.watchdog);
    this.watchdog = null;
  }

  // Ba'zi brauzer ovozlari uzun gapda onend bermaydi. Navbat qotib qolmasligi
  // uchun matn uzunligiga mos yuqori chegara qo'yamiz va keyingi segmentga o'tamiz.
  armWatchdog(segment) {
    this.clearWatchdog();
    const words = String(segment?.text || '').trim().split(/\s+/).filter(Boolean).length;
    const limit = Math.max(8000, Math.min(45000, words * 900 + 5000));
    this.watchdog = setTimeout(() => {
      this.watchdog = null;
      if (this.audioEl) {
        try { this.audioEl.pause(); } catch (e) { /* no-op */ }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
      }
      this.completeSegment(segment);
    }, limit);
  }

  completeSegment(segment) {
    if (!segment || segment._audioCompleted) return;
    segment._audioCompleted = true;
    this.clearWatchdog();
    this.isStarting = false;
    this.isPlaying = false;
    this.emit({ isPlaying: false, currentSegment: null, lastCompletedSegment: segment.id });
    this.handleSegmentEnd(segment);
  }

  loadQueue(segments) {
    this.stop();
    this.queue = segments || [];
    this.currentIdx = 0;
    this.waitingFor = null;
    this.isBusy = false;
    this.hasStarted = false;
    this.emit({ isPlaying: false, isBusy: false, hasStarted: false, currentSegment: null, lastCompletedSegment: null });
  }

  playSegment(segment) {
    if (!segment) return;
    if (this.muted) return;
    this.clearWatchdog();
    segment._audioCompleted = false;
    this.isStarting = true;
    this.isBusy = true;
    this.emit({ isBusy: true, hasStarted: true, currentSegment: segment.id });
    const base = ttsConfig.ttsApiBase;
    // Нет текста → пропускаем (логика очереди сохраняется).
    if (!segment.text) {
      setTimeout(() => this.completeSegment(segment), 0);
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
      this.completeSegment(segment);
    };
    el.onerror = () => {
      this.completeSegment(segment);
    };

    const gender = segment.g || this.gender;
    el.src = buildTtsUrl(base, segment.text, gender);
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        this.autoplayBlocked = false;
        this.isStarting = false;
        this.isPlaying = true;
        this.emit({ isPlaying: true, isBusy: true, currentSegment: segment.id });
        this.armWatchdog(segment);
      }).catch(() => {
        // автоплей заблокирован браузером — ждём первого жеста
        this.isStarting = false;
        this.autoplayBlocked = true;
        this.isPlaying = false;
        this.emit({ isPlaying: false, isBusy: true, currentSegment: null });
        this.armWatchdog(segment);
      });
    }
  }

  // PREVIEW-ВЕТКА (только при пустом ttsApiBase, т.е. вне LMS): браузерный Web Speech.
  // НЕ копировать как боевой транспорт — на платформе всегда идёт HTTP-ветка playSegment.
  playSegmentPreview(segment) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => this.completeSegment(segment), 0); return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    // тег языка/настроения на экран и в Web Speech не нужен — снимаем
    const clean = stripAudioTags(String(segment.text));
    if (!clean) {
      setTimeout(() => this.completeSegment(segment), 0);
      return;
    }
    const u = new SpeechSynthesisUtterance(clean);
    const lang = segment.lang || this.currentLang;
    u.lang = lang === 'uz' ? 'uz-UZ' : (lang === 'en' ? 'en-GB' : 'ru-RU');
    u.rate = 0.95; u.pitch = 1.0;
    u.onstart = () => {
      this.isStarting = false;
      this.isPlaying = true;
      this.emit({ isPlaying: true, isBusy: true, currentSegment: segment.id });
      this.armWatchdog(segment);
    };
    u.onend = () => {
      this.completeSegment(segment);
    };
    u.onerror = () => {
      this.completeSegment(segment);
    };
    this.previewUtterance = u;
    this.armWatchdog(segment);
    setTimeout(() => { try { synth.speak(u); } catch (e) { this.completeSegment(segment); } }, 60);
  }

  // Возобновление после блокировки автоплея (по первому жесту).
  resumeIfBlocked() {
    if (!this.autoplayBlocked) return;
    this.autoplayBlocked = false;
    this.playSegment(this.queue[this.currentIdx]);
  }

  handleSegmentEnd(segment) {
    // Navbatda kutayotgan yangi segment bo'lsa, waits_for'ni KUTMAYMIZ. Aks holda
    // bola javobni ovoz tugashidan oldin bosganda hodisa allaqachon o'tib ketgan
    // bo'ladi va dars shu yerda jim qotib qolardi (izoh hech qachon aytilmasdi).
    const hasQueued = this.currentIdx + 1 < this.queue.length;
    if (segment && segment.waits_for && !hasQueued) {
      this.waitingFor = segment.waits_for;
      this.isBusy = false;
      this.emit({ isPlaying: false, isBusy: false, currentSegment: null, waitingFor: segment.waits_for });
    } else {
      this.waitingFor = null;
      this.currentIdx++;
      if (segment?.pauseAfterMs) {
        if (this.advanceTimer) clearTimeout(this.advanceTimer);
        this.advanceTimer = setTimeout(() => {
          this.advanceTimer = null;
          this.playNext();
        }, segment.pauseAfterMs);
      } else {
        this.playNext();
      }
    }
  }

  playNext() {
    if (this.currentIdx >= this.queue.length) {
      this.isStarting = false;
      this.isBusy = false;
      this.emit({ isPlaying: false, isBusy: false, currentSegment: null, waitingFor: null });
      return;
    }
    this.playSegment(this.queue[this.currentIdx]);
  }

  start() {
    if (this.hasStarted) return;
    this.hasStarted = true;
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

  // NAVBATGA qo'yadi, joriy gapni UZMAYDI. Ilgari har chaqiruv currentIdx'ni
  // oxirga otib playNext qilardi — ketma-ket ikki push bo'lsa (masalan qadam matni
  // + fakt, yoki xulosaning uch qatori) birinchisi ikkinchisi bilan yuvib
  // yuborilardi. Ovoz "yo'qolib qolishi" va "chala aytilishi" shundan edi.
  pushOneOff(text, gender, id, pauseAfterMs = 0) {
    if (!text || this.muted) return null;
    this._oneOffSeq = (this._oneOffSeq || 0) + 1;
    const segmentId = id || `oneoff_${this._oneOffSeq}`;
    this.queue.push({ id: segmentId, text, trigger: 'manual', waits_for: null, g: gender, pauseAfterMs });
    // Ekran endigina ochilib, 300 ms boshlash taymeri hali ishlamagan bo'lishi
    // mumkin. Feedbackni navbat oxiriga qo'shamiz, lekin introni tashlab ketmaymiz
    // va taymer keyin navbatni ikkinchi marta boshidan qayta yoqmaydi.
    if (!this.hasStarted) {
      this.isBusy = true;
      this.emit({ isBusy: true, currentSegment: null });
      return segmentId;
    }
    if (this.isPlaying || this.isStarting) return segmentId; // joriy segment tugagach navbat davom etadi
    this.waitingFor = null;              // yangi gap keldi — kutish bekor
    this.currentIdx = this.queue.length - 1;
    this.playNext();
    return segmentId;
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }

  stop() {
    this.clearWatchdog();
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    if (this.audioEl) {
      try { this.audioEl.pause(); this.audioEl.onended = null; this.audioEl.onerror = null; } catch (e) {}
    }
    // preview-ветка: гасим браузерную озвучку
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isStarting = false;
    this.isPlaying = false;
    this.isBusy = false;
    this.emit({ isPlaying: false, isBusy: false, currentSegment: null, waitingFor: null });
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
  const [state, setState] = useState({ isPlaying: false, isBusy: false, hasStarted: false, currentSegment: null, lastCompletedSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);

  // Стабилизация segments по содержимому, не по ссылке (без этого cancel-loop, звук молчит)
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableSegments = useMemo(() => segments, [segmentsKey]);

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.setGender(ttsConfig.voiceGender || 'm');
    engine.muted = state.muted;
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
      if (engineRef.current) engineRef.current.setMuted(newMuted);
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

const whyLabel = (lang) => lang === 'uz' ? 'Nega shunday' : 'Почему так';
const speakMath = (engine, text, lang, id, pauseAfterMs = 0) => {
  if (!engine || !text) return;
  engine.pushOneOff(toTtsMath(text, lang), undefined, id, pauseAfterMs);
};

const audioReached = (audio, phase) => {
  if (audio.muted) return true;
  const current = String(audio.currentSegment || '');
  const completed = String(audio.lastCompletedSegment || '');
  const ids = `${current} ${completed}`;
  if (phase === 'whyTitle') return /_(why_title|why|fact)\b/.test(ids);
  if (phase === 'why') return /_why\b/.test(ids) || /_fact\b/.test(ids);
  if (phase === 'fact') return /_fact\b/.test(ids) || (!audio.isBusy && /_why\b/.test(completed));
  return false;
};

const WHY_TITLE = { ru: 'Почему так', uz: 'Nega shunday' };
const splitWhyText = (text, lang) => {
  const withoutLead = String(text || '').replace(
    lang === 'uz' ? /^(To'g'ri|Aniq)[.,:]?\s*/i : /^(Верно|Точно)[.,:]?\s*/i,
    ''
  );
  return (withoutLead.match(/[^.!?]+[.!?]?/g) || [withoutLead]).map(line => line.trim()).filter(Boolean);
};
const makeWhyLines = (content, key = 'correct_text') => ({
  ru: splitWhyText(content?.[key]?.ru, 'ru'),
  uz: splitWhyText(content?.[key]?.uz, 'uz'),
});
const useAnswerSequence = ({ audio, screen, correctText, whyNode, factAudio, initiallyComplete = false }) => {
  const t = useT();
  const lang = useLang();
  const whyItems = useMemo(() => whyNode?.props?.lines?.[lang] || [], [lang, whyNode]);
  const prefix = useMemo(() => `post_s${screen}_${lang}`, [lang, screen]);
  const [restored] = useState(initiallyComplete);
  const [skipAudio, setSkipAudio] = useState(false);
  const startedRef = useRef(restored);
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (audio.muted) { setSkipAudio(true); return; }
    const engine = getAudioEngine();
    if (!engine) { setSkipAudio(true); return; }
    engine.pushOneOff(toTtsMath(correctText, lang), undefined, `${prefix}_correct`);
    if (whyItems.length) {
      engine.pushOneOff(t(WHY_TITLE), undefined, `${prefix}_why_title`);
      whyItems.forEach((line, i) => engine.pushOneOff(toTtsMath(line, lang), undefined, `${prefix}_why_${i}`));
    }
    if (factAudio) engine.pushOneOff(toTtsMath(factAudio, lang), undefined, `${prefix}_fact`);
  }, [audio.muted, correctText, factAudio, lang, prefix, t, whyItems]);
  const activeId = audio.currentSegment?.startsWith(prefix)
    ? audio.currentSegment
    : (audio.lastCompletedSegment?.startsWith(prefix) ? audio.lastCompletedSegment : '');
  const whyMatch = activeId.match(new RegExp(`^${prefix}_why_(\\d+)$`));
  const showAll = restored || skipAudio;
  const showWhy = whyItems.length > 0 && (showAll || activeId === `${prefix}_why_title` || !!whyMatch || activeId === `${prefix}_fact`);
  const visibleWhyLines = showAll || activeId === `${prefix}_fact`
    ? whyItems.length
    : (whyMatch ? Math.min(whyItems.length, Number(whyMatch[1]) + 1) : 0);
  const showFact = !!factAudio && (showAll || activeId === `${prefix}_fact`);
  return { showWhy, visibleWhyLines, showFact, start };
};
const WhyCard = ({ lines, visibleCount }) => {
  const t = useT();
  const lang = useLang();
  const items = lines[lang] || [];
  const n = visibleCount === undefined ? items.length : visibleCount;
  return (
    <div className="why">
      <p className="why-h"><span className="why-dot" aria-hidden="true"/>{t(WHY_TITLE)}</p>
      <div className="why-list">
        {items.slice(0, n).map((line, i) => (
          <div key={i} className="why-row"><span className="why-num">{i + 1}</span><p className="why-tx">{line}</p></div>
        ))}
      </div>
    </div>
  );
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
  const whyNode = useMemo(() => <WhyCard lines={makeWhyLines(c)}/>, [c]);
  const post = useAnswerSequence({ audio, screen: idx, correctText: c.correct_text[lang], whyNode, factAudio: c.fact_audio?.[lang], initiallyComplete: wasSolved });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);

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
      post.start();
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

    if (!isCorrect && !audio.muted) {
      setTimeout(() => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          speakMath(engine, wrongVoice, lang, `s${idx}_wrong_${i}`);
        }
      }, 300);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/>
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
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 19px)' : 'clamp(12px, 1.7vw, 12px) clamp(14px, 2.1vw, 19px)', fontSize: 'clamp(15px, 1.8vw, 16px)', minHeight: collapse ? 0 : 'clamp(50px, 7vw, 60px)', maxHeight: collapse ? 0 : 200, opacity: collapse ? 0 : 1, transform: collapse ? 'translateY(-6px) scale(0.97)' : 'none', width: solved && isCorrect ? '100%' : undefined, maxWidth: solved && isCorrect ? 440 : undefined, borderWidth: collapse ? 0 : undefined, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 12, transitionProperty: 'opacity, max-height, min-height, padding, transform, margin', transitionDuration: '0.6s, 0.75s, 0.75s, 0.5s, 0.6s, 0.75s', transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)', transitionDelay: collapse ? `${i * 0.07}s` : '0s' }}>
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
        {solved && post.showWhy && <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>}
        {solved && post.showFact && factOnCorrect && <div ref={factRef}>{factOnCorrect}</div>}
      </div>
    </Stage>
  );
};


// ============================================================
// --- UROK: div_6_05 — Наибольший общий делитель (НОД) / Eng katta umumiy bo'luvchi (EKUB) ---
// Infra grade6/Dars01-04 (baytma-bayt). Mobil naqsh BOSHIDAN ichida (ETALON_6SINF.md §5).
// Kontekst: Dars02-04 dagi do'kon dunyosi davomi, lekin savol kengaydi.
// Dars02-03 da: "bu hisobni N kishi teng bo'la oladimi?"
// Dars05 da:   "IKKITA hisob bor, bitta guruh IKKALASINI ham teng bo'lishi kerak —
//              eng ko'pi bilan necha kishi bo'lishi mumkin?"  ->  EKUB(12, 18) = 6.
// USUL: avval bo'luvchilar RO'YXATI (ma'no shu yerda tug'iladi), keyin YOYILMA
// orqali tez usul (Dars04 dagi tub ko'paytuvchilarga tayanadi).
// s8 da o'zaro tub sonlar qisqacha beriladi (EKUB = 1) — B2 blokidagi kasrlarni
// qisqartirish uchun tayyorgarlik.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_05',
  lessonTitle: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0  (ikki hisob, RASM)
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (umumiy bo'luvchi, ENG OSON, RASM)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (ikki ro'yxat -> umumiylari -> eng kattasi)
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 3  (EKUB ta'rifi)
  { id: 's4',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 4  (16 va 24, RASM)
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 5  (yoyilma orqali tez usul + fakt)
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 6  (ikki usul yonma-yon)
  { id: 's7',  type: 'test',        template: 'OddOneOut',      scored: true,  scope: 'practice' }, // 7  (rasmsiz)
  { id: 's8',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 8  (o'zaro tub sonlar, EKUB = 1)
  { id: 's9',  type: 'test',        template: 'InputScreen',    scored: true,  scope: 'practice' }, // 9  (30 va 45 -> 15, RASM + fakt)
  { id: 's10', type: 'exploration', template: 'custom',         scored: false, scope: null },       // 10 (biri ikkinchisiga bo'linsa — tez yo'l)
  { id: 's11', type: 'test',        template: 'DragMatch',      scored: true,  scope: 'practice' }, // 11 (juftlik -> EKUB, rasmsiz)
  { id: 's12', type: 'test',        template: 'Classify',       scored: true,  scope: 'practice' }, // 12 (o'zaro tubmi, rasmsiz)
  { id: 's13', type: 'test',        template: 'InputScreen',    scored: true,  scope: 'final' },    // 13 (48 va 60 -> 12, rasmsiz + fakt)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 14
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Тема урока', uz: 'Dars mavzusi' },
    topic: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi (EKUB)" },
    global_q: { ru: 'Как найти самое большое число, которое делит сразу два числа?', uz: "Ikki sonni birdan bo'ladigan eng katta sonni qanday topamiz?" },
    lead: { ru: 'Раньше мы делили один счёт. Теперь счетов два: 12 тысяч за обед и 18 тысяч за такси. Компания хочет разделить поровну и то, и другое — но людей должно быть одинаковое число.', uz: "Ilgari bitta hisobni bo'lardik. Endi hisob ikkita: tushlik uchun 12 ming va taksi uchun 18 ming. Kompaniya ikkalasini ham teng bo'lmoqchi — lekin odam soni bir xil bo'lishi kerak." },
    question: { ru: 'Как думаешь, сколько человек может быть максимум?', uz: "Nima deb o'ylaysiz, eng ko'pi bilan necha kishi bo'lishi mumkin?" },
    opt_yes: { ru: 'Кажется, знаю', uz: 'Bilganga oxshayman' },
    opt_no: { ru: 'Пока не знаю', uz: 'Hozircha bilmayman' },
    opt_idk: { ru: 'Хочу разобраться', uz: "O'rganmoqchiman" },
    audio: {
      intro: { ru: 'Раньше мы делили один счёт. Теперь счетов два: двенадцать тысяч за обед и восемнадцать тысяч за такси. Компания хочет разделить поровну и то, и другое, но людей должно быть одинаковое число. Двое подойдут, трое тоже. А сколько максимум? Главный вопрос урока: как найти самое большое число, которое делит сразу два числа? Как думаешь, сколько человек может быть максимум?', uz: "Ilgari bitta hisobni bo'lardik. Endi hisob ikkita: tushlik uchun o'n ikki ming va taksi uchun o'n sakkiz ming. Kompaniya ikkalasini ham teng bo'lmoqchi, lekin odam soni bir xil bo'lishi kerak. Ikki kishi to'g'ri keladi, uch kishi ham. Eng ko'pi bilan-chi? Darsning asosiy savoli: ikki sonni birdan bo'ladigan eng katta sonni qanday topamiz? Nima deb o'ylaysiz, eng ko'pi bilan necha kishi bo'lishi mumkin?" },
      on_correct: { ru: 'Тогда разберёмся.', uz: 'Unda aniqlab olamiz.' },
      on_wrong: { ru: 'Тогда разберёмся.', uz: 'Unda aniqlab olamiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Начнём с простого', uz: 'Oddiydan boshlaymiz' },
    bridge: { ru: 'Сначала самый лёгкий случай.', uz: 'Avval eng oson holat.' },
    question: { ru: 'Какое число делит без остатка и 8, и 12?', uz: "Qaysi son 8 ni ham, 12 ni ham qoldiqsiz bo'ladi?" },
    opt0: { ru: '3', uz: '3' },
    opt1: { ru: '4', uz: '4' },
    opt2: { ru: '5', uz: '5' },
    opt3: { ru: '6', uz: '6' },
    correctIndex: 1,
    correct_text: { ru: 'Верно. 8 : 4 = 2 и 12 : 4 = 3. Число 4 делит оба числа — его называют общим делителем.', uz: "To'g'ri. 8 : 4 = 2 va 12 : 4 = 3. 4 soni ikkala sonni ham bo'ladi — uni umumiy bo'luvchi deyishadi." },
    wrong_0: { ru: '12 на 3 делится, а 8 — нет: 8 = 3 · 2 + 2. Нужно число, которое делит оба.', uz: "12 soni 3 ga bo'linadi, 8 esa yo'q: 8 = 3 · 2 + 2. Ikkalasini ham bo'ladigan son kerak." },
    wrong_2: { ru: 'Ни 8, ни 12 на 5 не делятся — у них последняя цифра не 0 и не 5.', uz: "8 ham, 12 ham 5 ga bo'linmaydi — ularning oxirgi raqami 0 ham, 5 ham emas." },
    wrong_3: { ru: '12 на 6 делится, а 8 — нет: 8 = 6 · 1 + 2.', uz: "12 soni 6 ga bo'linadi, 8 esa yo'q: 8 = 6 · 1 + 2." },
    audio: {
      intro: { ru: 'Начнём с простого. Какое число делит без остатка и восемь, и двенадцать? Выбери ответ.', uz: "Oddiydan boshlaymiz. Qaysi son sakkizni ham, o'n ikkini ham qoldiqsiz bo'ladi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Это общий делитель.', uz: "To'g'ri. Bu umumiy bo'luvchi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Выписываем оба списка', uz: "Ikkala ro'yxatni yozamiz" },
    bridge: { ru: 'Вернёмся к нашим счетам: 12 и 18 тысяч. Выпишем делители каждого.', uz: "Hisoblarimizga qaytamiz: 12 va 18 ming. Har birining bo'luvchilarini yozamiz." },
    audio: {
      ru: [
        'У двенадцати делители один, два, три, четыре, шесть и двенадцать. У восемнадцати один, два, три, шесть, девять и восемнадцать.',
        'Теперь отметим те, что есть в обоих списках. Это один, два, три и шесть. Их называют общими делителями.',
        'Из общих делителей выбираем самый большой. Это шесть.',
        'Значит, компания может быть максимум из шести человек. Шестеро разделят и двенадцать тысяч по две, и восемнадцать тысяч по три.'
      ],
      uz: [
        "O'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti va o'n ikki. O'n sakkizniki: bir, ikki, uch, olti, to'qqiz va o'n sakkiz.",
        "Endi ikkala ro'yxatda ham bor bo'lganlarini belgilaymiz. Bular bir, ikki, uch va olti. Ularni umumiy bo'luvchilar deyishadi.",
        "Umumiy bo'luvchilardan eng kattasini tanlaymiz. Bu olti.",
        "Demak, kompaniya eng ko'pi bilan olti kishidan iborat bo'lishi mumkin. Olti kishi o'n ikki mingni ikkitadan, o'n sakkiz mingni uchtadan bo'lishadi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi" },
    rule_1: { ru: 'Общий делитель — число, которое делит оба числа без остатка. У 12 и 18 это 1, 2, 3 и 6.', uz: "Umumiy bo'luvchi — ikkala sonni ham qoldiqsiz bo'ladigan son. 12 va 18 uchun bular 1, 2, 3 va 6." },
    rule_2: { ru: 'Самый большой из них называют НОД. Пишут так: НОД(12; 18) = 6.', uz: "Ulardan eng kattasi EKUB deyiladi. Shunday yoziladi: EKUB(12; 18) = 6." },
    audio: { ru: 'Запомним правило. Общий делитель это число, которое делит оба числа без остатка. У двенадцати и восемнадцати это один, два, три и шесть. Самый большой из них называют наибольшим общим делителем, сокращённо НОД. Пишут: НОД от двенадцати и восемнадцати равен шести.', uz: "Qoidani eslab qolamiz. Umumiy bo'luvchi bu ikkala sonni ham qoldiqsiz bo'ladigan son. O'n ikki va o'n sakkiz uchun bular bir, ikki, uch va olti. Ulardan eng kattasi eng katta umumiy bo'luvchi deyiladi, qisqacha EKUB. Shunday yoziladi: o'n ikki va o'n sakkizning EKUBi oltiga teng." }
  },

  s4: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    bridge: { ru: 'Теперь другая пара счетов.', uz: 'Endi boshqa juft hisob.' },
    question: { ru: 'Чему равен НОД(16; 24)?', uz: 'EKUB(16; 24) nechaga teng?' },
    opt0: { ru: '2', uz: '2' },
    opt1: { ru: '4', uz: '4' },
    opt2: { ru: '6', uz: '6' },
    opt3: { ru: '8', uz: '8' },
    correctIndex: 3,
    correct_text: { ru: 'Верно. Общие делители 16 и 24 — это 1, 2, 4 и 8. Самый большой из них 8.', uz: "To'g'ri. 16 va 24 ning umumiy bo'luvchilari — 1, 2, 4 va 8. Ulardan eng kattasi 8." },
    wrong_0: { ru: '2 действительно общий делитель, но не самый большой. Ищи дальше по списку.', uz: "2 haqiqatan umumiy bo'luvchi, lekin eng kattasi emas. Ro'yxat bo'ylab yana qidiring." },
    wrong_1: { ru: '4 тоже общий делитель, но есть больше. Проверь 8: 16 : 8 = 2 и 24 : 8 = 3.', uz: "4 ham umumiy bo'luvchi, lekin kattarog'i bor. 8 ni tekshiring: 16 : 8 = 2 va 24 : 8 = 3." },
    wrong_2: { ru: '24 на 6 делится, а 16 — нет: 16 = 6 · 2 + 4. Значит, 6 не общий делитель.', uz: "24 soni 6 ga bo'linadi, 16 esa yo'q: 16 = 6 · 2 + 4. Demak, 6 umumiy bo'luvchi emas." },
    audio: {
      intro: { ru: 'Теперь другая пара. Чему равен наибольший общий делитель шестнадцати и двадцати четырёх? Выпиши делители обоих. Выбери ответ.', uz: "Endi boshqa juftlik. O'n olti va yigirma to'rtning eng katta umumiy bo'luvchisi nechaga teng? Ikkalasining bo'luvchilarini yozing. Javobni tanlang." },
      on_correct: { ru: 'Верно, восемь.', uz: "To'g'ri, sakkiz." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Быстрый способ — через разложение', uz: 'Tez usul — yoyilma orqali' },
    bridge: { ru: 'Выписывать все делители долго. Разложим оба числа на простые множители.', uz: "Barcha bo'luvchilarni yozish uzoq. Ikkala sonni tub ko'paytuvchilarga yoyamiz." },
    fact: { ru: 'Евклид описал алгоритм нахождения НОД больше двух тысяч лет назад. Современные компьютеры используют родственные быстрые алгоритмы, в том числе при работе с большими числами.', uz: "Evklid EKUBni topish algoritmini ikki ming yildan ko'proq vaqt oldin bayon qilgan. Zamonaviy kompyuterlar, jumladan katta sonlar bilan ishlaganda, unga yaqin tezkor algoritmlardan foydalanadi." },
    fact_audio: { ru: 'Знаешь ли ты? Евклид описал алгоритм нахождения наибольшего общего делителя больше двух тысяч лет назад. Современные компьютеры используют родственные быстрые алгоритмы, в том числе при работе с большими числами.', uz: "Bilasizmi? Evklid eng katta umumiy bo'luvchini topish algoritmini ikki ming yildan ko'proq vaqt oldin bayon qilgan. Zamonaviy kompyuterlar, jumladan katta sonlar bilan ishlaganda, unga yaqin tezkor algoritmlardan foydalanadi." },
    audio: {
      ru: [
        'Двенадцать это два умножить на два умножить на три. Восемнадцать это два умножить на три умножить на три.',
        'Найдём общие кирпичики. Двойка есть в обоих разложениях, и тройка тоже есть в обоих. А лишняя двойка и лишняя тройка общими не будут.',
        'Перемножим общие множители: два умножить на три будет шесть. Тот же ответ, но искать пришлось намного меньше.'
      ],
      uz: [
        "O'n ikki bu ikki karra ikki karra uch. O'n sakkiz bu ikki karra uch karra uch.",
        "Umumiy g'ishtlarni topamiz. Ikki har ikkala yoyilmada ham bor, uch ham har ikkalasida bor. Ortiqcha ikki va ortiqcha uch esa umumiy bo'lmaydi.",
        "Umumiy ko'paytuvchilarni ko'paytiramiz: ikki karra uch teng olti. Javob o'sha, lekin qidirish ancha kam bo'ldi."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Два способа', uz: 'Ikki usul' },
    rule_1: { ru: 'Способ 1 — списки: выписать делители обоих чисел и взять самый большой общий. Надёжно, но долго.', uz: "1-usul — ro'yxat: ikkala sonning bo'luvchilarini yozib, eng katta umumiysini olish. Ishonchli, lekin uzoq." },
    rule_2: { ru: 'Способ 2 — разложение: разложить оба на простые множители и перемножить общие. Быстрее, особенно для больших чисел.', uz: "2-usul — yoyilma: ikkalasini tub ko'paytuvchilarga yoyib, umumiylarini ko'paytirish. Tezroq, ayniqsa katta sonlarda." },
    audio: { ru: 'Два способа. Первый способ, списки: выписать делители обоих чисел и взять самый большой общий. Надёжно, но долго. Второй способ, разложение: разложить оба числа на простые множители и перемножить общие. Быстрее, особенно для больших чисел.', uz: "Ikki usul. Birinchi usul, ro'yxat: ikkala sonning bo'luvchilarini yozib, eng katta umumiysini olish. Ishonchli, lekin uzoq. Ikkinchi usul, yoyilma: ikkala sonni tub ko'paytuvchilarga yoyib, umumiylarini ko'paytirish. Tezroq, ayniqsa katta sonlarda." }
  },

  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    question: { ru: 'Найди число, которое НЕ является общим делителем 24 и 36', uz: "24 va 36 ning umumiy bo'luvchisi BO'LMAGAN sonni toping" },
    lead: { ru: 'Картинки нет — проверь каждое число делением на оба.', uz: "Rasm yo'q — har bir sonni ikkalasiga bo'lib tekshiring." },
    items: [
      { num: '2' },
      { num: '3' },
      { num: '4' },
      { num: '5' },
      { num: '6' }
    ],
    errorIdx: 3,
    correct_text: { ru: 'Верно. Ни 24, ни 36 на 5 не делятся. Общие делители 24 и 36 — это 1, 2, 3, 4, 6 и 12.', uz: "To'g'ri. 24 ham, 36 ham 5 ga bo'linmaydi. 24 va 36 ning umumiy bo'luvchilari — 1, 2, 3, 4, 6 va 12." },
    wrong_0: { ru: '24 : 2 = 12 и 36 : 2 = 18 — оба делятся. Это общий делитель.', uz: "24 : 2 = 12 va 36 : 2 = 18 — ikkalasi ham bo'linadi. Bu umumiy bo'luvchi." },
    wrong_1: { ru: '24 : 3 = 8 и 36 : 3 = 12 — оба делятся. Ищи дальше.', uz: "24 : 3 = 8 va 36 : 3 = 12 — ikkalasi ham bo'linadi. Yana qidiring." },
    wrong_2: { ru: '24 : 4 = 6 и 36 : 4 = 9 — оба делятся. Проверь последние цифры остальных.', uz: "24 : 4 = 6 va 36 : 4 = 9 — ikkalasi ham bo'linadi. Qolganlarining oxirgi raqamini tekshiring." },
    wrong_4: { ru: '24 : 6 = 4 и 36 : 6 = 6 — оба делятся. Осталось одно число.', uz: "24 : 6 = 4 va 36 : 6 = 6 — ikkalasi ham bo'linadi. Bitta son qoldi." },
    audio: {
      intro: { ru: 'Картинки нет, проверяй делением на оба числа. Найди то, которое не является общим делителем двадцати четырёх и тридцати шести.', uz: "Rasm yo'q, ikkala songa bo'lib tekshiring. Yigirma to'rt va o'ttiz oltining umumiy bo'luvchisi bo'lmagan sonni toping." },
      on_correct: { ru: 'Верно. Ни одно из них на пять не делится.', uz: "To'g'ri. Ularning hech biri beshga bo'linmaydi." },
      on_wrong: { ru: 'Это общий делитель. Ищи дальше.', uz: "Bu umumiy bo'luvchi. Yana qidiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Когда общего почти нет', uz: "Umumiysi deyarli yo'q bo'lganda" },
    bridge: { ru: 'Бывает, что у двух чисел общий делитель только один — единица.', uz: "Shunday bo'ladiki, ikki sonning umumiy bo'luvchisi faqat bitta — bir soni." },
    audio: {
      ru: [
        'Возьмём восемь и девять. У восьмёрки делители один, два, четыре и восемь. У девятки один, три и девять.',
        'Общий только один. Значит, наибольший общий делитель равен единице.',
        'Такие числа называют взаимно простыми. Заметь: сами они могут быть и составными, как восемь и девять. Это пригодится, когда будем сокращать дроби.'
      ],
      uz: [
        "Sakkiz va to'qqizni olamiz. Sakkizning bo'luvchilari: bir, ikki, to'rt va sakkiz. To'qqizniki: bir, uch va to'qqiz.",
        "Umumiysi faqat bir. Demak, eng katta umumiy bo'luvchi birga teng.",
        "Bunday sonlarni o'zaro tub sonlar deyishadi. E'tibor bering: ularning o'zi murakkab bo'lishi ham mumkin, sakkiz va to'qqiz kabi. Bu kasrlarni qisqartirganda asqotadi."
      ]
    }
  },

  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    label: { ru: 'два счёта', uz: 'ikki hisob' },
    context: { ru: 'Два счёта: 30 тысяч и 45 тысяч.', uz: "Ikki hisob: 30 ming va 45 ming." },
    question: { ru: 'Сколько человек максимум смогут разделить поровну оба счёта?', uz: "Eng ko'pi bilan necha kishi ikkala hisobni ham teng bo'la oladi?" },
    answer: '15',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно. НОД(30; 45) = 15. Пятнадцать человек разделят 30 тысяч по 2 и 45 тысяч по 3.', uz: "To'g'ri. EKUB(30; 45) = 15. O'n besh kishi 30 mingni 2 tadan, 45 mingni 3 tadan bo'lishadi." },
    hint: { ru: 'Разложи: 30 = 2 · 3 · 5, а 45 = 3 · 3 · 5. Какие множители есть в обоих?', uz: "Yoying: 30 = 2 · 3 · 5, 45 = 3 · 3 · 5. Qaysi ko'paytuvchilar ikkalasida ham bor?" },
    fact: { ru: 'Если разделить оба числа на их НОД, получатся взаимно простые числа: 30 : 15 = 2 и 45 : 15 = 3. У двойки и тройки общего уже ничего нет — дальше делить некуда.', uz: "Agar ikkala sonni ularning EKUBiga bo'lsak, o'zaro tub sonlar chiqadi: 30 : 15 = 2 va 45 : 15 = 3. Ikki va uchning umumiysi endi yo'q — boshqa bo'lish mumkin emas." },
    fact_audio: { ru: 'Знаешь ли ты? Если разделить оба числа на их наибольший общий делитель, получатся взаимно простые числа. Тридцать делить на пятнадцать будет два, сорок пять делить на пятнадцать будет три. У двойки и тройки общего уже ничего нет.', uz: "Bilasizmi? Agar ikkala sonni ularning eng katta umumiy bo'luvchisiga bo'lsak, o'zaro tub sonlar chiqadi. O'ttizni o'n beshga bo'lsak ikki, qirq beshni o'n beshga bo'lsak uch. Ikki va uchning umumiysi endi yo'q." },
    audio: {
      intro: { ru: 'Два счёта: тридцать тысяч и сорок пять тысяч. Сколько человек максимум смогут разделить поровну оба счёта? Набери ответ.', uz: "Ikki hisob: o'ttiz ming va qirq besh ming. Eng ko'pi bilan necha kishi ikkala hisobni ham teng bo'la oladi? Javobni tering." },
      on_correct: { ru: 'Верно, пятнадцать.', uz: "To'g'ri, o'n besh." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Самый короткий случай', uz: 'Eng qisqa holat' },
    bridge: { ru: 'Иногда НОД виден сразу, без всяких списков.', uz: "Ba'zan EKUB hech qanday ro'yxatsiz, darrov ko'rinadi." },
    audio: {
      ru: [
        'Возьмём шесть и восемнадцать. Восемнадцать делится на шесть без остатка.',
        'Тогда шесть делит и само себя, и восемнадцать. Больше шести общий делитель быть не может, ведь он не может быть больше меньшего числа.',
        'Правило: если большее число делится на меньшее, то наибольший общий делитель это меньшее число. Проверяй это первым делом, иногда ответ готов сразу.'
      ],
      uz: [
        "Olti va o'n sakkizni olamiz. O'n sakkiz oltiga qoldiqsiz bo'linadi.",
        "Unda olti o'zini ham, o'n sakkizni ham bo'ladi. Umumiy bo'luvchi oltidan katta bo'la olmaydi, axir u kichik sondan katta bo'lishi mumkin emas.",
        "Qoida: agar katta son kichigiga bo'linsa, eng katta umumiy bo'luvchi kichik sonning o'zi bo'ladi. Buni birinchi navbatda tekshiring, ba'zan javob darrov tayyor bo'ladi."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Найди НОД каждой пары', uz: 'Har juftlikning EKUBini toping' },
    lead: { ru: 'Для каждой пары выбери верный ответ. Картинки нет.', uz: "Har bir juftlik uchun to'g'ri javobni tanlang. Rasm yo'q." },
    pairs: [
      { number: '12 va 20', label: { ru: 'НОД', uz: 'EKUB' }, reading: { ru: '4', uz: '4' } },
      { number: '9 va 15', label: { ru: 'НОД', uz: 'EKUB' }, reading: { ru: '3', uz: '3' } },
      { number: '8 va 9', label: { ru: 'НОД', uz: 'EKUB' }, reading: { ru: '1', uz: '1' } }
    ],
    correct_text: { ru: 'Верно. 12 и 20 → 4. 9 и 15 → 3. А 8 и 9 взаимно простые, у них НОД равен 1.', uz: "To'g'ri. 12 va 20 → 4. 9 va 15 → 3. 8 va 9 esa o'zaro tub, ularning EKUBi 1 ga teng." },
    hint: { ru: 'Проверь сначала маленькие общие делители: 2, 3, 4, 5. Потом бери самый большой из подошедших.', uz: "Avval kichik umumiy bo'luvchilarni tekshiring: 2, 3, 4, 5. So'ng to'g'ri kelganlarning eng kattasini oling." },
    audio: {
      intro: { ru: 'Картинки нет. Для каждой пары выбери верный НОД. Нажми на пару, потом выбери ответ из списка.', uz: "Rasm yo'q. Har bir juftlik uchun to'g'ri EKUB ni tanlang. Juftlikka bosing, so'ng ro'yxatdan javobni tanlang." },
      on_correct: { ru: 'Верно, все пары на местах.', uz: "To'g'ri, barcha juftliklar o'z o'rniga tushdi." },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Взаимно простые или нет?', uz: "O'zaro tubmi yoki yo'q?" },
    lead: { ru: 'Взаимно простые — те, у которых НОД равен 1. Картинки нет.', uz: "O'zaro tub — EKUBi 1 ga teng bo'lganlari. Rasm yo'q." },
    bin_a: { ru: 'НОД = 1', uz: 'EKUB = 1' },
    bin_b: { ru: 'НОД больше 1', uz: 'EKUB 1 dan katta' },
    cards: [
      { label: '8 va 9', bin: 'a' },
      { label: '6 va 10', bin: 'b' },
      { label: '7 va 12', bin: 'a' },
      { label: '15 va 20', bin: 'b' },
      { label: '5 va 9', bin: 'a' },
      { label: '14 va 21', bin: 'b' }
    ],
    hint: { ru: 'Ищи хоть один общий делитель больше 1. Нашёл — значит числа не взаимно простые.', uz: "1 dan katta bitta bo'lsa ham umumiy bo'luvchi qidiring. Topsangiz — sonlar o'zaro tub emas." },
    correct_text: { ru: 'Точно. 6 и 10 делятся на 2, 15 и 20 — на 5, 14 и 21 — на 7. А в остальных парах общего, кроме 1, нет.', uz: "Aniq. 6 va 10 sonlari 2 ga, 15 va 20 — 5 ga, 14 va 21 — 7 ga bo'linadi. Qolgan juftliklarda esa 1 dan boshqa umumiysi yo'q." },
    audio: {
      intro: { ru: 'Разбери пары на две группы. Взаимно простые или нет? Ищи общий делитель больше единицы.', uz: "Juftliklarni ikki guruhga ajrating. O'zaro tubmi yoki yo'q? Birdan katta umumiy bo'luvchi qidiring." },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi." },
      on_wrong: { ru: 'Не сюда.', uz: 'Bu yerga emas.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
    label: { ru: 'финальная задача', uz: 'yakuniy masala' },
    context: { ru: 'Два счёта: 48 тысяч и 60 тысяч. Картинки нет — считай через разложение.', uz: "Ikki hisob: 48 ming va 60 ming. Rasm yo'q — yoyilma orqali hisoblang." },
    question: { ru: 'Чему равен НОД(48; 60)?', uz: 'EKUB(48; 60) nechaga teng?' },
    answer: '12',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно. 48 = 2 · 2 · 2 · 2 · 3, а 60 = 2 · 2 · 3 · 5. Общие множители 2 · 2 · 3 = 12.', uz: "To'g'ri. 48 = 2 · 2 · 2 · 2 · 3, 60 esa = 2 · 2 · 3 · 5. Umumiy ko'paytuvchilar 2 · 2 · 3 = 12." },
    hint: { ru: 'Разложи оба числа. Двойка входит в 48 четыре раза, а в 60 только два — значит, в общее берём две двойки.', uz: "Ikkala sonni yoying. Ikki soni 48 ga to'rt marta, 60 ga esa faqat ikki marta kiradi — demak, umumiyga ikkita ikki olinadi." },
    fact: { ru: 'Общий множитель берут столько раз, сколько он встречается в том числе, где его меньше. Это и есть весь секрет способа с разложением.', uz: "Umumiy ko'paytuvchi qaysi sonda kam uchrasa, o'shancha marta olinadi. Yoyilma usulining butun siri shunda." },
    fact_audio: { ru: 'Знаешь ли ты? Общий множитель берут столько раз, сколько он встречается в том числе, где его меньше. Это и есть весь секрет способа с разложением.', uz: "Bilasizmi? Umumiy ko'paytuvchi qaysi sonda kam uchrasa, o'shancha marta olinadi. Yoyilma usulining butun siri shunda." },
    audio: {
      intro: { ru: 'Финальная задача. Два счёта: сорок восемь тысяч и шестьдесят тысяч. Чему равен их наибольший общий делитель? Набери ответ.', uz: "Yakuniy masala. Ikki hisob: qirq sakkiz ming va oltmish ming. Ularning eng katta umumiy bo'luvchisi nechaga teng? Javobni tering." },
      on_correct: { ru: 'Верно, двенадцать.', uz: "To'g'ri, o'n ikki." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi" },
    heading: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi" },
    score_label: { ru: 'заданий выполнено с первой попытки', uz: 'topshiriq birinchi urinishda bajarildi' },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'НОД двух чисел — самый большой из их общих делителей. НОД(12; 18) = 6.', uz: "Ikki sonning EKUBi — ularning umumiy bo'luvchilaridan eng kattasi. EKUB(12; 18) = 6." },
    main_2: { ru: 'Два способа: выписать оба списка делителей или разложить оба числа и перемножить общие множители.', uz: "Ikki usul: ikkala bo'luvchilar ro'yxatini yozish yoki ikkala sonni yoyib, umumiy ko'paytuvchilarni ko'paytirish." },
    main_3: { ru: 'Если НОД равен 1, числа называют взаимно простыми. Если большее делится на меньшее, НОД — меньшее число.', uz: "Agar EKUB 1 ga teng bo'lsa, sonlar o'zaro tub deyiladi. Agar katta son kichigiga bo'linsa, EKUB — kichik sonning o'zi." },
    hook_close: { ru: 'Вернёмся к началу: НОД(12; 18) = 6, значит компания максимум из шести человек разделит поровну оба счёта.', uz: "Boshiga qaytamiz: EKUB(12; 18) = 6, demak eng ko'pi bilan olti kishilik kompaniya ikkala hisobni ham teng bo'la oladi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Nimaga tayanadi' },
    conn_refs: { ru: 'делители и разложение на простые множители', uz: "bo'luvchilar va tub ko'paytuvchilarga yoyish" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'наименьшее общее кратное (НОК)', uz: 'eng kichik umumiy karrali (EKUK)' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Наибольший общий делитель двух чисел это самый большой из их общих делителей. Найти его можно двумя способами: выписать оба списка делителей или разложить оба числа и перемножить общие множители.',
        'Если наибольший общий делитель равен единице, числа называют взаимно простыми. А если большее число делится на меньшее, то ответ это меньшее число. Дальше разберём наименьшее общее кратное.'
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Ikki sonning eng katta umumiy bo'luvchisi bu ularning umumiy bo'luvchilaridan eng kattasi. Uni ikki usulda topish mumkin: ikkala bo'luvchilar ro'yxatini yozish yoki ikkala sonni yoyib, umumiy ko'paytuvchilarni ko'paytirish.",
        "Agar eng katta umumiy bo'luvchi birga teng bo'lsa, sonlar o'zaro tub deyiladi. Agar katta son kichigiga bo'linsa, javob kichik sonning o'zi bo'ladi. Keyin eng kichik umumiy karralini ko'rib chiqamiz."
      ]
    }
  }
};

// ============================================================
// SHUFFLE / FORMAT / ANIM HELPERS (div_6_05)
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const fmtNum = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffleArr = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const tick = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick); else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
const CountUp = ({ target, duration, style, className }) => {
  const v = useCountUp(target, duration);
  return <span className={className} style={style}>{fmtNum(v)}</span>;
};

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// UMUMIY BO'LUVCHILAR — darsning asosiy vizual modeli.
// Ikki sonning bo'luvchilari ikki qatorga yoziladi; umumiylari yashil yonadi,
// ulardan eng kattasi aksent halqa oladi. EKUB shu tarzda ko'zga tashlanadi.
// ============================================================
const CoinIcon = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill="#C9922B"/>
    <circle cx="12" cy="12" r="8" fill="#F6C453"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="#C9922B" strokeWidth="0.9" opacity="0.6"/>
  </svg>
);

const PriceTag = ({ value, unit, tone = 'plain', size = 'md' }) => {
  const bg = tone === 'ok' ? '#E3F0E8' : (tone === 'no' ? '#FFE8E1' : '#FFFFFF');
  const fg = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : T.ink);
  const bd = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : 'rgba(167, 166, 162, 0.4)');
  const fs = size === 'lg' ? 'clamp(22px, 5vw, 34px)' : 'clamp(15px, 3vw, 21px)';
  return (
    <span className="pr-tag" style={{ background: bg, borderColor: bd, color: fg }}>
      <span className="mono" style={{ fontSize: fs, fontWeight: 700, lineHeight: 1 }}>{value}</span>
      {unit && <span className="mono" style={{ fontSize: 'clamp(9px, 1.9vw, 11px)', opacity: 0.75 }}>{unit}</span>}
    </span>
  );
};

const divisorsOf = (n) => { const r = []; for (let i = 1; i <= n; i++) { if (n % i === 0) r.push(i); } return r; };
const gcdOf = (a, b) => { let x = a, y = b; while (y) { const t = x % y; x = y; y = t; } return x; };
const primeFactors = (n) => { const r = []; let x = n; for (let p = 2; p * p <= x; p++) { while (x % p === 0) { r.push(p); x /= p; } } if (x > 1) r.push(x); return r; };

// Bitta sonning bo'luvchilari qatori. `common` to'plamidagilar yashil,
// `best` (EKUB) esa aksent halqa bilan ajratiladi.
const DivisorRow = ({ value, common, best, showCommon = false, showBest = false }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 1vw, 7px)' }}>
    <span className="mono" style={{ fontSize: 'clamp(13px, 2.6vw, 17px)', fontWeight: 700, color: T.ink2, minWidth: '2.2em', textAlign: 'right' }}>{value}</span>
    <span className="mono small" style={{ color: T.ink3 }}>:</span>
    {divisorsOf(value).map((d, i) => {
      const isCommon = showCommon && common && common.has(d);
      const isBest = showBest && d === best;
      return (
        <span key={d} className={`dr-chip mono ${isCommon ? 'dr-common' : ''} ${isBest ? 'dr-best' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>{d}</span>
      );
    })}
  </div>
);

// Ikki sonning bo'luvchilari + umumiylari + EKUB. Qadamlar bilan ochiladi:
// step 0 — faqat ro'yxatlar · 1 — umumiylari yashil · 2+ — eng kattasi ajraladi.
const CommonDivisors = ({ a, b, step = 2, unit }) => {
  const common = new Set(divisorsOf(a).filter(d => b % d === 0));
  const best = gcdOf(a, b);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px, 1.6vw, 11px)' }}>
      <DivisorRow value={a} common={common} best={best} showCommon={step >= 1} showBest={step >= 2}/>
      <DivisorRow value={b} common={common} best={best} showCommon={step >= 1} showBest={step >= 2}/>
      {step >= 2 && (
        <span className="gcd-badge mono">
          {unit ? `EKUB = ${best} ${unit}` : `EKUB = ${best}`}
        </span>
      )}
    </div>
  );
};

// Yoyilma orqali usul: ikki sonning tub ko'paytuvchilari, umumiylari yashil.
// Umumiy g'ishtlar ko'paytmasi EKUB ni beradi.
// Ustun (столбик) usuli: sonni tublarga ketma-ket bo'lamiz — chapda bo'linuvchi,
// o'ngda tub bo'luvchi, pastda 1 qolguncha. Qatorlar ketma-ket paydo bo'ladi (animatsiya).
const FactorLadder = ({ value }) => {
  const rows = [];
  let x = value, p = 2;
  while (x > 1) { if (x % p === 0) { rows.push([x, p]); x = x / p; } else { p = p === 2 ? 3 : p + 2; } }
  return (
    <div className="ladder" aria-hidden="true">
      {rows.map(([n, d], i) => (
        <div className="ladder-row" key={i} style={{ animationDelay: `${i * 0.16}s` }}>
          <span className="ladder-n mono">{n}</span>
          <span className="ladder-bar"/>
          <span className="ladder-p mono">{d}</span>
        </div>
      ))}
      <div className="ladder-row" style={{ animationDelay: `${rows.length * 0.16}s` }}>
        <span className="ladder-n ladder-one mono">1</span>
        <span className="ladder-bar"/>
        <span className="ladder-p mono"/>
      </div>
    </div>
  );
};

const FactorRow = ({ value, commonPool, highlight = false }) => {
  const fs = primeFactors(value);
  const pool = commonPool ? [...commonPool] : [];
  const marked = fs.map(f => { const i = pool.indexOf(f); if (i >= 0) { pool.splice(i, 1); return true; } return false; });
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 1vw, 7px)' }}>
      <span className="mono" style={{ fontSize: 'clamp(15px, 3vw, 20px)', fontWeight: 700, color: T.ink }}>{value}</span>
      <span className="mono" style={{ fontSize: 'clamp(13px, 2.6vw, 17px)', color: T.ink3 }}>=</span>
      {fs.map((f, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="mono small" style={{ color: T.ink3 }}>·</span>}
          <span className={`fc-chip mono ${highlight && marked[i] ? '' : 'fc-dim'}`} style={{ animationDelay: `${i * 0.07}s` }}>{f}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

// Ikki sonning yoyilmalari yonma-yon + umumiy ko'paytuvchilar ko'paytmasi.
const FactorCompare = ({ a, b, step = 2 }) => {
  const fa = primeFactors(a);
  const fb = primeFactors(b);
  const pool = [...fb];
  const common = [];
  for (const f of fa) { const i = pool.indexOf(f); if (i >= 0) { pool.splice(i, 1); common.push(f); } }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px, 1.6vw, 11px)' }}>
      <FactorRow value={a} commonPool={common} highlight={step >= 1}/>
      <FactorRow value={b} commonPool={common} highlight={step >= 1}/>
      {step >= 2 && (
        <span className="gcd-badge mono">{common.join(' · ')} = {common.reduce((x, y) => x * y, 1)}</span>
      )}
    </div>
  );
};

const DivisorChips = ({ list, active = -1 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)' }}>
    {list.map((d, i) => (
      <span key={i} className="dv-chip" style={{ animationDelay: `${i * 0.07}s`, background: active === i ? T.accentSoft : '#FFFFFF', color: active === i ? T.accent : T.ink, borderColor: active === i ? T.accent : 'rgba(167, 166, 162, 0.35)' }}>{d}</span>
    ))}
  </div>
);
// Xona katakchalari: bir sinf ichidagi uch raqam to'lganda yashilga o'tadi.
const PlaceGrid = ({ answer, filled }) => {
  const digits = String(answer).split('');
  const n = digits.length;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
      {digits.map((d, i) => {
        const classBreak = (n - i) % 3 === 0 && i !== 0;
        return (
          <React.Fragment key={i}>
            {classBreak && <span style={{ width: 8 }}/>}
            <span className={`place-cell ${filled ? 'filled' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{filled ? d : '·'}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================
// FACTCARD — ovozli fakt to'g'ri javobdan keyin (ko'k tema + darsga xos Anim*).
// ============================================================
const FB_IT   = { ru: 'Знаешь ли ты? · IT',    uz: "Bilasizmi? · IT" };
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan" };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix" };
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
const AnimDigits = () => (<div className="fa-dg" aria-hidden="true">{Array.from({ length: 3 }).map((_, g) => (<span key={g} className="fa-dg-grp">{Array.from({ length: 3 }).map((_, d) => (<i key={d}/>))}</span>))}</div>);
const AnimStars = () => (<div className="fa-st" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => (<span key={i} style={{ animationDelay: `${i * 0.22}s` }}/>))}</div>);
const AnimData = () => (<div className="fa-da" aria-hidden="true">{[40, 60, 80, 100].map((h, i) => (<span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }}/>))}</div>);

// ============================================================
// SHARED SCREEN HELPERS
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Floaters = () => (<div className="amb" aria-hidden="true"><span className="amb-o amb-o1"/><span className="amb-o amb-o2"/><span className="amb-o amb-o3"/></div>);
const StepLine = ({ children, soft }) => (
  <div className={`fade-up ${soft ? 'frame-tip' : 'frame'}`} style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
    <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
  </div>
);
// Bosqichli izohlar yig'iladi: oldingi qatorlar (so'lg'in) qoladi, yangisi pastdan chiqadi (fade-up).
const StepLinesAccum = ({ lines, step }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 12px)' }}>
    {lines.slice(0, step + 1).map((ln, i) => {
      const isCurrent = i === step;
      return (
        <div key={i} className={`${isCurrent ? 'fade-up frame' : 'frame-tip'}`} style={{ padding: 'clamp(12px, 2vw, 16px)', opacity: isCurrent ? 1 : 0.72, transition: 'opacity 0.4s ease' }}>
          <p className="body" style={{ margin: 0, color: isCurrent ? T.ink : T.ink2 }}>{ln}</p>
        </div>
      );
    })}
  </div>
);
const HintBlock = ({ show, children }) => {
  const lang = useLang();
  if (!show) return null;
  return (
    <div className="frame-tip fade-up" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
      <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
      <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
    </div>
  );
};
const ConnectionsBlock = ({ c }) => {
  const t = useT();
  return (
    <div className="frame-tip fade-up delay-3" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.ink }}>🔗 {t(c.conn_label_refs)}:</span> {t(c.conn_refs)}</p>
      <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {t(c.conn_label_next)}:</span> {t(c.conn_next)}</p>
    </div>
  );
};

// Bosqichli kashfiyot: bitta ovozli qator + bitta ko'rinadigan izoh (skrollsiz, qatorlar yig'ilmaydi).
const StepExploration = ({ screen, screenContent, onNext, onPrev, totalScreens, renderBody, factOnLast }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const last = lines.length - 1;
  const narration = useMemo(() => {
    const items = lines.map((line, i) => ({
      id: `s${screen}_a${i}`,
      text: toTtsMath(line, lang),
      trigger: i === 0 ? 'on_mount' : 'after_previous',
      waits_for: null,
      pauseAfterMs: i < last ? 650 : 0,
    }));
    if (factOnLast && c.fact_audio?.[lang]) {
      items.push({
        id: `s${screen}_fact`,
        text: toTtsMath(c.fact_audio[lang], lang),
        trigger: 'after_previous',
        waits_for: null,
      });
    }
    return items;
  }, [c, factOnLast, lang, last, lines, screen]);
  const audio = useAudio(narration);
  const [mutedStep, setMutedStep] = useState(0);
  const currentMatch = String(audio.currentSegment || '').match(new RegExp(`^s${screen}_a(\\d+)$`));
  const completedMatch = String(audio.lastCompletedSegment || '').match(new RegExp(`^s${screen}_a(\\d+)$`));
  const factCompleted = audio.lastCompletedSegment === `s${screen}_fact`;
  const voicedStep = factCompleted
    ? last
    : Math.min(Number(currentMatch?.[1] ?? completedMatch?.[1] ?? 0), last);
  const step = audio.muted ? mutedStep : voicedStep;

  const mutedAdvance = () => {
    if (step < last) setMutedStep((value) => Math.min(value + 1, last));
    else onNext();
  };
  const ready = audio.muted ? step >= last : (step >= last && audio.hasStarted && !audio.isBusy);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!audio.muted && !ready} label={<NextLabel/>} onClick={audio.muted ? mutedAdvance : onNext}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      {renderBody({ t, lang, step, last, audio })}
    </Stage>
  );
};

// Qoida ekrani (s3, s6): ikki qoida qatori (pale-yellow) + misol.
const RuleScreen = ({ screen, screenContent, onNext, onPrev, totalScreens, exampleNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_a`, text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 20px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_1)}</p></div>
        <div className="frame-tip fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_2)}</p></div>
        <div className="frame fade-up delay-3" style={{ position: 'relative', textAlign: 'center' }}>
          {exampleNode || <p className="body" style={{ margin: 0, color: T.ink }}>{t(c.example)}</p>}
        </div>
      </div>
    </Stage>
  );
};

// Javob terish ekrani (s9, s13) — keep-visible: savol qoladi, faqat input to'ladi/yashilga o'tadi.
const InputScreen = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, factNode, figureNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const norm = (s) => String(s).replace(/[^0-9]/g, '');
  const solvedInit = storedAnswer !== undefined && norm(storedAnswer.studentAnswer) === norm(c.answer);
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(solvedInit);
  const [showHint, setShowHint] = useState(storedAnswer !== undefined && !solvedInit);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const whyNode = useMemo(() => <WhyCard lines={makeWhyLines(c, 'fb_correct')}/>, [c]);
  const post = useAnswerSequence({ audio, screen, correctText: c.fb_correct[lang], whyNode, factAudio: c.fact_audio?.[lang], initiallyComplete: solvedInit });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);
  const isCorrect = norm(value) === norm(c.answer) && norm(value) !== '';

  const submit = () => {
    if (norm(value) === '' || solved) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: null, correctIndex: null, correctAnswer: c.answer, studentAnswerIndex: null, studentAnswer: String(value), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); sfx.playCorrect(); post.start(); } else { setShowHint(true); sfx.playWrong(); }
    if (!isCorrect && !audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine(); if (!e || audio.muted) return;
        speakMath(e, c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang, `s${screen}_wrong`);
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)} · {t(c.label)}</p>
          {/* Kontekstda masalaning sharti (masalan 4?2) turadi — u eng och kulrangda
              qolib ketmasligi kerak, shuning uchun ink2. Savolning o'zi esa boshqa
              sarlavhalardan ajralib turishi uchun kattaroq va to'q. */}
          {c.context && <p className="small" style={{ marginTop: 6, color: T.ink2 }}>{t(c.context)}</p>}
          <h2 className="title h-sub" style={{ marginTop: 8, fontSize: 'clamp(19px, 3.1vw, 23px)', color: T.ink }}>{t(c.question)}</h2>
        </div>
        {figureNode && <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.2vw, 18px)' }}>{figureNode}</div>}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : (showHint ? 'wrong' : '')}`} value={value} placeholder={t(c.placeholder)} onChange={e => setValue(e.target.value)} disabled={solved} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'min(100%, 320px)' }}/>
          <PlaceGrid answer={c.answer} filled={solved}/>
        </div>
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!value} onClick={submit} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.fb_correct)}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// Xato o'qishni top (s7) — keep-visible: to'g'ri (xato) variant qoladi, qolganlari yig'iladi.
const OddOneOut = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const correctIdx = c.errorIdx;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const whyNode = useMemo(() => <WhyCard lines={makeWhyLines(c)}/>, [c]);
  const post = useAnswerSequence({ audio, screen, correctText: c.correct_text[lang], whyNode, factAudio: c.fact_audio?.[lang], initiallyComplete: wasSolved });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);

  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isC = i === correctIdx;
    if (firstTryRef.current === null) firstTryRef.current = isC;
    setPicked(i);
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isC) {
      setSolved(true);
      sfx.playCorrect();
      post.start();
      onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: c.items.map(it => it.num), correctIndex: correctIdx, correctAnswer: c.items[correctIdx].num, studentAnswerIndex: i, studentAnswer: c.items[i].num, correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
    } else {
      sfx.playWrong();
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }
    if (!isC && !audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine(); if (!e || audio.muted) return;
        const wv = (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
        speakMath(e, wv, lang, `s${screen}_wrong_${i}`);
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.question)}</h2>
          <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {c.items.map((it, i) => {
            const isCorrect = i === correctIdx;
            const isWrongPicked = wrong.has(i);
            const collapse = solved && !isCorrect;
            let cls = 'option';
            if (solved && isCorrect) cls += ' option-correct';
            else if (isWrongPicked) cls += ' option-picked-wrong';
            return (
              <button key={i} className={cls} disabled={solved || isWrongPicked} onClick={() => pick(i)}
                style={{ padding: collapse ? '0 clamp(14px, 2.1vw, 18px)' : 'clamp(11px, 1.7vw, 14px) clamp(14px, 2.1vw, 18px)', maxHeight: collapse ? 0 : 140, opacity: collapse ? 0 : 1, overflow: 'hidden', borderWidth: collapse ? 0 : undefined, display: 'flex', alignItems: 'center', gap: 12, transition: 'opacity 0.5s cubic-bezier(0.33,0,0.2,1), max-height 0.65s cubic-bezier(0.33,0,0.2,1), padding 0.5s cubic-bezier(0.33,0,0.2,1)', transitionDelay: collapse ? `${i * 0.06}s` : '0s' }}>
                <span className="mono small" style={{ minWidth: 20, color: solved && isCorrect ? T.success : (isWrongPicked ? T.accent : T.ink3) }}>{solved && isCorrect ? '✓' : (isWrongPicked ? '✗' : String.fromCharCode(65 + i))}</span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                  <span className="display" style={{ fontSize: 'clamp(16px, 2.6vw, 22px)' }}>{it.num}</span>
                  <span className="small" style={{ color: T.ink2 }}>{t(it.reading)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={picked !== null} isCorrect={solved} wrongClass="frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: solved ? T.success : '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (lang === 'uz' ? "To'g'ri" : 'Верно') : (lang === 'uz' ? 'Maslahat' : 'Подсказка')}</p>
          <p className="body" style={{ margin: 0 }}>{t(solved ? c.correct_text : (c[`wrong_${picked}`] || c.audio.on_wrong))}</p>
        </FeedbackBlock>
        {solved && post.showWhy && <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
      </div>
    </Stage>
  );
};

// Tasniflash (s12) — son bittalab chiqadi, bola guruhni bosadi; веди-до-верного; joylanganlar yashil chip.
const Classify = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const cards = c.cards;
  const total = cards.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true;
  // Tartib HAR seansda RANDOM (Fisher-Yates, useState init — seans ichida o'zgarmaydi, tiklanish buzilmaydi).
  const [deck] = useState(() => shuffleArr([...Array(total).keys()]));
  const [pos, setPos] = useState(wasSolved ? total : 0);
  const [placed, setPlaced] = useState(() => (wasSolved ? cards.map(c2 => c2.bin) : []));
  const [wrongBin, setWrongBin] = useState(null);
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const solved = pos >= total;
  const cardIdx = solved ? -1 : deck[pos];
  const whyNode = useMemo(() => <WhyCard lines={makeWhyLines(c)}/>, [c]);
  const post = useAnswerSequence({ audio, screen, correctText: c.correct_text[lang], whyNode, initiallyComplete: wasSolved });
  const whyRef = useRevealScroll(post.showWhy, 300);

  const tap = (bin) => {
    if (solved) return;
    const isC = bin === cards[cardIdx].bin;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (isC) {
      setWrongBin(null);
      const np = [...placed]; np[cardIdx] = bin; setPlaced(np);
      const nPos = pos + 1; setPos(nPos);
      if (nPos >= total) {
        if (firstTryRef.current === null) firstTryRef.current = true;
        onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'sorted', studentAnswer: JSON.stringify(np), correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
        sfx.playCorrect();
        post.start();
      }
    } else {
      if (firstTryRef.current === null || firstTryRef.current === true) firstTryRef.current = false;
      setWrongBin(bin);
      sfx.playWrong();
      if (!audio.muted) { setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) speakMath(e, c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang, `s${screen}_wrong`); }, 300); }
    }
  };

  const bins = [{ key: 'a', label: c.bin_a }, { key: 'b', label: c.bin_b }];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        {!solved && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 92, justifyContent: 'center' }}>
            <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{pos + 1} / {total}</p>
            <div key={pos} className="display fade-up" style={{ fontSize: 'clamp(26px, 5.6vw, 42px)', color: T.ink }}>{cards[cardIdx].label}</div>
          </div>
        )}
        <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {bins.map(b => {
            const chips = placed.map((p, k) => (p === b.key ? cards[k].label : null)).filter(Boolean);
            const isWrong = wrongBin === b.key;
            return (
              <button key={b.key} disabled={solved} onClick={() => tap(b.key)} className="option" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', padding: 'clamp(12px, 2vw, 16px)', borderWidth: isWrong ? 2 : undefined, borderStyle: isWrong ? 'solid' : undefined, borderColor: isWrong ? T.accent : undefined, cursor: solved ? 'default' : 'pointer' }}>
                <span className="small mono" style={{ color: T.ink2, fontWeight: 700 }}>{t(b.label)}</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {chips.map((ch, k) => (<span key={k} className="mono small" style={{ padding: '3px 8px', borderRadius: 8, background: '#E3F0E8', color: T.success }}>{ch}</span>))}
                </span>
              </button>
            );
          })}
        </div>
        {wrongBin && !solved && <HintBlock show={true}>{t(c.hint)}</HintBlock>}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>}
      </div>
    </Stage>
  );
};

// Moslash (s11) — songa bos, ro'yxatdan o'qilishini tanla; keep-visible (savol qoladi); веди-до-верного.
const DragMatch = ({ screen, screenContent, onAnswer, onNext, onPrev, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const sfx = useSfx();
  const isMobile = useIsMobile();
  const pairs = c.pairs;
  const n = pairs.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const [order] = useState(() => shuffleArr([...Array(n).keys()]));
  const [assign, setAssign] = useState(() => Array(n).fill(null));
  const [activeSlot, setActiveSlot] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(null);
  const whyNode = useMemo(() => <WhyCard lines={makeWhyLines(c)}/>, [c]);
  const post = useAnswerSequence({ audio, screen, correctText: c.correct_text[lang], whyNode, factAudio: c.fact_audio?.[lang] });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);
  // Slot bosilganda pastda ochiladigan variantlar ro'yxati — tap natijasi, mobilda
  // ekrandan pastda qolmasligi uchun ko'rinishga olib kelinadi.
  const optionsRef = useRevealScroll(!solved && activeSlot !== null);

  const allPlaced = assign.every(a => a !== null);
  const isCorrect = assign.every((a, k) => a === k);
  const slotOf = (pairIdx) => assign.findIndex(a => a === pairIdx);

  const assignToActive = (pairIdx) => {
    if (solved || activeSlot === null) return;
    setAssign(prev => { const nx = prev.map(a => (a === pairIdx ? null : a)); nx[activeSlot] = pairIdx; return nx; });
    setActiveSlot(null);
  };
  const clearSlot = (k, e) => { if (e) e.stopPropagation(); if (solved) return; setAssign(prev => { const nx = [...prev]; nx[k] = null; return nx; }); };

  const check = () => {
    if (solved || !allPlaced) return;
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'match', studentAnswer: JSON.stringify(assign), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); setActiveSlot(null); sfx.playCorrect(); post.start(); } else { setShowHint(true); sfx.playWrong(); }
    if (!isCorrect && !audio.muted) {
      setTimeout(() => {
        const e = getAudioEngine();
        if (!e || audio.muted) return;
        speakMath(e, c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang, `s${screen}_wrong`);
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  const readingFont = isMobile ? 'clamp(12px, 3.4vw, 14px)' : 'clamp(13px, 1.7vw, 15px)';
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pairs.map((pr, k) => {
            const placedPair = assign[k];
            const active = activeSlot === k;
            return (
              <div key={k} className="frame" onClick={() => { if (!solved) setActiveSlot(active ? null : k); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(10px,1.8vw,14px)', cursor: solved ? 'default' : 'pointer', border: `2px solid ${solved ? T.success : (active ? T.accent : 'transparent')}`, transition: 'border-color 0.25s ease' }}>
                <div style={{ minWidth: 'clamp(100px, 28vw, 150px)' }}>
                  <div className="display" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', color: T.ink }}>{pr.number}</div>
                  <div className="small mono" style={{ color: T.ink3 }}>{t(pr.label)}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {placedPair !== null ? (
                    <>
                      <span style={{ flex: 1, fontSize: readingFont, lineHeight: 1.3, color: solved ? T.success : T.ink }}>{t(pairs[placedPair].reading)}</span>
                      {!solved && <button onClick={(e) => clearSlot(k, e)} aria-label={lang === 'uz' ? 'tozalash' : 'очистить'} className="mono" style={{ border: 'none', background: 'transparent', color: T.ink3, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>}
                    </>
                  ) : (
                    <span className="small" style={{ color: active ? T.accent : T.ink3 }}>{active ? (lang === 'uz' ? "ro'yxatdan tanlang ↓" : 'выбери из списка ↓') : (lang === 'uz' ? 'tanlash' : 'выбрать')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!solved && activeSlot !== null && (
          <div ref={optionsRef} className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.map(pi => {
              const usedSlot = slotOf(pi);
              const usedHere = usedSlot === activeSlot;
              return (
                <button key={pi} onClick={() => assignToActive(pi)} className="option" style={{ padding: 'clamp(10px,1.8vw,13px) clamp(12px,2vw,16px)', fontSize: readingFont, lineHeight: 1.3, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, opacity: usedSlot >= 0 && !usedHere ? 0.5 : 1, borderColor: usedHere ? T.accent : undefined }}>
                  <span className="mono small" style={{ minWidth: 18, color: usedSlot >= 0 ? T.accent : T.ink3 }}>{usedSlot >= 0 ? (usedHere ? '✓' : '•') : ''}</span>
                  <span style={{ flex: 1 }}>{t(pairs[pi].reading)}</span>
                </button>
              );
            })}
          </div>
        )}
        {!solved && (
          <div className="fade-up delay-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{t(c.correct_text)}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
        {!solved && <HintBlock show={showHint}>{t(c.hint)}</HintBlock>}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// Qiyinlik pog'onasi: 8/12 -> 12,18 -> 16,24 -> 30,45 -> 48,60.
// Rasmli: s0, s1, s2, s3, s4, s5, s6, s8, s9, s10.
// Rasmsiz (xayolan hisoblash): s7, s11, s12, s13.
// ============================================================
const UNIT = { ru: 'тыс.', uz: 'ming' };
const LBL_PEOPLE = { ru: 'чел.', uz: 'kishi' };

const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: `${lang === 'uz' ? `Dars mavzusi: ${c.topic.uz}. ` : `Тема урока: ${c.topic.ru}. `}${c.audio.intro[lang]}`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const showOptions = audio.muted || (audio.hasStarted && !audio.isBusy);
  const optionsRef = useRevealScroll(showOptions);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer({ stage: null, screenIdx: screen, studentAnswer: v, correct: true }); audio.triggerEvent('option_picked'); setTimeout(onNext, 300); };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.accent }}>{t(c.eyebrow)}</p>
        <h1 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.topic)}</h1>
        <h2 className="title h-sub fade-up delay-1" style={{ position: 'relative', margin: 0 }}>{t(c.global_q)}</h2>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, maxHeight: showOptions ? 0 : 300, opacity: showOptions ? 0 : 1, marginBottom: showOptions ? 'calc(-1 * clamp(12px, 2.2vw, 18px))' : 0, overflow: 'hidden', transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>{t(c.lead)}</p>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)', padding: 'clamp(14px, 2.5vw, 18px)' }}>
          <PriceTag value={12} unit={t(UNIT)} size={showOptions ? 'md' : 'lg'}/>
          <span className="mono" style={{ fontSize: 'clamp(14px, 2.8vw, 18px)', color: T.ink3 }}>{lang === 'uz' ? 'va' : 'и'}</span>
          <PriceTag value={18} unit={t(UNIT)} size={showOptions ? 'md' : 'lg'}/>
        </div>
        <h2 className="title h-sub fade-up delay-2" style={{ position: 'relative', margin: 0 }}>{t(c.question)}</h2>
        {showOptions && (
          <div ref={optionsRef} className="fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ id: 'yes', label: c.opt_yes }, { id: 'no', label: c.opt_no }, { id: 'idk', label: c.opt_idk }].map(opt => (
              <button key={opt.id} className="option" disabled={picked !== null} onClick={() => pick(opt.id)} style={{ padding: 'clamp(13px, 1.9vw, 15px) clamp(16px, 2.5vw, 20px)', fontSize: 'clamp(15px, 1.9vw, 15px)' }}>{t(opt.label)}</button>
            ))}
          </div>
        )}
      </div>
    </Stage>
  );
};

// s1 — umumiy bo'luvchi tushunchasiga birinchi qadam.
const Screen1 = (props) => {
  const t = useT();
  const c = CONTENT.s1;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [2, 1, 3, 0]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => (solved
    ? <CommonDivisors a={8} b={12} step={2}/>
    : <CommonDivisors a={8} b={12} step={0}/>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s2 — darsning yuragi: ikki ro'yxat -> umumiylari -> eng kattasi.
const Screen2 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s2} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s2.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s2.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ padding: 'clamp(12px, 2.2vw, 16px)' }}>
          <CommonDivisors a={12} b={18} step={step} unit={step >= 3 ? t(LBL_PEOPLE) : null}/>
        </div>
        <StepLinesAccum lines={CONTENT.s2.audio[lang]} step={step}/>
      </div>
    )}/>
);

const Screen3 = (props) => (<RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS} exampleNode={<CommonDivisors a={12} b={18} step={2}/>}/>);

// s4 — boshqa juftlik: 16 va 24.
const Screen4 = (props) => {
  const t = useT();
  const c = CONTENT.s4;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [3, 0, 2, 1]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => <CommonDivisors a={16} b={24} step={solved ? 2 : 0}/>;
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s5 — yoyilma orqali tez usul.
const Screen5 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s5} totalScreens={TOTAL_SCREENS} factOnLast
    renderBody={({ t, lang, step, last, audio }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s5.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s5.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ padding: 'clamp(12px, 2.2vw, 16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)' }}>
          <FactorCompare a={12} b={18} step={step}/>
          {step >= 1 && step < last && (
            <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 16px)', paddingTop: 12, borderTop: '1px dashed rgba(58, 53, 48, 0.16)', width: '100%' }}>
              <span className="mono small" style={{ color: T.ink3, fontWeight: 700, letterSpacing: '0.1em' }}>{lang === 'uz' ? '12 — USTUN USULIDA' : '12 — СТОЛБИКОМ'}</span>
              <FactorLadder value={12}/>
            </div>
          )}
        </div>
        <StepLinesAccum lines={CONTENT.s5.audio[lang]} step={step}/>
        {step >= last && audioReached(audio, 'fact') && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={CONTENT.s5.fact}/>}
      </div>
    )}/>
);

// s6 — ikki usul yonma-yon.
const Screen6 = (props) => {
  const lang = useLang();
  const example = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span className="mono small" style={{ color: T.ink2, fontWeight: 700 }}>{lang === 'uz' ? "1 — RO'YXAT" : '1 — СПИСКИ'}</span>
        <CommonDivisors a={12} b={18} step={2}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span className="mono small" style={{ color: T.ink2, fontWeight: 700 }}>{lang === 'uz' ? '2 — YOYILMA' : '2 — РАЗЛОЖЕНИЕ'}</span>
        <FactorCompare a={12} b={18} step={2}/>
      </div>
    </div>
  );
  return <RuleScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS} exampleNode={example}/>;
};

const Screen7 = (props) => <OddOneOut {...props} screenContent={CONTENT.s7} totalScreens={TOTAL_SCREENS}/>;

// s8 — o'zaro tub sonlar: umumiysi faqat 1.
const Screen8 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s8} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s8.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s8.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 'clamp(12px, 2.2vw, 16px)' }}>
          <CommonDivisors a={8} b={9} step={step}/>
          {step >= 2 && (
            <span className="dv-chip fade-up" style={{ background: T.accentSoft, color: T.accent, borderColor: T.accent }}>
              {lang === 'uz' ? "o'zaro tub sonlar" : 'взаимно простые числа'}
            </span>
          )}
        </div>
        <StepLinesAccum lines={CONTENT.s8.audio[lang]} step={step}/>
      </div>
    )}/>
);

const Screen9 = (props) => {
  const t = useT();
  const fig = (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
      <PriceTag value={30} unit={t(UNIT)} size="lg"/>
      <CoinIcon s={18}/>
      <PriceTag value={45} unit={t(UNIT)} size="lg"/>
    </div>
  );
  return <InputScreen {...props} screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} figureNode={fig} factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s9.fact}/>}/>;
};

// s10 — agar katta son kichigiga bo'linsa, EKUB kichik sonning o'zi.
const Screen10 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s10.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s10.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 'clamp(12px, 2.2vw, 16px)' }}>
          <p className="mono" style={{ margin: 0, fontSize: 'clamp(15px, 3vw, 20px)', color: T.ink }}>18 : 6 = 3</p>
          <CommonDivisors a={6} b={18} step={step >= 1 ? 2 : 0}/>
          {step >= 2 && (
            <span className="dv-chip fade-up" style={{ background: '#E3F0E8', color: T.success, borderColor: T.success }}>
              {lang === 'uz' ? "EKUB — kichik sonning o'zi" : 'НОД — меньшее число'}
            </span>
          )}
        </div>
        <StepLinesAccum lines={CONTENT.s10.audio[lang]} step={step}/>
      </div>
    )}/>
);

const Screen11 = (props) => <DragMatch {...props} screenContent={CONTENT.s11} totalScreens={TOTAL_SCREENS}/>;

const Screen12 = (props) => <Classify {...props} screenContent={CONTENT.s12} totalScreens={TOTAL_SCREENS}/>;

const Screen13 = (props) => <InputScreen {...props} screenContent={CONTENT.s13} totalScreens={TOTAL_SCREENS} factNode={<FactCard badge={FB_SCI} anim={<AnimData/>} text={CONTENT.s13.fact}/>}/>;
const Screen14 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's14_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach((l, i) => speakMath(e, l, lang, `s14_a${i + 1}`, 300)); }
    /* eslint-disable-next-line */
  }, []);
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers[i]?.correct).length;
  const total = scoredIdx.length;
  const mains = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow" style={{ color: T.success }}>{t(c.eyebrow)}</p>
            <h2 className="title" style={{ marginTop: 8, fontSize: 'clamp(30px, 6vw, 50px)', lineHeight: 1.04 }}>{t(c.heading)}</h2>
          </div>
          <span className="mono" style={{ fontSize: 'clamp(36px, 8vw, 58px)', fontWeight: 800, color: T.success, lineHeight: 0.95, flexShrink: 0 }}>{correct}/{total}</span>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', margin: '-4px 0 0', color: T.ink2 }}>{t(c.score_label)}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 14 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{t(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2" style={{ position: 'relative' }}>
          <p className="body" style={{ margin: 0 }}>{t(c.hook_close)}</p>
        </div>
        <ConnectionsBlock c={c}/>
      </div>
    </Stage>
  );
};

// ============================================================
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

.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4, .lesson-root h5, .lesson-root h6,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }

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
.h-sub { font-size: clamp(19px, 2.7vw, 22px); }
.body { font-size: clamp(17px, 2.1vw, 17px); line-height: 1.55; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(15px, 1.7vw, 15px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

.stage { max-width: 936px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(12px, 2vw, 18px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 16px); padding-bottom: clamp(17px, 3.4vw, 34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
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

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (div_6_05) ===== */
.place-cell { font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center; min-width: clamp(20px, 3.6vw, 30px); height: clamp(28px, 5vw, 40px); border-radius: 8px; background: #FFFFFF; color: #A7A6A2; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); transition: all 0.35s; }
.place-cell.filled { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.30); }

@keyframes rg-dot-in { from { opacity: 0; transform: translateY(6px) scale(0.6); } to { opacity: 1; transform: none; } }

/* PriceTag — do'kon narx yorlig'i. */
.pr-tag { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; padding: clamp(7px,1.5vw,11px) clamp(11px,2.2vw,16px); border-radius: 12px; border: 1.5px solid; animation: rg-dot-in 0.36s ease-out both; box-shadow: 0 5px 14px -8px rgba(58,53,48,0.35); transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* DivisorRow — bitta sonning bo'luvchilari. Umumiylari yashil, EKUB aksent halqada. */
.dr-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 1.5em; padding: 4px 8px; border-radius: 8px; background: #FFFFFF; color: #0E0E10; border: 1.5px solid rgba(167,166,162,0.4); font-weight: 700; font-size: clamp(12px, 2.4vw, 16px); line-height: 1.15; animation: rg-dot-in 0.32s ease-out both; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease; }
.dr-common { background: #E3F0E8; color: #1F7A4D; border-color: #1F7A4D; }
.dr-best { background: #FFE8E1; color: #FF4F28; border-color: #FF4F28; box-shadow: 0 0 0 3px rgba(255,79,40,0.18); }

/* EKUB natijasi. */
.gcd-badge { display: inline-flex; align-items: center; justify-content: center; padding: 5px 14px; border-radius: 99px; border: 2px solid #FF4F28; background: #FFE8E1; color: #FF4F28; font-weight: 700; font-size: clamp(13px, 2.6vw, 17px); animation: rg-dot-in 0.4s ease-out both, badgePulse 1.7s ease-out 0.35s 1; }
@keyframes badgePulse { 0% { box-shadow: 0 0 0 0 rgba(255, 79, 40, 0.34); } 55% { box-shadow: 0 0 0 12px rgba(255, 79, 40, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 79, 40, 0); } }

/* FactorRow — tub ko'paytuvchilar; umumiy bo'lmaganlari so'nadi. */
.fc-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 1.5em; padding: 5px 9px; border-radius: 8px; background: #E3F0E8; color: #1F7A4D; border: 1.5px solid #1F7A4D; font-weight: 700; font-size: clamp(13px, 2.6vw, 18px); line-height: 1.15; animation: rg-dot-in 0.34s ease-out both; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease, opacity 0.35s ease; }
/* FactorLadder — tub ko'paytuvchilarга ustun (столбик) usuli. Qatorlar ketma-ket tushadi. */
.ladder { display: inline-grid; grid-auto-rows: auto; gap: 3px; margin: 2px 0; }
.ladder-row { display: grid; grid-template-columns: minmax(2em, 1fr) auto minmax(2em, 1fr); align-items: stretch; column-gap: clamp(12px, 2.4vw, 20px); animation: ladderIn 0.42s cubic-bezier(0.33, 0, 0.2, 1) both; }
.ladder-n { text-align: right; align-self: center; font-weight: 700; font-size: clamp(16px, 3vw, 22px); color: #0E0E10; }
.ladder-p { text-align: left; align-self: center; font-weight: 700; font-size: clamp(16px, 3vw, 22px); color: #1F7A4D; }
.ladder-bar { width: 2.5px; min-height: 1.5em; background: rgba(58, 53, 48, 0.28); border-radius: 2px; }
.ladder-one { color: #A7A6A2; }
@keyframes ladderIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
.fc-dim { background: #FFFFFF; color: #A7A6A2; border-color: rgba(167,166,162,0.4); opacity: 0.6; }

/* DivisorChips — ruxsat etilgan oxirgi raqamlar / alomat chiplari. */
.dv-chip { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 17px); font-weight: 600; padding: clamp(6px,1.2vw,9px) clamp(11px,2vw,15px); border-radius: 10px; border: 1.5px solid; animation: rg-dot-in 0.4s ease-out both; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

.why { background: #FFFFFF; border-radius: 14px; border-left: 4px solid #019ACB; padding: clamp(12px, 2.2vw, 17px); box-shadow: 0 8px 22px -6px rgba(1, 154, 203, 0.2); margin-top: clamp(10px, 1.8vw, 14px); animation: fade-in-up 0.7s ease-out both; }
.why-h { display: flex; align-items: center; gap: 8px; margin: 0 0 clamp(8px, 1.6vw, 12px); font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.9vw, 12px); font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: #019ACB; }
.why-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.6); animation: rv-dot-pulse 1.8s ease-in-out infinite; }
.why-list { position: relative; display: flex; flex-direction: column; gap: clamp(7px, 1.4vw, 10px); }
.why-list::before { content: ''; position: absolute; left: 10.5px; top: 12px; bottom: 12px; width: 1px; background: linear-gradient(180deg, rgba(1,154,203,0.55), rgba(1,154,203,0.08)); }
.why-row { position: relative; display: flex; align-items: flex-start; gap: 10px; animation: why-in 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
.why-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #EAF6FB; color: #019ACB; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; margin-top: 1px; }
.why-tx { margin: 0; font-size: clamp(15px, 2.9vw, 16px); line-height: 1.45; color: #0E0E10; }
@keyframes why-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
.fact-card { display: flex; gap: clamp(12px, 2.5vw, 18px); align-items: center; background: #EAF6FB; border-left: 4px solid #019ACB; border-radius: 12px; padding: clamp(12px, 2.2vw, 16px); box-shadow: 0 6px 16px -6px rgba(1, 154, 203, 0.22); }
.fact-anim { flex-shrink: 0; width: clamp(90px, 18vw, 130px); height: clamp(70px, 14vw, 96px); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.fact-body { flex: 1; }
.fact-badge { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.2vw, 11px); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #019ACB; }
.fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.55); }
.fact-text { margin: 0; font-size: clamp(12px, 1.5vw, 13px); line-height: 1.4; color: #0E0E10; }
.fa-dg { display: flex; gap: 7px; align-items: center; }
.fa-dg-grp { display: flex; gap: 2px; animation: faDg 2.4s ease-in-out infinite; }
.fa-dg-grp i { width: 7px; height: clamp(20px, 4vw, 30px); background: #019ACB; opacity: 0.25; border-radius: 2px; }
.fa-dg-grp:nth-child(1) { animation-delay: 0s; }
.fa-dg-grp:nth-child(2) { animation-delay: 0.3s; }
.fa-dg-grp:nth-child(3) { animation-delay: 0.6s; }
@keyframes faDg { 0%, 100% { opacity: 0.3; } 45% { opacity: 1; } }
.fa-st { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1.4vw, 10px); width: clamp(70px, 14vw, 96px); }
.fa-st span { width: clamp(8px, 1.8vw, 11px); height: clamp(8px, 1.8vw, 11px); border-radius: 50%; background: #019ACB; box-shadow: 0 0 6px rgba(1, 154, 203, 0.6); animation: faSt 2.2s ease-in-out infinite; }
@keyframes faSt { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
.fa-da { display: flex; align-items: flex-end; gap: 5px; height: clamp(56px, 12vw, 80px); }
.fa-da span { width: clamp(10px, 2.2vw, 14px); background: #019ACB; opacity: 0.3; border-radius: 3px; animation: faDa 2.4s ease-in-out infinite; }
@keyframes faDa { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }

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
export default function GcdLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
  const CurrentScreen = screens[current];

  const navLockRef = useRef(0);
  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { if (navGuard()) setCurrent(s => Math.max(s - 1, 0)); };
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
