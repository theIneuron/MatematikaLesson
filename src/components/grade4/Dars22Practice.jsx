// ============================================================================
// 4-SINF · 22-DARS AMALIYOTI · SONNING KASR QISMINI TOPISH
// Dars01Practice metodik ketma-ketligi va Dars21Practice texnik kontrakti.
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

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const b = (ru, uz, en) => ({ ru, uz, en });
const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
  id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
});
const tx = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? (value[lang] ?? '') : value);

const shuffle = (items, runKey) => {
  if (!items?.length) return [];
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  const rotation = [...runKey].reduce((sum, char) => sum + char.charCodeAt(0), 0) % copy.length;
  return [...copy.slice(rotation), ...copy.slice(0, rotation)];
};

const UI = {
  title: b('Урок 22. Практика: находим дробную часть числа', '22-dars. Amaliyot: sonning kasr qismini topish', 'Lesson 22. Practice: finding a fraction of a number'),
  language: b('Язык', 'Til', 'Language'), task: b('Задание', 'Topshiriq', 'Task'),
  level: {
    green: b('Основное', 'Asosiy', 'Core'),
    yellow: b('Применение', "Qo'llash", 'Application'),
    red: b('Перенос', "Ko'chirish", 'Transfer'),
  },
  check: b('Проверить', 'Tekshirish', 'Check'), retry: b('Исправить ответ', 'Javobni tuzatish', 'Correct the answer'),
  next: b('Следующее', 'Keyingisi', 'Next'), finish: b('Завершить', 'Yakunlash', 'Finish'),
  done: b('Практика пройдена', 'Amaliyot tugadi', 'Practice complete'),
  allSolved: b('Все 10 заданий решены.', '10 ta topshiriqning barchasi yechildi.', 'All 10 tasks have been solved.'),
  firstTry: b('верно с первой проверки', "birinchi tekshiruvda to'g'ri", 'correct on the first check'),
  again: b('Пройти заново', 'Qaytadan ishlash', 'Try again'),
  remember: b('Запомните', 'Eslab qoling', 'Remember'),
  typeAnswer: b('Введите числовой ответ', 'Sonli javobni kiriting', 'Enter a numerical answer'),
  clear: b('Удалить', "O'chirish", 'Delete'),
  matchHint: b('Выберите карточку слева, затем её пару справа.', "Avval chapdagi kartani, keyin o'ngdagi juftini tanlang.", 'Choose a card on the left, then its match on the right.'),
  orderHint: b('Выберите место, затем карточку шага.', 'Avval joyni, keyin qadam kartasini tanlang.', 'Choose a position, then a step card.'),
  visualKey: b('Модель · шаг · результат', 'Model · qadam · natija', 'Model · step · result'),
};

const LESSON_META = {
  lessonId: 'num-4-22-practice', lessonTitle: UI.title, grade: 4, lessonNumber: 22,
  activityType: 'practice', taskCount: 10, resultIsUiState: true,
  progression: { green: 2, yellow: 5, red: 3 },
  topic: b('Дробная часть числа', 'Sonning kasr qismi', 'A fraction of a number'),
};

const SCREEN_META = [
  { id: 'practice-01', taskId: '01', template: 'multiple-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-02', taskId: '02', template: 'ordered-steps', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-03', taskId: '03', template: 'matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-04', taskId: '04', template: 'numeric-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-05', taskId: '05', template: 'numeric-blank', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-06', taskId: '06', template: 'word-problem-input', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-07', taskId: '07', template: 'result-matching', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-08', taskId: '08', template: 'boundary-choice', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-09', taskId: '09', template: 'error-analysis', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 'practice-10', taskId: '10', template: 'strategy-transfer', type: 'practice', scored: true, scope: 'final' },
];

const TASKS = [
  {
    id: '01', level: 'green', kind: 'mc', skillTag: 'unit_fraction',
    visual: { type: 'formula', main: b('3/10 от 80', '80 ning 3/10 qismi', '3/10 of 80'), note: b('Сначала найдите одну десятую.', "Avval o'ndan bir qismini toping.", 'Find one tenth first.') },
    setup: b('Число 80 нужно разделить на 10 равных долей и взять 3 доли.', '80 sonini 10 ta teng ulushga ajratib, 3 ta ulushini olish kerak.', 'Divide 80 into 10 equal shares and take 3 shares.'),
    prompt: b('Какое действие выполняют первым?', 'Birinchi qaysi amal bajariladi?', 'Which operation comes first?'),
    options: [
      option('divide-denominator', '80 ÷ 10', '80 ÷ 10', '80 ÷ 10', true),
      option('divide-numerator', '80 ÷ 3', '80 ÷ 3', '80 ÷ 3', false, 'Делить нужно на число равных долей — на 10.', "Teng ulushlar soniga, ya'ni 10 ga bo'lish kerak.", 'Divide by the number of equal shares, which is 10.'),
      option('multiply-denominator', '80 × 10', '80 × 10', '80 × 10', false, 'Умножение на 10 не находит одну десятую.', "10 ga ko'paytirish o'ndan bir qismini topmaydi.", 'Multiplying by 10 does not find one tenth.'),
      option('reverse-division', '10 ÷ 80', '10 ÷ 80', '10 ÷ 80', false, 'Целое 80 должно быть делимым.', "Butun 80 bo'linuvchi bo'lishi kerak.", 'The whole, 80, must be the dividend.'),
    ],
    secondHint: b('Знаменатель 10 показывает число равных долей.', '10 maxraj teng ulushlar sonini ko\'rsatadi.', 'The denominator 10 gives the number of equal shares.'),
    thirdHint: b('Для 2/7 от 56 первым действием было бы 56 ÷ 7.', '56 ning 2/7 qismi uchun birinchi amal 56 ÷ 7 bo\'ladi.', 'For 2/7 of 56, the first operation would be 56 ÷ 7.'),
    correctText: b('Верно. 80 ÷ 10 = 8 — это одна десятая.', "To'g'ri. 80 ÷ 10 = 8 — bu o'ndan bir qism.", 'Correct. 80 ÷ 10 = 8, which is one tenth.'),
    rule: b('Чтобы найти m/n числа, сначала делят число на n.', 'Sonning m/n qismini topish uchun avval son n ga bo\'linadi.', 'To find m/n of a number, first divide the number by n.'),
  },
  {
    id: '02', level: 'green', kind: 'order', skillTag: 'equal_groups',
    visual: { type: 'groups', groups: 9, groupSize: 5, selected: 2, main: b('45 предметов: 9 групп по 5', '45 ta buyum: 9 ta guruhda 5 tadan', '45 objects: 9 groups of 5'), note: b('Найдите 2/9.', '2/9 qismini toping.', 'Find 2/9.') },
    setup: b('45 предметов разделены на 9 равных групп. Нужно взять 2 группы.', '45 ta buyum 9 ta teng guruhga ajratilgan. 2 ta guruhni olish kerak.', '45 objects are divided into 9 equal groups. Take 2 groups.'),
    prompt: b('Расположите шаги решения по порядку.', 'Yechish qadamlarini tartib bilan joylashtiring.', 'Put the solution steps in order.'),
    steps: [
      { id: 's1', label: b('Шаг 1', '1-qadam', 'Step 1'), correct: 'divide' },
      { id: 's2', label: b('Шаг 2', '2-qadam', 'Step 2'), correct: 'unit' },
      { id: 's3', label: b('Шаг 3', '3-qadam', 'Step 3'), correct: 'multiply' },
      { id: 's4', label: b('Ответ', 'Javob', 'Answer'), correct: 'result' },
    ],
    cards: [
      { id: 'divide', text: b('45 ÷ 9', '45 ÷ 9', '45 ÷ 9') },
      { id: 'unit', text: b('= 5', '= 5', '= 5') },
      { id: 'multiply', text: b('5 × 2', '5 × 2', '5 × 2') },
      { id: 'result', text: b('= 10', '= 10', '= 10') },
    ],
    wrong: [b('Сначала найдите размер одной группы, затем возьмите две группы.', "Avval bitta guruhdagi sonni toping, keyin ikki guruhni oling.", 'Find the size of one group first, then take two groups.')],
    secondHint: b('Первое место занимает действие 45 ÷ 9.', 'Birinchi joyda 45 ÷ 9 amali turadi.', 'The first position is 45 ÷ 9.'),
    thirdHint: b('Цепочка имеет вид: целое ÷ знаменатель, затем × числитель.', "Zanjir: butun ÷ maxraj, so'ng × surat.", 'The chain is: whole ÷ denominator, then × numerator.'),
    correctText: b('Верно. 45 ÷ 9 = 5, затем 5 × 2 = 10.', "To'g'ri. 45 ÷ 9 = 5, keyin 5 × 2 = 10.", 'Correct. 45 ÷ 9 = 5, then 5 × 2 = 10.'),
    rule: b('Равные группы показывают, почему сначала выполняется деление.', "Teng guruhlar nima uchun avval bo'lish bajarilishini ko'rsatadi.", 'Equal groups show why division comes first.'),
  },
  {
    id: '03', level: 'yellow', kind: 'match', skillTag: 'fraction_model',
    visual: { type: 'cards', main: b('Три модели равных групп', 'Teng guruhlarning uchta modeli', 'Three equal-group models'), note: b('Сопоставьте модель и выбранную часть.', 'Model va tanlangan qismni moslashtiring.', 'Match each model to its selected part.') },
    setup: b('В каждой модели известно целое, число групп и число выбранных групп.', 'Har bir modelda butun, guruhlar soni va tanlangan guruhlar soni ma\'lum.', 'Each model gives a whole, a number of groups and a number of selected groups.'),
    prompt: b('Соедините модель с результатом.', 'Modelni natija bilan moslashtiring.', 'Match each model to its result.'),
    pairs: [
      { id: 'a', left: b('A · 45: 5 групп, выбраны 4', 'A · 45: 5 guruh, 4 tasi tanlangan', 'A · 45: 5 groups, 4 selected'), correctRight: '36' },
      { id: 'b', left: b('B · 70: 7 групп, выбраны 3', 'B · 70: 7 guruh, 3 tasi tanlangan', 'B · 70: 7 groups, 3 selected'), correctRight: '30' },
      { id: 'c', left: b('C · 16: 8 групп, выбраны 5', 'C · 16: 8 guruh, 5 tasi tanlangan', 'C · 16: 8 groups, 5 selected'), correctRight: '10' },
    ],
    right: [
      { id: '36', text: b('36', '36', '36') },
      { id: '30', text: b('30', '30', '30') },
      { id: '10', text: b('10', '10', '10') },
    ],
    wrong: [b('Для каждой модели сначала найдите размер одной группы.', 'Har bir model uchun avval bitta guruh miqdorini toping.', 'Find the size of one group in each model first.')],
    secondHint: b('В модели A одна группа равна 45 ÷ 5 = 9.', 'A modelida bitta guruh 45 ÷ 5 = 9 ga teng.', 'In model A, one group is 45 ÷ 5 = 9.'),
    thirdHint: b('A: 9 × 4; B: 10 × 3; C: 2 × 5.', 'A: 9 × 4; B: 10 × 3; C: 2 × 5.', 'A: 9 × 4; B: 10 × 3; C: 2 × 5.'),
    correctText: b('Верно. Получились 36, 30 и 10.', "To'g'ri. 36, 30 va 10 hosil bo'ldi.", 'Correct. The results are 36, 30 and 10.'),
    rule: b('Числитель показывает, сколько равных групп нужно взять.', 'Surat nechta teng guruhni olish kerakligini ko\'rsatadi.', 'The numerator tells how many equal groups to take.'),
  },
  {
    id: '04', level: 'yellow', kind: 'numpad', skillTag: 'fraction_of_number', answer: '49', maxLen: 2,
    visual: { type: 'formula', main: b('7/9 от 63', '63 ning 7/9 qismi', '7/9 of 63'), note: b('63 ÷ 9 × 7', '63 ÷ 9 × 7', '63 ÷ 9 × 7') },
    setup: b('63 разделили на 9 равных долей и взяли 7 долей.', '63 ni 9 ta teng ulushga ajratib, 7 ta ulushi olindi.', '63 is divided into 9 equal shares and 7 shares are taken.'),
    prompt: b('Введите результат.', 'Natijani kiriting.', 'Enter the result.'),
    wrong: [b('Проверьте оба шага: деление на 9 и умножение на 7.', "Ikkala qadamni tekshiring: 9 ga bo'lish va 7 ga ko'paytirish.", 'Check both steps: divide by 9 and multiply by 7.')],
    secondHint: b('63 ÷ 9 = 7.', '63 ÷ 9 = 7.', '63 ÷ 9 = 7.'),
    thirdHint: b('Теперь найдите 7 × 7.', 'Endi 7 × 7 ni toping.', 'Now find 7 × 7.'),
    correctText: b('Верно. 7/9 от 63 равно 49.', "To'g'ri. 63 ning 7/9 qismi 49 ga teng.", 'Correct. 7/9 of 63 is 49.'),
    rule: b('Результат двух шагов — искомая часть целого.', 'Ikki qadam natijasi butunning izlangan qismidir.', 'The result of the two steps is the required part of the whole.'),
  },
  {
    id: '05', level: 'yellow', kind: 'missing', skillTag: 'equal_groups', answer: '24', maxLen: 2,
    visual: { type: 'formula', main: b('66 ÷ 11 = 6; 6 × 4 = □', '66 ÷ 11 = 6; 6 × 4 = □', '66 ÷ 11 = 6; 6 × 4 = □'), note: b('Найдите 4/11 от 66.', '66 ning 4/11 qismini toping.', 'Find 4/11 of 66.') },
    setup: b('Одна одиннадцатая уже найдена: она равна 6.', "O'n birdan bir qism topilgan: u 6 ga teng.", 'One eleventh has already been found: it is 6.'),
    prompt: b('Заполните пустое место.', "Bo'sh joyni to'ldiring.", 'Fill the blank.'),
    wrong: [b('Нужно взять четыре найденные доли по 6.', 'Topilgan 6 lik ulushdan to\'rttasini olish kerak.', 'Take four of the shares of 6.')],
    secondHint: b('Второй шаг — 6 × 4.', 'Ikkinchi qadam — 6 × 4.', 'The second step is 6 × 4.'),
    thirdHint: b('6 + 6 + 6 + 6 = 24.', '6 + 6 + 6 + 6 = 24.', '6 + 6 + 6 + 6 = 24.'),
    correctText: b('Верно. 4/11 от 66 равно 24.', "To'g'ri. 66 ning 4/11 qismi 24 ga teng.", 'Correct. 4/11 of 66 is 24.'),
    rule: b('После нахождения одной доли умножьте её на числитель.', "Bitta ulushni topgach, uni suratga ko'paytiring.", 'After finding one share, multiply it by the numerator.'),
  },
  {
    id: '06', level: 'yellow', kind: 'numpad', skillTag: 'fraction_of_number', answer: '45', maxLen: 2,
    visual: { type: 'story', main: b('72 горшка · 5/8 с томатами', '72 ta tuvak · 5/8 qismiga pomidor', '72 pots · tomatoes in 5/8'), note: b('Сколько горшков использовано?', 'Nechta tuvak ishlatilgan?', 'How many pots are used?') },
    setup: b('Мадина посадила семена томатов в 5/8 от 72 горшков.', "Madina 72 ta tuvakning 5/8 qismiga pomidor urug'ini ekdi.", 'Madina planted tomato seeds in 5/8 of 72 pots.'),
    prompt: b('Введите число горшков.', 'Tuvaklar sonini kiriting.', 'Enter the number of pots.'),
    wrong: [b('Знаменатель делит 72 на группы, числитель выбирает пять групп.', 'Maxraj 72 ni guruhlarga ajratadi, surat beshta guruhni tanlaydi.', 'The denominator splits 72 into groups; the numerator selects five groups.')],
    secondHint: b('72 ÷ 8 = 9 горшков в одной доле.', '72 ÷ 8 = 9 ta tuvak bitta ulushda.', '72 ÷ 8 = 9 pots in one share.'),
    thirdHint: b('Найдите 9 × 5.', '9 × 5 ni toping.', 'Find 9 × 5.'),
    correctText: b('Верно. Мадина использовала 45 горшков.', "To'g'ri. Madina 45 ta tuvakdan foydalandi.", 'Correct. Madina used 45 pots.'),
    rule: b('В задаче целое и дробь известны, поэтому ищут часть.', 'Masalada butun va kasr ma\'lum, shuning uchun qism topiladi.', 'The whole and the fraction are known, so the part is found.'),
  },
  {
    id: '07', level: 'yellow', kind: 'match', skillTag: 'fraction_result_matching',
    visual: { type: 'cards', main: b('Три выражения — три результата', 'Uchta ifoda — uchta natija', 'Three expressions — three results'), note: b('Сначала делите, затем умножайте.', "Avval bo'ling, keyin ko'paytiring.", 'Divide first, then multiply.') },
    setup: b('Каждое выражение находит дробную часть числа.', 'Har bir ifoda sonning kasr qismini topadi.', 'Each expression finds a fraction of a number.'),
    prompt: b('Соедините выражение с результатом.', 'Ifodani natija bilan moslashtiring.', 'Match each expression to its result.'),
    pairs: [
      { id: 'a', left: b('2/3 от 33', '33 ning 2/3 qismi', '2/3 of 33'), correctRight: '22' },
      { id: 'b', left: b('3/4 от 44', '44 ning 3/4 qismi', '3/4 of 44'), correctRight: '33' },
      { id: 'c', left: b('5/6 от 48', '48 ning 5/6 qismi', '5/6 of 48'), correctRight: '40' },
    ],
    right: [
      { id: '22', text: b('22', '22', '22') },
      { id: '33', text: b('33', '33', '33') },
      { id: '40', text: b('40', '40', '40') },
    ],
    wrong: [b('Не меняйте порядок знаменателя и числителя.', 'Maxraj va surat vazifalarining o\'rnini almashtirmang.', 'Do not swap the roles of the denominator and numerator.')],
    secondHint: b('33 ÷ 3 × 2; 44 ÷ 4 × 3; 48 ÷ 6 × 5.', '33 ÷ 3 × 2; 44 ÷ 4 × 3; 48 ÷ 6 × 5.', '33 ÷ 3 × 2; 44 ÷ 4 × 3; 48 ÷ 6 × 5.'),
    thirdHint: b('Промежуточные результаты: 11, 11 и 8.', 'Oraliq natijalar: 11, 11 va 8.', 'The intermediate results are 11, 11 and 8.'),
    correctText: b('Верно. Пары: 22, 33 и 40.', "To'g'ri. Juftlar: 22, 33 va 40.", 'Correct. The matches are 22, 33 and 40.'),
    rule: b('Одинаковый алгоритм работает с разными целыми и дробями.', 'Bir xil algoritm turli butunlar va kasrlarda ishlaydi.', 'The same algorithm works with different wholes and fractions.'),
  },
  {
    id: '08', level: 'red', kind: 'mc', skillTag: 'whole_fraction',
    visual: { type: 'groups', groups: 9, groupSize: 9, selected: 9, main: b('9/9 от 81', '81 ning 9/9 qismi', '9/9 of 81'), note: b('Выбраны все девять долей.', 'To\'qqiz ulushning barchasi tanlangan.', 'All nine shares are selected.') },
    setup: b('Дробь 9/9 обозначает всё целое.', '9/9 kasr butunning barchasini bildiradi.', 'The fraction 9/9 represents the whole.'),
    prompt: b('Чему равно 9/9 от 81?', '81 ning 9/9 qismi nechaga teng?', 'What is 9/9 of 81?'),
    options: [
      option('whole', '81', '81', '81', true),
      option('one-share', '9', '9', '9', false, '9 — это только одна девятая от 81.', "9 — bu 81 ning faqat to'qqizdan bir qismi.", '9 is only one ninth of 81.'),
      option('product', '729', '729', '729', false, 'Нужно взять часть 81, а не увеличить число в девять раз.', "81 ning qismini olish kerak, sonni to'qqiz marta oshirish emas.", 'Take a part of 81 rather than making it nine times as large.'),
      option('zero', '0', '0', '0', false, 'Выбраны все доли, а не ни одной.', 'Barcha ulushlar tanlangan, birortasi ham tanlanmagan emas.', 'All shares are selected, not none of them.'),
    ],
    secondHint: b('Если числитель равен знаменателю, дробь равна единице.', 'Surat maxrajga teng bo\'lsa, kasr birga teng.', 'When numerator equals denominator, the fraction equals one.'),
    thirdHint: b('81 ÷ 9 = 9, затем 9 × 9 возвращает 81.', '81 ÷ 9 = 9, keyin 9 × 9 yana 81 ni beradi.', '81 ÷ 9 = 9, then 9 × 9 returns 81.'),
    correctText: b('Верно. 9/9 от 81 — это все 81.', "To'g'ri. 81 ning 9/9 qismi — 81 ning o'zi.", 'Correct. 9/9 of 81 is all 81.'),
    rule: b('Дробь n/n от числа равна самому числу.', 'Sonning n/n qismi shu sonning o\'ziga teng.', 'n/n of a number equals the number itself.'),
  },
  {
    id: '09', level: 'red', kind: 'mc', skillTag: 'operation_order',
    visual: { type: 'formula', main: b('Ошибочно: 96 ÷ 3 × 8 = 256', 'Xato: 96 ÷ 3 × 8 = 256', 'Incorrect: 96 ÷ 3 × 8 = 256'), note: b('Нужно найти 3/8 от 96.', '96 ning 3/8 qismini topish kerak.', 'The goal is to find 3/8 of 96.') },
    setup: b('В решении перепутали роли числителя и знаменателя.', 'Yechimda surat bilan maxraj vazifalari almashtirib yuborilgan.', 'The solution swapped the roles of the numerator and denominator.'),
    prompt: b('Как исправить решение?', 'Yechim qanday tuzatiladi?', 'How should the solution be corrected?'),
    options: [
      option('repair', '96 ÷ 8 × 3 = 36', '96 ÷ 8 × 3 = 36', '96 ÷ 8 × 3 = 36', true),
      option('keep', '96 ÷ 3 × 8 = 256', '96 ÷ 3 × 8 = 256', '96 ÷ 3 × 8 = 256', false, 'Сначала нужно делить на знаменатель 8.', "Avval maxraj 8 ga bo'lish kerak.", 'Divide by the denominator 8 first.'),
      option('stop', '96 ÷ 8 = 12', '96 ÷ 8 = 12', '96 ÷ 8 = 12', false, '12 — одна восьмая; нужны три такие доли.', '12 — sakkizdan bir qism; shunday uchta ulush kerak.', '12 is one eighth; three such shares are needed.'),
      option('multiply-only', '96 × 3 = 288', '96 × 3 = 288', '96 × 3 = 288', false, 'Умножение без деления не создаёт восьмые доли.', "Bo'lishsiz ko'paytirish sakkizdan bir ulushlarni hosil qilmaydi.", 'Multiplication without division does not create eighths.'),
    ],
    secondHint: b('В записи 3/8 число 8 отвечает за равные доли.', '3/8 yozuvida 8 teng ulushlar sonini bildiradi.', 'In 3/8, the 8 gives the number of equal shares.'),
    thirdHint: b('Правильный порядок: 96 ÷ 8, затем результат × 3.', "To'g'ri tartib: 96 ÷ 8, keyin natija × 3.", 'The correct order is 96 ÷ 8, then multiply the result by 3.'),
    correctText: b('Верно. 96 ÷ 8 = 12 и 12 × 3 = 36.', "To'g'ri. 96 ÷ 8 = 12 va 12 × 3 = 36.", 'Correct. 96 ÷ 8 = 12 and 12 × 3 = 36.'),
    rule: b('Знаменатель задаёт деление, числитель — число взятых долей.', 'Maxraj bo\'lishni, surat esa olinadigan ulushlar sonini belgilaydi.', 'The denominator sets the division; the numerator sets how many shares to take.'),
  },
  {
    id: '10', level: 'red', kind: 'mc', skillTag: 'inverse_check',
    visual: { type: 'story', main: b('84 архивные карточки · отметить 5/12', '84 ta arxiv kartasi · 5/12 qismini belgilash', '84 archive cards · mark 5/12'), note: b('Выберите решение с проверкой смысла.', "Ma'nosi tekshirilgan yechimni tanlang.", 'Choose the solution whose meaning is checked.') },
    setup: b('Зайнаб должна отметить 5/12 от 84 архивных карточек.', 'Zaynab 84 ta arxiv kartasining 5/12 qismini belgilashi kerak.', 'Zaynab must mark 5/12 of 84 archive cards.'),
    prompt: b('Какая стратегия верна?', "Qaysi strategiya to'g'ri?", 'Which strategy is correct?'),
    options: [
      option('strategy', '84 ÷ 12 = 7; 7 × 5 = 35. Ответ меньше 84.', '84 ÷ 12 = 7; 7 × 5 = 35. Javob 84 dan kichik.', '84 ÷ 12 = 7; 7 × 5 = 35. The answer is less than 84.', true),
      option('unit-only', '84 ÷ 12 = 7. Ответ 7.', '84 ÷ 12 = 7. Javob 7.', '84 ÷ 12 = 7. The answer is 7.', false, '7 — одна двенадцатая, а нужны пять долей.', "7 — o'n ikkidan bir qism, beshta ulush kerak.", '7 is one twelfth, but five shares are needed.'),
      option('reversed', '84 ÷ 5 × 12', '84 ÷ 5 × 12', '84 ÷ 5 × 12', false, 'Делить нужно на знаменатель 12, а не на числитель 5.', "Maxraj 12 ga bo'lish kerak, surat 5 ga emas.", 'Divide by the denominator 12, not the numerator 5.'),
      option('oversize', '84 × 5 = 420', '84 × 5 = 420', '84 × 5 = 420', false, 'Правильная часть меньше целого 84.', "To'g'ri qism 84 butundan kichik bo'ladi.", 'A proper fraction of 84 is less than the whole 84.'),
    ],
    secondHint: b('Сначала найдите 1/12 от 84, затем возьмите пять таких долей.', "Avval 84 ning 1/12 qismini toping, keyin shunday beshta ulushni oling.", 'Find 1/12 of 84 first, then take five such shares.'),
    thirdHint: b('Одна доля равна 7; пять долей равны 35.', 'Bitta ulush 7; beshta ulush 35 ga teng.', 'One share is 7; five shares are 35.'),
    correctText: b('Верно. Зайнаб отметит 35 карточек.', "To'g'ri. Zaynab 35 ta kartani belgilaydi.", 'Correct. Zaynab will mark 35 cards.'),
    rule: b('Проверка величины помогает отвергнуть ответ, который больше целого.', 'Miqdorni tekshirish butundan katta javobni rad etishga yordam beradi.', 'A magnitude check helps reject an answer larger than the whole.'),
  },
];

function TaskVisual({ visual, lang }) {
  const groupItems = visual.type === 'groups'
    ? Array.from({ length: Math.min(visual.groups, 12) }, (_, index) => index)
    : [];
  return <div className={`p4-visual p4-visual-${visual.type}`}>
    <span className="p4-visual-key">{tx(UI.visualKey, lang)}</span>
    <strong className="p4-visual-main">{tx(visual.main, lang)}</strong>
    {visual.type === 'groups' && <div className="p4-groups" aria-hidden="true">
      {groupItems.map((item) => <span key={item} className={item < visual.selected ? 'is-selected' : ''}>{visual.groupSize}</span>)}
    </div>}
    <p>{tx(visual.note, lang)}</p>
  </div>;
}

function ChoiceInput({ task, lang, runSeed, wrongRound, pickedId, setPickedId, checked, correct, locked }) {
  // Urug'ga `wrongRound` kiradi: har xato javobdan keyin tartib boshqa bo'ladi.
  const options = useMemo(() => shuffle(task.options, `${task.id}:${runSeed}:${wrongRound}`), [task.options, task.id, runSeed, wrongRound]);
  return <div className="p4-options" role="group" aria-label={tx(task.prompt, lang)}>
    {options.map((item, index) => {
      const state = checked && pickedId === item.id ? (correct ? 'ok' : 'no') : (pickedId === item.id ? 'on' : '');
      return <button key={item.id} type="button" className={`p4-option ${state ? `is-${state}` : ''}`} aria-pressed={pickedId === item.id} disabled={locked} onClick={() => setPickedId(item.id)}>
        <span className="p4-letter" aria-hidden="true">{'ABCD'[index]}</span>
        <span>{tx(item.text, lang)}</span>
      </button>;
    })}
  </div>;
}

function NumberInput({ task, lang, typed, setTyped, locked }) {
  const append = (digit) => setTyped((value) => value.length < (task.maxLen ?? 4) ? `${value}${digit}` : value);
  return <div className="p4-pad">
    <div className="p4-number-display" role="status" aria-label={tx(UI.typeAnswer, lang)}>{typed || '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <button key={digit} type="button" disabled={locked} onClick={() => append(digit)}>{digit}</button>)}
      <button type="button" className="p4-key-del" disabled={locked || !typed} onClick={() => setTyped((value) => value.slice(0, -1))} aria-label={tx(UI.clear, lang)}>⌫</button>
    </div>
  </div>;
}

function MatchInput({ task, lang, runSeed, pairs, setPairs, activeLeft, setActiveLeft, locked }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- yangi tartib ataylab: qayta boshlash va topshiriq kalitlari aralashtirishni chaqiradi
  const right = useMemo(() => matchSpread(task.right, (card, row) => card.id === task.pairs[row]?.correctRight), [task.right, task.id, runSeed]);
  return <div>
    <p className="p4-interaction-hint">{tx(UI.matchHint, lang)}</p>
    <div className="p4-match">
      <div className="p4-match-col">
        {task.pairs.map((pair) => <button key={pair.id} type="button" className={`${activeLeft === pair.id ? 'is-active' : pairs[pair.id] ? 'is-filled' : ''}${matchToneLeft(task, pairs, pair.id)}`} disabled={locked} onClick={() => setActiveLeft(pair.id)}>{tx(pair.left, lang)}{pairs[pair.id] ? <small>✓</small> : null}</button>)}
      </div>
      <div className="p4-match-col">
        {right.map((item) => <button key={item.id} type="button" className={`${matchToneRight(task, pairs, item.id)}`} disabled={locked || !activeLeft} onClick={() => {
          if (!activeLeft) return;
          setPairs((value) => matchTie(value, activeLeft, item.id));
          setActiveLeft(null);
        }}>{tx(item.text, lang)}</button>)}
      </div>
    </div>
  </div>;
}

function OrderInput({ task, lang, runSeed, placed, setPlaced, activeStep, setActiveStep, locked }) {
  const cards = useMemo(() => shuffle(task.cards, `${task.id}:${runSeed}`), [task.cards, task.id, runSeed]);
  const used = new Set(Object.values(placed));
  return <div>
    <p className="p4-interaction-hint">{tx(UI.orderHint, lang)}</p>
    <div className="p4-order-slots">
      {task.steps.map((step) => {
        const card = task.cards.find((item) => item.id === placed[step.id]);
        return <button key={step.id} type="button" className={activeStep === step.id ? 'is-active' : card ? 'is-filled' : ''} disabled={locked} onClick={() => setActiveStep(step.id)}><small>{tx(step.label, lang)}</small><strong>{card ? tx(card.text, lang) : '…'}</strong></button>;
      })}
    </div>
    <div className="p4-card-bank">
      {cards.map((card) => <button key={card.id} type="button" disabled={locked || !activeStep || (used.has(card.id) && placed[activeStep] !== card.id)} onClick={() => {
        if (!activeStep) return;
        setPlaced((value) => ({ ...value, [activeStep]: card.id }));
        setActiveStep(null);
      }}>{tx(card.text, lang)}</button>)}
    </div>
  </div>;
}

function Feedback({ task, lang, correct, attempts, picked }) {
  const pickedOption = task.options?.find((item) => item.id === picked);
  const wrongText = attempts >= 3 ? task.thirdHint : attempts >= 2 ? task.secondHint : (pickedOption?.wrong || task.wrong?.[0] || task.secondHint);
  return <div className={`p4-feedback p4-fb ${correct ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite" aria-atomic="true">
    <p className="p4-fb-txt"><strong>{correct ? tx(task.correctText, lang) : tx(wrongText, lang)}</strong></p>
    {correct && <p className="p4-rule"><b>{tx(UI.remember, lang)}:</b> {tx(task.rule, lang)}</p>}
  </div>;
}

// `platform` berilganda tugma qatori chizilmaydi: uni LMS o'zi beradi va
// tekshiruvni `registerCheck` orqali chaqiradi (LMS kontrakti).
function PracticeTask({ task, index, lang, runSeed, onSolved ,
  platform = false, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,
}) {
  const [pickedId, setPickedId] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [placed, setPlaced] = useState({});
  const [activeStep, setActiveStep] = useState(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (checked) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [checked, attempts]);

  const responseReady = task.kind === 'mc' || task.kind === 'card'
    ? pickedId !== null
    : task.kind === 'numpad' || task.kind === 'missing'
      ? typed !== ''
      : task.kind === 'match'
        ? Object.keys(pairs).length === task.pairs.length
        : Object.keys(placed).length === task.steps.length;

  const responseCorrect = () => {
    if (task.kind === 'mc' || task.kind === 'card') return task.options.find((item) => item.id === pickedId)?.correct === true;
    if (task.kind === 'numpad' || task.kind === 'missing') return typed === String(task.answer);
    if (task.kind === 'match') return task.pairs.every((pair) => pairs[pair.id] === pair.correctRight);
    return task.steps.every((step) => placed[step.id] === step.correct);
  };

  const resetResponse = () => {
    setPickedId(null); setTyped(''); setPairs({}); setActiveLeft(null); setPlaced({}); setActiveStep(null); setChecked(false);
  };

  const check = () => {
    if (!responseReady || solved) return;
    const nextAttempts = attempts + 1;
    const correct = responseCorrect();
    setAttempts(nextAttempts); setChecked(true);
    if (correct) setSolved(true); else setWrongRound((old) => old + 1);
  };

  const answerSnapshot = () => {
    if (task.kind === 'mc' || task.kind === 'card') {
      const chosen = task.options.find((item) => item.id === pickedId);
      const correct = task.options.find((item) => item.correct);
      return { studentAnswerId: pickedId, studentAnswer: tx(chosen?.text, lang), correctAnswerId: correct?.id, correctAnswer: tx(correct?.text, lang) };
    }
    if (task.kind === 'numpad' || task.kind === 'missing') return { studentAnswer: typed, correctAnswer: String(task.answer) };
    if (task.kind === 'match') return { studentAnswer: { ...pairs }, correctAnswer: Object.fromEntries(task.pairs.map((pair) => [pair.id, pair.correctRight])) };
    return { studentAnswer: { ...placed }, correctAnswer: Object.fromEntries(task.steps.map((step) => [step.id, step.correct])) };
  };

  const advance = () => {
    if (!solved || advancedRef.current) return;
    advancedRef.current = true;
    onSolved({
      taskId: task.id, screenId: SCREEN_META[index].id, level: task.level, kind: task.kind,
      skillTag: task.skillTag, correct: true, attempts, firstTry: attempts === 1,
      setup: task.setup, prompt: task.prompt, ...answerSnapshot(),
      choices: task.options?.map((item) => ({ id: item.id, text: item.text, correct: item.correct })) ?? null,
      screenMeta: SCREEN_META[index],
    });
  };

  // --- LMS platforma kontrakti ------------------------------------------
  // Mexanikaga tegilmaydi: natija mavjud holatlardan o'qiladi.
  useEffect(() => { onReady?.(Boolean(responseReady) && !solved && mode !== 'review'); },
    [responseReady, solved, mode, onReady]);
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
  return <section className="p4-card" aria-labelledby={`p4-task-${task.id}`}>
    <div className="p4-task-top"><span aria-label={`${tx(UI.task, lang)} ${index + 1}/10`}>{index + 1}/10</span><span className={`p4-level is-${task.level}`}>{tx(UI.level[task.level], lang)}</span></div>
    <h2 id={`p4-task-${task.id}`}>{tx(task.prompt, lang)}</h2>
    <p className="p4-setup">{tx(task.setup, lang)}</p>
    <TaskVisual visual={task.visual} lang={lang} />
    {(task.kind === 'mc' || task.kind === 'card') && <ChoiceInput task={task} lang={lang} runSeed={runSeed} wrongRound={wrongRound} pickedId={pickedId} setPickedId={(value) => { setPickedId(value); setChecked(false); }} checked={checked} correct={solved} locked={solved} />}
    {(task.kind === 'numpad' || task.kind === 'missing') && <NumberInput task={task} lang={lang} typed={typed} setTyped={(value) => { setTyped(value); setChecked(false); }} locked={solved} />}
    {task.kind === 'match' && <MatchInput task={task} lang={lang} runSeed={runSeed} pairs={pairs} setPairs={(value) => { setPairs(value); setChecked(false); }} activeLeft={activeLeft} setActiveLeft={setActiveLeft} locked={solved} />}
    {task.kind === 'order' && <OrderInput task={task} lang={lang} runSeed={runSeed} placed={placed} setPlaced={(value) => { setPlaced(value); setChecked(false); }} activeStep={activeStep} setActiveStep={setActiveStep} locked={solved} />}
    {checked && <div ref={feedbackRef}><Feedback task={task} lang={lang} correct={solved} attempts={attempts} picked={pickedId} /></div>}
    {!platform && <div className="p4-actions">
      {!solved && !checked && <button type="button" className="p4-btn" disabled={!responseReady} onClick={check}>{tx(UI.check, lang)}</button>}
      {!solved && checked && <button type="button" className="p4-btn p4-btn-ghost" onClick={resetResponse}>{tx(UI.retry, lang)}</button>}
      {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={advance}>{index === 9 ? tx(UI.finish, lang) : tx(UI.next, lang)}</button>}
    </div>}
  </section>;
}

function ResultScreen({ lang, firstTryCorrect, onRestart }) {
  return <section className="p4-card p4-done" role="status" aria-live="polite">
    <div className="p4-result-mark" aria-hidden="true">10/10</div>
    <h2>{tx(UI.done, lang)}</h2>
    <p>{tx(UI.allSolved, lang)}</p>
    <strong>{firstTryCorrect}/10 — {tx(UI.firstTry, lang)}</strong>
    <button type="button" className="p4-btn p4-btn-ready" onClick={onRestart}>{tx(UI.again, lang)}</button>
  </section>;
}

export default function Grade4Dars22Practice({ studentName, lang: langProp, onFinished }) {
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(langProp ?? previewLang);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const finishedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!startedAtRef.current) startedAtRef.current = Date.now();
  }, []);

  const completeTask = (record) => {
    if (finishedRef.current) return;
    const nextAnswers = [...answers, record];
    const nextFirstTry = firstTryCorrect + (record.firstTry ? 1 : 0);
    setAnswers(nextAnswers);
    setFirstTryCorrect(nextFirstTry);
    if (index < TASKS.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    finishedRef.current = true;
    setFinished(true);
    // Completion is a user-event boundary; reading the wall clock here is intentional.
    // eslint-disable-next-line react-hooks/purity
    const durationSec = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
    const attemptsTotal = nextAnswers.reduce((sum, item) => sum + item.attempts, 0);
    const levelBreakdown = Object.fromEntries(['green', 'yellow', 'red'].map((level) => {
      const rows = nextAnswers.filter((item) => item.level === level);
      const firstTry = rows.filter((item) => item.firstTry).length;
      return [level, { total: rows.length, solved: rows.filter((item) => item.correct).length, firstTry, firstTryCorrect: firstTry, attempts: rows.reduce((sum, item) => sum + item.attempts, 0) }];
    }));
    const scorePercent = Math.round((nextFirstTry / TASKS.length) * 100);
    onFinished?.({
      lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), lessonTitleLocalized: LESSON_META.lessonTitle,
      studentName: studentName ?? null, grade: LESSON_META.grade, lessonNumber: LESSON_META.lessonNumber,
      activityType: LESSON_META.activityType, lang, assessment: true, completed: true,
      totalQuestions: TASKS.length, answeredQuestions: nextAnswers.length, correctAnswers: nextFirstTry,
      firstTryCorrect: nextFirstTry, scorePercent, finalScore: nextFirstTry, finalTotal: TASKS.length,
      passed: nextFirstTry >= 6, firstTryStats: { total: TASKS.length, firstTryCorrect: nextFirstTry, correct: nextFirstTry, answered: nextAnswers.length, scorePercent },
      attemptsTotal, durationSec, skillTags: [...new Set(TASKS.map((task) => task.skillTag))],
      levelBreakdown, lessonMeta: LESSON_META, screenMeta: SCREEN_META, answers: nextAnswers,
    });
  };

  const restart = () => {
    finishedRef.current = false; startedAtRef.current = Date.now(); setIndex(0); setAnswers([]); setFirstTryCorrect(0); setFinished(false); setRunId((value) => value + 1);
  };

  return <div className="p4-root">
    <style>{CSS}</style>
    <main className="p4-main">
      <header className="p4-header">
        <div><span className="p4-kicker">4 · 22</span><h1>{tx(UI.title, lang)}</h1></div>
        {langProp === undefined && <div className="p4-lang" role="group" aria-label={tx(UI.language, lang)}>
          {SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={lang === code ? 'is-active' : ''} aria-pressed={lang === code} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}
        </div>}
      </header>
      <div className="p4-progress" role="progressbar" aria-valuemin="1" aria-valuemax="10" aria-valuenow={finished ? 10 : index + 1}><i style={{ width: `${finished ? 100 : (index + 1) * 10}%` }} /></div>
      {finished ? <ResultScreen lang={lang} firstTryCorrect={firstTryCorrect} onRestart={restart} /> : <PracticeTask key={`${runId}-${TASKS[index].id}`} task={TASKS[index]} index={index} lang={lang} runSeed={runId} onSolved={completeTask} />}
    </main>
  </div>;
}

const CSS = `
.p4-root{position:relative;min-height:100dvh;overflow-x:clip;padding:46px 0 16px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}
.p4-root button,.p4-root select{min-width:44px;min-height:44px}
.p4-main{width:min(100%,720px);margin:0 auto;padding:0 clamp(12px,4vw,24px)}
.p4-header{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:8px}
.p4-header>div{min-width:0}
.p4-header h1{margin:4px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(16px,2.4vw,20px);line-height:1.2}
.p4-kicker{display:inline-flex;padding:3px 8px;border-radius:99px;background:${T.accentSoft};color:${T.accent};font:800 10px 'JetBrains Mono',monospace}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}
.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font:800 11px 'Manrope',system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}
.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-progress{height:6px;margin-bottom:10px;overflow:hidden;border-radius:99px;background:rgba(23,59,82,.12)}
.p4-progress i{display:block;height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}
.p4-card{display:flex;flex-direction:column;gap:9px;width:100%;padding:0;border:0;background:transparent;box-shadow:none}
.p4-task-top{display:flex;align-items:center;justify-content:space-between;gap:10px;color:${T.accent};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.p4-level{padding:0;border:0;border-radius:0;background:transparent;color:${T.accent}}
.p4-card h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}
.p4-setup{margin:0;color:${T.ink2};font-size:clamp(13px,2vw,15px);line-height:1.45}
.p4-visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;min-height:96px;padding:12px 10px;overflow:hidden;border:0;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08);text-align:center}
.p4-visual-key{color:${T.cyan};font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.p4-visual-main{color:${T.navy};font:800 clamp(18px,3.5vw,27px) 'JetBrains Mono',monospace}
.p4-visual p{margin:0;color:${T.ink2};font-size:12px;line-height:1.35}
.p4-groups{display:flex;flex-wrap:wrap;justify-content:center;gap:5px}
.p4-groups span{display:grid;place-items:center;min-width:34px;height:34px;border:0;border-radius:10px;background:${T.cyanSoft};color:${T.navy};font:800 12px 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 1px rgba(22,143,163,.18)}
.p4-groups span.is-selected{background:${T.accentSoft};color:${T.accent};box-shadow:inset 0 0 0 1.5px rgba(255,91,53,.34)}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};color:${T.ink};font:700 clamp(13px,1.9vw,15px)/1.35 'Manrope',system-ui,sans-serif;text-align:left;cursor:pointer;transition:transform .16s,border-color .2s,background .2s}
.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}
.p4-option:disabled{cursor:default}
.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}
.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}
.p4-option.is-ok .p4-letter{background:${T.success};color:#fff}
.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-option.is-no .p4-letter{background:${T.warn};color:#fff}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:7px;width:min(240px,100%);margin:0 auto;padding:10px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8);box-shadow:inset 0 1px rgba(255,255,255,.9)}
.p4-number-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};color:${T.navy};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;letter-spacing:2px}
.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}
.p4-pad-keys button{min-width:44px;min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(17px,3.6vw,21px) 'JetBrains Mono',monospace;cursor:pointer}
.p4-pad-keys button:hover:not(:disabled){border-color:${T.cyan}}
.p4-pad-keys .p4-key-del{grid-column:span 3;background:${T.accentSoft};color:${T.accent}}
.p4-interaction-hint{margin:0;color:${T.ink3};font-size:12px;line-height:1.35;text-align:center}
.p4-match{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.p4-match-col{display:flex;flex-direction:column;gap:7px}
.p4-match button{display:flex;align-items:center;justify-content:space-between;gap:6px;min-height:46px;padding:7px 9px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(11px,2vw,14px)/1.25 'Manrope',system-ui,sans-serif;text-align:left;cursor:pointer}
.p4-match button.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-match button.is-filled{border-color:rgba(34,122,83,.35);background:${T.successSoft}}
.p4-match small{color:${T.success};font-size:13px}
.p4-order-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.p4-order-slots button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:68px;padding:6px;border:1px solid rgba(23,59,82,.12);border-radius:13px;background:${T.paper};color:${T.ink2};font-family:'Manrope',system-ui,sans-serif;cursor:pointer}
.p4-order-slots button.is-active{border-color:${T.accent};background:${T.accentSoft}}
.p4-order-slots button.is-filled{border-color:rgba(34,122,83,.35);background:${T.successSoft}}
.p4-order-slots small{font-size:10px;font-weight:800}
.p4-order-slots strong{color:${T.navy};font:800 12px/1.25 'JetBrains Mono',monospace}
.p4-card-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-top:7px}
.p4-card-bank button{min-width:88px;min-height:44px;padding:7px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 12px 'JetBrains Mono',monospace;cursor:pointer;box-shadow:0 5px 14px -12px rgba(23,59,82,.7)}
.p4-card-bank button:hover:not(:disabled){border-color:${T.cyan}}
button:disabled{opacity:.48;cursor:not-allowed;transform:none!important}
.p4-fb{padding:12px 14px;border-radius:14px}
.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}
.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}
.p4-fb-txt{margin:0;font:clamp(14px,2.1vw,16px)/1.45 'Source Serif 4',Georgia,serif}
.p4-fb.is-ok .p4-fb-txt{color:#1B6644}
.p4-fb.is-no .p4-fb-txt{color:#8A5C10}
.p4-rule{margin:8px 0 0;color:${T.ink2};font:13px/1.4 'Manrope',system-ui,sans-serif}
.p4-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.p4-btn{min-width:44px;min-height:46px;padding:9px 20px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font:800 14px 'Manrope',system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}
.p4-btn:disabled{opacity:.45;box-shadow:none}
.p4-btn-ready{background:${T.accent};color:#fff}
.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}
.p4-root button:focus-visible,.p4-root select:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-done{align-items:center;gap:9px;padding:20px 12px;text-align:center}
.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(19px,3vw,24px)}
.p4-done p{margin:0;color:${T.ink2}}
.p4-result-mark{color:${T.success};font:800 clamp(32px,7vw,44px) 'JetBrains Mono',monospace}
.p4-strip{display:grid;grid-template-columns:repeat(10,minmax(18px,1fr));gap:4px;width:min(100%,520px)}
.p4-strip i{height:34px;border:0;border-radius:8px;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(22,143,163,.18)}
.p4-strip i.is-filled{background:${T.cyan};box-shadow:inset 0 0 0 1px rgba(23,59,82,.12)}
.p4-place-chart{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px;width:min(100%,620px)}
.p4-place-chart>div{display:grid;gap:4px;padding:7px;border-radius:12px;background:#FBFBF8;box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}
.p4-place-chart small{min-height:2em;color:${T.ink3};font-size:9px;font-weight:700}
.p4-place-chart b{display:grid;place-items:center;min-height:38px;border-radius:10px;background:${T.paper};color:${T.navy};font:800 20px 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 1.5px rgba(23,59,82,.14)}
@media(max-width:520px){
  .p4-root{padding:42px 0 8px}
  .p4-main{padding:0 7px}
  .p4-header{align-items:center;gap:6px;margin-bottom:5px}
  .p4-header h1{font-size:15px;line-height:1.1}
  .p4-kicker{display:none}
  .p4-lang{top:4px;right:4px;gap:4px}
  .p4-progress{margin-bottom:6px}
  .p4-card{gap:5px}
  .p4-card h2{font-size:15px;line-height:1.15}
  .p4-setup{font-size:11px;line-height:1.2}
  .p4-task-top{font-size:9px}
  .p4-visual{min-height:70px;gap:3px;padding:7px 6px}
  .p4-visual-key{font-size:8px}
  .p4-visual-main{font-size:14px}
  .p4-visual p{font-size:10px;line-height:1.15}
  .p4-groups{gap:3px}
  .p4-groups span{min-width:27px;height:27px;font-size:10px}
  .p4-options{grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}
  .p4-option{min-height:44px;padding:4px 6px;font-size:11px;line-height:1.15}
  .p4-interaction-hint{display:none}
  .p4-match{gap:5px}
  .p4-match-col{gap:3px}
  .p4-match button{min-height:44px;padding:4px 5px;font-size:10px}
  .p4-order-slots{gap:3px}
  .p4-order-slots button{min-height:50px;padding:3px}
  .p4-order-slots small{font-size:8px}
  .p4-order-slots strong{font-size:10px}
  .p4-card-bank{gap:4px;margin-top:3px}
  .p4-card-bank button{min-width:68px;padding:4px;font-size:10px}
  .p4-pad{width:min(320px,100%);gap:5px;padding:6px}
  .p4-number-display{min-height:44px;font-size:21px}
  .p4-pad-keys{grid-template-columns:repeat(5,1fr);gap:4px}
  .p4-pad-keys button{font-size:17px}
  .p4-pad-keys .p4-key-del{grid-column:span 5}
  .p4-fb{padding:7px 9px}
  .p4-fb-txt{font-size:11px;line-height:1.25}
  .p4-rule{margin-top:3px;font-size:10px;line-height:1.25}
  .p4-btn{min-height:44px;padding:7px 14px;font-size:12px}
  .p4-done{padding:20px 8px}
  .p4-strip i{height:25px}
  .p4-place-chart{grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:3px}
  .p4-place-chart>div{gap:2px;padding:3px}
  .p4-place-chart small{font-size:8px}
  .p4-place-chart b{min-height:29px;font-size:15px}
}
@media(prefers-reduced-motion:reduce){
  .p4-root *,.p4-root *::before,.p4-root *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}
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
