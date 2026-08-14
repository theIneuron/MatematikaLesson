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
// navLock: «Davom» tugmasini qulflash. Sinf kontraktida (OVOZ_KONTRAKTI_6SINF §6,
// metodist qarori 2026-08-05) qulf YOQILGAN. Metodist 2026-08-13 da 1-dars uchun
// uni O'CHIRISHNI so'radi. Bayroq konfigda turadi, chunki qulf QO'SHILGAN
// komponentlar (QuestionScreen, RevealScreen, PickDivisors, DragMatch, Classify)
// shu fayldan 2-7-darslarga ham import qilinadi: kodda o'chirilsa, ular ham
// qulfini yo'qotardi. Default `true` — qolgan darslar tegilmagan.
let ttsConfig = { ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', aiGradingEndpoint: '', studentName: '', voiceGender: 'm', navLock: true };
// navLock HAR safar `true` ga qaytariladi va faqat chaqiruvchi uni o'chirishi
// mumkin. Aks holda oqib ketardi: `ttsConfig` shu modulda YASHAYDI va 2-7-darslar
// uni shu yerdan oladi. Bola 1-darsdan 2-darsga o'tsa (sayt bir sessiyada),
// 2-dars `navLock` ni uzatmaydi, birlashtirish esa eski `false` ni saqlab qolardi —
// va 2-dars qulfini JIMGINA yo'qotardi.
const configureLesson = (cfg) => { ttsConfig = { ...ttsConfig, navLock: true, ...cfg }; };
// Qulf o'chirilgan bo'lsa, tugma HECH QACHON yopilmaydi. Ovoz o'z yo'lida
// ishlaydi, topshiriqlar ham: faqat o'tish erkin bo'ladi.
const navLocked = (cond) => (ttsConfig.navLock === false ? false : cond);

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

// Uch tilli tanlov. Ilgari kodda `lang === 'ru' ? RUS : UZB` shoxlari turardi:
// ingliz tili `else` ga tushib, o'zbekchani ko'rsatardi — JIM xato. 3-sinf kitida
// bu yordamchi bor, 6-sinfda yo'q edi, shuning uchun shu yerda e'lon qilinadi.
const tri = (lang, ru, uz, en) => {
  if (lang === 'en') return en;
  if (lang === 'uz') return uz;
  return ru;
};

// Ovoz tugunidan tilni olamiz; berilgan til yo'q bo'lsa RU ga tushamiz.
// Ilgari kod to'g'ridan-to'g'ri node[lang] ni indeksladi: ingliz tilida u
// undefined bo'lib, ekran YIQILARDI (tekshirilgan 2026-08-13). Matn uchun
// useT allaqachon shunday qiladi, ovoz uchun esa shu yordamchi.
const pickL = (node, lang) => {
  if (node === null || node === undefined) return node;
  return node[lang] !== undefined ? node[lang] : node.ru;
};

// Согласование счётного слова в русском: 1 ряд, 4 ряда, 5 рядов, 21 ряд.
// Нужно там, где число подставляется в подпись на ходу и заранее неизвестно.
// В узбекском и английском счётное слово не меняется — там шаблон обычный.
const plRu = (n, forms) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
};

// Подставляет число и, для русского, согласованное счётное слово в `{w}`.
const rowsWord = (tpl, formsNode, lang, n) => {
  const out = String(tpl).replace('{r}', String(n));
  if (out.indexOf('{w}') < 0) return out;
  const forms = (formsNode && formsNode[lang]) || (formsNode && formsNode.ru) || [];
  return out.replace('{w}', forms.length === 3 ? plRu(n, forms) : '');
};

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
  // Ingliz tili uchun raqamni SO'Z bilan yozmaymiz: TTS raqamni o'zi to'g'ri
  // o'qiydi, jadval esa `NUM_WORDS[lang] || NUM_WORDS.uz` orqali O'ZBEKCHAGA
  // tushib ketardi — ingliz ovozi o'zbekcha sanardi.
  if (lang === 'en') return String(value);
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
  if (lang === 'en') return `${numerator} over ${denominator}`;
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
  if (lang === 'en') return `${whole} point ${fraction}`;
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
  if (lang === 'en') return `${whole} point ${nonRepeating} with ${period} repeating`;
  const wholeWords = numberToWords(whole, lang);
  const periodWords = numberToWords(period, lang);
  if (!nonRepeating) {
    return tri(lang, `${wholeWords} целых, ${periodWords} в периоде`, `${wholeWords} butun, davrda ${periodWords}`, `${whole} point ${period} repeating`);
  }
  const finitePart = decimalToWords(whole, nonRepeating, lang);
  return lang === 'ru'
    ? `${finitePart}, ${periodWords} в периоде`
    : `${finitePart}, davrda ${periodWords}`;
};

const toTtsMath = (text, lang) => {
  const ops = tri(
    lang,
    { mul: ' умножить на ', div: ' разделить на ', ratio: ' к ', eq: ' равно ', minus: ' минус ', plus: ' плюс ' },
    { mul: ' karra ', div: " bo'lingan ", ratio: ' nisbat ', eq: ' teng ', minus: ' minus ', plus: " qo'shuv " },
    { mul: ' times ', div: ' divided by ', ratio: ' to ', eq: ' equals ', minus: ' minus ', plus: ' plus ' },
  );
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
    (_, inside) => `${tri(lang, 'модуль', 'modul', 'modulus')} ${inside}`,
  )
    .replace(/π/g, tri(lang, ' пи ', ' pi ', ' pi '))
    .replace(/Δ/g, tri(lang, ' треугольник ', ' uchburchak ', ' triangle '))
    .replace(/∠/g, tri(lang, ' угол ', ' burchak ', ' angle '))
    .replace(/⊥/g, tri(lang, ' перпендикулярно ', ' perpendikulyar ', ' perpendicular to '))
    .replace(/→/g, tri(lang, ' переходит в ', " o'tadi ", ' maps to '))
    .replace(/′/g, tri(lang, ' штрих ', ' shtrix ', ' prime '))
    .replace(/(\w|\d)²/g, (_, base) => tri(lang, `${base} в квадрате`, `${base} kvadrati`, `${base} squared`))
    .replace(/(\w|\d)³/g, (_, base) => tri(lang, `${base} в кубе`, `${base} kubi`, `${base} cubed`))
    .replace(/°/g, tri(lang, ' градусов ', ' daraja ', ' degrees '));
  const ratioContext = tri(
    lang,
    /(отнош|пропорц|масштаб)/i,
    /(nisbat|propors|masshtab)/i,
    /(ratio|proportion|scale)/i,
  ).test(mathNamed);
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
      (_, a, b, c) => tri(
        lang,
        `${numberToWords(a, lang)} разделить на ${numberToWords(b, lang)} равно ${numberToWords(c, lang)}`,
        `${numberToWords(a, lang)}ni ${numberToWords(b, lang)}ga bo'lsak, ${numberToWords(c, lang)} chiqadi`,
        `${a} divided by ${b} equals ${c}`,
      )
    );
  return normalizeTtsColons(clean, {
    divisionWord: ops.div,
    ratioWord: ops.ratio,
    ratioContext,
  })
    .replace(/(\d{1,3}|\?)\s*\/\s*(\d{1,3})/g, (_, n, d) => fractionToWords(n, d, lang))
    .replace(/\s*\/\s*/g, ops.div)
    .replace(/\s*[·×]\s*/g, ops.mul)
    .replace(/\s*%\s*/g, tri(lang, ' процентов ', ' foiz ', ' percent '))
    .replace(/\s*≤\s*/g, tri(lang, ' меньше или равно ', ' kichik yoki teng ', ' less than or equal to '))
    .replace(/\s*≥\s*/g, tri(lang, ' больше или равно ', ' katta yoki teng ', ' greater than or equal to '))
    .replace(/\s*<\s*/g, tri(lang, ' меньше ', ' kichik ', ' less than '))
    .replace(/\s*>\s*/g, tri(lang, ' больше ', ' katta ', ' greater than '))
    .replace(/\s*=\s*/g, ops.eq)
    .replace(/\s*≈\s*/g, tri(lang, ' примерно равно ', ' taxminan teng ', ' approximately equal to '))
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
    return pickL(screenContent.audio, lang).map((text, i) => ({
      id: `aud_${i}`,
      text,
      trigger: i === 0 ? 'on_mount' : (i === 1 ? 'after_previous' : `on_event:step_${i - 1}`),
      waits_for: i < pickL(screenContent.audio, lang).length - 1
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
  return tri(lang, 'Дальше', 'Davom etish', 'Next');
};

const BackLabel = () => {
  const lang = useLang();
  return tri(lang, 'Назад', 'Orqaga', 'Back');
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
    text: pickL(c.audio.intro, lang),
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
      <NavNext disabled={navLocked(!solved || !audio.canAdvance)} onClick={onNext} label={<NextLabel/>}/>
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
            <span aria-hidden="true">{solved ? '✓' : '✗'}</span>{solved ? (tri(lang, 'Верно', "To'g'ri", 'Correct')) : (tri(lang, 'Подсказка', 'Maslahat', 'Hint'))}
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
  lessonTitle: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar", en: 'Divisors and multiples' }
};

// Tartib (v3, metodist qarori 2026-08-13). Ilgari ekranlar guruhlangan edi:
// oldin ketma-ket YETTI tushuntirish, keyin ketma-ket YETTI savol — bola yarim
// darsni faqat tomosha qilardi. Endi navbat almashadi: tushuntirdik — darhol
// o'zi qildi. Ekran nomerlari (s1, s2, s3...) aynan shu tartibga mo'ljallangan.
// SARLAVHA -> XUK (nima uchun kerak) -> tushuntirish/mashq navbatma-navbat.
// BAHO YO'Q (metodist qarori): scored maydoni faqat ichki tartib uchun qoladi,
// natija platformaga yuborilmaydi va ekranda ball ko'rsatilmaydi.
const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',   scored: false, scope: 'hook' },     //  1 turnir: nimaga kerak
  { id: 's_recall', type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  2 ko'paytirish jadvali = bo'luvchilar
  { id: 's1',       type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  3 12:3=4 — ikki nom (o'zak)
  { id: 's_tool',   type: 'exploration', template: 'ToolScreen',   scored: false, scope: null },       //  4 USUL 1: ko'rsat, keyin o'zi
  { id: 's6',       type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  5 USUL 2: juftlab qidirish
  { id: 's_solve',  type: 'exploration', template: 'SolveTogether', scored: false, scope: null },      //  6 birga yechamiz: 24
  { id: 's10',      type: 'exploration', template: 'RevealScreen', scored: false, scope: null },       //  7 USUL 3: karralar + langar
  { id: 's3',       type: 'rule',        template: 'RuleScreen',   scored: false, scope: null },       //  8 QOIDA (xukka qaytadi)
  { id: 's_roles',  type: 'test',        template: 'RolesPractice', scored: true,  scope: 'practice' },//  9 rollarni nomlash x3
  { id: 's_check',  type: 'test',        template: 'CheckPractice', scored: true,  scope: 'practice' },// 10 usul 1 amalda x4
  { id: 's9',       type: 'test',        template: 'PickDivisors', scored: true,  scope: 'practice' }, // 11 barcha bo'luvchilar x2
  { id: 's_error',  type: 'test',        template: 'FindError',    scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_grid',   type: 'test',        template: 'GridTask',     scored: true,  scope: 'practice' }, // 13 MASALA: suratlar to'ri
  { id: 's_final',  type: 'test',        template: 'FinalPanel',   scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'custom',       scored: false, scope: null }        // 15 xulosa + uch usul
];

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: {
      ru: 'Турнир: команды по 5 или по 6?',
      uz: "Turnir: beshtadan yoki oltitadan?",
      en: 'A tournament: teams of 5 or teams of 6?'
    },
    lead: {
      ru: 'В школе турнир. Записались 24 участника. Тренер должен разбить их на команды.',
      uz: "Maktabda turnir. 24 ishtirokchi yozildi. Murabbiy ularni komandalarga bo'lishi kerak.",
      en: 'There is a tournament at school. 24 players signed up. The coach has to split them into teams.'
    },
    voice_a: { ru: 'Азиз: делим по 5 в команде.', uz: "Aziz: beshtadan bo'lamiz.", en: 'Aziz: let us make teams of 5.' },
    voice_b: { ru: 'Дилноза: по 6 в команде.', uz: "Dilnoza: oltitadan bo'lamiz.", en: 'Dilnoza: teams of 6.' },
    ask: {
      ru: 'При каком размере команды никто не останется вне игры?',
      uz: "Qaysi holatda hech kim o'yindan tashqarida qolmaydi?",
      en: 'With which team size will nobody be left out of the game?'
    },
    opt_5: { ru: 'По 5 в команде', uz: 'Beshtadan', en: 'Teams of 5' },
    opt_6: { ru: 'По 6 в команде', uz: 'Oltitadan', en: 'Teams of 6' },
    // Хук ПРИНИМАЕТ прогноз и на этом заканчивается (методист 2026-08-14).
    // Обещание «ответ не открываем» — то же, что в остальных уроках класса
    // (движок FractionTheoryLesson): ребёнок должен понимать, что его выбор
    // сейчас не оценивают. Ответ он добывает сам на экране 6, где урок
    // возвращается к тому же числу 24 и спрашивает, делится ли оно на 5.
    // Одна строка, не две: на ноутбучном 1280x800 вторая строка выдавливала
    // варианты под нижнюю панель.
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: "Variantlardan birini bosing. Javobni dars davomida tekshiramiz.",
      en: 'Tap one of the options. We will check the answer during the lesson.'
    },
    audio: {
      intro: {
        // Обещание «ответ проверим по ходу урока» звучит ЗДЕСЬ, до выбора.
        // Реплики на сам выбор нет: она бы прозвучала уже на следующем экране,
        // потому что после ответа хук закрывается сам.
        ru: [
          'В школе турнир. Записались двадцать четыре участника, и тренер должен разбить их на команды.',
          'Азиз предлагает команды по пять человек, Дилноза по шесть. Как ты думаешь, при каком размере никто не останется вне игры? Выбери ответ. Проверим его по ходу урока.'
        ],
        uz: [
          "Maktabda turnir. Yigirma to'rt kishi yozildi va murabbiy ularni komandalarga bo'lishi kerak.",
          "Aziz beshtadan komanda tuzishni taklif qiladi, Dilnoza esa oltitadan. Sizningcha, qaysi holatda hech kim o'yindan tashqarida qolmaydi? Javobni tanlang. Uni dars davomida tekshiramiz."
        ],
        en: [
          'There is a tournament at school. Twenty four players signed up, and the coach has to split them into teams.',
          'Aziz suggests teams of five, Dilnoza suggests teams of six. What do you think, with which size will nobody be left out? Choose an answer. We will check it during the lesson.'
        ]
      }
    }
  },

  // Ekran 07 (2026-08-13 da qo'shildi). Bu SAVOL emas, ASBOB: bola o'z sonini
  // kiritadi, bo'luvchini tanlaydi va o'z ko'zi bilan tekshiradi. To'g'ri javob
  // degan narsa yo'q — bo'linish FAKTI bor. Maket: delitsya-ili-net.html.
  // Ekran 07. Ilgari bola sonni O'ZI terardi (erkin kiritish maydoni) —
  // metodistga aynan shu yoqmadi. 2026-08-13 dan bu yerda 3-sinf, 1-dars naqshi:
  // AVVAL KO'RSATAMIZ, KEYIN O'ZI QILADI. Ko'rsatishda 24 va 6, keyin bolaning
  // navbati: son 25 qat'iy, u faqat bo'luvchini tanlaydi.
  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Делится или нет', uz: "Bo'linadimi yoki yo'q", en: 'Does it divide or not' },
    demo_banner: {
      ru: 'Смотри — покажу на примере',
      uz: "Qarang — misolda ko'rsataman",
      en: 'Watch — I will show an example'
    },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    play_hint: {
      ru: 'Выбери делитель и нажми Проверить',
      uz: "Bo'luvchini tanlang va Tekshirish ni bosing",
      en: 'Choose a divisor and tap Check'
    },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    step_num: { ru: 'Число', uz: 'Son', en: 'Number' },
    step_div: { ru: 'Делитель', uz: "Bo'luvchi", en: 'Divisor' },
    go: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    empty: {
      ru: 'Участники выйдут на площадку после нажатия «Проверить»',
      uz: "Ishtirokchilar Tekshirish bosilgandan keyin maydonga chiqadi",
      en: 'The participants come out after you tap Check'
    },
    note_ok: {
      ru: 'Делится без остатка. {d} — делитель числа {n}, {n} — кратное числа {d}.',
      uz: "Qoldiqsiz bo'linadi. {d} — {n} ning bo'luvchisi, {n} — {d} ning karralisi.",
      en: 'It divides with no remainder. {d} is a divisor of {n}, and {n} is a multiple of {d}.'
    },
    note_no: {
      ru: 'Не делится без остатка. {d} не является делителем числа {n}.',
      uz: "Qoldiqsiz bo'linmaydi. {d} — {n} ning bo'luvchisi emas.",
      en: 'It does not divide without a remainder, so {d} is not a divisor of {n}.'
    },
    shape: { ru: '{a} ряда по {b} участников', uz: '{a} qator, har birida {b} ishtirokchi', en: '{a} rows of {b} participants' },
    task: {
      ru: 'Верного ответа тут нет — есть факт.',
      uz: "Bu yerda to'g'ri javob yo'q — fakt bor.",
      en: 'There is no right answer here, only a fact.'
    },
    audio: {
      intro: {
        ru: 'Сначала покажу сам. Двадцать четыре участника турнира. Проверим, встанут ли они ровно по шесть в ряд.',
        uz: "Avval o'zim ko'rsataman. Turnirning yigirma to'rt ishtirokchisi. Ular oltitadan qatorga tekis turadimi, tekshiramiz.",
        en: 'First let me show you. Twenty four tournament participants. Let us check whether they line up exactly six to a row.'
      },
      demo_done: {
        ru: 'Ряды получились ровные, никто не остался в стороне. Двадцать четыре делится на шесть без остатка. Значит шесть делитель двадцати четырёх, а двадцать четыре кратно шести.',
        uz: "Qatorlar tekis chiqdi, hech kim chetda qolmadi. Yigirma to'rt oltiga qoldiqsiz bo'linadi. Demak olti yigirma to'rtning bo'luvchisi, yigirma to'rt esa oltiga karrali.",
        en: 'The rows came out even and nobody was left aside. Twenty four divides by six with no remainder. So six is a divisor of twenty four, and twenty four is a multiple of six.'
      },
      play_start: {
        ru: 'Теперь ты. На турнир пришёл ещё один, стало двадцать пять. Выбери, по скольку ставить в ряд, и нажми проверить. Смотри не на красоту рядов, а на остаток.',
        uz: "Endi navbat sizniki. Turnirga yana bittasi keldi, yigirma besh bo'ldi. Qatorga nechtadan qo'yishni tanlang va tekshirish tugmasini bosing. Qatorlarning chiroyiga emas, qoldiqqa qarang.",
        en: 'Now it is your turn. One more came to the tournament, so there are twenty five. Choose how many to put in a row and tap check. Look at the remainder, not at how neat the rows are.'
      },
      ok: {
        ru: 'Ряды получились ровные. Значит выбранное число делитель, а двадцать пять ему кратно.',
        uz: "Qatorlar tekis chiqdi. Demak tanlangan son bo'luvchi, yigirma besh esa unga karrali.",
        en: 'The rows came out even. So the number you chose is a divisor, and twenty five is a multiple of it.'
      },
      no: {
        ru: 'Кто-то остался без ряда. Остаток не ноль, значит выбранное число не делитель двадцати пяти.',
        uz: "Kimdir qatorsiz qoldi. Qoldiq nol emas, demak tanlangan son yigirma beshning bo'luvchisi emas.",
        en: 'Someone was left without a row. The remainder is not zero, so the number you chose is not a divisor of twenty five.'
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Один пример — два названия', uz: 'Bitta misol — ikkita nom', en: 'One example, two names' },
    bridge: {
      ru: '12 игроков разошлись на 3 команды: 12 : 3 = 4. Посмотри на рисунок.',
      uz: "12 o'yinchi 3 ta jamoaga bo'lindi: 12 : 3 = 4. Rasmga qarang.",
      en: '12 players split into 3 teams: 12 : 3 = 4. Study the picture.'
    },
    lbl_mult: { ru: '12 — кратное числа 3', uz: "12 — 3 ning karralisi", en: '12 is a multiple of 3' },
    cap_mult: { ru: 'Кратные числа 3:', uz: "3 ga karrali sonlar:", en: 'Multiples of 3:' },
    lbl_div: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi", en: '3 is a divisor of 12' },
    cap_div: { ru: 'Делители числа 12:', uz: "12 ning bo'luvchilari:", en: 'Divisors of 12:' },
    link: {
      ru: '12 делится на 3 без остатка: 12 — кратное числа 3, а 3 — делитель числа 12.',
      uz: "12 soni 3 ga qoldiqsiz bo'linadi: 12 — 3 ning karralisi, 3 esa 12 ning bo'luvchisi.",
      en: '12 divides by 3 with no remainder: 12 is a multiple of 3, and 3 is a divisor of 12.'
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
      ],
      en: ['Look at this example. Twelve divided by three is four. Study the picture.', 'Twelve is a multiple of three. Look at the row of multiples: three, six, nine, twelve, fifteen and on. Twelve stands in that row.', 'And three is a divisor of twelve. Here are the divisors of twelve: one, two, three, four, six, twelve. Three stands here as well.', 'Twelve divides by three with no remainder. That is why twelve is a multiple of three, and three is a divisor of twelve.']
    }
  },

  s2: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    question: { ru: 'Теперь разбери пример сам', uz: "Endi misolni o'zingiz tahlil qiling", en: 'Now work out an example yourself' },
    row_a: { ru: '20 — это … числа 5', uz: "20 — bu 5 sonining …", en: '20 is the … of 5' },
    row_b: { ru: '5 — это … числа 20', uz: "5 — bu 20 sonining …", en: '5 is the … of 20' },
    opt_mult: { ru: 'кратное', uz: 'karralisi', en: 'multiple' },
    opt_div: { ru: 'делитель', uz: "bo'luvchisi", en: 'divisor' },
    correct_text: { ru: 'Верно. 20 : 5 = 4 без остатка. Значит, 20 — кратное числа 5, а 5 — делитель числа 20.', uz: "To'g'ri. 20 : 5 = 4, qoldiq yo'q. Demak, 20 — 5 sonining karralisi, 5 esa 20 sonining bo'luvchisi.", en: 'Correct. 20 : 5 = 4 with no remainder. So 20 is a multiple of 5, and 5 is a divisor of 20.' },
    hint: { ru: 'Проверь деление: 20 делится на 5 без остатка.', uz: "Bo'lishni tekshiring: 20 soni 5 ga qoldiqsiz bo'linadi.", en: 'Check the division: 20 divides by 5 with no remainder.' },
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
      ],
      en: ['20 : 5 = 4 — the division came out even, there is no remainder.', '20 = 5 · 4, so 20 is a multiple of 5.', 'In the same equality 5 is a divisor of 20.']
    },
    audio: {
      intro: { ru: 'Теперь разбери пример сам. Двадцать разделить на пять равно четыре. Подбери название для каждого числа.', uz: "Endi misolni o'zingiz tahlil qiling. Yigirmani beshga bo'lsak, to'rt chiqadi. Har bir songa nom tanlang.", en: 'Now work out an example yourself. Twenty divided by five is four. Choose the right name for each number.' },
      on_correct: { ru: 'Верно. Двадцать кратное пяти, а пять делитель двадцати.', uz: "To'g'ri. Yigirma soni beshning karralisi, besh esa yigirmaning bo'luvchisi.", en: 'Correct. Twenty is a multiple of five, and five is a divisor of twenty.' },
      on_wrong: { ru: 'Не совсем. Посмотри подсказку и попробуй ещё раз.', uz: "Unchalik emas. Maslahatga qarang va yana urinib ko'ring.", en: 'Not quite. Read the hint and try again.' }
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Два названия одного деления', uz: "Bitta bo'lishning ikki nomi", en: 'Two names for one division' },
    rule_1: { ru: 'Если a делится на b без остатка, то b называют делителем числа a.', uz: "Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi.", en: 'If a divides by b with no remainder, then b is called a divisor of a.' },
    rule_2: { ru: 'В том же самом примере a называют кратным числа b.', uz: "Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi.", en: 'In the very same example a is called a multiple of b.' },
    audio: { ru: 'Запомним правило. Если a делится на b без остатка, то b называют делителем числа a. А в том же самом примере a называют кратным числа b. Одно деление, два названия.', uz: "Qoidani eslab qolamiz. Agar a soni b ga qoldiqsiz bo'linsa, b soni a sonining bo'luvchisi deyiladi. Xuddi shu misolning o'zida a soni b sonining karralisi deyiladi. Bitta bo'lish, ikkita nom.", en: 'Let us remember the rule. If a divides by b with no remainder, then b is called a divisor of a. And in the very same example a is called a multiple of b. One division, two names.' }
  },

  // Ekran 06. Ilgari bu STATIK tushuntirish edi: rasm turardi, matn gapirardi.
  // 2026-08-13 dan bu bola o'zi ishlatadigan blok: 12 plitka slayder bilan
  // qatorlarga QAYTA TIZILADI, joy topmaganlar qoldiq zonasiga tushadi.
  // Dizayn metodistning Claude Design maketidan (delimiteli-kratnye.html).
  // {v} — qator soni o'rniga qo'yiladi.
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'А если остаётся лишнее?', uz: 'Ortib qolsa-chi?', en: 'What if something is left over?' },
    rest_label: { ru: 'остаток', uz: 'qoldiq', en: 'remainder' },
    note_ok: {
      ru: 'Разделилось без остатка. {v} — делитель числа 12, 12 — кратное числа {v}.',
      uz: "Qoldiqsiz bo'lindi. {v} — 12 ning bo'luvchisi, 12 — {v} ning karralisi.",
      en: 'It divided with no remainder. {v} is a divisor of 12, and 12 is a multiple of {v}.'
    },
    note_no: {
      ru: 'На {v} не делится без остатка. {v} не является делителем числа 12.',
      uz: "12 soni {v} ga qoldiqsiz bo'linmaydi. {v} — 12 ning bo'luvchisi emas.",
      en: '12 does not divide by {v} without a remainder, so {v} is not a divisor of 12.'
    },
    // Ekran belgilar bilan tugamaydi: ikkala holat ko'rilgach so'z bilan xulosa.
    done: {
      ru: 'Делитель — это число, при котором лишнего не остаётся.',
      uz: "Bo'luvchi — shunday son, unda ortiqcha qolmaydi.",
      en: 'A divisor is a number that leaves nothing over.'
    },
    // Kino replikalari: har qatorga o'z kadri (metodist qarori 2026-08-13).
    // Slayder olib tashlandi, vizual til qoldi: bola tomosha qiladi, keyingi
    // ekranda o'zi qiladi.
    audio: {
      ru: [
        'Возьмём двенадцать плиток. Сейчас разложим их на равные ряды.',
        'На три ряда легло ровно: по четыре в каждом, лишнего нет. Значит три делитель двенадцати.',
        'А теперь на пять рядов. По две в ряду, и две плитки остались лишними. Остаток не ноль, значит пять не делитель двенадцати.',
        'Вот и вся разница. Делитель это то число, при котором лишнего не остаётся.'
      ],
      uz: [
        "O'n ikkita plitka olamiz. Endi ularni teng qatorlarga joylaymiz.",
        "Uch qatorga tekis joylashdi: har birida to'rttadan, ortiqcha yo'q. Demak uch o'n ikkining bo'luvchisi.",
        "Endi besh qatorga. Har qatorda ikkitadan, ikkita plitka ortib qoldi. Qoldiq nolga teng emas, demak besh o'n ikkining bo'luvchisi emas.",
        "Farq shundan. Bo'luvchi — shunday son, unda ortiqcha qolmaydi."
      ],
      en: [
        'Let us take twelve tiles. Now we will arrange them into equal rows.',
        'Three rows came out even: four in each and nothing left over. So three is a divisor of twelve.',
        'And now five rows. Two in each row, and two tiles are left over. The remainder is not zero, so five is not a divisor of twelve.',
        'That is the whole difference. A divisor is a number that leaves nothing over.'
      ]
    }
  },

  s5: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    bridge: { ru: 'Проверим на другом числе.', uz: 'Boshqa sonda tekshiramiz.', en: 'Let us try another number.' },
    question: { ru: '14 разделили на 4 равные части. Что получится?', uz: "14 ni 4 ta teng qismga ajratdik. Nima bo'ladi?", en: '14 was split into 4 equal parts. What comes out?' },
    correctIndex: 0,
    correct_text: { ru: 'Верно. 14 = 4 · 3 + 2: по 3 в каждой части и 2 лишних. Значит, 4 не делитель числа 14.', uz: "To'g'ri. 14 = 4 · 3 + 2: har qismda 3 tadan va 2 tasi ortiqcha. Demak, 4 soni 14 ning bo'luvchisi emas.", en: 'Correct. 14 = 4 · 3 + 2: three in each part and two left over. So 4 is not a divisor of 14.' },
    // wrong_N — ko'rinadigan matn; audio_hint_N — TTS-toza variant (QuestionScreen
    // uni birinchi navbatda oladi). Indekslar shuffleMC dan OLDINGI tartibda.
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
      ],
      en: ['4 · 3 = 12, which is less than 14, so three can go into each part.', '4 · 4 = 16, which is already more than 14, so four in each will not go around.', 'That leaves 14 − 12 = 2. The remainder is not zero, so 4 is not a divisor of 14.']
    },
    audio: {
      intro: { ru: 'Проверим на другом числе. Четырнадцать разложим на четыре равные части. Что получится? Выбери ответ.', uz: "Boshqa sonda tekshiramiz. O'n to'rtni to'rtta teng bo'lakka ajratamiz. Nima bo'ladi? Javobni tanlang.", en: 'Let us try another number. We split fourteen into four equal parts. What comes out? Choose an answer.' },
      on_correct: { ru: 'Верно. Две штуки остались лишними.', uz: "To'g'ri. Ikkitasi ortib qoldi.", en: 'Correct. Two are left over.' },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang.", en: 'Look at the explanation on the right.' }
    }
  },

  // Ekran 09. Ilgari bola sonni O'ZI bosardi (PairsScreen, Claude Design maketi).
  // 2026-08-13 metodist qarori: interaktiv olib tashlanadi, vizual til qoladi —
  // ekran KINOga aylanadi. Har replikaga bitta juftlik: ikki son bir-biriga
  // qarab yuradi, ko'paytmasi chiqadi, ikkalasi qatorga o'tadi. Uchinchi juftlik
  // (uch va to'rt) o'rtada UCHRASHADI — qidirish shu yerda tugaydi.
  s6: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Делители ищем парами', uz: "Bo'luvchilarni juftlab qidiramiz", en: 'Finding divisors in pairs' },
    cap_all: { ru: 'Делители числа 12', uz: "12 ning bo'luvchilari", en: 'Divisors of 12' },
    // Мостик к хуку: те же двенадцать игроков, что и на прошлом экране.
    bridge: {
      ru: 'Те же 12 игроков. Какими равными командами их вообще можно развести?',
      uz: "O'sha 12 o'yinchi. Ularni umuman qanday teng jamoalarga bo'lish mumkin?",
      en: 'The same 12 players. What equal teams can they be split into at all?'
    },
    wait: {
      ru: 'Сейчас пары выедут навстречу друг другу',
      uz: "Hozir juftliklar bir-biriga qarab chiqadi",
      en: 'The pairs are about to move toward each other'
    },
    meet: {
      ru: 'Слева и справа встретились. Дальше пар нет, все делители найдены.',
      uz: "Chap va o'ng uchrashdi. Boshqa juftlik yo'q, barcha bo'luvchilar topildi.",
      en: 'The left and the right have met. There are no more pairs, all divisors are found.'
    },
    // «ТЕПЕРЬ ТЫ» (методист 2026-08-14). Экран объяснения не должен кончаться
    // просмотром: один ход в конце проверяет, что кадр понят. Это НЕ практика,
    // практика идёт в блоке 9-13; тут один вопрос и разбор на каждый ответ.
    now_you: {
      head: { ru: 'Теперь ты', uz: 'Endi siz', en: 'Now you' },
      q: { ru: 'Возьмём число 20. Какое число в паре с 2?', uz: '20 sonini olaylik. 2 bilan juftlikda qaysi son?', en: 'Take the number 20. Which number pairs with 2?' },
      opts: { ru: ['10', '18', '5'], uz: ['10', '18', '5'], en: ['10', '18', '5'] },
      correct: 0,
      correct_text: { ru: 'Верно. 2 · 10 = 20, значит 2 и 10 — пара делителей.', uz: "To'g'ri. 2 · 10 = 20, demak 2 va 10 — bo'luvchilar juftligi.", en: 'Correct. 2 · 10 = 20, so 2 and 10 are a pair of divisors.' },
      correct_audio: { ru: 'Верно. Два умножить на десять двадцать, значит два и десять пара делителей.', uz: "To'g'ri. Ikki karra o'n yigirma, demak ikki va o'n bo'luvchilar juftligi.", en: 'Correct. Two times ten is twenty, so two and ten are a pair of divisors.' },
      wrong: [
        null,
        { ru: '18 — это 20 минус 2. Пара ищется умножением, а не вычитанием.', uz: "18 — bu 20 minus 2. Juftlik ko'paytirish bilan qidiriladi, ayirish bilan emas.", en: '18 is 20 minus 2. A pair is found by multiplying, not subtracting.' },
        { ru: '5 — пара четвёрки: 4 · 5 = 20. У двойки пара другая.', uz: "5 — to'rtning jufti: 4 · 5 = 20. Ikkining jufti boshqa.", en: '5 is the partner of four: 4 · 5 = 20. Two has a different partner.' }
      ],
      wrong_audio: [
        null,
        { ru: 'Восемнадцать это двадцать минус два. Пара ищется умножением, а не вычитанием.', uz: "O'n sakkiz bu yigirma minus ikki. Juftlik ko'paytirish bilan qidiriladi, ayirish bilan emas.", en: 'Eighteen is twenty minus two. A pair is found by multiplying, not subtracting.' },
        { ru: 'Пять это пара четвёрки. Четыре умножить на пять двадцать. У двойки пара другая.', uz: "Besh bu to'rtning jufti. To'rt karra besh yigirma. Ikkining jufti boshqa.", en: 'Five is the partner of four. Four times five is twenty. Two has a different partner.' }
      ]
    },
    fact: {
      ru: 'Товары часто считают дюжинами — по 12 штук. Число 12 удобно тем, что делится на 2, 3, 4 и 6, поэтому дюжину легко разделить поровну.',
      uz: "Tovarlar ko'pincha dyujina bilan — 12 tadan sanaladi. 12 soni 2, 3, 4 va 6 ga bo'lingani uchun qulay: dyujinani teng bo'lish oson.",
      en: 'Goods are often counted in dozens, 12 at a time. The number 12 is handy because it divides by 2, 3, 4 and 6, so a dozen is easy to share equally.'
    },
    fact_audio: {
      ru: 'Знаешь ли ты? Товары часто считают дюжинами, по двенадцать штук. Двенадцать удобно тем, что делится на два, три, четыре и шесть, поэтому дюжину легко разделить поровну.',
      uz: "Bilasizmi? Tovarlar ko'pincha dyujina bilan, o'n ikkitadan sanaladi. O'n ikki soni ikki, uch, to'rt va oltiga bo'lingani uchun qulay, shuning uchun dyujinani teng bo'lish oson.",
      en: 'Did you know? Goods are often counted in dozens, twelve at a time. Twelve is handy because it divides by two, three, four and six, so a dozen is easy to share equally.'
    },
    // Kino replikalari: bitta replika — bitta juftlik (metodist qarori 2026-08-13).
    audio: {
      ru: [
        'Делители удобно искать парами. Смотри, как два числа выезжают навстречу друг другу.',
        'Первая пара. Слева один, справа двенадцать. Один умножить на двенадцать это двенадцать. Значит и один, и двенадцать делители. Оба уходят в ряд.',
        'Вторая пара. Два и шесть. Два умножить на шесть это тоже двенадцать. Значит два и шесть тоже делители.',
        'Третья пара. Три умножить на четыре снова двенадцать. Смотри, три и четыре встретились в середине. Слева и справа сошлись, дальше пар нет. Все делители двенадцати найдены.'
      ],
      uz: [
        "Bo'luvchilarni juftlab qidirish qulay. Ikkita son bir-biriga qarab qanday yurishini kuzating.",
        "Birinchi juftlik. Chapda bir, o'ngda o'n ikki. Bir karra o'n ikki bu o'n ikki. Demak bir ham, o'n ikki ham bo'luvchi. Ikkalasi qatorga o'tadi.",
        "Ikkinchi juftlik. Ikki va olti. Ikki karra olti ham o'n ikki. Demak ikki va olti ham bo'luvchi.",
        "Uchinchi juftlik. Uch karra to'rt yana o'n ikki. Qarang, uch va to'rt o'rtada uchrashdi. Chap va o'ng tutashdi, boshqa juftlik yo'q. O'n ikkining barcha bo'luvchilari topildi."
      ],
      en: [
        'Divisors are easy to find in pairs. Watch how two numbers move toward each other.',
        'The first pair. One on the left, twelve on the right. One times twelve is twelve. So both one and twelve are divisors. Both of them move into the row.',
        'The second pair. Two and six. Two times six is twelve as well. So two and six are divisors too.',
        'The third pair. Three times four is twelve again. Look, three and four met in the middle. The left and the right have come together, there are no more pairs. All divisors of twelve are found.'
      ]
    }
  },

  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    label: { ru: 'выбираем делители', uz: "bo'luvchilarni tanlaymiz", en: 'choosing divisors' },
    context: { ru: 'Нажимай на подходящие числа в ряду.', uz: "Qatordan mos sonlarni bosing.", en: 'Tap the numbers in the row that fit.' },
    question: { ru: 'Выбери все делители числа 18', uz: "18 sonining barcha bo'luvchilarini tanlang", en: 'Choose all the divisors of 18' },
    numbers: ['1', '2', '3', '4', '5', '6', '9', '12', '18'],
    divisors: ['1', '2', '3', '6', '9', '18'],
    correct_text: { ru: 'Верно: 1, 2, 3, 6, 9, 18 — всего 6 делителей.', uz: "To'g'ri: 1, 2, 3, 6, 9, 18 — jami 6 ta bo'luvchi.", en: 'Correct: 1, 2, 3, 6, 9, 18 — six divisors in all.' },
    hint: { ru: 'Иди парами: 1 и 18, 2 и 9, 3 и 6. Каждая пара даёт два делителя.', uz: "Juftlab yuring: 1 va 18, 2 va 9, 3 va 6. Har juftlik ikkita bo'luvchi beradi.", en: 'Go in pairs: 1 and 18, 2 and 9, 3 and 6. Each pair gives two divisors.' },
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
      ],
      en: ['1 · 18 = 18 — the first pair: 1 and 18.', '2 · 9 = 18 — the second pair: 2 and 9.', '3 · 6 = 18 — the third pair: 3 and 6.', 'After that the pairs start repeating. Three pairs give 6 divisors.']
    },
    fact: { ru: 'Час поделили на 60 минут не случайно: у числа 60 целых 12 делителей, поэтому час удобно делить на 2, 3, 4, 5, 6 и даже 12 частей.', uz: "Soat 60 daqiqaga bejiz bo'linmagan: 60 sonining 12 ta bo'luvchisi bor, shuning uchun soatni 2, 3, 4, 5, 6 va hatto 12 bo'lakka bo'lish qulay.", en: 'An hour was split into 60 minutes for a reason: the number 60 has as many as 12 divisors, so an hour is easy to split into 2, 3, 4, 5, 6 and even 12 parts.' },
    fact_audio: { ru: 'Знаешь ли ты? Час поделили на шестьдесят минут не случайно. У числа шестьдесят целых двенадцать делителей, поэтому час удобно делить на две, три, четыре, пять, шесть и даже двенадцать частей.', uz: "Bilasizmi? Soat oltmish daqiqaga bejiz bo'linmagan. Oltmish sonining o'n ikkita bo'luvchisi bor, shuning uchun soatni ikki, uch, to'rt, besh, olti va hatto o'n ikki bo'lakka bo'lish qulay.", en: 'Did you know? An hour was split into sixty minutes for a reason. The number sixty has as many as twelve divisors, so an hour is easy to split into two, three, four, five, six and even twelve parts.' },
    audio: {
      intro: { ru: 'Выбери все делители числа восемнадцать. Нажимай на подходящие числа в ряду, потом нажми проверить.', uz: "O'n sakkiz sonining barcha bo'luvchilarini tanlang. Qatordan mos sonlarni bosing, so'ng tekshirishni bosing.", en: 'Choose all the divisors of eighteen. Tap the numbers in the row that fit, then tap check.' },
      on_correct: { ru: 'Верно, шесть делителей.', uz: "To'g'ri, oltita bo'luvchi.", en: 'Correct, six divisors.' },
      on_wrong: { ru: 'Не всё. Посмотри подсказку и продолжай.', uz: "Hammasi emas. Maslahatga qarang va davom eting.", en: 'Not all of them. Read the hint and carry on.' }
    }
  },

  // Ekran 12. Ilgari ikki qator CHIQIB kelardi va matn farqni AYTARDI.
  // 2026-08-13 dan bola belgini o'zi suradi: yuqoridagi chiziq karrali sonda
  // ushlab turadi va cheksiz davom etadi, pastdagisi bo'luvchi bo'lmagan sonda
  // CHETGA CHIQARIB TASHLAYDI va 12 dan keyin DEVORGA urilib tugaydi.
  // Dizayn metodistning maketidan (kratnye-i-deliteli.html).
  s10: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Бесконечно и конечно', uz: 'Cheksiz va sanoqli', en: 'Endless and countable' },
    cap_mult: { ru: 'Кратные числа 3', uz: '3 ga karrali sonlar', en: 'Multiples of 3' },
    cap_div: { ru: 'Делители числа 12', uz: "12 ning bo'luvchilari", en: 'Divisors of 12' },
    // Слово «тяни» ушло вместе с перетаскиванием: экран стал фильмом, ребёнок
    // ничего не двигает — прямая едет сама.
    cap_a_done: {
      ru: 'Как далеко ни уехать, следующее кратное всегда есть. Их бесконечно много.',
      uz: "Qancha uzoqqa borilmasin, keyingi karrali son doim bor. Ular cheksiz ko'p.",
      en: 'However far the line runs on, the next multiple is always there. There are infinitely many.'
    },
    cap_b_done: { ru: 'Делителей ровно шесть.', uz: "Bo'luvchilar roppa rosa oltita.", en: 'There are exactly six divisors.' },
    metro: { ru: 'Игры на турнире начинаются каждые 6 минут: 8:00, 8:06, 8:12 — это кратные шести.', uz: "Turnirda o'yinlar har 6 daqiqada boshlanadi: 8:00, 8:06, 8:12 — bular oltiga karrali.", en: 'Tournament games start every 6 minutes: 8:00, 8:06, 8:12 — these are multiples of six.' },
    // «ТЕПЕРЬ ТЫ» (методист 2026-08-14). Экран объяснения не должен кончаться
    // просмотром: один ход в конце проверяет, что кадр понят. Это НЕ практика,
    // практика идёт в блоке 9-13; тут один вопрос и разбор на каждый ответ.
    now_you: {
      head: { ru: 'Теперь ты', uz: 'Endi siz', en: 'Now you' },
      q: { ru: 'Кратные трёх: 3, 6, 9, 12, 15, 18. Какое следующее?', uz: "Uchning karralilari: 3, 6, 9, 12, 15, 18. Keyingisi qaysi?", en: 'Multiples of three: 3, 6, 9, 12, 15, 18. Which comes next?' },
      opts: { ru: ['20', '21', '24'], uz: ['20', '21', '24'], en: ['20', '21', '24'] },
      correct: 1,
      correct_text: { ru: 'Верно. 3 · 7 = 21. Кратные идут через три.', uz: "To'g'ri. 3 · 7 = 21. Karralilar uchtadan yuradi.", en: 'Correct. 3 · 7 = 21. The multiples go three apart.' },
      correct_audio: { ru: 'Верно. Три умножить на семь двадцать один. Кратные идут через три.', uz: "To'g'ri. Uch karra yetti yigirma bir. Karralilar uchtadan yuradi.", en: 'Correct. Three times seven is twenty one. The multiples go three apart.' },
      wrong: [
        { ru: '20 на 3 не делится: 20 : 3 = 6 и 2 в остатке.', uz: "20 soni 3 ga bo'linmaydi: 20 : 3 = 6, qoldiq 2.", en: '20 does not divide by 3: 20 : 3 = 6 with 2 left over.' },
        null,
        { ru: '24 кратно трём, но до него есть 21. Кратные идут через три.', uz: "24 uchga karrali, lekin undan oldin 21 bor. Karralilar uchtadan yuradi.", en: '24 is a multiple of three, but 21 comes before it. The multiples go three apart.' }
      ],
      wrong_audio: [
        { ru: 'Двадцать на три не делится. Двадцать разделить на три это шесть и два в остатке.', uz: "Yigirma uchga bo'linmaydi. Yigirmani uchga bo'lsak olti va ikki qoldiq.", en: 'Twenty does not divide by three. Twenty divided by three is six with two left over.' },
        null,
        { ru: 'Двадцать четыре кратно трём, но до него есть двадцать один. Кратные идут через три.', uz: "Yigirma to'rt uchga karrali, lekin undan oldin yigirma bir bor. Karralilar uchtadan yuradi.", en: 'Twenty four is a multiple of three, but twenty one comes before it. The multiples go three apart.' }
      ]
    },
    final: {
      ru: 'Кратных бесконечно много, делителей — конечное число.',
      uz: "Karrali sonlar cheksiz ko'p, bo'luvchilar esa sanoqli.",
      en: 'There are infinitely many multiples, but only a finite number of divisors.'
    },
    // Kino replikalari: bitta replika — bitta chiziq (metodist qarori 2026-08-13).
    audio: {
      ru: [
        'Здесь две прямые. На верхней стоят кратные числа три, на нижней делители числа двенадцать. Смотри, чем они отличаются.',
        'Метка идёт по кратным трёх: три, шесть, девять, двенадцать, пятнадцать, восемнадцать. Прямая едет дальше, и следующее кратное всегда находится. Кратных бесконечно много.',
        'Теперь делители двенадцати: один, два, три, четыре, шесть, двенадцать. Дальше прямая упирается в стену. Делителей ровно шесть, и новых уже не появится.',
        'Вот главное отличие. Кратных у числа бесконечно много, а делителей конечное число.'
      ],
      uz: [
        "Bu yerda ikkita chiziq. Yuqorigisida uchga karrali sonlar, pastkisida o'n ikkining bo'luvchilari turibdi. Ular nimasi bilan farq qilishini kuzating.",
        "Belgi uchning karralilari bo'ylab yuradi: uch, olti, to'qqiz, o'n ikki, o'n besh, o'n sakkiz. Chiziq oldinga suriladi va keyingi karrali son doim topiladi. Karrali sonlar cheksiz ko'p.",
        "Endi o'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti, o'n ikki. Keyin chiziq devorga urilib to'xtaydi. Bo'luvchilar roppa rosa oltita, yangisi paydo bo'lmaydi.",
        "Mana asosiy farq. Songa karrali sonlar cheksiz ko'p, bo'luvchilari esa sanoqli."
      ],
      en: [
        'Here are two lines. The top one carries the multiples of three, the bottom one the divisors of twelve. Watch how they differ.',
        'The marker walks along the multiples of three: three, six, nine, twelve, fifteen, eighteen. The line keeps rolling on, and the next multiple is always there. There are infinitely many multiples.',
        'Now the divisors of twelve: one, two, three, four, six, twelve. After that the line hits a wall. There are exactly six divisors, and no new ones will appear.',
        'Here is the main difference. A number has infinitely many multiples but only a finite number of divisors.'
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Собери делители', uz: "Bo'luvchilarni yig'ing", en: 'Collect the divisors' },
    lead: { ru: 'Для каждого числа выбери из списка полный набор его делителей.', uz: "Har bir son uchun ro'yxatdan uning to'liq bo'luvchilar to'plamini tanlang.", en: 'For each number choose the full set of its divisors from the list.' },
    pairs: [
      { number: '10', label: { ru: 'делители', uz: "bo'luvchilari", en: 'divisors' }, reading: { ru: '1, 2, 5, 10', uz: '1, 2, 5, 10', en: '1, 2, 5, 10' } },
      { number: '15', label: { ru: 'делители', uz: "bo'luvchilari", en: 'divisors' }, reading: { ru: '1, 3, 5, 15', uz: '1, 3, 5, 15', en: '1, 3, 5, 15' } },
      { number: '16', label: { ru: 'делители', uz: "bo'luvchilari", en: 'divisors' }, reading: { ru: '1, 2, 4, 8, 16', uz: '1, 2, 4, 8, 16', en: '1, 2, 4, 8, 16' } }
    ],
    correct_text: { ru: 'Верно. Обрати внимание: у 16 делителей нечётное количество, потому что 16 = 4 · 4.', uz: "To'g'ri. E'tibor bering: 16 da bo'luvchilar soni toq, chunki 16 = 4 · 4.", en: 'Correct. Notice that 16 has an odd number of divisors, because 16 = 4 · 4.' },
    hint: { ru: 'Проверяй по порядку: делится ли число на 1, на 2, на 3, на 4 и так далее.', uz: "Tartib bilan tekshiring: son 1 ga, 2 ga, 3 ga, 4 ga va hokazo bo'linadimi.", en: 'Check in order: does the number divide by 1, by 2, by 3, by 4 and so on.' },
    // hint ekranda raqam bilan turadi, ovozga esa audio_hint ketadi (DragMatch/Classify).
    audio_hint: { ru: 'Проверяй по порядку. Делится ли число на один, на два, на три, на четыре и так далее.', uz: "Tartib bilan tekshiring. Son birga, ikkiga, uchga, to'rtga va hokazo bo'linadimi.", en: 'Check in order. Does the number divide by one, by two, by three, by four and so on.' },
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
      ],
      en: ['10 = 1 · 10 = 2 · 5 — two pairs, so 4 divisors.', '15 = 1 · 15 = 3 · 5 — two pairs as well, 4 divisors.', '16 = 1 · 16 = 2 · 8 = 4 · 4 — here 4 pairs with itself, so there are 5 divisors, not 6.']
    },
    audio: {
      intro: { ru: 'Для каждого числа выбери полный набор делителей. Нажми на число, потом выбери набор из списка.', uz: "Har bir son uchun to'liq bo'luvchilar to'plamini tanlang. Songa bosing, so'ng ro'yxatdan to'plamni tanlang.", en: 'For each number choose the full set of divisors. Tap a number, then choose a set from the list.' },
      on_correct: { ru: 'Верно, все наборы на местах.', uz: "To'g'ri, barcha to'plamlar o'z o'rniga tushdi.", en: 'Correct, every set is in place.' },
      on_wrong: { ru: 'Проверь ещё раз.', uz: 'Yana bir bor tekshiring.', en: 'Check again.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Делитель 6 или кратное 6?', uz: "6 ning bo'luvchisimi yoki 6 ga karralimi?", en: 'A divisor of 6 or a multiple of 6?' },
    lead: { ru: 'Делитель не больше самого числа, кратное — не меньше.', uz: "Bo'luvchi sondan katta emas, karrali son esa kichik emas.", en: 'A divisor is not larger than the number itself, a multiple is not smaller.' },
    bin_a: { ru: 'Делитель 6', uz: "6 ning bo'luvchisi", en: 'Divisor of 6' },
    bin_b: { ru: 'Кратное 6', uz: "6 ga karrali", en: 'Multiple of 6' },
    cards: [
      { label: '1', bin: 'a' },
      { label: '2', bin: 'a' },
      { label: '3', bin: 'a' },
      { label: '12', bin: 'b' },
      { label: '18', bin: 'b' },
      { label: '24', bin: 'b' }
    ],
    hint: { ru: 'Спроси себя: это 6 делится на данное число, или данное число делится на 6?', uz: "O'zingizdan so'rang: 6 shu songa bo'linadimi, yoki shu son 6 ga bo'linadimi?", en: 'Ask yourself: does 6 divide by this number, or does this number divide by 6?' },
    audio_hint: { ru: 'Спроси себя. Это шесть делится на данное число, или данное число делится на шесть?', uz: "O'zingizdan so'rang. Olti shu songa bo'linadimi, yoki shu son oltiga bo'linadimi?", en: 'Ask yourself. Does six divide by this number, or does this number divide by six?' },
    correct_text: { ru: 'Точно. Из данных чисел 1, 2 и 3 — делители числа 6, а 12, 18 и 24 — кратные числа 6.', uz: "Aniq. Berilgan sonlardan 1, 2 va 3 — 6 ning bo'luvchilari, 12, 18 va 24 esa 6 ga karrali sonlar.", en: 'Exactly. Of these numbers 1, 2 and 3 are divisors of 6, while 12, 18 and 24 are multiples of 6.' },
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
      ],
      en: ['Among these numbers the divisors are the ones 6 divides by: 6 : 1, 6 : 2, 6 : 3.', 'A multiple is a number that divides by 6: 12 : 6, 18 : 6, 24 : 6.', 'So in this task 1, 2, 3 go to the divisors, and 12, 18, 24 go to the multiples.']
    },
    audio: {
      intro: { ru: 'Разбери числа на две группы. Делитель шести или кратное шести?', uz: "Sonlarni ikki guruhga ajrating. Oltining bo'luvchisimi yoki oltiga karralimi?", en: 'Sort the numbers into two groups. A divisor of six or a multiple of six?' },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда.', uz: 'Bu yerga emas.', en: 'Not here.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni', en: 'The end of the lesson' },
    label: { ru: 'финальная задача', uz: 'yakuniy masala', en: 'final task' },
    context: { ru: 'Ищи парами и нажимай на подходящие числа.', uz: "Juftlab qidiring va mos sonlarni bosing.", en: 'Look in pairs and tap the numbers that fit.' },
    question: { ru: 'Выбери все делители числа 36', uz: "36 sonining barcha bo'luvchilarini tanlang", en: 'Choose all the divisors of 36' },
    numbers: ['1', '2', '3', '4', '5', '6', '8', '9', '12', '18', '24', '36'],
    divisors: ['1', '2', '3', '4', '6', '9', '12', '18', '36'],
    correct_text: { ru: 'Верно: 1, 2, 3, 4, 6, 9, 12, 18, 36 — всего 9. Число нечётное, потому что 36 = 6 · 6.', uz: "To'g'ri: 1, 2, 3, 4, 6, 9, 12, 18, 36 — jami 9 ta. Soni toq, chunki 36 = 6 · 6.", en: 'Correct: 1, 2, 3, 4, 6, 9, 12, 18, 36 — nine in all. The count is odd, because 36 = 6 · 6.' },
    hint: { ru: 'Ищи парами: 1 и 36, 2 и 18, 3 и 12, 4 и 9. А 6 идёт в паре сам с собой.', uz: "Juftlab qidiring: 1 va 36, 2 va 18, 3 va 12, 4 va 9. 6 esa o'zi bilan o'zi juft bo'ladi.", en: 'Look in pairs: 1 and 36, 2 and 18, 3 and 12, 4 and 9. And 6 pairs with itself.' },
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
      ],
      en: ['1 · 36, 2 · 18, 3 · 12, 4 · 9 — four pairs, that is already 8 divisors.', '6 · 6 = 36 — both factors are the same here, so 6 counts once.', 'Nine divisors in all. Squares always have an odd number of divisors.']
    },
    fact: { ru: 'Если число — квадрат, один делитель встаёт в пару сам с собой: 6 · 6 = 36. Поэтому у квадратов делителей нечётное количество.', uz: "Agar son kvadrat bo'lsa, bitta bo'luvchi o'zi bilan o'zi juft bo'ladi: 6 · 6 = 36. Shuning uchun kvadratlarda bo'luvchilar soni toq.", en: 'If a number is a square, one divisor pairs with itself: 6 · 6 = 36. That is why squares have an odd number of divisors.' },
    fact_audio: { ru: 'Знаешь ли ты? Если число квадрат, один делитель встаёт в пару сам с собой, шесть на шесть тридцать шесть. Поэтому у квадратов количество делителей нечётное.', uz: "Bilasizmi? Agar son kvadrat bo'lsa, bitta bo'luvchi o'zi bilan o'zi juft bo'ladi, olti karra olti o'ttiz olti. Shuning uchun kvadratlarda bo'luvchilar soni toq.", en: 'Did you know? If a number is a square, one divisor pairs with itself, six times six is thirty six. That is why squares have an odd number of divisors.' },
    audio: {
      intro: { ru: 'Финальная задача. Выбери все делители числа тридцать шесть. Ищи парами и нажимай на подходящие числа.', uz: "Yakuniy masala. O'ttiz olti sonining barcha bo'luvchilarini tanlang. Juftlab qidiring va mos sonlarni bosing.", en: 'Final task. Choose all the divisors of thirty six. Look in pairs and tap the numbers that fit.' },
      on_correct: { ru: 'Верно, девять делителей.', uz: "To'g'ri, to'qqizta bo'luvchi.", en: 'Correct, nine divisors.' },
      on_wrong: { ru: 'Не всё. Посмотри подсказку и продолжай.', uz: "Hammasi emas. Maslahatga qarang va davom eting.", en: 'Not all of them. Read the hint and carry on.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    heading: { ru: 'Делители и кратные', uz: "Bo'luvchilar va karrali sonlar", en: 'Divisors and multiples' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    banner: { ru: 'Математика · Делимость', uz: 'Matematika · Bo\'linish', en: 'Mathematics · Divisibility' },
    // Итог 2026-08-13: текста меньше, три карточки одного размера.
    // Длинные формулировки правила остаются на экране 8, тут только суть.
    brief_1: { ru: 'a : b без остатка → b делитель, a кратное', uz: "a : b qoldiqsiz → b bo'luvchi, a karrali", en: 'a : b with no remainder → b divisor, a multiple' },
    brief_2: { ru: '1 и само число — делители всегда', uz: "1 va sonning o'zi — doim bo'luvchi", en: '1 and the number itself are always divisors' },
    brief_3: { ru: 'кратных бесконечно, делителей конечно', uz: "karralilar cheksiz, bo'luvchilar sanoqli", en: 'multiples endless, divisors countable' },
    // Metodist 2026-08-13: ilgari 01 va 02 bir xil gapni so'zlari joyi
    // almashtirilgan holda takrorlardi — bola ikkinchisida YANGI fikr ko'rmasdi.
    // Endi simmetriya BITTA qatorda, keyingi ikki band esa AJRALGAN faktlar.
    // «Ikki xil o'qiladi» degan gap O'ZI ikki o'qishni KO'RSATISHI kerak edi:
    // ilgari faqat va'da qilingan, misol esa izohsiz turgan.
    read_label: { ru: 'Два прочтения одного примера', uz: "Bitta misolning ikki o'qilishi", en: 'Two readings of one example' },
    read_a: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi", en: '3 is a divisor of 12' },
    read_b: { ru: '12 — кратное числа 3', uz: '12 — 3 ning karralisi', en: '12 is a multiple of 3' },
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
      ],
      en: ['The lesson is done. Let us gather the main points.', 'If a divides by b with no remainder, then b is a divisor of a, and a is a multiple of b. One and the same division gives both names.', 'Every number has one and itself as divisors. There are infinitely many multiples, but a finite number of divisors. Next we will work through the divisibility rules for two, five and ten.']
    }
  },

  // ============================================================
  // v4 (metodist qarori 2026-08-13): dars 15 ekranga qayta yig'ildi,
  // 3-sinf 1-darsining karkasi bo'yicha. Yangi o'zak — UCHTA USUL:
  // 1) bitta sonni tekshirish, 2) barcha bo'luvchilarni juftlab topish,
  // 3) karrali sonlarni ko'paytirish orqali hosil qilish.
  // Usul ekranda NOMLANADI va QADAMLAB yoziladi: ilgari u faqat xato
  // qilgan bolaga ishora sifatida ko'rinardi, ya'ni usulga o'rgatilmasdi.
  // ============================================================

  // Ekran 2 — ESLAYMIZ. Ko'paytirish jadvali tayyor bo'luvchilar ro'yxati.
  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Ты это уже знаешь', uz: 'Buni siz allaqachon bilasiz', en: 'You already know this' },
    lead: { ru: '3 команды по 4 игрока — это 12 участников.', uz: "4 nafardan 3 jamoa — bu 12 ishtirokchi.", en: '3 teams of 4 players make 12 participants.' },
    lbl_div: { ru: 'делители', uz: "bo'luvchilar", en: 'divisors' },
    lbl_mul: { ru: 'кратное', uz: 'karralisi', en: 'multiple' },
    div_a: { ru: '3 — делитель числа 12', uz: "3 — 12 ning bo'luvchisi", en: '3 is a divisor of 12' },
    div_b: { ru: '4 — делитель числа 12', uz: "4 — 12 ning bo'luvchisi", en: '4 is a divisor of 12' },
    mul_a: { ru: '12 — кратное числа 3', uz: "12 — 3 ning karralisi", en: '12 is a multiple of 3' },
    mul_b: { ru: '12 — кратное числа 4', uz: "12 — 4 ning karralisi", en: '12 is a multiple of 4' },
    // «ТЕПЕРЬ ТЫ» (методист 2026-08-14). Экран объяснения не должен кончаться
    // просмотром: один ход в конце проверяет, что кадр понят. Это НЕ практика,
    // практика идёт в блоке 9-13; тут один вопрос и разбор на каждый ответ.
    now_you: {
      head: { ru: 'Теперь ты', uz: 'Endi siz', en: 'Now you' },
      q: { ru: '5 · 4 = 20. Кто здесь делители?', uz: '5 · 4 = 20. Bu yerda bo\'luvchilar qaysilari?', en: '5 · 4 = 20. Which are the divisors here?' },
      opts: { ru: ['5 и 4', '20 и 4', 'только 20'], uz: ['5 va 4', '20 va 4', "faqat 20"], en: ['5 and 4', '20 and 4', 'only 20'] },
      correct: 0,
      correct_text: { ru: 'Верно. 20 получилось из 5 и 4, значит они делители, а 20 — кратное.', uz: "To'g'ri. 20 soni 5 va 4 dan chiqdi, demak ular bo'luvchi, 20 esa karrali.", en: 'Correct. 20 came from 5 and 4, so they are divisors and 20 is the multiple.' },
      correct_audio: { ru: 'Верно. Двадцать получилось из пятёрки и четвёрки, значит они делители, а двадцать кратное.', uz: "To'g'ri. Yigirma besh va to'rtdan chiqdi, demak ular bo'luvchi, yigirma esa karrali.", en: 'Correct. Twenty came from five and four, so they are divisors and twenty is the multiple.' },
      wrong: [
        null,
        { ru: '20 — это то, что получилось. Оно кратное. Делители — то, из чего оно получилось.', uz: "20 — bu chiqqan natija. U karrali. Bo'luvchilar esa nimadan chiqqani.", en: '20 is what came out. It is the multiple. The divisors are what it came from.' },
        { ru: '20 — результат. Делители стоят слева от знака равно, и их два.', uz: "20 — natija. Bo'luvchilar teng belgisidan chapda turadi va ular ikkita.", en: '20 is the result. The divisors stand left of the equals sign, and there are two.' }
      ],
      wrong_audio: [
        null,
        { ru: 'Двадцать это то, что получилось, оно кратное. Делители это то, из чего оно получилось.', uz: "Yigirma bu chiqqan natija, u karrali. Bo'luvchilar esa nimadan chiqqani.", en: 'Twenty is what came out, it is the multiple. The divisors are what it came from.' },
        { ru: 'Двадцать это результат. Делители стоят слева от знака равно, и их два.', uz: "Yigirma bu natija. Bo'luvchilar teng belgisidan chapda turadi va ular ikkita.", en: 'Twenty is the result. The divisors stand left of the equals sign, and there are two.' }
      ]
    },
    note: {
      ru: 'Таблица умножения — готовый список делителей.',
      uz: "Ko'paytirish jadvali — tayyor bo'luvchilar ro'yxati.",
      en: 'The times table is a ready list of divisors.'
    },
    audio: {
      ru: [
        'Вернёмся к турниру. Три команды по четыре игрока это двенадцать участников. Трижды четыре двенадцать, и ты это знаешь давно.',
        'А теперь новое, и только одно. Раз двенадцать получилось из тройки и четвёрки, значит тройка и четвёрка называются делителями двенадцати.',
        'И обратно. Двенадцать называется кратным тройки и кратным четвёрки.',
        'Получается, таблица умножения, которую ты давно выучил, это готовый список делителей. Новую тему ты наполовину уже знаешь.'
      ],
      uz: [
        "Turnirga qaytamiz. To'rt nafardan uchta jamoa bu o'n ikki ishtirokchi. Uch karra to'rt o'n ikki, buni siz ancha oldin bilasiz.",
        "Endi yangisi, faqat bitta. O'n ikki uch va to'rtdan chiqdi, demak uch va to'rt o'n ikkining bo'luvchilari deyiladi.",
        "Teskarisi ham shunday. O'n ikki uchning karralisi va to'rtning karralisi deyiladi.",
        "Demak, siz ancha oldin yodlagan ko'paytirish jadvali tayyor bo'luvchilar ro'yxati ekan. Yangi mavzuning yarmini siz allaqachon bilasiz."
      ],
      en: [
        'Back to the tournament. Three teams of four players make twelve participants. Three times four is twelve, and you have known that for a long time.',
        'Now the new part, and there is only one. Since twelve came from three and four, three and four are called divisors of twelve.',
        'And the other way round. Twelve is called a multiple of three and a multiple of four.',
        'So the times table you learned long ago is a ready list of divisors. You already know half of this topic.'
      ]
    }
  },

  // Uchta usulning KARTOCHKASI. Matn bitta joyda turadi: usul uch ekranda
  // eslatiladi (4, 5, 7) va yakunda takrorlanadi (15).
  s_methods: {
    m1_title: { ru: 'Способ 1. Проверить одно число', uz: '1-usul. Bitta sonni tekshirish', en: 'Method 1. Check one number' },
    m1_steps: {
      ru: ['Раздели', 'Посмотри остаток', 'Остаток 0 — делится'],
      uz: ["Bo'ling", 'Qoldiqqa qarang', "Qoldiq 0 — bo'linadi"],
      en: ['Divide', 'Look at the remainder', 'Remainder 0 means it divides']
    },
    m1_no: { ru: 'Остаток не 0 — не делится', uz: "Qoldiq 0 emas — bo'linmaydi", en: 'A remainder that is not 0 means it does not' },
    m2_title: { ru: 'Способ 2. Найти все делители', uz: "2-usul. Barcha bo'luvchilarni topish", en: 'Method 2. Find every divisor' },
    m2_steps: {
      ru: [
        'Пиши 1 и само число — эта пара есть всегда',
        'Пробуй 2, 3, 4 и дальше по порядку',
        'Разделилось — пиши оба числа пары',
        'Стоп, когда левое встретило правое'
      ],
      uz: [
        "1 va sonning o'zini yozing — bu juftlik doim bor",
        '2, 3, 4 va keyingilarini tartib bilan sinang',
        "Bo'lindi — juftlikning ikkala sonini yozing",
        "Chap o'ngga yetganda to'xtang"
      ],
      en: [
        'Write 1 and the number itself, this pair is always there',
        'Try 2, 3, 4 and on in order',
        'If it divides, write both numbers of the pair',
        'Stop when the left one meets the right one'
      ]
    },
    m3_title: { ru: 'Способ 3. Получить кратные', uz: '3-usul. Karrali sonlarni hosil qilish', en: 'Method 3. Get the multiples' },
    m3_steps: {
      ru: ['Умножай число на 1, 2, 3 и дальше'],
      uz: ["Sonni 1, 2, 3 va keyingilariga ko'paytiring"],
      en: ['Multiply the number by 1, 2, 3 and on']
    },
    memo_title: { ru: 'Три способа', uz: 'Uchta usul', en: 'Three methods' },
    // Короткие имена для итоговой карточки: полные названия там не помещаются
    // и превращают памятку в стену текста.
    short_1: { ru: 'Одно число', uz: 'Bitta son', en: 'One number' },
    short_2: { ru: 'Все делители', uz: 'Barcha bo\'luvchilar', en: 'All divisors' },
    short_3: { ru: 'Кратные', uz: 'Karrali sonlar', en: 'Multiples' },
    memo_1: { ru: 'раздели, смотри остаток', uz: "bo'ling, qoldiqqa qarang", en: 'divide, look at the remainder' },
    memo_2: { ru: 'иди парами до встречи', uz: 'juftlab uchrashguncha yuring', en: 'go in pairs until they meet' },
    memo_3: { ru: 'умножай на 1, 2, 3 и дальше', uz: "1, 2, 3 va keyingilariga ko'paytiring", en: 'multiply by 1, 2, 3 and on' }
  },

  // Ekran 6 — BIRGA YECHAMIZ. To'liq yechim namunasi: 24 ning bo'luvchilari.
  // Muvaffaqiyatsiz qadam (beshlik) ham yozuvda QOLADI — bola rad javobini
  // ko'rishi kerak, hozirgi darsda faqat omadli juftliklar ko'rsatiladi.
  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Найти все делители числа 24', uz: "24 sonining barcha bo'luvchilarini topish", en: 'Find every divisor of 24' },
    lead: { ru: 'То самое число, с которого начался урок. Записываю каждый шаг, ничего не стираю.', uz: "Dars shu sondan boshlangan edi. Har bir qadamni yozib boraman, hech narsani o'chirmayman.", en: 'The very number the lesson began with. I write down every step and erase nothing.' },
    rows: [
      { d: 1, q: 24, rest: 0, pair: '1 и 24' },
      { d: 2, q: 12, rest: 0, pair: '2 и 12' },
      { d: 3, q: 8, rest: 0, pair: '3 и 8' },
      { d: 4, q: 6, rest: 0, pair: '4 и 6' },
      { d: 5, q: 4, rest: 4, pair: null },
      { d: 6, q: 4, rest: 0, pair: 'stop' }
    ],
    pair_word: { ru: 'и', uz: 'va', en: 'and' },
    rest_word: { ru: 'остаток', uz: 'qoldiq', en: 'remainder' },
    no_pair: { ru: 'пары нет', uz: "juftlik yo'q", en: 'no pair' },
    stop_word: { ru: 'встретились, стоп', uz: "uchrashdi, to'xtaymiz", en: 'they met, stop' },
    answer: {
      ru: 'Ответ: 1, 2, 3, 4, 6, 8, 12, 24 — восемь делителей',
      uz: "Javob: 1, 2, 3, 4, 6, 8, 12, 24 — sakkizta bo'luvchi",
      en: 'Answer: 1, 2, 3, 4, 6, 8, 12, 24 — eight divisors'
    },
    q5: { ru: 'Делится ли 24 на 5 без остатка?', uz: '24 soni 5 ga qoldiqsiz bo\'linadimi?', en: 'Does 24 divide by 5 with no remainder?' },
    q5_yes: { ru: 'Да', uz: 'Ha', en: 'Yes' },
    q5_no: { ru: 'Нет', uz: "Yo'q", en: 'No' },
    q5_wrong: { ru: '24 : 5 = 4, и 4 в остатке. Пятёрка пары не даёт.', uz: "24 : 5 = 4, qoldiq 4. Besh juftlik bermaydi.", en: '24 : 5 = 4 with 4 left over. Five gives no pair.' },
    q5_wrong_audio: {
      ru: 'Двадцать четыре разделить на пять это четыре и четыре в остатке. Остаток не ноль, значит пятёрка делителем не будет.',
      uz: "Yigirma to'rtni beshga bo'lsak to'rt chiqadi va to'rt qoldiq qoladi. Qoldiq nol emas, demak besh bo'luvchi bo'lolmaydi.",
      en: 'Twenty four divided by five is four with a remainder of four. The remainder is not zero, so five will not be a divisor.'
    },
    q_stop: { ru: 'На числе 6 пара дала 4. Что делаем дальше?', uz: "6 da juftlik 4 ni berdi. Endi nima qilamiz?", en: 'At 6 the pair gave 4. What do we do next?' },
    stop_a: { ru: 'Останавливаемся: левое догнало правое', uz: "To'xtaymiz: chap o'ngga yetdi", en: 'Stop: the left one caught the right one' },
    stop_b: { ru: 'Продолжаем до 24', uz: '24 gacha davom etamiz', en: 'Keep going up to 24' },
    stop_c: { ru: 'Продолжаем до 12', uz: '12 gacha davom etamiz', en: 'Keep going up to 12' },
    stop_wrong_b: { ru: 'Дальше пойдут те же пары, только наоборот: 8 и 3, 12 и 2, 24 и 1. Новых делителей не будет.', uz: "Keyin o'sha juftliklar teskari tartibda keladi: 8 va 3, 12 va 2, 24 va 1. Yangi bo'luvchi chiqmaydi.", en: 'The same pairs come next, only reversed: 8 and 3, 12 and 2, 24 and 1. No new divisors appear.' },
    stop_wrong_b_audio: {
      ru: 'Дальше пойдут те же самые пары, только задом наперёд. Восемь и три, двенадцать и два. Новых делителей они не дадут, работа будет впустую.',
      uz: "Keyin o'sha juftliklarning o'zi teskari tartibda keladi. Sakkiz va uch, o'n ikki va ikki. Ular yangi bo'luvchi bermaydi, mehnat behuda ketadi.",
      en: 'The very same pairs come next, only backwards. Eight and three, twelve and two. They give no new divisors, the work would be wasted.'
    },
    stop_wrong_c: { ru: '12 уже записано в паре с 2. Пары начали повторяться на шестёрке.', uz: "12 allaqachon 2 bilan juftlikda yozilgan. Juftliklar oltida takrorlana boshladi.", en: '12 is already written in the pair with 2. The pairs started repeating at six.' },
    stop_wrong_c_audio: {
      ru: 'Двенадцать уже записано в паре с двойкой. Повторение началось на шестёрке, значит там и остановка.',
      uz: "O'n ikki allaqachon ikki bilan juftlikda yozilgan. Takrorlanish oltida boshlandi, demak to'xtash ham shu yerda.",
      en: 'Twelve is already written in the pair with two. The repeating started at six, so that is where we stop.'
    },
    audio: {
      ru: [
        'Теперь решим целиком, от начала до конца. Найдём все делители двадцати четырёх. Я записываю каждый шаг и ничего не стираю, чтобы ты видел весь путь.',
        'Начинаю с первой пары, она есть всегда. Единица и двадцать четыре.',
        'Двойка. Двадцать четыре разделить на два двенадцать. Пара есть. Тройка. Восемь. Пара есть. Четвёрка. Шесть. Пара есть.',
        'Теперь пятёрка. Как думаешь, разделится?',
        'Не разделилась, остаток четыре. Смотри, я всё равно записал эту строку. Неудачный шаг тоже часть решения, его не прячут.',
        'Шестёрка. Двадцать четыре разделить на шесть четыре. Но четвёрка уже есть в списке. Левое догнало правое.',
        'Ответ. Единица, два, три, четыре, шесть, восемь, двенадцать, двадцать четыре. Восемь делителей.'
      ],
      uz: [
        "Endi boshidan oxirigacha to'liq yechamiz. Yigirma to'rtning barcha bo'luvchilarini topamiz. Men har bir qadamni yozib boraman va hech narsani o'chirmayman, siz butun yo'lni ko'rib turing.",
        "Birinchi juftlikdan boshlayman, u doim bor. Bir va yigirma to'rt.",
        "Ikki. Yigirma to'rtni ikkiga bo'lsak o'n ikki. Juftlik bor. Uch. Sakkiz. Juftlik bor. To'rt. Olti. Juftlik bor.",
        "Endi besh. Sizningcha, bo'linadimi?",
        "Bo'linmadi, qoldiq to'rt. Qarang, men bu qatorni baribir yozdim. Muvaffaqiyatsiz qadam ham yechimning bir qismi, uni yashirmaydilar.",
        "Olti. Yigirma to'rtni oltiga bo'lsak to'rt. Lekin to'rt ro'yxatda bor. Chap o'ngga yetdi.",
        "Javob. Bir, ikki, uch, to'rt, olti, sakkiz, o'n ikki, yigirma to'rt. Sakkizta bo'luvchi."
      ],
      en: [
        'Now we solve one all the way through. We find every divisor of twenty four. I write down each step and erase nothing, so you can see the whole path.',
        'I start with the first pair, it is always there. One and twenty four.',
        'Two. Twenty four divided by two is twelve. There is a pair. Three. Eight. There is a pair. Four. Six. There is a pair.',
        'Now five. What do you think, will it divide?',
        'It did not, the remainder is four. Look, I wrote that line down anyway. A failed step is part of the solution too, we do not hide it.',
        'Six. Twenty four divided by six is four. But four is already on the list. The left one caught the right one.',
        'The answer. One, two, three, four, six, eight, twelve, twenty four. Eight divisors.'
      ]
    }
  },

  // Ekran 9 — MASHQ 1. Rollarni nomlash, uchta misol ketma-ket.
  s_roles: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Назови каждое число', uz: 'Har bir sonni nomlang', en: 'Name each number' },
    lead: { ru: 'Игроки расходятся по командам. Делитель не больше самого числа, кратное — не меньше.', uz: "O'yinchilar jamoalarga bo'linadi. Bo'luvchi sondan katta emas, karrali son esa kichik emas.", en: 'The players split into teams. A divisor is not larger than the number, a multiple is not smaller.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    // Подпись над примером: сколько игроков и на сколько команд.
    ctx: { ru: '{a} игроков на {b} команд', uz: "{a} o'yinchi {b} ta jamoaga", en: '{a} players into {b} teams' },
    opt_mult: { ru: 'кратное', uz: 'karralisi', en: 'multiple' },
    opt_div: { ru: 'делитель', uz: "bo'luvchisi", en: 'divisor' },
    items: [
      { a: '20', b: '5', r: '4' },
      { a: '18', b: '3', r: '6' },
      { a: '35', b: '7', r: '5' }
    ],
    row_a: { ru: '{a} — это … числа {b}', uz: "{a} — bu {b} sonining …", en: '{a} is the … of {b}' },
    row_b: { ru: '{b} — это … числа {a}', uz: "{b} — bu {a} sonining …", en: '{b} is the … of {a}' },
    correct_text: { ru: 'Верно. Меньшее делит, большее ему кратно.', uz: "To'g'ri. Kichigi bo'ladi, kattasi unga karrali.", en: 'Correct. The smaller one divides, the larger one is its multiple.' },
    wrong_swap: { ru: 'Перепутано местами. Делитель не больше самого числа: меньшее делит, большее делится.', uz: "O'rni almashib ketdi. Bo'luvchi sonning o'zidan katta bo'lmaydi: kichigi bo'ladi, kattasi bo'linadi.", en: 'They are swapped. A divisor is never larger than the number: the smaller one divides, the larger one is divided.' },
    wrong_same: { ru: 'Оба названия одинаковыми не бывают. Одно деление даёт два разных имени.', uz: "Ikkala nom bir xil bo'lmaydi. Bitta bo'lish ikkita har xil nom beradi.", en: 'The two names are never the same. One division gives two different names.' },
    audio: {
      intro: { ru: 'Три примера подряд. В каждом назови оба числа. Подсказку держи в голове. Делитель не больше самого числа, кратное не меньше.', uz: "Ketma-ket uchta misol. Har birida ikkala sonni nomlang. Yodda tuting. Bo'luvchi sondan katta emas, karrali son esa kichik emas.", en: 'Three examples in a row. Name both numbers in each. Keep the clue in mind. A divisor is not larger than the number, a multiple is not smaller.' },
      on_correct: { ru: 'Верно. Меньшее делит, большее кратно.', uz: "To'g'ri. Kichigi bo'ladi, kattasi karrali.", en: 'Correct. The smaller one divides, the larger one is a multiple.' },
      on_wrong: { ru: 'Посмотри разбор и попробуй ещё раз.', uz: "Tushuntirishga qarang va yana urinib ko'ring.", en: 'Look at the explanation and try again.' }
    }
  },

  // Ekran 10 — MASHQ 2. Birinchi usul amalda, to'rtta tekshiruv.
  s_check: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Делится или нет', uz: "Bo'linadimi yoki yo'q", en: 'Does it divide or not' },
    lead: { ru: 'Ответь да или нет. Смотри на остаток.', uz: "Ha yoki yo'q deb javob bering. Qoldiqqa qarang.", en: 'Answer yes or no. Look at the remainder.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    yes: { ru: 'Да', uz: 'Ha', en: 'Yes' },
    no: { ru: 'Нет', uz: "Yo'q", en: 'No' },
    items: [
      { n: 91, d: 7, ok: true },
      { n: 45, d: 6, ok: false },
      { n: 48, d: 8, ok: true },
      { n: 50, d: 4, ok: false }
    ],
    q: [
      { ru: 'На турнир привезли 91 бутылку воды на 7 команд. Раздать поровну выйдет?', uz: "Turnirga 7 ta jamoaga 91 shisha suv keltirildi. Teng bo'lib berish chiqadimi?", en: '91 bottles of water arrived for 7 teams. Can they be shared equally?' },
      { ru: 'Игры начинаются каждые 6 минут. Будет ли игра на 45-й минуте?', uz: "O'yinlar har 6 daqiqada boshlanadi. 45-daqiqada o'yin bo'ladimi?", en: 'Games start every 6 minutes. Will there be a game at minute 45?' },
      { ru: '48 тетрадей на 8 стопок. Поровну?', uz: "48 ta daftar 8 ta uyumga. Tengmi?", en: '48 notebooks into 8 stacks. Equally?' },
      { ru: '50 участников на 4 площадки поровну?', uz: "50 ishtirokchi 4 ta maydonga tengmi?", en: 'Can 50 participants be split evenly across 4 courts?' }
    ],
    correct: [
      { ru: 'Верно. 91 : 7 = 13, остаток 0. Каждой команде по 13 бутылок.', uz: "To'g'ri. 91 : 7 = 13, qoldiq 0. Har bir jamoaga 13 tadan shisha.", en: 'Correct. 91 : 7 = 13, remainder 0. Thirteen bottles per team.' },
      { ru: 'Верно. 45 : 6 = 7, остаток 3. В это время игра не начинается.', uz: "To'g'ri. 45 : 6 = 7, qoldiq 3. Bu vaqtda o'yin boshlanmaydi.", en: 'Correct. 45 : 6 = 7, remainder 3. No game starts at that time.' },
      { ru: 'Верно. 48 : 8 = 6, остаток 0. По шесть тетрадей в стопке.', uz: "To'g'ri. 48 : 8 = 6, qoldiq 0. Har uyumda oltitadan daftar.", en: 'Correct. 48 : 8 = 6, remainder 0. Six notebooks per stack.' },
      { ru: 'Верно. 50 : 4 = 12, остаток 2. Двоим площадки не хватило.', uz: "To'g'ri. 50 : 4 = 12, qoldiq 2. Ikki kishiga maydon yetmadi.", en: 'Correct. 50 : 4 = 12, remainder 2. Two had no court.' }
    ],
    wrong: [
      { ru: '91 : 7 = 13 ровно. Остаток ноль, значит поровну выходит.', uz: "91 : 7 = 13, tekis. Qoldiq nol, demak teng bo'linadi.", en: '91 : 7 = 13 exactly. The remainder is zero, so it shares equally.' },
      { ru: '45 : 6 = 7 и 3 в остатке. Три минуты лишние, игра в это время не начинается.', uz: "45 : 6 = 7, qoldiq 3. Uch daqiqa ortiqcha, bu vaqtda o'yin boshlanmaydi.", en: '45 : 6 = 7 with 3 left over. Three extra minutes, no game starts then.' },
      { ru: '48 : 8 = 6 ровно. По шесть тетрадей в стопке, лишних нет.', uz: "48 : 8 = 6, tekis. Har uyumda oltitadan daftar, ortiqchasi yo'q.", en: '48 : 8 = 6 exactly. Six notebooks per stack, none left over.' },
      { ru: '50 : 4 = 12 и 2 в остатке. Двоим площадки не хватило.', uz: "50 : 4 = 12, qoldiq 2. Ikki kishiga maydon yetmadi.", en: '50 : 4 = 12 with 2 left over. Two had no court.' }
    ],
    wrong_audio: [
      { ru: 'Девяносто один разделить на семь тринадцать. Остаток ноль, значит каждой команде достанется поровну.', uz: "To'qson birni yettiga bo'lsak o'n uch. Qoldiq nol, demak har bir jamoaga teng tegadi.", en: 'Ninety one divided by seven is thirteen. The remainder is zero, so every team gets an equal share.' },
      { ru: 'Сорок пять разделить на шесть семь и три в остатке. Три минуты лишние, игра в это время не начинается.', uz: "Qirq beshni oltiga bo'lsak yetti va uch qoldiq. Uch daqiqa ortiqcha, bu vaqtda o'yin boshlanmaydi.", en: 'Forty five divided by six is seven with three left over. Three extra minutes, no game starts then.' },
      { ru: 'Сорок восемь разделить на восемь шесть. По шесть тетрадей в стопке, лишних нет.', uz: "Qirq sakkizni sakkizga bo'lsak olti. Har uyumda oltitadan daftar, ortiqchasi yo'q.", en: 'Forty eight divided by eight is six. Six notebooks per stack, none left over.' },
      { ru: 'Пятьдесят разделить на четыре двенадцать и два в остатке. Двоим площадки не хватило.', uz: "Ellikni to'rtga bo'lsak o'n ikki va ikki qoldiq. Ikki kishiga maydon yetmadi.", en: 'Fifty divided by four is twelve with two left over. Two had no court.' }
    ],
    audio: {
      intro: { ru: 'Четыре проверки по первому способу. Каждый раз дели и смотри на остаток, а не на то, красиво ли получилось.', uz: "Birinchi usul bo'yicha to'rtta tekshiruv. Har safar bo'ling va natija chiroyli chiqdimi emas, qoldiqqa qarang.", en: 'Four checks using the first method. Each time divide and look at the remainder, not at how neat it looks.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: "Tushuntirishga qarang.", en: 'Look at the explanation.' }
    }
  },

  // Ekran 11, ikkinchi topshiriq: 20 ning bo'luvchilari (birinchisi — s9, 18).
  s9b: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    label: { ru: 'теперь сам', uz: "endi o'zingiz", en: 'now on your own' },
    context: { ru: 'Тот же способ, но подсказок нет.', uz: "O'sha usul, lekin ishora yo'q.", en: 'The same method, but no hints.' },
    question: { ru: 'Выбери все делители числа 20', uz: "20 sonining barcha bo'luvchilarini tanlang", en: 'Choose all the divisors of 20' },
    numbers: ['1', '2', '3', '4', '5', '6', '10', '20'],
    divisors: ['1', '2', '4', '5', '10', '20'],
    correct_text: { ru: 'Верно: 1, 2, 4, 5, 10, 20 — шесть делителей. Пары: 1 и 20, 2 и 10, 4 и 5.', uz: "To'g'ri: 1, 2, 4, 5, 10, 20 — oltita bo'luvchi. Juftliklar: 1 va 20, 2 va 10, 4 va 5.", en: 'Correct: 1, 2, 4, 5, 10, 20 — six divisors. Pairs: 1 and 20, 2 and 10, 4 and 5.' },
    hint: { ru: 'Иди парами: 1 и 20, 2 и 10, 4 и 5. На пятёрке пары сходятся.', uz: "Juftlab yuring: 1 va 20, 2 va 10, 4 va 5. Beshda juftliklar tutashadi.", en: 'Go in pairs: 1 and 20, 2 and 10, 4 and 5. At five the pairs meet.' },
    why: {
      ru: ['1 и 20 — эта пара есть у любого числа.', '20 : 2 = 10, значит 2 и 10 тоже делители.', '20 : 4 = 5, пара сошлась. Дальше искать нечего.'],
      uz: ["1 va 20 — bu juftlik har qanday sonda bor.", "20 : 2 = 10, demak 2 va 10 ham bo'luvchi.", "20 : 4 = 5, juftlik tutashdi. Boshqa qidirishga hech narsa yo'q."],
      en: ['1 and 20 — every number has this pair.', '20 : 2 = 10, so 2 and 10 are divisors too.', '20 : 4 = 5, the pair has met. There is nothing more to find.']
    },
    audio: {
      intro: { ru: 'Теперь двадцать, и уже без меня. Начни с пары, которая есть всегда.', uz: "Endi yigirma, va endi mensiz. Doim bor bo'lgan juftlikdan boshlang.", en: 'Now twenty, and this time without me. Start with the pair that is always there.' },
      on_correct: { ru: 'Верно. Шесть делителей, три пары.', uz: "To'g'ri. Oltita bo'luvchi, uchta juftlik.", en: 'Correct. Six divisors, three pairs.' },
      on_wrong: { ru: 'Проверь парами: у каждого числа должна быть пара.', uz: "Juftlab tekshiring: har bir sonning jufti bo'lishi kerak.", en: 'Check in pairs: every number must have a partner.' }
    }
  },

  // Ekran 12 — MASHQ 4. XATONI TOPISH. Birinchi topshiriq TUZOQ: xato yo'q.
  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikini tekshirgandek tekshiring.", en: "Check someone else's work the way you would check your own." },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    t1_lead: { ru: 'Азиз выписал делители числа 20:', uz: "Aziz 20 sonining bo'luvchilarini yozdi:", en: 'Aziz wrote the divisors of 20:' },
    t1_list: ['1', '2', '4', '5', '10', '20'],
    t1_q: { ru: 'Дилноза говорит, что одного не хватает. Кто прав?', uz: "Dilnoza bittasi yetishmayapti deydi. Kim haq?", en: 'Dilnoza says one is missing. Who is right?' },
    t1_opt_aziz: { ru: 'Прав Азиз: список полный', uz: "Aziz haq: ro'yxat to'liq", en: 'Aziz is right: the list is complete' },
    t1_opt_dilnoza: { ru: 'Права Дилноза: чего-то нет', uz: "Dilnoza haq: nimadir yo'q", en: 'Dilnoza is right: something is missing' },
    t1_correct: { ru: 'Верно, прав Азиз. Пары: 1 и 20, 2 и 10, 4 и 5. Все три на месте.', uz: "To'g'ri, Aziz haq. Juftliklar: 1 va 20, 2 va 10, 4 va 5. Uchalasi ham joyida.", en: 'Correct, Aziz is right. Pairs: 1 and 20, 2 and 10, 4 and 5. All three are there.' },
    t1_wrong: { ru: 'Список полный. Проверь парами: 1 и 20, 2 и 10, 4 и 5. Все три пары на месте.', uz: "Ro'yxat to'liq. Juftlab tekshiring: 1 va 20, 2 va 10, 4 va 5. Uchala juftlik ham joyida.", en: 'The list is complete. Check in pairs: 1 and 20, 2 and 10, 4 and 5. All three pairs are there.' },
    t1_wrong_audio: { ru: 'Список полный. Проверь парами. Один и двадцать, два и десять, четыре и пять. Все три пары на месте, пропуска нет.', uz: "Ro'yxat to'liq. Juftlab tekshiring. Bir va yigirma, ikki va o'n, to'rt va besh. Uchala juftlik ham joyida, tushib qolgani yo'q.", en: 'The list is complete. Check in pairs. One and twenty, two and ten, four and five. All three pairs are there, nothing is missing.' },
    t2_lead: { ru: 'А теперь делители числа 18:', uz: "Endi 18 sonining bo'luvchilari:", en: 'And now the divisors of 18:' },
    t2_list: ['1', '2', '3', '6', '18'],
    t2_q: { ru: 'Какое число пропущено?', uz: 'Qaysi son tushib qolgan?', en: 'Which number is missing?' },
    t2_opts: ['4', '9', '12', 'ничего'],
    t2_opts_uz: ['4', '9', '12', "hech narsa"],
    t2_opts_en: ['4', '9', '12', 'nothing'],
    t2_correct: { ru: 'Верно, пропущена 9. Пара двойки — девятка: 2 · 9 = 18.', uz: "To'g'ri, 9 tushib qolgan. Ikkining jufti to'qqiz: 2 · 9 = 18.", en: 'Correct, 9 is missing. The partner of two is nine: 2 · 9 = 18.' },
    t2_wrong_4: { ru: '18 : 4 = 4 и 2 в остатке. Четвёрка делителем не является.', uz: "18 : 4 = 4, qoldiq 2. To'rt bo'luvchi emas.", en: '18 : 4 = 4 with 2 left over. Four is not a divisor.' },
    t2_wrong_4_audio: { ru: 'Восемнадцать разделить на четыре четыре и два в остатке. Четвёрка делителем не является.', uz: "O'n sakkizni to'rtga bo'lsak to'rt va ikki qoldiq. To'rt bo'luvchi emas.", en: 'Eighteen divided by four is four with two left over. Four is not a divisor.' },
    t2_wrong_12: { ru: '18 на 12 нацело не делится. Ищи пару к двойке.', uz: "18 soni 12 ga butun bo'linmaydi. Ikkiga juft qidiring.", en: '18 does not divide by 12 exactly. Look for the partner of two.' },
    t2_wrong_12_audio: { ru: 'Восемнадцать на двенадцать нацело не делится. Ищи пару к двойке.', uz: "O'n sakkiz o'n ikkiga butun bo'linmaydi. Ikkiga juft qidiring.", en: 'Eighteen does not divide by twelve exactly. Look for the partner of two.' },
    t2_wrong_none: { ru: 'Пропуск есть. У двойки пара девятка: 2 · 9 = 18, а девятки в списке нет.', uz: "Tushib qolgani bor. Ikkining jufti to'qqiz: 2 · 9 = 18, to'qqiz esa ro'yxatda yo'q.", en: 'Something is missing. The partner of two is nine: 2 · 9 = 18, and nine is not on the list.' },
    t2_wrong_none_audio: { ru: 'Пропуск есть. У двойки пара девятка. Два умножить на девять восемнадцать, а девятки в списке нет.', uz: "Tushib qolgani bor. Ikkining jufti to'qqiz. Ikki karra to'qqiz o'n sakkiz, to'qqiz esa ro'yxatda yo'q.", en: 'Something is missing. The partner of two is nine. Two times nine is eighteen, and nine is not on the list.' },
    audio: {
      intro: { ru: 'На экзамене пригодится не только решать, но и проверять. Азиз выписал два списка. В одном ошибка есть, в другом нет. Не спеши искать её там, где её нет.', uz: "Imtihonda faqat yechish emas, tekshirish ham asqotadi. Aziz ikkita ro'yxat yozdi. Birida xato bor, ikkinchisida yo'q. Xato yo'q joyda uni qidirishga shoshilmang.", en: 'On the exam you need to check as well as solve. Aziz wrote two lists. One has a mistake, the other does not. Do not rush to find one where there is none.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' }
    }
  },

  // Ekran 13 — MASALA. Suratlar to'ri. Zamonaviy syujet (metodist 2026-08-13).
  // MUHIM: chetki to'rlar (1 tadan va 24 tadan) HISOBGA OLINADI —
  // aks holda javob 6 chiqadi va imtihondagi «24 ning bo'luvchilari nechta»
  // savoliga qarama-qarshi bo'lardi.
  s_grid: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Фотографии с турнира', uz: 'Turnir suratlari', en: 'Photos from the tournament' },
    lead: { ru: 'Фотографии выкладывают в школьную галерею одинаковыми рядами.', uz: 'Suratlar maktab galereyasiga bir xil qatorlar qilib joylanadi.', en: 'The photos go into the school gallery in equal rows.' },
    // Условие — УТВЕРЖДЕНИЕ, а не второй вопрос. Раньше на экране стояли два
    // вопроса подряд: «по скольку можно ставить в ряд?» и «сколько раскладок?».
    // Ребёнок отвечал на первый и выбирал 6, хотя спрашивали количество.
    q1: { ru: 'Фотографий 24. Каждый ряд должен быть полным.', uz: "Suratlar 24 ta. Har bir qator to'la bo'lishi kerak.", en: 'There are 24 photos. Every row has to be full.' },
    q2: { ru: 'А если фотографий 25?', uz: "Suratlar 25 ta bo'lsa-chi?", en: 'And if there are 25 photos?' },
    // «Joylashuv» / «раскладка» ребёнку непонятны (методист 2026-08-14): это
    // отглагольное существительное, и на экране ему ничего не соответствует.
    // Считаем то, что ВИДНО на стене — сетку снимков: «6 tadan · 4 qator» это
    // одна сетка, и вопрос спрашивает, сколько разных сеток бывает. Слово `to'r`
    // на этом экране уже стояло («kvadrat to'r»), теперь экран говорит одним
    // словом вместо двух.
    ask_count: { ru: 'Сколько разных сеток получится?', uz: "Necha xil to'r chiqadi?", en: 'How many different grids come out?' },
    // Варианты и разборы идут в ОДНОМ порядке: 4 / 6 / 8 / 24 и 1 / 3 / 5 / 25.
    opts_24: { ru: ['4', '6', '8', '24'], uz: ['4', '6', '8', '24'], en: ['4', '6', '8', '24'] },
    right_24: 2,
    opts_25: { ru: ['1', '3', '5', '25'], uz: ['1', '3', '5', '25'], en: ['1', '3', '5', '25'] },
    right_25: 1,
    wrong_all: { ru: '24 — это количество фотографий, а не сеток. Сеток столько, сколько делителей.', uz: "24 — bu suratlar soni, to'rlar soni emas. To'r nechta bo'luvchi bo'lsa, shuncha.", en: '24 is the number of photos, not of grids. There are as many grids as divisors.' },
    wrong_all_audio: { ru: 'Двадцать четыре это количество фотографий, а не сеток. Сеток столько, сколько у числа делителей.', uz: "Yigirma to'rt bu suratlar soni, to'rlar soni emas. To'r sonning bo'luvchilari qancha bo'lsa, shuncha.", en: 'Twenty four is the number of photos, not of grids. There are as many grids as the number has divisors.' },
    wrong_one: { ru: 'Квадратная сетка одна, но есть ещё по 1 в ряд и по 25 в ряд. Всего три.', uz: "Kvadrat to'r bitta, lekin 1 tadan va 25 tadan ham bor. Jami uchta.", en: 'There is one square grid, but there are also one per row and twenty five per row. Three in all.' },
    wrong_one_audio: { ru: 'Квадратная сетка действительно одна. Но есть ещё по одной в ряд и по двадцать пять в ряд. Всего получается три.', uz: "Kvadrat to'r haqiqatan bitta. Lekin bittadan qator va yigirma beshtadan qator ham bor. Jami uchta chiqadi.", en: 'There really is only one square grid. But there are also one per row and twenty five per row. Three in all.' },
    wrong_five: { ru: '5 — это сколько в ряду, а не сколько сеток. Делителей у 25 три: 1, 5, 25.', uz: "5 — bu qatordagi soni, to'rlar soni emas. 25 ning bo'luvchilari uchta: 1, 5, 25.", en: '5 is how many per row, not how many grids. 25 has three divisors: 1, 5, 25.' },
    wrong_five_audio: { ru: 'Пять это сколько фотографий в ряду, а не сколько сеток. Делителей у двадцати пяти три. Один, пять и двадцать пять.', uz: "Besh bu qatordagi suratlar soni, to'rlar soni emas. Yigirma beshning bo'luvchilari uchta. Bir, besh va yigirma besh.", en: 'Five is how many photos are in a row, not how many grids. Twenty five has three divisors. One, five and twenty five.' },
    wrong_all25: { ru: '25 — это количество фотографий. Сеток столько, сколько делителей, а их три.', uz: "25 — bu suratlar soni. To'r nechta bo'luvchi bo'lsa shuncha, ular esa uchta.", en: '25 is the number of photos. There are as many grids as divisors, and there are three.' },
    wrong_all25_audio: { ru: 'Двадцать пять это количество фотографий. Сеток столько, сколько делителей, а делителей три.', uz: "Yigirma besh bu suratlar soni. To'r bo'luvchilar qancha bo'lsa shuncha, bo'luvchilar esa uchta.", en: 'Twenty five is the number of photos. There are as many grids as divisors, and there are three divisors.' },
    // Подпись под сценой НАЗЫВАЕТ то, что на ней стоит. Без этого слова вопрос
    // «сколько разных сеток» висел в воздухе: на экране сетка была, а имени у
    // неё не было.
    grid_word: { ru: 'Сетка', uz: "To'r", en: 'Grid' },
    per_row: { ru: 'по {k} в ряд', uz: '{k} tadan', en: '{k} per row' },
    // Русский требует согласования: 1 ряд, 4 ряда, 5 рядов. Формы лежат
    // тройкой, подставляет их plRu. В узбекском и английском счётное слово
    // не меняется, поэтому там обычный шаблон.
    rows_word: { ru: '{r} {w}', uz: '{r} qator', en: '{r} rows' },
    rows_forms: { ru: ['ряд', 'ряда', 'рядов'] },
    out_1: { ru: 'Восемь сеток: по 1, 2, 3, 4, 6, 8, 12, 24', uz: "Sakkizta to'r: 1, 2, 3, 4, 6, 8, 12, 24 tadan", en: 'Eight grids: 1, 2, 3, 4, 6, 8, 12, 24 per row' },
    out_2: { ru: 'Три сетки: по 1, 5, 25. Квадратная одна — 5 на 5.', uz: "Uchta to'r: 1, 5, 25 tadan. Kvadrati bittasi — 5 ga 5.", en: 'Three grids: 1, 5, 25 per row. Only one is square — 5 by 5.' },
    done: { ru: 'Сколько делителей — столько и сеток.', uz: "Nechta bo'luvchi bo'lsa, shuncha to'r bo'ladi.", en: 'As many divisors as there are, that many grids.' },
    square: { ru: 'Квадратная сетка получается, только когда число делится само на себя поровну: 5 · 5 = 25.', uz: "Kvadrat to'r faqat son o'ziga o'zi teng bo'linganda chiqadi: 5 · 5 = 25.", en: 'A square grid appears only when the number splits into two equal parts: 5 · 5 = 25.' },
    wrong_6: { ru: 'Забыты крайние. По одной в ряд и по двадцать четыре в ряд — тоже полные ряды. Единица и само число делители всегда.', uz: "Chetkilari esdan chiqdi. Bittadan qator ham, yigirma to'rttadan qator ham to'la qator. Bir va sonning o'zi doim bo'luvchi.", en: 'The edge grids were forgotten. One per row and twenty four per row are full rows too. One and the number itself are always divisors.' },
    wrong_6_audio: { ru: 'Забыты крайние сетки. По одной в ряд это длинный столбец, по двадцать четыре в ряд это одна длинная лента. Ряды в обоих случаях полные, а единица и само число делители всегда.', uz: "Chetki to'rlar esdan chiqdi. Bittadan qator uzun ustun, yigirma to'rttadan qator bitta uzun lenta. Ikkalasida ham qatorlar to'la, bir va sonning o'zi esa doim bo'luvchi.", en: 'The edge grids were forgotten. One per row is a long column, twenty four per row is one long strip. In both cases the rows are full, and one and the number itself are always divisors.' },
    wrong_pair: { ru: 'По 3 в ряд и по 8 в ряд выглядят по-разному. Пара одна, а сетки две.', uz: "3 tadan va 8 tadan qator har xil ko'rinadi. Juftlik bitta, to'r esa ikkita.", en: 'Three per row and eight per row look different. One pair, but two grids.' },
    wrong_pair_audio: { ru: 'По три в ряд и по восемь в ряд выглядят по-разному. Пара одна, а сетки получаются две.', uz: "Uchtadan qator va sakkiztadan qator har xil ko'rinadi. Juftlik bitta, to'r esa ikkita chiqadi.", en: 'Three per row and eight per row look different. One pair, but there are two grids.' },
    audio: {
      intro: { ru: 'Задача из жизни. Фотографии с турнира выкладывают в школьную галерею одинаковыми рядами. Фотографий двадцать четыре, и ни один ряд не должен остаться неполным. Сколько разных сеток может получиться?', uz: "Hayotiy masala. Turnir suratlari maktab galereyasiga bir xil qatorlar qilib joylanadi. Suratlar yigirma to'rtta va birorta qator to'la bo'lmay qolmasligi kerak. Necha xil to'r chiqishi mumkin?", en: 'A problem from life. Photos from the tournament go into the school gallery in equal rows. There are twenty four photos and no row may be left unfinished. How many different grids can come out?' },
      a1: { ru: 'Это тот же второй способ, только в другой одежде. Каждый делитель двадцати четырёх даёт свою сетку. По одной в ряд получится длинный столбец. По двадцать четыре в ряд одна длинная лента. И то и другое ряды полные. Всего восемь сеток, потому что делителей у двадцати четырёх восемь.', uz: "Bu o'sha ikkinchi usul, faqat boshqa libosda. Yigirma to'rtning har bir bo'luvchisi o'z to'rini beradi. Bittadan qo'ysak uzun ustun chiqadi. Yigirma to'rttadan qo'ysak bitta uzun lenta. Ikkalasida ham qatorlar to'la. Jami sakkizta to'r, chunki yigirma to'rtning bo'luvchilari sakkizta.", en: 'This is the second method again, just in different clothes. Every divisor of twenty four gives a grid of its own. One per row gives a long column. Twenty four per row gives one long strip. In both cases the rows are full. Eight grids in all, because twenty four has eight divisors.' },
      a2: { ru: 'А теперь двадцать пять фотографий. Здесь сеток всего три, и только одна из них квадратная. Пять на пять. Так бывает, когда пара сходится сама с собой.', uz: "Endi yigirma beshta surat. Bu yerda to'r atigi uchta va ulardan faqat bittasi kvadrat. Besh ga besh. Juftlik o'zi bilan o'zi uchrashganda shunday bo'ladi.", en: 'Now twenty five photos. Here there are only three grids, and only one of them is square. Five by five. That happens when a pair meets itself.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' }
    }
  },

  // Ekran 14 — YAKUNIY TEST. Bitta ekranda beshta topshiriq (3-sinf naqshi).
  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 9,
        q: { ru: 'Сколько делителей у числа 36? Набери ответ.', uz: "36 sonining nechta bo'luvchisi bor? Javobni tering.", en: 'How many divisors does 36 have? Type the answer.' },
        hint: { ru: 'Иди парами: 1 и 36, 2 и 18, 3 и 12, 4 и 9. Шестёрка идёт в паре сама с собой.', uz: "Juftlab yuring: 1 va 36, 2 va 18, 3 va 12, 4 va 9. Olti o'zi bilan o'zi juft bo'ladi.", en: 'Go in pairs: 1 and 36, 2 and 18, 3 and 12, 4 and 9. Six pairs with itself.' },
        hint_audio: { ru: 'Иди парами. Один и тридцать шесть, два и восемнадцать, три и двенадцать, четыре и девять. Шестёрка идёт в паре сама с собой.', uz: "Juftlab yuring. Bir va o'ttiz olti, ikki va o'n sakkiz, uch va o'n ikki, to'rt va to'qqiz. Olti o'zi bilan o'zi juft bo'ladi.", en: 'Go in pairs. One and thirty six, two and eighteen, three and twelve, four and nine. Six pairs with itself.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Какое число кратно 7?', uz: 'Qaysi son 7 ga karrali?', en: 'Which number is a multiple of 7?' },
        opts: ['34', '42', '51', '60'],
        wrong: [
          { ru: '34 : 7 = 4 и 6 в остатке.', uz: '34 : 7 = 4, qoldiq 6.', en: '34 : 7 = 4 with 6 left over.' },
          null,
          { ru: '51 : 7 = 7 и 2 в остатке.', uz: '51 : 7 = 7, qoldiq 2.', en: '51 : 7 = 7 with 2 left over.' },
          { ru: '60 : 7 = 8 и 4 в остатке.', uz: '60 : 7 = 8, qoldiq 4.', en: '60 : 7 = 8 with 4 left over.' }
        ],
        wrong_audio: [
          { ru: 'Тридцать четыре разделить на семь четыре и шесть в остатке.', uz: "O'ttiz to'rtni yettiga bo'lsak to'rt va olti qoldiq.", en: 'Thirty four divided by seven is four with six left over.' },
          null,
          { ru: 'Пятьдесят один разделить на семь семь и два в остатке.', uz: 'Ellik birni yettiga bo\'lsak yetti va ikki qoldiq.', en: 'Fifty one divided by seven is seven with two left over.' },
          { ru: 'Шестьдесят разделить на семь восемь и четыре в остатке.', uz: "Oltmishni yettiga bo'lsak sakkiz va to'rt qoldiq.", en: 'Sixty divided by seven is eight with four left over.' }
        ],
        correct: { ru: 'Верно. 42 = 7 · 6, остаток ноль.', uz: "To'g'ri. 42 = 7 · 6, qoldiq nol.", en: 'Correct. 42 = 7 · 6, remainder zero.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Нужно узнать, делится ли 91 на 7. Что быстрее?', uz: "91 soni 7 ga bo'linadimi, bilish kerak. Qaysi biri tezroq?", en: 'You need to know whether 91 divides by 7. What is faster?' },
        opts_i18n: [
          { ru: 'Выписать все делители 91 и посмотреть', uz: "91 ning barcha bo'luvchilarini yozib chiqish", en: 'Write out all divisors of 91 and look' },
          { ru: 'Разделить 91 на 7 и посмотреть остаток', uz: "91 ni 7 ga bo'lib, qoldiqqa qarash", en: 'Divide 91 by 7 and look at the remainder' },
          { ru: 'Перечислять кратные 7, пока не дойдём до 91', uz: "91 ga yetguncha 7 ning karralilarini sanash", en: 'List multiples of 7 until we reach 91' }
        ],
        wrong: [
          { ru: 'Это работа на пять минут ради одного вопроса. Все делители нужны, когда спрашивают про все.', uz: "Bu bitta savol uchun besh daqiqalik ish. Barcha bo'luvchilar barchasi so'ralganda kerak bo'ladi.", en: 'That is five minutes of work for one question. You need all divisors when all of them are asked for.' },
          null,
          { ru: 'Это тринадцать шагов вместо одного деления.', uz: "Bu bitta bo'lish o'rniga o'n uchta qadam.", en: 'That is thirteen steps instead of one division.' }
        ],
        wrong_audio: [
          { ru: 'Это работа на пять минут ради одного вопроса. Все делители ищут тогда, когда про все и спрашивают.', uz: "Bu bitta savol uchun besh daqiqalik ish. Barcha bo'luvchilar barchasi so'ralganda qidiriladi.", en: 'That is five minutes of work for one question. You look for all divisors when all of them are asked for.' },
          null,
          { ru: 'Это тринадцать шагов вместо одного деления. Способ рабочий, но самый длинный.', uz: "Bu bitta bo'lish o'rniga o'n uchta qadam. Usul ishlaydi, lekin eng uzuni.", en: 'That is thirteen steps instead of one division. The method works, but it is the longest.' }
        ],
        correct: { ru: 'Верно. 91 : 7 = 13, остаток ноль. Один шаг вместо тринадцати.', uz: "To'g'ri. 91 : 7 = 13, qoldiq nol. O'n uchta qadam o'rniga bitta.", en: 'Correct. 91 : 7 = 13, remainder zero. One step instead of thirteen.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'У какого числа делителей нечётное количество?', uz: "Qaysi sonning bo'luvchilari toq sonda?", en: 'Which number has an odd count of divisors?' },
        opts: ['12', '16', '18', '20'],
        wrong: [
          { ru: 'У 12 все пары разные: 1 и 12, 2 и 6, 3 и 4. Делителей шесть.', uz: "12 da barcha juftliklar har xil: 1 va 12, 2 va 6, 3 va 4. Bo'luvchilar oltita.", en: 'For 12 all pairs differ: 1 and 12, 2 and 6, 3 and 4. Six divisors.' },
          null,
          { ru: 'У 18 пары 1 и 18, 2 и 9, 3 и 6 — все разные. Делителей шесть.', uz: "18 da juftliklar 1 va 18, 2 va 9, 3 va 6 — barchasi har xil. Bo'luvchilar oltita.", en: 'For 18 the pairs 1 and 18, 2 and 9, 3 and 6 all differ. Six divisors.' },
          { ru: 'У 20 пары 1 и 20, 2 и 10, 4 и 5 — все разные. Делителей шесть.', uz: "20 da juftliklar 1 va 20, 2 va 10, 4 va 5 — barchasi har xil. Bo'luvchilar oltita.", en: 'For 20 the pairs 1 and 20, 2 and 10, 4 and 5 all differ. Six divisors.' }
        ],
        wrong_audio: [
          { ru: 'У двенадцати все пары разные. Один и двенадцать, два и шесть, три и четыре. Значит делителей чётное количество.', uz: "O'n ikkida barcha juftliklar har xil. Bir va o'n ikki, ikki va olti, uch va to'rt. Demak bo'luvchilar juft sonda.", en: 'For twelve all pairs differ. One and twelve, two and six, three and four. So the divisor count is even.' },
          null,
          { ru: 'У восемнадцати пары один и восемнадцать, два и девять, три и шесть. Все разные, значит делителей чётное количество.', uz: "O'n sakkizda juftliklar bir va o'n sakkiz, ikki va to'qqiz, uch va olti. Barchasi har xil, demak bo'luvchilar juft sonda.", en: 'For eighteen the pairs are one and eighteen, two and nine, three and six. All differ, so the divisor count is even.' },
          { ru: 'У двадцати пары один и двадцать, два и десять, четыре и пять. Все разные, значит делителей чётное количество.', uz: "Yigirmada juftliklar bir va yigirma, ikki va o'n, to'rt va besh. Barchasi har xil, demak bo'luvchilar juft sonda.", en: 'For twenty the pairs are one and twenty, two and ten, four and five. All differ, so the divisor count is even.' }
        ],
        correct: { ru: 'Верно. 16 = 4 · 4, пара сходится сама с собой: 1, 2, 4, 8, 16 — пять делителей.', uz: "To'g'ri. 16 = 4 · 4, juftlik o'zi bilan o'zi tutashadi: 1, 2, 4, 8, 16 — beshta bo'luvchi.", en: 'Correct. 16 = 4 · 4, the pair meets itself: 1, 2, 4, 8, 16 — five divisors.' }
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Игры на турнире идут каждые 6 минут, первая в 8:00. Начнётся ли игра ровно в 8:45?', uz: "Turnirdagi o'yinlar har 6 daqiqada boshlanadi, birinchisi 8:00 da. Roppa rosa 8:45 da o'yin boshlanadimi?", en: 'Tournament games run every 6 minutes, the first at 8:00. Will a game start exactly at 8:45?' },
        opts_i18n: [
          { ru: 'Да, придёт', uz: 'Ha, keladi', en: 'Yes, it will' },
          { ru: 'Нет, не придёт', uz: "Yo'q, kelmaydi", en: 'No, it will not' }
        ],
        wrong: [
          { ru: '45 на 6 нацело не делится. Кратные шести это 42 и 48, а 45 между ними.', uz: "45 soni 6 ga butun bo'linmaydi. Oltiga karralilar 42 va 48, 45 esa ular orasida.", en: '45 does not divide by 6 exactly. The multiples of six are 42 and 48, and 45 is between them.' },
          null
        ],

        wrong_audio: [
          { ru: 'Сорок пять на шесть нацело не делится. Кратные шести это сорок два и сорок восемь, а сорок пять стоит между ними.', uz: "Qirq besh oltiga butun bo'linmaydi. Oltiga karralilar qirq ikki va qirq sakkiz, qirq besh esa ular orasida.", en: 'Forty five does not divide by six exactly. The multiples of six are forty two and forty eight, and forty five is between them.' },
          null
        ],
        correct: { ru: 'Верно. 45 : 6 = 7, остаток 3. Ближайшие игры в 8:42 и 8:48.', uz: "To'g'ri. 45 : 6 = 7, qoldiq 3. Eng yaqin o'yinlar 8:42 va 8:48 da.", en: 'Correct. 45 : 6 = 7, remainder 3. The nearest games are at 8:42 and 8:48.' }
      }
    ],
    audio: {
      intro: { ru: 'Финальная проверка. Пять заданий на весь урок. Оценки не будет, но каждое задание разберём.', uz: "Yakuniy tekshiruv. Butun darsga beshta topshiriq. Baho qo'yilmaydi, lekin har bir topshiriqni tahlil qilamiz.", en: 'The final check. Five tasks covering the whole lesson. There is no mark, but we will go through each one.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' }
    }
  },
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
// Фишка участника (методист 2026-08-14). Была ЛЕПЁШКА: текст уже говорил
// «12 игроков разошлись на 3 команды», а на картинке лежал хлеб. Слова
// переписали, рисунок остался — расхождение видно сразу.
// Цвета футболок те же, что в зале на хуке: три варианта по номеру фишки.
const UNIT_SHIRTS = [
  { body: '#7ECBE6', edge: '#019ACB' },
  { body: '#F5C77E', edge: '#D89F3C' },
  { body: '#8FD6B4', edge: '#4FB68B' },
];
const Unit = ({ s = 30, tone = 'ok', i = 0 }) => {
  const rest = tone === 'rest';
  const c = rest ? { body: '#FFB59F', edge: '#FF4F28' } : UNIT_SHIRTS[i % UNIT_SHIRTS.length];
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <ellipse cx="20" cy="36.5" rx="12.5" ry="2.6" fill="rgba(90,62,34,0.18)"/>
      {/* корпус в футболке */}
      <path d="M8.5 20 q11.5 -4.5 23 0 v13 q-11.5 3 -23 0 Z" fill={c.body}/>
      <path d="M20 20 q6.5 -1.6 11.5 0 v13 q-5 1.4 -11.5 1.9 Z" fill={c.edge} opacity="0.22"/>
      {/* руки */}
      <rect x="4.6" y="20.5" width="4.4" height="11" rx="2.2" fill={c.body}/>
      <rect x="31" y="20.5" width="4.4" height="11" rx="2.2" fill={c.body}/>
      {/* голова */}
      <circle cx="20" cy="11.5" r="7.4" fill="#F1C9A5"/>
      <path d="M12.6 9.6 a7.4 7.4 0 0 1 14.8 0 z" fill="#4A3A2E"/>
      <circle cx="17.2" cy="11.8" r="1" fill="#3C3128"/>
      <circle cx="22.8" cy="11.8" r="1" fill="#3C3128"/>
      {rest && <circle cx="20" cy="20" r="18.6" fill="none" stroke="#FF4F28" strokeWidth="2.6"/>}
    </svg>
  );
};

// UnitArray olib tashlandi 2026-08-13: uni faqat 3-ekran ishlatardi, endi u
// yerda kino (SplitFilm) turadi va o'z joylashuvini o'zi hisoblaydi.

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

// ============================================================
// FACTCARD — ovozli fakt to'g'ri javobdan keyin (ko'k tema + darsga xos Anim*).
// ============================================================
const FB_SCI  = { ru: 'Знаешь ли ты? · Наука', uz: "Bilasizmi? · Fan", en: 'Did you know? · Science' };
const FB_HIST = { ru: 'Знаешь ли ты? · История', uz: "Bilasizmi? · Tarix", en: 'Did you know? · History' };
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
// Украшение карточек факта — МАТЕМАТИЧЕСКОЕ (методист 2026-08-13).
// Было: три полоски и девять точек, к математике отношения не имели.
// Стало: знаки действий, которые по очереди загораются, и таблица квадратов,
// которая пересчитывает саму себя. Тема урока тут не при чём, это красота,
// но красота из математики, а не абстрактные кружки.
const MATH_GLYPHS = ['+', '\u2212', '\u00d7', '\u00f7', '=', '\u221a', '\u03c0'];
const AnimDigits = () => (
  <div className="fa-mg" aria-hidden="true">
    {MATH_GLYPHS.map((g, i) => (
      <span key={g} style={{ animationDelay: `${i * 0.28}s` }}>{g}</span>
    ))}
  </div>
);
const AnimStars = () => (
  <div className="fa-sq" aria-hidden="true">
    {[1, 2, 3, 4].map((n, i) => (
      <span key={n} style={{ animationDelay: `${i * 0.4}s` }}>
        <i>{n}</i>
        <b>{n * n}</b>
      </span>
    ))}
  </div>
);

// ============================================================
// SHARED SCREEN HELPERS
// ============================================================
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
// Фон итогового экрана: крупные бледные знаки вместо цветных пятен.
const Floaters = () => (
  <div className="amb" aria-hidden="true">
    {/* HTML-сущности, а НЕ escape вида обратный слэш u:
        в ТЕКСТЕ JSX такая запись не разворачивается, и на фоне
        рисовалась строка из шести символов. */}
    <span className="amb-g amb-g1">&#215;</span>
    <span className="amb-g amb-g2">&#247;</span>
    <span className="amb-g amb-g3">=</span>
  </div>
);
const HintBlock = ({ show, children }) => {
  const lang = useLang();
  if (!show) return null;
  return (
    <div className="frame-tip fade-up" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
      <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{tri(lang, 'Подсказка', 'Maslahat', 'Hint')}</p>
      <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
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
  const lines = pickL(c.audio, lang);
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
      if (engine && !audio.muted) engine.pushOneOff(pickL(c.fact_audio, lang), undefined, `s${screen}_fact`);
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
  useEffect(() => { if (last === 0 && factOnLast && c.fact_audio && !factVoicedRef.current) { factVoicedRef.current = true; if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(pickL(c.fact_audio, lang)); } } /* eslint-disable-next-line */ }, []);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><StepDots total={last + 1} active={step}/><NavNext disabled={navLocked(step < last || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/></>);
  // `muted` HAM uzatiladi: ovoz o'chirilganda segmentlar bir zumda «tugaydi» va
  // ularning id'lari oldinga uchib ketadi — kino oxirgi kadrdan boshlanardi.
  // Bunday holatda kadrlarni faqat taymer boshqarishi kerak.
  return (<Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>{renderStep({ t, lang, step, last, refs, muted: audio.muted, activeAudioId: audio.currentSegment, lastCompletedAudioId: audio.lastCompletedSegment })}</Stage>);
};

// ============================================================
// ХУК УРОКА — турнир: 24 участника, команды по 5 или по 6.
// Методист 2026-08-13: урок начинается с вопроса «зачем это учить».
// Оценки здесь нет: выбор ученика — ПРОГНОЗ, а не ответ на тест, поэтому
// ни «верно», ни «ошибка», ни баллов на экране не появляется.
// ============================================================

// Кисть-СТИКЕР (методист 2026-08-13, образец — 1 класс, урок 1).
// Было: две серые фигуры, кружок и прямоугольник. На экране это читалось как
// клякса, а не как рука. Стало: контурная кисть с белой заливкой и тенью —
// узнаётся мгновенно и выглядит наклейкой поверх сцены.
const HandSticker = () => (
  <svg className="hs" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#494550"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 9.5V4a2 2 0 0 0-4 0v10"/>
    <path d="M14 10V9a2 2 0 0 0-4 0v1"/>
    <path d="M18 11v-1a2 2 0 0 0-4 0v1"/>
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);

// HandHint удалён вместе со стикером на хуке (методист 2026-08-14). Сам
// HandSticker остался: его использует экран 4, где кисть стоит на точке нажатия.

// СЦЕНА ХУКА — школьный спортзал (методист 2026-08-14, образец 1-4 класс).
// Было: двадцать четыре одинаковые фигурки на пустом белом поле. История про
// турнир была только в тексте, глазом она не читалась.
// Стало: зал — окна, баннер турнира, табло со счётом участников, скамейка
// запасных и разметка пола. Участники стоят НА полу, а не висят в пустоте.
// Скамейка нарисована заранее: именно на неё сядут те, кому не хватит команды,
// и ребёнок видит её ещё до своего прогноза.
// СЦЕНА ХУКА — ВЗГЛЯД ОТ ТРЕНЕРА (вариант Б, методист 2026-08-14).
// Ребята стоят полукругом лицом к нам, зал за ними. Тренер как раз и делит
// их на команды, поэтому камера стоит на его месте.
//
// РАЗМЕРЫ НАСТОЯЩИЕ. Масштаб: линия пола на y = 110, и это 3,6 метра стены,
// значит один метр = 30,6 единицы. Отсюда всё остальное:
//   школьник 1,45 м = 44        кольцо 3,05 м над полом = 93 вверх
//   щит 1,05 м высотой = 32     шведская стенка 2,6 м = 80
//   окно 1,8 м, низ на 1,1 м    скамейка 0,45 м = 14      мяч 24 см = 7
// Раньше кольцо висело на уровне груди, а щит был вдвое меньше нормы — именно
// это читалось как «далеко от реальности».
//
// Ширина сцены теперь ОБЩАЯ с остальными блоками: в хуках 1-2 класса
// заголовок, рамка и кнопки одной ширины, а картинка заливает рамку целиком.
// Прежние 520 пикселей по центру я взял из `.g1-street` — это врезка внутри
// урока, а не сцена хука.
const GYM_KIDS = 9;
const GYM_FLOOR = 110;          // линия пола в единицах viewBox
const GYM_M = 30.6;             // один метр

// Полукруг: середина дуги ДАЛЬШЕ от нас, края ближе и ниже. Тот, кто ближе,
// нарисован крупнее — это и даёт глубину.
const gymSpots = () => {
  const out = [];
  for (let i = 0; i < GYM_KIDS; i += 1) {
    // Шаг по горизонтали РАВНЫЙ: по косинусу крайние сбивались в кучу.
    const x = 44 + (i * 312) / (GYM_KIDS - 1);
    const d = 1 - ((x - 200) / 156) ** 2;   // 1 в середине дуги, 0 по краям
    out.push({ x, y: GYM_FLOOR + 34 - 21 * d, k: 0.88 + 0.26 * (1 - d) });
  }
  // Ближние рисуются последними, иначе дальние перекрыли бы их.
  return out.sort((a, b) => a.y - b.y);
};

const GymKid = ({ x, y, k, i }) => {
  const h = 1.45 * GYM_M * k;                  // рост
  const head = h * 0.17;
  const body = h - head * 1.15;
  const w = body * 0.62;
  const shirt = ['#7ECBE6', '#F5C77E', '#8FD6B4'][i % 3];
  const dark = ['#019ACB', '#D89F3C', '#4FB68B'][i % 3];
  return (
    <g className="hk-kid" style={{ animationDelay: `${i * 90}ms` }}>
      <ellipse cx={x} cy={y + 1.5} rx={w * 0.62} ry={w * 0.19} fill="rgba(90,62,34,0.20)"/>
      {/* ноги */}
      <rect x={x - w * 0.26} y={y - body * 0.34} width={w * 0.2} height={body * 0.34} rx={w * 0.09} fill="#5C6B78"/>
      <rect x={x + w * 0.06} y={y - body * 0.34} width={w * 0.2} height={body * 0.34} rx={w * 0.09} fill="#5C6B78"/>
      {/* корпус: футболка с тенью сбоку */}
      <path d={`M${x - w / 2} ${y - body} q${w / 2} ${-w * 0.18} ${w} 0 v${body * 0.66} q${-w / 2} ${w * 0.12} ${-w} 0 Z`} fill={shirt}/>
      <path d={`M${x + w * 0.16} ${y - body} q${w * 0.34} ${-w * 0.1} ${w * 0.34} 0 v${body * 0.66} q${-w * 0.17} ${w * 0.05} ${-w * 0.34} 0 Z`} fill={dark} opacity="0.24"/>
      {/* руки */}
      <rect x={x - w * 0.62} y={y - body * 0.94} width={w * 0.16} height={body * 0.5} rx={w * 0.08} fill={shirt}/>
      <rect x={x + w * 0.46} y={y - body * 0.94} width={w * 0.16} height={body * 0.5} rx={w * 0.08} fill={shirt}/>
      {/* голова: ребята смотрят на тренера, поэтому лицо видно */}
      <circle cx={x} cy={y - body - head * 0.52} r={head} fill="#F1C9A5"/>
      <path d={`M${x - head} ${y - body - head * 0.72} a${head} ${head} 0 0 1 ${head * 2} 0 z`} fill="#4A3A2E"/>
      <circle cx={x - head * 0.36} cy={y - body - head * 0.5} r={head * 0.13} fill="#3C3128"/>
      <circle cx={x + head * 0.36} cy={y - body - head * 0.5} r={head * 0.13} fill="#3C3128"/>
      <path d={`M${x - head * 0.3} ${y - body - head * 0.16} q${head * 0.3} ${head * 0.24} ${head * 0.6} 0`}
        stroke="#B9805C" strokeWidth={head * 0.11} fill="none" strokeLinecap="round"/>
    </g>
  );
};

const GymBg = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="hkSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BFDDEF"/><stop offset="100%" stopColor="#E8F3FA"/>
      </linearGradient>
      <linearGradient id="hkWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F8F3EA"/><stop offset="100%" stopColor="#E7DFD0"/>
      </linearGradient>
      <linearGradient id="hkCloth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF7350"/><stop offset="100%" stopColor="#D8391A"/>
      </linearGradient>
      <linearGradient id="hkFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E7D0AE"/><stop offset="100%" stopColor="#FBF0DE"/>
      </linearGradient>
      <linearGradient id="hkBall" x1="0.3" y1="0.2" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#FFAE63"/><stop offset="100%" stopColor="#DF7A24"/>
      </linearGradient>
      <radialGradient id="hkBeam" cx="0.5" cy="0" r="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect x="0" y="0" width="400" height="154" fill="url(#hkWall)"/>

    {/* окна: низ на 1,1 м, высота 1,8 м */}
    {[96, 232].map((x) => (
      <g key={x}>
        <rect x={x - 4} y="16" width="70" height="63" rx="3" fill="#DED3BE"/>
        <rect x={x} y="20" width="62" height="55" fill="url(#hkSky)"/>
        <rect x={x + 30} y="20" width="2" height="55" fill="#C6B9A2"/>
        <rect x={x} y="46" width="62" height="2" fill="#C6B9A2"/>
        <rect x={x - 7} y="75" width="76" height="5" rx="2" fill="#D5C9B1"/>
        <path d={`M${x} 20 L${x + 62} 20 L${x + 40} 75 L${x + 14} 75 Z`} fill="#FFFFFF" opacity="0.22"/>
      </g>
    ))}

    {/* шведская стенка 2,6 м */}
    <g>
      <rect x="14" y="30" width="6" height="80" rx="2" fill="#D9A971"/>
      <rect x="70" y="30" width="6" height="80" rx="2" fill="#D9A971"/>
      <rect x="14" y="30" width="6" height="80" rx="2" fill="#FFFFFF" opacity="0.22"/>
      {[36, 48, 60, 72, 84, 96].map((y) => (
        <g key={y}>
          <rect x="14" y={y} width="62" height="5" rx="2.5" fill="#E8BE8B"/>
          <rect x="14" y={y} width="62" height="1.8" rx="0.9" fill="#F6DAB4"/>
        </g>
      ))}
    </g>

    {/* кольцо: ринг на 3,05 м, щит уходит за верхний край — как в жизни */}
    <g>
      <rect x="318" y="-16" width="60" height="36" rx="2" fill="#FDFBF7" stroke="#C9BFAE" strokeWidth="2"/>
      <rect x="335" y="-2" width="26" height="17" fill="none" stroke="#FF4F28" strokeWidth="2"/>
      <ellipse cx="348" cy="20" rx="13" ry="3.4" fill="none" stroke="#FF4F28" strokeWidth="2.6"/>
      <path d="M337 22 L341 34 M348 23 L348 36 M359 22 L355 34 M341 29 L355 29" stroke="#D8CFC0" strokeWidth="1.4" fill="none"/>
    </g>

    {/* баннер турнира над головами */}
    <g className="hk-banner">
      <rect x="199" y="0" width="2" height="10" fill="#C9BFAE"/>
      <path d="M154 10 H246 V34 l-11.5 6 -11.5 -6 -11.5 6 -11.5 -6 -11.5 6 -11.5 -6 -11.5 6 -11.5 -6 Z" fill="url(#hkCloth)"/>
      <path d="M154 10 H246 V17 H154 Z" fill="#FFFFFF" opacity="0.16"/>
      <rect x="166" y="17" width="68" height="5" rx="2.5" fill="#FFE8E1"/>
      <rect x="178" y="26" width="44" height="5" rx="2.5" fill="#FFB59F"/>
    </g>

    {/* табло под кольцом: раньше оно налезало на баннер */}
    <g>
      <rect x="312" y="46" width="72" height="32" rx="4" fill="#494550"/>
      <rect x="312" y="46" width="72" height="9" rx="4" fill="#FFFFFF" opacity="0.10"/>
      <rect x="318" y="51" width="60" height="17" rx="3" fill="#101014"/>
      <text x="348" y="64" textAnchor="middle" fill="#7ECBE6"
        fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="700">24</text>
      <rect x="318" y="70" width="60" height="4" rx="2" fill="#6E6A75"/>
    </g>

    {/* скамейка 0,45 м */}
    <g>
      <rect x="12" y="96" width="72" height="7" rx="3" fill="#E6BC93"/>
      <rect x="12" y="96" width="72" height="2.4" rx="1.2" fill="#F6DAB4"/>
      <rect x="12" y="104" width="72" height="4" rx="2" fill="#CE9E74"/>
      <rect x="19" y="108" width="6" height="8" rx="2" fill="#B8875D"/>
      <rect x="71" y="108" width="6" height="8" rx="2" fill="#B8875D"/>
      <ellipse cx="48" cy="118" rx="40" ry="3.4" fill="rgba(90,62,34,0.14)"/>
    </g>

    {/* плинтус, пол, свет из окон, разметка */}
    <rect x="0" y={GYM_FLOOR - 4} width="400" height="4" fill="#DCD1BD"/>
    <rect x="0" y={GYM_FLOOR} width="400" height={154 - GYM_FLOOR} fill="url(#hkFloor)"/>
    {Array.from({ length: 13 }).map((_, i) => (
      <path key={i} d={`M${i * 32 + 8} ${GYM_FLOOR} L${(i * 32 + 8 - 200) * 1.5 + 200} 154`}
        stroke="#E4CBA9" strokeWidth="1" opacity="0.55" fill="none"/>
    ))}
    <path d={`M128 ${GYM_FLOOR} L104 154 L176 154 L190 ${GYM_FLOOR} Z`} fill="url(#hkBeam)"/>
    <path d={`M236 ${GYM_FLOOR} L232 154 L304 154 L298 ${GYM_FLOOR} Z`} fill="url(#hkBeam)"/>
    <path d={`M0 ${GYM_FLOOR + 16} H400`} stroke="#E4CBA9" strokeWidth="1.6" fill="none" opacity="0.8"/>

    {/* мяч 24 см, один прокат при входе */}
    <g className="hk-ball">
      <ellipse cx="150" cy="150" rx="9" ry="2.6" fill="rgba(90,62,34,0.18)"/>
      <circle cx="150" cy="143" r="8" fill="url(#hkBall)"/>
      <path d="M142 143h16M150 135v16M145 137.5c2.6 3.4 2.6 7.6 0 11M155 137.5c-2.6 3.4-2.6 7.6 0 11"
        stroke="#A85A17" strokeWidth="1" fill="none"/>
    </g>

    {/* ребята полукругом, лицом к тренеру */}
    {gymSpots().map((sp, i) => <GymKid key={i} {...sp} i={i}/>)}
  </svg>
);

// СЦЕНА ФИНАЛА (методист 2026-08-14). Урок закрывается тем же залом, где
// начался. Хук спрашивал «по пять или по шесть» — вот ответ на площадке:
// четыре команды по шесть, и скамейка ПУСТАЯ, никто не остался без места.
// Полоса нарочно низкая (400x92): под ней на итоге ещё три карточки, и на
// 1366x768 весь экран должен уместиться без скролла.
const FIN_TEAMS = 4;
const FIN_IN_TEAM = 6;
const FIN_SHIRTS = [
  { body: '#7ECBE6', edge: '#019ACB' },
  { body: '#F5C77E', edge: '#D89F3C' },
  { body: '#8FD6B4', edge: '#4FB68B' },
  { body: '#F2A79E', edge: '#D06F5E' },
];
// Дети одного возраста, но не одного роста. Разброс фиксированный, не
// случайный: скриншот проверки должен быть повторяемым.
const FIN_DH = [0, -1.4, 0.9, -0.7, 1.3, -1.1];
const FIN_HAIR = ['#4A3A2E', '#3E3128', '#5A4636', '#4A3A2E', '#3E3128', '#54402F'];

const FinalScene = () => (
  <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
    <defs>
      <linearGradient id="finWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9F4EB"/><stop offset="100%" stopColor="#EDE6D9"/>
      </linearGradient>
      <linearGradient id="finFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAD6B8"/><stop offset="100%" stopColor="#FBF1E0"/>
      </linearGradient>
      <linearGradient id="finCloth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF7350"/><stop offset="100%" stopColor="#D8391A"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="400" height="92" fill="url(#finWall)"/>

    {/* окна зала по сторонам от баннера */}
    {[32, 314].map((x) => (
      <g key={x}>
        <rect x={x - 3} y="7" width="56" height="30" rx="3" fill="#DFD4BF"/>
        <rect x={x} y="10" width="50" height="24" fill="#DCEDF5"/>
        <rect x={x + 24} y="10" width="2" height="24" fill="#C6B9A2"/>
      </g>
    ))}

    {/* баннер: ответ на вопрос хука */}
    <g>
      <rect x="199" y="0" width="2" height="5" fill="#C9BFAE"/>
      <path d="M152 5 H248 V24 l-12 5 -12 -5 -12 5 -12 -5 -12 5 -12 -5 -12 5 -12 -5 Z" fill="url(#finCloth)"/>
      <text x="200" y="19" textAnchor="middle" fill="#FFECE6"
        fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">4 &#215; 6 = 24</text>
    </g>

    {/* пол */}
    <rect x="0" y="58" width="400" height="3" fill="#DBD0BB"/>
    <rect x="0" y="61" width="400" height="31" fill="url(#finFloor)"/>

    {/* ПУСТАЯ скамейка: в хуке на ней сидели четверо лишних */}
    <g>
      <rect x="6" y="70" width="48" height="4" rx="2" fill="#E6BC93"/>
      <rect x="6" y="75" width="48" height="2.4" rx="1.2" fill="#CE9E74"/>
      <rect x="11" y="77" width="3.4" height="6" rx="1.4" fill="#B8875D"/>
      <rect x="45" y="77" width="3.4" height="6" rx="1.4" fill="#B8875D"/>
    </g>

    {/* четыре команды по шесть */}
    {Array.from({ length: FIN_TEAMS }).map((_, ti) => {
      const x0 = 72 + ti * 82;
      const sh = FIN_SHIRTS[ti];
      return (
        <g key={ti} className="fin-team" style={{ animationDelay: `${260 + ti * 150}ms` }}>
          <rect x={x0 - 5} y="64" width="78" height="25" rx="7" fill={sh.body} opacity="0.15"/>
          <text x={x0 + 34} y="59" textAnchor="middle" fill={sh.edge}
            fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="700">6</text>
          {Array.from({ length: FIN_IN_TEAM }).map((_, k) => {
            const cx = x0 + 6 + k * 12;
            const dh = FIN_DH[(k + ti) % FIN_DH.length];   // ростом чуть разные
            const ty = 74 + dh;                            // плечи
            const hy = 69.5 + dh;                          // голова
            return (
              <g key={k}>
                <ellipse cx={cx} cy="86.5" rx="5" ry="1.5" fill="rgba(90,62,34,0.16)"/>
                <path d={`M${cx - 4.2} ${ty} q4.2 -1.8 8.4 0 v${86 - ty} q-4.2 1.2 -8.4 0 Z`} fill={sh.body}/>
                <rect x={cx - 4.2} y={ty + 5} width="8.4" height="1.5" fill={sh.edge} opacity="0.3"/>
                <circle cx={cx} cy={hy} r="3.6" fill="#F1C9A5"/>
                <path d={`M${cx - 3.6} ${hy - 0.9} a3.6 3.6 0 0 1 7.2 0 z`} fill={FIN_HAIR[(k + ti * 2) % FIN_HAIR.length]}/>
              </g>
            );
          })}
        </g>
      );
    })}
  </svg>
);

// ХУК ПРИНИМАЕТ ОТВЕТ И ЗАКРЫВАЕТСЯ (методист 2026-08-14).
// Так работают хуки 1-5 классов (в 5 классе прогноз вообще уходит без реакции)
// и — что важнее — так работают все остальные уроки 6 класса: и движок
// FractionTheoryLesson (уроки 8-46), и собранные вручную уроки 2-7 делают
// pick -> onAnswer -> onNext, без разбора и без оценки. Урок 1 был здесь
// единственным исключением: он показывал разлёт по командам, скамейку с
// четырьмя лишними, формулу 24 : 5 = 4 и вывод. Это тот самый факт, который
// ребёнок должен получить сам на экране 6 («решаем вместе: 24»), поэтому весь
// разбор и движок сцены с командами убраны.
const HookScreen = ({ screen, totalScreens, onAnswer, onNext, onPrev }) => {
  const c = CONTENT.s_hook;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([
    { id: 'hook_a0', text: pickL(c.audio.intro, lang)[0], trigger: 'on_mount', waits_for: null },
    { id: 'hook_a1', text: pickL(c.audio.intro, lang)[1], trigger: 'after_previous', waits_for: { type: 'option_picked' } },
  ]);
  const [picked, setPicked] = useState(null);
  const pickedRef = useRef(false);
  const askReady = audio.muted
    || audio.currentSegment === 'hook_a1'
    || audio.lastCompletedSegment === 'hook_a0'
    || audio.lastCompletedSegment === 'hook_a1';
  // Механика показа жеста снята вместе со стикером (методист 2026-08-14):
  // два состояния и два таймера гоняли кисть над кнопками. Держать мёртвый
  // код «на случай возврата» нельзя — он выглядит рабочим и вводит в заблуждение.

  const pick = (size) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(size);
    audio.triggerEvent('option_picked');
    // correct и firstTry — null: экран вне оценки, статистика его не считает.
    onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: size === 6 ? 'po 6' : 'po 5', correct: null, firstTry: null });
    // Ответ принят — экран закрывается сам, как в остальных уроках класса.
    // Задержка нужна, чтобы ребёнок увидел, какая плитка отметилась выбранной.
    setTimeout(onNext, 320);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(picked === null || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="hk">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ margin: 0 }}>{t(c.lead)}</p>
        <div className="hk-voices fade-up delay-1">
          <div className="hk-voice">
            <span className="hk-who">A</span>
            <p className="small" style={{ margin: 0 }}>{t(c.voice_a)}</p>
          </div>
          <div className="hk-voice">
            <span className="hk-who hk-who-b">D</span>
            <p className="small" style={{ margin: 0 }}>{t(c.voice_b)}</p>
          </div>
        </div>

        {/* Зал стоит на экране всё время, пока экран открыт: сцена больше не
            подменяется разбором. Ребята нарисованы ВНУТРИ сцены — только так их
            можно поставить полукругом и дать ближним больший размер. */}
        <div className="frame hk-frame fade-up delay-1">
          <div className="hk-gym"><GymBg/></div>
        </div>

        {askReady && (
          <div className="hk-ask fade-up">
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>{t(c.ask)}</p>
            {/* Стикер руки над вариантами снят (методист 2026-08-14): он
                проезжал поверх кнопок и мешал. Подпись остаётся — и жест, и
                обещание «ответ не открываем» объяснены словами. */}
            <p className="small g6-hook-note">{t(c.gesture)}</p>
            {/* Разметка вариантов — классная: `g6-hook-options` и
                `is-hook-picked` из Grade6TheoryTheme.css, те же, что в уроках
                8-46. Своих правил хук больше не держит: одинаковый хук должен
                выглядеть одинаково, включая телефон и низкие экраны. */}
            <div className="g6-hook-options">
              {[5, 6].map((size) => (
                <button key={size} className={'option' + (picked === size ? ' is-hook-picked' : '')}
                  disabled={picked !== null} onClick={() => pick(size)}>
                  {t(size === 5 ? c.opt_5 : c.opt_6)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАН 07 — «сначала показали, потом сам» (методист 2026-08-13).
// Было: свободное поле ввода — ребёнок набирал любое число. Именно это
// методисту не понравилось: экран превращался в калькулятор без цели.
// Стало: приём 3 класса, урок 1 (TapBinDemo). Один экран, два состояния.
//   phase === 'demo'  показ: 24 плитки сами сыплются и ложатся в 4 ряда по 6,
//                    остатка нет, вывод «делится ровно». Ребёнок не нажимает
//                    ничего. Дальше кнопки «Ещё раз» и «Теперь я сам».
//   phase === 'play'  очередь ребёнка: число 25 задано, он выбирает делитель
//                    и жмёт «Проверить». На шести лишняя плитка уезжает в
//                    зону остатка — тот же ход, что он только что видел.
// Верного ответа тут нет — есть факт делимости, поэтому оценки на экране нет.
// ============================================================
const TL_H = 156;
const TL_BASE = 44;
const TL_FALL = 440;
const TL_MOVE = 620;
const TL_STAG = 30;
const TL_SIZES = [44, 38, 32, 28, 24, 20, 17, 14, 12, 10];
const TL_DEMO_N = 24;
const TL_DEMO_D = 6;
const TL_PLAY_N = 25;
const TL_DIVS = [2, 3, 4, 5, 6, 7, 8, 9];

const tlHeap = (i, n, W) => {
  // Куча выглядит случайной, но считается по номеру плитки: Math.random дёргал
  // бы её при каждом рендере.
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.678;
  const rx = (a - Math.floor(a)) - 0.5;
  const ry = (b - Math.floor(b)) - 0.5;
  const spread = Math.min(Math.max(W - 80, 80), 60 + n * 9);
  return [W / 2 - 22 + rx * spread, TL_H / 2 - 30 + ry * 46];
};

// Прямоугольник кладётся ДЛИННОЙ СТОРОНОЙ ВБОК (методист 2026-08-13).
// Было: в строке ровно `d` плиток, и при делителе 2 получался столбец шириной
// в две плитки и высотой в двенадцать — сцена пустая по бокам, а плитки не
// видно. Стало: длинная сторона всегда горизонтальна.
// На математику это не влияет: прямоугольник два на двенадцать и двенадцать
// на два — один и тот же факт, а подпись под сценой называет числа явно.
const tlFit = (n, d, W) => {
  const q = Math.floor(n / d);
  const rem = n - q * d;
  const cols = Math.max(d, q);
  const rows = Math.min(d, q);
  const availH = TL_H - 8 - (rem ? 52 : 0);
  const availW = Math.max(W - 16, 80);
  let s = 10;
  let g = 3;
  for (let i = 0; i < TL_SIZES.length; i += 1) {
    s = TL_SIZES[i];
    g = Math.max(2, Math.round(s * 0.16));
    if (rows * (s + g) - g <= availH && cols * (s + g) - g <= availW) break;
  }
  return { rows, cols, rem, s, g, placed: rows * cols };
};

const ToolScreen = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);

  const frameRef = useRef(null);
  const sceneRef = useRef(null);
  const divRowRef = useRef(null);
  const goRef = useRef(null);
  const timersRef = useRef([]);
  const demoRunRef = useRef(-1);
  const handCountRef = useRef(0);

  const [W, setW] = useState(0);
  // Куда указывает кисть, считается из offsetLeft/offsetTop живых кнопок, а не
  // из зашитых координат: на телефоне ряд делителей переносится на две строки.
  const [spots, setSpots] = useState({ divX: 0, divY: 0, goX: 0, goY: 0, ready: false });
  const [phase, setPhase] = useState('demo');
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState(null);        // { n, d } — что сейчас на сцене
  const [tilePhase, setTilePhase] = useState(0);
  const [shown, setShown] = useState(false);   // вывод виден
  const [demoDone, setDemoDone] = useState(false);
  const [div, setDiv] = useState(null);
  const [checks, setChecks] = useState(0);
  const [hintGone, setHintGone] = useState(false);
  const [handPhase, setHandPhase] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (sceneRef.current) setW(sceneRef.current.offsetWidth);
      const d = divRowRef.current;
      const g = goRef.current;
      setSpots({
        divX: d ? d.offsetLeft + 21 : 0,
        divY: d ? d.offsetTop + 22 : 0,
        goX: g ? g.offsetLeft + g.offsetWidth / 2 : 0,
        goY: g ? g.offsetTop + 22 : 0,
        ready: Boolean(d && g),
      });
    };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    // Одного resize НЕ хватает: ряд делителей переносится и кнопка уезжает вниз,
    // а кисть осталась бы указывать в пустоту.
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && frameRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(frameRef.current);
    }
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [phase]);
  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const later = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => clearTimers(), []);

  const say = (text, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(text, undefined, id);
  };

  // Один и тот же прогон и в показе, и в очереди ребёнка: плитки сыплются в
  // кучу, потом переезжают в ряды, лишние уходят в зону остатка.
  const runCheck = (n, d, onEnd) => {
    setRun({ n, d });
    setShown(false);
    setTilePhase(0);
    later(() => setTilePhase(1), 30);
    const fallEnd = (n - 1) * TL_STAG + TL_FALL + 60;
    later(() => setTilePhase(2), fallEnd);
    later(() => { setShown(true); if (onEnd) onEnd(); }, fallEnd + TL_MOVE + (n - 1) * TL_STAG + 60);
  };

  // Показ запускается сам. `demoRunRef` держит номер прогона: без него любое
  // измерение ширины (resize, ResizeObserver) перезапускало бы показ с нуля.
  useEffect(() => {
    if (phase !== 'demo' || !W || demoRunRef.current === replay) return;
    demoRunRef.current = replay;
    later(() => runCheck(TL_DEMO_N, TL_DEMO_D, () => {
      setDemoDone(true);
      say(pickL(c.audio.demo_done, lang), 's_tool_demo_done');
    }), 700);
    /* eslint-disable-next-line */
  }, [phase, W, replay]);

  const touched = () => { clearTimers(); setHandPhase(0); setHintGone(true); };

  const replayDemo = () => {
    clearTimers();
    setRun(null); setShown(false); setTilePhase(0); setDemoDone(false);
    setReplay((v) => v + 1);
  };

  const toPlay = () => {
    clearTimers();
    setPhase('play');
    setRun(null); setShown(false); setTilePhase(0); setDemoDone(false); setDiv(null);
    say(pickL(c.audio.play_start, lang), 's_tool_play');
  };

  const busy = run !== null && !shown;
  const start = () => {
    touched();
    if (run && shown) {
      // «Ещё раз» — сцена возвращается в исходное, выбор делителя сбрасывается.
      setRun(null); setShown(false); setTilePhase(0); setDiv(null);
      return;
    }
    if (div === null) return;
    runCheck(TL_PLAY_N, div, () => {
      setChecks((v) => v + 1);
      const okNow = TL_PLAY_N % div === 0;
      say(pickL(okNow ? c.audio.ok : c.audio.no, lang), okNow ? 's_tool_ok' : 's_tool_no');
    });
  };

  // Показ жеста: кисть касается ряда делителей, потом кнопки — ничего не
  // выбирая. На верный делитель (пятёрку) не указывает: первая плитка это 2.
  useEffect(() => {
    if (phase !== 'play' || hintGone || handCountRef.current >= 2 || !spots.ready) return undefined;
    const id = setTimeout(() => {
      handCountRef.current += 1;
      setHandPhase(1);
      later(() => setHandPhase(2), 760);
      later(() => setHandPhase(3), 1560);
      later(() => setHandPhase(0), 2040);
    }, handCountRef.current === 0 ? 900 : 4000);
    return () => clearTimeout(id);
    /* eslint-disable-next-line */
  }, [phase, hintGone, handPhase === 0, spots.ready, spots.goX]);

  const fit = run ? tlFit(run.n, run.d, W) : null;
  const tiles = !run ? [] : Array.from({ length: run.n }).map((_, i) => {
    const [hx, hy] = tlHeap(i, run.n, W);
    if (tilePhase === 0) return { x: hx, y: -70, s: TL_BASE, extra: false, dur: 0, delay: 0 };
    if (tilePhase === 1) return { x: hx, y: hy, s: TL_BASE, extra: false, dur: TL_FALL, delay: i * TL_STAG };
    const gw = fit.cols * (fit.s + fit.g) - fit.g;
    const gh = fit.rows * (fit.s + fit.g) - fit.g;
    const left = Math.max(4, (W - gw) / 2);
    const top = fit.rem ? 4 : Math.max(4, (TL_H - gh) / 2);
    if (i < fit.placed) {
      const r = Math.floor(i / fit.cols);
      const col = i % fit.cols;
      return { x: left + col * (fit.s + fit.g), y: top + r * (fit.s + fit.g), s: fit.s, extra: false, dur: TL_MOVE, delay: i * TL_STAG };
    }
    const k = i - fit.placed;
    const rs = fit.rem > 5 ? Math.min(fit.s, 20) : Math.min(fit.s, 28);
    return { x: 22 + k * (rs + 6), y: TL_H - 48 + 6 + (44 - rs) / 2, s: rs, extra: true, dur: TL_MOVE, delay: i * TL_STAG };
  });

  const ok = run && run.n % run.d === 0;
  const formula = !run || !shown
    ? ''
    : (ok
      ? `${run.n} : ${run.d} = ${run.n / run.d}`
      : `${run.n} : ${run.d} = ${Math.floor(run.n / run.d)}, ${t(CONTENT.s4.rest_label)} ${run.n % run.d}`);
  const note = !run || !shown
    ? ''
    : String(t(ok ? c.note_ok : c.note_no)).replace(/\{n\}/g, String(run.n)).replace(/\{d\}/g, String(run.d));
  const shapeCap = !run || !fit
    ? ''
    : String(t(c.shape)).replace('{a}', String(fit.rows)).replace('{b}', String(fit.cols));
  const goLabel = run && shown ? t(c.again) : t(c.go);
  const goOff = busy || (!run && div === null);
  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(checks < 1 || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const handX = handPhase >= 2 ? spots.goX : spots.divX;
  const handY = handPhase >= 2 ? spots.goY : spots.divY;

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <div className="rs-top fade-up">
          <h2 className="title h-sub" style={{ margin: 0 }}>{t(c.title)}</h2>
          {phase === 'play' && (
            <span className={'rs-hint' + (hintGone ? ' rs-gone' : ' rs-pulse')}>{t(c.play_hint)}</span>
          )}
        </div>

        {/* Баннер честно говорит, чья сейчас очередь: смотреть или делать. */}
        <div className={'tl-banner fade-up' + (phase === 'play' ? ' tl-banner-play' : '')}>
          <span aria-hidden="true">{phase === 'play' ? '✋' : '👀'}</span>
          <span>
            {phase === 'play'
              ? t(c.play_banner)
              : `${t(c.demo_banner)}: ${TL_DEMO_N} : ${TL_DEMO_D}`}
          </span>
        </div>

        <div className="frame fade-up delay-1" ref={frameRef}
          style={{ padding: 'clamp(10px, 1.8vw, 15px)', position: 'relative' }}>
          <div className="tl-ctl">
            <span className="tl-grp">
              <span className="tl-step">{t(c.step_num)}</span>
              <span className="tl-num">{phase === 'play' ? TL_PLAY_N : TL_DEMO_N}</span>
            </span>
            <span className="tl-grp">
              <span className="tl-step">{t(c.step_div)}</span>
              {phase === 'demo'
                ? <span className="tl-num">{TL_DEMO_D}</span>
                : (
                  <span className="tl-divs" ref={divRowRef}>
                    {TL_DIVS.map((d) => (
                      <button key={d} className={'tl-div' + (div === d ? ' tl-div-sel' : '')}
                        disabled={busy}
                        onClick={() => { touched(); setDiv(d); }}>{d}</button>
                    ))}
                  </span>
                )}
            </span>
            {phase === 'play' && (
              <span className="tl-grp">
                <span className="tl-step">&nbsp;</span>
                <button className="tl-go" ref={goRef} disabled={goOff} onClick={start}>{goLabel}</button>
              </span>
            )}
          </div>

          <div className={'rs-scene tl-scene' + (shown ? (ok ? ' tl-scene-ok' : ' tl-scene-no') : '')} ref={sceneRef}>
            <p className={'tl-empty' + (run || phase === 'demo' ? ' tl-empty-off' : '')}>{t(c.empty)}</p>
            <div className={'rs-zone tl-zone' + (fit && fit.rem ? ' rs-zone-on' : '')}
              style={{ left: 8, right: 8, width: 'auto', marginLeft: 0 }}>
              <span className="rs-zone-lab">{t(CONTENT.s4.rest_label)} {fit && fit.rem ? fit.rem : ''}</span>
            </div>
            {/* Участник — та же фигурка с лицом, что на экранах 2, 3 и в зале
                (методист 2026-08-14). Был кружок, и один и тот же участник
                выглядел на трёх экранах подряд по-разному. */}
            {tiles.map((p, i) => (
              <div key={i} className={'rs-tile' + (p.extra ? ' rs-tile-extra' : '')}
                style={{
                  transform: `translate(${p.x}px, ${p.y}px) scale(${p.s / TL_BASE})`,
                  // Задержка ВНУТРИ сокращённой записи: React предупреждает, если
                  // в одном стиле смешаны `transition` и `transitionDelay`.
                  transition: `transform ${p.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay}ms`,
                }}>
                <Unit s={TL_BASE} i={i} tone={p.extra ? 'rest' : 'ok'}/>
              </div>
            ))}
          </div>

          <div className="rs-out">
            <div className={'rs-formula' + (shown ? ' rs-on' : '')}>{formula}</div>
            {/* Прямоугольник кладётся длинной стороной вбок, поэтому подпись
                НАЗЫВАЕТ стороны: иначе непонятно, где делитель, а где частное. */}
            <div className={'rs-shape' + (shown && fit ? ' rs-on' : '')}>{shapeCap}</div>
            <div className={'rs-note ' + (ok ? 'rs-note-ok' : 'rs-note-no') + (shown ? ' rs-on' : '')}>{note}</div>
          </div>

          {phase === 'play' && (
            <span className="rs-hand" aria-hidden="true"
              style={{
                transform: `translate(${handX}px, ${handY + (handPhase === 0 ? 26 : 0)}px)`,
                opacity: handPhase === 0 ? 0 : 1,
                transition: 'transform 440ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 440ms linear',
              }}>
              <HandSticker/>
            </span>
          )}
        </div>

        {/* Переход из показа в свою очередь делает РЕБЁНОК, а не таймер: пока он
            не сказал «теперь я сам», показ можно смотреть сколько угодно раз. */}
        {/* Способ НАЗЫВАЕТСЯ и записывается шагами. Раньше метод жил только
            в подсказке после ошибки: тот, кто отвечал верно, его не видел. */}
        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={shown ? 2 : (run ? 1 : 0)}/>

        {phase === 'demo' && (
          <div className="tl-acts fade-up">
            <button className="tl-replay" disabled={!demoDone} onClick={replayDemo}>&#8635; {t(c.again)}</button>
            <button className="tl-next" disabled={!demoDone} onClick={toPlay}>{t(c.to_play)} &#8594;</button>
          </div>
        )}

        {phase === 'play' && <p className="small tl-task" style={{ margin: 0, color: T.ink3 }}>{t(c.task)}</p>}
      </div>
    </Stage>
  );
};

// Savolli slaydlardagi yakuniy ketma-ketlik:
// "To'g'ri" -> "Nega shunday" -> qatorlar bittadan -> "Bilasizmi?".
// Har bir vizual blok aynan o'z audio segmenti BOSHLANGANDA ochiladi.
const WHY_TITLE = { ru: 'Почему так', uz: 'Nega shunday', en: 'Why it works' };
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
// ============================================================
// FIKR-MULOHAZA HOLAT BO'YICHA (metodist qarori 2026-08-13).
// Ilgari «hammasi emas, maslahatga qara» IKKALA holatda ham chiqardi: bola
// to'g'ri ketayotganda ham xato qilgan kabi eshitardi — bu qo'lni tushiradi.
// Endi uch holat ajratiladi: to'g'ri lekin yetmaydi / ortiqcha tanlangan / tugadi.
// Matnlar UMUMIY: bu obvyazka fikri, dars kontenti emas.
// ============================================================
const PD_FB = {
  partial: {
    ru: 'Верно, эти делители на месте. Осталось найти ещё {left}.',
    uz: "To'g'ri, bu bo'luvchilar joyida. Yana {left} tasini topish qoldi.",
    en: 'Correct, these divisors are in place. {left} more to find.',
  },
  extra_one: {
    ru: 'Одно число лишнее, оно отмечено. Проверь его делением.',
    uz: "Bitta son ortiqcha, u belgilangan. Uni bo'lib tekshiring.",
    en: 'One number does not belong, it is marked. Check it by dividing.',
  },
  extra_many: {
    ru: 'Лишних чисел несколько, они отмечены. Проверь их делением.',
    uz: "Bir nechta son ortiqcha, ular belgilangan. Ularni bo'lib tekshiring.",
    en: 'Several numbers do not belong, they are marked. Check them by dividing.',
  },
};

// `asideNode` — необязательная опора под заданием (методист 2026-08-14):
// урок 1 кладёт туда карточку способа. По умолчанию пусто, поэтому уроки
// 2-46, которые тоже берут этот компонент, не меняются.
const PickDivisors = ({ screen, screenContent, totalScreens, onNext, onPrev, storedAnswer, onAnswer, whyNode, factNode, asideNode = null, retryMode = false }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_intro`, text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [sel, setSel] = useState([]);
  const [locked, setLocked] = useState([]);
  const [dead, setDead] = useState([]);
  const [reviewWrong, setReviewWrong] = useState([]);
  const [reviewActive, setReviewActive] = useState(false);
  const [solved, setSolved] = useState(!!storedAnswer);
  const [showHint, setShowHint] = useState(false);
  const [fbState, setFbState] = useState(null); // null | 'partial' | 'extra'
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
    // Ikki holat ajratiladi. Ortiqcha son tanlanmagan bo'lsa — bu XATO EMAS,
    // bola shunchaki hammasini topmagan: maslahat chiqmaydi, «to'g'ri, yana
    // shuncha qoldi» chiqadi. Ortiqcha bo'lsa — o'shanda maslahat va izoh.
    const left = divs.length - nextLocked.length;
    if (bad.length) {
      setFbState('extra');
      setShowHint(true);
    } else {
      setFbState('partial');
      setShowHint(false);
    }
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) {
        engine.interruptFeedbackQueue();
        engine.pushOneOff(bad.length
          ? toTtsMath(pickL(c.audio.on_wrong, lang), lang)
          : String(pickL(PD_FB.partial, lang)).replace('{left}', String(left)));
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
    setFbState(null);
    if (!audio.muted) {
      const engine = getAudioEngine();
      if (engine) engine.interruptFeedbackQueue();
    }
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={navLocked(!solved || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/></>);
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
              <button className="btn" onClick={retry} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{tri(lang, 'Попробовать снова', 'Qayta urinish', 'Try again')}</button>
            ) : (
              <button className="btn-white-accent" disabled={!sel.length || solved} onClick={check} style={{ marginLeft: 'auto', padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{tri(lang, 'Проверить', 'Tekshirish', 'Check')}</button>
            )}
          </div>
        </div>
        {asideNode}
        {solved && (
          <div ref={fbRef}>
            <FeedbackBlock show={true} isCorrect={true}>
              <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{tri(lang, 'Верно', "To'g'ri", 'Correct')}</p>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            </FeedbackBlock>
          </div>
        )}
        {solved && post.showWhy && whyNode && (
          <div ref={whyRef}>{React.cloneElement(whyNode, { visibleCount: post.visibleWhyLines })}</div>
        )}
        {solved && post.showFact && factNode && <div ref={factRef}>{factNode}</div>}
        {/* To'g'ri ketayotgan bola YASHIL qator ko'radi, sariq maslahat emas.
            Ortiqcha son tanlansa — qizil izoh, undan keyin maslahat. */}
        {!solved && fbState === 'partial' && (
          <div className="frame-success fade-up">
            <p className="body" style={{ margin: 0 }}>
              {String(t(PD_FB.partial)).replace('{left}', String(divs.length - locked.length))}
            </p>
          </div>
        )}
        {!solved && fbState === 'extra' && (
          <div className="frame-soft fade-up">
            <p className="body" style={{ margin: 0 }}>
              {t((retryMode ? reviewWrong : dead).length > 1 ? PD_FB.extra_many : PD_FB.extra_one)}
            </p>
          </div>
        )}
        {!solved && <HintBlock show={showHint}>{mt(t(c.hint))}</HintBlock>}
      </div>
    </Stage>
  );
};

// Qoida ekrani (s3, s6): ikki qoida qatori (pale-yellow) + misol.
const RuleScreen = ({ screen, screenContent, onNext, onPrev, totalScreens, exampleNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: `s${screen}_a`, text: pickL(c.audio, lang), trigger: 'on_mount', waits_for: null }]);
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

// Tasniflash (s12) — son bittalab chiqadi, bola savatni bosadi; веди-до-верного; joylanganlar yashil chip.
const Classify = ({ screen, screenContent, onNext, onPrev, storedAnswer, onAnswer, totalScreens, whyNode }) => {
  const c = screenContent;
  const t = useT();
  const lang = useLang();
  const cards = c.cards;
  const total = cards.length;
  const audio = useAudio([{ id: `s${screen}_intro`, text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
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
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={navLocked(!solved || !audio.canAdvance)} onClick={onNext} label={<NextLabel/>}/></>);
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
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{tri(lang, 'Верно', "To'g'ri", 'Correct')}</p>
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
  const audio = useAudio([{ id: `s${screen}_intro`, text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
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

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={navLocked(!solved || !audio.canAdvance)} onClick={onNext} label={<NextLabel/>}/></>);
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
                      {!solved && <button onClick={(e) => clearSlot(k, e)} aria-label={tri(lang, 'очистить', 'tozalash', 'clear')} className="mono" style={{ border: 'none', background: 'transparent', color: T.ink3, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>}
                    </>
                  ) : (
                    <span className="small" style={{ color: active ? T.accent : T.ink3 }}>{active ? (tri(lang, 'выбери из списка ↓', "ro'yxatdan tanlang ↓", 'choose from the list ↓')) : (tri(lang, 'выбрать', 'tanlash', 'choose'))}</span>
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
            <button className="btn-white-accent" disabled={!allPlaced} onClick={check} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{tri(lang, 'Проверить', 'Tekshirish', 'Check')}</button>
          </div>
        )}
        {solved && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{tri(lang, 'Верно', "To'g'ri", 'Correct')}</p>
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
    // Bo'lish KO'RSATILADI: har kadrga o'z replikasi (metodist 2026-08-13).
    [
      { id: 's1_intro', text: "Quyidagi misolni ko'rib chiqamiz. O'n ikkita non." },
      { id: 's1_split', text: "Ularni uchta teng bo'lakka ajratamiz.", pauseAfterMs: 320 },
      { id: 's1_count', text: "Har bo'lakda to'rttadan chiqdi. O'n ikkini uchga bo'lsak, to'rt chiqadi.", pauseAfterMs: 420 },
    ],
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
    [
      { id: 's1_intro', text: 'Возьмём двенадцать игроков.' },
      { id: 's1_split', text: 'Разведём их на три равные команды.', pauseAfterMs: 320 },
      { id: 's1_count', text: 'В каждой команде получилось по четыре игрока. Двенадцать разделить на три равно четыре.', pauseAfterMs: 420 },
    ],
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
  en: [
    [
      { id: 's1_intro', text: 'Let us take twelve players.' },
      { id: 's1_split', text: 'Let us split them into three equal teams.', pauseAfterMs: 320 },
      { id: 's1_count', text: 'Each team got four players. Twelve divided by three is four.', pauseAfterMs: 420 },
    ],
    [
      { id: 's1_mult_intro', text: 'Twelve is a multiple of three. Look at the row of multiples.' },
      ...['three', 'six', 'nine', 'twelve', 'fifteen'].map((text, i) => ({ id: `s1_mult_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_mult_tail', text: 'Twelve stands in that row.', pauseAfterMs: 500 },
    ],
    [
      { id: 's1_div_intro', text: 'Three is a divisor of twelve. Let us name the divisors of twelve one by one.' },
      ...['one', 'two', 'three', 'four', 'six', 'twelve'].map((text, i) => ({ id: `s1_div_${i}`, text, pauseAfterMs: 280 })),
      { id: 's1_div_tail', text: 'Three is in that list as well.', pauseAfterMs: 500 },
    ],
    [{ id: 's1_result', text: 'Twelve divides by three with no remainder. That is why twelve is a multiple of three, and three is a divisor of twelve.' }],
  ],
};

// FAQAT LOKAL PREVIEW uchun: `?screen=6` bilan darsni kerakli ekrandan ochish.
// Modul yuklanganda BIR MARTA o'qiladi — render ichida emas, shuning uchun
// komponent toza qoladi. LMS da bu parametr yo'q, demak har doim 0.
const PREVIEW_START = (() => {
  try {
    const raw = new URLSearchParams(window.location.search).get('screen');
    const n = Number(raw);
    return raw && Number.isFinite(n) && n >= 1 ? Math.floor(n) - 1 : 0;
  } catch {
    return 0;
  }
})();

// ============================================================
// v4 — УСТРОЙСТВО УРОКА (методист 2026-08-13).
// Урок пересобран в 15 экранов по каркасу урока 1 третьего класса:
//   1 хук / 2-7 объяснение / 8 правило / 9-13 практика / 14 финал / 15 итог.
// Стержень — ТРИ СПОСОБА. Раньше способ поиска делителей жил только в
// подсказке после ошибки: тот, кто отвечал верно, метода не видел вообще.
// Теперь способ называется, записывается шагами и применяется в практике.
// ============================================================

// Карточка способа. Один текст на три экрана (4, 5, 7) и на итог.
// `active` — номер шага, до которого карточка «загорелась»: шаги зажигаются
// в такт тому, что происходит на сцене рядом.
const MethodCard = ({ title, steps, note, active = 99 }) => {
  const t = useT();
  const lang = useLang();
  const list = pickL(steps, lang) || [];
  return (
    <div className="mc-card">
      <p className="mc-h">{t(title)}</p>
      <ol className="mc-list">
        {list.map((s, i) => (
          <li key={i} className={'mc-step' + (i <= active ? ' mc-on' : '')}>
            <span className="mc-num">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      {note && <p className="mc-note">{t(note)}</p>}
    </div>
  );
};

// ОПОРА ДЛЯ ПРАКТИКИ (методист 2026-08-14). Практика 9-13 была голым текстом:
// строка вопроса и кнопки в верхней трети, ниже четыреста пикселей пустоты.
// После насыщенного объяснения это читается как анкета, а не как урок.
// Участники, разошедшиеся по командам: делитель — сколько команд, кратное —
// сколько всего. Правило «делитель не больше самого числа» становится видимым,
// а не заучиваемым.
const TeamsFig = ({ total, teams }) => {
  const per = Math.round(total / teams);
  const s = total > 24 ? 17 : 21;   // тридцать пять фигурок должны влезть в строку
  return (
    <div className="rc-teams tf-row">
      {Array.from({ length: teams }).map((_, g) => (
        <div className="rc-team" key={g}>
          {Array.from({ length: per }).map((_, k) => <Unit key={k} s={s} i={g}/>)}
        </div>
      ))}
    </div>
  );
};

// «ТЕПЕРЬ ТЫ» — один ход в конце объяснения (методист 2026-08-14).
// Экран объяснения не должен кончаться просмотром: ребёнок делает ОДИН шаг и
// сразу видит, понял ли кадр. Это не практика — практика в блоке 9-13, здесь
// один вопрос, три варианта и разбор на каждый неверный.
// Замок «Дальше» НЕ включается: решение методиста про свободный переход
// действует и тут, пропустить шаг можно.
const NowYou = ({ node, onSolved }) => {
  const t = useT();
  const lang = useLang();
  const [dead, setDead] = useState([]);
  const [ok, setOk] = useState(false);
  const opts = pickL(node.opts, lang) || [];
  const fbRef = useRevealScroll(ok, 300);

  const say = (n, id) => {
    if (!n) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(n, lang), undefined, id);
  };
  const pick = (i) => {
    if (ok) return;
    if (i !== node.correct) {
      setDead((d) => (d.indexOf(i) >= 0 ? d : [...d, i]));
      say(node.wrong_audio[i] || node.wrong[i], `ny_w${i}`);
      return;
    }
    setOk(true);
    say(node.correct_audio || node.correct_text, 'ny_ok');
    if (onSolved) onSolved();
  };
  const last = dead.length ? dead[dead.length - 1] : -1;

  return (
    <div className="ny-box fade-up">
      <p className="ny-h"><span aria-hidden="true">✋</span>{t(node.head)}</p>
      <p className="ny-q">{mt(t(node.q))}</p>
      <div className="ny-opts">
        {opts.map((label, i) => (
          <button key={i} disabled={ok}
            className={'option ny-opt' + (ok && i === node.correct ? ' option-correct' : (dead.indexOf(i) >= 0 ? ' option-wrong' : ''))}
            onClick={() => pick(i)}>{label}</button>
        ))}
      </div>
      {last >= 0 && !ok && <p className="ny-wrong">{mt(t(node.wrong[last]))}</p>}
      {ok && <p ref={fbRef} className="ny-ok">{mt(t(node.correct_text))}</p>}
    </div>
  );
};

// ЭКРАН 2 — ВСПОМНИМ. Мост от таблицы умножения к теме урока.
// Зачем экран: делители целиком стоят на таблице умножения, но урок к ней
// не обращался ни разу — ребёнок учил «новое» вместо того, чтобы узнать
// старое под новым именем.
const RECALL_A = 3;
const RECALL_B = 4;
const RecallBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_recall;
  const shown = useFilmSteps(step, [1600, 5200, 9000]);
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>

      <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 1.8vw, 14px)', padding: 'clamp(13px, 2.4vw, 20px)' }}>
        <div className="rc-eq mono">{`${RECALL_A} · ${RECALL_B} = ${RECALL_A * RECALL_B}`}</div>
        {/* Три команды по четыре — та же пара делителей, только видимая.
            Команды в рамках (методист 2026-08-14): текст говорит «3 команды»,
            значит на экране должны быть видны три команды, а не сетка из
            двенадцати клеток. Участник — та же фигурка, что на экранах 3 и 4. */}
        <div className="rc-teams">
          {Array.from({ length: RECALL_A }).map((_, g) => (
            <div className="rc-team" key={g}>
              {Array.from({ length: RECALL_B }).map((_, k) => (
                <Unit key={k} s={30} i={g}/>
              ))}
              <span className="rc-team-n">{RECALL_B}</span>
            </div>
          ))}
        </div>
      </div>

      {shown >= 1 && (
        <div className="rv-block rv-block-b fade-up">
          <p className="rv-lbl rv-lbl-b">{t(c.lbl_div)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.div_a)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.div_b)}</p>
        </div>
      )}
      {shown >= 2 && (
        <div className="rv-block rv-block-a fade-up">
          <p className="rv-lbl rv-lbl-a">{t(c.lbl_mul)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.mul_a)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.mul_b)}</p>
        </div>
      )}
      {shown >= 3 && (
        <div className="frame-tip g6-explanation-step fade-up">
          <span className="g6-explanation-lamp" aria-hidden="true">💡</span>
          <p className="body" style={{ margin: 0 }}>{t(c.note)}</p>
        </div>
      )}
      {shown >= 3 && <NowYou node={c.now_you}/>}
    </div>
  );
};

// ЭКРАН 6 — РЕШАЕМ ВМЕСТЕ. Образец полного решения.
// Зачем экран: между «посмотрел фильм» и «ответь сам» не было середины —
// ребёнок ни разу не видел решение записанным от начала до конца.
// Неудачный шаг (пятёрка) ОСТАЁТСЯ в записи: ученик должен узнавать отказ,
// а не только удачные пары.
const SV_ROWS = [
  { d: 1, q: 24, rest: 0 },
  { d: 2, q: 12, rest: 0 },
  { d: 3, q: 8, rest: 0 },
  { d: 4, q: 6, rest: 0 },
  { d: 5, q: 4, rest: 4 },
  { d: 6, q: 4, rest: 0 },
];
const SV_STEP_MS = 1100;

const SolveTogether = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s_solve;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_solve_intro', text: pickL(c.audio, lang)[0], trigger: 'on_mount', waits_for: null }]);

  const timersRef = useRef([]);
  const [open, setOpen] = useState(0);       // сколько строк раскрыто
  const [ask, setAsk] = useState(null);      // 'five' | 'stop' | null
  const [wrong5, setWrong5] = useState(false);
  const [wrongStop, setWrongStop] = useState(null);
  const [done, setDone] = useState(false);
  const askRef = useRevealScroll(ask !== null, 320);
  const doneRef = useRevealScroll(done, 320);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const later = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => clearTimers(), []);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };
  const line = (i) => pickL(c.audio, lang)[i];

  // Первые четыре строки раскрываются сами, потом останавливаемся и спрашиваем.
  useEffect(() => {
    later(() => { setOpen(1); say({ ru: line(1), uz: line(1), en: line(1) }, 's_solve_1'); }, 900);
    later(() => setOpen(2), 900 + SV_STEP_MS);
    later(() => setOpen(3), 900 + SV_STEP_MS * 2);
    later(() => { setOpen(4); say({ ru: line(2), uz: line(2), en: line(2) }, 's_solve_2'); }, 900 + SV_STEP_MS * 3);
    later(() => { setAsk('five'); say({ ru: line(3), uz: line(3), en: line(3) }, 's_solve_3'); }, 900 + SV_STEP_MS * 4);
    /* eslint-disable-next-line */
  }, []);

  const answerFive = (yes) => {
    if (ask !== 'five') return;
    if (yes) {
      setWrong5(true);
      say(c.q5_wrong_audio, 's_solve_q5_wrong');
      return;
    }
    setAsk(null);
    setWrong5(false);
    setOpen(5);
    say({ ru: line(4), uz: line(4), en: line(4) }, 's_solve_4');
    later(() => { setOpen(6); say({ ru: line(5), uz: line(5), en: line(5) }, 's_solve_5'); }, SV_STEP_MS);
    later(() => setAsk('stop'), SV_STEP_MS * 2);
  };

  const answerStop = (which) => {
    if (ask !== 'stop') return;
    if (which !== 'a') {
      setWrongStop(which);
      say(which === 'b' ? c.stop_wrong_b_audio : c.stop_wrong_c_audio, `s_solve_stop_${which}`);
      return;
    }
    setAsk(null);
    setWrongStop(null);
    setDone(true);
    say({ ru: line(6), uz: line(6), en: line(6) }, 's_solve_6');
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>

        <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
          {SV_ROWS.map((r, i) => {
            const on = i < open;
            const isFail = r.rest > 0;
            const isStop = i === SV_ROWS.length - 1;
            const tail = isFail
              ? `${t(c.rest_word)} ${r.rest} → ${t(c.no_pair)}`
              : (isStop ? `→ ${t(c.stop_word)}` : `→ ${r.d} ${t(c.pair_word)} ${r.q}`);
            return (
              <div key={r.d} className={'sv-row' + (on ? ' sv-on' : '') + (isFail ? ' sv-fail' : '') + (isStop ? ' sv-stop' : '')}>
                <span className="sv-eq mono">{`24 : ${r.d} = ${r.q}`}</span>
                <span className="sv-tail">{tail}</span>
              </div>
            );
          })}
          {done && <p className="sv-answer fade-up">{t(c.answer)}</p>}
        </div>

        {ask === 'five' && (
          <div ref={askRef} className="frame-tip fade-up">
            <p className="body" style={{ margin: 0, marginBottom: 10 }}>{t(c.q5)}</p>
            <div className="sv-opts">
              <button className={'option' + (wrong5 ? ' option-wrong' : '')} onClick={() => answerFive(true)}>{t(c.q5_yes)}</button>
              <button className="option" onClick={() => answerFive(false)}>{t(c.q5_no)}</button>
            </div>
            {wrong5 && <p className="sv-wrong">{mt(t(c.q5_wrong))}</p>}
          </div>
        )}

        {ask === 'stop' && (
          <div ref={askRef} className="frame-tip fade-up">
            <p className="body" style={{ margin: 0, marginBottom: 10 }}>{t(c.q_stop)}</p>
            <div className="sv-opts sv-opts-col">
              <button className="option" onClick={() => answerStop('a')}>{t(c.stop_a)}</button>
              <button className={'option' + (wrongStop === 'b' ? ' option-wrong' : '')} onClick={() => answerStop('b')}>{t(c.stop_b)}</button>
              <button className={'option' + (wrongStop === 'c' ? ' option-wrong' : '')} onClick={() => answerStop('c')}>{t(c.stop_c)}</button>
            </div>
            {wrongStop && <p className="sv-wrong">{mt(t(wrongStop === 'b' ? c.stop_wrong_b : c.stop_wrong_c))}</p>}
          </div>
        )}

        {done && (
          <div ref={doneRef} className="frame-success fade-up">
            <p className="body" style={{ margin: 0 }}>{t(CONTENT.s_methods.m2_title)}: {pickL(CONTENT.s_methods.m2_steps, lang)[3]}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};
// Счётчик заданий на многозадачных экранах практики.
const TaskCount = ({ node, i, n }) => {
  const t = useT();
  return <p className="tk-count mono">{String(t(node)).replace('{i}', String(i)).replace('{n}', String(n))}</p>;
};

// Запись ответа наверх. Урок не оценивается, но статистика первой попытки
// собирается: она нужна методисту, а не ученику — на экране её нет.
const useRecord = (props, total) => {
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  return (firstAll, question) => {
    if (recorded) return;
    setRecorded(true);
    props.onAnswer({
      stage: SCREEN_META[props.screen]?.scope || null,
      screenIdx: props.screen,
      question,
      correctAnswer: String(total),
      studentAnswer: String(total),
      correct: firstAll,
      firstTry: firstAll,
      attempts: 1,
      solved: true,
    });
  };
};

// ЭКРАН 9 — ПРАКТИКА 1. Назови роли, три примера подряд.
// Сознательно однотипно: называние должно стать автоматическим до того,
// как начнутся способы.
const RolesPractice = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_roles;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_roles_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const items = c.items;
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [picks, setPicks] = useState([null, null]);
  const [dead, setDead] = useState([[], []]);
  const [wrongKind, setWrongKind] = useState('swap');
  const firstAllRef = useRef(true);
  const record = useRecord(props, items.length);
  const done = round >= items.length;
  const it = items[Math.min(round, items.length - 1)];
  const fbRef = useRevealScroll(done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };
  const fill = (node) => String(t(node)).replace('{a}', it.a).replace('{b}', it.b);
  // Верхняя строка — кратное (индекс 0), нижняя — делитель (индекс 1).
  const correct = [0, 1];

  const pick = (row, i) => {
    if (done || dead[row].indexOf(i) >= 0) return;
    if (i !== correct[row]) {
      firstAllRef.current = false;
      setDead((d) => { const n = [...d]; n[row] = [...n[row], i]; return n; });
      // ДВЕ РАЗНЫЕ ОШИБКИ — два разных разбора (методист 2026-08-14).
      // Раньше в обеих ветках стоял один и тот же `wrong_swap`, а написанный
      // для второго случая `wrong_same` не выводился никогда.
      //   назвал оба числа одним словом  → «одинаковыми не бывают»
      //   поменял названия местами       → «делитель не больше самого числа»
      const other = picks[row === 0 ? 1 : 0];
      setWrongKind(other !== null && other === i ? 'same' : 'swap');
      say(other !== null && other === i ? c.wrong_same : c.wrong_swap, `s_roles_w${round}_${row}`);
      return;
    }
    const next = [...picks];
    next[row] = i;
    setPicks(next);
    if (next[0] !== null && next[1] !== null) {
      say(c.audio.on_correct, `s_roles_ok${round}`);
      setTimeout(() => {
        if (round + 1 >= items.length) {
          setRound(items.length);
          record(firstAllRef.current, t(c.title));
        } else {
          setRound((r) => r + 1);
          setPicks([null, null]);
          setDead([[], []]);
          setWrongKind('swap');
        }
      }, 900);
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const rows = [c.row_a, c.row_b];
  const opts = [c.opt_mult, c.opt_div];

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
        {!done && <TaskCount node={c.counter} i={round + 1} n={items.length}/>}

        {!done && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="pn-ctx">{fill(c.ctx)}</p>
            <TeamsFig total={Number(it.a)} teams={Number(it.b)}/>
            <EquationLine a={it.a} b={it.b} r={it.r} hiA hiB/>
            {rows.map((rowNode, row) => (
              <div key={row} className="pn-row">
                <p className="pn-text">{fill(rowNode)}</p>
                <div className="pn-opts">
                  {opts.map((o, i) => {
                    const isDead = dead[row].indexOf(i) >= 0;
                    const isOk = picks[row] === i;
                    return (
                      <button key={i} disabled={picks[row] !== null}
                        className={'option pn-opt' + (isOk ? ' option-correct' : (isDead ? ' option-wrong' : ''))}
                        onClick={() => pick(row, i)}>{t(o)}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            {(dead[0].length > 0 || dead[1].length > 0) && (
              <HintBlock show>{mt(t(wrongKind === 'same' ? c.wrong_same : c.wrong_swap))}</HintBlock>
            )}
          </div>
        )}

        {done && (
          <div ref={fbRef}>
            <FeedbackBlock show isCorrect>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct_text))}</p>
            </FeedbackBlock>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ЭКРАН 10 — ПРАКТИКА 2. Способ 1 на реальных числах, четыре проверки.
const CheckPractice = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_check;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_check_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const items = c.items;
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [state, setState] = useState(null);  // null | 'ok' | 'no'
  const firstAllRef = useRef(true);
  const record = useRecord(props, items.length);
  const done = round >= items.length;
  const idx = Math.min(round, items.length - 1);
  const it = items[idx];
  const fbRef = useRevealScroll(state !== null || done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  const answer = (yes) => {
    if (done || state === 'ok') return;
    if (yes !== it.ok) {
      firstAllRef.current = false;
      setState('no');
      say(c.wrong_audio[idx], `s_check_w${idx}`);
      return;
    }
    setState('ok');
    say(c.correct[idx], `s_check_ok${idx}`);
    setTimeout(() => {
      if (round + 1 >= items.length) {
        setRound(items.length);
        record(firstAllRef.current, t(c.title));
      } else {
        setRound((r) => r + 1);
        setState(null);
      }
    }, 1400);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
        {!done && <TaskCount node={c.counter} i={round + 1} n={items.length}/>}

        {!done && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="body" style={{ margin: 0, marginBottom: 12 }}>{mt(t(c.q[idx]))}</p>
            <div className="sv-opts">
              <button className={'option' + (state === 'no' && !it.ok ? ' option-wrong' : (state === 'ok' && it.ok ? ' option-correct' : ''))}
                disabled={state === 'ok'} onClick={() => answer(true)}>{t(c.yes)}</button>
              <button className={'option' + (state === 'no' && it.ok ? ' option-wrong' : (state === 'ok' && !it.ok ? ' option-correct' : ''))}
                disabled={state === 'ok'} onClick={() => answer(false)}>{t(c.no)}</button>
            </div>
            {state === 'no' && <HintBlock show>{mt(t(c.wrong[idx]))}</HintBlock>}
            {state === 'ok' && (
              <div ref={fbRef}>
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.correct[idx]))}</p>
                </FeedbackBlock>
              </div>
            )}
          </div>
        )}

        {done && (
          <div ref={fbRef}>
            <FeedbackBlock show isCorrect>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.correct[items.length - 1]))}</p>
            </FeedbackBlock>
          </div>
        )}

        {/* Способ, которым это задание и решается, стоит рядом с заданием
            (методист 2026-08-14). Раньше под вопросом было четыреста пустых
            пикселей, а способ остался на экране 4 и к моменту практики
            забывался. Карточка та же самая, импортированная, не копия. */}
        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no}/>
      </div>
    </Stage>
  );
};

// ЭКРАН 12 — ПРАКТИКА 4. Найди ошибку.
// Первое задание — ЛОВУШКА: ошибки нет. Ребёнок должен уметь сказать
// «всё верно», а не искать ошибку только потому, что о ней спросили.
const FindError = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_error;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_error_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [task, setTask] = useState(props.storedAnswer ? 2 : 0);
  const [dead, setDead] = useState([]);
  const [ok, setOk] = useState(false);
  const firstAllRef = useRef(true);
  const record = useRecord(props, 2);
  const done = task >= 2;
  const fbRef = useRevealScroll(ok || done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  const t2opts = tri(lang, c.t2_opts, c.t2_opts_uz, c.t2_opts_en);
  const wrongNode2 = [c.t2_wrong_4, null, c.t2_wrong_12, c.t2_wrong_none];
  const wrongAudio2 = [c.t2_wrong_4_audio, null, c.t2_wrong_12_audio, c.t2_wrong_none_audio];

  const pick = (i) => {
    if (ok || done) return;
    const right = task === 0 ? 0 : 1;
    if (i !== right) {
      firstAllRef.current = false;
      setDead((d) => (d.indexOf(i) >= 0 ? d : [...d, i]));
      say(task === 0 ? c.t1_wrong_audio : wrongAudio2[i], `s_error_w${task}_${i}`);
      return;
    }
    setOk(true);
    say(task === 0 ? c.t1_correct : c.t2_correct, `s_error_ok${task}`);
    setTimeout(() => {
      if (task === 0) { setTask(1); setDead([]); setOk(false); }
      else { setTask(2); record(firstAllRef.current, t(c.title)); }
    }, 1600);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const list = task === 0 ? c.t1_list : c.t2_list;
  const opts = task === 0 ? [t(c.t1_opt_aziz), t(c.t1_opt_dilnoza)] : t2opts;

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>
        {!done && <TaskCount node={c.counter} i={task + 1} n={2}/>}

        {!done && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="body" style={{ margin: 0, marginBottom: 8 }}>{t(task === 0 ? c.t1_lead : c.t2_lead)}</p>
            {/* Список Азиза — листок из тетради, а не строка чипов
                (методист 2026-08-14). Экран называется «проверь чужое решение»,
                и чужое решение должно выглядеть как чужая запись. */}
            <div className="fe-sheet">
              <div className="fe-list">
                {list.map((n) => <span key={n} className="fe-chip mono">{n}</span>)}
              </div>
            </div>
            <p className="body" style={{ margin: '12px 0 10px' }}>{t(task === 0 ? c.t1_q : c.t2_q)}</p>
            <div className="sv-opts sv-opts-col">
              {opts.map((label, i) => {
                const isDead = dead.indexOf(i) >= 0;
                const right = task === 0 ? 0 : 1;
                return (
                  <button key={i} disabled={ok}
                    className={'option' + (ok && i === right ? ' option-correct' : (isDead ? ' option-wrong' : ''))}
                    onClick={() => pick(i)}>{label}</button>
                );
              })}
            </div>
            {dead.length > 0 && !ok && (
              <HintBlock show>{mt(t(task === 0 ? c.t1_wrong : (wrongNode2[dead[dead.length - 1]] || c.t2_wrong_none)))}</HintBlock>
            )}
            {ok && (
              <div ref={fbRef}>
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(task === 0 ? c.t1_correct : c.t2_correct))}</p>
                </FeedbackBlock>
              </div>
            )}
          </div>
        )}

        {/* Проверять чужой список нечем, если способ не под рукой. */}
        {!done && <MethodCard title={CONTENT.s_methods.m2_title} steps={CONTENT.s_methods.m2_steps}/>}

        {done && (
          <div ref={fbRef}>
            <FeedbackBlock show isCorrect>
              <p className="body" style={{ margin: 0 }}>{mt(t(c.t2_correct))}</p>
            </FeedbackBlock>
          </div>
        )}
      </div>
    </Stage>
  );
};
// ЭКРАН 13 — ЗАДАЧА. Сетка фотографий с турнира.
// Крайние сетки (по 1 и по 24) СЧИТАЮТСЯ. Если их выбросить ради
// «реалистичности галереи», ответ станет 6 и разойдётся с экзаменационным
// «сколько делителей у 24» — то есть урок научил бы неверному числу.
// Снимки с турнира: те же три цвета, что футболки в зале, плюс тёплый пол.
const GR_SHOTS = ['#7ECBE6', '#F5C77E', '#8FD6B4', '#9FD3EA'];
const GRID_24 = [1, 2, 3, 4, 6, 8, 12, 24];
const GRID_25 = [1, 5, 25];

const GridTask = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_grid;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_grid_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [part, setPart] = useState(props.storedAnswer ? 2 : 0);
  const [dead, setDead] = useState([]);
  const [ok, setOk] = useState(false);
  const [box, setBox] = useState({ w: 280, h: 190 });
  const boxRef = useRef(null);
  const firstAllRef = useRef(true);
  const record = useRecord(props, 2);
  const timersRef = useRef([]);

  useEffect(() => {
    const measure = () => {
      if (boxRef.current) setBox({ w: boxRef.current.offsetWidth, h: boxRef.current.offsetHeight });
    };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, []);
  const done = part >= 2;
  const fbRef = useRevealScroll(ok || done, 320);
  // Разбор неверного ответа тоже подтягивается в кадр: на ноутбуке он выходил
  // на 94 пикселя ниже нижней панели, то есть ребёнок его просто не видел.
  // В active идёт ЧИСЛО попыток, а не флаг: на второй ошибке разбор меняется, и
  // флаг остался бы true, то есть подтяжка не сработала бы второй раз.
  const hintRef = useRevealScroll(ok ? 0 : dead.length, 320);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);
  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  // АНИМАЦИЯ ОТВЕЧАЕТ НА ВОПРОС, А НЕ КРУТИТСЯ (методист 2026-08-14).
  // Было: раскладки сменяли друг друга по кругу каждые 1,7 секунды, включая
  // «по одной в ряд» — она вырождалась в ниточку из точек и наезжала на
  // подпись. Движение шло само по себе и ответа не давало.
  // Стало: пока ребёнок думает, стоит ОДНА понятная раскладка. Когда он
  // ответил, выходит строка ВСЕХ пар — их можно пересчитать и проверить себя.
  const n = part === 0 ? 24 : 25;
  const cols = part === 0 ? GRID_24 : GRID_25;
  const per = part === 0 ? 6 : 5;   // спокойная раскладка на время вопроса
  const rows = n / per;
  // Ячейка ужимается так, чтобы ЛЮБАЯ раскладка влезла в одну и ту же сцену.
  const gap = 8;
  // Потолок снимка поднят второй раз (методист 2026-08-14): на стене шириной
  // 760 пикселей снимки занимали двести и читались как крошка. Кручение
  // раскладок убрано, «по одной в ряд» больше не бывает, поэтому высота сцены
  // считается под шесть строк максимум, а не под двадцать четыре.
  const cell = Math.max(4, Math.min(
    68,
    Math.floor((box.h - gap * (rows - 1)) / rows),
    Math.floor((box.w - gap * (per - 1)) / per),
  ));

  const optsNode = part === 0 ? c.opts_24 : c.opts_25;
  const opts = pickL(optsNode, lang) || [];
  const right = part === 0 ? c.right_24 : c.right_25;
  // Порядок разборов совпадает с порядком вариантов: 4 / 6 / 8 / 24 и 1 / 3 / 5 / 25.
  const wrongNodes = part === 0
    ? [c.wrong_pair, c.wrong_6, null, c.wrong_all]
    : [c.wrong_one, null, c.wrong_five, c.wrong_all25];
  const wrongAudio = part === 0
    ? [c.wrong_pair_audio, c.wrong_6_audio, null, c.wrong_all_audio]
    : [c.wrong_one_audio, null, c.wrong_five_audio, c.wrong_all25_audio];

  const pick = (i) => {
    if (ok || done) return;
    if (i !== right) {
      firstAllRef.current = false;
      setDead((d) => (d.indexOf(i) >= 0 ? d : [...d, i]));
      say(wrongAudio[i] || c.audio.on_wrong, `s_grid_w${part}_${i}`);
      return;
    }
    setOk(true);
    say(part === 0 ? c.audio.a1 : c.audio.a2, `s_grid_ok${part}`);
    setTimeout(() => {
      if (part === 0) { setPart(1); setDead([]); setOk(false); }
      else { setPart(2); record(firstAllRef.current, t(c.title)); }
    }, 2600);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>

        <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
          <p className="body" style={{ margin: 0, marginBottom: 10 }}>{mt(t(done ? c.q2 : (part === 0 ? c.q1 : c.q2)))}</p>
          {/* СЦЕНА ГАЛЕРЕИ в языке хука (методист 2026-08-14): стена, доска
              с заголовком и снимки на ней. Раньше на белом поле лежали голые
              квадраты, и связи с турниром не читалось. */}
          <div className="gr-wrap">
            {/* Размер снимка считается от ВЫСОТЫ сцены, а не задаётся в CSS.
                Раскладка «по 1 в ряд» это 24 ряда: с фиксированной ячейкой
                сцена выросла бы вчетверо и кнопки ушли бы за нижний край. */}
            <div className="gr-wall">
              <svg className="gr-wall-bg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
                <rect x="0" y="0" width="400" height="120" fill="#F6F1E7"/>
                <rect x="0" y="0" width="400" height="9" fill="#E7DFD0"/>
                <rect x="0" y="113" width="400" height="7" fill="#E2D8C6"/>
              </svg>
              <span className="gr-pin gr-pin-l" aria-hidden="true"/>
              <span className="gr-pin gr-pin-r" aria-hidden="true"/>
              <div className="gr-box" ref={boxRef}>
                <div className="gr-grid" style={{ gridTemplateColumns: `repeat(${per}, ${cell}px)`, gap: gap }}>
                  {Array.from({ length: n }).map((_, i) => (
                    <span key={i} className="gr-ph" style={{ width: cell, height: cell, transitionDelay: `${(i % 12) * 18}ms` }}>
                      <i style={{ background: GR_SHOTS[i % GR_SHOTS.length] }}/>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="gr-cap mono">
              {t(c.grid_word)}: {String(t(c.per_row)).replace('{k}', String(per))} · {rowsWord(t(c.rows_word), c.rows_forms, lang, rows)}
            </p>
          </div>

          {!done && (
            <>
              <p className="body" style={{ margin: '10px 0 8px' }}>{t(c.ask_count)}</p>
              <div className="sv-opts gr-opts">
                {opts.map((label, i) => (
                  <button key={i} disabled={ok}
                    className={'option' + (ok && i === right ? ' option-correct' : (dead.indexOf(i) >= 0 ? ' option-wrong' : ''))}
                    onClick={() => pick(i)}>{label}</button>
                ))}
              </div>
              {dead.length > 0 && !ok && (
                <div ref={hintRef}>
                  <HintBlock show>{mt(t(wrongNodes[dead[dead.length - 1]] || c.wrong_6))}</HintBlock>
                </div>
              )}
            </>
          )}

          {ok && (
            <div ref={fbRef}>
              {/* Все раскладки СРАЗУ и парами: ребёнок пересчитывает их сам и
                  видит, что это те же пары делителей, что на экране 5. */}
              <div className="gp-row">
                {cols.map((k) => (
                  <span key={k} className={'gp-chip' + (k * k === n ? ' gp-square' : '')}>
                    {k} <i>&#215;</i> {n / k}
                  </span>
                ))}
              </div>
              <FeedbackBlock show isCorrect>
                <p className="body" style={{ margin: 0 }}>{mt(t(part === 0 ? c.out_1 : c.out_2))}</p>
              </FeedbackBlock>
            </div>
          )}
        </div>

        {done && (
          <div className="frame-success fade-up">
            <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
            <p className="small" style={{ margin: '6px 0 0', color: T.ink3 }}>{mt(t(c.square))}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ЭКРАН 14 — ФИНАЛЬНЫЙ ТЕСТ. Пять заданий на одном экране (наказ 3 класса).
// Смешанный тип: одно с набором числа, четыре с выбором. Оценки нет,
// но разбор есть на каждый неверный вариант.
const FinalPanel = (props) => {
  const { screen, totalScreens, onNext, onPrev } = props;
  const c = CONTENT.s_final;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_final_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const items = c.items;
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [typed, setTyped] = useState('');
  const [dead, setDead] = useState([]);
  const [ok, setOk] = useState(false);
  const [numBad, setNumBad] = useState(false);
  const firstAllRef = useRef(true);
  const record = useRecord(props, items.length);
  const done = idx >= items.length;
  const it = items[Math.min(idx, items.length - 1)];
  const fbRef = useRevealScroll(ok || done, 320);

  const say = (node, id) => {
    if (audio.muted) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  const advance = () => {
    setTimeout(() => {
      if (idx + 1 >= items.length) {
        setIdx(items.length);
        record(firstAllRef.current, t(c.intro_line));
      } else {
        setIdx((v) => v + 1);
        setTyped(''); setDead([]); setOk(false); setNumBad(false);
      }
    }, 1700);
  };

  const submitNum = () => {
    if (ok || typed === '') return;
    if (Number(typed) !== it.ans) {
      firstAllRef.current = false;
      setNumBad(true);
      say(it.hint_audio || it.hint, `s_final_h${idx}`);
      return;
    }
    setNumBad(false);
    setOk(true);
    say(c.audio.on_correct, `s_final_ok${idx}`);
    advance();
  };

  const pickMc = (i) => {
    if (ok) return;
    if (i !== it.correctIndex) {
      firstAllRef.current = false;
      setDead((d) => (d.indexOf(i) >= 0 ? d : [...d, i]));
      say((it.wrong_audio && it.wrong_audio[i]) || (it.wrong && it.wrong[i]) || c.audio.on_wrong, `s_final_w${idx}_${i}`);
      return;
    }
    setOk(true);
    say(it.correct || c.audio.on_correct, `s_final_ok${idx}`);
    advance();
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );
  const mcOpts = it.opts_i18n ? pickL({ ru: it.opts_i18n.map((o) => o.ru), uz: it.opts_i18n.map((o) => o.uz), en: it.opts_i18n.map((o) => o.en) }, lang) : it.opts;
  const lastWrong = dead.length ? (it.wrong && it.wrong[dead[dead.length - 1]]) : null;

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.intro_line)}</h2>
        {!done && <TaskCount node={c.counter} i={idx + 1} n={items.length}/>}

        {!done && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
            <p className="body" style={{ margin: 0, marginBottom: 12 }}>{mt(t(it.q))}</p>

            {it.kind === 'num' ? (
              <>
                {/* НАБОРНАЯ ПАНЕЛЬ КАК В 3 КЛАССЕ (методист 2026-08-14).
                    Было: десять цифр в одну ленту шириной во весь экран, ноль
                    посередине, стрелка и галочка в общем ряду — на цифру надо
                    целиться. Стало: телефонная раскладка 3 на 3, ноль под
                    восьмёркой, стирание справа от него, поле ответа над
                    клавишами. Ребёнок находит цифру не глядя.
                    Импортировать из grade3/_kit нельзя: файл урока собирается
                    для LMS в один модуль и умеет зависеть только от react. */}
                <div className="fn-wrap">
                  <div className={'fn-slot mono' + (numBad ? ' fn-bad' : '') + (ok ? ' fn-ok' : '')}>{typed || '?'}</div>
                  <div className="fn-pad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                      <button key={d} className="fn-key mono" disabled={ok}
                        onClick={() => { setNumBad(false); setTyped((v) => (v.length < 3 ? v + d : v)); }}>{d}</button>
                    ))}
                    <button className="fn-key fn-go" disabled={ok || typed === ''} onClick={submitNum}>&#10003;</button>
                    <button className="fn-key mono" disabled={ok}
                      onClick={() => { setNumBad(false); setTyped((v) => (v.length < 3 ? v + '0' : v)); }}>0</button>
                    <button className="fn-key fn-del" disabled={ok || typed === ''}
                      onClick={() => { setNumBad(false); setTyped((v) => v.slice(0, -1)); }}>&#9003;</button>
                  </div>
                </div>
                {numBad && <HintBlock show>{mt(t(it.hint))}</HintBlock>}
              </>
            ) : (
              <>
                <div className="sv-opts sv-opts-col">
                  {(mcOpts || []).map((label, i) => (
                    <button key={i} disabled={ok}
                      className={'option' + (ok && i === it.correctIndex ? ' option-correct' : (dead.indexOf(i) >= 0 ? ' option-wrong' : ''))}
                      onClick={() => pickMc(i)}>{label}</button>
                  ))}
                </div>
                {lastWrong && !ok && <HintBlock show>{mt(t(lastWrong))}</HintBlock>}
              </>
            )}

            {ok && it.correct && (
              <div ref={fbRef}>
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(it.correct))}</p>
                </FeedbackBlock>
              </div>
            )}
          </div>
        )}

        {done && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={CONTENT.s6.fact}/>}
      </div>
    </Stage>
  );
};

// ============================================================
// КАДРЫ ВНУТРИ ОДНОГО ЭКРАНА. Два помощника, разница принципиальная.
// `useFilmPhase` — озвучка ВЕДЁТ, таймер страхует (Math.max): кадр откроется
// не позже метки, но озвучка может открыть его раньше.
// `useFilmSteps`  — таймер ОГРАНИЧИВАЕТ (Math.min): если TTS молчит, реплика
// «заканчивается» мгновенно и шаг улетел бы в конец, а ребёнок увидел бы
// только результат вместо движения.
// ============================================================
const useFilmPhase = (audioPhase, marks) => {
  const [tick, setTick] = useState(0);
  const marksRef = useRef(marks);
  useEffect(() => {
    const ids = marksRef.current.map((ms, i) => setTimeout(() => setTick((v) => Math.max(v, i + 1)), ms));
    return () => ids.forEach(clearTimeout);
  }, []);
  return Math.max(tick, audioPhase || 0);
};

const useFilmSteps = (step, marks) => {
  const [tick, setTick] = useState(0);
  const marksRef = useRef(marks);
  useEffect(() => {
    const ids = marksRef.current.map((ms, i) => setTimeout(() => setTick((v) => Math.max(v, i + 1)), ms));
    return () => ids.forEach(clearTimeout);
  }, []);
  return Math.min(step, tick);
};

// Высота сцены печений. Была 176 — экран не помещался на 71 пиксель, и это
// было ДО всех правок: сломанная проверка фолда его не показывала.
const SF_H = 126;
const SplitFilm = ({ audioPhase = 0 }) => {
  const boxRef = useRef(null);
  const [w, setW] = useState(0);
  const phase = useFilmPhase(audioPhase, [1700, 3600]);
  useEffect(() => {
    const measure = () => { if (boxRef.current) setW(boxRef.current.offsetWidth); };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, []);
  const s = w && w < 420 ? 26 : 34;
  const gap = 6;
  const rowGap = phase >= 1 ? 16 : 6;
  const cluster = (i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const gw = 6 * (s + gap) - gap;
    return { x: (w - gw) / 2 + col * (s + gap), y: SF_H / 2 - (s + 3) + row * (s + gap) };
  };
  const grouped = (i) => {
    const g = Math.floor(i / 4);
    const k = i % 4;
    const rowW = 4 * (s + gap) - gap;
    const totalH = 3 * s + 2 * rowGap;
    return { x: (w - rowW) / 2 + k * (s + gap), y: (SF_H - totalH) / 2 + g * (s + rowGap) };
  };
  const at = (i) => (phase === 0 ? cluster(i) : grouped(i));
  const rowW = 4 * (s + gap) - gap;
  const totalH = 3 * s + 2 * rowGap;
  const frames = [0, 1, 2].map((g) => ({
    x: (w - rowW) / 2 - 7,
    y: (SF_H - totalH) / 2 + g * (s + rowGap) - 5,
    w: rowW + 14,
    h: s + 10,
  }));
  return (
    <div className="sf-box" ref={boxRef} style={{ height: SF_H }}>
      {w > 0 && phase >= 1 && frames.map((f, g) => (
        <span key={'f' + g} className="sf-frame" style={{ left: f.x, top: f.y, width: f.w, height: f.h }}/>
      ))}
      {w > 0 && phase >= 2 && frames.map((f, g) => (
        <span key={'l' + g} className="sf-lab mono" style={{ left: f.x + f.w + 8, top: f.y + f.h / 2 - 11 }}>4</span>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const p = at(i);
        return (
          <span key={i} className="sf-u"
            style={{ transform: `translate(${p.x}px, ${p.y}px)`, transitionDelay: `${(i % 4) * 40}ms` }}>
            <Unit s={s} i={i}/>
          </span>
        );
      })}
    </div>
  );
};

// s1 — DARSNING O'ZAGI. Bitta misol 12 : 3 = 4 dan ikkita nom chiqadi.
// Qadamlar yig'iladi: oxirida bola ikkala nomni bir ekranda birga ko'radi.
const Screen1 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s1} totalScreens={TOTAL_SCREENS} audioPlan={S1_AUDIO_PLAN}
    renderStep={({ t, step, refs, muted, activeAudioId, lastCompletedAudioId }) => {
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
        {/* Rasm misolni TUSHUNTIRADI: 12 dona uchta teng bo'lakka AJRALADI va
            har bo'lakda to'rttadan borligi yoziladi. Shundan keyin tenglik. */}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(7px, 1.4vw, 11px)', padding: 'clamp(11px, 2vw, 18px)' }}>
          <SplitFilm audioPhase={muted ? 0 : (
            (step >= 1 || activeAudioId === 's1_count' || lastCompletedAudioId === 's1_split' || lastCompletedAudioId === 's1_count') ? 2
              : ((activeAudioId === 's1_split' || lastCompletedAudioId === 's1_intro') ? 1 : 0)
          )}/>
          <EquationLine a="12" b="3" r="4" hiA={step === 1 || step >= 3} hiB={step === 2 || step >= 3}/>
        </div>
        {step >= 1 && (
          <div ref={refs[1]} className="rv-block rv-block-a rv-block-visual fade-up">
            <p className="rv-lbl rv-lbl-a">{t(CONTENT.s1.lbl_mult)}</p>
            <p className="small rv-cap">{t(CONTENT.s1.cap_mult)}</p>
            <MultiplesTrack base={3} count={5} active={multActive} activeOnly settled={multSettled}/>
          </div>
        )}
        {step >= 2 && (
          <div ref={refs[2]} className="rv-block rv-block-b rv-block-visual fade-up">
            <p className="rv-lbl rv-lbl-b">{t(CONTENT.s1.lbl_div)}</p>
            <p className="small rv-cap">{t(CONTENT.s1.cap_div)}</p>
            <DivisorChips list={D12} active={divActive} settled={divSettled} syncActive tone="success"/>
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

// Ekran 07 — ASBOB (2026-08-13 da qo'shilgan yangi ekran).
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;

// ============================================================
// ЭКРАН 09 — КИНО: делители встают парами.
// Было: ребёнок сам нажимал числа (PairsScreen из макета Claude Design).
// Стало (методист 2026-08-13): интерактив убран, визуальный язык оставлен —
// кадры идут за репликами.
//   0  пустая сцена и подписанный пустой ряд «Делители числа 12»
//   1  один и двенадцать выезжают навстречу, между ними связь, сверху
//      произведение 1 · 12 = 12, затем оба уходят в ряд
//   2  то же для двух и шести
//   3  то же для трёх и четырёх, но они ВСТРЕЧАЮТСЯ в середине: появляется
//      вертикальная черта, подпись «слева и справа встретились», ряд
//      закрывается рамкой, снизу выходит факт про дюжину
// Позиции берутся из offsetTop (layout px) — на телефоне урок масштабируется
// zoom, и getBoundingClientRect дал бы двойное умножение.
// ============================================================
const PR_PAIRS = [[1, 12], [2, 6], [3, 4]];
// Зазор между числами пары в момент сближения: у 1 и 12 он широкий, у 3 и 4
// их почти нет — на этом и держится вывод «дальше искать нечего».
const PR_GAP = { 1: 280, 2: 150, 3: 14 };
const PR_TILE = 56;
const PR_SMALL = 44;
const PR_MATH = 620;
// Внутренние кадры одной пары, миллисекунды от начала шага.
const PR_T_IN = 40;
const PR_T_PROD = PR_MATH + 140;
const PR_T_CONV = PR_MATH + 520;
const PR_T_MEET = PR_MATH * 2 + 620;
const PR_T_ROW = PR_MATH * 2 + 900;
const PR_T_ROW_MEET = PR_MATH * 2 + 2100;
// Минимальная выдержка шага: если TTS молчит, реплика «заканчивается» мгновенно,
// и без этого ребёнок увидел бы сразу готовый ряд вместо движения.
const PR_MARKS = [2800, 9400, 15800];

const PairsFilmBody = ({ step }) => {
  const c = CONTENT.s6;
  const t = useT();
  const shown = useFilmSteps(step, PR_MARKS);

  const bodyRef = useRef(null);
  const sceneRef = useRef(null);
  const rowRef = useRef(null);
  const timersRef = useRef([]);
  const playedRef = useRef(0);
  // Вся геометрия живёт в состоянии, а не читается из ссылок во время рендера:
  // ссылка в рендере — это чтение DOM в момент, когда React его ещё не отдал.
  const [geo, setGeo] = useState({ W: 0, slotY: 0, rowY: 0 });
  const [tiles, setTiles] = useState({});
  const [found, setFound] = useState([]);
  const [link, setLink] = useState({ x: 0, y: 0, w: 0, on: false, dur: 0 });
  const [prod, setProd] = useState({ text: '', x: 0, y: 0, on: false });
  const [bar, setBar] = useState({ x: 0, y: 0, h: 0, on: false });
  const [met, setMet] = useState(false);
  const [nyOk, setNyOk] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (!bodyRef.current) return;
      setGeo({
        W: bodyRef.current.offsetWidth,
        slotY: (sceneRef.current ? sceneRef.current.offsetTop : 0) + 32,
        rowY: rowRef.current ? rowRef.current.offsetTop : 0,
      });
    };
    const id = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    // Одного resize НЕ хватает: на телефоне подпись переносится на две строки,
    // ряд уезжает вниз, а плитки остаются по старым координатам.
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && bodyRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(bodyRef.current);
    }
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, []);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Кадры одной пары. Ссылок на DOM тут нет — только числа из `geo`.
  useEffect(() => {
    if (!geo.W || shown < 1 || shown > PR_PAIRS.length) return;
    if (playedRef.current >= shown) return;
    const later = (fn, ms) => { timersRef.current.push(setTimeout(fn, ms)); };
    // Если шаг перепрыгнули (медленный кадр не успел), пропущенные пары просто
    // оказываются в ряду — без них ряд был бы дырявым. Через таймер, а не прямо
    // в эффекте: синхронный setState в эффекте — ошибка линта.
    const skipped = [];
    for (let k = playedRef.current; k < shown - 1; k += 1) skipped.push(...PR_PAIRS[k]);
    if (skipped.length) later(() => setFound((f) => [...f, ...skipped]), 0);
    playedRef.current = shown;

    const setTile = (n, patch) => setTiles((prev) => ({ ...prev, [n]: { ...(prev[n] || {}), ...patch } }));
    const [a, b] = PR_PAIRS[shown - 1];
    const isMeet = shown === PR_PAIRS.length;
    const leftX = 8;
    const rightX = Math.max(90, geo.W - 8 - PR_TILE);

    setTiles((prev) => ({
      ...prev,
      [a]: { x: -PR_TILE - 12, y: geo.slotY, s: 1, dur: 0 },
      [b]: { x: geo.W + 12, y: geo.slotY, s: 1, dur: 0 },
    }));
    later(() => {
      setTile(a, { x: leftX, dur: PR_MATH });
      setTile(b, { x: rightX, dur: PR_MATH });
      setLink({ x: leftX + PR_TILE, y: geo.slotY + 27, w: rightX - leftX - PR_TILE, on: true, dur: 0 });
    }, PR_T_IN);
    later(() => setProd({ text: `${a} · ${b} = 12`, x: geo.W / 2, y: geo.slotY - 32, on: true }), PR_T_PROD);
    later(() => {
      const gap = PR_GAP[a];
      const lx = geo.W / 2 - gap / 2 - PR_TILE;
      const rx = geo.W / 2 + gap / 2;
      setTile(a, { x: lx, dur: PR_MATH });
      setTile(b, { x: rx, dur: PR_MATH });
      setLink((l) => ({ ...l, x: lx + PR_TILE, w: Math.max(0, gap), dur: PR_MATH }));
    }, PR_T_CONV);
    if (isMeet) {
      later(() => { setBar({ x: geo.W / 2 - 1.5, y: geo.slotY - 6, h: 68, on: true }); setMet(true); }, PR_T_MEET);
    }
    later(() => {
      setFound((f) => [...f, a, b]);
      setLink((l) => ({ ...l, on: false }));
      setProd((p) => ({ ...p, on: false }));
      setBar((bb) => ({ ...bb, on: false }));
    }, isMeet ? PR_T_ROW_MEET : PR_T_ROW);
  }, [shown, geo.W, geo.slotY]);

  const done = found.length === 6;
  // Положение плитки в итоговом ряду ВЫЧИСЛЯЕТСЯ, а не запоминается: при смене
  // размера окна ряд перестраивается сам, без пересчёта состояния.
  const sortedFound = [...found].sort((x, y) => x - y);
  const rowStep = PR_SMALL + 8;
  const rowLeft = Math.max(4, (geo.W - (sortedFound.length * rowStep - 8)) / 2);
  const posOf = (n) => {
    const i = sortedFound.indexOf(n);
    if (i >= 0) return { x: rowLeft + i * rowStep, y: geo.rowY, s: PR_SMALL / PR_TILE, dur: PR_MATH };
    return tiles[n];
  };
  const shownTiles = Array.from(new Set([...Object.keys(tiles).map(Number), ...found]));

  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.bridge)}</p>
      <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
        <div className="pr-body" ref={bodyRef}>
          {/* Пунктирные метки стоят только до первой пары: они показывают, ОТКУДА
              приедут числа. Дальше их места занимают сами плитки.
              Когда все шесть в ряду, сцена СХЛОПЫВАЕТСЯ: иначе над результатом
              висело бы 120 пустых пикселей и экран читался бы как недоделанный. */}
          <div className={'pr-scene' + (done ? ' pr-scene-done' : '')} ref={sceneRef}>
            {shown === 0 && <div className="pr-slot pr-slot-l"/>}
            {shown === 0 && <div className="pr-slot pr-slot-r"/>}
          </div>

          {/* Одна строка на два состояния: пока пар нет — серое ожидание, после
              встречи — зелёный вывод. Две отдельные строки дёргали бы высоту. */}
          <p className={'pr-note' + (met ? ' pr-note-ok pr-on' : (shown === 0 ? ' pr-note-wait pr-on' : ''))}>
            {met ? t(c.meet) : t(c.wait)}
          </p>

          <p className="pr-over">{t(c.cap_all)}</p>
          <div className="pr-row" ref={rowRef}>
            <div className="pr-frame"
              style={{ left: rowLeft - 6, width: 6 * rowStep - 8 + 12, opacity: done ? 1 : 0 }}/>
          </div>

          {/* ПАРЫ ОСТАЮТСЯ ВИДНЫ (методист 2026-08-14). Экран называется
              «делители ищем парами», метод называется «иди парами до встречи»,
              а в конце на экране лежал плоский ряд чисел — пар в нём не было.
              Ребёнок, который отвлёкся, видел просто список. Теперь под рядом
              стоят три дуги: крайние в паре, следующие внутри, и так до встречи
              в середине. Вложенность и есть «шли навстречу друг другу». */}
          <div className={'pr-arcs' + (done ? ' pr-on' : '')}>
            <svg viewBox={`0 0 ${Math.max(geo.W, 1)} 46`} preserveAspectRatio="none" aria-hidden="true">
              {[[0, 5, 40], [1, 4, 28], [2, 3, 16]].map(([i, j, d], k) => {
                const cx = (m) => rowLeft + m * rowStep + PR_SMALL / 2;
                return (
                  <path key={k} className="pr-arc" style={{ animationDelay: `${k * 130}ms` }}
                    d={`M${cx(i)} 2 Q${(cx(i) + cx(j)) / 2} ${d * 2} ${cx(j)} 2`}/>
                );
              })}
            </svg>
          </div>
          <p className={'pr-eqs mono' + (done ? ' pr-on' : '')}>
            1 &#183; 12 = 2 &#183; 6 = 3 &#183; 4 = 12
          </p>

          <div className="pr-layer">
            <div className={'pr-link' + (link.on ? ' pr-link-on' : '')}
              style={{ left: link.x, top: link.y, width: link.w, transition: `width ${link.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1), left ${link.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 180ms linear` }}/>
            <div className={'pr-prod' + (prod.on ? ' pr-on' : '')} style={{ left: prod.x, top: prod.y }}>{prod.text}</div>
            <div className={'pr-bar' + (bar.on ? ' pr-bar-on' : '')} style={{ left: bar.x, top: bar.y, height: bar.h }}/>
            {shownTiles.map((n) => {
              const tl = posOf(n);
              if (!tl) return null;
              return (
                <div key={n} className="pr-tile"
                  style={{
                    transform: `translate(${tl.x}px, ${tl.y}px) scale(${tl.s})`,
                    transition: `transform ${tl.dur}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
                  }}>
                  <div className="pr-tile-in">{n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Шаги загораются в такт парам: шаг 1 — единица и само число,
          шаг 4 — правило остановки, ради которого экран и существует. */}
      <MethodCard title={CONTENT.s_methods.m2_title} steps={CONTENT.s_methods.m2_steps}
        active={shown === 0 ? 0 : (shown >= 3 ? 3 : shown)}/>

      {/* Сначала ход ребёнка, факт про дюжину — наградой ПОСЛЕ ответа.
          Вместе они не помещаются, а по очереди высота экрана не растёт. */}
      {done && !nyOk && <NowYou node={c.now_you} onSolved={() => setNyOk(true)}/>}
      {nyOk && <FactCard badge={FB_HIST} anim={<AnimStars/>} text={c.fact}/>}
    </div>
  );
};

// s6 — bo'luvchilarni juftlab qidirish. Ekran 09: KINO, bola hech narsa bosmaydi.
// Fakt oxirgi kadrda ovozlanadi (`factOnLast`) va shu paytda kartochka chiqadi.
const Screen6 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s6} totalScreens={TOTAL_SCREENS} factOnLast
    renderStep={({ step }) => <PairsFilmBody step={step}/>}/>
);

const D18 = ['1', '2', '3', '6', '9', '18'];
// ============================================================
// ЭКРАН 13 — КИНО: бесконечные кратные против конечных делителей.
// Было: ребёнок сам таскал метку (MagnetScreen из макета Claude Design).
// Стало (методист 2026-08-13): перетаскивание убрано, обе прямые остались —
// кадры идут за репликами.
//   0  две прямые стоят пустыми
//   1  метка САМА прыгает по кратным трёх, прямая едет влево, у края
//      многоточие и стрелка: следующее кратное всегда есть
//   2  на нижней прямой по одному загораются делители 1, 2, 3, 4, 6, 12,
//      за двенадцатью стена, метка упирается в неё и отскакивает
//   3  общий вывод зелёным
// Разницу видно не словами, а расстоянием: верхняя прямая уезжает за экран,
// нижняя упирается в стену через шесть засечек.
// ============================================================
// ЭКРАН 7 — ОДНА ОБЩАЯ ОСЬ (методист 2026-08-14).
// Было: сначала пятнадцать секунд метка шагала по верхней прямой, потом
// пятнадцать по нижней. Экран про ПРОТИВОПОСТАВЛЕНИЕ, а противопоставление
// показывают рядом и одновременно: к моменту, когда нижняя упиралась в стену,
// верхняя была уже забыта. Вдобавок верхняя прямая уезжала за левый край,
// и результат приходилось дублировать рядом чипов.
// Стало: ОДНА ось. Сверху загораются кратные трёх, снизу делители двенадцати,
// оба ряда идут шаг в шаг. На двенадцати нижний обрывается стеной, верхний
// уходит за правый край со стрелкой. Разница видна в один момент.
// ============================================================
const AX_MAX = 18;                  // докуда видно ось
const AX_MULT = 3;
const AX_OF = 12;
const AX_HOP = 340;                 // шаг развёртки
const AX_DIVS = [1, 2, 3, 4, 6, 12];
// Минимальная выдержка кадра: без неё немой TTS проматывал бы ось разом.
const MG_MARKS = [2600, 11000, 16000];

const MagnetFilmBody = ({ step }) => {
  const c = CONTENT.s10;
  const t = useT();
  const shown = useFilmSteps(step, MG_MARKS);
  const [upto, setUpto] = useState(0);
  const timersRef = useRef([]);
  const playedRef = useRef(false);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Одна развёртка на весь экран: идём по числам, оба ряда заполняются вместе.
  useEffect(() => {
    if (shown < 1 || playedRef.current) return;
    playedRef.current = true;
    for (let n = 1; n <= AX_MAX; n += 1) {
      timersRef.current.push(setTimeout(() => setUpto(n), 200 + (n - 1) * AX_HOP));
    }
  }, [shown]);

  // Кадры 2 и 3 не ждут развёртку: если ребёнок дошёл до них, ось доводится.
  useEffect(() => {
    if (shown >= 2 && upto < AX_MAX) {
      const id = setTimeout(() => setUpto(AX_MAX), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [shown, upto]);

  const nums = Array.from({ length: AX_MAX }).map((_, i) => i + 1);
  const at = (n) => `${(n / (AX_MAX + 1)) * 100}%`;
  const wallOn = upto >= AX_OF + 1;
  const endOn = upto >= AX_MAX;

  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>

      <div className="frame fade-up delay-1" style={{ padding: 'clamp(11px, 1.8vw, 16px)' }}>
        <div className="ax-legend">
          <span className="ax-lg ax-lg-a"><i/>{t(c.cap_mult)}</span>
          <span className="ax-lg ax-lg-b"><i/>{t(c.cap_div)}</span>
        </div>

        <div className="ax-box">
          {/* СВЕРХУ: кратные трёх */}
          {nums.filter((n) => n % AX_MULT === 0).map((n) => (
            <span key={`m${n}`} className={'ax-dot ax-dot-a' + (n <= upto ? ' ax-on' : '')} style={{ left: at(n) }}>{n}</span>
          ))}

          {/* ОСЬ с засечками */}
          <div className="ax-line"/>
          {nums.map((n) => (
            <span key={`t${n}`} className={'ax-tick' + (n <= upto ? ' ax-on' : '')} style={{ left: at(n) }}/>
          ))}

          {/* СНИЗУ: делители двенадцати */}
          {AX_DIVS.map((n) => (
            <span key={`d${n}`} className={'ax-dot ax-dot-b' + (n <= upto ? ' ax-on' : '')} style={{ left: at(n) }}>{n}</span>
          ))}

          {/* стена сразу за двенадцатью — только для нижнего ряда */}
          <span className={'ax-wall' + (wallOn ? ' ax-on' : '')} style={{ left: at(AX_OF + 0.5) }}/>

          {/* верхний ряд уходит за правый край */}
          <span className={'ax-more' + (endOn ? ' ax-on' : '')}>&#8230;<i/></span>
        </div>

        <p className={'ax-cap ax-cap-a' + (endOn ? ' ax-on' : '')}>{t(c.cap_a_done)}</p>
        <p className={'ax-cap ax-cap-b' + (wallOn ? ' ax-on' : '')}>{t(c.cap_b_done)}</p>
      </div>

      <MethodCard title={CONTENT.s_methods.m3_title} steps={CONTENT.s_methods.m3_steps}
        note={c.metro} active={shown >= 1 ? 0 : -1}/>

      {shown >= 3 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.final)}</p>
        </div>
      )}
      {shown >= 3 && <NowYou node={c.now_you}/>}
    </div>
  );
};

// s10 — karralar cheksiz, bo'luvchilar sanoqli. Ekran 7: bitta o'q, ikkala
// qator bir vaqtda to'ladi.
const Screen10 = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s10} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <MagnetFilmBody step={step}/>}/>
);

// ---- Обёртки экранов v4 (порядок совпадает с SCREEN_META) ----

const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);

const ScreenSolve = (props) => <SolveTogether {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenRoles = (props) => <RolesPractice {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenCheck = (props) => <CheckPractice {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenError = (props) => <FindError {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenGrid = (props) => <GridTask {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenFinal = (props) => <FinalPanel {...props} totalScreens={TOTAL_SCREENS}/>;

// Экран 11 — два круга второго способа на одном экране: 18 с подсказками,
// затем 20 без них. Переход между кругами перехватывает `onNext`, поэтому
// счётчик экранов не двигается.
const ScreenFindAll = (props) => {
  const [part, setPart] = useState(0);
  // Способ 2 стоит под заданием: этот экран им и решается, а сам способ
  // объяснялся на экране 5 и к практике успевает забыться.
  const aside = (
    <MethodCard title={CONTENT.s_methods.m2_title} steps={CONTENT.s_methods.m2_steps}/>
  );
  return part === 0
    ? (
      <PickDivisors {...props} key="r18" screenContent={CONTENT.s9} totalScreens={TOTAL_SCREENS} retryMode
        onNext={() => setPart(1)} asideNode={aside}
        whyNode={<WhyCard lines={CONTENT.s9.why} figure={<DivisorChips list={D18} activeSet={[0, 1, 2, 3, 4, 5]}/>}/>}
        factNode={<FactCard badge={FB_SCI} anim={<AnimDigits/>} text={CONTENT.s9.fact}/>}/>
    )
    : (
      <PickDivisors {...props} key="r20" screenContent={CONTENT.s9b} totalScreens={TOTAL_SCREENS} retryMode
        asideNode={aside}
        whyNode={<WhyCard lines={CONTENT.s9b.why}/>}/>
    );
};

const Screen14 = ({ screen, totalScreens, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const lines = pickL(c.audio, lang);
  const audio = useAudio([{ id: 's14_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach(l => e.pushOneOff(l)); }
    /* eslint-disable-next-line */
  }, []);
  // Ball KO'RSATILMAYDI (metodist qarori 2026-08-13): bu dars baholanmaydi,
  // shuning uchun yakuniy ekranda "n / m" qatori yo'q.
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)', marginLeft: 'auto' }}>{tri(lang, 'Пройти заново', "Qaytadan o'tish", 'Start over')}</button><button className="btn" onClick={finishLesson} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(18px, 2.6vw, 26px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{tri(lang, 'Завершить урок', 'Darsni tugatish', 'Finish the lesson')}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      {/* Ixcham tuzilish: sarlavha va ball BITTA qatorda (eyebrow Stage'ning
          o'zida bor, takrorlanmaydi), ichki bo'shliqlar kichraytirilgan —
          yakuniy ekran 360x640 da ham skrollsiz sig'adi. */}
      <div className="g6-final-slide" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.8vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        {/* БАННЕР (методист 2026-08-13): наверху полоса про математику, а не
            голый заголовок. Знаки действий в ней те же, что на карточках факта. */}
        <div className="fade-up sm-banner" style={{ position: 'relative' }}>
          <span className="sm-banner-tag">{t(c.banner)}</span>
          <h2 className="title sm-banner-h">{t(c.heading)}</h2>
          <span className="sm-banner-glyphs" aria-hidden="true">
            <i>&#215;</i><i>&#247;</i><i>=</i>
          </span>
        </div>
        {/* Урок закрывается тем же залом, с которого начался (методист
            2026-08-14): вопрос хука получил ответ прямо на площадке. */}
        <div className="fin-frame fade-up delay-1">
          <FinalScene/>
        </div>

        {/* ТРИ КАРТОЧКИ ОДНОГО РАЗМЕРА (методист 2026-08-13). Было: три блока
            разной высоты, и итог читался как свалка. Сетка выравнивает их. */}
        <div className="sm-cards fade-up delay-1">
          <div className="frame sm-card">
            <p className="sm-card-h">{t(c.main_label)}</p>
            <ul className="sm-brief">
              <li>{t(c.brief_1)}</li>
              <li>{t(c.brief_2)}</li>
              <li>{t(c.brief_3)}</li>
            </ul>
          </div>

          <div className="frame sm-card">
            <p className="sm-card-h">{t(c.read_label)}</p>
            <div className="sm-read-row">
              <span className="sm-read-eq mono">12 : 3 = 4</span>
              <span className="sm-read-side">
                <span className="sm-read-a">{t(c.read_a)}</span>
                <span className="sm-read-b">{t(c.read_b)}</span>
              </span>
            </div>
          </div>

          <div className="frame sm-card">
            <p className="sm-card-h">{t(CONTENT.s_methods.memo_title)}</p>
            <div className="mm-grid">
              {[[CONTENT.s_methods.short_1, CONTENT.s_methods.memo_1],
                [CONTENT.s_methods.short_2, CONTENT.s_methods.memo_2],
                [CONTENT.s_methods.short_3, CONTENT.s_methods.memo_3]].map((row, i) => (
                <span className="mm-row" key={i}>
                  <span className="mm-q">{t(row[0])}</span>
                  <span className="mm-a">{t(row[1])}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

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
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

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
/* ЭКРАН 03 — фильм «деление на три части». Печенья НЕ появляются на новых
   местах, они туда переезжают: transform + transition, задержка по столбцу. */
.sf-box { position: relative; width: 100%; }
.sf-u { position: absolute; left: 0; top: 0; display: block; transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.sf-frame { position: absolute; border: 1.5px dashed rgba(31, 122, 77, 0.55); border-radius: 12px; background: rgba(227, 240, 232, 0.45); animation: fade-in-up 440ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.sf-lab { position: absolute; font-size: 18px; font-weight: 700; color: #1F7A4D; animation: fade-in-up 440ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }

/* Баннер итога: полоса с темой, названием урока и знаками действий. */
.sm-banner { display: flex; align-items: center; gap: clamp(10px, 2vw, 18px); border-radius: 16px; padding: clamp(11px, 2vw, 17px) clamp(14px, 2.4vw, 22px); background: linear-gradient(100deg, #FFE8E1 0%, #FBF3D6 62%, #E3F0E8 100%); overflow: hidden; }
.sm-banner-tag { flex-shrink: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; color: #FF4F28; }
.sm-banner-h { margin: 0; flex: 1; font-size: clamp(20px, 3.2vw, 30px); }
.sm-banner-glyphs { display: flex; gap: 10px; flex-shrink: 0; }
.sm-banner-glyphs i { font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: clamp(18px, 3vw, 26px); font-weight: 700; color: rgba(73, 69, 80, 0.28); }
/* Три карточки одного размера: одинаковая ширина колонок и общая высота строки. */
/* Три карточки СТОЛБИКОМ (методист 2026-08-14): в ряд они читались как
   плотная стена текста. Вертикаль оплачена тем, что блок про следующий урок
   с итога убран. Внутри карточки заголовок стоит СЛЕВА, содержимое справа —
   так столбик занимает меньше высоты, чем заголовок над текстом. */
/* Сцена финала: во всю ширину карточек, картинка заливает рамку без полей. */
.fin-frame { position: relative; width: 100%; border-radius: 14px; overflow: hidden; border: 1px solid #E4DACA; line-height: 0; }
.fin-bg { display: block; width: 100%; height: auto; }
.fin-team { animation: finIn 460ms cubic-bezier(0.22, 0.61, 0.36, 1) both; transform-box: fill-box; transform-origin: 50% 100%; }
@keyframes finIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .fin-team { animation: none; } }

.sm-cards { display: flex; flex-direction: column; gap: clamp(7px, 1.2vw, 11px); }
.sm-card { padding: clamp(10px, 1.6vw, 14px) clamp(12px, 2vw, 18px); display: flex; flex-direction: row; align-items: baseline; gap: clamp(12px, 2vw, 20px); }
.sm-card-h { flex: 0 0 clamp(84px, 12vw, 120px); margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; font-weight: 700; }
.sm-card > :not(.sm-card-h) { flex: 1; }
/* В карточке итога памятка идёт столбиком: название сверху, действие под ним.
   Две колонки в узкой карточке рвали строку на три части. */
/* Вопрос и ответ в ОДНУ строку (методист 2026-08-14): памятка занимала три
   двойные строки и одна съедала высоту сцены финала. Названия способов и так
   короткие, переносить их незачем. */
.sm-card .mm-grid { display: flex; flex-direction: column; gap: 7px; }
.sm-card .mm-row { display: flex; flex-direction: row; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; }
.sm-card .mm-q { font-size: 15px; font-weight: 700; color: #0E0E10; }
/* Тире ставим символом, а не CSS-кодом: STYLES это шаблонная строка, и
   обратный слэш в ней JS читает как escape. Файл падает так же, как от
   бэктика, причём падает и от такого кода в комментарии. Сторож в
   grade6-dars01-smoke.mjs теперь ловит оба случая. */
.sm-card .mm-q::after { content: ' —'; color: #B8B4AD; font-weight: 400; }
.sm-card .mm-a { font-size: 14px; line-height: 18px; color: #494550; }
.sm-brief { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.sm-brief li { position: relative; padding-left: 15px; font-size: 15px; line-height: 19px; color: #0E0E10; }
.sm-brief li::before { content: ''; position: absolute; left: 0; top: 7px; width: 6px; height: 6px; border-radius: 50%; background: #FF4F28; }
.sm-main { padding: clamp(12px, 2.2vw, 20px); }
/* Памятка добавила итогу целый блок, и экран перерос фолд. Ужимаем именно
   итог, а не общие стили: на других экранах эти отступы нужны. */
.g6-final-slide { gap: clamp(7px, 1.1vw, 11px) !important; }
/* Сцена финала забрала 176 px, и итог встал ровно в фолд, без запаса: на
   узбекском строки длиннее и любая перенесённая строка вылезла бы за экран.
   Отступы ужимаем ТОЛЬКО здесь, на других экранах они нужны. */
.g6-final-slide .sm-banner { padding: clamp(9px, 1.5vw, 12px) clamp(13px, 2.2vw, 20px); }
.g6-final-slide .sm-card { padding: clamp(9px, 1.3vw, 11px) clamp(12px, 2vw, 18px); }
.g6-final-slide .sm-main { padding: clamp(10px, 1.6vw, 15px); }
.g6-final-slide .sm-read { padding: clamp(9px, 1.4vw, 13px); }
.g6-final-slide .sm-memo { padding: clamp(9px, 1.4vw, 13px) clamp(11px, 1.8vw, 16px); }
.sm-read-close { margin: 10px 0 0; padding-top: 9px; border-top: 1px solid #e9e3d9; font-size: 15px; line-height: 19px; color: #1F7A4D; }
/* IKKI O'QILISH: misol chapda, ikki nomi o'ngda — bittasi bo'luvchi, bittasi karrali. */
.sm-read { padding: clamp(11px, 2vw, 18px); }
.sm-read-row { display: flex; align-items: center; gap: clamp(12px, 2.4vw, 22px); flex-wrap: wrap; }
.sm-read-eq { font-size: clamp(21px, 3.4vw, 28px); font-weight: 700; color: #0E0E10; white-space: nowrap; }
.sm-read-side { display: flex; flex-direction: column; gap: 6px; }
.sm-read-a, .sm-read-b { font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; border-radius: 9px; padding: 3px 10px; }
.sm-read-a { background: #E3F0E8; color: #1F7A4D; }
.sm-read-b { background: #FFE8E1; color: #FF4F28; }
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
/* Знаки действий загораются по очереди. */
.fa-mg { display: flex; gap: clamp(4px, 1vw, 8px); align-items: center; }
.fa-mg span { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 2.6vw, 20px); font-weight: 700; color: #019ACB; opacity: 0.25; animation: faGlyph 3.2s ease-in-out infinite; }
/* Таблица квадратов пересчитывает саму себя: 1 4 9 16. */
.fa-sq { display: flex; gap: clamp(5px, 1.2vw, 9px); }
.fa-sq span { display: flex; flex-direction: column; align-items: center; gap: 1px; animation: faSq 3.4s ease-in-out infinite; }
.fa-sq i { font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: clamp(9px, 1.6vw, 11px); color: #8A8883; }
.fa-sq b { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2.4vw, 18px); color: #019ACB; }
@keyframes faGlyph { 0%, 100% { opacity: 0.22; transform: translateY(0); } 45% { opacity: 1; transform: translateY(-3px); } }
@keyframes faSq { 0%, 100% { opacity: 0.35; } 45% { opacity: 1; } }

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
.amb-g { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255, 79, 40, 0.06); animation: ambFloat 18s ease-in-out infinite; user-select: none; }
.amb-g1 { font-size: 108px; top: 4%; left: 3%; }
.amb-g2 { font-size: 84px; bottom: 6%; right: 7%; animation-delay: -6s; }
.amb-g3 { font-size: 68px; top: 48%; right: 3%; animation-delay: -12s; }
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
.rv-col { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: clamp(7px, 1.2vw, 11px); }
.rv-block { position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: clamp(4px, 0.8vw, 6px); background: #FFFFFF; border-radius: 14px; border-left: 4px solid transparent; padding: clamp(7px, 1.3vw, 10px); box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.rv-block::after { content: ''; position: absolute; z-index: -1; width: 120px; height: 120px; right: -62px; top: -68px; border-radius: 50%; opacity: 0.42; pointer-events: none; animation: concept-glow 4.8s ease-in-out infinite; }
.rv-block-a::after { background: radial-gradient(circle, rgba(255,79,40,0.22), rgba(255,79,40,0)); }
.rv-block-b::after { background: radial-gradient(circle, rgba(31,122,77,0.20), rgba(31,122,77,0)); }
@keyframes concept-glow { 0%, 100% { transform: scale(0.9); opacity: 0.3; } 50% { transform: scale(1.12); opacity: 0.55; } }
.rv-block-a { border-left-color: #FF4F28; }
.rv-block-b { border-left-color: #1F7A4D; }
/* Строки фактов в обоих блоках выравниваются одинаково (методист 2026-08-14):
   в зелёном они прижимались к левому краю, в красном стояли по центру, и два
   соседних блока читались как сделанные разными руками. */
.rv-block > p.body { width: auto; max-width: 100%; text-align: center; }
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
/* ===== ХУК (s_hook) — турнир: вопрос урока и прогноз ученика =====
   Разбор с командами и скамейкой снят (методист 2026-08-14), вместе с ним
   ушли .hk-scene, .hk-team*, .hk-bench*, .hk-eq, .hk-both*, .hk-why*,
   .hk-other, .hk-fig* и .hk-pool*: хук принимает выбор и заканчивается,
   как в 1-5 классах. Зал остаётся на экране до конца слайда. */
/* Интервалы хука ужаты (2026-08-14): на ноутбучных 1280x800 зал, вопрос и
   строка принятия не влезали в экран и появлялся скролл. Сцену не уменьшаем —
   она главная, срезаны только пустоты между блоками. */
.hk { display: flex; flex-direction: column; gap: clamp(7px, 1vw, 9px); }
.hk-voices { display: flex; gap: 9px; flex-wrap: wrap; }
.hk-voice { flex: 1 1 210px; display: flex; gap: 9px; align-items: flex-start; background: #FFFFFF; border-radius: 13px; padding: clamp(8px, 1.3vw, 11px); box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.hk-who { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #FFE8E1; color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
.hk-who-b { background: #E3F0E8; color: #1F7A4D; }
/* Сцена ЗАЛИВАЕТ рамку и имеет ту же ширину, что заголовок, вопрос и кнопки.
   Так сделано в хуках 1 и 2 класса: разной ширины блоков там нет. */
.hk-frame { padding: clamp(5px, 0.7vw, 7px) !important; }
.hk-gym { position: relative; width: 100%; aspect-ratio: 400 / 154; border-radius: 10px; overflow: hidden; }
.hk-bg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
/* Баннер покачивается, мяч один раз прокатывается на входе. Оба движения
   принадлежат сцене, а не плавают фоном. */
.hk-banner { transform-origin: 200px 10px; animation: hkSway 5.4s ease-in-out infinite; }
@keyframes hkSway { 0%, 100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
.hk-ball { animation: hkRoll 1500ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes hkRoll { from { transform: translateX(-46px) rotate(-150deg); } to { transform: none; } }
.hk-kid { transform-origin: center bottom; animation: hkStep 520ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
@keyframes hkStep { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .hk-banner, .hk-ball, .hk-kid { animation: none; } }
.hk-ask { display: flex; flex-direction: column; gap: 7px; }
/* Варианты и отметка выбора берутся из Grade6TheoryTheme.css:
   класс g6-hook-options и класс is-hook-picked. Своих правил у хука нет. */
/* Показ жеста на хуке СНЯТ (методист 2026-08-14): кисть проезжала поверх
   вариантов и мешала. Решение от 13 августа «полупрозрачная кисть проходит над
   вариантами» этим отменено. Стикер остался на экране 4, где он стоит на месте
   и показывает точку нажатия, а не ездит. */
/* Кисть-стикер: тень отделяет её от сцены, кончик пальца стоит в точке показа. */
.hs { position: absolute; left: -9px; top: 0; width: 34px; height: auto; filter: drop-shadow(0 6px 12px rgba(58, 53, 48, 0.32)); }

/* ===== ЭКРАН 06: 12 плиток перестраиваются по рядам (rs = rows slider) =====
   Перенесено из утверждённого макета artifacts/grade6-dars01-design.
   Плитка НЕ появляется на новом месте — она туда переезжает: transform со
   стаггером 30 ms. Позиции считаются в offsetWidth (layout px), а НЕ через
   getBoundingClientRect: на телефоне урок масштабируется свойством zoom, и
   rect вернул бы уже умноженные пиксели, а translate умножил бы их второй раз. */
.rs-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.rs-hint { font-size: 15px; color: #494550; background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 0 8px 8px 0; padding: 3px 10px; transition: opacity 440ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-pulse { animation: rs-tip 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) 5; }
.rs-gone { opacity: 0; pointer-events: none; }
@keyframes rs-tip { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(216, 169, 58, 0); } 50% { box-shadow: inset 0 0 0 2px rgba(216, 169, 58, 0.95); } }
.rs-ctl { position: relative; height: 44px; margin-top: 10px; display: flex; align-items: center; gap: 14px; }
.rs-over { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; white-space: nowrap; }
.rs-slider { position: relative; flex: 1; height: 44px; min-width: 150px; touch-action: none; outline: none; cursor: pointer; }
.rs-track { position: absolute; left: 0; right: 0; top: 19px; height: 6px; border-radius: 3px; background: #e9e3d9; }
.rs-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 3px; background: #FFE8E1; transition: width 180ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-tick { position: absolute; top: 16px; width: 2px; height: 12px; border-radius: 1px; background: #e9e3d9; transform: translateX(-1px); }
.rs-handle { position: absolute; top: 0; width: 44px; height: 44px; margin-left: -22px; display: grid; place-items: center; transition: left 180ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-knob { width: 26px; height: 26px; border-radius: 50%; background: #FFFFFF; border: 2px solid #FF4F28; box-shadow: 0 2px 6px -1px rgba(58, 53, 48, 0.25); transition: transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1), background-color 180ms linear; }
.rs-slider:focus-visible .rs-knob { box-shadow: 0 0 0 4px #FFE8E1; }
.rs-grab .rs-knob { background: #FF4F28; transform: scale(1.12); }
.rs-val { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; color: #0E0E10; width: 28px; text-align: right; line-height: 1; }
.rs-dots { display: flex; gap: 8px; align-items: center; height: 8px; margin-top: 9px; }
.rs-dot { width: 8px; height: 8px; border-radius: 50%; background: #e9e3d9; transition: background-color 440ms linear; }
.rs-dot-ok { background: #1F7A4D; }
.rs-dot-no { background: #FF4F28; }
.rs-scene { position: relative; height: 230px; margin-top: 10px; }
/* Участник в строю — фигурка с лицом (методист 2026-08-14). Раньше тут стоял
   кружок «чтобы не превратился в кашу при сжатии»; методист снял это ограничение:
   один и тот же участник обязан выглядеть одинаково на всех экранах.
   Цвет футболки даёт сам компонент Unit по индексу, CSS его больше не красит. */
.rs-tile { position: absolute; left: 0; top: 0; width: 44px; height: 44px; transform-origin: 0 0; will-change: transform; transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.rs-tile svg { width: 100%; height: 100%; }
.rs-zone { position: absolute; left: 50%; bottom: 0; width: 216px; height: 44px; margin-left: -108px; border: 2px dashed #FF4F28; border-radius: 12px; background: #FFE8E1; transform: translateY(18px); opacity: 0; pointer-events: none; transition: transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 180ms linear; }
.rs-zone-on { transform: translateY(0); opacity: 1; }
.rs-zone-lab { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-family: 'JetBrains Mono', monospace; font-size: 15px; color: #FF4F28; }
.rs-out { min-height: 38px; margin-top: 5px; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.rs-formula { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3.4vw, 26px); line-height: 28px; font-weight: 700; color: #0E0E10; opacity: 0; transition: opacity 440ms linear; }
.rs-note { font-size: 15px; line-height: 19px; opacity: 0; transition: opacity 440ms linear; align-self: flex-start; border-radius: 8px; padding: 2px 6px; margin-left: -6px; }
.rs-note-ok { color: #1F7A4D; background: #E3F0E8; }
.rs-note-no { color: #FF4F28; background: #FFE8E1; }
.rs-on { opacity: 1; }
.rs-hand { position: absolute; left: 0; top: 0; width: 0; height: 0; opacity: 0; pointer-events: none; z-index: 5; }
@media (max-width: 639.98px) {
  .rs-ctl { flex-wrap: wrap; height: auto; row-gap: 4px; }
  .rs-over { width: 100%; }
  .rs-slider { flex: 1 1 100%; order: 3; min-width: 0; }
  .rs-val { order: 2; text-align: left; }
  .rs-hint { white-space: normal; }
}

/* ===== ЭКРАН 7: ОДНА ОБЩАЯ ОСЬ (ax = axis) =====
   Сверху кратные, снизу делители, оба ряда заполняются одновременно.
   Нижний обрывается стеной за 12, верхний уходит за правый край. */
.ax-legend { display: flex; gap: clamp(12px, 2.4vw, 22px); flex-wrap: wrap; margin-bottom: clamp(8px, 1.4vw, 12px); }
.ax-lg { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; font-weight: 700; }
.ax-lg i { width: 11px; height: 11px; border-radius: 50%; }
.ax-lg-a { color: #FF4F28; }
.ax-lg-a i { background: #FF4F28; }
.ax-lg-b { color: #1F7A4D; }
.ax-lg-b i { background: #1F7A4D; }

.ax-box { position: relative; height: clamp(96px, 15vh, 116px); }
.ax-line { position: absolute; left: 0; right: 0; top: 50%; height: 2px; margin-top: -1px; background: #e9e3d9; border-radius: 1px; }
.ax-tick { position: absolute; top: 50%; width: 2px; height: 9px; margin: -4px 0 0 -1px; background: #E4DBCA; border-radius: 1px; transition: background-color 300ms linear; }
.ax-tick.ax-on { background: #C9BFAE; }

/* Метка: число внутри кружка. Сверху кратные, снизу делители. */
.ax-dot { position: absolute; display: grid; place-items: center; width: clamp(22px, 3.4vw, 28px); height: clamp(22px, 3.4vw, 28px); margin-left: calc(clamp(22px, 3.4vw, 28px) / -2); border-radius: 50%; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px, 1.7vw, 14px); font-weight: 700; opacity: 0; transform: scale(0.6); transition: opacity 260ms linear, transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.ax-dot.ax-on { opacity: 1; transform: none; }
.ax-dot-a { bottom: calc(50% + 12px); background: #FFE8E1; color: #FF4F28; }
.ax-dot-b { top: calc(50% + 12px); background: #E3F0E8; color: #1F7A4D; }

/* Стена сразу за двенадцатью — только для нижнего ряда. */
.ax-wall { position: absolute; top: 50%; width: 4px; height: 40px; margin-left: -2px; border-radius: 2px; background: #494550; opacity: 0; transition: opacity 300ms linear; }
/* Верхний ряд уходит за правый край. */
.ax-more { position: absolute; right: -2px; bottom: calc(50% + 12px); display: flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 18px; color: #FF4F28; opacity: 0; transition: opacity 300ms linear; }
.ax-more i { display: block; width: 9px; height: 9px; border-top: 2px solid #FF4F28; border-right: 2px solid #FF4F28; transform: rotate(45deg); }
.ax-on.ax-wall, .ax-on.ax-more { opacity: 1; }

.ax-cap { min-height: 18px; margin: 2px 0 0; font-size: 14px; line-height: 18px; opacity: 0; transition: opacity 440ms linear; }
.ax-cap-a { color: #FF4F28; }
.ax-cap-b { color: #1F7A4D; }
.ax-cap.ax-on { opacity: 1; }

@media (max-width: 639.98px) {
  .ax-legend { gap: 10px; margin-bottom: 7px; }
  .ax-lg { font-size: 10px; letter-spacing: 0.1em; }
  .ax-box { height: 88px; }
}
/* ===== ЭКРАН 09: пары делителей идут навстречу (pr = pairs) =====
   Два числа выезжают с краёв, между ними растёт связь, потом пара СБЛИЖАЕТСЯ.
   У 3 и 4 они встречаются — дальше искать нечего. Экран стал ФИЛЬМОМ: ряд
   кнопок и кисть убраны. Из макета artifacts/grade6-dars01-design. */
.pr-body { position: relative; }
.pr-scene { position: relative; height: 120px; margin-top: 10px; transition: height 620ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.pr-slot { position: absolute; top: 32px; width: 56px; height: 56px; border-radius: 12px; border: 2px dashed #e9e3d9; transition: background-color 180ms linear, border-color 180ms linear; }
.pr-slot-l { left: 8px; }
.pr-slot-r { right: 8px; }
.pr-layer { position: absolute; inset: 0; pointer-events: none; }
.pr-tile { position: absolute; left: 0; top: 0; width: 56px; height: 56px; transform-origin: 0 0; will-change: transform; }
.pr-tile-in { width: 56px; height: 56px; border-radius: 12px; background: #7ECBE6; border: 2px solid #019ACB; display: grid; place-items: center; font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 700; color: #0E0E10; }
.pr-link { position: absolute; height: 2px; background: #019ACB; border-radius: 1px; transform-origin: 0 50%; opacity: 0; transition: opacity 180ms linear; }
.pr-link-on { opacity: 1; }
.pr-prod { position: absolute; font-family: 'JetBrains Mono', monospace; font-size: clamp(19px, 3vw, 24px); font-weight: 700; color: #0E0E10; white-space: nowrap; transform: translateX(-50%); opacity: 0; transition: opacity 440ms linear; }
.pr-bar { position: absolute; width: 3px; border-radius: 2px; background: #1F7A4D; transform: scaleY(0); transform-origin: 50% 50%; transition: transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.pr-bar-on { transform: scaleY(1); }
.pr-note { min-height: 19px; margin-top: 4px; font-size: 15px; line-height: 19px; color: #FF4F28; opacity: 0; transition: opacity 440ms linear; }
.pr-note-ok { color: #1F7A4D; }
.pr-note-wait { color: #8A8883; }
.pr-on { opacity: 1; }
.pr-over { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; margin-top: 8px; }
.pr-row { position: relative; height: 44px; margin-top: 12px; }
.pr-frame { position: absolute; top: -6px; height: 56px; border: 1px solid #1F7A4D; border-radius: 12px; opacity: 0; transition: opacity 440ms linear; }
@media (max-width: 639.98px) {
  .pr-scene { height: 108px; }
}
/* СТРОГО ПОСЛЕ медиазапроса: вес одинаковый (0,1,0), выигрывает последнее
   правило. Объявленное выше, схлопывание проиграло бы высоте 108px на телефоне. */
.pr-scene-done { height: 0; }
/* Дуги пар под итоговым рядом. Появляются, только когда ряд собран целиком:
   до этого пары показывает сама анимация, а дуги мешали бы её читать. */
/* Вес указан явно: правило .pr-on объявлено ВЫШЕ и при равном весе победило бы
   оно. Порядок правил в этом файле уже съедал видимость четыре раза. */
.pr-arcs.pr-on, .pr-eqs.pr-on { opacity: 1; }
.pr-arcs { height: 46px; margin-top: 2px; opacity: 0; transition: opacity 440ms linear; }
.pr-arcs svg { display: block; width: 100%; height: 46px; overflow: visible; }
.pr-arc { fill: none; stroke: #1F7A4D; stroke-width: 2; stroke-linecap: round; opacity: 0.75; stroke-dasharray: 300; stroke-dashoffset: 300; animation: prArc 620ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }
@keyframes prArc { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .pr-arc { animation: none; stroke-dashoffset: 0; } }
.pr-eqs { margin: 0; text-align: center; font-size: clamp(15px, 2.4vw, 18px); font-weight: 700; color: #1F7A4D; opacity: 0; transition: opacity 440ms linear; }
/* Тот же приём для верхней прямой экрана 7. Объявлено ПОСЛЕ медиазапроса,
   иначе высота 92px из него перебила бы схлопывание. */
.mg-zone-done { height: 0 !important; overflow: hidden; }

/* ===== ЭКРАН 07: «показ, потом сам» (tl = tool) =====
   Плитки, зона остатка, формула и разбор берутся у экрана 06 (.rs-*):
   один визуальный движок, а не вторая копия. Своё тут только управление,
   баннер очереди и две кнопки перехода из показа в самостоятельную работу. */
.tl-ctl { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; }
.tl-grp { display: flex; flex-direction: column; gap: 4px; }
.tl-step { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; white-space: nowrap; }
.tl-divs { display: flex; gap: 4px; flex-wrap: wrap; }
.tl-div { width: 42px; height: 44px; border-radius: 12px; border: 1px solid #e9e3d9; background: #FFFFFF; color: #FF4F28; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; line-height: 1; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-div-sel { background: #FF4F28; color: #FFFFFF; }
.tl-div:disabled { color: #A7A6A2; background: #faf7f1; cursor: default; }
.tl-go { height: 44px; padding: 0 18px; border-radius: 12px; border: 1px solid #e9e3d9; background: #FFFFFF; color: #FF4F28; font-family: 'Manrope', system-ui, sans-serif; font-size: 17px; font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-go:disabled { color: #A7A6A2; background: #faf7f1; cursor: default; }
.tl-scene { height: 156px; border: 1px solid transparent; border-radius: 12px; overflow: hidden; transition: border-color 440ms linear; }
.tl-scene-ok { border-color: #1F7A4D; }
.tl-scene-no { border-color: #FF4F28; }
.tl-empty { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; padding: 0 20px; font-size: 15px; color: #8A8883; transition: opacity 180ms linear; }
.tl-empty-off { opacity: 0; }
.rs-shape { font-size: 13px; line-height: 16px; color: #8A8883; opacity: 0; transition: opacity 440ms linear; }
/* Вес выше, чем у rs-on: иначе правило rs-shape объявлено позже, вес тот же,
   и оно держит прозрачность нулём. Та же ловушка, что с pr-scene-done.
   ОБРАТНЫХ КАВЫЧЕК ЗДЕСЬ БЫТЬ НЕ МОЖЕТ: STYLES это шаблонная строка. */
.rs-shape.rs-on { opacity: 1; }

/* ===== КАРТОЧКА СПОСОБА (mc = method card) =====
   Один и тот же блок на экранах 4, 5 и 7. Шаги зажигаются по ходу сцены. */
.mc-card { border: 1px solid #e9e3d9; border-radius: 14px; background: #FFFFFF; padding: clamp(9px, 1.5vw, 12px) clamp(12px, 2vw, 16px); }
.mc-h { margin: 0 0 5px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #FF4F28; font-weight: 700; }
.mc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.mc-step { display: flex; gap: 9px; align-items: flex-start; font-size: 15px; line-height: 19px; color: #A7A6A2; transition: color 440ms linear; }
.mc-step.mc-on { color: #0E0E10; }
.mc-num { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; background: #faf7f1; color: #A7A6A2; transition: background-color 440ms linear, color 440ms linear; }
.mc-on .mc-num { background: #FFE8E1; color: #FF4F28; }
.mc-note { margin: 6px 0 0; font-size: 14px; line-height: 18px; color: #8A8883; }

/* ===== «ТЕПЕРЬ ТЫ» (ny = now you) =====
   Компактный блок в конце объяснения: заголовок, вопрос и три кнопки в строку.
   Высоту держим низкой — экраны объяснения и без него близки к краю. */
.ny-box { border: 1px solid #e9e3d9; border-left: 4px solid #1F7A4D; border-radius: 14px; background: #FFFFFF; padding: 8px clamp(11px, 1.8vw, 15px); }
.ny-h { display: flex; align-items: center; gap: 7px; margin: 0 0 5px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; font-weight: 700; color: #1F7A4D; }
.ny-q { margin: 0 0 8px; font-size: 15px; line-height: 19px; color: #0E0E10; }
.ny-opts { display: flex; gap: 8px; flex-wrap: wrap; }
.ny-opt { flex: 1; min-width: 84px; padding: 7px 12px !important; font-size: 15px !important; }
.ny-wrong { margin: 8px 0 0; font-size: 14px; line-height: 18px; color: #FF4F28; }
.ny-ok { margin: 8px 0 0; font-size: 14px; line-height: 18px; color: #1F7A4D; }
.tl-task { font-size: 13px; line-height: 16px; margin-top: -2px; }

/* ===== ЭКРАН 2: вспомним (rc = recall) ===== */
.rc-eq { font-size: clamp(22px, 3.8vw, 28px); font-weight: 700; color: #0E0E10; }
/* Три команды по четыре. Каждая в своей пунктирной рамке с числом справа —
   ровно так же, как на экране 3, чтобы ребёнок узнал ту же картинку.
   Цвет футболки внутри команды один: команда читается цветом, а не только
   рамкой. Фигурку даёт компонент Unit, CSS её не красит.
   Команды стоят В РЯД, а не столбиком: столбиком экран перерастал фолд на
   65 пикселей, а в ряд он даже ниже прежней сетки из двенадцати клеток. */
.rc-teams { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(6px, 1.2vw, 10px); }
.rc-team { display: flex; align-items: center; gap: clamp(2px, 0.6vw, 4px); padding: 4px clamp(5px, 1vw, 8px); border: 1px dashed #D8D2C6; border-radius: 12px; }
.rc-team-n { margin-left: 4px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #1F7A4D; }
/* Тот же строй, но в практике: команд бывает семь, поэтому отступы теснее. */
.tf-row { gap: clamp(4px, 0.9vw, 7px); margin: 2px 0 8px; }
.tf-row .rc-team { gap: 1px; padding: 3px clamp(3px, 0.7vw, 5px); }

/* ===== ЭКРАН 6: решаем вместе (sv = solve) =====
   Неудачный шаг остаётся в записи и подкрашен: ребёнок должен узнавать отказ. */
.sv-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding: 5px 0; opacity: 0; transform: translateY(6px); transition: opacity 440ms linear, transform 440ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.sv-row.sv-on { opacity: 1; transform: translateY(0); }
.sv-eq { font-size: clamp(17px, 2.8vw, 21px); font-weight: 700; color: #0E0E10; }
.sv-tail { font-size: 15px; color: #1F7A4D; }
.sv-fail .sv-tail { color: #FF4F28; }
.sv-stop .sv-tail { color: #494550; font-weight: 700; }
.sv-answer { margin: 12px 0 0; padding-top: 10px; border-top: 1px solid #e9e3d9; font-size: clamp(16px, 2.6vw, 19px); font-weight: 700; color: #1F7A4D; }
.sv-opts { display: flex; gap: 10px; flex-wrap: wrap; }
.sv-opts-col { flex-direction: column; }
.sv-opts .option { flex: 1; min-width: 120px; }
.sv-opts-col .option { width: 100%; }
.sv-wrong { margin: 10px 0 0; font-size: 15px; line-height: 19px; color: #FF4F28; }

/* ===== СЧЁТЧИК ЗАДАНИЙ ===== */
.tk-count { margin: 0; font-size: 13px; font-weight: 700; color: #FF4F28; letter-spacing: 0.06em; }
.pn-ctx { margin: 0 0 8px; text-align: center; font-size: 14px; color: #8A8883; }

/* ===== ЭКРАН 12: найди ошибку (fe = find error) ===== */
/* Листок из тетради: линейка полей слева и линованный фон. Чужое решение
   должно выглядеть как чужая запись, иначе экран «найди ошибку» не отличается
   от обычного вопроса с числами. */
.fe-sheet { position: relative; padding: 12px 14px 12px 26px; border-radius: 10px; background: #FEFCF7; border: 1px solid #EAE3D5; background-image: repeating-linear-gradient(to bottom, transparent, transparent 43px, #EEF3F7 43px, #EEF3F7 44px); }
.fe-sheet::before { content: ''; position: absolute; left: 15px; top: 6px; bottom: 6px; width: 1px; background: #F3C9C2; }
.fe-list { display: flex; gap: 8px; flex-wrap: wrap; }
.fe-chip { min-width: 44px; height: 44px; padding: 0 10px; border-radius: 12px; border: 1px solid #e9e3d9; background: #faf7f1; display: grid; place-items: center; font-size: 21px; font-weight: 700; color: #0E0E10; }

/* ===== ЭКРАН 13: сетка фотографий (gr = grid) ===== */
.gr-wrap { display: flex; flex-direction: column; align-items: stretch; gap: 8px; }
/* Стена школьной галереи: снимки висят на ней, а не лежат на белом поле. */
.gr-wall { position: relative; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #E2D8C6; padding: clamp(10px, 1.8vw, 16px) 0; }
.gr-wall-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.gr-pin { position: absolute; top: 7px; width: 7px; height: 7px; border-radius: 50%; background: #C9BFAE; box-shadow: 0 1px 2px rgba(58,53,48,0.3); }
.gr-pin-l { left: 12px; }
.gr-pin-r { right: 12px; }
.gr-box { position: relative; z-index: 1; width: 100%; height: clamp(150px, 26vh, 236px); display: grid; place-items: center; }
.gr-grid { display: grid; justify-content: center; }
/* Снимок: белая рамка и цветная картинка внутри, как отпечаток на стене. */
.gr-ph { position: relative; border-radius: 2px; background: #FFFFFF; box-shadow: 0 1px 2px rgba(58,53,48,0.22); box-sizing: border-box; padding: 1px; transition: width 440ms linear, height 440ms linear; }
.gr-ph i { display: block; width: 100%; height: 100%; border-radius: 1px; }
.gr-cap { margin: 4px 0 0; font-size: 14px; color: #8A8883; }
/* Строка пар: каждая пара — одна раскладка. Квадратная выделена. */
/* Кнопки с одной цифрой растягивались на полтораста пикселей: во flex-строке
   они тянулись по высоте контейнера. Прижимаем к содержимому. */
.gr-opts .option { align-self: flex-start; padding: 11px 12px !important; }
.gp-row { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 0 0 10px; }
.gp-chip { display: inline-flex; align-items: center; gap: 3px; padding: 5px 9px; border-radius: 9px; background: #E3F0E8; color: #1F7A4D; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; animation: gpIn 300ms cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.gp-chip i { font-style: normal; opacity: 0.55; }
.gp-square { background: #FFE8E1; color: #FF4F28; }
@keyframes gpIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

/* ===== ЭКРАН 14: финальный тест (fn = final) ===== */
/* Наборная панель телефонной раскладки, образец — 3 класс. Панель не тянется
   во всю ширину: клавиатура шириной в экран заставляет целиться, а не набирать. */
.fn-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.fn-slot { min-width: 152px; min-height: 52px; padding: 0 16px; border-radius: 12px; border: 2.5px solid #FF4F28; background: #FDFBF7; display: grid; place-items: center; font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #0E0E10; transition: border-color 180ms linear, background-color 180ms linear, color 180ms linear; }
.fn-slot.fn-bad { border-color: #E0563A; background: #FDECE7; color: #B33F27; }
.fn-slot.fn-ok { border-color: #1F7A4D; background: #EAF6EF; color: #1F7A4D; }
.fn-pad { display: grid; grid-template-columns: repeat(3, clamp(52px, 11vw, 64px)); gap: 7px; margin-top: 0; }
.fn-key { height: clamp(44px, 8.4vw, 52px); border-radius: 11px; border: 2px solid #D8D2C6; background: #FFFFFF; font-size: clamp(18px, 3.4vw, 21px); font-weight: 800; color: #0E0E10; cursor: pointer; transition: background-color 180ms linear; }
.fn-key:active:not(:disabled) { background: #faf7f1; }
.fn-key:disabled { color: #A7A6A2; background: #faf7f1; cursor: default; }
.fn-del { color: #8A8883; font-size: 19px; }
.fn-go { background: #1F7A4D; border-color: #1F7A4D; color: #FFFFFF; }
.fn-go:disabled { background: #faf7f1; border-color: #D8D2C6; color: #A7A6A2; }

/* ===== ЯКОРЬ: делители до числа, кратные после (an = anchor) ===== */
.an-box { border: 1px solid #e9e3d9; border-radius: 14px; background: #FFFFFF; padding: clamp(11px, 2vw, 15px); }
.an-line { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.an-left { flex: 1; min-width: 130px; text-align: right; font-size: 14px; line-height: 18px; color: #1F7A4D; }
.an-mid { flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: #FFE8E1; color: #FF4F28; font-size: 19px; font-weight: 700; }
.an-right { flex: 1; min-width: 130px; font-size: 14px; line-height: 18px; color: #019ACB; }
.an-metro { margin: 10px 0 0; padding-top: 9px; border-top: 1px solid #e9e3d9; font-size: 14px; line-height: 18px; color: #8A8883; }

/* ===== ПАМЯТКА В ИТОГЕ (mm = memo) ===== */
.mm-grid { display: grid; grid-template-columns: auto 1fr; gap: 7px 14px; align-items: baseline; }
.mm-row { display: contents; }
.mm-q { font-size: 15px; font-weight: 700; color: #0E0E10; }
.mm-a { font-size: 15px; color: #494550; }

/* ===== МНОЖИТЕЛЬ НАД КРАТНЫМ ===== */
.mg-mul { position: absolute; transform: translateX(-50%); font-size: 12px; font-weight: 700; color: #019ACB; }

@media (max-width: 639.98px) {
  .sv-opts .option { min-width: 0; }
  .an-left, .an-right { text-align: left; min-width: 0; flex-basis: 100%; }
  /* Телефон: строка памятки идёт в одну линию, а не в две — иначе итог
     перерастает экран на 74 пикселя. */
  .mm-grid { display: block; }
  .mm-row { display: block; margin-bottom: 6px; }
  .mm-q, .mm-a { display: inline; font-size: 14px; line-height: 18px; }
  .mm-q::after { content: " — "; font-weight: 400; color: #8A8883; }
  /* Телефон: карточки итога встают в столбик. */
  .sm-cards { grid-template-columns: 1fr; }
  .sm-banner { gap: 8px; padding: 9px 12px; }
  .sm-banner-glyphs { display: none; }
  .sm-banner-tag { display: none; }
  /* Итог на телефоне: четыре блока и связи не влезали в 844px. Ужимаем
     отступы и межстрочный интервал, размер шрифта НЕ трогаем. */
  .g6-final-slide { gap: 5px !important; }
  .g6-final-slide .frame { padding: 9px 11px; }
  .g6-final-slide .sm-main .body,
  .g6-final-slide .sm-read-close { line-height: 18px; }
  .g6-final-slide .sm-main > div { gap: 5px !important; }
  .g6-final-slide .sm-head .h-sub { font-size: 22px; }
  /* Раскладка 3 на 3 остаётся и на телефоне: она для того и выбрана. */
  .fn-pad { grid-template-columns: repeat(3, clamp(56px, 17vw, 68px)); }
}
.tl-num { display: grid; place-items: center; min-width: 72px; height: 44px; padding: 0 12px; border-radius: 12px; border: 1px solid #e9e3d9; background: #faf7f1; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; color: #0E0E10; }
.tl-banner { display: flex; align-items: center; gap: 8px; font-size: 15px; line-height: 19px; font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 5px 12px; }
.tl-banner-play { color: #1F7A4D; background: #E3F0E8; }
.tl-acts { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.tl-replay { height: 40px; padding: 0 18px; border-radius: 12px; border: 1px solid #e9e3d9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: 17px; font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-next { height: 40px; padding: 0 20px; border-radius: 12px; border: 1px solid #FF4F28; background: #FF4F28; color: #FFFFFF; font-family: 'Manrope', system-ui, sans-serif; font-size: 17px; font-weight: 700; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.tl-replay:disabled, .tl-next:disabled { color: #A7A6A2; background: #faf7f1; border-color: #e9e3d9; cursor: default; }
@media (max-width: 639.98px) {
  /* Управление занимало 262 пикселя из 708 доступных: метка стояла НАД каждым
     контролом и блок разъезжался на четыре ряда. Метку ставим рядом, кнопки
     уменьшаем так, чтобы восемь делителей влезли в одну строку. */
  .tl-ctl { gap: 7px; }
  .tl-grp { flex-direction: row; align-items: center; gap: 8px; }
  .tl-grp:nth-child(2) { flex-direction: column; align-items: flex-start; gap: 3px; }
  .tl-step { font-size: 10px; letter-spacing: 0.1em; }
  .tl-num { width: auto; min-width: 54px; height: 38px; padding: 0 10px; font-size: 20px; }
  .tl-divs { gap: 3px; }
  .tl-div { width: 36px; height: 38px; font-size: 19px; }
  .tl-go { width: auto; height: 38px; padding: 0 16px; font-size: 15px; }
  .tl-grp:nth-child(3) .tl-step { display: none; }
  /* Строка задания повторяет баннер очереди — на телефоне места ей нет. */
  .tl-task { display: none; }
  /* Карточка способа стоит на трёх экранах, на телефоне её сжимаем: без этого
     четвёртый экран не помещался на восемнадцать пикселей. */
  .mc-card { padding: 9px 11px; }
  .mc-list { gap: 4px; }
  .mc-step { font-size: 14px; line-height: 18px; }
  .mc-num { width: 18px; height: 18px; font-size: 11px; }
  .mc-note { margin-top: 6px; font-size: 13px; line-height: 17px; }
  /* Высоту .tl-scene НЕ трогаем: она обязана совпадать с константой TL_H в JS,
     иначе плитки считаются по одной высоте, а рисуются в другой. */
  .tl-banner { padding: 5px 10px; font-size: 14px; line-height: 18px; }
  .tl-replay, .tl-next { flex: 1; }
  /* Высоту сцены НЕ меняем: раскладка плиток считается в JS от той же
     константы (TL_H). Разошлись бы — ряды наехали бы на зону остатка. */
}

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
  const safeName = studentName || (tri(lang, 'Ученик', "O'quvchi", 'Student'));
  // navLock: false — metodist qarori 2026-08-13: 1-darsda slayd o'tishi
  // qulflanmaydi. Boshqa darslar bu qiymatni uzatmaydi, ularda qulf o'z joyida.
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm', navLock: false });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  // PREVIEW_START nolga teng, agar URL da `?screen=` bo'lmasa — LMS da shunday.
  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
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

  // Navbat almashadi: tushuntirish -> darhol mashq. SCREEN_META bilan BIR XIL
  // tartibda turishi SHART: baholanadigan ekranlar o'rni bo'yicha topiladi.
  // 15 ekran, 3-sinf 1-darsining karkasi: 1 xuk / 2-7 tushuntirish / 8 qoida /
  // 9-13 mashq / 14 yakuniy test / 15 xulosa. SCREEN_META bilan BIR XIL tartib.
  const screens = [HookScreen, ScreenRecall, Screen1, ScreenTool, Screen6, ScreenSolve, Screen10, Screen3,
    ScreenRoles, ScreenCheck, ScreenFindAll, ScreenError, ScreenGrid, ScreenFinal, Screen14];
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
            {/* 2026-08-13: dars uch tilli bo'ladi. Yangi ekranlar (xuk va 06)
                allaqachon `en` bilan; qolgan ekranlar hozircha `ru` ga tushadi
                (useT zaxirasi) — ular alohida o'tishda tarjima qilinadi. */}
            {['ru', 'uz', 'en'].map(l => (
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
