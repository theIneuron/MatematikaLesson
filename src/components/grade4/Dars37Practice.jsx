// ============================================================================
// 4-SINF · 37-DARS AMALIYOTI · PERIMETR VA YUZA
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.7.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   sign · numpad · mc · shade · missing · order · match · mc · order · shade
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Maydon chizmasi shu faylda yoziladi.
// CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// CHIZMA QOIDASI. Ikki kattalik ikki xil ko'rinadi: perimetr — maydonning
// CHEGARASI qalin chiziq bilan, yuza — ichki SIRT bo'yalgan holda. Shundan
// bola farqni rasmdan ko'radi. 01-topshiriqda ikki maydon atayin bir xil
// perimetrga ega: perimetr teng bo'lsa ham yuza turlicha bo'lishini
// ko'rsatadi, lekin yuzalar chizmada yozilmaydi.
//
// `shade` MEXANIKASI. Tekshiruv faqat bo'yalgan kataklar SONINI solishtiradi,
// shuning uchun ikkala shade topshirig'i ham «nechta» savolini beradi.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
};

const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value
);

const UI = {
  title: b(
    'Урок 37. Практика: периметр и площадь',
    '37-dars. Amaliyot: perimetr va yuza',
    'Lesson 37. Practice: perimeter and area',
  ),
  language: b('Язык', 'Til', 'Language'),
  task: b('Задание', 'Topshiriq', 'Task'),
  level: {
    green: b('Базовое', 'Asosiy', 'Core'),
    yellow: b('Применение', "Qo'llash", 'Application'),
    red: b('Перенос', "Ko'chirish", 'Transfer'),
  },
  check: b('Проверить', 'Tekshirish', 'Check'),
  retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'),
  finish: b('Завершить', 'Yakunlash', 'Finish'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'),
  done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Наберите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b(
    'Нажми карточку слева, потом её пару справа.',
    "Chapdagi kartani bosing, keyin uning juftini o'ngdan tanlang.",
    'Tap a card on the left, then its match on the right.',
  ),
  orderHint: b(
    'Нажми место, потом карточку шага.',
    'Avval joyni, keyin qadam kartasini bosing.',
    'Tap a position, then a step card.',
  ),
  shadeHint: b(
    'Нажимай клетки. Нажми ещё раз, чтобы снять.',
    'Kataklarni bosing. Bekor qilish uchun yana bosing.',
    'Tap the squares. Tap again to clear one.',
  ),
  selected: b('выбрано', 'tanlandi', 'selected'),
  border: b('граница', 'chegara', 'border'),
  surface: b('поверхность', 'sirt', 'surface'),
};

const LESSON_META = {
  lessonId: 'num-4-37-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 37,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'cell-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const TASKS = [
  {
    id: '01', level: 'green', kind: 'sign', skillTag: 'equal_perimeter_trap',
    // Ikki maydon atayin bir xil perimetrga ega. Yuzalar chizmada yozilmaydi:
    // ular javobdan keyin qoidada ochiladi.
    visual: { type: 'plots', items: [{ w: 11, h: 23, mode: 'border' }, { w: 15, h: 19, mode: 'border' }] },
    setup: b(
      'Два участка: 11 м на 23 м и 15 м на 19 м. Вокруг каждого хотят поставить забор.',
      "Ikki maydon: 11 m ga 23 m va 15 m ga 19 m. Har birining atrofiga panjara qo'yilmoqchi.",
      'Two plots: 11 m by 23 m and 15 m by 19 m. A fence is to be put around each of them.',
    ),
    prompt: b(
      'Поставь знак: периметр первого участка □ периметр второго.',
      "Belgini qo'ying: birinchi maydonning perimetri □ ikkinchisining perimetri.",
      'Choose the sign: the perimeter of the first plot □ the perimeter of the second.',
    ),
    options: [
      option('equal', '=', '=', '=', true),
      option('less', '<', '<', '<', false,
        'Сложи стороны каждого участка: 11 и 23 дают ту же сумму, что 15 и 19.',
        "Har maydonning tomonlarini qo'shing: 11 va 23 ham, 15 va 19 ham bir xil yig'indi beradi.",
        'Add the sides of each plot: 11 and 23 give the same sum as 15 and 19.'),
      option('greater', '>', '>', '>', false,
        'Периметр считают по сумме сторон, а не по одной длинной стороне.',
        "Perimetr tomonlar yig'indisi bo'yicha hisoblanadi, bitta uzun tomon bo'yicha emas.",
        'A perimeter comes from the sum of the sides, not from one long side.'),
    ],
    secondHint: b(
      'Периметр — это сумма всех четырёх сторон.',
      "Perimetr — to'rtala tomonning yig'indisi.",
      'A perimeter is the sum of all four sides.',
    ),
    thirdHint: b(
      '(11 + 23) · 2 = 68 и (15 + 19) · 2 = 68.',
      '(11 + 23) · 2 = 68 va (15 + 19) · 2 = 68.',
      '(11 + 23) · 2 = 68 and (15 + 19) · 2 = 68.',
    ),
    correctText: b(
      'Верно. Оба периметра равны 68 м, но площади разные: 253 м² и 285 м².',
      "To'g'ri. Ikkala perimetr 68 m ga teng, lekin yuzalar har xil: 253 m² va 285 m².",
      'Correct. Both perimeters are 68 m, but the areas differ: 253 m² and 285 m².',
    ),
    rule: b(
      'Равные периметры не означают равные площади.',
      'Teng perimetrlar teng yuzani bildirmaydi.',
      'Equal perimeters do not mean equal areas.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'numpad', skillTag: 'rectangle_perimeter',
    answer: '78', maxLen: 3,
    visual: { type: 'plot', w: 22, h: 17, mode: 'border' },
    setup: b(
      'Участок 22 м на 17 м обносят забором по границе.',
      '22 m ga 17 m maydon chegarasi bo\'ylab panjara bilan o\'raladi.',
      'A plot 22 m by 17 m is being fenced along its border.',
    ),
    prompt: b(
      'Сколько метров забора нужно?',
      'Necha metr panjara kerak?',
      'How many metres of fence are needed?',
    ),
    wrongAnswers: {
      39: b(
        'Это сумма двух сторон. У участка их четыре.',
        "Bu ikki tomonning yig'indisi. Maydonda esa ular to'rtta.",
        'That is the sum of two sides. The plot has four.',
      ),
      374: b(
        'Это площадь: 22 умножили на 17. Забор идёт по границе.',
        "Bu yuza: 22 ni 17 ga ko'paytirgan. Panjara esa chegara bo'ylab boradi.",
        'That is the area: 22 times 17. The fence runs along the border.',
      ),
      44: b(
        'Посчитаны только две длинные стороны. Короткие тоже нужны.',
        'Faqat ikkita uzun tomon sanalgan. Qisqalari ham kerak.',
        'Only the two long sides were counted. The short ones are needed too.',
      ),
    },
    wrong: [b(
      'Сложи длину и ширину, а потом удвой сумму.',
      "Uzunlik va enni qo'shib, keyin yig'indini ikkilantiring.",
      'Add the length and the width, then double the sum.',
    )],
    secondHint: b(
      '22 + 17 = 39.',
      '22 + 17 = 39.',
      '22 + 17 = 39.',
    ),
    thirdHint: b(
      '39 умножить на 2 равно 78.',
      "39 ni 2 ga ko'paytirsak 78 bo'ladi.",
      '39 times 2 is 78.',
    ),
    correctText: b(
      'Верно. Периметр равен 78 м, и ответ в метрах.',
      "To'g'ri. Perimetr 78 m ga teng va javob metrda.",
      'Correct. The perimeter is 78 m, and the answer is in metres.',
    ),
    rule: b(
      'Периметр прямоугольника — сумма длины и ширины, взятая дважды.',
      "To'g'ri to'rtburchak perimetri — uzunlik va enning ikki karra yig'indisi.",
      'The perimeter of a rectangle is the length plus the width, taken twice.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'mc', skillTag: 'question_to_quantity',
    visual: { type: 'order-card', text: b('семена травы для газона', "gazon uchun o't urug'i", 'grass seed for the lawn') },
    setup: b(
      'В заказе на парк написано: семена травы для газона.',
      "Parkka buyurtmada shunday yozilgan: gazon uchun o't urug'i.",
      'The park order says: grass seed for the lawn.',
    ),
    prompt: b(
      'Какая величина участка нужна для этого заказа?',
      'Bu buyurtma uchun maydonning qaysi kattaligi kerak?',
      'Which measure of the plot does this order need?',
    ),
    options: [
      option('area', 'площадь', 'yuza', 'the area', true),
      option('perimeter', 'периметр', 'perimetr', 'the perimeter', false,
        'Периметр нужен для забора: он идёт по границе, а трава растёт на поверхности.',
        "Perimetr panjara uchun kerak: u chegara bo'ylab boradi, o't esa sirtda o'sadi.",
        'A perimeter is for a fence along the border, while grass grows on the surface.'),
      option('side', 'длина одной стороны', 'bitta tomonning uzunligi', 'the length of one side', false,
        'Одна сторона не показывает, сколько поверхности нужно засеять.',
        "Bitta tomon qancha sirtga urug' sepish kerakligini ko'rsatmaydi.",
        'One side does not show how much surface has to be sown.'),
      option('corners', 'число углов', 'burchaklar soni', 'the number of corners', false,
        'Число углов у любого прямоугольного участка одно и то же.',
        "Burchaklar soni har qanday to'g'ri to'rtburchak maydonda bir xil.",
        'The number of corners is the same for any rectangular plot.'),
    ],
    secondHint: b(
      'Спроси себя: заказ про границу или про поверхность?',
      "O'zingizdan so'rang: buyurtma chegara haqidami yoki sirt haqida?",
      'Ask yourself: is the order about the border or about the surface?',
    ),
    thirdHint: b(
      'Трава покрывает всю поверхность внутри границы.',
      "O't chegara ichidagi butun sirtni qoplaydi.",
      'Grass covers the whole surface inside the border.',
    ),
    correctText: b(
      'Верно. Газон занимает поверхность, а поверхность измеряют площадью.',
      "To'g'ri. Gazon sirtni egallaydi, sirt esa yuza bilan o'lchanadi.",
      'Correct. A lawn covers a surface, and a surface is measured by area.',
    ),
    rule: b(
      'Сначала читают вопрос, потом выбирают величину.',
      'Avval savol o\'qiladi, keyin kattalik tanlanadi.',
      'Read the question first, then choose the measure.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'shade', skillTag: 'area_by_cells',
    cellsCols: 5, cellsTotal: 20, selectCount: 5,
    visual: { type: 'grid-note', cols: 5, rows: 4 },
    setup: b(
      'Площадку разбили на клетки: пять клеток в ряд и четыре ряда.',
      "Maydon kataklarga bo'lindi: bir qatorda beshta katak, qator esa to'rtta.",
      'The site is divided into squares: five squares per row and four rows.',
    ),
    prompt: b(
      'Сколько клеток в одном ряду? Закрась столько клеток.',
      "Bitta qatorda nechta katak bor? Shuncha katakni bo'yang.",
      'How many squares are in one row? Shade that many squares.',
    ),
    wrong: [b(
      'Ряд — это одна полоска клеток, а не вся площадка.',
      'Qator — bu bitta katak yo\'lakchasi, butun maydon emas.',
      'A row is a single strip of squares, not the whole site.',
    )],
    secondHint: b(
      'В условии сказано: пять клеток в ряд.',
      'Shartda aytilgan: bir qatorda beshta katak.',
      'The task says: five squares per row.',
    ),
    thirdHint: b(
      'Закрась ровно пять клеток — столько их в одном ряду.',
      "Aynan beshta katakni bo'yang — bitta qatorda shuncha katak bor.",
      'Shade exactly five squares: that is how many one row has.',
    ),
    correctText: b(
      'Верно. В ряду 5 клеток, ряда 4, значит вся площадь равна 20 клеткам.',
      "To'g'ri. Qatorda 5 katak, qator 4 ta, demak butun yuza 20 katakka teng.",
      'Correct. A row has 5 squares and there are 4 rows, so the whole area is 20 squares.',
    ),
    rule: b(
      'Площадь считают так: клетки одного ряда умножают на число рядов.',
      "Yuza shunday hisoblanadi: bitta qatordagi kataklar qatorlar soniga ko'paytiriladi.",
      'To find an area, multiply the squares in one row by the number of rows.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'missing_side',
    answer: '23', maxLen: 3,
    visual: { type: 'plot', w: 11, h: null, mode: 'surface', area: 253 },
    setup: b(
      'Площадь участка 253 м², одна его сторона 11 м.',
      'Maydonning yuzasi 253 m², bir tomoni esa 11 m.',
      'The area of the plot is 253 m² and one of its sides is 11 m.',
    ),
    prompt: b(
      'Сколько метров вторая сторона?',
      'Ikkinchi tomon necha metr?',
      'How many metres is the other side?',
    ),
    wrongAnswers: {
      242: b(
        'Это разность 253 и 11. Площадь получается умножением, значит обратное действие — деление.',
        "Bu 253 va 11 ning ayirmasi. Yuza ko'paytirishdan chiqadi, demak teskari amal — bo'lish.",
        'That is 253 minus 11. An area comes from multiplying, so the inverse is dividing.',
      ),
      264: b(
        'Это сумма 253 и 11, а стороны с площадью так не связаны.',
        "Bu 253 va 11 ning yig'indisi, tomonlar esa yuza bilan bunday bog'lanmagan.",
        'That is 253 plus 11, but sides and area are not linked that way.',
      ),
      2783: b(
        'Это ещё одно умножение. Одна сторона уже известна, её ищут не заново.',
        "Bu yana bitta ko'paytirish. Bir tomon allaqachon ma'lum, u qaytadan qidirilmaydi.",
        'That is another multiplication. One side is already known and is not being looked for again.',
      ),
    },
    wrong: [b(
      'Площадь равна произведению сторон, поэтому вторую сторону находят делением.',
      "Yuza tomonlar ko'paytmasiga teng, shuning uchun ikkinchi tomon bo'lish bilan topiladi.",
      'The area equals the product of the sides, so the other side is found by dividing.',
    )],
    secondHint: b(
      '11 умножить на что-то даёт 253.',
      "11 ni biror songa ko'paytirsak 253 chiqadi.",
      '11 times something gives 253.',
    ),
    thirdHint: b(
      '253 разделить на 11 равно 23.',
      "253 ni 11 ga bo'lsak 23 bo'ladi.",
      '253 divided by 11 is 23.',
    ),
    correctText: b(
      'Верно. Вторая сторона 23 м: 11 · 23 = 253.',
      "To'g'ri. Ikkinchi tomon 23 m: 11 · 23 = 253.",
      'Correct. The other side is 23 m: 11 · 23 = 253.',
    ),
    rule: b(
      'Неизвестную сторону находят делением площади на известную сторону.',
      "Noma'lum tomon yuzani ma'lum tomonga bo'lish bilan topiladi.",
      'An unknown side is found by dividing the area by the known side.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'order', skillTag: 'order_the_two_lines',
    visual: { type: 'order-sheet', rows: 4 },
    setup: b(
      'В заказе на парк две строки: забор и газон. Участок 15 м на 19 м.',
      'Parkka buyurtmada ikki qator bor: panjara va gazon. Maydon 15 m ga 19 m.',
      'The park order has two lines: a fence and a lawn. The plot is 15 m by 19 m.',
    ),
    prompt: b(
      'Расставь строки заказа по порядку.',
      'Buyurtma qatorlarini tartib bilan joylashtiring.',
      'Put the order lines in the right sequence.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'fence-line', text: b('Забор — периметр', 'Panjara — perimetr', 'Fence — perimeter'), order: 0 },
      { id: 'fence-value', text: b('(15 + 19) · 2 = 68 м', '(15 + 19) · 2 = 68 m', '(15 + 19) · 2 = 68 m'), order: 1 },
      { id: 'lawn-line', text: b('Газон — площадь', 'Gazon — yuza', 'Lawn — area'), order: 2 },
      { id: 'lawn-value', text: b('15 · 19 = 285 м²', '15 · 19 = 285 m²', '15 · 19 = 285 m²'), order: 3 },
    ],
    wrong: [b(
      'Сначала называют величину, потом считают её. Действие идёт после вопроса.',
      'Avval kattalik nomlanadi, keyin u hisoblanadi. Amal savoldan keyin keladi.',
      'Name the measure first, then calculate it. The operation comes after the question.',
    )],
    secondHint: b(
      'Забор идёт по границе, газон покрывает поверхность.',
      "Panjara chegara bo'ylab boradi, gazon esa sirtni qoplaydi.",
      'The fence runs along the border and the lawn covers the surface.',
    ),
    thirdHint: b(
      'Периметр 68 м, площадь 285 м². Единицы разные.',
      'Perimetr 68 m, yuza 285 m². Birliklar har xil.',
      'The perimeter is 68 m and the area is 285 m². The units differ.',
    ),
    correctText: b(
      'Верно. Каждая строка получила свою величину и свою единицу.',
      "To'g'ri. Har qator o'z kattaligini va o'z birligini oldi.",
      'Correct. Each line got its own measure and its own unit.',
    ),
    rule: b(
      'Действие выбирают после того, как прочитан вопрос строки.',
      'Amal qator savoli o\'qilgandan keyin tanlanadi.',
      'The operation is chosen after the question of the line has been read.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'quantity_to_unit',
    visual: { type: 'plots', items: [{ w: 27, h: 27, mode: 'both' }, { w: 15, h: 19, mode: 'both' }] },
    setup: b(
      'Два участка: квадратный со стороной 27 м и прямоугольный 15 м на 19 м.',
      'Ikki maydon: tomoni 27 m bo\'lgan kvadrat va 15 m ga 19 m to\'g\'ri to\'rtburchak.',
      'Two plots: a square with a 27 m side and a rectangle 15 m by 19 m.',
    ),
    prompt: b(
      'Соедини каждую величину с её значением.',
      'Har bir kattalikni uning qiymati bilan birlashtiring.',
      'Match each measure with its value.',
    ),
    pairs: [
      { id: 'sq-border', left: b('квадрат: граница', 'kvadrat: chegara', 'square: border'), correctRight: '108-m' },
      { id: 'sq-surface', left: b('квадрат: поверхность', 'kvadrat: sirt', 'square: surface'), correctRight: '729-m2' },
      { id: 'rect-border', left: b('прямоугольник: граница', "to'g'ri to'rtburchak: chegara", 'rectangle: border'), correctRight: '68-m' },
      { id: 'rect-surface', left: b('прямоугольник: поверхность', "to'g'ri to'rtburchak: sirt", 'rectangle: surface'), correctRight: '285-m2' },
    ],
    right: [
      { id: '108-m', text: b('108 м', '108 m', '108 m') },
      { id: '729-m2', text: b('729 м²', '729 m²', '729 m²') },
      { id: '68-m', text: b('68 м', '68 m', '68 m') },
      { id: '285-m2', text: b('285 м²', '285 m²', '285 m²') },
    ],
    wrong: [b(
      'Единица сама подсказывает величину: метр — граница, квадратный метр — поверхность.',
      'Birlikning o\'zi kattalikni aytadi: metr — chegara, kvadrat metr — sirt.',
      'The unit itself tells you the measure: metres for the border, square metres for the surface.',
    )],
    secondHint: b(
      'Границу считают сложением сторон, поверхность — умножением.',
      "Chegara tomonlarni qo'shish bilan, sirt esa ko'paytirish bilan hisoblanadi.",
      'A border is found by adding the sides, a surface by multiplying them.',
    ),
    thirdHint: b(
      '27 · 4 = 108; 27 · 27 = 729; (15 + 19) · 2 = 68; 15 · 19 = 285.',
      '27 · 4 = 108; 27 · 27 = 729; (15 + 19) · 2 = 68; 15 · 19 = 285.',
      '27 · 4 = 108; 27 · 27 = 729; (15 + 19) · 2 = 68; 15 · 19 = 285.',
    ),
    correctText: b(
      'Верно. Единица ответа проверяет, ту ли величину посчитали.',
      "To'g'ri. Javob birligi qaysi kattalik hisoblanganini tekshiradi.",
      'Correct. The unit of the answer checks which measure was calculated.',
    ),
    rule: b(
      'Метр отвечает за границу, квадратный метр — за поверхность.',
      'Metr chegaraga, kvadrat metr esa sirtga javob beradi.',
      'A metre answers for the border and a square metre for the surface.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'square_perimeter_trap',
    visual: { type: 'plot', w: 35, h: 35, mode: 'border' },
    setup: b(
      'Квадратный участок со стороной 35 м обносят забором.',
      'Tomoni 35 m bo\'lgan kvadrat maydon panjara bilan o\'raladi.',
      'A square plot with a 35 m side is being fenced.',
    ),
    prompt: b(
      'Чему равен периметр участка?',
      'Maydonning perimetri qanchaga teng?',
      'What is the perimeter of the plot?',
    ),
    options: [
      option('one-forty', '140 м', '140 m', '140 m', true),
      option('seventy', '70 м', '70 m', '70 m', false,
        'Здесь сторона взята дважды, а у квадрата сторон четыре.',
        'Bu yerda tomon ikki marta olingan, kvadratda esa tomon to\'rtta.',
        'Here the side was taken twice, but a square has four sides.'),
      option('area', '1225 м²', '1225 m²', '1225 m²', false,
        'Это площадь: 35 умножили на 35. И единица квадратная, а забор измеряют в метрах.',
        "Bu yuza: 35 ni 35 ga ko'paytirgan. Birlik ham kvadrat, panjara esa metrda o'lchanadi.",
        'That is the area: 35 times 35. Its unit is square, but a fence is measured in metres.'),
      option('side', '35 м', '35 m', '35 m', false,
        'Это одна сторона, а забор идёт вокруг всего участка.',
        'Bu bitta tomon, panjara esa butun maydon atrofidan boradi.',
        'That is one side, but the fence goes all the way round the plot.'),
    ],
    secondHint: b(
      'У квадрата все четыре стороны одинаковые.',
      "Kvadratning to'rtala tomoni bir xil.",
      'All four sides of a square are the same.',
    ),
    thirdHint: b(
      '35 умножить на 4 равно 140.',
      "35 ni 4 ga ko'paytirsak 140 bo'ladi.",
      '35 times 4 is 140.',
    ),
    correctText: b(
      'Верно. Периметр квадрата равен стороне, взятой четыре раза: 140 м.',
      "To'g'ri. Kvadrat perimetri tomonning to'rt karrasiga teng: 140 m.",
      'Correct. The perimeter of a square is its side taken four times: 140 m.',
    ),
    rule: b(
      'Сторону умножают на четыре для периметра и саму на себя для площади.',
      "Perimetr uchun tomon to'rtga, yuza uchun esa o'ziga ko'paytiriladi.",
      'Multiply the side by four for the perimeter and by itself for the area.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'order', skillTag: 'repair_the_swap',
    visual: { type: 'order-sheet', rows: 4, error: true },
    setup: b(
      'Бит написал число периметра в обе строки заказа, и газона не хватило. Участок 22 м на 17 м.',
      "Bit perimetr sonini buyurtmaning ikkala qatoriga yozdi va gazon yetmadi. Maydon 22 m ga 17 m.",
      'Bit wrote the perimeter number in both order lines, and the lawn ran short. The plot is 22 m by 17 m.',
    ),
    prompt: b(
      'Расставь шаги исправления по порядку.',
      'Tuzatish qadamlarini tartib bilan joylashtiring.',
      'Put the correction steps in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'read', text: b('Читаем строку: газон', 'Qatorni o\'qiymiz: gazon', 'Read the line: lawn'), order: 0 },
      { id: 'quantity', text: b('Газон — это площадь', 'Gazon — bu yuza', 'The lawn means area'), order: 1 },
      { id: 'operation', text: b('22 · 17', '22 · 17', '22 · 17'), order: 2 },
      { id: 'value', text: b('374 м²', '374 m²', '374 m²'), order: 3 },
    ],
    wrong: [b(
      'Исправление начинается с вопроса строки, а не с готового числа.',
      'Tuzatish qator savolidan boshlanadi, tayyor sondan emas.',
      'The correction starts from the question of the line, not from a ready number.',
    )],
    secondHint: b(
      'Число 78 — это периметр. Для газона нужна другая величина.',
      '78 soni — perimetr. Gazon uchun boshqa kattalik kerak.',
      'The number 78 is the perimeter. The lawn needs a different measure.',
    ),
    thirdHint: b(
      '22 умножить на 17 равно 374, и единица квадратная.',
      "22 ni 17 ga ko'paytirsak 374 bo'ladi, birlik esa kvadrat.",
      '22 times 17 is 374, and the unit is square.',
    ),
    correctText: b(
      'Верно. Ошибка была в величине: строку газона считают площадью.',
      "To'g'ri. Xato kattalikda edi: gazon qatori yuza bilan hisoblanadi.",
      'Correct. The error was in the measure: the lawn line is calculated as an area.',
    ),
    rule: b(
      'Одно число не годится для двух разных величин.',
      'Bitta son ikki xil kattalik uchun yaramaydi.',
      'One number cannot serve two different measures.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'shade', skillTag: 'from_perimeter_to_area',
    cellsCols: 6, cellsTotal: 36, selectCount: 6,
    visual: { type: 'grid-note', cols: 6, rows: 6, fromPerimeter: 24 },
    setup: b(
      'Известна только граница: периметр квадратной площадки равен 24 клеткам.',
      'Faqat chegara ma\'lum: kvadrat maydonning perimetri 24 katakka teng.',
      'Only the border is known: the perimeter of the square site is 24 squares.',
    ),
    prompt: b(
      'Сколько клеток в одной стороне? Закрась столько клеток.',
      "Bitta tomonda nechta katak bor? Shuncha katakni bo'yang.",
      'How many squares are in one side? Shade that many squares.',
    ),
    wrong: [b(
      'У квадрата четыре одинаковые стороны, и вместе они дают 24 клетки.',
      "Kvadratning to'rtta bir xil tomoni bor va ular birgalikda 24 katak beradi.",
      'A square has four equal sides, and together they make 24 squares.',
    )],
    secondHint: b(
      'Раздели 24 на число сторон квадрата.',
      "24 ni kvadratning tomonlari soniga bo'ling.",
      'Divide 24 by the number of sides of a square.',
    ),
    thirdHint: b(
      '24 разделить на 4 равно 6.',
      "24 ni 4 ga bo'lsak 6 bo'ladi.",
      '24 divided by 4 is 6.',
    ),
    correctText: b(
      'Верно. Сторона равна 6 клеткам, значит площадь равна 36 клеткам.',
      "To'g'ri. Tomon 6 katakka teng, demak yuza 36 katakka teng.",
      'Correct. The side is 6 squares, so the area is 36 squares.',
    ),
    rule: b(
      'От периметра можно дойти до площади, но только через сторону.',
      'Perimetrdan yuzagacha yetish mumkin, lekin faqat tomon orqali.',
      'You can get from the perimeter to the area, but only through the side.',
    ),
  },
];

const adaptive = (task, pickedOption, typed, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (typed && task.wrongAnswers?.[typed]) return task.wrongAnswers[typed];
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMALAR. Ikki kattalik ikki xil ko'rinadi: `mode: 'border'` — chegara qalin
// chiziq, `mode: 'surface'` — ichki sirt bo'yalgan, `mode: 'both'` — ikkalasi.
// O'lchamlar ma'lumotdan chiqadi, shuning uchun imzo va rasm ajralmaydi.
// ---------------------------------------------------------------------------
const PlotSvg = ({ item, lang }) => {
  const scale = Math.min(112 / Math.max(item.w, item.h || item.w), 4.4);
  const w = item.w * scale;
  const h = (item.h ?? item.w) * scale;
  const surface = item.mode === 'surface' || item.mode === 'both';
  const border = item.mode === 'border' || item.mode === 'both';
  return (
    <svg className="p4-plot" viewBox={`0 0 ${w + 34} ${h + 32}`} aria-hidden="true">
      <rect x="17" y="9" width={w} height={h} rx="3"
        fill={surface ? T.cyanSoft : 'none'} stroke={border ? T.accent : T.cyan}
        strokeWidth={border ? 3.4 : 1.6} />
      <text x={17 + w / 2} y={h + 25} textAnchor="middle" className="p4-plot-label">{item.w}</text>
      <text x={9} y={9 + h / 2 + 4} textAnchor="middle" className="p4-plot-label">
        {item.h === null ? '?' : item.h}
      </text>
      {item.area && (
        <text x={17 + w / 2} y={9 + h / 2 + 4} textAnchor="middle" className="p4-plot-area">{item.area}</text>
      )}
      {border && !surface && (
        <text x={17 + w} y={5} textAnchor="end" className="p4-plot-tag">{tx(UI.border, lang)}</text>
      )}
      {surface && !border && (
        <text x={17 + w} y={5} textAnchor="end" className="p4-plot-tag">{tx(UI.surface, lang)}</text>
      )}
    </svg>
  );
};

function Visual({ task, lang, solved }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'plots') {
    return (
      <div className="p4-visual p4-visual-row">
        {visual.items.map((item, index) => (
          <span className="p4-plot-cell" key={index} style={{ animationDelay: `${index * 70}ms` }}>
            <PlotSvg item={item} lang={lang} />
          </span>
        ))}
      </div>
    );
  }

  if (visual.type === 'plot') {
    return (
      <div className="p4-visual">
        <PlotSvg item={visual} lang={lang} />
        {solved && visual.h === null && <b className="p4-reveal">{visual.area / visual.w}</b>}
      </div>
    );
  }

  if (visual.type === 'grid-note') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 260 104" role="img" aria-label={`${visual.cols} × ${visual.rows}`}>
          <rect x="12" y="10" width="236" height="72" rx="5" fill="none"
            stroke={visual.fromPerimeter ? T.accent : T.cyan} strokeWidth={visual.fromPerimeter ? 3.4 : 1.8} />
          {Array.from({ length: visual.cols - 1 }, (_, index) => (
            <line key={`c${index}`} x1={12 + ((index + 1) * 236) / visual.cols} y1="10"
              x2={12 + ((index + 1) * 236) / visual.cols} y2="82" stroke={T.cyan} strokeWidth="1" strokeDasharray="4 4" />
          ))}
          {Array.from({ length: visual.rows - 1 }, (_, index) => (
            <line key={`r${index}`} x1="12" y1={10 + ((index + 1) * 72) / visual.rows}
              x2="248" y2={10 + ((index + 1) * 72) / visual.rows} stroke={T.cyan} strokeWidth="1" strokeDasharray="4 4" />
          ))}
          <text x="130" y="98" textAnchor="middle" className="p4-plot-label">
            {visual.fromPerimeter ? `P = ${visual.fromPerimeter}` : `${visual.cols} × ${visual.rows}`}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.type === 'order-card') {
    return <div className="p4-visual"><span className="p4-order-card">{tx(visual.text, lang)}</span></div>;
  }

  if (visual.type === 'order-sheet') {
    return (
      <div className="p4-visual">
        <span className={`p4-form ${visual.error ? 'is-error' : ''}`}>
          {Array.from({ length: visual.rows }, (_, index) => <i key={index} style={{ animationDelay: `${index * 70}ms` }} />)}
        </span>
      </div>
    );
  }

  return null;
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <output className="p4-pad-display">{value || '—'}</output>
      <div className="p4-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button type="button" key={digit} disabled={disabled}
            onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>
            {digit}
          </button>
        ))}
        <button type="button" className="p4-key-del is-delete" disabled={disabled}
          aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>
          ⌫
        </button>
      </div>
    </div>
  );
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p>{tx(text, lang)}</p>
      {ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

function Task({ task, lang, isLast, onSolved, shuffleSeed }) {
  const [pickedId, setPickedId] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [selected, setSelected] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task kaliti atayin yangi aralashtirish beradi
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'shade') return selected.length > 0;
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'shade') return selected.length === task.selectCount;
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
    setTyped('');
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveCell(null);
    setSelected([]);
  };

  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const placeCard = (cardId) => {
    if (solved || activeCell === null) return;
    checkingRef.current = false;
    setPlaced((old) => {
      const next = { ...old };
      Object.keys(next).forEach((key) => { if (next[key] === cardId) delete next[key]; });
      next[activeCell] = cardId;
      return next;
    });
    setActiveCell(null);
    setChecked(false);
  };

  const toggleCell = (index) => {
    if (solved) return;
    checkingRef.current = false;
    setSelected((old) => (old.includes(index) ? old.filter((item) => item !== index) : [...old, index]));
    setChecked(false);
  };

  const pickedOption = task.options ? task.options.find((item) => item.id === pickedId) : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'shade') return { selectedCount: selected.length, selected: [...selected] };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    if (task.kind === 'shade') return { selectedCount: task.selectCount };
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const optionClass = (item) => {
    if (pickedId !== item.id) return '';
    if (!checked) return 'is-on';
    return item.correct ? 'is-ok' : 'is-no';
  };

  return (
    <section className="p4-task" aria-labelledby={`task-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}>
        <span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}
      </p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      <h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
      <Visual task={task} lang={lang} solved={solved} />

      {task.options && (
        <div className={task.kind === 'missing' ? 'p4-missing p4-options' : 'p4-options'}>
          {options.map((item, index) => (
            <button type="button" key={item.id} className={`p4-option ${optionClass(item)}`}
              disabled={solved} aria-pressed={pickedId === item.id}
              onClick={() => { checkingRef.current = false; setPickedId(item.id); setChecked(false); }}>
              <span className="p4-letter">{'ABCD'[index]}</span>
              {tx(item.text, lang)}
            </button>
          ))}
        </div>
      )}

      {(task.kind === 'numpad' || task.kind === 'missing') && !task.options && (
        <NumPad value={typed} max={task.maxLen} disabled={solved} lang={lang}
          onChange={(value) => { checkingRef.current = false; setTyped(value); setChecked(false); }} />
      )}

      {task.kind === 'shade' && (
        <div className="p4-shade">
          <p className="p4-note">{tx(UI.shadeHint, lang)}</p>
          <div className="p4-cells" style={{ gridTemplateColumns: `repeat(${task.cellsCols}, minmax(0, 1fr))` }}>
            {Array.from({ length: task.cellsTotal }, (_, index) => (
              <button type="button" key={index} disabled={solved}
                aria-pressed={selected.includes(index)} aria-label={String(index + 1)}
                className={selected.includes(index) ? (checked ? (solved ? 'is-ok' : 'is-no') : 'is-on') : ''}
                onClick={() => toggleCell(index)} />
            ))}
          </div>
          <p className="p4-note">{tx(UI.selected, lang)}: {selected.length}</p>
        </div>
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-grid">
            <section className="p4-match-col">
              {task.pairs.map((pair) => (
                <button type="button" key={pair.id} disabled={solved} aria-pressed={activeLeft === pair.id}
                  className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}>
                  {tx(pair.left, lang)}
                  {pairs[pair.id] && (
                    <small>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</small>
                  )}
                </button>
              ))}
            </section>
            <section className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button type="button" key={item.id} className={used ? 'is-used' : ''}
                    disabled={solved || activeLeft === null || used}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => ({ ...old, [activeLeft]: item.id }));
                      setActiveLeft(null);
                      setChecked(false);
                    }}>
                    {tx(item.text, lang)}
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button type="button" key={step.id} disabled={solved} aria-pressed={activeCell === step.id}
                className={activeCell === step.id ? 'is-active' : ''}
                onClick={() => { checkingRef.current = false; setActiveCell(step.id); setChecked(false); }}>
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? cardText(placed[step.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || activeCell === null || used} onClick={() => placeCard(card.id)}>
                  {tx(card.text, lang)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {checked && (
        <Feedback feedbackRef={feedbackRef} ok={solved} lang={lang} rule={task.rule}
          text={solved ? task.correctText : adaptive(task, pickedOption, typed, attempts)} />
      )}

      <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>
            {tx(UI.check, lang)}
          </button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost is-ghost" onClick={clearResponse}>
            {tx(UI.retry, lang)}
          </button>
        )}
        {solved && (
          <button type="button" className="p4-btn p4-btn-ready is-ready" disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id,
                taskNumber: Number(task.id),
                level: task.level,
                kind: task.kind,
                skillTag: task.skillTag,
                attempts,
                firstTry: attempts === 1,
                correct: true,
                setup: task.setup,
                prompt: task.prompt,
                studentAnswer,
                correctAnswer,
                answerChoices: task.options
                  ? options.map(({ id, text, correct }) => ({ id, text, correct }))
                  : task.right ?? task.cards ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}>
            {tx(isLast ? UI.finish : UI.next, lang)}
          </button>
        )}
      </div>
    </section>
  );
}

export default function Grade4Dars37Practice({ studentName, lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => { if (!startedAtRef.current) startedAtRef.current = Date.now(); }, []);

  const task = TASKS[index];
  const total = TASKS.length;
  const percent = Math.round(((finished ? total : index) / total) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== total - 1) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / total) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId,
      lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle,
      studentName: studentName || null,
      activityType: 'practice',
      completed: true,
      totalQuestions: total,
      answeredQuestions: total,
      correctAnswers: nextFirstTry,
      firstTryCorrect: nextFirstTry,
      scorePercent,
      finalScore: nextFirstTry,
      finalTotal: total,
      passed: nextFirstTry >= 6,
      firstTryStats: { total, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: total, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- davomiylik amaliyot yakunlanganda olinadi
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown,
      lessonMeta: LESSON_META,
      screenMeta: SCREEN_META,
      answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0);
    setAnswers([]);
    setFirstTry(0);
    setFinished(false);
    setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code}
              className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <header>
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)}
          aria-valuemin="0" aria-valuemax={total} aria-valuenow={finished ? total : index}>
          <i style={{ width: `${percent}%` }} />
        </div>
        <div>
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <b className="p4-counter">{finished ? total : index + 1} / {total}</b>
        </div>
      </header>

      <main>
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <strong>{firstTry}<small>/ {total}</small></strong>
            <p>{tx(UI.firstTry, lang)}</p>
            <p>{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task key={`${runId}-${task.id}`} task={task} lang={lang} isLast={index === total - 1}
            onSolved={onSolved} shuffleSeed={`${LESSON_META.lessonId}:${runId}`} />
        )}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root { position: relative; min-height: 100dvh; overflow-x: clip; padding: 0 0 24px; background: ${T.bg} !important; color: ${T.ink}; font-family: 'Manrope', system-ui, sans-serif; }
.p4-root *, .p4-root *::before, .p4-root *::after { box-sizing: border-box; }
.p4-root p, .p4-root h2 { margin: 0; }
.p4-root button:focus-visible { outline: 3px solid rgba(22, 143, 163, .45); outline-offset: 3px; }

.p4-lang { position: absolute; top: 8px; right: 8px; z-index: 9; display: flex; gap: 6px; }
.p4-lang button { min-width: 44px; min-height: 44px; padding: 0 10px; border: 0; border-radius: 99px; background: ${T.paper}; color: ${T.ink2}; font: 800 11px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 4px 12px -8px rgba(23, 59, 82, .4); }
.p4-lang button.is-active { background: ${T.accent}; color: #fff; }

.p4-root > header { padding: 46px clamp(12px, 4vw, 24px) 8px; }
.p4-root > header > div, .p4-root > main { width: min(720px, 100%) !important; margin-inline: auto; }
.p4-progress { height: 6px; border: 0; border-radius: 99px; background: rgba(23, 59, 82, .12); overflow: hidden; }
.p4-progress i { display: block; height: 100%; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); transition: width .4s ease; }
.p4-root > header > div:last-child { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 8px; }
.p4-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(15px, 2.4vw, 19px); }
.p4-counter { white-space: nowrap; font: 700 13px 'JetBrains Mono', monospace; color: ${T.ink3}; }

.p4-root > main { padding: 4px clamp(12px, 4vw, 24px); }
.p4-task { display: grid; gap: 12px; }
.p4-eyebrow, .p4-eyebrow.is-green, .p4-eyebrow.is-yellow, .p4-eyebrow.is-red { color: ${T.accent}; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.p4-setup { color: ${T.ink2}; font-size: clamp(14px, 2vw, 16px); line-height: 1.5; }
.p4-task h2 { font: 600 clamp(17px, 2.6vw, 21px)/1.25 'Source Serif 4', Georgia, serif; color: ${T.ink}; }
.p4-note { color: ${T.ink3}; font-size: 13px; }

.p4-visual { display: grid; place-items: center; gap: 8px; min-height: 108px; padding: 12px 10px; border-radius: 16px; background: ${T.paper} !important; box-shadow: inset 0 0 0 1px rgba(23, 59, 82, .08); overflow: hidden; }
.p4-visual-row { grid-auto-flow: column; grid-auto-columns: max-content; align-items: end; }
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 30px)/1.25 'JetBrains Mono', monospace; }
.p4-svg { width: 100%; max-width: 300px; height: auto; }
.p4-plot { width: clamp(96px, 24vw, 152px); height: auto; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-plot-cell { display: grid; justify-items: center; }
.p4-plot-label { fill: ${T.ink2}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-plot-area { fill: ${T.navy}; font: 800 12px 'JetBrains Mono', monospace; }
.p4-plot-tag { fill: ${T.ink3}; font: 800 9px 'Manrope', sans-serif; }
.p4-order-card { padding: 9px 13px; border-radius: 12px; background: ${T.cyanSoft}; color: ${T.navy}; font: 800 clamp(13px, 2.6vw, 17px)/1.3 'Manrope', sans-serif; text-align: center; }
.p4-form { display: grid; gap: 7px; }
.p4-form i { display: block; width: min(200px, 56vw); height: 15px; border-radius: 4px; background: rgba(23, 59, 82, .1); animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-form.is-error i { background: ${T.warnSoft}; box-shadow: inset 0 0 0 1px ${T.warn}; }
.p4-reveal { color: ${T.success}; font: 800 clamp(20px, 4.4vw, 28px) 'JetBrains Mono', monospace; animation: p4-rise .5s cubic-bezier(.22, 1.2, .36, 1) both; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(13px, 1.9vw, 15px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-shade { display: grid; gap: 6px; justify-items: center; }
.p4-cells { display: grid; gap: 5px; width: min(100%, 330px); }
.p4-cells button { min-width: 44px; min-height: 44px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 8px; background: ${T.paper}; cursor: pointer; transition: background .18s, border-color .18s; }
.p4-cells button:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-cells button.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-cells button.is-ok { border-color: ${T.success}; background: ${T.successSoft}; }
.p4-cells button.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(11.5px, 1.8vw, 13.5px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 11px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b { font: 800 clamp(10.5px, 1.7vw, 12.5px)/1.2 'Manrope', sans-serif; text-align: center; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 44px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 12px/1.25 'Manrope', sans-serif; cursor: pointer; }

.p4-pad { display: flex; flex-direction: column; align-items: center; gap: 8px; width: min(240px, 100%); margin: 0 auto; padding: 12px; border-radius: 18px; background: linear-gradient(155deg, #EDF1F3, #DDE4E8); box-shadow: inset 0 1px rgba(255, 255, 255, .9); }
.p4-pad-display { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 50px; padding: 8px; border: 2px solid ${T.accent}; border-radius: 13px; background: ${T.paper}; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 26px) 'JetBrains Mono', monospace; letter-spacing: 2px; }
.p4-pad-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; }
.p4-pad-keys button { min-width: 44px; min-height: 44px; border: 1px solid rgba(23, 59, 82, .16); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 clamp(18px, 3.6vw, 22px) 'JetBrains Mono', monospace; cursor: pointer; }
.p4-pad-keys button:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-pad-keys button.p4-key-del { background: ${T.accentSoft}; color: ${T.accent}; }

.p4-feedback { padding: 12px 14px; border-radius: 14px; line-height: 1.45; }
.p4-feedback.is-ok { background: ${T.successSoft}; color: #1B6644; box-shadow: inset 4px 0 0 ${T.success}; }
.p4-feedback.is-no { background: ${T.warnSoft}; color: #8A5C10; box-shadow: inset 4px 0 0 ${T.warn}; }
.p4-feedback p { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px, 2.1vw, 16px); }
.p4-feedback .p4-rule { margin-top: 5px; color: ${T.ink2}; }

.p4-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.p4-actions .p4-btn, .p4-done .p4-btn { min-width: 44px; min-height: 46px; padding: 10px 22px; border: 0; border-radius: 12px; background: ${T.paper}; color: ${T.accent}; font: 800 14px 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(255, 91, 53, .5), inset 0 0 0 1px rgba(255, 91, 53, .2); }
.p4-actions .p4-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.p4-actions button.p4-btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
.p4-actions button.p4-btn-ready, .p4-done button.p4-btn-ready { background: ${T.accent}; color: #fff; }

.p4-done { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 12px; text-align: center; }
.p4-done h2 { font: 600 clamp(19px, 3vw, 24px) 'Source Serif 4', Georgia, serif; }
.p4-done > strong { font: 800 clamp(32px, 7vw, 44px) 'JetBrains Mono', monospace; color: ${T.success}; }
.p4-done > strong small { font-size: 14px; color: ${T.ink3}; }
.p4-done p { color: ${T.ink2}; }

@keyframes p4-drop { 0% { opacity: 0; transform: translateY(-10px) scale(.86); } 70% { opacity: 1; transform: translateY(1px) scale(1.03); } 100% { opacity: 1; transform: none; } }
@keyframes p4-rise { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: none; } }

@media (max-width: 520px) {
  .p4-options { grid-template-columns: 1fr; }
  .p4-order-slots { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .p4-visual-row { grid-auto-flow: row; grid-auto-columns: auto; }
  .p4-root > header { padding-top: 54px; }
}
@media (max-width: 640px) and (max-height: 700px) {
  .p4-root > header { padding: 40px 10px 3px !important; }
  .p4-root > main { padding: 1px 8px !important; }
  .p4-task { gap: 5px !important; }
  .p4-setup { font-size: 12px; line-height: 1.3; }
  .p4-task h2 { font-size: 16px !important; }
  .p4-visual { min-height: 76px !important; padding: 8px 10px !important; }
  .p4-visual strong { font-size: 18px; }
  .p4-options { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important; }
  .p4-option, .p4-match button, .p4-order button { min-height: 44px !important; padding: 5px 8px !important; font-size: 11.5px !important; }
  .p4-actions .p4-btn, .p4-done .p4-btn { min-height: 44px !important; padding: 7px 14px; }
  .p4-feedback { padding: 8px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .p4-root *, .p4-root *::before, .p4-root *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
`;
