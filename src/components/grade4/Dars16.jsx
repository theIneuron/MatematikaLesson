import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// 4-SINF · 16-DARS · Formulalar
// Approved frame vector: 3,4,4,3,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 3, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const LESSON_META = {
  lessonId: 'num-4-16-v1',
  slug: 'dars16-formulalar',
  lessonTitle: { uz: "16-dars. Formulalar", ru: 'Урок 16. Формулы' },
  skillTags: ['formula', 'rectangle_perimeter', 'square_perimeter', 'rectangle_area', 'substitution'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'test', template: 'MatchingScreen', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Qurilish paneli", ru: 'Строительная панель' },
    title: { uz: "Istalgan to'g'ri to'rtburchak uchun usul", ru: 'Способ для любого прямоугольника' },
    question: { uz: "Istalgan to'g'ri to'rtburchak perimetrini qaysi usul topadi?", ru: 'Какой способ находит периметр любого прямоугольника?' },
    options: [
      { uz: "Barcha 4 tomonni qo'shish", ru: 'Сложить все 4 стороны' },
      { uz: "Uzunlikni kenglikka ko'paytirish", ru: 'Умножить длину на ширину' },
      { uz: "Faqat 2 tomonni qo'shish", ru: 'Сложить только 2 стороны' },
    ],
    neutral: { uz: "Taxminni tekshirish uchun to'rtta tomon bo'ylab yuramiz.", ru: 'Чтобы проверить гипотезу, пройдём вдоль четырёх сторон.' },
    audio: { intro: {
      uz: ["Bit qurilish panelining barcha chetlarini o'lchamoqchi.", "Perimetr shaklning barcha tomonlari uzunligining yig'indisidir.", "Hozircha umumiy usulni taxmin qiling."],
      ru: ['Бит хочет измерить всю границу строительной панели.', 'Периметр является суммой длин всех сторон фигуры.', 'Пока предположи, какой способ будет общим.'],
    }, on_correct: { uz: "Taxmin saqlandi.", ru: 'Гипотеза сохранена.' }, on_wrong: { uz: "Taxmin saqlandi.", ru: 'Гипотеза сохранена.' } },
  },
  s1: {
    eyebrow: { uz: "Aniq model", ru: 'Конкретная модель' },
    title: { uz: "To'rtta tomon bo'ylab yuramiz", ru: 'Проходим вдоль четырёх сторон' },
    audio: {
      uz: ["Yuqori tomon uch santimetr.", "Keyingi tomon ikki santimetr, pastki tomon yana uch santimetr.", "Oxirgi tomon yana ikki santimetr.", "To'rtta tomonni qo'shsak, perimetr o'n santimetr bo'ladi."],
      ru: ['Верхняя сторона равна трём сантиметрам.', 'Следующая сторона равна двум сантиметрам, нижняя сторона снова трём сантиметрам.', 'Последняя сторона снова равна двум сантиметрам.', 'Если сложить четыре стороны, периметр будет равен десяти сантиметрам.'],
    },
  },
  s2: {
    eyebrow: { uz: "Bir xil juftlar", ru: 'Одинаковые пары' },
    title: { uz: "Yozuvni qisqartiramiz", ru: 'Сокращаем запись' },
    audio: {
      uz: ["To'g'ri to'rtburchakning qarama-qarshi tomonlari teng.", "Bitta uzunlik va bitta kenglikdan ikkita bir xil juft hosil bo'ladi.", "Shuning uchun uzunlik va kenglik yig'indisini ikki marta olamiz.", "Yangi yozuv avvalgi to'rtta qo'shiluvchiga teng."],
      ru: ['Противоположные стороны прямоугольника равны.', 'Получаются две одинаковые пары из длины и ширины.', 'Поэтому сумму длины и ширины берём два раза.', 'Новая запись равна прежней сумме четырёх сторон.'],
    },
  },
  s3: {
    eyebrow: { uz: "Yana bir tekshiruv", ru: 'Ещё одна проверка' },
    title: { uz: "Yangi o'lchamlarda ham teng", ru: 'Равенство сохраняется' },
    audio: {
      uz: ["Endi tomonlari to'rt va besh santimetr bo'lgan to'g'ri to'rtburchakni tekshiramiz.", "To'rtta tomonning yig'indisi o'n sakkiz santimetr.", "Uzunlik va kenglik yig'indisini ikki marta olish ham o'n sakkizni beradi."],
      ru: ['Теперь проверим прямоугольник со сторонами четыре и пять сантиметров.', 'Сумма четырёх сторон равна восемнадцати сантиметрам.', 'Если дважды взять сумму длины и ширины, тоже получим восемнадцать.'],
    },
  },
  s4: {
    eyebrow: { uz: "Harfli umumiy qoida", ru: 'Общее правило с буквами' },
    title: { uz: "Formula", ru: 'Формула' },
    audio: {
      uz: ["Istalgan uzunlikni a harfi, kenglikni b harfi bilan belgilaymiz.", "Perimetrni pe harfi bilan belgilaymiz.", "Perimetr uzunlik va kenglik yig'indisining ikki baravariga teng.", "Harfli umumiy qoida formula deyiladi."],
      ru: ['Любую длину обозначим буквой а, а ширину буквой бэ.', 'Периметр обозначим буквой пэ.', 'Периметр равен удвоенной сумме длины и ширины.', 'Общее правило, записанное буквами, называется формулой.'],
    },
  },
  s5: {
    eyebrow: { uz: "Qiymatlarni qo'yish", ru: 'Подстановка значений' },
    title: { uz: "Harflar o'rniga sonlar", ru: 'Числа вместо букв' },
    audio: {
      uz: ["Uzunlik ikki, kenglik besh santimetr.", "Formuladagi a va b harflari o'rniga berilgan sonlarni qo'yamiz.", "Avval qavs ichidagi ikki va beshni qo'shamiz.", "Yettini ikkiga ko'paytirsak, perimetr o'n to'rt santimetr."],
      ru: ['Длина равна двум, а ширина пяти сантиметрам.', 'Вместо букв а и бэ в формуле подставляем данные числа.', 'Сначала складываем два и пять в скобках.', 'Если семь умножить на два, периметр равен четырнадцати сантиметрам.'],
    },
  },
  s6: {
    eyebrow: { uz: "Kvadrat", ru: 'Квадрат' },
    title: { uz: "To'rtta teng tomon", ru: 'Четыре равные стороны' },
    audio: {
      uz: ["Kvadratning barcha to'rtta tomoni teng.", "Perimetr to'rtta bir xil tomonning yig'indisidir.", "To'rtta bir xil a ni to'rtni a ga ko'paytirish bilan yozamiz.", "Kvadrat perimetri tomondan to'rt marta katta."],
      ru: ['Все четыре стороны квадрата равны.', 'Периметр равен сумме четырёх одинаковых сторон.', 'Четыре одинаковых а записываем как четыре умножить на а.', 'Периметр квадрата равен четырём его сторонам.'],
    },
  },
  s7: {
    eyebrow: { uz: "Chegara va ichki qism", ru: 'Граница и внутренняя часть' },
    title: { uz: "Yuza formulasi", ru: 'Формула площади' },
    audio: {
      uz: ["Birinchi qatorda to'rtta birlik kvadrat bor.", "Ikki qatorda sakkizta birlik kvadrat bo'ladi.", "Uch qatorda jami o'n ikkita birlik kvadrat bor.", "To'g'ri to'rtburchak yuzasi uzunlik va kenglik ko'paytmasiga teng.", "Perimetr chegarani uzunlik birligida, yuza ichki qismni kvadrat birlikda o'lchaydi."],
      ru: ['В первом ряду четыре единичных квадрата.', 'В двух рядах восемь единичных квадратов.', 'В трёх рядах всего двенадцать единичных квадратов.', 'Площадь прямоугольника равна произведению длины и ширины.', 'Периметр измеряет границу единицами длины, а площадь внутреннюю часть квадратными единицами.'],
    },
  },
  s8: {
    eyebrow: { uz: "Mashq · 1/6", ru: 'Тренировка · 1/6' },
    title: { uz: "Vaziyat va formulani juftlang", ru: 'Соедини ситуацию и формулу' },
    question: { uz: "Har bir vaziyatga mos formulani tanlang.", ru: 'Выбери формулу для каждой ситуации.' },
    situations: [
      { uz: "To'g'ri to'rtburchak chegarasi", ru: 'Граница прямоугольника' },
      { uz: "Kvadrat chegarasi", ru: 'Граница квадрата' },
      { uz: "To'g'ri to'rtburchak ichki qismi", ru: 'Внутренняя часть прямоугольника' },
    ],
    formulas: ['P = 2 · (a + b)', 'P = 4 · a', 'S = a · b'],
    answer: [0, 1, 2],
    audio: { intro: { uz: ["Har bir vaziyatni mos formula bilan juftlang.", "Chegara perimetrni, ichki qism esa yuzani bildiradi."], ru: ['Соедини каждую ситуацию с подходящей формулой.', 'Граница указывает на периметр, а внутренняя часть на площадь.'] }, on_correct: { uz: "To'g'ri. Har bir vaziyat o'z formulasiga mos.", ru: 'Верно. Каждая ситуация соответствует своей формуле.' }, on_wrong: { uz: "Chegara bilan ichki qismni yana farqlang.", ru: 'Ещё раз различи границу и внутреннюю часть.' } },
  },
  s9: {
    eyebrow: { uz: "Mashq · 2/6", ru: 'Тренировка · 2/6' },
    title: { uz: "To'g'ri to'rtburchak perimetri", ru: 'Периметр прямоугольника' },
    question: { uz: "a = 6 sm, b = 11 sm. P = ?", ru: 'a = 6 см, b = 11 см. P = ?' },
    answer: '34',
    feedback: { correct: { uz: "To'g'ri. Ikki bir xil juft jami o'ttiz to'rt santimetr.", ru: 'Верно. Две одинаковые пары дают тридцать четыре сантиметра.' }, default: { uz: "Avval olti va o'n birni qo'shing, keyin natijani ikki marta oling.", ru: 'Сначала сложи шесть и одиннадцать, затем возьми результат два раза.' }, '17': { uz: "17 faqat bitta uzunlik va kenglik jufti. Perimetrda bunday juft ikkita.", ru: '17 — только одна пара длины и ширины. В периметре таких пар две.' }, '66': { uz: "66 ichki qism yuzasini topadi, chegarani emas.", ru: '66 находит площадь внутренней части, а не границу.' } },
    audio: { intro: { uz: ["Uzunlik olti, kenglik o'n bir santimetr.", "To'g'ri to'rtburchak perimetrini formula orqali toping."], ru: ['Длина равна шести, а ширина одиннадцати сантиметрам.', 'Найди периметр прямоугольника по формуле.'] }, on_correct: { uz: "To'g'ri. Perimetr o'ttiz to'rt santimetr.", ru: 'Верно. Периметр равен тридцати четырём сантиметрам.' }, on_wrong: { uz: "Uzunlik va kenglik yig'indisini ikki marta oling.", ru: 'Возьми сумму длины и ширины два раза.' } },
  },
  s10: {
    eyebrow: { uz: "Mashq · 3/6", ru: 'Тренировка · 3/6' },
    title: { uz: "Kvadrat perimetri", ru: 'Периметр квадрата' },
    question: { uz: "a = 7 sm. P = ?", ru: 'a = 7 см. P = ?' },
    answer: '28',
    feedback: { correct: { uz: "To'g'ri. To'rtta teng tomon jami yigirma sakkiz santimetr.", ru: 'Верно. Четыре равные стороны дают двадцать восемь сантиметров.' }, default: { uz: "Kvadratning to'rtta teng tomonini hisobga oling.", ru: 'Учти четыре равные стороны квадрата.' }, '14': { uz: "14 faqat ikkita tomonni hisobga oladi.", ru: '14 учитывает только две стороны.' }, '49': { uz: "49 tomonning kvadrati, perimetr emas.", ru: '49 — квадрат стороны, а не периметр.' } },
    audio: { intro: { uz: ["Kvadrat tomoni yetti santimetr.", "Kvadrat perimetrini toping."], ru: ['Сторона квадрата равна семи сантиметрам.', 'Найди периметр квадрата.'] }, on_correct: { uz: "To'g'ri. Perimetr yigirma sakkiz santimetr.", ru: 'Верно. Периметр равен двадцати восьми сантиметрам.' }, on_wrong: { uz: "To'rtta teng tomonning yig'indisini toping.", ru: 'Найди сумму четырёх равных сторон.' } },
  },
  s11: {
    eyebrow: { uz: "Mashq · 4/6", ru: 'Тренировка · 4/6' },
    title: { uz: "To'g'ri to'rtburchak yuzasi", ru: 'Площадь прямоугольника' },
    question: { uz: "a = 4 sm, b = 7 sm. S = ?", ru: 'a = 4 см, b = 7 см. S = ?' },
    answer: '28',
    feedback: { correct: { uz: "To'g'ri. Yuza yigirma sakkiz kvadrat santimetr.", ru: 'Верно. Площадь равна двадцати восьми квадратным сантиметрам.' }, default: { uz: "Yuza uchun uzunlikni kenglikka ko'paytiring.", ru: 'Для площади умножь длину на ширину.' }, '22': { uz: "22 perimetr natijasi, yuza emas.", ru: '22 — результат для периметра, а не для площади.' }, '11': { uz: "11 faqat tomonlar yig'indisi.", ru: '11 — только сумма сторон.' } },
    audio: { intro: { uz: ["To'g'ri to'rtburchakning tomonlari to'rt va yetti santimetr.", "Yuzani kvadrat santimetrda toping."], ru: ['Стороны прямоугольника равны четырём и семи сантиметрам.', 'Найди площадь в квадратных сантиметрах.'] }, on_correct: { uz: "To'g'ri. Yuza yigirma sakkiz kvadrat santimetr.", ru: 'Верно. Площадь равна двадцати восьми квадратным сантиметрам.' }, on_wrong: { uz: "Uzunlikni kenglikka ko'paytiring.", ru: 'Умножь длину на ширину.' } },
  },
  s12: {
    eyebrow: { uz: "Mashq · 5/6", ru: 'Тренировка · 5/6' },
    title: { uz: "Bitning xatosini tuzating", ru: 'Исправь ошибку Бита' },
    question: { uz: "Bitning to'g'ri hisobi qaysi?", ru: 'Какое вычисление Бита верно?' },
    options: ['P = 2 · (5 + 3) = 16', 'S = 5 · 3 = 15', 'P = 5 + 3 = 8'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Barcha to'rtta tomon hisobga olindi.", ru: 'Верно. Учтены все четыре стороны.' },
      { uz: "15 ichki qism yuzasini topadi, perimetrni emas.", ru: '15 находит площадь внутренней части, а не периметр.' },
      { uz: "8 faqat bitta uzunlik va bitta kenglik. Perimetr uchun bu juftni ikki marta olish kerak.", ru: '8 — только одна длина и одна ширина. Для периметра эту пару нужно взять два раза.' },
    ],
    audio: { intro: { uz: ["Bit perimetrga faqat bitta uzunlik va bitta kenglikni qo'shdi.", "Perimetrda barcha to'rtta tomon qatnashishini tekshiring."], ru: ['Бит сложил для периметра только одну длину и одну ширину.', 'Проверь, что в периметре участвуют все четыре стороны.'] }, on_correct: { uz: "To'g'ri. Barcha to'rtta tomon hisobga olindi.", ru: 'Верно. Учтены все четыре стороны.' }, on_wrong: { uz: "Perimetrda barcha to'rtta tomon qatnashadi.", ru: 'В периметре участвуют все четыре стороны.' } },
  },
  s13: {
    eyebrow: { uz: "Mashq · 6/6", ru: 'Тренировка · 6/6' },
    title: { uz: "Bog'ning ichki qismini qoplash", ru: 'Покрытие внутренней части парка' },
    question: { uz: "Mos formula va natijani tanlang.", ru: 'Выбери подходящую формулу и результат.' },
    options: [
      { uz: "S = 12 · 8 = 96 m²", ru: 'S = 12 · 8 = 96 м²' },
      { uz: "P = 2 · (12 + 8) = 40 m", ru: 'P = 2 · (12 + 8) = 40 м' },
      { uz: "12 + 8 = 20 m", ru: '12 + 8 = 20 м' },
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Ichki qismning yuzasi to'qson olti kvadrat metr.", ru: 'Верно. Площадь внутренней части равна девяноста шести квадратным метрам.' },
      { uz: "40 metr chegara uzunligini topadi, ichki qoplama miqdorini emas.", ru: '40 метров находит длину границы, а не количество покрытия.' },
      { uz: "20 metr faqat bitta uzunlik va kenglik yig'indisi.", ru: '20 метров — только сумма одной длины и одной ширины.' },
    ],
    audio: { intro: { uz: ["Lumo shahridagi bog'ning ichki qismi qoplanadi.", "Ichki qism kerak bo'lgani uchun yuzani topamiz.", "Mos formula va natijani tanlang."], ru: ['В парке Лумо нужно покрыть внутреннюю часть участка.', 'Поскольку нужна внутренняя часть, находим площадь.', 'Выбери подходящую формулу и результат.'] }, on_correct: { uz: "To'g'ri. Yuza to'qson olti kvadrat metr.", ru: 'Верно. Площадь равна девяноста шести квадратным метрам.' }, on_wrong: { uz: "Ichki qism uchun uzunlikni kenglikka ko'paytiring.", ru: 'Для внутренней части умножь длину на ширину.' } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' },
    title: { uz: "Uchta formula, uchta bog'lanish", ru: 'Три формулы, три связи' },
    audio: {
      uz: ["Formula bir xil bog'lanishni harflar bilan qisqa va umumiy yozadi.", "To'g'ri to'rtburchak perimetri uzunlik va kenglik yig'indisining ikki baravariga teng.", "Kvadrat perimetri tomonning to'rt baravariga teng.", "To'g'ri to'rtburchak yuzasi uzunlik va kenglik ko'paytmasiga teng.", "Keyingi mavzuda chizmadagi uzunlik haqiqiy masofani qanday ifodalashini o'rganamiz."],
      ru: ['Формула кратко и в общем виде записывает одну и ту же связь с помощью букв.', 'Периметр прямоугольника равен удвоенной сумме длины и ширины.', 'Периметр квадрата равен четырём сторонам.', 'Площадь прямоугольника равна произведению длины и ширины.', 'На следующем уроке узнаем, как длина на чертеже выражает реальное расстояние.'],
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

function usePrefersReducedMotion() {
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
    if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; this.previewUtterance = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch { /* preview only */ } }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? 900);
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU'; utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item, 900);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 900); } }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item); return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 900);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item, 900));
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
  /* eslint-disable react-hooks/refs -- stable audio queue */
  const segmentsRef = useRef(segments);
  const segmentsKey = JSON.stringify(segments || []);
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine(); if (!engine) return undefined;
    engine.setLang(lang); engine.listener = (next) => setState((previous) => ({ ...previous, ...next })); engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return { ...state, replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); }, toggleMute: () => getAudioEngine()?.toggleMute(), pushOneOff: (text) => getAudioEngine()?.pushOneOff(text) };
}

function useNarration(value, screen) {
  const lang = useLang(); const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => {
    const source = value?.intro ?? value;
    const texts = source?.[lang] ?? source?.ru ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1);
  const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true;
  const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
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
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const FeedbackBlock = ({ show, correct, children }) => {
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0; const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    const timer = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 180);
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); window.clearTimeout(timer); };
  }, [show]);
  if (!show) return null;
  return <div ref={ref} role="status" className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><b>{correct ? '✓' : '↻'}</b><p>{children}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const ref = useRef(null); const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  useEffect(() => { ref.current?.scrollTo({ top: 0, behavior: 'auto' }); }, [screen]);
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" ref={ref} style={{ paddingLeft: pad, paddingRight: pad }}>{children}{audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' })}</button>}<button type="button" className="btn-white-accent" onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' }) : t({ uz: "Davom etish", ru: 'Продолжить' })} →</button></footer></main>;
};

const Heading = ({ c, bit }) => { const t = useT(); return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{bit && <BitSVG state={bit}/>}</div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false }) => { const t = useT(); return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${!neutral && solved && index === correctIndex ? 'right' : ''} ${!neutral && picked === index && picked !== correctIndex ? 'bad' : ''}`} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>; };

const FormulaFlow = ({ items, frame }) => <div className="formula-flow">{items.map((item, index) => <React.Fragment key={item}><div className={`formula-chip ${frame >= index ? 'show' : ''}`}>{item}</div>{index < items.length - 1 && <i className={frame >= index + 1 ? 'show' : ''}>→</i>}</React.Fragment>)}</div>;

const RectangleDiagram = ({ a, b, frame = 0, letters = false, square = false, tiles = false, filled = false, rotated = false, compact = false }) => {
  const horizontal = rotated ? b : a; const vertical = rotated ? a : b;
  const cols = horizontal; const rows = vertical; const tileList = Array.from({ length: cols * rows }, (_, index) => index);
  return <div className={`shape-model ${filled ? 'filled' : ''} ${compact ? 'shape-model-compact' : ''}`}>
    <div className={`rect-shape ${square ? 'square-shape' : ''}`} style={{ aspectRatio: `${horizontal} / ${vertical}` }}>
      {tiles && <div className="tile-grid" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>{tileList.map((index) => { const row = Math.floor(index / cols); return <i key={index} className={frame >= row ? 'tile-on' : ''}/>; })}</div>}
      <span className={frame >= 0 ? 'edge-on edge-top' : 'edge-top'}>{letters ? (rotated ? 'b' : 'a') : horizontal}</span>
      <span className={frame >= 1 ? 'edge-on edge-right' : 'edge-right'}>{letters ? (rotated ? 'a' : 'b') : vertical}</span>
      <span className={frame >= 2 ? 'edge-on edge-bottom' : 'edge-bottom'}>{letters ? (rotated ? 'b' : 'a') : horizontal}</span>
      <span className={frame >= 3 ? 'edge-on edge-left' : 'edge-left'}>{letters ? (rotated ? 'a' : 'b') : vertical}</span>
    </div>
  </div>;
};

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null }) {
  const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => { if (solved) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={screen === 12 ? 'awkward' : null}/>{visual}<section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved}/><FeedbackBlock show={picked !== null} correct={solved}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function NumericExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, proof }) {
  const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => { const answer = String(value).replace(/\D/g, ''); if (!answer || solved) return; attempts.current += 1; const ok = answer === c.answer; if (!ok) clean.current = false; setSolved(ok); const visualText = ok ? c.feedback.correct : c.feedback[answer] ?? c.feedback.default; setMessage(visualText); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: c.answer, studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input className={`answer-input ${message ? solved ? 'is-correct' : 'is-wrong' : ''}`} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(event.target.value.replace(/\D/g, '').slice(0, 5)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()}/><button type="button" className="btn-white-accent compact" onClick={submit} disabled={!value || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' })}</button></div><FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>{solved && <div className="proof">{t(proof)}</div>}</section></div></Stage>;
}

function MatchingExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s8; const audio = useNarration(c.audio, screen);
  const restored = Array.isArray(storedAnswer?.studentAnswer) ? storedAnswer.studentAnswer : [-1, -1, -1];
  const [matches, setMatches] = useState(restored); const [message, setMessage] = useState(null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const cycle = (index) => { if (solved) return; setMatches((previous) => previous.map((value, place) => place === index ? (value + 1) % c.formulas.length : value)); setMessage(null); };
  const submit = () => { if (matches.some((value) => value < 0) || solved) return; attempts.current += 1; const ok = matches.every((value, index) => value === c.answer[index]); if (!ok) clean.current = false; setSolved(ok); setMessage(ok ? c.audio.on_correct : c.audio.on_wrong); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: c.answer, studentAnswer: matches, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="question"><h2>{t(c.question)}</h2><div className="matching">{c.situations.map((situation, index) => <div key={t(situation)}><span>{t(situation)}</span><button type="button" onClick={() => cycle(index)} disabled={solved}>{matches[index] < 0 ? t({ uz: "Formulani tanlang", ru: 'Выбери формулу' }) : c.formulas[matches[index]]}</button></div>)}</div><button type="button" className="btn-white-accent check-wide" onClick={submit} disabled={matches.some((value) => value < 0) || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' })}</button><FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null);
  return <Stage screen={screen} audio={audio} onNext={onNext}><div className="stack"><Heading c={c} bit="think"/><section className="model-card"><RectangleDiagram a={3} b={2} frame={audio.frame >= 1 ? 3 : -1}/><div className="dimension-note">{t({ uz: "3 sm × 2 sm", ru: '3 см × 2 см' })}</div></section><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={setPicked} neutral/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><RectangleDiagram a={3} b={2} frame={audio.frame}/><div className={`formula-display ${audio.frame >= 3 ? 'show' : ''}`}>{t({ uz: "3 + 2 + 3 + 2 = 10 sm", ru: '3 + 2 + 3 + 2 = 10 см' })}</div></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const c = CONTENT.s2; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><RectangleDiagram a={3} b={2} frame={3}/><FormulaFlow frame={audio.frame} items={['3 + 2 + 3 + 2', '(3 + 2) + (3 + 2)', '2 · (3 + 2)', '10']}/></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="two-methods"><RectangleDiagram a={4} b={5} frame={3}/><div><div className={audio.frame >= 1 ? 'formula-display show' : 'formula-display'}>{t({ uz: "4 + 5 + 4 + 5 = 18 sm", ru: '4 + 5 + 4 + 5 = 18 см' })}</div><div className={audio.frame >= 2 ? 'formula-display accent-formula show' : 'formula-display accent-formula'}>{t({ uz: "2 · (4 + 5) = 18 sm", ru: '2 · (4 + 5) = 18 см' })}</div><small>{t({ uz: "Ikkala yozuv ham bir xil natija beradi", ru: 'Обе записи дают один результат' })}</small></div></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="idea"/><section className="formula-rule"><RectangleDiagram a={3} b={2} frame={3} letters/><div className="letter-key"><span className={audio.frame >= 0 ? 'show' : ''}><b>a</b>{t({ uz: "uzunlik", ru: 'длина' })}</span><span className={audio.frame >= 0 ? 'show' : ''}><b>b</b>{t({ uz: "kenglik", ru: 'ширина' })}</span><span className={audio.frame >= 1 ? 'show' : ''}><b>P</b>{t({ uz: "perimetr", ru: 'периметр' })}</span></div><div className={`master-formula ${audio.frame >= 2 ? 'show' : ''}`}>P = 2 · (a + b)</div><p className={audio.frame >= 3 ? 'show' : ''}>{t({ uz: "Harfli umumiy qoida — formula", ru: 'Общее правило с буквами — формула' })}</p></section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card substitution-card"><RectangleDiagram a={2} b={5} frame={3} rotated compact/><FormulaFlow frame={audio.frame} items={['P = 2 · (a + b)', 'P = 2 · (2 + 5)', 'P = 2 · 7', t({ uz: "P = 14 sm", ru: 'P = 14 см' })]}/></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="formula-rule square-rule"><RectangleDiagram a={3} b={3} frame={audio.frame} letters square/><FormulaFlow frame={audio.frame} items={['a + a + a + a', '4 · a', 'P = 4 · a']}/><p className={audio.frame >= 3 ? 'show' : ''}>{t({ uz: "Kvadratning to'rtta tomoni teng", ru: 'Четыре стороны квадрата равны' })}</p></section></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="area-model"><RectangleDiagram a={4} b={3} frame={audio.frame} tiles/><div className={`master-formula ${audio.frame >= 3 ? 'show' : ''}`}>{t({ uz: "S = a · b = 4 · 3 = 12 sm²", ru: 'S = a · b = 4 · 3 = 12 см²' })}</div><div className={`measure-contrast ${audio.frame >= 4 ? 'show' : ''}`}><span>{t({ uz: "Perimetr — chegara, sm", ru: 'Периметр — граница, см' })}</span><span>{t({ uz: "Yuza — ichki qism, sm²", ru: 'Площадь — внутри, см²' })}</span></div></section></div></Stage>;
}

function Screen8(props) { return <MatchingExercise {...props}/>; }
function Screen9(props) { return <NumericExercise {...props} proof={{ uz: "P = 2 · (6 + 11) = 34 sm", ru: 'P = 2 · (6 + 11) = 34 см' }}/>; }
function Screen10(props) { return <NumericExercise {...props} proof={{ uz: "P = 4 · 7 = 28 sm", ru: 'P = 4 · 7 = 28 см' }}/>; }
function Screen11(props) { return <NumericExercise {...props} proof={{ uz: "S = 4 · 7 = 28 sm²", ru: 'S = 4 · 7 = 28 см²' }}/>; }
function Screen12(props) { return <ChoiceExercise {...props} visual={<div className="bit-error"><span>a = 5</span><span>b = 3</span><b>P = a + b = 8</b></div>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} visual={<div className="park-model"><RectangleDiagram a={12} b={8} frame={3} filled/><span>12 m</span><b>8 m</b></div>}/>; }

const FINAL_AWARDS = [
  { ru: 'Архитектор формул', uz: "Formulalar me'mori" },
  { ru: 'Мастер периметра и площади', uz: 'Perimetr va yuza ustasi' },
  { ru: 'Исследователь фигур', uz: 'Shakllar tadqiqotchisi' },
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
    {rewardReady && <div className="finale-confetti" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index}/>)}</div>}
    <div className="finale-medal" aria-hidden="true">{rewardReady ? '★' : '🔒'}</div>
    <div className="finale-reward-copy"><small>{t(rewardReady ? { uz: "UNVON OLINDI", ru: 'ЗВАНИЕ ПОЛУЧЕНО' } : { uz: "UNVON YOPIQ", ru: 'ЗВАНИЕ ЗАКРЫТО' })}</small><strong>{rewardReady ? t(award) : t({ uz: "Unvonni oching", ru: 'Открой звание' })}</strong><div className="finale-status"><b>{rewardReady ? `${firstTry}/${total}` : `${solvedCount}/${total}`}</b><span>{t(rewardReady ? { uz: `birinchi urinish · ${answered}/${total} mashq bajarildi`, ru: `с первой попытки · ${answered}/${total} заданий выполнено` } : { uz: "mashq yechildi", ru: 'заданий решено' })}</span></div></div>
    <div className="finale-reward-bit"><BitSVG state={rewardReady ? 'happy' : 'present'}/></div>
  </aside>;
};

function Screen14({ screen, answers, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: { uz: "Formula", ru: 'Формула' }, value: { uz: "Bir xil bog'lanishni harflar bilan qisqa va umumiy yozadi", ru: 'Кратко и в общем виде записывает одну и ту же связь' } },
    { label: { uz: "To'g'ri to'rtburchak perimetri", ru: 'Периметр прямоугольника' }, value: 'P = 2 · (a + b)' },
    { label: { uz: "Kvadrat perimetri", ru: 'Периметр квадрата' }, value: 'P = 4 · a' },
    { label: { uz: "To'g'ri to'rtburchak yuzasi", ru: 'Площадь прямоугольника' }, value: 'S = a · b' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' })}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Boshlang'ich panel chegarasidan uchta umumiy formulaga o'tamiz.", ru: 'Переходим от границы стартовой панели к трём общим формулам.' })}</p></section><section className="finale-main"><div className="finale-payoff finale-concrete"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ' })}</small><RectangleDiagram a={3} b={2} frame={Math.min(frame, 3)}/><div className={`finale-hook-answer ${frame >= 3 ? 'show' : ''}`}>3 + 2 + 3 + 2 = <b>{t({ uz: "10 sm", ru: '10 см' })}</b></div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={`finale-takeaway ${frame >= index ? 'show' : ''}`} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{t(item.value)}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' })}</small><strong>{t({ uz: "Chizma uzunligi va haqiqiy masofa", ru: 'Длина на чертеже и реальное расстояние' })}</strong></div><FinaleReward answers={answers} complete={complete}/></section></div></Stage>;
}

const SCREENS=[Screen0,Screen1,Screen2,Screen3,Screen4,Screen5,Screen6,Screen7,Screen8,Screen9,Screen10,Screen11,Screen12,Screen13,Screen14];

export default function Grade4Dars16({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview=previewMode??(langProp===undefined||langProp===null); const [previewLang,setPreviewLang]=useState(langProp||'uz'); const lang=preview?previewLang:(langProp||'uz');
  configureLesson({ttsApiBase:ttsApiBase||'',voiceGender:voiceGender||'f',correctSoundUrl:correctSoundUrl||'',wrongSoundUrl:wrongSoundUrl||'',previewMode:preview});
  const [current,setCurrent]=useState(0); const [answers,setAnswers]=useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started=useRef(Date.now()); const finished=useRef(false);
  const recordAnswer=useCallback((answer)=>setAnswers((previous)=>{const next=[...previous];const old=previous[answer.screenIdx];next[answer.screenIdx]={...answer,firstTry:old?.firstTry===false?false:answer.firstTry};return next;}),[]);
  const finishLesson=useCallback(()=>{if(finished.current)return;finished.current=true;const scored=SCREEN_META.map((meta,index)=>meta.scored?index:null).filter((index)=>index!==null);const firstTryCorrect=scored.filter((index)=>answers[index]?.firstTry===true).length;const payload={lessonId:LESSON_META.lessonId,lessonTitle:LESSON_META.lessonTitle[lang],studentName:studentName||null,durationSec:Math.floor((Date.now()-started.current)/1000),totalQuestions:scored.length,correctAnswers:firstTryCorrect,scorePercent:Math.round(firstTryCorrect/scored.length*100),finalScore:firstTryCorrect,finalTotal:scored.length,passed:firstTryCorrect/scored.length>=0.6,firstTryStats:{total:scored.length,firstTryCorrect},attemptsTotal:scored.reduce((sum,index)=>sum+(answers[index]?.attempts??0),0),skillTags:LESSON_META.skillTags,answers:answers.filter(Boolean)};if(onFinished)onFinished(payload);else console.log('[Grade4 Dars16 preview]',payload);},[answers,lang,onFinished,studentName]);
  const Current=SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={`lesson-root ${preview?'lesson-root-preview':''}`}>{preview&&<div className="preview-language" aria-label="Preview language">{['ru','uz'].map((code)=><button type="button" key={code} className={previewLang===code?'preview-active':''} onClick={()=>setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={()=>setCurrent((value)=>Math.max(0,value-1))} onNext={()=>setCurrent((value)=>Math.min(TOTAL_SCREENS-1,value+1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
}

const STYLES=`
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:32px;height:32px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow-y:auto}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{display:grid;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:sticky;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.duel{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative}.duel .best{grid-column:1/-1;display:flex;justify-content:center;align-items:center;gap:14px;color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.duel .best b{color:${T.accent}}.bars-wrap{min-height:190px;position:relative;padding:12px 8px 8px}.bars-title{text-align:center;color:${T.navy};font-weight:900}.bars{height:150px;display:flex;align-items:flex-end;justify-content:center;gap:7px;border-bottom:2px solid rgba(23,59,82,.18)}.bar-col{width:min(42px,16%);height:140px;display:flex;align-items:flex-end}.bar{width:100%;min-height:22px;border-radius:10px 10px 4px 4px;display:grid;place-items:start center;padding-top:5px;color:#fff;background:linear-gradient(180deg,${T.cyan},${T.navy});transition:height .9s cubic-bezier(.16,1,.3,1)}.bar.equalized{background:linear-gradient(180deg,${T.lime},${T.success})}.bar b{font:900 11px 'JetBrains Mono',monospace}.target-line{position:absolute;left:7%;right:7%;height:2px;background:${T.accent};transition:.5s ease}.target-line span{position:absolute;right:0;bottom:5px;color:${T.accent};font:900 11px 'JetBrains Mono',monospace}.sum-badge.show,.mean-badge.show,.bridge.show,.show{opacity:1!important;transform:none!important}.sum-badge,.mean-badge{margin-top:8px;padding:10px 13px;border-radius:13px;opacity:.12;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;transition:.4s ease}.mean-badge{color:${T.success};background:${T.successSoft}}.formula-flow{min-height:190px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.formula-chip{padding:13px 15px;border-radius:15px;opacity:.12;transform:translateY(8px);color:${T.navy};background:${T.cyanSoft};font:900 clamp(15px,2.3vw,20px) 'JetBrains Mono',monospace;transition:.45s ease}.formula-flow i{opacity:.12;color:${T.accent};font:900 22px 'JetBrains Mono',monospace;font-style:normal;transition:.35s ease}.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.why-grid>div{min-height:170px;padding:18px;border-radius:18px;display:grid;place-items:center;gap:8px;opacity:.32;background:#F8F8F4}.why-grid>div.active{opacity:1}.why-grid s,.why-grid b{font:900 25px 'JetBrains Mono',monospace}.why-grid s{color:${T.warn}}.why-grid small{color:${T.ink2}}.why-grid .correct-tile{background:${T.successSoft};color:${T.success}}.compare-card{min-height:230px;display:grid;grid-template-columns:1fr 30px 1fr;align-items:center;gap:10px;text-align:center}.compare-card>div{padding:18px;border-radius:18px;display:grid;gap:8px;opacity:.12;background:${T.cyanSoft}}.compare-card span{color:${T.ink2};font-weight:800}.compare-card b{color:${T.navy};font:900 28px 'JetBrains Mono',monospace}.compare-card i{color:${T.accent};font-style:normal;font-weight:900}.compare-card>strong,.compare-card>p{grid-column:1/-1;opacity:.12}.compare-card>strong{color:${T.success};font:900 22px 'JetBrains Mono',monospace}.compare-card>p{font-weight:850}.rule-card{display:grid;gap:14px}.rule-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};text-align:center;font:800 clamp(14px,2.3vw,19px) 'JetBrains Mono',monospace}.rule-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.rule-steps>div{min-height:90px;padding:11px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;opacity:.18;background:#F8F8F4}.rule-steps>div.active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.2)}.rule-steps b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 11px 'JetBrains Mono',monospace}.rule-steps span{font-size:12px;font-weight:800;line-height:1.35}.boundary{display:grid;gap:18px}.number-line{height:80px;position:relative;margin:15px 4%;border-top:4px solid ${T.navy}}.number-line span,.number-line b{position:absolute;top:-19px;transform:translateX(-50%);width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 8px 18px -12px rgba(${T.shadowBase},.6);font:900 13px 'JetBrains Mono',monospace}.number-line b{opacity:.12;color:#fff;background:${T.accent}}.boundary>p{opacity:.12;color:${T.success};text-align:center;font-weight:850}.data-row{padding:14px;display:flex;justify-content:center;gap:8px}.data-row span{padding:12px 14px;border-radius:13px;color:${T.navy};background:${T.cyanSoft};font:900 17px 'JetBrains Mono',monospace}.input-row{display:flex;gap:10px}.answer-input{min-width:0;min-height:54px;flex:1;padding:10px 16px;border:0;border-radius:15px;outline:0;color:${T.navy};background:#F8F8F4;box-shadow:inset 0 0 0 2px rgba(135,148,157,.2);font:900 20px 'JetBrains Mono',monospace}.answer-input:focus{box-shadow:0 0 0 4px rgba(22,143,163,.14)}.answer-input.is-correct{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.3)}.answer-input.is-wrong{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.3)}.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace}.order-area{display:grid;gap:11px}.order-result{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-height:76px}.order-result>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:7px;background:${T.cyanSoft};font-size:11px;font-weight:800}.order-result b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.card-bank{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.card-bank button,.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;cursor:pointer;background:#F8F8F4;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.card-bank button:disabled{opacity:.35}.tiny-action{justify-self:end;color:${T.accent};background:${T.accentSoft}}.line-choice{padding:22px;display:flex;align-items:center;justify-content:center;gap:0}.line-choice span,.line-choice b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:${T.navy};background:${T.cyanSoft};font:900 15px 'JetBrains Mono',monospace}.line-choice b{color:#fff;background:${T.accent}}.line-choice i{width:90px;height:4px;background:linear-gradient(90deg,${T.cyan},${T.accent})}.bit-error{padding:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.bit-error span{padding:9px;border-radius:12px;background:${T.cyanSoft};text-align:center;font:900 14px 'JetBrains Mono',monospace}.bit-error b{grid-column:1/-1;padding:12px;border-radius:13px;color:${T.warn};background:${T.warnSoft};text-align:center;font:900 17px 'JetBrains Mono',monospace}.passengers{padding:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.passengers>div{padding:12px;border-radius:15px;display:grid;gap:6px;text-align:center;background:${T.cyanSoft}}.passengers span{color:${T.ink3};font-size:11px}.passengers b{color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.passengers strong{grid-column:1/-1;padding:11px;border-radius:13px;color:#fff;background:${T.navy};text-align:center;font:900 16px 'JetBrains Mono',monospace}.summary-grid{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:12px}.summary-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};font:900 clamp(15px,2.4vw,20px) 'JetBrains Mono',monospace;text-align:center}.summary-rules{grid-template-columns:repeat(4,1fr)}.bridge{padding:13px 16px;border-radius:16px;display:grid;gap:4px;opacity:.15;color:#fff;background:${T.navy}}.bridge span{color:#9DE3E7;font-size:10px;font-weight:900;letter-spacing:.08em}.bridge strong{font:750 16px 'Source Serif 4',Georgia,serif}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;color:${T.ink2};background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFFFFF;background:${T.accent}}.g1-bit-ant{transform-origin:60px 28px;animation:antenna 2.1s ease-in-out infinite}.g1-bit-wave,.bit-wave-left,.bit-wave-right,.bit-think-hand,.bit-point-arm,.bit-nod-hand{transform-origin:84px 76px;animation:think 1.7s ease-in-out infinite}.bit-double-wave,.bit-awkward-hands,.bit-focus-hands{transform-origin:center;animation:happy 1.2s ease-in-out infinite alternate}.bit-idea-bulb,.bit-point-target,.bit-focus-scan,.bit-nod-check{animation:pulse 1.35s ease-in-out infinite alternate}
.shape-model{min-height:205px;display:grid;place-items:center;padding:28px 42px}.shape-model-compact{min-height:132px;padding:18px 32px}.shape-model-compact .rect-shape{width:min(220px,58%);min-width:150px}.substitution-card .formula-flow{min-height:124px}.rect-shape{width:min(330px,72%);min-width:180px;position:relative;border:5px solid rgba(23,59,82,.2);background:rgba(22,143,163,.08);transition:.4s ease}.square-shape{width:min(230px,58%)}.rect-shape>span{position:absolute;min-width:34px;min-height:26px;padding:4px 7px;border-radius:9px;display:grid;place-items:center;opacity:.2;color:${T.navy};background:#fff;box-shadow:0 8px 18px -14px rgba(${T.shadowBase},.6);font:900 13px 'JetBrains Mono',monospace;transition:.35s ease}.rect-shape>span.edge-on{opacity:1;color:#fff;background:${T.accent}}.edge-top{left:50%;top:-20px;transform:translateX(-50%)}.edge-bottom{left:50%;bottom:-20px;transform:translateX(-50%)}.edge-right{right:-22px;top:50%;transform:translateY(-50%)}.edge-left{left:-22px;top:50%;transform:translateY(-50%)}.dimension-note,.formula-display,.master-formula{padding:12px 15px;border-radius:14px;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 clamp(14px,2.3vw,20px) 'JetBrains Mono',monospace}.formula-display,.master-formula{opacity:.12;transform:translateY(7px);transition:.4s ease}.accent-formula,.master-formula{color:#fff;background:${T.navy}}.two-methods,.formula-rule,.area-model,.summary-formulas{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.two-methods{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:14px}.two-methods>div:last-child{display:grid;gap:10px}.two-methods small{color:${T.success};text-align:center;font-weight:850}.formula-rule,.area-model{display:grid;gap:13px}.formula-rule>.shape-model,.area-model>.shape-model{min-height:170px;padding-block:23px}.letter-key{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.letter-key span{min-height:54px;padding:9px;border-radius:13px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:7px;opacity:.15;background:#F8F8F4;font-size:12px;font-weight:800}.letter-key b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 13px 'JetBrains Mono',monospace}.formula-rule p{opacity:.15;color:${T.success};text-align:center;font-weight:900}.square-rule .formula-flow{min-height:100px}.tile-grid{position:absolute;inset:0;display:grid}.tile-grid i{min-width:0;min-height:0;opacity:.12;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(23,59,82,.2);transition:.35s ease}.tile-grid i.tile-on{opacity:1;background:rgba(149,201,61,.54)}.measure-contrast{display:grid;grid-template-columns:1fr 1fr;gap:9px;opacity:.15}.measure-contrast span{padding:12px;border-radius:14px;text-align:center;font-weight:850}.measure-contrast span:first-child{color:${T.accent};background:${T.accentSoft}}.measure-contrast span:last-child{color:${T.success};background:${T.successSoft}}.matching{display:grid;gap:9px}.matching>div{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:10px;padding:9px;border-radius:14px;background:#F8F8F4}.matching span{font-size:12px;font-weight:850}.matching button{min-height:47px;border:0;border-radius:12px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;font:800 12px 'JetBrains Mono',monospace}.check-wide{justify-self:end}.park-model{position:relative;padding:8px 60px}.park-model .shape-model{min-height:170px}.park-model .rect-shape{background:repeating-linear-gradient(45deg,rgba(149,201,61,.46),rgba(149,201,61,.46) 12px,rgba(22,143,163,.18) 12px,rgba(22,143,163,.18) 24px)}.park-model>span,.park-model>b{position:absolute;color:${T.navy};font:900 14px 'JetBrains Mono',monospace}.park-model>span{left:50%;bottom:8px}.park-model>b{right:20px;top:50%}.summary-formulas{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.summary-formulas>div{min-height:112px;padding:13px;border-radius:16px;display:grid;place-items:center;gap:8px;opacity:.14;text-align:center;background:${T.cyanSoft}}.summary-formulas span{font-size:12px;font-weight:800}.summary-formulas b{color:${T.navy};font:900 15px 'JetBrains Mono',monospace}
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}
.finale-main{min-width:0;display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:11px 13px;border-radius:18px;display:grid;align-content:center;gap:7px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-concrete .shape-model{min-height:148px;padding:25px 36px}.finale-concrete .rect-shape{width:min(260px,72%)}.finale-hook-answer{min-width:0;padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:${T.ink2};background:#F8F8F4;text-align:center;font:900 12px/1.25 'JetBrains Mono',monospace;transition:.42s ease}.finale-hook-answer.show{opacity:1;transform:none}.finale-hook-answer b{color:${T.success}}
.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;display:grid;gap:2px;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.25;overflow-wrap:anywhere}.finale-takeaway span small{color:${T.cyan};font-size:8px;font-weight:900;text-transform:uppercase}.finale-takeaway span strong{font-weight:850}.finale-takeaway:nth-child(n+2) span strong{color:${T.navy};font-family:'JetBrains Mono',monospace}
.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}
.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{min-width:0;display:flex;align-items:center;gap:6px}.finale-status b{flex:none;color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{min-width:0;color:rgba(255,255,255,.72);font-size:8px;line-height:1.2}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:happy 2.8s ease-in-out infinite alternate}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear infinite}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes antenna{50%{transform:rotate(5deg)}}@keyframes think{50%{transform:rotate(-5deg) translateY(-2px)}}@keyframes happy{to{transform:translateY(-3px)}}@keyframes pulse{to{transform:scale(1.06)}}
@media(max-width:639.98px){.stage-header{padding-top:60px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:68px}.heading h1{font-size:26px}.heading .g1-char{width:66px;height:82px}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid,.two-methods,.formula-rule,.area-model,.summary-formulas{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.duel,.summary-grid,.two-methods{grid-template-columns:1fr}.bars-wrap{min-height:166px}.bars{height:126px}.bar-col{height:118px}.bar{transform:scaleY(.82);transform-origin:bottom}.why-grid{grid-template-columns:1fr}.compare-card{grid-template-columns:1fr 24px 1fr}.rule-steps,.summary-rules,.summary-formulas{grid-template-columns:1fr}.rule-steps>div{min-height:55px}.formula-flow{min-height:120px}.order-result{grid-template-columns:1fr}.input-row{flex-direction:column}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.passengers{grid-template-columns:1fr 1fr 1fr}.shape-model{min-height:165px;padding:25px 30px}.shape-model-compact{min-height:118px;padding:17px 26px}.shape-model-compact .rect-shape{width:min(205px,64%);min-width:140px}.substitution-card .formula-flow{min-height:105px;gap:6px}.substitution-card .formula-chip{padding:10px 11px;font-size:14px}.formula-rule>.shape-model,.area-model>.shape-model{min-height:145px}.letter-key{grid-template-columns:1fr}.measure-contrast,.matching>div{grid-template-columns:1fr}.summary-formulas>div{min-height:72px}.park-model{padding-inline:22px}.park-model .shape-model{min-height:145px}.park-model>b{right:2px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.formula-chip,.formula-flow i,.sum-badge,.mean-badge,.compare-card>div,.compare-card>strong,.compare-card>p,.boundary>p,.number-line b,.bridge,.formula-display,.master-formula,.letter-key span,.formula-rule p,.measure-contrast,.summary-formulas>div,.tile-grid i{opacity:1!important;transform:none!important}}
@media(max-width:639.98px){.finale-heading{padding:9px 11px}.finale-heading h1{font-size:21px}.finale-heading p{font-size:9px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-payoff{padding:9px 11px}.finale-concrete .shape-model{min-height:130px;padding:22px 30px}.finale-takeaway{min-height:38px;padding:6px 8px}.finale-reward{min-height:92px;padding:10px 62px 9px 51px}.finale-medal{left:9px;width:34px;height:34px}.finale-reward-bit{width:58px;height:74px}.finale-reward-copy>strong{font-size:14px}}
@media(max-width:639.98px){.stage-summary .stack{gap:9px}.stage-summary .finale-heading{padding:7px 9px}.stage-summary .finale-heading p{font-size:8.5px;line-height:1.25}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:8px}.stage-summary .finale-payoff{padding:7px 9px;gap:5px}.stage-summary .finale-concrete .shape-model{min-height:112px;padding:20px 26px}.stage-summary .finale-concrete .rect-shape{width:min(150px,56%);min-width:140px}.stage-summary .finale-hook-answer{padding:6px 8px}.stage-summary .finale-takeaways{gap:4px}.stage-summary .finale-takeaway{min-height:34px;padding:4px 7px;grid-template-columns:25px minmax(0,1fr);gap:6px}.stage-summary .finale-takeaway>b{width:24px;height:24px}.stage-summary .finale-takeaway span{font-size:10px;line-height:1.22}.stage-summary .finale-bridge{padding:8px 11px}.stage-summary .finale-bridge strong{font-size:13px}.stage-summary .finale-reward{min-height:80px;padding:8px 56px 7px 47px}.stage-summary .finale-medal{left:8px;width:30px;height:30px}.stage-summary .finale-reward-bit{width:52px;height:66px}.stage-summary .finale-reward-copy>strong{font-size:13px}.stage-summary .finale-status span{font-size:7.5px}}
@media(prefers-reduced-motion:reduce){.finale-takeaway,.finale-hook-answer,.finale-bridge{opacity:1!important;transform:none!important}}
`;
