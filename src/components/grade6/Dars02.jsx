import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import './Grade6TheoryTheme.css';
import { normalizeTtsColons } from './ttsMathColon.js';
import { useIntroStages } from './Dars01.jsx';
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
  if (!Number.isInteger(n) || n < 0 || n > 999999) return String(value);
  if (Object.prototype.hasOwnProperty.call(words, n)) return words[n];
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    const thousandPart = lang === 'ru'
      ? `${numberToWords(thousands, lang)} тысяч`
      : `${numberToWords(thousands, lang)} ming`;
    return rest ? `${thousandPart} ${numberToWords(rest, lang)}` : thousandPart;
  }
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
    /\b(\d{1,6})\s*:\s*(\d{1,6})\s*=\s*(\d{1,6})\b/g,
    (_, a, b, c) => lang === 'ru'
      ? `${numberToWords(a, lang)} разделить на ${numberToWords(b, lang)} равно ${numberToWords(c, lang)}`
      : `${numberToWords(a, lang)}ni ${numberToWords(b, lang)}ga bo'lsak, ${numberToWords(c, lang)} chiqadi`
  );
  return normalizeTtsColons(clean, { divisionWord: ops.div })
    .replace(/\s*·\s*/g, ops.mul)
    .replace(/\s*=\s*/g, ops.eq)
    .replace(/\s*\+\s*/g, ops.plus)
    .replace(/\s*[−–]\s*/g, ops.minus)
    .replace(/\b\d{1,6}\b/g, (m) => numberToWords(m, lang))
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

function pickPreviewVoice(synth, lang) {
  const voices = synth.getVoices?.() || [];
  const prefixes = lang === 'uz'
    ? ['uz', 'tr', 'az', 'en']
    : (lang === 'en' ? ['en'] : ['ru']);
  for (const prefix of prefixes) {
    const voice = voices.find((item) => String(item.lang || '').toLowerCase().startsWith(prefix));
    if (voice) return voice;
  }
  return null;
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
    this.previewStartTimer = null;
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

  clearPreviewStartTimer() {
    if (this.previewStartTimer) clearTimeout(this.previewStartTimer);
    this.previewStartTimer = null;
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
    this.clearPreviewStartTimer();
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
        if (segment._audioCompleted) return;
        this.autoplayBlocked = false;
        this.isStarting = false;
        this.isPlaying = true;
        this.emit({ isPlaying: true, isBusy: true, currentSegment: segment.id });
        this.armWatchdog(segment);
      }).catch(() => {
        if (segment._audioCompleted) return;
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
    const voice = pickPreviewVoice(synth, lang);
    if (voice) u.voice = voice;
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
    this.clearPreviewStartTimer();
    this.previewStartTimer = setTimeout(() => {
      this.previewStartTimer = null;
      if (segment._audioCompleted || this.muted) return;
      try { synth.speak(u); } catch (e) { this.completeSegment(segment); }
    }, 60);
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
    const segment = this.queue[this.currentIdx];
    const waitRule = this.waitingFor || segment?.waits_for;
    if (!waitRule) return;
    const matches = waitRule.type === eventType &&
                   (waitRule.target === target || !waitRule.target);
    if (!matches) return;

    if (!this.waitingFor && segment) {
      segment._audioCompleted = true;
      this.clearWatchdog();
      this.clearPreviewStartTimer();
      if (this.advanceTimer) clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
      if (this.audioEl) {
        try {
          this.audioEl.onended = null;
          this.audioEl.onerror = null;
          this.audioEl.pause();
        } catch (e) { /* no-op */ }
      }
      if (this.previewUtterance) {
        this.previewUtterance.onstart = null;
        this.previewUtterance.onend = null;
        this.previewUtterance.onerror = null;
        this.previewUtterance = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
      }
      this.isStarting = false;
      this.isPlaying = false;
      this.isBusy = false;
      this.hasStarted = true;
      this.waitingFor = null;
      this.currentIdx++;
      this.emit({
        isPlaying: false,
        isBusy: false,
        currentSegment: null,
        lastCompletedSegment: segment.id,
        waitingFor: null,
      });
      this.playNext();
      return;
    }

    this.waitingFor = null;
    this.currentIdx++;
    this.playNext();
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
    this.queue.push({
      id: segmentId,
      text: toTtsMath(text, this.currentLang),
      lang: this.currentLang,
      trigger: 'manual',
      waits_for: null,
      g: gender,
      pauseAfterMs,
    });
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

  interruptFeedbackQueue() {
    const currentSegment = this.queue[this.currentIdx];
    if (currentSegment) currentSegment._audioCompleted = true;
    this.clearWatchdog();
    this.clearPreviewStartTimer();
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    if (this.audioEl) {
      try {
        this.audioEl.onended = null;
        this.audioEl.onerror = null;
        this.audioEl.pause();
      } catch (e) { /* no-op */ }
    }
    this.audioEl = null;
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
    }
    this.queue = [];
    this.currentIdx = 0;
    this.waitingFor = null;
    this.isStarting = false;
    this.isPlaying = false;
    this.isBusy = false;
    this.autoplayBlocked = false;
    this.hasStarted = true;
    this.emit({
      isPlaying: false,
      isBusy: false,
      currentSegment: null,
      lastCompletedSegment: null,
      waitingFor: null,
    });
  }

  replay() {
    if (this.currentIdx > 0) this.currentIdx--;
    this.waitingFor = null;
    this.playNext();
  }

  stop() {
    this.clearWatchdog();
    this.clearPreviewStartTimer();
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
  const stableSegments = useMemo(
    () => segments?.map((segment) => ({
      ...segment,
      lang,
      text: toTtsMath(segment.text, lang),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [segmentsKey, lang],
  );

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
  const interruptFeedback = useCallback(() => {
    if (engineRef.current) engineRef.current.interruptFeedbackQueue();
  }, []);
  const speakLatestFeedback = useCallback((text, id) => {
    const engine = engineRef.current;
    if (!engine || !text || engine.muted) return null;
    engine.interruptFeedbackQueue();
    return engine.pushOneOff(text, undefined, id);
  }, []);
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.muted;
      if (engineRef.current) engineRef.current.setMuted(newMuted);
      return { ...prev, muted: newMuted };
    });
  }, []);

  return {
    ...state,
    triggerEvent,
    triggerInternal,
    replay,
    interruptFeedback,
    speakLatestFeedback,
    toggleMute,
  };
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
  const padH = isMobile ? 12 : 'clamp(16px, 4vw, 48px)';
  return (
    <div className={`stage screen-${screen + 1}`}>
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

const NavNext = ({ label, onClick }) => (
  <button className="btn-white-accent" onClick={onClick}
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
    engine.interruptFeedbackQueue();
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

const useFeedbackTimer = () => {
  const timerRef = useRef(null);
  const clearFeedbackTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);
  const scheduleFeedback = useCallback((callback) => {
    clearFeedbackTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      callback();
    }, 300);
  }, [clearFeedbackTimer]);
  useEffect(() => () => clearFeedbackTimer(), [clearFeedbackTimer]);
  return { clearFeedbackTimer, scheduleFeedback };
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
  const { clearFeedbackTimer, scheduleFeedback } = useFeedbackTimer();

  const pick = (i) => {
    if (solved) return;        // после верного — заблокировано
    if (wrong.has(i)) return;  // уже погашенный неверный — игнор
    const isCorrect = i === correctIdx;
    clearFeedbackTimer();
    if (introAdvancedRef.current) audio.interruptFeedback();

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
      const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
      scheduleFeedback(() => {
        audio.speakLatestFeedback(toTtsMath(wrongVoice, lang), `s${idx}_wrong_${i}`);
      });
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
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved && !isCorrect;        // после верного неверные сворачиваются
            let cls = 'option';
            if (collapse) cls += ' g6-option-collapsed';
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
// --- UROK: div_6_02 — Признаки делимости на 2, 5 и 10 / 2, 5 va 10 ga bo'linish alomatlari ---
// Infra grade6/Dars01 (baytma-bayt). Mobil naqsh BOSHIDAN ichida (ETALON_6SINF.md §5).
// Kontekst: do'kondagi narxlar va hisobni teng bo'lish (narxlar ming so'mda).
// Asosiy g'oya: sonni bo'lmasdan, OXIRGI RAQAMga qarab hukm qilamiz; s8 nega
// shundayligini ochadi (har bir to'la o'nlik 2, 5, 10 ga doim bo'linadi).
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_02',
  lessonTitle: { ru: 'Признаки делимости на 2, 5 и 10', uz: "2, 5 va 10 ga bo'linish alomatlari" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0  (3 narx, RASM)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (LastDigit, 2 ga)
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 3  (2 ga alomat)
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (8 : 2, ENG OSON, RASM)
  { id: 's4',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 4  (4 narxdan juftini top, RASM)
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 5  (5 ga + fakt)
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 6  (5 va 10 ga alomat)
  { id: 's7',  type: 'test',        template: 'OddOneOut',      scored: true,  scope: 'practice' }, // 7  (rasmsiz)
  { id: 's8',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 8  (NEGA oxirgi raqam)
  { id: 's9',  type: 'test',        template: 'InputScreen',    scored: true,  scope: 'practice' }, // 9  (40 : 5 = 8, RASM + fakt)
  { id: 's10', type: 'exploration', template: 'custom',         scored: false, scope: null },       // 10 (2 va 5 -> 10)
  { id: 's11', type: 'test',        template: 'DragMatch',      scored: true,  scope: 'practice' }, // 11 (rasmsiz)
  { id: 's12', type: 'test',        template: 'Classify',       scored: true,  scope: 'practice' }, // 12 (rasmsiz)
  { id: 's13', type: 'test',        template: 'InputScreen',    scored: true,  scope: 'final' },    // 13 (rasmsiz + fakt)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 14
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Тема урока', uz: 'Dars mavzusi' },
    topic: { ru: 'Признаки делимости на 2, 5 и 10', uz: "2, 5 va 10 ga bo'linish alomatlari" },
    global_q: { ru: 'Как узнать, делится ли число, не деля его?', uz: "Sonni bo'lmasdan turib, bo'linishini qanday bilamiz?" },
    lead: { ru: 'В магазине три ценника: 24, 35 и 12 тысяч сумов. Двое друзей хотят заплатить поровну. Не за каждый товар это получится.', uz: "Do'konda uchta narx: 24, 35 va 12 ming so'm. Ikki do'st teng bo'lib to'lamoqchi. Har bir narsa uchun ham bu chiqavermaydi." },
    question: { ru: 'Как думаешь, за какие товары получится заплатить поровну?', uz: "Qaysi narsalar uchun teng to'lash mumkin deb o'ylaysiz?" },
    opt_yes: { ru: 'Знаю ответ', uz: 'Javobni bilaman' },
    opt_no: { ru: 'Пока не знаю', uz: 'Hozircha bilmayman' },
    opt_idk: { ru: 'Хочу разобраться', uz: "O'rganmoqchiman" },
    audio: {
      intro: { ru: 'В магазине три ценника: двадцать четыре, тридцать пять и двенадцать тысяч сумов. Двое друзей хотят заплатить поровну, но не за каждый товар это получится. Делить каждое число в столбик долго. Сегодня сначала разберём признаки делимости и их правила, а затем применим их к этим ценам.', uz: "Do'konda uchta narx: yigirma to'rt, o'ttiz besh va o'n ikki ming so'm. Ikki do'st teng bo'lib to'lamoqchi, lekin har bir narsa uchun ham bu chiqavermaydi. Har bir sonni ustunda bo'lish uzoq. Bugun avval bo'linish alomatlari va ularning qoidalarini tushunamiz, keyin ularni shu narxlarga qo'llaymiz." },
      on_correct: { ru: 'Тогда начнём.', uz: 'Unda boshlaymiz.' },
      on_wrong: { ru: 'Тогда начнём.', uz: 'Unda boshlaymiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Начнём с простого', uz: 'Oddiydan boshlaymiz' },
    bridge: { ru: 'Сначала самый лёгкий случай.', uz: 'Avval eng oson holat.' },
    question: { ru: 'Перекус стоит 8 тысяч сумов. Двое друзей платят поровну. Сколько заплатит каждый?', uz: "Gazak 8 ming so'm turadi. Ikki do'st teng to'laydi. Har biri nechadan to'laydi?" },
    opt0: { ru: '2 тысячи', uz: '2 ming' },
    opt1: { ru: '3 тысячи', uz: '3 ming' },
    opt2: { ru: '4 тысячи', uz: '4 ming' },
    opt3: { ru: '5 тысяч', uz: '5 ming' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. 8 : 2 = 4. Каждый платит по 4 тысячи, ничего не осталось.', uz: "To'g'ri. 8 : 2 = 4. Har biri 4 mingdan to'laydi, hech narsa qolmaydi." },
    wrong_0: { ru: 'По 2 тысячи с двоих — это всего 4 тысячи. А нужно 8.', uz: "Ikki kishidan 2 mingdan — bu jami 4 ming. Kerak esa 8 ming." },
    wrong_1: { ru: 'По 3 тысячи с двоих — это 6 тысяч. До 8 не хватает.', uz: "Ikki kishidan 3 mingdan — bu 6 ming. 8 gacha yetmaydi." },
    wrong_3: { ru: 'По 5 тысяч с двоих — это 10 тысяч. Это больше, чем нужно.', uz: "Ikki kishidan 5 mingdan — bu 10 ming. Bu keragidan ko'p." },
    audio: {
      intro: { ru: 'Начнём с простого. Перекус стоит восемь тысяч сумов, двое друзей платят поровну. Сколько заплатит каждый? Выбери ответ.', uz: "Oddiydan boshlaymiz. Gazak sakkiz ming so'm turadi, ikki do'st teng to'laydi. Har biri nechadan to'laydi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Восемь разделилось на два без остатка.', uz: "To'g'ri. Sakkiz ikkiga qoldiqsiz bo'lindi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Смотрим на последнюю цифру', uz: 'Oxirgi raqamga qaraymiz' },
    bridge: { ru: 'Проверим несколько цен: какие из них делятся на 2 поровну?', uz: "Bir nechta narxni tekshiramiz: qaysilari 2 ga teng bo'linadi?" },
    audio: {
      ru: [
        'Двенадцать тысяч делится на два, по шесть тысяч с каждого. Последняя цифра здесь два.',
        'Пятнадцать тысяч на два поровну не делится, одна тысяча лишняя. Последняя цифра пять.',
        'Двадцать четыре делится, по двенадцать. Последняя цифра четыре.',
        'Тридцать семь не делится. Последняя цифра семь. Заметил закономерность? Всё решает только последняя цифра.'
      ],
      uz: [
        "O'n ikki ming ikkiga bo'linadi, har biriga olti mingdan. Bu yerda oxirgi raqam ikki.",
        "O'n besh ming ikkiga teng bo'linmaydi, bir ming ortib qoladi. Oxirgi raqam besh.",
        "Yigirma to'rt bo'linadi, o'n ikkitadan. Oxirgi raqam to'rt.",
        "O'ttiz yetti bo'linmaydi. Oxirgi raqam yetti. Qonuniyatni payqadingizmi? Hammasini faqat oxirgi raqam hal qiladi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Признак делимости на 2', uz: "2 ga bo'linish alomati" },
    rule_1: { ru: 'Число делится на 2 тогда и только тогда, когда его последняя цифра чётная.', uz: "Son 2 ga bo'linadi, agar uning oxirgi raqami juft bo'lsa." },
    rule_2: { ru: 'Подходящие последние цифры: 0, 2, 4, 6, 8. Такие числа называют чётными.', uz: "Mos keladigan oxirgi raqamlar: 0, 2, 4, 6, 8. Bunday sonlar juft sonlar deyiladi." },
    audio: { ru: 'Запомним первое правило. Число делится на два тогда и только тогда, когда его последняя цифра чётная. Подходящие последние цифры это ноль, два, четыре, шесть и восемь. Такие числа называют чётными.', uz: "Birinchi qoidani eslab qolamiz. Son ikkiga bo'linadi, agar uning oxirgi raqami juft bo'lsa. Mos keladigan oxirgi raqamlar bu nol, ikki, to'rt, olti va sakkiz. Bunday sonlar juft sonlar deyiladi." }
  },

  s4: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    bridge: { ru: 'Теперь применим правило.', uz: "Endi qoidani qo'llaymiz." },
    question: { ru: 'За какой из этих товаров двое смогут заплатить поровну?', uz: "Bu narsalarning qaysi biri uchun ikki kishi teng to'lay oladi?" },
    opt0: { ru: '35 тысяч', uz: "35 ming" },
    opt1: { ru: '24 тысячи', uz: "24 ming" },
    opt2: { ru: '17 тысяч', uz: "17 ming" },
    opt3: { ru: '51 тысяча', uz: "51 ming" },
    correctIndex: 1,
    correct_text: { ru: 'Верно. У числа 24 последняя цифра 4 — она чётная, значит 24 делится на 2. Каждый платит по 12 тысяч.', uz: "To'g'ri. 24 sonining oxirgi raqami 4 — u juft, demak 24 soni 2 ga bo'linadi. Har biri 12 mingdan to'laydi." },
    wrong_0: { ru: 'Последняя цифра 5 — нечётная. Значит, 35 на 2 поровну не делится.', uz: "Oxirgi raqam 5 — toq. Demak, 35 soni 2 ga teng bo'linmaydi." },
    wrong_2: { ru: 'Последняя цифра 7 — нечётная. Одна тысяча останется лишней.', uz: "Oxirgi raqam 7 — toq. Bir ming ortib qoladi." },
    wrong_3: { ru: 'Последняя цифра 1 — нечётная. Смотри именно на последнюю цифру, а не на первую.', uz: "Oxirgi raqam 1 — toq. Birinchi raqamga emas, aynan oxirgisiga qarang." },
    audio: {
      intro: { ru: 'Теперь применим правило. За какой из этих товаров двое смогут заплатить поровну? Смотри на последнюю цифру. Выбери ответ.', uz: "Endi qoidani qo'llaymiz. Bu narsalarning qaysi biri uchun ikki kishi teng to'lay oladi? Oxirgi raqamga qarang. Javobni tanlang." },
      on_correct: { ru: 'Верно. Последняя цифра чётная.', uz: "To'g'ri. Oxirgi raqam juft." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'А если платят пятеро?', uz: "Agar besh kishi to'lasa-chi?" },
    bridge: { ru: 'Теперь счёт делят пять друзей. Посмотрим, какие суммы подходят.', uz: "Endi hisobni besh do'st bo'lishadi. Qaysi summalar mos kelishini ko'ramiz." },
    fact: { ru: 'Ценники часто заканчиваются на 0 или 5 не случайно: такую сумму легко разделить и легко отсчитать сдачу. Поэтому в магазинах почти не встретишь цену вроде 37 тысяч.', uz: "Narxlar ko'pincha 0 yoki 5 bilan tugashi bejiz emas: bunday summani bo'lish ham, qaytimini sanash ham oson. Shuning uchun do'konlarda 37 ming kabi narxni deyarli uchratmaysiz." },
    fact_audio: { ru: 'Знаешь ли ты? Ценники часто заканчиваются на ноль или пять не случайно. Такую сумму легко разделить и легко отсчитать сдачу. Поэтому в магазинах почти не встретишь цену вроде тридцати семи тысяч.', uz: "Bilasizmi? Narxlar ko'pincha nol yoki besh bilan tugashi bejiz emas. Bunday summani bo'lish ham, qaytimini sanash ham oson. Shuning uchun do'konlarda o'ttiz yetti ming kabi narxni deyarli uchratmaysiz." },
    audio: {
      ru: [
        'Пятнадцать тысяч на пятерых это по три тысячи. Последняя цифра пять.',
        'Двадцать тысяч на пятерых по четыре тысячи. Последняя цифра ноль.',
        'А вот двадцать три на пятерых поровну не делятся. Значит, для деления на пять подходят только две последние цифры: ноль и пять.'
      ],
      uz: [
        "O'n besh ming besh kishiga uch mingdan tushadi. Oxirgi raqam besh.",
        "Yigirma ming besh kishiga to'rt mingdan. Oxirgi raqam nol.",
        "Yigirma uch esa besh kishiga teng bo'linmaydi. Demak, beshga bo'linish uchun faqat ikkita oxirgi raqam mos keladi: nol va besh."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Признаки делимости на 5 и на 10', uz: "5 va 10 ga bo'linish alomatlari" },
    rule_1: { ru: 'Число делится на 5, если его последняя цифра 0 или 5.', uz: "Son 5 ga bo'linadi, agar uning oxirgi raqami 0 yoki 5 bo'lsa." },
    rule_2: { ru: 'Число делится на 10, если его последняя цифра 0. Это самый строгий случай — подходит только ноль.', uz: "Son 10 ga bo'linadi, agar uning oxirgi raqami 0 bo'lsa. Bu eng qattiq holat — faqat nol mos keladi." },
    audio: { ru: 'Ещё два правила. Число делится на пять, если его последняя цифра ноль или пять. И число делится на десять, если его последняя цифра ноль. Это самый строгий случай, подходит только ноль.', uz: "Yana ikkita qoida. Son beshga bo'linadi, agar uning oxirgi raqami nol yoki besh bo'lsa. Va son o'nga bo'linadi, agar uning oxirgi raqami nol bo'lsa. Bu eng qattiq holat, faqat nol mos keladi." }
  },

  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    question: { ru: 'Найди цену, которую пятеро НЕ смогут разделить поровну', uz: "Besh kishi teng bo'la OLMAYDIGAN narxni toping" },
    lead: { ru: 'Смотри только на последнюю цифру каждой цены.', uz: "Har bir narxning faqat oxirgi raqamiga qarang." },
    items: [
      { num: '15' },
      { num: '25' },
      { num: '30' },
      { num: '42' },
      { num: '45' }
    ],
    errorIdx: 3,
    correct_text: { ru: 'Верно. У 42 последняя цифра 2 — это не 0 и не 5. Остальные цены оканчиваются на 5 или 0, поэтому делятся на 5.', uz: "To'g'ri. 42 sonining oxirgi raqami 2 — bu 0 ham, 5 ham emas. Qolgan narxlar 5 yoki 0 bilan tugaydi, shuning uchun 5 ga bo'linadi." },
    wrong_0: { ru: '15 оканчивается на 5, значит делится на 5. Ищи ту цену, у которой последняя цифра не 0 и не 5.', uz: "15 soni 5 bilan tugaydi, demak 5 ga bo'linadi. Oxirgi raqami 0 ham, 5 ham bo'lmagan narxni qidiring." },
    wrong_1: { ru: '25 оканчивается на 5 — делится. Проверь последние цифры остальных.', uz: "25 soni 5 bilan tugaydi — bo'linadi. Qolganlarining oxirgi raqamini tekshiring." },
    wrong_2: { ru: '30 оканчивается на 0 — делится и на 5, и на 10. Ищи дальше.', uz: "30 soni 0 bilan tugaydi — 5 ga ham, 10 ga ham bo'linadi. Yana qidiring." },
    wrong_4: { ru: '45 оканчивается на 5 — делится. Осталась одна цена, которая выбивается.', uz: "45 soni 5 bilan tugaydi — bo'linadi. Qatorga tushmaydigan bitta narx qoldi." },
    audio: {
      intro: { ru: 'Смотри только на последнюю цифру. Найди цену, которую пятеро не смогут разделить поровну.', uz: "Faqat oxirgi raqamga qarang. Besh kishi teng bo'la olmaydigan narxni toping." },
      on_correct: { ru: 'Верно. Последняя цифра два — это не ноль и не пять.', uz: "To'g'ri. Oxirgi raqam ikki — bu nol ham, besh ham emas." },
      on_wrong: { ru: 'Эта цена делится на пять. Ищи дальше.', uz: "Bu narx beshga bo'linadi. Yana qidiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Почему решает последняя цифра', uz: 'Nega oxirgi raqam hal qiladi' },
    bridge: { ru: 'Разложим сумму на целые десятки и отдельные единицы.', uz: "Summani to'la o'nliklarga va yakka birliklarga ajratamiz." },
    audio: {
      ru: [
        'Возьмём двадцать четыре тысячи. Это два полных десятка и ещё четыре.',
        'Каждый десяток делится и на два, и на пять, и на десять. Значит, десятки нам мешать не могут, что бы мы ни делили.',
        'Остаются только единицы, то есть последняя цифра. Именно она и решает. Поэтому правило работает для любого числа, хоть для миллиона.'
      ],
      uz: [
        "Yigirma to'rt mingni olamiz. Bu ikkita to'la o'nlik va yana to'rtta birlik.",
        "Har bir o'nlik ikkiga ham, beshga ham, o'nga ham bo'linadi. Demak, nimani bo'lsak ham, o'nliklar bizga xalaqit bera olmaydi.",
        "Faqat birliklar, ya'ni oxirgi raqam qoladi. Aynan o'sha hal qiladi. Shuning uchun bu qoida har qanday son uchun, hatto million uchun ham ishlaydi."
      ]
    }
  },

  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    label: { ru: 'делим счёт', uz: "hisobni bo'lamiz" },
    context: { ru: 'Общий счёт — 40 тысяч сумов, платят 5 друзей.', uz: "Umumiy hisob — 40 ming so'm, 5 do'st to'laydi." },
    question: { ru: 'Сколько тысяч заплатит каждый из пятерых?', uz: "Besh kishidan har biri necha ming to'laydi?" },
    answer: '8',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно. Последняя цифра 0, значит 40 делится на 5: 40 : 5 = 8. Каждый платит по 8 тысяч.', uz: "To'g'ri. Oxirgi raqam 0, demak 40 soni 5 ga bo'linadi: 40 : 5 = 8. Har biri 8 mingdan to'laydi." },
    hint: { ru: 'Сначала проверь последнюю цифру: 0 — значит делится. Потом раздели 40 на 5.', uz: "Avval oxirgi raqamni tekshiring: 0 — demak bo'linadi. So'ng 40 ni 5 ga bo'ling." },
    fact: { ru: 'Признак делимости на 10 — самый быстрый в математике: достаточно взглянуть на одну цифру. Именно поэтому мы так легко считаем десятками.', uz: "10 ga bo'linish alomati matematikadagi eng tez alomat: bitta raqamga qarash kifoya. Aynan shuning uchun biz o'nlab sanashni oson bajaramiz." },
    fact_audio: { ru: 'Знаешь ли ты? Признак делимости на десять самый быстрый в математике: достаточно взглянуть на одну цифру. Именно поэтому мы так легко считаем десятками.', uz: "Bilasizmi? O'nga bo'linish alomati matematikadagi eng tez alomat: bitta raqamga qarash kifoya. Aynan shuning uchun biz o'nlab sanashni oson bajaramiz." },
    audio: {
      intro: { ru: 'Общий счёт сорок тысяч сумов, платят пятеро друзей. Сколько тысяч заплатит каждый? Набери ответ.', uz: "Umumiy hisob qirq ming so'm, besh do'st to'laydi. Har biri necha ming to'laydi? Javobni tering." },
      on_correct: { ru: 'Верно, по восемь тысяч.', uz: "To'g'ri, sakkiz mingdan." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Когда работают сразу два признака', uz: 'Ikki alomat birga ishlaganda' },
    bridge: { ru: 'Посмотрим на цену 30 тысяч.', uz: "30 ming so'mlik narxga qaraymiz." },
    audio: {
      ru: [
        'Последняя цифра ноль. Ноль чётный, значит тридцать делится на два.',
        'Ноль подходит и для пятёрки, значит тридцать делится на пять.',
        'А число, которое делится и на два, и на пять, обязательно делится на десять. Поэтому цены с нулём на конце делятся сразу на всё это.'
      ],
      uz: [
        "Oxirgi raqam nol. Nol juft, demak o'ttiz soni ikkiga bo'linadi.",
        "Nol beshga ham mos keladi, demak o'ttiz soni beshga ham bo'linadi.",
        "Ikkiga ham, beshga ham bo'linadigan son esa albatta o'nga bo'linadi. Shuning uchun oxiri nol bilan tugagan narxlar bularning hammasiga birdan bo'linadi."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'На что делится эта цена?', uz: "Bu narx nimalarga bo'linadi?" },
    lead: { ru: 'Для каждой цены выбери верную строку, ориентируясь на последнюю цифру.', uz: "Har bir narxning oxirgi raqamiga qarab, mos qatorni tanlang." },
    pairs: [
      { number: '24', label: { ru: 'тысяч', uz: 'ming' }, reading: { ru: 'только на 2', uz: "faqat 2 ga" } },
      { number: '45', label: { ru: 'тысяч', uz: 'ming' }, reading: { ru: 'только на 5', uz: "faqat 5 ga" } },
      { number: '30', label: { ru: 'тысяч', uz: 'ming' }, reading: { ru: 'на 2, на 5 и на 10', uz: "2 ga, 5 ga va 10 ga" } }
    ],
    correct_text: { ru: 'Верно. Последняя цифра 4 — только чётность. Цифра 5 — только пятёрка. Цифра 0 — сразу все три признака.', uz: "To'g'ri. Oxirgi raqam 4 — faqat juftlik. 5 raqami — faqat beshlik. 0 raqami — uchala alomat birdan." },
    hint: { ru: 'Чётные последние цифры: 0, 2, 4, 6, 8. Для пятёрки: 0 и 5. Для десятки: только 0.', uz: "Juft oxirgi raqamlar: 0, 2, 4, 6, 8. Beshlik uchun: 0 va 5. O'nlik uchun: faqat 0." },
    audio: {
      intro: { ru: 'Для каждой цены выбери верную строку. Нажми на цену, потом выбери строку из списка.', uz: "Har bir narx uchun to'g'ri qatorni tanlang. Narxga bosing, so'ng ro'yxatdan qatorni tanlang." },
      on_correct: { ru: 'Верно, все строки на местах.', uz: "To'g'ri, barcha qatorlar o'z o'rniga tushdi." },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Двое смогут разделить поровну?', uz: "Ikki kishi teng bo'la oladimi?" },
    lead: { ru: 'Разбери цены на две группы по последней цифре.', uz: "Narxlarni oxirgi raqamiga qarab ikki guruhga ajrating." },
    bin_a: { ru: 'Делится на 2', uz: "2 ga bo'linadi" },
    bin_b: { ru: 'Не делится на 2', uz: "2 ga bo'linmaydi" },
    cards: [
      { label: '18', bin: 'a' },
      { label: '25', bin: 'b' },
      { label: '34', bin: 'a' },
      { label: '47', bin: 'b' },
      { label: '60', bin: 'a' },
      { label: '73', bin: 'b' }
    ],
    hint: { ru: 'Закрой все цифры, кроме последней. Она чётная или нет?', uz: "Oxirgisidan boshqa hamma raqamni yoping. U juftmi yoki yo'qmi?" },
    correct_text: { ru: 'Точно. 18, 34 и 60 оканчиваются на 8, 4 и 0 — все чётные. А 25, 47 и 73 оканчиваются на 5, 7 и 3 — нечётные.', uz: "Aniq. 18, 34 va 60 sonlari 8, 4 va 0 bilan tugaydi — hammasi juft. 25, 47 va 73 esa 5, 7 va 3 bilan tugaydi — toq." },
    audio: {
      intro: { ru: 'Разбери цены на две группы. Делится на два или нет? Смотри только на последнюю цифру.', uz: "Narxlarni ikki guruhga ajrating. Ikkiga bo'linadimi yoki yo'qmi? Faqat oxirgi raqamga qarang." },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi." },
      on_wrong: { ru: 'Не сюда.', uz: 'Bu yerga emas.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
    label: { ru: 'финальная задача', uz: 'yakuniy masala' },
    context: { ru: 'В прайсе магазина все цены от 1 до 50 тысяч.', uz: "Do'kon ro'yxatida barcha narxlar 1 dan 50 minggacha." },
    question: { ru: 'Сколько из чисел от 1 до 50 делятся на 10?', uz: "1 dan 50 gacha bo'lgan sonlardan nechtasi 10 ga bo'linadi?" },
    answer: '5',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно, 5 чисел: 10, 20, 30, 40 и 50. Только у них последняя цифра 0.', uz: "To'g'ri, 5 ta son: 10, 20, 30, 40 va 50. Faqat ularning oxirgi raqami 0." },
    hint: { ru: 'На 10 делятся только числа с нулём на конце. Перечисли их по порядку до 50.', uz: "10 ga faqat oxiri nol bilan tugagan sonlar bo'linadi. Ularni 50 gacha tartib bilan sanang." },
    fact: { ru: 'Чисел, кратных 10, ровно в два раза меньше, чем кратных 5, и в пять раз меньше, чем чётных. Чем строже признак, тем реже такие числа встречаются.', uz: "10 ga karrali sonlar 5 ga karrali sonlardan roppa-rosa ikki barobar kam, juft sonlardan esa besh barobar kam. Alomat qanchalik qattiq bo'lsa, bunday sonlar shunchalik kam uchraydi." },
    fact_audio: { ru: 'Знаешь ли ты? Чисел, кратных десяти, ровно в два раза меньше, чем кратных пяти, и в пять раз меньше, чем чётных. Чем строже признак, тем реже такие числа встречаются.', uz: "Bilasizmi? O'nga karrali sonlar beshga karrali sonlardan roppa-rosa ikki barobar kam, juft sonlardan esa besh barobar kam. Alomat qanchalik qattiq bo'lsa, bunday sonlar shunchalik kam uchraydi." },
    audio: {
      intro: { ru: 'Финальная задача. Сколько из чисел от одного до пятидесяти делятся на десять? Набери ответ.', uz: "Yakuniy masala. Bir dan ellikkacha bo'lgan sonlardan nechtasi o'nga bo'linadi? Javobni tering." },
      on_correct: { ru: 'Верно, пять чисел.', uz: "To'g'ri, besh ta son." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi" },
    heading: { ru: 'Делимость на 2, 5 и 10', uz: "2, 5 va 10 ga bo'linish" },
    score_label: { ru: 'Ваш результат по заданиям:', uz: "Topshiriqlar bo'yicha natijangiz:" },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'На 2 делятся числа с последней цифрой 0, 2, 4, 6, 8 — их называют чётными.', uz: "2 ga oxirgi raqami 0, 2, 4, 6, 8 bo'lgan sonlar bo'linadi — ular juft sonlar deyiladi." },
    main_2: { ru: 'На 5 делятся числа с последней цифрой 0 или 5. На 10 — только с последней цифрой 0.', uz: "5 ga oxirgi raqami 0 yoki 5 bo'lgan sonlar bo'linadi. 10 ga esa faqat oxirgi raqami 0 bo'lganlari." },
    main_3: { ru: 'Работает это потому, что каждый целый десяток делится и на 2, и на 5, и на 10. Решают только единицы.', uz: "Bu shuning uchun ishlaydiki, har bir to'la o'nlik 2 ga ham, 5 ga ham, 10 ga ham bo'linadi. Faqat birliklar hal qiladi." },
    hook_close: { ru: 'Теперь ясно: за товар в 24 тысячи двое заплатят поровну, а за 35 тысяч — нет. И делить в столбик для этого не нужно.', uz: "Endi aniq: 24 minglik narsa uchun ikki kishi teng to'laydi, 35 minglik uchun esa yo'q. Buning uchun ustunda bo'lish ham shart emas." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Nimaga tayanadi' },
    conn_refs: { ru: 'делители и кратные из прошлого урока', uz: "o'tgan darsdagi bo'luvchi va karrali sonlar" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'признаки делимости на 3 и 9', uz: "3 va 9 ga bo'linish alomatlari" },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'На два делятся числа с последней цифрой ноль, два, четыре, шесть, восемь. На пять с последней цифрой ноль или пять. На десять только с нулём.',
        'Работает это потому, что каждый целый десяток делится и на два, и на пять, и на десять, поэтому решают только единицы. Дальше разберём признаки делимости на три и девять.'
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Ikkiga oxirgi raqami nol, ikki, to'rt, olti, sakkiz bo'lgan sonlar bo'linadi. Beshga oxirgi raqami nol yoki besh bo'lganlari. O'nga esa faqat nol bilan tugaganlari.",
        "Bu shuning uchun ishlaydiki, har bir to'la o'nlik ikkiga ham, beshga ham, o'nga ham bo'linadi, shuning uchun faqat birliklar hal qiladi. Keyin uch va to'qqizga bo'linish alomatlarini ko'rib chiqamiz."
      ]
    }
  }
};

// ============================================================
// SHUFFLE / FORMAT / ANIM HELPERS (div_6_02)
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
// NARX + PUL — darsning asosiy vizual modeli.
// Asosiy g'oya: summani bo'lib ko'rmasdan, OXIRGI RAQAMga qarab hukm qilamiz.
// Shuning uchun markaziy komponent — LastDigit (oxirgi raqam ajratilgan son).
// ============================================================
const CoinIcon = ({ s = 18, tone = 'gold' }) => {
  const face = tone === 'rest' ? '#FFD8CE' : '#F6C453';
  const edge = tone === 'rest' ? '#FF4F28' : '#C9922B';
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" fill={edge}/>
      <circle cx="12" cy="12" r="8" fill={face}/>
      <circle cx="12" cy="12" r="8" fill="none" stroke={edge} strokeWidth="0.9" opacity="0.6"/>
    </svg>
  );
};

// Narx yorlig'i: son + birlik. Do'kondagi narx shaklida.
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

// Darsning yuragi: son yoziladi, OXIRGI raqam alohida katakda ajratiladi.
// tone: 'ok' (bo'linadi) / 'no' (bo'linmaydi) / 'plain' (hali hukm yo'q).
const LastDigit = ({ value, tone = 'plain', size = 'md' }) => {
  const s = String(value);
  const head = s.slice(0, -1);
  const tail = s.slice(-1);
  const col = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : T.ink2);
  const bg = tone === 'ok' ? '#E3F0E8' : (tone === 'no' ? '#FFE8E1' : '#F1EFE9');
  const fs = size === 'lg' ? 'clamp(28px, 6.5vw, 46px)' : 'clamp(20px, 4.6vw, 32px)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'stretch', gap: 3 }}>
      {head && <span className="mono" style={{ fontSize: fs, fontWeight: 700, color: T.ink, lineHeight: 1.15, padding: '2px 1px' }}>{head}</span>}
      <span className="ld-cell mono" style={{ fontSize: fs, color: col, background: bg, borderColor: col }}>{tail}</span>
    </span>
  );
};

// Summani `people` kishiga teng bo'lish. Bo'linmasa — qolgan qism aksentda.
const SplitPay = ({ total, people, unit, restLabel }) => {
  const per = Math.floor(total / people);
  const rest = total % people;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 'clamp(6px, 1.5vw, 10px)' }}>
      {Array.from({ length: people }).map((_, i) => (
        <div key={i} className="sp-person" style={{ animationDelay: `${i * 0.06}s` }}>
          <CoinIcon s={16}/>
          <span className="mono" style={{ fontSize: 'clamp(13px, 2.6vw, 17px)', fontWeight: 700, color: T.ink }}>{per}</span>
          {unit && <span className="mono" style={{ fontSize: 'clamp(8px, 1.7vw, 10px)', color: T.ink3 }}>{unit}</span>}
        </div>
      ))}
      {rest > 0 && (
        <div className="sp-rest">
          <CoinIcon s={16} tone="rest"/>
          <span className="mono" style={{ fontSize: 'clamp(13px, 2.6vw, 17px)', fontWeight: 700, color: T.accent }}>{rest}</span>
          <span className="mono" style={{ fontSize: 'clamp(8px, 1.7vw, 10px)', color: T.accent }}>{restLabel}</span>
        </div>
      )}
    </div>
  );
};

// "Nega oxirgi raqam?" ekrani uchun: son = to'la o'nliklar + yakka birliklar.
// To'la o'nlik doim 2, 5 va 10 ga bo'linadi — demak faqat birliklar hal qiladi.
const TensOnes = ({ value, dimTens = false }) => {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)' }}>
      {Array.from({ length: tens }).map((_, i) => (
        <span key={i} className="to-ten" style={{ opacity: dimTens ? 0.35 : 1, animationDelay: `${i * 0.07}s` }}>10</span>
      ))}
      {ones > 0 && (
        <span className="to-ones">
          {Array.from({ length: ones }).map((_, i) => (<CoinIcon key={i} s={15} tone="rest"/>))}
        </span>
      )}
    </div>
  );
};

// Bo'luvchilar chiplari — qoida ekranlarida ruxsat etilgan oxirgi raqamlar uchun.
const DivisorChips = ({ list, active = -1 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.4vw, 10px)' }}>
    {list.map((d, i) => (
      <span key={i} className="dv-chip" style={{ animationDelay: `${i * 0.07}s`, background: active === i ? T.accentSoft : '#FFFFFF', color: active === i ? T.accent : T.ink, borderColor: active === i ? T.accent : 'rgba(167, 166, 162, 0.35)' }}>{d}</span>
    ))}
  </div>
);

// Karralar yo'lakchasi: base, 2*base, 3*base ... `active` tagacha yonadi.
const MultiplesTrack = ({ base, count, active = -1 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(5px, 1.2vw, 9px)' }}>
    {Array.from({ length: count }).map((_, i) => {
      const on = i <= active;
      return (
        <React.Fragment key={i}>
          {i > 0 && <span className="mono small" style={{ color: T.ink3 }}>·</span>}
          <span className="mono" style={{ padding: 'clamp(5px,1.1vw,8px) clamp(9px,1.8vw,13px)', borderRadius: 10, fontSize: 'clamp(14px, 2.6vw, 19px)', fontWeight: 600, background: on ? T.accentSoft : 'transparent', color: on ? T.accent : T.ink3, transition: 'background 0.35s ease, color 0.35s ease' }}>{base * (i + 1)}</span>
        </React.Fragment>
      );
    })}
    <span className="mono small" style={{ color: T.ink3 }}>…</span>
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
const StepLinesAccum = ({ lines, step, className = '' }) => (
  <div className={`g6-step-lines ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 12px)' }}>
    {lines.slice(0, step + 1).map((ln, i) => {
      const isCurrent = i === step;
      return (
        <div key={i} className={`${isCurrent ? 'fade-up ' : ''}frame-tip g6-explanation-step`} style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
          <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
          <p className="body g6-explanation-text" style={{ margin: 0, color: T.ink2 }}>{ln}</p>
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
  const { clearFeedbackTimer, scheduleFeedback } = useFeedbackTimer();
  const isCorrect = norm(value) === norm(c.answer) && norm(value) !== '';

  const changeValue = (nextValue) => {
    if (showHint) {
      clearFeedbackTimer();
      audio.interruptFeedback();
    }
    setValue(nextValue);
  };

  const submit = () => {
    if (norm(value) === '' || solved) return;
    clearFeedbackTimer();
    audio.interruptFeedback();
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.question[lang], options: null, correctIndex: null, correctAnswer: c.answer, studentAnswerIndex: null, studentAnswer: String(value), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); sfx.playCorrect(); post.start(); } else { setShowHint(true); sfx.playWrong(); }
    if (!isCorrect && !audio.muted) {
      scheduleFeedback(() => {
        audio.speakLatestFeedback(toTtsMath(c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang), `s${screen}_wrong`);
      });
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <div className="fade-up">
          <p className="eyebrow" style={{ color: T.accent }}>{t(c.eyebrow)} · {t(c.label)}</p>
          {c.context && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.context)}</p>}
          <h2 className="title h-sub" style={{ marginTop: 8 }}>{t(c.question)}</h2>
        </div>
        {figureNode && <div className="frame fade-up delay-1" style={{ padding: 'clamp(12px, 2.2vw, 18px)' }}>{figureNode}</div>}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <input type="text" inputMode="numeric" className={`answer-input ${solved ? 'correct' : (showHint ? 'wrong' : '')}`} value={value} placeholder={t(c.placeholder)} onChange={e => changeValue(e.target.value)} disabled={solved} onKeyDown={e => e.key === 'Enter' && submit()} style={{ width: 'min(100%, 320px)' }}/>
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
  const { clearFeedbackTimer, scheduleFeedback } = useFeedbackTimer();

  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isC = i === correctIdx;
    clearFeedbackTimer();
    if (advancedRef.current) audio.interruptFeedback();
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
      const wrongVoice = (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
      scheduleFeedback(() => {
        audio.speakLatestFeedback(toTtsMath(wrongVoice, lang), `s${screen}_wrong_${i}`);
      });
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
            if (collapse) cls += ' g6-option-collapsed';
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
  const { clearFeedbackTimer, scheduleFeedback } = useFeedbackTimer();

  const tap = (bin) => {
    if (solved) return;
    const isC = bin === cards[cardIdx].bin;
    clearFeedbackTimer();
    if (advancedRef.current) audio.interruptFeedback();
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
      if (!audio.muted) {
        scheduleFeedback(() => {
          audio.speakLatestFeedback(toTtsMath(c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang), `s${screen}_wrong`);
        });
      }
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
  const { clearFeedbackTimer, scheduleFeedback } = useFeedbackTimer();
  // Slot bosilganda pastda ochiladigan variantlar ro'yxati — tap natijasi, mobilda
  // ekrandan pastda qolmasligi uchun ko'rinishga olib kelinadi.
  const optionsRef = useRevealScroll(!solved && activeSlot !== null);

  const allPlaced = assign.every(a => a !== null);
  const isCorrect = assign.every((a, k) => a === k);
  const slotOf = (pairIdx) => assign.findIndex(a => a === pairIdx);

  const assignToActive = (pairIdx) => {
    if (solved || activeSlot === null) return;
    if (showHint) {
      clearFeedbackTimer();
      audio.interruptFeedback();
    }
    setAssign(prev => { const nx = prev.map(a => (a === pairIdx ? null : a)); nx[activeSlot] = pairIdx; return nx; });
    setActiveSlot(null);
  };
  const clearSlot = (k, e) => {
    if (e) e.stopPropagation();
    if (solved) return;
    if (showHint) {
      clearFeedbackTimer();
      audio.interruptFeedback();
    }
    setAssign(prev => { const nx = [...prev]; nx[k] = null; return nx; });
  };

  const check = () => {
    if (solved || !allPlaced) return;
    clearFeedbackTimer();
    audio.interruptFeedback();
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    audio.triggerEvent('check_pressed');
    onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'match', studentAnswer: JSON.stringify(assign), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); setActiveSlot(null); sfx.playCorrect(); post.start(); } else { setShowHint(true); sfx.playWrong(); }
    if (!isCorrect && !audio.muted) {
      scheduleFeedback(() => {
        audio.speakLatestFeedback(toTtsMath(c.audio.on_wrong[lang] + ' ' + c.hint[lang], lang), `s${screen}_wrong`);
      });
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || audio.isBusy} onClick={onNext} label={<NextLabel/>}/></>);
  const readingFont = isMobile ? 'clamp(12px, 3.4vw, 14px)' : 'clamp(13px, 1.7vw, 15px)';
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="g6-match-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(c.lead)}</p>}
        </div>
        <div className="fade-up delay-1 g6-match-rows" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          <div ref={optionsRef} className="fade-up g6-match-options" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
// Qiyinlik pog'onasi: 8 -> 12/15/24/37 -> 40 -> 50 gacha sanash.
// Rasmli: s0, s1, s2, s3, s4, s5, s6, s8, s9, s10.
// Rasmsiz (faqat oxirgi raqamga qarab): s7, s11, s12, s13.
// ============================================================
const UNIT = { ru: 'тыс.', uz: 'ming' };

const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: `${lang === 'uz' ? `Dars mavzusi: ${c.topic.uz}. ` : `Тема урока: ${c.topic.ru}. `}${c.audio.intro[lang]}`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const introReady = audio.muted || (audio.hasStarted && !audio.isBusy);
  const introStages = useIntroStages({ start: introReady, optionsReady: introReady });
  const optionsRef = useRevealScroll(introStages.showOptions);
  const pick = (v) => { if (pickedRef.current) return; pickedRef.current = true; setPicked(v); onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: v, correct: true }); audio.triggerEvent('option_picked'); setTimeout(onNext, 300); };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className="g6-custom-hook" style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.2vw, 18px)', textAlign: 'center' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.accent }}>{t(c.eyebrow)}</p>
        <h1 className="display fade-up" style={{ position: 'relative', width: '100%', margin: 0, color: T.ink, fontFamily: "'Source Serif 4', Georgia, serif", fontSize: introStages.compact ? 'clamp(30px, 6vw, 48px)' : 'clamp(38px, 8vw, 64px)', fontWeight: 600, fontVariationSettings: '"opsz" 60', lineHeight: 1.14, textAlign: 'center', transform: introStages.compact ? 'translateY(-7px)' : 'none', transition: 'font-size 1.2s cubic-bezier(.2,.7,.3,1), transform 1.2s cubic-bezier(.2,.7,.3,1)' }}>{t(c.topic)}</h1>
        <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: 'clamp(64px, 16vw, 104px)', height: 5, margin: 'clamp(4px,1vw,8px) 0', borderRadius: 99, background: T.accent, boxShadow: '0 0 14px rgba(255,79,40,.45)' }}/>
        <h2 className="body fade-up delay-1" style={{ position: 'relative', maxWidth: '38ch', margin: 0, fontSize: 'clamp(18px, 2.8vw, 21px)', fontWeight: 600, lineHeight: 1.35, textAlign: 'center' }}>{t(c.global_q)}</h2>
        <p className="body fade-up delay-1" style={{ position: 'relative', maxWidth: '62ch', color: T.ink2, margin: 0, textAlign: 'center' }}>{t(c.lead)}</p>
        {introStages.showExample && (
          <>
          <div className="frame fade-up" style={{ position: 'relative', width: '100%', maxWidth: 760, minHeight: 128, alignSelf: 'center', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 14px)', padding: 'clamp(14px, 2.5vw, 18px)', animationDuration: '1.2s' }}>
            {[24, 35, 12].map(v => (<PriceTag key={v} value={v} unit={t(UNIT)} size="lg"/>))}
          </div>
          <div ref={optionsRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'center', gap: 10, width: '100%', maxWidth: 760 }}>
            <div style={{ minHeight: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="small" style={{ margin: 0, color: '#43855F', fontSize: 'clamp(18px, 2.9vw, 21px)', fontWeight: 500, lineHeight: 1.25, textAlign: 'center', opacity: introStages.showPrompt ? 1 : 0, transition: 'opacity 1.05s ease' }}>{lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Готовы начать?'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 760, opacity: introStages.showOptions ? 1 : 0, visibility: introStages.showOptions ? 'visible' : 'hidden', transform: introStages.showOptions ? 'none' : 'translateY(18px)', transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.7,.3,1)' }}>
              <button className="option" style={{ minHeight: 58, padding: 'clamp(14px, 2.5vw, 18px) clamp(18px, 3vw, 24px)', textAlign: 'center', border: '2px solid #D8D3C8', background: '#FFFFFF', color: '#0E0E10', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(18px, 3.2vw, 22px)', fontWeight: 300, lineHeight: 1.2, boxShadow: '0 10px 24px -8px rgba(58,53,48,.24)' }} disabled={picked !== null} onClick={() => pick('know')}>{t(c.opt_yes)}</button>
              <button className="option" style={{ minHeight: 58, padding: 'clamp(14px, 2.5vw, 18px) clamp(18px, 3vw, 24px)', textAlign: 'center', border: '2px solid #D8D3C8', background: '#FFFFFF', color: '#0E0E10', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(18px, 3.2vw, 22px)', fontWeight: 300, lineHeight: 1.2, boxShadow: '0 10px 24px -8px rgba(58,53,48,.24)' }} disabled={picked !== null} onClick={() => pick('learn')}>{t(c.opt_idk)}</button>
            </div>
          </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// s1 — eng oson savol. Javobdan keyin summa ikkiga bo'linib ko'rsatiladi.
const Screen1 = (props) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s1;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [3, 1, 0, 2]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => (solved
    ? <SplitPay total={8} people={2} unit={t(UNIT)} restLabel={lang === 'uz' ? 'ortdi' : 'остаток'}/>
    : <PriceTag value={8} unit={t(UNIT)} size="lg"/>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s2 — 2 ga bo'linish: har qadamda bitta narx, oxirgi raqami ajratilgan.
const S2_CASES = [{ v: 12, ok: true }, { v: 15, ok: false }, { v: 24, ok: true }, { v: 37, ok: false }];
const Screen2 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s2} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => {
      const cs = S2_CASES[Math.min(step, S2_CASES.length - 1)];
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s2.title)}</h2>
          <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s2.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <LastDigit value={cs.v} tone={cs.ok ? 'ok' : 'no'} size="lg"/>
            <p className="mono small" style={{ margin: 0, color: cs.ok ? T.success : T.accent }}>
              {cs.ok ? `${cs.v} : 2 = ${cs.v / 2}` : `${cs.v} : 2 = ${Math.floor(cs.v / 2)} + 1`}
            </p>
          </div>
          <StepLinesAccum lines={CONTENT.s2.audio[lang]} step={step}/>
        </div>
      );
    }}/>
);

const Screen3 = (props) => (<RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS} exampleNode={<DivisorChips list={['0', '2', '4', '6', '8']}/>}/>);

// s4 — qoidani qo'llash. Javobdan keyin to'g'ri narx yashil, qolganlari qizil.
const S4_PRICES = [35, 24, 17, 51];
const Screen4 = (props) => {
  const t = useT();
  const c = CONTENT.s4;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [2, 1, 3, 0]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.6vw, 12px)' }}>
      {S4_PRICES.map(v => (solved
        ? <LastDigit key={v} value={v} tone={v % 2 === 0 ? 'ok' : 'no'}/>
        : <PriceTag key={v} value={v} unit={t(UNIT)}/>))}
    </div>
  );
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s5 — 5 ga bo'linish, oxirida fakt-kartochka.
const S5_CASES = [{ v: 15, ok: true }, { v: 20, ok: true }, { v: 23, ok: false }];
const Screen5 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s5} totalScreens={TOTAL_SCREENS} factOnLast
    renderBody={({ t, lang, step, last, audio }) => {
      const cs = S5_CASES[Math.min(step, S5_CASES.length - 1)];
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s5.title)}</h2>
          <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s5.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <LastDigit value={cs.v} tone={cs.ok ? 'ok' : 'no'} size="lg"/>
            <MultiplesTrack base={5} count={4} active={cs.ok ? Math.min(step + 1, 3) : 3}/>
          </div>
          <StepLinesAccum lines={CONTENT.s5.audio[lang]} step={step}/>
          {step >= last && audioReached(audio, 'fact') && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={CONTENT.s5.fact}/>}
        </div>
      );
    }}/>
);

// s6 — 5 va 10 uchun ruxsat etilgan oxirgi raqamlar yonma-yon.
const Screen6 = (props) => {
  const lang = useLang();
  const example = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="mono small" style={{ color: T.ink2, fontWeight: 700 }}>{lang === 'uz' ? '5 ga:' : 'на 5:'}</span>
        <DivisorChips list={['0', '5']}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="mono small" style={{ color: T.ink2, fontWeight: 700 }}>{lang === 'uz' ? '10 ga:' : 'на 10:'}</span>
        <DivisorChips list={['0']}/>
      </div>
    </div>
  );
  return <RuleScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS} exampleNode={example}/>;
};

const Screen7 = (props) => <OddOneOut {...props} screenContent={CONTENT.s7} totalScreens={TOTAL_SCREENS}/>;

// s8 — darsning "nega" ekrani: o'nliklar hech qachon xalaqit bermaydi.
const Screen8 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s8} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s8.title)}</h2>
        <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s8.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <TensOnes value={24} dimTens={step >= 1}/>
          <p className="mono small" style={{ margin: 0, color: T.ink3 }}>24 = 10 + 10 + 4</p>
          {step >= 2 && (
            <span className="dv-chip fade-up" style={{ background: T.accentSoft, color: T.accent, borderColor: T.accent }}>
              {lang === 'uz' ? 'hammasini oxirgi raqam hal qiladi' : 'всё решает последняя цифра'}
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <PriceTag value={40} unit={t(UNIT)} size="lg"/>
      <div style={{ display: 'flex', gap: 6 }}>{Array.from({ length: 5 }).map((_, i) => (<CoinIcon key={i} s={18}/>))}</div>
    </div>
  );
  return <InputScreen {...props} screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} figureNode={fig} factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s9.fact}/>}/>;
};

// s10 — nol bilan tugagan son uchala alomatga birdan mos keladi.
const Screen10 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s10.title)}</h2>
        <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s10.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <LastDigit value={30} tone="ok" size="lg"/>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {[{ n: 2, at: 0 }, { n: 5, at: 1 }, { n: 10, at: 2 }].map(x => (
              <span key={x.n} className="dv-chip" style={{ background: step >= x.at ? '#E3F0E8' : '#FFFFFF', color: step >= x.at ? T.success : T.ink3, borderColor: step >= x.at ? T.success : 'rgba(167, 166, 162, 0.35)' }}>
                {x.n} {lang === 'uz' ? "ga bo'linadi" : '— делится'}
              </span>
            ))}
          </div>
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
      <div className="g6-final-slide" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="fade-up" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow" style={{ color: T.success }}>{t(c.eyebrow)}</p>
            <h2 className="title" style={{ marginTop: 8, fontSize: 'clamp(30px, 6vw, 50px)', lineHeight: 1.04 }}>{t(c.heading)}</h2>
          </div>
        </div>
        <p className="body fade-up delay-1" style={{ position: 'relative', margin: '-4px 0 0', color: T.ink2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 9 }}>
          <span>{t(c.score_label)}</span>
          <strong className="mono" style={{ color: T.success, fontSize: 'clamp(20px, 3.8vw, 28px)', lineHeight: 1.15 }}>{correct}/{total}</strong>
        </p>
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

.title { font-family: 'Manrope', system-ui, sans-serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: normal; }
.display { font-family: 'Manrope', system-ui, sans-serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: normal; }
.italic { font-family: 'Manrope', system-ui, sans-serif; font-style: italic; font-weight: 500; font-variation-settings: normal; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: inherit; font-variation-settings: inherit; font-weight: inherit; }
.frac .n, .frac .d { padding: 0 0.12em; font: inherit; }
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

.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', system-ui, sans-serif !important; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
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

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (div_6_02) ===== */
.place-cell { font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center; min-width: clamp(20px, 3.6vw, 30px); height: clamp(28px, 5vw, 40px); border-radius: 8px; background: #FFFFFF; color: #A7A6A2; box-shadow: 0 4px 12px -6px rgba(58,53,48,0.16); transition: all 0.35s; }
.place-cell.filled { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.30); }

@keyframes rg-dot-in { from { opacity: 0; transform: translateY(6px) scale(0.6); } to { opacity: 1; transform: none; } }

/* PriceTag — do'kon narx yorlig'i. */
.pr-tag { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; padding: clamp(7px,1.5vw,11px) clamp(11px,2.2vw,16px); border-radius: 12px; border: 1.5px solid; animation: rg-dot-in 0.36s ease-out both; box-shadow: 0 5px 14px -8px rgba(58,53,48,0.35); transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* LastDigit — darsning yuragi: oxirgi raqam alohida katakda. */
.ld-cell { display: inline-flex; align-items: center; justify-content: center; min-width: 1.1em; padding: 2px 6px; border-radius: 8px; border: 2px solid; font-weight: 700; line-height: 1.15; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* SplitPay — summani bo'lgandagi ulushlar va ortgan qism. */
.sp-person { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: clamp(6px,1.3vw,9px) clamp(8px,1.7vw,12px); border-radius: 10px; background: #FFFFFF; border: 1.5px solid rgba(167,166,162,0.35); animation: rg-dot-in 0.36s ease-out both; }
.sp-rest { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: clamp(6px,1.3vw,9px) clamp(8px,1.7vw,12px); border-radius: 10px; border: 1.5px dashed rgba(255,79,40,0.55); background: rgba(255,79,40,0.06); }

/* TensOnes — to'la o'nliklar va yakka birliklar. */
.to-ten { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(30px,6.5vw,42px); padding: clamp(6px,1.3vw,9px) 0; border-radius: 9px; background: #E3F0E8; color: #1F7A4D; border: 1.5px solid #1F7A4D; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,2.4vw,16px); animation: rg-dot-in 0.36s ease-out both; transition: opacity 0.4s ease; }
.to-ones { display: inline-flex; gap: 3px; padding: 4px 6px; border-radius: 9px; border: 1.5px dashed rgba(255,79,40,0.55); background: rgba(255,79,40,0.06); }

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
export default function DivisibilityRulesLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
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

  const screens = [Screen0, Screen2, Screen3, Screen1, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
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
      <div className="lesson-root grade6-theory-etalon grade6-dars02">
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
