// ============================================================================
// 4-SINF · 50-DARS AMALIYOTI · GRAFIKLAR VA MA'LUMOTLAR
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §13.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   match · missing · numpad · ticks · missing · match · sort · ticks · order · sort
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars o'sish grafigi (yosh va bo'y) va to'rt oylik
// fabrika grafigi bilan ishlagan; bu yerda besh kunlik ishlab chiqarish
// diagrammasi va besh haftalik zaxira grafigi.
//
// MODEL: ustunli diagramma va chiziqli grafik. O'q imzolari MAJBURIY
// (METODIK_PROFIL_MATEMATIKA.md): bola nima o'lchanayotganini chizmadan
// o'qiydi. `ticks` topshiriqlarida bola qiymatni o'qning o'zida bosadi.
// 08-topshiriqda o'q noldan boshlanmaydi — bu chegaraviy holat.
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
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[normalizeLang(lang)] ?? '' : value);

const UI = {
  title: b('Урок 50. Практика: графики и данные', "50-dars. Amaliyot: grafiklar va ma'lumotlar", 'Lesson 50. Practice: graphs and data'),
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
  allSolved: b('Все 10 заданий решены.', "10 ta topshiriqning barchasi yechildi.", 'All 10 tasks have been solved.'),
  rule: b('Запомни', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Введи числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Стереть', "O'chirish", 'Delete'),
  matchHint: b('Выбери карточку слева, потом пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", 'Choose a card on the left, then its match on the right.'),
  orderHint: b('Выбери место, потом карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
  sortHint: b('Выбери карточку, потом группу.', 'Avval kartani, keyin guruhni tanlang.', 'Choose a card, then a group.'),
  tickHint: b('Нажми значение на вертикальной оси.', "Vertikal o'qdagi qiymatga bosing.", 'Tap a value on the vertical axis.'),
  returnCard: b('Вернуть карточку', 'Kartani qaytarish', 'Return the card'),
};

const LESSON_META = {
  lessonId: 'graph-4-50-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 50,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'axis-reading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'table-restore', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'sorting', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-axis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

// Blokning ma'lumotlari. Diagramma: besh kunlik ishlab chiqarish.
// Grafik: besh haftalik ombor zaxirasi.
const DAYS = [
  { id: 'mon', label: b('Пн', 'Du', 'Mon'), value: 30 },
  { id: 'tue', label: b('Вт', 'Se', 'Tue'), value: 45 },
  { id: 'wed', label: b('Ср', 'Ch', 'Wed'), value: 45 },
  { id: 'thu', label: b('Чт', 'Pa', 'Thu'), value: 60 },
  { id: 'fri', label: b('Пт', 'Ju', 'Fri'), value: 25 },
];

const WEEKS = [
  { id: 'w1', label: b('1', '1', '1'), value: 20 },
  { id: 'w2', label: b('2', '2', '2'), value: 35 },
  { id: 'w3', label: b('3', '3', '3'), value: 35 },
  { id: 'w4', label: b('4', '4', '4'), value: 50 },
  { id: 'w5', label: b('5', '5', '5'), value: 40 },
];

const AXIS_DAYS = b('дни', 'kunlar', 'days');
const AXIS_PANELS = b('панели', 'panellar', 'panels');
const AXIS_WEEKS = b('недели', 'haftalar', 'weeks');
const AXIS_STOCK = b('запас', 'zaxira', 'stock');

const TASKS = [
  {
    id: '01', level: 'green', kind: 'match', skillTag: 'read_axes',
    visual: { type: 'bars', bars: DAYS, min: 0, max: 60, step: 15, axisX: AXIS_DAYS, axisY: AXIS_PANELS },
    setup: b(
      'Экран мониторинга показывает выпуск панелей за пять дней.',
      "Monitoring ekrani besh kunlik panel ishlab chiqarishni ko'rsatadi.",
      'The monitoring screen shows the panel output over five days.',
    ),
    prompt: b('Соедини часть чертежа с тем, что она показывает.', 'Chizmaning qismini u ko\'rsatadigan narsa bilan ulang.', 'Match each part of the drawing to what it shows.'),
    pairs: [
      { id: 'x', left: b('Горизонтальная ось', "Gorizontal o'q", 'The horizontal axis'), correctRight: 'shows-days' },
      { id: 'y', left: b('Вертикальная ось', "Vertikal o'q", 'The vertical axis'), correctRight: 'shows-panels' },
      { id: 'bar', left: b('Высота столбца', 'Ustun balandligi', 'The height of a bar'), correctRight: 'shows-value' },
    ],
    right: [
      { id: 'shows-days', text: b('Дни недели', 'Hafta kunlari', 'The days of the week') },
      { id: 'shows-panels', text: b('Число панелей', 'Panellar soni', 'The number of panels') },
      { id: 'shows-value', text: b('Выпуск за этот день', "Shu kundagi ishlab chiqarish", 'The output on that day') },
    ],
    wrong: [b(
      'Смотри на подписи осей: они называют, что именно отложено.',
      "O'q imzolariga qarang: ular aynan nima joylashtirilganini aytadi.",
      'Look at the axis labels: they name exactly what is plotted.',
    )],
    secondHint: b(
      'Дни стоят внизу, а числа слева.',
      'Kunlar pastda, sonlar esa chapda turadi.',
      'The days are at the bottom and the numbers on the left.',
    ),
    thirdHint: b(
      'Шкала говорит не о дне и не о панелях, а о цене одного деления.',
      "Shkala kun yoki panel haqida emas, bir bo'linmaning qiymati haqida gapiradi.",
      'The scale is not about a day or panels: it is about the value of one interval.',
    ),
    correctText: b(
      'Верно. Чтение чертежа начинается с осей.',
      "To'g'ri. Chizmani o'qish o'qlardan boshlanadi.",
      'Correct. Reading a drawing starts with the axes.',
    ),
    rule: b(
      'Сначала читают оси, потом всё остальное.',
      "Avval o'qlar o'qiladi, keyin qolgani.",
      'First read the axes, then everything else.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'missing', skillTag: 'read_scale', answer: '30', maxLen: 3,
    visual: { compact: true, type: 'bars', bars: DAYS, min: 0, max: 60, step: 15, axisX: AXIS_DAYS, axisY: AXIS_PANELS, highlight: 'mon' },
    setup: b(
      'Выделен столбец понедельника.',
      'Dushanba ustuni ajratilgan.',
      'The bar for Monday is highlighted.',
    ),
    prompt: b(
      'Сколько панелей выпустили в понедельник?',
      'Dushanba kuni nechta panel ishlab chiqarilgan?',
      'How many panels were produced on Monday?',
    ),
    wrong: [b(
      'Считай не клетки, а значения на вертикальной оси.',
      "Kataklarni emas, vertikal o'qdagi qiymatlarni hisoblang.",
      'Count the values on the vertical axis, not the cells.',
    )],
    secondHint: b(
      'Столбец не доходит до 45, но выше 15.',
      'Ustun 45 gacha yetmaydi, lekin 15 dan yuqori.',
      'The bar does not reach 45 but is higher than 15.',
    ),
    thirdHint: b(
      'Верхний край столбца стоит ровно посередине между 15 и 45.',
      "Ustunning yuqori cheti 15 va 45 orasida aynan o'rtada turadi.",
      'The top of the bar is exactly halfway between 15 and 45.',
    ),
    correctText: b(
      'Верно. В понедельник выпустили 30 панелей.',
      "To'g'ri. Dushanba kuni 30 panel ishlab chiqarilgan.",
      'Correct. 30 panels were produced on Monday.',
    ),
    rule: b(
      'Значение столбца читают по вертикальной оси.',
      "Ustunning qiymati vertikal o'q bo'yicha o'qiladi.",
      'The value of a bar is read from the vertical axis.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'numpad', skillTag: 'difference_from_chart', answer: '35', maxLen: 3,
    visual: { compact: true, type: 'bars', bars: DAYS, min: 0, max: 60, step: 15, axisX: AXIS_DAYS, axisY: AXIS_PANELS },
    setup: b(
      'Сравниваем самый большой и самый маленький день.',
      'Eng katta va eng kichik kunni solishtiramiz.',
      'We compare the largest and the smallest day.',
    ),
    prompt: b(
      'На сколько панелей больше выпустили в лучший день, чем в худший?',
      'Eng yaxshi kunda eng past kundan nechta panel ko\'p ishlab chiqarilgan?',
      'How many more panels were produced on the best day than on the worst?',
    ),
    wrong: [b(
      'Сначала прочитай оба значения, потом найди разность.',
      'Avval ikki qiymatni o\'qing, keyin ayirmani toping.',
      'First read both values, then find the difference.',
    )],
    secondHint: b(
      'Самый высокий столбец — четверг, самый низкий — пятница.',
      'Eng baland ustun — payshanba, eng past — juma.',
      'The tallest bar is Thursday and the lowest is Friday.',
    ),
    thirdHint: b('60 − 25 = 35.', '60 − 25 = 35.', '60 − 25 = 35.'),
    correctText: b(
      'Верно. 60 − 25 = 35 панелей.',
      "To'g'ri. 60 − 25 = 35 panel.",
      'Correct. 60 − 25 = 35 panels.',
    ),
    rule: b(
      'Разность находят по прочитанным значениям, а не по высоте на глаз.',
      "Ayirma o'qilgan qiymatlardan topiladi, ko'zga chamalab emas.",
      'The difference is found from the values read, not by eye.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'ticks', skillTag: 'value_from_chart', answer: '45',
    visual: { type: 'bars', bars: DAYS, min: 0, max: 60, step: 15, axisX: AXIS_DAYS, axisY: AXIS_PANELS, highlight: 'wed' },
    setup: b(
      'Выделен столбец среды.',
      'Chorshanba ustuni ajratilgan.',
      'The bar for Wednesday is highlighted.',
    ),
    prompt: b(
      'Нажми на оси значение этого столбца.',
      "O'qda shu ustunning qiymatiga bosing.",
      'Tap the value of this bar on the axis.',
    ),
    wrong: [b(
      'Верхний край столбца показывает на одно из значений оси.',
      "Ustunning yuqori cheti o'qdagi qiymatlardan biriga ishora qiladi.",
      'The top of the bar points at one of the values on the axis.',
    )],
    secondHint: b(
      'Столбец среды такой же, как столбец вторника.',
      'Chorshanba ustuni seshanba ustuni bilan bir xil.',
      'The Wednesday bar is the same as the Tuesday bar.',
    ),
    thirdHint: b(
      'Оба столбца доходят ровно до третьего деления.',
      "Ikki ustun ham aynan uchinchi bo'linmagacha yetadi.",
      'Both bars reach exactly the third interval.',
    ),
    correctText: b(
      'Верно. В среду выпустили 45 панелей.',
      "To'g'ri. Chorshanba kuni 45 panel ishlab chiqarilgan.",
      'Correct. 45 panels were produced on Wednesday.',
    ),
    rule: b(
      'Значение читают там, где столбец заканчивается.',
      'Qiymat ustun tugagan joyda o\'qiladi.',
      'The value is read where the bar ends.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'chart_to_table', answer: '60', maxLen: 3,
    // Jadval gorizontal: kunlar ustun bo'lib turadi. Vertikal shaklda olti
    // qator chiqib, javob maydoni bilan birga ekranga sigmasdi.
    visual: {
      type: 'table',
      head: [b('День', 'Kun', 'Day'), b('Пн', 'Du', 'Mon'), b('Вт', 'Se', 'Tue'), b('Ср', 'Ch', 'Wed'), b('Чт', 'Pa', 'Thu'), b('Пт', 'Ju', 'Fri')],
      rows: [[b('Панели', 'Panellar', 'Panels'), '30', '45', '45', '?', '25']],
    },
    setup: b(
      'Таблицу заполняли по диаграмме, и одна клетка осталась пустой.',
      "Jadval diagramma bo'yicha to'ldirilgan va bitta katak bo'sh qolgan.",
      'The table was filled in from the chart and one cell was left empty.',
    ),
    prompt: b(
      'Какое число стоит в пустой клетке?',
      "Bo'sh katakda qaysi son turadi?",
      'Which number goes in the empty cell?',
    ),
    wrong: [b(
      'Это день с самым высоким столбцом на диаграмме.',
      'Bu diagrammadagi eng baland ustunli kun.',
      'This is the day with the tallest bar on the chart.',
    )],
    secondHint: b(
      'В четверг выпуск был больше, чем во все другие дни.',
      "Payshanba kuni ishlab chiqarish boshqa kunlardan ko'p bo'lgan.",
      'On Thursday the output was greater than on any other day.',
    ),
    thirdHint: b(
      'Столбец четверга доходит до самого верха шкалы.',
      'Payshanba ustuni shkalaning eng tepasiga yetadi.',
      'The Thursday bar reaches the very top of the scale.',
    ),
    correctText: b(
      'Верно. В четверг 60 панелей.',
      "To'g'ri. Payshanba kuni 60 panel.",
      'Correct. Thursday has 60 panels.',
    ),
    rule: b(
      'Таблица и диаграмма показывают одни и те же данные.',
      "Jadval va diagramma bir xil ma'lumotni ko'rsatadi.",
      'A table and a chart show the same data.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'match', skillTag: 'compare_bars',
    visual: { type: 'bars', bars: DAYS, min: 0, max: 60, step: 15, axisX: AXIS_DAYS, axisY: AXIS_PANELS },
    setup: b(
      'Четыре вопроса по одной и той же диаграмме.',
      "Bitta diagramma bo'yicha to'rt savol.",
      'Four questions about the same chart.',
    ),
    prompt: b('Соедини вопрос с ответом.', 'Savolni javob bilan ulang.', 'Match each question to its answer.'),
    pairs: [
      { id: 'most', left: b('Самый большой день', "Eng ko'p kun", 'The largest day'), correctRight: 'thursday' },
      { id: 'least', left: b('Самый маленький день', 'Eng kam kun', 'The smallest day'), correctRight: 'friday' },
      { id: 'equal', left: b('Дни с равным выпуском', 'Ishlab chiqarishi teng kunlar', 'The days with equal output'), correctRight: 'tue-wed' },
      { id: 'total', left: b('Всего за пять дней', 'Besh kunda jami', 'The total over five days'), correctRight: 'sum' },
    ],
    right: [
      { id: 'thursday', text: b('Четверг', 'Payshanba', 'Thursday') },
      { id: 'friday', text: b('Пятница', 'Juma', 'Friday') },
      { id: 'tue-wed', text: b('Вторник и среда', 'Seshanba va chorshanba', 'Tuesday and Wednesday') },
      { id: 'sum', text: b('205 панелей', '205 panel', '205 panels') },
    ],
    wrong: [b(
      'Для суммы читают все пять значений и складывают их.',
      "Yig'indi uchun besh qiymat o'qilib, qo'shiladi.",
      'For the total you read all five values and add them.',
    )],
    secondHint: b(
      'Равные дни имеют столбцы одной высоты.',
      'Teng kunlarning ustunlari bir balandlikda.',
      'Equal days have bars of the same height.',
    ),
    thirdHint: b(
      '30 + 45 + 45 + 60 + 25 = 205.',
      '30 + 45 + 45 + 60 + 25 = 205.',
      '30 + 45 + 45 + 60 + 25 = 205.',
    ),
    correctText: b(
      'Верно. Диаграмма отвечает на разные вопросы сразу.',
      "To'g'ri. Diagramma turli savollarga bir vaqtda javob beradi.",
      'Correct. A chart answers different questions at once.',
    ),
    rule: b(
      'Один чертёж даёт ответы на несколько вопросов.',
      'Bitta chizma bir nechta savolga javob beradi.',
      'One drawing gives answers to several questions.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'sort', skillTag: 'group_by_value',
    visual: { type: 'bars', bars: DAYS, min: 0, max: 60, step: 15, axisX: AXIS_DAYS, axisY: AXIS_PANELS },
    setup: b(
      'Сравниваем каждый день с числом 45.',
      'Har kunni 45 soni bilan solishtiramiz.',
      'We compare each day with the number 45.',
    ),
    prompt: b(
      'Разложи дни по сравнению с 45 панелями.',
      '45 panel bilan solishtirib kunlarni guruhlarga joylashtiring.',
      'Sort the days by comparison with 45 panels.',
    ),
    bins: [
      { id: 'less', label: b('Меньше 45', '45 dan kam', 'Less than 45') },
      { id: 'equal', label: b('Ровно 45', 'Aynan 45', 'Exactly 45') },
      { id: 'more', label: b('Больше 45', "45 dan ko'p", 'More than 45') },
    ],
    items: [
      { id: 'mon', bin: 'less', text: b('Понедельник', 'Dushanba', 'Monday') },
      { id: 'fri', bin: 'less', text: b('Пятница', 'Juma', 'Friday') },
      { id: 'tue', bin: 'equal', text: b('Вторник', 'Seshanba', 'Tuesday') },
      { id: 'wed', bin: 'equal', text: b('Среда', 'Chorshanba', 'Wednesday') },
      { id: 'thu', bin: 'more', text: b('Четверг', 'Payshanba', 'Thursday') },
    ],
    wrong: [b(
      'Сначала прочитай значение дня, потом сравни его с 45.',
      "Avval kunning qiymatini o'qing, keyin uni 45 bilan solishtiring.",
      'First read the value of the day, then compare it with 45.',
    )],
    secondHint: b(
      'Два дня стоят ровно на делении 45.',
      "Ikki kun aynan 45 bo'linmasida turadi.",
      'Two days stand exactly at the 45 mark.',
    ),
    thirdHint: b(
      'Только один день выше 45.',
      'Faqat bitta kun 45 dan yuqori.',
      'Only one day is above 45.',
    ),
    correctText: b(
      'Верно. Равные столбцы попадают в одну группу.',
      "To'g'ri. Teng ustunlar bitta guruhga tushadi.",
      'Correct. Equal bars fall into the same group.',
    ),
    rule: b(
      'Сравнение делают по прочитанным значениям.',
      "Taqqoslash o'qilgan qiymatlar bo'yicha bajariladi.",
      'A comparison is made from the values that have been read.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'ticks', skillTag: 'non_zero_axis', answer: '40',
    visual: {
      type: 'line', points: WEEKS, min: 20, max: 60, step: 10,
      axisX: AXIS_WEEKS, axisY: AXIS_STOCK, highlight: 'w5',
    },
    setup: b(
      'На этом графике вертикальная ось начинается с 20, а не с нуля.',
      "Bu grafikda vertikal o'q noldan emas, 20 dan boshlanadi.",
      'On this graph the vertical axis starts at 20, not at zero.',
    ),
    prompt: b(
      'Нажми на оси значение пятой недели.',
      "O'qda beshinchi haftaning qiymatiga bosing.",
      'Tap the value of the fifth week on the axis.',
    ),
    wrong: [b(
      'Считать нужно от начала оси, а не от низа чертежа.',
      "Sanash o'qning boshidan olib boriladi, chizmaning pastidan emas.",
      'Count from the start of the axis, not from the bottom of the drawing.',
    )],
    secondHint: b(
      'Первое деление оси — это 20, второе 30.',
      "O'qning birinchi bo'linmasi — 20, ikkinchisi 30.",
      'The first mark on the axis is 20 and the second is 30.',
    ),
    thirdHint: b(
      'Точка пятой недели стоит ниже точки четвёртой на одно деление.',
      "Beshinchi haftaning nuqtasi to'rtinchisidan bir bo'linma pastda turadi.",
      'The point for the fifth week is one interval below the fourth.',
    ),
    correctText: b(
      'Верно. Запас пятой недели равен 40.',
      "To'g'ri. Beshinchi haftaning zaxirasi 40 ga teng.",
      'Correct. The stock in the fifth week is 40.',
    ),
    rule: b(
      'Ось может начинаться не с нуля, и это нужно заметить до чтения.',
      "O'q noldan boshlanmasligi mumkin, buni o'qishdan oldin sezish kerak.",
      'An axis may not start at zero, and that has to be noticed before reading.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'order', skillTag: 'reading_order',
    setup: b(
      'Bit прочитал значение, не посмотрев на шкалу, и ошибся.',
      "Bit shkalaga qaramasdan qiymatni o'qidi va xato qildi.",
      'Bit read a value without looking at the scale and got it wrong.',
    ),
    prompt: b('Расставь шаги чтения чертежа по порядку.', 'Chizmani o\'qish qadamlarini tartib bilan joylashtiring.', 'Put the steps of reading a drawing in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'axes', text: b('Прочитать оси', "O'qlarni o'qish", 'Read the axes'), order: 0 },
      { id: 'scale', text: b('Определить шкалу', 'Shkalani aniqlash', 'Find the scale'), order: 1 },
      { id: 'find', text: b('Найти нужный столбец', 'Kerakli ustunni topish', 'Find the right bar'), order: 2 },
      { id: 'value', text: b('Назвать значение', 'Qiymatni aytish', 'State the value'), order: 3 },
    ],
    wrong: [b(
      'Значение называют последним, после шкалы и столбца.',
      "Qiymat oxirida, shkala va ustundan keyin aytiladi.",
      'The value is named last, after the scale and the bar.',
    )],
    secondHint: b(
      'Шкалу определяют до того, как ищут столбец.',
      'Shkala ustun izlashdan oldin aniqlanadi.',
      'The scale is found before looking for the bar.',
    ),
    thirdHint: b(
      'Первым делом смотрят, что отложено на осях.',
      "Birinchi navbatda o'qlarda nima joylashtirilgani ko'riladi.",
      'The first thing to look at is what is plotted on the axes.',
    ),
    correctText: b(
      'Верно. Оси, шкала, столбец, значение.',
      "To'g'ri. O'qlar, shkala, ustun, qiymat.",
      'Correct. Axes, scale, bar, value.',
    ),
    rule: b(
      'Пропуск шкалы — самая частая ошибка чтения чертежа.',
      "Shkalani o'tkazib yuborish — chizmani o'qishdagi eng ko'p uchraydigan xato.",
      'Skipping the scale is the most common error when reading a drawing.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'sort', skillTag: 'trend_transfer',
    visual: {
      type: 'line', points: WEEKS, min: 20, max: 60, step: 10,
      axisX: AXIS_WEEKS, axisY: AXIS_STOCK,
    },
    setup: b(
      'График показывает запас склада по неделям.',
      "Grafik ombor zaxirasini haftalar bo'yicha ko'rsatadi.",
      'The graph shows the warehouse stock week by week.',
    ),
    prompt: b(
      'Разложи промежутки по тому, как менялся запас.',
      "Oraliqlarni zaxira qanday o'zgarganiga qarab guruhlarga joylashtiring.",
      'Sort the intervals by how the stock changed.',
    ),
    bins: [
      { id: 'up', label: b('Вырос', "O'sdi", 'Went up') },
      { id: 'same', label: b('Не изменился', "O'zgarmadi", 'Stayed the same') },
      { id: 'down', label: b('Уменьшился', 'Kamaydi', 'Went down') },
    ],
    items: [
      { id: 'w1-w2', bin: 'up', text: b('1 → 2', '1 → 2', '1 → 2') },
      { id: 'w2-w3', bin: 'same', text: b('2 → 3', '2 → 3', '2 → 3') },
      { id: 'w3-w4', bin: 'up', text: b('3 → 4', '3 → 4', '3 → 4') },
      { id: 'w4-w5', bin: 'down', text: b('4 → 5', '4 → 5', '4 → 5') },
    ],
    wrong: [b(
      'Сравнивай два соседних значения, а не общий вид линии.',
      "Chiziqning umumiy ko'rinishini emas, ikki qo'shni qiymatni solishtiring.",
      'Compare two neighbouring values, not the general shape of the line.',
    )],
    secondHint: b(
      'Между второй и третьей неделей линия идёт ровно.',
      'Ikkinchi va uchinchi hafta orasida chiziq tekis boradi.',
      'Between the second and the third week the line runs level.',
    ),
    thirdHint: b(
      'Запас был 20, 35, 35, 50 и 40.',
      'Zaxira 20, 35, 35, 50 va 40 bo\'lgan.',
      'The stock was 20, 35, 35, 50 and 40.',
    ),
    correctText: b(
      'Верно. Вывод делают по каждой паре точек отдельно.',
      "To'g'ri. Xulosa har nuqtalar juftidan alohida chiqariladi.",
      'Correct. The conclusion is drawn from each pair of points separately.',
    ),
    rule: b(
      'Вывод по графику делают по конкретным значениям.',
      'Grafik bo\'yicha xulosa aniq qiymatlardan chiqariladi.',
      'A conclusion from a graph is drawn from the actual values.',
    ),
  },
];

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const adaptive = (task, pickedOption, attempts) => (
  attempts >= 3 ? task.thirdHint
    : attempts >= 2 ? task.secondHint
      : pickedOption?.wrong || task.wrong?.[0] || task.secondHint
);

// ---------------------------------------------------------------------------
// MODELLAR
// ---------------------------------------------------------------------------

// Vertikal o'q. `interactive` bo'lsa, qiymatlar tugmaga aylanadi: bola
// javobni o'qning o'zida ko'rsatadi.
// Qiymat o'qi. Har imzo O'Z setka chizig'iga aniq to'g'ri keladi: u foizda
// joylashtiriladi va yarim balandlikka ko'tariladi. Oldin space-between
// ishlatilgan va chetdagi imzolar chiziqdan siljib ketgan edi.
function ValueAxis({ min, max, step }) {
  const values = [];
  for (let value = max; value >= min; value -= step) values.push(value);
  return (
    <div className="p4-chart-values">
      {values.map((value) => (
        <div className="p4-chart-value" key={value} style={{ top: `${((max - value) / (max - min)) * 100}%` }}>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

// Javob qatori: o'qdagi qiymatlarning har biri alohida tugma. Tugmalar
// gorizontal joylashgani uchun 44 px teginish maydoni har doim saqlanadi.
function ValueStrip({ min, max, step, picked, onPick, disabled, lang }) {
  const values = [];
  for (let value = min; value <= max; value += step) values.push(value);
  return (
    <div className="p4-value-strip" role="group" aria-label={tx(UI.tickHint, lang)}>
      {values.map((value) => (
        <div className="p4-chart-value" key={value}>
          <button
            type="button"
            disabled={disabled}
            aria-label={String(value)}
            aria-pressed={picked === String(value)}
            className={picked === String(value) ? 'is-picked' : ''}
            onClick={() => onPick(String(value))}
          >{value}</button>
        </div>
      ))}
    </div>
  );
}

function BarChart({ visual, lang }) {
  const { bars, min, max, step, highlight } = visual;
  return (
    <div className={`p4-chart ${visual.compact ? 'is-compact' : ''}`}>
      <span className="p4-chart-axis-title is-y">{tx(visual.axisY, lang)}</span>
      <ValueAxis min={min} max={max} step={step} />
      <div className="p4-chart-plot">
        <div className="p4-chart-bars" style={{ '--p4-lines': (max - min) / step }}>
          {bars.map((bar) => (
            <div className="p4-chart-bar-slot" key={bar.id}>
              <div
                className={`p4-chart-bar ${highlight === bar.id ? 'is-lit' : ''}`}
                style={{ height: `${((bar.value - min) / (max - min)) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="p4-chart-labels">
          {bars.map((bar) => <span key={bar.id}>{tx(bar.label, lang)}</span>)}
        </div>
        <span className="p4-chart-axis-title is-x">{tx(visual.axisX, lang)}</span>
      </div>
    </div>
  );
}

function LineChart({ visual, lang }) {
  const { points, min, max, step, highlight } = visual;
  const position = (value) => 100 - ((value - min) / (max - min)) * 100;
  const coordinates = points.map((point, index) => ({
    point,
    x: (index / (points.length - 1)) * 100,
    y: position(point.value),
  }));
  return (
    <div className={`p4-chart ${visual.compact ? 'is-compact' : ''}`}>
      <span className="p4-chart-axis-title is-y">{tx(visual.axisY, lang)}</span>
      <ValueAxis min={min} max={max} step={step} />
      <div className="p4-chart-plot">
        <div className="p4-chart-line" style={{ '--p4-lines': (max - min) / step }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              points={coordinates.map((item) => `${item.x},${item.y}`).join(' ')}
              fill="none" stroke={T.cyan} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
            />
          </svg>
          {coordinates.map((item) => (
            <span
              key={item.point.id}
              className={`p4-chart-dot ${highlight === item.point.id ? 'is-lit' : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            />
          ))}
        </div>
        <div className="p4-chart-labels">
          {points.map((point) => <span key={point.id}>{tx(point.label, lang)}</span>)}
        </div>
        <span className="p4-chart-axis-title is-x">{tx(visual.axisX, lang)}</span>
      </div>
    </div>
  );
}

function TableModel({ visual, lang }) {
  return (
    <table className="p4-table">
      <thead>
        <tr>{visual.head.map((cell, index) => <th key={index}>{tx(cell, lang)}</th>)}</tr>
      </thead>
      <tbody>
        {visual.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={cell === '?' ? 'is-open' : ''}>{tx(cell, lang)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NumPad({ value, onChange, max, disabled, lang }) {
  return (
    <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
      <div className="p4-pad-display">{value || '—'}</div>
      <div className="p4-pad-keys">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button type="button" key={digit} disabled={disabled} onClick={() => onChange(value.length >= max ? value : `${value}${digit}`)}>{digit}</button>
        ))}
        <button type="button" className="is-delete" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => onChange(value.slice(0, -1))}>⌫</button>
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

// ---------------------------------------------------------------------------
// BITTA TOPSHIRIQ
// ---------------------------------------------------------------------------

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [activeToken, setActiveToken] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const checkingRef = useRef(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const options = useMemo(() => shuffle(task.options || []), [shuffleSeed, task.id, task.options, wrongRound]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const rightCards = useMemo(() => shuffle(task.right || []), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const bankCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const sortTokens = useMemo(() => shuffle(task.items || []), [shuffleSeed, task.id, task.items]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'ticks') return picked !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    if (task.kind === 'order') return task.steps.every((step) => placed[step.id]);
    return task.items.every((item) => assignments[item.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'ticks') return picked === task.answer;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    if (task.kind === 'order') return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
    return task.items.every((item) => assignments[item.id] === item.bin);
  };

  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setPicked(null); setTyped('');
    setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null);
    setAssignments({}); setActiveToken(null);
  };
  const setAnswer = (setter, value) => { checkingRef.current = false; setter(value); setChecked(false); };
  const check = () => {
    if (!answerReady || solved || checked || checkingRef.current) return;
    checkingRef.current = true;
    setAttempts((old) => old + 1);
    setChecked(true);
    if (answerCorrect()) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const studentAnswer = (() => {
    if (task.kind === 'ticks') return { value: picked };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'match') return { pairs };
    if (task.kind === 'order') return { order: task.steps.map((step) => placed[step.id]) };
    return { bins: assignments };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'ticks' || task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    if (task.kind === 'order') return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
    return { bins: Object.fromEntries(task.items.map((item) => [item.id, item.bin])) };
  })();

  const firstSortWrong = task.kind === 'sort' && checked && !solved
    ? task.items.find((item) => assignments[item.id] && assignments[item.id] !== item.bin)?.id
    : null;

  const cardText = (id) => tx(task.cards.find((card) => card.id === id)?.text, lang);
  const chartInteractive = task.kind === 'ticks';

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
    <section className={`p4-task ${hintLevel >= 2 ? 'is-hint' : ''}`} aria-labelledby={`task-${task.id}`}>
      <p className="p4-eyebrow"><span>{tx(UI.level[task.level], lang)}</span> · {tx(UI.task, lang)} {Number(task.id)}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>

      {task.visual?.type === 'bars' && (
        <div className="p4-visual"><BarChart visual={task.visual} lang={lang} /></div>
      )}
      {task.visual?.type === 'line' && (
        <div className="p4-visual"><LineChart visual={task.visual} lang={lang} /></div>
      )}
      {task.visual?.type === 'table' && <div className="p4-visual"><TableModel visual={task.visual} lang={lang} /></div>}

      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {chartInteractive && (
        <ValueStrip
          min={task.visual.min}
          max={task.visual.max}
          step={task.visual.step}
          picked={picked}
          onPick={(value) => setAnswer(setPicked, value)}
          disabled={solved}
          lang={lang}
        />
      )}

      {(task.kind === 'numpad' || task.kind === 'missing') && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 3} disabled={solved} lang={lang} />
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-cols">
            <div className="p4-match-col">
              {task.pairs.map((pair) => (
                <button
                  type="button"
                  key={pair.id}
                  disabled={solved}
                  aria-pressed={activeLeft === pair.id}
                  className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}`}
                  onClick={() => { checkingRef.current = false; setActiveLeft(pair.id); setChecked(false); }}
                >
                  <span>{tx(pair.left, lang)}</span>
                  {pairs[pair.id] && <b>{tx(task.right.find((item) => item.id === pairs[pair.id])?.text, lang)}</b>}
                </button>
              ))}
            </div>
            <div className="p4-match-col">
              {rightCards.map((item) => {
                const used = Object.values(pairs).includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    disabled={solved || activeLeft === null || used}
                    className={`p4-match-item ${used ? 'is-used' : ''}`}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => ({ ...old, [activeLeft]: item.id }));
                      setActiveLeft(null);
                      setChecked(false);
                    }}
                  >{tx(item.text, lang)}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {task.kind === 'order' && (
        <div className="p4-order">
          <p className="p4-note">{tx(UI.orderHint, lang)}</p>
          <div className="p4-order-slots">
            {task.steps.map((step) => (
              <button
                type="button"
                key={step.id}
                disabled={solved}
                aria-pressed={activeStep === step.id}
                className={`p4-order-slot ${activeStep === step.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveStep(step.id); setChecked(false); }}
              >
                <small>{tx(step.label, lang)}</small>
                <b>{placed[step.id] ? cardText(placed[step.id]) : '—'}</b>
              </button>
            ))}
          </div>
          <div className="p4-card-bank">
            {bankCards.map((card) => {
              const used = Object.values(placed).includes(card.id);
              return (
                <button
                  type="button"
                  key={card.id}
                  disabled={solved || activeStep === null || used}
                  className={`p4-card ${used ? 'is-used' : ''}`}
                  onClick={() => {
                    checkingRef.current = false;
                    setPlaced((old) => ({ ...old, [activeStep]: card.id }));
                    setActiveStep(null);
                    setChecked(false);
                  }}
                >{tx(card.text, lang)}</button>
              );
            })}
          </div>
        </div>
      )}

      {task.kind === 'sort' && (
        <div className="p4-sort">
          <p className="p4-note">{tx(UI.sortHint, lang)}</p>
          <div className="p4-sort-pool">
            {sortTokens.filter((item) => !assignments[item.id]).map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={solved}
                aria-pressed={activeToken === item.id}
                className={`p4-sort-token ${activeToken === item.id ? 'is-active' : ''}`}
                onClick={() => { checkingRef.current = false; setActiveToken(item.id); setChecked(false); }}
              >{tx(item.text, lang)}</button>
            ))}
            {sortTokens.every((item) => assignments[item.id]) && <span className="p4-pool-done">✓</span>}
          </div>
          <div className="p4-sort-bins">
            {task.bins.map((bin) => (
              <div className="p4-sort-bin" key={bin.id}>
                <button
                  type="button"
                  className="p4-sort-bin-head"
                  disabled={solved || activeToken === null}
                  onClick={() => {
                    if (activeToken === null) return;
                    checkingRef.current = false;
                    setAssignments((old) => ({ ...old, [activeToken]: bin.id }));
                    setActiveToken(null);
                    setChecked(false);
                  }}
                >{tx(bin.label, lang)}</button>
                <div className="p4-sort-bin-items">
                  {sortTokens.filter((item) => assignments[item.id] === bin.id).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      disabled={solved}
                      className={`p4-sort-token is-placed ${firstSortWrong === item.id ? 'is-no' : ''}`}
                      aria-label={`${tx(UI.returnCard, lang)} ${tx(item.text, lang)}`}
                      onClick={() => {
                        checkingRef.current = false;
                        setAssignments((old) => {
                          const next = { ...old };
                          delete next[item.id];
                          return next;
                        });
                        setActiveToken(item.id);
                        setChecked(false);
                      }}
                    >{tx(item.text, lang)}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checked && (
        <Feedback
          feedbackRef={feedbackRef}
          ok={solved}
          text={solved ? task.correctText : adaptive(task, null, attempts)}
          rule={task.rule}
          lang={lang}
        />
      )}

      {!platform && <div className="p4-actions">
        {!checked && !solved && (
          <button type="button" className="p4-btn" disabled={!answerReady} onClick={check}>{tx(UI.check, lang)}</button>
        )}
        {checked && !solved && (
          <button type="button" className="p4-btn p4-btn-ghost" onClick={clearResponse}>{tx(UI.retry, lang)}</button>
        )}
        {solved && (
          <button
            type="button"
            className="p4-btn p4-btn-ready"
            disabled={advancing}
            onClick={() => {
              if (advancedRef.current) return;
              advancedRef.current = true;
              checkingRef.current = false;
              setAdvancing(true);
              onSolved({
                taskId: task.id, taskNumber: Number(task.id), level: task.level, kind: task.kind,
                skillTag: task.skillTag, attempts, firstTry: attempts === 1, correct: true,
                setup: task.setup, prompt: task.prompt, studentAnswer, correctAnswer,
                answerChoices: options.length
                  ? options.map(({ id, text, correct }) => ({ id, text, correct: Boolean(correct) }))
                  : task.right ?? task.cards ?? task.items ?? null,
                screenMeta: SCREEN_META.find((screen) => screen.taskId === task.id),
              });
            }}
          >{tx(isLast ? UI.finish : UI.next, lang)}</button>
        )}
      </div>}
    </section>
  );
}

// ---------------------------------------------------------------------------
// HOST
// ---------------------------------------------------------------------------

export default function Grade4Dars50Practice({ studentName, lang: langProp, onFinished }) {
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
  const percent = Math.round(((finished ? 10 : index) / 10) * 100);

  const onSolved = (record) => {
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTry + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTry(nextFirstTry);
    if (index !== 9) { setIndex((old) => old + 1); return; }
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    const scorePercent = Math.round((nextFirstTry / 10) * 100);
    const levelBreakdown = ['green', 'yellow', 'red'].reduce((result, level) => ({
      ...result,
      [level]: {
        total: TASKS.filter((item) => item.level === level).length,
        firstTry: nextAnswers.filter((item) => item.level === level && item.firstTry).length,
      },
    }), {});
    onFinished?.({
      lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang),
      lessonTitleLocalized: LESSON_META.lessonTitle, studentName: studentName || null,
      activityType: 'practice', completed: true, totalQuestions: 10, answeredQuestions: 10,
      correctAnswers: nextFirstTry, firstTryCorrect: nextFirstTry, scorePercent,
      finalScore: nextFirstTry, finalTotal: 10, passed: nextFirstTry >= 6,
      firstTryStats: { total: 10, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: 10, scorePercent },
      attemptsTotal: nextAnswers.reduce((sum, item) => sum + item.attempts, 0),
      // eslint-disable-next-line react-hooks/purity -- duration is captured when the lesson finishes
      durationSec: startedAtRef.current ? Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)) : 0,
      skillTags: [...new Set(TASKS.map((item) => item.skillTag))],
      levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false;
    startedAtRef.current = Date.now();
    setIndex(0); setAnswers([]); setFirstTry(0); setFinished(false); setRunId((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => (
            <button type="button" key={code} aria-pressed={lang === code} className={lang === code ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}>
          <div className="p4-progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <div className="p4-head-row">
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <span className="p4-counter">{finished ? 10 : index + 1} / 10</span>
        </div>
      </header>
      <main className="p4-main">
        {finished ? (
          <section className="p4-done" aria-live="polite">
            <h2>{tx(UI.done, lang)}</h2>
            <p className="p4-score"><b>{firstTry}</b><span>/ 10</span></p>
            <p className="p4-note">{tx(UI.firstTry, lang)}</p>
            <p className="p4-complete">{tx(UI.allSolved, lang)}</p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </section>
        ) : (
          <Task
            key={`${runId}-${task.id}`}
            task={task}
            lang={lang}
            isLast={index === 9}
            onSolved={onSolved}
            shuffleSeed={`${LESSON_META.lessonId}:${runId}`}
          />
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// USLUBLAR — fayl ichida: LMS ga alohida .css bormaydi.
// ---------------------------------------------------------------------------
const STYLES = `
.p4-root{position:relative;display:flex;flex-direction:column;min-height:100dvh;overflow-x:clip;padding:0 0 22px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}
.p4-root h2,.p4-root p{margin:0}
.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;z-index:9;display:flex;gap:6px}
.p4-lang button{min-width:44px;min-height:44px;padding:0 10px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font:800 11px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}
.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}
.p4-progress,.p4-head-row,.p4-main{width:min(720px,100%);margin-inline:auto}
.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}
.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}
.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}
.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}
.p4-counter{white-space:nowrap;font:700 13px 'JetBrains Mono',monospace;color:${T.ink3}}
.p4-main{flex:1;padding:4px clamp(12px,4vw,24px)}
.p4-task{display:flex;flex-direction:column;gap:8px}
.p4-eyebrow{color:${T.accent};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.p4-setup{color:${T.ink2};font-size:clamp(14px,2vw,16px);line-height:1.5}
.p4-ask{font:600 clamp(16px,2.4vw,19px)/1.25 'Source Serif 4',Georgia,serif;color:${T.ink}}
.p4-note{color:${T.ink3};font-size:13px;line-height:1.4;text-align:center}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;min-height:96px;padding:9px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
/* Chizma: chapda qiymat o'qi, o'ngda maydon. O'q imzolari majburiy. */
.p4-chart.is-compact{--p4-chart-h:92px}
.p4-chart{display:grid;grid-template-columns:auto 1fr;grid-template-areas:'ytitle top' 'yaxis plot';gap:0 8px;width:min(100%,470px)}
.p4-chart-axis-title{color:${T.ink3};font:800 10px 'Manrope',sans-serif;letter-spacing:.08em;text-transform:uppercase}
.p4-chart-axis-title.is-y{grid-area:ytitle;justify-self:end;margin-bottom:10px}
.p4-chart-values{grid-area:yaxis}
.p4-chart-plot{grid-area:plot}
.p4-chart-axis-title.is-x{display:block;margin-top:2px;text-align:right}
.p4-chart-values{position:relative;height:var(--p4-chart-h,120px)}
.p4-value-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}
.p4-value-strip .p4-chart-value{position:static;transform:none}
.p4-value-strip button{min-width:56px;min-height:46px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:800 14px 'JetBrains Mono',monospace;cursor:pointer}
.p4-value-strip button:hover:not(:disabled){border-color:rgba(22,143,163,.45)}
.p4-value-strip button.is-picked{border-color:${T.accent};background:${T.accentSoft};color:${T.accent}}
.p4-chart-value{position:absolute;right:0;display:flex;align-items:center;transform:translateY(-50%)}
.p4-chart-value span,.p4-chart-value button{min-width:38px;padding:0 2px;border:0;background:transparent;color:${T.navy};font:800 11px 'JetBrains Mono',monospace;text-align:right}
.p4-chart-value button{min-height:44px;border-radius:9px;cursor:pointer}
.p4-chart-value button:hover:not(:disabled),.p4-chart-value button.is-picked{background:${T.accentSoft};color:${T.accent}}
.p4-chart-plot{flex:1;min-width:0}
.p4-chart-bars,.p4-chart-line{position:relative;height:var(--p4-chart-h,120px);border-left:2px solid ${T.navy};border-bottom:2px solid ${T.navy};background:repeating-linear-gradient(to top,transparent,transparent calc(100% / var(--p4-lines) - 1px),rgba(23,59,82,.12) calc(100% / var(--p4-lines) - 1px),rgba(23,59,82,.12) calc(100% / var(--p4-lines)))}
.p4-chart-bars{display:flex;align-items:flex-end;gap:clamp(4px,2vw,12px);padding:0 clamp(4px,2vw,10px)}
.p4-chart-bar-slot{flex:1;display:flex;align-items:flex-end;height:100%}
.p4-chart-bar{width:100%;border-radius:4px 4px 0 0;background:${T.cyan};transition:height .3s ease}
.p4-chart-bar.is-lit{background:${T.accent}}
.p4-chart-line svg{position:absolute;inset:0;width:100%;height:100%}
.p4-chart-dot{position:absolute;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:${T.cyan}}
.p4-chart-dot.is-lit{background:${T.accent};box-shadow:0 0 0 4px ${T.accentSoft}}
.p4-chart-labels{display:flex;gap:clamp(4px,2vw,12px);padding:2px clamp(4px,2vw,10px) 0}
.p4-chart-labels span{flex:1;color:${T.ink2};font:800 11px 'JetBrains Mono',monospace;text-align:center}
.p4-table{border-collapse:separate;border-spacing:3px;font-family:'JetBrains Mono',monospace}
.p4-table th{padding:2px 12px;color:${T.ink3};font:800 10px 'Manrope',sans-serif;letter-spacing:.06em;text-transform:uppercase}
.p4-table td{padding:4px 14px;border-radius:8px;background:${T.cyanSoft};color:${T.navy};font-weight:800;font-size:clamp(12.5px,2.4vw,15px);text-align:center}
.p4-table td.is-open{background:${T.accentSoft};color:${T.accent};box-shadow:inset 0 0 0 2px ${T.accent}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:grid;grid-template-columns:1.15fr 1fr;gap:10px;margin-top:6px}
.p4-match-col{display:grid;gap:7px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:48px;padding:7px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(11.5px,1.9vw,13.5px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:6px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:70px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800;font-size:10px}
.p4-order-slot b{font:700 11px/1.25 'Manrope',sans-serif;color:${T.navy};text-align:center}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:7px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12px/1.3 'Manrope',sans-serif;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-sort{display:flex;flex-direction:column;gap:9px}
.p4-sort-pool{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px;min-height:54px;padding:7px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-pool-done{color:${T.success};font-size:26px}
.p4-sort-token{min-width:44px;min-height:44px;padding:6px 10px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-token.is-active{border-color:${T.accent};background:${T.accentSoft};transform:translateY(-2px)}
.p4-sort-token.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-sort-bins{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.p4-sort-bin{min-height:96px;padding:7px;border-radius:14px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-sort-bin-head{width:100%;min-width:44px;min-height:44px;padding:7px 5px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.cyan};font:800 11.5px/1.25 'Manrope',sans-serif;cursor:pointer}
.p4-sort-bin-head:disabled{cursor:default;opacity:.78}
.p4-sort-bin-items{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px;padding-top:7px}
.p4-feedback{padding:11px 13px;border-radius:14px;line-height:1.45;animation:p4-result .22s ease both}
.p4-feedback.is-ok{background:${T.successSoft};color:#1B6644;box-shadow:inset 4px 0 0 ${T.success}}
.p4-feedback.is-no{background:${T.warnSoft};color:#8A5C10;box-shadow:inset 4px 0 0 ${T.warn}}
.p4-feedback p{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px)}
.p4-rule{margin-top:6px!important;color:${T.ink2}}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.p4-btn{min-width:44px;min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}
.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-btn-ready{background:${T.accent};color:#fff}
.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}
.p4-done h2{font:600 clamp(19px,3vw,24px) 'Source Serif 4',Georgia,serif}
.p4-score{display:flex;align-items:baseline;gap:5px;font-family:'JetBrains Mono',monospace}
.p4-score b{color:${T.success};font-size:clamp(32px,7vw,44px)}
.p4-score span{color:${T.ink3};font-size:15px}
.p4-complete{color:${T.ink2}}
@keyframes p4-result{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@media(max-width:520px){
  .p4-match-cols{grid-template-columns:1fr 1fr;gap:7px}
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:60px;padding:6px}
  .p4-sort-bins{grid-template-columns:1fr;gap:6px}
  .p4-sort-bin{display:flex;align-items:center;gap:8px;min-height:52px;padding:6px}
  .p4-sort-bin-head{flex:0 0 36%;min-height:44px;padding:6px 4px;font-size:11px}
  .p4-sort-bin-items{flex:1;justify-content:flex-start;padding-top:0}
  .p4-chart{--p4-chart-h:132px}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:96px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:80px!important;padding:8px 6px!important}
  .p4-chart{--p4-chart-h:68px}
  .p4-chart.is-compact{--p4-chart-h:60px}
  .p4-chart-value span,.p4-chart-value button{min-width:32px;font-size:10px}
  .p4-chart-labels span{font-size:10px}
  .p4-match-item{min-height:44px;padding:4px 5px;font-size:10px;line-height:1.2}
  .p4-sort-pool{gap:5px;min-height:46px;padding:5px}
  .p4-sort-token{font-size:10px;padding:4px 6px}
  .p4-table td{padding:3px 6px;font-size:11px}
  .p4-value-strip{gap:5px}
  .p4-value-strip button{min-width:48px;min-height:44px;font-size:12px}
  .p4-chart-axis-title{font-size:9px}

  .p4-btn{min-height:44px!important;padding:8px 16px}
  .p4-feedback{padding:9px 11px}
}
@media(prefers-reduced-motion:reduce){
  .p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;animation:none!important;transition:none!important}
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
