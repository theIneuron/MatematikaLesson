// ============================================================================
// 4-SINF · 46-DARS AMALIYOTI · QISM VA BUTUNNI TOPISH
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// Skelet: src/books/grade4/AMALIYOT_41_51_SKELET.md §9.
// Mexanika raskladkasi: scripts/grade4-practice-41-51-layout.mjs
//   mc · shade · numpad · missing · fracbuild · numpad · match · mc · order · shade
//
// Infratuzilma fayl ichida: LMS lokal importni ko'tarmaydi (CLAUDE.md §5 dan
// ongli chekinish, sabab 41-dars amaliyoti shapkasida).
//
// NAZARIYADAN FARQ. Nazariy dars 12 : 2, 12 : 4 · 3, 8 000 : 8, 78 : 3 = 26 va
// 20 km ning to'rtdan besh qismi misollarini ishlatgan; bu yerda boshqa sonlar.
//
// MODEL: teng kataklarga bo'lingan lenta. `shade` da bola kataklarni bosadi —
// kasrda MUHIM narsa kataklarning SONI, o'rni emas, shuning uchun tekshiruv
// sanoq bo'yicha ketadi (41-darsdagi simmetriyada aksincha: o'rin muhim).
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

// ---- MATCH-FIX (metodist qarori 2026-08-21) --------------------------------
// Juftlashtirish uch narsani kafolatlaydi:
//   1) juftlikning ikki tomoni bir xil rang va bir xil belgi oladi — uchta
//      qator uchta rangda ko'rinadi va bola nimani nima bilan bog'laganini
//      ko'zi bilan ko'radi;
//   2) band kartochkani boshqa qatorga berish mumkin, shuning uchun hammasini
//      juftlagandan keyin ham xatoni tuzatish yo'li bor — tupik yo'q;
//   3) o'ng ustun chap ustun bilan bir qatorga tushmaydi: to'g'ri javob
//      qarshisida turib qolsa, bola o'ylamay bir qatorga bosadi.
// Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi
// (scripts/build-grade4-practice-lms.mjs — lokal import yo'q).
const MATCH_TONES = 6;
// Chap ustundagi qatorlarning kaliti = `pairs` obyektining kaliti.
const matchRows = (task) => (task.pairs || []).map((pair) => pair.id);
const matchTone = (rows, key) => {
  const row = rows.findIndex((item) => String(item) === String(key));
  return row < 0 ? '' : ` p4-tone${(row % MATCH_TONES) + 1}`;
};
const matchToneLeft = (task, pairs, rowKey) => (
  pairs[rowKey] === undefined ? '' : matchTone(matchRows(task), rowKey)
);
const matchToneRight = (task, pairs, rightKey) => {
  const rows = matchRows(task);
  const owner = rows.find(
    (key) => pairs[key] !== undefined && String(pairs[key]) === String(rightKey),
  );
  return owner === undefined ? '' : matchTone(rows, owner);
};
// Kartochka band bo'lsa, eski juftlik bo'shatiladi: bitta kartochka bir vaqtda
// faqat bitta qatorga tegishli bo'ladi.
const matchTie = (pairs, rowKey, rightKey) => {
  const next = {};
  Object.keys(pairs).forEach((key) => {
    if (String(pairs[key]) !== String(rightKey)) next[key] = pairs[key];
  });
  next[rowKey] = rightKey;
  return next;
};
// O'ng ustunni shunday joylaydi, ki hech bir karta o'z juftining qarshisida
// turmaydi. Aralashtirish tasodifiy, lekin natijasi tekshiriladi.
const matchSpread = (cards, aligned) => {
  const list = Array.isArray(cards) ? [...cards] : [];
  if (list.length < 2) return list;
  const stuck = () => list.some((card, row) => aligned(card, row));
  for (let attempt = 0; attempt < 24 && stuck(); attempt += 1) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  for (let pass = 0; pass <= list.length && stuck(); pass += 1) {
    for (let i = 0; i < list.length; i += 1) {
      if (!aligned(list[i], i)) continue;
      const j = (i + 1) % list.length;
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return list;
};
// ---- MATCH-FIX tugashi ----------------------------------------------------

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
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[normalizeLang(lang)] ?? '' : value);

const UI = {
  title: b('Урок 46. Практика: часть и целое', '46-dars. Amaliyot: qism va butunni topish', 'Lesson 46. Practice: part and whole'),
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
  shadeHint: b('Нажимай на клетки ленты.', 'Lentaning kataklarini bosing.', 'Tap the cells of the strip.'),
  numerator: b('Числитель', 'Surat', 'Numerator'),
  denominator: b('Знаменатель', 'Maxraj', 'Denominator'),
};

const LESSON_META = {
  lessonId: 'fracpart-4-46-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 46,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'fraction-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'fraction-build', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'unit_fraction_action',
    visual: { type: 'cells', total: 6, filled: 1 },
    setup: b(
      'Панель распределения делит 540 деталей на шесть равных долей.',
      "Taqsimlash paneli 540 detalni oltita teng ulushga bo'ladi.",
      'The distribution panel splits 540 parts into six equal shares.',
    ),
    prompt: b(
      'Каким действием находят одну шестую от 540?',
      "540 ning oltidan bir qismi qaysi amal bilan topiladi?",
      'Which action finds one sixth of 540?',
    ),
    options: [
      option('divide', '540 : 6', '540 : 6', '540 : 6', true),
      option('multiply', '540 × 6', '540 × 6', '540 × 6', false,
        'Умножение сделало бы долю больше целого.',
        "Ko'paytirish ulushni butundan katta qilib qo'yardi.",
        'Multiplying would make the share bigger than the whole.'),
      option('subtract', '540 − 6', '540 − 6', '540 − 6', false,
        'Вычитание убирает шесть деталей, а не делит на шесть частей.',
        "Ayirish oltita detalni olib tashlaydi, oltita qismga bo'lmaydi.",
        'Subtracting removes six parts instead of splitting into six shares.'),
      option('reversed', '6 : 540', '6 : 540', '6 : 540', false,
        'Делят целое на число долей, а не наоборот.',
        "Butun ulushlar soniga bo'linadi, teskarisiga emas.",
        'The whole is divided by the number of shares, not the other way round.'),
    ],
    secondHint: b(
      'Одна доля — это результат деления целого на число равных частей.',
      "Bitta ulush — butunni teng qismlar soniga bo'lish natijasi.",
      'One share is the result of dividing the whole by the number of equal parts.',
    ),
    thirdHint: b('540 : 6 = 90.', '540 : 6 = 90.', '540 : 6 = 90.'),
    correctText: b(
      'Верно. Одна шестая равна 90 деталям.',
      "To'g'ri. Oltidan bir qism 90 detalga teng.",
      'Correct. One sixth is 90 parts.',
    ),
    rule: b(
      'Одну долю находят делением целого на знаменатель.',
      "Bitta ulush butunni maxrajga bo'lish bilan topiladi.",
      'One share is found by dividing the whole by the denominator.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'shade', skillTag: 'shade_fraction', selectCount: 3,
    visual: { type: 'cells', total: 8, filled: 0 },
    setup: b(
      'Лента разделена на восемь равных клеток.',
      "Lenta sakkizta teng katakka bo'lingan.",
      'The strip is divided into eight equal cells.',
    ),
    prompt: b(
      'Закрась три восьмых ленты.',
      "Lentaning uch sakkizdan qismini bo'yang.",
      'Shade three eighths of the strip.',
    ),
    wrong: [b(
      'Знаменатель говорит, на сколько частей разделили, а числитель — сколько взяли.',
      "Maxraj nechta qismga bo'linganini, surat esa nechtasi olinganini bildiradi.",
      'The denominator says into how many parts it is divided, and the numerator how many are taken.',
    )],
    secondHint: b(
      'Всего клеток восемь, а закрасить нужно столько, сколько стоит в числителе.',
      "Kataklar jami sakkizta, bo'yash kerak bo'lgani esa suratdagi songa teng.",
      'There are eight cells in all, and you shade as many as the numerator says.',
    ),
    thirdHint: b(
      'В числителе стоит три.',
      "Suratda uch turadi.",
      'The numerator is three.',
    ),
    correctText: b(
      'Верно. Три клетки из восьми — это три восьмых.',
      "To'g'ri. Sakkizdan uchta katak — uch sakkizdan qism.",
      'Correct. Three cells out of eight are three eighths.',
    ),
    rule: b(
      'Числитель показывает, сколько равных долей взяли.',
      "Surat nechta teng ulush olinganini ko'rsatadi.",
      'The numerator shows how many equal shares are taken.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'numpad', skillTag: 'fraction_of_number', answer: '270', maxLen: 3,
    visual: { type: 'cells', total: 5, filled: 3 },
    setup: b(
      'В хранилище 450 контейнеров, и лента разделена на пять долей.',
      "Omborda 450 konteyner bor, lenta beshta ulushga bo'lingan.",
      'The store has 450 containers and the strip is divided into five shares.',
    ),
    prompt: b(
      'Сколько контейнеров составляют три пятых?',
      'Uch beshdan qism necha konteynerni tashkil qiladi?',
      'How many containers are three fifths?',
    ),
    wrong: [b(
      'Здесь два действия: сначала одна доля, потом столько долей, сколько в числителе.',
      "Bu yerda ikki amal: avval bitta ulush, keyin suratdagi songa teng ulush.",
      'There are two actions here: first one share, then as many shares as the numerator.',
    )],
    secondHint: b(
      'Одна пятая равна 90 контейнерам.',
      "Beshdan bir qism 90 konteynerga teng.",
      'One fifth is 90 containers.',
    ),
    thirdHint: b('450 : 5 = 90, затем 90 × 3 = 270.', "450 : 5 = 90, keyin 90 × 3 = 270.", '450 : 5 = 90, then 90 × 3 = 270.'),
    correctText: b(
      'Верно. 450 : 5 = 90, и 90 × 3 = 270.',
      "To'g'ri. 450 : 5 = 90, va 90 × 3 = 270.",
      'Correct. 450 : 5 = 90, and 90 × 3 = 270.',
    ),
    rule: b(
      'Часть числа находят делением на знаменатель и умножением на числитель.',
      "Sonning qismi maxrajga bo'lib, suratga ko'paytirish bilan topiladi.",
      'A part of a number is found by dividing by the denominator and multiplying by the numerator.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'missing', skillTag: 'whole_from_unit', answer: '360', maxLen: 3,
    visual: { type: 'cells', total: 9, filled: 1 },
    setup: b(
      'Одна девятая склада равна 40 ящикам.',
      "Omborning to'qqizdan bir qismi 40 yashikka teng.",
      'One ninth of the store is 40 crates.',
    ),
    prompt: b(
      'Сколько ящиков на всём складе?',
      'Butun omborda nechta yashik bor?',
      'How many crates are in the whole store?',
    ),
    wrong: [b(
      'Целое собирают из девяти одинаковых долей.',
      "Butun to'qqizta bir xil ulushdan yig'iladi.",
      'The whole is put together from nine identical shares.',
    )],
    secondHint: b(
      'Каждая доля равна 40, а долей девять.',
      "Har ulush 40 ga teng, ulushlar esa to'qqizta.",
      'Each share is 40, and there are nine shares.',
    ),
    thirdHint: b('40 × 9 = 360.', '40 × 9 = 360.', '40 × 9 = 360.'),
    correctText: b(
      'Верно. 40 × 9 = 360 ящиков.',
      "To'g'ri. 40 × 9 = 360 yashik.",
      'Correct. 40 × 9 = 360 crates.',
    ),
    rule: b(
      'Если известна одна доля, целое находят умножением на знаменатель.',
      "Bitta ulush ma'lum bo'lsa, butun maxrajga ko'paytirish bilan topiladi.",
      'If one share is known, the whole is found by multiplying by the denominator.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'fracbuild', skillTag: 'model_to_fraction',
    answer: { n: 5, d: 8 },
    nChoices: [3, 5, 6],
    dChoices: [5, 8, 13],
    visual: { type: 'cells', total: 8, filled: 5 },
    setup: b(
      'Лента разделена на равные клетки, часть из них закрашена.',
      "Lenta teng kataklarga bo'lingan, ularning bir qismi bo'yalgan.",
      'The strip is divided into equal cells and some of them are shaded.',
    ),
    prompt: b(
      'Собери дробь, которую показывает лента.',
      "Lenta ko'rsatayotgan kasrni tuzing.",
      'Build the fraction that the strip shows.',
    ),
    wrong: [b(
      'Внизу дроби стоит число всех клеток, вверху — число закрашенных.',
      "Kasrning pastida barcha kataklar soni, yuqorida bo'yalganlar soni turadi.",
      'The bottom of the fraction is the number of all the cells, and the top is the number of shaded ones.',
    )],
    secondHint: b(
      'Сначала сосчитай все клетки, потом закрашенные.',
      "Avval barcha kataklarni, keyin bo'yalganlarini sanang.",
      'First count all the cells, then the shaded ones.',
    ),
    thirdHint: b(
      'Всего клеток восемь, закрашено пять.',
      "Kataklar jami sakkizta, bo'yalgani beshta.",
      'There are eight cells in all and five are shaded.',
    ),
    correctText: b(
      'Верно. Закрашено пять клеток из восьми.',
      "To'g'ri. Sakkiz katakdan beshtasi bo'yalgan.",
      'Correct. Five of the eight cells are shaded.',
    ),
    rule: b(
      'Знаменатель — число всех долей, числитель — число взятых.',
      "Maxraj — barcha ulushlar soni, surat — olinganlar soni.",
      'The denominator is the number of all the shares, and the numerator is the number taken.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'whole_from_part', answer: '336', maxLen: 3,
    visual: { type: 'cells', total: 7, filled: 2 },
    setup: b(
      'Две седьмых книги — это 96 страниц.',
      "Kitobning ikki yettidan qismi 96 bet.",
      'Two sevenths of a book is 96 pages.',
    ),
    prompt: b(
      'Сколько страниц в книге?',
      'Kitobda nechta bet bor?',
      'How many pages does the book have?',
    ),
    wrong: [b(
      'Сначала находят одну долю, а уже потом целое.',
      "Avval bitta ulush topiladi, keyin butun.",
      'First find one share, and only then the whole.',
    )],
    secondHint: b(
      'Известны две доли, поэтому 96 делят на два.',
      "Ikki ulush ma'lum, shuning uchun 96 ikkiga bo'linadi.",
      'Two shares are known, so 96 is divided by two.',
    ),
    thirdHint: b('96 : 2 = 48, затем 48 × 7 = 336.', "96 : 2 = 48, keyin 48 × 7 = 336.", '96 : 2 = 48, then 48 × 7 = 336.'),
    correctText: b(
      'Верно. 96 : 2 = 48, и 48 × 7 = 336 страниц.',
      "To'g'ri. 96 : 2 = 48, va 48 × 7 = 336 bet.",
      'Correct. 96 : 2 = 48, and 48 × 7 = 336 pages.',
    ),
    rule: b(
      'Целое по части находят делением на числитель и умножением на знаменатель.',
      "Qismdan butun suratga bo'lib, maxrajga ko'paytirish bilan topiladi.",
      'The whole is found from a part by dividing by the numerator and multiplying by the denominator.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'scheme_choice',
    setup: b(
      'Четыре вопроса панели распределения требуют четырёх разных схем.',
      "Taqsimlash panelining to'rt savoli to'rt xil sxemani talab qiladi.",
      'Four questions from the distribution panel need four different schemes.',
    ),
    prompt: b('Соедини вопрос со схемой решения.', 'Savolni yechish sxemasi bilan ulang.', 'Match each question to its solution scheme.'),
    pairs: [
      {
        id: 'part-of-whole',
        left: b('Найти часть от целого', 'Butundan qismni topish', 'Find a part of the whole'),
        correctRight: 'divide-multiply',
      },
      {
        id: 'whole-of-part',
        left: b('Найти целое по известной части', "Ma'lum qismdan butunni topish", 'Find the whole from a known part'),
        correctRight: 'multiply-divide',
      },
      {
        id: 'one-share',
        left: b('Найти одну долю', 'Bitta ulushni topish', 'Find one share'),
        correctRight: 'divide-only',
      },
      {
        id: 'rest',
        left: b('Найти оставшуюся часть', 'Qolgan qismni topish', 'Find the remaining part'),
        correctRight: 'subtract',
      },
    ],
    right: [
      { id: 'divide-multiply', text: b('Разделить на знаменатель, умножить на числитель', "Maxrajga bo'lib, suratga ko'paytirish", 'Divide by the denominator, multiply by the numerator') },
      { id: 'multiply-divide', text: b('Разделить на числитель, умножить на знаменатель', "Suratga bo'lib, maxrajga ko'paytirish", 'Divide by the numerator, multiply by the denominator') },
      { id: 'divide-only', text: b('Только разделить на знаменатель', "Faqat maxrajga bo'lish", 'Divide by the denominator only') },
      { id: 'subtract', text: b('Из целого вычесть найденную часть', 'Butundan topilgan qismni ayirish', 'Subtract the part found from the whole') },
    ],
    wrong: [b(
      'Смотри, что известно: целое или часть. От этого зависит порядок действий.',
      "Nima ma'lum ekaniga qarang: butunmi yoki qism. Amallar tartibi shunga bog'liq.",
      'Look at what is known: the whole or a part. The order of the actions depends on it.',
    )],
    secondHint: b(
      'Если известно целое, сначала делят на знаменатель.',
      "Butun ma'lum bo'lsa, avval maxrajga bo'linadi.",
      'If the whole is known, divide by the denominator first.',
    ),
    thirdHint: b(
      'Если известна часть, сначала делят на числитель.',
      "Qism ma'lum bo'lsa, avval suratga bo'linadi.",
      'If a part is known, divide by the numerator first.',
    ),
    correctText: b(
      'Верно. Схема зависит от того, что дано, а не от размера чисел.',
      "To'g'ri. Sxema nima berilganiga bog'liq, sonlarning kattaligiga emas.",
      'Correct. The scheme depends on what is given, not on the size of the numbers.',
    ),
    rule: b(
      'Прямая и обратная задачи используют обратные схемы.',
      "To'g'ri va teskari masala teskari sxemalardan foydalanadi.",
      'The direct and the inverse problem use opposite schemes.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'full_fraction_boundary',
    visual: { type: 'cells', total: 5, filled: 5 },
    setup: b(
      'Бак заполнили на пять пятых.',
      "Idish besh beshdan qismigacha to'ldirildi.",
      'The tank was filled to five fifths.',
    ),
    prompt: b('Что это означает?', 'Bu nimani bildiradi?', 'What does that mean?'),
    options: [
      option('full', 'Бак заполнен полностью', "Idish to'liq to'ldi", 'The tank is completely full', true),
      option('half', 'Бак заполнен наполовину', "Idishning yarmi to'ldi", 'The tank is half full', false,
        'Половина — это когда числитель вдвое меньше знаменателя.',
        "Yarim — surat maxrajdan ikki baravar kichik bo'lgan holat.",
        'A half is when the numerator is twice as small as the denominator.'),
      option('one-fifth', 'Заполнена одна пятая', "Beshdan bir qismi to'ldi", 'One fifth is full', false,
        'Одна пятая — это один закрашенный участок из пяти, а здесь их пять.',
        "Beshdan bir qism — beshtadan bitta bo'yalgan bo'lak, bu yerda esa beshta.",
        'One fifth is one shaded section out of five, but here there are five.'),
      option('overfull', 'Бак переполнен', "Idish to'lib toshdi", 'The tank is overfull', false,
        'Переполнение началось бы при числителе больше знаменателя.',
        "To'lib toshish surat maxrajdan katta bo'lganda boshlanardi.",
        'Overfilling would start when the numerator is greater than the denominator.'),
    ],
    secondHint: b(
      'Сравни числитель и знаменатель.',
      'Surat va maxrajni solishtiring.',
      'Compare the numerator and the denominator.',
    ),
    thirdHint: b(
      'Все пять долей из пяти взяты, значит взято целое.',
      "Beshta ulushning beshtasi olingan, demak butun olingan.",
      'All five of the five shares are taken, so the whole is taken.',
    ),
    correctText: b(
      'Верно. Когда числитель равен знаменателю, дробь равна целому.',
      "To'g'ri. Surat maxrajga teng bo'lganda kasr butunga teng bo'ladi.",
      'Correct. When the numerator equals the denominator, the fraction equals the whole.',
    ),
    rule: b(
      'Дробь, у которой числитель равен знаменателю, равна единице.',
      "Surati maxrajiga teng kasr birga teng bo'ladi.",
      'A fraction whose numerator equals its denominator equals one.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'order', skillTag: 'inverse_order_error',
    setup: b(
      'Три восьмых участка равны 51 метру. Bit начал делить на восемь и запутался.',
      "Uchastkaning uch sakkizdan qismi 51 metr. Bit sakkizga bo'lishdan boshlab chalkashdi.",
      'Three eighths of a plot is 51 metres. Bit started by dividing by eight and got confused.',
    ),
    prompt: b('Расставь шаги обратной задачи по порядку.', 'Teskari masala qadamlarini tartib bilan joylashtiring.', 'Put the steps of the inverse problem in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 's4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'known', text: b('Известна часть: 51 м', "Qism ma'lum: 51 m", 'A part is known: 51 m'), order: 0 },
      { id: 'unit', text: b('51 : 3 = 17', '51 : 3 = 17', '51 : 3 = 17'), order: 1 },
      { id: 'whole', text: b('17 × 8 = 136', '17 × 8 = 136', '17 × 8 = 136'), order: 2 },
      { id: 'answer', text: b('Целое: 136 м', 'Butun: 136 m', 'The whole: 136 m'), order: 3 },
    ],
    wrong: [b(
      'В обратной задаче сначала делят на числитель, а не на знаменатель.',
      "Teskari masalada avval suratga bo'linadi, maxrajga emas.",
      'In the inverse problem you divide by the numerator first, not by the denominator.',
    )],
    secondHint: b(
      '51 метр — это три доли, а не одна.',
      "51 metr — bu uchta ulush, bitta emas.",
      '51 metres is three shares, not one.',
    ),
    thirdHint: b(
      'Одна доля равна 17 метрам, а долей всего восемь.',
      "Bitta ulush 17 metrga teng, ulushlar esa sakkizta.",
      'One share is 17 metres, and there are eight shares in all.',
    ),
    correctText: b(
      'Верно. Часть, одна доля, целое, ответ.',
      "To'g'ri. Qism, bitta ulush, butun, javob.",
      'Correct. The part, one share, the whole, the answer.',
    ),
    rule: b(
      'В обратной задаче действия идут в обратном порядке.',
      'Teskari masalada amallar teskari tartibda boradi.',
      'In the inverse problem the actions go in the opposite order.',
    ),
  },

  {
    // Lenta bo'sh: jo'natilgan qism faqat matnda aytiladi. Shunda «jo'natilganini
    // bo'yash» xatosi haqiqatda mumkin bo'ladi.
    id: '10', level: 'red', kind: 'shade', skillTag: 'remaining_part', selectCount: 5,
    visual: { type: 'cells', total: 8, filled: 0 },
    setup: b(
      'Лента разделена на восемь клеток. Три восьмых уже отправили.',
      "Lenta sakkizta katakka bo'lingan. Uch sakkizdan qismi jo'natilgan.",
      'The strip is divided into eight cells. Three eighths have already been sent out.',
    ),
    prompt: b(
      'Закрась то, что осталось.',
      "Qolgan qismni bo'yang.",
      'Shade what is left.',
    ),
    wrong: [b(
      'Спрашивают не отправленную часть, а остаток.',
      "Jo'natilgan qism emas, qoldiq so'ralmoqda.",
      'The question asks for the remainder, not for the part that was sent.',
    )],
    secondHint: b(
      'Всего клеток восемь, а отправили три.',
      "Kataklar jami sakkizta, jo'natilgani esa uchta.",
      'There are eight cells in all and three were sent out.',
    ),
    thirdHint: b('8 − 3 = 5.', '8 − 3 = 5.', '8 − 3 = 5.'),
    correctText: b(
      'Верно. Осталось пять восьмых.',
      "To'g'ri. Besh sakkizdan qism qoldi.",
      'Correct. Five eighths are left.',
    ),
    rule: b(
      'Остаток находят вычитанием части из целого.',
      'Qoldiq butundan qismni ayirish bilan topiladi.',
      'The remainder is found by subtracting the part from the whole.',
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

const adaptive = (task, pickedOption, attempts, custom) => (
  attempts >= 3 ? task.thirdHint
    : attempts >= 2 ? task.secondHint
      : custom || pickedOption?.wrong || task.wrong?.[0] || task.secondHint
);

// ---------------------------------------------------------------------------
// MODELLAR
// ---------------------------------------------------------------------------

// Teng kataklarga bo'lingan lenta. Kasrda kataklarning SONI muhim, o'rni emas:
// shuning uchun bola istagan bo'sh katakni bosishi mumkin va tekshiruv sanoq
// bo'yicha ketadi.
function Cells({ visual, selected = [], onToggle, disabled = false, resolved = false }) {
  return (
    <div className="p4-cells" style={{ '--p4-cols': visual.total }}>
      {Array.from({ length: visual.total }, (_, index) => {
        const given = index < visual.filled;
        const picked = selected.includes(index);
        const className = [
          'p4-cell',
          given ? 'is-given' : '',
          picked ? (resolved ? 'is-success' : 'is-picked') : '',
        ].filter(Boolean).join(' ');
        return onToggle && !disabled && !given
          ? (
            <button
              type="button"
              key={index}
              className={className}
              data-cell={String(index)}
              aria-pressed={picked}
              aria-label={String(index + 1)}
              onClick={() => onToggle(index)}
            />
          )
          : <span key={index} className={className} aria-hidden="true" />;
      })}
    </div>
  );
}

function FractionBuilder({ task, fraction, setFraction, disabled, lang }) {
  return (
    <div className="p4-frac-builder">
      <div>
        <span>{tx(UI.numerator, lang)}</span>
        {task.nChoices.map((value) => (
          <button
            type="button"
            key={value}
            disabled={disabled}
            aria-pressed={fraction.n === value}
            className={fraction.n === value ? 'is-active' : ''}
            onClick={() => setFraction({ ...fraction, n: value })}
          >{value}</button>
        ))}
      </div>
      <hr />
      <div>
        <span>{tx(UI.denominator, lang)}</span>
        {task.dChoices.map((value) => (
          <button
            type="button"
            key={value}
            disabled={disabled}
            aria-pressed={fraction.d === value}
            className={fraction.d === value ? 'is-active' : ''}
            onClick={() => setFraction({ ...fraction, d: value })}
          >{value}</button>
        ))}
      </div>
    </div>
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
  const [pickedId, setPickedId] = useState(null);
  const [typed, setTyped] = useState('');
  const [selected, setSelected] = useState([]);
  const [fraction, setFraction] = useState({ n: null, d: null });
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
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
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [shuffleSeed, task.id, task.right]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restart/task keys intentionally trigger a fresh shuffle
  const orderCards = useMemo(() => shuffle(task.cards || []), [shuffleSeed, task.id, task.cards]);

  useEffect(() => {
    if (checked) window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }, [checked]);

  const answerReady = (() => {
    if (task.kind === 'mc') return pickedId !== null;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed.length > 0;
    if (task.kind === 'shade') return selected.length > 0;
    if (task.kind === 'fracbuild') return fraction.n !== null && fraction.d !== null;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id]);
    return task.steps.every((step) => placed[step.id]);
  })();

  const answerCorrect = () => {
    if (task.kind === 'mc') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === task.answer;
    if (task.kind === 'shade') return selected.length === task.selectCount;
    if (task.kind === 'fracbuild') return fraction.n === task.answer.n && fraction.d === task.answer.d;
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    return task.cards.every((card) => placed[task.steps[card.order].id] === card.id);
  };

  // Bo'yashda tahlil sanoqni nomlaydi, javobni bermaydi.
  const customWrong = (() => {
    if (task.kind !== 'shade' || !checked) return null;
    return selected.length > task.selectCount ? task.wrong?.[0] : null;
  })();

  const pickedOption = task.kind === 'mc' ? task.options.find((item) => item.id === pickedId) : null;
  const hintLevel = checked && !solved ? attempts : 0;

  const clearResponse = () => {
    checkingRef.current = false;
    setChecked(false); setPickedId(null); setTyped(''); setSelected([]); setFraction({ n: null, d: null });
    setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null);
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
    if (task.kind === 'mc') return { optionId: pickedId, text: pickedOption?.text };
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: typed };
    if (task.kind === 'shade') return { selectedCount: selected.length, cells: [...selected].sort((a, c) => a - c) };
    if (task.kind === 'fracbuild') return { numerator: fraction.n, denominator: fraction.d };
    if (task.kind === 'match') return { pairs };
    return { order: task.steps.map((step) => placed[step.id]) };
  })();

  const correctAnswer = (() => {
    if (task.kind === 'mc') {
      const item = task.options.find((candidate) => candidate.correct);
      return { optionId: item.id, text: item.text };
    }
    if (task.kind === 'numpad' || task.kind === 'missing') return { value: task.answer };
    if (task.kind === 'shade') return { selectedCount: task.selectCount, fraction: `${task.selectCount}/${task.visual.total}` };
    if (task.kind === 'fracbuild') return { numerator: task.answer.n, denominator: task.answer.d };
    if (task.kind === 'match') return { pairs: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    return { order: task.cards.slice().sort((a, c) => a.order - c.order).map((card) => card.id) };
  })();

  const cardText = (id) => tx(task.cards.find((card) => card.id === id)?.text, lang);

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

      {task.visual?.type === 'cells' && task.kind !== 'shade' && (
        <div className="p4-visual"><Cells visual={task.visual} /></div>
      )}

      <h2 id={`task-${task.id}`} className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'shade' && (
        <div className="p4-visual">
          <Cells
            visual={task.visual}
            selected={selected}
            onToggle={(index) => setAnswer(setSelected, selected.includes(index) ? selected.filter((value) => value !== index) : [...selected, index])}
            disabled={solved}
            resolved={solved}
          />
          <p className="p4-note">{tx(UI.shadeHint, lang)}</p>
        </div>
      )}

      {task.kind === 'mc' && (
        <div className="p4-options">
          {options.map((item, index) => (
            <button
              type="button"
              key={item.id}
              disabled={solved}
              aria-pressed={pickedId === item.id}
              className={`p4-option ${pickedId === item.id ? (checked ? (item.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
              onClick={() => setAnswer(setPickedId, item.id)}
            >
              <span className="p4-letter">{'ABCD'[index]}</span>
              <span>{tx(item.text, lang)}</span>
            </button>
          ))}
        </div>
      )}

      {(task.kind === 'numpad' || task.kind === 'missing') && (
        <NumPad value={typed} onChange={(value) => setAnswer(setTyped, value)} max={task.maxLen || 4} disabled={solved} lang={lang} />
      )}

      {task.kind === 'fracbuild' && (
        <FractionBuilder
          task={task}
          fraction={fraction}
          setFraction={(value) => setAnswer(setFraction, value)}
          disabled={solved}
          lang={lang}
        />
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
                  className={`p4-match-item ${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`}
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
                    disabled={solved || activeLeft === null}
                    className={`p4-match-item ${used ? 'is-used' : ''}${matchToneRight(task, pairs, item.id)}`}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => matchTie(old, activeLeft, item.id));
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
            {orderCards.map((card) => {
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

      {checked && (
        <Feedback
          feedbackRef={feedbackRef}
          ok={solved}
          text={solved ? task.correctText : adaptive(task, pickedOption, attempts, customWrong)}
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
                  : task.right ?? task.cards ?? null,
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

export default function Grade4Dars46Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-task{display:flex;flex-direction:column;gap:11px}
.p4-eyebrow{color:${T.accent};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.p4-setup{color:${T.ink2};font-size:clamp(14px,2vw,16px);line-height:1.5}
.p4-ask{font:600 clamp(17px,2.6vw,21px)/1.25 'Source Serif 4',Georgia,serif;color:${T.ink}}
.p4-note{color:${T.ink3};font-size:13px;line-height:1.4;text-align:center}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;min-height:100px;padding:12px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);overflow:hidden}
.p4-cells{display:grid;grid-template-columns:repeat(var(--p4-cols),1fr);gap:4px;width:min(100%,470px)}
.p4-cell{min-width:0;min-height:56px;padding:0;border:0;border-radius:8px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.2)}
.p4-cells button.p4-cell{cursor:pointer;background:#FBFBF8;box-shadow:inset 0 0 0 1px rgba(23,59,82,.14)}
.p4-cells button.p4-cell:hover:not(:disabled){box-shadow:inset 0 0 0 2px rgba(22,143,163,.45)}
.p4-cells .p4-cell.is-given{background:${T.cyan};box-shadow:none}
.p4-cells .p4-cell.is-picked{background:${T.accent};box-shadow:none}
.p4-cells .p4-cell.is-success{background:${T.success};box-shadow:none}
.p4-frac-builder{display:grid;gap:8px;padding:12px;border-radius:17px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-frac-builder>div{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}
.p4-frac-builder span{min-width:92px;color:${T.ink2};font-weight:800;font-size:13px}
.p4-frac-builder button{min-width:44px;min-height:44px;border:0;border-radius:11px;background:${T.cyanSoft};color:${T.cyan};font:800 17px 'JetBrains Mono',monospace;cursor:pointer}
.p4-frac-builder button.is-active{background:${T.accent};color:#fff}
.p4-frac-builder hr{width:min(70%,220px);margin:0 auto;border:0;border-top:3px solid ${T.navy}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-width:44px;min-height:56px;padding:10px 12px;text-align:left;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',sans-serif;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}
.p4-letter{flex:0 0 26px;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}
.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}
.p4-option.is-ok .p4-letter{background:${T.success};color:#fff}
.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-option.is-no .p4-letter{background:${T.warn};color:#fff}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .is-delete{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:grid;grid-template-columns:1fr 1.35fr;gap:10px;margin-top:7px}
.p4-match-col{display:grid;gap:8px;align-content:start}
.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:56px;padding:8px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 clamp(11.5px,1.9vw,13.5px)/1.3 'Manrope',sans-serif;text-align:center;cursor:pointer}
.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}
.p4-match-item.is-used{background:${T.successSoft};opacity:.65}
.p4-match-item:disabled{cursor:default}
.p4-match-item b{color:${T.success};font-size:11px}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:7px}
.p4-order-slot{display:grid;place-items:center;gap:4px;min-width:44px;min-height:74px;padding:7px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:inherit;cursor:pointer}
.p4-order-slot.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slot small{font-weight:800}
.p4-order-slot b{font:700 11px/1.25 'Manrope',sans-serif;color:${T.navy};text-align:center}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:8px}
.p4-card{min-width:44px;min-height:46px;padding:8px 11px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:700 12.5px/1.3 'Manrope',sans-serif;cursor:pointer}
.p4-card.is-used{background:${T.cyanSoft};opacity:.7}
.p4-feedback{padding:12px 14px;border-radius:14px;line-height:1.45;animation:p4-result .22s ease both}
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
  .p4-options{grid-template-columns:1fr}
  /* Ikki ustun qoladi: sxema nomlari uzun va bitta ustunda blok
     sakkiz kartaga cho'zilib, telefonda skroll beradi. */
  .p4-match-cols{grid-template-columns:1fr 1.25fr;gap:7px}
  .p4-match-item{font-size:11px;padding:6px 7px}
  .p4-order-slots{grid-template-columns:repeat(2,minmax(0,1fr))}
  .p4-order-slot{min-height:62px;padding:6px}
  .p4-cell{min-height:46px}
  .p4-frac-builder span{min-width:100%;text-align:center}
  .p4-main{padding:4px 8px}
  .p4-head{padding:64px 8px 6px}
  .p4-visual{padding:10px 6px;min-height:92px}
  .p4-task{gap:8px}
}
@media(max-width:640px) and (max-height:700px){
  .p4-head{padding:64px 8px 3px!important}
  .p4-task{gap:6px!important}
  .p4-setup{font-size:12.5px;line-height:1.35}
  .p4-ask{font-size:16px!important}
  .p4-visual{min-height:74px!important;padding:8px 6px!important}
  .p4-cell{min-height:38px}
  .p4-option{min-height:46px!important;padding:6px 8px!important;font-size:12px!important}
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

/* MATCH-FIX boshlanishi — metodist qarori 2026-08-21.
   Juftlikning ikki tomoni bir xil rang va bir xil belgi oladi: uchta qator
   uchta rangda ko'rinadi. Rang tanlangan (is-active) va band (is-used)
   holatlaridan ustun turishi kerak, shuning uchun !important. Tanlov va
   tekshiruv holatlari esa rangdan ustun: ular pastda, keyingi qatorlarda.
   Blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-match [class*="p4-tone"],.g4p-match [class*="p4-tone"]{position:relative;opacity:1!important}
.p4-match [class*="p4-tone"]::before,.g4p-match [class*="p4-tone"]::before{position:absolute;top:2px;left:4px;font-size:9px;line-height:1;opacity:.9;pointer-events:none}
.p4-match [class*="p4-tone"] b,.g4p-match [class*="p4-tone"] b,.p4-match [class*="p4-tone"] small,.g4p-match [class*="p4-tone"] small{color:inherit!important}
.p4-match .p4-tone1,.g4p-match .p4-tone1{background:#DCF0F3!important;border-color:#0E7C8F!important;box-shadow:inset 0 0 0 2px #0E7C8F!important;color:#0B5A68!important}
.p4-match .p4-tone1::before,.g4p-match .p4-tone1::before{content:"●";color:#0E7C8F}
.p4-match .p4-tone2,.g4p-match .p4-tone2{background:#E9E4F7!important;border-color:#5E45AD!important;box-shadow:inset 0 0 0 2px #5E45AD!important;color:#3E2E75!important}
.p4-match .p4-tone2::before,.g4p-match .p4-tone2::before{content:"■";color:#5E45AD}
.p4-match .p4-tone3,.g4p-match .p4-tone3{background:#FBE2EA!important;border-color:#AE3760!important;box-shadow:inset 0 0 0 2px #AE3760!important;color:#77223F!important}
.p4-match .p4-tone3::before,.g4p-match .p4-tone3::before{content:"◆";color:#AE3760}
.p4-match .p4-tone4,.g4p-match .p4-tone4{background:#E2E8F0!important;border-color:#3C5A80!important;box-shadow:inset 0 0 0 2px #3C5A80!important;color:#27405C!important}
.p4-match .p4-tone4::before,.g4p-match .p4-tone4::before{content:"★";color:#3C5A80}
.p4-match .p4-tone5,.g4p-match .p4-tone5{background:#EFE6DA!important;border-color:#6B4A2B!important;box-shadow:inset 0 0 0 2px #6B4A2B!important;color:#4A3219!important}
.p4-match .p4-tone5::before,.g4p-match .p4-tone5::before{content:"▲";color:#6B4A2B}
.p4-match .p4-tone6,.g4p-match .p4-tone6{background:#FBEBCB!important;border-color:#A2690F!important;box-shadow:inset 0 0 0 2px #A2690F!important;color:#6E4708!important}
.p4-match .p4-tone6::before,.g4p-match .p4-tone6::before{content:"✚";color:#A2690F}
.p4-match .is-active,.g4p-match .is-active{background:#FFF0EA!important;border-color:#FF5B35!important;box-shadow:inset 0 0 0 2px #FF5B35!important;color:#12212C!important}
.p4-match .is-ok,.g4p-match .is-ok{background:#E7F3EC!important;border-color:#227A53!important;box-shadow:inset 0 0 0 2px #227A53!important;color:#1B5E40!important}
.p4-match .is-no,.g4p-match .is-no{background:#FFF5D9!important;border-color:#A96F13!important;box-shadow:inset 0 0 0 2px #A96F13!important;color:#7C5210!important}
/* MATCH-FIX tugashi */
/* NOSCROLL boshlanishi — metodist qarori 2026-08-21.
   Past ekranda (1280x720 noutbuk, 360x640 telefon) topshiriq skrollga
   ketmasligi kerak: bola «Tekshirish» tugmasini ko'rmasa, uni bosmaydi.
   Faqat BO'SH JOY qisqaradi — bosiladigan maydon 44 px dan kichraymaydi
   (MOBIL_DESKTOP_MOSLASH.md). Blok har darsda takrorlanadi ATAYLAB: LMS
   avtonom fayl talab qiladi. */
@media (max-height:820px){
.p4-root,.g4p-root{padding-bottom:12px}
.p4-head,.g4p-head{padding-top:52px;padding-bottom:4px}
.p4-task,.g4p-task{gap:8px}
.p4-eyebrow,.g4p-eyebrow{margin-top:0}
.p4-ask,.g4p-ask{margin-top:0}
.p4-note,.g4p-note{margin-top:4px}
.p4-actions,.g4p-actions{margin-top:0}
.p4-figure{padding-top:8px;padding-bottom:8px}
.p4-pad,.g4p-pad{padding:8px;gap:6px}
.p4-pad-display,.g4p-pad-display{min-height:44px}
.p4-pad-keys,.g4p-pad-keys{gap:5px}
.p4-options,.g4p-options{gap:7px}
.p4-match-cols,.g4p-match-cols{gap:8px;margin-top:4px}
.p4-match-col,.g4p-match-col{gap:6px}
.p4-header,.g4p-header{margin-bottom:4px}
.p4-header h1,.g4p-header h1{margin-top:2px}
.p4-task-top{margin-bottom:2px}
.p4-setup,.g4p-setup{line-height:1.4}
.p4-match-item,.g4p-match-item{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-match button,.g4p-match button{min-height:44px;padding-top:5px;padding-bottom:5px}
.p4-fb,.p4-feedback,.g4p-feedback{padding-top:9px;padding-bottom:9px}
.p4-rule,.g4p-rule{margin-top:6px}
.p4-cells,.p4-grid{gap:4px}
.p4-card-bank,.p4-order-slots,.p4-slot-list,.p4-sort-pool{gap:6px}
}
@media (max-height:760px){
.p4-head,.g4p-head{padding-bottom:0}
.p4-main,.g4p-main{padding-top:0;padding-bottom:0}
.p4-root,.g4p-root{padding-bottom:8px}
.p4-task,.g4p-task{gap:5px}
.p4-figure{padding-top:4px;padding-bottom:4px}
.p4-eyebrow,.g4p-eyebrow{font-size:10px}
.p4-setup,.g4p-setup{font-size:clamp(13px,1.8vw,14px)}
.p4-ask,.g4p-ask{font-size:clamp(15px,2.2vw,18px)}
.p4-pad,.g4p-pad{padding:4px;gap:4px}
.p4-pad-keys,.g4p-pad-keys{gap:4px}
.p4-pad-display,.g4p-pad-display{min-height:40px}
.p4-visual,.g4p-visual{padding-top:8px;padding-bottom:8px;min-height:0}
.p4-svg,.g4p-svg{max-height:96px}
}
@media (max-height:700px){
.p4-head,.g4p-head{padding-top:52px;padding-bottom:2px}
.p4-task,.g4p-task{gap:6px}
.p4-figure{padding-top:6px;padding-bottom:6px}
.p4-bignum,.g4p-bignum{font-size:clamp(20px,4.4vw,30px)}
.p4-pad,.g4p-pad{padding:6px;gap:5px}
.p4-match-col,.g4p-match-col{gap:5px}
}
/* NOSCROLL tugashi */
`;
