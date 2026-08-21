// ============================================================================
// 4-SINF · 39-DARS AMALIYOTI · NUQTA KOORDINATALARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.9.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   mc · placepick · match · construct · slots · order · match · missing · placepick · slots
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q. Koordinata to'ri shu faylda
// yoziladi. CLAUDE.md §5 nusxa taqiqiga zid emas — LMS kontrakti majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// CHIZMA QOIDASI. Nuqta to'rda o'z HAQIQIY joyida turadi: x va y qiymatlaridan
// koordinatasi hisoblanadi. Shuning uchun 09-topshiriqda (3;8) va (8;3) ikki
// boshqa joyda ko'rinadi — tartib almashsa nuqta ko'chishini bola chizmadan
// ko'radi, matndan emas.
//
// `construct` kartalari faqat sonli: browser-solver kartani ko'rinadigan matni
// bo'yicha topadi, shuning uchun karta matni uch tilda bir xil bo'lishi shart.
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
    'Урок 39. Практика: координаты точки',
    '39-dars. Amaliyot: nuqta koordinatalari',
    'Lesson 39. Practice: coordinates of a point',
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
  slotHint: b(
    'Нажми строку, потом карточку для неё.',
    'Avval qatorni, keyin unga mos kartani bosing.',
    'Tap a row, then the card that belongs in it.',
  ),
  constructHint: b(
    'Нажимай карточки по порядку. Нажми занятое место, чтобы освободить его.',
    'Kartalarni tartib bilan bosing. Bo\'shatish uchun band joyni bosing.',
    'Tap the cards in order. Tap a filled place to clear it.',
  ),
  placeHint: b(
    'Нажми запись точки.',
    'Nuqta yozuvini bosing.',
    'Tap the record of the point.',
  ),
  emptyPlace: b('пусто', "bo'sh", 'empty'),
};

const LESSON_META = {
  lessonId: 'num-4-39-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 39,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'point-pick', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'record-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'slot-fill', type: 'practice', scored: true, scope: 'module-mikro' },
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
    id: '01', level: 'green', kind: 'mc', skillTag: 'read_the_pair',
    visual: { type: 'grid', points: [{ x: 6, y: 2 }] },
    setup: b(
      'На плане города отмечена одна точка.',
      'Shahar rejasida bitta nuqta belgilangan.',
      'One point is marked on the city plan.',
    ),
    prompt: b(
      'Как записывают эту точку?',
      'Bu nuqta qanday yoziladi?',
      'How is this point recorded?',
    ),
    options: [
      option('six-two', '(6; 2)', '(6; 2)', '(6; 2)', true),
      option('two-six', '(2; 6)', '(2; 6)', '(2; 6)', false,
        'Здесь координаты поменялись местами: первым идёт шаг по оси x.',
        "Bu yerda koordinatalar joy almashgan: birinchi bo'lib x o'qi bo'ylab qadam turadi.",
        'The coordinates have swapped places here: the step along the x-axis comes first.'),
      option('six-zero', '(6; 0)', '(6; 0)', '(6; 0)', false,
        'Ноль означал бы, что точка лежит на оси x, но она поднята выше.',
        "Nol nuqta x o'qida yotishini bildirardi, u esa yuqoriga ko'tarilgan.",
        'A zero would mean the point lies on the x-axis, but it is raised above it.'),
      option('zero-two', '(0; 2)', '(0; 2)', '(0; 2)', false,
        'Ноль по оси x означал бы, что точка стоит на оси y.',
        "x o'qi bo'yicha nol nuqta y o'qida turishini bildirardi.",
        'A zero along the x-axis would mean the point stands on the y-axis.'),
    ],
    secondHint: b(
      'Первое число — шаг вправо по оси x, второе — шаг вверх по оси y.',
      "Birinchi son — x o'qi bo'ylab o'ngga qadam, ikkinchisi — y o'qi bo'ylab yuqoriga qadam.",
      'The first number is the step right along the x-axis, the second the step up along the y-axis.',
    ),
    thirdHint: b(
      'От начала до точки шесть шагов вправо и два вверх.',
      'Boshdan nuqtagacha oltita qadam o\'ngga va ikkitasi yuqoriga.',
      'From the origin to the point it is six steps right and two up.',
    ),
    correctText: b(
      'Верно. Сначала x, потом y: (6; 2).',
      "To'g'ri. Avval x, keyin y: (6; 2).",
      'Correct. First x, then y: (6; 2).',
    ),
    rule: b(
      'В записи точки первое число всегда идёт по оси x.',
      "Nuqta yozuvida birinchi son har doim x o'qi bo'ylab boradi.",
      'In the record of a point the first number always goes along the x-axis.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'placepick', skillTag: 'place_the_point',
    visual: { type: 'grid', points: [{ x: 4, y: 7, mark: 'A' }, { x: 7, y: 4, mark: 'B' }, { x: 4, y: 4, mark: 'C' }, { x: 7, y: 7, mark: 'D' }] },
    setup: b(
      'На сетке отмечены четыре точки: A, B, C и D.',
      "To'rda to'rtta nuqta belgilangan: A, B, C va D.",
      'Four points are marked on the grid: A, B, C and D.',
    ),
    prompt: b(
      'Какая из точек имеет запись (4; 7)?',
      'Qaysi nuqtaning yozuvi (4; 7)?',
      'Which of the points has the record (4; 7)?',
    ),
    places: [
      { mark: 'A', label: b('(4; 7)', '(4; 7)', '(4; 7)'), correct: true },
      {
        mark: 'B', label: b('(7; 4)', '(7; 4)', '(7; 4)'),
        wrong: b(
          'Здесь координаты поменялись местами.',
          'Bu yerda koordinatalar joy almashgan.',
          'The coordinates have swapped places here.',
        ),
      },
      {
        mark: 'C', label: b('(4; 4)', '(4; 4)', '(4; 4)'),
        wrong: b(
          'У этой точки оба шага одинаковые, а нужен шаг вверх больше.',
          'Bu nuqtada ikkala qadam bir xil, kerakli qadam esa yuqoriga kattaroq.',
          'Both steps of this point are the same, but the step up must be larger.',
        ),
      },
      {
        mark: 'D', label: b('(7; 7)', '(7; 7)', '(7; 7)'),
        wrong: b(
          'Шаг по оси x здесь больше, чем нужно.',
          "x o'qi bo'ylab qadam bu yerda kerakligidan katta.",
          'The step along the x-axis is larger here than it should be.',
        ),
      },
    ],
    secondHint: b(
      'Считай сначала шаги вправо, потом шаги вверх.',
      "Avval o'ngga qadamlarni, keyin yuqoriga qadamlarni sanang.",
      'Count the steps right first, then the steps up.',
    ),
    thirdHint: b(
      'Нужны четыре шага вправо и семь вверх.',
      "To'rtta qadam o'ngga va yettita yuqoriga kerak.",
      'Four steps right and seven up are needed.',
    ),
    correctText: b(
      'Верно. Точка A стоит на (4; 7).',
      "To'g'ri. A nuqtasi (4; 7) da turadi.",
      'Correct. Point A stands at (4; 7).',
    ),
    rule: b(
      'Шаги считают от начала координат, а не от края сетки.',
      "Qadamlar koordinata boshidan sanaladi, to'r chetidan emas.",
      'Steps are counted from the origin, not from the edge of the grid.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'record_to_mark',
    visual: { type: 'grid', points: [{ x: 1, y: 6, mark: 'A' }, { x: 6, y: 1, mark: 'B' }, { x: 3, y: 3, mark: 'C' }] },
    setup: b(
      'Три объекта отмечены на сетке буквами A, B и C.',
      "Uchta obyekt to'rda A, B va C harflari bilan belgilangan.",
      'Three objects are marked on the grid with the letters A, B and C.',
    ),
    prompt: b(
      'Соедини запись с её точкой на сетке.',
      "Yozuvni to'rdagi nuqtasi bilan birlashtiring.",
      'Match each record with its point on the grid.',
    ),
    pairs: [
      { id: 'r16', left: b('(1; 6)', '(1; 6)', '(1; 6)'), correctRight: 'A' },
      { id: 'r61', left: b('(6; 1)', '(6; 1)', '(6; 1)'), correctRight: 'B' },
      { id: 'r33', left: b('(3; 3)', '(3; 3)', '(3; 3)'), correctRight: 'C' },
    ],
    right: [
      { id: 'A', text: b('A', 'A', 'A') },
      { id: 'B', text: b('B', 'B', 'B') },
      { id: 'C', text: b('C', 'C', 'C') },
    ],
    wrong: [b(
      'Две записи содержат те же числа, но в другом порядке: проверь, куда ведёт первое число.',
      "Ikki yozuvda xuddi shu sonlar bor, lekin boshqa tartibda: birinchi son qayerga olib borishini tekshiring.",
      'Two records hold the same numbers in a different order: check where the first number leads.',
    )],
    secondHint: b(
      'Первое число ведёт вправо, второе — вверх.',
      "Birinchi son o'ngga, ikkinchisi yuqoriga olib boradi.",
      'The first number leads right, the second up.',
    ),
    thirdHint: b(
      '(1; 6) стоит у левого края высоко, (6; 1) — справа низко.',
      "(1; 6) chap chetda yuqorida, (6; 1) esa o'ngda pastda turadi.",
      '(1; 6) is high near the left edge, while (6; 1) is low on the right.',
    ),
    correctText: b(
      'Верно. Один и тот же набор чисел даёт разные точки.',
      "To'g'ri. Bir xil sonlar to'plami boshqa-boshqa nuqtalarni beradi.",
      'Correct. The same pair of numbers gives different points.',
    ),
    rule: b(
      'Порядок чисел меняет место точки.',
      'Sonlar tartibi nuqtaning joyini o\'zgartiradi.',
      'The order of the numbers changes where the point is.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'construct', skillTag: 'build_the_record',
    slotCount: 2, answer: ['8', '3'],
    cards: [
      { id: 'c8', symbol: '8' },
      { id: 'c3', symbol: '3' },
      { id: 'c0', symbol: '0' },
      { id: 'c5', symbol: '5' },
    ],
    visual: { type: 'grid', points: [{ x: 8, y: 3 }] },
    setup: b(
      'Фонтан отмечен на сетке, но его запись ещё не составлена.',
      "Favvora to'rda belgilangan, lekin uning yozuvi hali tuzilmagan.",
      'The fountain is marked on the grid, but its record has not been written yet.',
    ),
    prompt: b(
      'Собери запись точки: сначала шаг по оси x, потом по оси y.',
      "Nuqta yozuvini yig'ing: avval x o'qi bo'ylab qadam, keyin y bo'ylab.",
      'Build the record of the point: the step along x first, then along y.',
    ),
    wrongBySequence: {
      38: b(
        'Порядок обратный: восемь шагов идут вправо, а не вверх.',
        "Tartib teskari: sakkizta qadam o'ngga boradi, yuqoriga emas.",
        'The order is reversed: the eight steps go right, not up.',
      ),
      80: b(
        'Ноль означал бы, что точка лежит на оси x, но она поднята выше.',
        "Nol nuqta x o'qida yotishini bildirardi, u esa yuqoriga ko'tarilgan.",
        'A zero would mean the point lies on the x-axis, but it is raised above it.',
      ),
      85: b(
        'Проверь, сколько шагов вверх от оси x до точки.',
        "x o'qidan nuqtagacha yuqoriga nechta qadam borligini tekshiring.",
        'Check how many steps up it is from the x-axis to the point.',
      ),
    },
    wrong: [b(
      'Сначала считают шаги вправо, потом шаги вверх.',
      "Avval o'ngga qadamlar, keyin yuqoriga qadamlar sanaladi.",
      'Count the steps right first, then the steps up.',
    )],
    secondHint: b(
      'Точка стоит далеко справа и невысоко.',
      "Nuqta o'ngda ancha uzoqda va baland emas.",
      'The point stands far to the right and not very high.',
    ),
    thirdHint: b(
      'Восемь шагов вправо и три вверх.',
      "Sakkizta qadam o'ngga va uchtasi yuqoriga.",
      'Eight steps right and three up.',
    ),
    correctText: b(
      'Верно. Запись фонтана — (8; 3).',
      "To'g'ri. Favvoraning yozuvi — (8; 3).",
      'Correct. The record of the fountain is (8; 3).',
    ),
    rule: b(
      'Запись собирают в одном порядке: сначала x, потом y.',
      "Yozuv bitta tartibda yig'iladi: avval x, keyin y.",
      'A record is built in one order: x first, then y.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'slots', skillTag: 'missing_coordinate',
    visual: { type: 'grid', points: [{ x: 7, y: 4 }], record: '( 7 ; □ )' },
    setup: b(
      'В журнале запись точки заполнена только наполовину: ( 7 ; □ ).',
      "Jurnalda nuqta yozuvi faqat yarmigacha to'ldirilgan: ( 7 ; □ ).",
      'In the log the record of the point is only half complete: ( 7 ; □ ).',
    ),
    prompt: b(
      'Какое число стоит на месте y?',
      'y o\'rnida qaysi son turadi?',
      'Which number belongs in the place of y?',
    ),
    slots: [
      {
        id: 'y', label: b('координата y', 'y koordinatasi', 'the y coordinate'), correct: 'c4',
        wrong: b(
          'Считай шаги вверх от оси x до точки, а не шаги вправо.',
          "x o'qidan nuqtagacha yuqoriga qadamlarni sanang, o'ngga qadamlarni emas.",
          'Count the steps up from the x-axis to the point, not the steps to the right.',
        ),
      },
    ],
    cards: [
      { id: 'c4', text: b('4', '4', '4') },
      { id: 'c7', text: b('7', '7', '7') },
      { id: 'c0', text: b('0', '0', '0') },
      { id: 'c1', text: b('1', '1', '1') },
    ],
    secondHint: b(
      'Число 7 уже занято: это шаг вправо.',
      "7 soni allaqachon band: bu o'ngga qadam.",
      'The number 7 is already taken: it is the step to the right.',
    ),
    thirdHint: b(
      'От оси x до точки четыре шага вверх.',
      "x o'qidan nuqtagacha to'rtta qadam yuqoriga.",
      'It is four steps up from the x-axis to the point.',
    ),
    correctText: b(
      'Верно. Полная запись точки — (7; 4).',
      "To'g'ri. Nuqtaning to'liq yozuvi — (7; 4).",
      'Correct. The full record of the point is (7; 4).',
    ),
    rule: b(
      'Вторая координата всегда считает шаги вверх.',
      'Ikkinchi koordinata har doim yuqoriga qadamlarni sanaydi.',
      'The second coordinate always counts the steps up.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'order', skillTag: 'walk_order',
    visual: { type: 'grid', points: [{ x: 6, y: 6 }], walk: { x: 6, y: 6 } },
    setup: b(
      'Фонтан ставят в точку (6; 6). Путь начинается от начала координат.',
      "Favvora (6; 6) nuqtasiga qo'yiladi. Yo'l koordinata boshidan boshlanadi.",
      'The fountain goes at the point (6; 6). The route starts from the origin.',
    ),
    prompt: b(
      'Расставь шаги пути по порядку.',
      'Yo\'l qadamlarini tartib bilan joylashtiring.',
      'Put the steps of the route in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'origin', text: b('Начало координат', 'Koordinata boshi', 'The origin'), order: 0 },
      { id: 'right', text: b('6 шагов вправо', "6 qadam o'ngga", '6 steps right'), order: 1 },
      { id: 'up', text: b('6 шагов вверх', '6 qadam yuqoriga', '6 steps up'), order: 2 },
      { id: 'mark', text: b('Отмечаем точку', 'Nuqtani belgilaymiz', 'Mark the point'), order: 3 },
    ],
    wrong: [b(
      'Путь начинается от начала координат, и первым идёт шаг по оси x.',
      "Yo'l koordinata boshidan boshlanadi va birinchi bo'lib x o'qi bo'ylab qadam turadi.",
      'The route starts from the origin, and the step along the x-axis comes first.',
    )],
    secondHint: b(
      'Даже когда числа одинаковые, порядок шагов остаётся тем же.',
      "Sonlar bir xil bo'lsa ham, qadamlar tartibi o'zgarmaydi.",
      'Even when the numbers are the same, the order of the steps stays the same.',
    ),
    thirdHint: b(
      'Начало, вправо, вверх, отметка.',
      'Bosh, o\'ngga, yuqoriga, belgi.',
      'Origin, right, up, mark.',
    ),
    correctText: b(
      'Верно. Порядок не зависит от того, равны числа или нет.',
      "To'g'ri. Tartib sonlar teng yoki teng emasligiga bog'liq emas.",
      'Correct. The order does not depend on whether the numbers are equal.',
    ),
    rule: b(
      'Отсчёт всегда начинается от начала координат и идёт сначала по x.',
      "Sanoq har doim koordinata boshidan boshlanadi va avval x bo'ylab boradi.",
      'Counting always starts at the origin and goes along x first.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'axis_points',
    visual: { type: 'grid', points: [{ x: 8, y: 0, mark: 'A' }, { x: 0, y: 7, mark: 'B' }, { x: 3, y: 0, mark: 'C' }] },
    setup: b(
      'Три объекта стоят прямо на осях.',
      "Uchta obyekt to'g'ridan-to'g'ri o'qlar ustida turadi.",
      'Three objects stand right on the axes.',
    ),
    prompt: b(
      'Соедини положение объекта с его записью.',
      'Obyektning joylashuvini uning yozuvi bilan birlashtiring.',
      'Match the position of each object with its record.',
    ),
    pairs: [
      {
        id: 'x8', left: b('на оси x, восьмой шаг', "x o'qida, sakkizinchi qadam", 'on the x-axis, eighth step'),
        correctRight: 'r80',
      },
      {
        id: 'y7', left: b('на оси y, седьмой шаг', "y o'qida, yettinchi qadam", 'on the y-axis, seventh step'),
        correctRight: 'r07',
      },
      {
        id: 'x3', left: b('на оси x, третий шаг', "x o'qida, uchinchi qadam", 'on the x-axis, third step'),
        correctRight: 'r30',
      },
    ],
    right: [
      { id: 'r80', text: b('(8; 0)', '(8; 0)', '(8; 0)') },
      { id: 'r07', text: b('(0; 7)', '(0; 7)', '(0; 7)') },
      { id: 'r30', text: b('(3; 0)', '(3; 0)', '(3; 0)') },
    ],
    wrong: [b(
      'Ноль показывает, что по этой оси шагов не было.',
      "Nol shu o'q bo'ylab qadam bo'lmaganini ko'rsatadi.",
      'A zero shows that there were no steps along that axis.',
    )],
    secondHint: b(
      'Если точка лежит на оси x, шага вверх не было.',
      "Nuqta x o'qida yotsa, yuqoriga qadam bo'lmagan.",
      'If a point lies on the x-axis, there was no step up.',
    ),
    thirdHint: b(
      'На оси x второе число равно нулю, на оси y — первое.',
      "x o'qida ikkinchi son nolga teng, y o'qida esa birinchisi.",
      'On the x-axis the second number is zero; on the y-axis the first one is.',
    ),
    correctText: b(
      'Верно. Ноль стоит на месте той оси, по которой шагов не было.',
      "To'g'ri. Nol qadam bo'lmagan o'q o'rnida turadi.",
      'Correct. The zero stands in the place of the axis with no steps.',
    ),
    rule: b(
      'Ноль в записи — это не пустое место, а отсутствие шага.',
      "Yozuvdagi nol — bo'sh joy emas, qadam yo'qligi.",
      'A zero in the record is not an empty space but the absence of a step.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'missing', skillTag: 'origin_boundary',
    visual: { type: 'grid', points: [{ x: 0, y: 0 }] },
    setup: b(
      'Диспетчерская стоит ровно в начале координат: ни одного шага ни вправо, ни вверх.',
      "Dispetcherlik xonasi aynan koordinata boshida turadi: na o'ngga, na yuqoriga bitta ham qadam yo'q.",
      'The control room stands exactly at the origin: not a single step right or up.',
    ),
    prompt: b(
      'Как записывают эту точку?',
      'Bu nuqta qanday yoziladi?',
      'How is this point recorded?',
    ),
    options: [
      option('zero-zero', '(0; 0)', '(0; 0)', '(0; 0)', true),
      option('one-one', '(1; 1)', '(1; 1)', '(1; 1)', false,
        'Единица означала бы один шаг, а здесь шагов нет вовсе.',
        "Bir soni bitta qadamni bildirardi, bu yerda esa qadam umuman yo'q.",
        'A one would mean one step, but here there are no steps at all.'),
      option('zero-one', '(0; 1)', '(0; 1)', '(0; 1)', false,
        'Один шаг вверх поднял бы точку с оси x.',
        "Bitta qadam yuqoriga nuqtani x o'qidan ko'tarardi.",
        'One step up would lift the point off the x-axis.'),
      option('impossible', 'записать нельзя', "yozib bo'lmaydi", 'it cannot be recorded', false,
        'Отсутствие шага записывают нулём, поэтому запись существует.',
        "Qadam yo'qligi nol bilan yoziladi, shuning uchun yozuv mavjud.",
        'The absence of a step is written as a zero, so the record does exist.'),
    ],
    secondHint: b(
      'Ноль обозначает, что шага не было.',
      "Nol qadam bo'lmaganini bildiradi.",
      'A zero shows that there was no step.',
    ),
    thirdHint: b(
      'Шагов нет ни по одной оси, значит оба числа нули.',
      "Hech bir o'q bo'ylab qadam yo'q, demak ikkala son ham nol.",
      'There are no steps along either axis, so both numbers are zeros.',
    ),
    correctText: b(
      'Верно. Начало координат записывают как (0; 0).',
      "To'g'ri. Koordinata boshi (0; 0) deb yoziladi.",
      'Correct. The origin is recorded as (0; 0).',
    ),
    rule: b(
      'Даже начало координат имеет запись из двух чисел.',
      'Koordinata boshining ham ikki sonli yozuvi bor.',
      'Even the origin has a record made of two numbers.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'placepick', skillTag: 'swap_error',
    visual: { type: 'grid', points: [{ x: 3, y: 8, mark: 'A' }, { x: 8, y: 3, mark: 'B', error: true }, { x: 3, y: 3, mark: 'C' }, { x: 8, y: 8, mark: 'D' }] },
    setup: b(
      'Фонтан должен был встать в точку (3; 8), а Бит поставил его в (8; 3). На сетке это точка B.',
      "Favvora (3; 8) nuqtasiga qo'yilishi kerak edi, Bit esa uni (8; 3) ga qo'ydi. To'rda bu B nuqtasi.",
      'The fountain should have gone at (3; 8), but Bit put it at (8; 3). On the grid that is point B.',
    ),
    prompt: b(
      'Какая точка была нужна?',
      'Qaysi nuqta kerak edi?',
      'Which point was the right one?',
    ),
    places: [
      { mark: 'A', label: b('(3; 8)', '(3; 8)', '(3; 8)'), correct: true },
      {
        mark: 'B', label: b('(8; 3)', '(8; 3)', '(8; 3)'),
        wrong: b(
          'Это как раз то место, куда Бит поставил фонтан по ошибке.',
          "Bu aynan Bit favvorani xato bilan qo'ygan joy.",
          'That is exactly where Bit put the fountain by mistake.',
        ),
      },
      {
        mark: 'C', label: b('(3; 3)', '(3; 3)', '(3; 3)'),
        wrong: b(
          'Первое число верное, но шаг вверх здесь слишком маленький.',
          "Birinchi son to'g'ri, lekin yuqoriga qadam bu yerda juda kichik.",
          'The first number is right, but the step up here is too small.',
        ),
      },
      {
        mark: 'D', label: b('(8; 8)', '(8; 8)', '(8; 8)'),
        wrong: b(
          'Здесь оба шага большие, а первый должен быть маленьким.',
          'Bu yerda ikkala qadam ham katta, birinchisi esa kichik bo\'lishi kerak.',
          'Both steps are large here, but the first one should be small.',
        ),
      },
    ],
    secondHint: b(
      'В верной записи первым идёт маленькое число.',
      "To'g'ri yozuvda birinchi bo'lib kichik son turadi.",
      'In the correct record the small number comes first.',
    ),
    thirdHint: b(
      'Три шага вправо и восемь вверх.',
      "Uchta qadam o'ngga va sakkiztasi yuqoriga.",
      'Three steps right and eight up.',
    ),
    correctText: b(
      'Верно. Точка A — это (3; 8), и она совсем не там, где (8; 3).',
      "To'g'ri. A nuqtasi — (3; 8) va u (8; 3) turgan joyda emas.",
      'Correct. Point A is (3; 8), and it is nowhere near (8; 3).',
    ),
    rule: b(
      'Перестановка координат переносит точку в другое место.',
      'Koordinatalarni almashtirish nuqtani boshqa joyga ko\'chiradi.',
      'Swapping the coordinates moves the point somewhere else.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'slots', skillTag: 'two_objects_apart',
    visual: { type: 'grid', points: [{ x: 1, y: 8, mark: 'A' }, { x: 8, y: 1, mark: 'B' }] },
    setup: b(
      'На плане две точки: A и B. Школа стоит в одном шаге от оси y и в восьми шагах от оси x.',
      "Rejada ikki nuqta bor: A va B. Maktab y o'qidan bir qadam va x o'qidan sakkiz qadam masofada turadi.",
      'The plan has two points, A and B. The school is one step from the y-axis and eight steps from the x-axis.',
    ),
    prompt: b(
      'Подпиши оба объекта.',
      'Ikkala obyektni imzolang.',
      'Label both objects.',
    ),
    slots: [
      {
        id: 'school', label: b('школа', 'maktab', 'the school'), correct: 'r18',
        wrong: b(
          'Один шаг вправо и восемь вверх: проверь, какое число идёт первым.',
          "Bir qadam o'ngga va sakkiz qadam yuqoriga: qaysi son birinchi turishini tekshiring.",
          'One step right and eight up: check which number comes first.',
        ),
      },
      {
        id: 'library', label: b('библиотека', 'kutubxona', 'the library'), correct: 'r81',
        wrong: b(
          'Вторая точка стоит на месте, где числа поменялись местами.',
          'Ikkinchi nuqta sonlar joy almashgan joyda turadi.',
          'The second point stands where the numbers have swapped places.',
        ),
      },
    ],
    cards: [
      { id: 'r18', text: b('(1; 8)', '(1; 8)', '(1; 8)') },
      { id: 'r81', text: b('(8; 1)', '(8; 1)', '(8; 1)') },
      { id: 'r11', text: b('(1; 1)', '(1; 1)', '(1; 1)') },
      { id: 'r88', text: b('(8; 8)', '(8; 8)', '(8; 8)') },
    ],
    secondHint: b(
      'Расстояние от оси y — это шаг вправо, то есть первое число.',
      "y o'qidan masofa — bu o'ngga qadam, ya'ni birinchi son.",
      'The distance from the y-axis is the step right, that is the first number.',
    ),
    thirdHint: b(
      'Школа — (1; 8), значит библиотеке остаётся (8; 1).',
      "Maktab — (1; 8), demak kutubxonaga (8; 1) qoladi.",
      'The school is (1; 8), so the library is left with (8; 1).',
    ),
    correctText: b(
      'Верно. Один и тот же набор чисел развёл два объекта по разным местам.',
      "To'g'ri. Bir xil sonlar to'plami ikki obyektni boshqa-boshqa joyga ajratdi.",
      'Correct. The same pair of numbers put the two objects in different places.',
    ),
    rule: b(
      'Две точки различают по порядку чисел, а не по самим числам.',
      'Ikki nuqta sonlar tartibi bilan farqlanadi, sonlarning o\'zi bilan emas.',
      'Two points are told apart by the order of the numbers, not by the numbers themselves.',
    ),
  },
];

const adaptive = (task, pickedOption, slotWrong, placeWrong, sequenceWrong, attempts) => {
  if (attempts >= 3) return task.thirdHint;
  if (attempts >= 2) return task.secondHint;
  if (pickedOption?.wrong) return pickedOption.wrong;
  if (sequenceWrong) return sequenceWrong;
  if (placeWrong) return placeWrong;
  if (slotWrong) return slotWrong;
  return task.wrong?.[0] || task.secondHint;
};

// ---------------------------------------------------------------------------
// CHIZMA. Koordinata burchagi: 0 dan 8 gacha o'qlar, birlik to'r va nuqtalar
// o'z haqiqiy joyida. Nuqta koordinatasi ma'lumotdan hisoblanadi, shuning
// uchun rasm bilan javob hech qachon ajralmaydi.
// ---------------------------------------------------------------------------
const MAX = 8;

function GridSvg({ visual, lang }) {
  const size = 22;
  const left = 26;
  const bottom = 26 + MAX * size;
  const px = (x) => left + x * size;
  const py = (y) => bottom - y * size;
  return (
    <svg className="p4-svg" viewBox={`0 0 ${left + MAX * size + 22} ${bottom + 26}`}
      role="img" aria-label={tx(visual.record ? b('координатный угол', 'koordinata burchagi', 'coordinate grid') : b('координатный угол', 'koordinata burchagi', 'coordinate grid'), lang)}>
      {Array.from({ length: MAX + 1 }, (_, index) => (
        <g key={`g${index}`}>
          <line x1={px(index)} y1={py(0)} x2={px(index)} y2={py(MAX)} stroke={T.cyanSoft} strokeWidth="1" />
          <line x1={px(0)} y1={py(index)} x2={px(MAX)} y2={py(index)} stroke={T.cyanSoft} strokeWidth="1" />
        </g>
      ))}
      <line x1={px(0)} y1={py(0)} x2={px(MAX) + 12} y2={py(0)} stroke={T.navy} strokeWidth="2" />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(MAX) - 12} stroke={T.navy} strokeWidth="2" />
      {[2, 4, 6, 8].map((value) => (
        <g key={`t${value}`}>
          <text x={px(value)} y={py(0) + 15} textAnchor="middle" className="p4-grid-label">{value}</text>
          <text x={px(0) - 9} y={py(value) + 4} textAnchor="middle" className="p4-grid-label">{value}</text>
        </g>
      ))}
      <text x={px(0) - 9} y={py(0) + 15} textAnchor="middle" className="p4-grid-label">0</text>
      <text x={px(MAX) + 16} y={py(0) + 5} className="p4-grid-axis">x</text>
      <text x={px(0) - 4} y={py(MAX) - 16} className="p4-grid-axis">y</text>
      {visual.walk && (
        <g>
          <line x1={px(0)} y1={py(0)} x2={px(visual.walk.x)} y2={py(0)} stroke={T.accent} strokeWidth="2.4" strokeDasharray="5 4" />
          <line x1={px(visual.walk.x)} y1={py(0)} x2={px(visual.walk.x)} y2={py(visual.walk.y)} stroke={T.accent} strokeWidth="2.4" strokeDasharray="5 4" />
        </g>
      )}
      {visual.points.map((point) => (
        <g key={`${point.x}-${point.y}`}>
          <circle cx={px(point.x)} cy={py(point.y)} r="4.6" fill={point.error ? T.warn : T.accent} />
          {point.mark && (
            <text x={px(point.x) + 8} y={py(point.y) - 6} className="p4-grid-mark">{point.mark}</text>
          )}
        </g>
      ))}
      {visual.record && (
        <text x={px(MAX) - 4} y={py(MAX) - 4} textAnchor="end" className="p4-grid-record">{visual.record}</text>
      )}
    </svg>
  );
}

function Visual({ task, lang }) {
  const visual = task.visual;
  if (!visual) return null;
  if (visual.type === 'grid') {
    return <div className="p4-visual"><GridSvg visual={visual} lang={lang} /></div>;
  }
  return null;
}

function Feedback({ ok, text, rule, lang, feedbackRef }) {
  return (
    <div ref={feedbackRef} className={`p4-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
      <p>{tx(text, lang)}</p>
      {ok && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
    </div>
  );
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [pickedId, setPickedId] = useState(null);
  const [place, setPlace] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [built, setBuilt] = useState([]);
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

  const symbolOf = (cardId) => task.cards?.find((card) => card.id === cardId)?.symbol;
  const builtSequence = built.map(symbolOf).join('');

  const answerReady = (() => {
    if (task.options) return pickedId !== null;
    if (task.kind === 'placepick') return place !== null;
    if (task.kind === 'construct') return built.length === task.slotCount;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'slots') return task.slots.every((slot) => placed[slot.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.options) return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'placepick') return task.places[place]?.correct === true;
    if (task.kind === 'construct') return built.map(symbolOf).join('|') === task.answer.join('|');
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'slots') return task.slots.every((slot) => placed[slot.id] === slot.correct);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false);
    setPickedId(null);
    setPlace(null);
    setPairs({});
    setActiveLeft(null);
    setPlaced({});
    setActiveCell(null);
    setBuilt([]);
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

  const pickedOption = task.options ? task.options.find((item) => item.id === pickedId) : null;
  const placeWrong = task.kind === 'placepick' && place !== null ? task.places[place]?.wrong : null;
  const slotWrong = task.kind === 'slots'
    ? task.slots.find((slot) => placed[slot.id] !== slot.correct)?.wrong
    : null;
  const sequenceWrong = task.kind === 'construct' ? task.wrongBySequence?.[builtSequence] : null;
  const cardText = (cardId) => tx(task.cards?.find((card) => card.id === cardId)?.text, lang);

  const studentAnswer = (() => {
    if (task.options) return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'placepick') return { placeIndex: place, mark: task.places[place]?.mark };
    if (task.kind === 'construct') return { sequence: built.map(symbolOf) };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'slots') return { slots: placed };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.options) {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'placepick') {
      const index = task.places.findIndex((item) => item.correct);
      return { placeIndex: index, mark: task.places[index].mark };
    }
    if (task.kind === 'construct') return { sequence: task.answer };
    if (task.kind === 'match') {
      return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    }
    if (task.kind === 'slots') {
      return { slots: Object.fromEntries(task.slots.map((slot) => [slot.id, slot.correct])) };
    }
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const optionClass = (item) => {
    if (pickedId !== item.id) return '';
    if (!checked) return 'is-on';
    return item.correct ? 'is-ok' : 'is-no';
  };

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(answerReady) && !solved && mode !== 'review'); },
    [answerReady, solved, mode, onReady]);
  const checkRef = useRef(check);
  useEffect(() => { checkRef.current = check; });
  useEffect(() => { registerCheck?.(() => checkRef.current?.()); }, [registerCheck]);
  const reportedRef = useRef(-1);
  useEffect(() => {
    if (!checked) return;
    if (reportedRef.current === attempts) return;
    reportedRef.current = attempts;
    (solved ? playCorrect : playWrong)?.();
    onSubmit?.({
      questionText: typeof task.prompt === 'object' ? task.prompt.uz : String(task.prompt ?? ''),
      correct: Boolean(solved),
      meta: { taskId: task.id, kind: task.kind, attempts: attempts },
    });
  }, [attempts, checked, solved, onSubmit, playCorrect, playWrong, task]);
  // ----------------------------------------------------------------------
  return (
    <section className="p4-task" aria-labelledby={`task-${task.id}`}>
      <p className={`p4-eyebrow is-${task.level}`}>
        <span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}
      </p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      <h2 id={`task-${task.id}`}>{tx(task.prompt, lang)}</h2>
      <Visual task={task} lang={lang} />

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

      {task.kind === 'placepick' && (
        <div className="p4-place-wrap">
          <p className="p4-note">{tx(UI.placeHint, lang)}</p>
          <div className="p4-place-grid">
            {task.places.map((item, index) => (
              <button type="button" key={item.mark} disabled={solved} aria-pressed={place === index}
                className={`p4-place ${place === index ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
                onClick={() => { checkingRef.current = false; setPlace(index); setChecked(false); }}>
                <span>{item.mark}</span>
                <small>{tx(item.label, lang)}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {task.kind === 'construct' && (
        <div className="p4-construct">
          <p className="p4-note">{tx(UI.constructHint, lang)}</p>
          <div className="p4-build-row" role="group" aria-label={tx(task.prompt, lang)}>
            {Array.from({ length: task.slotCount }, (_, index) => {
              const cardId = built[index];
              const state = checked && cardId
                ? (task.answer[index] === symbolOf(cardId) ? 'is-ok' : 'is-no')
                : '';
              return (
                <button type="button" key={index} className={`p4-build-slot ${cardId ? 'is-filled' : ''} ${state}`}
                  disabled={solved || !cardId}
                  aria-label={cardId ? `${index + 1}: ${symbolOf(cardId)}` : `${index + 1}: ${tx(UI.emptyPlace, lang)}`}
                  onClick={() => {
                    checkingRef.current = false;
                    setBuilt((old) => old.filter((_, position) => position !== index));
                    setChecked(false);
                  }}>
                  {cardId ? symbolOf(cardId) : '·'}
                </button>
              );
            })}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = built.includes(card.id);
              return (
                <button type="button" key={card.id} className={`p4-card ${used ? 'is-used' : ''}`}
                  disabled={solved || used || built.length >= task.slotCount}
                  onClick={() => {
                    checkingRef.current = false;
                    setBuilt((old) => (old.length >= task.slotCount ? old : [...old, card.id]));
                    setChecked(false);
                  }}>
                  {card.symbol}
                </button>
              );
            })}
          </div>
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

      {task.kind === 'slots' && (
        <div className="p4-slots">
          <p className="p4-note">{tx(UI.slotHint, lang)}</p>
          <div className="p4-slot-list">
            {task.slots.map((slot) => (
              <button type="button" key={slot.id} disabled={solved} aria-pressed={activeCell === slot.id}
                className={`p4-slot ${activeCell === slot.id ? 'is-active' : ''} ${placed[slot.id] ? 'is-tied' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveCell(slot.id); setChecked(false); }}>
                <small>{tx(slot.label, lang)}</small>
                <b>{placed[slot.id] ? cardText(placed[slot.id]) : '—'}</b>
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
          text={solved ? task.correctText : adaptive(task, pickedOption, slotWrong, placeWrong, sequenceWrong, attempts)} />
      )}

      {!platform && <div className="p4-actions">
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
                  : task.right ?? task.cards ?? task.places ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}>
            {tx(isLast ? UI.finish : UI.next, lang)}
          </button>
        )}
      </div>}
    </section>
  );
}

export default function Grade4Dars39Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(20px, 4.4vw, 30px)/1.25 'JetBrains Mono', monospace; }
.p4-svg { width: 100%; max-width: 260px; height: auto; }
.p4-grid-label { fill: ${T.ink3}; font: 700 9px 'JetBrains Mono', monospace; }
.p4-grid-axis { fill: ${T.navy}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-grid-mark { fill: ${T.navy}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-grid-record { fill: ${T.accent}; font: 800 12px 'JetBrains Mono', monospace; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-width: 44px; min-height: 56px; padding: 10px 12px; text-align: left; border: 1px solid rgba(23, 59, 82, .12); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font: 700 clamp(13px, 1.9vw, 15px)/1.35 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-letter { flex: 0 0 26px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 11px 'JetBrains Mono', monospace; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34, 122, 83, .4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169, 111, 19, .4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-place-wrap { display: grid; gap: 6px; }
.p4-place-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
.p4-place { display: grid; place-items: center; gap: 4px; min-width: 44px; min-height: 62px; padding: 7px 4px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; cursor: pointer; }
.p4-place span { font: 800 clamp(16px, 3.6vw, 21px) 'JetBrains Mono', monospace; }
.p4-place small { color: ${T.ink2}; font: 800 10.5px 'JetBrains Mono', monospace; }
.p4-place.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-place.is-ok { border-color: ${T.success}; background: ${T.successSoft}; }
.p4-place.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; }

.p4-construct { display: grid; gap: 7px; justify-items: center; }
.p4-build-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.p4-build-slot { min-width: 60px; min-height: 52px; border: 2px dashed rgba(23, 59, 82, .22); border-radius: 12px; background: #FBFBF8; color: ${T.ink3}; font: 800 clamp(15px, 3.2vw, 20px) 'JetBrains Mono', monospace; cursor: pointer; }
.p4-build-slot.is-filled { border-style: solid; border-color: ${T.cyan}; background: ${T.paper}; color: ${T.navy}; }
.p4-build-slot.is-ok { border-color: ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
.p4-build-slot.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; color: ${T.warn}; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button, .p4-slots button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(11.5px, 1.8vw, 13.5px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled), .p4-slots button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active, .p4-slots button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied, .p4-slots button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 11px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-slot-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button, .p4-slot { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small, .p4-slot small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b, .p4-slot b { font: 800 clamp(10.5px, 1.7vw, 12.5px)/1.2 'JetBrains Mono', monospace; text-align: center; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }
.p4-card { min-width: 48px; min-height: 46px; padding: 7px 11px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 800 13px 'JetBrains Mono', monospace; cursor: pointer; }

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
  .p4-place-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .p4-root > header { padding-top: 54px; }
}
@media (max-width: 640px) and (max-height: 700px) {
  .p4-root > header { padding: 40px 10px 3px !important; }
  .p4-root > main { padding: 1px 8px !important; }
  .p4-task { gap: 5px !important; }
  .p4-setup { font-size: 12px; line-height: 1.3; }
  .p4-task h2 { font-size: 16px !important; }
  .p4-visual { min-height: 76px !important; padding: 8px 10px !important; }
  .p4-svg { max-width: 200px; }
  .p4-options { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important; }
  .p4-option, .p4-match button, .p4-order button, .p4-slots button { min-height: 44px !important; padding: 5px 8px !important; font-size: 11.5px !important; }
  .p4-place { min-height: 52px !important; }
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
