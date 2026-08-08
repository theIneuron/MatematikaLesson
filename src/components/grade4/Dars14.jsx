import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// 4-SINF · 14-DARS · Harakatga doir masalalar

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 4, 3, 4, 4, 4, 2, 2, 2, 2, 2, 3, 5];
const LESSON_META = {
  lessonId: 'num-4-14-v1',
  slug: 'dars14-harakat-masalalari',
  lessonTitle: { uz: "14-dars. Harakatga doir masalalar", ru: 'Урок 14. Задачи на движение' },
  skillTags: ['distance', 'speed', 'time', 'uniform_motion', 'units', 'word_problems'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's2', type: 'rule', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's4', type: 'comparison', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's6', type: 'synthesis', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's7', type: 'guided-example', template: 'AnimatedExplanation', scored: false, scope: null },
  { id: 's8', type: 'practice', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'practice', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'practice', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'practice', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'practice', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'SummaryScreen', scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Yo'l sirlari", ru: 'Секрет пути' },
    title: { uz: "180 kilometrli yo'l", ru: 'Путь длиной 180 километров' },
    question: { uz: "Tezlik qaysi?", ru: 'Какова скорость?' },
    options: [
      { uz: "60 km/soat", ru: '60 км/ч' },
      { uz: "177 km/soat", ru: '177 км/ч' },
      { uz: "540 km/soat", ru: '540 км/ч' },
    ],
    feedback: { uz: "Taxmin saqlandi. Endi uch kattalikni o'rganamiz.", ru: 'Предположение сохранено. Теперь разберём три величины.' },
    feedbackAudio: { uz: "Taxmin saqlandi. Endi uch kattalikni o'rganamiz.", ru: 'Предположение сохранено. Теперь разберём три величины.' },
    audio: {
      uz: ["Bit uch soatda bir yuz sakson kilometr yuradigan transport uchun tezlikni topmoqchi.", "Har bir soatda teng masofa bosib o'tiladi.", "Hozircha taxminingizni tanlang."],
      ru: ['Бит хочет найти скорость транспорта, проходящего сто восемьдесят километров за три часа.', 'За каждый час проходит одинаковое расстояние.', 'Пока выбери свой вариант.'],
    },
  },
  s1: {
    eyebrow: { uz: "Uch kattalik", ru: 'Три величины' },
    title: { uz: "Masofa, vaqt va tezlik", ru: 'Расстояние, время и скорость' },
    audio: {
      uz: ["Qirq sakkiz kilometr bosib o'tilgan masofadir.", "To'rt soat harakat vaqtidir.", "Masofani to'rtta teng vaqt bo'lagiga ajratsak, har bir soatga o'n ikki kilometr to'g'ri keladi.", "Soatiga o'n ikki kilometr harakat tezligidir."],
      ru: ['Сорок восемь километров это пройденное расстояние.', 'Четыре часа это время движения.', 'Если разделить путь на четыре равных часа, на каждый час приходится двенадцать километров.', 'Двенадцать километров в час это скорость движения.'],
    },
  },
  s2: {
    eyebrow: { uz: "Tezlik", ru: 'Скорость' },
    title: { uz: "Bir soatdagi masofani topamiz", ru: 'Находим путь за один час' },
    audio: {
      uz: ["Masofa va vaqt ma'lum, tezlik noma'lum.", "Har bir soatdagi masofani topish uchun umumiy masofani vaqtga bo'lamiz.", "Qirq sakkizni to'rtga bo'lsak, o'n ikki chiqadi.", "Tezlikni topish uchun masofani vaqtga bo'lamiz."],
      ru: ['Расстояние и время известны, скорость неизвестна.', 'Чтобы найти путь за один час, общее расстояние делим на время.', 'Сорок восемь разделить на четыре равно двенадцати.', 'Чтобы найти скорость, расстояние делим на время.'],
    },
  },
  s3: {
    eyebrow: { uz: "Masofa", ru: 'Расстояние' },
    title: { uz: "Teng bo'laklarni yig'amiz", ru: 'Собираем равные участки' },
    audio: {
      uz: ["Piyoda har bir soatda to'rt kilometr yuradi.", "Ikki soatda masofa sakkiz kilometr bo'ladi.", "Uch soatda uchta to'rt kilometrlik bo'lak yig'iladi.", "Masofani topish uchun tezlikni vaqtga ko'paytiramiz."],
      ru: ['Пешеход проходит по четыре километра каждый час.', 'За два часа расстояние становится равным восьми километрам.', 'За три часа складываются три участка по четыре километра.', 'Чтобы найти расстояние, скорость умножаем на время.'],
    },
  },
  s4: {
    eyebrow: { uz: "O'lchov birliklari", ru: 'Единицы измерения' },
    title: { uz: "Birliklar nimani aytadi?", ru: 'О чём говорят единицы?' },
    audio: {
      uz: ["Masofa uzunlik birligida o'lchanadi.", "Vaqt soat yoki minut bilan o'lchanadi.", "Tezlik bir vaqt birligida bosib o'tilgan masofani ko'rsatadi."],
      ru: ['Расстояние измеряют единицами длины.', 'Время измеряют часами или минутами.', 'Скорость показывает расстояние, пройденное за единицу времени.'],
    },
  },
  s5: {
    eyebrow: { uz: "Vaqt", ru: 'Время' },
    title: { uz: "Yo'lga nechta soat kerak?", ru: 'Сколько часов нужно на путь?' },
    audio: {
      uz: ["Masofa va tezlik ma'lum, vaqt noma'lum.", "Bir soatda qirq besh kilometr bosib o'tiladi.", "Yana bir soatda jami masofa to'qson kilometr bo'ladi.", "Vaqtni topish uchun masofani tezlikka bo'lamiz."],
      ru: ['Расстояние и скорость известны, время неизвестно.', 'За один час проходит сорок пять километров.', 'Ещё за один час общий путь становится равным девяноста километрам.', 'Чтобы найти время, расстояние делим на скорость.'],
    },
  },
  s6: {
    eyebrow: { uz: "Bog'lanishlar", ru: 'Связи' },
    title: { uz: "Uchta kattalik, uchta qoida", ru: 'Три величины, три правила' },
    audio: {
      uz: ["Tezlik noma'lum bo'lsa, masofani vaqtga bo'lamiz.", "Masofa noma'lum bo'lsa, tezlikni vaqtga ko'paytiramiz.", "Vaqt noma'lum bo'lsa, masofani tezlikka bo'lamiz.", "Avval noma'lum kattalikni aniqlaymiz, keyin mos amalni tanlaymiz."],
      ru: ['Если неизвестна скорость, расстояние делим на время.', 'Если неизвестно расстояние, скорость умножаем на время.', 'Если неизвестно время, расстояние делим на скорость.', 'Сначала определяем неизвестную величину, затем выбираем действие.'],
    },
  },
  s7: {
    eyebrow: { uz: "Masalani o'qish", ru: 'Чтение задачи' },
    title: { uz: "Ma'lumlar → amal → natija", ru: 'Данные → действие → результат' },
    audio: {
      uz: ["Avval masalada berilgan kattaliklarni ajratamiz.", "Keyin nimani topish kerakligini belgilaymiz.", "Vaqt noma'lum bo'lgani uchun masofani tezlikka bo'lamiz.", "Javobni kattalik birligi bilan yozamiz."],
      ru: ['Сначала выделяем известные величины.', 'Затем отмечаем, что нужно найти.', 'Поскольку неизвестно время, расстояние делим на скорость.', 'Ответ записываем вместе с единицей величины.'],
    },
  },
  s8: {
    eyebrow: { uz: "Moslashtirish", ru: 'Соответствие' },
    title: { uz: "Noma'lum kattalikni toping", ru: 'Найди неизвестную величину' },
    question: { uz: "Har bir vaziyatda qaysi kattalik noma'lum?", ru: 'Какая величина неизвестна в каждой ситуации?' },
    situations: [
      { uz: "48 km va 4 soat → ?", ru: '48 км и 4 часа → ?' },
      { uz: "15 km/soat va 3 soat → ?", ru: '15 км/ч и 3 часа → ?' },
      { uz: "180 km va 60 km/soat → ?", ru: '180 км и 60 км/ч → ?' },
    ],
    labels: [{ uz: "tezlik", ru: 'скорость' }, { uz: "masofa", ru: 'расстояние' }, { uz: "vaqt", ru: 'время' }],
    feedbackAudio: {
      wrong: [
        { uz: "Kilometr va soat berilgan. Ularning nisbatidan tezlik topiladi.", ru: 'Даны километры и часы. Их отношение даёт скорость.' },
        { uz: "Tezlik va vaqt berilgan. Ularning ko'paytmasidan masofa topiladi.", ru: 'Даны скорость и время. Их произведение даёт расстояние.' },
        { uz: "Masofa va tezlik berilgan. Ularning nisbatidan vaqt topiladi.", ru: 'Даны расстояние и скорость. Их отношение даёт время.' },
      ],
      partial: { uz: "Bu juftlik to'g'ri. Qolgan vaziyatni ham tekshiring.", ru: 'Эта пара верна. Проверь следующую ситуацию.' },
      correct: { uz: "To'g'ri. Birliklar tezlik, masofa va vaqtni ajratishga yordam berdi.", ru: 'Верно. Единицы помогли различить скорость, расстояние и время.' },
    },
    audio: {
      uz: ["Har bir vaziyatda qaysi kattalik noma'lumligini toping.", "Berilgan birliklar sizga kerakli kattalikni aniqlashga yordam beradi."],
      ru: ['Определи неизвестную величину в каждой ситуации.', 'Единицы данных помогут определить нужную величину.'],
    },
  },
  s9: {
    eyebrow: { uz: "Masofani hisoblash", ru: 'Вычисление расстояния' },
    title: { uz: "Ikki soatlik yo'l", ru: 'Путь за два часа' },
    question: { uz: "Masofani toping.", ru: 'Найди расстояние.' },
    feedbackAudio: {
      correct: { uz: "To'g'ri. Masofa sakson kilometr.", ru: 'Верно. Расстояние равно восьмидесяти километрам.' },
      wrong: { uz: "Masofani topish uchun tezlikni vaqtga ko'paytiring.", ru: 'Чтобы найти расстояние, умножь скорость на время.' },
    },
    audio: {
      uz: ["Transport ikki soat davomida soatiga qirq kilometr tezlikda yurdi.", "Masofani toping."],
      ru: ['Транспорт ехал два часа со скоростью сорок километров в час.', 'Найди расстояние.'],
    },
  },
  s10: {
    eyebrow: { uz: "Amalni tanlash", ru: 'Выбор действия' },
    title: { uz: "Tezlik uchun qaysi amal?", ru: 'Какое действие найдёт скорость?' },
    question: { uz: "Tezlikni topadigan yozuvni tanlang.", ru: 'Выбери запись для нахождения скорости.' },
    options: [{ uz: "230 : 2", ru: '230 : 2' }, { uz: "230 × 2", ru: '230 × 2' }, { uz: "230 − 2", ru: '230 − 2' }],
    feedback: [
      { uz: "To'g'ri. Bir soatdagi masofani topish uchun 230 ni 2 ga bo'lamiz.", ru: 'Верно. Чтобы найти путь за один час, делим 230 на 2.' },
      { uz: "Ko'paytirish ma'lum tezlikdan masofani topadi. Bu masalada tezlik noma'lum.", ru: 'Умножение находит расстояние по известной скорости. В этой задаче скорость неизвестна.' },
      { uz: "Vaqtni masofadan ayirish turli kattaliklarni aralashtiradi. Masofani vaqtga bo'lish kerak.", ru: 'Нельзя вычитать время из расстояния. Нужно разделить расстояние на время.' },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. Ikki yuz o'ttizni ikkiga bo'lib, bir yuz o'n besh topiladi.", ru: 'Верно. Двести тридцать делим на два и получаем сто пятнадцать.' },
      { uz: "Bu masalada tezlik noma'lum. Masofani vaqtga bo'ling.", ru: 'В этой задаче скорость неизвестна. Раздели расстояние на время.' },
      { uz: "Masofadan vaqtni ayirib bo'lmaydi. Masofani vaqtga bo'ling.", ru: 'Время нельзя вычитать из расстояния. Раздели расстояние на время.' },
    ],
    audio: {
      uz: ["Vertolyot ikki soatda ikki yuz o'ttiz kilometr uchdi.", "Tezlikni topadigan yozuvni tanlang."],
      ru: ['Вертолёт пролетел двести тридцать километров за два часа.', 'Выбери запись для нахождения скорости.'],
    },
  },
  s11: {
    eyebrow: { uz: "Vaqtni hisoblash", ru: 'Вычисление времени' },
    title: { uz: "300 kilometrga qancha vaqt?", ru: 'Сколько времени на 300 километров?' },
    question: { uz: "Harakat vaqtini toping.", ru: 'Найди время движения.' },
    feedbackAudio: {
      correct: { uz: "To'g'ri. Harakat vaqti besh soat.", ru: 'Верно. Время движения равно пяти часам.' },
      wrong: { uz: "Vaqtni topish uchun masofani tezlikka bo'ling.", ru: 'Чтобы найти время, раздели расстояние на скорость.' },
    },
    audio: {
      uz: ["Poyezd uch yuz kilometrni soatiga oltmish kilometr tezlikda yuradi.", "Harakat vaqtini toping."],
      ru: ['Поезд проходит триста километров со скоростью шестьдесят километров в час.', 'Найди время движения.'],
    },
  },
  s12: {
    eyebrow: { uz: "Bit xatosi", ru: 'Ошибка Бита' },
    title: { uz: "Noto'g'ri amalni tuzating", ru: 'Исправь неверное действие' },
    question: { uz: "Bir soatga to'g'ri keladigan masofani toping.", ru: 'Найди расстояние, приходящееся на один час.' },
    options: [{ uz: "12 : 3 = 4", ru: '12 : 3 = 4' }, { uz: "12 × 3 = 36", ru: '12 × 3 = 36' }, { uz: "12 − 3 = 9", ru: '12 − 3 = 9' }],
    feedback: [
      { uz: "To'g'ri. O'n ikki kilometrni uch soatga teng ajratsak, bir soatda to'rt kilometr yuriladi.", ru: 'Верно. Если разделить двенадцать километров на три часа, за один час получится четыре километра.' },
      { uz: "Bu Bitning xatosini takrorlaydi. Tezlik uchun masofani vaqtga ko'paytirmaymiz, bo'lamiz.", ru: 'Это повторяет ошибку Бита. Для скорости расстояние не умножаем на время, а делим.' },
      { uz: "Masofadan vaqtni ayirib bo'lmaydi. Ular turli kattaliklar.", ru: 'Нельзя вычитать время из расстояния. Это разные величины.' },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. O'n ikki kilometrni uch soatga bo'lsak, soatiga to'rt kilometr chiqadi.", ru: 'Верно. Двенадцать километров делим на три часа и получаем четыре километра в час.' },
      { uz: "Bu Bitning xatosini takrorlaydi. Tezlik uchun masofani vaqtga bo'ling.", ru: 'Это повторяет ошибку Бита. Для скорости раздели расстояние на время.' },
      { uz: "Masofadan vaqtni ayirib bo'lmaydi. Ular turli kattaliklar.", ru: 'Время нельзя вычитать из расстояния. Это разные величины.' },
    ],
    audio: {
      uz: ["Bit tezlikni topishda masofani vaqtga ko'paytirdi.", "Bir soatga to'g'ri keladigan masofani toping."],
      ru: ['Бит умножил расстояние на время, когда искал скорость.', 'Найди расстояние, приходящееся на один час.'],
    },
  },
  s13: {
    eyebrow: { uz: "Bir xil tezlik", ru: 'Одинаковая скорость' },
    title: { uz: "Ikki qismli yo'l", ru: 'Путь из двух частей' },
    question: { uz: "Har bir qismdagi masofani topadigan rejani tanlang.", ru: 'Выбери план вычисления расстояния на каждом участке.' },
    options: [
      { uz: "300 : (2 + 4) = 50; 50 × 2 = 100; 50 × 4 = 200", ru: '300 : (2 + 4) = 50; 50 × 2 = 100; 50 × 4 = 200' },
      { uz: "300 : 2 = 150; 300 : 4 = 75", ru: '300 : 2 = 150; 300 : 4 = 75' },
      { uz: "300 × (2 + 4) = 1 800", ru: '300 × (2 + 4) = 1 800' },
    ],
    feedback: [
      { uz: "To'g'ri. Jami olti soat orqali tezlik 50 km/soat, qismlar esa 100 va 200 kilometr bo'ladi.", ru: 'Верно. По общим шести часам скорость равна 50 км/ч, а участки равны 100 и 200 километрам.' },
      { uz: "Bu reja 300 kilometrni har bir qismning alohida jami deb oladi. Aslida 300 kilometr ikkala qismning umumiy masofasi.", ru: 'Этот план считает 300 километров отдельным итогом каждого участка. На самом деле это общий путь двух участков.' },
      { uz: "300 kilometr tezlik emas, umumiy masofa. Uni vaqtga ko'paytirish kerak emas.", ru: 'Триста километров это общий путь, а не скорость. Его не нужно умножать на время.' },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. Avval olti soat orqali tezlikni topamiz, so'ng ikki qism masofasini hisoblaymiz.", ru: 'Верно. Сначала по шести часам находим скорость, затем вычисляем расстояния двух участков.' },
      { uz: "Uch yuz kilometr ikkala qismning umumiy masofasi. Uni har bir qism uchun alohida olmang.", ru: 'Триста километров это общий путь двух участков. Не считай его отдельным путём каждого участка.' },
      { uz: "Uch yuz kilometr umumiy masofa, tezlik emas. Avval uni jami vaqtga bo'ling.", ru: 'Триста километров это общий путь, а не скорость. Сначала раздели его на общее время.' },
    ],
    audio: {
      uz: ["Avtomobil ikki soat, keyin yana to'rt soat bir xil tezlikda yurdi.", "Avval jami vaqt orqali tezlikni topish kerak.", "So'ng har bir qismdagi masofani hisoblaydigan rejani tanlang."],
      ru: ['Автомобиль ехал два часа, а затем ещё четыре часа с той же скоростью.', 'Сначала нужно найти скорость по общему времени.', 'Затем выбери план вычисления расстояния на каждом участке.'],
    },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' },
    title: { uz: "Masofa, tezlik va vaqt", ru: 'Расстояние, скорость и время' },
    audio: {
      uz: ["Masofa yo'l uzunligini, vaqt harakat davomiyligini, tezlik esa bir vaqt birligidagi masofani bildiradi.", "Tezlikni topish uchun masofani vaqtga bo'lamiz.", "Masofani topish uchun tezlikni vaqtga ko'paytiramiz.", "Vaqtni topish uchun masofani tezlikka bo'lamiz.", "Keyingi darsda teng sharoitda olingan bir nechta natijani bitta o'rtacha qiymat bilan ifodalashni o'rganamiz."],
      ru: ['Расстояние показывает длину пути, время показывает длительность движения, а скорость показывает путь за единицу времени.', 'Чтобы найти скорость, расстояние делим на время.', 'Чтобы найти расстояние, скорость умножаем на время.', 'Чтобы найти время, расстояние делим на скорость.', 'На следующем уроке научимся выражать несколько результатов одним средним значением.'],
    },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.ru ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* preview speech is optional */ }
    }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = 900) {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration);
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => {
            this.timer = null;
            try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); }
          }, 50);
          return;
        } catch { /* use the deterministic visual timer */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  pushOneOff(text) { this.load([{ id: `feedback-${Date.now()}`, text }]); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- audio queue stabilizer */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarration(value, screen) {
  const lang = useLang();
  const reducedMotion = useReducedMotion();
  const segments = useMemo(() => {
    const texts = value?.[lang] ?? value?.ru ?? [];
    const expected = FRAME_COUNTS[screen];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).slice(0, expected).map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const feedbackPlaying = String(audio.currentSegment || '').startsWith('feedback-');
  const naturalBeat = active >= 0 ? active : ((audio.completed || feedbackPlaying) ? Math.max(0, segments.length - 1) : 0);
  return { ...audio, beat: reducedMotion ? Math.max(0, segments.length - 1) : naturalBeat, caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

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
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
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
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
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

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'uz' ? "Ovozni yoqish" : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук');
  const replayLabel = lang === 'uz' ? "Qayta eshitish" : 'Повторить';
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

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'uz' ? "Missiya" : 'Миссия',
    diagnostic: lang === 'uz' ? "Diagnostika" : 'Диагностика',
    exploration: lang === 'uz' ? "Kashfiyot" : 'Исследование',
    rule: lang === 'uz' ? "Qoida" : 'Правило',
    practice: lang === 'uz' ? "Mashq" : 'Практика',
    test: lang === 'uz' ? "Tekshiruv" : 'Проверка',
    case: lang === 'uz' ? "Vazifa" : 'Задача',
    summary: lang === 'uz' ? "Yakun" : 'Итог',
    comparison: lang === 'uz' ? "Kashfiyot" : 'Исследование',
    synthesis: lang === 'uz' ? "Kashfiyot" : 'Исследование',
    'guided-example': lang === 'uz' ? "Kashfiyot" : 'Исследование',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const Feedback = ({ show, correct, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    const timer = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 180);
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); window.clearTimeout(timer); };
  }, [show]);
  if (!show) return null;
  return <div ref={ref} role="status" className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><b>{correct ? '✓' : '↻'}</b><p>{children}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const ref = useRef(null); const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  useEffect(() => { ref.current?.scrollTo({ top: 0, behavior: 'auto' }); }, [screen]);
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" ref={ref} style={{ paddingLeft: pad, paddingRight: pad }}>{children}{audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span /> : <button type="button" className="btn ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' })}</button>}<button type="button" className="btn next" onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' }) : t({ uz: "Davom etish", ru: 'Продолжить' })} →</button></footer></main>;
};

const Heading = ({ c, bit = null }) => {
  const t = useT();
  return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{bit && <BitSVG state={bit} />}</div>;
};

const Options = ({ values, picked, onPick, correctIndex = null, solved = false, wrong = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${solved && index === correctIndex ? 'right' : ''} ${wrong && picked === index ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={disabled}><b>{String.fromCharCode(65 + index)}</b>{t(value)}</button>)}</div>;
};

const Reveal = ({ show, children, className = '' }) => <div className={`reveal-item ${show ? 'show' : ''} ${className}`}>{children}</div>;

const FixedTrack = ({ distance, chunks = 3, progress = 1, labels = [] }) => {
  const safeProgress = Math.max(0, Math.min(1, progress));
  const start = 54; const end = 666; const width = end - start;
  const ticks = Array.from({ length: chunks + 1 }, (_, index) => start + width * index / chunks);
  return (
    <svg className="route-svg" viewBox="0 0 720 168" aria-hidden="true" focusable="false">
      <rect className="route-panel" x="2" y="2" width="716" height="164" rx="24" />
      <path className="route-road" d={`M${start} 104H${end}`} />
      <path className="route-trail" d={`M${start} 104H${start + width * safeProgress}`} />
      {ticks.map((x, index) => <g className="route-tick" key={x}><path d={`M${x} 89V119`} /><circle cx={x} cy="104" r="6" /><text x={x} y="139" textAnchor="middle">{labels[index] ?? index}</text></g>)}
      <g className="route-marker" style={{ transform: `translateX(${width * safeProgress}px)` }}><circle cx={start} cy="73" r="18" /><path d={`M${start - 8} 73h16m-5-5 5 5-5 5`} /><path d={`M${start} 91V98`} /></g>
      <text className="route-distance" x="360" y="35" textAnchor="middle">{distance}</text>
    </svg>
  );
};

const FormulaRow = ({ label, formula, active, tone = 'cyan' }) => (
  <div className={`formula-row ${tone} ${active ? 'active' : ''}`}><span>{label}</span><strong>{formula}</strong></div>
);

const cleanNumber = (value) => String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 8);

function Screen0({ screen, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null);
  const pick = (index) => {
    setPicked(index);
    audio.pushOneOff(t(c.feedbackAudio));
    onAnswer({ screenIdx: screen, stage: 'hook', question: t(c.question), options: c.options.map(t), correctIndex: 0, correctAnswer: t(c.options[0]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: index === 0, firstTry: index === 0, attempts: 1, solved: true });
  };
  const progress = audio.beat === 0 ? 0 : audio.beat === 1 ? 0.66 : 1;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="think" /><section className="motion-card hook-motion"><FixedTrack distance="180 km" chunks={3} progress={progress} labels={['0', '1', '2', '3']} /><div className="hook-facts"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Masofa", ru: 'Расстояние' })}</span><b>180 km</b></Reveal><Reveal show={audio.beat >= 1}><span>{t({ uz: "Vaqt", ru: 'Время' })}</span><b>3 {t({ uz: "soat", ru: 'часа' })}</b></Reveal><Reveal show={audio.beat >= 2}><span>{t({ uz: "Tezlik", ru: 'Скорость' })}</span><b>?</b></Reveal></div></section><section className={`question frame-question ${audio.beat >= 2 ? 'ready' : ''}`}><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} /><Feedback show={picked !== null} correct>{t(c.feedback)}</Feedback></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const progress = (audio.beat + 1) / 4;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="motion-card"><FixedTrack distance="48 km" chunks={4} progress={progress} labels={['0', '1', '2', '3', '4']} /><div className="three-values"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Masofa", ru: 'Расстояние' })}</span><b>48 km</b></Reveal><Reveal show={audio.beat >= 1}><span>{t({ uz: "Vaqt", ru: 'Время' })}</span><b>4 {t({ uz: "soat", ru: 'часа' })}</b></Reveal><Reveal show={audio.beat >= 3} className="speed-value"><span>{t({ uz: "Tezlik", ru: 'Скорость' })}</span><b>12 km/soat</b></Reveal></div><Reveal show={audio.beat >= 2} className="equal-note">48 km : 4 = 12 km/soat</Reveal></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s2; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="focus" /><section className="rule-board"><div className="known-strip"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Ma'lum", ru: 'Известно' })}</span><b>48 km</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Ma'lum", ru: 'Известно' })}</span><b>4 {t({ uz: "soat", ru: 'часа' })}</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Noma'lum", ru: 'Неизвестно' })}</span><b>?</b></Reveal></div><FixedTrack distance="48 km" chunks={4} progress={audio.beat >= 2 ? 1 : 0.25} labels={['0', '1', '2', '3', '4']} /><Reveal show={audio.beat >= 1} className="operation-line">48 km : 4 soat</Reveal><Reveal show={audio.beat >= 2} className="answer-chip">12 km/soat</Reveal><FormulaRow active={audio.beat >= 3} label={t({ uz: "Tezlik", ru: 'Скорость' })} formula={t({ uz: "masofa : vaqt", ru: 'расстояние : время' })} /></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const progress = Math.min(1, (audio.beat + 1) / 3);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="rule-board"><FixedTrack distance="12 km" chunks={3} progress={progress} labels={['0', '1', '2', '3']} /><div className="segment-cards">{[1, 2, 3].map((hour, index) => <Reveal show={audio.beat >= index} key={hour}><span>{hour} {t({ uz: "soat", ru: hour === 1 ? 'час' : 'часа' })}</span><b>{hour * 4} km</b></Reveal>)}</div><Reveal show={audio.beat >= 2} className="operation-line">4 km/soat × 3 soat = 12 km</Reveal><FormulaRow active={audio.beat >= 3} label={t({ uz: "Masofa", ru: 'Расстояние' })} formula={t({ uz: "tezlik × vaqt", ru: 'скорость × время' })} tone="orange" /></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const cards = [
    { icon: '↔', name: { uz: "Masofa", ru: 'Расстояние' }, unit: 'km' },
    { icon: '◷', name: { uz: "Vaqt", ru: 'Время' }, unit: t({ uz: "soat", ru: 'час' }) },
    { icon: '➜', name: { uz: "Tezlik", ru: 'Скорость' }, unit: 'km/soat' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="unit-grid">{cards.map((card, index) => <Reveal show={audio.beat >= index} key={card.unit}><i>{card.icon}</i><span>{t(card.name)}</span><b>{card.unit}</b><small>{index === 0 ? t({ uz: "yo'l uzunligi", ru: 'длина пути' }) : index === 1 ? t({ uz: "harakat davomiyligi", ru: 'длительность движения' }) : t({ uz: "bir soatdagi masofa", ru: 'путь за один час' })}</small></Reveal>)}</section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const progress = audio.beat < 2 ? 0.5 : 1;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="rule-board"><div className="known-strip"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Masofa", ru: 'Расстояние' })}</span><b>90 km</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Tezlik", ru: 'Скорость' })}</span><b>45 km/soat</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Vaqt", ru: 'Время' })}</span><b>?</b></Reveal></div><FixedTrack distance="90 km" chunks={2} progress={progress} labels={['0', '1', '2']} /><Reveal show={audio.beat >= 1} className="chunk-note">1 {t({ uz: "soat", ru: 'час' })} → 45 km</Reveal><Reveal show={audio.beat >= 2} className="answer-chip">2 {t({ uz: "soat", ru: 'часа' })}</Reveal><FormulaRow active={audio.beat >= 3} label={t({ uz: "Vaqt", ru: 'Время' })} formula={t({ uz: "masofa : tezlik", ru: 'расстояние : скорость' })} /></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const rows = [
    { label: { uz: "Tezlik", ru: 'Скорость' }, formula: { uz: "masofa : vaqt", ru: 'расстояние : время' } },
    { label: { uz: "Masofa", ru: 'Расстояние' }, formula: { uz: "tezlik × vaqt", ru: 'скорость × время' } },
    { label: { uz: "Vaqt", ru: 'Время' }, formula: { uz: "masofa : tezlik", ru: 'расстояние : скорость' } },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="focus" /><section className="formula-board">{rows.map((row, index) => <FormulaRow key={t(row.label)} label={t(row.label)} formula={t(row.formula)} active={audio.beat >= index} tone={index === 1 ? 'orange' : 'cyan'} />)}<Reveal show={audio.beat >= 3} className="decision-card"><b>1</b><span>{t({ uz: "Noma'lum kattalikni aniqlang", ru: 'Определи неизвестную величину' })}</span><i>→</i><b>2</b><span>{t({ uz: "Mos amalni tanlang", ru: 'Выбери подходящее действие' })}</span></Reveal></section></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const flow = [
    { label: { uz: "Ma'lumlar", ru: 'Данные' }, value: '240 km · 60 km/soat' },
    { label: { uz: "Noma'lum", ru: 'Неизвестно' }, value: t({ uz: "vaqt", ru: 'время' }) },
    { label: { uz: "Amal", ru: 'Действие' }, value: '240 : 60' },
    { label: { uz: "Natija", ru: 'Результат' }, value: `4 ${t({ uz: "soat", ru: 'часа' })}` },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="flow-board">{flow.map((item, index) => <React.Fragment key={t(item.label)}><Reveal show={audio.beat >= index} className={index === 3 ? 'flow-result' : ''}><span>{t(item.label)}</span><b>{item.value}</b></Reveal>{index < flow.length - 1 && <i className={audio.beat > index ? 'show' : ''}>→</i>}</React.Fragment>)}</section><Reveal show={audio.beat >= 3} className="unit-reminder">{t({ uz: "Javob noma'lum kattalik birligi bilan yozildi.", ru: 'Ответ записан с единицей неизвестной величины.' })}</Reveal></div></Stage>;
}

function Screen8({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s8; const audio = useNarration(c.audio, screen); const correct = [0, 1, 2];
  const [picks, setPicks] = useState(storedAnswer?.correct ? correct : [null, null, null]);
  const [wrongRow, setWrongRow] = useState(null); const [message, setMessage] = useState(null);
  const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = picks.every((value, index) => value === correct[index]);
  const pick = (row, option) => {
    if (solved || picks[row] !== null) return;
    attempts.current += 1;
    if (option !== correct[row]) {
      clean.current = false; setWrongRow(row);
      const text = row === 0 ? { uz: "Kilometr va soat berilgan. Ularning nisbatidan tezlik topiladi.", ru: 'Даны километры и часы. Их отношение даёт скорость.' } : row === 1 ? { uz: "Tezlik va vaqt berilgan. Ularning ko'paytmasidan masofa topiladi.", ru: 'Даны скорость и время. Их произведение даёт расстояние.' } : { uz: "Masofa va tezlik berilgan. Ularning nisbatidan vaqt topiladi.", ru: 'Даны расстояние и скорость. Их отношение даёт время.' };
      setMessage(text); playSfx('wrong'); audio.pushOneOff(t(c.feedbackAudio.wrong[row]));
      onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.labels.map(t), correctIndex: null, correctAnswer: c.labels.map(t).join('|'), studentAnswerIndex: null, studentAnswer: `${row}:${option}`, correct: false, firstTry: false, attempts: attempts.current, solved: false });
      return;
    }
    const next = [...picks]; next[row] = option; setPicks(next); setWrongRow(null);
    const done = next.every((value, index) => value === correct[index]);
    const text = done ? { uz: "To'g'ri. Birliklar tezlik, masofa va vaqtni ajratishga yordam berdi.", ru: 'Верно. Единицы помогли различить скорость, расстояние и время.' } : { uz: "Bu juftlik to'g'ri. Qolgan vaziyatni ham tekshiring.", ru: 'Эта пара верна. Проверьте следующую ситуацию.' };
    setMessage(text);
    if (done) { playSfx('correct'); audio.pushOneOff(t(c.feedbackAudio.correct)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.labels.map(t), correctIndex: null, correctAnswer: c.labels.map(t).join('|'), studentAnswerIndex: null, studentAnswer: next.map((value) => t(c.labels[value])).join('|'), correct: true, firstTry: clean.current && attempts.current === 3, attempts: attempts.current, solved: true }); }
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className={`match-board ${audio.beat >= 1 ? 'units-on' : ''}`}>{c.situations.map((situation, row) => <div className={wrongRow === row ? 'match-row wrong-row' : 'match-row'} key={t(situation)}><strong>{t(situation)}</strong><div>{c.labels.map((label, option) => <button type="button" key={t(label)} className={picks[row] === option ? 'matched' : ''} onClick={() => pick(row, option)} disabled={picks[row] !== null || solved}>{t(label)}</button>)}</div></div>)}</section><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></div></Stage>;
}

function NumericPractice({ screen, c, correctAnswer, unit, storedAnswer, onAnswer, onNext, onPrev, visual, getWrong }) {
  const t = useT(); const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => {
    const answer = cleanNumber(value); if (!answer || solved) return;
    attempts.current += 1; const ok = answer === correctAnswer; if (!ok) clean.current = false; setSolved(ok);
    const text = ok ? { uz: `To'g'ri. Javob ${correctAnswer} ${unit.uz}.`, ru: `Верно. Ответ ${correctAnswer} ${unit.ru}.` } : getWrong(answer);
    setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.feedbackAudio.correct : c.feedbackAudio.wrong));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: null, correctIndex: null, correctAnswer: `${correctAnswer} ${t(unit)}`, studentAnswerIndex: null, studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} />{visual}<section className={`question frame-question ${audio.beat >= 1 ? 'ready' : ''}`}><h2>{t(c.question)}</h2><div className="input-row"><div className="input-with-unit"><input className={solved ? 'answer correct-input' : message ? 'answer wrong-input' : 'answer'} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(cleanNumber(event.target.value)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()} /><span>{t(unit)}</span></div><button type="button" className="btn next check" onClick={submit} disabled={!value || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' })}</button></div><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></section></div></Stage>;
}

function ChoicePractice({ screen, c, correctIndex, storedAnswer, onAnswer, onNext, onPrev, visual, middle = null, optionBeat = 1, proof, bit = null }) {
  const t = useT(); const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved) return;
    attempts.current += 1; const ok = index === correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index]));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex, correctAnswer: t(c.options[correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={bit ? (solved ? 'nod' : bit) : null} />{visual}{middle && <Reveal show={audio.beat >= 1}>{middle}</Reveal>}<section className={`question frame-question ${audio.beat >= optionBeat ? 'ready' : ''}`}><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={correctIndex} solved={solved} wrong={picked !== null && !solved} disabled={solved} /><Feedback show={picked !== null} correct={solved}>{picked !== null ? t(c.feedback[picked]) : ''}</Feedback>{solved && proof}</section></div></Stage>;
}

function Screen9(props) {
  const t = useT(); const c = CONTENT.s9;
  return <NumericPractice {...props} c={c} correctAnswer="80" unit={{ uz: "km", ru: 'км' }} visual={<section className="practice-visual"><div><span>40 km/soat</span><b>×</b><span>2 {t({ uz: "soat", ru: 'часа' })}</span></div><FixedTrack distance="? km" chunks={2} progress={1} labels={['0', '1', '2']} /></section>} getWrong={(answer) => answer === '40' ? { uz: "40 faqat bir soatdagi masofa. Ikki soat uchun uni ikkiga ko'paytiring.", ru: 'Сорок это путь только за один час. Для двух часов умножьте его на два.' } : { uz: "Masofa noma'lum. Tezlikni vaqtga ko'paytiring.", ru: 'Неизвестно расстояние. Умножьте скорость на время.' }} />;
}

function Screen10(props) {
  const t = useT(); const c = CONTENT.s10;
  return <ChoicePractice {...props} c={c} correctIndex={0} visual={<section className="practice-visual compact"><div><span>230 km</span><b>:</b><span>2 {t({ uz: "soat", ru: 'часа' })}</span></div><div className="unknown-badge">? km/soat</div></section>} proof={<div className="proof-grid"><span>230 : 2</span><b>115 km/soat</b></div>} />;
}

function Screen11(props) {
  const c = CONTENT.s11;
  return <NumericPractice {...props} c={c} correctAnswer="5" unit={{ uz: "soat", ru: 'часов' }} visual={<section className="practice-visual"><div><span>300 km</span><b>:</b><span>60 km/soat</span></div><FixedTrack distance="300 km" chunks={5} progress={1} labels={['0', '1', '2', '3', '4', '5']} /></section>} getWrong={() => ({ uz: "Vaqt noma'lum. Uch yuz kilometrni soatiga oltmish kilometrga bo'ling.", ru: 'Неизвестно время. Разделите триста километров на шестьдесят километров в час.' })} />;
}

function Screen12(props) {
  const c = CONTENT.s12;
  return <ChoicePractice {...props} c={c} correctIndex={0} bit="awkward" visual={<section className="error-board"><div><span>12 km</span><span>3 soat</span></div><strong>12 × 3 = 36 km/soat</strong><i>?</i></section>} proof={<div className="proof-grid"><span>12 km : 3 soat</span><b>4 km/soat</b></div>} />;
}

function Screen13(props) {
  const t = useT(); const c = CONTENT.s13;
  return <ChoicePractice {...props} c={c} correctIndex={0} optionBeat={2} visual={<section className="two-part-route"><div className="part small"><span>2 {t({ uz: "soat", ru: 'часа' })}</span></div><div className="part large"><span>4 {t({ uz: "soat", ru: 'часа' })}</span></div><strong>300 km</strong></section>} middle={<div className="total-time">2 + 4 = <b>6 {t({ uz: "soat", ru: 'часов' })}</b></div>} proof={<div className="proof-grid"><span>2 + 4 = 6 soat</span><span>300 : 6 = 50 km/soat</span><b>100 km + 200 km = 300 km</b></div>} />;
}

const FINAL_AWARDS = [
  { ru: 'Архитектор движения', uz: "Harakat me'mori" },
  { ru: 'Мастер скорости и пути', uz: 'Tezlik va masofa ustasi' },
  { ru: 'Исследователь движения', uz: 'Harakat tadqiqotchisi' },
];

const FinaleReward = ({ answers = [], complete }) => {
  const t = useT();
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const total = scored.length;
  const answered = scored.filter((index) => Boolean(answers[index])).length;
  const solvedCount = scored.filter((index) => answers[index]?.correct === true).length;
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  const award = firstTry === total ? FINAL_AWARDS[0] : firstTry >= Math.max(1, total - 1) ? FINAL_AWARDS[1] : FINAL_AWARDS[2];
  const rewardReady = complete && solvedCount === total;
  return <aside className={`finale-reward ${rewardReady ? 'complete' : ''}`} role="status" aria-live="polite" aria-atomic="true">
    {rewardReady && <div className="finale-confetti" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
    <div className="finale-medal" aria-hidden="true">{rewardReady ? '★' : '🔒'}</div>
    <div className="finale-reward-copy"><small>{t(rewardReady ? { uz: "UNVON OLINDI", ru: 'ЗВАНИЕ ПОЛУЧЕНО' } : { uz: "UNVON YOPIQ", ru: 'ЗВАНИЕ ЗАКРЫТО' })}</small><strong>{rewardReady ? t(award) : t({ uz: "Unvonni oching", ru: 'Открой звание' })}</strong><div className="finale-status"><b>{rewardReady ? `${firstTry}/${total}` : `${solvedCount}/${total}`}</b><span>{t(rewardReady ? { uz: `birinchi urinish · ${answered}/${total} mashq bajarildi`, ru: `с первой попытки · ${answered}/${total} заданий выполнено` } : { uz: "mashq yechildi", ru: 'заданий решено' })}</span></div></div>
    <div className="finale-reward-bit"><BitSVG state={rewardReady ? 'happy' : 'present'} /></div>
  </aside>;
};

function Screen14({ screen, answers, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const frame = audio.beat; const complete = frame >= 4; const rules = [
    { label: { uz: "Uch kattalik", ru: 'Три величины' }, text: { uz: "Masofa, vaqt va tezlik", ru: 'Расстояние, время и скорость' } },
    { label: { uz: "Tezlik", ru: 'Скорость' }, text: { uz: "masofa : vaqt", ru: 'расстояние : время' } },
    { label: { uz: "Masofa", ru: 'Расстояние' }, text: { uz: "tezlik × vaqt", ru: 'скорость × время' } },
    { label: { uz: "Vaqt", ru: 'Время' }, text: { uz: "masofa : tezlik", ru: 'расстояние : скорость' } },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' })}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Boshlang'ich yo'lni tezlik javobi bilan yopib, uchta bog'lanishni jamlaymiz.", ru: 'Закрываем стартовый маршрут ответом о скорости и собираем три связи.' })}</p></section><section className="finale-main"><div className="finale-payoff finale-track"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ' })}</small><FixedTrack distance={t({ uz: "180 km", ru: '180 км' })} chunks={3} progress={complete ? 1 : Math.min(1, (frame + 1) / 3)} labels={['0', '1', '2', '3']} /><div className={`finale-hook-answer ${complete ? 'show' : ''}`}>{t({ uz: "180 km : 3 soat =", ru: '180 км : 3 ч =' })} <b>{t({ uz: "60 km/soat", ru: '60 км/ч' })}</b></div></div><div className="finale-takeaways">{rules.map((rule, index) => <div className={`finale-takeaway ${frame >= index ? 'show' : ''}`} key={t(rule.label)}><b>{index + 1}</b><span><small>{t(rule.label)}</small>{t(rule.text)}</span></div>)}</div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' })}</small><strong>{t({ uz: "Bir nechta natijaning o'rtacha qiymati", ru: 'Среднее значение нескольких результатов' })}</strong></div><FinaleReward answers={answers} complete={complete} /></section></div></Stage>;
}

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars14({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState(langProp || 'uz');
  const lang = preview ? previewLang : (langProp || 'uz');
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now()); const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }), []);
  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null);
    const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
    const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) };
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars14 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>{preview && <div className="preview-language" aria-label="Preview language">{['ru', 'uz'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson} /></div></LangContext.Provider>;
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
  margin: 0;
  overflow: hidden !important;
  overscroll-behavior: none;
}
.lesson-root,
.lesson-root * { box-sizing: border-box; }
.lesson-root h1,
.lesson-root h2,
.lesson-root p { margin: 0; }
.lesson-root button,
.lesson-root input { font: inherit; }
.lesson-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
  color: ${T.ink};
  background:
    radial-gradient(circle at 7% 9%, rgba(22,143,163,.11), transparent 29%),
    radial-gradient(circle at 94% 89%, rgba(255,91,53,.09), transparent 31%),
    ${T.bg};
  font-family: Manrope, Arial, sans-serif;
}
.stage {
  width: min(936px, 100%);
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  z-index: 5;
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
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.chrome-title,
.chrome-actions,
.audio-controls { display: flex; align-items: center; }
.stage-chrome {
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title,
.chrome-actions,
.audio-controls { gap: 9px; }
.chrome-title {
  min-width: 0;
  overflow: hidden;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chrome-actions { flex: none; }
.status-dot {
  width: 8px;
  height: 8px;
  flex: none;
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
  min-height: 0;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 18px;
  padding-bottom: 24px;
  scroll-padding-block: 12px;
  scrollbar-color: rgba(22,143,163,.25) transparent;
}
.stage-nav {
  min-height: 72px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 12px;
  z-index: 5;
  border-top: 1px solid rgba(23,59,82,.08);
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(12px);
}
.btn {
  min-width: 124px;
  min-height: 50px;
  padding: 0 18px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink2};
  background: transparent;
  font: 850 13px/1 Manrope, sans-serif;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, color .2s ease, opacity .2s ease;
}
.btn.next {
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 13px 28px -18px rgba(255,91,53,.60);
}
.btn:hover:not(:disabled),
.icon-btn:hover:not(:disabled) { transform: translateY(-2px); }
.btn.next:hover:not(:disabled) { color: white; background: ${T.accent}; }
.btn.ghost:hover:not(:disabled) { background: ${T.paper}; }
.btn:disabled,
button:disabled { cursor: default; opacity: .55; }
.lesson-root button:focus-visible,
.lesson-root input:focus-visible { outline: 3px solid rgba(22,143,163,.38); outline-offset: 3px; }
.stack { display: grid; gap: 14px; animation: pageEnter .5s cubic-bezier(.16,1,.3,1) both; }
.heading {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.heading > div { min-width: 0; }
.heading span,
.bridge > span {
  display: block;
  margin-bottom: 7px;
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.heading h1 {
  max-width: 770px;
  font: 750 clamp(27px,4vw,41px)/1.05 'Source Serif 4', Georgia, serif;
  letter-spacing: -.025em;
}
.heading .g1-char { width: 90px; height: 112px; flex: none; }
.question,
.motion-card,
.rule-board,
.unit-grid,
.formula-board,
.flow-board,
.match-board,
.practice-visual,
.error-board,
.two-part-route,
.summary-motion,
.summary-rules {
  padding: 17px 19px;
  border-radius: 22px;
  background: ${T.paper};
  box-shadow: 0 18px 42px -31px rgba(${T.shadowBase},.56);
}
.question h2 { font: 750 clamp(18px,2.6vw,25px)/1.28 'Source Serif 4', Georgia, serif; }
.frame-question { opacity: .42; transform: translateY(7px); pointer-events: none; transition: .4s ease; }
.frame-question.ready { opacity: 1; transform: none; pointer-events: auto; }
.options {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
  margin-top: 14px;
}
.option {
  min-height: 56px;
  padding: 10px 13px;
  border: 0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: #F8F8F4;
  text-align: left;
  font: 750 13px/1.35 Manrope, sans-serif;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.17), 0 8px 17px -14px rgba(${T.shadowBase},.35);
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.option:hover:not(:disabled),
.option.picked { transform: translateY(-2px); background: ${T.accentSoft}; }
.option > b {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.paper};
  font: 900 12px/1 'JetBrains Mono', monospace;
}
.option.right { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28); }
.option.right > b { color: white; background: ${T.success}; }
.option.bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.25); }
.feedback {
  max-height: 0;
  margin-top: 0;
  padding: 0 14px;
  overflow: hidden;
  opacity: 0;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 9px;
  transform: translateY(8px);
  transition: max-height .38s ease, padding .34s ease, margin .34s ease, opacity .28s ease, transform .34s ease;
}
.feedback.open { max-height: 190px; margin-top: 12px; padding: 11px 14px; opacity: 1; transform: none; }
.feedback > b { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; background: rgba(255,255,255,.72); font-weight: 950; }
.feedback p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback.correct { background: ${T.successSoft}; box-shadow: inset 4px 0 ${T.success}; }
.feedback.correct > b { color: ${T.success}; }
.feedback.wrong { background: ${T.warnSoft}; box-shadow: inset 4px 0 ${T.warn}; }
.feedback.wrong > b { color: ${T.warn}; }
.caption {
  position: sticky;
  bottom: 4px;
  z-index: 4;
  width: fit-content;
  max-width: min(680px,100%);
  margin: 13px auto 0;
  padding: 9px 13px;
  border-radius: 12px;
  color: white;
  background: rgba(23,59,82,.94);
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  box-shadow: 0 12px 28px -18px rgba(23,59,82,.8);
}
.reveal-item { opacity: .12; transform: translateY(8px); transition: opacity .48s ease, transform .48s cubic-bezier(.16,1,.3,1); }
.reveal-item.show { opacity: 1; transform: none; }
.motion-card,
.rule-board,
.formula-board { display: grid; gap: 13px; }
.route-svg { width: 100%; height: auto; display: block; overflow: visible; }
.route-panel { fill: #F8FBF9; stroke: rgba(22,143,163,.18); stroke-width: 2; }
.route-road { fill: none; stroke: rgba(23,59,82,.16); stroke-width: 13; stroke-linecap: round; }
.route-trail { fill: none; stroke: ${T.cyan}; stroke-width: 13; stroke-linecap: round; transition: d .52s cubic-bezier(.16,1,.3,1); }
.route-tick path { stroke: rgba(23,59,82,.27); stroke-width: 2; }
.route-tick circle { fill: white; stroke: ${T.cyan}; stroke-width: 3; }
.route-tick text { fill: ${T.ink2}; font: 850 12px/1 'JetBrains Mono', monospace; }
.route-marker { transform-box: fill-box; transform-origin: left center; transition: transform .52s cubic-bezier(.16,1,.3,1); }
.route-marker circle { fill: ${T.accent}; filter: drop-shadow(0 5px 7px rgba(255,91,53,.32)); }
.route-marker path { fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.route-distance { fill: ${T.navy}; font: 900 18px/1 'JetBrains Mono', monospace; }
.hook-facts,
.three-values,
.known-strip,
.segment-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
.hook-facts > div,
.three-values > div,
.known-strip > div,
.segment-cards > div {
  min-height: 70px;
  padding: 11px;
  border-radius: 15px;
  display: grid;
  align-content: center;
  gap: 6px;
  color: ${T.ink2};
  background: #F8F8F4;
  text-align: center;
}
.hook-facts span,
.three-values span,
.known-strip span,
.segment-cards span { color: ${T.ink3}; font-size: 10px; font-weight: 850; text-transform: uppercase; }
.hook-facts b,
.three-values b,
.known-strip b,
.segment-cards b { color: ${T.navy}; font: 900 16px/1.2 'JetBrains Mono', monospace; }
.speed-value { background: ${T.successSoft} !important; }
.speed-value b { color: ${T.success}; }
.equal-note,
.operation-line,
.chunk-note,
.unit-reminder,
.hook-answer {
  padding: 11px 14px;
  border-radius: 14px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  text-align: center;
  font: 850 15px/1.3 'JetBrains Mono', monospace;
}
.operation-line { color: ${T.accent}; background: ${T.accentSoft}; }
.answer-chip,
.unknown-badge {
  width: fit-content;
  justify-self: center;
  padding: 10px 18px;
  border-radius: 999px;
  color: white;
  background: ${T.success};
  font: 900 17px/1 'JetBrains Mono', monospace;
  box-shadow: 0 10px 22px -16px rgba(34,122,83,.8);
}
.formula-row {
  min-height: 70px;
  padding: 12px 16px;
  border-radius: 17px;
  display: grid;
  grid-template-columns: minmax(100px,.42fr) 1fr;
  align-items: center;
  gap: 14px;
  opacity: .16;
  background: #F8F8F4;
  transform: translateY(7px);
  transition: .48s cubic-bezier(.16,1,.3,1);
}
.formula-row.active { opacity: 1; transform: none; }
.formula-row span { color: ${T.ink2}; font-size: 12px; font-weight: 900; text-transform: uppercase; }
.formula-row strong { color: ${T.cyan}; font: 900 clamp(16px,2.7vw,23px)/1.2 'JetBrains Mono', monospace; }
.formula-row.orange strong { color: ${T.accent}; }
.unit-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.unit-grid > div { min-height: 190px; padding: 16px; border-radius: 18px; display: grid; align-content: center; justify-items: center; gap: 9px; background: #F8F8F4; text-align: center; }
.unit-grid i { width: 46px; height: 46px; border-radius: 15px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: normal 900 22px/1 Manrope, sans-serif; }
.unit-grid span { color: ${T.ink2}; font-size: 12px; font-weight: 850; }
.unit-grid b { color: ${T.navy}; font: 900 22px/1 'JetBrains Mono', monospace; }
.unit-grid small { color: ${T.ink3}; font-size: 11px; line-height: 1.35; }
.decision-card { min-height: 72px; padding: 12px; border-radius: 16px; display: grid; grid-template-columns: 34px 1fr 24px 34px 1fr; align-items: center; gap: 9px; color: ${T.ink2}; background: ${T.cyanSoft}; font-size: 12px; font-weight: 800; }
.decision-card b { width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; color: white; background: ${T.cyan}; font: 900 12px/1 'JetBrains Mono', monospace; }
.decision-card i { color: ${T.accent}; font-style: normal; font-weight: 950; }
.flow-board { min-height: 180px; display: grid; grid-template-columns: repeat(7,auto); align-items: stretch; gap: 8px; }
.flow-board > div { min-width: 0; padding: 13px 10px; border-radius: 15px; display: grid; align-content: center; gap: 7px; background: #F8F8F4; text-align: center; }
.flow-board > div span { color: ${T.ink3}; font-size: 9px; font-weight: 900; text-transform: uppercase; }
.flow-board > div b { color: ${T.navy}; font: 850 13px/1.35 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
.flow-board > div.flow-result { background: ${T.successSoft}; }
.flow-board > div.flow-result b { color: ${T.success}; }
.flow-board > i { align-self: center; opacity: .15; color: ${T.accent}; font-style: normal; font-weight: 950; transition: opacity .35s ease; }
.flow-board > i.show { opacity: 1; }
.match-board { display: grid; gap: 10px; }
.match-row { padding: 11px; border-radius: 16px; display: grid; grid-template-columns: minmax(180px,.8fr) 1fr; align-items: center; gap: 12px; background: #F8F8F4; transition: .25s ease; }
.match-row strong { color: ${T.navy}; font: 850 14px/1.3 'JetBrains Mono', monospace; }
.match-row > div { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
.match-row button { min-height: 44px; padding: 7px; border: 0; border-radius: 12px; color: ${T.ink2}; background: white; cursor: pointer; font-size: 11px; font-weight: 850; box-shadow: 0 8px 18px -16px rgba(${T.shadowBase},.55); }
.match-row button:hover:not(:disabled) { color: ${T.accent}; transform: translateY(-1px); }
.match-row button.matched { color: white; background: ${T.success}; opacity: 1; }
.match-row.wrong-row { background: ${T.warnSoft}; box-shadow: inset 4px 0 ${T.warn}; }
.match-board:not(.units-on) .match-row button { opacity: .55; }
.practice-visual { display: grid; gap: 10px; }
.practice-visual > div:first-child { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
.practice-visual > div:first-child span { padding: 12px 15px; border-radius: 14px; color: ${T.navy}; background: #F8F8F4; font: 900 17px/1 'JetBrains Mono', monospace; }
.practice-visual > div:first-child b { color: ${T.accent}; font: 900 24px/1 'JetBrains Mono', monospace; }
.practice-visual.compact { min-height: 130px; grid-template-columns: 1fr auto; align-items: center; }
.input-row { margin-top: 15px; display: flex; align-items: stretch; justify-content: flex-end; gap: 10px; }
.input-with-unit { min-width: 0; flex: 1; position: relative; }
.answer {
  width: 100%;
  min-height: 54px;
  padding: 10px 80px 10px 16px;
  border: 0;
  border-radius: 15px;
  outline: 0;
  color: ${T.navy};
  background: #F8F8F4;
  font: 900 20px/1 'JetBrains Mono', monospace;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.24), 0 8px 18px -16px rgba(${T.shadowBase},.42);
}
.answer:focus { box-shadow: inset 0 0 0 2px ${T.cyan}, 0 0 0 4px rgba(22,143,163,.12); }
.answer.correct-input { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.42); }
.answer.wrong-input { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.35); }
.input-with-unit > span { position: absolute; right: 15px; top: 50%; color: ${T.ink3}; font-size: 11px; font-weight: 900; transform: translateY(-50%); }
.btn.check { flex: none; }
.proof-grid {
  margin-top: 13px;
  padding: 13px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font: 850 13px/1.3 'JetBrains Mono', monospace;
  animation: proofOpen .62s cubic-bezier(.16,1,.3,1) both;
}
.proof-grid span,
.proof-grid b { padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,.7); }
.proof-grid b { color: ${T.success}; }
.error-board { min-height: 154px; position: relative; display: grid; justify-items: center; align-content: center; gap: 12px; }
.error-board > div { display: flex; gap: 10px; }
.error-board span { padding: 9px 13px; border-radius: 12px; color: ${T.navy}; background: ${T.cyanSoft}; font: 850 15px/1 'JetBrains Mono', monospace; }
.error-board strong { padding: 10px 15px; border-radius: 13px; color: ${T.warn}; background: ${T.warnSoft}; font: 900 19px/1.2 'JetBrains Mono', monospace; text-decoration: line-through; }
.error-board > i { position: absolute; right: 25px; top: 24px; color: ${T.accent}; font: normal 950 34px/1 'Source Serif 4', serif; }
.two-part-route { min-height: 160px; position: relative; display: grid; grid-template-columns: 1fr 2fr; gap: 6px; align-items: stretch; padding-bottom: 48px; }
.two-part-route .part { min-height: 82px; border-radius: 16px; display: grid; place-items: center; color: white; background: ${T.cyan}; }
.two-part-route .part.large { background: ${T.navy}; }
.two-part-route span { font: 900 18px/1 'JetBrains Mono', monospace; }
.two-part-route > strong { position: absolute; left: 19px; right: 19px; bottom: 15px; color: ${T.accent}; text-align: center; font: 900 18px/1 'JetBrains Mono', monospace; }
.total-time { padding: 10px 15px; border-radius: 14px; color: ${T.ink2}; background: ${T.cyanSoft}; text-align: center; font: 850 14px/1.3 'JetBrains Mono', monospace; }
.total-time b { color: ${T.cyan}; }
.summary-motion { display: grid; gap: 10px; }
.hook-answer b { color: ${T.success}; }
.summary-rules { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.summary-rules > div { min-height: 92px; padding: 10px; border-radius: 14px; display: grid; align-content: center; justify-items: center; gap: 8px; color: ${T.ink2}; background: #F8F8F4; text-align: center; transition: .22s ease; }
.summary-rules span { color: ${T.ink3}; font-size: 9px; font-weight: 900; text-transform: uppercase; }
.summary-rules b { font: 850 12px/1.35 'JetBrains Mono', monospace; }
.summary-rules > div.active { color: ${T.navy}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px rgba(255,91,53,.24); transform: translateY(-3px); }
.bridge { padding: 13px 16px; border-radius: 16px; color: white; background: ${T.navy}; }
.bridge > span { color: #7DE1EE; }
.bridge > strong { font: 750 16px/1.3 'Source Serif 4', Georgia, serif; }
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}.finale-main{min-width:0;display:grid;grid-template-columns:minmax(220px,.82fr) minmax(320px,1.18fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:13px;border-radius:18px;display:grid;align-content:center;gap:10px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-equation{min-width:0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px}.finale-equation span,.finale-equation strong{min-width:52px;padding:10px;border-radius:12px;text-align:center;font:900 clamp(16px,2.4vw,22px)/1 'JetBrains Mono',monospace}.finale-equation span{color:${T.navy};background:${T.cyanSoft}}.finale-equation strong{color:${T.navy};background:${T.lime}}.finale-equation i{color:${T.accent};font:normal 900 19px/1 'JetBrains Mono',monospace}.finale-check{padding:9px 11px;border-radius:12px;color:${T.ink2};background:#F8F8F4;text-align:center;font:850 12px/1.3 'JetBrains Mono',monospace}.finale-check b{color:${T.success}}.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.3;overflow-wrap:anywhere}.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{display:flex;align-items:center;gap:6px}.finale-status b{color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{color:rgba(255,255,255,.72);font-size:8px}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .bit{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:float 2.8s ease-in-out infinite}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear infinite}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
.finale-track .route-svg{max-height:128px}.finale-hook-answer{padding:9px 11px;border-radius:12px;opacity:.14;transform:translateY(6px);color:${T.ink2};background:#F8F8F4;text-align:center;font:850 12px/1.3 'JetBrains Mono',monospace;transition:.42s ease}.finale-hook-answer.show{opacity:1;transform:none}.finale-hook-answer b{color:${T.success}}.finale-takeaway span small{display:block;margin-bottom:2px;color:${T.cyan};font-size:8px;font-weight:900;text-transform:uppercase}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation-name:bitFloat}
.preview-language { position: fixed; top: 9px; right: 9px; z-index: 30; display: flex; gap: 3px; padding: 3px; border-radius: 999px; background: rgba(255,255,255,.94); box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6); }
.preview-language button { padding: 4px 9px; border: 0; border-radius: 999px; color: ${T.ink2}; background: transparent; cursor: pointer; font-size: 10px; font-weight: 900; }
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.g1-char { overflow: visible; filter: drop-shadow(0 9px 11px rgba(23,59,82,.20)); animation: bitFloat 3.2s ease-in-out infinite; }
.g1-eyes { animation: blink 4.4s ease-in-out infinite; transform-origin: center; }
@keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } }
@keyframes proofOpen { from { opacity: 0; transform: translateY(8px); } }
@keyframes bitFloat { 50% { transform: translateY(-5px); } }
@keyframes blink { 0%,45%,49%,100% { transform: scaleY(1); } 47% { transform: scaleY(.12); } }
@media (max-width: 639.98px) {
  .stage { width: min(390px,100%); }
  .stage-header { padding-top: 60px; }
  .screen-type { display: none; }
  .stage-content { overscroll-behavior: contain; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .stage-content::-webkit-scrollbar { display: none; }
  .heading { min-height: 70px; gap: 10px; }
  .heading h1 { font-size: 27px; }
  .heading .g1-char { width: 67px; height: 83px; }
  .question,
  .motion-card,
  .rule-board,
  .unit-grid,
  .formula-board,
  .flow-board,
  .match-board,
  .practice-visual,
  .error-board,
  .two-part-route,
  .summary-motion,
  .summary-rules { padding: 14px; border-radius: 18px; }
  .options { grid-template-columns: 1fr; }
  .option { min-height: 52px; }
  .route-distance { font-size: 15px; }
  .hook-facts,
  .three-values,
  .known-strip,
  .segment-cards { gap: 5px; }
  .hook-facts > div,
  .three-values > div,
  .known-strip > div,
  .segment-cards > div { min-height: 62px; padding: 8px 4px; }
  .hook-facts b,
  .three-values b,
  .known-strip b,
  .segment-cards b { font-size: 12px; }
  .formula-row { min-height: 64px; grid-template-columns: 82px 1fr; gap: 8px; padding: 10px; }
  .formula-row strong { font-size: 14px; }
  .unit-grid { grid-template-columns: 1fr; }
  .unit-grid > div { min-height: 85px; grid-template-columns: 44px 1fr auto; justify-items: start; text-align: left; }
  .unit-grid small { grid-column: 2 / -1; }
  .decision-card { grid-template-columns: 32px 1fr; }
  .decision-card > i { display: none; }
  .flow-board { min-height: 0; grid-template-columns: 1fr; }
  .flow-board > i { transform: rotate(90deg); justify-self: center; }
  .match-row { grid-template-columns: 1fr; }
  .match-row > div { gap: 4px; }
  .match-row button { padding: 5px 2px; font-size: 9px; }
  .practice-visual.compact { grid-template-columns: 1fr; }
  .input-row { flex-direction: column; }
  .btn.check { align-self: flex-end; }
  .summary-rules { grid-template-columns: 1fr 1fr; }
  .summary-rules > div { min-height: 76px; }
  .finale-heading { padding: 9px 11px; }
  .finale-heading h1 { font-size: 21px; }
  .finale-heading p { font-size: 9px; }
  .finale-main,
  .finale-bottom { grid-template-columns: 1fr; }
  .finale-payoff { padding: 11px; }
  .finale-track .route-svg { max-height: 105px; }
  .finale-takeaway { min-height: 38px; padding: 6px 8px; }
  .finale-reward { min-height: 92px; padding: 10px 62px 9px 51px; }
  .finale-medal { left: 9px; width: 34px; height: 34px; }
  .finale-reward-bit { width: 58px; height: 74px; }
  .finale-reward-copy > strong { font-size: 14px; }
  .stage-summary .stack { gap: 9px; }
  .stage-summary .finale-heading { padding: 7px 9px; }
  .stage-summary .finale-heading p { font-size: 8.5px; line-height: 1.25; }
  .stage-summary .finale-main,
  .stage-summary .finale-bottom { gap: 8px; }
  .stage-summary .finale-payoff { padding: 8px; gap: 6px; }
  .stage-summary .finale-track .route-svg { max-height: 80px; }
  .stage-summary .finale-hook-answer { padding: 6px 8px; }
  .stage-summary .finale-takeaways { gap: 4px; }
  .stage-summary .finale-takeaway { min-height: 34px; padding: 4px 7px; grid-template-columns: 25px minmax(0,1fr); gap: 6px; }
  .stage-summary .finale-takeaway b { width: 24px; height: 24px; }
  .stage-summary .finale-takeaway span { font-size: 10px; line-height: 1.22; }
  .stage-summary .finale-bridge { padding: 8px 11px; }
  .stage-summary .finale-bridge strong { font-size: 13px; }
  .stage-summary .finale-reward { min-height: 80px; padding: 8px 56px 7px 47px; }
  .stage-summary .finale-medal { left: 8px; width: 30px; height: 30px; }
  .stage-summary .finale-reward-bit { width: 52px; height: 66px; }
  .stage-summary .finale-reward-copy > strong { font-size: 13px; }
  .stage-summary .finale-status span { font-size: 7.5px; }
  .stage-nav { min-height: 68px; }
  .btn { min-width: 110px; min-height: 48px; padding: 0 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root *,
  .lesson-root *::before,
  .lesson-root *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .reveal-item,
  .formula-row,
  .frame-question,
  .flow-board > i,
  .finale-takeaway,
  .finale-hook-answer,
  .finale-bridge { opacity: 1 !important; transform: none !important; pointer-events: auto !important; }
}
`;
