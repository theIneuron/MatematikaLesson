import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import './Grade6TheoryTheme.css';
import { normalizeTtsColons } from './ttsMathColon.js';
// УРОК: Делители и кратные — div_6_01
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
// Ekran qulfi klapani: TTS javob bermasa, shu vaqtdan keyin «Davom» ochiladi.
// 9 s — eng uzun izoh ham boshlanishga ulguradi, lekin bola kutib qolmaydi.
const NAV_UNLOCK_MS = 9000;

const LANG_TAG = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
};
const END_TAG = '[end]';
// Global TAG_RE da lastIndex saqlanadi, shuning uchun tekshiruv uchun alohida
// (g bayrog'isiz) nusxa: aks holda ketma-ket .test() chaqiruvlari yolg'on
// natija berardi.
const HAS_LANG_TAG_RE = /\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/;
// Ekran tili aniq bo'lsa shuni olamiz; berilmasa alifbodan aniqlanadi.
const resolveTtsLang = (text, lang) => {
  if (lang === 'uz' || lang === 'ru' || lang === 'en') return lang;
  return /[Ѐ-ӿ]/.test(String(text)) ? 'ru' : 'uz';
};
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
    let thousandPart;
    if (lang === 'ru') {
      const lastTwo = thousands % 100;
      const last = thousands % 10;
      const feminineThousands = numberToWords(thousands, lang)
        .replace(/один$/, 'одна')
        .replace(/два$/, 'две');
      const form = lastTwo >= 11 && lastTwo <= 19
        ? 'тысяч'
        : (last === 1 ? 'тысяча' : (last >= 2 && last <= 4 ? 'тысячи' : 'тысяч'));
      thousandPart = `${feminineThousands} ${form}`;
    } else {
      thousandPart = `${numberToWords(thousands, lang)} ming`;
    }
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

const RU_FRACTION_DENOMINATORS = {
  2: ['вторая', 'вторых'],
  3: ['третья', 'третьих'],
  4: ['четвертая', 'четвертых'],
  5: ['пятая', 'пятых'],
  6: ['шестая', 'шестых'],
  7: ['седьмая', 'седьмых'],
  8: ['восьмая', 'восьмых'],
  9: ['девятая', 'девятых'],
  10: ['десятая', 'десятых'],
  11: ['одиннадцатая', 'одиннадцатых'],
  12: ['двенадцатая', 'двенадцатых'],
  14: ['четырнадцатая', 'четырнадцатых'],
  15: ['пятнадцатая', 'пятнадцатых'],
  16: ['шестнадцатая', 'шестнадцатых'],
  18: ['восемнадцатая', 'восемнадцатых'],
  20: ['двадцатая', 'двадцатых'],
  21: ['двадцать первая', 'двадцать первых'],
  23: ['двадцать третья', 'двадцать третьих'],
  28: ['двадцать восьмая', 'двадцать восьмых'],
  36: ['тридцать шестая', 'тридцать шестых'],
  60: ['шестидесятая', 'шестидесятых'],
  72: ['семьдесят вторая', 'семьдесят вторых'],
  135: ['сто тридцать пятая', 'сто тридцать пятых'],
};

const fractionToWords = (numerator, denominator, lang) => {
  if (numerator === '?') {
    return lang === 'ru'
      ? `дробь с неизвестным числителем и знаменателем ${numberToWords(denominator, lang)}`
      : `surati noma'lum, maxraji ${numberToWords(denominator, lang)} bo'lgan kasr`;
  }
  if (lang === 'ru') {
    const n = Number(numerator);
    const d = Number(denominator);
    if (d === 0 || d === 1) {
      return `${numberToWords(n, lang)} делённое на ${numberToWords(d, lang)}`;
    }
    const forms = RU_FRACTION_DENOMINATORS[d];
    const cardinal = numberToWords(n, lang);
    const numeratorWord = n % 100 >= 11 && n % 100 <= 19
      ? cardinal
      : cardinal.replace(/один$/, 'одна').replace(/два$/, 'две');
    if (forms) return `${numeratorWord} ${n === 1 ? forms[0] : forms[1]}`;
    return `${numeratorWord} ${numberToWords(denominator, lang)}-ых`;
  }
  return `${numberToWords(denominator, lang)}dan ${numberToWords(numerator, lang)}`;
};

const decimalToWords = (whole, fraction, lang) => {
  if (fraction.length > 3) {
    const digits = [...fraction].map((digit) => numberToWords(digit, lang)).join(' ');
    return lang === 'ru'
      ? `${numberToWords(whole, lang)} целых, ${digits}`
      : `${numberToWords(whole, lang)} butun, ${digits}`;
  }
  if (lang === 'ru') {
    const feminine = (value) => {
      const n = Number(value);
      const words = numberToWords(value, lang);
      if (n % 100 >= 11 && n % 100 <= 19) return words;
      if (n % 10 === 1) return words.replace(/один$/, 'одна');
      if (n % 10 === 2) return words.replace(/два$/, 'две');
      return words;
    };
    const wholeNumber = Number(whole);
    const fractionNumber = Number(fraction);
    const wholeWords = feminine(whole);
    const wholeForm = wholeNumber % 100 !== 11 && wholeNumber % 10 === 1 ? 'целая' : 'целых';
    const singular = fractionNumber % 100 !== 11 && fractionNumber % 10 === 1;
    const places = singular
      ? { 1: 'десятая', 2: 'сотая', 3: 'тысячная' }
      : { 1: 'десятых', 2: 'сотых', 3: 'тысячных' };
    return `${wholeWords} ${wholeForm} ${feminine(fraction)} ${places[fraction.length]}`;
  }
  return `${numberToWords(whole, lang)} butun ${
    { 1: "o'ndan", 2: 'yuzdan', 3: 'mingdan' }[fraction.length]
  } ${numberToWords(fraction, lang)}`;
};

const periodicDecimalToWords = (whole, nonRepeating, period, lang) => {
  const wholeWords = numberToWords(whole, lang);
  const periodWords = numberToWords(period, lang);
  if (!nonRepeating) {
    return lang === 'ru'
      ? `${wholeWords} целых, ${periodWords} в периоде`
      : `${wholeWords} butun, davrda ${periodWords}`;
  }
  const finitePart = decimalToWords(whole, nonRepeating, lang);
  return lang === 'ru'
    ? `${finitePart}, ${periodWords} в периоде`
    : `${finitePart}, davrda ${periodWords}`;
};

const toTtsMath = (text, lang) => {
  const ops = lang === 'ru'
    ? { mul: ' умножить на ', div: ' разделить на ', ratio: ' к ', eq: ' равно ', minus: ' минус ', plus: ' плюс ' }
    : { mul: ' karra ', div: " bo'lingan ", ratio: ' nisbat ', eq: ' teng ', minus: ' minus ', plus: " qo'shuv " };
  // Ovoz uchun tipografik belgilar normallashtiriladi: uzun tire (—) TTS da
  // o'qilmay qolardi, tipografik apostroflar esa o'zbek so'zlarini buzardi.
  // Ekran matni o'zgarmaydi — bu faqat ovoz yo'lidagi tozalash.
  const typographySafe = String(text || '')
    .replace(/[‘’ʻʼ]/g, "'")
    .replace(/\s*—\s*/g, ', ');
  const pronunciationSafe = lang === 'uz'
    ? stripAudioTags(typographySafe)
        .replace(/\bqismga\b/gi, "bo'lakka")
        .replace(/\bqismda\b/gi, "bo'lakda")
        .replace(/\bqismni\b/gi, "bo'lakni")
        .replace(/\bqism\b/gi, "bo'lak")
    : stripAudioTags(typographySafe);
  const mathNamed = pronunciationSafe.replace(
    /\|([^|]+)\|/g,
    (_, inside) => `${lang === 'ru' ? 'модуль' : 'modul'} ${inside}`,
  )
    .replace(/π/g, lang === 'ru' ? ' пи ' : ' pi ')
    .replace(/Δ/g, lang === 'ru' ? ' треугольник ' : ' uchburchak ')
    .replace(/∠/g, lang === 'ru' ? ' угол ' : ' burchak ')
    .replace(/⊥/g, lang === 'ru' ? ' перпендикулярно ' : ' perpendikulyar ')
    .replace(/→/g, lang === 'ru' ? ' переходит в ' : " o'tadi ")
    .replace(/′/g, lang === 'ru' ? ' штрих ' : ' shtrix ')
    .replace(/(\w|\d)²/g, (_, base) => lang === 'ru' ? `${base} в квадрате` : `${base} kvadrati`)
    .replace(/(\w|\d)³/g, (_, base) => lang === 'ru' ? `${base} в кубе` : `${base} kubi`)
    .replace(/°/g, lang === 'ru' ? ' градусов ' : ' daraja ');
  const ratioContext = lang === 'ru'
    ? /\b(отнош|пропорц|масштаб)/i.test(mathNamed)
    : /\b(nisbat|propors|masshtab)/i.test(mathNamed);
  const clean = mathNamed
    .replace(
      /\b(\d{1,3})[,.](\d{0,3})\((\d{1,3})\)/g,
      (_, whole, nonRepeating, period) => periodicDecimalToWords(whole, nonRepeating, period, lang),
    )
    .replace(
      /\b(\d{1,6})[,.](\d{1,12})\b/g,
      (_, whole, fraction) => decimalToWords(whole, fraction, lang),
    )
    .replace(
      /\b(\d{1,3})\s*:\s*(\d{1,3})\s*=\s*(\d{1,3})\b/g,
      (_, a, b, c) => lang === 'ru'
        ? `${numberToWords(a, lang)} разделить на ${numberToWords(b, lang)} равно ${numberToWords(c, lang)}`
        : `${numberToWords(a, lang)}ni ${numberToWords(b, lang)}ga bo'lsak, ${numberToWords(c, lang)} chiqadi`
    );
  return normalizeTtsColons(clean, {
    divisionWord: ops.div,
    ratioWord: ops.ratio,
    ratioContext,
  })
    .replace(/(\d{1,3}|\?)\s*\/\s*(\d{1,3})/g, (_, n, d) => fractionToWords(n, d, lang))
    .replace(/\s*\/\s*/g, ops.div)
    .replace(/\s*[·×]\s*/g, ops.mul)
    .replace(/\s*%\s*/g, lang === 'ru' ? ' процентов ' : ' foiz ')
    .replace(/\s*≤\s*/g, lang === 'ru' ? ' меньше или равно ' : ' kichik yoki teng ')
    .replace(/\s*≥\s*/g, lang === 'ru' ? ' больше или равно ' : ' katta yoki teng ')
    .replace(/\s*<\s*/g, lang === 'ru' ? ' меньше ' : ' kichik ')
    .replace(/\s*>\s*/g, lang === 'ru' ? ' больше ' : ' katta ')
    .replace(/\s*=\s*/g, ops.eq)
    .replace(/\s*≈\s*/g, lang === 'ru' ? ' примерно равно ' : ' taxminan teng ')
    .replace(/\s*\+\s*/g, ops.plus)
    .replace(/\s*[−–]\s*/g, ops.minus)
    .replace(/\b\d{1,6}\b/g, (m) => numberToWords(m, lang))
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// HTTP TTS v5.2: {base}/api/tts?text=<encoded>&g=m|f — ТОЛЬКО text + g.
// Язык передаётся МАРКЕРОМ внутри text: [Русское произношение] / [O'zbekcha tallaffuz].
// Раньше движок маркер не ставил и язык угадывал сервер по алфавиту — ElevenLabs в LMS
// ошибался и читал узбекскую латиницу русским (иногда английским) произношением.
// Решение методиста 2026-08-04: маркер обязателен для КАЖДОЙ дорожки, ставит движок.
function buildTtsUrl(base, text, gender, lang) {
  const raw = String(text);
  // Til markeri MAJBURIY: ElevenLabs alifbo bo'yicha tilni xato tanlab,
  // lotin yozuvidagi o'zbek matnini ruscha yoki inglizcha talaffuzda o'qirdi.
  // Marker matn boshida turadi; kontentda allaqachon bo'lsa, ikkinchisini
  // qo'shmaymiz. Kvadrat qavslar (%5B/%5D) ataylab kodlanmaydi.
  const tag = LANG_TAG[resolveTtsLang(raw, lang)];
  const body = HAS_LANG_TAG_RE.test(raw)
    ? raw.slice(0, 1000)
    : `${tag} ${raw.slice(0, Math.max(0, 1000 - tag.length - 1))}`;
  const enc = encodeURIComponent(body).replace(/%5B/g, '[').replace(/%5D/g, ']');
  const g = 'm'; // v5.5-male: erkak ovoz qattiq qulflangan
  return `${base}/api/tts?text=${enc}&g=${g}`;
}

// Lokal previewda brauzer ba'zan uz-UZ so'rovini standart rus ovoziga
// almashtiradi. Avval o'zbek ovozini, u bo'lmasa lotin yozuviga yaqin
// turkiy ovozni tanlaymiz; rus ovoziga faqat ru rejimida ruxsat beriladi.
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
    el.src = buildTtsUrl(base, segment.text, gender, segment.lang || this.currentLang);
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

    // Javob ovoz tugashidan oldin tanlansa, savol izohini darhol to'xtatamiz.
    // Segmentni yakunlangan deb belgilash cancel/onerror hodisasining navbatni
    // ikkinchi marta siljitishiga yo'l qo'ymaydi.
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

  // O'quvchi oldingi xato izohi tugamasidan boshqa javobni tanlasa,
  // faqat eng so'nggi tanlov tahlili qoladi. Transport callbacklarini ham
  // uzamiz — kech kelgan onend/onerror yangi navbatni siljitib yubormaydi.
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
    // Keyingi feedback alohida Audio instance'da boshlanadi. Shunda eski
    // HTTP manbaning kechikkan media hodisasi yangi handlerga tushmaydi.
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
    // Screen audio start taymeri allaqachon o'tgan. Keyingi pushOneOff yangi
    // feedbackni shu zahoti boshlashi uchun engine "started" bo'lib qoladi.
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
  // AudioEngine bitta umumiy instans. Slayd almashganda uning mute holati
  // saqlanib qoladi; yangi hook esa avval uni bilmas edi. Natijada ayrim
  // slaydlar ovozsiz qolib, tugma esa "ovoz yoqilgan" ko'rinishida turardi.
  const [state, setState] = useState(() => ({
    isPlaying: false,
    isBusy: false,
    hasStarted: false,
    currentSegment: null,
    lastCompletedSegment: null,
    waitingFor: null,
    muted: Boolean(getAudioEngine()?.muted),
  }));
  const engineRef = useRef(null);

  // Стабилизация segments по содержимому, не по ссылке (без этого cancel-loop, звук молчит).
  // Barcha matematik yozuvlar shu yagona eshikda TTS uchun tabiiy matnga
  // aylantiriladi: 2/3 ekranda kasr bo'lib qoladi, ovoz esa "uchdan ikki" deydi.
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
  // Qulf klapani: TTS umuman javob bermasa ham dars o'tib ketishi kerak.
  const [navTimedOut, setNavTimedOut] = useState(false);
  useEffect(() => {
    setNavTimedOut(false);
    const id = setTimeout(() => setNavTimedOut(true), NAV_UNLOCK_MS);
    return () => clearTimeout(id);
  }, [stableSegments]);

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engineRef.current = engine;
    engine.setLang(lang);
    engine.setGender(ttsConfig.voiceGender || 'm');
    engine.setMuted(state.muted);
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

  // EKRAN QULFI (metodist qarori 2026-08-04): «Davom» tugmasi ovoz tugamaguncha
  // ochilmaydi. Ilgari qulf faqat `isBusy` ga tayanardi va ekran ochilgan bilan
  // TTS yuklanguncha oradagi bir necha yuz millisekundda tugma FAOL bo'lib
  // turardi — bola izohni eshitmasdan slaydni o'tkazib yuborishi mumkin edi.
  //
  // Ikki xavfsizlik klapani bor, aks holda dars butunlay qulflanib qolardi:
  //   1) ovoz o'chirilgan bo'lsa (muted) qulf ishlamaydi;
  //   2) TTS javob bermasa, NAV_UNLOCK_MS dan keyin qulf o'zi ochiladi.
  const canAdvance = state.muted
    || navTimedOut
    || (state.hasStarted && !state.isBusy);

  return {
    ...state,
    canAdvance,
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

// mt: matematik matnni yagona ko'rinishda render qiladi:
// «a/b», «?/b» va «(a × k)/(b × k)» — chiziqli Frac;
// matn ichida qolgan barcha raqamlar — bir xil mono shrift.
const FRAC_RE = /\(([^()]+)\)\s*\/\s*\(([^()]+)\)|(\d+|\?)\/(\d+)|(\d+)/g;
const mt = (str) => {
  const s = typeof str === 'string' ? str : String(str ?? '');
  if (!/[0-9/?]/.test(s)) return s;
  const out = []; let last = 0; let m; let key = 0;
  FRAC_RE.lastIndex = 0;
  while ((m = FRAC_RE.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[5] !== undefined) {
      out.push(<span className="mnum" key={`mtn${key}`}>{m[5]}</span>);
    } else {
      out.push(<Frac key={`mtf${key}`} n={m[1] ?? m[3]} d={m[2] ?? m[4]} size="sm"/>);
    }
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

// 6-sinf kirish slaydlari uchun yagona sokin ritm:
// kompozitsiya mayin joylashadi -> misol ochiladi -> savol va variantlar keladi.
// Uzoq kutish ham, spring/overshoot ham yo'q — harakat mazmunni kutdirib qo'ymaydi.
function useIntroStages({ start, optionsReady = start }) {
  const [compact, setCompact] = useState(false);
  // Hook mazmuni birinchi kadrning o'zida DOMda va ekranda bo'lsin.
  // Uning fade-up animatsiyasi yetarli; alohida kutish mavzuni introga aylantirib yuboradi.
  const [showExample] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!start) return undefined;
    setCompact(true);
    return undefined;
  }, [start]);

  useEffect(() => {
    if (!showExample || !optionsReady) return undefined;
    const promptTimer = setTimeout(() => setShowPrompt(true), 280);
    const optionsTimer = setTimeout(() => setShowOptions(true), 520);
    return () => {
      clearTimeout(promptTimer);
      clearTimeout(optionsTimer);
    };
  }, [showExample, optionsReady]);

  return { compact, showExample, showPrompt, showOptions };
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

// `disabled` propi ilgari qabul qilinmagan edi: ekranlar uni uzatardi, tugma esa
// e'tiborsiz qoldirardi — ya'ni ovoz tugashini kutish qulfi umuman ishlamagan.
// CSS da `.btn-white-accent:disabled` uslubi allaqachon bor edi.
const NavNext = ({ label, onClick, disabled = false }) => (
  <button className="btn-white-accent" onClick={onClick} disabled={disabled} aria-disabled={disabled}
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
const QuestionScreen = ({ screen, idx, totalScreens, screenMeta, screenContent, titleNode, question, options, correctIdx, storedAnswer, onAnswer, onNext, onPrev, factOnCorrect, factAudio, factNode, figure, interruptFeedbackOnSelection = true }) => {
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
  const wrongFeedbackTimerRef = useRef(null);
  const post = useAnswerSequence({
    audio,
    screen: idx,
    correctText: c.correct_text[lang],
    whyNode: factOnCorrect,
    factAudio: factAudio?.[lang],
    initiallyComplete: wasSolved,
  });
  // 900ms — FeedbackBlock o'z skrollini (350ms) tugatgandan keyin fakt-kartochkaga o'tamiz.
  const factRef = useRevealScroll(post.showWhy, 300);

  useEffect(() => () => {
    if (wrongFeedbackTimerRef.current) clearTimeout(wrongFeedbackTimerRef.current);
  }, []);

  const pick = (i) => {
    if (solved) return;        // после верного — заблокировано
    if (wrong.has(i)) return;  // уже погашенный неверный — игнор
    const isCorrect = i === correctIdx;
    const isNextSelection = introAdvancedRef.current;

    if (wrongFeedbackTimerRef.current) {
      clearTimeout(wrongFeedbackTimerRef.current);
      wrongFeedbackTimerRef.current = null;
    }
    if (interruptFeedbackOnSelection && isNextSelection && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }

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
      const speakFeedback = () => {
        const engine = getAudioEngine();
        if (engine && !audio.muted) {
          const wrongVoice = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`hint_${i}`] && c[`hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
          engine.pushOneOff(toTtsMath(wrongVoice, lang));
        }
      };
      wrongFeedbackTimerRef.current = setTimeout(() => {
        wrongFeedbackTimerRef.current = null;
        speakFeedback();
      }, 300);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!solved || !audio.canAdvance} onClick={onNext} label={<NextLabel/>}/>
    </>
  );

  const figNode = figure ? figure(solved) : null;

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 18px)' }}>
        {titleNode && <Title node={titleNode}/>}
        {/* Savol matni javobdan keyin ham qoladi — bola nimaga javob berganini ko'rib tursin. */}
        <div className="fade-up">{question}</div>
        {/* figure(solved) null qaytarsa ramka ham chizilmaydi — ekran javobdan
            keyin rasmni "Nega shunday" ichiga topshirib, o'zi yengillashadi. */}
        {figNode && <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(12px, 2.4vw, 18px)' }}>{figNode}</div>}
        {/* To'g'ri javobdan keyin BARCHA variantlar yuqoriga yig'ilib yo'qoladi —
            "To'g'ri" va "Nega shunday" tepaga chiqadi, skroll kerak bo'lmaydi.
            Javob matni FeedbackBlock'da qoladi, shuning uchun hech narsa yo'qolmaydi. */}
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: solved ? '1fr' : 'repeat(2, minmax(0, 1fr))', justifyItems: solved ? 'center' : 'stretch', gap: solved ? 0 : 10 }}>
          {options.map((opt, i) => {
            const isWrongPicked = wrong.has(i);
            const isCorrect = i === correctIdx;
            const collapse = solved;                       // javobdan keyin hammasi yig'iladi
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
        {solved && post.showWhy && factOnCorrect && (
          <div ref={factRef}>{React.cloneElement(factOnCorrect, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {solved && post.showFact && factNode}
      </div>
    </Stage>
  );
};


// ============================================================
// --- UROK: div_6_01 — Делители и кратные / Bo'luvchilar va karrali sonlar ---
// Infra grade5/Dars01 (baytma-bayt: T/AudioEngine/useAudio/Stage/FeedbackBlock/QuestionScreen/mt/
// useMobileZoom/useRevealScroll/...). Mobil naqsh BOSHIDAN ichida (ETALON_6SINF.md §5).
// Kontekst: nonlarni teng qatorlarga terish. Qiyinlik pog'onasi 10 -> 36;
// savollarning bir qismi rasm bilan (UnitArray/UnitPile), bir qismi rasmsiz.
// UZ TERMIN (darslik «Matematika 6-sinf», 2022, 22-bet): «кратное» = KARRALI
// («N ga karrali», «N ning karralisi», «karrali sonlar»). `karra` — bu FAQAT
// ko'paytirish o'qilishi («olti karra olti»), hech qachon «кратное» emas.
// ============================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_01',
  lessonTitle: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar" }
};

// Etalon tartib (v2, syujetsiz): dars SARLAVHA bilan ochiladi, so'ng bitta
// misolning ikki nomi bosqichma-bosqich ochiladi, keyin bola shu shaklni o'zi
// takrorlaydi. Qiyinlik pog'onasi: 12 -> 20 -> 10 -> 14 -> 12 -> 24 -> 18 -> 36.
const SCREEN_META = [
  { id: 's0',  type: 'title',       template: 'TitleScreen',    scored: false, scope: 'hook' },     // 0  mavzu nomi
  { id: 's1',  type: 'exploration', template: 'RevealScreen',   scored: false, scope: null },       // 1  12:3=4 — ikki nom (o'zak)
  { id: 's3',  type: 'rule',        template: 'RuleScreen',     scored: false, scope: null },       // 3  qoida: bo'luvchi + karra
  { id: 's4',  type: 'exploration', template: 'RevealScreen',   scored: false, scope: null },       // 4  qoldiq: 10:4 (RASM)
  { id: 's6',  type: 'exploration', template: 'RevealScreen',   scored: false, scope: null },       // 6  juftlab qidirish (+ fakt)
  { id: 's8',  type: 'exploration', template: 'RevealScreen',   scored: false, scope: null },       // 8  1 va sonning o'zi (RASM)
  { id: 's10', type: 'exploration', template: 'RevealScreen',   scored: false, scope: null },       // 10 cheksiz karra / sanoqli bo'luvchi
  { id: 's2',  type: 'test',        template: 'PairNaming',     scored: true,  scope: 'practice' }, // 2  20:5=4 — o'zi nomlaydi
  { id: 's5',  type: 'test',        template: 'QuestionScreen', scored: true,  scope: 'practice' }, // 5  14:4 (RASM)
  { id: 's7',  type: 'test',        template: 'OddOneOut',      scored: true,  scope: 'practice' }, // 7  rasmsiz
  { id: 's9',  type: 'test',        template: 'PickDivisors',   scored: true,  scope: 'practice' }, // 9  18 ning bo'luvchilari (+ fakt)
  { id: 's11', type: 'test',        template: 'DragMatch',      scored: true,  scope: 'practice' }, // 11 rasmsiz
  { id: 's12', type: 'test',        template: 'Classify',       scored: true,  scope: 'practice' }, // 12 rasmsiz
  { id: 's13', type: 'test',        template: 'PickDivisors',   scored: true,  scope: 'final' },    // 13 36 ning bo'luvchilari (+ fakt)
  { id: 's14', type: 'summary',     template: 'custom',         scored: false, scope: null }        // 14 xulosa
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Тема урока', uz: 'Dars mavzusi' },
    kicker: { ru: 'Урок 1 · Делимость', uz: "1-dars · Bo'linish" },
    title: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar" },
    subtitle: {
      ru: 'Давайте сегодня научимся различать делители и кратные числа.',
      uz: "Keling, bugun sizlar bilan bo'luvchi va karrali sonlarni ajratishni o'rganamiz."
    },
    tease_a: { ru: '12 — ?', uz: '12 — ?' },
    tease_b: { ru: '3 — ?', uz: '3 — ?' },
    prompt: { ru: 'Готов начать?', uz: 'Boshlashga tayyormisiz?' },
    opt_go: { ru: 'Да, начнём', uz: 'Ha, boshlaymiz' },
    opt_know: { ru: 'Эту тему я знаю', uz: 'Bu mavzuni bilaman' },
    opt_new: { ru: 'Хочу разобраться', uz: "Buni bilishni xohlayman" },
    audio: {
      ru: [
        'Тема урока: делители и кратные числа. Сегодня мы научимся различать делители и кратные.',
        'Ты уже знаешь, что двенадцать разделить на три равно четыре. А сейчас мы разберём, как называется каждое число в этом примере.'
      ],
      uz: [
        "Dars mavzusi: bo'luvchilar va karrali sonlar. Keling, bugun sizlar bilan bo'luvchi va karrali sonlarni ajratishni o'rganamiz.",
        "O'n ikkini uchga bo'lsak, to'rt chiqishini bilasiz. Hozir esa sizlar bilan har biri qanday nomlanishini ko'rib chiqamiz."
      ]
    }
  },

  s1: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Один пример — два названия', uz: 'Bitta misol — ikkita nom' },
    bridge: {
      ru: 'Рассмотрим следующий пример: 12 : 3 = 4. Посмотри на рисунок.',
      uz: "Quyidagi misolni ko'rib chiqamiz: 12 : 3 = 4. Rasmga qarang."
    },
    lbl_mult: { ru: '12 — кратное числа 3', uz: "12 — 3 ning karralisi" },
    cap_mult: { ru: 'Кратные числа 3:', uz: "3 ga karrali sonlar:" },
    lbl_div: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi" },
    cap_div: { ru: 'Делители числа 12:', uz: "12 ning bo'luvchilari:" },
    link: {
      ru: '12 делится на 3 без остатка: 12 — кратное числа 3, а 3 — делитель числа 12.',
      uz: "12 soni 3 ga qoldiqsiz bo'linadi: 12 — 3 ning karralisi, 3 esa 12 ning bo'luvchisi."
    },
    audio: {
      ru: [
        'Рассмотрим следующий пример. Двенадцать разделить на три равно четыре. Посмотри на рисунок.',
        'Двенадцать это кратное числа три. Посмотри на ряд кратных: три, шесть, девять, двенадцать, пятнадцать и дальше. Двенадцать стоит в этом ряду.',
        'А три это делитель числа двенадцать. Вот делители двенадцати: один, два, три, четыре, шесть, двенадцать. Три стоит и здесь.',
        'Двенадцать делится на три без остатка. Поэтому двенадцать кратное числа три, а три делитель числа двенадцать.'
      ],
      uz: [
        "Quyidagi misolni ko'rib chiqamiz. O'n ikkini uchga bo'lsak, to'rt chiqadi. Rasmga qarang.",
        "O'n ikki bu uchning karralisi. Uchga karrali sonlar qatoriga qarang: uch, olti, to'qqiz, o'n ikki, o'n besh va shu tariqa. O'n ikki shu qatorda turibdi.",
        "Uch esa o'n ikkining bo'luvchisi. Mana o'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti, o'n ikki. Uch bu yerda ham bor.",
        "O'n ikki soni uchga qoldiqsiz bo'linadi. Shuning uchun o'n ikki uchning karralisi, uch esa o'n ikkining bo'luvchisi."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    question: { ru: 'Теперь разбери пример сам', uz: "Endi misolni o'zingiz tahlil qiling" },
    num_a: '20', num_b: '5', num_r: '4',
    row_a: { ru: '20 — это … числа 5', uz: "20 — bu 5 sonining …" },
    row_b: { ru: '5 — это … числа 20', uz: "5 — bu 20 sonining …" },
    opt_mult: { ru: 'кратное', uz: 'karralisi' },
    opt_div: { ru: 'делитель', uz: "bo'luvchisi" },
    correct_text: { ru: 'Верно. 20 : 5 = 4 без остатка. Значит, 20 — кратное числа 5, а 5 — делитель числа 20.', uz: "To'g'ri. 20 : 5 = 4, qoldiq yo'q. Demak, 20 — 5 sonining karralisi, 5 esa 20 sonining bo'luvchisi." },
    hint: { ru: 'Проверь деление: 20 делится на 5 без остатка.', uz: "Bo'lishni tekshiring: 20 soni 5 ga qoldiqsiz bo'linadi." },
    why: {
      ru: [
        '20 : 5 = 4 — деление вышло ровным, остатка нет.',
        '20 = 5 · 4, поэтому 20 — кратное числа 5.',
        'В том же равенстве 5 — делитель числа 20.'
      ],
      uz: [
        "20 : 5 = 4 — bo'lish teng chiqdi, qoldiq yo'q.",
        "20 = 5 · 4, shuning uchun 20 soni 5 ning karralisi.",
        "Xuddi shu tenglikda 5 soni 20 ning bo'luvchisi."
      ]
    },
    audio: {
      intro: { ru: 'Теперь разбери пример сам. Двадцать разделить на пять равно четыре. Подбери название для каждого числа.', uz: "Endi misolni o'zingiz tahlil qiling. Yigirmani beshga bo'lsak, to'rt chiqadi. Har bir songa nom tanlang." },
      on_correct: { ru: 'Верно. Двадцать кратное пяти, а пять делитель двадцати.', uz: "To'g'ri. Yigirma soni beshning karralisi, besh esa yigirmaning bo'luvchisi." },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку и попробуй ещё раз.', uz: "Unchalik emas. Maslahatga qarang va yana urinib ko'ring." }
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    title: { ru: 'Два названия одного деления', uz: "Bitta bo'lishning ikki nomi" },
    rule_1: { ru: 'Если a делится на b без остатка, то b называют делителем числа a.', uz: "Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi." },
    rule_2: { ru: 'В том же самом примере a называют кратным числа b.', uz: "Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi." },
    audio: { ru: 'Запомним правило. Если a делится на b без остатка, то b называют делителем числа a. А в том же самом примере a называют кратным числа b. Одно деление, два названия.', uz: "Qoidani eslab qolamiz. Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi. Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi. Bitta bo'lish, ikkita nom." }
  },

  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'А если остаётся лишнее?', uz: 'Ortib qolsa-chi?' },
    rest_label: { ru: 'остаток', uz: 'qoldiq' },
    note_rem: { ru: '10 : 4 — остаётся 2. Значит, 4 не делитель числа 10.', uz: "10 : 4 — 2 ta ortib qoladi. Demak, 4 soni 10 ning bo'luvchisi emas." },
    note_ok: { ru: '12 : 4 = 3 — не осталось ничего. Значит, 4 — делитель числа 12.', uz: "12 : 4 = 3 — hech narsa ortmadi. Demak, 4 soni 12 ning bo'luvchisi." },
    audio: {
      ru: [
        'Возьмём десять и разложим на четыре равные части. В каждую попадает по две, и две штуки остаются лишними.',
        'Остаток не ноль, значит четыре не делитель числа десять. Делителем называют только то число, которое делит нацело.',
        'А теперь возьмём двенадцать и снова разложим на четыре части. В каждой по три, лишнего нет. Вот теперь четыре это делитель числа двенадцать.'
      ],
      uz: [
        "O'nni olib, to'rtta teng bo'lakka ajratamiz. Har biriga ikkitadan tushadi, ikkitasi esa ortib qoladi.",
        "Qoldiq nolga teng emas, demak to'rt soni o'nning bo'luvchisi emas. Berilgan son qaysi songa qoldiqsiz bo'linsa, o'sha son uning bo'luvchisi deyiladi.",
        "Endi o'n ikkini olib, yana to'rtta teng bo'lakka ajratamiz. Har birida uchtadan, ortiqchasi yo'q. Mana endi to'rt soni o'n ikkining bo'luvchisi."
      ]
    }
  },

  s5: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    bridge: { ru: 'Проверим на другом числе.', uz: 'Boshqa sonda tekshiramiz.' },
    question: { ru: '14 разделили на 4 равные части. Что получится?', uz: "14 ni 4 ta teng qismga ajratdik. Nima bo'ladi?" },
    opt0: { ru: 'По 3, и 2 останутся лишними', uz: '3 tadan, 2 tasi ortib qoladi' },
    opt1: { ru: 'По 3, лишних не останется', uz: '3 tadan, ortiqchasi qolmaydi' },
    opt2: { ru: 'По 4, лишних не останется', uz: '4 tadan, ortiqchasi qolmaydi' },
    opt3: { ru: 'По 2, и 6 останутся лишними', uz: '2 tadan, 6 tasi ortib qoladi' },
    correctIndex: 0,
    correct_text: { ru: 'Верно. 14 = 4 · 3 + 2: по 3 в каждой части и 2 лишних. Значит, 4 не делитель числа 14.', uz: "To'g'ri. 14 = 4 · 3 + 2: har qismda 3 tadan va 2 tasi ortiqcha. Demak, 4 soni 14 ning bo'luvchisi emas." },
    // wrong_N — ko'rinadigan matn; audio_hint_N — TTS-toza variant (QuestionScreen
    // uni birinchi navbatda oladi). Indekslar shuffleMC dan OLDINGI tartibda.
    wrong_1: { ru: 'Без остатка не выйдет: 4 · 3 = 12, а у нас 14. Две штуки некуда деть поровну.', uz: "Qoldiqsiz chiqmaydi: 4 · 3 = 12, bizda esa 14 ta. Ikkitasini teng joylashning iloji yo'q." },
    audio_hint_1: { ru: 'Без остатка не выйдет. Четыре умножить на три равно двенадцать, а у нас четырнадцать. Две штуки некуда деть поровну.', uz: "Qoldiqsiz chiqmaydi. To'rt karra uch o'n ikki, bizda esa o'n to'rtta. Ikkitasini teng joylashning iloji yo'q." },
    wrong_2: { ru: '4 · 4 = 16 — это больше, чем 14. Столько не наберётся.', uz: "4 · 4 = 16 — bu 14 dan ko'p. Bunchasi yig'ilmaydi." },
    audio_hint_2: { ru: 'Четыре умножить на четыре равно шестнадцать, а это больше четырнадцати. Столько не наберётся.', uz: "To'rt karra to'rt o'n olti, bu esa o'n to'rtdan ko'p. Bunchasi yig'ilmaydi." },
    wrong_3: { ru: 'Остаток не может быть больше делителя: 6 больше 4. Значит, в каждую часть можно положить ещё.', uz: "Qoldiq bo'luvchidan katta bo'lolmaydi: 6 soni 4 dan katta. Demak, har qismga yana qo'shsa bo'ladi." },
    audio_hint_3: { ru: 'Остаток не может быть больше делителя. Шесть больше четырёх. Значит, в каждую часть можно положить ещё.', uz: "Qoldiq bo'luvchidan katta bo'lolmaydi. Olti soni to'rtdan katta. Demak, har qismga yana qo'shsa bo'ladi." },
    why: {
      ru: [
        '4 · 3 = 12 — это меньше 14, значит по 3 в каждую часть положить можно.',
        '4 · 4 = 16 — это уже больше 14, по 4 не хватит.',
        'Остаётся 14 − 12 = 2. Остаток не ноль — значит 4 не делитель числа 14.'
      ],
      uz: [
        "4 · 3 = 12 — bu 14 dan kichik, demak har qismga 3 tadan qo'yish mumkin.",
        "4 · 4 = 16 — bu 14 dan katta, 4 tadan yetmaydi.",
        "14 − 12 = 2 ortadi. Qoldiq nol emas — demak 4 soni 14 ning bo'luvchisi emas."
      ]
    },
    audio: {
      intro: { ru: 'Проверим на другом числе. Четырнадцать разложим на четыре равные части. Что получится? Выбери ответ.', uz: "Boshqa sonda tekshiramiz. O'n to'rtni to'rtta teng bo'lakka ajratamiz. Nima bo'ladi? Javobni tanlang." },
      on_correct: { ru: 'Верно. Две штуки остались лишними.', uz: "To'g'ri. Ikkitasi ortib qoldi." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  s6: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Делители ищем парами', uz: "Bo'luvchilarni juftlab qidiramiz" },
    cap_all: { ru: 'Все делители числа 12:', uz: "12 ning barcha bo'luvchilari:" },
    fact: { ru: 'Товары часто считают дюжинами — по 12 штук. Число 12 удобно тем, что делится на 2, 3, 4 и 6, поэтому дюжину легко разделить поровну.', uz: "Tovarlar ko'pincha dyujina bilan — 12 tadan sanaladi. 12 soni 2, 3, 4 va 6 ga bo'lingani uchun qulay: dyujinani teng bo'lish oson." },
    fact_audio: { ru: 'Знаешь ли ты? Товары часто считают дюжинами, по двенадцать штук. Двенадцать удобно тем, что делится на два, три, четыре и шесть, поэтому дюжину легко разделить поровну.', uz: "Bilasizmi? Tovarlar ko'pincha dyujina bilan, o'n ikkitadan sanaladi. O'n ikki soni ikki, uch, to'rt va oltiga bo'lingani uchun qulay, shuning uchun dyujinani teng bo'lish oson." },
    audio: {
      ru: [
        'Делители удобно искать парами. Двенадцать это один умножить на двенадцать. Значит, один и двенадцать оба делители.',
        'Идём дальше. Двенадцать это два умножить на шесть. Значит, два и шесть тоже делители.',
        'И последняя пара. Двенадцать это три умножить на четыре. Дальше пары начнут повторяться, поэтому список закончен: один, два, три, четыре, шесть, двенадцать.'
      ],
      uz: [
        "Bo'luvchilarni juftlab qidirish qulay. O'n ikki bu bir karra o'n ikki. Demak, bir ham, o'n ikki ham bo'luvchi.",
        "Davom etamiz. O'n ikki bu ikki karra olti. Demak, ikki va olti ham bo'luvchi.",
        "Va oxirgi juftlik. O'n ikki bu uch karra to'rt. Bundan keyin juftliklar takrorlana boshlaydi, shuning uchun ro'yxat tugadi: bir, ikki, uch, to'rt, olti, o'n ikki."
      ]
    }
  },

  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    question: { ru: 'Найди число, которое НЕ кратно 6', uz: "6 ga karrali BO'LMAGAN sonni toping" },
    lead: { ru: 'Три числа делятся на 6 без остатка, одно — нет.', uz: "Uchta son 6 ga qoldiqsiz bo'linadi, bittasi esa yo'q." },
    items: [
      { num: '12' },
      { num: '18' },
      { num: '24' },
      { num: '28' }
    ],
    errorIdx: 3,
    correct_text: { ru: 'Верно. 28 : 6 = 4 и 4 в остатке. Остальные — 12, 18 и 24 — делятся на 6 нацело.', uz: "To'g'ri. 28 : 6 = 4 va 4 qoldiq. Qolganlari — 12, 18 va 24 — 6 ga butun bo'linadi." },
    // wrong_N — KO'RINADIGAN matn (formula bilan). audio_hint_N — o'sha fikrning
    // TTS-toza varianti (raqam va belgilar so'z bilan); OddOneOut aynan uni o'qiydi.
    wrong_0: { ru: '12 = 6 · 2 — это кратное. Ищи число, которое на 6 нацело не делится.', uz: "12 = 6 · 2 — bu karrali son. 6 ga butun bo'linmaydigan sonni qidiring." },
    audio_hint_0: { ru: 'Двенадцать это шесть умножить на два, значит кратное. Ищи число, которое на шесть нацело не делится.', uz: "O'n ikki bu olti karra ikki, demak karrali son. Oltiga butun bo'linmaydigan sonni qidiring." },
    wrong_1: { ru: '18 = 6 · 3 — кратное. Проверь остальные числа делением на 6.', uz: "18 = 6 · 3 — karrali son. Qolgan sonlarni 6 ga bo'lib tekshiring." },
    audio_hint_1: { ru: 'Восемнадцать это шесть умножить на три, значит кратное. Проверь остальные числа делением на шесть.', uz: "O'n sakkiz bu olti karra uch, demak karrali son. Qolgan sonlarni oltiga bo'lib tekshiring." },
    wrong_2: { ru: '24 = 6 · 4 — кратное. Пройди по таблице умножения на 6.', uz: "24 = 6 · 4 — karrali son. 6 ga ko'paytirish jadvalidan yuring." },
    audio_hint_2: { ru: 'Двадцать четыре это шесть умножить на четыре, значит кратное. Пройди по таблице умножения на шесть.', uz: "Yigirma to'rt bu olti karra to'rt, demak karrali son. Oltiga ko'paytirish jadvalidan yuring." },
    why: {
      ru: [
        'Ряд кратных числа 6: 6, 12, 18, 24, 30.',
        '12, 18 и 24 стоят в этом ряду — все они кратны шести.',
        '28 в ряд не попадает: оно между 24 и 30. Проверяем: 28 : 6 = 4 и 4 в остатке.'
      ],
      uz: [
        "6 ga karrali sonlar qatori: 6, 12, 18, 24, 30.",
        "12, 18 va 24 shu qatorda turibdi — hammasi oltiga karrali.",
        "28 qatorga tushmaydi: u 24 bilan 30 orasida. Tekshiramiz: 28 : 6 = 4 va 4 qoldiq."
      ]
    },
    audio: {
      intro: { ru: 'Считай в уме. Три числа делятся на шесть без остатка, а одно нет. Найди его.', uz: "Xayolan hisoblang. Uchta son oltiga qoldiqsiz bo'linadi, bittasi esa yo'q. Uni toping." },
      on_correct: { ru: 'Верно. Двадцать восемь на шесть нацело не делится.', uz: "To'g'ri. Yigirma sakkiz oltiga butun bo'linmaydi." },
      on_wrong: { ru: 'Это кратное шести. Ищи дальше.', uz: "Bu son oltiga karrali. Yana qidiring." }
    }
  },

  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Два делителя есть всегда', uz: "Ikkita bo'luvchi doim bor" },
    note_one: { ru: 'Любое натуральное число делится на 1 без остатка.', uz: "Har qanday natural son 1 ga qoldiqsiz bo'linadi." },
    note_self: { ru: 'Любое натуральное число делится само на себя без остатка.', uz: "Har qanday natural son o'ziga o'zi qoldiqsiz bo'linadi." },
    note_prime: { ru: 'Поэтому 1 и само число всегда являются его делителями. Если других делителей нет, число называют простым.', uz: "Shuning uchun 1 va sonning o'zi doim uning bo'luvchilari bo'ladi. Boshqa bo'luvchisi bo'lmasa, son tub son deyiladi." },
    audio: {
      ru: [
        'Разделим двенадцать на один. Получается двенадцать, остатка нет. Так будет с любым натуральным числом.',
        'Теперь разделим двенадцать на само двенадцать. Получается один, и снова без остатка.',
        'Поэтому единица и само число всегда являются его делителями. Если у числа других делителей нет, его называют простым. Про простые числа будет отдельный урок.'
      ],
      uz: [
        "O'n ikkini birga bo'lamiz. O'n ikki chiqadi, qoldiq yo'q. Har qanday natural sonda shunday bo'ladi.",
        "Endi o'n ikkini o'n ikkining o'ziga bo'lamiz. Bir chiqadi, yana qoldiqsiz.",
        "Shuning uchun bir va sonning o'zi doim uning bo'luvchilari bo'ladi. Sonning boshqa bo'luvchisi bo'lmasa, u tub son deyiladi. Tub sonlar haqida alohida dars bo'ladi."
      ]
    }
  },

  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    label: { ru: 'выбираем делители', uz: "bo'luvchilarni tanlaymiz" },
    context: { ru: 'Нажимай на подходящие числа в ряду.', uz: "Qatordan mos sonlarni bosing." },
    question: { ru: 'Выбери все делители числа 18', uz: "18 sonining barcha bo'luvchilarini tanlang" },
    numbers: ['1', '2', '3', '4', '5', '6', '9', '12', '18'],
    divisors: ['1', '2', '3', '6', '9', '18'],
    correct_text: { ru: 'Верно: 1, 2, 3, 6, 9, 18 — всего 6 делителей.', uz: "To'g'ri: 1, 2, 3, 6, 9, 18 — jami 6 ta bo'luvchi." },
    hint: { ru: 'Иди парами: 1 и 18, 2 и 9, 3 и 6. Каждая пара даёт два делителя.', uz: "Juftlab yuring: 1 va 18, 2 va 9, 3 va 6. Har juftlik ikkita bo'luvchi beradi." },
    why: {
      ru: [
        '1 · 18 = 18 — первая пара: 1 и 18.',
        '2 · 9 = 18 — вторая пара: 2 и 9.',
        '3 · 6 = 18 — третья пара: 3 и 6.',
        'Дальше пары начнут повторяться. Три пары дают 6 делителей.'
      ],
      uz: [
        "1 · 18 = 18 — birinchi juftlik: 1 va 18.",
        "2 · 9 = 18 — ikkinchi juftlik: 2 va 9.",
        "3 · 6 = 18 — uchinchi juftlik: 3 va 6.",
        "Bundan keyin juftliklar takrorlanadi. Uchta juftlik 6 ta bo'luvchi beradi."
      ]
    },
    fact: { ru: 'Час поделили на 60 минут не случайно: у числа 60 целых 12 делителей, поэтому час удобно делить на 2, 3, 4, 5, 6 и даже 12 частей.', uz: "Soat 60 daqiqaga bejiz bo'linmagan: 60 sonining 12 ta bo'luvchisi bor, shuning uchun soatni 2, 3, 4, 5, 6 va hatto 12 bo'lakka bo'lish qulay." },
    fact_audio: { ru: 'Знаешь ли ты? Час поделили на шестьдесят минут не случайно. У числа шестьдесят целых двенадцать делителей, поэтому час удобно делить на две, три, четыре, пять, шесть и даже двенадцать частей.', uz: "Bilasizmi? Soat oltmish daqiqaga bejiz bo'linmagan. Oltmish sonining o'n ikkita bo'luvchisi bor, shuning uchun soatni ikki, uch, to'rt, besh, olti va hatto o'n ikki bo'lakka bo'lish qulay." },
    audio: {
      intro: { ru: 'Выбери все делители числа восемнадцать. Нажимай на подходящие числа в ряду, потом нажми проверить.', uz: "O'n sakkiz sonining barcha bo'luvchilarini tanlang. Qatordan mos sonlarni bosing, so'ng tekshirishni bosing." },
      on_correct: { ru: 'Верно, шесть делителей.', uz: "To'g'ri, oltita bo'luvchi." },
      on_wrong: { ru: 'Не всё. Посмотри подсказку и продолжай.', uz: "Hammasi emas. Maslahatga qarang va davom eting." }
    }
  },

  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Бесконечно и конечно', uz: 'Cheksiz va sanoqli' },
    cap_mult: { ru: 'Кратные числа 3 — ряд не заканчивается:', uz: "3 ga karrali sonlar — qator tugamaydi:" },
    cap_div: { ru: 'Делители числа 12 — список заканчивается:', uz: "12 ning bo'luvchilari — ro'yxat tugaydi:" },
    badge_inf: { ru: 'бесконечно', uz: 'cheksiz' },
    badge_fin: { ru: 'всего 6', uz: 'jami 6 ta' },
    concl: { ru: 'Кратных у числа бесконечно много, а делителей — конечное число. Самый маленький делитель — 1, самый большой — само число.', uz: "Songa karrali sonlar cheksiz ko'p, bo'luvchilari esa sanoqli. Eng kichik bo'luvchi — 1, eng kattasi — sonning o'zi." },
    audio: {
      ru: [
        'Посмотрим на ряд кратных числа три: три, шесть, девять, двенадцать, пятнадцать, восемнадцать. Этот ряд можно продолжать сколько угодно, он никогда не закончится.',
        'А теперь делители числа двенадцать: один, два, три, четыре, шесть, двенадцать. И всё. Больше делителей нет, список закончился.',
        'Вот важное отличие. Кратных у числа бесконечно много, а делителей конечное число. Самый маленький делитель это единица, самый большой это само число.'
      ],
      uz: [
        "Uchga karrali sonlar qatoriga qaraymiz: uch, olti, to'qqiz, o'n ikki, o'n besh, o'n sakkiz. Bu qatorni xohlagancha davom ettirish mumkin, u hech qachon tugamaydi.",
        "Endi o'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti, o'n ikki. Va tamom. Boshqa bo'luvchi yo'q, ro'yxat tugadi.",
        "Mana muhim farq. Songa karrali sonlar cheksiz ko'p, bo'luvchilari esa sanoqli. Eng kichik bo'luvchi bu bir, eng kattasi bu sonning o'zi."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Собери делители', uz: "Bo'luvchilarni yig'ing" },
    lead: { ru: 'Для каждого числа выбери из списка полный набор его делителей.', uz: "Har bir son uchun ro'yxatdan uning to'liq bo'luvchilar to'plamini tanlang." },
    pairs: [
      { number: '10', label: { ru: 'делители', uz: "bo'luvchilari" }, reading: { ru: '1, 2, 5, 10', uz: '1, 2, 5, 10' } },
      { number: '15', label: { ru: 'делители', uz: "bo'luvchilari" }, reading: { ru: '1, 3, 5, 15', uz: '1, 3, 5, 15' } },
      { number: '16', label: { ru: 'делители', uz: "bo'luvchilari" }, reading: { ru: '1, 2, 4, 8, 16', uz: '1, 2, 4, 8, 16' } }
    ],
    correct_text: { ru: 'Верно. Обрати внимание: у 16 делителей нечётное количество, потому что 16 = 4 · 4.', uz: "To'g'ri. E'tibor bering: 16 da bo'luvchilar soni toq, chunki 16 = 4 · 4." },
    hint: { ru: 'Проверяй по порядку: делится ли число на 1, на 2, на 3, на 4 и так далее.', uz: "Tartib bilan tekshiring: son 1 ga, 2 ga, 3 ga, 4 ga va hokazo bo'linadimi." },
    // hint ekranda raqam bilan turadi, ovozga esa audio_hint ketadi (DragMatch/Classify).
    audio_hint: { ru: 'Проверяй по порядку. Делится ли число на один, на два, на три, на четыре и так далее.', uz: "Tartib bilan tekshiring. Son birga, ikkiga, uchga, to'rtga va hokazo bo'linadimi." },
    why: {
      ru: [
        '10 = 1 · 10 = 2 · 5 — две пары, значит 4 делителя.',
        '15 = 1 · 15 = 3 · 5 — тоже две пары, 4 делителя.',
        '16 = 1 · 16 = 2 · 8 = 4 · 4 — здесь 4 встаёт в пару сам с собой, поэтому делителей 5, а не 6.'
      ],
      uz: [
        "10 = 1 · 10 = 2 · 5 — ikkita juftlik, demak 4 ta bo'luvchi.",
        "15 = 1 · 15 = 3 · 5 — bu ham ikkita juftlik, 4 ta bo'luvchi.",
        "16 = 1 · 16 = 2 · 8 = 4 · 4 — bu yerda 4 o'zi bilan o'zi juft bo'ladi, shuning uchun bo'luvchilar 6 ta emas, 5 ta."
      ]
    },
    audio: {
      intro: { ru: 'Для каждого числа выбери полный набор делителей. Нажми на число, потом выбери набор из списка.', uz: "Har bir son uchun to'liq bo'luvchilar to'plamini tanlang. Songa bosing, so'ng ro'yxatdan to'plamni tanlang." },
      on_correct: { ru: 'Верно, все наборы на местах.', uz: "To'g'ri, barcha to'plamlar o'z o'rniga tushdi." },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Делитель 6 или кратное 6?', uz: "6 ning bo'luvchisimi yoki 6 ga karralimi?" },
    lead: { ru: 'Делитель не больше самого числа, кратное — не меньше.', uz: "Bo'luvchi sondan katta emas, karrali son esa kichik emas." },
    bin_a: { ru: 'Делитель 6', uz: "6 ning bo'luvchisi" },
    bin_b: { ru: 'Кратное 6', uz: "6 ga karrali" },
    cards: [
      { label: '1', bin: 'a' },
      { label: '2', bin: 'a' },
      { label: '3', bin: 'a' },
      { label: '12', bin: 'b' },
      { label: '18', bin: 'b' },
      { label: '24', bin: 'b' }
    ],
    hint: { ru: 'Спроси себя: это 6 делится на данное число, или данное число делится на 6?', uz: "O'zingizdan so'rang: 6 shu songa bo'linadimi, yoki shu son 6 ga bo'linadimi?" },
    audio_hint: { ru: 'Спроси себя. Это шесть делится на данное число, или данное число делится на шесть?', uz: "O'zingizdan so'rang. Olti shu songa bo'linadimi, yoki shu son oltiga bo'linadimi?" },
    correct_text: { ru: 'Точно. Из данных чисел 1, 2 и 3 — делители числа 6, а 12, 18 и 24 — кратные числа 6.', uz: "Aniq. Berilgan sonlardan 1, 2 va 3 — 6 ning bo'luvchilari, 12, 18 va 24 esa 6 ga karrali sonlar." },
    why: {
      ru: [
        'Из данных чисел делители — это те, на которые делится 6: 6 : 1, 6 : 2, 6 : 3.',
        'Кратное — это то, что делится на 6: 12 : 6, 18 : 6, 24 : 6.',
        'Поэтому в этом задании 1, 2, 3 идут к делителям, а 12, 18, 24 — к кратным.'
      ],
      uz: [
        "Berilgan sonlardan bo'luvchilar — 6 qaysilariga bo'linsa, o'shalar: 6 : 1, 6 : 2, 6 : 3.",
        "Karrali son — bu 6 ga nima bo'linsa, o'sha: 12 : 6, 18 : 6, 24 : 6.",
        "Shuning uchun bu topshiriqda 1, 2, 3 bo'luvchilarga, 12, 18, 24 esa karrali sonlarga kiradi."
      ]
    },
    audio: {
      intro: { ru: 'Разбери числа на две группы. Делитель шести или кратное шести?', uz: "Sonlarni ikki guruhga ajrating. Oltining bo'luvchisimi yoki oltiga karralimi?" },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi." },
      on_wrong: { ru: 'Не сюда.', uz: 'Bu yerga emas.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
    label: { ru: 'финальная задача', uz: 'yakuniy masala' },
    context: { ru: 'Ищи парами и нажимай на подходящие числа.', uz: "Juftlab qidiring va mos sonlarni bosing." },
    question: { ru: 'Выбери все делители числа 36', uz: "36 sonining barcha bo'luvchilarini tanlang" },
    numbers: ['1', '2', '3', '4', '5', '6', '8', '9', '12', '18', '24', '36'],
    divisors: ['1', '2', '3', '4', '6', '9', '12', '18', '36'],
    correct_text: { ru: 'Верно: 1, 2, 3, 4, 6, 9, 12, 18, 36 — всего 9. Число нечётное, потому что 36 = 6 · 6.', uz: "To'g'ri: 1, 2, 3, 4, 6, 9, 12, 18, 36 — jami 9 ta. Soni toq, chunki 36 = 6 · 6." },
    hint: { ru: 'Ищи парами: 1 и 36, 2 и 18, 3 и 12, 4 и 9. А 6 идёт в паре сам с собой.', uz: "Juftlab qidiring: 1 va 36, 2 va 18, 3 va 12, 4 va 9. 6 esa o'zi bilan o'zi juft bo'ladi." },
    why: {
      ru: [
        '1 · 36, 2 · 18, 3 · 12, 4 · 9 — четыре пары, это уже 8 делителей.',
        '6 · 6 = 36 — здесь оба множителя одинаковы, поэтому 6 считается один раз.',
        'Всего 9 делителей. У квадратов число делителей всегда нечётное.'
      ],
      uz: [
        "1 · 36, 2 · 18, 3 · 12, 4 · 9 — to'rtta juftlik, bu allaqachon 8 ta bo'luvchi.",
        "6 · 6 = 36 — bu yerda ikkala ko'paytuvchi bir xil, shuning uchun 6 bir marta sanaladi.",
        "Jami 9 ta bo'luvchi. Kvadratlarda bo'luvchilar soni doim toq bo'ladi."
      ]
    },
    fact: { ru: 'Если число — квадрат, один делитель встаёт в пару сам с собой: 6 · 6 = 36. Поэтому у квадратов делителей нечётное количество.', uz: "Agar son kvadrat bo'lsa, bitta bo'luvchi o'zi bilan o'zi juft bo'ladi: 6 · 6 = 36. Shuning uchun kvadratlarda bo'luvchilar soni toq." },
    fact_audio: { ru: 'Знаешь ли ты? Если число квадрат, один делитель встаёт в пару сам с собой, шесть на шесть тридцать шесть. Поэтому у квадратов количество делителей нечётное.', uz: "Bilasizmi? Agar son kvadrat bo'lsa, bitta bo'luvchi o'zi bilan o'zi juft bo'ladi, olti karra olti o'ttiz olti. Shuning uchun kvadratlarda bo'luvchilar soni toq." },
    audio: {
      intro: { ru: 'Финальная задача. Выбери все делители числа тридцать шесть. Ищи парами и нажимай на подходящие числа.', uz: "Yakuniy masala. O'ttiz olti sonining barcha bo'luvchilarini tanlang. Juftlab qidiring va mos sonlarni bosing." },
      on_correct: { ru: 'Верно, девять делителей.', uz: "To'g'ri, to'qqizta bo'luvchi." },
      on_wrong: { ru: 'Не всё. Посмотри подсказку и продолжай.', uz: "Hammasi emas. Maslahatga qarang va davom eting." }
    }
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi" },
    heading: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar" },
    score_label: { ru: 'Ваш результат по заданиям:', uz: "Topshiriqlar bo'yicha natijangiz:" },
    main_label: { ru: 'Главное', uz: 'Asosiysi' },
    main_1: { ru: 'Если a делится на b без остатка, то b — делитель числа a, а a — кратное числа b.', uz: "Agar a soni b ga qoldiqsiz bo'linsa, b — a sonining bo'luvchisi, a esa b sonining karralisi." },
    main_2: { ru: 'Если a делится на b без остатка, то a — кратное числа b, а b — делитель числа a.', uz: "Agar a soni b ga qoldiqsiz bo'linsa, a — b ning karralisi, b esa a ning bo'luvchisi." },
    main_3: { ru: 'У любого числа делители — 1 и оно само. Кратных бесконечно много, делителей — конечное число.', uz: "Har qanday sonning bo'luvchilari — 1 va sonning o'zi. Karrali sonlar cheksiz, bo'luvchilar esa sanoqli." },
    hook_close: { ru: 'Теперь пример 12 : 3 = 4 читается двумя способами — и это одна и та же мысль.', uz: "Endi 12 : 3 = 4 misolini ikki xil o'qish mumkin — bu bitta fikrning o'zi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Nimaga tayanadi' },
    conn_refs: { ru: 'деление с остатком и таблицу умножения', uz: "qoldiqli bo'lish va ko'paytirish jadvali" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'признаки делимости на 2, 5 и 10', uz: "2, 5 va 10 ga bo'linish alomatlari" },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'Если a делится на b без остатка, то b это делитель числа a, а a это кратное числа b. Оба названия даёт одно и то же деление.',
        'У любого числа делители это единица и оно само. Кратных бесконечно много, а делителей конечное число. Дальше разберём признаки делимости на два, пять и десять.'
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Agar a soni b ga qoldiqsiz bo'linsa, b bu a sonining bo'luvchisi, a esa b sonining karralisi. Ikkala nomni bitta bo'lishning o'zi beradi.",
        "Har qanday sonning bo'luvchilari bu bir va sonning o'zi. Karrali sonlar cheksiz ko'p, bo'luvchilar esa sanoqli. Keyin ikki, besh va o'nga bo'linish alomatlarini ko'rib chiqamiz."
      ]
    }
  }
};
// ============================================================
// SHUFFLE / FORMAT / ANIM HELPERS (div_6_01)
// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  // audio_hint_N ham ko'chiriladi — aks holda aralashtirishdan keyin TTS-toza
  // matn indeksidan uzilib qolardi va ovozga formulali variant ketardi.
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const shuffleArr = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

// ============================================================
// BIRLIK + MASSIV — darsning vizual modeli (syujetsiz, sof matematik).
// Teng bo'lish = bankalarni teng qatorlarga terish; qoldiq = qatorga
// tushmay qolgan bankalar (aksent rangda, alohida turadi).
// ============================================================
// Non — sanoq birligi. Realistik chizilgan o'zbek noni: qirrali chekka,
// chekich bosilgan o'rta, kunjut. `rest` — qoldiqda qolgan non (aksent halqa).
// Gradient ID ishlatilmaydi: har non alohida SVG, ID'lar to'qnashmasin.
const Unit = ({ s = 30, tone = 'ok' }) => {
  const rest = tone === 'rest';
  const crust = rest ? '#B9673E' : '#C57F38';
  const rim = rest ? '#E2A278' : '#E9A85C';
  const rimHi = rest ? '#F0BE9C' : '#F6C784';
  const core = rest ? '#B57450' : '#C07C34';
  const dots = rest ? '#8F4E2E' : '#9A5E22';
  const ring = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    ring.push(<circle key={i} cx={20 + Math.cos(a) * 6.4} cy={20 + Math.sin(a) * 6.4} r="1.15" fill={dots} opacity="0.75"/>);
  }
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <ellipse cx="20" cy="21.6" rx="18.2" ry="17.4" fill="rgba(90,62,34,0.16)"/>
      <circle cx="20" cy="20" r="18.4" fill={crust}/>
      <circle cx="20" cy="19.3" r="17.3" fill={rim}/>
      <path d="M6.4 14.2A15.6 15.6 0 0 1 18.6 4.6" stroke={rimHi} strokeWidth="3.1" strokeLinecap="round" fill="none" opacity="0.75"/>
      <circle cx="20" cy="20" r="11.4" fill={crust} opacity="0.55"/>
      <circle cx="20" cy="19.6" r="10.7" fill={core}/>
      {ring}
      <circle cx="20" cy="19.6" r="1.7" fill={dots} opacity="0.85"/>
      <ellipse cx="12.6" cy="10.8" rx="1.25" ry="0.85" fill="#FFF3DD" opacity="0.9"/>
      <ellipse cx="27.8" cy="12.4" rx="1.25" ry="0.85" fill="#FFF3DD" opacity="0.9"/>
      <ellipse cx="9.6" cy="25.4" rx="1.25" ry="0.85" fill="#FFF3DD" opacity="0.9"/>
      <ellipse cx="30.4" cy="26.8" rx="1.25" ry="0.85" fill="#FFF3DD" opacity="0.9"/>
      <ellipse cx="20" cy="32.6" rx="1.25" ry="0.85" fill="#FFF3DD" opacity="0.9"/>
      {rest && <circle cx="20" cy="20" r="18.4" fill="none" stroke="#FF4F28" strokeWidth="2.8"/>}
    </svg>
  );
};

// Massiv modeli: `total` birlik `rows` ta teng qatorga tiziladi. Bo'linmasa —
// qatorga tushmagan birliklar pastda, aksent rangda va "qoldiq" yozuvi bilan.
// Birliklar ketma-ket paydo bo'ladi (pop-in animatsiya).
// `orient='cols'` — massivni 90 gradusga burish: qatorlar USTUN bo'lib yonma-yon
// turadi. Keng ekranda joyni yaxshiroq egallaydi va nonni kattaroq chizish mumkin.
const UnitArray = ({ total, rows, size, restLabel, orient = 'rows' }) => {
  const per = Math.floor(total / rows);
  const rem = total - per * rows;
  const s = size || (rows >= 12 ? 14 : (rows >= 8 ? 18 : (rows >= 6 ? 22 : (rows >= 4 ? 26 : 32))));
  const gapMain = rows >= 8 ? 2 : 'clamp(4px, 1vw, 7px)';
  const gapCross = 'clamp(3px, 0.9vw, 6px)';
  let idx = 0;
  const pop = (d) => ({ display: 'inline-flex', animation: 'rg-dot-in 0.5s ease-out both', animationDelay: `${d * 0.07}s` });
  const cols = orient === 'cols';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.7vw, 13px)' }}>
      <div style={{ display: 'flex', flexDirection: cols ? 'row' : 'column', gap: gapMain, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: 'flex', flexDirection: cols ? 'column' : 'row', gap: gapCross, alignItems: 'center', justifyContent: 'center' }}>
            {Array.from({ length: per }).map((_, i) => (<span key={i} style={pop(idx++)}><Unit s={s}/></span>))}
          </div>
        ))}
      </div>
      {/* Qoldiq DOIM pastda, alohida qatorda — teng qismlarga tushmagani
          shundan ko'rinadi (yon tomonda tursa yana bitta qism kabi o'qiladi). */}
      {rem > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: gapCross }}>
          {Array.from({ length: rem }).map((_, i) => (<span key={i} style={pop(idx + i)}><Unit s={s} tone="rest"/></span>))}
          {restLabel && <span className="mono small" style={{ color: T.accent, marginLeft: 6 }}>{restLabel}</span>}
        </div>
      )}
    </div>
  );
};

// Tizilmagan birliklar to'dasi (savol shartida, javobdan oldin).
const UnitPile = ({ n, size = 20, maxW = 320 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(3px, 0.9vw, 6px)', maxWidth: maxW, margin: '0 auto' }}>
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} style={{ display: 'inline-flex', animation: 'rg-dot-in 0.5s ease-out both', animationDelay: `${i * 0.06}s` }}><Unit s={size}/></span>
    ))}
  </div>
);

// Bo'luvchilar chiplari. `active`/`activeSet` — yonadigan chiplar (juftlab ko'rsatish
// uchun), `ring` — AYLANAGA olinadigan bitta son: kashfiyotda "mana shu son shu
// yerda turibdi" degan ishora. `big` — kashfiyot ekrani uchun kattalashtirilgan o'lcham.
const DivisorChips = ({ list, active = -1, activeSet = null, settled = -1, ring = -1, big = false, syncActive = false, tone = 'accent' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: big ? 'clamp(7px, 1.7vw, 12px)' : 'clamp(6px, 1.4vw, 10px)' }}>
    {list.map((d, i) => {
      const on = active === i || (activeSet ? activeSet.indexOf(i) >= 0 : false);
      const isSettled = settled === i;
      const isRing = ring === i;
      const cls = 'dv-chip' + (big ? ' dv-big' : '') + (isRing ? ' dv-ring' : '');
      const toneColor = tone === 'success' ? T.success : T.accent;
      const toneSoft = tone === 'success' ? T.successSoft : T.accentSoft;
      const paint = isRing ? {} : {
        background: on ? (syncActive ? toneColor : toneSoft) : (isSettled ? toneSoft : '#FFFFFF'),
        color: on ? (syncActive ? '#FFFFFF' : toneColor) : (isSettled ? toneColor : T.ink),
        borderColor: on || isSettled ? toneColor : 'rgba(167, 166, 162, 0.35)',
        boxShadow: on && syncActive
          ? `0 0 0 3px ${tone === 'success' ? 'rgba(31,122,77,0.18)' : 'rgba(255,79,40,0.18)'}, 0 8px 20px -6px ${tone === 'success' ? 'rgba(31,122,77,0.7)' : 'rgba(255,79,40,0.7)'}`
          : (isSettled ? `0 0 0 2px ${tone === 'success' ? 'rgba(31,122,77,0.12)' : 'rgba(255,79,40,0.12)'}` : 'none'),
        transform: on && syncActive ? 'scale(1.12)' : 'scale(1)',
        transition: syncActive ? 'all 0.14s ease' : undefined,
      };
      return <span key={i} className={cls} style={{ animationDelay: `${i * 0.12}s`, ...paint }}>{d}</span>;
    })}
  </div>
);

// Karralar yo'lakchasi: base, 2*base, 3*base ... `active` tagacha yonadi,
// `ring` — aylanaga olinadigan bitta son. `tail` — oxiridagi "…" (cheksizlik belgisi).
const MultiplesTrack = ({ base, count, active = -1, activeOnly = false, settled = -1, ring = -1, big = false, tail = true }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: big ? 'clamp(7px, 1.6vw, 11px)' : 'clamp(5px, 1.2vw, 9px)' }}>
    {Array.from({ length: count }).map((_, i) => {
      const on = activeOnly ? i === active : i <= active;
      const isSettled = settled === i;
      const isRing = ring === i;
      const cls = 'mt-num' + (big ? ' mt-big' : '') + (isRing ? ' mt-ring' : '');
      const paint = isRing ? {} : {
        background: on ? (activeOnly ? T.accent : T.accentSoft) : (isSettled ? T.accentSoft : 'transparent'),
        color: on ? (activeOnly ? '#FFFFFF' : T.accent) : (isSettled ? T.accent : T.ink3),
        boxShadow: on && activeOnly
          ? '0 0 0 3px rgba(255,79,40,0.18), 0 8px 20px -6px rgba(255,79,40,0.7)'
          : (isSettled ? '0 0 0 2px rgba(255,79,40,0.12)' : 'none'),
        transform: on && activeOnly ? 'scale(1.12)' : 'scale(1)',
        transition: activeOnly ? 'all 0.14s ease' : undefined,
      };
      return (
        <React.Fragment key={i}>
          {i > 0 && <span className="mono small" style={{ color: T.ink3 }}>·</span>}
          <span className={cls} style={{ animationDelay: `${i * 0.14}s`, ...paint }}>{base * (i + 1)}</span>
        </React.Fragment>
      );
    })}
    {tail && <span className="mono mt-dots">…</span>}
  </div>
);

// Katta bo'lish misoli: 12 : 3 = 4. Qismlari alohida yonadi va pastdagi
// qator/chiplar bilan BIR XIL rangda bo'ladi — bog'lanish ko'z bilan ko'rinadi.
// hiA — bo'linuvchi (katta son, aksent), hiB — bo'luvchi (kichik son, yashil).
const EquationLine = ({ a, b, r, hiA = false, hiB = false, sm = false, labelA, labelB }) => (
  <div className={'eq-line' + (sm ? ' eq-sm' : '')} style={{ marginTop: labelA || labelB ? '0.7em' : undefined }}>
    <span className={'eq-part' + (hiA ? ' eq-hi-a' : '')} style={{ position: 'relative' }}>
      {labelA && <span className="eq-var" style={{ color: T.accent }}>{labelA}</span>}
      {a}
    </span>
    <span className="eq-op">:</span>
    <span className={'eq-part' + (hiB ? ' eq-hi-b' : '')} style={{ position: 'relative' }}>
      {labelB && <span className="eq-var" style={{ color: T.success }}>{labelB}</span>}
      {b}
    </span>
    <span className="eq-op">=</span>
    <span className="eq-part eq-res">{r}</span>
  </div>
);

// Sarlavha ekrani foni: sekin suzib yuruvchi xira sonlar (3 ga karrali sonlar).
const NumberDrift = () => (
  <div className="nd" aria-hidden="true">
    {[3, 6, 9, 12, 15, 18, 21, 24].map((n, i) => (
      <span key={n} className={`nd-n nd-n${i + 1}`}>{n}</span>
    ))}
  </div>
);

// ============================================================
// FACTCARD — ovozli fakt to'g'ri javobdan keyin (ko'k tema + darsga xos Anim*).
// ============================================================
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

// Qadam indikatori — bola "yana davomi bor" ekanini ko'rib turadi va kutadi.
const StepDots = ({ total, active }) => (
  <div className="rv-dots" aria-hidden="true">
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} className={'rv-dot' + (i === active ? ' rv-dot-on' : (i < active ? ' rv-dot-done' : ''))}/>
    ))}
  </div>
);

// Ovozsiz (yoki TTS ulanmagan) holat uchun qadam davomiyligi: ~2.3 so'z/sekund
// + qisqa pauza. Chegaralar — juda tez o'tib ketmasin va cheksiz turib qolmasin.
const stepMs = (txt) => {
  const w = String(txt || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2800, Math.min(Math.round((w / 2.3) * 1000) + 1200, 15000));
};

// Bosqichli kashfiyot (6-sinf etaloni). MAVZU TUSHUNTIRILADIGAN EKRANDA BOLA
// HECH NARSA BOSMAYDI: qadamlar o'zi ketma-ket ochiladi va har biri ovoz bilan
// aytiladi. Avvalgi qadamlar ekranda QOLADI — oxirida hammasi birga ko'rinadi.
// Vaqtni ovozning o'zi belgilaydi: segment tugagach qisqa pauza va keyingi blok.
// Ovoz o'chirilgan yoki TTS javob bermasa — matn uzunligidan hisoblangan vaqt
// bo'yicha (stepMs), shunda dars hech qachon osilib qolmaydi.
// "Davom etish" oxirgi qadamgacha o'chiq: tushuntirish tashlab ketilmaydi.
// renderStep({ t, lang, step, last, refs }) — refs[1..3] yangi ochilgan blokka
// qo'yiladi, avtoskroll shu orqali ishlaydi (MOBIL_DESKTOP_MOSLASH.md, EDIT 8).
const RevealScreen = ({ screen, screenContent, onNext, onPrev, totalScreens, renderStep, factOnLast, audioPlan }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const last = lines.length - 1;
  const plan = audioPlan ? audioPlan[lang] : null;
  const firstSegments = plan?.[0]?.length
    ? plan[0].map((seg, i) => ({ ...seg, id: seg.id || `s${screen}_step0_${i}`, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null }))
    : [{ id: `s${screen}_a0`, text: lines[0], trigger: 'on_mount', waits_for: null }];
  const audio = useAudio(firstSegments);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const factVoicedRef = useRef(false);
  const voicedRef = useRef(false); // shu qadamda ovoz boshlanganmi
  const r1 = useRevealScroll(step >= 1, 420);
  const r2 = useRevealScroll(step >= 2, 420);
  const r3 = useRevealScroll(step >= 3, 420);
  const refs = [null, r1, r2, r3];
  const speakStep = (stepIndex) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (!engine) return;
    const segments = plan?.[stepIndex]?.length
      ? plan[stepIndex]
      : [{ id: `s${screen}_step${stepIndex}`, text: lines[stepIndex] }];
    segments.forEach((seg, i) => {
      engine.pushOneOff(seg.text, undefined, seg.id || `s${screen}_step${stepIndex}_${i}`, seg.pauseAfterMs || 0);
    });
  };
  // Joriy qadam REF'dan olinadi: setStep asinxron, taymer esa eski `step` ni ko'rishi mumkin.
  const advance = () => {
    const cur = stepRef.current;
    if (cur >= last) return;
    const ns = cur + 1;
    stepRef.current = ns;
    voicedRef.current = false;
    setStep(ns);
    speakStep(ns);
    if (ns === last && factOnLast && c.fact_audio && !factVoicedRef.current) {
      factVoicedRef.current = true;
      const engine = getAudioEngine();
      if (engine && !audio.muted) engine.pushOneOff(c.fact_audio[lang], undefined, `s${screen}_fact`);
    }
  };
  // Avtomatik o'tish. Ovoz ketayotgan bo'lsa — kutamiz; tugagach 700 ms pauza.
  // Ovoz umuman boshlanmasa (mute / TTS yo'q) — stepMs bo'yicha o'tamiz.
  useEffect(() => {
    if (step >= last) return undefined;
    if (audio.isBusy) { voicedRef.current = true; return undefined; }
    const tid = setTimeout(advance, voicedRef.current ? 700 : stepMs(lines[step]));
    return () => clearTimeout(tid);
    /* eslint-disable-next-line */
  }, [step, last, audio.isBusy, audio.muted]);
  // Bitta qadamli kashfiyotda ham faktni oxirida ovozlash.
  useEffect(() => { if (last === 0 && factOnLast && c.fact_audio && !factVoicedRef.current) { factVoicedRef.current = true; if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.fact_audio[lang]); } } /* eslint-disable-next-line */ }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><StepDots total={last + 1} active={step}/><NavNext disabled={step < last || !audio.canAdvance} label={<NextLabel/>} onClick={onNext}/></>);
  return (<Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>{renderStep({ t, lang, step, last, refs, activeAudioId: audio.currentSegment, lastCompletedAudioId: audio.lastCompletedSegment })}</Stage>);
};

// Sarlavha ekrani (s0) — dars katta va yorqin mavzu nomi bilan boshlanadi.
// Syujet yo'q. Lekin ekran passiv qolmasin: pastda darsning misoli ikkita
// javobsiz "?" bilan turadi (qiziqish uyg'otadi, javobni ochmaydi) va bola
// tanlov tugmasini bosib darsni o'zi boshlaydi.
const TitleScreen = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([
    { id: 's0_topic', text: c.audio[lang][0], trigger: 'on_mount', waits_for: null },
    { id: 's0_example', text: c.audio[lang][1], trigger: 'after_previous', waits_for: { type: 'option_picked' } },
  ]);
  const [picked, setPicked] = useState(null);
  const introDone = audio.muted || (audio.hasStarted && !audio.isBusy);
  const formulaVisible = audio.muted ||
    audio.currentSegment === 's0_example' ||
    audio.lastCompletedSegment === 's0_topic' ||
    audio.lastCompletedSegment === 's0_example';
  const introStages = useIntroStages({ start: formulaVisible, optionsReady: introDone });
  const pickedRef = useRef(false);
  const pick = (value) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(value);
    onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: value, correct: true });
    audio.triggerEvent('option_picked');
    setTimeout(onNext, 280);
  };
  const options = [{ id: 'go', label: c.opt_go }, { id: 'new', label: c.opt_new }];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div className={`ttl-wrap${introStages.compact ? ' ttl-example-focus' : ''}`}>
        <Floaters/>
        <NumberDrift/>
        <p className="eyebrow ttl-kicker">{t(c.kicker)}</p>
        <h1 className="display ttl-h1">{t(c.title)}</h1>
        <span className="ttl-rule" aria-hidden="true"/>
        <p className="body ttl-sub">{t(c.subtitle)}</p>
        {introStages.showExample && (
          <>
          <div className="ttl-hero ttl-stage-reveal">
            <EquationLine a="12" b="3" r="?" sm/>
            {introDone && (
              <div className="ttl-tease">
                <span className="ttl-q">{t(c.tease_a)}</span>
                <span className="ttl-q">{t(c.tease_b)}</span>
              </div>
            )}
          </div>
            <div className="ttl-prompt-slot">
              <p className={`small ttl-prompt${introStages.showPrompt ? ' is-visible' : ''}`}>
                {lang === 'uz' ? "12 va 3 orasidagi bog'lanishni qanday nomlaymiz?" : 'Как назвать связь между 12 и 3?'}
              </p>
            </div>
            <div className={`ttl-opts${introStages.showOptions ? ' is-visible' : ''}`}>
              {options.map(option => (
                <button key={option.id} className="option ttl-opt" disabled={picked !== null} onClick={() => pick(option.id)}>
                  {option.id === 'go'
                    ? (lang === 'uz' ? "3 — bo'luvchi deb o'ylayman" : 'Думаю, 3 — делитель')
                    : (lang === 'uz' ? "12 — karrali deb o'ylayman" : 'Думаю, 12 — кратное')}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// Savolli slaydlardagi yakuniy ketma-ketlik:
// "To'g'ri" -> "Nega shunday" -> qatorlar bittadan -> "Bilasizmi?".
// Har bir vizual blok aynan o'z audio segmenti BOSHLANGANDA ochiladi.
const WHY_TITLE = { ru: 'Почему так', uz: 'Nega shunday' };
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
    if (audio.muted) {
      setSkipAudio(true);
      return;
    }
    const engine = getAudioEngine();
    if (!engine) {
      setSkipAudio(true);
      return;
    }
    // Har bir yangi tekshiruv natijasi avvalgi xato izohi yoki uning navbatini
    // almashtiradi. Shunda xatodan keyingi to'g'ri javob eski ovozni kutmaydi.
    engine.interruptFeedbackQueue();
    engine.pushOneOff(toTtsMath(correctText, lang), undefined, `${prefix}_correct`);
    if (whyItems.length > 0) {
      engine.pushOneOff(t(WHY_TITLE), undefined, `${prefix}_why_title`);
      whyItems.forEach((line, i) => {
        engine.pushOneOff(toTtsMath(line, lang), undefined, `${prefix}_why_${i}`);
      });
    }
    if (factAudio) engine.pushOneOff(toTtsMath(factAudio, lang), undefined, `${prefix}_fact`);
  }, [audio.muted, correctText, factAudio, lang, prefix, t, whyItems]);

  const activeId = audio.currentSegment?.startsWith(prefix)
    ? audio.currentSegment
    : (audio.lastCompletedSegment?.startsWith(prefix) ? audio.lastCompletedSegment : '');
  const whyMatch = activeId.match(new RegExp(`^${prefix}_why_(\\d+)$`));
  const showAll = restored || skipAudio;
  const showWhy = whyItems.length > 0 && (
    showAll ||
    activeId === `${prefix}_why_title` ||
    !!whyMatch ||
    activeId === `${prefix}_fact`
  );
  const visibleWhyLines = showAll || activeId === `${prefix}_fact`
    ? whyItems.length
    : (whyMatch ? Math.min(whyItems.length, Number(whyMatch[1]) + 1) : 0);
  const showFact = !!factAudio && (showAll || activeId === `${prefix}_fact`);

  return { showWhy, visibleWhyLines, showFact, start };
};

const WhyCard = ({ lines, figure, visibleCount }) => {
  const t = useT();
  const lang = useLang();
  const items = lines[lang];
  const n = visibleCount === undefined ? items.length : visibleCount;
  return (
    <div className="why">
      <p className="why-h"><span className="why-dot" aria-hidden="true"/>{t(WHY_TITLE)}</p>
      {figure && <div className="why-fig">{figure}</div>}
      <div className="why-list">
        {items.slice(0, n).map((ln, i) => (
          <div key={i} className="why-row">
            <span className="why-num">{i + 1}</span>
            <p className="why-tx">{mt(ln)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// s9 / s13 — qatordan bo'luvchilarni TANLASH (klaviaturadan terish o'rniga).
// Веди-до-верного: xato tanlangan son so'nadi va o'chadi, to'g'rilari yashil
// bo'lib qoladi; bola qolganlarini qidirishda davom etadi.
const PickDivisors = ({ screen, screenContent, totalScreens, onNext, onPrev, storedAnswer, onAnswer, whyNode, factNode, retryMode = false }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [sel, setSel] = useState([]);
  const [locked, setLocked] = useState([]);
  const [dead, setDead] = useState([]);
  const [reviewWrong, setReviewWrong] = useState([]);
  const [reviewActive, setReviewActive] = useState(false);
  const [solved, setSolved] = useState(!!storedAnswer);
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(true);
  const introAdvancedRef = useRef(!!storedAnswer);
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode,
    factAudio: c.fact_audio?.[lang],
    initiallyComplete: !!storedAnswer,
  });
  const fbRef = useRevealScroll(solved, 320);
  const whyRef = useRevealScroll(post.showWhy, 300);
  const factRef = useRevealScroll(post.showFact, 300);
  const nums = c.numbers;
  const divs = c.divisors;
  const isDone = (arr) => divs.every(d => arr.indexOf(d) >= 0);
  const toggle = (nStr) => {
    if (solved || reviewActive || dead.indexOf(nStr) >= 0 || locked.indexOf(nStr) >= 0) return;
    if (showHint && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    if (!introAdvancedRef.current) {
      introAdvancedRef.current = true;
      audio.triggerEvent('option_picked');
    }
    setSel(s => (s.indexOf(nStr) >= 0 ? s.filter(x => x !== nStr) : s.concat([nStr])));
  };
  const finish = (nextLocked) => {
    setSolved(true);
    setReviewActive(false);
    setReviewWrong([]);
    post.start();
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? 'practice', screenIdx: screen, question: c.question[lang], options: nums, correctIndex: null, correctAnswer: divs.join(', '), studentAnswerIndex: null, studentAnswer: nextLocked.join(', '), correct: true, firstTry: firstTryRef.current });
  };
  const check = () => {
    if (solved || !sel.length) return;
    const good = sel.filter(x => divs.indexOf(x) >= 0);
    const bad = sel.filter(x => divs.indexOf(x) < 0);
    const nextLocked = [...new Set(locked.concat(good))];
    if (bad.length) firstTryRef.current = false;
    setLocked(nextLocked);
    setSel([]);
    if (isDone(nextLocked) && !bad.length) {
      finish(nextLocked);
      return;
    }
    firstTryRef.current = false;
    if (retryMode) {
      setReviewWrong(bad);
      setReviewActive(true);
    } else {
      setDead(d => d.concat(bad));
    }
    setShowHint(true);
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) {
        engine.interruptFeedbackQueue();
        engine.pushOneOff(toTtsMath(c.audio.on_wrong[lang], lang));
      }
    }
  };
  const retry = () => {
    // Aralash javobda to'g'ri variantlar ham vaqtincha yashil ko'rsatiladi,
    // ammo yangi urinish tayyor javobdan boshlanmasligi kerak. Aks holda barcha
    // bo'luvchilar oldindan locked bo'lib, tugma hech narsa tanlamasdan yechardi.
    setSel([]);
    setLocked([]);
    setDead([]);
    setReviewWrong([]);
    setReviewActive(false);
    setShowHint(false);
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || !audio.canAdvance} label={<NextLabel/>} onClick={onNext}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(11px, 2vw, 16px)' }}>
        <div className="fade-up">
          <p className="small mono" style={{ margin: 0, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.label)}</p>
          <h2 className="title h-sub" style={{ marginTop: 6 }}>{mt(t(c.question))}</h2>
          <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{mt(t(c.context))}</p>
        </div>
        {/* Sonlar qatori javobdan keyin yig'ilib yo'qoladi. Javob yo'qolmaydi:
            to'liq ro'yxat FeedbackBlock matnida va WhyCard chiplarida qoladi. */}
        <div className={'ans-block' + (solved ? ' ans-gone' : '')}>
          <div className="pd-grid fade-up delay-1">
            {nums.map(nStr => {
              const isDead = retryMode ? reviewWrong.indexOf(nStr) >= 0 : dead.indexOf(nStr) >= 0;
              const isLocked = locked.indexOf(nStr) >= 0;
              const isSel = sel.indexOf(nStr) >= 0;
              return (
                <button key={nStr} type="button" disabled={solved || reviewActive || isDead || isLocked} onClick={() => toggle(nStr)}
                  className={'pd-num' + (isLocked ? ' pd-ok' : (isDead ? (retryMode ? ' pd-review-no' : ' pd-no') : (isSel ? ' pd-sel' : '')))}>{mt(nStr)}</button>
              );
            })}
          </div>
          <div className="fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="small mono" style={{ color: T.ink3 }}>{locked.length} / {divs.length}</span>
            {retryMode && reviewActive ? (
              <button className="btn" onClick={retry} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Qayta urinish' : 'Попробовать снова'}</button>
            ) : (
              <button className="btn-white-accent" disabled={!sel.length || solved} onClick={check} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
            )}
          </div>
        </div>
        {solved && (
          <div ref={fbRef}>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            </FeedbackBlock>
          </div>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
        {!solved && <HintBlock show={showHint}>{mt(t(c.hint))}</HintBlock>}
      </div>
    </Stage>
  );
};

// s2 — o'quvchi bitta misolning IKKALA nomini o'zi qo'yadi (s1 dagi shakl, boshqa sonlar).
// Veди-до-верного: xato variant so'nadi va o'chadi, o'sha qator yana faol qoladi.
const PairNaming = ({ screen, screenContent, totalScreens, onNext, onPrev, storedAnswer, onAnswer, whyNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: null }]);
  const [picks, setPicks] = useState([null, null]);
  const [dead, setDead] = useState([[], []]);
  const [solved, setSolved] = useState(!!storedAnswer);
  const firstTryRef = useRef(true);
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode,
    initiallyComplete: !!storedAnswer,
  });
  const fbRef = useRevealScroll(solved, 320);
  const whyRef = useRevealScroll(post.showWhy, 300);
  const rows = [c.row_a, c.row_b];
  const opts = [c.opt_mult, c.opt_div];
  const correct = [0, 1]; // 0-qator: karra, 1-qator: bo'luvchi
  const ready = picks[0] !== null && picks[1] !== null;
  const pick = (row, i) => {
    if (solved || dead[row].indexOf(i) >= 0) return;
    if ((dead[0].length > 0 || dead[1].length > 0) && !audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    setPicks(p => { const n = [...p]; n[row] = i; return n; });
  };
  const check = () => {
    const okRows = [picks[0] === correct[0], picks[1] === correct[1]];
    if (okRows[0] && okRows[1]) {
      setSolved(true);
      post.start();
      onAnswer({ stage: 'practice', screenIdx: screen, question: c.question[lang], options: [t(opts[0]), t(opts[1])], correctIndex: null, correctAnswer: `${c.num_a} — ${t(opts[0])}; ${c.num_b} — ${t(opts[1])}`, studentAnswerIndex: null, studentAnswer: `${c.num_a} — ${t(opts[picks[0]])}; ${c.num_b} — ${t(opts[picks[1]])}`, correct: true, firstTry: firstTryRef.current });
      return;
    }
    firstTryRef.current = false;
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) {
        engine.interruptFeedbackQueue();
        engine.pushOneOff(toTtsMath(c.audio.on_wrong[lang], lang));
      }
    }
    setDead(d => okRows.map((ok, r) => (ok ? d[r] : d[r].concat([picks[r]]))));
    setPicks(p => okRows.map((ok, r) => (ok ? p[r] : null)));
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || !audio.canAdvance} label={<NextLabel/>} onClick={onNext}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.question)}</h2>
        {/* To'g'ri javobdan keyin misolning O'ZI bo'yaladi — javob shu yerda
            ko'rinadi, shuning uchun pastdagi variantlar endi kerak emas. */}
        <div className="frame fade-up delay-1" style={{ textAlign: 'center', padding: 'clamp(13px, 2.4vw, 20px)' }}>
          <EquationLine a={c.num_a} b={c.num_b} r={c.num_r} hiA={solved} hiB={solved}/>
        </div>
        {/* Variantlar bloki javobdan keyin yuqoriga yig'ilib yo'qoladi —
            "To'g'ri" va "Nega shunday" tepaga chiqadi, skroll kerak bo'lmaydi. */}
        <div className={'ans-block' + (solved ? ' ans-gone' : '')}>
          {rows.map((row, r) => (
            <div key={r} className={'pn-row fade-up delay-' + (r + 2)}>
              <p className="body pn-lead"><span className="pn-num">{r + 1}</span>{t(row)}</p>
              {/* Variantlar o'z rangida: "karralisi" — aksent, "bo'luvchisi" — yashil.
                  Bu javobni OCHMAYDI (ikkala variant ikkala qatorda ham bor), lekin
                  s1 da o'rgatilgan ranglar tilini mustahkamlaydi. */}
              <div className="pn-opts">
                {opts.map((o, i) => {
                  const isDead = dead[r].indexOf(i) >= 0;
                  const isPicked = picks[r] === i;
                  const isOk = solved && i === correct[r];
                  return (
                    <button key={i} className={'option pn-opt' + (isOk ? ' pn-right' : (isDead ? ' option-wrong' : (isPicked ? ' pn-sel' : '')))}
                      disabled={solved || isDead} onClick={() => pick(r, i)}>{t(o)}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="fade-up delay-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" disabled={!ready || solved} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
          </div>
        </div>
        {solved && (
          <div ref={fbRef}>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            </FeedbackBlock>
          </div>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {!solved && <HintBlock show={dead[0].length + dead[1].length > 0}>{mt(t(c.hint))}</HintBlock>}
      </div>
    </Stage>
  );
};

// Qoida ekrani (s3, s6): ikki qoida qatori (pale-yellow) + misol.
const RuleScreen = ({ screen, screenContent, onNext, onPrev, totalScreens, exampleNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_a`, text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 20px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip rule-text-frame fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_1)}</p></div>
        <div className="frame-tip rule-text-frame fade-up delay-2" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.rule_2)}</p></div>
        <div className="frame fade-up delay-3" style={{ position: 'relative', textAlign: 'center' }}>
          {exampleNode || <p className="body" style={{ margin: 0, color: T.ink }}>{t(c.example)}</p>}
        </div>
      </div>
    </Stage>
  );
};

// Xato o'qishni top (s7) — keep-visible: to'g'ri (xato) variant qoladi, qolganlari yig'iladi.
const OddOneOut = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const correctIdx = c.errorIdx;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const wasSolved = storedAnswer?.solved === true || storedAnswer?.correct === true;
  const [solved, setSolved] = useState(wasSolved);
  const [picked, setPicked] = useState(wasSolved ? correctIdx : null);
  const [wrong, setWrong] = useState(() => new Set());
  const firstTryRef = useRef(storedAnswer ? (storedAnswer.firstTry ?? storedAnswer.correct ?? null) : null);
  const advancedRef = useRef(wasSolved);
  const wrongFeedbackTimerRef = useRef(null);
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode: factNode,
    initiallyComplete: wasSolved,
  });
  const factRef = useRevealScroll(post.showWhy, 300);

  useEffect(() => () => {
    if (wrongFeedbackTimerRef.current) clearTimeout(wrongFeedbackTimerRef.current);
  }, []);

  const pick = (i) => {
    if (solved || wrong.has(i)) return;
    const isC = i === correctIdx;
    if (wrongFeedbackTimerRef.current) {
      clearTimeout(wrongFeedbackTimerRef.current);
      wrongFeedbackTimerRef.current = null;
    }
    if (firstTryRef.current === null) firstTryRef.current = isC;
    setPicked(i);
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    if (isC) {
      setSolved(true);
      post.start();
      onAnswer({ stage: SCREEN_META[screen]?.scope ?? 'practice', screenIdx: screen, question: c.question[lang], options: c.items.map(it => it.num), correctIndex: correctIdx, correctAnswer: c.items[correctIdx].num, studentAnswerIndex: i, studentAnswer: c.items[i].num, correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
    } else {
      setWrong(prev => { const n = new Set(prev); n.add(i); return n; });
    }
    if (!isC && !audio.muted) {
      const speakFeedback = () => {
        const e = getAudioEngine(); if (!e || audio.muted) return;
        // Ovozga TTS-toza audio_hint_N ketadi; wrong_N (formulali) — faqat fallback.
        const wv = (c[`audio_hint_${i}`] && c[`audio_hint_${i}`][lang]) || (c[`wrong_${i}`] && c[`wrong_${i}`][lang]) || c.audio.on_wrong[lang];
        e.pushOneOff(toTtsMath(wv, lang));
      };
      wrongFeedbackTimerRef.current = setTimeout(() => {
        wrongFeedbackTimerRef.current = null;
        speakFeedback();
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || !audio.canAdvance} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="g6-match-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.question)}</h2>
          <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{mt(t(c.lead))}</p>
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {c.items.map((it, i) => {
            const isCorrect = i === correctIdx;
            const isWrongPicked = wrong.has(i);
            const collapse = solved;   // javobdan keyin hamma variant yig'iladi
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
        {solved && post.showWhy && factNode && (
          <div ref={factRef}>{React.cloneElement(factNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
      </div>
    </Stage>
  );
};

// Tasniflash (s12) — son bittalab chiqadi, bola savatni bosadi; веди-до-верного; joylanganlar yashil chip.
const Classify = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, whyNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
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
  const wrongFeedbackTimerRef = useRef(null);
  const solved = pos >= total;
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode,
    initiallyComplete: wasSolved,
  });
  const whyRef = useRevealScroll(post.showWhy, 300);
  const cardIdx = solved ? -1 : deck[pos];

  useEffect(() => () => {
    if (wrongFeedbackTimerRef.current) clearTimeout(wrongFeedbackTimerRef.current);
  }, []);

  const tap = (bin) => {
    if (solved) return;
    const isC = bin === cards[cardIdx].bin;
    if (wrongFeedbackTimerRef.current) {
      clearTimeout(wrongFeedbackTimerRef.current);
      wrongFeedbackTimerRef.current = null;
    }
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
    if (isC) {
      setWrongBin(null);
      const np = [...placed]; np[cardIdx] = bin; setPlaced(np);
      const nPos = pos + 1; setPos(nPos);
      if (nPos >= total) {
        if (firstTryRef.current === null) firstTryRef.current = true;
        onAnswer({ stage: SCREEN_META[screen]?.scope ?? 'practice', screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'sorted', studentAnswer: JSON.stringify(np), correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
        post.start();
      }
    } else {
      if (firstTryRef.current === null || firstTryRef.current === true) firstTryRef.current = false;
      setWrongBin(bin);
      // Ovozga audio_hint (TTS-toza) ketadi; ekrandagi hint raqamli qoladi.
      if (!audio.muted) {
        const hv = (c.audio_hint && c.audio_hint[lang]) || c.hint[lang];
        wrongFeedbackTimerRef.current = setTimeout(() => {
          wrongFeedbackTimerRef.current = null;
          const engine = getAudioEngine();
          if (engine && !audio.muted) {
            engine.pushOneOff(toTtsMath(c.audio.on_wrong[lang] + ' ' + hv, lang));
          }
        }, 300);
      }
    }
  };

  const bins = [{ key: 'b', label: c.bin_b }, { key: 'a', label: c.bin_a }];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || !audio.canAdvance} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{mt(t(c.lead))}</p>}
        </div>
        {!solved && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 92, justifyContent: 'center' }}>
            <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{pos + 1} / {total}</p>
            <div key={pos} className="display fade-up" style={{ fontSize: 'clamp(26px, 5.6vw, 42px)', color: T.ink }}>{mt(cards[cardIdx].label)}</div>
          </div>
        )}
        {/* Savatlar javobdan keyin yig'iladi — natija correct_text va WhyCard'da qoladi. */}
        <div className={'fade-up delay-2 ans-block' + (solved ? ' ans-gone' : '')} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {bins.map(b => {
            const chips = placed.map((p, k) => (p === b.key ? cards[k].label : null)).filter(Boolean);
            const isWrong = wrongBin === b.key;
            return (
              <button key={b.key} disabled={solved} onClick={() => tap(b.key)} className="option" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', padding: 'clamp(12px, 2vw, 16px)', borderWidth: isWrong ? 2 : undefined, borderStyle: isWrong ? 'solid' : undefined, borderColor: isWrong ? T.accent : undefined, cursor: solved ? 'default' : 'pointer' }}>
                <span className="small mono" style={{ color: T.ink2, fontWeight: 700 }}>{t(b.label)}</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {chips.map((ch, k) => (<span key={k} className="mono small" style={{ padding: '3px 8px', borderRadius: 8, background: '#E3F0E8', color: T.success }}>{mt(ch)}</span>))}
                </span>
              </button>
            );
          })}
        </div>
        {wrongBin && !solved && <HintBlock show={true}>{mt(t(c.hint))}</HintBlock>}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? "To'g'ri" : 'Верно'}</p>
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
      </div>
    </Stage>
  );
};

// Moslash (s11) — songa bos, ro'yxatdan o'qilishini tanla; keep-visible (savol qoladi); веди-до-верного.
const DragMatch = ({ screen, screenContent, onAnswer, onNext, onPrev, totalScreens, factNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const isMobile = useIsMobile();
  const pairs = c.pairs;
  const n = pairs.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [order] = useState(() => shuffleArr([...Array(n).keys()]));
  const [assign, setAssign] = useState(() => Array(n).fill(null));
  const [activeSlot, setActiveSlot] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const firstTryRef = useRef(null);
  const introAdvancedRef = useRef(false);
  const wrongFeedbackTimerRef = useRef(null);
  const post = useAnswerSequence({
    audio,
    screen,
    correctText: c.correct_text[lang],
    whyNode: factNode,
  });
  const factRef = useRevealScroll(post.showWhy, 300);
  // Slot bosilganda pastda ochiladigan variantlar ro'yxati — tap natijasi, mobilda
  // ekrandan pastda qolmasligi uchun ko'rinishga olib kelinadi.
  const optionsRef = useRevealScroll(!solved && activeSlot !== null);

  const allPlaced = assign.every(a => a !== null);
  const isCorrect = assign.every((a, k) => a === k);
  const slotOf = (pairIdx) => assign.findIndex(a => a === pairIdx);

  const interruptAttemptFeedback = () => {
    if (wrongFeedbackTimerRef.current) {
      clearTimeout(wrongFeedbackTimerRef.current);
      wrongFeedbackTimerRef.current = null;
    }
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
  };

  useEffect(() => () => {
    if (wrongFeedbackTimerRef.current) clearTimeout(wrongFeedbackTimerRef.current);
  }, []);

  const assignToActive = (pairIdx) => {
    if (solved || activeSlot === null) return;
    if (!introAdvancedRef.current) {
      introAdvancedRef.current = true;
      audio.triggerEvent('option_picked');
    }
    interruptAttemptFeedback();
    setAssign(prev => { const nx = prev.map(a => (a === pairIdx ? null : a)); nx[activeSlot] = pairIdx; return nx; });
    setActiveSlot(null);
  };
  const clearSlot = (k, e) => {
    if (e) e.stopPropagation();
    if (solved) return;
    interruptAttemptFeedback();
    setAssign(prev => { const nx = [...prev]; nx[k] = null; return nx; });
  };

  const check = () => {
    if (solved || !allPlaced) return;
    interruptAttemptFeedback();
    if (firstTryRef.current === null) firstTryRef.current = isCorrect;
    onAnswer({ stage: SCREEN_META[screen]?.scope ?? 'practice', screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'match', studentAnswer: JSON.stringify(assign), correct: firstTryRef.current, firstTry: firstTryRef.current });
    if (isCorrect) { setSolved(true); setShowHint(false); setActiveSlot(null); post.start(); } else { setShowHint(true); }
    // Ovozga audio_hint (TTS-toza) ketadi; ekrandagi hint raqamli qoladi.
    if (!isCorrect && !audio.muted) {
      const hv = (c.audio_hint && c.audio_hint[lang]) || c.hint[lang];
      const txt = c.audio.on_wrong[lang] + ' ' + hv;
      const speakFeedback = () => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(toTtsMath(txt, lang)); };
      wrongFeedbackTimerRef.current = setTimeout(() => {
        wrongFeedbackTimerRef.current = null;
        speakFeedback();
      }, 300);
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!solved || !audio.canAdvance} onClick={onNext} label={<NextLabel/>}/></>);
  const readingFont = isMobile ? 'clamp(12px, 3.4vw, 14px)' : 'clamp(13px, 1.7vw, 15px)';
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{mt(t(c.lead))}</p>}
        </div>
        {/* Javobdan keyin qatorlar ixchamlashadi: yordamchi yozuv ("bo'luvchilari")
            olib tashlanadi, ichki bo'shliq kichrayadi — "To'g'ri" va "Nega shunday"
            tepaga chiqadi va ekran skrollsiz sig'adi. */}
        <div className="fade-up delay-1 g6-match-rows" style={{ display: 'flex', flexDirection: 'column', gap: solved ? 6 : 10, transition: 'gap 0.5s ease' }}>
          {pairs.map((pr, k) => {
            const placedPair = assign[k];
            const active = activeSlot === k;
            const rowCorrect = placedPair === k;
            const checkedCorrect = showHint && rowCorrect;
            const checkedWrong = showHint && placedPair !== null && !rowCorrect;
            const borderColor = solved || checkedCorrect ? T.success : (checkedWrong ? '#D64545' : (active ? T.accent : 'transparent'));
            return (
              <div key={k} className="frame" onClick={() => { if (!solved) setActiveSlot(active ? null : k); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: solved ? 'clamp(6px,1.1vw,9px) clamp(10px,1.8vw,14px)' : 'clamp(10px,1.8vw,14px)', cursor: solved ? 'default' : 'pointer', border: `2px solid ${borderColor}`, transition: 'border-color 0.25s ease, padding 0.5s ease' }}>
                <div style={{ minWidth: 'clamp(100px, 28vw, 150px)' }}>
                  <div className="display" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', color: T.ink }}>{mt(pr.number)}</div>
                  {!solved && <div className="small mono" style={{ color: T.ink3 }}>{t(pr.label)}</div>}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {placedPair !== null ? (
                    <>
                      <span style={{ flex: 1, fontSize: readingFont, lineHeight: 1.3, color: solved || checkedCorrect ? T.success : (checkedWrong ? '#D64545' : T.ink) }}>{mt(t(pairs[placedPair].reading))}</span>
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
                  <span style={{ flex: 1 }}>{mt(t(pairs[pi].reading))}</span>
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
            <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
          </FeedbackBlock>
        )}
        {solved && post.showWhy && factNode && (
          <div ref={factRef}>{React.cloneElement(factNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {!solved && <HintBlock show={showHint}>{mt(t(c.hint))}</HintBlock>}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// Qiyinlik pog'onasi: 12 -> 20 -> 10 -> 14 -> 12 -> 24 -> 18 -> 36.
// Rasmli (vizual model): s4, s5, s8. Qolganlari — son va qatorlar bilan.
// Ranglar tili butun dars bo'yi bitta: KARRA — aksent (to'q sariq),
// BO'LUVCHI — yashil. Misoldagi son ham, pastdagi qator/chip ham bir xil rangda.
// ============================================================
const D12 = ['1', '2', '3', '4', '6', '12'];

// Slayd 2: qator sonlari alohida audio segment. Segment id'si ekrandagi aynan
// shu sonni yoritadi; navbatdagi son boshlanganda oldingisi darhol so'nadi.
const S1_AUDIO_PLAN = {
  uz: [
    [{ id: 's1_intro', text: "Quyidagi misolni ko'rib chiqamiz. O'n ikkini uchga bo'lsak, to'rt chiqadi. Rasmga qarang." }],
    [
      { id: 's1_mult_intro', text: "O'n ikki uchning karralisi. Uchga karrali sonlar qatoriga qarang." },
      ...["uch", "olti", "to'qqiz", "o'n ikki", "o'n besh"].map((text, i) => ({ id: `s1_mult_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_mult_tail', text: "O'n ikki shu qatorda turibdi.", pauseAfterMs: 500 },
    ],
    [
      { id: 's1_div_intro', text: "Uch esa o'n ikkining bo'luvchisi. O'n ikkining bo'luvchilarini birma-bir ko'ramiz." },
      ...["bir", "ikki", "uch", "to'rt", "olti", "o'n ikki"].map((text, i) => ({ id: `s1_div_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_div_tail', text: "Uch bu ro'yxatda ham bor.", pauseAfterMs: 500 },
    ],
    [{ id: 's1_result', text: "O'n ikki soni uchga qoldiqsiz bo'linadi. Shuning uchun o'n ikki uchning karralisi, uch esa o'n ikkining bo'luvchisi." }],
  ],
  ru: [
    [{ id: 's1_intro', text: 'Рассмотрим следующий пример. Двенадцать разделить на три равно четыре. Посмотри на рисунок.' }],
    [
      { id: 's1_mult_intro', text: 'Двенадцать — кратное числа три. Посмотрим на ряд кратных.' },
      ...['три', 'шесть', 'девять', 'двенадцать', 'пятнадцать'].map((text, i) => ({ id: `s1_mult_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_mult_tail', text: 'Двенадцать стоит в этом ряду.', pauseAfterMs: 500 },
    ],
    [
      { id: 's1_div_intro', text: 'Три — делитель числа двенадцать. Назовём делители двенадцати по одному.' },
      ...['один', 'два', 'три', 'четыре', 'шесть', 'двенадцать'].map((text, i) => ({ id: `s1_div_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_div_tail', text: 'Три есть и в этом списке.', pauseAfterMs: 500 },
    ],
    [{ id: 's1_result', text: 'Двенадцать делится на три без остатка. Поэтому двенадцать кратное числа три, а три делитель числа двенадцать.' }],
  ],
};

// Slayd 11: karralilar ham, bo'luvchilar ham ovoz bilan birma-bir yoritiladi.
const S10_AUDIO_PLAN = {
  uz: [
    [
      { id: 's10_mult_intro', text: "Uchga karrali sonlar qatoriga qaraymiz." },
      ...["uch", "olti", "to'qqiz", "o'n ikki", "o'n besh", "o'n sakkiz"].map((text, i) => ({ id: `s10_mult_${i}`, text, pauseAfterMs: 240 })),
      { id: 's10_mult_tail', text: "Bu qatorni xohlagancha davom ettirish mumkin. U hech qachon tugamaydi." },
    ],
    [
      { id: 's10_div_intro', text: "Endi o'n ikkining bo'luvchilarini birma-bir aytamiz." },
      ...["bir", "ikki", "uch", "to'rt", "olti", "o'n ikki"].map((text, i) => ({ id: `s10_div_${i}`, text, pauseAfterMs: 240 })),
      { id: 's10_div_tail', text: "Va tamom. Boshqa bo'luvchi yo'q, ro'yxat tugadi." },
    ],
    [{ id: 's10_result', text: "Mana muhim farq. Songa karrali sonlar cheksiz ko'p, bo'luvchilari esa sanoqli. Eng kichik bo'luvchi bir, eng kattasi sonning o'zi." }],
  ],
  ru: [
    [
      { id: 's10_mult_intro', text: 'Посмотрим на ряд кратных числа три.' },
      ...['три', 'шесть', 'девять', 'двенадцать', 'пятнадцать', 'восемнадцать'].map((text, i) => ({ id: `s10_mult_${i}`, text, pauseAfterMs: 240 })),
      { id: 's10_mult_tail', text: 'Этот ряд можно продолжать сколько угодно. Он никогда не закончится.' },
    ],
    [
      { id: 's10_div_intro', text: 'Теперь назовём делители числа двенадцать по одному.' },
      ...['один', 'два', 'три', 'четыре', 'шесть', 'двенадцать'].map((text, i) => ({ id: `s10_div_${i}`, text, pauseAfterMs: 240 })),
      { id: 's10_div_tail', text: 'И всё. Других делителей нет, список закончился.' },
    ],
    [{ id: 's10_result', text: 'Вот важное отличие. Кратных у числа бесконечно много, а делителей конечное число. Самый маленький делитель — один, самый большой — само число.' }],
  ],
};

const Screen0 = (props) => <TitleScreen {...props} totalScreens={TOTAL_SCREENS}/>;

// s1 — DARSNING O'ZAGI. Bitta misol 12 : 3 = 4 dan ikkita nom chiqadi.
// Qadamlar yig'iladi: oxirida bola ikkala nomni bir ekranda birga ko'radi.
const Screen1 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s1} totalScreens={TOTAL_SCREENS} audioPlan={S1_AUDIO_PLAN}
    renderStep={({ t, step, refs, activeAudioId, lastCompletedAudioId }) => {
      const multActive = activeAudioId?.startsWith('s1_mult_') && /\d$/.test(activeAudioId)
        ? Number(activeAudioId.split('_').pop()) : -1;
      const divActive = activeAudioId?.startsWith('s1_div_') && /\d$/.test(activeAudioId)
        ? Number(activeAudioId.split('_').pop()) : -1;
      const multSettled = step >= 2 || lastCompletedAudioId === 's1_mult_tail' ? 3 : -1;
      const divSettled = step >= 3 || lastCompletedAudioId === 's1_div_tail' ? 2 : -1;
      return (
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(CONTENT.s1.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(CONTENT.s1.bridge)}</p>
        {/* Massiv modeli boshidan turadi — birinchi qadam bo'sh ko'rinmasin va
            bo'lish nimani bildirishi ko'z bilan ko'rinsin. Qadamlar ochilgach
            kichrayadi, lekin YO'QOLMAYDI: misolning ma'no langari shu. */}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: step === 0 ? 'clamp(10px, 2vw, 15px)' : 'clamp(7px, 1.4vw, 11px)', padding: step === 0 ? 'clamp(14px, 2.6vw, 22px)' : 'clamp(11px, 2vw, 16px)', transition: 'padding 0.5s ease, gap 0.5s ease' }}>
          <UnitArray total={12} rows={3} size={step === 0 ? 42 : 26}/>
          <EquationLine a="12" b="3" r="4" hiA={step === 1 || step >= 3} hiB={step === 2 || step >= 3}/>
        </div>
        {step >= 1 && (
          <div ref={refs[1]} className="rv-block rv-block-a rv-block-visual fade-up">
            <p className="rv-lbl rv-lbl-a">{t(CONTENT.s1.lbl_mult)}</p>
            <p className="small rv-cap">{t(CONTENT.s1.cap_mult)}</p>
            <MultiplesTrack base={3} count={5} active={multActive} activeOnly settled={multSettled} big/>
          </div>
        )}
        {step >= 2 && (
          <div ref={refs[2]} className="rv-block rv-block-b rv-block-visual fade-up">
            <p className="rv-lbl rv-lbl-b">{t(CONTENT.s1.lbl_div)}</p>
            <p className="small rv-cap">{t(CONTENT.s1.cap_div)}</p>
            <DivisorChips list={D12} active={divActive} settled={divSettled} big syncActive tone="success"/>
          </div>
        )}
        {step >= 3 && (
          <div ref={refs[3]} className="frame-tip g6-explanation-step fade-up">
            <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s1.link)}</p>
          </div>
        )}
      </div>
      );
    }}/>
);

// s2 — o'sha shakl, boshqa sonlar: bola ikkala nomni o'zi qo'yadi.
const Screen2 = (props) => (
  <PairNaming {...props} screenContent={CONTENT.s2} totalScreens={TOTAL_SCREENS}
    whyNode={<WhyCard lines={CONTENT.s2.why}/>}/>
);

const Screen3 = (props) => {
  const t = useT();
  return (
    <RuleScreen {...props} screenContent={CONTENT.s3} totalScreens={TOTAL_SCREENS}
      exampleNode={(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 1.8vw, 14px)' }}>
          <EquationLine a="12" b="3" r="4" hiA hiB labelA="a" labelB="b"/>
          <div className="rv-tags">
            <span className="rv-tag rv-tag-a">{t(CONTENT.s1.lbl_mult)}</span>
            <span className="rv-tag rv-tag-b">{t(CONTENT.s1.lbl_div)}</span>
          </div>
        </div>
      )}/>
  );
};

// s4 — qoldiq: bir xil bo'luvchi (4) ikki xil songa turlicha ta'sir qiladi.
// Ikkala holat ham ekranda QOLADI — qiyoslash aynan shundan tug'iladi
// (avval massiv almashardi va taqqoslash yo'qolardi, ekran ham bo'sh ko'rinardi).
const Screen4 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s4} totalScreens={TOTAL_SCREENS}
    renderStep={({ t, step, refs }) => (
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(CONTENT.s4.title)}</h2>
        <div className="rv-block rv-block-a fade-up delay-1">
          <UnitArray total={10} rows={4} size={38} orient="cols" restLabel={t(CONTENT.s4.rest_label)}/>
          <p className="mono rv-rem">10 = 4 · 2 + 2</p>
        </div>
        {step >= 1 && (
          <div ref={refs[1]} className="frame-soft fade-up">
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s4.note_rem)}</p>
          </div>
        )}
        {step >= 2 && (
          <div ref={refs[2]} className="rv-block rv-block-b fade-up">
            <UnitArray total={12} rows={4} size={38} orient="cols"/>
            <EquationLine a="12" b="4" r="3" hiB sm/>
          </div>
        )}
        {step >= 2 && (
          <div className="frame-success fade-up delay-1">
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s4.note_ok)}</p>
          </div>
        )}
      </div>
    )}/>
);

const Screen5 = (props) => {
  const t = useT();
  const c = CONTENT.s5;
  const base = [t(c.opt0), t(c.opt1), t(c.opt2), t(c.opt3)];
  const { options, correctIdx, content } = shuffleMC(c, base, c.correctIndex, [1, 0, 2, 3]);
  const question = (<><p className="small" style={{ color: T.ink3, marginBottom: 8 }}>{t(c.bridge)}</p><h2 className="title h-sub">{mt(t(c.question))}</h2></>);
  // Javobdan keyin savolning rasmi olib tashlanadi va "Nega shunday" ichida
  // kichikroq holda qayta paydo bo'ladi — aynan tushuntirish yonida turadi
  // va ekran skrollsiz sig'adi.
  const figure = (solved) => (solved ? null : <UnitPile n={14} size={30} maxW={280}/>);
  const why = <WhyCard lines={CONTENT.s5.why}/>;
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure} factOnCorrect={why}/>;
};

// s6 — bo'luvchilarni juftlab qidirish. Har juftlik ochilganda tegishli
// ikki chip yonadi — ro'yxat ko'z oldida to'liq bo'ladi.
const S6_PAIRS = [
  { eq: '12 = 1 · 12', set: [0, 5] },
  { eq: '12 = 2 · 6', set: [0, 1, 4, 5] },
  { eq: '12 = 3 · 4', set: [0, 1, 2, 3, 4, 5] }
];
const Screen6 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS} factOnLast
    renderStep={({ t, step, last, refs }) => (
      <div className="rv-col s6-slide">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(CONTENT.s6.title)}</h2>
        <div className="frame s6-first-frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px, 1.4vw, 11px)' }}>
          {S6_PAIRS.slice(0, step + 1).map((p, i) => (
            <p key={p.eq} ref={i > 0 && i === step ? refs[i] : null} className="mono rv-pair fade-up">{p.eq}</p>
          ))}
        </div>
        <div className="rv-block rv-block-b fade-up delay-2">
          <p className="small rv-cap">{t(CONTENT.s6.cap_all)}</p>
          <DivisorChips list={D12} activeSet={S6_PAIRS[step].set}/>
        </div>
        {step >= last && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={CONTENT.s6.fact}/>}
      </div>
    )}/>
);

const Screen7 = (props) => (
  <OddOneOut {...props} screenContent={CONTENT.s7} totalScreens={TOTAL_SCREENS}
    factNode={<WhyCard lines={CONTENT.s7.why} figure={<MultiplesTrack base={6} count={5} active={4}/>}/>}/>
);

// s8 — 1 va sonning o'zi: predmetli model o'rniga sof matematik ta'rif va
// formulalar. O'quvchi ikkala qoldiqsiz bo'linishni yonma-yon solishtiradi.
const Screen8 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s8} totalScreens={TOTAL_SCREENS}
    renderStep={({ t, lang, step, refs }) => (
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(CONTENT.s8.title)}</h2>
        <div className="rv-block rv-block-b fade-up delay-1">
          <EquationLine a="12" b="1" r="12" hiB/>
          <p className="body" style={{ margin: 0, textAlign: 'center' }}>{t(CONTENT.s8.note_one)}</p>
        </div>
        {step >= 1 && (
          <div ref={refs[1]} className="rv-block rv-block-b fade-up">
            <EquationLine a="12" b="12" r="1" hiB/>
            <p className="body" style={{ margin: 0, textAlign: 'center' }}>{t(CONTENT.s8.note_self)}</p>
          </div>
        )}
        {step >= 2 && (
          <div ref={refs[2]} className="frame-tip g6-explanation-step fade-up">
            <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
            <p className="body" style={{ margin: 0 }}><strong>{lang === 'uz' ? "Matematik ta'rif:" : 'Математическое определение:'}</strong> {t(CONTENT.s8.note_prime)}</p>
          </div>
        )}
      </div>
    )}/>
);

const D18 = ['1', '2', '3', '6', '9', '18'];
const Screen9 = (props) => (
  <PickDivisors {...props} screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} retryMode
    whyNode={<WhyCard lines={CONTENT.s9.why} figure={<DivisorChips list={D18} activeSet={[0, 1, 2, 3, 4, 5]}/>}/>}
    factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s9.fact}/>}/>
);

// s10 — karralar cheksiz, bo'luvchilar sanoqli. Ikki ro'yxat yonma-yon emas,
// birin-ketin ochiladi: 390px ekranga sig'sin.
const Screen10 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS} audioPlan={S10_AUDIO_PLAN}
    renderStep={({ t, step, refs, activeAudioId, lastCompletedAudioId }) => {
      const multActive = activeAudioId?.startsWith('s10_mult_') && /\d$/.test(activeAudioId)
        ? Number(activeAudioId.split('_').pop()) : -1;
      const divActive = activeAudioId?.startsWith('s10_div_') && /\d$/.test(activeAudioId)
        ? Number(activeAudioId.split('_').pop()) : -1;
      const multSettled = step >= 1 || lastCompletedAudioId === 's10_mult_tail' ? 5 : -1;
      const divSettled = step >= 2 || lastCompletedAudioId === 's10_div_tail' ? 5 : -1;
      return (
      <div className="rv-col s10-slide">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(CONTENT.s10.title)}</h2>
        <div className="rv-block rv-block-a fade-up delay-1">
          <p className="small rv-cap">{t(CONTENT.s10.cap_mult)}</p>
          <MultiplesTrack base={3} count={6} active={multActive} activeOnly settled={multSettled}/>
          <span className="rv-badge rv-badge-a">{t(CONTENT.s10.badge_inf)}</span>
        </div>
        {step >= 1 && (
          <div ref={refs[1]} className="rv-block rv-block-b fade-up">
            <p className="small rv-cap">{t(CONTENT.s10.cap_div)}</p>
            <DivisorChips list={D12} active={divActive} settled={divSettled} syncActive tone="success"/>
            <span className="rv-badge rv-badge-b">{t(CONTENT.s10.badge_fin)}</span>
          </div>
        )}
        {step >= 2 && (
          <div ref={refs[2]} className="frame-tip g6-explanation-step fade-up">
            <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s10.concl)}</p>
          </div>
        )}
      </div>
      );
    }}/>
);

const Screen11 = (props) => (
  <DragMatch {...props} screenContent={CONTENT.s11} totalScreens={TOTAL_SCREENS}
    factNode={<WhyCard lines={CONTENT.s11.why}/>}/>
);

const Screen12 = (props) => (
  <Classify {...props} screenContent={CONTENT.s12} totalScreens={TOTAL_SCREENS}
    whyNode={<WhyCard lines={CONTENT.s12.why} figure={<DivisorChips list={['1', '2', '3', '6']} activeSet={[0, 1, 2, 3]}/>}/>}/>
);

// Yakuniy ekranda WhyCard'ga rasm qo'yilmaydi: to'qqizta bo'luvchi ro'yxati
// FeedbackBlock matnida to'liq turibdi, chiplarni takrorlash ekranni skrollga
// olib boradi (pastda yana fakt-kartochka ham bor).
const Screen13 = (props) => (
  <PickDivisors {...props} screenContent={CONTENT.s13} totalScreens={TOTAL_SCREENS} retryMode
    whyNode={<WhyCard lines={CONTENT.s13.why}/>}
    factNode={<FactCard badge={FB_SCI} anim={<AnimData/>} text={CONTENT.s13.fact}/>}/>
);
const Screen14 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's14_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach(l => e.pushOneOff(l)); }
    /* eslint-disable-next-line */
  }, []);
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers[i]?.correct).length;
  const total = scoredIdx.length;
  const mains = [c.main_1, c.main_2, c.main_3];
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Darsni tugatish' : 'Завершить урок'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      {/* Ixcham tuzilish: sarlavha va ball BITTA qatorda (eyebrow Stage'ning
          o'zida bor, takrorlanmaydi), ichki bo'shliqlar kichraytirilgan —
          yakuniy ekran 360x640 da ham skrollsiz sig'adi. */}
      <div className="g6-final-slide" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <div className="fade-up sm-head" style={{ position: 'relative' }}>
          <h2 className="title h-sub" style={{ margin: 0, flex: 1 }}>{t(c.heading)}</h2>
        </div>
        <p className="small fade-up sm-result" style={{ position: 'relative', margin: 0, color: T.ink3 }}>
          <span>{t(c.score_label)}</span>
          <strong className="sm-score mono">{correct}/{total}</strong>
        </p>
        <div className="frame fade-up delay-1 sm-main" style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ color: T.ink2, marginBottom: 10 }}>{t(c.main_label)}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {mains.map((m, i) => (<div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><span className="mono small" style={{ color: T.accent, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span><p className="body" style={{ margin: 0 }}>{t(m)}</p></div>))}
          </div>
        </div>
        <div className="frame-success fade-up delay-2 sm-close" style={{ position: 'relative' }}>
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
.mnum { font-family: 'JetBrains Mono', monospace; font-variation-settings: normal; font-weight: 700; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: inherit; font-variation-settings: inherit; font-weight: inherit; }
.frac .n, .frac .d { padding: 0 0.12em; font: inherit; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }

@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.65s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.2s; } .delay-2 { animation-delay: 0.42s; }
.delay-3 { animation-delay: 0.64s; } .delay-4 { animation-delay: 0.86s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.6s ease-out, opacity 0.45s ease-out 0.15s, margin-top 0.6s ease-out; margin-top: 0; }
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
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.75s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 30px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (div_6_01) ===== */
/* Bo'luvchilarni tanlash (s9, s13) — bir qator son, tanlanadi. */
.pd-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(7px, 1.6vw, 11px); }
.pd-num { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 4vw, 26px); font-weight: 700; min-width: clamp(48px, 11vw, 70px); padding: clamp(10px, 2vw, 14px) clamp(8px, 1.6vw, 12px); border-radius: 14px; border: 2px solid rgba(167, 166, 162, 0.35); background: #FFFFFF; color: #0E0E10; cursor: pointer; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.pd-num:hover:not(:disabled) { border-color: #FF4F28; transform: translateY(-2px); }
.pd-sel { background: #FFE8E1; color: #FF4F28; border-color: #FF4F28; transform: translateY(-2px); box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.4); }
.pd-ok { background: #E3F0E8; color: #1F7A4D; border-color: #1F7A4D; cursor: default; animation: ring-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.pd-no { background: #FFFFFF; color: #C9C7C2; border-color: rgba(167, 166, 162, 0.22); opacity: 0.5; cursor: default; box-shadow: none; }
.pd-review-no { background: #FFE8E1; color: #C83A20; border-color: #FF4F28; cursor: default; box-shadow: 0 0 0 3px rgba(255, 79, 40, 0.12); animation: pd-wrong-shake 0.45s ease both; }
@keyframes pd-wrong-shake { 0%, 100% { transform: translateX(0); } 30% { transform: translateX(-4px); } 65% { transform: translateX(4px); } }

/* Yakuniy ekran (s14) — ixcham: sarlavha + ball bitta qatorda, ramkalar past. */
.sm-head { display: flex; align-items: center; gap: 12px; }
.sm-head .h-sub { font-size: clamp(24px, 4vw, 34px); }
.sm-result { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; }
.sm-result > span { font-size: clamp(14px, 2.5vw, 18px); font-weight: 600; }
.sm-score { flex-shrink: 0; padding: 7px 16px; border-radius: 999px; background: #E3F0E8; color: #1F7A4D; font-size: clamp(20px, 3.8vw, 28px); font-weight: 700; line-height: 1.15; }
.sm-main { padding: clamp(12px, 2.2vw, 20px); }
.sm-close { padding: clamp(11px, 2vw, 16px); }

/* "Nega shunday" — to'g'ri javobdan keyingi animatsion tushuntirish. */
.why { background: #FFFFFF; border-radius: 14px; border-left: 4px solid #019ACB; padding: clamp(12px, 2.2vw, 17px); box-shadow: 0 8px 22px -6px rgba(1, 154, 203, 0.2); margin-top: clamp(10px, 1.8vw, 14px); animation: fade-in-up 0.7s ease-out both; }
.why-h { display: flex; align-items: center; gap: 8px; margin: 0 0 clamp(8px, 1.6vw, 12px); font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.9vw, 12px); font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: #019ACB; }
.why-dot { width: 7px; height: 7px; border-radius: 50%; background: #019ACB; box-shadow: 0 0 8px rgba(1, 154, 203, 0.6); animation: rv-dot-pulse 1.8s ease-in-out infinite; }
.why-fig { display: flex; justify-content: center; padding-bottom: clamp(8px, 1.6vw, 12px); }
.why-list { position: relative; display: flex; flex-direction: column; gap: clamp(7px, 1.4vw, 10px); }
.why-list::before { content: ''; position: absolute; left: 10.5px; top: 12px; bottom: 12px; width: 1px; background: linear-gradient(180deg, rgba(1,154,203,0.55), rgba(1,154,203,0.08)); }
.why-row { position: relative; display: flex; align-items: flex-start; gap: 10px; animation: why-in 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
.why-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #EAF6FB; color: #019ACB; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; margin-top: 1px; }
.why-tx { margin: 0; font-size: clamp(15px, 2.9vw, 16px); line-height: 1.45; color: #0E0E10; }
@keyframes why-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }

/* Banka pop-in: pastdan yuqoriga qalqib chiqadi (CansRows/CansPile). */
@keyframes rg-dot-in { from { opacity: 0; transform: translateY(6px) scale(0.6); } to { opacity: 1; transform: none; } }

/* DivisorChips — bo'luvchi/karra chiplari. */
.dv-chip { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 17px); font-weight: 600; padding: clamp(6px,1.2vw,9px) clamp(11px,2vw,15px); border-radius: 10px; border: 1.5px solid; animation: rg-dot-in 0.6s ease-out both; transition: background 0.55s ease, color 0.55s ease, border-color 0.55s ease; }

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

/* ===== SARLAVHA EKRANI (s0) ===== */
.ttl-wrap { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(9px, 1.8vw, 14px); text-align: center; transform: translate3d(0, 0, 0); transition: transform 2.8s linear; will-change: transform; }
.ttl-wrap.ttl-example-focus { transform: translate3d(0, clamp(-22px, -3.2vh, -14px), 0); }
.ttl-kicker { position: relative; color: #FF4F28; animation: ttl-in 0.8s ease-out both; }
/* line-height 1.14 — 'y'/apostrof kabi pastga tushuvchi belgilar ostidagi
   aksent chizig'iga tegib ketmasin (1.02 da tegib turardi). */
.ttl-h1 { position: relative; width: 100%; margin: 0; color: #0E0E10; font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(30px, 6.4vw, 50px); font-weight: 600; font-variation-settings: "opsz" 60; line-height: 1.14; text-align: center; animation: ttl-in 1.05s cubic-bezier(0.2, 0.7, 0.3, 1) both; animation-delay: 0.18s; }
.ttl-rule { position: relative; display: block; height: 5px; width: clamp(64px, 16vw, 104px); margin: clamp(5px, 1.2vw, 9px) 0 clamp(3px, 0.8vw, 6px); border-radius: 99px; background: #FF4F28; box-shadow: 0 0 14px rgba(255, 79, 40, 0.55); transform-origin: center; animation: ttl-rule-in 0.85s cubic-bezier(0.2, 0.7, 0.3, 1) both; animation-delay: 0.72s; }
.ttl-sub { position: relative; color: #494550; max-width: 30ch; animation: ttl-in 0.85s ease-out both; animation-delay: 0.95s; }
/* Hero kartochka — darsning misoli ikkita javobsiz "?" bilan: qiziqish uyg'otadi,
   lekin javobni ochmaydi. "?" lar navbatma-navbat sekin pulsatsiya qiladi. */
.ttl-hero { position: relative; width: 100%; max-width: 520px; min-height: clamp(128px, 23vw, 178px); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(7px, 1.4vw, 10px); margin-top: clamp(4px, 1vw, 8px); background: #FFFFFF; border-radius: 16px; padding: clamp(13px, 2.4vw, 19px) clamp(18px, 3.4vw, 28px); box-shadow: 0 16px 34px -10px rgba(58,53,48,.22); }
.ttl-stage-reveal { animation: ttl-reveal-slow 1.2s cubic-bezier(.2,.7,.3,1) both; }
.ttl-example-focus .ttl-h1 { font-size: clamp(30px, 6.4vw, 50px); }
.ttl-example-focus .ttl-sub { font-size: clamp(14px, 2.6vw, 17px); }
.ttl-example-focus .ttl-hero .eq-sm { font-size: clamp(32px, 7vw, 50px); }
.ttl-tease { display: flex; gap: 8px; }
.ttl-q { padding: 5px 13px; border-radius: 999px; background: #F6F4EF; color: #8A8883; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 14px); font-weight: 600; animation: q-pulse 2.6s ease-in-out infinite; }
.ttl-tease .ttl-q:nth-child(2) { animation-delay: 1.3s; }
@keyframes q-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.ttl-prompt {
  position: relative;
  margin: 0;
  color: #43855F;
  font-size: clamp(18px, 2.9vw, 21px);
  font-weight: 500;
  line-height: 1.25;
  text-align: center;
  opacity: 0;
  transition: opacity 1.05s ease;
}
.ttl-prompt.is-visible { opacity: 1; }
.ttl-prompt-slot { position: relative; min-height: 30px; margin-top: clamp(5px, 1vw, 9px); display: flex; align-items: center; justify-content: center; }
.ttl-opts { position: relative; display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 520px; opacity: 0; visibility: hidden; transform: translateY(18px); transition: opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.7,.3,1), visibility 0s linear 1.2s; }
.ttl-opts.is-visible { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
.ttl-opt {
  width: 100%;
  max-width: 520px;
  height: auto;
  min-height: clamp(58px, 10vw, 72px);
  box-sizing: border-box;
  padding: clamp(14px, 2.5vw, 18px) clamp(18px, 3vw, 24px);
  border: 2px solid #D8D3C8;
  background: #FFFFFF;
  color: #0E0E10;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: clamp(18px, 3.2vw, 22px);
  font-weight: 300;
  line-height: 1.2;
  text-align: center;
  white-space: normal;
  overflow: visible;
  box-shadow: 0 10px 24px -8px rgba(58, 53, 48, 0.24);
}
.ttl-opt:hover:not(:disabled) {
  border-color: #BEB7AA;
  background: #F7F4EE;
  color: #0E0E10;
  transform: translateY(-1px);
  box-shadow: 0 14px 28px -8px rgba(58, 53, 48, 0.3);
}
@keyframes ttl-in { from { opacity: 0; transform: translateY(16px); letter-spacing: 0.05em; } to { opacity: 1; transform: none; letter-spacing: normal; } }
@keyframes ttl-reveal-slow { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes ttl-rule-in { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }

/* Sarlavha foni — 3 ga karrali sonlar sekin suzib yuradi (bezak, o'qilmaydi). */
.nd { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.nd-n { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #FF4F28; opacity: 0.07; user-select: none; animation: nd-float 19s ease-in-out infinite; }
.nd-n1 { left: 6%; top: 11%; font-size: 44px; animation-delay: 0s; }
.nd-n2 { right: 9%; top: 7%; font-size: 30px; color: #019ACB; animation-delay: -3s; }
.nd-n3 { left: 13%; bottom: 15%; font-size: 36px; animation-delay: -6s; }
.nd-n4 { right: 6%; bottom: 11%; font-size: 52px; color: #019ACB; animation-delay: -9s; }
.nd-n5 { left: 44%; top: 3%; font-size: 26px; animation-delay: -12s; }
.nd-n6 { right: 25%; bottom: 29%; font-size: 32px; animation-delay: -15s; }
.nd-n7 { left: 4%; top: 47%; font-size: 28px; color: #019ACB; animation-delay: -7.5s; }
.nd-n8 { right: 3%; top: 41%; font-size: 38px; animation-delay: -11s; }
@keyframes nd-float { 0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); } 33% { transform: translateY(-16px) translateX(9px) rotate(3deg); } 66% { transform: translateY(10px) translateX(-11px) rotate(-3deg); } }

/* ===== KATTA BO'LISH MISOLI (EquationLine) =====
   Yonayotgan qism pastdagi qator/chip bilan BIR XIL rangda: aksent — karra,
   yashil — bo'luvchi. Rang o'tishi silliq, chunki bola ko'zi bilan kuzatadi. */
.eq-line { display: inline-flex; align-items: center; justify-content: center; gap: clamp(5px, 1.3vw, 10px); font-family: 'JetBrains Mono', monospace; font-size: clamp(30px, 7vw, 46px); font-weight: 700; line-height: 1; }
.eq-var { position: absolute; left: 50%; bottom: calc(100% + 5px); transform: translateX(-50%); font-family: 'Source Serif 4', serif; font-size: 0.48em; font-style: italic; font-weight: 700; line-height: 1; text-shadow: 0 2px 8px rgba(58,53,48,0.12); animation: eq-var-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes eq-var-in { from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.75); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
.eq-sm { font-size: clamp(19px, 4.4vw, 27px); }
.eq-part { display: inline-flex; align-items: center; justify-content: center; padding: 0.1em 0.16em; border-radius: 10px; color: #0E0E10; background: transparent; transition: background 0.75s cubic-bezier(0.4, 0, 0.2, 1), color 0.75s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.75s ease; animation: eq-in 0.7s ease-out both; }
.eq-line .eq-part:nth-child(1) { animation-delay: 0.1s; }
.eq-line .eq-part:nth-child(3) { animation-delay: 0.32s; }
.eq-line .eq-part:nth-child(5) { animation-delay: 0.54s; }
.eq-op { color: #8A8883; font-weight: 500; animation: eq-in 0.7s ease-out both; animation-delay: 0.21s; }
.eq-res { color: #494550; }
.eq-hi-a { background: #FFE8E1; color: #FF4F28; box-shadow: 0 6px 18px -8px rgba(255, 79, 40, 0.55); }
.eq-hi-b { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 6px 18px -8px rgba(31, 122, 77, 0.55); }
@keyframes eq-in { from { opacity: 0; } to { opacity: 1; } }

/* ===== KARRALAR QATORI / BO'LUVCHILAR CHIPLARI ===== */
.mt-num { font-family: 'JetBrains Mono', monospace; padding: clamp(5px, 1.1vw, 8px) clamp(9px, 1.8vw, 13px); border-radius: 10px; font-size: clamp(14px, 2.6vw, 19px); font-weight: 600; transition: background 0.55s ease, color 0.55s ease; animation: rg-dot-in 0.55s ease-out both; }
.mt-big { font-size: clamp(19px, 4.4vw, 28px); padding: clamp(6px, 1.3vw, 9px) clamp(10px, 2vw, 14px); }
.mt-dots { color: #8A8883; font-size: clamp(15px, 2.8vw, 19px); }
.dv-big { font-size: clamp(17px, 3.8vw, 24px); padding: clamp(8px, 1.6vw, 11px) clamp(13px, 2.4vw, 18px); }

/* Aylanaga olingan son — "mana shu son shu yerda turibdi" ishorasi.
   Fon emas, aynan HALQA: qator ichidan ajralib turadi, lekin qatorni buzmaydi. */
.mt-ring { background: #FFE8E1; color: #FF4F28; border-radius: 999px; box-shadow: 0 0 0 2.5px #FF4F28, 0 7px 20px -7px rgba(255, 79, 40, 0.55); animation: ring-pop 0.95s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.dv-ring { background: #E3F0E8; color: #1F7A4D; border-color: transparent; border-radius: 999px; box-shadow: 0 0 0 2.5px #1F7A4D, 0 7px 20px -7px rgba(31, 122, 77, 0.55); animation: ring-pop 0.95s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@keyframes ring-pop { 0% { opacity: 0; transform: scale(0.55); } 62% { opacity: 1; transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }

/* ===== KASHFIYOT BLOKLARI (RevealScreen) ===== */
/* justify-content: center — .rv-col o'zi flex:1 bo'lgani uchun kontent balandroq
   bo'lsa o'zi cho'ziladi, ortiqcha bo'sh joy qolmaydi va tepasi KESILMAYDI.
   Kontent kam bo'lgan qadamlarda esa ekran markazida turadi. */
.rv-col { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: clamp(8px, 1.6vw, 14px); }
.rv-block { position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1vw, 8px); background: #FFFFFF; border-radius: 14px; border-left: 4px solid transparent; padding: clamp(9px, 1.8vw, 14px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.rv-block::after { content: ''; position: absolute; z-index: -1; width: 120px; height: 120px; right: -62px; top: -68px; border-radius: 50%; opacity: 0.42; pointer-events: none; animation: concept-glow 4.8s ease-in-out infinite; }
.rv-block-a::after { background: radial-gradient(circle, rgba(255,79,40,0.22), rgba(255,79,40,0)); }
.rv-block-b::after { background: radial-gradient(circle, rgba(31,122,77,0.20), rgba(31,122,77,0)); }
@keyframes concept-glow { 0%, 100% { transform: scale(0.9); opacity: 0.3; } 50% { transform: scale(1.12); opacity: 0.55; } }
.rv-block-a { border-left-color: #FF4F28; }
.rv-block-b { border-left-color: #1F7A4D; }
.rv-lbl { margin: 0; text-align: center; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px, 3.4vw, 23px); line-height: 1.15; }
.rv-lbl-a { color: #FF4F28; }
.rv-lbl-b { color: #1F7A4D; }
.rv-cap { margin: 0; color: #8A8883; }
.rv-rem { margin: 0; font-size: clamp(17px, 3.6vw, 23px); font-weight: 600; color: #FF4F28; }
.rv-pair { margin: 0; font-size: clamp(17px, 3.6vw, 23px); font-weight: 600; color: #0E0E10; }
.rv-badge { margin-top: 2px; padding: 4px 11px; border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.9vw, 12px); font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; }
.rv-badge-a { background: #FFE8E1; color: #FF4F28; }
.rv-badge-b { background: #E3F0E8; color: #1F7A4D; }
.rv-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.rv-tag { padding: 6px 13px; border-radius: 999px; font-family: 'Manrope', sans-serif; font-size: clamp(12px, 2.3vw, 14px); font-weight: 600; }
.rv-tag-a { background: #FFE8E1; color: #FF4F28; }
.rv-tag-b { background: #E3F0E8; color: #1F7A4D; }
/* Qadam indikatori — tushuntirish o'zi ochilayotganini bildiradi. */
.rv-dots { display: flex; align-items: center; gap: 7px; margin-left: 14px; }
.rv-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(167, 166, 162, 0.35); transition: background 0.35s ease, transform 0.35s ease; }
.rv-dot-done { background: rgba(255, 79, 40, 0.4); }
.rv-dot-on { background: #FF4F28; transform: scale(1.25); box-shadow: 0 0 9px rgba(255, 79, 40, 0.6); animation: rv-dot-pulse 1.6s ease-in-out infinite; }
@keyframes rv-dot-pulse { 0%, 100% { box-shadow: 0 0 6px rgba(255, 79, 40, 0.45); } 50% { box-shadow: 0 0 14px rgba(255, 79, 40, 0.75); } }

/* ===== s2 — ikkala nomni o'zi qo'yish (PairNaming) ===== */
/* Javob variantlari bloki: to'g'ri javobdan keyin yuqoriga yig'ilib yo'qoladi,
   "To'g'ri" va "Nega shunday" tepaga chiqadi — skroll kerak bo'lmaydi.
   margin-bottom manfiy — ota-flex'ning gap'i ham yopiladi, izsiz ketadi.
   Barcha savol ekranlari uchun umumiy (s2, s9, s12, s13). */
.ans-block { display: flex; flex-direction: column; gap: clamp(12px, 2.2vw, 16px); max-height: 900px; opacity: 1; transform: translateY(0); overflow: hidden; transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.ans-gone { max-height: 0; opacity: 0; transform: translateY(-18px); margin-bottom: calc(-1 * clamp(12px, 2.2vw, 16px)); pointer-events: none; }
.pn-row { display: flex; flex-direction: column; gap: 10px; background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 100%); border-radius: 14px; padding: clamp(11px, 2vw, 15px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.pn-lead { display: flex; align-items: center; gap: 10px; margin: 0; font-weight: 600; }
.pn-num { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #FFE8E1; color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
.pn-opts { display: flex; gap: 9px; }
/* To'rtala variant BIR XIL och sariq: rang javobga ishora bermaydi,
   ekran esa oq-oqdan chiqib, jonli ko'rinadi. */
.pn-opt { flex: 1; padding: clamp(11px, 2vw, 14px) clamp(8px, 1.6vw, 14px); font-size: clamp(14px, 2.6vw, 16px); font-weight: 600; text-align: center; background: #FBF3D6; color: #0E0E10; border: 2px solid rgba(216, 169, 58, 0.35); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pn-opt:hover:not(:disabled) { background: #F9EDC4; border-color: #D8A93A; }
.pn-sel { border-color: #D8A93A; background: #F7E7B4; transform: translateY(-2px); box-shadow: 0 10px 22px -6px rgba(180, 138, 30, 0.45); }
.pn-right { font-weight: 700; border-color: #1F7A4D; background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.4); }
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (platform_contract §1)
// ============================================================
export default function DivisibilityLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  // LMS `lang` ni uzatadi. Lokal preview'da (LessonPage `<Component/>` ni propsiz
  // chaqiradi) u undefined bo'ladi — o'shanda RU/UZ tugmasi chiqadi va darsni ikkala
  // tilda prokliklab ko'rish mumkin. Naqsh grade3/Dars01 dan (isPreview + previewLang).
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

  const screens = [Screen0, Screen1, Screen3, Screen4, Screen6, Screen8, Screen10, Screen2, Screen5, Screen7, Screen9, Screen11, Screen12, Screen13, Screen14];
  const CurrentScreen = screens[current];

  // Navigatsiya qulfi — telefonda ikki marta tegib ketilsa bitta ekran tashlab
  // o'tilardi (setCurrent asinxron, ikkala chaqiruv ham o'tib ketardi).
  // 350 ms — tasodifiy ikkinchi tegishni yutadi, haqiqiy bosishga xalaqit bermaydi.
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
      <div className="lesson-root grade6-dars01">
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

// 6-sinfning keyingi nazariy darslari aynan shu etalon infratuzilmasidan
// foydalanadi. Bu eksportlar Dars01 ko'rinishi, audio oqimi va mobil
// masshtabini nusxalamasdan, bevosita bir xil komponentlarda saqlaydi.
export {
  T,
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  QuestionScreen,
  RevealScreen,
  PickDivisors,
  DragMatch,
  Classify,
  WhyCard,
  FactCard,
  Floaters,
  useIntroStages,
  Frac,
  mt,
  STYLES,
};
