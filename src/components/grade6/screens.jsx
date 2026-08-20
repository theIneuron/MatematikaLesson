// ============================================================
// 6 КЛАСС — ОБЩИЙ СЛОЙ ЭКРАНОВ
// Обвязка урока: палитра, звук, контекст языка, мобильный масштаб, типовые
// экраны и базовый CSS. Урок = данные + свои сцены; всё, что повторяется из
// урока в урок, живёт ЗДЕСЬ и правится в одном месте.
//
// Вынесено из Dars01.jsx 2026-08-15 без изменений поведения на экране.
// Правила слоя — context/GRADE6_ETALON.md.
// ============================================================
import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import './Grade6TheoryTheme.css';
import { normalizeTtsColons } from './ttsMathColon.js';

// ============================================================
// РЕЕСТР УРОКА
// Общий слой не знает ни идентификатора урока, ни ролей его экранов: урок
// сообщает их о себе один раз, при загрузке своего модуля. Без реестра
// пришлось бы тащить SCREEN_META пропсом через каждый экран.
// ============================================================
let lessonRegistry = { meta: {}, screenMeta: [] };
const registerLesson = ({ meta, screenMeta }) => {
  lessonRegistry = { meta: meta || {}, screenMeta: screenMeta || [] };
};
const lessonMetaOf = () => lessonRegistry.meta;
const screenScope = (i, fallback = 'practice') => (lessonRegistry.screenMeta[i]?.scope ?? fallback);

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
// navLock: «Davom» tugmasini qulflash. Metodist qarori 2026-08-20: qulf YOQILGAN
// BUTUN SINFDA — tugma slayd ovozi to'liq aytilgandan keyin ochiladi. Ilgari
// 46 darsning hammasi `navLock: false` uzatardi (2026-08-13 dagi 1-dars qarori
// shablon orqali hamma darsga tarqalgan edi), ya'ni qulf amalda ishlamasdi.
// Ikki klapan saqlanadi: ovoz o'chirilgan bo'lsa qulf yo'q, TTS javob bermasa
// esa NAV_UNLOCK_MS dan keyin o'zi ochiladi.
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
// Сторож зависшей озвучки: реплика слайда нигде не длиннее минуты, поэтому
// после этого срока замок открывается в любом случае.
const NAV_STUCK_MS = 75000;
// Тот же сторож для кадров показа: кадр ждёт свою реплику, но не дольше.
const STEP_STUCK_MS = 45000;

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
  const lessonId = lessonMetaOf().lessonId || '';
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
  // MUHIM: taymer faqat ovoz BOSHLANMAGAN holatda ishlaydi. Ilgari u har doim
  // ishlardi va uzun izohli slaydda qulf to'qqizinchi soniyada ochilardi — bola
  // tushuntirishni eshitmasdan o'tib ketishi mumkin edi (metodist 2026-08-20).
  const [navTimedOut, setNavTimedOut] = useState(false);
  useEffect(() => {
    // Сброс через таймер: setState прямо в теле эффекта ловится линтом класса.
    const reset = setTimeout(() => setNavTimedOut(false), 0);
    // Короткий клапан: ОЗВУЧКА НЕ НАЧАЛАСЬ — значит TTS не ответил.
    const quick = state.hasStarted ? null : setTimeout(() => setNavTimedOut(true), NAV_UNLOCK_MS);
    // Длинный сторож: озвучка началась и не кончается. Так бывает при обрыве
    // сети: без него урок с включённым замком встал бы насмерть.
    const stuck = setTimeout(() => setNavTimedOut(true), NAV_STUCK_MS);
    return () => { clearTimeout(reset); if (quick) clearTimeout(quick); clearTimeout(stuck); };
  }, [stableSegments, state.hasStarted]);

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
// Надпись над слайдом («BU NIMAGA KERAK», «MASHQ», «УРОК ПРОЙДЕН») убрана по
// решению методиста 2026-08-20: она ничего не объясняла, а кнопка сайта
// «← Darslar ro'yxati» наезжала на неё, и ребёнок видел обрубок «...RAK».
// Поле `eyebrow` удалено и из данных уроков (решение методиста 2026-08-20):
// хранить текст, которого нет на экране, незачем.
const Stage = ({ children, screen, totalScreens, navContent, audioState }) => {
  const isMobile = useIsMobile();
  const padH = isMobile ? 12 : 'clamp(16px, 4vw, 48px)';
  return (
    <div className={`stage screen-${screen + 1}`}>
      <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }}/>
        </div>
        <div className="chrome">
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
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

// Человек на сцене. Решение методиста 2026-08-15: у фигуры ОБЯЗАТЕЛЬНО есть
// лицо — два глаза и улыбка, иначе она читается как манекен. Все размеры
// считаются от радиуса головы, поэтому крупный герой на переднем плане и
// мелкая фигура в глубине рисуются одним кодом.
// Живёт здесь, а не в уроке: сцена у каждого урока своя, но человек в этом
// мире один и тот же (уроки 2-7 рисовали его пятью одинаковыми копиями).
const Person = ({ x, ground, head = 10, shirt = '#7ECBE6', hair = '#3E3128', arms = true }) => {
  const body = head * 3.4;
  const w = head * 2.4;
  const cy = ground - body - head * 0.5;
  return (
    <g>
      <ellipse cx={x} cy={ground + 1} rx={w * 0.5} ry={head * 0.2} fill="rgba(90,62,34,0.16)"/>
      <path d={`M${x - w / 2} ${ground} q${w / 2} ${-head * 0.5} ${w} 0 v${-body} q${-w / 2} ${-head * 0.6} ${-w} 0 Z`} fill={shirt}/>
      {arms && (
        <>
          <rect x={x - w * 0.62} y={ground - body * 0.82} width={head * 0.5} height={body * 0.52} rx={head * 0.25} fill={shirt}/>
          <rect x={x + w * 0.62 - head * 0.5} y={ground - body * 0.82} width={head * 0.5} height={body * 0.52} rx={head * 0.25} fill={shirt}/>
        </>
      )}
      <circle cx={x} cy={cy} r={head} fill="#F1C9A5"/>
      <path d={`M${x - head} ${cy - head * 0.2} a${head} ${head} 0 0 1 ${head * 2} 0 z`} fill={hair}/>
      {/* лицо: два глаза и улыбка */}
      <circle cx={x - head * 0.34} cy={cy + head * 0.06} r={head * 0.13} fill="#3C3128"/>
      <circle cx={x + head * 0.34} cy={cy + head * 0.06} r={head * 0.13} fill="#3C3128"/>
      <path d={`M${x - head * 0.32} ${cy + head * 0.42} q${head * 0.32} ${head * 0.28} ${head * 0.64} 0`}
        stroke="#B9805C" strokeWidth={head * 0.12} fill="none" strokeLinecap="round"/>
    </g>
  );
};

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
    // Звук идёт — ждём его. Но не бесконечно: если реплика зависла (обрыв сети,
    // молчащий движок), кадр всё равно сменится, иначе с включённым замком урок
    // встанет насмерть. Обычный ход этим сторожем не задевается: он длиннее
    // самой длинной реплики.
    if (audio.isBusy) {
      voicedRef.current = true;
      const guard = setTimeout(advance, STEP_STUCK_MS);
      return () => clearTimeout(guard);
    }
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
  return (<Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>{renderStep({ t, lang, step, last, refs, muted: audio.muted, activeAudioId: audio.currentSegment, lastCompletedAudioId: audio.lastCompletedSegment })}</Stage>);
};

// ============================================================
// ХУК УРОКА — турнир: 24 участника, команды по 5 или по 6.
// Методист 2026-08-13: урок начинается с вопроса «зачем это учить».
// Оценки здесь нет: выбор ученика — ПРОГНОЗ, а не ответ на тест, поэтому
// ни «верно», ни «ошибка», ни баллов на экране не появляется.
// ============================================================

// ХУК ПРИНИМАЕТ ОТВЕТ И ЗАКРЫВАЕТСЯ (методист 2026-08-14).
// Так работают хуки 1-5 классов (в 5 классе прогноз вообще уходит без реакции)
// и — что важнее — так работают все остальные уроки 6 класса: и движок
// FractionTheoryLesson (уроки 8-46), и собранные вручную уроки 2-7 делают
// pick -> onAnswer -> onNext, без разбора и без оценки. Урок 1 был здесь
// единственным исключением: он показывал разлёт по командам, скамейку с
// четырьмя лишними, формулу 24 : 5 = 4 и вывод. Это тот самый факт, который
// ребёнок должен получить сам на экране 6 («решаем вместе: 24»), поэтому весь
// разбор и движок сцены с командами убраны.
//
// Урок даёт сюда ДВЕ вещи: `content` — свой узел s_hook, и `sceneNode` — свою
// сцену. Сцена у каждого урока СВОЯ (решение методиста 2026-08-15): один мир на
// класс, но нарисованный под тему этого урока. Остальное — общее.
const HookScreen = ({ screen, totalScreens, content, sceneNode, onAnswer, onNext, onPrev }) => {
  const c = content;
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

  // Два варианта прогноза урок задаёт сам: `options: [узел, узел]`. Старые
  // ключи `opt_5` и `opt_6` остались от урока 1 и поддержаны, чтобы его не
  // переписывать; новый урок пишет `options`.
  const options = c.options || [c.opt_5, c.opt_6];

  const pick = (i) => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setPicked(i);
    audio.triggerEvent('option_picked');
    // correct и firstTry — null: экран вне оценки, статистика его не считает.
    onAnswer({
      stage: 'hook',
      screenIdx: screen,
      studentAnswerIndex: i,
      studentAnswer: pickL(options[i], lang),
      correct: null,
      firstTry: null,
    });
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="hk">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ margin: 0 }}>{t(c.lead)}</p>
        {/* Блок из двух реплик героев СНЯТ (решение методиста 2026-08-19): он
            занимал 48 px на рабочем столе и 93 px на телефоне, и из-за него хук
            уходил в скролл на невысоких окнах (замер: 1366x700 — 40 px скролла,
            390x740 — 9 px). Спор героев остаётся на сцене, где они нарисованы, в
            озвучке, где названы оба мнения, и в двух вариантах прогноза.
            Узлы `voice_a` и `voice_b` в контенте уроков не удалены: озвучка хука
            опирается на них по смыслу, и вернуть блок можно одной строкой. */}
        {/* Сцена урока стоит на экране всё время, пока экран открыт: она больше
            не подменяется разбором. Люди и предметы рисуются ВНУТРИ сцены — так
            их можно расставить в перспективе; отдельный ряд фигурок поверх
            картинки перспективы не даёт. Пропорция кадра общая для класса
            (400 к 154), чтобы хук везде занимал одну и ту же высоту. */}
        <div className="frame hk-frame fade-up delay-1">
          <div className="hk-gym">{sceneNode}</div>
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
              {options.map((opt, i) => (
                <button key={i} className={'option' + (picked === i ? ' is-hook-picked' : '')}
                  disabled={picked !== null} onClick={() => pick(i)}>
                  {t(opt)}
                </button>
              ))}
            </div>
          </div>
        )}
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
    onAnswer({ stage: screenScope(screen), screenIdx: screen, question: c.question[lang], options: nums, correctIndex: null, correctAnswer: divs.join(', '), studentAnswerIndex: null, studentAnswer: nextLocked.join(', '), correct: true, firstTry: firstTryRef.current });
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
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
  // Экран правила тоже ждёт озвучку: без этого он был единственным, где кнопка
  // открыта сразу (решение методиста 2026-08-20 — замок на КАЖДОМ слайде).
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={navLocked(!audio.canAdvance)} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
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
        onAnswer({ stage: screenScope(screen), screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'sorted', studentAnswer: JSON.stringify(np), correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true });
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
  // Метка карточки бывает формулой (строка, одна на все языки) и словами
  // (узел {ru, uz, en}). Без этого второй случай даёт [object Object].
  const cardLabel = (v) => (typeof v === 'string' ? v : pickL(v, lang));
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={navLocked(!solved || !audio.canAdvance)} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-sub">{t(c.title)}</h2>
          {!solved && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{mt(t(c.lead))}</p>}
        </div>
        {!solved && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minHeight: 92, justifyContent: 'center' }}>
            <p className="small mono" style={{ margin: 0, color: T.ink3 }}>{pos + 1} / {total}</p>
            <div key={pos} className="display fade-up" style={{ fontSize: 'clamp(26px, 5.6vw, 42px)', color: T.ink }}>{mt(cardLabel(cards[cardIdx].label))}</div>
          </div>
        )}
        {/* Savatlar javobdan keyin yig'iladi — natija correct_text va WhyCard'da qoladi. */}
        <div className={'fade-up delay-2 ans-block' + (solved ? ' ans-gone' : '')} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {bins.map(b => {
            const chips = placed.map((p, k) => (p === b.key ? cardLabel(cards[k].label) : null)).filter(Boolean);
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
    onAnswer({ stage: screenScope(screen), screenIdx: screen, question: c.title[lang], options: null, correctIndex: null, correctAnswer: 'match', studentAnswer: JSON.stringify(assign), correct: firstTryRef.current, firstTry: firstTryRef.current });
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
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
      stage: screenScope(props.screen, null),
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

// ПРАКТИКА НА НЕСКОЛЬКО ЗАДАНИЙ — типовой экран класса.
// Три-четыре задания подряд на одном экране (решение методиста 2026-08-13),
// счётчик заданий сверху, разбор на КАЖДЫЙ неверный вариант, «веди-до-верного»:
// неверный ответ не пускает дальше, балл считается по первой попытке.
//
// Урок даёт данные, а не вёрстку:
//   content = { title, lead, counter, items: [{
//     q,                 — вопрос
//     opts: [узел…],     — от двух до четырёх вариантов
//     correct,           — индекс верного
//     ok,                — разбор верного ответа (виден и звучит)
//     wrong: [узел|null] — разбор на каждый неверный, по индексам вариантов
//   }] }
//   asideNode — карточка способа, которым это задание решается: она стоит
//               РЯДОМ с заданием, потому что способ объяснялся раньше и к
//               практике успевает забыться.
//   figureNode(item, i) — необязательная опора над вопросом.
const MultiTask = (props) => {
  const { screen, totalScreens, content, asideNode = null, figureNode = null, onNext, onPrev } = props;
  const c = content;
  const t = useT();
  const lang = useLang();
  const items = c.items;
  const audio = useAudio([{ id: `s${screen}_intro`, text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);   // индекс выбранного варианта
  const [solved, setSolved] = useState(false);
  const firstAllRef = useRef(true);
  const record = useRecord(props, items.length);
  const done = round >= items.length;
  const idx = Math.min(round, items.length - 1);
  const it = items[idx];
  const fbRef = useRevealScroll(solved || done, 320);
  // Разбор неверного ответа подтягивается в кадр: на низком экране он выходит
  // под нижнюю панель, и ребёнок его не видит. В active идёт номер попытки.
  const hintRef = useRevealScroll(solved ? 0 : (picked === null ? 0 : picked + 1), 320);

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const engine = getAudioEngine();
    if (engine) engine.pushOneOff(pickL(node, lang), undefined, id);
  };

  const answer = (i) => {
    if (done || solved) return;
    setPicked(i);
    if (i !== it.correct) {
      firstAllRef.current = false;
      say((it.wrong && it.wrong[i]) || it.ok, `s${screen}_w${idx}_${i}`);
      return;
    }
    setSolved(true);
    say(it.ok, `s${screen}_ok${idx}`);
    setTimeout(() => {
      if (round + 1 >= items.length) {
        setRound(items.length);
        record(firstAllRef.current, pickL(c.title, lang));
      } else {
        setRound((r) => r + 1);
        setPicked(null);
        setSolved(false);
      }
    }, 1500);
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!done || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        {c.lead && <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{t(c.lead)}</p>}
        {!done && c.counter && <TaskCount node={c.counter} i={round + 1} n={items.length}/>}

        <div className="frame fade-up delay-1" style={{ padding: 'clamp(13px, 2.4vw, 20px)' }}>
          {figureNode && <div style={{ marginBottom: 12 }}>{figureNode(it, idx)}</div>}
          <p className="body" style={{ margin: 0, marginBottom: 12 }}>{mt(t(done ? items[items.length - 1].q : it.q))}</p>
          <div className={'sv-opts' + (it.opts.length > 2 ? ' sv-opts-col' : '')}>
            {it.opts.map((o, i) => {
              const wrongPick = !solved && picked === i;
              const rightOne = (solved || done) && i === it.correct;
              return (
                <button key={i} className={'option' + (rightOne ? ' option-correct' : (wrongPick ? ' option-picked-wrong' : ''))}
                  disabled={solved || done} onClick={() => answer(i)}>{mt(t(o))}</button>
              );
            })}
          </div>
          {!solved && picked !== null && picked !== it.correct && (
            <div ref={hintRef}>
              <HintBlock show>{mt(t((it.wrong && it.wrong[picked]) || it.ok))}</HintBlock>
            </div>
          )}
          {(solved || done) && (
            <div ref={fbRef}>
              <FeedbackBlock show isCorrect>
                <p className="body" style={{ margin: 0 }}>{mt(t(done ? items[items.length - 1].ok : it.ok))}</p>
              </FeedbackBlock>
            </div>
          )}
        </div>

        {asideNode}
      </div>
    </Stage>
  );
};

// ФИНАЛЬНЫЙ ТЕСТ — пять заданий на одном экране (наказ 3 класса).
// Смешанный тип: одно с набором числа, четыре с выбором. Оценки нет,
// но разбор есть на каждый неверный вариант.
// Урок даёт `content` (узел s_final с items) и необязательный `factNode`.
//
// Длина числового ответа. Предел был ТРИ цифры, и задание урока 44 «сколько
// кубических сантиметров в литре» с ответом 1000 стало недостижимым: поле
// принимало «100» и не пускало дальше. Предел поднят до четырёх — этого хватает
// всем ответам класса, а поле остаётся узким и цифру не приходится искать.
const MAX_NUM_LEN = 4;
const FinalPanel = (props) => {
  const { screen, totalScreens, content, factNode = null, onNext, onPrev } = props;
  const c = content;
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
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
                        onClick={() => { setNumBad(false); setTyped((v) => (v.length < MAX_NUM_LEN ? v + d : v)); }}>{d}</button>
                    ))}
                    <button className="fn-key fn-go" disabled={ok || typed === ''} onClick={submitNum}>&#10003;</button>
                    <button className="fn-key mono" disabled={ok}
                      onClick={() => { setNumBad(false); setTyped((v) => (v.length < MAX_NUM_LEN ? v + '0' : v)); }}>0</button>
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

        {done && factNode}
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

// ИТОГ УРОКА. Общее: баннер темы, сцена, закрывающая хук, и карточка «Главное».
// Урок даёт `content` (узел s14), `sceneNode` — свою финальную сцену, и
// `cards` — свои карточки после «Главного» (памятка, второе прочтение и т.п.).
// Сцена финала ОБЯЗАТЕЛЬНА (решение методиста 2026-08-15): вопрос, заданный на
// хуке, получает на ней видимый ответ.
const SummaryScreen = ({ screen, totalScreens, content, sceneNode, cards = null, onReset, onPrev, finishLesson }) => {
  const c = content;
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
    <Stage screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      {/* Ixcham tuzilish: sarlavha va ball BITTA qatorda, ichki bo'shliqlar
          kichraytirilgan — yakuniy ekran 360x640 da ham skrollsiz sig'adi. */}
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
        {/* Урок закрывается тем же местом, с которого начался (методист
            2026-08-14): вопрос хука получает ответ прямо на сцене. */}
        <div className="fin-frame fade-up delay-1">
          {sceneNode}
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

          {cards}
        </div>

      </div>
    </Stage>
  );
};

// ============================================================
const BASE_STYLES = `html, body { margin: 0; padding: 0; }
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
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.42s; }
.delay-3 { animation-delay: 0.64s; }
.delay-4 { animation-delay: 0.86s; }
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
/* На телефоне кнопки стояли в 12 px от нижнего края и читались как приклеенные
   ко краю экрана (QA 2026-08-19). Отступ удвоен: полоса панели остаётся во всю
   ширину, поднимаются только кнопки. Высоту забираем у содержимого, и это
   проверено — на 390x844 ни один экран класса не уходит в скролл. */
@media (max-width: 639.98px) {
  .stage-nav { padding-bottom: 24px; }
}
.chrome { display: flex; align-items: center; justify-content: flex-end; margin-bottom: 0; }
.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.75s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }
.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 30px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 16px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }
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
/* Баннер итога: полоса с темой, названием урока и знаками действий. */
.sm-banner { display: flex; align-items: center; gap: clamp(10px, 2vw, 18px); border-radius: 16px; padding: clamp(11px, 2vw, 17px) clamp(14px, 2.4vw, 22px); background: linear-gradient(100deg, #FFE8E1 0%, #FBF3D6 62%, #E3F0E8 100%); overflow: hidden; }
.sm-banner-tag { flex-shrink: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700; color: #FF4F28; }
.sm-banner-h { margin: 0; flex: 1; font-size: clamp(20px, 3.2vw, 30px); }
.sm-banner-glyphs { display: flex; gap: 10px; flex-shrink: 0; }
.sm-banner-glyphs i { font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: clamp(18px, 3vw, 26px); font-weight: 700; color: rgba(73, 69, 80, 0.28); }
@keyframes finIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
.sm-cards { display: flex; flex-direction: column; gap: clamp(7px, 1.2vw, 11px); }
.sm-card { padding: clamp(10px, 1.6vw, 14px) clamp(12px, 2vw, 18px); display: flex; flex-direction: row; align-items: baseline; gap: clamp(12px, 2vw, 20px); }
.sm-card-h { flex: 0 0 clamp(84px, 12vw, 120px); margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A8883; font-weight: 700; }
.sm-card > :not(.sm-card-h) { flex: 1; }
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
/* Javob variantlari bloki: to'g'ri javobdan keyin yuqoriga yig'ilib yo'qoladi,
   "To'g'ri" va "Nega shunday" tepaga chiqadi — skroll kerak bo'lmaydi.
   margin-bottom manfiy — ota-flex'ning gap'i ham yopiladi, izsiz ketadi.
   Barcha savol ekranlari uchun umumiy (s2, s9, s12, s13). */
.ans-block { display: flex; flex-direction: column; gap: clamp(12px, 2.2vw, 16px); max-height: 900px; opacity: 1; transform: translateY(0); overflow: hidden; transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.ans-gone { max-height: 0; opacity: 0; transform: translateY(-18px); margin-bottom: calc(-1 * clamp(12px, 2.2vw, 16px)); pointer-events: none; }
/* Интервалы хука ужаты (2026-08-14): на ноутбучных 1280x800 зал, вопрос и
   строка принятия не влезали в экран и появлялся скролл. Сцену не уменьшаем —
   она главная, срезаны только пустоты между блоками. */
.hk { display: flex; flex-direction: column; gap: clamp(7px, 1vw, 9px); }
/* Правила .hk-voices, .hk-voice, .hk-who удалены вместе с блоком реплик:
   мёртвый CSS уезжает в каждый из 46 файлов LMS и выглядит рабочим. */
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
@media (prefers-reduced-motion: reduce) {
  .hk-banner, .hk-ball, .hk-kid { animation: none; }
}
.hk-ask { display: flex; flex-direction: column; gap: 7px; }
/* Кисть-стикер: тень отделяет её от сцены, кончик пальца стоит в точке показа. */
.hs { position: absolute; left: -9px; top: 0; width: 34px; height: auto; filter: drop-shadow(0 6px 12px rgba(58, 53, 48, 0.32)); }
@keyframes prArc { to { stroke-dashoffset: 0; } }
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
/* Тот же строй, но в практике: команд бывает семь, поэтому отступы теснее. */
.tf-row { gap: clamp(4px, 0.9vw, 7px); margin: 2px 0 8px; }
.tf-row .rc-team { gap: 1px; padding: 3px clamp(3px, 0.7vw, 5px); }
/* ===== СЧЁТЧИК ЗАДАНИЙ ===== */
.tk-count { margin: 0; font-size: 13px; font-weight: 700; color: #FF4F28; letter-spacing: 0.06em; }
@keyframes gpIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
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
/* ===== НИЗКОЕ ОКНО: КАРТОЧКА СПОСОБА И ВАРИАНТЫ =====
   Остальную плотность низкого окна держит Grade6TheoryTheme.css — там режим
   max-height живёт с самого начала и правила там сильнее. Здесь только то,
   чего в теме нет: карточка способа стоит на каждом экране практики и на
   низком окне съедала 130 пикселей. Текст остаётся целиком, ужимается воздух. */
@media (min-width: 640px) and (max-height: 780px) {
  .mc-card { padding: 8px 12px; }
  .mc-h { margin-bottom: 3px; }
  .mc-list { gap: 2px; }
  .mc-list li { font-size: 13.5px; line-height: 17px; }
  .mc-note { margin-top: 4px; font-size: 12.5px; line-height: 15px; }
  .sv-opts .option { padding-top: 9px !important; padding-bottom: 9px !important; }
}
@media (min-width: 640px) and (max-height: 700px) {
  .mc-card { padding: 6px 11px; }
  .mc-list li { font-size: 13px; line-height: 16px; }
  .sv-opts .option { padding-top: 7px !important; padding-bottom: 7px !important; }
}

/* ===== ПАМЯТКА В ИТОГЕ (mm = memo) ===== */
.mm-grid { display: grid; grid-template-columns: auto 1fr; gap: 7px 14px; align-items: baseline; }
.mm-row { display: contents; }
.mm-q { font-size: 15px; font-weight: 700; color: #0E0E10; }
.mm-a { font-size: 15px; color: #494550; }
@media (max-width: 639.98px) {
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
@media (max-width: 639.98px) {
  /* Карточка способа стоит на трёх экранах, на телефоне её сжимаем: без этого
     четвёртый экран не помещался на восемнадцать пикселей. */
  .mc-card { padding: 9px 11px; }
  .mc-list { gap: 4px; }
  .mc-step { font-size: 14px; line-height: 18px; }
  .mc-num { width: 18px; height: 18px; font-size: 11px; }
  .mc-note { margin-top: 6px; font-size: 13px; line-height: 17px; }
  /* Высоту сцены НЕ меняем: раскладка плиток считается в JS от той же
     константы (TL_H). Разошлись бы — ряды наехали бы на зону остатка. */
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
/* Классы, которые рисует САМ общий слой: рамка финальной сцены и ряд
   вариантов. Их правила обязаны лежать здесь, иначе следующий урок получит
   сцену без рамки, а варианты без раскладки. */
.fin-frame { position: relative; width: 100%; border-radius: 14px; overflow: hidden; border: 1px solid #E4DACA; line-height: 0; }
.sv-opts { display: flex; gap: 10px; flex-wrap: wrap; }
.sv-opts-col { flex-direction: column; }
.sv-opts .option { flex: 1; min-width: 120px; }
.sv-opts-col .option { width: 100%; }
@media (max-width: 639.98px) {
  .sv-opts .option { min-width: 0; }
}
/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА ПРЕВЬЮ (.g6-lang-switch).
   Правила у класса не было вообще: сорок пять уроков рисовали его блоком В
   ПОТОКЕ, он занимал 24 px сверху и на столько же опускал сцену. Нижняя панель
   с кнопкой Davom etish уходила за нижний край и обрезалась (замерено
   2026-08-19: nav 718..792 при экране 768). Урок 1 держал этот переключатель
   своим inline-стилем position: fixed, поэтому у него панель стояла на месте —
   отсюда и разница, которую увидел QA.
   Переключатель живёт только в превью (isPreview), в LMS его нет: там язык
   приходит пропом. Размеры и цвета — те же, что у урока 1, чтобы класс выглядел
   одинаково. */
/* Высота полосы ограничена сверху НЕ вкусом: верхняя панель урока начинается на
   30-й точке (полоса прогресса 12..18 плюс 12 отступа), а в ней справа стоят
   кнопка звука и повтор. Пилюля в 33 px, приколотая на 10-й точке, накрывала их
   верхнюю половину — ребёнок и методист не могли выключить звук с первого раза
   (замерено 2026-08-19: переключатель 10..43, кнопка звука 30..56). Теперь
   3..26 — панель урока свободна. */
.g6-lang-switch { position: fixed; top: 3px; right: 10px; z-index: 1000; display: flex; gap: 4px; background: #FFFFFF; border-radius: 99px; padding: 3px; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.25); }
.g6-lang-switch .btn-ghost { padding: 2px 10px; border-radius: 99px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.3; font-weight: 600; color: #5A5A60; }
.g6-lang-switch .btn-ghost:hover:not(:disabled) { background: #FFE8E1; color: #FF4F28; box-shadow: none; }
.g6-lang-switch .btn-ghost.is-on, .g6-lang-switch .btn-ghost.is-on:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: none; }
`;

export {
  T,
  configureLesson,
  navLocked,
  registerLesson,
  tri,
  pickL,
  plRu,
  rowsWord,
  mt,
  Frac,
  Op,
  LangContext,
  useLang,
  useT,
  useIsMobile,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  makeAudioSegments,
  useSfx,
  useRevealScroll,
  useIntroStages,
  useAnswerSequence,
  useRecord,
  useFilmPhase,
  useFilmSteps,
  stepMs,
  shuffleArr,
  PREVIEW_START,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  FeedbackBlock,
  HintBlock,
  StepDots,
  Floaters,
  Title,
  Person,
  FactCard,
  FB_SCI,
  FB_HIST,
  AnimDigits,
  AnimStars,
  WhyCard,
  MethodCard,
  NowYou,
  TaskCount,
  Unit,
  DivisorChips,
  MultiplesTrack,
  EquationLine,
  QuestionScreen,
  RevealScreen,
  RuleScreen,
  PickDivisors,
  Classify,
  DragMatch,
  MultiTask,
  HookScreen,
  FinalPanel,
  SummaryScreen,
  BASE_STYLES,
};
