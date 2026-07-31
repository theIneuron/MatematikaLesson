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
// --- UROK: div_6_03 — Признаки делимости на 3 и 9 / 3 va 9 ga bo'linish alomatlari ---
// Infra grade6/Dars01-02 (baytma-bayt). Mobil naqsh BOSHIDAN ichida (ETALON_6SINF.md §5).
// Kontekst: Dars02 dagi do'kon dunyosi davomi — hisobni 3 do'st bo'lishadi,
// keyin har biri o'z ulushini yana 3 ga bo'ladi, shundan 9 chiqadi (9 = 3 * 3).
// DARSNING O'Q CHIZIG'I: Dars02 dagi "oxirgi raqam" usuli bu yerda ISHLAMAYDI
// (s0 da bola buni o'zi ko'radi) -> yangi qoida kerak bo'lib qoladi: RAQAMLAR
// YIG'INDISI. s5 nega shundayligini ochadi: har o'nlik = 9 + 1, ya'ni o'nliklardan
// 9 chiqib ketadi va faqat raqamlar qoladi.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_03',
  lessonTitle: { ru: 'Признаки делимости на 3 и 9', uz: "3 va 9 ga bo'linish alomatlari" }
};

const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',         scored: false, scope: 'hook' },     // 0  (eski usul quladi, RASM)
  { id: 's2',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 2  (DigitSum kashfiyoti)
  { id: 's3',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 3  (3 ga alomat)
  { id: 's1',  type: 'warmup',      template: 'QuestionScreen', scored: false, scope: null },       // 1  (9 : 3, ENG OSON, RASM)
  { id: 's4',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 4  (4 narxdan 3 ga bo'linadiganini top, RASM)
  { id: 's5',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 5  (NEGA yig'indi + fakt)
  { id: 's6',  type: 'rule',        template: 'custom',         scored: false, scope: null },       // 6  (Dars02 bilan solishtirish)
  { id: 's7',  type: 'test',        template: 'OddOneOut',      scored: true,  scope: 'practice' }, // 7  (rasmsiz)
  { id: 's8',  type: 'exploration', template: 'custom',         scored: false, scope: null },       // 8  (9 ga kengaytma)
  { id: 's9',  type: 'test',        template: 'InputScreen',    scored: true,  scope: 'practice' }, // 9  (45 : 3 = 15, RASM + fakt)
  { id: 's10', type: 'exploration', template: 'custom',         scored: false, scope: null },       // 10 (9 ga bo'linsa 3 ga ham)
  { id: 's11', type: 'test',        template: 'DragMatch',      scored: true,  scope: 'practice' }, // 11 (rasmsiz)
  { id: 's12', type: 'test',        template: 'Classify',       scored: true,  scope: 'practice' }, // 12 (rasmsiz)
  { id: 's13', type: 'test',        template: 'InputScreen',    scored: true,  scope: 'final' },    // 13 (teskari masala, rasmsiz + fakt)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 14
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Тема урока', uz: 'Dars mavzusi' },
    topic: { ru: 'Признаки делимости на 3 и 9', uz: "3 va 9 ga bo'linish alomatlari" },
    global_q: { ru: 'А как узнать, делится ли число на 3?', uz: "Sonning 3 ga bo'linishini qanday bilamiz?" },
    lead: { ru: 'В прошлый раз всё решала последняя цифра. Счёт — 24 тысячи, платят трое. Последняя цифра 4, а 4 на 3 не делится. Значит, не разделить? Но ведь 24 = 3 · 8.', uz: "O'tgan safar hammasini oxirgi raqam hal qilgan edi. Hisob — 24 ming, uch kishi to'laydi. Oxirgi raqam 4, 4 esa 3 ga bo'linmaydi. Demak, bo'linmaydimi? Lekin axir 24 = 3 · 8." },
    question: { ru: 'Как думаешь, почему старое правило здесь не сработало?', uz: "Nima deb o'ylaysiz, nega eski qoida bu yerda ishlamadi?" },
    opt_yes: { ru: 'Кажется, понимаю', uz: "Tushunganga o'xshayman" },
    opt_no: { ru: 'Пока не понимаю', uz: 'Hozircha tushunmadim' },
    opt_idk: { ru: 'Хочу разобраться', uz: "O'rganmoqchiman" },
    audio: {
      intro: { ru: 'В прошлый раз всё решала последняя цифра. Теперь счёт двадцать четыре тысячи и платят трое. Последняя цифра четыре, но двадцать четыре равно три умножить на восемь и делится на три. Значит, для трёх и девяти нужно другое правило. Сначала разберём это правило, затем применим его к примерам.', uz: "O'tgan safar hammasini oxirgi raqam hal qilgan edi. Endi hisob yigirma to'rt ming va uch kishi to'laydi. Oxirgi raqam to'rt, lekin yigirma to'rt uch karra sakkizga teng va uchga bo'linadi. Demak, uch va to'qqiz uchun boshqa qoida kerak. Avval shu qoidani tushunamiz, keyin uni misollarda qo'llaymiz." },
      on_correct: { ru: 'Тогда разберёмся.', uz: 'Unda aniqlab olamiz.' },
      on_wrong: { ru: 'Тогда разберёмся.', uz: 'Unda aniqlab olamiz.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Начнём с простого', uz: 'Oddiydan boshlaymiz' },
    bridge: { ru: 'Сначала самый лёгкий случай.', uz: 'Avval eng oson holat.' },
    question: { ru: 'Счёт 9 тысяч сумов, платят 3 друга поровну. Сколько заплатит каждый?', uz: "Hisob 9 ming so'm, 3 do'st teng to'laydi. Har biri nechadan to'laydi?" },
    opt0: { ru: '2 тысячи', uz: '2 ming' },
    opt1: { ru: '3 тысячи', uz: '3 ming' },
    opt2: { ru: '4 тысячи', uz: '4 ming' },
    opt3: { ru: '6 тысяч', uz: '6 ming' },
    correctIndex: 1,
    correct_text: { ru: 'Верно. 9 : 3 = 3. Каждый платит по 3 тысячи, ничего не осталось.', uz: "To'g'ri. 9 : 3 = 3. Har biri 3 mingdan to'laydi, hech narsa qolmaydi." },
    wrong_0: { ru: 'По 2 тысячи с троих — это 6 тысяч. До 9 не хватает.', uz: "Uch kishidan 2 mingdan — bu 6 ming. 9 gacha yetmaydi." },
    wrong_2: { ru: 'По 4 тысячи с троих — это 12 тысяч. Это больше, чем 9.', uz: "Uch kishidan 4 mingdan — bu 12 ming. Bu 9 dan ko'p." },
    wrong_3: { ru: 'По 6 тысяч с троих — это 18 тысяч. Это вдвое больше, чем нужно.', uz: "Uch kishidan 6 mingdan — bu 18 ming. Bu keragidan ikki barobar ko'p." },
    audio: {
      intro: { ru: 'Начнём с простого. Счёт девять тысяч сумов, платят три друга поровну. Сколько заплатит каждый? Выбери ответ.', uz: "Oddiydan boshlaymiz. Hisob to'qqiz ming so'm, uch do'st teng to'laydi. Har biri nechadan to'laydi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Девять разделилось на три без остатка.', uz: "To'g'ri. To'qqiz uchga qoldiqsiz bo'lindi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Складываем цифры', uz: "Raqamlarni qo'shamiz" },
    bridge: { ru: 'Раз последняя цифра не помогает, попробуем сложить все цифры числа.', uz: "Oxirgi raqam yordam bermas ekan, sonning barcha raqamlarini qo'shib ko'ramiz." },
    audio: {
      ru: [
        'Возьмём двадцать четыре. Складываем цифры: два плюс четыре будет шесть. Шесть делится на три, и само число тоже делится.',
        'Пятнадцать. Один плюс пять будет шесть. Снова делится, и пятнадцать тоже делится на три.',
        'Сорок два. Четыре плюс два будет шесть. И опять делится.',
        'А теперь двадцать пять. Два плюс пять будет семь. Семь на три не делится, и двадцать пять тоже не делится. Правило нашлось: решает сумма цифр.'
      ],
      uz: [
        "Yigirma to'rtni olamiz. Raqamlarni qo'shamiz: ikki qo'shuv to'rt teng olti. Olti uchga bo'linadi, sonning o'zi ham bo'linadi.",
        "O'n besh. Bir qo'shuv besh teng olti. Yana bo'linadi, o'n besh ham uchga bo'linadi.",
        "Qirq ikki. To'rt qo'shuv ikki teng olti. Yana bo'linadi.",
        "Endi yigirma besh. Ikki qo'shuv besh teng yetti. Yetti uchga bo'linmaydi, yigirma besh ham bo'linmaydi. Qoida topildi: raqamlar yig'indisi hal qiladi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Признак делимости на 3', uz: "3 ga bo'linish alomati" },
    rule_1: { ru: 'Число делится на 3, если сумма его цифр делится на 3.', uz: "Son 3 ga bo'linadi, agar uning raqamlari yig'indisi 3 ga bo'linsa." },
    rule_2: { ru: 'Пример: 24 → 2 + 4 = 6, а 6 делится на 3. Значит, и 24 делится на 3.', uz: "Misol: 24 → 2 + 4 = 6, 6 esa 3 ga bo'linadi. Demak, 24 ham 3 ga bo'linadi." },
    audio: { ru: 'Запомним правило. Число делится на три, если сумма его цифр делится на три. Например, двадцать четыре: два плюс четыре будет шесть, а шесть делится на три. Значит, и двадцать четыре делится на три.', uz: "Qoidani eslab qolamiz. Son uchga bo'linadi, agar uning raqamlari yig'indisi uchga bo'linsa. Masalan, yigirma to'rt: ikki qo'shuv to'rt teng olti, olti esa uchga bo'linadi. Demak, yigirma to'rt ham uchga bo'linadi." }
  },

  s4: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    bridge: { ru: 'Теперь применим правило.', uz: "Endi qoidani qo'llaymiz." },
    question: { ru: 'За какой из этих товаров трое смогут заплатить поровну?', uz: "Bu narsalarning qaysi biri uchun uch kishi teng to'lay oladi?" },
    opt0: { ru: '25 тысяч', uz: '25 ming' },
    opt1: { ru: '34 тысячи', uz: '34 ming' },
    opt2: { ru: '27 тысяч', uz: '27 ming' },
    opt3: { ru: '41 тысяча', uz: '41 ming' },
    correctIndex: 2,
    correct_text: { ru: 'Верно. 27 → 2 + 7 = 9, а 9 делится на 3. Каждый платит по 9 тысяч.', uz: "To'g'ri. 27 → 2 + 7 = 9, 9 esa 3 ga bo'linadi. Har biri 9 mingdan to'laydi." },
    wrong_0: { ru: '25 → 2 + 5 = 7. Семь на 3 не делится, значит и 25 не делится.', uz: "25 → 2 + 5 = 7. Yetti 3 ga bo'linmaydi, demak 25 ham bo'linmaydi." },
    wrong_1: { ru: '34 → 3 + 4 = 7. Снова семь — на 3 не делится.', uz: "34 → 3 + 4 = 7. Yana yetti — 3 ga bo'linmaydi." },
    wrong_3: { ru: '41 → 4 + 1 = 5. Пять на 3 не делится.', uz: "41 → 4 + 1 = 5. Besh 3 ga bo'linmaydi." },
    audio: {
      intro: { ru: 'Теперь применим правило. За какой из этих товаров трое смогут заплатить поровну? Сложи цифры каждой цены. Выбери ответ.', uz: "Endi qoidani qo'llaymiz. Bu narsalarning qaysi biri uchun uch kishi teng to'lay oladi? Har bir narxning raqamlarini qo'shing. Javobni tanlang." },
      on_correct: { ru: 'Верно. Сумма цифр делится на три.', uz: "To'g'ri. Raqamlar yig'indisi uchga bo'linadi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Почему решает сумма цифр', uz: "Nega raqamlar yig'indisi hal qiladi" },
    bridge: { ru: 'Разберём число 24 по-другому: каждый десяток это 9 и ещё 1.', uz: "24 sonini boshqacha ajratamiz: har bir o'nlik bu 9 va yana 1." },
    fact: { ru: 'У этого правила есть быстрый приём: цифры, дающие в сумме 9, можно просто вычеркнуть. В числе 3618 вычёркиваем 3 и 6, потом 1 и 8 — ничего не осталось, значит число делится и на 9, и на 3.', uz: "Bu qoidaning tez usuli bor: yig'indisi 9 chiqadigan raqamlarni shunchaki o'chirib tashlash mumkin. 3618 sonida 3 va 6 ni, keyin 1 va 8 ni o'chiramiz — hech narsa qolmadi, demak son 9 ga ham, 3 ga ham bo'linadi." },
    fact_audio: { ru: 'Знаешь ли ты? У этого правила есть быстрый приём: цифры, дающие в сумме девять, можно просто вычеркнуть. В числе три тысячи шестьсот восемнадцать вычёркиваем три и шесть, потом один и восемь. Ничего не осталось, значит число делится и на девять, и на три.', uz: "Bilasizmi? Bu qoidaning tez usuli bor: yig'indisi to'qqiz chiqadigan raqamlarni shunchaki o'chirib tashlash mumkin. Uch ming olti yuz o'n sakkiz sonida uch va oltini, keyin bir va sakkizni o'chiramiz. Hech narsa qolmadi, demak son to'qqizga ham, uchga ham bo'linadi." },
    audio: {
      ru: [
        'Двадцать четыре это два десятка и четыре. А каждый десяток это девять и ещё один.',
        'Значит, двадцать четыре это девять плюс девять, плюс два оставшихся от десятков, плюс четыре единицы.',
        'Девятки делятся и на девять, и на три, поэтому они выпадают. Остаётся два плюс четыре, то есть ровно сумма цифр. Вот почему правило работает.'
      ],
      uz: [
        "Yigirma to'rt bu ikkita o'nlik va to'rtta birlik. Har bir o'nlik esa bu to'qqiz va yana bir.",
        "Demak, yigirma to'rt bu to'qqiz qo'shuv to'qqiz, qo'shuv o'nliklardan qolgan ikki, qo'shuv to'rtta birlik.",
        "To'qqizlar to'qqizga ham, uchga ham bo'linadi, shuning uchun ular tushib qoladi. Ikki qo'shuv to'rt qoladi, ya'ni aynan raqamlar yig'indisi. Qoida shuning uchun ishlaydi."
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Два разных признака', uz: 'Ikki xil alomat' },
    rule_1: { ru: 'Для 2, 5 и 10 смотрят только на последнюю цифру — остальные цифры не важны.', uz: "2, 5 va 10 uchun faqat oxirgi raqamga qaraladi — qolgan raqamlar ahamiyatsiz." },
    rule_2: { ru: 'Для 3 складывают все цифры. Одну цифру здесь смотреть бесполезно — нужна вся сумма.', uz: "3 uchun esa barcha raqamlar qo'shiladi. Bu yerda bitta raqamga qarash foydasiz — butun yig'indi kerak." },
    audio: { ru: 'Сравним. Для двух, пяти и десяти смотрят только на последнюю цифру, остальные не важны. А для трёх складывают все цифры, и смотреть одну цифру здесь бесполезно. Это два разных признака, не путай их.', uz: "Solishtiramiz. Ikki, besh va o'n uchun faqat oxirgi raqamga qaraladi, qolganlari ahamiyatsiz. Uch uchun esa barcha raqamlar qo'shiladi va bu yerda bitta raqamga qarash foydasiz. Bular ikki xil alomat, ularni chalkashtirmang." }
  },

  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    question: { ru: 'Найди цену, которую трое НЕ смогут разделить поровну', uz: "Uch kishi teng bo'la OLMAYDIGAN narxni toping" },
    lead: { ru: 'Сложи цифры каждой цены в уме.', uz: "Har bir narxning raqamlarini xayolan qo'shing." },
    items: [
      { num: '21' },
      { num: '33' },
      { num: '45' },
      { num: '52' },
      { num: '60' }
    ],
    errorIdx: 3,
    correct_text: { ru: 'Верно. 52 → 5 + 2 = 7, а 7 на 3 не делится. У остальных суммы 3, 6, 9 и 6 — все делятся.', uz: "To'g'ri. 52 → 5 + 2 = 7, 7 esa 3 ga bo'linmaydi. Qolganlarining yig'indisi 3, 6, 9 va 6 — hammasi bo'linadi." },
    wrong_0: { ru: '21 → 2 + 1 = 3. Три делится на 3, значит и 21 делится. Ищи дальше.', uz: "21 → 2 + 1 = 3. Uch 3 ga bo'linadi, demak 21 ham bo'linadi. Yana qidiring." },
    wrong_1: { ru: '33 → 3 + 3 = 6. Шесть делится на 3. Проверь остальные суммы.', uz: "33 → 3 + 3 = 6. Olti 3 ga bo'linadi. Qolgan yig'indilarni tekshiring." },
    wrong_2: { ru: '45 → 4 + 5 = 9. Девять делится на 3. Ищи ту цену, где сумма не делится.', uz: "45 → 4 + 5 = 9. To'qqiz 3 ga bo'linadi. Yig'indisi bo'linmaydigan narxni qidiring." },
    wrong_4: { ru: '60 → 6 + 0 = 6. Шесть делится на 3. Осталась одна цена, которая выбивается.', uz: "60 → 6 + 0 = 6. Olti 3 ga bo'linadi. Qatorga tushmaydigan bitta narx qoldi." },
    audio: {
      intro: { ru: 'Складывай цифры в уме. Найди цену, которую трое не смогут разделить поровну.', uz: "Raqamlarni xayolan qo'shing. Uch kishi teng bo'la olmaydigan narxni toping." },
      on_correct: { ru: 'Верно. Сумма цифр семь, а семь на три не делится.', uz: "To'g'ri. Raqamlar yig'indisi yetti, yetti esa uchga bo'linmaydi." },
      on_wrong: { ru: 'Здесь сумма цифр делится на три. Ищи дальше.', uz: "Bu yerda raqamlar yig'indisi uchga bo'linadi. Yana qidiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'А что с девяткой?', uz: "To'qqiz-chi?" },
    bridge: { ru: 'Каждый из троих делит свою долю ещё на 3. Всего получается 9 частей.', uz: "Uch kishining har biri o'z ulushini yana 3 ga bo'ladi. Jami 9 ta ulush chiqadi." },
    audio: {
      ru: [
        'Правило для девятки почти такое же. Складываем цифры, но теперь сумма должна делиться на девять.',
        'Двадцать семь: два плюс семь будет девять. Девять делится на девять, значит и двадцать семь делится.',
        'Двадцать четыре: два плюс четыре будет шесть. Шесть делится на три, но не делится на девять. Значит, двадцать четыре делится на три, а на девять нет.'
      ],
      uz: [
        "To'qqiz uchun qoida deyarli xuddi shunday. Raqamlarni qo'shamiz, lekin endi yig'indi to'qqizga bo'linishi kerak.",
        "Yigirma yetti: ikki qo'shuv yetti teng to'qqiz. To'qqiz to'qqizga bo'linadi, demak yigirma yetti ham bo'linadi.",
        "Yigirma to'rt: ikki qo'shuv to'rt teng olti. Olti uchga bo'linadi, lekin to'qqizga bo'linmaydi. Demak, yigirma to'rt uchga bo'linadi, to'qqizga esa yo'q."
      ]
    }
  },

  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    label: { ru: 'делим счёт на троих', uz: "hisobni uchga bo'lamiz" },
    context: { ru: 'Общий счёт — 45 тысяч сумов, платят 3 друга.', uz: "Umumiy hisob — 45 ming so'm, 3 do'st to'laydi." },
    question: { ru: 'Сколько тысяч заплатит каждый из троих?', uz: "Uch kishidan har biri necha ming to'laydi?" },
    answer: '15',
    placeholder: { ru: 'число', uz: 'son' },
    fb_correct: { ru: 'Верно. 4 + 5 = 9, сумма делится на 3, значит и 45 делится: 45 : 3 = 15.', uz: "To'g'ri. 4 + 5 = 9, yig'indi 3 ga bo'linadi, demak 45 ham bo'linadi: 45 : 3 = 15." },
    hint: { ru: 'Сначала сложи цифры: 4 + 5. Сумма делится на 3? Значит, делить можно. Теперь раздели 45 на 3.', uz: "Avval raqamlarni qo'shing: 4 + 5. Yig'indi 3 ga bo'linadimi? Demak, bo'lish mumkin. Endi 45 ni 3 ga bo'ling." },
    fact: { ru: 'Сумма цифр 45 равна 9, поэтому 45 делится не только на 3, но и на 9: 45 = 9 · 5. Один признак сразу дал ответ про два числа.', uz: "45 ning raqamlari yig'indisi 9 ga teng, shuning uchun 45 nafaqat 3 ga, balki 9 ga ham bo'linadi: 45 = 9 · 5. Bitta alomat birdaniga ikki son haqida javob berdi." },
    fact_audio: { ru: 'Знаешь ли ты? Сумма цифр сорока пяти равна девяти, поэтому сорок пять делится не только на три, но и на девять. Сорок пять это девять умножить на пять. Один признак сразу дал ответ про два числа.', uz: "Bilasizmi? Qirq beshning raqamlari yig'indisi to'qqizga teng, shuning uchun qirq besh nafaqat uchga, balki to'qqizga ham bo'linadi. Qirq besh bu to'qqiz karra besh. Bitta alomat birdaniga ikki son haqida javob berdi." },
    audio: {
      intro: { ru: 'Общий счёт сорок пять тысяч сумов, платят трое друзей. Сколько тысяч заплатит каждый? Набери ответ.', uz: "Umumiy hisob qirq besh ming so'm, uch do'st to'laydi. Har biri necha ming to'laydi? Javobni tering." },
      on_correct: { ru: 'Верно, по пятнадцать тысяч.', uz: "To'g'ri, o'n besh mingdan." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Девятка сильнее тройки', uz: "To'qqiz uchdan kuchliroq" },
    bridge: { ru: 'Между этими двумя признаками есть связь в одну сторону.', uz: "Bu ikki alomat orasida bir tomonlama bog'lanish bor." },
    audio: {
      ru: [
        'Если число делится на девять, оно обязательно делится и на три. Ведь девять это три умножить на три.',
        'Например, тридцать шесть: три плюс шесть будет девять. Делится и на девять, и на три.',
        'А в обратную сторону не работает. Двадцать четыре делится на три, но на девять не делится. Так что девятка строже.'
      ],
      uz: [
        "Agar son to'qqizga bo'linsa, u albatta uchga ham bo'linadi. Axir to'qqiz bu uch karra uch.",
        "Masalan, o'ttiz olti: uch qo'shuv olti teng to'qqiz. To'qqizga ham, uchga ham bo'linadi.",
        "Teskari tomonga esa ishlamaydi. Yigirma to'rt uchga bo'linadi, lekin to'qqizga bo'linmaydi. Demak, to'qqiz qattiqroq."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'На что делится эта цена?', uz: "Bu narx nimalarga bo'linadi?" },
    lead: { ru: 'Для каждой цены выбери верную строку, складывая её цифры.', uz: "Har bir narxning raqamlarini qo'shib, mos qatorni tanlang." },
    pairs: [
      { number: '24', label: { ru: 'тысяч', uz: 'ming' }, reading: { ru: 'только на 3', uz: 'faqat 3 ga' } },
      { number: '27', label: { ru: 'тысяч', uz: 'ming' }, reading: { ru: 'и на 3, и на 9', uz: '3 ga ham, 9 ga ham' } },
      { number: '25', label: { ru: 'тысяч', uz: 'ming' }, reading: { ru: 'ни на 3, ни на 9', uz: '3 ga ham, 9 ga ham emas' } }
    ],
    correct_text: { ru: 'Верно. 24 → 6 (делится на 3, но не на 9). 27 → 9 (делится на оба). 25 → 7 (не делится ни на что из этого).', uz: "To'g'ri. 24 → 6 (3 ga bo'linadi, 9 ga esa yo'q). 27 → 9 (ikkalasiga ham bo'linadi). 25 → 7 (bularning hech biriga bo'linmaydi)." },
    hint: { ru: 'Сложи цифры. Сумма делится на 9 — значит и на 3. Делится только на 3 — значит на 9 нет.', uz: "Raqamlarni qo'shing. Yig'indi 9 ga bo'linsa — 3 ga ham bo'linadi. Faqat 3 ga bo'linsa — 9 ga bo'linmaydi." },
    audio: {
      intro: { ru: 'Для каждой цены выбери верную строку. Нажми на цену, потом выбери строку из списка.', uz: "Har bir narx uchun to'g'ri qatorni tanlang. Narxga bosing, so'ng ro'yxatdan qatorni tanlang." },
      on_correct: { ru: 'Верно, все строки на местах.', uz: "To'g'ri, barcha qatorlar o'z o'rniga tushdi." },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Трое смогут разделить поровну?', uz: "Uch kishi teng bo'la oladimi?" },
    lead: { ru: 'Разбери цены на две группы по сумме цифр.', uz: "Narxlarni raqamlari yig'indisiga qarab ikki guruhga ajrating." },
    bin_a: { ru: 'Делится на 3', uz: "3 ga bo'linadi" },
    bin_b: { ru: 'Не делится на 3', uz: "3 ga bo'linmaydi" },
    cards: [
      { label: '18', bin: 'a' },
      { label: '25', bin: 'b' },
      { label: '36', bin: 'a' },
      { label: '47', bin: 'b' },
      { label: '51', bin: 'a' },
      { label: '74', bin: 'b' }
    ],
    hint: { ru: 'Сложи цифры числа и проверь, делится ли сумма на 3.', uz: "Sonning raqamlarini qo'shing va yig'indi 3 ga bo'linishini tekshiring." },
    correct_text: { ru: 'Точно. 18 → 9, 36 → 9, 51 → 6 — все суммы делятся на 3. А 25 → 7, 47 → 11, 74 → 11 — не делятся.', uz: "Aniq. 18 → 9, 36 → 9, 51 → 6 — barcha yig'indilar 3 ga bo'linadi. 25 → 7, 47 → 11, 74 → 11 esa bo'linmaydi." },
    audio: {
      intro: { ru: 'Разбери цены на две группы. Делится на три или нет? Складывай цифры.', uz: "Narxlarni ikki guruhga ajrating. Uchga bo'linadimi yoki yo'qmi? Raqamlarni qo'shing." },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi." },
      on_wrong: { ru: 'Не сюда.', uz: 'Bu yerga emas.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
    label: { ru: 'финальная задача', uz: 'yakuniy masala' },
    context: { ru: 'На ценнике стёрлась одна цифра: 4?2 тысячи сумов.', uz: "Narx yorlig'ida bitta raqam o'chib qolgan: 4?2 ming so'm." },
    question: { ru: 'Какая цифра должна стоять вместо знака вопроса, чтобы число делилось на 9?', uz: "Son 9 ga bo'linishi uchun savol belgisi o'rnida qaysi raqam turishi kerak?" },
    answer: '3',
    placeholder: { ru: 'цифра', uz: 'raqam' },
    fb_correct: { ru: 'Верно. 4 + 2 = 6, до ближайшего числа, кратного 9, не хватает 3. Значит, цифра 3, и число 432 делится на 9.', uz: "To'g'ri. 4 + 2 = 6, 9 ga karrali eng yaqin songacha 3 yetmayapti. Demak, raqam 3, va 432 soni 9 ga bo'linadi." },
    hint: { ru: 'Сумма всех трёх цифр должна делиться на 9. Известные цифры дают 4 + 2 = 6. Сколько не хватает до 9?', uz: "Uchala raqamning yig'indisi 9 ga bo'linishi kerak. Ma'lum raqamlar 4 + 2 = 6 beradi. 9 gacha qancha yetmayapti?" },
    fact: { ru: 'В номерах карт и штрихкодах действительно бывают контрольные цифры. Их вычисляют по специальным алгоритмам: иногда цифры не просто складывают, а учитывают с разным весом. Сумма цифр — простая модель этой идеи.', uz: "Karta raqamlari va shtrix-kodlarda nazorat raqamlari bo'ladi. Ular maxsus algoritmlar bilan hisoblanadi: ba'zan raqamlar shunchaki qo'shilmaydi, balki turli og'irlik bilan olinadi. Raqamlar yig'indisi — shu g'oyaning sodda modeli." },
    fact_audio: { ru: 'Знаешь ли ты? В номерах карт и штрихкодах действительно бывают контрольные цифры. Их вычисляют по специальным алгоритмам. Иногда цифры не просто складывают, а учитывают с разным весом. Сумма цифр — простая модель этой идеи.', uz: "Bilasizmi? Karta raqamlari va shtrix-kodlarda nazorat raqamlari bo'ladi. Ular maxsus algoritmlar bilan hisoblanadi. Ba'zan raqamlar shunchaki qo'shilmaydi, balki turli og'irlik bilan olinadi. Raqamlar yig'indisi shu g'oyaning sodda modelidir." },
    audio: {
      intro: { ru: 'Финальная задача. На ценнике стёрлась одна цифра: четыре, знак вопроса, два. Какая цифра должна стоять вместо знака вопроса, чтобы число делилось на девять? Набери ответ.', uz: "Yakuniy masala. Narx yorlig'ida bitta raqam o'chib qolgan: to'rt, savol belgisi, ikki. Son to'qqizga bo'linishi uchun savol belgisi o'rnida qaysi raqam turishi kerak? Javobni tering." },
      on_correct: { ru: 'Верно, цифра три.', uz: "To'g'ri, uch raqami." },
      on_wrong: { ru: 'Посмотри подсказку.', uz: 'Maslahatga qarang.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi" },
    heading: { ru: 'Делимость на 3 и 9', uz: "3 va 9 ga bo'linish" },
    score_label: { ru: 'Ваш результат по заданиям:', uz: "Topshiriqlar bo'yicha natijangiz:" },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'Число делится на 3, если сумма его цифр делится на 3. На 9 — если сумма делится на 9.', uz: "Son 3 ga bo'linadi, agar raqamlari yig'indisi 3 ga bo'linsa. 9 ga esa — yig'indi 9 ga bo'linsa." },
    main_2: { ru: 'Здесь одна последняя цифра ничего не решает — это отличие от признаков для 2, 5 и 10.', uz: "Bu yerda bitta oxirgi raqam hech narsani hal qilmaydi — bu 2, 5 va 10 alomatlaridan farqi." },
    main_3: { ru: 'Правило работает потому, что каждый десяток это 9 и ещё 1: девятки выпадают, остаются сами цифры.', uz: "Qoida shuning uchun ishlaydiki, har bir o'nlik bu 9 va yana 1: to'qqizlar tushib qoladi, raqamlarning o'zi qoladi." },
    hook_close: { ru: 'Вернёмся к началу: 24 → 2 + 4 = 6, сумма делится на 3. Поэтому трое спокойно платят по 8 тысяч, хотя последняя цифра нас чуть не обманула.', uz: "Boshiga qaytamiz: 24 → 2 + 4 = 6, yig'indi 3 ga bo'linadi. Shuning uchun uch kishi bemalol 8 mingdan to'laydi, garchi oxirgi raqam bizni deyarli aldab qo'ygan bo'lsa ham." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Nimaga tayanadi' },
    conn_refs: { ru: 'признаки делимости на 2, 5 и 10 из прошлого урока', uz: "o'tgan darsdagi 2, 5 va 10 ga bo'linish alomatlari" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'простые и составные числа', uz: 'tub va murakkab sonlar' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Число делится на три, если сумма его цифр делится на три. На девять, если сумма делится на девять. Одна последняя цифра здесь ничего не решает.',
        'Работает это потому, что каждый десяток это девять и ещё один: девятки выпадают, остаются сами цифры. Дальше разберём простые и составные числа.'
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Son uchga bo'linadi, agar raqamlari yig'indisi uchga bo'linsa. To'qqizga esa, agar yig'indi to'qqizga bo'linsa. Bitta oxirgi raqam bu yerda hech narsani hal qilmaydi.",
        "Bu shuning uchun ishlaydiki, har bir o'nlik bu to'qqiz va yana bir: to'qqizlar tushib qoladi, raqamlarning o'zi qoladi. Keyin tub va murakkab sonlarni ko'rib chiqamiz."
      ]
    }
  }
};

// ============================================================
// SHUFFLE / FORMAT / ANIM HELPERS (div_6_03)
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
// RAQAMLAR YIG'INDISI — darsning asosiy vizual modeli.
// Dars02 da hukmni oxirgi raqam chiqargan edi; bu yerda RAQAMLAR YIG'INDISI.
// Shuning uchun markaziy komponent — DigitSum.
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

// Dars02 dan meros: son yoziladi, oxirgi raqam alohida katakda. Bu darsda u
// FAQAT solishtirish uchun kerak — s0 da eski usul quladi, s6 da ikki alomat
// yonma-yon qo'yiladi.
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

// Darsning yuragi: son raqamlarga ajraladi va ular qo'shiladi.
//   24  ->  2 + 4 = 6
// tone: 'ok' (yig'indi bo'linadi) / 'no' (bo'linmaydi) / 'plain'.
// showSum=false bo'lsa faqat raqamlar ko'rsatiladi (javobdan oldingi holat).
const DigitSum = ({ value, tone = 'plain', size = 'md', showSum = true, lastDigit = false }) => {
  const digits = String(value).split('');
  const sum = digits.reduce((a, d) => a + Number(d), 0);
  const col = tone === 'ok' ? T.success : (tone === 'no' ? T.accent : T.ink2);
  const bg = tone === 'ok' ? '#E3F0E8' : (tone === 'no' ? '#FFE8E1' : '#F1EFE9');
  const fs = size === 'lg' ? 'clamp(22px, 5.2vw, 34px)' : 'clamp(16px, 3.6vw, 24px)';
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
      {digits.map((d, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="mono" style={{ fontSize: fs, color: T.ink3 }}>+</span>}
          <span className="ds-digit mono" style={{ fontSize: fs, borderColor: lastDigit && i === digits.length - 1 ? T.accent : 'rgba(167,166,162,0.4)' }}>{d}</span>
        </React.Fragment>
      ))}
      {showSum && (
        <>
          <span className="mono" style={{ fontSize: fs, color: T.ink3 }}>=</span>
          <span className="ds-sum mono" style={{ fontSize: fs, color: col, background: bg, borderColor: col }}>{sum}</span>
        </>
      )}
    </span>
  );
};

// "Nega yig'indi?" ekrani uchun: har o'nlik = 9 + 1.
// 24 = 9 + 9 + (2 + 4). To'qqizlar yashil (ular 9 ga ham, 3 ga ham bo'linadi va
// tushib qoladi), qolgani — aynan raqamlar yig'indisi.
const NineSplit = ({ value, dimNines = false }) => {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 'clamp(4px, 1.1vw, 8px)' }}>
      {Array.from({ length: tens }).map((_, i) => (
        <React.Fragment key={`n${i}`}>
          {i > 0 && <span className="mono small" style={{ color: T.ink3 }}>+</span>}
          <span className="ns-nine" style={{ opacity: dimNines ? 0.3 : 1, animationDelay: `${i * 0.07}s` }}>9</span>
        </React.Fragment>
      ))}
      <span className="mono small" style={{ color: T.ink3 }}>+</span>
      <span className="ns-rest">
        <span className="mono" style={{ fontSize: 'clamp(13px,2.6vw,17px)', fontWeight: 700, color: T.accent }}>{tens}</span>
        <span className="mono small" style={{ color: T.accent }}>+</span>
        <span className="mono" style={{ fontSize: 'clamp(13px,2.6vw,17px)', fontWeight: 700, color: T.accent }}>{ones}</span>
      </span>
    </div>
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

// Alomat chiplari (qoida va solishtirish ekranlarida).
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
          {/* Kontekstda masalaning sharti (masalan 4?2) turadi — u eng och kulrangda
              qolib ketmasligi kerak, shuning uchun ink2. Savolning o'zi esa boshqa
              sarlavhalardan ajralib turishi uchun kattaroq va to'q. */}
          {c.context && <p className="small" style={{ marginTop: 6, color: T.ink2 }}>{t(c.context)}</p>}
          <h2 className="title h-sub" style={{ marginTop: 8, fontSize: 'clamp(19px, 3.1vw, 23px)', color: T.ink }}>{t(c.question)}</h2>
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
// Qiyinlik pog'onasi: 9 -> 24/15/42/25 -> 25/34/27/41 -> 45 -> teskari masala (4?2).
// Rasmli: s0, s1, s2, s3, s4, s5, s6, s8, s9, s10.
// Rasmsiz (raqamlarni xayolan qo'shish): s7, s11, s12, s13.
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
        {/* Ziddiyat: eski usul "yo'q" deydi, ko'paytirish esa "ha" deydi. */}
        {introStages.showExample && (
          <>
          <div className="frame fade-up" style={{ position: 'relative', width: '100%', maxWidth: 760, minHeight: 128, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 'clamp(14px, 2.5vw, 18px)', animationDuration: '1.2s' }}>
            <LastDigit value={24} tone="no" size="lg"/>
            <span className="dv-chip" style={{ background: '#FFE8E1', color: T.accent, borderColor: T.accent }}>
              {lang === 'uz' ? "eski usul: 3 ga bo'linmaydi" : 'старое правило: не делится на 3'}
            </span>
            <span className="mono small" style={{ color: T.ink3 }}>{lang === 'uz' ? 'lekin' : 'но'}</span>
            <span className="dv-chip" style={{ background: '#E3F0E8', color: T.success, borderColor: T.success }}>24 = 3 · 8</span>
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

// s1 — eng oson savol. Javobdan keyin summa uchga bo'linib ko'rsatiladi.
const Screen1 = (props) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s1;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [2, 0, 3, 1]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const figure = (solved) => (solved
    ? <SplitPay total={9} people={3} unit={t(UNIT)} restLabel={lang === 'uz' ? 'ortdi' : 'остаток'}/>
    : <PriceTag value={9} unit={t(UNIT)} size="lg"/>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s2 — raqamlar yig'indisi kashfiyoti.
const S2_CASES = [{ v: 24, ok: true }, { v: 15, ok: true }, { v: 42, ok: true }, { v: 25, ok: false }];
const Screen2 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s2} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => {
      const cs = S2_CASES[Math.min(step, S2_CASES.length - 1)];
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 18px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s2.title)}</h2>
          <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s2.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <PriceTag value={cs.v} unit={t(UNIT)}/>
            <DigitSum value={cs.v} tone={cs.ok ? 'ok' : 'no'} size="lg"/>
            <p className="mono small" style={{ margin: 0, color: cs.ok ? T.success : T.accent }}>
              {cs.ok ? `${cs.v} : 3 = ${cs.v / 3}` : `${cs.v} : 3 = ${Math.floor(cs.v / 3)} + ${cs.v % 3}`}
            </p>
          </div>
          <StepLinesAccum lines={CONTENT.s2.audio[lang]} step={step}/>
        </div>
      );
    }}/>
);

const Screen3 = (props) => (<RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS} exampleNode={<DigitSum value={24} tone="ok" size="lg"/>}/>);

// s4 — qoidani qo'llash. Javobdan keyin to'rttala narxning yig'indisi ochiladi.
const S4_PRICES = [25, 34, 27, 41];
const Screen4 = (props) => {
  const t = useT();
  const c = CONTENT.s4;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [1, 2, 0, 3]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  const digitsSum = (v) => String(v).split('').reduce((a, d) => a + Number(d), 0);
  const figure = (solved) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(6px, 1.6vw, 12px)' }}>
      {S4_PRICES.map(v => (solved
        ? <DigitSum key={v} value={v} tone={digitsSum(v) % 3 === 0 ? 'ok' : 'no'}/>
        : <PriceTag key={v} value={v} unit={t(UNIT)}/>))}
    </div>
  );
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// s5 — darsning "nega" ekrani: har o'nlik = 9 + 1, to'qqizlar tushib qoladi.
const Screen5 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s5} totalScreens={TOTAL_SCREENS} factOnLast
    renderBody={({ t, lang, step, last, audio }) => (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s5.title)}</h2>
        <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s5.bridge)}</p>
        <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <NineSplit value={24} dimNines={step >= 2}/>
          <p className="mono small" style={{ margin: 0, color: T.ink3 }}>24 = 9 + 9 + 2 + 4</p>
          {step >= 2 && (
            <span className="dv-chip fade-up" style={{ background: T.accentSoft, color: T.accent, borderColor: T.accent }}>
              {lang === 'uz' ? "qolgani: 2 + 4 = raqamlar yig'indisi" : 'остаток: 2 + 4 = сумма цифр'}
            </span>
          )}
        </div>
        <StepLinesAccum lines={CONTENT.s5.audio[lang]} step={step}/>
        {step >= last && audioReached(audio, 'fact') && <FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s5.fact}/>}
      </div>
    )}/>
);

// s6 — ikki alomat yonma-yon: oxirgi raqam / raqamlar yig'indisi.
const Screen6 = (props) => {
  const lang = useLang();
  const example = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="mono small" style={{ color: T.ink2, fontWeight: 700, minWidth: 62, textAlign: 'right' }}>{lang === 'uz' ? '2, 5, 10:' : '2, 5, 10:'}</span>
        <LastDigit value={24} tone="ok"/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="mono small" style={{ color: T.ink2, fontWeight: 700, minWidth: 62, textAlign: 'right' }}>{lang === 'uz' ? '3, 9:' : 'на 3, 9:'}</span>
        <DigitSum value={24} tone="ok"/>
      </div>
    </div>
  );
  return <RuleScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS} exampleNode={example}/>;
};

const Screen7 = (props) => <OddOneOut {...props} screenContent={CONTENT.s7} totalScreens={TOTAL_SCREENS}/>;

// s8 — 9 ga kengaytma: xuddi shu yig'indi, faqat endi 9 ga bo'linsin.
const Screen8 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s8} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => {
      const v = step >= 2 ? 24 : 27;
      const tone = step === 0 ? 'plain' : (step === 1 ? 'ok' : 'no');
      const nine = v % 9 === 0;
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s8.title)}</h2>
          <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s8.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <DigitSum value={v} tone={tone} size="lg"/>
            {step >= 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                <span className="dv-chip" style={{ background: '#E3F0E8', color: T.success, borderColor: T.success }}>{lang === 'uz' ? "3 ga: ha" : 'на 3: да'}</span>
                <span className="dv-chip" style={{ background: nine ? '#E3F0E8' : '#FFE8E1', color: nine ? T.success : T.accent, borderColor: nine ? T.success : T.accent }}>{lang === 'uz' ? (nine ? '9 ga: ha' : "9 ga: yo'q") : (nine ? 'на 9: да' : 'на 9: нет')}</span>
              </div>
            )}
          </div>
          <StepLinesAccum lines={CONTENT.s8.audio[lang]} step={step}/>
        </div>
      );
    }}/>
);

const Screen9 = (props) => {
  const t = useT();
  const fig = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <PriceTag value={45} unit={t(UNIT)} size="lg"/>
      <div style={{ display: 'flex', gap: 6 }}>{Array.from({ length: 3 }).map((_, i) => (<CoinIcon key={i} s={18}/>))}</div>
    </div>
  );
  return <InputScreen {...props} screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} figureNode={fig} factNode={<FactCard badge={FB_SCI} anim={<AnimStars/>} text={CONTENT.s9.fact}/>}/>;
};

// s10 — 9 ga bo'linsa 3 ga ham; teskarisi ishlamaydi.
const Screen10 = (props) => (
  <StepExploration {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS}
    renderBody={({ t, lang, step }) => {
      const v = step >= 2 ? 24 : 36;
      const nine = v % 9 === 0;
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
          <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(CONTENT.s10.title)}</h2>
          <p className="body g6-explanation-prompt fade-up delay-1" style={{ color: T.ink2 }}>{t(CONTENT.s10.bridge)}</p>
          <div className="frame fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <DigitSum value={v} tone={nine ? 'ok' : 'plain'} size="lg"/>
            {step >= 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                <span className="dv-chip" style={{ background: nine ? '#E3F0E8' : '#FFE8E1', color: nine ? T.success : T.accent, borderColor: nine ? T.success : T.accent }}>{lang === 'uz' ? (nine ? "9 ga bo'linadi" : "9 ga bo'linmaydi") : (nine ? 'делится на 9' : 'не делится на 9')}</span>
                <span className="dv-chip" style={{ background: '#E3F0E8', color: T.success, borderColor: T.success }}>{lang === 'uz' ? "3 ga bo'linadi" : 'делится на 3'}</span>
              </div>
            )}
          </div>
          <StepLinesAccum lines={CONTENT.s10.audio[lang]} step={step}/>
        </div>
      );
    }}/>
);

const Screen11 = (props) => <DragMatch {...props} screenContent={CONTENT.s11} totalScreens={TOTAL_SCREENS}/>;

const Screen12 = (props) => <Classify {...props} screenContent={CONTENT.s12} totalScreens={TOTAL_SCREENS}/>;

const Screen13 = (props) => <InputScreen {...props} screenContent={CONTENT.s13} totalScreens={TOTAL_SCREENS} factNode={<FactCard badge={FB_IT} anim={<AnimData/>} text={CONTENT.s13.fact}/>}/>;
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

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (div_6_03) ===== */
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

/* DigitSum — raqamlar va ularning yig'indisi (darsning yuragi). */
.ds-digit { display: inline-flex; align-items: center; justify-content: center; min-width: 1.15em; padding: 3px 7px; border-radius: 8px; background: #FFFFFF; color: #0E0E10; border: 1.5px solid; font-weight: 700; line-height: 1.15; animation: rg-dot-in 0.34s ease-out both; transition: border-color 0.35s ease; }
.ds-sum { display: inline-flex; align-items: center; justify-content: center; min-width: 1.15em; padding: 3px 8px; border-radius: 8px; border: 2px solid; font-weight: 700; line-height: 1.15; transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease; }

/* NineSplit — har o'nlikdan chiqadigan 9 lar va qolgan raqamlar. */
.ns-nine { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(28px,6vw,38px); padding: clamp(6px,1.3vw,9px) 0; border-radius: 9px; background: #E3F0E8; color: #1F7A4D; border: 1.5px solid #1F7A4D; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,2.4vw,16px); animation: rg-dot-in 0.36s ease-out both; transition: opacity 0.4s ease; }
.ns-rest { display: inline-flex; align-items: center; gap: 4px; padding: 5px 8px; border-radius: 9px; border: 1.5px dashed rgba(255,79,40,0.55); background: rgba(255,79,40,0.06); }

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
export default function DigitSumRulesLesson({
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
      <div className="lesson-root grade6-theory-etalon grade6-dars03">
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
