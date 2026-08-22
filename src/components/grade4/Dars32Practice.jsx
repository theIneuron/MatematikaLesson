// ============================================================================
// 4-SINF · 32-DARS AMALIYOTI · HAJM BIRLIKLARI
// 10 topshiriq · UZ/RU/EN · ovozsiz · solve-to-advance.
//
// SKELET: src/books/grade4/AMALIYOT_31_40_SKELET.md §5.2.
// Raskladka (scripts/grade4-practice-31-40-layout.mjs):
//   sign · numpad · shade · order · missing · numpad · match · mc · shade · match
//
// NEGA BITTA FAYL VA NEGA CHIZMALAR SHU YERDA. LMS darsni bitta avtonom .jsx
// sifatida qabul qiladi: lokal import yo'q, uslublar ichkarida. Nazariy darsdagi
// figuralarni import qilib bo'lmaydi, shuning uchun mavzuga xos chizmalar shu
// faylda qaytadan yoziladi. Bu CLAUDE.md §5 nusxa taqiqiga zid emas — LMS
// kontrakti shuni majbur qiladi.
//
// DIZAYN: Dars01Practice.jsx. RUS TILIDA MUROJAAT — «ты».
//
// `shade` MEXANIKASI HAQIDA. Tekshiruv faqat bo'yalgan kataklar SONINI
// solishtiradi, qaysi kataklar bo'yalganini emas. Shuning uchun ikkala shade
// topshirig'i ham «nechta» savolini beradi: 03 da bir qatlamdagi kublar soni,
// 09 da tushib qolgan nollar soni. Aks holda topshiriq yolg'on tekshirardi.
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
const tx = (value, lang) => (
  value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? '' : value
);

const UI = {
  title: b(
    'Урок 32. Практика: единицы объёма',
    '32-dars. Amaliyot: hajm birliklari',
    'Lesson 32. Practice: units of volume',
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
  layers: b('слоёв', 'qatlam', 'layers'),
  base: b('основание', 'poydevor', 'base'),
};

const LESSON_META = {
  lessonId: 'num-4-32-practice',
  lessonTitle: UI.title,
  grade: 4,
  lessonNumber: 32,
  activityType: 'practice',
  taskCount: 10,
  resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'sign-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'cell-shading', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'ordering', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
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
    id: '01', level: 'green', kind: 'sign', skillTag: 'volume_unit_reading',
    visual: { type: 'sensor-panel', reading: '4000 cm³', vessel: '4 l' },
    setup: b(
      'Сенсор показал объём бака в кубических сантиметрах, а заявку на воду пишут в литрах.',
      "Sensor bak hajmini kub santimetrda ko'rsatdi, suvga buyurtma esa litrda yoziladi.",
      'The sensor gave the tank volume in cubic centimetres, while the water order is written in litres.',
    ),
    prompt: b(
      'Поставь знак: 4000 см³ □ 4 л.',
      "Belgini qo'ying: 4000 cm³ □ 4 l.",
      'Choose the sign: 4000 cm³ □ 4 l.',
    ),
    options: [
      option('equal', '=', '=', '=', true),
      option('less', '<', '<', '<', false,
        'В кубическом дециметре 1000 см³, и он вмещает ровно один литр.',
        "Bir kub detsimetrda 1000 cm³ bor va unga aynan bir litr sig'adi.",
        'A cubic decimetre holds 1000 cm³ and exactly one litre.'),
      option('greater', '>', '>', '>', false,
        '4000 см³ — это ровно 4 дм³, значит ровно 4 л.',
        "4000 cm³ — aynan 4 dm³, demak aynan 4 l.",
        '4000 cm³ is exactly 4 dm³, so exactly 4 l.'),
    ],
    secondHint: b(
      'Раздели 4000 см³ на кубические дециметры: в каждом по 1000 см³.',
      '4000 cm³ ni kub detsimetrlarga ajrating: har birida 1000 cm³ bor.',
      'Split 4000 cm³ into cubic decimetres: each one holds 1000 cm³.',
    ),
    thirdHint: b(
      '4000 см³ = 4 дм³, а 1 дм³ вмещает 1 л.',
      "4000 cm³ = 4 dm³, 1 dm³ ga esa 1 l sig'adi.",
      '4000 cm³ = 4 dm³, and 1 dm³ holds 1 l.',
    ),
    correctText: b(
      'Верно. 4000 см³ = 4 дм³ = 4 л.',
      "To'g'ri. 4000 cm³ = 4 dm³ = 4 l.",
      'Correct. 4000 cm³ = 4 dm³ = 4 l.',
    ),
    rule: b(
      'Кубический дециметр вмещает один литр.',
      "Bir kub detsimetrga bir litr sig'adi.",
      'A cubic decimetre holds one litre.',
    ),
  },

  {
    id: '02', level: 'green', kind: 'numpad', skillTag: 'layer_count',
    answer: '60', maxLen: 3,
    visual: { type: 'cube-box', cols: 5, rows: 3, layers: 4 },
    setup: b(
      'Ящик заполнили единичными кубиками: в основании 5 на 3, а слоёв четыре.',
      "Quti birlik kublar bilan to'ldirildi: poydevorda 5 ga 3, qatlamlar esa to'rtta.",
      'A box was filled with unit cubes: the base is 5 by 3 and there are four layers.',
    ),
    prompt: b(
      'Сколько единичных кубиков поместилось?',
      'Nechta birlik kub joylashdi?',
      'How many unit cubes fit inside?',
    ),
    wrongAnswers: {
      12: b(
        'Это сумма измерений: 5 + 3 + 4. Кубики считают слоями.',
        "Bu o'lchamlar yig'indisi: 5 + 3 + 4. Kublar qatlamlar bo'yicha sanaladi.",
        'That is the sum of the dimensions: 5 + 3 + 4. Cubes are counted in layers.',
      ),
      15: b(
        'Это один слой. Слоёв четыре.',
        "Bu bitta qatlam. Qatlamlar to'rtta.",
        'That is one layer. There are four layers.',
      ),
      20: b(
        'Это 5 умножить на 4: потеряно второе измерение основания.',
        "Bu 5 ni 4 ga ko'paytirish: poydevorning ikkinchi o'lchami tushib qolgan.",
        'That is 5 times 4: the second dimension of the base has been lost.',
      ),
    },
    wrong: [b(
      'Посчитай кубики одного слоя, потом умножь на число слоёв.',
      "Bitta qatlamdagi kublarni sanang, keyin qatlamlar soniga ko'paytiring.",
      'Count the cubes in one layer, then multiply by the number of layers.',
    )],
    secondHint: b(
      'Сначала посчитай кубики в одном слое: 5 умножить на 3.',
      "Avval bitta qatlamdagi kublarni sanang: 5 ni 3 ga ko'paytiring.",
      'First count the cubes in one layer: 5 times 3.',
    ),
    thirdHint: b(
      'В слое 15 кубиков, а слоёв 4: 15 умножить на 4.',
      "Qatlamda 15 kub bor, qatlam esa 4 ta: 15 ni 4 ga ko'paytiring.",
      'There are 15 cubes in a layer and 4 layers: 15 times 4.',
    ),
    correctText: b(
      'Верно. 15 кубиков в слое, 4 слоя — всего 60.',
      "To'g'ri. Qatlamda 15 kub, qatlam 4 ta — jami 60.",
      'Correct. 15 cubes per layer and 4 layers make 60.',
    ),
    rule: b(
      'Объём считают так: кубики одного слоя умножают на число слоёв.',
      "Hajm shunday hisoblanadi: bitta qatlamdagi kublar qatlamlar soniga ko'paytiriladi.",
      'To find a volume, multiply the cubes in one layer by the number of layers.',
    ),
  },

  {
    id: '03', level: 'yellow', kind: 'shade', skillTag: 'layer_model',
    cellsCols: 6, cellsTotal: 24, selectCount: 6,
    visual: { type: 'section-note', cols: 6, rows: 4 },
    setup: b(
      'Разрез бака разделён на клетки: шесть клеток в ряд, четыре ряда.',
      "Bak kesimi kataklarga bo'lingan: bir qatorda oltita katak, qator esa to'rtta.",
      'The cross-section of the tank is divided into squares: six squares per row and four rows.',
    ),
    prompt: b(
      'Сколько кубиков в одном слое? Закрась столько клеток.',
      'Bitta qatlamda nechta kub bor? Shuncha katakni bo\'yang.',
      'How many cubes are in one layer? Shade that many squares.',
    ),
    wrong: [b(
      'Один слой — это один ряд клеток, а не весь разрез.',
      'Bitta qatlam — bu bitta katak qatori, butun kesim emas.',
      'One layer is a single row of squares, not the whole section.',
    )],
    secondHint: b(
      'В одном ряду шесть клеток.',
      'Bitta qatorda oltita katak bor.',
      'There are six squares in one row.',
    ),
    thirdHint: b(
      'Закрась ровно шесть клеток: столько кубиков в одном слое.',
      "Aynan oltita katakni bo'yang: bitta qatlamda shuncha kub bor.",
      'Shade exactly six squares: that is how many cubes one layer holds.',
    ),
    correctText: b(
      'Верно. В слое 6 кубиков, а слоёв четыре: 6 умножить на 4 равно 24.',
      "To'g'ri. Qatlamda 6 kub, qatlam to'rtta: 6 ni 4 ga ko'paytirsak 24 bo'ladi.",
      'Correct. One layer holds 6 cubes and there are four layers: 6 times 4 is 24.',
    ),
    rule: b(
      'Слой — это один ряд кубиков; объём собирается из слоёв.',
      'Qatlam — bu bitta kub qatori; hajm qatlamlardan yig\'iladi.',
      'A layer is one row of cubes; a volume is built from layers.',
    ),
  },

  {
    id: '04', level: 'yellow', kind: 'order', skillTag: 'volume_procedure',
    visual: { type: 'cube-box', cols: 8, rows: 5, layers: 3 },
    setup: b(
      'Контейнер имеет измерения 8 см, 5 см и 3 см.',
      "Konteynerning o'lchamlari 8 cm, 5 cm va 3 cm.",
      'The container measures 8 cm, 5 cm and 3 cm.',
    ),
    prompt: b(
      'Расставь шаги вычисления объёма по порядку.',
      'Hajmni hisoblash qadamlarini tartib bilan joylashtiring.',
      'Put the steps for finding the volume in order.',
    ),
    steps: [
      { id: 'step-1', label: b('Шаг 1', '1-qadam', 'Step 1') },
      { id: 'step-2', label: b('Шаг 2', '2-qadam', 'Step 2') },
      { id: 'step-3', label: b('Шаг 3', '3-qadam', 'Step 3') },
      { id: 'step-4', label: b('Шаг 4', '4-qadam', 'Step 4') },
    ],
    cards: [
      { id: 'base', text: b('Основание: 8 · 5', 'Poydevor: 8 · 5', 'Base: 8 · 5'), order: 0 },
      { id: 'layer', text: b('В слое 40 кубиков', 'Qatlamda 40 kub', '40 cubes in a layer'), order: 1 },
      { id: 'count', text: b('Слоёв 3', 'Qatlam 3 ta', '3 layers'), order: 2 },
      { id: 'volume', text: b('Объём 120 см³', 'Hajm 120 cm³', 'Volume 120 cm³'), order: 3 },
    ],
    wrong: [b(
      'Сначала основание, потом слой, потом число слоёв, и только затем объём.',
      'Avval poydevor, keyin qatlam, keyin qatlamlar soni, va faqat keyin hajm.',
      'First the base, then one layer, then the number of layers, and only then the volume.',
    )],
    secondHint: b(
      '8 умножить на 5 равно 40.',
      "8 ni 5 ga ko'paytirsak 40 bo'ladi.",
      '8 times 5 is 40.',
    ),
    thirdHint: b(
      '40 умножить на 3 равно 120, а единица — кубический сантиметр.',
      "40 ni 3 ga ko'paytirsak 120, birlik esa kub santimetr.",
      '40 times 3 is 120, and the unit is the cubic centimetre.',
    ),
    correctText: b(
      'Верно. 8 · 5 · 3 = 120 см³.',
      "To'g'ri. 8 · 5 · 3 = 120 cm³.",
      'Correct. 8 · 5 · 3 = 120 cm³.',
    ),
    rule: b(
      'В ответе про объём единица всегда кубическая.',
      'Hajm javobida birlik har doim kub birlik bo\'ladi.',
      'An answer about volume always carries a cubic unit.',
    ),
  },

  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'cubic_step',
    answer: '7000', maxLen: 4,
    visual: { type: 'record-plate', text: b('7 дм³ = □ см³', '7 dm³ = □ cm³', '7 dm³ = □ cm³') },
    setup: b(
      'Один кубический дециметр собирается из тысячи кубических сантиметров.',
      "Bir kub detsimetr ming kub santimetrdan yig'iladi.",
      'One cubic decimetre is built from a thousand cubic centimetres.',
    ),
    prompt: b(
      'Сколько кубических сантиметров в 7 дм³?',
      '7 dm³ da nechta kub santimetr bor?',
      'How many cubic centimetres are in 7 dm³?',
    ),
    wrongAnswers: {
      70: b(
        'Умножение на 10 подходит длине, а не объёму: кубиков в тысячу раз больше.',
        "10 ga ko'paytirish uzunlikka mos, hajmga emas: kublar ming barobar ko'p.",
        'Multiplying by 10 suits length, not volume: there are a thousand times more cubes.',
      ),
      700: b(
        'На 100 переводят квадратные единицы. У объёма шаг тысяча.',
        '100 ga kvadrat birliklar aylantiriladi. Hajmning qadami esa ming.',
        'A factor of 100 belongs to square units. Volume uses a step of a thousand.',
      ),
      7: b(
        'При переходе к меньшей единице число обязано вырасти.',
        "Kichik birlikka o'tganda son ortishi kerak.",
        'The number must grow when converting to a smaller unit.',
      ),
    },
    wrong: [b(
      'Замени каждый кубический дециметр тысячей кубических сантиметров.',
      'Har bir kub detsimetrni ming kub santimetr bilan almashtiring.',
      'Replace each cubic decimetre with a thousand cubic centimetres.',
    )],
    secondHint: b(
      'Кубических дециметров семь, в каждом тысяча кубиков.',
      'Kub detsimetr yettita, har birida ming kub bor.',
      'There are seven cubic decimetres and each holds a thousand cubes.',
    ),
    thirdHint: b(
      '7 умножить на 1000 равно 7000.',
      "7 ni 1000 ga ko'paytirsak 7000 bo'ladi.",
      '7 times 1000 is 7000.',
    ),
    correctText: b(
      'Верно. 7 дм³ = 7000 см³.',
      "To'g'ri. 7 dm³ = 7000 cm³.",
      'Correct. 7 dm³ = 7000 cm³.',
    ),
    rule: b(
      'Шаг объёма — тысяча, потому что ребро растёт в десять раз по трём направлениям.',
      "Hajm qadami — ming, chunki qirra uch yo'nalishda o'n barobar uzayadi.",
      'The volume step is a thousand, because the edge grows tenfold in three directions.',
    ),
  },

  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'volume_word_problem',
    answer: '5', maxLen: 2,
    visual: { type: 'tank-level', capacity: 9, filled: 4 },
    setup: b(
      'Объём бака 9 дм³, в нём уже 4 л воды.',
      'Bakning hajmi 9 dm³, ichida allaqachon 4 l suv bor.',
      'The tank holds 9 dm³ and already contains 4 l of water.',
    ),
    prompt: b(
      'Сколько литров воды ещё поместится?',
      "Yana necha litr suv sig'adi?",
      'How many more litres of water will fit?',
    ),
    wrongAnswers: {
      13: b(
        'Это сумма. Свободное место находят вычитанием.',
        "Bu yig'indi. Bo'sh joy ayirish bilan topiladi.",
        'That is the sum. Free space is found by subtraction.',
      ),
      9: b(
        'Бак не пустой: четыре литра уже налиты.',
        "Bak bo'sh emas: to'rt litr allaqachon quyilgan.",
        'The tank is not empty: four litres are already inside.',
      ),
      4: b(
        'Это то, что уже налито, а не свободное место.',
        "Bu allaqachon quyilgani, bo'sh joy emas.",
        'That is what is already inside, not the free space.',
      ),
    },
    wrong: [b(
      'Сначала переведи объём бака в литры, потом вычти налитое.',
      "Avval bak hajmini litrga aylantiring, keyin quyilganini ayiring.",
      'Convert the tank volume to litres first, then subtract what is already inside.',
    )],
    secondHint: b(
      '9 дм³ вмещают 9 л.',
      "9 dm³ ga 9 l sig'adi.",
      '9 dm³ holds 9 l.',
    ),
    thirdHint: b(
      '9 − 4 = 5.',
      '9 − 4 = 5.',
      '9 − 4 = 5.',
    ),
    correctText: b(
      'Верно. Свободно 5 л: 9 дм³ вмещают 9 л.',
      "To'g'ri. 5 l bo'sh: 9 dm³ ga 9 l sig'adi.",
      'Correct. 5 l of space is left: 9 dm³ holds 9 l.',
    ),
    rule: b(
      'Литр и кубический дециметр — одна и та же ёмкость.',
      "Litr va kub detsimetr — bir xil sig'im.",
      'A litre and a cubic decimetre are the same capacity.',
    ),
  },

  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'volume_equivalence',
    visual: { type: 'unit-bridge', left: b('кубические единицы', 'kub birliklar', 'cubic units'), right: b('ёмкость', "sig'im", 'capacity') },
    setup: b(
      'В журнале рядом стоят записи объёма и записи ёмкости.',
      "Jurnalda hajm yozuvlari va sig'im yozuvlari yonma-yon turadi.",
      'The log holds volume records next to capacity records.',
    ),
    prompt: b(
      'Соедини равные записи.',
      'Teng yozuvlarni birlashtiring.',
      'Match the equal records.',
    ),
    pairs: [
      { id: 'three-dm3', left: b('3 дм³', '3 dm³', '3 dm³'), correctRight: '3000-cm3' },
      { id: 'two-m3', left: b('2 м³', '2 m³', '2 m³'), correctRight: '2000-dm3' },
      { id: 'five-l', left: b('5 л', '5 l', '5 l'), correctRight: '5-dm3' },
      { id: 'six-thousand', left: b('6000 см³', '6000 cm³', '6000 cm³'), correctRight: '6-l' },
    ],
    right: [
      { id: '3000-cm3', text: b('3000 см³', '3000 cm³', '3000 cm³') },
      { id: '2000-dm3', text: b('2000 дм³', '2000 dm³', '2000 dm³') },
      { id: '5-dm3', text: b('5 дм³', '5 dm³', '5 dm³') },
      { id: '6-l', text: b('6 л', '6 l', '6 l') },
    ],
    wrong: [b(
      'Определи вид записи: кубическая единица или ёмкость, и только потом коэффициент.',
      "Yozuv turini aniqlang: kub birlikmi yoki sig'im, va faqat keyin koeffitsiyentni.",
      'Identify the kind of record first — cubic unit or capacity — and only then the factor.',
    )],
    secondHint: b(
      'Между соседними кубическими единицами шаг тысяча, а литр равен кубическому дециметру.',
      "Qo'shni kub birliklar orasidagi qadam ming, litr esa kub detsimetrga teng.",
      'The step between neighbouring cubic units is a thousand, and a litre equals a cubic decimetre.',
    ),
    thirdHint: b(
      '3 дм³ = 3000 см³; 2 м³ = 2000 дм³; 5 л = 5 дм³; 6000 см³ = 6 л.',
      '3 dm³ = 3000 cm³; 2 m³ = 2000 dm³; 5 l = 5 dm³; 6000 cm³ = 6 l.',
      '3 dm³ = 3000 cm³; 2 m³ = 2000 dm³; 5 l = 5 dm³; 6000 cm³ = 6 l.',
    ),
    correctText: b(
      'Верно. Все четыре равенства составлены по своим коэффициентам.',
      "To'g'ri. To'rtta tenglikning har biri o'z koeffitsiyenti bo'yicha tuzildi.",
      'Correct. Each of the four equalities uses its own factor.',
    ),
    rule: b(
      'Литр связан именно с кубическим дециметром, а не с любой кубической единицей.',
      'Litr aynan kub detsimetrga bog\'langan, har qanday kub birlikka emas.',
      'The litre is tied to the cubic decimetre in particular, not to any cubic unit.',
    ),
  },

  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'dimension_sum_trap',
    visual: { type: 'cube-edge', edge: 4 },
    setup: b(
      'У кубика ребро 4 см, поэтому все три измерения одинаковые.',
      "Kubning qirrasi 4 cm, shuning uchun uchala o'lchami bir xil.",
      'The cube has a 4 cm edge, so all three dimensions are the same.',
    ),
    prompt: b(
      'Чему равен его объём?',
      'Uning hajmi qanchaga teng?',
      'What is its volume?',
    ),
    options: [
      option('sixty-four', '64 см³', '64 cm³', '64 cm³', true),
      option('twelve', '12 см³', '12 cm³', '12 cm³', false,
        'Это сумма трёх рёбер, а не объём.',
        "Bu uchta qirraning yig'indisi, hajm emas.",
        'That is the sum of three edges, not the volume.'),
      option('sixteen', '16 см³', '16 cm³', '16 cm³', false,
        'Это площадь одной грани: 4 умножить на 4.',
        "Bu bitta yoqning yuzasi: 4 ni 4 ga ko'paytirish.",
        'That is the area of one face: 4 times 4.'),
      option('ninety-six', '96 см³', '96 cm³', '96 cm³', false,
        'Это площадь всех шести граней, а не объём: и единица должна быть квадратной.',
        "Bu oltita yoqning yuzasi, hajm emas: birlik ham kvadrat bo'lishi kerak.",
        'That is the area of all six faces, not the volume, and its unit should be square.'),
    ],
    secondHint: b(
      'Объём — это кубики одного слоя, умноженные на число слоёв.',
      "Hajm — bitta qatlamdagi kublarni qatlamlar soniga ko'paytirish.",
      'A volume is the cubes in one layer multiplied by the number of layers.',
    ),
    thirdHint: b(
      '4 умножить на 4 равно 16 в слое, слоёв 4: 16 умножить на 4.',
      "4 ni 4 ga ko'paytirsak qatlamda 16, qatlam 4 ta: 16 ni 4 ga ko'paytiring.",
      '4 times 4 is 16 in a layer, and there are 4 layers: 16 times 4.',
    ),
    correctText: b(
      'Верно. 4 · 4 · 4 = 64 см³.',
      "To'g'ri. 4 · 4 · 4 = 64 cm³.",
      'Correct. 4 · 4 · 4 = 64 cm³.',
    ),
    rule: b(
      'Измерения перемножают, а не складывают.',
      "O'lchamlar ko'paytiriladi, qo'shilmaydi.",
      'Dimensions are multiplied, not added.',
    ),
  },

  {
    id: '09', level: 'red', kind: 'shade', skillTag: 'zero_count_error',
    cellsCols: 4, cellsTotal: 4, selectCount: 3,
    visual: { type: 'error-plate', text: b('8 дм³ = 8 см³', '8 dm³ = 8 cm³', '8 dm³ = 8 cm³') },
    setup: b(
      'Ученик записал: 8 дм³ = 8 см³. Число осталось прежним, хотя единица стала меньше.',
      "O'quvchi shunday yozdi: 8 dm³ = 8 cm³. Birlik kichraydi, son esa o'zgarmadi.",
      'A pupil wrote 8 dm³ = 8 cm³. The number stayed the same although the unit became smaller.',
    ),
    prompt: b(
      'Сколько нулей потерялось? Закрась столько клеток.',
      "Nechta nol tushib qoldi? Shuncha katakni bo'yang.",
      'How many zeros were lost? Shade that many squares.',
    ),
    wrong: [b(
      'Один кубический дециметр — это тысяча кубических сантиметров. Посчитай нули в тысяче.',
      'Bir kub detsimetr — ming kub santimetr. Mingdagi nollarni sanang.',
      'One cubic decimetre is a thousand cubic centimetres. Count the zeros in a thousand.',
    )],
    secondHint: b(
      'Верная запись: 8 дм³ = 8000 см³.',
      "To'g'ri yozuv: 8 dm³ = 8000 cm³.",
      'The correct record is 8 dm³ = 8000 cm³.',
    ),
    thirdHint: b(
      'В 8000 три нуля, а в записи ученика их нет вовсе.',
      "8000 da uchta nol bor, o'quvchining yozuvida esa umuman yo'q.",
      'There are three zeros in 8000 and none at all in the pupil record.',
    ),
    correctText: b(
      'Верно. Потерялись три нуля: 8 дм³ = 8000 см³.',
      "To'g'ri. Uchta nol tushib qolgan: 8 dm³ = 8000 cm³.",
      'Correct. Three zeros were lost: 8 dm³ = 8000 cm³.',
    ),
    rule: b(
      'Меньшая единица даёт большее число: нули терять нельзя.',
      "Kichik birlik kattaroq son beradi: nollarni yo'qotib bo'lmaydi.",
      'A smaller unit gives a larger number: the zeros must not be lost.',
    ),
  },

  {
    id: '10', level: 'red', kind: 'match', skillTag: 'inverse_volume_transfer',
    visual: { type: 'unit-bridge', left: b('объём', 'hajm', 'volume'), right: b('мера', "o'lcham", 'measure') },
    setup: b(
      'Теперь известен объём, а найти нужно ребро или другую единицу.',
      "Endi hajm ma'lum, topish kerak bo'lgani esa qirra yoki boshqa birlik.",
      'Now the volume is known and the edge or another unit has to be found.',
    ),
    prompt: b(
      'Соедини каждый объём с его мерой.',
      "Har bir hajmni o'z o'lchami bilan birlashtiring.",
      'Match each volume with its measure.',
    ),
    pairs: [
      { id: 'cube-1000', left: b('куб объёмом 1000 см³', 'hajmi 1000 cm³ bo\'lgan kub', 'a cube of 1000 cm³'), correctRight: 'edge-10' },
      { id: 'litre', left: b('1 л воды', '1 l suv', '1 l of water'), correctRight: 'one-dm3' },
      { id: 'cube-27', left: b('куб объёмом 27 см³', 'hajmi 27 cm³ bo\'lgan kub', 'a cube of 27 cm³'), correctRight: 'edge-3' },
      { id: 'two-thousand', left: b('2000 дм³', '2000 dm³', '2000 dm³'), correctRight: 'two-m3' },
    ],
    right: [
      { id: 'edge-10', text: b('ребро 10 см', 'qirrasi 10 cm', 'edge 10 cm') },
      { id: 'one-dm3', text: b('1 дм³', '1 dm³', '1 dm³') },
      { id: 'edge-3', text: b('ребро 3 см', 'qirrasi 3 cm', 'edge 3 cm') },
      { id: 'two-m3', text: b('2 м³', '2 m³', '2 m³') },
    ],
    wrong: [b(
      'Иди в обратную сторону: от объёма к ребру или к другой единице.',
      "Teskari tomonga boring: hajmdan qirraga yoki boshqa birlikka.",
      'Work backwards: from the volume to the edge or to another unit.',
    )],
    secondHint: b(
      'Ребро находят так, чтобы три одинаковых множителя дали объём.',
      "Qirra shunday topiladi: uchta bir xil ko'paytuvchi hajmni bersin.",
      'Find the edge so that three equal factors give the volume.',
    ),
    thirdHint: b(
      '10 · 10 · 10 = 1000; 3 · 3 · 3 = 27; 1 л = 1 дм³; 1 м³ = 1000 дм³.',
      '10 · 10 · 10 = 1000; 3 · 3 · 3 = 27; 1 l = 1 dm³; 1 m³ = 1000 dm³.',
      '10 · 10 · 10 = 1000; 3 · 3 · 3 = 27; 1 l = 1 dm³; 1 m³ = 1000 dm³.',
    ),
    correctText: b(
      'Верно. Обратный переход держится на том же шаге тысяча.',
      "To'g'ri. Teskari o'tish ham xuddi shu ming qadamiga tayanadi.",
      'Correct. The reverse conversion rests on the same step of a thousand.',
    ),
    rule: b(
      'Обратная задача проверяет тот же коэффициент, только в другую сторону.',
      'Teskari masala xuddi shu koeffitsiyentni, faqat boshqa tomonga tekshiradi.',
      'The inverse task checks the same factor, just in the other direction.',
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
// CHIZMALAR. Hajm mavzusining asboblari: sensor tablosi, birlik kublardan
// yig'ilgan quti, kesim to'ri, bak sathi, kub qirrasi, xato yozuvi.
// Chizma yechimning birinchi qadamini bermaydi: qutida kublar sanalmaydi,
// poydevor va qatlamlar soni ALOHIDA ko'rsatiladi, shuning uchun bola
// ko'paytirishni o'zi bajaradi.
// ---------------------------------------------------------------------------
function Visual({ task, lang, solved }) {
  const visual = task.visual;
  if (!visual) return null;

  if (visual.type === 'sensor-panel') {
    return (
      <div className="p4-visual p4-visual-row">
        <span className="p4-sensor">{visual.reading}</span>
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 70 84" role="img" aria-label={visual.vessel}>
          <path d="M12 18 H58 L54 78 H16 Z" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2" />
          <path d="M14 40 H56" stroke={T.cyan} strokeWidth="1.4" strokeDasharray="4 3" />
          <rect x="10" y="12" width="50" height="8" rx="3" fill={T.paper} stroke={T.navy} strokeWidth="1.6" />
          <text x="35" y="62" textAnchor="middle" className="p4-svg-top">{visual.vessel}</text>
        </svg>
      </div>
    );
  }

  if (visual.type === 'cube-box') {
    const cell = 13;
    return (
      <div className="p4-visual p4-visual-row">
        <svg className="p4-svg p4-svg-narrow" viewBox={`0 0 ${visual.cols * cell + 14} ${visual.rows * cell + 26}`}
          role="img" aria-label={`${visual.cols} × ${visual.rows}`}>
          {Array.from({ length: visual.rows }, (_, row) => Array.from({ length: visual.cols }, (_, col) => (
            <rect key={`${row}-${col}`} x={7 + col * cell} y={7 + row * cell} width={cell - 2} height={cell - 2}
              rx="2" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1" />
          )))}
          <text x={(visual.cols * cell + 14) / 2} y={visual.rows * cell + 21} textAnchor="middle" className="p4-svg-cut">
            {tx(UI.base, lang)} {visual.cols} × {visual.rows}
          </text>
        </svg>
        <span className="p4-layers" aria-label={`${visual.layers} ${tx(UI.layers, lang)}`}>
          {Array.from({ length: visual.layers }, (_, index) => <i key={index} style={{ animationDelay: `${index * 70}ms` }} />)}
          <small>{visual.layers} {tx(UI.layers, lang)}</small>
        </span>
        {solved && <b className="p4-reveal">{visual.cols * visual.rows * visual.layers}</b>}
      </div>
    );
  }

  if (visual.type === 'section-note') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg" viewBox="0 0 300 96" role="img" aria-label={`${visual.cols} × ${visual.rows}`}>
          <rect x="10" y="10" width="280" height="76" rx="6" fill="none" stroke={T.navy} strokeWidth="2" />
          {Array.from({ length: visual.rows - 1 }, (_, row) => (
            <line key={row} x1="10" y1={10 + ((row + 1) * 76) / visual.rows} x2="290" y2={10 + ((row + 1) * 76) / visual.rows}
              stroke={T.cyan} strokeWidth="1.2" strokeDasharray="5 4" />
          ))}
          <text x="150" y="52" textAnchor="middle" className="p4-svg-top">
            {visual.cols} × {visual.rows}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.type === 'record-plate' || visual.type === 'error-plate') {
    return (
      <div className={`p4-visual ${visual.type === 'error-plate' ? 'p4-visual-error' : ''}`}>
        <strong>{tx(visual.text, lang)}</strong>
      </div>
    );
  }

  if (visual.type === 'tank-level') {
    const share = visual.filled / visual.capacity;
    return (
      <div className="p4-visual">
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 120 104" role="img" aria-label={tx(task.setup, lang)}>
          <rect x="24" y="14" width="72" height="80" rx="8" fill={T.paper} stroke={T.navy} strokeWidth="2" />
          <rect x="27" y={17 + 74 * (1 - share)} width="66" height={74 * share} rx="6" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.4" />
          <text x="60" y={12} textAnchor="middle" className="p4-svg-top">{visual.capacity} dm³</text>
          <text x="60" y={90} textAnchor="middle" className="p4-svg-cut">{visual.filled} l</text>
          {solved && (
            <text x="60" y={17 + 74 * (1 - share) - 4} textAnchor="middle" className="p4-svg-reveal">
              {visual.capacity - visual.filled} l
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (visual.type === 'unit-bridge') {
    return (
      <div className="p4-visual p4-visual-row">
        <span className="p4-bridge-side">{tx(visual.left, lang)}</span>
        <span className="p4-bridge-arrow" aria-hidden="true">↔</span>
        <span className="p4-bridge-side">{tx(visual.right, lang)}</span>
      </div>
    );
  }

  if (visual.type === 'cube-edge') {
    return (
      <div className="p4-visual">
        <svg className="p4-svg p4-svg-narrow" viewBox="0 0 120 108" role="img" aria-label={`${visual.edge} cm`}>
          <path d="M22 34 H82 V94 H22 Z" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2" />
          <path d="M22 34 L44 14 H104 L82 34" fill={T.paper} stroke={T.cyan} strokeWidth="2" />
          <path d="M82 34 L104 14 V74 L82 94" fill="#EFF7F8" stroke={T.cyan} strokeWidth="2" />
          <text x="52" y="106" textAnchor="middle" className="p4-svg-cut">{visual.edge} cm</text>
          {solved && <text x="52" y="70" textAnchor="middle" className="p4-svg-reveal">{visual.edge ** 3} cm³</text>}
        </svg>
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

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function Task({ task, lang, isLast, onSolved, shuffleSeed ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
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
  const rightCards = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [shuffleSeed, task.id, task.right]);
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
                  className={`${activeLeft === pair.id ? 'is-active' : ''} ${pairs[pair.id] ? 'is-tied' : ''}${matchToneLeft(task, pairs, pair.id)}`}
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
                  <button type="button" key={item.id} className={`${used ? 'is-used' : ''}${matchToneRight(task, pairs, item.id)}`}
                    disabled={solved || activeLeft === null}
                    onClick={() => {
                      checkingRef.current = false;
                      setPairs((old) => matchTie(old, activeLeft, item.id));
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
                  : task.right ?? task.cards ?? null,
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

export default function Grade4Dars32Practice({ studentName, lang: langProp, onFinished }) {
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
.p4-visual-row { grid-auto-flow: column; grid-auto-columns: max-content; align-items: center; }
.p4-visual strong { text-align: center; color: ${T.navy}; font: 800 clamp(20px, 4.6vw, 30px)/1.25 'JetBrains Mono', monospace; }
.p4-visual-error strong { color: ${T.warn}; text-decoration: line-through; }
.p4-svg { width: 100%; max-width: 340px; height: auto; }
.p4-svg-narrow { max-width: 190px; }
.p4-svg text { font: 700 12px 'JetBrains Mono', monospace; }
.p4-svg-top { fill: ${T.navy}; }
.p4-svg-cut { fill: ${T.ink2}; }
.p4-svg-reveal { fill: ${T.success}; font-weight: 800; animation: p4-rise .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-sensor { padding: 8px 12px; border-radius: 11px; background: ${T.navy}; color: #EAF6F8; font: 800 clamp(16px, 3.4vw, 22px) 'JetBrains Mono', monospace; }
.p4-layers { display: grid; gap: 4px; justify-items: center; }
.p4-layers i { display: block; width: 52px; height: 9px; border-radius: 3px; background: ${T.cyanSoft}; box-shadow: inset 0 0 0 1px ${T.cyan}; animation: p4-drop .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-layers small { color: ${T.ink2}; font-size: 11px; font-weight: 800; }
.p4-reveal { color: ${T.success}; font: 800 clamp(20px, 4.4vw, 28px) 'JetBrains Mono', monospace; animation: p4-rise .5s cubic-bezier(.22, 1.2, .36, 1) both; }
.p4-bridge-side { padding: 6px 10px; border-radius: 10px; background: ${T.cyanSoft}; color: ${T.cyan}; font: 800 12px 'Manrope', sans-serif; }
.p4-bridge-arrow { color: ${T.accent}; font-weight: 800; }

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
.p4-cells { display: grid; gap: 5px; width: min(100%, 340px); }
.p4-cells button { min-width: 44px; min-height: 44px; border: 1px solid rgba(23, 59, 82, .14); border-radius: 8px; background: ${T.paper}; cursor: pointer; transition: background .18s, border-color .18s; }
.p4-cells button:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-cells button.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-cells button.is-ok { border-color: ${T.success}; background: ${T.successSoft}; }
.p4-cells button.is-no { border-color: ${T.warn}; background: ${T.warnSoft}; }

.p4-match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 7px; }
.p4-match-col { display: grid; gap: 8px; }
.p4-match button, .p4-order button { min-width: 44px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23, 59, 82, .12); border-radius: 12px; background: ${T.paper}; color: ${T.navy}; font: 700 clamp(12px, 1.9vw, 14px)/1.3 'Manrope', sans-serif; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-match button:hover:not(:disabled), .p4-order button:hover:not(:disabled) { border-color: rgba(22, 143, 163, .4); transform: translateY(-2px); }
.p4-match button.is-active, .p4-order button.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match button.is-tied { border-color: rgba(34, 122, 83, .35); }
.p4-match button small { display: block; margin-top: 3px; color: ${T.success}; font-size: 11px; }
.p4-match button.is-used, .p4-card.is-used { background: ${T.successSoft}; opacity: .62; }

.p4-order-slots { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; margin-top: 7px; }
.p4-order-slots button { display: grid; gap: 3px; place-items: center; }
.p4-order-slots small { color: ${T.ink3}; font-size: 10px; }
.p4-order-slots b { font: 800 clamp(11px, 1.8vw, 13px) 'JetBrains Mono', monospace; }
.p4-card-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: 8px; }

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
  .p4-option, .p4-match button, .p4-order button { min-height: 44px !important; padding: 5px 8px !important; font-size: 12px !important; }
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
